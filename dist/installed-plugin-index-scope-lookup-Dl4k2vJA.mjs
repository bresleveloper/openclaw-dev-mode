import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { Q as compileSafeRegex } from "./redact-B5EGyLvV.mjs";
import { h as getInstalledPluginIndexFacts } from "./installed-plugin-index-D0kh4WcK.mjs";
import { s as normalizePluginId } from "./config-state-BEAL5gWH.mjs";
import "./installed-plugin-index-config-path-scope-BAeCI-f_.mjs";
//#region src/plugins/installed-plugin-index-scope-lookup.ts
const PROVIDER_CONTRIBUTION_CONTRACTS = [
	"externalAuthProviders",
	"embeddingProviders",
	"decisionProviders",
	"speechProviders",
	"realtimeTranscriptionProviders",
	"realtimeVoiceProviders",
	"mediaUnderstandingProviders",
	"meetingNotesSourceProviders",
	"imageGenerationProviders",
	"videoGenerationProviders",
	"musicGenerationProviders",
	"webFetchProviders",
	"webSearchProviders",
	"workerProviders",
	"usageProviders"
];
/** A private ownership index shares normalization and duplicate handling across scope kinds. */
function createOwnerLookup() {
	const owners = /* @__PURE__ */ new Map();
	const resolve = (id) => owners.get(normalizeOptionalLowercaseString(id) ?? "");
	return {
		index(pluginId, ids) {
			for (const id of ids) {
				const key = normalizeOptionalLowercaseString(id);
				if (key) {
					const pluginIds = owners.get(key) ?? /* @__PURE__ */ new Set();
					pluginIds.add(pluginId);
					owners.set(key, pluginIds);
				}
			}
		},
		add: (target, ids) => {
			for (const id of ids) for (const pluginId of resolve(id) ?? []) target.add(pluginId);
		},
		has: (ids) => ids.every((id) => resolve(id) !== void 0)
	};
}
function listValues(value) {
	return Array.isArray(value) ? value : [];
}
function modelSupportOwnerMatches(owner, modelId) {
	const trimmed = modelId.trim();
	if (!trimmed) return false;
	if (owner.prefixes.some((prefix) => trimmed.startsWith(prefix))) return true;
	return owner.patterns.some((pattern) => pattern.test(trimmed));
}
function createInstalledPluginIndexScopeLookup(index) {
	const facts = getInstalledPluginIndexFacts(index);
	if (facts?.scopeLookup) return { ...facts.scopeLookup };
	const agentHarnessOwners = createOwnerLookup();
	const channelContributionOwners = createOwnerLookup();
	const directChannelOwners = createOwnerLookup();
	const installedPluginOwners = createOwnerLookup();
	const providerContributionOwners = createOwnerLookup();
	const pluginIdsByLowercase = /* @__PURE__ */ new Map();
	const modelSupportOwners = [];
	for (const plugin of index.plugins) {
		const normalizedPluginId = normalizeOptionalLowercaseString(plugin.pluginId);
		if (normalizedPluginId) {
			pluginIdsByLowercase.set(normalizedPluginId, plugin.pluginId);
			installedPluginOwners.index(plugin.pluginId, [plugin.pluginId]);
		}
		directChannelOwners.index(plugin.pluginId, [plugin.pluginId, plugin.packageChannel?.id]);
		agentHarnessOwners.index(plugin.pluginId, plugin.startup.agentHarnesses);
		channelContributionOwners.index(plugin.pluginId, [
			plugin.pluginId,
			plugin.packageChannel?.id,
			...listValues(plugin.contributions?.channels),
			...listValues(plugin.contributions?.channelConfigs)
		]);
		providerContributionOwners.index(plugin.pluginId, [
			plugin.pluginId,
			...listValues(plugin.contributions?.providers),
			...listValues(plugin.contributions?.modelCatalogProviders),
			...listValues(plugin.contributions?.autoEnableProviderIds),
			...PROVIDER_CONTRIBUTION_CONTRACTS.flatMap((contract) => listValues(plugin.contributions?.contracts?.[contract]))
		]);
		modelSupportOwners.push({
			pluginId: plugin.pluginId,
			prefixes: listValues(plugin.contributions?.modelSupportPrefixes),
			patterns: listValues(plugin.contributions?.modelSupportPatterns).flatMap((pattern) => {
				const regex = compileSafeRegex(pattern, "u");
				return regex ? [regex] : [];
			})
		});
	}
	const normalizeInstalledPluginId = (pluginId) => {
		const normalized = normalizePluginId(pluginId);
		const lowercase = normalizeOptionalLowercaseString(normalized);
		return lowercase ? pluginIdsByLowercase.get(lowercase) ?? normalized : normalized;
	};
	const lookup = {
		addAgentHarnessOwners: agentHarnessOwners.add,
		addChannelContributionOwners: channelContributionOwners.add,
		addDirectChannelOwners: directChannelOwners.add,
		addDirectProviderOwners: installedPluginOwners.add,
		addProviderContributionOwners: providerContributionOwners.add,
		addShorthandModelOwners: (target, modelIds) => {
			for (const modelId of modelIds) for (const owner of modelSupportOwners) if (modelSupportOwnerMatches(owner, modelId)) target.add(owner.pluginId);
		},
		canResolveDirectProviderIds: (providerIds, scopePluginIds) => {
			const normalizedScope = new Set([...scopePluginIds].map((pluginId) => normalizeOptionalLowercaseString(pluginId)).filter((pluginId) => Boolean(pluginId)));
			return providerIds.every((providerId) => {
				const normalized = normalizeOptionalLowercaseString(providerId);
				return Boolean(normalized && (installedPluginOwners.has([normalized]) || normalizedScope.has(normalized)));
			});
		},
		hasChannelContributionOwners: channelContributionOwners.has,
		hasAgentHarnessOwners: agentHarnessOwners.has,
		hasCompleteConfigPathActivationMetadata: () => index.plugins.every((plugin) => !plugin.compat.includes("activation-config-path-hint") || plugin.startup.configPaths !== void 0),
		hasDirectChannelOwners: directChannelOwners.has,
		hasInstalledPluginIds: (ids) => installedPluginOwners.has([...ids]),
		hasProviderContributionOwners: providerContributionOwners.has,
		hasShorthandModelOwners: (modelIds) => modelIds.every((modelId) => modelSupportOwners.some((owner) => modelSupportOwnerMatches(owner, modelId))),
		normalizePluginId: normalizeInstalledPluginId
	};
	if (facts) facts.scopeLookup = { ...lookup };
	return lookup;
}
//#endregion
export { createInstalledPluginIndexScopeLookup as t };
