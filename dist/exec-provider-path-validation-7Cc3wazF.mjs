import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { t as FsSafeError } from "./fs-safe-BAPek8At.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as isPathInside$1 } from "./path-safety-0BfxAYBQ.mjs";
import { f as isValidSecretProviderAlias } from "./ref-contract-BVi3ykLT.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DhqUNG6g.mjs";
import { n as isActivatedManifestOwner } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { a as inspectPathPermissions, o as safeStat } from "./permissions-DOmAO-Zd.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/secrets/provider-integrations.ts
/** Materializes trusted plugin secret-provider integrations into exec provider configs. */
const NODE_COMMAND_PLACEHOLDER = "${node}";
const PLUGIN_INTEGRATION_PROVIDER_ID_MAX_LENGTH = 128;
function resolvePluginRelativePath(value, pluginRoot) {
	const resolved = path.resolve(pluginRoot, value);
	return isPathInside(pluginRoot, resolved) ? resolved : void 0;
}
function isPluginRelativeEntrypoint(value) {
	return value.startsWith("./");
}
function resolveArg(arg, pluginRoot) {
	if (!arg.startsWith("./") && !arg.startsWith("../")) return arg;
	return resolvePluginRelativePath(arg, pluginRoot);
}
function withNodeCommandTrustedDir(command, pluginRoot) {
	return command === NODE_COMMAND_PLACEHOLDER ? [.../* @__PURE__ */ new Set([path.dirname(process.execPath), pluginRoot])] : [pluginRoot];
}
function isSecurePosixPathStat(stat) {
	if (process.platform === "win32") return true;
	if ((stat.mode & 18) !== 0) return false;
	if (typeof process.getuid !== "function" || typeof stat.uid !== "number") return true;
	const uid = process.getuid();
	return stat.uid === uid || stat.uid === 0;
}
function pathSegmentsBetween(rootDir, targetDir) {
	if (!isPathInside(rootDir, targetDir)) return;
	const relative = path.relative(rootDir, targetDir);
	if (relative === "") return [];
	return relative.split(path.sep).filter(Boolean);
}
function isSecurePluginEntrypointPath(params) {
	if (process.platform === "win32") return true;
	const originalSegments = pathSegmentsBetween(path.resolve(params.pluginRoot), path.dirname(path.resolve(params.resolvedEntrypoint)));
	const realpathSegments = pathSegmentsBetween(params.pluginRootRealpath, path.dirname(params.entrypointRealpath));
	if (!originalSegments || !realpathSegments) return false;
	let originalDir = path.resolve(params.pluginRoot);
	for (const [index, segment] of ["", ...originalSegments].entries()) {
		if (segment) originalDir = path.join(originalDir, segment);
		const stat = fs.lstatSync(originalDir);
		if (index === 0 && stat.isSymbolicLink()) continue;
		if (!stat.isDirectory() || stat.isSymbolicLink() || !isSecurePosixPathStat(stat)) return false;
	}
	let realpathDir = params.pluginRootRealpath;
	for (const segment of ["", ...realpathSegments]) {
		if (segment) realpathDir = path.join(realpathDir, segment);
		const stat = fs.lstatSync(realpathDir);
		if (!stat.isDirectory() || !isSecurePosixPathStat(stat)) return false;
	}
	return true;
}
function resolveNodeEntrypointArg(params) {
	const entrypoint = params.integration.args?.[0];
	if (!entrypoint || !isPluginRelativeEntrypoint(entrypoint)) return;
	let pluginRootRealpath;
	try {
		pluginRootRealpath = fs.realpathSync(params.pluginRoot);
	} catch {
		return;
	}
	const resolved = resolvePluginRelativePath(entrypoint, params.pluginRoot);
	if (!resolved) return;
	let stat;
	try {
		stat = fs.lstatSync(resolved);
	} catch {
		return;
	}
	if (!stat.isFile() || stat.isSymbolicLink()) return;
	if (params.rejectHardlinks && stat.nlink > 1) return;
	if (!isSecurePosixPathStat(stat)) return;
	try {
		const realpath = fs.realpathSync(resolved);
		if (!isPathInside(pluginRootRealpath, realpath)) return;
		if (!isSecurePluginEntrypointPath({
			pluginRoot: params.pluginRoot,
			pluginRootRealpath,
			resolvedEntrypoint: resolved,
			entrypointRealpath: realpath
		})) return;
		return realpath;
	} catch {
		return;
	}
}
function materializeExecProviderConfig(integration, record, env) {
	const pluginRoot = record.rootDir;
	if (integration.command !== NODE_COMMAND_PLACEHOLDER) return;
	const nodeEntrypoint = resolveNodeEntrypointArg({
		integration,
		pluginRoot,
		rejectHardlinks: shouldRejectHardlinkedPluginFiles({
			origin: record.origin,
			rootDir: pluginRoot,
			env
		})
	});
	if (!nodeEntrypoint) return;
	const args = integration.args?.map((arg, index) => nodeEntrypoint && index === 0 ? nodeEntrypoint : resolveArg(arg, pluginRoot)).filter((arg) => arg !== void 0);
	if (integration.args && args?.length !== integration.args.length) return;
	const trustedDirs = withNodeCommandTrustedDir(integration.command, pluginRoot);
	return {
		source: "exec",
		command: process.execPath,
		...args ? { args } : {},
		...integration.timeoutMs !== void 0 ? { timeoutMs: integration.timeoutMs } : {},
		...integration.noOutputTimeoutMs !== void 0 ? { noOutputTimeoutMs: integration.noOutputTimeoutMs } : {},
		...integration.maxOutputBytes !== void 0 ? { maxOutputBytes: integration.maxOutputBytes } : {},
		...integration.jsonOnly === false ? { jsonOnly: false } : {},
		...integration.env ? { env: integration.env } : {},
		...integration.passEnv ? { passEnv: integration.passEnv } : {},
		trustedDirs
	};
}
function canExposeSecretProviderIntegrations(params) {
	if (params.record.origin !== "bundled" && params.record.origin !== "global") return false;
	return isActivatedManifestOwner({
		plugin: params.record,
		normalizedConfig: params.normalizedConfig,
		rootConfig: params.config
	});
}
function integrationDisplayName(record, integrationId, integration) {
	return normalizeOptionalString(integration.displayName) ?? normalizeOptionalString(record.name) ?? integrationId;
}
function createPluginIntegrationProviderConfig(params) {
	return {
		source: "exec",
		pluginIntegration: {
			pluginId: params.pluginId,
			integrationId: params.integrationId
		}
	};
}
function isValidPluginIntegrationProviderId(value) {
	return value.length > 0 && value.length <= PLUGIN_INTEGRATION_PROVIDER_ID_MAX_LENGTH;
}
/** Narrows a secret provider config to the plugin-integration exec shape. */
function isPluginIntegrationSecretProviderConfig(value) {
	return typeof value === "object" && value !== null && "source" in value && value.source === "exec" && "pluginIntegration" in value && typeof value.pluginIntegration === "object" && value.pluginIntegration !== null && "pluginId" in value.pluginIntegration && typeof value.pluginIntegration.pluginId === "string" && value.pluginIntegration.pluginId.trim().length > 0 && "integrationId" in value.pluginIntegration && typeof value.pluginIntegration.integrationId === "string" && value.pluginIntegration.integrationId.trim().length > 0;
}
/** Materializes an active trusted plugin secret-provider integration into an exec provider. */
/** Resolves a trusted plugin secret-provider integration into executable provider config. */
function resolveSecretProviderIntegrationConfig(params) {
	const config = params.config ?? {};
	const normalizedConfig = normalizePluginsConfig(config.plugins);
	const env = params.env ?? process.env;
	const { pluginId, integrationId } = params.providerConfig.pluginIntegration;
	if (!isValidSecretProviderAlias(params.providerAlias)) return {
		ok: false,
		reason: `provider alias "${params.providerAlias}" is invalid`
	};
	const record = params.manifestRegistry.plugins.find((candidate) => candidate.id === pluginId);
	if (!record) return {
		ok: false,
		reason: `plugin "${pluginId}" is not installed`
	};
	if (!canExposeSecretProviderIntegrations({
		record,
		normalizedConfig,
		config
	})) return {
		ok: false,
		reason: `plugin "${pluginId}" is not active or is not from a trusted install origin`
	};
	const integration = record.secretProviderIntegrations?.[integrationId];
	if (!integration) return {
		ok: false,
		reason: `plugin "${record.id}" does not declare secret provider integration "${integrationId}"`
	};
	const materialized = materializeExecProviderConfig(integration, record, env);
	if (!materialized) return {
		ok: false,
		reason: `plugin "${record.id}" integration "${integrationId}" could not be materialized`
	};
	return {
		ok: true,
		providerConfig: materialized
	};
}
/** Lists plugin secret-provider presets available to interactive configure flows. */
function listSecretProviderIntegrationPresets(params) {
	const presets = [];
	const config = params.config ?? {};
	const normalizedConfig = normalizePluginsConfig(config.plugins);
	const env = params.env ?? process.env;
	for (const record of params.manifestRegistry.plugins) {
		if (!canExposeSecretProviderIntegrations({
			record,
			normalizedConfig,
			config
		})) continue;
		for (const [integrationId, integration] of Object.entries(record.secretProviderIntegrations ?? {})) {
			const providerAlias = normalizeOptionalString(integration.providerAlias) ?? integrationId;
			if (!isValidSecretProviderAlias(providerAlias) || !isValidPluginIntegrationProviderId(record.id) || !isValidPluginIntegrationProviderId(integrationId)) continue;
			if (!materializeExecProviderConfig(integration, record, env)) continue;
			presets.push({
				id: integrationId,
				pluginId: record.id,
				providerAlias,
				displayName: integrationDisplayName(record, integrationId, integration),
				...integration.description ? { description: integration.description } : {},
				providerConfig: createPluginIntegrationProviderConfig({
					pluginId: record.id,
					integrationId
				})
			});
		}
	}
	return presets.toSorted((left, right) => `${left.displayName}:${left.providerAlias}`.localeCompare(`${right.displayName}:${right.providerAlias}`));
}
//#endregion
//#region src/secrets/exec-provider-path-validation.ts
/** Checks the same command-path trust boundary before validation, writes, and execution. */
async function assertSecureExecCommandPath(params) {
	const commandPath = resolveUserPath(params.command);
	if (!commandPath) throw new Error(`${params.label} must be an absolute path.`);
	const stat = await safeStat(commandPath);
	if (!stat.ok) throw new Error(`${params.label} is not readable: ${commandPath}`);
	if (stat.isDir) throw new Error(`${params.label} must be a file: ${commandPath}`);
	if (stat.isSymlink) throw new Error(`${params.label} must not be a symlink: ${commandPath}`);
	if (params.trustedDirs && params.trustedDirs.length > 0) {
		if (!params.trustedDirs.map((entry) => resolveUserPath(entry)).some((dir) => isPathInside$1(dir, commandPath))) throw new Error(`${params.label} is outside trustedDirs: ${commandPath}`);
	}
	const perms = await inspectPathPermissions(commandPath);
	if (!perms.ok) throw new Error(`${params.label} permissions could not be verified: ${commandPath}`);
	if (perms.worldWritable || perms.groupWritable) throw new Error(`${params.label} permissions are too open: ${commandPath}`);
	if (process.platform === "win32" && perms.source === "unknown") throw new FsSafeError("permission-unverified", `${params.label} ACL verification unavailable on Windows for ${commandPath}. Move the command to a path whose ACLs OpenClaw can verify; there is no provider-level bypass.`);
	if (process.platform !== "win32" && typeof process.getuid === "function" && stat.uid != null) {
		const uid = process.getuid();
		if (stat.uid !== uid) throw new Error(`${params.label} must be owned by the current user (uid=${uid}): ${commandPath}`);
	}
	return commandPath;
}
//#endregion
export { resolveSecretProviderIntegrationConfig as i, isPluginIntegrationSecretProviderConfig as n, listSecretProviderIntegrationPresets as r, assertSecureExecCommandPath as t };
