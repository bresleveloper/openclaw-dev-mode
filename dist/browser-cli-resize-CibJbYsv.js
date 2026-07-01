import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import { t as danger } from "./globals-BWmHKFNH.js";
import { n as ACT_MAX_VIEWPORT_DIMENSION } from "./act-policy-ChvnirnB.js";
import "./core-api-DyhvBV08.js";
import { r as callBrowserResize } from "./browser-cli-shared-DqTKKay-.js";
//#region extensions/browser/src/cli/browser-cli-resize.ts
/**
* Shared Browser CLI resize runner used by resize and set viewport commands.
*/
/** Validates viewport dimensions, sends resize action, and writes CLI output. */
async function runBrowserResizeWithOutput(params) {
	const { width, height } = params;
	if (!Number.isFinite(width) || !Number.isFinite(height)) {
		defaultRuntime.error(danger("width and height must be numbers"));
		defaultRuntime.exit(1);
		return;
	}
	if (width > 8192 || height > 8192) {
		defaultRuntime.error(danger(`width and height must not exceed ${ACT_MAX_VIEWPORT_DIMENSION}`));
		defaultRuntime.exit(1);
		return;
	}
	const result = await callBrowserResize(params.parent, {
		profile: params.profile,
		width,
		height,
		targetId: params.targetId
	}, { timeoutMs: params.timeoutMs ?? 2e4 });
	if (params.parent?.json) {
		defaultRuntime.writeJson(result);
		return;
	}
	defaultRuntime.log(params.successMessage);
}
//#endregion
export { runBrowserResizeWithOutput as t };
