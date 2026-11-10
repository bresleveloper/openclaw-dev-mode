import { _ as LLAMA_CPP_PROVIDER_ID } from "./defaults-DX4XN2j1.mjs";
import { a as isManagedLlamaCppMediaProvider, n as LLAMA_CPP_MEDIA_MAX_CHARS, o as resolveLlamaCppMediaModels, r as LLAMA_CPP_MEDIA_MAX_TOKENS } from "./media-config-CZ7CluNV.mjs";
import { t as LLAMA_CPP_MEDIA_RECIPES } from "./media-catalog-BwFQGYtY.mjs";
import { asOptionalRecord, truncateUtf16Safe } from "openclaw/plugin-sdk/string-coerce-runtime";
import { describeImageWithModel, describeImagesWithModel, describeImagesWithModelPayloadTransform } from "openclaw/plugin-sdk/media-understanding";
//#region extensions/llama-cpp/src/media-provider.runtime.ts
async function describeLlamaCppImages(req) {
	const provider = req.cfg.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const routes = resolveLlamaCppMediaModels(provider);
	if (provider?.params?.mediaModels !== void 0 && !routes) throw new Error("The configured local media routes are incomplete. Rerun local media setup.");
	if (!routes || req.model !== routes.ocr && req.model !== routes.vision) return await describeImagesWithModel(req);
	req.signal?.throwIfAborted();
	const preparedProvider = req.preparedModelRuntime?.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const assertDirectLoopback = () => {
		if (req.provider !== "llama-cpp" || !isManagedLlamaCppMediaProvider(provider) || req.preparedModelRuntime && !isManagedLlamaCppMediaProvider(preparedProvider)) throw new Error("Managed local images require a direct loopback llama.cpp server. Remove models.providers.llama-cpp.request.proxy if explicit, and add the server address to NO_PROXY when using an environment proxy. Rerun local media setup.");
	};
	assertDirectLoopback();
	const models = [provider?.models.find((model) => model.id === req.model), ...req.preparedModelRuntime ? [preparedProvider?.models.find((model) => model.id === req.model)] : []];
	if (models.some((model) => !model?.input.includes("image"))) throw new Error("The configured local image model is unavailable. Rerun local media setup.");
	if (preparedProvider && preparedProvider.baseUrl !== provider?.baseUrl || models.some((model) => model?.baseUrl !== void 0 && model.baseUrl !== provider?.baseUrl)) throw new Error("The local image model endpoint must match the managed llama.cpp provider. Rerun local media setup.");
	const baseUrl = provider?.baseUrl;
	if (req.images.length === 0 || req.images.some((image) => image.buffer.length === 0) || req.images.reduce((total, image) => total + image.buffer.length, 0) > 10485760) throw new Error("Local image input must contain between 1 byte and 10 MiB of image data.");
	const recipe = LLAMA_CPP_MEDIA_RECIPES.find((candidate) => candidate.id === req.model);
	const task = req.model === routes.ocr ? "ocr" : "vision";
	if (!recipe || recipe.capability !== task || routes.ocr === routes.vision || task === "ocr" && !recipe.prompt?.trim()) throw new Error("The configured local media recipe is unavailable. Rerun local media setup.");
	if (models.some((model) => model?.params?.modelPath !== recipe.model.source || model?.params?.mmprojPath !== recipe.projector.source)) throw new Error("The local image model and projector must match the verified recipe artifacts. Rerun local media setup.");
	if (req.images.length !== 1) throw new Error("Managed local media accepts one image per request. Analyze images separately.");
	const maxTokens = req.maxTokens ?? 2048;
	if (!Number.isFinite(maxTokens) || maxTokens < 1) throw new Error("Local image maxTokens must be a positive finite number.");
	const prompt = recipe.capability === "ocr" ? recipe.prompt : req.prompt ?? "Describe the image.";
	const result = await describeImagesWithModelPayloadTransform({
		...req,
		prompt,
		maxTokens: Math.min(Math.floor(maxTokens), LLAMA_CPP_MEDIA_MAX_TOKENS)
	}, (payload, model) => {
		assertDirectLoopback();
		if (model.provider !== "llama-cpp" || model.id !== req.model || model.baseUrl !== baseUrl) throw new Error("The resolved local image model must match the managed llama.cpp route. Rerun local media setup.");
		const request = asOptionalRecord(payload);
		const user = (Array.isArray(request?.messages) ? request.messages : []).map(asOptionalRecord).find((message) => message?.role === "user");
		if (!request || !Array.isArray(user?.content)) throw new Error("Local media requires the OpenAI image request format.");
		return {
			...request,
			temperature: 0,
			seed: 4827,
			messages: [{
				role: "user",
				content: [...user.content, {
					type: "text",
					text: prompt
				}]
			}]
		};
	});
	req.signal?.throwIfAborted();
	return {
		...result,
		text: truncateUtf16Safe(result.text, LLAMA_CPP_MEDIA_MAX_CHARS)
	};
}
async function describeLlamaCppImage(req) {
	if ((req.cfg.models?.providers?.["llama-cpp"])?.params?.mediaModels === void 0) return await describeImageWithModel(req);
	return await describeLlamaCppImages({
		...req,
		images: [{
			buffer: req.buffer,
			fileName: req.fileName,
			mime: req.mime
		}]
	});
}
//#endregion
export { describeLlamaCppImage, describeLlamaCppImages };
