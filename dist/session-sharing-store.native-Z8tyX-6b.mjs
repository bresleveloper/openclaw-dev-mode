import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { v as confirmSessionParticipantsSchemaEnsured, y as ensureSessionParticipantsSchema } from "./openclaw-agent-db-schema-helpers-BxlojGn2.mjs";
import { c as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { u as readUserProfileAliases } from "./user-profile-list-CtETKur7.mjs";
import "./user-profiles-DYQbtiqy.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { l as mergeParticipantAggregate, u as participantIdentityNamespace } from "./internal-session-key-CPayZwJR.mjs";
import { c as trackSessionEntryCacheWrite, h as publishSessionSharingMemberChange, i as publishSessionEntryCacheParticipantUpdate } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { a as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { t as getSessionMemberKysely } from "./session-sharing-store.kernel-BCRJJ2WM.mjs";
import { t as readSessionEntryInstanceId } from "./session-accessor.sqlite-entry-identity-P-nzw0e8.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-qdejgRzS.mjs";
import { t as MAX_SESSION_PARTICIPANTS } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { isDeepStrictEqual, toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-participants.native.ts
function recordSessionParticipant(scope, params) {
	const actorId = params.identity.id;
	if (!actorId || params.identity.type === "agent" && actorId === params.sessionAgentId) return null;
	const resolved = resolveSqliteScope(scope);
	const options = toDatabaseOptions(resolved);
	const promptedAt = params.promptedAt ?? Date.now();
	const namespace = participantIdentityNamespace(params.identity);
	const aliases = params.identity.type === "profile" ? readUserProfileAliases(actorId, { env: scope.env }) : void 0;
	return runOpenClawAgentWriteTransaction((database) => {
		if (ensureSessionParticipantsSchema(database.db)) deferOpenClawAgentPostCommitPublication(database, () => confirmSessionParticipantsSchemaEnsured(database.db));
		const kysely = getSessionKysely(database.db);
		const participantQuery = kysely.selectFrom("session_participants").select([
			"actor_id",
			"contribution_count",
			"first_prompted_at",
			"last_prompted_at"
		]).where("session_key", "=", resolved.sessionKey).where("identity_namespace", "=", namespace);
		const exact = executeSqliteQueryTakeFirstSync(database.db, participantQuery.where("actor_id", "=", actorId));
		let existing = exact?.actor_id === actorId ? exact : void 0;
		if (!existing && aliases && aliases.size > 1) existing = executeSqliteQuerySync(database.db, participantQuery.orderBy("actor_id")).rows.find((row) => aliases.has(row.actor_id));
		if (!existing) {
			if ((executeSqliteQueryTakeFirstSync(database.db, kysely.selectFrom("session_participants").select((eb) => eb.fn.countAll().as("count")).where("session_key", "=", resolved.sessionKey))?.count ?? 0) >= MAX_SESSION_PARTICIPANTS) return "capped";
		}
		const aggregate = mergeParticipantAggregate(existing, {
			contribution_count: 1,
			first_prompted_at: promptedAt,
			last_prompted_at: promptedAt
		}, "sum");
		const writeGeneration = trackSessionEntryCacheWrite(database, () => executeSqliteQuerySync(database.db, kysely.insertInto("session_participants").values({
			session_key: resolved.sessionKey,
			identity_namespace: namespace,
			actor_id: existing?.actor_id ?? actorId,
			...aggregate
		}).onConflict((conflict) => conflict.columns([
			"session_key",
			"identity_namespace",
			"actor_id"
		]).doUpdateSet(aggregate))));
		publishSessionEntryCacheParticipantUpdate(database, resolved.sessionKey, {
			writeGeneration,
			projectionChanged: !existing || existing.actor_id !== actorId || aggregate.first_prompted_at !== existing.first_prompted_at
		});
		deferOpenClawAgentPostCommitPublication(database, () => emitSessionLifecycleEvent({
			agentId: resolved.agentId,
			sessionKey: resolved.sessionKey,
			reason: "participants",
			scope: "session-entry"
		}));
		return existing ? "updated" : "inserted";
	}, options, { operationLabel: "sessions.record-participant" });
}
//#endregion
//#region src/config/sessions/session-sharing-store.native.ts
function assertAuthorizedSessionInstance(database, sessionKey, expectedSessionId, expectedEntry) {
	const sessionId = readSessionEntryInstanceId(database, sessionKey);
	if (sessionId === void 0 || expectedSessionId !== void 0 && sessionId !== expectedSessionId) throw new Error("session changed before sharing mutation");
	if (expectedEntry) {
		const entry = readExactSessionEntryRow(database, sessionKey, "list")?.entry;
		if (!entry || !isDeepStrictEqual({
			sessionId: entry.sessionId,
			createdActor: entry.createdActor,
			visibility: entry.visibility,
			incognito: entry.incognito
		}, expectedEntry)) throw new Error("session ownership changed before sharing mutation");
	}
	return sessionId;
}
function publishCommittedSessionMembership(database, agentId, sessionKey, sessionId, identityId, present) {
	publishSessionSharingMemberChange(database, sessionKey, {
		kind: "member",
		sessionId,
		identityId: toUSVString(identityId),
		present
	}, agentId);
}
function addSessionMember(scope, params) {
	const identityId = params.identityId.trim();
	const addedBy = params.addedBy.trim();
	if (!identityId || !addedBy) throw new Error("session member identity and actor are required");
	const options = toDatabaseOptions(resolveSqliteScope(scope));
	const { agentId, sessionKey } = resolveSqliteScope(scope);
	const addedAt = params.addedAt ?? Date.now();
	const inserted = runOpenClawAgentWriteTransaction((database) => {
		const sessionId = assertAuthorizedSessionInstance(database, sessionKey, params.expectedSessionId, params.expectedEntry);
		const db = getSessionMemberKysely(database);
		const changed = (executeSqliteQuerySync(database.db, db.insertInto("session_members").values({
			session_key: sessionKey,
			identity_id: identityId,
			added_by: addedBy,
			added_at: addedAt
		}).onConflict((conflict) => conflict.columns(["session_key", "identity_id"]).doNothing())).numAffectedRows ?? 0n) > 0n;
		if (changed) publishCommittedSessionMembership(database, agentId, sessionKey, sessionId, identityId, true);
		return changed;
	}, options, { operationLabel: "session.sharing.add-member" });
	return {
		member: {
			identityId,
			addedBy,
			addedAt
		},
		inserted
	};
}
function removeSessionMember(scope, identityId, expected, expectedSessionId, expectedEntry) {
	const normalizedIdentityId = identityId.trim();
	if (!normalizedIdentityId) return null;
	const options = toDatabaseOptions(resolveSqliteScope(scope));
	const { agentId, sessionKey } = resolveSqliteScope(scope);
	return runOpenClawAgentWriteTransaction((database) => {
		const sessionId = assertAuthorizedSessionInstance(database, sessionKey, expectedSessionId, expectedEntry);
		const db = getSessionMemberKysely(database);
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_members").select([
			"identity_id",
			"added_by",
			"added_at"
		]).where("session_key", "=", sessionKey).where("identity_id", "=", normalizedIdentityId));
		if (!row || expected && (row.added_by !== expected.addedBy || row.added_at !== expected.addedAt)) return null;
		executeSqliteQuerySync(database.db, db.deleteFrom("session_members").where("session_key", "=", sessionKey).where("identity_id", "=", normalizedIdentityId));
		publishCommittedSessionMembership(database, agentId, sessionKey, sessionId, normalizedIdentityId, false);
		return {
			identityId: row.identity_id,
			addedBy: row.added_by,
			addedAt: row.added_at
		};
	}, options, { operationLabel: "session.sharing.remove-member" });
}
//#endregion
export { removeSessionMember as n, recordSessionParticipant as r, addSessionMember as t };
