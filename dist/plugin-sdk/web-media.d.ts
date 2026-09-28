import { i as optimizeImageToJpeg, l as optimizeImageToPng, n as loadWebMedia, r as loadWebMediaRaw, t as WebMediaResult } from "../web-media-Deh9x9Pt.js";
//#region src/media/local-media-access.d.ts
/** Machine-readable reasons local media path validation can fail. */
type LocalMediaAccessErrorCode = "path-not-allowed" | "invalid-root" | "invalid-file-url" | "network-path-not-allowed" | "unsafe-bypass" | "unsupported-media-type" | "not-found" | "invalid-path" | "not-file";
/** Error raised when a local media path escapes the configured allowlist. */
export declare class LocalMediaAccessError extends Error {
  code: LocalMediaAccessErrorCode;
  constructor(code: LocalMediaAccessErrorCode, message: string, options?: ErrorOptions);
}
/** Returns the default root allowlist for local media reads. */
declare function getDefaultLocalRootsCore(): readonly string[];
//#endregion
export { type LocalMediaAccessErrorCode, type WebMediaResult, getDefaultLocalRootsCore as getDefaultLocalRoots, loadWebMedia, loadWebMediaRaw, optimizeImageToJpeg, optimizeImageToPng };