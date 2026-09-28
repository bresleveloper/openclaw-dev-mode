import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import { s as MsgContext } from "../templating-OpWn1DzT.js";
import "../types-BnfxNjkF.js";
import { _ as StructuredExtractionResult, i as ImageDescriptionResult } from "../types-Bl4TRRJl.js";
import { c as TranscribeAudioFileParams, i as ExtractStructuredWithModelParams, n as DescribeImageFileWithModelParams, o as RunMediaUnderstandingFileParams, r as DescribeVideoFileParams, s as RunMediaUnderstandingFileResult, t as DescribeImageFileParams } from "../runtime-types-MEZA7eox.js";
import { t as transcribeFirstAudio } from "../audio-preflight-DkG1hrbh.js";
//#region src/media-understanding/echo-transcript.d.ts
/** Sends a best-effort transcript echo back to the originating deliverable chat. */
declare function sendTranscriptEcho(params: {
  ctx: MsgContext;
  cfg: OpenClawConfig;
  transcript: string;
  format?: string;
  logSuccess?: boolean;
  failureLogPrefix?: string;
}): Promise<void>;
//#endregion
//#region src/media-understanding/runtime.d.ts
/** Runs media understanding for one local file or remote URL and returns the first matching output. */
export declare function runMediaUnderstandingFile(params: RunMediaUnderstandingFileParams): Promise<RunMediaUnderstandingFileResult>;
/** Describes one image file or URL through the configured image-understanding pipeline. */
export declare function describeImageFile(params: DescribeImageFileParams): Promise<RunMediaUnderstandingFileResult>;
/** Describes one image with an explicit provider/model, bypassing configured media model selection. */
export declare function describeImageFileWithModel(params: DescribeImageFileWithModelParams): Promise<ImageDescriptionResult>;
/** Runs provider-backed structured extraction for multimodal text/image input. */
export declare function extractStructuredWithModel(params: ExtractStructuredWithModelParams): Promise<StructuredExtractionResult>;
/** Describes one video file or URL through the configured video-understanding pipeline. */
export declare function describeVideoFile(params: DescribeVideoFileParams): Promise<RunMediaUnderstandingFileResult>;
/** Transcribes one audio file or URL through the configured audio-understanding pipeline. */
export declare function transcribeAudioFile(params: TranscribeAudioFileParams): Promise<RunMediaUnderstandingFileResult>;
//#endregion
//#region src/plugin-sdk/media-understanding-runtime.d.ts
type TranscribeFirstAudio = typeof transcribeFirstAudio;
type SendTranscriptEcho = typeof sendTranscriptEcho;
export declare function formatAudioTranscriptForAgent(transcript: string): string;
/** Creates shared preflight transcription and deferred-echo behavior for a channel. */
export declare function createChannelPreflightAudio<TAudio>(params: {
  channel: string;
  isAudio: (value: TAudio) => boolean;
  deferTranscriptEcho?: boolean;
  transcribeFirstAudio?: TranscribeFirstAudio;
  sendTranscriptEcho?: SendTranscriptEcho;
}): {
  isAudio: (value: TAudio) => boolean;
  suppress: (cfg: OpenClawConfig) => OpenClawConfig;
  format: (transcript: string, formatTemplate: string) => string;
  resolve(resolveParams: {
    request: Parameters<TranscribeFirstAudio>[0];
    abortSignal?: AbortSignal;
  }): Promise<string | undefined>;
  send(sendParams: {
    transcript: string;
    cfg: OpenClawConfig;
    accountId: string;
    originatingTo: string;
    messageThreadId?: string;
  }): Promise<void>;
};
//#endregion
export type { ExtractStructuredWithModelParams, RunMediaUnderstandingFileParams, RunMediaUnderstandingFileResult };