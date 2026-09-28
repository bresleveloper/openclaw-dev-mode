import { n as refreshOpenAICodexToken$1 } from "./openai-chatgpt-oauth-flow.runtime-DsW0hMIP.mjs";
import { ensureGlobalUndiciEnvProxyDispatcher } from "openclaw/plugin-sdk/runtime-env";
//#region extensions/openai/openai-chatgpt-provider-runtime.factory.ts
function createOpenAICodexProviderRuntime(deps) {
	return { async refreshOpenAICodexToken(...args) {
		deps.ensureGlobalUndiciEnvProxyDispatcher();
		return await deps.refreshOpenAICodexToken(...args);
	} };
}
//#endregion
//#region extensions/openai/openai-chatgpt-provider.runtime.ts
const runtime = createOpenAICodexProviderRuntime({
	ensureGlobalUndiciEnvProxyDispatcher,
	refreshOpenAICodexToken: refreshOpenAICodexToken$1
});
async function refreshOpenAICodexToken(...args) {
	return await runtime.refreshOpenAICodexToken(...args);
}
//#endregion
export { refreshOpenAICodexToken };
