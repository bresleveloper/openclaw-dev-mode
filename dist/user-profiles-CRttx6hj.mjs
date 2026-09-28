import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { i as USER_PROFILE_AVATAR_MIME_TYPES, r as MAX_USER_PROFILE_AVATAR_BYTES } from "./avatar-limits-2506OuP3.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { C as ensureUserProfileRoleSchema, D as runUserProfileWriteTransaction, F as publishUserProfileAliasChange, I as publishUserProfileAuthorityChange, L as publishUserProfileIdentityChange, S as UserProfileOwnerError, T as hasEnsuredUserProfileRoleSchema, _ as toUserProfile, b as userProfilesDb, g as setUserProfileEmailBinding, h as selectResolvedUserProfileMetadataById, i as insertUserProfile, l as requireResolvedUserProfileById, u as requireResolvedUserProfileMetadataById, v as userProfileAvatarPresence, w as ensureUserProfilesSchema, x as UserProfileNotFoundError } from "./user-profiles-internal-BxQLnWfo.mjs";
import { o as mergeUserModelAccounts } from "./user-model-accounts-C87WCnZM.mjs";
import { C as selectUserProfileGitHubIdentities, T as mergeUserPreferences, _ as applyVerifiedGitHubIdentity, b as prepareUserProfileGitHubMerge, d as retainUserProfilePublication, f as stageUserProfileCatalogChange, i as publishUserProfilesChange, v as githubAuthenticationSubject, w as ensureUserPreferencesSchema } from "./user-profile-list-B5pNqyXa.mjs";
import { n as normalizeProfileEmail, t as ensureProfileForEmailInDatabase } from "./user-profile-email.kernel-BB2UacBU.mjs";
import { i as mergeUserGitHubConnection } from "./user-github-connections-Bepgzp4W.mjs";
import { n as readGatewayOwnerProfileForEnsure, t as ensureGatewayOwnerProfileRow } from "./user-profiles-owner-B9hIJDeo.mjs";
import { createHash } from "node:crypto";
//#region src/state/user-profiles-tailscale-login.ts
/** Classify Tailscale's documented email or email-ish LoginName representation. */
function classifyTailscaleLogin(login) {
	const normalized = login.trim();
	const separator = normalized.lastIndexOf("@");
	if (separator <= 0 || separator === normalized.length - 1) return { kind: "invalid" };
	const subject = normalized.slice(0, separator);
	const suffix = normalized.slice(separator + 1);
	return suffix.includes(".") ? {
		kind: "email",
		email: normalized
	} : {
		kind: "provider",
		provider: suffix.toLowerCase(),
		subject: subject.toLowerCase()
	};
}
//#endregion
//#region src/state/user-profiles-merge.ts
function mergeUserProfiles(db, sourceProfileId, targetProfileId, now, mutation) {
	if (sourceProfileId === targetProfileId) return;
	const kysely = userProfilesDb(db);
	const sourceProfileIds = [sourceProfileId, ...executeSqliteQuerySync(db, kysely.selectFrom("user_profiles").select("id").where("merged_into", "=", sourceProfileId)).rows.map((row) => row.id)];
	mutation?.before(db, ...sourceProfileIds, targetProfileId);
	prepareUserProfileGitHubMerge(db, sourceProfileIds, targetProfileId);
	const source = requireResolvedUserProfileById(db, sourceProfileId);
	if (source.avatar !== null) executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({
		avatar: source.avatar,
		avatar_mime: source.avatar_mime,
		avatar_sha256: source.avatar_sha256
	}).where("id", "=", targetProfileId).where("avatar", "is", null));
	mergeUserModelAccounts(db, sourceProfileId, targetProfileId);
	mergeUserGitHubConnection(db, sourceProfileId, targetProfileId);
	for (const mergedProfileId of sourceProfileIds) mergeUserPreferences(db, mergedProfileId, targetProfileId);
	const sourceEmails = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_emails").select("email").where("profile_id", "in", sourceProfileIds)).rows;
	for (const { email } of sourceEmails) setUserProfileEmailBinding(db, email, targetProfileId, now);
	executeSqliteQuerySync(db, kysely.updateTable("user_profile_identities").set({ profile_id: targetProfileId }).where("profile_id", "in", sourceProfileIds));
	executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({
		merged_into: targetProfileId,
		updated_at: now
	}).where("id", "in", sourceProfileIds));
	executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ updated_at: now }).where("id", "=", targetProfileId));
	stageUserProfileCatalogChange(db, sourceProfileIds);
	mutation?.publish(...sourceProfileIds, targetProfileId);
	mutation?.authority(...sourceProfileIds, targetProfileId);
	mutation?.identity(...sourceProfileIds);
	publishUserProfileAuthorityChange(db, ...sourceProfileIds, targetProfileId);
	publishUserProfileIdentityChange(db, ...sourceProfileIds);
	deferSqlitePostCommitPublication(db, publishUserProfileAliasChange);
}
//#endregion
//#region src/state/user-profile-reads.ts
async function resolveCanonicalCachedGitHubIdentity(params, options = {}) {
	const reply = await executeExistingOpenClawStateRead(options, {
		type: "userProfiles.githubIdentity.cached",
		accountId: params.accountId,
		email: params.email
	});
	if (!reply) return;
	if (!reply.ok || reply.type !== "userProfiles.githubIdentity.cached") throw new Error("Cached GitHub identity reader returned an unexpected result");
	return reply.identity;
}
async function listProfiles(options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "userProfiles.list",
		input: void 0
	});
}
/** Candidate IDs and search labels; current recipient policy remains caller-owned. */
async function readUserProfileDirectory(limit, options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "userProfiles.directory",
		input: { limit }
	});
}
//#endregion
//#region src/state/user-profiles-avatar.types.ts
function isUserProfileAvatarAdmission(value) {
	if (!isRecord(value) || value.kind !== "profile-avatar" || !isRecord(value.before)) return false;
	const row = value.before;
	return typeof row.id === "string" && typeof row.updated_at === "number" && (row.has_avatar === 0 || row.has_avatar === 1) && [
		"display_name",
		"avatar_mime",
		"avatar_sha256",
		"merged_into"
	].every((key) => row[key] === null || typeof row[key] === "string") && (row.role === void 0 || row.role === null || typeof row.role === "string");
}
//#endregion
//#region src/state/user-profiles-tailscale-avatar.ts
const TAILSCALE_AVATAR_FETCH_TIMEOUT_MS = 5e3;
const TAILSCALE_AVATAR_MAX_REDIRECTS = 3;
function toAvatarMime(value) {
	return USER_PROFILE_AVATAR_MIME_TYPES.includes(value) ? value : null;
}
async function fetchTailscaleAvatar(url, options) {
	try {
		const timeoutMs = options.timeoutMs ?? TAILSCALE_AVATAR_FETCH_TIMEOUT_MS;
		const fetchImpl = options.fetchImpl;
		const [{ readRemoteMediaBuffer }, { fileTypeFromBuffer }] = await Promise.all([import("./fetch-DhGrTP7u.mjs"), import("file-type")]);
		const loaded = await readRemoteMediaBuffer({
			url,
			fetchImpl,
			maxBytes: MAX_USER_PROFILE_AVATAR_BYTES,
			maxRedirects: TAILSCALE_AVATAR_MAX_REDIRECTS,
			timeoutMs,
			responseHeaderTimeoutMs: timeoutMs,
			readIdleTimeoutMs: timeoutMs,
			requestInit: { headers: { Accept: USER_PROFILE_AVATAR_MIME_TYPES.join(",") } }
		});
		const mime = toAvatarMime(loaded.contentType);
		const detected = await fileTypeFromBuffer(loaded.buffer);
		return mime && detected?.mime === mime ? {
			bytes: loaded.buffer,
			mime
		} : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/state/user-profiles-avatar.ts
function requireAvatarProfile(profile, profileId) {
	if (!profile) throw new UserProfileNotFoundError(profileId);
	return profile;
}
/** Best-effort avatar adoption runs after authentication so remote I/O cannot delay login. */
async function adoptTailscaleProfileAvatar(profileId, profilePic, options = {}, fetchOptions = {}) {
	const first = captureOpenClawStateWorkerContext({
		...options,
		path: options.database?.path ?? options.path
	});
	const { executeOpenClawStateWorker, runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	const before = await executeOpenClawStateWorker(first, {
		type: "userProfiles.avatar.inspect",
		input: { profileId }
	});
	const initial = requireAvatarProfile(before.profile, profileId);
	if (before.hasAvatar || !profilePic) return initial;
	const avatar = await fetchTailscaleAvatar(profilePic, fetchOptions);
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: first.admission.databasePath
	});
	if (!avatar) return requireAvatarProfile((await executeOpenClawStateWorker(context, {
		type: "userProfiles.avatar.inspect",
		input: { profileId }
	})).profile, profileId);
	const [{ withOpenClawStateSettlementRead }, { createSqliteWorkerOperationAdmission }] = await Promise.all([import("./openclaw-state-settlement-read-BxkhWuUz.mjs"), import("./sqlite-worker-operation-admission-Cx5RNeTC.mjs")]);
	return await withOpenClawStateSettlementRead(context, async (settlementRead) => runOpenClawStateWorkerOperation(context, async (scope) => {
		const receipt = await scope.execute({
			type: "userProfiles.avatar.adopt",
			input: {
				profileId,
				bytes: avatar.bytes,
				mime: avatar.mime,
				now: Date.now()
			}
		});
		settlementRead.acknowledge(receipt.committed);
		return requireAvatarProfile(receipt.profile, profileId);
	}, {
		requireStateLifecycle: true,
		createAdmission(retained) {
			return {
				nativeLocations: [context.admission.databasePath],
				admission: createSqliteWorkerOperationAdmission((request, grant) => {
					context.admission.assertCurrent();
					if (request.stage !== "transaction" || !isUserProfileAvatarAdmission(request.facts)) throw new Error("Unexpected profile avatar transaction admission");
					const publication = retainUserProfilePublication(context.admission.identity, request.facts.before.id, request.facts.before);
					try {
						settlementRead.bind({
							type: "userProfiles.reconcile",
							profileId: request.facts.before.id
						}, retained.settled, publication.reconcile, publication.release);
					} catch (error) {
						publication.release();
						throw error;
					}
					grant();
				})
			};
		}
	}));
}
//#endregion
//#region src/state/user-profiles.ts
function normalizeInitialDisplayName(name) {
	const normalized = name?.trim();
	return normalized ? truncateUtf16Safe(normalized, 256) : null;
}
function selectUserProfileListItemById(db, profileId) {
	const kysely = userProfilesDb(db);
	const profile = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profiles").select([
		"id",
		"display_name",
		"avatar_mime",
		"merged_into",
		...hasEnsuredUserProfileRoleSchema(db) ? ["role"] : [],
		"created_at",
		"updated_at",
		userProfileAvatarPresence
	]).where("id", "=", profileId));
	if (!profile) throw new UserProfileNotFoundError(profileId);
	const emails = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_emails").select("email").where("profile_id", "=", profileId).orderBy("email", "asc")).rows;
	return {
		...toUserProfile(profile),
		emails: emails.map((alias) => alias.email),
		githubIdentity: selectUserProfileGitHubIdentities(db, [profileId]).get(profileId) ?? null,
		hasAvatar: profile.has_avatar === 1
	};
}
/** Resolves a durable profile reference to its current one-hop merge head. */
function resolveUserProfileId(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	return selectResolvedUserProfileMetadataById(db, profileId)?.id;
}
/** Reads a profile's protocol-facing representation through its merge head. */
function getUserProfileListItem(profileId, options = {}) {
	ensureUserProfilesSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	return selectUserProfileListItemById(db, requireResolvedUserProfileMetadataById(db, profileId).id);
}
/** Reads the role assigned to an existing profile's current merge head. */
function getUserProfileRole(profileId, options = {}) {
	ensureUserProfileRoleSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	return requireResolvedUserProfileMetadataById(db, profileId).role ?? null;
}
/** Assigns or clears the role on an existing profile's current merge head. */
function setUserProfileRole(profileId, role, options = {}) {
	ensureUserProfileRoleSchema(options);
	const now = Date.now();
	return runUserProfileWriteTransaction(({ db }) => {
		const profile = requireResolvedUserProfileMetadataById(db, profileId);
		options.mutation?.before(db, profile.id);
		if (profileId === "gateway-owner" || profile.id === "gateway-owner") throw new UserProfileOwnerError("role");
		executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({
			role,
			updated_at: now
		}).where("id", "=", profile.id));
		if ((profile.role ?? null) !== role) {
			options.mutation?.authority(profile.id);
			publishUserProfileAuthorityChange(db, profile.id);
		}
		options.mutation?.publish(profile.id);
		publishUserProfilesChange(db, profile.id);
		return selectUserProfileListItemById(db, profile.id);
	}, options, { operationLabel: "user-profiles.set-role" });
}
function ensureProfileForEmailWithInitialName(email, initialDisplayName, options) {
	const normalizedEmail = normalizeProfileEmail(email);
	ensureUserProfilesSchema(options);
	const { db: reader } = openOpenClawStateDatabase(options);
	const selectExistingProfile = (database) => {
		const alias = executeSqliteQueryTakeFirstSync(database, userProfilesDb(database).selectFrom("user_profile_emails").select("profile_id").where("email", "=", normalizedEmail));
		return alias ? toUserProfile(requireResolvedUserProfileMetadataById(database, alias.profile_id)) : void 0;
	};
	const found = runSqliteDeferredTransactionSync(reader, () => selectExistingProfile(reader));
	if (found) return found;
	const now = Date.now();
	return runUserProfileWriteTransaction(({ db }) => ensureProfileForEmailInDatabase(db, normalizedEmail, initialDisplayName, now, options.mutation), options, { operationLabel: "user-profiles.ensure" });
}
/** Resolves an email alias or atomically creates its first durable profile. */
function ensureProfileForEmail(email, options = {}) {
	return ensureProfileForEmailWithInitialName(email, null, options);
}
function ensureProfileForProviderIdentity(params) {
	const options = params.options;
	const subject = params.provider === "github" ? githubAuthenticationSubject(params.subject) : params.subject;
	ensureUserProfilesSchema(params.options);
	const { db: reader } = openOpenClawStateDatabase(params.options);
	const selectExistingIdentity = (database) => {
		let query = userProfilesDb(database).selectFrom("user_profile_identities").select(["profile_id", "subject"]).where("provider", "=", params.provider);
		query = params.provider === "github" ? query.where((eb) => eb.or([eb("subject", "=", subject), eb.and([eb("subject", "=", params.subject), eb("canonical_login", "is", null)])])).orderBy(sql`CASE WHEN subject = ${subject} THEN 0 ELSE 1 END`) : query.where("subject", "=", subject);
		return executeSqliteQueryTakeFirstSync(database, query);
	};
	const existing = runSqliteDeferredTransactionSync(reader, () => {
		const identity = selectExistingIdentity(reader);
		return identity?.subject === subject ? toUserProfile(requireResolvedUserProfileMetadataById(reader, identity.profile_id)) : void 0;
	});
	if (existing) return existing;
	const now = Date.now();
	return runUserProfileWriteTransaction(({ db }) => {
		const kysely = userProfilesDb(db);
		const existingIdentity = selectExistingIdentity(db);
		if (existingIdentity) {
			const profile = requireResolvedUserProfileMetadataById(db, existingIdentity.profile_id);
			if (existingIdentity.subject !== subject) {
				options.mutation?.before(db, existingIdentity.profile_id);
				executeSqliteQuerySync(db, kysely.updateTable("user_profile_identities").set({ subject }).where("provider", "=", params.provider).where("subject", "=", existingIdentity.subject));
				options.mutation?.authority(existingIdentity.profile_id, profile.id);
				publishUserProfileAuthorityChange(db, existingIdentity.profile_id, profile.id);
				options.mutation?.publish(existingIdentity.profile_id);
				publishUserProfilesChange(db, existingIdentity.profile_id);
			}
			return toUserProfile(profile);
		}
		const row = insertUserProfile(db, params.initialDisplayName, now, options.mutation);
		executeSqliteQuerySync(db, kysely.insertInto("user_profile_identities").values({
			provider: params.provider,
			subject,
			profile_id: row.id,
			canonical_login: null,
			created_at: now
		}));
		options.mutation?.authority(row.id);
		publishUserProfileAuthorityChange(db, row.id);
		options.mutation?.publish(row.id);
		publishUserProfilesChange(db, row.id);
		return toUserProfile(row);
	}, params.options, { operationLabel: "user-profiles.ensure-identity" });
}
function adoptDisplayNameIfEmpty(profileId, displayName, options) {
	const { db: reader } = openOpenClawStateDatabase(options);
	const existing = runSqliteDeferredTransactionSync(reader, () => requireResolvedUserProfileMetadataById(reader, profileId));
	if (!displayName || existing.display_name?.trim()) return toUserProfile(existing);
	const now = Date.now();
	return runUserProfileWriteTransaction(({ db }) => {
		const profile = requireResolvedUserProfileMetadataById(db, profileId);
		options.mutation?.before(db, profile.id);
		if (profile.display_name?.trim()) return toUserProfile(profile);
		executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({
			display_name: displayName,
			updated_at: now
		}).where("id", "=", profile.id));
		options.mutation?.publish(profile.id);
		publishUserProfilesChange(db, profile.id);
		return toUserProfile({
			...profile,
			display_name: displayName,
			updated_at: now
		});
	}, options, { operationLabel: "user-profiles.adopt-display-name" });
}
/** Shared-secret devices resolve one local owner without inventing an email identity. */
function ensureGatewayOwnerProfile(initialDisplayName, options = {}) {
	const displayName = normalizeInitialDisplayName(initialDisplayName);
	ensureUserProfilesSchema(options);
	const { db: reader } = openOpenClawStateDatabase(options);
	const found = runSqliteDeferredTransactionSync(reader, () => {
		const { existing, identified } = readGatewayOwnerProfileForEnsure(reader);
		return existing && identified && (!displayName || existing.display_name?.trim()) ? existing : void 0;
	});
	if (found) return toUserProfile(found);
	return runUserProfileWriteTransaction(({ db }) => toUserProfile(ensureGatewayOwnerProfileRow(db, displayName, options.mutation)), options, { operationLabel: "user-profiles.ensure-owner" });
}
/** Resolves a verified Tailscale login and adopts its display name into an empty field. */
function ensureProfileForTailscaleIdentity(identity, options = {}) {
	const classified = classifyTailscaleLogin(identity.login);
	if (classified.kind === "invalid") throw new TypeError("Tailscale login must contain a nonempty subject and suffix");
	const displayName = normalizeInitialDisplayName(identity.name);
	return adoptDisplayNameIfEmpty((classified.kind === "email" ? ensureProfileForEmailWithInitialName(classified.email, displayName, options) : ensureProfileForProviderIdentity({
		provider: classified.provider,
		subject: classified.subject,
		initialDisplayName: displayName,
		options
	})).id, displayName, options);
}
/** Links an email to a profile and retains an aliasless prior profile as a merge tombstone. */
function linkEmail(email, targetProfileId, options = {}) {
	const normalizedEmail = normalizeProfileEmail(email);
	const now = Date.now();
	ensureUserProfilesSchema(options);
	return runUserProfileWriteTransaction(({ db }) => {
		const kysely = userProfilesDb(db);
		const target = requireResolvedUserProfileMetadataById(db, targetProfileId);
		if (targetProfileId === "gateway-owner" || target.id === "gateway-owner") throw new UserProfileOwnerError("merge");
		const existingAlias = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_emails").select("profile_id").where("email", "=", normalizedEmail));
		if (existingAlias?.profile_id === "gateway-owner") throw new UserProfileOwnerError("merge");
		if (!existingAlias) {
			options.mutation?.before(db, target.id);
			setUserProfileEmailBinding(db, normalizedEmail, target.id, now);
			executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ updated_at: now }).where("id", "=", target.id));
			options.mutation?.authority(target.id);
			publishUserProfileAuthorityChange(db, target.id);
			options.mutation?.publish(target.id);
			publishUserProfilesChange(db, target.id);
			return selectUserProfileListItemById(db, target.id);
		}
		if (existingAlias.profile_id === target.id) return selectUserProfileListItemById(db, target.id);
		options.mutation?.before(db, target.id, existingAlias.profile_id);
		setUserProfileEmailBinding(db, normalizedEmail, target.id, now);
		const remainingAliases = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_emails").select("email").where("profile_id", "=", existingAlias.profile_id)).rows;
		executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ updated_at: now }).where("id", "=", target.id));
		if (remainingAliases.length === 0) mergeUserProfiles(db, existingAlias.profile_id, target.id, now, options.mutation);
		else executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ updated_at: now }).where("id", "=", existingAlias.profile_id));
		options.mutation?.authority(target.id, existingAlias.profile_id);
		publishUserProfileAuthorityChange(db, target.id, existingAlias.profile_id);
		options.mutation?.publish(target.id, existingAlias.profile_id);
		publishUserProfilesChange(db, target.id, existingAlias.profile_id);
		return selectUserProfileListItemById(db, target.id);
	}, options, { operationLabel: "user-profiles.link-email" });
}
function setDisplayName(profileId, name, options = {}) {
	const now = Date.now();
	ensureUserProfilesSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const profile = requireResolvedUserProfileMetadataById(db, profileId);
		executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({
			display_name: name,
			updated_at: now
		}).where("id", "=", profile.id));
		publishUserProfilesChange(db, profile.id);
		return selectUserProfileListItemById(db, profile.id);
	}, options, { operationLabel: "user-profiles.set-display-name" });
}
function normalizeGitHubAuthenticationAlias(alias) {
	return alias.kind === "email" ? {
		kind: "email",
		email: normalizeProfileEmail(alias.email)
	} : {
		kind: "github-login",
		subject: githubAuthenticationSubject(alias.login)
	};
}
function syncGitHubIdentity(params, options = {}) {
	const alias = normalizeGitHubAuthenticationAlias(params.authenticationAlias);
	const githubDisplayName = normalizeInitialDisplayName(params.identity.name);
	const initialDisplayName = githubDisplayName ?? normalizeInitialDisplayName(params.initialDisplayName);
	ensureUserProfilesSchema(options);
	ensureUserPreferencesSchema(options);
	return runUserProfileWriteTransaction(({ db }) => {
		const now = Date.now();
		const binding = applyVerifiedGitHubIdentity({
			db,
			mutation: options.mutation,
			alias,
			identity: params.identity,
			preserveEmailProfile: params.preserveEmailProfile,
			createProfile: () => insertUserProfile(db, initialDisplayName, now, options.mutation).id,
			mergeProfiles: (sourceProfileId, targetProfileId) => mergeUserProfiles(db, sourceProfileId, targetProfileId, now, options.mutation)
		});
		const profile = selectUserProfileListItemById(db, binding.profileId);
		const displayName = githubDisplayName && profile.displayName === params.identity.login.trim() ? githubDisplayName : profile.displayName ?? initialDisplayName;
		if (!binding.changed && displayName === profile.displayName) return profile;
		options.mutation?.before(db, profile.id);
		executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({
			display_name: displayName,
			updated_at: now
		}).where("id", "=", profile.id));
		options.mutation?.publish(profile.id);
		publishUserProfilesChange(db, profile.id);
		return {
			...profile,
			displayName,
			updatedAt: now
		};
	}, options, { operationLabel: "user-profiles.sync-github-identity" });
}
/** Stores a bounded, allowlisted avatar without ever leaving the write transaction async. */
function setAvatar(profileId, bytes, mime, options = {}) {
	if (bytes.byteLength > 524288) return err({
		code: "avatar_too_large",
		maxBytes: MAX_USER_PROFILE_AVATAR_BYTES
	});
	if (!USER_PROFILE_AVATAR_MIME_TYPES.includes(mime)) return err({
		code: "unsupported_avatar_mime",
		mime
	});
	const now = Date.now();
	ensureUserProfilesSchema(options);
	const value = runOpenClawStateWriteTransaction(({ db }) => {
		const profile = requireResolvedUserProfileMetadataById(db, profileId);
		const sha256 = createHash("sha256").update(bytes).digest("hex");
		executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({
			avatar: bytes,
			avatar_mime: mime,
			avatar_sha256: sha256,
			updated_at: now
		}).where("id", "=", profile.id));
		publishUserProfilesChange(db, profile.id);
		return selectUserProfileListItemById(db, profile.id);
	}, options, { operationLabel: "user-profiles.set-avatar" });
	return ok(value);
}
//#endregion
export { getUserProfileRole as a, setAvatar as c, syncGitHubIdentity as d, adoptTailscaleProfileAvatar as f, classifyTailscaleLogin as g, resolveCanonicalCachedGitHubIdentity as h, getUserProfileListItem as i, setDisplayName as l, readUserProfileDirectory as m, ensureProfileForEmail as n, linkEmail as o, listProfiles as p, ensureProfileForTailscaleIdentity as r, resolveUserProfileId as s, ensureGatewayOwnerProfile as t, setUserProfileRole as u };
