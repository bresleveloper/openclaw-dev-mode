import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { t as AuthProfileAuthorizationError } from "./authorization-contract-BOF8YHOo.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { a as collectExplicitDenylist } from "./tool-policy-14GRhbFd.mjs";
import { s as resolveCronScheduledToolPolicy } from "./scheduled-tool-policy-Bjq61U8o.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-_nMiaWKV.mjs";
import { n as resolveCronJobEffectiveAgentId } from "./agent-id-C6uS-TyD.mjs";
import { f as resolveRequesterScopedMcpConnections, s as applyMcpConnectionOverride, u as partitionMcpServersByConnectionScope } from "./bundle-mcp-config-BEIeeWHy.mjs";
import { t as loadSessionMcpConfig } from "./agent-bundle-mcp-runtime-config-BY_ItTpJ.mjs";
import { r as redactMcpDiagnosticError } from "./mcp-error-C1eeD4DO.mjs";
import { i as OpenClawStreamableHTTPClientTransport } from "./mcp-stdio-transport-DLsQzsXq.mjs";
import { n as resolveMcpAuthProfileId } from "./mcp-auth-profile-PE2J10CY.mjs";
import { t as resolveMcpTransport } from "./mcp-transport-DKomcFYo.mjs";
import { n as operatorMcpOAuthIdentity, r as requesterMcpOAuthIdentity } from "./mcp-oauth-identity-0fgjEqV6.mjs";
import { i as resolveCronAuthenticatedChannelRequester, r as resolveCronAuthenticatedCallerOrigin } from "./tools-allow-provenance-DDhQ9uVg.mjs";
import { n as resolveEffectiveToolPolicy, r as resolveGroupToolPolicy } from "./agent-tools.policy-t04F-r_I.mjs";
import { t as resolveSenderToolPolicy } from "./sender-tool-policy-gk1GQOJT.mjs";
import { t as isChannelAccountExplicitlyDisabled } from "./account-config-enabled-Ck6QSq-W.mjs";
import { t as createScheduledGatewayRunner } from "./scheduled-run-gateway-context-Cs6rVhRo.mjs";
import { createHash, randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/mcp-event-request.ts
const MCP_EVENTS_PROTOCOL_VERSION = "2026-07-28";
/** Preserve protocol dispositions without exposing remote diagnostic bodies or credentials. */
var McpEventRequestError = class extends Error {
	constructor(code, reason) {
		super("MCP Events request failed (code " + code + (reason ? ", reason " + reason : "") + ")");
		this.code = code;
		this.reason = reason;
		this.name = "McpEventRequestError";
	}
};
/** Transport failures may carry credentials beyond their message; expose only redacted diagnostics. */
var McpEventTransportError = class extends Error {
	constructor(error) {
		const diagnostic = redactMcpDiagnosticError(error);
		super(diagnostic, { cause: diagnostic });
	}
};
/**
* MCP 2 requests have their own metadata and no initialize handshake. Reuse the
* existing bounded JSON/SSE transport and auth owner rather than a second HTTP client.
*/
async function requestMcpEvent(params) {
	params.assertCurrent();
	const config = resolveMcpTransportConfig(params.serverName, params.server);
	if (config?.kind !== "http" || config.transportType !== "streamable-http") throw new Error("MCP Events requires a configured Streamable HTTP server.");
	const deadline = AbortSignal.timeout(config.requestTimeoutMs);
	const signal = params.signal ? AbortSignal.any([params.signal, deadline]) : deadline;
	const assertCurrent = () => {
		signal.throwIfAborted();
		params.assertCurrent();
	};
	const resolved = resolveMcpTransport(params.serverName, params.server, {
		cfg: params.cfg,
		agentDir: params.agentDir,
		requesterScope: params.requesterScope,
		requestHeaders: { "Mcp-Method": params.method },
		beforeRequest: assertCurrent
	});
	if (!resolved || !(resolved.transport instanceof OpenClawStreamableHTTPClientTransport)) throw new Error("MCP Events connection is unavailable for this subscription owner.");
	const transport = resolved.transport;
	transport.setProtocolVersion(MCP_EVENTS_PROTOCOL_VERSION);
	const id = randomUUID();
	const response = createDeferredCore();
	response.promise.catch(() => void 0);
	Object.assign(transport, {
		onmessage: (message) => {
			if (!("id" in message) || message.id !== id) return;
			if ("error" in message) {
				const reason = isRecord(message.error.data) ? message.error.data.reason : void 0;
				response.reject(new McpEventRequestError(message.error.code, typeof reason === "string" && /^[a-z_]{1,64}$/.test(reason) ? reason : void 0));
			} else if ("result" in message) response.resolve(message.result);
			else response.reject(/* @__PURE__ */ new Error("MCP Events received an invalid response."));
		},
		onerror: (error) => response.reject(error),
		onclose: () => response.reject(/* @__PURE__ */ new Error("MCP Events connection closed."))
	});
	const onAbort = () => response.reject(signal.reason);
	signal.addEventListener("abort", onAbort, { once: true });
	let sending;
	try {
		assertCurrent();
		await transport.start();
		assertCurrent();
		sending = transport.send({
			jsonrpc: "2.0",
			id,
			method: params.method,
			params: {
				...params.params,
				_meta: {
					"io.modelcontextprotocol/protocolVersion": MCP_EVENTS_PROTOCOL_VERSION,
					"io.modelcontextprotocol/clientInfo": {
						name: "openclaw",
						version: VERSION
					},
					"io.modelcontextprotocol/clientCapabilities": {}
				}
			}
		});
		sending.catch(response.reject);
		const result = await response.promise;
		assertCurrent();
		return result;
	} catch (error) {
		if (error instanceof McpEventRequestError) throw error;
		throw new McpEventTransportError(error);
	} finally {
		signal.removeEventListener("abort", onAbort);
		try {
			await transport.close();
			await sending?.catch(() => void 0);
		} finally {
			Object.assign(transport, {
				onmessage: void 0,
				onerror: void 0,
				onclose: void 0
			});
		}
	}
}
//#endregion
//#region src/agents/mcp-event-connection.ts
/** Adapter only: credential state, refresh, and revocation remain with their existing owners. */
async function prepareMcpEventCredentialConnection(selector, assertCallerCurrent) {
	let authority;
	let disposed = false;
	let kind = "configured";
	const assertActive = () => {
		if (disposed) throw new AuthProfileAuthorizationError("retired");
		assertCallerCurrent();
	};
	const assertCurrent = () => {
		assertActive();
		authority?.assertCurrent();
	};
	const release = () => {
		if (!disposed) {
			disposed = true;
			authority?.dispose();
		}
	};
	try {
		assertActive();
		let server = selector.server;
		if (selector.requesterResolver) {
			if (!selector.requesterScope) throw new AuthProfileAuthorizationError("retired");
			const resolved = (await resolveRequesterScopedMcpConnections({
				serverNames: [selector.serverName],
				...selector.requesterScope,
				retainAuthority: true
			})).get(selector.serverName);
			authority = resolved?.authority;
			assertCurrent();
			if (!resolved || !authority) throw new AuthProfileAuthorizationError("unavailable");
			kind = "resolver";
			server = applyMcpConnectionOverride(server, resolved);
		}
		const transport = resolveMcpTransportConfig(selector.serverName, server, { logWarnings: false });
		if (transport?.kind !== "http" || transport.transportType !== "streamable-http") throw new Error("MCP Events requires a configured Streamable HTTP server");
		if (!authority) {
			const profileId = resolveMcpAuthProfileId(server);
			if (profileId) {
				const { captureMcpAuthProfileAuthorization } = await import("./mcp-auth-profile-authorization-5s2p6NyJ.mjs");
				assertActive();
				authority = await captureMcpAuthProfileAuthorization({
					profileId,
					cfg: selector.cfg,
					agentDir: selector.agentDir,
					assertCurrent: assertCallerCurrent
				});
				kind = "auth-profile";
			} else if (transport.auth === "oauth") {
				const { captureMcpOAuthAuthorization } = await import("./mcp-oauth-authorization-DVa33zR0.mjs");
				assertActive();
				if (transport.oauth?.identity === "per-requester" && !selector.requesterScope) throw new AuthProfileAuthorizationError("retired");
				authority = await captureMcpOAuthAuthorization({
					identity: transport.oauth?.identity === "per-requester" && selector.requesterScope ? requesterMcpOAuthIdentity(selector.serverName, transport.url, selector.requesterScope) : operatorMcpOAuthIdentity(selector.serverName, transport.url),
					assertCurrent: assertCallerCurrent
				});
				kind = "oauth";
			}
		}
		assertCurrent();
		return {
			endpoint: new URL(transport.url).href,
			server,
			cfg: selector.cfg,
			agentDir: selector.agentDir,
			requesterScope: selector.requesterScope,
			selector,
			authorizationIdentity: JSON.stringify([kind, authority?.authorizationId ?? "configured"]),
			assertCurrent,
			release,
			revalidate: async () => {
				assertActive();
				await authority?.revalidate();
				assertCurrent();
			}
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/plugins/service-mcp-events.ts
const MAX_SUBSCRIPTION_TTL_MS = 36e5;
const CLEANUP_GRACE_MS = 3e5;
const MAX_PREPARED_SOURCES = 4096;
/** The shared config/auth owner, also used by the pre-creation Gateway catalog. */
async function prepareMcpEventConnection(params) {
	const { cfg, principal, serverName } = params;
	params.assertCurrent();
	if (!listAgentIds(cfg).includes(principal.agentId)) throw new Error("MCP Events agent is no longer configured.");
	let sessionChanged = false;
	let disposed = false;
	let credentialConnection;
	const releaseSession = sessionChanges.subscribeFacts((change) => {
		if ("all" in change || principal.sessionKey && change.sessionKey === principal.sessionKey && (!change.agentId || change.agentId === principal.agentId)) sessionChanged = true;
	});
	const release = () => {
		if (!disposed) {
			disposed = true;
			credentialConnection?.release();
			releaseSession();
		}
	};
	const assertPolicyCurrent = () => {
		params.assertCurrent();
		if (disposed || sessionChanged) throw new Error("MCP Events creator session changed; resolve its authority again.");
	};
	const assertCurrent = () => {
		assertPolicyCurrent();
		credentialConnection?.assertCurrent();
	};
	try {
		const entry = principal.sessionKey ? await withSessionEntryReadOnlyInWorker({
			agentId: principal.agentId,
			sessionKey: principal.sessionKey
		}, assertCurrent, async (read) => {
			if (!read.ok) throw new Error("MCP Events creator session cannot be read.");
			return read.value;
		}) : void 0;
		assertCurrent();
		if (principal.sessionKey && !entry) throw new Error("MCP Events creator session is unavailable.");
		const policies = resolveEffectiveToolPolicy({
			config: cfg,
			agentId: principal.agentId,
			sessionKey: principal.sessionKey
		});
		if (principal.account?.channel && isChannelAccountExplicitlyDisabled({
			cfg,
			channel: principal.account.channel,
			accountId: principal.account.id
		})) throw new Error("MCP Events creator account is disabled.");
		const groupPolicy = principal.account ? resolveGroupToolPolicy({
			config: cfg,
			sessionKey: principal.sessionKey,
			accountId: principal.account.id,
			messageProvider: principal.account.channel,
			requireConfiguredAccount: true,
			senderPolicyMode: principal.requester ? "always" : "never",
			senderId: principal.requester?.requesterSenderId
		}) : void 0;
		const senderPolicy = principal.requester ? resolveSenderToolPolicy({
			config: cfg,
			agentId: principal.agentId,
			sessionKey: principal.sessionKey,
			messageProvider: principal.requester.messageChannel,
			senderId: principal.requester.requesterSenderId
		}) : void 0;
		const toolDenylist = collectExplicitDenylist([
			policies.globalPolicy,
			policies.agentPolicy,
			groupPolicy,
			senderPolicy
		]);
		const { loaded, fingerprint: configurationIdentity } = loadSessionMcpConfig({
			cfg,
			workspaceDir: resolveAgentWorkspaceDir(cfg, principal.agentId),
			toolOverrides: entry?.toolOverrides,
			includeServerNames: /* @__PURE__ */ new Set([serverName]),
			toolDenylist,
			logDiagnostics: false
		});
		const server = loaded.mcpServers[serverName];
		if (!server || entry?.toolOverrides?.mcpToolsDeny?.[serverName]?.includes("*")) throw new Error("MCP Events server is unavailable under the creator's policy.");
		const partition = partitionMcpServersByConnectionScope({ [serverName]: server });
		if (partition.requesterScopedServerNames.length && !principal.requester) throw new Error("MCP Events requires the original authenticated requester for this server.");
		credentialConnection = await prepareMcpEventCredentialConnection({
			serverName,
			server,
			cfg,
			agentDir: resolveAgentDir(cfg, principal.agentId),
			requesterScope: principal.requester,
			requesterResolver: partition.resolverRequesterServerNames.length > 0
		}, assertPolicyCurrent);
		assertCurrent();
		return {
			...credentialConnection,
			configurationIdentity,
			assertCurrent,
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
function jobPrincipal(job, defaultAgentId) {
	const policy = resolveCronScheduledToolPolicy({
		toolsAllow: job.payload.toolsAllow,
		owner: job.owner,
		scheduledToolPolicy: job.scheduledToolPolicy
	});
	if (!policy) throw new Error("MCP Events requires a verified Automation creator policy.");
	const agentId = resolveCronJobEffectiveAgentId(job, defaultAgentId);
	const requester = resolveCronAuthenticatedChannelRequester(job);
	const origin = resolveCronAuthenticatedCallerOrigin(job);
	return {
		agentId,
		...policy.mode === "account" ? {
			sessionKey: policy.ownerSessionKey,
			account: {
				id: policy.ownerAccountId,
				channel: origin?.kind === "external" ? origin.channel : requester?.channel
			}
		} : {},
		...requester ? { requester: {
			requesterSenderId: requester.senderId,
			messageChannel: requester.channel,
			agentAccountId: requester.accountId
		} } : {}
	};
}
function subscriptionIdentity(params) {
	const delivery = isRecord(params.delivery) ? params.delivery : void 0;
	if (typeof params.name !== "string" || !params.name || params.name.length > 256 || !isRecord(params.arguments) || delivery?.mode !== "webhook" || typeof delivery.url !== "string" || delivery.url.length > 4096) throw new Error("MCP Events requires an exact webhook subscription identity.");
	const url = new URL(delivery.url);
	if (url.protocol !== "https:" || url.username || url.password || url.hash) throw new Error("MCP Events callback must be an HTTPS URL without credentials or a fragment.");
	return {
		name: params.name,
		arguments: structuredClone(params.arguments),
		delivery: {
			mode: "webhook",
			url: delivery.url
		}
	};
}
function authorityDefinition(job) {
	return {
		schedule: job.schedule,
		agentId: job.agentId,
		sessionKey: job.sessionKey,
		owner: job.owner,
		toolsAllow: job.payload.toolsAllow,
		scheduledToolPolicy: job.scheduledToolPolicy,
		toolsAllowProvenance: job.toolsAllowProvenance,
		sourceIdentity: job.state.sourceIdentity
	};
}
function createPluginServiceMcpEvents(params) {
	let sourceCount = 0;
	const runScheduled = createScheduledGatewayRunner(params.resolveGatewayContext);
	const assertService = (cleanupOnly = false) => {
		params.lease.assertActive("MCP Events");
		if (!cleanupOnly && params.isStopping()) throw new Error("MCP Events service is unavailable.");
	};
	const captureSource = (input) => {
		assertService();
		const context = params.resolveGatewayContext?.();
		const cron = params.getCron();
		const current = cron?.getJob(input.jobId);
		if (!context || !current?.enabled || current.schedule.kind !== "event" || current.schedule.source !== params.pluginId || current.state.sourceIdentity !== input.sourceIdentity || current.schedule.options.server !== input.serverName) throw new Error("MCP Events source is no longer current.");
		const job = structuredClone(current);
		const definition = authorityDefinition(job);
		const cfg = context.getRuntimeConfig();
		const registry = context.getGatewayMethodRegistry?.();
		const assertCurrent = () => {
			assertService();
			const next = cron?.getJob(input.jobId);
			if (params.resolveGatewayContext?.() !== context || params.getCron() !== cron || !next?.enabled || !isDeepStrictEqual(definition, authorityDefinition(next)) || context.getRuntimeConfig() !== cfg || context.getGatewayMethodRegistry?.() !== registry) throw new Error("MCP Events creator authority or configuration changed.");
		};
		return {
			job,
			cfg,
			principal: jobPrincipal(job),
			assertCurrent
		};
	};
	const opaque = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
	return { prepareSource: (original) => runScheduled(async () => {
		const input = { ...original };
		const prepare = async () => {
			const captured = captureSource(input);
			return {
				captured,
				connection: await prepareMcpEventConnection({
					...captured,
					serverName: input.serverName
				})
			};
		};
		if (sourceCount >= MAX_PREPARED_SOURCES) throw new Error("MCP Events source capability capacity reached.");
		let current = await prepare();
		if (sourceCount >= MAX_PREPARED_SOURCES) {
			current.connection.release();
			throw new Error("MCP Events source capability capacity reached.");
		}
		sourceCount++;
		let active = true;
		let retired = false;
		let cleanup;
		let pending;
		let revalidating;
		const dispose = params.lease.retain(() => {
			active = false;
			current.connection.release();
			cleanup = void 0;
			sourceCount--;
		});
		const assertOpen = () => {
			if (!active) throw new Error("MCP Events source capability was disposed.");
			if (retired) throw new AuthProfileAuthorizationError("retired");
			assertService();
		};
		const assertCurrent = () => {
			assertOpen();
			current.connection.assertCurrent();
		};
		const principalIdentity = ({ captured, connection }) => opaque([
			captured.principal,
			captured.job.scheduledToolPolicy,
			input.serverName,
			connection.configurationIdentity,
			connection.authorizationIdentity,
			connection.endpoint
		]);
		const principalId = principalIdentity(current);
		const accountId = opaque([current.captured.principal.agentId, current.captured.principal.account ?? current.captured.job.scheduledToolPolicy]);
		const revalidate = () => {
			revalidating ??= runScheduled(async () => {
				assertOpen();
				try {
					await current.connection.revalidate();
					assertCurrent();
				} catch (error) {
					if (error instanceof AuthProfileAuthorizationError) throw error;
					const next = await prepare();
					try {
						assertOpen();
						next.connection.assertCurrent();
						if (principalIdentity(next) !== principalId) {
							retired = true;
							throw new AuthProfileAuthorizationError("retired");
						}
						current.connection.release();
						current = next;
					} finally {
						if (current !== next) next.connection.release();
					}
				}
			}).catch((error) => {
				retired ||= !(error instanceof AuthProfileAuthorizationError) || error.code !== "MCP_AUTHORIZATION_UNAVAILABLE";
				throw error;
			}).finally(() => {
				revalidating = void 0;
			});
			return revalidating;
		};
		const execute = async (method, originalParams, signal) => {
			const cleanupOnly = method === "events/unsubscribe";
			const previous = pending;
			if (cleanupOnly) retired = true;
			else {
				assertCurrent();
				if (method === "events/subscribe" && pending) throw new Error("MCP Events subscription request is already pending.");
			}
			const requestParams = structuredClone(originalParams);
			const admitted = current;
			const context = params.resolveGatewayContext?.();
			const cron = params.getCron();
			const operation = runScheduled(async () => {
				if (cleanupOnly) await previous?.catch(() => {});
				const captured = cleanup;
				const assertRequest = () => {
					assertService(cleanupOnly);
					signal.throwIfAborted();
					if (!active || !context || params.resolveGatewayContext?.() !== context || params.getCron() !== cron) throw new Error("MCP Events source capability was disposed or its host replaced.");
					if (cleanupOnly) {
						if (!captured || cleanup !== captured || captured.expiresAt <= Date.now()) throw new Error("MCP Events cleanup has no captured subscription authority; its finite remote lease must expire.");
					} else {
						assertOpen();
						admitted.connection.assertCurrent();
					}
				};
				assertRequest();
				const route = cleanupOnly ? captured : admitted.connection;
				let wireParams = cleanupOnly ? captured.identity : method === "events/list" && typeof requestParams.cursor === "string" ? { cursor: requestParams.cursor } : {};
				let expiresAt;
				if (method === "events/subscribe") {
					const identity = subscriptionIdentity(requestParams);
					const job = admitted.captured.job;
					if (job.schedule.kind !== "event" || identity.name !== job.schedule.options.name || !isDeepStrictEqual(identity.arguments, job.schedule.options.arguments ?? {})) throw new Error("MCP Events subscription does not match its persisted source.");
					if (cleanup && !isDeepStrictEqual(cleanup.identity, identity)) throw new Error("MCP Events prepared source already owns another webhook subscription.");
					const ttlMs = requestParams.ttlMs;
					const delivery = isRecord(requestParams.delivery) ? requestParams.delivery : void 0;
					if (typeof ttlMs !== "number" || !Number.isSafeInteger(ttlMs) || ttlMs <= 0 || ttlMs > MAX_SUBSCRIPTION_TTL_MS || typeof delivery?.secret !== "string" || delivery.secret.length > 1024 || !delivery.secret.startsWith("whsec_")) throw new Error("MCP Events requires a signing secret and a finite TTL of at most one hour.");
					registerSecretValueForRedaction(delivery.secret);
					registerSecretValueForRedaction(delivery.secret.slice(6));
					expiresAt = Date.now() + ttlMs + CLEANUP_GRACE_MS;
					cleanup = {
						identity,
						selector: route.selector,
						authorizationIdentity: route.authorizationIdentity,
						endpoint: route.endpoint,
						expiresAt
					};
					wireParams = {
						...identity,
						delivery: {
							...identity.delivery,
							secret: delivery.secret
						},
						ttlMs,
						...requestParams.cursor !== void 0 ? { cursor: requestParams.cursor } : {}
					};
				}
				const connection = await prepareMcpEventCredentialConnection(route.selector, assertRequest);
				try {
					if (connection.authorizationIdentity !== route.authorizationIdentity || connection.endpoint !== route.endpoint) {
						retired = true;
						throw new AuthProfileAuthorizationError("retired");
					}
					const result = await requestMcpEvent({
						...connection,
						serverName: input.serverName,
						method,
						params: wireParams,
						signal,
						assertCurrent: connection.assertCurrent
					});
					connection.assertCurrent();
					if (expiresAt !== void 0) {
						const refreshBefore = isRecord(result) && typeof result.refreshBefore === "string" ? Date.parse(result.refreshBefore) : NaN;
						if (!Number.isFinite(refreshBefore) || refreshBefore <= Date.now() || refreshBefore > expiresAt) throw new Error("MCP Events server did not confirm a bounded subscription lease; remote outcome is unknown.");
					}
					if (cleanupOnly) cleanup = void 0;
					return result;
				} finally {
					connection.release();
				}
			});
			if (cleanupOnly || method === "events/subscribe") pending = operation;
			try {
				return await operation;
			} finally {
				if (pending === operation) pending = void 0;
			}
		};
		try {
			assertCurrent();
			return {
				accountId,
				principalId,
				assertCurrent,
				revalidate,
				dispose,
				request: async (method, requestParams, signal) => {
					if (![
						"server/discover",
						"events/list",
						"events/subscribe"
					].includes(method)) throw new Error("Unsupported MCP Events method.");
					return await execute(method, requestParams, signal);
				},
				unsubscribe: (signal) => execute("events/unsubscribe", {}, signal)
			};
		} catch (error) {
			dispose();
			throw error;
		}
	}) };
}
//#endregion
export { requestMcpEvent as i, prepareMcpEventConnection as n, MCP_EVENTS_PROTOCOL_VERSION as r, createPluginServiceMcpEvents as t };
