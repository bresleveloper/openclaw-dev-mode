import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { s as hasModelFallbackStop } from "./failover-error-BwAkMLuL.mjs";
import { n as extractFailoverHttpStatus } from "./retry-evidence-eo_i1jCP.mjs";
//#region src/agents/embedded-agent-runner/compact-reasons.ts
/**
* Normalizes and classifies compaction failure reasons for diagnostics.
*/
const MAX_COMPACTION_REASON_DETAIL_CHARS = 100;
const COMPACTION_PROVIDER_4XX = /* @__PURE__ */ new Set([
	400,
	401,
	403,
	429
]);
const COMPACTION_PROVIDER_5XX = /* @__PURE__ */ new Set([
	500,
	502,
	503,
	504
]);
const DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON = "deferred to background context-engine maintenance";
function isGenericCompactionCancelledReason(reason) {
	const normalized = normalizeLowercaseStringOrEmpty(reason);
	return normalized === "compaction cancelled" || normalized === "error: compaction cancelled";
}
/** Preserve terminal failures; otherwise project display text and failure provenance together. */
function resolveCompactionFailure(params) {
	if (hasModelFallbackStop(params.error)) throw params.error;
	const reason = formatErrorMessage(params.error);
	const cancellation = !params.abortSignal?.aborted && params.error instanceof Error && params.error.name === "Error" && isGenericCompactionCancelledReason(reason) ? params.safeguardCancellation : void 0;
	return {
		reason: cancellation?.reason ?? reason,
		error: cancellation?.error ?? params.error
	};
}
/** Bucket a raw compaction reason into stable telemetry/status classes. */
function classifyCompactionReason(reason) {
	const text = normalizeLowercaseStringOrEmpty(reason);
	if (!text) return "unknown";
	if (text.startsWith("no api key found") || text.startsWith("authentication failed for ") && text.includes("credentials may have expired")) return "auth_failed";
	if (text.includes("nothing to compact") || text.includes("no real conversation messages")) return "no_compactable_entries";
	if (text.includes("below threshold") || text.includes("already under target")) return "below_threshold";
	if (text.includes("already compacted") || text.includes("already_compacted")) return "already_compacted";
	if (text.includes("deferred to background")) return "deferred_background";
	if (text.includes("still exceeds target")) return "live_context_still_exceeds_target";
	if (text.includes("session transcript") && text.includes("not persisted")) return "transcript_persistence_failed";
	if (text.includes("guard")) return "guard_blocked";
	if (text.includes("summary")) return "summary_failed";
	if (text.includes("timed out") || text.includes("timeout")) return "timeout";
	const status = extractFailoverHttpStatus(reason, { includeLabeledStatus: true });
	if (status !== void 0 && COMPACTION_PROVIDER_4XX.has(status)) return "provider_error_4xx";
	if (status !== void 0 && COMPACTION_PROVIDER_5XX.has(status)) return "provider_error_5xx";
	return "unknown";
}
/** Return whether a classified reason represents an intentional compaction no-op. */
function isBenignCompactionSkipReason(reason) {
	const classification = classifyCompactionReason(reason);
	return classification === "below_threshold" || classification === "already_compacted";
}
/** Return whether a compaction result is an intentional no-op rather than a failure. */
function isBenignCompactionSkipResult(result) {
	if (result.compacted) return false;
	return isBenignCompactionSkipReason(result.reason) || result.ok && classifyCompactionReason(result.reason) === "no_compactable_entries";
}
/** Sanitize an unknown reason into a short log/metric-safe detail suffix. */
function formatUnknownCompactionReasonDetail(reason) {
	const sanitized = sanitizeForLog((reason ?? "").replace(/\s+/g, " ")).trim().replace(/[^A-Za-z0-9._:@/+~-]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");
	if (!sanitized) return;
	return sanitized.slice(0, MAX_COMPACTION_REASON_DETAIL_CHARS);
}
//#endregion
export { isBenignCompactionSkipResult as a, isBenignCompactionSkipReason as i, classifyCompactionReason as n, resolveCompactionFailure as o, formatUnknownCompactionReasonDetail as r, DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON as t };
