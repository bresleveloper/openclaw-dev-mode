//#region src/agents/model-tool-support.ts
/**
* Model capability helper for tool-use support.
*
* Provider catalogs can opt a model out via `compat.supportsTools === false`;
* absent metadata remains permissive for older catalog entries.
*/
const MODEL_TOOLS_UNAVAILABLE_PROMPT = "## Tool availability\n\nThis model cannot use tools in this run. Do not claim that you ran commands, read or wrote files, browsed the web, generated media, or performed any other tool-backed action. If a request requires tools, say they are unavailable in this chat and ask the user to switch to a tool-capable model.";
/** Returns whether a catalog model should be offered tool calls. */
function supportsModelTools(model) {
	return (model.compat && typeof model.compat === "object" ? model.compat : void 0)?.supportsTools !== false;
}
/** Builds the bounded honesty guard for models that explicitly disable tools. */
function buildModelToolsUnavailablePrompt(modelToolsEnabled) {
	return modelToolsEnabled ? void 0 : MODEL_TOOLS_UNAVAILABLE_PROMPT;
}
//#endregion
export { supportsModelTools as n, buildModelToolsUnavailablePrompt as t };
