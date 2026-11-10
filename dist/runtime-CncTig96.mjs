import { i as getPluginRegistryForContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { o as normalizeModelRef } from "./model-ref-shared-BRJ3VRZV.mjs";
import { n as getPluginRegistryState } from "./runtime-state-Cd-Ga9cg.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as getProcessGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-jN_Zk4yK.mjs";
import { a as capturePluginLifecycleAuthority, o as capturePluginRegistryLifecycleEpoch, p as getPluginRegistryResourceOwner, s as capturePluginRegistryLifecycleSignal } from "./registry-lifecycle-CjTFYNkp.mjs";
import { $ as withPluginHostCleanupTimeout } from "./runtime-DkPagH0y.mjs";
import { r as bindOperatorModelExecution } from "./admitted-run-context-h1ULFETN.mjs";
import "./config-B3oiWDlr.mjs";
import { n as resolveDecisionModelSetting } from "./decision-model-setting-CqwqM5vF.mjs";
import { a as logDecisionEvaluation, n as validateDecisionBatch, t as DecisionContractError } from "./validation-D6isxIsd.mjs";
import { t as captureAmbientGatewayOperatorAuthority } from "./operator-invocation-authority-COjcC5ph.mjs";
//#region src/decisions/runtime.ts
/** Core calls carry their owner's abort signal; plugin callers additionally bind their exact instance. */
async function evaluateDecision(batch, options) {
	return evaluateDecisionInRegistry(batch, options, getPluginRegistryForContext(), readRuntimeConfig());
}
async function evaluateDecisionInRegistry(batch, inputOptions, registry, config, consumerId, isAdmissible, canDispatch) {
	const options = { ...inputOptions };
	if (!inputOptions || options.agentId !== void 0 && (typeof options.agentId !== "string" || !options.agentId.trim()) || typeof options.purpose !== "string" || !options.purpose || options.purpose.length > 128 || typeof options.rubricVersion !== "string" || !options.rubricVersion || options.rubricVersion.length > 128 || !Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0 || !(options.signal instanceof AbortSignal)) throw new DecisionContractError();
	options.signal.throwIfAborted();
	const started = performance.now();
	const skipped = (outcome) => {
		logDecisionEvaluation({
			options,
			facts: { dispatched: false },
			started,
			outcome
		});
		return outcome;
	};
	if (!validateDecisionBatch(batch)) return skipped({
		status: "unavailable",
		reason: "unsupported-input"
	});
	const selected = resolveDecisionModelSetting(config, options.agentId);
	if (!selected) return skipped({
		status: "unavailable",
		reason: "disabled"
	});
	if (config.plugins?.enabled === false) return skipped({
		status: "unavailable",
		reason: "disabled"
	});
	const entry = registry?.decisionProviders.find((candidate) => candidate.host.provider.id === selected.provider);
	if (!entry || !registry) return skipped({
		status: "unavailable",
		reason: "not-configured"
	});
	if (config.plugins?.entries?.[entry.pluginId]?.enabled === false) return skipped(entry.host.unavailable("disabled"));
	let submitted;
	try {
		submitted = structuredClone(batch);
	} catch {
		throw new DecisionContractError();
	}
	const model = normalizeModelRef(selected.provider, selected.model, {
		allowPluginNormalization: false,
		manifestPlugins: getProcessGatewayPluginMetadataSnapshot() ?? []
	});
	const rootCaller = getPluginRegistryResourceOwner(registry) === getPluginRegistryState()?.activeRegistry;
	const authority = rootCaller ? void 0 : capturePluginLifecycleAuthority(registry, void 0, { scopedRuntime: true });
	const lifetime = rootCaller ? void 0 : capturePluginRegistryLifecycleSignal(registry, capturePluginRegistryLifecycleEpoch(registry), { scopedRuntime: true });
	let capturedOperator;
	let modelExecution;
	try {
		capturedOperator = await captureAmbientGatewayOperatorAuthority({ missingBindingError: () => /* @__PURE__ */ new Error("Decision evaluation requires its current Gateway binding.") });
		modelExecution = bindOperatorModelExecution(capturedOperator.authority, model);
		const modelSignal = modelExecution ? AbortSignal.any([options.signal, modelExecution.signal]) : options.signal;
		const assertCurrent = () => {
			capturedOperator?.assertInvocationCurrent?.();
			modelExecution?.assertCurrent();
			modelSignal.throwIfAborted();
		};
		assertCurrent();
		let signal = modelSignal;
		if (!rootCaller) {
			if (!authority?.() || !lifetime) throw new Error("Decision consumer authority closed.");
			signal = AbortSignal.any([modelSignal, lifetime]);
			signal.throwIfAborted();
		}
		if (canDispatch && !canDispatch() || isAdmissible && !isAdmissible()) return skipped({
			status: "unavailable",
			reason: "disabled"
		});
		const result = await entry.host.evaluate(submitted, {
			...options,
			signal
		}, selected.model, config, registry, consumerId, isAdmissible);
		if (!rootCaller) signal.throwIfAborted();
		assertCurrent();
		if (!rootCaller && !authority?.()) throw new Error("Decision consumer authority closed.");
		return result;
	} finally {
		modelExecution?.release();
		capturedOperator?.release?.();
	}
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
