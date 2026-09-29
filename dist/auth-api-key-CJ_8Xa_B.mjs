import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as normalizeProviderId, t as findNormalizedProviderKey } from "./provider-id-DCtsDflE.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { C as createRuntimeConfigWriteApplication, x as attachRuntimeConfigWriteApplication } from "./io.runtime-BN-rPaec.mjs";
import { i as captureGatewayRootWorkAdmissionContinuationScope } from "./gateway-work-admission-CHv_0noy.mjs";
import { c as resolveSharedAuthStorePath } from "./path-resolve-Bm8Ih2d_.mjs";
import { i as isUserModelAuthProfileId } from "./profile-usage-stats-Uo3hJqOO.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { d as resolvePersistedAuthProfileOwnerAgentDir } from "./store-CTvq6MSF.mjs";
import { _ as loadCandidateAuthProfileStore, g as listCandidateAuthProfileStores, u as upsertAuthProfileWithLockOrThrow } from "./profiles-DblRQQgZ.mjs";
import { j as resolveProviderEntryApiKeyProfileReference, k as resolveProviderConfigSecretInput } from "./loader-runtime-load-XbrcYJWd.mjs";
import { a as resolveAuthProfileOrder } from "./order-BQhYF772.mjs";
import { i as ensureAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-BcoYkagW.mjs";
import "./auth-profiles-CYVlYrag.mjs";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-CVzRzfCc.mjs";
import { i as loadValidConfigSnapshotOrThrow, u as updateConfig } from "./shared-CyxoXW6o.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/models/auth-manual-input.ts
/** Input contracts shared by manual token/API-key commands and the API-key writer. */
function resolveDefaultTokenProfileId(provider) {
	return `${normalizeProviderId(provider)}:manual`;
}
function normalizeManualAuthProvider(provider) {
	const normalized = normalizeProviderId(provider);
	if (normalized === "openai-codex" || normalized === "codex-cli") throw new Error(`"${normalized}" is a legacy provider ID; use --provider openai.`);
	return normalized === "openai" || normalized === "codex" ? "openai" : normalized;
}
function stripBearerPrefix(value) {
	return value.trim().replace(/^Bearer\s+/i, "").trim();
}
function looksLikeOpenAIApiKey(value) {
	return /^sk-[A-Za-z0-9_-]{8,}$/.test(value.trim());
}
function looksLikeJwtToken(value) {
	const parts = stripBearerPrefix(value).split(".");
	return parts.length === 3 && parts.every((part) => /^[A-Za-z0-9_-]{8,}$/.test(part));
}
function looksLikeStructuredCredential(value) {
	const trimmed = value.trim();
	return trimmed.startsWith("{") || trimmed.startsWith("[");
}
function validateOpenAICodexApiKeyInput(value) {
	const trimmed = value.trim();
	if (!trimmed) return "Required";
	if (looksLikeOpenAIApiKey(trimmed)) return;
	if (looksLikeJwtToken(trimmed) || looksLikeStructuredCredential(trimmed)) return `That looks like token or OAuth material, not an OpenAI API key. Use ${formatCliCommand("openclaw models auth paste-token --provider openai")} for token auth material.`;
	return "That does not look like an OpenAI API key.";
}
//#endregion
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
	const localCandidates = connectionId ? (await listCandidateAuthProfileStores({ cfg: config })).filter((candidate) => candidate.databasePath !== resolvePathViaExistingAncestorSync(resolveSharedAuthStorePath())) : [];
	const validateSharedBinding = () => {
		if (localCandidates.some((candidate) => loadCandidateAuthProfileStore(candidate)?.profiles[profileId])) throw new Error("An agent already overrides this shared key. Remove that agent's override before replacing the shared key.");
	};
	const validateReplacement = (existing) => {
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
		validateCurrentCredential: validateReplacement
	});
	const application = createRuntimeConfigWriteApplication(captureGatewayRootWorkAdmissionContinuationScope()?.run);
	let configChanged = false;
	await updateConfig((current) => {
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
	}, void 0, void 0, attachRuntimeConfigWriteApplication({}, application)).catch((error) => {
		throw new Error("API key saved, but provider settings could not be applied: " + (error instanceof Error ? error.message : String(error)) + ". Reopen Models and save the key again.", { cause: error });
	});
	if (configChanged && !(application.claimed && await application.result === "applied")) return {
		profileId,
		warning: "API key saved, but the Gateway has not confirmed applying the provider settings. Run `openclaw gateway restart` to apply them."
	};
	return { profileId };
}
//#endregion
export { validateOpenAICodexApiKeyInput as a, resolveDefaultTokenProfileId as i, looksLikeOpenAIApiKey as n, normalizeManualAuthProvider as r, saveModelProviderApiKey as t };
