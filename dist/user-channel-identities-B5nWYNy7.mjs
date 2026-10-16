import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { l as normalizeSortedUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
import { Jn as string, lr as uuid, or as union, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { r as readConfigMachineStateRowInDatabase } from "./config-machine-state-DR7LQrw2.mjs";
import { i as updateConfigMachineStateInDatabase } from "./config-machine-state-write-pMcF7uIi.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { a as UserChannelIdentitySchema } from "./users-COu0fYQz.mjs";
import { B as publishUserProfileAliasChange, D as ensureUserProfilesSchema, S as userProfilesDb, T as UserProfileOwnerError, V as publishUserProfileAuthorityChange, _ as selectUserProfileEmails, h as selectResolvedUserProfileMetadataById, u as requireResolvedUserProfileMetadataById, z as publishUserChannelIdentityAuthorityChange } from "./user-profiles-internal-DlO1LBbo.mjs";
import { a as generateSecureUuid } from "./secure-random-Dimnnrm0.mjs";
import { O as selectStoredGitHubIdentities, s as publishUserProfilesChange } from "./user-profile-list-CtETKur7.mjs";
import { t as classifyTailscaleLogin } from "./user-profiles-tailscale-login-BtASdRBZ.mjs";
import { isDeepStrictEqual } from "node:util";
import { Check } from "typebox/value";
//#region src/state/user-channel-identities.ts
const CHANNEL_IDENTITY_PROVIDER = "channel.identity";
const POLICY_KEY = "operator.channelPolicy";
const referenceSchema = strictObject({
	version: literal(1),
	id: uuid()
});
const configuredReferenceSchema = referenceSchema.extend({ version: literal(2) });
const configuredPolicySchema = strictObject({
	fingerprint: string().length(43),
	id: uuid()
});
const commandReferenceSchema = union([referenceSchema, configuredReferenceSchema]);
function parseCommandOwnerReference(value) {
	return commandReferenceSchema.safeParse(value).data;
}
function configuredCommandOwnerPolicyFingerprint(owners) {
	const entries = normalizeSortedUniqueStringEntries(owners);
	return entries.length ? sha256Base64Url(JSON.stringify(entries)) : void 0;
}
function splitPolicy(value) {
	const { configuredOwnerPolicy, ...policy } = isRecord(value) ? value : {};
	return {
		policy,
		configured: configuredPolicySchema.safeParse(configuredOwnerPolicy).data
	};
}
function readConfiguredCommandOwnerPolicy(value, fingerprint) {
	const { configured } = splitPolicy(value);
	return configured?.fingerprint === fingerprint ? {
		version: 2,
		id: configured.id
	} : void 0;
}
const grantSchema = strictObject({
	pluginId: string().min(1).max(128),
	grantId: uuid()
}).nullable();
function parseUserChannelAuthorizationReference(value) {
	return referenceSchema.safeParse(value).data;
}
function resolveUserChannelAuthorizationPolicy(gateway) {
	return {
		roles: gateway?.roles ?? null,
		identityScopes: gateway?.auth?.identityScopes ?? null
	};
}
function matchesPolicy(db, policy) {
	const row = readConfigMachineStateRowInDatabase(db, POLICY_KEY);
	return row !== void 0 && isDeepStrictEqual(splitPolicy(JSON.parse(row.value_json)).policy, policy);
}
/** Activation and rollback retire old references before their exact authorization policy is published. */
function publishUserChannelPolicyInDatabase(db, policy, configuredOwnersHash) {
	let profiles = [];
	const channels = [];
	updateConfigMachineStateInDatabase(db, POLICY_KEY, (current) => {
		const previous = splitPolicy(current);
		if (!isDeepStrictEqual(previous.policy, policy) && getAdmittedSqliteSchemaFacts(db)?.tables.has("user_profile_identities")) {
			profiles = executeSqliteQuerySync(db, userProfilesDb(db).selectFrom("user_profile_identities").select("profile_id").distinct().where("provider", "=", CHANNEL_IDENTITY_PROVIDER)).rows.map((row) => row.profile_id);
			publishUserProfileAuthorityChange(db, ...profiles);
		}
		const configured = configuredOwnersHash ? {
			fingerprint: configuredOwnersHash,
			id: previous.configured?.fingerprint === configuredOwnersHash ? previous.configured.id : generateSecureUuid()
		} : void 0;
		if (!isDeepStrictEqual(previous.configured, configured)) {
			channels.push(POLICY_KEY);
			publishUserChannelIdentityAuthorityChange(db, POLICY_KEY);
		}
		return {
			...policy,
			...configured ? { configuredOwnerPolicy: configured } : {}
		};
	}, Date.now());
	return {
		profiles,
		channels
	};
}
/** The reference names this uninterrupted channel link; it carries no permission by itself. */
function authorizeUserChannelIdentityInDatabase(db, input) {
	if ((getAdmittedSqliteSchemaFacts(db)?.userVersion ?? 0) < 19 || !matchesPolicy(db, input.policy)) return;
	const subject = userChannelIdentitySubject(input.identity);
	const row = executeSqliteQueryTakeFirstSync(db, userProfilesDb(db).selectFrom("user_profile_identities").select(["authorization_id", "authorization_basis_json"]).where("provider", "=", CHANNEL_IDENTITY_PROVIDER).where("subject", "=", subject).where("profile_id", "=", input.profileId));
	if (!row) return;
	const basis = JSON.stringify(grantSchema.parse(input.grant));
	const original = referenceSchema.safeParse({
		version: 1,
		id: row.authorization_id
	}).data;
	if (row.authorization_basis_json === basis && original) return original;
	const id = generateSecureUuid();
	executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profile_identities").set({
		authorization_id: id,
		authorization_basis_json: basis
	}).where("provider", "=", CHANNEL_IDENTITY_PROVIDER).where("subject", "=", subject));
	return {
		version: 1,
		id
	};
}
function readAuthorization(db, id, policy) {
	if ((getAdmittedSqliteSchemaFacts(db)?.userVersion ?? 0) < 19 || !matchesPolicy(db, policy)) return;
	const row = executeSqliteQueryTakeFirstSync(db, userProfilesDb(db).selectFrom("user_profile_identities").select(["subject", "authorization_basis_json"]).where("provider", "=", CHANNEL_IDENTITY_PROVIDER).where("authorization_id", "=", id));
	if (!row?.authorization_basis_json || row.authorization_basis_json.length > 1024) return;
	const grant = grantSchema.safeParse(safeParseJson(row.authorization_basis_json));
	return grant.success ? {
		subject: row.subject,
		reference: {
			version: 1,
			id
		},
		grant: grant.data
	} : void 0;
}
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
	const tables = getAdmittedSqliteSchemaFacts(db)?.tables;
	return tables?.has("user_profiles") === true && tables.has("user_profile_identities");
}
/** Reads the current person and login grant subjects; channel links never become login aliases. */
function resolveUserChannelIdentityInDatabase(db, identity) {
	return runSqliteDeferredTransactionSync(db, () => {
		if (!hasIdentityTables(db)) return;
		let authorization;
		let subject;
		if ("authorizationId" in identity) {
			authorization = readAuthorization(db, identity.authorizationId, identity.policy);
			if (!authorization) return;
			subject = authorization.subject;
		} else subject = userChannelIdentitySubject(identity);
		const link = selectLink(db, subject);
		const profile = link ? selectResolvedUserProfileMetadataById(db, link.profile_id) : void 0;
		if (!profile || profile.id === "gateway-owner") return;
		const kysely = userProfilesDb(db);
		const emails = selectUserProfileEmails(db, profile.id);
		const loginEmails = emails.filter((email) => {
			const login = classifyTailscaleLogin(email);
			return login.kind !== "provider" || login.provider !== "github";
		});
		const providerLogins = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_identities").select(["provider", "subject"]).where("profile_id", "=", profile.id).where("canonical_login", "is", null)).rows.filter((row) => row.provider !== "github" && row.provider !== "github-attribution" && !row.provider.includes(".")).map((row) => `${row.subject}@${row.provider}`);
		const githubIdentity = selectStoredGitHubIdentities(db, [profile.id]).get(profile.id);
		const githubAccounts = githubIdentity?.accounts;
		const githubLogins = githubAccounts?.map((account) => `${account.login.toLowerCase()}@github`) ?? [];
		return {
			...authorization ? { authorization } : {},
			profileId: profile.id,
			displayName: profile.display_name,
			role: profile.role ?? null,
			emails,
			...githubAccounts?.length ? { githubAccountIds: githubAccounts.map(({ accountId }) => accountId) } : {},
			...githubIdentity?.primary ? { githubLogin: githubIdentity.primary.login } : {},
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
export { linkUserChannelIdentity as a, publishUserChannelPolicyInDatabase as c, resolveUserChannelIdentity as d, unlinkUserChannelIdentity as f, configuredCommandOwnerPolicyFingerprint as i, readConfiguredCommandOwnerPolicy as l, UserChannelIdentityConflictError as n, parseCommandOwnerReference as o, userChannelIdentitySubject as p, authorizeUserChannelIdentityInDatabase as r, parseUserChannelAuthorizationReference as s, CHANNEL_IDENTITY_PROVIDER as t, resolveUserChannelAuthorizationPolicy as u };
