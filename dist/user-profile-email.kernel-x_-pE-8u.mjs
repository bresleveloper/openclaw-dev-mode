import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { g as selectUserProfileEmailAlias, i as insertUserProfile, u as requireResolvedUserProfileMetadataById, v as setUserProfileEmailBinding, y as toUserProfile } from "./user-profiles-internal-DlO1LBbo.mjs";
import { s as publishUserProfilesChange } from "./user-profile-list-CtETKur7.mjs";
//#region src/state/user-profile-email.kernel.ts
function normalizeProfileEmail(email) {
	const normalized = email.trim().toLowerCase();
	if (!normalized) throw new TypeError("email must not be empty");
	return normalized;
}
/** The caller owns the transaction; alias uniqueness and creation settle together. */
function ensureProfileForEmailInDatabase(db, email, initialDisplayName, now, mutation) {
	const existingAlias = selectUserProfileEmailAlias(db, email);
	if (existingAlias) return toUserProfile(requireResolvedUserProfileMetadataById(db, existingAlias.profile_id));
	const displayName = initialDisplayName ?? truncateUtf16Safe(email.split("@", 1)[0] || email, 256);
	const row = insertUserProfile(db, displayName, now, mutation);
	setUserProfileEmailBinding(db, email, row.id, now);
	mutation?.authority(row.id);
	mutation?.publish(row.id);
	publishUserProfilesChange(db, row.id);
	return toUserProfile(row);
}
//#endregion
export { normalizeProfileEmail as n, ensureProfileForEmailInDatabase as t };
