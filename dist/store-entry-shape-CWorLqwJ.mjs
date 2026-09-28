import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { p as validateSessionId } from "./paths-CcMbq5NY.mjs";
import { o as normalizeSessionColorValue, s as normalizeSessionIconValue } from "./session-agent-status-BSzRJm_2.mjs";
//#region src/config/sessions/store-entry-shape.ts
function normalizeSessionEntryArchiveReason(value) {
	return value === "manual" || value === "active-session-cap" || value === "age-retention" || value === "stale-dashboard" || value === "restart-recovery" ? value : void 0;
}
function isSafeSessionId(value) {
	if (typeof value !== "string") return false;
	const trimmed = value.trim();
	if (!trimmed || trimmed.length > 255 || trimmed !== trimmed.normalize("NFC")) return false;
	if (trimmed.includes("/") || trimmed.includes("\\") || trimmed === "." || trimmed === "..") return false;
	return /^[\p{L}\p{N}][\p{L}\p{N}\p{M}._:@-]*$/u.test(trimmed);
}
function normalizeTranscriptSessionId(value) {
	try {
		return validateSessionId(value);
	} catch {
		return;
	}
}
function normalizeOptionalTimestamp(value) {
	return value === void 0 ? void 0 : typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
}
/** Removes retired runtime locator fields before a session entry is persisted or returned. */
function projectCanonicalSessionEntryShape(value) {
	const { sessionFile: _retiredSessionFile, transcriptPath: _retiredTranscriptPath, pendingFinalDeliveryCreatedAt, pendingFinalDeliveryLastAttemptAt: _pendingFinalDeliveryLastAttemptAt, pendingFinalDeliveryAttemptCount: _pendingFinalDeliveryAttemptCount, pendingFinalDeliveryLastError: _pendingFinalDeliveryLastError, pendingFinalDeliveryText, pendingFinalDeliveryContext, pendingFinalDeliveryIntentId, fallbackNoticeSelectedModel, fallbackNoticeActiveModel, fallbackNoticeReason, memoryFlushAt: _memoryFlushAt, memoryFlushCompactionCount, memoryFlushContextHash: _memoryFlushContextHash, memoryFlushFailureCount, memoryFlushLastFailedAt: _memoryFlushLastFailedAt, memoryFlushLastFailureError: _memoryFlushLastFailureError, owner: _projectedOwner, participants: _projectedParticipants, participantCount: _projectedParticipantCount, ...canonicalValue } = value;
	const icon = typeof canonicalValue.icon === "string" ? normalizeSessionIconValue(canonicalValue.icon) : null;
	if (icon) canonicalValue.icon = icon;
	else delete canonicalValue.icon;
	const color = typeof canonicalValue.color === "string" ? normalizeSessionColorValue(canonicalValue.color) : null;
	if (color) canonicalValue.color = color;
	else delete canonicalValue.color;
	const legacyPendingText = normalizeOptionalString(pendingFinalDeliveryText);
	const legacySelectedModel = normalizeOptionalString(fallbackNoticeSelectedModel);
	const legacyActiveModel = normalizeOptionalString(fallbackNoticeActiveModel);
	const legacyFlushCompactionCount = normalizeCount(memoryFlushCompactionCount);
	const legacyFlushFailureCount = normalizeCount(memoryFlushFailureCount);
	const intentId = normalizeOptionalString(pendingFinalDeliveryIntentId);
	const pendingFinalDelivery = normalizePendingFinalDelivery(canonicalValue.pendingFinalDelivery) ?? (legacyPendingText || value.pendingFinalDelivery === true ? {
		...legacyPendingText ? {
			kind: "replayable",
			text: legacyPendingText
		} : { kind: "transport-only" },
		createdAt: normalizeOptionalTimestamp(pendingFinalDeliveryCreatedAt) ?? normalizeOptionalTimestamp(value.updatedAt) ?? 0,
		...isRecord(pendingFinalDeliveryContext) ? { context: pendingFinalDeliveryContext } : {},
		...intentId ? { intentId } : {}
	} : void 0);
	if (pendingFinalDelivery) canonicalValue.pendingFinalDelivery = pendingFinalDelivery;
	else delete canonicalValue.pendingFinalDelivery;
	const pendingDeliveryNotice = normalizePendingDeliveryNotice(canonicalValue.pendingDeliveryNotice);
	if (pendingDeliveryNotice) canonicalValue.pendingDeliveryNotice = pendingDeliveryNotice;
	else delete canonicalValue.pendingDeliveryNotice;
	const pendingTranscriptRepair = normalizePendingTranscriptRepair(canonicalValue.pendingTranscriptRepair);
	if (pendingTranscriptRepair) canonicalValue.pendingTranscriptRepair = pendingTranscriptRepair;
	else delete canonicalValue.pendingTranscriptRepair;
	const reason = normalizeOptionalString(fallbackNoticeReason);
	const fallbackNotice = normalizeFallbackNotice(canonicalValue.fallbackNotice) ?? (legacySelectedModel && legacyActiveModel ? {
		kind: "active",
		selectedModel: legacySelectedModel,
		activeModel: legacyActiveModel,
		...reason ? { reason } : {}
	} : void 0);
	if (fallbackNotice) canonicalValue.fallbackNotice = fallbackNotice;
	else delete canonicalValue.fallbackNotice;
	const memoryFlush = normalizeMemoryFlush(canonicalValue.memoryFlush) ?? (legacyFlushFailureCount && legacyFlushFailureCount > 0 ? {
		kind: "failed",
		...legacyFlushCompactionCount !== void 0 ? { compactionCount: legacyFlushCompactionCount } : {},
		failureCount: legacyFlushFailureCount
	} : legacyFlushCompactionCount !== void 0 ? {
		kind: "succeeded",
		compactionCount: legacyFlushCompactionCount
	} : void 0);
	if (memoryFlush) canonicalValue.memoryFlush = memoryFlush;
	else delete canonicalValue.memoryFlush;
	const archiveReason = normalizeSessionEntryArchiveReason(canonicalValue.archiveReason);
	if (canonicalValue.archivedAt !== void 0) {
		if (archiveReason) canonicalValue.archiveReason = archiveReason;
		else delete canonicalValue.archiveReason;
	} else {
		delete canonicalValue.archivedBy;
		delete canonicalValue.archiveReason;
	}
	return canonicalValue;
}
/** Removes the runtime-only skill catalog without mutating the live session snapshot. */
function stripRuntimeOnlySessionSkillsFields(entry) {
	const snapshot = entry.skillsSnapshot;
	if (snapshot?.resolvedSkills === void 0) return entry;
	const { resolvedSkills: _drop, ...skillsSnapshot } = snapshot;
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
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : void 0;
}
/** Normalizes persisted session store entries before they reach runtime callers. */
function normalizePersistedSessionEntryShape(value, options = {}) {
	if (!isRecord(value)) return;
	const modelSelectionLocked = value.modelSelectionLocked === true;
	let next = projectCanonicalSessionEntryShape(value);
	if (value.sessionId !== void 0) {
		if (!isSafeSessionId(value.sessionId)) return;
		const sessionId = value.sessionId.trim();
		const legacySessionFile = value.sessionFile;
		if (!modelSelectionLocked && options.sessionKey !== void 0 && parseAgentSessionKey(options.sessionKey) !== null && sessionId === options.sessionKey && (value.initializationPending === true || typeof legacySessionFile !== "string" || !legacySessionFile.trim())) {
			const { sessionId: _legacyPendingSessionId, ...pendingEntry } = next;
			next = {
				...pendingEntry,
				initializationPending: true
			};
		} else {
			if (modelSelectionLocked && sessionId !== value.sessionId) return;
			if (!normalizeTranscriptSessionId(sessionId)) return;
			if (sessionId !== value.sessionId) next = {
				...next,
				sessionId
			};
		}
	}
	const updatedAt = normalizeOptionalTimestamp(value.updatedAt);
	if (updatedAt !== value.updatedAt) next.updatedAt = updatedAt ?? 0;
	return next;
}
//#endregion
export { projectCanonicalSessionEntryShape as n, stripRuntimeOnlySessionSkillsFields as r, normalizePersistedSessionEntryShape as t };
