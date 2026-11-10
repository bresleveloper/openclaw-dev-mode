import { redactProviderResponseErrorText } from "openclaw/plugin-sdk/provider-http";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/comfy/workflow-history.ts
function isTerminalComfyHistory(entry, headers) {
	if (entry.status?.status_str === "error") {
		const messages = entry.status.messages;
		const executionError = Array.isArray(messages) ? messages.findLast((message) => Array.isArray(message) && message[0] === "execution_error") : void 0;
		const detail = Array.isArray(executionError) && isRecord(executionError[1]) ? normalizeOptionalString(executionError[1].exception_message) : void 0;
		throw new Error(`Comfy workflow failed${detail ? `: ${redactProviderResponseErrorText(detail, headers)}` : ""}`);
	}
	return entry.status?.completed === true || Boolean(entry.outputs && Object.keys(entry.outputs).length);
}
//#endregion
export { isTerminalComfyHistory };
