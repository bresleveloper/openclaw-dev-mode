import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as requireValidExecTarget } from "./exec-approvals-core-7oJu_fRe.mjs";
import { r as markToolExecutionNotStarted } from "./tool-effect-receipt-BHVAm8DM.mjs";
//#region src/agents/bash-tools.exec-target.ts
function resolveRequestedExecTarget(params) {
	const host = requireValidExecTarget(params.host);
	const node = normalizeOptionalString(params.node);
	if (!node) return host;
	if (params.host != null && host !== "node") throw markToolExecutionNotStarted(/* @__PURE__ */ new Error(`exec node=${JSON.stringify(node)} conflicts with host=${JSON.stringify(params.host)}; omit host or use host="node" to run on this node.`));
	return "node";
}
/** Returns true when a per-call target override is allowed by configured policy. */
function isRequestedExecTargetAllowed(params) {
	return params.requestedTarget === params.configuredTarget || params.configuredTarget === "auto" && (!params.sandboxAvailable || params.requestedTarget !== "gateway" && params.requestedTarget !== "node");
}
//#endregion
export { resolveRequestedExecTarget as n, isRequestedExecTargetAllowed as t };
