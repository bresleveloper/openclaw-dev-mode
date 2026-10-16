import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { c as SqliteWorkerError, l as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { n as runSessionEntryWorkerOperation } from "./session-entry-patch-geetJjjX.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-native-binding.ts
const unresolved = resolveGlobalSingleton(Symbol.for("openclaw.nativeSessionDeletionOutcomes"), () => /* @__PURE__ */ new Set());
/** Retains host native custody while A and its reversible S participant settle independently. */
async function deleteSessionWithNativeBindingsInWorker(plan, captured, assertCurrent, onResult) {
	const agentSource = readDatabasePathIdentitySync(plan.databaseOptions.path);
	const operationId = randomUUID();
	const members = captured.participants;
	const state = captureOpenClawStateWorkerContext({ env: plan.databaseOptions.env });
	const sharedSource = members.find(({ participant }) => participant.source)?.participant.source ?? state.admission.identity;
	for (const { participant } of members) if (participant.source && (participant.source.canonicalPath !== sharedSource.canonicalPath || participant.source.key !== sharedSource.key || participant.source.birthtime !== sharedSource.birthtime)) throw new Error("Native binding participants belong to different physical stores");
	const input = {
		operationId,
		sharedSource,
		plan,
		participants: members.map(({ sessionKey, entry, participant }) => ({
			sessionKey,
			entry,
			binding: participant.binding
		}))
	};
	const renewalPending = /* @__PURE__ */ new Error("Native binding renewal must settle before transaction entry");
	let readinessRefused = false;
	let readinessAuthorized = false;
	let failure;
	let admitted;
	const assertHeld = () => {
		for (const blocked of unresolved) if (blocked.source.key === agentSource.key && blocked.source.birthtime === agentSource.birthtime && blocked.source.canonicalPath === agentSource.canonicalPath && blocked.plan.preparedTargetSnapshot.some((old) => plan.preparedTargetSnapshot.some((current) => current.sessionKey === old.sessionKey && current.entry.sessionId === old.entry.sessionId && current.entry.lifecycleRevision === old.entry.lifecycleRevision))) throw blocked.error;
		assertCurrent();
		captured.assertCurrent();
		state.admission.assertCurrent();
		for (const { participant } of members) participant.assertCurrent();
	};
	const readReceipt = (value) => {
		if (!isRecord(value) || value.kind !== "session-native-binding" || value.operationId !== operationId || ![
			"pending",
			"committed",
			"rolled-back"
		].includes(String(value.agent)) || !Array.isArray(value.bindings) || value.bindings.length !== members.length || !value.bindings.every((phase) => [
			"pending",
			"absent",
			"deleted",
			"restored"
		].includes(phase))) return;
		return value;
	};
	return runSessionEntryWorkerOperation({
		database: plan.databaseOptions,
		agentId: plan.databaseOptions.agentId,
		assertCurrent: assertHeld,
		candidateKind: "session-native-binding-deletion",
		nativeSettlement: {
			get failure() {
				return failure;
			},
			onAdmission(admission, retained, request, grant) {
				const facts = isRecord(request.facts) ? request.facts.publication : void 0;
				if (!isRecord(facts) || !["native-binding-ready", "native-binding-storage"].includes(String(facts.kind))) return false;
				if (facts.operationId !== operationId) throw new Error("Native binding grant belongs to another operation");
				admitted = {
					admission,
					retained
				};
				assertHeld();
				if (facts.kind === "native-binding-ready") {
					if (members.some(({ participant }) => participant.renewalPending())) {
						readinessRefused = true;
						throw renewalPending;
					}
					for (const { participant } of members) participant.quiesce();
				}
				if (!grant()) throw new Error("Native binding settlement authority expired");
				if (facts.kind === "native-binding-ready") readinessAuthorized = true;
				return true;
			},
			readCommitReceipt(value) {
				const receipt = readReceipt(value);
				return receipt?.agent === "committed" ? receipt.receipt : void 0;
			},
			async settle(outcome, acknowledged) {
				const settlement = await admitted?.retained.settled;
				const receipt = readReceipt(admitted?.admission.committed?.facts);
				const completed = settlement?.kind === "completed" && admitted?.admission.settlement?.kind === "completed";
				if (completed && readinessRefused && !receipt && !outcome.ok && outcome.error === renewalPending) return "not-entered";
				if (!readinessAuthorized && !outcome.ok && !hasSqliteWorkerOutcomeUnknown(outcome.error) && (!admitted || completed)) {
					for (const { participant } of members) participant.settle("rolled-back");
					return "not-entered";
				}
				const committed = completed && acknowledged && receipt?.agent === "committed";
				const rolledBack = completed && receipt?.agent === "rolled-back" && !receipt.bindings.includes("deleted");
				if (!committed && !rolledBack) {
					const error = new SqliteWorkerError("Native binding settlement is unknown; this generation cannot be reused", "outcome-unknown");
					error.cause = outcome.ok ? void 0 : outcome.error;
					if (receipt?.compensationFailure) {
						const compensation = /* @__PURE__ */ new Error("Native binding compensation failed");
						retainOpenClawStateWorkerErrorPayload(compensation, receipt.compensationFailure);
						error.cause = new AggregateError([error.cause, hydrateOpenClawStateWorkerError(compensation, { includeOrdinary: true })], "Agent deletion and native binding compensation failed", { cause: error.cause });
					}
					failure = error;
					unresolved.add({
						source: agentSource,
						plan,
						custody: captured,
						error
					});
					for (const { participant } of members) participant.settle("unknown", error);
					return "unknown";
				}
				for (const [index, { participant }] of members.entries()) participant.settle(committed && receipt.bindings[index] !== "pending" ? "committed" : "rolled-back");
				return committed ? "committed" : "rolled-back";
			}
		},
		async run(worker, commit) {
			for (;;) {
				readinessRefused = false;
				readinessAuthorized = false;
				admitted = void 0;
				try {
					return await commit(() => worker.execute({
						type: "session.nativeBindings.delete",
						input
					}));
				} catch (error) {
					if (error !== renewalPending || !readinessRefused) throw error;
					await Promise.all(members.map(({ participant }) => participant.joinRenewal()));
					assertHeld();
				}
			}
		},
		onAcknowledged(candidate) {
			if (candidate.result.value.deleted) captured.committed();
		},
		onCommitted(candidate, _published, identity) {
			onResult?.(candidate.result, identity);
			return candidate.result;
		}
	});
}
//#endregion
export { deleteSessionWithNativeBindingsInWorker };
