/**
 * Resolves default exec tool settings from session and config context.
 */
import type { SessionEntry } from "../config/sessions.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type ExecAsk, type ExecHost, type ExecMode, type ExecSecurity, type ExecTarget } from "../infra/exec-approvals.js";
type ResolvedExecConfig = {
    host?: ExecTarget;
    mode?: ExecMode;
    security?: ExecSecurity;
    ask?: ExecAsk;
    node?: string;
};
type ExecOverridesConfig = Omit<ResolvedExecConfig, "mode">;
/** Returns whether the current exec policy allows requesting host node execution. */
export declare function canExecRequestNode(params: {
    cfg?: OpenClawConfig;
    sessionEntry?: SessionEntry;
    execOverrides?: ExecOverridesConfig;
    agentId?: string;
    sessionKey?: string;
    sandboxAvailable?: boolean;
}): boolean;
/** Resolves effective exec host, mode, approval policy, and node availability. */
export declare function resolveExecDefaults(params: {
    cfg?: OpenClawConfig;
    sessionEntry?: SessionEntry;
    execOverrides?: ExecOverridesConfig;
    agentId?: string;
    sessionKey?: string;
    sandboxAvailable?: boolean;
    elevatedRequested?: boolean;
}): {
    host: ExecTarget;
    effectiveHost: ExecHost;
    mode: ExecMode;
    security: ExecSecurity;
    ask: ExecAsk;
    node?: string;
    canRequestNode: boolean;
};
export {};
