import type { MsgContext } from "../auto-reply/templating.js";
import type { OpenClawConfig } from "../config/types.js";
import type { ActiveMediaModel } from "../../packages/media-understanding-common/src/active-model.js";
import type { MediaUnderstandingDecision, MediaUnderstandingOutput, MediaUnderstandingProvider } from "./types.js";
type ApplyMediaUnderstandingResult = {
    outputs: MediaUnderstandingOutput[];
    decisions: MediaUnderstandingDecision[];
    appliedImage: boolean;
    appliedAudio: boolean;
    appliedVideo: boolean;
    appliedFile: boolean;
};
export declare function sanitizeMimeType(value?: string): string | undefined;
export declare function applyMediaUnderstanding(params: {
    ctx: MsgContext;
    cfg: OpenClawConfig;
    agentId?: string;
    agentDir?: string;
    workspaceDir?: string;
    providers?: Record<string, MediaUnderstandingProvider>;
    activeModel?: ActiveMediaModel;
}): Promise<ApplyMediaUnderstandingResult>;
export {};
