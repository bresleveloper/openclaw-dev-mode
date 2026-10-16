import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { m as createImageProcessor } from "./image-ops-D7Ua5lUp.mjs";
import pLimit from "p-limit";
//#region src/gateway/managed-image-thumbnail-cache.ts
const MANAGED_IMAGE_THUMBNAIL_MAX_SIDE = 1200;
async function encodeImageThumbnail(source) {
	return (await createImageProcessor().encode(source, {
		format: "png",
		resize: {
			maxSide: MANAGED_IMAGE_THUMBNAIL_MAX_SIDE,
			enlarge: false
		},
		compressionLevel: 8
	})).data;
}
const MANAGED_IMAGE_THUMBNAIL_CACHE_MAX_ENTRIES = 128;
const MANAGED_IMAGE_THUMBNAIL_CACHE_MAX_BYTES = 16777216;
const MANAGED_IMAGE_THUMBNAIL_MAX_PENDING = 128;
const managedImageThumbnailCache = new LruCache(MANAGED_IMAGE_THUMBNAIL_CACHE_MAX_ENTRIES, {
	maxBytes: MANAGED_IMAGE_THUMBNAIL_CACHE_MAX_BYTES,
	sizeOf: (thumbnail) => thumbnail.byteLength
});
const managedImageThumbnailJobs = /* @__PURE__ */ new Map();
const limitManagedImageThumbnails = pLimit(4);
async function resolveManagedImageThumbnail(cacheKey, create) {
	const cached = managedImageThumbnailCache.get(cacheKey);
	if (cached) return cached;
	const active = managedImageThumbnailJobs.get(cacheKey);
	if (active) return await active;
	if (limitManagedImageThumbnails.pendingCount >= MANAGED_IMAGE_THUMBNAIL_MAX_PENDING) throw new Error("managed image thumbnail queue is full");
	const pending = limitManagedImageThumbnails(create).then((thumbnail) => {
		managedImageThumbnailCache.set(cacheKey, thumbnail);
		return thumbnail;
	}).finally(() => {
		managedImageThumbnailJobs.delete(cacheKey);
	});
	managedImageThumbnailJobs.set(cacheKey, pending);
	return await pending;
}
//#endregion
export { resolveManagedImageThumbnail as n, encodeImageThumbnail as t };
