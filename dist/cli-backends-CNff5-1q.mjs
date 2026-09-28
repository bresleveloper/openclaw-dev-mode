import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as resolvePluginSetupRegistry, n as resolvePluginSetupCliBackend } from "./setup-registry-D5VN3YGP.mjs";
import { n as mergePluginTextTransforms } from "./plugin-text-transforms-CuF3jf1R.mjs";
import { t as resolveRuntimeTextTransforms } from "./text-transforms.runtime-AhvhghlM.mjs";
import { t as resolveRuntimeCliBackends } from "./cli-backends.runtime.js";
//#region src/agents/cli-backends.ts
/**
* Resolves CLI runtime backends registered by plugins or setup metadata.
*/
const defaultCliBackendsDeps = {
	resolvePluginSetupCliBackend,
	resolvePluginSetupRegistry,
	resolveRuntimeCliBackends
};
let cliBackendsDeps = defaultCliBackendsDeps;
function normalizeBundleMcpMode(mode, enabled) {
	if (!enabled) return;
	return mode ?? "claude-config-file";
}
function normalizeBackendKey(key) {
	return normalizeProviderId(key);
}
function resolveRegisteredBackend(provider) {
	const normalized = normalizeBackendKey(provider);
	return cliBackendsDeps.resolveRuntimeCliBackends().find((entry) => normalizeBackendKey(entry.id) === normalized);
}
function resolveCliBackendModelProvider(backend) {
	const provider = backend.modelProvider?.trim();
	return provider ? normalizeProviderId(provider) : void 0;
}
function addCliRuntimeModelBinding(bindings, params) {
	const provider = resolveCliBackendModelProvider(params.backend);
	const runtime = normalizeBackendKey(params.backend.id);
	if (!provider || !runtime) return;
	bindings.set(`${provider}:${runtime}`, {
		provider,
		runtime,
		...params.pluginId ? { pluginId: params.pluginId } : {}
	});
}
/** Lists model-provider to CLI-runtime bindings from runtime and optional setup registries. */
function listCliRuntimeModelBackendBindings(params = {}) {
	const bindings = /* @__PURE__ */ new Map();
	for (const backend of cliBackendsDeps.resolveRuntimeCliBackends("metadata")) addCliRuntimeModelBinding(bindings, {
		backend,
		...backend.pluginId ? { pluginId: backend.pluginId } : {}
	});
	if (params.includeSetupRegistry === true) for (const entry of cliBackendsDeps.resolvePluginSetupRegistry({
		config: params.config,
		env: params.env
	}).cliBackends) addCliRuntimeModelBinding(bindings, {
		backend: entry.backend,
		pluginId: entry.pluginId
	});
	return [...bindings.values()].toSorted((left, right) => left.provider === right.provider ? left.runtime.localeCompare(right.runtime) : left.provider.localeCompare(right.provider));
}
/** Lists CLI runtime ids that alias canonical model providers. */
function listCliRuntimeProviderIds(params = {}) {
	return [...new Set(listCliRuntimeModelBackendBindings(params).map((binding) => normalizeBackendKey(binding.runtime)).filter(Boolean))].toSorted();
}
/** Resolves the canonical model provider served by a CLI runtime id. */
function resolveCliRuntimeCanonicalProvider(params) {
	const runtime = normalizeBackendKey(params.runtime ?? "");
	if (!runtime) return;
	const runtimeBinding = listCliRuntimeModelBackendBindings().find((binding) => binding.runtime === runtime);
	if (runtimeBinding) return runtimeBinding.provider;
	if (params.includeSetupRegistry !== true) return;
	const setupBackend = cliBackendsDeps.resolvePluginSetupCliBackend({
		backend: runtime,
		config: params.config,
		env: params.env
	});
	return setupBackend ? resolveCliBackendModelProvider(setupBackend.backend) : void 0;
}
/** Resolves the binding for one provider/runtime pair when registered. */
function resolveCliRuntimeModelBackendBinding(params) {
	const provider = normalizeProviderId(params.provider ?? "");
	const runtime = normalizeBackendKey(params.runtime ?? "");
	if (!provider || !runtime) return;
	const runtimeBinding = listCliRuntimeModelBackendBindings().find((binding) => binding.provider === provider && binding.runtime === runtime);
	if (runtimeBinding) return runtimeBinding;
	if (!(params.config !== void 0 || params.env !== void 0)) return;
	const setupBackend = cliBackendsDeps.resolvePluginSetupCliBackend({
		backend: runtime,
		config: params.config,
		env: params.env
	});
	if (!setupBackend) return;
	return resolveCliBackendModelProvider(setupBackend.backend) === provider ? {
		provider,
		runtime,
		...setupBackend.pluginId ? { pluginId: setupBackend.pluginId } : {}
	} : void 0;
}
/** Checks whether a runtime is registered to serve a model provider. */
function isCliRuntimeModelBackendForProvider(params) {
	return resolveCliRuntimeModelBackendBinding(params) !== void 0;
}
/** Resolves live-test defaults advertised by a CLI backend plugin. */
function resolveCliBackendLiveTest(provider) {
	const normalized = normalizeBackendKey(provider);
	const entry = cliBackendsDeps.resolvePluginSetupCliBackend({ backend: normalized }) ?? cliBackendsDeps.resolveRuntimeCliBackends().find((backend) => normalizeBackendKey(backend.id) === normalized);
	if (!entry) return null;
	const backend = "backend" in entry ? entry.backend : entry;
	return {
		defaultModelRef: backend.liveTest?.defaultModelRef,
		defaultImageProbe: backend.liveTest?.defaultImageProbe === true,
		defaultMcpProbe: backend.liveTest?.defaultMcpProbe === true,
		dockerNpmPackage: backend.liveTest?.docker?.npmPackage,
		dockerBinaryName: backend.liveTest?.docker?.binaryName
	};
}
/** Resolves the executable CLI backend registered by its owning plugin. */
function resolveCliBackendConfig(provider, cfg, options = {}) {
	const normalized = normalizeBackendKey(provider);
	const normalizeContext = {
		backendId: normalized,
		...options.agentId ? { agentId: options.agentId } : {},
		...cfg ? { config: cfg } : {}
	};
	const runtimeTextTransforms = resolveRuntimeTextTransforms();
	const registered = resolveRegisteredBackend(normalized);
	const backend = registered ?? cliBackendsDeps.resolvePluginSetupCliBackend({ backend: normalized })?.backend;
	if (!backend) return null;
	const baseConfig = registered ? { ...backend.config } : backend.config;
	const config = backend.normalizeConfig ? backend.normalizeConfig(baseConfig, normalizeContext) : baseConfig;
	const command = config.command?.trim();
	if (!command) return null;
	const modelProvider = resolveCliBackendModelProvider(backend);
	const bundleMcp = backend.bundleMcp === true;
	return {
		id: normalized,
		...modelProvider ? { modelProvider } : {},
		config: {
			...config,
			command
		},
		bundleMcp,
		bundleMcpMode: normalizeBundleMcpMode(backend.bundleMcpMode, bundleMcp),
		...registered ? { pluginId: registered.pluginId } : {},
		transformSystemPrompt: backend.transformSystemPrompt,
		textTransforms: mergePluginTextTransforms(runtimeTextTransforms, backend.textTransforms),
		defaultAuthProfileId: backend.defaultAuthProfileId,
		authEpochMode: backend.authEpochMode,
		autoSelectAuthProfile: backend.autoSelectAuthProfile,
		contextEngineHostCapabilities: backend.contextEngineHostCapabilities,
		ownsNativeCompaction: backend.ownsNativeCompaction,
		manualCompaction: backend.manualCompaction,
		prepareExecution: backend.prepareExecution,
		resolveExecutionArgs: backend.resolveExecutionArgs,
		resolveModelId: backend.resolveModelId,
		parseJsonlEvent: backend.parseJsonlEvent,
		parseJsonlLifecycleEvent: backend.parseJsonlLifecycleEvent,
		toolAvailabilityEnforcement: backend.toolAvailabilityEnforcement,
		isolatesInstructionsWithExactTools: backend.isolatesInstructionsWithExactTools,
		projectNativeToolAuthority: backend.projectNativeToolAuthority,
		nativeToolMode: backend.nativeToolMode,
		sideQuestionToolMode: backend.sideQuestionToolMode,
		runtimeArtifact: backend.runtimeArtifact
	};
}
/** Test-only dependency controls for CLI backend registry resolution. */
const testing = {
	resetDepsForTest() {
		cliBackendsDeps = defaultCliBackendsDeps;
	},
	setDepsForTest(deps) {
		cliBackendsDeps = {
			...defaultCliBackendsDeps,
			...deps
		};
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.cliBackendsTestApi")] = testing;
//#endregion
export { resolveCliBackendLiveTest as a, resolveCliBackendConfig as i, listCliRuntimeModelBackendBindings as n, resolveCliRuntimeCanonicalProvider as o, listCliRuntimeProviderIds as r, resolveCliRuntimeModelBackendBinding as s, isCliRuntimeModelBackendForProvider as t };
