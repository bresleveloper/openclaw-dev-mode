import { s as isFastTestRuntimeEnv } from "./env-DbG527wb.mjs";
import { n as resolveSessionSkillExecutionWorkspace } from "./workspace-skill-roots-CL28VeX5.mjs";
import { f as sessionEntryCommitGuardOptions } from "./session-source-authority-fdILH-PW.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { t as applySessionEntryOperation } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { a as loadExecApprovalsReadOnlyAsync } from "./exec-approvals-store-BhzM_h1C.mjs";
import { s as withSandboxRuntimeStatusInWorker } from "./runtime-status-DWm-5zUj.mjs";
import { a as resolveNodeExecEligibility, s as resolvePreparedExecDefaultsAsync, t as prepareExecDefaults } from "./exec-defaults-DrIV-0KT.mjs";
import { t as getRemoteSkillEligibility } from "./remote-CgYoyov-.mjs";
import { r as publishReplySessionEntry } from "./session-entry-handle-CIZ4BgVt.mjs";
import { t as resolveReusableWorkspaceSkillSnapshot } from "./session-snapshot-DMYLVDi5.mjs";
import crypto from "node:crypto";
//#region src/auto-reply/reply/session-updates.ts
async function persistSkillSnapshot(params) {
	params.assertCurrent?.();
	const updates = {
		updatedAt: Date.now(),
		...params.isFirstTurnInSession ? { systemSent: true } : {},
		skillsSnapshot: params.skillsSnapshot
	};
	if (!params.storePath) {
		const nextEntry = {
			...(params.sessionEntryHandle ? params.sessionEntryHandle.get(params.sessionKey) : params.sessionStore?.[params.sessionKey]) ?? params.currentEntry,
			...updates
		};
		publishReplySessionEntry(params, nextEntry);
		return nextEntry;
	}
	const persistedEntry = await applySessionEntryOperation({
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}, {
		kind: "fields",
		patch: updates
	}, sessionEntryCommitGuardOptions(params.assertCurrent));
	params.assertCurrent?.();
	publishReplySessionEntry(params, persistedEntry ?? void 0);
	return persistedEntry ?? void 0;
}
function readSkillSnapshotState(entry) {
	return {
		sessionEntry: entry,
		skillsSnapshot: entry?.skillsSnapshot,
		systemSent: entry?.systemSent ?? false
	};
}
async function ensureSkillSnapshot(params) {
	if (isFastTestRuntimeEnv()) return readSkillSnapshotState(params.sessionEntry);
	const { agentId, sessionEntry, sessionEntryHandle, sessionStore, sessionKey, sessionId, isFirstTurnInSession, workspaceDir, cfg, skillFilter, skillOverrides } = params;
	const env = captureSessionTranscriptStorageEnvironment(process.env);
	const cwd = process.cwd();
	const assertCurrent = () => {
		params.assertCurrent?.();
		params.reader?.assertCurrent();
	};
	assertCurrent();
	let nextEntry = sessionEntryHandle?.getCurrent() ?? sessionEntry;
	const execParams = {
		cfg,
		sessionEntry,
		sessionKey,
		agentId,
		execOverrides: params.execOverrides
	};
	const existingSnapshot = nextEntry?.skillsSnapshot;
	const snapshotState = await withSandboxRuntimeStatusInWorker(execParams, {
		env,
		cwd,
		assertCurrent,
		reader: params.reader
	}, async (sandbox) => {
		const execDefaults = await resolvePreparedExecDefaultsAsync(prepareExecDefaults(execParams, sandbox), () => loadExecApprovalsReadOnlyAsync({ env }));
		assertCurrent();
		const nodeSkillsEligibility = resolveNodeExecEligibility(execParams, execDefaults);
		const result = await resolveReusableWorkspaceSkillSnapshot({
			assertCurrent,
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
			existingSnapshot,
			librarySelections: nextEntry?.skillLibrarySelections
		});
		assertCurrent();
		return result;
	});
	const skillsSnapshot = snapshotState.snapshot;
	if ((sessionEntryHandle || sessionStore) && sessionKey && (isFirstTurnInSession || !existingSnapshot || snapshotState.shouldRefresh)) {
		nextEntry = await persistSkillSnapshot({
			...params,
			sessionKey,
			currentEntry: nextEntry ?? {
				sessionId: sessionId ?? crypto.randomUUID(),
				updatedAt: Date.now()
			},
			skillsSnapshot
		});
		if (!nextEntry) return readSkillSnapshotState(void 0);
	}
	if (sessionKey && (sessionEntryHandle || sessionStore)) nextEntry = sessionEntryHandle ? sessionEntryHandle.getCurrent() : sessionStore?.[sessionKey];
	return {
		sessionEntry: nextEntry,
		skillsSnapshot,
		systemSent: nextEntry?.systemSent ?? false
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
	let committed = false;
	const authorityRevoked = /* @__PURE__ */ new Error("compaction accounting authority revoked");
	try {
		const persisted = await applySessionEntryOperation({
			agentId: params.agentId,
			storePath,
			sessionKey
		}, {
			kind: "compaction-accounting",
			expected,
			accounting: {
				amount: params.amount,
				compactionKind: params.compactionKind,
				now: params.now,
				tokensAfter: params.tokensAfter,
				transcriptByteCompactionLatch: params.transcriptByteCompactionLatch
			}
		}, {
			onCommitted: (entry) => {
				committed = true;
				if (sessionStore) sessionStore[sessionKey] = entry;
			},
			workerGuard: { assertCurrent: authorize ? () => {
				if (!authorize()) throw authorityRevoked;
			} : void 0 }
		});
		return committed ? persisted?.compactionCount : void 0;
	} catch (error) {
		if (error === authorityRevoked) return;
		throw error;
	}
}
//#endregion
export { incrementCompactionCount as n, ensureSkillSnapshot as t };
