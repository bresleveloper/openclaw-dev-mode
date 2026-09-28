import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { i as compile } from "./compile-wI2qQAAF.mjs";
import { t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
//#region src/sessions/nested-tool-activity.ts
const NESTED_TOOL_ACTIVITY_CUSTOM_TYPE = "openclaw.nested-tool.v1";
const correlationId = string().min(1).max(1024);
const activityDetails = object({
	runId: correlationId,
	scopeId: correlationId,
	afterEntryId: correlationId.nullable(),
	startOrder: number().int().nonnegative(),
	parentToolCallId: correlationId.optional(),
	toolCallId: correlationId,
	toolName: string().min(1).max(256),
	input: unknown(),
	result: object({
		content: array(unknown()),
		details: unknown().optional()
	}),
	isError: boolean(),
	startedAt: number().finite(),
	timestamp: number().finite()
}).strict();
const activitySchema = object({
	role: literal("custom"),
	customType: literal(NESTED_TOOL_ACTIVITY_CUSTOM_TYPE),
	display: literal(true),
	excludeFromContext: literal(true),
	content: literal(""),
	details: activityDetails,
	timestamp: number().finite()
});
let compiledActivitySchema;
function getActivitySchema() {
	return compiledActivitySchema ??= compile(activitySchema);
}
/** Validate correlation slots separately from the payloads that always require redaction. */
function readNestedToolActivity(value) {
	if (asOptionalRecord(value)?.customType !== NESTED_TOOL_ACTIVITY_CUSTOM_TYPE) return;
	const parsed = getActivitySchema().safeParse(value);
	return parsed.success ? parsed.data : void 0;
}
/** Keep each terminal activity bounded independently of provider context. */
function createNestedToolActivity(details) {
	const input = boundedJsonUtf8Bytes(details.input, 8192).complete ? structuredClone(details.input) : "[Nested tool input omitted: exceeds display limit]";
	const result = boundedJsonUtf8Bytes(details.result, 32768).complete ? details.result : { content: [{
		type: "text",
		text: "[Nested tool output omitted: exceeds display limit]"
	}] };
	return getActivitySchema().parse({
		role: "custom",
		customType: NESTED_TOOL_ACTIVITY_CUSTOM_TYPE,
		display: true,
		excludeFromContext: true,
		content: "",
		details: {
			...details,
			input,
			result
		},
		timestamp: details.startedAt
	});
}
/** Tool-card content for public history. */
function nestedToolActivityContent({ details }) {
	const { input, result, ...call } = details;
	return [{
		type: "toolCall",
		id: call.toolCallId,
		runId: call.runId,
		name: call.toolName,
		arguments: input,
		parentToolCallId: call.parentToolCallId,
		timestamp: call.startedAt
	}, {
		...call,
		...result,
		type: "toolResult"
	}];
}
/** Hooks retain call/result evidence; model snapshots and context engines stay unchanged. */
function projectNestedToolActivityForHooks(messages, activities) {
	return [...messages, ...activities.map((activity) => ({
		...activity,
		content: JSON.stringify({
			scopeId: activity.details.scopeId,
			toolCallId: activity.details.toolCallId,
			toolName: activity.details.toolName,
			isError: activity.details.isError
		})
	}))];
}
//#endregion
export { readNestedToolActivity as i, nestedToolActivityContent as n, projectNestedToolActivityForHooks as r, createNestedToolActivity as t };
