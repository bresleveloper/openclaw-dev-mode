declare const SUBAGENT_ROLES: readonly ["orchestrator", "leaf"];
declare const SUBAGENT_CONTROL_SCOPES: readonly ["children", "none"];
type SubagentRole = (typeof SUBAGENT_ROLES)[number];
type SubagentControlScope = (typeof SUBAGENT_CONTROL_SCOPES)[number];
export type AcpSessionLineageMeta = {
    /** Stable session key emitted to ACP clients. */
    sessionKey: string;
    kind?: string;
    channel?: string;
    /** Best available parent session id, preferring explicit parentSessionKey over legacy spawnedBy. */
    parentSessionId?: string;
    spawnedBy?: string;
    spawnDepth?: number;
    subagentRole?: SubagentRole;
    subagentControlScope?: SubagentControlScope;
    spawnedWorkspaceDir?: string;
    spawnedCwd?: string;
};
export type AcpSessionLineageRow = {
    /** Raw persisted session key; kept even when other optional fields are malformed. */
    key: string;
    kind?: string;
    channel?: string;
    parentSessionKey?: string;
    spawnedBy?: string;
    spawnDepth?: number;
    subagentRole?: string;
    subagentControlScope?: string;
    spawnedWorkspaceDir?: string;
    spawnedCwd?: string;
};
/** Converts persisted session rows into compact ACP lineage metadata for protocol responses. */
export declare function toAcpSessionLineageMeta(row: AcpSessionLineageRow): AcpSessionLineageMeta;
export {};
