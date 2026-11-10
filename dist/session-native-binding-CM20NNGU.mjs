import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { c as SqliteWorkerError, u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-76OxWRqj.mjs";
import { o as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { n as collectReclamationDeletionEntries, r as prepareReclamationPublication } from "./session-accessor.sqlite-reclamation-publication-Cd995rIj.mjs";
import { n as runSessionEntryWorkerOperation } from "./session-entry-patch-CSunl6ZV.mjs";
import { n as beginPluginStatePublication } from "./plugin-state-publication-CI0IKkN0.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-lifecycle-worker-publication.ts
/** Worker-local reset notifications become eligible only with the owning commit receipt. */
function publishSessionLifecycleWorkerEffects(plan, result) {
	if (plan.kind !== "lifecycle-projection-commit" || result.kind !== plan.kind) return;
	for (const sessionId of result.value.projectionReconcileSessionIds ?? []) startSessionTranscriptIndexReconcile({
		...plan.databaseOptions,
		preferredSessionId: sessionId
	});
	for (const sessionKey of result.value.progressCardResetKeys ?? []) emitSessionLifecycleEvent({
		agentId: plan.agentId,
		sessionKey,
		reason: "progress-card-reset"
	});
}
//#endregion
//#region src/config/sessions/session-native-binding.ts
const unresolved = resolveGlobalSingleton(Symbol.for("openclaw.nativeSessionDeletionOutcomes"), () => /* @__PURE__ */ new Set());
function deleteSessionWithNativeBindingsInWorker(plan, captured, assertCurrent, onResult) {
	return runSessionNativeBindingWorkerOperation({
		database: plan.databaseOptions,
		agentId: plan.databaseOptions.agentId,
		entries: collectReclamationDeletionEntries(plan),
		captured,
		assertCurrent,
		candidateKind: "session-native-binding-deletion",
		execute: (worker, participants) => worker.execute({
			type: "session.nativeBindings.delete",
			input: {
				...participants,
				plan
			}
		}),
		onCommitted(candidate, published, identity) {
			try {
				onResult?.(candidate.result, identity);
				publishSessionLifecycleWorkerEffects(plan, candidate.result);
			} finally {
				if (plan.kind === "lifecycle-projection-commit") {
					if (published) publishCommittedSessionIdentity(plan.agentId, identity, published.previous, published.current, published.prepared);
				} else prepareReclamationPublication(plan, identity, candidate.result)?.();
			}
			return candidate.result;
		}
	});
}
/** Retain the same native generation across a caller's typed compound A operation. */
function runSessionNativeBindingWorkerOperation(params) {
	const { captured } = params;
	const agentSource = readDatabasePathIdentitySync(params.database.path);
	const operationId = randomUUID();
	const members = captured.participants;
	const state = captureOpenClawStateWorkerContext({ env: params.database.env });
	const sharedSource = members.find(({ participant }) => participant.source)?.participant.source ?? state.admission.identity;
	for (const { participant } of members) if (participant.source && (participant.source.canonicalPath !== sharedSource.canonicalPath || participant.source.key !== sharedSource.key || participant.source.birthtime !== sharedSource.birthtime)) throw new Error("Native binding participants belong to different physical stores");
	const input = {
		operationId,
		sharedSource,
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
		for (const blocked of unresolved) if (blocked.source.key === agentSource.key && blocked.source.birthtime === agentSource.birthtime && blocked.source.canonicalPath === agentSource.canonicalPath && blocked.entries.some((old) => params.entries.some((current) => current.sessionKey === old.sessionKey && current.entry.sessionId === old.entry.sessionId && current.entry.lifecycleRevision === old.entry.lifecycleRevision))) throw blocked.error;
		params.assertCurrent();
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
	const publication = beginPluginStatePublication(() => sharedSource.key, state.assertPublicationCurrent ?? state.admission.assertCurrent);
	return runSessionEntryWorkerOperation({
		...params,
		assertCurrent: assertHeld,
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
				if (facts.kind === "native-binding-ready" || facts.phase === "delete") params.onTransactionFacts?.(facts);
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
				let publicationFailure;
				if ((committed || rolledBack) && receipt.pluginState) try {
					publication.install(receipt.pluginState);
				} catch (cause) {
					publicationFailure = { cause };
				}
				if (!committed && !rolledBack || publicationFailure) {
					const error = new SqliteWorkerError(publicationFailure ? "Native binding settlement could not publish current lease facts; this generation cannot be reused" : "Native binding settlement is unknown; this generation cannot be reused", "outcome-unknown");
					error.cause = publicationFailure?.cause ?? (outcome.ok ? void 0 : outcome.error);
					if (receipt?.compensationFailure) {
						const compensation = /* @__PURE__ */ new Error("Native binding compensation failed");
						retainOpenClawStateWorkerErrorPayload(compensation, receipt.compensationFailure);
						error.cause = new AggregateError([error.cause, hydrateOpenClawStateWorkerError(compensation, { includeOrdinary: true })], "Agent deletion and native binding compensation failed", { cause: error.cause });
					}
					failure = error;
					publication.finish("unknown");
					unresolved.add({
						source: agentSource,
						entries: params.entries,
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
					return await commit(() => params.execute(worker, input));
				} catch (error) {
					if (error !== renewalPending || !readinessRefused) throw error;
					await Promise.all(members.map(({ participant }) => participant.joinRenewal()));
					assertHeld();
				}
			}
		}
	}).catch((error) => {
		if (hasSqliteWorkerOutcomeUnknown(error)) publication.finish("unknown");
		throw error;
	}).finally(() => publication.finish("completed"));
}
//#endregion
export { runSessionNativeBindingWorkerOperation as n, publishSessionLifecycleWorkerEffects as r, deleteSessionWithNativeBindingsInWorker as t };
