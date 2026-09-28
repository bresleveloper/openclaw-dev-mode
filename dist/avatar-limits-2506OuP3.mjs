//#region src/shared/avatar-limits.ts
const MAX_USER_PROFILE_AVATAR_BYTES = 524288;
const USER_PROFILE_AVATAR_MIME_TYPES = [
	"image/png",
	"image/jpeg",
	"image/webp"
];
/** Maximum avatar payload size accepted by local file and Gateway upload paths. */
const AVATAR_MAX_BYTES = 2097152;
/** Maximum encoded length of a supported local avatar at AVATAR_MAX_BYTES. */
const AVATAR_MAX_DATA_URL_CHARS = Math.ceil(AVATAR_MAX_BYTES / 3) * 4 + 26;
const AVATAR_IMAGE_DATA_URL_RE = /^data:image\//i;
/** Avatar images render only as <img>; preserve the existing image/* data URL contract. */
function isAvatarImageMimeType(value) {
	return /^image\//i.test(value);
}
/** Accepts image data URLs that fit the Gateway and Control UI payload boundary. */
function isRenderableAvatarImageDataUrl(value) {
	return value.length <= AVATAR_MAX_DATA_URL_CHARS && AVATAR_IMAGE_DATA_URL_RE.test(value);
}
//#endregion
export { isAvatarImageMimeType as a, USER_PROFILE_AVATAR_MIME_TYPES as i, AVATAR_MAX_DATA_URL_CHARS as n, isRenderableAvatarImageDataUrl as o, MAX_USER_PROFILE_AVATAR_BYTES as r, AVATAR_MAX_BYTES as t };
