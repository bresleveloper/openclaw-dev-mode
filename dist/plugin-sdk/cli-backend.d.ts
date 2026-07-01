import { sn as CliBackendConfig } from "./types.openclaw-R57aE8ho.js";
import { Ai as CliBackendAuthEpochMode, Bi as CliBackendThinkingLevel, Fi as CliBackendPrepareExecutionContext, Ii as CliBackendPreparedExecution, Li as CliBackendResolveExecutionArgs, Mi as CliBackendNativeToolMode, Ni as CliBackendNormalizeConfigContext, Pi as CliBackendPlugin, Ri as CliBackendResolveExecutionArgsContext, ji as CliBackendExecutionMode, zi as CliBackendSideQuestionToolMode } from "./types-CXLy55Xw.js";

//#region src/agents/cli-watchdog-defaults.d.ts
declare const CLI_FRESH_WATCHDOG_DEFAULTS: {
  readonly noOutputTimeoutRatio: 0.8;
  readonly minMs: 180000;
  readonly maxMs: 600000;
};
declare const CLI_RESUME_WATCHDOG_DEFAULTS: {
  readonly noOutputTimeoutRatio: 0.3;
  readonly minMs: 60000;
  readonly maxMs: 180000;
};
//#endregion
export { CLI_FRESH_WATCHDOG_DEFAULTS, CLI_RESUME_WATCHDOG_DEFAULTS, type CliBackendAuthEpochMode, type CliBackendConfig, type CliBackendExecutionMode, type CliBackendNativeToolMode, type CliBackendNormalizeConfigContext, type CliBackendPlugin, type CliBackendPrepareExecutionContext, type CliBackendPreparedExecution, type CliBackendResolveExecutionArgs, type CliBackendResolveExecutionArgsContext, type CliBackendSideQuestionToolMode, type CliBackendThinkingLevel };