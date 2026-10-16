import { a as createToolExecutionMatcher } from "./tool-policy-shared-DWHChhWM.mjs";
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
		if (binding && (!options?.beforeNormalization || binding.prepareBeforeNormalization)) {
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
export { markAgentToolExecutionUnavailable as a, getAgentToolAvailabilityBinding as i, copyAgentToolAvailability as n, resolveAgentToolExecutionSchema as o, finalizeAgentToolAvailability as r, bindAgentToolAvailability as t };
