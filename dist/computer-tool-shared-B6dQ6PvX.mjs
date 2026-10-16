//#region src/agents/tools/computer-tool-shared.ts
const COMPUTER_ACT_COMMAND = "computer.act";
const SCREEN_SNAPSHOT_COMMAND = "screen.snapshot";
const COMPUTER_REF_WIDTH = 1280;
const SCREENSHOT_QUALITY = .85;
const COMPUTER_OBSERVATION_ACTIONS = /* @__PURE__ */ new Set([
	"screenshot",
	"wait",
	"list_apps",
	"list_windows",
	"get_accessibility_tree",
	"get_cursor_position",
	"get_window_state",
	"zoom",
	"get_browser_state",
	"get_recording_state"
]);
function isComputerObservationAction(action, dialogAction) {
	return action !== void 0 && (COMPUTER_OBSERVATION_ACTIONS.has(action) || action === "browser_dialog" && dialogAction === "inspect");
}
function computerHostKey(target) {
	return target.host === "gateway" ? "gateway" : `node:${target.nodeId}`;
}
function computerTargetDetails(target) {
	return target.host === "gateway" ? { target: "gateway" } : {
		node: target.nodeId,
		...target.environmentId ? { environmentId: target.environmentId } : {}
	};
}
//#endregion
export { computerHostKey as a, SCREEN_SNAPSHOT_COMMAND as i, COMPUTER_REF_WIDTH as n, computerTargetDetails as o, SCREENSHOT_QUALITY as r, isComputerObservationAction as s, COMPUTER_ACT_COMMAND as t };
