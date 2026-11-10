import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { G as parseUserModelAuthProfileId, l as withPersonalCredentialPublication } from "./user-model-account-authority-DFFjC5J5.mjs";
import { a as fenceUserProfileModelAccountLinks, n as captureUserProfileAuthorityRead } from "./user-profile-events-CXjmX5Qy.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { p as registerUserModelAuthProfileSecrets } from "./user-model-accounts-CrjNQiMH.mjs";
//#region src/state/user-model-account-operations.ts
function mutationAdmission(context, profileId, assertCurrent, authorityProfileIds = [], credentials = false) {
	const createAdmission = (operation) => {
		let fence;
		const admission = createSqliteWorkerOperationAdmission((request, grant) => {
			if (request.stage !== "transaction" && request.stage !== "commit" || !isRecord(request.facts) || request.facts.kind !== "model-account-links" || request.facts.profileId !== profileId || !Array.isArray(request.facts.roles) || !request.facts.roles.every((role) => isRecord(role) && typeof role.profileId === "string" && (role.role === null || typeof role.role === "string")) || request.facts.roles.length !== authorityProfileIds.length || !request.facts.roles.every((role, index) => role.profileId === authorityProfileIds[index])) throw new Error("Personal account mutation requires exact transaction admission");
			context.admission.assertCurrent();
			assertCurrent(request.facts.roles);
			if (request.stage === "commit") fence ??= fenceUserProfileModelAccountLinks(context.admission, profileId);
			grant();
		});
		operation.settled.then((outcome) => fence?.settle(outcome.kind !== "unknown" || admission.committed !== void 0));
		return {
			admission,
			nativeLocations: [context.admission.databasePath]
		};
	};
	return { createAdmission: credentials ? withPersonalCredentialPublication(createAdmission, context) : createAdmission };
}
function mutate(type, input, assertCurrent, options) {
	const context = options.context ?? captureOpenClawStateWorkerContext(options);
	const captured = structuredClone(input);
	assertCurrent();
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type,
		input: captured
	}), mutationAdmission(context, captured.profileId, assertCurrent, captured.authorityProfileIds));
}
/** Capture explicitly enrolls older credentials through the same admitted personal writer. */
function enrollPersonalAuthProfileAuthorizationAsync(params, options = {}) {
	const locator = parseUserModelAuthProfileId(params.profileId);
	if (!locator) throw new Error("Personal authorization enrollment requires an exact account ID");
	const context = options.context ?? captureOpenClawStateWorkerContext(options);
	params.assertCurrent();
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "userProfiles.modelAccount.enrollAuthorization",
		input: {
			profileId: locator.ownerProfileId,
			authProfileId: params.profileId
		}
	}), {
		existingOnly: true,
		assertCurrent: params.assertCurrent,
		...mutationAdmission(context, locator.ownerProfileId, params.assertCurrent, [], true)
	});
}
/** The provider compares identities before BEGIN; the worker compares the exact current rows. */
function connectUserModelAccountAsync(params, options = {}) {
	const context = options.context ?? captureOpenClawStateWorkerContext(options);
	const credential = structuredClone(params.credential);
	const { ownerProfileId: profileId, assertCurrent, matchesCredential } = params;
	const authorityProfileIds = [...params.authorityProfileIds ?? []];
	assertCurrent();
	return runOpenClawStateWorkerOperation(context, async (scope) => {
		const candidate = await scope.execute({
			type: "userProfiles.modelAccount.selected",
			input: {
				profileId,
				provider: credential.provider
			}
		});
		context.admission.assertCurrent();
		assertCurrent();
		if (candidate) registerUserModelAuthProfileSecrets(candidate.credential);
		const replacement = candidate && matchesCredential?.(structuredClone(candidate.credential)) ? candidate : void 0;
		return scope.execute({
			type: "userProfiles.modelAccount.connect",
			input: {
				profileId,
				credential,
				replacement,
				authorityProfileIds
			}
		});
	}, mutationAdmission(context, profileId, assertCurrent, authorityProfileIds, true));
}
function setUserProfileAuthLinkAsync(params, options = {}) {
	const { assertCurrent, ...input } = params;
	return mutate("userProfiles.modelAccount.link", input, assertCurrent, options);
}
function clearUserProfileAuthLinkAsync(params, options = {}) {
	const { assertCurrent, ...input } = params;
	return mutate("userProfiles.modelAccount.unlink", input, assertCurrent, options);
}
async function read(type, input, options) {
	const context = options.context ?? captureOpenClawStateWorkerContext(options);
	const captured = structuredClone(input);
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type,
		input: captured
	}), { existingOnly: true });
	context.admission.assertCurrent();
	return result;
}
async function listUserModelAccountsAsync(params, options = {}) {
	return await read("userProfiles.modelAccount.list", params, options) ?? { accounts: [] };
}
async function readUserModelAccountSummaryAsync(params, options = {}) {
	const context = options.context ?? captureOpenClawStateReadWorkerContext(options);
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "userModelAccounts.summary",
		...params
	}, {
		context,
		current: true,
		preferIndependentWarmRead: true
	});
	context.admission.assertCurrent();
	return reply?.account;
}
async function readUserModelAccountSelectionAsync(params, options = {}) {
	const context = options.context ?? captureOpenClawStateReadWorkerContext(options);
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "userModelAccounts.selection",
		...params
	}, {
		context,
		current: true,
		preferIndependentWarmRead: true
	});
	context.admission.assertCurrent();
	return reply?.selection;
}
/** Account pins retain the identity writer's authority, independently of default links. */
async function prepareUserModelAccountAuthority(params, options = {}) {
	const { profileId, authProfileId } = params;
	const locator = parseUserModelAuthProfileId(authProfileId);
	if (!locator) return;
	const context = options.context ?? captureOpenClawStateWorkerContext(options);
	for (let attempt = 0; attempt < 3; attempt += 1) {
		const authority = await captureUserProfileAuthorityRead(context.admission, void 0, "identity");
		const account = await readUserModelAccountSummaryAsync({
			profileId,
			authProfileId
		}, { context });
		if (!account) return;
		const isCurrent = authority.bind([profileId, locator.ownerProfileId]);
		if (isCurrent) return {
			provider: account.provider,
			isCurrent
		};
	}
	throw new Error("Personal model account ownership changed while preparing the selection");
}
/** Only provider preparation consumes the private selected credential, never an RPC reply. */
async function readSelectedUserModelAccountAsync(profileId, provider, options = {}) {
	const result = await read("userProfiles.modelAccount.selected", {
		profileId,
		provider
	}, options);
	if (result) registerUserModelAuthProfileSecrets(result.credential);
	return result;
}
//#endregion
export { prepareUserModelAccountAuthority as a, readUserModelAccountSummaryAsync as c, listUserModelAccountsAsync as i, setUserProfileAuthLinkAsync as l, connectUserModelAccountAsync as n, readSelectedUserModelAccountAsync as o, enrollPersonalAuthProfileAuthorizationAsync as r, readUserModelAccountSelectionAsync as s, clearUserProfileAuthLinkAsync as t };
