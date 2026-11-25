import { a as readMediaBuffer, c as saveMediaSource, l as saveMediaStream, o as resolveMediaBufferPath, s as saveMediaBuffer, t as SavedMedia } from "../store-CrZMH6IZ.js";
/** Canonicalizes equivalent local media references without resolving the filesystem. */
export declare function normalizeMediaReferenceForComparison(value: string): string;
export { type SavedMedia, readMediaBuffer, resolveMediaBufferPath, saveMediaBuffer, saveMediaSource, saveMediaStream };