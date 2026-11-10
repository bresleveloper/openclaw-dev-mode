import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as isOpenClawStateDatabaseDefinitelyAbsent } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { r as pluginCacheExistsSync } from "./plugin-cache-files-VxWaav6j.mjs";
import { l as isBundledSourceOverlayPath } from "./discovery-B5pUUvVG.mjs";
import { i as isPluginSourceModulePath } from "./native-module-require-aTb-JMiu.mjs";
import { t as listChannelCatalogEntries } from "./channel-catalog-registry-RrAKf0FN.mjs";
import { n as resolveExistingPluginModulePath, t as loadChannelPluginModule } from "./module-loader-Cd6wOPYQ.mjs";
import path from "node:path";
//#region src/secrets/channel-env-var-names.ts
/** Ambient process env names that are too common to imply channel configuration. */
const UNSAFE_CHANNEL_ENV_VAR_TRIGGER_NAMES = /* @__PURE__ */ new Set([
	"CI",
	"HOME",
	"LANG",
	"LC_ALL",
	"LC_CTYPE",
	"LOGNAME",
	"NODE_ENV",
	"OLDPWD",
	"PATH",
	"PWD",
	"SHELL",
	"SSH_AUTH_SOCK",
	"TEMP",
	"TERM",
	"TMP",
	"TMPDIR",
	"USER"
]);
/**
* Returns whether a channel env var name is safe to treat as a credential/config trigger.
*/
function isSafeChannelEnvVarTriggerName(key) {
	const normalized = key.trim().toUpperCase();
	return /^[A-Z][A-Z0-9_]*$/.test(normalized) && !UNSAFE_CHANNEL_ENV_VAR_TRIGGER_NAMES.has(normalized);
}
//#endregion
//#region src/channels/plugins/package-state-probes.ts
const CHANNEL_PACKAGE_STATE_METADATA_KEYS = ["configuredState", "persistedAuthState"];
const log = createSubsystemLogger("channels");
function hasNonEmptyEnvValue(env, key) {
	if (!env || !isSafeChannelEnvVarTriggerName(key)) return false;
	const normalized = key.trim();
	const value = env[normalized] ?? env[normalized.toUpperCase()];
	return typeof value === "string" && value.trim().length > 0;
}
function resolveSourceBundledPluginRoot(rootDir) {
	const pluginRoot = path.resolve(rootDir);
	const extensionsDir = path.dirname(pluginRoot);
	if (path.basename(extensionsDir) !== "extensions") return null;
	const packageRoot = path.dirname(extensionsDir);
	if (path.basename(packageRoot) === "dist" || path.basename(packageRoot) === "dist-runtime") return null;
	return {
		packageRoot,
		dirName: path.basename(pluginRoot)
	};
}
function isBundledSourceOverlayPluginRoot(rootDir) {
	const pluginRoot = path.resolve(rootDir);
	return isBundledSourceOverlayPath({ sourcePath: pluginRoot }) || path.basename(path.dirname(pluginRoot)) === "extensions" && isBundledSourceOverlayPath({ sourcePath: path.dirname(pluginRoot) });
}
function listBuiltBundledPackageStateModules(params) {
	if (isBundledSourceOverlayPluginRoot(params.rootDir)) return [];
	const sourceRoot = resolveSourceBundledPluginRoot(params.rootDir);
	if (!sourceRoot) return [];
	const locations = [];
	for (const rootDir of [path.join(sourceRoot.packageRoot, "dist", "extensions", sourceRoot.dirName), path.join(sourceRoot.packageRoot, "dist-runtime", "extensions", sourceRoot.dirName)]) {
		const modulePath = resolveExistingPluginModulePath(rootDir, params.specifier);
		if (pluginCacheExistsSync(modulePath) && !isPluginSourceModulePath(modulePath)) locations.push({
			modulePath,
			rootDir
		});
	}
	return locations;
}
function listChannelPackageStateModuleLocations(params) {
	const source = {
		modulePath: resolveExistingPluginModulePath(params.entry.rootDir, params.specifier),
		rootDir: params.entry.rootDir
	};
	return [...listBuiltBundledPackageStateModules({
		rootDir: params.entry.rootDir,
		specifier: params.specifier
	}).filter((location) => location.modulePath !== source.modulePath), source];
}
function resolveChannelPackageStateMetadata(entry, metadataKey) {
	const metadata = entry.channel[metadataKey];
	if (!metadata || typeof metadata !== "object") return null;
	const specifier = normalizeOptionalString(metadata.specifier) ?? "";
	const exportName = normalizeOptionalString(metadata.exportName) ?? "";
	const exportNameAsync = normalizeOptionalString("exportNameAsync" in metadata ? metadata.exportNameAsync : void 0) ?? "";
	const envMetadata = "env" in metadata ? metadata.env : void 0;
	const allOf = normalizeTrimmedStringList(envMetadata?.allOf);
	const anyOf = normalizeTrimmedStringList(envMetadata?.anyOf);
	const env = allOf.length > 0 || anyOf.length > 0 ? {
		allOf,
		anyOf
	} : void 0;
	if ((!specifier || !exportName && !exportNameAsync) && !env) return null;
	return {
		...specifier ? { specifier } : {},
		...exportName ? { exportName } : {},
		...exportNameAsync ? { exportNameAsync } : {},
		...env ? { env } : {}
	};
}
function listChannelPackageStateCatalog(metadataKey, discovery) {
	return listChannelCatalogEntries({
		origin: "bundled",
		discovery
	}).filter((entry) => Boolean(resolveChannelPackageStateMetadata(entry, metadataKey)));
}
function resolveChannelPackageStateChecker(params) {
	const metadata = resolveChannelPackageStateMetadata(params.entry, params.metadataKey);
	if (!metadata) return null;
	const exportName = params.async ? metadata.exportNameAsync ?? metadata.exportName : metadata.exportName;
	if (metadata.env && (!metadata.specifier || !exportName)) return ({ env }) => {
		const allOf = metadata.env?.allOf ?? [];
		const anyOf = metadata.env?.anyOf ?? [];
		return allOf.every((key) => hasNonEmptyEnvValue(env, key)) && (anyOf.length === 0 || anyOf.some((key) => hasNonEmptyEnvValue(env, key)));
	};
	if (!metadata.specifier || !exportName) return null;
	let loadError;
	for (const location of listChannelPackageStateModuleLocations({
		entry: params.entry,
		specifier: metadata.specifier
	})) try {
		const checker = loadChannelPluginModule(location)[exportName];
		if (typeof checker !== "function") throw new Error(`missing ${params.metadataKey} export ${exportName}`);
		return checker;
	} catch (error) {
		loadError = error;
	}
	if (loadError) {
		const detail = formatErrorMessage(loadError);
		if (params.emitWarning !== false) log.warn(`[channels] failed to load ${params.metadataKey} checker for ${params.entry.pluginId}: ${detail}`);
		params.onLoadError?.(detail);
	}
	return null;
}
function listBundledChannelIdsForPackageState(metadataKey, discovery) {
	return listChannelPackageStateCatalog(metadataKey, discovery).map((entry) => normalizeOptionalString(entry.channel.id)).filter((channelId) => Boolean(channelId)).toSorted((left, right) => left.localeCompare(right));
}
function collectBundledChannelPackageStateLoadFailures(discovery) {
	const failures = [];
	for (const metadataKey of CHANNEL_PACKAGE_STATE_METADATA_KEYS) for (const entry of listChannelPackageStateCatalog(metadataKey, discovery)) resolveChannelPackageStateChecker({
		entry,
		async: true,
		emitWarning: false,
		metadataKey,
		onLoadError: (detail) => failures.push({
			detail,
			metadataKey,
			pluginId: entry.pluginId
		})
	});
	return failures;
}
function hasBundledChannelPackageState(params) {
	const requestedChannelId = normalizeOptionalString(params.channelId);
	const entry = listChannelPackageStateCatalog(params.metadataKey, params.discovery).find((candidate) => normalizeOptionalString(candidate.channel.id) === requestedChannelId);
	if (!entry) return false;
	return hasChannelPackageState({
		entry,
		metadataKey: params.metadataKey,
		cfg: params.cfg,
		env: params.env
	});
}
/** Evaluates the exact channel package owner already selected and trusted by its caller. */
function hasChannelPackageState(params) {
	if (params.metadataKey === "persistedAuthState" && params.entry.channel.persistedAuthState?.backingStore === "plugin-state" && isOpenClawStateDatabaseDefinitelyAbsent(params.env)) return false;
	const checker = resolveChannelPackageStateChecker({
		entry: params.entry,
		metadataKey: params.metadataKey
	});
	return checker ? checker({
		cfg: params.cfg,
		env: params.env
	}) : false;
}
async function hasBundledChannelPackageStateAsync(params) {
	const requestedChannelId = normalizeOptionalString(params.channelId);
	const entry = listChannelPackageStateCatalog(params.metadataKey, params.discovery).find((candidate) => normalizeOptionalString(candidate.channel.id) === requestedChannelId);
	return entry ? hasChannelPackageStateAsync({
		...params,
		entry
	}) : false;
}
/** Evaluates package state through its awaited checker when the owner provides one. */
async function hasChannelPackageStateAsync(params) {
	if (params.metadataKey === "persistedAuthState" && params.entry.channel.persistedAuthState?.backingStore === "plugin-state" && isOpenClawStateDatabaseDefinitelyAbsent(params.env)) return false;
	const checker = resolveChannelPackageStateChecker({
		entry: params.entry,
		metadataKey: params.metadataKey,
		async: true
	});
	return checker ? checker({
		cfg: params.cfg,
		env: params.env
	}) : false;
}
//#endregion
export { listBundledChannelIdsForPackageState as a, hasChannelPackageState as i, hasBundledChannelPackageState as n, isSafeChannelEnvVarTriggerName as o, hasBundledChannelPackageStateAsync as r, collectBundledChannelPackageStateLoadFailures as t };
