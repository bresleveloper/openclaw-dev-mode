import { n as refreshOpenAICodexToken$1 } from "./openai-chatgpt-oauth-flow.runtime-BwA_3IOw.mjs";
import { ensureGlobalUndiciEnvProxyDispatcher } from "openclaw/plugin-sdk/runtime-env";
//#region extensions/openai/openai-chatgpt-provider.runtime.ts
async function refreshOpenAICodexToken(...args) {
	ensureGlobalUndiciEnvProxyDispatcher();
	return await refreshOpenAICodexToken$1(...args);
}
//#endregion
export { refreshOpenAICodexToken };
