import { t as CONFIG_DIR } from "./utils-aKqR_F_U.mjs";
import { n as resolveHookEnableState, r as resolveHookEntries, t as resolveHookConfig } from "./policy-D4HXkRoG.mjs";
import { n as hasBinary } from "./config-eval-BOec6g4L.mjs";
import { t as evaluateEntryRequirementsForCurrentPlatform } from "./entry-status-B2j_-Dly.mjs";
import { n as isHookEnvSatisfied, t as isHookConfigPathTruthy } from "./config-VEO9vtlh.mjs";
import { t as loadWorkspaceHookEntries } from "./workspace-B2MW5yrb.mjs";
import { t as isKnownInternalHookEventKey } from "./internal-hook-types-Deg4lhm7.mjs";
import path from "node:path";
//#region src/hooks/hooks-status.ts
function resolveHookKey(entry) {
	return entry.metadata?.hookKey ?? entry.hook.name;
}
function normalizeInstallOptions(entry) {
	const install = entry.metadata?.install ?? [];
	if (install.length === 0) return [];
	return install.map((spec, index) => {
		const id = (spec.id ?? `${spec.kind}-${index}`).trim();
		const bins = spec.bins ?? [];
		let label = (spec.label ?? "").trim();
		if (!label) {
			if (spec.kind === "bundled") label = "Bundled with OpenClaw";
			else if (spec.kind === "npm" && spec.package) label = `Install ${spec.package} (npm)`;
			else if (spec.kind === "git" && spec.repository) label = `Install from ${spec.repository}`;
			else label = "Run installer";
		}
		return {
			id,
			kind: spec.kind,
			label,
			bins
		};
	});
}
function buildHookStatus(entry, config, eligibility) {
	const hookKey = resolveHookKey(entry);
	const hookConfig = resolveHookConfig(config, hookKey);
	const managedByPlugin = entry.hook.source === "openclaw-plugin";
	const enableState = resolveHookEnableState({
		entry,
		config,
		hookConfig
	});
	const always = entry.metadata?.always === true;
	const events = entry.metadata?.events ?? [];
	const unknownEvents = events.filter((event) => !isKnownInternalHookEventKey(event));
	const isEnvSatisfied = (envName) => isHookEnvSatisfied(envName, hookConfig);
	const isConfigSatisfied = (pathStr) => isHookConfigPathTruthy(config, pathStr);
	const { emoji, homepage, required, missing, requirementsSatisfied, configChecks } = evaluateEntryRequirementsForCurrentPlatform({
		always,
		entry,
		hasLocalBin: hasBinary,
		remote: eligibility?.remote,
		isEnvSatisfied,
		isConfigSatisfied
	});
	const enabledByConfig = enableState.enabled;
	const hasEvents = events.length > 0;
	const loadable = enabledByConfig && requirementsSatisfied && hasEvents;
	const blockedReason = enableState.reason ?? (!requirementsSatisfied ? "missing requirements" : hasEvents ? void 0 : "no events defined");
	return {
		name: entry.hook.name,
		description: entry.hook.description,
		source: entry.hook.source,
		pluginId: entry.hook.pluginId,
		filePath: entry.hook.filePath,
		baseDir: entry.hook.baseDir,
		handlerPath: entry.hook.handlerPath,
		hookKey,
		emoji,
		homepage,
		events,
		unknownEvents,
		always,
		enabledByConfig,
		requirementsSatisfied,
		loadable,
		blockedReason,
		managedByPlugin,
		requirements: required,
		missing,
		configChecks,
		install: normalizeInstallOptions(entry)
	};
}
function buildWorkspaceHookStatus(workspaceDir, opts) {
	return {
		workspaceDir,
		managedHooksDir: opts?.managedHooksDir ?? path.join(CONFIG_DIR, "hooks"),
		hooks: resolveHookEntries(opts?.entries ?? loadWorkspaceHookEntries(workspaceDir, opts)).map((entry) => buildHookStatus(entry, opts?.config, opts?.eligibility))
	};
}
//#endregion
export { buildWorkspaceHookStatus as t };
