import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { a as createToolExecutionMatcher } from "./tool-policy-shared-auQCQEhM.mjs";
import { r as copyCodeModeControlToolIdentity } from "./code-mode-control-tools-fvyqQnLi.mjs";
import { n as copyPluginToolMeta, r as getPluginToolMeta } from "./tool-metadata-DpaqT_qU.mjs";
import { t as copyCronScheduledToolProjection } from "./exec-tool-target-pinning-s_GhmaTA.mjs";
import { c as copyInternalToolExecutionPreparer } from "./internal-hooks-DUPhyX-W.mjs";
//#region src/agents/agent-tool-availability.ts
const availabilityBindings = /* @__PURE__ */ new WeakMap();
function bindAgentToolAvailability(tool, binding) {
	availabilityBindings.set(tool, { binding });
	return tool;
}
function getAgentToolAvailabilityBinding(tool) {
	return availabilityBindings.get(tool)?.binding;
}
function copyAgentToolAvailability(source, target) {
	const metadata = availabilityBindings.get(source);
	if (metadata) availabilityBindings.set(target, metadata);
	return target;
}
/** Record an executor denial so later schema-only catalog projections cannot undo it. */
function markAgentToolExecutionUnavailable(tool) {
	const metadata = availabilityBindings.get(tool);
	if (metadata) availabilityBindings.set(tool, {
		...metadata,
		executionDenied: true
	});
	return tool;
}
/** Finalize owner-controlled affordances after filtering; never rebind or grant tools. */
function finalizeAgentToolAvailability(tools, options) {
	const winners = new Map(tools.map((tool) => [tool.name, tool]));
	const executionAllowed = options?.toolExecutionAllow ? createToolExecutionMatcher(options.toolExecutionAllow) : void 0;
	const callableTools = /* @__PURE__ */ new Map();
	for (const callableTool of [...winners.values()].filter((tool) => !availabilityBindings.get(tool)?.executionDenied && (!executionAllowed || executionAllowed(tool.name)))) callableTools.set(callableTool.name, callableTool);
	for (const tool of tools) {
		const binding = availabilityBindings.get(tool)?.binding;
		if (binding) {
			binding.prepare(tool, callableTools);
			options?.onPrepared?.(tool);
		}
	}
	return [...tools];
}
function resolveAgentToolExecutionSchema(tool, schema) {
	return availabilityBindings.get(tool)?.binding.executionSchema?.(schema) ?? schema;
}
//#endregion
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
	const marker = Object.freeze({});
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
function copyBeforeToolCallMetadata(source, target) {
	const marker = withBeforeToolCallMetadata(source)[BEFORE_TOOL_CALL_WRAPPED];
	if (!marker || !metadataByMarker.has(marker)) return;
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
const actionDescriptors = /* @__PURE__ */ new WeakMap();
function bindAgentToolActionDescriptor(tool, descriptor) {
	actionDescriptors.set(tool, descriptor);
}
function getAgentToolActionDescriptor(tool) {
	return actionDescriptors.get(tool);
}
function copyAgentToolActionDescriptor(source, target) {
	const descriptor = actionDescriptors.get(source);
	if (descriptor) actionDescriptors.set(target, descriptor);
}
/** Preserve only the metadata owned by a before-tool-call wrapper rebuild. */
function copyBeforeToolCallWrapperMetadata(source, target) {
	copyPluginToolMeta(source, target);
	copyChannelAgentToolMeta(source, target);
	copyToolTerminalPresentation(source, target);
	copyAgentToolActionDescriptor(source, target);
	copyAgentToolAvailability(source, target);
}
/** Bind the broad family at final assembly from private, process-stable owner metadata. */
function bindAssembledAgentToolActionDescriptor(tool) {
	if (actionDescriptors.has(tool)) return;
	const kind = getPluginToolMeta(tool)?.kind;
	const memory = kind === "memory" || Array.isArray(kind) && kind.includes("memory");
	actionDescriptors.set(tool, memory ? {
		family: "data",
		operation: "memory"
	} : {
		family: "tool",
		operation: "openclaw"
	});
}
/**
* Preserve identity-backed tool metadata that object spread cannot carry.
* Losing it detaches policy, hooks, presentation, and control-flow ownership.
*/
function copyAgentToolMetadata(source, target) {
	if (source === target) return target;
	copyPluginToolMeta(source, target);
	copyChannelAgentToolMeta(source, target);
	copyBeforeToolCallMetadata(source, target);
	copyToolTerminalPresentation(source, target);
	copyCodeModeControlToolIdentity(source, target);
	copyCronScheduledToolProjection(source, target);
	copyInternalToolExecutionPreparer(source, target);
	copyAgentToolActionDescriptor(source, target);
	copyAgentToolAvailability(source, target);
	return target;
}
//#endregion
export { resolveAgentToolExecutionSchema as S, bindAgentToolAvailability as _, getAgentToolActionDescriptor as a, getAgentToolAvailabilityBinding as b, getChannelAgentToolMeta as c, clearBeforeToolCallWrappedMarker as d, getBeforeToolCallDiagnosticOptions as f, setBeforeToolCallDiagnosticsEnabled as g, isToolWrappedWithBeforeToolCallHook as h, copyBeforeToolCallWrapperMetadata as i, setChannelAgentToolMeta as l, getBeforeToolCallSourceTool as m, bindAssembledAgentToolActionDescriptor as n, getToolTerminalPresentation as o, getBeforeToolCallHookContext as p, copyAgentToolMetadata as r, setToolTerminalPresentation as s, bindAgentToolActionDescriptor as t, bindBeforeToolCallMetadata as u, copyAgentToolAvailability as v, markAgentToolExecutionUnavailable as x, finalizeAgentToolAvailability as y };
