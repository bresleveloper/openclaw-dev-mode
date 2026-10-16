//#region src/runtime.d.ts
type RuntimeExitOptions = {
  /** Route ANSI terminal-reset bytes away from structured stdout when needed. */
  resetStream?: NodeJS.WriteStream;
};
type RuntimeEnv = {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  /**
   * Exit the process after restoring terminal state.
   * Pass `resetStream` to route the ANSI reset sequence to a specific
   * stream (e.g. stderr) when structured output on stdout must stay clean.
   */
  exit: (code: number, opts?: RuntimeExitOptions) => void;
};
type OutputRuntimeEnv = RuntimeEnv & {
  writeStdout: (value: string) => void;
  writeJson: (value: unknown, space?: number) => void;
};
declare const defaultRuntime: OutputRuntimeEnv;
declare function createNonExitingRuntime(): OutputRuntimeEnv;
//#endregion
export { defaultRuntime as i, RuntimeEnv as n, createNonExitingRuntime as r, OutputRuntimeEnv as t };