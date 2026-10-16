import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/agent-tools.ring-zero-context.ts
const activeRingZeroTools = new AsyncLocalStorage();
var HostScopedAgentToolAuthorizationError = class extends Error {
	constructor(message) {
		super(message);
		this.status = 403;
		this.name = "HostScopedAgentToolAuthorizationError";
	}
};
function bindToolToScope(tool, scope) {
	const execute = tool.execute;
	return {
		...tool,
		execute: async (toolCallId, params, signal, onUpdate) => {
			if (!scope.active) throw new HostScopedAgentToolAuthorizationError(`host-scoped tool "${tool.name}" is no longer authorized for this run`);
			return await execute(toolCallId, params, signal, onUpdate);
		}
	};
}
/**
* Bind host-owned tools to one selected harness run. The SDK reads this scope
* during tool construction, so plugins never receive private authority objects.
*/
function runWithAgentRingZeroTools(tools, run) {
	const scope = {
		active: true,
		tools: []
	};
	scope.tools = tools.map((tool) => bindToolToScope(tool, scope));
	try {
		const result = activeRingZeroTools.run(scope, run);
		if (isPromiseLike(result)) return Promise.resolve(result).finally(() => {
			scope.active = false;
		});
		scope.active = false;
		return result;
	} catch (error) {
		scope.active = false;
		throw error;
	}
}
/** Read the host-owned tools bound to the current harness run. */
function getActiveAgentRingZeroTools() {
	const scope = activeRingZeroTools.getStore();
	return scope?.active === true ? scope.tools : [];
}
function mergeAgentRingZeroTools(ringZeroTools, tools) {
	if (ringZeroTools.length === 0) return tools;
	const reservedNames = new Set(ringZeroTools.map((tool) => tool.name));
	return [...ringZeroTools, ...tools.filter((tool) => !reservedNames.has(tool.name))];
}
/**
* Read a host-owned tool fact for the current run. This does not activate or
* grant a tool; only the host can bind executable authority to the run scope.
*/
function isHostScopedAgentToolActive(toolName) {
	const normalizedName = toolName.trim().toLowerCase();
	return normalizedName.length > 0 && getActiveAgentRingZeroTools().some((tool) => tool.name.trim().toLowerCase() === normalizedName);
}
//#endregion
export { runWithAgentRingZeroTools as i, isHostScopedAgentToolActive as n, mergeAgentRingZeroTools as r, getActiveAgentRingZeroTools as t };
