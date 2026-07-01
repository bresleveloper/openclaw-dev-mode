import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { MsgContext } from "../templating.js";
type RuntimePolicyContext = Pick<MsgContext, "AccountId" | "ChatType" | "CommandTargetSessionKey" | "From" | "NativeDirectUserId" | "OriginatingChannel" | "OriginatingTo" | "Provider" | "RuntimePolicySessionKey" | "SenderE164" | "SenderId" | "SenderUsername" | "SessionKey" | "Surface" | "To">;
/** Resolves the session key used for runtime policy checks and direct-message scoping. */
/** Resolves the session key used for sandbox/tool/runtime policy lookups. */
export declare function resolveRuntimePolicySessionKey(params: {
    cfg?: OpenClawConfig;
    ctx?: RuntimePolicyContext;
    sessionKey?: string | null;
}): string | undefined;
export {};
