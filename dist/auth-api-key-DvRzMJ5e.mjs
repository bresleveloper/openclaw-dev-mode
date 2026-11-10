import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { r as normalizeProviderId, t as findNormalizedProviderKey } from "./provider-id-D1VImdKk.mjs";
import { W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { a as captureGatewayRootWorkAdmissionContinuationScope } from "./gateway-work-admission-FWbk4b3p.mjs";
import { B as resolveNativeSharedAuthStorePath } from "./sqlite-BlFpr2YD.mjs";
import { C as createRuntimeConfigWriteApplication, x as attachRuntimeConfigWriteApplication } from "./io.runtime-Ds5uC0Bf.mjs";
import { a as resolveAuthProfileOrder } from "./order-CElLtwMu.mjs";
import { d as resolvePersistedAuthProfileOwnerAgentDir } from "./store-BPXZsh12.mjs";
import { g as resolveProviderConfigSecretInput, v as resolveProviderEntryApiKeyProfileReference } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { s as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-CwqGD12G.mjs";
import { d as upsertAuthProfileWithLockOrThrow, v as listCandidateAuthProfileStores, y as loadCandidateAuthProfileStore } from "./profiles-Df1OQ7iN.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-olPFvVdo.mjs";
import { i as loadValidConfigSnapshotOrThrow, u as updateConfig } from "./shared-Ck_WZImY.mjs";
import { i as validateOpenAICodexApiKeyInput, n as normalizeManualAuthProvider, r as resolveDefaultTokenProfileId } from "./auth-manual-input-D5E4UzkF.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/models/auth-api-key.ts
/** Saves a manual key without changing model selection or connection settings. */
async function saveModelProviderApiKey(params) {
	const provider = normalizeManualAuthProvider(params.provider);
	const key = normalizeSecretInput(params.apiKey);
	registerSecretValueForRedaction(key);
	const validationError = !key ? "API key is required" : provider === "openai" ? validateOpenAICodexApiKeyInput(key) : void 0;
	if (validationError) throw new Error(validationError);
	const config = params.config ?? (await loadValidConfigSnapshotOrThrow()).runtimeConfig;
	const validateCurrentCredential = (existing) => {
		if (existing?.type === "api_key" && existing.keyRef) throw new Error("This API-key profile uses an external secret reference. Remove that saved sign-in before storing an inline key.");
		if (existing && (existing.type !== "api_key" || normalizeProviderId(existing.provider) !== provider)) throw new Error("The API-key profile belongs to another sign-in. Manage that saved sign-in first.");
	};
	const configuredKey = (cfg) => {
		const id = findNormalizedProviderKey(cfg.models?.providers, provider);
		const connection = id ? cfg.models?.providers?.[id] : void 0;
		if (connection?.auth && connection.auth !== "api-key") throw new Error("This connection uses another sign-in method. Use its sign-in option instead.");
		return id;
	};
	const configuredBinding = (cfg, providerId) => {
		const { providerConfig, ref } = resolveProviderConfigSecretInput(cfg, providerId);
		return ref ?? providerConfig?.apiKey;
	};
	const connectionId = params.profileId ? void 0 : configuredKey(config);
	const connectionBinding = connectionId === void 0 ? void 0 : configuredBinding(config, connectionId);
	const store = ensureAuthProfileStoreWithoutExternalProfiles(params.agentDir);
	const replacementId = !connectionId ? resolveAuthProfileOrder({
		cfg: config,
		store,
		provider
	}).find((id) => {
		const credential = store.profiles[id];
		return credential?.type === "api_key" && !credential.keyRef;
	}) : void 0;
	const configuredReference = connectionId ? resolveProviderEntryApiKeyProfileReference({
		cfg: config,
		provider: connectionId,
		store
	}) : void 0;
	const configuredProfileId = configuredReference?.kind === "profile" || configuredReference?.kind === "profile-incompatible" ? configuredReference.profileId : void 0;
	const profileId = params.profileId ?? configuredProfileId ?? replacementId ?? resolveDefaultTokenProfileId(provider);
	if (isUserModelAuthProfileId(profileId)) throw new Error("Personal model accounts are managed in Settings → Profile → Connected accounts.");
	const agentDir = connectionId ? void 0 : store.profiles[profileId] ? resolvePersistedAuthProfileOwnerAgentDir({
		agentDir: params.agentDir,
		profileId
	}) : params.agentDir;
	const localCandidates = connectionId ? (await listCandidateAuthProfileStores({ cfg: config })).filter((candidate) => candidate.databasePath !== resolvePathViaExistingAncestorSync(resolveNativeSharedAuthStorePath())) : [];
	const validateSharedBinding = () => {
		if (localCandidates.some((candidate) => loadCandidateAuthProfileStore(candidate)?.profiles[profileId])) throw new Error("An agent already overrides this shared key. Remove that agent's override before replacing the shared key.");
	};
	const validateReplacement = (existing) => {
		params.assertCurrent?.();
		validateCurrentCredential(existing);
		validateSharedBinding();
	};
	validateReplacement(store.profiles[profileId]);
	await upsertAuthProfileWithLockOrThrow({
		profileId,
		credential: {
			type: "api_key",
			provider,
			key
		},
		agentDir,
		preserveApiKeyMetadata: true,
		resetFailureState: true,
		validateCurrentCredential: validateReplacement,
		assertCurrent: params.assertCurrent
	});
	const application = createRuntimeConfigWriteApplication(captureGatewayRootWorkAdmissionContinuationScope()?.run);
	let configChanged = false;
	await updateConfig((current) => {
		params.assertCurrent?.();
		const id = params.profileId ? void 0 : configuredKey(current);
		if (!params.profileId && (id !== connectionId || id !== void 0 && !isDeepStrictEqual(configuredBinding(current, id), connectionBinding))) throw new Error("The provider connection changed during the key update. Reopen the connection and save the key again");
		validateSharedBinding();
		let next = applyAuthProfileConfig(current, {
			...current.auth?.profiles?.[profileId],
			profileId,
			provider,
			mode: "api_key"
		});
		if (id && next.models?.providers?.[id]) next = {
			...next,
			models: {
				...next.models,
				providers: {
					...next.models.providers,
					[id]: {
						...next.models.providers[id],
						apiKey: profileId
					}
				}
			}
		};
		configChanged = !isDeepStrictEqual(current, next);
		return next;
	}, void 0, params.assertCurrent, attachRuntimeConfigWriteApplication({ assertCurrent: params.assertCurrent }, application)).catch((error) => {
		throw new Error("API key saved, but provider settings could not be applied: " + (error instanceof Error ? error.message : String(error)) + ". Reopen Models and save the key again.", { cause: error });
	});
	if (configChanged && !(application.claimed && await application.result === "applied")) return {
		profileId,
		warning: "API key saved, but the Gateway has not confirmed applying the provider settings. Run `openclaw gateway restart` to apply them."
	};
	return { profileId };
}
//#endregion
export { saveModelProviderApiKey as t };
