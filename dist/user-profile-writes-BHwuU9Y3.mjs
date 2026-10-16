import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { B as publishUserProfileAliasChange, C as UserProfileMergeError, F as emitUserProfilesChanged, I as fenceUserProfileMutationAuthority, T as UserProfileOwnerError, k as isUserProfileMutationPublication, w as UserProfileNotFoundError } from "./user-profiles-internal-DlO1LBbo.mjs";
import { m as retainUserProfileMutationPublication } from "./user-profile-list-CtETKur7.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/state/user-profile-writes.ts
function unwrap(result) {
	if (result.ok) return result.value;
	if (result.kind === "not-found") throw new UserProfileNotFoundError(result.profileId);
	if (result.kind === "merge") throw new UserProfileMergeError(result.message);
	throw new UserProfileOwnerError(result.code);
}
async function write(type, input, options, onCommitted) {
	const context = captureOpenClawStateWorkerContext(options);
	const assertCurrent = options.assertCurrent;
	const captured = structuredClone(input);
	let publicationSettled;
	try {
		return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type,
			input: captured
		}), {
			assertCurrent,
			createAdmission: (operation) => {
				let inTransaction = false;
				const pending = /* @__PURE__ */ new Map();
				const publishCommitted = () => {
					const receipt = admission.committed?.facts;
					if (receipt === void 0) return;
					if (!isRecord(receipt) || receipt.kind !== "user-profile-commits" || !Array.isArray(receipt.publications) || receipt.publications.length === 0 || !receipt.publications.every(isUserProfileMutationPublication)) throw new Error("Profile mutation returned an invalid commit receipt");
					for (const [index, facts] of receipt.publications.entries()) {
						const entry = pending.get(facts.sequence);
						if (!entry || facts.sequence !== index + 1 || !isDeepStrictEqual(entry.facts, facts)) throw new Error("Profile mutation receipt changed its prepared publication");
						if (entry.published) continue;
						entry.publication.reconcile(facts.after, facts.emailBindings, () => {
							if (facts.changes.identities.length || facts.changes.channels.length) publishUserProfileAliasChange();
							entry.published = true;
							entry.fence.settle(true);
							onCommitted?.(facts);
						});
						if (facts.changes.profiles.length && facts.emailBindings.length === 0 && isDeepStrictEqual(facts.before, facts.after)) emitUserProfilesChanged();
					}
				};
				const admission = createSqliteWorkerOperationAdmission((request, grant) => {
					publishCommitted();
					context.admission.assertCurrent();
					assertCurrent?.();
					if (request.stage === "transaction" && isRecord(request.facts) && request.facts.kind === "user-profile-write" && request.facts.operation === type) {
						if (inTransaction) throw new Error("Profile mutation requested overlapping transactions");
						inTransaction = grant();
						return;
					}
					if (!inTransaction || request.stage !== "commit" || !isUserProfileMutationPublication(request.facts) || pending.has(request.facts.sequence)) throw new Error("Profile mutation requires its exact transaction and commit admission");
					const facts = request.facts;
					const entry = {
						facts,
						publication: retainUserProfileMutationPublication(context.admission.identity, facts.before, facts.emailBindings),
						fence: fenceUserProfileMutationAuthority(context.admission, facts.changes),
						granted: false,
						published: false
					};
					pending.set(facts.sequence, entry);
					entry.granted = grant();
					inTransaction = false;
				});
				publicationSettled = operation.settled.then((settlement) => {
					let receiptsValid = false;
					try {
						publishCommitted();
						receiptsValid = true;
					} finally {
						for (const entry of pending.values()) {
							const known = entry.published || !entry.granted || receiptsValid && settlement.kind === "completed";
							if (!entry.published && entry.granted) {
								if (known) entry.publication.reconcile(entry.facts.before, [], () => entry.fence.settle(true));
								else entry.publication.invalidate(() => entry.fence.settle(false));
							}
							entry.fence.settle(known);
							entry.publication.release();
						}
					}
				});
				publicationSettled.catch(() => void 0);
				return {
					admission,
					nativeLocations: [context.admission.databasePath]
				};
			}
		});
	} finally {
		await publicationSettled;
	}
}
async function setCanonicalUserProfileRole(profileId, role, options = {}) {
	const onCommitted = options.onCommitted;
	return unwrap(await write("userProfiles.setRole", {
		profileId,
		role
	}, options, (publication) => {
		for (const [id] of publication.after) onCommitted?.(id);
	}));
}
async function setCanonicalUserProfileDisplayName(profileId, name, options = {}) {
	return unwrap(await write("userProfiles.setDisplayName", {
		profileId,
		name
	}, options));
}
async function setCanonicalUserProfileAvatar(profileId, bytes, mime, options = {}) {
	return unwrap(await write("userProfiles.setAvatar", {
		profileId,
		bytes,
		mime
	}, options));
}
async function linkCanonicalUserProfileEmail(email, targetProfileId, options = {}) {
	return unwrap(await write("userProfiles.linkEmail", {
		email,
		targetProfileId
	}, options));
}
async function mergeCanonicalUserProfiles(sourceProfileId, targetProfileId, options = {}) {
	return unwrap(await write("userProfiles.merge", {
		sourceProfileId,
		targetProfileId
	}, options, (publication) => {
		if (publication.changes.profiles.length) options.onCommitted?.(publication.changes.profiles);
	}));
}
async function ensureCanonicalUserProfileForEmail(email, options = {}) {
	const { expectedGitHubAccountId, ...writeOptions } = options;
	return unwrap(await write("userProfiles.ensureEmail", {
		email,
		expectedGitHubAccountId
	}, writeOptions));
}
async function ensureCanonicalUserProfileForTailscaleIdentity(identity, options = {}) {
	return unwrap(await write("userProfiles.ensureTailscale", identity, options));
}
async function syncCanonicalGitHubIdentity(input, options = {}) {
	return unwrap(await write("userProfiles.syncGitHub", input, options));
}
async function ensureCanonicalGatewayOwnerProfile(displayName, options = {}) {
	return unwrap(await write("userProfiles.ensureOwner", { displayName }, options));
}
//#endregion
export { mergeCanonicalUserProfiles as a, setCanonicalUserProfileRole as c, linkCanonicalUserProfileEmail as i, syncCanonicalGitHubIdentity as l, ensureCanonicalUserProfileForEmail as n, setCanonicalUserProfileAvatar as o, ensureCanonicalUserProfileForTailscaleIdentity as r, setCanonicalUserProfileDisplayName as s, ensureCanonicalGatewayOwnerProfile as t };
