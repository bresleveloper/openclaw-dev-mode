import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-Mkqqbxs_.mjs";
import "./generation-scope-DkeaMJw8.mjs";
import { h as isPluginRegistryRetired } from "./registry-lifecycle-xdpzLZzd.mjs";
import { l as getActivePluginRegistry } from "./runtime-B2zZQffc.mjs";
import { t as createHookRunner } from "./hooks-DuXrq03h.mjs";
const hookRunnerGlobalState = resolveGlobalSingleton(Symbol.for("openclaw.plugins.hook-runner-global-state"), () => ({
	hookRunner: null,
	registry: null
}), (state) => {
	state.registry = null;
}, "plugin-registry");
function resolveRootHookRegistry(state) {
	const activeRegistry = getActivePluginRegistry();
	const initializedRegistry = state.registry && !isPluginRegistryRetired(state.registry) ? state.registry : null;
	if (!initializedRegistry || initializedRegistry === activeRegistry) return activeRegistry ?? initializedRegistry;
	return overlayHookRegistries(activeRegistry, initializedRegistry);
}
function overlayHookRegistries(baseRegistry, overlayRegistry) {
	if (!overlayRegistry || overlayRegistry === baseRegistry) return baseRegistry;
	if (!baseRegistry) return overlayRegistry;
	const overlayPluginIds = new Set(overlayRegistry.plugins.map((plugin) => plugin.id));
	const overlayLegacyHookEvents = /* @__PURE__ */ new Map();
	for (const hook of overlayRegistry.hooks) {
		if (!Array.isArray(hook.events)) continue;
		const events = overlayLegacyHookEvents.get(hook.pluginId) ?? /* @__PURE__ */ new Set();
		for (const event of hook.events) events.add(event);
		overlayLegacyHookEvents.set(hook.pluginId, events);
	}
	const overlayTypedHooks = new Set(overlayRegistry.typedHooks.map((hook) => `${hook.pluginId}\0${hook.hookName}`));
	const overlayTrustedPolicies = new Set((overlayRegistry.trustedToolPolicies ?? []).map((entry) => `${entry.pluginId}\0${entry.policy.id}`));
	const trustedToolPolicies = [...(baseRegistry.trustedToolPolicies ?? []).filter((entry) => !overlayTrustedPolicies.has(`${entry.pluginId}\0${entry.policy.id}`)), ...overlayRegistry.trustedToolPolicies ?? []].toSorted((left, right) => {
		return (left.origin === "bundled" ? 0 : 1) - (right.origin === "bundled" ? 0 : 1);
	});
	return {
		hooks: [...baseRegistry.hooks.flatMap((hook) => {
			const overlayEvents = overlayLegacyHookEvents.get(hook.pluginId);
			if (!overlayEvents || !Array.isArray(hook.events)) return hook;
			const events = hook.events.filter((event) => !overlayEvents.has(event));
			return events.length === 0 ? [] : [{
				...hook,
				events
			}];
		}), ...overlayRegistry.hooks],
		typedHooks: [...baseRegistry.typedHooks.filter((hook) => !overlayTypedHooks.has(`${hook.pluginId}\0${hook.hookName}`)), ...overlayRegistry.typedHooks],
		plugins: [...baseRegistry.plugins.filter((plugin) => !overlayPluginIds.has(plugin.id)), ...overlayRegistry.plugins],
		trustedToolPolicies
	};
}
function resolveHookRegistry(state) {
	const generationRegistry = getPluginRuntimeGenerationRegistry();
	if (generationRegistry) return generationRegistry;
	return overlayHookRegistries(resolveRootHookRegistry(state), getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? null);
}
function createLiveHookRegistryFacade(state) {
	return {
		get hooks() {
			return resolveHookRegistry(state)?.hooks ?? [];
		},
		get typedHooks() {
			return resolveHookRegistry(state)?.typedHooks ?? [];
		},
		get plugins() {
			return resolveHookRegistry(state)?.plugins ?? [];
		},
		get trustedToolPolicies() {
			return resolveHookRegistry(state)?.trustedToolPolicies ?? [];
		}
	};
}
/** Get the registry view that backs global hook dispatch. */
function getGlobalHookRunnerRegistry() {
	return resolveHookRegistry(hookRunnerGlobalState) ? createLiveHookRegistryFacade(hookRunnerGlobalState) : null;
}
//#endregion
//#region src/plugins/hook-runner-global.ts
const getLog = () => createSubsystemLogger("plugins");
/**
* Initialize the global hook runner with a plugin registry.
* Called on every plugin registry activation and by SDK consumers. The runner
* instance stays stable so references captured mid-run keep seeing current hooks.
*/
function initializeGlobalHookRunner(registry) {
	const log = getLog();
	hookRunnerGlobalState.registry = registry;
	if (!hookRunnerGlobalState.hookRunner) hookRunnerGlobalState.hookRunner = createHookRunner(createLiveHookRegistryFacade(hookRunnerGlobalState), {
		logger: {
			debug: (msg) => log.debug(msg),
			warn: (msg) => log.warn(msg),
			error: (msg) => log.error(msg)
		},
		catchErrors: true,
		failurePolicyByHook: {
			before_agent_run: "fail-closed",
			before_install: "fail-closed",
			before_tool_call: "fail-closed"
		}
	});
	const hookCount = registry.hooks.length;
	if (hookCount > 0) log.debug(`hook runner initialized with ${hookCount} registered hooks`);
}
/**
* Get the global hook runner.
* Returns null if plugins haven't been loaded yet.
*/
function getGlobalHookRunner() {
	return hookRunnerGlobalState.hookRunner;
}
/**
* Get the registry from the most recent activation or explicit initialization.
* Returns null if plugins haven't been loaded yet.
*/
function getGlobalPluginRegistry() {
	return hookRunnerGlobalState.registry;
}
/**
* Check if any hooks are registered for a given hook name.
*/
function hasGlobalHooks(hookName, ctx) {
	return hookRunnerGlobalState.hookRunner?.hasHooks(hookName, ctx) ?? false;
}
async function runGlobalGatewayStopSafely(params) {
	const log = getLog();
	const hookRunner = params.registry ? createHookRunner(params.registry, { logger: log }) : getGlobalHookRunner();
	if (!hookRunner?.hasHooks("gateway_stop")) return;
	try {
		await hookRunner.runGatewayStop(params.event, params.ctx);
	} catch (err) {
		if (params.onError) {
			params.onError(err);
			return;
		}
		log.warn(`gateway_stop hook failed: ${String(err)}`);
	}
}
/**
* Reset the global hook runner (for testing).
*/
function resetGlobalHookRunner() {
	hookRunnerGlobalState.hookRunner = null;
	hookRunnerGlobalState.registry = null;
}
//#endregion
export { resetGlobalHookRunner as a, initializeGlobalHookRunner as i, getGlobalPluginRegistry as n, runGlobalGatewayStopSafely as o, hasGlobalHooks as r, getGlobalHookRunnerRegistry as s, getGlobalHookRunner as t };
