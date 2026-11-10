import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { M as resolveNonNegativeIntegerOption, N as resolveOptionalIntegerOption, g as isFutureDateTimestampMs, j as resolveIntegerOption, w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord, c as isRecord, o as asRecord, t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { Fn as object, Jn as string } from "./schemas-BOYIvvln.mjs";
import { j as readSqliteDatabaseWriteTokenForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as canonicalPathFromExistingAncestor, d as pathExists } from "./fs-safe-6Z4UiMS4.mjs";
import { _ as resolveDefaultAgentId, f as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { m as readToolStringParam } from "./common-BofcG96e.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./sqlite-runtime-COh9hQA9.mjs";
import "./file-access-runtime-DZTMkCCU.mjs";
import "./security-runtime-6domDoE8.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./core-BxoR6yel.mjs";
import "./agent-runtime-DkCKSFV_.mjs";
import { t as captureLocalStateMutationGuard } from "./local-state-owner-Ces8bTrZ.mjs";
import "./gateway-runtime-DVShvn9X.mjs";
import { t as resolveDatabaseEngineInput } from "./config-Df1l-yPz.mjs";
import { n as runEngineStoreOperation, t as openEngineWorkerStore } from "./database-engine-runtime-Dw5qNSWG.mjs";
import "./state-paths-FoyMccMm.mjs";
import { n as redactDispatchResult, t as redactClaimToken } from "./card-redaction-BHQMNjYT.mjs";
import { A as removeUndefinedMetadataFields, C as normalizeRunId, D as normalizeTimestamp, E as normalizeTemplateId, G as workboardCardConsumesOwnerSlot, H as addWorkboardDurationMs, I as DEFAULT_CLAIM_TTL_MS, K as workboardCardSlotOwner, M as trimMetadataToBudget, N as workerLogEntry, O as normalizeTitle, P as isAbsoluteWorkspacePath, S as normalizeProofInput, T as normalizeStringList, U as isWorkboardClaimReclaimable, W as secondsToDurationMs, _ as normalizeLinkType, a as capText, b as normalizeNotificationSubscription, c as metadataIsEmpty, d as normalizeAutomation, f as normalizeBoardId, h as normalizeExecution, i as appendLinkPreservingDependencies, j as syncExecutionSessionKey, k as normalizeWorkspace, l as normalizeArtifact, m as normalizeBoundedString, n as unwrapWorkboardSqliteResult, o as clearDiagnostics, p as normalizeBoardIdRequired, q as createDefaultWorkboardSessionsBoardSpec, r as appendCompletionProof, s as deriveChildIdempotencyKey, u as normalizeAttachmentInput, v as normalizeMetadata, w as normalizeStatus, x as normalizePriority, y as normalizeNotes, z as POSITION_STEP } from "./sqlite-store-errors-BajGRUMO.mjs";
import { u as WORKBOARD_STATUSES } from "./src-uqZESs4H.mjs";
import { t as definedFields } from "./record-fields-BHIzSIrv.mjs";
import { pathToFileURL } from "node:url";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
//#region extensions/workboard/src/workspace-access.ts
const WORKBOARD_SESSIONS_BOARD_TOOL_NAMES = [
	"workboard_sessions_board_read",
	"workboard_sessions_board_update",
	"workboard_sessions_board_move"
];
/** Card tools stay optional; sessions-board tools register separately as default-on. */
const WORKBOARD_CARD_TOOL_NAMES = [
	"workboard_list",
	"workboard_create",
	"workboard_link",
	"workboard_read",
	"workboard_claim",
	"workboard_heartbeat",
	"workboard_complete",
	"workboard_attachment_add",
	"workboard_attachment_read",
	"workboard_attachment_delete",
	"workboard_block",
	"workboard_boards",
	"workboard_board_create",
	"workboard_board_archive",
	"workboard_board_delete",
	"workboard_stats",
	"workboard_runs",
	"workboard_specify",
	"workboard_decompose",
	"workboard_notify_subscribe",
	"workboard_notify_list",
	"workboard_notify_events",
	"workboard_notify_advance",
	"workboard_notify_unsubscribe",
	"workboard_promote",
	"workboard_reassign",
	"workboard_reclaim",
	"workboard_dispatch",
	"workboard_release",
	"workboard_comment",
	"workboard_proof",
	"workboard_worker_log",
	"workboard_protocol_violation",
	"workboard_unblock",
	"workboard_move"
];
const WORKBOARD_TOOL_NAMES = [...WORKBOARD_CARD_TOOL_NAMES, ...WORKBOARD_SESSIONS_BOARD_TOOL_NAMES];
const WORKBOARD_REQUIRED_WORKER_TOOLS = [
	"workboard_heartbeat",
	"workboard_complete",
	"workboard_block"
];
function resolveWorkboardAgentWorkspace(config, agentId) {
	return resolveAgentWorkspaceDir(config, agentId ?? resolveDefaultAgentId(config));
}
function resolveConfiguredWorkboardWorkspaceAccess(params) {
	if (params.unrestricted) return { unrestricted: true };
	return {
		unrestricted: false,
		writable: true,
		roots: listAgentIds(params.config).map((agentId) => resolveAgentWorkspaceDir(params.config, agentId))
	};
}
async function resolveAgentWorkboardWorkspaceRuntime(params) {
	const agentId = params.agentId ?? resolveDefaultAgentId(params.config);
	const sandboxRuntime = await params.prepareSandboxWorkspaceAuthority({
		config: params.config,
		agentId,
		confinedToolNames: WORKBOARD_TOOL_NAMES,
		requiredToolNames: WORKBOARD_REQUIRED_WORKER_TOOLS,
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir
	});
	return {
		sandboxed: sandboxRuntime.sandboxed,
		workspaceAccess: sandboxRuntime.sandboxed ? {
			unrestricted: false,
			roots: [resolveAgentWorkspaceDir(params.config, agentId)],
			writable: sandboxRuntime.workspaceAccess === "rw"
		} : { unrestricted: true },
		...sandboxRuntime.confinementError ? { confinementError: sandboxRuntime.confinementError } : {}
	};
}
function resolveCommandWorkboardWorkspaceAccess(params) {
	if (params.gatewayClientScopes) return resolveConfiguredWorkboardWorkspaceAccess({
		config: params.config,
		unrestricted: params.gatewayClientScopes.includes("operator.admin")
	});
	const agentId = params.agentId ?? resolveDefaultAgentId(params.config);
	const sandboxRuntime = params.sessionKey && params.resolveSandboxWorkspaceAuthority ? params.resolveSandboxWorkspaceAuthority({
		config: params.config,
		agentId,
		sessionKey: params.sessionKey
	}) : void 0;
	if (sandboxRuntime?.sandboxed) return {
		unrestricted: false,
		roots: [resolveAgentWorkspaceDir(params.config, agentId)],
		writable: sandboxRuntime.workspaceAccess === "rw"
	};
	return (resolveAgentConfig(params.config, agentId)?.tools?.fs?.workspaceOnly ?? params.config.tools?.fs?.workspaceOnly) === true ? {
		unrestricted: false,
		roots: [resolveAgentWorkspaceDir(params.config, agentId)],
		writable: true
	} : { unrestricted: true };
}
function resolveToolWorkboardWorkspaceAccess(context, resolveSandboxWorkspaceAuthority) {
	if (!context?.sandboxed && context?.fsPolicy?.workspaceOnly !== true) return { unrestricted: true };
	const config = context.runtimeConfig ?? context.getRuntimeConfig?.() ?? context.config;
	const sandboxRuntime = context.sandboxed && config && context.sessionKey && resolveSandboxWorkspaceAuthority ? resolveSandboxWorkspaceAuthority({
		config,
		agentId: context.agentId,
		sessionKey: context.sessionKey
	}) : void 0;
	return {
		unrestricted: false,
		roots: context.workspaceDir ? [context.workspaceDir] : [],
		writable: sandboxRuntime ? sandboxRuntime.workspaceAccess === "rw" : !context.sandboxed
	};
}
async function canonicalizeWorkboardWorkspaceAccess(access) {
	if (access.unrestricted) return access;
	const roots = Array.from(new Set(await Promise.all(access.roots.map(async (root) => await canonicalPathFromExistingAncestor(root)))));
	if (roots.length === 0) throw new Error("restricted workspace access has no allowed roots.");
	return {
		unrestricted: false,
		roots,
		writable: access.writable
	};
}
function intersectWorkboardWorkspaceAccess(left, right) {
	if (left.unrestricted) return right;
	if (right.unrestricted) return left;
	const roots = /* @__PURE__ */ new Set();
	for (const leftRoot of left.roots) for (const rightRoot of right.roots) if (leftRoot === rightRoot || isPathInside(leftRoot, rightRoot)) roots.add(rightRoot);
	else if (isPathInside(rightRoot, leftRoot)) roots.add(leftRoot);
	if (roots.size === 0) throw new Error("workspace access does not overlap the card's persisted authority.");
	return {
		unrestricted: false,
		roots: Array.from(roots),
		writable: left.writable && right.writable
	};
}
var WorkboardWorkspaceOutsideRootsError = class extends Error {
	constructor() {
		super("workspace path is outside the caller's allowed workspaces.");
		this.name = "WorkboardWorkspaceOutsideRootsError";
	}
};
async function assertCanonicalWorkboardPathAccess(candidate, access, exactRoot = false) {
	if (access.unrestricted) return candidate;
	for (const root of access.roots) {
		const canonicalRoot = await canonicalPathFromExistingAncestor(root);
		if (exactRoot ? canonicalRoot === candidate : isPathInside(canonicalRoot, candidate)) return candidate;
	}
	if (exactRoot) throw new Error("workspace path must equal one of the caller's allowed workspace roots.");
	throw new WorkboardWorkspaceOutsideRootsError();
}
function assertCanonicalWorkboardRootAccess(candidate, access) {
	return assertCanonicalWorkboardPathAccess(candidate, access, true);
}
async function assertPathAllowed(value, access) {
	if (typeof value !== "string" || !value.trim()) return;
	return await assertCanonicalWorkboardPathAccess(await canonicalPathFromExistingAncestor(value.trim()), access);
}
async function assertWorkspaceAllowed(value, access) {
	const workspace = asOptionalRecord(value);
	if (!workspace) return;
	await assertPathAllowed(workspace.path, access);
	await assertPathAllowed(workspace.sourcePath, access);
}
function* workspaceMutationRecords(value) {
	const record = asOptionalRecord(value);
	if (!record) return;
	yield record;
	yield* workspaceMutationRecords(record.patch);
	yield* workspaceMutationRecords(asOptionalRecord(record.metadata)?.automation);
	if (Array.isArray(record.children)) for (const child of record.children) yield* workspaceMutationRecords(child);
}
function containsWorkboardWorkspaceMutation(value) {
	for (const record of workspaceMutationRecords(value)) if (Object.hasOwn(record, "workspace") || Object.hasOwn(record, "defaultWorkspace")) return true;
	return false;
}
function withWorkboardWorkspaceAccess(value, access) {
	return {
		...withoutWorkboardWorkspaceAccess(value),
		workspaceAccess: access
	};
}
function withoutWorkboardWorkspaceAccess(value) {
	const { workspaceAccess: _untrustedWorkspaceAccess, ...rest } = asOptionalRecord(value) ?? {};
	return rest;
}
function withWorkboardDecomposeWorkspaceAccess(value, access) {
	const record = withoutWorkboardWorkspaceAccess(value);
	return {
		...record,
		...Array.isArray(record.children) ? { children: record.children.map((child) => withWorkboardWorkspaceAccess(child, access)) } : {}
	};
}
async function assertWorkboardWorkspaceMutationAccess(value, access) {
	if (access.unrestricted) return;
	for (const record of workspaceMutationRecords(value)) {
		await assertWorkspaceAllowed(record.workspace, access);
		await assertWorkspaceAllowed(record.defaultWorkspace, access);
	}
}
async function assertWorkboardWorkspaceSourceAccess(workspace, access) {
	const record = asOptionalRecord(workspace);
	return await assertPathAllowed(record?.sourcePath ?? record?.path, access);
}
function guardWorkboardToolsForWorkspaceAccess(tools, context, resolveSandboxWorkspaceAuthority) {
	const workspaceAccess = resolveToolWorkboardWorkspaceAccess(context, resolveSandboxWorkspaceAuthority);
	return tools.map((tool) => ({
		...tool,
		execute: async (toolCallId, rawParams, signal, onUpdate) => {
			const canonicalAccess = await canonicalizeWorkboardWorkspaceAccess(workspaceAccess);
			await assertWorkboardWorkspaceMutationAccess(rawParams, canonicalAccess);
			const sanitizedParams = withoutWorkboardWorkspaceAccess(rawParams);
			const constrainedParams = tool.name === "workboard_create" ? withWorkboardWorkspaceAccess(sanitizedParams, canonicalAccess) : tool.name === "workboard_decompose" ? withWorkboardDecomposeWorkspaceAccess(sanitizedParams, canonicalAccess) : tool.name === "workboard_specify" && containsWorkboardWorkspaceMutation(sanitizedParams) ? withWorkboardWorkspaceAccess(sanitizedParams, canonicalAccess) : sanitizedParams;
			return await tool.execute(toolCallId, constrainedParams, signal, onUpdate);
		}
	}));
}
//#endregion
//#region extensions/workboard/src/dispatcher-workspace.ts
function managedWorktreeName(cardId) {
	return `wb-${cardId.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-")}`.slice(0, 64).replace(/-$/, "");
}
function hasTerminalWorkboardExecution(card) {
	const status = card.execution?.status ?? card.status;
	return status === "review" || status === "blocked" || status === "done";
}
function isWorkboardWorktreeCleanupCandidate(card) {
	const workspace = card.metadata?.automation?.workspace;
	return Boolean(workspace?.kind === "worktree" && workspace.path && workspace.sourcePath && hasTerminalWorkboardExecution(card));
}
async function cleanupWorkboardCardWorktree(params) {
	const current = await params.store.get(params.card.id);
	const workspace = (params.workspaceMutation?.after ?? current)?.metadata?.automation?.workspace;
	if (!current || !hasTerminalWorkboardExecution(current) || workspace?.kind !== "worktree" || !workspace?.path || !workspace.sourcePath) return;
	if (!await params.worktrees.removeIfLossless({
		path: workspace.path,
		ownerKind: "workboard",
		ownerId: params.card.id
	}) && await pathExists(workspace.path)) return;
	if (params.workspaceMutation) {
		await params.store.compensateWorkspaceMutation(params.workspaceMutation.before, params.workspaceMutation.after);
		return;
	}
	await params.store.update(current.id, { workspace: {
		kind: "worktree",
		path: workspace.sourcePath,
		...workspace.sourceBranch ? { branch: workspace.sourceBranch } : {}
	} }, { expectedUpdatedAt: current.updatedAt });
}
async function resolveDispatchWorkspaceAccess(params) {
	const currentAccess = await canonicalizeWorkboardWorkspaceAccess(params.currentAccess ?? { unrestricted: true });
	const persistedAccess = params.card.metadata?.automation?.workspaceAccess;
	const workspace = params.card.metadata?.automation?.workspace;
	let targetWorkspace;
	if (!persistedAccess?.unrestricted || !currentAccess.unrestricted) {
		const resolved = params.resolveAgentWorkspace?.(params.card.agentId);
		targetWorkspace = resolved ? await canonicalPathFromExistingAncestor(resolved) : void 0;
	}
	const workspaceAccess = intersectWorkboardWorkspaceAccess(persistedAccess ? await canonicalizeWorkboardWorkspaceAccess(persistedAccess) : currentAccess.unrestricted ? !workspace || workspace.kind === "scratch" ? currentAccess : (() => {
		throw new Error("card workspace authority is unknown; re-save its workspace with current permissions before dispatch.");
	})() : currentAccess, currentAccess);
	if (!workspaceAccess.unrestricted && !workspaceAccess.writable) throw new Error("card workspace authority is read-only; manual movement is allowed but worker dispatch requires write access.");
	return {
		workspaceAccess,
		...targetWorkspace ? { targetWorkspace } : {},
		persistWorkspaceAccess: !persistedAccess
	};
}
async function assertRestrictedWorkboardTarget(params) {
	const resolved = params.resolveAgentWorkspaceRuntime ? await params.resolveAgentWorkspaceRuntime(params.agentId, params.sessionKey, params.root, params.modelProvider, params.modelId) : {
		sandboxed: false,
		workspaceAccess: { unrestricted: true }
	};
	const targetRuntime = {
		...resolved,
		workspaceAccess: await canonicalizeWorkboardWorkspaceAccess(resolved.workspaceAccess)
	};
	if (!targetRuntime.sandboxed) throw new Error("target agent is not sandboxed for this restricted Workboard card.");
	if (targetRuntime.confinementError) throw new Error(targetRuntime.confinementError);
	if (targetRuntime.workspaceAccess.unrestricted || !targetRuntime.workspaceAccess.writable) throw new Error("target agent does not have writable workspace-only access.");
	await assertCanonicalWorkboardRootAccess(params.root, targetRuntime.workspaceAccess);
	if (!params.worktrees) throw new Error("workspace checkout inspection is unavailable for restricted dispatch.");
	const checkoutRoot = await params.worktrees.resolveCheckoutRoot({ path: params.root });
	if (!checkoutRoot) return;
	if (await canonicalPathFromExistingAncestor(checkoutRoot) !== params.root) throw new Error("workspace root is nested inside a broader Git checkout.");
	if (!params.worktrees.hasSelfContainedCheckoutMetadata || !await params.worktrees.hasSelfContainedCheckoutMetadata({ path: params.root })) throw new Error("restricted workspace Git metadata must be contained inside its root.");
}
//#endregion
//#region extensions/workboard/src/store-card-helpers.ts
function compareCards(left, right) {
	if (left.status !== right.status) return WORKBOARD_STATUSES.indexOf(left.status) - WORKBOARD_STATUSES.indexOf(right.status);
	if (left.position !== right.position) return left.position - right.position;
	return left.createdAt - right.createdAt;
}
function cardSessionKey(card) {
	return card.sessionKey ?? card.execution?.sessionKey;
}
function cardRunId(card) {
	return card.runId ?? card.execution?.runId;
}
function executionAttemptStatus(execution) {
	if (execution.status === "running") return "running";
	if (execution.status === "blocked") return "blocked";
	if (execution.status === "done" || execution.status === "review") return "succeeded";
	return "stopped";
}
function syncExecutionAttemptMetadata(metadata, execution, now) {
	if (!execution) return metadata;
	const attemptStatus = executionAttemptStatus(execution);
	const attempts = [...metadata.attempts ?? []];
	const existingIndex = attempts.findIndex((attempt) => execution.runId ? attempt.runId === execution.runId : execution.sessionKey ? !attempt.runId && attempt.sessionKey === execution.sessionKey : !attempt.runId && !attempt.sessionKey);
	const existingAttempt = existingIndex >= 0 ? attempts[existingIndex] : void 0;
	const nextAttempt = {
		id: existingAttempt?.id ?? randomUUID(),
		status: attemptStatus,
		startedAt: existingAttempt?.startedAt ?? execution.startedAt,
		mode: execution.mode,
		...execution.engine ? { engine: execution.engine } : {},
		...execution.model ? { model: execution.model } : {},
		...execution.sessionKey ? { sessionKey: execution.sessionKey } : {},
		...execution.runId ? { runId: execution.runId } : {},
		...attemptStatus !== "running" && { endedAt: execution.updatedAt || now },
		...attemptStatus !== "succeeded" && existingAttempt?.error ? { error: existingAttempt.error } : {}
	};
	if (existingIndex >= 0) attempts[existingIndex] = nextAttempt;
	else attempts.push(nextAttempt);
	const previousFailed = existingAttempt?.status === "blocked" || existingAttempt?.status === "failed";
	const failureCount = attemptStatus === "blocked" ? previousFailed ? metadata.failureCount : (metadata.failureCount ?? 0) + 1 : attemptStatus === "succeeded" ? 0 : metadata.failureCount;
	return removeUndefinedMetadataFields({
		...metadata,
		attempts: attempts.slice(-30),
		failureCount
	});
}
function appendEvent(card, event, at = Date.now()) {
	return [...card.events ?? [], {
		id: randomUUID(),
		at,
		...event
	}].slice(-50);
}
function appendComment(comments, body, now) {
	return body ? [...comments ?? [], {
		id: randomUUID(),
		body,
		createdAt: now ?? Date.now()
	}].slice(-50) : comments;
}
function metadataEntriesChanged(existing, next, key) {
	const previous = existing.metadata?.[key];
	const current = next.metadata?.[key];
	const latestId = current?.at(-1)?.id;
	return (previous?.length ?? 0) !== (current?.length ?? 0) || Boolean(latestId && latestId !== previous?.at(-1)?.id);
}
function lifecycleStatusSourceUpdatedAtFromPatch(metadata) {
	if (!isRecord(metadata) || !Object.hasOwn(metadata, "lifecycleStatusSourceUpdatedAt")) return;
	return normalizeTimestamp(metadata.lifecycleStatusSourceUpdatedAt, 0);
}
function latestStatusTransitionAt(card) {
	for (let index = (card.events?.length ?? 0) - 1; index >= 0; index -= 1) {
		const event = card.events?.[index];
		if ((event?.kind === "moved" || event?.kind === "created") && (event.kind === "created" && card.status !== "todo" || event.kind === "moved" && event.fromStatus !== event.toStatus) && event.toStatus === card.status && typeof event.at === "number" && Number.isFinite(event.at)) return event.at;
	}
}
function shouldSkipPersistedLifecycleStatusUpdate(existing, sourceUpdatedAt) {
	const lifecycleStatusSourceUpdatedAt = existing.metadata?.lifecycleStatusSourceUpdatedAt;
	if (lifecycleStatusSourceUpdatedAt !== void 0) return sourceUpdatedAt < lifecycleStatusSourceUpdatedAt;
	const statusTransitionAt = latestStatusTransitionAt(existing);
	return statusTransitionAt !== void 0 && sourceUpdatedAt < statusTransitionAt;
}
function shouldSyncWorkboardLifecycleStatus(card, target) {
	if (!target || card.status === target) return false;
	if (target === "running") return card.status === "backlog" || card.status === "todo" || card.status === "ready";
	return (target === "blocked" || target === "review") && (card.status === "running" || card.status === "todo" || card.status === "ready");
}
function updateEvent(existing, next) {
	if (existing.metadata?.workerProtocol?.state !== next.metadata?.workerProtocol?.state && next.metadata?.workerProtocol?.state === "violated") return { kind: "protocol_violation" };
	if (existing.status !== next.status || existing.position !== next.position) return {
		kind: "moved",
		fromStatus: existing.status,
		toStatus: next.status
	};
	if (cardSessionKey(existing) !== cardSessionKey(next)) return {
		kind: "linked",
		...cardSessionKey(next) ? { sessionKey: cardSessionKey(next) } : {}
	};
	if (existing.metadata?.claim?.token !== next.metadata?.claim?.token) return { kind: "claimed" };
	if (existing.metadata?.claim?.lastHeartbeatAt !== next.metadata?.claim?.lastHeartbeatAt) return { kind: "heartbeat" };
	if (existing.execution?.status !== next.execution?.status || existing.execution?.engine !== next.execution?.engine || cardRunId(existing) !== cardRunId(next)) {
		const existingAttempts = existing.metadata?.attempts ?? [];
		const nextAttempts = next.metadata?.attempts ?? [];
		const latestAttempt = nextAttempts.at(-1);
		const attemptStarted = nextAttempts.length > existingAttempts.length;
		const previousAttempt = !attemptStarted && latestAttempt ? existingAttempts.find((attempt) => attempt.id === latestAttempt.id) : void 0;
		if (attemptStarted || latestAttempt && previousAttempt?.status !== latestAttempt.status) return {
			kind: attemptStarted ? "attempt_started" : "attempt_updated",
			...latestAttempt?.sessionKey ? { sessionKey: latestAttempt.sessionKey } : {},
			...latestAttempt?.runId ? { runId: latestAttempt.runId } : {}
		};
		return {
			kind: "execution_updated",
			...cardSessionKey(next) ? { sessionKey: cardSessionKey(next) } : {},
			...cardRunId(next) ? { runId: cardRunId(next) } : {}
		};
	}
	for (const [key, kind] of [
		["comments", "comment_added"],
		["links", "link_added"],
		["proof", "proof_added"],
		["artifacts", "artifact_added"]
	]) if (metadataEntriesChanged(existing, next, key)) return { kind };
	if (metadataEntriesChanged(existing, next, "attachments")) return (next.metadata?.attachments?.length ?? 0) > (existing.metadata?.attachments?.length ?? 0) ? { kind: "attachment_added" } : { kind: "edited" };
	if (existing.metadata?.workerProtocol?.state !== next.metadata?.workerProtocol?.state || metadataEntriesChanged(existing, next, "workerLogs")) return { kind: "orchestration" };
	if ((existing.metadata?.diagnostics?.length ?? 0) !== (next.metadata?.diagnostics?.length ?? 0)) return { kind: "diagnostic" };
	if (metadataEntriesChanged(existing, next, "notifications")) return { kind: "notification" };
	if (existing.metadata?.automation?.dispatchCount !== next.metadata?.automation?.dispatchCount || existing.metadata?.automation?.lastDispatchAt !== next.metadata?.automation?.lastDispatchAt) return { kind: "dispatch" };
	if (!existing.metadata?.archivedAt && next.metadata?.archivedAt) return { kind: "archived" };
	if (existing.metadata?.archivedAt && !next.metadata?.archivedAt) return { kind: "unarchived" };
	if (!existing.metadata?.stale && next.metadata?.stale) return { kind: "stale" };
	return { kind: "edited" };
}
function assertCanMutateClaimedCard(card, scope) {
	if (!scope) return;
	const claim = card.metadata?.claim;
	if (!claim) return;
	const ownerId = normalizeOptionalString(scope.ownerId);
	const token = normalizeOptionalString(scope.token);
	if (claim.ownerId !== ownerId && !safeEqualSecret(token, claim.token)) throw new Error(`card is claimed by ${claim.ownerId}.`);
}
function retryBudgetExhausted(card) {
	const maxRetries = card.metadata?.automation?.maxRetries;
	return Boolean(maxRetries && (card.metadata?.failureCount ?? 0) > maxRetries);
}
function mergeDiagnostics(previous, next) {
	const byKind = new Map(previous?.map((entry) => [entry.kind, entry]));
	return next.map((entry) => {
		const prior = byKind.get(entry.kind);
		return prior ? {
			...entry,
			firstSeenAt: prior.firstSeenAt,
			count: prior.count + 1
		} : entry;
	});
}
function computeCardDiagnostics(card, now) {
	const diagnostics = [];
	const addDiagnostic = (params) => {
		diagnostics.push({
			...params,
			firstSeenAt: now,
			lastSeenAt: now,
			count: 1
		});
	};
	if (card.metadata?.archivedAt) {
		if (card.status !== "done") addDiagnostic({
			kind: "archived_but_active",
			severity: "warning",
			title: "Archived card is still in an active status",
			detail: `Card status is "${card.status}" but it is archived, so it is excluded from dispatch without any start failure or error. Unarchive it or move it to "done" to stop the silent skip.`,
			actions: []
		});
		return diagnostics;
	}
	const lastHeartbeatAt = (card.metadata?.claim)?.lastHeartbeatAt ?? card.execution?.updatedAt ?? card.updatedAt;
	if ((card.status === "todo" || card.status === "backlog" || card.status === "ready") && card.agentId && now - card.updatedAt > 36e5) addDiagnostic({
		kind: "stranded_ready",
		severity: "warning",
		title: "Assigned card is waiting",
		detail: "The card has an assigned agent but has not been claimed recently.",
		actions: [{
			kind: "claim",
			label: "Claim card"
		}]
	});
	if (card.status === "running" && now - lastHeartbeatAt > 12e5) addDiagnostic({
		kind: "running_without_heartbeat",
		severity: "error",
		title: "Running card has no recent heartbeat",
		detail: "The linked run or claim has not reported recent activity.",
		actions: [{
			kind: "open_session",
			label: "Open session"
		}, {
			kind: "reassign",
			label: "Reassign card"
		}]
	});
	if (card.status === "blocked" && now - card.updatedAt > 864e5) addDiagnostic({
		kind: "blocked_too_long",
		severity: "warning",
		title: "Blocked card needs attention",
		detail: "The card has been blocked for more than a day.",
		actions: [{
			kind: "unblock",
			label: "Move to todo"
		}]
	});
	if ((card.metadata?.failureCount ?? 0) >= 2) addDiagnostic({
		kind: "repeated_failures",
		severity: "error",
		title: "Repeated run failures",
		detail: "Multiple attempts failed or blocked on this card.",
		actions: [{
			kind: "reassign",
			label: "Reassign card"
		}]
	});
	if (card.status === "done" && !(card.metadata?.proof?.length || card.metadata?.artifacts?.length || card.metadata?.attachments?.length)) addDiagnostic({
		kind: "missing_proof",
		severity: "warning",
		title: "Done card has no proof",
		detail: "The card is marked done without proof or an attached artifact.",
		actions: [{
			kind: "add_proof",
			label: "Add proof"
		}]
	});
	if (card.sessionKey && !card.execution && card.status === "running") addDiagnostic({
		kind: "orphaned_session",
		severity: "warning",
		title: "Running card has only a loose session link",
		detail: "The card is running but has no execution record for lifecycle handoff.",
		actions: [{
			kind: "open_session",
			label: "Open session"
		}]
	});
	return diagnostics;
}
function cardBoardId(card) {
	return card.metadata?.automation?.boardId ?? "default";
}
function cardResultSummary(card) {
	return card.metadata?.automation?.summary ?? card.metadata?.comments?.findLast((comment) => comment.body.trim())?.body ?? card.metadata?.proof?.findLast((proof) => proof.note?.trim())?.note;
}
function appendWorkerContextSection(lines, heading, entries, format, maxEntries = 8) {
	const recent = entries?.slice(-maxEntries) ?? [];
	if (recent.length) lines.push("", `## ${heading}`, ...recent.map(format));
}
function buildWorkerContext(card, cards = []) {
	const lines = [
		`# Workboard card ${card.id}`,
		`Title: ${card.title}`,
		`Status: ${card.status}`,
		`Priority: ${card.priority}`,
		`Board: ${cardBoardId(card)}`,
		`Agent: ${card.agentId ?? "(default)"}`
	];
	if (card.notes) lines.push("", "## Notes", capText(card.notes, 4e3) ?? "");
	appendWorkerContextSection(lines, "Recent attempts", card.metadata?.attempts, (attempt) => `- ${attempt.status} ${attempt.model ?? ""} ${attempt.error ? `error=${capText(attempt.error, 240)}` : ""}`.trim());
	appendWorkerContextSection(lines, "Recent comments", card.metadata?.comments, (comment) => `- ${capText(comment.body, 400)}`, 12);
	appendWorkerContextSection(lines, "Proof", card.metadata?.proof, (entry) => `- ${entry.status}: ${capText(entry.label ?? entry.command ?? entry.url ?? entry.note, 400)}`);
	appendWorkerContextSection(lines, "Artifacts", card.metadata?.artifacts, (artifact) => `- ${capText(artifact.label ?? artifact.url ?? artifact.path, 400)}`);
	appendWorkerContextSection(lines, "Attachments", card.metadata?.attachments, (attachment) => {
		const detail = [
			attachment.fileName,
			`${attachment.byteSize} bytes`,
			attachment.mimeType,
			attachment.note
		].filter(Boolean).join(" · ");
		return `- ${capText(detail, 500)}`;
	});
	if (card.metadata?.workerProtocol) {
		const protocol = card.metadata.workerProtocol;
		lines.push("", "## Worker protocol");
		lines.push(`${protocol.state}: ${capText(protocol.detail, 500) ?? "no detail"}`);
	}
	appendWorkerContextSection(lines, "Worker logs", card.metadata?.workerLogs, (log) => `- ${log.level}: ${capText(log.message, 500)}`);
	appendWorkerContextSection(lines, "Links", card.metadata?.links, (link) => `- ${link.type}: ${link.title ?? link.url ?? link.targetCardId ?? ""}`);
	const cardsById = new Map(cards.map((entry) => [entry.id, entry]));
	appendWorkerContextSection(lines, "Parent results", cardParentIds(card).map((parentId) => cardsById.get(parentId)).filter((parent) => parent !== void 0 && parent.status === "done").slice(-6), (parent) => `- ${parent.id} ${parent.title}: ${capText(cardResultSummary(parent), 500) ?? "done"}`);
	const recentAgentWork = card.agentId && cards.length ? cards.filter((entry) => entry.id !== card.id && cardBoardId(entry) === cardBoardId(card) && entry.agentId === card.agentId && entry.status === "done").toSorted((a, b) => b.updatedAt - a.updatedAt).slice(0, 5) : [];
	appendWorkerContextSection(lines, `Recent done work by ${card.agentId}`, recentAgentWork, (entry) => `- ${entry.id} ${entry.title}: ${capText(cardResultSummary(entry), 300) ?? "done"}`);
	const automation = card.metadata?.automation;
	if (automation) {
		lines.push("", "## Automation");
		if (automation.tenant) lines.push(`Tenant: ${automation.tenant}`);
		if (automation.boardId) lines.push(`Board: ${automation.boardId}`);
		if (automation.skills?.length) lines.push(`Skills: ${automation.skills.join(", ")}`);
		if (automation.workspace) lines.push(`Workspace: ${automation.workspace.kind}${automation.workspace.path ? ` ${automation.workspace.path}` : ""}`);
		if (automation.summary) lines.push(`Summary: ${capText(automation.summary, 400)}`);
	}
	const diagnostics = computeCardDiagnostics(card, Date.now());
	appendWorkerContextSection(lines, "Active diagnostics", diagnostics, (entry) => `- ${entry.severity}: ${entry.title}`, diagnostics.length);
	return lines.join("\n");
}
function cardDependencyIds(card, type) {
	return (card.metadata?.links ?? []).filter((link) => link.type === type && link.targetCardId).map((link) => link.targetCardId).filter((id, index, ids) => ids.indexOf(id) === index);
}
function cardParentIds(card) {
	return cardDependencyIds(card, "parent");
}
function cardChildIds(card) {
	return cardDependencyIds(card, "child");
}
function latestRunningAttempt(card) {
	return card.metadata?.attempts?.findLast((attempt) => attempt.status === "running");
}
function isDependencyPromotableStatus(status) {
	return status === "backlog" || status === "triage" || status === "todo" || status === "scheduled" || status === "ready";
}
function isActiveDependencyTarget(card, options = {}) {
	return Boolean(card.metadata?.claim) || card.execution?.status === "running" || Boolean(latestRunningAttempt(card)) || !options.allowStatusOnly && (card.status === "running" || card.status === "review");
}
function closeRunningAttempts(attempts, now, status, reason) {
	if (!attempts?.some((attempt) => attempt.status === "running")) return attempts;
	return attempts.map((attempt) => attempt.status === "running" ? {
		...attempt,
		status,
		endedAt: now,
		...reason ? { error: reason } : {}
	} : attempt);
}
function notificationSequence(event) {
	return typeof event.sequence === "number" && Number.isFinite(event.sequence) ? Math.trunc(event.sequence) : void 0;
}
function compareNotifications(a, b) {
	if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
	const aSequence = notificationSequence(a);
	const bSequence = notificationSequence(b);
	if (aSequence !== void 0 && bSequence !== void 0) return aSequence - bSequence || a.id.localeCompare(b.id);
	if (aSequence !== void 0) return -1;
	if (bSequence !== void 0) return 1;
	return a.id.localeCompare(b.id);
}
//#endregion
//#region extensions/workboard/src/session-link.ts
function sanitizeSessionSegment(value, fallback) {
	return ((value ?? fallback).trim().replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || fallback).slice(0, 96);
}
function workboardSessionKeyForCard(card) {
	const suffix = `subagent:workboard-${sanitizeSessionSegment(cardBoardId(card), "default")}-${sanitizeSessionSegment(card.id, "card")}`;
	return card.agentId ? `agent:${sanitizeSessionSegment(card.agentId, "agent")}:${suffix}` : suffix;
}
function sessionKeyMatchesCard(candidate, cardKey) {
	return candidate === cardKey || cardKey.startsWith("subagent:workboard-") && candidate.endsWith(`:${cardKey}`);
}
function workboardCardMatchesLifecycleLink(card, source) {
	const linkedSessionKey = cardSessionKey(card);
	const sessionMatches = Boolean(source.sessionKey && (linkedSessionKey ? sessionKeyMatchesCard(source.sessionKey, linkedSessionKey) : sessionKeyMatchesCard(source.sessionKey, workboardSessionKeyForCard(card))));
	const linkedRunId = cardRunId(card);
	if (linkedRunId && source.runId) {
		if (source.runId !== linkedRunId && !linkedRunId.startsWith(`workboard:${card.id}:`)) return false;
		return linkedSessionKey && source.sessionKey ? sessionMatches : true;
	}
	return sessionMatches;
}
function workboardCardSessionLookupKey(card) {
	return cardSessionKey(card) ?? workboardSessionKeyForCard(card);
}
//#endregion
//#region extensions/workboard/src/sqlite-store.ts
function createWorkboardSqliteStores(options) {
	const databasePath = path.resolve(options.dbPath ?? path.join(resolveStateDir(), "plugins", "workboard", "workboard.sqlite"));
	const selectedDatabase = resolveDatabaseEngineInput(options.config ?? {});
	const worker = selectedDatabase.then((input) => openEngineWorkerStore({
		moduleUrl: options.workerModuleUrl,
		databasePath,
		input
	}, input));
	let sealed = false;
	let closing;
	const operations = /* @__PURE__ */ new Set();
	const writeAuthority = new AsyncLocalStorage();
	const ready = worker.then(() => void 0);
	ready.catch(() => {});
	async function execute(type, input, writes = false) {
		const authority = writes ? writeAuthority.getStore() : void 0;
		const store = await worker;
		const result = unwrapWorkboardSqliteResult(await runEngineStoreOperation(store, await selectedDatabase, writes, (scope) => scope.execute({
			type,
			input
		}), authority ? () => {
			if (!authority.active) throw new Error("Workboard mutation authority has settled.");
			authority.assertCurrent?.();
		} : void 0, databasePath));
		if (authority && result !== false && result !== "conflict" && result !== "owner_busy") authority.assertCurrent = void 0;
		return result;
	}
	async function run(operation) {
		if (sealed) throw new Error("Workboard SQLite connection is closed.");
		const pending = operation();
		operations.add(pending);
		try {
			return await pending;
		} finally {
			operations.delete(pending);
		}
	}
	function bindOperation(type, writes = false) {
		return (...args) => run(() => execute(type, { args }, writes));
	}
	return {
		async runWithWriteAuthority(assertCurrent, operation) {
			const authority = {
				active: true,
				assertCurrent
			};
			try {
				return await writeAuthority.run(authority, operation);
			} finally {
				authority.active = false;
			}
		},
		ready,
		readWriteToken: () => readSqliteDatabaseWriteTokenForPath(databasePath),
		cards: {
			register: bindOperation("cards.register", true),
			registerIfAbsent: bindOperation("cards.registerIfAbsent", true),
			registerIfUpdatedAt: bindOperation("cards.registerIfUpdatedAt", true),
			claimIfOwnerAvailable: bindOperation("cards.claimIfOwnerAvailable", true),
			deleteIfUpdatedAt: bindOperation("cards.deleteIfUpdatedAt", true),
			lookup: bindOperation("cards.lookup"),
			delete: bindOperation("cards.delete", true),
			entries: bindOperation("cards.entries"),
			listCardStatuses: bindOperation("cards.listCardStatuses"),
			listBoardAggregates: bindOperation("cards.listBoardAggregates"),
			listStatsAggregates: bindOperation("cards.listStatsAggregates"),
			hasCards: bindOperation("cards.hasCards")
		},
		boards: {
			register: bindOperation("boards.register", true),
			lookup: bindOperation("boards.lookup"),
			delete: bindOperation("boards.delete", true),
			entries: bindOperation("boards.entries")
		},
		sessionsBoard: {
			get: bindOperation("sessionsBoard.get"),
			update: bindOperation("sessionsBoard.update", true),
			listPlacements: bindOperation("sessionsBoard.listPlacements"),
			repairPlacements: bindOperation("sessionsBoard.repairPlacements", true),
			writePlacement: bindOperation("sessionsBoard.writePlacement", true)
		},
		subscriptions: {
			register: bindOperation("subscriptions.register", true),
			lookup: bindOperation("subscriptions.lookup"),
			delete: bindOperation("subscriptions.delete", true),
			entries: bindOperation("subscriptions.entries")
		},
		attachments: {
			register: bindOperation("attachments.register", true),
			lookup: bindOperation("attachments.lookup"),
			delete: bindOperation("attachments.delete", true),
			entries: bindOperation("attachments.entries")
		},
		close() {
			sealed = true;
			closing ??= Promise.resolve().then(async () => {
				while (operations.size) await Promise.allSettled(operations);
				await (await worker.catch(() => void 0))?.close();
			}).catch((error) => {
				closing = void 0;
				throw error;
			});
			return closing;
		}
	};
}
//#endregion
//#region extensions/workboard/src/store-automation.ts
function normalizeTrustedWorkspaceAccess(value, fallback) {
	if (value === void 0) return fallback;
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("workspace access must be an object.");
	const record = value;
	if (record.unrestricted === true) return { unrestricted: true };
	if (record.unrestricted !== false || !Array.isArray(record.roots)) throw new Error("restricted workspace access requires roots.");
	if (typeof record.writable !== "boolean") throw new Error("restricted workspace access requires a writable flag.");
	const roots = Array.from(new Set(record.roots.map((entry) => {
		const root = normalizeBoundedString(entry, void 0, 2e3, "workspace access root");
		if (!root || !isAbsoluteWorkspacePath(root)) throw new Error("workspace access roots must be absolute.");
		return root;
	})));
	if (roots.length === 0) throw new Error("restricted workspace access requires at least one root.");
	return {
		unrestricted: false,
		roots,
		writable: record.writable
	};
}
function normalizeCardAutomation(input) {
	const workspaceAccess = normalizeTrustedWorkspaceAccess(input.workspaceAccess);
	return normalizeAutomation({
		tenant: input.tenant,
		boardId: input.boardId,
		createdByCardId: input.createdByCardId,
		idempotencyKey: input.idempotencyKey,
		skills: input.skills,
		workspace: input.workspace,
		maxRuntimeSeconds: input.maxRuntimeSeconds,
		maxRetries: input.maxRetries,
		scheduledAt: input.scheduledAt
	}, workspaceAccess ? { workspaceAccess } : void 0);
}
function normalizeAutomationPatch(patch, current) {
	const workspaceAccess = Object.hasOwn(patch, "workspaceAccess") ? normalizeTrustedWorkspaceAccess(patch.workspaceAccess, current?.workspaceAccess) : current?.workspaceAccess;
	return normalizeAutomation(patch, {
		...current,
		...workspaceAccess ? { workspaceAccess } : {}
	});
}
//#endregion
//#region extensions/workboard/src/store-board-normalizers.ts
function normalizeBoardMetadata(input, fallback, now = Date.now()) {
	const id = normalizeBoardId(input.id, fallback?.id) ?? "default";
	if (input.kind !== void 0 && input.kind !== "cards" && input.kind !== "sessions") throw new Error("board kind must be cards or sessions.");
	if (fallback && input.kind !== void 0 && input.kind !== (fallback.kind ?? "cards")) throw new Error("board kind cannot be changed after creation.");
	const kind = input.kind === "sessions" ? "sessions" : fallback?.kind;
	if (kind === "sessions" && id === "default") throw new Error("board kind cannot be changed after creation: default is a cards board.");
	const name = normalizeBoundedString(input.name, fallback?.name, 120, "board name");
	const description = normalizeBoundedString(input.description, fallback?.description, 1e3, "board description");
	const clearAppearance = input.clearAppearance === void 0 ? [] : input.clearAppearance;
	if (!Array.isArray(clearAppearance) || clearAppearance.some((field) => field !== "icon" && field !== "color")) throw new Error("clearAppearance must be an array containing only icon or color.");
	const icon = clearAppearance.includes("icon") ? void 0 : normalizeBoundedString(input.icon, fallback?.icon, 40, "board icon");
	const color = clearAppearance.includes("color") ? void 0 : normalizeBoundedString(input.color, fallback?.color, 40, "board color");
	let automationJobId = fallback?.automationJobId;
	if (Object.hasOwn(input, "automationJobId")) {
		automationJobId = normalizeOptionalString(input.automationJobId);
		if (!automationJobId) throw new Error("automation job id must be a non-empty string.");
		if (automationJobId.length > 128) throw new Error("automation job id must be 128 characters or fewer.");
	}
	const defaultWorkspace = Object.hasOwn(input, "defaultWorkspace") ? normalizeWorkspace(input.defaultWorkspace, fallback?.defaultWorkspace) : fallback?.defaultWorkspace;
	const orchestration = Object.hasOwn(input, "orchestration") ? normalizeOrchestration(input.orchestration, fallback?.orchestration) : fallback?.orchestration;
	const archivedAt = Object.hasOwn(input, "archived") ? input.archived === false ? void 0 : now : fallback?.archivedAt;
	return {
		id,
		...kind ? { kind } : {},
		...kind === "sessions" ? { sessions: fallback?.sessions ?? createDefaultWorkboardSessionsBoardSpec() } : {},
		...name ? { name } : {},
		...description ? { description } : {},
		...icon ? { icon } : {},
		...color ? { color } : {},
		...automationJobId ? { automationJobId } : {},
		...defaultWorkspace ? { defaultWorkspace } : {},
		...orchestration ? { orchestration } : {},
		createdAt: fallback?.createdAt ?? now,
		updatedAt: now,
		...archivedAt ? { archivedAt } : {}
	};
}
function normalizeOrchestration(value, fallback) {
	if (!isRecord(value)) return fallback;
	const record = value;
	const autoDecompose = typeof record.autoDecompose === "boolean" ? record.autoDecompose : fallback?.autoDecompose;
	const autoDecomposePerDispatch = resolveOptionalIntegerOption(record.autoDecomposePerDispatch, {
		min: 1,
		max: 20
	}) ?? fallback?.autoDecomposePerDispatch;
	const defaultAssignee = normalizeBoundedString(record.defaultAssignee, fallback?.defaultAssignee, 120, "default assignee");
	const orchestratorProfile = normalizeBoundedString(record.orchestratorProfile, fallback?.orchestratorProfile, 120, "orchestrator profile");
	const next = {
		...autoDecompose !== void 0 ? { autoDecompose } : {},
		...autoDecomposePerDispatch ? { autoDecomposePerDispatch } : {},
		...defaultAssignee ? { defaultAssignee } : {},
		...orchestratorProfile ? { orchestratorProfile } : {}
	};
	return Object.keys(next).length ? next : void 0;
}
//#endregion
//#region extensions/workboard/src/store-read.ts
async function readCards(store, scope) {
	return (await store.entries(scope)).map(({ value }) => value.card).toSorted(compareCards);
}
//#endregion
//#region extensions/workboard/src/store-runtime.ts
var WorkboardStoreRuntime = class {
	constructor(closePersistence, ready, runWithWriteAuthority, readWriteToken) {
		this.closePersistence = closePersistence;
		this.runWithWriteAuthority = runWithWriteAuthority;
		this.readWriteToken = readWriteToken;
		this.cardLists = /* @__PURE__ */ new Map();
		this.operationScope = new AsyncLocalStorage();
		this.operations = /* @__PURE__ */ new Set();
		this.mutationQueue = Promise.resolve();
		this.sealed = false;
		this.cardsRevision = {
			epoch: randomUUID(),
			revision: 1
		};
		this.sessionBoardRevision = {
			epoch: this.cardsRevision.epoch,
			revision: 1
		};
		this.revision = 0;
		this.listeners = /* @__PURE__ */ new Set();
		this.initialization = ready ?? Promise.resolve();
		this.initialization.catch(() => {});
	}
	ready() {
		return this.runOperation(() => void 0);
	}
	get sessionsRevision() {
		this.refreshWriteReceipt();
		return this.sessionBoardRevision;
	}
	refreshWriteReceipt() {
		if (!this.readWriteToken) return "local";
		const current = this.readWriteToken();
		if (current === void 0 || current !== this.writeToken) {
			this.writeToken = current;
			this.invalidateCards();
			this.invalidateSessionBoards();
		}
		return current;
	}
	async runOperation(run) {
		if (this.sealed && !this.operationScope.getStore()?.active) throw new Error("workboard store is closed.");
		const context = { active: true };
		const operation = this.operationScope.run(context, async () => {
			await this.initialization;
			return await run();
		});
		this.operations.add(operation);
		try {
			return await operation;
		} finally {
			context.active = false;
			this.operations.delete(operation);
		}
	}
	close() {
		this.sealed = true;
		this.closePromise ??= Promise.resolve().then(async () => {
			while (this.operations.size > 0) await Promise.allSettled(this.operations);
			this.cardLists.clear();
			this.operationScope.disable();
			await this.closePersistence?.();
		}).catch((error) => {
			this.closePromise = void 0;
			throw error;
		});
		return this.closePromise;
	}
	track(store, { notifyChanges = true, sessions = false } = {}) {
		return {
			register: (key, value) => this.trackMutation(() => store.register(key, value), () => notifyChanges, sessions),
			lookup: (key) => this.runOperation(() => store.lookup(key)),
			delete: (key) => this.trackMutation(() => store.delete(key), (deleted) => deleted && notifyChanges, sessions),
			entries: () => this.runOperation(() => store.entries())
		};
	}
	trackCardStore(store) {
		return {
			...this.track(store),
			entries: (scope) => this.runOperation(() => store.entries(scope)),
			registerIfAbsent: (key, value) => this.trackMutation(() => store.registerIfAbsent(key, value)),
			registerIfUpdatedAt: (key, value, expectedUpdatedAt) => this.trackMutation(() => store.registerIfUpdatedAt(key, value, expectedUpdatedAt)),
			deleteIfUpdatedAt: (key, expectedUpdatedAt) => this.trackMutation(() => store.deleteIfUpdatedAt(key, expectedUpdatedAt)),
			claimIfOwnerAvailable: (key, value, expectedUpdatedAt, ownerId, now) => this.trackMutation(() => store.claimIfOwnerAvailable(key, value, expectedUpdatedAt, ownerId, now), (result) => result === "updated"),
			listCardStatuses: (ids) => this.runOperation(() => store.listCardStatuses(ids)),
			listBoardAggregates: () => this.runOperation(() => store.listBoardAggregates()),
			listStatsAggregates: (boardId) => this.runOperation(() => store.listStatsAggregates(boardId)),
			hasCards: (boardId) => this.runOperation(() => store.hasCards(boardId))
		};
	}
	trackMutation(run, changed = Boolean, sessions = false) {
		return this.runOperation(async () => {
			try {
				const result = await run();
				if (changed(result)) {
					this.invalidateCards();
					if (sessions) this.invalidateSessionBoards();
				}
				return result;
			} catch (error) {
				this.invalidateCards();
				if (sessions) this.invalidateSessionBoards();
				throw error;
			}
		});
	}
	subscribeChanges(listener) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}
	invalidateSessionBoards() {
		this.sessionBoardRevision = {
			...this.sessionBoardRevision,
			revision: this.sessionBoardRevision.revision + 1
		};
	}
	announceChangeEpoch() {
		this.emit();
	}
	async enqueueMutation(run, assertCurrent) {
		return await this.runOperation(async () => {
			const runAndNotify = () => this.withMutationAuthority(() => this.runMutation(run), assertCurrent);
			const result = this.mutationQueue.then(runAndNotify, runAndNotify);
			this.mutationQueue = result.then(() => void 0, () => void 0);
			return await result;
		});
	}
	async withMutationAuthority(run, assertCurrent) {
		if (!assertCurrent) return await run();
		if (!this.runWithWriteAuthority) throw new Error("Workboard persistence does not support current-owner admission.");
		return await this.runWithWriteAuthority(assertCurrent, run);
	}
	async runMutation(run) {
		const initialRevision = this.cardsRevision.revision;
		try {
			return await run();
		} finally {
			if (this.cardsRevision.revision !== initialRevision) this.emit();
		}
	}
	invalidateCards() {
		this.cardLists.clear();
		this.cardsRevision = {
			...this.cardsRevision,
			revision: this.cardsRevision.revision + 1
		};
	}
	emit() {
		this.refreshWriteReceipt();
		const change = {
			epoch: this.cardsRevision.epoch,
			revision: ++this.revision,
			cardsRevision: this.cardsRevision.revision,
			sessionsRevision: this.sessionBoardRevision.revision
		};
		for (const listener of this.listeners) try {
			listener(change);
		} catch {}
	}
};
//#endregion
//#region extensions/workboard/src/store-boards.ts
function emptyBoardSummary(id) {
	return {
		id,
		total: 0,
		active: 0,
		archived: 0,
		byStatus: {}
	};
}
var WorkboardBoardStore = class extends WorkboardStoreRuntime {
	constructor(store, stores) {
		super(stores.close, stores.ready, stores.runWithWriteAuthority, stores.readWriteToken);
		this.store = this.trackCardStore(store);
		this.boardStore = this.track(stores.boards, { sessions: true });
		this.sessionsBoardStore = stores.sessionsBoard;
		this.subscriptionStore = {
			...this.track(stores.subscriptions, { notifyChanges: false }),
			entries: (options) => this.runOperation(() => stores.subscriptions.entries(options))
		};
		this.attachmentStore = {
			...this.track(stores.attachments, { notifyChanges: false }),
			delete: (key) => this.trackMutation(() => stores.attachments.delete(key))
		};
	}
	async list(options = {}) {
		const boardId = normalizeBoardId(options.boardId);
		return readCards(this.store, boardId === void 0 ? void 0 : {
			kind: "board",
			boardId
		});
	}
	listCards(board, sessionKey) {
		return this.runOperation(() => {
			const boardId = normalizeBoardId(board);
			const writeToken = this.refreshWriteReceipt();
			const revision = this.cardsRevision;
			const cached = sessionKey === void 0 ? this.cardLists.get(boardId) : void 0;
			if (cached) return cached;
			const pending = Promise.all([sessionKey === void 0 ? this.list({ boardId }) : readCards(this.store, {
				kind: "session-links",
				sessionKey,
				boardId
			}), this.listBoards()]).then(([cards, { boards }]) => {
				return {
					cards: cards.map(redactClaimToken),
					boards,
					statuses: WORKBOARD_STATUSES,
					revision: {
						...revision,
						...boardId === void 0 ? {} : { boardId },
						...sessionKey === void 0 ? {} : { sessionKey }
					}
				};
			}).catch((error) => {
				if (sessionKey === void 0) this.cardLists.delete(boardId);
				throw error;
			});
			if (writeToken !== void 0 && sessionKey === void 0) this.cardLists.set(boardId, pending);
			return pending;
		});
	}
	async listBoards() {
		const boards = /* @__PURE__ */ new Map();
		for (const entry of await this.boardStore.entries()) {
			const { createdAt: _createdAt, archivedAt, ...board } = entry.value.board;
			boards.set(board.id, {
				...board,
				total: 0,
				active: 0,
				archived: 0,
				byStatus: {},
				...archivedAt ? { archivedAt } : {}
			});
		}
		if (!boards.has("default")) boards.set("default", emptyBoardSummary("default"));
		const cardAggregates = await this.store.listBoardAggregates();
		for (const aggregate of cardAggregates) {
			const boardId = aggregate.boardId;
			const summary = boards.get(boardId) ?? emptyBoardSummary(boardId);
			summary.total += aggregate.total;
			summary.archived += aggregate.archived;
			summary.active += aggregate.total - aggregate.archived;
			summary.byStatus[aggregate.status] = (summary.byStatus[aggregate.status] ?? 0) + aggregate.total;
			summary.updatedAt = Math.max(summary.updatedAt ?? 0, aggregate.updatedAt);
			boards.set(boardId, summary);
		}
		return { boards: [...boards.values()].toSorted((a, b) => a.id === "default" ? -1 : b.id === "default" ? 1 : a.id.localeCompare(b.id)) };
	}
	async upsertBoard(input) {
		return await this.enqueueMutation(async () => {
			const id = normalizeBoardIdRequired(input.id);
			const existing = await this.boardStore.lookup(id);
			const board = normalizeBoardMetadata({
				...input,
				id
			}, existing?.board);
			await this.boardStore.register(id, {
				version: 1,
				board
			});
			return board.kind === "sessions" ? await this.getSessionsBoard(id) : board;
		});
	}
	getSessionsBoard(boardId) {
		return this.runOperation(() => this.sessionsBoardStore.get(normalizeBoardIdRequired(boardId)));
	}
	updateSessionsBoard(boardId, patch, assertCurrent) {
		return this.enqueueMutation(() => this.trackMutation(() => this.sessionsBoardStore.update(normalizeBoardIdRequired(boardId), patch), () => true, true), assertCurrent);
	}
	listSessionPlacements(boardId) {
		return this.runOperation(() => this.sessionsBoardStore.listPlacements(normalizeBoardIdRequired(boardId)));
	}
	repairSessionPlacements() {
		return this.enqueueMutation(() => this.trackMutation(() => this.sessionsBoardStore.repairPlacements(), (result) => result.placements > 0 || result.boards > 0, true));
	}
	writeSessionPlacement(boardId, placement, options) {
		return this.enqueueMutation(() => this.trackMutation(() => this.sessionsBoardStore.writePlacement(normalizeBoardIdRequired(boardId), placement, options.expectedSpec), Boolean, true), options.assertCurrent);
	}
	async assertCardsBoard(boardId) {
		if ((await this.boardStore.lookup(normalizeBoardIdRequired(boardId)))?.board.kind === "sessions") throw new Error("Sessions boards do not hold cards");
	}
	async archiveBoard(id, archived = true) {
		return await this.upsertBoard({
			id,
			archived
		});
	}
	async deleteBoard(id) {
		return await this.enqueueMutation(async () => {
			const boardId = normalizeBoardIdRequired(id);
			if (boardId === "default") throw new Error("default board cannot be deleted.");
			if (await this.store.hasCards(boardId)) throw new Error("board still has cards; archive it or move/delete the cards first.");
			for (const entry of await this.subscriptionStore.entries({ boardId })) await this.subscriptionStore.delete(entry.key);
			return { deleted: await this.boardStore.delete(boardId) };
		});
	}
};
//#endregion
//#region extensions/workboard/src/store-status-write.ts
function finishRun(card, status, now, reason) {
	const execution = card.execution?.status === "running" ? {
		...card.execution,
		status,
		updatedAt: now
	} : card.execution;
	return {
		status,
		...execution ? { execution } : {},
		metadata: {
			...card.metadata,
			claim: void 0,
			attempts: closeRunningAttempts(card.metadata?.attempts, now, status === "done" ? "succeeded" : "blocked", reason),
			failureCount: status === "done" ? 0 : (card.metadata?.failureCount ?? 0) + 1
		}
	};
}
function appendCardNotification(metadata, now, sequence, notification) {
	return [...metadata?.notifications ?? [], {
		id: randomUUID(),
		createdAt: now,
		sequence,
		...notification
	}].slice(-20);
}
/** Returns the patch updateCard should apply, or undefined when a stale lifecycle write has nothing left. */
function resolveLifecycleStatusWrite(existing, patch) {
	const lifecycleStatusSourceUpdatedAt = lifecycleStatusSourceUpdatedAtFromPatch(patch.metadata);
	const existingLifecycleStatusSourceUpdatedAt = existing.metadata?.lifecycleStatusSourceUpdatedAt;
	const hasFreshLifecycleStatusSource = lifecycleStatusSourceUpdatedAt !== void 0 && lifecycleStatusSourceUpdatedAt !== existingLifecycleStatusSourceUpdatedAt;
	let effectivePatch = patch;
	if (patch.status !== void 0 && lifecycleStatusSourceUpdatedAt !== void 0 && shouldSkipPersistedLifecycleStatusUpdate(existing, lifecycleStatusSourceUpdatedAt)) {
		effectivePatch = {
			...patch,
			status: void 0
		};
		if (isRecord(patch.metadata)) {
			const { lifecycleStatusSourceUpdatedAt: _ignored, ...rest } = patch.metadata;
			effectivePatch.metadata = Object.keys(rest).length > 0 ? rest : void 0;
		}
		if (!Object.entries(effectivePatch).some(([key, value]) => key !== "status" && key !== "metadata" && value !== void 0) && effectivePatch.metadata === void 0) return;
	}
	return {
		effectivePatch,
		hasFreshLifecycleStatusSource
	};
}
function settleManualStatusTransition(params) {
	const { existing, status, execution, now } = params;
	const metadata = {
		...params.metadata,
		lifecycleStatusSourceUpdatedAt: void 0
	};
	if (status !== "done" && status !== "blocked") return {
		execution,
		metadata
	};
	if (!(execution?.status === "running" || metadata.attempts?.some((attempt) => attempt.status === "running"))) return {
		execution,
		metadata: metadata.claim ? {
			...metadata,
			claim: void 0
		} : metadata
	};
	const finished = finishRun({
		...existing,
		execution,
		metadata
	}, status, now);
	const notifications = appendCardNotification(finished.metadata, now, params.nextNotificationSequence(), {
		kind: status === "done" ? "completed" : "failed",
		message: `Workboard card moved to ${status}.`,
		...cardSessionKey(existing) ? { sessionKey: cardSessionKey(existing) } : {},
		...cardRunId(existing) ? { runId: cardRunId(existing) } : {}
	});
	return {
		execution: finished.execution,
		metadata: trimMetadataToBudget({
			...finished.metadata,
			notifications
		}, {
			preserveProofId: params.preserveProofId,
			preserveNotificationId: notifications.at(-1)?.id
		})
	};
}
//#endregion
//#region extensions/workboard/src/store-string-lists.ts
function normalizeCappedStringList(value, field) {
	if (value == null) return [];
	const entries = typeof value === "string" ? value.split(",") : Array.isArray(value) ? value : void 0;
	if (!entries) throw new Error(`${field} must be an array or comma-separated string.`);
	const maxLength = field === "labels" ? 40 : 120;
	const maxEntries = field === "labels" ? 12 : 20;
	const values = [];
	for (const entry of entries) {
		if (field === "parents" && typeof entry !== "string") throw new Error("parents must contain only strings.");
		const normalized = normalizeOptionalString(entry);
		if (!normalized || values.includes(normalized)) continue;
		if (normalized.length > maxLength) throw new Error(`${field} must be ${maxLength} characters or fewer.`);
		values.push(normalized);
		if (values.length >= maxEntries) break;
	}
	return values;
}
//#endregion
//#region extensions/workboard/src/store-core.ts
var WorkboardCoreStore = class extends WorkboardBoardStore {
	constructor(..._args) {
		super(..._args);
		this.lastNotificationSequence = 0;
	}
	async compensateWorkspaceMutation(before, after) {
		await this.enqueueMutation(async () => {
			const current = await this.get(after.id);
			const currentAutomation = current?.metadata?.automation;
			const afterAutomation = after.metadata?.automation;
			if (!current || !isDeepStrictEqual(currentAutomation?.workspace, afterAutomation?.workspace) || !isDeepStrictEqual(currentAutomation?.workspaceAccess, afterAutomation?.workspaceAccess)) return;
			const automation = { ...currentAutomation };
			const originalAutomation = before.metadata?.automation;
			for (const key of ["workspace", "workspaceAccess"]) if (originalAutomation?.[key] === void 0) delete automation[key];
			const metadata = {
				...current.metadata,
				automation: {
					...automation,
					...originalAutomation?.workspace ? { workspace: originalAutomation.workspace } : {},
					...originalAutomation?.workspaceAccess ? { workspaceAccess: originalAutomation.workspaceAccess } : {}
				}
			};
			const restored = {
				...current,
				metadata,
				updatedAt: Math.max(Date.now(), current.updatedAt + 1)
			};
			await this.store.registerIfUpdatedAt(restored.id, {
				version: 1,
				card: restored
			}, current.updatedAt);
		});
	}
	async updateLatestCard(id, buildPatch, options = {}) {
		const current = await this.requireCard(id);
		if (options.expectedUpdatedAt !== void 0 && current.updatedAt !== options.expectedUpdatedAt) throw new WorkboardCardConflictError(current);
		const ownedPatch = buildPatch(current);
		if (!ownedPatch) return {
			card: current,
			updated: false
		};
		const { ownedLaunch, ...patch } = ownedPatch;
		const card = await this.updateCard(current, patch, {
			...options,
			automationLaunch: ownedLaunch,
			expectedUpdatedAt: current.updatedAt
		});
		return {
			card,
			updated: card.updatedAt !== current.updatedAt
		};
	}
	async updateMetadata(id, mutate, options = {}) {
		return await this.enqueueMutation(async () => {
			return (await this.updateLatestCard(id, (current) => ({ metadata: mutate(current) }), options)).card;
		});
	}
	async deleteDetachedAttachments(existing, next) {
		const nextIds = new Set(next.metadata?.attachments?.map((attachment) => attachment.id) ?? []);
		for (const attachment of existing.metadata?.attachments ?? []) if (!nextIds.has(attachment.id)) await this.attachmentStore.delete(attachment.id);
	}
	nextNotificationSequence(now) {
		const base = Math.max(0, Math.trunc(now)) * 1e3;
		this.lastNotificationSequence = Math.max(this.lastNotificationSequence + 1, base);
		return this.lastNotificationSequence;
	}
	async stats(input = {}, now = Date.now()) {
		const boardId = normalizeBoardId(input.boardId);
		const aggregates = await this.store.listStatsAggregates(boardId);
		const byStatus = {};
		const byAgent = Object.create(null);
		let oldestReadyAt;
		let updatedAt;
		let archived = 0;
		let total = 0;
		for (const aggregate of aggregates) {
			byStatus[aggregate.status] = (byStatus[aggregate.status] ?? 0) + aggregate.total;
			const agentId = aggregate.agentId ?? "(default)";
			byAgent[agentId] = (byAgent[agentId] ?? 0) + aggregate.total;
			total += aggregate.total;
			archived += aggregate.archived;
			if (aggregate.oldestReadyAt !== void 0) oldestReadyAt = Math.min(oldestReadyAt ?? aggregate.oldestReadyAt, aggregate.oldestReadyAt);
			updatedAt = Math.max(updatedAt ?? 0, aggregate.updatedAt);
		}
		return {
			id: boardId ?? "all",
			total,
			active: total - archived,
			archived,
			byStatus,
			byAgent,
			...oldestReadyAt ? { oldestReadyAgeMs: Math.max(0, now - oldestReadyAt) } : {},
			...updatedAt ? { updatedAt } : {}
		};
	}
	async get(id) {
		return (await this.store.lookup(id.trim()))?.card;
	}
	async requireCard(id) {
		const card = await this.get(id);
		if (!card) throw new Error(`card not found: ${id}`);
		return card;
	}
	async removeReferencesToCard(cardId) {
		const referenceUpdates = [];
		for (const card of await this.list()) {
			if (!card.metadata?.links?.some((link) => link.targetCardId === cardId)) continue;
			let previousUpdatedAt = card.updatedAt;
			const result = await this.updateLatestCard(card.id, (current) => {
				const links = current.metadata?.links;
				if (!links?.some((link) => link.targetCardId === cardId)) return;
				previousUpdatedAt = current.updatedAt;
				return { metadata: {
					...current.metadata,
					links: links.filter((link) => link.targetCardId !== cardId)
				} };
			});
			if (result.updated) referenceUpdates.push({
				id: card.id,
				previousUpdatedAt,
				updatedAt: result.card.updatedAt
			});
		}
		return referenceUpdates;
	}
	async create(input, scope, assertOwnerCurrent) {
		return await this.enqueueMutation(() => this.createDirect(input, scope), assertOwnerCurrent);
	}
	async createDirect(input, scope, options = {}) {
		const now = Date.now();
		const requestedStatus = normalizeStatus(input.status, "todo");
		const cards = await this.list();
		const parents = normalizeStringList(input.parents, "parents", 120);
		const automation = normalizeCardAutomation(input);
		const heldBySchedule = Boolean(automation?.scheduledAt && automation.scheduledAt > now) && requestedStatus !== "blocked";
		let status = heldBySchedule ? "scheduled" : requestedStatus;
		let heldByDependencies = false;
		if (parents.length > 0 && (status === "running" || status === "review")) {
			status = "todo";
			heldByDependencies = true;
		}
		if (automation?.idempotencyKey) {
			const existing = cards.find((card) => card.metadata?.automation?.idempotencyKey === automation.idempotencyKey && card.metadata?.automation?.tenant === automation.tenant && cardBoardId(card) === (automation.boardId ?? "default"));
			if (existing) return existing;
		}
		const cardsById = new Map(cards.map((card) => [card.id, card]));
		const parentCards = parents.map((parentId) => {
			const parent = cardsById.get(parentId);
			if (!parent) throw new Error(`card not found: ${parentId}`);
			assertCanMutateClaimedCard(parent, scope);
			return parent;
		});
		const childAutomation = parents.length === 1 ? {
			...automation,
			createdByCardId: automation?.createdByCardId ?? parents[0]
		} : automation;
		const normalizedPosition = resolveNonNegativeIntegerOption(input.position, NaN);
		const notes = normalizeNotes(input.notes);
		const agentId = normalizeOptionalString(input.agentId);
		const sessionKey = normalizeOptionalString(input.sessionKey);
		const runId = normalizeRunId(input.runId);
		const sourceUrl = normalizeOptionalString(input.sourceUrl);
		const normalizedExecution = normalizeExecution(input.execution);
		const execution = normalizedExecution?.status === "running" && (heldBySchedule || heldByDependencies) ? void 0 : normalizedExecution;
		const startedAt = input.startedAt === void 0 ? status === "running" ? now : void 0 : normalizeTimestamp(input.startedAt, 0) || void 0;
		const completedAt = input.completedAt === void 0 ? status === "done" ? now : void 0 : normalizeTimestamp(input.completedAt, 0) || void 0;
		const metadata = normalizeMetadata(input.metadata, {
			templateId: normalizeTemplateId(input.templateId),
			...childAutomation ? { automation: childAutomation } : {}
		}, {
			allowDependencyLinks: false,
			allowArchivedAt: false
		});
		const syncedMetadata = trimMetadataToBudget(syncExecutionAttemptMetadata(metadata, execution, now));
		const boardId = syncedMetadata.automation?.boardId ?? "default";
		const position = Number.isFinite(normalizedPosition) ? normalizedPosition : Math.max(0, ...cards.filter((card) => card.status === status && cardBoardId(card) === boardId).map((card) => card.position)) + POSITION_STEP;
		let card = {
			id: options.cardId ?? randomUUID(),
			title: normalizeTitle(input.title),
			status,
			priority: normalizePriority(input.priority, "normal"),
			labels: normalizeCappedStringList(input.labels, "labels"),
			position,
			createdAt: now,
			updatedAt: now,
			events: [{
				id: randomUUID(),
				kind: "created",
				at: now,
				toStatus: status,
				...sessionKey ? { sessionKey } : {},
				...runId ? { runId } : {}
			}],
			...notes ? { notes } : {},
			...agentId ? { agentId } : {},
			...sessionKey ? { sessionKey } : {},
			...runId ? { runId } : {},
			...sourceUrl ? { sourceUrl } : {},
			...execution ? { execution } : {},
			...startedAt ? { startedAt } : {},
			...completedAt ? { completedAt } : {},
			...!metadataIsEmpty(syncedMetadata) ? { metadata: syncedMetadata } : {}
		};
		if (options.insertIfAbsent) {
			if (!await this.store.registerIfAbsent(card.id, {
				version: 1,
				card
			})) {
				const winner = await this.get(card.id);
				if (!winner) throw new Error("captured session card disappeared during creation.");
				return winner;
			}
		} else await this.store.register(card.id, {
			version: 1,
			card
		});
		for (const parent of parentCards) card = await this.linkCardsDirect(parent.id, card.id, now, {
			allowStatusOnlyActiveChild: true,
			scope
		});
		return card;
	}
	async captureSession(input) {
		return await this.enqueueMutation(async () => {
			const sessionKey = normalizeOptionalString(input.sessionKey);
			if (!sessionKey) throw new Error("sessionKey is required.");
			const boardId = normalizeBoardId(input.boardId) ?? "default";
			await this.assertCardsBoard(boardId);
			const matches = (await readCards(this.store, {
				kind: "session",
				sessionKey
			})).filter((card) => cardSessionKey(card) === sessionKey).toSorted((left, right) => right.updatedAt - left.updatedAt);
			const existing = matches.find((card) => !card.metadata?.archivedAt) ?? matches[0];
			if (existing) {
				if (!existing.metadata?.archivedAt) return existing;
				return (await this.updateLatestCard(existing.id, (current) => {
					if (cardSessionKey(current) !== sessionKey) throw new Error("captured session identity collision.");
					return current.metadata?.archivedAt ? { metadata: {
						...current.metadata,
						archivedAt: 0
					} } : void 0;
				})).card;
			}
			const digest = createHash("sha256").update("openclaw.workboard.session-capture.v1\0").update(sessionKey).digest();
			digest.writeUInt8(digest.readUInt8(6) & 15 | 128, 6);
			digest.writeUInt8(digest.readUInt8(8) & 63 | 128, 8);
			const hex = digest.toString("hex", 0, 16);
			const cardId = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
			const winner = await this.createDirect({
				...input,
				boardId,
				parents: void 0
			}, void 0, {
				cardId,
				insertIfAbsent: true
			});
			if (cardSessionKey(winner) !== sessionKey) throw new Error("captured session identity collision.");
			return winner;
		});
	}
	async update(id, patch, options = {}) {
		return await this.enqueueMutation(async () => await this.updateCard(await this.requireCard(id), patch, {
			allowMetadataDependencyLinks: false,
			enforceStatusHolds: true,
			expectedUpdatedAt: options.expectedUpdatedAt
		}));
	}
	async updateCard(existing, patch, options = {}) {
		if (options.expectedUpdatedAt !== void 0 && existing.updatedAt !== options.expectedUpdatedAt) throw new WorkboardCardConflictError(existing);
		const statusWrite = resolveLifecycleStatusWrite(existing, patch);
		if (!statusWrite) return existing;
		const { effectivePatch, hasFreshLifecycleStatusSource } = statusWrite;
		const status = normalizeStatus(effectivePatch.status, existing.status);
		const now = Math.max(Date.now(), existing.updatedAt + 1);
		const startedAt = effectivePatch.startedAt === void 0 ? status === "running" ? existing.startedAt ?? now : existing.startedAt : normalizeTimestamp(effectivePatch.startedAt, 0) || void 0;
		const completedAt = effectivePatch.completedAt === void 0 ? status === "done" ? existing.completedAt ?? now : void 0 : normalizeTimestamp(effectivePatch.completedAt, 0) || void 0;
		const sessionKey = effectivePatch.sessionKey === void 0 ? existing.sessionKey : normalizeOptionalString(effectivePatch.sessionKey);
		let execution = effectivePatch.execution === void 0 ? effectivePatch.sessionKey === void 0 ? existing.execution : syncExecutionSessionKey(existing.execution, sessionKey) : normalizeExecution(effectivePatch.execution);
		let metadata = normalizeMetadata(effectivePatch.metadata, existing.metadata, {
			automationLaunch: options.automationLaunch,
			allowDependencyLinks: options.allowMetadataDependencyLinks !== false,
			preserveProofId: options.preserveProofId,
			preserveNotificationId: options.preserveNotificationId
		});
		if (status !== existing.status && !hasFreshLifecycleStatusSource) ({execution, metadata} = settleManualStatusTransition({
			existing,
			status,
			execution,
			metadata,
			now,
			nextNotificationSequence: () => this.nextNotificationSequence(now),
			preserveProofId: options.preserveProofId
		}));
		const automationPatch = {};
		for (const key of [
			"tenant",
			"boardId",
			"createdByCardId",
			"idempotencyKey",
			"skills",
			"workspace",
			"workspaceAccess",
			"maxRuntimeSeconds",
			"maxRetries",
			"scheduledAt"
		]) if (Object.hasOwn(effectivePatch, key) && effectivePatch[key] !== void 0) automationPatch[key] = effectivePatch[key];
		if (Object.keys(automationPatch).length > 0) metadata = trimMetadataToBudget({
			...metadata,
			automation: normalizeAutomationPatch(automationPatch, metadata.automation)
		}, options);
		const next = definedFields({
			...existing,
			title: effectivePatch.title === void 0 ? existing.title : normalizeTitle(effectivePatch.title),
			notes: effectivePatch.notes === void 0 ? existing.notes : normalizeNotes(effectivePatch.notes),
			status,
			priority: normalizePriority(effectivePatch.priority, existing.priority),
			labels: effectivePatch.labels === void 0 ? existing.labels : normalizeCappedStringList(effectivePatch.labels, "labels"),
			agentId: effectivePatch.agentId === void 0 ? existing.agentId : normalizeOptionalString(effectivePatch.agentId),
			sessionKey,
			runId: effectivePatch.runId === void 0 ? existing.runId : normalizeRunId(effectivePatch.runId),
			sourceUrl: effectivePatch.sourceUrl === void 0 ? existing.sourceUrl : normalizeOptionalString(effectivePatch.sourceUrl),
			execution,
			metadata: effectivePatch.templateId === void 0 ? metadata : {
				...metadata,
				templateId: normalizeTemplateId(effectivePatch.templateId)
			},
			position: effectivePatch.position === void 0 ? existing.position : resolveNonNegativeIntegerOption(effectivePatch.position, existing.position),
			updatedAt: now,
			...startedAt ? { startedAt } : {},
			...completedAt ? { completedAt } : {}
		});
		next.metadata = trimMetadataToBudget(syncExecutionAttemptMetadata(next.metadata ?? {}, execution, now), options);
		next.events = appendEvent(next, options.event ?? updateEvent(existing, next), options.eventAt ?? now);
		if (options.enforceStatusHolds && effectivePatch.status !== void 0) await this.assertActiveStatusAllowed(existing, next, now);
		if (status !== "done") delete next.completedAt;
		if (effectivePatch.startedAt !== void 0 && !startedAt) delete next.startedAt;
		if (effectivePatch.completedAt !== void 0 && !completedAt) delete next.completedAt;
		if (metadataIsEmpty(next.metadata)) delete next.metadata;
		const expectedUpdatedAt = options.expectedUpdatedAt ?? existing.updatedAt;
		const nextEntry = {
			version: 1,
			card: next
		};
		let updated;
		if (options.ownerSlot) {
			const result = await this.store.claimIfOwnerAvailable(next.id, nextEntry, expectedUpdatedAt, options.ownerSlot.ownerId, options.ownerSlot.now);
			if (result === "owner_busy") throw new Error(`Owner ${options.ownerSlot.ownerId} already has active Workboard work.`);
			updated = result === "updated";
		} else updated = await this.store.registerIfUpdatedAt(next.id, nextEntry, expectedUpdatedAt);
		if (updated) {
			await this.deleteDetachedAttachments(existing, next);
			return next;
		}
		const current = await this.get(next.id);
		if (!current) throw new Error(`card not found: ${existing.id}`);
		throw new WorkboardCardConflictError(current);
	}
	async assertActiveStatusAllowed(existing, next, now) {
		if (next.status !== "ready" && next.status !== "running" && next.status !== "review" && next.status !== "done") return;
		const parents = cardParentIds(next);
		if (parents.length > 0 && !await this.parentsDone(parents)) throw new Error("card dependencies are not done.");
		if (next.status === "done") return;
		const scheduledAt = next.metadata?.automation?.scheduledAt;
		if (scheduledAt && scheduledAt > now || existing.status === "scheduled" && !scheduledAt) throw new Error("card is scheduled for later.");
	}
	async delete(id, options = {}) {
		return await this.enqueueMutation(async () => {
			const cardId = id.trim();
			if (!(options.expectedUpdatedAt === void 0 ? await this.store.delete(cardId) : await this.store.deleteIfUpdatedAt(cardId, options.expectedUpdatedAt))) {
				if (options.expectedUpdatedAt !== void 0) {
					const current = await this.get(cardId);
					if (current) throw new WorkboardCardConflictError(current);
				}
				return { deleted: false };
			}
			for (const entry of await this.subscriptionStore.entries()) if (entry.value.subscription.cardId === cardId) await this.subscriptionStore.delete(entry.key);
			const referenceUpdates = await this.removeReferencesToCard(cardId);
			return {
				deleted: true,
				...referenceUpdates.length > 0 ? { referenceUpdates } : {}
			};
		});
	}
	async addComment(id, input, scope) {
		const now = Date.now();
		const body = normalizeBoundedString(input.body, void 0, 2e3, "comment body");
		if (!body) throw new Error("comment body is required.");
		const comment = {
			id: randomUUID(),
			body,
			createdAt: now
		};
		return await this.updateMetadata(id, (existing) => {
			assertCanMutateClaimedCard(existing, scope);
			return {
				...existing.metadata,
				comments: [...existing.metadata?.comments ?? [], comment].slice(-50)
			};
		});
	}
	async addLink(id, input) {
		const now = Date.now();
		const targetCardId = normalizeBoundedString(input.targetCardId, void 0, 120, "link target");
		const url = normalizeBoundedString(input.url, void 0, 2e3, "link URL");
		const title = normalizeBoundedString(input.title, void 0, 180, "link title");
		if (!targetCardId && !url) throw new Error("link targetCardId or url is required.");
		const type = normalizeLinkType(input.type, "relates_to");
		if (type === "parent" || type === "child") throw new Error("parent and child dependency links must use linkDependency.");
		const link = {
			id: randomUUID(),
			type,
			createdAt: now,
			...targetCardId ? { targetCardId } : {},
			...title ? { title } : {},
			...url ? { url } : {}
		};
		return await this.updateMetadata(id, (existing) => ({
			...existing.metadata,
			links: appendLinkPreservingDependencies(existing.metadata?.links ?? [], link)
		}));
	}
	async linkCards(parentId, childId, scope) {
		return await this.enqueueMutation(() => this.linkCardsDirect(parentId, childId, Date.now(), { scope }));
	}
	async linkCardsDirect(parentId, childId, now = Date.now(), options = {}) {
		if (parentId.trim() === childId.trim()) throw new Error("parent and child cards must differ.");
		const parent = await this.get(parentId);
		const child = await this.get(childId);
		if (!parent) throw new Error(`card not found: ${parentId}`);
		if (!child) throw new Error(`card not found: ${childId}`);
		assertCanMutateClaimedCard(parent, options.scope);
		assertCanMutateClaimedCard(child, options.scope);
		if (child.status === "done" || child.status === "blocked") {
			const parentIds = [...cardParentIds(child), parent.id].filter((id, index, ids) => ids.indexOf(id) === index);
			if (!await this.parentsDone(parentIds)) throw new Error("terminal child cards cannot gain incomplete parent dependencies.");
		}
		if (isActiveDependencyTarget(child, { allowStatusOnly: options.allowStatusOnlyActiveChild })) throw new Error("active child cards cannot gain parent dependencies.");
		if (await this.dependsOn(parent.id, child.id)) throw new Error("dependency link would create a cycle.");
		const linkTo = (card, targetCardId, type) => {
			const links = card.metadata?.links ?? [];
			return links.some((link) => link.type === type && link.targetCardId === targetCardId) ? links : appendLinkPreservingDependencies(links, {
				id: randomUUID(),
				type,
				targetCardId,
				createdAt: now
			});
		};
		const nextParentLinks = linkTo(parent, child.id, "child");
		const nextChildLinks = linkTo(child, parent.id, "parent");
		await this.updateCard(parent, { metadata: {
			...parent.metadata,
			links: nextParentLinks
		} });
		const nextChild = await this.updateCard(child, { metadata: {
			...child.metadata,
			links: nextChildLinks
		} });
		return await this.promoteDependencyReady(nextChild.id);
	}
	async parentsDone(parentIds) {
		const statusById = new Map((await this.store.listCardStatuses(parentIds)).map((card) => [card.id, card.status]));
		return parentIds.every((id) => statusById.get(id) === "done");
	}
	async dependencyTargetStatus(card, now) {
		const scheduledAt = card.metadata?.automation?.scheduledAt;
		const parents = cardParentIds(card);
		if (card.status === "scheduled" && !scheduledAt) return "scheduled";
		if (parents.length === 0) {
			if (scheduledAt && scheduledAt > now && isDependencyPromotableStatus(card.status)) return "scheduled";
			return card.status === "scheduled" ? "ready" : card.status;
		}
		const parentsDone = await this.parentsDone(parents.map((parentId) => parentId.trim()));
		if (!isDependencyPromotableStatus(card.status)) return card.status;
		if (scheduledAt && scheduledAt > now) return "scheduled";
		return parentsDone ? "ready" : "todo";
	}
	async dependsOn(cardId, targetParentId) {
		const cards = new Map((await this.list()).map((entry) => [entry.id, entry]));
		const seen = /* @__PURE__ */ new Set();
		const visit = (id) => {
			if (id === targetParentId) return true;
			if (seen.has(id)) return false;
			seen.add(id);
			const card = cards.get(id);
			return Boolean(card && cardParentIds(card).some(visit));
		};
		return visit(cardId);
	}
	async recordOrchestrationCandidate(card, now) {
		return (await this.updateLatestCard(card.id, (current) => ({ metadata: {
			...current.metadata,
			workerLogs: [...current.metadata?.workerLogs ?? [], {
				id: randomUUID(),
				level: "info",
				message: "Auto orchestration marked this triage card for specification or decomposition.",
				createdAt: now
			}].slice(-40),
			workerProtocol: {
				state: "idle",
				updatedAt: now,
				detail: "Awaiting workboard_specify or workboard_decompose."
			}
		} }))).card;
	}
	async promoteDependencyReady(id, now = Date.now()) {
		const card = await this.requireCard(id);
		if (card.metadata?.archivedAt) return card;
		const target = await this.dependencyTargetStatus(card, now);
		if (target === card.status) return card;
		return await this.updateCard(card, { status: target });
	}
};
var WorkboardCardConflictError = class extends Error {
	constructor(current) {
		super("Card changed while you were editing. Review the latest values and retry.");
		this.current = current;
		this.name = "WorkboardCardConflictError";
	}
};
//#endregion
//#region extensions/workboard/src/store-enrichment.ts
var WorkboardEnrichmentStore = class extends WorkboardCoreStore {
	appendNotification(metadata, now, notification) {
		return appendCardNotification(metadata, now, this.nextNotificationSequence(now), notification);
	}
	async addProof(id, input, scope) {
		return await this.addEvidence(id, scope, normalizeProofInput(input, Date.now()));
	}
	async addProofWithArtifact(id, proofInput, artifactInput, scope) {
		const now = Date.now();
		const proof = normalizeProofInput(proofInput, now);
		const artifact = normalizeArtifact({
			...artifactInput,
			createdAt: now
		});
		if (!artifact) throw new Error("artifact url or path is required.");
		return await this.addEvidence(id, scope, proof, artifact);
	}
	async addArtifact(id, input, scope) {
		const artifact = normalizeArtifact({
			...input,
			createdAt: Date.now()
		});
		if (!artifact) throw new Error("artifact url or path is required.");
		return await this.addEvidence(id, scope, void 0, artifact);
	}
	addEvidence(id, scope, proof, artifact) {
		return this.updateMetadata(id, (existing) => {
			assertCanMutateClaimedCard(existing, scope);
			const metadata = { ...clearDiagnostics(existing.metadata, ["missing_proof"]) };
			if (proof) metadata.proof = [...metadata.proof ?? [], proof].slice(-40);
			if (artifact) metadata.artifacts = [...metadata.artifacts ?? [], artifact].slice(-40);
			return metadata;
		}, { preserveProofId: proof?.id });
	}
	async addAttachment(id, input, scope, assertCurrent) {
		return await this.enqueueMutation(async () => {
			const existing = await this.requireCard(id);
			assertCanMutateClaimedCard(existing, scope);
			const { attachment, contentBase64 } = normalizeAttachmentInput(id, input, Date.now());
			await this.withMutationAuthority(() => this.attachmentStore.register(attachment.id, {
				version: 1,
				attachment,
				contentBase64
			}), assertCurrent);
			try {
				const updated = await this.withMutationAuthority(async () => this.updateCard(existing, { metadata: {
					...clearDiagnostics(existing.metadata, ["missing_proof"]),
					attachments: [...existing.metadata?.attachments ?? [], attachment].slice(-20)
				} }), assertCurrent);
				if (!updated.metadata?.attachments?.some((entry) => entry.id === attachment.id)) throw new Error("attachment metadata was trimmed before it could be indexed.");
				return updated;
			} catch (error) {
				await this.attachmentStore.delete(attachment.id);
				throw error;
			}
		});
	}
	async listAttachments(id) {
		const card = await this.requireCard(id);
		return {
			card,
			attachments: card.metadata?.attachments ?? []
		};
	}
	async getAttachment(id) {
		const attachmentId = id.trim();
		return await this.attachmentStore.lookup(attachmentId);
	}
	async deleteAttachment(cardId, attachmentId, scope) {
		return await this.enqueueMutation(async () => {
			const existing = await this.requireCard(cardId);
			assertCanMutateClaimedCard(existing, scope);
			const attachments = existing.metadata?.attachments ?? [];
			if (!attachments.some((attachment) => attachment.id === attachmentId)) throw new Error(`attachment not found: ${attachmentId}`);
			await this.attachmentStore.delete(attachmentId);
			return await this.updateCard(existing, { metadata: {
				...existing.metadata,
				attachments: attachments.filter((attachment) => attachment.id !== attachmentId)
			} });
		});
	}
	async addWorkerLog(id, input, scope) {
		const now = Date.now();
		const message = normalizeBoundedString(input.message, void 0, 800, "worker log message");
		if (!message) throw new Error("worker log message is required.");
		const log = workerLogEntry(input, message, now);
		return await this.updateMetadata(id, (existing) => {
			assertCanMutateClaimedCard(existing, scope);
			return {
				...existing.metadata,
				workerLogs: [...existing.metadata?.workerLogs ?? [], log].slice(-40)
			};
		});
	}
	async recordProtocolViolation(id, input = {}, scope) {
		return await this.enqueueMutation(async () => {
			const card = await this.requireCard(id);
			assertCanMutateClaimedCard(card, scope);
			const now = Date.now();
			const detail = normalizeBoundedString(input.detail, void 0, 800, "protocol violation detail") ?? "Worker stopped without completing or blocking the card.";
			const log = workerLogEntry({
				...input,
				level: "error"
			}, detail, now);
			const { sessionKey, runId } = log;
			const finished = finishRun(card, "blocked", now, detail);
			const notifications = this.appendNotification(card.metadata, now, {
				kind: "failed",
				message: capText(detail, 240) ?? "Worker protocol violation.",
				...sessionKey || cardSessionKey(card) ? { sessionKey: sessionKey ?? cardSessionKey(card) } : {},
				...runId || cardRunId(card) ? { runId: runId ?? cardRunId(card) } : {}
			});
			return await this.updateCard(card, {
				...finished,
				status: card.status === "done" ? card.status : "blocked",
				metadata: {
					...finished.metadata,
					workerLogs: [...card.metadata?.workerLogs ?? [], log].slice(-40),
					workerProtocol: {
						state: "violated",
						updatedAt: now,
						detail
					},
					notifications
				}
			});
		});
	}
};
//#endregion
//#region extensions/workboard/src/store-promote.ts
var WorkboardPromoteStore = class extends WorkboardEnrichmentStore {
	async move(id, status, position, scope, options = {}) {
		return await this.enqueueMutation(async () => {
			return (await this.updateLatestCard(id, (current) => {
				assertCanMutateClaimedCard(current, scope);
				return {
					status,
					position
				};
			}, {
				allowMetadataDependencyLinks: false,
				enforceStatusHolds: true,
				expectedUpdatedAt: options.expectedUpdatedAt
			})).card;
		}, options.assertOwnerCurrent);
	}
	async promote(id, input = {}, scope) {
		return await this.enqueueMutation(async () => {
			const reason = normalizeBoundedString(input.reason, void 0, 1e3, "promote reason");
			return (await this.updateLatestCard(id, (current) => {
				if (current.status !== "todo") throw new Error(`Cannot promote Workboard card in ${current.status}; expected todo.`);
				assertCanMutateClaimedCard(current, scope === null ? void 0 : scope);
				return {
					status: "ready",
					metadata: {
						...clearDiagnostics(current.metadata, ["stranded_ready", "blocked_too_long"]),
						comments: appendComment(current.metadata?.comments, reason),
						stale: null
					}
				};
			}, { enforceStatusHolds: input.force !== true })).card;
		});
	}
};
//#endregion
//#region extensions/workboard/src/store-workflow.ts
var WorkboardClaimRefusedError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ToolInputError";
	}
};
function assertClaimIdentity(claim, input) {
	const token = normalizeOptionalString(input.token);
	const ownerId = normalizeOptionalString(input.ownerId);
	if (token && !safeEqualSecret(token, claim.token)) throw new Error("claim token does not match.");
	if (!token && ownerId && ownerId !== claim.ownerId) throw new Error("claim owner does not match.");
}
var WorkboardWorkflowStore = class extends WorkboardPromoteStore {
	async claim(id, input, options = {}) {
		const ownerId = normalizeBoundedString(input.ownerId, void 0, 120, "claim owner");
		if (!ownerId) throw new Error("claim ownerId is required.");
		const ttlSeconds = resolveOptionalIntegerOption(input.ttlSeconds, { min: 1 });
		const token = normalizeBoundedString(input.token, void 0, 160, "claim token") ?? randomUUID();
		return await this.enqueueMutation(async () => {
			const now = Date.now();
			const expiresAt = addWorkboardDurationMs(now, ttlSeconds ? secondsToDurationMs(ttlSeconds) : DEFAULT_CLAIM_TTL_MS);
			const guarded = await this.promoteDependencyReady(id, now);
			if (guarded.metadata?.archivedAt) throw new Error("card is archived.");
			const expectedAuthority = options.expectedAuthority;
			if (expectedAuthority && (guarded.status !== expectedAuthority.status || cardBoardId(guarded) !== expectedAuthority.boardId || guarded.agentId !== expectedAuthority.agentId || !isDeepStrictEqual(guarded.metadata?.automation?.workspace, expectedAuthority.workspace) || !isDeepStrictEqual(guarded.metadata?.automation?.workspaceAccess, expectedAuthority.workspaceAccess))) throw new Error("card workspace authority changed before claim.");
			const existingClaim = guarded.metadata?.claim;
			const activeClaim = existingClaim && (isFutureDateTimestampMs(existingClaim.expiresAt, { nowMs: now }) || guarded.status === "running" && !isWorkboardClaimReclaimable(existingClaim, now)) ? existingClaim : void 0;
			const parentIds = cardParentIds(guarded);
			if (parentIds.length > 0 && guarded.status !== "ready" && !activeClaim) {
				if (guarded.status === "blocked") throw new WorkboardClaimRefusedError("card is blocked; use workboard_unblock before claiming.");
				if (!await this.parentsDone(parentIds)) throw new WorkboardClaimRefusedError("card dependencies are not done.");
			}
			if (guarded.status === "scheduled") throw new WorkboardClaimRefusedError("card is scheduled for later.");
			if (retryBudgetExhausted(guarded)) throw new WorkboardClaimRefusedError("card exhausted its retry budget.");
			if (activeClaim) throw new WorkboardClaimRefusedError(`card already claimed by ${activeClaim.ownerId}.`);
			const metadata = clearDiagnostics(guarded.metadata, ["stranded_ready"]);
			return {
				card: await this.updateCard(guarded, {
					status: guarded.status === "backlog" || guarded.status === "todo" || guarded.status === "ready" ? "running" : guarded.status,
					...options.adoptWorkspaceAccess && !guarded.metadata?.automation?.workspaceAccess ? { workspaceAccess: options.adoptWorkspaceAccess } : {},
					metadata: {
						...metadata,
						claim: {
							ownerId,
							token,
							claimedAt: now,
							lastHeartbeatAt: now,
							expiresAt
						}
					}
				}, {
					expectedUpdatedAt: guarded.updatedAt,
					ownerSlot: {
						ownerId,
						now
					}
				}),
				token
			};
		}, options.assertOwnerCurrent);
	}
	async heartbeat(id, input) {
		const note = normalizeBoundedString(input.note, void 0, 400, "heartbeat note");
		return await this.updateMetadata(id, (existing) => {
			const claim = existing.metadata?.claim;
			if (!claim) throw new Error("card is not claimed.");
			const now = Math.max(Date.now(), claim.lastHeartbeatAt + 1);
			assertClaimIdentity(claim, input);
			const nextClaim = {
				...claim,
				lastHeartbeatAt: now,
				expiresAt: claim.expiresAt ? addWorkboardDurationMs(now, Math.max(1, claim.expiresAt > claim.claimedAt ? claim.expiresAt - claim.lastHeartbeatAt : DEFAULT_CLAIM_TTL_MS)) : void 0
			};
			const metadata = clearDiagnostics(existing.metadata, ["running_without_heartbeat"]);
			return {
				...metadata,
				claim: nextClaim,
				comments: appendComment(metadata.comments, note, now)
			};
		});
	}
	async releaseClaim(id, input = {}) {
		return await this.enqueueMutation(async () => {
			const existing = await this.requireCard(id);
			const status = normalizeStatus(input.status, existing.status);
			const claim = existing.metadata?.claim;
			if (claim) assertClaimIdentity(claim, input);
			return await this.updateCard(existing, {
				status,
				metadata: {
					...existing.metadata,
					claim: void 0
				}
			}, { enforceStatusHolds: input.status !== void 0 });
		});
	}
	async complete(id, input = {}, scope = input) {
		return await this.enqueueMutation(() => this.completeDirect(id, input, scope));
	}
	async completeDirect(id, input = {}, scope = input) {
		const existing = await this.requireCard(id);
		assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
		const now = Date.now();
		const createdCardIds = normalizeStringList(input.createdCardIds, "created card ids", 120);
		const childIds = cardChildIds(existing);
		for (const createdCardId of createdCardIds) {
			const createdCard = await this.get(createdCardId);
			if (!createdCard) throw new Error(`created card not found: ${createdCardId}`);
			if (!(childIds.includes(createdCardId) && cardParentIds(createdCard).includes(existing.id))) throw new Error(`created card is not linked to this card: ${createdCardId}`);
		}
		const summary = normalizeBoundedString(input.summary, void 0, 2e3, "summary");
		const proofInput = isRecord(input.proof) ? input.proof : void 0;
		const proofId = normalizeBoundedString(input.proofId, void 0, 120, "proof id");
		if (input.proofId !== void 0 && !proofId) throw new Error("proofId must be a non-empty string.");
		const proof = proofInput ? normalizeProofInput(proofInput, now) : void 0;
		const artifacts = Array.isArray(input.artifacts) ? input.artifacts.map((artifact) => normalizeArtifact({
			...artifact,
			createdAt: now
		})).filter((artifact) => artifact !== null).slice(-40) : [];
		const finished = finishRun(existing, "done", now);
		const metadata = clearDiagnostics(finished.metadata, ["missing_proof"]);
		const notifications = this.appendNotification(metadata, now, {
			kind: "completed",
			message: capText(summary, 240) ?? "Workboard card completed.",
			...cardSessionKey(existing) ? { sessionKey: cardSessionKey(existing) } : {},
			...cardRunId(existing) ? { runId: cardRunId(existing) } : {}
		});
		return await this.updateCard(existing, {
			...finished,
			metadata: {
				...metadata,
				automation: normalizeAutomation({
					...metadata.automation,
					summary,
					createdCardIds
				}, metadata.automation),
				comments: appendComment(metadata.comments, summary, now),
				proof: appendCompletionProof(metadata.proof, proof, proofId),
				artifacts: artifacts.length ? [...metadata.artifacts ?? [], ...artifacts].slice(-40) : metadata.artifacts,
				notifications
			}
		}, {
			enforceStatusHolds: true,
			preserveProofId: proofId ?? proof?.id,
			preserveNotificationId: notifications.at(-1)?.id
		});
	}
	buildBlockedCardPatch(existing, reason, now, options = {}) {
		const finished = finishRun(existing, "blocked", now, reason);
		const metadata = finished.metadata;
		const notifications = this.appendNotification(metadata, now, {
			kind: "failed",
			message: capText(reason, 240) ?? "Workboard card blocked.",
			...cardSessionKey(existing) ? { sessionKey: cardSessionKey(existing) } : {},
			...cardRunId(existing) ? { runId: cardRunId(existing) } : {}
		});
		return {
			...finished,
			...options.clearExecutionAssociation ? {
				sessionKey: null,
				runId: null,
				execution: null
			} : {},
			metadata: {
				...metadata,
				comments: appendComment(metadata.comments, reason, now),
				notifications
			}
		};
	}
	async block(id, input = {}, scope = input, options = {}) {
		return await this.enqueueMutation(async () => {
			const existing = await this.requireCard(id);
			assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
			const now = Date.now();
			const reason = normalizeBoundedString(input.reason, void 0, 2e3, "block reason") ?? "Workboard card blocked.";
			return await this.updateCard(existing, this.buildBlockedCardPatch(existing, reason, now, options));
		});
	}
	async unblock(id, scope) {
		return await this.enqueueMutation(async () => {
			const existing = await this.requireCard(id);
			assertCanMutateClaimedCard(existing, scope);
			const metadata = clearDiagnostics(existing.metadata, ["blocked_too_long"]);
			return await this.updateCard(existing, {
				status: "todo",
				metadata: {
					...metadata,
					stale: null
				}
			});
		});
	}
	async reassign(id, input = {}, scope) {
		return await this.enqueueMutation(async () => {
			const existing = await this.requireCard(id);
			assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
			const agentId = input.agentId === void 0 ? existing.agentId : normalizeOptionalString(input.agentId);
			const status = normalizeStatus(input.status, existing.status);
			const reason = normalizeBoundedString(input.reason, void 0, 1e3, "reassign reason");
			const shouldResetFailures = input.resetFailures !== false;
			const baseMetadata = shouldResetFailures ? clearDiagnostics(existing.metadata, ["blocked_too_long", "repeated_failures"]) : existing.metadata;
			const metadata = {
				...baseMetadata,
				...shouldResetFailures ? { failureCount: 0 } : {},
				comments: appendComment(baseMetadata?.comments, reason)
			};
			return await this.updateCard(existing, {
				agentId,
				status,
				metadata
			}, { enforceStatusHolds: true });
		});
	}
	async reclaim(id, input = {}, scope) {
		return await this.enqueueMutation(async () => {
			const existing = await this.requireCard(id);
			assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
			const now = Date.now();
			const reason = normalizeBoundedString(input.reason, void 0, 1e3, "reclaim reason") ?? "Workboard claim reclaimed.";
			const targetStatus = input.status === void 0 ? existing.status === "running" ? "ready" : existing.status : normalizeStatus(input.status, existing.status);
			const reclaimed = await this.updateCard(existing, {
				status: targetStatus,
				execution: existing.execution?.status === "running" ? null : existing.execution,
				metadata: {
					...existing.metadata,
					claim: void 0,
					attempts: closeRunningAttempts(existing.metadata?.attempts, now, "stopped", reason),
					comments: appendComment(existing.metadata?.comments, reason, now),
					stale: null
				}
			}, { enforceStatusHolds: true });
			return await this.promoteDependencyReady(reclaimed.id, now);
		});
	}
	async runs(id) {
		const card = await this.requireCard(id);
		return {
			card,
			attempts: card.metadata?.attempts ?? []
		};
	}
	async specify(id, input = {}, scope) {
		return await this.enqueueMutation(async () => {
			const existing = await this.requireCard(id);
			assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
			if (existing.status !== "triage" && existing.status !== "backlog" && existing.status !== "todo") throw new Error("only triage, backlog, or todo cards can be specified.");
			if (normalizeStatus(input.status, "todo") !== "todo") throw new Error("specified cards must move to todo.");
			const now = Date.now();
			const summary = normalizeBoundedString(input.summary, void 0, 2e3, "spec summary");
			const metadata = {
				...existing.metadata,
				comments: appendComment(existing.metadata?.comments, summary, now),
				automation: normalizeAutomation({
					...existing.metadata?.automation,
					summary: summary ?? existing.metadata?.automation?.summary
				}, existing.metadata?.automation)
			};
			const { summary: _summary, status: _status, ...cardPatch } = input;
			return await this.updateCard(existing, {
				...cardPatch,
				status: "todo",
				metadata
			}, {
				enforceStatusHolds: true,
				event: { kind: "specified" },
				eventAt: now
			});
		});
	}
	async decompose(id, input = {}, scope) {
		return await this.enqueueMutation(async () => {
			const parent = await this.requireCard(id);
			assertCanMutateClaimedCard(parent, scope === null ? void 0 : scope);
			const childrenInput = Array.isArray(input.children) ? input.children : [];
			if (childrenInput.length === 0) throw new Error("children are required.");
			if (childrenInput.length > 20) throw new Error("at most 20 children can be created at once.");
			const parentAutomation = parent.metadata?.automation;
			const children = [];
			for (const child of childrenInput) {
				if (!isRecord(child)) throw new Error("children must be objects.");
				const created = await this.createDirect({
					...child,
					parents: [parent.id],
					boardId: child.boardId ?? parentAutomation?.boardId,
					tenant: child.tenant ?? parentAutomation?.tenant,
					createdByCardId: parent.id,
					idempotencyKey: child.idempotencyKey ?? deriveChildIdempotencyKey(parentAutomation?.idempotencyKey, children.length + 1)
				}, scope === null ? void 0 : scope);
				children.push(cardParentIds(created).includes(parent.id) ? created : await this.linkCardsDirect(parent.id, created.id, Date.now(), {
					allowStatusOnlyActiveChild: true,
					scope: scope === null ? void 0 : scope
				}));
			}
			const summary = normalizeBoundedString(input.summary, void 0, 2e3, "decompose summary");
			const updatedParent = input.completeParent !== false ? await this.completeDirect(parent.id, {
				summary,
				createdCardIds: children.map((child) => child.id)
			}, scope) : await (async () => {
				const latestParent = await this.requireCard(parent.id);
				return await this.updateCard(latestParent, {
					status: latestParent.status === "triage" || latestParent.status === "backlog" ? "todo" : latestParent.status,
					metadata: {
						...latestParent.metadata,
						automation: normalizeAutomation({
							...latestParent.metadata?.automation,
							summary,
							createdCardIds: children.map((child) => child.id)
						}, latestParent.metadata?.automation)
					}
				}, { enforceStatusHolds: true });
			})();
			return {
				parent: await this.updateCard(updatedParent, {}, {
					event: { kind: "decomposed" },
					expectedUpdatedAt: updatedParent.updatedAt
				}),
				children
			};
		});
	}
};
//#endregion
//#region extensions/workboard/src/store-notifications.ts
var WorkboardNotificationStore = class extends WorkboardWorkflowStore {
	async subscribeNotifications(input) {
		return await this.enqueueMutation(async () => {
			const subscription = normalizeNotificationSubscription(input);
			await this.subscriptionStore.register(subscription.id, {
				version: 1,
				subscription
			});
			return subscription;
		});
	}
	async listNotificationSubscriptions(input = {}) {
		const boardId = normalizeBoardId(input.boardId);
		const cardId = normalizeBoundedString(input.cardId, void 0, 120, "card id");
		return { subscriptions: (await this.subscriptionStore.entries({
			boardId,
			cardId
		})).map(({ value }) => value.subscription).filter((subscription) => !cardId || subscription.cardId === cardId).toSorted((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id)) };
	}
	async deleteNotificationSubscription(id) {
		return await this.enqueueMutation(async () => ({ deleted: await this.subscriptionStore.delete(id.trim()) }));
	}
	async notificationEvents(input = {}) {
		const subscriptionId = normalizeBoundedString(input.subscriptionId, void 0, 120, "subscription id");
		const boardId = normalizeBoardId(input.boardId);
		const cardId = normalizeBoundedString(input.cardId, void 0, 120, "card id");
		const limit = resolveIntegerOption(input.limit, 50, {
			min: 1,
			max: 200
		});
		const subscriptionEntry = subscriptionId ? await this.subscriptionStore.lookup(subscriptionId) : void 0;
		if (subscriptionId && !subscriptionEntry?.subscription) throw new Error(`notification subscription not found: ${subscriptionId}`);
		const subscription = subscriptionEntry?.subscription;
		const effectiveCardId = subscription?.cardId ?? cardId;
		const effectiveBoardId = effectiveCardId ? void 0 : subscription?.boardId ?? boardId;
		const effectiveSessionKey = subscription?.sessionKey;
		const effectiveRunId = subscription?.runId;
		const events = [];
		const selectedCard = effectiveCardId ? await this.get(effectiveCardId) : void 0;
		const cards = effectiveCardId ? selectedCard ? [selectedCard] : [] : await this.list({ boardId: effectiveBoardId });
		for (const card of cards) {
			if (card.metadata?.archivedAt || effectiveCardId && card.id !== effectiveCardId) continue;
			const stale = card.metadata?.stale;
			const notifications = [...card.metadata?.notifications ?? [], ...stale ? [{
				id: `stale:${card.id}:${stale.detectedAt}`,
				kind: "stale",
				createdAt: stale.detectedAt,
				sequence: stale.detectedAt * 1e3,
				message: stale.reason,
				...cardSessionKey(card) ? { sessionKey: cardSessionKey(card) } : {},
				...cardRunId(card) ? { runId: cardRunId(card) } : {}
			}] : []];
			for (const event of notifications) {
				const eventSessionKey = event.sessionKey ?? cardSessionKey(card);
				const eventRunId = event.runId ?? cardRunId(card);
				if (effectiveSessionKey && eventSessionKey !== effectiveSessionKey) continue;
				if (effectiveRunId && eventRunId !== effectiveRunId) continue;
				if (subscription?.eventKinds?.length && !subscription.eventKinds.includes(event.kind)) continue;
				if (subscription?.lastEventAt !== void 0 && compareNotifications(event, {
					id: subscription.lastEventId ?? "",
					kind: event.kind,
					createdAt: subscription.lastEventAt,
					...subscription.lastEventSequence !== void 0 ? { sequence: subscription.lastEventSequence } : {},
					message: ""
				}) <= 0) continue;
				events.push(event);
			}
		}
		const sorted = events.toSorted(compareNotifications).slice(0, limit);
		return {
			...subscription ? { subscription } : {},
			events: sorted
		};
	}
	async advanceNotificationEvents(input = {}) {
		const subscriptionId = normalizeBoundedString(input.subscriptionId, void 0, 120, "subscription id");
		if (!subscriptionId) throw new Error("subscriptionId is required to advance notification events.");
		return await this.enqueueMutation(async () => {
			const result = await this.notificationEvents({
				...input,
				subscriptionId
			});
			if (!result.subscription || !result.events.length) return result;
			const last = result.events.at(-1);
			const lastSequence = notificationSequence(last);
			const subscription = {
				...result.subscription,
				lastEventAt: last.createdAt,
				lastEventId: last.id,
				...lastSequence !== void 0 ? { lastEventSequence: lastSequence } : {},
				updatedAt: Date.now()
			};
			delete subscription.deliveredEventIds;
			if (lastSequence === void 0) delete subscription.lastEventSequence;
			await this.subscriptionStore.register(subscription.id, {
				version: 1,
				subscription
			});
			return {
				subscription,
				events: result.events
			};
		});
	}
};
//#endregion
//#region extensions/workboard/src/store.ts
function preparedLaunchMatchesCard(card, expected) {
	const launch = card.metadata?.automation?.launch;
	return launch?.phase === "prepared" && launch.requestedSessionKey === expected.requestedSessionKey && launch.provisionalRunId === expected.provisionalRunId && launch.preparedAt === expected.preparedAt && card.sessionKey === expected.requestedSessionKey && card.runId === expected.provisionalRunId && card.execution?.sessionKey === expected.requestedSessionKey && card.execution?.runId === expected.provisionalRunId;
}
function acceptedLaunchForAssociation(card, association) {
	const launch = card.metadata?.automation?.launch;
	if (launch?.phase === "prepared") {
		if (!preparedLaunchMatchesCard(card, launch) || association.acceptedAt === void 0 || association.acceptedAt < launch.preparedAt) return;
		return {
			...launch,
			phase: "accepted",
			acceptedAt: association.acceptedAt,
			acceptedSessionKey: association.sessionKey,
			...association.runId ? { acceptedRunId: association.runId } : {}
		};
	}
	if (launch?.phase !== "accepted" || launch.acceptedSessionKey === association.sessionKey && (!association.runId || launch.acceptedRunId === association.runId)) return;
	return {
		...launch,
		acceptedSessionKey: association.sessionKey,
		...association.runId ? { acceptedRunId: association.runId } : {}
	};
}
function executionAssociationPatch(card, input) {
	if (cardSessionKey(card) !== input.expectedSessionKey || cardRunId(card) !== input.expectedRunId) return;
	const attempts = [...card.metadata?.attempts ?? []];
	const attemptIndex = attempts.findLastIndex((attempt) => attempt.status === "running" && (input.expectedRunId && attempt.runId === input.expectedRunId || !input.expectedRunId && input.expectedSessionKey && attempt.sessionKey === input.expectedSessionKey));
	if (attemptIndex >= 0) {
		const attempt = attempts[attemptIndex];
		if (attempt) attempts[attemptIndex] = {
			...attempt,
			sessionKey: input.sessionKey,
			...input.runId ? { runId: input.runId } : {}
		};
	}
	return {
		sessionKey: input.sessionKey,
		...input.runId ? { runId: input.runId } : {},
		execution: input.execution,
		ownedLaunch: input.launch,
		...attemptIndex >= 0 ? { metadata: {
			...card.metadata,
			attempts
		} } : {}
	};
}
function lifecycleExecution(params) {
	const existing = params.card.execution;
	const runId = params.association.runId ?? existing?.runId;
	return {
		id: existing?.id ?? `${params.card.id}:agent-session`,
		kind: "agent-session",
		mode: existing?.mode ?? "autonomous",
		status: params.status ?? existing?.status ?? "running",
		...existing?.engine ? { engine: existing.engine } : {},
		...existing?.model ? { model: existing.model } : {},
		sessionKey: params.association.sessionKey,
		...runId ? { runId } : {},
		startedAt: existing?.startedAt ?? params.card.startedAt ?? params.card.updatedAt,
		updatedAt: params.now
	};
}
var WorkboardStore = class WorkboardStore extends WorkboardNotificationStore {
	async prepareExecutionLaunch(id, input) {
		return await this.enqueueMutation(async () => {
			const result = await this.updateLatestCard(id, (card) => {
				assertCanMutateClaimedCard(card, input.scope);
				const provisionalRunId = `workboard:${card.id}:${card.updatedAt}`;
				const launch = {
					phase: "prepared",
					requestedSessionKey: input.requestedSessionKey,
					provisionalRunId,
					preparedAt: card.updatedAt
				};
				return {
					sessionKey: input.requestedSessionKey,
					runId: provisionalRunId,
					execution: {
						id: card.execution?.id ?? `${card.id}:agent-session`,
						kind: "agent-session",
						mode: "autonomous",
						status: "running",
						sessionKey: input.requestedSessionKey,
						runId: provisionalRunId,
						startedAt: input.now,
						updatedAt: input.now
					},
					ownedLaunch: launch
				};
			});
			const launch = result.card.metadata?.automation?.launch;
			if (launch?.phase !== "prepared") throw new Error("prepared Workboard launch was not persisted");
			return {
				card: result.card,
				launch
			};
		}, input.assertOwnerCurrent);
	}
	async acceptExecutionLaunch(id, input) {
		return await this.enqueueMutation(async () => {
			const result = await this.updateLatestCard(id, (card) => {
				if (!preparedLaunchMatchesCard(card, input.expectedLaunch) || input.acceptedAt < input.expectedLaunch.preparedAt) return;
				const launch = {
					...input.expectedLaunch,
					phase: "accepted",
					acceptedAt: input.acceptedAt,
					acceptedSessionKey: input.sessionKey,
					...input.runId ? { acceptedRunId: input.runId } : {}
				};
				return executionAssociationPatch(card, {
					...input,
					launch
				});
			});
			return result.updated ? result.card : void 0;
		});
	}
	async failPreparedLaunch(id, input) {
		const failedAt = Math.max(input.failedAt, input.expectedLaunch.preparedAt);
		const reason = capText(input.reason, 2e3) ?? "Dispatcher could not start worker.";
		const launchReason = capText(reason, 800) ?? "Prepared launch failed.";
		return await this.enqueueMutation(async () => {
			return (await this.updateLatestCard(id, (card) => {
				if (!preparedLaunchMatchesCard(card, input.expectedLaunch)) return;
				return {
					...this.buildBlockedCardPatch(card, reason, failedAt, { clearExecutionAssociation: true }),
					ownedLaunch: {
						...input.expectedLaunch,
						phase: "failed",
						failedAt,
						reason: launchReason
					}
				};
			})).updated;
		});
	}
	async syncLifecycle(id, input) {
		return await this.enqueueMutation(async () => {
			return (await this.updateLatestCard(id, (card) => {
				if (card.metadata?.archivedAt) return;
				const patch = {};
				let metadata;
				const launch = card.metadata?.automation?.launch;
				const associationIsCurrent = !input.association || (input.sourceUpdatedAt === void 0 || !shouldSkipPersistedLifecycleStatusUpdate(card, input.sourceUpdatedAt)) && (launch?.phase !== "prepared" || input.association.acceptedAt !== void 0 && input.association.acceptedAt >= launch.preparedAt) && cardSessionKey(card) === input.association.expectedSessionKey && cardRunId(card) === input.association.expectedRunId;
				if (associationIsCurrent && input.sourceUpdatedAt !== void 0 && shouldSyncWorkboardLifecycleStatus(card, input.targetStatus)) {
					patch.status = input.targetStatus;
					metadata = { lifecycleStatusSourceUpdatedAt: input.sourceUpdatedAt };
				}
				const acceptedLaunch = input.association ? acceptedLaunchForAssociation(card, input.association) : void 0;
				const associationNeedsUpdate = input.association && (card.sessionKey !== input.association.sessionKey || input.association.runId !== void 0 && card.runId !== input.association.runId || !card.execution || card.execution.sessionKey !== input.association.sessionKey || input.association.runId !== void 0 && card.execution.runId !== input.association.runId || input.executionStatus !== void 0 && card.execution.status !== input.executionStatus || Boolean(acceptedLaunch));
				if (associationIsCurrent && input.association && associationNeedsUpdate) {
					const associationPatch = executionAssociationPatch(card, {
						...input.association,
						execution: lifecycleExecution({
							card,
							association: input.association,
							status: input.executionStatus,
							now: input.now
						}),
						...acceptedLaunch ? { launch: acceptedLaunch } : {}
					});
					if (associationPatch) {
						Object.assign(patch, associationPatch);
						metadata = {
							...associationPatch.metadata,
							...metadata
						};
					}
				} else if (!input.association && card.execution && input.executionStatus && card.execution.status !== input.executionStatus) patch.execution = {
					...card.execution,
					status: input.executionStatus,
					updatedAt: input.now
				};
				if (associationIsCurrent && input.stale) {
					const existing = card.metadata?.stale;
					if (!existing || existing.lastSessionUpdatedAt !== input.stale.lastSessionUpdatedAt || existing.reason !== input.stale.reason) metadata = {
						...metadata,
						stale: {
							...input.stale,
							detectedAt: existing?.detectedAt ?? input.stale.detectedAt
						}
					};
				} else if (associationIsCurrent && card.metadata?.stale) metadata = {
					...metadata,
					stale: null
				};
				if (metadata) patch.metadata = metadata;
				return Object.keys(patch).length === 0 ? void 0 : patch;
			})).updated;
		});
	}
	async prepareStart(id, now = Date.now(), assertOwnerCurrent) {
		return await this.enqueueMutation(async () => await this.promoteDependencyReady(id, now), assertOwnerCurrent);
	}
	async getAutoOrchestrationBoard(card) {
		if (card.status !== "triage" || card.metadata?.archivedAt || card.metadata?.workerProtocol?.state === "idle") return;
		const board = await this.boardStore.lookup(cardBoardId(card));
		return board?.board.orchestration?.autoDecompose === true ? board.board : void 0;
	}
	async dispatch(input = Date.now()) {
		const now = typeof input === "number" ? input : normalizeTimestamp(input.now, Date.now());
		const boardId = typeof input === "number" ? void 0 : normalizeBoardId(input.boardId);
		const assertOwnerCurrent = typeof input === "number" ? void 0 : input.assertOwnerCurrent;
		return await this.enqueueMutation(async () => {
			if (boardId) await this.assertCardsBoard(boardId);
			const promoted = [];
			const reclaimed = [];
			const blocked = [];
			const orchestrated = [];
			const orchestratedByBoard = /* @__PURE__ */ new Map();
			for (const card of await this.list({ boardId })) {
				if (card.metadata?.archivedAt) continue;
				await this.withMutationAuthority(async () => {
					let latest = await this.promoteDependencyReady(card.id, now);
					const wasPromoted = latest.status !== card.status;
					const claim = latest.metadata?.claim;
					const latestAttempt = latestRunningAttempt(latest);
					const maxRuntimeSeconds = latest.metadata?.automation?.maxRuntimeSeconds;
					const runtimeStartedAt = latestAttempt?.startedAt ?? claim?.claimedAt ?? latest.startedAt;
					const timedOut = Boolean(maxRuntimeSeconds && runtimeStartedAt) && now - runtimeStartedAt > secondsToDurationMs(maxRuntimeSeconds);
					const claimExpired = isWorkboardClaimReclaimable(claim, now);
					const retriesExhausted = retryBudgetExhausted(latest);
					if (latest.status === "running" && (timedOut || claimExpired)) {
						const reason = timedOut ? "Run exceeded the card max runtime." : "Claim expired without a recent heartbeat.";
						const finished = finishRun(latest, "blocked", now, reason);
						latest = await this.updateCard(latest, {
							...finished,
							metadata: {
								...finished.metadata,
								notifications: this.appendNotification(latest.metadata, now, {
									kind: "failed",
									message: reason
								})
							}
						});
						blocked.push(latest);
					} else if (claimExpired) {
						latest = await this.updateCard(latest, { metadata: {
							...latest.metadata,
							claim: void 0
						} });
						reclaimed.push(latest);
					}
					if (!latest.metadata?.claim && retriesExhausted && isDependencyPromotableStatus(latest.status)) {
						latest = await this.updateCard(latest, {
							status: "blocked",
							metadata: {
								...latest.metadata,
								notifications: this.appendNotification(latest.metadata, now, {
									kind: "failed",
									message: "Card exhausted its retry budget."
								})
							}
						});
						blocked.push(latest);
					}
					const orchestrationBoard = await this.getAutoOrchestrationBoard(latest);
					if (orchestrationBoard) {
						const latestBoardId = cardBoardId(latest);
						const cap = orchestrationBoard.orchestration?.autoDecomposePerDispatch ?? 3;
						const boardCount = orchestratedByBoard.get(latestBoardId) ?? 0;
						if (boardCount < cap) {
							latest = await this.recordOrchestrationCandidate(latest, now);
							orchestrated.push(latest);
							orchestratedByBoard.set(latestBoardId, boardCount + 1);
						}
					}
					if (wasPromoted && latest.status !== "blocked") promoted.push(latest);
				}, assertOwnerCurrent);
			}
			return {
				promoted,
				reclaimed,
				blocked,
				orchestrated,
				count: promoted.length + reclaimed.length + blocked.length + orchestrated.length
			};
		});
	}
	async bulkUpdate(input) {
		const ids = Array.isArray(input.ids) ? input.ids.filter((id) => typeof id === "string" && id.trim() !== "") : [];
		if (ids.length === 0) throw new Error("ids are required.");
		const patch = asNonArrayRecord(input.patch);
		const cards = [];
		for (const id of ids) {
			const updated = input.archived === void 0 ? await this.update(id, patch) : await this.archive(id, input.archived);
			cards.push(updated);
		}
		return { cards };
	}
	async archive(id, archived, options = {}) {
		const shouldArchive = archived !== false;
		return await this.updateMetadata(id, (existing) => ({
			...existing.metadata,
			archivedAt: shouldArchive ? Date.now() : 0
		}), options);
	}
	async exportCards() {
		const cards = await this.list();
		return {
			cards,
			attachments: cards.flatMap((card) => card.metadata?.attachments ?? []),
			exportedAt: Date.now()
		};
	}
	async diagnostics(now = Date.now()) {
		const rows = (await this.list()).flatMap((card) => {
			const diagnostics = computeCardDiagnostics(card, now);
			return diagnostics.length ? [{
				card,
				diagnostics
			}] : [];
		});
		return {
			diagnostics: rows,
			count: rows.reduce((total, row) => total + row.diagnostics.length, 0)
		};
	}
	async refreshDiagnostics(now = Date.now()) {
		return await this.enqueueMutation(async () => {
			const cards = await this.list();
			const rows = [];
			for (const card of cards) {
				let diagnostics = [];
				const result = await this.updateLatestCard(card.id, (current) => {
					if (current.metadata?.archivedAt) return;
					diagnostics = mergeDiagnostics(current.metadata?.diagnostics, computeCardDiagnostics(current, now));
					if (diagnostics.length === 0 && !current.metadata?.diagnostics?.length) return;
					return { metadata: {
						...current.metadata,
						diagnostics
					} };
				});
				if (diagnostics.length > 0) rows.push({
					card: result.card,
					diagnostics
				});
			}
			return {
				diagnostics: rows,
				count: rows.reduce((total, row) => total + row.diagnostics.length, 0)
			};
		});
	}
	async buildWorkerContext(id) {
		return (await this.readWithWorkerContext(id)).workerContext;
	}
	async readWithWorkerContext(id) {
		const card = await this.requireCard(id);
		const parentIds = cardParentIds(card);
		return {
			card,
			workerContext: buildWorkerContext(card, parentIds.length > 0 || card.agentId ? await readCards(this.store, {
				kind: "worker-context",
				cardId: card.id,
				boardId: cardBoardId(card),
				agentId: card.agentId,
				parentIds
			}) : [])
		};
	}
	static openSqlite(workerModuleUrl, config) {
		const stores = createWorkboardSqliteStores({
			workerModuleUrl,
			config
		});
		return new WorkboardStore(stores.cards, stores);
	}
};
//#endregion
//#region extensions/workboard/src/dispatcher.ts
const DEFAULT_DISPATCH_MAX_STARTS = 3;
const pendingWorkboardDispatches = /* @__PURE__ */ new WeakMap();
function cardHasActiveClaim(card, now) {
	const claim = card.metadata?.claim;
	return Boolean(claim && isFutureDateTimestampMs(claim.expiresAt, { nowMs: now }));
}
async function materializeWorkspace(params) {
	const workspace = params.card.metadata?.automation?.workspace;
	if (!workspace || workspace.kind === "scratch") return {};
	const sourcePath = workspace.sourcePath ?? workspace.path;
	const sourceBranch = workspace.sourcePath ? workspace.sourceBranch : workspace.branch;
	if (!sourcePath || !path.isAbsolute(sourcePath)) throw new Error("worktree workspace path must be an absolute git checkout path");
	const canonicalSourcePath = await assertWorkboardWorkspaceSourceAccess(workspace, params.workspaceAccess);
	if (!canonicalSourcePath) throw new Error("worktree workspace path is required");
	if (workspace.kind === "dir" || !params.workspaceAccess.unrestricted) {
		await assertCanonicalWorkboardRootAccess(canonicalSourcePath, params.workspaceAccess);
		return workspace.kind === "worktree" ? {
			cwd: canonicalSourcePath,
			workspace: {
				kind: "dir",
				path: canonicalSourcePath
			}
		} : { cwd: canonicalSourcePath };
	}
	if (!params.materializeWorktree) throw new Error("managed worktree materialization was not explicitly authorized");
	if (!params.worktrees) throw new Error("managed worktree runtime is unavailable");
	params.assertOwnerCurrent?.();
	const worktree = await params.worktrees.create({
		repoRoot: canonicalSourcePath,
		name: managedWorktreeName(params.card.id),
		...sourceBranch ? { baseRef: sourceBranch } : {},
		ownerKind: "workboard",
		ownerId: params.card.id,
		...params.assertOwnerCurrent ? { commitGuard: params.assertOwnerCurrent } : {}
	});
	let cwd;
	try {
		cwd = await canonicalPathFromExistingAncestor(worktree.path);
	} catch (error) {
		if (!await params.worktrees.removeIfLossless({
			path: worktree.path,
			ownerKind: "workboard",
			ownerId: params.card.id
		}).catch(() => false)) throw new Error(`${formatErrorMessage(error)}; managed worktree cleanup failed`, { cause: error });
		throw error;
	}
	return {
		cwd,
		workspace: {
			kind: "worktree",
			path: worktree.path,
			branch: worktree.branch,
			sourcePath,
			...sourceBranch ? { sourceBranch } : {}
		}
	};
}
function sortReadyCards(a, b) {
	const priorityRank = {
		urgent: 0,
		high: 1,
		normal: 2,
		low: 3
	};
	return priorityRank[a.priority] - priorityRank[b.priority] || a.position - b.position || a.createdAt - b.createdAt;
}
function selectStartableCards(cards, limit, candidates, ownerOverride, now, mode) {
	if (limit <= 0) return { cards: [] };
	const runningOwners = /* @__PURE__ */ new Set();
	for (const card of cards) {
		if (!workboardCardConsumesOwnerSlot(card, now)) continue;
		runningOwners.add(workboardCardSlotOwner(card));
	}
	const selected = [];
	const fallback = [];
	const selectedOwners = /* @__PURE__ */ new Set();
	const ordered = mode === "scheduled" ? candidates.toSorted(sortReadyCards) : candidates;
	for (const card of ordered) {
		const owner = ownerOverride || workboardCardSlotOwner(card, now);
		const rejection = card.metadata?.archivedAt ? "Card is archived; restore it before starting." : cardHasActiveClaim(card, now) ? `Card is already claimed by ${card.metadata?.claim?.ownerId ?? "another worker"}.` : mode === "scheduled" && card.status !== "ready" ? "" : mode === "exact" && card.status !== "backlog" && card.status !== "todo" && card.status !== "ready" ? `Card cannot start from ${card.status}; move it to backlog, todo, or ready first.` : runningOwners.has(owner) ? `Owner ${owner} already has active Workboard work; complete or stop it before starting another card.` : void 0;
		if (rejection !== void 0) {
			if (mode === "exact") return {
				cards: [],
				rejection: {
					cardId: card.id,
					title: card.title,
					error: rejection
				}
			};
			continue;
		}
		if (selectedOwners.has(owner)) {
			fallback.push(card);
			continue;
		}
		selectedOwners.add(owner);
		selected.push(card);
	}
	return { cards: [...selected, ...fallback] };
}
async function dispatchAndStartWorkboardCards(params) {
	const previous = pendingWorkboardDispatches.get(params.store);
	const dispatch = previous ? previous.then(() => runWorkboardDispatch(params)) : runWorkboardDispatch(params);
	const settled = dispatch.then(() => void 0, () => void 0);
	pendingWorkboardDispatches.set(params.store, settled);
	try {
		return await dispatch;
	} finally {
		if (pendingWorkboardDispatches.get(params.store) === settled) pendingWorkboardDispatches.delete(params.store);
	}
}
async function runWorkboardDispatch(params) {
	const now = params.options?.now ?? Date.now();
	const boardId = params.options?.boardId;
	const directCardId = params.options?.cardId;
	const assertOwnerCurrent = params.options?.assertOwnerCurrent;
	const directCard = directCardId ? await params.store.prepareStart(directCardId, now, assertOwnerCurrent) : void 0;
	const dispatch = directCard ? {
		promoted: [],
		reclaimed: [],
		blocked: [],
		orchestrated: [],
		count: 0
	} : await params.store.dispatch({
		now,
		boardId,
		assertOwnerCurrent
	});
	const maxStarts = resolveNonNegativeIntegerOption(params.options?.maxStarts, DEFAULT_DISPATCH_MAX_STARTS);
	const started = [];
	const startFailures = [];
	const cards = await params.store.list();
	const candidates = directCard ? [directCard] : await params.store.list({ boardId });
	const ownerOverride = params.options?.ownerId?.trim() || void 0;
	const startedOwners = /* @__PURE__ */ new Set();
	const maxAttempts = maxStarts * 2;
	let attemptedStarts = 0;
	const selection = selectStartableCards(cards, maxStarts, candidates, ownerOverride, now, directCardId ? "exact" : "scheduled");
	if (selection.rejection) startFailures.push(selection.rejection);
	for (const card of selection.cards) {
		const ownerId = ownerOverride || workboardCardSlotOwner(card, now);
		if (started.length >= maxStarts || attemptedStarts >= maxAttempts) break;
		if (startedOwners.has(ownerId)) continue;
		const sessionKey = workboardSessionKeyForCard(card);
		let claimValue = "";
		let implicitWorkspaceCwd;
		let runStarted = false;
		let workspaceMutation;
		let preparedLaunch;
		const requestedWorkspace = card.metadata?.automation?.workspace;
		let workspaceAccess;
		let targetWorkspace;
		let persistWorkspaceAccess;
		const assertRestrictedTarget = (root) => assertRestrictedWorkboardTarget({
			root,
			agentId: card.agentId,
			sessionKey,
			modelProvider: params.options?.provider,
			modelId: params.options?.model,
			resolveAgentWorkspaceRuntime: params.options?.resolveAgentWorkspaceRuntime,
			worktrees: params.worktrees
		});
		try {
			({workspaceAccess, targetWorkspace, persistWorkspaceAccess} = await resolveDispatchWorkspaceAccess({
				card,
				currentAccess: params.options?.workspaceAccess,
				resolveAgentWorkspace: params.options?.resolveAgentWorkspace
			}));
			if (!requestedWorkspace || requestedWorkspace.kind === "scratch") {
				if (!workspaceAccess.unrestricted) {
					if (!targetWorkspace) {
						startFailures.push({
							cardId: card.id,
							title: card.title,
							error: "target agent workspace is unavailable for restricted dispatch"
						});
						continue;
					}
					implicitWorkspaceCwd = targetWorkspace;
					await assertCanonicalWorkboardRootAccess(implicitWorkspaceCwd, workspaceAccess);
					await assertRestrictedTarget(implicitWorkspaceCwd);
				}
			} else {
				const canonicalSourcePath = await assertWorkboardWorkspaceSourceAccess(requestedWorkspace, workspaceAccess);
				if (canonicalSourcePath && requestedWorkspace.kind === "dir" && workspaceAccess.unrestricted) await assertCanonicalWorkboardRootAccess(canonicalSourcePath, workspaceAccess);
				if (canonicalSourcePath && !workspaceAccess.unrestricted) {
					await assertCanonicalWorkboardRootAccess(canonicalSourcePath, workspaceAccess);
					await assertRestrictedTarget(canonicalSourcePath);
				}
			}
		} catch (error) {
			const canRequestHostAccess = error instanceof WorkboardWorkspaceOutsideRootsError && params.options?.workspaceAccess?.unrestricted === false && card.metadata?.automation?.workspaceAccess?.unrestricted === true;
			const message = formatErrorMessage(error);
			startFailures.push({
				cardId: card.id,
				title: card.title,
				error: canRequestHostAccess ? `${message} Rerun with --admin to request operator.admin for full-host workspace access.` : message
			});
			continue;
		}
		try {
			const claimed = await params.store.claim(card.id, {
				ownerId,
				ttlSeconds: card.metadata?.automation?.maxRuntimeSeconds
			}, {
				expectedAuthority: {
					boardId: cardBoardId(card),
					status: card.status,
					agentId: card.agentId,
					workspace: card.metadata?.automation?.workspace,
					workspaceAccess: card.metadata?.automation?.workspaceAccess
				},
				adoptWorkspaceAccess: persistWorkspaceAccess ? workspaceAccess : void 0,
				assertOwnerCurrent
			});
			claimValue = claimed.token;
			attemptedStarts += 1;
			const context = await params.store.buildWorkerContext(card.id);
			const materialized = await materializeWorkspace({
				card: claimed.card,
				worktrees: params.worktrees,
				materializeWorktree: params.options?.materializeWorktree === true,
				workspaceAccess,
				assertOwnerCurrent
			});
			const runCwd = materialized.cwd ?? implicitWorkspaceCwd;
			if (runCwd && !workspaceAccess.unrestricted) await assertRestrictedTarget(runCwd);
			const materializedWorkspace = materialized.workspace;
			if (materializedWorkspace) {
				const workspaceBase = await params.store.get(card.id);
				if (!workspaceBase) throw new Error(`card not found: ${card.id}`);
				workspaceMutation = {
					before: workspaceBase,
					after: await params.store.update(card.id, {
						workspace: materializedWorkspace,
						workspaceAccess
					}, { expectedUpdatedAt: workspaceBase.updatedAt })
				};
			}
			const prepared = await params.store.prepareExecutionLaunch(card.id, {
				requestedSessionKey: sessionKey,
				now,
				scope: {
					ownerId,
					token: claimValue
				},
				assertOwnerCurrent
			});
			const launched = prepared.card;
			preparedLaunch = prepared.launch;
			const runId = prepared.launch.provisionalRunId;
			assertOwnerCurrent?.();
			const run = await params.subagent.run({
				sessionKey,
				...assertOwnerCurrent ? { assertCurrent: assertOwnerCurrent } : {},
				message: [
					`Work on this OpenClaw Workboard card: ${claimed.card.title}`,
					"",
					"## Worker protocol",
					`Card id: ${claimed.card.id}`,
					`Claim ownerId: ${ownerId}`,
					`Claim token: ${claimValue}`,
					"",
					"Heartbeat with workboard_heartbeat using the card id and token while working.",
					"When done, call workboard_complete with the card id, token, summary, and proof.",
					"If you recorded proof separately, pass its returned proofId to workboard_complete.",
					"If blocked, call workboard_block with the card id, token, and reason.",
					"",
					context
				].join("\n"),
				toolsAlsoAllow: [...WORKBOARD_REQUIRED_WORKER_TOOLS],
				...params.options?.provider ? { provider: params.options.provider } : {},
				...params.options?.model ? { model: params.options.model } : {},
				lane: `workboard:${cardBoardId(card)}:${card.id}`,
				idempotencyKey: runId,
				lightContext: true,
				deliver: false,
				...runCwd ? { cwd: runCwd } : {}
			});
			runStarted = true;
			const acceptedSessionKey = run.sessionKey?.trim() || sessionKey;
			const acceptedExecution = {
				id: launched.execution?.id ?? `${launched.id}:agent-session`,
				kind: "agent-session",
				mode: "autonomous",
				status: "running",
				...run.runtime ? {
					engine: run.runtime.harness,
					model: `${run.runtime.provider}/${run.runtime.model}`
				} : {},
				sessionKey: acceptedSessionKey,
				runId: run.runId,
				startedAt: now,
				updatedAt: now
			};
			const acceptedCard = {
				...launched,
				sessionKey: acceptedSessionKey,
				runId: run.runId,
				execution: acceptedExecution
			};
			const updated = await params.store.acceptExecutionLaunch(card.id, {
				expectedLaunch: prepared.launch,
				acceptedAt: Math.max(Date.now(), prepared.launch.preparedAt),
				expectedSessionKey: sessionKey,
				expectedRunId: runId,
				sessionKey: acceptedSessionKey,
				runId: run.runId,
				execution: acceptedExecution
			}).catch(() => void 0) ?? acceptedCard;
			startedOwners.add(ownerId);
			started.push({
				cardId: updated.id,
				title: updated.title,
				sessionKey: acceptedSessionKey,
				runId: run.runId,
				...directCardId ? { card: updated } : {}
			});
			await params.store.addWorkerLog(updated.id, {
				level: "info",
				message: `Dispatcher started subagent run ${run.runId}.`,
				sessionKey: acceptedSessionKey,
				runId: run.runId
			}, {
				ownerId,
				token: claimValue
			}).catch(() => void 0);
		} catch (error) {
			const message = formatErrorMessage(error);
			startFailures.push({
				cardId: card.id,
				title: card.title,
				error: message
			});
			if (!claimValue || runStarted) continue;
			try {
				const reason = `Dispatcher could not start worker: ${message}`;
				if (preparedLaunch) await params.store.failPreparedLaunch(card.id, {
					expectedLaunch: preparedLaunch,
					reason,
					failedAt: Date.now()
				});
				else await params.store.block(card.id, {
					ownerId,
					token: claimValue,
					reason
				}, {
					ownerId,
					token: claimValue
				});
			} catch {}
			if (params.worktrees) {
				const failedCard = await params.store.get(card.id).catch(() => void 0);
				if (failedCard) await cleanupWorkboardCardWorktree({
					store: params.store,
					worktrees: params.worktrees,
					card: failedCard,
					...workspaceMutation ? { workspaceMutation } : {}
				}).catch(() => void 0);
			}
		}
	}
	return {
		...dispatch,
		started,
		startFailures,
		count: dispatch.count + started.length + startFailures.length
	};
}
//#endregion
//#region extensions/workboard/src/gateway-helpers.ts
var WorkboardUploadsDisabledError = class extends Error {
	constructor() {
		super("File and image uploads are disabled by gateway.uploads.enabled");
		this.name = "WorkboardUploadsDisabledError";
	}
};
function respondError(respond, error) {
	if (error instanceof WorkboardUploadsDisabledError) {
		respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, error.message, { details: { code: "UPLOADS_DISABLED" } }));
		return;
	}
	if (error instanceof WorkboardCardConflictError) {
		respond(false, void 0, {
			code: "workboard_conflict",
			message: error.message,
			details: {
				type: "workboard_card_conflict",
				card: redactClaimToken(error.current)
			}
		});
		return;
	}
	respond(false, void 0, {
		code: "workboard_error",
		message: formatErrorMessage(error)
	});
}
function readExpectedUpdatedAt(params) {
	const value = params.expectedUpdatedAt;
	if (value !== void 0 && (typeof value !== "number" || !Number.isFinite(value))) throw new Error("expectedUpdatedAt must be a finite number.");
	return value;
}
function readId(params) {
	const value = params.id;
	if (typeof value === "string" && value.trim()) return value.trim();
	throw new Error("id is required.");
}
function readOptionalPositiveInteger(value, fieldName) {
	if (value === void 0) return;
	const parsed = parseStrictPositiveInteger(value);
	if (typeof value !== "number" || parsed === void 0) throw new Error(`${fieldName} must be a positive integer.`);
	return parsed;
}
function readPatch(params) {
	return isRecord(params.patch) ? params.patch : params;
}
function assertNoCursorAdvance(params) {
	if (params.advance === true) throw new Error("notification cursor advancement requires workboard.notifications.advance.");
}
function resolveGatewayWorkboardWorkspaceAccess(params) {
	if (!params.client) return { unrestricted: true };
	if ((Array.isArray(params.client?.connect?.scopes) ? params.client.connect.scopes : []).includes("operator.admin")) return { unrestricted: true };
	return resolveConfiguredWorkboardWorkspaceAccess({
		config: params.context.getRuntimeConfig(),
		unrestricted: false
	});
}
async function resolveGatewayWorkspaceMutationAccess(request, value) {
	const access = await canonicalizeWorkboardWorkspaceAccess(resolveGatewayWorkboardWorkspaceAccess(request));
	await assertWorkboardWorkspaceMutationAccess(value, access);
	return access;
}
function createWorkboardDispatchHandler(params) {
	return async ({ params: requestParams, client, context, sessionMutationCommitGuard }, options) => {
		const cardId = options.directCard ? readId(requestParams) : void 0;
		const { boardId, maxStarts: rawMaxStarts } = asRecord(requestParams);
		if (!options.supportsMaxStarts && rawMaxStarts !== void 0) throw new Error("maxStarts requires workboard.cards.dispatchWithOptions.");
		const maxStarts = options.supportsMaxStarts ? readOptionalPositiveInteger(rawMaxStarts, "maxStarts") : void 0;
		const provider = options.directCard ? normalizeOptionalString(requestParams.provider) : void 0;
		const model = options.directCard ? normalizeOptionalString(requestParams.model) : void 0;
		const result = await dispatchAndStartWorkboardCards({
			store: params.store,
			subagent: params.api.runtime.subagent,
			worktrees: params.api.runtime.worktrees,
			options: {
				...cardId ? {
					cardId,
					maxStarts: 1
				} : {},
				boardId: typeof boardId === "string" ? boardId : void 0,
				...maxStarts !== void 0 ? { maxStarts } : {},
				...provider ? { provider } : {},
				...model ? { model } : {},
				materializeWorktree: true,
				assertOwnerCurrent: sessionMutationCommitGuard,
				resolveAgentWorkspace: (agentId) => resolveWorkboardAgentWorkspace(context.getRuntimeConfig(), agentId),
				resolveAgentWorkspaceRuntime: (agentId, sessionKey, workspaceDir, modelProvider, modelId) => {
					return resolveAgentWorkboardWorkspaceRuntime({
						config: context.getRuntimeConfig(),
						agentId,
						sessionKey,
						workspaceDir,
						modelProvider,
						modelId,
						prepareSandboxWorkspaceAuthority: params.api.runtime.sandbox.prepareWorkspaceAuthority
					});
				},
				workspaceAccess: resolveGatewayWorkboardWorkspaceAccess({
					context,
					client
				})
			}
		});
		if (cardId) {
			const started = result.started[0];
			if (!started?.card) throw new Error(result.startFailures[0]?.error ?? "Workboard card did not start.");
			return {
				...started,
				card: redactClaimToken(started.card)
			};
		}
		return redactDispatchResult(result);
	};
}
//#endregion
//#region extensions/workboard/src/sqlite-store-paths.ts
function resolveWorkboardSqliteWorkerModuleUrl(runtimeSource) {
	if (!runtimeSource) throw new Error("Workboard requires runtime entrypoint metadata");
	return new URL(`./src/sqlite-store.worker${path.extname(runtimeSource)}`, pathToFileURL(runtimeSource));
}
//#endregion
//#region extensions/workboard/src/store-lifecycle.ts
function registerWorkboardStoreLifecycle(api, store, stopServices) {
	const dispose = async () => {
		await stopServices?.();
		await store.close();
	};
	api.lifecycle.registerRuntimeLifecycle({
		id: "workboard-sqlite-store",
		dispose,
		cleanup: ({ reason, sessionKey, runId }) => {
			if (sessionKey === void 0 && runId === void 0 && (reason === "disable" || reason === "restart")) return dispose();
		}
	});
}
//#endregion
//#region extensions/workboard/src/gateway.ts
const READ_SCOPE = "operator.read";
const WRITE_SCOPE = "operator.write";
const cardsListFilterSchema = object({ sessionKey: string().trim().min(1).optional() });
const CLI_OWNER_METHODS = /* @__PURE__ */ new Set([
	"workboard.cards.list",
	"workboard.cards.create",
	"workboard.cards.move",
	"workboard.cards.dispatch",
	"workboard.cards.dispatchWithOptions"
]);
function sessionsBoardView(input) {
	const unknownParam = Object.keys(input).find((key) => key !== "boardId" && key !== "view" && key !== "sinceRevision");
	if (unknownParam) throw new Error(`Unknown Sessions board read field: ${unknownParam}.`);
	if (input.view === void 0) return;
	if (!isRecord(input.view)) throw new Error("view must be an object.");
	const view = {};
	for (const [key, value] of Object.entries(input.view)) switch (key) {
		case "involvingMe":
		case "includePeople":
			if (typeof value !== "boolean") throw new Error(`view.${key} must be a boolean.`);
			view[key] = value;
			break;
		case "involvingProfileId":
			if (typeof value !== "string") throw new Error("view.involvingProfileId must be a string.");
			view.involvingProfileId = value;
			break;
		default: throw new Error(`Unknown Sessions board view field: ${key}.`);
	}
	return view;
}
/**
* Interactive Sessions-board writes wait in the store's mutation queue, so the
* caller's full Gateway authority (transport, role/scope/profile authorization,
* in-process lifetime) is rechecked immediately before the SQLite write.
*/
function sessionsBoardCaller(context) {
	return { assertCurrent() {
		context.signal?.throwIfAborted();
		if (context.hasCurrentClientAuthority?.() === false) throw new Error("Caller authority is no longer active.");
		context.sessionAccessAuthority?.assertCurrent();
		context.sessionMutationAuthorization?.assertCurrent();
		context.sessionMutationCommitGuard?.();
	} };
}
function redactDiagnosticsRows(result) {
	return {
		...result,
		diagnostics: result.diagnostics.map((row) => ({
			...row,
			card: redactClaimToken(row.card)
		}))
	};
}
async function redactCardResult(card) {
	return { card: redactClaimToken(await card) };
}
function registerWorkboardGatewayMethods(params) {
	const { api } = params;
	const assertUploadsAllowed = (client) => {
		if (!client?.internal?.syntheticClient && !client?.internal?.agentRuntimeIdentity && api.runtime.config.current().gateway?.uploads?.enabled === false) throw new WorkboardUploadsDisabledError();
	};
	const store = params.store ?? WorkboardStore.openSqlite(resolveWorkboardSqliteWorkerModuleUrl(api.runtimeSource));
	if (!params.store) registerWorkboardStoreLifecycle(api, store);
	const register = (method, scope, handler) => {
		const requestHandler = async (initialRequest) => {
			let request = initialRequest;
			let assertOwnerCurrent;
			if (request.params?.expectedOwnerId !== void 0) {
				try {
					const expectedOwnerId = readToolStringParam(request.params, "expectedOwnerId", { required: true });
					assertOwnerCurrent = captureLocalStateMutationGuard(expectedOwnerId, request);
				} catch (error) {
					request.respond(false, void 0, {
						code: "UNAVAILABLE",
						message: String(error),
						details: { mutationAccepted: false }
					});
					return;
				}
				const { expectedOwnerId: _expectedOwnerId, ...input } = request.params;
				const previousGuard = request.sessionMutationCommitGuard;
				request = {
					...request,
					params: input,
					sessionMutationCommitGuard: () => {
						previousGuard?.();
						assertOwnerCurrent?.();
					}
				};
			}
			try {
				await store.runOperation(async () => {
					assertOwnerCurrent?.();
					if (method === "workboard.cards.attachments.add") assertUploadsAllowed(request.client);
					request.respond(true, await handler(request));
				});
			} catch (error) {
				respondError(request.respond, error);
			}
		};
		api.registerGatewayMethod(method, requestHandler, { scope });
		if (CLI_OWNER_METHODS.has(method)) api.registerGatewayMethod(`${method}.owner`, (request) => {
			if (typeof request.params?.expectedOwnerId !== "string" || !request.params.expectedOwnerId.trim()) {
				request.respond(false, void 0, {
					code: "INVALID_REQUEST",
					message: "expectedOwnerId is required",
					details: { mutationAccepted: false }
				});
				return;
			}
			return requestHandler(request);
		}, { scope });
	};
	const cardMutation = (method, mutate) => register(`workboard.cards.${method}`, WRITE_SCOPE, ({ params: input }) => redactCardResult(mutate(readId(input), input)));
	const prepareWorkspaceInput = async (request, value, kind) => {
		const input = withoutWorkboardWorkspaceAccess(value);
		const access = await resolveGatewayWorkspaceMutationAccess(request, input);
		return kind === "decompose" ? withWorkboardDecomposeWorkspaceAccess(input, access) : kind === "create" || containsWorkboardWorkspaceMutation(input) ? withWorkboardWorkspaceAccess(input, access) : input;
	};
	const dispatchCards = createWorkboardDispatchHandler({
		api,
		store
	});
	register("workboard.cards.list", READ_SCOPE, async ({ params: input }) => {
		const { sessionKey } = cardsListFilterSchema.parse(input);
		const result = await store.listCards(input.boardId, sessionKey);
		const since = input.sinceRevision;
		return isRecord(since) && since.epoch === result.revision.epoch && since.revision === result.revision.revision && since.boardId === result.revision.boardId && since.sessionKey === result.revision.sessionKey ? {
			unchanged: true,
			revision: result.revision
		} : result;
	});
	for (const method of ["create", "captureSession"]) register(`workboard.cards.${method}`, WRITE_SCOPE, async (request) => {
		const prepared = await prepareWorkspaceInput(request, request.params, "create");
		return redactCardResult(method === "create" ? store.create(prepared, void 0, request.sessionMutationCommitGuard) : store.captureSession(prepared));
	});
	register("workboard.cards.update", WRITE_SCOPE, async (request) => {
		const patch = await prepareWorkspaceInput(request, readPatch(request.params), "patch");
		const expectedUpdatedAt = readExpectedUpdatedAt(request.params);
		return redactCardResult(store.update(readId(request.params), patch, { expectedUpdatedAt }));
	});
	register("workboard.cards.start", WRITE_SCOPE, (request) => dispatchCards(request, {
		supportsMaxStarts: false,
		directCard: true
	}));
	register("workboard.cards.move", WRITE_SCOPE, ({ params: input, sessionMutationCommitGuard }) => redactCardResult(store.move(readId(input), input.status, input.position, void 0, {
		expectedUpdatedAt: readExpectedUpdatedAt(input),
		assertOwnerCurrent: sessionMutationCommitGuard
	})));
	register("workboard.cards.delete", WRITE_SCOPE, ({ params: input }) => store.delete(readId(input), { expectedUpdatedAt: readExpectedUpdatedAt(input) }));
	cardMutation("comment", (id, input) => store.addComment(id, input));
	cardMutation("link", (id, input) => store.addLink(id, input));
	register("workboard.cards.linkDependency", WRITE_SCOPE, ({ params: input }) => {
		const { parentId, childId } = input;
		if (typeof parentId !== "string" || typeof childId !== "string") throw new Error("parentId and childId are required.");
		return redactCardResult(store.linkCards(parentId, childId));
	});
	cardMutation("proof", (id, input) => store.addProof(id, input));
	cardMutation("artifact", (id, input) => store.addArtifact(id, input));
	register("workboard.cards.claim", WRITE_SCOPE, async ({ params: input }) => {
		const claimed = await store.claim(readId(input), input);
		return {
			...claimed,
			card: redactClaimToken(claimed.card)
		};
	});
	cardMutation("heartbeat", (id, input) => store.heartbeat(id, input));
	cardMutation("release", (id, input) => store.releaseClaim(id, input));
	cardMutation("promote", (id, input) => store.promote(id, input, null));
	cardMutation("reassign", (id, input) => store.reassign(id, input, null));
	cardMutation("reclaim", (id, input) => store.reclaim(id, input, null));
	cardMutation("complete", (id, input) => store.complete(id, input, null));
	cardMutation("block", (id, input) => store.block(id, input, null));
	cardMutation("unblock", (id) => store.unblock(id));
	register("workboard.cards.bulk", WRITE_SCOPE, async (request) => {
		const input = withoutWorkboardWorkspaceAccess(request.params);
		return { cards: (await store.bulkUpdate({
			...input,
			patch: await prepareWorkspaceInput(request, readPatch(request.params), "patch")
		})).cards.map(redactClaimToken) };
	});
	register("workboard.cards.diagnostics", READ_SCOPE, async () => redactDiagnosticsRows(await store.diagnostics()));
	register("workboard.cards.diagnostics.refresh", WRITE_SCOPE, async () => redactDiagnosticsRows(await store.refreshDiagnostics()));
	register("workboard.cards.dispatch", WRITE_SCOPE, (request) => dispatchCards(request, { supportsMaxStarts: false }));
	register("workboard.cards.dispatchWithOptions", WRITE_SCOPE, (request) => dispatchCards(request, { supportsMaxStarts: true }));
	register("workboard.boards.list", READ_SCOPE, () => store.listBoards());
	register("workboard.boards.upsert", WRITE_SCOPE, async (request) => {
		await resolveGatewayWorkspaceMutationAccess(request, request.params);
		return { board: await store.upsertBoard(request.params) };
	});
	const sessionsBoard = () => {
		if (!params.sessionsBoard) throw new Error("Sessions board service is unavailable.");
		return params.sessionsBoard;
	};
	register("workboard.sessionsBoard.read", READ_SCOPE, async (request) => {
		const result = await sessionsBoard().read(readToolStringParam(request.params, "boardId", { required: true }), sessionsBoardView(request.params), sessionsBoardCaller(request));
		const since = request.params.sinceRevision;
		return isRecord(since) && result.revision && since.epoch === result.revision.epoch && since.revision === result.revision.revision && since.boardId === result.revision.boardId && since.scope === result.revision.scope ? {
			unchanged: true,
			revision: result.revision
		} : result;
	});
	register("workboard.sessionsBoard.update", WRITE_SCOPE, async (request) => {
		const input = request.params;
		const boardId = readToolStringParam(input, "boardId", { required: true });
		if (!isRecord(input.patch)) throw new Error("patch must be an object.");
		return { board: await sessionsBoard().update(boardId, input.patch, sessionsBoardCaller(request)) };
	});
	register("workboard.sessionsBoard.move", WRITE_SCOPE, (request) => sessionsBoard().move(readToolStringParam(request.params, "boardId", { required: true }), readToolStringParam(request.params, "sessionKey", { required: true }), readToolStringParam(request.params, "columnId", { required: true }), sessionsBoardCaller(request)));
	register("workboard.boards.archive", WRITE_SCOPE, async ({ params: input }) => ({ board: await store.archiveBoard(input.id, input.archived) }));
	register("workboard.boards.delete", WRITE_SCOPE, ({ params: input }) => store.deleteBoard(input.id));
	register("workboard.cards.stats", READ_SCOPE, ({ params: input }) => store.stats({ boardId: input.boardId }));
	register("workboard.cards.runs", READ_SCOPE, async ({ params: input }) => {
		const result = await store.runs(readId(input));
		return {
			...result,
			card: redactClaimToken(result.card)
		};
	});
	register("workboard.cards.specify", WRITE_SCOPE, async (request) => {
		return redactCardResult(store.specify(readId(request.params), await prepareWorkspaceInput(request, request.params, "patch"), null));
	});
	register("workboard.cards.decompose", WRITE_SCOPE, async (request) => {
		const result = await store.decompose(readId(request.params), await prepareWorkspaceInput(request, request.params, "decompose"), null);
		return {
			parent: redactClaimToken(result.parent),
			children: result.children.map(redactClaimToken)
		};
	});
	register("workboard.notifications.subscribe", WRITE_SCOPE, async ({ params: input }) => ({ subscription: await store.subscribeNotifications(input) }));
	register("workboard.notifications.list", READ_SCOPE, ({ params: input }) => store.listNotificationSubscriptions(input));
	register("workboard.notifications.delete", WRITE_SCOPE, ({ params: input }) => store.deleteNotificationSubscription(readId(input)));
	register("workboard.notifications.events", READ_SCOPE, ({ params: input }) => {
		assertNoCursorAdvance(input);
		return store.notificationEvents(input);
	});
	register("workboard.notifications.advance", WRITE_SCOPE, ({ params: input }) => store.advanceNotificationEvents(input));
	register("workboard.cards.attachments.list", READ_SCOPE, async ({ params: input }) => {
		const result = await store.listAttachments(readId(input));
		return {
			...result,
			card: redactClaimToken(result.card)
		};
	});
	register("workboard.cards.attachments.get", READ_SCOPE, async ({ params: input }) => {
		const attachment = await store.getAttachment(readId(input));
		if (!attachment) throw new Error(`attachment not found: ${readId(input)}`);
		return attachment;
	});
	register("workboard.cards.attachments.add", WRITE_SCOPE, ({ params: input, client }) => redactCardResult(store.addAttachment(readId(input), input, void 0, () => assertUploadsAllowed(client))));
	register("workboard.cards.attachments.delete", WRITE_SCOPE, ({ params: input }) => {
		const attachmentId = input.attachmentId;
		if (typeof attachmentId !== "string" || !attachmentId.trim()) throw new Error("attachmentId is required.");
		return redactCardResult(store.deleteAttachment(readId(input), attachmentId.trim()));
	});
	cardMutation("workerLog", (id, input) => store.addWorkerLog(id, input));
	cardMutation("protocolViolation", (id, input) => store.recordProtocolViolation(id, input));
	register("workboard.cards.archive", WRITE_SCOPE, ({ params: input }) => redactCardResult(store.archive(readId(input), input.archived, { expectedUpdatedAt: readExpectedUpdatedAt(input) })));
	register("workboard.cards.export", READ_SCOPE, async () => {
		const exported = await store.exportCards();
		return {
			...exported,
			cards: exported.cards.map(redactClaimToken)
		};
	});
}
//#endregion
export { guardWorkboardToolsForWorkspaceAccess as _, WorkboardStore as a, resolveWorkboardAgentWorkspace as b, workboardCardSessionLookupKey as c, cardSessionKey as d, cleanupWorkboardCardWorktree as f, canonicalizeWorkboardWorkspaceAccess as g, WORKBOARD_SESSIONS_BOARD_TOOL_NAMES as h, dispatchAndStartWorkboardCards as i, cardBoardId as l, WORKBOARD_CARD_TOOL_NAMES as m, registerWorkboardStoreLifecycle as n, normalizeCappedStringList as o, isWorkboardWorktreeCleanupCandidate as p, resolveWorkboardSqliteWorkerModuleUrl as r, workboardCardMatchesLifecycleLink as s, registerWorkboardGatewayMethods as t, cardRunId as u, resolveAgentWorkboardWorkspaceRuntime as v, resolveCommandWorkboardWorkspaceAccess as y };
