import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SandboxConfig, SandboxToolPolicyResolved } from "./types.js";
/** Resolves sandbox mode, effective session scope, and tool policy for a session. */
export declare function resolveSandboxRuntimeStatus(params: {
    cfg?: OpenClawConfig;
    sessionKey?: string;
}): {
    agentId: string;
    sessionKey: string;
    mainSessionKey: string;
    mode: SandboxConfig["mode"];
    sandboxed: boolean;
    toolPolicy: SandboxToolPolicyResolved;
};
/** Formats the user-facing denial message when sandbox tool policy blocks a tool. */
export declare function formatSandboxToolPolicyBlockedMessage(params: {
    cfg?: OpenClawConfig;
    sessionKey?: string;
    toolName: string;
    audit?: boolean;
}): string | undefined;
