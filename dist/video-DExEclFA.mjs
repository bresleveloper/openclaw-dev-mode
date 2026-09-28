import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { i as readResponseWithLimit } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { i as assertProviderBinaryResponseContent, n as assertOkOrThrowHttpError } from "./provider-http-errors-CTY_-ABT.mjs";
import { p as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-DOrVD029.mjs";
import { d as normalizeMimeType, r as extensionForMime } from "./mime-1zBUMwu6.mjs";
import { t as publishOutputFileAtomically } from "./output-file.runtime.js";
import { n as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-Cf0SSUBz.mjs";
import { p as resolveProviderHttpRequestConfig, s as fetchWithTimeoutGuarded } from "./shared-BLFkM12I.mjs";
import { n as buildMediaUnderstandingRegistry } from "./image-compression-policy-CMGtwQyV.mjs";
import { u as getModelsCommandSecretTargetIds } from "./command-secret-targets-Dxp8wSEx.mjs";
import { n as listRuntimeVideoGenerationProviders, t as generateVideo } from "./runtime-DQip8G-d.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import "./provider-http-Dn9NddwC.mjs";
import { i as describeVideoFile } from "./runtime-CSaGrQ8c.mjs";
import { n as formatEnvelopeForText, t as emitJsonOrText } from "./output-BaRjhBNO.mjs";
import { t as prepareLocalCapabilityAccountSecrets } from "./local-account-secrets-CGS3-wKD.mjs";
import { a as providerHasGenericConfig, c as resolveCapabilityAgentOption, f as resolveSelectedProviderFromModelRef, l as resolveCapabilityProviderAgentId, o as registerLocalProvidersCommand, r as parseOptionalTimeoutMs, s as requireProviderModelOverride, t as parseOptionalFiniteNumber, u as resolveLocalCapabilityRuntimeConfig } from "./shared-CcZCj91E.mjs";
import { n as writeOutputAsset } from "./media-output-CNqngb8c.mjs";
import { createWriteStream } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { Readable } from "node:stream";
import { pipeline as pipeline$1 } from "node:stream/promises";
//#region src/cli/capability-cli/video.ts
const GENERATED_VIDEO_DOWNLOAD_TIMEOUT_MS = 12e4;
function normalizeVideoResolution(raw) {
	const normalized = raw?.trim().toUpperCase();
	if (!normalized) return;
	if (normalized === "360P" || normalized === "480P" || normalized === "540P" || normalized === "720P" || normalized === "768P" || normalized === "1080P") return normalized;
	throw new Error("video resolution must be one of 360P, 480P, 540P, 720P, 768P, or 1080P");
}
async function fetchGeneratedVideoDownload(params) {
	const providerConfig = params.cfg.models?.providers?.[params.provider];
	const { allowPrivateNetwork, dispatcherPolicy } = resolveProviderHttpRequestConfig({
		baseUrl: params.url,
		defaultBaseUrl: params.url,
		request: sanitizeConfiguredModelProviderRequest(providerConfig?.request),
		provider: params.provider,
		capability: "video",
		transport: "http"
	});
	const result = await fetchWithTimeoutGuarded(params.url, { method: "GET" }, GENERATED_VIDEO_DOWNLOAD_TIMEOUT_MS, fetch, {
		...allowPrivateNetwork ? { ssrfPolicy: { allowPrivateNetwork: true } } : {},
		...dispatcherPolicy ? { dispatcherPolicy } : {},
		auditContext: `${params.provider}-generated-video-download`
	});
	try {
		await assertOkOrThrowHttpError(result.response, `${params.provider} generated video download failed`);
		assertProviderBinaryResponseContent(result.response, `${params.provider} generated video download`, "video");
		return result;
	} catch (error) {
		await result.release();
		throw error;
	}
}
async function runVideoGenerate(params) {
	requireProviderModelOverride(params.model);
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer video.generate",
		targetIds: getModelsCommandSecretTargetIds()
	});
	const agentId = resolveCapabilityProviderAgentId(cfg, params.agent, "infer video.generate");
	await prepareLocalCapabilityAccountSecrets({
		cfg,
		agentId
	});
	const agentDir = resolveAgentDir(cfg, agentId);
	const result = await generateVideo({
		cfg,
		agentDir,
		prompt: params.prompt,
		modelOverride: params.model,
		size: params.size,
		aspectRatio: params.aspectRatio,
		resolution: params.resolution,
		durationSeconds: params.durationSeconds,
		audio: params.audio,
		watermark: params.watermark,
		timeoutMs: params.timeoutMs
	});
	const outputs = await Promise.all(result.videos.map(async (video, index) => {
		if (!video.buffer && !video.url) throw new Error(`Video asset at index ${index} has neither buffer nor url`);
		let videoBuffer = video.buffer;
		if (!videoBuffer && video.url) {
			const download = await fetchGeneratedVideoDownload({
				cfg,
				provider: result.provider,
				url: video.url
			});
			const response = download.response;
			try {
				if (params.output && response.body) {
					const mimeType = normalizeMimeType(video.mimeType);
					const ext = extensionForMime(mimeType) || path.extname(video.fileName ?? "") || path.extname(params.output);
					const resolvedOutput = path.resolve(params.output);
					const parsed = path.parse(resolvedOutput);
					const filePath = result.videos.length <= 1 ? path.join(parsed.dir, `${parsed.name}${ext}`) : path.join(parsed.dir, `${parsed.name}-${String(index + 1)}${ext}`);
					const size = await publishOutputFileAtomically({
						filePath,
						writeTemp: async (tempPath) => {
							await pipeline$1(Readable.fromWeb(response.body), createWriteStream(tempPath, { flags: "wx" }));
							const writtenSize = (await fs$1.stat(tempPath)).size;
							if (writtenSize === 0) throw new Error("Generated media output is empty.");
							return writtenSize;
						}
					});
					return {
						path: filePath,
						mimeType: video.mimeType,
						size
					};
				}
				const videoMaxBytes = resolveGeneratedMediaMaxBytes(cfg, "video");
				videoBuffer = await readResponseWithLimit(response, videoMaxBytes, { onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`${result.provider} generated video download exceeds ${maxBytes} bytes; pass --output to stream large videos to disk`) });
				if (videoBuffer.byteLength === 0) throw new Error("Generated media output is empty.");
			} finally {
				await download.release();
			}
		}
		return { ...await writeOutputAsset({
			buffer: videoBuffer,
			mimeType: video.mimeType,
			originalFilename: video.fileName,
			outputPath: params.output,
			outputIndex: index,
			outputCount: result.videos.length,
			subdir: "generated"
		}) };
	}));
	return {
		ok: true,
		capability: "video.generate",
		transport: "local",
		provider: result.provider,
		model: result.model,
		attempts: result.attempts,
		outputs
	};
}
async function runVideoDescribe(params) {
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer video.describe",
		targetIds: getModelsCommandSecretTargetIds()
	});
	const agentId = resolveCapabilityProviderAgentId(cfg, params.agent, "infer video describe");
	await prepareLocalCapabilityAccountSecrets({
		cfg,
		agentId
	});
	const agentDir = resolveAgentDir(cfg, agentId);
	const activeModel = requireProviderModelOverride(params.model);
	const result = await describeVideoFile({
		filePath: path.resolve(params.file),
		cfg,
		agentId,
		agentDir,
		activeModel
	});
	if (!result.text) throw new Error(`No description returned for video: ${path.resolve(params.file)}`);
	return {
		ok: true,
		capability: "video.describe",
		transport: "local",
		provider: result.provider,
		model: result.model,
		attempts: [],
		outputs: [{
			path: path.resolve(params.file),
			text: result.text,
			kind: "video.description"
		}]
	};
}
function registerVideoCapabilityCommands(capability) {
	const video = capability.command("video").description("Video generation and description").option("--agent <id>", "Agent whose model and auth state should be used");
	video.command("generate").description("Generate video").requiredOption("--prompt <text>", "Prompt text").option("--model <provider/model>", "Model override").option("--size <size>", "Size hint like 1280x720").option("--aspect-ratio <ratio>", "Aspect ratio hint like 16:9").option("--resolution <value>", "Resolution hint: 360P, 480P, 540P, 720P, 768P, or 1080P").option("--duration <seconds>", "Target duration in seconds").option("--audio", "Enable generated audio when supported").option("--watermark", "Request provider watermark when supported").option("--timeout-ms <ms>", "Provider request timeout in milliseconds").option("--output <path>", "Output path").option("--agent <id>", "Agent whose saved provider auth is used (default: agents.defaults.systemAgent.agentId, then the sole agent)").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runVideoGenerate({
				prompt: String(opts.prompt),
				agent: resolveCapabilityAgentOption(command, opts.agent),
				model: opts.model,
				output: opts.output,
				size: opts.size,
				aspectRatio: opts.aspectRatio,
				resolution: normalizeVideoResolution(opts.resolution),
				durationSeconds: parseOptionalFiniteNumber(opts.duration, "--duration"),
				audio: opts.audio === true ? true : void 0,
				watermark: opts.watermark === true ? true : void 0,
				timeoutMs: parseOptionalTimeoutMs(opts.timeoutMs)
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	video.command("describe").description("Describe one video file").requiredOption("--file <path>", "Video file").option("--agent <id>", "Agent whose model and auth state should be used").option("--model <provider/model>", "Model override").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runVideoDescribe({
				file: String(opts.file),
				agent: resolveCapabilityAgentOption(command, opts.agent),
				model: opts.model
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	registerLocalProvidersCommand(video, "List video generation and description providers", (cfg, agentId) => {
		const selectedGenerationProvider = resolveSelectedProviderFromModelRef(resolveAgentModelPrimaryValue(cfg.agents?.defaults?.mediaModels?.video));
		return {
			generation: listRuntimeVideoGenerationProviders({ config: cfg }).map((provider) => ({
				available: true,
				configured: selectedGenerationProvider === provider.id || providerHasGenericConfig({
					cfg,
					providerId: provider.id,
					agentId
				}),
				selected: selectedGenerationProvider === provider.id,
				id: provider.id,
				label: provider.label,
				defaultModel: provider.defaultModel,
				models: provider.models ?? [],
				capabilities: provider.capabilities
			})),
			description: [...buildMediaUnderstandingRegistry(void 0, cfg).values()].filter((provider) => provider.capabilities?.includes("video")).map((provider) => ({
				available: true,
				configured: providerHasGenericConfig({
					cfg,
					providerId: provider.id,
					agentId
				}),
				selected: false,
				id: provider.id,
				capabilities: provider.capabilities,
				defaultModels: provider.defaultModels
			}))
		};
	}, (value) => JSON.stringify(value, null, 2));
}
//#endregion
export { registerVideoCapabilityCommands };
