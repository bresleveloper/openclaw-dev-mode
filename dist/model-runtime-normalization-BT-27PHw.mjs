import "./src-CZ2wJvNB.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId, t as findNormalizedProviderKey } from "./provider-id-DCtsDflE.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { o as normalizeModelRef } from "./model-ref-shared-BgRrSHjn.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { c as loadManifestMetadataSnapshot, n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DZSSnYMd.mjs";
import { o as resolveEffectiveAgentRuntime, r as needsThinkHydration } from "./thinking-runtime-CYXCkx2Z.mjs";
import { t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-Doz1rFpm.mjs";
import { n as resolveModelRuntimeDirective, t as applyModelRuntimeDirective } from "./directive-handling.model-runtime-70H4lLy3.mjs";
//#region src/auto-reply/reply/model-runtime-normalization.ts
/** Prepared plugin metadata handoff for runtime model normalization. */
function normalizeRuntimeChoiceId(runtime) {
	const normalized = normalizeLowercaseStringOrEmpty(runtime);
	if (!normalized || normalized === "auto" || normalized === "default") return "openclaw";
	return normalized;
}
/** Carries the Gateway-owned metadata snapshot through one model-selection run. */
function resolveRuntimeNormalization(cfg) {
	return {
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
		manifestPlugins: getCurrentPluginMetadataSnapshot({
			config: cfg,
			allowWorkspaceScopedSnapshot: true
		})
	};
}
function normalizeRuntimeRef(provider, model, normalization = RUNTIME_MODEL_VISIBILITY_NORMALIZATION) {
	return normalizeModelRef(provider, model, normalization);
}
function findSelectedCatalogEntry(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	const selectedKey = modelKey(normalizedProvider, params.model);
	return params.catalog?.find((entry) => normalizeProviderId(entry.provider) === normalizedProvider && entry.id.trim() === params.model.trim()) ?? params.catalog?.find((entry) => modelKey(entry.provider, entry.id) === selectedKey);
}
/** Provider identity comes from authored routes or prepared/plugin metadata, not model inventory. */
function isKnownModelSelectionProvider(params) {
	const provider = normalizeProviderId(params.provider);
	if (findNormalizedProviderKey(params.cfg.models?.providers, provider) || params.catalog.some((entry) => normalizeProviderId(entry.provider) === provider)) return true;
	const snapshot = loadManifestMetadataSnapshot({ config: params.cfg });
	return snapshot.plugins.some((plugin) => plugin.providers.some((id) => normalizeProviderId(id) === provider) && isManifestPluginAvailableForControlPlane({
		snapshot,
		plugin,
		config: params.cfg
	}));
}
/** Prepare runtime and capabilities for the selected route before any session mutation. */
async function prepareModelSelectionRuntime(params) {
	const sessionEntry = params.profileOverride ? {
		...params.sessionEntry,
		providerOverride: params.provider,
		modelProvider: params.provider,
		authProfileOverride: params.profileOverride,
		authProfileOverrideSource: "user"
	} : params.sessionEntry;
	let runtime = resolveModelRuntimeDirective(params);
	if (runtime.kind === "invalid") return {
		status: "rejected",
		reason: "invalid-runtime",
		message: runtime.errorText
	};
	const selected = findSelectedCatalogEntry(params);
	if (!isKnownModelSelectionProvider(params)) return {
		status: "rejected",
		reason: "unknown-provider",
		message: `Unknown provider "${params.provider}". Use /models to list providers.`
	};
	let validateRuntimeSelection;
	let harness;
	let inheritedCliRuntime;
	let needsRuntimeChoice = runtime.kind === "set";
	if (!params.rawRuntime) {
		const runtimeFacts = {
			agentId: params.agentId,
			provider: params.provider,
			modelId: params.model,
			modelApi: selected?.api,
			modelBaseUrl: selected?.baseUrl
		};
		const policy = resolveAgentHarnessPolicy({
			...runtimeFacts,
			config: params.cfg
		});
		const effectiveRuntime = resolveEffectiveAgentRuntime({
			...runtimeFacts,
			cfg: params.cfg,
			sessionEntry
		});
		if (runtime.kind === "clear" || !sessionEntry?.agentRuntimeOverride) inheritedCliRuntime = resolveCliRuntimeExecutionProvider({
			cfg: params.cfg,
			agentId: params.agentId,
			provider: params.provider,
			modelId: params.model,
			authProfileId: sessionEntry?.authProfileOverride
		});
		needsRuntimeChoice = Boolean(selected?.nativeRuntime || effectiveRuntime !== "openclaw" || inheritedCliRuntime || policy.forcedByEnvironment && policy.runtime !== "openclaw");
	}
	if (needsRuntimeChoice) {
		const { preparePublishedModelRuntimeChoice } = await import("./model-runtime-choice-CCnNRAcV.mjs");
		const choice = await preparePublishedModelRuntimeChoice({
			...params,
			sessionEntry,
			runtimeId: runtime.kind === "set" ? runtime.runtime : void 0,
			preferredRuntimeId: (runtime.kind === "unchanged" ? normalizeOptionalAgentRuntimeId(sessionEntry?.agentRuntimeOverride) : void 0) ?? inheritedCliRuntime
		});
		if (choice.kind === "unavailable") return {
			status: "rejected",
			reason: "invalid-runtime",
			message: choice.message
		};
		validateRuntimeSelection = choice.validate;
		harness = choice.harness;
		runtime = {
			kind: "set",
			runtime: choice.runtimeId
		};
	}
	const runtimeEntry = { ...sessionEntry };
	applyModelRuntimeDirective(runtimeEntry, runtime);
	const agentRuntime = runtime.kind === "set" ? runtime.runtime : resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		agentId: params.agentId,
		provider: params.provider,
		modelId: params.model,
		modelApi: selected?.api,
		modelBaseUrl: selected?.baseUrl,
		sessionEntry: runtimeEntry
	});
	if (!needsThinkHydration(params.catalog, params.provider, params.model, agentRuntime)) return {
		status: "ready",
		runtime,
		catalog: [...params.catalog],
		validateRuntimeSelection,
		harness
	};
	const { loadProviderScopedThinkingCatalog } = await import("./agents/model-catalog.runtime.js");
	const catalog = await loadProviderScopedThinkingCatalog({
		config: params.cfg,
		agentId: params.agentId,
		provider: params.provider,
		model: params.model,
		agentRuntime,
		workspaceDir: params.workspaceDir
	});
	const resolved = findSelectedCatalogEntry({
		...params,
		catalog
	});
	return {
		status: "ready",
		runtime,
		validateRuntimeSelection,
		harness,
		catalog: resolved ? [resolved, ...params.catalog.filter((entry) => entry !== selected)] : [...params.catalog]
	};
}
function modelCatalogEntryKey(entry) {
	return JSON.stringify([entry.provider.trim(), entry.id.trim()]);
}
/** Retain prepared-only models while overlaying matching configured model metadata. */
function mergePreparedConfiguredCatalog(params) {
	if (!params.prepared?.length) return params.configured;
	const mergedByKey = new Map(params.configured.map((entry) => [modelCatalogEntryKey(entry), entry]));
	for (const entry of params.prepared) {
		const key = modelCatalogEntryKey(entry);
		mergedByKey.set(key, {
			...mergedByKey.get(key),
			...entry
		});
	}
	return [...mergedByKey.values()];
}
//#endregion
export { normalizeRuntimeRef as a, normalizeRuntimeChoiceId as i, isKnownModelSelectionProvider as n, prepareModelSelectionRuntime as o, mergePreparedConfiguredCatalog as r, resolveRuntimeNormalization as s, findSelectedCatalogEntry as t };
