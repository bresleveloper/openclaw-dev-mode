import { D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs, t as MAX_DATE_TIMESTAMP_MS } from "./number-coercion-CLj0HTDM.mjs";
import "./number-runtime-CGwowceO.mjs";
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
export { MAX_CARDS as a, READY_STRANDED_MS as c, isWorkboardClaimReclaimable as d, secondsToDurationMs as f, MAX_ATTACHMENT_BYTES as i, RUNNING_HEARTBEAT_STALE_MS as l, workboardCardSlotOwner as m, DEFAULT_CLAIM_TTL_MS as n, MAX_CARD_METADATA_BYTES as o, workboardCardConsumesOwnerSlot as p, DEFAULT_WORKBOARD_DISPATCH_OWNER as r, POSITION_STEP as s, BLOCKED_TOO_LONG_MS as t, addWorkboardDurationMs as u };
