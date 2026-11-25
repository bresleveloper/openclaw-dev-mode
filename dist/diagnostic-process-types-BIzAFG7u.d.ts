import { HeapSpaceInfo } from "node:v8";
type GatewayWorkMetricsSnapshot = {
  sessions: {
    running: number;
    queued: number;
  };
  work: {
    agentRuns: number;
    chatRuns: number;
    queuedTurns: number;
  };
};
type SessionRowSelectionKind = "broad" | "agent" | "store" | "exact" | "session-id" | "parent" | "running-candidate";
type SessionRowSelectionMetric = {
  kind: SessionRowSelectionKind;
  task: string;
  calls: number;
  rows: number;
};
declare function getSessionRowSelectionMetrics(): {
  selections: SessionRowSelectionMetric[];
  resets: number;
  partitions: {
    task: string;
    hits: number;
    misses: number;
  }[];
  partitionRevisions: {
    reason: string;
    changes: number;
  }[];
  materialization: {
    created: number;
    reused: number;
    rebuilt: number;
    skipped: number;
    deepComparisons: number;
    sampledFirstDifferences: {
      [x: string]: number;
    };
  };
};
type GcSample = {
  kind: "scavenge" | "mark_sweep_compact" | "incremental" | "weak_processing";
  reason: "none" | "forced" | "synchronous_phantom_processing" | "all_available_garbage" | "all_external_memory" | "schedule_idle" | "construct_retained" | "other";
  durationMs: number;
  /** Positive native before/after heap drop, not total allocated bytes. */
  reclaimedBytes?: number;
  heapUsedBeforeBytes?: number;
  /** Native full-heap epilogue, never a later JavaScript heap read. */
  heapUsedAfterMajorGcBytes?: number;
  /** Unix observation time: GCProfiler has no per-collection timestamp. */
  heapUsedAfterMajorGcTimestampSeconds?: number;
};
type WorkerMessageKind = "sqlite_request" | "sqlite_reply" | "task_input" | "task_reply" | "task_request" | "task_notification" | "task_consumed" | "admission" | "authority" | "resource" | "lifecycle" | "memory" | "realtime" | "other";
type WorkerMessageDirection = "to_worker" | "from_worker";
type AuthorityComponent = "admission_entry" | "admission_other" | "receipt_entry" | "receipt_events" | "receipt_value" | "receipt_other";
type ComponentSample = {
  bytes: number;
  samples: number;
  unmeasured: number;
};
type WorkerMessageMetric = {
  kind: WorkerMessageKind;
  direction: WorkerMessageDirection;
  messages: number;
  payloadBytes: number;
  payloadBytesByRequestClass?: Record<string, number>;
  unmeasuredMessages: number;
  payloadComponents?: Record<string, Partial<Record<AuthorityComponent, ComponentSample>>>;
};
type WorkerPoolClass = "reader" | "file-reader" | "compute" | "writer" | "singleton";
declare const runtimeProcessEntrypoints: {
  readonly daemonRuntimeProbe: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly pluginToolsServe: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly openclawToolsServe: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly repositoryPublicationRestore: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly nodeWorkspacePublicationSnapshot: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly nodeWorkspaceManifest: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly nodeWorkspaceGitHistory: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly doctorDatabaseEngineInspection: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly doctorDatabaseBloat: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly backupDatabaseDiscovery: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sqliteHeaderProbe: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly databaseBackup: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly managedHandoffEngine: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly updatePostgresState: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly databasePortCommand: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly stallObserver: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly fileLog: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly systemCaWarmup: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly openclawIdTunnel: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly shutdownHardExit: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly packageIntegrityHasher: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly packageLocalOverrides: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly directoryWatchHost: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly directoryWatchParent: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly workspaceQuiescenceAcquire: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly workspaceQuiescenceRenew: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly workspaceQuiescenceRelease: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly packageActivationRecovery: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly managedHandoffPostgresBridge: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly managedHandoffRuntime: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sqliteVector: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly postgresBridge: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly secretEgressProxy: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly codeModeNode: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly cronReadOnly: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly stateRead: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly workerNativeLifecycle: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly spawnBroker: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly cronStreamMatcher: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly controlUiFile: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly publicSessionCard: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly nodeBootstrapArtifact: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly nativeHookRelayClient: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly computerHost: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly imageProcessor: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly fileToolPlanning: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly fileToolRead: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly attachmentProcessor: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly widgetScriptSyntax: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly gitOperations: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly gitPackCleanup: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly fsSafeCopy: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly execRealpath: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sharedStateStore: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly clientCredentials: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly secretFileRead: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly ttsPreferences: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly authProfileInlineUsage: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly pluginModelCatalogRead: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly pluginModelCatalogCredentials: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly pluginCaptureNativeResource: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly pluginGenerationPreparation: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly agentDatabaseExecution: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly workspaceMemory: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly localAgentAvatar: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly identityFile: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly workspaceSkills: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly skillsDiscovery: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly boardStore: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly progressCardStore: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sessionSharingStore: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sessionForkDomain: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sessionGoalOperations: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sessionLifecyclePlanningDomain: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sessionMessageRewriteDomain: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sessionDiskBudget: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly contextEngineTurnOutbox: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sqliteStore: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sqliteWriterAdmission: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly agentSchemaInspection: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly stateMigrationSnapshot: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly githubExec: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly shellSnapshotEnvironment: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sqliteReadOnly: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sqliteSnapshotStaging: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sqliteReadOnlyNativeResource: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sqliteSourceRevision: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sqliteIntegrity: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sqliteCloseProbe: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly preparedModelCatalog: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly providerPromptState: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly retiredWorktreeCleanup: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly updateNativeGate: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly updateStateSizes: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly updateRepair: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly immutableBuild: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly updateMigratedFinalize: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly updateConfigProjection: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly updateAutomaticCleanup: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly updateCandidateState: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly doctorLint: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly doctor: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly databaseVerify: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly stateOwnership: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly stateLeaseHeartbeat: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly gatewayStateOwnerHeartbeat: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sessionTranscriptArchive: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sessionTranscript: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly usageOverview: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly workerTranscriptCommit: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sessionManagerMetadata: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sessionTranscriptProjectionPublication: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sessionTranscriptActiveFactsBackfill: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sessionTranscriptReports: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly sessionTranscriptReconcile: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly tailscaleRouteOwner: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly serviceChildRelay: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly terminalPty: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly serviceChildGroupAnchor: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly serviceChildWindowsJobAnchor: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
  readonly bunSqliteLibrary: {
    readonly currentModuleUrl: string;
    readonly sourceModulePath: `src/${string}.mjs` | `src/${string}.mts` | `src/${string}.ts`;
    readonly sourceExtension: ".mjs" | ".mts" | ".ts" | undefined;
    readonly sourceWorkerName: string;
    readonly distWorkerPath: string;
  };
};
declare const standaloneKinds: {
  readonly "catalog-page.worker.js": "catalog";
  readonly "code-mode.worker.js": "codeMode";
  readonly "disk-budget.worker.js": "diskBudget";
  readonly "document-extractor.worker.js": "document";
  readonly "manager-index.worker.js": "memoryIndex";
  readonly "manager-search.worker.js": "memorySearch";
  readonly "memory-index.worker.js": "memoryIndex";
  readonly "memory-search.worker.js": "memorySearch";
  readonly "run.worker.js": "teamReports";
  readonly "session-history.worker.js": "sessionHistory";
};
type WorkerRequestKind = keyof typeof runtimeProcessEntrypoints | (typeof standaloneKinds)[keyof typeof standaloneKinds] | "sqlite_read" | "sqlite_writer" | "extension";
type DiagnosticRuntimeMeasurementFields = {
  type: "gateway.http.cancelled";
  source: "client" | "shutdown";
} | {
  type: "gateway.event_loop.sample";
  intervalMs: number;
  delayMaxMs: number;
} | {
  type: "gateway.main_thread.stall";
  stalls: {
    task: string;
    durationMs: number;
  }[];
  dropped: number;
} | {
  type: "diagnostic.gc";
  /** Native full-heap usage immediately after a major collection. */
  heapUsedAfterMajorGcBytes?: number;
  /** Unix time when the isolate's existing profiler drained that collection. */
  heapUsedAfterMajorGcTimestampSeconds?: number;
  durationMs: number;
  /** Optional for existing SDK event producers; native observers always supply attribution. */
  kind?: GcSample["kind"];
  /** Bounded Node GC callback flags; absent or unrecognized values become other. */
  reason?: GcSample["reason"];
  /** main or an allowlisted worker script basename (other for unknown scripts). */
  thread?: string;
  /** Reusable Code Mode isolate slot (1–64), owned until native worker exit. */
  workerSlot?: number;
};
type DiagnosticWorkerRequestFields = {
  type: "worker.request";
  kind: WorkerRequestKind;
  requestClass: string;
  phase: "queued" | "started" | "completed";
  queueDepth: number;
  queueWaitMs?: number;
  durationMs?: number;
  /** Monotonic process timestamps spanning the complete request, including transport frames. */
  timing?: Partial<Record<"enqueued" | "dispatched" | "posted" | "postFinished" | "received" | "backendLoadStarted" | "backendLoadFinished" | "openGrantStarted" | "openGrantFinished" | "factoryStarted" | "factoryFinished" | "inputReady" | "executeStarted" | "executeFinished" | "serialized" | "replied" | "replyReceived", number>>;
};
type DiagnosticAsyncQueueDroppedFields = {
  type: "diagnostic.async_queue.dropped";
  droppedEvents: number;
  droppedTrustedEvents?: number;
  droppedUntrustedEvents?: number;
  droppedPriorityEvents?: number;
  queueLength: number;
  maxQueueLength: number;
  drainBatchSize: number;
};
declare const DIAGNOSTIC_WORKER_RETAINED_STRUCTURES: readonly ["catalog-config", "catalog-source", "catalog-entries", "catalog-index", "catalog-pricing", "catalog-request", "catalog-metadata", "catalog-static", "catalog-remote", "catalog-auth"];
/** Owner-reported size estimates only; never data keys, identities, or retained contents. */
type DiagnosticWorkerRetainedData = {
  structure: (typeof DIAGNOSTIC_WORKER_RETAINED_STRUCTURES)[number];
  entries: number;
  approximateBytes: number;
  stringBytes?: number;
  objects?: number;
  generations?: number;
  providers?: number;
  accounts?: number;
  truncated?: boolean;
};
type DiagnosticMemoryUsage = {
  rssBytes: number;
  /** Linux RssAnon: resident anonymous pages, including managed heaps and buffers. */
  anonymousRssBytes?: number;
  /** Linux VmSwap: swapped anonymous private pages, excluding shared-memory swap. */
  anonymousSwapBytes?: number;
  heapTotalBytes: number;
  heapUsedBytes: number;
  /** Actual main-isolate V8 limit; absent on runtimes without V8. */
  heapSizeLimitBytes?: number;
  /** old_space + large_object_space at the last observed native major-GC epilogue. */
  oldGenerationAfterGcBytes?: number;
  externalBytes: number;
  arrayBuffersBytes: number;
  heapSpaces?: HeapSpaceInfo[];
  workerCount?: number;
  /** Live PostgreSQL bridges, including children of workers with diagnostic registration. */
  postgresBridgeCount?: number;
  /** Threads that started their own PostgreSQL pool without inherited endpoints. */
  postgresPoolSelfRootCount?: number;
  workerHeapSampledCount?: number;
  workerHeapTotalBytes?: number;
  workerHeapUsedBytes?: number;
  workerExternalBytes?: number;
  workerArrayBuffersBytes?: number;
  workerArrayBuffersSampledCount?: number;
  /** Coverage concerns direct Workers only; nested isolates are not in the parent registry. */
  workerMemoryScope?: "direct";
  workerMemoryCoverage?: "complete" | "partial" | "unavailable";
  workerMemoryMissing?: {
    script: string;
    threadId: number;
    reason: "pending" | "stale" | "unavailable";
  }[];
  /** Live, fresh isolate samples; script is an allowlisted basename or "other". */
  workerHeaps?: {
    script: string;
    heapUsed: number;
    heapTotal: number;
    /** Node's finite native space set; absent for native-only fallback samples and Bun. */
    heapSpaces?: Pick<HeapSpaceInfo, "space_name" | "space_used_size">[];
    /** Approximate owner-held data, not V8 retained-size attribution or a heap snapshot. */
    retainedData?: readonly DiagnosticWorkerRetainedData[];
    /** Actual V8 isolate limit; unavailable on runtimes without V8. */
    heapSizeLimitBytes?: number;
    /** Absent until a major GC is observed, and for native-only fallback samples. */
    oldGenerationAfterGcBytes?: number;
    threadId?: number;
    /** Same bounded slot as diagnostic.gc; absent for overflow and other scripts. */
    workerSlot?: number;
    external?: number;
    /** Missing for native-only samplers; zero is a measured value. Included in external. */
    arrayBuffers?: number;
    sampleAgeMs?: number;
  }[];
  /** Cumulative process-owned counts; script and reason come from fixed allowlists. */
  workerLifecycle?: {
    script: string;
    started: number;
    retired: {
      reason: string;
      count: number;
    }[];
  }[];
  /** Process-lifetime worker totals; retired workers remain represented after native exit. */
  workerTaskMetrics?: {
    workerClass: WorkerPoolClass | "other";
    script: string;
    /** Absent for broker workers, which do not use the pool task-reply protocol. */
    tasksCompleted?: number;
    heapUsedHighWaterBytes: number;
    gc: {
      kind: GcSample["kind"];
      count: number;
      durationMs: number;
      reclaimedBytes: number;
    }[];
  }[];
  /** Main-thread transport totals; unknown payload sizes remain separate from known zero bytes. */
  workerMessages?: WorkerMessageMetric[];
  /** Linux physical reads by outer operation in direct reader workers, including retired workers. */
  sqliteReaderMetrics?: {
    operation: string;
    count: number;
    readBytes: number;
  }[];
  /** Process-lifetime selector totals with bounded shape and caller labels. */
  sessionRowSelections?: ReturnType<typeof getSessionRowSelectionMetrics>;
};
declare const DIAGNOSTIC_MEMORY_PRESSURE_METRICS: readonly ["thresholdBytes", "limitBytes", "usedBytes", "workerThreadId", "rssGrowthBytes", "windowMs"];
type DiagnosticMemoryPressureMetrics = Partial<Record<(typeof DIAGNOSTIC_MEMORY_PRESSURE_METRICS)[number], number>>;
type DiagnosticMemoryPressureFields = DiagnosticMemoryPressureMetrics & {
  type: "diagnostic.memory.pressure";
  level: "warning" | "critical";
  reason: "rss_threshold" | "heap_threshold" | "worker_heap_threshold" | "process_memory_threshold" | "rss_growth";
  memory: DiagnosticMemoryUsage;
};
type DiagnosticChildProcessSpawnFields = {
  type: "diagnostic.child_process.spawn";
  family: string;
  /** Bounded Git owner or SQLite session/transport; unknown for unattributed Git. */
  operation?: string;
  count: number;
  intervalMs: number;
};
export { DiagnosticRuntimeMeasurementFields as a, GatewayWorkMetricsSnapshot as c, DiagnosticMemoryUsage as i, DiagnosticChildProcessSpawnFields as n, DiagnosticWorkerRequestFields as o, DiagnosticMemoryPressureFields as r, WorkerRequestKind as s, DiagnosticAsyncQueueDroppedFields as t };