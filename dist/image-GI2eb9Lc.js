import { d as clampPositiveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { l as isSecretRef } from "./types.secrets-lIZQEgMF.js";
import { i as COPILOT_INTEGRATION_ID, s as buildCopilotIdeHeaders } from "./copilot-dynamic-headers-CF9zPORX.js";
import { r as resolveProviderRequestCapabilities } from "./provider-attribution-8gdGyO--.js";
import { a as normalizeModelRef } from "./model-selection-normalize-Df7baLev.js";
import { r as ensureOpenClawModelsJson } from "./models-config-ChaTzZG5.js";
import "./model-selection-i8V2iTdL.js";
import { o as requireApiKey } from "./model-auth-runtime-shared-D8fFlbsz.js";
import { t as complete } from "./stream-Bs1DzXcN.js";
import { a as getApiKeyForModel, d as resolveApiKeyForProvider } from "./model-auth-Bvz14MtI.js";
import { r as minimaxUnderstandImage, t as isMinimaxVlmModel } from "./minimax-vlm-Bij2Zf9G.js";
import { i as hasImageReasoningOnlyResponse, t as coerceImageAssistantText } from "./image-tool.helpers-B9E7Vmx0.js";
import { n as normalizeMediaProviderId } from "./provider-id-DSbuCFIb.js";
import { n as resolveModelAsync } from "./model-Cc001htM.js";
import { t as registerProviderStreamForModel } from "./provider-stream-BSVCqT_P.js";
import { o as resolveCopilotApiToken } from "./provider-auth-DKbeFxjY.js";
//#region src/media-understanding/image.ts
function resolveImageToolMaxTokens(modelMaxTokens, requestedMaxTokens = 4096) {
	if (typeof modelMaxTokens !== "number" || !Number.isFinite(modelMaxTokens) || modelMaxTokens <= 0) return requestedMaxTokens;
	return Math.min(requestedMaxTokens, modelMaxTokens);
}
function isRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function isNativeResponsesReasoningPayload(model) {
	if (model.api !== "openai-responses" && model.api !== "azure-openai-responses" && model.api !== "openai-chatgpt-responses") return false;
	return resolveProviderRequestCapabilities({
		provider: model.provider,
		api: model.api,
		baseUrl: model.baseUrl,
		capability: "image",
		transport: "media-understanding"
	}).usesKnownNativeOpenAIRoute;
}
function formatModelInputCapabilities(input) {
	return input && input.length > 0 ? input.join(", ") : "none";
}
function removeReasoningInclude(value) {
	if (!Array.isArray(value)) return value;
	const next = value.filter((entry) => entry !== "reasoning.encrypted_content");
	return next.length > 0 ? next : void 0;
}
function disableReasoningForImageRetryPayload(payload, model) {
	if (!isRecord(payload)) return;
	const next = { ...payload };
	delete next.reasoning;
	delete next.reasoning_effort;
	const include = removeReasoningInclude(next.include);
	if (include === void 0) delete next.include;
	else next.include = include;
	if (isNativeResponsesReasoningPayload(model)) next.reasoning = { effort: "none" };
	return next;
}
function isImageModelNoTextError(err) {
	return err instanceof Error && /^Image model returned no text\b/.test(err.message);
}
function isPromiseLike(value) {
	return Boolean(value) && typeof value.then === "function";
}
function composeImageDescriptionPayloadHandlers(first, second) {
	if (!first) return second;
	if (!second) return first;
	return (payload, payloadModel) => {
		const runSecond = (firstResult) => {
			const secondResult = second(firstResult === void 0 ? payload : firstResult, payloadModel);
			const coerceResult = (resolvedSecond) => resolvedSecond === void 0 ? firstResult : resolvedSecond;
			return isPromiseLike(secondResult) ? Promise.resolve(secondResult).then(coerceResult) : coerceResult(secondResult);
		};
		const firstResult = first(payload, payloadModel);
		if (isPromiseLike(firstResult)) return Promise.resolve(firstResult).then(runSecond);
		return runSecond(firstResult);
	};
}
async function resolveImageRuntime(params) {
	const resolvedRef = normalizeModelRef(params.provider, params.model);
	if ((await resolveModelAsync(resolvedRef.provider, resolvedRef.model, params.agentDir, params.cfg, {
		allowBundledStaticCatalogFallback: true,
		skipAgentDiscovery: true,
		skipProviderRuntimeHooks: true,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	})).model?.input?.includes("image")) {
		const normalizedResolved = await resolveModelAsync(resolvedRef.provider, resolvedRef.model, params.agentDir, params.cfg, {
			allowBundledStaticCatalogFallback: true,
			skipAgentDiscovery: true,
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
		});
		if (normalizedResolved.model?.input?.includes("image")) return await prepareResolvedImageRuntime(params, normalizedResolved.model, normalizedResolved.authStorage);
	}
	const modelsOptions = params.workspaceDir ? { workspaceDir: params.workspaceDir } : void 0;
	await ensureOpenClawModelsJson(params.cfg, params.agentDir, modelsOptions);
	const resolved = await resolveModelAsync(resolvedRef.provider, resolvedRef.model, params.agentDir, params.cfg, {
		allowBundledStaticCatalogFallback: true,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	const { authStorage } = resolved;
	const { model } = resolved;
	if (!model) throw new Error(`Unknown model: ${resolvedRef.provider}/${resolvedRef.model}`);
	if (!model.input?.includes("image")) {
		if (isMinimaxVlmModel(resolvedRef.provider, resolvedRef.model)) throw new Error(`Unknown model: ${resolvedRef.provider}/${resolvedRef.model}`);
		throw new Error(`Model does not support images: ${params.provider}/${params.model} (resolved ${model.provider}/${model.id} input: ${formatModelInputCapabilities(model.input)})`);
	}
	return await prepareResolvedImageRuntime(params, model, authStorage);
}
async function prepareResolvedImageRuntime(params, resolvedModel, authStorage) {
	let model = resolvedModel;
	let apiKey = requireApiKey(await getApiKeyForModel({
		model,
		cfg: params.cfg,
		agentDir: params.agentDir,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		profileId: params.profile,
		preferredProfile: params.preferredProfile,
		store: params.authStore
	}), model.provider);
	if (model.provider === "github-copilot") {
		const copilotToken = await resolveCopilotApiToken({ githubToken: apiKey });
		apiKey = copilotToken.token;
		const runtimeBaseUrl = copilotToken.baseUrl?.trim();
		if (runtimeBaseUrl) model = {
			...model,
			baseUrl: runtimeBaseUrl
		};
	}
	authStorage.setRuntimeApiKey(model.provider, apiKey);
	return {
		apiKey,
		model
	};
}
function buildImageContext(prompt, images, opts) {
	const imageContent = images.map((image) => ({
		type: "image",
		data: image.buffer.toString("base64"),
		mimeType: image.mime ?? "image/jpeg"
	}));
	const content = opts?.promptInUserContent ? [{
		type: "text",
		text: prompt
	}, ...imageContent] : imageContent;
	return {
		...opts?.promptInUserContent ? {} : { systemPrompt: prompt },
		messages: [{
			role: "user",
			content,
			timestamp: Date.now()
		}]
	};
}
function shouldPlaceImagePromptInUserContent(model) {
	if (model.provider === "github-copilot") return true;
	const capabilities = resolveProviderRequestCapabilities({
		provider: model.provider,
		api: model.api,
		baseUrl: model.baseUrl,
		capability: "image",
		transport: "media-understanding"
	});
	return capabilities.endpointClass === "openrouter" || capabilities.endpointClass === "modelstudio-native" || model.provider.toLowerCase() === "openrouter" && capabilities.endpointClass === "default";
}
function buildImageRequestHeaders(model) {
	if (model.provider !== "github-copilot") return;
	return {
		...buildCopilotIdeHeaders(),
		"Copilot-Integration-Id": COPILOT_INTEGRATION_ID,
		"Openai-Organization": "github-copilot",
		"x-initiator": "user",
		"Copilot-Vision-Request": "true"
	};
}
async function describeImagesWithMinimax(params) {
	const responses = [];
	for (const [index, image] of params.images.entries()) {
		const prompt = params.images.length > 1 ? `${params.prompt}\n\nDescribe image ${index + 1} of ${params.images.length} independently.` : params.prompt;
		const text = await minimaxUnderstandImage({
			apiKey: params.apiKey,
			provider: params.provider,
			prompt,
			imageDataUrl: `data:${image.mime ?? "image/jpeg"};base64,${image.buffer.toString("base64")}`,
			modelBaseUrl: params.modelBaseUrl,
			timeoutMs: params.timeoutMs
		});
		responses.push(params.images.length > 1 ? `Image ${index + 1}:\n${text.trim()}` : text.trim());
	}
	return {
		text: responses.join("\n\n").trim(),
		model: params.modelId
	};
}
function isUnknownModelError(err) {
	return err instanceof Error && /^Unknown model:/i.test(err.message);
}
function resolveConfiguredProviderBaseUrl(cfg, provider) {
	const direct = cfg.models?.providers?.[provider];
	if (typeof direct?.baseUrl === "string" && direct.baseUrl.trim()) return direct.baseUrl.trim();
	const normalizedProvider = normalizeMediaProviderId(provider);
	const normalized = cfg.models?.providers?.[normalizedProvider];
	if (typeof normalized?.baseUrl === "string" && normalized.baseUrl.trim()) {
		if (isMinimaxCnAlias(provider) && !isMinimaxCnBaseUrl(normalized.baseUrl)) return;
		return normalized.baseUrl.trim();
	}
}
function isMinimaxCnAlias(provider) {
	const normalized = provider.trim().toLowerCase();
	return normalized === "minimax-cn" || normalized === "minimax-portal-cn";
}
function isMinimaxCnBaseUrl(baseUrl) {
	const trimmed = baseUrl.trim();
	if (!trimmed) return false;
	try {
		return new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`).hostname.toLowerCase() === "api.minimaxi.com";
	} catch {
		return false;
	}
}
function hasConfiguredProviderApiKey(cfg, provider) {
	const apiKey = cfg.models?.providers?.[provider]?.apiKey;
	return typeof apiKey === "string" && apiKey.trim().length > 0 || isSecretRef(apiKey);
}
function resolveMinimaxVlmAuthProvider(cfg, provider) {
	if (!isMinimaxCnAlias(provider) || hasConfiguredProviderApiKey(cfg, provider)) return provider;
	return normalizeMediaProviderId(provider);
}
async function resolveMinimaxVlmFallbackRuntime(params) {
	const authProvider = resolveMinimaxVlmAuthProvider(params.cfg, params.provider);
	return {
		apiKey: requireApiKey(await resolveApiKeyForProvider({
			provider: authProvider,
			cfg: params.cfg,
			profileId: params.profile,
			preferredProfile: params.preferredProfile,
			agentDir: params.agentDir,
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
		}), authProvider),
		modelBaseUrl: resolveConfiguredProviderBaseUrl(params.cfg, params.provider)
	};
}
function resolveImageDescriptionTimeoutMs(timeoutMs) {
	return clampPositiveTimerTimeoutMs(timeoutMs);
}
function buildImageDescriptionTimeoutError(params) {
	if (params.phase === "setup") return /* @__PURE__ */ new Error(`image description setup timed out after ${params.timeoutMs}ms before provider request started`);
	const setupDurationMs = typeof params.setupDurationMs === "number" && Number.isFinite(params.setupDurationMs) ? Math.max(0, Math.floor(params.setupDurationMs)) : 0;
	return /* @__PURE__ */ new Error(setupDurationMs > 0 ? `image description request timed out after ${params.timeoutMs}ms (setup took ${setupDurationMs}ms before provider request started)` : `image description request timed out after ${params.timeoutMs}ms`);
}
async function withImageDescriptionTimeout(params) {
	if (params.timeoutMs === void 0) return await params.task;
	let timeout;
	try {
		return await Promise.race([params.task, new Promise((_, reject) => {
			timeout = setTimeout(() => {
				params.controller.abort();
				reject(params.createTimeoutError(params.timeoutMs));
			}, params.timeoutMs);
		})]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
async function describeImagesWithModelInternal(params, options = {}) {
	const prompt = params.prompt ?? "Describe the image.";
	const startedAtMs = Date.now();
	const controller = new AbortController();
	const configuredTimeoutMs = resolveImageDescriptionTimeoutMs(params.timeoutMs);
	let apiKey;
	let model;
	try {
		const resolved = await withImageDescriptionTimeout({
			controller,
			timeoutMs: configuredTimeoutMs,
			createTimeoutError: (timeoutMs) => buildImageDescriptionTimeoutError({
				phase: "setup",
				timeoutMs
			}),
			task: resolveImageRuntime(params)
		});
		apiKey = resolved.apiKey;
		model = resolved.model;
	} catch (err) {
		if (!isMinimaxVlmModel(params.provider, params.model) || !isUnknownModelError(err)) throw err;
		const fallback = await withImageDescriptionTimeout({
			controller,
			timeoutMs: configuredTimeoutMs,
			createTimeoutError: (timeoutMs) => buildImageDescriptionTimeoutError({
				phase: "setup",
				timeoutMs
			}),
			task: resolveMinimaxVlmFallbackRuntime(params)
		});
		return await describeImagesWithMinimax({
			apiKey: fallback.apiKey,
			provider: params.provider,
			modelId: params.model,
			modelBaseUrl: fallback.modelBaseUrl,
			prompt,
			timeoutMs: params.timeoutMs,
			images: params.images
		});
	}
	const setupDurationMs = Date.now() - startedAtMs;
	if (isMinimaxVlmModel(model.provider, model.id)) return await describeImagesWithMinimax({
		apiKey,
		provider: model.provider,
		modelId: model.id,
		modelBaseUrl: model.baseUrl,
		prompt,
		timeoutMs: params.timeoutMs,
		images: params.images
	});
	const providerStreamFn = registerProviderStreamForModel({
		model,
		cfg: params.cfg,
		agentDir: params.agentDir,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	const context = buildImageContext(prompt, params.images, { promptInUserContent: shouldPlaceImagePromptInUserContent(model) });
	const maxTokens = resolveImageToolMaxTokens(model.maxTokens, params.maxTokens);
	const completeImage = async (onPayload) => {
		const payloadHandler = composeImageDescriptionPayloadHandlers(onPayload, options.onPayload);
		const timeoutMs = configuredTimeoutMs;
		const headers = buildImageRequestHeaders(model);
		const streamOptions = {
			apiKey,
			maxTokens,
			signal: controller.signal,
			...timeoutMs !== void 0 ? { timeoutMs } : {},
			...headers ? { headers } : {},
			...payloadHandler ? { onPayload: payloadHandler } : {}
		};
		return await withImageDescriptionTimeout({
			controller,
			timeoutMs,
			createTimeoutError: (requestTimeoutMs) => buildImageDescriptionTimeoutError({
				phase: "request",
				timeoutMs: requestTimeoutMs,
				setupDurationMs
			}),
			task: providerStreamFn ? (async () => await (await providerStreamFn(model, context, streamOptions)).result())() : complete(model, context, streamOptions)
		});
	};
	const message = await completeImage();
	try {
		return {
			text: coerceImageAssistantText({
				message,
				provider: model.provider,
				model: model.id
			}),
			model: model.id
		};
	} catch (err) {
		if (!isImageModelNoTextError(err) || !hasImageReasoningOnlyResponse(message)) throw err;
	}
	return {
		text: coerceImageAssistantText({
			message: await completeImage(disableReasoningForImageRetryPayload),
			provider: model.provider,
			model: model.id
		}),
		model: model.id
	};
}
function toImagesDescriptionRequest(params) {
	return {
		images: [{
			buffer: params.buffer,
			fileName: params.fileName,
			mime: params.mime
		}],
		model: params.model,
		provider: params.provider,
		prompt: params.prompt,
		maxTokens: params.maxTokens,
		timeoutMs: params.timeoutMs,
		profile: params.profile,
		preferredProfile: params.preferredProfile,
		authStore: params.authStore,
		agentDir: params.agentDir,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		cfg: params.cfg
	};
}
async function describeImagesWithModel(params) {
	return await describeImagesWithModelInternal(params);
}
async function describeImagesWithModelPayloadTransform(params, onPayload) {
	return await describeImagesWithModelInternal(params, { onPayload });
}
async function describeImageWithModel(params) {
	return await describeImagesWithModel(toImagesDescriptionRequest(params));
}
async function describeImageWithModelPayloadTransform(params, onPayload) {
	return await describeImagesWithModelPayloadTransform(toImagesDescriptionRequest(params), onPayload);
}
//#endregion
export { describeImageWithModel, describeImageWithModelPayloadTransform, describeImagesWithModel, describeImagesWithModelPayloadTransform };
