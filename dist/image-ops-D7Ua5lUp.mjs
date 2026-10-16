import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-D3H3_asn.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-iI3pfrsK.mjs";
import { n as createLocalImageProcessor, t as MAX_IMAGE_INPUT_PIXELS } from "./image-processor-config-C9YllDKk.mjs";
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
const IMAGE_REDUCE_QUALITY_STEPS = [
	85,
	75,
	65,
	55,
	45,
	35
];
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
/** Detects animated WebP before a single-frame image transform can discard its frames. */
function isAnimatedWebpBuffer(buffer) {
	return buffer.length >= 30 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP" && buffer.toString("ascii", 12, 16) === "VP8X" && buffer.readUInt32LE(16) >= 10 && buffer.readUInt32LE(16) <= buffer.length - 20 && (buffer.readUInt8(20) & 2) !== 0;
}
/** Confirm PNG is still without treating a truncated or capped scan as proof. */
function isStillPngBuffer(buffer) {
	if (readImageProbeFromHeader(buffer)?.format !== "png") return false;
	let offset = 8;
	for (let chunks = 0; chunks < 512 && offset + 12 <= buffer.length; chunks += 1) {
		const end = offset + 12 + buffer.readUInt32BE(offset);
		if (end > buffer.length) return false;
		const type = buffer.toString("ascii", offset + 4, offset + 8);
		if (type === "acTL" || type === "IEND") return false;
		if (type === "IDAT") return true;
		offset = end;
	}
	return false;
}
/** Fully probes display dimensions through Rastermill when header-only metadata is insufficient. */
async function getImageMetadata(buffer) {
	return resolveDisplayImageMetadata(await createImageProcessor().probe(buffer));
}
/** Resizes or encodes image bytes as JPEG through the shared image processor. */
async function resizeToJpeg(params) {
	return (await encodeImage(params.buffer, {
		format: "jpeg",
		resize: {
			maxSide: params.maxSide,
			enlarge: params.withoutEnlargement === false
		},
		quality: params.quality
	}, "resizeToJpeg")).data;
}
async function encodeImage(buffer, options, operation) {
	try {
		return await createImageProcessor().encode(buffer, options);
	} catch (error) {
		if (error instanceof RastermillUnavailableError) throw new ImageProcessorUnavailableError(operation, error.message, error.causes);
		throw error;
	}
}
async function convertImageToJpeg(buffer) {
	return (await encodeImage(buffer, { format: "jpeg" }, "convertImageToJpeg")).data;
}
async function convertHeicToJpeg(buffer) {
	return (await encodeImage(buffer, { format: "jpeg" }, "convertHeicToJpeg")).data;
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
	const out = await encodeImage(buffer, {
		format: "png",
		maxBytes,
		search: options?.sides === void 0 ? {} : { maxSide: options.sides }
	}, "optimizeImageToPng");
	return {
		buffer: out.data,
		optimizedSize: out.bytes,
		resizeSide: out.chosen.maxSide ?? out.width,
		compressionLevel: out.chosen.compressionLevel ?? 6
	};
}
//#endregion
export { convertImageToPng as a, isImageProcessorUnavailableError as c, readImageMetadataFromHeader as d, readImageProbeFromHeader as f, createImageProcessorWithPixelLimits as h, convertImageToJpeg as i, isStillPngBuffer as l, createImageProcessor as m, buildImageResizeSideGrid as n, getImageMetadata as o, resizeToJpeg as p, convertHeicToJpeg as r, isAnimatedWebpBuffer as s, IMAGE_REDUCE_QUALITY_STEPS as t, optimizeImageToPng as u };
