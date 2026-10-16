import { r as resolveOsHomeDir } from "./home-dir-D0b-ywue.mjs";
import "./home-dir-Dc6nN6HB.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { T as tryResolveLegacyCompatibilityAgentId, r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import { a as resolveCodexCliHomePath, n as readCodexCliCredentialsCached, r as readGeminiCliCredentialsCached } from "./cli-credentials-iMPJTQjZ.mjs";
import "./model-selection-C1qxt1eY.mjs";
import { n as probeLocalCommand } from "./probes-BEX9YOKS.mjs";
import { i as GEMINI_CLI_DEFAULT_MODEL_REF, n as CLAUDE_CLI_DEFAULT_MODEL_REF, o as detectAmbientInferenceBackends, r as CODEX_APP_SERVER_DEFAULT_MODEL_REF } from "./onboard-inference-ambient-DV_evpy7.mjs";
import path from "node:path";
import os from "node:os";
import { randomInt } from "node:crypto";
//#region src/commands/onboard-inference.ts
function randomizeClaudeCodexTie(candidates, pickRandomInt) {
	const claudeIndex = candidates.findIndex((candidate) => candidate.kind === "claude-cli");
	const codexIndex = candidates.findIndex((candidate) => candidate.kind === "codex-cli");
	if (claudeIndex === -1 || codexIndex === -1 || pickRandomInt(2) === 0) return;
	const claudeCandidate = candidates[claudeIndex];
	const codexCandidate = candidates[codexIndex];
	candidates[claudeIndex] = expectDefined(codexCandidate, "Codex onboarding candidate");
	candidates[codexIndex] = expectDefined(claudeCandidate, "Claude onboarding candidate");
}
const CODEX_MACOS_APP_NAMES = [
	"ChatGPT.app",
	"Codex.app",
	"Codex Beta.app"
];
const CODEX_MACOS_APP_PROBE_TIMEOUT_MS = 3e3;
async function probeCodexCommand(params) {
	const pathProbe = await params.probe("codex");
	if (pathProbe.found || params.platform !== "darwin") return pathProbe;
	const home = params.env.HOME?.trim() || os.homedir();
	const appExecutables = new Set(CODEX_MACOS_APP_NAMES.flatMap((appName) => [path.join("/Applications", appName, "Contents", "Resources", "codex"), path.join(home, "Applications", appName, "Contents", "Resources", "codex")]));
	for (const executable of appExecutables) {
		const appProbe = await params.probe(executable, ["--version"], { timeoutMs: CODEX_MACOS_APP_PROBE_TIMEOUT_MS });
		if (appProbe.found) return appProbe;
	}
	return pathProbe;
}
/**
* Detect usable inference backends in ladder order. Returns candidates only
* for backends that exist on this machine; explicit setup owns selection.
* Native CLI discovery stays passive; environment credentials precede unverified CLIs.
*/
async function detectInferenceBackends(options = {}) {
	const env = options.env ?? process.env;
	const platform = options.platform ?? process.platform;
	const probe = options.deps?.probeLocalCommand ?? probeLocalCommand;
	const readCodex = options.deps?.readCodexCliCredentials ?? (() => {
		if (!resolveOsHomeDir(env, env === process.env ? os.homedir : () => "") && !env.CODEX_HOME?.trim()) return null;
		return readCodexCliCredentialsCached({
			codexHome: resolveCodexCliHomePath(void 0, env),
			platform,
			allowKeychainPrompt: false,
			ttlMs: 6e4
		});
	});
	const readGemini = options.deps?.readGeminiCliCredentials ?? (() => readGeminiCliCredentialsCached({ ttlMs: 6e4 }));
	const candidates = [];
	const defaultAgentId = options.config ? options.agentId?.trim() || tryResolveLegacyCompatibilityAgentId(options.config) : void 0;
	const defaultAgentModel = options.config && defaultAgentId ? resolveAgentConfig(options.config, defaultAgentId)?.model : void 0;
	if (resolveAgentModelPrimaryValue(defaultAgentModel) ?? resolveAgentModelPrimaryValue(options.config?.agents?.defaults?.model)) {
		const resolved = resolveDefaultModelForAgent({
			cfg: options.config ?? {},
			...defaultAgentId ? { agentId: defaultAgentId } : {}
		});
		const modelRef = `${resolved.provider}/${resolved.model}`;
		candidates.push({
			kind: "existing-model",
			modelRef,
			label: "Current model",
			detail: `${modelRef} — already configured`,
			credentials: true
		});
	}
	const envCandidates = detectAmbientInferenceBackends(env);
	const [claudeProbe, codexProbe, geminiProbe] = await Promise.all([
		probe("claude"),
		probeCodexCommand({
			probe,
			env,
			platform
		}),
		probe("gemini")
	]);
	const cliCandidates = [];
	if (claudeProbe.found && !claudeProbe.timedOut) cliCandidates.push({
		kind: "claude-cli",
		modelRef: CLAUDE_CLI_DEFAULT_MODEL_REF,
		label: "Claude Code",
		detail: "installed; login status unverified"
	});
	if (codexProbe.found && !codexProbe.timedOut) {
		const storedCredentials = readCodex() !== null;
		cliCandidates.push({
			kind: "codex-cli",
			modelRef: CODEX_APP_SERVER_DEFAULT_MODEL_REF,
			label: "Codex",
			detail: storedCredentials ? "installed; stored credentials found; login status unverified" : "installed; login status unverified"
		});
	}
	if (geminiProbe.found && !geminiProbe.timedOut) {
		const credentials = readGemini() !== null ? true : void 0;
		cliCandidates.push({
			kind: "gemini-cli",
			modelRef: GEMINI_CLI_DEFAULT_MODEL_REF,
			label: "Gemini CLI",
			detail: credentials ? "installed; credentials found" : "installed; login status unavailable",
			...credentials === void 0 ? {} : { credentials }
		});
	}
	randomizeClaudeCodexTie(cliCandidates, options.deps?.randomInt ?? randomInt);
	return [
		...candidates,
		...envCandidates,
		...cliCandidates
	];
}
//#endregion
export { detectInferenceBackends as t };
