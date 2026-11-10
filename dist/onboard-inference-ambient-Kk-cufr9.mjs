//#region src/commands/onboard-inference-ambient.ts
const OPENAI_API_DEFAULT_MODEL_REF = "openai/gpt-6-astra";
const ANTHROPIC_API_DEFAULT_MODEL_REF = "anthropic/claude-opus-5-5";
const CLAUDE_CLI_DEFAULT_MODEL_REF = "claude-cli/claude-opus-5-5";
const CODEX_APP_SERVER_DEFAULT_MODEL_REF = "openai/gpt-6-astra";
const GEMINI_CLI_DEFAULT_MODEL_REF = "google-gemini-cli/gemini-3.1-pro-preview";
function detectAmbientInferenceBackends(env = process.env) {
	const candidates = [];
	for (const [provider, label, modelRef] of [[
		"openai",
		"OpenAI",
		OPENAI_API_DEFAULT_MODEL_REF
	], [
		"anthropic",
		"Anthropic",
		ANTHROPIC_API_DEFAULT_MODEL_REF
	]]) {
		const envVar = `${provider.toUpperCase()}_API_KEY`;
		if (!env[envVar]?.trim()) continue;
		candidates.push({
			kind: `${provider}-api-key`,
			modelRef,
			label: `${label} API key`,
			detail: `${envVar} set`,
			credentials: true
		});
	}
	return candidates;
}
//#endregion
export { OPENAI_API_DEFAULT_MODEL_REF as a, GEMINI_CLI_DEFAULT_MODEL_REF as i, CLAUDE_CLI_DEFAULT_MODEL_REF as n, detectAmbientInferenceBackends as o, CODEX_APP_SERVER_DEFAULT_MODEL_REF as r, ANTHROPIC_API_DEFAULT_MODEL_REF as t };
