import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as tableExists, o as tableHasColumn } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as GIT_COAUTHOR_PREFERENCE_KEY, t as GATEWAY_OWNER_PROFILE_ID } from "./user-profile-constants-DfyZS95p.mjs";
import { i as openOpenClawStateDatabase } from "./openclaw-state-db-BtDOU_3j.mjs";
import { d as publishUserProfileAuthorityChange, n as captureUserProfileAuthorityRead } from "./user-profile-events-CXjmX5Qy.mjs";
import { t as normalizeGitHubLogin } from "./github-login-COsXH2kL.mjs";
import { t as deleteUserPreference } from "./user-preferences.store-BkUaBz4r.mjs";
import { D as ensureUserProfilesSchema, S as userProfilesDb, T as UserProfileOwnerError, c as projectUserProfileDisplay, d as resolveCatalogProfile, f as selectProfileDisplayEntries, g as selectUserProfileEmailAlias, h as selectResolvedUserProfileMetadataById, o as matchUserProfileReference, p as selectResolvedUserProfile, v as setUserProfileEmailBinding, x as userProfileDisplaySelection, y as toUserProfile } from "./user-profiles-internal-CBUpoSHj.mjs";
import path from "node:path";
import { toUSVString } from "node:util";
//#region src/state/user-profile-github-identity.ts
const GITHUB_PROVIDER = "github";
const GITHUB_LOGIN_SUBJECT_PREFIX = "login:";
function selectStoredGitHubIdentities(db, profileIds, accountIds) {
	if (profileIds?.length === 0 || accountIds?.length === 0) return /* @__PURE__ */ new Map();
	if (!tableHasColumn(db, "user_profile_identities", "canonical_login")) return /* @__PURE__ */ new Map();
	let query = userProfilesDb(db).selectFrom("user_profile_identities").innerJoin("user_profiles", "user_profiles.id", "user_profile_identities.profile_id").select([
		"profile_id",
		"subject",
		"canonical_login"
	]).select((eb) => [tableHasColumn(db, "user_profiles", "primary_github_account_id") ? "user_profiles.primary_github_account_id" : eb.val(null).as("primary_github_account_id")]).where("provider", "=", GITHUB_PROVIDER).where("canonical_login", "is not", null).orderBy("subject", "asc");
	if (profileIds) query = query.where("profile_id", "in", [...profileIds]);
	if (accountIds) query = query.where("subject", "in", accountIds.map(String)).where("user_profiles.merged_into", "is", null);
	return projectStoredGitHubIdentities(executeSqliteQuerySync(db, query).rows);
}
function projectStoredGitHubIdentities(rows) {
	const profiles = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const accountId = Number(row.subject);
		const login = row.canonical_login ? normalizeGitHubLogin(row.canonical_login) : void 0;
		if (!login || !Number.isSafeInteger(accountId) || accountId <= 0) continue;
		const profile = profiles.get(row.profile_id) ?? {
			accounts: [],
			primaryId: row.primary_github_account_id ?? null
		};
		profile.accounts.push({
			accountId,
			login
		});
		profiles.set(row.profile_id, profile);
	}
	return new Map([...profiles].map(([id, { accounts, primaryId }]) => [id, {
		accounts,
		primary: primaryId === null && accounts.length === 1 ? accounts[0] : accounts.find((account) => account.accountId === primaryId)
	}]));
}
/** One statement keeps canonical ownership, role, and verified login in the same snapshot. */
function selectUserProfileRoleAuthority(db, profileId) {
	if (!tableExists(db, "user_profiles")) return;
	const hasRole = getAdmittedSqliteSchemaFacts(db) && tableHasColumn(db, "user_profiles", "role");
	const query = userProfilesDb(db).selectFrom("user_profiles as requested").leftJoin("user_profiles as canonical", (join) => join.onRef("canonical.id", "=", "requested.merged_into").on("requested.merged_into", "!=", "")).innerJoin("user_profiles as profile", (join) => join.on((eb) => eb("profile.id", "=", eb.fn.coalesce("canonical.id", "requested.id")))).where("requested.id", "=", profileId).select("profile.id as profile_id").select((eb) => [hasRole ? "profile.role" : eb.val(null).as("role"), tableHasColumn(db, "user_profiles", "primary_github_account_id") ? "profile.primary_github_account_id" : eb.val(null).as("primary_github_account_id")]);
	const rows = executeSqliteQuerySync(db, tableHasColumn(db, "user_profile_identities", "canonical_login") ? query.leftJoin("user_profile_identities as identity", (join) => join.onRef("identity.profile_id", "=", "profile.id").on("identity.provider", "=", GITHUB_PROVIDER).on("identity.canonical_login", "is not", null)).select(["identity.subject", "identity.canonical_login"]).orderBy("identity.subject", "asc") : query.select((eb) => [eb.val(null).as("subject"), eb.val(null).as("canonical_login")])).rows;
	const profile = rows[0];
	return profile ? {
		profileId: profile.profile_id,
		role: profile.role ?? null,
		githubLogin: projectStoredGitHubIdentities(rows).get(profile.profile_id)?.primary?.login ?? null
	} : void 0;
}
function selectProfileAccessEntries(db, profileIds) {
	const rows = selectProfileDisplayEntries(db, profileIds);
	if (rows.length === 0) return rows;
	const identities = selectStoredGitHubIdentities(db, profileIds);
	return rows.map(([id, row]) => {
		const identity = identities.get(id);
		const accounts = identity?.accounts;
		return [id, accounts?.length ? {
			...row,
			githubAccountIds: accounts.map(({ accountId }) => accountId),
			githubLogin: identity?.primary?.login ?? null
		} : row];
	});
}
function githubAuthenticationSubject(login) {
	const normalized = login.trim().toLowerCase();
	if (!normalized) throw new TypeError("GitHub login is invalid");
	return `${GITHUB_LOGIN_SUBJECT_PREFIX}${normalized}`;
}
function selectUserProfileGitHubIdentities(db, profileIds) {
	const identities = /* @__PURE__ */ new Map();
	for (const [profileId, { primary }] of selectStoredGitHubIdentities(db, profileIds)) if (primary) identities.set(profileId, {
		login: primary.login,
		profileUrl: `https://github.com/${primary.login}`,
		avatarUrl: `https://avatars.githubusercontent.com/u/${primary.accountId}?v=4`
	});
	return identities;
}
/** Resolves current verified identities and public-credit preferences without initializing storage. */
async function resolveUserProfileGitHubAttribution(profileIds, options = {}) {
	if (profileIds.length === 0) return /* @__PURE__ */ new Map();
	return (await prepareUserProfileGitHubAttribution(profileIds, options)).identities;
}
const preparedGitHubAttributions = /* @__PURE__ */ new Map();
/** Bind public credit to its live profile owner before any later publication awaits. */
async function prepareUserProfileGitHubAttribution(profileIds, options = {}) {
	const selectedProfileIds = [...profileIds];
	const context = captureOpenClawStateWorkerContext(options);
	const key = JSON.stringify([context.admission.identity.key, selectedProfileIds]);
	const cached = preparedGitHubAttributions.get(key);
	if (cached?.isCurrent()) return {
		identities: structuredClone(cached.identities),
		isCurrent: cached.isCurrent
	};
	preparedGitHubAttributions.delete(key);
	for (let attempt = 0; attempt < 3; attempt += 1) {
		const authority = await captureUserProfileAuthorityRead(context.admission);
		const reply = await executeExistingOpenClawStateRead({
			path: context.admission.databasePath,
			env: context.environment
		}, {
			type: "userProfiles.githubAttribution.resolve",
			profileIds: selectedProfileIds
		}, {
			context,
			current: true
		});
		context.admission.assertCurrent();
		const isCurrent = authority.bind([...selectedProfileIds, ...reply?.canonicalProfileIds ?? []]);
		if (isCurrent) {
			const identities = reply?.identities ?? /* @__PURE__ */ new Map();
			if (selectedProfileIds.every((profileId) => identities.has(profileId))) {
				preparedGitHubAttributions.set(key, {
					identities: structuredClone(identities),
					isCurrent
				});
				while (preparedGitHubAttributions.size > 64) preparedGitHubAttributions.delete(preparedGitHubAttributions.keys().next().value);
			}
			return {
				identities,
				isCurrent
			};
		}
	}
	throw new Error("Git co-author credit changed while preparing attribution");
}
/** Retain every account; the merge target owns primary choice and its coauthor consent. */
function prepareUserProfileGitHubMerge(db, sourceProfileIds, targetProfileId) {
	const identities = selectStoredGitHubIdentities(db, [targetProfileId, ...sourceProfileIds]);
	const targetAccounts = identities.get(targetProfileId);
	const targetIdentity = targetAccounts?.primary;
	const survivingSourceProfileId = targetAccounts ? void 0 : sourceProfileIds.find((profileId) => identities.get(profileId)?.primary);
	const survivingAccountId = targetIdentity?.accountId ?? (survivingSourceProfileId ? identities.get(survivingSourceProfileId)?.primary?.accountId : void 0);
	for (const sourceProfileId of sourceProfileIds) {
		const sourceIdentity = identities.get(sourceProfileId)?.primary;
		if (!sourceIdentity || sourceIdentity.accountId !== survivingAccountId) deleteUserPreference(db, sourceProfileId, GIT_COAUTHOR_PREFERENCE_KEY);
	}
	executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({ primary_github_account_id: survivingAccountId ?? null }).where("id", "=", targetProfileId));
}
function selectGitHubProfileAlias(db, alias) {
	return alias.kind === "email" ? selectUserProfileEmailAlias(db, alias.email) : executeSqliteQueryTakeFirstSync(db, userProfilesDb(db).selectFrom("user_profile_identities").select("profile_id").where("provider", "=", GITHUB_PROVIDER).where("subject", "=", alias.subject).where("canonical_login", "is", null));
}
function readGitHubIdentityBinding(db, alias, accountId) {
	const kysely = userProfilesDb(db);
	const subject = String(accountId);
	const existing = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_identities").leftJoin("user_profiles", "user_profiles.id", "user_profile_identities.profile_id").select([
		"profile_id",
		"canonical_login",
		"primary_github_account_id"
	]).where("provider", "=", GITHUB_PROVIDER).where("subject", "=", subject).where("canonical_login", "is not", null));
	const aliasIdentity = selectGitHubProfileAlias(db, alias);
	const aliasProfileId = aliasIdentity ? selectResolvedUserProfileMetadataById(db, aliasIdentity.profile_id)?.id : void 0;
	return {
		existing,
		aliasIdentity,
		aliasProfileId,
		aliasGitHubIdentity: aliasProfileId ? selectStoredGitHubIdentities(db, [aliasProfileId]).get(aliasProfileId) : void 0,
		existingProfileId: existing ? selectResolvedUserProfileMetadataById(db, existing.profile_id)?.id : void 0
	};
}
function assertCompatibleGitHubEmailBinding(binding, accountId) {
	const { existingProfileId, aliasProfileId, aliasGitHubIdentity } = binding;
	if ([
		binding.aliasIdentity?.profile_id,
		binding.existing?.profile_id,
		aliasProfileId,
		existingProfileId
	].includes("gateway-owner")) throw new UserProfileOwnerError("merge");
	if (existingProfileId && existingProfileId !== aliasProfileId || aliasGitHubIdentity && !aliasGitHubIdentity.accounts.some((account) => account.accountId === accountId)) throw new Error("GitHub identity requires explicit linking to this email; ask an administrator to use users.linkEmail");
}
/** The email owner checks the same conflicts even when optional GitHub metadata is unavailable. */
function assertGitHubEmailIdentityBinding(db, email, accountId) {
	if (!Number.isSafeInteger(accountId) || accountId <= 0) throw new TypeError("GitHub account id must be a positive safe integer");
	assertCompatibleGitHubEmailBinding(readGitHubIdentityBinding(db, {
		kind: "email",
		email
	}, accountId), accountId);
}
function applyVerifiedGitHubIdentity(params) {
	if (!Number.isSafeInteger(params.identity.accountId) || params.identity.accountId <= 0) throw new TypeError("GitHub account id must be a positive safe integer");
	const login = normalizeGitHubLogin(params.identity.login);
	if (!login) throw new TypeError("GitHub login is invalid");
	const db = params.db;
	const kysely = userProfilesDb(db);
	const subject = String(params.identity.accountId);
	const now = Date.now();
	const bindingFacts = readGitHubIdentityBinding(db, params.alias, params.identity.accountId);
	const { existing, aliasIdentity, aliasProfileId, aliasGitHubIdentity, existingProfileId } = bindingFacts;
	if (params.preserveEmailProfile) assertCompatibleGitHubEmailBinding(bindingFacts, params.identity.accountId);
	const currentProfileId = (aliasProfileId && (aliasGitHubIdentity === void 0 || aliasGitHubIdentity.accounts.some((account) => account.accountId === params.identity.accountId)) ? aliasProfileId : void 0) ?? existingProfileId ?? params.createProfile();
	const targetProfileId = existingProfileId ?? currentProfileId;
	if (aliasIdentity?.profile_id === "gateway-owner" || existing?.profile_id === "gateway-owner" || currentProfileId === "gateway-owner" || targetProfileId === "gateway-owner") throw new UserProfileOwnerError("merge");
	const affectedProfileIds = [
		currentProfileId,
		targetProfileId,
		...aliasIdentity ? [aliasIdentity.profile_id] : [],
		...aliasProfileId ? [aliasProfileId] : [],
		...existing ? [existing.profile_id] : []
	];
	params.mutation?.before(db, ...affectedProfileIds);
	const currentIdentity = currentProfileId === aliasProfileId ? aliasGitHubIdentity : selectStoredGitHubIdentities(db, [currentProfileId]).get(currentProfileId);
	if (!params.preserveEmailProfile && targetProfileId === currentProfileId && !currentIdentity?.accounts.some((account) => account.accountId === params.identity.accountId)) deleteUserPreference(db, targetProfileId, GIT_COAUTHOR_PREFERENCE_KEY);
	if (currentProfileId !== targetProfileId) params.mergeProfiles(currentProfileId, targetProfileId);
	const targetAccounts = currentProfileId === targetProfileId ? currentIdentity : selectStoredGitHubIdentities(db, [targetProfileId]).get(targetProfileId);
	const primaryAccountId = !targetAccounts || targetAccounts.primary ? targetAccounts?.primary?.accountId ?? params.identity.accountId : void 0;
	const authorityChanged = currentProfileId !== targetProfileId || existing?.profile_id !== targetProfileId || existing.canonical_login !== login || aliasIdentity?.profile_id !== targetProfileId;
	if (!authorityChanged && (primaryAccountId === void 0 || existing.primary_github_account_id === primaryAccountId)) return {
		profileId: targetProfileId,
		changed: false
	};
	if (primaryAccountId !== void 0) executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ primary_github_account_id: primaryAccountId }).where("id", "=", targetProfileId));
	const writeIdentity = (identitySubject, canonicalLogin) => {
		const binding = {
			profile_id: targetProfileId,
			canonical_login: canonicalLogin
		};
		executeSqliteQuerySync(db, kysely.insertInto("user_profile_identities").values({
			provider: GITHUB_PROVIDER,
			subject: identitySubject,
			...binding,
			created_at: now
		}).onConflict((conflict) => conflict.columns(["provider", "subject"]).doUpdateSet(binding)));
	};
	writeIdentity(subject, login);
	if (params.alias.kind === "email") setUserProfileEmailBinding(db, params.alias.email, targetProfileId, now);
	else writeIdentity(params.alias.subject, null);
	if (authorityChanged) {
		params.mutation?.authority(...affectedProfileIds);
		publishUserProfileAuthorityChange(db, ...affectedProfileIds);
	}
	return {
		profileId: targetProfileId,
		changed: true
	};
}
//#endregion
//#region src/state/user-profile-identity.read.ts
const profileCatalogPath = (options) => path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
/** Worker hydration retains unknown legacy bindings without inventing their lifetime. */
function readUserProfileEmailBindings(db, profileIds) {
	if (Array.isArray(profileIds) && profileIds.length === 0 || !tableExists(db, "user_profile_emails")) return [];
	const query = userProfilesDb(db).selectFrom("user_profile_emails").select(["email", "profile_id"]).select((eb) => [tableHasColumn(db, "user_profile_emails", "binding_id") ? "binding_id" : eb.val(null).as("binding_id")]).orderBy("email", "asc");
	return executeSqliteQuerySync(db, profileIds === void 0 ? query : typeof profileIds === "string" ? query.where("profile_id", "=", profileIds) : query.where("profile_id", "in", [...profileIds])).rows.map(({ email, profile_id, binding_id }) => ({
		email,
		profileId: profile_id,
		bindingId: binding_id
	}));
}
function readUserProfileSnapshotSync(options = {}, githubAccountIds) {
	ensureUserProfilesSchema(options);
	const database = openOpenClawStateDatabase(options);
	return runSqliteDeferredTransactionSync(database.db, () => {
		const kysely = userProfilesDb(database.db);
		const profiles = executeSqliteQuerySync(database.db, kysely.selectFrom("user_profiles").select([
			...userProfileDisplaySelection,
			"created_at",
			...tableHasColumn(database.db, "user_profiles", "role") ? ["role"] : []
		]).orderBy("created_at", "asc").orderBy("id", "asc")).rows;
		const emails = executeSqliteQuerySync(database.db, kysely.selectFrom("user_profile_emails").select(["profile_id", "email"]).orderBy("email", "asc")).rows;
		const githubIdentities = selectUserProfileGitHubIdentities(database.db);
		const emailsByProfile = new Map(profiles.map(({ id }) => [id, []]));
		for (const { profile_id, email } of emails) emailsByProfile.get(profile_id)?.push(email);
		return {
			profiles: profiles.map((profile) => Object.assign(toUserProfile(profile), {
				emails: emailsByProfile.get(profile.id) ?? [],
				githubIdentity: githubIdentities.get(profile.id) ?? null,
				hasAvatar: profile.has_avatar === 1
			})),
			...githubAccountIds ? { githubProfiles: [...selectStoredGitHubIdentities(database.db, void 0, githubAccountIds)].flatMap(([profileId, { accounts }]) => accounts.map(({ accountId }) => ({
				accountId,
				profileId
			}))) } : {}
		};
	}, {
		databaseLabel: database.path,
		operationLabel: "user-profiles.list"
	});
}
/** In-memory counterpart of the bounded SQL selector for the Gateway catalog. */
function projectHasMultipleSessionSharingIdentities(rows) {
	let people = 0;
	for (const row of rows.values()) if (!row.merged_into && row.id !== "gateway-owner" && ++people === 2) return true;
	return false;
}
/** True when session-sharing policy can distinguish at least two durable people. */
function selectHasMultipleSessionSharingIdentities(db) {
	return executeSqliteQuerySync(db, userProfilesDb(db).selectFrom("user_profiles").select("id").where("merged_into", "is", null).where("id", "!=", GATEWAY_OWNER_PROFILE_ID).limit(2)).rows.length >= 2;
}
/** Exact canonical identity and aliases selected on the caller's admitted connection. */
function selectUserProfileIdentityInDatabase(db, profileId) {
	const profile = selectResolvedUserProfileMetadataById(db, profileId);
	return profile && {
		profileId: profile.id,
		role: profile.role ?? null,
		aliases: new Set(executeSqliteQuerySync(db, userProfilesDb(db).selectFrom("user_profiles").select("id").where((eb) => eb.or([eb("id", "=", profile.id), eb("merged_into", "=", profile.id)]))).rows.map((row) => row.id))
	};
}
/** Read display rows and their one-hop aliases without creating profile storage. */
function selectUserProfileDisplaysInDatabase(db, ids) {
	const profiles = userProfilesDb(db).selectFrom("user_profiles");
	const rows = executeSqliteQuerySync(db, profiles.select(userProfileDisplaySelection).where((eb) => eb.or([eb("id", "in", [...ids]), eb("id", "in", profiles.select("merged_into").where("id", "in", [...ids]).where("merged_into", "!=", ""))]))).rows;
	if (rows.some((row) => typeof row.id !== "string" || row.merged_into !== null && typeof row.merged_into !== "string")) {
		const displays = /* @__PURE__ */ new Map();
		for (const id of ids) displays.set(id, selectResolvedUserProfile(db, id, profiles.select(userProfileDisplaySelection)));
		return displays;
	}
	const byId = new Map(rows.map((row) => [row.id, row]));
	return new Map(ids.map((id) => {
		const raw = byId.get(toUSVString(id));
		return [id, raw?.merged_into ? byId.get(raw.merged_into) ?? raw : raw];
	}));
}
/** Project a bounded display cohort from the resident Gateway catalog. */
function projectUserProfileDisplays(ids, resolve) {
	return new Map(ids.flatMap((id) => {
		const profile = resolve(id);
		return profile ? [[id, projectUserProfileDisplay(profile)]] : [];
	}));
}
/** Resolve display navigation against the resident Gateway catalog. */
function resolveUserProfileReferenceInCatalog(rows, reference, allowedProfileIds) {
	const allowed = (row) => !allowedProfileIds || allowedProfileIds.has(row.merged_into ?? row.id);
	const raw = rows.get(reference);
	return matchUserProfileReference(reference, raw && allowed(raw) ? resolveCatalogProfile(rows, reference)?.id : void 0, (prefix) => [...rows.values()].filter((row) => allowed(row) && row.id.toLowerCase().startsWith(prefix)).map((row) => row.merged_into ?? row.id));
}
//#endregion
export { selectStoredGitHubIdentities as _, readUserProfileSnapshotSync as a, selectUserProfileDisplaysInDatabase as c, assertGitHubEmailIdentityBinding as d, githubAuthenticationSubject as f, selectProfileAccessEntries as g, resolveUserProfileGitHubAttribution as h, readUserProfileEmailBindings as i, selectUserProfileIdentityInDatabase as l, prepareUserProfileGitHubMerge as m, projectHasMultipleSessionSharingIdentities as n, resolveUserProfileReferenceInCatalog as o, prepareUserProfileGitHubAttribution as p, projectUserProfileDisplays as r, selectHasMultipleSessionSharingIdentities as s, profileCatalogPath as t, applyVerifiedGitHubIdentity as u, selectUserProfileGitHubIdentities as v, selectUserProfileRoleAuthority as y };
