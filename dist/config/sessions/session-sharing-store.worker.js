import { u as readDatabasePathIdentitySync } from "../../sqlite-worker-identity-KSR14F6C.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../../openclaw-state-db-contract-Cm9fKF2T.mjs";
import { a as withSqlitePostCommitPublications } from "../../sqlite-post-commit-CQ_AyDCk.mjs";
import { o as runSqliteWorkerTransactionSync, r as runSqliteDeferredTransactionSync, t as assertTransactionUsable } from "../../sqlite-transaction-DsZ3X6nD.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "../../openclaw-agent-db.paths-DVbbFaej.mjs";
import { n as sessionChanges } from "../../session-row-changes-BcJIdta8.mjs";
import { a as getOpenClawAgentDatabaseIfOpen } from "../../openclaw-agent-db-DBug3LUA.mjs";
import { i as toDatabaseOptions } from "../../session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "../../session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { s as readSqliteSessionParticipantProjection } from "../../internal-session-key-CPayZwJR.mjs";
import { t as assignSessionOwner } from "../../session-accessor.sqlite-owner-ylhcUaWK.mjs";
import { n as removeSessionMember, r as recordSessionParticipant, t as addSessionMember } from "../../session-sharing-store.native-Z8tyX-6b.mjs";
import { n as assertSessionGroupCategoryDestination, r as prepareSessionGroupCategoryMutation, t as applySessionGroupCategoryMutation } from "../../session-group-categories.kernel-BhgRGqMF.mjs";
import { i as releaseSessionSuggestionDispatch, n as claimSessionSuggestionDispatch, r as finalizeSessionSuggestionClaim, t as addSessionSuggestion } from "../../session-suggestion-store-Ds6yg9Y3.mjs";
//#region src/config/sessions/session-sharing-store.worker.ts
/** The canonical agent executor retains the connection and both live admission checks. */
function bindSqliteWorkerBackend(_input, context) {
	const db = context.database;
	let categoryPlan;
	const categoryDatabase = (scope) => {
		const database = getOpenClawAgentDatabaseIfOpen(toDatabaseOptions(resolveSqliteScope(scope)));
		if (!database || database.db !== db || database.path !== context.databasePath) throw new Error("Session group category write lost its physical store owner");
		return database;
	};
	return {
		execute(command) {
			const scope = { ...command.input.scope };
			const target = resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolveSqliteScope(scope)));
			if (!(db.location() ? readDatabasePathIdentitySync(target).canonicalPath === context.databasePath : target === context.databasePath && getOpenClawAgentDatabaseIfOpen(toDatabaseOptions(resolveSqliteScope(scope)))?.db === db)) throw new Error("Session collaboration target changed its database owner");
			scope.storePath = context.databasePath;
			if (command.type === "category.prepare") {
				const database = categoryDatabase(scope);
				return withSqlitePostCommitPublications(db, () => runSqliteDeferredTransactionSync(db, () => {
					categoryPlan = {
						from: command.input.from,
						storePath: database.path,
						rows: prepareSessionGroupCategoryMutation(database, command.input.from)
					};
					return [...categoryPlan.rows.keys()];
				}));
			}
			let participantResult;
			let membershipResult;
			let ownerResult;
			const unsubscribe = command.type !== "category.apply" ? sessionChanges.subscribeFacts((change) => {
				if ("sessionKey" in change && change.sessionKey === command.input.scope.sessionKey && change.storePath === context.databasePath) {
					if (participantResult && change.facts?.kind === "participants") participantResult.projectionChanged = true;
					if (membershipResult && change.facts?.kind === "member") membershipResult.facts = change.facts;
					if (ownerResult && change.facts?.kind === "owner") ownerResult.facts = change.facts;
				}
			}) : void 0;
			try {
				return withSqlitePostCommitPublications(db, () => runSqliteWorkerTransactionSync(context, () => {
					if (command.type === "owner.assign") {
						ownerResult = { value: assignSessionOwner(scope, command.input.params) };
						return ownerResult;
					}
					if (command.type === "suggestion.add") return addSessionSuggestion(scope, command.input.params);
					if (command.type === "suggestion.claim") return claimSessionSuggestionDispatch(scope, command.input.params);
					if (command.type === "suggestion.release") return releaseSessionSuggestionDispatch(scope, command.input.params);
					if (command.type === "suggestion.finalize") return finalizeSessionSuggestionClaim(scope, command.input.params);
					if (command.type === "category.apply") {
						const database = categoryDatabase(scope);
						if (!categoryPlan || categoryPlan.from !== command.input.from || categoryPlan.storePath !== database.path) throw new Error("Session group category mutation has no matching prepared rows");
						return applySessionGroupCategoryMutation(database, categoryPlan.rows, command.input.to, scope.env ?? process.env);
					}
					if (command.type === "participant") {
						participantResult = {
							value: recordSessionParticipant(scope, command.input.params),
							projectionChanged: false,
							participants: readSqliteSessionParticipantProjection(db, scope.sessionKey)
						};
						return participantResult;
					}
					if (command.type === "add") {
						const result = { value: addSessionMember(scope, command.input.params) };
						membershipResult = result;
						return result;
					}
					const result = { value: removeSessionMember(scope, command.input.identityId, command.input.expected, command.input.expectedSessionId, command.input.expectedEntry) };
					membershipResult = result;
					return result;
				}, {
					operationLabel: `sessions.${command.type}`,
					busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
					databaseLabel: context.databasePath,
					withCommit(commit) {
						if (command.type === "category.apply") assertSessionGroupCategoryDestination(command.input.to, command.input.scope.env ?? process.env);
						commit();
					}
				}));
			} finally {
				unsubscribe?.();
			}
		},
		assertSettled() {
			assertTransactionUsable(db);
			if (db.isTransaction) throw new Error("Session collaboration transaction did not settle");
		},
		close() {}
	};
}
//#endregion
export { bindSqliteWorkerBackend };
