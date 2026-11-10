import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { l as asNonNegativeFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { f as validateSessionId } from "./paths-YgcBNLgG.mjs";
import { x as isMainRestartRecoveryCandidate } from "./store-maintenance-BqMt1Twc.mjs";
import { c as LEGACY_SESSION_PROVIDER_FIELDS, i as projectCanonicalSessionEntryShape, n as normalizeMemoryFlush, r as normalizePendingFinalDelivery, s as LEGACY_SESSION_ENTRY_STATE_FIELDS, t as normalizeFallbackNotice, u as hasLegacySessionProviderState } from "./store-entry-shape-sjH_uIYB.mjs";
import { randomUUID } from "node:crypto";
//#region src/commands/doctor/shared/session-entry-shape.ts
function normalizeOptionalTimestamp(value) {
	return value === void 0 ? void 0 : asNonNegativeFiniteNumber(value) ?? 0;
}
function normalizeCount(value) {
	const number = asNonNegativeFiniteNumber(value);
	return number === void 0 ? void 0 : Math.floor(number);
}
/** Doctor retires legacy activity while preserving the previous writer's completed yield. */
function migrateLegacySessionRunOutcome(value, sessionKey, updatedAt = value.updatedAt) {
	if (value.status !== "running" && value.status !== "queued") return value;
	const runId = normalizeOptionalString(value.lifecycleRunId);
	const terminalRuns = value.restartRecoveryTerminalRunIds;
	const delivered = value.restartRecoveryTerminalDeliveryEvidence;
	const hasNoTerminalEvidence = delivered === void 0 || Array.isArray(delivered) && delivered.every((evidence) => isRecord(evidence) && evidence.runId !== runId && evidence.transcriptRunId !== runId);
	const eligible = Boolean(sessionKey && value.archivedAt === void 0 && value.incognito !== true && !isIncognitoSessionKey(sessionKey) && isMainRestartRecoveryCandidate(value, sessionKey));
	const startedAt = asNonNegativeFiniteNumber(value.startedAt);
	const endedAt = asNonNegativeFiniteNumber(value.endedAt);
	const yielded = eligible && value.status === "running" && value.abortedLastRun === false && runId && value.lifecycleRunId === runId && (value.activeWriterRunId === void 0 || value.activeWriterRunId === runId) && startedAt !== void 0 && endedAt !== void 0 && endedAt >= startedAt && value.runtimeMs === endedAt - startedAt && value.lastRunError === void 0 && !(Array.isArray(terminalRuns) && terminalRuns.includes(runId)) && hasNoTerminalEvidence && (value.restartRecoveryRuns === void 0 || Array.isArray(value.restartRecoveryRuns) && value.restartRecoveryRuns.every((run) => isRecord(run) && typeof run.runId === "string" && run.runId !== runId));
	const next = {
		...value,
		status: yielded ? void 0 : "interrupted",
		abortedLastRun: !yielded,
		endedAt: endedAt ?? asNonNegativeFiniteNumber(updatedAt) ?? 0,
		lastRunError: yielded ? void 0 : normalizeOptionalString(value.lastRunError) ?? "Run interrupted by a Gateway restart or loss."
	};
	if (value.abortedLastRun === true && runId && value.lifecycleRunId === runId && value.activeWriterRunId === runId && isRecord(value.delivery) && value.delivery.kind === "internal" && !value.mainRestartRecovery && !value.restartRecoveryDeliveryRunId && !value.restartRecoveryDeliverySourceRunId && !value.pendingFinalDelivery && Array.isArray(terminalRuns) && terminalRuns.includes(runId) && hasNoTerminalEvidence) {
		next.restartRecoveryDeliveryRunId = runId;
		next.restartRecoveryDeliverySourceRunId = runId;
		const remaining = terminalRuns.filter((terminalRunId) => terminalRunId !== runId);
		next.restartRecoveryTerminalRunIds = remaining.length ? remaining : void 0;
	}
	if (value.status === "running" && eligible && !next.mainRestartRecovery && !next.restartRecoveryDeliveryRunId && !next.pendingFinalDelivery && (next.restartRecoveryRuns === void 0 || Array.isArray(next.restartRecoveryRuns) && next.restartRecoveryRuns.length === 0) && !(runId && Array.isArray(terminalRuns) && terminalRuns.includes(runId)) && hasNoTerminalEvidence) next.mainRestartRecovery = {
		cycleId: randomUUID(),
		revision: 1,
		chargedAttempts: 0
	};
	return next;
}
/** Doctor preserves July routing and scalar-state contracts before removing their old keys. */
function migrateLegacySessionEntryState(value, updatedAt = value.updatedAt, sessionKey) {
	const next = { ...value };
	if (hasLegacySessionProviderState(value)) {
		for (const [legacy, current] of LEGACY_SESSION_PROVIDER_FIELDS) if (typeof value[current] !== "string" && typeof value[legacy] === "string") {
			next[current] = value[legacy];
			delete next[legacy];
		}
	}
	for (const field of LEGACY_SESSION_ENTRY_STATE_FIELDS) delete next[field];
	if (typeof value.pendingFinalDelivery === "boolean") delete next.pendingFinalDelivery;
	const text = normalizeOptionalString(value.pendingFinalDeliveryText);
	if (!normalizePendingFinalDelivery(value.pendingFinalDelivery) && (text || value.pendingFinalDelivery === true)) {
		const intentId = normalizeOptionalString(value.pendingFinalDeliveryIntentId);
		next.pendingFinalDelivery = {
			...text ? {
				kind: "replayable",
				text
			} : { kind: "transport-only" },
			createdAt: normalizeOptionalTimestamp(value.pendingFinalDeliveryCreatedAt) ?? normalizeOptionalTimestamp(updatedAt) ?? 0,
			...isRecord(value.pendingFinalDeliveryContext) ? { context: value.pendingFinalDeliveryContext } : {},
			...intentId ? { intentId } : {}
		};
	}
	const selectedModel = normalizeOptionalString(value.fallbackNoticeSelectedModel);
	const activeModel = normalizeOptionalString(value.fallbackNoticeActiveModel);
	if (!normalizeFallbackNotice(value.fallbackNotice) && selectedModel && activeModel) {
		const reason = normalizeOptionalString(value.fallbackNoticeReason);
		next.fallbackNotice = {
			kind: "active",
			selectedModel,
			activeModel,
			...reason ? { reason } : {}
		};
	}
	if (!normalizeMemoryFlush(value.memoryFlush)) {
		const compactionCount = normalizeCount(value.memoryFlushCompactionCount);
		const failureCount = normalizeCount(value.memoryFlushFailureCount);
		if (failureCount && failureCount > 0) next.memoryFlush = {
			kind: "failed",
			...compactionCount !== void 0 ? { compactionCount } : {},
			failureCount
		};
		else if (compactionCount !== void 0) next.memoryFlush = {
			kind: "succeeded",
			compactionCount
		};
	}
	return migrateLegacySessionRunOutcome(next, sessionKey, updatedAt);
}
function isSafeSessionId(value) {
	if (typeof value !== "string") return false;
	const trimmed = value.trim();
	if (!trimmed || trimmed.length > 255 || trimmed !== trimmed.normalize("NFC")) return false;
	return /^[\p{L}\p{N}][\p{L}\p{N}\p{M}._:@-]*$/u.test(trimmed);
}
function normalizeTranscriptSessionId(value) {
	try {
		return validateSessionId(value);
	} catch {
		return;
	}
}
/** Doctor and file import normalize persisted identities before publishing canonical rows. */
function normalizePersistedSessionEntryShape(value, options = {}) {
	if (!isRecord(value)) return;
	const modelSelectionLocked = value.modelSelectionLocked === true;
	let next = projectCanonicalSessionEntryShape(migrateLegacySessionEntryState(value, value.updatedAt, options.sessionKey));
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
export { migrateLegacySessionRunOutcome as n, normalizePersistedSessionEntryShape as r, migrateLegacySessionEntryState as t };
