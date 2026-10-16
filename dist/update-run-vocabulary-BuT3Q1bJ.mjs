//#region packages/gateway-protocol/src/update-run-vocabulary.ts
const UPDATE_RUN_PHASES = [
	"requested",
	"staging",
	"validating",
	"repairing",
	"activating",
	"restarting",
	"verifying",
	"finished"
];
const UPDATE_RUN_STATUSES = [
	"running",
	"succeeded",
	"failed",
	"rolled-back",
	"skipped"
];
const UPDATE_RUN_TRIGGERS = [
	"chat",
	"control-ui",
	"cli",
	"campaign",
	"mac-app",
	"api"
];
const UPDATE_RUN_STEP_STATUSES = [
	"pending",
	"in_progress",
	"completed",
	"failed",
	"skipped"
];
const UPDATE_NPM_ERROR_CODES = [
	"ETARGET",
	"E404",
	"EINTEGRITY",
	"EACCES",
	"ENOTEMPTY",
	"ENOSPC",
	"ECONNRESET",
	"ETIMEDOUT",
	"EBUSY",
	"unknown"
];
//#endregion
export { UPDATE_RUN_TRIGGERS as a, UPDATE_RUN_STEP_STATUSES as i, UPDATE_RUN_PHASES as n, UPDATE_RUN_STATUSES as r, UPDATE_NPM_ERROR_CODES as t };
