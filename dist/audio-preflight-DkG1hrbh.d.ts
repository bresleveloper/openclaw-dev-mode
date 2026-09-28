import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { l as RuntimeMsgContext } from "./templating-OpWn1DzT.js";
import "./types-BnfxNjkF.js";
import { l as MediaUnderstandingProvider } from "./types-Bl4TRRJl.js";
import { l as ActiveMediaModel } from "./runtime-types-MEZA7eox.js";
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