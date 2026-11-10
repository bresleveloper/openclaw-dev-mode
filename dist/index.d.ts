import { $t as CliDeps, DA as resolveSessionStorePathCore, Hv as resolveSessionKey$1, Vv as deriveSessionKey$1, aT as runCommandWithTimeout$2, u as applyTemplate$1 } from "./config-contracts-CY87ANNp.js";
import { c as runExec$2 } from "./gateway-owner-lease.types-CCwtkakb.js";
import { n as RuntimeEnv } from "./runtime-M_jncu14.js";
import { o as loadConfig$1 } from "./config-S5Zm-Svf.js";
import { n as normalizeE164$1 } from "./utils-DhaCU8ER.js";
import { i as handlePortError$1, n as describePortOwner$1, r as ensurePortAvailable$1, t as PortInUseError$1 } from "./ports-BXLAZrBD.js";
import { t as getReplyFromConfig$2 } from "./get-reply-BOg3LdZK.js";
//#region src/cli/deps.d.ts
declare function createDefaultDeps$1(): CliDeps;
//#endregion
//#region src/cli/prompt.d.ts
/** Prompts for yes/no input, honoring global `--yes` before opening stdin. */
declare function promptYesNo$2(question: string, defaultYes?: boolean): Promise<boolean>;
//#endregion
//#region src/cli/wait.d.ts
declare function waitForever$1(): Promise<void>;
//#endregion
//#region src/infra/binaries.d.ts
declare function ensureBinary$2(name: string, exec?: typeof runExec$2, runtime?: RuntimeEnv): Promise<void>;
//#endregion
//#region src/plugins/runtime/runtime-web-channel-plugin.d.ts
/** Package-root embedding API; runtime instances and cold callers share the public-surface loader. */
declare function monitorWebChannel$2(...args: unknown[]): Promise<unknown>;
declare namespace library_d_exports {
  export { PortInUseError$1 as PortInUseError, applyTemplate$1 as applyTemplate, createDefaultDeps$1 as createDefaultDeps, deriveSessionKey$1 as deriveSessionKey, describePortOwner$1 as describePortOwner, ensureBinary$1 as ensureBinary, ensurePortAvailable$1 as ensurePortAvailable, getReplyFromConfig$1 as getReplyFromConfig, handlePortError$1 as handlePortError, loadConfig$1 as loadConfig, monitorWebChannel$1 as monitorWebChannel, normalizeE164$1 as normalizeE164, promptYesNo$1 as promptYesNo, resolveSessionKey$1 as resolveSessionKey, resolveSessionStorePathCore as resolveStorePath, runCommandWithTimeout$1 as runCommandWithTimeout, runExec$1 as runExec, waitForever$1 as waitForever };
}
type GetReplyFromConfig = typeof getReplyFromConfig$2;
type PromptYesNo = typeof promptYesNo$2;
type EnsureBinary = typeof ensureBinary$2;
type RunExec = typeof runExec$2;
type RunCommandWithTimeout = typeof runCommandWithTimeout$2;
type MonitorWebChannel = typeof monitorWebChannel$2;
declare const getReplyFromConfig$1: GetReplyFromConfig;
declare const promptYesNo$1: PromptYesNo;
declare const ensureBinary$1: EnsureBinary;
declare const runExec$1: RunExec;
declare const runCommandWithTimeout$1: RunCommandWithTimeout;
declare const monitorWebChannel$1: MonitorWebChannel;
//#endregion
//#region src/index.d.ts
type LegacyCliDeps = {
  runCli: (argv: string[], options?: {
    retainConsoleRoutingUntilProcessExit?: boolean;
  }) => Promise<void>;
};
type LibraryExports = typeof library_d_exports;
export declare let applyTemplate: LibraryExports["applyTemplate"];
export declare let createDefaultDeps: LibraryExports["createDefaultDeps"];
export declare let deriveSessionKey: LibraryExports["deriveSessionKey"];
export declare let describePortOwner: LibraryExports["describePortOwner"];
export declare let ensureBinary: LibraryExports["ensureBinary"];
export declare let ensurePortAvailable: LibraryExports["ensurePortAvailable"];
export declare let getReplyFromConfig: LibraryExports["getReplyFromConfig"];
export declare let handlePortError: LibraryExports["handlePortError"];
export declare let loadConfig: LibraryExports["loadConfig"];
export declare let monitorWebChannel: LibraryExports["monitorWebChannel"];
export declare let normalizeE164: LibraryExports["normalizeE164"];
export declare let PortInUseError: LibraryExports["PortInUseError"];
export declare let promptYesNo: LibraryExports["promptYesNo"];
export declare let resolveSessionKey: LibraryExports["resolveSessionKey"];
export declare let resolveStorePath: LibraryExports["resolveStorePath"];
export declare let runCommandWithTimeout: LibraryExports["runCommandWithTimeout"];
export declare let runExec: LibraryExports["runExec"];
export declare let waitForever: LibraryExports["waitForever"];
export declare function runLegacyCliEntry(argv?: string[], deps?: LegacyCliDeps, options?: {
  retainConsoleRoutingUntilProcessExit?: boolean;
}): Promise<void>;
//#endregion