import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { c as trackAsyncWork } from "./async-work-scope-CWk2dk1h.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { c as isSecretRef } from "./ref-contract-BVi3ykLT.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import { l as runPluginStreamConsumer } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import { o as normalizeModelRef } from "./model-ref-shared-BgRrSHjn.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as resolveProviderModelMaterializationAuthMode } from "./provider-model-route-auth-DkAaX3ui.mjs";
import { a as prepareProviderRuntimeAuth } from "./provider-runtime.runtime.js";
import { r as resolveProviderRequestCapabilities } from "./provider-attribution-DUtJJsHV.mjs";
import { a as getModelProviderRequestRouteFacts, o as getModelProviderRequestTransport, t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-DOrVD029.mjs";
import { V as requireApiKey } from "./loader-runtime-load-XbrcYJWd.mjs";
import { h as retainPreparedModelRuntimeSnapshotResources } from "./prepared-model-runtime.plugin-generation-CUjNdQbs.mjs";
import { i as unwrapSecretSentinelsForProviderEgress, r as unwrapModelHeaderSentinelsForProviderEgress } from "./provider-secret-egress-BkXZF4dA.mjs";
import { d as resolveProviderRuntimePluginHandle, t as attachModelProviderRuntimePluginHandle } from "./provider-hook-runtime-BGP4teSf.mjs";
import { n as getModelRegistryRuntime } from "./model-registry-DrVlc5_5.mjs";
import { n as bindModelLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import { t as resolveApiKeyForProviderCore } from "./model-auth-provider-Atb7OdLd.mjs";
import { i as getApiKeyForModelCore, r as applySecretRefHeaderSentinels } from "./model-auth-CCIBdEPk.mjs";
import "./model-selection-CaFyCMqp.mjs";
import { t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-DtKqtgJz.mjs";
import { n as normalizeMediaProviderId } from "./provider-id-DSbuCFIb.mjs";
import { r as minimaxUnderstandImage, t as isMinimaxVlmModel } from "./minimax-vlm-BRM4679h.mjs";
import { n as resolveModelAsync } from "./model-s5D17jSh.mjs";
import { r as providerUsesCredentialScopedModelMetadata } from "./credential-scoped-model-B28PygDq.mjs";
import { t as runWithAsyncWorkResources } from "./async-work-resources-CUDFzL8J.mjs";
import { t as complete } from "./stream-BDeJVJpD.mjs";
import { t as registerProviderStreamForModel } from "./provider-stream-Cqwn8U9n.mjs";
import { i as hasImageReasoningOnlyResponse, t as coerceImageAssistantText } from "./image-tool.helpers-D7t1Txko.mjs";
import { t as protectPreparedProviderRuntimeAuth } from "./provider-runtime-auth-protection-DFvzygMB.mjs";
//#region src/media-understanding/image-model-runtime.ts
const resolvedImageRuntimeContexts = /* @__PURE__ */ new WeakMap();
function getResolvedImageRuntimeContext(model) {
	return resolvedImageRuntimeContexts.get(model);
}
function bindResolvedImageRuntime(params, apiKey, model) {
	resolvedImageRuntimeContexts.set(model, {
		cfg: params.cfg,
		agentDir: params.agentDir,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	return {
		runtimeValue: apiKey,
		model
	};
}
function formatModelInputCapabilities(input) {
	return input && input.length > 0 ? input.join(", ") : "none";
}
function requireImageCapableModel(params) {
	if (!params.model) throw new Error(`Unknown model: ${params.resolvedProvider}/${params.resolvedModel}`);
	if (params.model.input?.includes("image")) return params.model;
	if (isMinimaxVlmModel(params.resolvedProvider, params.resolvedModel)) throw new Error(`Unknown model: ${params.resolvedProvider}/${params.resolvedModel}`);
	throw new Error(`Model does not support images: ${params.requestedProvider}/${params.requestedModel} (resolved ${params.model.provider}/${params.model.id} input: ${formatModelInputCapabilities(params.model.input)})`);
}
async function prepareResolvedImageRuntime(params, preparedRuntime, resolvedModel, authStorage, modelRegistry) {
	let model = resolvedModel;
	const modelRuntime = getModelRegistryRuntime(modelRegistry);
	const bindPreparedModel = (candidate) => {
		const requestModel = applySecretRefHeaderSentinels(candidate, params.cfg);
		const providerRuntimeHandle = resolveProviderRuntimePluginHandle({
			provider: requestModel.provider,
			modelId: requestModel.id,
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			env: process.env,
			pluginMetadataSnapshot: preparedRuntime.metadataSnapshot
		});
		return bindModelLlmRuntime(attachModelProviderRuntimePluginHandle(requestModel, providerRuntimeHandle), modelRuntime.llmRuntime);
	};
	const apiKeyInfo = await getApiKeyForModelCore({
		model,
		cfg: params.cfg,
		agentDir: params.agentDir,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		profileId: params.profile,
		preferredProfile: params.preferredProfile,
		store: params.authStore,
		secretSentinels: true
	});
	params.signal?.throwIfAborted();
	if (providerUsesCredentialScopedModelMetadata({
		provider: model.provider,
		modelId: model.id,
		config: params.cfg,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	})) {
		const authProfileMode = resolveProviderModelMaterializationAuthMode(apiKeyInfo.mode);
		const authoritative = await resolveModelAsync(model.provider, model.id, params.agentDir, params.cfg, {
			abortSignal: params.signal,
			modelIdSource: "selected",
			authStorage,
			modelRegistry,
			skipAgentDiscovery: true,
			allowBundledStaticCatalogFallback: true,
			preparedModelRuntime: params.preparedModelRuntime,
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
			...apiKeyInfo.profileId ? { authProfileId: apiKeyInfo.profileId } : authProfileMode ? { authProfileMode } : {}
		});
		params.signal?.throwIfAborted();
		model = requireImageCapableModel({
			model: authoritative.model,
			resolvedProvider: model.provider,
			resolvedModel: model.id,
			requestedProvider: params.provider,
			requestedModel: params.model
		});
	}
	if (!apiKeyInfo.apiKey?.trim() && apiKeyInfo.mode === "aws-sdk" && model.api === "bedrock-converse-stream") return bindResolvedImageRuntime(params, "", bindPreparedModel(model));
	let apiKey = requireApiKey(apiKeyInfo, model.provider);
	const runtimeAuth = await prepareProviderRuntimeAuth({
		provider: model.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: process.env,
		context: {
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			env: process.env,
			provider: model.provider,
			modelId: model.id,
			model,
			apiKey,
			authMode: apiKeyInfo.mode,
			profileId: apiKeyInfo.profileId
		}
	});
	params.signal?.throwIfAborted();
	const preparedAuth = protectPreparedProviderRuntimeAuth({
		provider: model.provider,
		preparedAuth: runtimeAuth
	});
	apiKey = preparedAuth?.apiKey?.trim() || apiKey;
	model = applyPreparedRuntimeAuthToModel(model, preparedAuth);
	authStorage.setRuntimeApiKey(model.provider, apiKey);
	return bindResolvedImageRuntime(params, apiKey, bindPreparedModel(model));
}
async function resolveImageRuntime(params, onAcquired) {
	const workspaceDir = params.workspaceDir ?? (params.agentId ? resolveAgentWorkspaceDir(params.cfg ?? {}, params.agentId) : void 0);
	const runtimeParams = workspaceDir ? {
		...params,
		workspaceDir
	} : params;
	const authProfileOptions = {
		...params.profile ? { authProfileId: params.profile } : {},
		...params.preferredProfile ? { preferredProfile: params.preferredProfile } : {}
	};
	const suppliedSnapshot = params.preparedModelRuntime;
	let resolvedRef = suppliedSnapshot ? normalizeModelRef(params.provider, params.model, { manifestPlugins: suppliedSnapshot.metadataSnapshot }) : {
		provider: params.provider,
		model: params.model
	};
	const suppliedClaim = suppliedSnapshot ? retainPreparedModelRuntimeSnapshotResources(suppliedSnapshot) : void 0;
	const preparedRuntimeLease = suppliedSnapshot ? {
		snapshot: suppliedSnapshot,
		async [Symbol.asyncDispose]() {
			await suppliedClaim?.release();
		}
	} : await acquireAgentRunPreparedModelRuntime({
		agentDir: params.agentDir,
		...params.agentId ? { agentId: params.agentId } : {},
		config: params.cfg ?? {},
		...runtimeParams.workspaceDir ? { workspaceDir: runtimeParams.workspaceDir } : {},
		loadRuntimePlugins: true
	}, {
		catalogMode: "static",
		abortSignal: params.signal,
		deriveRuntimePluginSelections: ({ metadataSnapshot }) => {
			resolvedRef = normalizeModelRef(params.provider, params.model, { manifestPlugins: metadataSnapshot });
			return [{
				provider: resolvedRef.provider,
				modelId: resolvedRef.model,
				...params.agentId ? { agentId: params.agentId } : {}
			}];
		}
	});
	onAcquired({
		[Symbol.asyncDispose]: () => preparedRuntimeLease[Symbol.asyncDispose](),
		...suppliedClaim ? { assertResourcesOpen: suppliedClaim.assertOpen } : {}
	});
	params.signal?.throwIfAborted();
	const preparedRuntime = preparedRuntimeLease.snapshot;
	const preparedWorkspaceDir = preparedRuntime.workspaceDir ?? runtimeParams.workspaceDir;
	const preparedParams = {
		...runtimeParams,
		agentDir: preparedRuntime.agentDir,
		cfg: preparedRuntime.config,
		preparedModelRuntime: preparedRuntime,
		...preparedWorkspaceDir ? { workspaceDir: preparedWorkspaceDir } : {}
	};
	const preparedStores = preparedRuntime.createStores();
	const resolveOptions = {
		abortSignal: params.signal,
		modelIdSource: "selected",
		allowBundledStaticCatalogFallback: true,
		...preparedStores,
		preparedModelRuntime: preparedRuntime,
		skipAgentDiscovery: true,
		...preparedParams.workspaceDir ? { workspaceDir: preparedParams.workspaceDir } : {},
		...authProfileOptions
	};
	return await withPluginRuntimeGenerationScope(preparedRuntime, async () => {
		const resolved = await resolveModelAsync(resolvedRef.provider, resolvedRef.model, preparedParams.agentDir, preparedParams.cfg, resolveOptions);
		params.signal?.throwIfAborted();
		const model = requireImageCapableModel({
			model: resolved.model,
			resolvedProvider: resolvedRef.provider,
			resolvedModel: resolvedRef.model,
			requestedProvider: params.provider,
			requestedModel: params.model
		});
		return await prepareResolvedImageRuntime(preparedParams, preparedRuntime, model, resolved.authStorage, resolved.modelRegistry);
	});
}
//#endregion
//#region src/media-understanding/image.ts
function resolveImageToolMaxTokens(modelMaxTokens, requestedMaxTokens = 4096) {
	if (typeof modelMaxTokens !== "number" || !Number.isFinite(modelMaxTokens) || modelMaxTokens <= 0) return requestedMaxTokens;
	return Math.min(requestedMaxTokens, modelMaxTokens);
}
function isNativeResponsesReasoningPayload(model) {
	if (model.api !== "openai-responses" && model.api !== "azure-openai-responses" && model.api !== "openai-chatgpt-responses") return false;
	return resolveProviderRequestCapabilities({
		provider: model.provider,
		api: model.api,
		baseUrl: model.baseUrl,
		capability: "image",
		transport: "media-understanding",
		providerMetadataOwners: getModelProviderRequestRouteFacts(model)?.providerMetadataOwners
	}).usesKnownNativeOpenAIRoute;
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
		transport: "media-understanding",
		providerMetadataOwners: getModelProviderRequestRouteFacts(model)?.providerMetadataOwners
	});
	return capabilities.endpointClass === "openrouter" || capabilities.endpointClass === "modelstudio-native" || model.provider.toLowerCase() === "openrouter" && capabilities.endpointClass === "default";
}
function buildImageRequestHeaders(model) {
	if (model.provider !== "github-copilot") return;
	return {
		"x-initiator": "user",
		"Copilot-Vision-Request": "true"
	};
}
async function describeImagesWithMinimax(params) {
	const responses = [];
	const apiKey = unwrapSecretSentinelsForProviderEgress(params.runtimeValue, "MiniMax VLM request");
	for (const [index, image] of params.images.entries()) {
		params.signal?.throwIfAborted();
		params.assertResourcesOpen?.();
		const prompt = params.images.length > 1 ? `${params.prompt}\n\nDescribe image ${index + 1} of ${params.images.length} independently.` : params.prompt;
		const text = await minimaxUnderstandImage({
			apiKey,
			provider: params.provider,
			prompt,
			imageDataUrl: `data:${image.mime ?? "image/jpeg"};base64,${image.buffer.toString("base64")}`,
			modelBaseUrl: params.modelBaseUrl,
			timeoutMs: params.timeoutMs,
			allowPrivateNetwork: params.allowPrivateNetwork,
			request: params.request,
			signal: params.signal
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
function resolveConfiguredProviderAllowPrivateNetwork(cfg, provider) {
	const direct = cfg.models?.providers?.[provider]?.request?.allowPrivateNetwork;
	if (typeof direct === "boolean") return direct;
	const normalizedProvider = normalizeMediaProviderId(provider);
	const normalized = cfg.models?.providers?.[normalizedProvider]?.request?.allowPrivateNetwork;
	if (typeof normalized === "boolean") return normalized;
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
	const auth = await resolveApiKeyForProviderCore({
		provider: authProvider,
		cfg: params.cfg,
		secretSentinels: true,
		profileId: params.profile,
		preferredProfile: params.preferredProfile,
		agentDir: params.agentDir,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	return {
		runtimeValue: requireApiKey(auth, authProvider),
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
	params.signal?.throwIfAborted();
	if (params.timeoutMs === void 0 && !params.signal) return await params.task;
	let timeout;
	let removeAbortListener;
	const races = [params.task];
	if (params.timeoutMs !== void 0) races.push(new Promise((_, reject) => {
		timeout = setTimeout(() => {
			params.controller.abort();
			reject(params.createTimeoutError(params.timeoutMs));
		}, params.timeoutMs);
	}));
	if (params.signal) races.push(new Promise((_, reject) => {
		const onAbort = () => {
			try {
				params.signal?.throwIfAborted();
			} catch (error) {
				reject(error instanceof Error ? error : new Error("image description aborted", { cause: error }));
			}
		};
		params.signal?.addEventListener("abort", onAbort, { once: true });
		removeAbortListener = () => params.signal?.removeEventListener("abort", onAbort);
		if (params.signal?.aborted) onAbort();
	}));
	try {
		return await Promise.race(races);
	} finally {
		removeAbortListener?.();
		if (timeout) clearTimeout(timeout);
	}
}
async function describeImagesWithModelInternal(params, options = {}) {
	return await runWithAsyncWorkResources(async (onAcquired) => {
		let assertResourcesOpen;
		const prompt = params.prompt ?? "Describe the image.";
		params.signal?.throwIfAborted();
		const startedAtMs = Date.now();
		const controller = new AbortController();
		const requestSignal = params.signal ? AbortSignal.any([params.signal, controller.signal]) : controller.signal;
		const configuredTimeoutMs = resolveImageDescriptionTimeoutMs(params.timeoutMs);
		const allowPrivateNetwork = resolveConfiguredProviderAllowPrivateNetwork(params.cfg, params.provider);
		let runtimeValue;
		let model;
		const resolutionTask = trackAsyncWork(() => resolveImageRuntime({
			...params,
			signal: requestSignal
		}, (resources) => {
			onAcquired({ release: async () => await resources[Symbol.asyncDispose]() });
			assertResourcesOpen = resources.assertResourcesOpen;
		}));
		try {
			const resolved = await withImageDescriptionTimeout({
				controller,
				signal: params.signal,
				timeoutMs: configuredTimeoutMs,
				createTimeoutError: (timeoutMs) => buildImageDescriptionTimeoutError({
					phase: "setup",
					timeoutMs
				}),
				task: resolutionTask
			});
			runtimeValue = resolved.runtimeValue;
			model = resolved.model;
		} catch (err) {
			params.signal?.throwIfAborted();
			if (!isMinimaxVlmModel(params.provider, params.model) || !isUnknownModelError(err)) throw err;
			const fallback = await withImageDescriptionTimeout({
				controller,
				signal: params.signal,
				timeoutMs: configuredTimeoutMs,
				createTimeoutError: (timeoutMs) => buildImageDescriptionTimeoutError({
					phase: "setup",
					timeoutMs
				}),
				task: trackAsyncWork(() => resolveMinimaxVlmFallbackRuntime(params))
			});
			return await describeImagesWithMinimax({
				assertResourcesOpen,
				runtimeValue: fallback.runtimeValue,
				provider: params.provider,
				modelId: params.model,
				modelBaseUrl: fallback.modelBaseUrl,
				prompt,
				timeoutMs: params.timeoutMs,
				images: params.images,
				allowPrivateNetwork,
				signal: params.signal
			});
		}
		const apiKey = runtimeValue;
		params.signal?.throwIfAborted();
		assertResourcesOpen?.();
		const setupDurationMs = Date.now() - startedAtMs;
		if (isMinimaxVlmModel(model.provider, model.id)) return await describeImagesWithMinimax({
			assertResourcesOpen,
			runtimeValue,
			provider: model.provider,
			modelId: model.id,
			modelBaseUrl: model.baseUrl,
			prompt,
			timeoutMs: params.timeoutMs,
			images: params.images,
			request: getModelProviderRequestTransport(model),
			signal: params.signal
		});
		const resolvedRuntimeContext = getResolvedImageRuntimeContext(model);
		const requestModel = unwrapModelHeaderSentinelsForProviderEgress(model, "image description provider request");
		const providerStreamFn = registerProviderStreamForModel({
			model: requestModel,
			cfg: resolvedRuntimeContext?.cfg ?? params.cfg,
			agentDir: resolvedRuntimeContext?.agentDir ?? params.agentDir,
			wrapProviderStream: true,
			...resolvedRuntimeContext?.workspaceDir ? { workspaceDir: resolvedRuntimeContext.workspaceDir } : params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
		});
		const context = buildImageContext(prompt, params.images, { promptInUserContent: shouldPlaceImagePromptInUserContent(model) });
		const maxTokens = resolveImageToolMaxTokens(model.maxTokens, params.maxTokens);
		const completeImage = async (onPayload) => {
			params.signal?.throwIfAborted();
			assertResourcesOpen?.();
			const payloadHandler = composeImageDescriptionPayloadHandlers(onPayload, options.onPayload);
			const timeoutMs = configuredTimeoutMs;
			const headers = buildImageRequestHeaders(requestModel);
			const streamOptions = {
				apiKey,
				maxTokens,
				signal: requestSignal,
				...timeoutMs !== void 0 ? { timeoutMs } : {},
				...headers ? { headers } : {},
				...payloadHandler ? { onPayload: payloadHandler } : {}
			};
			const task = trackAsyncWork(() => {
				if (!providerStreamFn) return complete(requestModel, context, streamOptions, assertResourcesOpen);
				const stream = providerStreamFn(requestModel, context, streamOptions);
				return runPluginStreamConsumer(stream, async () => await (await stream).result());
			});
			return await withImageDescriptionTimeout({
				controller,
				signal: params.signal,
				timeoutMs,
				createTimeoutError: (requestTimeoutMs) => buildImageDescriptionTimeoutError({
					phase: "request",
					timeoutMs: requestTimeoutMs,
					setupDurationMs
				}),
				task
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
		params.signal?.throwIfAborted();
		const retryMessage = await completeImage(disableReasoningForImageRetryPayload);
		return {
			text: coerceImageAssistantText({
				message: retryMessage,
				provider: model.provider,
				model: model.id
			}),
			model: model.id
		};
	});
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
		...params.signal ? { signal: params.signal } : {},
		profile: params.profile,
		preferredProfile: params.preferredProfile,
		authStore: params.authStore,
		...params.agentId ? { agentId: params.agentId } : {},
		agentDir: params.agentDir,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		...params.preparedModelRuntime ? { preparedModelRuntime: params.preparedModelRuntime } : {},
		cfg: params.cfg
	};
}
async function describeImagesWithModelCore(params) {
	return await describeImagesWithModelInternal(params);
}
async function describeImagesWithModelPayloadTransformCore(params, onPayload) {
	return await describeImagesWithModelInternal(params, { onPayload });
}
async function describeImageWithModelCore(params) {
	return await describeImagesWithModelCore(toImagesDescriptionRequest(params));
}
async function describeImageWithModelPayloadTransformCore(params, onPayload) {
	return await describeImagesWithModelPayloadTransformCore(toImagesDescriptionRequest(params), onPayload);
}
//#endregion
export { describeImageWithModelCore, describeImageWithModelPayloadTransformCore, describeImagesWithModelCore, describeImagesWithModelPayloadTransformCore };
