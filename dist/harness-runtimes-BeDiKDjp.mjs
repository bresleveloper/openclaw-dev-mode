import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-DgZn2dLu.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { D as withAgentRosterFactsBatch } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { N as listModelRefsFromConfigValue } from "./runtime-snapshot-DYptB0Cf.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-CpJt0qgU.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-Rdb47msF.mjs";
//#region src/agents/harness-runtimes.ts
function isSelectablePluginRuntime(runtime) {
	return Boolean(runtime) && !isDefaultAgentRuntimeId(runtime) && normalizeOptionalAgentRuntimeId(runtime) !== "openclaw";
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
	for (const providerConfig of Object.values(config.models?.providers ?? {})) {
		const providerRuntime = normalizeOptionalAgentRuntimeId(providerConfig?.agentRuntime?.id);
		if (isSelectablePluginRuntime(providerRuntime)) runtimes.add(providerRuntime);
		for (const modelConfig of providerConfig?.models ?? []) {
			const modelRuntime = normalizeOptionalAgentRuntimeId(modelConfig?.agentRuntime?.id);
			if (isSelectablePluginRuntime(modelRuntime)) runtimes.add(modelRuntime);
		}
	}
	const pushModelMapRuntimeIds = (models) => {
		if (!isRecord(models)) return;
		for (const entry of Object.values(models)) {
			if (!isRecord(entry)) continue;
			const runtime = normalizeOptionalAgentRuntimeId(isRecord(entry.agentRuntime) ? entry.agentRuntime.id : void 0);
			if (isSelectablePluginRuntime(runtime)) runtimes.add(runtime);
			for (const value of Array.isArray(entry.pickerRuntimes) ? entry.pickerRuntimes : []) {
				const pickerRuntime = normalizeOptionalAgentRuntimeId(value);
				if (isSelectablePluginRuntime(pickerRuntime)) runtimes.add(pickerRuntime);
			}
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
