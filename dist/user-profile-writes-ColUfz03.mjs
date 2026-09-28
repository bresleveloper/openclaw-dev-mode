import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { A as emitUserProfilesChanged, E as isUserProfileMutationPublication, F as publishUserProfileAliasChange, S as UserProfileOwnerError, j as fenceUserProfileMutationAuthority, x as UserProfileNotFoundError } from "./user-profiles-internal-BxQLnWfo.mjs";
import { u as retainUserProfileMutationPublication } from "./user-profile-list-B5pNqyXa.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/state/user-profile-writes.ts
function unwrap(result) {
	if (result.ok) return result.value;
	if (result.kind === "not-found") throw new UserProfileNotFoundError(result.profileId);
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
async function linkCanonicalUserProfileEmail(email, targetProfileId, options = {}) {
	return unwrap(await write("userProfiles.linkEmail", {
		email,
		targetProfileId
	}, options));
}
async function ensureCanonicalUserProfileForEmail(email, options = {}) {
	return unwrap(await write("userProfiles.ensureEmail", { email }, options));
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
export { setCanonicalUserProfileRole as a, linkCanonicalUserProfileEmail as i, ensureCanonicalUserProfileForEmail as n, syncCanonicalGitHubIdentity as o, ensureCanonicalUserProfileForTailscaleIdentity as r, ensureCanonicalGatewayOwnerProfile as t };
