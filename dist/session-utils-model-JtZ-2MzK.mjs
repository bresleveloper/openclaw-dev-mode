import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { T as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import "./defaults-Jag53zwP.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { r as normalizeCatalogRouteBaseUrl } from "./model-compat-catalog-Dfj3P1T4.mjs";
import { h as resolveConfiguredModelRef } from "./model-selection-shared-DKlQ1p0S.mjs";
import { r as modelSupportsInput, t as findModelCatalogEntry } from "./model-catalog-lookup-BWpJFHtW.mjs";
import { n as parseModelRef, t as findNormalizedProviderValue } from "./model-selection-normalize-AjjSfI-g.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import { c as normalizeThinkLevel } from "./thinking.shared-Jy32Vp-O.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-00MgEWj5.mjs";
import { n as publishedModelCatalogOwnerMatchesAgent } from "./prepared-model-catalog-owner-lSB2_Cf6.mjs";
import { d as resolveThinkingProfile, l as resolveSupportedThinkingLevelFromProfile } from "./thinking-NbdrO8vA.mjs";
import "./model-selection-D3_rVb38.mjs";
import { r as resolveThinkingDefaultCore } from "./model-thinking-default-CZnoMXD6.mjs";
import { t as isCliProvider } from "./model-selection-cli-CtTygCpm.mjs";
import { s as resolveCliRuntimeCanonicalProvider } from "./cli-backends-CRE_cwP5.mjs";
import { s as resolveEffectiveAgentRuntime, t as concretizeAgentRuntime } from "./thinking-runtime-DsaB5fLF.mjs";
import "./model-catalog-CwZMTjpw.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { y as projectPublicSessionEntry } from "./session-accessor.sqlite-transcript-write-CPk6xFA-.mjs";
import "./sessions-D_sxp1B4.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-xnA7gN4_.mjs";
import { n as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata-BYpiZnNd.mjs";
import { o as resolveContextTokensForModel } from "./context-DtziOKiU.mjs";
import { i as selectModelCatalogRuntimeEntry } from "./model-catalog-view-9sJ2V6c7.mjs";
import { s as createSessionRowModelCacheKey } from "./session-utils-core-CxvBHP5P.mjs";
import { t as projectWorkerPlacementAgentRuntime } from "./placement-session-runtime-D5yJBcMK.mjs";
import { r as resolveGatewaySessionRuntimeProjection } from "./session-utils-projection-CwKHGoI0.mjs";
//#region src/agents/model-context-window.ts
/**
* Resolves a session's selectable context-window choice against the model's
* catalog-declared options: explicit selection, else the declared default,
* else the model's scalar window.
*/
function resolveModelContextWindowProfile(params) {
	const contextWindows = params.catalogEntry?.contextWindows ?? [];
	const contextWindowDefault = params.catalogEntry?.contextWindowDefault;
	const selected = params.selected ? contextWindows.find((option) => option.id === params.selected) : void 0;
	const fallback = contextWindowDefault ? contextWindows.find((option) => option.id === contextWindowDefault) : void 0;
	const effective = selected ?? fallback;
	return {
		contextWindow: effective?.id,
		contextWindows: contextWindows.length > 0 ? contextWindows : void 0,
		contextWindowDefault,
		contextTokens: effective?.contextWindow ?? params.catalogEntry?.contextWindow
	};
}
//#endregion
//#region src/gateway/session-utils-model.ts
function resolveGatewaySessionThinkingLevel(params, thinkingProfile, level) {
	const catalogEntry = params.modelCatalog ? (params.rowContext?.findModelCatalogEntry ?? findModelCatalogEntry)(params.modelCatalog, {
		provider: params.provider,
		modelId: params.model
	}) : void 0;
	if (!catalogEntry || params.providerPolicySource !== void 0 && params.providerPolicySource !== "active-or-bundled" && catalogEntry.reasoning === void 0) return level;
	return resolveSupportedThinkingLevelFromProfile(thinkingProfile, level);
}
function resolveGatewayModelThinkingFacts(params) {
	const catalogEntry = params.agentRuntime == null && params.modelCatalog ? (params.rowContext?.findModelCatalogEntry ?? findModelCatalogEntry)(params.modelCatalog, {
		provider: params.provider,
		modelId: params.model
	}) : void 0;
	const agentRuntime = params.agentRuntime ?? resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: params.provider,
		modelId: params.model,
		modelApi: catalogEntry?.api,
		modelBaseUrl: catalogEntry?.baseUrl,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	const thinkingPolicyProvider = params.thinkingPolicyProvider ?? params.provider;
	const policySource = typeof params.providerPolicySource === "object" ? "prepared" : params.providerPolicySource;
	const key = `${normalizeAgentId(params.agentId)}\0${agentRuntime}\0${normalizeLowercaseStringOrEmpty(thinkingPolicyProvider)}\0${String(params.configuredReasoning)}\0${policySource ?? "active-or-bundled"}\0${createSessionRowModelCacheKey(params.provider, params.model)}`;
	const cached = params.rowContext?.thinkingFactsByModelRef.get(key);
	if (cached) return cached;
	const thinkingProfile = resolveThinkingProfile({
		provider: thinkingPolicyProvider,
		model: params.model,
		catalog: params.modelCatalog,
		catalogResolver: params.catalogResolver,
		agentRuntime,
		configuredReasoning: params.configuredReasoning,
		providerPolicySource: params.providerPolicySource
	});
	const thinkingLevels = thinkingProfile.levels.map(({ id, label }) => ({
		id,
		label
	}));
	let thinkingDefault;
	if (thinkingLevels.length > 0) {
		const resolved = resolveGatewaySessionThinkingLevel(params, thinkingProfile, resolveThinkingDefaultCore({
			cfg: params.cfg,
			agentId: params.agentId,
			provider: params.provider,
			model: params.model,
			catalog: params.modelCatalog,
			catalogResolver: params.catalogResolver,
			agentRuntime,
			providerPolicySource: params.providerPolicySource
		}));
		thinkingDefault = thinkingProfile.levels.some(({ id }) => id !== "ultra") || resolved === "ultra" ? resolved : void 0;
	}
	const facts = {
		profile: thinkingProfile,
		metadata: {
			thinkingLevels,
			thinkingDefault
		}
	};
	params.rowContext?.thinkingFactsByModelRef.set(key, facts);
	return facts;
}
function resolveGatewayModelThinkingProfile(params) {
	return resolveGatewayModelThinkingFacts(params).metadata;
}
function resolveGatewaySessionThinkingProjectionInternal(params) {
	const { acpMeta, agentRuntime, runtimeSelectionLocked } = resolveGatewaySessionRuntimeProjection(params);
	const logicalEntry = params.modelCatalog ? (params.rowContext?.findModelCatalogEntry ?? findModelCatalogEntry)(params.modelCatalog, {
		provider: params.provider,
		modelId: params.model
	}) : void 0;
	const thinkingRuntime = acpMeta ? concretizeAgentRuntime(acpMeta.backend ?? agentRuntime.id) : agentRuntime.source === "session" ? agentRuntime.id : resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: params.provider,
		modelId: params.model,
		modelApi: logicalEntry?.api,
		modelBaseUrl: logicalEntry?.baseUrl,
		agentScope: {
			kind: "prepared",
			agentId: params.agentId
		},
		sessionKey: params.sessionKey,
		sessionEntry: params.entry
	});
	const catalogEntry = logicalEntry && params.modelCatalogRouteVariants ? (params.rowContext?.selectModelCatalogRuntimeEntry ?? selectModelCatalogRuntimeEntry)({
		entry: logicalEntry,
		routeVariants: params.modelCatalogRouteVariants,
		runtimeId: thinkingRuntime
	}).entry : logicalEntry;
	const runtimeCatalog = catalogEntry && params.modelCatalogRouteVariants ? [catalogEntry] : params.modelCatalog;
	const { metadata, profile: thinkingProfile } = resolveGatewayModelThinkingFacts({
		cfg: params.cfg,
		agentId: params.agentId,
		provider: params.provider,
		model: params.model,
		agentRuntime: thinkingRuntime,
		modelCatalog: runtimeCatalog,
		rowContext: params.rowContext,
		providerPolicySource: params.providerPolicySource
	});
	const storedThinkingLevel = normalizeThinkLevel(params.entry?.thinkingLevel);
	const thinkingLevel = storedThinkingLevel ? resolveGatewaySessionThinkingLevel({
		...params,
		modelCatalog: runtimeCatalog
	}, thinkingProfile, storedThinkingLevel) : void 0;
	return {
		acpMeta,
		catalogEntry,
		agentRuntime,
		runtimeSelectionLocked,
		thinkingLevel,
		effectiveThinkingLevel: thinkingLevel ?? metadata.thinkingDefault,
		thinkingLevels: metadata.thinkingLevels,
		thinkingOptions: metadata.thinkingLevels.map((level) => level.label),
		thinkingDefault: metadata.thinkingDefault
	};
}
function getSessionDefaults(cfg, modelCatalog, options) {
	const agentId = normalizeAgentId(options?.agentId ?? tryResolveLegacyCompatibilityAgentId(cfg) ?? "main");
	const resolved = options?.modelRef ?? (options?.agentId ? resolveDefaultModelForAgent({
		cfg,
		agentId,
		allowPluginNormalization: options.allowPluginNormalization,
		manifestPlugins: options.metadataSnapshot
	}) : resolveConfiguredModelRef({
		cfg,
		defaultProvider: "openai",
		defaultModel: "gpt-6-astra",
		allowPluginNormalization: options?.allowPluginNormalization,
		manifestPlugins: options?.metadataSnapshot
	}));
	const displayModel = resolveSessionDisplayModelIdentityRefCached({
		cfg,
		provider: resolved.provider,
		model: resolved.model
	});
	const catalogEntry = modelCatalog ? findModelCatalogEntry(modelCatalog, {
		provider: resolved.provider,
		modelId: resolved.model
	}) : void 0;
	const contextWindowProfile = resolveModelContextWindowProfile({ catalogEntry });
	const resolvedContextTokens = resolveContextTokensForModel({
		cfg,
		provider: resolved.provider,
		model: resolved.model,
		modelContextTokens: catalogEntry?.contextTokens,
		modelContextWindow: contextWindowProfile.contextTokens,
		allowAsyncLoad: false
	}) ?? 2e5;
	const contextTokens = contextWindowProfile.contextTokens ? Math.min(resolvedContextTokens, contextWindowProfile.contextTokens) : resolvedContextTokens;
	const sessionKey = resolveAgentMainSessionKey({
		cfg,
		agentId
	});
	const agentRuntime = projectWorkerPlacementAgentRuntime(resolveModelAgentRuntimeMetadata({
		cfg,
		agentId,
		provider: resolved.provider,
		model: resolved.model,
		sessionKey,
		acpRuntime: false
	}));
	const thinkingProfile = resolveGatewayModelThinkingProfile({
		cfg,
		provider: resolved.provider,
		model: resolved.model,
		agentId,
		modelCatalog: modelCatalog ?? (options?.providerPolicySource !== void 0 && options.providerPolicySource !== "active-or-bundled" ? [] : void 0),
		sessionKey,
		providerPolicySource: options?.providerPolicySource
	});
	return {
		modelProvider: displayModel.provider ?? resolved.provider,
		model: displayModel.model ?? resolved.model,
		contextTokens: contextTokens ?? null,
		contextWindow: contextWindowProfile.contextWindow,
		contextWindows: contextWindowProfile.contextWindows,
		contextWindowDefault: contextWindowProfile.contextWindowDefault,
		agentRuntime,
		thinkingLevels: thinkingProfile.thinkingLevels,
		thinkingOptions: thinkingProfile.thinkingLevels.map((level) => level.label),
		thinkingDefault: thinkingProfile.thinkingDefault
	};
}
function normalizeGatewayModelCapabilityBaseUrl(value) {
	return normalizeCatalogRouteBaseUrl(normalizeOptionalString(value));
}
function isGatewayModelExplicitlyConfiguredTextOnly(params) {
	if (!params.provider) return false;
	const configuredModel = findNormalizedProviderValue(params.snapshot.config.models?.providers, params.provider)?.models?.find((model) => normalizeLowercaseStringOrEmpty(model.id) === normalizeLowercaseStringOrEmpty(params.model));
	return configuredModel?.input !== void 0 && !configuredModel.input.includes("image");
}
function resolveGatewayProviderStaticModel(params) {
	if (!params.agentId || !params.provider || !publishedModelCatalogOwnerMatchesAgent(params.snapshot, params.agentId)) return;
	const staticEntry = findModelCatalogEntry(params.snapshot.staticEntries ?? [], {
		provider: params.provider,
		modelId: params.model
	});
	if (!staticEntry) return;
	if (params.catalogEntry?.api && params.catalogEntry.api !== staticEntry.api) return;
	const catalogBaseUrl = normalizeGatewayModelCapabilityBaseUrl(params.catalogEntry?.baseUrl);
	const staticBaseUrl = normalizeGatewayModelCapabilityBaseUrl(staticEntry.baseUrl);
	if (catalogBaseUrl && catalogBaseUrl !== staticBaseUrl) return;
	const configuredProvider = findNormalizedProviderValue(params.snapshot.config.models?.providers, params.provider);
	const normalizedModelId = normalizeLowercaseStringOrEmpty(params.model);
	const configuredModel = configuredProvider?.models?.find((model) => normalizeLowercaseStringOrEmpty(model.id) === normalizedModelId);
	if (configuredModel?.input !== void 0 && !configuredModel.input.includes("image")) return;
	const configuredApi = configuredModel?.api ?? configuredProvider?.api;
	if (configuredApi && configuredApi !== staticEntry.api) return;
	const configuredBaseUrl = normalizeGatewayModelCapabilityBaseUrl(configuredModel?.baseUrl ?? configuredProvider?.baseUrl);
	if (configuredBaseUrl && configuredBaseUrl !== staticBaseUrl) return;
	return staticEntry;
}
async function resolveGatewayModelSupportsImages(params) {
	if (!params.model) return true;
	try {
		for (const readOnly of [true, false]) {
			const loadParams = {
				...params.agentId ? { agentId: params.agentId } : {},
				readOnly
			};
			const snapshot = params.loadGatewayModelCatalogSnapshot ? await params.loadGatewayModelCatalogSnapshot(loadParams) : void 0;
			const catalog = snapshot ? snapshot.entries : await params.loadGatewayModelCatalog(loadParams);
			const catalogEntry = findModelCatalogEntry(catalog, {
				provider: params.provider,
				modelId: params.model
			});
			const modelEntry = (snapshot && (!catalogEntry || !modelSupportsInput(catalogEntry, "image")) ? resolveGatewayProviderStaticModel({
				snapshot,
				agentId: params.agentId,
				provider: params.provider,
				model: params.model,
				catalogEntry
			}) : void 0) ?? catalogEntry;
			const normalizedProvider = normalizeOptionalLowercaseString(params.provider ?? modelEntry?.provider);
			const normalizedCandidates = [normalizeLowercaseStringOrEmpty(params.model), normalizeLowercaseStringOrEmpty(modelEntry?.name)].filter(Boolean);
			const claudeCliSupportsImages = normalizedProvider === "claude-cli" && normalizedCandidates.some((candidate) => candidate === "opus" || candidate === "sonnet" || candidate === "haiku" || candidate.startsWith("claude-"));
			if (modelEntry) {
				if (modelSupportsInput(modelEntry, "image")) return true;
				if (normalizedProvider === "microsoft-foundry" && normalizedCandidates.some((candidate) => candidate.startsWith("gpt-") || candidate.startsWith("o1") || candidate.startsWith("o3") || candidate.startsWith("o4") || candidate === "computer-use-preview")) return true;
				if (claudeCliSupportsImages) return true;
				if (readOnly && !snapshot?.catalogComplete && (!snapshot || !isGatewayModelExplicitlyConfiguredTextOnly({
					snapshot,
					provider: params.provider,
					model: params.model
				}))) continue;
				return false;
			}
			if (claudeCliSupportsImages) return true;
			if (readOnly && snapshot?.catalogComplete) return false;
		}
		return false;
	} catch {
		return false;
	}
}
function resolveSessionDisplayModelIdentityRefCached(params) {
	const ctx = params.rowContext;
	const key = ctx ? createSessionRowModelCacheKey(params.provider, params.model) : void 0;
	const cached = key === void 0 ? void 0 : ctx?.displayModelIdentityByKey.get(key);
	if (cached) return cached;
	const provider = normalizeOptionalString(params.provider);
	const model = normalizeOptionalString(params.model);
	let value = {
		provider,
		model
	};
	if (provider && model && isCliProvider(provider, params.cfg)) {
		const identity = (model.includes("/") ? parseModelRef(model, provider, {
			allowPluginNormalization: false,
			allowManifestNormalization: false
		}) : null) ?? {
			provider,
			model
		};
		value = {
			provider: resolveCliRuntimeCanonicalProvider({
				runtime: identity.provider,
				config: params.cfg,
				includeSetupRegistry: true
			}) ?? identity.provider,
			model: identity.model
		};
	}
	if (ctx && key !== void 0) ctx.displayModelIdentityByKey.set(key, value);
	return value;
}
function projectSessionPatchResult(params) {
	const agentId = resolveSessionAgentId({
		config: params.cfg,
		sessionKey: params.canonicalKey,
		agentId: params.targetAgentId
	});
	const resolved = resolveSessionModelRef(params.cfg, params.entry, agentId);
	const displayModel = resolveSessionDisplayModelIdentityRefCached({
		cfg: params.cfg,
		provider: resolved.provider,
		model: resolved.model
	});
	const modelCatalog = params.modelCatalog;
	const thinking = resolveGatewaySessionThinkingProjectionInternal({
		cfg: params.cfg,
		agentId,
		provider: resolved.provider,
		model: resolved.model,
		sessionKey: params.canonicalKey,
		entry: params.entry,
		modelCatalog,
		modelCatalogRouteVariants: params.modelCatalogRouteVariants
	});
	const contextWindow = resolveModelContextWindowProfile({
		catalogEntry: thinking.catalogEntry,
		selected: params.entry.contextWindow
	});
	return {
		ok: true,
		path: resolveSqliteTargetFromSessionStorePath(params.storePath, { agentId: params.targetAgentId }).path,
		key: params.canonicalKey,
		entry: projectPublicSessionEntry(params.entry),
		resolved: {
			modelProvider: displayModel.provider,
			model: displayModel.model,
			agentRuntime: thinking.agentRuntime,
			runtimeSelectionLocked: thinking.runtimeSelectionLocked,
			...modelCatalog ? {
				contextWindow: contextWindow.contextWindow,
				contextWindows: contextWindow.contextWindows,
				thinkingLevel: thinking.effectiveThinkingLevel,
				thinkingLevels: thinking.thinkingLevels
			} : {}
		}
	};
}
//#endregion
export { resolveGatewaySessionThinkingProjectionInternal as a, resolveGatewayModelThinkingProfile as i, projectSessionPatchResult as n, resolveSessionDisplayModelIdentityRefCached as o, resolveGatewayModelSupportsImages as r, resolveModelContextWindowProfile as s, getSessionDefaults as t };
