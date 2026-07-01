import { t as createLazyImportLoader } from "./lazy-promise-BONnzNfb.js";
//#region src/media/qr-runtime.ts
const qrCodeRuntimeLoader = createLazyImportLoader(() => import("qrcode").then((mod) => mod.default ?? mod));
/** Loads the qrcode package lazily so QR support does not affect media startup paths. */
async function loadQrCodeRuntime() {
	return await qrCodeRuntimeLoader.load();
}
/** Validates QR text before passing it to the renderer runtime. */
function normalizeQrText(text) {
	if (typeof text !== "string") throw new TypeError("QR text must be a string.");
	if (text.length === 0) throw new Error("QR text must not be empty.");
	return text;
}
//#endregion
//#region src/media/qr-terminal.ts
const COMPACT_MARGIN_MODULES = 1;
const TERMINAL_BLACK_ON_WHITE = "\x1B[47m\x1B[30m";
const TERMINAL_RESET = "\x1B[0m";
const FULL_BLOCK = "█";
const UPPER_HALF_BLOCK = "▀";
const LOWER_HALF_BLOCK = "▄";
function readModule(modules, x, y) {
	if (x < 0 || y < 0 || x >= modules.size || y >= modules.size) return false;
	return Boolean(modules.data[y * modules.size + x]);
}
function compactBlock(top, bottom) {
	if (top && bottom) return FULL_BLOCK;
	if (top) return UPPER_HALF_BLOCK;
	if (bottom) return LOWER_HALF_BLOCK;
	return " ";
}
function renderCompactTerminalQr(modules) {
	const lines = [];
	for (let y = -1; y < modules.size + COMPACT_MARGIN_MODULES; y += 2) {
		let line = TERMINAL_BLACK_ON_WHITE;
		for (let x = -1; x < modules.size + COMPACT_MARGIN_MODULES; x += 1) line += compactBlock(readModule(modules, x, y), readModule(modules, x, y + 1));
		lines.push(`${line}${TERMINAL_RESET}`);
	}
	return lines.join("\n");
}
/** Renders QR text for terminal display, with an optional compact half-block mode. */
async function renderQrTerminal(input, opts = {}) {
	const text = normalizeQrText(input);
	const qrCode = await loadQrCodeRuntime();
	if (opts.small === true) return renderCompactTerminalQr(qrCode.create(text).modules);
	return await qrCode.toString(text, {
		small: false,
		type: "terminal"
	});
}
//#endregion
export { loadQrCodeRuntime as n, normalizeQrText as r, renderQrTerminal as t };
