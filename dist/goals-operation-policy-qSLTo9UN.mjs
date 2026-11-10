import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { n as SessionGoalOperationError } from "./goals-operations.types-DnxMqPtA.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-BGDhC4_W.mjs";
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
	if (accounted.status === "complete" && options.status !== "complete" && options.status !== "active") throw new SessionGoalTransitionError(`goal is already ${accounted.status}`);
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
	if (accounted.status === "complete" && options.status === "active") delete next.completedAt;
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
//#region src/config/sessions/goals-operation-policy.ts
const OPERATION_VALIDITY_MS = 864e5;
const OPERATION_FUTURE_SKEW_MS = 3e5;
const MAX_SESSION_RECEIPTS = 4096;
function assertSessionGoalOperationTime(operation, now) {
	if (!Number.isSafeInteger(operation.issuedAtMs) || operation.issuedAtMs > now + OPERATION_FUTURE_SKEW_MS) throw new SessionGoalOperationError("invalid", "Goal operation time is invalid; refresh and try again.");
	if (operation.issuedAtMs + 864e5 <= now) throw new SessionGoalOperationError("expired", "Goal operation expired; review the current Goal before trying again.");
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
function prepareSessionTurnGoalMessage(message, mutation, goalId) {
	if (!mutation || !goalId || !isRecord(message) || message.role !== "user") return message;
	return {
		...message,
		__openclaw: {
			...isRecord(message["__openclaw"]) ? message["__openclaw"] : {},
			intent: {
				kind: mutation.operation.action === "start" ? "session-goal-start" : "session-goal-resume",
				version: 1,
				goalId,
				operationId: mutation.operation.operationId
			}
		}
	};
}
function createSessionGoalOperationResult(sessionId, operation, goal, runId) {
	const goalId = goal?.id ?? ("goalId" in operation ? operation.goalId : void 0);
	if (!goalId) throw new Error("Goal creation did not produce a Goal identity.");
	return {
		operationId: operation.operationId,
		action: operation.action,
		sessionId,
		goalId,
		status: runId ? "started" : operation.action === "clear" ? "cleared" : "updated",
		...goal ? { goal } : {},
		...runId ? { runId } : {}
	};
}
//#endregion
export { createSessionGoalOperationResult as a, SessionGoalTransitionError as c, buildUpdatedSessionGoalObjective as d, buildUpdatedSessionGoalStatus as f, assertSessionGoalOperationTime as i, accountSessionGoalUsage as l, OPERATION_VALIDITY_MS as n, operationFingerprint as o, applySessionGoalOperation as r, prepareSessionTurnGoalMessage as s, MAX_SESSION_RECEIPTS as t, buildCreatedSessionGoal as u };
