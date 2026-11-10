import { r as normalizeProviderId } from "../../provider-id-D1VImdKk.mjs";
import { o as runSqliteReadSnapshotSync } from "../../sqlite-transaction-CpDyZPQ0.mjs";
import { G as estimateParentForkPromptTokens, J as resolveParentForkSourceTranscript, K as planParentForkDecision, W as buildForkedChildTranscriptEvents } from "../../session-actor-memory-owner-BSARM2d5.mjs";
import { a as normalizeStoreSessionKey } from "../../store-entry-CUxN9KZj.mjs";
import { a as preserveSqliteSameKeySessionRolloverLineage } from "../../session-entry-lineage-B7Mubzwj.mjs";
import { n as forkCliSessionBindings } from "../../cli-session-binding-Dx1VbkI8.mjs";
import { r as mergeSessionEntry } from "../../types-BGDhC4_W.mjs";
import { i as assertModelSelectionUnlocked, t as MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE } from "../../model-overrides-CgHG3YVT.mjs";
import { r as formatLegacySqliteSessionMarkerForScope } from "../../session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as appendTranscriptEventsInTransaction } from "../../session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { _ as readSessionIdentitySnapshot, a as writeSessionEntry, m as normalizeLifecycleTarget, v as resolveLifecyclePrimaryEntry } from "../../session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { l as loadTranscriptEventsFromDatabase } from "../../session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { r as prepareSessionEntryReplacementPublication } from "../../session-accessor.sqlite-replacement-state-BqtqwF34.mjs";
import { i as transferSessionEntryWorkerCandidate, t as bindSessionWorkerBackend } from "../../session-entry-patch.worker-CyYnfK5G.mjs";
import { t as commitSessionForkMessageCut } from "../../session-message-cut.worker-Dulwnzp8.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-parent-fork.worker.ts
function prepareParentForkEntry(params, { open }) {
	const database = open();
	const parentTarget = normalizeLifecycleTarget(params.parentTarget);
	const sessionTarget = normalizeLifecycleTarget(params.sessionTarget);
	return runSqliteReadSnapshotSync(database.db, () => {
		return {
			parentEntry: resolveLifecyclePrimaryEntry(database, parentTarget)?.entry,
			base: resolveLifecyclePrimaryEntry(database, sessionTarget)?.entry ?? params.fallbackEntry
		};
	});
}
function readParentForkSource(input, { open }) {
	const database = open();
	return resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(database, input.sessionId), input.forkFrom);
}
function commitParentFork(input, context) {
	return context.writeTransaction("session.parent-fork.commit", "Session parent fork", (database) => {
		const sessionKey = input.kind === "entry" ? normalizeLifecycleTarget(input.params.sessionTarget).canonicalKey : normalizeStoreSessionKey(input.params.sessionKey);
		const previous = readSessionIdentitySnapshot(database, [sessionKey]);
		const result = commitParentForkInTransaction(database, input, context.options);
		const candidate = {
			kind: "session-parent-fork",
			result,
			publication: prepareSessionEntryReplacementPublication({
				previous,
				current: readSessionIdentitySnapshot(database, [sessionKey]),
				pendingArchiveRecovery: false,
				membershipInvalidatedKeys: result.status === "forked" ? [sessionKey] : [],
				maintenancePlans: []
			}, database)
		};
		return transferSessionEntryWorkerCandidate(database, context.admit, candidate);
	});
}
function commitParentForkInTransaction(database, input, options) {
	return input.kind === "entry" ? commitEntry(database, input, { options }) : forkSqliteParentTranscriptInTransaction(database, {
		...options,
		agentId: input.agentId,
		databaseAgentId: options.agentId,
		sessionKey: input.params.sessionKey
	}, {
		...input.params,
		targetSessionKey: input.params.sessionKey,
		source: input.source,
		parentSessionFile: input.parentSessionFile
	});
}
function commitEntry(database, input, context) {
	const { params, patch } = input;
	const parentTarget = normalizeLifecycleTarget(params.parentTarget);
	const sessionTarget = normalizeLifecycleTarget(params.sessionTarget);
	const parentEntry = resolveLifecyclePrimaryEntry(database, parentTarget)?.entry;
	const base = resolveLifecyclePrimaryEntry(database, sessionTarget)?.entry ?? params.fallbackEntry;
	if (!parentEntry?.sessionId) return { status: "missing-parent" };
	if (!base) return { status: "missing-entry" };
	if (patch?.skipExisting && base.sessionId?.trim()) return {
		status: "skipped",
		reason: "existing-entry",
		parentEntry,
		sessionEntry: patch.skipped ? writeSessionEntry(database, sessionTarget.canonicalKey, preserveSqliteSameKeySessionRolloverLineage({
			next: mergeSessionEntry(base, patch.skipped),
			previous: base,
			sessionKey: sessionTarget.canonicalKey
		}), { previousEntry: base }) : base
	};
	const forkedPatch = patch?.forked;
	const providers = new Set(input.cliForkProviders?.map(normalizeProviderId));
	const committed = forkSessionEntryInTransaction(database, {
		...context.options,
		agentId: input.agentId,
		databaseAgentId: context.options.agentId,
		sessionKey: sessionTarget.canonicalKey
	}, params, {
		parentEntry,
		base
	}, forkCliSessionBindings(parentEntry, (provider) => providers.has(normalizeProviderId(provider))), forkedPatch);
	if (!("skip" in committed)) return committed.result;
	return {
		status: "skipped",
		reason: "decision-skip",
		parentEntry,
		sessionEntry: base,
		decision: committed.skip.decision
	};
}
function forkSessionEntryInTransaction(writeDatabase, resolved, params, prepared, cliSessionBindings, patch) {
	const parentTarget = normalizeLifecycleTarget(params.parentTarget);
	const sessionTarget = normalizeLifecycleTarget(params.sessionTarget);
	const freshParent = prepared.parentEntry;
	const freshBase = prepared.base;
	assertModelSelectionUnlocked(freshParent, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
	const source = resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(writeDatabase, freshParent.sessionId));
	const decision = planParentForkDecision(freshParent, estimateParentForkPromptTokens(source));
	if (decision.status === "skip") return { skip: {
		decision,
		base: freshBase,
		parentEntry: freshParent
	} };
	const fork = forkSqliteParentTranscriptInTransaction(writeDatabase, resolved, {
		parentEntry: freshParent,
		parentSessionKey: parentTarget.canonicalKey,
		source,
		targetSessionKey: sessionTarget.canonicalKey
	});
	if (fork.status !== "created") return { result: fork.status === "missing-parent" ? { status: "missing-parent" } : { status: "failed" } };
	const forkIdentityPatch = {
		...patch,
		forkSource: {
			sessionKey: parentTarget.canonicalKey,
			sessionId: freshParent.sessionId
		},
		forkedFromParent: true,
		lifecycleRunId: void 0,
		lastRunId: void 0,
		sessionId: fork.transcript.sessionId,
		totalTokens: void 0,
		totalTokensFresh: false,
		totalTokensVersion: void 0,
		cliSessionBindings,
		cliSessionIds: void 0,
		claudeCliSessionId: void 0
	};
	const next = writeSessionEntry(writeDatabase, sessionTarget.canonicalKey, mergeSessionEntry(freshBase, forkIdentityPatch), { previousEntry: freshBase });
	return { result: {
		status: "forked",
		decision,
		fork: fork.transcript,
		parentEntry: freshParent,
		sessionEntry: structuredClone(next)
	} };
}
function forkSqliteParentTranscriptInTransaction(database, resolved, params) {
	if (!params.parentEntry.sessionId) return { status: "missing-parent" };
	const source = params.source === void 0 ? resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(database, params.parentEntry.sessionId), params.forkFrom) : params.source;
	if (!source) return { status: "failed" };
	const limitDecision = resolveParentForkLimitDecision(params, source);
	if (limitDecision) return {
		status: "too-large",
		decision: limitDecision
	};
	const sessionId = params.targetSessionId ?? randomUUID();
	const targetScope = {
		...resolved,
		sessionId,
		sessionKey: normalizeStoreSessionKey(params.targetSessionKey)
	};
	const parentSessionFile = params.parentSessionFile ?? formatLegacySqliteSessionMarkerForScope({
		...resolved,
		sessionId: params.parentEntry.sessionId,
		sessionKey: normalizeStoreSessionKey(params.parentSessionKey)
	});
	appendTranscriptEventsInTransaction(database, targetScope, buildForkedChildTranscriptEvents({
		parentSessionFile,
		source,
		targetSessionId: sessionId
	}));
	return {
		status: "created",
		transcript: {
			sessionFile: targetScope.sessionKey,
			sessionId
		}
	};
}
function resolveParentForkLimitDecision(params, source) {
	if (!params.enforceTokenLimit) return;
	const decision = planParentForkDecision(params.parentEntry, estimateParentForkPromptTokens(source), {
		maxTokens: params.maxTokens,
		preferTranscriptEstimate: params.forkFrom === "last-completed"
	});
	return decision.status === "skip" ? decision : void 0;
}
//#endregion
//#region src/config/sessions/session-fork-domain.worker.ts
/** The domain lends the canonical executor's connection and admission, never a second writer. */
function bindSqliteWorkerBackend(input, bound) {
	return bindSessionWorkerBackend(input, bound, "Session fork", (context) => (command) => {
		switch (command.type) {
			case "session.parentFork.prepare": return prepareParentForkEntry(command.input, context);
			case "session.parentFork.source": return readParentForkSource(command.input, context);
			case "session.parentFork.commit": return commitParentFork(command.input, context);
			case "session.messageCut.fork": return commitSessionForkMessageCut(command.input, context);
		}
		throw new Error("Unknown session fork domain operation");
	});
}
//#endregion
export { bindSqliteWorkerBackend };
