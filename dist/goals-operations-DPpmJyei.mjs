import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { n as SessionGoalOperationError } from "./goals-operations.types-DnxMqPtA.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { L as SESSION_GOAL_OPERATIONS_TABLE } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXu4Ype.mjs";
import { r as SessionsGoalMutationResultSchema } from "./sessions-goal-CAS--XvT.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { a as createSessionGoalOperationResult, i as assertSessionGoalOperationTime, o as operationFingerprint } from "./goals-operation-policy-qSLTo9UN.mjs";
import { n as captureSessionActorStorageOwner, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { l as runExclusiveSqliteSessionWrite, n as captureLifecycleDatabaseScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
//#region src/config/sessions/goals-operations.ts
const validateReceipt = /* @__PURE__ */ lazyCompile(SessionsGoalMutationResultSchema);
/** Read the receipt and its session generation from one admitted snapshot. */
function readSessionGoalOperationInDatabase(database, options) {
	assertSessionGoalOperationTime(options.operation, Date.now());
	const { db } = database;
	return runSqliteDeferredTransactionSync(db, () => {
		const schema = getAdmittedSqliteSchemaFacts(db);
		if (!schema) throw new Error("Goal receipt reads require admitted schema facts");
		if (!schema.tables.has("session_goal_operations")) return;
		const receipt = readSessionGoalOperationReceipt(db, options.sessionKey, options.expectedSessionId, options.operation);
		if (receipt && readSessionEntryRow(database, options.sessionKey)?.entry.sessionId !== options.expectedSessionId) throw new SessionGoalOperationError("session-rebound", "Session changed after this Goal operation; refresh before trying again.");
		return receipt;
	});
}
/** The caller has installed the schema before BEGIN; this read participates in its transaction. */
function readSessionGoalOperationReceipt(db, sessionKey, sessionId, operation) {
	assertSessionGoalOperationTime(operation, Date.now());
	const row = executeSqliteQueryTakeFirstSync(db, getSessionKysely(db).selectFrom(SESSION_GOAL_OPERATIONS_TABLE).selectAll().where("session_key", "=", sessionKey).where("operation_id", "=", operation.operationId));
	if (!row) return;
	if (row.request_fingerprint !== operationFingerprint(operation)) throw new SessionGoalOperationError("operation-conflict", "Goal operation ID was already used for a different request.");
	if (row.session_id !== sessionId) throw new SessionGoalOperationError("session-rebound", "Session changed after this Goal operation; refresh before trying again.");
	const result = safeParseJson(row.result_json);
	if (!validateReceipt(result) || result.operationId !== operation.operationId || result.action !== operation.action || result.sessionId !== sessionId || "goalId" in operation && result.goalId !== operation.goalId || result.goal !== void 0 && result.goal.id !== result.goalId) throw new SessionGoalOperationError("receipt-invalid", "Stored Goal operation receipt is invalid; inspect the session before retrying.");
	return result;
}
/** Called only after every Goal/turn/lifecycle write succeeds, in that same transaction. */
function writeSessionGoalOperationReceipt(db, sessionKey, sessionId, operation, goal, runId) {
	const now = Date.now();
	assertSessionGoalOperationTime(operation, now);
	const kysely = getSessionKysely(db);
	executeSqliteQuerySync(db, kysely.deleteFrom(SESSION_GOAL_OPERATIONS_TABLE).where("expires_at", "<=", now));
	const result = createSessionGoalOperationResult(sessionId, operation, goal, runId);
	if (executeSqliteQuerySync(db, kysely.insertInto("session_goal_operations").columns([
		"session_key",
		"operation_id",
		"session_id",
		"request_fingerprint",
		"result_json",
		"expires_at"
	]).expression(kysely.selectNoFrom((eb) => [
		eb.val(sessionKey).as("session_key"),
		eb.val(operation.operationId).as("operation_id"),
		eb.val(sessionId).as("session_id"),
		eb.val(operationFingerprint(operation)).as("request_fingerprint"),
		eb.val(JSON.stringify(result)).as("result_json"),
		eb.val(operation.issuedAtMs + 864e5).as("expires_at")
	]).where(kysely.selectFrom("session_goal_operations").select(({ fn }) => fn.countAll().as("count")).where("session_key", "=", sessionKey), "<", 4096))).numAffectedRows === 0n) throw new SessionGoalOperationError("capacity", "Too many recent Goal operations; wait for older requests to expire before trying again.");
	return result;
}
/** Management-only Goal actions do not enter chat or fabricate user turns. */
async function mutateSessionGoal(options) {
	const assertCurrent = () => options.assertCurrent?.();
	const memory = captureSessionActorStorageOwner(options, {
		assertCurrent,
		authorize: assertCurrent
	});
	if (memory) {
		const result = await withSessionActorStorage(options, {
			lifetime: {
				assertCurrent,
				assertReadable: assertCurrent
			},
			authority: memory.authority
		}, async (binding) => {
			let authorityFailure;
			const outcome = await binding.actor.storage.mutate({
				type: "session.goal.mutate",
				input: {
					sessionKey: binding.actor.target.sessionKey,
					expectedSessionId: options.expectedSessionId,
					operation: options.operation
				}
			}, {
				...binding.authority,
				assertCurrent() {
					try {
						binding.authority.assertCurrent();
					} catch (error) {
						authorityFailure = error;
						throw error;
					}
				},
				authorize(stage, facts, publication) {
					try {
						binding.authority.authorize(stage, facts, publication);
					} catch (error) {
						authorityFailure = error;
						throw error;
					}
				}
			});
			if (outcome.kind === "rolled-back" && authorityFailure instanceof Error) throw authorityFailure;
			const { previous: _previous, ...receipt } = readSessionActorStorageResult(outcome);
			return receipt;
		});
		if (!result) throw new SessionGoalOperationError("session-rebound", "Session changed; refresh before changing its Goal.");
		return result;
	}
	const resolved = captureLifecycleDatabaseScope(resolveSqliteScope(options));
	const databaseOptions = toDatabaseOptions(resolved);
	const input = structuredClone({
		sessionKey: resolved.sessionKey,
		expectedSessionId: options.expectedSessionId,
		operation: options.operation
	});
	return runExclusiveSqliteSessionWrite(resolved, async () => {
		const execution = captureOpenClawAgentDatabaseExecution(databaseOptions);
		return (await import("./goals-management-BiLM-9yC.mjs").catch(async (error) => {
			await execution.release();
			throw error;
		})).mutateSessionGoalInWorker({
			...databaseOptions,
			path: resolved.path
		}, resolved.agentId, execution, input, composeSessionSourceAssertion([options.assertCurrent], (assertSources) => {
			assertSources();
			assertSessionGoalOperationTime(input.operation, Date.now());
		}));
	}, "session.goal.mutate");
}
//#endregion
export { writeSessionGoalOperationReceipt as i, readSessionGoalOperationInDatabase as n, readSessionGoalOperationReceipt as r, mutateSessionGoal as t };
