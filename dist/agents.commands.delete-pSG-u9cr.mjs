import { o as writeRuntimeJson, r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { A as normalizeAgentDirRegistryPath, a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, l as tryResolveSoleAgentId, n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import { m as readAgentDeletionJournalAsync } from "./agent-deletion-journal-DpYVtbBb.mjs";
import { d as resolveSessionTranscriptsDirForAgent } from "./paths-YgcBNLgG.mjs";
import { B as resolveNativeSharedAuthStorePath, v as resolveAuthProfileDatabasePath, z as prepareSharedAuthStoreOwnershipForNative } from "./sqlite-BlFpr2YD.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { c as AgentDeletionAuthorityRollbackError, l as AgentDeletionCommitUncertainError, r as withAgentDeletion, s as claimCompletedAgentDeletion } from "./agent-lifecycle-registry-DCaIqk-e.mjs";
import { r as replaceConfigFile } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import "./sessions-CnzPI1yx.mjs";
import { t as purgeAgentSessionStoreEntries } from "./cleanup-service-BHj-66gM.mjs";
import { i as pruneAgentConfig, r as findAgentEntryIndex } from "./agents.config-B7znCYIL.mjs";
import { p as withAgentExecApprovalsRemoved } from "./exec-approvals-store-BhzM_h1C.mjs";
import "./exec-approvals-ByI8H66l.mjs";
import { l as prepareLegacyWorkspaceStateReset, u as removeLegacyWorkspaceStateForReset } from "./workspace-legacy-state-CUN3bghH.mjs";
import { i as prepareWorkspaceStateDeletion, n as deleteWorkspaceState } from "./workspace-state-store-CAqLogDE.mjs";
import { r as formatCliJsonFailure } from "./failure-output-CpIKhMiV.mjs";
import { f as isImplicitLocalGatewayTarget, r as callGateway, t as buildGatewayConnectionDetails } from "./call-b1jzw5fz.mjs";
import { r as moveToTrashResult } from "./cleanup-utils-BtHoq0Ha.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-D92bdO16.mjs";
import { t as createClackPrompter } from "./clack-prompter-CALyuZTx.mjs";
import { r as logConfigUpdated } from "./logging-CTh_T0q8.mjs";
import { t as withLocalAgentCronJobsRemoved } from "./local-service-3sn0Id6Z.mjs";
import { i as isSharedAuthStoreOwner, n as formatSharedAuthStoreOwnerDeleteError, r as isInheritedAuthStoreOwner, t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-C-K2bAs7.mjs";
import { t as AgentSharedStoreOwnerError } from "./agent-delete-session-store-safety-ChjTvLx2.mjs";
import { a as prepareAgentDeleteDatabases, c as resolveSurvivingDatabaseFilePaths, i as isPathOwnedBySurvivingAgent, s as readAgentDeleteDatabaseRegistry, t as assertAgentSessionStoreDeletionSafe } from "./agent-delete-databases-CDNa7990.mjs";
import { r as requireValidConfigForWrite } from "./config-validation-CHn1iJgM.mjs";
import { t as resolveGatewayMutationFallback } from "./call-mutation-fallback--aeawj9Y.mjs";
//#region src/commands/agents.commands.delete.ts
async function maybeDeleteAgentThroughGateway(params) {
	const { url } = buildGatewayConnectionDetails({ config: params.config });
	const localTarget = await isImplicitLocalGatewayTarget({ config: params.config });
	try {
		return {
			kind: "deleted",
			result: await callGateway({
				config: params.config,
				expectUrl: url,
				method: "agents.delete",
				params: {
					agentId: params.agentId,
					deleteFiles: true
				},
				mode: GATEWAY_CLIENT_MODES.CLI,
				clientName: GATEWAY_CLIENT_NAMES.CLI,
				requiredMethods: ["agents.delete"]
			})
		};
	} catch (error) {
		const fallback = resolveGatewayMutationFallback({
			error,
			localTarget
		});
		if (fallback === "unreachable") return { kind: "fallback-unreachable" };
		if (fallback === "credentials-required") return { kind: "fallback-credentials-required" };
		if (fallback === "non-local") throw new Error(`${formatErrorMessage(error)}\nLocal agent state was left unchanged. Restore the Gateway connection and credentials, or run this command on the Gateway host (the far end of any SSH tunnel).`, { cause: error });
		throw error;
	}
}
async function agentsDeleteCommand(opts, runtime = defaultRuntime) {
	const failAgentsDelete = (message) => {
		if (opts.json) {
			writeRuntimeJson(runtime, formatCliJsonFailure(message));
			runtime.exit(1, { resetStream: process.stderr });
		} else {
			runtime.error(message);
			runtime.exit(1);
		}
	};
	const writeSnapshot = await requireValidConfigForWrite(runtime);
	if (!writeSnapshot) return;
	const cfg = writeSnapshot.snapshot.sourceConfig;
	const input = opts.id?.trim();
	if (!input) {
		failAgentsDelete(`Agent id is required. Run ${formatCliCommand("openclaw agents list")} to choose one.`);
		return;
	}
	const normalized = normalizeAgentIdStrict(input);
	if (!normalized.ok) {
		failAgentsDelete(`Agent "${input}" not found. Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
		return;
	}
	const agentId = normalized.value;
	if (!opts.json && agentId !== input) runtime.log(`Normalized agent id to "${agentId}".`);
	const configured = findAgentEntryIndex(listAgentEntries(cfg), agentId) >= 0;
	let existingJournal = configured ? void 0 : await readAgentDeletionJournalAsync(agentId);
	if (!configured && (!existingJournal || existingJournal.cleanupCompleted)) {
		failAgentsDelete(`Agent "${agentId}" not found. Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
		return;
	}
	const configuredAgentDir = configured ? resolveAgentDir(cfg, agentId) : void 0;
	const safetyAgentDir = existingJournal?.agentDir ?? configuredAgentDir;
	if (!safetyAgentDir) throw new Error(`Agent "${agentId}" deletion has no state directory.`);
	try {
		await assertAgentSessionStoreDeletionSafe(cfg, agentId);
	} catch (error) {
		if (!(error instanceof AgentSharedStoreOwnerError)) throw error;
		failAgentsDelete(error.message);
		return;
	}
	const sharedAuthOwnership = prepareSharedAuthStoreOwnershipForNative();
	if (isSharedAuthStoreOwner({
		ownership: sharedAuthOwnership,
		agentAuthDbPath: resolveAuthProfileDatabasePath(safetyAgentDir),
		sharedAuthDbPath: resolveNativeSharedAuthStorePath()
	})) {
		failAgentsDelete(formatSharedAuthStoreOwnerDeleteError(agentId));
		return;
	}
	if (configured && agentId === tryResolveSoleAgentId(cfg)) {
		failAgentsDelete(`Agent "${agentId}" is the only configured agent and cannot be deleted.`);
		return;
	}
	if (isInheritedAuthStoreOwner(cfg, agentId)) {
		failAgentsDelete(`Agent "${agentId}" owns inherited credentials through agents.defaults.authInheritance.agentId and cannot be deleted. Relocate those credentials, then re-point or remove that binding before retrying.`);
		return;
	}
	if (configured) {
		existingJournal = await readAgentDeletionJournalAsync(agentId);
		if (existingJournal?.cleanupCompleted) existingJournal = void 0;
	}
	const agentDir = existingJournal?.agentDir ?? configuredAgentDir;
	if (!agentDir) throw new Error(`Agent "${agentId}" deletion has no state directory.`);
	if (!opts.force) {
		if (!isTerminalInteractive()) {
			failAgentsDelete("Non-interactive session. Re-run with --force.");
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
	const reportDeletion = (cleanup, workspaceRetained, workspaceSharedWith, extra) => {
		if (opts.json) writeRuntimeJson(runtime, {
			agentId,
			workspace: workspaceDir,
			workspaceRetained: workspaceRetained || void 0,
			workspaceRetainedReason: workspaceRetained ? "shared" : void 0,
			workspaceSharedWith: workspaceRetained ? workspaceSharedWith : void 0,
			agentDir,
			sessionsDir,
			removedBindings: cleanup.removedBindings,
			removedAllow: result.removedAllow,
			clearedOwnerRefs: result.clearedOwnerRefs.length > 0 ? result.clearedOwnerRefs : void 0,
			removed: cleanup.removed,
			failed: cleanup.failed,
			...cleanup.purgeFailed ? { purgeFailed: true } : {},
			...extra
		});
		else {
			runtime.log(`Deleted agent: ${agentId}`);
			if (result.clearedOwnerRefs.length > 0) runtime.log(`Cleared owner references: ${result.clearedOwnerRefs.join(", ")}`);
			if (cleanup.purgeFailed === true) runtime.error(`Warning: session-store purge failed for deleted agent "${agentId}"; source data was retained. Retry deletion after resolving the storage error.`);
			for (const failure of cleanup.failed ?? []) runtime.error(`Warning: path could not be moved to Trash: ${failure.reason}; remove it manually at ${failure.path}`);
		}
	};
	const gatewayAttempt = await maybeDeleteAgentThroughGateway({
		config: cfg,
		agentId
	});
	if (gatewayAttempt.kind === "deleted") {
		const workspaceSharedWith = opts.json ? findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir) : [];
		reportDeletion(gatewayAttempt.result, workspaceSharedWith.length > 0, workspaceSharedWith, { transport: "gateway" });
		return;
	}
	return await withAgentDeletion(agentId, async (begin) => {
		existingJournal = await readAgentDeletionJournalAsync(agentId);
		if (configured && existingJournal?.cleanupCompleted) {
			if (!await claimCompletedAgentDeletion(agentId, existingJournal.operationId)) throw new Error(`Agent "${agentId}" deletion tombstone changed before fresh deletion.`);
			existingJournal = void 0;
		}
		if (!configured && (!existingJournal || existingJournal.cleanupCompleted)) throw new Error(`Agent "${agentId}" deletion already completed.`);
		await assertAgentSessionStoreDeletionSafe(cfg, agentId);
		const workspaceSharedWith = findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir);
		const deleteFiles = existingJournal?.deleteFiles ?? true;
		const deletion = await begin(existingJournal ?? {
			agentId,
			agentDir,
			workspaceDir,
			sessionsDir,
			deleteFiles
		});
		let rosterCommitted = !configured;
		try {
			if (deletion.entry.phase === "draining") {
				await deletion.runWithWorker((scope, guard) => scope.execute({
					type: "agentDeletion.assertNoDatabaseLeases",
					input: { guard }
				}));
				await deletion.retire();
			}
			await prepareAgentDeleteDatabases(cfg, agentId, agentDir, {}, deletion);
			await deletion.assertCurrentAsync();
			const commitRoster = async () => await withAgentExecApprovalsRemoved(agentId, async () => {
				await deletion.assertCurrentAsync();
				if (configured) {
					await replaceConfigFile({
						...writeSnapshot,
						sourceConfig: result.config,
						writeOptions: {
							...writeSnapshot.writeOptions,
							allowedAgentRosterRemovals: [agentId],
							beforeCommit: async () => {
								await writeSnapshot.writeOptions.beforeCommit?.();
								await deletion.assertCurrentAsync();
							},
							assertConfigPathForWrite: () => {
								writeSnapshot.writeOptions.assertConfigPathForWrite?.();
								deletion.assertCurrentFinal();
							},
							...opts.json ? { skipOutputLogs: true } : {}
						}
					});
					rosterCommitted = true;
					if (!opts.json) logConfigUpdated(runtime);
				}
			}, deletion);
			if (gatewayAttempt.kind === "fallback-unreachable") await withLocalAgentCronJobsRemoved(agentId, () => cfg, commitRoster);
			else await commitRoster();
			await deletion.assertCurrentAsync();
		} catch (error) {
			if (!existingJournal && !rosterCommitted && !(error instanceof AgentDeletionAuthorityRollbackError) && !(error instanceof AgentDeletionCommitUncertainError)) await deletion.rollback();
			throw error;
		}
		const purgeFailed = await purgeAgentSessionStoreEntries(cfg, agentId, { runDatabaseCleanup: deletion.runDatabaseCleanup });
		await deletion.assertCurrentAsync();
		for (const survivingAgentId of listAgentIds(result.config)) resolveAgentDir(result.config, survivingAgentId);
		const survivingDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(await readAgentDeleteDatabaseRegistry(), agentId);
		const sharedWithSurvivor = (pathname) => isPathOwnedBySurvivingAgent(result.config, agentId, pathname, survivingDatabaseFilePaths);
		const workspaceRetained = sharedWithSurvivor(workspaceDir);
		const quietRuntime = opts.json ? {
			...runtime,
			log: () => {}
		} : runtime;
		let workspaceCleanupError;
		const removed = [];
		const failed = [];
		const removePath = async (pathname) => {
			const outcome = await moveToTrashResult(pathname, quietRuntime, deletion.assertCurrentFinal);
			await deletion.assertCurrentAsync();
			if ("removed" in outcome) removed.push(outcome.removed);
			else failed.push(outcome.failed);
			return outcome;
		};
		if (deleteFiles && !purgeFailed && workspaceRetained) quietRuntime.log(`Skipped workspace removal (shared with other agents${workspaceSharedWith.length ? `: ${workspaceSharedWith.join(", ")}` : ""}): ${workspaceDir}`);
		else if (deleteFiles && !purgeFailed) {
			const legacyPlan = prepareLegacyWorkspaceStateReset(workspaceDir);
			const statePlan = prepareWorkspaceStateDeletion(workspaceDir);
			if ("removed" in await removePath(workspaceDir)) try {
				const legacyCleanup = await removeLegacyWorkspaceStateForReset(legacyPlan, { assertCurrent: deletion.assertCurrentFinal });
				for (const warning of legacyCleanup.warnings) quietRuntime.log(warning);
				await deletion.assertCurrentAsync();
				await deleteWorkspaceState(statePlan, { deletion });
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
		await deletion.assertCurrentAsync();
		if (failed.length === 0 && !purgeFailed) await deletion.finish({ unregisterDatabases: deleteFiles });
		reportDeletion({
			removedBindings: result.removedBindings,
			removed,
			failed,
			...purgeFailed ? { purgeFailed: true } : {}
		}, workspaceRetained, workspaceSharedWith, gatewayAttempt.kind === "fallback-credentials-required" ? { cronCleanupSkipped: true } : void 0);
		if (gatewayAttempt.kind === "fallback-credentials-required") runtime.error(`Warning: cron cleanup was skipped for deleted agent "${agentId}" because the Gateway could not be authenticated; scheduled jobs may remain.`);
	});
}
//#endregion
export { agentsDeleteCommand };
