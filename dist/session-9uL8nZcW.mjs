import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { i as rethrowIncognitoSessionError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./session-store-runtime-DVNFhqCK.mjs";
import { i as ACTIVE_MEMORY_DEBUG_PREFIX, l as ACTIVE_MEMORY_STATUS_PREFIX } from "./types-DgEaE0BK.mjs";
//#region extensions/active-memory/session.ts
/** Request-owned preparation only; the host audience still guards recall and publication. */
async function prepareActiveMemorySession(params) {
	const sessionKey = params.sessionKey?.trim() || void 0;
	const sessionId = params.sessionId?.trim();
	try {
		if (sessionKey) return {
			sessionKey,
			entry: await params.api.runtime.agent.session.getSessionEntryAsync({
				agentId: params.agentId,
				sessionKey,
				storePath: params.storePath,
				readConsistency: "latest"
			}),
			readFailed: false
		};
		const match = sessionId ? await params.api.runtime.agent.session.getSessionEntryByIdAsync({
			agentId: params.agentId,
			sessionId,
			storePath: params.storePath,
			orderBy: "updatedAt"
		}) : void 0;
		return {
			sessionKey: match?.sessionKey.trim() || void 0,
			entry: match?.entry,
			readFailed: false
		};
	} catch (error) {
		rethrowIncognitoSessionError(error);
		return {
			sessionKey,
			entry: void 0,
			readFailed: true
		};
	}
}
function resolveRecallRunChannelContext(params) {
	const isRunnableChannelName = (channel) => !channel.includes(":") && !channel.includes("/");
	const explicitChannel = normalizeOptionalString(params.channelId);
	const explicitProvider = normalizeOptionalString(params.messageProvider);
	const runnableExplicitChannel = explicitChannel && isRunnableChannelName(explicitChannel) ? explicitChannel : void 0;
	const trustedExplicitChannel = runnableExplicitChannel && runnableExplicitChannel !== explicitProvider && (!explicitProvider || explicitProvider === "webchat") ? runnableExplicitChannel : void 0;
	const entryChannel = normalizeOptionalString(deliveryContextFromSession(params.sessionEntry)?.channel);
	const strongEntryChannel = entryChannel && isRunnableChannelName(entryChannel) ? entryChannel : void 0;
	const weakEntryChannel = normalizeOptionalString(sessionDeliveryOrigin(params.sessionEntry)?.provider);
	const channel = trustedExplicitChannel ?? strongEntryChannel ?? explicitProvider ?? runnableExplicitChannel ?? weakEntryChannel;
	return {
		messageChannel: channel,
		messageProvider: channel
	};
}
function resolveStatusUpdateAgentId(ctx) {
	const explicit = ctx.agentId?.trim();
	if (explicit) return explicit;
	const sessionKey = ctx.sessionKey?.trim();
	if (!sessionKey) return "";
	return /^agent:([^:]+):/i.exec(sessionKey)?.[1]?.trim() ?? "";
}
function formatElapsedMsCompact(elapsedMs) {
	if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) return "0ms";
	if (elapsedMs >= 1e3) {
		const seconds = elapsedMs / 1e3;
		return `${seconds % 1 === 0 ? seconds.toFixed(0) : seconds.toFixed(1)}s`;
	}
	return `${Math.round(elapsedMs)}ms`;
}
function buildPluginStatusLine(params) {
	const parts = [
		ACTIVE_MEMORY_STATUS_PREFIX,
		`status=${params.result.status}`,
		`elapsed=${formatElapsedMsCompact(params.result.elapsedMs)}`,
		`query=${params.config.queryMode}`
	];
	if (params.result.summary && params.result.summary.length > 0) parts.push(`summary=${params.result.summary.length} chars`);
	return parts.join(" ");
}
function buildPersistedDebugSummary(result) {
	if (result.status === "timeout_partial") return `timeout_partial: ${String(result.summary.length)} chars recovered (not persisted)`;
	return result.summary;
}
function buildPluginDebugLine(params) {
	const cleaned = sanitizeDebugText(params.summary ?? "");
	const warning = sanitizeDebugText(params.searchDebug?.warning ?? "");
	const action = sanitizeDebugText(params.searchDebug?.action ?? "");
	const error = sanitizeDebugText(params.searchDebug?.error ?? "");
	const debugParts = [];
	for (const key of [
		"backend",
		"configuredMode",
		"effectiveMode",
		"fallback"
	]) {
		const value = sanitizeDebugText(params.searchDebug?.[key] ?? "");
		if (value) debugParts.push(`${key}=${value}`);
	}
	if (typeof params.searchDebug?.searchMs === "number" && Number.isFinite(params.searchDebug.searchMs)) debugParts.push(`searchMs=${Math.max(0, Math.round(params.searchDebug.searchMs))}`);
	if (typeof params.searchDebug?.hits === "number" && Number.isFinite(params.searchDebug.hits)) debugParts.push(`hits=${Math.max(0, Math.floor(params.searchDebug.hits))}`);
	const prefix = debugParts.join(" ");
	const warningAction = warning && action && !cleaned ? `${warning} ${action}` : [warning, action && !cleaned ? action : ""].filter((value) => Boolean(value)).join(" | ");
	const body = [prefix, uniqueStrings([warningAction, cleaned].filter((value) => Boolean(value))).join(" | ")].filter(Boolean).join(" | ") || error;
	return body ? `${ACTIVE_MEMORY_DEBUG_PREFIX} ${body}` : null;
}
function sanitizeDebugText(text) {
	let sanitized = "";
	for (const ch of text) {
		const code = ch.charCodeAt(0);
		if (!(code >= 0 && code <= 31 || code >= 127 && code <= 159)) sanitized += ch;
	}
	return sanitized.replace(/\s+/g, " ").trim();
}
async function persistPluginStatusLines(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey) return;
	const debugLine = buildPluginDebugLine({
		summary: params.debugSummary,
		searchDebug: params.searchDebug
	});
	const agentId = params.agentId.trim();
	if (!agentId && (params.statusLine || debugLine)) return;
	try {
		if (!params.statusLine && !debugLine) {
			const existingEntry = await params.api.runtime.agent.session.getSessionEntryAsync({
				agentId,
				sessionKey
			});
			if (!(Array.isArray(existingEntry?.pluginDebugEntries) ? existingEntry.pluginDebugEntries.some((entry) => entry?.pluginId === "active-memory") : false)) return;
		}
		await params.api.runtime.agent.session.prepareSessionEntryPatch({
			agentId,
			sessionKey,
			preserveActivity: true,
			prepare: (existing) => {
				const nextEntries = (Array.isArray(existing.pluginDebugEntries) ? existing.pluginDebugEntries : []).filter((entry) => Boolean(entry) && typeof entry === "object" && typeof entry.pluginId === "string" && entry.pluginId !== "active-memory");
				const nextLines = [];
				if (params.statusLine) nextLines.push(params.statusLine);
				if (debugLine) nextLines.push(debugLine);
				if (nextLines.length > 0) nextEntries.push({
					pluginId: "active-memory",
					lines: nextLines
				});
				return { pluginDebugEntries: nextEntries.length > 0 ? nextEntries : void 0 };
			}
		});
	} catch (error) {
		rethrowIncognitoSessionError(error);
		params.api.logger.debug?.(`active-memory: failed to persist session status note (${error instanceof Error ? error.message : String(error)})`);
	}
}
//#endregion
export { resolveRecallRunChannelContext as a, prepareActiveMemorySession as i, buildPluginStatusLine as n, resolveStatusUpdateAgentId as o, persistPluginStatusLines as r, buildPersistedDebugSummary as t };
