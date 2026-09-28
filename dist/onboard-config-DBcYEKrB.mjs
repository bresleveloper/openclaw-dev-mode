import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { E as listAgentEntries } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import { t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { r as isDevMode } from "./globals-QODkv80i.mjs";
import { r as setConfigValueAtPath } from "./config-paths-BKljx7kX.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/onboard-config.ts
/** Shared config mutations used by interactive and non-interactive onboarding. */
/** Default tool profile selected during local onboarding. */
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
/** Detects a workspace change that could remap an existing agent fleet. */
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
/** Applies local gateway/workspace defaults without overwriting explicit user defaults. */
function applyLocalSetupWorkspaceConfig(baseConfig, workspaceDir, options = {}) {
	const workspaceConflict = resolveOnboardingWorkspaceConflict(baseConfig, workspaceDir, options.env);
	const hasRoster = listAgentEntries(baseConfig).length > 0;
	const shouldUpdateWorkspace = !options.preserveWorkspace && (options.allowWorkspaceChange || !hasRoster && !workspaceConflict);
	return inheritLegacyDefaultAgentId(baseConfig, {
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
	});
}
/** Marks default agents to skip bootstrap file creation. */
function applySkipBootstrapConfig(cfg) {
	const next = structuredClone(cfg);
	setConfigValueAtPath(next, [
		"agents",
		"defaults",
		"skipBootstrap"
	], true);
	return inheritLegacyDefaultAgentId(cfg, next);
}
//#endregion
export { applySkipBootstrapConfig as n, resolveOnboardingWorkspaceConflict as r, applyLocalSetupWorkspaceConfig as t };
