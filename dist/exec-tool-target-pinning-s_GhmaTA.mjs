import { t as asNonArrayRecord } from "./record-coerce-DItp3I4t.mjs";
//#region src/agents/exec-tool-target-pinning.ts
const scheduledToolProjections = /* @__PURE__ */ new WeakMap();
const EXEC_POLICY_PARAMETER_NAMES = /* @__PURE__ */ new Set([
	"host",
	"security",
	"ask"
]);
const NODE_EXEC_PARAMETER_NAMES = /* @__PURE__ */ new Set([
	"command",
	"workdir",
	"env",
	"timeoutSeconds",
	"node"
]);
const PROCESS_FOLLOWUP_TEXT = "Use process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.";
/** Constructs and registers an alias from an exact host-owned shell source. */
function createCronScheduledToolProjection(sourceTool, assertActive, targetTool, projection) {
	assertActive();
	if (projection.kind !== targetTool) throw new Error("scheduled tool projection does not match its host-created source");
	const projectedTool = projection.kind === "exec" ? createScheduledExecProjection(sourceTool, projection) : {
		...sourceTool,
		name: projection.name,
		description: projection.description
	};
	const info = targetTool === "exec" ? Object.freeze({
		targetTool,
		execTarget: Object.freeze({
			host: "gateway",
			...projection.kind === "exec" && projection.ask ? { ask: projection.ask } : {}
		})
	}) : Object.freeze({ targetTool });
	scheduledToolProjections.set(projectedTool, Object.freeze({
		assertActive,
		sourceToolName: projectedTool.name,
		info,
		execute: projectedTool.execute
	}));
	return projectedTool;
}
function createScheduledExecProjection(sourceTool, projection) {
	const pinnedTool = pinExecToolTarget(sourceTool, {
		host: "gateway",
		...projection.ask ? { ask: projection.ask } : {}
	});
	return {
		...pinnedTool,
		name: projection.name,
		description: projection.description,
		execute: async (toolCallId, args, signal, onUpdate) => {
			const result = await pinnedTool.execute(toolCallId, args, signal, onUpdate);
			return {
				...result,
				content: result.content.map((item) => item.type === "text" ? Object.assign({}, item, { text: item.text.replace(PROCESS_FOLLOWUP_TEXT, projection.followupText) }) : item)
			};
		}
	};
}
/**
* Resolves the canonical identity of a host-created alias on the final
* executable surface. Returns undefined for tools without a registered
* projection; throws when a registered projection's executable or name was
* changed after host creation, so tampered aliases never canonicalize.
*/
function readCronScheduledToolProjection(tool) {
	const projection = scheduledToolProjections.get(tool);
	if (!projection) return;
	projection.assertActive();
	if (tool.name !== projection.sourceToolName || tool.execute !== projection.execute) throw new Error("scheduled tool projection executable changed after host creation");
	return projection.info;
}
/** Preserves projection identity across shallow tool-object copies made by tool plumbing. */
function copyCronScheduledToolProjection(source, target) {
	const projection = scheduledToolProjections.get(source);
	if (projection && source.name === projection.sourceToolName && target.name === projection.sourceToolName && source.execute === projection.execute && target.execute === projection.execute) scheduledToolProjections.set(target, projection);
}
/** Restricts an exec tool to one host target even when callers submit broader arguments. */
function pinExecToolTarget(tool, target) {
	const pinnedNode = target.host === "node" ? target.node?.trim() : void 0;
	const pinArgs = (args) => pinExecToolArgs(args, target, pinnedNode);
	const prepare = tool.prepareBeforeToolCallParams;
	const finalize = tool.finalizeBeforeToolCallParams;
	const getExecutionTimeoutMs = tool.getExecutionTimeoutMs;
	return {
		...tool,
		parameters: restrictExecToolParameters(tool.parameters, target.host, Boolean(pinnedNode)),
		...getExecutionTimeoutMs ? { getExecutionTimeoutMs: (args) => getExecutionTimeoutMs(pinArgs(args)) } : {},
		...prepare ? { prepareBeforeToolCallParams: (args, context) => prepare(pinArgs(args), context) } : {},
		...finalize ? { finalizeBeforeToolCallParams: (params, preparedParams) => finalize(pinArgs(params), preparedParams) } : {},
		execute: (toolCallId, args, signal, onUpdate) => tool.execute(toolCallId, pinArgs(args), signal, onUpdate)
	};
}
function pinExecToolArgs(args, target, pinnedNode) {
	const { host: _host, security: _security, ask: _ask, node: requestedNode, ...rest } = asNonArrayRecord(args);
	if (target.host === "gateway") return {
		...rest,
		host: "gateway",
		...target.ask ? { ask: target.ask } : {}
	};
	const nodeArgs = Object.fromEntries(Object.entries(rest).filter(([name]) => NODE_EXEC_PARAMETER_NAMES.has(name)));
	const node = pinnedNode ?? (typeof requestedNode === "string" ? requestedNode.trim() : "");
	return {
		...nodeArgs,
		host: "node",
		...node ? { node } : {}
	};
}
function restrictExecToolParameters(parameters, host, hasPinnedNode) {
	if (!parameters || typeof parameters !== "object" || Array.isArray(parameters)) return parameters;
	const schema = parameters;
	const rawProperties = schema.properties;
	if (!rawProperties || typeof rawProperties !== "object" || Array.isArray(rawProperties)) return parameters;
	const includeParameter = (name) => host === "node" ? NODE_EXEC_PARAMETER_NAMES.has(name) && !(hasPinnedNode && name === "node") : !EXEC_POLICY_PARAMETER_NAMES.has(name) && name !== "node";
	const properties = Object.fromEntries(Object.entries(rawProperties).filter(([name]) => includeParameter(name)));
	const rawRequired = schema.required;
	const required = Array.isArray(rawRequired) ? rawRequired.filter((name) => typeof name !== "string" || includeParameter(name)) : rawRequired;
	return {
		...parameters,
		properties,
		...Array.isArray(rawRequired) ? { required } : {}
	};
}
//#endregion
export { readCronScheduledToolProjection as i, createCronScheduledToolProjection as n, pinExecToolTarget as r, copyCronScheduledToolProjection as t };
