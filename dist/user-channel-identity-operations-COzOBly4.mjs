import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { n as getActiveOpenClawStateDatabaseReadSnapshot, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { B as publishUserProfileAliasChange, F as emitUserProfilesChanged, I as fenceUserProfileMutationAuthority, N as captureUserProfileAuthorityRead, T as UserProfileOwnerError, w as UserProfileNotFoundError } from "./user-profiles-internal-DlO1LBbo.mjs";
import { i as configuredCommandOwnerPolicyFingerprint, l as readConfiguredCommandOwnerPolicy, n as UserChannelIdentityConflictError, p as userChannelIdentitySubject, u as resolveUserChannelAuthorizationPolicy } from "./user-channel-identities-B5nWYNy7.mjs";
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
	if (!reply.ok || reply.type !== "userProfiles.channelIdentity.list") throw new Error("Channel identity reader returned an unexpected result");
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
				if (request.stage === "commit" && captured.action !== "authorize") fence ??= fenceUserProfileMutationAuthority(context.admission, {
					profiles: request.facts.profiles,
					identities: [],
					channels: request.facts.channels
				});
				grant();
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
	if (!reply.ok || reply.type !== "operator.channelPolicy") throw new Error("Configured command owner reader returned an unexpected result");
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
		if (!reply.ok || reply.type !== "userProfiles.channelIdentity.resolve") throw new Error("Channel authority reader returned an unexpected result");
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
	return prepareUserProfileAuthority(profileId, options, "authority");
}
async function prepareUserProfileSelectionAuthority(profileId, options = {}) {
	const prepared = await prepareUserProfileAuthority(profileId, options, "identity");
	return prepared && {
		profileId: prepared.profileId,
		isCurrent: prepared.isCurrent
	};
}
async function prepareUserProfileAuthority(profileId, options, dependency) {
	const context = captureAuthorityContext(options);
	for (let attempt = 0; attempt < 3; attempt += 1) {
		const read = await captureUserProfileAuthorityRead(context.admission, void 0, dependency);
		const reply = await executeExistingOpenClawStateRead({
			path: context.admission.databasePath,
			env: context.environment
		}, {
			type: "userProfiles.authority.resolve",
			profileId
		});
		context.admission.assertCurrent();
		if (!reply) return;
		if (!reply.ok || reply.type !== "userProfiles.authority.resolve") throw new Error("Profile authority reader returned an unexpected result");
		if (!reply.profile) return;
		const isCurrent = read.bind([profileId, reply.profile.profileId]);
		if (isCurrent) return {
			...reply.profile,
			isCurrent
		};
	}
	throw new Error("Profile authority changed while preparing the administrative request");
}
//#endregion
export { prepareUserChannelIdentityAuthority as a, publishCanonicalUserChannelPolicy as c, prepareConfiguredCommandOwnerAuthority as i, changeCanonicalUserChannelIdentity as n, prepareUserProfileRoleAuthority as o, listCanonicalUserChannelIdentities as r, prepareUserProfileSelectionAuthority as s, authorizeCanonicalUserChannelIdentity as t };
