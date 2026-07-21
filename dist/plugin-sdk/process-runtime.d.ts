import { a as runCommandWithTimeout, i as resolveProcessExitCode, n as SpawnResult, o as runExec, r as resolveCommandEnv, s as shouldSpawnWithShell, t as CommandOptions } from "../exec-2Em92hsX.js";

//#region src/process/linux-oom-score.d.ts
type OomWrapOptions = {
  platform?: NodeJS.Platform;
  env?: NodeJS.ProcessEnv;
  shellAvailable?: () => boolean;
};
type OomScoreAdjustedSpawn = {
  command: string;
  args: string[];
  env: NodeJS.ProcessEnv | undefined;
  wrapped: boolean;
};
declare function prepareOomScoreAdjustedSpawn(command: string, args?: readonly string[], options?: OomWrapOptions): OomScoreAdjustedSpawn;
//#endregion
export { CommandOptions, type OomScoreAdjustedSpawn, type OomWrapOptions, SpawnResult, prepareOomScoreAdjustedSpawn, resolveCommandEnv, resolveProcessExitCode, runCommandWithTimeout, runExec, shouldSpawnWithShell };