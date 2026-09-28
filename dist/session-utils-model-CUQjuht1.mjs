import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { S as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { h as resolveConfiguredModelRef } from "./model-selection-shared-0uvJbX1M.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { r as modelSupportsInput, t as findModelCatalogEntry } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { n as parseModelRef, t as findNormalizedProviderValue } from "./model-selection-normalize-Dij_chYC.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { s as normalizeThinkLevel } from "./thinking.shared-BKzBCWpI.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-De-bcoks.mjs";
import "./model-catalog-Dt2JkTIv.mjs";
import { n as publishedModelCatalogOwnerMatchesAgent } from "./prepared-model-catalog-owner-BIljybvR.mjs";
import { c as resolveSupportedThinkingLevelFromProfile, u as resolveThinkingProfile } from "./thinking-B1p5pEC8.mjs";
import { s as isCliProvider } from "./model-selection-CFnUi6iD.mjs";
import { r as resolveThinkingDefaultCore } from "./model-thinking-default-BQDdsH3k.mjs";
import { o as resolveCliRuntimeCanonicalProvider } from "./cli-backends-CNff5-1q.mjs";
import { o as resolveEffectiveAgentRuntime, t as concretizeAgentRuntime } from "./thinking-runtime-CYXCkx2Z.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { v as projectPublicSessionEntry } from "./session-accessor.sqlite-transcript-write-CM5480eZ.mjs";
import "./sessions-Cesa3L0p.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-DGVV7laa.mjs";
import { c as createSessionRowModelCacheKey } from "./session-utils-core-CPCyMcSJ.mjs";
import { n as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata--JWhWgO5.mjs";
import { a as resolveContextTokensForModel } from "./context-na2bB1IO.mjs";
import { i as selectModelCatalogRuntimeEntry } from "./model-catalog-view-DWAQHc1p.mjs";
import { t as resolveModelContextWindowProfile } from "./model-context-window-CoR3Uyg1.mjs";
import { t as projectWorkerPlacementAgentRuntime } from "./placement-session-runtime-PDZExznz.mjs";
import { r as resolveGatewaySessionRuntimeProjection } from "./session-utils-projection-DROAVGV8.mjs";
//#region src/gateway/session-utils-model.ts
function resolveGatewaySessionThinkingLevel(params) {
	const catalogEntry = params.modelCatalog ? (params.rowContext?.findModelCatalogEntry ?? findModelCatalogEntry)(params.modelCatalog, {
		provider: params.provider,
		modelId: params.model
	}) : void 0;
	if (!catalogEntry || params.providerPolicySource !== void 0 && params.providerPolicySource !== "active-or-bundled" && catalogEntry.reasoning === void 0) return params.level;
	return resolveSupportedThinkingLevelFromProfile(params.thinkingProfile, params.level);
}
function resolveGatewaySessionThinkingDefault(params) {
	const defaultLevel = resolveThinkingDefaultCore({
		cfg: params.cfg,
		agentId: params.agentId,
		provider: params.provider,
		model: params.model,
		catalog: params.modelCatalog,
		catalogResolver: params.catalogResolver,
		agentRuntime: params.agentRuntime,
		providerPolicySource: params.providerPolicySource
	});
	return resolveGatewaySessionThinkingLevel({
		provider: params.provider,
		model: params.model,
		level: defaultLevel,
		thinkingProfile: params.thinkingProfile,
		modelCatalog: params.modelCatalog,
		providerPolicySource: params.providerPolicySource,
		rowContext: params.rowContext
	});
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
	const facts = {
		profile: thinkingProfile,
		metadata: {
			thinkingLevels,
			thinkingDefault: thinkingLevels.length > 0 ? resolveGatewaySessionThinkingDefault({
				cfg: params.cfg,
				thinkingProfile,
				provider: params.provider,
				model: params.model,
				agentId: params.agentId,
				modelCatalog: params.modelCatalog,
				catalogResolver: params.catalogResolver,
				agentRuntime,
				providerPolicySource: params.providerPolicySource,
				rowContext: params.rowContext
			}) : void 0
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
		provider: params.provider,
		model: params.model,
		level: storedThinkingLevel,
		thinkingProfile,
		modelCatalog: runtimeCatalog,
		providerPolicySource: params.providerPolicySource,
		rowContext: params.rowContext
	}) : void 0;
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
	const resolved = options?.agentId ? resolveDefaultModelForAgent({
		cfg,
		agentId,
		allowPluginNormalization: options.allowPluginNormalization,
		manifestPlugins: options.metadataSnapshot
	}) : resolveConfiguredModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowPluginNormalization: options?.allowPluginNormalization,
		manifestPlugins: options?.metadataSnapshot
	});
	const displayModel = resolveSessionDisplayModelIdentityRef({
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
	const baseUrl = normalizeOptionalString(value);
	if (!baseUrl) return;
	try {
		const parsed = new URL(baseUrl);
		parsed.pathname = parsed.pathname.replace(/\/+$/u, "") || "/";
		return parsed.toString();
	} catch {
		return baseUrl.replace(/\/+$/u, "");
	}
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
	if (isGatewayModelExplicitlyConfiguredTextOnly(params)) return;
	const configuredProvider = findNormalizedProviderValue(params.snapshot.config.models?.providers, params.provider);
	const normalizedModelId = normalizeLowercaseStringOrEmpty(params.model);
	const configuredModel = configuredProvider?.models?.find((model) => normalizeLowercaseStringOrEmpty(model.id) === normalizedModelId);
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
			if (modelEntry) {
				if (modelSupportsInput(modelEntry, "image")) return true;
				if (normalizedProvider === "microsoft-foundry" && normalizedCandidates.some((candidate) => candidate.startsWith("gpt-") || candidate.startsWith("o1") || candidate.startsWith("o3") || candidate.startsWith("o4") || candidate === "computer-use-preview")) return true;
				if (normalizedProvider === "claude-cli" && normalizedCandidates.some((candidate) => candidate === "opus" || candidate === "sonnet" || candidate === "haiku" || candidate.startsWith("claude-"))) return true;
				if (readOnly && !snapshot?.catalogComplete && (!snapshot || !isGatewayModelExplicitlyConfiguredTextOnly({
					snapshot,
					provider: params.provider,
					model: params.model
				}))) continue;
				return false;
			}
			if (normalizedProvider === "claude-cli" && normalizedCandidates.some((candidate) => candidate === "opus" || candidate === "sonnet" || candidate === "haiku" || candidate.startsWith("claude-"))) return true;
			if (readOnly && snapshot?.catalogComplete) return false;
		}
		return false;
	} catch {
		return false;
	}
}
function resolveSessionDisplayModelIdentityRefCached(params) {
	const ctx = params.rowContext;
	if (!ctx) return resolveSessionDisplayModelIdentityRef(params);
	const key = createSessionRowModelCacheKey(params.provider, params.model);
	const cached = ctx.displayModelIdentityByKey.get(key);
	if (cached) return cached;
	const value = resolveSessionDisplayModelIdentityRef(params);
	ctx.displayModelIdentityByKey.set(key, value);
	return value;
}
function resolveSessionDisplayModelIdentityRef(params) {
	const provider = normalizeOptionalString(params.provider);
	const model = normalizeOptionalString(params.model);
	if (!provider || !model || !isCliProvider(provider, params.cfg)) return {
		provider,
		model
	};
	const identity = (model.includes("/") ? parseModelRef(model, provider, {
		allowPluginNormalization: false,
		allowManifestNormalization: false
	}) : null) ?? {
		provider,
		model
	};
	return {
		provider: resolveCliRuntimeCanonicalProvider({
			runtime: identity.provider,
			config: params.cfg,
			includeSetupRegistry: true
		}) ?? identity.provider,
		model: identity.model
	};
}
function projectSessionPatchResult(params) {
	const agentId = resolveSessionAgentId({
		config: params.cfg,
		sessionKey: params.canonicalKey,
		agentId: params.targetAgentId
	});
	const resolved = resolveSessionModelRef(params.cfg, params.entry, agentId);
	const displayModel = resolveSessionDisplayModelIdentityRef({
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
export { resolveGatewaySessionThinkingProjectionInternal as a, resolveGatewayModelThinkingProfile as i, projectSessionPatchResult as n, resolveSessionDisplayModelIdentityRefCached as o, resolveGatewayModelSupportsImages as r, getSessionDefaults as t };
