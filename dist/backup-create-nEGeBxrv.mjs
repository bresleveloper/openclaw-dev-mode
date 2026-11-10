import { E as resolveDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as isErrno, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { d as resolveHomeDir } from "./utils-gjJ-tD2q.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { v as resolveGatewayLockDir } from "./paths-orClZ-2Z.mjs";
import "./errors-DPfGDWk1.mjs";
import { l as resolveRuntimeServiceVersion } from "./version-jg_14gWz.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { a as publishFileExclusive, f as syncDirectoryIfSupported, n as getPublishFileExclusiveFailureDetails, r as isHardlinkFallbackError, s as requireDirectorySync } from "./directory-durability-B2RKADOj.mjs";
import { d as withCommandProcessScope, r as resolveCommandProcessSignal } from "./exec-spawn-Cn2m7YAI.mjs";
import { i as stageBackupConfigCapture } from "./backup-config-capture-gOLZYQL1.mjs";
import { a as isLegacyAuditMigrationBackupPath, i as hasLegacyAuditBackupSources } from "./backup-volatile-filter-60qK_QQY.mjs";
import { n as isUpdateCapturePath } from "./update-capture-paths-KB4ru3JI.mjs";
import { c as recordArchiveSymbolicLink, n as describeCapturedBackupSqliteSnapshots, r as sealBackupResourceInventory } from "./backup-resource-inventory-Cw2aamVQ.mjs";
import { a as canonicalizePathForContainment, i as buildBackupArchiveRoot, l as resolveBackupPlanFromDisk, n as buildBackupArchiveBasename, r as buildBackupArchivePath } from "./backup-shared-DwQAqPTD.mjs";
import { t as backupManifestSizeError } from "./backup-verify-manifest-OCDSc6Go.mjs";
import { n as finishBackupScratch, r as maintainBackupScratch, t as createBackupScratchDirectory } from "./backup-scratch-CUsD2GWp.mjs";
import { a as createLegacyAuditBackupCapture, i as LegacyAuditBackupStateChangedError, n as createBackupSqliteSnapshotPlan, o as legacyAuditBackupCapturesMatch, t as classifyBackupSqliteSource } from "./backup-sqlite-snapshot-DTRlR6jv.mjs";
import { t as withLegacyAuditMigrationLease } from "./state-migrations.audit-coordination-BHKgY_l8.mjs";
import fs, { constants, createWriteStream } from "node:fs";
import { randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { sameFileIdentity } from "@openclaw/fs-safe/advanced";
import { isPathInside } from "@openclaw/fs-safe/path";
import { createGzip } from "node:zlib";
import { Transform, compose } from "node:stream";
import { finished, pipeline as pipeline$1 } from "node:stream/promises";
//#region src/infra/backup-create-stream.ts
const BACKUP_ARCHIVE_IDLE_TIMEOUT_MS = 3e5;
/** Seal the manifest from observed entries after the single payload traversal. */
function appendBackupManifest(payload, createManifest) {
	return compose(payload, async function* (source) {
		let tail = Buffer.alloc(0);
		for await (const chunk of source) {
			const length = Math.max(0, tail.length - Math.max(0, 1024 - chunk.length));
			if (length) yield tail.subarray(0, length);
			tail = length < tail.length ? Buffer.concat([tail.subarray(length), chunk]) : chunk;
		}
		if (tail.length > 1024) yield tail.subarray(0, -1024);
		yield createManifest();
	}, createGzip());
}
function removePreparedBackupArchive(prepared) {
	let currentIdentity;
	try {
		currentIdentity = fs.lstatSync(prepared.archivePath, { bigint: true });
	} catch {
		return false;
	}
	if (!currentIdentity.isFile() || !sameFileIdentity(prepared.identity, currentIdentity)) return false;
	try {
		fs.unlinkSync(prepared.archivePath);
		return true;
	} catch {
		return false;
	}
}
async function writeArchiveStreamToFile(params) {
	const controller = new AbortController();
	const signal = resolveCommandProcessSignal(controller.signal);
	signal.throwIfAborted();
	let opened = false;
	let openedIdentity;
	let idleTimer;
	let idleTimeoutError;
	let lastEntryPath;
	let lastProgress;
	const bytes = {
		output: 0,
		raw: 0
	};
	let settled = false;
	const reportProgress = (progress) => {
		if (settled) return;
		if (progress) {
			lastProgress = progress;
			if (progress.entryPath) lastEntryPath = progress.entryPath;
			if (progress.bytes) {
				const phase = progress.phase === "output" ? "output" : progress.phase === "raw" ? "raw" : void 0;
				if (phase) bytes[phase] += progress.bytes;
			}
		}
		idleTimer = idleTimer?.refresh() ?? setTimeout(() => {
			const entrySuffix = lastEntryPath ? `, entry=${JSON.stringify(sliceUtf16Safe(lastEntryPath, -512))}` : "";
			idleTimeoutError = /* @__PURE__ */ new Error(`Backup archive write stalled: no progress observed for ${BACKUP_ARCHIVE_IDLE_TIMEOUT_MS}ms (phase=${lastProgress?.phase ?? "starting"}${entrySuffix}, rawBytes=${bytes.raw}, outputBytes=${bytes.output})`);
			controller.abort(idleTimeoutError);
		}, BACKUP_ARCHIVE_IDLE_TIMEOUT_MS);
	};
	const progress = new Transform({ transform(chunk, _encoding, callback) {
		reportProgress({
			phase: "output",
			bytes: chunk.length
		});
		callback(null, chunk);
	} });
	const archiveWriteStream = createWriteStream(params.archivePath, {
		flags: "wx",
		flush: true,
		mode: 384
	});
	archiveWriteStream.once("open", (fileDescriptor) => {
		opened = true;
		try {
			openedIdentity = fs.fstatSync(fileDescriptor, { bigint: true });
		} catch (error) {
			archiveWriteStream.destroy(error);
		}
	});
	try {
		const archiveStream = params.createArchiveStream(reportProgress, signal);
		const pipelinePromise = pipeline$1(archiveStream, progress, archiveWriteStream, { signal });
		reportProgress();
		await pipelinePromise;
		const currentIdentity = await fs$1.lstat(params.archivePath, { bigint: true });
		if (!openedIdentity?.isFile() || !currentIdentity.isFile() || !sameFileIdentity(openedIdentity, currentIdentity)) throw new Error(`Backup archive path changed while writing: ${params.archivePath}`);
		signal.throwIfAborted();
		return {
			archivePath: params.archivePath,
			identity: currentIdentity
		};
	} catch (err) {
		archiveWriteStream.destroy();
		await finished(archiveWriteStream, { cleanup: true }).catch(() => void 0);
		if (!opened) throw idleTimeoutError ?? err;
		let cleanupReceipt = { archivePath: params.archivePath };
		if (openedIdentity) cleanupReceipt.identity = openedIdentity;
		else try {
			const currentIdentity = fs.lstatSync(params.archivePath, { bigint: true });
			if (currentIdentity.isFile()) cleanupReceipt.identity = currentIdentity;
		} catch (cleanupError) {
			if (cleanupError.code === "ENOENT") cleanupReceipt = void 0;
		}
		if (cleanupReceipt && (!cleanupReceipt.identity || !removePreparedBackupArchive(cleanupReceipt))) params.onPartialArchive(cleanupReceipt);
		throw idleTimeoutError ?? err;
	} finally {
		settled = true;
		if (idleTimer) clearTimeout(idleTimer);
	}
}
//#endregion
//#region src/infra/backup-archive-publication.ts
function pathsEqual(left, right) {
	const resolvedLeft = path.resolve(left);
	const resolvedRight = path.resolve(right);
	return process.platform === "win32" ? resolvedLeft.toLowerCase() === resolvedRight.toLowerCase() : resolvedLeft === resolvedRight;
}
async function assertTargetAbsent(targetPath) {
	try {
		await fs$1.lstat(targetPath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	throw new Error(`Refusing to overwrite existing backup archive: ${targetPath}`);
}
async function removeDirectoryIfOwned(directoryPath, expectedIdentity) {
	const currentIdentity = await fs$1.lstat(directoryPath, { bigint: true }).catch(() => void 0);
	if (!currentIdentity || !currentIdentity.isDirectory() || !sameFileIdentity(expectedIdentity, currentIdentity)) return false;
	try {
		await fs$1.rmdir(directoryPath);
		return true;
	} catch {
		return false;
	}
}
async function createBackupArchivePublication(outputPath) {
	const requestedOutputPath = path.resolve(outputPath);
	const requestedParentPath = path.dirname(requestedOutputPath);
	const canonicalParentPath = await fs$1.realpath(requestedParentPath);
	const parentIdentity = await fs$1.lstat(canonicalParentPath, { bigint: true });
	if (!parentIdentity.isDirectory()) throw new Error(`Backup output parent is not a directory: ${requestedParentPath}`);
	const canonicalOutputPath = path.join(canonicalParentPath, path.basename(requestedOutputPath));
	await assertTargetAbsent(canonicalOutputPath);
	const stagingDir = await fs$1.mkdtemp(path.join(canonicalParentPath, `.openclaw-backup-publish-${randomUUID()}-`));
	let stagingIdentity;
	try {
		stagingIdentity = await fs$1.lstat(stagingDir, { bigint: true });
		await fs$1.chmod(stagingDir, 448);
		return {
			canonicalOutputPath,
			canonicalParentPath,
			parentReceipt: {
				path: canonicalParentPath,
				realPath: canonicalParentPath,
				identity: parentIdentity
			},
			pendingCleanupArchives: [],
			requestedOutputPath,
			requestedParentPath,
			stagingDir,
			stagingIdentity,
			tempArchivePath: path.join(stagingDir, "archive.tar.gz.tmp")
		};
	} catch (error) {
		if (stagingIdentity) await removeDirectoryIfOwned(stagingDir, stagingIdentity);
		throw error;
	}
}
function retainArchiveForCleanup(plan, receipt) {
	for (const [index, candidate] of plan.pendingCleanupArchives.entries()) {
		if (!pathsEqual(candidate.archivePath, receipt.archivePath)) continue;
		if (candidate.identity && receipt.identity) {
			if (!sameFileIdentity(candidate.identity, receipt.identity)) continue;
		} else if (!candidate.identity && receipt.identity) plan.pendingCleanupArchives[index] = receipt;
		return;
	}
	plan.pendingCleanupArchives.push(receipt);
}
async function removePendingBackupArchive(plan, receipt) {
	if (!pathsEqual(path.dirname(receipt.archivePath), plan.stagingDir)) return false;
	let identity = receipt.identity;
	if (!identity) {
		try {
			identity = await fs$1.lstat(receipt.archivePath, { bigint: true });
		} catch (error) {
			return error.code === "ENOENT";
		}
		if (!identity.isFile()) return false;
	}
	return removePreparedBackupArchive({
		archivePath: receipt.archivePath,
		identity
	});
}
async function cleanupBackupArchivePublication(plan, log) {
	const retainedArchives = plan.pendingCleanupArchives.splice(0);
	for (const receipt of retainedArchives) if (!await removePendingBackupArchive(plan, receipt)) retainArchiveForCleanup(plan, receipt);
	if (await removeDirectoryIfOwned(plan.stagingDir, plan.stagingIdentity)) {
		await syncDirectoryIfSupported(plan.canonicalParentPath).catch(() => void 0);
		return;
	}
	if (await fs$1.lstat(plan.stagingDir).catch(() => void 0)) log?.(`Backup archiver preserved changed or non-empty staging directory ${plan.stagingDir}.`);
}
async function publishPreparedBackupArchive(params) {
	const { plan, prepared } = params;
	let publicationPreserved = false;
	let publicationFailure;
	try {
		try {
			resolveCommandProcessSignal()?.throwIfAborted();
			const publication = await publishFileExclusive({
				sourcePath: prepared.archivePath,
				targetPath: plan.canonicalOutputPath,
				expectedSourceIdentity: prepared.identity,
				parentReceipt: plan.parentReceipt,
				strategy: "link-required",
				onSyncFailure: "preserve"
			});
			publicationPreserved = true;
			requireDirectorySync(publication.directorySync, "Backup publication directory");
		} catch (error) {
			const details = getPublishFileExclusiveFailureDetails(error);
			publicationPreserved ||= details?.cleanup === "preserved";
			let message;
			if (error.code === "EEXIST") message = `Refusing to overwrite existing backup archive: ${plan.requestedOutputPath}`;
			else if (isHardlinkFallbackError(error)) message = `Atomic backup publication requires hard-link support in ${plan.requestedParentPath}.`;
			else if (error.code === "path-mismatch") message = `Backup archive changed during publication: ${plan.requestedOutputPath}`;
			else throw error;
			throw new Error(message, { cause: error });
		}
	} catch (error) {
		publicationFailure = { error };
	}
	if (publicationFailure && publicationPreserved) params.log?.(`Backup archiver preserved the final archive after publication failed: ${plan.requestedOutputPath}.`);
	if (!removePreparedBackupArchive(prepared)) {
		retainArchiveForCleanup(plan, prepared);
		if (!publicationFailure) params.log?.(`Backup archiver preserved changed staging file ${prepared.archivePath}.`);
	}
	const removed = await removeDirectoryIfOwned(plan.stagingDir, plan.stagingIdentity);
	if (publicationFailure) throw publicationFailure.error;
	if (!removed) params.log?.(`Backup archiver preserved changed or non-empty staging directory ${plan.stagingDir}.`);
	await syncDirectoryIfSupported(plan.canonicalParentPath).catch((error) => {
		params.log?.(`Backup archiver could not sync cleanup in ${plan.canonicalParentPath}: ${error.code ?? String(error)}.`);
	});
}
//#endregion
//#region src/infra/backup-tar-retry.ts
const BACKUP_TAR_MAX_ATTEMPTS = 3;
const BACKUP_TAR_BACKOFF_MS = [1e4, 2e4];
async function writeTarArchiveWithRetry(params) {
	const sleepFn = params.sleepMs ?? ((ms) => sleep(ms, resolveCommandProcessSignal()));
	for (let attempt = 1;; attempt += 1) {
		const attemptTempArchivePath = attempt === 1 ? params.tempArchivePath : `${params.tempArchivePath}.retry-${attempt}`;
		let failure;
		try {
			return await params.runTar(attemptTempArchivePath);
		} catch (err) {
			failure = err;
		}
		if (!hasErrnoCode(failure, "EOF") || attempt === BACKUP_TAR_MAX_ATTEMPTS) {
			const final = failure instanceof Error ? failure : new Error(String(failure));
			const offendingPath = failure?.path;
			const attemptSuffix = `after ${attempt} attempt${attempt === 1 ? "" : "s"}`;
			const suffix = offendingPath ? ` (last offending path: ${offendingPath}, ${attemptSuffix})` : ` (${attemptSuffix})`;
			throw new Error(`Backup archive write failed: ${final.message}${suffix}`, { cause: final });
		}
		const backoff = BACKUP_TAR_BACKOFF_MS[attempt - 1] ?? 0;
		const offendingPath = failure.path;
		params.log?.(`Backup archiver hit a live-write race${offendingPath ? ` on ${offendingPath}` : ""} (attempt ${attempt}/${BACKUP_TAR_MAX_ATTEMPTS}); retrying in ${Math.round(backoff / 1e3)}s.`);
		await sleepFn(backoff);
	}
}
//#endregion
//#region src/infra/backup-tar-walk.ts
/** Open sources before emitting headers so a vanished name cannot leave a partial entry. */
async function* walkBackupTar(params) {
	const noFollow = process.platform === "win32" ? 0 : constants.O_NOFOLLOW;
	const assertDirectory = async ({ sourcePath, identity }) => {
		const current = await fs$1.lstat(sourcePath, { bigint: true });
		if (!current.isDirectory() || !sameFileIdentity(identity, current)) throw new Error(`Backup directory changed during traversal: ${sourcePath}`);
	};
	async function* visit(sourcePath, parent) {
		params.signal?.throwIfAborted();
		params.onProgress(sourcePath);
		if (params.skip(sourcePath)) return;
		let handle;
		let stat;
		let identity;
		let names;
		let linkpath;
		try {
			try {
				identity = await fs$1.lstat(sourcePath, { bigint: true });
				stat = await fs$1.lstat(sourcePath);
				if (parent) await assertDirectory(parent);
				if (!params.filter(sourcePath, stat)) return;
				if (stat.isDirectory()) {
					names = await fs$1.readdir(sourcePath);
					await assertDirectory({
						sourcePath,
						identity
					});
				} else if (stat.isSymbolicLink()) {
					linkpath = await fs$1.readlink(sourcePath);
					if (process.platform === "win32") linkpath = linkpath.replaceAll("\\", "/");
				} else if (stat.isFile()) {
					handle = await fs$1.open(sourcePath, constants.O_RDONLY | noFollow);
					const openedIdentity = await handle.stat({ bigint: true });
					const opened = await handle.stat();
					if (!opened.isFile()) throw new Error(`Backup source changed while opening: ${sourcePath}`);
					if (!noFollow) {
						const current = await fs$1.lstat(sourcePath, { bigint: true }).catch((error) => {
							if (hasErrnoCode(error, "ENOENT")) return;
							throw error;
						});
						if (current?.isSymbolicLink()) throw new Error(`Backup source became a symbolic link while opening: ${sourcePath}`);
						if (!sameFileIdentity(identity, openedIdentity) && (!current?.isFile() || !sameFileIdentity(current, openedIdentity))) throw new Error(`Backup source identity changed while opening: ${sourcePath}`);
					}
					stat = opened;
				} else return;
				if (parent) await assertDirectory(parent);
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT")) throw error;
				params.onVanished(sourcePath);
				return;
			}
			params.signal?.throwIfAborted();
			const directory = stat.isDirectory();
			let mode = (stat.mode & 4095 | 384) & -19;
			if (directory) mode |= (mode & 292) >> 2;
			const header = {
				path: sourcePath,
				type: directory ? "Directory" : stat.isSymbolicLink() ? "SymbolicLink" : "File",
				mode,
				size: handle ? stat.size : 0,
				mtime: directory ? void 0 : stat.mtime,
				linkpath
			};
			params.onEntry(sourcePath, header);
			if (directory) header.path += "/";
			const block = Buffer.alloc(512);
			if (new params.tar.Header(header).encode(block)) yield new params.tar.Pax(header).encode();
			yield block;
			if (handle) {
				let position = 0;
				while (position < stat.size) {
					params.signal?.throwIfAborted();
					const buffer = Buffer.allocUnsafe(Math.min(1048576, stat.size - position));
					const { bytesRead } = await handle.read(buffer, 0, buffer.length, position);
					params.signal?.throwIfAborted();
					if (!bytesRead) throw Object.assign(/* @__PURE__ */ new Error("encountered unexpected EOF"), {
						code: "EOF",
						path: sourcePath
					});
					position += bytesRead;
					params.onProgress(sourcePath, bytesRead);
					yield buffer.subarray(0, bytesRead);
				}
				const padding = (512 - stat.size % 512) % 512;
				if (padding) yield Buffer.alloc(padding);
			}
		} finally {
			await handle?.close();
		}
		for (const name of names ?? []) yield* visit(path.join(sourcePath, name), {
			sourcePath,
			identity
		});
		if (names && !parent) await assertDirectory({
			sourcePath,
			identity
		});
	}
	for (const sourcePath of params.paths) yield* visit(sourcePath);
	yield Buffer.alloc(1024);
}
//#endregion
//#region src/infra/backup-create.ts
const loadTarRuntime = createLazyRuntimeModule(() => import("tar"));
async function resolveOutputPath(params) {
	const basename = buildBackupArchiveBasename(params.nowMs);
	const rawOutput = params.output?.trim();
	if (!rawOutput) {
		const cwd = path.resolve(process.cwd());
		const canonicalCwd = await fs$1.realpath(cwd).catch(() => cwd);
		const defaultDir = params.includedAssets.some((asset) => isPathInside(asset.sourcePath, canonicalCwd)) ? resolveHomeDir() ?? path.dirname(params.stateDir) : cwd;
		return path.resolve(defaultDir, basename);
	}
	const resolved = resolveUserPath(rawOutput);
	if (rawOutput.endsWith("/") || rawOutput.endsWith("\\")) return path.join(resolved, basename);
	try {
		if ((await fs$1.stat(resolved)).isDirectory()) return path.join(resolved, basename);
	} catch {}
	return resolved;
}
function formatBackupOutputFailure(error, outputPath, phase, ownedRoot) {
	const cause = phase === "write" && error instanceof Error ? error.cause : void 0;
	const filesystemError = isErrno(error) ? error : isErrno(cause) ? cause : null;
	if (!filesystemError) return error;
	if (ownedRoot) {
		const failedPath = filesystemError.path;
		if (typeof failedPath !== "string" || !isPathInside(ownedRoot, path.resolve(failedPath))) return error;
	}
	const outputParent = path.dirname(outputPath);
	const retry = "run `openclaw backup create --output <archive>` again.";
	let detail;
	switch (filesystemError.code) {
		case "ENOENT":
			detail = `Backup output directory could not be created: ${outputParent}. Check the path and ${retry}`;
			break;
		case "EACCES":
		case "EPERM":
		case "EROFS":
			detail = `Backup output directory is not writable: ${outputParent}. Check the path and directory permissions, then ${retry}`;
			break;
		case "EEXIST":
		case "ENOTDIR":
			if (phase !== "parent") return error;
			detail = `Backup output parent is not a directory: ${outputParent}. Choose a directory path and ${retry}`;
			break;
		case "ENOSPC":
			detail = `The destination does not have enough free space: ${outputParent}. Free up disk space and ${retry}`;
			break;
		case "EDQUOT":
			detail = `The destination storage quota is exhausted: ${outputParent}. Free up space or choose another path, then ${retry}`;
			break;
		default: detail = `The output path could not be prepared: ${outputParent}. Check the path and filesystem, then ${retry}`;
	}
	return new Error(`Backup archive creation failed: ${outputPath}. ${detail}`, { cause: error });
}
async function assertOutputPathReady(outputPath) {
	try {
		await fs$1.access(outputPath);
		throw new Error(`Refusing to overwrite existing backup archive: ${outputPath}`);
	} catch (error) {
		const code = error?.code;
		if (code === "ENOENT" || code === "ENOTDIR") return;
		throw formatBackupOutputFailure(error, outputPath, "parent");
	}
}
async function prepareBackupOutputParent(outputPath) {
	try {
		await fs$1.mkdir(path.dirname(outputPath), { recursive: true });
	} catch (error) {
		throw formatBackupOutputFailure(error, outputPath, "parent");
	}
}
async function chooseBackupTempRoot(params) {
	const systemTmp = os.tmpdir();
	const canonicalSystemTmp = await canonicalizePathForContainment(systemTmp);
	if (!params.assets.some((asset) => isPathInside(asset.sourcePath, canonicalSystemTmp))) return systemTmp;
	const fallback = path.dirname(params.outputPath);
	const canonicalFallback = await canonicalizePathForContainment(fallback);
	const fallbackInsideAsset = params.assets.find((asset) => isPathInside(asset.sourcePath, canonicalFallback));
	if (fallbackInsideAsset) throw new Error(`Backup temp root cannot be placed outside every source path: ${systemTmp} and ${fallback} both overlap ${fallbackInsideAsset.sourcePath}.`);
	return fallback;
}
function buildManifest(result, plan) {
	return {
		schemaVersion: 1,
		createdAt: result.createdAt,
		archiveRoot: result.archiveRoot,
		runtimeVersion: resolveRuntimeServiceVersion(),
		platform: process.platform,
		nodeVersion: process.version,
		options: {
			includeWorkspace: result.includeWorkspace,
			onlyConfig: result.onlyConfig
		},
		paths: {
			stateDir: plan.resources.stateDir,
			configPath: plan.configPath,
			oauthDir: plan.oauthDir,
			workspaceDirs: plan.workspaceDirs,
			...result.agentRoots ? { agentRoots: [...result.agentRoots] } : {}
		},
		assets: result.assets.map((asset) => ({
			kind: asset.kind,
			sourcePath: asset.sourcePath,
			archivePath: asset.archivePath
		})),
		skipped: result.skipped.map((entry) => ({
			kind: entry.kind,
			sourcePath: entry.sourcePath,
			reason: entry.reason,
			coveredBy: entry.coveredBy
		}))
	};
}
const MAX_LEGACY_AUDIT_CAPTURE_ATTEMPTS = 3;
async function createConsistentStateSnapshotPlan(params) {
	const captureSqlite = (tempDir, audit) => createBackupSqliteSnapshotPlan({
		resources: params.resources,
		tempDir,
		legacyAuditSnapshots: audit?.snapshots ?? [],
		...audit ? { legacyAuditDatabaseWitness: audit.databaseWitness } : {}
	});
	if (params.onlyConfig || !params.stateDir) return {
		legacyAuditSnapshots: [],
		stateSqliteBackup: params.onlyConfig ? {
			inventory: sealBackupResourceInventory(params.resources, []),
			snapshots: [],
			discoveredSourcePaths: /* @__PURE__ */ new Set()
		} : await captureSqlite(params.tempDir)
	};
	const stateDir = params.stateDir;
	if (!await hasLegacyAuditBackupSources(stateDir)) {
		const fastAttemptDir = path.join(params.tempDir, "state-snapshot-no-legacy");
		await fs$1.mkdir(fastAttemptDir, { recursive: true });
		const stateSqliteBackup = await captureSqlite(fastAttemptDir);
		if (!await hasLegacyAuditBackupSources(stateDir)) return {
			legacyAuditSnapshots: [],
			stateSqliteBackup
		};
		await fs$1.rm(fastAttemptDir, {
			recursive: true,
			force: true
		});
	}
	let lastStateChangeMessage;
	for (let attempt = 0; attempt < MAX_LEGACY_AUDIT_CAPTURE_ATTEMPTS; attempt += 1) {
		const attemptDir = path.join(params.tempDir, `state-snapshot-attempt-${attempt + 1}`);
		const verificationDir = path.join(attemptDir, "legacy-verification");
		await fs$1.mkdir(attemptDir, { recursive: true });
		try {
			const firstCapture = await withLegacyAuditMigrationLease(stateDir, () => createLegacyAuditBackupCapture({
				stateDir,
				tempDir: attemptDir
			}));
			const stateSqliteBackup = await captureSqlite(attemptDir, firstCapture);
			await fs$1.mkdir(verificationDir, { recursive: true });
			const secondCapture = await withLegacyAuditMigrationLease(stateDir, () => createLegacyAuditBackupCapture({
				stateDir,
				tempDir: verificationDir
			}));
			if (!legacyAuditBackupCapturesMatch(firstCapture, secondCapture)) throw new LegacyAuditBackupStateChangedError();
			await fs$1.rm(verificationDir, {
				recursive: true,
				force: true
			});
			return {
				legacyAuditSnapshots: firstCapture.snapshots,
				stateSqliteBackup
			};
		} catch (error) {
			await fs$1.rm(attemptDir, {
				recursive: true,
				force: true
			});
			if (!(error instanceof LegacyAuditBackupStateChangedError)) throw error;
			lastStateChangeMessage = error.message;
		}
	}
	throw new LegacyAuditBackupStateChangedError(`${lastStateChangeMessage ?? "Legacy audit state changed while backup was capturing it"}; retry backup after legacy audit migration settles`);
}
async function createBackupArchive(opts = {}) {
	return await withCommandProcessScope(() => createBackupArchiveInScope(opts), opts.signal);
}
async function createBackupArchiveInScope(opts) {
	const nowMs = resolveDateTimestampMs(opts.nowMs);
	const archiveRoot = buildBackupArchiveRoot(nowMs);
	const onlyConfig = Boolean(opts.onlyConfig);
	const includeWorkspace = onlyConfig ? false : opts.includeWorkspace ?? true;
	const plan = await resolveBackupPlanFromDisk({
		includeWorkspace,
		onlyConfig,
		nowMs
	});
	const outputPath = await resolveOutputPath({
		output: opts.output,
		nowMs,
		includedAssets: plan.included,
		stateDir: plan.stateDir
	});
	if (plan.included.length === 0) throw new Error(onlyConfig ? "No OpenClaw config file was found to back up." : "No local OpenClaw state was found to back up.");
	const canonicalOutputPath = await canonicalizePathForContainment(outputPath);
	const overlappingAsset = plan.included.find((asset) => isPathInside(asset.sourcePath, canonicalOutputPath));
	if (overlappingAsset) throw new Error(`Backup output must not be written inside a source path: ${outputPath} is inside ${overlappingAsset.sourcePath}`);
	if (!opts.dryRun) await assertOutputPathReady(outputPath);
	const createdAt = new Date(nowMs).toISOString();
	const stateAsset = plan.included.find((asset) => asset.kind === "state");
	const stateDir = plan.resources.stateDir;
	const result = {
		createdAt,
		archiveRoot,
		archivePath: outputPath,
		dryRun: Boolean(opts.dryRun),
		includeWorkspace,
		onlyConfig,
		verified: false,
		assets: plan.included,
		...onlyConfig ? {} : { agentRoots: plan.resources.agentRoots.map(({ agentId, sourcePath }) => ({
			agentId,
			sourcePath
		})) },
		skipped: plan.skipped,
		skippedVolatileCount: 0
	};
	if (opts.dryRun) return result;
	await prepareBackupOutputParent(outputPath);
	const tempRoot = await chooseBackupTempRoot({
		assets: result.assets,
		outputPath
	});
	await fs$1.mkdir(tempRoot, { recursive: true });
	const maintenance = await maintainBackupScratch({
		roots: [tempRoot],
		repair: true,
		log: opts.log
	});
	if (maintenance.warnings.length) result.warnings = maintenance.warnings;
	for (const directory of maintenance.reclaimed) opts.log?.(`Removed abandoned backup scratch: ${directory}`);
	const scratch = await createBackupScratchDirectory(tempRoot);
	const tempDir = scratch.directory;
	let publication;
	try {
		publication = await createBackupArchivePublication(outputPath);
	} catch (error) {
		await finishBackupScratch(scratch, opts.log);
		throw formatBackupOutputFailure(error, outputPath, "publication");
	}
	const tempArchivePath = publication.tempArchivePath;
	let snapshotFacts = [];
	try {
		const configRemaps = await stageBackupConfigCapture(plan.configCapture, tempDir);
		const { legacyAuditSnapshots, stateSqliteBackup } = await createConsistentStateSnapshotPlan({
			resources: plan.resources,
			stateDir: stateAsset?.sourcePath,
			tempDir,
			onlyConfig
		});
		const inventory = stateSqliteBackup.inventory;
		snapshotFacts = describeCapturedBackupSqliteSnapshots(inventory, stateSqliteBackup.snapshots.map((snapshot) => snapshot.archiveSourcePath));
		const sourcePathRemaps = new Map(configRemaps);
		const skippedStateSourcePaths = new Set(configRemaps.values());
		if (plan.configCapture?.files.length === 0) {
			skippedStateSourcePaths.add(path.resolve(plan.configPath));
			skippedStateSourcePaths.add(await canonicalizePathForContainment(plan.configPath));
		}
		for (const snapshot of [...stateSqliteBackup.snapshots, ...legacyAuditSnapshots]) {
			sourcePathRemaps.set(path.resolve(snapshot.sourcePath), snapshot.archiveSourcePath);
			for (const skippedSourcePath of snapshot.skippedSourcePaths) skippedStateSourcePaths.add(skippedSourcePath);
		}
		const requiredSourcePaths = /* @__PURE__ */ new Set([...sourcePathRemaps.keys(), ...result.assets.map((asset) => asset.sourcePath)]);
		const externalSymbolicLinks = [];
		const tar = await loadTarRuntime();
		const gatewayLockDir = resolveGatewayLockDir(plan.stateDir);
		const skippedEntries = /* @__PURE__ */ new Map();
		const opaqueSqliteSourcePaths = /* @__PURE__ */ new Map();
		const tarFilter = (entryPath, entryStat) => {
			const resolvedEntryPath = path.resolve(entryPath);
			const inventoryPath = sourcePathRemaps.get(resolvedEntryPath) ?? resolvedEntryPath;
			if (isUpdateCapturePath(inventoryPath, plan.stateDir)) return false;
			const isDirectory = entryStat.isDirectory();
			if (!onlyConfig && !(isDirectory || entryStat.isSymbolicLink() ? inventory.isTraversable(inventoryPath) : inventory.isIncluded(inventoryPath))) return false;
			if (isPathInside(gatewayLockDir, resolvedEntryPath)) return false;
			if (stateAsset && isLegacyAuditMigrationBackupPath(resolvedEntryPath, stateAsset.sourcePath)) return false;
			const sqliteSourceKind = onlyConfig ? void 0 : classifyBackupSqliteSource(resolvedEntryPath, inventory);
			if (sqliteSourceKind === "opaque-skip") {
				opaqueSqliteSourcePaths.set(resolvedEntryPath, "skipped");
				return false;
			}
			if (sqliteSourceKind === "excluded") return false;
			if (sqliteSourceKind === "sqlite" && (entryStat.isFile() || entryStat.isSymbolicLink())) throw new Error(`SQLite state appeared after snapshot discovery: ${entryPath}. Retry backup so it can be snapshotted.`);
			if (sqliteSourceKind === "opaque" && entryStat.isFile()) opaqueSqliteSourcePaths.set(resolvedEntryPath, "archived");
			return true;
		};
		const completedArchive = await writeTarArchiveWithRetry({
			tempArchivePath,
			log: opts.log,
			runTar: async (attemptTempArchivePath) => {
				for (const [sourcePath, reason] of skippedEntries) if (reason === "volatile") skippedEntries.delete(sourcePath);
				externalSymbolicLinks.length = 0;
				opaqueSqliteSourcePaths.clear();
				const prepared = await writeArchiveStreamToFile({
					archivePath: attemptTempArchivePath,
					createArchiveStream: (reportProgress, signal) => appendBackupManifest(walkBackupTar({
						tar,
						signal,
						paths: [...requiredSourcePaths],
						skip: (sourcePath) => {
							if (!requiredSourcePaths.has(sourcePath) && inventory.isVolatile(sourcePath)) {
								skippedEntries.set(sourcePath, "volatile");
								return true;
							}
							return skippedStateSourcePaths.has(sourcePath) || stateSqliteBackup.discoveredSourcePaths.has(sourcePath);
						},
						filter: tarFilter,
						onVanished: (sourcePath) => {
							if (requiredSourcePaths.has(sourcePath)) throw new Error(`Required backup source disappeared: ${sourcePath}`);
							opaqueSqliteSourcePaths.delete(sourcePath);
							skippedEntries.set(sourcePath, "vanished");
						},
						onProgress: (entryPath, bytes) => reportProgress({
							phase: bytes === void 0 ? "traversal" : "raw",
							entryPath,
							bytes
						}),
						onEntry: (sourcePath, header) => {
							skippedEntries.delete(sourcePath);
							const archiveEntryPath = buildBackupArchivePath(archiveRoot, sourcePathRemaps.get(sourcePath) ?? sourcePath);
							if (header.type === "SymbolicLink") {
								const { external, ...link } = recordArchiveSymbolicLink({
									archiveRoot,
									entryPath: archiveEntryPath,
									linkpath: header.linkpath,
									platform: process.platform,
									state: {
										sourcePath: stateDir,
										archivePath: buildBackupArchivePath(archiveRoot, stateDir)
									},
									hasExternalLinkReport: true,
									assets: result.assets
								});
								if (external) externalSymbolicLinks.push(link);
							}
							header.path = archiveEntryPath;
						}
					}), () => {
						result.skipped = [...plan.skipped, ...[...skippedEntries].map(([sourcePath, reason]) => ({
							kind: "entry",
							sourcePath,
							displayPath: sourcePath,
							reason
						}))];
						const manifest = buildManifest({
							...result,
							skipped: plan.skipped
						}, plan);
						manifest.externalSymbolicLinks = externalSymbolicLinks;
						manifest.sqliteSnapshots = snapshotFacts.map((snapshot) => snapshot.role === "agent" ? {
							sourcePath: snapshot.sourcePath,
							role: "agent",
							agentId: snapshot.agentId
						} : {
							sourcePath: snapshot.sourcePath,
							role: "global"
						});
						const contents = Buffer.from(JSON.stringify(manifest, null, 2) + "\n");
						const sizeError = backupManifestSizeError(contents.length);
						if (sizeError) throw sizeError;
						const header = Buffer.alloc(512);
						new tar.Header({
							path: archiveRoot + "/manifest.json",
							type: "File",
							mode: 420,
							size: contents.length
						}).encode(header);
						return Buffer.concat([
							header,
							contents,
							Buffer.alloc((512 - contents.length % 512) % 512 + 1024)
						]);
					}),
					onPartialArchive: (partialArchive) => {
						publication.pendingCleanupArchives.push(partialArchive);
					}
				});
				try {
					await plan.configCapture?.assertRootAlias?.();
				} catch (error) {
					if (!removePreparedBackupArchive(prepared)) publication.pendingCleanupArchives.push(prepared);
					throw error;
				}
				return prepared;
			}
		}).catch((error) => {
			throw formatBackupOutputFailure(error, outputPath, "write", publication.stagingDir);
		});
		const skippedVolatileCount = [...skippedEntries.values()].filter((reason) => reason === "volatile").length;
		result.skippedVolatileCount = skippedVolatileCount;
		const vanishedWarnings = [...skippedEntries].filter(([, reason]) => reason === "vanished").map(([sourcePath]) => `Skipped vanished entry (ENOENT): ${sourcePath}`);
		const archiveWarnings = [...[...opaqueSqliteSourcePaths].toSorted(([left], [right]) => left.localeCompare(right)).map(([sourcePath, action]) => action === "skipped" ? `Skipped unresolvable opaque SQLite link: ${sourcePath}` : `SQLite file archived as opaque bytes without a live snapshot or integrity checks: ${sourcePath}`), ...vanishedWarnings];
		if (archiveWarnings.length) result.warnings = [...result.warnings ?? [], ...archiveWarnings];
		if (externalSymbolicLinks.length) result.externalSymbolicLinks = externalSymbolicLinks;
		if (skippedVolatileCount > 0) opts.log?.(`Backup skipped ${skippedVolatileCount} volatile file${skippedVolatileCount === 1 ? "" : "s"} (live sessions, cron logs, queues, managed runtime paths, sockets, pid/tmp).`);
		try {
			await publishPreparedBackupArchive({
				plan: publication,
				prepared: completedArchive,
				log: opts.log
			});
		} catch (error) {
			throw formatBackupOutputFailure(error, outputPath, "publication");
		}
	} finally {
		try {
			await cleanupBackupArchivePublication(publication, opts.log);
		} finally {
			const warning = await finishBackupScratch(scratch, opts.log);
			if (warning) result.warnings = [...result.warnings ?? [], warning];
		}
	}
	opts.onSqliteSnapshots?.(snapshotFacts);
	return result;
}
//#endregion
export { createBackupArchive as t };
