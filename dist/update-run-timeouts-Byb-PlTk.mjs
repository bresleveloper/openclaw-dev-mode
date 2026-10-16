//#region src/infra/update-run-timeouts.ts
const UPDATE_RUNNER_TIMEOUT_MS = 12e5;
const DEFAULT_UPDATE_STEP_TIMEOUT_MS = 18e5;
const AUTO_UPDATE_STEP_TIMEOUT_MS = 27e5;
/** Shared legacy-reader grace and inactive update reconciliation threshold. */
const ABANDONED_UPDATE_RUN_MS = 18e5;
const UPDATE_RUN_HEARTBEAT_MS = 3e4;
//#endregion
export { UPDATE_RUN_HEARTBEAT_MS as a, UPDATE_RUNNER_TIMEOUT_MS as i, AUTO_UPDATE_STEP_TIMEOUT_MS as n, DEFAULT_UPDATE_STEP_TIMEOUT_MS as r, ABANDONED_UPDATE_RUN_MS as t };
