//#region src/commands/onboard-inference-ambient.ts
const OPENAI_API_DEFAULT_MODEL_REF = "openai/gpt-6-astra";
const ANTHROPIC_API_DEFAULT_MODEL_REF = "anthropic/claude-opus-5-5";
const CLAUDE_CLI_DEFAULT_MODEL_REF = "claude-cli/claude-opus-5-5";
const CODEX_APP_SERVER_DEFAULT_MODEL_REF = "openai/gpt-6-astra";
const GEMINI_CLI_DEFAULT_MODEL_REF = "google-gemini-cli/gemini-3.1-pro-preview";
function detectAmbientInferenceBackends(env = process.env) {
	const candidates = [];
	if (env.OPENAI_API_KEY?.trim()) candidates.push({
		kind: "openai-api-key",
		modelRef: OPENAI_API_DEFAULT_MODEL_REF,
		label: "OpenAI API key",
		detail: "OPENAI_API_KEY set",
		credentials: true
	});
	if (env.ANTHROPIC_API_KEY?.trim()) candidates.push({
		kind: "anthropic-api-key",
		modelRef: ANTHROPIC_API_DEFAULT_MODEL_REF,
		label: "Anthropic API key",
		detail: "ANTHROPIC_API_KEY set",
		credentials: true
	});
	return candidates;
}
//#endregion
export { OPENAI_API_DEFAULT_MODEL_REF as a, GEMINI_CLI_DEFAULT_MODEL_REF as i, CLAUDE_CLI_DEFAULT_MODEL_REF as n, detectAmbientInferenceBackends as o, CODEX_APP_SERVER_DEFAULT_MODEL_REF as r, ANTHROPIC_API_DEFAULT_MODEL_REF as t };
