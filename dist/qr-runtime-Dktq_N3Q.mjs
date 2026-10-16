import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
//#region src/media/qr-runtime.ts
/** Loads the qrcode package lazily so QR support does not affect media startup paths. */
const loadQrCodeRuntime = createLazyPromise(() => import("qrcode").then((mod) => mod.default ?? mod));
//#endregion
export { loadQrCodeRuntime as t };
