import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { n as createLazyPromise } from "./lazy-promise-10KxeiYV.js";
import { t as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-CrcykudU.js";
import { s as normalizePluginsConfig } from "./config-state-CtMlHVRM.js";
import { _ as loadPluginRegistrySnapshot, x as createPluginRegistryIdNormalizer } from "./plugin-registry-DPlZjBYT.js";
import { n as listReadOnlyChannelPluginsForConfig } from "./read-only-Bahovy8i.js";
import { t as inspectReadOnlyChannelAccount } from "./read-only-account-inspect-CgbSqm19.js";
import { r as resolveNativeSkillsEnabled } from "./commands-CajPG64P.js";
import { i as readInstalledPackageVersion } from "./package-update-utils-C3sp3Vaw.js";
import { t as listInstalledPluginDirs } from "./installed-plugin-dirs-D-q5WsNE.js";
import path from "node:path";
//#region src/security/audit-plugins-trust.ts
/** Lazily load tool-policy helpers so basic security imports avoid agent policy modules. */
const loadPluginTrustPolicyDeps = createLazyPromise(() => Promise.all([
	import("./config-DavrCb_W.js"),
	import("./tool-policy-DWYbiCnO.js"),
	import("./tool-policy-match-CGNeGQPE.js"),
	import("./tool-policy-DgU6Y2l0.js"),
	import("./sandbox-tool-policy-BYrqJkRT.js")
]).then(([sandboxConfig, sandboxToolPolicy, toolPolicyMatch, toolPolicy, auditToolPolicy]) => ({
	isToolAllowedByPolicies: toolPolicyMatch.isToolAllowedByPolicies,
	pickSandboxToolPolicy: auditToolPolicy.pickSandboxToolPolicy,
	resolveSandboxConfigForAgent: sandboxConfig.resolveSandboxConfigForAgent,
	resolveSandboxToolPolicyForAgent: sandboxToolPolicy.resolveSandboxToolPolicyForAgent,
	resolveToolProfilePolicy: toolPolicy.resolveToolProfilePolicy
})), { cacheRejections: true });
function readChannelCommandSetting(cfg, channelId, key) {
	const channelCfg = cfg.channels?.[channelId];
	if (!channelCfg || typeof channelCfg !== "object" || Array.isArray(channelCfg)) return;
	const commands = channelCfg.commands;
	if (!commands || typeof commands !== "object" || Array.isArray(commands)) return;
	return commands[key];
}
async function isChannelPluginConfigured(cfg, plugin) {
	const accountIds = plugin.config.listAccountIds(cfg);
	const candidates = accountIds.length > 0 ? accountIds : [void 0];
	for (const accountId of candidates) {
		const inspected = plugin.config.inspectAccount?.(cfg, accountId) ?? await inspectReadOnlyChannelAccount({
			channelId: plugin.id,
			cfg,
			accountId
		});
		const inspectedRecord = inspected && typeof inspected === "object" && !Array.isArray(inspected) ? inspected : null;
		let resolvedAccount = inspected;
		if (!resolvedAccount) try {
			resolvedAccount = plugin.config.resolveAccount(cfg, accountId);
		} catch {
			resolvedAccount = null;
		}
		let enabled = typeof inspectedRecord?.enabled === "boolean" ? inspectedRecord.enabled : resolvedAccount != null;
		if (typeof inspectedRecord?.enabled !== "boolean" && resolvedAccount != null && plugin.config.isEnabled) try {
			enabled = plugin.config.isEnabled(resolvedAccount, cfg);
		} catch {
			enabled = false;
		}
		let configured = typeof inspectedRecord?.configured === "boolean" ? inspectedRecord.configured : resolvedAccount != null;
		if (typeof inspectedRecord?.configured !== "boolean" && resolvedAccount != null && plugin.config.isConfigured) try {
			configured = await plugin.config.isConfigured(resolvedAccount, cfg);
		} catch {
			configured = false;
		}
		if (enabled && configured) return true;
	}
	return false;
}
function resolveToolPolicies(params) {
	const profile = params.agentTools?.profile ?? params.cfg.tools?.profile;
	const policies = [
		params.deps.resolveToolProfilePolicy(profile),
		params.deps.pickSandboxToolPolicy(params.cfg.tools ?? void 0),
		params.deps.pickSandboxToolPolicy(params.agentTools)
	];
	if (params.sandboxMode === "all") policies.push(params.deps.resolveSandboxToolPolicyForAgent(params.cfg, params.agentId ?? void 0));
	return policies;
}
function normalizePluginIdSet(entries) {
	return new Set(entries.map((entry) => normalizeOptionalLowercaseString(entry)).filter((entry) => Boolean(entry)));
}
function resolveEnabledExtensionPluginIds(params) {
	const normalized = normalizePluginsConfig(params.cfg.plugins);
	if (!normalized.enabled) return [];
	const allowSet = normalizePluginIdSet(normalized.allow);
	const denySet = normalizePluginIdSet(normalized.deny);
	const entryById = /* @__PURE__ */ new Map();
	for (const [id, entry] of Object.entries(normalized.entries)) {
		const normalizedId = normalizeOptionalLowercaseString(id);
		if (!normalizedId) continue;
		entryById.set(normalizedId, entry);
	}
	const enabled = [];
	for (const id of params.pluginDirs) {
		const normalizedId = normalizeOptionalLowercaseString(id);
		if (!normalizedId) continue;
		if (denySet.has(normalizedId)) continue;
		if (allowSet.size > 0 && !allowSet.has(normalizedId)) continue;
		if (entryById.get(normalizedId)?.enabled === false) continue;
		enabled.push(normalizedId);
	}
	return enabled;
}
function collectAllowEntries(config) {
	const out = [];
	if (Array.isArray(config?.allow)) out.push(...config.allow);
	if (Array.isArray(config?.alsoAllow)) out.push(...config.alsoAllow);
	return out.map((entry) => normalizeOptionalLowercaseString(entry)).filter((entry) => Boolean(entry));
}
function hasExplicitPluginAllow(params) {
	return params.allowEntries.some((entry) => entry === "group:plugins" || params.enabledPluginIds.has(entry));
}
function hasProviderPluginAllow(params) {
	if (!params.byProvider) return false;
	for (const policy of Object.values(params.byProvider)) if (hasExplicitPluginAllow({
		allowEntries: collectAllowEntries(policy),
		enabledPluginIds: params.enabledPluginIds
	})) return true;
	return false;
}
function isPinnedRegistrySpec(spec) {
	const value = spec.trim();
	if (!value) return false;
	const at = value.lastIndexOf("@");
	if (at <= 0 || at >= value.length - 1) return false;
	const version = value.slice(at + 1).trim();
	return /^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version);
}
/** Collect supply-chain and reachable-tool findings for installed plugins and hook packs. */
async function collectPluginsTrustFindings(params) {
	const findings = [];
	const { extensionsDir, pluginDirs } = await listInstalledPluginDirs({ stateDir: params.stateDir });
	if (pluginDirs.length > 0) {
		const allow = params.cfg.plugins?.allow;
		const allowConfigured = Array.isArray(allow) && allow.length > 0;
		if (allowConfigured) {
			const installedPluginIds = new Set(pluginDirs.map((dir) => path.basename(dir).toLowerCase()));
			const pluginIndex = loadPluginRegistrySnapshot({
				config: params.cfg,
				stateDir: params.stateDir
			});
			const normalizePluginId = createPluginRegistryIdNormalizer(pluginIndex);
			const indexedPluginIds = new Set(pluginIndex.plugins.map((plugin) => plugin.pluginId.toLowerCase()));
			const phantomEntries = allow.filter((entry) => {
				if (typeof entry !== "string" || entry === "group:plugins") return false;
				const lower = entry.toLowerCase();
				if (installedPluginIds.has(lower) || indexedPluginIds.has(lower)) return false;
				const canonicalId = normalizeOptionalLowercaseString(normalizePluginId(entry)) ?? "";
				return !canonicalId || !indexedPluginIds.has(canonicalId);
			});
			if (phantomEntries.length > 0) findings.push({
				checkId: "plugins.allow_phantom_entries",
				severity: "warn",
				title: "plugins.allow contains entries with no matching installed plugin",
				detail: `The following plugins.allow entries do not correspond to any installed plugin: ${phantomEntries.join(", ")}.\nPhantom entries could be exploited by registering a new plugin with an allowlisted ID.`,
				remediation: "Remove unused entries from plugins.allow, or verify the expected plugins are installed."
			});
		}
		if (!allowConfigured) {
			const channelPlugins = listReadOnlyChannelPluginsForConfig(params.cfg, { stateDir: params.stateDir });
			const skillCommandsLikelyExposed = (await Promise.all(channelPlugins.map(async (plugin) => {
				if (plugin.capabilities.nativeCommands !== true && plugin.commands?.nativeSkillsAutoEnabled !== true) return false;
				if (!await isChannelPluginConfigured(params.cfg, plugin)) return false;
				return resolveNativeSkillsEnabled({
					providerId: plugin.id,
					providerSetting: readChannelCommandSetting(params.cfg, plugin.id, "nativeSkills"),
					globalSetting: params.cfg.commands?.nativeSkills,
					stateDir: params.stateDir,
					autoDefault: plugin.commands?.nativeSkillsAutoEnabled === true
				});
			}))).some(Boolean);
			findings.push({
				checkId: "plugins.extensions_no_allowlist",
				severity: skillCommandsLikelyExposed ? "critical" : "warn",
				title: "Extensions exist but plugins.allow is not set",
				detail: `Found ${pluginDirs.length} extension(s) under ${extensionsDir}. Without plugins.allow, any discovered plugin id may load (depending on config and plugin behavior).` + (skillCommandsLikelyExposed ? "\nNative skill commands are enabled on at least one configured chat surface; treat unpinned/unallowlisted extensions as high risk." : ""),
				remediation: "Set plugins.allow to an explicit list of plugin ids you trust."
			});
		}
		const enabledExtensionPluginIds = resolveEnabledExtensionPluginIds({
			cfg: params.cfg,
			pluginDirs
		});
		if (enabledExtensionPluginIds.length > 0) {
			const deps = await loadPluginTrustPolicyDeps();
			const enabledPluginSet = new Set(enabledExtensionPluginIds);
			const contexts = [{ label: "default" }];
			for (const entry of params.cfg.agents?.list ?? []) {
				if (!entry || typeof entry !== "object" || typeof entry.id !== "string") continue;
				contexts.push({
					label: `agents.list.${entry.id}`,
					agentId: entry.id,
					tools: entry.tools
				});
			}
			const permissiveContexts = [];
			for (const context of contexts) {
				const profile = context.tools?.profile ?? params.cfg.tools?.profile;
				const restrictiveProfile = Boolean(deps.resolveToolProfilePolicy(profile));
				const sandboxMode = deps.resolveSandboxConfigForAgent(params.cfg, context.agentId).mode;
				const policies = resolveToolPolicies({
					cfg: params.cfg,
					deps,
					agentTools: context.tools,
					sandboxMode,
					agentId: context.agentId
				});
				const broadPolicy = deps.isToolAllowedByPolicies("__openclaw_plugin_probe__", policies);
				const explicitPluginAllow = !restrictiveProfile && (hasExplicitPluginAllow({
					allowEntries: collectAllowEntries(params.cfg.tools),
					enabledPluginIds: enabledPluginSet
				}) || hasProviderPluginAllow({
					byProvider: params.cfg.tools?.byProvider,
					enabledPluginIds: enabledPluginSet
				}) || hasExplicitPluginAllow({
					allowEntries: collectAllowEntries(context.tools),
					enabledPluginIds: enabledPluginSet
				}) || hasProviderPluginAllow({
					byProvider: context.tools?.byProvider,
					enabledPluginIds: enabledPluginSet
				}));
				if (broadPolicy || explicitPluginAllow) permissiveContexts.push(context.label);
			}
			if (permissiveContexts.length > 0) findings.push({
				checkId: "plugins.tools_reachable_permissive_policy",
				severity: "warn",
				title: "Extension plugin tools may be reachable under permissive tool policy",
				detail: `Enabled extension plugins: ${enabledExtensionPluginIds.join(", ")}.\nPermissive tool policy contexts:\n${permissiveContexts.map((entry) => `- ${entry}`).join("\n")}`,
				remediation: "Use restrictive profiles (`minimal`/`coding`) or explicit tool allowlists that exclude plugin tools for agents handling untrusted input."
			});
		}
	}
	const pluginInstalls = await loadInstalledPluginIndexInstallRecords({ stateDir: params.stateDir });
	const npmPluginInstalls = Object.entries(pluginInstalls).filter(([, record]) => record?.source === "npm");
	if (npmPluginInstalls.length > 0) {
		const unpinned = npmPluginInstalls.filter(([, record]) => typeof record.spec === "string" && !isPinnedRegistrySpec(record.spec)).map(([pluginId, record]) => `${pluginId} (${record.spec})`);
		if (unpinned.length > 0) findings.push({
			checkId: "plugins.installs_unpinned_npm_specs",
			severity: "warn",
			title: "Plugin index includes unpinned npm specs",
			detail: `Unpinned plugin index install records:\n${unpinned.map((entry) => `- ${entry}`).join("\n")}`,
			remediation: "Pin install specs to exact versions (for example, `@scope/pkg@1.2.3`) for higher supply-chain stability."
		});
		const missingIntegrity = npmPluginInstalls.filter(([, record]) => typeof record.integrity !== "string" || record.integrity.trim() === "").map(([pluginId]) => pluginId);
		if (missingIntegrity.length > 0) findings.push({
			checkId: "plugins.installs_missing_integrity",
			severity: "warn",
			title: "Plugin index is missing integrity metadata",
			detail: `Plugin index records missing integrity:\n${missingIntegrity.map((entry) => `- ${entry}`).join("\n")}`,
			remediation: "Reinstall or update plugins to refresh install metadata with resolved integrity hashes."
		});
		const pluginVersionDrift = [];
		for (const [pluginId, record] of npmPluginInstalls) {
			const recordedVersion = record.resolvedVersion ?? record.version;
			if (!recordedVersion) continue;
			const installedVersion = await readInstalledPackageVersion(record.installPath ?? path.join(params.stateDir, "extensions", pluginId));
			if (!installedVersion || installedVersion === recordedVersion) continue;
			pluginVersionDrift.push(`${pluginId} (recorded ${recordedVersion}, installed ${installedVersion})`);
		}
		if (pluginVersionDrift.length > 0) findings.push({
			checkId: "plugins.installs_version_drift",
			severity: "warn",
			title: "Plugin index records drift from installed package versions",
			detail: `Detected plugin install metadata drift:\n${pluginVersionDrift.map((entry) => `- ${entry}`).join("\n")}`,
			remediation: "Run `openclaw plugins update --all` (or reinstall affected plugins) to refresh install metadata."
		});
	}
	const hookInstalls = params.cfg.hooks?.internal?.installs ?? {};
	const npmHookInstalls = Object.entries(hookInstalls).filter(([, record]) => record?.source === "npm");
	if (npmHookInstalls.length > 0) {
		const unpinned = npmHookInstalls.filter(([, record]) => typeof record.spec === "string" && !isPinnedRegistrySpec(record.spec)).map(([hookId, record]) => `${hookId} (${record.spec})`);
		if (unpinned.length > 0) findings.push({
			checkId: "hooks.installs_unpinned_npm_specs",
			severity: "warn",
			title: "Hook installs include unpinned npm specs",
			detail: `Unpinned hook install records:\n${unpinned.map((entry) => `- ${entry}`).join("\n")}`,
			remediation: "Pin hook install specs to exact versions (for example, `@scope/pkg@1.2.3`) for higher supply-chain stability."
		});
		const missingIntegrity = npmHookInstalls.filter(([, record]) => typeof record.integrity !== "string" || record.integrity.trim() === "").map(([hookId]) => hookId);
		if (missingIntegrity.length > 0) findings.push({
			checkId: "hooks.installs_missing_integrity",
			severity: "warn",
			title: "Hook installs are missing integrity metadata",
			detail: `Hook install records missing integrity:\n${missingIntegrity.map((entry) => `- ${entry}`).join("\n")}`,
			remediation: "Reinstall or update hooks to refresh install metadata with resolved integrity hashes."
		});
		const hookVersionDrift = [];
		for (const [hookId, record] of npmHookInstalls) {
			const recordedVersion = record.resolvedVersion ?? record.version;
			if (!recordedVersion) continue;
			const installedVersion = await readInstalledPackageVersion(record.installPath ?? path.join(params.stateDir, "hooks", hookId));
			if (!installedVersion || installedVersion === recordedVersion) continue;
			hookVersionDrift.push(`${hookId} (recorded ${recordedVersion}, installed ${installedVersion})`);
		}
		if (hookVersionDrift.length > 0) findings.push({
			checkId: "hooks.installs_version_drift",
			severity: "warn",
			title: "Hook install records drift from installed package versions",
			detail: `Detected hook install metadata drift:\n${hookVersionDrift.map((entry) => `- ${entry}`).join("\n")}`,
			remediation: "Run `openclaw hooks update --all` (or reinstall affected hooks) to refresh install metadata."
		});
	}
	return findings;
}
//#endregion
export { collectPluginsTrustFindings as t };
