import { E as resolveLlamaCppModelCacheDir, _ as LLAMA_CPP_PROVIDER_ID, b as buildLlamaCppProviderConfig, w as resolveLlamaCppDataDir } from "./defaults-DX4XN2j1.mjs";
import { a as isManagedLlamaCppMediaProvider, i as LLAMA_CPP_MEDIA_TIMEOUT_MS } from "./media-config-CZ7CluNV.mjs";
import { c as formatLlamaCppMemory, m as selectLlamaServerAsset, n as recommendLlamaCppMedia, p as resolveManagedLlamaServerPaths, s as detectLlamaCppHardware, t as LLAMA_CPP_MEDIA_RECIPES } from "./media-catalog-BwFQGYtY.mjs";
import { ensureLlamaCppModel, prepareManagedLlamaServer, r as ensureLlamaServerInstalled, resolveLlamaCppPresetPath, t as assertMediaPresetLimits } from "./managed-server-Bjr1c5yX.mjs";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
//#region extensions/llama-cpp/src/media-verification-fixtures.ts
const LLAMA_CPP_OCR_FIXTURE = Buffer.from("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", "base64");
const LLAMA_CPP_VISION_FIXTURE = Buffer.from("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", "base64");
//#endregion
//#region extensions/llama-cpp/src/media-setup.ts
function modelDefinition(recipe, device, baseUrl) {
	return {
		id: recipe.id,
		name: recipe.name,
		api: "openai-completions",
		baseUrl,
		reasoning: false,
		input: ["text", "image"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: recipe.contextSize,
		contextTokens: recipe.contextSize,
		maxTokens: recipe.maxTokens,
		params: {
			modelPath: recipe.model.source,
			mmprojPath: recipe.projector.source,
			contextSize: recipe.contextSize,
			imageMaxTokens: recipe.imageMaxTokens,
			device
		},
		compat: {
			supportsTools: false,
			supportsUsageInStreaming: true
		}
	};
}
async function runLlamaCppMediaSetup(ctx, mediaProvider) {
	ctx.signal?.throwIfAborted();
	if (ctx.credentialOnly) throw new Error("Local media setup installs and activates image routes. Run models auth login without --credential-only to complete setup.");
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (existing && (!isManagedLlamaCppMediaProvider(existing) || !resolveLlamaCppPresetPath(existing.localService))) throw new Error("Local media setup requires a managed llama.cpp router with a direct loopback endpoint and no explicit proxy. Add the server address to NO_PROXY when using an environment proxy. Your existing server is unchanged; configure managed server ownership first.");
	const previousMedia = ctx.config.tools?.media;
	if (previousMedia?.models?.some((entry) => !entry.capabilities?.length)) throw new Error("Add explicit capabilities to your existing tools.media.models entries before local media setup, so audio/video routes can be preserved without a remote image fallback.");
	if (!mediaProvider.describeImage) throw new Error("The llama.cpp image provider is unavailable. Enable the llama-cpp plugin and retry.");
	const cacheDir = resolveLlamaCppModelCacheDir(existing);
	const hardware = await detectLlamaCppHardware({
		cacheDir,
		signal: ctx.signal
	});
	if (hardware.platform !== "linux" || hardware.arch !== "x64") {
		await ctx.prompter.note(`Automatic local OCR and vision setup currently supports Linux x64 with CPU execution only; this Gateway is ${hardware.platform}/${hardware.arch}. Use this command on a Linux x64 Gateway, or configure another image provider. Existing llama.cpp chat and embedding setup is unchanged.`, "Local media unavailable");
		return { profiles: [] };
	}
	const asset = selectLlamaServerAsset(hardware.platform, hardware.arch, { kind: "cpu" });
	const degraded = hardware.accelerator.kind === "cpu" ? void 0 : "Initial local media support uses CPU execution even when an accelerator is detected.";
	const cached = /* @__PURE__ */ new Map();
	for (const recipe of LLAMA_CPP_MEDIA_RECIPES) for (const artifact of [recipe.model, recipe.projector]) {
		const file = await ensureLlamaCppModel({
			source: artifact.source,
			cacheDir,
			download: false,
			signal: ctx.signal
		}).catch(() => {
			ctx.signal?.throwIfAborted();
		});
		if (file) cached.set(artifact.expectedSha256, file);
	}
	const runtimeCached = await fs.stat(resolveManagedLlamaServerPaths(asset).command).then((stat) => stat.isFile()).catch(() => false);
	const recommendation = recommendLlamaCppMedia(hardware, {
		artifactSha256: new Set(cached.keys()),
		runtime: runtimeCached
	});
	if (recommendation.kind === "unavailable") {
		await ctx.prompter.note(recommendation.reason, "Local media unavailable");
		return { profiles: [] };
	}
	const recipes = [recommendation.ocr, recommendation.vision];
	assertMediaPresetLimits(existing?.localService?.args ?? [], recipes);
	const artifacts = [...new Map(recipes.flatMap((recipe) => [recipe.model, recipe.projector]).map((artifact) => [artifact.expectedSha256, artifact])).values()];
	const runtimeBytes = asset.sizeBytes ?? 0;
	const downloads = artifacts.filter((artifact) => !cached.has(artifact.expectedSha256));
	const consent = await ctx.prompter.confirm({
		initialValue: false,
		message: [
			`Gateway host: ${os.hostname()} (${hardware.platform}/${hardware.arch})`,
			`Backend: ${asset.backend.toUpperCase()}`,
			degraded ?? (hardware.accelerator.kind === "cpu" ? hardware.accelerator.reason : void 0),
			`RAM: ${formatLlamaCppMemory(hardware.totalMemoryBytes)} total, ${formatLlamaCppMemory(hardware.availableMemoryBytes)} available.`,
			`Disk: ${formatLlamaCppMemory(hardware.availableDiskBytes ?? 0)} model volume; ${formatLlamaCppMemory(hardware.availableRuntimeDiskBytes ?? 0)} runtime volume (${hardware.sharedDisk ? "shared budget" : "separate budgets"}).`,
			recommendation.reason,
			...recipes.flatMap((recipe) => [`${recipe.capability.toUpperCase()}: ${recipe.name}`, ...recipe.limitations]),
			...artifacts.map((artifact) => `${artifact.filename}: ${formatLlamaCppMemory(artifact.expectedSize)}${cached.has(artifact.expectedSha256) ? " (verified cache)" : " download"}`),
			`llama.cpp runtime: ${runtimeBytes.toLocaleString()} bytes${runtimeCached ? " (cached; version will be verified)" : " download"}.`,
			`Total download: ${formatLlamaCppMemory(downloads.reduce((total, artifact) => total + artifact.expectedSize, 0) + (runtimeCached ? 0 : runtimeBytes))}; required free disk including runtime staging: ${formatLlamaCppMemory(recommendation.requiredDiskBytes)}.`,
			"Load one model at a time; switching between chat, embeddings, OCR and vision may add latency. Existing chat defaults, inventory and embeddings are preserved.",
			"Replace image-understanding routes and the image tool default with local vision, without remote fallbacks. OCR is selected explicitly with local_image task=ocr; ambiguous tasks use vision.",
			"These image inference routes stay local. Original images remain available; an existing cloud chat model can still receive them under its normal native-vision policy.",
			"Download, verify real OCR and spatial image understanding, then activate?"
		].filter(Boolean).join("\n")
	});
	ctx.signal?.throwIfAborted();
	if (!consent) return { profiles: [] };
	const progress = ctx.prompter.progress("Preparing local OCR and vision…");
	let presetPath;
	let verificationDir;
	let verified = false;
	try {
		ctx.assertCurrent?.();
		await ensureLlamaServerInstalled({
			asset,
			signal: ctx.signal
		});
		const device = "none";
		for (const artifact of artifacts) {
			ctx.assertCurrent?.();
			const file = await ensureLlamaCppModel({
				source: artifact.source,
				cacheDir,
				download: true,
				signal: ctx.signal,
				onProgress: (status) => progress.update(`${artifact.filename}: ${Math.floor(100 * status.downloadedSize / Math.max(1, status.totalSize))}%`)
			});
			cached.set(artifact.expectedSha256, file);
		}
		const mediaModels = recipes.map((recipe) => {
			const modelPath = cached.get(recipe.model.expectedSha256);
			const projectorPath = cached.get(recipe.projector.expectedSha256);
			if (!modelPath || !projectorPath) throw new Error(`Missing verified model or projector for ${recipe.name}. Retry setup.`);
			return {
				id: recipe.id,
				path: modelPath,
				projectorPath,
				contextSize: recipe.contextSize,
				maxTokens: recipe.maxTokens,
				imageMaxTokens: recipe.imageMaxTokens,
				device
			};
		});
		const managed = await prepareManagedLlamaServer({
			chatModel: { mode: "preserve" },
			mediaModels,
			configuredChatModelIds: [...existing?.models.map((model) => model.id) ?? [], ...recipes.map((recipe) => recipe.id)],
			modelsMax: 1,
			localService: existing?.localService,
			asset,
			isolated: true,
			signal: ctx.signal
		});
		presetPath = resolveLlamaCppPresetPath(managed);
		const selectedIds = new Set(recipes.map((recipe) => recipe.id));
		const provider = buildLlamaCppProviderConfig({
			existing,
			managed,
			modelInventory: [...(existing?.models ?? []).filter((model) => !selectedIds.has(model.id)), ...recipes.map((recipe) => modelDefinition(recipe, device, managed.baseUrl))]
		});
		provider.params = {
			...existing?.params,
			mediaModels: {
				ocr: recommendation.ocr.id,
				vision: recommendation.vision.id
			}
		};
		const configPatch = {
			models: {
				...ctx.config.models,
				providers: {
					...ctx.config.models?.providers,
					[LLAMA_CPP_PROVIDER_ID]: provider
				}
			},
			agents: {
				...ctx.config.agents,
				defaults: {
					...ctx.config.agents?.defaults,
					imageModel: {
						primary: `${LLAMA_CPP_PROVIDER_ID}/${recommendation.vision.id}`,
						fallbacks: []
					}
				}
			},
			tools: {
				...ctx.config.tools,
				media: {
					...previousMedia,
					models: [...(previousMedia?.models ?? []).flatMap((entry) => {
						const capabilities = entry.capabilities?.filter((capability) => capability !== "image");
						return capabilities?.length ? [{
							...entry,
							capabilities
						}] : [];
					}), {
						provider: LLAMA_CPP_PROVIDER_ID,
						model: recommendation.vision.id,
						capabilities: ["image"]
					}],
					image: {
						...previousMedia?.image,
						enabled: true,
						maxBytes: previousMedia?.image?.maxBytes ?? 10485760,
						maxChars: previousMedia?.image?.maxChars ?? 12e3,
						timeoutSeconds: previousMedia?.image?.timeoutSeconds ?? 600
					}
				}
			}
		};
		await fs.mkdir(resolveLlamaCppDataDir(), { recursive: true });
		verificationDir = await fs.mkdtemp(path.join(resolveLlamaCppDataDir(), ".media-verify-"));
		const candidateProvider = {
			...provider,
			localService: {
				...provider.localService,
				command: managed.command,
				idleStopMs: 1
			}
		};
		const candidateConfig = {
			...ctx.config,
			...configPatch,
			models: {
				...configPatch.models,
				providers: {
					...configPatch.models?.providers,
					[LLAMA_CPP_PROVIDER_ID]: candidateProvider
				}
			}
		};
		for (const task of ["ocr", "vision"]) {
			ctx.assertCurrent?.();
			ctx.signal?.throwIfAborted();
			progress.update(`Verifying real ${task.toUpperCase()} inference…`);
			const response = await mediaProvider.describeImage({
				cfg: candidateConfig,
				agentDir: verificationDir,
				provider: LLAMA_CPP_PROVIDER_ID,
				model: recommendation[task].id,
				buffer: task === "ocr" ? LLAMA_CPP_OCR_FIXTURE : LLAMA_CPP_VISION_FIXTURE,
				fileName: `${task}-verification.png`,
				mime: "image/png",
				prompt: task === "ocr" ? "Transcribe the visible text." : "Which shape is above the blue circle? Answer with its color and shape.",
				maxTokens: 64,
				timeoutMs: Math.min(LLAMA_CPP_MEDIA_TIMEOUT_MS, (previousMedia?.image?.timeoutSeconds ?? 600) * 1e3),
				signal: ctx.signal
			});
			ctx.signal?.throwIfAborted();
			if (!(task === "ocr" ? /\bOPENCLAW\s+OCR\s+4827\b/iu.test(response.text) : /\bred\s+square\b/iu.test(response.text) && !/\b(?:not|no|below)\b/iu.test(response.text))) throw new Error(`${task.toUpperCase()} inference verification failed for ${recommendation[task].name}. Existing configuration is unchanged. Retry setup or review model limitations.`);
		}
		ctx.assertCurrent?.();
		ctx.signal?.throwIfAborted();
		verified = true;
		progress.stop("Local OCR and vision verified");
		return {
			profiles: [],
			configPatch,
			notes: ["Local OCR and vision passed real image checks. Use local_image task=ocr for transcription or task=vision for visual questions. Existing chat defaults and embeddings are unchanged."]
		};
	} catch (error) {
		progress.stop("Local media setup failed; previous configuration retained");
		throw error;
	} finally {
		if (!verified && presetPath) await fs.rm(presetPath, { force: true });
		if (verificationDir) await fs.rm(verificationDir, {
			recursive: true,
			force: true
		});
	}
}
//#endregion
export { runLlamaCppMediaSetup };
