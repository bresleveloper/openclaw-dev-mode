import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import "./worker-protocol-primitives-BajTgPT4.mjs";
import { Ct as isWorkerGatewayToolFrameWithinBudget, bt as WorkerGatewayToolResultSchema } from "./worker-admission-CNeLWzVQ.mjs";
import { t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
import { Value } from "typebox/value";
//#region src/gateway/worker-environments/worker-session-tool-result.ts
var WorkerSessionToolOutcomeUnknownError = class extends Error {
	constructor(cause) {
		super("Worker session operation outcome is unknown; it was not replayed", { cause });
		this.name = "WorkerSessionToolOutcomeUnknownError";
	}
};
/** Retry only the same idempotent operation; callers revalidate authority on each attempt. */
async function executeWorkerSessionToolWithReplay(execute) {
	try {
		return await execute(false);
	} catch {
		try {
			return await execute(true);
		} catch (error) {
			throw new WorkerSessionToolOutcomeUnknownError(error);
		}
	}
}
function workerSessionToolErrorResult(error) {
	const message = redactSensitiveText(error instanceof Error ? error.message : "Worker session operation failed", { mode: "tools" });
	return jsonResult({
		status: "error",
		error: truncateUtf16Safe(message, 1024)
	});
}
function serializeWorkerSessionToolError(error) {
	return serializeWorkerSessionToolResult(workerSessionToolErrorResult(error));
}
function boundWorkerToolResult(result) {
	if (Value.Check(WorkerGatewayToolResultSchema, result) && isWorkerGatewayToolFrameWithinBudget({
		type: "res",
		id: "x".repeat(128),
		ok: true,
		payload: result
	}, result)) return result;
	return workerSessionToolErrorResult(/* @__PURE__ */ new Error("Worker tool result exceeded the transport contract"));
}
function serializeWorkerSessionToolResult(result) {
	return JSON.stringify(boundWorkerToolResult(result));
}
function parseWorkerSessionToolResult(resultJson) {
	const result = JSON.parse(resultJson);
	if (!Value.Check(WorkerGatewayToolResultSchema, result)) throw new Error("Stored worker session tool result is invalid");
	return {
		...result,
		details: result.details
	};
}
//#endregion
export { serializeWorkerSessionToolError as a, parseWorkerSessionToolResult as i, boundWorkerToolResult as n, serializeWorkerSessionToolResult as o, executeWorkerSessionToolWithReplay as r, workerSessionToolErrorResult as s, WorkerSessionToolOutcomeUnknownError as t };
