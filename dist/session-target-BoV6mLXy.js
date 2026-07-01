import { _ as parseStrictFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { b as truncateUtf16Safe } from "./utils-BApvfmPs.js";
//#region src/cron/schedule-number.ts
/** Coerces cron schedule number fields with strict finite-number parsing. */
/** Coerces schedule numeric fields without accepting partial or non-finite numbers. */
function coerceFiniteScheduleNumber(value) {
	return parseStrictFiniteNumber(value);
}
//#endregion
//#region src/cron/service/normalize.ts
/** Name, agent id, and payload text normalization helpers for cron service ops. */
/** Normalizes a required cron job name and throws the public validation error when absent. */
function normalizeRequiredName(raw) {
	if (typeof raw !== "string") throw new Error("cron job name is required");
	const name = raw.trim();
	if (!name) throw new Error("cron job name is required");
	return name;
}
function truncateText(input, maxLen) {
	if (input.length <= maxLen) return input;
	return `${truncateUtf16Safe(input, Math.max(0, maxLen - 1)).trimEnd()}…`;
}
/** Infers a compact cron job name from payload text first, then schedule shape. */
function inferCronJobName(job) {
	const firstLine = (job?.payload?.kind === "systemEvent" && typeof job.payload.text === "string" ? job.payload.text : job?.payload?.kind === "agentTurn" && typeof job.payload.message === "string" ? job.payload.message : job?.payload?.kind === "command" && Array.isArray(job.payload.argv) ? job.payload.argv.join(" ") : "").split("\n").map((l) => l.trim()).find(Boolean) ?? "";
	if (firstLine) return truncateText(firstLine, 60);
	const kind = typeof job?.schedule?.kind === "string" ? job.schedule.kind : "";
	if (kind === "cron" && typeof job?.schedule?.expr === "string") return `Cron: ${truncateText(job.schedule.expr, 52)}`;
	if (kind === "every" && typeof job?.schedule?.everyMs === "number") return `Every: ${job.schedule.everyMs}ms`;
	if (kind === "at") return "One-shot";
	return "Cron job";
}
/** Extracts the executable text from cron payload variants for main-session queueing. */
function normalizePayloadToSystemText(payload) {
	if (payload.kind === "systemEvent") return typeof payload.text === "string" ? payload.text.trim() : "";
	return payload.kind === "agentTurn" && typeof payload.message === "string" ? payload.message.trim() : "";
}
//#endregion
//#region src/cron/session-target.ts
/** Resolves and validates session-target keys used by cron jobs and delivery. */
const INVALID_CRON_SESSION_TARGET_ID_ERROR = "invalid cron sessionTarget session id";
/** Returns whether an error came from cron session target id validation. */
function isInvalidCronSessionTargetIdError(error) {
	return error instanceof Error && error.message === INVALID_CRON_SESSION_TARGET_ID_ERROR;
}
/** Validates the opaque session id portion of a `session:` cron target. */
function assertSafeCronSessionTargetId(sessionId) {
	const trimmed = sessionId.trim();
	if (!trimmed) throw new Error(INVALID_CRON_SESSION_TARGET_ID_ERROR);
	if (trimmed.includes("\0")) throw new Error(INVALID_CRON_SESSION_TARGET_ID_ERROR);
	return trimmed;
}
/** Extracts the persistent session key from a `session:` cron target, if present. */
function resolveCronSessionTargetSessionKey(sessionTarget) {
	if (typeof sessionTarget !== "string" || !sessionTarget.startsWith("session:")) return;
	return assertSafeCronSessionTargetId(sessionTarget.slice(8));
}
/** Resolves `current` at creation time so scheduled jobs do not depend on future active UI state. */
function resolveCronCurrentSessionTarget(params) {
	if (params.sessionTarget !== "current") return params.sessionTarget ?? void 0;
	const sessionKey = params.sessionKey?.trim();
	return sessionKey ? `session:${assertSafeCronSessionTargetId(sessionKey)}` : "isolated";
}
/** Chooses the session key used for cron delivery, preferring explicit persistent targets. */
function resolveCronDeliverySessionKey(job) {
	const sessionTargetKey = resolveCronSessionTargetSessionKey(job.sessionTarget);
	if (sessionTargetKey) return sessionTargetKey;
	return typeof job.sessionKey === "string" && job.sessionKey.trim() ? job.sessionKey.trim() : void 0;
}
/** Returns the notification session key, falling back to a stable per-job failure session. */
function resolveCronNotificationSessionKey(params) {
	return typeof params.sessionKey === "string" && params.sessionKey.trim() ? params.sessionKey.trim() : `cron:${params.jobId}:failure`;
}
//#endregion
export { resolveCronNotificationSessionKey as a, normalizePayloadToSystemText as c, resolveCronDeliverySessionKey as i, normalizeRequiredName as l, isInvalidCronSessionTargetIdError as n, resolveCronSessionTargetSessionKey as o, resolveCronCurrentSessionTarget as r, inferCronJobName as s, assertSafeCronSessionTargetId as t, coerceFiniteScheduleNumber as u };
