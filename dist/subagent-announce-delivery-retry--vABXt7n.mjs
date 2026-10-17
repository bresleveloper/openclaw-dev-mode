import { m as clampTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { n as collectErrorGraphCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-BBJTTIuE.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { d as sleepWithAbort } from "./src-D1BHGNTj.mjs";
import { a as isFailoverError } from "./error-B1Zb0HrJ.mjs";
import { l as isPlatformMessageRejectedError } from "./deliver-types-Diy-VQKA.mjs";
import { u as resolveDeliveryNotSentRetryability } from "./delivery-recovery.shared-AM7vMnRv.mjs";
import { t as isSessionTranscriptTurnMismatchErrorMessage } from "./transcript-turn-error-BGF0yDeu.mjs";
import "./failover-error-BZ8WG_0i.mjs";
//#region src/agents/subagents/announce/subagent-announce-delivery-retry.ts
const DEFAULT_SUBAGENT_ANNOUNCE_TIMEOUT_MS = 12e4;
var SourceOwnerChangedError = class extends Error {
	constructor() {
		super("subagent source lifecycle changed before completion delivery");
		this.name = "SourceOwnerChangedError";
	}
};
function resolveSubagentAnnounceTimeoutMs(cfg) {
	const configured = cfg.agents?.defaults?.subagents?.announceTimeoutMs;
	return clampTimerTimeoutMs(configured) ?? DEFAULT_SUBAGENT_ANNOUNCE_TIMEOUT_MS;
}
function summarizeDeliveryError(error) {
	if (error instanceof Error) return error.message || "error";
	if (typeof error === "string") return error;
	if (error === void 0 || error === null) return "unknown error";
	try {
		return JSON.stringify(error);
	} catch {
		return "error";
	}
}
const TRANSIENT_ANNOUNCE_DELIVERY_ERROR_PATTERNS = [
	/\berrorcode=unavailable\b/i,
	/\bstatus\s*[:=]\s*"?unavailable\b/i,
	/\bUNAVAILABLE\b/,
	/no active .* listener/i,
	/gateway not connected/i,
	/gateway closed \(1006/i,
	/gateway timeout/i,
	/\b(econnreset|econnrefused|etimedout|enotfound|ehostunreach|network error)\b/i
];
const WRITER_CLAIM_REBOUND_ANNOUNCE_RE = /session writer claim changed before transcript persistence/i;
const PERMANENT_ANNOUNCE_DELIVERY_ERROR_PATTERNS = [
	/unsupported channel/i,
	/unknown channel/i,
	/chat not found/i,
	/user not found/i,
	/bot.*not.*member/i,
	/bot was blocked by the user/i,
	/forbidden: bot was kicked/i,
	/recipient is not a valid/i,
	/outbound not configured for channel/i,
	WRITER_CLAIM_REBOUND_ANNOUNCE_RE
];
function isWriterClaimReboundAnnounceError(error) {
	return Boolean(error && typeof error === "object" && error.name === "SessionTranscriptWriterClaimReboundError" || WRITER_CLAIM_REBOUND_ANNOUNCE_RE.test(summarizeDeliveryError(error)));
}
function hasAnnounceErrorMatch(error, matches) {
	return collectErrorGraphCandidates(error, (candidate) => [
		candidate.cause,
		candidate.error,
		candidate.reason
	]).some(matches);
}
function hasWriterClaimReboundAnnounceError(error) {
	return hasAnnounceErrorMatch(error, isWriterClaimReboundAnnounceError);
}
function isPermanentNonWriterAnnounceError(error) {
	return hasAnnounceErrorMatch(error, (candidate) => isPlatformMessageRejectedError(candidate) || isSessionTranscriptTurnMismatchErrorMessage(summarizeDeliveryError(candidate)) || !isWriterClaimReboundAnnounceError(candidate) && PERMANENT_ANNOUNCE_DELIVERY_ERROR_PATTERNS.some((pattern) => pattern.test(summarizeDeliveryError(candidate))));
}
function isTransientAnnounceDeliveryError(error) {
	if (hasAnnounceSendEvidence(error)) return false;
	const typedRetryability = resolveDeliveryNotSentRetryability(error);
	if (typedRetryability !== void 0) return typedRetryability;
	if (isPermanentNonWriterAnnounceError(error)) return false;
	if (hasWriterClaimReboundAnnounceError(error)) return true;
	return hasAnnounceErrorMatch(error, (candidate) => {
		if (isFailoverError(candidate) && (candidate.reason === "overloaded" || (candidate.attempts?.length ?? 0) > 0)) return true;
		const message = summarizeDeliveryError(candidate);
		if (candidate && typeof candidate === "object" && candidate.gatewayCode === "UNAVAILABLE" && /cron run continuation/i.test(message)) return true;
		return TRANSIENT_ANNOUNCE_DELIVERY_ERROR_PATTERNS.some((pattern) => pattern.test(message));
	});
}
function isPermanentAnnounceDeliveryError(error) {
	const typedRetryability = resolveDeliveryNotSentRetryability(error);
	if (typedRetryability !== void 0) return !typedRetryability;
	return isPermanentNonWriterAnnounceError(error) || hasWriterClaimReboundAnnounceError(error);
}
function isIncompleteAnnounceAgentResultError(error) {
	const message = summarizeDeliveryError(error);
	return /(?:incomplete terminal response|code=incomplete_result)\b/i.test(message);
}
function hasAnnounceSendEvidence(error) {
	return hasAnnounceErrorMatch(error, (candidate) => {
		const record = asOptionalObjectRecord(candidate);
		return record?.sentBeforeError === true || record?.visibleReplySent === true;
	});
}
async function waitForAnnounceRetryDelay(ms, signal) {
	try {
		await sleepWithAbort(ms, signal);
	} catch (error) {
		if (!signal?.aborted) throw error;
	}
}
async function runAnnounceDeliveryWithRetry(params) {
	const retryDelaysMs = isFastTestRuntimeEnv() ? [
		8,
		16,
		32
	] : [
		5e3,
		1e4,
		2e4
	];
	for (const [retryIndex, delayMs] of retryDelaysMs.entries()) {
		if (params.prepareAttempt && !await params.prepareAttempt()) throw new SourceOwnerChangedError();
		if (params.isAttemptAllowed?.() === false) throw new SourceOwnerChangedError();
		if (params.signal?.aborted) throw new Error("announce delivery aborted");
		try {
			return await params.run();
		} catch (err) {
			if (!isTransientAnnounceDeliveryError(err) || params.signal?.aborted) throw err;
			if (params.isAttemptAllowed?.() === false) throw new SourceOwnerChangedError();
			const nextAttempt = retryIndex + 2;
			const maxAttempts = retryDelaysMs.length + 1;
			defaultRuntime.log(`[warn] Subagent announce ${params.operation} transient failure, retrying ${nextAttempt}/${maxAttempts} in ${Math.round(delayMs / 1e3)}s: ${summarizeDeliveryError(err)}`);
			await waitForAnnounceRetryDelay(delayMs, params.signal);
		}
	}
	if (params.prepareAttempt && !await params.prepareAttempt()) throw new SourceOwnerChangedError();
	if (params.signal?.aborted) throw new Error("announce delivery aborted");
	if (params.isAttemptAllowed?.() === false) throw new SourceOwnerChangedError();
	return await params.run();
}
//#endregion
export { resolveSubagentAnnounceTimeoutMs as a, waitForAnnounceRetryDelay as c, isPermanentAnnounceDeliveryError as i, hasAnnounceSendEvidence as n, runAnnounceDeliveryWithRetry as o, isIncompleteAnnounceAgentResultError as r, summarizeDeliveryError as s, SourceOwnerChangedError as t };
