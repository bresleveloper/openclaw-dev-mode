import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { MsgContext, TemplateContext } from "../templating.js";
export declare const SCP_STDERR_TAIL_CHARS = 16384;
export type StageSandboxMediaResult = {
    staged: ReadonlyMap<string, string>;
};
export declare function stageSandboxMedia(params: {
    ctx: MsgContext;
    sessionCtx: TemplateContext;
    cfg: OpenClawConfig;
    sessionKey?: string;
    workspaceDir: string;
}): Promise<StageSandboxMediaResult>;
export declare function appendScpStderrTail(current: string, chunk: string, maxChars?: number): string;
