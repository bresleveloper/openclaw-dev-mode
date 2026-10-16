//#region src/plugins/portable-icon-paths.ts
/** Package-local artwork contracts shared by discovery and package builders. */
const PORTABLE_PLUGIN_ICON_PATH = "assets/icon.png";
const PLUGIN_ACTIVITY_ICON_PATH = "assets/activity.svg";
const PLUGIN_TOOL_ACTIVITY_ICON_DIR = "assets/activity";
const PLUGIN_ACTIVITY_ICON_MAX_BYTES = 32768;
function isPluginActivityToolName(value) {
	return /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$/u.test(value);
}
//#endregion
export { isPluginActivityToolName as a, PORTABLE_PLUGIN_ICON_PATH as i, PLUGIN_ACTIVITY_ICON_PATH as n, PLUGIN_TOOL_ACTIVITY_ICON_DIR as r, PLUGIN_ACTIVITY_ICON_MAX_BYTES as t };
