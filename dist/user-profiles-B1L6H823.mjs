import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import "./worker-task-pool-D6ogd941.mjs";
import { i as getExistingOpenClawStateSchemaPath } from "./openclaw-state-db-schema-policy-CuEyLsE2.mjs";
import { r as captureOpenClawStateWorkerContext, t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { i as openOpenClawStateDatabase } from "./openclaw-state-db-BtDOU_3j.mjs";
import { c as onUserProfilesChanged, d as publishUserProfileAuthorityChange, g as readUserProfileVersion } from "./user-profile-events-CXjmX5Qy.mjs";
import { i as USER_PROFILE_AVATAR_MIME_TYPES, r as MAX_USER_PROFILE_AVATAR_BYTES } from "./avatar-limits-2506OuP3.mjs";
import { D as ensureUserProfilesSchema, S as userProfilesDb, g as selectUserProfileEmailAlias, i as insertUserProfile, k as runUserProfileWriteTransaction, u as requireResolvedUserProfileMetadataById, w as UserProfileNotFoundError, y as toUserProfile } from "./user-profiles-internal-CBUpoSHj.mjs";
import { d as assertGitHubEmailIdentityBinding, f as githubAuthenticationSubject, t as profileCatalogPath } from "./user-profile-identity.read-DXpuvx74.mjs";
import { h as readResidentUserProfileRevision, u as publishUserProfilesChange, y as retainUserProfileMutationPublication } from "./user-profile-list-BdNJnrJe.mjs";
import { m as classifyTailscaleLogin } from "./user-channel-identities-B1CU1eh6.mjs";
import "./user-profile-reads-DnSqXcRI.mjs";
import { n as readGatewayOwnerProfileForEnsure, t as ensureGatewayOwnerProfileRow } from "./user-profiles-owner-Bd0MrmUU.mjs";
import { n as normalizeProfileEmail, t as ensureProfileForEmailInDatabase } from "./user-profile-email.kernel-DfJegdRL.mjs";
import pLimit from "p-limit";
//#region src/state/user-profile-display-validation.ts
function isProfileDisplayRow(value) {
	return isRecord(value) && typeof value.id === "string" && typeof value.updated_at === "number" && (value.has_avatar === 0 || value.has_avatar === 1) && [
		"display_name",
		"avatar_mime",
		"avatar_sha256",
		"merged_into"
	].every((key) => value[key] === null || typeof value[key] === "string") && (value.role === void 0 || value.role === null || typeof value.role === "string") && (value.githubAccountIds === void 0 || Array.isArray(value.githubAccountIds) && value.githubAccountIds.every((id) => Number.isSafeInteger(id) && id > 0));
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
		const [{ readRemoteMediaBuffer }, { fileTypeFromBuffer }] = await Promise.all([import("./fetch-DP1DciIi.mjs"), import("file-type")]);
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
const avatarBytes = /* @__PURE__ */ new WeakMap();
let avatarCacheBytes = 0;
function evictAvatar(revision, avatar) {
	avatarCache.delete(revision);
	if (avatarBytes.get(avatar)?.settled) avatarBytes.delete(avatar);
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
				return isCurrent() ? result?.avatar : void 0;
			};
			const prepared = {
				...snapshot,
				isCurrent,
				loadBytes() {
					if (!isCurrent()) return Promise.resolve(void 0);
					const cached = avatarBytes.get(prepared);
					if (cached) return cached.promise;
					const bytes = {
						promise: readBytes().then((avatar) => {
							bytes.settled = true;
							if (!avatar && row && avatarCache.get(row) === prepared) evictAvatar(row, prepared);
							if (!avatar || !row || avatarCache.get(row) !== prepared) avatarBytes.delete(prepared);
							return avatar;
						}, (error) => {
							avatarBytes.delete(prepared);
							throw error;
						}),
						settled: false
					};
					avatarBytes.set(prepared, bytes);
					return bytes.promise;
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
	const { executeOpenClawStateWorker, runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
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
	const { createSqliteWorkerOperationAdmission } = await import("./sqlite-worker-operation-admission-DJeEhCu0.mjs");
	let publication;
	let admission;
	try {
		return await runOpenClawStateWorkerOperation(context, async (scope) => {
			return requireAvatarProfile((await scope.execute({
				type: "userProfiles.avatar.adopt",
				input: {
					profileId,
					bytes: avatar.bytes,
					mime: avatar.mime,
					now: Date.now()
				}
			})).profile, profileId);
		}, { createAdmission() {
			let canonicalProfileId;
			admission = createSqliteWorkerOperationAdmission((request, grant) => {
				context.admission.assertCurrent();
				if (request.stage === "transaction" && isUserProfileAvatarAdmission(request.facts)) {
					const beforeProfile = request.facts.before;
					canonicalProfileId = beforeProfile.id;
					publication = retainUserProfileMutationPublication(context.admission.identity, [[beforeProfile.id, beforeProfile]]);
					grant();
					return;
				}
				if (request.stage !== "commit" || !isProfileDisplayRow(request.facts) || request.facts.id !== canonicalProfileId) throw new Error("Unexpected profile avatar commit admission");
				grant();
			});
			return {
				nativeLocations: [context.admission.databasePath],
				admission
			};
		} });
	} finally {
		try {
			const committed = admission?.committed?.facts;
			if (publication && isProfileDisplayRow(committed)) publication.reconcile([[committed.id, committed]]);
		} finally {
			publication?.release();
		}
	}
}
//#endregion
//#region src/state/user-profiles.ts
function normalizeInitialDisplayName(name) {
	const normalized = name?.trim();
	return normalized ? truncateUtf16Safe(normalized, 256) : null;
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
export { adoptTailscaleProfileAvatar as a, normalizeInitialDisplayName as i, ensureProfileForEmail as n, createProfileAvatarReader as o, ensureProfileForTailscaleIdentity as r, ensureGatewayOwnerProfile as t };
