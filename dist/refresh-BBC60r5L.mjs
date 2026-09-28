import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-BzetEUdq.mjs";
import { t as CONFIG_DIR } from "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { s as isDefaultStateDir } from "./paths-DehQwyE0.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-BNUXOhfF.mjs";
import { n as resolveWorkshopWatchRoots } from "./skills-root-Bd-leLaO.mjs";
import { l as resolveAllowedSkillSymlinkTargetRealPaths, u as tryRealpath } from "./local-loader-DP-Jr6_I.mjs";
import { a as markSkillsSupportingFilesChanged, c as resetSkillsRefreshStateForTest, d as suspendSkillsSnapshotSources, f as normalizeWorkspaceSkillRoots, l as setSkillsChangeListenerErrorHandler, p as resolveWorkspaceSkillDirectories, t as bumpSkillsSnapshotVersion } from "./refresh-state-NJJr9z6k.mjs";
import { t as areOrderedArraysEqual } from "./ordered-array-equality-CBhMoHgO.mjs";
import { n as resolveWorkspaceSkillSourcePlan, r as splitSkillSourcePlan } from "./workspace-skill-sources-nBU_kpUU.mjs";
import { i as resolvePluginSkillRootsFromMetadata, r as resolvePluginSkillRoots } from "./plugin-skills-CnAdRDnb.mjs";
import { t as getFileWatchCapacityCode } from "./fs-watch-errors-D0zoLJOB.mjs";
import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import os from "node:os";
import { EventEmitter } from "node:events";
import chokidar from "chokidar";
//#region src/skills/runtime/refresh-watch-close.ts
const pendingWatcherCloses = /* @__PURE__ */ new Set();
function trackSkillsWatcherClose(close) {
	const closing = (async () => {
		try {
			await close();
		} catch {}
	})();
	pendingWatcherCloses.add(closing);
	closing.then(() => pendingWatcherCloses.delete(closing));
	return closing;
}
function teardownSkillsPathWatcher(state) {
	const watcher = state.watcher;
	watcher.add = () => watcher;
	clearTimeout(state.timer);
	return trackSkillsWatcherClose(async () => {
		const wasClosed = watcher.closed;
		const closed = watcher.close();
		if (!wasClosed) watcher.on("error", () => {});
		await closed;
	});
}
async function joinSkillsWatcherCloses() {
	await Promise.all(pendingWatcherCloses);
}
//#endregion
//#region src/skills/runtime/refresh-watch-path.ts
function isTrustedSymlinkSkillTarget(source, rootRealPath, targetRealPath, allowedSymlinkTargetRealPaths) {
	if (source === "openclaw-managed" || source === "agents-skills-personal") return true;
	return isPathInside(rootRealPath, targetRealPath) || allowedSymlinkTargetRealPaths.some((root) => isPathInside(root, targetRealPath));
}
function toWatchRoot(raw) {
	const normalized = raw.replaceAll("\\", "/");
	const root = path.parse(normalized).root;
	const trimmed = normalized.replace(/\/+$/, "");
	return trimmed.length < root.length ? root : trimmed;
}
function resolveSkillsWatchPath(raw) {
	if (process.platform !== "win32") return raw;
	const absolute = path.resolve(raw);
	const root = path.parse(absolute).root;
	const parts = absolute.slice(root.length).split(path.sep);
	let cursor = root;
	let index = 0;
	for (const part of parts) {
		const next = path.join(cursor, part);
		try {
			if (fs.lstatSync(next).isSymbolicLink()) break;
		} catch {
			break;
		}
		cursor = next;
		index += 1;
	}
	try {
		const resolved = fs.realpathSync.native(cursor);
		return fs.existsSync(resolved) ? path.join(resolved, ...parts.slice(index)) : raw;
	} catch {
		return raw;
	}
}
const DEFAULT_SKILLS_WATCH_IGNORED = [
	/(^|[\\/])\.git([\\/]|$)/,
	/(^|[\\/])node_modules([\\/]|$)/,
	/(^|[\\/])dist([\\/]|$)/,
	/(^|[\\/])\.venv([\\/]|$)/,
	/(^|[\\/])venv([\\/]|$)/,
	/(^|[\\/])__pycache__([\\/]|$)/,
	/(^|[\\/])\.mypy_cache([\\/]|$)/,
	/(^|[\\/])\.pytest_cache([\\/]|$)/,
	/(^|[\\/])build([\\/]|$)/,
	/(^|[\\/])\.cache([\\/]|$)/
];
function shouldIgnoreSkillsWatchPath(watchPath, stats, usePolling = false) {
	if (DEFAULT_SKILLS_WATCH_IGNORED.some((re) => re.test(watchPath))) return true;
	if (stats?.isDirectory?.() || stats?.isSymbolicLink?.()) return false;
	if (!stats) return false;
	if (usePolling && isSkillDiscoveryFileWatchPath(watchPath)) return false;
	return true;
}
function isSkillDiscoveryFileWatchPath(watchPath) {
	const basename = path.posix.basename(watchPath.replaceAll("\\", "/"));
	return (basename === "SKILL.md" || basename === "source-origin.json") && !DEFAULT_SKILLS_WATCH_IGNORED.some((re) => re.test(watchPath));
}
function getRawWatchedPath(details) {
	return isRecord(details) && typeof details.watchedPath === "string" ? details.watchedPath : void 0;
}
function rawPathToString(rawPath) {
	if (typeof rawPath === "string") return rawPath || void 0;
	if (Buffer.isBuffer(rawPath)) return rawPath.toString() || void 0;
}
function resolveRawSkillsWatchPath(rawPath, details) {
	if (path.isAbsolute(rawPath)) return rawPath;
	const watchedPath = getRawWatchedPath(details);
	return watchedPath ? path.join(watchedPath, rawPath) : void 0;
}
function createSkillsWatchPathFilter(root, usePolling) {
	const directorySymlinks = /* @__PURE__ */ new Set();
	const contains = (watchPath) => isPathInside(root, watchPath) || isPathInside(watchPath, root);
	const isSupportingPath = (watchPath) => isPathInside(root, watchPath) && !DEFAULT_SKILLS_WATCH_IGNORED.some((re) => re.test(watchPath));
	return {
		isSupportingPath,
		isStructuralRaw: (event, rawPath, details) => {
			const name = rawPathToString(rawPath);
			const changedPath = name ? resolveRawSkillsWatchPath(name, details) : getRawWatchedPath(details);
			if (changedPath && !isSupportingPath(changedPath)) return false;
			if (!name || !changedPath) return true;
			if (!usePolling) return event !== "change";
			return [isRecord(details) ? details.curr : void 0, isRecord(details) ? details.prev : void 0].some((stats) => !isRecord(stats) || typeof stats.isDirectory !== "function" || stats.isDirectory());
		},
		ignored: (watchPath, stats) => {
			if (shouldIgnoreSkillsWatchPath(watchPath, stats, usePolling) || !contains(watchPath)) return true;
			if (stats?.isSymbolicLink?.()) try {
				if (fs.statSync(watchPath).isDirectory()) directorySymlinks.add(toWatchRoot(watchPath));
			} catch {}
			return false;
		},
		isRelevant: (event, changedPath) => {
			const symlinkKey = toWatchRoot(changedPath);
			const directorySymlink = directorySymlinks.has(symlinkKey);
			if (event === "unlink") directorySymlinks.delete(symlinkKey);
			return (isSkillDiscoveryFileWatchPath(changedPath) || event === "addDir" || event === "unlinkDir" || directorySymlink) && !DEFAULT_SKILLS_WATCH_IGNORED.some((re) => re.test(changedPath)) && contains(changedPath);
		}
	};
}
function resolveSkillsWatcherUsePolling() {
	const envPolling = process.env.CHOKIDAR_USEPOLLING;
	if (envPolling === void 0) return process.platform === "os400" || Boolean(process.versions.bun);
	const normalized = envPolling.toLowerCase();
	return Boolean(normalized) && normalized !== "false" && normalized !== "0";
}
function makeSkillsWatchTarget(raw, depth, previousWatchRoot) {
	const watchPath = toWatchRoot(previousWatchRoot ? raw : resolveSkillsWatchPath(raw));
	let watchRoot = watchPath;
	while (!fs.existsSync(watchRoot)) {
		const parent = path.dirname(watchRoot);
		if (parent === watchRoot) break;
		watchRoot = parent;
	}
	if (previousWatchRoot && previousWatchRoot !== watchRoot && isPathInside(previousWatchRoot, watchRoot)) {
		let cursor = previousWatchRoot;
		const parts = path.relative(previousWatchRoot, watchRoot).split(path.sep).filter(Boolean);
		for (const part of ["", ...parts]) {
			cursor = path.join(cursor, part);
			try {
				if (!fs.lstatSync(cursor).isSymbolicLink()) continue;
			} catch {}
			watchRoot = path.dirname(cursor);
			while (!fs.existsSync(watchRoot) && path.dirname(watchRoot) !== watchRoot) watchRoot = path.dirname(watchRoot);
			break;
		}
	}
	return {
		path: watchPath,
		watchRoot: toWatchRoot(watchRoot),
		depth
	};
}
function readBudgetedDirEntries(dir, maxEntries) {
	const entries = [];
	const limit = Math.max(0, maxEntries);
	let handle;
	try {
		handle = fs.opendirSync(dir);
		for (let scanned = 0; scanned < limit; scanned += 1) {
			const entry = handle.readSync();
			if (!entry) return {
				ok: true,
				entries,
				scannedEntryCount: scanned
			};
			entries.push(entry);
		}
		return {
			ok: true,
			entries,
			scannedEntryCount: limit
		};
	} catch {
		return {
			ok: false,
			scannedEntryCount: 0
		};
	} finally {
		handle?.closeSync();
	}
}
//#endregion
//#region src/skills/runtime/refresh-ancestor-native.ts
var NativeSkillsAncestorWatcher = class extends EventEmitter {
	constructor(watchRoot, ignored, rearm) {
		super();
		this.closed = false;
		this.failed = false;
		this.closure = createDeferredCore();
		try {
			this.watcher = fs.watch(watchRoot, (event, filename) => {
				if (this.closed || this.failed) return;
				const name = rawPathToString(filename);
				const rootChanged = !name || name === path.basename(watchRoot);
				const details = { watchedPath: watchRoot };
				const changedPath = rootChanged ? watchRoot : resolveRawSkillsWatchPath(name, details);
				if (!changedPath || ignored(changedPath)) return;
				this.emit("all", event === "rename" || rootChanged ? "ancestor" : "change", changedPath);
				if (!this.closed) this.emit("raw", event, filename, details);
				if (rootChanged && !this.closed) rearm();
			});
			this.watcher.on("close", () => this.closure.resolve());
			this.watcher.on("error", (error) => this.fail(error));
		} catch (error) {
			this.failed = true;
			this.closure.resolve();
			queueMicrotask(() => this.fail(error));
		}
		queueMicrotask(() => {
			if (!this.closed && !this.failed) this.emit("ready");
		});
	}
	fail(error) {
		this.failed = true;
		this.closure.resolve();
		if (!this.closed) this.emit("error", error);
	}
	close() {
		if (this.closed) return this.closure.promise;
		this.closed = true;
		this.removeAllListeners();
		return trackSkillsWatcherClose(() => {
			this.watcher?.close();
			return this.closure.promise;
		});
	}
};
function createNativeSkillsAncestorWatcher(watchRoot, ignored, rearm) {
	return new NativeSkillsAncestorWatcher(watchRoot, ignored, rearm);
}
//#endregion
//#region src/skills/runtime/refresh-ancestor-watch.ts
const runInWatcherContext = AsyncLocalStorage.snapshot();
const ancestorWatchers = /* @__PURE__ */ new Map();
function useNativeAncestorWatcher(watchRoot, usePolling) {
	if (process.platform !== "linux" || process.versions.bun || usePolling) return false;
	try {
		return fs.lstatSync(watchRoot).isDirectory();
	} catch {
		return false;
	}
}
function createAncestorWatcher(watchRoot, usePolling, subscriptions) {
	const ignored = (candidate, stats) => {
		let allIgnored = true;
		for (const current of subscriptions) if (!current.ignored(candidate, stats)) allIgnored = false;
		return allIgnored;
	};
	return runInWatcherContext(() => {
		if (useNativeAncestorWatcher(watchRoot, usePolling)) {
			const watcher = createNativeSkillsAncestorWatcher(watchRoot, ignored, () => {
				const current = ancestorWatchers.get(watchRoot);
				if (current?.watcher === watcher) replaceAncestorWatcher(watchRoot, usePolling, current);
			});
			return {
				watcher,
				close: () => watcher.close()
			};
		}
		const watcher = chokidar.watch(watchRoot, {
			ignoreInitial: true,
			followSymlinks: false,
			usePolling,
			depth: 0,
			ignored
		});
		return {
			watcher,
			close: () => teardownSkillsPathWatcher({ watcher })
		};
	});
}
function observeAncestorWatcher(current) {
	const { watcher, subscriptions } = current;
	const isCurrent = () => current.watcher === watcher && !watcher.closed;
	watcher.on("ready", () => {
		if (!isCurrent() || current.error) return;
		current.ready = true;
		for (const target of Array.from(subscriptions)) if (isCurrent() && subscriptions.has(target)) target.ready();
	});
	watcher.on("all", (event, changedPath) => {
		if (!isCurrent()) return;
		for (const target of Array.from(subscriptions)) if (isCurrent() && subscriptions.has(target) && (isPathInside(changedPath, target.path) || isPathInside(target.path, changedPath))) target.changed(event, changedPath);
	});
	watcher.on("raw", (event, rawPath, details) => {
		if (!isCurrent()) return;
		for (const target of Array.from(subscriptions)) if (isCurrent() && subscriptions.has(target)) target.raw(event, rawPath, details);
	});
	watcher.on("error", (error) => {
		if (!isCurrent()) return;
		current.ready = false;
		const watchError = toErrorObject(error, "Skills ancestor watcher failed");
		current.error = watchError;
		for (const target of Array.from(subscriptions)) if (isCurrent() && subscriptions.has(target)) target.error(watchError);
	});
}
function replaceAncestorWatcher(watchRoot, usePolling, current) {
	const closeRetired = current.close;
	Object.assign(current, createAncestorWatcher(watchRoot, usePolling, current.subscriptions));
	current.ready = false;
	current.error = void 0;
	observeAncestorWatcher(current);
	closeRetired();
}
function acquireSkillsAncestorWatcher(watchRoot, usePolling, subscription) {
	let group = ancestorWatchers.get(watchRoot);
	if (!group) {
		const subscriptions = /* @__PURE__ */ new Set([subscription]);
		group = {
			...createAncestorWatcher(watchRoot, usePolling, subscriptions),
			ready: false,
			subscriptions
		};
		ancestorWatchers.set(watchRoot, group);
		observeAncestorWatcher(group);
	} else {
		group.subscriptions.add(subscription);
		if (group.error) replaceAncestorWatcher(watchRoot, usePolling, group);
	}
	const current = group;
	const watcher = current.watcher;
	if (current.ready || current.error) queueMicrotask(() => {
		if (current.watcher === watcher && !watcher.closed && current.subscriptions.has(subscription)) {
			if (current.ready) subscription.ready();
			else if (current.error) subscription.error(current.error);
		}
	});
	return { release: () => {
		if (current.subscriptions.delete(subscription) && current.subscriptions.size === 0) {
			ancestorWatchers.delete(watchRoot);
			current.close();
		}
	} };
}
//#endregion
//#region src/skills/runtime/refresh-content-watch.ts
/** Keep native coverage while a directory rescan establishes its replacement. */
function createSkillsContentWatcher(params) {
	let closed = false;
	let published = false;
	let revision = 0;
	let active;
	let pending;
	const owns = (generation) => !closed && !generation.retired && params.isCurrent() && (active === generation || pending === generation);
	const retire = (generation) => {
		generation.retired = true;
		teardownSkillsPathWatcher(generation);
	};
	const rescan = () => {
		if (!closed && params.isCurrent() && (active.ready || active.errored) && !pending) pending = create();
	};
	const create = () => {
		const generation = {
			watcher: params.watch(),
			revision,
			ready: false,
			readyDirectories: /* @__PURE__ */ new Set(),
			errored: false,
			retired: false
		};
		const { watcher } = generation;
		watcher.on("ready", () => {
			if (!owns(generation) || generation.ready) return;
			generation.ready = true;
			generation.readyDirectories = new Set(Object.keys(watcher.getWatched()));
			if (generation === active) {
				rescan();
				return;
			}
			pending = void 0;
			if (generation.revision !== revision) {
				retire(generation);
				rescan();
				return;
			}
			const previous = active;
			active = generation;
			retire(previous);
			if (previous.errored || Array.from(generation.readyDirectories).some((directory) => !previous.readyDirectories.has(directory))) {
				rescan();
				return;
			}
			const isRescan = published;
			published = true;
			params.ready(isRescan);
		});
		watcher.on("all", (event, changedPath) => {
			if (owns(generation)) params.changed(event, changedPath);
		});
		watcher.on("raw", (event, rawPath, details) => {
			if (!owns(generation)) return;
			if (params.isStructuralRaw(event, rawPath, details)) revision += 1;
			params.raw(event, rawPath, details);
		});
		watcher.on("error", (error) => {
			if (!owns(generation)) return;
			generation.errored = true;
			const isRescan = generation === pending;
			if (isRescan) {
				pending = void 0;
				retire(generation);
			}
			params.error(error, isRescan);
		});
		return generation;
	};
	active = create();
	return {
		rescan,
		structureChanged() {
			revision += 1;
		},
		close() {
			if (closed) return;
			closed = true;
			retire(active);
			if (pending) {
				retire(pending);
				pending = void 0;
			}
		}
	};
}
//#endregion
//#region src/skills/runtime/refresh-file-stability.ts
const RAW_SKILL_FILE_POLL_INTERVAL_MS = 100;
function readFileStabilitySnapshot(filePath) {
	try {
		const stat = fs.statSync(filePath);
		return stat.isFile() ? {
			size: stat.size,
			mtimeMs: stat.mtimeMs
		} : void 0;
	} catch {
		return;
	}
}
async function waitForStableSkillFile(filePath, stabilityMs, watcher, readRevision) {
	if (watcher.closed || stabilityMs <= 0) return;
	let previousRevision = readRevision();
	let previous = readFileStabilitySnapshot(filePath);
	if (!previous) return;
	let stableForMs = 0;
	while (stableForMs < stabilityMs) {
		const delayMs = Math.min(RAW_SKILL_FILE_POLL_INTERVAL_MS, stabilityMs - stableForMs);
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
		if (watcher.closed) return;
		const nextRevision = readRevision();
		const next = readFileStabilitySnapshot(filePath);
		if (!next) return;
		if (nextRevision === previousRevision && next.size === previous.size && next.mtimeMs === previous.mtimeMs) {
			stableForMs += delayMs;
			continue;
		}
		previous = next;
		previousRevision = nextRevision;
		stableForMs = 0;
	}
}
function createRawSkillFileScheduler({ watcher, stabilityMs, schedule, onError }) {
	const pendingRawFiles = /* @__PURE__ */ new Map();
	return (changedPath) => {
		if (watcher.closed) return;
		const pending = pendingRawFiles.get(changedPath);
		if (pending) {
			pending.revision += 1;
			return;
		}
		const current = { revision: 0 };
		pendingRawFiles.set(changedPath, current);
		(async () => {
			try {
				while (!watcher.closed) {
					let sampledRevision = current.revision;
					await waitForStableSkillFile(changedPath, stabilityMs, watcher, () => {
						sampledRevision = current.revision;
						return sampledRevision;
					}).catch((err) => onError(changedPath, err));
					if (current.revision !== sampledRevision) continue;
					schedule(changedPath);
					return;
				}
			} finally {
				pendingRawFiles.delete(changedPath);
			}
		})();
	};
}
//#endregion
//#region src/skills/runtime/refresh-remote.ts
const log$1 = createSubsystemLogger("gateway/skills");
const runInSkillsWatcherContext$1 = AsyncLocalStorage.snapshot();
const remoteWatchers = /* @__PURE__ */ new Map();
const remoteWatchTasks = /* @__PURE__ */ new Set();
function ensureRemoteSkillsWatcher(params) {
	const { watcherKey, workspaceDir, access } = params;
	const request = {
		sourcePlan: params.sourcePlan,
		executionWorkspaceDir: params.executionWorkspaceDir
	};
	const signature = JSON.stringify(request);
	const previous = remoteWatchers.get(watcherKey);
	if (previous?.access === access && previous.signature === signature) {
		if (previous.unavailable) bumpSkillsSnapshotVersion({
			workspaceDir,
			reason: "remote-node"
		});
		return;
	}
	disposeRemoteSkillsWatcher(watcherKey);
	const state = {
		access,
		signature,
		controller: new AbortController(),
		unavailable: !access.watchSkills
	};
	remoteWatchers.set(watcherKey, state);
	bumpSkillsSnapshotVersion({
		workspaceDir,
		reason: "remote-node"
	});
	const watch = access.watchSkills;
	if (!watch) return;
	const isCurrent = () => remoteWatchers.get(watcherKey) === state && !state.controller.signal.aborted;
	const task = runInSkillsWatcherContext$1(async () => {
		try {
			await watch(request, (event) => {
				if (!isCurrent()) return;
				if (event === "unavailable") state.unavailable = true;
				bumpSkillsSnapshotVersion({
					workspaceDir,
					reason: "remote-node"
				});
			}, state.controller.signal);
		} catch (error) {
			if (isCurrent()) log$1.warn(`remote skills watcher stopped (${workspaceDir}): ${String(error)}`);
		} finally {
			if (isCurrent()) {
				remoteWatchers.delete(watcherKey);
				bumpSkillsSnapshotVersion({
					workspaceDir,
					reason: "remote-node"
				});
			}
		}
	});
	remoteWatchTasks.add(task);
	task.finally(() => remoteWatchTasks.delete(task));
}
function disposeRemoteSkillsWatcher(watcherKey) {
	const state = remoteWatchers.get(watcherKey);
	remoteWatchers.delete(watcherKey);
	state?.controller.abort();
	return Boolean(state);
}
async function closeRemoteSkillsWatchers() {
	for (const key of remoteWatchers.keys()) disposeRemoteSkillsWatcher(key);
	await Promise.all(remoteWatchTasks);
}
//#endregion
//#region src/skills/runtime/refresh-source-roots.ts
function resolveSkillsWatchSourceRoots(workspaceDir, config, agentId, executionWorkspaceDir, pluginMetadataSnapshot, sourcePlan) {
	const executionRoots = executionWorkspaceDir ? resolveWorkspaceSkillDirectories(executionWorkspaceDir) : [];
	let baseRoots;
	let extraDirs;
	let pluginSkillDirs;
	let allowedSymlinkTargetRealPaths;
	if (sourcePlan) {
		baseRoots = sourcePlan.roots.filter((root) => !["extra", "bundled"].includes(root.tier)).map((root) => ({
			path: root.dir,
			source: root.source
		}));
		extraDirs = sourcePlan.roots.filter((root) => root.tier === "extra").map((root) => root.dir);
		pluginSkillDirs = sourcePlan.pluginSkillRoots.map((root) => root.dir);
		allowedSymlinkTargetRealPaths = resolveAllowedSkillSymlinkTargetRealPaths({ skills: { load: { allowSymlinkTargets: sourcePlan.allowSymlinkTargets } } });
	} else {
		baseRoots = resolveWorkspaceSkillDirectories(workspaceDir).map(({ dir, source }) => ({
			path: dir,
			source
		}));
		baseRoots.push(...resolveWorkshopWatchRoots(config, agentId));
		baseRoots.push({
			path: path.join(CONFIG_DIR, "skills"),
			source: "openclaw-managed"
		});
		if (isDefaultStateDir()) baseRoots.push({
			path: path.join(os.homedir(), ".agents", "skills"),
			source: "agents-skills-personal"
		});
		extraDirs = (config?.skills?.load?.extraDirs ?? []).map((d) => normalizeOptionalString(d) ?? "").filter(Boolean).map((dir) => resolveUserPath(dir));
		pluginSkillDirs = (pluginMetadataSnapshot ? resolvePluginSkillRootsFromMetadata({
			workspaceDir,
			config,
			metadataSnapshot: pluginMetadataSnapshot
		}) : resolvePluginSkillRoots({
			workspaceDir,
			config
		})).map((root) => root.dir);
		allowedSymlinkTargetRealPaths = resolveAllowedSkillSymlinkTargetRealPaths(config);
	}
	return {
		executionRoots,
		baseRoots,
		extraDirs,
		pluginSkillDirs,
		allowedSymlinkTargetRealPaths
	};
}
//#endregion
//#region src/skills/runtime/refresh-watch-targets.ts
function skillsWatchTargetsMatch(previous, next) {
	return previous.path === next.path && previous.watchRoot === next.watchRoot && previous.depth === next.depth && previous.executionOnly === next.executionOnly;
}
function compareSkillsWatchTargets(previous, next, covered) {
	const targetsUnchanged = areOrderedArraysEqual(previous, next, skillsWatchTargetsMatch);
	if (targetsUnchanged) return {
		targetsUnchanged,
		sharedTargetsChanged: false
	};
	return {
		targetsUnchanged,
		sharedTargetsChanged: next.some((target) => !target.executionOnly && !covered.some((prior) => skillsWatchTargetsMatch(prior, target))) || previous.some((prior) => !prior.executionOnly && !next.some((target) => skillsWatchTargetsMatch(prior, target)))
	};
}
const GROUPED_SKILLS_WATCH_DEPTH = 6;
const CONFIGURED_ROOT_WATCH_DEPTH = 2;
const MAX_SYMLINK_WATCH_TARGETS_PER_ROOT = 100;
const MAX_SYMLINK_WATCH_DIRECTORY_SCANS_PER_ROOT = 200;
const MAX_SYMLINK_WATCH_RAW_ENTRIES_PER_ROOT = 2e3;
function resolveSkillsWatchTargets(workspaceDir, config, agentId, executionWorkspaceDir, pluginMetadataSnapshot, sourcePlan, cached) {
	const { executionRoots, baseRoots, extraDirs, pluginSkillDirs, allowedSymlinkTargetRealPaths } = resolveSkillsWatchSourceRoots(workspaceDir, config, agentId, executionWorkspaceDir, pluginMetadataSnapshot, sourcePlan);
	const signature = JSON.stringify({
		basePaths: baseRoots.map((root) => toWatchRoot(root.path)),
		executionPaths: executionRoots.map((root) => toWatchRoot(root.dir)),
		extraDirs: extraDirs.map(toWatchRoot),
		pluginSkillDirs: pluginSkillDirs.map(toWatchRoot),
		allowSymlinkTargets: allowedSymlinkTargetRealPaths
	});
	if (cached?.signature === signature) return cached;
	const targets = /* @__PURE__ */ new Map();
	for (const root of baseRoots) addSkillSourceWatchTargets(targets, root.path, root.source, allowedSymlinkTargetRealPaths, GROUPED_SKILLS_WATCH_DEPTH);
	for (const resolved of extraDirs) addSkillSourceWatchTargets(targets, resolved, "openclaw-extra", allowedSymlinkTargetRealPaths);
	for (const dir of pluginSkillDirs) addSkillSourceWatchTargets(targets, dir, "openclaw-plugin", allowedSymlinkTargetRealPaths);
	const executionTargets = /* @__PURE__ */ new Map();
	for (const root of executionRoots) addSkillSourceWatchTargets(executionTargets, root.dir, root.source, allowedSymlinkTargetRealPaths, GROUPED_SKILLS_WATCH_DEPTH);
	for (const [key, target] of executionTargets) {
		const shared = targets.get(key);
		if (shared) shared.depth = Math.max(shared.depth, target.depth);
		else targets.set(key, {
			...target,
			executionOnly: true
		});
	}
	return {
		signature,
		targets: Array.from(targets.values()).toSorted((a, b) => a.path.localeCompare(b.path))
	};
}
function addWatchTarget(targets, raw, depth) {
	const target = makeSkillsWatchTarget(raw, depth);
	target.depth = Math.max(target.depth, targets.get(target.path)?.depth ?? 0);
	targets.set(target.path, target);
}
function addSkillRootWatchTargets(targets, root, rootDepth) {
	addWatchTarget(targets, root, rootDepth);
	const companionSkillsRoot = path.join(root, "skills");
	addWatchTarget(targets, companionSkillsRoot, GROUPED_SKILLS_WATCH_DEPTH);
	return companionSkillsRoot;
}
function addSkillSourceWatchTargets(targets, root, source, allowedSymlinkTargetRealPaths, rootDepth = path.basename(root) === "skills" ? GROUPED_SKILLS_WATCH_DEPTH : CONFIGURED_ROOT_WATCH_DEPTH) {
	const companionSkillsRoot = addSkillRootWatchTargets(targets, root, rootDepth);
	const rootRealPath = resolveRealpathOrAbsolute(root);
	addTrustedSymlinkSkillWatchTargets(targets, root, source, allowedSymlinkTargetRealPaths, rootDepth, rootRealPath, rootRealPath);
	addTrustedSymlinkSkillWatchTargets(targets, companionSkillsRoot, source, allowedSymlinkTargetRealPaths, GROUPED_SKILLS_WATCH_DEPTH, rootRealPath, resolveRealpathOrAbsolute(companionSkillsRoot));
}
function addTrustedSymlinkSkillWatchTargets(targets, root, source, allowedSymlinkTargetRealPaths, maxDepth, containmentRootRealPath, rootRealPath) {
	try {
		if (fs.lstatSync(root).isSymbolicLink() && isTrustedSymlinkSkillTarget(source, containmentRootRealPath, rootRealPath, allowedSymlinkTargetRealPaths)) addSkillRootWatchTargets(targets, rootRealPath, maxDepth);
	} catch {
		return;
	}
	const queue = [{
		dir: root,
		depth: 0
	}];
	let watched = 0;
	let directoryScans = 0;
	let rawEntries = 0;
	for (const queued of queue) {
		if (watched >= MAX_SYMLINK_WATCH_TARGETS_PER_ROOT || directoryScans >= MAX_SYMLINK_WATCH_DIRECTORY_SCANS_PER_ROOT || rawEntries >= MAX_SYMLINK_WATCH_RAW_ENTRIES_PER_ROOT) break;
		const current = queued;
		if (!current) continue;
		const scan = readBudgetedDirEntries(current.dir, MAX_SYMLINK_WATCH_RAW_ENTRIES_PER_ROOT - rawEntries);
		directoryScans += 1;
		rawEntries += scan.scannedEntryCount;
		if (!scan.ok) continue;
		for (const entry of scan.entries.toSorted((a, b) => a.name.localeCompare(b.name))) {
			if (watched >= MAX_SYMLINK_WATCH_TARGETS_PER_ROOT) break;
			if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
			const childPath = path.join(current.dir, entry.name);
			if (DEFAULT_SKILLS_WATCH_IGNORED.some((re) => re.test(childPath))) continue;
			if (entry.isSymbolicLink()) {
				const targetRealPath = tryRealpath(childPath);
				if (targetRealPath && isTrustedSymlinkSkillTarget(source, containmentRootRealPath, targetRealPath, allowedSymlinkTargetRealPaths)) {
					addSkillRootWatchTargets(targets, targetRealPath, GROUPED_SKILLS_WATCH_DEPTH);
					watched += 1;
				}
				continue;
			}
			if (entry.isDirectory() && current.depth < maxDepth) queue.push({
				dir: childPath,
				depth: current.depth + 1
			});
		}
	}
}
//#endregion
//#region src/skills/runtime/refresh.ts
const log = createSubsystemLogger("gateway/skills");
const runInSkillsWatcherContext = AsyncLocalStorage.snapshot();
const SKILLS_WATCH_DEBOUNCE_MS = 250;
const pathWatchers = /* @__PURE__ */ new Map();
let nativeWatchCapacityFailed = false;
const workspaceWatchTargets = /* @__PURE__ */ new Map();
const workspaceWatchOwners = /* @__PURE__ */ new Map();
const workspaceWatchTargetCache = /* @__PURE__ */ new Map();
const workspaceWatchLastEnsuredAt = /* @__PURE__ */ new Map();
const SKILLS_WORKSPACE_WATCH_IDLE_TTL_MS = 36e5;
const MAX_SKILLS_WORKSPACE_WATCH_STATES = 128;
setSkillsChangeListenerErrorHandler((err) => {
	log.warn(`skills change listener failed: ${String(err)}`);
});
function publishSkillsWatchChanges(changes) {
	const affected = /* @__PURE__ */ new Map();
	for (const pending of changes) for (const watcherKey of pending.watcherKeys) {
		const owner = workspaceWatchOwners.get(watcherKey);
		const targets = workspaceWatchTargets.get(watcherKey);
		if (owner && targets) {
			const entries = affected.get(owner.workspaceDir) ?? [];
			entries.push({
				pending,
				watcherKey,
				targets
			});
			affected.set(owner.workspaceDir, entries);
		}
	}
	for (const [workspaceDir, entries] of affected) {
		const scopes = /* @__PURE__ */ new Map();
		let changedPath;
		let unavailable = false;
		for (const { pending, watcherKey, targets } of entries) {
			const owner = workspaceWatchOwners.get(watcherKey);
			const { targetPath, state, change } = pending;
			if (!owner || state.closed || pathWatchers.get(targetPath) !== state || !state.subscribers.has(watcherKey) || workspaceWatchTargets.get(watcherKey) !== targets) continue;
			if (change !== "supporting") {
				workspaceWatchTargetCache.delete(watcherKey);
				changedPath = pending.changedPath;
			}
			unavailable ||= change === "unavailable";
			const initialScan = change === "initial-scan";
			const shared = initialScan ? owner.sharedScanPending : workspaceWatchTargets.get(watcherKey)?.find((entry) => entry.path === targetPath)?.executionOnly !== true;
			if (initialScan) owner.sharedScanPending &&= (workspaceWatchTargets.get(watcherKey) ?? []).some((entry) => !entry.executionOnly && pathWatchers.get(entry.path)?.initialScan !== "ready");
			const kind = change === "supporting" ? "supporting" : "skills";
			if (shared) scopes.set(kind, void 0);
			else if (!scopes.has(kind) || scopes.get(kind)) {
				const selected = scopes.get(kind) ?? [];
				if (!selected.some((scope) => scope.executionWorkspaceDir === owner.sourceScope.executionWorkspaceDir)) selected.push(owner.sourceScope);
				scopes.set(kind, selected);
			}
		}
		if (scopes.has("supporting")) markSkillsSupportingFilesChanged({
			workspaceDir,
			sourceScopes: scopes.get("supporting")
		});
		if (scopes.has("skills")) bumpSkillsSnapshotVersion({
			workspaceDir,
			sourceScopes: scopes.get("skills"),
			reason: unavailable ? "watch-unavailable" : "watch",
			changedPath
		});
	}
}
function flushSkillsWatchChanges(trigger) {
	if (trigger.closed) return;
	const now = performance.now();
	const changes = [];
	for (const [targetPath, state] of pathWatchers) {
		if (state.closed || state.timer === void 0 || state !== trigger && (state.pendingAt === void 0 || state.pendingAt > now)) continue;
		changes.push({
			targetPath,
			state,
			watcherKeys: state.subscribers,
			changedPath: state.pendingPath,
			change: state.pendingChange ?? "skills"
		});
		clearTimeout(state.timer);
		state.timer = void 0;
		state.pendingAt = void 0;
		state.pendingPath = void 0;
		state.pendingChange = void 0;
	}
	publishSkillsWatchChanges(changes);
}
function createSkillsPathWatcher(target, previousAncestorRoot = target.watchRoot) {
	const usePolling = resolveSkillsWatcherUsePolling();
	const pathFilter = createSkillsWatchPathFilter(target.path, usePolling);
	const ancestorRoot = isPathInside(previousAncestorRoot, target.watchRoot) ? previousAncestorRoot : target.watchRoot;
	const ancestorRoots = [];
	let currentRoot = target.watchRoot;
	while (isPathInside(ancestorRoot, currentRoot)) {
		if (currentRoot !== target.path) ancestorRoots.push(currentRoot);
		const parent = toWatchRoot(path.dirname(currentRoot));
		if (parent === currentRoot) break;
		currentRoot = parent;
	}
	const pendingAncestors = new Set(ancestorRoots);
	let contentReady = target.path !== target.watchRoot;
	let content;
	const releaseAncestors = [];
	const state = {
		closed: false,
		close: () => {
			if (state.closed) return;
			state.closed = true;
			clearTimeout(state.timer);
			content?.close();
			for (const release of releaseAncestors) release();
		},
		schedule: (changedPath) => schedule(changedPath),
		watchRoot: target.watchRoot,
		ancestorRoot,
		depth: target.depth,
		initialScan: "pending",
		subscribers: /* @__PURE__ */ new Set()
	};
	const isCurrent = () => !state.closed && pathWatchers.get(target.path) === state;
	const reconcileRoot = (changedPath, replaceContent = false) => {
		if (!isCurrent()) return true;
		const nextTarget = makeSkillsWatchTarget(target.path, state.depth, state.ancestorRoot);
		if (nextTarget.watchRoot === state.watchRoot && !replaceContent) return false;
		for (const subscriber of state.subscribers) {
			workspaceWatchTargetCache.delete(subscriber);
			for (const entry of workspaceWatchTargets.get(subscriber) ?? []) if (entry.path === target.path) entry.watchRoot = nextTarget.watchRoot;
		}
		const subscriber = state.subscribers.values().next().value;
		if (subscriber !== void 0) {
			subscribeWorkspaceToPath(subscriber, nextTarget, replaceContent);
			if (changedPath) pathWatchers.get(target.path)?.schedule(changedPath);
		}
		return true;
	};
	const settleInitialScan = (result) => {
		if (!isCurrent() || state.initialScan === "ready" || state.initialScan === result) return;
		state.initialScan = result;
		const readySubscribers = [];
		for (const watcherKey of state.subscribers) {
			const targets = workspaceWatchTargets.get(watcherKey);
			if (result === "error" || targets?.every((entry) => {
				const current = pathWatchers.get(entry.path);
				return current && !current.closed && current.initialScan !== "pending";
			})) readySubscribers.push(watcherKey);
		}
		publishSkillsWatchChanges([{
			targetPath: target.path,
			state,
			watcherKeys: readySubscribers,
			change: result === "error" ? "unavailable" : "initial-scan"
		}]);
	};
	const schedule = (changedPath, change = "skills") => {
		if (!isCurrent() || change === "supporting" && state.pendingChange === "skills") return;
		state.pendingPath = changedPath ?? state.pendingPath;
		state.pendingChange = change;
		clearTimeout(state.timer);
		state.pendingAt = performance.now() + SKILLS_WATCH_DEBOUNCE_MS;
		state.timer = setTimeout(() => flushSkillsWatchChanges(state), SKILLS_WATCH_DEBOUNCE_MS);
	};
	const scheduleRawSkillFile = createRawSkillFileScheduler({
		watcher: state,
		stabilityMs: SKILLS_WATCH_DEBOUNCE_MS,
		schedule,
		onError: (changedPath, err) => {
			log.warn(`skills watcher stability check failed (${changedPath}): ${String(err)}`);
		}
	});
	const ready = () => {
		if (!reconcileRoot() && contentReady && pendingAncestors.size === 0) settleInitialScan("ready");
	};
	const onChange = (event, changedPath) => {
		const ancestorChanged = event === "ancestor";
		if (!isCurrent() || (!content || ancestorChanged || event === "addDir" || event === "unlinkDir") && reconcileRoot(changedPath, ancestorChanged && Boolean(content))) return;
		const skillsRelevant = ancestorChanged || pathFilter.isRelevant(event, changedPath);
		if (skillsRelevant && (event === "addDir" || event === "unlinkDir")) {
			content?.structureChanged();
			if (event === "addDir") content?.rescan();
		}
		if (skillsRelevant || pathFilter.isSupportingPath(changedPath)) schedule(changedPath, skillsRelevant ? "skills" : "supporting");
	};
	const handleRaw = (_eventName, rawPath, details) => {
		if (!isCurrent()) return;
		const rawPathText = rawPathToString(rawPath);
		const changedPath = rawPathText ? resolveRawSkillsWatchPath(rawPathText, details) : getRawWatchedPath(details);
		if (!changedPath) return;
		if (isPathInside(changedPath, target.path) && reconcileRoot(changedPath)) return;
		if (!rawPathText) {
			if (isPathInside(target.path, changedPath)) schedule(changedPath);
			return;
		}
		if (isSkillDiscoveryFileWatchPath(changedPath) && isPathInside(target.path, changedPath)) {
			if (usePolling) return;
			scheduleRawSkillFile(changedPath);
		} else if (pathFilter.isSupportingPath(changedPath)) schedule(changedPath, "supporting");
	};
	const onRaw = (...args) => {
		if (usePolling) queueMicrotask(() => handleRaw(...args));
		else handleRaw(...args);
	};
	const onError = (err, rescan = false) => {
		if (!isCurrent()) return;
		const capacityCode = usePolling ? void 0 : getFileWatchCapacityCode(err);
		if (capacityCode) {
			if (!nativeWatchCapacityFailed) {
				nativeWatchCapacityFailed = true;
				log.warn(`skills native watcher capacity exhausted (${capacityCode}); refreshing skills during agent preparation`);
				for (const active of pathWatchers.values()) active.close();
				for (const workspaceDir of new Set(Array.from(workspaceWatchOwners.values(), (owner) => owner.workspaceDir))) bumpSkillsSnapshotVersion({
					workspaceDir,
					reason: "watch-unavailable"
				});
			}
			return;
		}
		log.warn(`skills watcher error (${target.path}): ${String(err)}`);
		settleInitialScan("error");
		if (rescan) schedule();
	};
	if (target.path === target.watchRoot) content = createSkillsContentWatcher({
		watch: () => runInSkillsWatcherContext(() => chokidar.watch(target.path, {
			ignoreInitial: true,
			followSymlinks: false,
			usePolling,
			depth: target.depth + 1,
			awaitWriteFinish: {
				stabilityThreshold: SKILLS_WATCH_DEBOUNCE_MS,
				pollInterval: 100
			},
			ignored: pathFilter.ignored
		})),
		isCurrent,
		isStructuralRaw: pathFilter.isStructuralRaw,
		ready: (rescan) => {
			contentReady = true;
			if (rescan) publishSkillsWatchChanges([{
				targetPath: target.path,
				state,
				watcherKeys: state.subscribers,
				change: "skills"
			}]);
			else ready();
		},
		changed: onChange,
		raw: onRaw,
		error: onError
	});
	for (const root of ancestorRoots) releaseAncestors.push(acquireSkillsAncestorWatcher(root, usePolling, {
		path: target.path,
		ignored: pathFilter.ignored,
		ready: () => {
			pendingAncestors.delete(root);
			ready();
		},
		changed: onChange,
		raw: onRaw,
		error: (error) => {
			pendingAncestors.delete(root);
			onError(error);
			if (content) ready();
		}
	}).release);
	return state;
}
function subscribeWorkspaceToPath(workspaceDir, watchTarget, replaceContent = false) {
	const existing = pathWatchers.get(watchTarget.path);
	if (existing && !replaceContent && existing.watchRoot === watchTarget.watchRoot && existing.depth >= watchTarget.depth) {
		existing.subscribers.add(workspaceDir);
		return;
	}
	if (existing) {
		existing.close();
		const next = createSkillsPathWatcher({
			...watchTarget,
			depth: Math.max(existing.depth, watchTarget.depth)
		}, existing.ancestorRoot);
		for (const subscriber of existing.subscribers) {
			next.subscribers.add(subscriber);
			const owner = workspaceWatchOwners.get(subscriber);
			if (owner && workspaceWatchTargets.get(subscriber)?.some((target) => target.path === watchTarget.path && !target.executionOnly)) owner.sharedScanPending = true;
		}
		next.subscribers.add(workspaceDir);
		pathWatchers.set(watchTarget.path, next);
		return;
	}
	const state = createSkillsPathWatcher(watchTarget);
	state.subscribers.add(workspaceDir);
	pathWatchers.set(watchTarget.path, state);
}
function unsubscribeWorkspaceFromPath(workspaceDir, watchTarget) {
	const state = pathWatchers.get(watchTarget.path);
	if (!state) return;
	state.subscribers.delete(workspaceDir);
	if (state.subscribers.size === 0) {
		state.close();
		pathWatchers.delete(watchTarget.path);
	}
}
function disposeWorkspaceWatchState(watcherKey, watchTargets = workspaceWatchTargets.get(watcherKey) ?? []) {
	disposeRemoteSkillsWatcher(watcherKey);
	for (const watchTarget of watchTargets) unsubscribeWorkspaceFromPath(watcherKey, watchTarget);
	workspaceWatchTargets.delete(watcherKey);
	workspaceWatchOwners.delete(watcherKey);
	workspaceWatchTargetCache.delete(watcherKey);
	workspaceWatchLastEnsuredAt.delete(watcherKey);
}
function evictWorkspaceWatchStates(now) {
	const evict = (watcherKey) => {
		const owner = workspaceWatchOwners.get(watcherKey);
		disposeWorkspaceWatchState(watcherKey);
		if (!owner) return;
		const remainingOwners = Array.from(workspaceWatchOwners.values()).filter((other) => other.workspaceDir === owner.workspaceDir);
		if (remainingOwners.length === 0) suspendSkillsSnapshotSources(owner.workspaceDir, {});
		if (owner.sourceScope.executionWorkspaceDir && !remainingOwners.some((other) => other.sourceScope.executionWorkspaceDir === owner.sourceScope.executionWorkspaceDir)) suspendSkillsSnapshotSources(owner.workspaceDir, owner.sourceScope);
	};
	const cutoff = now - SKILLS_WORKSPACE_WATCH_IDLE_TTL_MS;
	for (const [watcherKey, lastEnsuredAt] of workspaceWatchLastEnsuredAt) if (lastEnsuredAt < cutoff) evict(watcherKey);
	for (const watcherKey of workspaceWatchLastEnsuredAt.keys()) {
		if (workspaceWatchLastEnsuredAt.size <= MAX_SKILLS_WORKSPACE_WATCH_STATES) break;
		evict(watcherKey);
	}
}
function ensureSkillsWatcher(params) {
	const workspaceDir = params.workspaceDir.trim();
	if (!workspaceDir) return;
	const { executionWorkspaceDir } = normalizeWorkspaceSkillRoots({
		agentWorkspaceDir: workspaceDir,
		executionWorkspaceDir: params.executionWorkspaceDir
	});
	const watcherKey = JSON.stringify([
		workspaceDir,
		executionWorkspaceDir,
		params.agentId
	]);
	const sourceScope = { executionWorkspaceDir };
	const owner = {
		workspaceDir,
		sourceScope,
		sharedScanPending: workspaceWatchOwners.get(watcherKey)?.sharedScanPending ?? false
	};
	workspaceWatchOwners.set(watcherKey, owner);
	const refreshInputs = {
		sourceScope,
		config: params.config,
		pluginMetadataSnapshot: params.pluginMetadataSnapshot
	};
	const now = Date.now();
	const watchEnabled = params.config?.skills?.load?.watch !== false;
	const previousTargets = workspaceWatchTargets.get(watcherKey) ?? [];
	if (!watchEnabled) {
		disposeWorkspaceWatchState(watcherKey, previousTargets);
		evictWorkspaceWatchStates(now);
		return;
	}
	workspaceWatchLastEnsuredAt.delete(watcherKey);
	workspaceWatchLastEnsuredAt.set(watcherKey, now);
	evictWorkspaceWatchStates(now);
	const access = getAgentWorkspaceAccess(workspaceDir, "loadSkills");
	let localPlan = params.sourcePlan;
	if (access?.loadSkills) {
		const { gatewayPlan, workspacePlan } = splitSkillSourcePlan(resolveWorkspaceSkillSourcePlan(workspaceDir, params));
		ensureRemoteSkillsWatcher({
			watcherKey,
			workspaceDir,
			executionWorkspaceDir,
			access,
			sourcePlan: workspacePlan
		});
		localPlan = gatewayPlan;
	} else disposeRemoteSkillsWatcher(watcherKey);
	if (nativeWatchCapacityFailed) {
		workspaceWatchTargetCache.delete(watcherKey);
		bumpSkillsSnapshotVersion({
			workspaceDir,
			refreshInputs,
			reason: "watch"
		});
		return;
	}
	const failedTargets = previousTargets.filter((target) => pathWatchers.get(target.path)?.initialScan === "error");
	if (failedTargets.length > 0) workspaceWatchTargetCache.delete(watcherKey);
	const cachedTargets = workspaceWatchTargetCache.get(watcherKey);
	const resolvedTargets = resolveSkillsWatchTargets(workspaceDir, params.config, params.agentId, access?.loadSkills ? void 0 : executionWorkspaceDir, params.pluginMetadataSnapshot, localPlan, cachedTargets);
	if (resolvedTargets !== cachedTargets) workspaceWatchTargetCache.set(watcherKey, resolvedTargets);
	const watchTargets = resolvedTargets.targets;
	const targetChanges = compareSkillsWatchTargets(previousTargets, watchTargets, previousTargets.length ? previousTargets : Array.from(workspaceWatchOwners).flatMap(([key, other]) => other.workspaceDir === workspaceDir ? workspaceWatchTargets.get(key) ?? [] : []));
	const watcherDepthsCoverTargets = watchTargets.every((watchTarget) => (pathWatchers.get(watchTarget.path)?.depth ?? -1) >= watchTarget.depth);
	if (targetChanges.targetsUnchanged && watcherDepthsCoverTargets && failedTargets.length === 0) return;
	const nextTargetKeys = new Set(watchTargets.map((target) => target.path));
	for (const watchTarget of previousTargets) if (!nextTargetKeys.has(watchTarget.path)) unsubscribeWorkspaceFromPath(watcherKey, watchTarget);
	for (const watchTarget of watchTargets) subscribeWorkspaceToPath(watcherKey, watchTarget);
	workspaceWatchTargets.set(watcherKey, watchTargets);
	owner.sharedScanPending ||= watchTargets.some((target) => !target.executionOnly && pathWatchers.get(target.path)?.initialScan !== "ready");
	const joinedUnavailable = watchTargets.some((target) => pathWatchers.get(target.path)?.initialScan === "error" && !previousTargets.some((previous) => previous.path === target.path));
	if (!targetChanges.targetsUnchanged || failedTargets.length > 0) bumpSkillsSnapshotVersion({
		workspaceDir,
		sourceScopes: targetChanges.sharedTargetsChanged || failedTargets.some((target) => !target.executionOnly) ? void 0 : [sourceScope],
		refreshInputs,
		reason: joinedUnavailable ? "watch-unavailable" : "watch-targets",
		changedPath: watchTargets.map((target) => target.path).join("|")
	});
}
async function closeSkillsWatchers(resetState = false) {
	if (resetState) resetSkillsRefreshStateForTest();
	const active = Array.from(pathWatchers.values());
	nativeWatchCapacityFailed = false;
	pathWatchers.clear();
	workspaceWatchTargets.clear();
	workspaceWatchOwners.clear();
	workspaceWatchTargetCache.clear();
	workspaceWatchLastEnsuredAt.clear();
	for (const state of active) state.close();
	await Promise.all([joinSkillsWatcherCloses(), closeRemoteSkillsWatchers()]);
}
//#endregion
export { ensureSkillsWatcher as n, closeSkillsWatchers as t };
