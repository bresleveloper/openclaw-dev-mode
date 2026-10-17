import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { m as readProviderJsonResponse, n as assertOkOrThrowHttpError } from "./provider-http-errors-DmewLLH7.mjs";
import { p as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-By9R9pyt.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { r as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-CtwRSse3.mjs";
import { _ as resolveProviderOperationTimeoutMs, d as postJsonRequest, f as postMultipartRequest, h as resolveProviderHttpRequestConfig, r as createProviderOperationDeadline } from "./shared-DcnGQdHV.mjs";
import { t as isProviderApiKeyConfigured } from "./provider-auth-availability-Xx9etrds.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-B-PBEJIo.mjs";
import "./provider-http-CuRGJD0L.mjs";
import { c as resolveInlineImageJsonResponseMaxBytes, s as parseOpenAiCompatibleImageResponse } from "./image-assets-DT0442If.mjs";
//#region src/image-generation/openai-compatible-image-provider.ts
/** Creates an image-generation provider backed by OpenAI-style image endpoints. */
function createOpenAiCompatibleImageGenerationProvider(options) {
	const providerConfigKey = options.providerConfigKey ?? options.id;
	const normalizeModel = options.normalizeModel ?? ((model, fallback) => normalizeOptionalString(model) ?? fallback);
	const resolveCount = options.resolveCount ?? (({ req }) => req.count ?? 1);
	return {
		id: options.id,
		label: options.label,
		defaultModel: options.defaultModel,
		...options.defaultTimeoutMs !== void 0 ? { defaultTimeoutMs: options.defaultTimeoutMs } : {},
		models: [...options.models],
		isConfigured: (ctx) => isProviderApiKeyConfigured({
			provider: options.id,
			...ctx
		}),
		capabilities: options.capabilities,
		async generateImage(req) {
			const inputImages = req.inputImages ?? [];
			const mode = inputImages.length > 0 ? "edit" : "generate";
			const operation = `${options.label} image ${mode === "edit" ? "edit" : "generation"}`;
			const maxInputImages = options.capabilities.edit.maxInputImages;
			if (mode === "edit" && !options.capabilities.edit.enabled) throw new Error(`${options.label} image editing is not supported.`);
			if (mode === "edit" && maxInputImages !== void 0 && inputImages.length > maxInputImages) throw new Error(options.tooManyInputImagesError ?? `${options.label} image editing supports up to ${maxInputImages} reference image${maxInputImages === 1 ? "" : "s"}.`);
			const auth = await resolveApiKeyForProvider({
				provider: options.id,
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error(options.missingApiKeyError ?? `${options.label} API key missing`);
			const providerConfig = req.cfg?.models?.providers?.[providerConfigKey];
			const resolvedBaseUrl = options.resolveBaseUrl?.({
				req,
				providerConfig,
				defaultBaseUrl: options.defaultBaseUrl
			}) ?? normalizeOptionalString(providerConfig?.baseUrl) ?? options.defaultBaseUrl;
			const allowPrivateNetwork = options.resolveAllowPrivateNetwork?.({
				baseUrl: resolvedBaseUrl,
				req,
				providerConfig
			});
			const { baseUrl, allowPrivateNetwork: resolvedAllowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
				baseUrl: resolvedBaseUrl,
				defaultBaseUrl: options.defaultBaseUrl,
				allowPrivateNetwork,
				request: options.useConfiguredRequest ? sanitizeConfiguredModelProviderRequest(providerConfig?.request) : void 0,
				defaultHeaders: { Authorization: `Bearer ${auth.apiKey}` },
				provider: options.id,
				capability: "image",
				transport: "http"
			});
			const model = normalizeModel(req.model, options.defaultModel);
			const count = resolveCount({
				req,
				mode
			});
			const requestParams = {
				req,
				inputImages,
				model,
				count,
				mode
			};
			const requestBody = mode === "edit" ? options.buildEditRequest({
				...requestParams,
				mode
			}) : options.buildGenerateRequest({
				...requestParams,
				mode
			});
			const timeoutMs = options.defaultTimeoutMs === void 0 ? req.timeoutMs : resolveProviderOperationTimeoutMs({
				deadline: createProviderOperationDeadline({
					timeoutMs: req.timeoutMs,
					label: options.failureLabels?.[mode] ?? operation
				}),
				defaultTimeoutMs: options.defaultTimeoutMs
			});
			const requestOptions = {
				url: `${baseUrl.replace(/\/+$/u, "")}/images/${mode === "edit" ? "edits" : "generations"}`,
				headers: new Headers(headers),
				timeoutMs,
				fetchFn: fetch,
				allowPrivateNetwork: resolvedAllowPrivateNetwork,
				ssrfPolicy: req.ssrfPolicy,
				dispatcherPolicy
			};
			if (requestBody.kind === "multipart") requestOptions.headers.delete("Content-Type");
			else requestOptions.headers.set("Content-Type", "application/json");
			const { response, release } = await (requestBody.kind === "multipart" ? postMultipartRequest({
				...requestOptions,
				body: requestBody.form
			}) : postJsonRequest({
				...requestOptions,
				body: requestBody.body
			}));
			try {
				await assertOkOrThrowHttpError(response, options.failureLabels?.[mode] ?? `${operation} failed`);
				const payload = await readProviderJsonResponse(response, `${options.id}.image-generation`, { maxBytes: resolveInlineImageJsonResponseMaxBytes(options.capabilities[mode].maxCount ?? count, resolveGeneratedMediaMaxBytes(req.cfg, "image")) });
				const images = parseOpenAiCompatibleImageResponse(payload, {
					...options.response,
					malformedResponseError: `${operation} response malformed`
				});
				if (images.length === 0) throw new Error(options.emptyResponseError ?? `${operation} response missing image data`);
				return {
					images,
					model
				};
			} finally {
				await release();
			}
		}
	};
}
//#endregion
export { createOpenAiCompatibleImageGenerationProvider as t };
