import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as isDeeplyFrozenPlainData } from "./immutable-data-MyNs7ITg.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { n as hashStableJson } from "./installed-plugin-index-hash-N3AVaUCF.mjs";
import { t as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-DPS9EUx6.mjs";
import { t as buildDeclaredProviderOwnerIndex } from "./provider-owner-index-rXILwfr7.mjs";
import { n as getPluginRuntimeLoadContextState, t as bindPluginRuntimeLoadContextState } from "./load-context-state-Dj3BDflJ.mjs";
import "./logging-CIwBT2dJ.mjs";
import { createHash } from "node:crypto";
//#region src/plugins/loader-registration-config.ts
/** Configuration consumed during registration, independent of activation and load scope. */
function resolvePluginRegistrationConfigKey(params) {
	const { runtimeEntries, sourceEntries } = params;
	const inputs = [.../* @__PURE__ */ new Set([...Object.keys(runtimeEntries), ...Object.keys(sourceEntries)])].toSorted().flatMap((pluginId) => {
		const { enabled: _enabled, ...runtime } = runtimeEntries[pluginId] ?? {};
		const sourceConfig = sourceEntries[pluginId]?.config;
		const registration = {
			...runtime,
			sourceConfig
		};
		return Object.values(registration).some((value) => value !== void 0) ? [[pluginId, registration]] : [];
	});
	return createHash("sha256").update(JSON.stringify(inputs)).digest("hex");
}
//#endregion
//#region src/plugins/runtime/load-context.ts
const log = createSubsystemLogger("plugins");
const immutableActivationValueHashes = /* @__PURE__ */ new WeakMap();
function activationValueFingerprint(value) {
	const immutable = value !== null && typeof value === "object" && isDeeplyFrozenPlainData(value);
	const cached = immutable ? immutableActivationValueHashes.get(value) : void 0;
	if (cached !== void 0) return cached;
	const fingerprint = hashStableJson(value);
	if (immutable) immutableActivationValueHashes.set(value, fingerprint);
	return fingerprint;
}
function activationConfigFingerprint(config) {
	return hashStableJson(Object.fromEntries(Object.entries(config).map(([key, value]) => [key, activationValueFingerprint(value)])));
}
function activationInputFingerprint(config, env) {
	return hashStableJson({
		config: activationConfigFingerprint(config),
		env
	});
}
function activationResultFingerprint(context) {
	return hashStableJson({
		config: activationConfigFingerprint(context.config),
		activationSourceConfig: activationConfigFingerprint(context.activationSourceConfig),
		autoEnabledReasons: context.autoEnabledReasons,
		env: context.env
	});
}
function setPluginRuntimeLoadContext(registry, context, registrationConfigKey, loaderCacheIdentity) {
	const previous = getPluginRuntimeLoadContextState(registry);
	const capturedIdentity = previous?.loaderCacheIdentity ?? loaderCacheIdentity;
	const bound = {
		...context,
		activationInputFingerprint: activationInputFingerprint(context.rawConfig, context.env),
		activationResultFingerprint: activationResultFingerprint(context),
		...capturedIdentity ? { loaderCacheIdentity: capturedIdentity } : {},
		registrationConfigKey: previous?.registrationConfigKey ?? registrationConfigKey ?? resolvePluginRegistrationConfigKey({
			runtimeEntries: normalizePluginsConfig(context.config.plugins).entries,
			sourceEntries: normalizePluginsConfig(context.activationSourceConfig.plugins).entries
		}),
		declaredProviderOwners: context.metadataSnapshot && context.metadataSnapshot.manifestRegistry === context.manifestRegistry ? context.metadataSnapshot.declaredProviderOwners : buildDeclaredProviderOwnerIndex(context.manifestRegistry?.plugins ?? []),
		controlPlaneFingerprint: resolvePluginControlPlaneFingerprint({
			config: context.rawConfig,
			env: context.env,
			workspaceDir: context.workspaceDir
		})
	};
	bindPluginRuntimeLoadContextState(registry, bound);
}
/** Reads load facts carried by an exact lifecycle-owned registry. */
const getPluginRuntimeLoadContext = (registry) => getPluginRuntimeLoadContextState(registry);
/** Reuses activation decisions only within the exact metadata generation and unchanged inputs. */
function getReusablePluginRuntimeActivation(registry, params) {
	const context = getPluginRuntimeLoadContext(registry);
	if (!context || context.metadataSnapshot !== params.metadataSnapshot || context.workspaceDir !== params.workspaceDir || context.activationResultFingerprint !== activationResultFingerprint(context)) return;
	const inputFingerprint = activationInputFingerprint(params.config, params.env);
	if (inputFingerprint !== context.activationInputFingerprint && inputFingerprint !== activationInputFingerprint(context.config, context.env) && inputFingerprint !== activationInputFingerprint(context.activationSourceConfig, context.env)) return;
	return {
		config: context.config,
		activationSourceConfig: context.activationSourceConfig,
		autoEnabledReasons: context.autoEnabledReasons
	};
}
/** Creates the default plugin runtime loader logger. */
function createPluginRuntimeLoaderLogger() {
	return {
		info: (message) => log.info(message),
		warn: (message) => log.warn(message),
		error: (message) => log.error(message),
		debug: (message) => log.debug(message)
	};
}
/** Projects explicit runtime load fields from prepared contexts or resolved values. */
function buildPluginRuntimeLoadOptions(values, overrides) {
	return {
		config: values.config,
		activationSourceConfig: values.activationSourceConfig,
		autoEnabledReasons: values.autoEnabledReasons,
		workspaceDir: values.workspaceDir,
		env: values.env,
		logger: values.logger,
		manifestRegistry: values.manifestRegistry,
		installRecords: values.installRecords,
		preferBuiltPluginArtifacts: values.preferBuiltPluginArtifacts,
		expectedSourceDigests: values.expectedSourceDigests,
		...overrides
	};
}
//#endregion
export { getReusablePluginRuntimeActivation as a, getPluginRuntimeLoadContext as i, buildPluginRuntimeLoadOptions as n, setPluginRuntimeLoadContext as o, createPluginRuntimeLoaderLogger as r, resolvePluginRegistrationConfigKey as s, activationConfigFingerprint as t };
