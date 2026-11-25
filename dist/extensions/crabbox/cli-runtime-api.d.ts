import { ID as CommandOptions, RD as SpawnResult } from "../../config-contracts-hzlacViZ.js";
import "../../secret-ref-runtime-CJfm3Mxa.js";
import "@openclaw/proc-safe/inspect";
declare const CRABBOX_ENROLLABLE_TARGETS: readonly ["linux", "windows/wsl2", "windows/normal", "macos"];
type CrabboxOperatingSystem = (typeof CRABBOX_ENROLLABLE_TARGETS)[number];
type CrabboxOfflineRuntimeSetupOptions = {
  nodeBootstrap: {
    install?: "bundle";
    localPath: string;
    sha256: string;
    bytes: number;
    openclawVersion: string;
    buildId: string;
    manifestSha256: string;
    enabledPluginIds: readonly string[];
  };
  workerBundle: {
    localPath: string;
    sha256: string;
    bytes: number;
    packageRelativePath: string;
  };
  target?: CrabboxOperatingSystem;
};
type CrabboxRuntimeInstallationIdentity = {
  nodeBootstrap: {
    sha256: string;
    bytes: number;
    manifestSha256: string;
    buildId: string;
    openclawVersion: string;
    enabledPluginIds: readonly string[];
  };
  workerBundle: {
    sha256: string;
    bytes: number;
    packageRelativePath: string;
  };
};
/** A completed install result, never live authority or permission to skip native verification. */
type CrabboxRuntimeInstallation = CrabboxRuntimeInstallationIdentity & {
  schema: "openclaw.runtime-installation.v1";
  disposition: "installed" | "existing-verified";
  installationVerified: true;
};
/** Parse the same owner result from the existing producer manifest or capture input. */
export declare function parseCrabboxRuntimeInstallation(value: unknown, expected: CrabboxRuntimeInstallationIdentity): CrabboxRuntimeInstallation;
/** Consume only stdout from one successful native installer command. */
export declare function readCrabboxRuntimeInstallation(output: string, expected: CrabboxRuntimeInstallationIdentity): CrabboxRuntimeInstallation;
/** Install verified local runtime archives without enrollment or a logical lease. */
declare function createCrabboxOfflineRuntimeSetup$1(params: CrabboxOfflineRuntimeSetupOptions): {
  command: string;
  forwardedEnv: Record<string, string>;
};
/** Verify the retained cache without repairing, publishing or enrolling it. */
declare function createCrabboxRuntimeCacheVerification$1(params: CrabboxRuntimeInstallationIdentity & {
  target?: CrabboxOperatingSystem;
}): {
  command: string;
  forwardedEnv: Record<string, string>;
};
declare function runCrabboxProcess(argv: string[], options: CommandOptions & {
  timeoutMs: number;
}): Promise<SpawnResult>;
type CrabboxCommandRunner = typeof runCrabboxProcess;
type CrabboxBinary = {
  binary: string;
  version: string;
  /** Report for consumers of a rejected preferred candidate, including shared acquisition. */
  rejected?: string;
};
declare function ensureManagedCrabboxBinary$1(params?: {
  binary?: string;
  /** Current deployment discovery, tried only after the preferred candidate is rejected. */
  fallbackBinary?: string;
  cwd?: string;
  runCommand?: CrabboxCommandRunner;
  env?: NodeJS.ProcessEnv;
  signal?: AbortSignal;
}): Promise<CrabboxBinary>;
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
export declare function createCrabboxOfflineRuntimeSetup(params: Parameters<typeof createCrabboxOfflineRuntimeSetup$1>[0]): Promise<{
  command: string;
  forwardedEnv: Record<string, string>;
}>;
export declare function createCrabboxRuntimeCacheVerification(params: Parameters<typeof createCrabboxRuntimeCacheVerification$1>[0]): Promise<{
  command: string;
  forwardedEnv: Record<string, string>;
}>;
export declare function ensureManagedCrabboxBinary(params?: Parameters<typeof ensureManagedCrabboxBinary$1>[0]): Promise<CrabboxBinary>;
export type { CrabboxBinary, CrabboxRuntimeInstallation, CrabboxRuntimeInstallationIdentity };