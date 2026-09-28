import { M as resolveNonNegativeIntegerOption, g as isFutureDateTimestampMs, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { a as canonicalPathFromExistingAncestor, d as pathExists } from "./fs-safe-BAPek8At.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { O as listAgentIds, l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./file-access-runtime-CWjkXCju.mjs";
import "./agent-runtime-vMVS3kbD.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { a as WORKBOARD_EXECUTION_MODES, c as WORKBOARD_NOTIFICATION_KINDS, d as WORKBOARD_STATUSES, f as WORKBOARD_TEMPLATE_IDS, i as WORKBOARD_EVENT_KINDS, l as WORKBOARD_PRIORITIES, m as redactClaimToken, n as WORKBOARD_DIAGNOSTIC_KINDS, o as WORKBOARD_EXECUTION_STATUSES, p as isValidWorkboardBoardId, r as WORKBOARD_DIAGNOSTIC_SEVERITIES, s as WORKBOARD_LINK_TYPES, t as WORKBOARD_ATTEMPT_STATUSES, u as WORKBOARD_PROOF_STATUSES } from "./src-CMxcJXXp.mjs";
import { d as isWorkboardClaimReclaimable, f as secondsToDurationMs, i as MAX_ATTACHMENT_BYTES, m as workboardCardSlotOwner, n as DEFAULT_CLAIM_TTL_MS, o as MAX_CARD_METADATA_BYTES, p as workboardCardConsumesOwnerSlot, s as POSITION_STEP, u as addWorkboardDurationMs } from "./store-constants-DPYot7MP.mjs";
import { n as resolveWorkboardSqliteWorkerModuleUrl } from "./sqlite-store-paths-DMRV7j8G.mjs";
import { t as createWorkboardSqliteStores } from "./sqlite-store-B6FSvrep.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { createHash, randomUUID } from "node:crypto";
//#region extensions/workboard/src/workspace-access.ts
const WORKBOARD_TOOL_NAMES = [
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
async function assertCanonicalWorkboardPathAccess(candidate, access) {
	if (access.unrestricted) return candidate;
	for (const root of access.roots) {
		const canonicalRoot = await canonicalPathFromExistingAncestor(root);
		if (isPathInside(canonicalRoot, candidate)) return candidate;
	}
	throw new Error("workspace path is outside the caller's allowed workspaces.");
}
async function assertCanonicalWorkboardRootAccess(candidate, access) {
	if (access.unrestricted) return candidate;
	for (const root of access.roots) if (await canonicalPathFromExistingAncestor(root) === candidate) return candidate;
	throw new Error("workspace path must equal one of the caller's allowed workspace roots.");
}
async function assertPathAllowed(value, access) {
	if (typeof value !== "string" || !value.trim()) return;
	return await assertCanonicalWorkboardPathAccess(await canonicalPathFromExistingAncestor(value.trim()), access);
}
async function assertWorkspaceAllowed(value, access, options) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const workspace = value;
	if (options?.sourceOnly) return await assertPathAllowed(workspace.sourcePath ?? workspace.path, access);
	await assertPathAllowed(workspace.path, access);
	await assertPathAllowed(workspace.sourcePath, access);
}
function containsWorkboardWorkspaceMutation(value) {
	const record = asOptionalRecord(value);
	if (!record) return false;
	if (Object.hasOwn(record, "workspace") || Object.hasOwn(record, "defaultWorkspace")) return true;
	return containsWorkboardWorkspaceMutation(record.patch) || containsWorkboardWorkspaceMutation(asOptionalRecord(record.metadata)?.automation) || Array.isArray(record.children) && record.children.some((child) => containsWorkboardWorkspaceMutation(child));
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
	const record = asOptionalRecord(value);
	if (!record) return;
	await assertWorkspaceAllowed(record.workspace, access);
	await assertWorkspaceAllowed(record.defaultWorkspace, access);
	const patch = asOptionalRecord(record.patch);
	if (patch) await assertWorkboardWorkspaceMutationAccess(patch, access);
	const metadata = asOptionalRecord(record.metadata);
	const automation = asOptionalRecord(metadata?.automation);
	if (automation) await assertWorkboardWorkspaceMutationAccess(automation, access);
	if (Array.isArray(record.children)) for (const child of record.children) await assertWorkboardWorkspaceMutationAccess(child, access);
}
async function assertWorkboardWorkspaceSourceAccess(workspace, access) {
	return await assertWorkspaceAllowed(workspace, access, { sourceOnly: true });
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
//#region extensions/workboard/src/workspace-path.ts
function isAbsoluteWorkspacePath(value) {
	return value.startsWith("/") || /^[A-Za-z]:[\\/]/.test(value) || /^\\\\[^\\]+\\[^\\]+/.test(value);
}
//#endregion
//#region extensions/workboard/src/store-normalizers.ts
function normalizeBoardId(value, fallback) {
	const raw = normalizeBoundedString(value, fallback, 80, "board id");
	if (!raw) return;
	const boardId = raw.toLowerCase();
	if (!isValidWorkboardBoardId(boardId)) throw new Error("board id must match [a-z0-9][a-z0-9._-]{0,79}.");
	return boardId;
}
function normalizeBoardIdRequired(value) {
	return normalizeBoardId(value) ?? "default";
}
function normalizeBoardMetadata(input, fallback, now = Date.now()) {
	const id = normalizeBoardId(input.id, fallback?.id) ?? "default";
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
	const autoDecomposePerDispatch = typeof record.autoDecomposePerDispatch === "number" && Number.isFinite(record.autoDecomposePerDispatch) ? Math.max(1, Math.min(20, Math.trunc(record.autoDecomposePerDispatch))) : fallback?.autoDecomposePerDispatch;
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
function normalizeNotificationKinds(value) {
	if (value == null) return;
	const entries = typeof value === "string" ? value.split(",") : Array.isArray(value) ? value : [];
	const kinds = [];
	for (const entry of entries) {
		const kind = typeof entry === "string" ? entry.trim() : "";
		if (!WORKBOARD_NOTIFICATION_KINDS.includes(kind)) throw new Error(`notification kind must be one of: ${WORKBOARD_NOTIFICATION_KINDS.join(", ")}.`);
		const notificationKind = kind;
		if (!kinds.includes(notificationKind)) kinds.push(notificationKind);
	}
	return kinds.length ? kinds : void 0;
}
function normalizeNotificationSubscription(input, fallback, now = Date.now()) {
	const boardId = normalizeBoardId(input.boardId, fallback?.boardId) ?? "default";
	const cardId = normalizeBoundedString(input.cardId, fallback?.cardId, 120, "card id");
	const sessionKey = normalizeBoundedString(input.sessionKey, fallback?.sessionKey, 240, "session key");
	const runId = normalizeBoundedString(input.runId, fallback?.runId, 160, "run id");
	const target = normalizeBoundedString(input.target, fallback?.target, 240, "notification target");
	if (!cardId && !sessionKey && !runId && !target) throw new Error("notification subscription needs cardId, sessionKey, runId, or target.");
	const eventKinds = normalizeNotificationKinds(input.eventKinds);
	const preservedFields = {};
	if (fallback) {
		if (fallback.lastEventAt) preservedFields.lastEventAt = fallback.lastEventAt;
		if (fallback.lastEventId) preservedFields.lastEventId = fallback.lastEventId;
		if (fallback.lastEventSequence) preservedFields.lastEventSequence = fallback.lastEventSequence;
		if (fallback.deliveredEventIds?.length) preservedFields.deliveredEventIds = fallback.deliveredEventIds;
	}
	return {
		id: fallback?.id ?? randomUUID(),
		boardId,
		...cardId ? { cardId } : {},
		...sessionKey ? { sessionKey } : {},
		...runId ? { runId } : {},
		...target ? { target } : {},
		...eventKinds ? { eventKinds } : {},
		...preservedFields,
		createdAt: fallback?.createdAt ?? now,
		updatedAt: now
	};
}
function normalizeTitle(value) {
	const title = normalizeOptionalString(value);
	if (!title) throw new Error("title is required.");
	if (title.length > 180) throw new Error("title must be 180 characters or fewer.");
	return title;
}
function normalizeNotes(value) {
	const notes = normalizeOptionalString(value);
	if (!notes) return;
	if (notes.length > 4e3) throw new Error("notes must be 4000 characters or fewer.");
	return notes;
}
function normalizeBoundedString(value, fallback, maxLength, fieldName) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return fallback;
	if (normalized.length > maxLength) throw new Error(`${fieldName} must be ${maxLength} characters or fewer (got ${normalized.length}).`);
	return normalized;
}
function capText(value, max) {
	if (!value) return;
	return value.length <= max ? value : `${truncateUtf16Safe(value, Math.max(0, max - 1))}…`;
}
function normalizeStatus(value, fallback) {
	if (typeof value !== "string" || !value.trim()) return fallback;
	if (WORKBOARD_STATUSES.includes(value)) return value;
	throw new Error(`status must be one of: ${WORKBOARD_STATUSES.join(", ")}.`);
}
function normalizePriority(value, fallback) {
	if (typeof value !== "string" || !value.trim()) return fallback;
	if (WORKBOARD_PRIORITIES.includes(value)) return value;
	throw new Error(`priority must be one of: ${WORKBOARD_PRIORITIES.join(", ")}.`);
}
function normalizeLabels(value, fallback = []) {
	if (value == null) return fallback;
	const entries = typeof value === "string" ? value.split(",") : Array.isArray(value) ? value : void 0;
	if (!entries) throw new Error("labels must be an array or comma-separated string.");
	const labels = [];
	for (const entry of entries) {
		const label = normalizeOptionalString(entry);
		if (!label || labels.includes(label)) continue;
		if (label.length > 40) throw new Error("labels must be 40 characters or fewer.");
		labels.push(label);
		if (labels.length >= 12) break;
	}
	return labels;
}
function normalizeStringList(value, fieldName, maxLength = 80) {
	if (value == null) return [];
	const entries = typeof value === "string" ? value.split(",") : Array.isArray(value) ? value : void 0;
	if (!entries) throw new Error(`${fieldName} must be an array or comma-separated string.`);
	const values = [];
	for (const entry of entries) {
		if (Array.isArray(value) && typeof entry !== "string") throw new Error(`${fieldName} entries must be strings.`);
		const normalized = normalizeBoundedString(entry, void 0, maxLength, fieldName);
		if (normalized && !values.includes(normalized)) values.push(normalized);
		if (values.length > 20) throw new Error(`${fieldName} supports at most 20 entries.`);
	}
	return values;
}
function normalizePosition(value, fallback) {
	return resolveNonNegativeIntegerOption(value, fallback);
}
function normalizePositiveInteger(value, fieldName) {
	if (value == null || value === "") return;
	if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${fieldName} must be a number.`);
	return Math.max(1, Math.trunc(value));
}
function normalizeWorkspace(value, fallback) {
	if (!isRecord(value)) return fallback;
	const record = value;
	const kind = record.kind === "scratch" || record.kind === "dir" || record.kind === "worktree" ? record.kind : fallback?.kind;
	if (!kind) throw new Error("workspace kind must be scratch, dir, or worktree.");
	const workspacePath = normalizeBoundedString(record.path, fallback?.path, 2e3, "workspace path");
	if (kind === "dir" && (!workspacePath || !isAbsoluteWorkspacePath(workspacePath))) throw new Error("dir workspace path must be absolute.");
	const workspaceFallback = workspacePath === fallback?.path ? fallback : void 0;
	const branch = normalizeBoundedString(record.branch, workspaceFallback?.branch, 160, "workspace branch");
	const sourcePath = normalizeBoundedString(record.sourcePath, workspaceFallback?.sourcePath, 2e3, "workspace source path");
	if (sourcePath && !isAbsoluteWorkspacePath(sourcePath)) throw new Error("workspace source path must be absolute.");
	const sourceBranch = normalizeBoundedString(record.sourceBranch, workspaceFallback?.sourceBranch, 160, "workspace source branch");
	return {
		kind,
		...workspacePath ? { path: workspacePath } : {},
		...branch ? { branch } : {},
		...kind === "worktree" && sourcePath ? { sourcePath } : {},
		...kind === "worktree" && sourceBranch ? { sourceBranch } : {}
	};
}
function normalizeAutomation(value, fallback = {}, options = {}) {
	const record = isRecord(value) ? value : {};
	const tenant = normalizeBoundedString(record.tenant, fallback.tenant, 80, "tenant");
	const boardId = Object.hasOwn(record, "boardId") ? normalizeBoardId(record.boardId, fallback.boardId) : fallback.boardId;
	const createdByCardId = normalizeBoundedString(record.createdByCardId, fallback.createdByCardId, 120, "created by card id");
	const idempotencyKey = normalizeBoundedString(record.idempotencyKey, fallback.idempotencyKey, 160, "idempotency key");
	const summary = normalizeBoundedString(record.summary, fallback.summary, 2e3, "summary");
	const skills = Object.hasOwn(record, "skills") ? normalizeStringList(record.skills, "skills") : fallback.skills;
	const createdCardIds = Object.hasOwn(record, "createdCardIds") ? normalizeStringList(record.createdCardIds, "created card ids", 120) : fallback.createdCardIds;
	const scheduledAt = Object.hasOwn(record, "scheduledAt") ? normalizeTimestamp(record.scheduledAt, 0) || void 0 : fallback.scheduledAt;
	const maxRuntimeSeconds = Object.hasOwn(record, "maxRuntimeSeconds") ? normalizePositiveInteger(record.maxRuntimeSeconds, "max runtime seconds") : fallback.maxRuntimeSeconds;
	const maxRetries = Object.hasOwn(record, "maxRetries") ? normalizePositiveInteger(record.maxRetries, "max retries") : fallback.maxRetries;
	const dispatchCount = Object.hasOwn(record, "dispatchCount") ? normalizeTimestamp(record.dispatchCount, 0) || void 0 : fallback.dispatchCount;
	const lastDispatchAt = Object.hasOwn(record, "lastDispatchAt") ? normalizeTimestamp(record.lastDispatchAt, 0) || void 0 : fallback.lastDispatchAt;
	const workspace = Object.hasOwn(record, "workspace") ? normalizeWorkspace(record.workspace, fallback.workspace) : fallback.workspace;
	const workspaceAccess = fallback.workspaceAccess;
	const launch = normalizeLaunchState(options.allowLaunchState && Object.hasOwn(record, "launch") ? record.launch : fallback.launch);
	const next = removeUndefinedAutomationFields({
		...tenant ? { tenant } : {},
		...boardId ? { boardId } : {},
		...createdByCardId ? { createdByCardId } : {},
		...idempotencyKey ? { idempotencyKey } : {},
		...skills?.length ? { skills } : {},
		...workspace ? { workspace } : {},
		...workspaceAccess ? { workspaceAccess } : {},
		...maxRuntimeSeconds ? { maxRuntimeSeconds } : {},
		...maxRetries ? { maxRetries } : {},
		...scheduledAt ? { scheduledAt } : {},
		...summary ? { summary } : {},
		...createdCardIds?.length ? { createdCardIds } : {},
		...dispatchCount ? { dispatchCount } : {},
		...lastDispatchAt ? { lastDispatchAt } : {},
		...launch ? { launch } : {}
	});
	return Object.keys(next).length ? next : void 0;
}
function normalizeLaunchTimestamp(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.trunc(value) : void 0;
}
function normalizeLaunchString(value, maxLength) {
	const normalized = normalizeOptionalString(value);
	return normalized && normalized.length <= maxLength ? normalized : void 0;
}
function normalizeLaunchState(value) {
	if (!isRecord(value)) return;
	const requestedSessionKey = normalizeLaunchString(value.requestedSessionKey, 240);
	const provisionalRunId = normalizeLaunchString(value.provisionalRunId, 160);
	const preparedAt = normalizeLaunchTimestamp(value.preparedAt);
	if (!requestedSessionKey || !provisionalRunId || preparedAt === void 0) return;
	const identity = {
		requestedSessionKey,
		provisionalRunId,
		preparedAt
	};
	if (value.phase === "prepared") return {
		phase: "prepared",
		...identity
	};
	if (value.phase === "accepted") {
		const acceptedAt = normalizeLaunchTimestamp(value.acceptedAt);
		const acceptedSessionKey = normalizeLaunchString(value.acceptedSessionKey, 240);
		const acceptedRunId = normalizeLaunchString(value.acceptedRunId, 160);
		return acceptedAt === void 0 || !acceptedSessionKey ? void 0 : {
			phase: "accepted",
			...identity,
			acceptedAt,
			acceptedSessionKey,
			...acceptedRunId ? { acceptedRunId } : {}
		};
	}
	if (value.phase === "failed") {
		const failedAt = normalizeLaunchTimestamp(value.failedAt);
		const reason = normalizeLaunchString(value.reason, 800);
		return failedAt === void 0 || !reason ? void 0 : {
			phase: "failed",
			...identity,
			failedAt,
			reason
		};
	}
}
function deriveChildIdempotencyKey(parentKey, index) {
	if (!parentKey) return;
	const key = `${parentKey}:child:${index}`;
	return key.length <= 160 ? key : void 0;
}
function normalizeEnumValue(value, allowed, fallback) {
	return typeof value === "string" && allowed.includes(value) ? value : fallback;
}
function normalizeLinkType(value, fallback) {
	return normalizeEnumValue(value, WORKBOARD_LINK_TYPES, fallback);
}
function normalizeTemplateId(value) {
	return normalizeEnumValue(value, WORKBOARD_TEMPLATE_IDS, void 0);
}
function normalizeTimestamp(value, fallback) {
	return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : fallback;
}
function normalizeEvent(value) {
	if (!isRecord(value)) return null;
	const record = value;
	const id = normalizeOptionalString(record.id);
	const kind = normalizeEnumValue(record.kind, WORKBOARD_EVENT_KINDS, void 0);
	const at = normalizeTimestamp(record.at, 0);
	if (!id || !kind || !at) return null;
	const fromStatus = normalizeEnumValue(record.fromStatus, WORKBOARD_STATUSES, void 0);
	const toStatus = normalizeEnumValue(record.toStatus, WORKBOARD_STATUSES, void 0);
	const sessionKey = normalizeOptionalString(record.sessionKey);
	const runId = normalizeOptionalString(record.runId);
	return {
		id,
		kind,
		at,
		...fromStatus ? { fromStatus } : {},
		...toStatus ? { toStatus } : {},
		...sessionKey ? { sessionKey } : {},
		...runId ? { runId } : {}
	};
}
function normalizeEvents(value) {
	if (!Array.isArray(value)) return [];
	return value.map(normalizeEvent).filter((event) => event !== null).slice(-50);
}
function normalizeAttempt(value) {
	if (!isRecord(value)) return null;
	const record = value;
	const id = normalizeOptionalString(record.id);
	const startedAt = normalizeTimestamp(record.startedAt, 0);
	if (!id || !startedAt) return null;
	const endedAt = normalizeTimestamp(record.endedAt, 0);
	const sessionKey = normalizeOptionalString(record.sessionKey);
	const runId = normalizeOptionalString(record.runId);
	const error = normalizeBoundedString(record.error, void 0, 800, "attempt error");
	const engine = normalizeBoundedString(record.engine, void 0, 160, "attempt engine");
	const model = normalizeBoundedString(record.model, void 0, 160, "attempt model");
	return {
		id,
		status: normalizeEnumValue(record.status, WORKBOARD_ATTEMPT_STATUSES, "running"),
		startedAt,
		...endedAt ? { endedAt } : {},
		...engine ? { engine } : {},
		...typeof record.mode === "string" && WORKBOARD_EXECUTION_MODES.includes(record.mode) ? { mode: record.mode } : {},
		...model ? { model } : {},
		...sessionKey ? { sessionKey } : {},
		...runId ? { runId } : {},
		...error ? { error } : {}
	};
}
function normalizeComment(value) {
	if (!isRecord(value)) return null;
	const record = value;
	const id = normalizeOptionalString(record.id);
	const body = normalizeBoundedString(record.body, void 0, 2e3, "comment body");
	const createdAt = normalizeTimestamp(record.createdAt, 0);
	if (!id || !body || !createdAt) return null;
	const updatedAt = normalizeTimestamp(record.updatedAt, 0);
	return {
		id,
		body,
		createdAt,
		...updatedAt ? { updatedAt } : {}
	};
}
function normalizeLink(value) {
	if (!isRecord(value)) return null;
	const record = value;
	const id = normalizeOptionalString(record.id);
	const createdAt = normalizeTimestamp(record.createdAt, 0);
	if (!id || !createdAt) return null;
	const targetCardId = normalizeBoundedString(record.targetCardId, void 0, 120, "link target");
	const title = normalizeBoundedString(record.title, void 0, 180, "link title");
	const url = normalizeBoundedString(record.url, void 0, 2e3, "link URL");
	if (!targetCardId && !url) return null;
	return {
		id,
		type: normalizeLinkType(record.type, "relates_to"),
		createdAt,
		...targetCardId ? { targetCardId } : {},
		...title ? { title } : {},
		...url ? { url } : {}
	};
}
function isDependencyLink(link) {
	return link.type === "parent" || link.type === "child";
}
function normalizeProof(value) {
	if (!isRecord(value)) return null;
	const record = value;
	const id = normalizeOptionalString(record.id);
	const createdAt = normalizeTimestamp(record.createdAt, 0);
	if (!id || !createdAt) return null;
	const label = normalizeBoundedString(record.label, void 0, 160, "proof label");
	const command = normalizeBoundedString(record.command, void 0, 1e3, "proof command");
	const url = normalizeBoundedString(record.url, void 0, 2e3, "proof URL");
	const note = normalizeBoundedString(record.note, void 0, 2e3, "proof note");
	return {
		id,
		status: normalizeEnumValue(record.status, WORKBOARD_PROOF_STATUSES, "unknown"),
		createdAt,
		...label ? { label } : {},
		...command ? { command } : {},
		...url ? { url } : {},
		...note ? { note } : {}
	};
}
function normalizeArtifact(value) {
	if (!isRecord(value)) return null;
	const record = value;
	const id = normalizeOptionalString(record.id) ?? randomUUID();
	const createdAt = normalizeTimestamp(record.createdAt, Date.now());
	const label = normalizeBoundedString(record.label, void 0, 160, "artifact label");
	const url = normalizeBoundedString(record.url, void 0, 2e3, "artifact URL");
	const artifactPath = normalizeBoundedString(record.path, void 0, 2e3, "artifact path");
	const mimeType = normalizeBoundedString(record.mimeType, void 0, 160, "artifact MIME type");
	if (!url && !artifactPath) return null;
	return {
		id,
		createdAt,
		...label ? { label } : {},
		...url ? { url } : {},
		...artifactPath ? { path: artifactPath } : {},
		...mimeType ? { mimeType } : {}
	};
}
function normalizeAttachment(value) {
	if (!isRecord(value)) return null;
	const record = value;
	const id = normalizeOptionalString(record.id);
	const cardId = normalizeBoundedString(record.cardId, void 0, 120, "card id");
	const fileName = normalizeBoundedString(record.fileName, void 0, 240, "attachment file name");
	const createdAt = normalizeTimestamp(record.createdAt, 0);
	const byteSize = typeof record.byteSize === "number" && Number.isFinite(record.byteSize) ? Math.max(0, Math.trunc(record.byteSize)) : 0;
	if (!id || !cardId || !fileName || !createdAt || byteSize <= 0) return null;
	const mimeType = normalizeBoundedString(record.mimeType, void 0, 160, "attachment MIME type");
	const note = normalizeBoundedString(record.note, void 0, 400, "attachment note");
	return {
		id,
		cardId,
		createdAt,
		fileName,
		byteSize,
		...mimeType ? { mimeType } : {},
		...note ? { note } : {}
	};
}
function normalizeWorkerLog(value) {
	if (!isRecord(value)) return null;
	const record = value;
	const id = normalizeOptionalString(record.id);
	const message = normalizeBoundedString(record.message, void 0, 800, "worker log message");
	const createdAt = normalizeTimestamp(record.createdAt, 0);
	if (!id || !message || !createdAt) return null;
	const level = record.level === "warning" || record.level === "error" || record.level === "info" ? record.level : "info";
	const sessionKey = normalizeBoundedString(record.sessionKey, void 0, 240, "session key");
	const runId = normalizeBoundedString(record.runId, void 0, 160, "run id");
	return {
		id,
		level,
		message,
		createdAt,
		...sessionKey ? { sessionKey } : {},
		...runId ? { runId } : {}
	};
}
function normalizeWorkerProtocol(value, fallback) {
	if (!isRecord(value)) return fallback;
	const record = value;
	const state = normalizeEnumValue(record.state, [
		"idle",
		"running",
		"completed",
		"blocked",
		"violated"
	], fallback?.state);
	if (!state) return;
	const updatedAt = normalizeTimestamp(record.updatedAt, fallback?.updatedAt ?? Date.now());
	const detail = normalizeBoundedString(record.detail, fallback?.detail, 800, "protocol detail");
	return {
		state,
		updatedAt,
		...detail ? { detail } : {}
	};
}
function normalizeAttachmentInput(cardId, input, now) {
	const fileName = normalizeBoundedString(input.fileName, void 0, 240, "attachment file name");
	if (!fileName) throw new Error("attachment fileName is required.");
	const contentBase64 = typeof input.contentBase64 === "string" && input.contentBase64 ? input.contentBase64 : void 0;
	if (!contentBase64) throw new Error("attachment contentBase64 is required.");
	if (!/^[A-Za-z0-9+/]*={0,2}$/.test(contentBase64) || contentBase64.length % 4 !== 0 || contentBase64.length > Math.ceil(262144 / 3) * 4) throw new Error("attachment contentBase64 must be canonical base64.");
	const decoded = Buffer.from(contentBase64, "base64");
	if (decoded.toString("base64") !== contentBase64) throw new Error("attachment contentBase64 must be canonical base64.");
	const byteSize = decoded.length;
	if (byteSize <= 0 || byteSize > 262144) throw new Error(`attachment must be between 1 and ${MAX_ATTACHMENT_BYTES} bytes.`);
	const mimeType = normalizeBoundedString(input.mimeType, void 0, 160, "attachment MIME type");
	const note = normalizeBoundedString(input.note, void 0, 400, "attachment note");
	return {
		attachment: {
			id: randomUUID(),
			cardId,
			createdAt: now,
			fileName,
			byteSize,
			...mimeType ? { mimeType } : {},
			...note ? { note } : {}
		},
		contentBase64
	};
}
function normalizeClaim(value, fallback) {
	if (!isRecord(value)) return fallback;
	const record = value;
	const ownerId = normalizeBoundedString(record.ownerId, fallback?.ownerId, 120, "claim owner");
	const token = normalizeBoundedString(record.token, fallback?.token, 160, "claim token");
	const claimedAt = normalizeTimestamp(record.claimedAt, fallback?.claimedAt ?? Date.now());
	const lastHeartbeatAt = normalizeTimestamp(record.lastHeartbeatAt, fallback?.lastHeartbeatAt ?? claimedAt);
	const expiresAt = normalizeTimestamp(record.expiresAt, fallback?.expiresAt ?? 0);
	if (!ownerId || !token || !claimedAt || !lastHeartbeatAt) return;
	return {
		ownerId,
		token,
		claimedAt,
		lastHeartbeatAt,
		...expiresAt ? { expiresAt } : {}
	};
}
function normalizeDiagnosticAction(value) {
	if (!isRecord(value)) return null;
	const record = value;
	const kind = record.kind === "claim" || record.kind === "unblock" || record.kind === "reassign" || record.kind === "add_proof" || record.kind === "open_session" ? record.kind : void 0;
	const label = normalizeBoundedString(record.label, void 0, 120, "diagnostic action label");
	return kind && label ? {
		kind,
		label
	} : null;
}
function normalizeDiagnostic(value) {
	if (!isRecord(value)) return null;
	const record = value;
	const kind = normalizeEnumValue(record.kind, WORKBOARD_DIAGNOSTIC_KINDS, void 0);
	const severity = normalizeEnumValue(record.severity, WORKBOARD_DIAGNOSTIC_SEVERITIES, "warning");
	const title = normalizeBoundedString(record.title, void 0, 160, "diagnostic title");
	const detail = normalizeBoundedString(record.detail, void 0, 800, "diagnostic detail");
	const firstSeenAt = normalizeTimestamp(record.firstSeenAt, Date.now());
	const lastSeenAt = normalizeTimestamp(record.lastSeenAt, firstSeenAt);
	if (!kind || !title || !detail) return null;
	return {
		kind,
		severity,
		title,
		detail,
		firstSeenAt,
		lastSeenAt,
		count: typeof record.count === "number" && Number.isFinite(record.count) ? Math.max(1, Math.trunc(record.count)) : 1,
		actions: Array.isArray(record.actions) ? record.actions.map(normalizeDiagnosticAction).filter((action) => action !== null).slice(0, 4) : []
	};
}
function normalizeNotification(value) {
	if (!isRecord(value)) return null;
	const record = value;
	const id = normalizeOptionalString(record.id) ?? randomUUID();
	const kind = normalizeEnumValue(record.kind, WORKBOARD_NOTIFICATION_KINDS, void 0);
	const createdAt = normalizeTimestamp(record.createdAt, Date.now());
	const sequence = normalizeTimestamp(record.sequence, 0) || void 0;
	const message = capText(normalizeOptionalString(record.message), 240);
	if (!kind || !message) return null;
	const sessionKey = normalizeBoundedString(record.sessionKey, void 0, 240, "session key");
	const runId = normalizeBoundedString(record.runId, void 0, 120, "run id");
	return {
		id,
		kind,
		createdAt,
		...sequence ? { sequence } : {},
		message,
		...sessionKey ? { sessionKey } : {},
		...runId ? { runId } : {}
	};
}
function normalizeProofInput(input, now) {
	const label = normalizeBoundedString(input.label, void 0, 160, "proof label");
	const command = normalizeBoundedString(input.command, void 0, 1e3, "proof command");
	const url = normalizeBoundedString(input.url, void 0, 2e3, "proof URL");
	const note = normalizeBoundedString(input.note, void 0, 2e3, "proof note");
	return {
		id: randomUUID(),
		status: normalizeEnumValue(input.status, WORKBOARD_PROOF_STATUSES, "unknown"),
		createdAt: now,
		...label ? { label } : {},
		...command ? { command } : {},
		...url ? { url } : {},
		...note ? { note } : {}
	};
}
function completionProofConflicts(existing, completion) {
	return [
		"label",
		"command",
		"url",
		"note"
	].some((field) => completion[field] !== void 0 && completion[field] !== existing[field]);
}
function appendCompletionProof(existing, proof, proofId) {
	const entries = [...existing ?? []];
	if (!proofId) return proof ? [...entries, proof].slice(-40) : entries;
	const index = entries.findIndex((entry) => entry.id === proofId);
	const pending = index >= 0 ? entries[index] : void 0;
	if (!pending) throw new Error(`proof not found: ${proofId}`);
	const completionProof = proof ?? pending;
	if (completionProof.status === "unknown") throw new Error(proof ? "completion proof status must be passed, failed, or skipped." : "proof is required to resolve a pending proof.");
	if (completionProofConflicts(pending, completionProof)) throw new Error(`completion proof does not match pending proof: ${proofId}`);
	if (pending.status !== "unknown" && pending.status !== completionProof.status) throw new Error(`completion proof status does not match existing proof: ${proofId}`);
	if (pending.status === "unknown") entries[index] = {
		...pending,
		status: completionProof.status
	};
	return entries.slice(-40);
}
function normalizeList(value, normalize, limit, fallback) {
	return Array.isArray(value) ? value.map(normalize).filter((entry) => entry !== null).slice(-limit) : fallback;
}
function normalizeMetadata(value, fallback = {}, options = {}) {
	if (!isRecord(value)) return trimMetadataToBudget(fallback, options);
	const record = value;
	const stale = record.stale && typeof record.stale === "object" && !Array.isArray(record.stale) ? record.stale : null;
	const hasArchivedAt = Object.hasOwn(record, "archivedAt") && options.allowArchivedAt !== false;
	const hasStale = Object.hasOwn(record, "stale");
	const hasLifecycleStatusSourceUpdatedAt = Object.hasOwn(record, "lifecycleStatusSourceUpdatedAt");
	const links = Array.isArray(record.links) ? record.links.map(normalizeLink).filter((link) => link !== null) : void 0;
	const normalizedLinks = links === void 0 ? fallback.links : options.allowDependencyLinks === false ? (() => {
		const dependencyLinks = (fallback.links ?? []).filter(isDependencyLink);
		const ordinaryCapacity = Math.max(0, 50 - dependencyLinks.length);
		return [...dependencyLinks.slice(-50), ...ordinaryCapacity > 0 ? links.filter((link) => !isDependencyLink(link)).slice(-ordinaryCapacity) : []];
	})() : links.slice(-50);
	return trimMetadataToBudget({
		attempts: normalizeList(record.attempts, normalizeAttempt, 30, fallback.attempts),
		comments: normalizeList(record.comments, normalizeComment, 50, fallback.comments),
		links: normalizedLinks,
		proof: normalizeList(record.proof, normalizeProof, 40, fallback.proof),
		artifacts: normalizeList(record.artifacts, normalizeArtifact, 40, fallback.artifacts),
		attachments: normalizeList(record.attachments, normalizeAttachment, 20, fallback.attachments),
		workerLogs: normalizeList(record.workerLogs, normalizeWorkerLog, 40, fallback.workerLogs),
		workerProtocol: Object.hasOwn(record, "workerProtocol") ? normalizeWorkerProtocol(record.workerProtocol, fallback.workerProtocol) : fallback.workerProtocol,
		automation: normalizeAutomation(Object.hasOwn(record, "automation") ? record.automation : {}, fallback.automation, { allowLaunchState: options.allowAutomationLaunch }),
		claim: Object.hasOwn(record, "claim") ? record.claim ? normalizeClaim(record.claim, fallback.claim) : void 0 : fallback.claim,
		diagnostics: normalizeList(record.diagnostics, normalizeDiagnostic, 12, fallback.diagnostics),
		notifications: normalizeList(record.notifications, normalizeNotification, 20, fallback.notifications),
		templateId: normalizeTemplateId(record.templateId) ?? fallback.templateId,
		archivedAt: hasArchivedAt ? normalizeTimestamp(record.archivedAt, 0) || void 0 : fallback.archivedAt,
		stale: hasStale ? stale ? {
			detectedAt: normalizeTimestamp(stale.detectedAt, Date.now()),
			lastSessionUpdatedAt: normalizeTimestamp(stale.lastSessionUpdatedAt, 0) || void 0,
			reason: normalizeBoundedString(stale.reason, fallback.stale?.reason, 240, "stale reason") ?? "Session has not reported recent activity."
		} : void 0 : fallback.stale,
		lifecycleStatusSourceUpdatedAt: hasLifecycleStatusSourceUpdatedAt ? normalizeTimestamp(record.lifecycleStatusSourceUpdatedAt, 0) : fallback.lifecycleStatusSourceUpdatedAt,
		failureCount: typeof record.failureCount === "number" && Number.isFinite(record.failureCount) ? Math.max(0, Math.trunc(record.failureCount)) : fallback.failureCount
	}, options);
}
function normalizeExecution(value) {
	if (!isRecord(value)) return;
	const record = value;
	const now = Date.now();
	const engine = normalizeBoundedString(record.engine, void 0, 160, "execution engine");
	const model = normalizeBoundedString(record.model, void 0, 160, "execution model");
	const normalizedId = normalizeOptionalString(record.id);
	const sessionKey = normalizeOptionalString(record.sessionKey);
	const runId = normalizeOptionalString(record.runId);
	if (!normalizedId && !engine && !model && !sessionKey && !runId) return;
	const id = normalizedId ?? randomUUID();
	const startedAt = normalizeTimestamp(record.startedAt, now);
	const updatedAt = normalizeTimestamp(record.updatedAt, startedAt);
	return {
		id,
		kind: "agent-session",
		mode: normalizeEnumValue(record.mode, WORKBOARD_EXECUTION_MODES, "autonomous"),
		status: normalizeEnumValue(record.status, WORKBOARD_EXECUTION_STATUSES, "idle"),
		startedAt,
		updatedAt,
		...engine ? { engine } : {},
		...model ? { model } : {},
		...sessionKey ? { sessionKey } : {},
		...runId ? { runId } : {}
	};
}
function syncExecutionSessionKey(execution, sessionKey) {
	if (!execution) return;
	return removeUndefinedExecutionFields({
		...execution,
		sessionKey,
		updatedAt: Date.now()
	});
}
function removeUndefinedExecutionFields(execution) {
	const next = { ...execution };
	for (const key of [
		"engine",
		"model",
		"sessionKey",
		"runId"
	]) if (next[key] === void 0) delete next[key];
	return next;
}
function removeUndefinedAutomationFields(automation) {
	const next = { ...automation };
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
		"scheduledAt",
		"summary",
		"createdCardIds",
		"dispatchCount",
		"lastDispatchAt",
		"launch"
	]) {
		const value = next[key];
		if (value === void 0 || Array.isArray(value) && value.length === 0 || typeof value === "object" && value !== null && Object.keys(value).length === 0) delete next[key];
	}
	return next;
}
function removeUndefinedMetadataFields(metadata) {
	const next = { ...metadata };
	for (const key of [
		"attempts",
		"comments",
		"links",
		"proof",
		"artifacts",
		"attachments",
		"workerLogs",
		"workerProtocol",
		"automation",
		"claim",
		"diagnostics",
		"notifications",
		"templateId",
		"archivedAt",
		"stale",
		"lifecycleStatusSourceUpdatedAt",
		"failureCount"
	]) {
		const value = next[key];
		if (value === void 0 || Array.isArray(value) && value.length === 0 || typeof value === "number" && value === 0 && key === "failureCount") delete next[key];
	}
	return next;
}
function clearDiagnostics(metadata, kinds) {
	if (!metadata?.diagnostics) return metadata ?? {};
	return {
		...metadata,
		diagnostics: metadata.diagnostics.filter((entry) => !kinds.includes(entry.kind))
	};
}
function metadataIsEmpty(metadata) {
	return !metadata || Object.keys(metadata).length === 0;
}
function metadataByteSize(metadata) {
	return Buffer.byteLength(JSON.stringify(metadata), "utf8");
}
function dropFirst(items) {
	if (!items?.length) return;
	const next = items.slice(1);
	return next.length ? next : void 0;
}
function dropFirstProofExcept(items, preserveProofId) {
	if (!items?.length) return;
	const index = preserveProofId ? items.findIndex((proof) => proof.id !== preserveProofId) : 0;
	if (index < 0) return items.slice();
	const next = items.filter((_, itemIndex) => itemIndex !== index);
	return next.length ? next : void 0;
}
function dropFirstNonDependencyLink(items) {
	if (!items?.length) return;
	const index = items.findIndex((link) => !isDependencyLink(link));
	if (index < 0) return items.slice();
	const next = items.filter((_, itemIndex) => itemIndex !== index);
	return next.length ? next : void 0;
}
function appendLinkPreservingDependencies(links, link) {
	const next = [...links, link];
	if (next.length <= 50) return next;
	const dropIndex = next.findIndex((entry) => !isDependencyLink(entry));
	if (dropIndex < 0 || dropIndex === next.length - 1) throw new Error("card link limit reached.");
	return next.filter((_, index) => index !== dropIndex);
}
function trimMetadataToBudget(metadata, options = {}) {
	let next = removeUndefinedMetadataFields(metadata);
	while (metadataByteSize(next) > MAX_CARD_METADATA_BYTES) {
		const currentSize = metadataByteSize(next);
		if (next.attempts?.length) next = removeUndefinedMetadataFields({
			...next,
			attempts: dropFirst(next.attempts)
		});
		else if (next.diagnostics?.length) next = removeUndefinedMetadataFields({
			...next,
			diagnostics: dropFirst(next.diagnostics)
		});
		else if (next.notifications?.length) next = removeUndefinedMetadataFields({
			...next,
			notifications: dropFirst(next.notifications)
		});
		else if (next.proof?.some((proof) => !options.preserveProofId || proof.id !== options.preserveProofId)) next = removeUndefinedMetadataFields({
			...next,
			proof: dropFirstProofExcept(next.proof, options.preserveProofId)
		});
		else if (next.artifacts?.length) next = removeUndefinedMetadataFields({
			...next,
			artifacts: dropFirst(next.artifacts)
		});
		else if (next.attachments?.length) next = removeUndefinedMetadataFields({
			...next,
			attachments: dropFirst(next.attachments)
		});
		else if (next.workerLogs?.length) next = removeUndefinedMetadataFields({
			...next,
			workerLogs: dropFirst(next.workerLogs)
		});
		else if (next.links?.length) {
			const links = dropFirstNonDependencyLink(next.links);
			if (links?.length === next.links.length) next = removeUndefinedMetadataFields({
				...next,
				comments: dropFirst(next.comments)
			});
			else next = removeUndefinedMetadataFields({
				...next,
				links
			});
		} else if (next.comments?.length) next = removeUndefinedMetadataFields({
			...next,
			comments: dropFirst(next.comments)
		});
		else if (options.preserveProofId) throw new Error(`card metadata cannot retain proof: ${options.preserveProofId}`);
		if (metadataByteSize(next) >= currentSize) {
			if (options.preserveProofId) throw new Error(`card metadata cannot retain proof: ${options.preserveProofId}`);
			break;
		}
	}
	return next;
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
	const key = execution.runId ?? execution.sessionKey ?? execution.id;
	const existingIndex = attempts.findIndex((attempt) => execution.runId && attempt.runId === execution.runId || !execution.runId && attempt.id === key);
	const existingAttempt = existingIndex >= 0 ? attempts[existingIndex] : void 0;
	const nextAttempt = {
		id: existingAttempt?.id ?? key,
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
	const failureCount = attemptStatus === "blocked" || attemptStatus === "failed" ? previousFailed ? metadata.failureCount : (metadata.failureCount ?? 0) + 1 : attemptStatus === "succeeded" ? 0 : metadata.failureCount;
	return removeUndefinedMetadataFields({
		...metadata,
		attempts: attempts.slice(-30),
		failureCount
	});
}
function appendEvent(card, event, at = Date.now()) {
	return [...normalizeEvents(card.events), {
		id: randomUUID(),
		at,
		...event
	}].slice(-50);
}
function metadataEntriesChanged(existing, next, key) {
	const previous = existing.metadata?.[key];
	const current = next.metadata?.[key];
	const latestId = current?.at(-1)?.id;
	return (previous?.length ?? 0) !== (current?.length ?? 0) || Boolean(latestId && latestId !== previous?.at(-1)?.id);
}
function lifecycleStatusSourceUpdatedAtFromPatch(metadata) {
	if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return;
	if (!Object.hasOwn(metadata, "lifecycleStatusSourceUpdatedAt")) return;
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
		if (nextAttempts.length > existingAttempts.length) return {
			kind: "attempt_started",
			...latestAttempt?.sessionKey ? { sessionKey: latestAttempt.sessionKey } : {},
			...latestAttempt?.runId ? { runId: latestAttempt.runId } : {}
		};
		const previousAttempt = latestAttempt ? existingAttempts.find((attempt) => attempt.id === latestAttempt.id) : void 0;
		if (latestAttempt && previousAttempt?.status !== latestAttempt.status) return {
			kind: "attempt_updated",
			...latestAttempt.sessionKey ? { sessionKey: latestAttempt.sessionKey } : {},
			...latestAttempt.runId ? { runId: latestAttempt.runId } : {}
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
	if (existing.metadata?.workerProtocol?.state !== next.metadata?.workerProtocol?.state) return { kind: "orchestration" };
	if (metadataEntriesChanged(existing, next, "workerLogs")) return { kind: "orchestration" };
	if ((existing.metadata?.diagnostics?.length ?? 0) !== (next.metadata?.diagnostics?.length ?? 0)) return { kind: "diagnostic" };
	if (metadataEntriesChanged(existing, next, "notifications")) return { kind: "notification" };
	if (existing.metadata?.automation?.dispatchCount !== next.metadata?.automation?.dispatchCount || existing.metadata?.automation?.lastDispatchAt !== next.metadata?.automation?.lastDispatchAt) return { kind: "dispatch" };
	if (!existing.metadata?.archivedAt && next.metadata?.archivedAt) return { kind: "archived" };
	if (existing.metadata?.archivedAt && !next.metadata?.archivedAt) return { kind: "unarchived" };
	if (!existing.metadata?.stale && next.metadata?.stale) return { kind: "stale" };
	return { kind: "edited" };
}
function removeUndefinedCardFields(card) {
	const next = { ...card };
	for (const key of [
		"notes",
		"agentId",
		"sessionKey",
		"runId",
		"taskId",
		"sourceUrl",
		"execution",
		"startedAt",
		"completedAt",
		"metadata"
	]) if (next[key] === void 0) delete next[key];
	if (metadataIsEmpty(next.metadata)) delete next.metadata;
	return next;
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
		return `- ${capText([
			attachment.fileName,
			`${attachment.byteSize} bytes`,
			attachment.mimeType,
			attachment.note
		].filter(Boolean).join(" · "), 500)}`;
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
function cardParentIds(card) {
	return (card.metadata?.links ?? []).filter((link) => link.type === "parent" && link.targetCardId).map((link) => link.targetCardId).filter((id, index, ids) => ids.indexOf(id) === index);
}
function cardChildIds(card) {
	return (card.metadata?.links ?? []).filter((link) => link.type === "child" && link.targetCardId).map((link) => link.targetCardId).filter((id, index, ids) => ids.indexOf(id) === index);
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
//#region extensions/workboard/src/store-compensation.ts
const ABSENT = Symbol("workboard-compensation-absent");
function recordValue(record, key) {
	return Object.hasOwn(record, key) && record[key] !== void 0 ? record[key] : ABSENT;
}
function canonicalValue(value) {
	if (Array.isArray(value)) return value.map(canonicalValue);
	if (!isRecord(value)) return value;
	return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== void 0).map(([key, entry]) => [key, canonicalValue(entry)]));
}
function sameValue(left, right) {
	return isDeepStrictEqual(canonicalValue(left), canonicalValue(right));
}
function stableId(value) {
	return isRecord(value) && typeof value.id === "string" ? value.id : void 0;
}
function hasOnlyStableIds(values) {
	return values.every((value) => stableId(value) !== void 0);
}
function insertRestoredValues(current, restored, reference) {
	const result = [...current];
	for (const value of restored.toReversed()) {
		const referenceIndex = reference.findIndex((entry) => stableId(entry) === stableId(value));
		const nextId = reference.slice(referenceIndex + 1).map(stableId).find((id) => id !== void 0 && result.some((entry) => stableId(entry) === id));
		const nextIndex = nextId ? result.findIndex((entry) => stableId(entry) === nextId) : -1;
		result.splice(nextIndex >= 0 ? nextIndex : result.length, 0, value);
	}
	return result;
}
function rollbackStableIdArray(before, after, current) {
	const beforeById = new Map(before.map((value) => [stableId(value), value]));
	const afterById = new Map(after.map((value) => [stableId(value), value]));
	const currentIds = new Set(current.map((value) => stableId(value)));
	return insertRestoredValues(current.flatMap((currentValue) => {
		const id = stableId(currentValue);
		const beforeValue = beforeById.get(id);
		const afterValue = afterById.get(id);
		if (beforeValue === void 0 && afterValue !== void 0) return sameValue(currentValue, afterValue) ? [] : [currentValue];
		if (beforeValue !== void 0 && afterValue !== void 0) {
			const value = rollbackValue(beforeValue, afterValue, currentValue);
			return value === ABSENT ? [] : [value];
		}
		return [currentValue];
	}), before.filter((value) => {
		const id = stableId(value);
		return !afterById.has(id) && !currentIds.has(id);
	}), before);
}
function rollbackRecord(before, after, current) {
	const beforeRecord = isRecord(before) ? before : {};
	const afterRecord = isRecord(after) ? after : {};
	const keys = /* @__PURE__ */ new Set([
		...Object.keys(beforeRecord),
		...Object.keys(afterRecord),
		...Object.keys(current)
	]);
	const merged = {};
	for (const key of keys) {
		const value = rollbackValue(recordValue(beforeRecord, key), recordValue(afterRecord, key), recordValue(current, key));
		if (value !== ABSENT) merged[key] = value;
	}
	return before === ABSENT && Object.keys(merged).length === 0 ? ABSENT : merged;
}
function rollbackValue(before, after, current) {
	if (sameValue(before, after)) return current;
	if (sameValue(current, after)) return before;
	if (current === ABSENT) return ABSENT;
	if (Array.isArray(current) && (Array.isArray(before) || before === ABSENT) && (Array.isArray(after) || after === ABSENT)) {
		const beforeArray = Array.isArray(before) ? before : [];
		const afterArray = Array.isArray(after) ? after : [];
		return hasOnlyStableIds([
			...beforeArray,
			...afterArray,
			...current
		]) ? rollbackStableIdArray(beforeArray, afterArray, current) : current;
	}
	if (isRecord(current) && (isRecord(before) || before === ABSENT) && (isRecord(after) || after === ABSENT)) return rollbackRecord(before, after, current);
	return current;
}
function invertWorkboardCardMutation(before, after, current) {
	const merged = rollbackValue(before, after, current);
	if (!isRecord(merged)) throw new Error("workboard card compensation produced an invalid card");
	return {
		...merged,
		id: current.id,
		updatedAt: current.updatedAt
	};
}
function sameWorkboardCardState(left, right) {
	const { updatedAt: _leftUpdatedAt, ...leftState } = left;
	const { updatedAt: _rightUpdatedAt, ...rightState } = right;
	return sameValue(leftState, rightState);
}
function invertWorkboardWorkspaceMutation(before, after, current) {
	const merged = invertWorkboardCardMutation(before, after, current);
	const afterAutomation = after.metadata?.automation;
	const currentAutomation = current.metadata?.automation;
	if (sameValue(currentAutomation?.workspace, afterAutomation?.workspace)) return merged;
	const automation = { ...merged.metadata?.automation };
	if (currentAutomation?.workspace) automation.workspace = currentAutomation.workspace;
	else delete automation.workspace;
	if (currentAutomation?.workspaceAccess) automation.workspaceAccess = currentAutomation.workspaceAccess;
	else delete automation.workspaceAccess;
	const metadata = { ...merged.metadata };
	if (Object.keys(automation).length > 0) metadata.automation = automation;
	else delete metadata.automation;
	if (Object.keys(metadata).length > 0) return {
		...merged,
		metadata
	};
	const withoutMetadata = { ...merged };
	delete withoutMetadata.metadata;
	return withoutMetadata;
}
//#endregion
//#region extensions/workboard/src/store-read.ts
async function readCards(store, scope) {
	return (await store.entries(scope)).map((entry) => entry.value).filter((entry) => entry?.version === 1 && Boolean(entry.card?.id)).map((entry) => entry.card).toSorted(compareCards);
}
//#endregion
//#region extensions/workboard/src/store-runtime.ts
var WorkboardStoreRuntime = class {
	constructor(readDataVersion, closePersistence, ready, runWithWriteAuthority) {
		this.readDataVersion = readDataVersion;
		this.closePersistence = closePersistence;
		this.runWithWriteAuthority = runWithWriteAuthority;
		this.operationScope = new AsyncLocalStorage();
		this.operations = /* @__PURE__ */ new Set();
		this.mutationQueue = Promise.resolve();
		this.sealed = false;
		this.epoch = randomUUID();
		this.revision = 0;
		this.mutationRevision = 0;
		this.listeners = /* @__PURE__ */ new Set();
		this.initialization = Promise.resolve(ready ?? readDataVersion?.()).then((version) => {
			this.externalDataVersion = version;
		});
		this.initialization.catch(() => {});
	}
	ready() {
		return this.runOperation(() => void 0);
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
			this.operationScope.disable();
			await this.closePersistence?.();
		}).catch((error) => {
			this.closePromise = void 0;
			throw error;
		});
		return this.closePromise;
	}
	track(store, { notifyChanges = true } = {}) {
		return {
			register: (key, value) => this.runOperation(async () => {
				await store.register(key, value);
				if (notifyChanges) this.mutationRevision += 1;
			}),
			lookup: (key) => this.runOperation(() => store.lookup(key)),
			delete: (key) => this.runOperation(async () => {
				const deleted = await store.delete(key);
				if (deleted && notifyChanges) this.mutationRevision += 1;
				return deleted;
			}),
			entries: () => this.runOperation(() => store.entries())
		};
	}
	trackCardStore(store) {
		return {
			...this.track(store),
			entries: (scope) => this.runOperation(() => store.entries(scope)),
			registerIfAbsent: (key, value) => this.runOperation(async () => {
				const inserted = await store.registerIfAbsent(key, value);
				if (inserted) this.mutationRevision += 1;
				return inserted;
			}),
			registerIfUpdatedAt: (key, value, expectedUpdatedAt) => this.runOperation(async () => {
				const updated = await store.registerIfUpdatedAt(key, value, expectedUpdatedAt);
				if (updated) this.mutationRevision += 1;
				return updated;
			}),
			deleteIfUpdatedAt: (key, expectedUpdatedAt) => this.runOperation(async () => {
				const deleted = await store.deleteIfUpdatedAt(key, expectedUpdatedAt);
				if (deleted) this.mutationRevision += 1;
				return deleted;
			}),
			claimIfOwnerAvailable: (key, value, expectedUpdatedAt, ownerId, now) => this.runOperation(async () => {
				const result = await store.claimIfOwnerAvailable(key, value, expectedUpdatedAt, ownerId, now);
				if (result === "updated") this.mutationRevision += 1;
				return result;
			}),
			listCardStatuses: (ids) => this.runOperation(() => store.listCardStatuses(ids)),
			listBoardAggregates: () => this.runOperation(() => store.listBoardAggregates()),
			listStatsAggregates: (boardId) => this.runOperation(() => store.listStatsAggregates(boardId)),
			hasCards: (boardId) => this.runOperation(() => store.hasCards(boardId))
		};
	}
	subscribeChanges(listener) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}
	announceChangeEpoch() {
		this.emit();
	}
	reconcileExternalChanges() {
		return this.runOperation(async () => {
			if (!this.readDataVersion) return false;
			const current = await this.readDataVersion();
			if (current === this.externalDataVersion) return false;
			this.externalDataVersion = current;
			this.emit();
			return true;
		});
	}
	async enqueueMutation(run, assertCurrent) {
		return await this.runOperation(async () => {
			const runAndNotify = async () => await this.withMutationAuthority(async () => await this.runMutation(run), assertCurrent);
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
		const initialRevision = this.mutationRevision;
		try {
			return await run();
		} finally {
			if (this.mutationRevision !== initialRevision) this.emit();
		}
	}
	emit() {
		const change = {
			epoch: this.epoch,
			revision: ++this.revision
		};
		for (const listener of this.listeners) try {
			listener(change);
		} catch {}
	}
};
//#endregion
//#region extensions/workboard/src/store-core.ts
const WORKBOARD_CAS_ATTEMPTS = 3;
var WorkboardCoreStore = class extends WorkboardStoreRuntime {
	constructor(store, stores) {
		super(stores.dataVersion, stores.close, stores.ready, stores.runWithWriteAuthority);
		this.lastNotificationSequence = 0;
		this.store = this.trackCardStore(store);
		this.boardStore = this.track(stores.boards);
		this.subscriptionStore = {
			...this.track(stores.subscriptions, { notifyChanges: false }),
			entries: (options) => this.runOperation(() => stores.subscriptions.entries(options))
		};
		this.attachmentStore = this.track(stores.attachments, { notifyChanges: false });
	}
	async withCardCompensation(run) {
		if (this.compensationJournal) return await run();
		const journal = [];
		this.compensationJournal = journal;
		try {
			return await run();
		} catch (operationError) {
			const compensationErrors = await this.rollbackCardMutations(journal);
			if (compensationErrors.length > 0) throw this.compensationError(operationError, compensationErrors);
			throw operationError;
		} finally {
			this.compensationJournal = void 0;
		}
	}
	compensationError(operationError, cleanupErrors) {
		const message = operationError instanceof Error ? operationError.message : String(operationError);
		return new AggregateError([operationError, ...cleanupErrors], message, { cause: operationError });
	}
	recordCardMutation(before, after) {
		this.compensationJournal?.push({
			before,
			after
		});
	}
	async rollbackCardMutations(journal) {
		const errors = [];
		for (const entry of journal.toReversed()) try {
			if (!entry.before) {
				await this.rollbackCreatedCard(entry.after);
				continue;
			}
			await this.rollbackUpdatedCard(entry.before, entry.after);
		} catch (error) {
			errors.push(error);
		}
		return errors;
	}
	async compensateWorkspaceMutation(before, after) {
		await this.enqueueMutation(async () => await this.rollbackUpdatedCard(before, after, invertWorkboardWorkspaceMutation));
	}
	async rollbackUpdatedCard(before, after, invert = invertWorkboardCardMutation) {
		for (let attempt = 0; attempt < WORKBOARD_CAS_ATTEMPTS; attempt += 1) {
			const current = await this.get(after.id);
			if (!current) return;
			const merged = invert(before, after, current);
			if (sameWorkboardCardState(current, merged)) return;
			const compensation = {
				...merged,
				updatedAt: Math.max(Date.now(), current.updatedAt + 1)
			};
			if (await this.registerCardIfUpdatedAt(compensation, current.updatedAt)) return;
		}
		throw new Error(`card changed repeatedly during compensation: ${after.id}`);
	}
	async rollbackCreatedCard(created) {
		for (let attempt = 0; attempt < WORKBOARD_CAS_ATTEMPTS; attempt += 1) {
			const current = await this.get(created.id);
			if (!current || !sameWorkboardCardState(current, created)) return;
			if (await this.deleteCardIfUpdatedAt(created.id, current.updatedAt)) return;
		}
		throw new Error(`card changed repeatedly during compensation: ${created.id}`);
	}
	async registerCardIfUpdatedAt(card, expectedUpdatedAt) {
		return await this.store.registerIfUpdatedAt(card.id, {
			version: 1,
			card
		}, expectedUpdatedAt);
	}
	async deleteCardIfUpdatedAt(id, expectedUpdatedAt) {
		return await this.store.deleteIfUpdatedAt(id, expectedUpdatedAt);
	}
	async updateLatestCard(id, buildPatch, options = {}) {
		for (let attempt = 0;; attempt += 1) {
			const current = await this.get(id);
			if (!current) throw new Error(`card not found: ${id}`);
			if (options.expectedUpdatedAt !== void 0 && current.updatedAt !== options.expectedUpdatedAt) throw new WorkboardCardConflictError(current);
			const patch = buildPatch(current);
			if (!patch) return {
				card: current,
				updated: false
			};
			try {
				const card = await this.updateCard(id, patch, {
					...options,
					expectedUpdatedAt: current.updatedAt
				});
				return {
					card,
					updated: card.updatedAt !== current.updatedAt
				};
			} catch (error) {
				if (options.expectedUpdatedAt !== void 0 || !(error instanceof WorkboardCardConflictError) || attempt === 2) throw error;
			}
		}
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
	async list(options = {}) {
		const boardId = normalizeBoardId(options.boardId);
		return readCards(this.store, boardId === void 0 ? void 0 : {
			kind: "board",
			boardId
		});
	}
	async listBoards() {
		const boards = /* @__PURE__ */ new Map();
		for (const entry of await this.boardStore.entries()) {
			if (entry.value?.version !== 1 || !entry.value.board?.id) continue;
			const board = entry.value.board;
			boards.set(board.id, {
				id: board.id,
				...board.name ? { name: board.name } : {},
				...board.description ? { description: board.description } : {},
				...board.icon ? { icon: board.icon } : {},
				...board.color ? { color: board.color } : {},
				...board.automationJobId ? { automationJobId: board.automationJobId } : {},
				...board.defaultWorkspace ? { defaultWorkspace: board.defaultWorkspace } : {},
				...board.orchestration ? { orchestration: board.orchestration } : {},
				total: 0,
				active: 0,
				archived: 0,
				byStatus: {},
				updatedAt: board.updatedAt,
				...board.archivedAt ? { archivedAt: board.archivedAt } : {}
			});
		}
		if (!boards.has("default")) boards.set("default", {
			id: "default",
			total: 0,
			active: 0,
			archived: 0,
			byStatus: {}
		});
		const cardAggregates = await this.store.listBoardAggregates();
		for (const aggregate of cardAggregates) {
			const boardId = aggregate.boardId;
			const summary = boards.get(boardId) ?? {
				id: boardId,
				total: 0,
				active: 0,
				archived: 0,
				byStatus: {}
			};
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
			return board;
		});
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
			for (const entry of await this.subscriptionStore.entries({ boardId })) if (entry.value?.version === 1 && entry.value.subscription?.boardId === boardId) await this.subscriptionStore.delete(entry.key);
			return { deleted: await this.boardStore.delete(boardId) };
		});
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
		const entry = await this.store.lookup(id.trim());
		return entry?.version === 1 ? entry.card : void 0;
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
		return await this.enqueueMutation(async () => await this.withCardCompensation(async () => await this.createDirect(input, scope)), assertOwnerCurrent);
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
			return parent;
		});
		const childAutomation = normalizeAutomation({
			...automation,
			createdByCardId: automation?.createdByCardId ?? (parents.length === 1 ? parents[0] : void 0)
		}, automation);
		const normalizedPosition = normalizePosition(input.position, NaN);
		const notes = normalizeNotes(input.notes);
		const agentId = normalizeOptionalString(input.agentId);
		const sessionKey = normalizeOptionalString(input.sessionKey);
		const runId = normalizeOptionalString(input.runId);
		const taskId = normalizeOptionalString(input.taskId);
		const sourceUrl = normalizeOptionalString(input.sourceUrl);
		const normalizedExecution = normalizeExecution(input.execution);
		const execution = normalizedExecution?.status === "running" && (heldBySchedule || heldByDependencies) ? void 0 : normalizedExecution;
		const startedAt = input.startedAt === void 0 ? status === "running" ? now : void 0 : normalizeTimestamp(input.startedAt, 0) || void 0;
		const completedAt = input.completedAt === void 0 ? status === "done" ? now : void 0 : normalizeTimestamp(input.completedAt, 0) || void 0;
		const syncedMetadata = trimMetadataToBudget(syncExecutionAttemptMetadata(normalizeMetadata(input.metadata, {
			templateId: normalizeTemplateId(input.templateId),
			...childAutomation ? { automation: childAutomation } : {}
		}, {
			allowDependencyLinks: false,
			allowArchivedAt: false
		}), execution, now));
		const boardId = syncedMetadata.automation?.boardId ?? "default";
		const position = Number.isFinite(normalizedPosition) ? normalizedPosition : Math.max(0, ...cards.filter((card) => card.status === status && cardBoardId(card) === boardId).map((card) => card.position)) + POSITION_STEP;
		let card = {
			id: options.cardId ?? randomUUID(),
			title: normalizeTitle(input.title),
			status,
			priority: normalizePriority(input.priority, "normal"),
			labels: normalizeLabels(input.labels),
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
			...taskId ? { taskId } : {},
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
			this.recordCardMutation(void 0, card);
		} else {
			await this.store.register(card.id, {
				version: 1,
				card
			});
			this.recordCardMutation(void 0, card);
		}
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
			const matches = (await readCards(this.store, {
				kind: "session",
				sessionKey
			})).filter((card) => cardSessionKey(card) === sessionKey).toSorted((left, right) => right.updatedAt - left.updatedAt);
			const existing = matches.find((card) => !card.metadata?.archivedAt) ?? matches.find((card) => Boolean(card.metadata?.archivedAt));
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
		return await this.enqueueMutation(async () => await this.updateCard(id, patch, {
			allowMetadataDependencyLinks: false,
			enforceStatusHolds: true,
			expectedUpdatedAt: options.expectedUpdatedAt
		}));
	}
	async updateCard(id, patch, options = {}) {
		const existing = await this.get(id);
		if (!existing) throw new Error(`card not found: ${id}`);
		if (options.expectedUpdatedAt !== void 0 && existing.updatedAt !== options.expectedUpdatedAt) throw new WorkboardCardConflictError(existing);
		const lifecycleStatusSourceUpdatedAt = lifecycleStatusSourceUpdatedAtFromPatch(patch.metadata);
		const existingLifecycleStatusSourceUpdatedAt = existing.metadata?.lifecycleStatusSourceUpdatedAt;
		const hasFreshLifecycleStatusSource = lifecycleStatusSourceUpdatedAt !== void 0 && lifecycleStatusSourceUpdatedAt !== existingLifecycleStatusSourceUpdatedAt;
		let effectivePatch = patch;
		if (patch.status !== void 0 && lifecycleStatusSourceUpdatedAt !== void 0 && shouldSkipPersistedLifecycleStatusUpdate(existing, lifecycleStatusSourceUpdatedAt)) {
			effectivePatch = {
				...patch,
				status: void 0
			};
			if (patch.metadata && typeof patch.metadata === "object" && !Array.isArray(patch.metadata)) {
				const { lifecycleStatusSourceUpdatedAt: _ignored, ...rest } = patch.metadata;
				effectivePatch.metadata = Object.keys(rest).length > 0 ? rest : void 0;
			}
			if (!Object.entries(effectivePatch).some(([key, value]) => key !== "status" && key !== "metadata" && value !== void 0) && effectivePatch.metadata === void 0) return existing;
		}
		const status = normalizeStatus(effectivePatch.status, existing.status);
		const now = Math.max(Date.now(), existing.updatedAt + 1);
		const startedAt = effectivePatch.startedAt === void 0 ? status === "running" ? existing.startedAt ?? now : existing.startedAt : normalizeTimestamp(effectivePatch.startedAt, 0) || void 0;
		const completedAt = effectivePatch.completedAt === void 0 ? status === "done" ? existing.completedAt ?? now : void 0 : normalizeTimestamp(effectivePatch.completedAt, 0) || void 0;
		const sessionKey = effectivePatch.sessionKey === void 0 ? existing.sessionKey : normalizeOptionalString(effectivePatch.sessionKey);
		const execution = effectivePatch.execution === void 0 ? effectivePatch.sessionKey === void 0 ? existing.execution : syncExecutionSessionKey(existing.execution, sessionKey) : normalizeExecution(effectivePatch.execution);
		let metadata = normalizeMetadata(effectivePatch.metadata, existing.metadata, {
			allowAutomationLaunch: options.allowAutomationLaunch,
			allowDependencyLinks: options.allowMetadataDependencyLinks !== false,
			preserveProofId: options.preserveProofId
		});
		if (status !== existing.status && !hasFreshLifecycleStatusSource) metadata = {
			...metadata,
			lifecycleStatusSourceUpdatedAt: void 0
		};
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
		const next = removeUndefinedCardFields({
			...existing,
			title: effectivePatch.title === void 0 ? existing.title : normalizeTitle(effectivePatch.title),
			notes: effectivePatch.notes === void 0 ? existing.notes : normalizeNotes(effectivePatch.notes),
			status,
			priority: effectivePatch.priority === void 0 ? existing.priority : normalizePriority(effectivePatch.priority, existing.priority),
			labels: effectivePatch.labels === void 0 ? existing.labels : normalizeLabels(effectivePatch.labels),
			agentId: effectivePatch.agentId === void 0 ? existing.agentId : normalizeOptionalString(effectivePatch.agentId),
			sessionKey,
			runId: effectivePatch.runId === void 0 ? existing.runId : normalizeOptionalString(effectivePatch.runId),
			taskId: effectivePatch.taskId === void 0 ? existing.taskId : normalizeOptionalString(effectivePatch.taskId),
			sourceUrl: effectivePatch.sourceUrl === void 0 ? existing.sourceUrl : normalizeOptionalString(effectivePatch.sourceUrl),
			execution,
			metadata: effectivePatch.templateId === void 0 ? metadata : {
				...metadata,
				templateId: normalizeTemplateId(effectivePatch.templateId)
			},
			position: effectivePatch.position === void 0 ? existing.position : normalizePosition(effectivePatch.position, existing.position),
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
		if (options.ownerSlot) {
			const result = await this.store.claimIfOwnerAvailable(next.id, {
				version: 1,
				card: next
			}, expectedUpdatedAt, options.ownerSlot.ownerId, options.ownerSlot.now);
			if (result === "owner_busy") throw new Error(`Owner ${options.ownerSlot.ownerId} already has active Workboard work.`);
			if (result === "updated") {
				this.recordCardMutation(existing, next);
				await this.deleteDetachedAttachments(existing, next);
				return next;
			}
		} else if (await this.store.registerIfUpdatedAt(next.id, {
			version: 1,
			card: next
		}, expectedUpdatedAt)) {
			this.recordCardMutation(existing, next);
			await this.deleteDetachedAttachments(existing, next);
			return next;
		}
		const current = await this.get(next.id);
		if (!current) throw new Error(`card not found: ${id}`);
		throw new WorkboardCardConflictError(current);
	}
	async assertActiveStatusAllowed(existing, next, now) {
		if (next.status !== "ready" && next.status !== "running" && next.status !== "review" && next.status !== "done") return;
		const parents = cardParentIds(next);
		if (parents.length > 0) {
			const cards = new Map((await this.store.listCardStatuses(parents)).map((card) => [card.id, card]));
			if (!parents.every((parentId) => cards.get(parentId)?.status === "done")) throw new Error("card dependencies are not done.");
		}
		if (next.status === "done") return;
		const scheduledAt = next.metadata?.automation?.scheduledAt;
		if (scheduledAt && scheduledAt > now || existing.status === "scheduled" && !scheduledAt) throw new Error("card is scheduled for later.");
	}
	async delete(id, options = {}) {
		return await this.enqueueMutation(async () => await this.deleteDirect(id, options));
	}
	async deleteDirect(id, options = {}) {
		const cardId = id.trim();
		if (!(options.expectedUpdatedAt === void 0 ? await this.store.delete(cardId) : await this.deleteCardIfUpdatedAt(cardId, options.expectedUpdatedAt))) {
			if (options.expectedUpdatedAt !== void 0) {
				const current = await this.get(cardId);
				if (current) throw new WorkboardCardConflictError(current);
			}
			return { deleted: false };
		}
		for (const entry of await this.subscriptionStore.entries()) if (entry.value?.version === 1 && entry.value.subscription?.cardId === cardId) await this.subscriptionStore.delete(entry.key);
		const referenceUpdates = await this.removeReferencesToCard(cardId);
		return {
			deleted: true,
			...referenceUpdates.length > 0 ? { referenceUpdates } : {}
		};
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
		return await this.enqueueMutation(async () => await this.withCardCompensation(async () => await this.linkCardsDirect(parentId, childId, Date.now(), { scope })));
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
			const cardsById = new Map((await this.store.listCardStatuses(parentIds)).map((card) => [card.id, card]));
			if (parentIds.some((id) => cardsById.get(id)?.status !== "done")) throw new Error("terminal child cards cannot gain incomplete parent dependencies.");
		}
		if (isActiveDependencyTarget(child, { allowStatusOnly: options.allowStatusOnlyActiveChild })) throw new Error("active child cards cannot gain parent dependencies.");
		if (await this.dependsOn(parent.id, child.id)) throw new Error("dependency link would create a cycle.");
		const parentLinks = parent.metadata?.links ?? [];
		const childLinks = child.metadata?.links ?? [];
		const nextParentLinks = parentLinks.some((link) => link.type === "child" && link.targetCardId === child.id) ? parentLinks : appendLinkPreservingDependencies(parentLinks, {
			id: randomUUID(),
			type: "child",
			targetCardId: child.id,
			createdAt: now
		});
		const nextChildLinks = childLinks.some((link) => link.type === "parent" && link.targetCardId === parent.id) ? childLinks : appendLinkPreservingDependencies(childLinks, {
			id: randomUUID(),
			type: "parent",
			targetCardId: parent.id,
			createdAt: now
		});
		await this.updateCard(parent.id, { metadata: {
			...parent.metadata,
			links: nextParentLinks
		} }, { expectedUpdatedAt: parent.updatedAt });
		const nextChild = await this.updateCard(child.id, { metadata: {
			...child.metadata,
			links: nextChildLinks
		} }, { expectedUpdatedAt: child.updatedAt });
		return await this.promoteDependencyReady(nextChild.id);
	}
	async dependencyTargetStatus(card, now) {
		const scheduledAt = card.metadata?.automation?.scheduledAt;
		const parents = cardParentIds(card);
		if (card.status === "scheduled" && !scheduledAt) return "scheduled";
		if (parents.length === 0) {
			if (scheduledAt && scheduledAt > now && isDependencyPromotableStatus(card.status)) return "scheduled";
			return card.status === "scheduled" ? "ready" : card.status;
		}
		const parentIds = parents.map((parentId) => parentId.trim());
		const parentCards = new Map((await this.store.listCardStatuses(parentIds)).map((parent) => [parent.id, parent]));
		const parentsDone = parentIds.every((id) => parentCards.get(id)?.status === "done");
		if (!parentsDone && scheduledAt && scheduledAt > now && isDependencyPromotableStatus(card.status)) return "scheduled";
		if (!parentsDone && isDependencyPromotableStatus(card.status)) return "todo";
		if (parentsDone && scheduledAt && scheduledAt > now && isDependencyPromotableStatus(card.status)) return "scheduled";
		return parentsDone && isDependencyPromotableStatus(card.status) ? "ready" : card.status;
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
		const card = await this.get(id);
		if (!card) throw new Error(`card not found: ${id}`);
		if (card.metadata?.archivedAt) return card;
		const target = await this.dependencyTargetStatus(card, now);
		if (target === card.status) return card;
		return await this.updateCard(card.id, { status: target });
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
	async addProof(id, input, scope) {
		const proof = normalizeProofInput(input, Date.now());
		return await this.updateMetadata(id, (existing) => {
			assertCanMutateClaimedCard(existing, scope);
			const metadata = clearDiagnostics(existing.metadata, ["missing_proof"]);
			return {
				...metadata,
				proof: [...metadata.proof ?? [], proof].slice(-40)
			};
		}, { preserveProofId: proof.id });
	}
	async addProofWithArtifact(id, proofInput, artifactInput, scope) {
		const now = Date.now();
		const proof = normalizeProofInput(proofInput, now);
		const artifact = normalizeArtifact({
			...artifactInput,
			createdAt: now
		});
		if (!artifact) throw new Error("artifact url or path is required.");
		return await this.updateMetadata(id, (existing) => {
			assertCanMutateClaimedCard(existing, scope);
			const metadata = clearDiagnostics(existing.metadata, ["missing_proof"]);
			return {
				...metadata,
				proof: [...metadata.proof ?? [], proof].slice(-40),
				artifacts: [...metadata.artifacts ?? [], artifact].slice(-40)
			};
		}, { preserveProofId: proof.id });
	}
	async addArtifact(id, input, scope) {
		const artifact = normalizeArtifact({
			...input,
			createdAt: Date.now()
		});
		if (!artifact) throw new Error("artifact url or path is required.");
		return await this.updateMetadata(id, (existing) => {
			assertCanMutateClaimedCard(existing, scope);
			const metadata = clearDiagnostics(existing.metadata, ["missing_proof"]);
			return {
				...metadata,
				artifacts: [...metadata.artifacts ?? [], artifact].slice(-40)
			};
		});
	}
	async addAttachment(id, input, scope) {
		return await this.enqueueMutation(async () => {
			const existing = await this.get(id);
			if (!existing) throw new Error(`card not found: ${id}`);
			assertCanMutateClaimedCard(existing, scope);
			const { attachment, contentBase64 } = normalizeAttachmentInput(id, input, Date.now());
			await this.attachmentStore.register(attachment.id, {
				version: 1,
				attachment,
				contentBase64
			});
			try {
				const updated = await this.updateCard(id, { metadata: {
					...clearDiagnostics(existing.metadata, ["missing_proof"]),
					attachments: [...existing.metadata?.attachments ?? [], attachment].slice(-20)
				} });
				if (!updated.metadata?.attachments?.some((entry) => entry.id === attachment.id)) {
					await this.attachmentStore.delete(attachment.id);
					throw new Error("attachment metadata was trimmed before it could be indexed.");
				}
				return updated;
			} catch (error) {
				await this.attachmentStore.delete(attachment.id);
				throw error;
			}
		});
	}
	async listAttachments(id) {
		const card = await this.get(id);
		if (!card) throw new Error(`card not found: ${id}`);
		return {
			card,
			attachments: card.metadata?.attachments ?? []
		};
	}
	async getAttachment(id) {
		const attachmentId = id.trim();
		const entry = await this.attachmentStore.lookup(attachmentId);
		return entry?.version === 1 ? entry : void 0;
	}
	async deleteAttachment(cardId, attachmentId, scope) {
		return await this.enqueueMutation(async () => {
			const existing = await this.get(cardId);
			if (!existing) throw new Error(`card not found: ${cardId}`);
			assertCanMutateClaimedCard(existing, scope);
			const attachments = existing.metadata?.attachments ?? [];
			if (!attachments.some((attachment) => attachment.id === attachmentId)) throw new Error(`attachment not found: ${attachmentId}`);
			await this.attachmentStore.delete(attachmentId);
			return await this.updateCard(cardId, { metadata: {
				...existing.metadata,
				attachments: attachments.filter((attachment) => attachment.id !== attachmentId)
			} });
		});
	}
	async addWorkerLog(id, input, scope) {
		const now = Date.now();
		const message = normalizeBoundedString(input.message, void 0, 800, "worker log message");
		if (!message) throw new Error("worker log message is required.");
		const level = input.level === "warning" || input.level === "error" || input.level === "info" ? input.level : "info";
		const sessionKey = normalizeBoundedString(input.sessionKey, void 0, 240, "session key");
		const runId = normalizeBoundedString(input.runId, void 0, 160, "run id");
		const log = {
			id: randomUUID(),
			level,
			message,
			createdAt: now,
			...sessionKey ? { sessionKey } : {},
			...runId ? { runId } : {}
		};
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
			const card = await this.get(id);
			if (!card) throw new Error(`card not found: ${id}`);
			assertCanMutateClaimedCard(card, scope);
			const now = Date.now();
			const detail = normalizeBoundedString(input.detail, void 0, 800, "protocol violation detail") ?? "Worker stopped without completing or blocking the card.";
			const sessionKey = normalizeBoundedString(input.sessionKey, void 0, 240, "session key");
			const runId = normalizeBoundedString(input.runId, void 0, 160, "run id");
			const log = {
				id: randomUUID(),
				level: "error",
				message: detail,
				createdAt: now,
				...sessionKey ? { sessionKey } : {},
				...runId ? { runId } : {}
			};
			const execution = card.execution?.status === "running" ? {
				...card.execution,
				status: "blocked",
				updatedAt: now
			} : card.execution;
			const attempts = closeRunningAttempts(card.metadata?.attempts, now, "blocked", detail);
			const notification = {
				id: randomUUID(),
				kind: "failed",
				createdAt: now,
				sequence: this.nextNotificationSequence(now),
				message: capText(detail, 240) ?? "Worker protocol violation.",
				...sessionKey || cardSessionKey(card) ? { sessionKey: sessionKey ?? cardSessionKey(card) } : {},
				...runId || cardRunId(card) ? { runId: runId ?? cardRunId(card) } : {}
			};
			return await this.updateCard(card.id, {
				status: card.status === "done" ? card.status : "blocked",
				...execution ? { execution } : {},
				metadata: {
					...card.metadata,
					workerLogs: [...card.metadata?.workerLogs ?? [], log].slice(-40),
					workerProtocol: {
						state: "violated",
						updatedAt: now,
						detail
					},
					claim: void 0,
					...attempts ? { attempts } : {},
					failureCount: (card.metadata?.failureCount ?? 0) + 1,
					notifications: [...card.metadata?.notifications ?? [], notification].slice(-20)
				}
			});
		});
	}
};
//#endregion
//#region extensions/workboard/src/store-promote.ts
var WorkboardPromoteStore = class extends WorkboardEnrichmentStore {
	async promoteReady(now = Date.now()) {
		return await this.enqueueMutation(async () => {
			const promoted = [];
			for (const card of await this.list()) {
				const next = await this.promoteDependencyReady(card.id, now);
				if (next.status !== card.status) promoted.push(next);
			}
			return {
				cards: promoted,
				count: promoted.length
			};
		});
	}
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
			const existing = await this.get(id);
			if (!existing) throw new Error(`card not found: ${id}`);
			assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
			const reason = normalizeBoundedString(input.reason, void 0, 1e3, "promote reason");
			const comments = reason ? [...existing.metadata?.comments ?? [], {
				id: randomUUID(),
				body: reason,
				createdAt: Date.now()
			}].slice(-50) : existing.metadata?.comments;
			return await this.updateCard(id, {
				status: "ready",
				metadata: {
					...clearDiagnostics(existing.metadata, ["stranded_ready", "blocked_too_long"]),
					comments,
					stale: null
				}
			}, { enforceStatusHolds: input.force !== true });
		});
	}
};
//#endregion
//#region extensions/workboard/src/store-workflow.ts
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
		const ttlSeconds = typeof input.ttlSeconds === "number" && Number.isFinite(input.ttlSeconds) ? Math.max(1, Math.trunc(input.ttlSeconds)) : void 0;
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
			if (cardParentIds(guarded).length > 0 && guarded.status !== "ready" && !activeClaim) throw new Error(guarded.status === "blocked" ? "card is blocked; use workboard_unblock before claiming." : "card dependencies are not done.");
			if (guarded.status === "scheduled") throw new Error("card is scheduled for later.");
			if (retryBudgetExhausted(guarded)) throw new Error("card exhausted its retry budget.");
			if (activeClaim) throw new Error(`card already claimed by ${activeClaim.ownerId}.`);
			const metadata = clearDiagnostics(guarded.metadata, ["stranded_ready"]);
			return {
				card: await this.updateCard(id, {
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
				claim: removeUndefinedMetadataFields({ claim: nextClaim }).claim,
				comments: note ? [...metadata.comments ?? [], {
					id: randomUUID(),
					body: note,
					createdAt: now
				}].slice(-50) : metadata.comments
			};
		});
	}
	async releaseClaim(id, input = {}) {
		return await this.enqueueMutation(async () => {
			const existing = await this.get(id);
			if (!existing) throw new Error(`card not found: ${id}`);
			const status = input.status === void 0 ? existing.status : normalizeStatus(input.status, existing.status);
			const claim = existing.metadata?.claim;
			if (claim) assertClaimIdentity(claim, input);
			return await this.updateCard(id, {
				status,
				metadata: {
					...existing.metadata,
					claim: void 0
				}
			}, { enforceStatusHolds: input.status !== void 0 });
		});
	}
	async complete(id, input = {}, scope = input) {
		return await this.enqueueMutation(async () => await this.completeDirect(id, input, scope));
	}
	async completeDirect(id, input = {}, scope = input) {
		const existing = await this.get(id);
		if (!existing) throw new Error(`card not found: ${id}`);
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
		const proofInput = input.proof && typeof input.proof === "object" && !Array.isArray(input.proof) ? input.proof : void 0;
		const proofId = normalizeBoundedString(input.proofId, void 0, 120, "proof id");
		if (input.proofId !== void 0 && !proofId) throw new Error("proofId must be a non-empty string.");
		const proof = proofInput ? normalizeProofInput(proofInput, now) : void 0;
		const artifacts = Array.isArray(input.artifacts) ? input.artifacts.map((artifact) => normalizeArtifact({
			...artifact,
			createdAt: now
		})).filter((artifact) => artifact !== null).slice(-40) : [];
		const metadata = clearDiagnostics(existing.metadata, ["missing_proof"]);
		const notification = {
			id: randomUUID(),
			kind: "completed",
			createdAt: now,
			sequence: this.nextNotificationSequence(now),
			message: capText(summary, 240) ?? "Workboard card completed.",
			...cardSessionKey(existing) ? { sessionKey: cardSessionKey(existing) } : {},
			...cardRunId(existing) ? { runId: cardRunId(existing) } : {}
		};
		const execution = existing.execution?.status === "running" ? {
			...existing.execution,
			status: "done",
			updatedAt: now
		} : existing.execution;
		return await this.updateCard(id, {
			status: "done",
			...execution ? { execution } : {},
			metadata: {
				...metadata,
				claim: void 0,
				attempts: closeRunningAttempts(metadata.attempts, now, "succeeded"),
				failureCount: 0,
				automation: normalizeAutomation({
					...metadata.automation,
					summary,
					createdCardIds
				}, metadata.automation),
				comments: summary ? [...metadata.comments ?? [], {
					id: randomUUID(),
					body: summary,
					createdAt: now
				}].slice(-50) : metadata.comments,
				proof: appendCompletionProof(metadata.proof, proof, proofId),
				artifacts: artifacts.length ? [...metadata.artifacts ?? [], ...artifacts].slice(-40) : metadata.artifacts,
				notifications: [...metadata.notifications ?? [], notification].slice(-20)
			}
		}, {
			enforceStatusHolds: true,
			preserveProofId: proofId ?? proof?.id
		});
	}
	buildBlockedCardPatch(existing, reason, now, options = {}) {
		const metadata = existing.metadata ?? {};
		const notification = {
			id: randomUUID(),
			kind: "failed",
			createdAt: now,
			sequence: this.nextNotificationSequence(now),
			message: capText(reason, 240) ?? "Workboard card blocked.",
			...cardSessionKey(existing) ? { sessionKey: cardSessionKey(existing) } : {},
			...cardRunId(existing) ? { runId: cardRunId(existing) } : {}
		};
		const execution = existing.execution?.status === "running" ? {
			...existing.execution,
			status: "blocked",
			updatedAt: now
		} : existing.execution;
		return {
			status: "blocked",
			...options.clearExecutionAssociation ? {
				sessionKey: null,
				runId: null,
				execution: null
			} : execution ? { execution } : {},
			metadata: {
				...metadata,
				claim: void 0,
				attempts: closeRunningAttempts(metadata.attempts, now, "blocked", reason),
				failureCount: (metadata.failureCount ?? 0) + 1,
				comments: [...metadata.comments ?? [], {
					id: randomUUID(),
					body: reason,
					createdAt: now
				}].slice(-50),
				notifications: [...metadata.notifications ?? [], notification].slice(-20)
			}
		};
	}
	async block(id, input = {}, scope = input, options = {}) {
		return await this.enqueueMutation(async () => {
			const existing = await this.get(id);
			if (!existing) throw new Error(`card not found: ${id}`);
			assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
			const now = Date.now();
			const reason = normalizeBoundedString(input.reason, void 0, 2e3, "block reason") ?? "Workboard card blocked.";
			return await this.updateCard(id, this.buildBlockedCardPatch(existing, reason, now, options));
		});
	}
	async unblock(id, scope) {
		return await this.enqueueMutation(async () => {
			const existing = await this.get(id);
			if (!existing) throw new Error(`card not found: ${id}`);
			assertCanMutateClaimedCard(existing, scope);
			const metadata = clearDiagnostics(existing.metadata, ["blocked_too_long"]);
			return await this.updateCard(id, {
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
			const existing = await this.get(id);
			if (!existing) throw new Error(`card not found: ${id}`);
			assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
			const agentId = input.agentId === void 0 ? existing.agentId : normalizeOptionalString(input.agentId);
			const status = input.status === void 0 ? existing.status : normalizeStatus(input.status, existing.status);
			const reason = normalizeBoundedString(input.reason, void 0, 1e3, "reassign reason");
			const shouldResetFailures = input.resetFailures !== false;
			const baseMetadata = shouldResetFailures ? clearDiagnostics(existing.metadata, ["blocked_too_long", "repeated_failures"]) : existing.metadata;
			const metadata = {
				...baseMetadata,
				...shouldResetFailures ? { failureCount: 0 } : {},
				comments: reason ? [...baseMetadata?.comments ?? [], {
					id: randomUUID(),
					body: reason,
					createdAt: Date.now()
				}].slice(-50) : baseMetadata?.comments
			};
			return await this.updateCard(id, {
				agentId,
				status,
				metadata
			}, { enforceStatusHolds: true });
		});
	}
	async reclaim(id, input = {}, scope) {
		return await this.enqueueMutation(async () => {
			const existing = await this.get(id);
			if (!existing) throw new Error(`card not found: ${id}`);
			assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
			const now = Date.now();
			const reason = normalizeBoundedString(input.reason, void 0, 1e3, "reclaim reason") ?? "Workboard claim reclaimed.";
			const targetStatus = input.status === void 0 ? existing.status === "running" ? "ready" : existing.status : normalizeStatus(input.status, existing.status);
			const reclaimed = await this.updateCard(id, {
				status: targetStatus,
				execution: existing.execution?.status === "running" ? null : existing.execution,
				metadata: {
					...existing.metadata,
					claim: void 0,
					attempts: closeRunningAttempts(existing.metadata?.attempts, now, "stopped", reason),
					comments: [...existing.metadata?.comments ?? [], {
						id: randomUUID(),
						body: reason,
						createdAt: now
					}].slice(-50),
					stale: null
				}
			}, { enforceStatusHolds: true });
			return await this.promoteDependencyReady(reclaimed.id, now);
		});
	}
	async runs(id) {
		const card = await this.get(id);
		if (!card) throw new Error(`card not found: ${id}`);
		return {
			card,
			attempts: card.metadata?.attempts ?? []
		};
	}
	async specify(id, input = {}, scope) {
		return await this.enqueueMutation(async () => {
			const existing = await this.get(id);
			if (!existing) throw new Error(`card not found: ${id}`);
			assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
			if (existing.status !== "triage" && existing.status !== "backlog" && existing.status !== "todo") throw new Error("only triage, backlog, or todo cards can be specified.");
			if (normalizeStatus(input.status, "todo") !== "todo") throw new Error("specified cards must move to todo.");
			const now = Date.now();
			const summary = normalizeBoundedString(input.summary, void 0, 2e3, "spec summary");
			const metadata = {
				...existing.metadata,
				comments: summary ? [...existing.metadata?.comments ?? [], {
					id: randomUUID(),
					body: summary,
					createdAt: now
				}].slice(-50) : existing.metadata?.comments,
				automation: normalizeAutomation({
					...existing.metadata?.automation,
					summary: summary ?? existing.metadata?.automation?.summary
				}, existing.metadata?.automation)
			};
			const { summary: _summary, status: _status, ...cardPatch } = input;
			return await this.updateCard(id, {
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
		return await this.enqueueMutation(async () => await this.withCardCompensation(async () => {
			const parent = await this.get(id);
			if (!parent) throw new Error(`card not found: ${id}`);
			assertCanMutateClaimedCard(parent, scope === null ? void 0 : scope);
			const childrenInput = Array.isArray(input.children) ? input.children : [];
			if (childrenInput.length === 0) throw new Error("children are required.");
			if (childrenInput.length > 20) throw new Error("at most 20 children can be created at once.");
			const parentAutomation = parent.metadata?.automation;
			const children = [];
			for (const rawChild of childrenInput) {
				if (!rawChild || typeof rawChild !== "object" || Array.isArray(rawChild)) throw new Error("children must be objects.");
				const child = rawChild;
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
				const latestParent = await this.get(parent.id) ?? parent;
				return await this.updateCard(parent.id, {
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
				parent: await this.updateCard(updatedParent.id, {}, {
					event: { kind: "decomposed" },
					expectedUpdatedAt: updatedParent.updatedAt
				}),
				children
			};
		}));
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
		})).map((entry) => entry.value).filter((entry) => entry?.version === 1 && Boolean(entry.subscription?.id)).map((entry) => entry.subscription).filter((subscription) => !boardId || subscription.boardId === boardId).filter((subscription) => !cardId || subscription.cardId === cardId).toSorted((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id)) };
	}
	async deleteNotificationSubscription(id) {
		return await this.enqueueMutation(async () => ({ deleted: await this.subscriptionStore.delete(id.trim()) }));
	}
	async collectNotificationEvents(input = {}) {
		const subscriptionId = normalizeBoundedString(input.subscriptionId, void 0, 120, "subscription id");
		const boardId = normalizeBoardId(input.boardId);
		const cardId = normalizeBoundedString(input.cardId, void 0, 120, "card id");
		const limit = typeof input.limit === "number" && Number.isFinite(input.limit) ? Math.max(1, Math.min(200, Math.trunc(input.limit))) : 50;
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
	async notificationEvents(input = {}) {
		return await this.collectNotificationEvents(input);
	}
	async advanceNotificationEvents(input = {}) {
		const subscriptionId = normalizeBoundedString(input.subscriptionId, void 0, 120, "subscription id");
		if (!subscriptionId) throw new Error("subscriptionId is required to advance notification events.");
		return await this.enqueueMutation(async () => {
			const result = await this.collectNotificationEvents({
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
			id: input.runId ?? attempt.id,
			sessionKey: input.sessionKey,
			...input.runId ? { runId: input.runId } : {}
		};
	}
	const metadata = attemptIndex >= 0 || input.launch ? {
		...card.metadata,
		...attemptIndex >= 0 ? { attempts } : {},
		...input.launch ? { automation: {
			...card.metadata?.automation,
			launch: input.launch
		} } : {}
	} : void 0;
	return {
		sessionKey: input.sessionKey,
		...input.runId ? { runId: input.runId } : {},
		execution: input.execution,
		...metadata ? { metadata } : {}
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
					metadata: {
						...card.metadata,
						automation: {
							...card.metadata?.automation,
							launch
						}
					}
				};
			}, { allowAutomationLaunch: true });
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
			}, { allowAutomationLaunch: true });
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
				const blocked = this.buildBlockedCardPatch(card, reason, failedAt, { clearExecutionAssociation: true });
				return {
					...blocked,
					metadata: {
						...blocked.metadata,
						automation: {
							...card.metadata?.automation,
							launch: {
								...input.expectedLaunch,
								phase: "failed",
								failedAt,
								reason: launchReason
							}
						}
					}
				};
			}, { allowAutomationLaunch: true })).updated;
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
			}, { allowAutomationLaunch: true })).updated;
		});
	}
	async prepareStart(id, now = Date.now(), assertOwnerCurrent) {
		return await this.enqueueMutation(async () => await this.promoteDependencyReady(id, now), assertOwnerCurrent);
	}
	async getAutoOrchestrationBoard(card) {
		if (card.status !== "triage" || card.metadata?.archivedAt || card.metadata?.workerProtocol?.state === "idle") return;
		const board = await this.boardStore.lookup(cardBoardId(card));
		return board?.version === 1 && board.board.orchestration?.autoDecompose === true ? board.board : void 0;
	}
	async dispatch(input = Date.now()) {
		const now = typeof input === "number" ? input : normalizeTimestamp(input.now, Date.now());
		const boardId = typeof input === "number" ? void 0 : normalizeBoardId(input.boardId);
		const assertOwnerCurrent = typeof input === "number" ? void 0 : input.assertOwnerCurrent;
		return await this.enqueueMutation(async () => {
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
						const execution = latest.execution?.status === "running" ? {
							...latest.execution,
							status: "blocked",
							updatedAt: now
						} : latest.execution;
						latest = await this.updateCard(latest.id, {
							status: "blocked",
							...execution ? { execution } : {},
							metadata: {
								...latest.metadata,
								claim: void 0,
								attempts: closeRunningAttempts(latest.metadata?.attempts, now, "blocked", reason),
								failureCount: (latest.metadata?.failureCount ?? 0) + 1,
								notifications: [...latest.metadata?.notifications ?? [], {
									id: randomUUID(),
									kind: "failed",
									createdAt: now,
									sequence: this.nextNotificationSequence(now),
									message: reason
								}].slice(-20)
							}
						});
						blocked.push(latest);
					} else if (claimExpired) {
						latest = await this.updateCard(latest.id, { metadata: {
							...latest.metadata,
							claim: void 0
						} });
						reclaimed.push(latest);
					}
					if (!latest.metadata?.claim && retriesExhausted && isDependencyPromotableStatus(latest.status)) {
						latest = await this.updateCard(latest.id, {
							status: "blocked",
							metadata: {
								...latest.metadata,
								notifications: [...latest.metadata?.notifications ?? [], {
									id: randomUUID(),
									kind: "failed",
									createdAt: now,
									sequence: this.nextNotificationSequence(now),
									message: "Card exhausted its retry budget."
								}].slice(-20)
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
		const patch = input.patch && typeof input.patch === "object" && !Array.isArray(input.patch) ? input.patch : {};
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
		const card = await this.get(id);
		if (!card) throw new Error(`card not found: ${id}`);
		return buildWorkerContext(card, await readCards(this.store, {
			kind: "worker-context",
			cardId: card.id,
			boardId: cardBoardId(card),
			agentId: card.agentId,
			parentIds: cardParentIds(card)
		}));
	}
	static openSqlite(workerModuleUrl) {
		const stores = createWorkboardSqliteStores({ workerModuleUrl });
		return new WorkboardStore(stores.cards, stores);
	}
};
//#endregion
//#region extensions/workboard/src/dispatcher.ts
const DEFAULT_DISPATCH_MAX_STARTS = 3;
const pendingWorkboardDispatches = /* @__PURE__ */ new WeakMap();
function cardIsArchived(card) {
	return Boolean(card.metadata?.archivedAt);
}
function cardHasActiveClaim(card, now) {
	const claim = card.metadata?.claim;
	return Boolean(claim && isFutureDateTimestampMs(claim.expiresAt, { nowMs: now }));
}
function buildExecution(params) {
	return {
		id: params.card.execution?.id ?? `${params.card.id}:agent-session`,
		kind: "agent-session",
		mode: "autonomous",
		status: "running",
		...params.runtime ? {
			engine: params.runtime.harness,
			model: `${params.runtime.provider}/${params.runtime.model}`
		} : {},
		sessionKey: params.sessionKey,
		runId: params.runId,
		startedAt: params.now,
		updatedAt: params.now
	};
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
function buildWorkerPrompt(params) {
	return [
		`Work on this OpenClaw Workboard card: ${params.card.title}`,
		"",
		"## Worker protocol",
		`Card id: ${params.card.id}`,
		`Claim ownerId: ${params.ownerId}`,
		`Claim token: ${params.token}`,
		"",
		"Heartbeat with workboard_heartbeat using the card id and token while working.",
		"When done, call workboard_complete with the card id, token, summary, and proof.",
		"If you recorded proof separately, pass its returned proofId to workboard_complete.",
		"If blocked, call workboard_block with the card id, token, and reason.",
		"",
		params.context
	].join("\n");
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
	const runningByOwner = /* @__PURE__ */ new Map();
	for (const card of cards) {
		if (!workboardCardConsumesOwnerSlot(card, now)) continue;
		const owner = workboardCardSlotOwner(card);
		runningByOwner.set(owner, (runningByOwner.get(owner) ?? 0) + 1);
	}
	const selected = [];
	const fallback = [];
	const selectedOwners = /* @__PURE__ */ new Set();
	const ordered = mode === "scheduled" ? candidates.toSorted(sortReadyCards) : candidates;
	for (const card of ordered) {
		const owner = ownerOverride || workboardCardSlotOwner(card, now);
		const rejection = cardIsArchived(card) ? "Card is archived; restore it before starting." : cardHasActiveClaim(card, now) ? `Card is already claimed by ${card.metadata?.claim?.ownerId ?? "another worker"}.` : mode === "scheduled" && card.status !== "ready" ? "" : mode === "exact" && card.status !== "backlog" && card.status !== "todo" && card.status !== "ready" ? `Card cannot start from ${card.status}; move it to backlog, todo, or ready first.` : (runningByOwner.get(owner) ?? 0) > 0 ? `Owner ${owner} already has active Workboard work; complete or stop it before starting another card.` : void 0;
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
	let acceptedStarts = 0;
	let attemptedStarts = 0;
	const selection = selectStartableCards(cards, maxStarts, candidates, ownerOverride, now, directCardId ? "exact" : "scheduled");
	if (selection.rejection) startFailures.push(selection.rejection);
	for (const card of selection.cards) {
		const ownerId = ownerOverride || workboardCardSlotOwner(card, now);
		if (acceptedStarts >= maxStarts || attemptedStarts >= maxAttempts) break;
		if (startedOwners.has(ownerId)) continue;
		const sessionKey = workboardSessionKeyForCard(card);
		let claimValue = "";
		let materializedWorkspace;
		let implicitWorkspaceCwd;
		let runStarted = false;
		let workspaceMutation;
		let preparedLaunch;
		const requestedWorkspace = card.metadata?.automation?.workspace;
		let workspaceAccess;
		let targetWorkspace;
		let persistWorkspaceAccess;
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
					await assertRestrictedWorkboardTarget({
						root: implicitWorkspaceCwd,
						agentId: card.agentId,
						sessionKey,
						modelProvider: params.options?.provider,
						modelId: params.options?.model,
						resolveAgentWorkspaceRuntime: params.options?.resolveAgentWorkspaceRuntime,
						worktrees: params.worktrees
					});
				}
			} else {
				const canonicalSourcePath = await assertWorkboardWorkspaceSourceAccess(requestedWorkspace, workspaceAccess);
				if (canonicalSourcePath && requestedWorkspace.kind === "dir" && workspaceAccess.unrestricted) await assertCanonicalWorkboardRootAccess(canonicalSourcePath, workspaceAccess);
				if (canonicalSourcePath && !workspaceAccess.unrestricted) {
					await assertCanonicalWorkboardRootAccess(canonicalSourcePath, workspaceAccess);
					await assertRestrictedWorkboardTarget({
						root: canonicalSourcePath,
						agentId: card.agentId,
						sessionKey,
						modelProvider: params.options?.provider,
						modelId: params.options?.model,
						resolveAgentWorkspaceRuntime: params.options?.resolveAgentWorkspaceRuntime,
						worktrees: params.worktrees
					});
				}
			}
		} catch (error) {
			startFailures.push({
				cardId: card.id,
				title: card.title,
				error: formatErrorMessage(error)
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
			if (runCwd && !workspaceAccess.unrestricted) await assertRestrictedWorkboardTarget({
				root: runCwd,
				agentId: card.agentId,
				sessionKey,
				modelProvider: params.options?.provider,
				modelId: params.options?.model,
				resolveAgentWorkspaceRuntime: params.options?.resolveAgentWorkspaceRuntime,
				worktrees: params.worktrees
			});
			materializedWorkspace = materialized.workspace;
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
				message: buildWorkerPrompt({
					card: claimed.card,
					context,
					ownerId,
					token: claimValue
				}),
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
			const acceptedExecution = buildExecution({
				card: launched,
				sessionKey: acceptedSessionKey,
				runId: run.runId,
				runtime: run.runtime,
				now
			});
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
			acceptedStarts += 1;
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
function respondError(respond, error) {
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
function registerWorkboardResultMethods(api, methods) {
	for (const [method, scope, handler] of methods) api.registerGatewayMethod(method, async (context) => {
		try {
			context.respond(true, await handler(context));
		} catch (error) {
			respondError(context.respond, error);
		}
	}, { scope });
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
	const patch = params.patch;
	if (patch && typeof patch === "object" && !Array.isArray(patch)) return patch;
	return params;
}
function assertNoCursorAdvance(params) {
	if (params.advance === true) throw new Error("notification cursor advancement requires workboard.notifications.advance.");
}
async function listWorkboardCards(store, boardId, redactCard) {
	const [cards, { boards }] = await Promise.all([store.list({ boardId }), store.listBoards()]);
	return {
		cards: cards.map(redactCard),
		boards,
		statuses: WORKBOARD_STATUSES
	};
}
function resolveGatewayWorkboardWorkspaceAccess(params) {
	if (!params.client) return { unrestricted: true };
	if ((Array.isArray(params.client?.connect?.scopes) ? params.client.connect.scopes : []).includes("operator.admin")) return { unrestricted: true };
	return resolveConfiguredWorkboardWorkspaceAccess({
		config: params.context.getRuntimeConfig(),
		unrestricted: false
	});
}
function gatewayDispatchOptions(params) {
	const { context, client } = params.request;
	return {
		...params.input,
		materializeWorktree: true,
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
	};
}
function createWorkboardDispatchHandler(params) {
	return async ({ params: requestParams, respond, client, context }, options) => {
		try {
			const cardId = options.directCard ? readId(requestParams) : void 0;
			const boardId = requestParams && typeof requestParams === "object" && "boardId" in requestParams ? requestParams.boardId : void 0;
			const rawMaxStarts = requestParams && typeof requestParams === "object" && "maxStarts" in requestParams ? requestParams.maxStarts : void 0;
			if (!options.supportsMaxStarts && rawMaxStarts !== void 0) throw new Error("maxStarts requires workboard.cards.dispatchWithOptions.");
			const maxStarts = options.supportsMaxStarts ? readOptionalPositiveInteger(rawMaxStarts, "maxStarts") : void 0;
			const provider = options.directCard && typeof requestParams.provider === "string" && requestParams.provider.trim() ? requestParams.provider.trim() : void 0;
			const model = options.directCard && typeof requestParams.model === "string" && requestParams.model.trim() ? requestParams.model.trim() : void 0;
			const result = await dispatchAndStartWorkboardCards({
				store: params.store,
				subagent: params.api.runtime.subagent,
				worktrees: params.api.runtime.worktrees,
				options: gatewayDispatchOptions({
					api: params.api,
					request: {
						context,
						client
					},
					input: {
						...cardId ? {
							cardId,
							maxStarts: 1
						} : {},
						boardId: typeof boardId === "string" ? boardId : void 0,
						...maxStarts !== void 0 ? { maxStarts } : {},
						...provider ? { provider } : {},
						...model ? { model } : {}
					}
				})
			});
			if (cardId) {
				const started = result.started[0];
				if (!started?.card) throw new Error(result.startFailures[0]?.error ?? "Workboard card did not start.");
				respond(true, {
					...started,
					card: params.redactCard(started.card)
				});
				return;
			}
			respond(true, {
				...result,
				promoted: result.promoted.map(params.redactCard),
				reclaimed: result.reclaimed.map(params.redactCard),
				blocked: result.blocked.map(params.redactCard),
				orchestrated: result.orchestrated.map(params.redactCard)
			});
		} catch (error) {
			respondError(respond, error);
		}
	};
}
//#endregion
//#region extensions/workboard/src/gateway-workspace-methods.ts
const WRITE_SCOPE$1 = "operator.write";
async function resolveGatewayWorkspaceMutationAccess(request, value) {
	const access = await canonicalizeWorkboardWorkspaceAccess(resolveGatewayWorkboardWorkspaceAccess({
		context: request.context,
		client: request.client
	}));
	await assertWorkboardWorkspaceMutationAccess(value, access);
	return access;
}
function registerWorkboardWorkspaceCardMethods(params) {
	const { api, store, redactCard } = params;
	registerWorkboardResultMethods(api, [
		[
			"workboard.cards.create",
			WRITE_SCOPE$1,
			async (request) => {
				const input = withoutWorkboardWorkspaceAccess(request.params);
				const access = await resolveGatewayWorkspaceMutationAccess(request, input);
				return { card: redactCard(await store.create(withWorkboardWorkspaceAccess(input, access))) };
			}
		],
		[
			"workboard.cards.captureSession",
			WRITE_SCOPE$1,
			async (request) => {
				const input = withoutWorkboardWorkspaceAccess(request.params);
				const access = await resolveGatewayWorkspaceMutationAccess(request, input);
				return { card: redactCard(await store.captureSession(withWorkboardWorkspaceAccess(input, access))) };
			}
		],
		[
			"workboard.cards.update",
			WRITE_SCOPE$1,
			async (request) => {
				const { params: requestParams } = request;
				const patch = withoutWorkboardWorkspaceAccess(readPatch(requestParams));
				const access = await resolveGatewayWorkspaceMutationAccess(request, patch);
				const expectedUpdatedAt = readExpectedUpdatedAt(requestParams);
				return { card: redactCard(await store.update(readId(requestParams), containsWorkboardWorkspaceMutation(patch) ? withWorkboardWorkspaceAccess(patch, access) : patch, { expectedUpdatedAt })) };
			}
		]
	]);
}
function registerWorkboardWorkspaceBulkMethod(params) {
	const { api, store, redactCard } = params;
	registerWorkboardResultMethods(api, [[
		"workboard.cards.bulk",
		WRITE_SCOPE$1,
		async (request) => {
			const { params: requestParams } = request;
			const sanitizedParams = withoutWorkboardWorkspaceAccess(requestParams);
			const patch = withoutWorkboardWorkspaceAccess(readPatch(requestParams));
			const access = await resolveGatewayWorkspaceMutationAccess(request, patch);
			return { cards: (await store.bulkUpdate({
				...sanitizedParams,
				patch: containsWorkboardWorkspaceMutation(patch) ? withWorkboardWorkspaceAccess(patch, access) : patch
			})).cards.map(redactCard) };
		}
	]]);
}
function registerWorkboardWorkspaceBoardMethod(params) {
	const { api, store } = params;
	registerWorkboardResultMethods(api, [[
		"workboard.boards.upsert",
		WRITE_SCOPE$1,
		async (request) => {
			const { params: requestParams } = request;
			await resolveGatewayWorkspaceMutationAccess(request, requestParams);
			return { board: await store.upsertBoard(requestParams) };
		}
	]]);
}
function registerWorkboardWorkspaceWorkflowMethods(params) {
	const { api, store, redactCard } = params;
	registerWorkboardResultMethods(api, [[
		"workboard.cards.specify",
		WRITE_SCOPE$1,
		async (request) => {
			const { params: requestParams } = request;
			const sanitizedParams = withoutWorkboardWorkspaceAccess(requestParams);
			const access = await resolveGatewayWorkspaceMutationAccess(request, sanitizedParams);
			const input = containsWorkboardWorkspaceMutation(sanitizedParams) ? withWorkboardWorkspaceAccess(sanitizedParams, access) : sanitizedParams;
			return { card: redactCard(await store.specify(readId(requestParams), input, null)) };
		}
	], [
		"workboard.cards.decompose",
		WRITE_SCOPE$1,
		async (request) => {
			const { params: requestParams } = request;
			const sanitizedParams = withoutWorkboardWorkspaceAccess(requestParams);
			const access = await resolveGatewayWorkspaceMutationAccess(request, sanitizedParams);
			const result = await store.decompose(readId(requestParams), withWorkboardDecomposeWorkspaceAccess(sanitizedParams, access), null);
			return {
				parent: redactCard(result.parent),
				children: result.children.map(redactCard)
			};
		}
	]]);
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
	const { api: hostApi } = params;
	const store = params.store ?? WorkboardStore.openSqlite(resolveWorkboardSqliteWorkerModuleUrl(hostApi.runtimeSource));
	if (!params.store) registerWorkboardStoreLifecycle(hostApi, store);
	const api = {
		...hostApi,
		registerGatewayMethod: (method, handler, options) => hostApi.registerGatewayMethod(method, async (request) => {
			try {
				return await store.runOperation(() => handler(request));
			} catch (error) {
				respondError(request.respond, error);
			}
		}, options)
	};
	const dispatchCards = createWorkboardDispatchHandler({
		api,
		store,
		redactCard: redactClaimToken
	});
	registerWorkboardResultMethods(api, [[
		"workboard.cards.list",
		READ_SCOPE,
		async ({ params: requestParams }) => await listWorkboardCards(store, requestParams.boardId, redactClaimToken)
	]]);
	registerWorkboardWorkspaceCardMethods({
		api,
		store,
		redactCard: redactClaimToken
	});
	api.registerGatewayMethod("workboard.cards.start", async (context) => await dispatchCards(context, {
		supportsMaxStarts: false,
		directCard: true
	}), { scope: WRITE_SCOPE });
	registerWorkboardResultMethods(api, [
		[
			"workboard.cards.move",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.move(readId(requestParams), requestParams.status, requestParams.position, void 0, { expectedUpdatedAt: readExpectedUpdatedAt(requestParams) }))
		],
		[
			"workboard.cards.delete",
			WRITE_SCOPE,
			({ params: requestParams }) => store.delete(readId(requestParams), { expectedUpdatedAt: readExpectedUpdatedAt(requestParams) })
		],
		[
			"workboard.cards.comment",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.addComment(readId(requestParams), requestParams))
		],
		[
			"workboard.cards.link",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.addLink(readId(requestParams), requestParams))
		],
		[
			"workboard.cards.linkDependency",
			WRITE_SCOPE,
			({ params: requestParams }) => {
				const parentId = requestParams.parentId;
				const childId = requestParams.childId;
				if (typeof parentId !== "string" || typeof childId !== "string") throw new Error("parentId and childId are required.");
				return redactCardResult(store.linkCards(parentId, childId));
			}
		],
		[
			"workboard.cards.proof",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.addProof(readId(requestParams), requestParams))
		],
		[
			"workboard.cards.artifact",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.addArtifact(readId(requestParams), requestParams))
		],
		[
			"workboard.cards.claim",
			WRITE_SCOPE,
			async ({ params: requestParams }) => {
				const claimed = await store.claim(readId(requestParams), requestParams);
				return {
					...claimed,
					card: redactClaimToken(claimed.card)
				};
			}
		],
		[
			"workboard.cards.heartbeat",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.heartbeat(readId(requestParams), requestParams))
		],
		[
			"workboard.cards.release",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.releaseClaim(readId(requestParams), requestParams))
		],
		[
			"workboard.cards.promote",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.promote(readId(requestParams), requestParams, null))
		],
		[
			"workboard.cards.reassign",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.reassign(readId(requestParams), requestParams, null))
		],
		[
			"workboard.cards.reclaim",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.reclaim(readId(requestParams), requestParams, null))
		],
		[
			"workboard.cards.complete",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.complete(readId(requestParams), requestParams, null))
		],
		[
			"workboard.cards.block",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.block(readId(requestParams), requestParams, null))
		],
		[
			"workboard.cards.unblock",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.unblock(readId(requestParams)))
		]
	]);
	registerWorkboardWorkspaceBulkMethod({
		api,
		store,
		redactCard: redactClaimToken
	});
	registerWorkboardResultMethods(api, [[
		"workboard.cards.diagnostics",
		READ_SCOPE,
		async () => redactDiagnosticsRows(await store.diagnostics())
	], [
		"workboard.cards.diagnostics.refresh",
		WRITE_SCOPE,
		async () => redactDiagnosticsRows(await store.refreshDiagnostics())
	]]);
	api.registerGatewayMethod("workboard.cards.dispatch", async (context) => await dispatchCards(context, { supportsMaxStarts: false }), { scope: WRITE_SCOPE });
	api.registerGatewayMethod("workboard.cards.dispatchWithOptions", async (context) => await dispatchCards(context, { supportsMaxStarts: true }), { scope: WRITE_SCOPE });
	registerWorkboardResultMethods(api, [[
		"workboard.boards.list",
		READ_SCOPE,
		() => store.listBoards()
	]]);
	registerWorkboardWorkspaceBoardMethod({
		api,
		store,
		redactCard: redactClaimToken
	});
	registerWorkboardResultMethods(api, [
		[
			"workboard.boards.archive",
			WRITE_SCOPE,
			async ({ params: requestParams }) => ({ board: await store.archiveBoard(requestParams.id, requestParams.archived) })
		],
		[
			"workboard.boards.delete",
			WRITE_SCOPE,
			({ params: requestParams }) => store.deleteBoard(requestParams.id)
		],
		[
			"workboard.cards.stats",
			READ_SCOPE,
			({ params: requestParams }) => store.stats({ boardId: requestParams.boardId })
		],
		[
			"workboard.cards.runs",
			READ_SCOPE,
			async ({ params: requestParams }) => {
				const result = await store.runs(readId(requestParams));
				return {
					...result,
					card: redactClaimToken(result.card)
				};
			}
		]
	]);
	registerWorkboardWorkspaceWorkflowMethods({
		api,
		store,
		redactCard: redactClaimToken
	});
	registerWorkboardResultMethods(api, [
		[
			"workboard.notifications.subscribe",
			WRITE_SCOPE,
			async ({ params: requestParams }) => ({ subscription: await store.subscribeNotifications(requestParams) })
		],
		[
			"workboard.notifications.list",
			READ_SCOPE,
			({ params: requestParams }) => store.listNotificationSubscriptions(requestParams)
		],
		[
			"workboard.notifications.delete",
			WRITE_SCOPE,
			({ params: requestParams }) => store.deleteNotificationSubscription(readId(requestParams))
		],
		[
			"workboard.notifications.events",
			READ_SCOPE,
			({ params: requestParams }) => {
				assertNoCursorAdvance(requestParams);
				return store.notificationEvents(requestParams);
			}
		],
		[
			"workboard.notifications.advance",
			WRITE_SCOPE,
			({ params: requestParams }) => store.advanceNotificationEvents(requestParams)
		],
		[
			"workboard.cards.attachments.list",
			READ_SCOPE,
			async ({ params: requestParams }) => {
				const result = await store.listAttachments(readId(requestParams));
				return {
					...result,
					card: redactClaimToken(result.card)
				};
			}
		],
		[
			"workboard.cards.attachments.get",
			READ_SCOPE,
			async ({ params: requestParams }) => {
				const attachment = await store.getAttachment(readId(requestParams));
				if (!attachment) throw new Error(`attachment not found: ${readId(requestParams)}`);
				return attachment;
			}
		],
		[
			"workboard.cards.attachments.add",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.addAttachment(readId(requestParams), requestParams))
		],
		[
			"workboard.cards.attachments.delete",
			WRITE_SCOPE,
			({ params: requestParams }) => {
				const attachmentId = requestParams.attachmentId;
				if (typeof attachmentId !== "string" || !attachmentId.trim()) throw new Error("attachmentId is required.");
				return redactCardResult(store.deleteAttachment(readId(requestParams), attachmentId.trim()));
			}
		],
		[
			"workboard.cards.workerLog",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.addWorkerLog(readId(requestParams), requestParams))
		],
		[
			"workboard.cards.protocolViolation",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.recordProtocolViolation(readId(requestParams), requestParams))
		],
		[
			"workboard.cards.archive",
			WRITE_SCOPE,
			({ params: requestParams }) => redactCardResult(store.archive(readId(requestParams), requestParams.archived, { expectedUpdatedAt: readExpectedUpdatedAt(requestParams) }))
		],
		[
			"workboard.cards.export",
			READ_SCOPE,
			async () => {
				const exported = await store.exportCards();
				return {
					...exported,
					cards: exported.cards.map(redactClaimToken)
				};
			}
		]
	]);
}
//#endregion
export { resolveWorkboardAgentWorkspace as _, workboardCardMatchesLifecycleLink as a, cardRunId as c, isWorkboardWorktreeCleanupCandidate as d, WORKBOARD_TOOL_NAMES as f, resolveCommandWorkboardWorkspaceAccess as g, resolveAgentWorkboardWorkspaceRuntime as h, WorkboardStore as i, cardSessionKey as l, guardWorkboardToolsForWorkspaceAccess as m, registerWorkboardStoreLifecycle as n, workboardCardSessionLookupKey as o, canonicalizeWorkboardWorkspaceAccess as p, dispatchAndStartWorkboardCards as r, cardBoardId as s, registerWorkboardGatewayMethods as t, cleanupWorkboardCardWorktree as u };
