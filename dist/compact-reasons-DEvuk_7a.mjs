import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { g as extractErrorHttpStatus } from "./redact-BcXJu5HP.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { c as hasModelFallbackStop } from "./failover-error-Bjf0VdY2.mjs";
import { n as extractFailoverHttpStatus } from "./retry-evidence-BSh9bhDe.mjs";
import { o as isSummaryProviderError } from "./types-CPdr3cVV.mjs";
//#region src/agents/embedded-agent-runner/compact-reasons.ts
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
const COMPACTION_TEXT_REASONS = [
	["no_compactable_entries", ["nothing to compact", "no real conversation messages"]],
	["below_threshold", ["below threshold", "already under target"]],
	["already_compacted", ["already compacted", "already_compacted"]],
	["deferred_background", ["deferred to background"]],
	["live_context_still_exceeds_target", ["still exceeds target"]],
	[
		"transcript_persistence_failed",
		["session transcript", "not persisted"],
		"all"
	],
	["guard_blocked", ["guard"]],
	["summary_failed", ["summary"]],
	["timeout", ["timed out", "timeout"]]
];
const DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON = "deferred to background context-engine maintenance";
function buildCompactionFailureResult(reason, failure) {
	return {
		ok: false,
		compacted: false,
		reason,
		...failure ? { failure } : {}
	};
}
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
/**
* Only an actual summary timeout qualifies: the summary watchdog fired (the caller is still
* live, so its composed signal aborted on the deadline), or the provider answered 408/504.
* Failover's broader "timeout" class also covers fast 5xx, 410, and DNS failures, which keep
* their owners' outcomes.
*/
function isSummaryTimeoutFailure(params) {
	let providerFailure = resolveCompactionFailure(params).error;
	if (params.summarySignal?.aborted) return true;
	while (providerFailure instanceof Error && !isSummaryProviderError(providerFailure)) providerFailure = providerFailure.cause;
	const status = isSummaryProviderError(providerFailure) ? extractErrorHttpStatus(providerFailure.response.errorMessage?.trim() ?? "")?.code : void 0;
	return status === 408 || status === 504;
}
function classifyCompactionReason(reason) {
	const text = normalizeLowercaseStringOrEmpty(reason);
	if (!text) return "unknown";
	if (text.startsWith("no api key found") || text.startsWith("authentication failed for ") && text.includes("credentials may have expired")) return "auth_failed";
	for (const [classification, fragments, match] of COMPACTION_TEXT_REASONS) {
		const includes = (fragment) => text.includes(fragment);
		if (match === "all" ? fragments.every(includes) : fragments.some(includes)) return classification;
	}
	const status = extractFailoverHttpStatus(reason, { includeLabeledStatus: true });
	if (status !== void 0 && COMPACTION_PROVIDER_4XX.has(status)) return "provider_error_4xx";
	if (status !== void 0 && COMPACTION_PROVIDER_5XX.has(status)) return "provider_error_5xx";
	return "unknown";
}
function isBenignCompactionSkipReason(reason) {
	const classification = classifyCompactionReason(reason);
	return classification === "below_threshold" || classification === "already_compacted";
}
function isBenignCompactionSkipResult(result) {
	if (result.compacted) return false;
	return isBenignCompactionSkipReason(result.reason) || result.ok && classifyCompactionReason(result.reason) === "no_compactable_entries";
}
function formatUnknownCompactionReasonDetail(reason) {
	const sanitized = sanitizeForLog((reason ?? "").replace(/\s+/g, " ")).trim().replace(/[^A-Za-z0-9._:@/+~-]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");
	if (!sanitized) return;
	return sanitized.slice(0, MAX_COMPACTION_REASON_DETAIL_CHARS);
}
//#endregion
export { isBenignCompactionSkipReason as a, resolveCompactionFailure as c, formatUnknownCompactionReasonDetail as i, buildCompactionFailureResult as n, isBenignCompactionSkipResult as o, classifyCompactionReason as r, isSummaryTimeoutFailure as s, DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON as t };
