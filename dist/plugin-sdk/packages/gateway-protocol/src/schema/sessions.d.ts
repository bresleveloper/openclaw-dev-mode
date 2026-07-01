import { Type } from "typebox";
/**
 * Session protocol schemas.
 *
 * These requests and results cover transcript discovery, lifecycle control,
 * compaction checkpoints, per-session plugin state, and usage reporting. The
 * schemas are shared by dashboard, CLI, ACP, and gateway RPC callers.
 */
/** Reason a compaction checkpoint was created. */
export declare const SessionCompactionCheckpointReasonSchema: Type.TUnion<[Type.TLiteral<"manual">, Type.TLiteral<"auto-threshold">, Type.TLiteral<"overflow-retry">, Type.TLiteral<"timeout-retry">]>;
/** Start/end event emitted while a session compaction operation runs. */
export declare const SessionOperationEventSchema: Type.TObject<{
    operationId: Type.TString;
    operation: Type.TLiteral<"compact">;
    phase: Type.TUnion<[Type.TLiteral<"start">, Type.TLiteral<"end">]>;
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    ts: Type.TInteger;
    completed: Type.TOptional<Type.TBoolean>;
    reason: Type.TOptional<Type.TString>;
}>;
/** Reference to the transcript location before or after compaction. */
export declare const SessionCompactionTranscriptReferenceSchema: Type.TObject<{
    sessionId: Type.TString;
    sessionFile: Type.TOptional<Type.TString>;
    leafId: Type.TOptional<Type.TString>;
    entryId: Type.TOptional<Type.TString>;
}>;
/** Stored compaction checkpoint metadata for branching or restoring a session. */
export declare const SessionCompactionCheckpointSchema: Type.TObject<{
    checkpointId: Type.TString;
    sessionKey: Type.TString;
    sessionId: Type.TString;
    createdAt: Type.TInteger;
    reason: Type.TUnion<[Type.TLiteral<"manual">, Type.TLiteral<"auto-threshold">, Type.TLiteral<"overflow-retry">, Type.TLiteral<"timeout-retry">]>;
    tokensBefore: Type.TOptional<Type.TInteger>;
    tokensAfter: Type.TOptional<Type.TInteger>;
    summary: Type.TOptional<Type.TString>;
    firstKeptEntryId: Type.TOptional<Type.TString>;
    preCompaction: Type.TObject<{
        sessionId: Type.TString;
        sessionFile: Type.TOptional<Type.TString>;
        leafId: Type.TOptional<Type.TString>;
        entryId: Type.TOptional<Type.TString>;
    }>;
    postCompaction: Type.TObject<{
        sessionId: Type.TString;
        sessionFile: Type.TOptional<Type.TString>;
        leafId: Type.TOptional<Type.TString>;
        entryId: Type.TOptional<Type.TString>;
    }>;
}>;
/** Session file grouping used by the Control UI session workspace rail. */
export declare const SessionFileKindSchema: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
/** Session relevance marker for browser entries. */
export declare const SessionFileRelevanceSchema: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]>;
/** One file path referenced by a session transcript. */
export declare const SessionFileEntrySchema: Type.TObject<{
    path: Type.TString;
    name: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
}>;
/** One file or folder in the session-rooted browser. */
export declare const SessionFileBrowserEntrySchema: Type.TObject<{
    path: Type.TString;
    name: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
    sessionKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]>>;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
}>;
/** Folder listing or search result rooted at the session workspace. */
export declare const SessionFileBrowserResultSchema: Type.TObject<{
    path: Type.TString;
    parentPath: Type.TOptional<Type.TString>;
    search: Type.TOptional<Type.TString>;
    entries: Type.TArray<Type.TObject<{
        path: Type.TString;
        name: Type.TString;
        kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
        sessionKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]>>;
        size: Type.TOptional<Type.TInteger>;
        updatedAtMs: Type.TOptional<Type.TInteger>;
    }>>;
    truncated: Type.TOptional<Type.TBoolean>;
}>;
/** Lists files touched by a session transcript. */
export declare const SessionsFilesListParamsSchema: Type.TObject<{
    sessionKey: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    path: Type.TOptional<Type.TString>;
    search: Type.TOptional<Type.TString>;
}>;
/** File references visible in one session workspace. */
export declare const SessionsFilesListResultSchema: Type.TObject<{
    sessionKey: Type.TString;
    root: Type.TOptional<Type.TString>;
    files: Type.TArray<Type.TObject<{
        path: Type.TString;
        name: Type.TString;
        kind: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
        missing: Type.TBoolean;
        size: Type.TOptional<Type.TInteger>;
        updatedAtMs: Type.TOptional<Type.TInteger>;
        content: Type.TOptional<Type.TString>;
    }>>;
    browser: Type.TOptional<Type.TObject<{
        path: Type.TString;
        parentPath: Type.TOptional<Type.TString>;
        search: Type.TOptional<Type.TString>;
        entries: Type.TArray<Type.TObject<{
            path: Type.TString;
            name: Type.TString;
            kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
            sessionKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]>>;
            size: Type.TOptional<Type.TInteger>;
            updatedAtMs: Type.TOptional<Type.TInteger>;
        }>>;
        truncated: Type.TOptional<Type.TBoolean>;
    }>>;
}>;
/** Reads one session-referenced file by path. */
export declare const SessionsFilesGetParamsSchema: Type.TObject<{
    sessionKey: Type.TString;
    path: Type.TString;
    agentId: Type.TOptional<Type.TString>;
}>;
/** Result for reading one session-referenced file. */
export declare const SessionsFilesGetResultSchema: Type.TObject<{
    sessionKey: Type.TString;
    root: Type.TOptional<Type.TString>;
    file: Type.TObject<{
        path: Type.TString;
        name: Type.TString;
        kind: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
        missing: Type.TBoolean;
        size: Type.TOptional<Type.TInteger>;
        updatedAtMs: Type.TOptional<Type.TInteger>;
        content: Type.TOptional<Type.TString>;
    }>;
}>;
/** Lists sessions with optional scope, activity, label, and preview filters. */
export declare const SessionsListParamsSchema: Type.TObject<{
    /**
     * Maximum rows to return. Omitted Gateway RPC calls use a bounded default
     * to keep large session stores from monopolizing the event loop.
     */
    limit: Type.TOptional<Type.TInteger>;
    offset: Type.TOptional<Type.TInteger>;
    activeMinutes: Type.TOptional<Type.TInteger>;
    includeGlobal: Type.TOptional<Type.TBoolean>;
    includeUnknown: Type.TOptional<Type.TBoolean>;
    /**
     * Limit returned agent-scoped rows to agents currently present in config.
     * Broad disk discovery remains the default for recovery/ACP consumers.
     */
    configuredAgentsOnly: Type.TOptional<Type.TBoolean>;
    /**
     * Read first 8KB of each session transcript to derive title from first user message.
     * Performs a file read per session - use `limit` to bound result set on large stores.
     */
    includeDerivedTitles: Type.TOptional<Type.TBoolean>;
    /**
     * Read last 16KB of each session transcript to extract most recent message preview.
     * Performs a file read per session - use `limit` to bound result set on large stores.
     */
    includeLastMessage: Type.TOptional<Type.TBoolean>;
    label: Type.TOptional<Type.TString>;
    spawnedBy: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
    search: Type.TOptional<Type.TString>;
}>;
/** Repairs or removes invalid session records from the selected agent scope. */
export declare const SessionsCleanupParamsSchema: Type.TObject<{
    agent: Type.TOptional<Type.TString>;
    allAgents: Type.TOptional<Type.TBoolean>;
    enforce: Type.TOptional<Type.TBoolean>;
    activeKey: Type.TOptional<Type.TString>;
    fixMissing: Type.TOptional<Type.TBoolean>;
    fixDmScope: Type.TOptional<Type.TBoolean>;
}>;
/** Reads short previews for selected session keys. */
export declare const SessionsPreviewParamsSchema: Type.TObject<{
    keys: Type.TArray<Type.TString>;
    limit: Type.TOptional<Type.TInteger>;
    maxChars: Type.TOptional<Type.TInteger>;
}>;
/** Describes one session and optional derived title/last-message previews. */
export declare const SessionsDescribeParamsSchema: Type.TObject<{
    key: Type.TString;
    includeDerivedTitles: Type.TOptional<Type.TBoolean>;
    includeLastMessage: Type.TOptional<Type.TBoolean>;
}>;
/** Resolves a session by key, raw session id, label, or parent/agent scope. */
export declare const SessionsResolveParamsSchema: Type.TObject<{
    key: Type.TOptional<Type.TString>;
    sessionId: Type.TOptional<Type.TString>;
    label: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
    spawnedBy: Type.TOptional<Type.TString>;
    includeGlobal: Type.TOptional<Type.TBoolean>;
    includeUnknown: Type.TOptional<Type.TBoolean>;
    /** Return a successful `{ ok: false }` response when the selector does not match a session. */
    allowMissing: Type.TOptional<Type.TBoolean>;
}>;
/** Creates or adopts a session with optional model, label, and parent linkage. */
export declare const SessionsCreateParamsSchema: Type.TObject<{
    key: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
    label: Type.TOptional<Type.TString>;
    model: Type.TOptional<Type.TString>;
    parentSessionKey: Type.TOptional<Type.TString>;
    emitCommandHooks: Type.TOptional<Type.TBoolean>;
    task: Type.TOptional<Type.TString>;
    message: Type.TOptional<Type.TString>;
}>;
/** Sends one message into an existing session. */
export declare const SessionsSendParamsSchema: Type.TObject<{
    key: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    message: Type.TString;
    thinking: Type.TOptional<Type.TString>;
    attachments: Type.TOptional<Type.TArray<Type.TUnknown>>;
    timeoutMs: Type.TOptional<Type.TInteger>;
    idempotencyKey: Type.TOptional<Type.TString>;
}>;
/** Subscribes a client to live message updates for one session. */
export declare const SessionsMessagesSubscribeParamsSchema: Type.TObject<{
    key: Type.TString;
    agentId: Type.TOptional<Type.TString>;
}>;
/** Removes a live message subscription for one session. */
export declare const SessionsMessagesUnsubscribeParamsSchema: Type.TObject<{
    key: Type.TString;
    agentId: Type.TOptional<Type.TString>;
}>;
/** Aborts the active or named run for a session. */
export declare const SessionsAbortParamsSchema: Type.TObject<{
    key: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    agentId: Type.TOptional<Type.TString>;
}>;
/** Mutable per-session preferences and routing metadata. */
export declare const SessionsPatchParamsSchema: Type.TObject<{
    key: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    label: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    thinkingLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    fastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">, Type.TNull]>>;
    verboseLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    traceLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    reasoningLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    responseUsage: Type.TOptional<Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"tokens">, Type.TLiteral<"full">, Type.TLiteral<"on">, Type.TNull]>>;
    elevatedLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    execHost: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    execSecurity: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    execAsk: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    execNode: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    model: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    spawnedBy: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    spawnedWorkspaceDir: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    spawnedCwd: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    spawnDepth: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
    subagentRole: Type.TOptional<Type.TUnion<[Type.TLiteral<"orchestrator">, Type.TLiteral<"leaf">, Type.TNull]>>;
    subagentControlScope: Type.TOptional<Type.TUnion<[Type.TLiteral<"children">, Type.TLiteral<"none">, Type.TNull]>>;
    inheritedToolAllow: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
    inheritedToolDeny: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
    sendPolicy: Type.TOptional<Type.TUnion<[Type.TLiteral<"allow">, Type.TLiteral<"deny">, Type.TNull]>>;
    groupActivation: Type.TOptional<Type.TUnion<[Type.TLiteral<"mention">, Type.TLiteral<"always">, Type.TNull]>>;
}>;
/** Updates or clears one plugin namespace value on a session record. */
export declare const SessionsPluginPatchParamsSchema: Type.TObject<{
    key: Type.TString;
    pluginId: Type.TString;
    namespace: Type.TString;
    value: Type.TOptional<Type.TUnknown>;
    unset: Type.TOptional<Type.TBoolean>;
}>;
/** Result returned after patching session plugin state. */
export declare const SessionsPluginPatchResultSchema: Type.TObject<{
    ok: Type.TLiteral<true>;
    key: Type.TString;
    value: Type.TOptional<Type.TUnknown>;
}>;
/** Resets a session to a new or reset transcript state. */
export declare const SessionsResetParamsSchema: Type.TObject<{
    key: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    reason: Type.TOptional<Type.TUnion<[Type.TLiteral<"new">, Type.TLiteral<"reset">]>>;
}>;
/** Deletes a session record and optionally its transcript. */
export declare const SessionsDeleteParamsSchema: Type.TObject<{
    key: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    deleteTranscript: Type.TOptional<Type.TBoolean>;
    emitLifecycleHooks: Type.TOptional<Type.TBoolean>;
}>;
/** Requests manual compaction for a session transcript. */
export declare const SessionsCompactParamsSchema: Type.TObject<{
    key: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    maxLines: Type.TOptional<Type.TInteger>;
}>;
/** Lists compaction checkpoints for one session. */
export declare const SessionsCompactionListParamsSchema: Type.TObject<{
    key: Type.TString;
    agentId: Type.TOptional<Type.TString>;
}>;
/** Reads one compaction checkpoint by id. */
export declare const SessionsCompactionGetParamsSchema: Type.TObject<{
    key: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    checkpointId: Type.TString;
}>;
/** Creates a new branch from a compaction checkpoint. */
export declare const SessionsCompactionBranchParamsSchema: Type.TObject<{
    key: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    checkpointId: Type.TString;
}>;
/** Restores an existing session to a compaction checkpoint. */
export declare const SessionsCompactionRestoreParamsSchema: Type.TObject<{
    key: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    checkpointId: Type.TString;
}>;
/** List response for session compaction checkpoints. */
export declare const SessionsCompactionListResultSchema: Type.TObject<{
    ok: Type.TLiteral<true>;
    key: Type.TString;
    checkpoints: Type.TArray<Type.TObject<{
        checkpointId: Type.TString;
        sessionKey: Type.TString;
        sessionId: Type.TString;
        createdAt: Type.TInteger;
        reason: Type.TUnion<[Type.TLiteral<"manual">, Type.TLiteral<"auto-threshold">, Type.TLiteral<"overflow-retry">, Type.TLiteral<"timeout-retry">]>;
        tokensBefore: Type.TOptional<Type.TInteger>;
        tokensAfter: Type.TOptional<Type.TInteger>;
        summary: Type.TOptional<Type.TString>;
        firstKeptEntryId: Type.TOptional<Type.TString>;
        preCompaction: Type.TObject<{
            sessionId: Type.TString;
            sessionFile: Type.TOptional<Type.TString>;
            leafId: Type.TOptional<Type.TString>;
            entryId: Type.TOptional<Type.TString>;
        }>;
        postCompaction: Type.TObject<{
            sessionId: Type.TString;
            sessionFile: Type.TOptional<Type.TString>;
            leafId: Type.TOptional<Type.TString>;
            entryId: Type.TOptional<Type.TString>;
        }>;
    }>>;
}>;
/** Get response for a single compaction checkpoint. */
export declare const SessionsCompactionGetResultSchema: Type.TObject<{
    ok: Type.TLiteral<true>;
    key: Type.TString;
    checkpoint: Type.TObject<{
        checkpointId: Type.TString;
        sessionKey: Type.TString;
        sessionId: Type.TString;
        createdAt: Type.TInteger;
        reason: Type.TUnion<[Type.TLiteral<"manual">, Type.TLiteral<"auto-threshold">, Type.TLiteral<"overflow-retry">, Type.TLiteral<"timeout-retry">]>;
        tokensBefore: Type.TOptional<Type.TInteger>;
        tokensAfter: Type.TOptional<Type.TInteger>;
        summary: Type.TOptional<Type.TString>;
        firstKeptEntryId: Type.TOptional<Type.TString>;
        preCompaction: Type.TObject<{
            sessionId: Type.TString;
            sessionFile: Type.TOptional<Type.TString>;
            leafId: Type.TOptional<Type.TString>;
            entryId: Type.TOptional<Type.TString>;
        }>;
        postCompaction: Type.TObject<{
            sessionId: Type.TString;
            sessionFile: Type.TOptional<Type.TString>;
            leafId: Type.TOptional<Type.TString>;
            entryId: Type.TOptional<Type.TString>;
        }>;
    }>;
}>;
/** Branch response with the newly created session key and entry metadata. */
export declare const SessionsCompactionBranchResultSchema: Type.TObject<{
    ok: Type.TLiteral<true>;
    sourceKey: Type.TString;
    key: Type.TString;
    sessionId: Type.TString;
    checkpoint: Type.TObject<{
        checkpointId: Type.TString;
        sessionKey: Type.TString;
        sessionId: Type.TString;
        createdAt: Type.TInteger;
        reason: Type.TUnion<[Type.TLiteral<"manual">, Type.TLiteral<"auto-threshold">, Type.TLiteral<"overflow-retry">, Type.TLiteral<"timeout-retry">]>;
        tokensBefore: Type.TOptional<Type.TInteger>;
        tokensAfter: Type.TOptional<Type.TInteger>;
        summary: Type.TOptional<Type.TString>;
        firstKeptEntryId: Type.TOptional<Type.TString>;
        preCompaction: Type.TObject<{
            sessionId: Type.TString;
            sessionFile: Type.TOptional<Type.TString>;
            leafId: Type.TOptional<Type.TString>;
            entryId: Type.TOptional<Type.TString>;
        }>;
        postCompaction: Type.TObject<{
            sessionId: Type.TString;
            sessionFile: Type.TOptional<Type.TString>;
            leafId: Type.TOptional<Type.TString>;
            entryId: Type.TOptional<Type.TString>;
        }>;
    }>;
    entry: Type.TObject<{
        sessionId: Type.TString;
        updatedAt: Type.TInteger;
    }>;
}>;
/** Restore response with updated session entry metadata. */
export declare const SessionsCompactionRestoreResultSchema: Type.TObject<{
    ok: Type.TLiteral<true>;
    key: Type.TString;
    sessionId: Type.TString;
    checkpoint: Type.TObject<{
        checkpointId: Type.TString;
        sessionKey: Type.TString;
        sessionId: Type.TString;
        createdAt: Type.TInteger;
        reason: Type.TUnion<[Type.TLiteral<"manual">, Type.TLiteral<"auto-threshold">, Type.TLiteral<"overflow-retry">, Type.TLiteral<"timeout-retry">]>;
        tokensBefore: Type.TOptional<Type.TInteger>;
        tokensAfter: Type.TOptional<Type.TInteger>;
        summary: Type.TOptional<Type.TString>;
        firstKeptEntryId: Type.TOptional<Type.TString>;
        preCompaction: Type.TObject<{
            sessionId: Type.TString;
            sessionFile: Type.TOptional<Type.TString>;
            leafId: Type.TOptional<Type.TString>;
            entryId: Type.TOptional<Type.TString>;
        }>;
        postCompaction: Type.TObject<{
            sessionId: Type.TString;
            sessionFile: Type.TOptional<Type.TString>;
            leafId: Type.TOptional<Type.TString>;
            entryId: Type.TOptional<Type.TString>;
        }>;
    }>;
    entry: Type.TObject<{
        sessionId: Type.TString;
        updatedAt: Type.TInteger;
    }>;
}>;
/** Usage report query across one session, one agent, or all agent sessions. */
export declare const SessionsUsageParamsSchema: Type.TObject<{
    /** Specific session key to analyze; if omitted returns sessions for the effective agent. */
    key: Type.TOptional<Type.TString>;
    /** Agent scope for list-style usage queries. */
    agentId: Type.TOptional<Type.TString>;
    /** Explicit all-agent scope for list-style usage queries. */
    agentScope: Type.TOptional<Type.TLiteral<"all">>;
    /** Start date for range filter (YYYY-MM-DD). */
    startDate: Type.TOptional<Type.TString>;
    /** End date for range filter (YYYY-MM-DD). */
    endDate: Type.TOptional<Type.TString>;
    /** How start/end dates should be interpreted. Defaults to UTC when omitted. */
    mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"utc">, Type.TLiteral<"gateway">, Type.TLiteral<"specific">]>>;
    /** Preset range for usage queries when explicit start/end dates are omitted. */
    range: Type.TOptional<Type.TUnion<[Type.TLiteral<"7d">, Type.TLiteral<"30d">, Type.TLiteral<"90d">, Type.TLiteral<"1y">, Type.TLiteral<"all">]>>;
    /** Usage row grouping. `family` rolls up known rotated session ids for a logical key. */
    groupBy: Type.TOptional<Type.TUnion<[Type.TLiteral<"instance">, Type.TLiteral<"family">]>>;
    /** Backward-compatible alias for requesting family grouping. */
    includeHistorical: Type.TOptional<Type.TBoolean>;
    /** UTC offset to use when mode is `specific` (for example, UTC-4 or UTC+5:30). */
    utcOffset: Type.TOptional<Type.TString>;
    /** Maximum sessions to return (default 50). */
    limit: Type.TOptional<Type.TInteger>;
    /** Include context weight breakdown (systemPromptReport). */
    includeContextWeight: Type.TOptional<Type.TBoolean>;
}>;
