import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { i as isIncognitoSessionKey, t as resolveIncognitoSessionExpiresAt } from "./incognito-session-key-BWpn88lo.mjs";
import { n as readProviderRefusalReview } from "./diagnostics-CAGhEztD.mjs";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
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
	const { readSessionProviderReview, compareSessionProviderReview } = await import("./provider-review-store-DS6xrVpb.mjs");
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
	const { readSessionProviderReview } = await import("./provider-review-store-DS6xrVpb.mjs");
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
	const { readSessionProviderReview } = await import("./provider-review-store-DS6xrVpb.mjs");
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
	const { compareSessionProviderReview } = await import("./provider-review-store-DS6xrVpb.mjs");
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
//#region src/config/sessions/session-work-start.ts
function isRestartRecoveryTombstone(entry) {
	return entry?.mainRestartRecovery?.tombstone !== void 0;
}
/** Stable Gateway error detail for stale session lifecycle requests. */
const SESSION_LIFECYCLE_CHANGED_ERROR_REASON = "session-changed";
var SessionWorkStartError = class extends Error {
	constructor(reason, message, retryable = false) {
		super(message);
		this.reason = reason;
		this.retryable = retryable;
		this.name = "SessionWorkStartError";
	}
};
/** One work-start policy supplies both user errors and recovery disposition. */
function resolveSessionWorkStartBlock(sessionKey, entry, options) {
	if (options?.expectedSessionId && !entry) return new SessionWorkStartError("deleted", `Session "${sessionKey}" was deleted while starting work. Retry.`);
	if (options?.expectedSessionId && entry?.sessionId !== options.expectedSessionId) return new SessionWorkStartError("changed", `Session "${sessionKey}" changed while starting work. Retry.`);
	const incognitoExpiresAt = entry ? resolveIncognitoSessionExpiresAt(entry) : void 0;
	if ((entry?.incognito || isIncognitoSessionKey(sessionKey)) && incognitoExpiresAt !== void 0 && Date.now() >= incognitoExpiresAt) return new SessionWorkStartError("expired", `Incognito session "${sessionKey}" expired. Start a new Incognito session.`);
	if (entry?.initializationPending === true) return new SessionWorkStartError("initialization_pending", `Session "${sessionKey}" is still initializing. Retry after initialization completes.`, true);
	if (entry?.providerReview && options?.purpose !== "accepted-result-settlement") try {
		if (!options?.providerReviewAcknowledgment) return new SessionWorkStartError("provider_review", `Session "${sessionKey}" is paused as a precaution. Review the provider findings in chat before continuing.`);
		assertProviderReviewAcknowledgment(options.providerReviewAcknowledgment, {
			sessionKey,
			entry,
			runId: options.runId
		});
	} catch {
		return new SessionWorkStartError("provider_review", `Session "${sessionKey}" provider review changed. Refresh the findings before continuing.`);
	}
	if (isRestartRecoveryTombstone(entry)) {
		if (options?.allowRestartTombstoneReplacement === true && !entry?.providerReview) return;
		return new SessionWorkStartError("restart_tombstone", entry?.modelSelectionLocked === true ? `Session "${sessionKey}" ended during restart recovery and cannot be replaced while model selection is locked. Open it in WebChat and use Resume in new session.` : `Session "${sessionKey}" ended during restart recovery. Use /new or /reset to start a replacement session.`);
	}
	if (entry?.archivedAt !== void 0) return new SessionWorkStartError("archived", `Session "${sessionKey}" is archived. Restore it before starting new work.`);
	if (!options?.allowPendingWorkspace && (entry?.pendingProjectGitUrl !== void 0 || entry?.pendingWorktree !== void 0)) return new SessionWorkStartError("workspace_pending", `Session "${sessionKey}" workspace is not ready. Wait for setup to finish or retry in chat.`, true);
}
function resolveSessionWorkStartError(sessionKey, entry, options) {
	return resolveSessionWorkStartBlock(sessionKey, entry, options)?.message;
}
//#endregion
export { resolveSessionWorkStartError as a, canContinueSessionProviderReview as c, issueProviderReviewAcknowledgment as d, readProviderReviewAcknowledgment as f, resolveSessionWorkStartBlock as i, claimProviderReviewAttempt as l, retireProviderReviewAcknowledgment as m, SessionWorkStartError as n, acceptProviderReviewAcknowledgment as o, recordSessionProviderReview as p, isRestartRecoveryTombstone as r, assertSessionProviderReviewWorkStart as s, SESSION_LIFECYCLE_CHANGED_ERROR_REASON as t, createSessionProviderReview as u };
