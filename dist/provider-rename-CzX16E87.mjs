import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { a as rewriteModelRefs, r as mergeModelRefMapEntries } from "./legacy-config-migrations.runtime.models.refs-Ceq33O_-.mjs";
//#region src/commands/doctor/shared/provider-rename.ts
function urlOrigin(value) {
	try {
		return new URL(value).origin;
	} catch {
		return;
	}
}
function planProviderRenames(config, declarations) {
	return declarations.filter(({ from, baseUrl }) => {
		const provider = config.models?.providers?.[from];
		const origin = typeof provider?.baseUrl === "string" ? urlOrigin(provider.baseUrl) : void 0;
		return origin !== void 0 && origin === urlOrigin(baseUrl);
	});
}
function rewriteProviderModelRef(ref, renames) {
	const parsed = splitTrailingAuthProfile(ref);
	const rename = renames.find(({ from }) => parsed.model.startsWith(`${from}/`));
	if (!rename) return;
	return `${rename.to}${parsed.model.slice(rename.from.length)}`;
}
function mergeProviders(source, target, path) {
	const merged = mergeModelRefMapEntries(target, source, path).value;
	const models = /* @__PURE__ */ new Map();
	for (const model of [...target.models ?? [], ...source.models ?? []]) {
		const existing = models.get(model.id);
		models.set(model.id, existing ? mergeModelRefMapEntries(existing, model, `${path}.models.${model.id}`).value : model);
	}
	return {
		...merged,
		models: [...models.values()]
	};
}
function applyProviderRenames(config, renames) {
	if (renames.length === 0) return {
		config,
		changes: []
	};
	const changes = [];
	const memoryDefaults = config.memory?.search;
	const agentEntries = Object.entries(config.agents?.entries ?? {});
	const inheritedBaseUrls = /* @__PURE__ */ new Map();
	for (const [, agent] of agentEntries) {
		const search = agent.memory?.search;
		if (search) inheritedBaseUrls.set(search, search.remote?.baseUrl ?? memoryDefaults?.remote?.baseUrl);
	}
	const normalize = (ref, pair) => {
		const baseUrl = pair && inheritedBaseUrls.has(pair) ? inheritedBaseUrls.get(pair) : asNullableRecord(pair?.remote)?.baseUrl;
		const rename = renames.find(({ from }) => ref.startsWith(`${from}/`));
		if (rename && typeof baseUrl === "string" && baseUrl.trim() && urlOrigin(baseUrl) !== urlOrigin(rename.baseUrl)) return null;
		return rewriteProviderModelRef(ref, renames) ?? null;
	};
	let rewritten = rewriteModelRefs(config, "config", changes, normalize).value;
	let updatedEntries;
	for (const [agentId, agent] of agentEntries) {
		const search = agent.memory?.search;
		const provider = search?.provider ?? memoryDefaults?.provider;
		const model = search?.model ?? memoryDefaults?.model;
		if (!search || !provider || typeof model !== "string") continue;
		const ref = `${provider}/${model}`;
		const targetRef = normalize(ref, { remote: { baseUrl: inheritedBaseUrls.get(search) } }) ?? ref;
		const slash = targetRef.indexOf("/");
		const targetProvider = targetRef.slice(0, slash);
		const targetModel = targetRef.slice(slash + 1);
		const currentAgent = rewritten.agents?.entries?.[agentId];
		const current = currentAgent?.memory?.search;
		const providerChanged = (current?.provider ?? rewritten.memory?.search?.provider) !== targetProvider;
		const modelChanged = (current?.model ?? rewritten.memory?.search?.model) !== targetModel;
		if (!providerChanged && !modelChanged) continue;
		updatedEntries ??= { ...rewritten.agents?.entries };
		updatedEntries[agentId] = {
			...currentAgent,
			memory: {
				...currentAgent?.memory,
				search: {
					...current,
					...providerChanged ? { provider: targetProvider } : {},
					...modelChanged ? { model: targetModel } : {}
				}
			}
		};
		changes.push(`Updated agents.entries.${agentId}.memory.search provider/model to ${JSON.stringify(targetRef)} after resolving inherited memory settings.`);
	}
	if (updatedEntries) rewritten = {
		...rewritten,
		agents: {
			...rewritten.agents,
			entries: updatedEntries
		}
	};
	const providers = { ...rewritten.models?.providers };
	let moved = false;
	for (const { from, to } of renames) {
		const source = providers[from];
		if (!source) continue;
		providers[to] = providers[to] ? mergeProviders(source, providers[to], `models.providers.${to}`) : source;
		delete providers[from];
		moved = true;
		changes.push(`Migrated models.providers.${from} to models.providers.${to}.`);
	}
	if (moved) changes.push("Migrated model references no longer pin saved accounts. Re-pin with /model <provider/model>@<profile> to choose a saved account.");
	return {
		config: moved ? {
			...rewritten,
			models: {
				...rewritten.models,
				providers
			}
		} : rewritten,
		changes
	};
}
function rewriteRenamedSessionModelPair(entry, providerKey, modelKey, renames) {
	const provider = entry[providerKey];
	const model = entry[modelKey];
	if (typeof model !== "string") return false;
	if (provider && !renames.some((rename) => rename.from === provider)) return false;
	const scopedModel = rewriteProviderModelRef(model, renames);
	const pair = rewriteModelRefs({
		provider,
		model
	}, modelKey, [], (ref) => rewriteProviderModelRef(ref, renames) ?? null);
	if (scopedModel === void 0 && !pair.changed) return false;
	const rewritten = pair.value;
	if (pair.changed) entry[providerKey] = rewritten.provider;
	entry[modelKey] = scopedModel ?? rewritten.model;
	return true;
}
function rewriteRenamedSessionRoutes(params) {
	let changed = false;
	for (const [providerKey, modelKey] of [
		["modelProvider", "model"],
		["providerOverride", "modelOverride"],
		["modelOverrideFallbackOriginProvider", "modelOverrideFallbackOriginModel"]
	]) changed = rewriteRenamedSessionModelPair(params.entry, providerKey, modelKey, params.renames) || changed;
	if (params.entry.modelFallback) for (const [providerKey, modelKey] of [
		["prevProvider", "prevModel"],
		["prevProviderOverride", "prevModelOverride"],
		["prevModelOverrideFallbackOriginProvider", "prevModelOverrideFallbackOriginModel"]
	]) changed = rewriteRenamedSessionModelPair(params.entry.modelFallback, providerKey, modelKey, params.renames) || changed;
	return changed;
}
//#endregion
export { rewriteRenamedSessionRoutes as i, planProviderRenames as n, rewriteProviderModelRef as r, applyProviderRenames as t };
