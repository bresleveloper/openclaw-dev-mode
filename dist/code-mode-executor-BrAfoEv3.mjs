import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as resolvePluginRootPublicSurfacePath } from "./public-surface-runtime-B_fTpq__.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { i as loadValidatedPublicSurfaceModule } from "./public-surface-loader-CNXp9Fm5.mjs";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { c as loadManifestMetadataSnapshot, n as isManifestPluginAvailableForControlPlane, t as hasManifestContractValue } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
//#region src/plugins/code-mode-executor.ts
/** Explicit executor selection activates only its admitted manifest owner. */
function resolvePluginCodeModeExecutor(executorId, config) {
	const snapshot = loadManifestMetadataSnapshot({ config });
	const normalizedConfig = normalizePluginsConfig(config?.plugins);
	const owners = snapshot.plugins.filter((plugin) => hasManifestContractValue({
		plugin,
		contract: "codeModeExecutors",
		value: executorId
	}) && isManifestPluginAvailableForControlPlane({
		snapshot,
		plugin,
		config,
		normalizedConfig,
		allowRestrictiveAllowlistBypass: plugin.origin === "bundled"
	}) && (plugin.origin === "bundled" || passesManifestOwnerBasePolicy({
		plugin,
		normalizedConfig
	})));
	const [owner, ...otherOwners] = owners;
	if (!owner || otherOwners.length > 0) throw new Error(!owner ? `Code Mode executor "${executorId}" is unavailable or disabled. Enable its plugin or select another executor.` : `Code Mode executor "${executorId}" has multiple plugin owners: ${owners.map((candidate) => candidate.id).join(", ")}. Enable only one owner.`);
	const modulePath = resolvePluginRootPublicSurfacePath({
		pluginRoot: owner.rootDir,
		pluginId: owner.id,
		entrySource: owner.source,
		artifactBasename: "code-mode-executor-api.js"
	});
	if (!modulePath) throw new Error(`Code Mode executor "${executorId}" plugin "${owner.id}" is missing its runtime artifact.`);
	const module = loadValidatedPublicSurfaceModule({
		modulePath,
		boundaryRoot: owner.rootDir,
		surfaceLabel: "Code Mode executor",
		origin: owner.origin,
		pluginId: owner.id
	});
	const executor = "codeModeExecutor" in module ? module.codeModeExecutor : void 0;
	if (!isRecord(executor) || executor.id !== executorId || typeof executor.execute !== "function") throw new Error(`Code Mode executor "${executorId}" plugin "${owner.id}" has an invalid runtime artifact.`);
	return executor;
}
//#endregion
export { resolvePluginCodeModeExecutor };
