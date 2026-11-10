import "./provider-http-BuV15s4V.mjs";
import { t as runHttpTlsPreflight } from "./http-tls-preflight-nN0IyrZJ.mjs";
//#region extensions/openai/openai-chatgpt-oauth-preflight.runtime.ts
const OPENAI_AUTH_PROBE_URL = "https://auth.openai.com/oauth/authorize?response_type=code&client_id=openclaw-preflight&redirect_uri=http%3A%2F%2Flocalhost%3A1455%2Fauth%2Fcallback&scope=openid+profile+email";
function runOpenAIOAuthTlsPreflight(options) {
	return runHttpTlsPreflight(OPENAI_AUTH_PROBE_URL, options);
}
//#endregion
export { runOpenAIOAuthTlsPreflight as t };
