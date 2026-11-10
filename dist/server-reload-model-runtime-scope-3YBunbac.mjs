import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { P as collectConfiguredModelRefs } from "./runtime-snapshot-BBYDJbw9.mjs";
import { r as resolveChannelConfigActivationFacts } from "./channel-config-activation-C8WitDLu.mjs";
import "./session-key-CSDERtm3.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-DAkjzBhe.mjs";
import "./io-DIF-KW3P.mjs";
import { o as normalizeProviderMapKeys } from "./models-config.merge-C-G9Ur64.mjs";
import { o as diffConfigPaths } from "./config-reload-plan-B6NE-M4X.mjs";
import { s as pruneRemovedProviderPluginModelCatalogs } from "./plugin-model-catalog-BSKD3sUS.mjs";
import { x as refreshPreparedModelRuntimeSnapshots } from "./prepared-model-runtime-wDlPVSla.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/config-reload-recovery.ts
function shouldRefreshContextWindowCache(plan) {
	return plan.reloadPlugins || plan.changedPaths.some((path) => path === "models" || path.startsWith("models.") || path === "agents" || path === "agents.defaults" || path === "agents.entries" || path.startsWith("agents.entries.") || path === "agents.defaults.workspace" || path.startsWith("agents.defaults.workspace."));
}
function doesReloadAffectPluginCapabilities(plan, previousConfig, nextConfig) {
	return plan.reloadPlugins || !isDeepStrictEqual(resolveChannelConfigActivationFacts(previousConfig), resolveChannelConfigActivationFacts(nextConfig));
}
/** Auth changes must replace prepared owners instead of advancing their config in place. */
function doesReloadAffectProviderAuth(plan, previousConfig, nextConfig) {
	return doesReloadAffectPluginCapabilities(plan, previousConfig, nextConfig) || plan.changedPaths.some(isProviderAuthRelevantReloadPath) || diffConfigPaths(previousConfig, nextConfig).some(isProviderAuthRelevantReloadPath) || !isDeepStrictEqual(collectConfiguredModelRefs(previousConfig), collectConfiguredModelRefs(nextConfig));
}
const PROVIDER_AUTH_RELEVANT_CONFIG_ROOTS = /* @__PURE__ */ new Set([
	"auth",
	"env",
	"models",
	"plugins",
	"secrets"
]);
const PROVIDER_AUTH_RELEVANT_AGENT_SUBFIELDS = /* @__PURE__ */ new Set([
	"agentDir",
	"agentRuntime",
	"default",
	"id",
	"imageModel",
	"mediaModels",
	"model",
	"models",
	"modelPolicy",
	"pdfModel",
	"runtime",
	"utilityModel",
	"voiceModel",
	"workspace"
]);
function isAuthRelevantAgentSubfield(field, next, nested) {
	if (field === void 0) return true;
	if (PROVIDER_AUTH_RELEVANT_AGENT_SUBFIELDS.has(field)) return true;
	if (field === "heartbeat" || field === "subagents") return next === void 0 || next === "model";
	return field === "compaction" && (next === void 0 || next === "model" || next === "provider" || next === "memoryFlush" && (nested === void 0 || nested === "model"));
}
function isProviderAuthRelevantReloadPath(path) {
	const segments = path.split(".");
	const [head = "", second, third, fourth] = segments;
	if (PROVIDER_AUTH_RELEVANT_CONFIG_ROOTS.has(head)) return true;
	if (head !== "agents") return false;
	if (second === void 0 || second === "list") return true;
	if (second === "defaults") return isAuthRelevantAgentSubfield(third, segments[3], segments[4]);
	if (second === "entries") return isAuthRelevantAgentSubfield(fourth, segments[4], segments[5]);
	return false;
}
function reloadPlanNeedsRecovery(plan) {
	return plan.restartCron || plan.restartGmailWatcher || plan.reloadPlugins || plan.restartChannels.size > 0 || (plan.restartChannelAccounts?.size ?? 0) > 0 || shouldRefreshContextWindowCache(plan);
}
//#endregion
//#region src/gateway/server-reload-model-runtime-scope.ts
/** Retains unfinished model preparation across superseding config publications. */
function createGatewayModelRuntimeReload() {
	let pending;
	return {
		hasPending: () => pending !== void 0,
		prepare(plan, previousConfig, nextConfig) {
			const baseline = pending ?? {
				config: previousConfig,
				sourceConfig: projectConfigOntoRuntimeSourceSnapshot(previousConfig)
			};
			const agentIds = doesReloadAffectPluginCapabilities(plan, baseline.config, nextConfig) ? void 0 : resolveReloadAgentIds([...plan.changedPaths, ...diffConfigPaths(baseline.config, nextConfig)]);
			return {
				required: pending !== void 0 || doesReloadAffectProviderAuth(plan, previousConfig, nextConfig),
				refreshContextWindows: pending !== void 0 || shouldRefreshContextWindowCache(plan),
				agentIds,
				scope: agentIds ? { agentIds } : {},
				sourceConfig: baseline.sourceConfig,
				complete: () => {
					pending = void 0;
				},
				defer: () => {
					pending ??= baseline;
				}
			};
		}
	};
}
/** Returns agent-local model/auth changes; undefined requires a global refresh. */
function resolveReloadAgentIds(changedPaths) {
	const agentIds = /* @__PURE__ */ new Set();
	for (const path of changedPaths) {
		if (!isProviderAuthRelevantReloadPath(path)) continue;
		const match = /^agents\.entries\.([^.]+)(?:\.|$)/.exec(path);
		if (!match?.[1]) return;
		agentIds.add(normalizeAgentId(match[1]));
	}
	return agentIds;
}
/** Apply known endpoint removals before publishing the replacement model inventory. */
async function pruneRemovedProviderModelCatalogs(previousConfig, nextConfig) {
	const previousProviders = normalizeProviderMapKeys(previousConfig.models?.providers);
	const nextProviders = normalizeProviderMapKeys(nextConfig.models?.providers);
	const removedProviderBaseUrls = Object.fromEntries(Object.entries(previousProviders).flatMap(([id, provider]) => provider.baseUrl && !Object.hasOwn(nextProviders, id) ? [[id, provider.baseUrl]] : []));
	if (Object.keys(removedProviderBaseUrls).length === 0) return;
	const agentDirs = new Set(listAgentIds(previousConfig).map((id) => resolveAgentDir(previousConfig, id)));
	for (const agentDir of agentDirs) await pruneRemovedProviderPluginModelCatalogs({
		agentDir,
		removedProviderBaseUrls
	});
}
function refreshModelRuntimeAfterHotReload(params) {
	return refreshPreparedModelRuntimeSnapshots(params.config, {
		catalogMode: "static",
		joinSupersedingPublication: true,
		...params.isPublicationCurrent ? { isPublicationCurrent: params.isPublicationCurrent } : {},
		allowGatewaySubagentBinding: true,
		...params.agentIds ? { agentIds: params.agentIds } : {},
		...params.pluginMetadataSnapshot ? { pluginMetadataSnapshot: params.pluginMetadataSnapshot } : {}
	});
}
//#endregion
export { reloadPlanNeedsRecovery as a, doesReloadAffectProviderAuth as i, pruneRemovedProviderModelCatalogs as n, shouldRefreshContextWindowCache as o, refreshModelRuntimeAfterHotReload as r, createGatewayModelRuntimeReload as t };
