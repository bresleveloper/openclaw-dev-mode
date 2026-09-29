import { n as findNormalizedProviderValue } from "../../provider-id-DCtsDflE.mjs";
import { o as hasConfiguredSecretInput } from "../../types.secrets-B5xWSzLp.mjs";
import { B as isProviderAuthError, V as requireApiKey } from "../../loader-runtime-load-XbrcYJWd.mjs";
import { r as providerOperationRetryConfig } from "../../operation-retry-Dopl7EnK.mjs";
import { n as executeWithApiKeyRotation, t as collectProviderApiKeysForExecution } from "../../api-key-rotation-BmnkFDjk.mjs";
import { t as transcribeOpenAiCompatibleAudio } from "../../media-understanding-B-fZ4OqT.mjs";
import { a as resolveApiKeyForProvider } from "../../provider-auth-runtime-CYwZwijM.mjs";
import "../../provider-http-Dn9NddwC.mjs";
import "../../provider-auth-eHeoP8se.mjs";
import { i as classifyOpenAIBaseUrl, t as OPENAI_API_BASE_URL } from "../../base-url-CsNC9nJ8.mjs";
import { n as OPENAI_DEFAULT_AUDIO_TRANSCRIPTION_MODEL } from "../../default-models-DOFL1mMC.mjs";
//#region extensions/openai/audio-transcription.ts
async function transcribeOpenAiAudio(params) {
	return await transcribeOpenAiCompatibleAudio({
		...params,
		provider: "openai",
		defaultBaseUrl: OPENAI_API_BASE_URL,
		defaultModel: OPENAI_DEFAULT_AUDIO_TRANSCRIPTION_MODEL
	});
}
const transcribeOpenAiAudioWithContext = async (context) => {
	const providerConfig = findNormalizedProviderValue(context.cfg.models?.providers, "openai");
	const hasConfiguredKey = hasConfiguredSecretInput(providerConfig?.apiKey, context.cfg.secrets?.defaults);
	const endpointKind = classifyOpenAIBaseUrl(context.baseUrl);
	const nativeEndpoint = endpointKind === "unresolved" || endpointKind === "platform" || endpointKind === "chatgpt";
	const params = {
		provider: "openai",
		cfg: !context.profile && providerConfig && hasConfiguredKey && (!providerConfig.auth || providerConfig.auth === "api-key") ? {
			...context.cfg,
			models: {
				...context.cfg.models,
				providers: {
					...context.cfg.models?.providers,
					openai: {
						...providerConfig,
						auth: "api-key"
					}
				}
			}
		} : context.cfg,
		agentDir: context.agentDir,
		workspaceDir: context.workspaceDir,
		profileId: context.profile,
		preferredProfile: context.preferredProfile,
		lockedProfile: Boolean(context.profile)
	};
	const explicitSubscription = providerConfig?.auth === "oauth" || providerConfig?.auth === "token";
	let auth;
	let credential;
	try {
		auth = await resolveApiKeyForProvider({
			...params,
			modelApi: context.profile || explicitSubscription ? void 0 : "openai-audio-transcriptions"
		}).catch((error) => {
			if (context.profile || hasConfiguredKey || !nativeEndpoint || !isProviderAuthError(error, "missing-provider-auth")) throw error;
			return resolveApiKeyForProvider(params);
		});
		credential = requireApiKey(auth, "openai");
		if (auth.mode !== "api-key") {
			if (auth.mode !== "oauth" && auth.mode !== "token") throw new Error("OpenAI audio transcription requires an API key or OAuth profile.");
			if (!nativeEndpoint || context.headers || context.request) throw new Error("OpenAI OAuth audio transcription requires the official endpoint without custom request overrides. Remove the overrides or select an OpenAI API-key profile.");
		}
	} catch (error) {
		return {
			ok: false,
			error
		};
	}
	const transcribe = (apiKey) => transcribeOpenAiAudio({
		...context,
		baseUrl: nativeEndpoint ? OPENAI_API_BASE_URL : context.baseUrl,
		apiKey,
		...auth.mode === "api-key" ? { auth: {
			kind: "api-key",
			apiKey
		} } : {}
	});
	return {
		ok: true,
		value: auth.mode === "api-key" ? await executeWithApiKeyRotation({
			provider: "openai",
			apiKeys: collectProviderApiKeysForExecution({
				provider: "openai",
				primaryApiKey: credential
			}),
			transientRetry: providerOperationRetryConfig("read"),
			execute: transcribe
		}) : await transcribe(credential)
	};
};
//#endregion
export { transcribeOpenAiAudio, transcribeOpenAiAudioWithContext };
