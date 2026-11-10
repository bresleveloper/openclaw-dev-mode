import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as normalizeDatabasePath, f as readDatabasePathIdentitySync, p as resolveDatabasePathKey } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { l as getSqliteDatabaseAdmissionIdentityForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { statSync } from "node:fs";
import { randomUUID } from "node:crypto";
//#region src/state/openclaw-agent-db-identity.ts
const identities = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseIdentities"), () => /* @__PURE__ */ new WeakMap());
/** Prepare physical and connection identity once at open; cached aliases are not resolved again. */
function registerOpenClawAgentDatabaseIdentity(db, ownerDatabasePath) {
	const filename = normalizeDatabasePath(db.location() ?? "");
	const admitted = filename ? getSqliteDatabaseAdmissionIdentityForPath(filename) : void 0;
	const file = admitted ? {
		...admitted,
		canonicalPath: resolveDatabasePathKey(filename)
	} : filename ? readDatabasePathIdentitySync(filename) : void 0;
	if (!file || !file.key.startsWith("file:")) throw new Error("OpenClaw agent database requires a physical file for identity registration");
	const identity = file.key.slice(5);
	identities.set(db, {
		identity,
		birthtime: file.birthtime,
		incarnation: randomUUID(),
		filename,
		canonicalPath: file.canonicalPath,
		ownerDatabasePath: ownerDatabasePath ? resolveDatabasePathKey(ownerDatabasePath) : void 0
	});
}
/** Reuse facts captured at open; aliases must never be resolved again at a handoff. */
function readOpenClawAgentDatabaseIdentity(database) {
	const prepared = findOpenClawAgentDatabaseIdentity(database);
	if (prepared === void 0) throw new Error("OpenClaw agent database identity was not prepared at open");
	return prepared;
}
/** Raw diagnostic connections have no admitted physical identity. */
function findOpenClawAgentDatabaseIdentity(database) {
	return identities.get(database.db);
}
/** A retained connection can outlive its pathname or be deserialized away from that file. */
function isOpenClawAgentDatabasePathCurrent(database) {
	if (!database.db.isOpen) return false;
	const { identity, filename } = readOpenClawAgentDatabaseIdentity(database);
	if (normalizeDatabasePath(database.db.location() ?? "") !== filename) return false;
	const current = statSync(database.path, {
		bigint: true,
		throwIfNoEntry: false
	});
	return current !== void 0 && identity === `${current.dev}:${current.ino}`;
}
function assertOpenClawAgentDatabaseIdentity(database, expected) {
	const identity = readOpenClawAgentDatabaseIdentity(database);
	if (`file:${identity.identity}` !== expected.key || expected.birthtime !== void 0 && identity.birthtime !== expected.birthtime || !isOpenClawAgentDatabasePathCurrent(database)) throw new Error("Agent database changed during repair admission");
}
function createOpenClawAgentDatabaseClaim(database, release) {
	let released = false;
	const isCurrent = () => !released && database.db.isOpen;
	const { identity, incarnation } = readOpenClawAgentDatabaseIdentity(database);
	return {
		identity,
		incarnation,
		isCurrent,
		assertCurrent: () => {
			if (!isCurrent()) throw new Error("OpenClaw agent database claim is no longer current");
		},
		release: () => {
			if (!released) {
				released = true;
				release();
			}
		}
	};
}
//#endregion
export { readOpenClawAgentDatabaseIdentity as a, isOpenClawAgentDatabasePathCurrent as i, createOpenClawAgentDatabaseClaim as n, registerOpenClawAgentDatabaseIdentity as o, findOpenClawAgentDatabaseIdentity as r, assertOpenClawAgentDatabaseIdentity as t };
