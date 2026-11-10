import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-BccyWLRI.mjs";
import "./workspace-default-BjEaT57h.mjs";
import { r as setConfigValueAtPath } from "./config-paths-BvomE-N1.mjs";
import { r as isDevMode } from "./globals-XVSoVbNQ.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/onboard-config.ts
const ONBOARDING_DEFAULT_TOOLS_PROFILE = "full";
function hasExistingAgentState(env) {
	const stateDir = resolveStateDir(env);
	const agentsDir = path.join(stateDir, "agents");
	try {
		if (fs.readdirSync(agentsDir, { withFileTypes: true }).some((entry) => entry.isDirectory())) return true;
	} catch (error) {
		if (error.code !== "ENOENT") return true;
	}
	return [path.join(stateDir, "agent"), path.join(stateDir, "sessions")].some((candidate) => {
		try {
			return fs.statSync(candidate).isDirectory();
		} catch (error) {
			return error.code !== "ENOENT";
		}
	});
}
function resolveOnboardingWorkspaceConflict(baseConfig, requestedWorkspaceDir, env = process.env) {
	const configuredWorkspace = baseConfig.agents?.defaults?.workspace?.trim();
	const currentWorkspaceDir = configuredWorkspace ? resolveUserPath(configuredWorkspace, env) : resolveDefaultAgentWorkspaceDir(env);
	const normalizedCurrent = path.resolve(currentWorkspaceDir);
	const normalizedRequested = path.resolve(resolveUserPath(requestedWorkspaceDir, env));
	if (normalizedCurrent === normalizedRequested) return;
	if (!(listAgentEntries(baseConfig).length > 0) && !(configuredWorkspace && hasExistingAgentState(env))) return;
	return {
		currentWorkspaceDir: normalizedCurrent,
		requestedWorkspaceDir: normalizedRequested
	};
}
function applyLocalSetupWorkspaceConfig(baseConfig, workspaceDir, options = {}) {
	const workspaceConflict = resolveOnboardingWorkspaceConflict(baseConfig, workspaceDir, options.env);
	const hasRoster = listAgentEntries(baseConfig).length > 0;
	const shouldUpdateWorkspace = !options.preserveWorkspace && (options.allowWorkspaceChange || !hasRoster && !workspaceConflict);
	return {
		...baseConfig,
		...shouldUpdateWorkspace ? { agents: {
			...baseConfig.agents,
			defaults: {
				...baseConfig.agents?.defaults,
				workspace: workspaceDir
			}
		} } : {},
		gateway: {
			...baseConfig.gateway,
			mode: "local"
		},
		tools: {
			...baseConfig.tools,
			profile: isDevMode() ? baseConfig.tools?.profile : baseConfig.tools?.profile ?? ONBOARDING_DEFAULT_TOOLS_PROFILE
		}
	};
}
function applySkipBootstrapConfig(cfg) {
	const next = structuredClone(cfg);
	setConfigValueAtPath(next, [
		"agents",
		"defaults",
		"skipBootstrap"
	], true);
	return next;
}
//#endregion
export { applySkipBootstrapConfig as n, resolveOnboardingWorkspaceConflict as r, applyLocalSetupWorkspaceConfig as t };
