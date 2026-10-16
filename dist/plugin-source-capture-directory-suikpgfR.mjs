import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { o as normalizeWindowsPathPreservingCase, r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { a as createSqliteLifecycleAggregateError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { r as acquireSqliteStagingToken, t as SQLITE_STAGING_TOKEN_FILES } from "./sqlite-staging-token-DXBiTLqt.mjs";
import { r as removeTemporaryArtifacts } from "./temp-artifact-cleanup-DyXpITqy.mjs";
import { i as runInPluginSourceCaptureContext, n as pluginSourceCaptureMaintenance, r as resolvePluginSourceCaptureStorage } from "./plugin-source-capture-context-B9nV7ZEy.mjs";
import { i as resolvePluginSourceCapturesDirectory, n as isLegacyPluginSourceCaptureName, r as resolvePluginSourceCaptureFallbackPrefix, t as PLUGIN_SOURCE_CAPTURE_PREFIX } from "./plugin-source-capture-path-Dqh0vrxU.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
//#region src/plugins/plugin-source-capture-native-loads.ts
/** The process-wide capture owner installs this observer once. */
function observePluginNativeLoads() {
	const paths = /* @__PURE__ */ new Set();
	const loadAddon = process.dlopen.bind(process);
	process.dlopen = (...args) => {
		try {
			const file = fs.realpathSync.native(args[1]);
			paths.add(process.platform === "win32" ? normalizeWindowsPathPreservingCase(file) : file);
		} catch {}
		return loadAddon(...args);
	};
	return paths;
}
function createPluginNativeCaptureCustody(ownedRoots) {
	const nativeLoadPaths = observePluginNativeLoads();
	const nativeReferences = /* @__PURE__ */ new Map();
	const retiringNativeRoots = /* @__PURE__ */ new Set();
	const retainedRoots = /* @__PURE__ */ new Set();
	return {
		nativeReferences,
		retiringNativeRoots,
		/** Independent inventories and loaded modules can retain the same native namespace. */
		isPluginSourceCaptureRetained(directory) {
			return [...ownedRoots, ...retainedRoots].some((root) => isPathInside(root, directory) || isPathInside(directory, root)) || [...nativeReferences.keys(), ...nativeLoadPaths].some((file) => isPathInside(directory, file));
		},
		/** Physical module lifetime outlives registration and CommonJS cache eviction. */
		retainLoadedPluginSourceCapture(directory) {
			if (![...nativeLoadPaths].some((file) => isPathInside(directory, file))) return false;
			const retained = [...ownedRoots].find((root) => isPathInside(root, directory)) ?? directory;
			if (![...retainedRoots].some((root) => isPathInside(root, retained) || isPathInside(retained, root))) process.emitWarning(`Plugin source capture cleanup: retained-by-loaded-module: ${retained}; cleanup deferred until the next startup`);
			retainedRoots.add(retained);
			return true;
		},
		/** Warm generations retain superseded snapshots until their local cache retires. */
		retainPluginNativeCapturePath(capturedPath) {
			const file = path.resolve(capturedPath);
			if ([...retiringNativeRoots].some((root) => file.startsWith(root + path.sep))) throw new Error("Plugin native capture is being reclaimed");
			nativeReferences.set(file, (nativeReferences.get(file) ?? 0) + 1);
			let released = false;
			return () => {
				if (released) return;
				released = true;
				const references = nativeReferences.get(file);
				if (references === 1) nativeReferences.delete(file);
				else nativeReferences.set(file, references - 1);
			};
		}
	};
}
//#endregion
//#region src/plugins/plugin-source-capture-directory.ts
const CAPTURE_GRACE_MS = 36e5;
const { instances, ownedRoots, nativeReferences, retiringNativeRoots, isPluginSourceCaptureRetained, retainLoadedPluginSourceCapture, retainPluginNativeCapturePath, sweeps, warningBackoff } = resolveGlobalSingleton(Symbol.for("openclaw.pluginSourceCaptureInstances"), () => {
	const instanceRoots = /* @__PURE__ */ new Set();
	const nativeCustody = createPluginNativeCaptureCustody(instanceRoots);
	process.once("exit", () => {
		for (const [key, instance] of instances) try {
			const root = retireInstance(key, instance);
			if (root) removeInstanceSync(root, instance.pendingNative);
		} catch (error) {
			process.stderr.write(`Plugin source capture exit cleanup failed: ${String(error)}\n`);
		}
	});
	return {
		instances: /* @__PURE__ */ new Map(),
		ownedRoots: instanceRoots,
		...nativeCustody,
		sweeps: /* @__PURE__ */ new Map(),
		warningBackoff: /* @__PURE__ */ new Map()
	};
});
function retireInstance(key, instance) {
	if (instance.root && retainLoadedPluginSourceCapture(instance.root)) {
		instance.references.clear();
		scheduleCaptureCleanup(key, instance);
		return;
	}
	instance.closing = true;
	let removalRoot = instance.root;
	try {
		instance.token?.(true);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		instance.token?.();
		removalRoot = void 0;
	}
	if (instance.root) ownedRoots.delete(instance.root);
	instance.references.clear();
	instances.delete(key);
	scheduleCaptureCleanup(key, instance);
	return removalRoot;
}
function warn(error) {
	process.emitWarning(`Plugin source capture cleanup: ${String(error)}`);
}
/** Reclamation owns an existing native token until its captured payload is gone. */
async function reclaimInstance(directory, originalDirectory, nativeMaintenance) {
	const ownerPath = path.join(directory, SQLITE_STAGING_TOKEN_FILES[0]);
	const family = SQLITE_STAGING_TOKEN_FILES.map((file) => fs.lstatSync(path.join(directory, file), { throwIfNoEntry: false }));
	const originalOwner = family[0];
	const captures = path.join(directory, "captures");
	const captured = fs.lstatSync(captures, { throwIfNoEntry: false });
	if (process.getuid && originalDirectory.uid !== process.getuid() || !originalOwner || family.some((file) => file && (!file.isFile() || file.nlink !== 1 || process.getuid && file.uid !== process.getuid())) || captured && !captured.isDirectory()) return;
	const unchanged = () => {
		const currentDirectory = fs.lstatSync(directory);
		const currentOwner = fs.lstatSync(ownerPath);
		return currentDirectory.dev === originalDirectory.dev && currentDirectory.ino === originalDirectory.ino && currentDirectory.isDirectory() && currentOwner.isFile() && currentOwner.nlink === 1 && currentOwner.dev === originalOwner.dev && currentOwner.ino === originalOwner.ino;
	};
	const release = acquireSqliteStagingToken(directory, "reclaim");
	let released = false;
	const errors = [];
	ownedRoots.add(directory);
	try {
		if (!unchanged()) return;
		const native = path.join(directory, "native");
		const nativeStat = fs.lstatSync(native, { throwIfNoEntry: false });
		await fs$1.rm(captures, {
			recursive: true,
			force: true
		});
		let retainedNative = Boolean(nativeStat);
		if (nativeStat?.isDirectory() && nativeMaintenance) {
			for (const nativeEntry of await fs$1.readdir(native, { withFileTypes: true })) {
				const nativeDirectory = path.join(native, nativeEntry.name);
				if (!nativeEntry.isDirectory()) continue;
				nativeMaintenance.assertCurrent();
				if (!unchanged()) return;
				const contained = (file) => file.startsWith(nativeDirectory + path.sep);
				if ([...nativeMaintenance.retainedPaths].some(contained) || [...nativeReferences.keys()].some(contained)) continue;
				retiringNativeRoots.add(nativeDirectory);
				try {
					await fs$1.rm(nativeDirectory, {
						recursive: true,
						force: true
					});
					nativeMaintenance.removed.push(nativeDirectory);
				} finally {
					retiringNativeRoots.delete(nativeDirectory);
				}
			}
			retainedNative = (await fs$1.readdir(native)).length > 0;
		}
		release(true);
		released = true;
		if (!retainedNative && unchanged()) {
			nativeMaintenance?.assertCurrent();
			await fs$1.rm(directory, {
				recursive: true,
				force: true
			});
		}
	} catch (error) {
		errors.push(error);
	} finally {
		try {
			if (!released) release();
		} catch (error) {
			errors.push(error);
		} finally {
			ownedRoots.delete(directory);
		}
		throwSqliteLifecycleErrors(errors, "Plugin source reclamation and cleanup failed");
	}
}
function removeInstanceSync(root, pendingNative = []) {
	if (retainLoadedPluginSourceCapture(root)) return;
	fs.rmSync(path.join(root, "captures"), {
		recursive: true,
		force: true
	});
	for (const directory of pendingNative) fs.rmSync(directory, {
		recursive: true,
		force: true
	});
	const native = path.join(root, "native");
	if (!fs.existsSync(native) || fs.readdirSync(native).length === 0) fs.rmSync(root, {
		recursive: true,
		force: true
	});
}
async function reclaimInstances(root, recordFailure, legacy = false, nativeMaintenance, fallbackPrefix) {
	let entries;
	try {
		entries = await fs$1.readdir(root, { withFileTypes: true });
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		return;
	}
	if (entries.length === 0) return;
	const cutoff = Date.now() - CAPTURE_GRACE_MS;
	let legacyAllowed;
	const lstatIfPresent = (file) => fs$1.lstat(file).catch((error) => {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	});
	for (const entry of entries) {
		if (!entry.isDirectory() || legacy && !isLegacyPluginSourceCaptureName(entry.name) || fallbackPrefix && !entry.name.startsWith(fallbackPrefix)) continue;
		const directory = path.join(root, entry.name);
		try {
			const stat = await fs$1.lstat(directory);
			const changed = legacy ? Math.max(stat.mtimeMs, stat.ctimeMs, stat.birthtimeMs) : stat.mtimeMs;
			if (!stat.isDirectory() || changed > cutoff && !nativeMaintenance?.startup) continue;
			const canonical = await fs$1.realpath(directory);
			if (ownedRoots.has(canonical) || retainLoadedPluginSourceCapture(canonical)) continue;
			const tokenPath = path.join(canonical, SQLITE_STAGING_TOKEN_FILES[0]);
			const nativeStat = await lstatIfPresent(path.join(canonical, "native"));
			const tokenStat = await lstatIfPresent(tokenPath);
			if (legacy && tokenStat) continue;
			if (!tokenStat) {
				if (fallbackPrefix || changed > cutoff) continue;
				if (nativeStat) continue;
				if (legacy) {
					if (legacyAllowed === void 0) {
						const { inspectOtherOpenClawProcesses } = await import("./openclaw-process-census-BocFHlra.mjs");
						const census = inspectOtherOpenClawProcesses();
						legacyAllowed = "error" in census || census.pids.length === 0;
					}
					if (!legacyAllowed) continue;
					if (process.getuid && (await fs$1.lstat(canonical)).uid !== process.getuid()) continue;
				}
				const retired = path.join(root, `${legacy ? PLUGIN_SOURCE_CAPTURE_PREFIX : ""}${randomUUID()}`);
				await fs$1.rename(canonical, retired);
				await fs$1.rm(retired, {
					recursive: true,
					force: true
				});
				continue;
			}
			await reclaimInstance(canonical, stat, nativeMaintenance);
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT") && !isSqliteLockError(error)) recordFailure(error);
		}
	}
}
/** The caller holds database maintenance and supplies a fresh installed-index reference set. */
async function prunePluginNativeCaptureDirectories(stateDir, retainedPaths, assertCurrent, options = {}) {
	const removed = [];
	const warnings = [];
	assertCurrent();
	const recordFailure = (error) => warnings.push(formatErrorMessage(error));
	const maintenance = {
		retainedPaths,
		assertCurrent,
		removed,
		...options
	};
	await reclaimInstances(path.resolve(resolvePluginSourceCapturesDirectory(stateDir)), recordFailure, false, maintenance).catch(recordFailure);
	await reclaimInstances(tmpdir(), recordFailure, false, maintenance, resolvePluginSourceCaptureFallbackPrefix(stateDir)).catch(recordFailure);
	return {
		removed,
		warnings
	};
}
/** Coalesce active scans, but throttle diagnostics independently of cleanup retries. */
function sweepPluginSourceCaptureDirectories(stateDir) {
	const root = path.resolve(resolvePluginSourceCapturesDirectory(stateDir));
	let sweep = sweeps.get(root);
	if (!sweep) {
		let failures = 0;
		let firstFailure;
		const recordFailure = (error) => {
			if (failures++ === 0) firstFailure = error;
		};
		sweep = reclaimInstances(root, recordFailure).catch(recordFailure).then(() => reclaimInstances(tmpdir(), recordFailure, false, void 0, resolvePluginSourceCaptureFallbackPrefix(stateDir))).catch(recordFailure).then(async () => {
			const visited = /* @__PURE__ */ new Set();
			for (const candidate of [path.join(stateDir, "tmp"), tmpdir()]) try {
				const directory = await fs$1.realpath(candidate);
				if (!visited.has(directory)) {
					visited.add(directory);
					await reclaimInstances(directory, recordFailure, true);
				}
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT")) recordFailure(error);
			}
		}).then(() => {
			if (failures === 0) {
				warningBackoff.delete(root);
				return;
			}
			const now = Date.now();
			const previous = warningBackoff.get(root);
			if (previous && now < previous.next) return;
			const delay = Math.min((previous?.delay ?? CAPTURE_GRACE_MS / 2) * 2, 24 * CAPTURE_GRACE_MS);
			if (!previous && warningBackoff.size >= 32) {
				const oldest = warningBackoff.keys().next().value;
				if (oldest !== void 0) warningBackoff.delete(oldest);
			}
			warningBackoff.set(root, {
				next: now + delay,
				delay
			});
			warn(`${failures} cleanup failure(s) in ${root}; will retry. First: ${formatErrorMessage(firstFailure)}`);
		}).finally(() => sweeps.delete(root));
		sweeps.set(root, sweep);
	}
	return sweep;
}
function createCaptureDirectory(instance, prefix, kind = "captures") {
	const { stateDir, placement } = instance.storage;
	if (instance.root) {
		const captures = path.join(instance.root, kind);
		try {
			return fs.mkdtempSync(path.join(captures, prefix));
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
			fs.mkdirSync(captures, { mode: 448 });
			return fs.mkdtempSync(path.join(captures, prefix));
		}
	}
	const prepare = (fallback) => {
		let directory;
		let token;
		try {
			if (fallback) directory = fs.mkdtempSync(path.join(tmpdir(), resolvePluginSourceCaptureFallbackPrefix(stateDir)));
			else {
				const parent = resolvePluginSourceCapturesDirectory(stateDir);
				fs.mkdirSync(parent, {
					recursive: true,
					mode: 448
				});
				instance.managedRoot = fs.realpathSync(parent);
				const candidate = path.join(instance.managedRoot, randomUUID());
				fs.mkdirSync(candidate, { mode: 448 });
				directory = candidate;
			}
			const canonical = fs.realpathSync(directory);
			token = acquireSqliteStagingToken(canonical, "create");
			const captures = path.join(canonical, kind);
			fs.mkdirSync(captures, { mode: 448 });
			const capture = fs.mkdtempSync(path.join(captures, prefix));
			instance.root = canonical;
			instance.token = token;
			ownedRoots.add(canonical);
			return capture;
		} catch (error) {
			try {
				token?.(true);
			} catch (releaseError) {
				instance.root = directory;
				instance.token = token;
				instance.closing = true;
				if (directory) ownedRoots.add(directory);
				throw createSqliteLifecycleAggregateError([error, releaseError], "Plugin source preparation cleanup failed", error);
			}
			if (directory) try {
				removeInstanceSync(directory);
			} catch (cleanupError) {
				warn(cleanupError);
			}
			throw error;
		}
	};
	if (placement === "temporary") return prepare(true);
	try {
		return prepare(false);
	} catch (error) {
		if (instance.closing) throw error;
		warn(error);
		return prepare(true);
	}
}
function scheduleCaptureCleanup(key, instance) {
	const scheduler = [...instance.references].findLast((reference) => reference.scheduler && !reference.scheduler.signal.aborted)?.scheduler ?? void 0;
	if (instance.scheduler === scheduler) return;
	instance.scheduler = scheduler;
	instance.cleanupScope?.beginClose();
	instance.cleanupScope = void 0;
	if (!scheduler || instance.storage.placement === "temporary") return;
	const scope = scheduler.scope();
	instance.cleanupScope = scope;
	scope.signal.addEventListener("abort", () => scheduleCaptureCleanup(key, instance), { once: true });
	runInPluginSourceCaptureContext(() => scope.schedule({
		id: `plugin-source-captures:${key}`,
		delayMs: CAPTURE_GRACE_MS,
		everyMs: CAPTURE_GRACE_MS,
		run: () => sweepPluginSourceCaptureDirectories(instance.storage.stateDir)
	}));
}
/** Artifact custody survives until every producer and metadata owner releases it. */
function retainPluginSourceCaptureInstance(stateDir, placement) {
	const storage = resolvePluginSourceCaptureStorage(stateDir, placement);
	const key = JSON.stringify([storage.stateDir, storage.placement]);
	const maintenance = pluginSourceCaptureMaintenance.getStore();
	const scheduler = maintenance?.scheduler;
	scheduler?.signal.throwIfAborted();
	let instance = instances.get(key);
	if (instance?.closing) throw new Error("Plugin source instance cleanup is incomplete; retry cleanup before creating captures");
	if (!instance) {
		instance = {
			storage,
			references: /* @__PURE__ */ new Set(),
			pendingNative: /* @__PURE__ */ new Set()
		};
		instances.set(key, instance);
		if (storage.placement === "state") {
			if (maintenance) maintenance.run(() => sweepPluginSourceCaptureDirectories(storage.stateDir));
			else sweepPluginSourceCaptureDirectories(storage.stateDir);
		}
	}
	const reference = { scheduler: scheduler ?? null };
	instance.references.add(reference);
	scheduleCaptureCleanup(key, instance);
	const retained = instance;
	let released = false;
	const retire = () => {
		if (released) return;
		if (retained.references.size > 1) {
			retained.references.delete(reference);
			scheduleCaptureCleanup(key, retained);
			released = true;
			return;
		}
		const root = retireInstance(key, retained);
		released = true;
		return root;
	};
	return {
		startMaintenance(ownerScheduler) {
			if (released || retained.closing) throw new Error("Plugin source instance has been released");
			ownerScheduler.signal.throwIfAborted();
			reference.scheduler = ownerScheduler;
			scheduleCaptureCleanup(key, retained);
			return storage.placement === "temporary" ? Promise.resolve() : sweepPluginSourceCaptureDirectories(storage.stateDir);
		},
		get managedRoot() {
			return retained.managedRoot;
		},
		createDirectory(prefix = PLUGIN_SOURCE_CAPTURE_PREFIX) {
			if (released || retained.closing) throw new Error("Plugin source instance has been released");
			return createCaptureDirectory(retained, prefix);
		},
		createNativeDirectory() {
			if (released || retained.closing) throw new Error("Plugin source instance has been released");
			const directory = createCaptureDirectory(retained, "admission-", "native");
			retained.pendingNative.add(directory);
			return {
				directory,
				commit: () => retained.pendingNative.delete(directory)
			};
		},
		release() {
			const root = retire();
			if (root) removeInstanceSync(root, retained.pendingNative);
		},
		async releaseAsync() {
			const scope = retained.cleanupScope;
			const root = retire();
			if (scope !== retained.cleanupScope) await scope?.stop();
			if (retained.references.size === 0) await sweeps.get(path.resolve(resolvePluginSourceCapturesDirectory(storage.stateDir)));
			if (root) try {
				await fs$1.rm(path.join(root, "captures"), {
					recursive: true,
					force: true
				});
				for (const directory of retained.pendingNative) await fs$1.rm(directory, {
					recursive: true,
					force: true
				});
				if ((await fs$1.readdir(path.join(root, "native")).catch((error) => {
					if (!hasErrnoCode(error, "ENOENT")) throw error;
					return [];
				})).length === 0) await fs$1.rm(root, {
					recursive: true,
					force: true
				});
			} catch (error) {
				warn(error);
			}
		}
	};
}
/** Native snapshots become durable only after their installed-index receipt is published. */
function createPluginNativeCaptureRoot(stateDir, placement) {
	const instance = retainPluginSourceCaptureInstance(stateDir, placement);
	try {
		const root = instance.createNativeDirectory();
		let committed = false;
		let disposed = false;
		return {
			directory: root.directory,
			commit() {
				if (disposed) throw new Error("Plugin native capture has been disposed");
				root.commit();
				committed = true;
			},
			dispose() {
				if (!disposed) {
					if (!committed && !retainLoadedPluginSourceCapture(root.directory)) fs.rmSync(root.directory, {
						recursive: true,
						force: true
					});
					disposed = true;
					instance.release();
				}
			},
			async disposeAsync() {
				if (!disposed) {
					if (!committed && !retainLoadedPluginSourceCapture(root.directory)) await removeTemporaryArtifacts(root.directory, "Plugin native capture");
					disposed = true;
					await instance.releaseAsync();
				}
			}
		};
	} catch (error) {
		instance.release();
		throw error;
	}
}
/** The producer retains this root until its worker has confirmed exit. */
function createPluginSourceCaptureRoot(stateDir, prefix) {
	const instance = retainPluginSourceCaptureInstance(stateDir);
	try {
		const directory = instance.createDirectory(prefix);
		return {
			directory,
			managedRoot: instance.managedRoot,
			release: async () => {
				if (!retainLoadedPluginSourceCapture(directory)) await removeTemporaryArtifacts(directory, "Plugin source worker");
				await instance.releaseAsync();
			}
		};
	} catch (error) {
		instance.release();
		throw error;
	}
}
//#endregion
export { retainLoadedPluginSourceCapture as a, prunePluginNativeCaptureDirectories as i, createPluginSourceCaptureRoot as n, retainPluginNativeCapturePath as o, isPluginSourceCaptureRetained as r, retainPluginSourceCaptureInstance as s, createPluginNativeCaptureRoot as t };
