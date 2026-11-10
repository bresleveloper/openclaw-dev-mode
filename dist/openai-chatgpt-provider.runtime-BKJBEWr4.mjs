import { r as ensureGlobalUndiciEnvProxyDispatcher } from "./undici-global-dispatcher-9JyoXANm.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import { n as refreshOpenAICodexToken$1 } from "./openai-chatgpt-oauth-flow.runtime.js";
//#region extensions/openai/openai-chatgpt-provider.runtime.ts
async function refreshOpenAICodexToken(...args) {
	ensureGlobalUndiciEnvProxyDispatcher();
	return await refreshOpenAICodexToken$1(...args);
}
//#endregion
export { refreshOpenAICodexToken as t };
