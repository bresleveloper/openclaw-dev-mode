import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-C4a8LL2I.mjs";
import { n as projectCanonicalSessionEntryShape } from "./store-entry-shape-CWorLqwJ.mjs";
import { _ as projectCompactionAccountingPatch } from "./session-accessor.sqlite-transcript-write-CM5480eZ.mjs";
import { d as patchSessionEntryCore, s as loadSessionEntry } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { l as updateSessionEntry } from "./session-accessor.reset-b9w8ccQ2.mjs";
import { r as resolveNodeExecEligibility } from "./exec-defaults-aBiGwrXO.mjs";
import { t as getRemoteSkillEligibility } from "./remote-3_oGYmdR.mjs";
import { t as resolveReusableWorkspaceSkillSnapshot } from "./session-snapshot-BXS6dUP9.mjs";
import crypto from "node:crypto";
//#region src/auto-reply/reply/session-updates.ts
/** Session update helpers for skill snapshots and completed compaction accounting. */
function publishSessionEntry(params, entry) {
	if (entry) {
		if (params.sessionEntryHandle) params.sessionEntryHandle.replaceCurrent(entry);
		else if (params.sessionStore && params.sessionKey) params.sessionStore[params.sessionKey] = entry;
	} else {
		params.sessionEntryHandle?.clearCurrent();
		if (params.sessionStore && params.sessionKey) delete params.sessionStore[params.sessionKey];
	}
}
async function persistSessionEntryUpdate(params) {
	if (!params.sessionEntryHandle && (!params.sessionStore || !params.sessionKey)) return {
		entry: void 0,
		updated: false
	};
	if (!params.storePath || !params.sessionKey) {
		const current = params.sessionEntryHandle ? params.sessionKey ? params.sessionEntryHandle.get(params.sessionKey) : params.sessionEntryHandle.getCurrent() : params.sessionKey ? params.sessionStore?.[params.sessionKey] : void 0;
		if (current?.sessionId !== params.expectedSession?.sessionId || current?.lifecycleRevision !== params.expectedSession?.lifecycleRevision) return {
			entry: current,
			updated: false
		};
		const nextEntry = current ? {
			...current,
			...params.updates
		} : params.nextEntry;
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
		return updated ? params.updates : null;
	});
	publishSessionEntry(params, persistedEntry ?? void 0);
	if (persistedEntry) return {
		entry: persistedEntry,
		updated
	};
	return {
		entry: void 0,
		updated: false
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
		...params.executionWorkspaceDir ? { executionWorkspaceDir: params.executionWorkspaceDir } : {},
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
		nextEntry = {
			...current,
			sessionId: sessionId ?? current.sessionId ?? crypto.randomUUID(),
			updatedAt: Date.now(),
			systemSent: true,
			skillsSnapshot: skillSnapshot
		};
		const { entry: persistedEntry, updated } = await persistSessionEntryUpdate({
			expectedSession,
			sessionEntryHandle,
			sessionStore,
			sessionKey,
			storePath,
			nextEntry,
			updates: {
				sessionId: nextEntry.sessionId,
				updatedAt: nextEntry.updatedAt,
				systemSent: nextEntry.systemSent,
				skillsSnapshot: nextEntry.skillsSnapshot
			}
		});
		if (!updated) return {
			sessionEntry: persistedEntry,
			skillsSnapshot: persistedEntry?.skillsSnapshot,
			systemSent: persistedEntry?.systemSent ?? false
		};
		nextEntry = persistedEntry;
		systemSent = persistedEntry?.systemSent ?? systemSent;
	}
	const skillsSnapshot = Boolean(nextEntry?.skillsSnapshot) && (nextEntry?.skillsSnapshot !== existingSnapshot || !shouldRefreshSnapshot) && nextEntry?.skillsSnapshot ? (await resolveSnapshot(nextEntry.skillsSnapshot)).snapshot : shouldRefreshSnapshot || !nextEntry?.skillsSnapshot ? initialSnapshotState.snapshot : (await resolveSnapshot(nextEntry.skillsSnapshot)).snapshot;
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
		const { entry: persistedEntry, updated } = await persistSessionEntryUpdate({
			expectedSession,
			sessionEntryHandle,
			sessionStore,
			sessionKey,
			storePath,
			nextEntry,
			updates: {
				sessionId: nextEntry.sessionId,
				updatedAt: nextEntry.updatedAt,
				skillsSnapshot: nextEntry.skillsSnapshot
			}
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
	if (!sessionKey || !storePath && !sessionStore) return;
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
	if (storePath) {
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
				} } : {}
			});
		} catch (error) {
			if (error === authorityRevoked) return;
			throw error;
		}
		if (!committed || !persisted) return;
		return persisted.compactionCount;
	}
	const patch = cachedEntry && update(cachedEntry);
	if (!sessionStore || !cachedEntry || !patch) return;
	const nextEntry = projectCanonicalSessionEntryShape({
		...cachedEntry,
		...patch
	});
	sessionStore[sessionKey] = nextEntry;
	return nextEntry.compactionCount;
}
//#endregion
export { incrementCompactionCount as n, ensureSkillSnapshot as t };
