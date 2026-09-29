import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { p as resolveProviderRefOwnership } from "./providers-Bx7WoFEI.mjs";
import { a as resolveAgentHarnessOwnerPluginId, r as listRegisteredAgentHarnesses } from "./registry-aYyey5ds.mjs";
import { a as compareHarnessSupport, i as buildAgentHarnessSupportContext, t as resolveAgentHarnessAvailabilityDecision, u as resolveAgentHarnessAutoSelectionHint } from "./availability-CUZDnZeh.mjs";
import { r as MissingAgentHarnessError } from "./errors-Bd6GQRkh.mjs";
import { i as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-CJA2j26Y.mjs";
import { t as BUILTIN_AGENT_HARNESS_METADATA } from "./builtin-openclaw-metadata-zVszIwdU.mjs";
//#region src/agents/harness/selection-decision.ts
const log = createSubsystemLogger("agents/harness");
/** Reads delivery policy from the same validated decision used for execution. */
function resolveAgentHarnessDeliveryDefaults(params) {
	const selection = resolveAgentHarnessSelectionDecision(params);
	return selection.builtIn ? BUILTIN_AGENT_HARNESS_METADATA.deliveryDefaults : selection.harness.deliveryDefaults;
}
function listPluginAgentHarnesses() {
	return listRegisteredAgentHarnesses().map((entry) => entry.harness);
}
function resolveAgentHarnessSelectionDecision(params) {
	const pluginHarnesses = listPluginAgentHarnesses();
	const availability = resolveAgentHarnessAvailabilityDecision({
		...params,
		resolveProviderOwnership: () => resolveProviderRefOwnership({
			provider: params.provider,
			config: params.config
		})
	});
	const policy = availability.policy;
	const runtime = policy.runtime;
	if (runtime === "openclaw") return buildAgentHarnessSelectionDecision({
		policy,
		selectedReason: availability.kind === "implicit-unavailable" ? "implicit_plugin_unavailable_openclaw" : availability.kind === "implicit-unsupported" ? "implicit_plugin_unsupported_openclaw" : availability.kind === "declared-fallback" ? "plugin_declared_fallback_openclaw" : "forced_openclaw",
		candidates: listHarnessCandidates(pluginHarnesses)
	});
	if (runtime !== "auto") {
		const forced = pluginHarnesses.find((entry) => entry.id === runtime);
		if (forced) {
			const support = availability.support;
			if (!support || support.supported || support.fallbackRuntime === "openclaw") {
				if (support && !support.supported) log.info(`agent harness selected requested=${runtime} selected=${forced.id} reason=private_qa_forced_runtime`);
				return buildAgentHarnessSelectionDecision({
					harness: forced,
					policy,
					selectedReason: "forced_plugin",
					candidates: listHarnessCandidates(pluginHarnesses)
				});
			}
			if (isCliRuntimeAliasForProvider({
				runtime,
				provider: params.provider
			})) return buildAgentHarnessSelectionDecision({
				policy: {
					...policy,
					runtime: "openclaw"
				},
				selectedReason: "cli_runtime_passthrough_openclaw",
				candidates: listHarnessCandidates(pluginHarnesses)
			});
			throw new Error(`Requested agent harness "${runtime}" does not support ${formatProviderModel(params)}${support.reason ? ` (${support.reason})` : ""}.`);
		}
		if (isCliRuntimeAliasForProvider({
			runtime,
			provider: params.provider,
			cfg: params.config
		})) return buildAgentHarnessSelectionDecision({
			policy: {
				...policy,
				runtime: "openclaw"
			},
			selectedReason: "cli_runtime_passthrough_openclaw",
			candidates: listHarnessCandidates(pluginHarnesses)
		});
		throw new MissingAgentHarnessError(runtime);
	}
	const hintedCandidates = pluginHarnesses.map((harness) => ({
		harness,
		support: resolveAgentHarnessAutoSelectionHint({
			harness,
			provider: params.provider
		})
	}));
	const candidates = hintedCandidates.some((entry) => entry.support === void 0) ? (() => {
		const supportContext = buildAgentHarnessSupportContext({
			provider: params.provider,
			modelId: params.modelId,
			modelProvider: params.modelProvider,
			requestedRuntime: runtime,
			config: params.config,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			preparedModelProvider: params.preparedModelProvider,
			providerOwnership: resolveProviderRefOwnership({
				provider: params.provider,
				config: params.config
			})
		});
		return hintedCandidates.map(({ harness, support }) => ({
			harness,
			support: support ?? harness.supports(supportContext)
		}));
	})() : hintedCandidates.map(({ harness, support }) => ({
		harness,
		support
	}));
	const selected = candidates.filter((entry) => entry.support.supported).toSorted(compareHarnessSupport)[0]?.harness;
	if (selected) return buildAgentHarnessSelectionDecision({
		harness: selected,
		policy,
		selectedReason: "auto_plugin",
		candidates: candidates.map(toSelectionCandidate)
	});
	return buildAgentHarnessSelectionDecision({
		policy,
		selectedReason: "auto_openclaw",
		candidates: candidates.map(toSelectionCandidate)
	});
}
function listHarnessCandidates(harnesses) {
	return harnesses.map((harness) => ({
		id: harness.id,
		label: harness.label,
		pluginId: harness.pluginId
	}));
}
function toSelectionCandidate(entry) {
	return {
		id: entry.harness.id,
		label: entry.harness.label,
		pluginId: entry.harness.pluginId,
		supported: entry.support.supported,
		priority: entry.support.supported ? entry.support.priority : void 0,
		reason: entry.support.reason
	};
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
function formatProviderModel(params) {
	return params.modelId ? `${params.provider}/${params.modelId}` : params.provider;
}
//#endregion
export { resolveAgentHarnessDeliveryDefaults as n, resolveAgentHarnessSelectionDecision as r, buildAgentHarnessSelectionDecision as t };
