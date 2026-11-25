import { n as getEnvApiKey } from "./env-api-keys-DlUbTgKq.mjs";
// packages/ai/src/utils/required-api-key.ts
function requireApiKey(provider, apiKey) {
	const resolved = apiKey || getEnvApiKey(provider);
	if (!resolved) throw new Error(`No API key for provider: ${provider}`);
	return resolved;
}
export { requireApiKey as t };
