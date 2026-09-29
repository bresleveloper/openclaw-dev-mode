import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { r as normalizeAgentIdStrict } from "./agent-id-GA8mwdTG.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { E as listAgentEntries, M as tryResolveSoleAgentId, O as listAgentIds, a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAgentDirRegistryPath } from "./agent-dir-registry-QuKJka9m.mjs";
import { f as resolveSessionTranscriptsDirForAgent } from "./paths-CcMbq5NY.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { r as replaceConfigFile } from "./mutate-CDIHLSip.mjs";
import "./config-Ciq2mxdN.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { o as callGateway, p as isGatewayCredentialsRequiredError } from "./call-C_MP4_Gs.mjs";
import { a as isGatewayTransportError } from "./transport-error-C-c71VUr.mjs";
import { r as formatCliJsonFailure } from "./failure-output-Cct-llrO.mjs";
import { c as resolveSharedAuthStorePath, o as resolveSharedAuthStoreOwnership } from "./path-resolve-Bm8Ih2d_.mjs";
import { o as readAgentDeletionJournal } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { o as unregisterOpenClawAgentDatabases } from "./openclaw-agent-db-registry-CCrn1pMl.mjs";
import { h as resolveAuthProfileDatabasePath } from "./sqlite-BIg_k8qE.mjs";
import { i as prepareWorkspaceStateDeletion, n as deleteWorkspaceState } from "./workspace-state-store-DTZ2RTNw.mjs";
import { d as removeLegacyWorkspaceStateForReset, u as prepareLegacyWorkspaceStateReset } from "./workspace-legacy-state-6xtqRcEJ.mjs";
import { i as claimCompletedAgentDeletion, s as withAgentDeletion } from "./agent-lifecycle-registry-D47RUurT.mjs";
import { _ as withAgentExecApprovalsRemoved } from "./exec-approvals-store-CTT-ox-I.mjs";
import "./exec-approvals-BgZlQ2Qp.mjs";
import "./sessions-DE4llkPV.mjs";
import { t as purgeAgentSessionStoreEntries } from "./cleanup-service-D-GfJ1eJ.mjs";
import { i as pruneAgentConfig, r as findAgentEntryIndex } from "./agents.config-BnlRDoFW.mjs";
import { a as moveToTrashResult } from "./cleanup-utils-MkYk5me2.mjs";
import { t as createClackPrompter } from "./clack-prompter-D8DhCvTT.mjs";
import { r as logConfigUpdated } from "./logging-DLCoHZv9.mjs";
import { t as withLocalAgentCronJobsRemoved } from "./local-service-CbyjMT34.mjs";
import { i as isSharedAuthStoreOwner, n as formatSharedAuthStoreOwnerDeleteError, r as isInheritedAuthStoreOwner, t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-Ci4iwiZS.mjs";
import { a as readAgentDeleteDatabaseRegistry, i as prepareAgentDeleteDatabases, n as assertAgentSessionStoreDeletionSafe, o as resolveSurvivingDatabaseFilePaths, r as isPathOwnedBySurvivingAgent, t as AgentSharedStoreOwnerError } from "./agent-delete-databases-CY5IIYgH.mjs";
import { r as requireValidConfigForWrite } from "./config-validation-CdWq9kXm.mjs";
//#region src/commands/agents.command-shared.ts
/** Wrap a runtime so helper setup work stays silent in JSON output paths. */
function createQuietRuntime(runtime) {
	return {
		...runtime,
		log: () => {}
	};
}
//#endregion
//#region src/commands/agents.commands.delete.ts
function failAgentsDelete(opts, runtime, message) {
	if (opts.json) {
		writeRuntimeJson(runtime, formatCliJsonFailure(message));
		runtime.exit(1, { resetStream: process.stderr });
	} else {
		runtime.error(message);
		runtime.exit(1);
	}
}
function logClearedOwnerRefs(runtime, clearedOwnerRefs) {
	if (clearedOwnerRefs.length > 0) runtime.log(`Cleared owner references: ${clearedOwnerRefs.join(", ")}`);
}
function logSessionPurgeWarning(runtime, agentId, purgeFailed) {
	if (purgeFailed) runtime.error(`Warning: session-store purge failed for deleted agent "${agentId}"; source data was retained. Retry deletion after resolving the storage error.`);
}
async function maybeDeleteAgentThroughGateway(params) {
	try {
		return {
			kind: "deleted",
			result: await callGateway({
				method: "agents.delete",
				params: {
					agentId: params.agentId,
					deleteFiles: params.deleteFiles
				},
				mode: GATEWAY_CLIENT_MODES.CLI,
				clientName: GATEWAY_CLIENT_NAMES.CLI,
				requiredMethods: ["agents.delete"]
			})
		};
	} catch (error) {
		if (isGatewayTransportError(error) && error.kind === "closed" && error.code === void 0) return { kind: "fallback-unreachable" };
		if (isGatewayCredentialsRequiredError(error)) return { kind: "fallback-credentials-required" };
		throw error;
	}
}
/** Delete an agent, pruning config plus workspace/session state when it is safe to do so. */
async function agentsDeleteCommand(opts, runtime = defaultRuntime) {
	const writeSnapshot = await requireValidConfigForWrite(runtime);
	if (!writeSnapshot) return;
	const cfg = writeSnapshot.snapshot.sourceConfig;
	const input = opts.id?.trim();
	if (!input) {
		failAgentsDelete(opts, runtime, `Agent id is required. Run ${formatCliCommand("openclaw agents list")} to choose one.`);
		return;
	}
	const normalized = normalizeAgentIdStrict(input);
	if (!normalized.ok) {
		failAgentsDelete(opts, runtime, `Agent "${input}" not found. Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
		return;
	}
	const agentId = normalized.value;
	if (!opts.json && agentId !== input) runtime.log(`Normalized agent id to "${agentId}".`);
	const configured = findAgentEntryIndex(listAgentEntries(cfg), agentId) >= 0;
	let existingJournal = configured ? void 0 : readAgentDeletionJournal(agentId);
	if (!configured && (!existingJournal || existingJournal.cleanupCompleted)) {
		failAgentsDelete(opts, runtime, `Agent "${agentId}" not found. Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
		return;
	}
	const configuredAgentDir = configured ? resolveAgentDir(cfg, agentId) : void 0;
	const safetyAgentDir = existingJournal?.agentDir ?? configuredAgentDir;
	if (!safetyAgentDir) throw new Error(`Agent "${agentId}" deletion has no state directory.`);
	try {
		assertAgentSessionStoreDeletionSafe(cfg, agentId);
	} catch (error) {
		if (!(error instanceof AgentSharedStoreOwnerError)) throw error;
		failAgentsDelete(opts, runtime, error.message);
		return;
	}
	const sharedAuthOwnership = resolveSharedAuthStoreOwnership();
	if (isSharedAuthStoreOwner({
		ownership: sharedAuthOwnership,
		agentAuthDbPath: resolveAuthProfileDatabasePath(safetyAgentDir),
		sharedAuthDbPath: resolveSharedAuthStorePath()
	})) {
		failAgentsDelete(opts, runtime, formatSharedAuthStoreOwnerDeleteError(agentId));
		return;
	}
	if (configured && agentId === tryResolveSoleAgentId(cfg)) {
		failAgentsDelete(opts, runtime, `Agent "${agentId}" is the only configured agent and cannot be deleted.`);
		return;
	}
	if (isInheritedAuthStoreOwner(cfg, agentId)) {
		failAgentsDelete(opts, runtime, `Agent "${agentId}" owns inherited credentials through agents.defaults.authInheritance.agentId and cannot be deleted. Relocate those credentials, then re-point or remove that binding before retrying.`);
		return;
	}
	if (configured) {
		existingJournal = readAgentDeletionJournal(agentId);
		if (existingJournal?.cleanupCompleted) existingJournal = void 0;
	}
	const agentDir = existingJournal?.agentDir ?? configuredAgentDir;
	if (!agentDir) throw new Error(`Agent "${agentId}" deletion has no state directory.`);
	if (!opts.force) {
		if (!isTerminalInteractive()) {
			failAgentsDelete(opts, runtime, "Non-interactive session. Re-run with --force.");
			return;
		}
		if (!await createClackPrompter().confirm({
			message: `Delete agent "${agentId}" and prune workspace/state?`,
			initialValue: false
		})) {
			runtime.log("Cancelled.");
			return;
		}
	}
	const workspaceDir = existingJournal?.workspaceDir ?? resolveAgentWorkspaceDir(cfg, agentId);
	const sessionsDir = existingJournal?.sessionsDir ?? resolveSessionTranscriptsDirForAgent(agentId);
	const result = configured ? pruneAgentConfig(cfg, agentId) : {
		config: cfg,
		removedBindings: 0,
		removedAllow: 0,
		clearedOwnerRefs: []
	};
	const gatewayAttempt = await maybeDeleteAgentThroughGateway({
		agentId,
		deleteFiles: true
	});
	if (gatewayAttempt.kind === "deleted") {
		const gatewayResult = gatewayAttempt.result;
		if (opts.json) {
			const workspaceSharedWith = findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir);
			const workspaceRetained = workspaceSharedWith.length > 0;
			writeRuntimeJson(runtime, {
				agentId,
				workspace: workspaceDir,
				workspaceRetained: workspaceRetained || void 0,
				workspaceRetainedReason: workspaceRetained ? "shared" : void 0,
				workspaceSharedWith: workspaceRetained ? workspaceSharedWith : void 0,
				agentDir,
				sessionsDir,
				removedBindings: gatewayResult.removedBindings,
				removedAllow: result.removedAllow,
				clearedOwnerRefs: result.clearedOwnerRefs.length > 0 ? result.clearedOwnerRefs : void 0,
				removed: gatewayResult.removed,
				failed: gatewayResult.failed,
				...gatewayResult.purgeFailed ? { purgeFailed: true } : {},
				transport: "gateway"
			});
		} else {
			runtime.log(`Deleted agent: ${agentId}`);
			logClearedOwnerRefs(runtime, result.clearedOwnerRefs);
			logSessionPurgeWarning(runtime, agentId, gatewayResult.purgeFailed === true);
			for (const failure of gatewayResult.failed ?? []) runtime.error(`Warning: path could not be moved to Trash: ${failure.reason}; remove it manually at ${failure.path}`);
		}
		return;
	}
	return await withAgentDeletion(agentId, async (begin) => {
		existingJournal = readAgentDeletionJournal(agentId);
		if (configured && existingJournal?.cleanupCompleted) {
			if (!claimCompletedAgentDeletion(agentId, existingJournal.operationId)) throw new Error(`Agent "${agentId}" deletion tombstone changed before fresh deletion.`);
			existingJournal = void 0;
		}
		if (!configured && (!existingJournal || existingJournal.cleanupCompleted)) throw new Error(`Agent "${agentId}" deletion already completed.`);
		assertAgentSessionStoreDeletionSafe(cfg, agentId);
		const workspaceSharedWith = findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir);
		const deleteFiles = existingJournal?.deleteFiles ?? true;
		const deletion = begin(existingJournal ?? {
			agentId,
			agentDir,
			workspaceDir,
			sessionsDir,
			deleteFiles
		});
		try {
			await prepareAgentDeleteDatabases(cfg, agentId, agentDir);
			deletion.assertCurrent();
			const commitRoster = async () => await withAgentExecApprovalsRemoved(agentId, async () => {
				deletion.assertCurrent();
				if (configured) {
					await replaceConfigFile({
						...writeSnapshot,
						sourceConfig: result.config,
						writeOptions: {
							...writeSnapshot.writeOptions,
							allowedAgentRosterRemovals: [agentId],
							assertConfigPathForWrite: () => {
								writeSnapshot.writeOptions.assertConfigPathForWrite?.();
								deletion.assertCurrent();
							},
							...opts.json ? { skipOutputLogs: true } : {}
						}
					});
					if (!opts.json) logConfigUpdated(runtime);
				}
			});
			if (gatewayAttempt.kind === "fallback-unreachable") await withLocalAgentCronJobsRemoved(agentId, () => cfg, commitRoster);
			else await commitRoster();
			deletion.assertCurrent();
		} catch (error) {
			if (!existingJournal) deletion.rollback();
			throw error;
		}
		const purgeFailed = await purgeAgentSessionStoreEntries(cfg, agentId, { runDatabaseCleanup: deletion.runDatabaseCleanup });
		deletion.assertCurrent();
		for (const survivingAgentId of listAgentIds(result.config)) resolveAgentDir(result.config, survivingAgentId);
		const survivingDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(readAgentDeleteDatabaseRegistry(), agentId);
		const sharedWithSurvivor = (pathname) => isPathOwnedBySurvivingAgent(result.config, agentId, pathname, survivingDatabaseFilePaths);
		const workspaceRetained = sharedWithSurvivor(workspaceDir);
		const quietRuntime = opts.json ? createQuietRuntime(runtime) : runtime;
		let workspaceCleanupError;
		const removed = [];
		const failed = [];
		const removePath = async (pathname) => {
			const outcome = await moveToTrashResult(pathname, quietRuntime, deletion.assertCurrent);
			deletion.assertCurrent();
			if ("removed" in outcome) removed.push(outcome.removed);
			else failed.push(outcome.failed);
			return outcome;
		};
		if (deleteFiles && !purgeFailed && workspaceRetained) quietRuntime.log(`Skipped workspace removal (shared with other agents${workspaceSharedWith.length ? `: ${workspaceSharedWith.join(", ")}` : ""}): ${workspaceDir}`);
		else if (deleteFiles && !purgeFailed) {
			const legacyPlan = prepareLegacyWorkspaceStateReset(workspaceDir);
			const statePlan = prepareWorkspaceStateDeletion(workspaceDir);
			if ("removed" in await removePath(workspaceDir)) try {
				const legacyCleanup = await removeLegacyWorkspaceStateForReset(legacyPlan, { assertCurrent: deletion.assertCurrent });
				for (const warning of legacyCleanup.warnings) quietRuntime.log(warning);
				deletion.assertCurrent();
				await deleteWorkspaceState(statePlan, { assertCurrent: deletion.assertCurrent });
			} catch (error) {
				workspaceCleanupError = error instanceof Error ? error : new Error(String(error));
			}
		}
		if (deleteFiles && !purgeFailed) {
			const canonicalAgentDir = normalizeAgentDirRegistryPath(agentDir);
			const databasePaths = deletion.entry.databasePaths.filter((pathname) => {
				const canonicalPath = normalizeAgentDirRegistryPath(pathname);
				return !isPathInside(canonicalAgentDir, canonicalPath) && !sharedWithSurvivor(pathname);
			});
			for (const directory of [agentDir, sessionsDir]) if (!sharedWithSurvivor(directory)) await removePath(directory);
			for (const databasePath of databasePaths) await removePath(databasePath);
		}
		if (workspaceCleanupError) throw workspaceCleanupError;
		deletion.assertCurrent();
		if (failed.length === 0 && !purgeFailed) {
			if (deleteFiles) unregisterOpenClawAgentDatabases({ agentId });
			deletion.finish();
		}
		if (opts.json) writeRuntimeJson(runtime, {
			agentId,
			workspace: workspaceDir,
			workspaceRetained: workspaceRetained || void 0,
			workspaceRetainedReason: workspaceRetained ? "shared" : void 0,
			workspaceSharedWith: workspaceRetained ? workspaceSharedWith : void 0,
			agentDir,
			sessionsDir,
			removedBindings: result.removedBindings,
			removedAllow: result.removedAllow,
			clearedOwnerRefs: result.clearedOwnerRefs.length > 0 ? result.clearedOwnerRefs : void 0,
			removed,
			failed,
			...purgeFailed ? { purgeFailed: true } : {},
			...gatewayAttempt.kind === "fallback-credentials-required" ? { cronCleanupSkipped: true } : {}
		});
		else {
			runtime.log(`Deleted agent: ${agentId}`);
			logClearedOwnerRefs(runtime, result.clearedOwnerRefs);
			logSessionPurgeWarning(runtime, agentId, purgeFailed);
		}
		if (gatewayAttempt.kind === "fallback-credentials-required") runtime.error(`Warning: cron cleanup was skipped for deleted agent "${agentId}" because the Gateway could not be authenticated; scheduled jobs may remain.`);
	});
}
//#endregion
export { agentsDeleteCommand };
