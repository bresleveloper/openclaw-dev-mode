import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as normalizeModelRef } from "./model-ref-shared-BRJ3VRZV.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-CaSenm_x.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as buildModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { a as resolveAgentDir, r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import { n as hasSessionAutoModelFallbackProvenance, r as hasSessionAutoModelSelection } from "./model-override-provenance-ByJqxWxk.mjs";
import { d as resolveAutoFallbackPrimaryProbe, r as hasLegacyAutoFallbackWithoutOrigin } from "./agent-scope-DXrnO3F4.mjs";
import { y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-Bm7d8DH8.mjs";
import { n as assertOperatorModelAllowed, t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { a as SessionWorkStartInvalidatedError } from "./work-start-error-BI-UhSB2.mjs";
import { r as applyModelOverrideToSessionEntry } from "./model-overrides-CgHG3YVT.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { r as resolveModelAliasFromPair } from "./model-selection-resolve-B4Z5ZIMD.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-pIK04Peo.mjs";
import { i as resolveOperatorModelDefault } from "./operator-model-policy-3pT6BgLA.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import { i as resolveReasoningDefault } from "./model-selection-DdQ-ffuG.mjs";
import { n as resolveConfiguredThinkingDefaultCore, r as resolveThinkingDefaultCore } from "./model-thinking-default-BKqBSSHy.mjs";
import { n as isStoredCredentialCompatibleWithAuthProvider } from "./order-CElLtwMu.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { i as resolveStoredModelOverrideCore, r as resolveStoredModelOverrideAsync } from "./stored-model-overrides-RKQxlZXm.mjs";
import { t as resolveModelProviderAuthConfig } from "./model-auth-provider-route-BGgWpgXk.mjs";
import { r as shouldPreserveUnavailableSessionAuthProfileOverride } from "./auth-profile-preservation-UYIf2L8-.mjs";
import { t as clearSessionAuthProfileOverride } from "./session-override-CZTCnQMa.mjs";
import { a as sessionModelOverrideChangesApplied, n as adoptPersistedSessionSnapshot } from "./session-snapshot-merge-Dh-eJoIb.mjs";
import { o as resolveRuntimeNormalization, r as mergePreparedConfiguredCatalog, t as findSelectedCatalogEntry } from "./model-runtime-normalization-B2xB-s-G.mjs";
import "./model-selection-directive-By2HuKqh.mjs";
//#region src/auto-reply/reply/stored-model-override.ts
/** Detects heartbeat auto-fallback overrides that no longer match the primary model. */
function isStaleHeartbeatAutoFallbackOverride(params) {
	if (params.isHeartbeat !== true || params.hasResolvedHeartbeatModelOverride === true) return false;
	if (params.storedOverride?.source !== "session") return false;
	const entry = params.sessionEntry;
	if (!entry) return false;
	const recoveredAutoFallbackOverride = entry.modelOverrideSource === void 0 && hasSessionAutoModelFallbackProvenance(entry);
	if (entry.modelOverrideSource !== "auto" && !recoveredAutoFallbackOverride) return false;
	const primaryProvider = params.primaryProvider ?? params.defaultProvider;
	const primaryModel = params.primaryModel ?? params.defaultModel;
	const originModel = normalizeOptionalString(entry.modelOverrideFallbackOriginModel);
	if (originModel) return (normalizeOptionalString(entry.modelOverrideFallbackOriginProvider) ?? params.defaultProvider) !== primaryProvider || originModel !== primaryModel;
	const noticeSelectedKey = normalizeOptionalString(entry.fallbackNotice?.selectedModel);
	return noticeSelectedKey ? noticeSelectedKey !== buildModelCatalogRef(primaryProvider, primaryModel) : (params.storedOverride.provider ?? params.defaultProvider) !== primaryProvider || params.storedOverride.model !== primaryModel;
}
/** Keep stored-pin selection and primary probing under the same turn-local precedence. */
async function resolveReplyStoredModelSelection(params) {
	const { sessionEntry, sessionModelSelectionLocked, hasResolvedTurnModelOverride } = params;
	const hasSessionModelOverride = Boolean(normalizeOptionalString(sessionEntry.modelOverride) || normalizeOptionalString(sessionEntry.providerOverride));
	const storedOverride = await resolveStoredModelOverrideAsync(params);
	const staleHeartbeatAutoFallbackOverride = !sessionModelSelectionLocked && isStaleHeartbeatAutoFallbackOverride({
		...params,
		hasResolvedHeartbeatModelOverride: params.isHeartbeat === true && hasResolvedTurnModelOverride,
		storedOverride
	});
	const staleLegacyAutoFallbackWithoutOrigin = !sessionModelSelectionLocked && storedOverride?.source === "session" && hasLegacyAutoFallbackWithoutOrigin(sessionEntry);
	return {
		modelOverride: storedOverride?.model && !hasResolvedTurnModelOverride && !staleHeartbeatAutoFallbackOverride && !staleLegacyAutoFallbackWithoutOrigin ? {
			provider: storedOverride.provider ?? params.defaultProvider,
			model: storedOverride.model
		} : void 0,
		autoFallbackPrimaryProbe: !sessionModelSelectionLocked && !hasResolvedTurnModelOverride && !staleHeartbeatAutoFallbackOverride ? resolveAutoFallbackPrimaryProbe({
			entry: sessionEntry,
			sessionKey: params.sessionKey,
			primaryProvider: params.primaryProvider,
			primaryModel: params.primaryModel
		}) : void 0,
		hasEffectiveStoredModelOverride: Boolean(storedOverride || hasSessionModelOverride) && !staleHeartbeatAutoFallbackOverride && !staleLegacyAutoFallbackWithoutOrigin
	};
}
//#endregion
//#region src/auto-reply/reply/model-selection.ts
const modelCatalogRuntimeLoader = createLazyImportLoader(() => import("./agents/model-catalog.runtime.js"));
const sessionPersistenceRuntimeLoader = createLazyImportLoader(() => import("./session-entry-persistence-CIwqLyTR.mjs"));
/** Resolve a caller-owned model/profile choice without changing session preferences. */
function resolveTurnModelSelection(params) {
	const { options } = params;
	const explicitModel = normalizeOptionalString(options?.modelOverride);
	const raw = explicitModel ?? (options?.isHeartbeat ? normalizeOptionalString(options.heartbeatModelOverride) ?? normalizeOptionalString(params.configuredHeartbeatModel) : void 0);
	if (!raw) return;
	const resolved = resolveModelRefFromString({
		cfg: params.cfg,
		agentId: params.agentId,
		raw,
		defaultProvider: params.defaultProvider,
		aliasIndex: params.aliasIndex
	});
	if (!resolved) {
		if (explicitModel) throw new Error(`Invalid model override "${explicitModel}". Use a valid provider/model or model alias.`);
		return;
	}
	const profileId = splitTrailingAuthProfile(raw).profile;
	return {
		ref: resolved.ref,
		authProfile: profileId ? {
			...resolved.ref,
			profileId
		} : void 0
	};
}
async function createModelSelectionState(params) {
	const operatorAuthority = params.operatorAuthority;
	if (operatorAuthority) {
		assertAdmittedRunOperatorAuthority(operatorAuthority);
		operatorAuthority.assertCurrent();
	}
	const timingEnabled = isDiagnosticFlagEnabled("ingress.timing", params.cfg);
	const startMs = timingEnabled ? Date.now() : 0;
	const logStage = (stage, extra) => {
		if (!timingEnabled) return;
		const suffix = extra ? ` ${extra}` : "";
		console.log(`[model-selection] session=${params.sessionKey ?? "(no-session)"} stage=${stage} elapsedMs=${Date.now() - startMs}${suffix}`);
	};
	const { cfg, agentCfg, sessionEntry, sessionStore, sessionKey, parentSessionKey, storePath, defaultProvider, defaultModel } = params;
	const loadRuntimeCatalogSnapshot = async () => params.preparedModelCatalog ?? await (await modelCatalogRuntimeLoader.load()).loadPreparedModelCatalogSnapshot({
		config: cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		readOnly: true
	});
	const runtimeModelNormalization = resolveRuntimeNormalization(cfg);
	let { provider, model } = params;
	const primaryProvider = params.primaryProvider ?? defaultProvider;
	const primaryModel = params.primaryModel ?? defaultModel;
	const modelSelectionLocked = sessionEntry?.modelSelectionLocked === true;
	const agentEntry = params.agentId ? resolveAgentConfig(cfg, params.agentId) : void 0;
	const createVisibilityPolicy = (catalog) => createModelVisibilityPolicy({
		cfg,
		catalog,
		defaultProvider,
		defaultModel: {
			provider: defaultProvider,
			model: defaultModel
		},
		agentId: params.agentId,
		...runtimeModelNormalization
	});
	let visibilityPolicy = createVisibilityPolicy([]);
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
	let storedOverrideResetForRun = false;
	let resetModelOverrideRef;
	let resetModelOverrideReason;
	const resolveStoredOverride = () => resolveStoredModelOverrideCore({
		sessionEntry,
		sessionStore,
		sessionKey,
		parentSessionKey,
		defaultProvider,
		allowPluginNormalization: runtimeModelNormalization.allowPluginNormalization,
		manifestPlugins: runtimeModelNormalization.manifestPlugins
	});
	const effectiveStoredModelOverride = resolveStoredOverride();
	const directStoredModelOverride = effectiveStoredModelOverride?.source === "session" ? effectiveStoredModelOverride : null;
	const primaryHarnessPolicy = resolveAgentHarnessPolicy({
		provider: primaryProvider,
		modelId: primaryModel,
		config: cfg,
		agentId: params.agentId,
		sessionKey
	});
	const storedOverrideRef = effectiveStoredModelOverride ? {
		provider: effectiveStoredModelOverride.provider ?? defaultProvider,
		model: effectiveStoredModelOverride.model
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
		const staleLegacyOpenAICodexAutoOverride = override?.source === "session" && entry?.modelOverrideSource === "auto" && normalizeProviderId(override.provider ?? "") === "openai" && normalizeProviderId(primaryProvider) === "openai" && primaryHarnessPolicy.runtime === "codex" && normalizeModelRef("openai", override.model, runtimeModelNormalization).model === normalizeModelRef("openai", primaryModel, runtimeModelNormalization).model;
		const staleLegacyAutoFallbackWithoutOrigin = override?.source === "session" && hasLegacyAutoFallbackWithoutOrigin(entry) && (params.provider !== (override.provider ?? defaultProvider) || params.model !== override.model);
		return staleHeartbeatAutoFallbackOverride || staleLegacyOpenAICodexAutoOverride || staleLegacyAutoFallbackWithoutOrigin;
	};
	const staleDirectStoredOverride = isStaleStoredOverride(sessionEntry, directStoredModelOverride);
	if (needsModelCatalog) {
		const catalogSnapshot = await loadRuntimeCatalogSnapshot();
		modelCatalog = catalogSnapshot.entries;
		catalogAuthoritative = catalogSnapshot.authoritative !== false;
		logStage("catalog-loaded", `entries=${modelCatalog.length} authoritative=${catalogAuthoritative}`);
	}
	if (modelCatalog || hasAllowlist || hasConfiguredModels || configuredModelCatalog.length > 0) {
		visibilityPolicy = createVisibilityPolicy(modelCatalog ?? configuredModelCatalog);
		allowedModelCatalog = visibilityPolicy.allowedCatalog;
		allowedModelKeys = visibilityPolicy.allowedKeys;
		logStage(modelCatalog ? "allowlist-built" : "configured-allowlist-built", `allowed=${allowedModelCatalog.length} keys=${allowedModelKeys.size}`);
	}
	if (params.hasResolvedTurnModelOverride && !params.hasResolvedHeartbeatModelOverride) {
		const selection = {
			provider,
			model
		};
		if (!visibilityPolicy.allows(selection)) throw new Error(`Scheduled model "${buildModelCatalogRef(provider, model)}" is not allowed by ${visibilityPolicy.allowRepairConfigPath}. Update the automation model or the agent's model policy.`);
		assertOperatorModelAllowed(operatorAuthority, selection);
	}
	if (sessionEntry && sessionStore && sessionKey && storedOverrideRef && (effectiveStoredModelOverride?.source === "session" || !params.skipStoredModelOverride && !params.hasResolvedHeartbeatModelOverride && !params.hasResolvedTurnModelOverride) && (!params.hasModelDirective || !operatorAuthority?.modelPolicy)) {
		const key = buildModelCatalogRef(storedOverrideRef.provider, storedOverrideRef.model);
		const overrideAllowed = effectiveStoredModelOverride?.source === "session" && hasSessionAutoModelSelection(sessionEntry) || visibilityPolicy.allows(storedOverrideRef);
		const shouldResetOverride = (staleDirectStoredOverride || !overrideAllowed) && !modelSelectionLocked;
		const overrideTemporarilyUnavailable = shouldResetOverride && !staleDirectStoredOverride && !catalogAuthoritative;
		storedOverrideResetForRun = shouldResetOverride;
		if (overrideTemporarilyUnavailable) {
			resetModelOverrideRef = key;
			resetModelOverrideReason = "temporarily-unavailable";
		} else if (shouldResetOverride && effectiveStoredModelOverride?.source === "parent") {
			resetModelOverrideRef = key;
			resetModelOverrideReason = "disallowed";
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
					const { persistReplySessionEntry } = await sessionPersistenceRuntimeLoader.load();
					const persistence = await persistReplySessionEntry({
						storePath,
						sessionKey,
						initialEntry: initialSessionEntry,
						entry: nextSessionEntry,
						commitGuard: operatorAuthority?.assertCurrent
					});
					if (persistence.status === "lifecycle-invalidated" || persistence.status === "commit-rejected") throw new SessionWorkStartInvalidatedError(persistence.error);
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
	if ((storedOverrideResetForRun || staleDirectStoredOverride) && params.provider === storedOverrideRef?.provider && params.model === storedOverrideRef.model) {
		provider = primaryProvider;
		model = primaryModel;
	}
	const storedOverride = resolveStoredOverride();
	const skipStoredOverride = params.skipStoredModelOverride === true || params.hasResolvedHeartbeatModelOverride === true || params.hasResolvedTurnModelOverride === true || resetModelOverride && staleDirectStoredOverride && storedOverride?.source === "session";
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
		if (modelSelectionLocked || usesStoredAutomaticSelection || visibilityPolicy.allows(normalizedStoredOverride)) ({provider, model} = normalizedStoredOverride);
	}
	if (!(params.hasModelDirective || modelSelectionLocked || usesStoredAutomaticSelection)) {
		const allowedInitialSelection = visibilityPolicy.resolveSelection({
			provider,
			model,
			routeResolution: "resolved"
		});
		if (!allowedInitialSelection) {
			const policyPath = visibilityPolicy.allowConfigPath ?? "modelPolicy.allow";
			throw new Error(`Configured default model "${buildModelCatalogRef(provider, model)}" is not allowed by ${policyPath}, and no allowed model is available.`);
		}
		({provider, model} = allowedInitialSelection);
	}
	let operatorModelOverride = false;
	if (!params.hasModelDirective) {
		const selection = modelSelectionLocked ? {
			provider,
			model
		} : resolveOperatorModelDefault({
			cfg,
			agentId: params.agentId,
			manifestPlugins: runtimeModelNormalization.manifestPlugins,
			policy: operatorAuthority?.modelPolicy,
			model: {
				provider,
				model
			},
			allows: visibilityPolicy.allows
		});
		assertOperatorModelAllowed(operatorAuthority, selection);
		if (!selection) throw new Error("No model is available for this operator role and agent.");
		operatorModelOverride = selection.provider !== provider || selection.model !== model;
		({provider, model} = selection);
	}
	if (!params.skipStoredModelOverride && !params.hasResolvedTurnModelOverride && !operatorModelOverride && sessionEntry && sessionStore && sessionKey && sessionEntry.authProfileOverride) {
		const { ensureAuthProfileStoreAsync, prepareAuthProfileProvider } = await import("./agents/auth-profiles.runtime.js");
		const selection = { ...sessionEntry };
		const authProfileId = sessionEntry.authProfileOverride;
		const store = await ensureAuthProfileStoreAsync(params.agentId ? resolveAgentDir(cfg, params.agentId) : void 0, {
			allowKeychainPrompt: false,
			profileId: authProfileId
		});
		logStage("auth-profile-store-loaded", `profiles=${Object.keys(store.profiles).length}`);
		const profile = store.profiles[authProfileId];
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
		const assertSelectionCurrent = () => {
			operatorAuthority?.assertCurrent();
			if (sessionStore[sessionKey] !== sessionEntry || sessionEntry.sessionId !== selection.sessionId || sessionEntry.authProfileOverride !== selection.authProfileOverride || sessionEntry.authProfileOverrideSource !== selection.authProfileOverrideSource || sessionEntry.authProfileOverrideCompactionCount !== selection.authProfileOverrideCompactionCount || sessionEntry.providerOverride !== selection.providerOverride || sessionEntry.modelOverride !== selection.modelOverride) throw new SessionWorkStartInvalidatedError("Session account selection changed while preparing authentication. Retry.");
		};
		const missingPersonalProfile = !profile && isUserModelAuthProfileId(sessionEntry.authProfileOverride);
		const recordedProvider = !profile && !missingPersonalProfile && resolveCollapsedSessionAuthPinSource(sessionEntry) === "user" ? await prepareAuthProfileProvider({
			agentDir: resolveAgentDir(cfg, params.agentId),
			profileId: sessionEntry.authProfileOverride
		}) : void 0;
		assertSelectionCurrent();
		const preserveUnavailableSelection = missingPersonalProfile || shouldPreserveUnavailableSessionAuthProfileOverride({
			store,
			cfg: authConfig,
			agentDir: resolveAgentDir(cfg, params.agentId),
			entry: sessionEntry,
			currentProvider: sessionEntry.providerOverride ?? defaultProvider,
			provider,
			recordedProvider
		});
		if (!overrideStillEligible && !preserveUnavailableSelection) await clearSessionAuthProfileOverride({
			agentId: params.agentId,
			sessionEntry,
			sessionStore,
			sessionKey,
			storePath,
			assertCommitAllowed: assertSelectionCurrent,
			expectedSnapshot: selection
		});
	}
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
		let catalog = thinkingCatalogs.get(key);
		if (!catalog) {
			catalog = visibilityPolicy.catalog;
			const { loadProviderScopedThinkingCatalog } = await modelCatalogRuntimeLoader.load();
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
			})) catalog = createVisibilityPolicy(preparedCatalog).catalog;
			thinkingCatalogs.set(key, catalog);
		}
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
		...operatorAuthority ? { operatorAuthority } : {},
		...operatorModelOverride ? { operatorModelOverride } : {},
		allowedModelKeys,
		allowedModelCatalog,
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
export { resolveTurnModelSelection as n, resolveReplyStoredModelSelection as r, createModelSelectionState as t };
