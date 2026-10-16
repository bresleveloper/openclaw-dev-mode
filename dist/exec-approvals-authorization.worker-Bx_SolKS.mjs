import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as assertNoPendingLegacyExecApprovals, p as resolveExecApprovalsDisplayPath } from "./exec-approvals-migration-gate-4cEEb67t.mjs";
import { t as applyExecAuthorizationCommit } from "./exec-approvals-authorization.kernel-C_vJhPCn.mjs";
import { c as serializeExecApprovals, f as writeExecApprovalsConfigRow, l as snapshotFromExecApprovalsDatabase, n as assertExecApprovalsMutationAllowed, t as ExecApprovalsMutationFencedError, u as snapshotFromExecApprovalsRow } from "./exec-approvals-sqlite-BRXIFW7Z.mjs";
//#region src/infra/exec-approvals-authorization.worker.ts
function applyAuthorizationBatch(db, initial, items) {
	let current = initial;
	const outcomes = items.map((item) => {
		let next;
		try {
			next = applyExecAuthorizationCommit(structuredClone(current.file), item);
		} catch (error) {
			return {
				ok: false,
				message: error instanceof Error ? error.message : String(error)
			};
		}
		if (next !== null) {
			try {
				assertExecApprovalsMutationAllowed({
					db,
					current: current.file,
					next
				});
			} catch (error) {
				if (!(error instanceof ExecApprovalsMutationFencedError)) throw error;
				return {
					ok: false,
					message: error.message
				};
			}
			const raw = serializeExecApprovals(next);
			if (!current.exists || current.raw !== raw) current = snapshotFromExecApprovalsRow({
				path: current.path,
				row: { raw_json: raw }
			});
		}
		return {
			ok: true,
			snapshot: current
		};
	});
	return {
		snapshot: current,
		outcomes
	};
}
function commitExecAuthorizationsInWorker(input, options) {
	assertNoPendingLegacyExecApprovals({ env: options.env });
	const database = openOpenClawStateDatabase(options);
	const read = () => snapshotFromExecApprovalsDatabase(database.db, resolveExecApprovalsDisplayPath(options.env));
	const initial = read();
	const prepared = applyAuthorizationBatch(database.db, initial, input.items);
	if (prepared.snapshot.raw === initial.raw) return prepared.outcomes;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const current = read();
		const committed = applyAuthorizationBatch(db, current, input.items);
		if (committed.snapshot.raw !== current.raw) writeExecApprovalsConfigRow({
			db,
			file: committed.snapshot.file,
			raw: committed.snapshot.raw ?? void 0
		});
		return committed.outcomes;
	}, {
		...options,
		database
	}, { operationLabel: "exec-approvals.commit-authorizations" });
}
const execAuthorizationOperations = { "execApprovals.commitAuthorizations": (input, { open, stateOptions }) => commitExecAuthorizationsInWorker(input, {
	...stateOptions(),
	database: open()
}) };
//#endregion
export { execAuthorizationOperations };
