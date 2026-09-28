import { n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as GATEWAY_OWNER_PROFILE_ID } from "./user-profile-constants-DfyZS95p.mjs";
import { F as publishUserProfileAliasChange, I as publishUserProfileAuthorityChange, L as publishUserProfileIdentityChange, b as userProfilesDb, h as selectResolvedUserProfileMetadataById } from "./user-profiles-internal-BxQLnWfo.mjs";
import { i as publishUserProfilesChange } from "./user-profile-list-B5pNqyXa.mjs";
import { r as readGatewayOwnerProfileRows } from "./user-profiles-owner-B9hIJDeo.mjs";
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
