import { nn as SchemaContract } from "./types.openclaw-DWWUw8hA.js";
import { on as SessionGoalOperationErrorCode } from "./reply-payload-DazZPys5.js";
import { n as OpenClawStateDatabase } from "./openclaw-state-db-Yba_0aSZ.js";
import { P as DevicePairRequestedEventSchema } from "./index-B4F-ENEv.js";
import { t as NodeHostStats } from "./node-host-stats-BMRPfIDF.js";
import { Static } from "typebox";
import { DatabaseSync } from "node:sqlite";
import { MessagePort } from "node:worker_threads";
//#region src/agents/agent-create-error.d.ts
declare class DuplicateAgentError extends Error {}
//#endregion
//#region src/config/sessions/session-pending-input-custody-error.d.ts
/** Custody refusal must not release already accepted input for another dispatch. */
declare class SessionPendingInputCustodyError extends Error {}
//#endregion
//#region src/infra/sqlite-lifecycle-errors.d.ts
declare class OpenClawStateOwnershipError extends Error {}
//#endregion
//#region src/infra/startup-maintenance-required.d.ts
declare const maintenanceReasons: {
  readonly "state-migrations": "state migration";
  readonly "newer-schema": "a newer OpenClaw build";
  readonly "agent-media": "offline media migration";
  readonly "audit-events-v2": "state database schema migration";
  readonly "legacy-workshop-review-index": "state database schema migration";
  readonly "legacy-cron-run-logs": "cron run history migration";
  readonly "legacy-workspace": "workspace setup state migration";
  readonly "legacy-session-store": "session store migration";
};
declare class StartupMaintenanceRequiredError extends Error {
  readonly kind: keyof typeof maintenanceReasons;
  readonly code = "gateway.maintenance_required";
  constructor(kind: keyof typeof maintenanceReasons, message: string, options?: ErrorOptions);
  get reason(): string;
}
//#endregion
//#region src/infra/sqlite-user-version.d.ts
declare class SqliteSchemaVersionError extends StartupMaintenanceRequiredError {
  name: string;
  constructor(message: string);
}
//#endregion
//#region src/plugin-state/plugin-blob-store.types.d.ts
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
declare class PluginBlobStoreError extends Error {
  readonly code: PluginBlobStoreErrorCode;
  readonly operation: PluginBlobStoreOperation;
  readonly path?: string;
  constructor(message: string, options: {
    code: PluginBlobStoreErrorCode;
    operation: PluginBlobStoreOperation;
    path?: string;
    cause?: unknown;
  });
}
//#endregion
//#region src/plugin-state/plugin-state-error.d.ts
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
//#endregion
//#region src/secrets/store/secret-store-validation-error.d.ts
type SecretStoreValidationCode = "SECRET_STORE_INVALID_NAME" | "SECRET_STORE_INVALID_ALLOWED_HOST" | "SECRET_STORE_VALUE_TOO_LARGE" | "SECRET_STORE_VALUE_IN_ARGV" | "SECRET_STORE_VALUE_REDACTED" | "SECRET_STORE_VALUE_CHANGED" | "SECRET_STORE_VALUE_EMPTY";
declare class SecretStoreValidationError extends Error {
  readonly code: SecretStoreValidationCode;
  constructor(code: SecretStoreValidationCode, message: string);
}
//#endregion
//#region src/skills/lifecycle/upload-store-error.d.ts
declare class SkillUploadRequestError extends Error {
  name: string;
}
//#endregion
//#region src/skills/skill-library-error.d.ts
type SkillLibraryErrorCode = "IDENTITY_REQUIRED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "NAME_CONFLICT" | "INVALID_BUNDLE" | "POLICY_BLOCKED" | "AUTHORITY_EXPIRED" | "LIMIT";
//#endregion
//#region src/state/openclaw-state-db-schema-migration-required.d.ts
type OpenClawStateDatabaseSchemaMigrationRequiredKind = "audit-events-v2" | "legacy-cron-run-logs" | "legacy-workshop-review-index";
declare class OpenClawStateDatabaseSchemaMigrationRequiredError extends StartupMaintenanceRequiredError {
  readonly kind: OpenClawStateDatabaseSchemaMigrationRequiredKind;
  readonly pathname: string;
  constructor(kind: OpenClawStateDatabaseSchemaMigrationRequiredKind, pathname: string);
}
//#endregion
//#region src/state/openclaw-state-lease-error.d.ts
declare const leaseErrorCodes: readonly ["OPENCLAW_STATE_LEASE_INVALID_INPUT", "OPENCLAW_STATE_LEASE_HELD", "OPENCLAW_STATE_LEASE_ABORTED", "OPENCLAW_STATE_LEASE_LOST", "OPENCLAW_STATE_LEASE_STORAGE_FAILED"];
type OpenClawStateLeaseErrorCode = (typeof leaseErrorCodes)[number];
//#endregion
//#region src/state/session-metadata-unavailable-error.d.ts
declare class SessionMetadataUnavailableError extends Error {
  readonly reason: "schema-missing" | "table-missing";
  readonly missingTables: readonly string[];
  constructor(reason: "schema-missing" | "table-missing", options?: ErrorOptions, missingTables?: readonly string[]);
}
//#endregion
//#region src/state/openclaw-state-worker-error-identity.d.ts
type MaintenanceKind = ConstructorParameters<typeof StartupMaintenanceRequiredError>[0];
type StateMigrationKind = ConstructorParameters<typeof OpenClawStateDatabaseSchemaMigrationRequiredError>[0];
declare const MESSAGE_ONLY_ERRORS: {
  "duplicate-agent": typeof DuplicateAgentError;
  "session-pending-input-custody": typeof SessionPendingInputCustodyError;
  "skill-upload-request": typeof SkillUploadRequestError;
  coordinator: {
    new (message: string, cause?: unknown): {
      readonly cause?: unknown;
      name: string;
      message: string;
      stack?: string;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
  };
  ownership: typeof OpenClawStateOwnershipError;
  "newer-schema": typeof SqliteSchemaVersionError;
  "range-error": RangeErrorConstructor;
  "syntax-error": SyntaxErrorConstructor;
  "type-error": TypeErrorConstructor;
};
type MessageOnlyErrorIdentity = {
  type: keyof typeof MESSAGE_ONLY_ERRORS;
};
type ErrorIdentity = {
  type: "secret-store-validation";
  secretCode: SecretStoreValidationError["code"];
} | MessageOnlyErrorIdentity | {
  type: "session-goal-operation";
  goalCode: SessionGoalOperationErrorCode;
} | {
  type: "session-mutation-conflict";
  operationLabel: string;
} | {
  type: "worker-session-already-attached";
  sessionId: string;
  environmentId: string;
} | {
  type: "workspace-alias-repointed";
  aliasPath: string;
  storedWorkspacePath: string;
  currentWorkspacePath: string;
} | {
  type: "error" | "aggregate" | "mcp-oauth-corruption";
} | {
  type: "state-owner-contention";
  databasePath: string;
} | {
  type: "ownership-metadata";
  databasePath: string;
} | {
  type: "external-ownership";
  databasePath: string;
  managerId: string;
} | {
  type: "state-lease";
  leaseCode: OpenClawStateLeaseErrorCode;
} | {
  type: "skill-library";
  libraryCode: SkillLibraryErrorCode;
  currentRevision?: string;
} | {
  type: "plugin-blob";
  blobCode: PluginBlobStoreError["code"];
  operation: PluginBlobStoreError["operation"];
  path?: string;
} | {
  type: "maintenance";
  kind: MaintenanceKind;
} | {
  type: "plugin-state";
  stateCode: PluginStateStoreError["code"];
  operation: PluginStateStoreError["operation"];
  path?: string;
  owner: PluginStateStoreError["owner"];
} | {
  type: "state-migration";
  kind: StateMigrationKind;
  pathname: string;
} | {
  type: "session-metadata";
  reason: SessionMetadataUnavailableError["reason"];
  missingTables: readonly string[];
} | {
  type: "agent-media-migration";
  pathname: string;
  schemaVersion: number;
};
//#endregion
//#region src/state/openclaw-state-worker-error.d.ts
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
//#endregion
//#region src/state/worker-operation-registry.d.ts
type WorkerOperationContext = {
  open: () => OpenClawStateDatabase;
  stateOptions: () => {
    path: string;
    env: NodeJS.ProcessEnv;
  };
};
type WorkerOperationHandlers<Context = WorkerOperationContext> = Record<string, (input: never, context: Context) => unknown>;
type WorkerOperations<Handlers extends WorkerOperationHandlers<never>> = { [Key in keyof Handlers]: {
  input: Parameters<Handlers[Key]>[0];
  output: ReturnType<Handlers[Key]>;
}; };
//#endregion
//#region src/shared/device-bootstrap-profile.d.ts
/** Closed purpose codes carried by specialized bootstrap tokens. */
type DeviceBootstrapPurpose = "control-ui" | "control-ui-owner" | "mobile-full" | "voice-node" | "cloud-worker";
/** Normalized roles/scopes carried by a bootstrap token during device handoff. */
type DeviceBootstrapProfile = {
  roles: string[];
  scopes: string[];
  purpose?: DeviceBootstrapPurpose;
};
/** Caller-provided bootstrap profile before role/scope normalization and bounding. */
type DeviceBootstrapProfileInput = {
  roles?: readonly string[];
  scopes?: readonly string[];
  purpose?: DeviceBootstrapPurpose;
};
type PairingSetupAccess = "full" | "limited" | "node";
/** Operator scopes allowed to cross the short-lived bootstrap handoff boundary. */
declare const BOOTSTRAP_HANDOFF_OPERATOR_SCOPES: readonly ["operator.approvals", "operator.questions", "operator.read", "operator.talk.secrets", "operator.write"];
/** Existing least-privilege setup-code/QR profile. */
declare const PAIRING_SETUP_BOOTSTRAP_PROFILE: DeviceBootstrapProfile;
/** Normalize caller-provided bootstrap roles/scopes without applying handoff bounds. */
declare function normalizeDeviceBootstrapProfile(input: DeviceBootstrapProfileInput | undefined): DeviceBootstrapProfile;
//#endregion
//#region src/infra/device-pairing.types.d.ts
/** Pending device pairing request awaiting owner approval. */
type DevicePairingPendingRequest = SchemaContract<Static<typeof DevicePairRequestedEventSchema>>;
/** Bearer token issued to one paired device role. */
type DeviceAuthToken = {
  token: string;
  role: string;
  scopes: string[];
  issuer?: {
    kind: "shared-gateway-auth";
    generation: string;
  };
  createdAtMs: number;
  rotatedAtMs?: number;
  revokedAtMs?: number;
  lastUsedAtMs?: number;
};
/**
 * How the latest pairing approval was granted. "silent" is a same-host local
 * policy approval and the only prune-eligible kind: local clients re-pair
 * silently and cannot collide with another machine's records. "trusted-cidr"
 * and "ssh-verified" are also non-interactive but cross hosts, so they are
 * never pruned automatically (display metadata is not a machine identity).
 * "trusted-proxy" records were approved from an authenticated proxy identity.
 * "owner" and "bootstrap" approvals required a user action. None of these
 * cross-host or interactive approval kinds are pruned automatically.
 */
type PairedDeviceApprovalKind = "owner" | "silent" | "trusted-cidr" | "trusted-proxy" | "ssh-verified" | "bootstrap";
/**
 * Approved node capability surface for a node-role device. Device pairing
 * grants connection auth; this grants command/capability exposure (node
 * command gating). displayName here is the operator-facing node name set at
 * approval or via node.rename; it must not be clobbered by reconnect
 * metadata refreshes, which is why it lives apart from the device fields.
 */
type PairedDeviceNodeSurface = {
  displayName?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  modelIdentifier?: string;
  caps?: string[];
  commands?: string[];
  permissions?: Record<string, boolean>;
  bins?: string[];
  /** Last current-generation runner publication explicitly enabled session hosting. */
  sessionHost?: boolean;
  createdAtMs: number;
  approvedAtMs: number;
  lastConnectedAtMs?: number;
  lastDisconnectedAtMs?: number;
  lastHostStats?: NodeHostStats;
};
/**
 * Pending node-surface approval awaiting an operator decision (one per
 * device). Carries its own metadata snapshot so approval UIs can show what
 * the node declared at request time. `revision` guards the reconnect-vs-
 * approve race: reconnect cleanup only deletes the revision it observed, so
 * a refreshed request survives concurrent approval flows.
 */
type PairedDevicePendingNodeSurface = {
  requestId: string;
  revision: string;
  displayName?: string;
  platform?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  clientId?: string;
  clientMode?: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  caps?: string[];
  commands?: string[];
  permissions?: Record<string, boolean>;
  remoteIp?: string;
  silent?: boolean;
  ts: number;
};
/** Persisted approved device record, including durable approval and active role tokens. */
type PairedDevice = {
  deviceId: string;
  publicKey: string;
  displayName?: string;
  operatorLabel?: string;
  platform?: string;
  deviceFamily?: string;
  clientId?: string;
  clientMode?: string;
  browserOrigin?: string;
  role?: string;
  roles?: string[];
  scopes?: string[];
  approvedScopes?: string[];
  remoteIp?: string;
  tokens?: Record<string, DeviceAuthToken>;
  approvedVia?: PairedDeviceApprovalKind;
  nodeSurface?: PairedDeviceNodeSurface;
  pendingNodeSurface?: PairedDevicePendingNodeSurface;
  createdAtMs: number;
  approvedAtMs: number;
  lastSeenAtMs?: number;
  lastSeenReason?: string;
};
/** Persisted bootstrap token state, including binding and role/scope redemption progress. */
type DeviceBootstrapTokenRecord = {
  token: string;
  setupId?: string;
  ts: number;
  deviceId?: string;
  publicKey?: string;
  profile?: DeviceBootstrapProfile;
  redeemedProfile?: DeviceBootstrapProfile;
  pendingProfile?: DeviceBootstrapProfile;
  issuedAtMs: number;
  lastUsedAtMs?: number;
};
/**
 * Durable terminal outcome for one setup credential. Redemption deletes the
 * bootstrap row, so this record is what lets a presenting client answer
 * "did my setup code succeed?" without having received the broadcast.
 */
type DevicePairSetupCompletionRecord = {
  setupId: string;
  deviceId: string;
  deviceName?: string;
  access: PairingSetupAccess;
  completedAtMs: number;
  deliveryState: "uncertain" | "confirmed";
  retainUntilMs: number;
};
//#endregion
//#region src/infra/device-bootstrap.worker-types.d.ts
type DeviceBootstrapBoundContextInput = {
  token: string;
  deviceId: string;
  publicKey: string;
  nowMs: number;
};
type CloudWorkerSetupMutationAdmission = {
  environmentId: string;
  setupId: string;
  credentialDigest: string;
  provisionOperationId: string;
  ownerEpoch: number;
};
//#endregion
//#region src/infra/device-pairing-core.types.d.ts
/** Paired-device access metadata refreshed when an existing device reconnects. */
type DevicePairingAccessMetadata = Pick<PairedDevice, "displayName" | "remoteIp" | "lastSeenAtMs" | "lastSeenReason">;
/** Authorization failure categories for owner approval and bootstrap approval flows. */
type DevicePairingForbiddenReason = "caller-scopes-required" | "caller-missing-scope" | "scope-outside-requested-roles" | "approval-policy-changed" | "bootstrap-role-not-allowed" | "bootstrap-scope-not-allowed";
/** Structured forbidden result with the missing/disallowed role or scope when known. */
type DevicePairingForbiddenResult = {
  status: "forbidden";
  reason: DevicePairingForbiddenReason;
  scope?: string;
  role?: string;
};
/** Pairing approval outcome: approved, forbidden with reason, or request not found. */
type ApproveDevicePairingResult = {
  status: "approved";
  requestId: string;
  device: PairedDevice;
  /** Existing connected node transports must be retired before success is returned. */
  nodePairingGenerationChanged?: true;
} | DevicePairingForbiddenResult | null;
type DevicePairingApprovalOptions = {
  callerScopes?: readonly string[];
  accessMetadata?: DevicePairingAccessMetadata;
  approvedVia?: Extract<PairedDeviceApprovalKind, "owner" | "silent" | "trusted-cidr" | "trusted-proxy" | "ssh-verified">;
  /** Revalidate automatic approval against current policy after all pairing-lock awaits. */
  isApprovalCurrent?: (state: {
    pending: Readonly<DevicePairingPendingRequest>;
    existing: Readonly<PairedDevice> | undefined;
  }) => boolean;
  /**
   * Replace pending scopes for a new operator device, or a trusted-proxy
   * same-key upgrade. The live role set is rechecked under the pairing lock.
   */
  autoApproveNewDeviceScopes?: readonly string[];
};
//#endregion
//#region src/infra/device-pairing.d.ts
declare function listDevicePairing(baseDir?: string): Promise<{
  pending: DevicePairingPendingRequest[];
  paired: PairedDevice[];
}>;
//#endregion
export { PluginStateStoreError as _, DeviceBootstrapBoundContextInput as a, BOOTSTRAP_HANDOFF_OPERATOR_SCOPES as c, DeviceBootstrapPurpose as d, PAIRING_SETUP_BOOTSTRAP_PROFILE as f, OpenClawStateWorkerErrorPayload as g, WorkerOperations as h, CloudWorkerSetupMutationAdmission as i, DeviceBootstrapProfile as l, WorkerOperationContext as m, ApproveDevicePairingResult as n, DeviceBootstrapTokenRecord as o, normalizeDeviceBootstrapProfile as p, DevicePairingApprovalOptions as r, DevicePairSetupCompletionRecord as s, listDevicePairing as t, DeviceBootstrapProfileInput as u, OpenBlobStoreOptions as v, PluginBlobStore as y };