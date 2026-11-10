import "./gateway-lock-payload-CHvO7eLi.js";
import { MessagePort, Transferable, WorkerOptions } from "node:worker_threads";
import "execa";
import { Socket } from "node:net";
//#region src/infra/worker-pool-sizing.d.ts
type WorkerPoolClass = "reader" | "file-reader" | "compute" | "writer" | "singleton";
//#endregion
//#region src/process/exec-output.d.ts
type CommandOutputCaptureMode = "head" | "tail" | "discard";
type CommandOutputStream = "stdout" | "stderr";
type CommandOutputCaptureOption = CommandOutputCaptureMode | {
  stdout?: CommandOutputCaptureMode;
  stderr?: CommandOutputCaptureMode;
};
type CommandOutputLimitOption = boolean | {
  stdout?: boolean;
  stderr?: boolean;
  combined?: boolean;
};
type CommandOutputErrorOption = boolean | {
  stdout?: boolean;
  stderr?: boolean;
};
type PreserveOutputLine = (line: string, stream: CommandOutputStream) => boolean;
//#endregion
//#region src/process/exec-result.d.ts
type SpawnResult = {
  pid?: number;
  stdout: string;
  stderr: string;
  stdoutTruncatedBytes?: number;
  stderrTruncatedBytes?: number;
  preservedStdoutLines?: string[];
  preservedStderrLines?: string[];
  code: number | null;
  signal: NodeJS.Signals | null;
  killed: boolean;
  /** The runner accepted cancellation and requested termination, independent of the OS signal. */
  killIssuedByAbort?: boolean;
  /** Completion of this invocation's cleanup; never an escaped-descendant inventory. */
  cleanup?: "normal" | "cooperative" | "forced" | "uncertain";
  termination: "exit" | "timeout" | "no-output-timeout" | "signal";
  noOutputTimedOut?: boolean;
  outputLimitExceeded?: boolean;
  outputErrorStream?: "stdout" | "stderr";
};
//#endregion
//#region src/process/exec.d.ts
type RunExecOptions = {
  timeoutMs?: number;
  maxBuffer?: number;
  logOutput?: boolean;
  cwd?: string;
  baseEnv?: NodeJS.ProcessEnv;
  env?: NodeJS.ProcessEnv;
  input?: string | Uint8Array;
  stdinFileDescriptor?: number;
  signal?: AbortSignal;
  /** Observe received bytes without changing buffering, completion or cancellation. */
  onOutputChunk?: (chunk: Buffer, stream: CommandOutputStream) => void;
};
declare function runExec(command: string, args: string[], opts?: number | RunExecOptions): Promise<{
  stdout: string;
  stderr: string;
}>;
//#endregion
//#region packages/worker-runtime/src/retained-operation.d.ts
type RetainedOutcome<T> = Readonly<{
  status: "pending";
}> | Readonly<{
  status: "fulfilled";
  value: T;
}> | Readonly<{
  status: "rejected";
  error: unknown;
}>;
type RetainedOperation<T> = {
  readonly result: Promise<T>;
  read(): RetainedOutcome<T>;
  service(): void;
};
//#endregion
//#region packages/worker-runtime/src/worker-task-pool.types.d.ts
type WorkerTaskPoolOptions$1<Output> = {
  workerUrl: URL;
  workerOptions?: Omit<WorkerOptions, "eval">;
  /** Shallow per-Worker overrides; resources stay owned until confirmed Worker exit. */
  prepareWorker?: () => {
    options: Omit<WorkerOptions, "eval">;
    temporaryDirectory?: string;
    /** Runs after temporary-directory cleanup; terminal close joins completion. */
    releaseResources?: () => Promise<void>;
  };
  maxWorkers?: number;
  /** Share CPU admission with other stateless compute pools in this isolate. */
  sharedCompute?: boolean;
  /** Include queued, preparing, and running tasks until execution has settled. */
  maxPendingTasks?: number;
  maxPendingBytes?: number;
  idleTimeoutMs?: number;
  /** Retire workers beyond the first usable slot sooner, without extending its warm window. */
  burstIdleTimeoutMs?: number;
  restartOnError?: boolean;
  validateResult?: (value: Output) => void;
  /** Reports failed stops synchronously; returned rejections never delay retirement. */
  onRetirementFailure?: (error: unknown) => void | Promise<void>;
};
type WorkerTaskResponse = {
  input: unknown;
  /** Move owned binary replies instead of copying large inventories back to the worker. */
  transferList?: readonly Transferable[];
  /** Remaining owner budget, plus its existing watchdog grace. */
  timeoutMs: number;
  /** Release input ownership only after worker consumption or confirmed termination. */
  onConsumed?: () => void;
};
type WorkerTaskRequestContext = {
  /** Task lifetime: closes on completion/checkpoint as well as cancellation. */
  signal: AbortSignal;
  /** Queue pressure requests a checkpoint; it does not cancel underlying host work. */
  yieldSignal: AbortSignal;
};
type WorkerTaskInput<Input> = Input | (() => Input | Promise<Input>);
type WorkerTaskExecutionSettlement = {
  /** True only after this task's worker termination has been joined. */
  retired: boolean;
};
type WorkerTaskOptions<Input> = {
  /** Known retained input bytes, including inputs captured by a factory. No serialization pass. */
  inputBytes?: number;
  /** Queueing, preparation, execution, and host callbacks consume this deadline. */
  timeoutMs?: number;
  /** Only callbacks with their own deadline may replace the pool clock during host waits. */
  hostTimeout?: "owner";
  signal?: AbortSignal;
  transferList?: (input: Input) => readonly Transferable[];
  onRequest?: (value: unknown, context: WorkerTaskRequestContext) => Promise<WorkerTaskResponse>;
  /** Task-scoped observations; these do not settle work or renew its deadline. */
  onNotification?: (value: unknown) => void;
  onInputConsumed?: () => void;
  /** Native task receipt before its result; async input preparation and host effects are not joined. */
  onExecutionSettled?: (settlement: WorkerTaskExecutionSettlement) => void;
};
/** Internal codecs may answer a worker while their caller cannot run Promise reactions. */
type OwnedWorkerTaskOptions<Input> = Omit<WorkerTaskOptions<Input>, "onRequest"> & {
  /** Host diagnostics classify this operation before publishing bounded labels. */
  diagnosticOperation?: string;
} & ({
  onRequest?: WorkerTaskOptions<Input>["onRequest"];
  onRequestSync?: never;
} | {
  onRequest?: never;
  onRequestSync?: (value: unknown, context: WorkerTaskRequestContext) => WorkerTaskResponse;
});
/** Internal custody: a result alone does not release its slot or notify execution settlement. */
type OwnedWorkerTask<Output> = {
  result: Promise<Output>;
  /** Joins cleanup and its execution receipt; failure can also begin cleanup automatically. */
  close(options?: {
    retire?: true;
  }): Promise<void>;
};
type RetainedWorkerTask<Output> = RetainedOperation<Output> & {
  release(options?: {
    retire?: true;
  }): RetainedOperation<void>;
};
//#endregion
//#region src/infra/worker-task-pool.types.d.ts
type WorkerTaskPoolOptions<Output> = WorkerTaskPoolOptions$1<Output> & {
  /** Class sizing takes precedence; maxWorkers may retain an older host's SDK fallback. */
  workerClass?: WorkerPoolClass;
};
//#endregion
//#region src/infra/worker-task-pool.d.ts
/** Existing SDK surface; task custody remains an internal capability. */
declare class WorkerTaskPool<Input, Output> {
  private readonly core;
  constructor(options: WorkerTaskPoolOptions<Output>);
  run(input: WorkerTaskInput<Input>, options: WorkerTaskOptions<Input>): Promise<Output>;
  get isClosed(): boolean;
  getSnapshot(): {
    maxWorkers: number;
    workers: number;
    workersCreated: number;
    activeTasks: number;
    pendingTasks: number;
  };
  retryFailedRetirements(): Promise<void>;
  rotate(): Promise<void>;
  close(error?: Error): Promise<void>;
}
//#endregion
export { WorkerTaskInput as a, runExec as c, CommandOutputErrorOption as d, CommandOutputLimitOption as f, RetainedWorkerTask as i, SpawnResult as l, PreserveOutputLine as m, OwnedWorkerTask as n, WorkerTaskOptions as o, CommandOutputStream as p, OwnedWorkerTaskOptions as r, RetainedOperation as s, WorkerTaskPool as t, CommandOutputCaptureOption as u };