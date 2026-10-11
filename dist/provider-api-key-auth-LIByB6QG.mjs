import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { a as createLazyRuntimeSurface } from "./lazy-runtime-BPNHa36e.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
//#region src/plugins/provider-api-key-auth.ts
/** Builds API-key provider auth methods that write profiles and config updates. */
const loadProviderApiKeyAuthRuntime = createLazyRuntimeSurface(() => import("./provider-api-key-auth.runtime.js"), ({ providerApiKeyAuthRuntime }) => providerApiKeyAuthRuntime);
/** Captures the resolved key and its original storage input without persisting credentials. */
async function captureProviderApiKey(ctx, params) {
	const { missingInputMessage, ...inputOptions } = params;
	const { ensureApiKeyFromOptionEnvOrPrompt, normalizeApiKeyInput, validateApiKeyInput } = await loadProviderApiKeyAuthRuntime();
	let input;
	let mode;
	let captured = false;
	const apiKey = await ensureApiKeyFromOptionEnvOrPrompt({
		...inputOptions,
		config: ctx.config,
		workspaceDir: ctx.workspaceDir,
		prompter: ctx.prompter,
		secretInputMode: ctx.allowSecretRefPrompt === false ? ctx.secretInputMode ?? "plaintext" : ctx.secretInputMode,
		normalize: normalizeApiKeyInput,
		validate: validateApiKeyInput,
		setCredential: async (credential, selectedMode) => {
			input = credential;
			mode = selectedMode;
			captured = true;
		}
	});
	if (!captured) throw new Error(missingInputMessage ?? `Missing API key input for provider "${params.provider}".`);
	return {
		apiKey,
		input: input ?? "",
		mode
	};
}
/** Persists a newly supplied key; existing profiles retain their stored credential and metadata. */
async function persistProviderApiKey(ctx, profileId, params) {
	if (params.resolved.source === "profile") return true;
	const credential = ctx.toApiKeyCredential(params);
	if (!credential) return false;
	const { upsertAuthProfileWithLockOrThrow } = await loadProviderApiKeyAuthRuntime();
	await upsertAuthProfileWithLockOrThrow({
		profileId,
		credential,
		agentDir: ctx.agentDir
	});
	return true;
}
function resolveStringOption(opts, optionKey) {
	return normalizeOptionalSecretInput(opts?.[optionKey]);
}
function resolveProfileId(params) {
	return normalizeOptionalString(params.profileId) || `${params.providerId}:default`;
}
function resolveProfileIds(params) {
	const explicit = normalizeUniqueStringEntries(params.profileIds ?? []);
	if (explicit.length > 0) return explicit;
	return [resolveProfileId(params)];
}
async function resolveDefaultModel(params, context) {
	if (!params.resolveDefaultModel) return params.defaultModel;
	try {
		return await params.resolveDefaultModel(context);
	} catch {
		context.signal?.throwIfAborted();
		return params.defaultModel;
	}
}
async function applyApiKeyConfig(params) {
	const { applyAuthProfileConfig, applyPrimaryModel } = await loadProviderApiKeyAuthRuntime();
	let next = params.ctx.config;
	for (const profileId of params.profileIds) next = applyAuthProfileConfig(next, {
		profileId,
		provider: normalizeOptionalString(profileId.split(":", 1)[0]) || params.providerId,
		mode: "api_key"
	});
	if (params.applyConfig) next = params.applyConfig(next);
	if (!params.defaultModel) return next;
	if (params.preserveExistingPrimary === true && resolveAgentModelPrimaryValue(next.agents?.defaults?.model) !== void 0) return next;
	return applyPrimaryModel(next, params.defaultModel);
}
/** Creates a provider auth method that captures, stores, and configures API-key credentials. */
function createProviderApiKeyAuthMethod(params) {
	const resolveNonInteractiveCredential = async (ctx) => {
		const opts = ctx.opts;
		return await ctx.resolveApiKey({
			provider: params.providerId,
			flagValue: resolveStringOption(opts, params.optionKey),
			flagName: params.flagName,
			envVar: params.envVar,
			...params.allowProfile === false ? { allowProfile: false } : {}
		});
	};
	return {
		id: params.methodId,
		label: params.label,
		hint: params.hint,
		kind: "api_key",
		starterModel: params.defaultModel,
		wizard: params.wizard,
		run: async (ctx) => {
			const opts = ctx.opts;
			const flagValue = resolveStringOption(opts, params.optionKey);
			const { buildApiKeyCredential } = await loadProviderApiKeyAuthRuntime();
			const { apiKey, input, mode } = await captureProviderApiKey(ctx, {
				token: flagValue ?? normalizeOptionalSecretInput(ctx.opts?.token),
				tokenProvider: flagValue ? params.providerId : normalizeOptionalSecretInput(ctx.opts?.tokenProvider),
				env: ctx.env,
				expectedProviders: params.expectedProviders ?? [params.providerId],
				provider: params.providerId,
				envLabel: params.envVar,
				promptMessage: params.promptMessage,
				noteMessage: params.noteMessage,
				noteTitle: params.noteTitle
			});
			const profileIds = resolveProfileIds(params);
			const defaultModel = await resolveDefaultModel(params, {
				apiKey,
				config: ctx.config,
				...ctx.signal ? { signal: ctx.signal } : {}
			});
			return {
				profiles: profileIds.map((profileId) => ({
					profileId,
					credential: buildApiKeyCredential(normalizeOptionalString(profileId.split(":", 1)[0]) || params.providerId, input, params.metadata, mode ? {
						secretInputMode: mode,
						config: ctx.config
					} : void 0)
				})),
				...params.applyConfig ? { configPatch: params.applyConfig(ctx.config) } : {},
				...defaultModel ? { defaultModel } : {}
			};
		},
		validateNonInteractive: async (ctx) => Boolean(await resolveNonInteractiveCredential(ctx)),
		runNonInteractive: async (ctx) => {
			const resolved = await resolveNonInteractiveCredential(ctx);
			if (!resolved) return null;
			const profileIds = resolveProfileIds(params);
			for (const profileId of profileIds) if (!await persistProviderApiKey(ctx, profileId, {
				provider: normalizeOptionalString(profileId.split(":", 1)[0]) || params.providerId,
				resolved,
				...params.metadata ? { metadata: params.metadata } : {}
			})) return null;
			return await applyApiKeyConfig({
				ctx,
				providerId: params.providerId,
				profileIds,
				defaultModel: await resolveDefaultModel(params, {
					apiKey: resolved.key,
					config: ctx.config
				}),
				preserveExistingPrimary: params.preserveExistingPrimary,
				applyConfig: params.applyConfig
			});
		}
	};
}
//#endregion
export { createProviderApiKeyAuthMethod as n, persistProviderApiKey as r, captureProviderApiKey as t };
