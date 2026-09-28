import { ChildProcess } from "node:child_process";
import "execa";
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
export { SpawnResult as t };