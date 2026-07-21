import { i as GEMINI_CLI_DEFAULT_MODEL_REF, n as CLAUDE_CLI_DEFAULT_MODEL_REF, r as CODEX_APP_SERVER_DEFAULT_MODEL_REF } from "./onboard-inference-DmVigg0r.js";
//#region src/crestodian/assistant-backends.ts
function splitModelRef(modelRef) {
	const slash = modelRef.indexOf("/");
	return {
		provider: modelRef.slice(0, slash),
		model: modelRef.slice(slash + 1)
	};
}
const CLAUDE_CLI_BACKEND = {
	kind: "claude-cli",
	label: CLAUDE_CLI_DEFAULT_MODEL_REF,
	runner: "cli",
	...splitModelRef(CLAUDE_CLI_DEFAULT_MODEL_REF),
	buildConfig: (workspaceDir) => buildCliPlannerConfig(workspaceDir, CLAUDE_CLI_DEFAULT_MODEL_REF)
};
const CODEX_APP_SERVER_BACKEND = {
	kind: "codex-app-server",
	label: `${CODEX_APP_SERVER_DEFAULT_MODEL_REF} via codex`,
	runner: "embedded",
	...splitModelRef(CODEX_APP_SERVER_DEFAULT_MODEL_REF),
	buildConfig: buildCodexAppServerPlannerConfig
};
const GEMINI_CLI_BACKEND = {
	kind: "gemini-cli",
	label: GEMINI_CLI_DEFAULT_MODEL_REF,
	runner: "cli",
	...splitModelRef(GEMINI_CLI_DEFAULT_MODEL_REF),
	buildConfig: (workspaceDir) => buildCliPlannerConfig(workspaceDir, GEMINI_CLI_DEFAULT_MODEL_REF)
};
/** Select local assistant planner backends available for the current overview. */
function selectCrestodianLocalPlannerBackends(overview) {
	const backends = [];
	if (overview.tools.claude.found) backends.push(CLAUDE_CLI_BACKEND);
	if (overview.tools.codex.found) backends.push(CODEX_APP_SERVER_BACKEND);
	if (overview.tools.gemini.found) backends.push(GEMINI_CLI_BACKEND);
	return backends;
}
/** Minimal run config for a CLI-harness model scoped to one workspace. */
function buildCliPlannerConfig(workspaceDir, modelRef) {
	return { agents: { defaults: {
		workspace: workspaceDir,
		model: { primary: modelRef }
	} } };
}
/** Run config for the Codex app-server harness (exec must be allowed to spawn it). */
function buildCodexAppServerPlannerConfig(workspaceDir) {
	return {
		agents: { defaults: {
			workspace: workspaceDir,
			model: { primary: CODEX_APP_SERVER_DEFAULT_MODEL_REF }
		} },
		plugins: { entries: { codex: { enabled: true } } },
		tools: { exec: { mode: "full" } }
	};
}
//#endregion
export { buildCodexAppServerPlannerConfig as n, selectCrestodianLocalPlannerBackends as r, buildCliPlannerConfig as t };
