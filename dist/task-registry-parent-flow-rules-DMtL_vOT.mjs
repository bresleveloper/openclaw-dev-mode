import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as isTerminalTaskFlow } from "./task-flow-registry.types-BidrdCoB.mjs";
//#region src/tasks/task-registry-parent-flow-rules.ts
var ParentFlowLinkError = class extends Error {
	constructor(code, message, details) {
		super(message);
		this.code = code;
		this.details = details;
		this.name = "ParentFlowLinkError";
	}
};
function isParentFlowLinkError(error) {
	return error instanceof ParentFlowLinkError;
}
function assertParentFlowRecordLinkAllowed(params, flow) {
	const flowId = params.parentFlowId?.trim();
	if (!flowId) return;
	if (params.scopeKind !== "session") throw new ParentFlowLinkError("scope_kind_not_session", "Only session-scoped tasks can link to flows.", { flowId });
	if (!flow) throw new ParentFlowLinkError("parent_flow_not_found", `Parent flow not found: ${flowId}`, { flowId });
	if (normalizeOptionalString(flow.ownerKey) !== normalizeOptionalString(params.ownerKey)) throw new ParentFlowLinkError("owner_key_mismatch", "Task ownerKey must match parent flow ownerKey.", { flowId });
	if (flow.cancelRequestedAt != null) throw new ParentFlowLinkError("cancel_requested", "Parent flow cancellation has already been requested.", {
		flowId,
		status: flow.status
	});
	if (isTerminalTaskFlow(flow)) throw new ParentFlowLinkError("terminal", `Parent flow is already ${flow.status}.`, {
		flowId,
		status: flow.status
	});
}
//#endregion
export { isParentFlowLinkError as n, assertParentFlowRecordLinkAllowed as t };
