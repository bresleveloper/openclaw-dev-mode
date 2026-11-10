import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as getActiveOpenClawStateDatabaseReadSnapshot, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { g as readUserProfileVersion, i as emitUserProfilesChanged, n as captureUserProfileAuthorityRead, o as fenceUserProfileMutationAuthority, u as publishUserProfileAliasChange } from "./user-profile-events-CXjmX5Qy.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { T as UserProfileOwnerError, w as UserProfileNotFoundError } from "./user-profiles-internal-CBUpoSHj.mjs";
import { m as readResidentUserProfileIdentity, n as getResidentUserProfileDisplay, o as isUserProfileCatalogReady } from "./user-profile-list-BdNJnrJe.mjs";
import { i as configuredCommandOwnerPolicyFingerprint, l as readConfiguredCommandOwnerPolicy, n as UserChannelIdentityConflictError, p as userChannelIdentitySubject, u as resolveUserChannelAuthorizationPolicy } from "./user-channel-identities-B1CU1eh6.mjs";
//#region src/state/user-channel-identity-operations.ts
function captureAuthorityContext(options) {
	if (getActiveOpenClawStateDatabaseReadSnapshot(options)) throw new Error("Profile authority requires live state, not a discovery snapshot");
	return captureOpenClawStateWorkerContext(options);
}
function unwrapIdentityResult(result, profileId) {
	if (result.ok) return result.value;
	switch (result.kind) {
		case "conflict": throw new UserChannelIdentityConflictError();
		case "not-found": throw new UserProfileNotFoundError(profileId);
		case "owner": throw new UserProfileOwnerError(result.code);
	}
	throw new Error("Unsupported channel identity result");
}
async function listCanonicalUserChannelIdentities(profileId, options = {}) {
	const reply = await executeExistingOpenClawStateRead(options, {
		type: "userProfiles.channelIdentity.list",
		profileId
	});
	if (!reply) return [];
	return unwrapIdentityResult(reply.result, profileId);
}
async function changeIdentity(input, options = {}) {
	const captured = structuredClone(input);
	const subject = "identity" in captured ? userChannelIdentitySubject(captured.identity) : void 0;
	const assertCurrent = options.assertCurrent;
	const context = captureOpenClawStateWorkerContext(options);
	return unwrapIdentityResult(await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "userProfiles.channelIdentity.change",
		input: captured
	}), {
		assertCurrent,
		createAdmission: (operation) => {
			let fence;
			const admission = createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "transaction" && request.stage !== "commit" || !isRecord(request.facts) || request.facts.kind !== "channel-identity" || request.facts.action !== captured.action || request.facts.subject !== subject || !Array.isArray(request.facts.profiles) || !request.facts.profiles.every((profileId) => typeof profileId === "string") || !Array.isArray(request.facts.channels) || !request.facts.channels.every((channel) => typeof channel === "string")) throw new Error("Channel identity mutation requires exact transaction admission");
				context.admission.assertCurrent();
				assertCurrent?.();
				if (request.stage === "commit" && captured.action !== "authorize") {
					const { profiles, channels } = request.facts;
					if (!grant(() => {
						fence = fenceUserProfileMutationAuthority(context.admission, {
							profiles,
							identities: [],
							channels
						});
					})) {
						fence?.settle(true);
						fence = void 0;
					}
				} else grant();
			});
			operation.settled.then((settlement) => {
				const committed = admission.committed;
				if (captured.action !== "authorize" && committed && isRecord(committed.facts) && committed.facts.kind === "channel-identity" && committed.facts.subject === subject) {
					publishUserProfileAliasChange();
					emitUserProfilesChanged();
				}
				fence?.settle(settlement.kind !== "unknown");
			});
			return {
				admission,
				nativeLocations: [context.admission.databasePath]
			};
		}
	}), "profileId" in captured ? captured.profileId : "");
}
async function changeCanonicalUserChannelIdentity(action, profileId, identity, options = {}) {
	const result = await changeIdentity({
		action,
		profileId,
		identity
	}, options);
	if (result.kind !== "linked" && result.kind !== "unlinked") throw new Error("Unexpected channel identity change");
	return result;
}
async function publishCanonicalUserChannelPolicy(gateway, configuredOwners) {
	await changeIdentity({
		action: "policy",
		policy: resolveUserChannelAuthorizationPolicy(gateway),
		configuredOwnersHash: configuredCommandOwnerPolicyFingerprint(configuredOwners)
	});
}
/** The existing policy publication fence qualifies this read without inventing a person link. */
async function prepareConfiguredCommandOwnerAuthority(owners, options = {}) {
	const fingerprint = configuredCommandOwnerPolicyFingerprint(owners);
	if (!fingerprint) return;
	const context = captureAuthorityContext(options);
	const read = await captureUserProfileAuthorityRead(context.admission, "operator.channelPolicy");
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, { type: "operator.channelPolicy" });
	context.admission.assertCurrent();
	if (!reply) return;
	const recoveryReference = reply.row && readConfiguredCommandOwnerPolicy(JSON.parse(reply.row.value_json), fingerprint);
	if (!recoveryReference) return;
	const isCurrent = read.bind([]);
	if (!isCurrent) throw new Error("Configured command owner policy changed during preparation");
	return {
		recoveryReference,
		isCurrent
	};
}
async function authorizeCanonicalUserChannelIdentity(input, options) {
	const result = await changeIdentity(input, options);
	if (result.kind !== "authorized") throw new Error("Unexpected channel authorization result");
	return result.reference;
}
/** Qualify worker-read facts against the same physical profile owner's mutation lifetime. */
async function prepareUserChannelIdentityAuthority(identity, options = {}) {
	const capturedIdentity = structuredClone(identity);
	const subject = "authorizationId" in capturedIdentity ? void 0 : userChannelIdentitySubject(capturedIdentity);
	const context = captureAuthorityContext(options);
	for (let attempt = 0; attempt < 3; attempt += 1) {
		const read = await captureUserProfileAuthorityRead(context.admission, subject);
		const reply = await executeExistingOpenClawStateRead({
			path: context.admission.databasePath,
			env: context.environment
		}, {
			type: "userProfiles.channelIdentity.resolve",
			identity: capturedIdentity
		});
		context.admission.assertCurrent();
		if (!reply) return;
		if (!reply.linked) return;
		const isCurrent = read.bind(reply.linked.profileId, reply.linked.authorization?.subject ?? subject);
		if (isCurrent) return {
			linked: reply.linked,
			isCurrent
		};
	}
	throw new Error("Profile authority changed while preparing the channel request");
}
async function prepareUserProfileRoleAuthority(profileId, options = {}) {
	return prepareUserProfileAuthority(profileId, options, "authority", options.includeProfile);
}
/** Reuse retained canonical role facts; standalone callers read existing storage off-thread. */
async function prepareUserProfileRolePolicyAuthority(profileId, options = {}) {
	return prepareUserProfileAuthorityRead(profileId, options, "authority", async (context) => {
		const source = { path: context.admission.databasePath };
		if (isUserProfileCatalogReady(source.path)) {
			const profile = readResidentUserProfileIdentity(profileId, source);
			return profile && {
				profileId: profile.profileId,
				role: profile.role,
				githubLogin: profile.githubLogin ?? null
			};
		}
		return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "userProfiles.roleAuthority.resolve",
			input: { profileId }
		}), { existingOnly: true });
	});
}
async function prepareUserProfileSelectionAuthority(profileId, options = {}) {
	const prepared = await prepareUserProfileAuthority(profileId, options, "identity");
	return prepared && {
		profileId: prepared.profileId,
		isCurrent: prepared.isCurrent
	};
}
async function prepareUserProfileAuthority(profileId, options, dependency, includeProfile) {
	return prepareUserProfileAuthorityRead(profileId, options, dependency, async (context) => {
		const source = { path: context.admission.databasePath };
		if (!includeProfile && isUserProfileCatalogReady(source.path)) {
			const profile = readResidentUserProfileIdentity(profileId, source);
			return profile && {
				...profile,
				aliases: [profile.profileId, ...[...profile.aliases].filter((id) => id !== profile.profileId).toSorted()],
				display: getResidentUserProfileDisplay(profile.profileId, source)
			};
		}
		const reply = await executeExistingOpenClawStateRead({
			path: context.admission.databasePath,
			env: context.environment
		}, {
			type: "userProfiles.authority.resolve",
			profileId,
			...includeProfile ? { includeProfile } : {}
		});
		if (!reply) return;
		return reply.profile;
	}, includeProfile);
}
async function prepareUserProfileAuthorityRead(profileId, options, dependency, readProfile, includeProfile) {
	const context = captureAuthorityContext(options);
	for (let attempt = 0; attempt < 3; attempt += 1) {
		const read = await captureUserProfileAuthorityRead(context.admission, void 0, dependency);
		const profileRevision = readUserProfileVersion();
		const profile = await readProfile(context);
		context.admission.assertCurrent();
		if (!profile) return;
		if (includeProfile && profileRevision !== readUserProfileVersion()) continue;
		const sourceProfiles = [profileId, profile.profileId];
		const isCurrent = read.bind(sourceProfiles);
		if (isCurrent) return {
			...profile,
			isCurrent: includeProfile ? () => isCurrent() && profileRevision === readUserProfileVersion() : isCurrent,
			readSource: () => {
				read.assertSettled(sourceProfiles);
				return {
					path: context.admission.databasePath,
					env: context.environment
				};
			}
		};
	}
	throw new Error("Profile authority changed while preparing the administrative request");
}
//#endregion
export { prepareUserChannelIdentityAuthority as a, prepareUserProfileSelectionAuthority as c, prepareConfiguredCommandOwnerAuthority as i, publishCanonicalUserChannelPolicy as l, changeCanonicalUserChannelIdentity as n, prepareUserProfileRoleAuthority as o, listCanonicalUserChannelIdentities as r, prepareUserProfileRolePolicyAuthority as s, authorizeCanonicalUserChannelIdentity as t };
