import { C as resolveLegacyLlamaCppModelCacheDir, D as resolveLlamaCppModelSource, E as resolveLlamaCppModelCacheDir, T as resolveLlamaCppEmbeddingModel, _ as LLAMA_CPP_PROVIDER_ID, b as buildLlamaCppProviderConfig, l as DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE, x as resolveCachedLlamaCppModelPath } from "./defaults-DX4XN2j1.mjs";
import { o as resolveLlamaCppMediaModels } from "./media-config-CZ7CluNV.mjs";
import { c as formatLlamaCppMemory, i as recommendLlamaCppModel, m as selectLlamaServerAsset, o as resolveLlamaCppModelCandidates, p as resolveManagedLlamaServerPaths, s as detectLlamaCppHardware } from "./media-catalog-BwFQGYtY.mjs";
import { ensureLlamaCppModel, n as UnsupportedLlamaServerHostError, prepareManagedLlamaServer, r as ensureLlamaServerInstalled, resolveLlamaCppModelDownloadSize } from "./managed-server-Bjr1c5yX.mjs";
import { n as buildLlamaCppAuthProfileRemovalPatch } from "./auth-config-Dx2WDi-G.mjs";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { listAgentIds, resolveAgentConfig } from "openclaw/plugin-sdk/agent-scope-runtime";
import { mergeDeep } from "openclaw/plugin-sdk/plugin-config-runtime";
//#region extensions/llama-cpp/src/setup.ts
const BYTES_PER_GB = 1e9;
const BYTES_PER_MB = 1e6;
function formatDownloadProgress(label, params) {
	const downloadedSize = Math.max(0, params.downloadedSize);
	const totalSize = Math.max(1, params.totalSize);
	return `Downloading ${label}… ${Math.min(100, Math.floor(downloadedSize / totalSize * 100))}% (${(downloadedSize / BYTES_PER_GB).toFixed(1)}/${(totalSize / BYTES_PER_GB).toFixed(1)} GB, ${Math.max(0, Math.round(params.bytesPerSecond / BYTES_PER_MB))} MB/s)`;
}
function describeEmbeddingDownload(isDefault) {
	return isDefault ? "the local embedding model (about 0.3 GB)" : "your configured local embedding model";
}
async function configuredCandidates(config) {
	const provider = config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (!provider?.localService) return [];
	const mediaModels = resolveLlamaCppMediaModels(provider);
	const candidates = provider.models.filter((model) => model.id !== mediaModels?.ocr && model.id !== mediaModels?.vision).map((model) => ({
		model,
		provider
	}));
	if (candidates.length < 2) return candidates;
	const { resolveDefaultModelForAgent } = await import("openclaw/plugin-sdk/agent-runtime");
	const primary = resolveDefaultModelForAgent({
		cfg: config,
		allowManifestNormalization: false,
		allowPluginNormalization: false
	});
	const primaryId = primary.provider === "llama-cpp" ? primary.model : void 0;
	return candidates.toSorted((a, b) => Number(b.model.id === primaryId) - Number(a.model.id === primaryId));
}
async function isFile(filePath) {
	return await fs.stat(filePath).then((stat) => stat.isFile()).catch(() => false);
}
async function resolveCachedArtifact(source, cacheDir, signal) {
	return await ensureLlamaCppModel({
		source,
		cacheDir,
		download: false,
		signal
	}).catch(() => {
		signal?.throwIfAborted();
	});
}
async function resolveCachedCandidate(candidate, signal) {
	const source = resolveLlamaCppModelSource(candidate.model);
	const resolved = resolveCachedLlamaCppModelPath(candidate);
	if (resolved && await isFile(resolved)) return resolved;
	if (candidate.model.id === "gemma-4-e4b-it-q4_k_m") {
		const legacy = path.join(resolveLegacyLlamaCppModelCacheDir(), DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE);
		if (await isFile(legacy)) return legacy;
	}
	if (/^(?:hf|huggingface|https):/iu.test(source)) return await resolveCachedArtifact(source, resolveLlamaCppModelCacheDir(candidate.provider), signal);
}
function buildSetupResult(params) {
	const existing = params.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const switchingFromExternal = Boolean(existing && !existing.localService);
	return {
		profiles: [],
		...params.defaultModel ? { defaultModel: params.defaultModel } : {},
		configPatch: {
			...buildLlamaCppAuthProfileRemovalPatch(params.config),
			models: {
				mode: params.config.models?.mode ?? "merge",
				providers: { [LLAMA_CPP_PROVIDER_ID]: buildLlamaCppProviderConfig({
					existing: switchingFromExternal ? void 0 : existing,
					managed: params.managed,
					modelInventory: params.plan === "embedding-only" ? existing?.models ?? [] : params.model ? [params.model, ...existing?.localService ? existing.models.filter((model) => model.id !== params.model?.id) : []] : existing?.models
				}) }
			}
		}
	};
}
async function detectLlamaCppSetup(ctx) {
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const command = existing?.localService?.command;
	const presetPath = existing?.localService?.args?.find((_, index, args) => args[index - 1] === "--models-preset");
	if (!command || !path.isAbsolute(command) || !await isFile(command) || !presetPath || !await isFile(presetPath)) return null;
	for (const candidate of await configuredCandidates(ctx.config)) if (await resolveCachedCandidate(candidate, ctx.signal)) return {
		modelRef: `${LLAMA_CPP_PROVIDER_ID}/${candidate.model.id}`,
		detail: "Managed llama.cpp server ready"
	};
	return null;
}
async function prepareLlamaCppSetup(ctx) {
	const detected = await detectLlamaCppSetup(ctx);
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (detected?.modelRef !== ctx.modelRef || !existing?.localService?.command) return null;
	const baseUrl = existing.baseUrl?.replace(/\/+$/u, "") ?? "";
	const rootUrl = baseUrl.replace(/\/v1$/u, "");
	return buildSetupResult({
		config: ctx.config,
		plan: "chat",
		defaultModel: ctx.modelRef,
		managed: {
			command: existing.localService.command,
			baseUrl,
			healthUrl: existing.localService.healthUrl ?? `${rootUrl}/health`,
			args: existing.localService.args ?? []
		}
	});
}
function resolveEmbeddingSetup(config, cacheDir) {
	const defaults = config.memory?.search;
	const models = listAgentIds(config).flatMap((agentId) => {
		const override = resolveAgentConfig(config, agentId)?.memory?.search;
		if (!(override?.enabled ?? defaults?.enabled ?? true) || (override?.provider ?? defaults?.provider) !== "local") return [];
		return [resolveLlamaCppEmbeddingModel({
			modelPath: override?.local?.modelPath ?? defaults?.local?.modelPath,
			modelCacheDir: cacheDir
		})];
	});
	const model = models[0] ?? resolveLlamaCppEmbeddingModel({ modelCacheDir: cacheDir });
	return {
		model,
		localMemoryIntent: models.length > 0,
		conflict: models.some((candidate) => candidate.source !== model.source)
	};
}
async function resolveSetupPlan(ctx, candidates, embeddingModelIsDefault, localMemoryIntent, hardware, asset, runtimeNote) {
	if (ctx.embeddingOnly) return await resolveEmbeddingOnlyPlan(ctx, candidates, localMemoryIntent);
	let candidate = candidates[0];
	const configuredPath = candidate ? await resolveCachedCandidate(candidate, ctx.signal) : void 0;
	if (candidate && configuredPath) {
		if (runtimeNote && !await ctx.prompter.confirm({
			message: `${runtimeNote} Use cached ${candidate.model.name} on Gateway host ${os.hostname()} with the verified CPU runtime?`,
			initialValue: false
		})) return;
		return {
			kind: "chat",
			candidate,
			cachedPath: configuredPath
		};
	}
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const provider = existing?.localService ? existing : buildLlamaCppProviderConfig();
	const cacheDir = resolveLlamaCppModelCacheDir(provider);
	if (candidate) {
		const source = resolveLlamaCppModelSource(candidate.model);
		let size;
		try {
			if (path.isAbsolute(source) || !/^[a-z][a-z\d+.-]*:/iu.test(source)) {
				const cachedPath = await ensureLlamaCppModel({
					source,
					cacheDir,
					download: false,
					signal: ctx.signal
				});
				return {
					kind: "chat",
					candidate,
					cachedPath
				};
			}
			size = await resolveLlamaCppModelDownloadSize(source, cacheDir, ctx.signal);
		} catch (error) {
			ctx.signal?.throwIfAborted();
			await ctx.prompter.note(`Cannot use configured model ${candidate.model.name}: ${error instanceof Error ? error.message : String(error)} Check params.modelPath and retry llama.cpp setup.`, "Setup skipped");
			return;
		}
		return await ctx.prompter.confirm({
			message: `${runtimeNote ? `${runtimeNote}\n` : ""}Download ${candidate.model.name} (${size ? `${(size / BYTES_PER_GB).toFixed(1)} GB` : "size unknown"}), ${describeEmbeddingDownload(embeddingModelIsDefault)}, and the verified ${asset.backend.toUpperCase()} runtime on Gateway host ${os.hostname()}, then use this model?`,
			initialValue: false
		}) ? {
			kind: "chat",
			candidate
		} : void 0;
	}
	const cachedModels = /* @__PURE__ */ new Map();
	for (const recipe of resolveLlamaCppModelCandidates(hardware, asset.backend).recipes) {
		const cached = await resolveCachedArtifact(resolveLlamaCppModelSource(recipe.model), cacheDir, ctx.signal);
		if (cached) {
			cachedModels.set(recipe.model.id, cached);
			break;
		}
	}
	const cachedEmbedding = embeddingModelIsDefault && Boolean(await resolveCachedArtifact("hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf", cacheDir, ctx.signal));
	const recommendation = recommendLlamaCppModel(hardware, asset.backend, {
		modelIds: new Set(cachedModels.keys()),
		embedding: cachedEmbedding,
		runtime: await isFile(resolveManagedLlamaServerPaths(asset).command)
	});
	if (recommendation.kind === "recommended") {
		const { recipe } = recommendation;
		const cachedPath = cachedModels.get(recipe.model.id);
		candidate = {
			model: recipe.model,
			provider
		};
		const recommendationSummary = [
			`Runs on Gateway host ${os.hostname()} (${hardware.platform}/${hardware.arch}), using ${asset.backend === "metal" ? "Apple Metal" : asset.backend === "cuda" ? "NVIDIA CUDA" : "the CPU"}.`,
			`${formatLlamaCppMemory(hardware.totalMemoryBytes)} RAM; ${formatLlamaCppMemory(hardware.availableDiskBytes ?? 0)} free disk.`,
			!hardware.sharedDisk ? `${formatLlamaCppMemory(hardware.availableRuntimeDiskBytes ?? 0)} free on the runtime volume.` : void 0,
			runtimeNote,
			recommendation.reason,
			!embeddingModelIsDefault ? "This estimate includes the default embedding model; your configured embedding model may need more memory and disk space." : void 0,
			"OpenClaw will check a real tool call before making this your default model."
		].filter(Boolean).join("\n");
		if (await ctx.prompter.confirm({
			message: `${recommendationSummary}\n\n${cachedPath ? `Use cached ${recipe.model.name}, download any missing embedding and ${asset.backend.toUpperCase()} runtime files, then use this model?` : `Download ${recipe.model.name} (${(recipe.sizeBytes / BYTES_PER_GB).toFixed(1)} GB), ${describeEmbeddingDownload(embeddingModelIsDefault)}, and the verified ${asset.backend.toUpperCase()} runtime, then use this model?`}`,
			initialValue: false
		})) return {
			kind: "chat",
			candidate,
			cachedPath
		};
	} else if (!localMemoryIntent) {
		await ctx.prompter.note(recommendation.reason, "Setup skipped");
		return;
	}
	const embeddingPlan = await resolveEmbeddingOnlyPlan(ctx, candidates, localMemoryIntent);
	if (embeddingPlan) {
		if (await ctx.prompter.confirm({
			message: `${runtimeNote ? `${runtimeNote} ` : ""}Install a verified ${asset.backend.toUpperCase()} llama.cpp server on Gateway host ${os.hostname()} and download only ${describeEmbeddingDownload(embeddingModelIsDefault)}? Your chat model will stay unchanged.`,
			initialValue: false
		})) return embeddingPlan;
	}
	await ctx.prompter.note("Local model setup skipped.", "Setup skipped");
}
async function resolveEmbeddingOnlyPlan(ctx, candidates, localMemoryIntent) {
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (localMemoryIntent && existing && (!existing.localService || candidates.length > 0)) {
		await ctx.prompter.note("Embedding-only setup cannot replace an existing llama.cpp server or configured llama.cpp chat routes. Move those routes to another provider, remove any existing server config, then retry llama.cpp setup.", "Setup skipped");
		return;
	}
	return localMemoryIntent ? { kind: "embedding-only" } : void 0;
}
async function runLlamaCppSetup(ctx) {
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const managedExisting = existing?.localService ? existing : void 0;
	const mediaModels = resolveLlamaCppMediaModels(managedExisting);
	const cacheDir = resolveLlamaCppModelCacheDir(managedExisting);
	const embeddingSetup = resolveEmbeddingSetup(ctx.config, cacheDir);
	if (embeddingSetup.conflict) {
		await ctx.prompter.note("Configured agents resolve to different local embedding models. Set memory.search.local.modelPath and any per-agent overrides to the same value, then retry llama.cpp setup.", "Setup skipped");
		return { profiles: [] };
	}
	const embeddingModel = embeddingSetup.model;
	const hardware = await detectLlamaCppHardware({
		cacheDir,
		signal: ctx.signal
	});
	let asset;
	let runtimeNote;
	try {
		asset = selectLlamaServerAsset(hardware.platform, hardware.arch, hardware.accelerator);
	} catch (error) {
		if (hardware.accelerator.kind !== "cuda") throw error;
		asset = selectLlamaServerAsset(hardware.platform, hardware.arch, { kind: "cpu" });
		runtimeNote = `${error instanceof Error ? error.message : String(error)} This recommendation uses CPU execution.`;
	}
	const plan = await resolveSetupPlan(ctx, await configuredCandidates(ctx.config), embeddingModel.isDefault, embeddingSetup.localMemoryIntent, hardware, asset, runtimeNote);
	if (!plan) return { profiles: [] };
	const progress = ctx.prompter.progress(`${ctx.embeddingOnly && runtimeNote ? `${runtimeNote}\n` : ""}Preparing managed llama.cpp server…`);
	try {
		await ensureLlamaServerInstalled({
			asset,
			signal: ctx.signal,
			onProgress: (status) => progress.update(formatDownloadProgress("llama.cpp runtime", status))
		});
		let chatModel;
		if (plan.kind === "chat") {
			const chatModelPath = plan.cachedPath ?? await ensureLlamaCppModel({
				source: resolveLlamaCppModelSource(plan.candidate.model),
				cacheDir,
				download: true,
				signal: ctx.signal,
				onProgress: (status) => progress.update(formatDownloadProgress(plan.candidate.model.name, status))
			});
			const configuredContext = plan.candidate.model.params?.contextSize;
			chatModel = {
				mode: "configure",
				id: plan.candidate.model.id,
				path: chatModelPath,
				contextSize: typeof configuredContext === "number" && configuredContext > 0 ? Math.floor(configuredContext) : plan.candidate.model.contextTokens,
				maxTokens: plan.candidate.model.maxTokens
			};
		} else chatModel = { mode: mediaModels ? "preserve" : "remove" };
		const embeddingModelLabel = embeddingModel.isDefault ? "EmbeddingGemma" : "configured embedding model";
		const embeddingModelPath = await ensureLlamaCppModel({
			source: embeddingModel.source,
			cacheDir,
			download: true,
			signal: ctx.signal,
			onProgress: (status) => progress.update(formatDownloadProgress(embeddingModelLabel, status))
		});
		const managed = await prepareManagedLlamaServer({
			chatModel,
			configuredChatModelIds: mediaModels ? managedExisting?.models.map((model) => model.id) : plan.kind === "chat" ? plan.candidate.provider.models.map((model) => model.id) : [],
			...mediaModels ? {
				mediaModels: [],
				modelsMax: 1,
				localService: managedExisting?.localService
			} : {},
			embeddingModelPath,
			asset,
			isolated: true,
			signal: ctx.signal,
			onProgress: (status) => progress.update(formatDownloadProgress("llama.cpp runtime", status))
		});
		ctx.signal?.throwIfAborted();
		progress.stop("Managed llama.cpp server prepared");
		return buildSetupResult({
			config: ctx.config,
			managed,
			plan: plan.kind,
			...plan.kind === "chat" ? {
				defaultModel: `${LLAMA_CPP_PROVIDER_ID}/${plan.candidate.model.id}`,
				model: plan.candidate.model
			} : {}
		});
	} catch (error) {
		progress.stop("llama.cpp setup failed");
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(error instanceof UnsupportedLlamaServerHostError ? `Managed llama.cpp setup is unavailable on this host. ${detail}` : `Managed llama.cpp setup failed. Run openclaw doctor, fix the reported runtime or model issue, then retry. ${detail}`, { cause: error });
	}
}
async function configureLlamaCppNonInteractive(ctx) {
	if (ctx.opts.llamaCppEmbeddingOnly !== true) throw new Error("Managed llama.cpp non-interactive setup requires --llama-cpp-embedding-only to consent to downloading the embedding model and verified server runtime.");
	const result = await runLlamaCppSetup({
		config: ctx.config,
		embeddingOnly: true,
		prompter: {
			async confirm() {
				throw new Error("Non-interactive embedding-only setup cannot prompt.");
			},
			async note(message) {
				throw new Error(message);
			},
			progress(label) {
				ctx.runtime.log(label);
				return {
					update: ctx.runtime.log,
					stop: ctx.runtime.log
				};
			}
		}
	});
	if (!result.configPatch) throw new Error("Set memory.search.provider to \"local\" (globally or for an enabled agent), then retry embedding-only setup.");
	return mergeDeep(ctx.config, result.configPatch, { undefinedValues: "replace" });
}
//#endregion
export { configureLlamaCppNonInteractive, detectLlamaCppSetup, prepareLlamaCppSetup, runLlamaCppSetup };
