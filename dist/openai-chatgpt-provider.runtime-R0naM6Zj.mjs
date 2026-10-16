import { r as ensureGlobalUndiciEnvProxyDispatcher } from "./undici-global-dispatcher-DH6sagj7.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import { n as refreshOpenAICodexToken$1 } from "./openai-chatgpt-oauth-flow.runtime.js";
//#region extensions/openai/openai-chatgpt-provider.runtime.ts
async function refreshOpenAICodexToken(...args) {
	ensureGlobalUndiciEnvProxyDispatcher();
	return await refreshOpenAICodexToken$1(...args);
}
//#endregion
export { refreshOpenAICodexToken as t };
