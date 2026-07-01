import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ReplyPayload } from "../types.js";
export type CompactionNoticePhase = "start" | "end" | "incomplete" | "skipped";
export declare function shouldNotifyUserAboutCompaction(cfg?: OpenClawConfig): boolean;
export declare function createCompactionNoticePayload(params: {
    phase: CompactionNoticePhase;
    currentMessageId?: string;
    applyReplyToMode?: (payload: ReplyPayload) => ReplyPayload;
}): ReplyPayload;
export declare function readCompactionHookMessages(value: unknown): string[];
export declare function createCompactionHookNoticePayload(params: {
    messages: string[];
    currentMessageId?: string;
    applyReplyToMode?: (payload: ReplyPayload) => ReplyPayload;
}): ReplyPayload | undefined;
