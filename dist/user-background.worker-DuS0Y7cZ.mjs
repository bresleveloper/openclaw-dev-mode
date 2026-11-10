import "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { a as normalizeBackgroundPreference, o as selectBackgroundSource, r as USER_BACKGROUND_PREFERENCE_KEY } from "./background-preferences-C24XmTL3.mjs";
import { f as readUserBackgroundAsset, i as readUserPreferences, l as deleteUserBackgroundImage, n as ensureUserPreferencesSchema, o as writeUserPreferences, p as writeUserBackgroundImage, u as ensureUserBackgroundSchema } from "./user-preferences.store-BkUaBz4r.mjs";
import { h as selectResolvedUserProfileMetadataById } from "./user-profiles-internal-CBUpoSHj.mjs";
import { t as prepareUserPreferenceUpdate } from "./user-preferences.validation-a7nZkzJ_.mjs";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/state/user-background.kernel.ts
const key = USER_BACKGROUND_PREFERENCE_KEY;
function readSnapshot(db, profileId) {
	const row = readUserBackgroundAsset(db, profileId);
	const value = tableExists(db, "user_preferences") ? readUserPreferences(db, profileId, [key])[key] : void 0;
	return {
		status: "ok",
		asset: row ? {
			assetId: row.asset_id,
			width: row.width,
			height: row.height,
			mime: "image/jpeg",
			byteLength: row.byte_length
		} : null,
		preference: normalizeBackgroundPreference(value) ?? null
	};
}
function resolveProfile(db, profileId) {
	return tableExists(db, "user_profiles") ? selectResolvedUserProfileMetadataById(db, profileId)?.id : void 0;
}
function matchesExpected(current, expected) {
	return (current.asset?.assetId ?? null) === expected.expectedAssetId && isDeepStrictEqual(current.preference, expected.expectedPreference);
}
function commitUserBackgroundInDatabase(db, input) {
	const { profileId, expected, image } = input;
	if (resolveProfile(db, profileId) !== profileId) return { status: "conflict" };
	const current = readSnapshot(db, profileId);
	if (!matchesExpected(current, expected)) return { status: "conflict" };
	const assetId = image ? randomUUID() : void 0;
	const preference = assetId ? {
		...selectBackgroundSource({
			kind: "custom",
			assetId
		}, current.asset ? current.preference ?? void 0 : void 0),
		...current.preference?.presentation ? { presentation: current.preference.presentation } : {}
	} : current.preference?.source.kind === "custom" ? {
		...current.preference,
		source: { kind: "none" }
	} : current.preference;
	if (image && assetId) writeUserBackgroundImage(db, {
		profile_id: profileId,
		asset_id: assetId,
		...image
	});
	else deleteUserBackgroundImage(db, profileId);
	const prepared = prepareUserPreferenceUpdate({ [key]: preference }, { [key]: current.preference });
	if (!prepared.ok) throw new Error("Invalid background preference");
	const result = writeUserPreferences(db, profileId, prepared.value);
	if (!result.ok) throw new Error(`Failed to save background preference: ${result.error.code}`);
	return readSnapshot(db, profileId);
}
//#endregion
//#region src/state/user-background.worker.ts
const userBackgroundOperations = { "userBackground.write": (input, context) => {
	const options = {
		...context.stateOptions(),
		database: context.open()
	};
	if (input.image) ensureUserBackgroundSchema(options);
	ensureUserPreferencesSchema(options);
	return context.writeAdmitted(({ db }) => commitUserBackgroundInDatabase(db, input), { operationLabel: "users.background.set" });
} };
//#endregion
export { userBackgroundOperations };
