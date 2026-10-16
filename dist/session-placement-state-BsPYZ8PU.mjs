//#region packages/gateway-protocol/src/schema/session-placement-state.ts
const SESSION_PLACEMENT_STATES = [
	"local",
	"requested",
	"provisioning",
	"syncing",
	"starting",
	"active",
	"draining",
	"reconciling",
	"reclaimed",
	"failed"
];
function isCloudWorkerPlacementState(state) {
	return state !== void 0 && state !== "local" && state !== "reclaimed";
}
//#endregion
export { isCloudWorkerPlacementState as n, SESSION_PLACEMENT_STATES as t };
