import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as describeRootFileOpenFailure, o as openRootFileSync } from "./boundary-file-read-D-Aa04On.mjs";
import { t as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-Bj8S5W5g.mjs";
import { m as resolvePluginRuntimeExecutionArtifact } from "./bundled-dir-BGJkK8G5.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DhqUNG6g.mjs";
import { n as unwrapDefaultModuleExport } from "./module-export-BbYMQUy2.mjs";
import { p as shouldIncludeChannelSetupFeatureForConfig } from "./doctor-contract-registry-6tw5Ndqt.mjs";
import { n as isActivatedManifestOwner, r as isBundledManifestOwner, t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { t as createEmptyPluginRegistry } from "./registry-empty--vb91VWS.mjs";
import { l as resolveConfiguredChannelPluginIds } from "./channel-presence-policy-C83ks5im.mjs";
import { n as resolvePluginRuntimeArtifact } from "./plugin-runtime-artifact-resolution-DjOZaMLC.mjs";
import "./channel-plugin-ids-DiMsgxMa.mjs";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-DBcPAExA.mjs";
import { t as EMPTY_LEGACY_SESSION_SURFACES } from "./legacy-session-surfaces.types-BmAZdMse.mjs";
import fs from "node:fs";
//#region src/plugins/legacy-session-surfaces.ts
function prepareResult(surfaces, failures) {
	return Object.freeze({
		surfaces: Object.freeze(surfaces),
		failures: Object.freeze(failures)
	});
}
function formatLoadFailure(pluginId, detail) {
	return `Deferred legacy session-key migration for channel owner "${pluginId}": ${detail}. Restore or reinstall the plugin setup entry, then rerun openclaw doctor --fix`;
}
function resolveLegacySessionSurface(moduleExport) {
	const resolved = unwrapDefaultModuleExport(moduleExport);
	if (!resolved || typeof resolved !== "object") throw new Error("setup entry does not export loadLegacySessionSurface");
	const setupEntry = resolved;
	if (setupEntry.kind !== "bundled-channel-setup-entry" || typeof setupEntry.loadLegacySessionSurface !== "function") throw new Error("setup entry does not export loadLegacySessionSurface");
	const surface = setupEntry.loadLegacySessionSurface();
	if (!isRecord(surface)) throw new Error("legacy session surface must be an object");
	const isGroupKey = surface.isLegacyGroupSessionKey;
	const canonicalizeKey = surface.canonicalizeLegacySessionKey;
	if (isGroupKey !== void 0 && typeof isGroupKey !== "function" || typeof canonicalizeKey !== "function") throw new Error("legacy session surface must declare canonicalizeLegacySessionKey");
	return surface;
}
function isEnabledLegacySurfaceOwner(params) {
	if (!shouldIncludeChannelSetupFeatureForConfig({
		plugin: params.record,
		config: params.config,
		normalizedConfig: params.normalizedConfig
	})) return false;
	if (isBundledManifestOwner(params.record)) return true;
	if (params.record.origin === "global" || params.record.origin === "config") return hasExplicitManifestOwnerTrust({
		plugin: params.record,
		normalizedConfig: params.normalizedConfig
	});
	return isActivatedManifestOwner({
		plugin: params.record,
		normalizedConfig: params.normalizedConfig,
		rootConfig: params.config
	});
}
function loadLegacySessionSurface(params) {
	const { source: moduleSource, rootDir: moduleRoot } = resolvePluginRuntimeExecutionArtifact(resolvePluginRuntimeArtifact({
		pluginId: params.record.id,
		entryKind: "setup",
		source: params.record.setupSource,
		rootDir: params.record.rootDir,
		origin: params.record.origin,
		preferBuiltPluginArtifacts: false,
		packageManifest: params.record.packageManifest,
		registry: params.artifactRegistry
	}));
	const opened = openRootFileSync({
		absolutePath: moduleSource,
		rootPath: moduleRoot,
		boundaryLabel: "plugin root",
		rejectHardlinks: shouldRejectHardlinkedPluginFiles({
			origin: params.record.origin,
			rootDir: params.record.rootDir,
			env: params.env
		}),
		skipLexicalRootCheck: true
	});
	if (!opened.ok) throw new Error(describeRootFileOpenFailure({
		failure: opened,
		subject: "plugin setup entry path",
		boundaryLabel: "plugin root",
		filePath: moduleSource
	}));
	const safeSource = opened.path;
	fs.closeSync(opened.fd);
	return resolveLegacySessionSurface(getCachedPluginModuleLoader({
		modulePath: safeSource,
		importerUrl: import.meta.url,
		loaderFilename: import.meta.url
	})(safeSource));
}
/** Resolves immutable session surfaces from the exact configured channel-owner snapshot. */
function prepareLegacySessionSurfaces(params) {
	const context = params.context ?? resolvePluginRuntimeLoadContext({
		config: params.config,
		env: params.env
	});
	const manifestRecords = (context.manifestRegistry?.plugins ?? []).filter((record) => record.packageManifest?.setupFeatures?.legacySessionSurfaces === true);
	const normalizedConfig = normalizePluginsConfig(context.activationSourceConfig.plugins);
	let selectedPluginIds;
	const declaringRecords = manifestRecords.filter((record) => {
		if (isEnabledLegacySurfaceOwner({
			record,
			config: context.activationSourceConfig,
			normalizedConfig
		})) return true;
		selectedPluginIds ??= new Set(resolveConfiguredChannelPluginIds({
			config: context.config,
			activationSourceConfig: context.activationSourceConfig,
			workspaceDir: context.workspaceDir,
			env: context.env,
			manifestRecords
		}));
		return selectedPluginIds.has(record.id);
	});
	if (declaringRecords.length === 0) return EMPTY_LEGACY_SESSION_SURFACES;
	const failures = declaringRecords.flatMap((record) => record.setupSource ? [] : [formatLoadFailure(record.id, "package metadata declares the surface but has no setupEntry")]);
	const loadableRecords = declaringRecords.filter((record) => Boolean(record.setupSource));
	if (loadableRecords.length === 0) return prepareResult([], failures);
	const surfaces = [];
	const artifactRegistry = createEmptyPluginRegistry();
	for (const record of loadableRecords) try {
		surfaces.push(loadLegacySessionSurface({
			record,
			env: context.env,
			artifactRegistry
		}));
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		failures.push(formatLoadFailure(record.id, detail));
	}
	return prepareResult(surfaces, failures);
}
//#endregion
export { prepareLegacySessionSurfaces };
