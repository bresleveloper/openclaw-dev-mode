import { ct as ImagesDescriptionInput, gt as StructuredExtractionResult, ht as StructuredExtractionInput, lt as ImagesDescriptionResult, ot as AudioTranscriptionResult, pt as MediaUnderstandingProviderMetadata, r as OpenClawConfig, st as ImageDescriptionResult, ut as MediaUnderstandingCapability, vt as VideoDescriptionResult } from "./types.openclaw-D8uW-XQA.js";
import { c as MaybePromise, u as Model } from "./types-B1zI2CfC.js";
import "./index-DU_vyQtb.js";
import { o as ProviderResolveSyntheticAuthContext, p as AuthProfileStore, t as ModelProviderRequestTransportOverrides } from "./provider-request-config.types-BDimJcpZ.js";
import { t as Result } from "./result-CJ6jzG61.js";
type MediaUnderstandingProviderRequestAuth = {
  kind: "api-key";
  apiKey: string;
  source?: string;
} | {
  kind: "none";
  source: string;
};
type AudioTranscriptionRequest = MediaUnderstandingProviderRequest & {
  language?: string;
  query?: Record<string, string | number | boolean | string[]>;
};
type MediaUnderstandingProviderRequest = ImagesDescriptionInput & {
  /** Compatibility field for existing providers; prefer auth.kind/apiKey. */
  apiKey: string;
  auth?: MediaUnderstandingProviderRequestAuth;
  baseUrl?: string;
  headers?: Record<string, string>;
  request?: ModelProviderRequestTransportOverrides;
  model?: string;
  prompt?: string;
  timeoutMs: number;
  signal?: AbortSignal;
  fetchFn?: typeof fetch;
};
type VideoDescriptionRequest = MediaUnderstandingProviderRequest;
type MediaUnderstandingProviderAuthResult = {
  kind: "none";
  source: string;
} | {
  kind: "api-key";
  apiKey: string;
  source: string;
  mode?: "api-key";
};
type MediaUnderstandingProviderSyntheticAuthResult = {
  apiKey: string;
  source: string;
  mode: "api-key";
};
type AudioTranscriptionConfigContext = Pick<AudioTranscriptionRequest, "baseUrl" | "headers" | "request" | "model"> & {
  cfg: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  profile?: string;
  preferredProfile?: string;
};
type AudioTranscriptionContext = Omit<AudioTranscriptionRequest, "apiKey" | "auth"> & AudioTranscriptionConfigContext;
type ImageDescriptionRequest = ImagesDescriptionInput & Omit<ImagesDescriptionRequest, "images">;
type ImagesDescriptionRequest = {
  images: ImagesDescriptionInput[];
  model: string;
  provider: string;
  prompt?: string;
  maxTokens?: number;
  timeoutMs: number;
  signal?: AbortSignal;
  profile?: string;
  preferredProfile?: string;
  authStore?: AuthProfileStore;
  agentId?: string;
  agentDir: string;
  workspaceDir?: string;
  /** Agent-owned runtime handle carried opaquely through media provider requests. */
  preparedModelRuntime?: Readonly<{
    agentDir: string;
    workspaceDir?: string;
    config: OpenClawConfig;
    createStores: () => unknown;
  }>;
  cfg: OpenClawConfig;
};
type StructuredExtractionRequest = Omit<ImagesDescriptionRequest, "images" | "prompt" | "maxTokens" | "agentId" | "workspaceDir" | "preparedModelRuntime"> & {
  /** Image-first extraction input; callers must include at least one image. */
  input: StructuredExtractionInput[];
  instructions: string;
  schemaName?: string;
  jsonSchema?: unknown;
  jsonMode?: boolean;
};
type MediaUnderstandingProviderAuthContext = ProviderResolveSyntheticAuthContext;
type MediaUnderstandingProvider = MediaUnderstandingProviderMetadata & {
  id: string;
  /** Add image capability from this request's configured model inputs, not registration config. */
  inheritConfiguredImageCapability?: boolean;
  /** Narrow capability-less shared entries; undefined preserves all effective capabilities. */
  sharedEntryCapabilities?: MediaUnderstandingCapability[];
  resolveAuth?: (ctx: MediaUnderstandingProviderAuthContext) => MediaUnderstandingProviderAuthResult | null | undefined;
  /** @deprecated Use resolveAuth. */
  resolveSyntheticAuth?: (ctx: MediaUnderstandingProviderAuthContext) => MediaUnderstandingProviderSyntheticAuthResult | null | undefined;
  transcribeAudio?: (req: AudioTranscriptionRequest) => Promise<AudioTranscriptionResult>;
  /** Checks provider-owned credentials and transport settings without uploading audio. */
  isAudioConfigured?: (context: AudioTranscriptionConfigContext) => boolean | Promise<boolean>;
  /** Called after file loading. Result.error is only a rejection before audio upload;
   * upload/HTTP failures must throw and stop automatic provider selection. */
  transcribeAudioWithContext?: (req: AudioTranscriptionContext) => Promise<Result<AudioTranscriptionResult, unknown>>;
  describeVideo?: (req: VideoDescriptionRequest) => Promise<VideoDescriptionResult>;
  describeImage?: (req: ImageDescriptionRequest) => Promise<ImageDescriptionResult>;
  describeImages?: (req: ImagesDescriptionRequest) => Promise<ImagesDescriptionResult>;
  extractStructured?: (req: StructuredExtractionRequest) => Promise<StructuredExtractionResult>;
};
declare const describeImageWithModel: (params: ImageDescriptionRequest) => Promise<{
  text: string;
  model?: string;
}>;
declare const describeImagesWithModel: (params: ImagesDescriptionRequest) => Promise<{
  text: string;
  model?: string;
}>;
declare const describeImageWithModelPayloadTransform: (params: ImageDescriptionRequest, onPayload: ((payload: unknown, model: Model) => MaybePromise<unknown>) | undefined) => Promise<{
  text: string;
  model?: string;
}>;
declare const describeImagesWithModelPayloadTransform: (params: ImagesDescriptionRequest, onPayload: ((payload: unknown, model: Model) => MaybePromise<unknown>) | undefined) => Promise<{
  text: string;
  model?: string;
}>;
export { AudioTranscriptionConfigContext as a, MediaUnderstandingProvider as c, AudioTranscriptionRequest as d, MediaUnderstandingProviderAuthResult as f, VideoDescriptionRequest as h, describeImagesWithModelPayloadTransform as i, MediaUnderstandingProviderAuthContext as l, MediaUnderstandingProviderSyntheticAuthResult as m, describeImageWithModelPayloadTransform as n, ImageDescriptionRequest as o, MediaUnderstandingProviderRequestAuth as p, describeImagesWithModel as r, ImagesDescriptionRequest as s, describeImageWithModel as t, StructuredExtractionRequest as u };