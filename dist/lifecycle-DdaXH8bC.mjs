import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { t as resolveIncognitoSessionExpiresAt } from "./incognito-session-key-B0aO5PSy.mjs";
import { n as readProviderRefusalReview } from "./src-UF9QYDzr.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-00MgEWj5.mjs";
import { u as loadTranscriptHeaderSync } from "./session-accessor.sqlite-read-8qBtzC-z.mjs";
import { n as isTerminalSessionStatus } from "./types-BZlUzQZy.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { r as readTranscriptMutationStateSync } from "./session-accessor.sqlite-metadata-read-Dij1AT2k.mjs";
import { n as resolveTimestamp, t as resolveSessionLifecycleTimestampsWithHeader } from "./lifecycle-timestamps-CS1MBHAi.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/sessions/provider-review.ts
const acknowledgments = resolveGlobalSingleton(Symbol.for("openclaw.providerReviewAcknowledgments"), () => /* @__PURE__ */ new WeakMap());
function createSessionProviderReview(params) {
	const details = readProviderRefusalReview(params.refusal.review);
	return {
		id: randomUUID(),
		sessionId: params.sessionId,
		runId: params.refusal.runId,
		provider: params.refusal.provider,
		model: params.refusal.model,
		runtimeId: params.refusal.runtimeId,
		...params.refusal.api ? { api: params.refusal.api } : {},
		...details ? { review: details } : {},
		...params.refusal.nativeThreadId ? { nativeThreadId: params.refusal.nativeThreadId } : {},
		...params.refusal.nativeTurnId ? { nativeTurnId: params.refusal.nativeTurnId } : {}
	};
}
/** The admitted runtime records its refusal before releasing the logical turn. */
async function recordSessionProviderReview(params) {
	params.assertCurrent();
	const { readSessionProviderReview, compareSessionProviderReview } = await import("./provider-review-store-nAfc_mZh.mjs");
	params.assertCurrent();
	const entry = await readSessionProviderReview(params.target, params.assertCurrent);
	params.assertCurrent();
	const previous = entry?.providerReview;
	const review = createSessionProviderReview({
		sessionId: params.target.sessionId,
		refusal: params.refusal
	});
	if (previous && !review.review && isDeepStrictEqual({
		...previous,
		id: void 0,
		review: void 0
	}, {
		...review,
		id: void 0,
		review: void 0
	})) return previous;
	if (previous && isDeepStrictEqual({
		...previous,
		id: void 0
	}, {
		...review,
		id: void 0
	})) return previous;
	const updated = await compareSessionProviderReview(params.target, {
		expectedReview: previous,
		nextReview: review,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent();
	if (!updated.providerReview) throw new Error("Provider precaution was not recorded");
	return updated.providerReview;
}
function canContinueSessionProviderReview(review, sessionKey) {
	if (isIncognitoSessionKey(sessionKey) || !readProviderRefusalReview(review.review)?.continuation) return false;
	return review.provider === "openai" && (review.runtimeId === "codex" ? Boolean(review.nativeThreadId && review.nativeTurnId) : review.runtimeId === "openclaw" && review.api === "openai-chatgpt-responses");
}
function readState(acknowledgment) {
	const state = acknowledgments.get(acknowledgment);
	if (!state || state.phase === "retired") throw new Error("Provider review acknowledgment is no longer current");
	try {
		state.assertCurrent();
	} catch (error) {
		state.phase = "retired";
		throw error;
	}
	return state;
}
async function issueProviderReviewAcknowledgment(params) {
	params.assertCurrent();
	if (isIncognitoSessionKey(params.target.sessionKey)) throw new Error("Provider review cannot be continued in an incognito session");
	const { readSessionProviderReview } = await import("./provider-review-store-nAfc_mZh.mjs");
	params.assertCurrent();
	const target = Object.freeze({ ...params.target });
	const entry = await readSessionProviderReview(target, params.assertCurrent);
	params.assertCurrent();
	const review = entry?.providerReview;
	if (entry?.sessionId !== target.sessionId || entry.lifecycleRevision !== target.lifecycleRevision || !review || review.id !== params.reviewId || review.sessionId !== target.sessionId || review.runId === params.nextRunId || !canContinueSessionProviderReview(review, target.sessionKey)) throw new Error("Provider review changed or cannot be continued; refresh the findings");
	const snapshot = structuredClone(review);
	if (snapshot.review?.continuation) Object.freeze(snapshot.review.continuation);
	if (snapshot.review) Object.freeze(snapshot.review);
	Object.freeze(snapshot);
	const acknowledgment = Object.freeze({
		read: () => {
			const { review: currentReview, phase } = readProviderReviewAcknowledgment(acknowledgment);
			return Object.freeze({
				review: currentReview,
				phase
			});
		},
		assertRuntime: async (runtime) => {
			const current = readProviderReviewAcknowledgment(acknowledgment);
			const assertRuntimeCurrent = runtime.assertCurrent;
			await assertSessionProviderReviewWorkStart({
				target: current.target,
				acknowledgment,
				runId: current.nextRunId,
				provider: runtime.provider,
				model: runtime.model,
				runtimeId: runtime.runtimeId,
				api: runtime.api,
				assertCurrent: () => {
					assertRuntimeCurrent();
					readState(acknowledgment);
				}
			});
		},
		acceptNativeTurn: async (accepted) => {
			const current = readProviderReviewAcknowledgment(acknowledgment);
			if (current.review.runtimeId !== "codex") throw new Error("Provider review does not belong to a native Codex turn");
			await acceptProviderReviewAcknowledgment(acknowledgment, {
				runId: current.nextRunId,
				nativeThreadId: accepted.nativeThreadId,
				nativeTurnId: accepted.nativeTurnId,
				assertCurrent: accepted.assertCurrent
			});
		}
	});
	acknowledgments.set(acknowledgment, {
		target,
		review: snapshot,
		nextRunId: params.nextRunId,
		assertCurrent: params.assertCurrent,
		phase: "pending"
	});
	return acknowledgment;
}
function readProviderReviewAcknowledgment(acknowledgment) {
	const state = readState(acknowledgment);
	return {
		target: state.target,
		review: state.review,
		nextRunId: state.nextRunId,
		phase: state.phase === "pending" ? "pending" : "accepted"
	};
}
function retireProviderReviewAcknowledgment(acknowledgment) {
	const state = acknowledgments.get(acknowledgment);
	if (state) state.phase = "retired";
}
/** Retries and fallback runtimes cannot turn one acknowledgment into another physical attempt. */
function claimProviderReviewAttempt(acknowledgment, runId) {
	const state = readState(acknowledgment);
	if (state.nextRunId !== runId || state.attemptClaimed) throw new Error("Provider acknowledgment already belongs to its single admitted attempt");
	state.attemptClaimed = true;
}
async function assertSessionProviderReviewWorkStart(params) {
	params.assertCurrent();
	const { readSessionProviderReview } = await import("./provider-review-store-nAfc_mZh.mjs");
	params.assertCurrent();
	const entry = await readSessionProviderReview(params.target, params.assertCurrent);
	params.assertCurrent();
	if (params.acknowledgment) {
		if (!entry) throw new Error("Provider review session changed before continuation");
		assertProviderReviewAcknowledgment(params.acknowledgment, {
			sessionKey: params.target.sessionKey,
			entry,
			runId: params.runId
		});
		const { review } = readProviderReviewAcknowledgment(params.acknowledgment);
		if (review.provider !== params.provider || review.model !== params.model || review.runtimeId !== params.runtimeId || review.api !== params.api) throw new Error("Provider continuation must keep the reviewed runtime and model");
	} else if (entry?.providerReview) throw new Error("This session is paused as a precaution. Review the provider findings in chat before continuing.");
}
/** Entry is freshly read by the admission owner; retained capabilities never override replacement. */
function assertProviderReviewAcknowledgment(acknowledgment, current) {
	const state = readState(acknowledgment);
	if (current.sessionKey !== state.target.sessionKey || current.entry.sessionId !== state.target.sessionId || current.entry.lifecycleRevision !== state.target.lifecycleRevision || current.runId !== void 0 && current.runId !== state.nextRunId || (state.phase === "pending" ? !isDeepStrictEqual(current.entry.providerReview, state.review) : current.entry.providerReview !== void 0)) {
		state.phase = "retired";
		throw new Error("Provider review changed; refresh the findings before continuing");
	}
}
/** Called by the transport owner only after the provider accepts a distinct new turn. */
async function acceptProviderReviewAcknowledgment(acknowledgment, accepted) {
	const assertOperationCurrent = accepted.assertCurrent;
	const assertAcceptanceCurrent = () => {
		assertOperationCurrent?.();
		readState(acknowledgment);
	};
	assertAcceptanceCurrent();
	const state = readState(acknowledgment);
	if (accepted.runId !== state.nextRunId || state.review.runtimeId === "codex" && (accepted.nativeThreadId !== state.review.nativeThreadId || !accepted.nativeTurnId || accepted.nativeTurnId === state.review.nativeTurnId)) throw new Error("Provider continuation acceptance does not match its acknowledged review");
	if (state.phase === "accepted") {
		if (state.acceptedNativeTurnId !== accepted.nativeTurnId) throw new Error("Provider continuation was already accepted by another turn");
		return;
	}
	const { compareSessionProviderReview } = await import("./provider-review-store-nAfc_mZh.mjs");
	assertAcceptanceCurrent();
	await compareSessionProviderReview(state.target, {
		expectedReview: state.review,
		nextReview: void 0,
		assertCurrent: assertAcceptanceCurrent
	});
	assertAcceptanceCurrent();
	state.acceptedNativeTurnId = accepted.nativeTurnId;
	state.phase = "accepted";
}
//#endregion
//#region src/config/sessions/lifecycle.ts
function isRestartRecoveryTombstone(entry) {
	return entry?.mainRestartRecovery?.tombstone !== void 0;
}
/** Stable Gateway error detail for stale session lifecycle requests. */
const SESSION_LIFECYCLE_CHANGED_ERROR_REASON = "session-changed";
/** Lifecycle-owned expired, initializing, restart-tombstoned, and archived sessions reject work. */
function resolveSessionWorkStartError(sessionKey, entry, options) {
	if (options?.expectedSessionId && !entry) return `Session "${sessionKey}" was deleted while starting work. Retry.`;
	if (options?.expectedSessionId && entry?.sessionId !== options.expectedSessionId) return `Session "${sessionKey}" changed while starting work. Retry.`;
	const incognitoExpiresAt = entry ? resolveIncognitoSessionExpiresAt(entry) : void 0;
	if ((entry?.incognito || isIncognitoSessionKey(sessionKey)) && incognitoExpiresAt !== void 0 && Date.now() >= incognitoExpiresAt) return `Incognito session "${sessionKey}" expired. Start a new Incognito session.`;
	if (entry?.initializationPending === true) return `Session "${sessionKey}" is still initializing. Retry after initialization completes.`;
	if (entry?.providerReview && options?.purpose !== "accepted-result-settlement") try {
		if (!options?.providerReviewAcknowledgment) return `Session "${sessionKey}" is paused as a precaution. Review the provider findings in chat before continuing.`;
		assertProviderReviewAcknowledgment(options.providerReviewAcknowledgment, {
			sessionKey,
			entry,
			runId: options.runId
		});
	} catch {
		return `Session "${sessionKey}" provider review changed. Refresh the findings before continuing.`;
	}
	if (isRestartRecoveryTombstone(entry)) {
		if (options?.allowRestartTombstoneReplacement === true && !entry?.providerReview) return;
		return entry?.modelSelectionLocked === true ? `Session "${sessionKey}" ended during restart recovery and cannot be replaced while model selection is locked. Open it in WebChat and use Resume in new session.` : `Session "${sessionKey}" ended during restart recovery. Use /new or /reset to start a replacement session.`;
	}
	if (entry?.archivedAt !== void 0) return `Session "${sessionKey}" is archived. Restore it before starting new work.`;
	if (!options?.allowPendingWorkspace && (entry?.pendingProjectGitUrl !== void 0 || entry?.pendingWorktree !== void 0)) return `Session "${sessionKey}" workspace is not ready. Wait for setup to finish or retry in chat.`;
}
function resolvePositiveTimestamp(value) {
	const timestampMs = resolveTimestamp(value);
	return timestampMs !== void 0 && timestampMs > 0 ? timestampMs : void 0;
}
function resolveSessionLifecycleTimestamps(params) {
	return resolveSessionLifecycleTimestampsWithHeader({
		...params,
		readHeader: (scope) => params.readHeader ? params.readHeader(scope.sessionId) : loadTranscriptHeaderSync(scope)
	});
}
function resolveTerminalMainSessionTranscriptRegistryCheck(params) {
	if (!params.entry || !params.sessionKey) return;
	const configuredMainSessionKey = canonicalizeMainSessionAlias({
		cfg: { session: {
			scope: params.sessionScope,
			mainKey: params.mainKey
		} },
		agentId: params.agentId,
		sessionKey: params.mainKey ?? "main"
	});
	if (canonicalizeMainSessionAlias({
		cfg: { session: {
			scope: params.sessionScope,
			mainKey: params.mainKey
		} },
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}) !== configuredMainSessionKey) return;
	if (params.entry.status === "running") return;
	if (!(isTerminalSessionStatus(params.entry.status) || resolvePositiveTimestamp(params.entry.endedAt) !== void 0)) return;
	if (params.entry.status === "done") return;
	if (params.entry.status === "failed") return;
	const registryTimestampMs = resolvePositiveTimestamp(params.entry.updatedAt);
	if (registryTimestampMs === void 0) return;
	const sessionId = typeof params.entry.sessionId === "string" ? params.entry.sessionId.trim() : "";
	if (!sessionId) return;
	return {
		sessionId,
		registryTimestampMs
	};
}
function isTranscriptMutationNewerThanRegistry(params) {
	const transcriptMutationAtMs = Math.floor(params.transcriptMutationAtMs);
	const registryTimestampMs = Math.floor(params.registryTimestampMs);
	return Number.isFinite(transcriptMutationAtMs) && transcriptMutationAtMs > registryTimestampMs;
}
function hasTerminalMainSessionTranscriptNewerThanRegistrySync(params) {
	const check = resolveTerminalMainSessionTranscriptRegistryCheck(params);
	if (!check) return false;
	try {
		const mutation = readTranscriptMutationStateSync({
			agentId: params.agentId,
			sessionId: check.sessionId,
			storePath: params.storePath
		});
		if (mutation.updatedAt === null) return false;
		return isTranscriptMutationNewerThanRegistry({
			transcriptMutationAtMs: mutation.updatedAt,
			registryTimestampMs: mutation.observedAt ?? check.registryTimestampMs
		});
	} catch {
		return false;
	}
}
async function hasTerminalMainSessionTranscriptNewerThanRegistry(params) {
	return hasTerminalMainSessionTranscriptNewerThanRegistrySync(params);
}
//#endregion
export { resolveSessionLifecycleTimestamps as a, assertSessionProviderReviewWorkStart as c, createSessionProviderReview as d, issueProviderReviewAcknowledgment as f, retireProviderReviewAcknowledgment as h, isRestartRecoveryTombstone as i, canContinueSessionProviderReview as l, recordSessionProviderReview as m, hasTerminalMainSessionTranscriptNewerThanRegistry as n, resolveSessionWorkStartError as o, readProviderReviewAcknowledgment as p, hasTerminalMainSessionTranscriptNewerThanRegistrySync as r, acceptProviderReviewAcknowledgment as s, SESSION_LIFECYCLE_CHANGED_ERROR_REASON as t, claimProviderReviewAttempt as u };
