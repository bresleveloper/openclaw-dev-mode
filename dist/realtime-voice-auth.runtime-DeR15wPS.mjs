import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./agent-scope-runtime-DMJYuX7c.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-B-PBEJIo.mjs";
//#region extensions/xai/realtime-voice-auth.runtime.ts
async function resolveXaiRealtimeApiKey(configApiKey, cfg, agentId) {
	const direct = normalizeOptionalString(configApiKey) ?? normalizeOptionalString(process.env.XAI_API_KEY);
	if (direct) return direct;
	const auth = await resolveApiKeyForProvider({
		provider: "xai",
		cfg,
		...cfg && agentId ? { agentDir: resolveAgentDir(cfg, agentId) } : {}
	});
	const oauthKey = normalizeOptionalString(auth?.apiKey);
	if (oauthKey) return oauthKey;
	throw new Error("xAI credentials missing for realtime voice. Sign in with `openclaw onboard --auth-choice xai-oauth`, run `openclaw onboard --auth-choice xai-api-key`, or set XAI_API_KEY.");
}
//#endregion
export { resolveXaiRealtimeApiKey as t };
