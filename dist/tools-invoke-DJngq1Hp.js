import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { mn as errorShape, pn as ErrorCodes } from "./schema-Ctppm7Dp.js";
import { rr as validateToolsInvokeParams, t as formatValidationErrors } from "./src-CSp7rUPX.js";
import { t as invokeGatewayTool } from "./tools-invoke-shared-10VsIHFU.js";
//#region src/gateway/server-methods/tools-invoke.ts
/**
* RPC adapter for invoking gateway-visible tools from connected clients.
*/
function resolveRpcErrorCode(params) {
	if (params.requiresApproval) return "requires_approval";
	switch (params.type) {
		case "invalid_request": return "validation_error";
		case "not_found": return "not_found";
		case "tool_call_blocked": return "forbidden";
		case "tool_error": return "internal_error";
	}
	return "internal_error";
}
/** Handles `tools.invoke` with protocol-shaped success and failure payloads. */
const toolsInvokeHandlers = { "tools.invoke": async ({ params, respond, context, client }) => {
	if (!validateToolsInvokeParams(params)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid tools.invoke params: ${formatValidationErrors(validateToolsInvokeParams.errors)}`));
		return;
	}
	const requestedToolName = normalizeOptionalString(params.name);
	if (!requestedToolName) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid tools.invoke params: name required"));
		return;
	}
	const outcome = await invokeGatewayTool({
		cfg: context.getRuntimeConfig(),
		input: params,
		senderIsOwner: client?.connect?.scopes?.includes("operator.admin"),
		toolCallIdPrefix: "rpc",
		approvalMode: params.confirm === true ? "request" : "report"
	});
	if (outcome.ok) {
		respond(true, {
			ok: true,
			toolName: outcome.toolName,
			output: outcome.result,
			source: outcome.source
		}, void 0);
		return;
	}
	respond(true, {
		ok: false,
		toolName: outcome.toolName || requestedToolName,
		...outcome.error.requiresApproval ? { requiresApproval: true } : {},
		error: {
			code: resolveRpcErrorCode(outcome.error),
			message: outcome.error.message
		}
	}, void 0);
} };
//#endregion
export { toolsInvokeHandlers };
