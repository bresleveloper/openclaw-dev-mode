import { i as resolveAgentModelPrimaryValue } from "./model-input-B5RmygIK.js";
import { n as readCodexCliCredentialsCached, r as readGeminiCliCredentialsCached, t as readClaudeCliCredentialsCached } from "./cli-credentials-B074Y7I_.js";
import { n as probeLocalCommand } from "./probes-BMBos227.js";
//#region src/commands/onboard-inference.ts
/**
* Onboarding treats inference as the one required step: reuse whatever the
* machine already has (env API keys, Claude Code login, Codex login) before
* asking the user anything. The ladder order is a documented contract
* (docs/cli/crestodian.md "Setup bootstrap") — change docs when changing it.
*/
const OPENAI_API_DEFAULT_MODEL_REF = "openai/gpt-5.6";
const ANTHROPIC_API_DEFAULT_MODEL_REF = "anthropic/claude-opus-4-8";
const CLAUDE_CLI_DEFAULT_MODEL_REF = "claude-cli/claude-opus-4-8";
const CODEX_APP_SERVER_DEFAULT_MODEL_REF = "openai/gpt-5.6-sol";
const GEMINI_CLI_DEFAULT_MODEL_REF = "google-gemini-cli/gemini-3.1-pro-preview";
function detectCliCredentialState(params) {
	if (!params.probe.found) return;
	if (params.hasStoredCredentials) return true;
	return params.platform === "darwin" ? void 0 : false;
}
function describeCliDetail(credentials) {
	if (credentials === true) return "logged in";
	if (credentials === false) return "installed, not logged in";
	return "installed";
}
/**
* Detect usable inference backends in ladder order. Returns candidates only
* for backends that exist on this machine; the first entry is the bootstrap
* default. Backends that are definitively logged out sink below logged-in and
* unknown ones so a stale install never outranks a working login.
*/
async function detectInferenceBackends(options = {}) {
	const env = options.env ?? process.env;
	const platform = options.platform ?? process.platform;
	const probe = options.deps?.probeLocalCommand ?? probeLocalCommand;
	const readClaude = options.deps?.readClaudeCliCredentials ?? (() => readClaudeCliCredentialsCached({
		allowKeychainPrompt: false,
		ttlMs: 6e4
	}));
	const readCodex = options.deps?.readCodexCliCredentials ?? (() => readCodexCliCredentialsCached({
		allowKeychainPrompt: false,
		ttlMs: 6e4
	}));
	const readGemini = options.deps?.readGeminiCliCredentials ?? (() => readGeminiCliCredentialsCached({ ttlMs: 6e4 }));
	const candidates = [];
	const existingModel = resolveAgentModelPrimaryValue(options.config?.agents?.defaults?.model);
	if (existingModel) candidates.push({
		kind: "existing-model",
		modelRef: existingModel,
		label: "Current model",
		detail: "already configured",
		credentials: true
	});
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
	const [claudeProbe, codexProbe, geminiProbe] = await Promise.all([
		probe("claude"),
		probe("codex"),
		probe("gemini")
	]);
	const cliCandidates = [];
	if (claudeProbe.found) {
		const credentials = detectCliCredentialState({
			probe: claudeProbe,
			hasStoredCredentials: readClaude() !== null,
			platform
		});
		cliCandidates.push({
			kind: "claude-cli",
			modelRef: CLAUDE_CLI_DEFAULT_MODEL_REF,
			label: "Claude Code",
			detail: describeCliDetail(credentials),
			...credentials === void 0 ? {} : { credentials }
		});
	}
	if (codexProbe.found) {
		const credentials = detectCliCredentialState({
			probe: codexProbe,
			hasStoredCredentials: readCodex() !== null,
			platform
		});
		cliCandidates.push({
			kind: "codex-cli",
			modelRef: CODEX_APP_SERVER_DEFAULT_MODEL_REF,
			label: "Codex",
			detail: describeCliDetail(credentials),
			...credentials === void 0 ? {} : { credentials }
		});
	}
	if (geminiProbe.found) {
		const credentials = readGemini() !== null;
		cliCandidates.push({
			kind: "gemini-cli",
			modelRef: GEMINI_CLI_DEFAULT_MODEL_REF,
			label: "Gemini CLI",
			detail: describeCliDetail(credentials),
			credentials
		});
	}
	candidates.push(...cliCandidates.filter((candidate) => candidate.credentials !== false), ...cliCandidates.filter((candidate) => candidate.credentials === false));
	return candidates;
}
//#endregion
export { OPENAI_API_DEFAULT_MODEL_REF as a, GEMINI_CLI_DEFAULT_MODEL_REF as i, CLAUDE_CLI_DEFAULT_MODEL_REF as n, detectInferenceBackends as o, CODEX_APP_SERVER_DEFAULT_MODEL_REF as r, ANTHROPIC_API_DEFAULT_MODEL_REF as t };
