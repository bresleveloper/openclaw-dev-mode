import { o as safeRealpathSync } from "./path-safety-0BfxAYBQ.mjs";
import { t as isPathInside } from "./path-safety-Cc0rrc_m.mjs";
import { u as readRootJsonObjectSync } from "./json-files-C0HSMh2Z.mjs";
import { i as auditOpenClawPeerDependencyLinkSync } from "./plugin-peer-link-C9fwm_tB.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/status-dependencies-core.ts
const MAX_DEPENDENCY_MANIFEST_BYTES = 1048576;
function normalizeDependencyMap(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
	const normalized = {};
	for (const [name, spec] of Object.entries(raw)) {
		const normalizedName = name.trim();
		if (!normalizedName || typeof spec !== "string" || !spec.trim()) continue;
		normalized[normalizedName] = spec.trim();
	}
	return normalized;
}
/** Normalizes raw package dependency maps into sorted plugin dependency specs. */
function normalizePluginDependencySpecs(params) {
	const dependencies = normalizeDependencyMap(params.dependencies);
	const optionalDependencies = normalizeDependencyMap(params.optionalDependencies);
	for (const name of Object.keys(optionalDependencies)) delete dependencies[name];
	return {
		dependencies,
		optionalDependencies
	};
}
function dependencyPathSegments(name) {
	const segments = name.split("/");
	if (segments.length === 1 && segments[0]) return [segments[0]];
	if (segments.length === 2 && segments[0]?.startsWith("@") && segments[1]) return segments;
	return null;
}
function findDependencyPackageDir(params) {
	const segments = dependencyPathSegments(params.name);
	if (!segments) return;
	const boundaryRoot = params.dependencyRootDir === void 0 ? void 0 : safeRealpathSync(params.dependencyRootDir) ?? path.resolve(params.dependencyRootDir);
	let current = path.resolve(params.fromDir);
	if (boundaryRoot) current = safeRealpathSync(current) ?? current;
	while (true) {
		if (boundaryRoot && !isPathInside(boundaryRoot, current)) return;
		const candidate = path.join(current, "node_modules", ...segments);
		if (fs.existsSync(path.join(candidate, "package.json"))) {
			const resolved = safeRealpathSync(candidate);
			const manifestPath = safeRealpathSync(path.join(candidate, "package.json"));
			if (!resolved || !manifestPath || boundaryRoot && (!isPathInside(boundaryRoot, resolved) || !isPathInside(boundaryRoot, manifestPath))) return;
			const manifestRoot = boundaryRoot ?? path.dirname(manifestPath);
			return readRootJsonObjectSync({
				rootDir: manifestRoot,
				relativePath: path.relative(manifestRoot, manifestPath),
				boundaryLabel: "plugin dependency project",
				maxBytes: MAX_DEPENDENCY_MANIFEST_BYTES,
				rejectHardlinks: false
			}).ok ? candidate : void 0;
		}
		const parent = path.dirname(current);
		if (parent === current) return;
		current = parent;
	}
}
function buildDependencyEntries(params) {
	return Object.entries(params.dependencies).toSorted(([left], [right]) => left.localeCompare(right)).map(([name, spec]) => {
		const resolvedPath = params.rootDir ? findDependencyPackageDir({
			fromDir: params.rootDir,
			name,
			dependencyRootDir: params.dependencyRootDir
		}) : void 0;
		const entry = {
			name,
			spec,
			installed: resolvedPath !== void 0,
			optional: params.optional
		};
		if (resolvedPath) entry.resolvedPath = resolvedPath;
		return entry;
	});
}
/** Builds dependency installation status for a plugin package root. */
function buildPluginDependencyStatus(params) {
	const dependencies = buildDependencyEntries({
		rootDir: params.rootDir,
		dependencyRootDir: params.dependencyRootDir,
		dependencies: params.dependencies ?? {},
		optional: false
	});
	const optionalDependencies = buildDependencyEntries({
		rootDir: params.rootDir,
		dependencyRootDir: params.dependencyRootDir,
		dependencies: params.optionalDependencies ?? {},
		optional: true
	});
	const missing = dependencies.filter((entry) => !entry.installed).map((entry) => entry.name);
	const missingOptional = optionalDependencies.filter((entry) => !entry.installed).map((entry) => entry.name);
	const requiredInstalled = missing.length === 0;
	const optionalInstalled = missingOptional.length === 0;
	return {
		hasDependencies: dependencies.length > 0 || optionalDependencies.length > 0,
		installed: requiredInstalled,
		requiredInstalled,
		optionalInstalled,
		missing,
		missingOptional,
		dependencies,
		optionalDependencies
	};
}
/** Checks managed required dependencies, using the host audit for the OpenClaw SDK link. */
function buildManagedPluginDependencyStatus(params) {
	const status = buildPluginDependencyStatus(params);
	if (!status.dependencies.some((entry) => entry.name === "openclaw")) return status;
	const rootDir = safeRealpathSync(params.rootDir);
	const boundaryRoot = safeRealpathSync(params.dependencyRootDir);
	let hostInstalled = false;
	if (rootDir && boundaryRoot && isPathInside(boundaryRoot, rootDir)) hostInstalled = auditOpenClawPeerDependencyLinkSync({ packageDir: rootDir }) === null;
	const dependencies = status.dependencies.map((entry) => entry.name === "openclaw" ? {
		...entry,
		installed: hostInstalled,
		resolvedPath: hostInstalled ? path.join(params.rootDir, "node_modules", "openclaw") : void 0
	} : entry);
	const missing = dependencies.filter((entry) => !entry.installed).map((entry) => entry.name);
	return {
		...status,
		dependencies,
		missing,
		installed: missing.length === 0,
		requiredInstalled: missing.length === 0
	};
}
async function findMissingRequiredPluginDependencies(params) {
	return buildManagedPluginDependencyStatus(params).missing;
}
function pluginInstallIncompleteDiagnostic(pluginId, detail, installId = pluginId) {
	const fixHint = `Run \`openclaw plugins install ${installId} --force\` to reinstall the plugin.`;
	return {
		level: "error",
		pluginId,
		code: "plugin-verification",
		message: `Plugin "${pluginId}" install incomplete: ${detail} ${fixHint}`,
		fixHint
	};
}
/** Projects install failures consistently across cold plugin status surfaces. */
function projectPluginDependencyHealth(registry, installTargets = /* @__PURE__ */ new Map()) {
	const diagnostics = [...registry.diagnostics];
	const plugins = registry.plugins.map((plugin) => {
		if (!plugin.enabled) return plugin;
		const dependencyFailure = plugin.dependencyStatus?.requiredInstalled === false ? installTargets.has(plugin.id) ? pluginInstallIncompleteDiagnostic(plugin.id, `required dependencies are missing: ${plugin.dependencyStatus.missing.join(", ")}.`, installTargets.get(plugin.id)) : {
			level: "error",
			pluginId: plugin.id,
			message: `Plugin "${plugin.id}" cannot load because required dependencies are missing: ${plugin.dependencyStatus.missing.join(", ")}. Install the plugin dependencies or reinstall/update the plugin, then restart the Gateway.`
		} : void 0;
		const failure = dependencyFailure ?? diagnostics.find((entry) => entry.level === "error" && entry.pluginId === plugin.id && entry.code === "plugin-verification");
		if (!failure) return plugin;
		const message = failure.message;
		if (dependencyFailure) {
			const existingDiagnosticIndex = diagnostics.findIndex((entry) => entry.level === "error" && entry.pluginId === plugin.id);
			const existingDiagnostic = diagnostics[existingDiagnosticIndex];
			if (!existingDiagnostic) diagnostics.push({
				...failure,
				source: plugin.source
			});
			else diagnostics[existingDiagnosticIndex] = {
				...failure,
				...existingDiagnostic,
				fixHint: existingDiagnostic.fixHint ?? failure.fixHint,
				message: existingDiagnostic.message.includes(message) ? existingDiagnostic.message : `${existingDiagnostic.message}\n${message}`
			};
		}
		const existingError = plugin.status === "error" ? plugin.error : void 0;
		return {
			...plugin,
			status: "error",
			error: existingError && !existingError.includes(message) ? `${existingError}\n${message}` : existingError ?? message
		};
	});
	return {
		...registry,
		plugins,
		diagnostics
	};
}
//#endregion
export { pluginInstallIncompleteDiagnostic as a, normalizePluginDependencySpecs as i, buildPluginDependencyStatus as n, projectPluginDependencyHealth as o, findMissingRequiredPluginDependencies as r, buildManagedPluginDependencyStatus as t };
