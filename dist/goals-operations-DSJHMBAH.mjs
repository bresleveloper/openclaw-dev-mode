import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { u as SessionGoalOperationError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { I as SESSION_GOAL_OPERATIONS_TABLE, L as ensureSessionGoalOperationsSchema } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { s as openOpenClawAgentDatabase, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXu4Ype.mjs";
import { r as SessionsGoalMutationResultSchema } from "./sessions-goal-CGwIeB-Y.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { p as runExclusiveSqliteSessionWrite, s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { d as writeSessionEntry } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { o as resolveFreshSessionTotalTokens, r as mergeSessionEntry } from "./types-BZlUzQZy.mjs";
import crypto from "node:crypto";
//#region src/config/sessions/goals-transitions.ts
var SessionGoalTransitionError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SessionGoalTransitionError";
	}
};
function normalizeTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : void 0;
}
function resolveEntryFreshTotalTokens(entry) {
	return normalizeTokenCount(resolveFreshSessionTotalTokens(entry));
}
function normalizeTokenBudget(value) {
	const normalized = normalizeTokenCount(value);
	return normalized && normalized > 0 ? normalized : void 0;
}
function accountSessionGoalUsage(entry, now, options) {
	const goal = entry.goal;
	if (!goal) return;
	const totalTokens = resolveEntryFreshTotalTokens(entry);
	const hasFreshStart = goal.tokenStartFresh !== false;
	const shouldHoldStaleStart = !hasFreshStart && options?.adoptFreshBaseline === false;
	const shouldAdoptFreshStart = !shouldHoldStaleStart && totalTokens !== void 0 && !hasFreshStart;
	const tokenStart = shouldAdoptFreshStart ? totalTokens : normalizeTokenCount(goal.tokenStart) ?? totalTokens ?? 0;
	const tokensUsed = totalTokens === void 0 || shouldAdoptFreshStart || shouldHoldStaleStart ? goal.tokensUsed : Math.max(goal.tokensUsed, Math.max(0, totalTokens - tokenStart));
	const next = {
		...goal,
		tokenStart,
		tokenStartFresh: hasFreshStart || shouldAdoptFreshStart,
		tokensUsed
	};
	if (next.status === "active" && next.tokenBudget !== void 0 && tokensUsed >= next.tokenBudget) {
		next.status = "budget_limited";
		next.budgetLimitedAt = now;
		next.updatedAt = now;
	}
	return next;
}
function buildCreatedSessionGoal(entry, options, now) {
	const objective = options.objective;
	if (!objective.trim()) throw new SessionGoalTransitionError("objective required");
	if (entry.goal) throw new SessionGoalTransitionError("goal already exists");
	const tokenBudget = normalizeTokenBudget(options.tokenBudget);
	const tokenStart = resolveEntryFreshTotalTokens(entry);
	return {
		schemaVersion: 1,
		id: crypto.randomUUID(),
		objective,
		status: "active",
		createdAt: now,
		updatedAt: now,
		tokenStart: tokenStart ?? 0,
		tokenStartFresh: tokenStart !== void 0,
		tokensUsed: 0,
		...tokenBudget ? { tokenBudget } : {},
		continuationTurns: 0
	};
}
function buildUpdatedSessionGoalStatus(entry, options, now) {
	const accounted = accountSessionGoalUsage(entry, now);
	if (!accounted) throw new SessionGoalTransitionError("goal not found");
	if (accounted.status === "complete" && accounted.status !== options.status) throw new SessionGoalTransitionError(`goal is already ${accounted.status}`);
	const resetsBudgetWindow = options.status === "active" && (accounted.status === "budget_limited" || accounted.status === "usage_limited" || accounted.tokenBudget !== void 0 && accounted.tokensUsed >= accounted.tokenBudget);
	const freshTokenStart = resetsBudgetWindow ? resolveEntryFreshTotalTokens(entry) : void 0;
	const next = {
		...accounted,
		status: options.status,
		updatedAt: now,
		...options.note ? { lastStatusNote: options.note } : {},
		...options.status === "paused" ? { pausedAt: now } : {},
		...options.status === "blocked" ? { blockedAt: now } : {},
		...options.status === "complete" ? { completedAt: accounted.completedAt ?? now } : {}
	};
	if (resetsBudgetWindow) {
		next.tokenStart = freshTokenStart ?? 0;
		next.tokenStartFresh = freshTokenStart !== void 0;
		next.tokensUsed = 0;
		delete next.budgetLimitedAt;
		delete next.usageLimitedAt;
	}
	if (next.status === "active" && next.tokenBudget !== void 0 && next.tokensUsed >= next.tokenBudget) {
		next.status = "budget_limited";
		next.budgetLimitedAt = now;
	}
	return next;
}
function buildUpdatedSessionGoalObjective(entry, objective, now) {
	if (!objective.trim()) throw new SessionGoalTransitionError("objective required");
	const accounted = accountSessionGoalUsage(entry, now);
	if (!accounted) throw new SessionGoalTransitionError("goal not found");
	if (accounted.status === "complete") throw new SessionGoalTransitionError(`goal is already ${accounted.status}`);
	return {
		...accounted,
		objective,
		updatedAt: now
	};
}
//#endregion
//#region src/config/sessions/goals-operations.ts
const validateReceipt = /* @__PURE__ */ lazyCompile(SessionsGoalMutationResultSchema);
const OPERATION_VALIDITY_MS = 864e5;
const OPERATION_FUTURE_SKEW_MS = 3e5;
const MAX_SESSION_RECEIPTS = 4096;
function assertSessionGoalOperationTime(operation, now) {
	if (!Number.isSafeInteger(operation.issuedAtMs) || operation.issuedAtMs > now + OPERATION_FUTURE_SKEW_MS) throw new SessionGoalOperationError("invalid", "Goal operation time is invalid; refresh and try again.");
	if (operation.issuedAtMs + OPERATION_VALIDITY_MS <= now) throw new SessionGoalOperationError("expired", "Goal operation expired; review the current Goal before trying again.");
}
function operationFingerprint(operation) {
	return sha256Hex(JSON.stringify([
		operation.issuedAtMs,
		operation.requestFingerprint,
		operation.action,
		"goalId" in operation ? operation.goalId : null,
		"objective" in operation ? operation.objective : null,
		"tokenBudget" in operation ? operation.tokenBudget : null,
		"note" in operation ? operation.note : null
	]));
}
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
/** Apply the same policy used by text commands to the fresh row inside the commit section. */
function applySessionGoalOperation(entry, operation, now) {
	try {
		if (operation.action === "start") return buildCreatedSessionGoal(entry, operation, now);
		if (!entry.goal || entry.goal.id !== operation.goalId) throw new SessionGoalOperationError("goal-rebound", "Goal changed or was cleared; refresh before trying again.");
		if (operation.action === "clear") return;
		if (operation.action === "edit") return buildUpdatedSessionGoalObjective(entry, operation.objective, now);
		return buildUpdatedSessionGoalStatus(entry, {
			status: operation.action === "resume" ? "active" : operation.action === "pause" ? "paused" : operation.action === "block" ? "blocked" : "complete",
			note: operation.note
		}, now);
	} catch (error) {
		if (error instanceof SessionGoalTransitionError) throw new SessionGoalOperationError("invalid", error.message);
		throw error;
	}
}
/** Called only after every Goal/turn/lifecycle write succeeds, in that same transaction. */
function writeSessionGoalOperationReceipt(db, sessionKey, sessionId, operation, goal, runId) {
	const now = Date.now();
	assertSessionGoalOperationTime(operation, now);
	const kysely = getSessionKysely(db);
	executeSqliteQuerySync(db, kysely.deleteFrom(SESSION_GOAL_OPERATIONS_TABLE).where("expires_at", "<=", now));
	if ((executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_goal_operations").select(({ fn }) => fn.countAll().as("count")).where("session_key", "=", sessionKey))?.count ?? 0) >= MAX_SESSION_RECEIPTS) throw new SessionGoalOperationError("capacity", "Too many recent Goal operations; wait for older requests to expire before trying again.");
	const goalId = goal?.id ?? ("goalId" in operation ? operation.goalId : void 0);
	if (!goalId) throw new Error("Goal creation did not produce a Goal identity.");
	const result = {
		operationId: operation.operationId,
		action: operation.action,
		sessionId,
		goalId,
		status: runId ? "started" : operation.action === "clear" ? "cleared" : "updated",
		...goal ? { goal } : {},
		...runId ? { runId } : {}
	};
	executeSqliteQuerySync(db, kysely.insertInto(SESSION_GOAL_OPERATIONS_TABLE).values({
		session_key: sessionKey,
		operation_id: operation.operationId,
		session_id: sessionId,
		request_fingerprint: operationFingerprint(operation),
		result_json: JSON.stringify(result),
		expires_at: operation.issuedAtMs + OPERATION_VALIDITY_MS
	}));
	return result;
}
/** Management-only Goal actions do not enter chat or fabricate user turns. */
async function mutateSessionGoal(options) {
	const resolved = resolveSqliteScope(options);
	const databaseOptions = toDatabaseOptions(resolved);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		ensureSessionGoalOperationsSchema(openOpenClawAgentDatabase(databaseOptions).db);
		const committed = runOpenClawAgentWriteTransaction((database) => {
			options.assertCurrent?.();
			const fresh = readSessionEntryRow(database, resolved.sessionKey);
			const replay = readSessionGoalOperationReceipt(database.db, resolved.sessionKey, options.expectedSessionId, options.operation);
			if (replay && fresh?.entry.sessionId === options.expectedSessionId) return {
				result: replay,
				replayed: true
			};
			if (!fresh || fresh.entry.sessionId !== options.expectedSessionId) throw new SessionGoalOperationError("session-rebound", "Session changed; refresh before changing its Goal.");
			const goal = applySessionGoalOperation(fresh.entry, options.operation, Date.now());
			const next = mergeSessionEntry(fresh.entry, { goal });
			writeSessionEntry(database, resolved.sessionKey, next, { canonicalPreviousEntry: fresh.entry });
			return {
				result: writeSessionGoalOperationReceipt(database.db, resolved.sessionKey, options.expectedSessionId, options.operation, goal),
				replayed: false,
				next
			};
		}, databaseOptions, { operationLabel: "session.goal.mutate" });
		return {
			result: committed.result,
			replayed: committed.replayed,
			sessionEntry: committed.next
		};
	}, "session.goal.mutate");
}
//#endregion
export { readSessionGoalOperationReceipt as a, accountSessionGoalUsage as c, buildUpdatedSessionGoalStatus as d, readSessionGoalOperationInDatabase as i, buildCreatedSessionGoal as l, assertSessionGoalOperationTime as n, writeSessionGoalOperationReceipt as o, mutateSessionGoal as r, SessionGoalTransitionError as s, applySessionGoalOperation as t, buildUpdatedSessionGoalObjective as u };
