import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { o as normalizeLowercaseStringOrEmpty, s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { A as writeExternalFileWithinRoot } from "./fs-safe-BAPek8At.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { n as findNormalizedProviderValue } from "./provider-id-DCtsDflE.mjs";
import "./errors-DnjwnOju.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { u as listOfficialExternalProviderCatalogEntries } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { o as getOfficialExternalPluginCatalogManifest } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { i as logVerbose, o as shouldLogVerbose } from "./globals-QODkv80i.mjs";
import { n as runExec } from "./exec-shcN2-sN.mjs";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DVMYGogL.mjs";
import { c as mergeModelProviderRequestOverrides, m as sanitizeConfiguredProviderRequest, p as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-DOrVD029.mjs";
import { i as resolveOfficialExternalPluginRepairHint } from "./official-external-plugin-repair-hints-B2sBFVIg.mjs";
import { n as CUSTOM_LOCAL_AUTH_MARKER } from "./model-auth-markers-BfYDKFYI.mjs";
import { d as normalizeMimeType, u as mimeTypeFromFilePath } from "./mime-1zBUMwu6.mjs";
import { r as runFfmpeg } from "./ffmpeg-exec-Dx-p1dpM.mjs";
import "./media-services-VTwDQdlk.mjs";
import { u as readImageMetadataFromHeader } from "./image-ops-CU4vxSlO.mjs";
import { i as assertRuntimeMediaRequestSecretOwnerAvailable } from "./entry-capabilities-DIuRkXhI.mjs";
import { n as DEFAULT_MAX_BYTES, o as DEFAULT_VIDEO_MAX_BASE64_BYTES, s as MIN_AUDIO_FILE_BYTES, t as CLI_OUTPUT_MAX_BUFFER } from "./defaults.constants-Cof2g8lZ.mjs";
import { n as normalizeMediaProviderId, t as normalizeMediaExecutionProviderId } from "./provider-id-DSbuCFIb.mjs";
import { r as resolveEntryRunOptions, t as resolveCliModelEntry } from "./resolve-P9fG0vPg.mjs";
import { a as optimizeImageBufferForWebMedia, l as ImageOptimizationLimitError, t as effectiveImageBytesCap } from "./web-media-BGRqIyLZ.mjs";
import { t as applyTemplate } from "./templating-DocmBuN3.mjs";
import { n as MediaUnderstandingSkipError } from "./attachments-C_tU3ipE.mjs";
import { r as providerOperationRetryConfig } from "./operation-retry-Dopl7EnK.mjs";
import { i as resolveRequestedLocalAudioBackend, r as recordLocalAudioBackendObservation } from "./local-audio-BUgxXnl2.mjs";
import { n as resolveOpenAiAudioAuthModelApi } from "./openai-audio-api-CZK5TvIV.mjs";
import { r as getMediaUnderstandingProvider, t as resolveImageCompressionModelPolicy } from "./image-compression-policy-CMGtwQyV.mjs";
import { n as executeWithApiKeyRotation, t as collectProviderApiKeysForExecution } from "./api-key-rotation-BtFWlIBW.mjs";
import { i as resolveProxyFetchFromEnv } from "./proxy-fetch-0WBdYnFw.mjs";
import { s as normalizeInputImageBuffer } from "./input-files-CJ_O6M0_.mjs";
import { t as describeImageWithModel } from "./image-runtime-CgM_qz8p.mjs";
import { t as isTranscriptArtifactText } from "./transcription-text-DGY3Kmgr.mjs";
import path from "node:path";
import fs from "node:fs/promises";
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
/** Estimate base64 size for a byte count. */
function estimateBase64Size(bytes) {
	return Math.ceil(bytes / 3) * 4;
}
/** Resolve video base64 byte limit from raw byte limit and global cap. */
function resolveVideoMaxBase64Bytes(maxBytes) {
	const expanded = estimateBase64Size(maxBytes);
	return Math.min(expanded, DEFAULT_VIDEO_MAX_BASE64_BYTES);
}
//#endregion
//#region src/media-understanding/image-input-normalize.ts
const HEIC_MIME_RE = /^image\/hei[cf](?:-sequence)?$/i;
const HEIC_EXT_RE = /\.(heic|heif)$/i;
const MEDIA_UNDERSTANDING_MAX_SOURCE_PIXELS = 4e7;
function isHeicInput(params) {
	const mime = normalizeMimeType(params.mime);
	if (mime && HEIC_MIME_RE.test(mime)) return true;
	const fileName = params.fileName?.trim();
	return Boolean(fileName && HEIC_EXT_RE.test(fileName));
}
/** Normalizes image bytes before provider execution, converting HEIC/HEIF inputs to JPEG. */
async function normalizeImageDescriptionInput(params) {
	if (!isHeicInput(params)) return {
		buffer: params.buffer,
		mime: params.mime
	};
	const sourceMime = normalizeMimeType(params.mime) ?? "image/heic";
	const image = await normalizeInputImageBuffer({
		buffer: params.buffer,
		mimeType: sourceMime,
		limits: {
			allowedMimes: /* @__PURE__ */ new Set([
				sourceMime.toLowerCase(),
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
const loadModelAuth = createLazyRuntimeModule(async () => await import("./model-auth-DULCZeLw.mjs"));
function resolveLiteralProviderApiKey(params) {
	return normalizeNullableString(params.cfg.models?.providers?.[params.providerId]?.apiKey);
}
function sanitizeProviderHeaders(headers) {
	if (!headers) return;
	const next = {};
	for (const [key, value] of Object.entries(headers)) {
		if (typeof value !== "string") continue;
		next[key] = value;
	}
	return Object.keys(next).length > 0 ? next : void 0;
}
function trimOutput(text, maxChars) {
	const trimmed = text.trim();
	if (!maxChars || trimmed.length <= maxChars) return trimmed;
	return truncateUtf16Safe(trimmed, maxChars).trim();
}
function extractSherpaOnnxText(raw) {
	const noMatch = {
		matched: false,
		text: ""
	};
	const tryParse = (value) => {
		const trimmed = value.trim();
		if (!trimmed) return noMatch;
		const head = trimmed[0];
		if (head !== "{" && head !== "\"") return noMatch;
		try {
			const parsed = JSON.parse(trimmed);
			if (typeof parsed === "string") return tryParse(parsed);
			if (parsed && typeof parsed === "object") {
				const text = parsed.text;
				if (typeof text === "string") return {
					matched: true,
					text: text.trim()
				};
			}
		} catch {}
		return noMatch;
	};
	const direct = tryParse(raw);
	if (direct.matched) return direct;
	const lines = normalizeStringEntries(raw.split("\n"));
	for (let i = lines.length - 1; i >= 0; i -= 1) {
		const parsed = tryParse(lines[i] ?? "");
		if (parsed.matched) return parsed;
	}
	return noMatch;
}
function commandBase(command) {
	return path.parse(command).name;
}
function isAntigravityCliCommand(command) {
	const commandId = commandBase(command);
	return commandId === "agy" || commandId === "antigravity";
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
function hasArg(args, keys) {
	return args.some((arg) => keys.includes(arg));
}
function resolveWhisperOutputPath(args, mediaPath) {
	const outputDir = findArgValue(args, ["--output_dir", "-o"]);
	if (!outputDir) return null;
	const outputFormat = findArgValue(args, ["--output_format", "-f"]) ?? "all";
	if (outputFormat !== "txt" && outputFormat !== "all") return null;
	return path.join(outputDir, `${path.parse(mediaPath).name}.txt`);
}
function resolveWhisperCppOutputPath(args) {
	if (!hasArg(args, ["-otxt", "--output-txt"])) return null;
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
		if (response.matched) return response.text;
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
function normalizeProviderQuery(options) {
	if (!options) return;
	const query = {};
	for (const [key, value] of Object.entries(options)) {
		if (value === void 0) continue;
		query[key] = value;
	}
	return Object.keys(query).length > 0 ? query : void 0;
}
function normalizeDeepgramQueryKeys(query) {
	const normalized = { ...query };
	if ("detectLanguage" in normalized) {
		normalized.detect_language = normalized.detectLanguage;
		delete normalized.detectLanguage;
	}
	if ("smartFormat" in normalized) {
		normalized.smart_format = normalized.smartFormat;
		delete normalized.smartFormat;
	}
	return normalized;
}
function resolveProviderQuery(params) {
	const { providerId, config, entry } = params;
	const mergedOptions = normalizeProviderQuery({
		...config?.providerOptions?.[providerId],
		...entry.providerOptions?.[providerId]
	});
	if (providerId !== "deepgram") return mergedOptions;
	const query = normalizeDeepgramQueryKeys(mergedOptions ?? {});
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
function executeProviderRequest(provider, auth, execute) {
	return auth.kind === "api-key" ? executeWithApiKeyRotation({
		provider,
		apiKeys: auth.apiKeys,
		transientRetry: providerOperationRetryConfig("read"),
		execute: (apiKey) => execute({
			apiKey,
			auth: {
				kind: "api-key",
				apiKey,
				source: auth.source
			}
		})
	}) : execute({
		apiKey: CUSTOM_LOCAL_AUTH_MARKER,
		auth: {
			kind: "none",
			source: auth.source ?? `provider:${provider}`
		}
	});
}
async function resolveProviderExecutionAuth(params) {
	const providerConfig = findNormalizedProviderValue(params.cfg.models?.providers, params.providerId);
	const literalApiKey = resolveLiteralProviderApiKey({
		cfg: params.cfg,
		providerId: params.providerId
	});
	if (literalApiKey) return {
		kind: "api-key",
		apiKeys: collectProviderApiKeysForExecution({
			provider: params.providerId,
			primaryApiKey: literalApiKey
		}),
		source: `models.providers.${params.providerId}.apiKey`
	};
	const resolveMediaProviderAuth = () => {
		const context = {
			config: params.cfg,
			provider: params.providerId,
			providerConfig
		};
		const providerAuth = params.provider?.resolveAuth?.(context);
		if (!providerAuth) {
			const syntheticAuth = params.provider?.resolveSyntheticAuth?.(context);
			const syntheticApiKey = syntheticAuth?.apiKey.trim();
			const syntheticSource = syntheticAuth?.source;
			return syntheticApiKey ? {
				kind: "api-key",
				apiKeys: collectProviderApiKeysForExecution({
					provider: params.providerId,
					primaryApiKey: syntheticApiKey
				}),
				source: syntheticSource
			} : void 0;
		}
		if (providerAuth.kind === "none") return {
			kind: "none",
			source: providerAuth.source
		};
		const apiKey = providerAuth.apiKey.trim();
		if (!apiKey) return;
		return {
			kind: "api-key",
			apiKeys: collectProviderApiKeysForExecution({
				provider: params.providerId,
				primaryApiKey: apiKey
			}),
			source: providerAuth.source
		};
	};
	const { isProviderAuthError, requireApiKey, resolveApiKeyForProviderCore } = await loadModelAuth();
	try {
		const auth = await resolveApiKeyForProviderCore({
			provider: params.providerId,
			cfg: params.cfg,
			profileId: params.entry.profile,
			preferredProfile: params.entry.preferredProfile,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			modelApi: resolveOpenAiAudioAuthModelApi({
				capability: params.capability,
				providerId: params.providerId
			})
		});
		const apiKey = requireApiKey(auth, params.providerId);
		return {
			kind: "api-key",
			apiKeys: collectProviderApiKeysForExecution({
				provider: params.providerId,
				primaryApiKey: apiKey
			}),
			source: auth.source
		};
	} catch (err) {
		if (!isProviderAuthError(err, "missing-provider-auth") && !isProviderAuthError(err, "missing-api-key")) throw err;
		const mediaAuth = resolveMediaProviderAuth();
		if (mediaAuth) return mediaAuth;
		throw err;
	}
}
function resolveProviderRequestContext(params) {
	const providerConfig = findNormalizedProviderValue(params.cfg.models?.providers, params.providerId);
	const baseUrl = params.entry.baseUrl ?? params.config?.baseUrl ?? providerConfig?.baseUrl;
	const mergedHeaders = {
		...sanitizeProviderHeaders(providerConfig?.headers),
		...sanitizeProviderHeaders(params.config?.headers),
		...sanitizeProviderHeaders(params.entry.headers)
	};
	return {
		baseUrl,
		headers: Object.keys(mergedHeaders).length > 0 ? mergedHeaders : void 0,
		request: mergeModelProviderRequestOverrides(sanitizeConfiguredModelProviderRequest(providerConfig?.request), sanitizeConfiguredProviderRequest(params.config?.request), sanitizeConfiguredProviderRequest(params.entry.request))
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
/** Executes one provider-backed media-understanding entry for one attachment. */
async function runProviderEntry(params) {
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
	const { maxBytes, maxChars, timeoutMs, prompt, hasConfiguredPrompt } = resolveEntryRunOptions({
		capability,
		entry,
		cfg,
		config: params.config
	});
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
		const result = await (provider?.describeImage ?? describeImageWithModel)(imageInput);
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
			providerId,
			cfg,
			entry,
			config: params.config
		});
		const providerQuery = resolveProviderQuery({
			providerId,
			config: params.config,
			entry
		});
		const model = entry.model?.trim() || (await import("./defaults-UOO4ry_m.mjs")).resolveDefaultMediaModel({
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
			fetchFn
		};
		let result;
		if (provider.transcribeAudioWithContext) {
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
			result = await executeProviderRequest(providerId, await resolveProviderExecutionAuth({
				capability,
				providerId,
				provider,
				cfg,
				entry,
				agentDir: params.agentDir,
				workspaceDir: params.workspaceDir
			}), (requestAuth) => transcribeAudio({
				...input,
				...requestAuth
			}));
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
		capability,
		providerId,
		provider,
		cfg,
		entry,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	});
	const { baseUrl, headers, request } = resolveProviderRequestContext({
		providerId,
		cfg,
		entry,
		config: params.config
	});
	const model = entry.model?.trim() || (await import("./defaults-UOO4ry_m.mjs")).resolveDefaultMediaModel({
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
		fetchFn
	}));
	return ok({
		kind: "video.description",
		attachmentIndex: params.attachmentIndex,
		text: trimOutput(result.text, maxChars),
		provider: providerId,
		model: result.model ?? model
	});
}
/** Executes one CLI-backed media-understanding entry for one attachment. */
async function runCliEntry(params) {
	const { entry, capability, cfg, ctx } = params;
	const attachmentIndex = params.attachment.index;
	const cli = resolveCliModelEntry(entry);
	if (!cli.ok) throw cli.error;
	const { command, args } = cli.value;
	const language = params.request?.language ?? entry.language ?? params.config?.language;
	const { maxBytes, maxChars, timeoutMs, prompt } = resolveEntryRunOptions({
		capability,
		entry,
		cfg,
		config: params.config
	});
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
			outputDir
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
		const argv = [command, ...args].map((part, index) => index === 0 ? part : applyTemplate(part, templCtx));
		if (shouldLogVerbose()) logVerbose(`Media understanding via CLI: ${argv.join(" ")}`);
		const { stdout, stderr } = await runExec(expectDefined(argv[0], "argv entry at 0"), argv.slice(1), {
			timeoutMs,
			maxBuffer: CLI_OUTPUT_MAX_BUFFER,
			cwd: isAntigravityCliCommand(command) ? path.dirname(mediaPath) : void 0
		});
		const requestedBackend = capability === "audio" ? resolveRequestedLocalAudioBackend({
			command,
			args: argv.slice(1)
		}) : void 0;
		const observedBackend = capability === "audio" ? recordLocalAudioBackendObservation({
			command,
			args: argv.slice(1),
			output: `${stderr ?? ""}\n${stdout}`
		}) : void 0;
		const resolved = await resolveCliOutput({
			command,
			args: argv.slice(1),
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
