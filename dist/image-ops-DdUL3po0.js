import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DOKojISm.js";
import { t as resolveSystemBin } from "./resolve-system-bin-DKa1WXAn.js";
import { RastermillError, RastermillUnavailableError, createRastermill, isRastermillUnavailableError, readImageMetadataFromHeader, readImageProbeFromHeader } from "rastermill";
//#region src/media/image-ops.ts
/** OpenClaw-facing image backend availability error, preserving the failed operation and causes. */
var ImageProcessorUnavailableError = class extends Error {
	constructor(operation, message, causes = []) {
		super(message ?? `Image processor unavailable for ${operation}`, { cause: causes.find((cause) => cause instanceof Error) });
		this.code = "IMAGE_PROCESSOR_UNAVAILABLE";
		this.name = "ImageProcessorUnavailableError";
		this.operation = operation;
		this.causes = causes;
	}
};
/** Ordered JPEG quality ladder used when shrinking generated or attached images. */
const IMAGE_REDUCE_QUALITY_STEPS = [
	85,
	75,
	65,
	55,
	45,
	35
];
/** Shared input/output pixel cap for Rastermill-backed image operations. */
const MAX_IMAGE_INPUT_PIXELS = 25e6;
/** Creates a Rastermill processor with OpenClaw temp-dir, pixel-limit, and command trust policy. */
function createImageProcessor() {
	return createRastermill({
		execution: "auto",
		limits: {
			inputPixels: MAX_IMAGE_INPUT_PIXELS,
			outputPixels: MAX_IMAGE_INPUT_PIXELS
		},
		temp: {
			rootDir: resolvePreferredOpenClawTmpDir(),
			prefix: "openclaw-img-"
		},
		commandResolver: (command) => resolveSystemBin(command, { trust: command === "powershell" ? "strict" : "standard" })
	});
}
/** Detects either OpenClaw's wrapper error or Rastermill's native unavailable error. */
function isImageProcessorUnavailableError(err) {
	return err instanceof ImageProcessorUnavailableError || isRastermillUnavailableError(err);
}
/** Builds a descending, de-duplicated max-side search grid for iterative image resizing. */
function buildImageResizeSideGrid(maxSide, sideStart) {
	return [
		sideStart,
		1800,
		1600,
		1400,
		1200,
		1e3,
		800
	].map((value) => Math.min(maxSide, value)).filter((value, idx, arr) => value > 0 && arr.indexOf(value) === idx).toSorted((a, b) => b - a);
}
/** Reads dimensions from image header bytes without invoking a full image decode. */
function readImageMetadataFromHeader$1(buffer) {
	return readImageMetadataFromHeader(buffer);
}
/** Reads image probe data from header bytes without invoking a full image decode. */
function readImageProbeFromHeader$1(buffer) {
	return readImageProbeFromHeader(buffer);
}
function wrapRastermillUnavailable(operation, error) {
	if (error instanceof RastermillUnavailableError) throw new ImageProcessorUnavailableError(operation, error.message, error.causes);
	throw error;
}
/** Fully probes image dimensions through Rastermill when header-only metadata is insufficient. */
async function getImageMetadata(buffer) {
	const info = await createImageProcessor().probe(buffer);
	return info ? {
		width: info.width,
		height: info.height
	} : null;
}
/** Normalizes EXIF orientation when possible while leaving bytes unchanged if the backend is unavailable. */
async function normalizeExifOrientation(buffer) {
	try {
		const rastermill = createImageProcessor();
		const info = await rastermill.probe(buffer);
		if (!info) return (await rastermill.encode(buffer, {
			format: "jpeg",
			autoOrient: true
		})).data;
		if (!info?.orientation || info.orientation === 1) return buffer;
		return (await rastermill.encode(buffer, {
			format: "jpeg",
			autoOrient: true
		})).data;
	} catch (error) {
		if (isImageProcessorUnavailableError(error)) return buffer;
		throw error;
	}
}
/** Resizes or encodes image bytes as JPEG through the shared image processor. */
async function resizeToJpeg(params) {
	try {
		return (await createImageProcessor().encode(params.buffer, {
			format: "jpeg",
			resize: {
				maxSide: params.maxSide,
				enlarge: params.withoutEnlargement === false
			},
			quality: params.quality
		})).data;
	} catch (error) {
		return wrapRastermillUnavailable("resizeToJpeg", error);
	}
}
/** Converts HEIC/HEIF-like image bytes into JPEG through the shared image processor. */
async function convertHeicToJpeg(buffer) {
	try {
		return (await createImageProcessor().encode(buffer, { format: "jpeg" })).data;
	} catch (error) {
		return wrapRastermillUnavailable("convertHeicToJpeg", error);
	}
}
/** Detects alpha support using a full transparency probe, falling back to trusted header metadata. */
async function hasAlphaChannel(buffer) {
	try {
		return (await createImageProcessor().transparency(buffer)).hasAlphaChannel;
	} catch (error) {
		const headerHasAlpha = readImageProbeFromHeader(buffer)?.hasAlpha === true;
		if (isRastermillUnavailableError(error)) return headerHasAlpha;
		if (error instanceof RastermillError && error.code === "RASTERMILL_UNDECODABLE" && readImageProbeFromHeader(buffer)) return headerHasAlpha;
		throw error;
	}
}
/** Resizes or encodes image bytes as PNG through the shared image processor. */
async function resizeToPng(params) {
	try {
		return (await createImageProcessor().encode(params.buffer, {
			format: "png",
			resize: {
				maxSide: params.maxSide,
				enlarge: params.withoutEnlargement === false
			},
			...params.compressionLevel === void 0 ? {} : { compressionLevel: params.compressionLevel }
		})).data;
	} catch (error) {
		return wrapRastermillUnavailable("resizeToPng", error);
	}
}
/** Optimizes PNG bytes under a target size and returns the chosen search parameters. */
async function optimizeImageToPng(buffer, maxBytes, options) {
	let out;
	try {
		out = await createImageProcessor().encode(buffer, {
			format: "png",
			maxBytes,
			search: options?.sides === void 0 ? {} : { maxSide: options.sides }
		});
	} catch (error) {
		wrapRastermillUnavailable("optimizeImageToPng", error);
	}
	return {
		buffer: out.data,
		optimizedSize: out.bytes,
		resizeSide: out.chosen.maxSide ?? out.width,
		compressionLevel: out.chosen.compressionLevel ?? 6
	};
}
//#endregion
export { convertHeicToJpeg as a, hasAlphaChannel as c, optimizeImageToPng as d, readImageMetadataFromHeader$1 as f, resizeToPng as h, buildImageResizeSideGrid as i, isImageProcessorUnavailableError as l, resizeToJpeg as m, ImageProcessorUnavailableError as n, createImageProcessor as o, readImageProbeFromHeader$1 as p, MAX_IMAGE_INPUT_PIXELS as r, getImageMetadata as s, IMAGE_REDUCE_QUALITY_STEPS as t, normalizeExifOrientation as u };
