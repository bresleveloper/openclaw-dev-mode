import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { a as tableHasColumn, i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { i as stageSqliteTransactionState, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { u as parseSqliteTableDefinition } from "./sqlite-schema-contract-BTxZz0OV.mjs";
import { v as registerOpenClawStateDatabaseLifecycleListener, y as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as normalizeGitHubLogin } from "./github-login-COsXH2kL.mjs";
import { n as GIT_COAUTHOR_PREFERENCE_KEY, t as GATEWAY_OWNER_PROFILE_ID } from "./user-profile-constants-DfyZS95p.mjs";
import { D as ensureUserProfilesSchema, F as emitUserProfilesChanged, G as readUserProfileEmailBindingRevision, K as readUserProfileVersion, L as onUserProfileEmailBindingChanged, N as captureUserProfileAuthorityRead, O as hasEnsuredUserProfileRoleSchema, S as userProfilesDb, T as UserProfileOwnerError, V as publishUserProfileAuthorityChange, c as projectUserProfileDisplay, d as resolveCatalogProfile, f as selectProfileDisplayEntries, g as selectUserProfileEmailAlias, h as selectResolvedUserProfileMetadataById, n as bindPreparedUserProfileIdentity, o as matchUserProfileReference, p as selectResolvedUserProfile, s as projectCatalogUserProfileIdentity, t as applyUserProfileEmailBinding, v as setUserProfileEmailBinding, w as UserProfileNotFoundError, x as userProfileDisplaySelection, y as toUserProfile } from "./user-profiles-internal-DlO1LBbo.mjs";
import { t as deleteUserPreference } from "./user-preferences.store-B-q7i2eZ.mjs";
import path from "node:path";
import { isDeepStrictEqual, toUSVString } from "node:util";
//#region src/state/user-profile-github-identity.ts
const GITHUB_PROVIDER = "github";
const GITHUB_LOGIN_SUBJECT_PREFIX = "login:";
const githubColumnFacts = /* @__PURE__ */ new WeakMap();
function readGitHubColumns(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (!schema) return {
		primaryAccount: tableHasColumn(db, "user_profiles", "primary_github_account_id"),
		verifiedLogin: tableHasColumn(db, "user_profile_identities", "canonical_login")
	};
	let columns = githubColumnFacts.get(schema);
	if (!columns) {
		const hasColumn = (table, column) => {
			const sql = schema.tableSql.get(table);
			return sql !== void 0 && parseSqliteTableDefinition(sql, table).columns.has(column);
		};
		columns = {
			primaryAccount: hasColumn("user_profiles", "primary_github_account_id"),
			verifiedLogin: hasColumn("user_profile_identities", "canonical_login")
		};
		githubColumnFacts.set(schema, columns);
	}
	return columns;
}
function parseStoredGitHubIdentity(row) {
	const accountId = Number(row.subject);
	const login = row.canonical_login ? normalizeGitHubLogin(row.canonical_login) : void 0;
	return login && Number.isSafeInteger(accountId) && accountId > 0 ? {
		accountId,
		login
	} : null;
}
function toPublicGitHubIdentity(identity) {
	return {
		login: identity.login,
		profileUrl: `https://github.com/${identity.login}`,
		avatarUrl: `https://avatars.githubusercontent.com/u/${identity.accountId}?v=4`
	};
}
function selectStoredGitHubIdentities(db, profileIds, accountIds) {
	if (profileIds?.length === 0 || accountIds?.length === 0) return /* @__PURE__ */ new Map();
	const columns = readGitHubColumns(db);
	if (!columns.verifiedLogin) return /* @__PURE__ */ new Map();
	let query = userProfilesDb(db).selectFrom("user_profile_identities").innerJoin("user_profiles", "user_profiles.id", "user_profile_identities.profile_id").select([
		"profile_id",
		"subject",
		"canonical_login"
	]).select((eb) => [columns.primaryAccount ? "user_profiles.primary_github_account_id" : eb.val(null).as("primary_github_account_id")]).where("provider", "=", GITHUB_PROVIDER).where("canonical_login", "is not", null).orderBy("subject", "asc");
	if (profileIds) query = query.where("profile_id", "in", [...profileIds]);
	if (accountIds) query = query.where("subject", "in", accountIds.map(String)).where("user_profiles.merged_into", "is", null);
	const rows = executeSqliteQuerySync(db, query).rows;
	const profiles = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const identity = parseStoredGitHubIdentity(row);
		if (!identity) continue;
		const profile = profiles.get(row.profile_id) ?? {
			accounts: [],
			primaryId: row.primary_github_account_id ?? null
		};
		profile.accounts.push(identity);
		profiles.set(row.profile_id, profile);
	}
	return new Map([...profiles].map(([id, { accounts, primaryId }]) => [id, {
		accounts,
		primary: primaryId === null && accounts.length === 1 ? accounts[0] : accounts.find((account) => account.accountId === primaryId)
	}]));
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
	return new Map([...selectStoredGitHubIdentities(db, profileIds)].flatMap(([profileId, { primary }]) => primary ? [[profileId, toPublicGitHubIdentity(primary)]] : []));
}
/** Resolves current verified identities and public-credit preferences without initializing storage. */
async function resolveUserProfileGitHubAttribution(profileIds, options = {}) {
	if (profileIds.length === 0) return /* @__PURE__ */ new Map();
	const reply = await executeExistingOpenClawStateRead(options, {
		type: "userProfiles.githubAttribution.resolve",
		profileIds
	}, { current: true });
	if (!reply) return /* @__PURE__ */ new Map();
	if (!reply.ok || reply.type !== "userProfiles.githubAttribution.resolve") throw new Error("GitHub attribution reader returned an unexpected result");
	return reply.identities;
}
/** Bind public credit to its live profile owner before any later publication awaits. */
async function prepareUserProfileGitHubAttribution(profileIds, options = {}) {
	const selectedProfileIds = [...profileIds];
	const context = captureOpenClawStateWorkerContext(options);
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
		if (reply && (!reply.ok || reply.type !== "userProfiles.githubAttribution.resolve")) throw new Error("GitHub attribution reader returned an unexpected result");
		const isCurrent = authority.bind([...selectedProfileIds, ...reply?.canonicalProfileIds ?? []]);
		if (isCurrent) return {
			identities: reply?.identities ?? /* @__PURE__ */ new Map(),
			isCurrent
		};
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
function readGitHubIdentityBinding(db, alias, accountId) {
	const kysely = userProfilesDb(db);
	const subject = String(accountId);
	const existing = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_identities").leftJoin("user_profiles", "user_profiles.id", "user_profile_identities.profile_id").select([
		"profile_id",
		"canonical_login",
		"primary_github_account_id"
	]).where("provider", "=", GITHUB_PROVIDER).where("subject", "=", subject).where("canonical_login", "is not", null));
	const aliasIdentity = alias.kind === "email" ? selectUserProfileEmailAlias(db, alias.email) : executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_identities").select("profile_id").where("provider", "=", GITHUB_PROVIDER).where("subject", "=", alias.subject).where("canonical_login", "is", null));
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
function listUserProfilesSync(options = {}) {
	return readUserProfileSnapshotSync(options).profiles;
}
function readUserProfileSnapshotSync(options = {}, githubAccountIds) {
	ensureUserProfilesSchema(options);
	const database = openOpenClawStateDatabase(options);
	return runSqliteDeferredTransactionSync(database.db, () => {
		const kysely = userProfilesDb(database.db);
		const profiles = executeSqliteQuerySync(database.db, kysely.selectFrom("user_profiles").select([
			...userProfileDisplaySelection,
			"created_at",
			...hasEnsuredUserProfileRoleSchema(database.db) || tableHasColumn(database.db, "user_profiles", "role") ? ["role"] : []
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
/** Disclosure scopes need current aliases, never the resident display catalog. */
function readCurrentUserProfileAliases(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const database = openOpenClawStateDatabase(options);
	return runSqliteDeferredTransactionSync(database.db, () => {
		const canonicalId = selectResolvedUserProfileMetadataById(database.db, profileId)?.id ?? profileId;
		const aliases = executeSqliteQuerySync(database.db, userProfilesDb(database.db).selectFrom("user_profiles").select("id").where("merged_into", "=", canonicalId)).rows;
		return /* @__PURE__ */ new Set([canonicalId, ...aliases.map((row) => row.id)]);
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
	if (rows.some((row) => typeof row.id !== "string" || row.merged_into !== null && typeof row.merged_into !== "string")) return new Map(ids.map((id) => [id, selectResolvedUserProfile(db, id, profiles.select(userProfileDisplaySelection))]));
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
/** Resolve display navigation against the caller's admitted database and visible profile IDs. */
function selectUserProfileReferenceInDatabase(db, reference, allowedProfileIds) {
	let profiles = userProfilesDb(db).selectFrom("user_profiles");
	if (allowedProfileIds) profiles = profiles.where((eb) => eb(eb.fn.coalesce("merged_into", "id"), "in", [...allowedProfileIds]));
	return matchUserProfileReference(reference, selectResolvedUserProfile(db, reference, profiles.select(["id", "merged_into"]))?.id, (prefix) => executeSqliteQuerySync(db, profiles.select((eb) => eb.fn.coalesce("merged_into", "id").as("id")).where("id", "like", `${prefix}%`).distinct().limit(2)).rows.map((row) => row.id));
}
//#endregion
//#region src/state/user-profile-list.ts
const hasMultipleSessionSharingIdentities = (options = {}) => readProfileCatalog(options, projectHasMultipleSessionSharingIdentities, selectHasMultipleSessionSharingIdentities) ?? false;
/** Exact durable identity facts; never use display-reference prefix matching for authority. */
function readUserProfileIdentity(profileId, options = {}) {
	return readProfileCatalog(options, (resident) => projectCatalogUserProfileIdentity(resident, profileId), (db) => selectUserProfileIdentityInDatabase(db, profileId));
}
/** Existing one-hop aliases are identity facts; this read never creates profile storage. */
const readUserProfileAliases = (profileId, options = {}) => /* @__PURE__ */ new Set([profileId, ...readUserProfileIdentity(profileId, options)?.aliases ?? []]);
/** Gateway readers already retain this catalog with their session projection. */
function readResidentUserProfileId(profileId, options = {}) {
	const catalog = profileCatalogs.get(profileCatalogPath(options));
	if (!catalog?.valid) throw new Error("User profile catalog is not ready");
	return resolveCatalogProfile(catalog.rows, profileId)?.id;
}
function captureResidentUserProfileAccess(profileId, options = {}) {
	const pathname = profileCatalogPath(options);
	const catalog = profileCatalogs.get(pathname);
	const bindings = catalog && profileBindings.get(catalog.rows);
	if (!catalog?.valid || !bindings || !catalog.assertCurrent) throw new Error("User profile catalog is not ready");
	const { rows, assertCurrent: guard } = catalog;
	const assertCurrent = () => {
		if (profileCatalogs.get(pathname) !== catalog || catalog.rows !== rows) throw new UserProfileNotFoundError(profileId);
		guard(profileId);
		const profile = resolveCatalogProfile(rows, profileId);
		if (!profile) throw new UserProfileNotFoundError(profileId);
		guard(profile.id);
		return profile;
	};
	assertCurrent();
	return {
		assertCurrent,
		readCurrentFacts() {
			const profile = assertCurrent();
			return {
				profileId: profile.id,
				emails: [...bindings.emailsByProfile.get(profile.id) ?? []].toSorted(),
				...profile.githubAccountIds ? { githubAccountIds: [...profile.githubAccountIds] } : {},
				assignedRole: profile.role ?? null,
				githubLogin: profile.githubLogin ?? null
			};
		}
	};
}
/** Committed canonical row identity is the revision of catalog-derived avatar facts. */
function readResidentUserProfileRevision(profileId, pathname) {
	const catalog = profileCatalogs.get(pathname);
	return catalog?.valid ? resolveCatalogProfile(catalog.rows, profileId) : void 0;
}
const profileCatalogs = /* @__PURE__ */ new Map();
const profileMutationPublications = /* @__PURE__ */ new Set();
let stopCatalogEvents;
let stopBindingEvents;
let profileCatalogHandles = /* @__PURE__ */ new WeakMap();
const profileBindings = /* @__PURE__ */ new WeakMap();
function supersedeBindingPublications(identity, email, current) {
	if (current && !profileMutationPublications.has(current)) return;
	for (const publication of profileMutationPublications) {
		if (publication === current) break;
		if (publication.identity.key === identity.key && publication.emailBindings.has(email)) publication.supersededBindings.add(email);
	}
}
function applyCatalogEmailBinding(rows, email, binding) {
	const bindings = profileBindings.get(rows);
	if (!bindings) return;
	const previous = applyUserProfileEmailBinding(bindings, email, binding);
	for (const id of /* @__PURE__ */ new Set([previous, binding?.profileId])) {
		const row = id && rows.get(id);
		if (row) rows.set(row.id, { ...row });
	}
}
function observeEmailBindings() {
	stopBindingEvents ??= onUserProfileEmailBindingChanged(({ db, email, binding }) => {
		supersedeBindingPublications(requireOpenClawStateDatabaseIdentity({ db }), email);
		const rows = profileCatalogHandles.get(db);
		if (rows) applyCatalogEmailBinding(rows, email, binding);
	});
}
function readProfileCatalog(options, resident, stored) {
	const catalog = profileCatalogs.get(profileCatalogPath(options));
	return catalog ? resident(catalog.rows) : withExistingOpenClawStateDatabaseReadOnly(({ db }) => tableExists(db, "user_profiles") ? stored(db) : void 0, options);
}
function loadProfileCatalog(catalog, db, identity) {
	if (!catalog.valid || catalog.identity.key !== identity.key) {
		catalog.rows = [...profileCatalogs.values()].find((candidate) => candidate.valid && candidate.identity.key === identity.key)?.rows ?? new Map(tableExists(db, "user_profiles") ? selectProfileAccessEntries(db) : []);
		Object.assign(catalog, {
			identity,
			valid: true
		});
		for (const publication of profileMutationPublications) retainProfileMutationPublicationCatalog(publication, catalog, true);
		return true;
	}
	return false;
}
function retainProfileMutationPublicationCatalog(publication, catalog, late) {
	if (!catalog.valid || catalog.identity.key !== publication.identity.key) return;
	if (!publication.catalogs.has(catalog)) {
		const lease = Symbol("pending profile mutation publication");
		publication.catalogs.set(catalog, lease);
		catalog.leases.add(lease);
	}
	let witness = publication.witnesses.get(catalog.rows);
	if (!witness) {
		witness = {
			rows: new Map([...publication.before.keys()].map((id) => [id, catalog.rows.get(id)])),
			late
		};
		publication.witnesses.set(catalog.rows, witness);
	}
	const bindings = profileBindings.get(catalog.rows);
	if (bindings && !witness.bindings) witness.bindings = {
		index: bindings,
		values: new Map([...publication.emailBindings.keys()].map((email) => [email, bindings.byEmail.get(email)])),
		late
	};
}
function releaseProfileCatalog(catalog, lease) {
	if (catalog.leases.delete(lease) && catalog.leases.size === 0) {
		for (const [pathname, current] of profileCatalogs) if (current.leases === catalog.leases) profileCatalogs.delete(pathname);
	}
	stopUnusedProfileCatalogObservers();
}
function stopUnusedProfileCatalogObservers() {
	if (profileCatalogs.size === 0 && profileMutationPublications.size === 0) {
		stopCatalogEvents?.();
		stopCatalogEvents = void 0;
		stopBindingEvents?.();
		stopBindingEvents = void 0;
		profileCatalogHandles = /* @__PURE__ */ new WeakMap();
	}
}
/** Capture under the worker's write transaction; native commits replace these row objects. */
function retainUserProfileMutationPublication(identity, before, emailBindings = []) {
	observeEmailBindings();
	const publication = {
		identity,
		before: new Map(before),
		emailBindings: new Map(emailBindings.map((change) => [change.email, change.before])),
		supersededBindings: /* @__PURE__ */ new Set(),
		witnesses: /* @__PURE__ */ new Map(),
		catalogs: /* @__PURE__ */ new Map()
	};
	profileMutationPublications.add(publication);
	for (const catalog of profileCatalogs.values()) retainProfileMutationPublicationCatalog(publication, catalog, false);
	const publish = (after, committed, bindings, settled) => {
		let changed = false;
		for (const catalog of publication.catalogs.keys()) {
			const witness = publication.witnesses.get(catalog.rows);
			if (!catalog.valid || catalog.identity.key !== identity.key || !witness) continue;
			const rowsBefore = new Map([...publication.before.keys()].map((id) => [id, catalog.rows.get(id)]));
			for (const [profileId, previous] of publication.before) {
				if (!after.has(profileId)) continue;
				const row = witness.rows.get(profileId);
				const observed = after.get(profileId);
				if (catalog.rows.get(profileId) === row && (!witness.late || isDeepStrictEqual(row, previous)) && !isDeepStrictEqual(row, observed)) {
					if (observed) catalog.rows.set(profileId, observed);
					else catalog.rows.delete(profileId);
					changed = true;
				}
			}
			const bindingWitness = witness.bindings;
			for (const change of bindings) {
				const index = profileBindings.get(catalog.rows);
				const previous = bindingWitness?.values.get(change.email);
				const current = index?.byEmail.get(change.email);
				if (bindingWitness && index === bindingWitness.index && publication.emailBindings.has(change.email) && !publication.supersededBindings.has(change.email) && (current === previous && !bindingWitness.late || isDeepStrictEqual(current ?? null, publication.emailBindings.get(change.email)))) {
					applyCatalogEmailBinding(catalog.rows, change.email, change.after);
					changed = true;
				}
			}
			if (committed) {
				let later = false;
				for (const successor of profileMutationPublications) {
					if (successor === publication) {
						later = true;
						continue;
					}
					const next = successor.witnesses.get(catalog.rows);
					if (!later || successor.identity.key !== identity.key || !next) continue;
					for (const [id, previousRow] of rowsBefore) {
						const final = catalog.rows.get(id);
						if (final !== previousRow && next.rows.get(id) === previousRow && successor.before.has(id) && isDeepStrictEqual(successor.before.get(id), final)) next.rows.set(id, final);
					}
				}
			}
		}
		for (const change of bindings) supersedeBindingPublications(identity, change.email, publication);
		settled?.();
		if (changed || bindings.length > 0 || committed && [...publication.before].some(([id, previous]) => after.has(id) && !isDeepStrictEqual(previous, after.get(id)))) emitUserProfilesChanged();
	};
	return {
		reconcile(after, bindings = [], settled) {
			publish(new Map(after), true, bindings, settled);
		},
		invalidate(settled) {
			publish(new Map([...publication.before.keys()].map((id) => [id, void 0])), false, [], settled);
		},
		release() {
			profileMutationPublications.delete(publication);
			for (const [catalog, lease] of publication.catalogs) releaseProfileCatalog(catalog, lease);
			publication.catalogs.clear();
			stopUnusedProfileCatalogObservers();
		}
	};
}
function observeProfileCatalogs(refresh = false) {
	observeEmailBindings();
	if (stopCatalogEvents && !refresh) return;
	stopCatalogEvents?.();
	stopCatalogEvents = registerOpenClawStateDatabaseLifecycleListener((event) => {
		let changed = false;
		for (const [locator, current] of profileCatalogs) if (event.kind === "opened") {
			if (event.database.path !== locator && event.identity.key !== current.identity.key && event.identity.canonicalPath !== current.identity.canonicalPath) continue;
			if (current.asyncOnly) {
				if (current.identity.key !== event.identity.key) {
					current.rows = /* @__PURE__ */ new Map();
					current.identity = event.identity;
					current.valid = false;
					changed = true;
				}
			} else changed = loadProfileCatalog(current, event.database.db, event.identity) || changed;
			profileCatalogHandles.set(event.database.db, current.rows);
		} else if (event.kind !== "closed" && (event.path === locator || event.identity?.key === current.identity.key)) {
			current.rows.clear();
			current.valid = false;
			changed = true;
		}
		if (changed) emitUserProfilesChanged();
	});
}
/** Retain exact identity and display/navigation facts; physical admission updates every locator before observers. */
function retainUserProfileCatalog(options = {}) {
	const pathname = profileCatalogPath(options);
	const existing = profileCatalogs.has(pathname);
	const catalog = profileCatalogs.get(pathname) ?? {
		rows: /* @__PURE__ */ new Map(),
		identity: readDatabasePathIdentitySync(pathname),
		valid: false,
		leases: /* @__PURE__ */ new Set()
	};
	if (!existing) {
		withExistingOpenClawStateDatabaseReadOnly(({ db }) => loadProfileCatalog(catalog, db, readDatabasePathIdentitySync(pathname)), {
			...options,
			path: pathname
		});
		profileCatalogs.set(pathname, catalog);
	}
	observeProfileCatalogs(!existing);
	const lease = Symbol("profile catalog lease");
	catalog.leases.add(lease);
	return () => releaseProfileCatalog(catalog, lease);
}
async function acquireUserProfileCatalog(options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const authority = await captureUserProfileAuthorityRead(context.admission);
	const pathname = context.admission.databasePath;
	let refreshObserver = false;
	let catalog = profileCatalogs.get(pathname) ?? [...profileCatalogs.values()].find((candidate) => candidate.valid && candidate.identity.key === context.admission.identity.key);
	if (catalog) profileCatalogs.set(pathname, catalog);
	while (!catalog?.valid || catalog.identity.key !== context.admission.identity.key || !profileBindings.has(catalog.rows)) {
		const profileRevision = readUserProfileVersion();
		const bindingRevision = readUserProfileEmailBindingRevision();
		const reply = await executeExistingOpenClawStateRead({
			...options,
			path: pathname
		}, { type: "userProfiles.catalog" }, { current: true });
		context.admission.assertCurrent();
		if (reply && (!reply.ok || reply.type !== "userProfiles.catalog")) throw new Error(reply.ok ? "Unexpected profile catalog reply" : reply.message);
		if (profileRevision !== readUserProfileVersion() || bindingRevision !== readUserProfileEmailBindingRevision()) {
			catalog = profileCatalogs.get(pathname);
			continue;
		}
		catalog = profileCatalogs.get(pathname) ?? [...profileCatalogs.values()].find((candidate) => candidate.valid && candidate.identity.key === context.admission.identity.key);
		if (catalog?.valid && catalog.identity.key === context.admission.identity.key && profileBindings.has(catalog.rows)) {
			profileCatalogs.set(pathname, catalog);
			break;
		}
		if (!catalog?.valid || catalog.identity.key !== context.admission.identity.key) {
			if (catalog) catalog.valid = false;
			catalog = {
				rows: new Map(reply?.profiles ?? []),
				identity: context.admission.identity,
				valid: true,
				leases: catalog?.leases ?? /* @__PURE__ */ new Set(),
				asyncOnly: catalog ? catalog.asyncOnly : true
			};
			refreshObserver = true;
			profileCatalogs.set(pathname, catalog);
		}
		const bindings = {
			byEmail: /* @__PURE__ */ new Map(),
			byId: /* @__PURE__ */ new Map(),
			emailsByProfile: /* @__PURE__ */ new Map()
		};
		for (const binding of reply?.emailBindings ?? []) applyUserProfileEmailBinding(bindings, binding.email, binding);
		profileBindings.set(catalog.rows, bindings);
		for (const publication of profileMutationPublications) retainProfileMutationPublicationCatalog(publication, catalog, true);
	}
	observeProfileCatalogs(refreshObserver);
	const retained = catalog;
	const identity = retained.identity.key;
	const rows = retained.rows;
	const bindings = profileBindings.get(rows);
	const release = retainUserProfileCatalog({
		...options,
		path: pathname
	});
	let active = true;
	const assertCurrent = (profileId) => {
		context.admission.assertCurrent();
		if (!retained.valid || context.admission.identity.key !== identity || retained.identity.key !== identity || retained.rows !== rows) throw new UserProfileNotFoundError(profileId);
		authority.assertSettled(profileId);
	};
	retained.assertCurrent = assertCurrent;
	return {
		rows,
		bindings,
		assertCurrent(profileId) {
			if (!active) throw new UserProfileNotFoundError(profileId);
			assertCurrent(profileId);
		},
		release() {
			if (active) {
				active = false;
				release();
			}
		}
	};
}
/** Retain one off-thread preparation for a synchronous batch of current canonical identities. */
async function prepareUserProfileCatalog(options = {}) {
	const catalog = await acquireUserProfileCatalog(options);
	return {
		readCurrentIdentity(profileId) {
			catalog.assertCurrent(profileId);
			const profile = projectCatalogUserProfileIdentity(catalog.rows, profileId);
			if (profile && profile.profileId !== profileId) catalog.assertCurrent(profile.profileId);
			return profile;
		},
		release: catalog.release
	};
}
/** Prepare once off-thread; execution reads only committed facts retained by this owner. */
async function prepareUserProfileIdentity(profileId, options = {}, emailTargets) {
	const capturedEmails = emailTargets?.slice();
	return bindPreparedUserProfileIdentity(profileId, await acquireUserProfileCatalog(options), capturedEmails);
}
/** Stage exact changed keys before commit so observers always see the whole committed catalog. */
function stageUserProfileCatalogChange(db, profileIds) {
	const catalog = profileCatalogHandles.get(db);
	if (catalog) {
		const rows = selectProfileAccessEntries(db, profileIds);
		stageSqliteTransactionState(db, {
			stage: () => {},
			rollback: () => {},
			commit: () => rows.forEach(([id, row]) => catalog.set(id, row))
		});
	}
}
function publishUserProfilesChange(db, ...profileIds) {
	stageUserProfileCatalogChange(db, profileIds);
	deferSqlitePostCommitPublication(db, emitUserProfilesChanged);
}
/** Reads merge-aware display data without loading avatar bytes. */
function getUserProfileDisplay(profileId, options = {}) {
	const profile = readProfileCatalog(options, (resident) => resolveCatalogProfile(resident, profileId), (db) => selectResolvedUserProfile(db, profileId, userProfilesDb(db).selectFrom("user_profiles").select(userProfileDisplaySelection)));
	if (!profile) throw new UserProfileNotFoundError(profileId);
	return projectUserProfileDisplay(profile);
}
/** Read a bounded display cohort and its one-hop merge targets without initializing storage. */
function getUserProfileDisplays(profileIds, options = {}) {
	const ids = [...new Set(profileIds)];
	if (ids.length === 0) return /* @__PURE__ */ new Map();
	return readProfileCatalog(options, (resident) => projectUserProfileDisplays(ids, (id) => resolveCatalogProfile(resident, id)), (db) => {
		const rows = selectUserProfileDisplaysInDatabase(db, ids);
		return projectUserProfileDisplays(ids, (id) => rows.get(id));
	}) ?? /* @__PURE__ */ new Map();
}
/** Activity references are display navigation, never authentication identifiers. */
function resolveUserProfileReference(reference, options = {}) {
	const { allowedProfileIds } = options;
	if (allowedProfileIds?.size === 0) return ok(void 0);
	return readProfileCatalog(options, (resident) => resolveUserProfileReferenceInCatalog(resident, reference, allowedProfileIds), (db) => selectUserProfileReferenceInDatabase(db, reference, allowedProfileIds)) ?? ok(void 0);
}
//#endregion
export { githubAuthenticationSubject as C, selectProfileAccessEntries as D, resolveUserProfileGitHubAttribution as E, selectStoredGitHubIdentities as O, assertGitHubEmailIdentityBinding as S, prepareUserProfileGitHubMerge as T, profileCatalogPath as _, prepareUserProfileCatalog as a, readUserProfileSnapshotSync as b, readResidentUserProfileId as c, readUserProfileIdentity as d, resolveUserProfileReference as f, listUserProfilesSync as g, stageUserProfileCatalogChange as h, hasMultipleSessionSharingIdentities as i, selectUserProfileGitHubIdentities as k, readResidentUserProfileRevision as l, retainUserProfileMutationPublication as m, getUserProfileDisplay as n, prepareUserProfileIdentity as o, retainUserProfileCatalog as p, getUserProfileDisplays as r, publishUserProfilesChange as s, captureResidentUserProfileAccess as t, readUserProfileAliases as u, readCurrentUserProfileAliases as v, prepareUserProfileGitHubAttribution as w, applyVerifiedGitHubIdentity as x, readUserProfileEmailBindings as y };
