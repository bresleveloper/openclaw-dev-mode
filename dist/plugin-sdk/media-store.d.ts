import { a as readMediaBuffer, c as saveMediaSource, l as saveMediaStream, o as resolveMediaBufferPath, s as saveMediaBuffer, t as SavedMedia } from "../store-DRw65Khe.js";
//#region src/media/media-reference-comparison.d.ts
/** Canonicalizes equivalent local media references without resolving the filesystem. */
export declare function normalizeMediaReferenceForComparison(value: string): string;
//#endregion
export { type SavedMedia, readMediaBuffer, resolveMediaBufferPath, saveMediaBuffer, saveMediaSource, saveMediaStream };