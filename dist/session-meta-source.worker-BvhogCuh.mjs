import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { i as withFreshOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-hQ4ohjUT.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as readLegacyAcpMigrationContextInDatabase } from "./session-accessor.sqlite-acp-provenance-tjrzB-wk.mjs";
import { l as selectAcpSessionRowForRead, s as resolveReadableAcpSessionRow } from "./session-meta-keys-Bj_FyJ-3.mjs";
import { a as resolveAcpSessionControlOwner, i as matchesAcpSessionRuntimeLocator, t as assertAcpSessionMutationEntry } from "./session-meta-entry.kernel-Cn1WSw9n.mjs";
//#region src/acp/runtime/session-meta-source.worker.ts
/** Reuse the metadata writer's exact physical-source and lifecycle admission. */
function readAcpSessionSourceInWorker(input, phase) {
	const source = input.source;
	const assertSource = () => {
		const observed = readDatabasePathIdentitySync(source.path);
		if (observed.key !== source.identity.key || observed.canonicalPath !== source.identity.canonicalPath || observed.birthtime !== source.identity.birthtime) throw new Error(`Canonical ACP session changed before ${phase}.`);
	};
	assertSource();
	const read = withFreshOpenClawAgentDatabaseReadOnly((agent) => readLegacyAcpMigrationContextInDatabase(agent, resolveSqliteSessionKey(input.sessionKey, input.agentId)), {
		agentId: source.agentId,
		path: source.path,
		env: getSqliteWorkerStateContext().environment
	});
	assertSource();
	if (!read.found && read.reason !== "database-missing") throw new Error("Canonical ACP session is unavailable before source consumption");
	const current = read.found ? read.value : {
		entry: void 0,
		sources: []
	};
	assertAcpSessionMutationEntry(current.entry, input.entry ?? null, input.expectedControlBinding, phase);
	return current;
}
/** Session mutations consume current rows; this constraint never grants authority. */
function readAcpSessionControlInWorker(database, input) {
	const shared = readDatabasePathIdentitySync(database.path);
	if (shared.key !== input.sharedSource.identity.key || shared.canonicalPath !== input.sharedSource.identity.canonicalPath || shared.birthtime !== input.sharedSource.identity.birthtime) throw new Error("Canonical ACP metadata source changed before control read.");
	const { entry } = readAcpSessionSourceInWorker(input, "control read");
	if (resolveAcpSessionControlOwner(entry) !== input.ownerKey) throw new Error("Canonical ACP session owner changed before control read.");
	const row = resolveReadableAcpSessionRow({
		row: selectAcpSessionRowForRead(database.db, {
			...input.read,
			entry
		}),
		entry
	});
	if (input.runtimeLocator && !matchesAcpSessionRuntimeLocator(row ? {
		backend: row.backend,
		runtimeSessionName: row.runtime_session_name
	} : void 0, input.runtimeLocator)) throw new Error("Canonical ACP runtime locator changed before control read.");
	return {
		entry,
		row
	};
}
//#endregion
export { readAcpSessionSourceInWorker as n, readAcpSessionControlInWorker as t };
