import { p as tempFile } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { o as openRootFileSync, r as isRootFileMissingFailure } from "./boundary-file-read-D-Aa04On.mjs";
import { r as replaceFileAtomicSync } from "./replace-file-DJtj9VLX.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { n as createConfigWriteAuthorityGuard } from "./write-authority-BBYsD_pp.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import path from "node:path";
//#region src/config/backup-rotation.ts
/** Prepare backup bytes without blocking unrelated Gateway requests. */
async function prepareConfigFileWrite(params) {
	const { configPath, fsModule } = params;
	const assertCurrent = createConfigWriteAuthorityGuard(params.assertCurrent);
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
				beforeRename: () => {
					if (!backup) return;
					const openBackupArtifact = (absolutePath) => {
						const opened = openRootFileSync({
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
					const mutateBackupArtifact = (from, to) => {
						assertCurrent?.();
						try {
							try {
								var _usingCtx3 = _usingCtx();
								const destination = _usingCtx3.u(to ? openBackupArtifact(to) : void 0);
								if (destination && !destination.ok && !isRootFileMissingFailure(destination)) return;
								const source = _usingCtx3.u(openBackupArtifact(from));
								if (!source.ok) return;
								const assertDestination = () => {
									if (!to) return;
									const current = fsModule.lstatSync(to, {
										bigint: true,
										throwIfNoEntry: false
									});
									const captured = destination?.ok ? fsModule.fstatSync(destination.fd, { bigint: true }) : void 0;
									if (captured ? !current || current.isSymbolicLink() || current.nlink !== 1n || current.dev !== captured.dev || current.ino !== captured.ino : current) throw new ConfigMutationConflictError("config backup destination changed", { retryable: false });
								};
								assertCurrent();
								assertDestination();
								if (to) {
									fsModule.fchmodSync(source.fd, 384);
									assertCurrent();
									assertDestination();
									fsModule.renameSync(source.path, to);
								} else fsModule.unlinkSync(source.path);
							} catch (_) {
								_usingCtx3.e = _;
							} finally {
								_usingCtx3.d();
							}
						} catch (error) {
							assertCurrent();
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
