import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { i as isPluginSourceModulePath } from "./native-module-require-CFiIAPP0.mjs";
import { s as pluginCacheExistsSync } from "./package-manifest-C8sTeZKW.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as isOpenClawStateDatabaseDefinitelyAbsent } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { D as isBundledSourceOverlayPath } from "./discovery-D_5mAUI7.mjs";
import { n as resolveExistingPluginModulePath, t as loadChannelPluginModule } from "./module-loader-OKqnj1zv.mjs";
import { t as listChannelCatalogEntries } from "./channel-catalog-registry-DT_h3Okz.mjs";
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
/**
* Bundled channel package-state probes.
*
* Resolves lightweight configured/auth state checkers from package metadata and source overlays.
*/
/**
* Metadata keys that can declare a lightweight package-state checker.
*/
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
function resolveChannelPackageStateModuleLocation(params) {
	return {
		modulePath: resolveExistingPluginModulePath(params.entry.rootDir, params.specifier),
		rootDir: params.entry.rootDir
	};
}
function listChannelPackageStateModuleLocations(params) {
	const source = resolveChannelPackageStateModuleLocation(params);
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
	const envMetadata = "env" in metadata ? metadata.env : void 0;
	const allOf = normalizeTrimmedStringList(envMetadata?.allOf);
	const anyOf = normalizeTrimmedStringList(envMetadata?.anyOf);
	const env = allOf.length > 0 || anyOf.length > 0 ? {
		allOf,
		anyOf
	} : void 0;
	if ((!specifier || !exportName) && !env) return null;
	return {
		...specifier ? { specifier } : {},
		...exportName ? { exportName } : {},
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
	if (metadata.env && (!metadata.specifier || !metadata.exportName)) return ({ env }) => {
		const allOf = metadata.env?.allOf ?? [];
		const anyOf = metadata.env?.anyOf ?? [];
		return allOf.every((key) => hasNonEmptyEnvValue(env, key)) && (anyOf.length === 0 || anyOf.some((key) => hasNonEmptyEnvValue(env, key)));
	};
	let loadError;
	for (const location of listChannelPackageStateModuleLocations({
		entry: params.entry,
		specifier: metadata.specifier
	})) try {
		const checker = loadChannelPluginModule({
			modulePath: location.modulePath,
			rootDir: location.rootDir
		})[metadata.exportName];
		if (typeof checker !== "function") throw new Error(`missing ${params.metadataKey} export ${metadata.exportName}`);
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
function resolvePackageStateChannelId(entry) {
	return normalizeOptionalString(entry.channel.id);
}
/**
* Lists bundled channel ids that declare the requested package-state metadata.
*/
function listBundledChannelIdsForPackageState(metadataKey, discovery) {
	return listChannelPackageStateCatalog(metadataKey, discovery).map((entry) => resolvePackageStateChannelId(entry)).filter((channelId) => Boolean(channelId)).toSorted((left, right) => left.localeCompare(right));
}
/** Reports declared bundled channel package-state modules that cannot load. */
function collectBundledChannelPackageStateLoadFailures(discovery) {
	const failures = [];
	for (const metadataKey of CHANNEL_PACKAGE_STATE_METADATA_KEYS) for (const entry of listChannelPackageStateCatalog(metadataKey, discovery)) resolveChannelPackageStateChecker({
		entry,
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
/**
* Returns whether a bundled channel reports configured/auth package state.
*/
function hasBundledChannelPackageState(params) {
	const requestedChannelId = normalizeOptionalString(params.channelId);
	const entry = listChannelPackageStateCatalog(params.metadataKey, params.discovery).find((candidate) => resolvePackageStateChannelId(candidate) === requestedChannelId);
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
//#endregion
export { isSafeChannelEnvVarTriggerName as a, listBundledChannelIdsForPackageState as i, hasBundledChannelPackageState as n, hasChannelPackageState as r, collectBundledChannelPackageStateLoadFailures as t };
