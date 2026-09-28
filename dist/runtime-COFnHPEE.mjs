import { r as getPluginRegistryState } from "./runtime-state-C5tDvNBc.mjs";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { a as capturePluginRegistryLifecycleEpoch, i as capturePluginLifecycleAuthority, o as capturePluginRegistryLifecycleSignal, u as getPluginRegistryResourceOwner } from "./registry-lifecycle-xdpzLZzd.mjs";
import { n as withPluginHostCleanupTimeout } from "./host-hook-cleanup-timeout-CuGfY1se.mjs";
import { n as resolveDecisionModelSetting } from "./decision-model-setting-BX2feN2y.mjs";
import { n as validateDecisionBatch, t as DecisionContractError } from "./validation-DRK4SBoT.mjs";
//#region src/decisions/runtime.ts
/** Core calls carry their owner's abort signal; plugin callers additionally bind their exact instance. */
async function evaluateDecision(batch, options) {
	return evaluateDecisionInRegistry(batch, options, getPluginRegistryForContext(), getRuntimeConfig());
}
async function evaluateDecisionInRegistry(batch, options, registry, config, consumerId) {
	if (!options || options.agentId !== void 0 && (typeof options.agentId !== "string" || !options.agentId.trim()) || typeof options.purpose !== "string" || !options.purpose || options.purpose.length > 128 || typeof options.rubricVersion !== "string" || !options.rubricVersion || options.rubricVersion.length > 128 || !Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0 || !(options.signal instanceof AbortSignal)) throw new DecisionContractError();
	options.signal.throwIfAborted();
	if (!validateDecisionBatch(batch)) return {
		status: "unavailable",
		reason: "unsupported-input"
	};
	const selected = resolveDecisionModelSetting(config, options.agentId);
	if (!selected) return {
		status: "unavailable",
		reason: "disabled"
	};
	if (config.plugins?.enabled === false) return {
		status: "unavailable",
		reason: "disabled"
	};
	const entry = registry?.decisionProviders.find((candidate) => candidate.host.provider.id === selected.provider);
	if (!entry || !registry) return {
		status: "unavailable",
		reason: "not-configured"
	};
	if (config.plugins?.entries?.[entry.pluginId]?.enabled === false) return entry.host.unavailable("disabled");
	if (getPluginRegistryResourceOwner(registry) === getPluginRegistryState()?.activeRegistry) return entry.host.evaluate(batch, options, selected.model, config, registry, consumerId);
	const authority = capturePluginLifecycleAuthority(registry, void 0, { scopedRuntime: true });
	const lifetime = capturePluginRegistryLifecycleSignal(registry, capturePluginRegistryLifecycleEpoch(registry), { scopedRuntime: true });
	if (!authority?.() || !lifetime) throw new Error("Decision consumer authority closed.");
	const signal = AbortSignal.any([options.signal, lifetime]);
	const result = await entry.host.evaluate(batch, {
		...options,
		signal
	}, selected.model, config, registry, consumerId);
	signal.throwIfAborted();
	if (!authority()) throw new Error("Decision consumer authority closed.");
	return result;
}
/** Abort before dependent consumers drain. Services subsequently join actual physical settlement. */
function prepareDecisionProviderReload(registry, changedPluginIds) {
	const paused = [];
	for (const entry of registry.decisionProviders) if (changedPluginIds.has(entry.pluginId)) paused.push(entry.host.pauseForReload(changedPluginIds));
	else for (const pluginId of changedPluginIds) entry.host.cancelConsumer(pluginId);
	return { async rollback(signal) {
		await withPluginHostCleanupTimeout("decision reload rollback", () => Promise.all(paused.map((pause) => pause.settled)));
		signal.throwIfAborted();
		for (const pause of paused) pause.assertResumable();
		for (const pause of paused) pause.resume();
	} };
}
function inspectDecisionProviders(config, registry = getPluginRegistryForContext()) {
	return registry?.decisionProviders.map((entry) => entry.host.inspect(config)) ?? [];
}
//#endregion
export { prepareDecisionProviderReload as i, evaluateDecisionInRegistry as n, inspectDecisionProviders as r, evaluateDecision as t };
