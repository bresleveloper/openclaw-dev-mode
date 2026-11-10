import { t as loadQrCodeRuntime } from "./qr-runtime-Dktq_N3Q.mjs";
import path from "node:path";
import { tempWorkspace } from "@openclaw/fs-safe/temp";
//#region src/media/qr-image.ts
const QR_PNG_DATA_URL_PREFIX = "data:image/png;base64,";
function resolveQrPngIntegerOption(name, input, min, max) {
	if (!Number.isFinite(input)) throw new RangeError(`${name} must be a finite number.`);
	const value = Math.floor(input);
	if (value < min || value > max) throw new RangeError(`${name} must be between ${min} and ${max}.`);
	return value;
}
function resolveQrTempPathSegment(name, value) {
	if (!value || value === "." || value === ".." || path.basename(value) !== value) throw new RangeError(`${name} must be a non-empty filename segment.`);
	return value;
}
async function renderQrPngBuffer(input, { scale = 6, marginModules = 4 }) {
	const resolvedScale = resolveQrPngIntegerOption("scale", scale, 1, 12);
	const margin = resolveQrPngIntegerOption("marginModules", marginModules, 0, 16);
	return await (await loadQrCodeRuntime()).toBuffer(input, {
		margin,
		scale: resolvedScale
	});
}
/** Renders QR text as raw PNG base64 after validating bounded renderer options. */
async function renderQrPngBase64(input, opts = {}) {
	return (await renderQrPngBuffer(input, opts)).toString("base64");
}
async function renderQrPngDataUrl(input, opts = {}) {
	return `${QR_PNG_DATA_URL_PREFIX}${await renderQrPngBase64(input, opts)}`;
}
/** Writes QR PNG output into a scoped temp directory and returns that directory as a media root. */
async function writeQrPngTempFile(input, opts) {
	const dirPrefix = resolveQrTempPathSegment("dirPrefix", opts.dirPrefix);
	const fileName = resolveQrTempPathSegment("fileName", opts.fileName ?? "qr.png");
	const png = await renderQrPngBuffer(input, opts);
	const workspace = await tempWorkspace({
		rootDir: opts.tmpRoot,
		prefix: dirPrefix
	});
	const dirPath = workspace.dir;
	try {
		return {
			filePath: await workspace.write(fileName, png),
			dirPath,
			mediaLocalRoots: [dirPath]
		};
	} catch (err) {
		await workspace.cleanup();
		throw err;
	}
}
//#endregion
export { renderQrPngDataUrl as n, writeQrPngTempFile as r, renderQrPngBase64 as t };
