import { d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { f as backupNodeSqliteDatabase } from "./sqlite-readonly-location-BpMwSm5l.mjs";
import { c as createPrivateSqliteTempDirectory } from "./sqlite-snapshot-staging-BNvNaOwn.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-B1TtVu8E.mjs";
import { i as withSqliteSnapshotSource } from "./sqlite-snapshot-source-Bu0_ELYu.mjs";
import { i as sameFileMutationFingerprint, n as hashFileDescriptorSync, t as copyFileHandle } from "./file-descriptor-C_0BsNDD.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-B4lhf3Iz.mjs";
import { a as publishFileExclusive, c as sha256File, i as pinDirectory, l as syncDirectory, n as getPublishFileExclusiveFailureDetails, r as isHardlinkFallbackError, s as requireDirectorySync } from "./directory-durability-BKe2aOQN.mjs";
import { t as loadSqliteVecExtension } from "./sqlite-vec-BskpG3v_.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
//#region src/infra/sqlite-snapshot.ts
async function assertRegularSourceFile(sourcePath, requireNonEmptySource) {
	const stat = await fs$1.lstat(sourcePath);
	if (!stat.isFile()) throw new Error(`SQLite snapshot source must be a regular file: ${sourcePath}`);
	if (requireNonEmptySource && stat.size === 0) throw new Error(`SQLite snapshot source must not be empty: ${sourcePath}`);
}
async function assertTargetAbsent(targetPath) {
	try {
		await fs$1.lstat(targetPath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	throw new Error(`SQLite snapshot target already exists: ${targetPath}`);
}
async function copyFileExclusive(source, targetPath) {
	const sourceFingerprint = await readMutationFingerprint(source);
	let target;
	let targetIdentity;
	try {
		target = await fs$1.open(targetPath, "wx+", 384);
		targetIdentity = await target.stat();
		const hash = createHash("sha256");
		const offset = await copyFileHandle(source, target, { onChunk: (chunk) => {
			hash.update(chunk);
		} });
		await assertMutationFingerprintUnchanged(source, sourceFingerprint, targetPath);
		await target.sync();
		const currentIdentity = await fs$1.lstat(targetPath);
		if (!sameFileIdentity(targetIdentity, currentIdentity)) throw new Error(`SQLite snapshot target changed during publication: ${targetPath}`);
		return {
			content: {
				sha256: hash.digest("hex"),
				sizeBytes: offset
			},
			identity: currentIdentity
		};
	} catch (error) {
		if (targetIdentity) {
			await target?.close().catch(() => void 0);
			target = void 0;
			removePublishedTargetIfOwned(targetPath, targetIdentity);
		}
		throw error;
	} finally {
		await target?.close().catch(() => void 0);
	}
}
async function readMutationFingerprint(handle) {
	const stat = await handle.stat({ bigint: true });
	return {
		birthtimeNs: stat.birthtimeNs,
		ctimeNs: stat.ctimeNs,
		dev: stat.dev,
		ino: stat.ino,
		mtimeNs: stat.mtimeNs,
		size: stat.size
	};
}
async function assertMutationFingerprintUnchanged(handle, expected, filePath) {
	const current = await readMutationFingerprint(handle);
	if (!sameFileMutationFingerprint(current, expected)) throw new Error(`SQLite snapshot file changed while reading: ${filePath}`);
}
async function syncFile(filePath) {
	const handle = await fs$1.open(filePath, "r+");
	try {
		await handle.sync();
	} finally {
		await handle.close();
	}
}
async function assertOpenFileIdentity(handle, filePath, expectedIdentity) {
	const openedIdentity = await handle.stat();
	const currentIdentity = await fs$1.lstat(filePath);
	if (!openedIdentity.isFile() || !currentIdentity.isFile() || !sameFileIdentity(expectedIdentity, openedIdentity) || !sameFileIdentity(expectedIdentity, currentIdentity)) throw new Error(`SQLite snapshot file changed: ${filePath}`);
}
async function hashPublishedFile(filePath, expectedIdentity) {
	const handle = await fs$1.open(filePath, "r");
	try {
		return await hashOpenPublishedFile(handle, filePath, expectedIdentity);
	} finally {
		await handle.close();
	}
}
async function hashOpenPublishedFile(handle, filePath, expectedIdentity) {
	await assertOpenFileIdentity(handle, filePath, expectedIdentity);
	const fingerprint = await readMutationFingerprint(handle);
	const { digest, bytes } = await sha256File(handle);
	await assertMutationFingerprintUnchanged(handle, fingerprint, filePath);
	await assertOpenFileIdentity(handle, filePath, expectedIdentity);
	return {
		sha256: digest,
		sizeBytes: bytes
	};
}
function assertPublishedFileIdentitySync(filePath, expectedIdentity) {
	const currentIdentity = fs.lstatSync(filePath);
	if (!currentIdentity.isFile() || !sameFileIdentity(expectedIdentity, currentIdentity) || expectedIdentity.size !== currentIdentity.size || expectedIdentity.mtimeMs !== currentIdentity.mtimeMs || expectedIdentity.ctimeMs !== currentIdentity.ctimeMs || expectedIdentity.birthtimeMs !== currentIdentity.birthtimeMs) throw new Error(`SQLite snapshot file changed: ${filePath}`);
}
function assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity) {
	const openedIdentity = fs.fstatSync(fileDescriptor);
	const currentIdentity = fs.lstatSync(filePath);
	if (!openedIdentity.isFile() || !currentIdentity.isFile() || !sameFileIdentity(expectedIdentity, openedIdentity) || !sameFileIdentity(expectedIdentity, currentIdentity)) throw new Error(`SQLite snapshot file changed: ${filePath}`);
}
function hashPublishedFileSync(filePath, expectedIdentity) {
	const fileDescriptor = fs.openSync(filePath, "r");
	try {
		assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity);
		const initialStat = fs.fstatSync(fileDescriptor, { bigint: true });
		const initialFingerprint = {
			birthtimeNs: initialStat.birthtimeNs,
			ctimeNs: initialStat.ctimeNs,
			dev: initialStat.dev,
			ino: initialStat.ino,
			mtimeNs: initialStat.mtimeNs,
			size: initialStat.size
		};
		const content = hashFileDescriptorSync(fileDescriptor);
		const finalStat = fs.fstatSync(fileDescriptor, { bigint: true });
		const finalFingerprint = {
			birthtimeNs: finalStat.birthtimeNs,
			ctimeNs: finalStat.ctimeNs,
			dev: finalStat.dev,
			ino: finalStat.ino,
			mtimeNs: finalStat.mtimeNs,
			size: finalStat.size
		};
		if (!sameFileMutationFingerprint(initialFingerprint, finalFingerprint)) throw new Error(`SQLite snapshot file changed while reading: ${filePath}`);
		assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity);
		return content;
	} finally {
		fs.closeSync(fileDescriptor);
	}
}
function assertExpectedContent(actual, expected, filePath) {
	if (actual.sizeBytes !== expected.sizeBytes) throw new Error(`SQLite snapshot size mismatch for ${filePath}: expected ${expected.sizeBytes}, got ${actual.sizeBytes}`);
	if (actual.sha256 !== expected.sha256) throw new Error(`SQLite snapshot hash mismatch for ${filePath}: expected ${expected.sha256}, got ${actual.sha256}`);
}
function removePublishedTargetIfOwned(filePath, expectedIdentity, requireFingerprint = false) {
	let currentIdentity;
	try {
		currentIdentity = fs.lstatSync(filePath);
	} catch {
		return false;
	}
	const fingerprintMatches = !requireFingerprint || expectedIdentity.size === currentIdentity.size && expectedIdentity.mtimeMs === currentIdentity.mtimeMs && expectedIdentity.ctimeMs === currentIdentity.ctimeMs && expectedIdentity.birthtimeMs === currentIdentity.birthtimeMs;
	const unknownIdentity = process.platform === "win32" && [
		expectedIdentity.dev,
		expectedIdentity.ino,
		currentIdentity.dev,
		currentIdentity.ino
	].some((value) => value === 0);
	if (!currentIdentity.isFile() || unknownIdentity || !sameFileIdentity(expectedIdentity, currentIdentity) || !fingerprintMatches) return false;
	try {
		fs.unlinkSync(filePath);
		return true;
	} catch {
		return false;
	}
}
function sameFileStatFingerprint(left, right) {
	return sameFileIdentity(left, right) && left.size === right.size && left.mtimeMs === right.mtimeMs && left.birthtimeMs === right.birthtimeMs;
}
function assertSynchronousCallbackResult(result, label) {
	if (result && (typeof result === "object" || typeof result === "function") && typeof result.then === "function") {
		Promise.resolve(result).catch(() => void 0);
		throw new Error(`${label} must be synchronous.`);
	}
}
/**
* Publish the exact bytes of one already-verified SQLite file without reopening
* its pathname during the copy. The target is always created exclusively.
*/
async function publishVerifiedSqliteFile(options) {
	await assertTargetAbsent(options.targetPath);
	const targetDirectory = path.resolve(path.dirname(options.targetPath));
	const targetDirectoryPin = await pinDirectory(targetDirectory, { label: "SQLite publication directory" });
	const targetDirectoryReceipt = targetDirectoryPin.receipt;
	let stagingDir;
	try {
		stagingDir = await createPrivateSqliteTempDirectory(targetDirectory, `.sqlite-publish-${randomUUID()}-`);
	} catch (error) {
		await targetDirectoryPin.close().catch(() => void 0);
		throw error;
	}
	const stagedPath = path.join(stagingDir, "database.sqlite");
	let stagingIdentity;
	let source;
	let target;
	let targetPinFileDescriptor;
	let publishedIdentity;
	try {
		stagingIdentity = await fs$1.lstat(stagingDir);
		await fs$1.chmod(stagingDir, 448);
		source = await fs$1.open(options.sourcePath, "r");
		await assertOpenFileIdentity(source, options.sourcePath, options.sourceIdentity);
		const staged = await copyFileExclusive(source, stagedPath);
		const expectedContent = options.expectedContent;
		assertExpectedContent(staged.content, expectedContent, options.targetPath);
		await source.close();
		source = void 0;
		await options.validatePublished?.(stagedPath);
		assertExpectedContent(await hashPublishedFile(stagedPath, staged.identity), expectedContent, options.targetPath);
		await options.beforePublish?.();
		await assertTargetAbsent(options.targetPath);
		const currentStagedIdentity = await fs$1.lstat(stagedPath);
		if (!sameFileStatFingerprint(staged.identity, currentStagedIdentity)) throw new Error(`SQLite snapshot staging file changed during publication: ${stagedPath}`);
		try {
			const publication = await publishFileExclusive({
				sourcePath: stagedPath,
				targetPath: options.targetPath,
				expectedSourceIdentity: currentStagedIdentity,
				strategy: options.requireAtomicPublication ? "link-required" : "link-or-copy"
			});
			publishedIdentity = publication.identity;
			requireDirectorySync(publication.directorySync, "File publication directory");
		} catch (error) {
			const details = getPublishFileExclusiveFailureDetails(error);
			const stagedAfterFailure = details?.targetCreated ? await fs$1.lstat(stagedPath).catch(() => void 0) : void 0;
			const stagedPathChanged = !stagedAfterFailure || !sameFileStatFingerprint(staged.identity, stagedAfterFailure);
			if (options.requireAtomicPublication && isHardlinkFallbackError(error)) throw new Error(`Atomic SQLite publication requires hard-link support in ${targetDirectory}.`, { cause: error });
			if (details?.targetCreated) {
				if (stagedPathChanged) throw new Error(`SQLite snapshot staging file changed during publication: ${options.targetPath}`, { cause: error });
				throw new Error(`SQLite snapshot target changed during publication: ${options.targetPath}`, { cause: error });
			}
			throw error;
		}
		if (!publishedIdentity) throw new Error(`SQLite snapshot target was not published: ${options.targetPath}`);
		const initialPublishedIdentity = publishedIdentity;
		target = await fs$1.open(options.targetPath, "r");
		await assertOpenFileIdentity(target, options.targetPath, initialPublishedIdentity);
		await fs$1.unlink(stagedPath);
		const expectedIdentity = await target.stat();
		publishedIdentity = expectedIdentity;
		assertExpectedContent(await hashOpenPublishedFile(target, options.targetPath, expectedIdentity), expectedContent, options.targetPath);
		await fs$1.rmdir(stagingDir);
		requireDirectorySync(await syncDirectory(targetDirectoryReceipt), "SQLite publication directory");
		await target.close();
		target = void 0;
		targetPinFileDescriptor = fs.openSync(options.targetPath, "r");
		assertOpenFileIdentitySync(targetPinFileDescriptor, options.targetPath, expectedIdentity);
		const guard = {
			assertTargetMatchesExpectedContent: (finalCheck) => {
				assertExpectedContent(hashPublishedFileSync(options.targetPath, expectedIdentity), expectedContent, options.targetPath);
				assertSynchronousCallbackResult(finalCheck?.(), "SQLite publication final check");
				assertPublishedFileIdentitySync(options.targetPath, expectedIdentity);
			},
			assertTargetUnchanged: (finalCheck) => {
				assertPublishedFileIdentitySync(options.targetPath, expectedIdentity);
				assertSynchronousCallbackResult(finalCheck?.(), "SQLite publication final check");
				assertPublishedFileIdentitySync(options.targetPath, expectedIdentity);
			}
		};
		if (options.afterPublish) assertSynchronousCallbackResult(options.afterPublish(guard), "SQLite after-publication guard");
		else guard.assertTargetUnchanged();
		fs.closeSync(targetPinFileDescriptor);
		targetPinFileDescriptor = void 0;
	} catch (error) {
		if (target && publishedIdentity) {
			const openedIdentity = await target.stat().catch(() => void 0);
			if (openedIdentity && sameFileIdentity(openedIdentity, publishedIdentity)) publishedIdentity = openedIdentity;
		}
		if (publishedIdentity) {
			if (removePublishedTargetIfOwned(options.targetPath, publishedIdentity, true)) await syncDirectory(targetDirectoryReceipt).catch(() => void 0);
		}
		if (stagingIdentity) await removePublicationStagingDirectory(stagingDir, stagingIdentity).catch(() => void 0);
		else await fs$1.rmdir(stagingDir).catch(() => void 0);
		throw error;
	} finally {
		if (targetPinFileDescriptor !== void 0) fs.closeSync(targetPinFileDescriptor);
		if (target) await target.close().catch(() => void 0);
		if (source) await source.close().catch(() => void 0);
		await targetDirectoryPin.close().catch(() => void 0);
	}
}
async function removePublicationStagingDirectory(stagingDir, expectedIdentity) {
	const currentIdentity = await fs$1.lstat(stagingDir).catch(() => void 0);
	if (!currentIdentity) return;
	if (!currentIdentity.isDirectory() || !sameFileIdentity(expectedIdentity, currentIdentity)) throw new Error(`SQLite publication staging directory changed: ${stagingDir}`);
	const entries = await fs$1.readdir(stagingDir, { withFileTypes: true });
	if (entries.length > 1 || entries.some((entry) => entry.name !== "database.sqlite" || !entry.isFile())) throw new Error(`SQLite publication staging directory has unexpected contents: ${stagingDir}`);
	const stagedEntry = entries[0];
	if (stagedEntry) await fs$1.unlink(path.join(stagingDir, stagedEntry.name));
	await fs$1.rmdir(stagingDir);
}
/**
* Compact one SQLite database into a fresh private file and verify the result.
*
* The source and output both receive full structural, index, and foreign-key
* checks. Only a fully verified, synced snapshot is published to the target.
*/
async function createVerifiedSqliteSnapshot(options) {
	await assertRegularSourceFile(options.sourcePath, options.requireNonEmptySource === true);
	await assertTargetAbsent(options.targetPath);
	const stagingDir = await createPrivateSqliteTempDirectory(path.dirname(options.targetPath), ".sqlite-snapshot-");
	await fs$1.chmod(stagingDir, 448);
	const stagedPath = path.join(stagingDir, "database.sqlite");
	let stagedIdentity;
	try {
		await withSqliteSnapshotSource(options.sourcePath, async (snapshotSourcePath) => {
			await fs$1.rm(stagedPath, { force: true });
			const source = openNodeSqliteDatabase(snapshotSourcePath, {
				allowExtension: true,
				readOnly: true
			});
			try {
				source.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF; BEGIN;");
				try {
					source.prepare("PRAGMA schema_version;").get();
					await loadSqliteVecExtension({ db: source });
					assertSqliteIntegrity(source, options.sourcePath);
					options.validate?.(source, options.sourcePath);
					await backupNodeSqliteDatabase(source, stagedPath);
				} finally {
					source.exec("ROLLBACK;");
				}
			} finally {
				if (source.isOpen) source.close();
			}
		});
		await fs$1.chmod(stagedPath, 384);
		const snapshot = openNodeSqliteDatabase(stagedPath, { allowExtension: true });
		try {
			snapshot.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
			await loadSqliteVecExtension({ db: snapshot });
			snapshot.exec("PRAGMA journal_mode = DELETE;");
			if (options.transform) await options.transform(snapshot);
			if (!options.preserveRowIds) snapshot.exec("VACUUM;");
			assertSqliteIntegrity(snapshot, options.targetPath);
			options.validate?.(snapshot, options.targetPath);
			const userVersion = readSqliteUserVersion(snapshot);
			snapshot.close();
			await syncFile(stagedPath);
			stagedIdentity = await fs$1.lstat(stagedPath);
			const expectedContent = await hashPublishedFile(stagedPath, stagedIdentity);
			await publishVerifiedSqliteFile({
				sourceIdentity: stagedIdentity,
				sourcePath: stagedPath,
				targetPath: options.targetPath,
				expectedContent,
				beforePublish: options.beforePublish,
				afterPublish: options.afterPublish,
				validatePublished: async (publishedPath) => {
					const published = openNodeSqliteDatabase(publishedPath, {
						allowExtension: true,
						readOnly: true
					});
					try {
						published.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
						await loadSqliteVecExtension({ db: published });
						assertSqliteIntegrity(published, options.targetPath);
						options.validate?.(published, options.targetPath);
						const publishedUserVersion = readSqliteUserVersion(published);
						if (publishedUserVersion !== userVersion) throw new Error(`SQLite snapshot user_version changed during publication: expected ${userVersion}, got ${publishedUserVersion}`);
					} finally {
						published.close();
					}
				}
			});
			return {
				path: options.targetPath,
				userVersion
			};
		} finally {
			if (snapshot.isOpen) snapshot.close();
		}
	} catch (error) {
		throw new Error(`SQLite database cannot be snapshotted safely: ${options.sourcePath}. ${formatErrorMessage(error)}`, { cause: error });
	} finally {
		await fs$1.rm(stagingDir, {
			force: true,
			recursive: true
		}).catch(() => void 0);
	}
}
//#endregion
export { publishVerifiedSqliteFile as n, createVerifiedSqliteSnapshot as t };
