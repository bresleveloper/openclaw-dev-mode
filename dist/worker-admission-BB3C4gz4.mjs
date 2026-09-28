import { t as FAILOVER_REASONS } from "./failover-reasons-Mjd0tFtT.mjs";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { d as WorkerFrameIdSchema, f as WorkerIdentifierSchema, h as WorkerTranscriptUsageSchema, m as WorkerTranscriptAssistantDiagnosticSchema, n as LiveSequenceSchema, o as WORKER_PROTOCOL_MAX_MEDIA_PAYLOAD_BYTES, r as LiveTextSchema, s as WORKER_PROTOCOL_MAX_PAYLOAD_BYTES, t as LiveIntegerSchema, u as WorkerErrorResponseFrameSchema } from "./worker-protocol-primitives-vA8IesMt.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/failover-reason.ts
const failoverReasonLiteralSchemas = FAILOVER_REASONS.map((reason) => Type.Literal(reason));
/** Closed failure reasons shared by model fallback producers and protocol consumers. */
const FailoverReasonSchema = Type.Union(failoverReasonLiteralSchemas);
//#endregion
//#region packages/gateway-protocol/src/schema/since.ts
/** Adds protocol-vintage metadata without changing the schema's validated value shape. */
function withSince(train, schema) {
	Object.assign(schema, { "x-openclaw-since": train });
	return schema;
}
//#endregion
//#region packages/gateway-protocol/src/schema/worker-computer.ts
const WORKER_COMPUTER_PROTOCOL_FEATURE = "worker-computer-v1";
const WorkerComputerParamsSchema = closedObject({
	command: Type.Enum(["screen.snapshot", "computer.act"], { type: "string" }),
	paramsJson: Type.String({
		minLength: 2,
		maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
	}),
	timeoutMs: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 12e4
	})),
	idempotencyKey: Type.Optional(WorkerIdentifierSchema)
});
const WorkerComputerResultSchema = closedObject({ resultJson: Type.String({
	minLength: 2,
	maxLength: WORKER_PROTOCOL_MAX_MEDIA_PAYLOAD_BYTES
}) });
const WorkerComputerResponseFrameSchema = Type.Union([closedObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerComputerResultSchema
}), WorkerErrorResponseFrameSchema]);
//#endregion
//#region packages/gateway-protocol/src/schema/worker-admission.ts
const WORKER_RPC_SET_VERSION = 1;
const WORKER_BUNDLE_PREWARM_VERSION = 1;
const WORKER_HEARTBEAT_INTERVAL_MS = 15e3;
const WORKER_PROTOCOL_METHODS = [
	"worker.heartbeat",
	"worker.transcript.commit",
	"worker.live-event",
	"worker.sessions.spawn",
	"worker.sessions.send",
	"worker.portal",
	"worker.computer",
	"worker.skill-workshop"
];
const WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE = "worker-transcript-commit-v1";
const WORKER_LIVE_EVENT_PROTOCOL_FEATURE = "worker-live-event-v1";
const WORKER_LAUNCH_V2_PROTOCOL_FEATURE = "worker-launch-v2";
const WORKER_EXECUTION_CONTEXT_PROTOCOL_FEATURE = "worker-execution-context-v2";
const WORKER_EXECUTION_AUTHORITY_PROTOCOL_FEATURE = "worker-execution-authority-v1";
const WORKER_LINEAGE_START_PROTOCOL_FEATURE = "worker-lineage-start-v1";
const WORKER_SESSION_TOOLS_PROTOCOL_FEATURE = "worker-session-tools-v1";
const WORKER_PORTAL_PROTOCOL_FEATURE = "worker-portal-v1";
const WORKER_PROTOCOL_FEATURES = [
	"skill-resources-v1",
	"worker-skill-workshop-v1",
	"worker-heartbeat-v1",
	WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE,
	WORKER_LIVE_EVENT_PROTOCOL_FEATURE,
	WORKER_EXECUTION_CONTEXT_PROTOCOL_FEATURE,
	WORKER_EXECUTION_AUTHORITY_PROTOCOL_FEATURE,
	WORKER_LINEAGE_START_PROTOCOL_FEATURE,
	WORKER_SESSION_TOOLS_PROTOCOL_FEATURE,
	WORKER_PORTAL_PROTOCOL_FEATURE,
	WORKER_COMPUTER_PROTOCOL_FEATURE,
	"worker-inference-v1"
];
const WORKER_PROTOCOL_MAX_METHOD_LENGTH = 64;
const WORKER_PROTOCOL_MAX_FEATURES = 64;
const WORKER_PROTOCOL_MAX_FEATURE_LENGTH = 128;
const WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES = 64;
const WORKER_TRANSCRIPT_MAX_CONTENT_PARTS = 128;
const WORKER_TRANSCRIPT_MAX_JSON_DEPTH = 32;
const WORKER_SESSION_TOOL_MAX_TEXT_LENGTH = 8192;
const WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES = WORKER_PROTOCOL_MAX_PAYLOAD_BYTES;
const WorkerCredentialSchema = Type.String({
	minLength: 16,
	maxLength: 256
});
const WorkerProtocolFeatureSchema = Type.String({
	minLength: 1,
	maxLength: 128
});
const WorkerBundleHashSchema = Type.String({
	minLength: 64,
	maxLength: 64,
	pattern: "^[a-f0-9]{64}$"
});
/** Build identity presented by a worker before the gateway admits it. */
const WorkerAdmissionHandshakeSchema = withSince("2026.7", closedObject({
	bundleHash: WorkerBundleHashSchema,
	openclawVersion: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	protocolFeatures: Type.Array(WorkerProtocolFeatureSchema, {
		maxItems: 64,
		uniqueItems: true
	}),
	bundlePrewarm: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}))
}));
const WorkerConnectAdmissionCommonProperties = {
	environmentId: WorkerIdentifierSchema,
	credential: WorkerCredentialSchema,
	ownerEpoch: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	rpcSetVersion: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	handshake: WorkerAdmissionHandshakeSchema
};
const WorkerConnectAdmissionSchema = Type.Union([closedObject({
	...WorkerConnectAdmissionCommonProperties,
	sessionId: Type.Null(),
	runId: Type.Null()
}), closedObject({
	...WorkerConnectAdmissionCommonProperties,
	sessionId: WorkerIdentifierSchema,
	runId: WorkerIdentifierSchema
})]);
/** Dedicated first-frame payload accepted only on the worker ingress. */
const WorkerConnectParamsSchema = closedObject({
	minProtocol: Type.Integer({ minimum: 1 }),
	maxProtocol: Type.Integer({ minimum: 1 }),
	client: closedObject({
		id: Type.Literal(GATEWAY_CLIENT_IDS.WORKER),
		version: Type.String({
			minLength: 1,
			maxLength: 128
		}),
		platform: Type.String({
			minLength: 1,
			maxLength: 128
		}),
		mode: Type.Literal(GATEWAY_CLIENT_MODES.WORKER)
	}),
	role: Type.Literal("worker"),
	admission: WorkerConnectAdmissionSchema
});
const WorkerConnectRequestFrameSchema = closedObject({
	type: Type.Literal("req"),
	id: WorkerFrameIdSchema,
	method: Type.Literal("connect"),
	params: WorkerConnectParamsSchema
});
/** Minimal admission response; workers never receive the general gateway snapshot. */
const WorkerHelloOkSchema = closedObject({
	type: Type.Literal("worker-hello-ok"),
	environmentId: WorkerIdentifierSchema,
	sessionId: Type.Union([WorkerIdentifierSchema, Type.Null()]),
	ownerEpoch: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	rpcSetVersion: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	protocolFeatures: Type.Array(WorkerProtocolFeatureSchema, {
		maxItems: 64,
		uniqueItems: true
	}),
	credentialExpiresAtMs: Type.Integer({ minimum: 0 }),
	policy: closedObject({
		heartbeatIntervalMs: Type.Integer({ minimum: 1 }),
		maxPayload: Type.Integer({ minimum: 1 })
	})
});
const WorkerAdmissionSuccessResponseFrameSchema = closedObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerHelloOkSchema
});
const WorkerAdmissionResponseFrameSchema = Type.Union([WorkerAdmissionSuccessResponseFrameSchema, WorkerErrorResponseFrameSchema]);
const WorkerStatusSchema = Type.Union([
	Type.Literal("ready"),
	Type.Literal("busy"),
	Type.Literal("draining")
]);
const WorkerHeartbeatParamsSchema = closedObject({
	sentAtMs: Type.Integer({ minimum: 0 }),
	status: WorkerStatusSchema
});
const WorkerHeartbeatResultSchema = closedObject({
	receivedAtMs: Type.Integer({ minimum: 0 }),
	status: Type.Literal("ok"),
	ownerEpoch: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})
});
const WorkerHeartbeatRequestFrameSchema = closedObject({
	type: Type.Literal("req"),
	id: WorkerFrameIdSchema,
	method: Type.Literal(WORKER_PROTOCOL_METHODS[0]),
	params: WorkerHeartbeatParamsSchema
});
const WorkerHeartbeatSuccessResponseFrameSchema = closedObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerHeartbeatResultSchema
});
const WorkerHeartbeatResponseFrameSchema = Type.Union([WorkerHeartbeatSuccessResponseFrameSchema, WorkerErrorResponseFrameSchema]);
const WorkerSessionToolCallIdSchema = Type.String({
	minLength: 1,
	maxLength: 256
});
const WorkerSessionsSpawnParamsSchema = closedObject({
	toolCallId: WorkerSessionToolCallIdSchema,
	task: Type.String({
		minLength: 1,
		maxLength: WORKER_SESSION_TOOL_MAX_TEXT_LENGTH
	}),
	label: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	agentId: Type.Optional(WorkerIdentifierSchema),
	model: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	runTimeoutSeconds: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: 86400
	}))
});
const WorkerSessionsSendParamsSchema = closedObject({
	toolCallId: WorkerSessionToolCallIdSchema,
	sessionKey: Type.String({
		minLength: 1,
		maxLength: 1024
	}),
	message: Type.String({
		minLength: 1,
		maxLength: WORKER_SESSION_TOOL_MAX_TEXT_LENGTH
	}),
	timeoutSeconds: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: 86400
	}))
});
const WorkerPortalParamsSchema = closedObject({
	toolCallId: WorkerSessionToolCallIdSchema,
	action: Type.Union([
		Type.Literal("open"),
		Type.Literal("list"),
		Type.Literal("close")
	]),
	port: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 65535
	})),
	title: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	})),
	description: Type.Optional(Type.String({ maxLength: WORKER_SESSION_TOOL_MAX_TEXT_LENGTH })),
	path: Type.Optional(Type.String({
		maxLength: 1024,
		pattern: "^/"
	})),
	id: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256
	}))
});
const WorkerSessionToolResultSchema = closedObject({ resultJson: Type.String({
	minLength: 2,
	maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
}) });
const WorkerSessionToolResponseFrameSchema = Type.Union([closedObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerSessionToolResultSchema
}), WorkerErrorResponseFrameSchema]);
const WorkerSessionsSpawnResponseFrameSchema = WorkerSessionToolResponseFrameSchema;
const WorkerSessionsSendResponseFrameSchema = WorkerSessionToolResponseFrameSchema;
const WorkerPortalResponseFrameSchema = WorkerSessionToolResponseFrameSchema;
const WorkerTranscriptTextContentSchema = closedObject({
	type: Type.Literal("text"),
	text: Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
	textSignature: Type.Optional(Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
	}))
});
const WorkerTranscriptThinkingContentSchema = closedObject({
	type: Type.Literal("thinking"),
	thinking: Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES }),
	thinkingSignature: Type.Optional(Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
	})),
	redacted: Type.Optional(Type.Boolean())
});
const WorkerTranscriptImageContentSchema = closedObject({
	type: Type.Literal("image"),
	data: Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_MEDIA_PAYLOAD_BYTES
	}),
	mimeType: Type.String({
		minLength: 1,
		maxLength: 256
	})
});
const WorkerTranscriptToolCallSchema = closedObject({
	type: Type.Literal("toolCall"),
	id: WorkerIdentifierSchema,
	name: WorkerIdentifierSchema,
	arguments: Type.Record(Type.String({
		minLength: 1,
		maxLength: 256
	}), Type.Unknown()),
	thoughtSignature: Type.Optional(Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
	})),
	executionMode: Type.Optional(Type.Union([Type.Literal("sequential"), Type.Literal("parallel")]))
});
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
const WorkerTranscriptUserMessageSchema = closedObject({
	role: Type.Literal("user"),
	content: Type.Array(Type.Union([WorkerTranscriptTextContentSchema, WorkerTranscriptImageContentSchema]), {
		minItems: 1,
		maxItems: 128
	}),
	timestamp: Type.Integer({ minimum: 0 })
});
const WorkerTranscriptAssistantMessageSchema = closedObject({
	role: Type.Literal("assistant"),
	content: Type.Array(Type.Union([
		WorkerTranscriptTextContentSchema,
		WorkerTranscriptThinkingContentSchema,
		WorkerTranscriptToolCallSchema
	]), { maxItems: 128 }),
	api: WorkerIdentifierSchema,
	provider: WorkerIdentifierSchema,
	model: WorkerIdentifierSchema,
	responseModel: Type.Optional(WorkerIdentifierSchema),
	responseId: Type.Optional(WorkerIdentifierSchema),
	providerReplay: Type.Optional(WorkerProviderReplayStateSchema),
	diagnostics: Type.Optional(Type.Array(WorkerTranscriptAssistantDiagnosticSchema, { maxItems: 128 })),
	usage: WorkerTranscriptUsageSchema,
	stopReason: Type.Union([
		Type.Literal("stop"),
		Type.Literal("length"),
		Type.Literal("toolUse"),
		Type.Literal("error"),
		Type.Literal("aborted")
	]),
	errorMessage: Type.Optional(Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
	errorCode: Type.Optional(Type.String({ maxLength: 256 })),
	errorType: Type.Optional(Type.String({ maxLength: 256 })),
	errorBody: Type.Optional(Type.String({ maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES })),
	timestamp: Type.Integer({ minimum: 0 })
});
const WorkerTranscriptToolResultMessageSchema = closedObject({
	role: Type.Literal("toolResult"),
	toolCallId: WorkerIdentifierSchema,
	toolName: WorkerIdentifierSchema,
	content: Type.Array(Type.Union([WorkerTranscriptTextContentSchema, WorkerTranscriptImageContentSchema]), { maxItems: 128 }),
	details: Type.Optional(Type.Unknown()),
	isError: Type.Boolean(),
	timestamp: Type.Integer({ minimum: 0 })
});
const WorkerTranscriptMessageSchema = Type.Union([
	WorkerTranscriptUserMessageSchema,
	WorkerTranscriptAssistantMessageSchema,
	WorkerTranscriptToolResultMessageSchema
]);
const WorkerTranscriptCommitParamsSchema = closedObject({
	runEpoch: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	seq: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	baseLeafId: Type.Union([WorkerIdentifierSchema, Type.Null()]),
	messages: Type.Array(WorkerTranscriptMessageSchema, {
		minItems: 1,
		maxItems: 64
	})
});
const WorkerTranscriptCommitResultSchema = closedObject({
	entryIds: Type.Array(WorkerIdentifierSchema, {
		minItems: 1,
		maxItems: 64
	}),
	newLeafId: WorkerIdentifierSchema
});
const WorkerTranscriptCommitErrorReasonSchema = Type.Union([
	Type.Literal("stale-base-leaf"),
	Type.Literal("epoch-mismatch"),
	Type.Literal("invalid-batch"),
	Type.Literal("session-not-attached")
]);
const WorkerTranscriptCommitErrorShapeSchema = closedObject({
	code: Type.Literal("INVALID_REQUEST"),
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	details: closedObject({ reason: WorkerTranscriptCommitErrorReasonSchema })
});
const WorkerTranscriptCommitRequestFrameSchema = closedObject({
	type: Type.Literal("req"),
	id: WorkerFrameIdSchema,
	method: Type.Literal(WORKER_PROTOCOL_METHODS[1]),
	params: WorkerTranscriptCommitParamsSchema
});
const WorkerTranscriptCommitSuccessResponseFrameSchema = closedObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerTranscriptCommitResultSchema
});
const WorkerTranscriptCommitErrorResponseFrameSchema = closedObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(false),
	error: WorkerTranscriptCommitErrorShapeSchema
});
const WorkerTranscriptCommitResponseFrameSchema = Type.Union([
	WorkerTranscriptCommitSuccessResponseFrameSchema,
	WorkerTranscriptCommitErrorResponseFrameSchema,
	WorkerErrorResponseFrameSchema
]);
function workerLiveObject(properties) {
	return closedObject(properties);
}
const OptionalLiveTextSchema = Type.Optional(LiveTextSchema);
const OptionalLiveIntegerSchema = Type.Optional(LiveIntegerSchema);
const LiveIdentifierSchema = Type.String({
	minLength: 1,
	maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES,
	pattern: "^\\S(?:.*\\S)?$"
});
const WorkerLiveAssistantPayloadSchema = workerLiveObject({
	text: LiveTextSchema,
	delta: LiveTextSchema,
	replace: Type.Optional(Type.Literal(true)),
	mediaUrls: Type.Optional(Type.Array(LiveIdentifierSchema, { maxItems: 128 })),
	phase: Type.Optional(Type.Union([Type.Literal("commentary"), Type.Literal("final_answer")])),
	itemId: Type.Optional(WorkerIdentifierSchema)
});
const WorkerLiveThinkingPayloadSchema = workerLiveObject({
	text: LiveTextSchema,
	delta: LiveTextSchema
});
const WorkerLiveToolCommonProperties = {
	name: WorkerIdentifierSchema,
	toolCallId: WorkerIdentifierSchema,
	hideFromChannelProgress: Type.Optional(Type.Literal(true))
};
const WorkerLiveToolPayloadSchema = Type.Union([
	workerLiveObject({
		...WorkerLiveToolCommonProperties,
		phase: Type.Literal("start"),
		args: Type.Unknown()
	}),
	workerLiveObject({
		...WorkerLiveToolCommonProperties,
		phase: Type.Literal("update"),
		partialResult: Type.Unknown()
	}),
	workerLiveObject({
		...WorkerLiveToolCommonProperties,
		phase: Type.Literal("result"),
		meta: OptionalLiveTextSchema,
		isError: Type.Boolean(),
		result: Type.Unknown(),
		toolErrorSummary: OptionalLiveTextSchema
	})
]);
const WorkerLiveApprovalCommonProperties = {
	kind: Type.Union([
		Type.Literal("exec"),
		Type.Literal("plugin"),
		Type.Literal("unknown")
	]),
	title: LiveTextSchema,
	itemId: Type.Optional(WorkerIdentifierSchema),
	toolCallId: Type.Optional(WorkerIdentifierSchema),
	approvalId: Type.Optional(WorkerIdentifierSchema),
	approvalSlug: Type.Optional(WorkerIdentifierSchema),
	command: OptionalLiveTextSchema,
	host: OptionalLiveTextSchema,
	reason: OptionalLiveTextSchema,
	scope: Type.Optional(Type.Union([Type.Literal("turn"), Type.Literal("session")])),
	message: OptionalLiveTextSchema
};
const WorkerLiveApprovalPayloadSchema = Type.Union([workerLiveObject({
	...WorkerLiveApprovalCommonProperties,
	phase: Type.Literal("requested"),
	status: Type.Union([Type.Literal("pending"), Type.Literal("unavailable")])
}), workerLiveObject({
	...WorkerLiveApprovalCommonProperties,
	phase: Type.Literal("resolved"),
	status: Type.Union([
		Type.Literal("approved"),
		Type.Literal("denied"),
		Type.Literal("failed")
	])
})]);
const WorkerLiveLifecycleStartPayloadSchema = workerLiveObject({
	phase: Type.Literal("start"),
	startedAt: LiveIntegerSchema
});
const WorkerLiveFallbackAttemptSchema = workerLiveObject({
	provider: LiveIdentifierSchema,
	model: LiveIdentifierSchema,
	error: LiveTextSchema,
	reason: Type.Optional(FailoverReasonSchema),
	authMode: Type.Optional(LiveIdentifierSchema),
	status: OptionalLiveIntegerSchema,
	code: Type.Optional(Type.String({
		minLength: 1,
		maxLength: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES
	}))
});
const WorkerLiveFallbackCommonProperties = {
	selectedProvider: LiveIdentifierSchema,
	selectedModel: LiveIdentifierSchema,
	activeProvider: LiveIdentifierSchema,
	activeModel: LiveIdentifierSchema
};
const WorkerLiveLifecycleFallbackPayloadSchema = workerLiveObject({
	...WorkerLiveFallbackCommonProperties,
	phase: Type.Literal("fallback"),
	reasonSummary: LiveTextSchema,
	attemptSummaries: Type.Array(LiveTextSchema, { maxItems: 128 }),
	attempts: Type.Array(WorkerLiveFallbackAttemptSchema, { maxItems: 128 })
});
const WorkerLiveLifecycleFallbackClearedPayloadSchema = workerLiveObject({
	...WorkerLiveFallbackCommonProperties,
	phase: Type.Literal("fallback_cleared"),
	previousActiveModel: Type.Optional(LiveIdentifierSchema)
});
const WorkerLiveLifecycleFallbackStepPayloadSchema = workerLiveObject({
	phase: Type.Literal("fallback_step"),
	fallbackStepType: Type.Literal("fallback_step"),
	fallbackStepFromModel: LiveIdentifierSchema,
	fallbackStepToModel: Type.Optional(LiveIdentifierSchema),
	fallbackStepFromFailureReason: Type.Optional(FailoverReasonSchema),
	fallbackStepFromFailureDetail: OptionalLiveTextSchema,
	fallbackStepChainPosition: OptionalLiveIntegerSchema,
	fallbackStepFinalOutcome: Type.Union([
		Type.Literal("next_fallback"),
		Type.Literal("succeeded"),
		Type.Literal("chain_exhausted")
	])
});
const WorkerLiveLifecycleTerminalCommonProperties = {
	startedAt: OptionalLiveIntegerSchema,
	endedAt: LiveIntegerSchema,
	stopReason: Type.Optional(WorkerIdentifierSchema),
	yielded: Type.Optional(Type.Literal(true)),
	timeoutPhase: Type.Optional(Type.Union([
		Type.Literal("queue"),
		Type.Literal("preflight"),
		Type.Literal("provider"),
		Type.Literal("post_turn"),
		Type.Literal("gateway_draining")
	])),
	providerStarted: Type.Optional(Type.Boolean()),
	aborted: Type.Optional(Type.Boolean()),
	toolErrorSummary: OptionalLiveTextSchema,
	livenessState: Type.Optional(Type.Union([
		Type.Literal("working"),
		Type.Literal("paused"),
		Type.Literal("blocked"),
		Type.Literal("abandoned")
	])),
	replayInvalid: Type.Optional(Type.Literal(true))
};
const WorkerLiveLifecycleTerminalPayloadSchema = Type.Union([
	workerLiveObject({
		...WorkerLiveLifecycleTerminalCommonProperties,
		phase: Type.Literal("finishing"),
		error: OptionalLiveTextSchema
	}),
	workerLiveObject({
		...WorkerLiveLifecycleTerminalCommonProperties,
		phase: Type.Literal("end")
	}),
	workerLiveObject({
		...WorkerLiveLifecycleTerminalCommonProperties,
		phase: Type.Literal("error"),
		error: LiveTextSchema,
		fallbackExhaustedFailure: Type.Optional(Type.Literal(true))
	})
]);
const WorkerLiveLifecyclePayloadSchema = Type.Union([
	WorkerLiveLifecycleStartPayloadSchema,
	WorkerLiveLifecycleFallbackPayloadSchema,
	WorkerLiveLifecycleFallbackClearedPayloadSchema,
	WorkerLiveLifecycleFallbackStepPayloadSchema,
	WorkerLiveLifecycleTerminalPayloadSchema
]);
const WorkerLiveEventSchema = Type.Union([
	workerLiveObject({
		kind: Type.Literal("assistant"),
		payload: WorkerLiveAssistantPayloadSchema
	}),
	workerLiveObject({
		kind: Type.Literal("thinking"),
		payload: WorkerLiveThinkingPayloadSchema
	}),
	workerLiveObject({
		kind: Type.Literal("tool"),
		payload: WorkerLiveToolPayloadSchema
	}),
	workerLiveObject({
		kind: Type.Literal("approval"),
		payload: WorkerLiveApprovalPayloadSchema
	}),
	workerLiveObject({
		kind: Type.Literal("lifecycle"),
		payload: WorkerLiveLifecyclePayloadSchema
	})
]);
const WorkerLiveEventParamsSchema = workerLiveObject({
	runEpoch: LiveIntegerSchema,
	lastAckedSeq: LiveIntegerSchema,
	seq: LiveSequenceSchema,
	runId: WorkerIdentifierSchema,
	event: WorkerLiveEventSchema
});
const WorkerLiveEventResultSchema = workerLiveObject({ ackedSeq: LiveIntegerSchema });
const WorkerLiveEventErrorDetailsSchema = Type.Union([workerLiveObject({ reason: Type.Union([
	Type.Literal("epoch-mismatch"),
	Type.Literal("session-not-attached"),
	Type.Literal("invalid-event"),
	Type.Literal("capacity-exceeded")
]) }), workerLiveObject({
	reason: Type.Literal("resync-required"),
	ackedSeq: LiveIntegerSchema,
	expectedSeq: LiveSequenceSchema
})]);
const WorkerLiveEventErrorShapeSchema = workerLiveObject({
	code: Type.Literal("INVALID_REQUEST"),
	message: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	details: WorkerLiveEventErrorDetailsSchema
});
const WorkerLiveEventRequestFrameSchema = workerLiveObject({
	type: Type.Literal("req"),
	id: WorkerFrameIdSchema,
	method: Type.Literal(WORKER_PROTOCOL_METHODS[2]),
	params: WorkerLiveEventParamsSchema
});
const WorkerLiveEventSuccessResponseFrameSchema = workerLiveObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(true),
	payload: WorkerLiveEventResultSchema
});
const WorkerLiveEventErrorResponseFrameSchema = workerLiveObject({
	type: Type.Literal("res"),
	id: WorkerFrameIdSchema,
	ok: Type.Literal(false),
	error: WorkerLiveEventErrorShapeSchema
});
const WorkerLiveEventResponseFrameSchema = Type.Union([
	WorkerLiveEventSuccessResponseFrameSchema,
	WorkerLiveEventErrorResponseFrameSchema,
	WorkerErrorResponseFrameSchema
]);
//#endregion
export { WorkerComputerParamsSchema as $, WorkerLiveEventParamsSchema as A, WorkerSessionsSendParamsSchema as B, WorkerAdmissionResponseFrameSchema as C, WorkerHeartbeatResponseFrameSchema as D, WorkerHeartbeatRequestFrameSchema as E, WorkerPortalParamsSchema as F, WorkerTranscriptCommitErrorShapeSchema as G, WorkerSessionsSpawnParamsSchema as H, WorkerPortalResponseFrameSchema as I, WorkerTranscriptCommitResponseFrameSchema as J, WorkerTranscriptCommitParamsSchema as K, WorkerProviderReplayStateSchema as L, WorkerLiveEventResponseFrameSchema as M, WorkerLiveEventResultSchema as N, WorkerLiveEventErrorDetailsSchema as O, WorkerLiveEventSchema as P, WORKER_COMPUTER_PROTOCOL_FEATURE as Q, WorkerSessionToolResponseFrameSchema as R, WorkerAdmissionHandshakeSchema as S, WorkerHeartbeatParamsSchema as T, WorkerSessionsSpawnResponseFrameSchema as U, WorkerSessionsSendResponseFrameSchema as V, WorkerTranscriptCommitErrorReasonSchema as W, WorkerTranscriptMessageSchema as X, WorkerTranscriptCommitResultSchema as Y, WorkerTranscriptUserMessageSchema as Z, WORKER_SESSION_TOOL_MAX_TEXT_LENGTH as _, WORKER_LAUNCH_V2_PROTOCOL_FEATURE as a, WORKER_TRANSCRIPT_MAX_CONTENT_PARTS as b, WORKER_PORTAL_PROTOCOL_FEATURE as c, WORKER_PROTOCOL_MAX_FEATURE_LENGTH as d, WorkerComputerResponseFrameSchema as et, WORKER_PROTOCOL_MAX_METHOD_LENGTH as f, WORKER_SESSION_TOOLS_PROTOCOL_FEATURE as g, WORKER_RPC_SET_VERSION as h, WORKER_HEARTBEAT_INTERVAL_MS as i, WorkerLiveEventRequestFrameSchema as j, WorkerLiveEventErrorShapeSchema as k, WORKER_PROTOCOL_FEATURES as l, WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES as m, WORKER_EXECUTION_AUTHORITY_PROTOCOL_FEATURE as n, withSince as nt, WORKER_LINEAGE_START_PROTOCOL_FEATURE as o, WORKER_PROTOCOL_METHODS as p, WorkerTranscriptCommitRequestFrameSchema as q, WORKER_EXECUTION_CONTEXT_PROTOCOL_FEATURE as r, FailoverReasonSchema as rt, WORKER_LIVE_EVENT_PROTOCOL_FEATURE as s, WORKER_BUNDLE_PREWARM_VERSION as t, WorkerComputerResultSchema as tt, WORKER_PROTOCOL_MAX_FEATURES as u, WORKER_TRANSCRIPT_COMMIT_PROTOCOL_FEATURE as v, WorkerConnectRequestFrameSchema as w, WORKER_TRANSCRIPT_MAX_JSON_DEPTH as x, WORKER_TRANSCRIPT_MAX_BATCH_MESSAGES as y, WorkerSessionToolResultSchema as z };
