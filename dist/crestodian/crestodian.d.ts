import { n as RuntimeEnv } from "../runtime-Bxifh4bY.js";
import { n as CrestodianOverview, r as loadCrestodianOverview, t as CrestodianCommandDeps } from "../operations-BkEPICRM.js";

//#region src/crestodian/assistant-prompts.d.ts
/** Parsed assistant plan before it is re-validated as a Crestodian operation. */
type CrestodianAssistantPlan = {
  command: string;
  reply?: string;
  modelLabel?: string;
};
//#endregion
//#region src/crestodian/assistant.d.ts
type CrestodianAssistantPlanner = (params: {
  input: string;
  overview: CrestodianOverview;
}) => Promise<CrestodianAssistantPlan | null>;
//#endregion
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
  interactive?: boolean;
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