import { Type } from "typebox";
/**
 * Exec approval protocol schemas.
 *
 * These payloads cross the security-review boundary for command execution, so
 * persisted policy, request snapshots, and resolve decisions stay explicit.
 */
/** One persisted allowlist entry for a command pattern or resolved executable. */
export declare const ExecApprovalsAllowlistEntrySchema: Type.TObject<{
    id: Type.TOptional<Type.TString>;
    pattern: Type.TString;
    source: Type.TOptional<Type.TLiteral<"allow-always">>;
    commandText: Type.TOptional<Type.TString>;
    argPattern: Type.TOptional<Type.TString>;
    lastUsedAt: Type.TOptional<Type.TInteger>;
    lastUsedCommand: Type.TOptional<Type.TString>;
    lastResolvedPath: Type.TOptional<Type.TString>;
}>;
/** Default exec approval policy shared by all agents unless overridden. */
export declare const ExecApprovalsDefaultsSchema: Type.TObject<{
    security: Type.TOptional<Type.TString>;
    ask: Type.TOptional<Type.TString>;
    askFallback: Type.TOptional<Type.TString>;
    autoAllowSkills: Type.TOptional<Type.TBoolean>;
}>;
/** Agent-specific exec approval policy and allowlist. */
export declare const ExecApprovalsAgentSchema: Type.TObject<{
    security: Type.TOptional<Type.TString>;
    ask: Type.TOptional<Type.TString>;
    askFallback: Type.TOptional<Type.TString>;
    autoAllowSkills: Type.TOptional<Type.TBoolean>;
    allowlist: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TOptional<Type.TString>;
        pattern: Type.TString;
        source: Type.TOptional<Type.TLiteral<"allow-always">>;
        commandText: Type.TOptional<Type.TString>;
        argPattern: Type.TOptional<Type.TString>;
        lastUsedAt: Type.TOptional<Type.TInteger>;
        lastUsedCommand: Type.TOptional<Type.TString>;
        lastResolvedPath: Type.TOptional<Type.TString>;
    }>>>;
}>;
/** Versioned exec approvals config file edited through gateway APIs. */
export declare const ExecApprovalsFileSchema: Type.TObject<{
    version: Type.TLiteral<1>;
    socket: Type.TOptional<Type.TObject<{
        path: Type.TOptional<Type.TString>;
        token: Type.TOptional<Type.TString>;
    }>>;
    defaults: Type.TOptional<Type.TObject<{
        security: Type.TOptional<Type.TString>;
        ask: Type.TOptional<Type.TString>;
        askFallback: Type.TOptional<Type.TString>;
        autoAllowSkills: Type.TOptional<Type.TBoolean>;
    }>>;
    agents: Type.TOptional<Type.TRecord<"^.*$", Type.TObject<{
        security: Type.TOptional<Type.TString>;
        ask: Type.TOptional<Type.TString>;
        askFallback: Type.TOptional<Type.TString>;
        autoAllowSkills: Type.TOptional<Type.TBoolean>;
        allowlist: Type.TOptional<Type.TArray<Type.TObject<{
            id: Type.TOptional<Type.TString>;
            pattern: Type.TString;
            source: Type.TOptional<Type.TLiteral<"allow-always">>;
            commandText: Type.TOptional<Type.TString>;
            argPattern: Type.TOptional<Type.TString>;
            lastUsedAt: Type.TOptional<Type.TInteger>;
            lastUsedCommand: Type.TOptional<Type.TString>;
            lastResolvedPath: Type.TOptional<Type.TString>;
        }>>>;
    }>>>;
}>;
/** Read snapshot with path/hash metadata for optimistic writes. */
export declare const ExecApprovalsSnapshotSchema: Type.TObject<{
    path: Type.TString;
    exists: Type.TBoolean;
    hash: Type.TString;
    file: Type.TObject<{
        version: Type.TLiteral<1>;
        socket: Type.TOptional<Type.TObject<{
            path: Type.TOptional<Type.TString>;
            token: Type.TOptional<Type.TString>;
        }>>;
        defaults: Type.TOptional<Type.TObject<{
            security: Type.TOptional<Type.TString>;
            ask: Type.TOptional<Type.TString>;
            askFallback: Type.TOptional<Type.TString>;
            autoAllowSkills: Type.TOptional<Type.TBoolean>;
        }>>;
        agents: Type.TOptional<Type.TRecord<"^.*$", Type.TObject<{
            security: Type.TOptional<Type.TString>;
            ask: Type.TOptional<Type.TString>;
            askFallback: Type.TOptional<Type.TString>;
            autoAllowSkills: Type.TOptional<Type.TBoolean>;
            allowlist: Type.TOptional<Type.TArray<Type.TObject<{
                id: Type.TOptional<Type.TString>;
                pattern: Type.TString;
                source: Type.TOptional<Type.TLiteral<"allow-always">>;
                commandText: Type.TOptional<Type.TString>;
                argPattern: Type.TOptional<Type.TString>;
                lastUsedAt: Type.TOptional<Type.TInteger>;
                lastUsedCommand: Type.TOptional<Type.TString>;
                lastResolvedPath: Type.TOptional<Type.TString>;
            }>>>;
        }>>>;
    }>;
}>;
/** Empty request payload for reading local exec approval policy. */
export declare const ExecApprovalsGetParamsSchema: Type.TObject<{}>;
/** Local exec approval policy write request with optional base hash guard. */
export declare const ExecApprovalsSetParamsSchema: Type.TObject<{
    file: Type.TObject<{
        version: Type.TLiteral<1>;
        socket: Type.TOptional<Type.TObject<{
            path: Type.TOptional<Type.TString>;
            token: Type.TOptional<Type.TString>;
        }>>;
        defaults: Type.TOptional<Type.TObject<{
            security: Type.TOptional<Type.TString>;
            ask: Type.TOptional<Type.TString>;
            askFallback: Type.TOptional<Type.TString>;
            autoAllowSkills: Type.TOptional<Type.TBoolean>;
        }>>;
        agents: Type.TOptional<Type.TRecord<"^.*$", Type.TObject<{
            security: Type.TOptional<Type.TString>;
            ask: Type.TOptional<Type.TString>;
            askFallback: Type.TOptional<Type.TString>;
            autoAllowSkills: Type.TOptional<Type.TBoolean>;
            allowlist: Type.TOptional<Type.TArray<Type.TObject<{
                id: Type.TOptional<Type.TString>;
                pattern: Type.TString;
                source: Type.TOptional<Type.TLiteral<"allow-always">>;
                commandText: Type.TOptional<Type.TString>;
                argPattern: Type.TOptional<Type.TString>;
                lastUsedAt: Type.TOptional<Type.TInteger>;
                lastUsedCommand: Type.TOptional<Type.TString>;
                lastResolvedPath: Type.TOptional<Type.TString>;
            }>>>;
        }>>>;
    }>;
    baseHash: Type.TOptional<Type.TString>;
}>;
/** Node-scoped request payload for reading exec approval policy. */
export declare const ExecApprovalsNodeGetParamsSchema: Type.TObject<{
    nodeId: Type.TString;
}>;
/** Node-scoped exec approval policy write request with optional base hash guard. */
export declare const ExecApprovalsNodeSetParamsSchema: Type.TObject<{
    nodeId: Type.TString;
    file: Type.TObject<{
        version: Type.TLiteral<1>;
        socket: Type.TOptional<Type.TObject<{
            path: Type.TOptional<Type.TString>;
            token: Type.TOptional<Type.TString>;
        }>>;
        defaults: Type.TOptional<Type.TObject<{
            security: Type.TOptional<Type.TString>;
            ask: Type.TOptional<Type.TString>;
            askFallback: Type.TOptional<Type.TString>;
            autoAllowSkills: Type.TOptional<Type.TBoolean>;
        }>>;
        agents: Type.TOptional<Type.TRecord<"^.*$", Type.TObject<{
            security: Type.TOptional<Type.TString>;
            ask: Type.TOptional<Type.TString>;
            askFallback: Type.TOptional<Type.TString>;
            autoAllowSkills: Type.TOptional<Type.TBoolean>;
            allowlist: Type.TOptional<Type.TArray<Type.TObject<{
                id: Type.TOptional<Type.TString>;
                pattern: Type.TString;
                source: Type.TOptional<Type.TLiteral<"allow-always">>;
                commandText: Type.TOptional<Type.TString>;
                argPattern: Type.TOptional<Type.TString>;
                lastUsedAt: Type.TOptional<Type.TInteger>;
                lastUsedCommand: Type.TOptional<Type.TString>;
                lastResolvedPath: Type.TOptional<Type.TString>;
            }>>>;
        }>>>;
    }>;
    baseHash: Type.TOptional<Type.TString>;
}>;
/** Lookup request for one pending exec approval by id. */
export declare const ExecApprovalGetParamsSchema: Type.TObject<{
    id: Type.TString;
}>;
/** Pending command execution approval request shown to reviewers. */
export declare const ExecApprovalRequestParamsSchema: Type.TObject<{
    id: Type.TOptional<Type.TString>;
    command: Type.TOptional<Type.TString>;
    commandArgv: Type.TOptional<Type.TArray<Type.TString>>;
    systemRunPlan: Type.TOptional<Type.TObject<{
        argv: Type.TArray<Type.TString>;
        cwd: Type.TUnion<[Type.TString, Type.TNull]>;
        commandText: Type.TString;
        commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        agentId: Type.TUnion<[Type.TString, Type.TNull]>;
        sessionKey: Type.TUnion<[Type.TString, Type.TNull]>;
        mutableFileOperand: Type.TOptional<Type.TUnion<[Type.TObject<{
            argvIndex: Type.TInteger;
            path: Type.TString;
            sha256: Type.TString;
        }>, Type.TNull]>>;
    }>>;
    env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    cwd: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    security: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    ask: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    unavailableDecisions: Type.TOptional<Type.TArray<Type.TString>>;
    commandSpans: Type.TOptional<Type.TArray<Type.TObject<{
        startIndex: Type.TInteger;
        endIndex: Type.TInteger;
    }>>>;
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    resolvedPath: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    sessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    turnSourceChannel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    turnSourceTo: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    turnSourceAccountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    turnSourceThreadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber, Type.TNull]>>;
    approvalReviewerDeviceIds: Type.TOptional<Type.TArray<Type.TString>>;
    requireDeliveryRoute: Type.TOptional<Type.TBoolean>;
    suppressDelivery: Type.TOptional<Type.TBoolean>;
    timeoutMs: Type.TOptional<Type.TInteger>;
    twoPhase: Type.TOptional<Type.TBoolean>;
}>;
/** Reviewer decision payload for one pending exec approval. */
export declare const ExecApprovalResolveParamsSchema: Type.TObject<{
    id: Type.TString;
    decision: Type.TString;
}>;
