import { D as withPluginCache, f as getProcessPluginCache, l as getPluginCacheRoot, o as getPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-CGmhv_zp.mjs";
import { d as normalizeStringEntries, h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as pluginInstanceState, i as getPluginValueInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { h as resolvePreferredBundledRootArtifact, m as resolvePluginRuntimeExecutionArtifact } from "./bundled-dir-BGJkK8G5.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { l as findUninspectedPluginDiagnostic, o as tracePluginLifecyclePhase, t as discoverConfiguredPluginLoadPaths } from "./discovery-D_5mAUI7.mjs";
import { n as resolvePluginRootArtifactPath } from "./doctor-contract-artifact-6DlZADc0.mjs";
import { a as loadPluginRegistrySnapshotWithMetadata } from "./plugin-registry-snapshot-BAw04cGV.mjs";
import { o as selectInstalledPluginManifestRecords, r as loadPluginManifestRegistryForInstalledIndex, t as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-CNov0ojO.mjs";
import { t as resolvePluginMetadataEnvFingerprint } from "./plugin-metadata-env-CYA0dErq.mjs";
import "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { a as listSetupCliBackendIds, o as listSetupProviderIds } from "./plugin-metadata-provider-facts-VzYAAmcr.mjs";
import { t as resolvePluginModuleExport } from "./module-export-BbYMQUy2.mjs";
import { n as hasPluginConfigMigrationSource } from "./config-contract-matches-BX-jIwaa.mjs";
import "./plugin-registry-CVPVm6lt.mjs";
import { t as getPluginSetupModuleLoader } from "./plugin-setup-module-DjAZi3JK.mjs";
import { t as PluginLruCache } from "./plugin-lru-cache-Cg7dPWCV.mjs";
import { fileURLToPath } from "node:url";
import { types } from "node:util";
import path from "node:path";
import { EventEmitter } from "node:events";
//#region src/plugins/cli-callback-binding.ts
const commands = /* @__PURE__ */ new WeakSet();
const parsers = /* @__PURE__ */ new WeakSet();
function bindCallback(value) {
	const instance = pluginInstanceInvocation.getStore()?.instance;
	if (typeof value !== "function" || !instance) return value;
	const bound = function(...args) {
		return instance.run(() => Reflect.apply(value, this, args));
	};
	return bound;
}
function bindConfiguration(value) {
	if (!value || typeof value !== "object") return value;
	const descriptors = Object.getOwnPropertyDescriptors(value);
	for (const descriptor of Object.values(descriptors)) if ("value" in descriptor) descriptor.value = bindCallback(descriptor.value);
	return Object.create(Object.getPrototypeOf(value), descriptors);
}
function bindParser(parser) {
	if (parsers.has(parser)) return;
	parsers.add(parser);
	const argParser = parser.argParser;
	Object.defineProperty(parser, "argParser", {
		configurable: true,
		writable: true,
		value(callback) {
			return Reflect.apply(argParser, this, [bindCallback(callback)]);
		}
	});
	if (parser.parseArg) parser.parseArg = bindCallback(parser.parseArg);
}
function bindStoredCallbackCollection(target, key, bind = bindCallback) {
	const descriptor = Object.getOwnPropertyDescriptor(target, key);
	const stored = descriptor?.value;
	if (!descriptor || !stored || typeof stored !== "object" || Array.isArray(stored)) throw new Error(`Unsupported native CLI callback collection: ${key}`);
	const callbacks = Object.create(Object.getPrototypeOf(stored));
	for (const name of Reflect.ownKeys(stored)) {
		const entry = Object.getOwnPropertyDescriptor(stored, name);
		if ("value" in entry) {
			if (Array.isArray(entry.value)) {
				const values = entry.value;
				const descriptors = {};
				for (const ownKey of Reflect.ownKeys(values)) {
					const value = Object.getOwnPropertyDescriptor(values, ownKey);
					if (value) Object.defineProperty(descriptors, ownKey, {
						value,
						configurable: true,
						enumerable: true,
						writable: true
					});
				}
				for (let index = 0; index < values.length; index++) {
					const value = descriptors[index];
					if (value && "value" in value) value.value = bind(value.value);
				}
				const rebound = [];
				Object.setPrototypeOf(rebound, Object.getPrototypeOf(values));
				entry.value = Object.defineProperties(rebound, descriptors);
			} else entry.value = bind(entry.value);
		}
		Object.defineProperty(callbacks, name, entry);
	}
	Object.defineProperty(target, key, {
		...descriptor,
		value: callbacks
	});
}
function bindPreparedCommandCallbacks(program) {
	for (const key of ["_actionHandler", "_exitCallback"]) {
		const descriptor = Object.getOwnPropertyDescriptor(program, key);
		if (!descriptor || !("value" in descriptor)) throw new Error(`Unsupported native Commander callback slot: ${key}`);
		Object.defineProperty(program, key, {
			...descriptor,
			value: bindCallback(descriptor.value)
		});
	}
	bindStoredCallbackCollection(program, "_lifeCycleHooks");
	program.configureHelp(bindConfiguration(program.configureHelp()));
	program.configureOutput(bindConfiguration(program.configureOutput()));
	for (const parser of [...program.options, ...program.registeredArguments]) bindParser(parser);
}
function bindPluginCliEvents(program, adoptPrepared) {
	const listenerOrigins = /* @__PURE__ */ new WeakMap();
	const wrapListener = (listener, managed) => {
		const bound = function(...args) {
			return Reflect.apply(managed, this, args);
		};
		Object.defineProperty(bound, "listener", { value: Reflect.get(listener, "listener") ?? listener });
		listenerOrigins.set(bound, listener);
		return bound;
	};
	if (adoptPrepared) bindStoredCallbackCollection(program, "_events", (listener) => {
		if (typeof listener !== "function") return listener;
		const managed = bindCallback(listener);
		return managed === listener ? listener : wrapListener(listener, managed);
	});
	for (const name of [
		"on",
		"addListener",
		"prependListener"
	]) {
		const method = program[name];
		program[name] = function(event, listener) {
			const managed = bindCallback(listener);
			if (managed === listener) return method.call(this, event, listener);
			return method.call(this, event, wrapListener(listener, managed));
		};
	}
	for (const name of ["removeListener", "off"]) {
		const method = program[name];
		program[name] = function(event, listener) {
			const registered = this.rawListeners(event).findLast((candidate) => candidate === listener || Reflect.get(candidate, "listener") === listener || listenerOrigins.get(candidate) === listener);
			const needsOrigin = registered && registered !== listener && Reflect.get(registered, "listener") !== listener;
			return method.call(this, event, needsOrigin ? registered : listener);
		};
	}
}
/**
* Bind registrations made through the host's native CLI surface. Existing host
* callbacks remain caller-owned; newly created or explicitly added command trees
* also transfer their preconfigured callbacks to the active adding instance.
*/
function bindPluginCliProgram(program, adoptPrepared = false) {
	if (commands.has(program)) return;
	commands.add(program);
	const adopt = adoptPrepared && pluginInstanceInvocation.getStore()?.instance !== void 0;
	if (adopt) bindPreparedCommandCallbacks(program);
	for (const [name, callbackIndex] of [
		["action", 0],
		["hook", 1],
		["exitOverride", 0],
		["addHelpText", 1]
	]) {
		const method = program[name];
		Object.defineProperty(program, name, {
			configurable: true,
			writable: true,
			value(...args) {
				return Reflect.apply(method, this, args.map((arg, index) => index === callbackIndex ? bindCallback(arg) : arg));
			}
		});
	}
	for (const name of ["configureHelp", "configureOutput"]) {
		const method = program[name];
		Object.defineProperty(program, name, {
			configurable: true,
			writable: true,
			value(...args) {
				return Reflect.apply(method, this, args.map(bindConfiguration));
			}
		});
	}
	if (program instanceof EventEmitter) bindPluginCliEvents(program, adopt);
	const createCommand = program.createCommand.bind(program);
	program.createCommand = function(name) {
		const command = createCommand.call(this, name);
		bindPluginCliProgram(command, true);
		return command;
	};
	const addCommand = program.addCommand.bind(program);
	program.addCommand = function(command, options) {
		bindPluginCliProgram(command, true);
		return addCommand.call(this, command, options);
	};
	const createOption = program.createOption.bind(program);
	program.createOption = function(flags, description) {
		const option = createOption.call(this, flags, description);
		bindParser(option);
		return option;
	};
	for (const name of ["addOption", "addHelpOption"]) {
		const method = program[name];
		program[name] = function(option) {
			bindParser(option);
			return method.call(this, option);
		};
	}
	const createArgument = program.createArgument.bind(program);
	program.createArgument = function(name, description) {
		const argument = createArgument.call(this, name, description);
		bindParser(argument);
		return argument;
	};
	const addArgument = program.addArgument.bind(program);
	program.addArgument = function(argument) {
		bindParser(argument);
		return addArgument.call(this, argument);
	};
	for (const command of program.commands) bindPluginCliProgram(command, adopt);
}
//#endregion
//#region src/plugins/api-facades.ts
const identitySensitiveRegistrations = /* @__PURE__ */ new Set([
	"registerCompactionProvider",
	"registerDecisionProvider",
	"registerGatewayAccessPolicy",
	"registerHttpRoute",
	"registerImageGenerationProvider",
	"registerMediaUnderstandingProvider",
	"registerMigrationProvider",
	"registerMusicGenerationProvider",
	"registerRealtimeTranscriptionProvider",
	"registerRealtimeVoiceProvider",
	"registerSpeechProvider",
	"registerTranscriptSourceProvider",
	"registerVideoGenerationProvider",
	"registerWebFetchProvider",
	"registerWebSearchProvider"
]);
/** Attaches nested facade namespaces to the flat plugin API implementation. */
function attachPluginApiFacades(api) {
	api.session = {
		state: { registerSessionExtension: (...args) => api.registerSessionExtension(...args) },
		workflow: {
			enqueueNextTurnInjection: (...args) => api.enqueueNextTurnInjection(...args),
			registerSessionSchedulerJob: (...args) => api.registerSessionSchedulerJob(...args),
			sendSessionAttachment: (...args) => api.sendSessionAttachment(...args),
			scheduleSessionTurn: (...args) => api.scheduleSessionTurn(...args),
			unscheduleSessionTurnsByTag: (...args) => api.unscheduleSessionTurnsByTag(...args)
		},
		controls: {
			registerSessionAction: (...args) => api.registerSessionAction(...args),
			registerControlUiDescriptor: (...args) => api.registerControlUiDescriptor(...args)
		}
	};
	api.agent = { events: {
		registerAgentEventSubscription: (...args) => api.registerAgentEventSubscription(...args),
		emitAgentEvent: (...args) => api.emitAgentEvent(...args)
	} };
	api.runContext = {
		setRunContext: (...args) => api.setRunContext(...args),
		getRunContext: (...args) => api.getRunContext(...args),
		clearRunContext: (...args) => api.clearRunContext(...args)
	};
	api.lifecycle = {
		...api.lifecycle,
		registerRuntimeLifecycle: (...args) => api.registerRuntimeLifecycle(...args)
	};
	return api;
}
/** Registration callbacks and their API retain the exact admitted instance. */
function instrumentPluginInstanceApi(api, instance) {
	if (!instance) return api;
	api.lifecycle = {
		...api.lifecycle,
		...instance.lifecycle
	};
	const instrumented = attachPluginApiFacades(new Proxy(api, { get: (target, key, receiver) => {
		const value = Reflect.get(target, key, receiver);
		if (typeof value !== "function" || typeof key !== "string" || !key.startsWith("register") && key !== "on" && key !== "onConversationBindingResolved") return value;
		if (key === "registerCli" || key === "registerNodeCliFeature") return (registrar, ...options) => instance.run(() => Reflect.apply(value, target, [instance.wrap((context) => {
			bindPluginCliProgram(context.program);
			return registrar(context);
		}), ...options.map((option) => instance.wrap(option))]));
		return (...args) => instance.run(() => Reflect.apply(value, target, args.map((arg) => identitySensitiveRegistrations.has(key) ? instance.adopt(arg) : instance.wrap(arg))));
	} }));
	pluginInstanceState.values.set(instrumented, instance);
	return instrumented;
}
//#endregion
//#region src/plugins/api-builder.ts
const noopEntries = Object.entries({
	registerCli: () => {},
	registerTool: () => {},
	registerHook: () => {},
	registerHttpRoute: () => {},
	registerHostedMediaResolver: () => {},
	registerWidgetPresenter: () => {},
	registerMcpServerConnectionResolver: () => {},
	registerChannel: () => {},
	registerGatewayMethod: () => {},
	registerGatewayAccessPolicy: () => {},
	registerSessionCatalog: () => {},
	registerReload: () => {},
	registerNodeHostCommand: () => {},
	registerNodeInvokePolicy: () => {},
	registerSecurityAuditCollector: () => {},
	registerService: () => {},
	registerGatewayDiscoveryService: () => {},
	registerCliBackend: () => {},
	registerTextTransforms: () => {},
	registerConfigMigration: () => {},
	registerMigrationProvider: () => {},
	registerAutoEnableProbe: () => {},
	registerProvider: () => {},
	registerWorkerProvider: () => {},
	registerModelCatalogProvider: () => {},
	registerEmbeddingProvider: () => {},
	registerSpeechProvider: () => {},
	registerRealtimeTranscriptionProvider: () => {},
	registerRealtimeVoiceProvider: () => {},
	registerMediaUnderstandingProvider: () => {},
	registerTranscriptSourceProvider: () => {},
	registerImageGenerationProvider: () => {},
	registerVideoGenerationProvider: () => {},
	registerMusicGenerationProvider: () => {},
	registerWebFetchProvider: () => {},
	registerWebSearchProvider: () => {},
	registerInteractiveHandler: () => {},
	onConversationBindingResolved: () => {},
	registerCommand: () => {},
	registerContextEngine: () => {},
	registerCompactionProvider: () => {},
	registerDecisionProvider: () => {},
	registerAgentHarness: () => {},
	registerCodexAppServerExtensionFactory: () => {},
	registerAgentToolResultMiddleware: () => {},
	registerSessionExtension: () => {},
	enqueueNextTurnInjection: async (injection) => ({
		enqueued: false,
		id: "",
		sessionKey: injection.sessionKey
	}),
	registerTrustedToolPolicy: () => {},
	registerToolMetadata: () => {},
	registerControlUiDescriptor: () => {},
	registerBoardWidgetContentKind: () => {},
	registerRuntimeLifecycle: () => {},
	registerAgentEventSubscription: () => {},
	emitAgentEvent: () => ({
		emitted: false,
		reason: "not wired"
	}),
	setRunContext: () => false,
	getRunContext: () => void 0,
	clearRunContext: () => {},
	registerSessionSchedulerJob: () => void 0,
	registerSessionAction: () => {},
	sendSessionAttachment: async () => ({
		ok: false,
		error: "not wired"
	}),
	scheduleSessionTurn: async () => void 0,
	unscheduleSessionTurnsByTag: async () => ({
		removed: 0,
		failed: 0
	}),
	registerDetachedTaskRuntime: () => {},
	registerMemoryCapability: () => {},
	registerMemoryPromptSupplement: () => {},
	registerMemoryPromptPreparation: () => {},
	registerMemoryCorpusSupplement: () => {},
	on: () => {}
});
function createUnavailableRuntime(registrationMode, pluginId) {
	const owner = pluginId ? `Plugin "${pluginId}"` : "Plugin";
	const guidance = registrationMode === "cli-metadata" ? "Declare root commands in the manifest's cliCommands or defer runtime access out of register()." : "Defer runtime access out of register().";
	return new Proxy(Object.create(null), { get(_target, property) {
		if (typeof property === "symbol") return;
		throw new Error(`${owner} runtime is intentionally unavailable during "${registrationMode}" registration. ${guidance}`);
	} });
}
function buildPluginApi(params) {
	const handlers = params.handlers ?? {};
	const registrations = Object.fromEntries(noopEntries.map(([key, fallback]) => [key, handlers[key] ?? fallback]));
	return attachPluginApiFacades({
		id: params.id,
		name: params.name,
		version: params.version,
		description: params.description,
		source: params.source,
		runtimeSource: params.runtimeSource,
		rootDir: params.rootDir,
		registrationMode: params.registrationMode,
		config: params.config,
		pluginConfig: params.pluginConfig,
		runtime: params.runtime,
		logger: params.logger,
		...registrations,
		registerNodeCliFeature: (registrar, opts) => registrations.registerCli(registrar, {
			...opts,
			parentPath: ["nodes"]
		}),
		resolvePath: params.resolvePath
	});
}
//#endregion
//#region src/plugins/api-lifecycle.ts
const LATE_CALLABLE_PLUGIN_API_METHODS = /* @__PURE__ */ new Set([
	"clearRunContext",
	"emitAgentEvent",
	"enqueueNextTurnInjection",
	"getRunContext",
	"sendSessionAttachment",
	"scheduleSessionTurn",
	"setRunContext",
	"unscheduleSessionTurnsByTag"
]);
function createGuardedPluginRegistrationApi(api) {
	let closed = false;
	return {
		api: attachPluginApiFacades(new Proxy(api, { get(target, prop, receiver) {
			const value = Reflect.get(target, prop, receiver);
			if (typeof value !== "function") return value;
			if (typeof prop === "string" && LATE_CALLABLE_PLUGIN_API_METHODS.has(prop)) return (...args) => Reflect.apply(value, target, args);
			return (...args) => {
				if (closed) return;
				return Reflect.apply(value, target, args);
			};
		} })),
		close: () => {
			closed = true;
		}
	};
}
function runPluginRegistration(register, api, asyncResult = "reject", trackPending) {
	const guarded = createGuardedPluginRegistrationApi(api);
	try {
		const result = register(guarded.api);
		if (isPromiseLike(result)) {
			const pending = Promise.resolve(result);
			trackPending?.(pending);
			pending.catch(() => {});
			if (asyncResult === "reject") throw new Error("plugin register must be synchronous");
		}
	} finally {
		guarded.close();
	}
}
//#endregion
//#region src/plugins/setup-registry.ts
const log = createSubsystemLogger("plugins/setup-registry");
const SETUP_API_EXTENSIONS = [
	".js",
	".mjs",
	".cjs",
	".ts",
	".mts",
	".cts"
];
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const RUNNING_FROM_BUILT_ARTIFACT = CURRENT_MODULE_PATH.includes(`${path.sep}dist${path.sep}`) || CURRENT_MODULE_PATH.includes(`${path.sep}dist-runtime${path.sep}`);
const NOOP_LOGGER = {
	info() {},
	warn() {},
	error() {}
};
const setupRegistries = /* @__PURE__ */ new WeakMap();
function getSetupRegistryCache() {
	const owner = getPluginCache();
	const { snapshot } = owner.metadata.current;
	let cached = setupRegistries.get(owner);
	if (!cached || cached.snapshot !== snapshot) {
		cached = {
			snapshot,
			results: new PluginLruCache(16)
		};
		setupRegistries.set(owner, cached);
	}
	return cached.results;
}
function resolveSetupApiPath(rootDir, options) {
	const artifacts = getPluginCacheRoot(rootDir).artifacts;
	const key = `setup-api:${options?.includeBundledSourceFallback !== false}:${RUNNING_FROM_BUILT_ARTIFACT}`;
	const cached = artifacts.get(key);
	if (cached !== void 0) return cached?.modulePath ?? null;
	const modulePath = resolveSetupApiPathUncached(rootDir, options);
	artifacts.set(key, modulePath ? {
		modulePath,
		boundaryRoot: path.dirname(modulePath)
	} : null);
	return modulePath;
}
function resolveSetupApiPathUncached(rootDir, options) {
	const orderedExtensions = RUNNING_FROM_BUILT_ARTIFACT ? SETUP_API_EXTENSIONS : [...SETUP_API_EXTENSIONS.slice(3), ...SETUP_API_EXTENSIONS.slice(0, 3)];
	const artifactPaths = ["", "dist"].flatMap((directory) => orderedExtensions.map((extension) => path.join(directory, `setup-api${extension}`)));
	const direct = resolvePluginRootArtifactPath(rootDir, artifactPaths);
	if (direct || options?.includeBundledSourceFallback === false) return direct;
	const sourceExtensionRoot = path.resolve(path.dirname(CURRENT_MODULE_PATH), "..", "..", "extensions", path.basename(rootDir));
	return sourceExtensionRoot === rootDir ? null : resolvePluginRootArtifactPath(sourceExtensionRoot, artifactPaths);
}
function resolveRelevantSetupMigrationPluginIds(params) {
	const entries = params.config.plugins?.entries;
	const ids = new Set(entries && typeof entries === "object" ? normalizeStringEntries(Object.keys(entries)) : []);
	const plugins = loadSetupManifestRecords({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	for (const plugin of plugins) if (hasPluginConfigMigrationSource({
		root: params.config,
		pathPatterns: plugin.configContracts?.compatibilityMigrationPaths
	})) ids.add(plugin.id);
	return [...ids].toSorted();
}
function resolveLoadableSetupRuntimeSource(record) {
	const source = record.setupSource ?? resolveSetupApiPath(record.rootDir);
	if (!source) return null;
	if (record.origin !== "bundled" || record.sourcePreferred) return {
		source,
		rootDir: record.rootDir
	};
	return resolvePluginRuntimeExecutionArtifact(resolvePreferredBundledRootArtifact({
		source,
		rootDir: record.rootDir,
		packageManifest: record.packageManifest
	}));
}
function resolveDeclaredSetupRuntimeSource(record) {
	return record.setupSource ?? resolveSetupApiPath(record.rootDir, { includeBundledSourceFallback: false });
}
function resolveSetupRegistration(record, diagnostics) {
	if (record.setup?.requiresRuntime === false) return null;
	const setupArtifact = resolveLoadableSetupRuntimeSource(record);
	if (!setupArtifact) return null;
	const setupSource = setupArtifact.source;
	let mod;
	let moduleLoader;
	try {
		moduleLoader = getPluginSetupModuleLoader(record, setupSource, setupArtifact.rootDir);
		mod = moduleLoader(setupSource);
	} catch (error) {
		diagnostics.push({
			pluginId: record.id,
			code: "setup-entry-load-failed",
			message: `setup entry failed to load from ${setupSource}: ${formatErrorMessage(error)}`
		});
		return null;
	}
	return {
		setupSource,
		instance: getPluginValueInstance(mod),
		register(api) {
			const resolved = resolvePluginModuleExport(mod);
			if (!resolved.register || resolved.definition?.id && resolved.definition.id !== record.id) return false;
			runPluginRegistration(resolved.register.bind(resolved.definition), api, "ignore");
			return true;
		},
		initialize: moduleLoader.initialize
	};
}
function buildSetupPluginApi(params) {
	return buildPluginApi({
		id: params.record.id,
		name: params.record.name ?? params.record.id,
		version: params.record.version,
		description: params.record.description,
		source: params.setupSource,
		rootDir: params.record.rootDir,
		registrationMode: "setup-only",
		config: {},
		runtime: createUnavailableRuntime("setup-only", params.record.id),
		logger: NOOP_LOGGER,
		resolvePath: (input) => input,
		handlers: params.handlers
	});
}
function matchesProvider(provider, providerId) {
	const normalized = normalizeProviderId(providerId);
	if (normalizeProviderId(provider.id) === normalized) return true;
	return [...provider.aliases ?? [], ...provider.hookAliases ?? []].some((alias) => normalizeProviderId(alias) === normalized);
}
function resolveSetupRegistryCacheKey(params) {
	const env = params?.env ?? process.env;
	if (env !== process.env) return null;
	return JSON.stringify([
		"setup-registry",
		resolvePluginControlPlaneFingerprint({
			config: params?.config,
			env,
			workspaceDir: params?.workspaceDir
		}),
		resolvePluginMetadataEnvFingerprint(env),
		process.cwd(),
		params?.pluginIds ? [...params.pluginIds].toSorted() : null
	]);
}
function cloneSetupRegistryValue(value, seen = /* @__PURE__ */ new WeakMap()) {
	if (!value || typeof value !== "object") return value;
	const cached = seen.get(value);
	if (cached !== void 0) return cached;
	if (types.isDate(value)) {
		const clone = new Date(value);
		seen.set(value, clone);
		return clone;
	}
	if (types.isRegExp(value)) {
		const clone = new RegExp(value.source, value.flags);
		clone.lastIndex = value.lastIndex;
		seen.set(value, clone);
		return clone;
	}
	if (Array.isArray(value)) {
		const clone = [];
		seen.set(value, clone);
		clone.push(...value.map((entry) => cloneSetupRegistryValue(entry, seen)));
		return clone;
	}
	if (types.isMap(value)) {
		const clone = /* @__PURE__ */ new Map();
		seen.set(value, clone);
		for (const [key, entry] of value.entries()) clone.set(cloneSetupRegistryValue(key, seen), cloneSetupRegistryValue(entry, seen));
		return clone;
	}
	if (types.isSet(value)) {
		const clone = /* @__PURE__ */ new Set();
		seen.set(value, clone);
		for (const entry of value.values()) clone.add(cloneSetupRegistryValue(entry, seen));
		return clone;
	}
	const prototype = Object.getPrototypeOf(value);
	if (prototype !== null && Object.getPrototypeOf(prototype) !== null) return value;
	const clone = Object.create(prototype);
	seen.set(value, clone);
	for (const key of Reflect.ownKeys(value)) {
		const descriptor = Object.getOwnPropertyDescriptor(value, key);
		if (!descriptor) continue;
		if ("value" in descriptor) descriptor.value = cloneSetupRegistryValue(descriptor.value, seen);
		Object.defineProperty(clone, key, descriptor);
	}
	return clone;
}
function cloneSetupRegistry(registry) {
	return cloneSetupRegistryValue(registry);
}
function loadSetupManifestRecords(params) {
	const { snapshot: index, manifestRegistry } = loadPluginRegistrySnapshotWithMetadata(params);
	if (!manifestRegistry) return loadPluginManifestRegistryForInstalledIndex({
		...params,
		index,
		includeDisabled: true
	}).plugins;
	return tracePluginLifecyclePhase("manifest registry", () => params.pluginIds?.length === 0 ? [] : selectInstalledPluginManifestRecords(index, manifestRegistry, params.pluginIds ? new Set(params.pluginIds) : null, true), {
		includeDisabled: true,
		pluginIdCount: params.pluginIds?.length,
		indexPluginCount: index.plugins.length
	});
}
function findUniqueSetupManifestOwner(params) {
	const matches = params.plugins.filter((entry) => params.listIds(entry).some((id) => normalizeProviderId(id) === params.normalizedId));
	if (matches.length === 0) return;
	return matches.length === 1 ? matches[0] : void 0;
}
function resolveSetupRegistryForManifestOwner(record) {
	return resolvePluginSetupRegistry({ manifestRegistry: {
		plugins: [record],
		diagnostics: []
	} });
}
function mapNormalizedIds(ids) {
	const mapped = /* @__PURE__ */ new Map();
	for (const id of ids) {
		const normalized = normalizeProviderId(id);
		if (!normalized || mapped.has(normalized)) continue;
		mapped.set(normalized, id);
	}
	return mapped;
}
function pushDescriptorRuntimeDisabledDiagnostic(params) {
	if (!resolveDeclaredSetupRuntimeSource(params.record)) return;
	params.diagnostics.push({
		pluginId: params.record.id,
		code: "setup-descriptor-runtime-disabled",
		message: "setup.requiresRuntime is false, so OpenClaw ignored the plugin setup runtime entry. Remove setup-api/openclaw.setupEntry or set requiresRuntime true if setup lookup still needs plugin code."
	});
}
function pushSetupDescriptorDriftDiagnostics(params) {
	const declaredProviderIds = params.record.setup?.providers?.map((entry) => entry.id);
	if (declaredProviderIds) {
		for (const provider of params.providers) if (!declaredProviderIds.some((declaredId) => matchesProvider(provider, declaredId))) params.diagnostics.push({
			pluginId: params.record.id,
			code: "setup-descriptor-provider-runtime-undeclared",
			runtimeId: provider.id,
			message: `setup runtime registered provider "${provider.id}" but setup.providers does not declare it.`
		});
	}
	const declaredCliBackendIds = params.record.setup?.cliBackends;
	if (declaredCliBackendIds) {
		const declaredCliBackends = mapNormalizedIds(declaredCliBackendIds);
		const runtimeCliBackends = mapNormalizedIds(params.cliBackends.map((backend) => backend.id));
		for (const [normalized, declaredId] of declaredCliBackends) if (!runtimeCliBackends.has(normalized)) params.diagnostics.push({
			pluginId: params.record.id,
			code: "setup-descriptor-cli-backend-missing-runtime",
			declaredId,
			message: `setup.cliBackends declares "${declaredId}" but setup runtime did not register a matching CLI backend.`
		});
		for (const [normalized, runtimeId] of runtimeCliBackends) if (!declaredCliBackends.has(normalized)) params.diagnostics.push({
			pluginId: params.record.id,
			code: "setup-descriptor-cli-backend-runtime-undeclared",
			runtimeId,
			message: `setup runtime registered CLI backend "${runtimeId}" but setup.cliBackends does not declare it.`
		});
	}
}
function withPluginSetupCache(query) {
	return (...args) => {
		const ambient = getPluginCache();
		return withPluginCache(ambient.kind === "process" ? getProcessPluginCache() : ambient, () => query(...args));
	};
}
const resolvePluginSetupRegistry = withPluginSetupCache(function(params) {
	const env = params?.env ?? process.env;
	const scopedPluginIds = params?.pluginIds ? new Set(normalizeUniqueStringEntries(params.pluginIds)) : null;
	if (scopedPluginIds && scopedPluginIds.size === 0) return {
		providers: [],
		cliBackends: [],
		configMigrations: [],
		autoEnableProbes: [],
		diagnostics: []
	};
	const resultCacheKey = params?.manifestRegistry ? null : resolveSetupRegistryCacheKey(params);
	const resultCache = getSetupRegistryCache();
	if (resultCacheKey !== null) {
		const cached = resultCache.get(resultCacheKey);
		if (cached) return cloneSetupRegistry(cached);
	}
	const providers = [];
	const cliBackends = [];
	const configMigrations = [];
	const autoEnableProbes = [];
	const diagnostics = [];
	const providerKeys = /* @__PURE__ */ new Set();
	const cliBackendKeys = /* @__PURE__ */ new Set();
	const plugins = params?.manifestRegistry == null ? loadSetupManifestRecords({
		config: params?.config,
		workspaceDir: params?.workspaceDir,
		env,
		pluginIds: params?.pluginIds
	}) : params.manifestRegistry.plugins;
	for (const record of plugins) {
		if (scopedPluginIds && !scopedPluginIds.has(record.id)) continue;
		if (record.setup?.requiresRuntime === false) {
			pushDescriptorRuntimeDisabledDiagnostic({
				record,
				diagnostics
			});
			continue;
		}
		const setupRegistration = resolveSetupRegistration(record, diagnostics);
		if (!setupRegistration) continue;
		const recordProviders = [];
		const recordCliBackends = [];
		const recordConfigMigrations = [];
		const recordAutoEnableProbes = [];
		const recordProviderKeys = /* @__PURE__ */ new Set();
		const recordCliBackendKeys = /* @__PURE__ */ new Set();
		const api = buildSetupPluginApi({
			record,
			setupSource: setupRegistration.setupSource,
			handlers: {
				registerProvider(provider) {
					const key = `${record.id}:${normalizeProviderId(provider.id)}`;
					if (providerKeys.has(key) || recordProviderKeys.has(key)) return;
					recordProviderKeys.add(key);
					recordProviders.push({
						pluginId: record.id,
						provider
					});
				},
				registerCliBackend(backend) {
					const key = `${record.id}:${normalizeProviderId(backend.id)}`;
					if (cliBackendKeys.has(key) || recordCliBackendKeys.has(key)) return;
					recordCliBackendKeys.add(key);
					recordCliBackends.push({
						pluginId: record.id,
						backend
					});
				},
				registerConfigMigration(migrate) {
					recordConfigMigrations.push({
						pluginId: record.id,
						migrate
					});
				},
				registerAutoEnableProbe(probe) {
					recordAutoEnableProbes.push({
						pluginId: record.id,
						probe
					});
				}
			}
		});
		try {
			if (!setupRegistration.initialize(() => setupRegistration.register(instrumentPluginInstanceApi(api, setupRegistration.instance)))) continue;
		} catch (error) {
			diagnostics.push({
				pluginId: record.id,
				code: "setup-registration-failed",
				message: `setup registration threw: ${formatErrorMessage(error)}`
			});
			continue;
		}
		providers.push(...recordProviders);
		cliBackends.push(...recordCliBackends);
		configMigrations.push(...recordConfigMigrations);
		autoEnableProbes.push(...recordAutoEnableProbes);
		for (const key of recordProviderKeys) providerKeys.add(key);
		for (const key of recordCliBackendKeys) cliBackendKeys.add(key);
		pushSetupDescriptorDriftDiagnostics({
			record,
			providers: recordProviders.map((entry) => entry.provider),
			cliBackends: recordCliBackends.map((entry) => entry.backend),
			diagnostics
		});
	}
	const registry = {
		providers,
		cliBackends,
		configMigrations,
		autoEnableProbes,
		diagnostics
	};
	for (const diagnostic of diagnostics) log.warn(`plugin setup [${diagnostic.pluginId}] ${diagnostic.code}: ${diagnostic.message}`);
	if (resultCacheKey === null) return registry;
	resultCache.set(resultCacheKey, cloneSetupRegistry(registry));
	return registry;
});
const resolvePluginSetupProviderCore = withPluginSetupCache(function(params) {
	const env = params.env ?? process.env;
	const normalizedProvider = normalizeProviderId(params.provider);
	const record = findUniqueSetupManifestOwner({
		plugins: loadSetupManifestRecords({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env,
			pluginIds: params.pluginIds
		}),
		normalizedId: normalizedProvider,
		listIds: listSetupProviderIds
	});
	if (!record) return;
	return resolveSetupRegistryForManifestOwner(record).providers.findLast((entry) => matchesProvider(entry.provider, normalizedProvider))?.provider;
});
const resolvePluginSetupCliBackend = withPluginSetupCache(function(params) {
	const normalized = normalizeProviderId(params.backend);
	const env = params.env ?? process.env;
	const record = findUniqueSetupManifestOwner({
		plugins: loadSetupManifestRecords({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env
		}),
		normalizedId: normalized,
		listIds: listSetupCliBackendIds
	});
	if (!record) return;
	return resolveSetupRegistryForManifestOwner(record).cliBackends.find((entry) => normalizeProviderId(entry.backend.id) === normalized);
});
const runPluginSetupConfigMigrations = withPluginSetupCache(function(params) {
	const loadPaths = params.config.plugins?.load?.paths ?? [];
	const warning = findUninspectedPluginDiagnostic(discoverConfiguredPluginLoadPaths({
		loadPaths,
		env: params.env
	}).diagnostics);
	if (warning) {
		log.warn(warning.message);
		return {
			config: params.config,
			changes: []
		};
	}
	let next = params.config;
	const changes = [];
	const pluginIds = resolveRelevantSetupMigrationPluginIds(params);
	for (const entry of resolvePluginSetupRegistry({
		...params,
		pluginIds
	}).configMigrations) {
		const migration = entry.migrate(next);
		if (migration?.changes.length) {
			next = migration.config;
			changes.push(...migration.changes);
		}
	}
	return {
		config: next,
		changes
	};
});
const resolvePluginSetupAutoEnableReasons = withPluginSetupCache(function(params) {
	const env = params.env ?? process.env;
	const reasons = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of resolvePluginSetupRegistry({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env,
		pluginIds: params.pluginIds,
		manifestRegistry: params.manifestRegistry
	}).autoEnableProbes) {
		const raw = entry.probe({
			config: params.config,
			env
		});
		const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
		for (const reason of values) {
			const normalized = reason.trim();
			if (!normalized) continue;
			const key = `${entry.pluginId}:${normalized}`;
			if (seen.has(key)) continue;
			seen.add(key);
			reasons.push({
				pluginId: entry.pluginId,
				reason: normalized
			});
		}
	}
	return reasons;
});
//#endregion
export { runPluginSetupConfigMigrations as a, createUnavailableRuntime as c, resolvePluginSetupRegistry as i, instrumentPluginInstanceApi as l, resolvePluginSetupCliBackend as n, runPluginRegistration as o, resolvePluginSetupProviderCore as r, buildPluginApi as s, resolvePluginSetupAutoEnableReasons as t };
