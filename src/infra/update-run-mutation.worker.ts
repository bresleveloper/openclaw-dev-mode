import { OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../state/openclaw-state-db-contract.js";
import {
  openExistingOpenClawStateWriter,
  type ExistingOpenClawStateWriter,
} from "../state/openclaw-state-db-existing-write.js";
import { setSqliteBusyTimeout } from "./sqlite-busy-timeout.js";
import { isSqliteLockError } from "./sqlite-error-diagnostics.js";
import { SqliteWorkerAdmissionTimeoutError } from "./sqlite-worker-contract.js";
import { requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission.js";
import { resolveUpdateRunCodecEnv, type UpdateRunLedgerOptions } from "./update-run-codec.js";
import type {
  UpdateRunWriteCommand,
  UpdateRunWriteOperations,
} from "./update-run-mutation.types.js";
import { readRecovery } from "./update-run-recovery-store.js";
import {
  applyUpdateRunPhase,
  applyUpdateRunStep,
  isRequiredUpdateRunStep,
  UPDATE_RUN_BOOKKEEPING_TIMEOUT_MS,
  mutateRunInTransaction,
  updateRunLedgerSchema,
} from "./update-run-write.js";

export function openUpdateRunWriter(options: UpdateRunLedgerOptions): ExistingOpenClawStateWriter {
  return openExistingOpenClawStateWriter(options, {
    schemaSql: updateRunLedgerSchema,
    operationLabel: "update.run",
  });
}

/** Retry only a rolled-back attempt, without giving later worker commands its FIFO slot. */
export function withUpdateRunWriteAdmission<T>(
  operation: (assertCurrent: (stage: "transaction" | "commit") => void) => T,
): T {
  const assertCurrent = (stage: "transaction" | "commit") =>
    requestSqliteWorkerOperationAdmission({
      stage,
      facts: undefined,
      // The serving Gateway's writers have a five-second lock budget. A busy
      // updater host must release this lock well before that budget expires.
      ...(stage === "commit" ? { deadlineMs: 1_000 } : {}),
    });
  for (;;) {
    try {
      return operation(assertCurrent);
    } catch (error) {
      // Transaction helpers finish rollback before throwing. Cleanup/rollback
      // failures and authority refusals escape; neither certifies a safe retry.
      if (!(error instanceof SqliteWorkerAdmissionTimeoutError)) {
        throw error;
      }
      // Fresh transaction admission waits outside BEGIN, so a stalled host no
      // longer holds SQLite's writer. Each attempt rereads authoritative rows.
    }
  }
}

export function recordUpdateRunMutationInWorker(
  command: UpdateRunWriteCommand,
  stateOptions: UpdateRunLedgerOptions,
  assertCurrent: (stage: "transaction" | "commit") => void,
  writer: ExistingOpenClawStateWriter,
): UpdateRunWriteOperations["updateRuns.recordStep"]["output"] {
  const { input } = command;
  // Recovery exclusion must serialize behind the competing writer too.
  const bookkeeping =
    command.type === "updateRuns.recordStep" &&
    !input.requireNoRecovery &&
    !isRequiredUpdateRunStep(command.input.step);
  const busyTimeoutMs = Math.min(
    input.busyTimeoutMs ?? OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
    bookkeeping ? UPDATE_RUN_BOOKKEEPING_TIMEOUT_MS : Infinity,
  );
  const options = {
    ...stateOptions,
    busyTimeoutMs,
    redactPaths: input.redactPaths,
  };
  const codecOptions = {
    ...options,
    env: resolveUpdateRunCodecEnv(options.env, input.redactionFacts),
  };
  let entered = false;
  try {
    // Take the host's initial grant before BEGIN IMMEDIATE; host latency must not hold the writer.
    assertCurrent("transaction");
    return writer.run(({ db }) => {
      entered = true;
      // The longer wait is for BEGIN only; mutation and commit keep the normal lock budget.
      if (busyTimeoutMs > OPENCLAW_SQLITE_BUSY_TIMEOUT_MS) {
        setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
      }
      if (input.requireNoRecovery) {
        const recovery = readRecovery(db, input.runId);
        if (recovery) {
          assertCurrent("commit");
          return { kind: "recovery-required", recovery };
        }
      }
      const record = mutateRunInTransaction(
        db,
        input.runId,
        (current) => {
          if (command.type === "updateRuns.recordPhase") {
            applyUpdateRunPhase(current, command.input.phase, command.input.patch);
          } else {
            applyUpdateRunStep(current, command.input.step);
          }
        },
        codecOptions,
      );
      assertCurrent("commit");
      return { kind: "recorded", record };
    }, options);
  } catch (cause) {
    if (entered || !isSqliteLockError(cause)) {
      throw cause;
    }
    if (bookkeeping) {
      return { kind: "bookkeeping-skipped" };
    }
    throw new Error(
      "Update history database is locked; required recovery evidence was not recorded. Wait for the writer to finish, then retry `openclaw update`.",
      { cause },
    );
  }
}
