import { o as normalizeLowercaseStringOrEmpty, t as hasNonEmptyString } from "../../string-coerce-1VuiLaaR.mjs";
import { n as isTruthyEnvValue } from "../../env-BBJTTIuE.mjs";
import { r as asNullableRecord } from "../../record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries } from "../../string-normalization-CECOqf64.mjs";
import { o as hasConfiguredSecretInput } from "../../types.secrets-DsPRn9Dz.mjs";
import { t as formatCliCommand } from "../../command-format-DwEdrDKL.mjs";
import { Et as _enum, Jn as string, Lt as boolean, Pn as number, Un as record, qn as strictObject, sr as unknown } from "../../schemas-BOYIvvln.mjs";
import { s as isPrivateIpAddress } from "../../ssrf-v45DW-yR.mjs";
import { t as ErrorCodes } from "../../gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "../../error-codes-Dh56LniQ.mjs";
import { n as detectMime } from "../../mime-CGDYrRzL.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import "../../runtime-env-BjPzo7IN.mjs";
import "../../secret-input-BXhRrpGu.mjs";
import "../../setup-tools-D6A0I-Kz.mjs";
import { i as isPrivateNetworkOptInEnabled } from "../../ssrf-policy-CWFvb6PK.mjs";
import "../../media-mime-DLFR6fqC.mjs";
import { t as startLazyPluginServiceModule } from "../../plugin-runtime-C3Ot0aFc.mjs";
import "../../gateway-runtime-DMDKFL1_.mjs";
import { n as redactCdpUrl } from "../../browser-cdp-DgJ98Oxl.mjs";
import { $ as getOptionalBrowserStateRuntime, Q as getBrowserStateRuntime } from "../../session-tab-store-D3MRWtH0.mjs";
import { n as applyBrowserTabToolBinding, r as BROWSER_PROXY_COMMAND } from "../../browser-tool-description-CRHph32o.mjs";
import { i as resolveBrowserConfig, r as isLocalManagedProfile, s as resolveProfile } from "../../config-DQZ6ubGi.mjs";
import { n as resolveCdpControlPolicy } from "../../cdp-reachability-policy-38poFoxo.mjs";
import { r as closeTrackedCdpTarget } from "../../cdp.helpers-5V0YKyjL.mjs";
import { a as loadBrowserConfigForRuntimeRefresh } from "../../server-context-BKNNv13O.mjs";
import { c as isProfileGenerationCurrent, o as getProfileLifecycle } from "../../server-context.lifecycle-BEP6ffl9.mjs";
import { n as getPwAiModule } from "../../pw-ai-module-DtcZ1YiW.mjs";
import { a as browserNavigationPolicyForProfile, c as normalizeBrowserRequestPath, l as resolveRequestedBrowserProfile, o as isBrowserHostLocalRoute, s as isPersistentBrowserProfileMutation } from "../../routes-Y7jzdlXG.mjs";
import { t as createBrowserRouteDispatcher } from "../../dispatcher-DyQH5j96.mjs";
import { n as resolveBrowserControlAuth } from "../../control-auth-Be3ZqNsy.mjs";
import { i as createBrowserTool, n as handleBrowserGatewayRequest, r as withTimeout } from "../../browser-request-CLI0TKbR.mjs";
import { d as assertBrowserProxyFileCountWithinLimit, f as createBrowserProxyFailure, h as visitBrowserProxyFilePaths, n as ensureBrowserProxyUploadCleanup, o as stageBrowserProxyUploadRequest, r as hasBrowserProxyUploadWork, s as BROWSER_PROXY_ERROR_ENVELOPE, t as discardStagedBrowserProxyUpload, u as assertBrowserProxyFileBytesWithinLimits } from "../../browser-proxy-upload-BdXafJCn.mjs";
import { t as resolveBrowserProxyTimeoutMs } from "../../browser-proxy-timeouts-l1Xf3Ykq.mjs";
import { i as hasBrowserControlWork, r as getBrowserControlState, t as createBrowserControlContext } from "../../browser-control-state-ifva595C.mjs";
import { t as describeBrowserControlUnavailable } from "../../plugin-enabled-DyxIYAn3.mjs";
import { n as stopBrowserControlService, t as startBrowserControlServiceFromConfig } from "../../control-service-B74LgX2W.mjs";
import { n as sameBrowserDashboardDefinition, t as readBrowserDashboardDefinition } from "../../browser-dashboard-definition-BDAe-mpi.mjs";
import fs from "node:fs/promises";
import { toUSVString } from "node:util";
//#region extensions/browser/src/session-browser-dashboard.ts
const MAX_SESSION_DASHBOARDS = 64;
function keyFor(definition) {
	return JSON.stringify([
		definition.agentId,
		definition.sessionKey,
		definition.instanceId
	]);
}
function response(resource) {
	const definition = resource.definition;
	return {
		sessionKey: definition.sessionKey,
		name: definition.name,
		instanceId: definition.instanceId,
		revision: definition.revision,
		url: definition.url,
		title: definition.title,
		paused: resource.paused,
		stopping: false,
		...resource.page ? { browserTab: {
			target: "host",
			profile: definition.profile,
			targetId: resource.page.targetId
		} } : {}
	};
}
async function createResource(definition, authority, signal, operation) {
	const runtime = getBrowserStateRuntime();
	const resources = runtime.sessionDashboards ??= /* @__PURE__ */ new Map();
	if (resources.size >= MAX_SESSION_DASHBOARDS) throw new Error("The Gateway has reached its isolated dashboard limit. Remove an unused browser widget and retry.");
	const session = authority.retainSession();
	const controller = new AbortController();
	const key = keyFor(definition);
	let retired = false;
	let definitionPending = false;
	let definitionEpoch = 0;
	let page;
	let assertProfileCurrent;
	let removeProfileAbort;
	let closing;
	const close = () => {
		retired = true;
		controller.abort(/* @__PURE__ */ new Error("The isolated browser dashboard was retired."));
		session.signal.removeEventListener("abort", onAbort);
		session.release();
		removeProfileAbort?.();
		removeProfileAbort = void 0;
		if (!closing) closing = (async () => {
			await page?.close();
			if (resources.get(key) === resource) resources.delete(key);
		})().catch((error) => {
			closing = void 0;
			throw error;
		});
		return closing;
	};
	const assertCurrent = () => {
		session.assertCurrent();
		if (retired || getOptionalBrowserStateRuntime() !== runtime || page && !page.isCurrent()) throw new Error("The isolated browser context is no longer available. Reopen the dashboard.");
		assertProfileCurrent?.();
		if (definitionPending) throw new Error("The dashboard definition changed. Refresh the dashboard before continuing.");
	};
	const resource = {
		definition,
		session: authority.target,
		paused: operation === "stop",
		signal: controller.signal,
		assertCurrent,
		assertDefinitionCurrent: async () => {
			session.assertCurrent();
			const epoch = definitionEpoch;
			const current = await readBrowserDashboardDefinition(definition, getBrowserControlState()?.resolved.defaultProfile);
			session.assertCurrent();
			if (epoch !== definitionEpoch) throw new Error("The dashboard changed during verification. Retry the operation.");
			if (!sameBrowserDashboardDefinition(definition, current)) {
				await close();
				throw new Error("The dashboard was removed or replaced. Open its current definition.");
			}
			definitionPending = false;
			assertCurrent();
		},
		definitionChanged: () => {
			definitionPending = true;
			definitionEpoch += 1;
		},
		close
	};
	const onAbort = () => {
		close().catch(() => {});
	};
	session.signal.addEventListener("abort", onAbort, { once: true });
	resources.set(key, resource);
	try {
		authority.assertCurrent();
		signal?.throwIfAborted();
		if (operation === "open") {
			if (!await startBrowserControlServiceFromConfig()) throw new Error("Browser control is unavailable on this Gateway.");
			authority.assertCurrent();
			signal?.throwIfAborted();
			const context = createBrowserControlContext();
			if (definition.profile !== context.state().resolved.defaultProfile) throw new Error("Isolated session dashboards use the configured default managed profile. Remove the widget's custom profile before reopening it.");
			const profileContext = context.forProfile(definition.profile);
			if (!isLocalManagedProfile(profileContext.profile)) throw new Error("Isolated session dashboards require a local managed browser profile. Attached, extension and remote profiles are unsupported.");
			await profileContext.ensureBrowserAvailable({ signal });
			authority.assertCurrent();
			signal?.throwIfAborted();
			const state = getBrowserControlState();
			const profile = state?.profiles.get(definition.profile);
			if (!state || !profile) throw new Error("Browser profile is unavailable.");
			const lifecycle = getProfileLifecycle(profile);
			const generation = lifecycle.generation;
			const configRevision = lifecycle.configRevision;
			assertProfileCurrent = () => {
				if (getBrowserControlState() !== state || state.profiles.get(definition.profile) !== profile || !isProfileGenerationCurrent({
					state,
					runtime: profile,
					generation,
					configRevision
				})) throw new Error("The browser profile changed. Reopen the dashboard.");
			};
			lifecycle.controller.signal.addEventListener("abort", onAbort, { once: true });
			removeProfileAbort = () => lifecycle.controller.signal.removeEventListener("abort", onAbort);
			const playwright = await getPwAiModule({ mode: "strict" });
			authority.assertCurrent();
			assertProfileCurrent();
			if (!playwright) throw new Error("Isolated session dashboards require Playwright in this Gateway build.");
			page = await playwright.createPageViaPlaywright({
				cdpUrl: profileContext.profile.cdpUrl,
				url: definition.url,
				isolatedContext: true,
				assertCurrent: () => {
					authority.assertCurrent();
					assertCurrent();
				},
				...browserNavigationPolicyForProfile(context, profileContext),
				cdpPolicy: resolveCdpControlPolicy(profileContext.profile, state.resolved.ssrfPolicy),
				signal: signal ? AbortSignal.any([
					signal,
					session.signal,
					controller.signal
				]) : AbortSignal.any([session.signal, controller.signal])
			});
			resource.page = page;
			if (retired) {
				await page.close();
				throw new Error("The session browser was retired during startup.");
			}
			authority.assertCurrent();
			signal?.throwIfAborted();
			await resource.assertDefinitionCurrent();
			authority.assertCurrent();
		}
		assertCurrent();
		return resource;
	} catch (error) {
		await close();
		throw error;
	}
}
/** Same-widget requests serialize before allocation, so competing viewers never create shared-profile tabs. */
async function accessSessionBrowserDashboard(request, authority, options) {
	if (authority.sandboxRequired) throw new Error("This session requires a sandbox. The Gateway's isolated browser context does not provide a sandbox backend; ask an operator for a supported sandbox browser.");
	authority.assertCurrent();
	options.signal?.throwIfAborted();
	if (!await startBrowserControlServiceFromConfig()) throw new Error("Browser control is unavailable on this Gateway.");
	authority.assertCurrent();
	const definition = await readBrowserDashboardDefinition(request, getBrowserControlState()?.resolved.defaultProfile);
	authority.assertCurrent();
	options.signal?.throwIfAborted();
	if (!definition || definition.sessionKey !== authority.target.sessionKey || definition.agentId !== authority.target.agentId) throw new Error("The browser dashboard is missing, invalid or belongs to a different session.");
	const runtime = getBrowserStateRuntime();
	const key = keyFor(definition);
	const operationKey = `session:${key}`;
	const previous = runtime.dashboardOperations.get(operationKey)?.promise;
	const promise = (async () => {
		await previous?.catch(() => {});
		authority.assertCurrent();
		options.signal?.throwIfAborted();
		if (getOptionalBrowserStateRuntime() !== runtime) throw new Error("Browser runtime changed.");
		const currentDefinition = await readBrowserDashboardDefinition({
			...request,
			instanceId: definition.instanceId
		}, getBrowserControlState()?.resolved.defaultProfile);
		authority.assertCurrent();
		options.signal?.throwIfAborted();
		if (getOptionalBrowserStateRuntime() !== runtime) throw new Error("Browser runtime changed.");
		if (!sameBrowserDashboardDefinition(definition, currentDefinition)) throw new Error("The dashboard changed before this operation. Open its current definition.");
		let resource = runtime.sessionDashboards?.get(key);
		if (resource && (!sameBrowserDashboardDefinition(resource.definition, definition) || resource.session.sessionId !== authority.target.sessionId || resource.session.lifecycleRevision !== authority.target.lifecycleRevision)) {
			await resource.close();
			resource = void 0;
		}
		if (resource) {
			try {
				await resource.assertDefinitionCurrent();
			} catch (error) {
				if (resource.page && !resource.page.isCurrent()) await resource.close();
				throw error;
			}
			authority.assertCurrent();
		}
		if (resource && (options.operation === "stop" || options.operation === "open" && (options.resume && resource.paused || !resource.page && !resource.paused))) {
			await resource.close();
			resource = void 0;
			authority.assertCurrent();
		}
		if (!resource) resource = await createResource(definition, authority, options.signal, options.operation);
		authority.assertCurrent();
		resource.assertCurrent();
		return {
			response: response(resource),
			resource
		};
	})();
	const operation = { promise };
	runtime.dashboardOperations.set(operationKey, operation);
	try {
		return await promise;
	} finally {
		if (runtime.dashboardOperations.get(operationKey) === operation) runtime.dashboardOperations.delete(operationKey);
	}
}
//#endregion
//#region extensions/browser/src/gateway/session-browser-request.ts
const identitySchema = strictObject({
	name: string().regex(/^[a-z0-9][a-z0-9._-]{0,63}$/),
	instanceId: string().min(1).optional(),
	sessionKey: string().optional(),
	agentId: string().optional(),
	resume: boolean().optional()
});
const requestSchema = strictObject({
	sessionKey: string().min(1),
	agentId: string().min(1).optional(),
	method: _enum([
		"GET",
		"POST",
		"DELETE"
	]),
	path: string(),
	timeoutMs: number().finite().positive().optional(),
	dashboard: identitySchema.optional(),
	query: record(string(), unknown()).optional(),
	body: record(string(), unknown()).optional()
});
const routes = /* @__PURE__ */ new Set([
	"GET /tabs",
	"GET /snapshot",
	"POST /screenshot",
	"POST /navigate",
	"POST /tabs/focus",
	"POST /act",
	"POST /screencast"
]);
const actions = /* @__PURE__ */ new Set([
	"click",
	"clickCoords",
	"type",
	"press",
	"hover",
	"scrollIntoView",
	"drag",
	"select",
	"fill",
	"resize",
	"wait",
	"evaluate",
	"insertText"
]);
const selectors = [
	"targetId",
	"profile",
	"target",
	"node"
];
/** Closed session route: it never forwards profile, tab, file, cookie or host administration. */
const handleSessionBrowserGatewayRequest = async (options) => {
	const { respond, sessionAccessAuthority: authority, signal: requestSignal, client } = options;
	try {
		if (!authority) throw new Error("Session browser access requires Gateway session admission.");
		const params = requestSchema.parse(options.params);
		await withTimeout(async (timeoutSignal) => {
			const signal = timeoutSignal && requestSignal ? AbortSignal.any([timeoutSignal, requestSignal]) : timeoutSignal ?? requestSignal;
			const identity = identitySchema.parse(params.dashboard ?? (params.method === "GET" ? params.query : params.body));
			if (identity.sessionKey !== void 0 && identity.sessionKey !== params.sessionKey || identity.agentId !== void 0 && identity.agentId !== authority.target.agentId) throw new Error("Dashboard identity must match the admitted session.");
			const assertInvocation = () => {
				signal?.throwIfAborted();
				authority.assertCurrent();
			};
			assertInvocation();
			const dashboard = params.path === "/dashboard";
			if (!dashboard && !routes.has(`${params.method} ${params.path}`)) throw new Error("This operation is unavailable in an isolated session browser.");
			if (!dashboard && [params.query, params.body].some((record) => record && selectors.some((key) => Object.hasOwn(record, key)))) throw new Error("Session browser requests cannot select a browser profile or target.");
			if (params.path === "/act" && (typeof params.body?.kind !== "string" || !actions.has(params.body.kind))) throw new Error("This action is unavailable in an isolated session browser.");
			const { response, resource } = await accessSessionBrowserDashboard({
				sessionKey: params.sessionKey,
				agentId: authority.target.agentId,
				name: identity.name,
				instanceId: identity.instanceId
			}, authority, {
				operation: dashboard ? params.method === "POST" ? "open" : params.method === "DELETE" ? "stop" : "inspect" : "inspect",
				resume: identity.resume ?? params.body?.resume === true,
				signal
			});
			assertInvocation();
			if (dashboard) {
				respond(true, response);
				return;
			}
			const tab = response.browserTab;
			if (!tab || response.paused) throw new Error("The session browser is paused or unavailable. Resume the dashboard first.");
			const context = createBrowserControlContext();
			const assertCurrent = () => {
				assertInvocation();
				resource.assertCurrent();
			};
			assertCurrent();
			if (params.path === "/tabs") {
				const tabs = await context.forProfile(tab.profile).listTabs({ signal });
				assertCurrent();
				respond(true, {
					running: true,
					tabs: tabs.filter((entry) => entry.targetId === tab.targetId)
				});
				return;
			}
			const binding = {
				kind: "tab",
				tabId: 0,
				...tab
			};
			const query = {
				...applyBrowserTabToolBinding(params.query ?? {}, binding),
				managedOnly: true
			};
			const body = applyBrowserTabToolBinding(params.body ?? {}, binding);
			const result = await createBrowserRouteDispatcher(context).dispatch({
				method: params.method,
				path: params.path,
				query,
				body,
				signal,
				assertCurrent,
				screencastAuthority: {
					signal: resource.signal,
					assertCurrent: resource.assertCurrent,
					retainRequester: () => {
						assertInvocation();
						resource.assertCurrent();
						const borrow = authority.retain();
						const viewerSignal = AbortSignal.any([
							borrow.signal,
							resource.signal,
							...client?.connectionSignal ? [client.connectionSignal] : []
						]);
						return {
							signal: viewerSignal,
							release: borrow.release,
							isCurrent: () => {
								try {
									viewerSignal.throwIfAborted();
									borrow.assertCurrent();
									resource.assertCurrent();
									return client?.invalidated !== true;
								} catch {
									return false;
								}
							}
						};
					}
				}
			});
			assertCurrent();
			if (result.status >= 400) {
				const payload = asNullableRecord(result.body);
				respond(false, void 0, errorShape(result.status >= 500 ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, typeof payload?.error === "string" ? payload.error : "Session browser request failed.", { details: result.body }));
				return;
			}
			respond(true, result.body);
		}, params.timeoutMs, "session browser request");
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : String(error)));
	}
};
//#endregion
//#region extensions/browser/src/node-host/invoke-browser.ts
function readOwnedTabCloseRequest(value) {
	const record = asNullableRecord(value);
	const ownership = asNullableRecord(record?.ownership);
	if (ownership?.status !== "durable" || typeof ownership.nativeTargetId !== "string" || !ownership.nativeTargetId.trim() || typeof ownership.profileFingerprint !== "string" || !ownership.profileFingerprint.trim() || typeof ownership.browserInstanceFingerprint !== "string" || !ownership.browserInstanceFingerprint.trim()) throw new Error("INVALID_REQUEST: valid durable tab ownership required");
	return { ownership: {
		status: "durable",
		nativeTargetId: ownership.nativeTargetId.trim(),
		profileFingerprint: ownership.profileFingerprint.trim(),
		browserInstanceFingerprint: ownership.browserInstanceFingerprint.trim()
	} };
}
const BROWSER_PROXY_STATUS_TIMEOUT_MS = 750;
const BROWSER_PROXY_MAX_ENCODED_PAYLOAD_BYTES = 25165824;
function countBrowserProxyEncodedPayloadBytes(serialized) {
	let bytes = Buffer.byteLength(serialized, "utf8") + 2;
	for (const character of "\"\\") {
		const code = character.charCodeAt(0);
		let index = serialized.indexOf(character);
		while (index !== -1) {
			const end = Math.min(index + 128, serialized.length);
			for (; index < end; index++) if (serialized.charCodeAt(index) === code) bytes++;
			index = serialized.indexOf(character, index);
		}
	}
	const wellFormed = toUSVString(serialized);
	if (wellFormed !== serialized) {
		for (let index = wellFormed.indexOf("�"); index !== -1; index = wellFormed.indexOf("�", index + 1)) if (serialized.charCodeAt(index) !== 65533) bytes += 3;
	}
	return bytes;
}
function resolveBrowserProxyConfig(cfg = loadBrowserConfigForRuntimeRefresh()) {
	const proxy = cfg.nodeHost?.browserProxy;
	if (proxy?.enabled === false) throw new Error("UNAVAILABLE: node browser proxy disabled");
	return { allowProfiles: Array.isArray(proxy?.allowProfiles) ? normalizeStringEntries(proxy.allowProfiles) : [] };
}
let browserControlReady = null;
let admittedBrowserControlState = null;
function hasBrowserNodeHostWork() {
	return hasBrowserControlWork() || hasBrowserProxyUploadWork();
}
async function ensureBrowserControlService() {
	const current = getBrowserControlState();
	if (current && current === admittedBrowserControlState) return;
	if (browserControlReady) return browserControlReady;
	const sharedStartup = (async () => {
		const cfg = loadBrowserConfigForRuntimeRefresh();
		if (!resolveBrowserConfig(cfg.browser, cfg).enabled) throw new Error(await describeBrowserControlUnavailable(cfg));
		const started = await startBrowserControlServiceFromConfig();
		if (!started) throw new Error(await describeBrowserControlUnavailable(cfg));
		admittedBrowserControlState = started;
	})().finally(() => {
		if (browserControlReady === sharedStartup) browserControlReady = null;
	});
	browserControlReady = sharedStartup;
	return sharedStartup;
}
function collectBrowserProxyPaths(payload) {
	const paths = /* @__PURE__ */ new Set();
	visitBrowserProxyFilePaths(payload, (filePath) => {
		paths.add(filePath.trim());
		assertBrowserProxyFileCountWithinLimit(paths.size);
	});
	return [...paths];
}
async function readBrowserProxyFiles(filePaths) {
	const files = [];
	let totalBytes = 0;
	for (const filePath of filePaths) try {
		const stat = await fs.stat(filePath).catch(() => null);
		if (!stat || !stat.isFile()) throw new Error("file not found");
		assertBrowserProxyFileBytesWithinLimits(stat.size, totalBytes + stat.size);
		const buffer = await fs.readFile(filePath);
		assertBrowserProxyFileBytesWithinLimits(buffer.byteLength, totalBytes + buffer.byteLength);
		totalBytes += buffer.byteLength;
		const mimeType = await detectMime({
			buffer,
			filePath
		});
		files.push({
			path: filePath,
			base64: buffer.toString("base64"),
			mimeType
		});
	} catch (err) {
		throw new Error(`browser proxy file read failed for ${filePath}: ${String(err)}`, { cause: err });
	}
	return files;
}
function isBrowserProxyTimeoutError(err) {
	return String(err).includes("browser proxy request timed out");
}
function combineBrowserProxySignals(timeoutSignal, invocationSignal) {
	if (timeoutSignal && invocationSignal) return AbortSignal.any([timeoutSignal, invocationSignal]);
	return timeoutSignal ?? invocationSignal;
}
function isWsBackedBrowserProxyPath(path) {
	return path === "/act" || path === "/download" || path === "/navigate" || path === "/pdf" || path === "/screenshot" || path === "/snapshot" || path === "/wait/download";
}
async function readBrowserProxyStatus(params) {
	const query = params.profile ? { profile: params.profile } : {};
	try {
		const response = await withTimeout((signal) => params.dispatcher.dispatch({
			method: "GET",
			path: "/",
			query,
			signal
		}), BROWSER_PROXY_STATUS_TIMEOUT_MS, "browser proxy status");
		if (response.status >= 400 || !response.body || typeof response.body !== "object") return null;
		const body = response.body;
		return {
			running: body.running,
			transport: body.transport,
			cdpHttp: body.cdpHttp,
			cdpReady: body.cdpReady,
			cdpUrl: body.cdpUrl
		};
	} catch {
		return null;
	}
}
function formatBrowserProxyTimeoutMessage(params) {
	const parts = [`browser proxy timed out for ${params.method} ${params.path} after ${params.timeoutMs}ms`, params.wsBacked ? "ws-backed browser action" : "browser action"];
	if (params.profile) parts.push(`profile=${params.profile}`);
	if (params.status) {
		const statusParts = [
			`running=${String(params.status.running)}`,
			`cdpHttp=${String(params.status.cdpHttp)}`,
			`cdpReady=${String(params.status.cdpReady)}`
		];
		if (typeof params.status.transport === "string" && params.status.transport.trim()) statusParts.push(`transport=${params.status.transport}`);
		if (typeof params.status.cdpUrl === "string" && params.status.cdpUrl.trim()) statusParts.push(`cdpUrl=${redactCdpUrl(params.status.cdpUrl)}`);
		parts.push(`status(${statusParts.join(", ")})`);
	}
	return parts.join("; ");
}
async function runBrowserProxyCommand(paramsJSON, command = BROWSER_PROXY_COMMAND, invocationSignal) {
	invocationSignal?.throwIfAborted();
	ensureBrowserProxyUploadCleanup();
	if (!paramsJSON) throw new Error("INVALID_REQUEST: paramsJSON required");
	const params = JSON.parse(paramsJSON);
	if (command === "browser.proxy" && params.upload !== void 0) throw new Error("INVALID_REQUEST: browser.proxy does not accept upload envelopes");
	if (command === "browser.proxy.upload.v1" && !params.upload) throw new Error("INVALID_REQUEST: browser.proxy.upload.v1 requires an upload envelope");
	if (command !== "browser.proxy" && command !== "browser.proxy.upload.v1") throw new Error(`INVALID_REQUEST: unsupported browser proxy command: ${command}`);
	const pathValue = typeof params.path === "string" ? params.path.trim() : "";
	if (!pathValue) throw new Error("INVALID_REQUEST: path required");
	resolveBrowserProxyConfig();
	const method = typeof params.method === "string" ? params.method.trim().toUpperCase() : "GET";
	const path = normalizeBrowserRequestPath(pathValue);
	if (method !== "GET" && method !== "POST" && method !== "DELETE") throw new Error("INVALID_REQUEST: method must be GET, POST, or DELETE");
	if (path === "/__openclaw/session-tab/close-owned" && method !== "POST") throw new Error("INVALID_REQUEST: owned tab close requires POST");
	await ensureBrowserControlService();
	invocationSignal?.throwIfAborted();
	const cfg = loadBrowserConfigForRuntimeRefresh();
	const resolved = resolveBrowserConfig(cfg.browser, cfg);
	let body = params.body;
	const requestedProfile = resolveRequestedBrowserProfile({
		query: params.query,
		body,
		profile: params.profile
	}) ?? "";
	const effectiveProfile = path === "/profiles" ? "" : requestedProfile || resolved.defaultProfile;
	const effectiveResolvedProfile = effectiveProfile ? resolveProfile(resolved, effectiveProfile) : null;
	const route = effectiveResolvedProfile ? {
		status: "resolved",
		profile: effectiveProfile,
		driver: effectiveResolvedProfile.driver
	} : { status: "unavailable" };
	const includeRoute = params.errorEnvelope === BROWSER_PROXY_ERROR_ENVELOPE;
	const allowedProfiles = resolveBrowserProxyConfig(cfg).allowProfiles;
	if (isPersistentBrowserProfileMutation(method, path)) throw new Error("INVALID_REQUEST: browser.proxy cannot mutate persistent browser profiles");
	if (isBrowserHostLocalRoute(method, path)) throw new Error("INVALID_REQUEST: browser.proxy cannot run host-local browser routes");
	const assertCurrent = (profile) => {
		invocationSignal?.throwIfAborted();
		const current = resolveBrowserProxyConfig();
		const selected = profile?.name || effectiveProfile || requestedProfile;
		if ((path !== "/profiles" || selected) && current.allowProfiles.length > 0 && (!selected || !current.allowProfiles.includes(selected.trim()))) throw new Error("INVALID_REQUEST: browser profile not allowed");
	};
	assertCurrent();
	const timeoutMs = resolveBrowserProxyTimeoutMs(params.timeoutMs);
	const deadlineAt = Date.now() + timeoutMs;
	const timeoutDetails = {
		method,
		path,
		profile: requestedProfile || resolved.defaultProfile || void 0,
		timeoutMs,
		wsBacked: isWsBackedBrowserProxyPath(path)
	};
	const query = {};
	const rawQuery = params.query ?? {};
	for (const [key, value] of Object.entries(rawQuery)) {
		if (value === void 0 || value === null) continue;
		query[key] = typeof value === "string" ? value : String(value);
	}
	if (effectiveProfile || requestedProfile) query.profile = effectiveProfile || requestedProfile;
	if (path === "/__openclaw/session-tab/close-owned") {
		const request = readOwnedTabCloseRequest(body);
		const liveResolved = getBrowserControlState()?.resolved ?? resolved;
		const profile = resolveProfile(liveResolved, effectiveProfile);
		assertCurrent(profile ?? void 0);
		const result = profile?.cdpUrl && effectiveProfile ? await closeTrackedCdpTarget({
			profileName: effectiveProfile,
			cdpUrl: profile.cdpUrl,
			nativeTargetId: request.ownership.nativeTargetId,
			expectedProfileFingerprint: request.ownership.profileFingerprint,
			expectedBrowserInstanceFingerprint: request.ownership.browserInstanceFingerprint,
			timeoutMs: liveResolved.remoteCdpTimeoutMs,
			ssrfPolicy: resolveCdpControlPolicy(profile, liveResolved.ssrfPolicy),
			signal: invocationSignal,
			closeIfCurrent: async (dispatch) => {
				assertCurrent(profile);
				return await dispatch();
			}
		}) : { status: "ownership-mismatch" };
		return JSON.stringify({
			result,
			...includeRoute ? { route } : {}
		});
	}
	const dispatcher = createBrowserRouteDispatcher(createBrowserControlContext());
	let stagedUpload;
	try {
		stagedUpload = await withTimeout((timeoutSignal) => stageBrowserProxyUploadRequest({
			method,
			path,
			body,
			upload: params.upload,
			signal: combineBrowserProxySignals(timeoutSignal, invocationSignal)
		}), timeoutMs, "browser proxy request");
	} catch (err) {
		if (!isBrowserProxyTimeoutError(err)) throw err;
		throw new Error(formatBrowserProxyTimeoutMessage({
			...timeoutDetails,
			status: null
		}), { cause: err });
	}
	body = stagedUpload.body;
	try {
		assertCurrent();
	} catch (error) {
		await discardStagedBrowserProxyUpload(stagedUpload);
		throw error;
	}
	const remainingTimeoutMs = deadlineAt - Date.now();
	if (remainingTimeoutMs <= 0) {
		await discardStagedBrowserProxyUpload(stagedUpload);
		throw new Error(formatBrowserProxyTimeoutMessage({
			...timeoutDetails,
			status: null
		}));
	}
	let response;
	try {
		response = await withTimeout((timeoutSignal) => dispatcher.dispatch({
			method,
			path,
			query,
			body,
			signal: combineBrowserProxySignals(timeoutSignal, invocationSignal),
			assertCurrent: async (profile) => {
				assertCurrent(profile);
			}
		}), remainingTimeoutMs, "browser proxy request");
	} catch (err) {
		if (!isBrowserProxyTimeoutError(err)) throw err;
		const profileForStatus = requestedProfile || resolved.defaultProfile;
		const status = await readBrowserProxyStatus({
			dispatcher,
			profile: path === "/profiles" ? void 0 : profileForStatus
		});
		throw new Error(formatBrowserProxyTimeoutMessage({
			...timeoutDetails,
			profile: path === "/profiles" ? void 0 : profileForStatus || void 0,
			status
		}), { cause: err });
	}
	if (response.status >= 400) {
		await discardStagedBrowserProxyUpload(stagedUpload);
		if (params.errorEnvelope === "browser-v1") return JSON.stringify(createBrowserProxyFailure(response.status, response.body, route));
		const detail = response.body && typeof response.body === "object" && "error" in response.body ? String(response.body.error).trim() : "";
		throw new Error(detail ? `${response.status}: ${detail}` : `HTTP ${response.status}`);
	}
	const result = response.body;
	if (allowedProfiles.length > 0 && path === "/profiles") {
		const obj = typeof result === "object" && result !== null ? result : {};
		obj.profiles = (Array.isArray(obj.profiles) ? obj.profiles : []).filter((entry) => {
			if (!entry || typeof entry !== "object") return false;
			const name = entry.name;
			return typeof name === "string" && allowedProfiles.includes(name);
		});
	}
	const paths = collectBrowserProxyPaths(result);
	const files = paths.length > 0 ? await readBrowserProxyFiles(paths) : void 0;
	const payload = {
		result,
		...files ? { files } : {},
		...includeRoute ? { route } : {}
	};
	const serialized = JSON.stringify(payload);
	if (countBrowserProxyEncodedPayloadBytes(serialized) > BROWSER_PROXY_MAX_ENCODED_PAYLOAD_BYTES) throw new Error("browser proxy payload exceeds 24 MiB encoded limit");
	return serialized;
}
//#endregion
//#region extensions/browser/src/plugin-service.ts
const EAGER_BROWSER_CONTROL_SERVICE_ENV = "OPENCLAW_EAGER_BROWSER_CONTROL_SERVER";
const UNSAFE_BROWSER_CONTROL_OVERRIDE_SPECIFIER = /^(?:data|http|https|node):/i;
function validateBrowserControlOverrideSpecifier(specifier) {
	const trimmed = specifier.trim();
	if (UNSAFE_BROWSER_CONTROL_OVERRIDE_SPECIFIER.test(trimmed)) throw new Error(`Refusing unsafe browser control override specifier: ${trimmed}`);
	return trimmed;
}
function createBrowserPluginService(params) {
	let handle = null;
	return {
		id: "browser-control",
		start: async () => {
			if (!isTruthyEnvValue(process.env[EAGER_BROWSER_CONTROL_SERVICE_ENV])) return;
			if (handle) return;
			handle = await startLazyPluginServiceModule({
				skipEnvVar: "OPENCLAW_SKIP_BROWSER_CONTROL_SERVER",
				overrideEnvVar: "OPENCLAW_BROWSER_CONTROL_MODULE",
				validateOverrideSpecifier: validateBrowserControlOverrideSpecifier,
				loadDefaultModule: async () => await import("../../server-avx1e9vG.mjs"),
				startExportNames: ["startBrowserControlServiceFromConfig", "startBrowserControlServerFromConfig"],
				stopExportNames: ["stopBrowserControlService", "stopBrowserControlServer"]
			});
		},
		stop: async () => {
			const current = handle;
			if (current) {
				await current.stop();
				if (handle === current) handle = null;
				return;
			}
			await params.stopOnDemand();
		}
	};
}
//#endregion
//#region extensions/browser/src/security-audit.ts
const BLOCKED_HOSTNAMES = /* @__PURE__ */ new Set([
	"localhost",
	"localhost.localdomain",
	"metadata.google.internal"
]);
function isTrustedPrivateHostname(hostname) {
	const normalized = normalizeLowercaseStringOrEmpty(hostname);
	return normalized.length > 0 && BLOCKED_HOSTNAMES.has(normalized);
}
function collectBrowserSecurityAuditFindings(ctx) {
	const findings = [];
	let resolved;
	try {
		resolved = resolveBrowserConfig(ctx.config.browser, ctx.config);
	} catch (err) {
		findings.push({
			checkId: "browser.control_invalid_config",
			severity: "warn",
			title: "Browser control config looks invalid",
			detail: String(err),
			remediation: `Fix browser.cdpUrl in ${ctx.configPath} and re-run "${formatCliCommand("openclaw security audit --deep")}".`
		});
		return findings;
	}
	if (!resolved.enabled) return findings;
	if (resolved.extensionRelay.allowLegacyAuth) findings.push({
		checkId: "browser.extension_relay_legacy_auth",
		severity: "warn",
		title: "Legacy browser extension relay authentication is enabled",
		detail: "browser.extensionRelay.allowLegacyAuth defaults to true for one migration window, so old relay Bearer, Basic, and token-subprotocol clients can still authenticate.",
		remediation: "Update paired Chrome extensions and external CDP clients to Browser Relay Authentication v2, then set browser.extensionRelay.allowLegacyAuth=false."
	});
	const browserAuth = resolveBrowserControlAuth(ctx.config, ctx.env);
	const explicitAuthMode = ctx.config.gateway?.auth?.mode;
	const tokenConfigured = Boolean(browserAuth.token) || hasNonEmptyString(ctx.env.OPENCLAW_GATEWAY_TOKEN) || hasConfiguredSecretInput(ctx.config.gateway?.auth?.token, ctx.config.secrets?.defaults);
	const passwordCanWin = explicitAuthMode === "password" || explicitAuthMode !== "token" && explicitAuthMode !== "none" && explicitAuthMode !== "trusted-proxy" && !tokenConfigured;
	const passwordConfigured = Boolean(browserAuth.password) || passwordCanWin && (hasNonEmptyString(ctx.env.OPENCLAW_GATEWAY_PASSWORD) || hasConfiguredSecretInput(ctx.config.gateway?.auth?.password, ctx.config.secrets?.defaults));
	if (!tokenConfigured && !passwordConfigured) findings.push({
		checkId: "browser.control_no_auth",
		severity: "critical",
		title: "Browser control has no auth",
		detail: "Browser control HTTP routes are enabled but no gateway.auth token/password is configured. Any local process (or SSRF to loopback) can call browser control endpoints.",
		remediation: "Set gateway.auth.token (recommended) or gateway.auth.password so browser control HTTP routes require authentication. Restarting the gateway will auto-generate gateway.auth.token when browser control is enabled."
	});
	for (const name of Object.keys(resolved.profiles)) {
		const profile = resolveProfile(resolved, name);
		if (!profile || profile.cdpIsLoopback) continue;
		let url;
		try {
			url = new URL(profile.cdpUrl);
		} catch {
			continue;
		}
		const redactedCdpUrl = redactCdpUrl(profile.cdpUrl) ?? profile.cdpUrl;
		if (url.protocol === "http:") findings.push({
			checkId: "browser.remote_cdp_http",
			severity: "warn",
			title: "Remote CDP uses HTTP",
			detail: `browser profile "${name}" uses http CDP (${redactedCdpUrl}); this is OK only if it's tailnet-only or behind an encrypted tunnel.`,
			remediation: "Prefer HTTPS/TLS or a tailnet-only endpoint for remote CDP."
		});
		if (isPrivateNetworkOptInEnabled(resolved.ssrfPolicy) && (isTrustedPrivateHostname(url.hostname) || isPrivateIpAddress(url.hostname))) findings.push({
			checkId: "browser.remote_cdp_private_host",
			severity: "warn",
			title: "Remote CDP targets a private/internal host",
			detail: `browser profile "${name}" points at a private/internal CDP host (${redactedCdpUrl}). This is expected for LAN/tailnet/WSL-style setups, but treat it as a trusted-network endpoint.`,
			remediation: "Prefer a tailnet or tunnel for remote CDP. If you want strict blocking, set browser.ssrfPolicy.dangerouslyAllowPrivateNetwork=false and allow only explicit hosts."
		});
	}
	return findings;
}
//#endregion
export { collectBrowserSecurityAuditFindings, createBrowserPluginService, createBrowserTool, handleBrowserGatewayRequest, handleSessionBrowserGatewayRequest, hasBrowserNodeHostWork, runBrowserProxyCommand, stopBrowserControlService };
