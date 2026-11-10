import { r as resolveOsHomeDir } from "./home-dir-AB7ik58U.mjs";
import "./home-dir-CtsdYvX3.mjs";
import { E as tryResolveLegacyCompatibilityAgentId, r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-CeM8o97s.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import "./legacy.default-agent-owner-Blrs2q29.mjs";
import { _ as resolveConfiguredRouteModelLabel } from "./model-selection-shared-CVU_V2PQ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { i as readGeminiCliCredentialsCached, o as resolveCodexCliHomePath, t as hasCodexCliAuthFile } from "./cli-credentials-DmMCeh52.mjs";
import { n as probeLocalCommand } from "./probes-n_i6fIlF.mjs";
import { i as GEMINI_CLI_DEFAULT_MODEL_REF, n as CLAUDE_CLI_DEFAULT_MODEL_REF, o as detectAmbientInferenceBackends, r as CODEX_APP_SERVER_DEFAULT_MODEL_REF } from "./onboard-inference-ambient-Kk-cufr9.mjs";
import os from "node:os";
import path from "node:path";
//#region src/commands/onboard-inference.ts
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
	const hasCodexLogin = options.deps?.hasCodexCliAuthFile ?? (() => {
		if (!resolveOsHomeDir(env, env === process.env ? os.homedir : () => "") && !env.CODEX_HOME?.trim()) return false;
		return hasCodexCliAuthFile(resolveCodexCliHomePath(void 0, env));
	});
	const readGemini = options.deps?.readGeminiCliCredentials ?? (() => readGeminiCliCredentialsCached({ ttlMs: 6e4 }));
	const candidates = [];
	const defaultAgentId = options.config ? options.agentId?.trim() || tryResolveLegacyCompatibilityAgentId(options.config) : void 0;
	const defaultAgentModel = options.config && defaultAgentId ? resolveAgentConfig(options.config, defaultAgentId)?.model : void 0;
	const existingModel = resolveAgentModelPrimaryValue(defaultAgentModel) ?? resolveAgentModelPrimaryValue(options.config?.agents?.defaults?.model);
	if (existingModel) {
		const resolved = resolveDefaultModelForAgent({
			cfg: options.config ?? {},
			...defaultAgentId ? { agentId: defaultAgentId } : {}
		});
		const profileId = splitTrailingAuthProfile(existingModel).profile;
		const modelRef = resolveConfiguredRouteModelLabel({
			configuredRef: existingModel,
			resolved,
			...profileId ? { profileId } : {}
		});
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
	const storedCodexCredentials = hasCodexLogin();
	if (codexProbe.found && !codexProbe.timedOut || storedCodexCredentials) cliCandidates.push({
		kind: "codex-cli",
		modelRef: CODEX_APP_SERVER_DEFAULT_MODEL_REF,
		label: "Codex",
		detail: storedCodexCredentials ? codexProbe.found && !codexProbe.timedOut ? "installed; stored credentials found; login status unverified" : "stored credentials found; runtime installation required" : "installed; login status unverified",
		credentials: storedCodexCredentials
	});
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
	return [
		...candidates,
		...envCandidates,
		...cliCandidates
	];
}
//#endregion
export { detectInferenceBackends as t };
