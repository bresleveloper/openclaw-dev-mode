import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as NonEmptyString } from "./primitives-CYT6MDvz.mjs";
import { t as withSince } from "./since-BZlYNVYy.mjs";
import { t as APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN } from "./approval-id-BTRnO3t1.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXu4Ype.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/approvals.ts
const ApprovalIdSchema = Type.String({
	minLength: 1,
	pattern: APPROVAL_ID_WELL_FORMED_UNICODE_PATTERN,
	description: "Exact full approval id encoded safely in deep-link paths."
});
const ApprovalKindSchema = Type.Union([
	Type.Literal("exec"),
	Type.Literal("plugin"),
	Type.Literal("system-agent")
]);
const ApprovalDecisionSchema = Type.Union([
	Type.Literal("allow-once"),
	Type.Literal("allow-always"),
	Type.Literal("deny")
]);
const ApprovalAllowDecisionSchema = Type.Union([Type.Literal("allow-once"), Type.Literal("allow-always")]);
const ApprovalTerminalReasonSchema = Type.Union([
	Type.Literal("user"),
	Type.Literal("timeout"),
	Type.Literal("malformed-verdict"),
	Type.Literal("no-route"),
	Type.Literal("run-aborted"),
	Type.Literal("gateway-restart"),
	Type.Literal("storage-corrupt")
]);
const ApprovalAllowedReasonSchema = Type.Union([Type.Literal("user")]);
const ApprovalDeniedReasonSchema = Type.Union([
	Type.Literal("user"),
	Type.Literal("malformed-verdict"),
	Type.Literal("no-route"),
	Type.Literal("storage-corrupt")
]);
const ApprovalExpiredReasonSchema = Type.Union([Type.Literal("timeout")]);
const ApprovalCancelledReasonSchema = Type.Union([Type.Literal("run-aborted"), Type.Literal("gateway-restart")]);
const PluginApprovalSeveritySchema = Type.Union([
	Type.Literal("info"),
	Type.Literal("warning"),
	Type.Literal("critical")
]);
/** Message/email delivery blast radius declared by the approval owner. */
const MessageSendApprovalScopeSchema = closedObject({
	kind: Type.Literal("message-send"),
	target: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	recipientCount: Type.Integer({
		minimum: 1,
		maximum: 1e6
	}),
	recipients: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 128
	}), { maxItems: 5 })),
	audience: Type.Optional(Type.Union([Type.Literal("internal"), Type.Literal("external")]))
});
/** Payment blast radius declared by the approval owner. */
const PaymentApprovalScopeSchema = closedObject({
	kind: Type.Literal("payment"),
	amount: Type.String({
		minLength: 1,
		maxLength: 40
	}),
	currency: Type.String({
		minLength: 1,
		maxLength: 12
	}),
	target: Type.String({
		minLength: 1,
		maxLength: 128
	})
});
/** External publication blast radius declared by the approval owner. */
const ExternalPostApprovalScopeSchema = closedObject({
	kind: Type.Literal("external-post"),
	target: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	visibility: Type.Union([Type.Literal("public"), Type.Literal("restricted")])
});
/**
* What allow-always mints for an automation approval: a standing grant bound
* to this exact command and automation. Absent expiresInDays means the grant
* lives until revoked or the automation changes.
*/
const StandingGrantApprovalScopeSchema = closedObject({
	kind: Type.Literal("standing-grant"),
	automation: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	command: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	expiresInDays: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 3650
	}))
});
/**
* Owner-declared blast-radius facts for a pending approval. Variants are
* named schemas so native protocol generators emit the discriminated union.
*/
const ApprovalScopeSchema = Type.Union([
	MessageSendApprovalScopeSchema,
	PaymentApprovalScopeSchema,
	ExternalPostApprovalScopeSchema,
	StandingGrantApprovalScopeSchema
]);
/** Reviewer-safe projection of a plugin-owned external verification choice. */
const PluginApprovalExternalResolutionSchema = closedObject({
	label: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	decisions: Type.Array(ApprovalAllowDecisionSchema, {
		minItems: 1,
		maxItems: 2,
		uniqueItems: true
	})
});
const ApprovalAllowedDecisionsSchema = Type.Array(ApprovalDecisionSchema, {
	minItems: 1,
	maxItems: 3,
	uniqueItems: true,
	contains: Type.Literal("deny"),
	description: "Available reviewer decisions. Deny is always available so malformed or unsafe input can fail closed."
});
const SystemAgentApprovalAllowedDecisionsSchema = Type.Tuple([Type.Literal("allow-once"), Type.Literal("deny")]);
/** Redacted exec details safe to persist and render outside the requesting runtime. */
const ExecApprovalPresentationSchema = Type.Object({
	kind: Type.Literal("exec"),
	commandText: NonEmptyString,
	commandPreview: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	warningText: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	host: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	nodeId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	agentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	scope: Type.Optional(ApprovalScopeSchema),
	allowedDecisions: ApprovalAllowedDecisionsSchema
}, {
	additionalProperties: false,
	description: "Reviewer-safe exec presentation. Runtime cwd, environment, system-run binding, and execution plan are intentionally excluded."
});
/** Plugin-supplied reviewer text safe to persist and render across surfaces. */
const PluginApprovalPresentationSchema = closedObject({
	kind: Type.Literal("plugin"),
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	description: Type.String({
		minLength: 1,
		maxLength: 512
	}),
	detail: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 16384
	})),
	severity: PluginApprovalSeveritySchema,
	pluginId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	toolName: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	agentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	scope: Type.Optional(ApprovalScopeSchema),
	allowedDecisions: ApprovalAllowedDecisionsSchema,
	externalResolution: Type.Optional(PluginApprovalExternalResolutionSchema)
});
/** Reviewer-safe OpenClaw system change. Exact operation stays host-local. */
const SystemAgentApprovalPresentationSchema = closedObject({
	kind: Type.Literal("system-agent"),
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	description: Type.String({
		minLength: 1,
		maxLength: 512
	}),
	proposalHash: Type.String({ pattern: "^[a-f0-9]{64}$" }),
	agentId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	allowedDecisions: SystemAgentApprovalAllowedDecisionsSchema
});
const ApprovalPresentationSchema = Type.Union([
	ExecApprovalPresentationSchema,
	PluginApprovalPresentationSchema,
	SystemAgentApprovalPresentationSchema
]);
const ApprovalRecordCommonFields = {
	id: ApprovalIdSchema,
	urlPath: NonEmptyString,
	createdAtMs: Type.Integer({ minimum: 0 }),
	expiresAtMs: Type.Integer({ minimum: 0 }),
	presentation: ApprovalPresentationSchema
};
/** Reviewer-safe origin attribution for terminal approval history. */
const ApprovalHistorySourceAttributionSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString)
});
/** Reviewer attribution recorded by the durable approval ledger. */
const ApprovalHistoryResolverAttributionSchema = closedObject({
	kind: Type.Union([
		Type.Literal("device"),
		Type.Literal("channel"),
		Type.Literal("runtime"),
		Type.Literal("system")
	]),
	id: Type.Optional(NonEmptyString)
});
const ApprovalResolutionFields = {
	resolvedAtMs: Type.Integer({ minimum: 0 }),
	source: Type.Optional(ApprovalHistorySourceAttributionSchema),
	resolver: Type.Optional(ApprovalHistoryResolverAttributionSchema)
};
const PendingApprovalSnapshotSchema = closedObject({
	...ApprovalRecordCommonFields,
	status: Type.Literal("pending"),
	/** Canonical raising session when projected into a session-scoped reviewer surface. */
	sourceSessionKey: Type.Optional(NonEmptyString)
});
/** Approval whose first recorded reviewer decision allows the operation. */
const AllowedApprovalSnapshotSchema = closedObject({
	...ApprovalRecordCommonFields,
	...ApprovalResolutionFields,
	status: Type.Literal("allowed"),
	decision: ApprovalAllowDecisionSchema,
	reason: ApprovalAllowedReasonSchema
});
/** Approval whose first recorded reviewer decision denies the operation. */
const DeniedApprovalSnapshotSchema = closedObject({
	...ApprovalRecordCommonFields,
	...ApprovalResolutionFields,
	status: Type.Literal("denied"),
	decision: Type.Literal("deny"),
	reason: ApprovalDeniedReasonSchema
});
/** Approval that reached its deadline and therefore failed closed. */
const ExpiredApprovalSnapshotSchema = closedObject({
	...ApprovalRecordCommonFields,
	...ApprovalResolutionFields,
	status: Type.Literal("expired"),
	reason: ApprovalExpiredReasonSchema
});
/** Approval cancelled by its runtime owner before a reviewer decision. */
const CancelledApprovalSnapshotSchema = closedObject({
	...ApprovalRecordCommonFields,
	...ApprovalResolutionFields,
	status: Type.Literal("cancelled"),
	reason: ApprovalCancelledReasonSchema
});
/** Durable approval projection returned identically to every authorized surface. */
const ApprovalSnapshotSchema = Type.Union([
	PendingApprovalSnapshotSchema,
	AllowedApprovalSnapshotSchema,
	DeniedApprovalSnapshotSchema,
	ExpiredApprovalSnapshotSchema,
	CancelledApprovalSnapshotSchema
]);
/** Durable terminal approval state returned after a resolution attempt. */
const TerminalApprovalSnapshotSchema = Type.Union([
	AllowedApprovalSnapshotSchema,
	DeniedApprovalSnapshotSchema,
	ExpiredApprovalSnapshotSchema,
	CancelledApprovalSnapshotSchema
]);
const ApprovalGetParamsSchema = closedObject({ id: ApprovalRecordCommonFields.id });
const ApprovalGetResultSchema = closedObject({ approval: ApprovalSnapshotSchema });
const ApprovalHistoryParamsSchema = closedObject({
	cursor: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 512
	})),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100
	})),
	kind: Type.Optional(ApprovalKindSchema)
});
/** Newest-first page from the retained terminal approval ledger. */
const ApprovalHistoryResultSchema = closedObject({
	items: Type.Array(TerminalApprovalSnapshotSchema),
	nextCursor: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 512
	}))
});
/** Reviewer decision for one approval identified by its exact full id. */
const ApprovalChannelReviewerSchema = closedObject({
	channel: NonEmptyString,
	accountId: NonEmptyString,
	senderId: NonEmptyString
});
const ApprovalResolveParamsSchema = closedObject({
	id: ApprovalRecordCommonFields.id,
	kind: ApprovalKindSchema,
	decision: ApprovalDecisionSchema,
	reviewer: Type.Optional(ApprovalChannelReviewerSchema),
	grantExpiresInDays: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 3650
	}))
});
/** First-answer outcome plus the canonical recorded state returned to all contenders. */
const ApprovalResolveResultSchema = closedObject({
	applied: Type.Boolean(),
	approval: TerminalApprovalSnapshotSchema
});
const SessionApprovalEventCommonFields = {
	sessionKey: NonEmptyString,
	sourceSessionKey: Type.Optional(NonEmptyString),
	updatedAtMs: Type.Integer({ minimum: 0 })
};
/** Sanitized pending transition delivered only to an opted-in session audience. */
const PendingSessionApprovalEventSchema = withSince("2026.7", closedObject({
	...SessionApprovalEventCommonFields,
	phase: Type.Literal("pending"),
	approval: PendingApprovalSnapshotSchema
}));
/** Sanitized terminal transition delivered only to an opted-in session audience. */
const TerminalSessionApprovalEventSchema = withSince("2026.7", closedObject({
	...SessionApprovalEventCommonFields,
	phase: Type.Literal("terminal"),
	approval: TerminalApprovalSnapshotSchema
}));
/** Sanitized approval transition delivered only to an opted-in session audience. */
const SessionApprovalEventSchema = withSince("2026.7", Type.Union([PendingSessionApprovalEventSchema, TerminalSessionApprovalEventSchema]));
/** Authoritative pending approval set returned when a session stream subscribes. */
const SessionApprovalReplaySchema = withSince("2026.7", closedObject({
	sessionKey: NonEmptyString,
	updatedAtMs: Type.Integer({ minimum: 0 }),
	approvals: Type.Array(PendingApprovalSnapshotSchema),
	truncated: Type.Boolean()
}));
//#endregion
//#region packages/gateway-protocol/src/approval-result-validators.ts
const validateApprovalGetResult = /* @__PURE__ */ lazyCompile(ApprovalGetResultSchema);
const validateApprovalHistoryResult = /* @__PURE__ */ lazyCompile(ApprovalHistoryResultSchema);
const validateApprovalResolveResult = /* @__PURE__ */ lazyCompile(ApprovalResolveResultSchema);
const validateApprovalPresentation = /* @__PURE__ */ lazyCompile(ApprovalPresentationSchema);
//#endregion
export { ExpiredApprovalSnapshotSchema as C, SessionApprovalEventSchema as D, PluginApprovalSeveritySchema as E, SessionApprovalReplaySchema as O, ExecApprovalPresentationSchema as S, PluginApprovalPresentationSchema as T, ApprovalScopeSchema as _, AllowedApprovalSnapshotSchema as a, CancelledApprovalSnapshotSchema as b, ApprovalDecisionSchema as c, ApprovalHistoryParamsSchema as d, ApprovalHistoryResultSchema as f, ApprovalResolveResultSchema as g, ApprovalResolveParamsSchema as h, validateApprovalResolveResult as i, TerminalApprovalSnapshotSchema as k, ApprovalGetParamsSchema as l, ApprovalPresentationSchema as m, validateApprovalHistoryResult as n, ApprovalAllowDecisionSchema as o, ApprovalKindSchema as p, validateApprovalPresentation as r, ApprovalChannelReviewerSchema as s, validateApprovalGetResult as t, ApprovalGetResultSchema as u, ApprovalSnapshotSchema as v, PendingApprovalSnapshotSchema as w, DeniedApprovalSnapshotSchema as x, ApprovalTerminalReasonSchema as y };
