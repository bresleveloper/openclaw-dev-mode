import { C as resolveLegacyLlamaCppModelCacheDir, E as resolveLlamaCppModelCacheDir, T as resolveLlamaCppEmbeddingModel, _ as LLAMA_CPP_PROVIDER_ID, i as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL, n as DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE, v as LLAMA_CPP_PROVIDER_LABEL } from "./.setup/defaults-DX4XN2j1.mjs";
import { a as LLAMA_SERVER_DEFAULT_ORIGIN, t as provider_discovery_default } from "./.setup/provider-discovery-SxEYhgMV.mjs";
import { a as isManagedLlamaCppMediaProvider, i as LLAMA_CPP_MEDIA_TIMEOUT_MS, n as LLAMA_CPP_MEDIA_MAX_CHARS, o as resolveLlamaCppMediaModels, r as LLAMA_CPP_MEDIA_MAX_TOKENS, t as LLAMA_CPP_MEDIA_MAX_BYTES } from "./.setup/media-config-CZ7CluNV.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import path from "node:path";
import { asPositiveSafeInteger, isRecord, normalizeOptionalString, truncateUtf16Safe } from "openclaw/plugin-sdk/string-coerce-runtime";
import { buildProviderToolCompatFamilyHooks } from "openclaw/plugin-sdk/provider-tools";
import { textResult } from "openclaw/plugin-sdk/tool-results";
//#region extensions/llama-cpp/src/embedding-provider.ts
function readIdentityLocalOptions(options) {
	const local = options.local ?? {};
	const provider = options.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	return provider?.localService ? {
		...local,
		modelCacheDir: resolveLlamaCppModelCacheDir(provider)
	} : local;
}
function createCacheKeyData(model, dimensions) {
	return {
		provider: "local",
		model,
		...typeof dimensions === "number" ? { outputDimensionality: dimensions } : {}
	};
}
function resolveModelIdentity(local, dimensions) {
	const embeddingModel = resolveLlamaCppEmbeddingModel(local);
	const model = embeddingModel.isDefault ? DEFAULT_LLAMA_CPP_EMBEDDING_MODEL : embeddingModel.source;
	const aliases = /* @__PURE__ */ new Set();
	if (embeddingModel.isDefault) {
		aliases.add(path.resolve(embeddingModel.cacheDir, DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE));
		aliases.add(path.resolve(resolveLegacyLlamaCppModelCacheDir(), DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE));
		aliases.add(DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE);
		if (embeddingModel.source !== model) aliases.add(embeddingModel.source);
	}
	return {
		model,
		cacheKeyData: createCacheKeyData(model, dimensions),
		aliases: [...aliases].map((alias) => ({
			model: alias,
			cacheKeyData: createCacheKeyData(alias, dimensions)
		}))
	};
}
const llamaCppEmbeddingProviderAdapter = {
	id: "local",
	defaultModel: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL,
	transport: "local",
	formatSetupError: (error) => `Managed local embeddings are unavailable. Run \`openclaw configure\`, choose llama.cpp, and retry. ${error instanceof Error ? error.message : String(error)}`,
	resolveIndexIdentity: (options) => {
		return resolveModelIdentity(readIdentityLocalOptions(options), options.dimensions);
	},
	create: async (options) => {
		const local = readIdentityLocalOptions(options);
		const { createLlamaCppEmbeddingProvider } = await import("./.setup/embedding-provider.runtime-djNMas6G.mjs");
		return createLlamaCppEmbeddingProvider(options, resolveLlamaCppEmbeddingModel(local).source, resolveModelIdentity(local, options.dimensions));
	}
};
//#endregion
//#region extensions/llama-cpp/src/managed-provider.ts
function wrapLlamaCppStream(ctx) {
	const providerConfig = ctx.config?.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const selectedModel = ctx.model;
	if (providerConfig?.localService && !selectedModel) return;
	return async (...args) => {
		const { wrapLlamaServerStream } = await import("./.setup/stream-CSBkXmdm.mjs");
		if (providerConfig?.localService && selectedModel) {
			const { ensureManagedLlamaServerForChat } = await import("./.setup/managed-server-Bjr1c5yX.mjs");
			const signal = args[2]?.signal;
			signal?.throwIfAborted();
			await ensureManagedLlamaServerForChat({
				provider: providerConfig,
				model: selectedModel,
				...signal ? { signal } : {}
			});
			signal?.throwIfAborted();
		}
		return wrapLlamaServerStream(ctx)(...args);
	};
}
function registerLlamaCppProvider(api, mediaProvider) {
	api.registerProvider({
		...provider_discovery_default,
		auth: [
			{
				id: "local",
				label: LLAMA_CPP_PROVIDER_LABEL,
				hint: "Choose a Qwen, Gemma, or Muse model for this Gateway’s hardware and install llama.cpp",
				kind: "custom",
				wizard: {
					choiceId: LLAMA_CPP_PROVIDER_ID,
					choiceLabel: "Managed local server",
					choiceHint: "Choose a Qwen, Gemma, or Muse model for this Gateway’s hardware and install llama.cpp",
					groupId: LLAMA_CPP_PROVIDER_ID,
					groupLabel: "Local llama.cpp",
					groupHint: "Managed or external llama.cpp server",
					methodId: "local"
				},
				appGuidedSetup: {
					detect: async (ctx) => (await import("./.setup/setup-DmjzzdfH.mjs")).detectLlamaCppSetup(ctx),
					prepare: async (ctx) => (await import("./.setup/setup-DmjzzdfH.mjs")).prepareLlamaCppSetup(ctx)
				},
				run: async (ctx) => (await import("./.setup/setup-DmjzzdfH.mjs")).runLlamaCppSetup(ctx),
				runNonInteractive: async (ctx) => (await import("./.setup/setup-DmjzzdfH.mjs")).configureLlamaCppNonInteractive(ctx)
			},
			{
				id: "existing-server",
				label: "Existing llama-server",
				hint: "Connect to an existing local, private, or remote llama.cpp server",
				kind: "custom",
				wizard: {
					choiceId: "llama-cpp-existing-server",
					choiceLabel: "Existing llama-server",
					choiceHint: "Connect to a llama.cpp server managed outside OpenClaw",
					groupId: LLAMA_CPP_PROVIDER_ID,
					groupLabel: "Local llama.cpp",
					groupHint: "Managed or external llama.cpp server",
					methodId: "existing-server"
				},
				appGuidedSetup: {
					detect: async (ctx) => (await import("./.setup/setup-D9_0z5GM.mjs")).detectLlamaServerSetup(ctx),
					prepare: async (ctx) => (await import("./.setup/setup-D9_0z5GM.mjs")).prepareLlamaServerSetup(ctx)
				},
				run: async (ctx) => (await import("./.setup/setup-D9_0z5GM.mjs")).runLlamaServerSetup(ctx),
				validateNonInteractive: async (ctx) => (await import("./.setup/setup-D9_0z5GM.mjs")).validateLlamaServerNonInteractive(ctx),
				runNonInteractive: async (ctx) => (await import("./.setup/setup-D9_0z5GM.mjs")).configureLlamaServerNonInteractive(ctx)
			},
			{
				id: "local-media",
				label: "Managed local OCR and vision",
				hint: "Recommend, install and verify local image models for this Gateway",
				kind: "custom",
				run: async (ctx) => {
					const { runLlamaCppMediaSetup } = await import("./.setup/media-setup-BQ6-EW_y.mjs");
					return await runLlamaCppMediaSetup(ctx, mediaProvider);
				}
			}
		],
		prepareDynamicModel: async (ctx) => {
			if (ctx.config?.models?.providers?.["llama-cpp"]?.localService) return;
			const { prepareLlamaServerDynamicModel } = await import("./.setup/provider-DVEnxK8Q.mjs");
			return prepareLlamaServerDynamicModel(ctx);
		},
		reconcileLocalService: async (ctx) => (await import("./.setup/managed-server-Bjr1c5yX.mjs")).reconcileManagedLlamaServer(ctx),
		wrapSimpleCompletionStreamFn: wrapLlamaCppStream,
		wrapStreamFn: wrapLlamaCppStream,
		...buildProviderToolCompatFamilyHooks("llamacpp-gbnf"),
		wizard: { modelPicker: {
			label: "llama.cpp",
			hint: `Use a managed server or connect to ${LLAMA_SERVER_DEFAULT_ORIGIN}`,
			methodId: "local"
		} }
	});
}
//#endregion
//#region extensions/llama-cpp/src/media-provider.ts
/** The setup verifier and local_image tool consume this registered media entry point. */
function createLlamaCppMediaProvider() {
	return {
		id: LLAMA_CPP_PROVIDER_ID,
		capabilities: ["image"],
		describeImage: async (req) => (await import("./.setup/media-provider.runtime-MqV-UJ1m.mjs")).describeLlamaCppImage(req),
		describeImages: async (req) => (await import("./.setup/media-provider.runtime-MqV-UJ1m.mjs")).describeLlamaCppImages(req)
	};
}
//#endregion
//#region extensions/llama-cpp/src/media-tool.ts
/** Maps explicit task intent onto the same provider hook used by normal image understanding. */
function registerLlamaCppMediaTool(api, provider) {
	api.registerTool((ctx) => {
		if (ctx.sandboxed || !provider.describeImage) return null;
		const describeImage = provider.describeImage;
		const getConfig = () => ctx.getRuntimeConfig?.() ?? ctx.runtimeConfig ?? ctx.config ?? api.config;
		const configured = getConfig().models?.providers?.[LLAMA_CPP_PROVIDER_ID];
		if (!isManagedLlamaCppMediaProvider(configured) || !resolveLlamaCppMediaModels(configured)) return null;
		return {
			name: "local_image",
			label: "Local Image",
			description: "Inspect a local image with installed local models. Choose task ocr to transcribe visible text, or vision for photos, charts, diagrams, and spatial questions (default). No cloud fallback or model downloads. The original image remains available.",
			parameters: {
				type: "object",
				properties: {
					path: {
						type: "string",
						minLength: 1,
						description: "Local image path or media:// reference."
					},
					task: {
						type: "string",
						enum: ["ocr", "vision"],
						default: "vision"
					},
					prompt: {
						type: "string",
						maxLength: 8192
					}
				},
				required: ["path"],
				additionalProperties: false
			},
			async execute(_toolCallId, args, signal) {
				signal?.throwIfAborted();
				if (!isRecord(args)) throw new Error("Local image input must contain a path and optional ocr or vision task.");
				const task = args.task === void 0 ? "vision" : args.task;
				if (task !== "ocr" && task !== "vision") throw new Error("Local image task must be ocr or vision.");
				const input = normalizeOptionalString(args.path);
				if (!input) throw new Error("Local image path is required.");
				if (/^[a-z][a-z0-9+.-]*:/iu.test(input) && !input.startsWith("media://") && !/^[a-z]:[\\/]/iu.test(input)) throw new Error("Local image requires a local path or media:// reference; URLs are not accepted.");
				if (args.prompt !== void 0 && (typeof args.prompt !== "string" || args.prompt.length > 8192)) throw new Error("Local image prompt must be a string of at most 8192 characters.");
				const cfg = getConfig();
				const configuredProvider = cfg.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
				const models = resolveLlamaCppMediaModels(configuredProvider);
				if (!isManagedLlamaCppMediaProvider(configuredProvider) || !models || !ctx.agentDir) throw new Error("Run managed local media setup for this agent without an explicit llama.cpp request proxy before using local_image. When using an environment proxy, add the server address to NO_PROXY.");
				const model = configuredProvider?.models.find((entry) => entry.id === models[task]);
				if (!model?.input.includes("image")) throw new Error(`The configured local ${task} model is unavailable. Run managed local media setup again.`);
				if (model.baseUrl !== void 0 && model.baseUrl !== configuredProvider?.baseUrl) throw new Error("The local image model endpoint must match the managed llama.cpp provider. Run managed local media setup again.");
				const workspace = ctx.fsPolicy?.root ?? ctx.workspaceDir;
				const localRoots = ctx.fsPolicy?.workspaceOnly ? workspace ? [path.resolve(workspace)] : [] : (await import("openclaw/plugin-sdk/media-local-roots")).getAgentScopedMediaLocalRoots(cfg, ctx.agentId, workspace);
				const imageConfig = cfg.tools?.media?.image;
				const maxBytes = Math.min(asPositiveSafeInteger(imageConfig?.maxBytes) ?? 10485760, LLAMA_CPP_MEDIA_MAX_BYTES);
				const maxChars = Math.min(asPositiveSafeInteger(imageConfig?.maxChars) ?? 12e3, LLAMA_CPP_MEDIA_MAX_CHARS);
				const timeoutMs = Math.min(imageConfig?.timeoutSeconds === void 0 ? LLAMA_CPP_MEDIA_TIMEOUT_MS : (asPositiveSafeInteger(imageConfig.timeoutSeconds) ?? 600) * 1e3, 2147483647);
				const source = input.startsWith("media://") || input.startsWith("~") || path.isAbsolute(input) ? input : path.resolve(workspace ?? process.cwd(), input);
				signal?.throwIfAborted();
				const image = await api.runtime.media.loadWebMedia(source, {
					maxBytes,
					localRoots: [...localRoots, ...ctx.fsPolicy?.readOnlyRoots ?? []],
					...signal ? { requestInit: { signal } } : {}
				});
				signal?.throwIfAborted();
				if (image.kind !== "image") throw new Error("Local image input must be an image.");
				const result = await describeImage({
					buffer: image.buffer,
					fileName: image.fileName ?? path.basename(source),
					mime: image.contentType,
					provider: LLAMA_CPP_PROVIDER_ID,
					model: model.id,
					prompt: normalizeOptionalString(args.prompt) ?? (task === "ocr" ? "Transcribe all visible text exactly. Return only the text." : "Describe the image."),
					maxTokens: Math.min(asPositiveSafeInteger(model.maxTokens) ?? 2048, LLAMA_CPP_MEDIA_MAX_TOKENS),
					timeoutMs,
					signal,
					cfg,
					agentId: ctx.agentId,
					agentDir: ctx.agentDir,
					workspaceDir: ctx.workspaceDir
				});
				signal?.throwIfAborted();
				if (!result.text.trim()) throw new Error("The local image model returned no text. Run managed local media setup again.");
				const text = truncateUtf16Safe(result.text, maxChars);
				return textResult(text, {
					text,
					task,
					provider: LLAMA_CPP_PROVIDER_ID,
					model: result.model ?? model.id,
					path: input
				});
			}
		};
	}, { name: "local_image" });
}
//#endregion
//#region extensions/llama-cpp/index.ts
var llama_cpp_default = definePluginEntry({
	id: "llama-cpp",
	name: "llama.cpp Provider",
	description: "Managed and external llama.cpp servers for GGUF chat, embeddings and local images",
	register(api) {
		const mediaProvider = createLlamaCppMediaProvider();
		api.registerEmbeddingProvider(llamaCppEmbeddingProviderAdapter);
		api.registerMediaUnderstandingProvider(mediaProvider);
		registerLlamaCppMediaTool(api, mediaProvider);
		registerLlamaCppProvider(api, mediaProvider);
	}
});
//#endregion
export { llama_cpp_default as default };
