import { o as hasConfiguredSecretInput } from "../../types.secrets-Dgbd2kyP.mjs";
import { n as findNormalizedProviderValue } from "../../provider-id-D1VImdKk.mjs";
import { A as requireApiKey, k as isProviderAuthError } from "../../model-auth-provider-config-C_EL9CxV.mjs";
import { r as providerOperationRetryConfig } from "../../operation-retry-B2m6H7IT.mjs";
import { n as executeWithApiKeyRotation, t as collectProviderApiKeysForExecution } from "../../api-key-rotation-Dw4l5GMT.mjs";
import { a as resolveApiKeyForProvider } from "../../provider-auth-runtime-CMRSW7VK.mjs";
import "../../provider-http-BuV15s4V.mjs";
import "../../provider-auth-JCvgbsWg.mjs";
import { t as transcribeOpenAiCompatibleAudio } from "../../media-understanding-WxRUvHtk.mjs";
import { i as classifyOpenAIBaseUrl, t as OPENAI_API_BASE_URL } from "../../base-url-Baro1bPi.mjs";
import { n as OPENAI_DEFAULT_AUDIO_TRANSCRIPTION_MODEL } from "../../default-models-CU9j2AqC.mjs";
//#region extensions/openai/audio-transcription.ts
async function transcribeOpenAiAudio(params) {
	return await transcribeOpenAiCompatibleAudio({
		...params,
		provider: "openai",
		defaultBaseUrl: OPENAI_API_BASE_URL,
		defaultModel: OPENAI_DEFAULT_AUDIO_TRANSCRIPTION_MODEL
	});
}
async function resolveOpenAiAudioAuth(context) {
	const providerConfig = findNormalizedProviderValue(context.cfg.models?.providers, "openai");
	const hasConfiguredKey = hasConfiguredSecretInput(providerConfig?.apiKey, context.cfg.secrets?.defaults);
	const endpointKind = classifyOpenAIBaseUrl(context.baseUrl);
	const nativeEndpoint = endpointKind === "unresolved" || endpointKind === "platform" || endpointKind === "chatgpt";
	const params = {
		provider: "openai",
		capability: "audio-transcription",
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
	return {
		ok: true,
		value: {
			auth,
			credential,
			nativeEndpoint
		}
	};
}
const isOpenAiAudioConfigured = async (context) => (await resolveOpenAiAudioAuth(context)).ok;
const transcribeOpenAiAudioWithContext = async (context) => {
	const prepared = await resolveOpenAiAudioAuth(context);
	if (!prepared.ok) return prepared;
	const { auth, credential, nativeEndpoint } = prepared.value;
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
export { isOpenAiAudioConfigured, transcribeOpenAiAudio, transcribeOpenAiAudioWithContext };
