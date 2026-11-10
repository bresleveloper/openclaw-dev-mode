import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { r as getSessionActorStorageBinding } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as resolveSqliteReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { t as participantRecordsBySessionKey } from "./session-accessor.sqlite-participant-projection-B8eNZYGT.mjs";
//#region src/config/sessions/session-accessor.sqlite-participant-read.ts
function listSessionParticipantsReadOnly(scope) {
	const memory = scope.sessionKey && getSessionActorStorageBinding(scope);
	if (memory) return /* @__PURE__ */ new Map([[scope.sessionKey, structuredClone(memory.actor.snapshot(memory.authority)?.participants ?? [])]]);
	const resolved = resolveSqliteReadScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => participantRecordsBySessionKey(database.db, scope.sessionKey ? [scope.sessionKey] : void 0), toDatabaseOptions(resolved));
	return result.found ? result.value : /* @__PURE__ */ new Map();
}
//#endregion
export { listSessionParticipantsReadOnly as t };
