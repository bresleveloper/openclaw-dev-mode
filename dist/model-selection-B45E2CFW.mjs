import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { n as buildModelCatalogRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { a as resolveAgentDir, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-C5zAusBU.mjs";
import { D as hasSessionAutoModelSelection, E as hasSessionAutoModelFallbackProvenance, r as hasLegacyAutoFallbackWithoutOrigin } from "./agent-scope-CTuYDtny.mjs";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-BspGC-O6.mjs";
import { i as isUserModelAuthProfileId } from "./profile-usage-stats-Uo3hJqOO.mjs";
import { r as resolveModelAliasFromPair } from "./model-selection-resolve-D7hqOXrq.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import { n as isStoredCredentialCompatibleWithAuthProvider } from "./order-BQhYF772.mjs";
import { t as resolveModelProviderAuthConfig } from "./model-auth-provider-route-qM_24l0u.mjs";
import { a as resolveReasoningDefault } from "./model-selection-CFnUi6iD.mjs";
import { n as resolveConfiguredThinkingDefaultCore, r as resolveThinkingDefaultCore } from "./model-thinking-default-BQDdsH3k.mjs";
import { o as resolveEffectiveAgentRuntime, r as needsThinkHydration } from "./thinking-runtime-CYXCkx2Z.mjs";
import { a as applyModelOverrideToSessionEntry } from "./model-overrides-FXSJttoI.mjs";
import { i as SessionWorkStartInvalidatedError } from "./lifecycle-CQXOIBZ7.mjs";
import { r as resolveStoredModelOverrideCore, t as resolveDirectStoredModelOverride } from "./stored-model-overrides-Covy02dM.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-Doz1rFpm.mjs";
import { t as clearSessionAuthProfileOverride } from "./session-override-BzmYtff7.mjs";
import { a as sessionModelOverrideChangesApplied, n as adoptPersistedSessionSnapshot } from "./session-snapshot-merge-Br9OMCio.mjs";
import { a as normalizeRuntimeRef, r as mergePreparedConfiguredCatalog, s as resolveRuntimeNormalization, t as findSelectedCatalogEntry } from "./model-runtime-normalization-BT-27PHw.mjs";
import "./model-selection-directive-a95HzxiM.mjs";
import "./model-selection-context-CWZoFj8G.mjs";
//#region src/auto-reply/reply/stored-model-override.ts
/** Detects heartbeat auto-fallback overrides that no longer match the primary model. */
function isStaleHeartbeatAutoFallbackOverride(params) {
	if (params.isHeartbeat !== true || params.hasResolvedHeartbeatModelOverride === true) return false;
	if (params.storedOverride?.source !== "session") return false;
	const entry = params.sessionEntry;
	const recoveredAutoFallbackOverride = entry !== void 0 && entry.modelOverrideSource === void 0 && hasSessionAutoModelFallbackProvenance(entry);
	if (entry?.modelOverrideSource !== "auto" && !recoveredAutoFallbackOverride) return false;
	if (!entry) return false;
	const primaryProvider = params.primaryProvider ?? params.defaultProvider;
	const primaryModel = params.primaryModel ?? params.defaultModel;
	const originModel = normalizeOptionalString(entry.modelOverrideFallbackOriginModel);
	if (originModel) return (normalizeOptionalString(entry.modelOverrideFallbackOriginProvider) ?? params.defaultProvider) !== primaryProvider || originModel !== primaryModel;
	const noticeSelectedKey = normalizeOptionalString(entry.fallbackNotice?.selectedModel);
	return noticeSelectedKey ? noticeSelectedKey !== buildModelCatalogRef(primaryProvider, primaryModel) : (params.storedOverride.provider ?? params.defaultProvider) !== primaryProvider || params.storedOverride.model !== primaryModel;
}
//#endregion
//#region src/auto-reply/reply/model-selection.ts
/** Model selection state for reply runs, including catalog and override handling. */
const modelCatalogRuntimeLoader = createLazyImportLoader(() => import("./agents/model-catalog.runtime.js"));
const sessionPersistenceRuntimeLoader = createLazyImportLoader(() => import("./session-entry-persistence-B5u2eS7v.mjs"));
function loadPreparedModelCatalogRuntime() {
	return modelCatalogRuntimeLoader.load();
}
function loadSessionPersistenceRuntime() {
	return sessionPersistenceRuntimeLoader.load();
}
/** Resolves provider/model, allowlist, catalog, and thinking defaults for a reply run. */
async function createModelSelectionState(params) {
	const timingEnabled = isDiagnosticFlagEnabled("ingress.timing", params.cfg);
	const startMs = timingEnabled ? Date.now() : 0;
	const logStage = (stage, extra) => {
		if (!timingEnabled) return;
		const suffix = extra ? ` ${extra}` : "";
		console.log(`[model-selection] session=${params.sessionKey ?? "(no-session)"} stage=${stage} elapsedMs=${Date.now() - startMs}${suffix}`);
	};
	const { cfg, agentCfg, sessionEntry, sessionStore, sessionKey, parentSessionKey, storePath, defaultProvider, defaultModel } = params;
	const loadRuntimeCatalogSnapshot = async () => params.preparedModelCatalog ?? await (await loadPreparedModelCatalogRuntime()).loadPreparedModelCatalogSnapshot({
		config: cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		readOnly: true
	});
	const runtimeModelNormalization = resolveRuntimeNormalization(cfg);
	let provider = params.provider;
	let model = params.model;
	const primaryProvider = params.primaryProvider ?? defaultProvider;
	const primaryModel = params.primaryModel ?? defaultModel;
	const hasOneTurnModelOverride = params.hasOneTurnModelOverride === true;
	const modelSelectionLocked = sessionEntry?.modelSelectionLocked === true;
	const agentEntry = params.agentId ? resolveAgentConfig(cfg, params.agentId) : void 0;
	let visibilityPolicy = createModelVisibilityPolicy({
		cfg,
		catalog: [],
		defaultProvider,
		defaultModel: {
			provider: defaultProvider,
			model: defaultModel
		},
		agentId: params.agentId,
		...runtimeModelNormalization
	});
	const hasAllowlist = !visibilityPolicy.allowAny;
	const hasConfiguredModels = Object.keys(agentCfg?.models ?? {}).length > 0 || Object.keys(agentEntry?.models ?? {}).length > 0;
	const defaultModelVisibleByWildcard = visibilityPolicy.allowsByWildcard({
		provider: defaultProvider,
		model: defaultModel
	});
	const configuredModelCatalog = mergePreparedConfiguredCatalog({
		configured: [...visibilityPolicy.configuredCatalog],
		prepared: params.preparedModelCatalog?.entries
	});
	const needsModelCatalog = params.hasModelDirective || hasAllowlist && visibilityPolicy.hasProviderWildcards && !defaultModelVisibleByWildcard;
	let allowedModelKeys = /* @__PURE__ */ new Set();
	let allowedModelCatalog = configuredModelCatalog;
	let modelCatalog = null;
	let catalogAuthoritative = true;
	let resetModelOverride = false;
	let resetModelOverrideRef;
	let resetModelOverrideReason;
	const directStoredModelOverride = resolveDirectStoredModelOverride({
		sessionEntry,
		defaultProvider,
		allowPluginNormalization: runtimeModelNormalization.allowPluginNormalization,
		manifestPlugins: runtimeModelNormalization.manifestPlugins
	});
	const primaryHarnessPolicy = resolveAgentHarnessPolicy({
		provider: primaryProvider,
		modelId: primaryModel,
		config: cfg,
		agentId: params.agentId,
		sessionKey
	});
	const directOverrideRef = directStoredModelOverride ? {
		provider: directStoredModelOverride.provider ?? defaultProvider,
		model: directStoredModelOverride.model
	} : void 0;
	const isStaleStoredOverride = (entry, override) => {
		const staleHeartbeatAutoFallbackOverride = isStaleHeartbeatAutoFallbackOverride({
			isHeartbeat: params.isHeartbeat,
			hasResolvedHeartbeatModelOverride: params.hasResolvedHeartbeatModelOverride,
			sessionEntry: entry,
			storedOverride: override,
			defaultProvider,
			defaultModel,
			primaryProvider: params.primaryProvider,
			primaryModel: params.primaryModel
		});
		const staleLegacyOpenAICodexAutoOverride = override?.source === "session" && entry?.modelOverrideSource === "auto" && normalizeProviderId(override.provider ?? "") === "openai" && normalizeProviderId(primaryProvider) === "openai" && primaryHarnessPolicy.runtime === "codex" && normalizeRuntimeRef("openai", override.model, runtimeModelNormalization).model === normalizeRuntimeRef("openai", primaryModel, runtimeModelNormalization).model;
		const staleLegacyAutoFallbackWithoutOrigin = override?.source === "session" && hasLegacyAutoFallbackWithoutOrigin(entry) && (params.provider !== (override.provider ?? defaultProvider) || params.model !== override.model);
		return staleHeartbeatAutoFallbackOverride || staleLegacyOpenAICodexAutoOverride || staleLegacyAutoFallbackWithoutOrigin;
	};
	const staleDirectStoredOverride = isStaleStoredOverride(sessionEntry, directStoredModelOverride);
	if (needsModelCatalog) {
		const catalogSnapshot = await loadRuntimeCatalogSnapshot();
		modelCatalog = catalogSnapshot.entries;
		catalogAuthoritative = catalogSnapshot.authoritative !== false;
		logStage("catalog-loaded", `entries=${modelCatalog.length} authoritative=${catalogAuthoritative}`);
		visibilityPolicy = createModelVisibilityPolicy({
			cfg,
			catalog: modelCatalog,
			defaultProvider,
			defaultModel: {
				provider: defaultProvider,
				model: defaultModel
			},
			agentId: params.agentId,
			...runtimeModelNormalization
		});
		allowedModelCatalog = visibilityPolicy.allowedCatalog;
		allowedModelKeys = visibilityPolicy.allowedKeys;
		logStage("allowlist-built", `allowed=${allowedModelCatalog.length} keys=${allowedModelKeys.size}`);
	} else if (hasAllowlist || hasConfiguredModels || configuredModelCatalog.length > 0) {
		visibilityPolicy = createModelVisibilityPolicy({
			cfg,
			catalog: configuredModelCatalog,
			defaultProvider,
			defaultModel: {
				provider: defaultProvider,
				model: defaultModel
			},
			agentId: params.agentId,
			...runtimeModelNormalization
		});
		allowedModelCatalog = visibilityPolicy.allowedCatalog;
		allowedModelKeys = visibilityPolicy.allowedKeys;
		logStage("configured-allowlist-built", `allowed=${allowedModelCatalog.length} keys=${allowedModelKeys.size}`);
	}
	if (sessionEntry && sessionStore && sessionKey && directOverrideRef && !hasOneTurnModelOverride) {
		const key = buildModelCatalogRef(directOverrideRef.provider, directOverrideRef.model);
		const overrideAllowed = hasSessionAutoModelSelection(sessionEntry) || visibilityPolicy.allows(directOverrideRef);
		const shouldResetOverride = (staleDirectStoredOverride || !overrideAllowed) && !modelSelectionLocked;
		if (shouldResetOverride && !staleDirectStoredOverride && !catalogAuthoritative) {
			resetModelOverrideRef = key;
			resetModelOverrideReason = "temporarily-unavailable";
		} else if (shouldResetOverride) {
			const initialSessionEntry = { ...sessionEntry };
			const nextSessionEntry = { ...sessionEntry };
			const { updated } = applyModelOverrideToSessionEntry({
				entry: nextSessionEntry,
				selection: {
					provider: primaryProvider,
					model: primaryModel,
					isDefault: true
				},
				preserveAuthProfileOverride: staleDirectStoredOverride
			});
			let resetApplied = updated;
			if (updated) {
				if (storePath) {
					const { persistReplySessionEntry } = await loadSessionPersistenceRuntime();
					const persistence = await persistReplySessionEntry({
						storePath,
						sessionKey,
						initialEntry: initialSessionEntry,
						entry: nextSessionEntry
					});
					if (persistence.status === "lifecycle-invalidated") throw new SessionWorkStartInvalidatedError(persistence.error);
					const persistedEntry = persistence.entry;
					resetApplied = sessionModelOverrideChangesApplied({
						initial: initialSessionEntry,
						next: nextSessionEntry,
						current: persistedEntry
					});
					adoptPersistedSessionSnapshot(sessionEntry, persistedEntry);
				} else adoptPersistedSessionSnapshot(sessionEntry, nextSessionEntry);
				sessionStore[sessionKey] = sessionEntry;
			}
			resetModelOverride = resetApplied;
			if (resetApplied) {
				resetModelOverrideRef = key;
				resetModelOverrideReason = staleDirectStoredOverride ? "stale" : "disallowed";
			}
		}
	}
	if (staleDirectStoredOverride && params.provider === directOverrideRef?.provider && params.model === directOverrideRef.model) {
		provider = primaryProvider;
		model = primaryModel;
	}
	const storedOverride = resolveStoredModelOverrideCore({
		sessionEntry,
		sessionStore,
		sessionKey,
		parentSessionKey,
		defaultProvider,
		allowPluginNormalization: runtimeModelNormalization.allowPluginNormalization,
		manifestPlugins: runtimeModelNormalization.manifestPlugins
	});
	const skipStoredOverride = params.skipStoredModelOverride === true || hasOneTurnModelOverride || params.hasResolvedHeartbeatModelOverride === true || resetModelOverride && staleDirectStoredOverride && storedOverride?.source === "session";
	const usesStoredAutomaticSelection = !skipStoredOverride && storedOverride?.source === "session" && hasSessionAutoModelSelection(sessionEntry) && !isStaleStoredOverride(sessionEntry, storedOverride);
	if (storedOverride?.model && !skipStoredOverride) {
		const storedProvider = storedOverride.provider || defaultProvider;
		const storedRouteCataloged = Boolean(findSelectedCatalogEntry({
			catalog: modelCatalog ?? allowedModelCatalog,
			provider: storedProvider,
			model: storedOverride.model
		}));
		const normalizedStoredOverride = (storedOverride.routeResolution === "raw" && !storedRouteCataloged ? resolveModelAliasFromPair({
			cfg,
			provider: storedProvider,
			model: storedOverride.model,
			defaultProvider,
			aliasIndex: visibilityPolicy.selectionAliasIndex,
			...runtimeModelNormalization
		}) : null) ?? {
			provider: storedProvider,
			model: storedOverride.model
		};
		if (modelSelectionLocked || usesStoredAutomaticSelection || visibilityPolicy.allows(normalizedStoredOverride)) {
			provider = normalizedStoredOverride.provider;
			model = normalizedStoredOverride.model;
		}
	}
	if (!(params.hasModelDirective || hasOneTurnModelOverride || modelSelectionLocked || usesStoredAutomaticSelection)) {
		const allowedInitialSelection = visibilityPolicy.resolveSelection({
			provider,
			model,
			routeResolution: "resolved"
		});
		if (!allowedInitialSelection) {
			const policyPath = visibilityPolicy.allowConfigPath ?? "modelPolicy.allow";
			throw new Error(`Configured default model "${buildModelCatalogRef(provider, model)}" is not allowed by ${policyPath}, and no allowed model is available.`);
		}
		provider = allowedInitialSelection.provider;
		model = allowedInitialSelection.model;
	}
	if (!params.skipStoredModelOverride && sessionEntry && sessionStore && sessionKey && sessionEntry.authProfileOverride) {
		const { ensureAuthProfileStore } = await import("./agents/auth-profiles.runtime.js");
		const store = ensureAuthProfileStore(params.agentId ? resolveAgentDir(cfg, params.agentId) : void 0, {
			allowKeychainPrompt: false,
			profileId: sessionEntry.authProfileOverride
		});
		logStage("auth-profile-store-loaded", `profiles=${Object.keys(store.profiles).length}`);
		const profile = store.profiles[sessionEntry.authProfileOverride];
		const authConfig = resolveModelProviderAuthConfig({
			config: cfg,
			provider,
			modelId: model
		});
		const harnessPolicy = resolveAgentHarnessPolicy({
			provider,
			modelId: model,
			config: cfg,
			agentId: params.agentId,
			sessionKey
		});
		const acceptedAuthProviders = listOpenAIAuthProfileProvidersForAgentRuntime({
			provider,
			harnessRuntime: harnessPolicy.runtime,
			config: cfg
		}).map(normalizeProviderId);
		const overrideStillEligible = profile != null && acceptedAuthProviders.some((accepted) => isStoredCredentialCompatibleWithAuthProvider({
			cfg: authConfig,
			provider: accepted,
			credential: profile
		}));
		const missingPersonalProfile = !profile && isUserModelAuthProfileId(sessionEntry.authProfileOverride);
		if (!overrideStillEligible && !missingPersonalProfile) await clearSessionAuthProfileOverride({
			agentId: params.agentId,
			sessionEntry,
			sessionStore,
			sessionKey,
			storePath
		});
	}
	const buildThinkingCatalog = (catalog) => createModelVisibilityPolicy({
		cfg,
		catalog,
		defaultProvider,
		defaultModel: {
			provider: defaultProvider,
			model: defaultModel
		},
		agentId: params.agentId,
		...runtimeModelNormalization
	}).catalog;
	const resolveThinkingSelection = (selection) => {
		const selected = findSelectedCatalogEntry({
			...selection,
			catalog: visibilityPolicy.catalog
		});
		return {
			...selection,
			agentRuntime: selection.agentRuntime ?? resolveEffectiveAgentRuntime({
				cfg,
				provider: selection.provider,
				modelId: selection.model,
				modelApi: selected?.api,
				modelBaseUrl: selected?.baseUrl,
				agentId: params.agentId,
				sessionKey,
				sessionEntry
			})
		};
	};
	const thinkingCatalogs = /* @__PURE__ */ new Map();
	const resolveThinkingCatalog = async (selection = {
		provider,
		model
	}) => {
		const { agentRuntime } = resolveThinkingSelection(selection);
		const key = JSON.stringify([
			selection.provider,
			selection.model,
			agentRuntime
		]);
		const cached = thinkingCatalogs.get(key);
		if (cached) return cached.length > 0 ? cached : void 0;
		let catalog = visibilityPolicy.catalog;
		if (needsThinkHydration(catalog, selection.provider, selection.model, agentRuntime)) {
			const { loadProviderScopedThinkingCatalog } = await loadPreparedModelCatalogRuntime();
			const preparedCatalog = await loadProviderScopedThinkingCatalog({
				config: cfg,
				agentId: params.agentId,
				provider: selection.provider,
				model: selection.model,
				agentRuntime
			});
			if (findSelectedCatalogEntry({
				catalog: preparedCatalog,
				...selection
			})) catalog = buildThinkingCatalog(preparedCatalog);
		}
		thinkingCatalogs.set(key, catalog);
		return catalog.length > 0 ? catalog : void 0;
	};
	const defaultThinkingLevels = /* @__PURE__ */ new Map();
	const resolveDefaultThinkingLevel = async (selection = {
		provider,
		model
	}) => {
		const thinkingSelection = resolveThinkingSelection(selection);
		const cacheKey = JSON.stringify([
			selection.provider,
			selection.model,
			thinkingSelection.agentRuntime
		]);
		const cached = defaultThinkingLevels.get(cacheKey);
		if (cached) return cached;
		const thinkingParams = {
			cfg,
			agentId: params.agentId,
			...thinkingSelection
		};
		const resolved = resolveConfiguredThinkingDefaultCore(thinkingParams) ?? resolveThinkingDefaultCore({
			...thinkingParams,
			catalog: await resolveThinkingCatalog(thinkingSelection)
		});
		defaultThinkingLevels.set(cacheKey, resolved);
		return resolved;
	};
	const hasConfiguredThinkingDefault = resolveConfiguredThinkingDefaultCore({
		cfg,
		agentId: params.agentId,
		provider,
		model
	}) !== void 0;
	const resolveDefaultReasoningLevel = async (selection = {
		provider,
		model
	}) => resolveReasoningDefault({
		provider: selection.provider,
		model: selection.model,
		catalog: await resolveThinkingCatalog(selection)
	});
	const selectedCatalogEntry = findSelectedCatalogEntry({
		catalog: visibilityPolicy.catalog,
		provider,
		model
	});
	return {
		provider,
		model,
		requestedRouteResolution: "resolved",
		modelPolicy: visibilityPolicy,
		allowedModelKeys,
		allowedModelCatalog,
		policyAliasIndex: visibilityPolicy.policyAliasIndex,
		resetModelOverride,
		resetModelOverrideRef,
		resetModelOverrideReason,
		modelPolicyConfigPath: visibilityPolicy.allowConfigPath ?? void 0,
		modelPolicyRepairConfigPath: visibilityPolicy.allowRepairConfigPath,
		resolveThinkingCatalog,
		resolveDefaultThinkingLevel,
		hasConfiguredThinkingDefault,
		resolveDefaultReasoningLevel,
		modelContextWindow: selectedCatalogEntry?.contextWindow,
		modelContextTokens: selectedCatalogEntry?.contextTokens
	};
}
//#endregion
export { isStaleHeartbeatAutoFallbackOverride as n, createModelSelectionState as t };
