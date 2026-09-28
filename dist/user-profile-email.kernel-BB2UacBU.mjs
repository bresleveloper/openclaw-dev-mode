import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { I as publishUserProfileAuthorityChange, _ as toUserProfile, b as userProfilesDb, g as setUserProfileEmailBinding, i as insertUserProfile, u as requireResolvedUserProfileMetadataById } from "./user-profiles-internal-BxQLnWfo.mjs";
import { i as publishUserProfilesChange } from "./user-profile-list-B5pNqyXa.mjs";
//#region src/state/user-profile-email.kernel.ts
function normalizeProfileEmail(email) {
	const normalized = email.trim().toLowerCase();
	if (!normalized) throw new TypeError("email must not be empty");
	return normalized;
}
/** The caller owns the transaction; alias uniqueness and creation settle together. */
function ensureProfileForEmailInDatabase(db, email, initialDisplayName, now, mutation) {
	const kysely = userProfilesDb(db);
	const existingAlias = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_emails").select("profile_id").where("email", "=", email));
	if (existingAlias) return toUserProfile(requireResolvedUserProfileMetadataById(db, existingAlias.profile_id));
	const displayName = initialDisplayName ?? truncateUtf16Safe(email.split("@", 1)[0] || email, 256);
	const row = insertUserProfile(db, displayName, now, mutation);
	setUserProfileEmailBinding(db, email, row.id, now);
	mutation?.authority(row.id);
	publishUserProfileAuthorityChange(db, row.id);
	mutation?.publish(row.id);
	publishUserProfilesChange(db, row.id);
	return toUserProfile(row);
}
//#endregion
export { normalizeProfileEmail as n, ensureProfileForEmailInDatabase as t };
