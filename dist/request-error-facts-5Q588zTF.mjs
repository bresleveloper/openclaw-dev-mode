import { g as extractErrorHttpStatus, x as formatTransportErrorCopy } from "./redact-BcXJu5HP.mjs";
import { E as classifyProviderRequestFacets, T as resolveProviderRequestFailureCopy } from "./user-copy-BAz4s3EV.mjs";
import { o as renderFormatErrorCopy } from "./assistant-request-failure-copy-csnSONXK.mjs";
import { t as classifyFailoverReason } from "./classify-PIr_bdgF.mjs";
import { i as describeFailoverError } from "./failover-error-Bjf0VdY2.mjs";
//#region src/agents/failover/request-error-facts.ts
function resolveReplyFailoverFacts(error, message) {
	const described = describeFailoverError(error);
	const rawError = described.rawError ?? message;
	const status = extractErrorHttpStatus(rawError)?.code ?? described.status;
	const reason = described.reason ?? classifyFailoverReason(rawError, { provider: described.provider });
	const transportCopy = reason === "timeout" && (status === void 0 || status === 408) ? formatTransportErrorCopy([rawError, described.code].filter(Boolean).join(" ")) : void 0;
	const classification = reason ? {
		kind: "reason",
		reason
	} : null;
	return {
		reason: reason || void 0,
		code: described.code,
		provider: described.provider,
		model: described.model,
		status,
		authMode: described.authMode,
		requestFailureText: reason === "format" ? renderFormatErrorCopy(rawError) : transportCopy ? `⚠️ ${transportCopy} Check the conversation for any completed work before trying again.` : void 0,
		providerRequestError: resolveProviderRequestFailureCopy({
			classification,
			facet: classifyProviderRequestFacets({
				status,
				message: rawError
			}),
			status,
			technicalMessage: message
		})
	};
}
//#endregion
export { resolveReplyFailoverFacts as t };
