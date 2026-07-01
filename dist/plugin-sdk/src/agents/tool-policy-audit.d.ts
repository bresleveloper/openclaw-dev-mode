import type { SandboxConfig } from "./sandbox/types.js";
import { type ToolPolicyLike } from "./tool-policy.js";
/** Log level used for tool-policy audit events. */
export type ToolPolicyAuditLogLevel = "info" | "debug";
/** Log tools removed by an allow/deny policy filter step. */
export declare function auditToolPolicyFilter(params: {
    stepLabel: string;
    policy: ToolPolicyLike;
    before: readonly {
        name: string;
    }[];
    after: readonly {
        name: string;
    }[];
    logLevel?: ToolPolicyAuditLogLevel;
}): void;
/** Log a sandbox tool blocked by policy before execution. */
export declare function auditSandboxToolPolicyBlock(params: {
    toolName: string;
    ruleType: "allow" | "deny";
    ruleSource: "agent" | "global" | "default";
    configKey: string;
    policy?: ToolPolicyLike;
    mode: SandboxConfig["mode"];
}): void;
