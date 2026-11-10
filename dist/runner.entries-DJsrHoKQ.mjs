import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./errors-DPfGDWk1.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { j as writeExternalFileWithinRoot } from "./fs-safe-6Z4UiMS4.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { u as listOfficialExternalProviderCatalogEntries } from "./official-external-plugin-catalog-B5ALUbx8.mjs";
import { o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-8hS3NARf.mjs";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-SptB0g_t.mjs";
import { d as normalizeMimeType, u as mimeTypeFromFilePath } from "./mime-C3j3dfQb.mjs";
import { n as runExec } from "./exec-Bf6uhUA7.mjs";
import { i as logVerbose, o as shouldLogVerbose } from "./globals-XVSoVbNQ.mjs";
import { i as resolveOfficialExternalPluginRepairHint } from "./official-external-plugin-repair-hints-Ue6gYZgR.mjs";
import { r as runFfmpeg } from "./ffmpeg-exec-BXxkKwWn.mjs";
import "./media-services-B_p88lUH.mjs";
import { f as readImageMetadataFromHeader } from "./image-ops-DM5GUpDi.mjs";
import { i as assertRuntimeMediaRequestSecretOwnerAvailable } from "./entry-capabilities-uCzDotfm.mjs";
import { n as DEFAULT_MAX_BYTES, o as DEFAULT_VIDEO_MAX_BASE64_BYTES, s as MIN_AUDIO_FILE_BYTES, t as CLI_OUTPUT_MAX_BUFFER } from "./defaults.constants-Cof2g8lZ.mjs";
import { n as normalizeMediaProviderId, t as normalizeMediaExecutionProviderId } from "./provider-id-BZvihdyi.mjs";
import { r as resolveEntryRunOptions, t as resolveCliModelEntry } from "./resolve-t14Gdp_w.mjs";
import { a as optimizeImageBufferForWebMedia, c as ImageOptimizationLimitError, t as effectiveImageBytesCap } from "./web-media-Dv3ATZ34.mjs";
import { t as applyTemplate } from "./templating-BukYhKrX.mjs";
import { n as MediaUnderstandingSkipError } from "./attachments-BF8uPjs6.mjs";
import { s as normalizeInputImageBuffer } from "./input-files-BWC1h4-H.mjs";
import { i as resolveRequestedLocalAudioBackend, r as recordLocalAudioBackendObservation } from "./local-audio-Bck3sHku.mjs";
import { n as getMediaUnderstandingProvider } from "./provider-registry-BXxQV3kt.mjs";
import { a as resolveProviderExecutionAuth, n as executeProviderRequest, o as resolveProviderRequestContext, t as assertMediaExecutionCurrent } from "./provider-execution-BP6sfFq6.mjs";
import { r as resolveProxyFetchFromEnv } from "./proxy-fetch-jG_wX5MX.mjs";
import { t as resolveImageCompressionModelPolicy } from "./image-compression-policy-DFZ7kHDn.mjs";
import { t as describeImageWithModel } from "./image-runtime-MRQbkRzi.mjs";
import { t as isTranscriptArtifactText } from "./transcription-text-DGY3Kmgr.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region packages/media-understanding-common/src/output-extract.ts
/** Parse the last JSON object in a noisy provider output string. */
function extractLastJsonObject(raw) {
	const trimmed = raw.trim();
	const ranges = [];
	const starts = [];
	let inString = false;
	let escaped = false;
	let preambleQuote;
	let preambleEscaped = false;
	let previousSignificant;
	let lineHasNonWhitespace = false;
	let arrayDepth = 0;
	let candidateHasContent = false;
	for (let index = 0; index < trimmed.length; index += 1) {
		const character = trimmed.charAt(index);
		if (inString) {
			if (character === "\n" || character === "\r") {
				starts.length = 0;
				inString = false;
				escaped = false;
			} else if (escaped) escaped = false;
			else if (character === "\\") escaped = true;
			else if (character === "\"") inString = false;
			continue;
		}
		if (starts.length === 0) {
			if (preambleQuote !== void 0) {
				if (character === "\n" || character === "\r") {
					preambleQuote = void 0;
					preambleEscaped = false;
				} else if (preambleEscaped) preambleEscaped = false;
				else if (character === "\\") preambleEscaped = true;
				else if (character === preambleQuote) preambleQuote = void 0;
				continue;
			}
			if (character === "\"" || character === "'" || character === "`") {
				const previous = trimmed[index - 1];
				if (previous === void 0 || /[\s:([{]/.test(previous)) {
					preambleQuote = character;
					preambleEscaped = false;
					continue;
				}
			}
			if (character === "{") {
				arrayDepth = 0;
				candidateHasContent = false;
				starts.push(index);
			}
			if (!/\s/.test(character)) {
				previousSignificant = character;
				lineHasNonWhitespace = true;
			} else if (character === "\n" || character === "\r") lineHasNonWhitespace = false;
			continue;
		}
		const hadCandidateContent = candidateHasContent;
		if (character === "\"") inString = true;
		else if (character === "{") {
			if (previousSignificant === ":" || previousSignificant === "[" || previousSignificant === "\"" || previousSignificant === "," && (lineHasNonWhitespace || arrayDepth > 0)) starts.push(index);
			else if (!lineHasNonWhitespace && !hadCandidateContent) {
				starts.length = 1;
				starts[0] = index;
				arrayDepth = 0;
				candidateHasContent = false;
			}
		} else if (character === "}" && starts.length > 0) {
			const start = starts.pop();
			if (start !== void 0 && starts.length === 0) ranges.push({
				start,
				end: index
			});
		} else if (character === "[") arrayDepth += 1;
		else if (character === "]" && arrayDepth > 0) arrayDepth -= 1;
		if (!/\s/.test(character)) {
			candidateHasContent = true;
			previousSignificant = character;
			lineHasNonWhitespace = true;
		} else if (character === "\n" || character === "\r") lineHasNonWhitespace = false;
	}
	for (const range of ranges.toReversed()) try {
		return JSON.parse(trimmed.slice(range.start, range.end + 1));
	} catch {}
	return null;
}
/** Extract Gemini CLI-style response text from the last JSON object in output. */
function extractGeminiResponse(raw) {
	const payload = extractLastJsonObject(raw);
	if (!payload || typeof payload !== "object") return null;
	const response = payload.response;
	if (typeof response !== "string") return null;
	return response.trim() || null;
}
//#endregion
//#region packages/media-understanding-common/src/video.ts
function estimateBase64Size(bytes) {
	return Math.ceil(bytes / 3) * 4;
}
function resolveVideoMaxBase64Bytes(maxBytes) {
	const expanded = estimateBase64Size(maxBytes);
	return Math.min(expanded, DEFAULT_VIDEO_MAX_BASE64_BYTES);
}
//#endregion
//#region src/media-understanding/image-input-normalize.ts
const HEIC_MIME_RE = /^image\/hei[cf](?:-sequence)?$/i;
const HEIC_EXT_RE = /\.(heic|heif)$/i;
const MEDIA_UNDERSTANDING_MAX_SOURCE_PIXELS = 4e7;
/** Normalizes image bytes before provider execution, converting HEIC/HEIF inputs to JPEG. */
async function normalizeImageDescriptionInput(params) {
	const mime = normalizeMimeType(params.mime);
	if (!(mime && HEIC_MIME_RE.test(mime)) && !HEIC_EXT_RE.test(params.fileName?.trim() ?? "")) return {
		buffer: params.buffer,
		mime: params.mime
	};
	const sourceMime = mime ?? "image/heic";
	const image = await normalizeInputImageBuffer({
		buffer: params.buffer,
		mimeType: sourceMime,
		limits: {
			allowedMimes: /* @__PURE__ */ new Set([
				sourceMime,
				"image/heic",
				"image/heif",
				"image/jpeg"
			]),
			maxBytes: params.maxBytes ?? DEFAULT_MAX_BYTES.image
		}
	});
	return {
		buffer: image.buffer,
		mime: image.mimeType
	};
}
/** Applies the selected model's image policy before bytes cross the provider boundary. */
async function optimizeImageDescriptionInput(params) {
	const maxBytes = params.maxBytes ?? DEFAULT_MAX_BYTES.image;
	const modelPolicy = await resolveImageCompressionModelPolicy(params);
	const imageCompression = {
		imageCount: 1,
		models: [modelPolicy]
	};
	const effectiveMaxBytes = effectiveImageBytesCap(maxBytes, imageCompression) ?? maxBytes;
	if (![
		modelPolicy.maxSidePx,
		modelPolicy.maxPixels,
		modelPolicy.preferredSidePx,
		modelPolicy.maxBytes
	].some((limit) => limit !== void 0 && limit > 0) || !readImageMetadataFromHeader(params.buffer)) {
		if (params.buffer.length > effectiveMaxBytes) throw new ImageOptimizationLimitError(`Image exceeds maxBytes ${effectiveMaxBytes}`, effectiveMaxBytes);
		return {
			buffer: params.buffer,
			fileName: params.fileName,
			mime: params.mime
		};
	}
	const optimized = await optimizeImageBufferForWebMedia({
		buffer: params.buffer,
		contentType: normalizeMimeType(params.mime) ?? mimeTypeFromFilePath(params.fileName) ?? params.mime,
		fileName: params.fileName,
		maxBytes,
		imageCompression,
		maxInputPixels: MEDIA_UNDERSTANDING_MAX_SOURCE_PIXELS
	});
	return {
		buffer: optimized.buffer,
		fileName: optimized.fileName ?? params.fileName,
		mime: optimized.contentType ?? params.mime
	};
}
//#endregion
//#region src/media-understanding/runner.entries.ts
function trimOutput(text, maxChars) {
	const trimmed = text.trim();
	if (!maxChars || trimmed.length <= maxChars) return trimmed;
	return truncateUtf16Safe(trimmed, maxChars).trim();
}
function extractSherpaOnnxText(raw) {
	const tryParse = (value) => {
		const trimmed = value.trim();
		const head = trimmed[0];
		if (head !== "{" && head !== "\"") return;
		try {
			const parsed = JSON.parse(trimmed);
			if (typeof parsed === "string") return tryParse(parsed);
			if (parsed && typeof parsed === "object") {
				const text = parsed.text;
				if (typeof text === "string") return text.trim();
			}
		} catch {}
	};
	const direct = tryParse(raw);
	if (direct !== void 0) return direct;
	const lines = normalizeStringEntries(raw.split("\n"));
	for (let i = lines.length - 1; i >= 0; i -= 1) {
		const parsed = tryParse(lines[i] ?? "");
		if (parsed !== void 0) return parsed;
	}
}
function commandBase(command) {
	return path.parse(command).name;
}
function findArgValue(args, keys) {
	for (const [index, arg] of args.entries()) {
		if (keys.includes(arg)) {
			const value = args[index + 1];
			if (value) return value;
		}
		for (const key of keys) {
			const prefix = `${key}=`;
			if (arg.startsWith(prefix)) {
				const value = arg.slice(prefix.length);
				if (value) return value;
			}
		}
	}
}
function resolveWhisperOutputPath(args, mediaPath) {
	const outputDir = findArgValue(args, ["--output_dir", "-o"]);
	if (!outputDir) return null;
	const outputFormat = findArgValue(args, ["--output_format", "-f"]) ?? "all";
	if (outputFormat !== "txt" && outputFormat !== "all") return null;
	return path.join(outputDir, `${path.parse(mediaPath).name}.txt`);
}
function resolveWhisperCppOutputPath(args) {
	if (!args.some((arg) => arg === "-otxt" || arg === "--output-txt")) return null;
	const outputBase = findArgValue(args, ["-of", "--output-file"]);
	if (!outputBase) return null;
	return `${outputBase}.txt`;
}
function resolveParakeetOutputPath(args, mediaPath) {
	const outputDir = findArgValue(args, ["--output-dir"]);
	const outputFormat = findArgValue(args, ["--output-format"]) ?? (process.env.PARAKEET_OUTPUT_FORMAT || "srt");
	const outputTemplate = findArgValue(args, ["--output-template"]) ?? (process.env.PARAKEET_OUTPUT_TEMPLATE || "{filename}");
	if (!outputDir || outputFormat !== "txt" && outputFormat !== "all" || outputTemplate !== "{filename}") return null;
	return path.join(outputDir, `${path.parse(mediaPath).name}.txt`);
}
async function readCliTranscriptFile(filePath) {
	try {
		return (await fs.readFile(filePath, "utf8")).trim();
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return "";
		throw error;
	}
}
async function resolveCliOutput(params) {
	const commandId = commandBase(params.command);
	const fileOutput = commandId === "whisper-cli" ? resolveWhisperCppOutputPath(params.args) : commandId === "whisper" ? resolveWhisperOutputPath(params.args, params.mediaPath) : commandId === "parakeet-mlx" ? resolveParakeetOutputPath(params.args, params.mediaPath) : null;
	if (fileOutput) return await readCliTranscriptFile(fileOutput);
	if (commandId === "gemini") {
		const response = extractGeminiResponse(params.stdout);
		if (response) return response;
	}
	if (commandId === "sherpa-onnx-offline") {
		const response = extractSherpaOnnxText(params.stdout);
		if (response !== void 0) return response;
	}
	return params.stdout.trim();
}
async function resolveCliMediaPath(params) {
	const commandId = commandBase(params.command);
	if (params.capability !== "audio" || commandId !== "whisper-cli") return params.mediaPath;
	if (normalizeLowercaseStringOrEmpty(path.extname(params.mediaPath)) === ".wav") return params.mediaPath;
	const wavPath = path.join(params.outputDir, `${path.parse(params.mediaPath).name}.wav`);
	await fs.mkdir(params.outputDir, { recursive: true });
	await writeExternalFileWithinRoot({
		rootDir: params.outputDir,
		path: path.basename(wavPath),
		write: async (outputPath) => {
			assertMediaExecutionCurrent(params.execution);
			await runFfmpeg([
				"-y",
				"-i",
				params.mediaPath,
				"-ac",
				"1",
				"-ar",
				"16000",
				"-c:a",
				"pcm_s16le",
				"-f",
				"wav",
				outputPath
			]);
		}
	});
	return wavPath;
}
function resolveProviderQuery(params) {
	const { providerId, config, entry } = params;
	const query = {};
	for (const [key, value] of Object.entries({
		...config?.providerOptions?.[providerId],
		...entry.providerOptions?.[providerId]
	})) if (value !== void 0) query[key] = value;
	if (providerId === "deepgram") for (const [input, output] of [["detectLanguage", "detect_language"], ["smartFormat", "smart_format"]]) {
		const value = query[input];
		if (value !== void 0) {
			query[output] = value;
			delete query[input];
		}
	}
	return Object.keys(query).length > 0 ? query : void 0;
}
/** Builds the normalized decision record for one provider or CLI model attempt. */
function buildModelDecision(params) {
	if (params.entryType === "cli") {
		const command = params.entry.command?.trim();
		const requestedBackend = command ? resolveRequestedLocalAudioBackend({
			command,
			args: params.entry.args ?? []
		}) : void 0;
		return {
			type: "cli",
			provider: command ?? "cli",
			model: params.entry.model ?? command,
			...requestedBackend ? { requestedBackend } : {},
			outcome: params.outcome,
			reason: params.reason
		};
	}
	const providerIdRaw = params.entry.provider?.trim();
	return {
		type: "provider",
		provider: (providerIdRaw ? normalizeMediaProviderId(providerIdRaw) : void 0) ?? providerIdRaw,
		model: params.entry.model,
		outcome: params.outcome,
		reason: params.reason
	};
}
/** Formats a compact operator-facing summary of a media-understanding decision. */
function formatDecisionSummary(decision) {
	const attachments = Array.isArray(decision.attachments) ? decision.attachments : [];
	const total = attachments.length;
	const success = attachments.filter((entry) => entry?.chosen?.outcome === "success").length;
	const chosen = attachments.find((entry) => entry?.chosen)?.chosen;
	const provider = typeof chosen?.provider === "string" ? chosen.provider.trim() : void 0;
	const model = typeof chosen?.model === "string" ? chosen.model.trim() : void 0;
	const modelLabel = provider ? model && model !== provider ? `${provider}/${model}` : provider : void 0;
	const backendLabel = chosen?.observedBackend ? ` observed=${chosen.observedBackend}` : chosen?.requestedBackend ? ` requested=${chosen.requestedBackend}` : "";
	const shortReason = summarizeDecisionReason(findDecisionReason(decision, decision.outcome === "failed" ? "failed" : void 0));
	const countLabel = total > 0 ? ` (${success}/${total})` : "";
	const viaLabel = modelLabel ? ` via ${modelLabel}${backendLabel}` : "";
	const reasonLabel = shortReason ? ` reason=${shortReason}` : "";
	return `${decision.capability}: ${decision.outcome}${countLabel}${viaLabel}${reasonLabel}`;
}
/** Returns the first non-empty attempt reason, optionally filtered by outcome. */
function findDecisionReason(decision, outcome) {
	const attachments = Array.isArray(decision.attachments) ? decision.attachments : [];
	for (const attachment of attachments) {
		const attempts = Array.isArray(attachment?.attempts) ? attachment.attempts : [];
		for (const attempt of attempts) {
			if (outcome && attempt.outcome !== outcome) continue;
			if (typeof attempt.reason !== "string" || attempt.reason.trim().length === 0) continue;
			return attempt.reason;
		}
	}
}
/** Trims provider/runtime error prefixes into a stable human-readable reason. */
function normalizeDecisionReason(reason) {
	const trimmed = typeof reason === "string" ? reason.trim() : "";
	if (!trimmed) return;
	return trimmed.replace(/^Error:\s*/i, "").trim() || void 0;
}
/** Produces the short reason token used in status and decision summary output. */
function summarizeDecisionReason(reason) {
	const normalized = normalizeDecisionReason(reason);
	if (!normalized) return;
	return normalized.split(":")[0]?.trim() || void 0;
}
function assertMinAudioSize(params) {
	if (params.size >= 1024) return;
	throw new MediaUnderstandingSkipError("tooSmall", `Audio attachment ${params.attachmentIndex + 1} is too small (${params.size} bytes, minimum ${MIN_AUDIO_FILE_BYTES})`);
}
function formatMissingProviderHint(providerId) {
	const trimmed = providerId.trim();
	if (!trimmed) return "";
	if (!listOfficialExternalProviderCatalogEntries().find((entry) => {
		return (getOfficialExternalPluginCatalogManifest(entry)?.contracts?.mediaUnderstandingProviders ?? []).some((mediaId) => mediaId === trimmed);
	})) return "";
	const catalogHint = resolveOfficialExternalPluginRepairHint(trimmed);
	if (!catalogHint) return "";
	return ` Install the official external plugin with: ${formatCliCommand(catalogHint.installCommand)}, then run ${formatCliCommand("openclaw plugins registry --refresh")} and stop and start the gateway service, or run ${formatCliCommand(catalogHint.doctorFixCommand)} to repair automatically.`;
}
async function runProviderEntry(params) {
	assertMediaExecutionCurrent(params.execution);
	const { entry, capability, cfg } = params;
	const providerIdRaw = entry.provider?.trim();
	if (!providerIdRaw) throw new Error(`Provider entry missing provider for ${capability}`);
	const providerId = normalizeMediaProviderId(providerIdRaw);
	const requestProviderId = normalizeMediaExecutionProviderId(providerIdRaw);
	assertRuntimeMediaRequestSecretOwnerAvailable({
		capability,
		entry
	});
	if (params.secretOwnerId) assertSecretOwnerAvailable("capability", params.secretOwnerId);
	const { maxBytes, maxChars, timeoutMs, prompt, hasConfiguredPrompt } = resolveEntryRunOptions(params);
	if (capability === "image") {
		if (!params.agentDir) throw new Error("Image understanding requires agentDir");
		const modelId = entry.model?.trim();
		if (!modelId) throw new Error("Image understanding requires model id");
		const media = await params.cache.getBuffer({
			attachmentIndex: params.attachmentIndex,
			maxBytes,
			timeoutMs
		});
		const normalizedMedia = await normalizeImageDescriptionInput({
			buffer: media.buffer,
			fileName: media.fileName,
			mime: media.mime,
			maxBytes
		});
		let optimizedMedia;
		try {
			optimizedMedia = await optimizeImageDescriptionInput({
				...normalizedMedia,
				fileName: media.fileName,
				maxBytes,
				cfg,
				provider: requestProviderId,
				model: modelId,
				agentDir: params.agentDir,
				workspaceDir: params.workspaceDir
			});
		} catch (error) {
			if (error instanceof ImageOptimizationLimitError) throw new MediaUnderstandingSkipError("maxBytes", `Attachment ${params.attachmentIndex + 1} exceeds maxBytes ${error.maxBytes}`);
			throw error;
		}
		const provider = getMediaUnderstandingProvider(requestProviderId, params.providerRegistry);
		const imageInput = {
			buffer: optimizedMedia.buffer,
			fileName: optimizedMedia.fileName ?? media.fileName,
			mime: optimizedMedia.mime,
			model: modelId,
			provider: requestProviderId,
			prompt: params.request?.prompt ?? prompt,
			timeoutMs,
			profile: entry.profile,
			preferredProfile: entry.preferredProfile,
			agentId: params.agentId,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			cfg: params.cfg
		};
		const describeImage = provider?.describeImage ?? describeImageWithModel;
		assertMediaExecutionCurrent(params.execution);
		const result = await describeImage(imageInput);
		return ok({
			kind: "image.description",
			attachmentIndex: params.attachmentIndex,
			text: trimOutput(result.text, maxChars),
			provider: requestProviderId,
			model: result.model ?? modelId
		});
	}
	const provider = getMediaUnderstandingProvider(providerId, params.providerRegistry);
	if (!provider) throw new Error(`Media provider not available: ${providerId}${formatMissingProviderHint(providerId)}`);
	const fetchFn = resolveProxyFetchFromEnv();
	if (capability === "audio") {
		if (!provider.transcribeAudio && !provider.transcribeAudioWithContext) throw new Error(`Audio transcription provider "${providerId}" not available.`);
		const media = await params.cache.getBuffer({
			attachmentIndex: params.attachmentIndex,
			maxBytes,
			timeoutMs
		});
		assertMinAudioSize({
			size: media.size,
			attachmentIndex: params.attachmentIndex
		});
		const audioLanguage = params.request?.language ?? entry.language ?? params.config?.language;
		const audioPrompt = params.request?.prompt ?? (hasConfiguredPrompt ? prompt : void 0);
		const transport = resolveProviderRequestContext({
			...params,
			providerId
		});
		const providerQuery = resolveProviderQuery({
			...params,
			providerId
		});
		const model = entry.model?.trim() || (await import("./defaults-DdhFBSIQ.mjs")).resolveDefaultMediaModel({
			cfg,
			providerId,
			capability: "audio",
			workspaceDir: params.workspaceDir
		}) || entry.model;
		const input = {
			buffer: media.buffer,
			fileName: media.fileName,
			mime: media.mime,
			...transport,
			model,
			language: audioLanguage,
			prompt: audioPrompt,
			query: providerQuery,
			timeoutMs,
			fetchFn,
			signal: params.execution?.signal
		};
		let result;
		if (provider.transcribeAudioWithContext) {
			assertMediaExecutionCurrent(params.execution);
			const attempt = await provider.transcribeAudioWithContext({
				...input,
				cfg,
				agentDir: params.agentDir,
				workspaceDir: params.workspaceDir,
				profile: entry.profile,
				preferredProfile: entry.preferredProfile
			});
			if (!attempt.ok) return attempt;
			result = attempt.value;
		} else {
			const transcribeAudio = expectDefined(provider.transcribeAudio, "audio transcription callback");
			const auth = await resolveProviderExecutionAuth({
				...params,
				providerId,
				provider
			});
			result = await executeProviderRequest(providerId, auth, (requestAuth) => transcribeAudio({
				...input,
				...requestAuth
			}), params.execution);
		}
		if (isTranscriptArtifactText(result.text)) return ok(null);
		return ok({
			kind: "audio.transcription",
			attachmentIndex: params.attachmentIndex,
			text: trimOutput(result.text, maxChars),
			provider: providerId,
			model: result.model ?? model
		});
	}
	if (!provider.describeVideo) throw new Error(`Video understanding provider "${providerId}" not available.`);
	const describeVideo = provider.describeVideo;
	const media = await params.cache.getBuffer({
		attachmentIndex: params.attachmentIndex,
		maxBytes,
		timeoutMs
	});
	const estimatedBase64Bytes = estimateBase64Size(media.size);
	const maxBase64Bytes = resolveVideoMaxBase64Bytes(maxBytes);
	if (estimatedBase64Bytes > maxBase64Bytes) throw new MediaUnderstandingSkipError("maxBytes", `Video attachment ${params.attachmentIndex + 1} base64 payload ${estimatedBase64Bytes} exceeds ${maxBase64Bytes}`);
	const auth = await resolveProviderExecutionAuth({
		...params,
		providerId,
		provider
	});
	const { baseUrl, headers, request } = resolveProviderRequestContext({
		...params,
		providerId
	});
	const model = entry.model?.trim() || (await import("./defaults-DdhFBSIQ.mjs")).resolveDefaultMediaModel({
		cfg,
		providerId,
		capability: "video",
		workspaceDir: params.workspaceDir,
		providerRegistry: params.providerRegistry
	}) || entry.model;
	const result = await executeProviderRequest(providerId, auth, (requestAuth) => describeVideo({
		buffer: media.buffer,
		fileName: media.fileName,
		mime: media.mime,
		...requestAuth,
		baseUrl,
		headers,
		request,
		model,
		prompt,
		timeoutMs,
		fetchFn,
		signal: params.execution?.signal
	}), params.execution);
	return ok({
		kind: "video.description",
		attachmentIndex: params.attachmentIndex,
		text: trimOutput(result.text, maxChars),
		provider: providerId,
		model: result.model ?? model
	});
}
async function runCliEntry(params) {
	assertMediaExecutionCurrent(params.execution);
	const { entry, capability, ctx } = params;
	const attachmentIndex = params.attachment.index;
	const cli = resolveCliModelEntry(entry);
	if (!cli.ok) throw cli.error;
	const { command, args } = cli.value;
	const language = params.request?.language ?? entry.language ?? params.config?.language;
	const { maxBytes, maxChars, timeoutMs, prompt } = resolveEntryRunOptions(params);
	const attachmentPath = await params.cache.getPath({
		attachmentIndex,
		maxBytes,
		timeoutMs
	});
	if (capability === "audio") assertMinAudioSize({
		size: (await fs.stat(attachmentPath)).size,
		attachmentIndex
	});
	const outputDir = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-media-cli-"));
	try {
		const mediaPath = await resolveCliMediaPath({
			capability,
			command,
			mediaPath: attachmentPath,
			outputDir,
			execution: params.execution
		});
		const outputBase = path.join(outputDir, path.parse(mediaPath).name);
		const templCtx = {
			...ctx,
			AttachmentPath: mediaPath,
			AttachmentUrl: params.attachment.url ?? params.attachment.path ?? mediaPath,
			AttachmentContentType: params.attachment.mime,
			AttachmentDir: path.dirname(mediaPath),
			AttachmentIndex: params.attachment.index,
			MediaPath: mediaPath,
			MediaUrl: params.attachment.url ?? params.attachment.path ?? mediaPath,
			MediaType: params.attachment.mime,
			MediaDir: path.dirname(mediaPath),
			OutputDir: outputDir,
			OutputBase: outputBase,
			Prompt: params.request?.prompt ?? prompt,
			...capability === "audio" && language ? { Language: language } : {},
			MaxChars: maxChars
		};
		for (const key of [
			"MediaPaths",
			"MediaUrls",
			"MediaTypes",
			"MediaWorkspaceDir",
			"MediaTranscribedIndexes",
			"MediaStaged"
		]) delete templCtx[key];
		const argv = args.map((part) => applyTemplate(part, templCtx));
		if (shouldLogVerbose()) logVerbose(`Media understanding via CLI: ${[command, ...argv].join(" ")}`);
		assertMediaExecutionCurrent(params.execution);
		const { stdout, stderr } = await runExec(command, argv, {
			timeoutMs,
			maxBuffer: CLI_OUTPUT_MAX_BUFFER,
			signal: params.execution?.signal,
			cwd: ["agy", "antigravity"].includes(commandBase(command)) ? path.dirname(mediaPath) : void 0
		});
		const requestedBackend = capability === "audio" ? resolveRequestedLocalAudioBackend({
			command,
			args: argv
		}) : void 0;
		const observedBackend = capability === "audio" ? recordLocalAudioBackendObservation({
			command,
			args: argv,
			output: `${stderr ?? ""}\n${stdout}`
		}) : void 0;
		const resolved = await resolveCliOutput({
			command,
			args: argv,
			stdout,
			mediaPath
		});
		const text = trimOutput(resolved, maxChars);
		if (!text || capability === "audio" && isTranscriptArtifactText(resolved)) return null;
		return {
			kind: capability === "audio" ? "audio.transcription" : `${capability}.description`,
			attachmentIndex,
			text,
			provider: capability === "audio" ? commandBase(command) : "cli",
			model: command,
			...requestedBackend ? { requestedBackend } : {},
			...observedBackend ? { observedBackend } : {}
		};
	} finally {
		await fs.rm(outputDir, {
			recursive: true,
			force: true
		}).catch(() => {});
	}
}
//#endregion
export { runCliEntry as a, normalizeImageDescriptionInput as c, normalizeDecisionReason as i, optimizeImageDescriptionInput as l, findDecisionReason as n, runProviderEntry as o, formatDecisionSummary as r, summarizeDecisionReason as s, buildModelDecision as t };
