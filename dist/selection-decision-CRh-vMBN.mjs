import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as MissingAgentHarnessError } from "./errors-BAipjK5G.mjs";
import { a as resolveAgentHarnessOwnerPluginId, r as listRegisteredAgentHarnesses } from "./registry-BDZ8eM01.mjs";
import { n as buildAgentHarnessSupportContext, s as resolveAutoAgentHarnessSelection } from "./support-CqB31PZB.mjs";
import { t as resolveAgentHarnessAvailabilityDecision } from "./availability-CUqXgij4.mjs";
import { i as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { p as resolveProviderRefOwnership } from "./providers-3h1HIigh.mjs";
import { t as BUILTIN_AGENT_HARNESS_METADATA } from "./builtin-openclaw-metadata-4LZRMXv7.mjs";
//#region src/agents/harness/selection-decision.ts
const log = createSubsystemLogger("agents/harness");
/** Reads delivery policy from the same validated decision used for execution. */
function resolveAgentHarnessDeliveryDefaults(params) {
	const selection = resolveAgentHarnessSelectionDecision(params);
	return selection.builtIn ? BUILTIN_AGENT_HARNESS_METADATA.deliveryDefaults : selection.harness.deliveryDefaults;
}
function resolveAgentHarnessSelectionDecision(params) {
	const pluginHarnesses = listRegisteredAgentHarnesses().map((entry) => entry.harness);
	const availability = resolveAgentHarnessAvailabilityDecision({
		...params,
		resolveProviderOwnership: () => resolveProviderRefOwnership({
			provider: params.provider,
			config: params.config
		})
	});
	const policy = availability.policy;
	const finishSelection = (selectedReason, harness, selectedPolicy = policy) => buildAgentHarnessSelectionDecision({
		harness,
		policy: selectedPolicy,
		selectedReason,
		candidates: listHarnessCandidates(pluginHarnesses)
	});
	const runtime = policy.runtime;
	if (runtime === "openclaw") return finishSelection(availability.kind === "implicit-unavailable" ? "implicit_plugin_unavailable_openclaw" : availability.kind === "implicit-unsupported" ? "implicit_plugin_unsupported_openclaw" : availability.kind === "declared-fallback" ? "plugin_declared_fallback_openclaw" : "forced_openclaw");
	if (runtime !== "auto") {
		const forced = pluginHarnesses.find((entry) => entry.id === runtime);
		if (forced) {
			const support = availability.support;
			if (!support || support.supported || support.fallbackRuntime === "openclaw") {
				if (support && !support.supported) log.info(`agent harness selected requested=${runtime} selected=${forced.id} reason=private_qa_forced_runtime`);
				return finishSelection("forced_plugin", forced);
			}
			if (!isCliRuntimeAliasForProvider({
				runtime,
				provider: params.provider
			})) {
				const providerModel = params.modelId ? `${params.provider}/${params.modelId}` : params.provider;
				throw new Error(`Requested agent harness "${runtime}" does not support ${providerModel}${support.reason ? ` (${support.reason})` : ""}.`);
			}
		} else if (!isCliRuntimeAliasForProvider({
			runtime,
			provider: params.provider,
			cfg: params.config
		})) throw new MissingAgentHarnessError(runtime);
		return finishSelection("cli_runtime_passthrough_openclaw", void 0, {
			...policy,
			runtime: "openclaw"
		});
	}
	const { candidates, selected } = resolveAutoAgentHarnessSelection(pluginHarnesses, params.provider, () => buildAgentHarnessSupportContext({
		...params,
		requestedRuntime: runtime,
		providerOwnership: resolveProviderRefOwnership({
			provider: params.provider,
			config: params.config
		})
	}));
	return buildAgentHarnessSelectionDecision({
		harness: selected,
		policy,
		selectedReason: selected ? "auto_plugin" : "auto_openclaw",
		candidates: candidates.map(({ harness, support }) => ({
			id: harness.id,
			label: harness.label,
			pluginId: harness.pluginId,
			supported: support.supported,
			priority: support.supported ? support.priority : void 0,
			reason: support.reason
		}))
	});
}
function listHarnessCandidates(harnesses) {
	return harnesses.map((harness) => ({
		id: harness.id,
		label: harness.label,
		pluginId: harness.pluginId
	}));
}
function buildAgentHarnessSelectionDecision(params) {
	const common = {
		policy: params.policy,
		selectedHarnessId: params.harness?.id ?? BUILTIN_AGENT_HARNESS_METADATA.id,
		selectedReason: params.selectedReason,
		candidates: params.candidates
	};
	return params.harness ? {
		...common,
		builtIn: false,
		harness: params.harness,
		ownerPluginId: resolveAgentHarnessOwnerPluginId(params.harness)
	} : {
		...common,
		builtIn: true
	};
}
//#endregion
export { resolveAgentHarnessDeliveryDefaults as n, resolveAgentHarnessSelectionDecision as r, buildAgentHarnessSelectionDecision as t };
