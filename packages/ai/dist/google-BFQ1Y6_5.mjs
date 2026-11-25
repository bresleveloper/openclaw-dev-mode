import { r as getAiTransportHost } from "./host-Dm4e6L6R.mjs";
import { n as getEnvApiKey } from "./env-api-keys-DlUbTgKq.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-Czm9tjAm.mjs";
import { t as requireApiKey } from "./required-api-key-BniLGxy4.mjs";
import { n as buildGoogleHttpOptions, t as createGoogleGenerateContentStreams } from "./google-provider-stream-DCBc7IHp.mjs";
import { GoogleGenAI } from "@google/genai";
// packages/ai/src/providers/google.ts
const { stream: streamGoogle, streamSimple: streamSimpleGoogle } = createGoogleGenerateContentStreams("google-generative-ai", (model, options) => {
	const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
	const optionsHeaders = resolveOpencodeSessionHeaders(model, options);
	const httpOptions = buildGoogleHttpOptions(model, optionsHeaders, "generative-ai");
	const resolvedApiKey = apiKey ? getAiTransportHost().resolveSecretSentinel(apiKey) : void 0;
	return new GoogleGenAI({
		apiKey: resolvedApiKey,
		httpOptions
	});
}, (model, options) => requireApiKey(model.provider, options?.apiKey));
export { streamGoogle, streamSimpleGoogle };
