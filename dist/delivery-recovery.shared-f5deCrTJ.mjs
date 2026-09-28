import { D as resolveExpiresAtMsFromDurationMs, E as resolveDateTimestampMs, M as resolveNonNegativeIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { i as extractErrorCode, n as collectErrorGraphCandidates } from "./error-coercion-C787aVxk.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { r as computeBackoffSchedule } from "./src-D4OikzaT.mjs";
import "./errors-DnjwnOju.mjs";
import { t as getRetryAttemptErrors } from "./retry-attempt-errors-BSlvmGqS.mjs";
import { c as isPlatformMessageNotDispatchedError, l as isPlatformMessageRejectedError, s as isOutboundDeliveryError } from "./deliver-types-Diy-VQKA.mjs";
//#region src/infra/delivery-recovery.shared.ts
const RECOVERY_BACKOFF_MS = [
	5e3,
	25e3,
	12e4,
	6e5
];
const RECOVERY_REPLAY_SPACING_MS = 250;
const PRE_CONNECT_ERROR_CODES = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ENOTFOUND",
	"EAI_AGAIN",
	"ENETDOWN",
	"ENETUNREACH",
	"EHOSTUNREACH"
]);
const TRANSPORT_ERROR_CODE_RE = /^(?:E(?:AI_|CONN|NET|HOST|ADDR|PIPE|TIMEDOUT|SOCKET)|UND_ERR_|ERR_(?:NETWORK|HTTP2|QUIC|TLS|SSL))/;
const UNPROVEN_ERROR_BRANCH = "unproven delivery error branch";
function createEmptyDeliveryRecoverySummary() {
	return {
		recovered: 0,
		failed: 0,
		skippedMaxRetries: 0,
		deferredBackoff: 0
	};
}
function resolveDeliveryRecoveryDeadlineMs(maxRecoveryMs) {
	const durationMs = resolveNonNegativeIntegerOption(maxRecoveryMs, 6e4);
	if (durationMs <= 0) return resolveDateTimestampMs(Date.now());
	return resolveExpiresAtMsFromDurationMs(durationMs) ?? resolveDateTimestampMs(Date.now());
}
function isDeliveryRecoveryRetryEligible(entry, now) {
	if (entry.availableAt && now < entry.availableAt) return {
		eligible: false,
		remainingBackoffMs: entry.availableAt - now
	};
	const backoff = computeBackoffMs(entry.retryCount);
	if (backoff <= 0 || entry.retryCount === 0 && entry.lastAttemptAt === void 0) return { eligible: true };
	const lastAttemptAt = entry.lastAttemptAt;
	const remainingBackoffMs = (typeof lastAttemptAt === "number" && Number.isFinite(lastAttemptAt) && lastAttemptAt > 0 ? lastAttemptAt : entry.enqueuedAt) + backoff - now;
	return remainingBackoffMs > 0 ? {
		eligible: false,
		remainingBackoffMs
	} : { eligible: true };
}
function preserveProofBranches(branches) {
	return branches?.map((branch) => branch ?? UNPROVEN_ERROR_BRANCH) ?? [];
}
function isProvenPreConnectCandidate(candidate) {
	const code = extractErrorCode(candidate)?.trim().toUpperCase();
	if (code === "UND_ERR_CONNECT_TIMEOUT" || code === "UND_ERR_DNS_RESOLVE_FAILED") return true;
	if (!code || !PRE_CONNECT_ERROR_CODES.has(code) || !candidate || typeof candidate !== "object") return false;
	const syscall = candidate.syscall;
	return syscall === "connect" || syscall === "getaddrinfo";
}
function nestedErrorCandidates(current) {
	const retryBranches = preserveProofBranches(getRetryAttemptErrors(current));
	if (isPlatformMessageNotDispatchedError(current) || isProvenPreConnectCandidate(current)) return retryBranches;
	const nestedObjects = [
		current.cause,
		current.original,
		current.error,
		current.reason
	].filter((candidate) => candidate !== null && typeof candidate === "object");
	const aggregateBranches = Array.isArray(current.errors) ? preserveProofBranches(current.errors) : [];
	return [
		...retryBranches,
		...aggregateBranches,
		...nestedObjects
	];
}
function isProvenDeliveryNotSentError(err) {
	let foundNotSentProof = false;
	for (const candidate of collectErrorGraphCandidates(err, nestedErrorCandidates)) {
		if (isOutboundDeliveryError(candidate) && candidate.sentBeforeError) return false;
		const code = extractErrorCode(candidate)?.trim().toUpperCase();
		if (isPlatformMessageNotDispatchedError(candidate) || isProvenPreConnectCandidate(candidate)) {
			foundNotSentProof = true;
			continue;
		}
		const nested = candidate && typeof candidate === "object" ? nestedErrorCandidates(candidate) : [];
		const isPreConnectAggregateSummary = candidate !== null && typeof candidate === "object" && Array.isArray(candidate.errors) && code !== void 0 && PRE_CONNECT_ERROR_CODES.has(code);
		if (nested.length === 0 || code && !isPreConnectAggregateSummary && (PRE_CONNECT_ERROR_CODES.has(code) || TRANSPORT_ERROR_CODE_RE.test(code))) return false;
	}
	return foundNotSentProof;
}
/** Finds a provider's permanent pre-dispatch rejection through delivery wrappers. */
function findPlatformMessageRejectedError(err) {
	for (const candidate of collectErrorGraphCandidates(err, nestedErrorCandidates)) if (isPlatformMessageRejectedError(candidate)) return candidate;
}
/**
* Returns the typed no-send marker's retry decision after proving the full error graph.
* Untyped pre-connect proof stays undefined so caller-specific text policy keeps precedence.
*/
function resolveDeliveryNotSentRetryability(err) {
	const candidates = collectErrorGraphCandidates(err, nestedErrorCandidates);
	if (!candidates.some(isPlatformMessageNotDispatchedError) || !isProvenDeliveryNotSentError(err) || hasDeliverySendEvidence(candidates)) return;
	return findPlatformMessageRejectedError(err) === void 0;
}
function hasDeliverySendEvidence(candidates) {
	return candidates.some((candidate) => isRecord(candidate) && (candidate.sentBeforeError === true || candidate.visibleReplySent === true || isRecord(candidate.deliveryResult) && candidate.deliveryResult.visibleReplySent === true));
}
/** True only when the complete error graph proves a retryable recipient no-send. */
function isRetryableDeliveryNotSentError(err) {
	return resolveDeliveryNotSentRetryability(err) ?? (isProvenDeliveryNotSentError(err) && !hasDeliverySendEvidence(collectErrorGraphCandidates(err, nestedErrorCandidates)));
}
/** True when the durable queue retained the exact failed attempt for recovery. */
function isDeliveryRecoveryOwnedRetry(err) {
	return collectErrorGraphCandidates(err, nestedErrorCandidates).some((candidate) => isOutboundDeliveryError(candidate) && candidate.queueCustody === "held");
}
function computeBackoffMs(retryCount) {
	return computeBackoffSchedule(RECOVERY_BACKOFF_MS, retryCount);
}
function getErrnoCode(err) {
	return err && typeof err === "object" && "code" in err ? String(err.code) : null;
}
function createRecoveryReplayPacer() {
	let lastReplayStartedAt = 0;
	let waitQueue = Promise.resolve();
	return { async wait(deadlineMs) {
		let releaseWaiter = () => {};
		const previousWaiter = waitQueue;
		waitQueue = new Promise((resolve) => {
			releaseWaiter = resolve;
		});
		await previousWaiter;
		try {
			const now = Date.now();
			if (deadlineMs !== void 0 && now >= deadlineMs) return "deadline-exceeded";
			const elapsedMs = now - lastReplayStartedAt;
			const waitMs = elapsedMs < 0 ? 0 : Math.max(0, RECOVERY_REPLAY_SPACING_MS - elapsedMs);
			if (waitMs > 0) {
				const remainingBudgetMs = deadlineMs === void 0 ? waitMs : Math.max(0, deadlineMs - now);
				await sleep(Math.min(waitMs, remainingBudgetMs));
			}
			if (deadlineMs !== void 0 && Date.now() >= deadlineMs) return "deadline-exceeded";
			lastReplayStartedAt = Date.now();
			return "ready";
		} finally {
			releaseWaiter();
		}
	} };
}
/** Own one queue namespace's live claims, drain exclusion, and replay pacing. */
function createDeliveryRecoveryCoordinator() {
	const activeDrains = /* @__PURE__ */ new Set();
	const activeEntries = /* @__PURE__ */ new Set();
	const replayPacer = createRecoveryReplayPacer();
	async function withClaim(entryId, run) {
		if (activeEntries.has(entryId)) return { status: "claimed-by-other-owner" };
		activeEntries.add(entryId);
		try {
			return {
				status: "claimed",
				value: await run()
			};
		} finally {
			activeEntries.delete(entryId);
		}
	}
	return {
		withClaim,
		async withDrain(drainKey, run) {
			if (activeDrains.has(drainKey)) return false;
			activeDrains.add(drainKey);
			try {
				await run();
				return true;
			} finally {
				activeDrains.delete(drainKey);
			}
		},
		async scan(options) {
			for (const entry of options.entries.toSorted((a, b) => a.enqueuedAt - b.enqueuedAt)) {
				if (options.deadlineMs !== void 0 && Date.now() >= options.deadlineMs) {
					options.onDeadlineExceeded?.();
					break;
				}
				const claim = await withClaim(entry.id, async () => {
					const current = await options.loadEntry(entry.id);
					if (!current) {
						options.onMissingEntry?.(entry);
						return "continue";
					}
					return await options.onEntry(current) ?? "continue";
				});
				if (claim.status === "claimed-by-other-owner") {
					options.onClaimConflict?.(entry);
					continue;
				}
				if (claim.value === "stop") break;
			}
		},
		waitForReplay(deadlineMs) {
			return replayPacer.wait(deadlineMs);
		}
	};
}
//#endregion
export { getErrnoCode as a, isProvenDeliveryNotSentError as c, resolveDeliveryRecoveryDeadlineMs as d, findPlatformMessageRejectedError as i, isRetryableDeliveryNotSentError as l, createDeliveryRecoveryCoordinator as n, isDeliveryRecoveryOwnedRetry as o, createEmptyDeliveryRecoverySummary as r, isDeliveryRecoveryRetryEligible as s, computeBackoffMs as t, resolveDeliveryNotSentRetryability as u };
