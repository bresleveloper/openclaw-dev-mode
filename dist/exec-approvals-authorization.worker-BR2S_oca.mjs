import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as maxAsk, r as minSecurity, t as assertExecApprovalsHostPolicyUnchanged } from "./exec-approvals-policy-Cd5JaUxb.mjs";
import { n as assertOpenClawStateLeaseWorkerOwnedInTransaction } from "./openclaw-state-lease-worker-D3xn0u2j.mjs";
import { a as generateToken, f as resolveExecApprovalsSocketPath, o as mergeExecApprovalsSocketDefaults, s as normalizeExecApprovalsInternal, u as resolveExecApprovalsDisplayPath } from "./exec-approvals-config-JiuCEgOc.mjs";
import { t as resolveExecApprovalsFromFileInternal } from "./exec-approvals-resolver-BYbI_zvO.mjs";
import { n as assertNoPendingLegacyExecApprovals } from "./exec-approvals-migration-gate-uz_Dsb9e.mjs";
import { t as execApprovalsPublication } from "./exec-approvals-publication-BPITitc6.mjs";
import { c as snapshotFromExecApprovalsDatabase, d as writeExecApprovalsConfigRow, l as snapshotFromExecApprovalsRow, n as assertExecApprovalsMutationAllowed, r as deleteExecApprovalsConfigRow, s as serializeExecApprovals, t as ExecApprovalsMutationFencedError } from "./exec-approvals-sqlite-BKYjiJeV.mjs";
import { t as applyExecAuthorizationCommit } from "./exec-approvals-authorization.kernel-CbW9-kOe.mjs";
import { n as assertAgentDeletionWorkerPredicate } from "./agent-deletion.worker-Bp9lB6Sk.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/exec-approvals-mutation.kernel.ts
/** Apply the requested edit to the transaction's current policy, never a host callback. */
function applyExecApprovalsUpdate(file, update) {
	if (update.kind === "replace") return update.preserveSocket ? mergeExecApprovalsSocketDefaults({
		normalized: update.file,
		current: file
	}) : update.file;
	if (update.kind === "ensure-agent") return file.agents?.[update.agentId] ? null : {
		...file,
		agents: {
			...file.agents,
			[update.agentId]: update.policy
		}
	};
	const originalDefaults = resolveExecApprovalsFromFileInternal({ file: update.original }).defaults;
	const currentDefaults = resolveExecApprovalsFromFileInternal({ file }).defaults;
	const next = structuredClone(file);
	let changed = false;
	for (const field of [
		"security",
		"ask",
		"askFallback"
	]) {
		const currentValue = file.defaults?.[field];
		const originalValue = update.original.defaults?.[field];
		const doesNotLoosen = field === "ask" ? maxAsk(originalDefaults.ask, currentDefaults.ask) === originalDefaults.ask : minSecurity(originalDefaults[field], currentDefaults[field]) === originalDefaults[field];
		if (update.policy[field] !== void 0 && currentValue === update.written.defaults?.[field] && currentValue !== originalValue && doesNotLoosen) {
			next.defaults = {
				...next.defaults,
				[field]: originalValue
			};
			changed = true;
		}
	}
	return changed ? next : null;
}
//#endregion
//#region src/infra/exec-approvals-mutation.worker.ts
function mutate(context, label, operation) {
	const options = context.stateOptions();
	assertNoPendingLegacyExecApprovals({ env: options.env });
	return context.write(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const captured = execApprovalsPublication.capture(db, () => {
			const current = snapshotFromExecApprovalsDatabase(db, resolveExecApprovalsDisplayPath(options.env));
			const edit = operation(current, db);
			let snapshot = current;
			if (edit.next !== null) {
				const raw = edit.raw ?? serializeExecApprovals(edit.next);
				if (edit.remove || !current.exists || current.raw !== raw) {
					if (edit.remove) {
						deleteExecApprovalsConfigRow(db);
						snapshot = snapshotFromExecApprovalsRow({ path: current.path });
					} else {
						const persisted = writeExecApprovalsConfigRow({
							db,
							file: edit.next,
							raw: edit.raw
						});
						snapshot = snapshotFromExecApprovalsRow({
							path: current.path,
							row: { raw_json: persisted }
						});
					}
				}
			}
			return {
				changed: snapshot.raw !== current.raw,
				snapshot,
				result: edit.result(snapshot)
			};
		});
		const { changed, snapshot, result } = captured.result;
		const facts = {
			kind: "exec-policy-publication",
			file: snapshot.file,
			execFacts: execApprovalsPublication.bound(captured.receipt)
		};
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts
		});
		deferSqliteWorkerCommitReceipt(db, facts, changed ? "commit" : "settlement");
		return result;
	}, { operationLabel: label });
}
const execPolicyMutationOperations = {
	"execApprovals.update": (input, context) => mutate(context, "exec-approvals.update", (current, db) => {
		if (input.baseHash !== void 0 && current.hash !== input.baseHash) return {
			next: null,
			result: () => null
		};
		const next = applyExecApprovalsUpdate(current.file, input.update);
		if (next) assertExecApprovalsMutationAllowed({
			db,
			current: current.file,
			next
		});
		return {
			next,
			result: (snapshot) => snapshot
		};
	}),
	"execApprovals.restoreSnapshot": (input, context) => mutate(context, "exec-approvals.restore-cas", (current, db) => {
		if (current.hash !== input.baseHash) return {
			next: null,
			result: () => false
		};
		assertExecApprovalsMutationAllowed({
			db,
			current: current.file,
			next: input.snapshot.file
		});
		return {
			next: input.snapshot.file,
			raw: input.snapshot.raw ?? serializeExecApprovals(input.snapshot.file),
			remove: !input.snapshot.exists,
			result: () => true
		};
	}),
	"execApprovals.ensureSnapshot": (_input, context) => {
		const options = context.stateOptions();
		assertNoPendingLegacyExecApprovals({ env: options.env });
		const snapshot = snapshotFromExecApprovalsDatabase(context.open().db, resolveExecApprovalsDisplayPath(options.env));
		const socketPath = resolveExecApprovalsSocketPath(options.env);
		const ensureSocket = (file) => {
			const next = normalizeExecApprovalsInternal(file);
			return {
				...next,
				socket: {
					path: next.socket?.path?.trim() || socketPath,
					token: next.socket?.token?.trim() || generateToken()
				}
			};
		};
		if (snapshot.file.socket?.path?.trim() && snapshot.file.socket.token?.trim() && snapshot.raw === serializeExecApprovals(ensureSocket(snapshot.file))) return snapshot;
		return mutate(context, "exec-approvals.ensure", (current, db) => {
			const next = ensureSocket(current.file);
			assertExecApprovalsMutationAllowed({
				db,
				current: current.file,
				next
			});
			return {
				next,
				result: (result) => result
			};
		});
	}
};
//#endregion
//#region src/infra/exec-approvals-retirement.worker.ts
function retireAgentPolicies(input, context) {
	assertNoPendingLegacyExecApprovals({ env: context.stateOptions().env });
	const { guard } = input;
	const agentId = guard.predicate.agentId;
	if (guard.lease.scope !== "core:agent-deletion" || guard.lease.key !== agentId) throw new ExecApprovalsMutationFencedError();
	return context.write((database) => {
		assertOpenClawStateLeaseWorkerOwnedInTransaction(database.db, guard.lease);
		assertAgentDeletionWorkerPredicate(database, guard.predicate);
		const captured = execApprovalsPublication.capture(database.db, () => {
			const current = snapshotFromExecApprovalsDatabase(database.db, resolveExecApprovalsDisplayPath(context.stateOptions().env));
			const matches = (key) => {
				const normalized = normalizeAgentIdStrict(key);
				return normalized.ok && normalized.value === agentId;
			};
			const entries = input.action === "remove" ? Object.entries(current.file.agents ?? {}).filter(([key]) => matches(key)) : input.entries;
			const agents = { ...current.file.agents };
			for (const [key, policy] of entries) {
				if (!matches(key) || input.action === "restore" && agents[key] !== void 0 && !isDeepStrictEqual(agents[key], policy)) throw new ExecApprovalsMutationFencedError();
				if (input.action === "remove") delete agents[key];
				else agents[key] = policy;
			}
			const next = {
				...current.file,
				agents
			};
			const raw = serializeExecApprovals(next);
			const changed = entries.length > 0 && raw !== current.raw;
			if (changed) writeExecApprovalsConfigRow({
				db: database.db,
				file: next,
				raw
			});
			return {
				changed,
				raw,
				entries
			};
		});
		const { changed, raw, entries } = captured.result;
		assertOpenClawStateLeaseWorkerOwnedInTransaction(database.db, guard.lease, "write", "commit", {
			kind: "exec-approvals-retirement",
			nonce: input.nonce,
			agentId,
			operationId: guard.predicate.operationId,
			action: input.action,
			raw: changed ? raw : null
		});
		deferSqliteWorkerCommitReceipt(database.db, {
			kind: "exec-approvals-retirement",
			nonce: input.nonce,
			action: input.action,
			execFacts: execApprovalsPublication.bound(captured.receipt)
		});
		return entries;
	}, { operationLabel: `exec-approvals.retirement-${input.action}` });
}
const execApprovalRetirementOperations = { "execApprovals.retireAgent": retireAgentPolicies };
//#endregion
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
			assertExecApprovalsHostPolicyUnchanged(current.file, next);
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
function commitExecAuthorizationsInWorker(input, context) {
	const options = context.stateOptions();
	assertNoPendingLegacyExecApprovals({ env: options.env });
	const displayPath = resolveExecApprovalsDisplayPath(options.env);
	if (!input.items.some((item) => item.matches.length > 0 || item.allowAlwaysDecision !== void 0 && item.allowAlwaysDecision.kind !== "one-shot")) {
		const { db } = context.open();
		return applyAuthorizationBatch(db, snapshotFromExecApprovalsDatabase(db, displayPath), input.items).outcomes;
	}
	return context.write(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const captured = execApprovalsPublication.capture(db, () => {
			const current = snapshotFromExecApprovalsDatabase(db, displayPath);
			const committed = applyAuthorizationBatch(db, current, input.items);
			if (committed.snapshot.raw !== current.raw) writeExecApprovalsConfigRow({
				db,
				file: committed.snapshot.file,
				raw: committed.snapshot.raw ?? void 0,
				change: input.items.some((item, index) => committed.outcomes[index]?.ok && item.allowAlwaysDecision && item.allowAlwaysDecision.kind !== "one-shot") ? "policy" : "usage"
			});
			return committed;
		});
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		deferSqliteWorkerCommitReceipt(db, { execFacts: execApprovalsPublication.bound(captured.receipt) }, captured.receipt.facts.size ? "commit" : "settlement");
		return captured.result.outcomes;
	}, { operationLabel: "exec-approvals.commit-authorizations" });
}
const execAuthorizationOperations = {
	...execApprovalRetirementOperations,
	...execPolicyMutationOperations,
	"execApprovals.commitAuthorizations": commitExecAuthorizationsInWorker
};
//#endregion
export { execAuthorizationOperations };
