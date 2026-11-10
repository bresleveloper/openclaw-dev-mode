import { i as normalizeBoundedOptionalString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { D as resolveExpiresAtMsFromDurationMs, N as resolveOptionalIntegerOption, g as isFutureDateTimestampMs, j as resolveIntegerOption, t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import { a as WORKBOARD_EXECUTION_STATUSES, c as WORKBOARD_PRIORITIES, d as WORKBOARD_TEMPLATE_IDS, f as isValidWorkboardBoardId, i as WORKBOARD_EXECUTION_MODES, l as WORKBOARD_PROOF_STATUSES, n as WORKBOARD_DIAGNOSTIC_KINDS, o as WORKBOARD_LINK_TYPES, r as WORKBOARD_DIAGNOSTIC_SEVERITIES, s as WORKBOARD_NOTIFICATION_KINDS, t as WORKBOARD_ATTEMPT_STATUSES, u as WORKBOARD_STATUSES } from "./src-uqZESs4H.mjs";
import { t as definedFields } from "./record-fields-BHIzSIrv.mjs";
import { randomUUID } from "node:crypto";
//#region packages/workboard-contract/src/sessions-board.ts
const OBSERVER_HEALTH = [
	"on-track",
	"grinding",
	"stuck",
	"waiting-on-user",
	"wrapping-up",
	"done",
	"failed"
];
const RUN_STATES = [
	"active",
	"idle",
	"failed"
];
const PULL_REQUEST_STATES = [
	"none",
	"open",
	"draft",
	"merged",
	"closed"
];
const COLUMN_COLORS = /* @__PURE__ */ new Set([
	"red",
	"blue",
	"green",
	"yellow",
	"purple",
	"orange",
	"pink",
	"cyan"
]);
function createDefaultWorkboardSessionsBoardSpec() {
	return { columns: [
		{
			id: "needs-input",
			label: "Needs input",
			color: "yellow",
			description: "Observer health is waiting-on-user.",
			match: { health: ["waiting-on-user"] }
		},
		{
			id: "stuck",
			label: "Stuck",
			color: "red",
			description: "Observer health is stuck or failed, or the run failed.",
			match: [{ health: ["stuck", "failed"] }, { run: ["failed"] }]
		},
		{
			id: "working",
			label: "Working",
			color: "blue",
			description: "The run is active.",
			match: { run: ["active"] }
		},
		{
			id: "in-review",
			label: "In review",
			color: "orange",
			description: "A pull request is open or draft.",
			match: { pullRequest: ["open", "draft"] }
		},
		{
			id: "merged",
			label: "Merged",
			color: "purple",
			description: "A pull request is merged.",
			match: { pullRequest: ["merged"] }
		},
		{
			id: "done",
			label: "Done",
			color: "green",
			description: "Observer health is done, or no earlier column rule matches.",
			match: { health: ["done"] },
			fallback: true
		}
	] };
}
function record(value, name, keys) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${name} must be an object.`);
	const result = Object.fromEntries(Object.entries(value));
	const unexpected = Object.keys(result).find((key) => !keys.includes(key));
	if (unexpected) throw new Error(`Unknown ${name} field: ${unexpected}.`);
	return result;
}
function text(value, name, min, max = Number.MAX_SAFE_INTEGER) {
	if (typeof value !== "string" || value.trim().length < min || value.trim().length > max) throw new Error(`${name} must be a string with ${min}..${max} characters.`);
	return value.trim();
}
function boolean(value, name) {
	if (typeof value !== "boolean") throw new Error(`${name} must be a boolean.`);
	return value;
}
function choices(value, name, allowed) {
	if (!Array.isArray(value)) throw new Error(`${name} must be an array.`);
	return [...new Set(value.map((entry) => {
		const selected = allowed.find((candidate) => candidate === entry);
		if (selected === void 0) throw new Error(`${name} contains an unsupported value.`);
		return selected;
	}))];
}
function normalizeMatch(value) {
	const input = record(value, "column match", [
		"health",
		"run",
		"pullRequest",
		"archived"
	]);
	return {
		...input.health !== void 0 ? { health: choices(input.health, "match.health", OBSERVER_HEALTH) } : {},
		...input.run !== void 0 ? { run: choices(input.run, "match.run", RUN_STATES) } : {},
		...input.pullRequest !== void 0 ? { pullRequest: choices(input.pullRequest, "match.pullRequest", PULL_REQUEST_STATES) } : {},
		...input.archived !== void 0 ? { archived: boolean(input.archived, "match.archived") } : {}
	};
}
function normalizeColumn(value) {
	const input = record(value, "column", [
		"id",
		"label",
		"color",
		"description",
		"match",
		"fallback"
	]);
	const id = text(input.id, "column id", 1, 48);
	if (!/^[a-z0-9][a-z0-9-]{0,47}$/.test(id)) throw new Error("column id must be a lowercase slug with 1..48 characters.");
	const color = input.color === void 0 ? void 0 : text(input.color, "column color", 1, 40);
	if (color !== void 0 && !COLUMN_COLORS.has(color)) throw new Error("column color must be an existing board color token.");
	const rules = input.match === void 0 ? void 0 : (Array.isArray(input.match) ? input.match : [input.match]).map(normalizeMatch);
	if (rules?.length === 0) throw new Error("column match must contain at least one rule.");
	return {
		id,
		label: text(input.label, "column label", 1, 60),
		...color !== void 0 ? { color } : {},
		description: text(input.description, "column description", 1, 400),
		...rules !== void 0 ? { match: rules.length === 1 ? rules[0] : rules } : {},
		...input.fallback !== void 0 ? { fallback: boolean(input.fallback, "column fallback") } : {}
	};
}
function normalizeScope(value) {
	const input = record(value, "scope", [
		"agentIds",
		"includeArchived",
		"includeAutomation",
		"includeHome",
		"maxAgeHours"
	]);
	let agentIds;
	if (input.agentIds !== void 0) {
		if (!Array.isArray(input.agentIds)) throw new Error("scope.agentIds must be an array.");
		agentIds = [...new Set(input.agentIds.map((id) => text(id, "agent id", 1)))];
	}
	const maxAgeHours = input.maxAgeHours;
	if (maxAgeHours !== void 0 && (typeof maxAgeHours !== "number" || !Number.isFinite(maxAgeHours) || maxAgeHours <= 0)) throw new Error("scope.maxAgeHours must be a positive finite number.");
	return {
		...agentIds !== void 0 ? { agentIds } : {},
		...input.includeArchived !== void 0 ? { includeArchived: boolean(input.includeArchived, "scope.includeArchived") } : {},
		...input.includeAutomation !== void 0 ? { includeAutomation: boolean(input.includeAutomation, "scope.includeAutomation") } : {},
		...input.includeHome !== void 0 ? { includeHome: boolean(input.includeHome, "scope.includeHome") } : {},
		...maxAgeHours !== void 0 ? { maxAgeHours } : {}
	};
}
const SPEC_KEYS = [
	"columns",
	"scope",
	"agentSessionKey"
];
/** Shared validation for durable specifications, agent tools, and the board editor. */
function normalizeWorkboardSessionsBoardSpec(value) {
	const input = record(value, "sessions board specification", [...SPEC_KEYS, "instructions"]);
	if (!Array.isArray(input.columns) || input.columns.length < 2 || input.columns.length > 12) throw new Error("sessions board columns must contain 2..12 columns.");
	const columns = input.columns.map(normalizeColumn);
	if (new Set(columns.map((column) => column.id)).size !== columns.length) throw new Error("sessions board column ids must be unique.");
	if (columns.filter((column) => column.fallback).length !== 1) throw new Error("sessions board must have exactly one fallback column.");
	return {
		columns,
		...input.scope !== void 0 ? { scope: normalizeScope(input.scope) } : {},
		...input.agentSessionKey !== void 0 ? { agentSessionKey: text(input.agentSessionKey, "agentSessionKey", 1) } : {}
	};
}
/** Columns and scope replace their previous values; omitted fields stay unchanged. */
function patchWorkboardSessionsBoardSpec(current, value) {
	const patch = record(value, "sessions board patch", SPEC_KEYS);
	return normalizeWorkboardSessionsBoardSpec({
		...current,
		...patch
	});
}
//#endregion
//#region extensions/workboard/src/store-constants.ts
const POSITION_STEP = 1e3;
const MAX_CARDS = 2e3;
const MAX_ATTACHMENT_BYTES = 262144;
const MAX_CARD_METADATA_BYTES = 24576;
const DEFAULT_CLAIM_TTL_MS = 18e5;
const DEFAULT_WORKBOARD_DISPATCH_OWNER = "workboard-dispatcher";
const READY_STRANDED_MS = 36e5;
const RUNNING_HEARTBEAT_STALE_MS = 12e5;
const BLOCKED_TOO_LONG_MS = 864e5;
const CLAIM_RECLAIM_MS = 3e5;
function isWorkboardClaimReclaimable(claim, now) {
	return Boolean(claim?.expiresAt && now - claim.expiresAt > CLAIM_RECLAIM_MS);
}
function workboardCardConsumesOwnerSlot(card, now) {
	const claim = card.metadata?.claim;
	const activeClaim = claim && isFutureDateTimestampMs(claim.expiresAt, { nowMs: now });
	return !card.metadata?.archivedAt && !isWorkboardClaimReclaimable(claim, now) && (card.status === "running" || card.status !== "done" && activeClaim || card.execution?.status === "running");
}
function workboardCardSlotOwner(card, now) {
	const claim = card.metadata?.claim;
	return (claim && (now === void 0 || isFutureDateTimestampMs(claim.expiresAt, { nowMs: now })) ? claim.ownerId : void 0) || card.agentId || "workboard-dispatcher";
}
function secondsToDurationMs(seconds) {
	const ms = Math.trunc(seconds) * 1e3;
	return Number.isFinite(ms) ? Math.min(MAX_DATE_TIMESTAMP_MS, Math.max(1, ms)) : MAX_DATE_TIMESTAMP_MS;
}
function addWorkboardDurationMs(now, durationMs) {
	return resolveExpiresAtMsFromDurationMs(durationMs, { nowMs: now }) ?? 864e13;
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
function normalizeNotificationSubscription(input) {
	const now = Date.now();
	const boardId = normalizeBoardId(input.boardId) ?? "default";
	const cardId = normalizeBoundedString(input.cardId, void 0, 120, "card id");
	const sessionKey = normalizeBoundedString(input.sessionKey, void 0, 240, "session key");
	const runId = normalizeRunId(input.runId);
	const target = normalizeBoundedString(input.target, void 0, 240, "notification target");
	if (!cardId && !sessionKey && !runId && !target) throw new Error("notification subscription needs cardId, sessionKey, runId, or target.");
	const eventKinds = normalizeNotificationKinds(input.eventKinds);
	return definedFields({
		id: randomUUID(),
		boardId,
		cardId,
		sessionKey,
		runId,
		target,
		eventKinds,
		createdAt: now,
		updatedAt: now
	});
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
function normalizeRunId(value) {
	return normalizeBoundedString(value, void 0, 512, "run id");
}
function capText(value, max) {
	if (!value) return;
	return value.length <= max ? value : `${truncateUtf16Safe(value, Math.max(0, max - 1))}…`;
}
function normalizeStatus(value, fallback) {
	return normalizeEnumValue(value, WORKBOARD_STATUSES, fallback, "status");
}
function normalizePriority(value, fallback) {
	return normalizeEnumValue(value, WORKBOARD_PRIORITIES, fallback, "priority");
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
function normalizePositiveInteger(value, fieldName) {
	if (value == null || value === "") return;
	if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${fieldName} must be a number.`);
	return Math.max(1, Math.trunc(value));
}
function normalizeWorkspace(record, fallback) {
	if (!isRecord(record)) return fallback;
	const kind = record.kind === "scratch" || record.kind === "dir" || record.kind === "worktree" ? record.kind : fallback?.kind;
	if (!kind) throw new Error("workspace kind must be scratch, dir, or worktree.");
	const workspacePath = normalizeBoundedString(record.path, fallback?.path, 2e3, "workspace path");
	if (kind === "dir" && (!workspacePath || !isAbsoluteWorkspacePath(workspacePath))) throw new Error("dir workspace path must be absolute.");
	const workspaceFallback = workspacePath === fallback?.path ? fallback : void 0;
	const branch = normalizeBoundedString(record.branch, workspaceFallback?.branch, 160, "workspace branch");
	const sourcePath = normalizeBoundedString(record.sourcePath, workspaceFallback?.sourcePath, 2e3, "workspace source path");
	if (sourcePath && !isAbsoluteWorkspacePath(sourcePath)) throw new Error("workspace source path must be absolute.");
	const sourceBranch = normalizeBoundedString(record.sourceBranch, workspaceFallback?.sourceBranch, 160, "workspace source branch");
	return definedFields({
		kind,
		path: workspacePath || void 0,
		branch: branch || void 0,
		sourcePath: kind === "worktree" ? sourcePath || void 0 : void 0,
		sourceBranch: kind === "worktree" ? sourceBranch || void 0 : void 0
	});
}
function normalizeAutomation(value, fallback = {}, options = {}) {
	const record = isRecord(value) ? value : {};
	const timestamp = (key) => Object.hasOwn(record, key) ? normalizeTimestamp(record[key], 0) : fallback[key];
	const strings = (key, name, limit = 80) => Object.hasOwn(record, key) ? normalizeStringList(record[key], name, limit) : fallback[key];
	const next = {
		tenant: normalizeBoundedString(record.tenant, fallback.tenant, 80, "tenant"),
		boardId: Object.hasOwn(record, "boardId") ? normalizeBoardId(record.boardId, fallback.boardId) : fallback.boardId,
		createdByCardId: normalizeBoundedString(record.createdByCardId, fallback.createdByCardId, 120, "created by card id"),
		idempotencyKey: normalizeBoundedString(record.idempotencyKey, fallback.idempotencyKey, 160, "idempotency key"),
		skills: strings("skills", "skills"),
		workspace: Object.hasOwn(record, "workspace") ? normalizeWorkspace(record.workspace, fallback.workspace) : fallback.workspace,
		workspaceAccess: fallback.workspaceAccess,
		maxRuntimeSeconds: Object.hasOwn(record, "maxRuntimeSeconds") ? normalizePositiveInteger(record.maxRuntimeSeconds, "max runtime seconds") : fallback.maxRuntimeSeconds,
		maxRetries: Object.hasOwn(record, "maxRetries") ? normalizePositiveInteger(record.maxRetries, "max retries") : fallback.maxRetries,
		scheduledAt: timestamp("scheduledAt") || void 0,
		summary: normalizeBoundedString(record.summary, fallback.summary, 2e3, "summary"),
		createdCardIds: strings("createdCardIds", "created card ids", 120),
		dispatchCount: timestamp("dispatchCount") || void 0,
		lastDispatchAt: timestamp("lastDispatchAt") || void 0,
		launch: options.launch ? normalizeLaunchState(options.launch) : fallback.launch
	};
	for (const [key, entry] of Object.entries(next)) if (!entry || typeof entry === "object" && Object.keys(entry).length === 0) Reflect.deleteProperty(next, key);
	return Object.keys(next).length ? next : void 0;
}
function normalizeLaunchTimestamp(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.trunc(value) : void 0;
}
function normalizeLaunchState(value) {
	if (!isRecord(value)) return;
	const requestedSessionKey = normalizeBoundedOptionalString(value.requestedSessionKey, 240);
	const provisionalRunId = normalizeRunId(value.provisionalRunId);
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
		const acceptedSessionKey = normalizeBoundedOptionalString(value.acceptedSessionKey, 240);
		const acceptedRunId = normalizeRunId(value.acceptedRunId);
		return acceptedAt === void 0 || !acceptedSessionKey ? void 0 : definedFields({
			phase: "accepted",
			...identity,
			acceptedAt,
			acceptedSessionKey,
			acceptedRunId
		});
	}
	if (value.phase === "failed") {
		const failedAt = normalizeLaunchTimestamp(value.failedAt);
		const reason = normalizeBoundedOptionalString(value.reason, 800);
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
function normalizeEnumValue(value, allowed, fallback, fieldName) {
	if (typeof value === "string" && allowed.includes(value)) return value;
	if (fieldName && typeof value === "string" && value.trim()) throw new Error(`${fieldName} must be one of: ${allowed.join(", ")}.`);
	return fallback;
}
function normalizeLinkType(value, fallback) {
	return normalizeEnumValue(value, WORKBOARD_LINK_TYPES, fallback);
}
function normalizeTemplateId(value) {
	return normalizeEnumValue(value, WORKBOARD_TEMPLATE_IDS, void 0);
}
function normalizeTimestamp(value, fallback) {
	return resolveOptionalIntegerOption(value, { min: 0 }) ?? fallback;
}
function normalizeAttempt(record) {
	const id = normalizeOptionalString(record.id);
	const startedAt = normalizeTimestamp(record.startedAt, 0);
	if (!id || !startedAt) return null;
	const error = normalizeBoundedString(record.error, void 0, 800, "attempt error");
	const engine = normalizeBoundedString(record.engine, void 0, 160, "attempt engine");
	const model = normalizeBoundedString(record.model, void 0, 160, "attempt model");
	return definedFields({
		id,
		status: normalizeEnumValue(record.status, WORKBOARD_ATTEMPT_STATUSES, "running"),
		startedAt,
		endedAt: normalizeTimestamp(record.endedAt, 0) || void 0,
		engine,
		mode: normalizeEnumValue(record.mode, WORKBOARD_EXECUTION_MODES, void 0),
		model,
		sessionKey: normalizeOptionalString(record.sessionKey),
		runId: normalizeOptionalString(record.runId),
		error
	});
}
function normalizeComment(record) {
	const id = normalizeOptionalString(record.id);
	const body = normalizeBoundedString(record.body, void 0, 2e3, "comment body");
	const createdAt = normalizeTimestamp(record.createdAt, 0);
	if (!id || !body || !createdAt) return null;
	return definedFields({
		id,
		body,
		createdAt,
		updatedAt: normalizeTimestamp(record.updatedAt, 0) || void 0
	});
}
function normalizeLink(record) {
	if (!isRecord(record)) return null;
	const id = normalizeOptionalString(record.id);
	const createdAt = normalizeTimestamp(record.createdAt, 0);
	if (!id || !createdAt) return null;
	const targetCardId = normalizeBoundedString(record.targetCardId, void 0, 120, "link target");
	const title = normalizeBoundedString(record.title, void 0, 180, "link title");
	const url = normalizeBoundedString(record.url, void 0, 2e3, "link URL");
	if (!targetCardId && !url) return null;
	return definedFields({
		id,
		type: normalizeLinkType(record.type, "relates_to"),
		createdAt,
		targetCardId,
		title,
		url
	});
}
function isDependencyLink(link) {
	return link.type === "parent" || link.type === "child";
}
function normalizeProof(record) {
	const id = normalizeOptionalString(record.id);
	const createdAt = normalizeTimestamp(record.createdAt, 0);
	if (!id || !createdAt) return null;
	return normalizeProofInput(record, createdAt, id);
}
function normalizeArtifact(record) {
	if (!isRecord(record)) return null;
	const id = normalizeOptionalString(record.id) ?? randomUUID();
	const createdAt = normalizeTimestamp(record.createdAt, Date.now());
	const label = normalizeBoundedString(record.label, void 0, 160, "artifact label");
	const url = normalizeBoundedString(record.url, void 0, 2e3, "artifact URL");
	const artifactPath = normalizeBoundedString(record.path, void 0, 2e3, "artifact path");
	const mimeType = normalizeBoundedString(record.mimeType, void 0, 160, "artifact MIME type");
	if (!url && !artifactPath) return null;
	return definedFields({
		id,
		createdAt,
		label,
		url,
		path: artifactPath,
		mimeType
	});
}
function normalizeAttachment(record) {
	const id = normalizeOptionalString(record.id);
	const cardId = normalizeBoundedString(record.cardId, void 0, 120, "card id");
	const fileName = normalizeBoundedString(record.fileName, void 0, 240, "attachment file name");
	const createdAt = normalizeTimestamp(record.createdAt, 0);
	const byteSize = normalizeTimestamp(record.byteSize, 0);
	if (!id || !cardId || !fileName || !createdAt || byteSize <= 0) return null;
	const mimeType = normalizeBoundedString(record.mimeType, void 0, 160, "attachment MIME type");
	const note = normalizeBoundedString(record.note, void 0, 400, "attachment note");
	return definedFields({
		id,
		cardId,
		createdAt,
		fileName,
		byteSize,
		mimeType,
		note
	});
}
function normalizeWorkerLog(record) {
	const id = normalizeOptionalString(record.id);
	const message = normalizeBoundedString(record.message, void 0, 800, "worker log message");
	const createdAt = normalizeTimestamp(record.createdAt, 0);
	if (!id || !message || !createdAt) return null;
	return workerLogEntry(record, message, createdAt, id);
}
function workerLogEntry(record, message, createdAt, id) {
	const level = record.level === "warning" || record.level === "error" || record.level === "info" ? record.level : "info";
	const sessionKey = normalizeBoundedString(record.sessionKey, void 0, 240, "session key");
	const runId = normalizeRunId(record.runId);
	return definedFields({
		id: id ?? randomUUID(),
		level,
		message,
		createdAt,
		sessionKey,
		runId
	});
}
function normalizeWorkerProtocol(record, fallback) {
	if (!isRecord(record)) return fallback;
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
	return definedFields({
		state,
		updatedAt,
		detail: detail || void 0
	});
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
		attachment: definedFields({
			id: randomUUID(),
			cardId,
			createdAt: now,
			fileName,
			byteSize,
			mimeType,
			note
		}),
		contentBase64
	};
}
function normalizeClaim(record, fallback) {
	if (!isRecord(record)) return fallback;
	const ownerId = normalizeBoundedString(record.ownerId, fallback?.ownerId, 120, "claim owner");
	const token = normalizeBoundedString(record.token, fallback?.token, 160, "claim token");
	const claimedAt = normalizeTimestamp(record.claimedAt, fallback?.claimedAt ?? Date.now());
	const lastHeartbeatAt = normalizeTimestamp(record.lastHeartbeatAt, fallback?.lastHeartbeatAt ?? claimedAt);
	const expiresAt = normalizeTimestamp(record.expiresAt, fallback?.expiresAt ?? 0);
	if (!ownerId || !token || !claimedAt || !lastHeartbeatAt) return;
	return definedFields({
		ownerId,
		token,
		claimedAt,
		lastHeartbeatAt,
		expiresAt: expiresAt || void 0
	});
}
function normalizeDiagnosticAction(record) {
	if (!isRecord(record)) return null;
	const kind = record.kind === "claim" || record.kind === "unblock" || record.kind === "reassign" || record.kind === "add_proof" || record.kind === "open_session" ? record.kind : void 0;
	const label = normalizeBoundedString(record.label, void 0, 120, "diagnostic action label");
	return kind && label ? {
		kind,
		label
	} : null;
}
function normalizeDiagnostic(record) {
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
		count: resolveIntegerOption(record.count, 1, { min: 1 }),
		actions: Array.isArray(record.actions) ? record.actions.map(normalizeDiagnosticAction).filter((action) => action !== null).slice(0, 4) : []
	};
}
function normalizeNotification(record) {
	const id = normalizeOptionalString(record.id) ?? randomUUID();
	const kind = normalizeEnumValue(record.kind, WORKBOARD_NOTIFICATION_KINDS, void 0);
	const createdAt = normalizeTimestamp(record.createdAt, Date.now());
	const sequence = normalizeTimestamp(record.sequence, 0) || void 0;
	const message = capText(normalizeOptionalString(record.message), 240);
	if (!kind || !message) return null;
	const sessionKey = normalizeBoundedString(record.sessionKey, void 0, 240, "session key");
	const runId = normalizeRunId(record.runId);
	return definedFields({
		id,
		kind,
		createdAt,
		sequence,
		message,
		sessionKey,
		runId
	});
}
function normalizeProofInput(input, now, id) {
	const label = normalizeBoundedString(input.label, void 0, 160, "proof label");
	const command = normalizeBoundedString(input.command, void 0, 1e3, "proof command");
	const url = normalizeBoundedString(input.url, void 0, 2e3, "proof URL");
	const note = normalizeBoundedString(input.note, void 0, 2e3, "proof note");
	return definedFields({
		id: id ?? randomUUID(),
		status: normalizeEnumValue(input.status, WORKBOARD_PROOF_STATUSES, "unknown"),
		createdAt: now,
		label,
		command,
		url,
		note
	});
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
	return Array.isArray(value) ? value.map((entry) => isRecord(entry) ? normalize(entry) : null).filter((entry) => entry !== null).slice(-limit) : fallback;
}
function normalizeMetadata(value, fallback = {}, options = {}) {
	if (!isRecord(value) && !options.automationLaunch) return trimMetadataToBudget(fallback, options);
	const record = isRecord(value) ? value : {};
	const stale = isRecord(record.stale) ? record.stale : null;
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
		automation: normalizeAutomation(Object.hasOwn(record, "automation") ? record.automation : {}, fallback.automation, { launch: options.automationLaunch }),
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
		failureCount: resolveOptionalIntegerOption(record.failureCount, { min: 0 }) ?? fallback.failureCount
	}, options);
}
function normalizeExecution(record) {
	if (!isRecord(record)) return;
	const now = Date.now();
	const engine = normalizeBoundedString(record.engine, void 0, 160, "execution engine");
	const model = normalizeBoundedString(record.model, void 0, 160, "execution model");
	const normalizedId = normalizeOptionalString(record.id);
	const sessionKey = normalizeOptionalString(record.sessionKey);
	const runId = normalizeRunId(record.runId);
	if (!normalizedId && !engine && !model && !sessionKey && !runId) return;
	const id = normalizedId ?? randomUUID();
	const startedAt = normalizeTimestamp(record.startedAt, now);
	const updatedAt = normalizeTimestamp(record.updatedAt, startedAt);
	return definedFields({
		id,
		kind: "agent-session",
		mode: normalizeEnumValue(record.mode, WORKBOARD_EXECUTION_MODES, "autonomous"),
		status: normalizeEnumValue(record.status, WORKBOARD_EXECUTION_STATUSES, "idle"),
		startedAt,
		updatedAt,
		engine,
		model,
		sessionKey,
		runId
	});
}
function syncExecutionSessionKey(execution, sessionKey) {
	if (!execution) return;
	return definedFields({
		...execution,
		sessionKey,
		updatedAt: Date.now()
	});
}
function removeUndefinedMetadataFields(metadata) {
	const next = definedFields({ ...metadata });
	for (const [key, value] of Object.entries(next)) if (Array.isArray(value) && value.length === 0 || key === "failureCount" && value === 0) Reflect.deleteProperty(next, key);
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
		for (const key of [
			"attempts",
			"diagnostics",
			"notifications",
			"proof",
			"artifacts",
			"attachments",
			"workerLogs",
			"links",
			"comments"
		]) {
			const entries = next[key];
			if (!entries?.length) continue;
			const preserveId = key === "proof" ? options.preserveProofId : options.preserveNotificationId;
			const index = key === "proof" || key === "notifications" ? next[key]?.findIndex((entry) => entry.id !== preserveId) ?? -1 : key === "links" ? next.links?.findIndex((link) => !isDependencyLink(link)) ?? -1 : 0;
			if (index < 0) continue;
			next = removeUndefinedMetadataFields({
				...next,
				[key]: entries.filter((_, entryIndex) => entryIndex !== index)
			});
			break;
		}
		if (metadataByteSize(next) >= currentSize) {
			if (options.preserveProofId) throw new Error(`card metadata cannot retain proof: ${options.preserveProofId}`);
			if (options.preserveNotificationId) throw new Error(`card metadata cannot retain notification: ${options.preserveNotificationId}`);
			break;
		}
	}
	return next;
}
//#endregion
//#region extensions/workboard/src/sqlite-store-errors.ts
function encodeWorkboardSqliteFailure(error, seen = /* @__PURE__ */ new Map()) {
	const failure = error instanceof Error ? error : new Error(String(error));
	const existing = seen.get(failure);
	if (existing) return existing;
	const encoded = {
		error: failure,
		name: failure.name,
		..."code" in failure && (typeof failure.code === "string" || typeof failure.code === "number") ? { code: failure.code } : {},
		..."errcode" in failure && typeof failure.errcode === "number" ? { errcode: failure.errcode } : {},
		..."errstr" in failure && typeof failure.errstr === "string" ? { errstr: failure.errstr } : {}
	};
	seen.set(failure, encoded);
	if (failure instanceof AggregateError) encoded.aggregate = failure.errors.map((entry) => encodeWorkboardSqliteFailure(entry, seen));
	if (failure.cause instanceof Error) encoded.cause = encodeWorkboardSqliteFailure(failure.cause, seen);
	return encoded;
}
function decodeWorkboardSqliteFailure(failure, seen = /* @__PURE__ */ new Map()) {
	const existing = seen.get(failure);
	if (existing) return existing;
	const error = failure.aggregate ? new AggregateError([], failure.error.message) : failure.error;
	seen.set(failure, error);
	if (failure.name !== void 0) error.name = failure.name;
	if (failure.error.stack !== void 0) error.stack = failure.error.stack;
	Object.assign(error, {
		...failure.code === void 0 ? {} : { code: failure.code },
		...failure.errcode === void 0 ? {} : { errcode: failure.errcode },
		...failure.errstr === void 0 ? {} : { errstr: failure.errstr }
	});
	if (failure.cause) error.cause = decodeWorkboardSqliteFailure(failure.cause, seen);
	if (failure.aggregate) Object.assign(error, { errors: failure.aggregate.map((entry) => decodeWorkboardSqliteFailure(entry, seen)) });
	return error;
}
function unwrapWorkboardSqliteResult(result) {
	if (result.ok) return result.value;
	throw decodeWorkboardSqliteFailure(result.failure);
}
//#endregion
export { removeUndefinedMetadataFields as A, READY_STRANDED_MS as B, normalizeRunId as C, normalizeTimestamp as D, normalizeTemplateId as E, BLOCKED_TOO_LONG_MS as F, workboardCardConsumesOwnerSlot as G, addWorkboardDurationMs as H, DEFAULT_CLAIM_TTL_MS as I, normalizeWorkboardSessionsBoardSpec as J, workboardCardSlotOwner as K, DEFAULT_WORKBOARD_DISPATCH_OWNER as L, trimMetadataToBudget as M, workerLogEntry as N, normalizeTitle as O, isAbsoluteWorkspacePath as P, MAX_CARDS as R, normalizeProofInput as S, normalizeStringList as T, isWorkboardClaimReclaimable as U, RUNNING_HEARTBEAT_STALE_MS as V, secondsToDurationMs as W, patchWorkboardSessionsBoardSpec as Y, normalizeLinkType as _, capText as a, normalizeNotificationSubscription as b, metadataIsEmpty as c, normalizeAutomation as d, normalizeBoardId as f, normalizeLaunchState as g, normalizeExecution as h, appendLinkPreservingDependencies as i, syncExecutionSessionKey as j, normalizeWorkspace as k, normalizeArtifact as l, normalizeBoundedString as m, unwrapWorkboardSqliteResult as n, clearDiagnostics as o, normalizeBoardIdRequired as p, createDefaultWorkboardSessionsBoardSpec as q, appendCompletionProof as r, deriveChildIdempotencyKey as s, encodeWorkboardSqliteFailure as t, normalizeAttachmentInput as u, normalizeMetadata as v, normalizeStatus as w, normalizePriority as x, normalizeNotes as y, POSITION_STEP as z };
