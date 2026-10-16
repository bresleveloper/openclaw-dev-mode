import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as NonEmptyString } from "./primitives-CYT6MDvz.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/sessions-goal.ts
const SessionGoalSchema = closedObject({
	schemaVersion: Type.Literal(1),
	id: NonEmptyString,
	objective: Type.String(),
	status: Type.Union([
		Type.Literal("active"),
		Type.Literal("paused"),
		Type.Literal("blocked"),
		Type.Literal("usage_limited"),
		Type.Literal("budget_limited"),
		Type.Literal("complete")
	]),
	createdAt: Type.Number(),
	updatedAt: Type.Number(),
	tokenStart: Type.Number(),
	tokenStartFresh: Type.Optional(Type.Boolean()),
	tokensUsed: Type.Number(),
	tokenBudget: Type.Optional(Type.Number()),
	continuationTurns: Type.Number(),
	lastStatusNote: Type.Optional(Type.String()),
	pausedAt: Type.Optional(Type.Number()),
	blockedAt: Type.Optional(Type.Number()),
	completedAt: Type.Optional(Type.Number()),
	usageLimitedAt: Type.Optional(Type.Number()),
	budgetLimitedAt: Type.Optional(Type.Number())
});
const GoalOperationIdentity = {
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	goalId: NonEmptyString,
	operationId: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	issuedAtMs: Type.Integer({ minimum: 0 })
};
const SessionsGoalUpdateParamsSchema = Type.Union([closedObject({
	...GoalOperationIdentity,
	action: Type.Literal("edit"),
	objective: Type.String({
		minLength: 1,
		maxLength: 16e3
	})
}), closedObject({
	...GoalOperationIdentity,
	action: Type.Union([
		Type.Literal("pause"),
		Type.Literal("resume"),
		Type.Literal("complete"),
		Type.Literal("block")
	]),
	note: Type.Optional(Type.String({ maxLength: 2e3 }))
})]);
const SessionsGoalClearParamsSchema = closedObject(GoalOperationIdentity);
const SessionsGoalMutationResultSchema = closedObject({
	operationId: NonEmptyString,
	action: Type.Union([
		Type.Literal("start"),
		Type.Literal("edit"),
		Type.Literal("pause"),
		Type.Literal("resume"),
		Type.Literal("complete"),
		Type.Literal("block"),
		Type.Literal("clear")
	]),
	sessionId: NonEmptyString,
	goalId: NonEmptyString,
	goal: Type.Optional(SessionGoalSchema),
	runId: Type.Optional(NonEmptyString),
	replayed: Type.Optional(Type.Literal(true)),
	status: Type.Union([
		Type.Literal("started"),
		Type.Literal("updated"),
		Type.Literal("cleared")
	])
});
//#endregion
export { SessionsGoalUpdateParamsSchema as i, SessionsGoalClearParamsSchema as n, SessionsGoalMutationResultSchema as r, SessionGoalSchema as t };
