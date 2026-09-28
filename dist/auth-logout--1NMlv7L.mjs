import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { C as createRuntimeConfigWriteApplication, x as attachRuntimeConfigWriteApplication } from "./io.runtime-CZWcIUDk.mjs";
import { i as captureGatewayRootWorkAdmissionContinuationScope } from "./gateway-work-admission-CHv_0noy.mjs";
import { i as removeAuthProfilesAcrossOwnerStores } from "./profiles-B-MkhBI8.mjs";
import { j as resolveProviderEntryApiKeyProfileReference, k as resolveProviderConfigSecretInput } from "./loader-runtime-load-DitY2Htf.mjs";
import { p as listProfilesForProvider } from "./order-BQhYF772.mjs";
import { i as ensureAuthProfileStoreWithoutExternalProfiles, l as loadAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-CzCVI_rv.mjs";
import "./auth-profiles-BFAOd5yW.mjs";
import { i as removeAuthProfileConfig, r as configReferencesAuthProfile } from "./provider-auth-helpers-CqP4hf2X.mjs";
import { t as createClackPrompter } from "./clack-prompter-D8DhCvTT.mjs";
import { r as logConfigUpdated } from "./logging-DLCoHZv9.mjs";
import { l as resolveModelsTargetAgent, u as updateConfig } from "./shared-yzzedLUF.mjs";
import { t as loadModelsConfig } from "./load-config-CQ4HhFsY.mjs";
import { t as refreshRunningGatewayAuthState } from "./auth-refresh-BO5R6QVA.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/models/auth-logout.ts
/** Command for removing one saved model auth profile. */
const MISSING_CONFIG_VALUE = Symbol("missing-config-value");
function asConfigRecord(value) {
	if (value === MISSING_CONFIG_VALUE || value === null || typeof value !== "object" || Array.isArray(value)) return;
	return value;
}
function restoreConfigMutationValue(current, before, after) {
	if (isDeepStrictEqual(before, after)) return current;
	if (isDeepStrictEqual(current, after)) return before;
	const currentRecord = asConfigRecord(current);
	const beforeRecord = asConfigRecord(before);
	const afterRecord = asConfigRecord(after);
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
	let cleanup;
	const beforeRemove = async (profileIds) => {
		await updateConfig((current, { runtimeConfig }) => {
			if (expectedBindings && !isDeepStrictEqual(keyBindings(runtimeConfig, runtimeConfig), expectedBindings)) throw new Error("The key changed while removing it. Nothing was removed. Reload Models and retry removal.");
			const store = loadAuthProfileStoreWithoutExternalProfiles(params.agentDir, { allowKeychainPrompt: false });
			if (apiKeyProvider !== void 0 && profileIds.some((id) => {
				const credential = store.profiles[id];
				return credential?.type !== "api_key" || Boolean(credential.keyRef) || resolveProviderIdForAuth(credential.provider, {
					config: current,
					storedCredential: true
				}) !== resolveProviderIdForAuth(apiKeyProvider, { config: current });
			})) throw new Error("The selected API key changed. Reload Models and retry removal.");
			const next = removeCredentialConfigReferences({
				current,
				runtimeConfig,
				profileIds,
				store,
				...apiKeyProvider !== void 0 ? { apiKeyProvider } : {}
			});
			cleanup = {
				before: current,
				after: next,
				profileIds
			};
			configChanged = !isDeepStrictEqual(current, next);
			return next;
		}, void 0, void 0, attachRuntimeConfigWriteApplication({}, application));
	};
	const restoreIncompleteRemoval = async (survivingProfiles) => {
		const cleanupState = cleanup;
		if (!cleanupState) return;
		const survivingProfileIds = new Set(survivingProfiles.keys());
		let withoutSurvivors = cleanupState.before;
		for (const profileId of cleanupState.profileIds) if (survivingProfileIds.has(profileId)) withoutSurvivors = removeAuthProfileConfig(withoutSurvivors, profileId);
		const desired = restoreSurvivingProfileOrder({
			desired: restoreCredentialConfigMutation({
				current: cleanupState.after,
				before: cleanupState.before,
				after: withoutSurvivors
			}),
			before: cleanupState.before,
			after: cleanupState.after,
			survivingProfileIds
		});
		await updateConfig((current) => restoreCredentialConfigMutation({
			current,
			before: desired,
			after: cleanupState.after
		}));
	};
	if (!await removeAuthProfilesAcrossOwnerStores({
		cfg: params.cfg,
		agentDir: params.agentDir,
		profileIds: params.profileIds,
		beforeRemove,
		onIncomplete: restoreIncompleteRemoval,
		...params.provider !== void 0 ? { provider: params.provider } : {}
	})) throw new Error("Saved credentials could not be removed. Wait a moment and retry.");
	if (configChanged && !(application.claimed && await application.result === "applied")) return "Credentials were removed, but the Gateway has not confirmed applying the change. Run `openclaw gateway restart` to apply it.";
}
/** Removes a saved auth profile from the agent auth store and from config. */
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
