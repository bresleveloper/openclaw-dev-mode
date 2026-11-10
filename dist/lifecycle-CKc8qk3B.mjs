import "./session-work-start-Sz_vqYld.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-CHYPkxYr.mjs";
import { n as resolveTimestamp, t as resolveSessionLifecycleTimestampsWithHeader } from "./lifecycle-timestamps-DuPaTaAj.mjs";
import { n as isTerminalSessionStatus } from "./types-BGDhC4_W.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { d as loadTranscriptHeaderSync } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
//#region src/config/sessions/lifecycle.ts
function resolvePositiveTimestamp(value) {
	const timestampMs = resolveTimestamp(value);
	return timestampMs !== void 0 && timestampMs > 0 ? timestampMs : void 0;
}
function resolveSessionLifecycleTimestamps(params) {
	return resolveSessionLifecycleTimestampsWithHeader({
		...params,
		readHeader: (scope) => params.readHeader ? params.readHeader(scope.sessionId) : loadTranscriptHeaderSync(scope)
	});
}
function resolveTerminalMainSessionTranscriptRegistryCheck(params) {
	if (!params.entry || !params.sessionKey) return;
	const configuredMainSessionKey = canonicalizeMainSessionAlias({
		cfg: { session: {
			scope: params.sessionScope,
			mainKey: params.mainKey
		} },
		agentId: params.agentId,
		sessionKey: params.mainKey ?? "main"
	});
	if (canonicalizeMainSessionAlias({
		cfg: { session: {
			scope: params.sessionScope,
			mainKey: params.mainKey
		} },
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}) !== configuredMainSessionKey) return;
	if (!isTerminalSessionStatus(params.entry.status)) return;
	if (params.entry.status === "done") return;
	if (params.entry.status === "failed") return;
	const registryTimestampMs = resolvePositiveTimestamp(params.entry.updatedAt);
	if (registryTimestampMs === void 0) return;
	const sessionId = typeof params.entry.sessionId === "string" ? params.entry.sessionId.trim() : "";
	if (!sessionId) return;
	return {
		sessionId,
		registryTimestampMs
	};
}
//#endregion
export { resolveTerminalMainSessionTranscriptRegistryCheck as n, resolveSessionLifecycleTimestamps as t };
