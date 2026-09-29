import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./agent-scope-runtime-OY7yRyJL.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-CYwZwijM.mjs";
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
