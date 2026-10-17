import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as resolveAgentDir, v as resolveMutableAgentEntry } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { l as toAgentModelListLike, o as resolveAgentModelFallbackValues } from "./model-input-C9K4a_6k.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { u as resolveAgentModelFallbacksOverride } from "./agent-scope-CG17uXFn.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-15nvbxqy.mjs";
import { C as attachRuntimeConfigWriteApplication, T as createRuntimeConfigWriteApplication } from "./io.runtime-BSum32pK.mjs";
import { c as resolveSharedAuthStorePath } from "./path-resolve-CIRhdX6A.mjs";
import { c as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-BmvvQ59E.mjs";
import { g as resolveAuthProfileDatabasePath } from "./sqlite-CW8wNN4G.mjs";
import { i as findPersistedAuthProfileCredential, u as resolvePersistedAuthProfileOwnerAgentDir } from "./store-SwwRUDrm.mjs";
import { g as listCandidateAuthProfileStores, i as removeAuthProfilesAcrossOwnerStores } from "./profiles-Dk53jI-3.mjs";
import { i as captureGatewayRootWorkAdmissionContinuationScope } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { f as listProfilesForProvider } from "./order-B7W96aON.mjs";
import { _ as resolveProviderConfigSecretInput, y as resolveProviderEntryApiKeyProfileReference } from "./model-auth-provider-config-s9IgFbYq.mjs";
import { i as ensureAuthProfileStoreWithoutExternalProfiles, l as loadAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-Qx0DZ2Si.mjs";
import "./auth-profiles-BIPn3mmc.mjs";
import { d as withSessionHistoryWorkerReadCandidates, s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { c as patchSessionEntryTarget } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { r as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { i as clearRemovedQueuedAuthProfiles } from "./state-Dcv8BBPd.mjs";
import "./queue-DJQGr33w.mjs";
import { i as removeAuthProfileConfig, r as configReferencesAuthProfile } from "./provider-auth-helpers-CDvD9QW2.mjs";
import { t as createClackPrompter } from "./clack-prompter-D76Rt341.mjs";
import { r as logConfigUpdated } from "./logging-BBc-wU1i.mjs";
import { l as resolveModelsTargetAgent, u as updateConfig } from "./shared-CP4E7wPe.mjs";
import { t as loadModelsConfig } from "./load-config-D0EM9qHZ.mjs";
import { n as refreshRunningGatewayAuthState } from "./auth-refresh-CqPLnyJc.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/sessions/auth-profile-removal.ts
/** Release only references to credentials whose owning store confirmed removal. */
async function clearRemovedSessionAuthProfiles(params) {
	clearRemovedQueuedAuthProfiles(params);
	if (params.removedByAgent.size === 0) return;
	const { candidates, ...inventory } = prepareSessionStoreTargetInventory(params.cfg, [...params.removedByAgent.keys()]);
	const registry = prepareOpenClawAgentDatabaseRegistrySnapshotRead({ env: inventory.env });
	await withSessionHistoryWorkerReadCandidates(candidates, async (discovery) => {
		let sources = await discovery.readTargetInventory({
			...inventory,
			registeredDatabases: { status: "deferred" }
		});
		if (sources.kind === "session-target-registry-required") {
			const current = await registry.read();
			sources = await discovery.readTargetInventory({
				...inventory,
				registeredDatabases: current.result.status === "available" ? current.result.entries : { status: "unavailable" }
			});
		}
		if (sources.kind !== "session-target-inventory") throw new Error("Session stores could not be resolved after removing the account.");
		for (const { agentId, result, reads } of sources.agents) {
			if (!result.available) {
				if (result.reason === "database-missing") continue;
				throw new Error(`Sessions for agent ${agentId} could not be read after removing the account.`);
			}
			const removed = expectDefined(params.removedByAgent.get(agentId), "removed agent profiles");
			const agentDir = resolveAgentDir(params.cfg, agentId);
			const isRemoved = (profileId) => profileId !== void 0 && removed.has(profileId);
			for (const { database } of reads) await withSessionHistoryWorkerDatabase({
				...database,
				env: inventory.env
			}, async (owner) => {
				const assertCurrent = () => {
					discovery.assertCurrent();
					registry.assertCurrent();
					owner.assertCurrent();
				};
				const sessionKeys = (await owner.readEntries({
					agentId: database.agentId,
					storePath: database.path,
					env: inventory.env,
					projection: "list",
					readConsistency: "latest"
				})).filter(({ sessionKey, entry }) => normalizeAgentId(parseAgentSessionKey(sessionKey)?.agentId ?? database.agentId) === agentId && (isRemoved(entry.authProfileOverride) || isRemoved(entry.modelFallback?.prevAuthProfileOverride))).map(({ sessionKey }) => sessionKey);
				if (sessionKeys.length === 0) return;
				const selected = await owner.readExactEntries({
					env: inventory.env,
					sessionKeys,
					includeAuthorization: true
				});
				assertCurrent();
				if (selected.entries.length === 0) return;
				const identity = expectDefined(selected.databaseIdentity, "session database identity");
				for (const { sessionKey, entry } of selected.entries) {
					const profileIds = new Set([entry.authProfileOverride, entry.modelFallback?.prevAuthProfileOverride].filter(isRemoved));
					for (const profileId of profileIds) await patchSessionEntryTarget({
						agentId,
						storePath: database.path,
						env: inventory.env,
						readSource: {
							...database,
							databaseIdentity: identity.identity,
							databaseBirthtime: identity.birthtime
						},
						target: {
							canonicalKey: sessionKey,
							storeKeys: [sessionKey]
						}
					}, (current) => {
						const clearCurrent = current.authProfileOverride === profileId;
						const fallback = current.modelFallback;
						const clearPrevious = fallback?.prevAuthProfileOverride === profileId;
						if (!clearCurrent && !clearPrevious) return null;
						return {
							...clearCurrent ? {
								authProfileOverride: void 0,
								authProfileOverrideSource: void 0,
								authProfileOverrideCompactionCount: void 0
							} : {},
							...clearPrevious ? { modelFallback: {
								...fallback,
								prevAuthProfileOverride: void 0,
								prevAuthProfileOverrideSource: void 0,
								prevAuthProfileOverrideCompactionCount: void 0
							} } : {}
						};
					}, {
						preserveActivity: true,
						skipMaintenance: true,
						shouldCommit: () => !findPersistedAuthProfileCredential({
							agentDir,
							profileId
						}),
						assertCommitAllowed: assertCurrent
					});
				}
			});
		}
	});
}
//#endregion
//#region src/commands/models/auth-logout-selections.ts
/** Capture logical consumers while the selected credential still has its physical owner. */
async function resolveModelAuthProfileRemoval(cfg, scopes) {
	const owners = /* @__PURE__ */ new Map();
	for (const scope of scopes) {
		const ids = owners.get(scope.databasePath) ?? /* @__PURE__ */ new Set();
		for (const id of scope.profileIds) ids.add(id);
		owners.set(scope.databasePath, ids);
	}
	const sharedPath = resolvePathViaExistingAncestorSync(resolveSharedAuthStorePath());
	const shared = owners.get(sharedPath) ?? /* @__PURE__ */ new Set();
	const agents = /* @__PURE__ */ new Map();
	if (owners.size === 0) return {
		shared,
		agents
	};
	const agentDirs = new Map(listAgentIds(cfg).map((id) => [id, resolveAgentDir(cfg, id)]));
	for (const candidate of await listCandidateAuthProfileStores({ cfg })) if (!agentDirs.has(candidate.agentId)) agentDirs.set(candidate.agentId, candidate.agentDir);
	const profileIds = new Set(scopes.flatMap((scope) => [...scope.profileIds]));
	for (const [agentId, agentDir] of agentDirs) {
		const removed = /* @__PURE__ */ new Set();
		for (const profileId of profileIds) {
			if (!findPersistedAuthProfileCredential({
				agentDir,
				profileId
			})) continue;
			const owner = resolvePersistedAuthProfileOwnerAgentDir({
				agentDir,
				profileId
			});
			const databasePath = owner ? resolvePathViaExistingAncestorSync(resolveAuthProfileDatabasePath(owner)) : sharedPath;
			if (owners.get(databasePath)?.has(profileId)) removed.add(profileId);
		}
		if (removed.size > 0) agents.set(agentId, removed);
	}
	return {
		shared,
		agents
	};
}
function excludeSurvivingModelAuthProfiles(planned, surviving) {
	return {
		shared: new Set([...planned.shared].filter((id) => !surviving.shared.has(id))),
		agents: new Map([...planned.agents].map(([agentId, ids]) => [agentId, new Set([...ids].filter((id) => !surviving.agents.get(agentId)?.has(id)))]).filter(([, ids]) => ids.size > 0))
	};
}
/** Revalidate after removal awaits, before synchronous queued-work cleanup. */
function excludeReconnectedModelAuthProfiles(cfg, planned) {
	const surviving = (ids, agentDir) => new Set([...ids].filter((profileId) => findPersistedAuthProfileCredential({
		agentDir,
		profileId
	})));
	return excludeSurvivingModelAuthProfiles(planned, {
		shared: surviving(planned.shared),
		agents: new Map([...planned.agents].map(([id, ids]) => [id, surviving(ids, resolveAgentDir(cfg, id))]))
	});
}
/** Release only deleted account selections; model choices and unrelated accounts survive. */
function removeModelAuthProfileSelections(cfg, removed) {
	if (!cfg.agents) return cfg;
	const strip = (ref, ids) => {
		if (!ref || !ids?.size) return ref;
		const { model, profile } = splitTrailingAuthProfile(ref);
		return profile && ids.has(profile) ? model : ref;
	};
	const stripModel = (model, ids) => {
		if (typeof model === "string" || model === void 0) return strip(model, ids);
		return {
			...model,
			...model.primary !== void 0 ? { primary: strip(model.primary, ids) } : {},
			...model.fallbacks ? { fallbacks: model.fallbacks.map((ref) => strip(ref, ids)) } : {}
		};
	};
	const next = structuredClone(cfg);
	const beforeDefaults = cfg.agents.defaults;
	const defaults = next.agents?.defaults;
	if (defaults) {
		if (defaults.model !== void 0) defaults.model = stripModel(defaults.model, removed.shared);
		if (defaults.utilityModel !== void 0) defaults.utilityModel = strip(defaults.utilityModel, removed.shared);
	}
	for (const agentId of listAgentIds(cfg)) {
		let entry = resolveMutableAgentEntry(next, agentId);
		const implicitAgent = !entry;
		if (!entry && next.agents) {
			next.agents.entries = { [agentId]: {} };
			entry = next.agents.entries[agentId];
		}
		if (!entry) continue;
		const ids = removed.agents.get(agentId);
		const originalModel = entry.model;
		const own = toAgentModelListLike(originalModel);
		const inherited = toAgentModelListLike(beforeDefaults?.model);
		const nextInherited = toAgentModelListLike(defaults?.model);
		const model = toAgentModelListLike(stripModel(originalModel, ids)) ?? {};
		if (own?.primary === void 0 && inherited?.primary !== void 0) {
			const primary = strip(inherited.primary, ids);
			if (primary !== nextInherited?.primary) model.primary = primary;
		}
		if (Object.keys(model).length > 0) entry.model = typeof originalModel === "string" && model.fallbacks === void 0 ? model.primary : model;
		const fallbacks = (resolveAgentModelFallbacksOverride(cfg, agentId) ?? resolveAgentModelFallbackValues(beforeDefaults?.model)).map((ref) => strip(ref, ids));
		const nextFallbacks = resolveAgentModelFallbacksOverride(next, agentId) ?? resolveAgentModelFallbackValues(defaults?.model);
		if (!isDeepStrictEqual(fallbacks, nextFallbacks)) entry.model = {
			...toAgentModelListLike(entry.model),
			fallbacks
		};
		const utility = strip(entry.utilityModel ?? beforeDefaults?.utilityModel, ids);
		if (entry.utilityModel !== void 0 || utility !== defaults?.utilityModel) entry.utilityModel = utility;
		if (implicitAgent && Object.keys(entry).length === 0 && next.agents) delete next.agents.entries;
	}
	return isDeepStrictEqual(cfg, next) ? cfg : next;
}
//#endregion
//#region src/commands/models/auth-logout.ts
const MISSING_CONFIG_VALUE = Symbol("missing-config-value");
function restoreConfigMutationValue(current, before, after) {
	if (isDeepStrictEqual(before, after)) return current;
	if (isDeepStrictEqual(current, after)) return before;
	const currentRecord = asOptionalRecord(current);
	const beforeRecord = asOptionalRecord(before);
	const afterRecord = asOptionalRecord(after);
	if (!currentRecord || !beforeRecord || !afterRecord) return current;
	const restored = { ...currentRecord };
	const keys = /* @__PURE__ */ new Set([...Object.keys(beforeRecord), ...Object.keys(afterRecord)]);
	for (const key of keys) {
		const value = restoreConfigMutationValue(Object.hasOwn(currentRecord, key) ? currentRecord[key] : MISSING_CONFIG_VALUE, Object.hasOwn(beforeRecord, key) ? beforeRecord[key] : MISSING_CONFIG_VALUE, Object.hasOwn(afterRecord, key) ? afterRecord[key] : MISSING_CONFIG_VALUE);
		if (value === MISSING_CONFIG_VALUE) delete restored[key];
		else restored[key] = value;
	}
	return restored;
}
function restoreCredentialConfigMutation(params) {
	return restoreConfigMutationValue(params.current, params.before, params.after);
}
function restoreSurvivingProfileOrder(params) {
	const order = { ...params.after.auth?.order };
	for (const [provider, beforeOrder] of Object.entries(params.before.auth?.order ?? {})) {
		const afterOrder = params.after.auth?.order?.[provider] ?? [];
		const restored = beforeOrder.filter((profileId) => afterOrder.includes(profileId) || params.survivingProfileIds.has(profileId));
		for (const profileId of afterOrder) if (!restored.includes(profileId)) restored.push(profileId);
		if (restored.length > 0 || Object.hasOwn(order, provider)) order[provider] = restored;
	}
	if (Object.keys(order).length === 0 && !params.desired.auth) return params.desired;
	const { order: _removedOrder, ...auth } = params.desired.auth ?? {};
	return {
		...params.desired,
		auth: {
			...auth,
			...Object.keys(order).length > 0 ? { order } : {}
		}
	};
}
function removeCredentialConfigReferences(params) {
	let next = params.current;
	for (const id of params.profileIds) next = removeAuthProfileConfig(next, id);
	if (params.apiKeyProvider === void 0 || !next.models?.providers) return next;
	const owner = resolveProviderIdForAuth(params.apiKeyProvider, { config: next });
	const providers = { ...next.models.providers };
	for (const [provider, entry] of Object.entries(providers)) if (resolveProviderIdForAuth(provider, { config: next }) === owner && resolveProviderEntryApiKeyProfileReference({
		cfg: params.runtimeConfig,
		sourceConfig: params.runtimeConfig,
		provider,
		store: params.store
	}).kind === "literal") {
		const { apiKey: _removed, ...connection } = entry;
		providers[provider] = connection;
	}
	return {
		...next,
		models: {
			...next.models,
			providers
		}
	};
}
/** Clears selected config references before deleting the credentials they name. */
async function removeModelAuthCredentials(params) {
	const apiKeyProvider = params.apiKeyProvider;
	const keyBindings = (cfg, sourceConfig) => {
		const owner = apiKeyProvider === void 0 ? void 0 : resolveProviderIdForAuth(apiKeyProvider, { config: cfg });
		return {
			owner,
			bindings: Object.fromEntries(Object.entries(cfg.models?.providers ?? {}).filter(([provider, entry]) => entry.apiKey !== void 0 && resolveProviderIdForAuth(provider, { config: cfg }) === owner).map(([provider]) => {
				const { providerConfig, ref } = resolveProviderConfigSecretInput(cfg, provider, sourceConfig);
				return [provider, ref ?? providerConfig?.apiKey];
			}))
		};
	};
	const expectedBindings = apiKeyProvider === void 0 ? void 0 : keyBindings(params.cfg);
	const application = createRuntimeConfigWriteApplication(captureGatewayRootWorkAdmissionContinuationScope()?.run);
	let configChanged = false;
	let confirmedSelections;
	let cleanup;
	const beforeRemove = async (profileIds, scopes = []) => {
		await updateConfig(async (current, { runtimeConfig }) => {
			if (expectedBindings && !isDeepStrictEqual(keyBindings(runtimeConfig, runtimeConfig), expectedBindings)) throw new Error("The key changed while removing it. Nothing was removed. Reload Models and retry removal.");
			const store = loadAuthProfileStoreWithoutExternalProfiles(params.agentDir, { allowKeychainPrompt: false });
			if (apiKeyProvider !== void 0 && profileIds.some((id) => {
				const credential = store.profiles[id];
				return credential?.type !== "api_key" || Boolean(credential.keyRef) || resolveProviderIdForAuth(credential.provider, {
					config: current,
					storedCredential: true
				}) !== resolveProviderIdForAuth(apiKeyProvider, { config: current });
			})) throw new Error("The selected API key changed. Reload Models and retry removal.");
			const selections = await resolveModelAuthProfileRemoval(runtimeConfig, scopes);
			const next = removeModelAuthProfileSelections(removeCredentialConfigReferences({
				current,
				runtimeConfig,
				profileIds,
				store,
				...apiKeyProvider !== void 0 ? { apiKeyProvider } : {}
			}), selections);
			cleanup = {
				before: current,
				after: next,
				profileIds,
				selections
			};
			configChanged = !isDeepStrictEqual(current, next);
			return next;
		}, void 0, void 0, attachRuntimeConfigWriteApplication({}, application));
	};
	const restoreIncompleteRemoval = async (survivingProfiles, scopes = []) => {
		const cleanupState = cleanup;
		if (!cleanupState) return;
		const survivingProfileIds = new Set(survivingProfiles.keys());
		let withoutSurvivors = cleanupState.before;
		for (const profileId of cleanupState.profileIds) if (survivingProfileIds.has(profileId)) withoutSurvivors = removeAuthProfileConfig(withoutSurvivors, profileId);
		let desired = restoreSurvivingProfileOrder({
			desired: restoreCredentialConfigMutation({
				current: cleanupState.after,
				before: cleanupState.before,
				after: withoutSurvivors
			}),
			before: cleanupState.before,
			after: cleanupState.after,
			survivingProfileIds
		});
		const removedSelections = excludeSurvivingModelAuthProfiles(cleanupState.selections, await resolveModelAuthProfileRemoval(cleanupState.before, scopes));
		confirmedSelections = removedSelections;
		desired = restoreCredentialConfigMutation({
			current: desired,
			before: removeModelAuthProfileSelections(cleanupState.before, removedSelections),
			after: removeModelAuthProfileSelections(cleanupState.before, cleanupState.selections)
		});
		await updateConfig((current) => restoreCredentialConfigMutation({
			current,
			before: desired,
			after: cleanupState.after
		}));
		cleanupState.selections = removedSelections;
	};
	let removed;
	try {
		removed = await removeAuthProfilesAcrossOwnerStores({
			cfg: params.cfg,
			agentDir: params.agentDir,
			profileIds: params.profileIds,
			beforeRemove,
			onIncomplete: restoreIncompleteRemoval,
			...params.provider !== void 0 ? { provider: params.provider } : {}
		});
		if (removed && cleanup) confirmedSelections = cleanup.selections;
	} finally {
		if (cleanup && confirmedSelections) {
			const selections = excludeReconnectedModelAuthProfiles(cleanup.after, confirmedSelections);
			await clearRemovedSessionAuthProfiles({
				cfg: cleanup.after,
				removedByAgent: selections.agents,
				rewriteConfig: (cfg) => removeModelAuthProfileSelections(cfg, selections)
			});
		}
	}
	if (!removed) throw new Error("Saved credentials could not be removed. Wait a moment and retry.");
	if (configChanged && !(application.claimed && await application.result === "applied")) return "Credentials were removed, but the Gateway has not confirmed applying the change. Run `openclaw gateway restart` to apply it.";
}
async function modelsAuthLogoutCommand(opts, runtime) {
	const profileId = opts.profileId?.trim();
	if (!profileId) throw new Error(`Missing profile id. Run ${formatCliCommand("openclaw models auth list")} to see saved profile ids.`);
	const cfg = await loadModelsConfig({
		commandName: "models auth logout",
		runtime
	});
	const { agentId, agentDir } = resolveModelsTargetAgent(cfg, opts.agent, { kind: "mutation" });
	const store = ensureAuthProfileStoreWithoutExternalProfiles(agentDir);
	const credential = store.profiles[profileId];
	if (!credential) throw new Error(`Auth profile "${profileId}" not found for agent "${agentId}". Run ${formatCliCommand(`openclaw models auth list --agent ${agentId}`)} to see saved profile ids.`);
	const description = `${profileId} (${credential.provider}/${credential.type})`;
	if (!opts.yes) {
		if (!process.stdin.isTTY) throw new Error(`Refusing to remove auth profile ${description} without confirmation. Pass --yes to remove it non-interactively.`);
		if (!await createClackPrompter().confirm({
			message: `Remove auth profile ${description} from agent ${agentId}?`,
			initialValue: false
		})) {
			runtime.log("Cancelled.");
			return;
		}
	}
	const warning = await removeModelAuthCredentials({
		cfg,
		agentDir,
		profileIds: [profileId]
	});
	if (configReferencesAuthProfile(cfg, profileId)) logConfigUpdated(runtime);
	await refreshRunningGatewayAuthState(agentId, "logout", runtime);
	if (warning) runtime.error(warning);
	runtime.log(`Agent: ${agentId}`);
	runtime.log(`Removed auth profile: ${description}`);
	if (listProfilesForProvider(store, credential.provider).filter((id) => id !== profileId).length === 0) runtime.log(`No auth profiles remain for ${credential.provider}. Run ${formatCliCommand(`openclaw models auth login --provider ${credential.provider}`)} to sign in again.`);
}
//#endregion
export { modelsAuthLogoutCommand, removeModelAuthCredentials };
