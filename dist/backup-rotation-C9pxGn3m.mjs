import { o as openRootFileSync$1, r as isRootFileMissingFailure } from "./boundary-file-read-CCth2Hwg.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { n as createConfigWriteAuthorityGuard } from "./write-authority-BBYsD_pp.mjs";
import path from "node:path";
import { tempFile } from "@openclaw/fs-safe/advanced";
import { replaceFileAtomicSync } from "@openclaw/fs-safe/atomic";
//#region src/config/backup-rotation.ts
/** Prepare backup bytes without blocking unrelated Gateway requests. */
async function prepareConfigFileWrite(params) {
	const { configPath, fsModule } = params;
	const assertCurrent = createConfigWriteAuthorityGuard(params.assertCurrent);
	const assertBeforeMutation = createConfigWriteAuthorityGuard(params.assertBeforeMutation ?? assertCurrent);
	assertCurrent?.();
	let backup;
	try {
		if (params.previousRaw !== null) try {
			var _usingCtx$1 = _usingCtx();
			backup = await tempFile({
				rootDir: path.dirname(configPath),
				prefix: "openclaw-config-backup",
				fileName: "original"
			});
			assertCurrent?.();
			const handle = _usingCtx$1.a(await fsModule.promises.open(backup.path, "wx", 384));
			assertCurrent?.();
			await handle.writeFile(params.previousRaw, "utf8");
			assertCurrent?.();
			if (params.durable) {
				await handle.sync();
				assertCurrent?.();
			}
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	} catch (error) {
		try {
			await backup?.[Symbol.asyncDispose]();
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], "Config backup preparation and cleanup failed", { cause: cleanupError });
		}
		backup = void 0;
		assertCurrent?.();
	}
	return {
		publish() {
			return replaceFileAtomicSync({
				filePath: configPath,
				content: params.content,
				dirMode: 448,
				mode: 384,
				copyFallbackOnPermissionError: true,
				destinationHardlinks: params.destinationHardlinks,
				syncTempFile: params.durable,
				syncParentDir: params.durable,
				fileSystem: fsModule,
				throwOnCleanupError: true,
				assertBeforeMutation,
				onDestinationState: params.onDestinationState,
				beforeRename: () => {
					if (!backup) return;
					const openBackupArtifact = (absolutePath) => {
						const opened = openRootFileSync$1({
							absolutePath,
							rootPath: path.dirname(configPath),
							boundaryLabel: "config backup directory",
							ioFs: fsModule
						});
						return {
							...opened,
							[Symbol.dispose]() {
								if (opened.ok) fsModule.closeSync(opened.fd);
							}
						};
					};
					const captureBackupIdentity = (filePath, fd, role) => {
						const captured = fd === void 0 ? void 0 : fsModule.fstatSync(fd, { bigint: true });
						return () => {
							const current = fsModule.lstatSync(filePath, {
								bigint: true,
								throwIfNoEntry: role === "source"
							});
							const held = fd === void 0 ? void 0 : fsModule.fstatSync(fd, { bigint: true });
							if (captured ? [current, held].some((entry) => !entry || !entry.isFile() || entry.nlink !== 1n || entry.dev !== captured.dev || entry.ino !== captured.ino) : current) throw new ConfigMutationConflictError(`config backup ${role} changed`, { retryable: false });
						};
					};
					const mutateBackupArtifact = (from, to) => {
						assertBeforeMutation();
						try {
							try {
								var _usingCtx3 = _usingCtx();
								const destination = _usingCtx3.u(to ? openBackupArtifact(to) : void 0);
								if (destination && !destination.ok && !isRootFileMissingFailure(destination)) return;
								const source = _usingCtx3.u(openBackupArtifact(from));
								if (!source.ok) return;
								const assertSource = captureBackupIdentity(source.path, source.fd, "source");
								const assertDestination = to ? captureBackupIdentity(to, destination?.ok ? destination.fd : void 0, "destination") : void 0;
								const assertBackupCurrent = () => {
									assertBeforeMutation();
									assertSource();
									assertDestination?.();
								};
								assertBackupCurrent();
								if (to) {
									fsModule.fchmodSync(source.fd, 384);
									assertBackupCurrent();
									fsModule.renameSync(source.path, to);
								} else fsModule.unlinkSync(source.path);
							} catch (_) {
								_usingCtx3.e = _;
							} finally {
								_usingCtx3.d();
							}
						} catch (error) {
							assertBeforeMutation();
							if (error instanceof ConfigMutationConflictError) throw error;
						}
					};
					const base = `${configPath}.bak`;
					mutateBackupArtifact(`${base}.4`);
					for (let index = 3; index >= 0; index--) mutateBackupArtifact(index === 0 ? base : `${base}.${index}`, `${base}.${index + 1}`);
					mutateBackupArtifact(backup.path, base);
				}
			});
		},
		async [Symbol.asyncDispose]() {
			await backup?.[Symbol.asyncDispose]();
		}
	};
}
const preUpdateConfigSnapshotsWritten = /* @__PURE__ */ new Set();
/**
* Captures the first on-disk config state for an update attempt.
*
* The snapshot is outside the rotating `.bak` ring so repeated writes during
* one process keep an operator-visible rollback point for the original file.
*/
async function createPreUpdateConfigSnapshot(params) {
	if (!params.fs.existsSync(params.configPath)) return;
	const snapshotKey = path.resolve(params.configPath);
	if (preUpdateConfigSnapshotsWritten.has(snapshotKey)) return;
	preUpdateConfigSnapshotsWritten.add(snapshotKey);
	const snapshotPath = `${params.configPath}.pre-update`;
	try {
		const content = await params.fs.readFile(params.configPath, "utf-8");
		await params.fs.writeFile(snapshotPath, content, {
			encoding: "utf-8",
			mode: 384,
			flag: "w"
		});
	} catch {
		preUpdateConfigSnapshotsWritten.delete(snapshotKey);
	}
}
//#endregion
export { prepareConfigFileWrite as n, createPreUpdateConfigSnapshot as t };
