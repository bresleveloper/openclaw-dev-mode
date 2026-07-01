import type { MsgContext } from "../auto-reply/templating.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type ApplyLinkUnderstandingResult = {
    outputs: string[];
    urls: string[];
};
/** Runs link understanding and folds successful outputs into the inbound context. */
export declare function applyLinkUnderstanding(params: {
    ctx: MsgContext;
    cfg: OpenClawConfig;
}): Promise<ApplyLinkUnderstandingResult>;
export {};
