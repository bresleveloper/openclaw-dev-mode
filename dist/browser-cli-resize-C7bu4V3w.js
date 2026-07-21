import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { t as danger } from "./globals-BElpud1m.js";
import { n as ACT_MAX_VIEWPORT_DIMENSION } from "./act-policy-ChvnirnB.js";
import "./core-api-DA_Iz9YL.js";
import { r as callBrowserResize } from "./browser-cli-shared-Dz3C5rWl.js";
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
