import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as PluginHostObject } from "./plugin-instance-owned-values-kZIH8zYk.mjs";
import { o as resolveCoreToolExecutionLocation } from "./tool-catalog-DyHnjiiS.mjs";
import { r as copyCodeModeControlToolIdentity } from "./code-mode-control-tools-CpOmDfxq.mjs";
import { n as copyPluginToolMeta, r as getPluginToolMeta } from "./tool-metadata-DEC0Rqn3.mjs";
import { n as copyAgentToolAvailability } from "./agent-tool-availability-Bgm3tNkT.mjs";
import { c as copyInternalToolExecutionPreparer } from "./internal-hooks-Cr0v44EY.mjs";
//#region src/agents/before-tool-call-metadata.ts
const BEFORE_TOOL_CALL_WRAPPED = Symbol.for("openclaw.beforeToolCallWrapped");
const BEFORE_TOOL_CALL_SOURCE_TOOL = Symbol.for("openclaw.beforeToolCallSourceTool");
const metadataByMarker = resolveGlobalSingleton(Symbol.for("openclaw.beforeToolCallMetadata"), () => /* @__PURE__ */ new WeakMap());
function withBeforeToolCallMetadata(tool) {
	return tool;
}
function getBeforeToolCallMetadata(tool) {
	const marker = withBeforeToolCallMetadata(tool)[BEFORE_TOOL_CALL_WRAPPED];
	return marker ? metadataByMarker.get(marker) : void 0;
}
function bindBeforeToolCallMetadata(tool, { sourceTool, ...metadata }) {
	const marker = Symbol("beforeToolCallMetadata");
	metadataByMarker.set(marker, metadata);
	Object.defineProperties(tool, {
		[BEFORE_TOOL_CALL_WRAPPED]: {
			value: marker,
			enumerable: true
		},
		[BEFORE_TOOL_CALL_SOURCE_TOOL]: {
			value: sourceTool,
			enumerable: false
		}
	});
}
function getBeforeToolCallSourceTool(tool) {
	return withBeforeToolCallMetadata(tool)[BEFORE_TOOL_CALL_SOURCE_TOOL];
}
function getBeforeToolCallExecutionWrappers(tool) {
	return getBeforeToolCallMetadata(tool)?.executionWrappers ?? [];
}
function getBeforeToolCallHookContext(tool) {
	return getBeforeToolCallMetadata(tool)?.hookContext;
}
function clearBeforeToolCallWrappedMarker(tool) {
	delete withBeforeToolCallMetadata(tool)[BEFORE_TOOL_CALL_WRAPPED];
}
/** Return true when a tool already carries the before_tool_call wrapper state. */
function isToolWrappedWithBeforeToolCallHook(tool) {
	return getBeforeToolCallMetadata(tool) !== void 0;
}
/** Toggle diagnostic event emission on an existing before_tool_call wrapper. */
function setBeforeToolCallDiagnosticsEnabled(tool, enabled) {
	const options = getBeforeToolCallMetadata(tool)?.options;
	if (options) options.emitDiagnostics = enabled;
}
function getBeforeToolCallDiagnosticOptions(tool) {
	return getBeforeToolCallMetadata(tool)?.options;
}
/** Preserve exact hook state and the guarded source edge when another wrapper replaces a tool. */
function copyBeforeToolCallMetadata(source, target, wrapExecution) {
	const sourceMarker = withBeforeToolCallMetadata(source)[BEFORE_TOOL_CALL_WRAPPED];
	const metadata = getBeforeToolCallMetadata(source);
	if (!sourceMarker || !metadata) return;
	const marker = wrapExecution ? Symbol("beforeToolCallMetadata") : sourceMarker;
	if (wrapExecution) metadataByMarker.set(marker, {
		...metadata,
		executionWrappers: Object.freeze([...metadata.executionWrappers ?? [], wrapExecution])
	});
	Object.defineProperty(target, BEFORE_TOOL_CALL_WRAPPED, {
		value: marker,
		enumerable: true
	});
	const sourceTool = getBeforeToolCallSourceTool(source);
	if (sourceTool) Object.defineProperty(target, BEFORE_TOOL_CALL_SOURCE_TOOL, {
		value: sourceTool,
		enumerable: false
	});
}
//#endregion
//#region src/agents/channel-tool-metadata.ts
const channelAgentToolMeta = /* @__PURE__ */ new WeakMap();
/** Read channel metadata attached to a channel-owned agent tool. */
function getChannelAgentToolMeta(tool) {
	return channelAgentToolMeta.get(tool);
}
/** Attach channel ownership metadata to a concrete agent tool. */
function setChannelAgentToolMeta(tool, meta) {
	channelAgentToolMeta.set(tool, meta);
}
/** Copy channel metadata when wrapping or replacing a channel-owned tool. */
function copyChannelAgentToolMeta(source, target) {
	const meta = channelAgentToolMeta.get(source);
	if (meta) channelAgentToolMeta.set(target, meta);
}
//#endregion
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
//#region src/agents/tool-terminal-presentation.ts
const terminalPresentationByTool = /* @__PURE__ */ new WeakMap();
function setToolTerminalPresentation(tool, formatter) {
	terminalPresentationByTool.set(tool, formatter);
	return tool;
}
function getToolTerminalPresentation(tool) {
	return terminalPresentationByTool.get(tool);
}
function copyToolTerminalPresentation(source, target) {
	const formatter = terminalPresentationByTool.get(source);
	if (formatter) terminalPresentationByTool.set(target, formatter);
}
//#endregion
//#region src/agents/agent-tool-metadata.ts
var ToolActionMetadata = class ToolActionMetadata extends PluginHostObject {
	#state;
	constructor(tool, state) {
		super(tool);
		this.#state = { ...state };
	}
	static get(tool) {
		return #state in tool ? tool.#state : void 0;
	}
	static set(tool, state) {
		if (#state in tool) Object.assign(tool.#state, state);
		else new ToolActionMetadata(tool, state);
	}
};
const memoryAction = Object.freeze({
	family: "data",
	operation: "memory"
});
const openclawAction = Object.freeze({
	family: "tool",
	operation: "openclaw"
});
function bindAgentToolExecutionLocation(tool, location) {
	ToolActionMetadata.set(tool, { executionLocation: location });
}
function getAgentToolExecutionLocation(tool) {
	return ToolActionMetadata.get(tool)?.executionLocation ?? { kind: resolveCoreToolExecutionLocation(tool.name) };
}
function bindAgentToolActionDescriptor(tool, descriptor) {
	ToolActionMetadata.set(tool, { descriptor });
}
function getAgentToolActionDescriptor(tool) {
	return ToolActionMetadata.get(tool)?.descriptor;
}
/** Preserve only the metadata owned by a before-tool-call wrapper rebuild. */
function copyBeforeToolCallWrapperMetadata(source, target) {
	copyPluginToolMeta(source, target);
	copyChannelAgentToolMeta(source, target);
	copyToolTerminalPresentation(source, target);
	const state = ToolActionMetadata.get(source);
	if (state) ToolActionMetadata.set(target, state);
	copyAgentToolAvailability(source, target);
}
/** Bind the broad family at final assembly from private, process-stable owner metadata. */
function bindAssembledAgentToolActionDescriptor(tool) {
	if (getAgentToolActionDescriptor(tool)) return;
	const kind = getPluginToolMeta(tool)?.kind;
	bindAgentToolActionDescriptor(tool, kind === "memory" || Array.isArray(kind) && kind.includes("memory") ? memoryAction : openclawAction);
}
/**
* Preserve identity-backed tool metadata that object spread cannot carry.
* Losing it detaches policy, hooks, presentation, and control-flow ownership.
*/
function copyAgentToolMetadata(source, target, wrapExecution) {
	if (source === target) return target;
	copyBeforeToolCallWrapperMetadata(source, target);
	copyBeforeToolCallMetadata(source, target, wrapExecution);
	copyCodeModeControlToolIdentity(source, target);
	copyCronScheduledToolProjection(source, target);
	copyInternalToolExecutionPreparer(source, target);
	return target;
}
//#endregion
export { setBeforeToolCallDiagnosticsEnabled as S, getBeforeToolCallDiagnosticOptions as _, copyBeforeToolCallWrapperMetadata as a, getBeforeToolCallSourceTool as b, getToolTerminalPresentation as c, pinExecToolTarget as d, readCronScheduledToolProjection as f, clearBeforeToolCallWrappedMarker as g, bindBeforeToolCallMetadata as h, copyAgentToolMetadata as i, setToolTerminalPresentation as l, setChannelAgentToolMeta as m, bindAgentToolExecutionLocation as n, getAgentToolActionDescriptor as o, getChannelAgentToolMeta as p, bindAssembledAgentToolActionDescriptor as r, getAgentToolExecutionLocation as s, bindAgentToolActionDescriptor as t, createCronScheduledToolProjection as u, getBeforeToolCallExecutionWrappers as v, isToolWrappedWithBeforeToolCallHook as x, getBeforeToolCallHookContext as y };
