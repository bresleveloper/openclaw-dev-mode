import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { t as getSessionMcpRequestSignal } from "./agent-bundle-mcp-request-context-SqXfuSsz.mjs";
import { a as projectMcpAppModelContextInput, i as leaseMcpAppModelContextForTurn, n as clearMcpAppModelContextForView, u as completeDeferredSessionMcpRuntimeRetirement } from "./mcp-app-model-context-XPQPOrco.mjs";
import { a as normalizeSandboxHostCsp, o as resolveSandboxHostPort, r as buildSandboxHostPath } from "./sandbox-host-BRz3YO81.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/mcp-app-sandbox.ts
const normalizeMcpAppCsp = normalizeSandboxHostCsp;
const buildMcpAppSandboxPath = buildSandboxHostPath;
const resolveMcpAppSandboxPort = resolveSandboxHostPort;
//#endregion
//#region src/agents/mcp-ui-resource.ts
const MCP_APP_RESOURCE_MIME_TYPE = "text/html;profile=mcp-app";
const MCP_APP_RESOURCE_MAX_BYTES = 2097152;
const MCP_APP_VIEW_TTL_MS = 6e5;
const MCP_APP_VIEW_MAX_ENTRIES = 32;
const MCP_APP_VIEW_MAX_BYTES = 6291456;
const MCP_APP_VIEW_STORE_MAX_BYTES = 67108864;
const MCP_APP_VIEW_STORE_KEY = Symbol.for("openclaw.mcpAppViewStore");
/** Retain only the bounded view identity needed for late channel materialization. */
function readMcpAppChannelView(result) {
	const details = asOptionalRecord(asOptionalRecord(result)?.details);
	const preview = asOptionalRecord(details?.mcpAppPreview);
	const view = asOptionalRecord(preview?.view);
	const descriptor = asOptionalRecord(preview?.mcpApp);
	const viewId = typeof descriptor?.viewId === "string" ? descriptor.viewId.trim() : "";
	const projectedViewId = typeof view?.id === "string" ? view.id.trim() : "";
	if (!viewId || projectedViewId !== viewId) return;
	return { viewId };
}
function getViewStore() {
	return resolveGlobalMap(MCP_APP_VIEW_STORE_KEY);
}
function deleteView(viewId, expected) {
	const store = getViewStore();
	const view = store.get(viewId);
	if (!view || expected && view !== expected) return;
	clearTimeout(view.expiryTimer);
	view.toolApprovalGrants?.clear();
	clearMcpAppModelContextForView(view.runtime, view);
	notifyListeners(view.disposeCallbacks ?? [], void 0, (error) => {
		logWarn(`mcp-app: view cleanup failed: ${formatErrorMessage(error)}`);
	});
	view.disposeCallbacks?.clear();
	view.releaseRuntimeLease?.();
	store.delete(viewId);
	completeDeferredSessionMcpRuntimeRetirement(view.runtime).catch((error) => {
		logWarn(`mcp-app: deferred runtime cleanup failed: ${formatErrorMessage(error)}`);
	});
}
/** Retire only the exact runtime-owned view, including form preview children. */
function releaseMcpAppView(viewId, runtime) {
	const view = getViewStore().get(viewId);
	if (view?.runtime === runtime) deleteView(viewId, view);
}
function pruneViewStore(additionalBytes = 0, options) {
	const store = getViewStore();
	const nowMs = options?.nowMs ?? Date.now();
	for (const [viewId, view] of store) if (view.expiresAtMs <= nowMs) deleteView(viewId, view);
	let totalBytes = Array.from(store.values()).reduce((sum, view) => sum + (view.byteSize ?? 0), 0);
	while (store.size + (options?.reserveEntry ? 1 : 0) > MCP_APP_VIEW_MAX_ENTRIES || totalBytes + additionalBytes > MCP_APP_VIEW_STORE_MAX_BYTES) {
		const oldest = store.keys().next().value;
		if (oldest === void 0) return;
		const evicted = store.get(oldest);
		totalBytes -= evicted?.byteSize ?? 0;
		if (evicted) deleteView(oldest, evicted);
	}
}
function measureViewBytes(html, toolInput, toolResult) {
	const toolData = JSON.stringify({
		toolInput,
		toolResult
	});
	const byteSize = Buffer.byteLength(html, "utf8") + Buffer.byteLength(toolData, "utf8");
	if (byteSize > MCP_APP_VIEW_MAX_BYTES) throw new Error(`MCP App view data exceeds ${MCP_APP_VIEW_MAX_BYTES} bytes`);
	return byteSize;
}
function assertBoundedViewDescriptor(value) {
	if (value.viewId && (value.viewId.length > 128 || !value.viewId.startsWith("mcp-app-")) || !value.serverName || value.serverName.length > 256 || !value.toolName || value.toolName.length > 256 || !value.uiResourceUri.startsWith("ui://") || value.uiResourceUri.length > 2048 || value.toolCallId !== void 0 && value.toolCallId.length > 512) throw new Error("MCP App preview descriptor exceeds safe limits");
}
function normalizePermissions(value) {
	const record = asOptionalRecord(value);
	if (!record) return;
	const permissions = {};
	for (const key of [
		"camera",
		"clipboardWrite",
		"geolocation",
		"microphone"
	]) if (asOptionalRecord(record[key])) permissions[key] = {};
	return Object.keys(permissions).length > 0 ? permissions : void 0;
}
function decodeResourceHtml(content) {
	if (typeof content.text === "string") {
		if (Buffer.byteLength(content.text, "utf8") > MCP_APP_RESOURCE_MAX_BYTES) throw new Error(`MCP App resource exceeds ${MCP_APP_RESOURCE_MAX_BYTES} bytes`);
		return content.text;
	}
	if (typeof content.blob !== "string") throw new Error("MCP App resource must provide text or base64 blob content");
	const maxEncodedBytes = Math.ceil(MCP_APP_RESOURCE_MAX_BYTES / 3) * 4 + 4;
	if (content.blob.length > maxEncodedBytes) throw new Error(`MCP App resource exceeds ${MCP_APP_RESOURCE_MAX_BYTES} bytes`);
	const decoded = Buffer.from(content.blob, "base64");
	if (decoded.byteLength > MCP_APP_RESOURCE_MAX_BYTES) throw new Error(`MCP App resource exceeds ${MCP_APP_RESOURCE_MAX_BYTES} bytes`);
	return decoded.toString("utf8");
}
async function resolveListingUiMeta(runtime, serverName, uri) {
	try {
		const listed = await runtime.listResources?.(serverName, { failureBackoff: "ignore" });
		const { _meta: metadata } = (Array.isArray(listed) ? listed : Array.isArray(asOptionalRecord(listed)?.resources) ? asOptionalRecord(listed)?.resources : []).map(asOptionalRecord).find((entry) => entry?.uri === uri) ?? {};
		return asOptionalRecord(asOptionalRecord(metadata)?.ui);
	} catch (error) {
		logWarn(`mcp-app: failed to read optional listing metadata for ${uri} from "${serverName}": ${formatErrorMessage(error)}`);
		return;
	}
}
async function fetchMcpAppView(params) {
	let releaseRuntimeLease;
	try {
		assertBoundedViewDescriptor(params);
		const agentId = params.agentId ? normalizeAgentId(params.agentId) : parseAgentSessionKey(params.runtime.sessionKey)?.agentId;
		if (!agentId) throw new Error("MCP App view requires a resolved session owner");
		if (!params.runtime.readResource) return;
		const result = asOptionalRecord(await params.runtime.readResource(params.serverName, params.uiResourceUri, { failureBackoff: "ignore" }));
		const contents = Array.isArray(result?.contents) ? result.contents : [];
		if (contents.length !== 1) throw new Error(`expected one MCP App resource, received ${contents.length}`);
		const content = asOptionalRecord(contents[0]);
		if (!content || content.mimeType !== MCP_APP_RESOURCE_MIME_TYPE) throw new Error(`resource must use ${MCP_APP_RESOURCE_MIME_TYPE}`);
		const html = decodeResourceHtml(content);
		const byteSize = measureViewBytes(html, params.toolInput, params.toolResult);
		const { _meta: metadata, meta: deprecatedMetadata } = content;
		const contentUiMeta = asOptionalRecord(asOptionalRecord(metadata ?? deprecatedMetadata)?.ui);
		const listingUiMeta = contentUiMeta ? void 0 : await resolveListingUiMeta(params.runtime, params.serverName, params.uiResourceUri);
		getSessionMcpRequestSignal()?.throwIfAborted();
		const uiMeta = contentUiMeta ?? listingUiMeta;
		const openaiUi = asOptionalRecord(asOptionalRecord(metadata)?.["openai/ui"]);
		const supportedModes = ["inline", "fullscreen"];
		const advertisedDisplayModes = openaiUi?.availableDisplayModes;
		const availableDisplayModes = Array.isArray(advertisedDisplayModes) ? supportedModes.filter((mode) => advertisedDisplayModes.includes(mode)) : void 0;
		const preferredDisplayMode = openaiUi?.preferredDisplayMode === "inline" || openaiUi?.preferredDisplayMode === "fullscreen" ? openaiUi.preferredDisplayMode : void 0;
		const displayModes = availableDisplayModes || preferredDisplayMode ? {
			availableDisplayModes: availableDisplayModes ?? [preferredDisplayMode],
			...preferredDisplayMode ? { preferredDisplayMode } : {}
		} : void 0;
		const requestedDisplayMode = params.displayMode ?? preferredDisplayMode ?? "inline";
		const csp = normalizeMcpAppCsp(uiMeta?.csp);
		const permissions = normalizePermissions(uiMeta?.permissions);
		const title = `${params.toolName} UI`;
		const viewId = params.viewId ?? `mcp-app-${randomUUID()}`;
		releaseRuntimeLease = params.runtime.acquireLease?.();
		deleteView(viewId);
		pruneViewStore(byteSize, { reserveEntry: true });
		const view = {
			viewId,
			runtime: params.runtime,
			agentId,
			sessionId: params.runtime.sessionId,
			serverName: params.serverName,
			toolName: params.toolName,
			uiResourceUri: params.uiResourceUri,
			...params.toolCallId ? { toolCallId: params.toolCallId } : {},
			html,
			...csp ? { csp } : {},
			...permissions ? { permissions } : {},
			...params.allowedAppToolNames ? { allowedAppToolNames: new Set(params.allowedAppToolNames) } : {},
			...params.prepareToolCall ? { prepareToolCall: params.prepareToolCall } : {},
			...params.uploadResources ? { uploadResources: params.uploadResources } : {},
			...params.authorizeAppInteraction ? { authorizeAppInteraction: params.authorizeAppInteraction } : {},
			...params.readOnly ? { readOnly: true } : {},
			requesterId: params.requesterId,
			...params.hostFile ? { hostFile: params.hostFile } : {},
			...params.richModelContextSupported !== void 0 ? { richModelContextSupported: params.richModelContextSupported } : {},
			...params.deepLink ? { deepLink: params.deepLink } : {},
			displayMode: availableDisplayModes?.length && !availableDisplayModes.includes(requestedDisplayMode) ? availableDisplayModes[0] : requestedDisplayMode,
			...displayModes ? { displayModes } : {},
			toolInput: params.toolInput,
			toolResult: params.toolResult,
			expiresAtMs: Date.now() + MCP_APP_VIEW_TTL_MS,
			requestWindowStartedAtMs: Date.now(),
			requestCount: 0,
			toolCallCount: 0,
			activeRequests: 0,
			byteSize,
			...releaseRuntimeLease ? { releaseRuntimeLease } : {}
		};
		releaseRuntimeLease = void 0;
		view.expiryTimer = setTimeout(() => {
			deleteView(view.viewId, view);
		}, MCP_APP_VIEW_TTL_MS);
		view.expiryTimer.unref?.();
		getViewStore().set(viewId, view);
		return {
			viewId,
			title,
			serverName: params.serverName,
			toolName: params.toolName,
			uiResourceUri: params.uiResourceUri,
			...params.toolCallId ? { toolCallId: params.toolCallId } : {}
		};
	} catch (error) {
		releaseRuntimeLease?.();
		getSessionMcpRequestSignal()?.throwIfAborted();
		logWarn(`mcp-app: failed to prepare ${params.uiResourceUri} from "${params.serverName}": ${formatErrorMessage(error)}`);
		return;
	}
}
function getMcpAppViewLease(viewId, runtime) {
	pruneViewStore();
	const view = getViewStore().get(viewId);
	return view?.runtime === runtime ? view : void 0;
}
/** Resolve a live view owned by its originating session, including harness-native runtimes. */
function getMcpAppViewLeaseForSession(viewId, sessionKey, agentId) {
	pruneViewStore();
	const view = getViewStore().get(viewId);
	return view?.runtime.sessionKey === sessionKey && view.agentId === normalizeAgentId(agentId) ? view : void 0;
}
/** The bounded live-view owner joins managed, discovery and native runtimes for one exact turn. */
async function leaseMcpAppModelContextForSessionTurn(params) {
	if (!params.sessionKey) return;
	const agentId = normalizeAgentId(params.agentId ?? parseAgentSessionKey(params.sessionKey)?.agentId);
	pruneViewStore();
	const byRuntime = /* @__PURE__ */ new Map();
	for (const view of getViewStore().values()) {
		if (view.runtime.sessionKey !== params.sessionKey || view.sessionId !== params.sessionId || view.agentId !== agentId || view.requesterId !== void 0 && view.requesterId !== params.requesterId || view.readOnly || view.allowedAppToolNames === void 0) continue;
		try {
			view.runtime.assertOwnerCurrent?.();
			if (view.authorizeAppInteraction && !await view.authorizeAppInteraction()) continue;
		} catch {
			continue;
		}
		if (getMcpAppViewLease(view.viewId, view.runtime) !== view || view.runtime.mcpAppModelContextRevoked) continue;
		const views = byRuntime.get(view.runtime) ?? /* @__PURE__ */ new Set();
		views.add(view);
		byRuntime.set(view.runtime, views);
	}
	const leases = [...byRuntime].flatMap(([runtime, views]) => {
		const lease = leaseMcpAppModelContextForTurn({
			runtime,
			views
		});
		return lease ? [lease] : [];
	});
	if (!leases.length) return;
	const modelContext = leases.flatMap((lease) => lease.modelContext);
	return {
		project: (imageOffset) => projectMcpAppModelContextInput(modelContext, imageOffset),
		assertCurrent: () => {
			for (const lease of leases) lease.assertCurrent();
		},
		commit: () => {
			for (const lease of leases) lease.commit();
		},
		rollback: () => {
			for (const lease of leases) lease.rollback();
		}
	};
}
function acquireMcpAppViewRequest(view, kind, nowMs = Date.now()) {
	if (nowMs - view.requestWindowStartedAtMs >= 6e4) {
		view.requestWindowStartedAtMs = nowMs;
		view.requestCount = 0;
		view.toolCallCount = 0;
	}
	if (view.activeRequests >= 4) throw new Error("MCP App request concurrency limit reached");
	if (view.requestCount >= 120 || kind === "tool" && view.toolCallCount >= 30) throw new Error("MCP App request rate limit reached");
	view.requestCount += 1;
	if (kind === "tool") view.toolCallCount += 1;
	view.activeRequests += 1;
	let released = false;
	return () => {
		if (!released) {
			released = true;
			view.activeRequests = Math.max(0, view.activeRequests - 1);
		}
	};
}
function buildMcpAppCanvasPayload(view) {
	assertBoundedViewDescriptor(view);
	return {
		kind: "canvas",
		view: {
			id: view.viewId,
			title: view.title
		},
		presentation: {
			target: "assistant_message",
			title: view.title,
			preferred_height: 600,
			sandbox: "scripts"
		},
		mcpApp: {
			viewId: view.viewId,
			serverName: view.serverName,
			toolName: view.toolName,
			uiResourceUri: view.uiResourceUri,
			...view.toolCallId ? { toolCallId: view.toolCallId } : {},
			...view.originSessionKey ? { originSessionKey: view.originSessionKey } : {},
			...view.resultMetaState ? { resultMetaState: view.resultMetaState } : {}
		}
	};
}
const testing = { clearViewStore() {
	for (const [viewId, view] of getViewStore()) deleteView(viewId, view);
} };
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.mcpUiResourceTestApi")] = testing;
//#endregion
export { getMcpAppViewLeaseForSession as a, releaseMcpAppView as c, getMcpAppViewLease as i, buildMcpAppSandboxPath as l, buildMcpAppCanvasPayload as n, leaseMcpAppModelContextForSessionTurn as o, fetchMcpAppView as r, readMcpAppChannelView as s, acquireMcpAppViewRequest as t, resolveMcpAppSandboxPort as u };
