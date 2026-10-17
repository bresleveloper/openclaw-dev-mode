import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { r as inferToolMetaFromArgsCore } from "./tool-display-B85JC1BH.mjs";
import { d as sanitizeToolResult, u as sanitizeToolArgs } from "./embedded-agent-tool-results-C0yTOgai.mjs";
import { c as truncateNativeToolTranscriptText } from "./projection-tool-output-CKQ4iWL2.mjs";
import "./agent-harness-runtime-C7pYQoeO.mjs";
import "./agent-harness-attempt-runtime-CuLbs8yz.mjs";
//#region extensions/agentsapi/agentsapi-native-items.ts
function agentsApiNativeTool(item, params) {
	let name;
	let args;
	if (item.type === "command_execution") {
		name = "bash";
		args = {
			...item.command !== void 0 ? { command: item.command } : {},
			...typeof item.cwd === "string" ? { cwd: item.cwd } : {}
		};
	} else if (item.type === "mcp_call") {
		name = item.server_label ? `${item.server_label}.${item.name ?? "mcp"}` : item.name ?? "mcp";
		args = asOptionalRecord(item.arguments) ?? (item.arguments === void 0 ? {} : { arguments: item.arguments });
	} else if (item.type === "web_search_call") {
		name = "web_search";
		args = item.action ? { ...item.action } : {};
	} else return;
	args = asOptionalRecord(sanitizeToolArgs(args)) ?? {};
	const meta = inferToolMetaFromArgsCore(name, args, { detailMode: params.toolProgressDetail === "raw" ? "raw" : "explain" });
	return {
		name,
		args,
		...meta ? { meta } : {},
		commandBearing: item.type === "command_execution"
	};
}
function agentsApiNativeToolOutcome(item, enclosingStatus) {
	const nativeError = item.error === null || item.error === void 0 ? void 0 : item.error;
	const errorRecord = asOptionalRecord(nativeError);
	const errorCode = typeof errorRecord?.code === "string" ? errorRecord.code : void 0;
	const errorText = nativeError === void 0 ? void 0 : nativeValueText(nativeError);
	const failedCommand = item.type === "command_execution" && typeof item.exit_code === "number" && item.exit_code !== 0;
	let status;
	if (item.status === "failed" || nativeError !== void 0 || failedCommand) status = "failed";
	else if (item.status === "completed") status = item.type === "command_execution" && item.exit_code == null ? "unknown" : "completed";
	else if (item.status === "in_progress" && enclosingStatus === void 0) status = "running";
	else if ((item.status === "incomplete" || item.status === "in_progress") && enclosingStatus === "cancelled") status = "cancelled";
	else status = "unknown";
	const error = status === "failed" ? errorText || (failedCommand ? `Command exited with code ${item.exit_code}` : "Agents API native tool failed") : status === "cancelled" ? "Agents API native tool was cancelled" : status === "unknown" ? "Agents API native tool outcome is unavailable" : void 0;
	return {
		status,
		isError: status !== "completed" && status !== "running",
		outcomeUnknown: status === "unknown",
		...error ? { error } : {},
		...errorCode ? { errorCode } : {}
	};
}
function agentsApiNativeToolDetails(sessionId, turnId, item, outcome, capturedOutput) {
	const nativeOutput = item.output ?? capturedOutput;
	const output = nativeOutput === void 0 || nativeOutput === null ? void 0 : boundedNativeValue(nativeOutput);
	return asOptionalRecord(sanitizeToolResult({
		status: outcome.status,
		native: {
			backend: "agentsapi",
			sessionId,
			turnId,
			itemId: item.id,
			itemType: item.type,
			status: item.status ?? null
		},
		...typeof item.exit_code === "number" ? { exitCode: item.exit_code } : {},
		...typeof item.duration_ms === "number" ? { durationMs: item.duration_ms } : {},
		...typeof item.cwd === "string" ? { cwd: item.cwd } : {},
		...item.server_label ? { serverLabel: item.server_label } : {},
		...item.type === "web_search_call" ? {
			...item.action ? { action: item.action } : {},
			resultAvailability: "unavailable"
		} : {
			outputAvailability: output === void 0 ? "unavailable" : item.output == null ? "partial" : "canonical",
			...output ? {
				output: output.value,
				...output.truncated ? { outputTruncated: true } : {}
			} : {}
		},
		...item.error != null ? { nativeError: boundedNativeValue(item.error).value } : {},
		...outcome.error ? { error: outcome.error } : {},
		...outcome.errorCode ? { errorCode: outcome.errorCode } : {},
		...outcome.outcomeUnknown ? { outcomeUnknown: true } : {}
	})) ?? {};
}
function agentsApiNativeToolOutput(item, streamed) {
	if (item.type === "web_search_call") return;
	return item.output !== void 0 && item.output !== null ? nativeValueText(item.output) : streamed;
}
function nativeValueText(value) {
	const sanitized = sanitizeNativeValue(value);
	const text = typeof sanitized === "string" ? sanitized : JSON.stringify(sanitized, null, 2) ?? "";
	return truncateNativeToolTranscriptText(text, "Agents API");
}
function boundedNativeValue(value) {
	const sanitized = sanitizeNativeValue(value);
	const text = typeof sanitized === "string" ? sanitized : JSON.stringify(sanitized, null, 2) ?? "";
	return text.length <= 1e4 ? {
		value: sanitized,
		truncated: false
	} : {
		value: truncateNativeToolTranscriptText(text, "Agents API"),
		truncated: true
	};
}
function sanitizeNativeValue(value) {
	return Array.isArray(value) ? asOptionalRecord(sanitizeToolResult({ content: value }))?.content : sanitizeToolResult(value);
}
//#endregion
export { agentsApiNativeToolOutput as i, agentsApiNativeToolDetails as n, agentsApiNativeToolOutcome as r, agentsApiNativeTool as t };
