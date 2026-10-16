import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import "./types-C-BtfS0H.js";
import { N as MediaUnderstandingOutput, a as ImagesDescriptionInput, c as MediaUnderstandingDecision, g as StructuredExtractionRequest, l as MediaUnderstandingProvider } from "./types-BooLarQr.js";
import { t as ActiveMediaModel } from "./active-model-Cxn6sQSw.js";
//#region src/media-understanding/runtime-types.d.ts
type RunMediaUnderstandingFileParams = {
  capability: "image" | "audio" | "video";
  filePath: string;
  mediaUrl?: string;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  activeModel?: ActiveMediaModel;
  prompt?: string;
  timeoutMs?: number;
  scopeContext?: MediaUnderstandingScopeContext;
};
type MediaUnderstandingScopeContext = {
  sessionKey?: string;
  channel?: string;
  chatType?: string;
};
type RunMediaUnderstandingFileResult = {
  text: string | undefined;
  provider?: string;
  model?: string;
  output?: MediaUnderstandingOutput;
  decision?: MediaUnderstandingDecision;
};
type DescribeImageFileParams = Omit<RunMediaUnderstandingFileParams, "capability">;
type DescribeImageFileWithModelParams = {
  filePath: string;
  mediaUrl?: string;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  mime?: string;
  provider: string;
  model: string;
  prompt: string;
  maxTokens?: number;
  timeoutMs?: number;
};
type PreparedImageDescriptionInput = ImagesDescriptionInput;
type PrepareImageDescriptionInputParams = Pick<DescribeImageFileWithModelParams, "filePath" | "mediaUrl" | "mime" | "cfg" | "timeoutMs">;
type DescribePreparedImageWithModelParams = Omit<DescribeImageFileWithModelParams, "filePath" | "mediaUrl" | "mime"> & {
  image: PreparedImageDescriptionInput;
};
type DescribeImageFileWithModelResult = Awaited<ReturnType<NonNullable<MediaUnderstandingProvider["describeImage"]>>>;
type ExtractStructuredWithModelParams = Omit<StructuredExtractionRequest, "input" | "agentDir" | "signal" | "timeoutMs"> & {
  /** At least one image input is required; text inputs provide supplemental context. */
  input: StructuredExtractionRequest["input"];
  agentDir?: string;
  timeoutMs?: number;
};
type ExtractStructuredWithModelResult = Awaited<ReturnType<NonNullable<MediaUnderstandingProvider["extractStructured"]>>>;
type DescribeVideoFileParams = Omit<DescribeImageFileParams, "mediaUrl" | "prompt" | "timeoutMs" | "scopeContext">;
type TranscribeAudioFileParams = DescribeVideoFileParams & {
  language?: string;
  prompt?: string;
};
type MediaUnderstandingRuntime = {
  resolveAudioInputBudget: (params: {
    cfg: OpenClawConfig;
  }) => Promise<{
    enabled: false;
  } | {
    enabled: true;
    maxBytes: number;
  }>;
  runMediaUnderstandingFile: (params: RunMediaUnderstandingFileParams) => Promise<RunMediaUnderstandingFileResult>;
  describeImageFile: (params: DescribeImageFileParams) => Promise<RunMediaUnderstandingFileResult>;
  prepareImageDescriptionInput: (params: PrepareImageDescriptionInputParams) => Promise<PreparedImageDescriptionInput>;
  describePreparedImageWithModel: (params: DescribePreparedImageWithModelParams) => Promise<DescribeImageFileWithModelResult>;
  describeImageFileWithModel: (params: DescribeImageFileWithModelParams) => Promise<DescribeImageFileWithModelResult>;
  extractStructuredWithModel: (params: ExtractStructuredWithModelParams) => Promise<ExtractStructuredWithModelResult>;
  describeVideoFile: (params: DescribeVideoFileParams) => Promise<RunMediaUnderstandingFileResult>;
  transcribeAudioFile: (params: TranscribeAudioFileParams) => Promise<RunMediaUnderstandingFileResult>;
};
//#endregion
export { MediaUnderstandingRuntime as a, TranscribeAudioFileParams as c, ExtractStructuredWithModelParams as i, DescribeImageFileWithModelParams as n, RunMediaUnderstandingFileParams as o, DescribeVideoFileParams as r, RunMediaUnderstandingFileResult as s, DescribeImageFileParams as t };