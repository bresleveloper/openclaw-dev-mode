import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/validation-errors.ts
function checkProtocolJson(data, maxDepth) {
	const stack = [{
		depth: 0,
		value: data
	}];
	const seen = /* @__PURE__ */ new WeakSet();
	while (stack.length > 0) {
		const current = stack.pop();
		if (!current) break;
		if (current.depth > maxDepth) return {
			keyword: "maxDepth",
			params: { limit: maxDepth },
			message: `must not exceed JSON nesting depth ${maxDepth}`
		};
		if (current.value === null || typeof current.value === "string" || typeof current.value === "boolean") continue;
		if (typeof current.value === "number") {
			if (!Number.isFinite(current.value)) return {
				keyword: "finite",
				message: "must contain only finite JSON numbers"
			};
			continue;
		}
		if (typeof current.value !== "object") return {
			keyword: "jsonValue",
			message: "must contain only JSON values"
		};
		if (seen.has(current.value)) return {
			keyword: "acyclic",
			message: "must be an acyclic JSON value"
		};
		seen.add(current.value);
		const values = Array.isArray(current.value) ? current.value : Object.values(current.value);
		for (const value of values) stack.push({
			depth: current.depth + 1,
			value
		});
	}
}
function firstStringParam(value) {
	if (typeof value === "string" && value.trim()) return value;
	if (Array.isArray(value)) return value.find((entry) => typeof entry === "string" && entry.trim().length > 0);
}
/** Convert validator errors into compact operator-facing failure text. */
function formatValidationErrors(errors) {
	if (!errors?.length) return "unknown validation error";
	const parts = [];
	for (const err of errors) {
		const keyword = typeof err?.keyword === "string" ? err.keyword : "";
		const instancePath = typeof err?.instancePath === "string" ? err.instancePath : "";
		if (keyword === "additionalProperties") {
			const additionalProperty = firstStringParam(err?.params?.additionalProperty) ?? firstStringParam(err?.params?.additionalProperties);
			if (additionalProperty) {
				const where = instancePath ? `at ${instancePath}` : "at root";
				parts.push(`${where}: unexpected property '${additionalProperty}'`);
				continue;
			}
		}
		if (keyword === "required") {
			const missingProperty = firstStringParam(err?.params?.missingProperty) ?? firstStringParam(err?.params?.requiredProperties);
			if (missingProperty) {
				const where = instancePath ? `at ${instancePath}: ` : "";
				parts.push(`${where}must have required property '${missingProperty}'`);
				continue;
			}
		}
		const failingKeyword = typeof err?.params?.failingKeyword === "string" ? err.params.failingKeyword : "";
		const message = keyword === "then" || keyword === "if" && failingKeyword === "then" ? "must have required conditional properties" : typeof err?.message === "string" && err.message.trim() ? err.message : "validation error";
		const where = instancePath ? `at ${instancePath}: ` : "";
		parts.push(`${where}${message}`);
	}
	const unique = [...new Set(parts.filter((part) => part.trim()))];
	return unique.length > 0 ? unique.join("; ") : "unknown validation error";
}
//#endregion
//#region packages/gateway-protocol/src/schema/worker-protocol-primitives.ts
const WORKER_PUBLIC_INGRESS_PATH = "/__openclaw__/worker";
const WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH = 256;
const WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH = 128;
const WORKER_PROTOCOL_MAX_PAYLOAD_BYTES = 65536;
const WORKER_PROTOCOL_MAX_MEDIA_PAYLOAD_BYTES = 26214400;
/** Image data alone may exceed the ordinary control-frame budget. */
function isWorkerFrameWithinBudget(frame, readImageData) {
	try {
		const bytes = Buffer.byteLength(JSON.stringify(frame), "utf8");
		if (bytes > 26214400) return false;
		return bytes - readImageData().reduce((total, data) => total + Buffer.byteLength(JSON.stringify(data), "utf8") - 2, 0) <= WORKER_PROTOCOL_MAX_PAYLOAD_BYTES;
	} catch {
		return false;
	}
}
const WorkerIdentifierSchema = Type.String({
	minLength: 1,
	maxLength: 256,
	pattern: "^\\S(?:.*\\S)?$"
});
const WorkerFrameIdSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
function workerRequestSchema(method, params) {
	return closedObject({
		type: Type.Literal("req"),
		id: WorkerFrameIdSchema,
		method: Type.Literal(method),
		params
	});
}
const WorkerAdmissionFailureReasonSchema = Type.Union([
	Type.Literal("invalid-credential"),
	Type.Literal("credential-expired"),
	Type.Literal("environment-mismatch"),
	Type.Literal("environment-unavailable"),
	Type.Literal("bundle-mismatch"),
	Type.Literal("version-mismatch"),
	Type.Literal("session-mismatch"),
	Type.Literal("placement-mismatch"),
	Type.Literal("owner-epoch-mismatch"),
	Type.Literal("rpc-set-mismatch"),
	Type.Literal("protocol-features-mismatch")
]);
const WorkerProtocolCloseReasonSchema = Type.Union([
	WorkerAdmissionFailureReasonSchema,
	Type.Literal("admission-rejected"),
	Type.Literal("invalid-handshake"),
	Type.Literal("protocol-mismatch"),
	Type.Literal("gateway-unavailable"),
	Type.Literal("invalid-frame"),
	Type.Literal("slow-consumer"),
	Type.Literal("method-not-allowed"),
	Type.Literal("invalid-heartbeat"),
	Type.Literal("credential-replaced"),
	Type.Literal("gateway-shutdown")
]);
const WorkerErrorShapeSchema = closedObject({
	code: Type.Union([Type.Literal("INVALID_REQUEST"), Type.Literal("UNAVAILABLE")]),
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	details: closedObject({ reason: WorkerProtocolCloseReasonSchema }),
	retryable: Type.Optional(Type.Boolean()),
	retryAfterMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
function workerErrorResponseSchema(error) {
	return closedObject({
		type: Type.Literal("res"),
		id: WorkerFrameIdSchema,
		ok: Type.Literal(false),
		error
	});
}
const WorkerErrorResponseFrameSchema = workerErrorResponseSchema(WorkerErrorShapeSchema);
function workerResponseSchema(payload, ...errors) {
	return Type.Union([
		closedObject({
			type: Type.Literal("res"),
			id: WorkerFrameIdSchema,
			ok: Type.Literal(true),
			payload
		}),
		...errors,
		WorkerErrorResponseFrameSchema
	]);
}
const WorkerTranscriptUsageSchema = closedObject({
	input: Type.Number({ minimum: 0 }),
	output: Type.Number({ minimum: 0 }),
	cacheRead: Type.Number({ minimum: 0 }),
	cacheWrite: Type.Number({ minimum: 0 }),
	contextUsage: Type.Optional(Type.Union([closedObject({
		state: Type.Literal("available"),
		promptTokens: Type.Number({ minimum: 0 }),
		totalTokens: Type.Number({ minimum: 0 })
	}), closedObject({ state: Type.Literal("unavailable") })])),
	totalTokens: Type.Number({ minimum: 0 }),
	cost: closedObject({
		input: Type.Number({ minimum: 0 }),
		output: Type.Number({ minimum: 0 }),
		cacheRead: Type.Number({ minimum: 0 }),
		cacheWrite: Type.Number({ minimum: 0 }),
		total: Type.Number({ minimum: 0 }),
		totalOrigin: Type.Optional(Type.Literal("provider-billed"))
	})
});
const WorkerTranscriptAssistantDiagnosticSchema = closedObject({
	type: WorkerIdentifierSchema,
	timestamp: Type.Integer({ minimum: 0 }),
	error: Type.Optional(closedObject({
		name: Type.Optional(Type.String({ maxLength: 256 })),
		message: Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
		stack: Type.Optional(Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
		code: Type.Optional(Type.Union([Type.String({ maxLength: 256 }), Type.Number()]))
	})),
	details: Type.Optional(Type.Record(Type.String({
		minLength: 1,
		maxLength: 256
	}), Type.Unknown()))
});
const LiveTextSchema = Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES });
const LiveIntegerSchema = Type.Integer({
	minimum: 0,
	maximum: Number.MAX_SAFE_INTEGER
});
const LiveSequenceSchema = Type.Integer({
	minimum: 1,
	maximum: Number.MAX_SAFE_INTEGER
});
const WORKER_TRANSCRIPT_MAX_CONTENT_PARTS = 128;
const WORKER_TRANSCRIPT_MAX_JSON_DEPTH = 32;
const WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES = WORKER_PROTOCOL_MAX_PAYLOAD_BYTES;
const WorkerReplayHashSchema = Type.String({
	minLength: 2,
	maxLength: 16,
	pattern: "^[a-z0-9]+$"
});
const WorkerProviderReplayStateSchema = closedObject({
	v: Type.Literal(1),
	type: WorkerIdentifierSchema,
	id: Type.Optional(Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
	})),
	data: Type.String({
		minLength: 1,
		maxLength: WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES
	}),
	replayIndex: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})),
	provider: WorkerIdentifierSchema,
	api: WorkerIdentifierSchema,
	model: WorkerIdentifierSchema,
	baseUrlHash: Type.Optional(WorkerReplayHashSchema),
	sessionHash: Type.Optional(WorkerReplayHashSchema),
	authProfileHash: Type.Optional(WorkerReplayHashSchema)
});
function workerContentSchemas(text, signature, imageData) {
	return {
		text: closedObject({
			type: Type.Literal("text"),
			text,
			textSignature: Type.Optional(signature)
		}),
		image: closedObject({
			type: Type.Literal("image"),
			data: imageData,
			mimeType: Type.String({
				minLength: 1,
				maxLength: 256
			})
		}),
		thinking: closedObject({
			type: Type.Literal("thinking"),
			thinking: text,
			thinkingSignature: Type.Optional(signature),
			redacted: Type.Optional(Type.Boolean())
		}),
		toolCall: closedObject({
			type: Type.Literal("toolCall"),
			id: WorkerIdentifierSchema,
			name: WorkerIdentifierSchema,
			arguments: Type.Record(Type.String({
				minLength: 1,
				maxLength: 256
			}), Type.Unknown()),
			thoughtSignature: Type.Optional(signature),
			executionMode: Type.Optional(Type.Enum(["sequential", "parallel"]))
		})
	};
}
function workerMessageSchemas(text, signature, timestamp) {
	const content = workerContentSchemas(text, signature, Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_MEDIA_PAYLOAD_BYTES
	}));
	const textOrImage = Type.Union([content.text, content.image]);
	const assistant = {
		role: Type.Literal("assistant"),
		content: Type.Array(Type.Union([
			content.text,
			content.thinking,
			content.toolCall
		]), { maxItems: 128 }),
		api: WorkerIdentifierSchema,
		provider: WorkerIdentifierSchema,
		model: WorkerIdentifierSchema,
		responseModel: Type.Optional(WorkerIdentifierSchema),
		responseId: Type.Optional(WorkerIdentifierSchema),
		providerReplay: Type.Optional(WorkerProviderReplayStateSchema),
		usage: WorkerTranscriptUsageSchema,
		timestamp
	};
	return {
		image: content.image,
		userContent: Type.Array(textOrImage, {
			minItems: 1,
			maxItems: 128
		}),
		assistant,
		contextAssistant: closedObject({
			...assistant,
			diagnostics: Type.Optional(Type.Array(WorkerTranscriptAssistantDiagnosticSchema, { maxItems: 128 })),
			stopReason: Type.Enum([
				"stop",
				"length",
				"toolUse",
				"error",
				"aborted"
			]),
			errorMessage: Type.Optional(text),
			errorCode: Type.Optional(Type.String({ maxLength: 256 })),
			errorType: Type.Optional(Type.String({ maxLength: 256 })),
			errorBody: Type.Optional(text)
		}),
		toolResult: closedObject({
			role: Type.Literal("toolResult"),
			toolCallId: WorkerIdentifierSchema,
			toolName: WorkerIdentifierSchema,
			content: Type.Array(textOrImage, { maxItems: 128 }),
			details: Type.Optional(Type.Unknown()),
			isError: Type.Boolean(),
			timestamp
		})
	};
}
function checkWorkerProtocolJson(data) {
	return checkProtocolJson(data, 32);
}
//#endregion
export { workerResponseSchema as C, workerRequestSchema as S, checkWorkerProtocolJson as _, WORKER_PROTOCOL_MAX_IDENTIFIER_LENGTH as a, workerErrorResponseSchema as b, WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES as c, WORKER_TRANSCRIPT_MAX_JSON_DEPTH as d, WorkerAdmissionFailureReasonSchema as f, WorkerTranscriptUsageSchema as g, WorkerProviderReplayStateSchema as h, WORKER_PROTOCOL_MAX_FRAME_ID_LENGTH as i, WORKER_PUBLIC_INGRESS_PATH as l, WorkerProtocolCloseReasonSchema as m, LiveSequenceSchema as n, WORKER_PROTOCOL_MAX_MEDIA_PAYLOAD_BYTES as o, WorkerIdentifierSchema as p, LiveTextSchema as r, WORKER_PROTOCOL_MAX_PAYLOAD_BYTES as s, LiveIntegerSchema as t, WORKER_TRANSCRIPT_MAX_CONTENT_PARTS as u, isWorkerFrameWithinBudget as v, formatValidationErrors as w, workerMessageSchemas as x, workerContentSchemas as y };
