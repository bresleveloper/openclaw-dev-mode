import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { t as collectSessionEntryLookupKeys } from "./store-entry-CUxN9KZj.mjs";
import { _ as readSessionIdentitySnapshot, w as withSqliteSessionDeletionWorkerParticipant } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { r as prepareSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-BqtqwF34.mjs";
import { r as mutateSqliteSessionAtMessageInTransaction } from "./session-accessor.sqlite-message-cut-CcapwxKq.mjs";
import { i as transferSessionEntryWorkerCandidate } from "./session-entry-patch.worker-CyYnfK5G.mjs";
import { r as runSessionNativeBindingTransaction } from "./session-native-binding.worker-D8nGE-b2.mjs";
//#region src/config/sessions/session-message-cut.worker.ts
function commitSessionMessageCut(input, context) {
	return commitMessageCut(input, context);
}
function commitSessionForkMessageCut(input, context) {
	return commitMessageCut({
		agentId: input.agentId,
		intent: input.intent
	}, context, input.sourceRepositoryWorkspaceId);
}
function commitMessageCut(input, context, sourceRepositoryWorkspaceId) {
	const mutate = (database) => {
		const intent = input.intent;
		const identityKeys = uniqueStrings([...collectSessionEntryLookupKeys(intent.sourceKey), ...collectSessionEntryLookupKeys(intent.targetKey)]);
		const previous = readSessionIdentitySnapshot(database, identityKeys);
		let projectionNeedsReconcile = false;
		const result = mutateSqliteSessionAtMessageInTransaction(database, {
			...context.options,
			agentId: input.agentId,
			sessionKey: intent.sourceKey
		}, intent, {
			sourceRepositoryWorkspaceId,
			scheduleProjectionReconcile: false,
			onProjectionReconcileNeeded: () => {
				projectionNeedsReconcile = true;
			}
		});
		return {
			kind: "session-message-cut",
			result,
			projectionNeedsReconcile,
			previousSessionIds: [...previous.values()].flatMap((entry) => entry.sessionId ? [entry.sessionId] : []),
			publication: result.status === "created" ? prepareSessionEntryReplacementPublication({
				previous,
				current: readSessionIdentitySnapshot(database, identityKeys),
				pendingArchiveRecovery: false,
				membershipInvalidatedKeys: [intent.targetKey],
				maintenancePlans: []
			}, database) : void 0
		};
	};
	if (input.nativeBindings) return runSessionNativeBindingTransaction(input.nativeBindings, context, "session.transcript.message-cut", "Session history navigation", (database, wrapReceipt) => transferSessionEntryWorkerCandidate(database, context.admit, mutate(database), wrapReceipt));
	return withSqliteSessionDeletionWorkerParticipant(() => {}, () => context.writeTransaction("session.transcript.message-cut", "Session history navigation", (database) => transferSessionEntryWorkerCandidate(database, context.admit, mutate(database))));
}
//#endregion
export { commitSessionMessageCut as n, commitSessionForkMessageCut as t };
