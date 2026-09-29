import { a as withSqlitePostCommitPublications } from "../../sqlite-post-commit-DJbkHzN8.mjs";
import { i as runSqliteDeferredTransactionSync, o as runSqliteImmediateTransactionSync, t as assertTransactionUsable } from "../../sqlite-transaction-DKSXLQhb.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../../openclaw-state-db-contract-dESpOAuZ.mjs";
import { t as sessionChanges } from "../../session-row-changes-xuu0eHng.mjs";
import { s as getOpenClawAgentDatabaseIfOpen } from "../../openclaw-agent-db-CaQAStOA.mjs";
import { g as toDatabaseOptions, u as resolveSqliteScope } from "../../session-accessor.sqlite-scope-DHC66DLY.mjs";
import { m as readSqliteSessionParticipantProjection } from "../../session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { i as recordSessionParticipant, n as removeSessionMember, t as addSessionMember } from "../../session-sharing-store.native-CfGI05Li.mjs";
import { n as assertSessionGroupCategoryDestination, r as prepareSessionGroupCategoryMutation, t as applySessionGroupCategoryMutation } from "../../session-group-categories.kernel-i48SkY8N.mjs";
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
			if (command.type === "category.prepare") {
				const database = categoryDatabase(command.input.scope);
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
			const unsubscribe = command.type !== "category.apply" ? sessionChanges.subscribeFacts((change) => {
				if ("sessionKey" in change && change.sessionKey === command.input.scope.sessionKey && change.storePath === context.databasePath) {
					if (participantResult && change.facts?.kind === "participants") participantResult.projectionChanged = true;
					if (membershipResult && change.facts?.kind === "member") membershipResult.facts = change.facts;
				}
			}) : void 0;
			try {
				return withSqlitePostCommitPublications(db, () => runSqliteImmediateTransactionSync(db, () => {
					context.admit("transaction");
					const scope = command.input.scope;
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
						context.admit("commit");
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
