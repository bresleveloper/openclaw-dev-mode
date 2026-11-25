import { n as DatabasePathIdentity, t as DatabaseFileIdentity } from "./sqlite-worker-identity-CQpxCzBX.js";
import { o as DiagnosticWorkerRequestFields } from "./diagnostic-process-types-BIzAFG7u.js";
import { n as PostgresSqlConnection, t as EngineConnection } from "./sql-connection-CSeUqY2a.js";
import { i as DatabaseEngineSelection } from "./types-C6Nim0qi.js";
import { z } from "zod";
import { BigIntStats } from "node:fs";
import { MessagePort, Transferable } from "node:worker_threads";
import { DatabaseSync } from "node:sqlite";
type PluginStateStoreErrorCode = "PLUGIN_STATE_SQLITE_UNAVAILABLE" | "PLUGIN_STATE_OPEN_FAILED" | "PLUGIN_STATE_WRITE_FAILED" | "PLUGIN_STATE_READ_FAILED" | "PLUGIN_STATE_CORRUPT" | "PLUGIN_STATE_LIMIT_EXCEEDED" | "PLUGIN_STATE_INVALID_INPUT";
type PluginStateStoreOperation = "load-sqlite" | "open" | "ensure-schema" | "register" | "lookup" | "consume" | "delete" | "entries" | "count" | "clear" | "sweep" | "probe" | "close";
type PluginStateStoreErrorOptions = {
  code: PluginStateStoreErrorCode;
  operation: PluginStateStoreOperation;
  path?: string;
  cause?: unknown;
  owner?: {
    pid: number;
    threadId: number;
    version: string;
  };
};
/** Typed error thrown for plugin-state validation and sqlite failures. */
declare class PluginStateStoreError extends Error {
  readonly code: PluginStateStoreErrorCode;
  readonly operation: PluginStateStoreOperation;
  readonly path?: string;
  readonly owner: {
    pid: number;
    threadId: number;
    version: string;
  };
  constructor(message: string, options: PluginStateStoreErrorOptions);
  toJSON(): Record<string, unknown>;
}
type SkillLibraryErrorCode = "IDENTITY_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "NAME_CONFLICT" | "INVALID_BUNDLE" | "POLICY_BLOCKED" | "AUTHORITY_EXPIRED" | "LIMIT";
type PluginBlobEntryInfo<TMetadata> = {
  key: string;
  metadata: TMetadata;
  sizeBytes: number;
  createdAt: number;
  expiresAt?: number;
};
type PluginBlobEntry<TMetadata> = PluginBlobEntryInfo<TMetadata> & {
  bytes: Uint8Array;
};
type PluginBlobStore<TMetadata> = {
  register(key: string, bytes: Uint8Array, metadata: TMetadata, opts?: {
    ttlMs?: number;
  }): Promise<void>;
  registerIfAbsent(key: string, bytes: Uint8Array, metadata: TMetadata, opts?: {
    ttlMs?: number;
  }): Promise<boolean>;
  lookup(key: string): Promise<PluginBlobEntry<TMetadata> | undefined>;
  entries(): Promise<PluginBlobEntryInfo<TMetadata>[]>;
  delete(key: string): Promise<boolean>;
  deleteExpiredKey(key: string): Promise<PluginBlobEntryInfo<TMetadata> | undefined>;
  deleteExpired(): Promise<PluginBlobEntryInfo<TMetadata>[]>;
  clear(): Promise<void>;
};
type PluginBlobRegistrationReceipt = {
  createdAt: number;
  expiresAt?: number;
};
/** Current host stores publish committed timestamps without a second blob read. */
type PluginBlobStoreWithReceipts<TMetadata> = PluginBlobStore<TMetadata> & {
  registerIfAbsentWithReceipt(key: string, bytes: Uint8Array, metadata: TMetadata, opts?: {
    ttlMs?: number;
  }): Promise<PluginBlobRegistrationReceipt | undefined>;
};
type PluginBlobOverflowPolicy = "evict-oldest" | "reject-new";
type OpenBlobStoreOptions = {
  namespace: string;
  maxEntries: number;
  maxBytesPerEntry: number;
  maxBytesPerNamespace: number;
  overflowPolicy?: PluginBlobOverflowPolicy;
  defaultTtlMs?: number;
};
type PluginBlobStoreErrorCode = "PLUGIN_BLOB_OPEN_FAILED" | "PLUGIN_BLOB_WRITE_FAILED" | "PLUGIN_BLOB_READ_FAILED" | "PLUGIN_BLOB_CORRUPT" | "PLUGIN_BLOB_LIMIT_EXCEEDED" | "PLUGIN_BLOB_INVALID_INPUT";
type PluginBlobStoreOperation = "open" | "register" | "lookup" | "delete" | "entries" | "clear" | "sweep";
type TranscriptAppendRefusal = {
  actualSessionIdHash: string;
  agentIdHash: string;
  code: "session-rebound";
  expectedSessionIdHash: string;
  sessionKeyHash: string;
} | {
  agentIdHash: string;
  code: "session-entry-missing";
  expectedSessionIdHash: string;
  sessionKeyHash: string;
};
type OpenClawStateLeaseErrorCode = "OPENCLAW_STATE_LEASE_INVALID_INPUT" | "OPENCLAW_STATE_LEASE_HELD" | "OPENCLAW_STATE_LEASE_ABORTED" | "OPENCLAW_STATE_LEASE_LOST" | "OPENCLAW_STATE_LEASE_STORAGE_FAILED";
type ErrorIdentity = ReturnType<typeof identifyError>;
declare function identifyError(error: Error): {
  type: "sandbox-state-owner-required";
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  type: "auth-profile-store-unreadable";
  databasePath: string;
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  type: "session-worktree-owner-mismatch";
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  type: "worktree-removal-contention";
  kind: "busy" | "finalized";
  blockedByRun?: {
    worktreeId: string;
    pid: number;
  } | undefined;
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
} | {
  type: "worktree-removal-lock";
  kind: "busy" | "foreign-lock";
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
} | {
  type: "plugin-state";
  stateCode: PluginStateStoreErrorCode;
  operation: PluginStateStoreOperation;
  path: string | undefined;
  owner: {
    pid: number;
    threadId: number;
    version: string;
  };
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  type: "skill-library";
  libraryCode: SkillLibraryErrorCode;
  currentRevision?: string | undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  type: "secret-store-validation";
  secretCode: "SECRET_STORE_INVALID_ALLOWED_HOST" | "SECRET_STORE_INVALID_NAME" | "SECRET_STORE_VALUE_CHANGED" | "SECRET_STORE_VALUE_EMPTY" | "SECRET_STORE_VALUE_IN_ARGV" | "SECRET_STORE_VALUE_REDACTED" | "SECRET_STORE_VALUE_TOO_LARGE";
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  type: "worker-session-already-attached";
  sessionId: string;
  environmentId: string;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  type: "plugin-blob";
  blobCode: PluginBlobStoreErrorCode;
  operation: PluginBlobStoreOperation;
  path?: string | undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  type: "workspace-alias-repointed";
  aliasPath: string;
  storedWorkspacePath: string;
  currentWorkspacePath: string;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  type: "mcp-oauth-corruption";
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  type: "session-goal-operation";
  goalCode: "capacity" | "expired" | "goal-rebound" | "invalid" | "operation-conflict" | "receipt-invalid" | "session-rebound";
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  type: "session-lifecycle-upsert-conflict";
  sessionKey: string;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  type: "session-transcript-writer-claim-rebound";
  refusal?: TranscriptAppendRefusal | undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  type: "session-mutation-conflict";
  operationLabel: string;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  type: "session-transcript-mutation-conflict";
  sessionId: string;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  type: "session-metadata";
  reason: "schema-missing" | "table-missing";
  missingTables: string[];
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  type: "state-owner-contention";
  databasePath: string;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  type: "state-admission-pending";
  databasePath: string;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  type: "state-offline-maintenance";
  databasePath: string;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  type: "state-maintenance-scope";
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  type: "state-lease";
  leaseCode: OpenClawStateLeaseErrorCode;
  leaseLoss: {
    reason: "expired";
    expiresAt: number;
    expiredByMs: number;
    heartbeatAgeMs: number;
    renewalTimerLateByMs?: number | undefined;
  } | {
    reason: "replaced";
    owner: "[redacted]";
  } | {
    reason: "missing";
  } | {
    reason: "storage-failed";
  } | {
    reason: "admission-failed";
  } | undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  type: "ownership-metadata";
  databasePath: string;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  type: "external-ownership";
  databasePath: string;
  managerId: string;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  type: "state-migration";
  kind: "audit-events-v2" | "legacy-cron-run-logs" | "legacy-workshop-review-index";
  pathname: string;
  schemaVersion?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  type: "agent-media-migration";
  pathname: string;
  schemaVersion: number;
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  type: "coordinator" | "duplicate-agent" | "jsonl-read-budget" | "model-account-authority" | "model-selection-locked" | "newer-schema" | "ownership" | "range-error" | "session-canonical-key-migration" | "session-pending-input-custody" | "session-transcript-read-fence" | "skill-upload-request" | "state-database-access" | "syntax-error" | "type-error" | "worktree-source-changed";
  kind?: undefined;
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  type: "maintenance";
  kind: "agent-media" | "audit-events-v2" | "legacy-cron-run-logs" | "legacy-session-store" | "legacy-workshop-review-index" | "legacy-workspace" | "newer-schema" | "state-migrations";
} | {
  stateCode?: undefined;
  operation?: undefined;
  path?: undefined;
  owner?: undefined;
  secretCode?: undefined;
  environmentId?: undefined;
  aliasPath?: undefined;
  storedWorkspacePath?: undefined;
  currentWorkspacePath?: undefined;
  goalCode?: undefined;
  sessionKey?: undefined;
  operationLabel?: undefined;
  sessionId?: undefined;
  reason?: undefined;
  missingTables?: undefined;
  leaseCode?: undefined;
  leaseLoss?: undefined;
  databasePath?: undefined;
  managerId?: undefined;
  pathname?: undefined;
  schemaVersion?: undefined;
  kind?: undefined;
  type: "aggregate" | "error";
};
type ErrorValue = {
  ref: number;
} | {
  value: string | number | boolean | null;
} | {
  undefined: true;
};
type ErrorNode = ErrorIdentity & {
  name: string;
  message: string;
  code?: string | number;
  errcode?: number;
  errno?: number;
  nativeOpen?: true;
  stateDatabasePath?: string;
  cause?: ErrorValue;
  errors?: ErrorValue[];
};
/** A closed error graph; references preserve shared causes and cyclic aggregates. */
type OpenClawStateWorkerErrorPayload = {
  version: 1;
  root: number;
  nodes: ErrorNode[];
};
type PostgresPoolEndpoint = {
  port: MessagePort;
  signal: SharedArrayBuffer;
};
type PostgresPoolEndpoints = {
  services: PostgresPoolEndpoint[];
  allocation: SharedArrayBuffer;
  nextStep?: string;
};
type SqliteCleanCloseSealRefusal = "no-proof" | "malformed-proof" | "expired-proof" | "file-mismatch" | "journal-present" | "identity-mismatch" | "feature-mismatch" | "schema-mismatch" | "policy-mismatch";
declare const decodedValue: unique symbol;
type AdmissionFactValue = {
  value: unknown;
  [decodedValue]?: {
    value: unknown;
  };
};
type AdmissionFact = AdmissionFactValue & {
  revision: number;
  schemaDependent: boolean;
  lifetime?: "process";
  publication: string;
  current: SharedArrayBuffer;
};
type ScopedWriteRevision = {
  identity: string;
  state: Int32Array<SharedArrayBuffer>;
};
type Admission = {
  identity: string;
  physicalIdentity: DatabaseFileIdentity;
  location: string;
  descriptor: number;
  descriptorOwner: number;
  generationId: string;
  generation: SharedArrayBuffer;
  /** Bounded, process-local diagnostics only; never consulted for admission. */
  writerDiagnostic: Int32Array<SharedArrayBuffer>;
  /** First-load diagnostic, shared with workers without rereading the seal. */
  cleanCloseRefusal?: SqliteCleanCloseSealRefusal;
  /** Last complete host snapshot; relays preserve this value without advancing it. */
  hostRevision?: number;
  writeScopes: Map<string, ScopedWriteRevision>;
  writeScopeRevision: number;
  /** Each worker shares its handle count and unsettled native-write count. */
  references: Map<number, SharedArrayBuffer>;
  facts: Map<string, AdmissionFact>;
};
type AdmissionSnapshot = Omit<Admission, "writeScopes"> & {
  writeScopes: WriteScopeBuckets;
};
type SqliteDatabaseAdmissions = AdmissionSnapshot[];
type SqliteDatabaseAdmissionKey<T> = {
  name: string;
  read(this: void, value: unknown): T | undefined;
  schemaDependent?: boolean;
  /** Physical validation and owner-published decisions survive ordinary native close. */
  lifetime?: "process";
  /** Physical cache facts can be recaptured locally; their transport never gates a live connection. */
  writer?: "host" | "connection";
};
type SqliteDatabaseAdmissionLocation = {
  identity: string;
  canonicalPath: string;
};
/** Internal typed publications need no decoder; public/custom keys retain their read contract. */
type SqliteDatabaseFactKey<T> = Omit<SqliteDatabaseAdmissionKey<T>, "read"> & {
  read?: SqliteDatabaseAdmissionKey<T>["read"];
};
declare const EMPTY_WRITE_SCOPE_BUCKETS: Map<string, ScopedWriteRevision>[];
type WriteScopeBuckets = typeof EMPTY_WRITE_SCOPE_BUCKETS;
declare const { prepareOwnedSqliteDatabaseAdmission, prepareSqliteDatabaseAdmissionAsync, retainSqliteDatabaseAdmissionLocation, retainPreparedSqliteDatabaseAdmissionLocation, prepareSqliteDatabaseAdmission }: {
  prepareOwnedSqliteDatabaseAdmission: (params: {
    location: string;
    expectedIdentity: DatabaseFileIdentity;
    assertCurrent: () => void;
  }) => Promise<void>;
  prepareSqliteDatabaseAdmissionAsync: (params: {
    location: string;
    assertCurrent: () => void;
    identity?: DatabasePathIdentity;
    expectedIdentity?: DatabaseFileIdentity;
    observedLocation?: SqliteDatabaseAdmissionLocation;
    create?: {
      authorize(canonicalPath: string): void | Promise<void>;
      retain(completion: Promise<void>): void;
    };
  }) => Promise<DatabasePathIdentity | undefined>;
  retainSqliteDatabaseAdmissionLocation: (location: string, expectedIdentity?: DatabaseFileIdentity, observedLocation?: SqliteDatabaseAdmissionLocation) => void;
  retainPreparedSqliteDatabaseAdmissionLocation: (location: string, expectedIdentity?: DatabaseFileIdentity, observedLocation?: SqliteDatabaseAdmissionLocation) => boolean;
  prepareSqliteDatabaseAdmission: (location: string, options?: {
    create?: boolean;
  }) => string | undefined;
  pathAdmission: (location: string, observedIdentity?: string) => Admission | undefined;
};
declare const { readSqliteDatabaseCleanClose, readSqliteDatabaseWriteRevision, readSqliteDatabaseSiblingWriteRevision, readSqliteDatabaseIntegrityVerification, readSqliteDatabaseCleanCloseRefusal, getSqliteDatabaseAdmission, getSqliteDatabaseSchemaRevision, getOrLoadSqliteDatabaseAdmissionForPath, peekSqliteDatabaseAdmissionForPath, prepareSqliteDatabaseAdmissionForPath, hasSqliteDatabaseSchemaAdmissionForPath, getSqliteDatabaseAdmissionIdentityForPath, getSqliteDatabaseAdmissionSourceForPath, observeSqliteDatabaseAdmissionLocation, hasSqliteDatabaseSchemaAdmissionForIdentity, retainSqliteDatabaseAdmissionForPath }: {
  readSqliteDatabaseWriteRevision: (connection: EngineConnection) => number | undefined;
  readSqliteDatabaseSiblingWriteRevision: (connection: EngineConnection) => number | undefined;
  readSqliteDatabaseCleanClose: (location: string) => boolean;
  readSqliteDatabaseIntegrityVerification: (source: string | DatabaseSync) => {
    verifiedAt: number;
  } | undefined;
  readSqliteDatabaseCleanCloseRefusal: (database: EngineConnection) => SqliteCleanCloseSealRefusal | undefined;
  getSqliteDatabaseAdmission: <T>(database: DatabaseSync | PostgresSqlConnection, key: SqliteDatabaseFactKey<T>, options?: {
    existingOnly?: boolean;
    refresh?: boolean;
  }) => T | undefined;
  getSqliteDatabaseSchemaRevision: (connection: EngineConnection, options?: {
    existingOnly?: boolean;
  }) => number | undefined;
  getOrLoadSqliteDatabaseAdmissionForPath: <T>(location: string, key: SqliteDatabaseFactKey<T>, load: () => T | undefined) => T | undefined;
  peekSqliteDatabaseAdmissionForPath: <T>(location: string, key: SqliteDatabaseFactKey<T>) => T | undefined;
  prepareSqliteDatabaseAdmissionForPath: <T>(location: string, key: SqliteDatabaseFactKey<T>) => () => T | undefined;
  hasSqliteDatabaseSchemaAdmissionForPath: (location: string) => boolean;
  getSqliteDatabaseAdmissionIdentityForPath: (location: string) => DatabaseFileIdentity | undefined;
  getSqliteDatabaseAdmissionSourceForPath: (location: string) => {
    identity: Readonly<{
      key: string;
      birthtime?: string;
    }>;
    canonicalPath: string;
  } | undefined;
  observeSqliteDatabaseAdmissionLocation: (location: string, preparedIdentity: DatabasePathIdentity) => void;
  hasSqliteDatabaseSchemaAdmissionForIdentity: (physicalIdentity: DatabaseFileIdentity) => boolean;
  retainSqliteDatabaseAdmissionForPath: (location: string) => {
    location: string;
    identity: {
      key: string;
      birthtime?: string;
      canonicalPath: string;
    };
    isCurrent: () => boolean;
    release(this: void): void;
  } | undefined;
};
declare const { onSqliteDatabaseWriteSettled, retireSqliteDatabaseWriteScopes, retainSqliteDatabaseWriteScopesForPath, prepareSqliteDatabaseScopedWriteRevisionForPath, withSqliteDatabaseWriteScope, withoutSqliteDatabaseWriteScope, readSqliteDatabaseScopedWriteToken, readSqliteDatabaseScopedWriteTokenForPath, readSqliteDatabaseScopedWriteTokensForPath, readSqliteDatabasePendingScopedWriteToken, readSqliteDatabaseWriteTokenForPath, readSqliteDatabasePendingWriteToken }: {
  cancel(database: DatabaseSync): void;
  begin(database: DatabaseSync, unscoped: boolean): void;
  finish(database: DatabaseSync, record: Admission | undefined): void;
  settleWorker: (record: Admission, worker: number) => void;
  onSqliteDatabaseWriteSettled: (connection: EngineConnection, listener: () => void) => (() => void) | undefined;
  retireSqliteDatabaseWriteScopes: (connection: EngineConnection, scope: readonly (string | {
    sessionId: string;
    partition?: string;
  })[]) => void;
  retainSqliteDatabaseWriteScopesForPath: (location: string, scope: readonly (string | {
    sessionId: string;
    partition?: string;
  })[]) => (() => void) | undefined;
  prepareSqliteDatabaseScopedWriteRevisionForPath: (location: string, scope: readonly (string | {
    sessionId: string;
    partition?: string;
  })[]) => {
    read(): number | undefined;
    release(): void;
  } | undefined;
  withSqliteDatabaseWriteScope: <T>(connection: EngineConnection, scope: readonly (string | {
    sessionId: string;
    partition?: string;
  })[], run: () => T) => T;
  withoutSqliteDatabaseWriteScope: <T>(connection: EngineConnection, run: () => T) => T;
  readSqliteDatabaseScopedWriteToken: (connection: EngineConnection, scope: string | readonly (string | {
    sessionId: string;
    partition?: string;
  })[]) => string | undefined;
  readSqliteDatabaseScopedWriteTokenForPath: (location: string, scope: string | readonly (string | {
    sessionId: string;
    partition?: string;
  })[], preparedIdentity?: DatabasePathIdentity) => string | undefined;
  readSqliteDatabaseScopedWriteTokensForPath: (location: string, scopes: readonly (string | readonly (string | {
    sessionId: string;
    partition?: string;
  })[])[]) => string[] | undefined;
  readSqliteDatabasePendingScopedWriteToken: (connection: EngineConnection, scope: string | readonly (string | {
    sessionId: string;
    partition?: string;
  })[]) => string | undefined;
  readSqliteDatabaseWriteTokenForPath: (location: string) => string | undefined;
  readSqliteDatabasePendingWriteToken: (connection: EngineConnection) => string | undefined;
};
type MaintenanceResource = {
  phase: "agent-resources" | "agent-handles" | "shared-leases" | "shared-resources" | "shared-references" | "shared-handles";
  close: () => void | Promise<void>;
};
type AgentSchemaMigration = {
  agentId: string;
  path: string;
  foundVersion: number;
  supportedVersion: number;
};
type OpenClawDatabaseMaintenanceScope = {
  readonly ownsSchemaMaintenance: boolean;
  /** SQLite admission coverage for this offline Doctor operation; absent at runtime. */
  readonly sqliteIntegrityCheck?: "quick" | "full";
  assertOwnerCurrent(this: void, access?: "read"): void;
  assertDatabaseAccess(this: void, databasePath: string): void;
  assertCleanupDatabaseAccess(this: void, databasePath: string): void;
  assertAdmission(this: void): void;
  assertReadAdmission(this: void): void;
  addAgentSchemaMigrationCheck(check: (migration: AgentSchemaMigration) => void): void;
  assertAgentSchemaMigration(migration: AgentSchemaMigration): void;
  run<T>(operation: () => T): T;
  track<T>(operation: Promise<T>): Promise<T>;
  own(resource: object, phase: MaintenanceResource["phase"], close: MaintenanceResource["close"]): void;
  close(beforeResources?: () => void | Promise<void>): Promise<void>;
};
type OpenClawStateDatabaseReadAdmission = {
  readonly databasePath: string;
  /** Stable across first creation and aliases; coordinates work but grants no authority. */
  readonly coordinationKey: string;
  readonly identity: DatabasePathIdentity;
  captureIntegrity?: () => OpenClawStateIntegrityAdmission;
  assertCurrent: () => void;
};
type OpenClawStateIntegrityAdmission = {
  identity: DatabasePathIdentity;
  /** Physical-owner lifetime survives renewable schema and integrity proof. */
  readonly lifetime: {
    readonly revision: SharedArrayBuffer;
    readonly epoch: bigint;
  };
  readonly revision: SharedArrayBuffer;
  readonly epoch: bigint;
  readonly proof: SharedArrayBuffer;
};
type GatewayServiceInstallation = {
  root: string;
  version: string;
  cliVersion: string;
  databasePath: string;
};
/** Resolved host facts for the canonical shared-state owner, never authority. */
type SqliteWorkerStateContext = {
  databaseEngineSelection?: DatabaseEngineSelection;
  environment: NodeJS.ProcessEnv & {
    OPENCLAW_STATE_DIR: string;
    OPENCLAW_SUPERVISOR_MODE?: "external";
  };
  /** Selected config inputs for native shared-state initialization, not command environment. */
  initializationEnvironment?: NodeJS.ProcessEnv;
  /** Original default cron selector, before initialization pins the physical state directory. */
  initializationCronDefaultStoreKey?: string;
  /** Known agent paths preserve deletion-history uncertainty during native initialization. */
  initializationAgentPaths?: readonly string[];
  existingSchemaPath?: string;
  gatewayServiceInstallation?: GatewayServiceInstallation;
  stateIntegrity?: OpenClawStateIntegrityAdmission;
  artifactPreservingReads?: true;
  liveStateReads?: true;
  /** Actor-owned exclusion for autonomous WAL work, never write authority. */
  scheduledMaintenanceSuspension?: SharedArrayBuffer;
};
type SqliteWorkerTransferHandle = {
  id: number;
  kinds: string[];
};
type SqliteWorkerRequestCustodyDescriptor = {
  slot: Int32Array<SharedArrayBuffer>;
  request: Int32Array<SharedArrayBuffer>;
};
type SqliteWorkerExecutionAuthority = {
  logical: Int32Array<SharedArrayBuffer>;
  native: Int32Array<SharedArrayBuffer>;
  physicalIdentity: string;
  incarnation: string;
  birthtime?: string;
};
type SqliteWorkerAdmissionRequest = {
  stage: "open" | "prepare" | "transaction" | "commit";
  facts: unknown;
  /** Opt-in wait budget in milliseconds; omission retains the live-owner wait. */
  deadlineMs?: number;
};
type SqliteWorkerDatabaseAuthority = {
  /** Canonical identity captured when the database owner was admitted. */
  databasePath: string;
  databaseIdentity?: SqliteWorkerRequest["databaseIdentity"];
  /** Only the broker can identify an initial open of its captured primary database. */
  coldOpenPath?: string;
  assertRequest?(): void;
  assertAccess(): void;
  assertCreate?(databasePath: string): void;
  prepareCreate?(databasePath: string): Promise<void>;
  acquireSchema(): {
    assertCurrent(): void;
    release(): void;
  };
};
type SqliteWorkerOperations = Record<string, {
  input: unknown;
  output: unknown;
}>;
type SqliteWorkerCommand<Operations extends SqliteWorkerOperations> = { [Key in keyof Operations]: {
  type: Key;
  input: Operations[Key]["input"];
}; }[keyof Operations];
type SqliteWorkerExecuteOptions = {
  signal?: AbortSignal;
  /** Move producer-owned binary fields into the command input without serializing their bytes. */
  transferredInput?: Record<string, Uint8Array<ArrayBuffer>>;
};
type SqliteWorkerStore<Operations extends SqliteWorkerOperations> = {
  execute<Key extends keyof Operations>(command: {
    type: Key;
    input: Operations[Key]["input"];
  }, options?: SqliteWorkerExecuteOptions): Promise<Operations[Key]["output"]>;
  close(): Promise<void>;
};
type SqliteWorkerRequest = {
  id: number;
  actor: number;
  postgresPool?: PostgresPoolEndpoints;
  stateContext?: SqliteWorkerStateContext;
  operationAdmission?: MessagePort;
  databaseAdmissionDeadlineAtMs?: number;
  operationAttachment?: {
    value: unknown;
  };
  requestCustody?: SqliteWorkerRequestCustodyDescriptor;
  executionAuthority?: SqliteWorkerExecutionAuthority;
  /** A borrowed client retains its original locator and physical identity across actor reuse. */
  databaseIdentity?: DatabaseFileIdentity & {
    databasePath: string;
  };
  stateDatabasePath?: string;
  databaseAdmissions?: SqliteDatabaseAdmissions;
  timing?: DiagnosticWorkerRequestFields["timing"];
  transferredInput?: Record<string, Uint8Array<ArrayBuffer>>;
} & ({
  type: "open";
  moduleUrl: string;
  sourceLoaderUrl?: string;
  databasePath: string;
  existingIdentity?: string;
  openAdmission?: "input" | "identity";
  input: Uint8Array<ArrayBuffer>;
  preparation?: Uint8Array<ArrayBuffer>;
} | {
  type: "execute";
  input: Uint8Array<ArrayBuffer>;
} | {
  type: "execute-start";
  transfer: SqliteWorkerTransferHandle;
} | {
  type: "execute-frame";
  input: Uint8Array<ArrayBuffer>;
} | {
  type: "result-next";
  transferId: number;
} | {
  type: "close";
});
/** Native settlement is independent of whether delivery of the result succeeded. */
type SqliteWorkerOperationSettlement = {
  kind: "completed";
} | {
  kind: "not-entered";
  error: unknown;
} | {
  kind: "unknown";
  error: unknown;
  nativeStopped?: true;
};
/** Private operation receipts describe completed work; they never grant write authority. */
type SqliteWorkerNativeSettlement = {
  kind: "completed";
  committed?: {
    facts: unknown;
  };
} | {
  kind: "unknown";
  committed?: {
    facts: unknown;
  };
};
type SqliteWorkerNativeSettlementOwner = {
  readonly committed: {
    facts: unknown;
  } | undefined;
  readonly settlement: SqliteWorkerNativeSettlement | undefined;
  waitForSettlement(deadlineMs: number): Extract<SqliteWorkerNativeSettlement, {
    kind: "completed";
  }>;
};
/** The broker resolves this only from the executing owner's settlement evidence. */
type RetainedWorkerTransactionAdmission = {
  readonly settled: Promise<SqliteWorkerOperationSettlement>;
  /** Actual native retirement, including failed-close recovery after an unknown outcome. */
  readonly nativeStopped?: Promise<void>;
};
type AdmissionFailureSource = "authority" | "domain" | "protocol";
type SqliteWorkerOperationAdmission = SqliteWorkerNativeSettlementOwner & {
  readonly port: MessagePort;
  requestClass?: string;
  readonly attachment?: {
    value: unknown;
  };
  readonly failure: unknown;
  readonly failureSource: AdmissionFailureSource | undefined;
  readonly cleanupFailures: readonly unknown[];
  observeRequests(observer: (request: SqliteWorkerAdmissionRequest) => void): void;
  service(): void;
  finish(outcome?: "not-entered"): void | Promise<void>;
  bindDatabaseAuthority(authority: SqliteWorkerDatabaseAuthority): void;
};
type SqliteWorkerAdmissionFactory = (operation: RetainedWorkerTransactionAdmission) => {
  admission: SqliteWorkerOperationAdmission;
  nativeLocations: readonly string[];
  databaseIdentity?: SqliteWorkerRequest["databaseIdentity"];
};
type StateDatabaseSchemaLease = {
  readonly path: string;
  assertCurrent(this: void): void;
  assertDatabaseAccess(this: void, databasePath: string): void;
  run<T>(this: void, operation: () => T): T;
  release(this: void): void;
};
type PreparedStateDatabaseReadAccess = {
  assertReadAllowed(captured?: Parameters<typeof assertStateDatabaseAccessAllowed>[1]): void;
};
/** Ordinary SQLite access observes maintenance; it never borrows schema authority. */
declare function assertStateDatabaseAccessAllowed(databasePath: string, captured?: {
  maintenanceScope?: OpenClawDatabaseMaintenanceScope;
  schemaLease?: Pick<StateDatabaseSchemaLease, "assertDatabaseAccess">;
}): void;
type RuntimeWorkerGeneration = {
  resolve(url: URL): URL;
  /** Join accepted work before native termination; a slow close warning never releases custody. */
  retain(owner: object, settle: () => Promise<void | (() => Promise<void>)>): void;
};
type SqliteWorkerStoreOptions = {
  runtimeGeneration?: RuntimeWorkerGeneration;
  moduleUrl: URL;
  databasePath: string;
  input: unknown;
  existingOnly?: boolean;
  /** External databases use separate admission and worker capacity. */
  isolation?: "external";
  admission?: {
    identity: string;
    birthtime?: string;
    assertCurrent(): void;
  };
};
export { PluginBlobStoreWithReceipts as _, SqliteWorkerAdmissionRequest as a, SqliteWorkerOperations as c, OpenClawStateDatabaseReadAdmission as d, OpenClawDatabaseMaintenanceScope as f, OpenBlobStoreOptions as g, TranscriptAppendRefusal as h, RetainedWorkerTransactionAdmission as i, SqliteWorkerStore as l, OpenClawStateWorkerErrorPayload as m, PreparedStateDatabaseReadAccess as n, SqliteWorkerCommand as o, readSqliteDatabaseScopedWriteToken as p, SqliteWorkerAdmissionFactory as r, SqliteWorkerExecutionAuthority as s, SqliteWorkerStoreOptions as t, SqliteWorkerStateContext as u, PluginStateStoreError as v };