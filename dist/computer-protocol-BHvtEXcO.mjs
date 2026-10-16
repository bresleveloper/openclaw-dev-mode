import { Et as _enum, Jn as string, Nt as array, Yt as discriminatedUnion, qn as strictObject, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
//#region src/gateway/desktop/computer-protocol.ts
const command = _enum(["screen.snapshot", "computer.act"]);
const executionCloseSchema = strictObject({
	executionId: string().min(1),
	reason: string().min(1).max(64)
});
/** The helper and its owned processes are gone, but provider finalization failed. */
var ComputerHostFinalizationError = class extends Error {
	constructor(cause) {
		super(cause.message, { cause });
		this.name = "ComputerHostFinalizationError";
	}
};
const inputSchema = discriminatedUnion("type", [
	strictObject({
		type: literal("start"),
		pluginIds: array(string().min(1)).min(1)
	}),
	strictObject({
		type: literal("invoke"),
		id: string().min(1),
		command,
		paramsJSON: string(),
		sessionKey: string().optional()
	}),
	strictObject({
		type: literal("cancel"),
		id: string().min(1)
	}),
	strictObject({
		type: literal("stop"),
		execution: executionCloseSchema.optional()
	})
]);
const outputSchema = discriminatedUnion("type", [
	strictObject({
		type: literal("ready"),
		computerUse: unknown()
	}),
	strictObject({
		type: literal("result"),
		id: string(),
		payload: string()
	}),
	strictObject({
		type: literal("error"),
		id: string().optional(),
		message: string()
	})
]);
const parseComputerHostInput = (value) => inputSchema.parse(value);
const parseComputerHostOutput = (value) => outputSchema.parse(value);
//#endregion
export { parseComputerHostInput as n, parseComputerHostOutput as r, ComputerHostFinalizationError as t };
