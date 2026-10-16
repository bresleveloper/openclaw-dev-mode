import { n as retainSqliteWriteAdmissionService, s as withSqliteWriteAdmissionService } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/session-accessor.sqlite-reclamation-commit.ts
const COMMIT_DECISION_TIMEOUT_MS = 5e3;
const WAITING = 0;
const REJECTED = 2;
const COMMITTING = 3;
const SETTLED = 4;
const REQUESTED = 5;
/** A refused request may reuse its connection only after native rollback is confirmed. */
var SqliteReclamationRequestRefusedError = class extends Error {};
/** Preserve the reclamation owner's context when an unrelated synchronous writer helps. */
async function withSqliteReclamationAuthorization(buffer, database, assertCurrent, run) {
	const shared = new Int32Array(buffer);
	const inOwnerContext = AsyncLocalStorage.snapshot();
	let consumed = false;
	let failure;
	const authorize = () => {
		if (failure) throw failure.error;
		if (consumed) return;
		consumed = true;
		try {
			inOwnerContext(() => {
				assertCurrent();
				if (Atomics.compareExchange(shared, 0, REQUESTED, COMMITTING) !== REQUESTED) throw new Error("SQLite session reclamation commit checkpoint expired");
				Atomics.notify(shared, 0);
			});
		} catch (error) {
			failure = { error };
			rejectCommit(shared);
			throw error;
		}
	};
	const service = () => {
		if (Atomics.load(shared, 0) === REQUESTED) try {
			authorize();
		} catch {}
	};
	if (typeof database !== "string") return await withSqliteWriteAdmissionService(database, service, () => run(authorize));
	const release = retainSqliteWriteAdmissionService([database], service);
	try {
		return await run(authorize);
	} finally {
		release();
	}
}
function rejectCommit(shared) {
	Atomics.compareExchange(shared, 0, WAITING, REJECTED);
	Atomics.compareExchange(shared, 0, REQUESTED, REJECTED);
	Atomics.notify(shared, 0);
}
/** Revoke a pending request before a synchronous native close can wait on its writer lock. */
function revokeSqliteReclamationCommit(buffer) {
	rejectCommit(new Int32Array(buffer));
}
/** Called by the Worker while its deletion transaction still owns the writer lock. */
function waitForSqliteReclamationCommit(buffer, request) {
	const shared = new Int32Array(buffer);
	if (Atomics.compareExchange(shared, 0, WAITING, REQUESTED) !== WAITING) throw new SqliteReclamationRequestRefusedError("SQLite session reclamation commit was revoked");
	request();
	Atomics.wait(shared, 0, REQUESTED, COMMIT_DECISION_TIMEOUT_MS);
	if (Atomics.load(shared, 0) !== COMMITTING) {
		rejectCommit(shared);
		throw new SqliteReclamationRequestRefusedError("SQLite session reclamation commit was not authorized");
	}
}
/** Publish only after the transaction ended or its connection successfully closed. */
function markSqliteReclamationSettled(buffer) {
	if (buffer) {
		const shared = new Int32Array(buffer);
		Atomics.store(shared, 0, SETTLED);
		Atomics.notify(shared, 0);
	}
}
//#endregion
export { withSqliteReclamationAuthorization as a, waitForSqliteReclamationCommit as i, markSqliteReclamationSettled as n, revokeSqliteReclamationCommit as r, SqliteReclamationRequestRefusedError as t };
