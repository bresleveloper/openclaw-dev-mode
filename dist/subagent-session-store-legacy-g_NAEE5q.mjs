import "./session-accessor-Czw4l8kI.mjs";
import { L as withLegacySessionCapabilityReader } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { a as loadExactSessionEntryReadOnly, o as loadSessionEntryByIdReadOnly } from "./session-accessor.sqlite-exact-read-UkIlVdR6.mjs";
//#region src/agents/subagents/spawn/subagent-session-store-legacy.ts
/** Explicit compatibility scope for deprecated synchronous plugin SDK factories. */
function withLegacySessionCapabilityRead(read) {
	return withLegacySessionCapabilityReader((query) => {
		const scope = {
			storePath: query.storePath,
			agentId: query.agentId,
			projection: "list"
		};
		try {
			return query.sessionKey !== void 0 ? loadExactSessionEntryReadOnly({
				...scope,
				sessionKey: query.sessionKey
			})?.entry : loadSessionEntryByIdReadOnly({
				...scope,
				sessionId: query.sessionId
			})?.entry;
		} catch {
			return;
		}
	}, read);
}
//#endregion
export { withLegacySessionCapabilityRead as t };
