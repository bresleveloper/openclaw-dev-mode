import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { c as CODEX_PLUGINS_MARKETPLACE_NAME, i as pluginReadParams, n as isOpenAiCuratedMarketplace } from "./plugin-inventory-BoRei8Z4.mjs";
import { a as defaultCodexAppInventoryCache, r as buildCodexPluginAppCacheKey } from "./plugin-app-cache-key-B2CsSdnV.mjs";
import { o as withCodexAppServerJsonClient } from "./request-D2L0zMrq.mjs";
import "./config-BoTP_mrL.mjs";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { isPathInside } from "openclaw/plugin-sdk/file-access-runtime";
import { coerceErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { pathExists } from "openclaw/plugin-sdk/security-runtime";
import { readJsonFileWithFallback } from "openclaw/plugin-sdk/json-store";
//#region extensions/codex/src/migration/helpers.ts
async function exists(filePath) {
	return await pathExists(filePath);
}
async function isDirectory(filePath) {
	if (!filePath) return false;
	try {
		return (await fs.stat(filePath)).isDirectory();
	} catch {
		return false;
	}
}
function resolveUserHomeDir() {
	return process.env.HOME?.trim() || os.homedir();
}
function resolveHomePath(value) {
	if (value === "~") return resolveUserHomeDir();
	if (value.startsWith("~/")) return path.join(resolveUserHomeDir(), value.slice(2));
	return path.resolve(value);
}
function sanitizeName(value) {
	return value.trim().toLowerCase().replaceAll(/[^a-z0-9._-]+/gu, "-").replaceAll(/^-+|-+$/gu, "").slice(0, 64);
}
async function readJsonObject(filePath) {
	if (!filePath) return {};
	const { value: parsed } = await readJsonFileWithFallback(filePath, {});
	return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
}
//#endregion
//#region extensions/codex/src/migration/source-files.ts
const SKILL_FILENAME = "SKILL.md";
const MAX_SCAN_DEPTH = 6;
const MAX_DISCOVERED_DIRS = 2e3;
async function safeReadDir(dir) {
	return await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
}
async function discoverSkillDirs(params) {
	if (!params.root || !await isDirectory(params.root)) return [];
	const discovered = [];
	async function visit(dir, depth) {
		if (discovered.length >= MAX_DISCOVERED_DIRS || depth > MAX_SCAN_DEPTH) return;
		const name = path.basename(dir);
		if (params.excludeSystem && depth === 1 && name === ".system") return;
		if (await exists(path.join(dir, SKILL_FILENAME))) {
			discovered.push({
				name,
				source: dir,
				sourceLabel: params.sourceLabel
			});
			return;
		}
		for (const entry of await safeReadDir(dir)) if (entry.isDirectory()) await visit(path.join(dir, entry.name), depth + 1);
	}
	await visit(params.root, 0);
	return discovered;
}
async function discoverPluginDirs(codexHome) {
	const root = path.join(codexHome, "plugins", "cache");
	if (!await isDirectory(root)) return [];
	const discovered = /* @__PURE__ */ new Map();
	async function visit(dir, depth) {
		if (discovered.size >= MAX_DISCOVERED_DIRS || depth > MAX_SCAN_DEPTH) return;
		const manifestPath = path.join(dir, ".codex-plugin", "plugin.json");
		if (await exists(manifestPath)) {
			const manifest = await readJsonObject(manifestPath);
			const manifestName = typeof manifest.name === "string" ? manifest.name.trim() : "";
			discovered.set(dir, {
				name: manifestName || path.basename(dir),
				source: dir,
				migratable: false,
				message: "Cached Codex plugin bundle found. Review manually unless the plugin is also installed in the source Codex app-server inventory"
			});
			return;
		}
		for (const entry of await safeReadDir(dir)) if (entry.isDirectory()) await visit(path.join(dir, entry.name), depth + 1);
	}
	await visit(root, 0);
	return [...discovered.values()].toSorted((a, b) => a.source.localeCompare(b.source));
}
async function discoverCodexMemoryFile(candidate) {
	try {
		const stat = await fs.lstat(candidate.path);
		if (stat.isSymbolicLink()) throw new Error(`Codex memory source must not be a symbolic link: ${candidate.path}`);
		if (!stat.isFile()) throw new Error(`Codex memory source must be a regular file: ${candidate.path}`);
		return candidate;
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return;
		throw error;
	}
}
async function discoverCodexMemorySources(codexHome) {
	const memoriesDir = path.join(codexHome, "memories");
	return (await Promise.all([{
		id: "memory:codex:MEMORY.md",
		label: "Codex consolidated memory",
		name: "MEMORY.md"
	}, {
		id: "memory:codex:memory_summary.md",
		label: "Codex memory summary",
		name: "memory_summary.md"
	}].map(async (candidate) => await discoverCodexMemoryFile({
		id: candidate.id,
		label: candidate.label,
		path: path.join(memoriesDir, candidate.name)
	})))).filter((entry) => entry !== void 0);
}
//#endregion
//#region extensions/codex/src/migration/source.ts
var source_exports = /* @__PURE__ */ __exportAll({
	codexPluginMigrationSubscriptionWarning: () => codexPluginMigrationSubscriptionWarning,
	defaultCodexHome: () => defaultCodexHome,
	discoverCodexSource: () => discoverCodexSource,
	hasCodexSource: () => hasCodexSource
});
function defaultCodexHome() {
	const configuredHome = process.env.CODEX_HOME;
	return resolveHomePath(configuredHome !== void 0 && configuredHome.length > 0 ? configuredHome : "~/.codex");
}
function personalAgentsSkillsDir() {
	return path.join(resolveUserHomeDir(), ".agents", "skills");
}
async function discoverInstalledCuratedPlugins(codexHome, options = {}) {
	const startOptions = sourceCodexAppServerStartOptions(codexHome);
	try {
		return await withCodexAppServerJsonClient({
			timeoutMs: 6e4,
			startOptions,
			authProfileId: null,
			isolated: true
		}, async (request) => {
			const requestOptions = {
				startOptions,
				request
			};
			const response = await request({
				method: "plugin/installed",
				requestParams: { cwds: [] }
			});
			const curatedSyncRoot = path.join(codexHome, ".tmp", "plugins");
			const curatedMarketplaceErrors = response.marketplaceLoadErrors.filter((error) => isPathInside(curatedSyncRoot, error.marketplacePath));
			if (curatedMarketplaceErrors.length > 0) return {
				plugins: [],
				error: curatedMarketplaceErrors.map((error) => error.message).join("; ")
			};
			const installed = discoverInstalledCuratedPluginSources(response);
			return { plugins: (options.evaluatePluginMigrationEligibility === true ? await withPluginMigrationEligibility({
				plugins: installed,
				requestOptions,
				verifyPluginApps: options.verifyPluginApps === true
			}) : installed.map(({ plugin }) => plugin)).toSorted((left, right) => (left.pluginName ?? left.name).localeCompare(right.pluginName ?? right.name)) };
		});
	} catch (error) {
		return {
			plugins: [],
			error: coerceErrorMessage(error)
		};
	}
}
function sourceCodexAppServerStartOptions(codexHome) {
	return {
		transport: "stdio",
		command: "codex",
		commandSource: "managed",
		managedCommandOrder: "desktop-first",
		args: [
			"app-server",
			"--listen",
			"stdio://"
		],
		headers: {},
		env: {
			CODEX_HOME: codexHome,
			HOME: path.dirname(codexHome)
		}
	};
}
function buildInstalledPluginSource(plugin) {
	const pluginName = pluginNameFromSummary(plugin);
	if (!pluginName) return;
	return {
		name: plugin.name,
		pluginName,
		marketplaceName: CODEX_PLUGINS_MARKETPLACE_NAME,
		source: `${CODEX_PLUGINS_MARKETPLACE_NAME}/${pluginName}`,
		migratable: true,
		installed: plugin.installed,
		enabled: plugin.enabled
	};
}
function discoverInstalledCuratedPluginSources(response) {
	const installedByName = /* @__PURE__ */ new Map();
	for (const marketplace of response.marketplaces) {
		if (!isOpenAiCuratedMarketplace(marketplace)) continue;
		const remote = !marketplace.path;
		for (const summary of marketplace.plugins) {
			if (!summary.installed) continue;
			const plugin = buildInstalledPluginSource(summary);
			if (!plugin?.pluginName) continue;
			const existing = installedByName.get(plugin.pluginName);
			if (existing && (!remote || existing.remote)) continue;
			installedByName.set(plugin.pluginName, {
				plugin,
				marketplace: marketplaceRef(marketplace),
				...remote ? { readPluginName: summary.remotePluginId?.trim() || void 0 } : { readPluginName: plugin.pluginName },
				remote
			});
		}
	}
	return Array.from(installedByName.values());
}
function marketplaceRef(marketplace) {
	return {
		name: CODEX_PLUGINS_MARKETPLACE_NAME,
		...marketplace.path ? { path: marketplace.path } : {},
		...!marketplace.path ? { remoteMarketplaceName: marketplace.name } : {}
	};
}
async function withPluginMigrationEligibility(params) {
	const pending = [];
	const evaluated = [];
	for (const { plugin, marketplace, readPluginName } of params.plugins) {
		if (plugin.enabled !== true) {
			evaluated.push({
				...plugin,
				migratable: false,
				migrationBlock: { code: "plugin_disabled" },
				message: `Codex plugin "${plugin.pluginName ?? plugin.name}" is installed in Codex but disabled; enable it in Codex before migrating it to OpenClaw.`
			});
			continue;
		}
		const detail = await readPluginDetail(params.requestOptions, marketplace, plugin, readPluginName);
		if (!detail.ok) {
			evaluated.push({
				...plugin,
				migratable: false,
				migrationBlock: {
					code: "plugin_read_unavailable",
					error: detail.error
				},
				message: `Codex plugin "${plugin.pluginName ?? plugin.name}" detail could not be read: ${detail.error}`
			});
			continue;
		}
		if (detail.detail.apps.length === 0) {
			evaluated.push({
				...plugin,
				migratable: true
			});
			continue;
		}
		const apps = detail.detail.apps.map(sourcePluginAppFact).toSorted((left, right) => left.id.localeCompare(right.id));
		pending.push({
			plugin,
			apps
		});
	}
	if (pending.length === 0) return evaluated;
	let sourceAccount;
	let sourceAccountError;
	try {
		sourceAccount = await readSourceCodexAccount(params.requestOptions);
		if (sourceAccount === "missing") sourceAccountError = "Codex app-server did not report an authenticated source account.";
	} catch (error) {
		sourceAccountError = coerceErrorMessage(error);
	}
	if (sourceAccountError && !params.verifyPluginApps) {
		for (const { plugin, apps } of pending) evaluated.push({
			...plugin,
			migratable: false,
			migrationBlock: {
				code: "codex_account_unavailable",
				apps,
				error: sourceAccountError
			},
			message: `Codex plugin "${plugin.pluginName ?? plugin.name}" owns apps, but the source Codex app-server account could not be read: ${sourceAccountError}`
		});
		return evaluated;
	}
	if (sourceAccount === "non_chatgpt") {
		for (const { plugin, apps } of pending) evaluated.push({
			...plugin,
			migratable: false,
			migrationBlock: {
				code: "codex_subscription_required",
				apps
			},
			message: codexSubscriptionRequiredMessage(plugin)
		});
		return evaluated;
	}
	if (!params.verifyPluginApps) {
		for (const { plugin, apps } of pending) evaluated.push({
			...plugin,
			apps,
			migratable: true
		});
		return evaluated;
	}
	const snapshot = await refreshSourceAppInventory(params.requestOptions).catch((error) => {
		const message = coerceErrorMessage(error);
		for (const { plugin, apps } of pending) evaluated.push({
			...plugin,
			migratable: false,
			migrationBlock: {
				code: "app_inventory_unavailable",
				apps,
				error: message
			},
			message: `Codex plugin "${plugin.pluginName ?? plugin.name}" owns apps, but source app inventory could not be read: ${message}`
		});
	});
	if (!snapshot) return evaluated;
	const appInfoById = new Map(snapshot.apps.map((app) => [app.id, app]));
	const installedAppsById = new Map(snapshot.installedApps.map((app) => [app.id, app]));
	for (const { plugin, apps: declaredApps } of pending) {
		const apps = declaredApps.map((app) => sourcePluginAppFactWithInventory(app, appInfoById.get(app.id), installedAppsById.get(app.id))).toSorted((left, right) => left.id.localeCompare(right.id));
		const blockCode = migrationBlockCodeForApps(apps);
		if (!blockCode) {
			evaluated.push({
				...plugin,
				apps,
				migratable: true
			});
			continue;
		}
		evaluated.push({
			...plugin,
			migratable: false,
			migrationBlock: {
				code: blockCode,
				apps
			},
			message: appInventoryBlockMessage(plugin, apps, blockCode)
		});
	}
	return evaluated;
}
async function readSourceCodexAccount(options) {
	const response = await options.request({
		method: "account/read",
		requestParams: { refreshToken: false }
	});
	if (!response.account || typeof response.account !== "object" || Array.isArray(response.account)) return "missing";
	switch (response.account.type) {
		case "chatgpt": return "chatgpt";
		case "apiKey":
		case "amazonBedrock": return "non_chatgpt";
		default: return "missing";
	}
}
async function readPluginDetail(options, marketplace, plugin, readPluginName) {
	if (!readPluginName) return {
		ok: false,
		error: `Codex remote plugin "${plugin.pluginName ?? plugin.name}" has no readable remote plugin id.`
	};
	try {
		return {
			ok: true,
			detail: (await options.request({
				method: "plugin/read",
				requestParams: pluginReadParams(marketplace, readPluginName)
			})).plugin
		};
	} catch (error) {
		return {
			ok: false,
			error: coerceErrorMessage(error)
		};
	}
}
async function refreshSourceAppInventory(options) {
	const key = buildCodexPluginAppCacheKey({ appServer: { start: options.startOptions } });
	const request = async (method, requestParams) => await options.request({
		method,
		requestParams
	});
	return await defaultCodexAppInventoryCache.refreshNow({
		key,
		request,
		forceRefetch: true
	});
}
function sourcePluginAppFact(app) {
	return {
		id: app.id,
		name: app.name
	};
}
function sourcePluginAppFactWithInventory(app, info, installedApp) {
	if (!installedApp) return app;
	if (!info) return installedApp.enabled ? {
		...app,
		isAccessible: false,
		isEnabled: true
	} : {
		...app,
		isEnabled: false
	};
	if (!installedApp.enabled) return {
		...app,
		isAccessible: true,
		isEnabled: false
	};
	return {
		...app,
		isAccessible: installedApp.callable,
		isEnabled: installedApp.enabled,
		...!installedApp.callable ? { isCallable: false } : {}
	};
}
function migrationBlockCodeForApps(apps) {
	if (apps.some((app) => app.isAccessible === false)) return "app_inaccessible";
	if (apps.some((app) => app.isEnabled === false)) return "app_disabled";
	if (apps.some((app) => app.isAccessible === void 0 || app.isEnabled === void 0)) return "app_missing";
}
function appInventoryBlockMessage(plugin, apps, code) {
	const status = code === "app_inaccessible" ? apps.some((app) => app.isCallable === false) ? "not callable" : "inaccessible" : code === "app_disabled" ? "disabled" : "missing";
	const blocking = apps.find((app) => code === "app_inaccessible" ? app.isAccessible === false : code === "app_disabled" ? app.isEnabled === false : app.isAccessible === void 0 || app.isEnabled === void 0) ?? apps[0];
	const appLabel = blocking ? ` app "${blocking.name}"` : " an owned app";
	return `Codex plugin "${plugin.pluginName ?? plugin.name}" owns${appLabel} but the source app inventory reports it is ${status}; authenticate or enable the app in Codex before migrating it to OpenClaw.`;
}
function codexPluginMigrationSubscriptionWarning() {
	return "Codex app-backed plugin migration requires the Codex app-server source account to be logged in with a ChatGPT subscription account. Log in to the Codex app with subscription auth; OpenClaw auth or API-key auth does not satisfy Codex app connector access.";
}
function codexSubscriptionRequiredMessage(plugin) {
	return `Codex plugin "${plugin.pluginName ?? plugin.name}" owns apps, but ${codexPluginMigrationSubscriptionWarning()}`;
}
function pluginNameFromSummary(summary) {
	const candidates = [summary.name, summary.id];
	for (const candidate of candidates) {
		const trimmed = candidate.trim();
		if (!trimmed) continue;
		const marketplaceSuffix = [
			`@${CODEX_PLUGINS_MARKETPLACE_NAME}-remote`,
			`@openai-api-curated`,
			`@${CODEX_PLUGINS_MARKETPLACE_NAME}`
		].find((suffix) => trimmed.endsWith(suffix));
		const normalized = ((marketplaceSuffix ? trimmed.slice(0, -marketplaceSuffix.length) : trimmed).split("/").at(-1)?.trim())?.toLowerCase().replaceAll(/\s+/gu, "-");
		if (normalized) return normalized;
	}
}
async function discoverCodexSource(options = {}) {
	const codexHome = resolveHomePath(options.input?.trim() || defaultCodexHome());
	const codexSkillsDir = path.join(codexHome, "skills");
	const agentsSkillsDir = personalAgentsSkillsDir();
	const configPath = path.join(codexHome, "config.toml");
	const authPath = path.join(codexHome, "auth.json");
	const modelsCachePath = path.join(codexHome, "models_cache.json");
	const hooksPath = path.join(codexHome, "hooks", "hooks.json");
	const skipAssets = options.memoryOnly === true || options.authOnly === true;
	const memoryFiles = options.authOnly ? [] : await discoverCodexMemorySources(codexHome);
	const codexSkills = skipAssets ? [] : await discoverSkillDirs({
		root: codexSkillsDir,
		sourceLabel: "Codex skill",
		excludeSystem: true
	});
	const personalAgentSkills = skipAssets ? [] : await discoverSkillDirs({
		root: agentsSkillsDir,
		sourceLabel: "personal AgentSkill"
	});
	const sourcePluginDiscovery = skipAssets ? { plugins: [] } : await discoverInstalledCuratedPlugins(codexHome, options);
	const sourcePluginNames = new Set(sourcePluginDiscovery.plugins.flatMap((plugin) => plugin.pluginName ? [plugin.pluginName] : []));
	const cachedPlugins = (skipAssets ? [] : await discoverPluginDirs(codexHome)).filter((plugin) => {
		const normalizedName = sanitizePluginName(plugin.name);
		return !sourcePluginNames.has(normalizedName);
	});
	const plugins = [...sourcePluginDiscovery.plugins, ...cachedPlugins].toSorted((a, b) => a.source.localeCompare(b.source));
	const archivePaths = [];
	if (!skipAssets && await exists(configPath)) archivePaths.push({
		id: "archive:config.toml",
		path: configPath,
		relativePath: "config.toml",
		message: "Codex config is archived for manual review; it is not activated automatically"
	});
	if (!skipAssets && await exists(hooksPath)) archivePaths.push({
		id: "archive:hooks/hooks.json",
		path: hooksPath,
		relativePath: "hooks/hooks.json",
		message: "Codex native hooks are archived for manual review because they can execute commands"
	});
	const skills = [...codexSkills, ...personalAgentSkills].toSorted((a, b) => a.source.localeCompare(b.source));
	const hasAuth = !options.memoryOnly && await exists(authPath);
	const high = Boolean(memoryFiles.length || codexSkills.length || plugins.length || archivePaths.length || hasAuth);
	const medium = personalAgentSkills.length > 0;
	return {
		root: codexHome,
		confidence: high ? "high" : medium ? "medium" : "low",
		codexHome,
		...await isDirectory(codexSkillsDir) ? { codexSkillsDir } : {},
		...await isDirectory(agentsSkillsDir) ? { personalAgentsSkillsDir: agentsSkillsDir } : {},
		...hasAuth ? { authPath } : {},
		...await exists(modelsCachePath) ? { modelsCachePath } : {},
		memoryFiles,
		skills,
		plugins,
		...sourcePluginDiscovery.error ? { pluginDiscoveryError: sourcePluginDiscovery.error } : {},
		archivePaths
	};
}
function hasCodexSource(source) {
	return source.confidence !== "low";
}
function sanitizePluginName(value) {
	return value.trim().toLowerCase().replaceAll(/\s+/gu, "-");
}
//#endregion
export { source_exports as a, sanitizeName as c, hasCodexSource as i, defaultCodexHome as n, exists as o, discoverCodexSource as r, readJsonObject as s, codexPluginMigrationSubscriptionWarning as t };
