import { Gp as MediaExecutionContext, Kp as transcribeFirstAudio, a as MsgContext, al as ExtractStructuredWithModelParams, cl as TranscribeAudioFileParams, il as DescribeVideoFileParams, nl as DescribeImageFileParams, ol as RunMediaUnderstandingFileParams, rl as DescribeImageFileWithModelParams, sl as RunMediaUnderstandingFileResult } from "../config-contracts-hzlacViZ.js";
import { gt as StructuredExtractionResult, r as OpenClawConfig } from "../types.openclaw-D8uW-XQA.js";
import "../types-ACDCRjU-.js";
export declare function formatAudioTranscriptForAgent(transcript: string): string;
/** Sends a transcript echo back to the originating deliverable chat. */
declare function sendTranscriptEcho(params: {
  ctx: MsgContext;
  cfg: OpenClawConfig;
  transcript: string;
  format?: string;
  logSuccess?: boolean;
  failureLogPrefix?: string;
}): Promise<void>;
/** Runs media understanding for one local file or remote URL and returns the first matching output. */
export declare function runMediaUnderstandingFile(params: RunMediaUnderstandingFileParams, execution?: MediaExecutionContext): Promise<RunMediaUnderstandingFileResult>;
export declare function describeImageFile(params: DescribeImageFileParams, execution?: MediaExecutionContext): Promise<RunMediaUnderstandingFileResult>;
/** Describes one image with an explicit provider/model, bypassing configured media model selection. */
export declare function describeImageFileWithModel(params: DescribeImageFileWithModelParams): Promise<{
  text: string;
  model?: string;
}>;
export declare function extractStructuredWithModel(params: ExtractStructuredWithModelParams): Promise<StructuredExtractionResult>;
export declare function describeVideoFile(params: DescribeVideoFileParams, execution?: MediaExecutionContext): Promise<RunMediaUnderstandingFileResult>;
export declare function transcribeAudioFile(params: TranscribeAudioFileParams, execution?: MediaExecutionContext): Promise<RunMediaUnderstandingFileResult>;
type TranscribeFirstAudio = typeof transcribeFirstAudio;
type SendTranscriptEcho = typeof sendTranscriptEcho;
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
export type { ExtractStructuredWithModelParams, RunMediaUnderstandingFileParams, RunMediaUnderstandingFileResult };