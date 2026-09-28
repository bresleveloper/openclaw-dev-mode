import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as canonicalizeMainSessionAlias } from "./main-session-De-bcoks.mjs";
import { n as SESSION_WORK_START_CHANGED_ERROR_CODE, r as SESSION_WORK_START_INVALIDATED_ERROR_CODE, t as SESSION_RESTART_RECOVERY_TOMBSTONE_ERROR_CODE } from "./work-start-error-unYqNOPf.mjs";
import { n as readProviderRefusalReview } from "./diagnostics-CAGhEztD.mjs";
import { k as readTranscriptMutationStateSync } from "./session-accessor.sqlite-transcript-write-CM5480eZ.mjs";
import { d as loadTranscriptHeaderSync } from "./session-accessor.sqlite-read-DO8t28O6.mjs";
import { n as isTerminalSessionStatus } from "./types-ByCc34Vn.mjs";
import "./session-accessor-C05KQ5A3.mjs";
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
	const { readSessionProviderReview, compareSessionProviderReview } = await import("./provider-review-store-BFbhTtr8.mjs");
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
	const { readSessionProviderReview } = await import("./provider-review-store-BFbhTtr8.mjs");
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
	const { readSessionProviderReview } = await import("./provider-review-store-BFbhTtr8.mjs");
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
	const { compareSessionProviderReview } = await import("./provider-review-store-BFbhTtr8.mjs");
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
var SessionWorkStartInvalidatedError = class extends Error {
	constructor(message) {
		super(message);
		this.code = SESSION_WORK_START_INVALIDATED_ERROR_CODE;
		this.name = "SessionWorkStartInvalidatedError";
	}
};
var SessionWorkStartChangedError = class extends Error {
	constructor(message) {
		super(message);
		this.code = SESSION_WORK_START_CHANGED_ERROR_CODE;
		this.name = "SessionWorkStartChangedError";
	}
};
function createSessionWorkStartChangedError(sessionKey) {
	return new SessionWorkStartChangedError(`Session "${sessionKey}" changed while starting work. Retry.`);
}
function isSessionWorkStartInvalidatedError(error) {
	return error instanceof SessionWorkStartInvalidatedError || error instanceof SessionWorkStartChangedError || typeof error === "object" && error !== null && "code" in error && (error.code === "SESSION_WORK_START_INVALIDATED" || error.code === "SESSION_WORK_START_CHANGED");
}
var SessionRestartRecoveryTombstoneError = class extends Error {
	constructor(message) {
		super(message);
		this.code = SESSION_RESTART_RECOVERY_TOMBSTONE_ERROR_CODE;
		this.name = "SessionRestartRecoveryTombstoneError";
	}
};
/** Lifecycle-owned initializing, restart-tombstoned, and archived sessions reject new work. */
function resolveSessionWorkStartError(sessionKey, entry, options) {
	if (options?.expectedSessionId && !entry) return `Session "${sessionKey}" was deleted while starting work. Retry.`;
	if (options?.expectedSessionId && entry?.sessionId !== options.expectedSessionId) return `Session "${sessionKey}" changed while starting work. Retry.`;
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
function resolveTimestamp(value) {
	const timestampMs = asDateTimestampMs(value);
	return timestampMs !== void 0 && timestampMs >= 0 ? timestampMs : void 0;
}
function resolvePositiveTimestamp(value) {
	const timestampMs = resolveTimestamp(value);
	return timestampMs !== void 0 && timestampMs > 0 ? timestampMs : void 0;
}
function parseTimestampMs(value) {
	if (typeof value === "number") return resolveTimestamp(value);
	if (typeof value !== "string" || !value.trim()) return;
	return resolveTimestamp(Date.parse(value));
}
function readSessionHeaderStartedAtMs(params) {
	const sessionId = params.entry.sessionId?.trim();
	const sessionKey = params.sessionKey?.trim();
	const agentId = params.agentId ?? (sessionKey ? resolveAgentIdFromSessionKey(sessionKey) : void 0);
	if (!sessionId || !agentId) return;
	try {
		const header = params.readHeader ? params.readHeader(sessionId) : loadTranscriptHeaderSync({
			agentId,
			sessionId,
			...params.storePath ? { storePath: params.storePath } : {},
			...sessionKey ? { sessionKey } : {}
		});
		if (header?.type !== "session" || typeof header.id === "string" && header.id.trim() && header.id !== sessionId) return;
		return parseTimestampMs(header.timestamp);
	} catch {
		return;
	}
}
function resolveSessionLifecycleTimestamps(params) {
	const entry = params.entry;
	if (!entry) return {};
	return {
		sessionStartedAt: resolveTimestamp(entry.sessionStartedAt) ?? readSessionHeaderStartedAtMs({
			...params,
			entry
		}),
		lastInteractionAt: resolveTimestamp(entry.lastInteractionAt)
	};
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
export { issueProviderReviewAcknowledgment as _, createSessionWorkStartChangedError as a, retireProviderReviewAcknowledgment as b, isRestartRecoveryTombstone as c, resolveSessionWorkStartError as d, acceptProviderReviewAcknowledgment as f, createSessionProviderReview as g, claimProviderReviewAttempt as h, SessionWorkStartInvalidatedError as i, isSessionWorkStartInvalidatedError as l, canContinueSessionProviderReview as m, SessionRestartRecoveryTombstoneError as n, hasTerminalMainSessionTranscriptNewerThanRegistry as o, assertSessionProviderReviewWorkStart as p, SessionWorkStartChangedError as r, hasTerminalMainSessionTranscriptNewerThanRegistrySync as s, SESSION_LIFECYCLE_CHANGED_ERROR_REASON as t, resolveSessionLifecycleTimestamps as u, readProviderReviewAcknowledgment as v, recordSessionProviderReview as y };
