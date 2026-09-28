import { t as tempWorkspace } from "./private-temp-workspace-DQFTMfun.mjs";
import { t as loadQrCodeRuntime } from "./qr-runtime-C4EjQVLE.mjs";
import path from "node:path";
//#region src/media/qr-image.ts
const DEFAULT_QR_PNG_SCALE = 6;
const DEFAULT_QR_PNG_MARGIN_MODULES = 4;
const MIN_QR_PNG_SCALE = 1;
const MAX_QR_PNG_SCALE = 12;
const MIN_QR_PNG_MARGIN_MODULES = 0;
const MAX_QR_PNG_MARGIN_MODULES = 16;
const QR_PNG_DATA_URL_PREFIX = "data:image/png;base64,";
function resolveQrPngIntegerOption(params) {
	if (params.value === void 0) return params.defaultValue;
	if (!Number.isFinite(params.value)) throw new RangeError(`${params.name} must be a finite number.`);
	const value = Math.floor(params.value);
	if (value < params.min || value > params.max) throw new RangeError(`${params.name} must be between ${params.min} and ${params.max}.`);
	return value;
}
function resolveQrTempPathSegment(name, value) {
	if (!value || value === "." || value === ".." || path.basename(value) !== value) throw new RangeError(`${name} must be a non-empty filename segment.`);
	return value;
}
async function renderQrPngBuffer(input, opts) {
	const scale = resolveQrPngIntegerOption({
		name: "scale",
		value: opts.scale,
		defaultValue: DEFAULT_QR_PNG_SCALE,
		min: MIN_QR_PNG_SCALE,
		max: MAX_QR_PNG_SCALE
	});
	const marginModules = resolveQrPngIntegerOption({
		name: "marginModules",
		value: opts.marginModules,
		defaultValue: DEFAULT_QR_PNG_MARGIN_MODULES,
		min: MIN_QR_PNG_MARGIN_MODULES,
		max: MAX_QR_PNG_MARGIN_MODULES
	});
	return await (await loadQrCodeRuntime()).toBuffer(input, {
		margin: marginModules,
		scale
	});
}
/** Renders QR text as raw PNG base64 after validating bounded renderer options. */
async function renderQrPngBase64(input, opts = {}) {
	return (await renderQrPngBuffer(input, opts)).toString("base64");
}
/** Renders QR text as a PNG data URL. */
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
