import { t as SpawnResult } from "../../exec-CSuWltlK.js";
//#region extensions/crabbox/src/crabbox-worker-command.d.ts
type CrabboxCommandRunner = (argv: string[], options: {
  killProcessTree: boolean;
  env?: NodeJS.ProcessEnv;
  input?: string | Uint8Array;
  maxOutputBytes: number;
  signal?: AbortSignal;
  timeoutMs: number;
}) => Promise<SpawnResult>;
//#endregion
//#region extensions/crabbox/src/crabbox-managed-binary.d.ts
type CrabboxBinary = {
  binary: string;
  version: string;
};
declare function ensureManagedCrabboxBinary$1(params?: {
  binary?: string;
  cwd?: string;
  runCommand?: CrabboxCommandRunner;
  env?: NodeJS.ProcessEnv;
  signal?: AbortSignal;
}): Promise<CrabboxBinary>;
//#endregion
//#region extensions/crabbox/src/crabbox-binary.d.ts
type CrabboxBinaryOptions = {
  cwd?: string;
  explicit?: string;
  isExecutable?: (candidate: string) => boolean;
  openclawRoot?: string;
  pathEnv?: string;
  platform?: NodeJS.Platform;
};
export declare function resolveCrabboxBinary(params: CrabboxBinaryOptions): string;
export declare function findCrabboxBinary(params: CrabboxBinaryOptions): string | undefined;
//#endregion
//#region extensions/crabbox/cli-runtime-api.d.ts
export declare function ensureManagedCrabboxBinary(params?: Parameters<typeof ensureManagedCrabboxBinary$1>[0]): Promise<CrabboxBinary>;
//#endregion
export type { CrabboxBinary };