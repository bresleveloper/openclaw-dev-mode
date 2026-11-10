import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { l as isImageProcessorUnavailableError, m as resizeToJpeg, n as buildImageResizeSideGrid, s as getImageMetadata, t as IMAGE_REDUCE_QUALITY_STEPS } from "./image-ops-DM5GUpDi.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./media-runtime-CmxLZuo1.mjs";
//#region extensions/browser/src/browser/screenshot.ts
const DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE = 2e3;
const DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES = 5242880;
async function normalizeBrowserScreenshot(buffer, opts) {
	const maxSide = Math.max(1, Math.round(opts?.maxSide ?? 2e3));
	const maxBytes = Math.max(1, Math.round(opts?.maxBytes ?? 5242880));
	const meta = await getImageMetadata(buffer);
	const width = meta?.width ?? 0;
	const height = meta?.height ?? 0;
	const maxDim = Math.max(width, height);
	if (buffer.byteLength <= maxBytes && (maxDim === 0 || width <= maxSide && height <= maxSide)) return {
		buffer,
		sourceDimensions: meta
	};
	const sideGrid = buildImageResizeSideGrid(maxSide, maxDim > 0 ? Math.min(maxSide, maxDim) : maxSide);
	let smallestSize;
	for (const side of sideGrid) for (const quality of IMAGE_REDUCE_QUALITY_STEPS) {
		let out;
		try {
			out = await resizeToJpeg({
				buffer,
				maxSide: side,
				quality,
				withoutEnlargement: true
			});
		} catch (err) {
			if (isImageProcessorUnavailableError(err)) throw toErrorObject(err, "Non-Error thrown");
			throw err;
		}
		smallestSize = Math.min(smallestSize ?? Infinity, out.byteLength);
		if (out.byteLength <= maxBytes) return {
			buffer: out,
			contentType: "image/jpeg",
			sourceDimensions: meta
		};
	}
	const bestSize = smallestSize ?? buffer.byteLength;
	throw new Error(`Browser screenshot could not be reduced below ${(maxBytes / 1048576).toFixed(0)}MB (got ${(bestSize / 1048576).toFixed(2)}MB)`);
}
//#endregion
export { DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE as n, normalizeBrowserScreenshot as r, DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES as t };
