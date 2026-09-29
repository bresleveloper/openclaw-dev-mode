import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as FsSafeError } from "./fs-safe-BAPek8At.mjs";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-BzetEUdq.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { c as readFileDescriptorBoundedSync } from "./boundary-file-read-D-Aa04On.mjs";
import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as hashFileDescriptorSync } from "./file-descriptor-C_0BsNDD.mjs";
import { i as resolveSqliteDatabaseFilePaths } from "./sqlite-files-eRv24eIu.mjs";
import { o as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import { a as isPrimarySessionTranscriptFileName, i as isMigrationArchiveArtifactName, m as resolveTrajectoryPointerPath, p as resolveTrajectoryPath } from "./artifacts-C9weQ_MG.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { l as syncDirectory, p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-BKe2aOQN.mjs";
import { O as migrateLegacySessionCreator } from "./openclaw-agent-db-schema-helpers-D9qnl2Yp.mjs";
import { c as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { i as resolveAllAgentSessionStoreCandidateTargetsSync } from "./targets-Dmb8-YXN.mjs";
import { r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-BKdpL7km.mjs";
import { C as readMigrationArtifactIdentity, S as moveMigrationArtifact, T as statMigrationPath, _ as uniqueRestoreMoves, c as hasSymbolicLinkInDirectoryPath, d as migrationMoveKey, f as readSessionSqliteMigrationManifest, g as sessionSqliteMigrationTargetKey, h as resolveSessionSqliteMigrationRunsDir, i as canonicalMigrationFilePath, l as isRegularFileWithoutFollowingSymlinks, n as assertSafeSessionSqliteMigrationDirectory, o as filterRestoreManifestTargets, r as assertSafeSessionSqliteMigrationMove, u as listSessionSqliteMigrationManifestPaths, w as sameMigrationArtifact, x as isPendingMigrationArtifactClaim, y as writeSessionSqliteMigrationManifest } from "./doctor-session-sqlite-migration-run-Dta_SQ4O.mjs";
import { o as isSessionSqliteMigrationWarning } from "./doctor-session-sqlite-types-Hd3T2UXj.mjs";
import { i as withDoctorSqliteMaintenanceLock, n as assertDoctorSqliteMaintenancePathsNotAliased } from "./doctor-sqlite-maintenance-lock-7TRGuHpb.mjs";
import { c as isLegacySessionRecordOwnedByTarget, d as resolveLegacyTranscriptPaths, f as shouldFilterLegacySessionRecordsByTarget, l as listLegacySessionTranscriptFiles, r as verifyHistoricalMigrationArtifact, t as createRecoveryDestinationVerifier, u as readLegacySessionStoreEntries } from "./doctor-session-sqlite-verification-DgNenNCo.mjs";
import { n as normalizeLegacySessionEntryDelivery } from "./state-migrations.legacy-session-store-BJKmjQA9.mjs";
import { a as readLegacyPrimaryTranscriptIdentity } from "./doctor-session-sqlite-readers-un_PyUoF.mjs";
import fs from "node:fs";
import path from "node:path";
import { setImmediate } from "node:timers/promises";
import { createHash, randomUUID } from "node:crypto";
//#region src/commands/doctor-session-sqlite-restore.ts
/** Restore planning across retained migration manifests. */
async function restoreSessionSqliteMigrationRuns(params) {
	const restoreReport = emptyRestoreReport();
	const contexts = loadRestoreManifestContexts(listSessionSqliteMigrationManifestPaths(params.env).toReversed(), params.trustedTargets);
	await reconcileRestorePublications(contexts, params.env);
	const restorePlan = createRestorePlan(contexts);
	for (const { manifest, manifestPath, targets } of contexts) {
		const manifestRestoreReport = {
			...emptyRestoreReport(),
			manifestPaths: [manifestPath]
		};
		restoreReport.manifestPaths.push(manifestPath);
		await restoreSessionSqliteMigrationManifest(manifest, manifestPath, targets, manifestRestoreReport, restorePlan);
		restoreReport.conflicts.push(...manifestRestoreReport.conflicts);
		restoreReport.restoredFiles.push(...manifestRestoreReport.restoredFiles);
		restoreReport.skippedFiles.push(...manifestRestoreReport.skippedFiles);
		writeSessionSqliteMigrationManifest({
			manifest,
			manifestPath
		});
	}
	return restoreReport;
}
/** Undo only recorded, still-linked publication intermediates before a fresh import or restore. */
async function reconcileSessionSqliteMigrationPublications(params) {
	await reconcileRestorePublications(loadRestoreManifestContexts(listSessionSqliteMigrationManifestPaths(params.env), params.trustedTargets), params.env, params.sourcePath);
}
async function reconcileRestorePublications(contexts, env, sourcePath) {
	const stateDir = path.dirname(canonicalMigrationFilePath(path.join(resolveStateDir(env), "anchor")));
	for (const context of contexts) for (const target of context.targets) for (const move of uniqueRestoreMoves(target)) {
		if (sourcePath && canonicalMigrationFilePath(sourcePath) !== move.sourcePath || !move.artifact || move.artifact.disposal.state !== "retained") continue;
		const source = statMigrationPath(move.sourcePath);
		const archive = statMigrationPath(move.archivePath);
		if (!source || !archive) continue;
		if (!source.isFile() || !archive.isFile() || source.dev !== archive.dev || source.ino !== archive.ino) continue;
		if (source.nlink !== 2 || archive.nlink !== 2) continue;
		if (![
			target.storePath,
			target.sqlitePath,
			move.archivePath
		].every((file) => isPathInside(stateDir, file))) continue;
		assertSafeSessionSqliteMigrationMove(move, target);
		assertDoctorSqliteMaintenancePathsNotAliased("session recovery publication", [context.manifestPath, ...resolveSqliteDatabaseFilePaths(target.sqlitePath)], [stateDir]);
		await moveMigrationArtifact(move.archivePath, move.sourcePath, move.artifact.identity, () => {
			assertSafeSessionSqliteMigrationMove(move, target);
			recordRestoredMigrationMove(context.manifest, context.manifestPath, move);
		});
	}
}
function recordRestoredMigrationMove(manifest, manifestPath, move) {
	requireDirectorySync(syncDirectorySync(path.dirname(path.dirname(move.sourcePath))), "Restored session directory");
	const consumed = collectRecordedConsumedArchives(manifest);
	consumed.add(move.archivePath);
	manifest.restore = {
		attemptedAt: (/* @__PURE__ */ new Date()).toISOString(),
		consumedArchives: [...consumed].toSorted(),
		conflicts: [],
		restoredFiles: [.../* @__PURE__ */ new Set([...manifest.restore?.restoredFiles ?? [], move.sourcePath])],
		skippedFiles: [],
		status: "restored"
	};
	writeSessionSqliteMigrationManifest({
		manifest,
		manifestPath
	});
}
function loadRestoreManifestContexts(manifestPaths, trustedTargets) {
	const contexts = [];
	for (const manifestPath of manifestPaths) {
		const stat = statMigrationPath(manifestPath);
		const manifest = stat?.isFile() && stat.nlink === 1 && !hasSymbolicLinkInDirectoryPath(path.dirname(manifestPath)) ? readSessionSqliteMigrationManifest(manifestPath) : void 0;
		if (!manifest) continue;
		const targets = filterRestoreManifestTargets(manifest, trustedTargets);
		if (targets.length > 0) contexts.push({
			manifest,
			manifestPath,
			targets
		});
	}
	return contexts;
}
/**
* Resolve every duplicate destination before moving an archive. A missing archive only disappears
* from the conflict set when its own manifest proves that an earlier restore consumed it.
*/
function createRestorePlan(contexts) {
	const plan = /* @__PURE__ */ new Map();
	const candidatesBySource = /* @__PURE__ */ new Map();
	for (const context of contexts) {
		const consumedArchives = collectRecordedConsumedArchives(context.manifest);
		for (const target of context.targets) for (const move of uniqueRestoreMoves(target)) {
			if (move.artifact && move.artifact.disposal.state !== "retained") {
				plan.set(restoreMovePlanKey(context.manifestPath, move), {
					action: "conflict",
					reason: move.artifact.disposal.state === "disposed" ? "rollback original was intentionally disposed by update cleanup" : "rollback original has pending cleanup; finish cleanup before restore"
				});
				continue;
			}
			const candidates = candidatesBySource.get(move.sourcePath) ?? [];
			candidates.push({
				consumed: consumedArchives.has(move.archivePath),
				context,
				move
			});
			candidatesBySource.set(move.sourcePath, candidates);
		}
	}
	for (const [sourcePath, candidates] of candidatesBySource) {
		if (fs.existsSync(sourcePath) || candidates.length === 1) {
			for (const candidate of candidates) plan.set(restoreMovePlanKey(candidate.context.manifestPath, candidate.move), { action: "standard" });
			continue;
		}
		const available = [];
		let blocked = false;
		for (const candidate of candidates) {
			const key = restoreMovePlanKey(candidate.context.manifestPath, candidate.move);
			const inspection = inspectRestoreArchive(candidate.move);
			if (inspection.state === "available") {
				available.push({
					...candidate,
					snapshot: inspection.snapshot
				});
				continue;
			}
			if (inspection.state === "missing" && candidate.consumed) {
				plan.set(key, { action: "skip-consumed" });
				continue;
			}
			blocked = true;
			plan.set(key, {
				action: "conflict",
				reason: inspection.state === "missing" ? "archive is missing without a recorded prior restore; refusing another candidate" : inspection.reason
			});
		}
		if (blocked) {
			for (const candidate of available) plan.set(restoreMovePlanKey(candidate.context.manifestPath, candidate.move), {
				action: "conflict",
				reason: "another archive for this source is unavailable without prior restore evidence; refusing automatic selection"
			});
			continue;
		}
		if (available.length === 0) continue;
		if (new Set(available.map((candidate) => candidate.move.kind)).size !== 1) {
			setRestoreCandidateConflicts(plan, available, "recorded archives disagree on artifact kind; refusing automatic selection");
			continue;
		}
		const winner = selectRestoreCandidate(available);
		if (!winner) {
			setRestoreCandidateConflicts(plan, available, available[0]?.move.kind === "legacy-store" ? "multiple distinct nonempty session indexes require explicit archive selection" : "multiple distinct archives require explicit archive selection");
			continue;
		}
		const winnerKey = restoreMovePlanKey(winner.context.manifestPath, winner.move);
		for (const candidate of available) {
			const candidateKey = restoreMovePlanKey(candidate.context.manifestPath, candidate.move);
			plan.set(candidateKey, candidateKey === winnerKey ? {
				action: "restore",
				snapshot: candidate.snapshot
			} : { action: "skip-superseded" });
		}
	}
	return plan;
}
function selectRestoreCandidate(candidates) {
	if (new Set(candidates.map((candidate) => candidate.snapshot.digest)).size === 1) return candidates[0];
	if (candidates[0]?.move.kind !== "legacy-store") return;
	const nonemptyDigests = new Set(candidates.filter((candidate) => (candidate.snapshot.legacyEntryCount ?? 0) > 0).map((candidate) => candidate.snapshot.digest));
	if (nonemptyDigests.size === 0) return candidates[0];
	return nonemptyDigests.size === 1 ? candidates.find((candidate) => (candidate.snapshot.legacyEntryCount ?? 0) > 0) : void 0;
}
function setRestoreCandidateConflicts(plan, candidates, reason) {
	for (const candidate of candidates) plan.set(restoreMovePlanKey(candidate.context.manifestPath, candidate.move), {
		action: "conflict",
		reason
	});
}
function restoreMovePlanKey(manifestPath, move) {
	return `${manifestPath}\u0000${migrationMoveKey(move)}`;
}
function collectRecordedConsumedArchives(manifest) {
	const consumed = new Set(manifest.restore?.consumedArchives ?? []);
	const restoredSources = new Set(manifest.restore?.restoredFiles ?? []);
	if (restoredSources.size === 0) return consumed;
	const movesBySource = /* @__PURE__ */ new Map();
	for (const target of manifest.targets) for (const move of uniqueRestoreMoves(target)) {
		const moves = movesBySource.get(move.sourcePath) ?? [];
		moves.push(move);
		movesBySource.set(move.sourcePath, moves);
	}
	for (const sourcePath of restoredSources) {
		const moves = movesBySource.get(sourcePath);
		const move = moves?.length === 1 ? moves[0] : void 0;
		if (move) consumed.add(move.archivePath);
	}
	return consumed;
}
function inspectRestoreArchive(move) {
	if (hasSymbolicLinkInDirectoryPath(path.dirname(move.archivePath))) return {
		state: "invalid",
		reason: "archive parent is a symbolic link; refusing restore"
	};
	let pathStat;
	try {
		pathStat = fs.lstatSync(move.archivePath);
	} catch (error) {
		const code = isRecord(error) ? error.code : void 0;
		return code === "ENOENT" || code === "ENOTDIR" ? { state: "missing" } : {
			state: "invalid",
			reason: "archive could not be inspected; refusing restore"
		};
	}
	if (!pathStat.isFile()) return {
		state: "invalid",
		reason: "archive is not a regular file; refusing restore"
	};
	const changed = {
		state: "invalid",
		reason: "archive changed while it was inspected; refusing restore"
	};
	let fd;
	try {
		const flags = process.platform === "win32" ? "r" : fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0) | (fs.constants.O_NONBLOCK ?? 0);
		fd = fs.openSync(move.archivePath, flags);
		const descriptorStat = fs.fstatSync(fd);
		if (!descriptorStat.isFile() || descriptorStat.dev !== pathStat.dev || descriptorStat.ino !== pathStat.ino) return changed;
		let digest;
		let legacyEntryCount;
		if (move.kind === "legacy-store") {
			const content = readFileDescriptorBoundedSync(fd, descriptorStat.size);
			digest = createHash("sha256").update(content).digest("hex");
			let parsed;
			try {
				parsed = JSON.parse(content.toString("utf-8"));
			} catch {
				return {
					state: "invalid",
					reason: "session index archive is not valid JSON; refusing automatic selection"
				};
			}
			if (!isRecord(parsed)) return {
				state: "invalid",
				reason: "session index archive is not a JSON object; refusing automatic selection"
			};
			legacyEntryCount = Object.keys(parsed).length;
		} else {
			const hashed = hashFileDescriptorSync(fd, descriptorStat.size);
			if (hashed.sizeBytes !== descriptorStat.size) throw new Error("archive changed while it was inspected");
			digest = hashed.sha256;
		}
		const finalPathStat = fs.lstatSync(move.archivePath);
		if (finalPathStat.dev !== descriptorStat.dev || finalPathStat.ino !== descriptorStat.ino || finalPathStat.size !== descriptorStat.size) return changed;
		return {
			state: "available",
			snapshot: {
				digest,
				...legacyEntryCount === void 0 ? {} : { legacyEntryCount },
				size: descriptorStat.size
			}
		};
	} catch (error) {
		if (move.kind !== "legacy-store" && error instanceof FsSafeError && error.code === "too-large") return changed;
		const code = isRecord(error) ? error.code : void 0;
		return code === "ENOENT" || code === "ENOTDIR" ? { state: "missing" } : {
			state: "invalid",
			reason: "archive could not be read safely; refusing restore"
		};
	} finally {
		if (fd !== void 0) fs.closeSync(fd);
	}
}
async function restoreSessionSqliteMigrationRun(params) {
	const restoreReport = {
		...emptyRestoreReport(),
		manifestPaths: [params.manifestPath]
	};
	const manifest = readSessionSqliteMigrationManifest(params.manifestPath);
	if (!manifest) {
		restoreReport.conflicts.push({
			archivePath: params.manifestPath,
			reason: "manifest is missing or unreadable",
			sourcePath: params.manifestPath
		});
		return restoreReport;
	}
	const targetManifests = filterRestoreManifestTargets(manifest, params.trustedTargets);
	if (targetManifests.length === 0) {
		restoreReport.conflicts.push({
			archivePath: params.manifestPath,
			reason: "manifest does not match a trusted session target",
			sourcePath: params.manifestPath
		});
		return restoreReport;
	}
	await reconcileRestorePublications([{
		manifest,
		manifestPath: params.manifestPath,
		targets: targetManifests
	}], params.env ?? process.env);
	await restoreSessionSqliteMigrationManifest(manifest, params.manifestPath, targetManifests, restoreReport, createRestorePlan([{
		manifest,
		manifestPath: params.manifestPath,
		targets: targetManifests
	}]));
	writeSessionSqliteMigrationManifest({
		manifest,
		manifestPath: params.manifestPath
	});
	return restoreReport;
}
function emptyRestoreReport() {
	return {
		conflicts: [],
		manifestPaths: [],
		restoredFiles: [],
		skippedFiles: []
	};
}
async function restoreSessionSqliteMigrationManifest(manifest, manifestPath, targets, restoreReport, restorePlan) {
	for (const target of targets) for (const move of uniqueRestoreMoves(target)) await restoreMigrationMove({
		manifest,
		manifestPath,
		target,
		move,
		restorePlan,
		restoreReport
	});
	const consumedArchives = collectRecordedConsumedArchives(manifest);
	manifest.restore = {
		attemptedAt: (/* @__PURE__ */ new Date()).toISOString(),
		...consumedArchives.size > 0 ? { consumedArchives: [...consumedArchives].toSorted() } : {},
		conflicts: restoreReport.conflicts,
		restoredFiles: restoreReport.restoredFiles,
		skippedFiles: restoreReport.skippedFiles,
		status: resolveRestoreStatus(restoreReport)
	};
}
async function restoreMigrationMove(params) {
	const { manifest, manifestPath, target, move, restorePlan, restoreReport } = params;
	const recordConflict = (reason) => {
		restoreReport.conflicts.push({
			archivePath: move.archivePath,
			reason,
			sourcePath: move.sourcePath
		});
	};
	const planned = restorePlan.get(restoreMovePlanKey(manifestPath, move)) ?? { action: "standard" };
	if (planned.action === "conflict") {
		recordConflict(planned.reason);
		return;
	}
	if (planned.action === "skip-consumed" || planned.action === "skip-superseded") {
		restoreReport.skippedFiles.push(move.sourcePath);
		return;
	}
	const sourceExists = statMigrationPath(move.sourcePath) !== void 0;
	const archiveExists = statMigrationPath(move.archivePath) !== void 0;
	if (sourceExists || !archiveExists) {
		if (sourceExists && !archiveExists) restoreReport.skippedFiles.push(move.sourcePath);
		else recordConflict(sourceExists ? "source and archive both exist; refusing to overwrite source" : "source and archive are both missing");
		return;
	}
	try {
		if (!isRegularFileWithoutFollowingSymlinks(move.archivePath)) throw new Error("archive is not a regular file; refusing restore");
		assertRestoreDirectories(move);
		fs.mkdirSync(path.dirname(move.sourcePath), {
			recursive: true,
			mode: 448
		});
		assertRestoreDirectories(move);
		const identity = move.artifact?.identity ?? readMigrationArtifactIdentity(move.archivePath);
		if (planned.action === "restore" && (identity.sha256 !== planned.snapshot.digest || identity.size !== planned.snapshot.size)) throw new Error("archive changed after restore planning; refusing restore");
		if (!move.artifact) {
			move.artifact = {
				identity,
				classification: "protected",
				reason: "historical-restore-original",
				dependencies: move.kind === "legacy-store" ? uniqueRestoreMoves(target).filter((item) => item.kind === "transcript").map((item) => item.sourcePath) : [],
				disposal: { state: "retained" }
			};
			for (const recorded of [...target.plannedMoves, ...target.completedMoves]) if (migrationMoveKey(recorded) === migrationMoveKey(move)) recorded.artifact = move.artifact;
			writeSessionSqliteMigrationManifest({
				manifest,
				manifestPath
			});
		}
		await moveMigrationArtifact(move.archivePath, move.sourcePath, move.artifact.identity, () => {
			assertRestoreDirectories(move);
			recordRestoredMigrationMove(manifest, manifestPath, move);
		});
		restoreReport.restoredFiles.push(move.sourcePath);
	} catch (error) {
		recordConflict(error instanceof Error ? error.message : String(error));
	}
}
function assertRestoreDirectories(move) {
	if (hasSymbolicLinkInDirectoryPath(path.dirname(move.sourcePath)) || hasSymbolicLinkInDirectoryPath(path.dirname(move.archivePath))) throw new Error("source or archive parent is a symbolic link; refusing restore");
}
function resolveRestoreStatus(report) {
	if (report.conflicts.length > 0 && report.restoredFiles.length > 0) return "partial";
	if (report.conflicts.length > 0) return "conflicts";
	if (report.restoredFiles.length > 0) return "restored";
	return "noop";
}
//#endregion
//#region src/commands/doctor-session-sqlite-recovery-inventory.ts
/** Read-only recovery inventory and dependency classification; never deletion authority. */
function resolveRecoveryArtifact(refs) {
	return refs.find((ref) => ref.move.artifact?.disposal.state === "pending-disposal")?.move.artifact ?? refs[0]?.move.artifact;
}
function collectRecoveryInventory(params) {
	const stateDir = canonicalMigrationFilePath(path.join(resolveStateDir(params.env), "anchor"));
	const root = path.dirname(stateDir);
	const stores = /* @__PURE__ */ new Set();
	const archiveDirs = /* @__PURE__ */ new Set();
	const agentIds = new Set(listAgentIds(params.cfg));
	const agentsRoot = path.join(root, "agents");
	if (statMigrationPath(agentsRoot)?.isDirectory() && !hasSymbolicLinkInDirectoryPath(agentsRoot)) {
		for (const item of fs.readdirSync(agentsRoot, { withFileTypes: true })) if (item.isDirectory()) {
			agentIds.add(item.name);
			stores.add(path.join(agentsRoot, item.name, "sessions", "sessions.json"));
		}
	}
	for (const agentId of agentIds) stores.add(canonicalMigrationFilePath(resolveSessionStorePathCore(params.cfg.session?.store, {
		agentId,
		env: params.env
	})));
	stores.add(path.join(root, "sessions", "sessions.json"));
	for (const store of stores) if (isPathInside(root, store)) archiveDirs.add(path.join(path.dirname(path.dirname(store)), "session-sqlite-import-archive"));
	const references = /* @__PURE__ */ new Map();
	const manifestPaths = [];
	const artifacts = [];
	const manifestsDir = resolveSessionSqliteMigrationRunsDir(params.env);
	if (hasSymbolicLinkInDirectoryPath(manifestsDir)) artifacts.push({
		path: manifestsDir,
		runs: [],
		bytes: 0,
		outcome: "blocked",
		reason: "manifest-directory-alias"
	});
	else {
		manifestPaths.push(...listSessionSqliteMigrationManifestPaths(params.env));
		for (const manifestPath of manifestPaths) {
			const stat = statMigrationPath(manifestPath);
			const manifest = stat?.isFile() && stat.nlink === 1 ? readSessionSqliteMigrationManifest(manifestPath) : void 0;
			if (!manifest) {
				artifacts.push({
					path: manifestPath,
					runs: [],
					bytes: stat?.size ?? 0,
					outcome: "blocked",
					reason: "unreadable-manifest"
				});
				continue;
			}
			const run = {
				manifest,
				manifestPath
			};
			const consumed = collectRecordedConsumedArchives(manifest);
			for (const target of manifest.targets) {
				const expected = resolveUnsuffixedSqliteTargetFromSessionStorePath(target.storePath);
				const trusted = stores.has(target.storePath) && isPathInside(root, target.sqlitePath) && isPathInside(root, target.storePath) && !hasSymbolicLinkInDirectoryPath(path.dirname(target.storePath)) && !hasSymbolicLinkInDirectoryPath(path.dirname(target.sqlitePath)) && (expected.agentId ? target.sqlitePath === expected.path && target.agentId === expected.agentId : path.dirname(target.sqlitePath) === path.dirname(expected.path));
				for (const move of uniqueRestoreMoves(target)) {
					const refs = references.get(move.archivePath) ?? [];
					refs.push({
						run,
						target,
						move,
						trusted,
						consumedByRestore: consumed.has(move.archivePath)
					});
					references.set(move.archivePath, refs);
				}
			}
		}
	}
	for (const [archivePath, refs] of references) {
		const evidence = resolveRecoveryArtifact(refs);
		const stat = refs.every((ref) => ref.trusted) ? fs.lstatSync(archivePath, {
			bigint: true,
			throwIfNoEntry: false
		}) : void 0;
		const claim = refs.every((ref) => ref.trusted) && evidence?.disposal.state === "pending-disposal" ? fs.lstatSync(evidence.disposal.claimPath, {
			bigint: true,
			throwIfNoEntry: false
		}) : void 0;
		const current = stat ?? claim;
		const item = {
			path: archivePath,
			runs: [...new Set(refs.map((ref) => ref.run.manifest.runId))],
			bytes: current?.isFile() ? Number(current.size) : evidence?.identity.size ?? 0,
			outcome: "candidate",
			reason: "producer-verified-original",
			consequence: "Permanently loses rollback to this original, including pre-repair branches and metadata."
		};
		if (refs.some((ref) => !ref.trusted)) {
			item.outcome = "protected";
			item.reason = "unsupported-target-ownership";
		} else if (refs.every((ref) => ref.move.artifact?.disposal.state === "disposed")) {
			item.outcome = stat ? "protected" : "disposed";
			item.reason = stat ? "recreated-after-disposal" : "intentionally-disposed";
		} else if (refs.some((ref) => ref.consumedByRestore)) {
			item.outcome = "protected";
			item.reason = "archive-consumed-by-restore";
		} else if (hasSymbolicLinkInDirectoryPath(path.dirname(archivePath)) || stat && (!stat.isFile() || stat.nlink !== 1n && !isPendingMigrationArtifactClaim(archivePath, evidence))) {
			item.outcome = "blocked";
			item.reason = "artifact-alias-or-nonregular";
		} else if (refs.some(({ run, target }) => !run.manifest.completedAt || target.validationBeforeArchive !== "passed" || target.issues.some((issue) => !isSessionSqliteMigrationWarning(issue)))) {
			item.outcome = "protected";
			item.reason = "incomplete-recovery-operation";
		} else if (refs.some(({ move }) => move.artifact?.classification === "protected")) {
			item.outcome = "protected";
			item.reason = refs.find((ref) => ref.move.artifact?.classification === "protected").move.artifact.reason;
		} else if (refs.some(({ move }) => !move.artifact)) {
			item.outcome = "verification-required";
			item.reason = "historical-manifest-without-import-proof";
		} else if (current && evidence && [
			"dev",
			"ino",
			"mtimeNs",
			"size"
		].some((key) => String(current[key]) !== String(evidence.identity[key]))) {
			item.outcome = "blocked";
			item.reason = "artifact-metadata-changed";
		} else if (refs.some(({ move }) => !sameMigrationArtifact(move.artifact.identity, evidence.identity))) {
			item.outcome = "blocked";
			item.reason = "conflicting-artifact-identities";
		} else if (refs.some(({ move }) => {
			const receipt = move.artifact?.disposal;
			return receipt?.state === "pending-disposal" && evidence?.disposal.state === "pending-disposal" && receipt.claimPath !== evidence.disposal.claimPath;
		})) {
			item.outcome = "blocked";
			item.reason = "conflicting-disposal-claims";
		} else if (!stat && !refs.every(({ move }) => move.artifact?.disposal.state === "pending-disposal" || move.artifact?.disposal.state === "disposed")) {
			item.outcome = "blocked";
			item.reason = "unexpectedly-missing-artifact";
		} else if (refs.some(({ move }) => move.artifact?.disposal.state === "pending-disposal")) item.reason = "resume-pending-disposal";
		artifacts.push(item);
	}
	for (const store of stores) {
		const directory = path.dirname(store);
		if (!isPathInside(root, directory) || !statMigrationPath(directory)?.isDirectory() || hasSymbolicLinkInDirectoryPath(directory)) continue;
		for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
			if (!isMigrationArchiveArtifactName(entry.name) && !entry.name.includes(".pre-doctor-")) continue;
			const filePath = path.join(directory, entry.name);
			artifacts.push({
				path: filePath,
				runs: [],
				bytes: entry.isFile() ? fs.lstatSync(filePath).size : 0,
				outcome: "protected",
				reason: "unmanifested-recovery-original"
			});
		}
	}
	for (const directory of archiveDirs) {
		if (!statMigrationPath(directory)?.isDirectory() || hasSymbolicLinkInDirectoryPath(directory)) continue;
		for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
			const filePath = path.join(directory, item.name);
			if (references.has(filePath) || artifacts.some((artifact) => artifact.path === filePath)) continue;
			if ([...references.values()].some((refs) => refs.some(({ move }) => move.artifact?.disposal.state === "pending-disposal" && move.artifact.disposal.claimPath === filePath))) continue;
			artifacts.push({
				path: filePath,
				runs: [],
				bytes: item.isFile() ? fs.lstatSync(filePath).size : 0,
				outcome: "protected",
				reason: "unmanifested-artifact"
			});
		}
	}
	if (artifacts.some((item) => item.reason === "unreadable-manifest" || item.reason === "manifest-directory-alias")) {
		for (const item of artifacts) if (item.outcome === "candidate" || item.outcome === "verification-required") {
			item.outcome = "blocked";
			item.reason = "unreadable-recovery-dependencies";
		}
	}
	protectRecoveryDependencies(artifacts, references);
	return {
		references,
		manifestPaths,
		report: summarizeRecoveryCleanup(root, artifacts, "preview")
	};
}
function protectRecoveryDependencies(artifacts, refs, adoptions) {
	const active = (ref) => (!ref.consumedByRestore || statMigrationPath(ref.move.archivePath) !== void 0) && ref.move.artifact?.disposal.state !== "disposed";
	const bySource = /* @__PURE__ */ new Map();
	const dependents = /* @__PURE__ */ new Map();
	for (const [archive, references] of refs) for (const ref of references.filter(active)) {
		const paths = bySource.get(ref.move.sourcePath) ?? [];
		paths.push(archive);
		bySource.set(ref.move.sourcePath, paths);
	}
	const connect = (from, to) => {
		const paths = dependents.get(from) ?? /* @__PURE__ */ new Set();
		paths.add(to);
		dependents.set(from, paths);
	};
	for (const [archive, references] of refs) for (const ref of references.filter(active)) {
		const dependencies = (ref.move.artifact ?? adoptions?.get(ref))?.dependencies ?? (ref.move.kind === "legacy-store" ? uniqueRestoreMoves(ref.target).filter((move) => move.kind === "transcript").map((move) => move.sourcePath) : []);
		for (const source of dependencies) for (const dependency of bySource.get(source) ?? []) {
			connect(archive, dependency);
			if (ref.move.kind === "legacy-store") connect(dependency, archive);
		}
	}
	const byPath = new Map(artifacts.map((item) => [item.path, item]));
	const retained = artifacts.filter((item) => item.outcome !== "candidate" && item.outcome !== "verification-required" && item.outcome !== "disposed" && item.outcome !== "removed");
	for (const item of retained) for (const dependency of dependents.get(item.path) ?? []) {
		const candidate = byPath.get(dependency);
		if (candidate?.outcome !== "candidate" && candidate?.outcome !== "verification-required") continue;
		candidate.outcome = "protected";
		candidate.reason = "retained-recovery-dependency";
		retained.push(candidate);
	}
}
function summarizeRecoveryCleanup(stateDir, artifacts, status) {
	const totals = {
		candidateBytes: 0,
		verificationRequiredBytes: 0,
		protectedBytes: 0,
		blockedBytes: 0,
		removedBytes: 0,
		removedFiles: 0
	};
	for (const item of artifacts) {
		if (item.outcome === "candidate") totals.candidateBytes += item.bytes;
		if (item.outcome === "verification-required") totals.verificationRequiredBytes += item.bytes;
		if (item.outcome === "protected") totals.protectedBytes += item.bytes;
		if (item.outcome === "blocked" || item.outcome === "failed") totals.blockedBytes += item.bytes;
		if (item.removedBytes !== void 0) {
			totals.removedBytes += item.removedBytes;
			totals.removedFiles += 1;
		}
	}
	return {
		stateDir,
		artifacts,
		totals,
		status
	};
}
function inspectSessionSqliteRecovery(params) {
	return collectRecoveryInventory(params).report;
}
//#endregion
//#region src/commands/doctor-session-sqlite-discovery.ts
/** Historical discovery belongs to offline Doctor, never runtime path resolution. */
/** Retained manifests bind archive files to their original agent, path, and bytes. */
function collectHistoricalArchiveSources(params) {
	const result = /* @__PURE__ */ new Map();
	const inventory = collectRecoveryInventory(params);
	const claims = /* @__PURE__ */ new Map();
	for (const refs of inventory.references.values()) {
		if (refs.some((ref) => !ref.trusted || ref.consumedByRestore)) continue;
		const first = refs[0];
		if (!refs.every(({ target, move }) => target.agentId === first.target.agentId && target.storePath === first.target.storePath && target.sqlitePath === first.target.sqlitePath && move.sourcePath === first.move.sourcePath)) continue;
		if (first.move.kind !== "legacy-store" && (first.move.kind !== "unreferenced-jsonl" || !isPrimarySessionTranscriptFileName(path.basename(first.move.sourcePath)))) continue;
		if (!refs.every(({ move }) => move.artifact && (move.kind === "legacy-store" || move.artifact.classification === "protected") && sameMigrationArtifact(move.artifact.identity, first.move.artifact.identity))) continue;
		if (first.move.kind === "unreferenced-jsonl") {
			const identity = first.move.artifact.identity;
			const key = JSON.stringify([
				first.target.agentId,
				first.target.storePath,
				first.target.sqlitePath,
				first.move.sourcePath,
				identity.size,
				identity.sha256
			]);
			claims.set(key, [...claims.get(key) ?? [], refs]);
		}
		if (refs.some((ref) => ref.move.artifact?.disposal.state !== "retained")) continue;
		if (refs.some(({ target, move }) => move.artifact?.reason === "indexed-historical-primary" && target.completedMoves.some((completed) => completed.archivePath === move.archivePath))) continue;
		const sources = result.get(first.target.storePath) ?? {
			transcripts: [],
			stores: []
		};
		(first.move.kind === "legacy-store" ? sources.stores : sources.transcripts).push(first.move);
		result.set(first.target.storePath, sources);
	}
	if (inventory.report.artifacts.some((item) => ["unreadable-manifest", "manifest-directory-alias"].includes(item.reason))) claims.clear();
	return {
		sources: result,
		claims: [...claims.values()].filter((group) => group.length > 1),
		inventory
	};
}
/** Archived registries supply lineage only; never replay their entries over live SQLite state. */
function readArchivedSessionOwnership(target, stores, issues) {
	const records = [];
	let verified = true;
	for (const move of stores) {
		if (!fs.existsSync(move.archivePath)) continue;
		const ownershipIssues = [];
		try {
			if (!sameMigrationArtifact(readMigrationArtifactIdentity(move.archivePath), move.artifact.identity)) throw new Error("Archived session registry no longer matches its migration receipt (file metadata or contents changed).");
			records.push(...readLegacySessionRecords(target, ownershipIssues, { sourcePath: move.archivePath }));
			if (ownershipIssues.length || !sameMigrationArtifact(readMigrationArtifactIdentity(move.archivePath), move.artifact.identity)) throw new Error("Archived session registry changed during verification or contains invalid entries.");
		} catch (error) {
			verified = false;
			issues.push({
				code: "historical_transcript_deferred",
				message: `${move.archivePath}: ${formatErrorMessage(error)} Historical transcript import skipped for this store; originals retained. This archive warning does not indicate SQLite corruption. No action is needed if all expected conversations are present. If history is missing, preserve the archive and migration manifests and follow https://docs.openclaw.ai/cli/doctor/sqlite-maintenance#changed-archived-registry`
			});
		}
	}
	return verified ? records : void 0;
}
async function discoverLegacyHistoricalTranscripts(params) {
	const directory = path.dirname(canonicalMigrationFilePath(params.target.storePath));
	assertSafeSessionSqliteMigrationDirectory(directory);
	const sources = /* @__PURE__ */ new Map();
	const referenced = new Set(params.records.flatMap((record) => record.transcriptPath ? [canonicalMigrationFilePath(record.transcriptPath)] : []));
	for (const filename of listLegacySessionTranscriptFiles(directory)) if ((!params.verifiedSourcePaths || params.verifiedSourcePaths.has(filename)) && !referenced.has(canonicalMigrationFilePath(filename)) && !params.referencedPaths?.has(canonicalMigrationFilePath(filename))) sources.set(filename, {
		path: filename,
		originalPath: filename
	});
	const archivedReferences = new Set((params.ownershipRecords ?? []).flatMap((record) => record.transcriptDependencies.map(canonicalMigrationFilePath)));
	for (const move of params.archiveSources ?? []) {
		if (archivedReferences.has(canonicalMigrationFilePath(move.sourcePath))) continue;
		sources.set(move.archivePath, {
			path: move.archivePath,
			originalPath: move.sourcePath,
			archiveMove: move
		});
	}
	const owners = /* @__PURE__ */ new Map();
	try {
		for (const record of [...params.records, ...params.ownershipRecords ?? []]) for (const id of collectSessionStateIdsForEntry(record.entry)) {
			const keys = owners.get(id) ?? /* @__PURE__ */ new Set();
			keys.add(record.sessionKey);
			owners.set(id, keys);
		}
	} catch (error) {
		params.issues.push({
			code: "historical_transcript_deferred",
			message: `${params.target.storePath}: invalid legacy lineage; originals retained: ${String(error)}`
		});
		return [];
	}
	const retainedSharedAliasIds = new Set([...owners].filter(([, keys]) => keys.size > 1).map(([id]) => id));
	const discovered = [];
	const candidates = /* @__PURE__ */ new Map();
	for (const source of sources.values()) {
		await setImmediate();
		try {
			const identity = readMigrationArtifactIdentity(source.path);
			if (source.archiveMove && !sameMigrationArtifact(identity, source.archiveMove.artifact.identity)) throw new Error("Archived original changed since migration; retained without importing");
			const primary = readLegacyPrimaryTranscriptIdentity(source.path, source.originalPath, source.archiveMove ? retainedSharedAliasIds : void 0);
			if (!primary) continue;
			if (!sameMigrationArtifact(identity, readMigrationArtifactIdentity(source.path))) throw new Error("Primary transcript changed during discovery");
			if (params.records.some((record) => record.entry.sessionId === primary.sessionId && record.transcriptPath && fs.existsSync(record.transcriptPath))) throw new Error("A registered primary already claims this identity; extra original retained");
			const existingOwner = params.snapshot.sessionKeysBySessionId.get(primary.sessionId);
			const lineage = owners.get(primary.sessionId);
			if (lineage && (lineage.size !== 1 || existingOwner && !lineage.has(existingOwner))) throw new Error("Conflicting logical owners; retained without importing");
			const owner = existingOwner ?? lineage?.values().next().value;
			const pathOwner = resolveUnsuffixedSqliteTargetFromSessionStorePath(params.target.storePath).agentId;
			if (!owner && pathOwner !== params.target.agentId) throw new Error("No unambiguous agent owner for unregistered history");
			const record = {
				sessionKey: owner ?? `agent:${params.target.agentId}:recovered:${primary.sessionId}`,
				entry: {
					sessionId: primary.sessionId,
					updatedAt: primary.updatedAt,
					archivedAt: primary.updatedAt || 1
				},
				transcriptPath: source.path,
				transcriptDependencies: [source.originalPath],
				historical: {
					originalPath: source.originalPath,
					identity,
					...source.archiveMove ? { archiveMove: source.archiveMove } : {}
				}
			};
			const records = candidates.get(primary.sessionId) ?? [];
			records.push(record);
			candidates.set(primary.sessionId, records);
		} catch (error) {
			params.issues.push({
				code: "historical_transcript_deferred",
				message: `${source.originalPath}: ${String(error)}`
			});
		}
	}
	for (const [sessionId, records] of candidates) {
		const first = records[0];
		const identicalArchives = records.every((record) => record.historical?.archiveMove && record.historical.originalPath === first.historical.originalPath && record.historical.identity.size === first.historical.identity.size && record.historical.identity.sha256 === first.historical.identity.sha256);
		if (records.length > 1 && !identicalArchives) params.issues.push({
			code: "historical_transcript_deferred",
			message: `${sessionId}: multiple primary files claim this identity; originals retained without importing`
		});
		else discovered.push(first);
	}
	return discovered;
}
function gatherLegacyArchiveCoverage(cfg, env, targets, knownTargets = resolveAllAgentSessionStoreCandidateTargetsSync(cfg, { env })) {
	const selectedStorePaths = /* @__PURE__ */ new Set();
	const referencedPaths = /* @__PURE__ */ new Set();
	const retainedPaths = /* @__PURE__ */ new Set();
	const incompleteDirectories = /* @__PURE__ */ new Set();
	const retainedDirectories = /* @__PURE__ */ new Set();
	const indexIdentities = /* @__PURE__ */ new Map();
	const targetsByStore = /* @__PURE__ */ new Map();
	for (const target of targets) {
		const storePath = canonicalMigrationFilePath(target.storePath);
		targetsByStore.set(storePath, [...targetsByStore.get(storePath) ?? [], target]);
	}
	const directories = new Set([...targetsByStore.keys()].map((store) => path.dirname(store)));
	const knownStores = new Map([...knownTargets, ...targets].map((target) => [canonicalMigrationFilePath(target.storePath), target]));
	for (const [storePath, target] of knownStores) {
		if (storePath.endsWith(".sqlite") || !directories.has(path.dirname(storePath)) || !fs.existsSync(storePath)) continue;
		const storeTargets = targetsByStore.get(storePath) ?? [];
		const issues = [];
		let records;
		try {
			assertSafeSessionSqliteMigrationDirectory(path.dirname(storePath));
			indexIdentities.set(storePath, readMigrationArtifactIdentity(storePath));
			records = readLegacySessionRecords(target, issues);
		} catch (error) {
			if (storeTargets.length > 0) throw error;
			incompleteDirectories.add(path.dirname(storePath));
			retainedDirectories.add(path.dirname(storePath));
			continue;
		}
		const keys = [...records.map((record) => record.sessionKey), ...issues.flatMap((issue) => issue.sessionKey ? [issue.sessionKey] : [])];
		const selected = storeTargets.length > 0 && issues.every(isSessionSqliteMigrationWarning) && keys.every((sessionKey) => storeTargets.some((candidate) => !shouldFilterLegacySessionRecordsByTarget(candidate) || isLegacySessionRecordOwnedByTarget(cfg, candidate, sessionKey)));
		if (issues.length > 0) {
			incompleteDirectories.add(path.dirname(storePath));
			if (!selected) retainedDirectories.add(path.dirname(storePath));
		}
		if (selected) selectedStorePaths.add(storePath);
		for (const record of records) {
			if (!record.transcriptPath) continue;
			for (const source of [
				record.transcriptPath,
				resolveTrajectoryPath(record.transcriptPath),
				resolveTrajectoryPointerPath(record.transcriptPath)
			]) {
				if (!source) continue;
				const canonical = canonicalMigrationFilePath(source);
				referencedPaths.add(canonical);
				if (!selected) retainedPaths.add(canonical);
			}
		}
	}
	for (const [storePath, storeTargets] of targetsByStore) if (!fs.existsSync(storePath) && storeTargets.every((target) => !shouldFilterLegacySessionRecordsByTarget(target))) selectedStorePaths.add(storePath);
	return {
		selectedStorePaths,
		referencedPaths,
		retainedPaths,
		incompleteDirectories,
		retainedDirectories,
		indexIdentities
	};
}
function readLegacySessionRecords(target, issues, options = {}) {
	const records = [];
	for (const { entry, sessionKey } of readLegacySessionStoreEntries(target, issues, options).entries) {
		const { transcriptPath, transcriptDependencies } = resolveLegacyTranscriptPaths(target, entry, options.verifiedSourcePaths);
		records.push({
			entry: migrateLegacySessionCreator(normalizeLegacySessionEntryDelivery(entry)),
			sessionKey,
			transcriptPath,
			transcriptDependencies
		});
	}
	return records;
}
function listUnreferencedJsonlFiles(storePath, referencedPaths) {
	const sessionsDir = path.dirname(storePath);
	let entries;
	try {
		entries = fs.readdirSync(sessionsDir);
	} catch {
		return [];
	}
	const referenced = new Set(referencedPaths.map((filePath) => resolveRealpathOrAbsolute(filePath)));
	return entries.filter((entry) => entry.endsWith(".jsonl")).map((entry) => path.join(sessionsDir, entry)).filter((filePath) => !referenced.has(resolveRealpathOrAbsolute(filePath))).toSorted((a, b) => a.localeCompare(b));
}
//#endregion
//#region src/commands/doctor-session-sqlite-migration-coalesce.ts
/** Manifest-owned redirection of verified redundant archive references. */
/** Replace retired duplicate references without removing any run's rollback coverage. */
function coalesceSessionSqliteArchiveReferences(replacements, runs) {
	const results = /* @__PURE__ */ new Map();
	const changed = /* @__PURE__ */ new Set();
	for (const run of runs) for (const target of run.manifest.targets) {
		const paths = new Set(uniqueRestoreMoves(target).map((move) => move.archivePath));
		const settled = [...replacements].filter(([original, survivor]) => paths.has(original) || paths.has(survivor.archivePath));
		if (settled.length === 0) continue;
		const key = sessionSqliteMigrationTargetKey(target);
		const result = results.get(key) ?? {
			target,
			archives: /* @__PURE__ */ new Set(),
			issues: [{
				code: "historical_duplicate_settled",
				message: ""
			}]
		};
		results.set(key, result);
		settled.forEach(([original]) => result.archives.add(original));
		target.issues.push(...result.issues);
		for (const list of ["plannedMoves", "completedMoves"]) {
			const moves = /* @__PURE__ */ new Map();
			for (const move of target[list]) {
				const survivor = replacements.get(move.archivePath);
				if (survivor && move.artifact?.disposal.state === "disposed") {
					move.archivePath = survivor.archivePath;
					move.artifact = {
						...move.artifact,
						identity: survivor.artifact.identity,
						disposal: { state: "retained" }
					};
				}
				const moveKey = migrationMoveKey(move);
				if (moves.get(moveKey)?.artifact?.reason !== "indexed-historical-primary") moves.set(moveKey, move);
			}
			target[list] = [...moves.values()];
		}
		changed.add(run);
	}
	for (const { archives, issues } of results.values()) issues[0].message = `Retired ${archives.size} byte-identical duplicate archive(s); rollback references now use the verified surviving originals.`;
	for (const run of changed) writeSessionSqliteMigrationManifest(run);
	return [...results.values()].map(({ target, issues }) => ({
		target,
		issues
	}));
}
//#endregion
//#region src/commands/doctor-session-sqlite-retirement.ts
/** Retirement of producer-verified originals; never a suffix deletion policy. */
function assertRecoveryOriginal(archivePath, artifact) {
	const currentPath = statMigrationPath(archivePath) ? archivePath : artifact.disposal.state === "pending-disposal" ? artifact.disposal.claimPath : archivePath;
	if (!statMigrationPath(currentPath)) {
		if (artifact.disposal.state === "pending-disposal" && artifact.disposal.phase === "unlink-pending") return;
		throw new Error("artifact is unexpectedly missing");
	}
	const links = isPendingMigrationArtifactClaim(archivePath, artifact) ? 2n : 1n;
	if (!sameMigrationArtifact(readMigrationArtifactIdentity(currentPath, links), artifact.identity)) throw new Error("artifact identity or contents changed");
}
/** Coalesce only exact raw copies; the surviving original preserves every rollback byte. */
async function settleDuplicateSessionSqliteArchives(params) {
	const { claims, inventory: { report, references } } = collectHistoricalArchiveSources(params);
	const failures = [];
	const survivors = /* @__PURE__ */ new Map();
	const selected = [];
	const replacements = /* @__PURE__ */ new Map();
	const assertSurvivor = (refs) => {
		const move = survivors.get(refs[0].move.archivePath)[0].move;
		if (hasSymbolicLinkInDirectoryPath(path.dirname(move.archivePath))) throw new Error("Retained duplicate archive directory changed.");
		assertRecoveryOriginal(move.archivePath, move.artifact);
	};
	for (const group of claims) {
		const target = group[0][0].target;
		if (!params.targets.some((candidate) => candidate.agentId === target.agentId && candidate.storePath === target.storePath && candidate.sqlitePath === target.sqlitePath)) continue;
		const survivor = group.find((refs) => refs.every((ref) => ref.move.artifact.disposal.state === "retained"));
		if (!survivor) continue;
		for (const refs of group.filter((candidate) => candidate !== survivor)) {
			const item = report.artifacts.find((candidate) => candidate.path === refs[0].move.archivePath);
			survivors.set(item.path, survivor);
			try {
				assertSurvivor(refs);
				const artifact = resolveRecoveryArtifact(refs);
				if (refs.some((ref) => ref.move.artifact.disposal.state === "disposed") && statMigrationPath(item.path)) throw new Error("Archive was recreated after disposal.");
				if (artifact.disposal.state !== "disposed") {
					assertRecoveryOriginal(item.path, artifact);
					item.outcome = "candidate";
					selected.push(item);
				}
				replacements.set(item.path, survivor[0].move);
			} catch (error) {
				failures.push({
					target,
					issues: [{
						code: "historical_transcript_deferred",
						message: `${item.path}: ${String(error)}; original retained.`
					}]
				});
			}
		}
	}
	await disposeRecoveryArtifacts({
		selected,
		references,
		assertDestinations: assertSurvivor
	});
	for (const [archivePath] of replacements) {
		const refs = references.get(archivePath);
		if (refs.every((ref) => ref.move.artifact.disposal.state === "disposed")) assertSurvivor(refs);
		else {
			replacements.delete(archivePath);
			const item = selected.find((candidate) => candidate.path === archivePath);
			failures.push({
				target: refs[0].target,
				issues: [{
					code: "historical_transcript_deferred",
					message: `${archivePath}: ${item.detail ?? item.reason}; original retained.`
				}]
			});
		}
	}
	return [...failures, ...coalesceSessionSqliteArchiveReferences(replacements, [...new Set([...references.values()].flatMap((refs) => refs.map((ref) => ref.run)))])];
}
/** The CLI supplies source-only configuration again under authority before exact confirmation. */
async function retireSessionSqliteRecovery(params) {
	await assertOpenClawStateWriteAllowedAtPath({
		databasePath: path.join(params.preview.stateDir, "state", "openclaw.sqlite"),
		env: params.env,
		recoverOrphanedSidecars: false
	});
	return withDoctorSqliteMaintenanceLock({
		env: params.env,
		operation: "update recovery cleanup",
		run: async (authority) => {
			const { report, references, manifestPaths } = collectRecoveryInventory({
				cfg: await params.readConfig(),
				env: params.env
			});
			authority.assertCurrent();
			if (report.stateDir !== params.preview.stateDir || JSON.stringify(report.artifacts) !== JSON.stringify(params.preview.artifacts)) throw new Error("Recovery selection changed; preview cleanup again.");
			await assertOpenClawStateWriteAllowedAtPath({
				databasePath: path.join(report.stateDir, "state", "openclaw.sqlite"),
				env: params.env,
				recoverOrphanedSidecars: false
			});
			const adoptions = /* @__PURE__ */ new Map();
			const assertDestinations = createRecoveryDestinationVerifier(report.stateDir);
			for (const item of report.artifacts) {
				if (item.outcome === "verification-required") {
					const refs = references.get(item.path);
					try {
						for (const ref of refs) {
							if (ref.move.artifact) continue;
							const artifact = verifyHistoricalMigrationArtifact({
								target: ref.target,
								move: ref.move,
								env: params.env
							});
							if (!artifact) throw new Error("historical-import-proof-unavailable");
							adoptions.set(ref, artifact);
						}
						item.outcome = "candidate";
						item.reason = "verified-historical-import";
					} catch (error) {
						item.outcome = "protected";
						item.reason = "historical-import-proof-unavailable";
						item.detail = String(error);
					}
				}
				if (item.outcome !== "candidate") continue;
				try {
					const refs = references.get(item.path);
					const artifact = resolveRecoveryArtifact(refs) ?? adoptions.get(refs[0]);
					assertRecoveryOriginal(item.path, artifact);
				} catch (error) {
					item.outcome = "blocked";
					item.reason = "artifact-verification-failed";
					item.detail = String(error);
				}
			}
			for (const item of report.artifacts) {
				if (item.outcome !== "candidate") continue;
				try {
					assertDestinations(references.get(item.path));
				} catch (error) {
					item.outcome = "blocked";
					item.reason = "destination-verification-failed";
					item.detail = String(error);
				}
			}
			protectRecoveryDependencies(report.artifacts, references, adoptions);
			const verified = summarizeRecoveryCleanup(report.stateDir, report.artifacts, "preview");
			const selected = verified.artifacts.filter((item) => item.outcome === "candidate");
			if (!await params.confirm(verified)) return {
				...verified,
				status: "refused"
			};
			authority.assertCurrent();
			const rechecked = collectRecoveryInventory({
				cfg: await params.readConfig(),
				env: params.env
			});
			if (rechecked.report.stateDir !== report.stateDir || JSON.stringify(rechecked.manifestPaths) !== JSON.stringify(manifestPaths) || JSON.stringify(rechecked.report.artifacts) !== JSON.stringify(params.preview.artifacts)) throw new Error("Recovery selection changed during confirmation; preview again.");
			for (const refs of references.values()) for (const ref of refs) {
				if (JSON.stringify(readSessionSqliteMigrationManifest(ref.run.manifestPath)) !== JSON.stringify(ref.run.manifest)) throw new Error("Recovery manifest changed during confirmation; preview again.");
				if (!(rechecked.references.get(ref.move.archivePath) ?? []).some((current) => current.trusted === ref.trusted && current.target.storePath === ref.target.storePath && current.target.sqlitePath === ref.target.sqlitePath)) throw new Error("Recovery target changed during confirmation; preview again.");
			}
			await assertOpenClawStateWriteAllowedAtPath({
				databasePath: path.join(report.stateDir, "state", "openclaw.sqlite"),
				env: params.env,
				recoverOrphanedSidecars: false
			});
			authority.assertCurrent();
			for (const item of selected) {
				const refs = references.get(item.path);
				assertDestinations(refs);
				assertRecoveryOriginal(item.path, resolveRecoveryArtifact(refs) ?? adoptions.get(refs[0]));
			}
			for (const [ref, artifact] of adoptions) {
				if (!selected.some((item) => item.path === ref.move.archivePath)) continue;
				if (ref.run.manifest.manifestVersion !== 4) ref.run.manifest.manifestVersion = 3;
				for (const move of [...ref.target.plannedMoves, ...ref.target.completedMoves]) if (move.archivePath === ref.move.archivePath) move.artifact = artifact;
			}
			await disposeRecoveryArtifacts({
				selected,
				references,
				assertDestinations,
				assertCurrent: () => authority.assertCurrent()
			});
			return summarizeRecoveryCleanup(report.stateDir, report.artifacts, report.artifacts.some((item) => item.outcome === "failed" || item.outcome === "blocked") ? "blocked" : "complete");
		}
	});
}
async function disposeRecoveryArtifacts({ selected, references, assertDestinations, assertCurrent }) {
	const runs = /* @__PURE__ */ new Set();
	for (const item of selected) {
		const refs = references.get(item.path);
		const disposal = refs.map(({ move }) => move.artifact.disposal).find((receipt) => receipt.state === "pending-disposal") ?? {
			state: "pending-disposal",
			intendedAt: (/* @__PURE__ */ new Date()).toISOString(),
			phase: "intent",
			claimPath: path.join(path.dirname(item.path), `.cleanup-${randomUUID()}`)
		};
		for (const ref of refs) {
			for (const move of [...ref.target.plannedMoves, ...ref.target.completedMoves]) if (move.archivePath === item.path && move.artifact) move.artifact.disposal = disposal;
			runs.add(ref.run);
		}
	}
	for (const run of runs) writeSessionSqliteMigrationManifest(run);
	let activeItem;
	const claims = selected.map((item) => {
		const refs = references.get(item.path);
		const artifact = refs[0].move.artifact;
		const disposal = artifact.disposal;
		if (disposal.state !== "pending-disposal" || path.dirname(disposal.claimPath) !== path.dirname(item.path) || !path.basename(disposal.claimPath).startsWith(".cleanup-")) throw new Error("invalid disposal claim");
		return {
			item,
			refs,
			artifact,
			disposal,
			present: false
		};
	});
	try {
		for (const claim of claims) {
			const { item, refs, artifact, disposal } = claim;
			activeItem = item;
			assertCurrent?.();
			assertDestinations(refs);
			if (hasSymbolicLinkInDirectoryPath(path.dirname(item.path))) throw new Error("archive directory changed");
			if (statMigrationPath(item.path)) {
				if (disposal.phase === "unlink-pending") throw new Error("archive was recreated after claim");
				await moveMigrationArtifact(item.path, disposal.claimPath, artifact.identity);
			}
			assertCurrent?.();
			assertDestinations(refs);
			assertRecoveryOriginal(item.path, artifact);
			claim.present = statMigrationPath(disposal.claimPath) !== void 0;
			disposal.phase = "unlink-pending";
		}
		for (const run of runs) writeSessionSqliteMigrationManifest(run);
		for (const { item, artifact, disposal, present } of claims) {
			activeItem = item;
			if (hasSymbolicLinkInDirectoryPath(path.dirname(item.path))) throw new Error("archive directory changed");
			if (statMigrationPath(item.path)) throw new Error("archive was recreated after claim");
			assertRecoveryOriginal(item.path, artifact);
			if (present !== (statMigrationPath(disposal.claimPath) !== void 0)) throw new Error("disposal claim changed after intent");
		}
		assertCurrent?.();
		for (const { item, refs } of claims) {
			activeItem = item;
			assertDestinations(refs);
		}
		for (const { item, artifact, disposal } of claims) {
			activeItem = item;
			const claim = statMigrationPath(disposal.claimPath);
			if (claim) {
				fs.unlinkSync(disposal.claimPath);
				item.removedBytes = artifact.identity.size;
			}
			item.outcome = claim ? "removed" : "disposed";
			item.bytes = claim ? artifact.identity.size : 0;
			item.reason = claim ? "rollback-original-retired" : "completed-interrupted-disposal";
		}
		const syncedDirectories = /* @__PURE__ */ new Set();
		for (const { item, refs } of claims) {
			activeItem = item;
			const directory = path.dirname(item.path);
			if (item.outcome === "removed" && !syncedDirectories.has(directory)) {
				requireDirectorySync(await syncDirectory(directory), "Recovery artifact removal");
				syncedDirectories.add(directory);
			}
			assertCurrent?.();
			assertDestinations(refs);
			for (const ref of refs) for (const move of [...ref.target.plannedMoves, ...ref.target.completedMoves]) if (move.archivePath === item.path && move.artifact) move.artifact.disposal = {
				state: "disposed",
				disposedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
		}
		for (const run of runs) writeSessionSqliteMigrationManifest(run);
	} catch (error) {
		if (activeItem) {
			activeItem.outcome = "failed";
			activeItem.reason = "artifact-retirement-failed";
			activeItem.detail = String(error);
		}
		for (const item of selected) if (item.outcome === "candidate") {
			item.outcome = "blocked";
			item.reason = "retirement-stopped";
		}
	}
}
//#endregion
export { gatherLegacyArchiveCoverage as a, readLegacySessionRecords as c, reconcileSessionSqliteMigrationPublications as d, restoreSessionSqliteMigrationRun as f, discoverLegacyHistoricalTranscripts as i, collectRecoveryInventory as l, settleDuplicateSessionSqliteArchives as n, listUnreferencedJsonlFiles as o, restoreSessionSqliteMigrationRuns as p, collectHistoricalArchiveSources as r, readArchivedSessionOwnership as s, retireSessionSqliteRecovery as t, inspectSessionSqliteRecovery as u };
