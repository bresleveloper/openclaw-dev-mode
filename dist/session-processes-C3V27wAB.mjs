import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as NonEmptyString } from "./primitives-Ped9kAI8.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/session-processes.ts
const SESSION_PROCESSES_MAX_ROWS = 50;
const SESSION_PROCESS_NAME_MAX_CHARS = 160;
const SESSION_PROCESS_TAIL_MAX_CHARS = 2e3;
const SESSION_PROCESSES_MAX_BYTES = 49152;
/** An observation reference identifies one process incarnation, never grants access. */
const SessionProcessSummarySchema = closedObject({
	processId: NonEmptyString,
	instanceId: NonEmptyString,
	name: Type.String({ maxLength: 160 }),
	status: Type.Union([
		Type.Literal("running"),
		Type.Literal("completed"),
		Type.Literal("failed"),
		Type.Literal("killed")
	]),
	startedAt: Type.Number(),
	endedAt: Type.Optional(Type.Number()),
	tail: Type.String({ maxLength: SESSION_PROCESS_TAIL_MAX_CHARS }),
	truncated: Type.Boolean(),
	canStop: Type.Boolean(),
	exitCode: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
	exitSignal: Type.Optional(Type.Union([
		Type.String(),
		Type.Number(),
		Type.Null()
	])),
	exitReason: Type.Optional(Type.String())
});
const SessionsProcessesListParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
const SessionsProcessesListResultSchema = closedObject({
	sessionId: NonEmptyString,
	processes: Type.Array(SessionProcessSummarySchema, { maxItems: 50 }),
	truncated: Type.Boolean()
});
const SessionsProcessesStopParamsSchema = closedObject({
	...SessionsProcessesListParamsSchema.properties,
	sessionId: NonEmptyString,
	processId: NonEmptyString,
	instanceId: NonEmptyString
});
const SessionsProcessesStopResultSchema = closedObject({ requested: Type.Boolean() });
//#endregion
export { SessionProcessSummarySchema as a, SessionsProcessesStopParamsSchema as c, SESSION_PROCESS_TAIL_MAX_CHARS as i, SessionsProcessesStopResultSchema as l, SESSION_PROCESSES_MAX_ROWS as n, SessionsProcessesListParamsSchema as o, SESSION_PROCESS_NAME_MAX_CHARS as r, SessionsProcessesListResultSchema as s, SESSION_PROCESSES_MAX_BYTES as t };
