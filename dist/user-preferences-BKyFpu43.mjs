import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { o as fenceUserProfileMutationAuthority } from "./user-profile-events-CXjmX5Qy.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { a as updatesGitCoauthorPreference, c as captureUserPreferenceRead, s as beginUserPreferenceMutation } from "./user-preferences.store-BkUaBz4r.mjs";
import { t as prepareUserPreferenceUpdate } from "./user-preferences.validation-a7nZkzJ_.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/state/user-preferences.ts
/** Read one preference for a canonical profile batch without opening SQLite on the caller. */
async function getUserPreferenceValues(profileIds, key, options = {}) {
	if (profileIds.length === 0) return {
		values: /* @__PURE__ */ new Map(),
		isCurrent: () => true
	};
	const ids = [...new Set(profileIds)];
	const context = captureOpenClawStateReadWorkerContext(options);
	const isCurrent = await captureUserPreferenceRead(context.admission);
	return {
		values: (await executeExistingOpenClawStateRead({
			path: context.admission.databasePath,
			env: context.environment
		}, {
			type: "userPreferences.values",
			profileIds: ids,
			key
		}, {
			context,
			current: true
		}))?.values ?? /* @__PURE__ */ new Map(),
		isCurrent
	};
}
async function getCanonicalUserPreferences(profileId, keys, options = {}) {
	const context = captureOpenClawStateReadWorkerContext(options);
	for (;;) {
		const isCurrent = await captureUserPreferenceRead(context.admission);
		const reply = await executeExistingOpenClawStateRead({
			path: context.admission.databasePath,
			env: context.environment
		}, {
			type: "userPreferences.read",
			profileId,
			keys
		}, {
			context,
			current: true
		});
		if (isCurrent()) return reply?.preferences;
	}
}
async function setCanonicalUserPreferences(profileId, entries, options = {}) {
	const prepared = prepareUserPreferenceUpdate(entries, options.expectedEntries);
	if (!prepared.ok) return prepared;
	const context = captureOpenClawStateWorkerContext(options);
	const finishMutation = beginUserPreferenceMutation(context.admission);
	let publicationSettled;
	try {
		return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "userPreferences.write",
			input: {
				profileId,
				update: prepared.value
			}
		}), {
			assertCurrent: options.assertCurrent,
			createAdmission: (operation) => {
				let pending;
				const admission = createSqliteWorkerOperationAdmission((request, grant) => {
					context.admission.assertCurrent();
					options.assertCurrent?.();
					if (request.stage === "transaction") {
						grant();
						return;
					}
					if (request.stage !== "commit") throw new Error("Profile preference mutation requires transaction admission");
					if (request.facts === void 0) {
						grant();
						return;
					}
					if (!updatesGitCoauthorPreference(prepared.value) || !isRecord(request.facts) || request.facts.kind !== "user-preference-coauthor" || typeof request.facts.profileId !== "string" || request.facts.profileId.length === 0) throw new Error("Profile preference mutation returned invalid authority facts");
					const facts = {
						kind: "user-preference-coauthor",
						profileId: request.facts.profileId
					};
					pending = {
						facts,
						fence: fenceUserProfileMutationAuthority(context.admission, {
							profiles: [facts.profileId],
							identities: [],
							channels: []
						}),
						granted: false
					};
					pending.granted = grant();
				});
				publicationSettled = operation.settled.then((settlement) => {
					let committed = false;
					let receiptValid = false;
					try {
						const receipt = admission.committed;
						if (receipt) {
							if (!pending || !isDeepStrictEqual(receipt.facts, pending.facts)) throw new Error("Profile preference receipt changed its prepared mutation");
							committed = true;
						}
						receiptValid = true;
					} finally {
						pending?.fence.settle(!pending.granted || committed || receiptValid && settlement.kind === "completed");
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
		try {
			await publicationSettled;
		} finally {
			finishMutation();
		}
	}
}
//#endregion
export { getUserPreferenceValues as n, setCanonicalUserPreferences as r, getCanonicalUserPreferences as t };
