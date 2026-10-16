import { D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs, t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-CuVhdCBs.mjs";
import "./number-runtime-CgyXj1A5.mjs";
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
export { createDefaultWorkboardSessionsBoardSpec as _, DEFAULT_WORKBOARD_DISPATCH_OWNER as a, MAX_CARD_METADATA_BYTES as c, RUNNING_HEARTBEAT_STALE_MS as d, addWorkboardDurationMs as f, workboardCardSlotOwner as g, workboardCardConsumesOwnerSlot as h, DEFAULT_CLAIM_TTL_MS as i, POSITION_STEP as l, secondsToDurationMs as m, unwrapWorkboardSqliteResult as n, MAX_ATTACHMENT_BYTES as o, isWorkboardClaimReclaimable as p, BLOCKED_TOO_LONG_MS as r, MAX_CARDS as s, encodeWorkboardSqliteFailure as t, READY_STRANDED_MS as u, normalizeWorkboardSessionsBoardSpec as v, patchWorkboardSessionsBoardSpec as y };
