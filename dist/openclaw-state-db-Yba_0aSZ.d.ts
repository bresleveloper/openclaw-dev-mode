import { DatabaseSync } from "node:sqlite";
import "@openclaw/fs-safe/advanced";
//#region src/infra/sqlite-reader-lifecycle.d.ts
type SqliteReaderOwner = {
  operation: string;
  ownerKind: "main" | "worker";
  actorId?: number;
};
type SqliteReaderDiagnostic = SqliteReaderOwner & {
  kind: "iterator";
  connectionId: number;
  threadId: number;
  ageMs: number;
  idleMs: number;
};
type SqliteReaderDiagnostics = {
  scope: "current-thread";
  blockingOwner: "unknown";
  nativeStatements: "unobserved";
  threadId: number;
  observedAtMs: number;
  connectionCount: number;
  readerCount: number;
  connections: Array<SqliteReaderOwner & {
    connectionId: number;
    threadId: number;
    ageMs: number;
    transactionOpen: boolean;
    trackedReaders: number;
  }>;
  activeReaders: SqliteReaderDiagnostic[];
};
//#endregion
//#region src/infra/sqlite-wal-checkpoint.d.ts
type SqliteWalCheckpointMode = "PASSIVE" | "FULL" | "RESTART" | "TRUNCATE";
type SqliteWalHealth = {
  state: "complete" | "blocked" | "error";
  observedAtMs: number;
  walBytes: number | null;
  databaseBytes: number | null;
  logFrames: number | null;
  checkpointedFrames: number | null;
  lastCompletedAtMs: number | null;
  consecutiveBlocked: number;
  warning: boolean;
  error?: string;
  activeReaders?: SqliteReaderDiagnostic[];
  readerDiagnostics?: Array<Omit<SqliteReaderDiagnostics, "activeReaders">>;
};
type SqliteWalCheckpointSnapshot = {
  health: SqliteWalHealth;
  observedAtNs: bigint;
  lastCompletedAtNs?: bigint;
};
//#endregion
//#region src/infra/sqlite-wal-reclamation.d.ts
type SqliteWalReclamationOptions = {
  maxPages?: number;
  checkpointMode?: SqliteWalCheckpointMode;
  beforeMutation?: () => void;
  onCommit?: () => void;
  afterCommit?: () => void;
};
type SqliteWalReclamationResult = {
  checkpointCompleted: boolean;
  checkpoint?: SqliteWalCheckpointSnapshot;
  freePagesBefore: number | null;
  remainingFreePages: number | null;
  checkpointCalls: number;
  checkpointIncomplete: number;
  checkpointMs: number;
  checkpointMaxMs: number;
  queryMs: number;
  vacuumMs: number;
  vacuumPasses: number;
  vacuumPagesRequested: number;
};
//#endregion
//#region src/infra/sqlite-wal-write-admission.d.ts
type SqliteWalPeriodicRequest = {
  maxPages: number;
  checkpointMode: SqliteWalCheckpointMode;
  checkpoint?: SqliteWalCheckpointSnapshot;
};
type SqliteWalPeriodicResult = {
  reclaimedPages: number;
  checkpoint?: SqliteWalCheckpointSnapshot;
};
//#endregion
//#region src/infra/sqlite-wal.d.ts
type SqliteWalMaintenance = {
  /** Last maintenance observation; reading it never checkpoints or probes storage. */
  readonly health?: SqliteWalHealth;
  checkpoint: () => boolean;
  maintainPeriodic?: (request: SqliteWalPeriodicRequest, admit?: (stage: "transaction" | "commit") => void) => SqliteWalPeriodicResult;
  reclaimFreePages: (options?: SqliteWalReclamationOptions) => SqliteWalReclamationResult;
  /** Inspect this retained WAL connection, independently of checkpoint completion elsewhere. */
  inspectIdle?: () => "healthy" | "retire";
  /** Retire timer admission and join accepted maintenance before closing its database. */
  stop: () => Promise<void>;
  /** Final checkpoint; synchronous exit cleanup cancels work without joining it. */
  close: (options?: {
    checkpointMode?: SqliteWalCheckpointMode;
  }) => boolean;
};
//#endregion
//#region src/infra/sqlite-worker-identity.d.ts
type DatabaseFileIdentity = Readonly<{
  key: string;
  birthtime?: string;
}>;
type DatabasePathIdentity = DatabaseFileIdentity & Readonly<{
  canonicalPath: string;
}>;
//#endregion
//#region src/state/openclaw-state-db-contract.d.ts
/** Open shared SQLite database handle plus WAL maintenance lifecycle. */
type OpenClawStateDatabase = {
  db: DatabaseSync;
  path: string;
  walMaintenance: SqliteWalMaintenance;
};
/** Options for resolving or overriding the shared state database path. */
type OpenClawStateDatabaseOptions = {
  env?: NodeJS.ProcessEnv;
  path?: string;
  database?: OpenClawStateDatabase;
  readOnly?: boolean;
  /** Additional known agent stores can only make first-use classification more conservative. */
  initializationAgentPaths?: readonly string[];
};
//#endregion
//#region src/state/openclaw-state-db-async-lifecycle.d.ts
type OpenClawStateDatabaseReadAdmission = {
  readonly databasePath: string;
  /** Stable across first creation and aliases; coordinates work but grants no authority. */
  readonly coordinationKey: string;
  readonly identity: DatabasePathIdentity;
  assertCurrent: () => void;
};
//#endregion
//#region src/state/openclaw-state-db-cache.d.ts
declare const { touch: touchStateDatabase, retain: retainOpenClawStateDatabaseForIdle }: {
  touch: (database: OpenClawStateDatabase) => void;
  retain(this: void, database: OpenClawStateDatabase): () => void;
};
declare const { register: registerStateDatabaseWalAdmission, readHealth: readOpenClawStateWalHealth, ownRetirement: ownStateDatabaseRetirement, stop: stopOpenClawStateDatabaseMaintenance }: {
  ownRetirement(this: void, database: OpenClawStateDatabase, close: () => Promise<void>): () => void;
  stop(this: void, pathname?: string, identity?: DatabasePathIdentity): Promise<void>;
  register(this: void, database: OpenClawStateDatabase, identity: DatabasePathIdentity, admission: OpenClawStateDatabaseReadAdmission, env: NodeJS.ProcessEnv): void;
  readHealth(this: void): SqliteWalHealth | undefined;
};
/** Retain one exact canonical native owner; only the final reference retires its handle. */
declare const { retain: retainOpenClawStateDatabase, borrowForRead: borrowOpenClawStateDatabaseForAsyncRead, retainForIndependentRead: retainOpenClawStateDatabaseForIndependentRead }: {
  retain: (database: OpenClawStateDatabase) => {
    release(): void;
    releaseAsync(): Promise<void>;
  };
  retainForIndependentRead(this: void, pathname: string, ownership?: "cached-read"): {
    assertCurrent: () => void;
    observe(): void;
    release: () => void;
  } | undefined;
  borrowForRead(this: void, pathname: string, ownership?: "cached-read"): {
    assertCurrent: () => void;
    observe(): void;
    release: () => void;
    database: OpenClawStateDatabase;
  } | undefined;
};
//#endregion
export { SqliteWalMaintenance as a, DatabaseFileIdentity as i, OpenClawStateDatabase as n, OpenClawStateDatabaseOptions as r, OpenClawStateDatabaseReadAdmission as t };