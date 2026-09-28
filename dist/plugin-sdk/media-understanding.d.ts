import { _ as StructuredExtractionResult, a as ImagesDescriptionInput, b as VideoDescriptionResult, d as MediaUnderstandingProviderAuthResult, f as MediaUnderstandingProviderRequestAuth, g as StructuredExtractionRequest, h as StructuredExtractionInput, i as ImageDescriptionResult, l as MediaUnderstandingProvider, m as StructuredExtractionImageInput, n as AudioTranscriptionResult, o as ImagesDescriptionRequest, p as MediaUnderstandingProviderSyntheticAuthResult, r as ImageDescriptionRequest, s as ImagesDescriptionResult, t as AudioTranscriptionRequest, u as MediaUnderstandingProviderAuthContext, v as StructuredExtractionTextInput, y as VideoDescriptionRequest } from "../types-Bl4TRRJl.js";
import { i as describeImagesWithModelPayloadTransform, n as describeImageWithModelPayloadTransform, r as describeImagesWithModel, t as describeImageWithModel } from "../image-runtime-DANP1F93.js";
//#region packages/media-understanding-common/src/openai-compatible-video.d.ts
/** Minimal OpenAI-compatible video response payload shape. */
type OpenAiCompatibleVideoPayload = {
  choices?: Array<{
    message?: {
      content?: string | Array<{
        text?: string;
      }>;
      reasoning_content?: string;
    };
  }>;
};
/** Trim optional strings, falling back when empty. */
export declare function resolveMediaUnderstandingString(value: string | undefined, fallback: string): string;
/** Coerce text from OpenAI-compatible content or reasoning fields. */
export declare function coerceOpenAiCompatibleVideoText(payload: OpenAiCompatibleVideoPayload): string | null;
/** Build an OpenAI-compatible request body with an inline data URL video. */
export declare function buildOpenAiCompatibleVideoRequestBody(params: {
  model: string;
  prompt: string;
  mime: string;
  buffer: Buffer;
}): {
  model: string;
  messages: {
    role: string;
    content: ({
      type: string;
      text: string;
      video_url?: undefined;
    } | {
      text?: undefined;
      type: string;
      video_url: {
        url: string;
      };
    })[];
  }[];
};
//#endregion
//#region src/media-understanding/openai-compatible-video.d.ts
/** Describe a video through an OpenAI-compatible chat-completions endpoint. */
export declare function describeOpenAiCompatibleVideo(params: VideoDescriptionRequest & {
  defaultBaseUrl: string;
  defaultModel: string;
  defaultPrompt: string;
  provider: string;
  providerLabel: string;
}): Promise<VideoDescriptionResult>;
//#endregion
//#region src/media-understanding/openai-compatible-audio.d.ts
type OpenAiCompatibleAudioParams = AudioTranscriptionRequest & {
  defaultBaseUrl: string;
  defaultModel: string;
  provider?: string;
};
/** Sends an OpenAI-compatible audio transcription request and returns validated text output. */
export declare function transcribeOpenAiCompatibleAudio(params: OpenAiCompatibleAudioParams): Promise<AudioTranscriptionResult>;
//#endregion
export { type AudioTranscriptionRequest, type AudioTranscriptionResult, type ImageDescriptionRequest, type ImageDescriptionResult, type ImagesDescriptionInput, type ImagesDescriptionRequest, type ImagesDescriptionResult, type MediaUnderstandingProvider, type MediaUnderstandingProviderAuthContext, type MediaUnderstandingProviderAuthResult, type MediaUnderstandingProviderRequestAuth, type MediaUnderstandingProviderSyntheticAuthResult, type OpenAiCompatibleVideoPayload, type StructuredExtractionImageInput, type StructuredExtractionInput, type StructuredExtractionRequest, type StructuredExtractionResult, type StructuredExtractionTextInput, type VideoDescriptionRequest, type VideoDescriptionResult, describeImageWithModel, describeImageWithModelPayloadTransform, describeImagesWithModel, describeImagesWithModelPayloadTransform };