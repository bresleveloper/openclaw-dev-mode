import { c as withSqlitePostCommitPublications } from "../../sqlite-post-commit-22SfWsLt.mjs";
import { l as runSqliteWorkerTransactionSync, r as runSqliteDeferredTransactionSync, t as assertTransactionUsable } from "../../sqlite-transaction-CpDyZPQ0.mjs";
import { _ as AuthProfileStoreUnreadableError, t as encodeOpenClawStateWorkerError } from "../../openclaw-state-worker-error-B93Lf_P2.mjs";
import { U as reportCommittedInlineAuthFailure, j as resolveInlineProviderApiKeyUsageId } from "../../user-model-account-authority-DFFjC5J5.mjs";
import { o as mergePersistedAuthProfileState } from "../../persisted-DbIYEoQ3.mjs";
import { w as writeAuthProfileJsonCell } from "../../sqlite-BlFpr2YD.mjs";
import { s as inspectAuthProfileJsonCell } from "../../sqlite-json-Dyr7VLoH.mjs";
import { n as prepareAuthProfileStateMutation } from "../../store-save-BIpfhaDX.mjs";
import { o as computeNextProfileUsageStats } from "../../usage-reduction-CowLLP6a.mjs";
import { t as enrollAuthProfileAuthorizationInDatabase } from "../../authorization-enrollment-qxIdf8dG.mjs";
import { n as authProfilePeerGenerationMayMatch, r as updateAuthProfileStoreInDatabase, t as recordAuthProfileUsageInDatabase } from "../../usage-kernel-FASGF1bH.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/inline-usage-kernel.ts
/** The admitted agent transaction owns the fresh read, health reduction, and durable cells. */
function recordInlineAuthFailureInDatabase(database, databasePath, input) {
	const credentials = inspectAuthProfileJsonCell(database, "store", "agent");
	if (!isDeepStrictEqual(credentials.status === "readable" ? credentials.raw : null, input.expectedCredentials)) throw new Error("Auth credentials changed during inline-failure preparation");
	const state = inspectAuthProfileJsonCell(database, "state", "agent");
	const existingState = state.status === "readable" ? state.raw : null;
	const loaded = mergePersistedAuthProfileState(credentials.status === "readable" ? credentials.raw : null, () => existingState);
	if (!loaded && credentials.status !== "missing") throw new AuthProfileStoreUnreadableError(databasePath);
	const store = loaded ?? {
		version: 1,
		profiles: {}
	};
	store.usageStats = {
		...Object.fromEntries(Object.entries(input.inheritedUsageStats ?? {}).filter(([profileId]) => store.profiles[profileId] || profileId.startsWith("inline-api-key:"))),
		...store.usageStats
	};
	const usageId = resolveInlineProviderApiKeyUsageId(input.provider);
	const previousStats = store.usageStats?.[usageId];
	const now = Date.now();
	const nextStats = computeNextProfileUsageStats({
		existing: previousStats ?? {},
		now,
		reason: input.reason,
		modelId: input.modelId
	});
	store.usageStats = {
		...store.usageStats,
		[usageId]: nextStats
	};
	const { statePayload, stateChanged, selectionChanged } = prepareAuthProfileStateMutation({
		existingState,
		store,
		selectionProfiles: store.profiles
	});
	if (credentials.status === "missing") writeAuthProfileJsonCell(database, "store", "agent", {
		version: 1,
		profiles: {}
	});
	if (stateChanged) writeAuthProfileJsonCell(database, "state", "agent", statePayload);
	return {
		store,
		previousStats,
		nextStats,
		now,
		publication: {
			credentialsChanged: false,
			profileSetChanged: false,
			stateChanged,
			selectionChanged,
			profileIds: []
		}
	};
}
//#endregion
//#region src/agents/auth-profiles/inline-usage.worker.ts
/** The canonical agent executor lends its connection and transaction/commit admission. */
function bindSqliteWorkerBackend(_input, context) {
	return {
		execute(command) {
			if (command.type === "authProfiles.enrollAuthorization") return runSqliteWorkerTransactionSync(context, () => enrollAuthProfileAuthorizationInDatabase(context.database, "agent", command.input));
			if (command.type === "authProfiles.update") {
				if (!authProfilePeerGenerationMayMatch(context.database, command.input)) return false;
				withSqlitePostCommitPublications(context.database, () => runSqliteWorkerTransactionSync(context, () => updateAuthProfileStoreInDatabase(context.database, "agent", command.input)));
				return true;
			}
			if (command.type === "authProfiles.inlineSnapshot") return runSqliteDeferredTransactionSync(context.database, () => ({
				store: inspectAuthProfileJsonCell(context.database, "store", "agent"),
				state: inspectAuthProfileJsonCell(context.database, "state", "agent"),
				cacheable: false
			}));
			let result;
			let committed = false;
			try {
				runSqliteWorkerTransactionSync(context, () => {
					if (command.type === "authProfiles.usage") result = {
						ok: true,
						receipt: recordAuthProfileUsageInDatabase(context.database, context.databasePath, "agent", command.input)
					};
					else result = {
						ok: true,
						receipt: recordInlineAuthFailureInDatabase(context.database, context.databasePath, command.input)
					};
				}, { withCommit(commit) {
					commit();
					committed = true;
				} });
			} catch (error) {
				if (!committed || !result) {
					assertTransactionUsable(context.database);
					if (!context.database.isOpen || context.database.isTransaction) throw error;
					const failure = encodeOpenClawStateWorkerError(error, { includeOrdinary: true });
					if (!failure) throw error;
					return {
						ok: false,
						error: failure
					};
				}
				reportCommittedInlineAuthFailure("Auth usage committed before transaction cleanup failed", error);
			}
			if (!result) throw new Error("Auth usage transaction produced no durable result");
			return result;
		},
		assertSettled() {
			assertTransactionUsable(context.database);
			if (!context.database.isOpen || context.database.isTransaction) throw new Error("Auth usage left an unsettled agent transaction");
		},
		close() {}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
