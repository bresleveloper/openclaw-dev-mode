import { c as getPluginCache, d as getPluginCacheRoot, k as withPluginCache, m as getProcessPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-DjfKDZW8.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { h as resolvePreferredBundledRootArtifact, m as resolvePluginRuntimeExecutionArtifact } from "./bundled-dir-LfC_CFuw.mjs";
import { c as pluginInstanceState, o as getPluginValueInstance } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { s as tracePluginLifecyclePhase, t as discoverConfiguredPluginLoadPaths } from "./discovery-B5pUUvVG.mjs";
import { n as findUninspectedPluginDiagnostic } from "./discovery-availability-CEoTdFoo.mjs";
import { n as resolvePluginRootArtifactPath } from "./doctor-contract-artifact-CkzDe3D_.mjs";
import { o as selectInstalledPluginManifestRecords, r as loadPluginManifestRegistryForInstalledIndex, t as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-Cn4izUMk.mjs";
import { t as resolvePluginMetadataEnvFingerprint } from "./plugin-metadata-env-DDlhnyCt.mjs";
import { a as listSetupCliBackendIds, o as listSetupProviderIds } from "./plugin-metadata-provider-facts-dTlHNixc.mjs";
import "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { a as loadPluginRegistrySnapshotWithMetadata } from "./plugin-registry-snapshot-CR0J8rf8.mjs";
import { n as hasPluginConfigMigrationSource } from "./config-contract-matches-CYadf-lt.mjs";
import { t as getPluginSetupModuleLoader } from "./plugin-setup-module-B4MiOXOl.mjs";
import { t as resolvePluginModuleExport } from "./module-export-BbYMQUy2.mjs";
import { i as withPluginServiceSchedulerBinding, t as getPluginServiceSchedulerBinding } from "./service-scheduler-binding-BGIyG3K0.mjs";
import { t as applyPluginDoctorCompatibilitySequence } from "./doctor-compatibility-migration-B2hBndkx.mjs";
import "./plugin-registry-BKRXR0Si.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { types } from "node:util";
import { EventEmitter } from "node:events";
//#region src/plugins/cli-callback-binding.ts
const commands = /* @__PURE__ */ new WeakSet();
const parsers = /* @__PURE__ */ new WeakSet();
function bindCallback(value) {
	const instance = pluginInstanceInvocation.getStore()?.instance;
	if (typeof value !== "function" || !instance) return value;
	const scheduler = getPluginServiceSchedulerBinding();
	const bound = function(...args) {
		return withPluginServiceSchedulerBinding(scheduler, () => instance.run(() => Reflect.apply(value, this, args)));
	};
	return bound;
}
function bindCommandCallback(value, toCommandFailure) {
	const callback = bindCallback(value);
	if (callback === value || typeof callback !== "function") return value;
	const bound = function(...args) {
		try {
			const result = Reflect.apply(callback, this, args);
			return isPromiseLike(result) ? Promise.resolve(result).catch((error) => {
				throw toCommandFailure(error);
			}) : result;
		} catch (error) {
			throw toCommandFailure(error);
		}
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
				const descriptors = Object.fromEntries(Reflect.ownKeys(values).flatMap((arrayKey) => {
					const arrayDescriptor = Object.getOwnPropertyDescriptor(values, arrayKey);
					return arrayDescriptor ? [[arrayKey, arrayDescriptor]] : [];
				}));
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
function bindPreparedCommandCallbacks(program, toCommandFailure) {
	const bindSlot = (key, bind) => {
		const descriptor = Object.getOwnPropertyDescriptor(program, key);
		if (!descriptor || !("value" in descriptor)) throw new Error(`Unsupported native Commander callback slot: ${key}`);
		Object.defineProperty(program, key, {
			...descriptor,
			value: bind(descriptor.value)
		});
	};
	bindSlot("_actionHandler", (value) => bindCommandCallback(value, toCommandFailure));
	bindSlot("_exitCallback", bindCallback);
	bindStoredCallbackCollection(program, "_lifeCycleHooks", (value) => bindCommandCallback(value, toCommandFailure));
	program.configureHelp(bindConfiguration(program.configureHelp()));
	program.configureOutput(bindConfiguration(program.configureOutput()));
	for (const parser of [...program.options, ...program.registeredArguments]) bindParser(parser);
}
function bindPluginCliEvents(program, adoptPrepared) {
	const listenerOrigins = /* @__PURE__ */ new WeakMap();
	const wrapListener = (listener) => {
		const managed = bindCallback(listener);
		if (managed === listener) return listener;
		const bound = function(...args) {
			return Reflect.apply(managed, this, args);
		};
		Object.defineProperty(bound, "listener", { value: Reflect.get(listener, "listener") ?? listener });
		listenerOrigins.set(bound, listener);
		return bound;
	};
	if (adoptPrepared) bindStoredCallbackCollection(program, "_events", (listener) => typeof listener === "function" ? wrapListener(listener) : listener);
	for (const name of [
		"on",
		"addListener",
		"prependListener"
	]) {
		const method = program[name];
		program[name] = function(event, listener) {
			return method.call(this, event, wrapListener(listener));
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
function bindPluginCliProgram(program, toCommandFailure, adoptPrepared = false) {
	if (commands.has(program)) return;
	commands.add(program);
	const adopt = adoptPrepared && pluginInstanceInvocation.getStore()?.instance !== void 0;
	if (adopt) bindPreparedCommandCallbacks(program, toCommandFailure);
	for (const [name, callbackIndex] of [
		["action", 0],
		["hook", 1],
		["exitOverride", 0],
		["addHelpText", 1],
		["configureHelp", void 0],
		["configureOutput", void 0]
	]) {
		const method = program[name];
		Object.defineProperty(program, name, {
			configurable: true,
			writable: true,
			value(...args) {
				return Reflect.apply(method, this, args.map((arg, index) => callbackIndex === void 0 ? bindConfiguration(arg) : index === callbackIndex ? name === "action" || name === "hook" ? bindCommandCallback(arg, toCommandFailure) : bindCallback(arg) : arg));
			}
		});
	}
	if (program instanceof EventEmitter) bindPluginCliEvents(program, adopt);
	const createCommand = program.createCommand.bind(program);
	program.createCommand = function(name) {
		const command = createCommand.call(this, name);
		bindPluginCliProgram(command, toCommandFailure, true);
		return command;
	};
	const addCommand = program.addCommand.bind(program);
	program.addCommand = function(command, options) {
		bindPluginCliProgram(command, toCommandFailure, true);
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
	for (const command of program.commands) bindPluginCliProgram(command, toCommandFailure, adopt);
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
			steerActiveRun: (...args) => api.steerActiveRun(...args),
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
		if (key === "registerCli" || key === "registerNodeCliFeature") return (registrar, ...options) => instance.run(() => Reflect.apply(value, target, [instance.wrap(async (context) => {
			const [{ withPluginCliServiceScheduler }, { toPluginCommandFailure }] = await Promise.all([import("./cli-service-scheduler-Cypr5HmZ.mjs"), import("./failure-output-DuWfXOiW.mjs")]);
			return withPluginCliServiceScheduler(instance, () => {
				bindPluginCliProgram(context.program, toPluginCommandFailure);
				return registrar(context);
			});
		}), ...options.map((option) => instance.wrap(option))]));
		return (...args) => instance.run(() => Reflect.apply(value, target, args.map((arg) => identitySensitiveRegistrations.has(key) ? instance.adopt(arg) : instance.wrap(arg))));
	} }));
	pluginInstanceState.values.setHost(instrumented, instance);
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
	registerStorageProvider: () => {},
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
	registerAgentExecutorController: () => {},
	registerCodexAppServerExtensionFactory: () => {},
	registerAgentToolResultMiddleware: () => {},
	registerSessionExtension: () => {},
	enqueueNextTurnInjection: async (injection) => ({
		enqueued: false,
		id: "",
		sessionKey: injection.sessionKey
	}),
	steerActiveRun: async () => ({
		steered: false,
		reason: "not wired"
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
	"steerActiveRun",
	"getRunContext",
	"resolvePath",
	"sendSessionAttachment",
	"scheduleSessionTurn",
	"setRunContext",
	"unscheduleSessionTurnsByTag"
]);
function createGuardedPluginRegistrationApi(api) {
	let closed = false;
	const owner = getPluginValueInstance(api);
	return {
		api: attachPluginApiFacades(new Proxy(api, { get(target, prop, receiver) {
			const value = Reflect.get(target, prop, receiver);
			if (typeof value !== "function") return value;
			if (typeof prop === "string" && LATE_CALLABLE_PLUGIN_API_METHODS.has(prop)) return (...args) => Reflect.apply(value, target, args);
			return (...args) => {
				const caller = pluginInstanceInvocation.getStore()?.instance;
				if (caller && owner && caller !== owner) throw new Error(`Plugin ${owner.pluginId} API registration does not belong to the calling workspace generation`);
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
//#region src/plugins/cli-backend-registration.ts
function warnOnMissingCliBackendModelProvider(backend, warn) {
	if (!backend.modelProvider?.trim()) warn(`cli backend "${backend.id.trim()}" is missing modelProvider; provider-to-runtime binding will be skipped. Set modelProvider to the canonical model provider id to enable this binding.`);
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
const ORDERED_SETUP_API_EXTENSIONS = RUNNING_FROM_BUILT_ARTIFACT ? SETUP_API_EXTENSIONS : [...SETUP_API_EXTENSIONS.slice(3), ...SETUP_API_EXTENSIONS.slice(0, 3)];
const SETUP_API_PATHS = ["", "dist"].flatMap((directory) => ORDERED_SETUP_API_EXTENSIONS.map((extension) => path.join(directory, `setup-api${extension}`)));
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
			results: new LruCache(16)
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
	let modulePath = resolvePluginRootArtifactPath(rootDir, SETUP_API_PATHS);
	if (!modulePath && options?.includeBundledSourceFallback !== false) {
		const sourceExtensionRoot = path.resolve(path.dirname(CURRENT_MODULE_PATH), "..", "..", "extensions", path.basename(rootDir));
		if (sourceExtensionRoot !== rootDir) modulePath = resolvePluginRootArtifactPath(sourceExtensionRoot, SETUP_API_PATHS);
	}
	artifacts.set(key, modulePath ? {
		modulePath,
		boundaryRoot: path.dirname(modulePath)
	} : null);
	return modulePath;
}
function resolveRelevantSetupMigrationPluginIds(params) {
	const entries = params.config.plugins?.entries;
	const ids = new Set(entries && typeof entries === "object" ? normalizeStringEntries(Object.keys(entries)) : []);
	const plugins = loadSetupManifestRecords(params);
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
function loadSetupManifestRecords(params) {
	const { snapshot: index, manifestRegistry } = params.metadataSnapshot ? {
		snapshot: params.metadataSnapshot.index,
		manifestRegistry: params.metadataSnapshot.manifestRegistry
	} : loadPluginRegistrySnapshotWithMetadata(params);
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
function findUniqueSetupManifestOwner({ normalizedId, listIds, ...params }) {
	const matches = loadSetupManifestRecords(params).filter((entry) => listIds(entry).some((id) => normalizeProviderId(id) === normalizedId));
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
	if (!(params.record.setupSource ?? resolveSetupApiPath(params.record.rootDir, { includeBundledSourceFallback: false }))) return;
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
	const scopedPluginIds = params?.pluginIds ? new Set(normalizeStringEntries(params.pluginIds)) : null;
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
		if (cached) return cloneSetupRegistryValue(cached);
	}
	const providers = /* @__PURE__ */ new Map();
	const cliBackends = /* @__PURE__ */ new Map();
	const configMigrations = [];
	const autoEnableProbes = [];
	const diagnostics = [];
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
		const setupArtifact = resolveLoadableSetupRuntimeSource(record);
		if (!setupArtifact) continue;
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
			continue;
		}
		const instance = getPluginValueInstance(mod);
		const recordProviders = /* @__PURE__ */ new Map();
		const recordCliBackends = /* @__PURE__ */ new Map();
		const recordConfigMigrations = [];
		const recordAutoEnableProbes = [];
		const recordDiagnostics = [];
		const api = buildPluginApi({
			id: record.id,
			name: record.name ?? record.id,
			version: record.version,
			description: record.description,
			source: setupSource,
			rootDir: record.rootDir,
			registrationMode: "setup-only",
			config: {},
			runtime: createUnavailableRuntime("setup-only", record.id),
			logger: NOOP_LOGGER,
			resolvePath: (input) => input,
			handlers: {
				registerProvider(provider) {
					const key = `${record.id}:${normalizeProviderId(provider.id)}`;
					if (providers.has(key) || recordProviders.has(key)) return;
					recordProviders.set(key, {
						pluginId: record.id,
						provider
					});
				},
				registerCliBackend(backend) {
					const key = `${record.id}:${normalizeProviderId(backend.id)}`;
					if (cliBackends.has(key) || recordCliBackends.has(key)) return;
					warnOnMissingCliBackendModelProvider(backend, (message) => {
						recordDiagnostics.push({
							pluginId: record.id,
							code: "setup-cli-backend-missing-model-provider",
							runtimeId: backend.id,
							message
						});
					});
					recordCliBackends.set(key, {
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
			if (!moduleLoader.initialize(() => {
				const registrationApi = instrumentPluginInstanceApi(api, instance);
				const resolved = resolvePluginModuleExport(mod);
				if (!resolved.register || resolved.definition?.id && resolved.definition.id !== record.id) return false;
				runPluginRegistration(resolved.register.bind(resolved.definition), registrationApi, "ignore");
				return true;
			})) continue;
		} catch (error) {
			diagnostics.push({
				pluginId: record.id,
				code: "setup-registration-failed",
				message: `setup registration threw: ${formatErrorMessage(error)}`
			});
			continue;
		}
		diagnostics.push(...recordDiagnostics);
		configMigrations.push(...recordConfigMigrations);
		autoEnableProbes.push(...recordAutoEnableProbes);
		for (const [key, entry] of recordProviders) providers.set(key, entry);
		for (const [key, entry] of recordCliBackends) cliBackends.set(key, entry);
		pushSetupDescriptorDriftDiagnostics({
			record,
			providers: [...recordProviders.values()].map((entry) => entry.provider),
			cliBackends: [...recordCliBackends.values()].map((entry) => entry.backend),
			diagnostics
		});
	}
	const registry = {
		providers: [...providers.values()],
		cliBackends: [...cliBackends.values()],
		configMigrations,
		autoEnableProbes,
		diagnostics
	};
	for (const diagnostic of diagnostics) log.warn(`plugin setup [${diagnostic.pluginId}] ${diagnostic.code}: ${diagnostic.message}`);
	if (resultCacheKey === null) return registry;
	resultCache.set(resultCacheKey, cloneSetupRegistryValue(registry));
	return registry;
});
const resolvePluginSetupProviderCore = withPluginSetupCache(function(params) {
	const env = params.env ?? process.env;
	const normalizedProvider = normalizeProviderId(params.provider);
	const record = findUniqueSetupManifestOwner({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env,
		pluginIds: params.pluginIds,
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
		config: params.config,
		workspaceDir: params.workspaceDir,
		env,
		metadataSnapshot: params.metadataSnapshot,
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
	const pluginIds = resolveRelevantSetupMigrationPluginIds(params);
	return applyPluginDoctorCompatibilitySequence(params.config, resolvePluginSetupRegistry({
		...params,
		pluginIds
	}).configMigrations.map((entry) => ({
		pluginId: entry.pluginId,
		normalizeCompatibilityConfig: ({ cfg }) => entry.migrate(cfg) ?? {
			config: cfg,
			changes: []
		}
	})));
});
const resolvePluginSetupAutoEnableReasons = withPluginSetupCache(function(params) {
	const env = params.env ?? process.env;
	const reasons = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of resolvePluginSetupRegistry(params).autoEnableProbes) {
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
export { runPluginSetupConfigMigrations as a, buildPluginApi as c, resolvePluginSetupRegistry as i, createUnavailableRuntime as l, resolvePluginSetupCliBackend as n, warnOnMissingCliBackendModelProvider as o, resolvePluginSetupProviderCore as r, runPluginRegistration as s, resolvePluginSetupAutoEnableReasons as t, instrumentPluginInstanceApi as u };
