import { o as readAssistantThinkingAppend } from "../event-stream-D8PARQfL.mjs";
import { _ as isImageWithMediaPayload, a as FAILED_ASSISTANT_REPLAY_TEXT, c as isReasoningOnlyLengthAssistantTurn, d as describeToolResultMediaPlaceholder, f as describeUnsupportedToolResultMedia, g as hasMediaPayload, h as formatToolResultText, i as transformMessages, l as isStreamErrorFallbackContent, m as extractToolResultText, o as STREAM_ERROR_FALLBACK_TEXT, p as extractToolResultBlockText, s as hasOnlyAssistantReasoningContent, u as resolveFailedAssistantReplay, v as sanitizeSurrogates } from "../host-yTvBrYM2.mjs";
import { n as projectProviderError, r as createDiagnosticRecord } from "../provider-error-CRhW7lkJ.mjs";
import { _ as normalizeStructuredPromptSection, c as SYSTEM_PROMPT_RELOCATABLE_BOUNDARY, d as prependSystemPromptAdditionAfterCacheBoundary, f as splitSystemPromptCacheBoundary, g as normalizePromptCapabilityIds, h as stripSystemPromptRelocatableBoundary, i as clampReasoning, l as SYSTEM_PROMPT_RELOCATABLE_BOUNDARY_END, m as stripSystemPromptCacheBoundary, n as buildBaseOptions, p as splitSystemPromptRelocatableBoundary, r as clampMaxTokensToModel, s as SYSTEM_PROMPT_CACHE_BOUNDARY, t as adjustMaxTokensForThinking, u as ensureSystemPromptCacheBoundary, v as sortPromptCacheToolsByName } from "../simple-options-np1XPuhm.mjs";
import { t as projectCopilotRequestFacts } from "../github-copilot-request-facts-BTEBMeOv.mjs";
//#region packages/ai/src/utils/tls-certificate-errors.ts
const HOSTNAME_MISMATCH_CODES = /* @__PURE__ */ new Set(["ERR_TLS_CERT_ALTNAME_INVALID", "HOSTNAME_MISMATCH"]);
const CERTIFICATE_INVALID_CODES = /* @__PURE__ */ new Set([
	"CERT_CHAIN_TOO_LONG",
	"CERT_HAS_EXPIRED",
	"CERT_NOT_YET_VALID",
	"CERT_REJECTED",
	"CERT_REVOKED",
	"CERT_SIGNATURE_FAILURE",
	"CERT_UNTRUSTED",
	"CRL_HAS_EXPIRED",
	"CRL_NOT_YET_VALID",
	"CRL_SIGNATURE_FAILURE",
	"DEPTH_ZERO_SELF_SIGNED_CERT",
	"ERROR_IN_CERT_NOT_AFTER_FIELD",
	"ERROR_IN_CERT_NOT_BEFORE_FIELD",
	"ERROR_IN_CRL_LAST_UPDATE_FIELD",
	"ERROR_IN_CRL_NEXT_UPDATE_FIELD",
	"INVALID_CA",
	"INVALID_PURPOSE",
	"PATH_LENGTH_EXCEEDED",
	"SELF_SIGNED_CERT_IN_CHAIN",
	"UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY",
	"UNABLE_TO_DECRYPT_CERT_SIGNATURE",
	"UNABLE_TO_DECRYPT_CRL_SIGNATURE",
	"UNABLE_TO_GET_CRL",
	"UNABLE_TO_GET_ISSUER_CERT",
	"UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
	"UNABLE_TO_VERIFY_LEAF_SIGNATURE"
]);
const HOSTNAME_MISMATCH_PATTERNS = [
	/hostname\/ip does not match certificate(?:'s)? altnames/i,
	/hostname mismatch/i,
	/host: .+ is not in the cert(?:ificate)?(?:'s)? altnames/i
];
const CERTIFICATE_INVALID_PATTERNS = [
	/certificate has expired/i,
	/certificate is not yet valid/i,
	/self[- ]signed certificate/i,
	/unable to get local issuer certificate/i,
	/unable to verify the first certificate/i
];
const MAX_TLS_ERROR_DEPTH = 8;
function classifyCode(code) {
	if (HOSTNAME_MISMATCH_CODES.has(code)) return "hostname_mismatch";
	return CERTIFICATE_INVALID_CODES.has(code) ? "certificate_invalid" : null;
}
function classifyMessage(message) {
	if (HOSTNAME_MISMATCH_PATTERNS.some((pattern) => pattern.test(message))) return "hostname_mismatch";
	return CERTIFICATE_INVALID_PATTERNS.some((pattern) => pattern.test(message)) ? "certificate_invalid" : null;
}
function inspectTlsCertificateErrorInternal(error, seen, depth) {
	if (depth > MAX_TLS_ERROR_DEPTH) return null;
	if (typeof error === "string") {
		const kind = classifyMessage(error);
		return kind ? {
			kind,
			message: error
		} : null;
	}
	if (!error || typeof error !== "object" || seen.has(error)) return null;
	seen.add(error);
	const candidate = error;
	const code = typeof candidate.code === "string" ? candidate.code.trim().toUpperCase() : void 0;
	const message = typeof candidate.message === "string" && candidate.message.trim() ? candidate.message : void 0;
	const codeKind = code ? classifyCode(code) : null;
	if (code && codeKind) return {
		kind: codeKind,
		code,
		message: message ?? code
	};
	const nestedErrors = Array.isArray(candidate.errors) ? candidate.errors : [];
	for (const nested of [
		candidate.cause,
		candidate.error,
		...nestedErrors
	]) {
		if (nested === void 0 || nested === error) continue;
		const details = inspectTlsCertificateErrorInternal(nested, seen, depth + 1);
		if (details) return details;
	}
	const messageKind = message ? classifyMessage(message) : null;
	return messageKind && message ? {
		kind: messageKind,
		message
	} : null;
}
/** Classify deterministic Node/OpenSSL certificate validation failures. */
function inspectTlsCertificateError(error) {
	return inspectTlsCertificateErrorInternal(error, /* @__PURE__ */ new Set(), 0);
}
//#endregion
export { FAILED_ASSISTANT_REPLAY_TEXT, STREAM_ERROR_FALLBACK_TEXT, SYSTEM_PROMPT_CACHE_BOUNDARY, SYSTEM_PROMPT_RELOCATABLE_BOUNDARY, SYSTEM_PROMPT_RELOCATABLE_BOUNDARY_END, adjustMaxTokensForThinking, buildBaseOptions, clampMaxTokensToModel, clampReasoning, createDiagnosticRecord, describeToolResultMediaPlaceholder, describeUnsupportedToolResultMedia, ensureSystemPromptCacheBoundary, extractToolResultBlockText, extractToolResultText, formatToolResultText, hasMediaPayload, hasOnlyAssistantReasoningContent, inspectTlsCertificateError, isImageWithMediaPayload, isReasoningOnlyLengthAssistantTurn, isStreamErrorFallbackContent, normalizePromptCapabilityIds, normalizeStructuredPromptSection, prependSystemPromptAdditionAfterCacheBoundary, projectCopilotRequestFacts, projectProviderError, readAssistantThinkingAppend, resolveFailedAssistantReplay, sanitizeSurrogates, sortPromptCacheToolsByName, splitSystemPromptCacheBoundary, splitSystemPromptRelocatableBoundary, stripSystemPromptCacheBoundary, stripSystemPromptRelocatableBoundary, transformMessages };
