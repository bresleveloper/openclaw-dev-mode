import { a as toToolDefinitions } from "./agent-tool-definition-adapter-BasRE6Gy.mjs";
//#region src/agents/embedded-agent-runner/tool-split.ts
/**
* Splits SDK tools from OpenClaw tool definitions for provider calls.
*/
function splitSdkTools(options) {
	const { tools, toolHookContext } = options;
	return { customTools: toToolDefinitions(tools, toolHookContext, options.abortSignal) };
}
//#endregion
export { splitSdkTools as t };
