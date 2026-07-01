import type { SessionsPatchParams } from "../../packages/gateway-protocol/src/index.js";
import type { SessionEntry } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Triggers internal session patch hooks when listeners are registered. */
export declare function triggerSessionPatchHook(params: {
    cfg: OpenClawConfig;
    sessionEntry: SessionEntry;
    sessionKey: string;
    patch: SessionsPatchParams;
}): void;
