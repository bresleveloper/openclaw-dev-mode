import { n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { P as UserChannelIdentitySchema } from "./approval-result-validators-_fnoR1Wq.mjs";
import { F as publishUserProfileAliasChange, P as publishUserChannelIdentityAuthorityChange, S as UserProfileOwnerError, b as userProfilesDb, h as selectResolvedUserProfileMetadataById, u as requireResolvedUserProfileMetadataById, w as ensureUserProfilesSchema } from "./user-profiles-internal-BxQLnWfo.mjs";
import { S as selectStoredGitHubIdentities, i as publishUserProfilesChange } from "./user-profile-list-B5pNqyXa.mjs";
import { g as classifyTailscaleLogin } from "./user-profiles-CRttx6hj.mjs";
import { Check } from "typebox/value";
//#region src/state/user-channel-identities.ts
const CHANNEL_IDENTITY_PROVIDER = "channel.identity";
var UserChannelIdentityConflictError = class extends Error {
	constructor() {
		super("channel identity is linked to another profile; unlink it from that profile first");
		this.name = "UserChannelIdentityConflictError";
	}
};
function userChannelIdentitySubject(identity) {
	if (!Check(UserChannelIdentitySchema, identity)) throw new TypeError("invalid channel identity");
	return JSON.stringify([
		identity.channelId,
		identity.accountId,
		identity.senderId
	]);
}
function selectLink(db, subject) {
	return executeSqliteQueryTakeFirstSync(db, userProfilesDb(db).selectFrom("user_profile_identities").select("profile_id").where("provider", "=", CHANNEL_IDENTITY_PROVIDER).where("subject", "=", subject));
}
function requirePerson(db, profileId) {
	const profile = requireResolvedUserProfileMetadataById(db, profileId);
	if (profileId === "gateway-owner" || profile.id === "gateway-owner") throw new UserProfileOwnerError("merge");
	return profile;
}
function publishIdentityChange(db, profileId, subject) {
	publishUserChannelIdentityAuthorityChange(db, subject);
	publishUserProfilesChange(db, profileId);
	deferSqlitePostCommitPublication(db, publishUserProfileAliasChange);
}
/** An administrator attests the remote account belongs to this existing person. */
function linkUserChannelIdentity(profileId, identity, options = {}) {
	const subject = userChannelIdentitySubject(identity);
	ensureUserProfilesSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const profile = requirePerson(db, profileId);
		const existing = selectLink(db, subject);
		if (existing) {
			if (requirePerson(db, existing.profile_id).id !== profile.id) throw new UserChannelIdentityConflictError();
			return {
				profileId: profile.id,
				identity
			};
		}
		options.beforeChange?.(db);
		executeSqliteQuerySync(db, userProfilesDb(db).insertInto("user_profile_identities").values({
			provider: CHANNEL_IDENTITY_PROVIDER,
			subject,
			profile_id: profile.id,
			canonical_login: null,
			created_at: Date.now()
		}));
		publishIdentityChange(db, profile.id, subject);
		return {
			profileId: profile.id,
			identity
		};
	}, options, { operationLabel: "user-profiles.link-channel-identity" });
}
/** The expected person prevents a stale unlink from deleting another person's binding. */
function unlinkUserChannelIdentity(profileId, identity, options = {}) {
	const subject = userChannelIdentitySubject(identity);
	ensureUserProfilesSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const profile = requirePerson(db, profileId);
		const existing = selectLink(db, subject);
		if (!existing) return false;
		if (requirePerson(db, existing.profile_id).id !== profile.id) throw new UserChannelIdentityConflictError();
		options.beforeChange?.(db);
		executeSqliteQuerySync(db, userProfilesDb(db).deleteFrom("user_profile_identities").where("provider", "=", CHANNEL_IDENTITY_PROVIDER).where("subject", "=", subject));
		publishIdentityChange(db, profile.id, subject);
		return true;
	}, options, { operationLabel: "user-profiles.unlink-channel-identity" });
}
function hasIdentityTables(db) {
	return tableExists(db, "user_profiles") && tableExists(db, "user_profile_identities");
}
/** Reads the current person and login grant subjects; channel links never become login aliases. */
function resolveUserChannelIdentityInDatabase(db, identity) {
	const subject = userChannelIdentitySubject(identity);
	return runSqliteDeferredTransactionSync(db, () => {
		if (!hasIdentityTables(db)) return;
		const link = selectLink(db, subject);
		const profile = link ? selectResolvedUserProfileMetadataById(db, link.profile_id) : void 0;
		if (!profile || profile.id === "gateway-owner") return;
		const kysely = userProfilesDb(db);
		const emails = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_emails").select("email").where("profile_id", "=", profile.id).orderBy("email", "asc")).rows.map(({ email }) => email);
		const loginEmails = emails.filter((email) => {
			const login = classifyTailscaleLogin(email);
			return login.kind !== "provider" || login.provider !== "github";
		});
		const providerLogins = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_identities").select(["provider", "subject"]).where("profile_id", "=", profile.id).where("canonical_login", "is", null)).rows.filter((row) => row.provider !== "github" && row.provider !== "github-attribution" && !row.provider.includes(".")).map((row) => `${row.subject}@${row.provider}`);
		const githubLogins = selectStoredGitHubIdentities(db, [profile.id]).get(profile.id)?.accounts.map((account) => `${account.login.toLowerCase()}@github`) ?? [];
		return {
			profileId: profile.id,
			role: profile.role ?? null,
			emails,
			loginIdentities: [.../* @__PURE__ */ new Set([
				...loginEmails,
				...providerLogins,
				...githubLogins
			])].toSorted()
		};
	});
}
function resolveUserChannelIdentity(identity, options = {}) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => resolveUserChannelIdentityInDatabase(db, identity), options);
}
//#endregion
export { userChannelIdentitySubject as a, unlinkUserChannelIdentity as i, linkUserChannelIdentity as n, resolveUserChannelIdentity as r, UserChannelIdentityConflictError as t };
