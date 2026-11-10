//#region packages/agent-core/src/errors.ts
const TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE = "openclaw_transcript_not_continuable";
const REPEATED_TOOL_ERROR_CODE = "openclaw_repeated_tool_error";
const REPEATED_TOOL_ERROR_MESSAGE = "OpenClaw stopped this turn after 3 consecutive identical tool failures. Check the tool arguments or switch to a model with native tool calling before retrying.";
var TranscriptNotContinuableError = class extends Error {
	constructor(role) {
		super(`Cannot continue from message role: ${role}`);
		this.code = TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE;
		this.name = "TranscriptNotContinuableError";
		this.role = role;
	}
};
//#endregion
export { TranscriptNotContinuableError as i, REPEATED_TOOL_ERROR_MESSAGE as n, TRANSCRIPT_NOT_CONTINUABLE_ERROR_CODE as r, REPEATED_TOOL_ERROR_CODE as t };
