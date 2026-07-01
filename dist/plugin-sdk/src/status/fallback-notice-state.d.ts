import type { SessionEntry } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
export type FallbackNoticeState = Pick<SessionEntry, "fallbackNoticeSelectedModel" | "fallbackNoticeActiveModel" | "fallbackNoticeReason">;
export declare function resolveActiveFallbackState(params: {
    selectedModelRef: string;
    activeModelRef: string;
    config?: OpenClawConfig;
    state?: FallbackNoticeState;
}): {
    active: boolean;
    reason?: string;
};
