import { r as getAiTransportHost } from "./host-CWt55nnF.mjs";
import { n as getEnvApiKey } from "./env-api-keys-Xd8dm_aV.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-DA4WHv1h.mjs";
import { t as requireApiKey } from "./required-api-key-D088S4Cd.mjs";
import { n as buildGoogleHttpOptions, t as createGoogleGenerateContentStreams } from "./google-provider-stream-BHd0cST9.mjs";
import { GoogleGenAI } from "@google/genai";
//#region packages/ai/src/providers/google.ts
const { stream: streamGoogle, streamSimple: streamSimpleGoogle } = createGoogleGenerateContentStreams("google-generative-ai", (model, options) => {
	return createClient(model, options?.apiKey || getEnvApiKey(model.provider) || "", resolveOpencodeSessionHeaders(model, options));
}, (model, options) => requireApiKey(model.provider, options?.apiKey));
function createClient(model, apiKey, optionsHeaders) {
	const httpOptions = buildGoogleHttpOptions(model, optionsHeaders, "generative-ai");
	const resolvedApiKey = apiKey ? getAiTransportHost().resolveSecretSentinel(apiKey) : void 0;
	return new GoogleGenAI({
		apiKey: resolvedApiKey,
		httpOptions
	});
}
//#endregion
export { streamGoogle, streamSimpleGoogle };
