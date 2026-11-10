import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { h as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as normalizeStaticProviderModelId } from "./model-ref-shared-BRJ3VRZV.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as normalizeConfiguredProviderCatalogModelId } from "./provider-model-id-normalization-C-mafmHb.mjs";
import { r as findConfiguredProviderModel } from "./model-provider-config-wdC9jpCz.mjs";
import { y as materializeConfiguredProviderModelRows } from "./validation-core-ezn1vWYO.mjs";
import { a as resolveCatalogOwnedModelCompat, n as modelTransportRoutesMatch, t as isVllmQwenThinkingCompat } from "./model-compat-catalog-VI3Psdyr.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-DAkjzBhe.mjs";
import { a as resolveProviderModelRoutes, t as createProviderModelCatalogIdNormalizer } from "./provider-model-routes-CmpBxrCV.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { t as findNormalizedProviderValue } from "./model-selection-normalize-DulZGI4S.mjs";
import { t as mergeModelCost } from "./model-cost-BNQWuFdo.mjs";
import { r as normalizeResolvedPricing } from "./usage-cost-Va5dwVFW.mjs";
import "./src-D3H6pm7W.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { r as resolveProviderEndpoint } from "./provider-attribution-Dr21G8q1.mjs";
import { n as attachModelProviderRequestRouteFacts, p as sanitizeConfiguredModelProviderRequest, r as attachModelProviderRequestTransport, u as resolveProviderRequestConfig } from "./provider-request-config-WdycwKIG.mjs";
import { t as attachModelProviderLocalService } from "./provider-local-service-Cze7fsuy.mjs";
import { a as sanitizeModelHeaders, i as resolveProviderModelInput, r as normalizeResolvedTransportApi, t as buildInlineProviderModels } from "./model.inline-provider-DwjZUIZW.mjs";
import { i as shouldUnconditionallySuppress, r as resolveBuiltInModelSuppressionFromManifest } from "./model-suppression-BWbx1-dY.mjs";
import { t as resolveProviderTransport } from "./model.provider-transport-1LpjfXEc.mjs";
//#region src/agents/embedded-agent-runner/model.compat.ts
function mergeModelMediaInput(base, override) {
	if (!base || !override) return base || override;
	return {
		...base,
		...override,
		image: base.image || override.image ? {
			...base.image,
			...override.image
		} : void 0
	};
}
function resolveMergedConfiguredModelReasoning(params) {
	return params.configuredReasoning ?? (isVllmQwenThinkingCompat(normalizeProviderId(params.provider), params.compat) || (params.discoveredReasoning ?? false));
}
//#endregion
//#region src/agents/embedded-agent-runner/model.configured-overrides.ts
/** A native transport change needs support from its model or provider route owner. */
function hasConfiguredModelRouteSupport(params) {
	if (params.configuredModel) return true;
	const endpoint = resolveProviderEndpoint(params.route.baseUrl, params.providerMetadataOwners);
	if ([
		"custom",
		"local",
		"vercel-ai-gateway"
	].includes(endpoint.endpointClass)) return true;
	if (!params.catalogModel) return false;
	if (modelTransportRoutesMatch(params.catalogModel, params.route)) return true;
	const aliasTransport = params.manifestAlias.transport;
	if (aliasTransport && (!aliasTransport.api || aliasTransport.api === params.route.api) && (!aliasTransport.baseUrl || modelTransportRoutesMatch({
		...params.catalogModel,
		...aliasTransport
	}, params.route))) return true;
	const routes = resolveProviderModelRoutes({
		provider: params.provider,
		modelId: params.modelId,
		config: params.cfg,
		api: normalizeResolvedTransportApi(params.route.api),
		baseUrl: params.route.baseUrl
	});
	return routes?.kind === "routes" && routes.routes.some((route) => modelTransportRoutesMatch(route, params.route));
}
function shouldSuppressConfiguredModel(params) {
	if (shouldUnconditionallySuppress({
		provider: params.provider,
		id: params.modelId,
		...params.cfg ? { config: params.cfg } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	})) return true;
	const suppression = resolveBuiltInModelSuppressionFromManifest({
		provider: params.provider,
		id: params.modelId,
		...params.cfg ? { config: params.cfg } : {},
		...params.baseUrl ? { baseUrl: params.baseUrl } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	return Boolean(suppression?.retirement || normalizeProviderId(params.provider) === "openai" && normalizeLowercaseStringOrEmpty(params.modelId) === "gpt-5.3-codex-spark" && suppression?.suppress);
}
function resolveConfiguredProviderDefaultApi(params) {
	const { providerConfig } = params;
	const explicit = normalizeResolvedTransportApi(providerConfig?.api);
	if (explicit) return explicit;
	const providerConfiguredBaseUrl = normalizeOptionalString(providerConfig?.baseUrl);
	if (!providerConfiguredBaseUrl) return;
	return resolveProviderTransport({
		...params,
		modelId: void 0,
		api: void 0,
		baseUrl: providerConfiguredBaseUrl
	}).api ?? "openai-completions";
}
function findInlineModelMatch(params) {
	const inlineModels = params.preparedModels ?? buildInlineProviderModels(params.providers);
	const normalizedProvider = normalizeProviderId(params.provider);
	const providers = /* @__PURE__ */ new Set([params.provider, ...inlineModels.filter((entry) => normalizeProviderId(entry.provider) === normalizedProvider).map((entry) => entry.provider)]);
	const find = (providerKeys, normalizeModelId) => {
		for (const provider of providerKeys) {
			const match = findConfiguredProviderModel({ models: inlineModels.filter((entry) => entry.provider === provider) }, provider, params.modelId, normalizeModelId);
			if (match) return match;
		}
	};
	const rawMatch = find(providers);
	return find(rawMatch ? [rawMatch.provider] : providers, createProviderModelCatalogIdNormalizer(params.provider));
}
function resolveConfiguredProviderConfig(cfg, provider) {
	const configuredProviders = cfg?.models?.providers;
	return configuredProviders?.[provider] ?? findNormalizedProviderValue(configuredProviders, provider);
}
/** Merge authored rates after discovery; runtime defaults must not become price pins. */
function mergeConfiguredModelCost(params) {
	let authoredCost = params.configuredModel?.cost;
	if (params.cfg && params.configuredModel) {
		const source = projectConfigOntoRuntimeSourceSnapshot(params.cfg);
		if (source !== params.cfg) {
			const modelId = params.configuredModel.id.trim();
			const sourceModel = materializeConfiguredProviderModelRows({ models: resolveConfiguredProviderConfig(source, params.provider)?.models ?? [] }, (id) => normalizeConfiguredProviderCatalogModelId(params.provider, id, params.providerMetadataOwners?.modelIdNormalizationPolicies)).models.find((model) => model.id === modelId);
			if (sourceModel) authoredCost = sourceModel.cost;
		}
	}
	return normalizeResolvedPricing(mergeModelCost(params.catalogCost, authoredCost) ?? {});
}
function mergeCatalogInlineModel(catalogModel, inlineModel) {
	if (!catalogModel) return inlineModel;
	const compat = resolveCatalogOwnedModelCompat({
		catalogRoute: catalogModel,
		catalogCompat: catalogModel.compat,
		configuredRoute: inlineModel,
		configuredCompat: inlineModel.compat
	});
	const mediaInput = mergeModelMediaInput(catalogModel.mediaInput, inlineModel.mediaInput);
	const params = mergeModelParams(asOptionalRecord(catalogModel.params), asOptionalRecord(inlineModel.params));
	return {
		...catalogModel,
		...inlineModel,
		api: inlineModel.api ?? catalogModel.api,
		baseUrl: normalizeOptionalString(inlineModel.baseUrl) ?? normalizeOptionalString(catalogModel.baseUrl),
		headers: inlineModel.headers ?? catalogModel.headers,
		contextWindow: inlineModel.contextWindow ?? catalogModel.contextWindow,
		contextTokens: inlineModel.contextTokens ?? catalogModel.contextTokens,
		compat,
		...mediaInput ? { mediaInput } : {},
		...params ? { params } : {}
	};
}
function mergeModelParams(...entries) {
	const merged = Object.assign({}, ...entries);
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function findConfiguredAgentModelParams(params) {
	const configuredModels = params.cfg?.agents?.defaults?.models;
	if (!configuredModels) return;
	const directKeys = [modelKey(params.provider, params.modelId), `${params.provider}/${params.modelId}`];
	for (const key of directKeys) {
		const direct = asOptionalRecord(configuredModels[key]?.params);
		if (direct) return direct;
	}
	const normalizedProvider = normalizeProviderId(params.provider);
	const normalizedModelId = normalizeStaticProviderModelId(normalizedProvider, params.modelId).trim().toLowerCase();
	for (const [rawKey, entry] of Object.entries(configuredModels)) {
		const slashIndex = rawKey.indexOf("/");
		if (slashIndex <= 0) continue;
		const candidateProvider = rawKey.slice(0, slashIndex);
		const candidateModelId = rawKey.slice(slashIndex + 1);
		if (normalizeProviderId(candidateProvider) === normalizedProvider && normalizeStaticProviderModelId(normalizedProvider, candidateModelId).trim().toLowerCase() === normalizedModelId) return asOptionalRecord(entry.params);
	}
}
function mergeConfiguredRuntimeModelParams(params) {
	return mergeModelParams(asOptionalRecord(params.discoveredParams), asOptionalRecord(params.providerParams), findConfiguredAgentModelParams(params), asOptionalRecord(params.configuredParams));
}
function clampModelMaxTokensToContextWindow(maxTokens, contextWindow) {
	if (typeof maxTokens !== "number" || !Number.isFinite(maxTokens)) return;
	return typeof contextWindow === "number" && Number.isFinite(contextWindow) ? Math.min(maxTokens, contextWindow) : maxTokens;
}
function applyConfiguredProviderOverrides(params) {
	const { providerConfig, modelId, discoveredModel: source } = params;
	const discoveredModel = attachModelProviderRequestRouteFacts(source.maxTokens === void 0 || source.maxTokensSource !== void 0 ? source : {
		...source,
		maxTokensSource: "discovered"
	}, params.providerMetadataOwners);
	const manifestAliasTransport = params.manifestAlias.transport;
	const requestTimeoutMs = finiteSecondsToTimerSafeMilliseconds(providerConfig?.timeoutSeconds, { floorSeconds: true });
	const defaultModelParams = findConfiguredAgentModelParams(params);
	const discoveredHeaders = sanitizeModelHeaders(discoveredModel.headers);
	const requestParams = {
		provider: params.provider,
		...params.providerMetadataOwners ? { providerMetadataOwners: params.providerMetadataOwners } : {},
		discoveredHeaders,
		capability: "llm",
		transport: "stream"
	};
	if (!providerConfig) {
		const resolvedParams = mergeModelParams(asOptionalRecord(discoveredModel.params), defaultModelParams);
		const aliasTransport = manifestAliasTransport ? resolveProviderTransport({
			...params,
			api: manifestAliasTransport.api ?? discoveredModel.api,
			baseUrl: normalizeOptionalString(manifestAliasTransport.baseUrl) ?? discoveredModel.baseUrl
		}) : void 0;
		const requestConfig = resolveProviderRequestConfig({
			...requestParams,
			api: aliasTransport?.api ?? discoveredModel.api,
			baseUrl: aliasTransport?.baseUrl ?? discoveredModel.baseUrl
		});
		if (!hasConfiguredModelRouteSupport({
			...params,
			catalogModel: discoveredModel,
			route: requestConfig
		})) return;
		return {
			...discoveredModel,
			...manifestAliasTransport ? {
				provider: params.provider,
				api: requestConfig.api ?? discoveredModel.api,
				baseUrl: requestConfig.baseUrl ?? discoveredModel.baseUrl
			} : {},
			...resolvedParams ? { params: resolvedParams } : {},
			headers: requestConfig.headers
		};
	}
	const normalizeModelId = createProviderModelCatalogIdNormalizer(params.provider);
	const configuredModel = findConfiguredProviderModel(providerConfig, params.provider, modelId, normalizeModelId) ?? (discoveredModel.id !== modelId ? findConfiguredProviderModel(providerConfig, params.provider, discoveredModel.id, normalizeModelId) : void 0);
	const configuredStaticCatalogModel = configuredModel && (params.staticCatalogModel ?? params.getStaticCatalogModel?.());
	const metadataOverrideModel = params.preferDiscoveredModelMetadata && configuredModel?.metadataSource === "models-add" ? void 0 : configuredModel;
	const providerHeaders = sanitizeModelHeaders(providerConfig.headers);
	const providerRequest = sanitizeConfiguredModelProviderRequest(providerConfig.request);
	const configuredHeaders = sanitizeModelHeaders(configuredModel?.headers);
	const providerParams = asOptionalRecord(providerConfig.params);
	const configuredRequestParams = {
		...requestParams,
		providerHeaders,
		modelHeaders: configuredHeaders,
		authHeader: providerConfig.authHeader,
		request: providerRequest
	};
	const passthroughRequestConfig = resolveProviderRequestConfig({
		...configuredRequestParams,
		api: discoveredModel.api,
		baseUrl: discoveredModel.baseUrl
	});
	if (!configuredModel && !providerConfig.baseUrl && !providerConfig.api && providerConfig.maxTokens === void 0 && requestTimeoutMs === void 0 && !providerHeaders && !providerRequest && !providerParams && !providerConfig.localService && !manifestAliasTransport) {
		const resolvedParams = mergeModelParams(asOptionalRecord(discoveredModel.params), defaultModelParams);
		return {
			...discoveredModel,
			...resolvedParams ? { params: resolvedParams } : {},
			headers: passthroughRequestConfig.headers,
			...providerConfig.authHeader !== void 0 ? { authHeader: providerConfig.authHeader } : {}
		};
	}
	const resolvedParams = mergeModelParams(asOptionalRecord(configuredStaticCatalogModel?.params), asOptionalRecord(discoveredModel.params), providerParams, defaultModelParams, asOptionalRecord(configuredModel?.params));
	const normalizedInput = resolveProviderModelInput({
		provider: params.provider,
		modelId,
		modelName: metadataOverrideModel?.name ?? discoveredModel.name,
		input: metadataOverrideModel?.input,
		fallbackInput: discoveredModel.input
	});
	const providerDefaultApi = resolveConfiguredProviderDefaultApi({
		...params,
		providerConfig
	});
	const transportSources = params.preferDiscoveredTransport && !manifestAliasTransport ? [
		discoveredModel,
		metadataOverrideModel,
		providerConfig,
		configuredStaticCatalogModel
	] : [
		metadataOverrideModel,
		providerConfig,
		manifestAliasTransport,
		discoveredModel,
		configuredStaticCatalogModel
	];
	const resolvedTransport = resolveProviderTransport({
		...params,
		modelId: discoveredModel.id,
		api: transportSources.find((entry) => entry?.api != null)?.api ?? providerDefaultApi,
		baseUrl: transportSources.map((entry) => normalizeOptionalString(entry?.baseUrl)).find(Boolean)
	});
	if (!hasConfiguredModelRouteSupport({
		...params,
		configuredModel,
		catalogModel: discoveredModel,
		route: resolvedTransport
	})) return;
	const contextWindow = metadataOverrideModel?.contextWindow ?? discoveredModel.contextWindow;
	const { contextWindowSource: _syntheticContextWindowSource, ...discoveredWithoutSizeSource } = discoveredModel;
	const discoveredSizing = metadataOverrideModel?.contextWindow !== void 0 ? discoveredWithoutSizeSource : discoveredModel;
	const configuredMaxTokens = metadataOverrideModel?.maxTokens ?? providerConfig.maxTokens;
	const normalizedResolvedMaxTokens = clampModelMaxTokensToContextWindow(configuredMaxTokens ?? discoveredModel.maxTokens, contextWindow);
	let catalogModel = params.staticCatalogModel ?? discoveredModel;
	let hasCatalogOwnedModel = configuredStaticCatalogModel !== void 0 || discoveredModel.maxTokensSource !== "configured";
	if (!params.staticCatalogModel && !modelTransportRoutesMatch(discoveredModel, resolvedTransport)) {
		const staticCatalogModel = configuredStaticCatalogModel ?? params.getStaticCatalogModel?.();
		if (staticCatalogModel && modelTransportRoutesMatch(staticCatalogModel, resolvedTransport)) {
			catalogModel = staticCatalogModel;
			hasCatalogOwnedModel = true;
		}
	}
	const catalogRoute = {
		api: catalogModel.api ?? configuredStaticCatalogModel?.api,
		baseUrl: catalogModel.baseUrl ?? configuredStaticCatalogModel?.baseUrl
	};
	const configuredCatalogCompat = configuredStaticCatalogModel && modelTransportRoutesMatch(configuredStaticCatalogModel, catalogRoute) ? configuredStaticCatalogModel.compat : void 0;
	const catalogCompat = configuredCatalogCompat && catalogModel.compat ? {
		...configuredCatalogCompat,
		...catalogModel.compat
	} : catalogModel.compat ?? configuredCatalogCompat;
	const resolvedCompat = resolveCatalogOwnedModelCompat({
		...hasCatalogOwnedModel ? { catalogRoute } : {},
		catalogCompat,
		configuredRoute: resolvedTransport,
		configuredCompat: metadataOverrideModel?.compat
	});
	const resolvedReasoning = resolveMergedConfiguredModelReasoning({
		provider: params.provider,
		compat: resolvedCompat,
		configuredReasoning: metadataOverrideModel?.reasoning,
		discoveredReasoning: discoveredModel.reasoning
	});
	const requestConfig = resolveProviderRequestConfig({
		...configuredRequestParams,
		api: resolvedTransport.api ?? normalizeResolvedTransportApi(configuredStaticCatalogModel?.api) ?? normalizeResolvedTransportApi(discoveredModel.api) ?? providerDefaultApi ?? "openai-responses",
		baseUrl: resolvedTransport.baseUrl ?? configuredStaticCatalogModel?.baseUrl ?? discoveredModel.baseUrl
	});
	return attachModelProviderRequestRouteFacts(attachModelProviderLocalService(attachModelProviderRequestTransport({
		...discoveredSizing,
		provider: params.provider,
		api: requestConfig.api ?? "openai-responses",
		baseUrl: requestConfig.baseUrl ?? discoveredModel.baseUrl,
		reasoning: resolvedReasoning,
		input: normalizedInput,
		cost: mergeConfiguredModelCost({
			...params,
			configuredModel: metadataOverrideModel,
			catalogCost: discoveredModel.cost
		}),
		contextWindow,
		contextTokens: metadataOverrideModel?.contextTokens ?? discoveredModel.contextTokens,
		...normalizedResolvedMaxTokens !== void 0 ? {
			maxTokens: normalizedResolvedMaxTokens,
			maxTokensSource: configuredMaxTokens !== void 0 ? "configured" : discoveredModel.maxTokensSource ?? "discovered"
		} : {},
		...resolvedParams ? { params: resolvedParams } : {},
		...requestTimeoutMs !== void 0 ? { requestTimeoutMs } : {},
		headers: requestConfig.headers,
		...providerConfig.authHeader !== void 0 ? { authHeader: providerConfig.authHeader } : {},
		compat: resolvedCompat,
		mediaInput: mergeModelMediaInput(mergeModelMediaInput(configuredStaticCatalogModel?.mediaInput, discoveredModel.mediaInput), metadataOverrideModel?.mediaInput)
	}, providerRequest), providerConfig.localService), params.providerMetadataOwners);
}
//#endregion
export { mergeCatalogInlineModel as a, resolveConfiguredProviderConfig as c, mergeModelMediaInput as d, resolveMergedConfiguredModelReasoning as f, hasConfiguredModelRouteSupport as i, resolveConfiguredProviderDefaultApi as l, clampModelMaxTokensToContextWindow as n, mergeConfiguredModelCost as o, findInlineModelMatch as r, mergeConfiguredRuntimeModelParams as s, applyConfiguredProviderOverrides as t, shouldSuppressConfiguredModel as u };
