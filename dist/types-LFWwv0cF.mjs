//#region packages/llm-core/src/types.ts
/** Stable error codes for provider outcomes that cannot be replayed safely. */
const PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE = "PROVIDER_POST_DISPATCH_AMBIGUITY";
const PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE = "PROVIDER_FAILURE_WITH_OUTPUT";
/** Pre-dispatch argument rejection; callers still enforce output and effect guards. */
const MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE = "malformed_tool_call_arguments";
//#endregion
export { PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE as n, PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE as r, MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE as t };
