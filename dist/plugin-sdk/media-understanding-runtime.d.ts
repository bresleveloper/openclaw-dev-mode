import { M as OpenClawConfig } from "../types-D7I_F5Ux.js";
import { Gt as DescribeImageFileWithModelParams, Jt as RunMediaUnderstandingFileParams, Kt as DescribeVideoFileParams, Wt as DescribeImageFileParams, Xt as TranscribeAudioFileParams, Yt as RunMediaUnderstandingFileResult, a as MsgContext, cd as MediaExecutionContext, ld as transcribeFirstAudio, qt as ExtractStructuredWithModelParams } from "../config-contracts-CY87ANNp.js";
import { S as StructuredExtractionResult } from "../image-runtime-VVBqKX5E.js";
//#region src/media-understanding/echo-transcript.d.ts
/** Sends a transcript echo back to the originating deliverable chat. */
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
export declare function describeImageFile(params: DescribeImageFileParams): Promise<RunMediaUnderstandingFileResult>;
/** Describes one image with an explicit provider/model, bypassing configured media model selection. */
export declare function describeImageFileWithModel(params: DescribeImageFileWithModelParams): Promise<{
  text: string;
  model?: string;
}>;
export declare function extractStructuredWithModel(params: ExtractStructuredWithModelParams): Promise<StructuredExtractionResult>;
export declare function describeVideoFile(params: DescribeVideoFileParams): Promise<RunMediaUnderstandingFileResult>;
export declare function transcribeAudioFile(params: TranscribeAudioFileParams, execution?: MediaExecutionContext): Promise<RunMediaUnderstandingFileResult>;
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