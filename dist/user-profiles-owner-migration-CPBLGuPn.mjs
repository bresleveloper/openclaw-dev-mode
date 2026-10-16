import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as GATEWAY_OWNER_PROFILE_ID } from "./user-profile-constants-DfyZS95p.mjs";
import { B as publishUserProfileAliasChange, H as publishUserProfileIdentityChange, S as userProfilesDb, V as publishUserProfileAuthorityChange, h as selectResolvedUserProfileMetadataById } from "./user-profiles-internal-DlO1LBbo.mjs";
import { s as publishUserProfilesChange } from "./user-profile-list-CtETKur7.mjs";
import { r as readGatewayOwnerProfileRows } from "./user-profiles-owner-CC-RfU2U.mjs";
//#region src/state/user-profiles-owner-migration.ts
function ownerRepairRequired(db) {
	if (!tableExists(db, "user_profiles") || !tableExists(db, "user_profile_identities")) return false;
	const { owner, identified } = readGatewayOwnerProfileRows(db);
	return Boolean(owner?.merged_into || identified?.merged_into || owner && identified?.id !== owner.id);
}
function repairMergedGatewayOwnerProfile(options) {
	const unchanged = {
		repaired: false,
		changes: [],
		warnings: []
	};
	if (!withExistingOpenClawStateDatabaseReadOnly(({ db }) => ownerRepairRequired(db), options)) return unchanged;
	if (!options.shouldRepair) return {
		...unchanged,
		warnings: ["The shared gateway owner profile requires repair. Run openclaw doctor --fix, then reconnect."]
	};
	return runOpenClawStateWriteTransaction(({ db }) => {
		if (!ownerRepairRequired(db)) return unchanged;
		const { owner } = readGatewayOwnerProfileRows(db);
		const previousOwnerHead = owner?.merged_into ? selectResolvedUserProfileMetadataById(db, owner.id)?.id : void 0;
		const kysely = userProfilesDb(db);
		const now = Date.now();
		if (owner) {
			executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({
				merged_into: null,
				updated_at: now
			}).where("id", "=", GATEWAY_OWNER_PROFILE_ID));
			if (owner.merged_into) {
				publishUserProfileIdentityChange(db, GATEWAY_OWNER_PROFILE_ID);
				publishUserProfileAuthorityChange(db, GATEWAY_OWNER_PROFILE_ID, owner.merged_into, ...previousOwnerHead ? [previousOwnerHead] : []);
				deferSqlitePostCommitPublication(db, publishUserProfileAliasChange);
			}
		} else executeSqliteQuerySync(db, kysely.insertInto("user_profiles").values({
			id: GATEWAY_OWNER_PROFILE_ID,
			display_name: null,
			avatar: null,
			avatar_mime: null,
			avatar_sha256: null,
			merged_into: null,
			created_at: now,
			updated_at: now
		}));
		executeSqliteQuerySync(db, kysely.insertInto("user_profile_identities").values({
			provider: "gateway.local",
			subject: "owner",
			profile_id: GATEWAY_OWNER_PROFILE_ID,
			canonical_login: null,
			created_at: now
		}).onConflict((conflict) => conflict.columns(["provider", "subject"]).doUpdateSet({ profile_id: GATEWAY_OWNER_PROFILE_ID })));
		publishUserProfilesChange(db, GATEWAY_OWNER_PROFILE_ID);
		return {
			repaired: true,
			changes: ["Restored gateway-owner as the shared owner and repaired its local identity; personal emails, roles, and GitHub identities remain with the person."],
			warnings: []
		};
	}, options, { operationLabel: "user-profiles.repair-merged-owner" });
}
//#endregion
export { repairMergedGatewayOwnerProfile as t };
