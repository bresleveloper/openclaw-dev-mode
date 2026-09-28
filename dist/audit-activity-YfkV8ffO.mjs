import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as NonEmptyString } from "./primitives-C-2-W5SF.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/audit-activity.ts
const AuditActivitySchemaVersionV1Schema = Type.Integer({
	minimum: 1,
	maximum: 1
});
const AUDIT_ACTIVITY_STATUSES = [
	"started",
	"succeeded",
	"failed",
	"cancelled",
	"timed_out",
	"blocked",
	"unknown"
];
const AUDIT_ACTIVITY_MESSAGE_KIND = "message";
const AUDIT_ACTIVITY_KINDS = [
	"agent_run",
	"tool_action",
	AUDIT_ACTIVITY_MESSAGE_KIND
];
const AUDIT_ACTIVITY_DIRECTIONS = ["inbound", "outbound"];
const AUDIT_ACTIVITY_NON_MESSAGE_KINDS = ["agent_run", "tool_action"];
function findAuditActivityFilterConflict(filters) {
	const messageField = filters.direction !== void 0 ? "direction" : filters.channel !== void 0 ? "channel" : void 0;
	const hasSessionFilter = filters.sessionKey !== void 0;
	if (filters.kind === "message" && hasSessionFilter) return {
		type: "kind",
		field: "sessionKey",
		supportedKinds: AUDIT_ACTIVITY_NON_MESSAGE_KINDS
	};
	if (filters.kind !== void 0 && filters.kind !== "message" && messageField) return {
		type: "kind",
		field: messageField,
		supportedKinds: [AUDIT_ACTIVITY_MESSAGE_KIND]
	};
	if (filters.kind === void 0 && hasSessionFilter && messageField) return {
		type: "filter",
		field: messageField,
		conflictingField: "sessionKey"
	};
}
const AuditActivityStatusV1Schema = Type.Union(AUDIT_ACTIVITY_STATUSES.map((value) => Type.Literal(value)));
const AuditActivityKindV1Schema = Type.Union(AUDIT_ACTIVITY_KINDS.map((value) => Type.Literal(value)));
const AuditActivityDirectionV1Schema = Type.Union(AUDIT_ACTIVITY_DIRECTIONS.map((value) => Type.Literal(value)));
const AuditActivityConversationKindV1Schema = Type.Union([
	Type.Literal("direct"),
	Type.Literal("group"),
	Type.Literal("channel"),
	Type.Literal("unknown")
]);
const AuditActivityHmacRefV1Schema = Type.String({ pattern: "^hmac-sha256:v1:[a-f0-9]{32}:[a-f0-9]{64}$" });
const AuditActivityAgentActorV1Schema = closedObject({
	type: Type.Union([Type.Literal("agent"), Type.Literal("system")]),
	id: NonEmptyString
});
const AuditActivityInboundActorV1Schema = Type.Union([closedObject({
	type: Type.Literal("channel_sender"),
	id: AuditActivityHmacRefV1Schema
}), closedObject({
	type: Type.Literal("system"),
	id: NonEmptyString
})]);
const AuditActivityOutboundActorV1Schema = closedObject({
	type: Type.Union([Type.Literal("agent"), Type.Literal("system")]),
	id: NonEmptyString
});
const commonProperties = {
	schemaVersion: AuditActivitySchemaVersionV1Schema,
	eventId: NonEmptyString,
	sequence: Type.Integer({ minimum: 1 }),
	sourceSequence: Type.Integer({ minimum: 1 }),
	occurredAt: Type.Integer({ minimum: 0 }),
	redaction: Type.Literal("metadata_only")
};
const agentProperties = {
	actor: AuditActivityAgentActorV1Schema,
	agentId: NonEmptyString,
	sessionKey: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	runId: NonEmptyString
};
const messageProperties = {
	channel: NonEmptyString,
	conversationKind: AuditActivityConversationKindV1Schema,
	durationMs: Type.Optional(Type.Integer({ minimum: 0 })),
	resultCount: Type.Optional(Type.Integer({ minimum: 0 })),
	agentId: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	accountRef: Type.Optional(AuditActivityHmacRefV1Schema),
	conversationRef: Type.Optional(AuditActivityHmacRefV1Schema),
	messageRef: Type.Optional(AuditActivityHmacRefV1Schema),
	targetRef: Type.Optional(AuditActivityHmacRefV1Schema)
};
function correlatedObject(properties, variants) {
	return Type.Object(properties, {
		additionalProperties: false,
		allOf: [variants]
	});
}
function withoutField(field) {
	return { not: { required: [field] } };
}
const withoutErrorCode = withoutField("errorCode");
const withoutReasonCode = withoutField("reasonCode");
const withoutFailureStage = withoutField("failureStage");
const withoutDeliveryKind = withoutField("deliveryKind");
/** V1 agent-run activity record. */
const AuditActivityAgentRunV1Schema = correlatedObject({
	eventType: Type.Literal("agent_run"),
	...commonProperties,
	...agentProperties,
	kind: Type.Literal("agent_run"),
	action: Type.Union([Type.Literal("agent.run.started"), Type.Literal("agent.run.finished")]),
	status: Type.Union([
		Type.Literal("started"),
		Type.Literal("succeeded"),
		Type.Literal("failed"),
		Type.Literal("cancelled"),
		Type.Literal("timed_out"),
		Type.Literal("blocked")
	]),
	errorCode: Type.Optional(Type.Union([
		Type.Literal("run_failed"),
		Type.Literal("run_cancelled"),
		Type.Literal("run_timed_out"),
		Type.Literal("run_blocked")
	]))
}, Type.Union([
	Type.Intersect([Type.Object({
		action: Type.Literal("agent.run.started"),
		status: Type.Literal("started")
	}), withoutErrorCode]),
	Type.Intersect([Type.Object({
		action: Type.Literal("agent.run.finished"),
		status: Type.Literal("succeeded")
	}), withoutErrorCode]),
	Type.Object({
		action: Type.Literal("agent.run.finished"),
		status: Type.Literal("failed"),
		errorCode: Type.Literal("run_failed")
	}),
	Type.Object({
		action: Type.Literal("agent.run.finished"),
		status: Type.Literal("cancelled"),
		errorCode: Type.Literal("run_cancelled")
	}),
	Type.Object({
		action: Type.Literal("agent.run.finished"),
		status: Type.Literal("timed_out"),
		errorCode: Type.Literal("run_timed_out")
	}),
	Type.Object({
		action: Type.Literal("agent.run.finished"),
		status: Type.Literal("blocked"),
		errorCode: Type.Literal("run_blocked")
	})
]));
/** V1 tool-action activity record. */
const AuditActivityToolActionV1Schema = correlatedObject({
	eventType: Type.Literal("tool_action"),
	...commonProperties,
	...agentProperties,
	kind: Type.Literal("tool_action"),
	toolCallId: Type.Optional(NonEmptyString),
	toolName: Type.Optional(NonEmptyString),
	action: Type.Union([Type.Literal("tool.action.started"), Type.Literal("tool.action.finished")]),
	status: AuditActivityStatusV1Schema,
	errorCode: Type.Optional(Type.Union([
		Type.Literal("tool_failed"),
		Type.Literal("tool_cancelled"),
		Type.Literal("tool_timed_out"),
		Type.Literal("tool_blocked"),
		Type.Literal("tool_outcome_unknown")
	]))
}, Type.Union([
	Type.Intersect([Type.Object({
		action: Type.Literal("tool.action.started"),
		status: Type.Literal("started")
	}), withoutErrorCode]),
	Type.Intersect([Type.Object({
		action: Type.Literal("tool.action.finished"),
		status: Type.Literal("succeeded")
	}), withoutErrorCode]),
	Type.Object({
		action: Type.Literal("tool.action.finished"),
		status: Type.Literal("failed"),
		errorCode: Type.Literal("tool_failed")
	}),
	Type.Object({
		action: Type.Literal("tool.action.finished"),
		status: Type.Literal("cancelled"),
		errorCode: Type.Literal("tool_cancelled")
	}),
	Type.Object({
		action: Type.Literal("tool.action.finished"),
		status: Type.Literal("timed_out"),
		errorCode: Type.Literal("tool_timed_out")
	}),
	Type.Object({
		action: Type.Literal("tool.action.finished"),
		status: Type.Literal("blocked"),
		errorCode: Type.Literal("tool_blocked")
	}),
	Type.Object({
		action: Type.Literal("tool.action.finished"),
		status: Type.Literal("unknown"),
		errorCode: Type.Literal("tool_outcome_unknown")
	})
]));
const inboundMessageProperties = {
	eventType: Type.Literal("inbound_message"),
	...commonProperties,
	...messageProperties,
	kind: Type.Literal("message"),
	action: Type.Literal("message.inbound.processed"),
	direction: Type.Literal("inbound"),
	actor: AuditActivityInboundActorV1Schema
};
const inboundCompletedReasonSchema = Type.Union([
	Type.Literal("fast_abort"),
	Type.Literal("plugin_bound_handled"),
	Type.Literal("plugin_bound_unavailable"),
	Type.Literal("plugin_bound_declined"),
	Type.Literal("before_dispatch_handled"),
	Type.Literal("acp_dispatch_completed"),
	Type.Literal("acp_dispatch_empty"),
	Type.Literal("active_run_injected")
]);
const inboundSkippedReasonSchema = Type.Union([
	Type.Literal("duplicate"),
	Type.Literal("reply_operation_active"),
	Type.Literal("reply_operation_aborted"),
	Type.Literal("acp_dispatch_aborted")
]);
/** V1 inbound-message activity record. */
const inboundFailureReasonSchema = Type.Union([Type.Literal("acp_dispatch_failed"), Type.Literal("plugin_bound_error")]);
const AuditActivityInboundMessageV1Schema = correlatedObject({
	...inboundMessageProperties,
	status: Type.Union([
		Type.Literal("succeeded"),
		Type.Literal("blocked"),
		Type.Literal("failed")
	]),
	outcome: Type.Union([
		Type.Literal("completed"),
		Type.Literal("skipped"),
		Type.Literal("failed")
	]),
	errorCode: Type.Optional(Type.Literal("message_processing_failed")),
	reasonCode: Type.Optional(Type.Union([
		...inboundCompletedReasonSchema.anyOf,
		...inboundSkippedReasonSchema.anyOf,
		...inboundFailureReasonSchema.anyOf
	]))
}, Type.Union([
	Type.Intersect([Type.Object({
		status: Type.Literal("succeeded"),
		outcome: Type.Literal("completed"),
		reasonCode: Type.Optional(inboundCompletedReasonSchema)
	}), withoutErrorCode]),
	Type.Intersect([Type.Object({
		status: Type.Literal("blocked"),
		outcome: Type.Literal("skipped"),
		reasonCode: Type.Optional(inboundSkippedReasonSchema)
	}), withoutErrorCode]),
	Type.Object({
		status: Type.Literal("failed"),
		outcome: Type.Literal("failed"),
		errorCode: Type.Literal("message_processing_failed"),
		reasonCode: Type.Optional(inboundFailureReasonSchema)
	})
]));
const outboundMessageProperties = {
	eventType: Type.Literal("outbound_message"),
	...commonProperties,
	...messageProperties,
	kind: Type.Literal("message"),
	action: Type.Literal("message.outbound.finished"),
	direction: Type.Literal("outbound"),
	actor: AuditActivityOutboundActorV1Schema,
	deliveryKind: Type.Optional(Type.Union([
		Type.Literal("text"),
		Type.Literal("media"),
		Type.Literal("other")
	]))
};
const outboundSuppressedReasonSchema = Type.Union([
	Type.Literal("cancelled_by_message_sending_hook"),
	Type.Literal("cancelled_by_reply_payload_sending_hook"),
	Type.Literal("empty_after_message_sending_hook"),
	Type.Literal("empty_after_reply_payload_sending_hook"),
	Type.Literal("no_visible_payload")
]);
const outboundFailureStageSchema = Type.Union([
	Type.Literal("platform_send"),
	Type.Literal("queue"),
	Type.Literal("unknown")
]);
/** V1 outbound-message activity record. */
const outboundFailureErrorSchema = Type.Union([Type.Literal("message_delivery_failed"), Type.Literal("message_delivery_partial_failure")]);
const AuditActivityOutboundMessageV1Schema = correlatedObject({
	...outboundMessageProperties,
	status: Type.Union([
		Type.Literal("succeeded"),
		Type.Literal("blocked"),
		Type.Literal("failed"),
		Type.Literal("unknown")
	]),
	outcome: Type.Union([
		Type.Literal("sent"),
		Type.Literal("suppressed"),
		Type.Literal("failed"),
		Type.Literal("unknown")
	]),
	errorCode: Type.Optional(outboundFailureErrorSchema),
	reasonCode: Type.Optional(outboundSuppressedReasonSchema),
	failureStage: Type.Optional(outboundFailureStageSchema)
}, Type.Union([
	Type.Intersect([
		Type.Object({
			status: Type.Literal("succeeded"),
			outcome: Type.Literal("sent")
		}),
		withoutErrorCode,
		withoutReasonCode,
		withoutFailureStage
	]),
	Type.Intersect([
		Type.Object({
			status: Type.Literal("blocked"),
			outcome: Type.Literal("suppressed"),
			reasonCode: outboundSuppressedReasonSchema
		}),
		withoutErrorCode,
		withoutFailureStage,
		withoutDeliveryKind
	]),
	Type.Intersect([Type.Object({
		status: Type.Literal("failed"),
		outcome: Type.Literal("failed"),
		errorCode: outboundFailureErrorSchema,
		failureStage: outboundFailureStageSchema
	}), withoutReasonCode]),
	Type.Intersect([
		Type.Object({
			status: Type.Literal("unknown"),
			outcome: Type.Literal("unknown"),
			failureStage: outboundFailureStageSchema
		}),
		withoutErrorCode,
		withoutReasonCode,
		withoutDeliveryKind
	])
]));
/** Discriminated V1 activity record union. */
const AuditActivityEventV1Schema = Type.Union([
	AuditActivityAgentRunV1Schema,
	AuditActivityToolActionV1Schema,
	AuditActivityInboundMessageV1Schema,
	AuditActivityOutboundMessageV1Schema
]);
/** Bounded newest-first V1 activity query filters. */
const AuditActivityListParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	kind: Type.Optional(AuditActivityKindV1Schema),
	status: Type.Optional(AuditActivityStatusV1Schema),
	direction: Type.Optional(AuditActivityDirectionV1Schema),
	channel: Type.Optional(NonEmptyString),
	after: Type.Optional(Type.Integer({ minimum: 0 })),
	before: Type.Optional(Type.Integer({ minimum: 0 })),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 500
	})),
	cursor: Type.Optional(NonEmptyString)
});
/** Stable sequence-cursor V1 activity page. */
const AuditActivityListResultSchema = closedObject({
	events: Type.Array(AuditActivityEventV1Schema),
	nextCursor: Type.Optional(NonEmptyString)
});
//#endregion
export { AuditActivityAgentRunV1Schema as a, AuditActivityListParamsSchema as c, AuditActivityToolActionV1Schema as d, findAuditActivityFilterConflict as f, AUDIT_ACTIVITY_STATUSES as i, AuditActivityListResultSchema as l, AUDIT_ACTIVITY_KINDS as n, AuditActivityEventV1Schema as o, AUDIT_ACTIVITY_MESSAGE_KIND as r, AuditActivityInboundMessageV1Schema as s, AUDIT_ACTIVITY_DIRECTIONS as t, AuditActivityOutboundMessageV1Schema as u };
