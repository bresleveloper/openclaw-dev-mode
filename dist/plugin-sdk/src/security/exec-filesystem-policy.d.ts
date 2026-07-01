import type { OpenClawConfig } from "../config/config.js";
import type { ExecToolConfig } from "../config/types.tools.js";
/** Scope where exec-like tools remain available while mutating filesystem tools are disabled. */
export type ExecFilesystemPolicyDriftHit = {
    scopeLabel: string;
    runtimeTools: string[];
    disabledFilesystemTools: string[];
    sandboxMode: "off" | "non-main" | "all";
    sandboxWorkspaceAccess: "none" | "ro" | "rw";
    execHost: NonNullable<ExecToolConfig["host"]>;
};
/** Find policy scopes where exec can still mutate files despite disabled fs tools. */
export declare function collectExecFilesystemPolicyDriftHits(cfg: OpenClawConfig): ExecFilesystemPolicyDriftHit[];
