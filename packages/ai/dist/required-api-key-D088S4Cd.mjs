import { n as getEnvApiKey } from "./env-api-keys-Xd8dm_aV.mjs";
//#region packages/ai/src/utils/required-api-key.ts
function requireApiKey(provider, apiKey) {
	const resolved = apiKey || getEnvApiKey(provider);
	if (!resolved) throw new Error(`No API key for provider: ${provider}`);
	return resolved;
}
//#endregion
export { requireApiKey as t };
