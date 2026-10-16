import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-BBJTTIuE.mjs";
import { a as loadSessionEntry, s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { c as updateSessionEntry } from "./session-accessor.reset-DWr6djSD.mjs";
import { v as projectCompactionAccountingPatch } from "./session-accessor.sqlite-transcript-write-Kl-_Ewp0.mjs";
import { i as resolveNodeExecEligibility } from "./exec-defaults-B7HapOub.mjs";
import { n as resolveSessionSkillExecutionWorkspace } from "./workspace-skill-roots-CL28VeX5.mjs";
import { t as getRemoteSkillEligibility } from "./remote-DQMZEn3w.mjs";
import { t as resolveReusableWorkspaceSkillSnapshot } from "./session-snapshot-CrVSl4dl.mjs";
import crypto from "node:crypto";
//#region src/auto-reply/reply/session-updates.ts
function publishSessionEntry(params, entry) {
	if (entry) {
		if (params.sessionEntryHandle) params.sessionEntryHandle.replaceCurrent(entry);
		else if (params.sessionStore && params.sessionKey) params.sessionStore[params.sessionKey] = entry;
	} else {
		params.sessionEntryHandle?.clearCurrent();
		if (params.sessionStore && params.sessionKey) delete params.sessionStore[params.sessionKey];
	}
}
async function persistSkillSnapshot(params) {
	const updates = {
		sessionId: params.sessionId ?? params.currentEntry.sessionId,
		updatedAt: Date.now(),
		...params.isFirstTurnInSession ? { systemSent: true } : {},
		skillsSnapshot: params.skillsSnapshot
	};
	if (!params.storePath) {
		const current = params.sessionEntryHandle ? params.sessionEntryHandle.get(params.sessionKey) : params.sessionStore?.[params.sessionKey];
		if (current?.sessionId !== params.expectedSession?.sessionId || current?.lifecycleRevision !== params.expectedSession?.lifecycleRevision) return {
			entry: current,
			updated: false
		};
		const nextEntry = {
			...current ?? params.currentEntry,
			...updates
		};
		publishSessionEntry(params, nextEntry);
		return {
			entry: nextEntry,
			updated: true
		};
	}
	let updated = false;
	const persistedEntry = await updateSessionEntry({
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}, (entry) => {
		updated = entry.sessionId === params.expectedSession?.sessionId && entry.lifecycleRevision === params.expectedSession?.lifecycleRevision;
		return updated ? updates : null;
	});
	publishSessionEntry(params, persistedEntry ?? void 0);
	return {
		entry: persistedEntry ?? void 0,
		updated: Boolean(persistedEntry) && updated
	};
}
/** Ensures a session entry has the reusable skill snapshot needed for reply runs. */
async function ensureSkillSnapshot(params) {
	if (isFastTestRuntimeEnv()) return {
		sessionEntry: params.sessionEntry,
		skillsSnapshot: params.sessionEntry?.skillsSnapshot,
		systemSent: params.sessionEntry?.systemSent ?? false
	};
	const { agentId, sessionEntry, sessionEntryHandle, sessionStore, sessionKey, storePath, sessionId, isFirstTurnInSession, workspaceDir, cfg, skillFilter, skillOverrides } = params;
	let nextEntry = sessionEntryHandle?.getCurrent() ?? sessionEntry;
	const expectedSession = nextEntry && {
		sessionId: nextEntry.sessionId,
		lifecycleRevision: nextEntry.lifecycleRevision
	};
	let systemSent = sessionEntry?.systemSent ?? false;
	const nodeSkillsEligibility = resolveNodeExecEligibility({
		cfg,
		sessionEntry,
		sessionKey,
		agentId,
		execOverrides: params.execOverrides
	});
	const existingSnapshot = nextEntry?.skillsSnapshot;
	const resolveSnapshot = (snapshot) => resolveReusableWorkspaceSkillSnapshot({
		workspaceDir,
		...resolveSessionSkillExecutionWorkspace(nextEntry?.worktree?.canonicalWorkspaceDir, params.executionWorkspaceDir),
		config: cfg,
		agentId,
		skillFilter,
		skillOverrides,
		resolveEligibility: () => ({
			nodeSkills: nodeSkillsEligibility,
			remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkillsEligibility.canExec })
		}),
		existingSnapshot: snapshot,
		librarySelections: nextEntry?.skillLibrarySelections
	});
	const initialSnapshotState = await resolveSnapshot(existingSnapshot);
	const shouldRefreshSnapshot = initialSnapshotState.shouldRefresh;
	if (isFirstTurnInSession && (sessionEntryHandle || sessionStore) && sessionKey) {
		const current = nextEntry ?? sessionEntryHandle?.get(sessionKey) ?? sessionStore?.[sessionKey] ?? {
			sessionId: sessionId ?? crypto.randomUUID(),
			updatedAt: Date.now()
		};
		const skillSnapshot = !current.skillsSnapshot || shouldRefreshSnapshot ? initialSnapshotState.snapshot : (await resolveSnapshot(current.skillsSnapshot)).snapshot;
		const { entry: persistedEntry, updated } = await persistSkillSnapshot({
			...params,
			expectedSession,
			sessionKey,
			currentEntry: current,
			skillsSnapshot: skillSnapshot
		});
		if (!updated) return {
			sessionEntry: persistedEntry,
			skillsSnapshot: persistedEntry?.skillsSnapshot,
			systemSent: persistedEntry?.systemSent ?? false
		};
		nextEntry = persistedEntry;
		systemSent = persistedEntry?.systemSent ?? systemSent;
	}
	const skillsSnapshot = nextEntry?.skillsSnapshot && (nextEntry.skillsSnapshot !== existingSnapshot || !shouldRefreshSnapshot) ? (await resolveSnapshot(nextEntry.skillsSnapshot)).snapshot : initialSnapshotState.snapshot;
	if (skillsSnapshot && (sessionEntryHandle || sessionStore) && sessionKey && !isFirstTurnInSession && (!nextEntry?.skillsSnapshot || shouldRefreshSnapshot)) {
		const current = nextEntry ?? {
			sessionId: sessionId ?? crypto.randomUUID(),
			updatedAt: Date.now()
		};
		const { entry: persistedEntry, updated } = await persistSkillSnapshot({
			...params,
			expectedSession,
			sessionKey,
			currentEntry: current,
			skillsSnapshot
		});
		if (!updated) return {
			sessionEntry: persistedEntry,
			skillsSnapshot: persistedEntry?.skillsSnapshot,
			systemSent: persistedEntry?.systemSent ?? false
		};
		nextEntry = persistedEntry;
	}
	if (sessionKey && (sessionEntryHandle || sessionStore)) {
		const current = storePath ? loadSessionEntry({
			storePath,
			sessionKey
		}) : sessionEntryHandle ? sessionEntryHandle.get(sessionKey) : sessionStore?.[sessionKey];
		if (storePath) publishSessionEntry(params, current);
		if (current?.sessionId !== expectedSession?.sessionId || current?.lifecycleRevision !== expectedSession?.lifecycleRevision) return {
			sessionEntry: current,
			skillsSnapshot: current?.skillsSnapshot,
			systemSent: current?.systemSent ?? false
		};
		nextEntry = current;
		systemSent = current?.systemSent ?? false;
	}
	return {
		sessionEntry: nextEntry,
		skillsSnapshot,
		systemSent
	};
}
/** Accounts completed compaction without creating or changing session ownership. */
async function incrementCompactionCount(params) {
	const { sessionStore, sessionKey, storePath, authorize } = params;
	if (!sessionKey || !storePath) return;
	const cachedEntry = sessionStore?.[sessionKey] ?? params.sessionEntry;
	const initial = params.expectedSession ?? cachedEntry;
	if (!initial) return;
	const expected = {
		sessionId: initial.sessionId,
		lifecycleRevision: initial.lifecycleRevision,
		activeWriterRunId: initial.activeWriterRunId
	};
	const update = (current) => {
		if (!(authorize?.() ?? true) || current.sessionId !== expected.sessionId || current.lifecycleRevision !== expected.lifecycleRevision || current.activeWriterRunId !== expected.activeWriterRunId) return null;
		return projectCompactionAccountingPatch(current, params);
	};
	let committed = false;
	const authorityRevoked = /* @__PURE__ */ new Error("compaction accounting authority revoked");
	let persisted;
	try {
		persisted = await patchSessionEntryCore({
			agentId: params.agentId,
			storePath,
			sessionKey
		}, update, {
			onCommitted: (entry) => {
				committed = true;
				if (sessionStore) sessionStore[sessionKey] = entry;
			},
			...authorize ? { assertCommitAllowed: () => {
				if (!authorize()) throw authorityRevoked;
			} } : { workerGuard: {} }
		});
	} catch (error) {
		if (error === authorityRevoked) return;
		throw error;
	}
	if (!committed || !persisted) return;
	return persisted.compactionCount;
}
//#endregion
export { incrementCompactionCount as n, ensureSkillSnapshot as t };
