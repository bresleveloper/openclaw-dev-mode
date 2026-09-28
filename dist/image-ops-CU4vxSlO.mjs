import { t as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-q9v1M311.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-cppt7dT0.mjs";
import { n as createLocalImageProcessor, t as MAX_IMAGE_INPUT_PIXELS } from "./image-processor-config-StN3hXY9.mjs";
import { RastermillError, RastermillUnavailableError, isRastermillUnavailableError, readImageProbeFromHeader } from "rastermill";
//#region src/media/image-processor.ts
const pool = new WorkerTaskPool({
	workerUrl: resolveRuntimeProcessEntrypointUrl("imageProcessor"),
	maxWorkers: 1,
	sharedCompute: true
});
async function runImageTask(input, operation, signal, limits) {
	const reply = await pool.run(() => ({
		...operation,
		...limits ? { limits } : {},
		input: Uint8Array.from(input instanceof ArrayBuffer ? new Uint8Array(input) : input)
	}), {
		timeoutMs: 18e4,
		signal,
		inputBytes: input.byteLength,
		transferList: (request) => [request.input.buffer]
	});
	if (reply.kind === "failed" && reply.code && !reply.unavailable) reply.error = new RastermillError(reply.code, reply.error.message, { cause: reply.error });
	return reply;
}
/** Keep cheap probes local and move in-process image computation off the caller's event loop. */
function createImageProcessor() {
	return createImageProcessorWithPixelLimits({
		inputPixels: MAX_IMAGE_INPUT_PIXELS,
		outputPixels: MAX_IMAGE_INPUT_PIXELS
	});
}
/** Internal operation-specific admission uses the same worker and native fallback owners. */
function createImageProcessorWithPixelLimits(params) {
	const limits = {
		inputPixels: params.inputPixels,
		outputPixels: params.outputPixels
	};
	const local = createLocalImageProcessor("auto", limits);
	const workerLimits = limits.inputPixels === 25e6 && limits.outputPixels === 25e6 ? void 0 : limits;
	return {
		probe: (input) => local.probe(input),
		transparency: async (input) => {
			const reply = await runImageTask(input, { kind: "transparency" }, void 0, workerLimits);
			if (reply.kind === "failed") throw reply.unavailable ? new RastermillUnavailableError("transparency", reply.error.message, [reply.error]) : reply.error;
			if (reply.kind !== "transparency") throw new Error("Unexpected image worker result");
			return reply.value;
		},
		encode: async (input, options) => {
			const { signal, ...workerOptions } = options ?? {};
			const reply = await runImageTask(input, {
				kind: "encode",
				options: workerOptions
			}, signal, workerLimits);
			signal?.throwIfAborted();
			if (reply.kind === "failed") {
				if (!reply.unavailable) throw reply.error;
				return local.encode(input, options);
			}
			if (reply.kind !== "encode") throw new Error("Unexpected image worker result");
			const { data, ...value } = reply.value;
			return {
				...value,
				data: Buffer.from(data.buffer, data.byteOffset, data.byteLength)
			};
		}
	};
}
async function convertBmpToPngWithWorker(input) {
	const reply = await runImageTask(input, { kind: "bmpToPng" });
	if (reply.kind === "failed") throw reply.error;
	if (reply.kind !== "bmpToPng") throw new Error("Unexpected image worker result");
	return Buffer.from(reply.value.buffer, reply.value.byteOffset, reply.value.byteLength);
}
//#endregion
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
function resolveDisplayImageMetadata(probe) {
	if (!probe) return null;
	if (probe.orientation && probe.orientation >= 5 && probe.orientation <= 8) return {
		width: probe.height,
		height: probe.width
	};
	return {
		width: probe.width,
		height: probe.height
	};
}
/** Reads display dimensions from image header bytes without invoking a full image decode. */
function readImageMetadataFromHeader(buffer) {
	return resolveDisplayImageMetadata(readImageProbeFromHeader(buffer));
}
/** Reads image probe data from header bytes without invoking a full image decode. */
function readImageProbeFromHeader$1(buffer) {
	return readImageProbeFromHeader(buffer);
}
/** Detects animated WebP before a single-frame image transform can discard its frames. */
function isAnimatedWebpBuffer(buffer) {
	return buffer.length >= 30 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP" && buffer.toString("ascii", 12, 16) === "VP8X" && buffer.readUInt32LE(16) >= 10 && buffer.readUInt32LE(16) <= buffer.length - 20 && (buffer.readUInt8(20) & 2) !== 0;
}
function wrapRastermillUnavailable(operation, error) {
	if (error instanceof RastermillUnavailableError) throw new ImageProcessorUnavailableError(operation, error.message, error.causes);
	throw error;
}
/** Fully probes display dimensions through Rastermill when header-only metadata is insufficient. */
async function getImageMetadata(buffer) {
	return resolveDisplayImageMetadata(await createImageProcessor().probe(buffer));
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
async function encodeImageToJpeg(buffer, operation) {
	try {
		return (await createImageProcessor().encode(buffer, { format: "jpeg" })).data;
	} catch (error) {
		return wrapRastermillUnavailable(operation, error);
	}
}
/** Converts image bytes into JPEG through the shared image processor. */
async function convertImageToJpeg(buffer) {
	return await encodeImageToJpeg(buffer, "convertImageToJpeg");
}
/** Converts HEIC/HEIF-like image bytes into JPEG through the shared image processor. */
async function convertHeicToJpeg(buffer) {
	return await encodeImageToJpeg(buffer, "convertHeicToJpeg");
}
/** Converts image bytes to PNG, including BMP fallback unsupported by Rastermill's Photon gate. */
async function convertImageToPng(buffer) {
	try {
		return (await createImageProcessor().encode(buffer, { format: "png" })).data;
	} catch (error) {
		const probe = readImageProbeFromHeader(buffer);
		if (!(probe && probe.format === "bmp" && probe.width > 0 && probe.height > 0 && probe.width <= 25e6 / probe.height)) throw error;
		try {
			return await convertBmpToPngWithWorker(buffer);
		} catch {
			throw error;
		}
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
export { convertImageToPng as a, isImageProcessorUnavailableError as c, readImageProbeFromHeader$1 as d, resizeToJpeg as f, convertImageToJpeg as i, optimizeImageToPng as l, createImageProcessorWithPixelLimits as m, buildImageResizeSideGrid as n, getImageMetadata as o, createImageProcessor as p, convertHeicToJpeg as r, isAnimatedWebpBuffer as s, IMAGE_REDUCE_QUALITY_STEPS as t, readImageMetadataFromHeader as u };
