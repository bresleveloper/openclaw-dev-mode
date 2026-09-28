import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as resolveOsHomeDir } from "./home-dir-D0b-ywue.mjs";
import { S as tryResolveLegacyCompatibilityAgentId, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { a as resolveCodexCliHomePath, n as readCodexCliCredentialsCached, r as readGeminiCliCredentialsCached } from "./cli-credentials-Be2RCYO6.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { n as probeLocalCommand } from "./probes-o7vjc7LA.mjs";
import { i as GEMINI_CLI_DEFAULT_MODEL_REF, n as CLAUDE_CLI_DEFAULT_MODEL_REF, o as detectAmbientInferenceBackends, r as CODEX_APP_SERVER_DEFAULT_MODEL_REF } from "./onboard-inference-ambient-CfQryMAC.mjs";
import path from "node:path";
import os from "node:os";
import { randomInt } from "node:crypto";
//#region src/commands/onboard-inference.ts
const CLI_AUTH_KIND_LABEL = {
	"api-key": "API key (usage-billed)",
	"chatgpt-subscription": "ChatGPT account",
	"claude-subscription": "Claude account",
	token: "OAuth token"
};
function describeCliDetail(state, loginHint) {
	if (state.authKind) {
		const identity = state.authKind === "chatgpt-subscription" || state.authKind === "claude-subscription" ? ` · ${state.email || "email unavailable"}` : "";
		return `logged in · ${CLI_AUTH_KIND_LABEL[state.authKind]}${identity}`;
	}
	if (state.credentials === true) return "logged in · authentication method unavailable";
	if (state.credentials === false) return `installed, not logged in — ${loginHint}, then check again`;
	return "installed";
}
function describeGeminiCliDetail(credentials) {
	return credentials === true ? "installed; credentials found" : "installed; login status unavailable";
}
function randomizeClaudeCodexTie(candidates, pickRandomInt) {
	const claudeIndex = candidates.findIndex((candidate) => candidate.kind === "claude-cli" && candidate.credentials !== false);
	const codexIndex = candidates.findIndex((candidate) => candidate.kind === "codex-cli" && candidate.credentials !== false);
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
/** Detects a native Codex App Server without coupling it to inference selection. */
async function detectNativeCodexAppServer(options = {}) {
	return await probeCodexCommand({
		probe: options.probeLocalCommand ?? probeLocalCommand,
		env: options.env ?? process.env,
		platform: options.platform ?? process.platform
	});
}
/**
* Detect usable inference backends in ladder order. Returns candidates only
* for backends that exist on this machine; explicit setup owns selection.
* Backends that are definitively logged out sink below logged-in and
* unknown ones so a stale install never outranks a working login.
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
		detectNativeCodexAppServer({
			probeLocalCommand: probe,
			env,
			platform
		}),
		probe("gemini")
	]);
	const cliCandidates = [];
	const subscriptionPromotionEligibleCliKinds = /* @__PURE__ */ new Set();
	if (claudeProbe.found && !claudeProbe.timedOut) {
		const loginState = options.deps?.detectClaudeLoginState ? await options.deps.detectClaudeLoginState(probe, claudeProbe.command) : { credentials: void 0 };
		const credentials = loginState.credentials;
		if (credentials === true && loginState.authKind === "claude-subscription") subscriptionPromotionEligibleCliKinds.add("claude-cli");
		const detail = options.deps?.detectClaudeLoginState ? describeCliDetail(loginState, "run `claude auth login`") : "installed; login status unverified";
		cliCandidates.push({
			kind: "claude-cli",
			modelRef: CLAUDE_CLI_DEFAULT_MODEL_REF,
			label: "Claude Code",
			detail,
			...credentials === void 0 ? {} : { credentials }
		});
	}
	if (codexProbe.found && !codexProbe.timedOut) {
		const storedCredentials = readCodex() !== null;
		const credentials = options.deps?.detectCodexLoginState ? await options.deps.detectCodexLoginState(probe, codexProbe.command) : void 0;
		const detail = options.deps?.detectCodexLoginState ? describeCliDetail({ credentials }, "run `codex login`") : storedCredentials ? "installed; stored credentials found; login status unverified" : "installed; login status unverified";
		cliCandidates.push({
			kind: "codex-cli",
			modelRef: CODEX_APP_SERVER_DEFAULT_MODEL_REF,
			label: "Codex",
			detail,
			...credentials === void 0 ? {} : { credentials }
		});
	}
	if (geminiProbe.found && !geminiProbe.timedOut) {
		const credentials = readGemini() !== null ? true : void 0;
		cliCandidates.push({
			kind: "gemini-cli",
			modelRef: GEMINI_CLI_DEFAULT_MODEL_REF,
			label: "Gemini CLI",
			detail: describeGeminiCliDetail(credentials),
			...credentials === void 0 ? {} : { credentials }
		});
	}
	randomizeClaudeCodexTie(cliCandidates, options.deps?.randomInt ?? randomInt);
	const loggedInSubscriptionCliCandidates = cliCandidates.filter((candidate) => candidate.credentials === true && subscriptionPromotionEligibleCliKinds.has(candidate.kind));
	const remainingCliCandidates = cliCandidates.filter((candidate) => !loggedInSubscriptionCliCandidates.includes(candidate));
	candidates.push(...loggedInSubscriptionCliCandidates, ...envCandidates, ...remainingCliCandidates.filter((candidate) => candidate.credentials !== false), ...remainingCliCandidates.filter((candidate) => candidate.credentials === false));
	return candidates;
}
//#endregion
export { detectInferenceBackends as t };
