import { Et as _enum, Fn as object, Jn as string, Nt as array, Yt as discriminatedUnion, xn as literal } from "./schemas-BOYIvvln.mjs";
import { U as SessionsFilesListResultSchema, V as SessionsFilesGetResultSchema, d as SessionFileEntrySchema, z as SessionsDiffResultSchema } from "./sessions-KsldKmtI.mjs";
import { Type } from "typebox";
import { Value } from "typebox/value";
//#region src/worker/workspace-inspection-protocol.ts
const WORKSPACE_INSPECTION_COMMAND = "openclaw-internal-workspace-inspect";
const WORKSPACE_INSPECTION_MAX_BYTES = 2097152;
function isWorkspaceInspectionCommand(argv) {
	return argv.length === 1 && argv[0] === "openclaw-internal-workspace-inspect";
}
const text = string().min(1).max(4096);
const files = array(object({
	path: text,
	kind: _enum(["read", "modified"])
}).strict());
const owner = { sessionKey: text };
const schema = discriminatedUnion("operation", [
	object({
		...owner,
		operation: literal("list"),
		path: string().optional(),
		search: string().optional(),
		files
	}).strict(),
	object({
		...owner,
		operation: literal("get"),
		path: text,
		files
	}).strict(),
	object({
		...owner,
		operation: literal("set"),
		path: text,
		content: string(),
		expectedHash: string().regex(/^[a-f0-9]{64}$/u)
	}).strict(),
	object({
		...owner,
		operation: literal("diff"),
		scope: _enum([
			"all",
			"uncommitted",
			"commit"
		]),
		commit: text.optional(),
		baseCommit: string().regex(/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u)
	}).strict()
]);
function parseWorkspaceInspectionInput(input) {
	if (!input || Buffer.byteLength(input) > 2097152) throw new Error("INVALID_REQUEST: workspace inspection input exceeds its bound");
	let value;
	try {
		value = JSON.parse(input);
	} catch {
		throw new Error("INVALID_REQUEST: workspace inspection input is not valid JSON");
	}
	const checked = schema.safeParse(value);
	if (!checked.success) throw new Error("INVALID_REQUEST: workspace inspection input is invalid");
	const parsed = checked.data;
	if (parsed.operation === "diff" && parsed.scope === "commit" !== (parsed.commit !== void 0)) throw new Error("INVALID_REQUEST: commit is required only for commit inspection");
	return parsed;
}
const writeResult = Type.Union([
	Type.Object({
		status: Type.Literal("updated"),
		root: Type.String(),
		file: SessionFileEntrySchema
	}, { additionalProperties: false }),
	Type.Object({
		status: Type.Literal("conflict"),
		currentHash: Type.String({ pattern: "^[a-f0-9]{64}$" })
	}, { additionalProperties: false }),
	Type.Object({ status: Type.Literal("unsafe") }, { additionalProperties: false }),
	Type.Object({ status: Type.Literal("missing") }, { additionalProperties: false }),
	Type.Object({
		status: Type.Literal("too-large"),
		size: Type.Integer({ minimum: 0 })
	}, { additionalProperties: false })
]);
const resultSchemas = {
	list: Type.Omit(SessionsFilesListResultSchema, ["sessionKey"]),
	get: Type.Partial(Type.Omit(SessionsFilesGetResultSchema, ["sessionKey"])),
	set: writeResult,
	diff: SessionsDiffResultSchema
};
function parseWorkspaceInspectionResult(operation, raw) {
	if (Buffer.byteLength(raw) > 2097152) throw new Error("Workspace inspection result exceeds its bound");
	const value = JSON.parse(raw);
	if (!Value.Check(resultSchemas[operation], value)) throw new Error("Workspace inspection returned an invalid result");
	return value;
}
//#endregion
export { parseWorkspaceInspectionResult as a, parseWorkspaceInspectionInput as i, WORKSPACE_INSPECTION_MAX_BYTES as n, isWorkspaceInspectionCommand as r, WORKSPACE_INSPECTION_COMMAND as t };
