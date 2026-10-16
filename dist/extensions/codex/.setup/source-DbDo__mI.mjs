import { a as defaultCodexAppInventoryCache, r as buildCodexPluginAppCacheKey } from "./plugin-app-cache-key-BW8rd98k.mjs";
import { a as withCodexAppServerJsonClient } from "./request-CB7T766a.mjs";
import { a as pluginReadParams, i as marketplaceRef, l as CODEX_PLUGINS_MARKETPLACE_NAME, n as isOpenAiCuratedMarketplaceName } from "./plugin-inventory-Bf0_piTw.mjs";
import "./config-0Gxk3_eq.mjs";
import { t as __exportAll } from "./session-binding-sidecars-BrdV95Fg.mjs";
import { asNonArrayRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { coerceErrorMessage, extractErrorCode } from "openclaw/plugin-sdk/error-runtime";
import { isPathInside } from "openclaw/plugin-sdk/file-access-runtime";
import { pathExists } from "openclaw/plugin-sdk/security-runtime";
import { tryReadJson } from "@openclaw/fs-safe/json";
//#region extensions/codex/src/migration/helpers.ts
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
	return asNonArrayRecord(filePath ? await tryReadJson(filePath) : null);
}
//#endregion
//#region extensions/codex/src/migration/source-files.ts
const SKILL_FILENAME = "SKILL.md";
const MAX_SCAN_DEPTH = 6;
const MAX_DISCOVERED_DIRS = 2e3;
async function discoverSourceDirs(params, readSource) {
	if (!params.root || !await isDirectory(params.root)) return [];
	const discovered = [];
	async function visit(dir, depth) {
		if (discovered.length >= MAX_DISCOVERED_DIRS || depth > MAX_SCAN_DEPTH) return;
		if (params.excludeSystem && depth === 1 && path.basename(dir) === ".system") return;
		const source = await readSource(dir);
		if (source !== void 0) {
			discovered.push(source);
			return;
		}
		for (const entry of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) if (entry.isDirectory()) await visit(path.join(dir, entry.name), depth + 1);
	}
	await visit(params.root, 0);
	return discovered;
}
async function discoverSkillDirs(params) {
	return discoverSourceDirs(params, async (dir) => await pathExists(path.join(dir, SKILL_FILENAME)) ? {
		name: path.basename(dir),
		source: dir,
		sourceLabel: params.sourceLabel
	} : void 0);
}
async function discoverPluginDirs(codexHome) {
	return (await discoverSourceDirs({ root: path.join(codexHome, "plugins", "cache") }, async (dir) => {
		const manifestPath = path.join(dir, ".codex-plugin", "plugin.json");
		if (!await pathExists(manifestPath)) return;
		const manifest = await readJsonObject(manifestPath);
		return {
			name: (typeof manifest.name === "string" ? manifest.name.trim() : "") || path.basename(dir),
			source: dir,
			migratable: false,
			message: "Cached Codex plugin bundle found. Review manually unless the plugin is also installed in the source Codex app-server inventory"
		};
	})).toSorted((a, b) => a.source.localeCompare(b.source));
}
async function discoverCodexMemoryFile(candidate) {
	try {
		const stat = await fs.lstat(candidate.path);
		if (stat.isSymbolicLink()) throw new Error(`Codex memory source must not be a symbolic link: ${candidate.path}`);
		if (!stat.isFile()) throw new Error(`Codex memory source must be a regular file: ${candidate.path}`);
		return candidate;
	} catch (error) {
		if (extractErrorCode(error) === "ENOENT") return;
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
function discoverInstalledCuratedPluginSources(response) {
	const installedByName = /* @__PURE__ */ new Map();
	for (const marketplace of response.marketplaces) {
		if (!isOpenAiCuratedMarketplaceName(marketplace.name)) continue;
		const remote = !marketplace.path;
		for (const summary of marketplace.plugins) {
			if (!summary.installed) continue;
			const pluginName = pluginNameFromSummary(summary);
			if (!pluginName) continue;
			const existing = installedByName.get(pluginName);
			if (existing && (!remote || existing.remote)) continue;
			installedByName.set(pluginName, {
				plugin: {
					name: summary.name,
					pluginName,
					marketplaceName: CODEX_PLUGINS_MARKETPLACE_NAME,
					source: `${CODEX_PLUGINS_MARKETPLACE_NAME}/${pluginName}`,
					migratable: true,
					installed: summary.installed,
					enabled: summary.enabled
				},
				marketplace: marketplaceRef(marketplace, CODEX_PLUGINS_MARKETPLACE_NAME),
				readPluginName: remote ? summary.remotePluginId?.trim() || void 0 : pluginName,
				remote
			});
		}
	}
	return Array.from(installedByName.values());
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
		let detail;
		try {
			if (!readPluginName) throw new Error(`Codex remote plugin "${plugin.pluginName ?? plugin.name}" has no readable remote plugin id.`);
			detail = (await params.requestOptions.request({
				method: "plugin/read",
				requestParams: pluginReadParams(marketplace, readPluginName)
			})).plugin;
		} catch (error) {
			const message = coerceErrorMessage(error);
			evaluated.push({
				...plugin,
				migratable: false,
				migrationBlock: {
					code: "plugin_read_unavailable",
					error: message
				},
				message: `Codex plugin "${plugin.pluginName ?? plugin.name}" detail could not be read: ${message}`
			});
			continue;
		}
		if (detail.apps.length === 0) {
			evaluated.push({
				...plugin,
				migratable: true
			});
			continue;
		}
		const apps = detail.apps.map(({ id, name }) => ({
			id,
			name
		})).toSorted((left, right) => left.id.localeCompare(right.id));
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
	const unavailable = (code, reason, error) => evaluated.concat(pending.map(({ plugin, apps }) => ({
		...plugin,
		migratable: false,
		migrationBlock: {
			code,
			apps,
			...error !== void 0 ? { error } : {}
		},
		message: `Codex plugin "${plugin.pluginName ?? plugin.name}" owns apps, but ${reason}`
	})));
	if (sourceAccountError && !params.verifyPluginApps) return unavailable("codex_account_unavailable", `the source Codex app-server account could not be read: ${sourceAccountError}`, sourceAccountError);
	if (sourceAccount === "non_chatgpt") return unavailable("codex_subscription_required", codexPluginMigrationSubscriptionWarning());
	if (!params.verifyPluginApps) return evaluated.concat(pending.map(({ plugin, apps }) => ({
		...plugin,
		apps,
		migratable: true
	})));
	let snapshot;
	try {
		snapshot = await refreshSourceAppInventory(params.requestOptions);
	} catch (error) {
		const message = coerceErrorMessage(error);
		return unavailable("app_inventory_unavailable", `source app inventory could not be read: ${message}`, message);
	}
	const appInfoById = new Map(snapshot.apps.map((app) => [app.id, app]));
	const installedAppsById = new Map(snapshot.installedApps.map((app) => [app.id, app]));
	for (const { plugin, apps: declaredApps } of pending) {
		const apps = declaredApps.map((app) => sourcePluginAppFactWithInventory(app, appInfoById.get(app.id), installedAppsById.get(app.id)));
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
	switch ((await options.request({
		method: "account/read",
		requestParams: { refreshToken: false }
	})).account?.type) {
		case "chatgpt": return "chatgpt";
		case "apiKey":
		case "amazonBedrock": return "non_chatgpt";
		default: return "missing";
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
	const agentsSkillsDir = path.join(resolveUserHomeDir(), ".agents", "skills");
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
	if (!skipAssets && await pathExists(configPath)) archivePaths.push({
		id: "archive:config.toml",
		path: configPath,
		relativePath: "config.toml",
		message: "Codex config is archived for manual review; it is not activated automatically"
	});
	if (!skipAssets && await pathExists(hooksPath)) archivePaths.push({
		id: "archive:hooks/hooks.json",
		path: hooksPath,
		relativePath: "hooks/hooks.json",
		message: "Codex native hooks are archived for manual review because they can execute commands"
	});
	const skills = [...codexSkills, ...personalAgentSkills].toSorted((a, b) => a.source.localeCompare(b.source));
	const hasAuth = !options.memoryOnly && await pathExists(authPath);
	const high = Boolean(memoryFiles.length || codexSkills.length || plugins.length || archivePaths.length || hasAuth);
	const medium = personalAgentSkills.length > 0;
	return {
		root: codexHome,
		confidence: high ? "high" : medium ? "medium" : "low",
		codexHome,
		...await isDirectory(codexSkillsDir) ? { codexSkillsDir } : {},
		...await isDirectory(agentsSkillsDir) ? { personalAgentsSkillsDir: agentsSkillsDir } : {},
		...hasAuth ? { authPath } : {},
		...await pathExists(modelsCachePath) ? { modelsCachePath } : {},
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
export { source_exports as a, hasCodexSource as i, defaultCodexHome as n, readJsonObject as o, discoverCodexSource as r, sanitizeName as s, codexPluginMigrationSubscriptionWarning as t };
