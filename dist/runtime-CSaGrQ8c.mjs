import { a as resolveAgentDir, p as resolveDefaultAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as hasHttpUrlPrefix } from "./url-protocol-OU3K-ySz.mjs";
import { l as kindFromMime, u as mimeTypeFromFilePath } from "./mime-1zBUMwu6.mjs";
import { n as DEFAULT_MAX_BYTES } from "./defaults.constants-Cof2g8lZ.mjs";
import { n as normalizeMediaProviderId } from "./provider-id-DSbuCFIb.mjs";
import { a as resolveMediaRuntimeTimeoutMs, i as resolveMaxBytes, o as resolveModelEntries } from "./resolve-P9fG0vPg.mjs";
import { n as buildMediaUnderstandingRegistry, r as getMediaUnderstandingProvider } from "./image-compression-policy-CMGtwQyV.mjs";
import { c as normalizeImageDescriptionInput, i as normalizeDecisionReason, l as optimizeImageDescriptionInput, n as findDecisionReason } from "./runner.entries-B4_QSISS.mjs";
import { t as describeImageWithModel } from "./image-runtime-CgM_qz8p.mjs";
import { n as normalizeMediaAttachments, t as createMediaAttachmentCache } from "./runner.attachments-DvjOaABk.mjs";
import { r as runCapability, t as buildProviderRegistry } from "./runner-BfY5MKv7.mjs";
import path from "node:path";
//#region src/media-understanding/runtime.ts
const KIND_BY_CAPABILITY = {
	audio: "audio.transcription",
	image: "image.description",
	video: "video.description"
};
function resolveDecisionFailureReason(decision) {
	return normalizeDecisionReason(findDecisionReason(decision, "failed"));
}
function buildFileContext(params) {
	const scopeFields = {
		...params.scopeContext?.sessionKey ? { SessionKey: params.scopeContext.sessionKey } : {},
		...params.scopeContext?.channel ? {
			Provider: params.scopeContext.channel,
			Surface: params.scopeContext.channel
		} : {},
		...params.scopeContext?.chatType ? { ChatType: params.scopeContext.chatType } : {}
	};
	const remoteRef = params.mediaUrl ?? (isRemoteMediaReference(params.filePath) ? params.filePath.trim() : void 0);
	const extensionMime = remoteRef ? mimeTypeFromFilePath(remoteRef) : void 0;
	const extensionKind = kindFromMime(extensionMime);
	const mediaType = params.mime ?? (remoteRef && params.capability && extensionKind === params.capability ? `${params.capability}/*` : extensionMime) ?? (remoteRef && params.capability ? `${params.capability}/*` : void 0);
	if (remoteRef) return {
		media: [{
			url: remoteRef,
			contentType: mediaType
		}],
		...scopeFields
	};
	return {
		media: [{
			path: params.filePath,
			contentType: mediaType
		}],
		...scopeFields
	};
}
function isRemoteMediaReference(value) {
	return hasHttpUrlPrefix(value.trim());
}
function concreteMime(mime) {
	const normalized = mime?.trim();
	if (!normalized || normalized.endsWith("/*")) return;
	return normalized;
}
function resolveFileLocalRoots(filePath) {
	return isRemoteMediaReference(filePath) ? void 0 : [path.dirname(filePath)];
}
function basenameFromMediaReference(value) {
	if (isRemoteMediaReference(value)) try {
		const url = new URL(value);
		return path.basename(url.pathname) || "image";
	} catch {}
	return path.basename(value);
}
function hasStructuredImageInput(input) {
	return input.some((entry) => entry.type === "image");
}
/** Runs media understanding for one local file or remote URL and returns the first matching output. */
async function runMediaUnderstandingFile(params) {
	return runFile(params, { prompt: params.prompt?.trim() || void 0 });
}
async function runFile(params, request) {
	const { cfg } = params;
	const requestTimeoutSeconds = typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs) && params.timeoutMs > 0 ? Math.ceil(params.timeoutMs / 1e3) : void 0;
	const ctx = buildFileContext({
		...params,
		capability: params.capability,
		scopeContext: params.scopeContext
	});
	const attachments = normalizeMediaAttachments(ctx);
	const decisionBase = {
		capability: params.capability,
		attachments: [],
		attachmentProcessing: Object.fromEntries(attachments.map(({ index }) => [index, "omitted"])),
		...params.capability === "image" ? { nativeVisionActive: false } : {}
	};
	if (attachments.length === 0) return {
		text: void 0,
		decision: {
			...decisionBase,
			outcome: "no-attachment",
			attachmentDispositions: {}
		}
	};
	const config = {
		...cfg.tools?.media?.[params.capability],
		...request.prompt ? { prompt: request.prompt } : {},
		...request.language ? { language: request.language } : {},
		...requestTimeoutSeconds !== void 0 ? { timeoutSeconds: requestTimeoutSeconds } : {}
	};
	if (config?.enabled === false) return {
		text: void 0,
		provider: void 0,
		model: void 0,
		output: void 0,
		decision: {
			...decisionBase,
			outcome: "disabled",
			attachmentDispositions: Object.fromEntries(attachments.map((attachment) => [attachment.index, { kind: "capability-disabled" }]))
		}
	};
	const providerRegistry = buildProviderRegistry(void 0, cfg);
	const agentDir = params.agentDir ?? (params.agentId ? resolveAgentDir(cfg, params.agentId) : void 0);
	const cache = createMediaAttachmentCache(attachments, {
		localPathRoots: params.mediaUrl ? void 0 : resolveFileLocalRoots(params.filePath),
		ssrfPolicy: cfg.tools?.web?.fetch?.ssrfPolicy
	});
	try {
		const result = await runCapability({
			capability: params.capability,
			cfg,
			ctx,
			attachments: cache,
			media: attachments,
			...params.agentId ? { agentId: params.agentId } : {},
			...agentDir ? { agentDir } : {},
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
			providerRegistry,
			config,
			activeModel: params.activeModel,
			request
		});
		if (result.outputs.length === 0 && result.decision.outcome === "failed") throw new Error(resolveDecisionFailureReason(result.decision) ?? `${params.capability} understanding failed`);
		const output = result.outputs.find((entry) => entry.kind === KIND_BY_CAPABILITY[params.capability]);
		const fileResult = {
			text: output?.text?.trim() || void 0,
			provider: output?.provider,
			model: output?.model,
			output
		};
		if (result.decision) fileResult.decision = result.decision;
		return fileResult;
	} finally {
		await cache.cleanup();
	}
}
/** Describes one image file or URL through the configured image-understanding pipeline. */
async function describeImageFile(params) {
	return await runMediaUnderstandingFile({
		...params,
		capability: "image"
	});
}
/** Reads and normalizes image input once before explicit-model fallback attempts. */
async function prepareImageDescriptionInput(params) {
	const timeoutMs = resolveMediaRuntimeTimeoutMs(params.timeoutMs);
	const image = await readImageDescriptionInput({
		filePath: params.filePath,
		mediaUrl: params.mediaUrl,
		mime: params.mime,
		cfg: params.cfg,
		timeoutMs
	});
	const normalizedImage = await normalizeImageDescriptionInput({
		buffer: image.buffer,
		fileName: image.fileName,
		mime: image.mime,
		maxBytes: DEFAULT_MAX_BYTES.image
	});
	return {
		buffer: normalizedImage.buffer,
		fileName: image.fileName,
		mime: normalizedImage.mime
	};
}
/** Describes a prepared image with an explicit provider/model. */
async function describePreparedImageWithModel(params) {
	const timeoutMs = resolveMediaRuntimeTimeoutMs(params.timeoutMs);
	const describeImage = buildProviderRegistry(void 0, params.cfg).get(normalizeMediaProviderId(params.provider))?.describeImage ?? describeImageWithModel;
	const agentDir = params.agentDir ?? (params.agentId ? resolveAgentDir(params.cfg, params.agentId) : resolveDefaultAgentDir(params.cfg));
	const image = await optimizeImageDescriptionInput({
		...params.image,
		maxBytes: DEFAULT_MAX_BYTES.image,
		cfg: params.cfg,
		provider: params.provider,
		model: params.model,
		agentDir,
		workspaceDir: params.workspaceDir
	});
	return await describeImage({
		buffer: image.buffer,
		fileName: image.fileName ?? params.image.fileName,
		mime: image.mime,
		provider: params.provider,
		model: params.model,
		prompt: params.prompt,
		maxTokens: params.maxTokens,
		timeoutMs,
		cfg: params.cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		agentDir,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
}
/** Describes one image with an explicit provider/model, bypassing configured media model selection. */
async function describeImageFileWithModel(params) {
	const image = await prepareImageDescriptionInput(params);
	return await describePreparedImageWithModel({
		...params,
		image
	});
}
async function readImageDescriptionInput(params) {
	const attachments = normalizeMediaAttachments(buildFileContext({
		...params,
		capability: "image"
	}));
	const cache = createMediaAttachmentCache(attachments, {
		localPathRoots: params.mediaUrl ? void 0 : resolveFileLocalRoots(params.filePath),
		ssrfPolicy: params.cfg.tools?.web?.fetch?.ssrfPolicy
	});
	try {
		const media = await cache.getBuffer({
			attachmentIndex: 0,
			maxBytes: DEFAULT_MAX_BYTES.image,
			timeoutMs: params.timeoutMs
		});
		return {
			buffer: media.buffer,
			fileName: media.fileName || basenameFromMediaReference(params.mediaUrl ?? params.filePath),
			mime: media.mime ?? concreteMime(params.mime)
		};
	} finally {
		await cache.cleanup();
	}
}
/** Runs provider-backed structured extraction for multimodal text/image input. */
async function extractStructuredWithModel(params) {
	const timeoutMs = resolveMediaRuntimeTimeoutMs(params.timeoutMs);
	if (!hasStructuredImageInput(params.input)) throw new Error("Structured extraction requires at least one image input.");
	const provider = getMediaUnderstandingProvider(params.provider, buildMediaUnderstandingRegistry(void 0, params.cfg));
	if (!provider?.extractStructured) throw new Error(`Provider does not support structured extraction: ${params.provider}`);
	return await provider.extractStructured({
		input: params.input,
		instructions: params.instructions,
		schemaName: params.schemaName,
		jsonSchema: params.jsonSchema,
		jsonMode: params.jsonMode,
		provider: params.provider,
		model: params.model,
		profile: params.profile,
		preferredProfile: params.preferredProfile,
		authStore: params.authStore,
		timeoutMs,
		cfg: params.cfg,
		agentDir: params.agentDir ?? ""
	});
}
/** Describes one video file or URL through the configured video-understanding pipeline. */
async function describeVideoFile(params) {
	return await runMediaUnderstandingFile({
		...params,
		capability: "video"
	});
}
/** Prepares the largest input that any configured transcription fallback can accept. */
async function resolveAudioInputBudget(params) {
	const { cfg } = params;
	const config = cfg.tools?.media?.audio;
	if (config?.enabled === false) return { enabled: false };
	const capability = "audio";
	const entries = resolveModelEntries({
		cfg,
		capability,
		config,
		providerRegistry: buildProviderRegistry(void 0, cfg)
	}).map(({ entry }) => entry);
	const candidates = entries.length > 0 ? entries : [{}];
	return {
		enabled: true,
		maxBytes: Math.max(...candidates.map((entry) => resolveMaxBytes({
			cfg,
			capability,
			config,
			entry
		})))
	};
}
/** Transcribes one audio file or URL through the configured audio-understanding pipeline. */
async function transcribeAudioFile(params) {
	return runFile({
		...params,
		capability: "audio"
	}, {
		prompt: params.prompt?.trim() || params.prompt || void 0,
		language: params.language || void 0
	});
}
//#endregion
export { extractStructuredWithModel as a, runMediaUnderstandingFile as c, describeVideoFile as i, transcribeAudioFile as l, describeImageFileWithModel as n, prepareImageDescriptionInput as o, describePreparedImageWithModel as r, resolveAudioInputBudget as s, describeImageFile as t };
