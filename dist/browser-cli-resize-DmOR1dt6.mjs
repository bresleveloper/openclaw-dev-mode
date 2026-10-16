import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as danger } from "./globals-BXbZ1A_g.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import { n as ACT_MAX_VIEWPORT_DIMENSION } from "./act-policy-PVRotc-k.mjs";
import { c as runBrowserCliRequest } from "./browser-cli-shared-nNyZ_99X.mjs";
//#region extensions/browser/src/cli/browser-cli-resize.ts
function parseBrowserViewportDimension(value, label) {
	const parsed = parseStrictPositiveInteger(value);
	if (parsed !== void 0 && parsed <= 8192) return parsed;
	const reason = parsed === void 0 ? "must be a positive integer" : `maximum is ${ACT_MAX_VIEWPORT_DIMENSION}`;
	defaultRuntime.error(danger(`Invalid ${label}: ${reason}`));
	defaultRuntime.exit(1);
}
async function runBrowserResizeWithOutput(params) {
	await runBrowserCliRequest({
		parent: params.parent,
		path: "/act",
		body: {
			kind: "resize",
			width: params.width,
			height: params.height,
			targetId: normalizeOptionalString(params.targetId)
		},
		successMessage: params.successMessage,
		errorPolicy: params.errorPolicy
	});
}
//#endregion
export { runBrowserResizeWithOutput as n, parseBrowserViewportDimension as t };
