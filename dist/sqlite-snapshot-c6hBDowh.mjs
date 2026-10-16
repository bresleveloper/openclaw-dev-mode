import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { f as copySqliteFile, i as prepareSqliteReadOnlyCopyInProcess, o as prepareSqliteReadOnlyLocationInProcess, p as backupNodeSqliteDatabase } from "./sqlite-readonly-location-OdGkIPCl.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { f as createPrivateSqliteTempDirectory } from "./sqlite-snapshot-staging-BIgaAYlp.mjs";
import { h as withPreparedSqliteSnapshot } from "./sqlite-readonly-location-cleanup-CPS8QEIp.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { a as withSqliteSnapshotSource, t as prepareSqliteReadOnlyLocation } from "./sqlite-snapshot-source-BPapZs5n.mjs";
import { a as publishFileExclusive, c as sha256File, i as pinDirectory, l as syncDirectory, n as getPublishFileExclusiveFailureDetails, r as isHardlinkFallbackError, s as requireDirectorySync } from "./directory-durability-CqSvP1tc.mjs";
import { i as sameFileMutationFingerprint, n as hashFileDescriptorSync } from "./file-descriptor-B4yBUiAP.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-GtqcmwG3.mjs";
import { t as loadSqliteVecExtension } from "./sqlite-vec-BcbJNyja.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { sameFileIdentity } from "@openclaw/fs-safe/advanced";
//#region src/infra/sqlite-snapshot-file.ts
function assertExpectedContent(actual, expected, filePath) {
	if (actual.sizeBytes !== expected.sizeBytes) throw new Error(`SQLite snapshot size mismatch for ${filePath}: expected ${expected.sizeBytes}, got ${actual.sizeBytes}`);
	if (actual.sha256 !== expected.sha256) throw new Error(`SQLite snapshot hash mismatch for ${filePath}: expected ${expected.sha256}, got ${actual.sha256}`);
}
function assertPublishedFileIdentitySync(filePath, expectedIdentity, expectedContent) {
	const currentIdentity = fs.lstatSync(filePath);
	if (!currentIdentity.isFile() || !sameFileStatFingerprint(expectedIdentity, currentIdentity)) throw new Error(`SQLite snapshot file changed: ${filePath}`);
	if (expectedIdentity.mtimeMs !== currentIdentity.mtimeMs || expectedIdentity.ctimeMs !== currentIdentity.ctimeMs) assertExpectedContent(hashPublishedFileSync(filePath, expectedIdentity), expectedContent, filePath);
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
		const content = hashFileDescriptorSync(fileDescriptor);
		const finalStat = fs.fstatSync(fileDescriptor, { bigint: true });
		if (!sameFileMutationFingerprint(initialStat, finalStat)) {
			if (!sameFileStatFingerprint(initialStat, finalStat)) throw new Error(`SQLite snapshot file changed while reading: ${filePath}`);
			assertExpectedContent(hashFileDescriptorSync(fileDescriptor), content, filePath);
		}
		assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity);
		return content;
	} finally {
		fs.closeSync(fileDescriptor);
	}
}
function removePublishedTargetIfOwned(filePath, expectedIdentity, requireFingerprint = false) {
	let currentIdentity;
	try {
		currentIdentity = fs.lstatSync(filePath, { bigint: typeof expectedIdentity.ino === "bigint" });
	} catch {
		return false;
	}
	const fingerprintMatches = !requireFingerprint || expectedIdentity.size === currentIdentity.size && expectedIdentity.mtimeMs === currentIdentity.mtimeMs && expectedIdentity.ctimeMs === currentIdentity.ctimeMs && expectedIdentity.birthtimeMs === currentIdentity.birthtimeMs;
	const unknownIdentity = process.platform === "win32" && [
		expectedIdentity.dev,
		expectedIdentity.ino,
		currentIdentity.dev,
		currentIdentity.ino
	].some((value) => value === 0 || value === 0n);
	if (!currentIdentity.isFile() || unknownIdentity || !sameFileIdentity(expectedIdentity, currentIdentity) || !fingerprintMatches) return false;
	try {
		fs.unlinkSync(filePath);
		return true;
	} catch {
		return false;
	}
}
function sameFileStatFingerprint(left, right) {
	return sameFileIdentity(left, right) && left.size === right.size;
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
//#endregion
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
async function copyFileExclusive(source, sourcePath, targetPath, beforeByteCopy) {
	const sourceFingerprint = await source.stat({ bigint: true });
	let target;
	let targetIdentity;
	try {
		const publication = await copySqliteFile(sourcePath, targetPath, sourceFingerprint, beforeByteCopy);
		target = await fs$1.open(targetPath, "r+");
		const openedIdentity = await target.stat({ bigint: true });
		if (!sameFileIdentity(publication, openedIdentity)) throw new Error(`SQLite snapshot target changed during publication: ${targetPath}`);
		targetIdentity = openedIdentity;
		const content = await hashOpenPublishedFile(target, targetPath, targetIdentity);
		await assertMutationFingerprintUnchanged(source, sourceFingerprint, targetPath, content);
		await target.sync();
		const currentIdentity = await fs$1.lstat(targetPath, { bigint: true });
		if (!sameFileIdentity(targetIdentity, currentIdentity)) throw new Error(`SQLite snapshot target changed during publication: ${targetPath}`);
		return {
			content,
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
async function assertMutationFingerprintUnchanged(handle, expected, filePath, expectedContent) {
	const current = await handle.stat({ bigint: true });
	if (!sameFileMutationFingerprint(current, expected)) {
		if (!sameFileStatFingerprint(current, expected)) throw new Error(`SQLite snapshot file changed while reading: ${filePath}`);
		const { digest, bytes } = await sha256File(handle);
		assertExpectedContent({
			sha256: digest,
			sizeBytes: bytes
		}, expectedContent, filePath);
	}
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
	const options = { bigint: typeof expectedIdentity.ino === "bigint" };
	const openedIdentity = await handle.stat(options);
	const currentIdentity = await fs$1.lstat(filePath, options);
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
	const fingerprint = await handle.stat({ bigint: true });
	const { digest, bytes } = await sha256File(handle);
	const content = {
		sha256: digest,
		sizeBytes: bytes
	};
	await assertMutationFingerprintUnchanged(handle, fingerprint, filePath, content);
	await assertOpenFileIdentity(handle, filePath, expectedIdentity);
	return content;
}
function assertSynchronousCallbackResult(result, label) {
	if (result && (typeof result === "object" || typeof result === "function") && typeof result.then === "function") {
		Promise.resolve(result).catch(() => void 0);
		throw new Error(`${label} must be synchronous.`);
	}
}
/**
* Publish the exact bytes of one already-verified SQLite file through a pinned
* source identity. The target is always created exclusively.
*/
async function publishVerifiedSqliteFile(options) {
	return publishSqliteFile(options, false);
}
/** Prepare an independent writable image beside its destination before replacing current state. */
async function prepareVerifiedSqliteFile(options) {
	const directory = await createPrivateSqliteTempDirectory(path.dirname(options.targetPath), ".sqlite-publish-prepared-");
	const directoryIdentity = await fs$1.lstat(directory);
	const sourcePath = path.join(directory, "database.sqlite");
	const cleanup = () => removePublicationStagingDirectory(directory, directoryIdentity);
	try {
		let sourceIdentity;
		await publishVerifiedSqliteFile({
			...options,
			targetPath: sourcePath,
			afterPublish: (guard) => {
				assertSynchronousCallbackResult(options.afterPublish?.(guard), "SQLite after-publication guard");
				sourceIdentity = fs.lstatSync(sourcePath);
				guard.assertTargetUnchanged();
			}
		});
		if (!sourceIdentity) throw new Error(`SQLite prepared image was not published: ${sourcePath}`);
		const preparedIdentity = sourceIdentity;
		return {
			path: sourcePath,
			cleanup,
			publish: () => publishSqliteFile({
				...options,
				sourcePath,
				sourceIdentity: preparedIdentity
			}, "prepared")
		};
	} catch (error) {
		try {
			await cleanup();
		} catch (cleanupError) {
			throw createSqliteLifecycleAggregateError([error, cleanupError], "SQLite output preparation and cleanup both failed", error);
		}
		throw error;
	}
}
async function publishSqliteFile(options, consumeOwnedSource) {
	await assertTargetAbsent(options.targetPath);
	const targetDirectory = path.resolve(path.dirname(options.targetPath));
	const targetDirectoryPin = await pinDirectory(targetDirectory, { label: "SQLite publication directory" });
	const targetDirectoryReceipt = targetDirectoryPin.receipt;
	let stagingDir;
	try {
		stagingDir = consumeOwnedSource === "prepared" ? path.dirname(options.sourcePath) : await createPrivateSqliteTempDirectory(targetDirectory, `.sqlite-publish-${randomUUID()}-`);
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
		let staged;
		if (consumeOwnedSource === "prepared") {
			if (options.sourcePath !== stagedPath || options.sourceIdentity.dev !== targetDirectoryReceipt.identity.dev) throw new Error(`SQLite prepared image is not on its publication volume: ${options.sourcePath}`);
			staged = {
				content: await hashOpenPublishedFile(source, options.sourcePath, options.sourceIdentity),
				identity: await source.stat({ bigint: true })
			};
		} else if (consumeOwnedSource && options.sourceIdentity.dev !== 0 && options.sourceIdentity.ino !== 0 && options.sourceIdentity.dev === stagingIdentity.dev) {
			const moved = await publishFileExclusive({
				sourcePath: options.sourcePath,
				targetPath: stagedPath,
				expectedSourceIdentity: options.sourceIdentity,
				strategy: "link-or-copy"
			});
			requireDirectorySync(moved.directorySync, "SQLite staging transfer directory");
			const content = await hashPublishedFile(stagedPath, moved.identity);
			assertExpectedContent(content, options.expectedContent, stagedPath);
			const opened = fs.fstatSync(source.fd, { bigint: true });
			const current = fs.lstatSync(options.sourcePath, { bigint: true });
			if (!current.isFile() || opened.dev === 0n || opened.ino === 0n || current.dev !== opened.dev || current.ino !== opened.ino) throw new Error(`SQLite snapshot source changed during transfer: ${options.sourcePath}`);
			fs.unlinkSync(options.sourcePath);
			const identity = await fs$1.lstat(stagedPath);
			if (!sameFileStatFingerprint(moved.identity, identity)) throw new Error(`SQLite snapshot staging file changed during transfer: ${stagedPath}`);
			staged = {
				content,
				identity
			};
		} else staged = await copyFileExclusive(source, options.sourcePath, stagedPath, options.beforeByteCopy);
		const expectedContent = options.expectedContent;
		assertExpectedContent(staged.content, expectedContent, options.targetPath);
		await source.close();
		source = void 0;
		await options.validatePublished?.(stagedPath);
		assertExpectedContent(await hashPublishedFile(stagedPath, staged.identity), expectedContent, options.targetPath);
		await options.beforePublish?.();
		await assertTargetAbsent(options.targetPath);
		const stagedStatOptions = { bigint: typeof staged.identity.ino === "bigint" };
		const currentStagedIdentity = await fs$1.lstat(stagedPath, stagedStatOptions);
		if (!sameFileStatFingerprint(staged.identity, currentStagedIdentity)) throw new Error(`SQLite snapshot staging file changed during publication: ${stagedPath}`);
		try {
			const publication = await publishFileExclusive({
				sourcePath: stagedPath,
				targetPath: options.targetPath,
				expectedSourceIdentity: currentStagedIdentity,
				strategy: options.requireAtomicPublication || consumeOwnedSource === "prepared" ? "link-required" : "link-or-copy"
			});
			publishedIdentity = publication.identity;
			requireDirectorySync(publication.directorySync, "File publication directory");
		} catch (error) {
			const details = getPublishFileExclusiveFailureDetails(error);
			const stagedAfterFailure = details?.targetCreated ? await fs$1.lstat(stagedPath, stagedStatOptions).catch(() => void 0) : void 0;
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
				assertPublishedFileIdentitySync(options.targetPath, expectedIdentity, expectedContent);
			},
			assertTargetUnchanged: (finalCheck) => {
				assertPublishedFileIdentitySync(options.targetPath, expectedIdentity, expectedContent);
				assertSynchronousCallbackResult(finalCheck?.(), "SQLite publication final check");
				assertPublishedFileIdentitySync(options.targetPath, expectedIdentity, expectedContent);
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
		if (publishedIdentity && consumeOwnedSource !== "prepared") {
			if (removePublishedTargetIfOwned(options.targetPath, publishedIdentity, true)) await syncDirectory(targetDirectoryReceipt).catch(() => void 0);
		}
		if (consumeOwnedSource !== "prepared") {
			if (stagingIdentity) await removePublicationStagingDirectory(stagingDir, stagingIdentity).catch(() => void 0);
			else await fs$1.rmdir(stagingDir).catch(() => void 0);
		}
		throw error;
	} finally {
		if (targetPinFileDescriptor !== void 0) fs.closeSync(targetPinFileDescriptor);
		if (target) await target.close().catch(() => void 0);
		if (source) await source.close().catch(() => void 0);
		await targetDirectoryPin.close().catch(() => void 0);
	}
}
/**
* Compact one SQLite database into a fresh private file and verify the result.
*
* The source and output both receive full structural, index, and foreign-key
* checks. Only a fully verified, synced snapshot is published to the target.
*/
async function createVerifiedSqliteSnapshot(options) {
	const sourcePath = options.sourceAcquisition ? await fs$1.realpath(options.sourcePath) : options.sourcePath;
	await assertRegularSourceFile(sourcePath, options.requireNonEmptySource === true);
	await assertTargetAbsent(options.targetPath);
	if (options.preserveRowIds && !options.sourceAcquisition) {
		const prepared = await prepareSqliteReadOnlyLocation(sourcePath, { preserveSourceArtifacts: true });
		return withPreparedSqliteSnapshot(prepared, (privateSourcePath) => verifyAndPublishSqliteSnapshot(options, privateSourcePath));
	}
	if (options.sourceAcquisition) {
		const prepared = options.sourceAcquisition.preserveSourceArtifacts ? await prepareSqliteReadOnlyCopyInProcess(sourcePath, options.sourceAcquisition.stagingRoot) : await prepareSqliteReadOnlyLocationInProcess(sourcePath, options.sourceAcquisition.stagingRoot, void 0, options.onProgress);
		return withPreparedSqliteSnapshot(prepared, (privateSourcePath) => verifyAndPublishSqliteSnapshot(options, privateSourcePath));
	}
	return verifyAndPublishSqliteSnapshot(options);
}
async function verifyAndPublishSqliteSnapshot(options, privateSourcePath) {
	const stagingDir = privateSourcePath ? path.dirname(privateSourcePath) : await createPrivateSqliteTempDirectory(path.dirname(options.targetPath), ".sqlite-snapshot-");
	await fs$1.chmod(stagingDir, 448);
	const stagedPath = privateSourcePath ?? path.join(stagingDir, "database.sqlite");
	let stagedIdentity;
	try {
		await withSqliteSnapshotSource(privateSourcePath ?? options.sourcePath, async (snapshotSourcePath) => {
			if (!privateSourcePath) await fs$1.rm(stagedPath, { force: true });
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
					if (!privateSourcePath) await backupNodeSqliteDatabase(source, stagedPath, options.onProgress);
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
			const userVersion = readSqliteUserVersion(snapshot);
			snapshot.close();
			await syncFile(stagedPath);
			stagedIdentity = await fs$1.lstat(stagedPath);
			const expectedContent = await hashPublishedFile(stagedPath, stagedIdentity);
			await publishSqliteFile({
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
			}, true);
			return {
				path: options.targetPath,
				userVersion,
				...expectedContent
			};
		} finally {
			if (snapshot.isOpen) snapshot.close();
		}
	} catch (error) {
		throw new Error(`SQLite database cannot be snapshotted safely: ${options.sourcePath}. ${formatErrorMessage(error)}`, { cause: error });
	} finally {
		if (!privateSourcePath) await fs$1.rm(stagingDir, {
			force: true,
			recursive: true
		}).catch(() => void 0);
	}
}
//#endregion
export { prepareVerifiedSqliteFile as n, publishVerifiedSqliteFile as r, createVerifiedSqliteSnapshot as t };
