import { i as runSqliteDeferredTransactionSync, o as runSqliteImmediateTransactionSync, t as assertTransactionUsable } from "../../sqlite-transaction-DKSXLQhb.mjs";
import { t as encodeOpenClawStateWorkerError } from "../../openclaw-state-worker-error-DLFiBmPG.mjs";
import { c as inspectAuthProfileJsonCell, d as writeAuthProfileJsonCell } from "../../sqlite-json-DYv-pIUa.mjs";
import { O as reportCommittedInlineAuthFailure, f as AuthProfileStoreUnreadableError, l as mergePersistedAuthProfileState } from "../../persisted-B486xwB_.mjs";
import { t as prepareAuthProfileStateMutation } from "../../store-mutation-bCnU80pc.mjs";
import { d as resolveInlineProviderApiKeyUsageId } from "../../usage-state-Bm5iXGhR.mjs";
import { t as computeNextProfileUsageStats } from "../../usage-failure-state-CmVjUmco.mjs";
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
			if (command.type === "authProfiles.inlineSnapshot") return runSqliteDeferredTransactionSync(context.database, () => ({
				store: inspectAuthProfileJsonCell(context.database, "store", "agent"),
				state: inspectAuthProfileJsonCell(context.database, "state", "agent"),
				cacheable: false
			}));
			let receipt;
			let committed = false;
			try {
				runSqliteImmediateTransactionSync(context.database, () => {
					context.admit("transaction");
					receipt = recordInlineAuthFailureInDatabase(context.database, context.databasePath, command.input);
				}, { withCommit(commit) {
					context.admit("commit");
					commit();
					committed = true;
				} });
			} catch (error) {
				if (!committed || !receipt) {
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
			if (!receipt) throw new Error("Auth usage transaction produced no durable result");
			return {
				ok: true,
				receipt
			};
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
