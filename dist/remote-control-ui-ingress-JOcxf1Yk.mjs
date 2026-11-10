import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import { t as GATEWAY_OWNER_PROFILE_ID } from "./user-profile-constants-DfyZS95p.mjs";
import { f as isOperatorScope } from "./operator-scopes-BO7_XQCg.mjs";
import { n as isRedactedSecretValue } from "./redact-sentinel-f_PhnHTI.mjs";
import { t as intersectOperatorScopes } from "./operator-scope-compat-Ci6GBcmU.mjs";
import "./version-CwNT1gaY.mjs";
import { c as projectUserProfileDisplay } from "./user-profiles-internal-CBUpoSHj.mjs";
import { l as prepareUserProfileIdentity, t as captureResidentUserProfileAccess } from "./user-profile-list-BdNJnrJe.mjs";
import { p as resolveOperatorRolePolicyForAssignment } from "./operator-role-policy-Coro3qc5.mjs";
import { t as MAX_PAYLOAD_BYTES } from "./payload-limits-ChDi8AHf.mjs";
import { s as markGatewayIngressTransport } from "./ingress-attribution-CP_2XS9r.mjs";
import { r as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BcrXDfhQ.mjs";
import { o as resolveGatewayOperatorAccessAuthority } from "./operator-access-policy-D9L4Y9uO.mjs";
import { r as createWebSocketStream, t as WebSocket } from "./websocket-CGHaToS5.mjs";
import { t as resolveRemoteControlUiHttpRoute } from "./remote-control-ui-http-routing-Ds1eVWd-.mjs";
import { t as dispatchGatewayRequestInProcess } from "./server-in-process-dispatch-DK2h5_yW.mjs";
import { t as ensureCanonicalGatewayOwnerProfile } from "./user-profile-writes-DOkiscfg.mjs";
import { t as GatewayControlUiIngressError } from "./gateway-ingress.types-Bor6uDqj.mjs";
import { n as readGatewayPluginReadCookies, t as filterRemoteControlUiPluginReadCookies } from "./control-ui-plugin-auth-cookie-Mm1ufGT4.mjs";
import { t as resolveHostAccountName } from "./host-account-name-BnggJSH4.mjs";
import { i as validateRemoteControlUiFrameAncestors } from "./control-ui-csp-BrS2VJKI.mjs";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { Writable, duplexPair } from "node:stream";
import { createServer, request } from "node:http";
//#region src/gateway/remote-control-ui-transport.ts
const MAX_BODY_BYTES = 104857600;
const WS_OPEN_TIMEOUT_MS = 1e4;
function asError(error) {
	return error instanceof Error ? error : new Error(String(error));
}
function limitError(message) {
	return new GatewayControlUiIngressError("limit-exceeded", message);
}
/** Real Node HTTP and ws parsers over an in-memory socket pair; no listening socket. */
function createRemoteControlUiTransport({ context, host }) {
	const lifetime = new AbortController();
	function openOperation(inputSignal) {
		context.assertCurrent();
		const controller = new AbortController();
		const signal = AbortSignal.any([
			inputSignal,
			context.signal,
			host.signal,
			lifetime.signal,
			controller.signal
		]);
		signal.throwIfAborted();
		const [client, serverSocket] = duplexPair({ highWaterMark: 65536 });
		let finished = false;
		let resolveClosed;
		const closed = new Promise((resolve) => {
			resolveClosed = resolve;
		});
		const abort = (error) => controller.abort(error);
		let idleMs = 0;
		let idleTimer;
		const touch = () => {
			clearTimeout(idleTimer);
			idleTimer = idleMs > 0 ? setTimeout(() => serverSocket.emit("timeout"), idleMs) : void 0;
			idleTimer?.unref();
		};
		const finish = () => {
			if (finished) return;
			finished = true;
			clearTimeout(idleTimer);
			signal.removeEventListener("abort", destroy);
			client.destroy();
			serverSocket.destroy();
			resolveClosed();
		};
		const destroy = () => {
			const error = asError(signal.reason);
			client.destroy(error);
			serverSocket.destroy(error);
			finish();
		};
		signal.addEventListener("abort", destroy, { once: true });
		const check = () => {
			signal.throwIfAborted();
			context.assertCurrent();
		};
		Object.defineProperties(serverSocket, {
			timeout: { get: () => idleMs },
			setTimeout: { value(ms, onTimeout) {
				idleMs = Math.max(ms, 0);
				if (onTimeout) serverSocket.once("timeout", onTimeout);
				touch();
				return serverSocket;
			} },
			setNoDelay: { value: () => serverSocket },
			setKeepAlive: { value: () => serverSocket }
		});
		client.on("error", abort);
		serverSocket.on("error", abort);
		const server = createServer();
		server.emit("connection", serverSocket);
		client.on("data", touch);
		serverSocket.on("data", touch);
		return {
			signal,
			client,
			server,
			abort,
			finish,
			closed,
			check,
			context: Object.freeze({
				...context,
				signal,
				assertCurrent: check
			})
		};
	}
	async function request$1(input) {
		const op = openOperation(input.signal);
		let receivedResponse;
		const uploadError = (error) => {
			if (!receivedResponse?.complete || error instanceof GatewayControlUiIngressError) op.abort(error);
		};
		op.server.on("clientError", uploadError);
		let serverResponse;
		op.server.on("request", (req, res) => {
			serverResponse = res;
			markGatewayIngressTransport(req, {
				kind: "remote-forwarded",
				context: op.context
			});
			const handler = input.surface === "sandbox" ? host.handleSandboxRequest : host.handleRequest;
			Promise.resolve().then(() => {
				op.check();
				return handler(req, res);
			}).catch(op.abort);
		});
		let req;
		try {
			req = request({
				host: "ingress.invalid",
				method: input.method,
				path: input.pathAndQuery,
				headers: input.headers.flatMap(([name, value]) => [name, value]),
				createConnection: () => op.client,
				signal: op.signal
			});
		} catch (error) {
			op.abort(error);
			throw error;
		}
		req.on("error", uploadError);
		const responseReady = new Promise((resolve, reject) => {
			req.once("response", (response) => {
				receivedResponse = response;
				resolve(response);
			});
			req.once("error", reject);
		});
		if (input.body) {
			let bytes = 0;
			input.body.pipeThrough(new TransformStream({ transform(chunk, controller) {
				op.check();
				bytes += chunk.byteLength;
				if (bytes > MAX_BODY_BYTES) throw limitError("Remote Control UI HTTP request exceeds 100 MiB");
				controller.enqueue(chunk);
			} })).pipeTo(Writable.toWeb(req), { signal: op.signal }).catch(uploadError);
		} else req.end();
		try {
			const incoming = await responseReady;
			op.check();
			incoming.on("error", op.abort);
			const headers = new Headers();
			for (const [name, values] of Object.entries(incoming.headersDistinct)) for (const value of values ?? []) headers.append(name, value);
			let receivedBytes = 0;
			const iterator = incoming[Symbol.asyncIterator]();
			const body = new ReadableStream({
				async pull(controller) {
					try {
						const part = await iterator.next();
						op.check();
						if (part.done) {
							controller.close();
							op.finish();
							return;
						}
						const chunk = part.value;
						receivedBytes += chunk.byteLength;
						if (receivedBytes > MAX_BODY_BYTES) throw limitError("Remote Control UI HTTP response exceeds 100 MiB");
						controller.enqueue(chunk);
					} catch (error) {
						const failure = op.signal.aborted ? op.signal.reason : error;
						controller.error(failure);
						op.abort(failure);
					}
				},
				cancel(reason) {
					op.abort(reason ?? /* @__PURE__ */ new Error("Remote Control UI response cancelled"));
				}
			}, { highWaterMark: 0 });
			const status = incoming.statusCode ?? 500;
			const noBody = input.method === "HEAD" || status === 204 || status === 205 || status === 304;
			if (noBody) {
				incoming.resume();
				incoming.once("end", () => {
					op.finish();
				});
			}
			return {
				response: new Response(noBody ? null : body, {
					status,
					headers
				}),
				pluginReadCookies: serverResponse ? readGatewayPluginReadCookies(serverResponse) : [],
				closed: op.closed
			};
		} catch (error) {
			op.abort(error);
			throw asError(op.signal.reason);
		}
	}
	async function openWebSocket(input) {
		const op = openOperation(input.signal);
		op.server.on("clientError", op.abort);
		op.server.on("upgrade", (req, socket, head) => {
			markGatewayIngressTransport(req, {
				kind: "remote-forwarded",
				context
			});
			Promise.resolve().then(() => {
				op.check();
				return host.handleUpgrade(req, socket, head);
			}).catch(op.abort);
		});
		const options = {
			createConnection: () => op.client,
			headers: { origin: input.origin },
			maxPayload: MAX_PAYLOAD_BYTES,
			perMessageDeflate: false
		};
		let ws;
		try {
			ws = new WebSocket(`ws://ingress.invalid${input.pathAndQuery}`, [...input.protocols], options);
		} catch (error) {
			op.abort(error);
			throw error;
		}
		const messages = createWebSocketStream(ws, {
			readableObjectMode: true,
			highWaterMark: 1
		});
		messages.on("error", op.abort);
		const abort = () => messages.destroy(asError(op.signal.reason));
		op.signal.addEventListener("abort", abort, { once: true });
		const closed = new Promise((resolve) => {
			ws.once("close", (code, reason) => {
				op.signal.removeEventListener("abort", abort);
				op.finish();
				resolve({
					code,
					reason: reason.toString()
				});
			});
		});
		const opened = new Promise((resolve, reject) => {
			ws.once("open", resolve);
			ws.once("error", reject);
			ws.once("close", () => reject(asError(op.signal.reason ?? /* @__PURE__ */ new Error("Remote Control UI WebSocket closed before opening"))));
		});
		const openTimer = setTimeout(() => op.abort(/* @__PURE__ */ new Error("Remote Control UI WebSocket opening timed out")), WS_OPEN_TIMEOUT_MS);
		openTimer.unref();
		try {
			await opened;
			op.check();
		} catch (error) {
			op.abort(error);
			throw asError(op.signal.reason);
		} finally {
			clearTimeout(openTimer);
		}
		const socket = {
			closed,
			async send(message) {
				op.check();
				const value = message.kind === "text" ? message.text : message.bytes;
				if ((typeof value === "string" ? Buffer.byteLength(value) : value.byteLength) > 26214400) throw limitError("Remote Control UI WebSocket frame exceeds 25 MiB");
				await new Promise((resolve, reject) => {
					ws.send(value, { binary: message.kind === "binary" }, (error) => error ? reject(error) : resolve());
				});
			},
			messages: { async *[Symbol.asyncIterator]() {
				const frames = messages;
				for await (const frame of frames) {
					op.check();
					yield typeof frame === "string" ? {
						kind: "text",
						text: frame
					} : {
						kind: "binary",
						bytes: frame
					};
				}
			} },
			close(code = 1e3, reason = "") {
				ws.resume();
				ws.close(code, reason);
			}
		};
		return {
			protocol: ws.protocol || void 0,
			socket
		};
	}
	return {
		request: request$1,
		openWebSocket,
		close() {
			lifetime.abort(new GatewayControlUiIngressError("closed", "Remote Control UI ingress is closed"));
			return Promise.resolve();
		}
	};
}
//#endregion
//#region src/gateway/remote-ingress-principal.ts
function remoteControlUiGatewayAuthError(auth, cfg, principal) {
	if (principal.kind === "person") {
		const proxy = auth.trustedProxy;
		if (auth.mode !== "trusted-proxy" || !cfg.gateway?.roles || proxy?.userHeader.trim().toLowerCase() !== "cf-access-authenticated-user-email" || !proxy.requiredHeaders?.some((header) => header.trim().toLowerCase() === "cf-access-jwt-assertion")) return "Person ingress requires trusted-proxy authentication with verified Cloudflare Access profiles and gateway.roles. Approve the grant from the person's authenticated Gateway Control UI.";
		return;
	}
	if (cfg.gateway?.roles) return "Owner ingress does not support gateway.roles. Use a person-bound grant approved in the Gateway Control UI.";
	if (auth.mode !== "token" && auth.mode !== "password") return "Owner ingress requires gateway.auth.mode token or password without gateway.roles. Trusted-proxy Gateways require a person-bound grant.";
	if (isRedactedSecretValue(auth[auth.mode])) return "Remote Control UI ingress cannot use a redacted Gateway credential. Replace the configured token or password with its real value locally before opening ingress.";
}
/** One grant resolves its person once, then reads the existing profile owner's live facts. */
async function prepareRemoteIngressPrincipal(params) {
	const invalidated = new AbortController();
	const bindingId = randomUUID();
	const principal = params.principal;
	const ceiling = [...params.operatorScopeCeiling];
	const assertGrant = () => {
		invalidated.signal.throwIfAborted();
		params.signal.throwIfAborted();
		params.assertCurrent();
		const error = remoteControlUiGatewayAuthError(params.getResolvedAuth(), params.getRuntimeConfig(), principal);
		if (error) throw new GatewayControlUiIngressError("unsupported-auth", error);
	};
	assertGrant();
	if (principal.kind === "person" && principal.profileId === "gateway-owner") throw new GatewayControlUiIngressError("forbidden", "Person ingress requires an existing non-owner verified profile.");
	const profileId = principal.kind === "person" ? principal.profileId : GATEWAY_OWNER_PROFILE_ID;
	if (principal.kind === "owner") {
		const displayName = await resolveHostAccountName();
		assertGrant();
		await ensureCanonicalGatewayOwnerProfile(displayName, { assertCurrent: assertGrant });
	}
	const prepared = await prepareUserProfileIdentity(profileId).catch(() => {
		throw new GatewayControlUiIngressError("forbidden", "Remote ingress requires an available existing verified profile.");
	});
	const invalidate = (error) => {
		const denial = error instanceof GatewayControlUiIngressError ? error : new GatewayControlUiIngressError("forbidden", "Remote ingress principal authority changed; reopen the binding under current authority.");
		invalidated.abort(denial);
		prepared.release();
		throw denial;
	};
	try {
		assertGrant();
		const resident = captureResidentUserProfileAccess(profileId);
		const initialIdentity = prepared.readCurrentFacts();
		const initial = initialIdentity.profile;
		const emailBindingIds = prepared.emailBindingIds;
		const readRole = (current) => resolveOperatorRolePolicyForAssignment(profileId, current.assignedRole, params.getRuntimeConfig(), current.githubLogin ?? null);
		const role = principal.kind === "person" ? structuredClone(readRole(initial)) : void 0;
		const access = principal.kind === "person" ? resolveGatewayOperatorAccessAuthority(profileId, params.getRuntimeConfig(), { requireLivePolicySet: true }) : void 0;
		const signal = AbortSignal.any([
			params.signal,
			invalidated.signal,
			...access ? [access.signal] : []
		]);
		const assertCurrent = () => {
			try {
				assertGrant();
				const currentIdentity = prepared.readCurrentFacts(emailBindingIds);
				const current = currentIdentity.profile;
				const row = resident.assertCurrent();
				const allowedUsers = params.getResolvedAuth().trustedProxy?.allowUsers;
				if (!isDeepStrictEqual(currentIdentity.aliases, initialIdentity.aliases) || initial.emails.some((email) => !current.emails.includes(email)) || initial.githubAccountIds?.some((id) => !current.githubAccountIds?.includes(id)) || principal.kind === "person" && allowedUsers?.length && !current.emails.some((email) => allowedUsers.includes(email)) || !isDeepStrictEqual(role, principal.kind === "person" ? readRole(current) : void 0)) throw new Error("Principal identity or role changed");
				access?.assertCurrent();
				return {
					...currentIdentity,
					row
				};
			} catch (error) {
				return invalidate(error);
			}
		};
		signal.addEventListener("abort", prepared.release, { once: true });
		assertCurrent();
		return {
			signal,
			assertCurrent,
			resolve() {
				const { profile, aliases, row } = assertCurrent();
				const display = projectUserProfileDisplay(row);
				return {
					bindingId,
					authenticatedUserProfile: {
						profileId,
						displayName: display.displayName,
						avatarRevision: display.avatarRevision,
						hasAvatar: display.hasAvatar,
						updatedAt: row.updated_at
					},
					preparedSessionProfile: {
						profileId,
						role: profile.assignedRole,
						githubLogin: profile.githubLogin ?? null,
						aliases
					},
					operatorRoleActor: principal.kind === "owner" ? { kind: "system" } : {
						kind: "operator",
						profileId
					},
					operatorRolePolicy: role,
					operatorAccessAuthority: access,
					scopes: role ? intersectOperatorScopes(ceiling, role.scopes) : [...ceiling],
					assertCurrent,
					signal
				};
			},
			close() {
				invalidated.abort(new GatewayControlUiIngressError("closed", "Remote ingress principal binding is closed."));
			}
		};
	} catch (error) {
		return invalidate(error);
	}
}
//#endregion
//#region src/gateway/remote-control-ui-ingress.ts
const MAX_HTTP_PER_HANDLE = 16;
const requestHeaders = /* @__PURE__ */ new Set([
	"accept",
	"accept-language",
	"accept-encoding",
	"authorization",
	"content-type",
	"range",
	"if-range",
	"if-none-match",
	"if-modified-since",
	"origin",
	"sec-fetch-site",
	"sec-fetch-mode",
	"sec-fetch-dest",
	"user-agent",
	"service-worker"
]);
const responseHeaders = /* @__PURE__ */ new Set([
	"content-type",
	"content-length",
	"content-encoding",
	"content-disposition",
	"etag",
	"last-modified",
	"cache-control",
	"expires",
	"vary",
	"accept-ranges",
	"content-range",
	"content-security-policy",
	"x-frame-options",
	"x-content-type-options",
	"referrer-policy",
	"permissions-policy",
	"cross-origin-resource-policy",
	"origin-agent-cluster",
	"retry-after",
	"location"
]);
function invalid(message) {
	throw new GatewayControlUiIngressError("invalid-options", message);
}
function validateOrigin(value, name) {
	const url = typeof value === "string" ? URL.parse(value) : null;
	if (!url || url.protocol !== "https:" || url.origin !== value || url.hostname.includes("*") || url.username || url.password) invalid(`${name} must be an exact HTTPS origin without a path, credentials, query, or fragment.`);
	return value;
}
function validatePath(value) {
	if (typeof value !== "string" || value.length > 8192 || !value.startsWith("/") || value.startsWith("//") || containsAsciiControlCharacter(value) || /[\\ #]/.test(value)) invalid("pathAndQuery must be a bounded origin-relative path and query.");
	const url = URL.parse(value, "https://ingress.invalid");
	if (!url || `${url.pathname}${url.search}` !== value || /%(?:5c|00|0a|0d)/i.test(url.pathname)) invalid("pathAndQuery contains an ambiguous or encoded path separator.");
}
function prepareRequestHeaders(input, origin) {
	const headers = [];
	for (const [rawName, value] of input) {
		const name = rawName.toLowerCase();
		if (name === "content-encoding" && value.toLowerCase() !== "identity") invalid("Compressed remote Control UI request bodies are unsupported; send decoded bytes.");
		if (requestHeaders.has(name)) headers.push([name, value]);
		if (name === "cookie") {
			const cookies = filterRemoteControlUiPluginReadCookies(value);
			if (cookies) headers.push([name, cookies]);
		}
	}
	headers.push(["host", new URL(origin).host]);
	return headers;
}
function validatePresentation(options) {
	const publicOrigin = validateOrigin(options.publicOrigin, "publicOrigin");
	const sandboxOrigin = validateOrigin(options.sandboxOrigin, "sandboxOrigin");
	if (publicOrigin === sandboxOrigin) invalid("sandboxOrigin must be distinct from publicOrigin.");
	try {
		return {
			publicOrigin,
			sandboxOrigin,
			frameAncestors: validateRemoteControlUiFrameAncestors(options.frameAncestors)
		};
	} catch (error) {
		return invalid(error instanceof Error ? error.message : "Invalid frame ancestors.");
	}
}
function validatePrincipalOptions(options) {
	if (!options.principal || options.principal.kind !== "owner" && options.principal.kind !== "person" || options.principal.kind === "person" && (typeof options.principal.profileId !== "string" || !options.principal.profileId.trim())) invalid("principal must explicitly select owner or an existing verified person profile.");
	if (options.operatorScopeCeiling.some((scope) => !isOperatorScope(scope))) invalid("operatorScopeCeiling must contain only supported operator scopes.");
	return Object.freeze([...new Set(options.operatorScopeCeiling)]);
}
/** Only service admission supplies this factory; plugins never choose a listener or socket target. */
function createGatewayControlUiIngressFactory(params) {
	const { host, pluginId } = params;
	async function bindPrincipal(options) {
		const operatorScopeCeiling = validatePrincipalOptions(options);
		const principal = Object.freeze({ ...options.principal });
		const grantSignal = AbortSignal.any([
			params.signal,
			host.signal,
			options.signal
		]);
		const grantAssertion = options.assertCurrent;
		const assertGrant = () => {
			grantSignal.throwIfAborted();
			params.assertCurrent();
			grantAssertion();
		};
		assertGrant();
		const authority = await prepareRemoteIngressPrincipal({
			principal,
			operatorScopeCeiling,
			getRuntimeConfig: () => host.getRuntimeConfig(),
			getResolvedAuth: () => host.getResolvedAuth(),
			signal: grantSignal,
			assertCurrent: assertGrant
		});
		const principalSignal = authority.signal;
		const resolvePrincipal = () => authority.resolve();
		const assertPrincipalCurrent = authority.assertCurrent;
		const closeBinding = async () => {
			authority.close();
		};
		const requestPrincipal = async (method, requestParams, requestOptions, ingressContext) => {
			const principalSnapshot = resolvePrincipal();
			const context = host.resolveGatewayContext?.();
			if (!context) throw new GatewayControlUiIngressError("unavailable", "Gateway request dispatch is unavailable.");
			const requestSignal = requestOptions?.signal ? AbortSignal.any([principalSignal, requestOptions.signal]) : principalSignal;
			const assertRequestCurrent = () => {
				requestSignal.throwIfAborted();
				principalSnapshot.assertCurrent();
				if (host.resolveGatewayContext?.() !== context) throw new GatewayControlUiIngressError("closed", "Gateway request owner was replaced.");
			};
			const hasCurrentClientAuthority = () => {
				try {
					assertRequestCurrent();
					return true;
				} catch {
					return false;
				}
			};
			assertRequestCurrent();
			const internal = {
				authenticatedOperator: true,
				remoteIngressPrincipal: principalSnapshot,
				operatorDeviceTokenIdentity: null,
				operatorRoleActor: principalSnapshot.operatorRoleActor,
				operatorAccessAuthority: principalSnapshot.operatorAccessAuthority,
				pluginRuntimeOwnerId: pluginId
			};
			const client = {
				connectionSignal: requestSignal,
				remoteControlUiIngress: ingressContext,
				connect: {
					minProtocol: 4,
					maxProtocol: 4,
					client: {
						id: "gateway-client",
						version: "1",
						platform: "plugin",
						mode: "backend"
					},
					role: "operator",
					scopes: [...principalSnapshot.scopes]
				},
				authenticatedUserProfile: principalSnapshot.authenticatedUserProfile,
				preparedSessionProfile: principalSnapshot.preparedSessionProfile,
				internal
			};
			const captured = await captureGatewayOperatorRunAuthority({
				client,
				context,
				hasCurrentClientAuthority,
				invocationAuthority: {
					assertCurrent: assertRequestCurrent,
					signal: requestSignal
				}
			});
			try {
				assertRequestCurrent();
				if (captured) internal.operatorRunAuthority = captured.authority;
				const result = await dispatchGatewayRequestInProcess(method, requestParams, {
					client,
					context,
					signal: requestSignal,
					hasCurrentClientAuthority,
					methodRegistry: context.getGatewayMethodRegistry?.(),
					requestIdPrefix: "remote-ingress",
					assertPreparationCurrent: assertRequestCurrent,
					sessionMutationCommitGuard: assertRequestCurrent,
					assertCreatedInputSourceCurrent: assertRequestCurrent
				});
				assertRequestCurrent();
				return result;
			} finally {
				captured?.release();
			}
		};
		async function openControlUi(presentationOptions) {
			const presentation = {
				...validatePresentation(presentationOptions),
				operatorScopeCeiling
			};
			const readOriginPolicy = () => {
				const gateway = host.getRuntimeConfig().gateway;
				return {
					enabled: gateway?.controlUi?.enabled !== false,
					publicOrigin: gateway?.publicOrigin,
					allowedOrigins: gateway?.controlUi?.allowedOrigins?.slice(),
					hostFallback: gateway?.controlUi?.dangerouslyAllowHostHeaderOriginFallback
				};
			};
			const originPolicy = readOriginPolicy();
			const handleLifetime = new AbortController();
			const handleSignal = AbortSignal.any([principalSignal, handleLifetime.signal]);
			const assertHandleCurrent = () => {
				if (handleSignal.aborted) throw new GatewayControlUiIngressError("closed", "Remote Control UI ingress is closed.");
				try {
					assertPrincipalCurrent();
				} catch (error) {
					handleLifetime.abort(error);
					throw error;
				}
				const current = readOriginPolicy();
				if (!current.enabled || !isDeepStrictEqual(current, originPolicy)) {
					const error = new GatewayControlUiIngressError("closed", "Control UI origin policy changed; open a new ingress handle under the current policy.");
					handleLifetime.abort(error);
					throw error;
				}
			};
			assertHandleCurrent();
			const context = Object.freeze({
				...presentation,
				pluginId,
				audienceId: options.audienceId,
				principal,
				resolvePrincipal,
				signal: handleSignal,
				assertCurrent: assertHandleCurrent
			});
			const transport = createRemoteControlUiTransport({
				context,
				host
			});
			let http = 0;
			const sockets = {
				main: 0,
				auxiliary: 0
			};
			const closeHandle = () => {
				handleLifetime.abort();
				return transport.close();
			};
			const handle = {
				async requestGateway(method, requestParams, requestOptions) {
					assertHandleCurrent();
					const requestSignal = requestOptions?.signal ? AbortSignal.any([handleSignal, requestOptions.signal]) : handleSignal;
					return requestPrincipal(method, requestParams, { signal: requestSignal }, context);
				},
				presentation: Object.freeze({
					basePath: host.controlUiBasePath,
					publicOrigin: presentation.publicOrigin,
					sandboxOrigin: presentation.sandboxOrigin,
					operatorScopeCeiling: presentation.operatorScopeCeiling
				}),
				async request(input) {
					assertHandleCurrent();
					validatePath(input.pathAndQuery);
					if (input.surface !== "control-ui" && input.surface !== "sandbox") invalid("Unknown remote Control UI surface.");
					if (![
						"GET",
						"HEAD",
						"POST"
					].includes(input.method) || input.body && input.method !== "POST") invalid("Remote Control UI supports GET/HEAD and owner-authorized POST bodies only.");
					const origin = input.surface === "sandbox" ? presentation.sandboxOrigin : presentation.publicOrigin;
					const headers = prepareRequestHeaders(input.headers, origin);
					if (http >= MAX_HTTP_PER_HANDLE) throw new GatewayControlUiIngressError("limit-exceeded", "Remote Control UI HTTP concurrency quota exceeded.");
					http += 1;
					const release = () => {
						http -= 1;
					};
					let result;
					try {
						result = await transport.request({
							...input,
							headers
						});
						result.closed.then(release, release);
						assertHandleCurrent();
						const safeHeaders = new Headers();
						for (const [name, value] of result.response.headers) if (responseHeaders.has(name)) safeHeaders.append(name, value);
						const location = safeHeaders.get("location");
						if (location) {
							const target = URL.parse(location, `${origin}${input.pathAndQuery}`);
							if (!target || target.origin !== origin || target.username || target.password || target.hash) throw new GatewayControlUiIngressError("forbidden", "Remote Control UI refused a redirect outside this origin.");
							validatePath(`${target.pathname}${target.search}`);
							if (input.surface === "sandbox" || !resolveRemoteControlUiHttpRoute({
								method: "GET",
								url: `${target.pathname}${target.search}`,
								headers: { accept: "text/html" }
							}, host.controlUiBasePath, presentation.operatorScopeCeiling)) throw new GatewayControlUiIngressError("forbidden", "Remote Control UI refused a redirect outside its route surface.");
						}
						return {
							response: new Response(result.response.body, {
								status: result.response.status,
								headers: safeHeaders
							}),
							pluginReadCookies: result.pluginReadCookies
						};
					} catch (error) {
						if (result) result.response.body?.cancel(error).catch(() => void 0);
						else release();
						throw error;
					}
				},
				async openWebSocket(input) {
					assertHandleCurrent();
					validatePath(input.pathAndQuery);
					if (input.origin !== presentation.publicOrigin) throw new GatewayControlUiIngressError("forbidden", "Browser Origin must exactly match this remote Control UI origin.");
					const pathname = new URL(input.pathAndQuery, presentation.publicOrigin).pathname;
					const kind = pathname === (host.controlUiBasePath || "/") ? "main" : "auxiliary";
					if (kind === "auxiliary" && ![
						"/desktop/observe",
						"/desktop/audio",
						"/browser/screencast"
					].includes(pathname)) throw new GatewayControlUiIngressError("forbidden", "WebSocket route is outside the Control UI ingress surface.");
					if (sockets[kind] >= 2) throw new GatewayControlUiIngressError("limit-exceeded", "Remote Control UI socket concurrency quota exceeded.");
					sockets[kind] += 1;
					const release = () => {
						sockets[kind] -= 1;
					};
					let result;
					try {
						result = await transport.openWebSocket(input);
						result.socket.closed.then(release, release);
						assertHandleCurrent();
						return {
							protocol: result.protocol,
							socket: result.socket
						};
					} catch (error) {
						if (result) closeHandle();
						else release();
						throw error;
					}
				},
				close: closeHandle
			};
			return Object.freeze(handle);
		}
		const binding = {
			request: requestPrincipal,
			openControlUi,
			close: closeBinding
		};
		assertPrincipalCurrent();
		return Object.freeze(binding);
	}
	return {
		capabilityVersion: 2,
		bindPrincipal,
		async open(options) {
			const binding = await bindPrincipal(options);
			try {
				const handle = await binding.openControlUi(options);
				return Object.freeze({
					...handle,
					close: () => binding.close()
				});
			} catch (error) {
				binding.close();
				throw error;
			}
		}
	};
}
//#endregion
export { createGatewayControlUiIngressFactory };
