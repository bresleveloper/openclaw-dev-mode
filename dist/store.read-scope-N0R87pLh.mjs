import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { i as buildRandomTempFilePath } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { u as syncDirectoryBestEffort } from "./directory-durability-BKe2aOQN.mjs";
import { r as settleChannelReadResource } from "./channel-read-authority-CLJnqxr1.mjs";
import "./store.shared-8ewC3oFm.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
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
		"path-mismatch",
		"symlink",
		"hardlink"
	].includes(error.code) || error instanceof Error && "code" in error && error.code === "ENOENT";
}
function captureDirectoryGuard(dir) {
	const expected = fs.lstatSync(dir, { bigint: true });
	const realPath = fs.realpathSync.native(dir);
	const assertDirectory = (handle) => {
		const current = fs.lstatSync(dir, { bigint: true });
		const opened = handle ? fs.fstatSync(handle.fd, { bigint: true }) : current;
		if (!current.isDirectory() || current.isSymbolicLink() || current.dev !== expected.dev || current.ino !== expected.ino || opened.dev !== expected.dev || opened.ino !== expected.ino || fs.realpathSync.native(dir) !== realPath || process.platform === "win32" && (current.dev === 0n || current.ino === 0n)) throw new FsSafeError("path-mismatch", "Media output directory identity changed");
	};
	assertDirectory();
	return assertDirectory;
}
/** Keeps a read's original file descriptor until its enclosing host accepts the result. */
async function writeReadScopeMedia(params) {
	params.scope.assertCurrent();
	const assertRequestedDirectory = captureDirectoryGuard(params.dir);
	const mediaRoot = await root(params.dir);
	const assertMediaDirectory = captureDirectoryGuard(mediaRoot.rootReal);
	if (process.platform !== "win32") {
		const directory = await fs$1.open(mediaRoot.rootReal, fs.constants.O_RDONLY | fs.constants.O_DIRECTORY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
		try {
			params.scope.assertCurrent();
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
	params.scope.assertCurrent();
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
	const resource = {
		get key() {
			return finalId ? path.join(params.dir, finalId) : temporaryPath;
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
		params.scope.assertCurrent();
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
		const result = await params.write(retained);
		params.scope.assertCurrent();
		assertRequestedDirectory();
		assertMediaDirectory();
		assertOwnedFile(temporaryPath);
		try {
			await retained.chmod(420);
		} catch (error) {
			if (process.platform !== "win32" && (fs.fstatSync(retained.fd).mode & 292) !== 292) throw error;
		}
		if (params.durable) {
			params.scope.assertCurrent();
			assertRequestedDirectory();
			assertMediaDirectory();
			assertOwnedFile(temporaryPath);
			await retained.sync();
		}
		params.scope.assertCurrent();
		assertRequestedDirectory();
		assertMediaDirectory();
		assertOwnedFile(temporaryPath);
		finalId = result.id;
		await mediaRoot.move(temporaryName, finalId, {
			overwrite: false,
			assertBeforeMutation: () => {
				params.scope.assertCurrent();
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
			params.scope.assertCurrent();
			await syncDirectoryBestEffort(mediaRoot.rootReal);
			params.scope.assertCurrent();
			resource.assertCurrent();
		}
		params.scope.registerResource(resource);
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
