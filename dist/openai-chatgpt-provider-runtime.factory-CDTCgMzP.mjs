import "./runtime-env-gAOlVhyA.mjs";
import "./openai-chatgpt-oauth-flow.runtime.js";
//#region extensions/openai/openai-chatgpt-provider-runtime.factory.ts
function createOpenAICodexProviderRuntime(deps) {
	return { async refreshOpenAICodexToken(...args) {
		deps.ensureGlobalUndiciEnvProxyDispatcher();
		return await deps.refreshOpenAICodexToken(...args);
	} };
}
//#endregion
export { createOpenAICodexProviderRuntime as t };
