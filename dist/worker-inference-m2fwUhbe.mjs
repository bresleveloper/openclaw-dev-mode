import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { L as WorkerProviderReplayStateSchema } from "./worker-admission-BB3C4gz4.mjs";
import { d as WorkerFrameIdSchema, f as WorkerIdentifierSchema, h as WorkerTranscriptUsageSchema, m as WorkerTranscriptAssistantDiagnosticSchema, n as LiveSequenceSchema, o as WORKER_PROTOCOL_MAX_MEDIA_PAYLOAD_BYTES, r as LiveTextSchema, t as LiveIntegerSchema, u as WorkerErrorResponseFrameSchema } from "./worker-protocol-primitives-vA8IesMt.mjs";
import { Type } from "typebox";
import { Value } from "typebox/value";
//#region packages/gateway-protocol/src/schema/worker-inference.ts
const WORKER_INFERENCE_PROTOCOL_FEATURE = "worker-inference-v1";
const WORKER_INFERENCE_METHODS = ["worker.inference.start", "worker.inference.cancel"];
const WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES = WORKER_PROTOCOL_MAX_MEDIA_PAYLOAD_BYTES;
const WORKER_INFERENCE_MAX_CONTEXT_MESSAGES = 1024;
const WORKER_INFERENCE_MAX_TOOLS = 256;
const WORKER_INFERENCE_MAX_OUTPUT_TOKENS = 1e6;
function workerInferenceObject(properties) {
	return closedObject(properties);
}
const InferenceTextSchema = Type.String({ maxLength: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES });
const OptionalInferenceTextSchema = Type.Optional(InferenceTextSchema);
const WorkerInferenceTextContentSchema = workerInferenceObject({
	type: Type.Literal("text"),
	text: InferenceTextSchema,
	textSignature: OptionalInferenceTextSchema
});
const WorkerInferenceImageContentSchema = workerInferenceObject({
	type: Type.Literal("image"),
	data: Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES
	}),
	mimeType: Type.String({
		minLength: 1,
		maxLength: 256
	})
});
const WorkerInferenceThinkingContentSchema = workerInferenceObject({
	type: Type.Literal("thinking"),
	thinking: InferenceTextSchema,
	thinkingSignature: OptionalInferenceTextSchema,
	redacted: Type.Optional(Type.Boolean())
});
const WorkerInferenceToolCallSchema = workerInferenceObject({
	type: Type.Literal("toolCall"),
	id: WorkerIdentifierSchema,
	name: WorkerIdentifierSchema,
	arguments: Type.Record(Type.String({
		minLength: 1,
		maxLength: 256
	}), Type.Unknown()),
	thoughtSignature: OptionalInferenceTextSchema,
	executionMode: Type.Optional(Type.Union([Type.Literal("sequential"), Type.Literal("parallel")]))
});
const WorkerInferenceUserMessageSchema = workerInferenceObject({
	role: Type.Literal("user"),
	content: Type.Union([InferenceTextSchema, Type.Array(Type.Union([WorkerInferenceTextContentSchema, WorkerInferenceImageContentSchema]), {
		minItems: 1,
		maxItems: 128
	})]),
	timestamp: LiveIntegerSchema,
	runtimeContextCarrier: Type.Optional(Type.Boolean())
});
const WorkerInferenceAssistantMessageProperties = {
	role: Type.Literal("assistant"),
	content: Type.Array(Type.Union([
		WorkerInferenceTextContentSchema,
		WorkerInferenceThinkingContentSchema,
		WorkerInferenceToolCallSchema
	]), { maxItems: 128 }),
	api: WorkerIdentifierSchema,
	provider: WorkerIdentifierSchema,
	model: WorkerIdentifierSchema,
	responseModel: Type.Optional(WorkerIdentifierSchema),
	responseId: Type.Optional(WorkerIdentifierSchema),
	providerReplay: Type.Optional(WorkerProviderReplayStateSchema),
	usage: WorkerTranscriptUsageSchema,
	timestamp: LiveIntegerSchema
};
const WorkerInferenceAssistantMessageSchema = workerInferenceObject({
	...WorkerInferenceAssistantMessageProperties,
	stopReason: Type.Union([
		Type.Literal("stop"),
		Type.Literal("length"),
		Type.Literal("toolUse")
	])
});
const WorkerInferenceContextAssistantMessageSchema = workerInferenceObject({
	...WorkerInferenceAssistantMessageProperties,
	diagnostics: Type.Optional(Type.Array(WorkerTranscriptAssistantDiagnosticSchema, { maxItems: 128 })),
	stopReason: Type.Union([
		Type.Literal("stop"),
		Type.Literal("length"),
		Type.Literal("toolUse"),
		Type.Literal("error"),
		Type.Literal("aborted")
	]),
	errorMessage: OptionalInferenceTextSchema,
	errorCode: Type.Optional(Type.String({ maxLength: 256 })),
	errorType: Type.Optional(Type.String({ maxLength: 256 })),
	errorBody: OptionalInferenceTextSchema
});
const WorkerInferenceMessageSchema = Type.Union([
	WorkerInferenceUserMessageSchema,
	WorkerInferenceContextAssistantMessageSchema,
	workerInferenceObject({
		role: Type.Literal("toolResult"),
		toolCallId: WorkerIdentifierSchema,
		toolName: WorkerIdentifierSchema,
		content: Type.Array(Type.Union([WorkerInferenceTextContentSchema, WorkerInferenceImageContentSchema]), { maxItems: 128 }),
		details: Type.Optional(Type.Unknown()),
		isError: Type.Boolean(),
		timestamp: LiveIntegerSchema
	})
]);
const WorkerInferenceToolSchema = workerInferenceObject({
	name: WorkerIdentifierSchema,
	description: LiveTextSchema,
	parameters: Type.Unknown()
});
const WorkerInferenceModelRefSchema = workerInferenceObject({
	provider: WorkerIdentifierSchema,
	model: WorkerIdentifierSchema
});
const WorkerInferenceContextSchema = workerInferenceObject({
	systemPrompt: Type.Optional(InferenceTextSchema),
	messages: Type.Array(WorkerInferenceMessageSchema, { maxItems: WORKER_INFERENCE_MAX_CONTEXT_MESSAGES }),
	tools: Type.Optional(Type.Array(WorkerInferenceToolSchema, { maxItems: WORKER_INFERENCE_MAX_TOOLS }))
});
const WorkerInferenceReasoningSchema = Type.Union([
	Type.Literal("off"),
	Type.Literal("minimal"),
	Type.Literal("low"),
	Type.Literal("medium"),
	Type.Literal("high"),
	Type.Literal("xhigh"),
	Type.Literal("adaptive"),
	Type.Literal("max")
]);
const WorkerInferenceThinkingBudgetSchema = Type.Integer({
	minimum: 0,
	maximum: WORKER_INFERENCE_MAX_OUTPUT_TOKENS
});
const WorkerInferenceThinkingBudgetsSchema = workerInferenceObject({
	minimal: Type.Optional(WorkerInferenceThinkingBudgetSchema),
	low: Type.Optional(WorkerInferenceThinkingBudgetSchema),
	medium: Type.Optional(WorkerInferenceThinkingBudgetSchema),
	high: Type.Optional(WorkerInferenceThinkingBudgetSchema),
	max: Type.Optional(WorkerInferenceThinkingBudgetSchema)
});
const WorkerInferenceOptionsSchema = workerInferenceObject({
	temperature: Type.Optional(Type.Number({
		minimum: 0,
		maximum: 2
	})),
	maxTokens: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: WORKER_INFERENCE_MAX_OUTPUT_TOKENS
	})),
	reasoning: Type.Optional(WorkerInferenceReasoningSchema),
	thinkingBudgets: Type.Optional(WorkerInferenceThinkingBudgetsSchema)
});
const WorkerInferenceIdentityProperties = {
	runEpoch: LiveIntegerSchema,
	sessionId: WorkerIdentifierSchema,
	runId: WorkerIdentifierSchema,
	turnId: WorkerIdentifierSchema
};
const WorkerInferenceStartParamsSchema = workerInferenceObject({
	...WorkerInferenceIdentityProperties,
	modelRef: WorkerInferenceModelRefSchema,
	context: WorkerInferenceContextSchema,
	options: WorkerInferenceOptionsSchema
});
const WorkerInferenceStartResultSchema = workerInferenceObject({ status: Type.Union([Type.Literal("accepted"), Type.Literal("replayed")]) });
const WorkerInferenceErrorReasonSchema = Type.Union([
	Type.Literal("model-not-approved"),
	Type.Literal("invalid-context"),
	Type.Literal("epoch-mismatch"),
	Type.Literal("session-not-attached"),
	Type.Literal("provider-error"),
	Type.Literal("cancelled")
]);
const WorkerInferenceErrorShapeSchema = workerInferenceObject({
	code: Type.Union([Type.Literal("INVALID_REQUEST"), Type.Literal("UNAVAILABLE")]),
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	details: workerInferenceObject({ reason: WorkerInferenceErrorReasonSchema })
});
const WorkerInferenceStartRequestFrameSchema = workerInferenceObject({
	type: Type.Literal("req"),
	id: WorkerFrameIdSchema,
	method: Type.Literal(WORKER_INFERENCE_METHODS[0]),
	params: WorkerInferenceStartParamsSchema
});
const WorkerInferenceStartSuccessResponseFrameSchema = workerInferenceObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerInferenceStartResultSchema
});
const WorkerInferenceErrorResponseFrameSchema = workerInferenceObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(false),
	error: WorkerInferenceErrorShapeSchema
});
const WorkerInferenceStartResponseFrameSchema = Type.Union([
	WorkerInferenceStartSuccessResponseFrameSchema,
	WorkerInferenceErrorResponseFrameSchema,
	WorkerErrorResponseFrameSchema
]);
const WorkerInferenceCancelParamsSchema = workerInferenceObject({ ...WorkerInferenceIdentityProperties });
const WorkerInferenceCancelResultSchema = workerInferenceObject({ status: Type.Literal("cancelled") });
const WorkerInferenceCancelRequestFrameSchema = workerInferenceObject({
	type: Type.Literal("req"),
	id: WorkerFrameIdSchema,
	method: Type.Literal(WORKER_INFERENCE_METHODS[1]),
	params: WorkerInferenceCancelParamsSchema
});
const WorkerInferenceCancelSuccessResponseFrameSchema = workerInferenceObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerInferenceCancelResultSchema
});
const WorkerInferenceCancelResponseFrameSchema = Type.Union([
	WorkerInferenceCancelSuccessResponseFrameSchema,
	WorkerInferenceErrorResponseFrameSchema,
	WorkerErrorResponseFrameSchema
]);
const WorkerInferenceResolvedModelSchema = workerInferenceObject({
	api: WorkerIdentifierSchema,
	provider: WorkerIdentifierSchema,
	model: WorkerIdentifierSchema
});
const WorkerInferenceStreamEventSchema = Type.Union([
	workerInferenceObject({
		type: Type.Literal("start"),
		resolvedModel: WorkerInferenceResolvedModelSchema,
		timestamp: LiveIntegerSchema
	}),
	workerInferenceObject({
		type: Type.Literal("text_start"),
		contentIndex: LiveIntegerSchema,
		contentSignature: OptionalInferenceTextSchema
	}),
	workerInferenceObject({
		type: Type.Literal("text_delta"),
		contentIndex: LiveIntegerSchema,
		delta: InferenceTextSchema
	}),
	workerInferenceObject({
		type: Type.Literal("text_end"),
		contentIndex: LiveIntegerSchema,
		contentSignature: OptionalInferenceTextSchema
	}),
	workerInferenceObject({
		type: Type.Literal("thinking_start"),
		contentIndex: LiveIntegerSchema
	}),
	workerInferenceObject({
		type: Type.Literal("thinking_delta"),
		contentIndex: LiveIntegerSchema,
		delta: InferenceTextSchema
	}),
	workerInferenceObject({
		type: Type.Literal("thinking_end"),
		contentIndex: LiveIntegerSchema,
		contentSignature: OptionalInferenceTextSchema
	}),
	workerInferenceObject({
		type: Type.Literal("toolcall_start"),
		contentIndex: LiveIntegerSchema,
		id: WorkerIdentifierSchema,
		toolName: WorkerIdentifierSchema
	}),
	workerInferenceObject({
		type: Type.Literal("toolcall_delta"),
		contentIndex: LiveIntegerSchema,
		delta: InferenceTextSchema
	}),
	workerInferenceObject({
		type: Type.Literal("toolcall_end"),
		contentIndex: LiveIntegerSchema
	})
]);
const WorkerInferenceEventParamsSchema = workerInferenceObject({
	...WorkerInferenceIdentityProperties,
	seq: LiveSequenceSchema,
	event: WorkerInferenceStreamEventSchema
});
const WorkerInferenceEventFrameSchema = workerInferenceObject({
	type: Type.Literal("event"),
	event: Type.Literal("worker.inference.event"),
	payload: WorkerInferenceEventParamsSchema
});
const WorkerInferenceTerminalDoneSchema = workerInferenceObject({
	type: Type.Literal("done"),
	message: WorkerInferenceAssistantMessageSchema
});
const WorkerInferenceTerminalErrorSchema = workerInferenceObject({
	type: Type.Literal("error"),
	reason: WorkerInferenceErrorReasonSchema,
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	usage: Type.Optional(WorkerTranscriptUsageSchema)
});
const WorkerInferenceTerminalOutcomeSchema = Type.Union([WorkerInferenceTerminalDoneSchema, WorkerInferenceTerminalErrorSchema]);
const WorkerInferenceTerminalParamsSchema = workerInferenceObject({
	...WorkerInferenceIdentityProperties,
	seq: LiveSequenceSchema,
	outcome: WorkerInferenceTerminalOutcomeSchema
});
const WorkerInferenceTerminalFrameSchema = workerInferenceObject({
	type: Type.Literal("event"),
	event: Type.Literal("worker.inference.terminal"),
	payload: WorkerInferenceTerminalParamsSchema
});
function isSafeWorkerInferenceJson(data) {
	const stack = [{
		depth: 0,
		value: data
	}];
	const seen = /* @__PURE__ */ new WeakSet();
	while (stack.length > 0) {
		const current = stack.pop();
		if (!current || current.depth > 32) return false;
		if (current.value === null || typeof current.value === "string" || typeof current.value === "boolean") continue;
		if (typeof current.value === "number") {
			if (!Number.isFinite(current.value)) return false;
			continue;
		}
		if (typeof current.value !== "object" || seen.has(current.value)) return false;
		seen.add(current.value);
		const values = Array.isArray(current.value) ? current.value : Object.values(current.value);
		for (const value of values) stack.push({
			depth: current.depth + 1,
			value
		});
	}
	return true;
}
function validateWorkerInferenceStartParams(data) {
	return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceStartParamsSchema, data);
}
function validateWorkerInferenceCancelParams(data) {
	return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceCancelParamsSchema, data);
}
function validateWorkerInferenceTerminalOutcome(data) {
	return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceTerminalOutcomeSchema, data);
}
function validateWorkerInferenceEventFrame(data) {
	return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceEventFrameSchema, data);
}
function validateWorkerInferenceTerminalFrame(data) {
	return isSafeWorkerInferenceJson(data) && Value.Check(WorkerInferenceTerminalFrameSchema, data);
}
//#endregion
export { validateWorkerInferenceTerminalOutcome as _, WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES as a, WorkerInferenceImageContentSchema as c, WorkerInferenceStartRequestFrameSchema as d, WorkerInferenceStartResponseFrameSchema as f, validateWorkerInferenceTerminalFrame as g, validateWorkerInferenceStartParams as h, WORKER_INFERENCE_PROTOCOL_FEATURE as i, WorkerInferenceModelRefSchema as l, validateWorkerInferenceEventFrame as m, WORKER_INFERENCE_MAX_OUTPUT_TOKENS as n, WorkerInferenceCancelRequestFrameSchema as o, validateWorkerInferenceCancelParams as p, WORKER_INFERENCE_METHODS as r, WorkerInferenceCancelResponseFrameSchema as s, WORKER_INFERENCE_MAX_CONTEXT_MESSAGES as t, WorkerInferenceOptionsSchema as u };
