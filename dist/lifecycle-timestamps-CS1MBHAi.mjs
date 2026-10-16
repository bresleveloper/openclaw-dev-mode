import { o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as readSessionTranscriptHeaderStartedAt } from "./transcript-header-CyuYZIZn.mjs";
//#region src/config/sessions/lifecycle-timestamps.ts
function resolveTimestamp(value) {
	const timestampMs = asDateTimestampMs(value);
	return timestampMs !== void 0 && timestampMs >= 0 ? timestampMs : void 0;
}
function readSessionHeaderStartedAtMs(params) {
	const sessionId = params.entry.sessionId?.trim();
	const sessionKey = params.sessionKey?.trim();
	const agentId = params.agentId ?? (sessionKey ? resolveAgentIdFromSessionKey(sessionKey) : void 0);
	if (!sessionId || !agentId) return;
	try {
		const header = params.readHeader({
			agentId,
			sessionId,
			...params.storePath ? { storePath: params.storePath } : {},
			...sessionKey ? { sessionKey } : {}
		});
		return readSessionTranscriptHeaderStartedAt(header, sessionId);
	} catch {
		return;
	}
}
function resolveSessionLifecycleTimestampsWithHeader(params) {
	const entry = params.entry;
	if (!entry) return {};
	return {
		sessionStartedAt: resolveTimestamp(entry.sessionStartedAt) ?? readSessionHeaderStartedAtMs({
			...params,
			entry
		}),
		lastInteractionAt: resolveTimestamp(entry.lastInteractionAt)
	};
}
//#endregion
export { resolveTimestamp as n, resolveSessionLifecycleTimestampsWithHeader as t };
