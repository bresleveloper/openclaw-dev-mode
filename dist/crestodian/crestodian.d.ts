import { n as RuntimeEnv } from "../runtime-Bxifh4bY.js";
import { a as CrestodianOverview, o as loadCrestodianOverview, r as CrestodianCommandDeps } from "../crestodian-tool-LuFL-64B.js";
import { Fa as CrestodianAssistantPlanner } from "../types-BpDhk2ev.js";

//#region src/crestodian/crestodian.d.ts
/**
 * CLI entry point for Crestodian.
 *
 * This module chooses JSON, one-shot, or interactive TUI mode and delegates all
 * command parsing/execution to dialogue and operation modules.
 */
type CrestodianInteractiveRunner = (opts: RunCrestodianOptions, runtime: RuntimeEnv) => Promise<void>;
/** Options accepted by the Crestodian command runner. */
type RunCrestodianOptions = {
  message?: string;
  yes?: boolean;
  json?: boolean;
  interactive?: boolean; /** "onboarding" swaps the greeting for the first-run setup proposal. */
  welcomeVariant?: "onboarding"; /** Workspace override for the proposed first-run setup (from --workspace). */
  setupWorkspace?: string;
  onReady?: () => void;
  deps?: CrestodianCommandDeps;
  formatOverview?: (overview: CrestodianOverview) => string;
  loadOverview?: typeof loadCrestodianOverview;
  planWithAssistant?: CrestodianAssistantPlanner;
  input?: NodeJS.ReadableStream;
  output?: NodeJS.WritableStream;
  runInteractiveTui?: CrestodianInteractiveRunner;
};
/** Run Crestodian in JSON, one-shot message, or interactive TUI mode. */
declare function runCrestodian(opts?: RunCrestodianOptions, runtime?: RuntimeEnv): Promise<void>;
//#endregion
export { RunCrestodianOptions, runCrestodian };