import { r as theme } from "./theme-vjDs9tao.js";
import { t as isVerbose } from "./global-state-BAD7XgmL.js";
import { i as getLogger, o as isFileLogLevelEnabled } from "./logger-ByU25eYB.js";
//#region src/globals.ts
function shouldLogVerbose() {
	return isVerbose() || isFileLogLevelEnabled("debug");
}
function logVerbose(message) {
	if (!shouldLogVerbose()) return;
	try {
		getLogger().debug({ message }, "verbose");
	} catch {}
	if (!isVerbose()) return;
	console.log(theme.muted(message));
}
function logVerboseConsole(message) {
	if (!isVerbose()) return;
	console.log(theme.muted(message));
}
const success = theme.success;
const warn = theme.warn;
const info = theme.info;
const danger = theme.error;
function isDevMode() {
	return process.env.OPENCLAW_DEV_MODE === "1";
}
//#endregion
export { logVerboseConsole as a, warn as c, logVerbose as i, info as n, shouldLogVerbose as o, isDevMode as r, success as s, danger as t };
