import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { t as classifyGatewayStorageFailure } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { n as renderUserFacingText } from "./user-facing-text-BNFEPbYx.mjs";
import { h as renderCodexAppServerFailureCopy } from "./user-copy-BAz4s3EV.mjs";
import { a as renderAssistantRequestFailureCopy, u as renderStorageFailureSummary } from "./assistant-request-failure-copy-csnSONXK.mjs";
import { n as appendSessionTranscriptReport } from "./session-accessor-Czw4l8kI.mjs";
import { y as withSessionTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { n as STATE_CONTENTION_SUMMARY } from "./session-run-error-presentation-TwKM9EqW.mjs";
//#region src/sessions/session-run-error.ts
const SESSION_RUN_ERROR_MAX_CHARS = 160;
const RUN_FAILED_BEFORE_REPLY_TRANSCRIPT_TYPE = "run-failed-before-reply";
function sanitizeSessionRunError(error) {
	const text = renderUserFacingText(error, { errorContext: true }).replace(/\s+/g, " ").trim();
	return redactSensitiveText(text, { mode: "tools" });
}
async function recordGatewaySessionRunFailure(params) {
	const { runId } = params;
	const storageFailure = classifyGatewayStorageFailure(params.error);
	const error = truncateUtf16Safe(sanitizeSessionRunError(params.error), 512) || "unknown error";
	const report = {
		customType: RUN_FAILED_BEFORE_REPLY_TRANSCRIPT_TYPE,
		content: params.errorKind === "state_contention" ? STATE_CONTENTION_SUMMARY : renderAssistantRequestFailureCopy({ storageFailure }) ?? renderCodexAppServerFailureCopy(error) ?? `Your request couldn't be completed: ${error}`,
		display: true,
		excludeFromContext: true,
		details: {
			runId,
			error,
			...params.errorKind ? { errorKind: params.errorKind } : {}
		}
	};
	const result = await withSessionTranscriptWriteAssertion(params.target, () => params.assertCommitAllowed?.(), () => appendSessionTranscriptReport(params.target, {
		kind: "custom",
		customTypes: [RUN_FAILED_BEFORE_REPLY_TRANSCRIPT_TYPE],
		selectReport: (latest) => {
			params.assertCommitAllowed?.();
			return isRecord(latest?.details) && latest.details.runId === runId ? void 0 : report;
		}
	}, { sessionEntryCurrent: params.sessionEntryCurrent }));
	if (!result.ok) throw new Error(`Failed run notice could not be appended: ${result.error.code}`);
}
function resolveSessionRunError(outcome, status) {
	if (status !== "failed" && status !== "timeout" || typeof outcome.error !== "string" || !outcome.error.trim()) return;
	if (outcome.errorKind === "state_contention") return STATE_CONTENTION_SUMMARY;
	const error = renderStorageFailureSummary(classifyGatewayStorageFailure(outcome.error)) ?? sanitizeSessionRunError(outcome.error);
	if (error.length <= SESSION_RUN_ERROR_MAX_CHARS) return error || void 0;
	return `${sliceUtf16Safe(error, 0, Math.floor(155 / 3)).trimEnd()} ... ${sliceUtf16Safe(error, -104).trimStart()}`;
}
//#endregion
export { resolveSessionRunError as n, recordGatewaySessionRunFailure as t };
