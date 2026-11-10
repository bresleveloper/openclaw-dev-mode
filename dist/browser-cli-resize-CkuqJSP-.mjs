import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as danger } from "./globals-XVSoVbNQ.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import { n as ACT_MAX_VIEWPORT_DIMENSION } from "./act-policy-BRluzhGf.mjs";
import { l as runBrowserCliRequest, t as BROWSER_TAB_REFERENCE_HELP } from "./browser-cli-shared-Ljun-8UE.mjs";
//#region extensions/browser/src/cli/browser-cli-resize.ts
function parseBrowserViewportDimension(value, label) {
	const parsed = parseStrictPositiveInteger(value);
	if (parsed !== void 0 && parsed <= 8192) return parsed;
	const reason = parsed === void 0 ? "must be a positive integer" : `maximum is ${ACT_MAX_VIEWPORT_DIMENSION}`;
	defaultRuntime.error(danger(`Invalid ${label}: ${reason}`));
	defaultRuntime.exit(1);
}
function registerBrowserResizeCommand(command, parentOpts, alias = false) {
	command.argument("<width>", "Viewport width").argument("<height>", "Viewport height").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (widthRaw, heightRaw, opts, cmd) => {
		const width = parseBrowserViewportDimension(widthRaw, "width");
		const height = parseBrowserViewportDimension(heightRaw, "height");
		if (width === void 0 || height === void 0) return;
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			path: "/act",
			body: {
				kind: "resize",
				width,
				height,
				targetId: normalizeOptionalString(opts.targetId)
			},
			successMessage: `${alias ? "viewport set:" : "resized to"} ${width}x${height}`,
			errorPolicy: alias ? "runtime" : "inline"
		});
	});
}
//#endregion
export { registerBrowserResizeCommand as t };
