import { s as formatErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import "./errors-DPfGDWk1.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { h as listLiveAgentRunIds, u as getAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { M as parseAgentSessionKey, _ as toAgentStoreSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as settlesWithin } from "./settle-within-DLEx44ea.mjs";
import { A as normalizeAgentDirRegistryPath, C as tryResolveAgentOperationAgentId, M as resolveRegisteredAgentIdForDir, N as unregisterResolvedAgentDir, a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { l as tryResolveSoleAgentId } from "./agent-roster-gkYP38su.mjs";
import { m as readAgentDeletionJournalAsync } from "./agent-deletion-journal-DpYVtbBb.mjs";
import { c as resolveSessionStorePathCore, d as resolveSessionTranscriptsDirForAgent } from "./paths-YgcBNLgG.mjs";
import { v as resolveAuthProfileDatabasePath } from "./sqlite-BlFpr2YD.mjs";
import { d as resolveSharedAuthStorePath, l as resolveSharedAuthStoreOwnership, o as prepareSharedAuthStoreOwnership } from "./path-resolve-21Orzn6B.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-iJNKNMuJ.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { l as readConfigFileSnapshotForWrite } from "./io.runtime-Ds5uC0Bf.mjs";
import { n as agentWorkAdmissionIdentity } from "./session-agent-work-admission-D63nonbM.mjs";
import { c as AgentDeletionAuthorityRollbackError, l as AgentDeletionCommitUncertainError, r as withAgentDeletion, s as claimCompletedAgentDeletion } from "./agent-lifecycle-registry-DCaIqk-e.mjs";
import { a as createAgentRunDirectAbortError } from "./run-termination-Dwf1ksjA.mjs";
import { a as readSessionEntrySummariesInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { C as startAgentWorkAdmissionInterruption, a as closeAgentWorkAdmissions, s as collectActiveAgentSessionWorkAdmissions, t as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { s as withConfigMutationExclusive } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import "./sessions-CnzPI1yx.mjs";
import { t as purgeAgentSessionStoreEntries } from "./cleanup-service-BHj-66gM.mjs";
import { p as withAgentExecApprovalsRemoved } from "./exec-approvals-store-BhzM_h1C.mjs";
import "./exec-approvals-ByI8H66l.mjs";
import { z as resolveReplyRunForCurrentSessionId } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import "./reply-run-registry.registry-CmcnzV4X.mjs";
import { t as chatRunBelongsToAgent } from "./chat-run-owner-BB6L4tWc.mjs";
import { r as listActiveEmbeddedRunSessionIds } from "./active-run-projections-Crpg2l0z.mjs";
import { r as captureEmbeddedRunDrainTarget } from "./runs-Czr-I6_B.mjs";
import { l as prepareLegacyWorkspaceStateReset, u as removeLegacyWorkspaceStateForReset } from "./workspace-legacy-state-CUN3bghH.mjs";
import { i as prepareWorkspaceStateDeletion, n as deleteWorkspaceState } from "./workspace-state-store-CAqLogDE.mjs";
import { d as listAgentSessionMcpRuntimeIds, m as retireSessionMcpRuntimeForAgentDeletion } from "./mcp-app-model-context-CMk3NoeW.mjs";
import { r as drainAgentExecProcesses } from "./bash-process-control-D15pjJye.mjs";
import { c as trashAllowedRoots } from "./cleanup-utils-BtHoq0Ha.mjs";
import { t as movePathToTrash } from "./browser-trash-BBLAyaRb.mjs";
import { t as cleanupBrowserSessionsForLifecycleEnd } from "./browser-lifecycle-cleanup-D3rGziAc.mjs";
import { i as isSharedAuthStoreOwner, n as formatSharedAuthStoreOwnerDeleteError, r as isInheritedAuthStoreOwner } from "./agent-delete-safety-C-K2bAs7.mjs";
import { a as prepareAgentDeleteDatabases, c as resolveSurvivingDatabaseFilePaths, i as isPathOwnedBySurvivingAgent, l as retireAgentDeleteRuntime, n as drainAgentDeleteDatabaseWork, o as prepareJournaledAgentDirOwnership, r as finishAgentDeleteDatabases, s as readAgentDeleteDatabaseRegistry, t as assertAgentSessionStoreDeletionSafe } from "./agent-delete-databases-CDNa7990.mjs";
import { a as isConfiguredAgent, i as deleteAgentConfigEntry, t as AgentConfigPreconditionError } from "./agents-config-mutations-DOs6-YyC.mjs";
import { n as prepareSessionLifecycleDrain } from "./sessions-lifecycle-drain-bs9bSf42.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { resolvePathPrefixSync } from "@openclaw/fs-safe/advanced";
//#region src/gateway/server-methods/agents-delete-drain.ts
/** The deletion journal already owns ingress; session owners retain cancellation writes. */
async function drainAgentDeletionRuns(agentId, cfg, context, assertDeletionCurrent) {
	let finished = false;
	const assertCurrent = () => {
		assertDeletionCurrent();
		if (finished) throw new Error(`Agent ${agentId} deletion drain has ended`);
	};
	assertCurrent();
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	const defaultAgentId = tryResolveAgentOperationAgentId(cfg);
	const admissions = collectActiveAgentSessionWorkAdmissions({ agentId });
	const admissionAgent = agentWorkAdmissionIdentity({ agentId });
	const embeddedRuns = /* @__PURE__ */ new Map();
	const unkeyedRuns = [];
	const mcpSessionIds = /* @__PURE__ */ new Set();
	const targets = /* @__PURE__ */ new Map();
	const add = (sessionKey, sessionId, scope = storePath, entry) => {
		const canonicalKey = resolveSessionStoreIdentity({
			cfg,
			sessionKey,
			agentId
		}).canonicalKey;
		const keys = [.../* @__PURE__ */ new Set([sessionKey, canonicalKey])];
		const selectedScope = [...admissions].find(([admissionScope, identities]) => !admissionScope.startsWith("agent:") && (keys.some((key) => identities.has(key)) || Boolean(sessionId && identities.has(sessionId))))?.[0] ?? scope;
		const key = JSON.stringify(sessionId ? ["session", sessionId] : [
			"key",
			selectedScope,
			canonicalKey
		]);
		const existing = targets.get(key);
		const sessionKeys = [.../* @__PURE__ */ new Set([...keys, ...existing?.sessionKeys ?? []])];
		targets.set(key, {
			action: "delete",
			authorize: assertCurrent,
			context,
			storePath: selectedScope,
			agentId,
			admissionAgent,
			defaultAgentId,
			sessionKey: canonicalKey,
			sessionKeys,
			sessionId,
			session: entry ? {
				ok: true,
				value: {
					cfg,
					storePath: selectedScope,
					entry,
					canonicalKey,
					agentId
				}
			} : existing?.session,
			embeddedRun: sessionId ? embeddedRuns.get(sessionId) ?? null : null,
			lifecycleIdentities: sessionId ? [...sessionKeys, sessionId] : sessionKeys
		});
	};
	const addOwned = (run) => {
		if (run?.sessionKey && chatRunBelongsToAgent({
			...run,
			defaultAgentId
		}, agentId)) add(run.sessionKey, run.sessionId);
	};
	const drains = [];
	try {
		for (const sessionId of listActiveEmbeddedRunSessionIds()) {
			const embedded = captureEmbeddedRunDrainTarget(sessionId, {
				agentId,
				defaultAgentId
			});
			if (embedded) {
				embeddedRuns.set(sessionId, embedded);
				mcpSessionIds.add(sessionId);
			}
			addOwned(embedded);
			if (embedded && !embedded.sessionKey) unkeyedRuns.push(embedded);
			const reply = resolveReplyRunForCurrentSessionId(sessionId);
			if (reply) addOwned({
				agentId: reply.agentId,
				sessionKey: reply.key,
				sessionId: reply.sessionId
			});
		}
		for (const run of context.chatAbortControllers.values()) addOwned(run);
		for (const runId of listLiveAgentRunIds()) addOwned(getAgentRunContext(runId));
		for (const [scope, identities] of admissions) for (const identity of identities) if (parseAgentSessionKey(identity)?.agentId === agentId) add(identity, void 0, scope.startsWith("agent:") ? storePath : scope);
		for (const { sessionKey, entry } of await readSessionEntrySummariesInWorker({
			agentId,
			storePath
		})) {
			const owner = resolvePersistedSessionStoreOwnerForKey(cfg, sessionKey);
			if ((parseAgentSessionKey(sessionKey)?.agentId ?? (owner.kind === "none" ? agentId : owner.agentId)) === agentId) add(sessionKey, entry.sessionId, storePath, entry);
		}
		const physical = [...targets.values()].filter((target) => target.sessionId);
		for (const [key, target] of targets) {
			if (target.sessionId) continue;
			const owners = physical.filter((owner) => owner.sessionKeys.some((alias) => target.sessionKeys.includes(alias)));
			for (const owner of owners) {
				owner.sessionKeys = [.../* @__PURE__ */ new Set([...owner.sessionKeys, ...target.sessionKeys])];
				owner.lifecycleIdentities = [.../* @__PURE__ */ new Set([...owner.lifecycleIdentities, ...target.lifecycleIdentities])];
			}
			if (owners.length) targets.delete(key);
		}
		assertCurrent();
		const embedded = unkeyedRuns.map(async (run) => {
			assertCurrent();
			run.abort();
			if (!await run.waitForEnd(15e3)) throw new Error(`Embedded run in session ${run.sessionId} did not end. Wait for the run to end, then retry agents.delete; agent storage has been preserved.`);
		});
		const preparing = new Set(targets.values());
		const sessions = [...preparing].map(async (target) => {
			const drain = await prepareSessionLifecycleDrain({
				...target,
				onPrepared: () => preparing.delete(target)
			});
			if (finished) {
				drain.release();
				return;
			}
			drains.push(drain);
			if (drain.hasAuthoritativeWork()) throw new Error(`Agent ${agentId} still has active work in ${target.sessionKey}`);
		});
		const admitted = Promise.resolve().then(() => {
			assertCurrent();
			return startAgentWorkAdmissionInterruption({
				agentId,
				assertCurrent,
				reason: createAgentRunDirectAbortError()
			}).released;
		});
		const terminals = Promise.resolve().then(async () => {
			const drain = context.terminalSessions?.beginAgentSessionDrain(agentId, assertCurrent);
			try {
				await drain?.drained;
			} finally {
				drain?.release();
			}
		});
		const failures = [];
		const settled = await settlesWithin(Promise.all([
			...sessions,
			admitted,
			...embedded,
			terminals
		].map((work) => work.catch((error) => {
			failures.push(error);
		}))), SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS);
		if (failures.length === 1) throw failures[0];
		if (failures.length > 1) throw new AggregateError(failures, `Agent ${agentId} deletion failed: ${failures.map((error) => formatErrorMessage(error)).join("; ")}`);
		if (!settled) {
			if (preparing.size) throw new Error(`Agent ${agentId} deletion preparation timed out for sessions: ${[...preparing].map((target) => target.sessionKey).join(", ")}. Check session placement availability, then retry agents.delete; agent storage has been preserved.`);
			const stuck = [...embeddedRuns.values()].filter((run) => run.isActive());
			throw new Error(`Agent ${agentId} deletion is still draining${stuck.length ? ` embedded runs in sessions: ${stuck.map((run) => run.sessionId).join(", ")}` : " active work"}. Wait for active work to end, then retry agents.delete; agent storage has been preserved.`);
		}
		await drainAgentExecProcesses(agentId, assertCurrent);
		for (const sessionId of listAgentSessionMcpRuntimeIds(agentId)) mcpSessionIds.add(sessionId);
		for (const target of targets.values()) if (target.sessionId) mcpSessionIds.add(target.sessionId);
		for (const sessionId of mcpSessionIds) await retireSessionMcpRuntimeForAgentDeletion({
			sessionId,
			agentId,
			assertCurrent
		});
		await cleanupBrowserSessionsForLifecycleEnd({
			cfg,
			sessionKeys: [...targets.values()].flatMap((target) => target.sessionKeys).map((requestKey) => toAgentStoreSessionKey({
				agentId,
				requestKey
			})),
			isCurrent: () => {
				assertCurrent();
				return true;
			},
			onWarn: (message) => context.logGateway.warn(message)
		});
		assertCurrent();
	} finally {
		finished = true;
		for (const run of embeddedRuns.values()) run.release();
		for (const drain of drains) drain.release();
	}
}
//#endregion
//#region src/gateway/server-methods/agents-delete-filesystem.ts
var AgentCleanupIdentityMismatchError = class extends Error {};
function cleanupFailure(pathname, error) {
	return { failed: {
		path: pathname,
		reason: (error instanceof Error && error.message ? error.message : String(error)) || "unknown error"
	} };
}
function cleanupPathIdentity(stat) {
	return stat ? {
		dev: stat.dev.toString(),
		ino: stat.ino.toString()
	} : null;
}
function cleanupPathIdentityMatches(observed, persisted) {
	if (typeof persisted !== "number") return observed === persisted;
	const exact = BigInt(observed);
	return Number.isInteger(persisted) && Number(exact < 0n ? BigInt.asUintN(64, exact) : exact) === persisted;
}
async function statAgentCleanupPath(cleanupPath) {
	const parentPath = cleanupPath.parentPath;
	const parentRoot = await root(parentPath, {
		hardlinks: "reject",
		symlinks: "reject"
	});
	if (path.resolve(parentRoot.rootReal) !== parentPath) throw new FsSafeError("path-mismatch", "cleanup path parent changed before deletion");
	const stat = await parentRoot.stat(path.basename(cleanupPath.trashPath));
	if (stat.isSymbolicLink !== (cleanupPath.kind === "symlink")) throw new AgentCleanupIdentityMismatchError(`cleanup path changed from ${cleanupPath.kind} before deletion`);
	if (stat.isFile && stat.nlink > 1) throw new AgentCleanupIdentityMismatchError("hardlinked cleanup replacement preserved");
	if (!stat.exactIdentity) throw new AgentCleanupIdentityMismatchError("cleanup path exact identity is unavailable");
	const identity = cleanupPathIdentity(stat.exactIdentity);
	if (cleanupPath.preparedIdentity === null) cleanupPath.preparedIdentity = identity;
	else if (identity === null || !cleanupPathIdentityMatches(identity.dev, cleanupPath.preparedIdentity.dev) || !cleanupPathIdentityMatches(identity.ino, cleanupPath.preparedIdentity.ino)) throw new AgentCleanupIdentityMismatchError("cleanup path identity changed before deletion");
	cleanupPath.preparedIdentity = identity;
}
async function removeAgentPath(cleanupPath, deletion) {
	const pathname = cleanupPath.path;
	const trashPath = cleanupPath.trashPath;
	try {
		await statAgentCleanupPath(cleanupPath);
	} catch (error) {
		if (error instanceof AgentCleanupIdentityMismatchError) return { skipped: {
			path: pathname,
			reason: error.message
		} };
		return isMissingPathError(error) ? { removed: {
			path: pathname,
			method: "missing"
		} } : cleanupFailure(pathname, error);
	}
	try {
		deletion.assertCurrentFinal();
		await movePathToTrash(trashPath, { allowedRoots: [
			...trashAllowedRoots(cleanupPath.sourcePaths, cleanupPath.kind === "symlink" ? cleanupPath.canonicalPath : void 0),
			os.homedir(),
			os.tmpdir()
		] });
		return { removed: {
			path: pathname,
			method: "trash"
		} };
	} catch (error) {
		if (!isMissingPathError(error)) return cleanupFailure(pathname, error);
		try {
			await statAgentCleanupPath(cleanupPath);
			return cleanupFailure(pathname, error);
		} catch (statError) {
			return isMissingPathError(statError) ? { removed: {
				path: pathname,
				method: "missing"
			} } : cleanupFailure(pathname, statError);
		}
	}
}
async function resolveAgentDeleteCleanupTarget(pathname) {
	const candidate = path.resolve(pathname);
	try {
		return await fs.realpath(candidate);
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
		const { existingPath, unresolvedSegments } = resolvePathPrefixSync(candidate);
		return path.resolve(existingPath, ...unresolvedSegments);
	}
}
async function prepareAgentDeleteCleanupPaths(paths, persistedPaths = []) {
	const uniquePaths = /* @__PURE__ */ new Map();
	const addPath = (candidate) => {
		const existing = uniquePaths.get(candidate.trashPath);
		if (!existing) {
			uniquePaths.set(candidate.trashPath, candidate);
			return;
		}
		existing.sourcePaths = [.../* @__PURE__ */ new Set([...existing.sourcePaths, ...candidate.sourcePaths])];
		existing.done ||= candidate.done;
		existing.note ??= candidate.note;
		existing.preparationError ??= candidate.preparationError;
		if (candidate.kind === "target") {
			existing.kind = "target";
			existing.canonicalPath = candidate.canonicalPath;
			existing.parentPath = candidate.parentPath;
			existing.trashCoversDescendants ||= candidate.trashCoversDescendants;
		}
	};
	for (const persistedPath of persistedPaths) {
		const journalPath = path.resolve(persistedPath.path);
		const trashPath = path.resolve(persistedPath.canonicalPath);
		addPath({
			path: journalPath,
			parentPath: path.resolve(persistedPath.parentPath),
			canonicalPath: normalizeAgentDirRegistryPath(trashPath),
			trashPath,
			trashCoversDescendants: persistedPath.coversDescendants,
			kind: persistedPath.kind,
			preparedIdentity: persistedPath.dev === null || persistedPath.ino === null ? null : {
				dev: persistedPath.dev,
				ino: persistedPath.ino
			},
			done: persistedPath.done,
			note: persistedPath.note,
			sourcePaths: persistedPath.sourcePaths.map((sourcePath) => path.resolve(sourcePath))
		});
	}
	for (const pathname of paths) {
		const sourcePath = path.resolve(pathname);
		let sourceParentPath = path.dirname(sourcePath);
		let resolvedPath = sourcePath;
		let preparationError;
		try {
			resolvedPath = await resolveAgentDeleteCleanupTarget(pathname);
			sourceParentPath = await resolveAgentDeleteCleanupTarget(path.dirname(sourcePath));
		} catch (error) {
			preparationError = error;
		}
		let sourceStat;
		try {
			sourceStat = await fs.lstat(pathname, { bigint: true });
		} catch (error) {
			if (!isMissingPathError(error)) preparationError ??= error;
		}
		let targetStat = sourceStat;
		if (resolvedPath !== sourcePath) try {
			targetStat = await fs.lstat(resolvedPath, { bigint: true });
		} catch (error) {
			if (!isMissingPathError(error)) preparationError ??= error;
			targetStat = void 0;
		}
		const canonicalPath = normalizeAgentDirRegistryPath(resolvedPath);
		addPath({
			path: resolvedPath,
			parentPath: path.dirname(resolvedPath),
			canonicalPath,
			trashPath: resolvedPath,
			trashCoversDescendants: targetStat ? !targetStat.isSymbolicLink() : false,
			kind: "target",
			preparedIdentity: cleanupPathIdentity(targetStat),
			done: false,
			preparationError,
			sourcePaths: [sourcePath]
		});
		if (sourceStat?.isSymbolicLink() && sourcePath !== resolvedPath) addPath({
			path: sourcePath,
			parentPath: sourceParentPath,
			canonicalPath,
			trashPath: path.join(sourceParentPath, path.basename(sourcePath)),
			trashCoversDescendants: false,
			kind: "symlink",
			preparedIdentity: cleanupPathIdentity(sourceStat),
			done: false,
			sourcePaths: [sourcePath]
		});
	}
	const depth = (pathname) => path.relative(path.parse(pathname).root, pathname).split(path.sep).filter(Boolean).length;
	const cleanupDepth = (cleanupPath) => Math.max(depth(cleanupPath.canonicalPath), depth(cleanupPath.trashPath), ...cleanupPath.sourcePaths.map(depth));
	const compareFallback = (left, right) => {
		if (left.kind !== right.kind) return left.kind === "target" ? -1 : 1;
		const depthDifference = cleanupDepth(right) - cleanupDepth(left);
		if (depthDifference !== 0) return depthDifference;
		return depth(right.trashPath) - depth(left.trashPath) || left.trashPath.localeCompare(right.trashPath);
	};
	const mustPrecede = (left, right) => {
		if (left.kind !== right.kind) return left.kind === "target";
		if (isPathInside(right.trashPath, left.trashPath)) return true;
		if (isPathInside(left.trashPath, right.trashPath)) return false;
		const rightRoots = [right.trashPath, ...right.sourcePaths];
		return left.sourcePaths.some((leftSource) => rightRoots.some((rightRoot) => isPathInside(rightRoot, leftSource)));
	};
	const remaining = [...uniquePaths.values()].toSorted(compareFallback);
	const ordered = [];
	while (remaining.length > 0) {
		const nextIndex = remaining.findIndex((candidate, candidateIndex) => remaining.every((other, otherIndex) => otherIndex === candidateIndex || !mustPrecede(other, candidate)));
		ordered.push(...remaining.splice(Math.max(0, nextIndex), 1));
	}
	return ordered;
}
function cleanupPathCovers(cleanupPath, targetPath, canonicalTargetPath) {
	const trashTargetPath = path.resolve(targetPath);
	return cleanupPath.sourcePaths.includes(trashTargetPath) || cleanupPath.trashPath === trashTargetPath || cleanupPath.trashCoversDescendants && (cleanupPath.kind === "target" || isPathInside(cleanupPath.trashPath, trashTargetPath)) && isPathInside(cleanupPath.canonicalPath, canonicalTargetPath);
}
//#endregion
//#region src/gateway/server-methods/agents-delete.ts
var AgentSharedAuthStoreOwnerError = class extends Error {};
async function agentOwnsSharedAuthStore(cfg, agentId) {
	await prepareSharedAuthStoreOwnership();
	const agentDir = resolveAgentDir(cfg, agentId);
	return isSharedAuthStoreOwner({
		ownership: resolveSharedAuthStoreOwnership(),
		agentAuthDbPath: resolveAuthProfileDatabasePath(agentDir),
		sharedAuthDbPath: resolveSharedAuthStorePath()
	});
}
/** RPC and restart recovery share the exact journal, retirement, and filesystem owner. */
async function deleteGatewayAgent(agentId, requestedDeleteFiles, context, options = {}) {
	const { recoveryOperationId, writeOptions } = options;
	let releaseIngress;
	try {
		return await withAgentDeletion(agentId, async (begin) => {
			const prepared = await withConfigMutationExclusive(async (lockedConfig) => {
				await assertAgentSessionStoreDeletionSafe(lockedConfig, agentId);
				let lockedJournal = await readAgentDeletionJournalAsync(agentId);
				if (recoveryOperationId && (lockedJournal?.operationId !== recoveryOperationId || lockedJournal.cleanupCompleted)) throw new Error(`Agent ${agentId} deletion recovery no longer owns its journal.`);
				const configured = isConfiguredAgent(lockedConfig, agentId);
				if (await agentOwnsSharedAuthStore(lockedConfig, agentId)) throw new AgentSharedAuthStoreOwnerError(formatSharedAuthStoreOwnerDeleteError(agentId));
				if (!configured && (!lockedJournal || lockedJournal.cleanupCompleted)) throw new AgentConfigPreconditionError(`agent "${agentId}" not found`);
				if (agentId === tryResolveSoleAgentId(lockedConfig)) throw new AgentConfigPreconditionError(`agent "${agentId}" is the only configured agent`);
				if (isInheritedAuthStoreOwner(lockedConfig, agentId)) throw new AgentConfigPreconditionError(`agent "${agentId}" owns agents.defaults.authInheritance.agentId; relocate credentials and re-point it first`);
				if (configured && lockedJournal?.cleanupCompleted) {
					const claimed = await claimCompletedAgentDeletion(agentId, lockedJournal.operationId);
					const remainingJournal = await readAgentDeletionJournalAsync(agentId);
					if (!claimed && remainingJournal) throw new Error(`agent "${agentId}" deletion tombstone changed before fresh deletion`);
					lockedJournal = void 0;
				}
				const deleteFiles = lockedJournal?.deleteFiles ?? requestedDeleteFiles;
				releaseIngress = closeAgentWorkAdmissions({
					agentId,
					reason: /* @__PURE__ */ new Error(`Agent ${agentId} deletion is draining active work.`)
				});
				return {
					deletion: await begin(lockedJournal ?? {
						agentId,
						agentDir: resolveAgentDir(lockedConfig, agentId),
						workspaceDir: resolveAgentWorkspaceDir(lockedConfig, agentId),
						sessionsDir: resolveSessionTranscriptsDirForAgent(agentId),
						deleteFiles,
						phase: "draining"
					}, { recoveryOperationId }),
					lockedJournal,
					config: lockedConfig
				};
			});
			const { deletion, lockedJournal } = prepared;
			const journal = deletion.entry;
			if (journal.phase === "draining") await drainAgentDeletionRuns(agentId, prepared.config, context, deletion.assertCurrentFinal);
			const { closeActiveMemorySearchManagerCore } = await import("./memory-runtime-CCvD2E5N.mjs");
			await deletion.assertCurrentAsync();
			await closeActiveMemorySearchManagerCore({
				cfg: prepared.config,
				agentId
			});
			await deletion.assertCurrentAsync();
			if (journal.phase === "draining") {
				await drainAgentDeleteDatabaseWork(deletion);
				await deletion.retire();
			}
			return await withConfigMutationExclusive(async (lockedConfig) => {
				const configured = isConfiguredAgent(lockedConfig, agentId);
				const deleteFiles = journal.deleteFiles;
				let rosterCommitted = !configured;
				let committed;
				let databasePlan;
				try {
					await deletion.assertCurrentAsync();
					await assertAgentSessionStoreDeletionSafe(lockedConfig, agentId);
					if (await agentOwnsSharedAuthStore(lockedConfig, agentId) || isInheritedAuthStoreOwner(lockedConfig, agentId)) throw new AgentSharedAuthStoreOwnerError(formatSharedAuthStoreOwnerDeleteError(agentId));
					if (agentId === tryResolveSoleAgentId(lockedConfig)) throw new AgentConfigPreconditionError(`agent "${agentId}" is the only configured agent`);
					prepareJournaledAgentDirOwnership(lockedConfig, agentId, journal.agentDir);
					databasePlan = await prepareAgentDeleteDatabases(lockedConfig, agentId, journal.agentDir, {}, deletion);
					await deletion.assertCurrentAsync();
					await deletion.fenceDatabasePaths([...journal.databasePaths, ...databasePlan.fileGroups.flat()]);
					if (deleteFiles) {
						const fencedSourcePaths = new Set(journal.cleanupPaths.flatMap((cleanupPath) => cleanupPath.sourcePaths.map((sourcePath) => path.resolve(sourcePath))));
						const unfencedSourcePaths = [
							journal.workspaceDir,
							journal.agentDir,
							journal.sessionsDir,
							...journal.databasePaths
						].filter((sourcePath) => !fencedSourcePaths.has(path.resolve(sourcePath)));
						if (unfencedSourcePaths.length > 0) {
							const unfencedSourcePathSet = new Set(unfencedSourcePaths.map((sourcePath) => path.resolve(sourcePath)));
							const cleanupPlan = await prepareAgentDeleteCleanupPaths(unfencedSourcePaths, journal.cleanupPaths);
							const unresolvedPath = cleanupPlan.find((cleanupPath) => cleanupPath.preparationError !== void 0 && cleanupPath.sourcePaths.some((sourcePath) => unfencedSourcePathSet.has(path.resolve(sourcePath))));
							if (unresolvedPath) throw unresolvedPath.preparationError;
							await deletion.fenceCleanupPaths(cleanupPlan.map((cleanupPath) => {
								const journalPath = {
									path: cleanupPath.path,
									canonicalPath: cleanupPath.trashPath,
									parentPath: cleanupPath.parentPath,
									kind: cleanupPath.kind,
									sourcePaths: cleanupPath.sourcePaths,
									dev: cleanupPath.preparedIdentity?.dev ?? null,
									ino: cleanupPath.preparedIdentity?.ino ?? null,
									coversDescendants: cleanupPath.trashCoversDescendants,
									done: cleanupPath.done
								};
								if (cleanupPath.note) journalPath.note = cleanupPath.note;
								return journalPath;
							}));
						}
					}
					await context.cron.removeAgentJobsTransactional(agentId, () => withAgentExecApprovalsRemoved(agentId, async () => {
						await deletion.assertCurrentAsync();
						try {
							committed = await deleteAgentConfigEntry({
								agentId,
								allowMissing: !configured,
								allowConfigSizeDrop: true,
								assertCurrent: deletion.assertCurrentFinal,
								assertCurrentAsync: deletion.assertCurrentAsync,
								writeOptions
							});
						} catch (error) {
							try {
								const persisted = await readConfigFileSnapshotForWrite();
								if (!isConfiguredAgent(persisted.snapshot.sourceConfig, agentId)) {
									rosterCommitted = true;
									throw new AgentDeletionCommitUncertainError(error);
								}
							} catch (readError) {
								if (readError instanceof AgentDeletionCommitUncertainError) throw readError;
								throw new AgentDeletionCommitUncertainError(error);
							}
							throw error;
						}
						if (configured && !committed.result) {
							rosterCommitted = !isConfiguredAgent(committed.nextConfig, agentId);
							const missingResultError = /* @__PURE__ */ new Error("agent delete config mutation did not return its target");
							if (rosterCommitted) throw new AgentDeletionCommitUncertainError(missingResultError);
							throw missingResultError;
						}
						rosterCommitted = true;
					}, deletion));
					await deletion.assertCurrentAsync();
				} catch (error) {
					let canReleaseFence = !rosterCommitted && !lockedJournal && !(error instanceof AgentDeletionAuthorityRollbackError) && !(error instanceof AgentDeletionCommitUncertainError);
					if (canReleaseFence) try {
						const persisted = await readConfigFileSnapshotForWrite();
						canReleaseFence = isConfiguredAgent(persisted.snapshot.sourceConfig, agentId);
					} catch {
						canReleaseFence = false;
					}
					if (canReleaseFence) await deletion.rollback();
					throw error;
				}
				await retireAgentDeleteRuntime(deletion, databasePlan?.agentDirs ?? [journal.agentDir]);
				const deleteResult = committed?.result ?? {
					agentDir: journal.agentDir,
					workspaceDir: journal.workspaceDir,
					sessionsDir: journal.sessionsDir,
					removedBindings: 0
				};
				const nextConfig = committed?.nextConfig ?? lockedConfig;
				const agentDirRegistryPath = normalizeAgentDirRegistryPath(deleteResult.agentDir);
				const failed = [];
				const purgeFailed = await purgeAgentSessionStoreEntries(lockedConfig, agentId, {
					runDatabaseCleanup: deletion.runDatabaseCleanup,
					onFailure: (failure) => failed.push(failure)
				});
				await deletion.assertCurrentAsync();
				const { closeDeletedAgentDatabases } = await import("./openclaw-agent-db-readers-0ZLrwIOs.mjs");
				await closeDeletedAgentDatabases(agentId, databasePlan?.readerPaths ?? [], deletion);
				const removed = [];
				if (deleteFiles && !purgeFailed) {
					const survivingDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(await readAgentDeleteDatabaseRegistry(), agentId);
					const unclaimedBySurvivor = (pathname) => !isPathOwnedBySurvivingAgent(nextConfig, agentId, pathname, survivingDatabaseFilePaths);
					const workspaceTrashEligible = unclaimedBySurvivor(deleteResult.workspaceDir);
					const agentDirTrashEligible = resolveRegisteredAgentIdForDir(deleteResult.agentDir) === agentId && unclaimedBySurvivor(deleteResult.agentDir);
					const sessionsDirTrashEligible = unclaimedBySurvivor(deleteResult.sessionsDir);
					const databaseFilePaths = [...(agentDirTrashEligible ? databasePlan?.relocatedFileGroups ?? [] : databasePlan?.fileGroups ?? []).flat(), ...journal.databasePaths].filter(unclaimedBySurvivor);
					const eligibleSourcePaths = new Set([
						...workspaceTrashEligible ? [deleteResult.workspaceDir] : [],
						...agentDirTrashEligible ? [deleteResult.agentDir] : [],
						...sessionsDirTrashEligible ? [deleteResult.sessionsDir] : [],
						...databaseFilePaths
					].map((sourcePath) => path.resolve(sourcePath)));
					const cleanupPaths = (await prepareAgentDeleteCleanupPaths([], journal.cleanupPaths)).filter((cleanupPath) => cleanupPath.sourcePaths.some((sourcePath) => eligibleSourcePaths.has(sourcePath)) && (agentDirTrashEligible || !cleanupPathCovers(cleanupPath, deleteResult.agentDir, agentDirRegistryPath)));
					const workspaceCanonicalPath = normalizeAgentDirRegistryPath(deleteResult.workspaceDir);
					const workspaceCleanupPaths = cleanupPaths.filter((cleanupPath) => cleanupPathCovers(cleanupPath, deleteResult.workspaceDir, workspaceCanonicalPath));
					const legacyPlan = workspaceCleanupPaths.length > 0 ? prepareLegacyWorkspaceStateReset(deleteResult.workspaceDir) : void 0;
					const statePlan = workspaceCleanupPaths.length > 0 ? prepareWorkspaceStateDeletion(deleteResult.workspaceDir) : void 0;
					const markCleanupPathDone = async (cleanupPath, note) => {
						const canonicalPath = path.resolve(cleanupPath.trashPath);
						await deletion.fenceCleanupPaths(journal.cleanupPaths.map((entry) => {
							if (path.resolve(entry.canonicalPath) !== canonicalPath || entry.kind !== cleanupPath.kind) return entry;
							const updated = Object.assign({}, entry, {
								done: true,
								dev: cleanupPath.preparedIdentity?.dev ?? null,
								ino: cleanupPath.preparedIdentity?.ino ?? null
							});
							if (note) updated.note = note;
							return updated;
						}));
						cleanupPath.done = true;
						cleanupPath.note = note;
					};
					const protectedCleanupPaths = [];
					for (const cleanupPath of cleanupPaths) {
						await deletion.assertCurrentAsync();
						if (cleanupPath.done) {
							let replacementPresent = true;
							let note = cleanupPath.note ?? "completed cleanup path is occupied; replacement preserved";
							try {
								await statAgentCleanupPath(cleanupPath);
							} catch (error) {
								if (isMissingPathError(error)) replacementPresent = false;
								else if (!(error instanceof AgentCleanupIdentityMismatchError)) note = "completed cleanup path could not be verified; replacement preserved";
							}
							if (replacementPresent) {
								await markCleanupPathDone(cleanupPath, note);
								protectedCleanupPaths.push({
									cleanupPath,
									protectAliases: true,
									terminal: true,
									note
								});
							}
							continue;
						}
						const refreshedDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(await readAgentDeleteDatabaseRegistry(), agentId);
						const blockingProtection = protectedCleanupPaths.find(({ cleanupPath: protectedPath, protectAliases }) => (cleanupPath.kind !== "symlink" || protectAliases) && (protectedPath.canonicalPath === cleanupPath.canonicalPath || isPathInside(cleanupPath.canonicalPath, protectedPath.canonicalPath)) || [protectedPath.trashPath, ...protectAliases ? protectedPath.sourcePaths : []].some((protectedSourcePath) => protectedSourcePath === cleanupPath.trashPath || isPathInside(cleanupPath.trashPath, protectedSourcePath)));
						const ownedBySurvivor = isPathOwnedBySurvivingAgent(nextConfig, agentId, cleanupPath.path, refreshedDatabaseFilePaths) || cleanupPathCovers(cleanupPath, deleteResult.agentDir, agentDirRegistryPath) && resolveRegisteredAgentIdForDir(deleteResult.agentDir) !== agentId;
						if (blockingProtection || ownedBySurvivor) {
							const terminal = ownedBySurvivor || blockingProtection?.terminal === true;
							const note = ownedBySurvivor ? "replacement owned by a surviving agent" : blockingProtection?.note;
							if (terminal) await markCleanupPathDone(cleanupPath, note ?? "protected replacement preserved");
							protectedCleanupPaths.push({
								cleanupPath,
								protectAliases: blockingProtection?.protectAliases ?? false,
								terminal,
								note
							});
							continue;
						}
						const outcome = cleanupPath.preparationError ? cleanupFailure(cleanupPath.path, cleanupPath.preparationError) : await removeAgentPath(cleanupPath, deletion);
						if ("removed" in outcome) {
							removed.push(outcome.removed);
							await markCleanupPathDone(cleanupPath);
						} else if ("skipped" in outcome) {
							await markCleanupPathDone(cleanupPath, outcome.skipped.reason);
							protectedCleanupPaths.push({
								cleanupPath,
								protectAliases: true,
								terminal: true,
								note: outcome.skipped.reason
							});
						} else {
							failed.push(outcome.failed);
							protectedCleanupPaths.push({
								cleanupPath,
								protectAliases: true,
								terminal: false
							});
						}
					}
					if (workspaceCleanupPaths.length > 0 && workspaceCleanupPaths.every((cleanupPath) => cleanupPath.done) && legacyPlan && statePlan) try {
						await removeLegacyWorkspaceStateForReset(legacyPlan, { assertCurrent: deletion.assertCurrentFinal });
						await deletion.assertCurrentAsync();
						await deleteWorkspaceState(statePlan, { deletion });
					} catch {}
					await deletion.assertCurrentAsync();
					const agentDirCleanupPaths = cleanupPaths.filter((cleanupPath) => cleanupPathCovers(cleanupPath, deleteResult.agentDir, agentDirRegistryPath));
					if (agentDirCleanupPaths.length > 0 && agentDirCleanupPaths.every((cleanupPath) => cleanupPath.done)) unregisterResolvedAgentDir({
						agentId,
						agentDir: agentDirRegistryPath
					});
				}
				await finishAgentDeleteDatabases({
					deletion,
					agentDir: agentDirRegistryPath,
					deleteFiles,
					complete: failed.length === 0 && !purgeFailed
				});
				return {
					ok: true,
					agentId,
					removedBindings: deleteResult.removedBindings,
					removed,
					failed,
					...purgeFailed ? { purgeFailed: true } : {}
				};
			});
		});
	} finally {
		releaseIngress?.();
	}
}
//#endregion
export { agentOwnsSharedAuthStore as n, deleteGatewayAgent as r, AgentSharedAuthStoreOwnerError as t };
