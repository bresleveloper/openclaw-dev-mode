import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-CAv_plX7.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { n as formatErrorMessageWithCode } from "./errors-DPfGDWk1.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-jg_14gWz.mjs";
import { o as pluginCacheStatSync, r as pluginCacheExistsSync, s as readPluginCacheDirectory } from "./plugin-cache-files-VxWaav6j.mjs";
import { c as normalizePluginId } from "./config-state-DkDfCu7E.mjs";
import { n as satisfiesPluginApiRange, t as resolvePackagePluginApiRange } from "./package-compat-AGqtJMV9.mjs";
import path from "node:path";
//#region src/plugins/runtime-degraded-state.ts
/** Boot-stable quarantine state for configured plugins whose payload failed verification. */
const PLUGIN_AVAILABILITY_POLICY = {
	state: "configured-unavailable",
	severity: "warning",
	repairCommand: "openclaw doctor --fix"
};
/** Availability findings share one disposition across startup and Doctor lint. */
function describePluginAvailabilityFailure(pluginId, detail) {
	return {
		source: pluginId,
		severity: PLUGIN_AVAILABILITY_POLICY.severity,
		message: `Plugin "${pluginId}" is unavailable: ${detail} Run \`${PLUGIN_AVAILABILITY_POLICY.repairCommand}\`.`
	};
}
let activeDegradedPlugins = [];
function cloneDegradedPlugin(plugin) {
	return {
		...plugin,
		diagnostic: { ...plugin.diagnostic }
	};
}
/** Converts verified ownership failures into the quarantine state used for this boot. */
function buildDegradedPluginsFromVerificationFailures(failures) {
	const degraded = /* @__PURE__ */ new Map();
	for (const failure of failures) {
		if (degraded.has(failure.pluginId)) continue;
		degraded.set(failure.pluginId, {
			pluginId: failure.pluginId,
			state: PLUGIN_AVAILABILITY_POLICY.state,
			diagnostic: {
				kind: "plugin-verification",
				reason: failure.reason,
				detail: failure.detail,
				...failure.installPath ? { installPath: failure.installPath } : {}
			}
		});
	}
	return [...degraded.values()];
}
/** Replaces the process-local quarantine snapshot established before Gateway plugin loading. */
function setActiveDegradedPlugins(plugins) {
	activeDegradedPlugins = plugins.map(cloneDegradedPlugin);
}
function listActiveDegradedPlugins() {
	return activeDegradedPlugins.map(cloneDegradedPlugin);
}
function findActiveDegradedPlugin(pluginId) {
	const plugin = activeDegradedPlugins.find((entry) => entry.pluginId === pluginId);
	return plugin ? cloneDegradedPlugin(plugin) : void 0;
}
/** Drops a verification failure that belongs to a different selected plugin root. */
function clearActiveDegradedPlugin(pluginId) {
	activeDegradedPlugins = activeDegradedPlugins.filter((entry) => entry.pluginId !== pluginId);
}
/** Matches an install-record path and discovered root across symlink/path aliases. */
function pluginInstallPathMatchesRoot(installPath, rootDir) {
	if (!installPath) return false;
	return resolveRealpathOrAbsolute(installPath) === resolveRealpathOrAbsolute(rootDir);
}
/** Matches install-record and discovered roots across symlink/path aliases. */
function degradedPluginMatchesRoot(plugin, rootDir) {
	return pluginInstallPathMatchesRoot(plugin.diagnostic.installPath, rootDir);
}
/** Removes the known private install root before diagnostics leave the Gateway process. */
function toPublicPluginVerificationDiagnostic(diagnostic) {
	const detail = diagnostic.reason === "missing-openclaw-peer-link" ? "Plugin declares peerDependency \"openclaw\", but its host peer link is missing or invalid." : diagnostic.installPath ? diagnostic.detail.replaceAll(diagnostic.installPath, "<plugin-install>") : diagnostic.detail;
	return {
		kind: diagnostic.kind,
		reason: diagnostic.reason,
		detail
	};
}
function formatPluginVerificationDiagnostic(diagnostic) {
	const publicDiagnostic = toPublicPluginVerificationDiagnostic(diagnostic);
	return `configured plugin payload verification failed (${publicDiagnostic.reason}): ${publicDiagnostic.detail}`;
}
//#endregion
//#region src/plugins/discovery-availability.ts
const CONFIGURED_PLUGIN_PATH_UNAVAILABLE = "configured-plugin-path-unavailable";
const CONFIGURED_PLUGIN_PATH_INSPECTION_FAILED = "configured-plugin-path-inspection-failed";
function shouldSkipIncompatiblePackagePluginApi(params) {
	if (params.origin === "bundled") return false;
	const packagePluginApiRangeCheck = resolvePackagePluginApiRange(params.packageManifest);
	if (!packagePluginApiRangeCheck.ok) {
		params.diagnostics.push({
			level: "warn",
			configDisposition: "preserve",
			source: path.join(params.packageDir, "package.json"),
			message: `invalid package plugin API metadata: ${packagePluginApiRangeCheck.error}; skipping discovery (check package.json openclaw.compat.pluginApi)`,
			pluginId: params.pluginId
		});
		return true;
	}
	const packagePluginApiRange = packagePluginApiRangeCheck.range;
	if (!packagePluginApiRange) return false;
	const compatibilityHostVersion = resolveCompatibilityHostVersion(params.env);
	if (satisfiesPluginApiRange(compatibilityHostVersion, packagePluginApiRange)) return false;
	params.diagnostics.push({
		level: "warn",
		configDisposition: "preserve",
		source: path.join(params.packageDir, "package.json"),
		message: `plugin requires plugin API ${packagePluginApiRange}, but this host is ${compatibilityHostVersion}; skipping discovery (check "openclaw --version", OPENCLAW_COMPATIBILITY_HOST_VERSION, or run "openclaw doctor")`,
		pluginId: params.pluginId
	});
	return true;
}
function isConfiguredPluginPathDiagnosticCode(code) {
	return code === CONFIGURED_PLUGIN_PATH_UNAVAILABLE || code === CONFIGURED_PLUGIN_PATH_INSPECTION_FAILED;
}
function pluginPathFailureDiagnostic(source, origin, error) {
	if (origin === "config" && !isMissingPathError(error)) {
		const errorCode = extractErrorCode(error) ?? "UNKNOWN";
		const fixHint = `${errorCode === "EACCES" || errorCode === "EPERM" ? `Fix permissions on ${source}` : errorCode === "ELOOP" ? `Fix the symbolic link loop at ${source}` : `Resolve the filesystem inspection error on ${source}`}, then run \`${PLUGIN_AVAILABILITY_POLICY.repairCommand}\`.`;
		return {
			level: "warn",
			code: CONFIGURED_PLUGIN_PATH_INSPECTION_FAILED,
			configDisposition: "preserve",
			errorCode,
			source,
			fixHint,
			message: `Configured plugin load path inspection failed: ${source} (${formatErrorMessageWithCode(error)}). Uninspected plugin configuration is preserved. ${fixHint}`
		};
	}
	return origin === "config" ? {
		level: "warn",
		code: CONFIGURED_PLUGIN_PATH_UNAVAILABLE,
		configDisposition: "preserve",
		source,
		message: `Configured plugin load path is unavailable: ${source}. Uninspected plugin configuration is preserved. Restore access to the path, then run \`${PLUGIN_AVAILABILITY_POLICY.repairCommand}\`.`
	} : {
		level: "error",
		source,
		message: `plugin path not found: ${source}`
	};
}
function inspectPluginLoadPath(source, origin, diagnostics) {
	try {
		const stat = pluginCacheStatSync(source, origin === "config");
		if (!stat && !pluginCacheExistsSync(source)) diagnostics.push(pluginPathFailureDiagnostic(source, origin, void 0));
		if (origin === "config" && stat) {
			if (stat.isDirectory()) readPluginCacheDirectory(source);
			else if (!stat.isFile()) throw Object.assign(/* @__PURE__ */ new Error("Plugin load path is not a regular file or directory"), { code: "ERR_INVALID_FILE_TYPE" });
		}
		return stat;
	} catch (error) {
		diagnostics.push(pluginPathFailureDiagnostic(source, origin, error));
		return null;
	}
}
/** Consumers consult discovery's disposition without reclassifying availability. */
function findUninspectedPluginDiagnostic(diagnostics) {
	return diagnostics.find((diagnostic) => diagnostic.configDisposition === "preserve");
}
/** Project the recorded fact onto a config surface whose owner could not be inspected. */
function pluginDiagnosticToConfigWarning(diagnostic, configPath) {
	return {
		path: configPath,
		message: diagnostic.message,
		code: diagnostic.code,
		source: diagnostic.source,
		...diagnostic.errorCode ? { errorCode: diagnostic.errorCode } : {},
		...diagnostic.fixHint ? { fixHint: diagnostic.fixHint } : {}
	};
}
/** Missing metadata cannot prove that authored plugin configuration is stale. */
function hasIncompletePluginDiscovery(diagnostics) {
	return diagnostics.some((diagnostic) => diagnostic.level === "error" || diagnostic.configDisposition === "preserve");
}
/** Blocked candidates are present, not stale. Explicit identity excludes path-name guesses. */
function createBlockedPluginDiagnosticLookup(params) {
	const BLOCKED_PLUGIN_CANDIDATE_PREFIX = "blocked plugin candidate:";
	const blockedPluginDiagnostics = /* @__PURE__ */ new Map();
	const blockedPluginDiagnosticsWithSource = [];
	const normalizeBlockedDiagnosticPath = (value) => {
		const trimmed = value?.trim();
		if (!trimmed) return "";
		try {
			return path.resolve(resolveUserPath(trimmed, params.env ?? process.env));
		} catch {
			return path.resolve(trimmed);
		}
	};
	for (const diag of params.diagnostics) {
		if (!diag.message.startsWith(BLOCKED_PLUGIN_CANDIDATE_PREFIX)) continue;
		if (!diag.pluginId && diag.source) blockedPluginDiagnosticsWithSource.push({
			message: diag.message,
			source: diag.source
		});
		if (diag.pluginId) {
			const normalizedPluginId = normalizePluginId(diag.pluginId);
			for (const key of [diag.pluginId, normalizedPluginId]) if (key && !blockedPluginDiagnostics.has(key)) blockedPluginDiagnostics.set(key, {
				message: diag.message,
				...diag.source ? { source: diag.source } : {}
			});
		}
	}
	const blockedDiagnosticSourceMatchesPluginId = (diagnostic, pluginId) => {
		const normalizedPluginId = normalizePluginId(pluginId);
		if (!normalizedPluginId) return false;
		const sourcePath = normalizeBlockedDiagnosticPath(diagnostic.source);
		if (!sourcePath) return false;
		if (normalizePluginId(path.basename(sourcePath)) === normalizedPluginId || normalizePluginId(path.basename(path.dirname(sourcePath))) === normalizedPluginId) return true;
		for (const loadPath of params.config?.plugins?.load?.paths ?? []) {
			const resolvedLoadPath = normalizeBlockedDiagnosticPath(loadPath);
			if (resolvedLoadPath && normalizePluginId(path.basename(resolvedLoadPath)) === normalizedPluginId && (isPathInside(resolvedLoadPath, sourcePath) || isPathInside(sourcePath, resolvedLoadPath))) return true;
		}
		return false;
	};
	return (pluginId) => blockedPluginDiagnostics.get(pluginId) ?? blockedPluginDiagnostics.get(normalizePluginId(pluginId)) ?? blockedPluginDiagnosticsWithSource.find((diagnostic) => blockedDiagnosticSourceMatchesPluginId(diagnostic, pluginId));
}
//#endregion
export { pluginInstallPathMatchesRoot as _, isConfiguredPluginPathDiagnosticCode as a, shouldSkipIncompatiblePackagePluginApi as c, clearActiveDegradedPlugin as d, degradedPluginMatchesRoot as f, listActiveDegradedPlugins as g, formatPluginVerificationDiagnostic as h, inspectPluginLoadPath as i, PLUGIN_AVAILABILITY_POLICY as l, findActiveDegradedPlugin as m, findUninspectedPluginDiagnostic as n, pluginDiagnosticToConfigWarning as o, describePluginAvailabilityFailure as p, hasIncompletePluginDiscovery as r, pluginPathFailureDiagnostic as s, createBlockedPluginDiagnosticLookup as t, buildDegradedPluginsFromVerificationFailures as u, setActiveDegradedPlugins as v, toPublicPluginVerificationDiagnostic as y };
