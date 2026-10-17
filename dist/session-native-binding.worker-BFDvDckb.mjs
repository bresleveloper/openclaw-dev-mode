import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { t as assertTransactionUsable } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { i as deletePluginStateNativeBinding, m as readPreparedPluginStateNativeBinding, p as preparePluginStateNativeBindingCodec, s as restorePluginStateNativeBinding } from "./plugin-state-store.mutations-BHk3kTNw.mjs";
import { r as wrapPluginStateError } from "./plugin-state-store.database-VwspSyEa.mjs";
import { E as withSqliteSessionDeletionWorkerParticipant } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { u as reclaimSqliteSessionInTransaction } from "./session-accessor.sqlite-reclamation-CiWnC9OH.mjs";
import { t as assertSessionSubagentRunsCurrent } from "./session-accessor.sqlite-descendant-basis-7u7iMDiO.mjs";
import { t as collectReclamationChangedSessionKeys } from "./session-accessor.sqlite-reclamation-publication-C6o22lQK.mjs";
import { n as prepareSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-mI3FEuTy.mjs";
import { r as transferSessionEntryWorkerCandidate } from "./session-entry-patch.worker-CNfHtLgK.mjs";
//#region src/config/sessions/session-native-binding.worker.ts
async function prepareSessionNativeBindingDeletion(input, env) {
	for (const { binding } of input.participants) if (binding) await preparePluginStateNativeBindingCodec(binding, env);
}
/** A owns the transaction; its native participants commit and compensate through the captured S. */
function deleteSessionWithNativeBindings(input, context) {
	const database = context.open();
	const writeSharedTransaction = context.writeSharedTransaction;
	if (!writeSharedTransaction || database.db.isTransaction) throw new Error("Native binding settlement requires its reserved durable executor");
	const writeShared = (operation, write, refusal) => {
		try {
			return writeSharedTransaction(input.sharedSource, write);
		} catch (error) {
			if (error === refusal) throw error;
			throw wrapPluginStateError(error, operation, "PLUGIN_STATE_WRITE_FAILED", operation === "delete" ? "Failed to conditionally delete plugin state entry." : "Failed to register plugin state entry.", input.sharedSource.canonicalPath);
		}
	};
	context.admit("transaction", {
		kind: "native-binding-ready",
		operationId: input.operationId
	});
	let agent = "pending";
	let agentCommitted = false;
	let bindings = input.participants.map(() => "pending");
	let compensationFailure;
	const removed = /* @__PURE__ */ new Map();
	const receipt = (nextAgent = agent, nextBindings = bindings) => ({
		kind: "session-native-binding",
		operationId: input.operationId,
		agent: nextAgent,
		bindings: [...nextBindings],
		...compensationFailure ? { compensationFailure } : {}
	});
	const recordSharedCommit = (shared, nextBindings) => {
		stageSqliteTransactionState(shared.db, {
			stage() {},
			commit: () => {
				bindings = nextBindings;
			},
			rollback() {}
		});
		deferSqliteWorkerCommitReceipt(shared.db, receipt(agent, nextBindings));
	};
	const admitShared = (index, phase, stage) => context.admit("transaction", {
		kind: "native-binding-storage",
		operationId: input.operationId,
		index,
		phase,
		stage
	});
	const commitParticipant = (sessionKey, entry) => {
		const selected = input.participants.flatMap((participant, index) => participant.sessionKey === sessionKey ? [{
			participant,
			index
		}] : []);
		for (const { participant, index } of selected) {
			if (participant.entry.sessionId !== entry.sessionId || participant.entry.lifecycleRevision !== entry.lifecycleRevision || participant.entry.previousSessionId !== entry.previousSessionId) throw new Error(`Session changed before native binding deletion: ${sessionKey}`);
			if (bindings[index] !== "pending") continue;
			const plan = participant.binding;
			if (!plan) {
				bindings[index] = "absent";
				continue;
			}
			const expired = new Error(plan.deletionChanged);
			if (writeShared("delete", (shared) => {
				admitShared(index, "delete", "transaction");
				const result = deletePluginStateNativeBinding(shared, plan);
				if (result.status === "deleted") removed.set(index, result.value);
				const next = [...bindings];
				next[index] = result.status === "conflict" ? "pending" : result.status;
				recordSharedCommit(shared, next);
				admitShared(index, "delete", "commit");
				if (result.status === "deleted") {
					const lease = readPreparedPluginStateNativeBinding(plan, result.value)?.lease;
					if (!lease || lease.expiresAt <= Date.now()) throw expired;
				}
				return result.status;
			}, expired) === "conflict") throw new Error(plan.deletionChanged);
		}
	};
	try {
		return withSqliteSessionDeletionWorkerParticipant(commitParticipant, () => context.writeTransaction("session.reclaim.entry", "Native binding deletion", (current) => {
			stageSqliteTransactionState(current.db, {
				stage() {},
				commit: () => {
					agent = "committed";
					agentCommitted = true;
				},
				rollback() {}
			});
			const result = reclaimSqliteSessionInTransaction({
				...input.plan,
				databaseOptions: {
					...input.plan.databaseOptions,
					...context.options
				}
			});
			if (result.kind !== "entry") throw new Error("Native binding deletion returned another reclamation operation");
			const changedKeys = collectReclamationChangedSessionKeys(input.plan, result);
			const publication = result.value.deleted ? prepareSessionEntryReplacementPublication({
				previous: new Map(input.plan.preparedTargetSnapshot.map(({ sessionKey, entry }) => [sessionKey, entry])),
				current: /* @__PURE__ */ new Map(),
				pendingArchiveRecovery: false,
				membershipInvalidatedKeys: changedKeys,
				maintenancePlans: []
			}, current) : void 0;
			if (publication) publication.changedKeys = changedKeys;
			return transferSessionEntryWorkerCandidate(current, (stage, facts) => {
				context.admit(stage, facts);
				if (stage === "commit") assertSessionSubagentRunsCurrent(input.plan, input.plan.databaseOptions.env);
			}, {
				kind: "session-native-binding-deletion",
				result,
				publication
			}, (transferred) => ({
				...receipt("committed"),
				receipt: transferred
			}));
		}));
	} catch (error) {
		if (agentCommitted) throw error;
		try {
			assertTransactionUsable(database.db);
			if (!database.db.isOpen || database.db.isTransaction) throw new Error("Agent transaction did not confirm its rollback", { cause: error });
		} catch (cause) {
			const unknown = new SqliteWorkerError("Native binding agent outcome is unknown", "outcome-unknown");
			unknown.cause = createSqliteLifecycleAggregateError([error, cause], "Native binding rollback is unconfirmed", error);
			throw unknown;
		}
		agent = "rolled-back";
		const failures = [error];
		for (const [index, value] of [...removed].toReversed()) {
			if (bindings[index] !== "deleted") continue;
			const plan = input.participants[index].binding;
			try {
				if (!writeShared("register", (shared) => {
					admitShared(index, "restore", "transaction");
					const applied = restorePluginStateNativeBinding(shared, plan, value);
					const next = [...bindings];
					if (applied) next[index] = "restored";
					recordSharedCommit(shared, next);
					admitShared(index, "restore", "commit");
					return applied;
				})) throw new Error(plan.rollbackChanged, { cause: error });
			} catch (failure) {
				failures.push(failure);
			}
		}
		if (failures.length > 1) compensationFailure = encodeOpenClawStateWorkerError(new AggregateError(failures.slice(1), "Native binding compensation failed"), { includeOrdinary: true });
		try {
			writeShared("register", (shared) => recordSharedCommit(shared, bindings));
		} catch (failure) {
			failures.push(failure);
		}
		if (failures.length > 1) throw createSqliteLifecycleAggregateError(failures, "Native binding deletion settlement failed", error);
		throw error;
	}
}
//#endregion
export { deleteSessionWithNativeBindings, prepareSessionNativeBindingDeletion };
