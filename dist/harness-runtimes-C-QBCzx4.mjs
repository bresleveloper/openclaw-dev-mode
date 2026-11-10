import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { F as listModelRefsFromConfigValue } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { O as withAgentRosterFactsBatch } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
//#region src/agents/harness-runtimes.ts
function isSelectablePluginRuntime(runtime) {
	return Boolean(runtime) && !isDefaultAgentRuntimeId(runtime) && runtime !== "openclaw";
}
function resolveConfiguredModelHarnessRuntime(params) {
	const parsed = parseModelCatalogRef(params.modelRef);
	if (!parsed) return;
	const selection = params.modelRefKind === "selector" ? splitTrailingAuthProfile(params.modelRef) : void 0;
	const policyModel = selection?.profile ? parseModelCatalogRef(selection.model) : parsed;
	if (!policyModel) return;
	const policyParams = {
		config: params.config,
		provider: parsed.provider,
		modelId: parsed.modelId,
		agentId: params.agentId
	};
	const configured = resolveModelRuntimePolicy({
		...policyParams,
		modelId: policyModel.modelId
	});
	const policy = resolveAgentHarnessPolicy(policyParams, configured);
	if (!params.includeImplicitRuntimePreferences && policy.runtimeSource === "implicit") return;
	const runtime = normalizeOptionalAgentRuntimeId(policy.runtime);
	return isSelectablePluginRuntime(runtime) ? runtime : void 0;
}
function pushConfiguredModelRuntimeIds(config, runtimes) {
	const addRuntime = (value) => {
		const runtime = normalizeOptionalAgentRuntimeId(value);
		if (isSelectablePluginRuntime(runtime)) runtimes.add(runtime);
	};
	for (const providerConfig of Object.values(config.models?.providers ?? {})) {
		addRuntime(providerConfig?.agentRuntime?.id);
		for (const modelConfig of providerConfig?.models ?? []) addRuntime(modelConfig?.agentRuntime?.id);
	}
	const pushModelMapRuntimeIds = (models) => {
		if (!isRecord(models)) return;
		for (const entry of Object.values(models)) {
			if (!isRecord(entry)) continue;
			addRuntime(isRecord(entry.agentRuntime) ? entry.agentRuntime.id : void 0);
			for (const value of Array.isArray(entry.pickerRuntimes) ? entry.pickerRuntimes : []) addRuntime(value);
		}
	};
	pushModelMapRuntimeIds(config.agents?.defaults?.models);
	const agents = listAgentEntries(config);
	for (const agent of agents) pushModelMapRuntimeIds(isRecord(agent) ? agent.models : void 0);
}
function pushConfiguredAgentModelRuntimeIds(config, runtimes, includeImplicitRuntimePreferences) {
	const pushModelRefs = (modelRefs, modelRefKind, agentId) => {
		for (const modelRef of modelRefs) {
			const runtime = resolveConfiguredModelHarnessRuntime({
				config,
				includeImplicitRuntimePreferences,
				modelRef,
				modelRefKind,
				agentId
			});
			if (runtime) runtimes.add(runtime);
		}
	};
	const pushModelMapRefs = (models, agentId) => {
		if (!isRecord(models)) return;
		pushModelRefs(Object.keys(models), "literal", agentId);
	};
	const defaultsModel = config.agents?.defaults?.model;
	pushModelRefs(listModelRefsFromConfigValue(defaultsModel), "selector");
	pushModelMapRefs(config.agents?.defaults?.models);
	for (const agent of listAgentEntries(config)) {
		if (!isRecord(agent)) continue;
		const agentId = typeof agent.id === "string" ? agent.id : void 0;
		pushModelRefs(listModelRefsFromConfigValue(agent.model ?? defaultsModel), "selector", agentId);
		pushModelMapRefs(agent.models, agentId);
	}
}
/** Lists configured plugin harness runtime ids referenced by agent/model config. */
function collectConfiguredAgentHarnessRuntimes(config, options = {}) {
	return withAgentRosterFactsBatch(config, () => {
		const runtimes = /* @__PURE__ */ new Set();
		const includeImplicitRuntimePreferences = options.includeImplicitRuntimePreferences ?? true;
		pushConfiguredModelRuntimeIds(config, runtimes);
		pushConfiguredAgentModelRuntimeIds(config, runtimes, includeImplicitRuntimePreferences);
		return [...runtimes].toSorted((left, right) => left.localeCompare(right));
	});
}
//#endregion
export { resolveConfiguredModelHarnessRuntime as n, collectConfiguredAgentHarnessRuntimes as t };
