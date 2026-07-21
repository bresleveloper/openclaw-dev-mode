import { t as createLazyImportLoader } from "./lazy-promise-10KxeiYV.js";
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
export { normalizeQrText as n, loadQrCodeRuntime as t };
