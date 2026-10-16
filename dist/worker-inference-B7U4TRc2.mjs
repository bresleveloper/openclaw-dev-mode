import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { C as workerResponseSchema, S as workerRequestSchema, _ as checkWorkerProtocolJson, b as workerErrorResponseSchema, g as WorkerTranscriptUsageSchema, n as LiveSequenceSchema, o as WORKER_PROTOCOL_MAX_MEDIA_PAYLOAD_BYTES, p as WorkerIdentifierSchema, r as LiveTextSchema, t as LiveIntegerSchema, x as workerMessageSchemas } from "./worker-protocol-primitives-BajTgPT4.mjs";
import { Type } from "typebox";
import { Value } from "typebox/value";
//#region packages/gateway-protocol/src/schema/worker-inference.ts
const WORKER_INFERENCE_PROTOCOL_FEATURE = "worker-inference-v1";
const WORKER_INFERENCE_METHODS = ["worker.inference.start", "worker.inference.cancel"];
const WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES = WORKER_PROTOCOL_MAX_MEDIA_PAYLOAD_BYTES;
const WORKER_INFERENCE_MAX_CONTEXT_MESSAGES = 1024;
const WORKER_INFERENCE_MAX_TOOLS = 256;
const WORKER_INFERENCE_MAX_OUTPUT_TOKENS = 1e6;
const InferenceTextSchema = Type.String({ maxLength: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES });
const OptionalInferenceTextSchema = Type.Optional(InferenceTextSchema);
const inferenceSchemas = workerMessageSchemas(InferenceTextSchema, InferenceTextSchema, LiveIntegerSchema);
const WorkerInferenceImageContentSchema = inferenceSchemas.image;
const WorkerInferenceAssistantMessageSchema = closedObject({
	...inferenceSchemas.assistant,
	stopReason: Type.Enum([
		"stop",
		"length",
		"toolUse"
	])
});
const WorkerInferenceMessageSchema = Type.Union([
	closedObject({
		role: Type.Literal("user"),
		content: Type.Union([InferenceTextSchema, Type.Array(closedObject({
			type: Type.Literal("text"),
			text: InferenceTextSchema,
			textSignature: Type.Optional(InferenceTextSchema)
		}), {
			minItems: 1,
			maxItems: 128
		})]),
		timestamp: LiveIntegerSchema,
		runtimeContext: closedObject({ retained: Type.Optional(Type.Boolean()) })
	}),
	closedObject({
		role: Type.Literal("user"),
		content: Type.Union([InferenceTextSchema, inferenceSchemas.userContent]),
		timestamp: LiveIntegerSchema
	}),
	inferenceSchemas.contextAssistant,
	inferenceSchemas.toolResult
]);
const WorkerInferenceToolSchema = closedObject({
	name: WorkerIdentifierSchema,
	description: LiveTextSchema,
	parameters: Type.Unknown()
});
const WorkerInferenceModelRefSchema = closedObject({
	provider: WorkerIdentifierSchema,
	model: WorkerIdentifierSchema
});
const WorkerInferenceContextSchema = closedObject({
	systemPrompt: Type.Optional(InferenceTextSchema),
	messages: Type.Array(WorkerInferenceMessageSchema, { maxItems: WORKER_INFERENCE_MAX_CONTEXT_MESSAGES }),
	tools: Type.Optional(Type.Array(WorkerInferenceToolSchema, { maxItems: WORKER_INFERENCE_MAX_TOOLS }))
});
const WorkerInferenceThinkingBudgetSchema = Type.Integer({
	minimum: 0,
	maximum: WORKER_INFERENCE_MAX_OUTPUT_TOKENS
});
const WorkerInferenceThinkingBudgetsSchema = closedObject({
	minimal: Type.Optional(WorkerInferenceThinkingBudgetSchema),
	low: Type.Optional(WorkerInferenceThinkingBudgetSchema),
	medium: Type.Optional(WorkerInferenceThinkingBudgetSchema),
	high: Type.Optional(WorkerInferenceThinkingBudgetSchema),
	max: Type.Optional(WorkerInferenceThinkingBudgetSchema)
});
const WorkerInferenceOptionsSchema = closedObject({
	temperature: Type.Optional(Type.Number({
		minimum: 0,
		maximum: 2
	})),
	maxTokens: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: WORKER_INFERENCE_MAX_OUTPUT_TOKENS
	})),
	reasoning: Type.Optional(Type.Enum([
		"off",
		"minimal",
		"low",
		"medium",
		"high",
		"xhigh",
		"adaptive",
		"max"
	])),
	thinkingBudgets: Type.Optional(WorkerInferenceThinkingBudgetsSchema)
});
const WorkerInferenceIdentityProperties = {
	runEpoch: LiveIntegerSchema,
	sessionId: WorkerIdentifierSchema,
	runId: WorkerIdentifierSchema,
	turnId: WorkerIdentifierSchema
};
const WorkerInferenceStartParamsSchema = closedObject({
	...WorkerInferenceIdentityProperties,
	modelRef: WorkerInferenceModelRefSchema,
	context: WorkerInferenceContextSchema,
	options: WorkerInferenceOptionsSchema
});
const WorkerInferenceStartResultSchema = closedObject({ status: Type.Enum(["accepted", "replayed"]) });
const WorkerInferenceErrorReasonSchema = Type.Enum([
	"model-not-approved",
	"invalid-context",
	"epoch-mismatch",
	"session-not-attached",
	"provider-error",
	"cancelled"
]);
const WorkerInferenceErrorShapeSchema = closedObject({
	code: Type.Enum(["INVALID_REQUEST", "UNAVAILABLE"]),
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	details: closedObject({ reason: WorkerInferenceErrorReasonSchema })
});
const WorkerInferenceStartRequestFrameSchema = workerRequestSchema(WORKER_INFERENCE_METHODS[0], WorkerInferenceStartParamsSchema);
const WorkerInferenceErrorResponseFrameSchema = workerErrorResponseSchema(WorkerInferenceErrorShapeSchema);
const WorkerInferenceStartResponseFrameSchema = workerResponseSchema(WorkerInferenceStartResultSchema, WorkerInferenceErrorResponseFrameSchema);
const WorkerInferenceCancelParamsSchema = closedObject({ ...WorkerInferenceIdentityProperties });
const WorkerInferenceCancelResultSchema = closedObject({ status: Type.Literal("cancelled") });
const WorkerInferenceCancelRequestFrameSchema = workerRequestSchema(WORKER_INFERENCE_METHODS[1], WorkerInferenceCancelParamsSchema);
const WorkerInferenceCancelResponseFrameSchema = workerResponseSchema(WorkerInferenceCancelResultSchema, WorkerInferenceErrorResponseFrameSchema);
const WorkerInferenceResolvedModelSchema = closedObject({
	api: WorkerIdentifierSchema,
	provider: WorkerIdentifierSchema,
	model: WorkerIdentifierSchema
});
function inferenceContentEvent(type, properties) {
	return closedObject({
		type: Type.Literal(type),
		contentIndex: LiveIntegerSchema,
		...properties
	});
}
const WorkerInferenceStreamEventSchema = Type.Union([
	closedObject({
		type: Type.Literal("start"),
		resolvedModel: WorkerInferenceResolvedModelSchema,
		timestamp: LiveIntegerSchema
	}),
	inferenceContentEvent("text_start", { contentSignature: OptionalInferenceTextSchema }),
	inferenceContentEvent("text_delta", { delta: InferenceTextSchema }),
	inferenceContentEvent("text_end", { contentSignature: OptionalInferenceTextSchema }),
	inferenceContentEvent("thinking_start", {}),
	inferenceContentEvent("thinking_delta", { delta: InferenceTextSchema }),
	inferenceContentEvent("thinking_end", { contentSignature: OptionalInferenceTextSchema }),
	inferenceContentEvent("toolcall_start", {
		id: WorkerIdentifierSchema,
		toolName: WorkerIdentifierSchema
	}),
	inferenceContentEvent("toolcall_delta", { delta: InferenceTextSchema }),
	inferenceContentEvent("toolcall_end", {})
]);
const WorkerInferenceEventParamsSchema = closedObject({
	...WorkerInferenceIdentityProperties,
	seq: LiveSequenceSchema,
	event: WorkerInferenceStreamEventSchema
});
const WorkerInferenceEventFrameSchema = closedObject({
	type: Type.Literal("event"),
	event: Type.Literal("worker.inference.event"),
	payload: WorkerInferenceEventParamsSchema
});
const WorkerInferenceTerminalDoneSchema = closedObject({
	type: Type.Literal("done"),
	message: WorkerInferenceAssistantMessageSchema
});
const WorkerInferenceTerminalErrorSchema = closedObject({
	type: Type.Literal("error"),
	reason: WorkerInferenceErrorReasonSchema,
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	usage: Type.Optional(WorkerTranscriptUsageSchema)
});
const WorkerInferenceTerminalOutcomeSchema = Type.Union([WorkerInferenceTerminalDoneSchema, WorkerInferenceTerminalErrorSchema]);
const WorkerInferenceTerminalParamsSchema = closedObject({
	...WorkerInferenceIdentityProperties,
	seq: LiveSequenceSchema,
	outcome: WorkerInferenceTerminalOutcomeSchema
});
const WorkerInferenceTerminalFrameSchema = closedObject({
	type: Type.Literal("event"),
	event: Type.Literal("worker.inference.terminal"),
	payload: WorkerInferenceTerminalParamsSchema
});
function workerInferenceValidator(schema) {
	return (data) => !checkWorkerProtocolJson(data) && Value.Check(schema, data);
}
const validateWorkerInferenceStartParams = workerInferenceValidator(WorkerInferenceStartParamsSchema);
const validateWorkerInferenceCancelParams = workerInferenceValidator(WorkerInferenceCancelParamsSchema);
const validateWorkerInferenceTerminalOutcome = workerInferenceValidator(WorkerInferenceTerminalOutcomeSchema);
const validateWorkerInferenceEventFrame = workerInferenceValidator(WorkerInferenceEventFrameSchema);
const validateWorkerInferenceTerminalFrame = workerInferenceValidator(WorkerInferenceTerminalFrameSchema);
//#endregion
export { validateWorkerInferenceTerminalOutcome as _, WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES as a, WorkerInferenceImageContentSchema as c, WorkerInferenceStartRequestFrameSchema as d, WorkerInferenceStartResponseFrameSchema as f, validateWorkerInferenceTerminalFrame as g, validateWorkerInferenceStartParams as h, WORKER_INFERENCE_PROTOCOL_FEATURE as i, WorkerInferenceModelRefSchema as l, validateWorkerInferenceEventFrame as m, WORKER_INFERENCE_MAX_OUTPUT_TOKENS as n, WorkerInferenceCancelRequestFrameSchema as o, validateWorkerInferenceCancelParams as p, WORKER_INFERENCE_METHODS as r, WorkerInferenceCancelResponseFrameSchema as s, WORKER_INFERENCE_MAX_CONTEXT_MESSAGES as t, WorkerInferenceOptionsSchema as u };
