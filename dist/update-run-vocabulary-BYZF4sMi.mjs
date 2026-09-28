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
//#endregion
export { UPDATE_RUN_TRIGGERS as i, UPDATE_RUN_STATUSES as n, UPDATE_RUN_STEP_STATUSES as r, UPDATE_RUN_PHASES as t };
