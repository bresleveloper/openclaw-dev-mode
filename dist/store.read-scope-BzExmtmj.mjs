import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { b as redactToolPayloadText } from "./redact-DJ8j6ADa.mjs";
import { u as syncDirectoryBestEffort } from "./directory-durability-CqSvP1tc.mjs";
import { r as settleChannelReadResource } from "./channel-read-authority-CyorchNP.mjs";
import "./store.shared-B3dvmzL9.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { assertDirectoryIdentitySync, buildRandomTempFilePath, readDirectoryIdentity, sameFileIdentity } from "@openclaw/fs-safe/advanced";
//#region src/media/store.read-scope.ts
const exitCleanups = resolveGlobalSingleton(Symbol.for("openclaw.readMediaExitCleanup"), () => {
	const callbacks = /* @__PURE__ */ new Set();
	process.once("exit", () => {
		for (const cleanup of callbacks) try {
			cleanup();
		} catch (error) {
			console.error(`Channel read output cleanup failed at exit: ${redactToolPayloadText(String(error))}`);
		}
	});
	return callbacks;
});
function isUnownedMediaPath(error) {
	return error instanceof FsSafeError && [
		"not-found",
		"not-file",
		"path-mismatch",
		"symlink",
		"hardlink"
	].includes(error.code) || error instanceof Error && "code" in error && error.code === "ENOENT";
}
async function captureDirectoryGuard(dir) {
	const expected = await readDirectoryIdentity(dir);
	return (handle) => {
		assertDirectoryIdentitySync(dir, expected);
		if (handle && !sameFileIdentity(fs.fstatSync(handle.fd, { bigint: true }), expected)) throw new FsSafeError("path-mismatch", "Media output directory identity changed");
	};
}
/** Publishes guarded media; a read scope retains its descriptor until host acceptance. */
async function writeReadScopeMedia(params) {
	const assertCurrent = () => {
		params.scope?.assertCurrent();
		params.assertCommitAllowed?.();
	};
	assertCurrent();
	const assertRequestedDirectory = await captureDirectoryGuard(params.dir);
	const mediaRoot = await root(params.dir);
	const assertMediaDirectory = await captureDirectoryGuard(mediaRoot.rootReal);
	if (process.platform !== "win32") {
		const directory = await fs$1.open(mediaRoot.rootReal, fs.constants.O_RDONLY | fs.constants.O_DIRECTORY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
		try {
			assertCurrent();
			assertRequestedDirectory();
			assertMediaDirectory(directory);
			await directory.chmod(448).catch(() => void 0);
		} finally {
			await settleChannelReadResource({
				key: mediaRoot.rootReal,
				settle: async () => await directory.close()
			}, true);
		}
	}
	assertCurrent();
	const temporaryPath = buildRandomTempFilePath({
		rootDir: mediaRoot.rootReal,
		prefix: params.tempPrefix,
		extension: ".tmp"
	});
	const temporaryName = path.basename(temporaryPath);
	let handle;
	let finalId;
	let handedOff = false;
	let settlement;
	let assertOwnedFile;
	let cleanupAtExit;
	let assertCustody;
	const resource = {
		get key() {
			return finalId ? path.join(params.dir, finalId) : temporaryPath;
		},
		onDelegated: (assertDelegatedCustody) => {
			const previous = assertCustody;
			assertCustody = () => {
				previous?.();
				assertDelegatedCustody?.();
			};
			if (cleanupAtExit) exitCleanups.delete(cleanupAtExit);
		},
		assertCurrent: () => {
			if (settlement) return;
			assertRequestedDirectory();
			assertMediaDirectory();
			if (finalId) assertOwnedFile?.(path.join(mediaRoot.rootReal, finalId));
		},
		settle: (accepted) => settlement ??= (async () => {
			if (accepted && cleanupAtExit) exitCleanups.delete(cleanupAtExit);
			const failures = [];
			try {
				if (!accepted && handle) {
					if (!assertOwnedFile) throw new FsSafeError("path-mismatch", "Cannot verify created media for cleanup");
					for (const name of [finalId, temporaryName]) {
						if (!name) continue;
						try {
							await mediaRoot.remove(name, { assertBeforeMutation: () => {
								assertCustody?.();
								assertMediaDirectory();
								assertOwnedFile?.(path.join(mediaRoot.rootReal, name));
							} });
						} catch (error) {
							if (!isUnownedMediaPath(error)) failures.push(error);
						}
					}
				}
			} catch (error) {
				failures.push(error);
			}
			if (cleanupAtExit) exitCleanups.delete(cleanupAtExit);
			try {
				await handle?.close();
			} catch (error) {
				failures.push(error);
			}
			if (failures.length > 0) throw new AggregateError(failures, "Failed to release channel read output");
		})()
	};
	try {
		assertCurrent();
		handle = await fs$1.open(temporaryPath, "wx", 420);
		const retained = handle;
		const expected = fs.fstatSync(retained.fd, { bigint: true });
		assertOwnedFile = (filePath) => {
			const opened = fs.fstatSync(retained.fd, { bigint: true });
			const current = fs.lstatSync(filePath, { bigint: true });
			if (!opened.isFile() || !current.isFile() || current.isSymbolicLink() || opened.nlink !== 1n || current.nlink !== 1n || opened.dev !== expected.dev || opened.ino !== expected.ino || current.dev !== expected.dev || current.ino !== expected.ino || process.platform === "win32" && (expected.dev === 0n || expected.ino === 0n)) throw new FsSafeError("path-mismatch", "Media output no longer names the created file");
		};
		cleanupAtExit = () => {
			for (const name of [finalId, temporaryName]) {
				if (!name) continue;
				try {
					const filePath = path.join(mediaRoot.rootReal, name);
					assertMediaDirectory();
					assertOwnedFile?.(filePath);
					fs.unlinkSync(filePath);
				} catch (error) {
					if (!isUnownedMediaPath(error)) throw error;
				}
			}
		};
		exitCleanups.add(cleanupAtExit);
		assertCurrent();
		const result = await params.write(retained);
		assertCurrent();
		assertRequestedDirectory();
		assertMediaDirectory();
		assertOwnedFile(temporaryPath);
		try {
			await retained.chmod(420);
		} catch (error) {
			if (process.platform !== "win32" && (fs.fstatSync(retained.fd).mode & 292) !== 292) throw error;
		}
		if (params.durable) {
			assertCurrent();
			assertRequestedDirectory();
			assertMediaDirectory();
			assertOwnedFile(temporaryPath);
			await retained.sync();
		}
		assertCurrent();
		assertRequestedDirectory();
		assertMediaDirectory();
		assertOwnedFile(temporaryPath);
		finalId = result.id;
		await mediaRoot.move(temporaryName, finalId, {
			overwrite: false,
			assertBeforeMutation: () => {
				assertCurrent();
				assertRequestedDirectory();
				assertMediaDirectory();
				assertOwnedFile?.(temporaryPath);
				try {
					fs.lstatSync(path.join(mediaRoot.rootReal, result.id));
				} catch (error) {
					if (error instanceof Error && "code" in error && error.code === "ENOENT") return;
					throw error;
				}
				throw new FsSafeError("already-exists", "Media output already exists");
			}
		});
		resource.assertCurrent();
		if (params.durable) {
			assertCurrent();
			await syncDirectoryBestEffort(mediaRoot.rootReal);
			assertCurrent();
			resource.assertCurrent();
		}
		assertCurrent();
		if (params.scope) params.scope.registerResource(resource);
		else await settleChannelReadResource(resource, true);
		handedOff = true;
		return result;
	} catch (error) {
		await settleChannelReadResource(resource, false);
		throw error;
	} finally {
		if (!handedOff) await settleChannelReadResource(resource, false);
	}
}
//#endregion
export { writeReadScopeMedia };
