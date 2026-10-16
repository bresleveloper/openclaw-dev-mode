import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { o as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as participantRecordsBySessionKey } from "./internal-session-key-CPayZwJR.mjs";
//#region src/config/sessions/session-accessor.sqlite-participant-read.ts
function listSessionParticipantsReadOnly(scope) {
	const resolved = resolveSqliteReadScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => participantRecordsBySessionKey(database.db, scope.sessionKey ? [scope.sessionKey] : void 0), toDatabaseOptions(resolved));
	return result.found ? result.value : /* @__PURE__ */ new Map();
}
//#endregion
export { listSessionParticipantsReadOnly as t };
