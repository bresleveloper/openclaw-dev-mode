import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as sameFileMutationFingerprint } from "./file-descriptor-BWLpOgrg.mjs";
import { c as assertOpenFileIdentitySync, d as removePublicationStagingDirectory, f as removePublishedTargetIfOwned, l as assertPublishedFileIdentitySync, p as sameFileStatFingerprint, s as assertExpectedContent, u as hashPublishedFileSync } from "./sqlite-file-generation-Cmk6kG35.mjs";
import { h as withPreparedSqliteSnapshot } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { r as assertSqliteIntegrity } from "./sqlite-integrity-06TCB-az.mjs";
import { i as configureSqliteSnapshotPragmas } from "./sqlite-wal-D2XTertL.mjs";
import { f as copySqliteFile, i as prepareSqliteReadOnlyCopyInProcess, o as prepareSqliteReadOnlyLocationInProcess, p as backupNodeSqliteDatabase } from "./sqlite-readonly-location-Cz5jsVbC.mjs";
import { f as createPrivateSqliteTempDirectory } from "./sqlite-snapshot-staging-B4VrWJSe.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { n as prepareSqliteReadOnlyLocation, s as withSqliteSnapshotSource } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import { a as publishFileExclusive, c as sha256File, i as pinDirectory, l as syncDirectory, n as getPublishFileExclusiveFailureDetails, r as isHardlinkFallbackError, s as requireDirectorySync } from "./directory-durability-B2RKADOj.mjs";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { sameFileIdentity } from "@openclaw/fs-safe/advanced";
//#region src/infra/sqlite-snapshot.ts
var SqliteReplacementOutcomeUnknownError = class extends Error {
	constructor(receipt, cause) {
		super(`SQLite replacement outcome is uncertain: ${receipt.targetPath}. Reconcile the target against the retained recovery manifest before retrying.`, { cause });
		this.receipt = receipt;
		this.name = "SqliteReplacementOutcomeUnknownError";
	}
};
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
/** Only the native updater's stopped, checkpointed inventory may use raw file capture. */
async function createStoppedSqliteSnapshot(options) {
	if (options.sourceIdentity.size === 0n) throw new Error(`SQLite snapshot source must not be empty: ${options.sourcePath}`);
	const publication = await copySqliteFile(options.sourcePath, options.targetPath, options.sourceIdentity);
	const snapshot = openNodeSqliteDatabase(options.targetPath);
	let userVersion;
	try {
		configureSqliteSnapshotPragmas(snapshot);
		userVersion = readSqliteUserVersion(snapshot);
	} finally {
		snapshot.close();
	}
	const identity = await fs$1.lstat(options.targetPath, { bigint: true });
	if (!sameFileIdentity(publication, identity) || identity.size !== options.sourceIdentity.size) throw new Error(`SQLite snapshot file changed: ${options.targetPath}`);
	await syncFile(options.targetPath);
	const content = await hashPublishedFile(options.targetPath, identity);
	return {
		path: options.targetPath,
		userVersion,
		...content
	};
}
async function assertOpenFileIdentity(handle, filePath, expectedIdentity) {
	const openedIdentity = await handle.stat({ bigint: true });
	const currentIdentity = await fs$1.lstat(filePath, { bigint: true });
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
* source identity. Targets are exclusive unless replacement is explicitly requested.
*/
async function publishVerifiedSqliteFile(options) {
	return publishSqliteFile(options, false);
}
/** Prepare an independent writable image beside its destination before replacing current state. */
async function prepareVerifiedSqliteFile(options) {
	const directory = await createPrivateSqliteTempDirectory(path.dirname(options.targetPath), ".sqlite-publish-prepared-");
	const directoryIdentity = await fs$1.lstat(directory, { bigint: true });
	const sourcePath = path.join(directory, "database.sqlite");
	const cleanup = () => removePublicationStagingDirectory(directory, directoryIdentity);
	try {
		let sourceIdentity;
		await publishVerifiedSqliteFile({
			...options,
			targetPath: sourcePath,
			replaceExisting: void 0,
			afterPublish: (guard) => {
				assertSynchronousCallbackResult(options.afterPublish?.(guard), "SQLite after-publication guard");
				sourceIdentity = fs.lstatSync(sourcePath, { bigint: true });
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
	const replacement = options.replaceExisting;
	if (replacement) {
		if (process.platform === "win32") throw new Error("Atomic SQLite replacement is unsupported on this platform");
		assertExpectedContent(hashPublishedFileSync(options.targetPath, replacement.expectedIdentity), replacement.expectedContent, options.targetPath);
	} else await assertTargetAbsent(options.targetPath);
	const targetDirectory = path.resolve(path.dirname(options.targetPath));
	const targetDirectoryPin = await pinDirectory(targetDirectory, { label: "SQLite publication directory" });
	const targetDirectoryReceipt = targetDirectoryPin.receipt;
	let stagingDir;
	try {
		stagingDir = consumeOwnedSource === "prepared" ? path.dirname(options.sourcePath) : await createPrivateSqliteTempDirectory(targetDirectory, ".sqlite-publish-");
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
	let publishedStat;
	let replacementAttempt;
	try {
		stagingIdentity = await fs$1.lstat(stagingDir, { bigint: true });
		await fs$1.chmod(stagingDir, 448);
		source = await fs$1.open(options.sourcePath, "r");
		await assertOpenFileIdentity(source, options.sourcePath, options.sourceIdentity);
		const sourceIdentity = await source.stat({ bigint: true });
		let staged;
		if (consumeOwnedSource === "prepared") {
			if (options.sourcePath !== stagedPath || sourceIdentity.dev !== stagingIdentity.dev) throw new Error(`SQLite prepared image is not on its publication volume: ${options.sourcePath}`);
			staged = {
				content: await hashOpenPublishedFile(source, options.sourcePath, sourceIdentity),
				identity: sourceIdentity
			};
		} else if (consumeOwnedSource && sourceIdentity.dev !== 0n && sourceIdentity.ino !== 0n && sourceIdentity.dev === stagingIdentity.dev) {
			const moved = await publishFileExclusive({
				sourcePath: options.sourcePath,
				targetPath: stagedPath,
				expectedSourceIdentity: sourceIdentity,
				strategy: "link-or-copy"
			});
			requireDirectorySync(moved.directorySync, "SQLite staging transfer directory");
			const content = await hashPublishedFile(stagedPath, moved.exactIdentity);
			assertExpectedContent(content, options.expectedContent, stagedPath);
			const opened = fs.fstatSync(source.fd, { bigint: true });
			const current = fs.lstatSync(options.sourcePath, { bigint: true });
			if (!current.isFile() || opened.dev === 0n || opened.ino === 0n || current.dev !== opened.dev || current.ino !== opened.ino) throw new Error(`SQLite snapshot source changed during transfer: ${options.sourcePath}`);
			fs.unlinkSync(options.sourcePath);
			const identity = await fs$1.lstat(stagedPath, { bigint: true });
			if (!sameFileIdentity(moved.exactIdentity, identity) || moved.identity.size !== Number(identity.size)) throw new Error(`SQLite snapshot staging file changed during transfer: ${stagedPath}`);
			staged = {
				content,
				identity: {
					...moved.exactIdentity,
					size: identity.size
				}
			};
		} else staged = await copyFileExclusive(source, options.sourcePath, stagedPath, options.beforeByteCopy);
		const expectedContent = options.expectedContent;
		assertExpectedContent(staged.content, expectedContent, options.targetPath);
		await source.close();
		source = void 0;
		await options.validatePublished?.(stagedPath);
		const validatedContent = await hashPublishedFile(stagedPath, staged.identity);
		assertExpectedContent(validatedContent, expectedContent, options.targetPath);
		await options.beforePublish?.();
		if (!replacement) await assertTargetAbsent(options.targetPath);
		const stagedStatOptions = { bigint: true };
		const currentStagedIdentity = await fs$1.lstat(stagedPath, stagedStatOptions);
		if (!sameFileStatFingerprint(staged.identity, currentStagedIdentity)) throw new Error(`SQLite snapshot staging file changed during publication: ${stagedPath}`);
		if (replacement) {
			if ((await fs$1.lstat(targetDirectory, { bigint: true })).dev !== currentStagedIdentity.dev) throw new Error("Atomic SQLite replacement requires a same-volume prepared image");
			if ((await syncDirectory(targetDirectoryReceipt)).status !== "synced") throw new Error("Atomic SQLite replacement requires directory synchronization");
			assertExpectedContent(hashPublishedFileSync(options.targetPath, replacement.expectedIdentity), replacement.expectedContent, options.targetPath);
			assertExpectedContent(hashPublishedFileSync(stagedPath, currentStagedIdentity), expectedContent, stagedPath);
			assertSynchronousCallbackResult(replacement.assertCustody(), "SQLite replacement custody");
			replacementAttempt = {
				targetPath: options.targetPath,
				identity: currentStagedIdentity,
				...expectedContent
			};
			fs.renameSync(stagedPath, options.targetPath);
			publishedIdentity = currentStagedIdentity;
			publishedStat = currentStagedIdentity;
		} else try {
			const publication = await publishFileExclusive({
				sourcePath: stagedPath,
				targetPath: options.targetPath,
				expectedSourceIdentity: currentStagedIdentity,
				strategy: options.requireAtomicPublication || consumeOwnedSource === "prepared" ? "link-required" : "link-or-copy"
			});
			publishedIdentity = publication.exactIdentity;
			publishedStat = publication.identity;
			requireDirectorySync(publication.directorySync, "File publication directory");
		} catch (error) {
			const details = getPublishFileExclusiveFailureDetails(error);
			const stagedAfterFailure = details?.targetCreated ? await fs$1.lstat(stagedPath, stagedStatOptions).catch(() => void 0) : void 0;
			const stagedPathChanged = !stagedAfterFailure || !sameFileStatFingerprint(staged.identity, stagedAfterFailure);
			if (options.requireAtomicPublication && isHardlinkFallbackError(error)) throw new Error(`Atomic SQLite publication requires hard-link support in ${targetDirectory}.`, { cause: error });
			if (details?.targetCreated) throw new Error(`SQLite snapshot ${stagedPathChanged ? "staging file" : "target"} changed during publication: ${options.targetPath}`, { cause: error });
			throw error;
		}
		if (!publishedIdentity) throw new Error(`SQLite snapshot target was not published: ${options.targetPath}`);
		const initialPublishedIdentity = publishedIdentity;
		target = await fs$1.open(options.targetPath, "r");
		await assertOpenFileIdentity(target, options.targetPath, initialPublishedIdentity);
		if (!replacement) await fs$1.unlink(stagedPath);
		const expectedIdentity = await target.stat({ bigint: true });
		publishedIdentity = expectedIdentity;
		publishedStat = expectedIdentity;
		const publishedContent = await hashOpenPublishedFile(target, options.targetPath, expectedIdentity);
		assertExpectedContent(publishedContent, expectedContent, options.targetPath);
		await fs$1.rmdir(stagingDir);
		requireDirectorySync(await syncDirectory(targetDirectoryReceipt), "SQLite publication directory");
		await target.close();
		target = void 0;
		targetPinFileDescriptor = fs.openSync(options.targetPath, "r");
		assertOpenFileIdentitySync(targetPinFileDescriptor, options.targetPath, expectedIdentity);
		const guard = {
			assertTargetMatchesExpectedContent: (finalCheck) => {
				const content = hashPublishedFileSync(options.targetPath, expectedIdentity);
				assertExpectedContent(content, expectedContent, options.targetPath);
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
		if (replacementAttempt) return {
			...replacementAttempt,
			identity: expectedIdentity
		};
	} catch (error) {
		if (replacementAttempt) throw new SqliteReplacementOutcomeUnknownError(replacementAttempt, error);
		if (target && publishedIdentity) {
			const openedIdentity = await target.stat({ bigint: true }).catch(() => void 0);
			if (openedIdentity && sameFileIdentity(openedIdentity, publishedIdentity)) {
				publishedIdentity = openedIdentity;
				publishedStat = openedIdentity;
			}
		}
		if (publishedIdentity && publishedStat && consumeOwnedSource !== "prepared") {
			if (removePublishedTargetIfOwned(options.targetPath, publishedIdentity, publishedStat)) await syncDirectory(targetDirectoryReceipt).catch(() => void 0);
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
* SQLite copies and checks vec0 shadow tables without loading sqlite-vec;
* native extension loading here can crash backups on unsupported CPUs.
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
			const source = openNodeSqliteDatabase(snapshotSourcePath, { readOnly: true });
			try {
				source.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF; BEGIN;");
				try {
					source.prepare("PRAGMA schema_version;").get();
					assertSqliteIntegrity(source, options.sourcePath, options.integrity);
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
		const snapshot = openNodeSqliteDatabase(stagedPath);
		try {
			configureSqliteSnapshotPragmas(snapshot);
			if (options.transform) await options.transform(snapshot);
			if (!options.preserveRowIds) snapshot.exec("VACUUM;");
			const userVersion = readSqliteUserVersion(snapshot);
			snapshot.close();
			await syncFile(stagedPath);
			stagedIdentity = await fs$1.lstat(stagedPath, { bigint: true });
			const expectedContent = await hashPublishedFile(stagedPath, stagedIdentity);
			await publishSqliteFile({
				sourceIdentity: stagedIdentity,
				sourcePath: stagedPath,
				targetPath: options.targetPath,
				expectedContent,
				beforePublish: options.beforePublish,
				afterPublish: options.afterPublish,
				validatePublished: (publishedPath) => {
					const published = openNodeSqliteDatabase(publishedPath, { readOnly: true });
					try {
						published.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
						assertSqliteIntegrity(published, options.targetPath, options.integrity);
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
export { publishVerifiedSqliteFile as a, prepareVerifiedSqliteFile as i, createStoppedSqliteSnapshot as n, createVerifiedSqliteSnapshot as r, SqliteReplacementOutcomeUnknownError as t };
