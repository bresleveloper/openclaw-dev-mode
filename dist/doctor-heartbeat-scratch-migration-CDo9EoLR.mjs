import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { r as readRegularFile } from "./regular-file-D4i0kJHS.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { n as resolveCronJobsStorePathFromConfig } from "./paths-Bz2goYfd.mjs";
import "./store-CV1wrdMb.mjs";
import { t as CRON_JOB_SCRATCH_MAX_BYTES } from "./scratch-contract-B-Laspel.mjs";
import { o as resolveHeartbeatIntervalMs, r as resolveHeartbeatAgents } from "./heartbeat-config-BvP-hlUW.mjs";
import { n as hashCronScratchSource, o as writeCronJobScratch, r as readCronJobScratchState, t as deleteCronJobScratch } from "./scratch-store-CQTgBoaX.mjs";
import { n as ensureHeartbeatMonitorJobs } from "./doctor-heartbeat-cadence-migration-OyRJW-Tt.mjs";
import { TextDecoder } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor-heartbeat-scratch-migration.ts
/** Doctor-owned migration from workspace HEARTBEAT.md files into cron job scratch. */
const HEARTBEAT_SCRATCH_MIGRATION_CHECK_ID = "core/doctor/heartbeat-scratch-migration";
const LEGACY_HEARTBEAT_FILENAME = "HEARTBEAT.md";
const utf8Decoder = new TextDecoder("utf-8", { fatal: true });
async function resolveHeartbeatScratchMigrationOwners(cfg) {
	const migrationAgents = [];
	const disabledEntryKeys = /* @__PURE__ */ new Set();
	for (const agent of resolveHeartbeatAgents(cfg)) {
		if (resolveHeartbeatIntervalMs(cfg, void 0, agent.heartbeat) !== null) {
			migrationAgents.push(agent);
			continue;
		}
		const workspaceDir = resolveAgentWorkspaceDir(cfg, agent.agentId);
		const workspaceRealPath = await fs.realpath(workspaceDir).catch(() => path.resolve(workspaceDir));
		disabledEntryKeys.add(path.join(workspaceRealPath, LEGACY_HEARTBEAT_FILENAME));
	}
	return {
		migrationAgents,
		disabledEntryKeys
	};
}
async function readHeartbeatSource(cfg, agentId, options) {
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	const heartbeatPath = path.join(workspaceDir, LEGACY_HEARTBEAT_FILENAME);
	let sourceStat;
	try {
		sourceStat = await fs.lstat(heartbeatPath);
		const orphanClaim = await findStaleHeartbeatClaim(heartbeatPath);
		if (orphanClaim) throw new Error(`both ${heartbeatPath} and an interrupted migration claim at ${orphanClaim} exist; reconcile them manually before rerunning doctor`);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		const staleClaim = await findStaleHeartbeatClaim(heartbeatPath);
		if (!staleClaim) return;
		if (!options?.recoverClaims) throw new Error(`an interrupted migration claim exists at ${staleClaim}; run openclaw doctor --fix to restore it`, { cause: error });
		await restoreClaimNoClobber(staleClaim, heartbeatPath);
		sourceStat = await fs.lstat(heartbeatPath);
	}
	if (!sourceStat.isFile() && !sourceStat.isSymbolicLink()) throw new Error("HEARTBEAT.md must be a regular file or contained symlink");
	if (sourceStat.isFile() && sourceStat.nlink > 1) throw new Error("HEARTBEAT.md has multiple hard links; refusing automatic removal");
	const workspaceRealPath = await fs.realpath(workspaceDir);
	const sourceRealPath = await fs.realpath(heartbeatPath);
	if (sourceRealPath !== workspaceRealPath && !isPathInside(workspaceRealPath, sourceRealPath)) throw new Error("HEARTBEAT.md symlink target escapes the agent workspace");
	const file = await readRegularFile({
		filePath: sourceRealPath,
		maxBytes: CRON_JOB_SCRATCH_MAX_BYTES
	});
	let content;
	try {
		content = utf8Decoder.decode(file.buffer);
	} catch {
		throw new Error("HEARTBEAT.md is not valid UTF-8");
	}
	return {
		path: heartbeatPath,
		entryKey: path.join(workspaceRealPath, LEGACY_HEARTBEAT_FILENAME),
		content,
		sha256: hashCronScratchSource(content)
	};
}
function archivePathForSource(agentId, sha256, env) {
	const safeAgentId = agentId.replace(/[^A-Za-z0-9._-]+/g, "-");
	return path.join(resolveStateDir(env), "backups", "heartbeat-migration", `${safeAgentId}-${sha256}.md`);
}
const HEARTBEAT_CLAIM_INFIX = ".doctor-importing-";
const HEARTBEAT_CLAIM_CHANGED_ERROR = "HeartbeatClaimChangedError";
/** Interrupted-claim sibling for a missing canonical heartbeat path. */
async function findStaleHeartbeatClaim(heartbeatPath) {
	const dir = path.dirname(heartbeatPath);
	const claimPattern = new RegExp(`^${escapeRegExp(path.basename(heartbeatPath))}${escapeRegExp(HEARTBEAT_CLAIM_INFIX)}\\d+-[0-9a-f]{12}$`);
	let entries;
	try {
		entries = await fs.readdir(dir);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
	const claims = entries.filter((entry) => claimPattern.test(entry));
	if (claims.length > 1) throw new Error(`multiple interrupted migration claims exist for ${heartbeatPath}; remove or restore the stale .doctor-importing-* files manually`);
	const claim = claims[0];
	if (!claim) return;
	const ownerPid = Number(claim.slice(claim.lastIndexOf(HEARTBEAT_CLAIM_INFIX) + 18).split("-")[0]);
	if (Number.isSafeInteger(ownerPid) && ownerPid !== process.pid && isProcessAlive(ownerPid)) throw new Error(`a migration claim for ${heartbeatPath} is held by running process ${ownerPid}; wait for that doctor run to finish`);
	return path.join(dir, claim);
}
function isProcessAlive(pid) {
	try {
		process.kill(pid, 0);
		return true;
	} catch (error) {
		return error.code === "EPERM";
	}
}
/**
* Restore a claim without clobbering: `link` fails with EEXIST when another
* process recreated the destination while we held the claim, so both files
* survive (the recreation in place, the claimed original at a conflict path).
*/
async function restoreClaimNoClobber(claimPath, destinationPath) {
	try {
		await fs.link(claimPath, destinationPath);
		await fs.unlink(claimPath);
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
		const conflictPath = `${claimPath}.conflict-${Date.now()}`;
		await fs.rename(claimPath, conflictPath);
		throw new Error(`HEARTBEAT.md was recreated during migration; the claimed original is preserved at ${conflictPath}`, { cause: error });
	}
}
/**
* Move the source aside and prove the claimed bytes still match what was read.
* Claim before copying so a concurrent edit cannot leave stale scratch
* committed while the replacement source is restored.
*/
async function claimHeartbeatSource(source) {
	const workspaceRealPath = path.dirname(source.entryKey);
	const assertWorkspaceUnchanged = async () => {
		if (await fs.realpath(path.dirname(source.path)) !== workspaceRealPath) throw new Error("HEARTBEAT.md workspace changed after the source was read");
	};
	await assertWorkspaceUnchanged();
	const claimPath = `${source.entryKey}${HEARTBEAT_CLAIM_INFIX}${process.pid}-${source.sha256.slice(0, 12)}`;
	await fs.rename(source.entryKey, claimPath);
	const restore = async (cause) => {
		await restoreClaimNoClobber(claimPath, source.entryKey).catch((restoreError) => {
			throw restoreError instanceof Error && restoreError.message.includes("preserved at") ? restoreError : new Error(`HEARTBEAT.md migration claim could not be restored from ${claimPath}`, { cause: cause ?? restoreError });
		});
	};
	try {
		await assertWorkspaceUnchanged();
		const claimRealPath = await fs.realpath(claimPath);
		if (claimRealPath !== workspaceRealPath && !isPathInside(workspaceRealPath, claimRealPath)) throw new Error("claimed HEARTBEAT.md target escapes the agent workspace");
		const claimed = await readRegularFile({
			filePath: claimRealPath,
			maxBytes: CRON_JOB_SCRATCH_MAX_BYTES
		});
		const claimedContent = utf8Decoder.decode(claimed.buffer);
		if (hashCronScratchSource(claimedContent) !== source.sha256) throw new Error("HEARTBEAT.md changed before the migration claim was acquired");
	} catch (error) {
		await restore(error);
		throw error;
	}
	const changedError = (message, cause) => {
		const error = new Error(message, cause !== void 0 ? { cause } : void 0);
		error.name = HEARTBEAT_CLAIM_CHANGED_ERROR;
		return error;
	};
	const failChanged = async (message, cause) => {
		const error = changedError(message, cause);
		await restore(error).catch(() => void 0);
		throw error;
	};
	const readFinalContent = async (filePath) => {
		await assertWorkspaceUnchanged();
		const fileRealPath = await fs.realpath(filePath);
		if (fileRealPath !== workspaceRealPath && !isPathInside(workspaceRealPath, fileRealPath)) throw new Error("HEARTBEAT.md target escapes the agent workspace");
		const finalBytes = await readRegularFile({
			filePath: fileRealPath,
			maxBytes: CRON_JOB_SCRATCH_MAX_BYTES
		});
		return utf8Decoder.decode(finalBytes.buffer);
	};
	const verifyUnchanged = async () => {
		const finalContent = await readFinalContent(claimPath).catch((error) => failChanged("claimed HEARTBEAT.md could not be re-verified before finalization", error));
		if (hashCronScratchSource(finalContent) !== source.sha256) await failChanged("HEARTBEAT.md changed while the migration claim was held");
		let recreated;
		try {
			await fs.lstat(source.entryKey);
			recreated = true;
		} catch (error) {
			if (error.code !== "ENOENT") await failChanged("could not verify the original HEARTBEAT.md path", error);
			recreated = false;
		}
		if (recreated) await failChanged("HEARTBEAT.md was recreated while the migration claim was held");
	};
	const verifyRestoredUnchanged = async () => {
		let finalContent;
		try {
			finalContent = await readFinalContent(source.entryKey);
		} catch (error) {
			throw changedError("restored HEARTBEAT.md could not be re-verified", error);
		}
		if (hashCronScratchSource(finalContent) !== source.sha256) throw changedError("HEARTBEAT.md changed after the migration claim was restored");
	};
	return {
		claimPath,
		restore,
		retain: async () => {
			await restore(void 0);
			await verifyRestoredUnchanged();
		},
		release: async ({ archivePath }) => {
			await verifyUnchanged();
			if ((await fs.lstat(claimPath)).isSymbolicLink()) {
				await fs.unlink(claimPath);
				return;
			}
			for (const archiveBase of [archivePath, `${source.entryKey}.doctor-archived`]) {
				const archiveDir = await fs.mkdtemp(`${archiveBase}.`);
				try {
					await fs.rename(claimPath, path.join(archiveDir, LEGACY_HEARTBEAT_FILENAME));
					return;
				} catch (error) {
					await fs.rmdir(archiveDir).catch(() => void 0);
					if (!hasErrnoCode(error, "EXDEV") || archiveBase !== archivePath) throw error;
				}
			}
		}
	};
}
async function archiveSource(params) {
	const archivePath = archivePathForSource(params.agentId, params.source.sha256, params.env);
	await fs.mkdir(path.dirname(archivePath), {
		recursive: true,
		mode: 448
	});
	try {
		await fs.writeFile(archivePath, params.source.content, {
			flag: "wx",
			mode: 384
		});
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
		const existing = await fs.readFile(archivePath, "utf8");
		if (hashCronScratchSource(existing) !== params.source.sha256) throw new Error(`heartbeat migration archive collision at ${archivePath}`, { cause: error });
	}
}
function migrationFinding(params) {
	return {
		checkId: HEARTBEAT_SCRATCH_MIGRATION_CHECK_ID,
		severity: params.severity ?? "warning",
		message: params.message,
		path: params.path,
		target: params.agentId,
		requirement: params.requirement,
		fixHint: `Run ${formatCliCommand("openclaw doctor --fix")} to migrate HEARTBEAT.md into cron scratch.`
	};
}
/** Reports remaining workspace heartbeat files without changing them. */
async function collectHeartbeatScratchMigrationFindings(cfg) {
	const findings = [];
	const { migrationAgents, disabledEntryKeys } = await resolveHeartbeatScratchMigrationOwners(cfg);
	for (const agent of migrationAgents) {
		const heartbeatPath = path.join(resolveAgentWorkspaceDir(cfg, agent.agentId), LEGACY_HEARTBEAT_FILENAME);
		try {
			const source = await readHeartbeatSource(cfg, agent.agentId);
			if (!source) continue;
			if (disabledEntryKeys.has(source.entryKey)) continue;
			findings.push(migrationFinding({
				agentId: agent.agentId,
				path: heartbeatPath,
				requirement: "legacy-heartbeat-file",
				message: `Agent "${agent.agentId}" still stores heartbeat instructions in HEARTBEAT.md.`
			}));
		} catch (error) {
			findings.push(migrationFinding({
				agentId: agent.agentId,
				path: heartbeatPath,
				requirement: "heartbeat-file-migration-blocked",
				severity: "error",
				message: `Agent "${agent.agentId}" HEARTBEAT.md cannot be migrated: ${formatErrorMessage(error)}`
			}));
		}
	}
	return findings;
}
/** Migrates each enrolled agent's heartbeat file into its stable monitor job. */
async function maybeMigrateHeartbeatFilesToScratch(params) {
	const env = params.env ?? process.env;
	const storePath = resolveCronJobsStorePathFromConfig(params.cfg, env);
	const changes = [];
	const warnings = [];
	const { migrationAgents, disabledEntryKeys } = await resolveHeartbeatScratchMigrationOwners(params.cfg);
	if (!params.shouldRepair) {
		for (const agent of migrationAgents) try {
			const source = await readHeartbeatSource(params.cfg, agent.agentId);
			if (source) {
				const retained = disabledEntryKeys.has(source.entryKey) ? " The shared legacy file will be retained because a heartbeat owner is disabled." : "";
				note(`${shortenHomePath(source.path)} will migrate into scratch for Heartbeat (${agent.agentId}).${retained}`, "Heartbeat migration preview");
			}
		} catch (error) {
			warnings.push(`Agent "${agent.agentId}" HEARTBEAT.md cannot be migrated: ${formatErrorMessage(error)}`);
		}
		if (warnings.length > 0) note(warnings.join("\n"), "Doctor warnings");
		return {
			changes,
			warnings
		};
	}
	let monitors;
	try {
		monitors = await ensureHeartbeatMonitorJobs(params.cfg, storePath, env);
	} catch (error) {
		return {
			changes,
			warnings: [`Could not prepare heartbeat monitor jobs: ${formatErrorMessage(error)}`]
		};
	}
	const groups = /* @__PURE__ */ new Map();
	const migrationAgentIds = new Set(migrationAgents.map((agent) => agent.agentId));
	for (const [agentId, monitor] of monitors) {
		if (!migrationAgentIds.has(agentId)) continue;
		let source;
		try {
			source = await readHeartbeatSource(params.cfg, agentId, { recoverClaims: true });
		} catch (error) {
			warnings.push(`Agent "${agentId}" HEARTBEAT.md was not migrated: ${formatErrorMessage(error)}`);
			continue;
		}
		if (!source) continue;
		const group = groups.get(source.entryKey) ?? {
			source,
			agents: [],
			retainSource: disabledEntryKeys.has(source.entryKey)
		};
		group.agents.push([agentId, monitor]);
		groups.set(source.entryKey, group);
	}
	for (const { source, agents, retainSource } of groups.values()) {
		let keepSource = retainSource;
		const importAgents = [];
		let scratchWriteNeeded = false;
		const plannedRevisionByJobId = /* @__PURE__ */ new Map();
		for (const [agentId, monitor] of agents) {
			const state = readCronJobScratchState(storePath, monitor.id, { env });
			const current = state.scratch;
			plannedRevisionByJobId.set(monitor.id, state.currentRevision);
			if (state.currentRevision > 0 && !current) {
				warnings.push(`Agent "${agentId}" scratch was explicitly unset; it was left unchanged.`);
				keepSource = true;
			} else if (current && current.content !== source.content && current.sourceSha256 !== source.sha256) {
				warnings.push(`Agent "${agentId}" already has different cron scratch; it was left unchanged.`);
				keepSource = true;
			} else {
				importAgents.push([agentId, monitor]);
				if (current?.sourceSha256 !== source.sha256) scratchWriteNeeded = true;
			}
		}
		if (importAgents.length === 0 || keepSource && !scratchWriteNeeded) continue;
		if (!keepSource) try {
			await archiveSource({
				agentId: importAgents[0][0],
				source,
				env
			});
		} catch (error) {
			warnings.push(`${shortenHomePath(source.path)} was not migrated: ${formatErrorMessage(error)}. Rerun doctor to retry safely.`);
			continue;
		}
		let claim;
		try {
			claim = await claimHeartbeatSource(source);
		} catch (error) {
			warnings.push(`${shortenHomePath(source.path)} was not migrated: ${formatErrorMessage(error)}. Rerun doctor to retry safely.`);
			continue;
		}
		let importedAll = true;
		const groupChanges = [];
		const committedThisRun = [];
		for (const [agentId, monitor] of importAgents) try {
			const state = readCronJobScratchState(storePath, monitor.id, { env });
			const shouldWriteScratch = state.scratch?.sourceSha256 !== source.sha256;
			if (shouldWriteScratch) {
				const write = writeCronJobScratch({
					storePath,
					jobId: monitor.id,
					content: source.content,
					expectedRevision: plannedRevisionByJobId.get(monitor.id) ?? state.currentRevision,
					sourceSha256: source.sha256,
					options: { env }
				});
				if (!write.ok) throw new Error("scratch changed during migration");
				committedThisRun.push({
					agentId,
					monitor,
					previous: state.scratch,
					newRevision: write.currentRevision
				});
			}
			const verified = readCronJobScratchState(storePath, monitor.id, { env }).scratch;
			if (!verified || verified.sourceSha256 !== source.sha256) throw new Error("scratch verification failed after write");
			if (!keepSource || shouldWriteScratch) groupChanges.push(keepSource ? `Copied ${shortenHomePath(source.path)} into cron scratch for ${monitor.displayName ?? monitor.name}; retained the shared legacy file because ${retainSource ? "a heartbeat owner is disabled" : "another heartbeat owner's scratch was left unchanged"}.` : `Migrated ${shortenHomePath(source.path)} into cron scratch for ${monitor.displayName ?? monitor.name}.`);
		} catch (error) {
			warnings.push(`Agent "${agentId}" scratch was not finalized: ${formatErrorMessage(error)}. Rerun doctor to retry safely.`);
			importedAll = false;
		}
		const rollbackCommitted = () => {
			for (const commit of committedThisRun.toReversed()) {
				if (!commit.previous) {
					if (!deleteCronJobScratch(storePath, commit.monitor.id, { env }, { expectedRevision: commit.newRevision })) warnings.push(`Agent "${commit.agentId}" scratch changed before the migration rollback; leaving current scratch in place.`);
					continue;
				}
				if (!writeCronJobScratch({
					storePath,
					jobId: commit.monitor.id,
					content: commit.previous.content,
					expectedRevision: commit.newRevision,
					sourceSha256: commit.previous.sourceSha256,
					options: { env }
				}).ok) warnings.push(`Agent "${commit.agentId}" scratch changed before the migration rollback; leaving current scratch in place.`);
			}
		};
		if (!importedAll) {
			rollbackCommitted();
			try {
				await claim.restore(void 0);
			} catch (error) {
				warnings.push(formatErrorMessage(error));
			}
			continue;
		}
		if (keepSource) {
			try {
				await claim.retain();
				changes.push(...groupChanges);
			} catch (error) {
				rollbackCommitted();
				warnings.push(`${shortenHomePath(source.path)} was not migrated: ${formatErrorMessage(error)}. Rerun doctor to retry safely.`);
			}
			continue;
		}
		try {
			await claim.release({ archivePath: archivePathForSource(importAgents[0][0], source.sha256, env) });
			changes.push(...groupChanges);
		} catch (error) {
			if (error instanceof Error && error.name === HEARTBEAT_CLAIM_CHANGED_ERROR) {
				rollbackCommitted();
				warnings.push(`${shortenHomePath(source.path)} was not migrated: ${formatErrorMessage(error)}. Rerun doctor to retry safely.`);
				continue;
			}
			changes.push(...groupChanges);
			warnings.push(`${shortenHomePath(source.path)} was migrated but not removed: ${formatErrorMessage(error)}. Rerun doctor to retry safely.`);
		}
	}
	if (changes.length > 0) note(changes.join("\n"), "Doctor changes");
	if (warnings.length > 0) note(warnings.join("\n"), "Doctor warnings");
	return {
		changes,
		warnings
	};
}
//#endregion
export { collectHeartbeatScratchMigrationFindings, maybeMigrateHeartbeatFilesToScratch };
