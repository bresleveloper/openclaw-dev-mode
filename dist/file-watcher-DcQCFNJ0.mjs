import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import "./memory-core-host-engine-storage-Dt5aD7j9.mjs";
import { o as matchesExtraMemoryPathEntry, s as normalizeExtraMemoryPathEntries } from "./internal-CDL7w83q.mjs";
import { n as isFileMissingError } from "./fs-utils-BVDi6fm8.mjs";
import { r as classifyMemoryMultimodalPath } from "./multimodal-BBZswXZ7.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import { t as getFileWatchCapacityCode } from "./fs-watch-errors-D0zoLJOB.mjs";
import "./setup-tools-D_Fbo3nn.mjs";
import "./file-access-runtime-CWjkXCju.mjs";
import "./memory-core-host-engine-embeddings-B_fgzgsI.mjs";
import "./memory-core-host-engine-foundation-wgSi2CJX.mjs";
import fs from "node:fs";
import path from "node:path";
import chokidar from "chokidar";
//#region extensions/memory-core/src/memory/watch-pressure.ts
const MEMORY_WATCH_PRESSURE_WARNING_THRESHOLD = 2e3;
function countChokidarWatchedEntries(watcher) {
	const watched = watcher.getWatched();
	let count = Object.keys(watched).length;
	for (const entries of Object.values(watched)) count += entries.length;
	return count;
}
function warnIfMemoryWatchPressureHigh(state, count, unit, pressureDetail, remediation, warn) {
	if (state.shown || count <= MEMORY_WATCH_PRESSURE_WARNING_THRESHOLD) return false;
	state.shown = true;
	warn(`Memory file watching is tracking ${count} ${unit}. ${pressureDetail} ${remediation}`);
	return true;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-watch-resources.ts
const MEMORY_WATCH_PRESSURE_STARTUP_CHECK_DELAY_MS = 1e4;
const log$1 = createSubsystemLogger("memory");
var MemoryFileWatchResources = class {
	constructor(agentId, onUnavailable) {
		this.agentId = agentId;
		this.onUnavailable = onUnavailable;
		this.closed = false;
		this.watcher = null;
		this.memoryWatchPressureStartupTimer = null;
		this.nativeMemoryWatchPairs = [];
		this.memoryWatchPressureWarning = { shown: false };
		this.memoryWatchCapacityDegraded = false;
	}
	get capacityDegraded() {
		return this.memoryWatchCapacityDegraded;
	}
	scheduleMemoryWatchPressureStartupCheck() {
		if (this.memoryWatchPressureStartupTimer || this.memoryWatchPressureWarning.shown || this.closed || this.nativeMemoryWatchPairs.length === 0 && !this.watcher) return;
		this.memoryWatchPressureStartupTimer = setTimeout(() => {
			this.memoryWatchPressureStartupTimer = null;
			if (this.closed || this.memoryWatchPressureWarning.shown) return;
			if (this.watcher) this.warnIfMemoryWatchPressure(countChokidarWatchedEntries(this.watcher), "paths");
			if (this.memoryWatchPressureWarning.shown) return;
			let directoryCount = 0;
			for (const pair of this.nativeMemoryWatchPairs) directoryCount += pair.treeWatchers?.size ?? 0;
			this.warnIfMemoryWatchPressure(directoryCount, "directories");
		}, MEMORY_WATCH_PRESSURE_STARTUP_CHECK_DELAY_MS);
	}
	warnIfMemoryWatchPressure(count, unit) {
		const reindexCommand = formatCliCommand(`openclaw memory index --force --agent ${this.agentId}`);
		warnIfMemoryWatchPressureHigh(this.memoryWatchPressureWarning, count, unit, "Large memory folders or extraPaths can make OpenClaw run out of file watchers or open files.", `Remove unnecessary memory.search.extraPaths entries or narrow their directory roots, including per-agent entries; otherwise review the host's file-watch/open-file limits. After changes, restart the Gateway. To refresh the affected index, run in the Gateway's environment: ${reindexCommand}.`, (message) => log$1.warn(message));
	}
	closeNativeMemoryWatchChildren(pair) {
		if (pair.treeWatchers) {
			for (const entry of pair.treeWatchers.values()) try {
				entry.watcher.close();
			} catch {}
			pair.treeWatchers.clear();
		} else if (pair.main) try {
			pair.main.close();
		} catch {}
		pair.main = null;
	}
	closeNativeMemoryWatchPair(pair) {
		this.closeNativeMemoryWatchChildren(pair);
		if (pair.parent) {
			try {
				pair.parent.close();
			} catch {}
			pair.parent = null;
		}
		this.removeNativeMemoryWatchPair(pair);
	}
	closeNativeMemoryWatchPairs() {
		while (this.nativeMemoryWatchPairs.length > 0) {
			const pair = this.nativeMemoryWatchPairs[0];
			if (!pair) return;
			this.closeNativeMemoryWatchPair(pair);
		}
	}
	degradeMemoryWatchCapacity(watchPath, err, markDirty) {
		const code = getFileWatchCapacityCode(err);
		if (!code) return false;
		if (this.memoryWatchCapacityDegraded) return true;
		this.memoryWatchCapacityDegraded = true;
		this.onUnavailable();
		this.closeNativeMemoryWatchPairs();
		const watcher = this.watcher;
		if (watcher) {
			watcher.close().catch((error) => {
				log$1.warn(`memory watcher close failed: ${String(error)}`);
			});
			watcher.on("error", () => {});
		}
		markDirty();
		log$1.warn(`memory watcher capacity exhausted on ${watchPath} (${code}); watching disabled, memory will refresh on search`);
		return true;
	}
	removeNativeMemoryWatchPair(pair) {
		const idx = this.nativeMemoryWatchPairs.indexOf(pair);
		if (idx >= 0) this.nativeMemoryWatchPairs.splice(idx, 1);
	}
};
//#endregion
//#region extensions/memory-core/src/memory/watch-settle.ts
const MEMORY_WATCH_SETTLE_RECHECK_MS = 100;
function snapshotFromStats(stats) {
	if (!stats || stats.isDirectory?.()) return null;
	if (typeof stats.size !== "number" || typeof stats.mtimeMs !== "number") return null;
	return {
		size: stats.size,
		mtimeMs: stats.mtimeMs
	};
}
function snapshotsMatch(left, right) {
	if (left === null || right === null) return left === right;
	return left.size === right.size && left.mtimeMs === right.mtimeMs;
}
function snapshotPath(filePath) {
	try {
		const stats = fs.statSync(filePath);
		if (stats.isDirectory()) return null;
		return {
			size: stats.size,
			mtimeMs: stats.mtimeMs
		};
	} catch {
		return null;
	}
}
function recordMemoryWatchEventPath(queue, watchPath, stats) {
	if (!watchPath) return;
	const trimmed = watchPath.trim();
	if (!trimmed) return;
	queue.set(path.resolve(trimmed), snapshotFromStats(stats));
}
async function settleMemoryWatchEventPaths(queue) {
	if (queue.size === 0) return true;
	const entries = Array.from(queue.entries());
	queue.clear();
	const missingBaseline = [];
	for (const [filePath, previousSnapshot] of entries) {
		const currentSnapshot = snapshotPath(filePath);
		if (previousSnapshot === null) {
			if (currentSnapshot !== null) missingBaseline.push({
				filePath,
				snapshot: currentSnapshot
			});
			continue;
		}
		if (!snapshotsMatch(previousSnapshot, currentSnapshot)) queue.set(filePath, currentSnapshot);
	}
	if (missingBaseline.length > 0) {
		await sleep(MEMORY_WATCH_SETTLE_RECHECK_MS);
		for (const entry of missingBaseline) {
			const currentSnapshot = snapshotPath(entry.filePath);
			if (!snapshotsMatch(entry.snapshot, currentSnapshot)) queue.set(entry.filePath, currentSnapshot);
		}
	}
	return queue.size === 0;
}
//#endregion
//#region extensions/memory-core/src/memory/file-watcher.ts
const IGNORED_MEMORY_WATCH_DIR_NAMES = /* @__PURE__ */ new Set([
	".git",
	"node_modules",
	".pnpm-store",
	".venv",
	"venv",
	".tox",
	"__pycache__"
]);
const log = createSubsystemLogger("memory");
const TEST_MEMORY_WATCH_FACTORY_KEY = Symbol.for("openclaw.test.memoryWatchFactory");
const TEST_MEMORY_NATIVE_WATCH_FACTORY_KEY = Symbol.for("openclaw.test.memoryNativeWatchFactory");
function resolveMemoryWatchFactory() {
	if (process.env.VITEST === "true" || false) {
		const override = Reflect.get(globalThis, TEST_MEMORY_WATCH_FACTORY_KEY);
		if (typeof override === "function") return override;
	}
	return chokidar.watch.bind(chokidar);
}
function resolveMemoryNativeWatchFactory() {
	if (process.env.VITEST === "true" || false) {
		const override = Reflect.get(globalThis, TEST_MEMORY_NATIVE_WATCH_FACTORY_KEY);
		if (typeof override === "function") return override;
	}
	return fs.watch.bind(fs);
}
function shouldIgnoreMemoryWatchPath(watchPath, stats, multimodalSettings) {
	const normalized = path.normalize(watchPath);
	if (normalized.split(path.sep).map((segment) => normalizeLowercaseStringOrEmpty(segment)).some((segment) => IGNORED_MEMORY_WATCH_DIR_NAMES.has(segment))) return true;
	if (stats?.isDirectory?.()) return false;
	if (!stats) return false;
	const extension = normalizeLowercaseStringOrEmpty(path.extname(normalized));
	if (extension.length === 0 || extension === ".md") return false;
	if (!multimodalSettings) return true;
	return classifyMemoryMultimodalPath(normalized, multimodalSettings) === null;
}
function runDetachedMemorySync(sync, reason) {
	sync().catch((err) => {
		log.warn(`memory sync failed (${reason}): ${String(err)}`);
	});
}
/** Native Memory file coverage and settling, independent of index or provider state. */
var MemoryFileWatcher = class extends MemoryFileWatchResources {
	constructor(options) {
		super(options.agentId, options.onUnavailable);
		this.options = options;
		this.pendingWatchPaths = /* @__PURE__ */ new Map();
		this.watchTimer = null;
		this.workspaceDir = options.workspaceDir;
		this.settings = options.settings;
	}
	start() {
		if (this.closed) return;
		if (this.memoryWatchCapacityDegraded || this.watcher || this.nativeMemoryWatchPairs.length > 0) return;
		const fileWatchPaths = /* @__PURE__ */ new Set([path.join(this.workspaceDir, "MEMORY.md"), path.join(this.workspaceDir, "USER.md")]);
		const memoryDir = path.join(this.workspaceDir, "memory");
		const dirWatchPaths = /* @__PURE__ */ new Set([memoryDir]);
		const additionalPaths = normalizeExtraMemoryPathEntries(this.workspaceDir, this.settings.extraPaths);
		for (const entry of additionalPaths) try {
			const stat = fs.lstatSync(entry.path);
			if (stat.isSymbolicLink()) continue;
			if (stat.isDirectory()) {
				dirWatchPaths.add(entry.path);
				continue;
			}
			if (stat.isFile() && (normalizeLowercaseStringOrEmpty(entry.path).endsWith(".md") || classifyMemoryMultimodalPath(entry.path, this.settings.multimodal) !== null)) fileWatchPaths.add(entry.path);
		} catch {
			continue;
		}
		const markDirty = (watchPath, stats) => {
			if (watchPath && stats && !stats.isDirectory?.()) {
				const normalizedWatchPath = path.resolve(watchPath);
				const matchingEntries = isPathInside(memoryDir, normalizedWatchPath) ? [] : additionalPaths.filter((entry) => isPathInside(entry.path, normalizedWatchPath));
				if (matchingEntries.length > 0 && !matchingEntries.some((entry) => matchesExtraMemoryPathEntry(entry, normalizedWatchPath))) return;
			}
			recordMemoryWatchEventPath(this.pendingWatchPaths, watchPath, stats);
			this.options.onDirty?.();
			this.scheduleWatchSync();
		};
		const nativeRecursiveSupported = process.platform === "darwin" || process.platform === "win32";
		for (const dir of dirWatchPaths) {
			if ((nativeRecursiveSupported ? this.attachNativeMemoryWatchForDir(dir, markDirty) : process.platform === "linux" ? this.attachLinuxMemoryDirectoryTreeWatchForDir(dir, markDirty) : "failed") !== "attached") fileWatchPaths.add(dir);
			if (this.memoryWatchCapacityDegraded) return;
		}
		if (fileWatchPaths.size > 0) this.attachMemoryChokidarPaths(Array.from(fileWatchPaths), markDirty);
		this.scheduleMemoryWatchPressureStartupCheck();
	}
	attachNativeMemoryWatchForDir(dir, markDirty) {
		if (this.closed) return "failed";
		let recordedInode;
		try {
			recordedInode = fs.statSync(dir).ino;
		} catch (err) {
			return isFileMissingError(err) ? "missing" : "failed";
		}
		const pair = {
			dir,
			main: null,
			parent: null
		};
		let mainWatcher;
		try {
			mainWatcher = resolveMemoryNativeWatchFactory()(dir, { recursive: true }, (_eventType, filename) => {
				if (this.closed || mainWatcher && pair.main !== mainWatcher) return;
				if (filename == null) {
					markDirty();
					return;
				}
				const full = path.join(dir, filename);
				let stats;
				try {
					stats = fs.lstatSync(full, { throwIfNoEntry: false }) ?? void 0;
				} catch {
					stats = void 0;
				}
				if (shouldIgnoreMemoryWatchPath(full, stats, this.settings.multimodal)) return;
				markDirty(full, stats);
			});
		} catch (err) {
			if (isFileMissingError(err)) return "missing";
			if (this.degradeMemoryWatchCapacity(dir, err, markDirty)) return "failed";
			log.warn(`failed to start native recursive watcher on ${dir}: ${String(err)}; falling back to chokidar`);
			return "failed";
		}
		pair.main = mainWatcher;
		mainWatcher.on("error", (err) => {
			if (pair.main !== mainWatcher) return;
			if (this.degradeMemoryWatchCapacity(dir, err, markDirty)) return;
			const message = err instanceof Error ? err.message : String(err);
			log.warn(`memory native watcher error on ${dir}: ${message}`);
			this.closeNativeMemoryWatchPair(pair);
			if (this.closed) return;
			markDirty();
			this.attachMemoryChokidarFallback(dir, markDirty);
		});
		this.nativeMemoryWatchPairs.push(pair);
		this.attachNativeMemoryParentWatch(pair, recordedInode, markDirty, "native", () => this.attachNativeMemoryWatchForDir(dir, markDirty));
		return "attached";
	}
	attachNativeMemoryParentWatch(pair, recordedInode, markDirty, label, reattach) {
		const { dir } = pair;
		let watchedInode = recordedInode;
		const parentDir = path.dirname(dir);
		const baseName = path.basename(dir);
		let parentInode;
		try {
			parentInode = fs.statSync(parentDir).ino;
		} catch (err) {
			log.warn(`memory ${label} parent watcher could not start on ${parentDir}: ${String(err)}`);
			return;
		}
		try {
			let parentWatcher = null;
			parentWatcher = resolveMemoryNativeWatchFactory()(parentDir, { recursive: false }, (_eventType, filename) => {
				if (this.closed || parentWatcher && pair.parent !== parentWatcher) return;
				if (filename !== null && filename !== baseName && (pair.main || filename !== path.basename(parentDir))) return;
				let currentInode = null;
				let result = "missing";
				try {
					currentInode = fs.statSync(dir).ino;
				} catch (err) {
					result = isFileMissingError(err) ? "missing" : "failed";
					if (result === "missing") try {
						if (fs.statSync(parentDir).ino !== parentInode) result = "failed";
					} catch {
						result = "failed";
					}
				}
				if (currentInode === watchedInode && result !== "failed") return;
				this.closeNativeMemoryWatchChildren(pair);
				watchedInode = null;
				markDirty();
				if (currentInode !== null) result = reattach();
				if (result === "missing") return;
				this.closeNativeMemoryWatchPair(pair);
				if (result === "failed") this.attachMemoryChokidarFallback(dir, markDirty);
			});
			const attachedParent = parentWatcher;
			attachedParent.on("error", (err) => {
				if (pair.parent !== attachedParent) return;
				if (this.degradeMemoryWatchCapacity(dir, err, markDirty)) return;
				const message = err instanceof Error ? err.message : String(err);
				log.warn(`memory ${label} parent watcher error on ${path.dirname(dir)}: ${message}`);
				try {
					attachedParent.close();
				} catch {}
				pair.parent = null;
				if (!pair.main) {
					this.closeNativeMemoryWatchPair(pair);
					if (!this.closed) {
						markDirty();
						this.attachMemoryChokidarFallback(dir, markDirty);
					}
				}
			});
			pair.parent = attachedParent;
		} catch (err) {
			if (this.degradeMemoryWatchCapacity(dir, err, markDirty)) return;
			log.warn(`memory ${label} parent watcher could not start on ${path.dirname(dir)}: ${String(err)}`);
		}
	}
	attachLinuxMemoryDirectoryTreeWatchForDir(dir, markDirty) {
		if (this.closed) return "failed";
		let recordedInode;
		try {
			recordedInode = fs.statSync(dir).ino;
		} catch (err) {
			return isFileMissingError(err) ? "missing" : "failed";
		}
		let pair = null;
		const treeWatchers = /* @__PURE__ */ new Map();
		let rootMissing = false;
		const closeAndFallback = (message, cause) => {
			if (this.memoryWatchCapacityDegraded) return;
			if (cause !== void 0 && this.degradeMemoryWatchCapacity(dir, cause, markDirty)) return;
			log.warn(message);
			if (pair) this.closeNativeMemoryWatchPair(pair);
			if (this.closed) return;
			markDirty();
			this.attachMemoryChokidarFallback(dir, markDirty);
		};
		const closeDirectorySubtree = (watchDir) => {
			const watchDirPrefix = `${watchDir}${path.sep}`;
			for (const [entryDir, entry] of Array.from(treeWatchers.entries())) {
				if (entryDir !== watchDir && !entryDir.startsWith(watchDirPrefix)) continue;
				try {
					entry.watcher.close();
				} catch {}
				treeWatchers.delete(entryDir);
			}
		};
		const attachDirectory = (watchDir) => {
			if (this.closed) return null;
			let currentInode;
			try {
				const currentStat = fs.statSync(watchDir);
				if (!currentStat.isDirectory()) return null;
				currentInode = currentStat.ino;
			} catch (err) {
				rootMissing ||= watchDir === dir && isFileMissingError(err);
				return null;
			}
			const existing = treeWatchers.get(watchDir);
			if (existing) {
				if (existing.ino === currentInode) return existing.watcher;
				closeDirectorySubtree(watchDir);
			}
			let watcher;
			try {
				watcher = resolveMemoryNativeWatchFactory()(watchDir, { recursive: false }, (eventType, filename) => {
					if (this.closed || watcher && treeWatchers.get(watchDir)?.watcher !== watcher) return;
					if (filename == null) {
						markDirty();
						if (!this.attachLinuxSubtree(watchDir, attachDirectory)) closeAndFallback(`failed to refresh Linux memory directory watchers under ${watchDir}; falling back to chokidar`);
						return;
					}
					const full = path.join(watchDir, filename);
					let stats;
					try {
						stats = fs.lstatSync(full, { throwIfNoEntry: false }) ?? void 0;
					} catch {
						stats = void 0;
					}
					if (!stats) closeDirectorySubtree(full);
					if (stats?.isDirectory()) {
						if (eventType === "rename") closeDirectorySubtree(full);
						if (!this.attachLinuxSubtree(full, attachDirectory)) {
							closeAndFallback(`failed to attach Linux memory directory watcher under ${full}; falling back to chokidar`);
							return;
						}
					}
					if (shouldIgnoreMemoryWatchPath(full, stats, this.settings.multimodal)) return;
					markDirty(full, stats);
				});
			} catch (err) {
				rootMissing ||= watchDir === dir && isFileMissingError(err);
				if (this.degradeMemoryWatchCapacity(watchDir, err, markDirty)) return null;
				if (watchDir === dir && !rootMissing) log.warn(`failed to start Linux memory directory watcher on ${watchDir}: ${String(err)}; falling back to chokidar`);
				return null;
			}
			treeWatchers.set(watchDir, {
				watcher,
				ino: currentInode
			});
			watcher.on("error", (err) => {
				if (treeWatchers.get(watchDir)?.watcher !== watcher) return;
				const detail = err instanceof Error ? err.message : String(err);
				closeAndFallback(`memory Linux directory watcher error on ${watchDir}: ${detail}`, err);
			});
			return watcher;
		};
		const mainWatcher = attachDirectory(dir);
		if (!mainWatcher) return rootMissing ? "missing" : "failed";
		pair = {
			dir,
			main: mainWatcher,
			parent: null,
			treeWatchers
		};
		this.nativeMemoryWatchPairs.push(pair);
		let subtreeAttached = this.attachLinuxSubtree(dir, attachDirectory);
		try {
			subtreeAttached = fs.statSync(dir).ino === recordedInode && subtreeAttached;
		} catch (err) {
			this.closeNativeMemoryWatchPair(pair);
			if (!this.closed) markDirty();
			return isFileMissingError(err) ? "missing" : "failed";
		}
		if (!subtreeAttached) {
			closeAndFallback(`failed to attach Linux memory directory watcher subtree under ${dir}; falling back to chokidar`);
			return "attached";
		}
		this.attachNativeMemoryParentWatch(pair, recordedInode, markDirty, "Linux", () => this.attachLinuxMemoryDirectoryTreeWatchForDir(dir, markDirty));
		return "attached";
	}
	attachLinuxSubtree(root, attachDirectory) {
		let rootStats;
		try {
			rootStats = fs.lstatSync(root, { throwIfNoEntry: false }) ?? void 0;
		} catch {
			return false;
		}
		if (!rootStats?.isDirectory() || shouldIgnoreMemoryWatchPath(root, rootStats, this.settings.multimodal)) return true;
		if (!attachDirectory(root)) return false;
		let entries;
		try {
			entries = fs.readdirSync(root, { withFileTypes: true });
		} catch {
			return false;
		}
		for (const entry of entries) {
			if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
			if (!this.attachLinuxSubtree(path.join(root, entry.name), attachDirectory)) return false;
		}
		return true;
	}
	attachMemoryChokidarFallback(dir, markDirty) {
		if (this.closed || this.memoryWatchCapacityDegraded) return;
		try {
			this.attachMemoryChokidarPaths(dir, markDirty);
		} catch (err) {
			log.warn(`failed to attach chokidar fallback for ${dir}: ${String(err)}`);
		}
	}
	attachMemoryChokidarPaths(paths, markDirty) {
		if (this.closed || this.memoryWatchCapacityDegraded) return;
		if (this.watcher) {
			this.watcher.add(paths);
			return;
		}
		const watcher = resolveMemoryWatchFactory()(typeof paths === "string" ? [paths] : paths, {
			ignoreInitial: true,
			ignored: (watchPath, stats) => shouldIgnoreMemoryWatchPath(watchPath, stats, this.settings.multimodal)
		});
		this.watcher = watcher;
		watcher.on("add", markDirty);
		watcher.on("change", markDirty);
		watcher.on("unlink", markDirty);
		watcher.on("unlinkDir", markDirty);
		watcher.on("error", (err) => {
			if (this.degradeMemoryWatchCapacity("chokidar", err, markDirty)) return;
			const message = err instanceof Error ? err.message : String(err);
			log.warn(`memory watcher error: ${message}`);
		});
		watcher.once("ready", () => {
			this.warnIfMemoryWatchPressure(countChokidarWatchedEntries(watcher), "paths");
		});
	}
	async close() {
		this.closed = true;
		if (this.watchTimer) {
			clearTimeout(this.watchTimer);
			this.watchTimer = null;
		}
		if (this.memoryWatchPressureStartupTimer) {
			clearTimeout(this.memoryWatchPressureStartupTimer);
			this.memoryWatchPressureStartupTimer = null;
		}
		this.closeNativeMemoryWatchPairs();
		if (this.watcher) {
			await this.watcher.close();
			this.watcher = null;
		}
		this.pendingWatchPaths.clear();
	}
	scheduleWatchSync() {
		if (this.closed) return;
		if (this.watchTimer) clearTimeout(this.watchTimer);
		this.watchTimer = setTimeout(() => {
			this.watchTimer = null;
			runDetachedMemorySync(async () => {
				if (this.closed) return;
				if (!await settleMemoryWatchEventPaths(this.pendingWatchPaths)) {
					if (!this.closed) this.scheduleWatchSync();
					return;
				}
				if (this.closed) return;
				await this.options.onChange();
			}, "watch");
		}, this.settings.sync.watchDebounceMs);
	}
};
//#endregion
export { MemoryFileWatcher as t };
