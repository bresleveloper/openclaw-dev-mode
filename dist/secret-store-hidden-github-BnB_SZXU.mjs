import { i as resolveGlobalSet } from "./global-singleton-DrXvEBww.mjs";
import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { c as normalizeDatabasePath } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { a as classifyHiddenGitHubStoreName, i as assertHiddenGitHubSecretRecordName, o as hiddenGitHubStoreKindFromPrefix, t as assertSecretStoreValueLength } from "./secret-store-value-B2wKejcx.mjs";
//#region src/secrets/store/secret-store-changes.ts
const listeners = resolveGlobalSet(Symbol.for("openclaw.secretStoreChanges"), "close-and-restart");
function subscribeSecretStoreChanges(listener) {
	return registerListener(listeners, listener);
}
function publishSecretStoreChange(databasePath, names) {
	notifyListeners(listeners, {
		databasePath: normalizeDatabasePath(databasePath),
		githubOAuth: names === void 0 || names.some((name) => {
			const kind = classifyHiddenGitHubStoreName(name);
			return kind === "device" || kind === "oauth";
		})
	});
}
/** Unknown outcomes also invalidate maintenance facts; they never authorize credential use. */
function observeSecretStoreMutation(operation, databasePath, names) {
	return operation.finally(() => publishSecretStoreChange(databasePath, names));
}
//#endregion
//#region src/secrets/store/secret-store-hidden-github.ts
/** Writes one hidden GitHub authorization record through its shared-state owner. */
async function writeHiddenGitHubSecretRecord(params) {
	assertHiddenGitHubSecretRecordName(params.name);
	assertSecretStoreValueLength(params.value, "secret");
	const context = captureOpenClawStateWorkerContext(params.database);
	await observeSecretStoreMutation(runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "githubSecrets.write",
		input: {
			name: params.name,
			value: params.value,
			updatedBy: params.updatedBy,
			now: Date.now()
		}
	})), context.admission.databasePath, [params.name]);
	registerSecretValueForRedaction(params.value);
}
/** Reads one exact live hidden GitHub authorization record. */
async function readHiddenGitHubSecretRecord(params) {
	assertHiddenGitHubSecretRecordName(params.name);
	const context = captureOpenClawStateReadWorkerContext(params.database);
	const value = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "githubSecrets.read",
		input: {
			name: params.name,
			now: Date.now()
		}
	}), { existingOnly: true });
	if (value !== void 0) registerSecretValueForRedaction(value);
	return value;
}
/** Lists each live hidden authorization record in one owner snapshot. */
async function listHiddenGitHubSecretRecords(params) {
	hiddenGitHubStoreKindFromPrefix(params.prefix);
	const context = captureOpenClawStateReadWorkerContext(params.database);
	const rows = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "githubSecrets.list",
		input: {
			prefix: params.prefix,
			now: Date.now()
		}
	}), { existingOnly: true }) ?? [];
	for (const row of rows) registerSecretValueForRedaction(row.value);
	return rows;
}
/** Hard-deletes one exact hidden GitHub authorization record. */
async function deleteHiddenGitHubSecretRecord(params) {
	assertHiddenGitHubSecretRecordName(params.name);
	const context = captureOpenClawStateWorkerContext(params.database);
	await observeSecretStoreMutation(runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "githubSecrets.delete",
		input: { name: params.name }
	})), context.admission.databasePath, [params.name]);
}
//#endregion
export { observeSecretStoreMutation as a, writeHiddenGitHubSecretRecord as i, listHiddenGitHubSecretRecords as n, publishSecretStoreChange as o, readHiddenGitHubSecretRecord as r, subscribeSecretStoreChanges as s, deleteHiddenGitHubSecretRecord as t };
