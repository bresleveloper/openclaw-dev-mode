import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import "./worker-protocol-primitives-vA8IesMt.mjs";
import { t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
//#region src/gateway/worker-environments/worker-session-tool-result.ts
var WorkerSessionToolOutcomeUnknownError = class extends Error {
	constructor(cause) {
		super("Worker session operation outcome is unknown; it was not replayed", { cause });
		this.name = "WorkerSessionToolOutcomeUnknownError";
	}
};
function workerSessionToolErrorResult(error) {
	const message = redactSensitiveText(error instanceof Error ? error.message : "Worker session operation failed", { mode: "tools" });
	return jsonResult({
		status: "error",
		error: truncateUtf16Safe(message, 1024)
	});
}
function responseFrameBytes(resultJson) {
	return Buffer.byteLength(JSON.stringify({
		type: "res",
		id: "x".repeat(128),
		ok: true,
		payload: { resultJson }
	}), "utf8");
}
function serializeWorkerSessionToolResult(result) {
	const resultJson = JSON.stringify(result);
	if (responseFrameBytes(resultJson) > 65536) return JSON.stringify(workerSessionToolErrorResult(/* @__PURE__ */ new Error("Worker session tool result exceeded the limit")));
	return resultJson;
}
//#endregion
export { serializeWorkerSessionToolResult as n, workerSessionToolErrorResult as r, WorkerSessionToolOutcomeUnknownError as t };
