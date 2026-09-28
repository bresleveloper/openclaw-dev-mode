import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as NonEmptyString } from "./primitives-C-2-W5SF.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/node-presence.ts
/** Canonical reasons accepted from native/background node presence events. */
const NODE_PRESENCE_ALIVE_REASONS = {
	BACKGROUND: "background",
	SILENT_PUSH: "silent_push",
	BACKGROUND_APP_REFRESH: "bg_app_refresh",
	SIGNIFICANT_LOCATION: "significant_location",
	MANUAL: "manual",
	CONNECT: "connect"
};
//#endregion
//#region packages/gateway-protocol/src/schema/nodes.ts
const NodePluginToolNameSchema = Type.String({
	minLength: 1,
	maxLength: 64,
	pattern: "^[A-Za-z][A-Za-z0-9_-]{0,63}$"
});
const NodeSkillNameSchema = Type.String({
	minLength: 1,
	maxLength: 64,
	pattern: "^(?!.*--)[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$"
});
/** Pending node work classes that the gateway may queue for paired devices. */
const NodePendingWorkTypeSchema = Type.String({ enum: ["status.request", "location.request"] });
/** Queue priority accepted when operators enqueue node work. */
const NodePendingWorkPrioritySchema = Type.String({ enum: ["normal", "high"] });
/** Reasons a node can report itself alive without implying an operator action. */
const NodePresenceAliveReasonSchema = Type.Enum(NODE_PRESENCE_ALIVE_REASONS, { type: "string" });
/** Presence heartbeat payload sent by remote nodes to refresh gateway state. */
const NodePresenceAlivePayloadSchema = closedObject({
	trigger: NodePresenceAliveReasonSchema,
	sentAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	displayName: Type.Optional(NonEmptyString),
	version: Type.Optional(NonEmptyString),
	platform: Type.Optional(NonEmptyString),
	deviceFamily: Type.Optional(NonEmptyString),
	modelIdentifier: Type.Optional(NonEmptyString),
	pushTransport: Type.Optional(NonEmptyString)
});
/** Recent operator input activity reported by an interactive node. */
const NodePresenceActivityPayloadSchema = Type.Union([closedObject({
	idleSeconds: Type.Integer({
		minimum: 0,
		maximum: 2592e3
	}),
	source: Type.Optional(Type.Union([Type.Literal("app"), Type.Literal("system")])),
	saturated: Type.Optional(Type.Boolean())
}), closedObject({ action: Type.Literal("clear") })]);
const NodeLoadAverageSchema = Type.Number({
	minimum: 0,
	maximum: 1e5
});
const NodeHostStatsPayloadSchema = Type.Refine(closedObject({
	cpuCount: Type.Integer({
		minimum: 1,
		maximum: 4096
	}),
	loadAverage: Type.Optional(Type.Tuple([
		NodeLoadAverageSchema,
		NodeLoadAverageSchema,
		NodeLoadAverageSchema
	])),
	memoryTotalBytes: Type.Integer({ minimum: 0 }),
	memoryFreeBytes: Type.Integer({ minimum: 0 }),
	diskTotalBytes: Type.Optional(Type.Integer({ minimum: 0 })),
	diskAvailableBytes: Type.Optional(Type.Integer({ minimum: 0 }))
}), (stats) => stats.memoryFreeBytes <= stats.memoryTotalBytes && (stats.diskTotalBytes === void 0 ? stats.diskAvailableBytes === void 0 : stats.diskAvailableBytes !== void 0 && stats.diskAvailableBytes <= stats.diskTotalBytes), () => "free resources must not exceed totals and disk values must be paired");
/** Normalized result for node-originated events after gateway dispatch. */
const NodeEventResultSchema = closedObject({
	ok: Type.Boolean(),
	event: NonEmptyString,
	handled: Type.Boolean(),
	reason: Type.Optional(NonEmptyString)
});
/** Lists pending node-pairing requests. */
const NodePairListParamsSchema = closedObject({});
/** Approves a pending node-pairing request by request id. */
const NodePairApproveParamsSchema = closedObject({ requestId: NonEmptyString });
/** Rejects a pending node-pairing request by request id. */
const NodePairRejectParamsSchema = closedObject({ requestId: NonEmptyString });
/** Removes an already paired node from the gateway trust set. */
const NodePairRemoveParamsSchema = closedObject({ nodeId: NonEmptyString });
/** Renames a paired node while preserving its stable node id. */
const NodeRenameParamsSchema = closedObject({
	nodeId: NonEmptyString,
	displayName: NonEmptyString
});
/** Lists paired nodes known to the gateway. */
const NodeListParamsSchema = closedObject({});
/** Agent-visible tool descriptor advertised by a connected node. */
const NodePluginToolDescriptorSchema = closedObject({
	pluginId: NonEmptyString,
	name: NodePluginToolNameSchema,
	description: NonEmptyString,
	parameters: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	command: Type.Optional(NonEmptyString),
	mcp: Type.Optional(closedObject({
		server: NonEmptyString,
		tool: NonEmptyString
	}))
});
/** Replaces the connected node's dynamic agent-visible plugin/MCP tool catalog. */
const NodePluginToolsUpdateParamsSchema = closedObject({ tools: Type.Array(NodePluginToolDescriptorSchema) });
/** Agent-visible skill descriptor advertised by a connected node. */
const NodeSkillDescriptorSchema = closedObject({
	name: NodeSkillNameSchema,
	description: Type.String({
		minLength: 1,
		maxLength: 1024
	}),
	content: Type.String({
		minLength: 1,
		maxLength: 65536
	})
});
/** Replaces the connected node's agent-visible skill catalog. */
const NodeSkillsUpdateParamsSchema = closedObject({ skills: Type.Array(NodeSkillDescriptorSchema, { maxItems: 64 }) });
/** Acknowledges queued node work that the node has consumed. */
const NodePendingAckParamsSchema = closedObject({ ids: Type.Array(NonEmptyString, { minItems: 1 }) });
/** Requests detailed metadata for one paired node. */
const NodeDescribeParamsSchema = closedObject({ nodeId: NonEmptyString });
/** Invokes a command on a paired node; idempotency allows safe retries. */
const NodeInvokeParamsSchema = closedObject({
	nodeId: NonEmptyString,
	command: NonEmptyString,
	params: Type.Optional(Type.Unknown()),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	idempotencyKey: NonEmptyString,
	sessionKey: Type.Optional(NonEmptyString),
	turnSourceChannel: Type.Optional(Type.String()),
	turnSourceTo: Type.Optional(Type.String()),
	turnSourceAccountId: Type.Optional(Type.String()),
	turnSourceThreadId: Type.Optional(Type.Union([Type.String(), Type.Number()]))
});
/** Result callback payload for a node command invocation. */
const NodeInvokeResultParamsSchema = closedObject({
	id: NonEmptyString,
	nodeId: NonEmptyString,
	ok: Type.Boolean(),
	payload: Type.Optional(Type.Unknown()),
	payloadJSON: Type.Optional(Type.String()),
	error: Type.Optional(closedObject({
		code: Type.Optional(NonEmptyString),
		message: Type.Optional(NonEmptyString)
	}))
});
/** Ordered UTF-8 output emitted while a node command invocation is running. */
const NodeInvokeProgressParamsSchema = closedObject({
	invokeId: NonEmptyString,
	nodeId: NonEmptyString,
	seq: Type.Integer({ minimum: 0 }),
	chunk: Type.String({ maxLength: 16384 })
});
/** Generic node event envelope accepted by the gateway. */
const NodeEventParamsSchema = closedObject({
	event: NonEmptyString,
	payload: Type.Optional(Type.Unknown()),
	payloadJSON: Type.Optional(Type.String())
});
/** Request for a bounded batch of queued work assigned to the calling node. */
const NodePendingDrainParamsSchema = closedObject({ maxItems: Type.Optional(Type.Integer({
	minimum: 1,
	maximum: 10
})) });
/** One queued node-work item returned by pending-work drain calls. */
const NodePendingDrainItemSchema = closedObject({
	id: NonEmptyString,
	type: NodePendingWorkTypeSchema,
	priority: Type.String({ enum: [
		"default",
		"normal",
		"high"
	] }),
	createdAtMs: Type.Integer({ minimum: 0 }),
	expiresAtMs: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	payload: Type.Optional(Type.Record(Type.String(), Type.Unknown()))
});
/** Drain response with a revision marker for node queue state. */
const NodePendingDrainResultSchema = closedObject({
	nodeId: NonEmptyString,
	revision: Type.Integer({ minimum: 0 }),
	items: Type.Array(NodePendingDrainItemSchema),
	hasMore: Type.Boolean()
});
/** Enqueues gateway-initiated work for a paired node. */
const NodePendingEnqueueParamsSchema = closedObject({
	nodeId: NonEmptyString,
	type: NodePendingWorkTypeSchema,
	priority: Type.Optional(NodePendingWorkPrioritySchema),
	expiresInMs: Type.Optional(Type.Integer({
		minimum: 1e3,
		maximum: 864e5
	})),
	wake: Type.Optional(Type.Boolean())
});
/** Enqueue result echoes queue revision and whether wake delivery was attempted. */
const NodePendingEnqueueResultSchema = closedObject({
	nodeId: NonEmptyString,
	revision: Type.Integer({ minimum: 0 }),
	queued: NodePendingDrainItemSchema,
	wakeTriggered: Type.Boolean()
});
closedObject({
	id: NonEmptyString,
	nodeId: NonEmptyString,
	command: NonEmptyString,
	paramsJSON: Type.Optional(Type.String()),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	idempotencyKey: Type.Optional(NonEmptyString)
});
/** Ordered input frame sent by the gateway to one long-lived node invoke. */
const NodeInvokeInputEventSchema = closedObject({
	id: NonEmptyString,
	nodeId: NonEmptyString,
	seq: Type.Integer({ minimum: 0 }),
	payloadJSON: Type.String({ maxLength: 16384 })
});
//#endregion
export { NodePresenceAliveReasonSchema as C, NODE_PRESENCE_ALIVE_REASONS as D, NodeSkillsUpdateParamsSchema as E, NodePresenceAlivePayloadSchema as S, NodeSkillDescriptorSchema as T, NodePendingEnqueueParamsSchema as _, NodeInvokeInputEventSchema as a, NodePluginToolsUpdateParamsSchema as b, NodeInvokeResultParamsSchema as c, NodePairListParamsSchema as d, NodePairRejectParamsSchema as f, NodePendingDrainResultSchema as g, NodePendingDrainParamsSchema as h, NodeHostStatsPayloadSchema as i, NodeListParamsSchema as l, NodePendingAckParamsSchema as m, NodeEventParamsSchema as n, NodeInvokeParamsSchema as o, NodePairRemoveParamsSchema as p, NodeEventResultSchema as r, NodeInvokeProgressParamsSchema as s, NodeDescribeParamsSchema as t, NodePairApproveParamsSchema as u, NodePendingEnqueueResultSchema as v, NodeRenameParamsSchema as w, NodePresenceActivityPayloadSchema as x, NodePluginToolDescriptorSchema as y };
