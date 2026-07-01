import type { MsgContext } from "../auto-reply/templating.js";
import type { OpenClawConfig } from "../config/types.js";
import type { ActiveMediaModel } from "../../packages/media-understanding-common/src/active-model.js";
import type { MediaAttachment, MediaUnderstandingProvider } from "./types.js";
/** Runs the configured audio-understanding pipeline and returns the first transcript output. */
export declare function runAudioTranscription(params: {
    ctx: MsgContext;
    cfg: OpenClawConfig;
    attachments?: MediaAttachment[];
    agentDir?: string;
    providers?: Record<string, MediaUnderstandingProvider>;
    activeModel?: ActiveMediaModel;
    localPathRoots?: readonly string[];
}): Promise<{
    transcript: string | undefined;
    attachments: MediaAttachment[];
}>;
