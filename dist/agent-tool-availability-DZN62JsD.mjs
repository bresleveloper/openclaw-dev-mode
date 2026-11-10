import { r as createToolExecutionMatcher } from "./tool-policy-shared-PsZCKeeN.mjs";
import { n as textResult } from "./tool-results-BCM3fdVS.mjs";
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
/**
* Keeps a tool's definition, so every turn of a session shares one prompt prefix,
* while this turn may not run it.
*/
function gateAgentToolExecution(tool, message) {
	return markAgentToolExecutionUnavailable(copyAgentToolAvailability(tool, {
		...tool,
		prepareArguments: void 0,
		prepareBeforeToolCallParams: void 0,
		finalizeBeforeToolCallParams: void 0,
		execute: async () => textResult(message, { gated: true })
	}));
}
/** Finalize owner-controlled affordances after filtering; never rebind or grant tools. */
function finalizeAgentToolAvailability(tools, options) {
	const winners = new Map(tools.map((tool) => [tool.name, tool]));
	const executionAllowed = options?.toolExecutionAllow ? createToolExecutionMatcher(options.toolExecutionAllow) : void 0;
	const callableTools = new Map([...winners].filter(([, tool]) => !availabilityBindings.get(tool)?.executionDenied && (!executionAllowed || executionAllowed(tool.name))));
	for (const tool of tools) {
		const binding = availabilityBindings.get(tool)?.binding;
		if (binding && (!options?.beforeNormalization || binding.prepareBeforeNormalization)) {
			binding.prepare(tool, callableTools, winners);
			options?.onPrepared?.(tool);
		}
	}
	return [...tools];
}
function resolveAgentToolExecutionSchema(tool, schema) {
	return availabilityBindings.get(tool)?.binding.executionSchema?.(schema) ?? schema;
}
//#endregion
export { getAgentToolAvailabilityBinding as a, gateAgentToolExecution as i, copyAgentToolAvailability as n, markAgentToolExecutionUnavailable as o, finalizeAgentToolAvailability as r, resolveAgentToolExecutionSchema as s, bindAgentToolAvailability as t };
