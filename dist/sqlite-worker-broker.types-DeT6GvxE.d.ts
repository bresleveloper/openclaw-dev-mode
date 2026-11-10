import "./sqlite-database-admission-B2aFY5v9.js";
import "./gateway-lock-payload-CHvO7eLi.js";
import { DatabaseSync } from "node:sqlite";
import { MessagePort, Transferable } from "node:worker_threads";
import { Root } from "@openclaw/fs-safe/root";
import "@openclaw/fs-safe/file-lock";
//#region src/infra/sqlite-worker-contract.d.ts
type SqliteWorkerAdmissionRequest = {
  stage: "open" | "prepare" | "transaction" | "commit";
  facts: unknown;
  /** Opt-in wait budget in milliseconds; omission retains the live-owner wait. */
  deadlineMs?: number;
};
type SqliteWorkerOperations = Record<string, {
  input: unknown;
  output: unknown;
}>;
type SqliteWorkerCommand<Operations extends SqliteWorkerOperations> = { [Key in keyof Operations]: {
  type: Key;
  input: Operations[Key]["input"];
}; }[keyof Operations];
type SqliteWorkerStore<Operations extends SqliteWorkerOperations> = {
  execute<Key extends keyof Operations>(command: {
    type: Key;
    input: Operations[Key]["input"];
  }, options?: {
    signal?: AbortSignal;
  }): Promise<Operations[Key]["output"]>;
  close(): Promise<void>;
};
//#endregion
//#region src/infra/sqlite-worker-operation-settlement.d.ts
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
};
//#endregion
//#region src/infra/sqlite-worker-operation-admission.d.ts
type AdmissionFailureSource = "authority" | "domain" | "protocol";
type DatabaseAuthority = {
  /** Canonical identity captured when the database owner was admitted. */
  databasePath: string;
  /** Only the broker can identify an initial open of its captured primary database. */
  coldOpenPath?: string;
  assertRequest?(): void;
  assertAccess(): void;
  assertCreate?(databasePath: string): void;
  acquireSchema(): {
    assertCurrent(): void;
    release(): void;
  };
};
type SqliteWorkerOperationAdmission = SqliteWorkerNativeSettlementOwner & {
  readonly port: MessagePort;
  readonly attachment?: {
    value: unknown;
  };
  readonly failure: unknown;
  readonly failureSource: AdmissionFailureSource | undefined;
  readonly cleanupFailures: readonly unknown[];
  observeRequests(observer: (request: SqliteWorkerAdmissionRequest) => void): void;
  service(): void;
  finish(): void;
  bindDatabaseAuthority(authority: DatabaseAuthority): void;
};
type SqliteWorkerAdmissionFactory = (operation: RetainedWorkerTransactionAdmission) => {
  admission: SqliteWorkerOperationAdmission;
  nativeLocations: readonly string[];
};
//#endregion
//#region src/infra/runtime-worker-generation.d.ts
type RuntimeWorkerGeneration = {
  resolve(url: URL): URL;
  /** Join accepted work before native termination; a slow close warning never releases custody. */
  retain(owner: object, settle: () => Promise<void | (() => Promise<void>)>): void;
};
//#endregion
//#region src/infra/sqlite-worker-broker.types.d.ts
type SqliteWorkerStoreOptions = {
  runtimeGeneration?: RuntimeWorkerGeneration;
  moduleUrl: URL;
  databasePath: string;
  input: unknown;
  existingOnly?: boolean;
  admission?: {
    identity: string;
    assertCurrent(): void;
  };
};
//#endregion
export { SqliteWorkerOperations as a, SqliteWorkerCommand as i, SqliteWorkerAdmissionFactory as n, SqliteWorkerStore as o, SqliteWorkerAdmissionRequest as r, SqliteWorkerStoreOptions as t };