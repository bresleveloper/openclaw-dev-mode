import type QRCode from "qrcode";
type QrCodeRuntime = typeof QRCode;
/** Loads the qrcode package lazily so QR support does not affect media startup paths. */
export declare function loadQrCodeRuntime(): Promise<QrCodeRuntime>;
/** Validates QR text before passing it to the renderer runtime. */
export declare function normalizeQrText(text: string): string;
export {};
