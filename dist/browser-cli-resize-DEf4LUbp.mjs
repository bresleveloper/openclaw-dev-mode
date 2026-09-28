import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as danger } from "./globals-QODkv80i.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { n as ACT_MAX_VIEWPORT_DIMENSION } from "./act-policy-3Ku82pq-.mjs";
import "./core-api-66CmqqZ-.mjs";
import { n as callBrowserRequest, o as parseBrowserPositiveIntegerValue } from "./browser-cli-shared-DEcwGaKW.mjs";
//#region extensions/browser/src/cli/browser-cli-resize.ts
/**
* Shared Browser CLI resize runner used by resize and set viewport commands.
*/
/** Parses a bounded viewport dimension for both Browser resize commands. */
function parseBrowserViewportDimension(value, label) {
	const parsed = parseBrowserPositiveIntegerValue(value);
	if (parsed !== void 0 && parsed <= 8192) return parsed;
	const reason = parsed === void 0 ? "must be a positive integer" : `maximum is ${ACT_MAX_VIEWPORT_DIMENSION}`;
	defaultRuntime.error(danger(`Invalid ${label}: ${reason}`));
	defaultRuntime.exit(1);
}
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
	const result = await callBrowserRequest(params.parent, {
		method: "POST",
		path: "/act",
		query: params.profile ? { profile: params.profile } : void 0,
		body: {
			kind: "resize",
			width,
			height,
			targetId: normalizeOptionalString(params.targetId)
		}
	});
	if (params.parent?.json) {
		defaultRuntime.writeJson(result);
		return;
	}
	defaultRuntime.log(params.successMessage);
}
//#endregion
export { runBrowserResizeWithOutput as n, parseBrowserViewportDimension as t };
