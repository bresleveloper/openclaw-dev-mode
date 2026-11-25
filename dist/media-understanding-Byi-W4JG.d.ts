import { ot as AudioTranscriptionResult, vt as VideoDescriptionResult } from "./types.openclaw-D8uW-XQA.js";
import { d as AudioTranscriptionRequest, h as VideoDescriptionRequest } from "./image-runtime-CA1hAb1m.js";
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
declare function resolveMediaUnderstandingString(value: string | undefined, fallback: string): string;
declare function coerceOpenAiCompatibleVideoText(payload: OpenAiCompatibleVideoPayload): string | null;
declare function buildOpenAiCompatibleVideoRequestBody(params: {
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
/** Describe a video through an OpenAI-compatible chat-completions endpoint. */
declare function describeOpenAiCompatibleVideo(params: VideoDescriptionRequest & {
  defaultBaseUrl: string;
  defaultModel: string;
  defaultPrompt: string;
  provider: string;
  providerLabel: string;
}): Promise<VideoDescriptionResult>;
/** Sends an OpenAI-compatible audio transcription request and returns validated text output. */
declare function transcribeOpenAiCompatibleAudio(params: AudioTranscriptionRequest & {
  defaultBaseUrl: string;
  defaultModel: string;
  provider?: string;
  /** Form field that carries `language`; some models take a `languages[]` list instead. */
  languageField?: "language" | "languages[]";
}): Promise<AudioTranscriptionResult>;
export { coerceOpenAiCompatibleVideoText as a, buildOpenAiCompatibleVideoRequestBody as i, describeOpenAiCompatibleVideo as n, resolveMediaUnderstandingString as o, OpenAiCompatibleVideoPayload as r, transcribeOpenAiCompatibleAudio as t };