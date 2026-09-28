import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
//#region src/infra/exec-auto-review.ts
const EXEC_AUTO_REVIEW_DENIAL_GUIDANCE = "Do not attempt the same outcome through a workaround, indirect execution, or policy circumvention. Proceed only with a materially safer alternative, or ask the user to approve this exact command after explaining the risk.";
const EXEC_AUTO_REVIEW_SHELL_STARTUP_WARNING = "Exec auto-review skipped: login or interactive shell startup requires human approval";
const EXEC_AUTO_REVIEW_DISPATCH_IDENTITY_WARNING = "Exec auto-review skipped: dispatch chain cannot be bound";
function formatExecAutoReviewAssessment(decision) {
	return `risk=${decision.risk}${decision.userAuthorization ? `, authorization=${decision.userAuthorization}` : ""}`;
}
/** Keeps reviewer and provider explanations safe for human-facing approval text. */
function normalizeExecAutoReviewRationale(value, fallback) {
	const text = normalizeOptionalString(typeof value === "string" ? value : void 0);
	const sanitized = sanitizeTerminalText(text ?? fallback).replace(/[\p{Cf}\u2028\u2029]/gu, "").replace(/\s+/gu, " ").trim();
	return truncateUtf16Safe(sanitized || fallback, 500);
}
/** Turns reviewer and provider failures into a bounded, redacted human-review decision. */
function buildExecAutoReviewFailureDecision(prefix, error) {
	return {
		decision: "ask",
		risk: "unknown",
		rationale: normalizeExecAutoReviewRationale(`${prefix}: ${formatErrorMessage(error)}`, prefix)
	};
}
/** Reviewer failures become ask decisions; each approval owner applies its own policy. */
async function resolveExecAutoReviewDecision(reviewer, input) {
	try {
		return await reviewer(input);
	} catch (error) {
		return buildExecAutoReviewFailureDecision("exec reviewer failed", error);
	}
}
/**
* Conservative fallback used when no model-backed reviewer is available.
* Auto mode must never become a static allowlist; without a reviewer, defer to
* the normal human approval route.
*/
const defaultExecAutoReviewer = (input) => {
	return {
		decision: "ask",
		rationale: `no model-backed exec reviewer is configured for ${input.host}`,
		risk: input.analysis.inlineEval ? "medium" : "unknown"
	};
};
//#endregion
export { defaultExecAutoReviewer as a, resolveExecAutoReviewDecision as c, buildExecAutoReviewFailureDecision as i, EXEC_AUTO_REVIEW_DISPATCH_IDENTITY_WARNING as n, formatExecAutoReviewAssessment as o, EXEC_AUTO_REVIEW_SHELL_STARTUP_WARNING as r, normalizeExecAutoReviewRationale as s, EXEC_AUTO_REVIEW_DENIAL_GUIDANCE as t };
