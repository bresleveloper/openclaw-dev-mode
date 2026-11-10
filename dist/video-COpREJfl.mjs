import { x as parseStrictFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { d as normalizeMimeType, r as extensionForMime } from "./mime-C3j3dfQb.mjs";
import { t as createEnumOptionParser } from "./enum-option-DV0QWV-O.mjs";
import { i as formatEnvelopeForText, n as runCapabilityCommand, t as registerLocalProvidersCommand } from "./providers-command-BKm6xsdL.mjs";
import { t as registerMediaUnderstandingCommand } from "./media-understanding-command-CVDYGREl.mjs";
import { createWriteStream } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline as pipeline$1 } from "node:stream/promises";
//#region src/cli/capability-cli/video.ts
const GENERATED_VIDEO_DOWNLOAD_TIMEOUT_MS = 12e4;
const parseVideoOption = createEnumOptionParser();
const VIDEO_RESOLUTIONS = [
	"360P",
	"480P",
	"540P",
	"720P",
	"768P",
	"1080P"
];
async function fetchGeneratedVideoDownload(params) {
	const { assertOkOrThrowHttpError, assertProviderBinaryResponseContent } = await import("./provider-http-errors-a-cfZLrk.mjs");
	const { fetchWithTimeoutGuarded, resolveProviderHttpRequestConfig, sanitizeConfiguredModelProviderRequest } = await import("./plugin-sdk/provider-http.js");
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
function registerVideoCapabilityCommands(capability) {
	const videoCommand = capability.command("video").description("Video generation and description").option("--agent <id>", "Agent whose model and auth state should be used");
	videoCommand.command("generate").description("Generate video").requiredOption("--prompt <text>", "Prompt text").option("--model <provider/model>", "Model override").option("--size <size>", "Size hint like 1280x720").option("--aspect-ratio <ratio>", "Aspect ratio hint like 16:9").option("--resolution <value>", "Resolution hint: 360P, 480P, 540P, 720P, 768P, or 1080P").option("--duration <seconds>", "Target duration in seconds").option("--audio", "Enable generated audio when supported").option("--watermark", "Request provider watermark when supported").option("--timeout-ms <ms>", "Provider request timeout in milliseconds").option("--output <path>", "Output path").option("--agent <id>", "Agent whose saved provider auth is used (default: agents.defaults.systemAgent.agentId, then the sole agent)").option("--json", "Output JSON", false).action((opts, command) => runCapabilityCommand(opts.json, formatEnvelopeForText, async () => {
		const { parseOptionalTimeoutMs, resolveCapabilityAgentOption, requireProviderModelOverride, resolveLocalCapabilityAgent } = await import("./shared-44vrfXju.mjs");
		const prompt = String(opts.prompt);
		const agent = resolveCapabilityAgentOption(command, opts.agent);
		const model = opts.model;
		const output = opts.output;
		const resolution = parseVideoOption(opts.resolution, VIDEO_RESOLUTIONS, "video resolution");
		const durationSeconds = parseStrictFiniteNumber(opts.duration);
		if (opts.duration !== void 0 && durationSeconds === void 0) throw new Error("--duration must be a finite number");
		const timeoutMs = parseOptionalTimeoutMs(opts.timeoutMs);
		const { getModelsCommandSecretTargetIds } = await import("./command-secret-targets-BF6Ekt_4.mjs");
		const { generateVideo } = await import("./runtime-BbxFCquo.mjs");
		const { readResponseWithLimit } = await import("./http-body-B6KNWK-f.mjs");
		const { resolveGeneratedMediaMaxBytes } = await import("./configured-max-bytes-C3bpFIkW.mjs");
		const { publishOutputFileAtomically, writeOutputAsset } = await import("./media-output-D6yxaqWv.mjs");
		requireProviderModelOverride(model);
		const { cfg, agentDir } = await resolveLocalCapabilityAgent({
			commandName: "infer video.generate",
			targetIds: getModelsCommandSecretTargetIds(),
			agent
		});
		const result = await generateVideo({
			cfg,
			agentDir,
			prompt,
			modelOverride: model,
			size: opts.size,
			aspectRatio: opts.aspectRatio,
			resolution,
			durationSeconds,
			audio: opts.audio === true ? true : void 0,
			watermark: opts.watermark === true ? true : void 0,
			timeoutMs
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
					if (output && response.body) {
						const mimeType = normalizeMimeType(video.mimeType);
						const ext = extensionForMime(mimeType) || path.extname(video.fileName ?? "") || path.extname(output);
						const resolvedOutput = path.resolve(output);
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
			return await writeOutputAsset({
				buffer: videoBuffer,
				mimeType: video.mimeType,
				originalFilename: video.fileName,
				outputPath: output,
				outputIndex: index,
				outputCount: result.videos.length,
				subdir: "generated"
			});
		}));
		return {
			ok: true,
			capability: "video.generate",
			transport: "local",
			provider: result.provider,
			model: result.model,
			attempts: result.attempts,
			outputs,
			ignoredOverrides: result.ignoredOverrides
		};
	}));
	registerMediaUnderstandingCommand(videoCommand, "video");
	registerLocalProvidersCommand(videoCommand, "List video generation and description providers", async (cfg, agentId) => {
		const { listGenerationProviders, listUnderstandingProviders } = await import("./media-providers-73FLDzW2.mjs");
		return {
			generation: await listGenerationProviders("video", cfg, agentId),
			description: await listUnderstandingProviders("video", cfg, agentId)
		};
	});
}
//#endregion
export { registerVideoCapabilityCommands };
