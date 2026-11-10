import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as hasMatchingOAuthIdentity, t as areOAuthCredentialsEquivalent } from "./oauth-shared-CiaJlx_D.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as loadPersistedSharedAuthProfileStore, n as loadPersistedAuthProfileStore } from "./persisted-DbIYEoQ3.mjs";
import { y as parseLegacyCredentialEntry } from "./legacy-source-diagnostic-CLlkIevG.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-DXrnO3F4.mjs";
import { c as readDeferredPluginMigrations } from "./deferred-plugin-migrations-CSwavNpj.mjs";
import { _ as toOpenAIModelId, a as isOpenAICodexAuthProfileRef, g as toCanonicalOpenAIModelRef, h as resolveRuntimeModelRef, i as isBlockedLegacyCodexModelRef, o as isOpenAICodexModelRef, r as isBlockedLegacyCodexModelPair, s as isProviderlessModelRef } from "./codex-route-model-ref-2IYegA3O.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { t as isLegacyCodexProviderId } from "./legacy-codex-provider-D4kqIThM.mjs";
import { r as getCliSessionBinding } from "./cli-session-binding-Dx1VbkI8.mjs";
import { a as isModelSelectionLocked, r as applyModelOverrideToSessionEntry } from "./model-overrides-CgHG3YVT.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync, s as resolveConfiguredAgentDatabaseTargets } from "./targets-DJGC6v85.mjs";
import { _ as scanDoctorSessionEntriesTolerant, g as scanDoctorSessionEntriesStrict } from "./session-accessor-Czw4l8kI.mjs";
import { c as isValidAgentHarnessSessionStoreEntry } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { x as applySessionEntryExactReplacements } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { t as loadJsonFileThroughSymlink } from "./json-file-5C1aYJVp.mjs";
import { n as createRetainedAgentDatabaseMatcher } from "./agent-deletion-discovery-WZhAVK2X.mjs";
import { i as rewriteRenamedSessionRoutes } from "./provider-rename-CzX16E87.mjs";
import { i as resolveLegacyAuthProfilesPath } from "./doctor-auth-legacy-paths-BW9Ya4su.mjs";
import { i as updateLegacySessionStore, t as loadLegacySessionStore } from "./state-migrations.legacy-session-store-Dl_TES-P.mjs";
import { a as preserveDeferredPluginSessionSource } from "./deferred-plugin-session-sources-Bck_1DwX.mjs";
import { t as iterateDoctorSessionKeyBatches } from "./session-entry-rewrite-BDkjlbP2.mjs";
import { n as resolveLegacyRuntimeModelProviderAlias, t as migrateLegacyRuntimeModelRef } from "./legacy-runtime-model-providers-Dh0YuH6R.mjs";
import { t as createRetiredModelRefRepairResolver } from "./retired-model-ref-repair-7Iad1CLB.mjs";
import fs from "node:fs";
//#region src/commands/doctor/shared/legacy-cli-session-binding.ts
function migrateLegacyClaudeSessionField(entry, sessionKey, warnings) {
	if (entry.claudeCliSessionId === void 0) return false;
	if (!getCliSessionBinding(entry, "claude-cli")) {
		const sessionId = normalizeOptionalString(entry.claudeCliSessionId);
		const hasUnboundMetadata = Object.entries(entry.cliSessionBindings?.["claude-cli"] ?? {}).some(([key, value]) => key !== "sessionId" && value !== void 0);
		if (!sessionId || hasUnboundMetadata) {
			const warning = `Session ${sessionKey}: legacy Claude CLI binding needs manual reconciliation; legacy binding state was preserved.`;
			if (warnings && !warnings.includes(warning)) warnings.push(warning);
			return false;
		}
		entry.cliSessionBindings = {
			...entry.cliSessionBindings,
			"claude-cli": { sessionId }
		};
	}
	delete entry.claudeCliSessionId;
	return true;
}
//#endregion
//#region src/commands/doctor/shared/retired-session-model-repair.ts
/** Session selection owns invalidation of context/fallback metadata and profile preservation. */
function repairRetiredSessionModelRef(entry, agentId, resolve, defaultModelRef, warnings) {
	if (!entry.modelOverride || isModelSelectionLocked(entry)) return false;
	const decision = resolve({
		modelRef: entry.providerOverride ? `${entry.providerOverride}/${entry.modelOverride}` : entry.modelOverride,
		agentId,
		authProfileId: entry.authProfileOverride,
		authProfileSource: entry.authProfileOverrideSource
	});
	if (decision.kind === "unchanged") return false;
	const replacement = splitTrailingAuthProfile(decision.kind === "replace" ? decision.modelRef : defaultModelRef ?? "").model;
	if (decision.kind === "clear" && replacement === decision.modelRef && entry.authProfileOverride && (entry.authProfileOverrideSource === "user" || entry.authProfileOverrideSource === "user-link")) {
		const warning = `Retained retired ${decision.modelRef} for agent "${agentId}": clearing this session override would still select it with the same pinned account. Choose a supported default or an allowed model override, then rerun openclaw doctor --fix.`;
		if (!warnings.includes(warning)) warnings.push(warning);
		return false;
	}
	const slash = replacement.indexOf("/");
	return applyModelOverrideToSessionEntry({
		entry,
		selection: {
			provider: replacement.slice(0, slash),
			model: replacement.slice(slash + 1),
			isDefault: decision.kind === "clear"
		},
		preserveAuthProfileOverride: decision.kind === "replace" || replacement.slice(0, slash) === decision.provider,
		selectionSource: entry.modelOverrideSource === "auto" ? "auto" : "user"
	}).updated;
}
//#endregion
//#region src/commands/doctor/shared/codex-route-session-repair.ts
function rewriteSessionModelPair(params) {
	const provider = normalizeOptionalLowercaseString(params.entry[params.providerKey]);
	const model = typeof params.entry[params.modelKey] === "string" ? params.entry[params.modelKey] : void 0;
	const legacyProviderModelRef = sessionProviderAllowsScopedModelRef(provider) && isOpenAICodexModelRef(model) ? model : void 0;
	if (isBlockedLegacyCodexModelPair({
		providerId: provider,
		modelId: model,
		blockedModelIdentities: params.blockedModelIdentities
	}) || (legacyProviderModelRef ? isBlockedLegacyCodexModelRef({
		modelRef: legacyProviderModelRef,
		blockedModelIdentities: params.blockedModelIdentities
	}) : false)) return { changed: false };
	if (isLegacyCodexProviderId(provider)) {
		params.entry[params.providerKey] = "openai";
		if (model) {
			const modelId = toOpenAIModelId(model);
			if (modelId) params.entry[params.modelKey] = modelId;
		}
		return {
			changed: true,
			runtime: "codex"
		};
	}
	const canonicalModel = legacyProviderModelRef && toCanonicalOpenAIModelRef(legacyProviderModelRef);
	if (canonicalModel) {
		params.entry[params.modelKey] = canonicalModel;
		return {
			changed: true,
			runtime: "codex"
		};
	}
	const scopedRuntimeRef = model && (!provider || ["claude-cli", "google-gemini-cli"].includes(provider)) ? migrateLegacyRuntimeModelRef(model) : null;
	const rawRef = scopedRuntimeRef ? model : provider && model ? `${provider}/${model}` : model;
	const migrated = scopedRuntimeRef ?? (rawRef ? migrateLegacyRuntimeModelRef(rawRef) : null);
	if (!migrated || rawRef && isBlockedLegacyCodexModelRef({
		modelRef: rawRef,
		blockedModelIdentities: params.blockedModelIdentities
	})) return { changed: false };
	let changed = false;
	if (params.entry[params.providerKey] !== migrated.provider) {
		params.entry[params.providerKey] = migrated.provider;
		changed = true;
	}
	if (params.entry[params.modelKey] !== migrated.model) {
		params.entry[params.modelKey] = migrated.model;
		changed = true;
	}
	return {
		changed,
		runtime: migrated.runtime
	};
}
function isCodexSessionRoute(entry) {
	return isLegacyCodexProviderId(entry.modelProvider) || isLegacyCodexProviderId(entry.providerOverride) || sessionProviderAllowsScopedModelRef(normalizeOptionalLowercaseString(entry.modelProvider)) && isOpenAICodexModelRef(entry.model) || sessionProviderAllowsScopedModelRef(normalizeOptionalLowercaseString(entry.providerOverride)) && isOpenAICodexModelRef(entry.modelOverride) || normalizeOptionalAgentRuntimeId(entry.agentRuntimeOverride) === "codex";
}
function normalizeCodexSessionHarness(entry, legacyCodexHarness, wasCodexRoute) {
	if (!legacyCodexHarness && !wasCodexRoute && !isCodexSessionRoute(entry)) return false;
	let changed = false;
	for (const key of ["agentHarnessId", "agentRuntimeOverride"]) if (normalizeOptionalAgentRuntimeId(entry[key]) === "codex-cli" || key === "agentHarnessId" && legacyCodexHarness && entry[key] === void 0) {
		entry[key] = "codex";
		changed = true;
	}
	return changed;
}
function sessionProviderAllowsScopedModelRef(provider) {
	return !provider || isLegacyCodexProviderId(provider);
}
function clearStaleCodexFallbackNotice(entry, blockedModelIdentities) {
	const endpoints = [entry.fallbackNotice?.selectedModel, entry.fallbackNotice?.activeModel];
	if (endpoints.some((modelRef) => isOpenAICodexModelRef(modelRef) && isBlockedLegacyCodexModelRef({
		modelRef,
		blockedModelIdentities
	})) || !endpoints.some(isOpenAICodexModelRef)) return false;
	delete entry.fallbackNotice;
	return true;
}
function clearRepairedCodexSessionHarness(entry) {
	const harnessId = entry.agentHarnessId;
	if (harnessId === void 0 || normalizeOptionalAgentRuntimeId(harnessId) === "openclaw") return false;
	delete entry.agentHarnessId;
	return true;
}
function repairProviderlessCodexSessionOverride(entry, blockedModelIdentities) {
	if (!isProviderlessModelRef(entry.modelOverride) || !isOpenAICodexAuthProfileRef(entry.authProfileOverride) || entry.authProfileOverrideSource !== "auto" || entry.modelOverrideSource !== "auto" || normalizeOptionalLowercaseString(entry.providerOverride)) return false;
	const authProvider = normalizeOptionalLowercaseString(entry.authProfileOverride)?.split(":", 1)[0];
	if (isBlockedLegacyCodexModelPair({
		providerId: authProvider,
		modelId: entry.modelOverride,
		blockedModelIdentities
	})) return false;
	entry.providerOverride = "openai";
	entry.modelOverrideRouteResolution = "resolved";
	if (entry.model !== void 0 || entry.modelProvider !== void 0) {
		delete entry.model;
		delete entry.modelProvider;
	}
	if (entry.contextTokens !== void 0 || entry.contextTokensSource !== void 0) {
		delete entry.contextTokens;
		delete entry.contextTokensSource;
	}
	if (entry.contextBudgetStatus !== void 0) delete entry.contextBudgetStatus;
	return true;
}
function repairSessionAuthProfileReferences(entry, profileIdMap) {
	let changed = false;
	const repair = (record, key) => {
		const value = record?.[key];
		const replacement = typeof value === "string" ? profileIdMap?.get(value.trim()) : void 0;
		if (record && replacement !== void 0 && replacement !== value) {
			record[key] = replacement;
			changed = true;
		}
	};
	repair(entry, "authProfileOverride");
	repair(entry.modelFallback, "prevAuthProfileOverride");
	return changed;
}
/** Complete account renames or repair legacy session bindings and model routes. */
function repairCodexSessionStoreRoutes(params) {
	const now = params.now ?? Date.now();
	const sessionKeys = [];
	for (const [sessionKey, entry] of Object.entries(params.store)) {
		if (!entry) continue;
		if (params.authProfileOnly) {
			if (!isValidAgentHarnessSessionStoreEntry(sessionKey, entry) && repairSessionAuthProfileReferences(entry, params.authProfileIdMap)) {
				entry.updatedAt = now;
				sessionKeys.push(sessionKey);
			}
			continue;
		}
		const changedCliBinding = params.providerRenameOnly ? false : migrateLegacyClaudeSessionField(entry, sessionKey, params.warnings);
		if (isValidAgentHarnessSessionStoreEntry(sessionKey, entry)) {
			if (changedCliBinding) sessionKeys.push(sessionKey);
			continue;
		}
		const legacyCodexHarness = normalizeOptionalAgentRuntimeId(entry.agentHarnessId) === "codex-cli";
		const wasCodexRoute = isCodexSessionRoute(entry);
		const hasSelectedOverride = Boolean(entry.modelOverride?.trim());
		const runtimeWasExplicit = entry.agentRuntimeOverride !== void 0 && normalizeOptionalAgentRuntimeId(entry.agentRuntimeOverride) !== "auto";
		const changedProviderRoute = params.providerRenames?.length ? rewriteRenamedSessionRoutes({
			entry,
			renames: params.providerRenames
		}) : false;
		if (params.providerRenameOnly) {
			if (changedProviderRoute) {
				entry.updatedAt = now;
				sessionKeys.push(sessionKey);
			}
			continue;
		}
		const runtimeModelRoute = rewriteSessionModelPair({
			entry,
			providerKey: "modelProvider",
			modelKey: "model",
			blockedModelIdentities: params.blockedModelIdentities
		});
		const overrideModelRoute = rewriteSessionModelPair({
			entry,
			providerKey: "providerOverride",
			modelKey: "modelOverride",
			blockedModelIdentities: params.blockedModelIdentities
		});
		if (overrideModelRoute.changed) entry.modelOverrideRouteResolution = "resolved";
		const changedProviderlessOverride = repairProviderlessCodexSessionOverride(entry, params.blockedModelIdentities);
		const changedModelRoute = runtimeModelRoute.changed || overrideModelRoute.changed || changedProviderlessOverride;
		const changedFallbackNotice = clearStaleCodexFallbackNotice(entry, params.blockedModelIdentities);
		const selectedRuntime = changedProviderlessOverride ? "codex" : hasSelectedOverride ? overrideModelRoute.runtime : runtimeModelRoute.runtime;
		const changedRuntimePins = !runtimeWasExplicit && selectedRuntime !== void 0 && entry.agentRuntimeOverride !== selectedRuntime;
		if (changedRuntimePins) entry.agentRuntimeOverride = selectedRuntime;
		const changedCodexRuntimeHarness = selectedRuntime === "codex" ? clearRepairedCodexSessionHarness(entry) : false;
		const changedCodexHarness = normalizeCodexSessionHarness(entry, legacyCodexHarness, wasCodexRoute);
		const changedAuthProfile = repairSessionAuthProfileReferences(entry, params.authProfileIdMap);
		const changedRetiredModel = params.retirement ? repairRetiredSessionModelRef(entry, params.retirement.agentId, params.retirement.resolve, params.retirement.defaultModelRef, params.retirement.warnings) : false;
		if (!changedProviderRoute && !changedModelRoute && !changedFallbackNotice && !changedRuntimePins && !changedCodexRuntimeHarness && !changedCodexHarness && !changedAuthProfile && !changedRetiredModel && !changedCliBinding) continue;
		entry.updatedAt = now;
		sessionKeys.push(sessionKey);
	}
	return sessionKeys;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.codexRouteSessionRepairTestApi")] = { repairCodexSessionStoreRoutes };
function resolveVerifiedSessionAuthProfileIdMap(params) {
	if (!params.authProfileIdMap || params.authProfileIdMap.size === 0) return params.authProfileIdMap;
	const agentDir = resolveAgentDir(params.cfg, params.agentId, params.env);
	const localProfiles = loadPersistedAuthProfileStore(agentDir)?.profiles ?? {};
	const mainProfiles = loadPersistedSharedAuthProfileStore(params.env)?.profiles ?? {};
	const localLegacyAuthPath = resolveLegacyAuthProfilesPath(agentDir);
	const localLegacySourceExists = fs.existsSync(localLegacyAuthPath);
	const localLegacySource = localLegacySourceExists ? loadJsonFileThroughSymlink(localLegacyAuthPath) : null;
	const localLegacyProfiles = isRecord(localLegacySource) && isRecord(localLegacySource.profiles) ? localLegacySource.profiles : void 0;
	return new Map([...params.authProfileIdMap].filter(([legacyProfileId, canonicalProfileId]) => {
		const separator = legacyProfileId.indexOf(":");
		if (separator < 0) return false;
		const legacyProvider = legacyProfileId.slice(0, separator);
		const provider = isLegacyCodexProviderId(legacyProvider) || legacyProfileId === "openai:codex-cli" ? "openai" : resolveLegacyRuntimeModelProviderAlias(legacyProvider)?.provider;
		if (!provider) return false;
		const localCredential = localProfiles[canonicalProfileId];
		if (localCredential) return normalizeOptionalLowercaseString(localCredential.provider) === provider;
		const inheritedCredential = mainProfiles[canonicalProfileId];
		if (localLegacySourceExists) {
			if (!localLegacyProfiles) return false;
			const legacyCredential = localLegacyProfiles[legacyProfileId];
			if (legacyCredential !== void 0) {
				if (!isRecord(legacyCredential)) return false;
				const canonicalLegacyCredential = parseLegacyCredentialEntry({
					...legacyCredential,
					provider
				}, provider);
				return canonicalLegacyCredential?.type === "oauth" && inheritedCredential?.type === "oauth" && inheritedCredential.provider === provider && (hasMatchingOAuthIdentity(canonicalLegacyCredential, inheritedCredential) || areOAuthCredentialsEquivalent(canonicalLegacyCredential, inheritedCredential));
			}
		}
		return normalizeOptionalLowercaseString(inheritedCredential?.provider) === provider;
	}));
}
/** Scan or repair all configured agent session stores that still contain legacy Codex routes. */
async function maybeRepairCodexSessionRoutes(params) {
	const env = params.env ?? process.env;
	const authProfileOnly = !params.providerRenameOnly && !params.shouldRepair && params.authProfileOnly === true;
	const shouldRepair = params.shouldRepair || authProfileOnly;
	const warnings = [];
	const pending = readDeferredPluginMigrations({ env });
	const isRetained = createRetainedAgentDatabaseMatcher(env, () => resolveConfiguredAgentDatabaseTargets(params.cfg, { env }));
	const sessionTargets = resolveAllAgentSessionStoreTargetsSync(params.cfg, { env }).filter((target) => !isRetained(target.storePath, target.agentId));
	const providerRenames = params.providerRenames;
	const resolveRetired = authProfileOnly || params.providerRenameOnly ? void 0 : createRetiredModelRefRepairResolver({
		cfg: params.cfg,
		checkModelPolicy: true,
		retiredModelRefConfig: params.retiredModelRefConfig,
		env,
		warnings,
		agentIds: [...new Set(sessionTargets.map((target) => target.agentId))]
	});
	const targets = sessionTargets.flatMap((target) => {
		const defaultModelRef = resolveRetired ? resolveAgentEffectiveModelPrimary(params.cfg, target.agentId) : void 0;
		const retirement = resolveRetired ? {
			agentId: target.agentId,
			resolve: resolveRetired,
			warnings,
			defaultModelRef: defaultModelRef ? resolveRuntimeModelRef({
				cfg: params.cfg,
				modelRef: defaultModelRef,
				agentId: target.agentId
			}) : void 0
		} : void 0;
		const sessionScope = {
			storePath: target.storePath,
			agentId: target.agentId,
			env
		};
		const authProfileIdMap = params.providerRenameOnly ? void 0 : resolveVerifiedSessionAuthProfileIdMap({
			agentId: target.agentId,
			cfg: params.cfg,
			env,
			authProfileIdMap: params.authProfileIdMap
		});
		if (authProfileOnly && !authProfileIdMap?.size) return [];
		const repair = (store) => repairCodexSessionStoreRoutes({
			store,
			blockedModelIdentities: params.blockedModelIdentities,
			authProfileIdMap,
			authProfileOnly,
			providerRenameOnly: params.providerRenameOnly,
			retirement,
			providerRenames,
			warnings
		});
		const scan = (store) => repair(structuredClone(store));
		const staleSqliteSessionKeys = [];
		const scanEntry = ({ entry, sessionKey }) => {
			if (scan({ [sessionKey]: entry }).length > 0) staleSqliteSessionKeys.push(sessionKey);
		};
		const sqliteEntryCount = shouldRepair ? scanDoctorSessionEntriesStrict(sessionScope, scanEntry) : scanDoctorSessionEntriesTolerant(sessionScope, scanEntry);
		const hasLegacyStore = !target.storePath.endsWith(".sqlite") && fs.existsSync(target.storePath) && !preserveDeferredPluginSessionSource({
			cfg: params.cfg,
			env,
			target,
			pending
		});
		return sqliteEntryCount > 0 || hasLegacyStore ? [{
			...target,
			staleSqliteSessionKeys,
			hasLegacyStore,
			scan,
			repair
		}] : [];
	});
	if (!shouldRepair) {
		const stale = targets.flatMap((target) => {
			const sessionKeys = new Set(target.staleSqliteSessionKeys);
			if (target.hasLegacyStore) for (const sessionKey of target.scan(loadLegacySessionStore(target.storePath))) sessionKeys.add(sessionKey);
			return Array.from(sessionKeys, (sessionKey) => `${target.agentId}:${sessionKey}`);
		});
		return {
			scannedStores: targets.length,
			repairedStores: 0,
			repairedSessions: 0,
			warnings: [...warnings, ...stale.length > 0 ? [[
				"- Legacy session bindings or retired session model route state detected.",
				`- Affected sessions: ${stale.length}.`,
				"- Run `openclaw doctor --fix` to migrate legacy bindings and stale session model/provider pins across all agent session stores."
			].join("\n")] : []],
			changes: []
		};
	}
	let repairedStores = 0;
	let repairedSessions = 0;
	for (const target of targets) {
		const repairedSessionKeys = /* @__PURE__ */ new Set();
		const { staleSqliteSessionKeys } = target;
		for (const sessionKeys of iterateDoctorSessionKeyBatches(staleSqliteSessionKeys)) (await applySessionEntryExactReplacements({
			agentId: target.agentId,
			storePath: target.storePath,
			sessionKeys,
			skipMaintenance: true,
			update: (entries) => {
				const store = Object.fromEntries(entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
				const repairedKeys = target.repair(store);
				return {
					result: repairedKeys,
					replacements: repairedKeys.map((sessionKey) => ({
						sessionKey,
						entry: store[sessionKey]
					}))
				};
			}
		})).forEach((sessionKey) => repairedSessionKeys.add(sessionKey));
		if (target.hasLegacyStore) {
			if (target.scan(loadLegacySessionStore(target.storePath)).length > 0) (await updateLegacySessionStore(target.storePath, target.repair, { skipMaintenance: true })).forEach((sessionKey) => repairedSessionKeys.add(sessionKey));
		}
		if (repairedSessionKeys.size > 0) {
			repairedStores += 1;
			repairedSessions += repairedSessionKeys.size;
		}
	}
	const repairedScope = `${repairedSessions} session${repairedSessions === 1 ? "" : "s"} across ${repairedStores} store${repairedStores === 1 ? "" : "s"}`;
	return {
		scannedStores: targets.length,
		repairedStores,
		repairedSessions,
		warnings,
		changes: repairedSessions > 0 ? [authProfileOnly ? `Updated auth-profile references in ${repairedScope}.` : `Repaired legacy bindings or retired model routes in ${repairedScope} while preserving auth-profile pins.`] : []
	};
}
//#endregion
export { maybeRepairCodexSessionRoutes as t };
