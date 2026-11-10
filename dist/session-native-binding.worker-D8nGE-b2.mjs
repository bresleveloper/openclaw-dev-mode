import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { t as assertTransactionUsable } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { a as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { t as collectLifecycleIdentityChanges } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { w as withSqliteSessionDeletionWorkerParticipant } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { s as reclaimSqliteSessionInTransaction } from "./session-accessor.sqlite-reclamation-CdzHU4X_.mjs";
import { n as collectReclamationDeletionEntries, t as collectReclamationChangedSessionKeys } from "./session-accessor.sqlite-reclamation-publication-Cd995rIj.mjs";
import { i as capturePluginStateReceipt } from "./plugin-state-publication-CI0IKkN0.mjs";
import { r as prepareSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-BqtqwF34.mjs";
import { i as wrapPluginStateError } from "./plugin-state-store.database-B2UsVeYf.mjs";
import { i as deletePluginStateNativeBinding, l as preparePluginStateNativeBindingCodec, s as restorePluginStateNativeBinding, u as readPreparedPluginStateNativeBinding } from "./plugin-state-store.mutations-B1cPWhts.mjs";
import { i as transferSessionEntryWorkerCandidate } from "./session-entry-patch.worker-CyYnfK5G.mjs";
import { serialize } from "node:v8";
//#region src/config/sessions/session-native-binding.worker.ts
async function prepareSessionNativeBindingDeletion(input, env) {
	for (const { binding } of input.participants) if (binding) await preparePluginStateNativeBindingCodec(binding, env);
}
function deleteSessionWithNativeBindings(input, context) {
	return runSessionNativeBindingTransaction(input, context, `session.reclaim.${input.plan.kind}`, "Native binding deletion", (current, wrapReceipt) => {
		const result = reclaimSqliteSessionInTransaction({
			...input.plan,
			databaseOptions: {
				...input.plan.databaseOptions,
				...context.options
			}
		});
		if (result.kind !== "entry" && result.kind !== "lifecycle-artifacts" && result.kind !== "maintenance-finalize" && result.kind !== "lifecycle-projection-commit") throw new Error("Native binding deletion returned another reclamation operation");
		const changedKeys = result.kind === "entry" && !result.value.deleted ? [] : collectReclamationChangedSessionKeys(input.plan, result);
		const removedEntries = collectReclamationDeletionEntries(input.plan, result);
		const identities = input.plan.kind === "lifecycle-projection-commit" && result.kind === "lifecycle-projection-commit" ? collectLifecycleIdentityChanges(input.plan.input.projected, result.value.removedSessionKeys) : {
			previous: new Map(removedEntries.map(({ sessionKey, entry }) => [sessionKey, entry])),
			current: /* @__PURE__ */ new Map()
		};
		const publication = changedKeys.length > 0 ? prepareSessionEntryReplacementPublication({
			...identities,
			pendingArchiveRecovery: result.kind === "lifecycle-projection-commit" ? result.value.pendingArchives : false,
			membershipInvalidatedKeys: changedKeys,
			maintenancePlans: result.kind === "lifecycle-projection-commit" ? result.value.maintenancePlans : []
		}, current) : void 0;
		if (publication) publication.changedKeys = changedKeys;
		return transferSessionEntryWorkerCandidate(current, (stage, facts) => {
			context.admit(stage, facts);
		}, {
			kind: "session-native-binding-deletion",
			result,
			publication
		}, wrapReceipt);
	});
}
/** The caller's whole A transaction retains the same reversible S veto and settlement owner. */
function runSessionNativeBindingTransaction(input, context, operationLabel, owner, mutate) {
	const database = context.open();
	const writeSharedTransaction = context.writeSharedTransaction;
	if (!writeSharedTransaction || database.db.isTransaction) throw new Error("Native binding settlement requires its reserved durable executor");
	const writeShared = (operation, write, refusal) => {
		try {
			return writeSharedTransaction(input.sharedSource, (shared) => {
				const captured = capturePluginStateReceipt(shared.db, () => write(shared));
				recordSharedCommit(shared, captured.result.bindings, captured.receipt);
				return captured.result.value;
			});
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
	let pluginState;
	let compensationFailure;
	const removed = /* @__PURE__ */ new Map();
	const receipt = (nextAgent = agent, nextBindings = bindings, nextPluginState = pluginState) => {
		const value = {
			kind: "session-native-binding",
			operationId: input.operationId,
			agent: nextAgent,
			bindings: [...nextBindings],
			...nextPluginState ? { pluginState: nextPluginState } : {},
			...compensationFailure ? { compensationFailure } : {}
		};
		if (nextPluginState && serialize(value).byteLength > 33554432) value.pluginState = {
			kind: "unknown",
			identity: nextPluginState.source.identity
		};
		return value;
	};
	const recordSharedCommit = (shared, nextBindings, captured) => {
		const nextPluginState = {
			...captured,
			facts: new Map([...pluginState?.facts ?? [], ...captured.facts])
		};
		const anchor = sqlPublicationAnchor(shared.db);
		stageSqliteTransactionState(anchor, {
			stage() {},
			commit: () => {
				bindings = nextBindings;
				pluginState = nextPluginState;
			},
			rollback() {}
		});
		deferSqliteWorkerCommitReceipt(anchor, receipt(agent, nextBindings, nextPluginState));
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
				admitShared(index, "delete", "commit");
				if (result.status === "deleted") {
					const lease = readPreparedPluginStateNativeBinding(plan, result.value)?.lease;
					if (!lease || lease.expiresAt <= Date.now()) throw expired;
				}
				return {
					value: result.status,
					bindings: next
				};
			}, expired) === "conflict") throw new Error(plan.deletionChanged);
		}
	};
	try {
		return withSqliteSessionDeletionWorkerParticipant(commitParticipant, () => context.writeTransaction(operationLabel, owner, (current) => {
			stageSqliteTransactionState(sqlPublicationAnchor(current.db), {
				stage() {},
				commit: () => {
					agent = "committed";
					agentCommitted = true;
				},
				rollback() {}
			});
			return mutate(current, (transferred) => ({
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
					admitShared(index, "restore", "commit");
					return {
						value: applied,
						bindings: next
					};
				})) throw new Error(plan.rollbackChanged, { cause: error });
			} catch (failure) {
				failures.push(failure);
			}
		}
		if (failures.length > 1) compensationFailure = encodeOpenClawStateWorkerError(new AggregateError(failures.slice(1), "Native binding compensation failed"), { includeOrdinary: true });
		try {
			writeShared("register", () => ({
				value: void 0,
				bindings
			}));
		} catch (failure) {
			failures.push(failure);
		}
		if (failures.length > 1) throw createSqliteLifecycleAggregateError(failures, "Native binding deletion settlement failed", error);
		throw error;
	}
}
//#endregion
export { prepareSessionNativeBindingDeletion as n, runSessionNativeBindingTransaction as r, deleteSessionWithNativeBindings as t };
