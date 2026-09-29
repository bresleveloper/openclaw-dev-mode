import { s as runWithTrackedCancellation } from "./async-work-scope-CWk2dk1h.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as withPluginRuntimePluginScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as getPluginInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { t as createInstalledPluginEnabledPredicate } from "./installed-plugin-index-D0kh4WcK.mjs";
import { l as normalizePluginsConfig, t as applyTestPluginDefaults } from "./config-state-BEAL5gWH.mjs";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-DFVWJ-hh.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { n as isManifestPluginAvailableForControlPlane, o as loadManifestContractSnapshot } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { i as isInvalidConfigError } from "./io.invalid-config-Deld-wtR.mjs";
import { i as capturePluginLifecycleAuthority } from "./registry-lifecycle-BhTDZAHB.mjs";
import { J as findUndeclaredPluginToolNames, t as acquirePluginRegistryForInspection } from "./loader-runtime-load-XbrcYJWd.mjs";
import { r as getLoadedRuntimePluginRegistry, t as createRuntimePluginManifestLookup } from "./active-runtime-registry-BttqxLSq.mjs";
import { a as setPluginRuntimeLoadContext, t as buildPluginRuntimeLoadOptions } from "./load-context-D-CZ4KSw.mjs";
import { r as loadPluginRegistryHandle } from "./loader-Vq3hhSQk.mjs";
import { t as resolvePluginRuntimeLoadContext } from "./load-context.resolve-DBcPAExA.mjs";
import { a as setPluginToolMeta, n as copyPluginToolMeta } from "./tool-metadata-DpaqT_qU.mjs";
import { t as hasManifestToolAvailability } from "./manifest-tool-availability-oo2-35Db.mjs";
import { n as createPluginToolAllowlist } from "./tool-grant-allowlist-GtrQVhRk.mjs";
import { t as normalizeConversationReadInvocationOrigin } from "./conversation-read-origin-E3olMOwo.mjs";
//#region src/plugins/compat/conversation-read-tools.ts
const HOST_RESTRICTED_CONVERSATION_READ_TOOLS = /* @__PURE__ */ new Set(["feishu:feishu_chat"]);
function normalizeContractName(value) {
	return value.trim().toLowerCase();
}
function isHostRestrictedConversationReadTool(params) {
	return HOST_RESTRICTED_CONVERSATION_READ_TOOLS.has(`${normalizeContractName(params.pluginId)}:${normalizeContractName(params.toolName)}`);
}
function registrationIncludesHostRestrictedConversationReadTool(entry) {
	return (entry.names.length > 0 ? entry.names : entry.declaredNames ?? []).some((toolName) => isHostRestrictedConversationReadTool({
		pluginId: entry.pluginId,
		toolName
	}));
}
function isBundledConversationReadToolRegistration(params) {
	return params.entry.origin === "bundled" && params.manifestPlugin?.origin === "bundled";
}
//#endregion
//#region src/plugins/tool-factory-context.ts
/** One binding supplies both the factory's final-effect guard and its retained callbacks. */
function createPluginToolFactoryContext(params) {
	const { entry, registry, context } = params;
	const record = registry.plugins.find((candidate) => candidate.id === entry.pluginId);
	const authority = capturePluginLifecycleAuthority(registry, record, { scopedRuntime: true });
	const continuation = entry.contextVersion === 2 ? params.ownerContinuation : void 0;
	const assertInvocationCurrent = () => {
		if (!authority?.()) throw new Error(`Plugin "${entry.pluginId}" tool runtime is no longer active.`);
		if (entry.contextVersion === 2 && !params.assertInvocationCurrent && !continuation) throw new Error("Plugin tool invocation authority is unavailable outside an admitted run or request");
		params.assertInvocationCurrent?.();
		continuation?.assertCurrent();
	};
	return {
		...context,
		...continuation ? {
			requesterSenderId: continuation.senderId,
			messageChannel: continuation.channel,
			agentAccountId: continuation.accountId
		} : {},
		get senderIsOwner() {
			return continuation ? continuation.isCurrent() : context.senderIsOwner;
		},
		assertInvocationCurrent
	};
}
//#endregion
//#region src/plugins/tool-factory-runtime.ts
/** Invokes current-context plugin tool factories and reports one assembly's timings. */
const log = createSubsystemLogger("plugins/tools");
const PLUGIN_TOOL_FACTORY_WARN_TOTAL_MS = 5e3;
const PLUGIN_TOOL_FACTORY_WARN_FACTORY_MS = 1e3;
const PLUGIN_TOOL_FACTORY_SUMMARY_LIMIT = 20;
function formatPluginToolFactoryTiming(timing) {
	const names = timing.names.length > 0 ? timing.names.join("|") : "-";
	return [
		`${timing.pluginId}:${timing.durationMs}ms@${timing.elapsedMs}ms`,
		`names=[${names}]`,
		`result=${timing.result}`,
		`count=${timing.resultCount}`,
		`optional=${String(timing.optional)}`
	].join(" ");
}
function runWithPluginToolScope(entry, registry, run) {
	return withPluginRuntimePluginScope({
		pluginId: entry.pluginId,
		pluginSource: entry.source
	}, run, registry);
}
/** Callback availability is captured once; missing records must never become a fallback after removal. */
function bindPluginToolCallbacks(entry, registry, tool, assertInvocationCurrent) {
	const record = registry.plugins.find((candidate) => candidate.id === entry.pluginId);
	const authority = capturePluginLifecycleAuthority(registry, record, { scopedRuntime: true });
	const invoke = (run) => {
		if (!authority?.()) throw new Error(`Plugin "${entry.pluginId}" tool runtime is no longer active.`);
		assertInvocationCurrent?.();
		const result = runWithPluginToolScope(entry, registry, run);
		if (assertInvocationCurrent && isPromiseLike(result)) return Promise.resolve(result).then((value) => {
			assertInvocationCurrent();
			return value;
		});
		assertInvocationCurrent?.();
		return result;
	};
	const prepare = tool.prepareArguments;
	const callbacks = {
		execute: async (...args) => invoke(() => {
			const [toolCallId, params, signal, onUpdate] = args;
			const execute = (executionSignal) => tool.execute(toolCallId, params, executionSignal, onUpdate);
			return signal ? runWithTrackedCancellation(signal, execute) : execute();
		}),
		...prepare ? { prepareArguments: (args) => invoke(() => prepare.call(tool, args)) } : {}
	};
	const wrapped = new Proxy(Object.create(Object.getPrototypeOf(tool)), {
		get(target, key, receiver) {
			if (Object.hasOwn(target, key)) return Reflect.get(target, key, receiver);
			return Object.hasOwn(callbacks, key) ? Reflect.get(callbacks, key) : Reflect.get(tool, key, tool);
		},
		has: (target, key) => Reflect.has(target, key) || Reflect.has(tool, key),
		ownKeys: (target) => [.../* @__PURE__ */ new Set([...Reflect.ownKeys(tool), ...Reflect.ownKeys(target)])],
		getOwnPropertyDescriptor(target, key) {
			const local = Reflect.getOwnPropertyDescriptor(target, key);
			if (local) return local;
			const source = Reflect.getOwnPropertyDescriptor(tool, key);
			if (!source) return;
			if (Object.hasOwn(callbacks, key)) return {
				configurable: true,
				enumerable: source.enumerable,
				writable: true,
				value: Reflect.get(callbacks, key)
			};
			return "value" in source ? {
				...source,
				configurable: true
			} : {
				...source,
				configurable: true,
				get: source.get ? () => Reflect.get(tool, key, tool) : void 0,
				set: source.set ? (value) => {
					Reflect.set(tool, key, value, tool);
				} : void 0
			};
		},
		set: (target, key, value, receiver) => Object.hasOwn(target, key) ? Reflect.set(target, key, value, receiver) : Reflect.set(tool, key, value, tool),
		deleteProperty: (target, key) => Object.hasOwn(target, key) ? Reflect.deleteProperty(target, key) : Reflect.deleteProperty(tool, key),
		preventExtensions: () => false
	});
	copyPluginToolMeta(tool, wrapped);
	return wrapped;
}
function createPluginToolFactoryResolver(logError) {
	const factoryTimingStartedAt = Date.now();
	const factoryTimings = [];
	const formatTimingSummary = (totalMs) => {
		const ranked = factoryTimings.toSorted((left, right) => right.durationMs - left.durationMs || left.pluginId.localeCompare(right.pluginId)).slice(0, PLUGIN_TOOL_FACTORY_SUMMARY_LIMIT);
		const omitted = factoryTimings.length - ranked.length;
		const factories = ranked.map(formatPluginToolFactoryTiming).join(", ");
		return [
			"[trace:plugin-tools] factory timings",
			`totalMs=${totalMs}`,
			`factoryCount=${factoryTimings.length}`,
			`shown=${ranked.length}`,
			`omitted=${omitted}`,
			`factories=${factories}`
		].join(" ");
	};
	return {
		resolve(entry, ctx, declaredNames, registry) {
			let resolved = null;
			let failed = false;
			const factoryStartedAt = Date.now();
			try {
				resolved = runWithPluginToolScope(entry, registry, () => entry.factory(ctx));
			} catch (err) {
				failed = true;
				if (!(isInvalidConfigError(err) && err.diagnosticEmitted)) logError(`plugin tool failed (${entry.pluginId}): ${formatErrorMessage(err)}`);
			}
			const factoryEndedAt = Date.now();
			factoryTimings.push({
				pluginId: entry.pluginId,
				names: declaredNames,
				durationMs: Math.max(0, factoryEndedAt - factoryStartedAt),
				elapsedMs: Math.max(0, factoryEndedAt - factoryTimingStartedAt),
				result: failed ? "error" : !resolved ? "null" : Array.isArray(resolved) ? "array" : "single",
				resultCount: failed || !resolved ? 0 : Array.isArray(resolved) ? resolved.length : 1,
				optional: entry.optional
			});
			return {
				resolved,
				failed
			};
		},
		report() {
			const last = factoryTimings.at(-1);
			if (last) {
				if (last.elapsedMs >= PLUGIN_TOOL_FACTORY_WARN_TOTAL_MS || factoryTimings.some((timing) => timing.durationMs >= PLUGIN_TOOL_FACTORY_WARN_FACTORY_MS)) log.warn(formatTimingSummary(last.elapsedMs));
				else if (log.isEnabled("trace")) log.trace(formatTimingSummary(last.elapsedMs));
			}
		}
	};
}
//#endregion
//#region src/plugins/tools.ts
/** Builds agent tools registered by plugins, preserving plugin scope around callbacks and descriptors. */
function normalizeDenylist(list) {
	return compileGlobPatterns({
		raw: list,
		normalize: normalizeToolPolicyName
	});
}
function denylistBlocksName(name, denylist) {
	const normalized = normalizeToolPolicyName(name);
	return normalized ? matchesAnyGlobPattern(normalized, denylist) : false;
}
function denylistBlocksPlugin(params) {
	return denylistBlocksName(params.pluginId, params.denylist) || matchesAnyGlobPattern("group:plugins", params.denylist);
}
function inspectPluginTool(tool, name, clientCaps, entry, registry, assertInvocationCurrent) {
	try {
		if (!isRecord(tool)) return { error: "tool must be an object" };
		const requiredClientCaps = tool.requiredClientCaps;
		const validCaps = Array.isArray(requiredClientCaps) && requiredClientCaps.every((requiredCap) => typeof requiredCap === "string");
		if (validCaps && requiredClientCaps.some((requiredCap) => !clientCaps.has(requiredCap))) return null;
		const error = !name ? "missing non-empty name" : typeof tool.execute !== "function" ? `${name} missing execute function` : !isRecord(tool.parameters) ? `${name} missing parameters object` : requiredClientCaps !== void 0 && !validCaps ? `${name} requiredClientCaps must be an array of strings` : void 0;
		return error ? { error } : { tool: bindPluginToolCallbacks(entry, registry, tool, assertInvocationCurrent) };
	} catch (error) {
		return { error: formatErrorMessage(error) };
	}
}
function filterManifestToolNamesForAvailability(params) {
	return params.toolNames.filter((toolName) => hasManifestToolAvailability({
		...params,
		toolNames: [toolName]
	}));
}
function resolvePluginToolPluginIds(params) {
	const selected = [];
	const denylist = normalizeDenylist(params.toolDenylist);
	const normalizedPlugins = normalizePluginsConfig(params.config?.plugins);
	const snapshot = params.snapshot;
	const isInstalledPluginEnabled = createInstalledPluginEnabledPredicate(snapshot.index.plugins, params.config);
	for (const plugin of snapshot.plugins) {
		if (!isManifestPluginAvailableForControlPlane({
			snapshot,
			plugin,
			config: params.config,
			normalizedConfig: normalizedPlugins,
			isInstalledPluginEnabled
		})) continue;
		if (denylistBlocksPlugin({
			pluginId: plugin.id,
			denylist
		})) continue;
		const allowsPlugin = params.allowlist.allowsPlugin(plugin.id);
		const toolNames = (plugin.contracts?.tools ?? []).filter((name) => (allowsPlugin || params.allowlist.includesDefaults && plugin.toolMetadata?.[name]?.optional !== true || params.allowlist.allowsTool(plugin.id, name)) && !denylistBlocksName(name, denylist));
		if (hasManifestToolAvailability({
			plugin,
			toolNames,
			config: params.availabilityConfig ?? params.config,
			env: params.env,
			hasAuthForProvider: params.hasAuthForProvider
		})) selected.push(plugin.id);
	}
	return [...new Set(selected)].toSorted((a, b) => a.localeCompare(b));
}
function resolvePluginToolLoadState(params) {
	const env = params.env ?? process.env;
	const baseConfig = applyTestPluginDefaults(params.context.config ?? {}, env);
	const preparedLoadContext = params.preparedRuntime?.loadContext;
	const usePreparedRuntime = preparedLoadContext !== void 0 && env === preparedLoadContext.env;
	const context = usePreparedRuntime ? preparedLoadContext : resolvePluginRuntimeLoadContext({
		config: baseConfig,
		env,
		workspaceDir: params.context.workspaceDir
	});
	if (context.config.plugins?.enabled === false) return;
	const runtimeOptions = params.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : void 0;
	const snapshot = usePreparedRuntime && params.preparedRuntime ? params.preparedRuntime.metadataSnapshot : loadManifestContractSnapshot({
		config: context.config,
		workspaceDir: context.workspaceDir,
		env
	});
	const allowlist = createPluginToolAllowlist(params.toolAllowlist);
	const onlyPluginIds = resolvePluginToolPluginIds({
		config: context.config,
		availabilityConfig: params.context.runtimeConfig ?? context.config,
		env,
		allowlist,
		toolDenylist: params.toolDenylist,
		hasAuthForProvider: params.hasAuthForProvider,
		snapshot
	});
	return {
		context,
		env,
		loadOptions: buildPluginRuntimeLoadOptions(context, {
			activate: false,
			toolDiscovery: true,
			onlyPluginIds,
			runtimeOptions
		}),
		onlyPluginIds,
		allowlist,
		snapshot
	};
}
function ensureStandalonePluginToolRegistryLoaded(params) {
	const loadState = resolvePluginToolLoadState(params);
	if (!loadState) return;
	return loadPluginRegistryHandle(loadState.loadOptions);
}
function recordToolDiagnostic(registry, diagnostic) {
	if (!registry.diagnostics.some((entry) => entry.level === diagnostic.level && entry.pluginId === diagnostic.pluginId && entry.source === diagnostic.source && entry.message === diagnostic.message)) registry.diagnostics.push(diagnostic);
}
const inspectionToolOwners = /* @__PURE__ */ new WeakMap();
function samePluginToolSource(left, right) {
	return Boolean(left && right && left.origin === right.origin && left.rootDir === right.rootDir && left.source === right.source && left.setupSource === right.setupSource && left.sourcePreferred === true === (right.sourcePreferred === true) && left.packageManifest?.build?.bundledDist === false === (right.packageManifest?.build?.bundledDist === false));
}
/** One inspection owns registration; each selected agent still invokes its own tool factories. */
async function acquirePluginToolInspectionRegistry(params) {
	const inventory = new Map((params.loadContext.manifestRegistry?.plugins ?? []).map((plugin) => [plugin.id, plugin]));
	const selected = /* @__PURE__ */ new Map();
	for (const scope of params.scopes) {
		const select = () => resolvePluginToolLoadState({
			...scope,
			env: params.loadContext.env
		});
		const state = params.runWithPluginMetadataSnapshot ? params.runWithPluginMetadataSnapshot({
			config: scope.context.config ?? params.loadContext.rawConfig,
			workspaceDir: scope.context.workspaceDir
		}, select) : select();
		for (const id of state?.onlyPluginIds ?? []) {
			const manifest = inventory.get(id);
			if (!manifest || !samePluginToolSource(manifest, state?.snapshot.byPluginId.get(id))) throw new Error(`Plugin tool inspection has conflicting source ownership for ${id}`);
			selected.set(id, manifest);
		}
	}
	if (selected.size === 0) return { release: async () => {} };
	const acquisition = await acquirePluginRegistryForInspection(buildPluginRuntimeLoadOptions(params.loadContext, {
		onlyPluginIds: [...selected.keys()].toSorted(),
		toolDiscovery: true,
		runtimeSideEffects: false,
		...params.scopes.some((scope) => scope.allowGatewaySubagentBinding) ? { runtimeOptions: { allowGatewaySubagentBinding: true } } : {}
	}));
	try {
		setPluginRuntimeLoadContext(acquisition.registry, params.loadContext);
		const current = capturePluginLifecycleAuthority(acquisition.registry, void 0, { scopedRuntime: true });
		inspectionToolOwners.set(acquisition.registry, {
			manifests: selected,
			assertCurrent: () => {
				if (!current?.()) throw new Error("Plugin tool inspection has been released");
			}
		});
		return acquisition;
	} catch (error) {
		try {
			await acquisition.release();
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], "Plugin tool inspection setup and cleanup failed", { cause: cleanupError });
		}
		throw error;
	}
}
/** The serving owner retains this view before invoking factories or applying tool policy. */
async function acquireStandalonePluginToolRegistry(params) {
	const loadState = resolvePluginToolLoadState(params);
	if (!loadState || loadState.onlyPluginIds.length === 0) return {
		resolveTools: () => [],
		release: async () => {}
	};
	const acquisition = await acquirePluginRegistryForInspection(loadState.loadOptions);
	const hasAuthority = capturePluginLifecycleAuthority(acquisition.registry, void 0, { scopedRuntime: true });
	return {
		...acquisition,
		resolveTools: () => {
			if (!hasAuthority?.()) throw new Error("Plugin tool registry has been released");
			return resolvePluginToolsFromRegistry({
				...params,
				runtimeRegistry: acquisition.registry
			}, loadState);
		}
	};
}
function resolvePluginTools(params) {
	const loadState = resolvePluginToolLoadState(params);
	return loadState && loadState.onlyPluginIds.length > 0 ? resolvePluginToolsFromRegistry(params, loadState) : [];
}
function resolvePluginToolsFromRegistry(params, loadState) {
	const { context, env, onlyPluginIds, allowlist, snapshot } = loadState;
	const tools = [];
	const existing = params.existingToolNames ?? /* @__PURE__ */ new Set();
	const existingNormalized = new Set(Array.from(existing, (tool) => normalizeToolPolicyName(tool)));
	const pluginToolOwnersByName = /* @__PURE__ */ new Map();
	const denylist = normalizeDenylist(params.toolDenylist);
	const clientCaps = new Set(params.clientCaps ?? []);
	const runtimeRegistry = (context === params.preparedRuntime?.loadContext ? params.preparedRuntime.registry : params.runtimeRegistry) ?? getLoadedRuntimePluginRegistry({ workspaceDir: context.workspaceDir });
	const inspection = runtimeRegistry && inspectionToolOwners.get(runtimeRegistry);
	inspection?.assertCurrent();
	const toolOwners = /* @__PURE__ */ new Map();
	const findRuntimeOwner = runtimeRegistry ? createRuntimePluginManifestLookup(runtimeRegistry, snapshot.plugins) : void 0;
	for (const pluginId of onlyPluginIds) {
		const record = findRuntimeOwner?.(pluginId);
		const instance = record && getPluginInstance(record);
		if (runtimeRegistry && instance && (instance.toolRegistrationComplete || runtimeRegistry.tools.some((entry) => entry.pluginId === pluginId))) toolOwners.set(pluginId, {
			registry: runtimeRegistry,
			tools: []
		});
	}
	const missingPluginIds = onlyPluginIds.filter((pluginId) => !toolOwners.has(pluginId) && !samePluginToolSource(inspection?.manifests.get(pluginId), snapshot.byPluginId.get(pluginId)));
	if (missingPluginIds.length > 0) {
		const registry = loadPluginRegistryHandle({
			...loadState.loadOptions,
			onlyPluginIds: missingPluginIds
		});
		for (const pluginId of missingPluginIds) toolOwners.set(pluginId, {
			registry,
			tools: []
		});
	}
	for (const registry of new Set(Array.from(toolOwners.values(), (owner) => owner.registry))) for (const entry of registry.tools) {
		const owner = toolOwners.get(entry.pluginId);
		if (owner?.registry === registry) owner.tools.push(entry);
	}
	const blockedPlugins = /* @__PURE__ */ new Set();
	const factories = createPluginToolFactoryResolver((message) => context.logger.error(message));
	const orderedManifests = loadState.loadOptions.manifestRegistry?.plugins ?? snapshot.plugins;
	for (const { id: pluginId } of orderedManifests) {
		const owner = toolOwners.get(pluginId);
		if (!owner) continue;
		toolOwners.delete(pluginId);
		const { registry, tools: registrations } = owner;
		const reportError = (entry, message) => {
			context.logger.error(message);
			recordToolDiagnostic(registry, {
				level: "error",
				pluginId: entry.pluginId,
				source: entry.source,
				message
			});
		};
		if (registrations.length === 0) recordToolDiagnostic(registry, {
			level: "warn",
			pluginId,
			source: "plugin-tools",
			message: `plugin tool registry did not include selected plugin tools after cold load (${pluginId})`
		});
		for (const entry of registrations) {
			if (denylistBlocksPlugin({
				pluginId: entry.pluginId,
				denylist
			})) continue;
			if (blockedPlugins.has(entry.pluginId)) continue;
			const pluginIdKey = normalizeToolPolicyName(entry.pluginId);
			if (existingNormalized.has(pluginIdKey) && pluginToolOwnersByName.get(pluginIdKey) !== entry.pluginId) {
				const message = `plugin id conflicts with core tool name (${entry.pluginId})`;
				if (!params.suppressNameConflicts) reportError(entry, message);
				blockedPlugins.add(entry.pluginId);
				continue;
			}
			const manifestPlugin = snapshot.byPluginId.get(entry.pluginId);
			const declaredNames = entry.names ?? [];
			const availabilityNames = declaredNames.length > 0 ? declaredNames : entry.declaredNames ?? [];
			const allowlistNames = manifestPlugin ? filterManifestToolNamesForAvailability({
				plugin: manifestPlugin,
				toolNames: availabilityNames,
				config: params.context.runtimeConfig ?? context.config,
				env,
				hasAuthForProvider: params.hasAuthForProvider
			}).filter((toolName) => !denylistBlocksName(toolName, denylist)) : declaredNames;
			if (manifestPlugin && availabilityNames.length > 0 && allowlistNames.length === 0) continue;
			if (!(!entry.optional && allowlist.includesDefaults || allowlist.size > 0 && (allowlistNames.length === 0 || allowlistNames.some((name) => allowlist.allowsTool(entry.pluginId, name))))) continue;
			const restrictConversationRead = normalizeConversationReadInvocationOrigin(params.context.conversationReadOrigin) !== "direct-operator" && !isBundledConversationReadToolRegistration({
				entry,
				manifestPlugin
			});
			if (restrictConversationRead && registrationIncludesHostRestrictedConversationReadTool(entry)) continue;
			const factoryContext = createPluginToolFactoryContext({
				entry,
				registry: owner.registry,
				context: params.context,
				assertInvocationCurrent: params.assertInvocationCurrent,
				ownerContinuation: params.ownerContinuation
			});
			params.assertInvocationCurrent?.();
			const factoryResult = factories.resolve(entry, factoryContext, declaredNames, owner.registry);
			if (factoryResult.failed) continue;
			const { resolved } = factoryResult;
			if (!resolved) {
				if (declaredNames.length > 0) context.logger.debug?.(`plugin tool factory returned null (${entry.pluginId}): [${declaredNames.join(", ")}]`);
				continue;
			}
			const selectedManifestToolNames = manifestPlugin && availabilityNames.length > 0 ? new Set(allowlistNames.map((name) => normalizeToolPolicyName(name))) : void 0;
			const manifestContractToolNames = manifestPlugin && availabilityNames.length > 0 ? new Set(availabilityNames.map((name) => normalizeToolPolicyName(name))) : void 0;
			for (const toolRaw of Array.isArray(resolved) ? resolved : [resolved]) {
				let rawName;
				try {
					rawName = isRecord(toolRaw) ? toolRaw.name : void 0;
				} catch (error) {
					reportError(entry, `plugin tool is malformed (${entry.pluginId}): ${formatErrorMessage(error)}`);
					continue;
				}
				const name = typeof rawName === "string" ? rawName : "";
				const toolName = name.trim();
				const normalizedToolName = normalizeToolPolicyName(name);
				if (manifestPlugin && (manifestPlugin.toolMetadata?.[toolName]?.optional === true && !allowlist.allowsTool(entry.pluginId, toolName) || selectedManifestToolNames && manifestContractToolNames?.has(normalizedToolName) && !selectedManifestToolNames.has(normalizedToolName) || !hasManifestToolAvailability({
					plugin: manifestPlugin,
					toolNames: [toolName],
					config: params.context.runtimeConfig ?? context.config,
					env,
					hasAuthForProvider: params.hasAuthForProvider
				}))) continue;
				if (denylistBlocksName(toolName, denylist) || entry.optional && !allowlist.allowsTool(entry.pluginId, toolName) || restrictConversationRead && isHostRestrictedConversationReadTool({
					pluginId: entry.pluginId,
					toolName
				})) continue;
				const inspected = inspectPluginTool(toolRaw, toolName, clientCaps, entry, owner.registry, factoryContext.assertInvocationCurrent);
				if (!inspected) continue;
				if ("error" in inspected) {
					reportError(entry, `plugin tool is malformed (${entry.pluginId}): ${inspected.error}`);
					continue;
				}
				const tool = inspected.tool;
				const undeclared = entry.declaredNames ? findUndeclaredPluginToolNames({
					declaredNames: entry.declaredNames,
					toolNames: [name]
				}) : [];
				if (undeclared.length > 0) {
					reportError(entry, `plugin tool is undeclared (${entry.pluginId}): ${undeclared.join(", ")}`);
					continue;
				}
				if (existingNormalized.has(normalizedToolName)) {
					const message = `plugin tool name conflict (${entry.pluginId}): ${name}`;
					if (!params.suppressNameConflicts) reportError(entry, message);
					continue;
				}
				existing.add(name);
				existingNormalized.add(normalizedToolName);
				pluginToolOwnersByName.set(normalizedToolName, entry.pluginId);
				const metadata = manifestPlugin?.toolMetadata?.[name];
				setPluginToolMeta(tool, {
					pluginId: entry.pluginId,
					...manifestPlugin?.kind ? { kind: manifestPlugin.kind } : {},
					optional: entry.optional || metadata?.optional === true,
					replaySafe: metadata?.replaySafe === true,
					sideEffecting: metadata?.sideEffecting === true,
					trustedLocalMedia: manifestPlugin?.origin === "bundled" && manifestPlugin.contracts?.tools?.includes(name) === true
				});
				tools.push(tool);
			}
		}
	}
	factories.report();
	return tools;
}
//#endregion
export { resolvePluginTools as i, acquireStandalonePluginToolRegistry as n, ensureStandalonePluginToolRegistryLoaded as r, acquirePluginToolInspectionRegistry as t };
