import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as NonEmptyString } from "./primitives-Ped9kAI8.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/worktrees.ts
const WorktreeNameSchema = Type.String({ pattern: "^[a-z0-9][a-z0-9-]{0,63}$" });
const WorktreeOidSchema = Type.String({ pattern: "^[a-f0-9]{40}(?:[a-f0-9]{24})?$" });
const WorktreeExactStateSchema = closedObject({
	ownerKind: Type.Union([
		Type.Literal("manual"),
		Type.Literal("session"),
		Type.Literal("workboard")
	]),
	ownerId: Type.Optional(Type.String()),
	createdAt: Type.Number(),
	lastActiveAt: Type.Number(),
	head: WorktreeOidSchema,
	branchHead: WorktreeOidSchema,
	indexSha256: Type.String({ pattern: "^[a-f0-9]{64}$" })
});
const WorktreeRunEndCleanupSchema = Type.Union([closedObject({
	outcome: Type.String({ enum: [
		"removed-lossless",
		"retained-busy",
		"retained-dirty",
		"retained-unpushed",
		"retained-provisioned-drift"
	] }),
	at: Type.Integer({ minimum: 0 })
}), closedObject({
	outcome: Type.Literal("failed"),
	at: Type.Integer({ minimum: 0 }),
	reason: Type.String({
		minLength: 1,
		maxLength: 500
	})
})]);
const WorktreeRecordSchema = closedObject({
	id: NonEmptyString,
	name: WorktreeNameSchema,
	repoFingerprint: Type.String({ pattern: "^[a-f0-9]{16}$" }),
	repoRoot: NonEmptyString,
	path: NonEmptyString,
	branch: NonEmptyString,
	baseRef: NonEmptyString,
	ownerKind: Type.String({ enum: [
		"manual",
		"workboard",
		"session"
	] }),
	ownerId: Type.Optional(NonEmptyString),
	snapshotRef: Type.Optional(NonEmptyString),
	createdAt: Type.Integer({ minimum: 0 }),
	lastActiveAt: Type.Integer({ minimum: 0 }),
	removedAt: Type.Optional(Type.Integer({ minimum: 0 })),
	runEndCleanup: Type.Optional(WorktreeRunEndCleanupSchema),
	gcProtection: Type.Optional(NonEmptyString)
});
const WorktreesListParamsSchema = closedObject({});
const WorktreesListResultSchema = closedObject({ worktrees: Type.Array(WorktreeRecordSchema) });
const WorktreesCreateParamsSchema = closedObject({
	repoRoot: NonEmptyString,
	name: Type.Optional(WorktreeNameSchema),
	baseRef: Type.Optional(NonEmptyString),
	profiles: Type.Optional(Type.Array(NonEmptyString)),
	expectedOwnerId: Type.Optional(NonEmptyString),
	expectedRepoIdentity: Type.Optional(NonEmptyString)
});
const WorktreesRemoveParamsSchema = closedObject({
	id: NonEmptyString,
	force: Type.Optional(Type.Boolean()),
	ifLossless: Type.Optional(Type.Boolean()),
	exactState: Type.Optional(WorktreeExactStateSchema),
	expectedOwnerId: Type.Optional(NonEmptyString)
});
const WorktreesRemoveResultSchema = closedObject({
	removed: Type.Boolean(),
	snapshotRef: Type.Optional(NonEmptyString),
	/** Why the pre-removal snapshot failed; removal may have stopped or continued without one. */
	snapshotError: Type.Optional(NonEmptyString),
	recoveryPath: Type.Optional(NonEmptyString),
	recoveryRetainedUntil: Type.Optional(Type.Integer({ minimum: 0 })),
	cleanup: Type.Optional(WorktreeRunEndCleanupSchema)
});
const WorktreeRepositoryStatusSchema = Type.String({ enum: [...[
	"git",
	"not_git",
	"unavailable"
]] });
const WorktreesBranchesParamsSchema = closedObject({
	repoRoot: NonEmptyString,
	includeRepositoryStatus: Type.Optional(Type.Boolean())
});
const WorktreeBranchSchema = closedObject({
	name: NonEmptyString,
	kind: Type.Union([Type.Literal("local"), Type.Literal("remote")])
});
const WorktreesBranchesResultSchema = closedObject({
	branches: Type.Array(WorktreeBranchSchema),
	defaultBranch: Type.Optional(NonEmptyString),
	headBranch: Type.Optional(NonEmptyString),
	repositoryStatus: Type.Optional(WorktreeRepositoryStatusSchema),
	branchesUnavailable: Type.Optional(Type.Boolean())
});
const WorktreesRestoreParamsSchema = closedObject({
	id: NonEmptyString,
	recoverExactState: Type.Optional(WorktreeExactStateSchema),
	expectedOwnerId: Type.Optional(NonEmptyString)
});
const WorktreesGcParamsSchema = closedObject({
	expectedOwnerId: Type.Optional(NonEmptyString),
	jobId: Type.Optional(NonEmptyString),
	retryDeferred: Type.Optional(Type.Boolean())
});
const WorktreesGcResultSchema = closedObject({
	jobId: Type.Optional(NonEmptyString),
	state: Type.Optional(Type.String({ enum: [
		"queued",
		"running",
		"completed",
		"failed"
	] })),
	startedAt: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	completedAt: Type.Optional(Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])),
	error: Type.Optional(Type.Union([Type.String(), Type.Null()])),
	removed: Type.Array(NonEmptyString),
	orphansDeleted: Type.Integer({ minimum: 0 }),
	snapshotsPruned: Type.Integer({ minimum: 0 }),
	gitMaintenance: Type.Optional(closedObject({
		repoRoot: NonEmptyString,
		stage: Type.String({ enum: [
			"packs",
			"objects",
			"maintenance",
			"completed",
			"suspended",
			"throttled"
		] }),
		packsBefore: Type.Optional(Type.Integer({ minimum: 0 })),
		packsAfter: Type.Optional(Type.Integer({ minimum: 0 }))
	})),
	packsRemoved: Type.Optional(Type.Integer({ minimum: 0 })),
	orphansRetired: Type.Optional(Type.Integer({ minimum: 0 })),
	retiredCheckoutPaths: Type.Optional(Type.Array(NonEmptyString)),
	outcome: Type.Optional(Type.String({ enum: [
		"completed",
		"deferred",
		"partial"
	] })),
	issues: Type.Optional(Type.Array(closedObject({
		id: Type.Optional(NonEmptyString),
		stage: Type.String({ enum: [
			"idle",
			"templates",
			"limits",
			"size",
			"orphans",
			"snapshots",
			"git-maintenance"
		] }),
		outcome: Type.String({ enum: [
			"failed",
			"deferred",
			"retired"
		] }),
		reason: Type.String()
	}))),
	issueCount: Type.Optional(Type.Integer({ minimum: 0 })),
	eligibleCount: Type.Optional(Type.Integer({ minimum: 0 })),
	deferredCount: Type.Optional(Type.Integer({ minimum: 0 })),
	failedCount: Type.Optional(Type.Integer({ minimum: 0 })),
	protectedCount: Type.Optional(Type.Integer({ minimum: 0 })),
	protectionReasons: Type.Optional(Type.Record(Type.String(), Type.Integer({ minimum: 0 }))),
	limitsSatisfied: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
	evictions: Type.Optional(Type.Record(Type.String(), Type.Integer({ minimum: 0 })))
});
const WorktreesRecoverRemovalParamsSchema = closedObject({
	id: NonEmptyString,
	snapshot: WorktreeOidSchema,
	expectedOwnerId: NonEmptyString
});
const WorktreesRecoverRemovalResultSchema = closedObject({
	removed: Type.Literal(true),
	snapshotRef: Type.Optional(NonEmptyString)
});
const WorktreesRetireSnapshotParamsSchema = closedObject({
	id: NonEmptyString,
	expectedSnapshotRef: NonEmptyString,
	expectedSnapshotOid: WorktreeOidSchema,
	expectedRemovedAt: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	retainedSourceRef: Type.String({ pattern: "^refs/(?:heads|remotes)/.+" }),
	expectedRetainedSourceOid: WorktreeOidSchema,
	expectedOwnerId: NonEmptyString
});
const WorktreesRetireSnapshotResultSchema = closedObject({
	retired: Type.Literal(true),
	id: NonEmptyString
});
//#endregion
export { WorktreesRetireSnapshotResultSchema as _, WorktreesBranchesResultSchema as a, WorktreesGcResultSchema as c, WorktreesRecoverRemovalParamsSchema as d, WorktreesRecoverRemovalResultSchema as f, WorktreesRetireSnapshotParamsSchema as g, WorktreesRestoreParamsSchema as h, WorktreesBranchesParamsSchema as i, WorktreesListParamsSchema as l, WorktreesRemoveResultSchema as m, WorktreeRecordSchema as n, WorktreesCreateParamsSchema as o, WorktreesRemoveParamsSchema as p, WorktreeRepositoryStatusSchema as r, WorktreesGcParamsSchema as s, WorktreeBranchSchema as t, WorktreesListResultSchema as u };
