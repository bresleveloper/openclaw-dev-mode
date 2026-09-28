import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { t as resolveSystemBin } from "./resolve-system-bin-wk53Z0G9.mjs";
import { createRastermill } from "rastermill";
//#region src/media/image-processor-config.ts
/** Shared input/output pixel cap for Rastermill-backed image operations. */
const MAX_IMAGE_INPUT_PIXELS = 25e6;
function createLocalImageProcessor(execution, limits = {
	inputPixels: MAX_IMAGE_INPUT_PIXELS,
	outputPixels: MAX_IMAGE_INPUT_PIXELS
}) {
	return createRastermill({
		execution,
		limits,
		temp: {
			rootDir: resolvePreferredOpenClawTmpDir(),
			prefix: "openclaw-img-"
		},
		commandResolver: (command) => resolveSystemBin(command, { trust: command === "powershell" ? "strict" : "standard" })
	});
}
//#endregion
export { createLocalImageProcessor as n, MAX_IMAGE_INPUT_PIXELS as t };
