import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { l as asNonNegativeFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as isCanonicalSessionDeliveryState } from "./delivery-context.shared-PF5njaoI.mjs";
import { o as normalizeSessionColorValue, s as normalizeSessionIconValue } from "./session-agent-status-BSzRJm_2.mjs";
import { t as SessionStoreMigrationRequiredError } from "./migration-required-BRpK_5S4.mjs";
//#region src/config/sessions/conversation-link.ts
/** Keep channel-supplied navigation safe at both ingress and persisted metadata reads. */
function normalizeSessionConversationLink(value) {
	const record = asOptionalRecord(value);
	const url = typeof record?.url === "string" ? record.url.trim() : "";
	const label = typeof record?.label === "string" ? record.label.trim() : "";
	if (!url || url.length > 2048 || !label || label.length > 128) return;
	const parsed = URL.parse(url);
	if (!parsed || parsed.protocol !== "https:" && parsed.protocol !== "http:") return;
	return parsed.href.length <= 2048 ? {
		url: parsed.href,
		label
	} : void 0;
}
//#endregion
//#region src/config/sessions/session-entry-state-format.ts
const LEGACY_SESSION_PROVIDER_FIELDS = [["provider", "channel"], ["lastProvider", "lastChannel"]];
function hasLegacySessionProviderState(value) {
	return isRecord(value) && !isCanonicalSessionDeliveryState(value.delivery) && LEGACY_SESSION_PROVIDER_FIELDS.some(([legacy, current]) => typeof value[legacy] === "string" && typeof value[current] !== "string");
}
const LEGACY_SESSION_ENTRY_STATE_FIELDS = [
	"pendingFinalDeliveryCreatedAt",
	"pendingFinalDeliveryLastAttemptAt",
	"pendingFinalDeliveryAttemptCount",
	"pendingFinalDeliveryLastError",
	"pendingFinalDeliveryText",
	"pendingFinalDeliveryContext",
	"pendingFinalDeliveryIntentId",
	"fallbackNoticeSelectedModel",
	"fallbackNoticeActiveModel",
	"fallbackNoticeReason",
	"memoryFlushAt",
	"memoryFlushCompactionCount",
	"memoryFlushContextHash",
	"memoryFlushFailureCount",
	"memoryFlushLastFailedAt",
	"memoryFlushLastFailureError"
];
/** Detection grants no read-through compatibility; Doctor owns the conversion. */
function hasLegacySessionEntryState(value) {
	return "pendingFinalDelivery" in value && typeof value.pendingFinalDelivery === "boolean" || hasLegacySessionProviderState(value) || LEGACY_SESSION_ENTRY_STATE_FIELDS.some((field) => Object.hasOwn(value, field));
}
//#endregion
//#region src/config/sessions/supported-session-store.ts
function assertSupportedSessionStoreEntry(entry) {
	if (!isRecord(entry)) return;
	if (typeof entry.room === "string" && typeof entry.groupChannel !== "string") throw new SessionStoreMigrationRequiredError("Session field \"room\" predates July 2026 and is no longer supported. Preserve the original state, install OpenClaw 2026.9.5 and run \"openclaw doctor --fix\", then upgrade again.");
}
//#endregion
//#region src/config/sessions/store-entry-shape.ts
function normalizeSessionEntryArchiveReason(value) {
	return value === "manual" || value === "active-session-cap" || value === "age-retention" || value === "stale-dashboard" || value === "restart-recovery" ? value : void 0;
}
function normalizeOptionalTimestamp(value) {
	return value === void 0 ? void 0 : asNonNegativeFiniteNumber(value) ?? 0;
}
/** Removes retired runtime locator fields before a session entry is persisted or returned. */
function projectCanonicalSessionEntryShape(value) {
	assertSupportedSessionStoreEntry(value);
	if (hasLegacySessionEntryState(value)) throw new SessionStoreMigrationRequiredError("Legacy session entry state requires migration; stop the Gateway and run openclaw doctor --fix.");
	const { sessionFile: _retiredSessionFile, transcriptPath: _retiredTranscriptPath, owner: _projectedOwner, participants: _projectedParticipants, participantCount: _projectedParticipantCount, ...canonicalValue } = value;
	const setOptionalField = (key, normalized) => {
		if (normalized) canonicalValue[key] = normalized;
		else delete canonicalValue[key];
	};
	setOptionalField("conversationLink", normalizeSessionConversationLink(canonicalValue.conversationLink));
	setOptionalField("icon", typeof canonicalValue.icon === "string" ? normalizeSessionIconValue(canonicalValue.icon) : null);
	setOptionalField("color", typeof canonicalValue.color === "string" ? normalizeSessionColorValue(canonicalValue.color) : null);
	setOptionalField("pendingFinalDelivery", normalizePendingFinalDelivery(canonicalValue.pendingFinalDelivery));
	setOptionalField("pendingDeliveryNotice", normalizePendingDeliveryNotice(canonicalValue.pendingDeliveryNotice));
	setOptionalField("pendingTranscriptRepair", normalizePendingTranscriptRepair(canonicalValue.pendingTranscriptRepair));
	setOptionalField("fallbackNotice", normalizeFallbackNotice(canonicalValue.fallbackNotice));
	setOptionalField("memoryFlush", normalizeMemoryFlush(canonicalValue.memoryFlush));
	const archiveReason = normalizeSessionEntryArchiveReason(canonicalValue.archiveReason);
	if (canonicalValue.archivedAt !== void 0) setOptionalField("archiveReason", archiveReason);
	else {
		delete canonicalValue.archivedBy;
		delete canonicalValue.archiveReason;
	}
	if (canonicalValue.archivedAt !== void 0 || typeof canonicalValue.snoozedUntil !== "number" || !Number.isFinite(canonicalValue.snoozedUntil) || canonicalValue.snoozedUntil <= 0) {
		delete canonicalValue.snoozedUntil;
		delete canonicalValue.snoozedAt;
	}
	return canonicalValue;
}
/** Removes the runtime-only skill catalog without mutating the live session snapshot. */
function stripRuntimeOnlySessionSkillsFields(entry) {
	const snapshot = entry.skillsSnapshot;
	if (snapshot?.resolvedSkills === void 0 && snapshot?.discoverySkills === void 0) return entry;
	const { resolvedSkills: _dropResolved, discoverySkills: _dropDiscovery, ...skillsSnapshot } = snapshot;
	return {
		...entry,
		skillsSnapshot
	};
}
function normalizePendingFinalDelivery(value) {
	if (!isRecord(value)) return;
	const createdAt = normalizeOptionalTimestamp(value.createdAt);
	if (createdAt === void 0) return;
	const intentId = normalizeOptionalString(value.intentId);
	const deliveries = normalizePendingFinalDeliveries(value.deliveries);
	const base = {
		createdAt,
		...isRecord(value.context) ? { context: value.context } : {},
		...intentId ? { intentId } : {},
		...deliveries ? { deliveries } : {}
	};
	if (value.kind === "transport-only") return {
		kind: "transport-only",
		...base
	};
	const text = normalizeOptionalString(value.text);
	return value.kind === "replayable" && text ? {
		kind: "replayable",
		text,
		...base
	} : void 0;
}
function normalizePendingFinalDeliveries(value) {
	if (!Array.isArray(value)) return;
	const deliveries = value.flatMap((item) => {
		const id = isRecord(item) ? normalizeOptionalString(item.id) : void 0;
		const state = isRecord(item) ? item.state : void 0;
		return id && (state === "prepared" || state === "queued" || state === "delivered" || state === "suppressed" || state === "unknown") ? [{
			id,
			state
		}] : [];
	});
	return deliveries.length > 0 ? deliveries : void 0;
}
function normalizePendingDeliveryNotice(value) {
	if (!isRecord(value) || !isRecord(value.context)) return;
	const createdAt = normalizeOptionalTimestamp(value.createdAt);
	const intentId = normalizeOptionalString(value.intentId);
	return createdAt !== void 0 && intentId && (value.state === "owed" || value.state === "unresolved" || value.state === "acknowledged") ? {
		createdAt,
		context: value.context,
		intentId,
		state: value.state
	} : void 0;
}
function normalizePendingTranscriptRepair(value) {
	if (!Array.isArray(value) || value.length === 0) return;
	const normalized = [];
	for (const item of value) {
		const record = normalizePendingTranscriptRepairRecord(item);
		if (record) normalized.push(record);
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizePendingTranscriptRepairRecord(value) {
	if (!isRecord(value)) return;
	const id = normalizeOptionalString(value.id);
	const text = normalizeOptionalString(value.text);
	const createdAt = normalizeOptionalTimestamp(value.createdAt);
	if (!id || !text || createdAt === void 0) return;
	const provider = normalizeOptionalString(value.provider);
	const model = normalizeOptionalString(value.model);
	return {
		id,
		text,
		...provider ? { provider } : {},
		...model ? { model } : {},
		createdAt
	};
}
function normalizeFallbackNotice(value) {
	if (!isRecord(value) || value.kind !== "active") return;
	const selectedModel = normalizeOptionalString(value.selectedModel);
	const activeModel = normalizeOptionalString(value.activeModel);
	const reason = normalizeOptionalString(value.reason);
	return selectedModel && activeModel ? {
		kind: "active",
		selectedModel,
		activeModel,
		...reason ? { reason } : {}
	} : void 0;
}
function normalizeMemoryFlush(value) {
	if (!isRecord(value)) return;
	const compactionCount = normalizeCount(value.compactionCount);
	if (value.kind === "succeeded" && compactionCount !== void 0) return {
		kind: "succeeded",
		compactionCount
	};
	const failureCount = normalizeCount(value.failureCount);
	if (value.kind !== "failed" || !failureCount) return;
	return {
		kind: "failed",
		...compactionCount !== void 0 ? { compactionCount } : {},
		failureCount
	};
}
function normalizeCount(value) {
	const number = asNonNegativeFiniteNumber(value);
	return number === void 0 ? void 0 : Math.floor(number);
}
//#endregion
export { stripRuntimeOnlySessionSkillsFields as a, LEGACY_SESSION_PROVIDER_FIELDS as c, normalizeSessionConversationLink as d, projectCanonicalSessionEntryShape as i, hasLegacySessionEntryState as l, normalizeMemoryFlush as n, assertSupportedSessionStoreEntry as o, normalizePendingFinalDelivery as r, LEGACY_SESSION_ENTRY_STATE_FIELDS as s, normalizeFallbackNotice as t, hasLegacySessionProviderState as u };
