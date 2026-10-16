import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { i as USER_PROFILE_AVATAR_MIME_TYPES, r as MAX_USER_PROFILE_AVATAR_BYTES } from "./avatar-limits-2506OuP3.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { A as runUserProfileWriteTransaction, B as publishUserProfileAliasChange, C as UserProfileMergeError, D as ensureUserProfilesSchema, E as ensureUserProfileRoleSchema, H as publishUserProfileIdentityChange, S as userProfilesDb, T as UserProfileOwnerError, V as publishUserProfileAuthorityChange, a as inspectProfileAvatarInDatabase, c as projectUserProfileDisplay, g as selectUserProfileEmailAlias, i as insertUserProfile, l as requireResolvedUserProfileById, m as selectResolvedUserProfileById, u as requireResolvedUserProfileMetadataById, v as setUserProfileEmailBinding, w as UserProfileNotFoundError, y as toUserProfile } from "./user-profiles-internal-DlO1LBbo.mjs";
import { s as mergeUserModelAccounts } from "./user-model-accounts-sYn17idc.mjs";
import { n as ensureUserPreferencesSchema, r as mergeUserPreferences } from "./user-preferences.store-B-q7i2eZ.mjs";
import { C as githubAuthenticationSubject, D as selectProfileAccessEntries, O as selectStoredGitHubIdentities, T as prepareUserProfileGitHubMerge, b as readUserProfileSnapshotSync, g as listUserProfilesSync, h as stageUserProfileCatalogChange, s as publishUserProfilesChange, x as applyVerifiedGitHubIdentity, y as readUserProfileEmailBindings } from "./user-profile-list-CtETKur7.mjs";
import { n as normalizeProfileEmail } from "./user-profile-email.kernel-x_-pE-8u.mjs";
import { c as selectUserProfileListItemById, n as ensureProfileForEmail, o as normalizeInitialDisplayName, r as ensureProfileForTailscaleIdentity, t as ensureGatewayOwnerProfile } from "./user-profiles-DYQbtiqy.mjs";
import { a as linkUserChannelIdentity, c as publishUserChannelPolicyInDatabase, f as unlinkUserChannelIdentity, n as UserChannelIdentityConflictError, p as userChannelIdentitySubject, r as authorizeUserChannelIdentityInDatabase, t as CHANNEL_IDENTITY_PROVIDER } from "./user-channel-identities-B5nWYNy7.mjs";
import { i as mergeUserGitHubConnection } from "./user-github-connections-spLT1Bzo.mjs";
import { createHash } from "node:crypto";
//#region src/state/user-channel-identities.worker.ts
function readUserChannelIdentityResult(operation) {
	try {
		return {
			ok: true,
			value: operation()
		};
	} catch (error) {
		if (error instanceof UserChannelIdentityConflictError) return {
			ok: false,
			kind: "conflict"
		};
		if (error instanceof UserProfileNotFoundError) return {
			ok: false,
			kind: "not-found"
		};
		if (error instanceof UserProfileOwnerError) return {
			ok: false,
			kind: "owner",
			code: error.code
		};
		throw error;
	}
}
function executeUserChannelIdentityChange(input, options) {
	const subject = "identity" in input ? userChannelIdentitySubject(input.identity) : void 0;
	const facts = {
		kind: "channel-identity",
		action: input.action,
		subject,
		profiles: [],
		channels: subject === void 0 ? [] : [subject]
	};
	let changed = false;
	const mutationOptions = {
		...options,
		beforeChange() {
			changed = true;
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts
			});
		}
	};
	if (input.action !== "policy") ensureUserProfilesSchema(options);
	return readUserChannelIdentityResult(() => runOpenClawStateWriteTransaction(({ db }) => {
		if (input.action === "policy" || input.action === "authorize") mutationOptions.beforeChange();
		if (input.action === "policy") Object.assign(facts, publishUserChannelPolicyInDatabase(db, input.policy, input.configuredOwnersHash));
		const value = input.action === "policy" ? { kind: "policy" } : input.action === "authorize" ? {
			kind: "authorized",
			reference: authorizeUserChannelIdentityInDatabase(db, input)
		} : input.action === "link" ? {
			kind: "linked",
			link: linkUserChannelIdentity(input.profileId, input.identity, mutationOptions)
		} : {
			kind: "unlinked",
			removed: unlinkUserChannelIdentity(input.profileId, input.identity, mutationOptions)
		};
		if (changed) {
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts
			});
			deferSqliteWorkerCommitReceipt(db, facts);
		}
		return value;
	}, options, { operationLabel: "user-profiles.channel-identity-change" }));
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
//#region src/state/user-profile-writes.worker.ts
function createUserProfileWriteOperation(type, write, targetProfileId) {
	return (input, { open, stateOptions }) => {
		const options = {
			...stateOptions(),
			database: open()
		};
		const target = targetProfileId?.(input);
		let pending;
		let sequence = 0;
		const committed = [];
		let linkedDisplay;
		const mutation = {
			runTransaction(db, operation) {
				if (pending) return operation();
				const current = {
					before: /* @__PURE__ */ new Map(),
					emailBindings: /* @__PURE__ */ new Map(),
					display: /* @__PURE__ */ new Set(),
					profiles: /* @__PURE__ */ new Set(),
					identities: /* @__PURE__ */ new Set()
				};
				pending = current;
				try {
					requestSqliteWorkerOperationAdmission({
						stage: "transaction",
						facts: {
							kind: "user-profile-write",
							operation: type
						}
					});
					const value = operation();
					if (target !== void 0) {
						const linked = requireResolvedUserProfileMetadataById(db, target);
						const row = selectProfileAccessEntries(db, [linked.id])[0]?.[1];
						if (!row) throw new UserProfileNotFoundError(linked.id);
						linkedDisplay = projectUserProfileDisplay(row);
					}
					const afterBindings = new Map(readUserProfileEmailBindings(db, [...current.before.keys()]).map((binding) => [binding.email, binding]));
					const emailBindings = [.../* @__PURE__ */ new Set([...current.emailBindings.keys(), ...afterBindings.keys()])].flatMap((email) => {
						const before = current.emailBindings.get(email) ?? null;
						const after = afterBindings.get(email) ?? null;
						if (before?.profileId === after?.profileId && before?.bindingId === after?.bindingId) return [];
						for (const binding of [before, after]) if (binding) {
							current.display.add(binding.profileId);
							current.profiles.add(binding.profileId);
						}
						return [{
							email,
							before,
							after
						}];
					});
					const ids = [...current.display];
					const after = new Map(ids.length ? selectProfileAccessEntries(db, ids) : []);
					const publication = {
						kind: "user-profile-mutation",
						sequence: ++sequence,
						changes: {
							profiles: [...current.profiles],
							identities: [...current.identities],
							channels: []
						},
						before: ids.map((id) => {
							if (!current.before.has(id)) throw new Error("Profile publication requires its transaction's original row");
							return [id, current.before.get(id)];
						}),
						after: ids.map((id) => [id, after.get(id)]),
						emailBindings
					};
					requestSqliteWorkerOperationAdmission({
						stage: "commit",
						facts: publication
					});
					deferSqlitePostCommitPublication(db, () => committed.push(publication));
					deferSqliteWorkerCommitReceipt(db, {
						kind: "user-profile-commits",
						publications: [...committed, publication]
					});
					return value;
				} finally {
					pending = void 0;
				}
			},
			before(db, ...ids) {
				const current = pending;
				if (!current) throw new Error("Profile mutation requires its original transaction");
				const missing = ids.filter((id) => !current.before.has(id));
				const rows = new Map(missing.length ? selectProfileAccessEntries(db, missing) : []);
				for (const id of missing) current.before.set(id, rows.get(id));
				for (const binding of readUserProfileEmailBindings(db, missing)) if (!current.emailBindings.has(binding.email)) current.emailBindings.set(binding.email, binding);
			},
			authority: (...ids) => ids.forEach((id) => pending?.profiles.add(id)),
			identity: (...ids) => ids.forEach((id) => pending?.identities.add(id)),
			publish: (...ids) => ids.forEach((id) => pending?.display.add(id))
		};
		const owned = {
			...options,
			mutation
		};
		try {
			return {
				ok: true,
				value: write(input, owned, () => {
					if (!linkedDisplay) throw new Error("Profile mutation publication is unavailable");
					return linkedDisplay;
				})
			};
		} catch (error) {
			if (error instanceof UserProfileNotFoundError) return {
				ok: false,
				kind: "not-found",
				profileId: error.profileId
			};
			if (error instanceof UserProfileMergeError) return {
				ok: false,
				kind: "merge",
				message: error.message
			};
			if (error instanceof UserProfileOwnerError) return {
				ok: false,
				kind: "owner",
				code: error.code
			};
			throw error;
		}
	};
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
/** Explicit administration keeps both selected IDs exact; only an exact repeat may follow a tombstone. */
function mergeProfiles(sourceProfileId, targetProfileId, options = {}) {
	ensureUserProfilesSchema(options);
	return runUserProfileWriteTransaction(({ db }) => {
		const source = requireResolvedUserProfileMetadataById(db, sourceProfileId);
		const target = requireResolvedUserProfileMetadataById(db, targetProfileId);
		if ([
			sourceProfileId,
			targetProfileId,
			source.id,
			target.id
		].includes("gateway-owner")) throw new UserProfileOwnerError("merge");
		if (sourceProfileId === targetProfileId) throw new UserProfileMergeError("source and target profiles must differ");
		if (target.id !== targetProfileId) throw new UserProfileMergeError(`target profile ${targetProfileId} is merged into ${target.id}; choose the current merge head`);
		if (source.id !== sourceProfileId) {
			if (source.id === target.id) return {
				profile: selectUserProfileListItemById(db, target.id),
				movedAliasKinds: []
			};
			throw new UserProfileMergeError(`source profile ${sourceProfileId} is already merged into ${source.id}`);
		}
		const kysely = userProfilesDb(db);
		const cohort = kysely.selectFrom("user_profiles").select("id").where((eb) => eb.or([eb("id", "=", source.id), eb("merged_into", "=", source.id)]));
		const email = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("user_profile_emails").select("email").where("profile_id", "in", cohort).limit(1));
		const identities = executeSqliteQuerySync(db, kysely.selectFrom("user_profile_identities").select((eb) => eb.case().when("provider", "=", CHANNEL_IDENTITY_PROVIDER).then("channel").else("provider").end().as("kind")).distinct().where("profile_id", "in", cohort)).rows;
		const movedAliasKinds = [...email ? ["email"] : [], ...["provider", "channel"].filter((kind) => identities.some((identity) => identity.kind === kind))];
		mergeUserProfiles(db, source.id, target.id, Date.now(), options.mutation);
		publishUserProfilesChange(db, target.id);
		return {
			profile: selectUserProfileListItemById(db, target.id),
			movedAliasKinds
		};
	}, options, { operationLabel: "user-profiles.merge" });
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
		const existingAlias = selectUserProfileEmailAlias(db, normalizedEmail);
		if (existingAlias?.profile_id === "gateway-owner") throw new UserProfileOwnerError("merge");
		if (existingAlias?.profile_id === target.id) return selectUserProfileListItemById(db, target.id);
		const changedIds = [target.id, ...existingAlias ? [existingAlias.profile_id] : []];
		options.mutation?.before(db, ...changedIds);
		setUserProfileEmailBinding(db, normalizedEmail, target.id, now);
		const remainingAliases = existingAlias ? executeSqliteQuerySync(db, kysely.selectFrom("user_profile_emails").select("email").where("profile_id", "=", existingAlias.profile_id)).rows : [];
		executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ updated_at: now }).where("id", "=", target.id));
		if (existingAlias) {
			if (remainingAliases.length === 0) mergeUserProfiles(db, existingAlias.profile_id, target.id, now, options.mutation);
			else executeSqliteQuerySync(db, kysely.updateTable("user_profiles").set({ updated_at: now }).where("id", "=", existingAlias.profile_id));
		}
		options.mutation?.authority(...changedIds);
		publishUserProfileAuthorityChange(db, ...changedIds);
		options.mutation?.publish(...changedIds);
		publishUserProfilesChange(db, ...changedIds);
		return selectUserProfileListItemById(db, target.id);
	}, options, { operationLabel: "user-profiles.link-email" });
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
function setDisplayName(profileId, name, options = {}) {
	const now = Date.now();
	ensureUserProfilesSchema(options);
	return runUserProfileWriteTransaction(({ db }) => {
		const profile = requireResolvedUserProfileMetadataById(db, profileId);
		options.mutation?.before(db, profile.id);
		executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({
			display_name: name,
			updated_at: now
		}).where("id", "=", profile.id));
		options.mutation?.publish(profile.id);
		publishUserProfilesChange(db, profile.id);
		return selectUserProfileListItemById(db, profile.id);
	}, options, { operationLabel: "user-profiles.set-display-name" });
}
function setAvatar(profileId, bytes, mime, options = {}) {
	if (bytes.byteLength > 524288) return err({
		code: "avatar_too_large",
		maxBytes: MAX_USER_PROFILE_AVATAR_BYTES
	});
	if (!USER_PROFILE_AVATAR_MIME_TYPES.some((candidate) => candidate === mime)) return err({
		code: "unsupported_avatar_mime",
		mime
	});
	const now = Date.now();
	ensureUserProfilesSchema(options);
	const value = runUserProfileWriteTransaction(({ db }) => {
		const profile = requireResolvedUserProfileMetadataById(db, profileId);
		options.mutation?.before(db, profile.id);
		const sha256 = createHash("sha256").update(bytes).digest("hex");
		executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({
			avatar: bytes,
			avatar_mime: mime,
			avatar_sha256: sha256,
			updated_at: now
		}).where("id", "=", profile.id));
		options.mutation?.publish(profile.id);
		publishUserProfilesChange(db, profile.id);
		return selectUserProfileListItemById(db, profile.id);
	}, options, { operationLabel: "user-profiles.set-avatar" });
	return ok(value);
}
const userProfileOperations = {
	"userProfiles.setRole": createUserProfileWriteOperation("userProfiles.setRole", (input, owned) => setUserProfileRole(input.profileId, input.role, owned)),
	"userProfiles.linkEmail": createUserProfileWriteOperation("userProfiles.linkEmail", (input, owned, display) => ({
		profile: linkEmail(input.email, input.targetProfileId, owned),
		display: display()
	}), (input) => input.targetProfileId),
	"userProfiles.merge": createUserProfileWriteOperation("userProfiles.merge", (input, owned, display) => ({
		...mergeProfiles(input.sourceProfileId, input.targetProfileId, owned),
		display: display()
	}), (input) => input.targetProfileId),
	"userProfiles.ensureEmail": createUserProfileWriteOperation("userProfiles.ensureEmail", (input, owned) => ensureProfileForEmail(input.email, {
		...owned,
		expectedGitHubAccountId: input.expectedGitHubAccountId
	})),
	"userProfiles.ensureTailscale": createUserProfileWriteOperation("userProfiles.ensureTailscale", (input, owned) => ensureProfileForTailscaleIdentity(input, owned)),
	"userProfiles.syncGitHub": createUserProfileWriteOperation("userProfiles.syncGitHub", (input, owned) => syncGitHubIdentity(input, owned)),
	"userProfiles.ensureOwner": createUserProfileWriteOperation("userProfiles.ensureOwner", (input, owned) => ensureGatewayOwnerProfile(input.displayName, owned)),
	"userProfiles.setDisplayName": createUserProfileWriteOperation("userProfiles.setDisplayName", (input, owned, display) => ({
		profile: setDisplayName(input.profileId, input.name, owned),
		display: display()
	}), (input) => input.profileId),
	"userProfiles.setAvatar": createUserProfileWriteOperation("userProfiles.setAvatar", (input, owned, display) => {
		const result = setAvatar(input.profileId, input.bytes, input.mime, owned);
		return result.ok ? {
			ok: true,
			value: {
				profile: result.value,
				display: display()
			}
		} : result;
	}, (input) => input.profileId),
	"userProfiles.list": (input, { open, stateOptions }) => {
		const options = {
			...stateOptions(),
			database: open()
		};
		return input?.githubAccountIds === void 0 ? { profiles: listUserProfilesSync(options) } : readUserProfileSnapshotSync(options, input.githubAccountIds);
	},
	"userProfiles.directory": ({ limit }, { open, stateOptions }) => {
		const database = open();
		ensureUserProfilesSchema(stateOptions(), database);
		return runSqliteDeferredTransactionSync(database.db, () => {
			const profiles = executeSqliteQuerySync(database.db, userProfilesDb(database.db).selectFrom("user_profiles").select("id").where("merged_into", "is", null).orderBy("created_at", "asc").orderBy("id", "asc").limit(limit + 1)).rows;
			const selected = profiles.slice(0, limit);
			const identities = selectStoredGitHubIdentities(database.db, selected.map(({ id }) => id));
			return {
				profiles: selected.map(({ id }) => ({
					id,
					logins: identities.get(id)?.accounts.map((account) => account.login) ?? []
				})),
				truncated: profiles.length > limit
			};
		}, {
			databaseLabel: database.path,
			operationLabel: "user-profiles.directory"
		});
	},
	"userProfiles.channelIdentity.change": (input, { open, stateOptions }) => executeUserChannelIdentityChange(input, {
		...stateOptions(),
		database: open()
	}),
	"userProfiles.avatar.inspect": ({ profileId }, { open }) => inspectProfileAvatarInDatabase(open().db, profileId),
	"userProfiles.avatar.adopt": (input, { open, stateOptions }) => {
		const sha256 = createHash("sha256").update(input.bytes).digest("hex");
		return runOpenClawStateWriteTransaction(({ db }) => {
			const profile = selectResolvedUserProfileById(db, input.profileId);
			if (!profile) return { profile: void 0 };
			if (profile.avatar !== null) return { profile: toUserProfile(profile) };
			const before = selectProfileAccessEntries(db, [profile.id])[0][1];
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: {
					kind: "profile-avatar",
					before
				}
			});
			executeSqliteQuerySync(db, userProfilesDb(db).updateTable("user_profiles").set({
				avatar: input.bytes,
				avatar_mime: input.mime,
				avatar_sha256: sha256,
				updated_at: input.now
			}).where("id", "=", profile.id));
			const committed = selectProfileAccessEntries(db, [profile.id])[0][1];
			return {
				profile: toUserProfile({
					...profile,
					avatar_mime: input.mime,
					updated_at: input.now
				}),
				committed
			};
		}, {
			...stateOptions(),
			database: open()
		}, { operationLabel: "user-profiles.adopt-avatar" });
	}
};
//#endregion
export { userProfileOperations };
