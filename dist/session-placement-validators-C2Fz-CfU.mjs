import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { f as WorkerIdentifierSchema } from "./worker-protocol-primitives-vA8IesMt.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXfMhak.mjs";
import { a as NonEmptyString } from "./primitives-C-2-W5SF.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/session-placement.ts
/** Durable gateway ownership states for one session execution placement.
* The literal list stays explicit because Type.Union needs a tuple for
* Static inference (a mapped array collapses Static to never); the guard
* below keeps it in lockstep with SESSION_PLACEMENT_STATES. */
const SessionPlacementStateSchema = Type.Union([
	Type.Literal("local"),
	Type.Literal("requested"),
	Type.Literal("provisioning"),
	Type.Literal("syncing"),
	Type.Literal("starting"),
	Type.Literal("active"),
	Type.Literal("draining"),
	Type.Literal("reconciling"),
	Type.Literal("reclaimed"),
	Type.Literal("failed")
]);
const SessionPlacementTimingProperties = {
	generation: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	createdAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	updatedAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	stateChangedAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})
};
const SessionPlacementOwnerEpochSchema = Type.Integer({
	minimum: 1,
	maximum: Number.MAX_SAFE_INTEGER
});
const WorkerBundleHashSchema = Type.String({
	minLength: 64,
	maxLength: 64,
	pattern: "^[a-f0-9]{64}$"
});
const SessionPlacementWorkspaceProperties = {
	workspaceBaseManifestRef: NonEmptyString,
	remoteWorkspaceDir: NonEmptyString
};
const SessionPlacementAckProperties = {
	lastTranscriptAckCursor: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})),
	lastLiveEventAckCursor: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}))
};
const SessionPlacementDiskSpaceSchema = closedObject({
	status: Type.Union([
		Type.Literal("ok"),
		Type.Literal("warning"),
		Type.Literal("critical")
	]),
	availableBytes: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	totalBytes: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	observedAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})
});
const SessionPlacementRunnerSchema = closedObject({
	kind: Type.Literal("device"),
	status: Type.Union([Type.Literal("available"), Type.Literal("offline")]),
	deviceId: Type.Optional(WorkerIdentifierSchema)
});
const SessionPlacementDiskSpaceProperties = { diskSpace: Type.Optional(SessionPlacementDiskSpaceSchema) };
const WORKER_MACHINE_CLASS_MAX_LENGTH = 128;
const WORKER_OPERATING_SYSTEM_MAX_LENGTH = 64;
const WorkerMachineClassSchema = Type.String({
	minLength: 1,
	maxLength: WORKER_MACHINE_CLASS_MAX_LENGTH
});
const WorkerOperatingSystemIdSchema = Type.String({
	minLength: 1,
	maxLength: WORKER_OPERATING_SYSTEM_MAX_LENGTH
});
const SessionPlacementMachineSchema = closedObject({
	class: Type.Optional(WorkerMachineClassSchema),
	os: Type.Optional(WorkerOperatingSystemIdSchema),
	osLabel: Type.Optional(Type.String({
		minLength: 1,
		maxLength: WORKER_OPERATING_SYSTEM_MAX_LENGTH
	})),
	cpu: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 65536
	})),
	memoryGb: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 65536
	}))
});
const SessionPlacementIdentityProperties = {
	providerId: Type.Optional(NonEmptyString),
	profileId: Type.Optional(NonEmptyString),
	machine: Type.Optional(SessionPlacementMachineSchema)
};
const WorkspaceResultConflictSchema = closedObject({
	paths: Type.Array(NonEmptyString, {
		minItems: 1,
		maxItems: 256
	}),
	stagedResultRef: NonEmptyString,
	totalCount: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}))
});
const SessionPlacementConflictProperties = { workspaceResultConflict: Type.Optional(WorkspaceResultConflictSchema) };
const SessionPlacementWorkspaceReconciliationProperties = { workspaceResultReconciling: Type.Optional(Type.Literal(true)) };
const TerminalSessionPlacementProperties = {
	...SessionPlacementIdentityProperties,
	environmentId: Type.Optional(NonEmptyString),
	activeOwnerEpoch: Type.Optional(SessionPlacementOwnerEpochSchema),
	workspaceBaseManifestRef: Type.Optional(NonEmptyString),
	remoteWorkspaceDir: Type.Optional(NonEmptyString),
	workerBundleHash: Type.Optional(WorkerBundleHashSchema),
	...SessionPlacementAckProperties,
	...SessionPlacementConflictProperties,
	terminalReason: Type.Optional(NonEmptyString),
	terminalAtMs: Type.Optional(Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}))
};
function createUnownedSessionPlacementSchema(state) {
	return closedObject({
		state: Type.Literal(state),
		...SessionPlacementTimingProperties
	});
}
function workerOwnedSessionPlacementProperties(state) {
	return {
		state: Type.Literal(state),
		...SessionPlacementTimingProperties,
		...SessionPlacementIdentityProperties,
		environmentId: NonEmptyString,
		activeOwnerEpoch: SessionPlacementOwnerEpochSchema,
		workerBundleHash: WorkerBundleHashSchema,
		...SessionPlacementWorkspaceProperties,
		...SessionPlacementAckProperties,
		...SessionPlacementConflictProperties,
		...SessionPlacementDiskSpaceProperties
	};
}
const LocalSessionPlacementSchema = createUnownedSessionPlacementSchema("local");
const RequestedSessionPlacementSchema = createUnownedSessionPlacementSchema("requested");
const ProvisioningSessionPlacementSchema = closedObject({
	state: Type.Literal("provisioning"),
	...SessionPlacementTimingProperties,
	...SessionPlacementIdentityProperties,
	environmentId: Type.Optional(NonEmptyString)
});
const SyncingSessionPlacementSchema = closedObject({
	state: Type.Literal("syncing"),
	...SessionPlacementTimingProperties,
	...SessionPlacementIdentityProperties,
	environmentId: NonEmptyString,
	workerBundleHash: WorkerBundleHashSchema
});
const StartingSessionPlacementSchema = closedObject({
	state: Type.Literal("starting"),
	...SessionPlacementTimingProperties,
	...SessionPlacementIdentityProperties,
	environmentId: NonEmptyString,
	workerBundleHash: WorkerBundleHashSchema,
	...SessionPlacementWorkspaceProperties
});
const ActiveWorkerSessionPlacementSchema = closedObject({
	...workerOwnedSessionPlacementProperties("active"),
	...SessionPlacementWorkspaceReconciliationProperties,
	runner: Type.Optional(SessionPlacementRunnerSchema)
});
const DrainingSessionPlacementSchema = closedObject({
	...workerOwnedSessionPlacementProperties("draining"),
	...SessionPlacementWorkspaceReconciliationProperties
});
const ReconcilingSessionPlacementSchema = closedObject({ ...workerOwnedSessionPlacementProperties("reconciling") });
const ReclaimedSessionPlacementSchema = closedObject({
	state: Type.Literal("reclaimed"),
	...SessionPlacementTimingProperties,
	...TerminalSessionPlacementProperties
});
const FailedSessionPlacementSchema = closedObject({
	state: Type.Literal("failed"),
	...SessionPlacementTimingProperties,
	...TerminalSessionPlacementProperties,
	recoveryError: NonEmptyString,
	recoveryAction: Type.Optional(Type.Enum(["restart", "stop-first"], { type: "string" }))
});
/** Gateway-visible placement projection; `state` remains the closed discriminator. */
const SessionPlacementSchema = Type.Union([
	LocalSessionPlacementSchema,
	RequestedSessionPlacementSchema,
	ProvisioningSessionPlacementSchema,
	SyncingSessionPlacementSchema,
	StartingSessionPlacementSchema,
	ActiveWorkerSessionPlacementSchema,
	DrainingSessionPlacementSchema,
	ReconcilingSessionPlacementSchema,
	ReclaimedSessionPlacementSchema,
	FailedSessionPlacementSchema
]);
/**
* Requests one-way dispatch to an explicit or automatically selected device (`operator.write`),
* an explicit profile (`operator.admin`), or an `operator.admin`-only
* `cloudWorkers.projectProfiles` lookup when no target is supplied. Target modes are exclusive.
* An absent, unmatched, or invalid mapping is rejected with `INVALID_REQUEST` instead of
* provisioning or falling back to another target.
*/
const SessionsDispatchParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	profileId: Type.Optional(NonEmptyString),
	deviceId: Type.Optional(NonEmptyString),
	autoDevice: Type.Optional(Type.Literal(true)),
	machineClass: Type.Optional(WorkerMachineClassSchema),
	os: Type.Optional(WorkerOperatingSystemIdSchema)
}, {
	additionalProperties: false,
	oneOf: [
		{
			required: ["profileId"],
			not: { anyOf: [{ required: ["deviceId"] }, { required: ["autoDevice"] }] }
		},
		{
			required: ["deviceId"],
			not: { anyOf: [
				{ required: ["profileId"] },
				{ required: ["autoDevice"] },
				{ required: ["machineClass"] },
				{ required: ["os"] }
			] }
		},
		{
			required: ["autoDevice"],
			not: { anyOf: [
				{ required: ["profileId"] },
				{ required: ["deviceId"] },
				{ required: ["machineClass"] },
				{ required: ["os"] }
			] }
		},
		{ not: { anyOf: [
			{ required: ["profileId"] },
			{ required: ["deviceId"] },
			{ required: ["autoDevice"] },
			{ required: ["machineClass"] },
			{ required: ["os"] }
		] } }
	]
});
/** Result returned once session dispatch reaches durable worker ownership. */
const SessionsDispatchResultSchema = closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: NonEmptyString,
	placement: ActiveWorkerSessionPlacementSchema
});
/** Stops a worker or explicitly recovers one failed placement onto the Gateway. */
const SessionsReclaimParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	recoverToGateway: Type.Optional(closedObject({ expectedGeneration: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}) }))
}, { additionalProperties: false });
/** Terminal placement returned after a worker reclaim operation. */
const SessionsReclaimResultPlacementSchema = Type.Union([LocalSessionPlacementSchema, ReclaimedSessionPlacementSchema]);
/** Result returned once worker ownership is reclaimed or a failed placement is cleared. */
const SessionsReclaimResultSchema = Type.Object({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: NonEmptyString,
	placement: SessionsReclaimResultPlacementSchema
}, { additionalProperties: false });
/** Exact active source observed before a session placement move. */
const SessionMoveExpectedSourceSchema = closedObject({
	generation: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	environmentId: WorkerIdentifierSchema,
	ownerEpoch: SessionPlacementOwnerEpochSchema
});
/** Moves the session back to the Gateway without redispatching it. */
const SessionMoveGatewayTargetSchema = closedObject({ kind: Type.Literal("gateway") });
/** Moves the session to one configured cloud worker profile. */
const SessionMoveProfileTargetSchema = closedObject({
	kind: Type.Literal("profile"),
	profileId: WorkerIdentifierSchema,
	machineClass: Type.Optional(WorkerMachineClassSchema),
	os: Type.Optional(WorkerOperatingSystemIdSchema)
});
/** Moves the session to one paired device worker. */
const SessionMoveDeviceTargetSchema = closedObject({
	kind: Type.Literal("device"),
	deviceId: WorkerIdentifierSchema
});
/** Closed destination union for session placement moves. */
const SessionMoveTargetSchema = Type.Union([
	SessionMoveGatewayTargetSchema,
	SessionMoveProfileTargetSchema,
	SessionMoveDeviceTargetSchema
]);
/** Durable operator-visible progress for one placement move intent. */
const SessionPlacementMoveSchema = closedObject({
	target: SessionMoveTargetSchema,
	updatedAtMs: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	error: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 1024
	}))
});
const SessionsMoveTargetCorrelationSchema = Type.Union([Type.Object({ target: SessionMoveGatewayTargetSchema }), Type.Object({ target: Type.Union([SessionMoveProfileTargetSchema, SessionMoveDeviceTargetSchema]) }, { not: { required: ["abandonSource"] } })]);
/** Requests one exact-source placement move without replaying active work. */
const SessionsMoveParamsSchema = Type.Object({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	expected: SessionMoveExpectedSourceSchema,
	target: SessionMoveTargetSchema,
	abandonSource: Type.Optional(Type.Literal(true))
}, {
	additionalProperties: false,
	allOf: [SessionsMoveTargetCorrelationSchema]
});
/** Successful terminal states returned by sessions.move. */
const SessionMovePlacementStateSchema = Type.Union([Type.Literal("local"), Type.Literal("active")]);
/** Bounded placement state returned by sessions.move. */
const SessionMovePlacementSchema = closedObject({
	state: SessionMovePlacementStateSchema,
	generation: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})
});
/** Result returned after the requested placement move reaches its destination. */
const SessionsMoveResultSchema = closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: NonEmptyString,
	placement: SessionMovePlacementSchema
});
//#endregion
//#region packages/gateway-protocol/src/session-placement-validators.ts
const validateSessionsDispatchParams = /* @__PURE__ */ lazyCompile(SessionsDispatchParamsSchema);
const validateSessionsMoveParams = /* @__PURE__ */ lazyCompile(SessionsMoveParamsSchema);
//#endregion
export { SessionsReclaimParamsSchema as _, SessionMoveGatewayTargetSchema as a, SessionMoveProfileTargetSchema as c, SessionPlacementSchema as d, SessionPlacementStateSchema as f, SessionsMoveResultSchema as g, SessionsMoveParamsSchema as h, SessionMoveExpectedSourceSchema as i, SessionMoveTargetSchema as l, SessionsDispatchResultSchema as m, validateSessionsMoveParams as n, SessionMovePlacementSchema as o, SessionsDispatchParamsSchema as p, SessionMoveDeviceTargetSchema as r, SessionMovePlacementStateSchema as s, validateSessionsDispatchParams as t, SessionPlacementMoveSchema as u, SessionsReclaimResultPlacementSchema as v, SessionsReclaimResultSchema as y };
