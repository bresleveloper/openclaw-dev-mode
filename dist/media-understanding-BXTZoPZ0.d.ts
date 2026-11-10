import { T as VideoDescriptionResult, o as AudioTranscriptionRequest, s as AudioTranscriptionResult, w as VideoDescriptionRequest } from "./image-runtime-VVBqKX5E.js";
//#region packages/media-understanding-common/src/openai-compatible-video.d.ts
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
//#endregion
//#region src/media-understanding/openai-compatible-video.d.ts
/** Describe a video through an OpenAI-compatible chat-completions endpoint. */
declare function describeOpenAiCompatibleVideo(params: VideoDescriptionRequest & {
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
declare function transcribeOpenAiCompatibleAudio(params: OpenAiCompatibleAudioParams): Promise<AudioTranscriptionResult>;
//#endregion
export { coerceOpenAiCompatibleVideoText as a, buildOpenAiCompatibleVideoRequestBody as i, describeOpenAiCompatibleVideo as n, resolveMediaUnderstandingString as o, OpenAiCompatibleVideoPayload as r, transcribeOpenAiCompatibleAudio as t };