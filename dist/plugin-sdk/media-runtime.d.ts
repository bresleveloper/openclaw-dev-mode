import { Fo as isVoiceCompatibleAudio, Io as isVoiceMessageCompatibleAudio, Ru as readResponseTextSnippet, ca as FetchLike, da as fetchRemoteMedia, fa as readRemoteMediaBuffer, la as MediaFetchError, ma as saveResponseMedia, pa as saveRemoteMedia, ua as SavedRemoteMedia, zu as readResponseWithLimit } from "../agent-harness-runtime-CWL0fcg5.js";
import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import "../templating-OpWn1DzT.js";
import "../types-BnfxNjkF.js";
import { A as MediaUnderstandingCapability, l as MediaUnderstandingProvider } from "../types-Bl4TRRJl.js";
import { a as mediaKindFromMime, i as maxBytesForKind, n as MAX_IMAGE_BYTES, r as MediaKind, t as MAX_AUDIO_BYTES } from "../constants-BCpSHoXd.js";
import { n as OutboundMediaReadFile, r as buildOutboundMediaLoadOptions, t as OutboundMediaAccess } from "../load-options-BwtyeSvQ.js";
import { A as OutboundSendDeps } from "../types-DOAIO5Ze.js";
import { n as normalizePollDurationHours, r as normalizePollInput, t as PollInput } from "../polls-sXqxREW1.js";
import "../types.adapters-dxHXA2rq.js";
import { t as resolveChannelMediaMaxBytes } from "../media-limits-DPjw-HxK.js";
import { n as ChannelOutboundAdapter } from "../outbound.types-HYq1MKG1.js";
import "../ssrf-CkjpArdF.js";
import { a as IMAGE_REDUCE_QUALITY_STEPS, c as isImageProcessorUnavailableError, o as buildImageResizeSideGrid, s as getImageMetadata, u as resizeToJpeg } from "../web-media-Deh9x9Pt.js";
import { a as kindFromMime, i as isGifMedia, n as extensionForMime, r as getFileExtension, t as detectMime } from "../mime-DQ7_7W8X.js";
import { l as ActiveMediaModel } from "../runtime-types-MEZA7eox.js";
import { c as saveMediaSource, i as getMediaDir, n as ensureMediaDir, r as extractOriginalFilename, s as saveMediaBuffer, t as SavedMedia } from "../store-hcCHco5A.js";
import { t as getAgentScopedMediaLocalRoots } from "../local-roots-bPcNzzMY.js";
import { n as buildAgentMediaPayload } from "../agent-media-payload-DdevZNCH.js";
import { i as normalizeInboundPathRoots, t as isInboundPathAllowed } from "../inbound-path-policy-nRJfbQMX.js";
import { t as transcribeFirstAudio$1 } from "../audio-preflight-DkG1hrbh.js";
import { t as describeImageWithModel } from "../image-runtime-DANP1F93.js";
//#region src/media/audio-transcode.d.ts
/** Transcodes arbitrary audio input into mono Opus using a scoped temp workspace. */
export declare function transcodeAudioBufferToOpus(params: {
  audioBuffer: Buffer;
  inputExtension?: string;
  inputFileName?: string;
  tempPrefix?: string;
  outputFileName?: string;
  timeoutMs?: number;
  sampleRateHz?: number;
  bitrate?: string;
  channels?: number;
  /** Maximum output duration passed to ffmpeg's `-t` option. */
  maxDurationSeconds?: number;
}): Promise<Buffer>;
/** Outcome for lightweight container transcodes that may be unsupported or intentionally skipped. */
type AudioContainerTranscodeOutcome = {
  ok: true;
  buffer: Buffer;
} | {
  ok: false;
  reason: "platform-unsupported" | "invalid-extension" | "noop-same-container" | "no-recipe" | "transcoder-failed";
  detail?: string;
};
/** Transcodes known audio container pairs, currently using macOS afconvert recipes where needed. */
export declare function transcodeAudioBuffer(params: {
  audioBuffer: Buffer;
  sourceExtension: string;
  targetExtension: string;
  timeoutMs?: number;
}): Promise<AudioContainerTranscodeOutcome>;
//#endregion
//#region src/media/ffmpeg-exec.d.ts
/** Process limits and optional stdin payload for ffmpeg/ffprobe helper calls. */
type MediaExecOptions = {
  timeoutMs?: number;
  maxBufferBytes?: number;
  input?: Buffer | string;
  stdinFileDescriptor?: number;
};
/** Resolves ffmpeg from trusted system paths before command execution. */
export declare function resolveFfmpegBin(): string;
/** Runs ffprobe with optional stdin input. */
export declare function runFfprobe(args: string[], options?: MediaExecOptions): Promise<string>;
/** Runs ffmpeg with bounded timeout and buffer settings. */
export declare function runFfmpeg(args: string[], options?: MediaExecOptions): Promise<string>;
/** Parses codec and positive sample rate from compact ffprobe stream output. */
export declare function parseFfprobeCodecAndSampleRate(stdout: string): {
  codec: string | null;
  sampleRateHz: number | null;
};
//#endregion
//#region src/media/media-probe.d.ts
/** Positive display dimensions of the selected video stream. */
type VideoDimensions = {
  width: number;
  height: number;
};
/** Probes a video buffer while preserving the existing public media-runtime API. */
export declare function probeVideoDimensions(buffer: Buffer): Promise<VideoDimensions | undefined>;
//#endregion
//#region src/media-understanding/runner.d.ts
declare function resolveAutoImageModel$1(params: {
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  activeModel?: ActiveMediaModel;
}): Promise<ActiveMediaModel | null>;
//#endregion
//#region packages/media-core/src/base64.d.ts
/** Estimates decoded bytes without allocating a cleaned copy of the base64 payload. */
export declare function estimateBase64DecodedBytes(base64: string): number;
/**
 * Normalizes and validates a base64 string, returning canonical no-whitespace
 * base64 only when the input has valid alphabet, padding, and length.
 */
export declare function canonicalizeBase64(base64: string): string | undefined;
//#endregion
//#region packages/media-core/src/content-length.d.ts
/** Parses a Content-Length header as a safe integer or rejects malformed values. */
export declare function parseMediaContentLength(raw: string | null): number | null;
//#endregion
//#region src/media/ffmpeg-limits.d.ts
/** Maximum audio duration accepted by ffmpeg-backed media flows. */
export declare const MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS: number;
//#endregion
//#region src/media/outbound-attachment.d.ts
/** Loads a remote/local media URL and stages it into the outbound media store. */
export declare function resolveOutboundAttachmentFromUrl(mediaUrl: string, maxBytes: number, options?: {
  mediaAccess?: OutboundMediaAccess;
  localRoots?: readonly string[];
  readFile?: (filePath: string) => Promise<Buffer>;
}): Promise<{
  path: string;
  contentType?: string;
}>;
//#endregion
//#region src/media/png-encode.d.ts
/**
 * Writes one RGBA pixel into a width-strided buffer.
 * Out-of-bounds coordinates are ignored so fixture drawing code can clip shapes cheaply.
 */
export declare function fillPixel(buf: Buffer, x: number, y: number, width: number, r: number, g: number, b: number, a?: number): void;
/** Encodes tightly packed RGBA bytes (`width * height * 4`) as a PNG image. */
export declare function encodePngRgba(buffer: Buffer, width: number, height: number): Buffer;
//#endregion
//#region src/media/qr-image.d.ts
type QrPngRenderOptions = {
  scale?: number;
  marginModules?: number;
};
/** Temp-file write options kept to filename segments so callers cannot choose parent paths. */
type QrPngTempFileOptions = QrPngRenderOptions & {
  tmpRoot: string;
  dirPrefix: string;
  fileName?: string;
};
type QrPngTempFile = {
  filePath: string;
  dirPath: string;
  mediaLocalRoots: string[];
};
/** Renders QR text as raw PNG base64 after validating bounded renderer options. */
export declare function renderQrPngBase64(input: string, opts?: QrPngRenderOptions): Promise<string>;
/** Renders QR text as a PNG data URL. */
export declare function renderQrPngDataUrl(input: string, opts?: QrPngRenderOptions): Promise<string>;
/** Writes QR PNG output into a scoped temp directory and returns that directory as a media root. */
export declare function writeQrPngTempFile(input: string, opts: QrPngTempFileOptions): Promise<QrPngTempFile>;
//#endregion
//#region src/media/qr-terminal.d.ts
/** Renders QR text for terminal display, with an optional compact half-block mode. */
export declare function renderQrTerminal(input: string, opts?: {
  small?: boolean;
}): Promise<string>;
//#endregion
//#region src/media/temp-files.d.ts
/** Best-effort temp-file cleanup helper for optional paths from media conversion flows. */
export declare function unlinkIfExists(filePath: string | null | undefined): Promise<void>;
//#endregion
//#region src/channels/plugins/outbound/direct-text-media.d.ts
type DirectSendOptions = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  replyToId?: string | null;
  mediaUrl?: string;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  maxBytes?: number;
};
type DirectSendResult = {
  messageId: string;
  [key: string]: unknown;
};
type DirectSendFn<TOpts extends Record<string, unknown>, TResult extends DirectSendResult> = (to: string, text: string, opts: TOpts) => Promise<TResult>;
/**
 * Builds a media byte-limit resolver for channels with `mediaMaxMb` config.
 */
export declare function createScopedChannelMediaMaxBytesResolver(channel: string): (params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}) => number | undefined;
/**
 * Creates a channel outbound adapter backed by direct text/media send functions.
 */
export declare function createDirectTextMediaOutbound<TOpts extends Record<string, unknown>, TResult extends DirectSendResult>(params: {
  channel: string;
  resolveSender: (deps: OutboundSendDeps | undefined) => DirectSendFn<TOpts, TResult>;
  resolveMaxBytes: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => number | undefined;
  buildTextOptions: (params: DirectSendOptions) => TOpts;
  buildMediaOptions: (params: DirectSendOptions) => TOpts;
}): ChannelOutboundAdapter;
//#endregion
//#region src/media-understanding/defaults.d.ts
/** Resolves the default provider model for a media capability from config or manifest metadata. */
export declare function resolveDefaultMediaModel(params: {
  providerId: string;
  capability: MediaUnderstandingCapability;
  cfg?: OpenClawConfig;
  workspaceDir?: string;
  providerRegistry?: Map<string, MediaUnderstandingProvider>;
  includeConfiguredImageModels?: boolean;
}): string | undefined;
/** Resolves auto-discovery provider order for a media capability using manifest priorities. */
export declare function resolveAutoMediaKeyProviders(params: {
  capability: MediaUnderstandingCapability;
  cfg?: OpenClawConfig;
  workspaceDir?: string;
  providerRegistry?: Map<string, MediaUnderstandingProvider>;
}): string[];
//#endregion
//#region src/plugin-sdk/media-runtime.d.ts
/** Transcribes the first audio attachment without loading the runner during plugin registration. */
export declare const transcribeFirstAudio: typeof transcribeFirstAudio$1;
/** Resolves an image model through the media runner when selection is requested. */
export declare const resolveAutoImageModel: typeof resolveAutoImageModel$1;
//#endregion
export { type FetchLike, IMAGE_REDUCE_QUALITY_STEPS, MAX_AUDIO_BYTES, MAX_IMAGE_BYTES, MediaFetchError, type MediaKind, type OutboundMediaAccess, type OutboundMediaReadFile, type PollInput, type SavedMedia, type SavedRemoteMedia, buildAgentMediaPayload, buildImageResizeSideGrid, buildOutboundMediaLoadOptions, describeImageWithModel, detectMime, ensureMediaDir, extensionForMime, extractOriginalFilename, fetchRemoteMedia, getAgentScopedMediaLocalRoots, getFileExtension, getImageMetadata, getMediaDir, isGifMedia, isImageProcessorUnavailableError, isInboundPathAllowed, isVoiceCompatibleAudio, isVoiceMessageCompatibleAudio, kindFromMime, maxBytesForKind, mediaKindFromMime, normalizeInboundPathRoots, normalizePollDurationHours, normalizePollInput, readRemoteMediaBuffer, readResponseTextSnippet, readResponseWithLimit, resizeToJpeg, resolveChannelMediaMaxBytes, saveMediaBuffer, saveMediaSource, saveRemoteMedia, saveResponseMedia };