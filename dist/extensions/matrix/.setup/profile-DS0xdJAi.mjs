import { i as __exportAll } from "./doctor-contract-CsTNmbMa.mjs";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/matrix/src/matrix/profile.ts
var profile_exports = /* @__PURE__ */ __exportAll({
	isSupportedMatrixAvatarSource: () => isSupportedMatrixAvatarSource,
	syncMatrixOwnProfile: () => syncMatrixOwnProfile
});
const MATRIX_PROFILE_AVATAR_MAX_BYTES = 10485760;
function isMatrixMxcUri(value) {
	return normalizeLowercaseStringOrEmpty(value).startsWith("mxc://");
}
function isMatrixHttpAvatarUri(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	return normalized.startsWith("https://") || normalized.startsWith("http://");
}
function isSupportedMatrixAvatarSource(value) {
	return isMatrixMxcUri(value) || isMatrixHttpAvatarUri(value);
}
async function resolveAvatarUrl(params) {
	const avatarPath = normalizeOptionalString(params.avatarPath) ?? null;
	const avatarSource = avatarPath ?? normalizeOptionalString(params.avatarUrl) ?? null;
	if (!avatarSource || !avatarPath && isMatrixMxcUri(avatarSource)) return {
		resolvedAvatarUrl: avatarSource,
		uploadedAvatarSource: null,
		convertedAvatarFromHttp: false
	};
	if (!avatarPath && !isMatrixHttpAvatarUri(avatarSource)) throw new Error("Matrix avatar URL must be an mxc:// URI or an http(s) URL.");
	const loadAvatar = avatarPath ? params.loadAvatarFromPath : params.loadAvatarFromUrl;
	if (!loadAvatar) throw new Error(avatarPath ? "Matrix avatar path upload requires a media loader." : "Matrix avatar URL conversion requires a media loader.");
	const media = await loadAvatar(avatarSource, params.avatarMaxBytes);
	return {
		resolvedAvatarUrl: await params.client.uploadContent(media.buffer, media.contentType, media.fileName || "avatar"),
		uploadedAvatarSource: avatarPath ? "path" : "http",
		convertedAvatarFromHttp: !avatarPath
	};
}
async function syncMatrixOwnProfile(params) {
	const desiredDisplayName = normalizeOptionalString(params.displayName) ?? null;
	const avatar = await resolveAvatarUrl({
		client: params.client,
		avatarUrl: params.avatarUrl ?? null,
		avatarPath: params.avatarPath ?? null,
		avatarMaxBytes: params.avatarMaxBytes ?? MATRIX_PROFILE_AVATAR_MAX_BYTES,
		loadAvatarFromUrl: params.loadAvatarFromUrl,
		loadAvatarFromPath: params.loadAvatarFromPath
	});
	const desiredAvatarUrl = avatar.resolvedAvatarUrl;
	if (!desiredDisplayName && !desiredAvatarUrl) return {
		skipped: true,
		displayNameUpdated: false,
		avatarUpdated: false,
		...avatar,
		resolvedAvatarUrl: null
	};
	let currentDisplayName;
	let currentAvatarUrl;
	try {
		const currentProfile = await params.client.getUserProfile(params.userId);
		currentDisplayName = normalizeOptionalString(currentProfile.displayname);
		currentAvatarUrl = normalizeOptionalString(currentProfile.avatar_url);
	} catch {}
	let displayNameUpdated = false;
	let avatarUpdated = false;
	if (desiredDisplayName && currentDisplayName !== desiredDisplayName) {
		await params.client.setDisplayName(desiredDisplayName);
		displayNameUpdated = true;
	}
	if (desiredAvatarUrl && currentAvatarUrl !== desiredAvatarUrl) {
		await params.client.setAvatarUrl(desiredAvatarUrl);
		avatarUpdated = true;
	}
	return {
		skipped: false,
		displayNameUpdated,
		avatarUpdated,
		...avatar
	};
}
//#endregion
export { profile_exports as n, syncMatrixOwnProfile as r, isSupportedMatrixAvatarSource as t };
