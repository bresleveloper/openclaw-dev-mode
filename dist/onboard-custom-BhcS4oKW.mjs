import { r as fetchWithTimeout } from "./fetch-timeout-BoUn0ffV.mjs";
import { c as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-CJLBUUHI.mjs";
import { n as isHttpUrl } from "./url-protocol-OU3K-ySz.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { r as t } from "./i18n-Cuh2pEdZ.mjs";
import { t as ensureApiKeyFromEnvOrPrompt } from "./provider-auth-input-RxRibHGK.mjs";
import { a as buildOpenAiVerificationProbeRequest, d as resolveCustomProviderId, i as buildEndpointIdFromUrl, l as resolveCustomModelAliasError, n as applyCustomApiConfig, o as normalizeEndpointId, r as buildAnthropicVerificationProbeRequest, s as normalizeOptionalProviderApiKey, u as resolveCustomModelImageInputInference } from "./onboard-custom-config-CNqDobWf.mjs";
//#region src/commands/onboard-custom.ts
const VERIFY_TIMEOUT_MS = 3e4;
const COMPATIBILITY_OPTIONS = [
	{
		value: "openai",
		labelKey: "wizard.customProvider.compatibilityOpenAi",
		hintKey: "wizard.customProvider.compatibilityOpenAiHint"
	},
	{
		value: "openai-responses",
		labelKey: "wizard.customProvider.compatibilityOpenAiResponses",
		hintKey: "wizard.customProvider.compatibilityOpenAiResponsesHint"
	},
	{
		value: "anthropic",
		labelKey: "wizard.customProvider.compatibilityAnthropic",
		hintKey: "wizard.customProvider.compatibilityAnthropicHint"
	},
	{
		value: "unknown",
		labelKey: "wizard.customProvider.compatibilityUnknown",
		hintKey: "wizard.customProvider.compatibilityUnknownHint"
	}
];
function formatVerificationError(error) {
	if (!error) return "unknown error";
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	try {
		return JSON.stringify(error);
	} catch {
		return "unknown error";
	}
}
function isJsonVerificationResponse(res) {
	const contentType = typeof res.headers?.get === "function" ? res.headers.get("content-type") ?? "" : "";
	if (!contentType.trim()) return true;
	const mediaType = contentType.split(";", 1)[0]?.trim().toLowerCase();
	return mediaType === "application/json" || mediaType !== void 0 && mediaType.endsWith("+json");
}
async function requestVerification(params) {
	let res;
	try {
		res = await fetchWithTimeout(params.endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...params.headers
			},
			body: JSON.stringify(params.body)
		}, VERIFY_TIMEOUT_MS);
		if (res.ok && !isJsonVerificationResponse(res)) return {
			ok: false,
			error: `Verification returned ${res.headers.get("content-type") || "missing content-type"} instead of JSON. Check the provider base URL; OpenAI-compatible endpoints usually need a /v1 path prefix.`
		};
		return {
			ok: res.ok,
			status: res.status
		};
	} catch (error) {
		return {
			ok: false,
			error
		};
	} finally {
		await res?.body?.cancel().catch(() => void 0);
	}
}
async function verifyCustomApiCompatibility(params) {
	return await requestVerification(params.compatibility === "anthropic" ? buildAnthropicVerificationProbeRequest(params) : buildOpenAiVerificationProbeRequest({
		...params,
		responsesApi: params.compatibility === "openai-responses"
	}));
}
async function promptBaseUrlAndKey(params) {
	const baseUrl = (await params.prompter.text({
		message: t("wizard.customProvider.apiBaseUrl"),
		initialValue: params.initialBaseUrl,
		placeholder: "https://api.example.com/v1",
		validate: (val) => {
			return isHttpUrl(val) ? void 0 : t("wizard.customProvider.validUrl");
		}
	})).trim();
	const providerHint = buildEndpointIdFromUrl(baseUrl) || "custom";
	let apiKeyInput;
	const resolvedApiKey = await ensureApiKeyFromEnvOrPrompt({
		config: params.config,
		provider: providerHint,
		envLabel: "CUSTOM_API_KEY",
		promptMessage: t("wizard.customProvider.apiKeyPrompt"),
		normalize: normalizeSecretInput,
		validate: () => void 0,
		prompter: params.prompter,
		secretInputMode: params.secretInputMode,
		setCredential: async (apiKey) => {
			apiKeyInput = apiKey;
		}
	});
	return {
		baseUrl,
		apiKey: normalizeOptionalProviderApiKey(apiKeyInput),
		resolvedApiKey: normalizeSecretInput(resolvedApiKey)
	};
}
async function promptCustomApiModelId(prompter) {
	return (await prompter.text({
		message: t("wizard.customProvider.modelId"),
		placeholder: t("wizard.customProvider.modelIdPlaceholder"),
		validate: (val) => val.trim() ? void 0 : t("wizard.customProvider.modelIdRequired")
	})).trim();
}
/** Prompts for a custom API provider and prepares its endpoint config without writing it. */
async function promptCustomApiConfig(params) {
	const { prompter, runtime, config } = params;
	const manifestPlugins = loadManifestMetadataSnapshot({
		config,
		workspaceDir: params.target?.workspaceDir,
		env: process.env
	}).plugins;
	let { baseUrl, apiKey, resolvedApiKey } = await promptBaseUrlAndKey({
		prompter,
		config,
		secretInputMode: params.secretInputMode
	});
	const compatibilityChoice = await prompter.select({
		message: t("wizard.customProvider.compatibility"),
		options: COMPATIBILITY_OPTIONS.filter((option) => params.verification !== "deferred" || option.value !== "unknown").map((option) => ({
			value: option.value,
			label: t(option.labelKey),
			hint: t(option.hintKey)
		}))
	});
	let modelId = await promptCustomApiModelId(prompter);
	let compatibility = compatibilityChoice === "unknown" ? null : compatibilityChoice;
	while (params.verification !== "deferred") {
		if (!compatibility) {
			const probeSpinner = prompter.progress(t("wizard.customProvider.detectionProgress"));
			const detectionMessages = {
				openai: "wizard.customProvider.detectedOpenAi",
				"openai-responses": "wizard.customProvider.detectedOpenAiResponses",
				anthropic: "wizard.customProvider.detectedAnthropic"
			};
			for (const candidate of [
				"openai",
				"openai-responses",
				"anthropic"
			]) if ((await verifyCustomApiCompatibility({
				baseUrl,
				apiKey: resolvedApiKey,
				modelId,
				compatibility: candidate
			})).ok) {
				probeSpinner.stop(t(detectionMessages[candidate]));
				compatibility = candidate;
				break;
			}
			if (compatibility) break;
			probeSpinner.stop(t("wizard.customProvider.detectionFailed"));
			await prompter.note(t("wizard.customProvider.detectionFailedNote"), t("wizard.customProvider.detectionNoteTitle"));
		} else {
			const verifySpinner = prompter.progress(t("wizard.customProvider.verifying"));
			const result = await verifyCustomApiCompatibility({
				baseUrl,
				apiKey: resolvedApiKey,
				modelId,
				compatibility
			});
			if (result.ok) {
				verifySpinner.stop(t("wizard.customProvider.verificationSuccessful"));
				break;
			}
			if (result.error !== void 0) verifySpinner.stop(t("wizard.customProvider.verificationFailedError", { error: formatVerificationError(result.error) }));
			else verifySpinner.stop(t("wizard.customProvider.verificationFailedStatus", { status: result.status }));
		}
		const retryChoice = await prompter.select({
			message: t("wizard.customProvider.retryChoice"),
			options: [
				{
					value: "baseUrl",
					label: t("wizard.customProvider.changeBaseUrl")
				},
				{
					value: "model",
					label: t("wizard.customProvider.changeModel")
				},
				{
					value: "both",
					label: t("wizard.customProvider.changeBaseUrlAndModel")
				}
			]
		});
		if (retryChoice === "baseUrl" || retryChoice === "both") ({baseUrl, apiKey, resolvedApiKey} = await promptBaseUrlAndKey({
			prompter,
			config,
			secretInputMode: params.secretInputMode,
			initialBaseUrl: baseUrl
		}));
		if (retryChoice === "model" || retryChoice === "both") modelId = await promptCustomApiModelId(prompter);
		if (compatibilityChoice === "unknown") compatibility = null;
	}
	const suggestedId = buildEndpointIdFromUrl(baseUrl);
	const providerIdInput = await prompter.text({
		message: t("wizard.customProvider.endpointId"),
		initialValue: suggestedId,
		placeholder: "custom",
		validate: (value) => {
			if (!normalizeEndpointId(value)) return t("wizard.customProvider.endpointIdRequired");
		}
	});
	const aliasInput = await prompter.text({
		message: t("wizard.customProvider.modelAlias"),
		placeholder: t("wizard.customProvider.modelAliasPlaceholder"),
		initialValue: "",
		validate: (value) => {
			const resolvedProvider = resolveCustomProviderId({
				config,
				baseUrl,
				providerId: providerIdInput
			});
			return resolveCustomModelAliasError({
				raw: value,
				cfg: config,
				modelRef: {
					provider: resolvedProvider.providerId,
					model: modelId
				},
				manifestPlugins,
				agentId: params.target?.agentId
			});
		}
	});
	const imageInputInference = resolveCustomModelImageInputInference(modelId);
	const supportsImageInput = imageInputInference.confidence === "known" ? imageInputInference.supportsImageInput : await prompter.confirm({
		message: t("wizard.customProvider.imageInput"),
		initialValue: imageInputInference.supportsImageInput
	});
	const result = applyCustomApiConfig({
		config,
		baseUrl,
		modelId,
		compatibility: compatibility ?? "openai",
		apiKey,
		providerId: providerIdInput,
		alias: aliasInput,
		manifestPlugins,
		supportsImageInput,
		...params.target ? { target: params.target } : {},
		...params.setAsPrimary === false ? { setAsPrimary: false } : {}
	});
	if (result.providerIdRenamedFrom) await prompter.note(t("wizard.customProvider.endpointIdRenamed", {
		from: result.providerIdRenamedFrom,
		to: result.providerId
	}), t("wizard.customProvider.endpointIdTitle"));
	runtime.log(`Prepared custom provider: ${result.providerId}/${result.modelId}`);
	return result;
}
//#endregion
export { promptCustomApiConfig as t };
