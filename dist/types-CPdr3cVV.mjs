//#region packages/agent-core/src/harness/types.ts
var CompactionError = class extends Error {
	constructor(code, message, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "CompactionError";
		this.code = code;
	}
};
/** Internal typed signal for a completed summary response with no usable text. */
var InvalidSummaryOutputError = class extends CompactionError {
	constructor(message) {
		super("summarization_failed", message);
	}
};
/** The provider failed the summary request; hosts classify the failed response, not this text. */
var SummaryProviderError = class extends CompactionError {
	constructor(message, response) {
		super("summarization_failed", message);
		this.response = response;
		this.name = "SummaryProviderError";
	}
};
/** Recognizes the error by name: duplicated module copies break `instanceof`. */
function isSummaryProviderError(error) {
	return error instanceof Error && error.name === "SummaryProviderError" && "response" in error;
}
/**
* The summary request cannot fit its budget: a length stop with no visible
* summary, or a summarizer window too small for the request. Either result is
* deterministic for an unchanged request, so callers do not retry it.
*/
var SummaryOutputBudgetError = class extends CompactionError {
	constructor(message) {
		super("summarization_failed", message);
	}
};
var BranchSummaryError = class extends Error {
	constructor(code, message, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "BranchSummaryError";
		this.code = code;
	}
};
//#endregion
export { SummaryProviderError as a, SummaryOutputBudgetError as i, CompactionError as n, isSummaryProviderError as o, InvalidSummaryOutputError as r, BranchSummaryError as t };
