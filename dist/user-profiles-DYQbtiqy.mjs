import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { d as sql, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { r as WorkerTaskError } from "./src-WCJCjrey.mjs";
import "./worker-task-pool-iI3pfrsK.mjs";
import { i as getExistingOpenClawStateSchemaPath } from "./openclaw-state-db-schema-policy-BxAJZRG6.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext, t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { i as USER_PROFILE_AVATAR_MIME_TYPES, r as MAX_USER_PROFILE_AVATAR_BYTES } from "./avatar-limits-2506OuP3.mjs";
import { A as runUserProfileWriteTransaction, D as ensureUserProfilesSchema, E as ensureUserProfileRoleSchema, K as readUserProfileVersion, O as hasEnsuredUserProfileRoleSchema, R as onUserProfilesChanged, S as userProfilesDb, V as publishUserProfileAuthorityChange, _ as selectUserProfileEmails, b as userProfileAvatarPresence, g as selectUserProfileEmailAlias, h as selectResolvedUserProfileMetadataById, i as insertUserProfile, j as isProfileDisplayRow, u as requireResolvedUserProfileMetadataById, w as UserProfileNotFoundError, y as toUserProfile } from "./user-profiles-internal-DlO1LBbo.mjs";
import { C as githubAuthenticationSubject, S as assertGitHubEmailIdentityBinding, _ as profileCatalogPath, k as selectUserProfileGitHubIdentities, l as readResidentUserProfileRevision, m as retainUserProfileMutationPublication, s as publishUserProfilesChange } from "./user-profile-list-CtETKur7.mjs";
import { n as normalizeProfileEmail, t as ensureProfileForEmailInDatabase } from "./user-profile-email.kernel-x_-pE-8u.mjs";
import { n as readGatewayOwnerProfileForEnsure, t as ensureGatewayOwnerProfileRow } from "./user-profiles-owner-CC-RfU2U.mjs";
import { t as classifyTailscaleLogin } from "./user-profiles-tailscale-login-BtASdRBZ.mjs";
import pLimit from "p-limit";
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
	return (await readUserProfileSnapshot(void 0, options)).profiles;
}
async function readUserProfileSnapshot(githubAccountIds, options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "userProfiles.list",
		input: githubAccountIds ? { githubAccountIds } : void 0
	});
}
/** Candidate IDs and search labels; current recipient policy remains caller-owned. */
async function readUserProfileDirectory(limit, options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "userProfiles.directory",
		input: { limit }
	});
}
//#endregion
//#region src/state/user-profiles-avatar.types.ts
function isUserProfileAvatarAdmission(value) {
	return isRecord(value) && value.kind === "profile-avatar" && isProfileDisplayRow(value.before);
}
//#endregion
//#region src/state/user-profiles-tailscale-avatar.ts
const TAILSCALE_AVATAR_FETCH_TIMEOUT_MS = 5e3;
const TAILSCALE_AVATAR_MAX_REDIRECTS = 3;
async function fetchTailscaleAvatar(url, options) {
	try {
		const timeoutMs = options.timeoutMs ?? TAILSCALE_AVATAR_FETCH_TIMEOUT_MS;
		const fetchImpl = options.fetchImpl;
		const [{ readRemoteMediaBuffer }, { fileTypeFromBuffer }] = await Promise.all([import("./fetch-BR50Tnwt.mjs"), import("file-type")]);
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
		const mime = USER_PROFILE_AVATAR_MIME_TYPES.find((candidate) => candidate === loaded.contentType);
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
const pendingReaders = /* @__PURE__ */ new Map();
const avatarReads = pLimit(4);
const avatarCache = /* @__PURE__ */ new Map();
let avatarCacheBytes = 0;
function evictAvatar(revision, avatar) {
	avatarCache.delete(revision);
	avatarCacheBytes -= avatar.avatar?.byteLength ?? 0;
}
function currentAvatar(avatar) {
	try {
		return avatar.isCurrent();
	} catch {
		return false;
	}
}
onUserProfilesChanged(() => {
	for (const [revision, avatar] of avatarCache) if (!currentAvatar(avatar)) evictAvatar(revision, avatar);
});
function cacheAvatar(revision, avatar) {
	const previous = avatarCache.get(revision);
	if (previous) evictAvatar(revision, previous);
	avatarCache.set(revision, avatar);
	avatarCacheBytes += avatar.avatar?.byteLength ?? 0;
	for (const [oldest, value] of avatarCache) {
		if (avatarCache.size <= 128 && avatarCacheBytes <= 16777216) break;
		evictAvatar(oldest, value);
	}
}
async function readAvatar(operation) {
	if (avatarReads.pendingCount >= 128) throw new WorkerTaskError("Profile avatar read queue is full", "overloaded");
	const signal = AbortSignal.timeout(5e3);
	try {
		return await racePromiseWithAbortSignal(avatarReads(() => {
			signal.throwIfAborted();
			return operation(signal);
		}), signal);
	} catch (error) {
		if (signal.aborted) throw new WorkerTaskError("Profile avatar read budget expired", "timeout");
		throw error;
	}
}
/** Keep every refresh and materialization bound to the original physical store. */
function createProfileAvatarReader(profileId, options = {}) {
	const pathname = profileCatalogPath(options);
	const share = !(options.env || options.database || getOpenClawDatabaseMaintenanceScope() || getExistingOpenClawStateSchemaPath());
	const residentRevision = () => share ? readResidentUserProfileRevision(profileId, pathname) : void 0;
	const key = share ? JSON.stringify([pathname, profileId]) : void 0;
	const pending = key && pendingReaders.get(key);
	if (pending) return pending;
	let context = share ? void 0 : captureOpenClawStateWorkerContext({
		...options,
		path: options.database?.path ?? pathname
	});
	const readContext = context ?? captureOpenClawStateReadContext(pathname);
	let inspection;
	const reader = { inspect() {
		readContext.admission.assertCurrent();
		const revision = residentRevision();
		const cached = revision && avatarCache.get(revision);
		if (cached) {
			if (currentAvatar(cached)) {
				avatarCache.delete(revision);
				avatarCache.set(revision, cached);
				return Promise.resolve({
					...cached,
					isCurrent() {
						readContext.admission.assertCurrent();
						return cached.isCurrent() && revision === residentRevision();
					}
				});
			}
			evictAvatar(revision, cached);
		}
		if (!inspection) {
			if (key) pendingReaders.set(key, reader);
			inspection = inspect().finally(() => {
				inspection = void 0;
				if (key && pendingReaders.get(key) === reader) pendingReaders.delete(key);
			});
		}
		return inspection;
	} };
	async function inspect() {
		const captured = context ??= {
			...captureOpenClawStateWorkerContext({ path: pathname }),
			...readContext
		};
		const location = {
			path: captured.admission.databasePath,
			env: captured.environment
		};
		for (;;) {
			const revision = readUserProfileVersion();
			const row = residentRevision();
			const reply = await readAvatar((signal) => executeExistingOpenClawStateRead(location, {
				type: "userProfiles.avatar.inspect",
				profileId
			}, {
				context: captured,
				current: true,
				signal
			}));
			captured.admission.assertCurrent();
			if (reply && (!reply.ok || reply.type !== "userProfiles.avatar.inspect")) throw new Error("Unexpected profile avatar inspection result");
			if (revision !== readUserProfileVersion()) continue;
			const snapshot = reply?.inspection ?? {
				profile: void 0,
				hasAvatar: false,
				emails: []
			};
			const isCurrent = () => {
				captured.admission.assertCurrent();
				return row ? row === residentRevision() : revision === readUserProfileVersion();
			};
			let bytes;
			const readBytes = async () => {
				const { profile, avatar } = snapshot;
				if (!profile || !avatar || !isCurrent()) return;
				const result = await readAvatar((signal) => executeExistingOpenClawStateRead(location, {
					type: "userProfiles.avatar.read",
					profileId,
					expected: {
						canonicalProfileId: profile.id,
						sha256: avatar.sha256,
						mime: avatar.mime
					}
				}, {
					context: captured,
					current: true,
					signal
				}));
				if (result && (!result.ok || result.type !== "userProfiles.avatar.read")) throw new Error("Unexpected profile avatar materialization result");
				return isCurrent() ? result?.avatar : void 0;
			};
			const prepared = {
				...snapshot,
				isCurrent,
				loadBytes() {
					if (!isCurrent()) return Promise.resolve(void 0);
					return bytes ??= readBytes().then((avatar) => {
						if (!avatar && row && avatarCache.get(row) === prepared) evictAvatar(row, prepared);
						if (!avatar || !row || avatarCache.get(row) !== prepared) bytes = void 0;
						return avatar;
					}, (error) => {
						bytes = void 0;
						throw error;
					});
				}
			};
			if (row && snapshot.avatar && snapshot.profile?.id === row.id && snapshot.avatar.sha256 === row.avatar_sha256 && snapshot.avatar.mime === row.avatar_mime) cacheAvatar(row, prepared);
			return prepared;
		}
	}
	return reader;
}
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
	const { executeOpenClawStateWorker, runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
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
	const [{ withOpenClawStateSettlementRead }, { createSqliteWorkerOperationAdmission }] = await Promise.all([import("./openclaw-state-settlement-read-C9ern2Kr.mjs"), import("./sqlite-worker-operation-admission-C7eEDToM.mjs")]);
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
	}, { createAdmission(retained) {
		return {
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				context.admission.assertCurrent();
				if (request.stage !== "transaction" || !isUserProfileAvatarAdmission(request.facts)) throw new Error("Unexpected profile avatar transaction admission");
				const beforeProfile = request.facts.before;
				const publication = retainUserProfileMutationPublication(context.admission.identity, [[beforeProfile.id, beforeProfile]]);
				try {
					settlementRead.bind({
						type: "userProfiles.reconcile",
						profileId: beforeProfile.id
					}, retained.settled, (observed) => publication.reconcile([[beforeProfile.id, observed]]), publication.release);
				} catch (error) {
					publication.release();
					throw error;
				}
				grant();
			})
		};
	} }));
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
	return {
		...toUserProfile(profile),
		emails: selectUserProfileEmails(db, profileId),
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
	const database = openOpenClawStateDatabase(options);
	ensureUserProfilesSchema(options, database);
	const { db } = database;
	return selectUserProfileListItemById(db, requireResolvedUserProfileMetadataById(db, profileId).id);
}
/** Reads the role assigned to an existing profile's current merge head. */
function getUserProfileRole(profileId, options = {}) {
	ensureUserProfileRoleSchema(options);
	const { db } = openOpenClawStateDatabase(options);
	return requireResolvedUserProfileMetadataById(db, profileId).role ?? null;
}
function ensureProfileForEmailWithInitialName(email, initialDisplayName, options) {
	const normalizedEmail = normalizeProfileEmail(email);
	ensureUserProfilesSchema(options);
	const { db: reader } = openOpenClawStateDatabase(options);
	const assertBinding = (database) => {
		if (options.expectedGitHubAccountId !== void 0) assertGitHubEmailIdentityBinding(database, normalizedEmail, options.expectedGitHubAccountId);
	};
	const selectExistingProfile = (database) => {
		assertBinding(database);
		const alias = selectUserProfileEmailAlias(database, normalizedEmail);
		return alias ? toUserProfile(requireResolvedUserProfileMetadataById(database, alias.profile_id)) : void 0;
	};
	const found = runSqliteDeferredTransactionSync(reader, () => selectExistingProfile(reader));
	if (found) return found;
	const now = Date.now();
	return runUserProfileWriteTransaction(({ db }) => {
		assertBinding(db);
		return ensureProfileForEmailInDatabase(db, normalizedEmail, initialDisplayName, now, options.mutation);
	}, options, { operationLabel: "user-profiles.ensure" });
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
//#endregion
export { getUserProfileRole as a, selectUserProfileListItemById as c, listProfiles as d, readUserProfileDirectory as f, getUserProfileListItem as i, adoptTailscaleProfileAvatar as l, resolveCanonicalCachedGitHubIdentity as m, ensureProfileForEmail as n, normalizeInitialDisplayName as o, readUserProfileSnapshot as p, ensureProfileForTailscaleIdentity as r, resolveUserProfileId as s, ensureGatewayOwnerProfile as t, createProfileAvatarReader as u };
