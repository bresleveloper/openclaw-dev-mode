import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { pt as RuntimeMsgContext } from "./reply-payload-DazZPys5.js";
import "./types-C-BtfS0H.js";
import { l as MediaUnderstandingProvider } from "./types-BooLarQr.js";
import { t as ActiveMediaModel } from "./active-model-Cxn6sQSw.js";
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