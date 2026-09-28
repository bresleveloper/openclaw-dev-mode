import { i as extractErrorCode, r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { n as computeBackoff } from "./src-D4OikzaT.mjs";
import "./backoff-CszdOMiF.mjs";
import "./work-start-error-unYqNOPf.mjs";
import fs from "node:fs";
import childProcess from "node:child_process";
import { randomUUID } from "node:crypto";
//#region src/channels/message/ingress-claim-owner.ts
/**
* Process-liveness identity for durable channel-ingress claims.
*
* ownerId = pid:startToken:uuid. Starttime binds the PID to one process instance so
* Linux TIDs and recycled PIDs cannot impersonate a dead claim owner.
*/
const INGRESS_CLAIM_LEASE_MS = 18e5;
function readProcessStartTime(pid) {
	if (!Number.isSafeInteger(pid) || pid <= 0) return null;
	if (process.platform === "darwin") try {
		const startedAt = childProcess.execFileSync("/bin/ps", [
			"-o",
			"lstart=",
			"-p",
			String(pid)
		], {
			encoding: "utf8",
			env: {
				...process.env,
				LC_ALL: "C",
				TZ: "UTC"
			},
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			],
			timeout: 2e3,
			killSignal: "SIGKILL"
		}).trim();
		const startedAtMs = Date.parse(`${startedAt} UTC`);
		return Number.isFinite(startedAtMs) ? Math.floor(startedAtMs / 1e3) : null;
	} catch {
		return null;
	}
	if (process.platform !== "linux") return null;
	try {
		const stat = fs.readFileSync(`/proc/${pid}/stat`, "utf8");
		const commEndIndex = stat.lastIndexOf(")");
		if (commEndIndex < 0) return null;
		const fields = stat.slice(commEndIndex + 1).trimStart().split(/\s+/);
		const starttime = Number(fields[19]);
		return Number.isInteger(starttime) && starttime >= 0 ? starttime : null;
	} catch {
		return null;
	}
}
const INGRESS_CLAIM_PROCESS_START_TIME = readProcessStartTime(process.pid);
const INGRESS_CLAIM_PROCESS_ID = [
	process.pid,
	INGRESS_CLAIM_PROCESS_START_TIME ?? "x",
	randomUUID()
].join(":");
/** Process-local live drain instance UUIDs (ownerId third field). */
const liveIngressDrainInstanceIds = /* @__PURE__ */ new Set();
function processPidFromOwnerId(ownerId) {
	const pid = Number.parseInt(ownerId.split(":", 1)[0] ?? "", 10);
	return Number.isSafeInteger(pid) && pid > 0 ? pid : -1;
}
/** Instance UUID from ownerId `pid:startToken:uuid`. */
function processInstanceIdFromOwnerId(ownerId) {
	const parts = ownerId.split(":");
	if (parts.length < 3) return null;
	const instanceId = parts[2];
	return instanceId && instanceId.length > 0 ? instanceId : null;
}
/** Mint a unique per-drain ownerId (`pid:startToken:uuid`). Caller registers via drain. */
function createIngressDrainOwnerId() {
	return [
		process.pid,
		INGRESS_CLAIM_PROCESS_START_TIME ?? "x",
		randomUUID()
	].join(":");
}
function registerLiveIngressDrainInstance(ownerId) {
	const instanceId = processInstanceIdFromOwnerId(ownerId);
	if (instanceId) liveIngressDrainInstanceIds.add(instanceId);
}
function deregisterLiveIngressDrainInstance(ownerId) {
	const instanceId = processInstanceIdFromOwnerId(ownerId);
	if (instanceId) liveIngressDrainInstanceIds.delete(instanceId);
}
/**
* True when a same-process drain instance still holds this ownerId.
* Recovery must not steal claims from a live peer drain on the same queue.
*/
function isLiveLocalIngressDrainOwner(ownerId) {
	const instanceId = processInstanceIdFromOwnerId(ownerId);
	return instanceId != null && liveIngressDrainInstanceIds.has(instanceId);
}
function parseOwnerStartToken(ownerId) {
	const parts = ownerId.split(":");
	if (parts.length === 2) return { kind: "existence-only" };
	if (parts.length < 2) return { kind: "missing" };
	const startField = parts[1] ?? "";
	if (startField === "x") return { kind: "existence-only" };
	const starttime = Number(startField);
	if (Number.isSafeInteger(starttime) && starttime >= 0) return {
		kind: "numeric",
		value: starttime
	};
	return { kind: "missing" };
}
function processExists(pid) {
	if (!Number.isSafeInteger(pid) || pid <= 0) return false;
	try {
		process.kill(pid, 0);
		return true;
	} catch (err) {
		const code = err.code;
		return code !== "ESRCH" && code !== "EINVAL";
	}
}
function isFreshClaimOwner(claim, options) {
	const now = options?.now ?? Date.now();
	const maxAgeMs = options?.maxAgeMs ?? 18e5;
	return now - claim.claimedAt < maxAgeMs;
}
function isClaimOwnerProcessInstanceLive(claim, options) {
	const exists = options?.processExists ?? processExists;
	const readStart = options?.readProcessStartTime ?? readProcessStartTime;
	if (!exists(claim.processPid)) return false;
	const startToken = parseOwnerStartToken(claim.processId);
	if (startToken.kind === "missing") return false;
	if (startToken.kind === "existence-only") return true;
	const actualStart = readStart(claim.processPid);
	if (actualStart === null) return true;
	return actualStart === startToken.value;
}
function toOwnerIdentity(claim) {
	return {
		processId: claim.ownerId,
		processPid: processPidFromOwnerId(claim.ownerId),
		claimedAt: claim.claimedAt
	};
}
function resolveOwnerIdentity(claim) {
	const raw = claim.claim;
	if (!raw) return null;
	if ("ownerId" in raw) return toOwnerIdentity(raw);
	return {
		processId: raw.processId,
		processPid: raw.processPid,
		claimedAt: raw.claimedAt
	};
}
/** True when another live process still holds a fresh claim on this event. */
function isIngressClaimOwnedByOtherLiveProcess(claim, options) {
	const owner = resolveOwnerIdentity(claim);
	if (!owner) return false;
	return owner.processId !== INGRESS_CLAIM_PROCESS_ID && owner.processPid !== process.pid && isFreshClaimOwner(owner, options) && isClaimOwnerProcessInstanceLive(owner, options);
}
/** True when a corrupt claimed row is still live-owned by this or another process. */
function isIngressCorruptClaimOwnedByOtherLiveProcess(claim, options) {
	const owner = toOwnerIdentity(claim.claim);
	if (owner.processId === INGRESS_CLAIM_PROCESS_ID) return isFreshClaimOwner(owner, options);
	return owner.processPid !== process.pid && isFreshClaimOwner(owner, options) && isClaimOwnerProcessInstanceLive(owner, options);
}
//#endregion
//#region src/channels/message/ingress-retry-policy.ts
/**
* Generic ingress retry backoff and dead-letter decisions.
*
* Channel-specific non-retryable classification stays out of core; pass it in.
*/
const DEFAULT_INGRESS_RETRY_MAX_ATTEMPTS = 8;
const DEFAULT_INGRESS_RETRY_DEAD_LETTER_MIN_AGE_MS = 864e5;
const DEFAULT_INGRESS_RETRY_BASE_MS = 1e3;
const DEFAULT_INGRESS_RETRY_MAX_MS = 18e4;
function resolveConfig(config) {
	return {
		maxAttempts: config?.maxAttempts ?? 8,
		deadLetterMinAgeMs: config?.deadLetterMinAgeMs ?? 864e5,
		baseMs: config?.baseMs ?? 1e3,
		maxMs: config?.maxMs ?? 18e4
	};
}
/** Next attempt number after a failed dispatch (1-based for the attempt just finished). */
function resolveIngressAttemptNumber(event) {
	return (event.attempts ?? 0) + 1;
}
/** Remaining backoff delay before a released event may be claimed again. */
function resolveIngressRetryDelayMs(event, config, now = Date.now()) {
	const { baseMs, maxMs } = resolveConfig(config);
	const attempts = event.attempts ?? 0;
	if (!event.lastError || event.lastAttemptAt === void 0 || attempts <= 0) return 0;
	const delayMs = computeBackoff({
		initialMs: baseMs,
		maxMs,
		factor: 2,
		jitter: 0
	}, Math.min(attempts, 9));
	return Math.max(0, event.lastAttemptAt + delayMs - now);
}
/**
* Dead-letter requires BOTH attempt floor and minimum age.
* Over-limit events keep retrying at the capped delay until age is met.
*/
function shouldDeadLetterRetryableIngressEvent(event, attempt, config, now = Date.now()) {
	const { maxAttempts, deadLetterMinAgeMs } = resolveConfig(config);
	return attempt >= maxAttempts && now - event.receivedAt >= deadLetterMinAgeMs;
}
/** Resolve release vs fail for a dispatch error using optional non-retryable hook. */
function resolveIngressFailureDisposition(params) {
	const now = params.now ?? Date.now();
	const { maxAttempts } = resolveConfig(params.config);
	const attempt = resolveIngressAttemptNumber(params.event);
	const message = params.formatError(params.err);
	const nonRetryable = params.resolveNonRetryableFailure?.(params.err) ?? null;
	if (nonRetryable) return {
		kind: "fail",
		reason: nonRetryable.reason,
		message: nonRetryable.message,
		attempt
	};
	const errorCodes = new Set(collectNestedErrorCandidates(params.err).map(extractErrorCode));
	if (errorCodes.has("SESSION_RESTART_RECOVERY_TOMBSTONE")) return {
		kind: "fail",
		reason: "restart-recovery-tombstone",
		message,
		attempt
	};
	if (attempt >= maxAttempts && errorCodes.has("SESSION_WORK_START_CHANGED")) return {
		kind: "fail",
		reason: "session-start-conflict-retry-limit",
		message,
		attempt
	};
	if (shouldDeadLetterRetryableIngressEvent(params.event, attempt, params.config, now)) return {
		kind: "fail",
		reason: "retry-limit-exceeded",
		message,
		attempt
	};
	return {
		kind: "release",
		attempt,
		message
	};
}
//#endregion
export { resolveIngressFailureDisposition as a, INGRESS_CLAIM_PROCESS_ID as c, isIngressClaimOwnedByOtherLiveProcess as d, isIngressCorruptClaimOwnedByOtherLiveProcess as f, registerLiveIngressDrainInstance as h, DEFAULT_INGRESS_RETRY_MAX_MS as i, createIngressDrainOwnerId as l, processPidFromOwnerId as m, DEFAULT_INGRESS_RETRY_DEAD_LETTER_MIN_AGE_MS as n, resolveIngressRetryDelayMs as o, isLiveLocalIngressDrainOwner as p, DEFAULT_INGRESS_RETRY_MAX_ATTEMPTS as r, INGRESS_CLAIM_LEASE_MS as s, DEFAULT_INGRESS_RETRY_BASE_MS as t, deregisterLiveIngressDrainInstance as u };
