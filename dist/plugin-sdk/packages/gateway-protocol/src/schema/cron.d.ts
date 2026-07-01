import { Type, type TSchema } from "typebox";
/** Schedule expression for one-time, interval, or cron-expression jobs. */
export declare const CronScheduleSchema: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"at">;
    at: Type.TString;
}>, Type.TObject<{
    kind: Type.TLiteral<"every">;
    everyMs: Type.TInteger;
    anchorMs: Type.TOptional<Type.TInteger>;
}>, Type.TObject<{
    kind: Type.TLiteral<"cron">;
    expr: Type.TString;
    tz: Type.TOptional<Type.TString>;
    staggerMs: Type.TOptional<Type.TInteger>;
}>]>;
/** Full cron payload for new jobs. */
export declare const CronPayloadSchema: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"systemEvent">;
    text: Type.TString;
}>, Type.TObject<{
    kind: Type.TLiteral<"agentTurn">;
    message: TSchema;
    model: Type.TOptional<TSchema>;
    fallbacks: Type.TOptional<TSchema>;
    thinking: Type.TOptional<Type.TString>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
    lightContext: Type.TOptional<Type.TBoolean>;
    toolsAllow: Type.TOptional<TSchema>;
}>, Type.TObject<{
    kind: Type.TLiteral<"command">;
    argv: TSchema;
    cwd: Type.TOptional<Type.TString>;
    env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    input: Type.TOptional<Type.TString>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
    outputMaxBytes: Type.TOptional<Type.TInteger>;
}>]>;
/** Partial cron payload for job updates. */
export declare const CronPayloadPatchSchema: Type.TUnion<[Type.TObject<{
    kind: Type.TLiteral<"systemEvent">;
    text: Type.TOptional<Type.TString>;
}>, Type.TObject<{
    kind: Type.TLiteral<"agentTurn">;
    message: TSchema;
    model: Type.TOptional<TSchema>;
    fallbacks: Type.TOptional<TSchema>;
    thinking: Type.TOptional<Type.TString>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
    lightContext: Type.TOptional<Type.TBoolean>;
    toolsAllow: Type.TOptional<TSchema>;
}>, Type.TObject<{
    kind: Type.TLiteral<"command">;
    argv: TSchema;
    cwd: Type.TOptional<Type.TString>;
    env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    input: Type.TOptional<Type.TString>;
    timeoutSeconds: Type.TOptional<Type.TNumber>;
    noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
    outputMaxBytes: Type.TOptional<Type.TInteger>;
}>]>;
/** Failure alert policy for repeated cron run failures. */
export declare const CronFailureAlertSchema: Type.TObject<{
    after: Type.TOptional<Type.TInteger>;
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    to: Type.TOptional<Type.TString>;
    cooldownMs: Type.TOptional<Type.TInteger>;
    includeSkipped: Type.TOptional<Type.TBoolean>;
    mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    accountId: Type.TOptional<Type.TString>;
}>;
/** Delivery destination used when failure alerts need a separate target. */
export declare const CronFailureDestinationSchema: Type.TObject<{
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    to: Type.TOptional<Type.TString>;
    accountId: Type.TOptional<Type.TString>;
    mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
}>;
export declare const CronCompletionDestinationSchema: Type.TObject<{
    mode: Type.TLiteral<"webhook">;
    to: Type.TString;
}>;
/** Delivery policy for cron run output. */
export declare const CronDeliverySchema: Type.TUnion<[Type.TObject<{
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    accountId: Type.TOptional<Type.TString>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        to: Type.TOptional<Type.TString>;
        accountId: Type.TOptional<Type.TString>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    }>>;
    mode: Type.TLiteral<"none">;
    to: Type.TOptional<Type.TString>;
}>, Type.TObject<{
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    accountId: Type.TOptional<Type.TString>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        to: Type.TOptional<Type.TString>;
        accountId: Type.TOptional<Type.TString>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    }>>;
    mode: Type.TLiteral<"announce">;
    completionDestination: Type.TOptional<Type.TObject<{
        mode: Type.TLiteral<"webhook">;
        to: Type.TString;
    }>>;
    to: Type.TOptional<Type.TString>;
}>, Type.TObject<{
    channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    accountId: Type.TOptional<Type.TString>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        to: Type.TOptional<Type.TString>;
        accountId: Type.TOptional<Type.TString>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    }>>;
    mode: Type.TLiteral<"webhook">;
    to: Type.TString;
}>]>;
/** Patch shape for cron delivery policy updates. */
export declare const CronDeliveryPatchSchema: Type.TObject<{
    channel: Type.TOptional<Type.TUnion<[Type.TUnion<[Type.TLiteral<"last">, Type.TString]>, Type.TNull]>>;
    threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber, Type.TNull]>>;
    accountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    bestEffort: Type.TOptional<Type.TBoolean>;
    failureDestination: Type.TOptional<Type.TUnion<[Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TUnion<[Type.TLiteral<"last">, Type.TString]>, Type.TNull]>>;
        to: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        accountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">, Type.TNull]>>;
    }>, Type.TNull]>>;
    mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
    completionDestination: Type.TOptional<Type.TUnion<[Type.TObject<{
        mode: Type.TLiteral<"webhook">;
        to: Type.TString;
    }>, Type.TNull]>>;
    to: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
}>;
/** Scheduler-maintained state for the latest run/delivery outcome. */
export declare const CronJobStateSchema: Type.TObject<{
    nextRunAtMs: Type.TOptional<Type.TInteger>;
    runningAtMs: Type.TOptional<Type.TInteger>;
    lastRunAtMs: Type.TOptional<Type.TInteger>;
    lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
    lastStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
    lastError: Type.TOptional<Type.TString>;
    lastDiagnostics: Type.TOptional<Type.TObject<{
        summary: Type.TOptional<Type.TString>;
        entries: Type.TArray<Type.TObject<{
            ts: Type.TInteger;
            source: Type.TUnion<[Type.TLiteral<"cron-preflight">, Type.TLiteral<"cron-setup">, Type.TLiteral<"model-preflight">, Type.TLiteral<"agent-run">, Type.TLiteral<"tool">, Type.TLiteral<"exec">, Type.TLiteral<"delivery">]>;
            severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"error">]>;
            message: Type.TString;
            toolName: Type.TOptional<Type.TString>;
            exitCode: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
            truncated: Type.TOptional<Type.TBoolean>;
        }>>;
    }>>;
    lastDiagnosticSummary: Type.TOptional<Type.TString>;
    lastErrorReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
    lastDurationMs: Type.TOptional<Type.TInteger>;
    consecutiveErrors: Type.TOptional<Type.TInteger>;
    consecutiveSkipped: Type.TOptional<Type.TInteger>;
    lastDelivered: Type.TOptional<Type.TBoolean>;
    lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    lastDeliveryError: Type.TOptional<Type.TString>;
    lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
    lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
    lastFailureAlertAtMs: Type.TOptional<Type.TInteger>;
}>;
/** Persisted cron job definition returned by scheduler list/get APIs. */
export declare const CronJobSchema: Type.TObject<{
    id: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    name: Type.TString;
    description: Type.TOptional<Type.TString>;
    enabled: Type.TBoolean;
    deleteAfterRun: Type.TOptional<Type.TBoolean>;
    createdAtMs: Type.TInteger;
    updatedAtMs: Type.TInteger;
    schedule: Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"at">;
        at: Type.TString;
    }>, Type.TObject<{
        kind: Type.TLiteral<"every">;
        everyMs: Type.TInteger;
        anchorMs: Type.TOptional<Type.TInteger>;
    }>, Type.TObject<{
        kind: Type.TLiteral<"cron">;
        expr: Type.TString;
        tz: Type.TOptional<Type.TString>;
        staggerMs: Type.TOptional<Type.TInteger>;
    }>]>;
    sessionTarget: Type.TUnion<[Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]>;
    wakeMode: Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>;
    payload: Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"systemEvent">;
        text: Type.TString;
    }>, Type.TObject<{
        kind: Type.TLiteral<"agentTurn">;
        message: TSchema;
        model: Type.TOptional<TSchema>;
        fallbacks: Type.TOptional<TSchema>;
        thinking: Type.TOptional<Type.TString>;
        timeoutSeconds: Type.TOptional<Type.TNumber>;
        allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
        lightContext: Type.TOptional<Type.TBoolean>;
        toolsAllow: Type.TOptional<TSchema>;
    }>, Type.TObject<{
        kind: Type.TLiteral<"command">;
        argv: TSchema;
        cwd: Type.TOptional<Type.TString>;
        env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
        input: Type.TOptional<Type.TString>;
        timeoutSeconds: Type.TOptional<Type.TNumber>;
        noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
        outputMaxBytes: Type.TOptional<Type.TInteger>;
    }>]>;
    delivery: Type.TOptional<Type.TUnion<[Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
        accountId: Type.TOptional<Type.TString>;
        bestEffort: Type.TOptional<Type.TBoolean>;
        failureDestination: Type.TOptional<Type.TObject<{
            channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
            to: Type.TOptional<Type.TString>;
            accountId: Type.TOptional<Type.TString>;
            mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
        }>>;
        mode: Type.TLiteral<"none">;
        to: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
        accountId: Type.TOptional<Type.TString>;
        bestEffort: Type.TOptional<Type.TBoolean>;
        failureDestination: Type.TOptional<Type.TObject<{
            channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
            to: Type.TOptional<Type.TString>;
            accountId: Type.TOptional<Type.TString>;
            mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
        }>>;
        mode: Type.TLiteral<"announce">;
        completionDestination: Type.TOptional<Type.TObject<{
            mode: Type.TLiteral<"webhook">;
            to: Type.TString;
        }>>;
        to: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
        accountId: Type.TOptional<Type.TString>;
        bestEffort: Type.TOptional<Type.TBoolean>;
        failureDestination: Type.TOptional<Type.TObject<{
            channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
            to: Type.TOptional<Type.TString>;
            accountId: Type.TOptional<Type.TString>;
            mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
        }>>;
        mode: Type.TLiteral<"webhook">;
        to: Type.TString;
    }>]>>;
    failureAlert: Type.TOptional<Type.TUnion<[Type.TLiteral<false>, Type.TObject<{
        after: Type.TOptional<Type.TInteger>;
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        to: Type.TOptional<Type.TString>;
        cooldownMs: Type.TOptional<Type.TInteger>;
        includeSkipped: Type.TOptional<Type.TBoolean>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
        accountId: Type.TOptional<Type.TString>;
    }>]>>;
    state: Type.TObject<{
        nextRunAtMs: Type.TOptional<Type.TInteger>;
        runningAtMs: Type.TOptional<Type.TInteger>;
        lastRunAtMs: Type.TOptional<Type.TInteger>;
        lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
        lastStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
        lastError: Type.TOptional<Type.TString>;
        lastDiagnostics: Type.TOptional<Type.TObject<{
            summary: Type.TOptional<Type.TString>;
            entries: Type.TArray<Type.TObject<{
                ts: Type.TInteger;
                source: Type.TUnion<[Type.TLiteral<"cron-preflight">, Type.TLiteral<"cron-setup">, Type.TLiteral<"model-preflight">, Type.TLiteral<"agent-run">, Type.TLiteral<"tool">, Type.TLiteral<"exec">, Type.TLiteral<"delivery">]>;
                severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"error">]>;
                message: Type.TString;
                toolName: Type.TOptional<Type.TString>;
                exitCode: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
                truncated: Type.TOptional<Type.TBoolean>;
            }>>;
        }>>;
        lastDiagnosticSummary: Type.TOptional<Type.TString>;
        lastErrorReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
        lastDurationMs: Type.TOptional<Type.TInteger>;
        consecutiveErrors: Type.TOptional<Type.TInteger>;
        consecutiveSkipped: Type.TOptional<Type.TInteger>;
        lastDelivered: Type.TOptional<Type.TBoolean>;
        lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
        lastDeliveryError: Type.TOptional<Type.TString>;
        lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
        lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
        lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
        lastFailureAlertAtMs: Type.TOptional<Type.TInteger>;
    }>;
}>;
/** Query params for listing cron jobs with filters and pagination. */
export declare const CronListParamsSchema: Type.TObject<{
    includeDisabled: Type.TOptional<Type.TBoolean>;
    limit: Type.TOptional<Type.TInteger>;
    offset: Type.TOptional<Type.TInteger>;
    query: Type.TOptional<Type.TString>;
    enabled: Type.TOptional<Type.TUnion<[Type.TLiteral<"all">, Type.TLiteral<"enabled">, Type.TLiteral<"disabled">]>>;
    scheduleKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"all">, Type.TLiteral<"at">, Type.TLiteral<"every">, Type.TLiteral<"cron">]>>;
    lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"all">, Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">, Type.TLiteral<"unknown">]>>;
    sortBy: Type.TOptional<Type.TUnion<[Type.TLiteral<"nextRunAtMs">, Type.TLiteral<"updatedAtMs">, Type.TLiteral<"name">]>>;
    sortDir: Type.TOptional<Type.TUnion<[Type.TLiteral<"asc">, Type.TLiteral<"desc">]>>;
    agentId: Type.TOptional<Type.TString>;
    compact: Type.TOptional<Type.TBoolean>;
}>;
/** Empty request payload for scheduler status. */
export declare const CronStatusParamsSchema: Type.TObject<{}>;
/** Looks up a job by stable id or legacy jobId alias. */
export declare const CronGetParamsSchema: Type.TUnion<[Type.TObject<{
    id: Type.TString;
}>, Type.TObject<{
    jobId: Type.TString;
}>]>;
/** Creates a scheduled job with schedule, target, payload, and delivery policy. */
export declare const CronAddParamsSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    sessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    description: Type.TOptional<Type.TString>;
    enabled: Type.TOptional<Type.TBoolean>;
    deleteAfterRun: Type.TOptional<Type.TBoolean>;
    name: Type.TString;
    schedule: Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"at">;
        at: Type.TString;
    }>, Type.TObject<{
        kind: Type.TLiteral<"every">;
        everyMs: Type.TInteger;
        anchorMs: Type.TOptional<Type.TInteger>;
    }>, Type.TObject<{
        kind: Type.TLiteral<"cron">;
        expr: Type.TString;
        tz: Type.TOptional<Type.TString>;
        staggerMs: Type.TOptional<Type.TInteger>;
    }>]>;
    sessionTarget: Type.TUnion<[Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]>;
    wakeMode: Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>;
    payload: Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"systemEvent">;
        text: Type.TString;
    }>, Type.TObject<{
        kind: Type.TLiteral<"agentTurn">;
        message: TSchema;
        model: Type.TOptional<TSchema>;
        fallbacks: Type.TOptional<TSchema>;
        thinking: Type.TOptional<Type.TString>;
        timeoutSeconds: Type.TOptional<Type.TNumber>;
        allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
        lightContext: Type.TOptional<Type.TBoolean>;
        toolsAllow: Type.TOptional<TSchema>;
    }>, Type.TObject<{
        kind: Type.TLiteral<"command">;
        argv: TSchema;
        cwd: Type.TOptional<Type.TString>;
        env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
        input: Type.TOptional<Type.TString>;
        timeoutSeconds: Type.TOptional<Type.TNumber>;
        noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
        outputMaxBytes: Type.TOptional<Type.TInteger>;
    }>]>;
    delivery: Type.TOptional<Type.TUnion<[Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
        accountId: Type.TOptional<Type.TString>;
        bestEffort: Type.TOptional<Type.TBoolean>;
        failureDestination: Type.TOptional<Type.TObject<{
            channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
            to: Type.TOptional<Type.TString>;
            accountId: Type.TOptional<Type.TString>;
            mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
        }>>;
        mode: Type.TLiteral<"none">;
        to: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
        accountId: Type.TOptional<Type.TString>;
        bestEffort: Type.TOptional<Type.TBoolean>;
        failureDestination: Type.TOptional<Type.TObject<{
            channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
            to: Type.TOptional<Type.TString>;
            accountId: Type.TOptional<Type.TString>;
            mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
        }>>;
        mode: Type.TLiteral<"announce">;
        completionDestination: Type.TOptional<Type.TObject<{
            mode: Type.TLiteral<"webhook">;
            to: Type.TString;
        }>>;
        to: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
        accountId: Type.TOptional<Type.TString>;
        bestEffort: Type.TOptional<Type.TBoolean>;
        failureDestination: Type.TOptional<Type.TObject<{
            channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
            to: Type.TOptional<Type.TString>;
            accountId: Type.TOptional<Type.TString>;
            mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
        }>>;
        mode: Type.TLiteral<"webhook">;
        to: Type.TString;
    }>]>>;
    failureAlert: Type.TOptional<Type.TUnion<[Type.TLiteral<false>, Type.TObject<{
        after: Type.TOptional<Type.TInteger>;
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        to: Type.TOptional<Type.TString>;
        cooldownMs: Type.TOptional<Type.TInteger>;
        includeSkipped: Type.TOptional<Type.TBoolean>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
        accountId: Type.TOptional<Type.TString>;
    }>]>>;
}>;
/** Mutable cron job fields accepted by update APIs. */
export declare const CronJobPatchSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    sessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    description: Type.TOptional<Type.TString>;
    enabled: Type.TOptional<Type.TBoolean>;
    deleteAfterRun: Type.TOptional<Type.TBoolean>;
    name: Type.TOptional<Type.TString>;
    schedule: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"at">;
        at: Type.TString;
    }>, Type.TObject<{
        kind: Type.TLiteral<"every">;
        everyMs: Type.TInteger;
        anchorMs: Type.TOptional<Type.TInteger>;
    }>, Type.TObject<{
        kind: Type.TLiteral<"cron">;
        expr: Type.TString;
        tz: Type.TOptional<Type.TString>;
        staggerMs: Type.TOptional<Type.TInteger>;
    }>]>>;
    sessionTarget: Type.TOptional<Type.TUnion<[Type.TLiteral<"main">, Type.TLiteral<"isolated">, Type.TLiteral<"current">, Type.TString]>>;
    wakeMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"next-heartbeat">, Type.TLiteral<"now">]>>;
    payload: Type.TOptional<Type.TUnion<[Type.TObject<{
        kind: Type.TLiteral<"systemEvent">;
        text: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
        kind: Type.TLiteral<"agentTurn">;
        message: TSchema;
        model: Type.TOptional<TSchema>;
        fallbacks: Type.TOptional<TSchema>;
        thinking: Type.TOptional<Type.TString>;
        timeoutSeconds: Type.TOptional<Type.TNumber>;
        allowUnsafeExternalContent: Type.TOptional<Type.TBoolean>;
        lightContext: Type.TOptional<Type.TBoolean>;
        toolsAllow: Type.TOptional<TSchema>;
    }>, Type.TObject<{
        kind: Type.TLiteral<"command">;
        argv: TSchema;
        cwd: Type.TOptional<Type.TString>;
        env: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
        input: Type.TOptional<Type.TString>;
        timeoutSeconds: Type.TOptional<Type.TNumber>;
        noOutputTimeoutSeconds: Type.TOptional<Type.TNumber>;
        outputMaxBytes: Type.TOptional<Type.TInteger>;
    }>]>>;
    delivery: Type.TOptional<Type.TObject<{
        channel: Type.TOptional<Type.TUnion<[Type.TUnion<[Type.TLiteral<"last">, Type.TString]>, Type.TNull]>>;
        threadId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber, Type.TNull]>>;
        accountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
        bestEffort: Type.TOptional<Type.TBoolean>;
        failureDestination: Type.TOptional<Type.TUnion<[Type.TObject<{
            channel: Type.TOptional<Type.TUnion<[Type.TUnion<[Type.TLiteral<"last">, Type.TString]>, Type.TNull]>>;
            to: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            accountId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
            mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">, Type.TNull]>>;
        }>, Type.TNull]>>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
        completionDestination: Type.TOptional<Type.TUnion<[Type.TObject<{
            mode: Type.TLiteral<"webhook">;
            to: Type.TString;
        }>, Type.TNull]>>;
        to: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    }>>;
    failureAlert: Type.TOptional<Type.TUnion<[Type.TLiteral<false>, Type.TObject<{
        after: Type.TOptional<Type.TInteger>;
        channel: Type.TOptional<Type.TUnion<[Type.TLiteral<"last">, Type.TString]>>;
        to: Type.TOptional<Type.TString>;
        cooldownMs: Type.TOptional<Type.TInteger>;
        includeSkipped: Type.TOptional<Type.TBoolean>;
        mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"announce">, Type.TLiteral<"webhook">]>>;
        accountId: Type.TOptional<Type.TString>;
    }>]>>;
    state: Type.TOptional<Type.TObject<{
        nextRunAtMs: Type.TOptional<Type.TInteger>;
        runningAtMs: Type.TOptional<Type.TInteger>;
        lastRunAtMs: Type.TOptional<Type.TInteger>;
        lastRunStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
        lastStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
        lastError: Type.TOptional<Type.TString>;
        lastErrorReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
        lastDurationMs: Type.TOptional<Type.TInteger>;
        consecutiveErrors: Type.TOptional<Type.TInteger>;
        consecutiveSkipped: Type.TOptional<Type.TInteger>;
        lastDelivered: Type.TOptional<Type.TBoolean>;
        lastDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
        lastDeliveryError: Type.TOptional<Type.TString>;
        lastFailureNotificationDelivered: Type.TOptional<Type.TBoolean>;
        lastFailureNotificationDeliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
        lastFailureNotificationDeliveryError: Type.TOptional<Type.TString>;
        lastFailureAlertAtMs: Type.TOptional<Type.TInteger>;
    }>>;
}>;
/** Updates a cron job by id or legacy jobId alias. */
export declare const CronUpdateParamsSchema: Type.TUnion<[Type.TObject<{
    id: Type.TString;
}>, Type.TObject<{
    jobId: Type.TString;
}>]>;
/** Removes a cron job by id or legacy jobId alias. */
export declare const CronRemoveParamsSchema: Type.TUnion<[Type.TObject<{
    id: Type.TString;
}>, Type.TObject<{
    jobId: Type.TString;
}>]>;
/** Runs a cron job immediately or only if due. */
export declare const CronRunParamsSchema: Type.TUnion<[Type.TObject<{
    id: Type.TString;
}>, Type.TObject<{
    jobId: Type.TString;
}>]>;
/** Query params for cron run history. */
export declare const CronRunsParamsSchema: Type.TObject<{
    scope: Type.TOptional<Type.TUnion<[Type.TLiteral<"job">, Type.TLiteral<"all">]>>;
    id: Type.TOptional<Type.TString>;
    jobId: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    limit: Type.TOptional<Type.TInteger>;
    offset: Type.TOptional<Type.TInteger>;
    statuses: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>>;
    status: Type.TOptional<Type.TUnion<[Type.TLiteral<"all">, Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
    deliveryStatuses: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>>;
    deliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    query: Type.TOptional<Type.TString>;
    sortDir: Type.TOptional<Type.TUnion<[Type.TLiteral<"asc">, Type.TLiteral<"desc">]>>;
}>;
/** One persisted cron run history entry. */
export declare const CronRunLogEntrySchema: Type.TObject<{
    ts: Type.TInteger;
    jobId: Type.TString;
    action: Type.TLiteral<"finished">;
    status: Type.TOptional<Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"error">, Type.TLiteral<"skipped">]>>;
    error: Type.TOptional<Type.TString>;
    errorReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"auth">, Type.TLiteral<"auth_permanent">, Type.TLiteral<"format">, Type.TLiteral<"rate_limit">, Type.TLiteral<"overloaded">, Type.TLiteral<"billing">, Type.TLiteral<"server_error">, Type.TLiteral<"timeout">, Type.TLiteral<"model_not_found">, Type.TLiteral<"session_expired">, Type.TLiteral<"empty_response">, Type.TLiteral<"no_error_details">, Type.TLiteral<"unclassified">, Type.TLiteral<"unknown">]>>;
    summary: Type.TOptional<Type.TString>;
    diagnostics: Type.TOptional<Type.TObject<{
        summary: Type.TOptional<Type.TString>;
        entries: Type.TArray<Type.TObject<{
            ts: Type.TInteger;
            source: Type.TUnion<[Type.TLiteral<"cron-preflight">, Type.TLiteral<"cron-setup">, Type.TLiteral<"model-preflight">, Type.TLiteral<"agent-run">, Type.TLiteral<"tool">, Type.TLiteral<"exec">, Type.TLiteral<"delivery">]>;
            severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warn">, Type.TLiteral<"error">]>;
            message: Type.TString;
            toolName: Type.TOptional<Type.TString>;
            exitCode: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
            truncated: Type.TOptional<Type.TBoolean>;
        }>>;
    }>>;
    delivered: Type.TOptional<Type.TBoolean>;
    deliveryStatus: Type.TOptional<Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>>;
    deliveryError: Type.TOptional<Type.TString>;
    failureNotificationDelivery: Type.TOptional<Type.TObject<{
        delivered: Type.TOptional<Type.TBoolean>;
        status: Type.TUnion<[Type.TLiteral<"delivered">, Type.TLiteral<"not-delivered">, Type.TLiteral<"unknown">, Type.TLiteral<"not-requested">]>;
        error: Type.TOptional<Type.TString>;
    }>>;
    sessionId: Type.TOptional<Type.TString>;
    sessionKey: Type.TOptional<Type.TString>;
    runId: Type.TOptional<Type.TString>;
    runAtMs: Type.TOptional<Type.TInteger>;
    durationMs: Type.TOptional<Type.TInteger>;
    nextRunAtMs: Type.TOptional<Type.TInteger>;
    model: Type.TOptional<Type.TString>;
    provider: Type.TOptional<Type.TString>;
    usage: Type.TOptional<Type.TObject<{
        input_tokens: Type.TOptional<Type.TNumber>;
        output_tokens: Type.TOptional<Type.TNumber>;
        total_tokens: Type.TOptional<Type.TNumber>;
        cache_read_tokens: Type.TOptional<Type.TNumber>;
        cache_write_tokens: Type.TOptional<Type.TNumber>;
    }>>;
    jobName: Type.TOptional<Type.TString>;
}>;
