import { Pt as readDatabasePathIdentitySync } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import "./openclaw-state-read-openclaw-state-db-cache-CpHXuPkl.mjs";
import { n as normalizeAgentId } from "./openclaw-state-read-agent-id-BoCs9aqI.mjs";
import { c as inspectOpenClawAgentDatabaseOwner } from "./openclaw-state-read-openclaw-agent-write-admission-D5Qp4bnz.mjs";
import { D as resolveSessionStorePathCore, L as listAgentIds, O as listSqliteTargetCandidatePathsForSessionStorePath } from "./openclaw-state-read-openclaw-state-db-Dhtiiltk.mjs";
import "./openclaw-state-read-session-key-CJdIm256.mjs";
import { i as resolveSessionStoreCompatibilityAgentId, n as resolveSqliteTargetFromSessionStorePath } from "./openclaw-state-read-session-sqlite-target-DwYtn-G3.mjs";
import { v as readRegisteredAgentDatabaseRows } from "./openclaw-state-read-agent-deletion-journal-kOb8UH8S.mjs";
import "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/agent-delete-session-store-safety.targets.ts
function captureCandidates(stores) {
	return [...new Set(stores.flatMap((store) => listSqliteTargetCandidatePathsForSessionStorePath(store)))].toSorted().map((pathname) => ({
		path: pathname,
		identity: readDatabasePathIdentitySync(pathname)
	}));
}
function assertAgentSessionStoreDeletionTargetsCurrent(targets) {
	if (!isDeepStrictEqual(captureCandidates(targets.stores), targets.candidates)) throw new Error("Agent session database changed during deletion planning.");
}
//#endregion
//#region src/agents/agent-delete-session-store-safety.kernel.ts
/** The caller owns the current shared-state read or write transaction. */
function findAgentSessionStoreDeletionBlocker(database, cfg, agentId, env, targets) {
	if (!cfg.session?.store?.trim()) return;
	const id = normalizeAgentId(agentId);
	const defaultAgentId = resolveSessionStoreCompatibilityAgentId(cfg);
	if (targets) assertAgentSessionStoreDeletionTargetsCurrent(targets);
	const registeredDatabases = database ? readRegisteredAgentDatabaseRows(database.db, database.path, false) : [];
	for (const survivorId of listAgentIds(cfg)) {
		if (normalizeAgentId(survivorId) === id) continue;
		const storePath = resolveSessionStorePathCore(cfg.session.store, {
			agentId: survivorId,
			env
		});
		const target = resolveSqliteTargetFromSessionStorePath(storePath, {
			agentId: survivorId,
			defaultAgentId,
			env,
			registeredDatabases
		});
		const owner = inspectOpenClawAgentDatabaseOwner(target.path);
		if (owner.status === "owned" && owner.agentId === id) {
			if (targets) assertAgentSessionStoreDeletionTargetsCurrent(targets);
			return survivorId;
		}
	}
	if (targets) assertAgentSessionStoreDeletionTargetsCurrent(targets);
}
const agentDeletionSessionStoreReadOperations = { "agentDeletion.sessionStoreBlocker": (input, db) => ({
	type: "agentDeletion.sessionStoreBlocker",
	blocker: findAgentSessionStoreDeletionBlocker({
		db,
		path: input.databasePath
	}, input.config, input.agentId, input.env, input.targets)
}) };
//#endregion
export { agentDeletionSessionStoreReadOperations };
