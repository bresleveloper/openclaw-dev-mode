import { r as OpenClawConfig } from "./types.openclaw-Ccmw-oTa.js";
import { l as RuntimeMsgContext } from "./templating-0ElMwhje.js";
import "./types-BaRTNmIt.js";
import { l as MediaUnderstandingProvider } from "./types-DtHZVXiQ.js";
import { l as ActiveMediaModel } from "./runtime-types-NGfGL3yx.js";
//#region src/media-understanding/audio-preflight.d.ts
/**
 * Transcribes the first audio attachment BEFORE mention checking.
 * This allows voice notes to be processed in group chats with requireMention: true.
 * Returns the transcript or undefined if transcription fails or no audio is found.
 */
declare function transcribeFirstAudio(params: {
  ctx: RuntimeMsgContext;
  cfg: OpenClawConfig;
  agentDir?: string;
  providers?: Record<string, MediaUnderstandingProvider>;
  activeModel?: ActiveMediaModel;
}): Promise<string | undefined>;
//#endregion
export { transcribeFirstAudio as t };