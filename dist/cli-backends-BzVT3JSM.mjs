import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as resolveRuntimeCliBackends } from "./cli-backends.runtime.js";
import { i as resolvePluginSetupRegistry, n as resolvePluginSetupCliBackend } from "./setup-registry-CGxNMBUk.mjs";
import { n as mergePluginTextTransforms } from "./plugin-text-transforms-B25e5LoI.mjs";
import { t as resolveRuntimeTextTransforms } from "./text-transforms.runtime-BR0qsAmw.mjs";
//#region src/agents/cli-backends.ts
function resolveCliBackendModelProvider(backend) {
	const provider = backend.modelProvider?.trim();
	return provider ? normalizeProviderId(provider) : void 0;
}
function addCliRuntimeModelBinding(bindings, backend) {
	const provider = resolveCliBackendModelProvider(backend);
	const runtime = normalizeProviderId(backend.id);
	if (!provider || !runtime) return;
	bindings.set(`${provider}:${runtime}`, {
		provider,
		runtime
	});
}
function listCliRuntimeModelBackendBindings(params = {}) {
	const bindings = /* @__PURE__ */ new Map();
	for (const backend of resolveRuntimeCliBackends("metadata")) addCliRuntimeModelBinding(bindings, backend);
	if (params.includeSetupRegistry === true) for (const entry of resolvePluginSetupRegistry({
		config: params.config,
		env: params.env
	}).cliBackends) addCliRuntimeModelBinding(bindings, entry.backend);
	return [...bindings.values()].toSorted((left, right) => left.provider === right.provider ? left.runtime.localeCompare(right.runtime) : left.provider.localeCompare(right.provider));
}
function listCliRuntimeProviderIds(params = {}) {
	return [...new Set(listCliRuntimeModelBackendBindings(params).map((binding) => binding.runtime))].toSorted();
}
function resolveCliRuntimeBinding(runtime, provider, resolveSetup) {
	if (!runtime) return;
	const matchesProvider = (candidate) => provider === void 0 || candidate === provider || runtime === provider;
	const runtimeBinding = listCliRuntimeModelBackendBindings().find((binding) => binding.runtime === runtime && matchesProvider(binding.provider));
	if (runtimeBinding) return runtimeBinding;
	const setupBackend = resolveSetup();
	const setupProvider = setupBackend && resolveCliBackendModelProvider(setupBackend.backend);
	return setupProvider && matchesProvider(setupProvider) ? {
		provider: setupProvider,
		runtime
	} : void 0;
}
function resolveCliRuntimeCanonicalProvider(params) {
	const runtime = normalizeProviderId(params.runtime ?? "");
	return resolveCliRuntimeBinding(runtime, void 0, () => params.includeSetupRegistry === true && params.metadataSnapshot !== null ? resolvePluginSetupCliBackend({
		backend: runtime,
		config: params.config,
		env: params.env,
		metadataSnapshot: params.metadataSnapshot
	}) : void 0)?.provider;
}
function resolveCliRuntimeModelBackendBinding(params) {
	const provider = normalizeProviderId(params.provider ?? "");
	const runtime = normalizeProviderId(params.runtime ?? "");
	if (!provider || !runtime) return;
	return resolveCliRuntimeBinding(runtime, provider, () => params.config === void 0 ? void 0 : resolvePluginSetupCliBackend({
		backend: runtime,
		config: params.config
	}));
}
function isCliRuntimeModelBackendForProvider(params) {
	return resolveCliRuntimeModelBackendBinding(params) !== void 0;
}
function resolveCliBackendLiveTest(provider) {
	const normalized = normalizeProviderId(provider);
	const entry = resolvePluginSetupCliBackend({ backend: normalized }) ?? resolveRuntimeCliBackends().find((backend) => normalizeProviderId(backend.id) === normalized);
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
/** Whether the backend can branch a native session at a recorded checkpoint. */
function cliBackendSupportsSessionFork(provider, cfg) {
	const config = resolveCliBackendConfig(provider, cfg)?.config;
	return Boolean(config?.forkArg && config.resumeAtArg);
}
function resolveCliBackendConfig(provider, cfg, options = {}) {
	const normalized = normalizeProviderId(provider);
	const normalizeContext = {
		backendId: normalized,
		...options.agentId ? { agentId: options.agentId } : {},
		...cfg ? { config: cfg } : {}
	};
	const runtimeTextTransforms = resolveRuntimeTextTransforms();
	const registered = resolveRuntimeCliBackends().find((entry) => normalizeProviderId(entry.id) === normalized);
	const backend = registered ?? resolvePluginSetupCliBackend({ backend: normalized })?.backend;
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
		bundleMcpMode: bundleMcp ? backend.bundleMcpMode ?? "claude-config-file" : void 0,
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
		projectNativeToolAuthority: backend.projectNativeToolAuthority,
		resolveManagedNativeTools: backend.resolveManagedNativeTools,
		nativeToolMode: backend.nativeToolMode,
		hostOwnedTools: backend.hostOwnedTools,
		sideQuestionToolMode: backend.sideQuestionToolMode,
		runtimeArtifact: backend.runtimeArtifact
	};
}
//#endregion
export { resolveCliBackendConfig as a, resolveCliRuntimeModelBackendBinding as c, listCliRuntimeProviderIds as i, isCliRuntimeModelBackendForProvider as n, resolveCliBackendLiveTest as o, listCliRuntimeModelBackendBindings as r, resolveCliRuntimeCanonicalProvider as s, cliBackendSupportsSessionFork as t };
