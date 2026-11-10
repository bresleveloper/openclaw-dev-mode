import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as NonEmptyString } from "./primitives-Ped9kAI8.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXu4Ype.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/system-run-execution-context.ts
const SYSTEM_RUN_EXECUTION_CONTEXT_CAPABILITY = "system.run.execution-context.v1";
/** Routing hints only; never session, turn, or approval authority. */
const SystemRunExecutionContextSchema = closedObject({
	senderId: Type.Optional(NonEmptyString),
	chatId: Type.Optional(NonEmptyString),
	subagent: Type.Optional(Type.Literal(true))
});
const validateSystemRunExecutionContext = /* @__PURE__ */ lazyCompile(SystemRunExecutionContextSchema);
//#endregion
export { validateSystemRunExecutionContext as n, SYSTEM_RUN_EXECUTION_CONTEXT_CAPABILITY as t };
