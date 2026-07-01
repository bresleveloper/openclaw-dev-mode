import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { v as resolveSessionAgentId } from "./agent-scope-CDZXADgT.js";
import { p as resolveAgentIdFromSessionKey } from "./session-key-pTKRJb0m.js";
import { i as logVerbose } from "./globals-BWmHKFNH.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-D4fQSLSV.js";
import { F as upsertSessionEntry, g as patchSessionEntry } from "./session-accessor-Dx6KDG0K.js";
import { m as resolveCompactionSessionFile } from "./sessions-gBZPP61K.js";
import { o as resolveStableSessionEndTranscript } from "./session-transcript-files.fs-BJ1LyduE.js";
import { t as canExecRequestNode } from "./exec-defaults-DhxQcmTz.js";
import { a as buildSessionStartHookPayload, i as buildSessionEndHookPayload, r as noteActiveSessionForShutdown, t as forgetActiveSessionForShutdown } from "./active-sessions-shutdown-tracker-CLD7MCnu.js";
import { t as getRemoteSkillEligibility } from "./remote-CSTswe9T.js";
import "./session-system-events-Bfwy6oZj.js";
import { n as resolveReusableWorkspaceSkillSnapshot } from "./session-snapshot-DJp75U3Q.js";
import crypto from "node:crypto";
//#region src/auto-reply/reply/session-updates.ts
/** Session update helpers for skill snapshots, compaction, and lifecycle hooks. */
async function persistSessionEntryUpdate(params) {
	if (params.sessionEntryHandle) params.sessionEntryHandle.replaceCurrent(params.nextEntry);
	else if (params.sessionStore && params.sessionKey) params.sessionStore[params.sessionKey] = {
		...params.sessionStore[params.sessionKey],
		...params.nextEntry
	};
	else return;
	if (!params.storePath || !params.sessionKey) return;
	await upsertSessionEntry({
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}, params.nextEntry);
}
function emitCompactionSessionLifecycleHooks(params) {
	if (params.previousEntry.sessionId) forgetActiveSessionForShutdown(params.previousEntry.sessionId);
	if (params.nextEntry.sessionId && params.storePath) noteActiveSessionForShutdown({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		sessionId: params.nextEntry.sessionId,
		storePath: params.storePath,
		sessionFile: params.nextEntry.sessionFile,
		agentId: resolveAgentIdFromSessionKey(params.sessionKey)
	});
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner) return;
	if (hookRunner.hasHooks("session_end")) {
		const transcript = resolveStableSessionEndTranscript({
			sessionId: params.previousEntry.sessionId,
			storePath: params.storePath,
			sessionFile: params.previousEntry.sessionFile,
			agentId: resolveAgentIdFromSessionKey(params.sessionKey)
		});
		const payload = buildSessionEndHookPayload({
			sessionId: params.previousEntry.sessionId,
			sessionKey: params.sessionKey,
			cfg: params.cfg,
			reason: "compaction",
			sessionFile: transcript.sessionFile,
			transcriptArchived: transcript.transcriptArchived,
			nextSessionId: params.nextEntry.sessionId
		});
		hookRunner.runSessionEnd(payload.event, payload.context).catch((err) => {
			logVerbose(`session_end hook failed: ${String(err)}`);
		});
	}
	if (hookRunner.hasHooks("session_start")) {
		const payload = buildSessionStartHookPayload({
			sessionId: params.nextEntry.sessionId,
			sessionKey: params.sessionKey,
			cfg: params.cfg,
			resumedFrom: params.previousEntry.sessionId
		});
		hookRunner.runSessionStart(payload.event, payload.context).catch((err) => {
			logVerbose(`session_start hook failed: ${String(err)}`);
		});
	}
}
function resolveNonNegativeTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : void 0;
}
/** Ensures a session entry has the reusable skill snapshot needed for reply runs. */
async function ensureSkillSnapshot(params) {
	if (process.env.OPENCLAW_TEST_FAST === "1") return {
		sessionEntry: params.sessionEntry,
		skillsSnapshot: params.sessionEntry?.skillsSnapshot,
		systemSent: params.sessionEntry?.systemSent ?? false
	};
	const { sessionEntry, sessionEntryHandle, sessionStore, sessionKey, storePath, sessionId, isFirstTurnInSession, workspaceDir, cfg, skillFilter } = params;
	let nextEntry = sessionEntryHandle?.getCurrent() ?? sessionEntry;
	let systemSent = sessionEntry?.systemSent ?? false;
	const sessionAgentId = resolveSessionAgentId({
		sessionKey,
		config: cfg
	});
	const remoteEligibility = getRemoteSkillEligibility({ advertiseExecNode: canExecRequestNode({
		cfg,
		sessionEntry,
		sessionKey,
		agentId: sessionAgentId
	}) });
	const existingSnapshot = nextEntry?.skillsSnapshot;
	const resolveSnapshot = (snapshot) => resolveReusableWorkspaceSkillSnapshot({
		workspaceDir,
		config: cfg,
		agentId: sessionAgentId,
		skillFilter,
		eligibility: { remote: remoteEligibility },
		existingSnapshot: snapshot
	});
	const initialSnapshotState = resolveSnapshot(existingSnapshot);
	const shouldRefreshSnapshot = initialSnapshotState.shouldRefresh;
	if (isFirstTurnInSession && (sessionEntryHandle || sessionStore) && sessionKey) {
		const current = nextEntry ?? sessionEntryHandle?.get(sessionKey) ?? sessionStore?.[sessionKey] ?? {
			sessionId: sessionId ?? crypto.randomUUID(),
			updatedAt: Date.now()
		};
		const skillSnapshot = !current.skillsSnapshot || shouldRefreshSnapshot ? initialSnapshotState.snapshot : resolveSnapshot(current.skillsSnapshot).snapshot;
		nextEntry = {
			...current,
			sessionId: sessionId ?? current.sessionId ?? crypto.randomUUID(),
			updatedAt: Date.now(),
			systemSent: true,
			skillsSnapshot: skillSnapshot
		};
		await persistSessionEntryUpdate({
			sessionEntryHandle,
			sessionStore,
			sessionKey,
			storePath,
			nextEntry
		});
		systemSent = true;
	}
	const skillsSnapshot = Boolean(nextEntry?.skillsSnapshot) && (nextEntry?.skillsSnapshot !== existingSnapshot || !shouldRefreshSnapshot) && nextEntry?.skillsSnapshot ? resolveSnapshot(nextEntry.skillsSnapshot).snapshot : shouldRefreshSnapshot || !nextEntry?.skillsSnapshot ? initialSnapshotState.snapshot : resolveSnapshot(nextEntry.skillsSnapshot).snapshot;
	if (skillsSnapshot && (sessionEntryHandle || sessionStore) && sessionKey && !isFirstTurnInSession && (!nextEntry?.skillsSnapshot || shouldRefreshSnapshot)) {
		const current = nextEntry ?? {
			sessionId: sessionId ?? crypto.randomUUID(),
			updatedAt: Date.now()
		};
		nextEntry = {
			...current,
			sessionId: sessionId ?? current.sessionId ?? crypto.randomUUID(),
			updatedAt: Date.now(),
			skillsSnapshot
		};
		await persistSessionEntryUpdate({
			sessionEntryHandle,
			sessionStore,
			sessionKey,
			storePath,
			nextEntry
		});
	}
	return {
		sessionEntry: nextEntry,
		skillsSnapshot,
		systemSent
	};
}
/** Increments compaction count and persists the updated session entry. */
async function incrementCompactionCount(params) {
	const { sessionEntry, sessionStore, sessionKey, storePath, cfg, now = Date.now(), amount = 1, tokensAfter, newSessionId, newSessionFile } = params;
	if (!sessionStore || !sessionKey) return;
	const entry = sessionStore[sessionKey] ?? sessionEntry;
	if (!entry) return;
	const incrementBy = Math.max(0, amount);
	const nextCount = (entry.compactionCount ?? 0) + incrementBy;
	const updates = {
		compactionCount: nextCount,
		updatedAt: now
	};
	const explicitNewSessionFile = normalizeOptionalString(newSessionFile);
	const sessionIdChanged = Boolean(newSessionId && newSessionId !== entry.sessionId);
	const sessionFileChanged = Boolean(explicitNewSessionFile && explicitNewSessionFile !== entry.sessionFile);
	if (sessionIdChanged && newSessionId) {
		updates.sessionId = newSessionId;
		updates.sessionFile = explicitNewSessionFile ?? resolveCompactionSessionFile({
			entry,
			sessionKey,
			storePath,
			newSessionId
		});
		updates.usageFamilyKey = entry.usageFamilyKey ?? sessionKey;
		updates.usageFamilySessionIds = Array.from(new Set([
			...entry.usageFamilySessionIds ?? [],
			entry.sessionId,
			newSessionId
		]));
	} else if (sessionFileChanged && explicitNewSessionFile) updates.sessionFile = explicitNewSessionFile;
	const tokensAfterCompaction = resolveNonNegativeTokenCount(tokensAfter);
	if (tokensAfterCompaction !== void 0) {
		updates.totalTokens = tokensAfterCompaction;
		updates.totalTokensFresh = true;
		updates.inputTokens = void 0;
		updates.outputTokens = void 0;
		updates.cacheRead = void 0;
		updates.cacheWrite = void 0;
	} else if (incrementBy > 0) updates.totalTokensFresh = false;
	const nextEntry = {
		...entry,
		...updates
	};
	sessionStore[sessionKey] = nextEntry;
	if (storePath) {
		const persistedEntry = await patchSessionEntry({
			storePath,
			sessionKey
		}, () => updates, { fallbackEntry: nextEntry });
		if (persistedEntry) sessionStore[sessionKey] = persistedEntry;
	}
	if ((sessionIdChanged || sessionFileChanged) && cfg) emitCompactionSessionLifecycleHooks({
		cfg,
		sessionKey,
		storePath,
		previousEntry: entry,
		nextEntry: sessionStore[sessionKey]
	});
	return nextCount;
}
//#endregion
export { incrementCompactionCount as n, ensureSkillSnapshot as t };
