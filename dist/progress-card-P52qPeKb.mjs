import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as NonEmptyString } from "./primitives-CYT6MDvz.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/progress-card.ts
const PROGRESS_CARD_MAX_UTF8_BYTES = 8192;
const PROGRESS_CARD_MAX_STEPS = 50;
const PROGRESS_CARD_MAX_STEP_UTF8_BYTES = 512;
const ProgressCardStepStatusSchema = Type.Union([
	Type.Literal("pending"),
	Type.Literal("in_progress"),
	Type.Literal("completed")
]);
const ProgressCardStepSchema = closedObject({
	step: Type.String({ minLength: 1 }),
	status: ProgressCardStepStatusSchema
});
const ProgressCardSchema = closedObject({
	sessionKey: NonEmptyString,
	revision: Type.Integer({ minimum: 1 }),
	updatedAt: Type.Integer(),
	markdown: Type.Optional(Type.String()),
	steps: Type.Optional(Type.Array(ProgressCardStepSchema, { maxItems: 50 }))
});
const ProgressCardGetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
const ProgressCardGetResultSchema = closedObject({ card: Type.Union([ProgressCardSchema, Type.Null()]) });
const ProgressCardPutParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	markdown: Type.Optional(Type.String()),
	plan: Type.Optional(Type.Array(ProgressCardStepSchema, { maxItems: 50 })),
	expectedRevision: Type.Optional(Type.Integer({ minimum: 1 }))
});
const ProgressCardPutResultSchema = ProgressCardGetResultSchema;
const ProgressCardRefreshParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	idempotencyKey: NonEmptyString
});
const ProgressCardRefreshResultSchema = closedObject({
	runId: NonEmptyString,
	status: Type.Literal("accepted"),
	revision: Type.Integer({ minimum: 1 })
});
const ProgressCardChangedEventSchema = closedObject({
	sessionKey: NonEmptyString,
	revision: Type.Union([Type.Number(), Type.Null()])
});
//#endregion
export { ProgressCardGetParamsSchema as a, ProgressCardPutResultSchema as c, ProgressCardSchema as d, ProgressCardStepSchema as f, ProgressCardChangedEventSchema as i, ProgressCardRefreshParamsSchema as l, PROGRESS_CARD_MAX_STEP_UTF8_BYTES as n, ProgressCardGetResultSchema as o, ProgressCardStepStatusSchema as p, PROGRESS_CARD_MAX_UTF8_BYTES as r, ProgressCardPutParamsSchema as s, PROGRESS_CARD_MAX_STEPS as t, ProgressCardRefreshResultSchema as u };
