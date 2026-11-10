import { H as ModelProviderConfig, M as OpenClawConfig, bt as Model, vt as MaybePromise } from "./types-D7I_F5Ux.js";
import "./index-DsXRfkLu.js";
import { t as Result } from "./result-VHVNeWs6.js";
import { o as AuthProfileStore } from "./types-CRfF42Lb.js";
//#region packages/media-understanding-common/src/types.d.ts
type MediaUnderstandingKind = "audio.transcription" | "video.description" | "image.description";
type MediaUnderstandingCapability = "image" | "audio" | "video";
/** Normalized text output produced by media understanding. */
type MediaUnderstandingOutput = {
  kind: MediaUnderstandingKind;
  attachmentIndex: number;
  text: string;
  provider: string;
  model?: string;
  requestedBackend?: string;
  observedBackend?: string;
};
//#endregion
//#region src/agents/provider-request-config.types.d.ts
/** Auth override accepted from sanitized provider/model request config. */
type ProviderRequestAuthOverride = {
  mode: "provider-default";
} | {
  mode: "authorization-bearer";
  token: string;
} | {
  mode: "header";
  headerName: string;
  value: string;
  prefix?: string;
};
/** TLS override accepted from sanitized provider/model request config. */
type ProviderRequestTlsOverride = {
  ca?: string;
  cert?: string;
  key?: string;
  passphrase?: string;
  serverName?: string;
  insecureSkipVerify?: boolean;
};
/** Proxy override accepted from sanitized provider/model request config. */
type ProviderRequestProxyOverride = {
  mode: "env-proxy";
  tls?: ProviderRequestTlsOverride;
} | {
  mode: "explicit-proxy";
  url: string;
  tls?: ProviderRequestTlsOverride;
};
type ProviderRequestTransportOverrides = {
  headers?: Record<string, string>;
  auth?: ProviderRequestAuthOverride;
  proxy?: ProviderRequestProxyOverride;
  tls?: ProviderRequestTlsOverride;
};
type ModelProviderRequestTransportOverrides = ProviderRequestTransportOverrides & {
  allowPrivateNetwork?: boolean;
};
//#endregion
//#region src/media-understanding/types.d.ts
/** Agent-owned runtime handle carried opaquely through media provider requests. */
type MediaPreparedModelRuntime = Readonly<{
  agentDir: string;
  workspaceDir?: string;
  config: OpenClawConfig;
  createStores: () => unknown;
}>;
type MediaUnderstandingDecisionOutcome = "success" | "failed" | "skipped" | "disabled" | "no-attachment" | "scope-deny";
type MediaUnderstandingModelDecision = {
  provider?: string;
  model?: string;
  requestedBackend?: string;
  observedBackend?: string;
  type: "provider" | "cli";
  outcome: "success" | "skipped" | "failed";
  reason?: string;
};
type MediaUnderstandingAttachmentDecision = {
  attachmentIndex: number;
  attempts: MediaUnderstandingModelDecision[];
  chosen?: MediaUnderstandingModelDecision;
};
type MediaAttachmentDisposition = {
  kind: "handled";
} | {
  kind: "handed-to-native-vision";
} | {
  kind: "not-selected";
} | {
  kind: "capability-disabled";
} | {
  kind: "no-model";
} | {
  kind: "scope-denied";
} | {
  kind: "failed";
  reason?: string;
};
type MediaAttachmentProcessing = "completed" | "omitted";
type MediaUnderstandingDecision = {
  capability: MediaUnderstandingCapability;
  outcome: MediaUnderstandingDecisionOutcome;
  attachments: MediaUnderstandingAttachmentDecision[];
  attachmentDispositions?: Record<number, MediaAttachmentDisposition>;
  attachmentProcessing?: Record<number, MediaAttachmentProcessing>;
  nativeVisionActive?: boolean;
};
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
  query?: Record<string, string | number | boolean>;
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
type MediaUnderstandingTextResult = {
  text: string;
  model?: string;
};
type AudioTranscriptionResult = MediaUnderstandingTextResult;
type AudioTranscriptionConfigContext = Pick<AudioTranscriptionRequest, "baseUrl" | "headers" | "request" | "model"> & {
  cfg: OpenClawConfig;
  agentDir?: string;
  workspaceDir?: string;
  profile?: string;
  preferredProfile?: string;
};
type AudioTranscriptionContext = Omit<AudioTranscriptionRequest, "apiKey" | "auth"> & AudioTranscriptionConfigContext;
type VideoDescriptionRequest = MediaUnderstandingProviderRequest;
type VideoDescriptionResult = MediaUnderstandingTextResult;
type ImageDescriptionRequest = ImagesDescriptionInput & Omit<ImagesDescriptionRequest, "images">;
type ImagesDescriptionInput = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
};
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
  preparedModelRuntime?: MediaPreparedModelRuntime;
  cfg: OpenClawConfig;
};
type ImageDescriptionResult = MediaUnderstandingTextResult;
type ImagesDescriptionResult = ImageDescriptionResult;
type StructuredExtractionTextInput = {
  type: "text";
  text: string;
};
type StructuredExtractionImageInput = ImagesDescriptionInput & {
  type: "image";
};
type StructuredExtractionInput = StructuredExtractionTextInput | StructuredExtractionImageInput;
type StructuredExtractionRequest = Omit<ImagesDescriptionRequest, "images" | "prompt" | "maxTokens" | "agentId" | "workspaceDir" | "preparedModelRuntime"> & {
  /** Image-first extraction input; callers must include at least one image. */
  input: StructuredExtractionInput[];
  instructions: string;
  schemaName?: string;
  jsonSchema?: unknown;
  jsonMode?: boolean;
};
type StructuredExtractionResult = {
  text: string;
  parsed?: unknown;
  model?: string;
  provider?: string;
  contentType?: "json" | "text";
};
type MediaUnderstandingDocumentModelDefaults = {
  textExtraction?: string;
  image?: string | false;
};
type MediaUnderstandingProviderAuthContext = {
  config?: OpenClawConfig;
  provider: string;
  providerConfig?: ModelProviderConfig;
};
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
type MediaUnderstandingProvider = {
  id: string;
  capabilities?: MediaUnderstandingCapability[];
  defaultModels?: Partial<Record<MediaUnderstandingCapability, string>>;
  autoPriority?: Partial<Record<MediaUnderstandingCapability, number>>;
  nativeDocumentInputs?: Array<"pdf">;
  documentModels?: Partial<Record<"pdf", MediaUnderstandingDocumentModelDefaults>>;
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
//#endregion
//#region src/media-understanding/image-runtime.d.ts
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
//#endregion
export { StructuredExtractionTextInput as C, ProviderRequestTransportOverrides as D, ModelProviderRequestTransportOverrides as E, MediaUnderstandingCapability as O, StructuredExtractionResult as S, VideoDescriptionResult as T, MediaUnderstandingProviderRequestAuth as _, AudioTranscriptionConfigContext as a, StructuredExtractionInput as b, ImageDescriptionRequest as c, ImagesDescriptionRequest as d, ImagesDescriptionResult as f, MediaUnderstandingProviderAuthResult as g, MediaUnderstandingProviderAuthContext as h, describeImagesWithModelPayloadTransform as i, MediaUnderstandingOutput as k, ImageDescriptionResult as l, MediaUnderstandingProvider as m, describeImageWithModelPayloadTransform as n, AudioTranscriptionRequest as o, MediaUnderstandingDecision as p, describeImagesWithModel as r, AudioTranscriptionResult as s, describeImageWithModel as t, ImagesDescriptionInput as u, MediaUnderstandingProviderSyntheticAuthResult as v, VideoDescriptionRequest as w, StructuredExtractionRequest as x, StructuredExtractionImageInput as y };