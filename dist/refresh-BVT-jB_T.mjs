import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as CONFIG_DIR } from "./utils-DgZn2dLu.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { d as sleepWithAbort } from "./src-D1BHGNTj.mjs";
import { s as isDefaultStateDir } from "./paths-DGIwWbpu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import "./backoff-BrzXG7iD.mjs";
import { s as getGatewayRestartDrainSignal } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-DjFUgH7e.mjs";
import { a as resolveFsObservationIntervalMs, i as observationPrefixKind, n as readObservationSnapshot, o as resolveFsObservationMode, r as admitObservationRoot, t as ObservationSampleCloseError } from "./fs-observation-snapshot-DTptcApl.mjs";
import { r as resolveWorkspaceSkillDirectories, t as normalizeWorkspaceSkillRoots } from "./workspace-skill-roots-CL28VeX5.mjs";
import { a as markSkillsSupportingFilesChanged, f as suspendSkillsSnapshotSources, l as resetSkillsRefreshStateForTest, o as notifySkillsWatchAvailable, t as bumpSkillsSnapshotVersion, u as setSkillsChangeListenerErrorHandler } from "./refresh-state-CRa-OKC_.mjs";
import { n as resolveWorkshopWatchRoots } from "./skills-root-5Lc00M9N.mjs";
import { t as areOrderedArraysEqual } from "./ordered-array-equality-CBhMoHgO.mjs";
import { o as resolveAllowedSkillSymlinkTargetRealPaths, s as tryRealpath } from "./skill-paths-BxFt63--.mjs";
import { i as resolvePluginSkillRootsFromMetadata, r as resolvePluginSkillRoots } from "./plugin-skills-BVTLcXRM.mjs";
import { n as resolveWorkspaceSkillSourcePlan, r as splitSkillSourcePlan } from "./workspace-skill-sources-C_PbN8z1.mjs";
import fs from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import os from "node:os";
import { watch as watch$1 } from "@openclaw/fs-safe/watch";
//#region src/skills/runtime/refresh-file-stability.ts
/** Settling belongs to Skills parsing; observation readiness is not writer completion. */
function createSkillFileScheduler(options) {
	const lifetime = new AbortController();
	let failure;
	const pending = /* @__PURE__ */ new Map();
	const tasks = /* @__PURE__ */ new Set();
	return {
		schedule(changedPath) {
			if (lifetime.signal.aborted) return;
			const previous = pending.get(changedPath);
			if (previous) {
				previous.revision += 1;
				return;
			}
			if (pending.size >= 1024) {
				options.schedule(changedPath);
				return;
			}
			const current = { revision: 0 };
			pending.set(changedPath, current);
			const work = Promise.resolve().then(async () => {
				for (;;) {
					lifetime.signal.throwIfAborted();
					let revision = current.revision;
					let before = await options.sample(changedPath);
					lifetime.signal.throwIfAborted();
					if (revision !== current.revision) continue;
					let stable = 0;
					let superseded = false;
					while (before && stable < options.stabilityMs) {
						const interval = Math.min(100, options.stabilityMs - stable);
						await sleepWithAbort(interval, lifetime.signal);
						const sampledRevision = current.revision;
						const next = await options.sample(changedPath);
						lifetime.signal.throwIfAborted();
						if (sampledRevision !== current.revision) {
							superseded = true;
							break;
						}
						if (!next) break;
						stable = sampledRevision === revision && next.size === before.size && next.mtimeMs === before.mtimeMs ? stable + interval : 0;
						before = next;
						revision = sampledRevision;
					}
					if (superseded) continue;
					pending.delete(changedPath);
					options.schedule(changedPath);
					return;
				}
			}).catch((error) => {
				if (!(lifetime.signal.aborted && error instanceof Error && error.name === "AbortError")) {
					if (error instanceof ObservationSampleCloseError) failure ??= error;
					if (!lifetime.signal.aborted) options.onError(changedPath, error);
				}
			}).finally(() => {
				if (pending.get(changedPath) === current) pending.delete(changedPath);
				tasks.delete(work);
			});
			tasks.add(work);
		},
		async close() {
			lifetime.abort();
			await Promise.all(tasks);
			if (failure !== void 0) throw failure;
		}
	};
}
//#endregion
//#region src/skills/runtime/refresh-observation-source.ts
/** Observe a blocking link entry, never an implicit recursive target admission. */
async function skillsObservationScope(authority, target, signal) {
	const relative = path.relative(authority.rootDir, target.path);
	const parts = relative.split(path.sep).filter(Boolean);
	let parent = ".";
	for (const part of parts) {
		signal.throwIfAborted();
		parent = path.join(parent, part);
		const kind = await observationPrefixKind(authority, parent, signal);
		if (kind === "missing") break;
		if (kind !== "directory") return {
			path: parent,
			kind: "entry"
		};
	}
	return {
		path: relative || ".",
		kind: "tree",
		depth: target.depth + 2
	};
}
/** Capture transport policy and its diagnostic lifetime with the subscription. */
function skillsObservationTransport(targetPath) {
	const mode = resolveFsObservationMode();
	const pollIntervalMs = resolveFsObservationIntervalMs(process.env, 3e4);
	let pollingFallbackWarned = false;
	return {
		mode,
		pollIntervalMs,
		reportHealth: (health) => {
			if (mode !== "auto" || health.mode !== "poll" || health.state !== "ready" || pollingFallbackWarned) return;
			pollingFallbackWarned = true;
			const reason = health.failure ? `${health.failure.code ? `${health.failure.code}: ` : ""}${String(health.failure.error)}` : "fs-safe did not report a reason";
			createSubsystemLogger("gateway/skills").warn(`skills watcher using fallback polling (${targetPath}) every ${pollIntervalMs} ms: ${reason}`);
		}
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
	const drainSignal = getGatewayRestartDrainSignal();
	if (drainSignal.aborted) return;
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
	const signal = AbortSignal.any([state.controller.signal, drainSignal]);
	const isCurrent = () => remoteWatchers.get(watcherKey) === state && !signal.aborted;
	const task = runInSkillsWatcherContext$1(async () => {
		try {
			await watch(request, (event) => {
				if (!isCurrent()) return;
				if (event === "unavailable") state.unavailable = true;
				else if (event === "available") {
					state.unavailable = false;
					return;
				}
				bumpSkillsSnapshotVersion({
					workspaceDir,
					reason: "remote-node"
				});
			}, signal);
		} catch (error) {
			if (isCurrent()) log$1.warn(`remote skills watcher stopped (${workspaceDir}): ${String(error)}`);
		} finally {
			if (remoteWatchers.get(watcherKey) === state) {
				remoteWatchers.delete(watcherKey);
				if (!signal.aborted) bumpSkillsSnapshotVersion({
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
}
async function closeRemoteSkillsWatchers() {
	for (const key of remoteWatchers.keys()) disposeRemoteSkillsWatcher(key);
	await Promise.all(remoteWatchTasks);
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
const isIgnoredSkillsWatchPath = (candidate) => DEFAULT_SKILLS_WATCH_IGNORED.some((pattern) => pattern.test(candidate));
function isSkillDiscoveryFileWatchPath(watchPath) {
	const basename = path.posix.basename(watchPath.replaceAll("\\", "/"));
	return (basename === "SKILL.md" || basename === "source-origin.json") && !DEFAULT_SKILLS_WATCH_IGNORED.some((re) => re.test(watchPath));
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
//#region src/skills/runtime/refresh-watch-registry.ts
const pathWatchers = /* @__PURE__ */ new Map();
const workspaceWatchTargets = /* @__PURE__ */ new Map();
const workspaceWatchOwners = /* @__PURE__ */ new Map();
const workspaceWatchTargetCache = /* @__PURE__ */ new Map();
function unsubscribeWorkspaceFromPath(workspaceDir, watchTarget) {
	const state = pathWatchers.get(watchTarget.path);
	if (!state) return;
	state.subscribers.delete(workspaceDir);
	if (state.subscribers.size === 0) state.close().then(() => {
		if (state.subscribers.size === 0 && pathWatchers.get(watchTarget.path) === state) pathWatchers.delete(watchTarget.path);
	}, () => {
		state.failed = true;
	});
}
const workspaceWatchLastEnsuredAt = /* @__PURE__ */ new Map();
const SKILLS_WORKSPACE_WATCH_IDLE_TTL_MS = 36e5;
const MAX_SKILLS_WORKSPACE_WATCH_STATES = 128;
function evictWorkspaceWatchStates(now, dispose) {
	const evict = (watcherKey) => {
		const owner = workspaceWatchOwners.get(watcherKey);
		dispose(watcherKey);
		if (!owner) return;
		const remainingOwners = Array.from(workspaceWatchOwners.values()).filter((other) => other.workspaceDir === owner.workspaceDir);
		if (remainingOwners.length === 0) suspendSkillsSnapshotSources(owner.workspaceDir, {});
		if (owner.sourceScope.executionWorkspaceDir && !remainingOwners.some((other) => other.sourceScope.executionWorkspaceDir === owner.sourceScope.executionWorkspaceDir && other.sourceScope.executionWorkspaceFileHost === owner.sourceScope.executionWorkspaceFileHost)) suspendSkillsSnapshotSources(owner.workspaceDir, owner.sourceScope);
	};
	const cutoff = now - SKILLS_WORKSPACE_WATCH_IDLE_TTL_MS;
	for (const [watcherKey, lastEnsuredAt] of workspaceWatchLastEnsuredAt) if (lastEnsuredAt < cutoff) evict(watcherKey);
	for (const watcherKey of workspaceWatchLastEnsuredAt.keys()) {
		if (workspaceWatchLastEnsuredAt.size <= MAX_SKILLS_WORKSPACE_WATCH_STATES) break;
		evict(watcherKey);
	}
}
const hasUnreadySharedTargets = (watcherKey) => (workspaceWatchTargets.get(watcherKey) ?? []).some((target) => !target.executionOnly && pathWatchers.get(target.path)?.initialScan !== "ready");
function hasVerifiedCoverage(watcherKey) {
	return workspaceWatchTargets.get(watcherKey)?.every((target) => {
		const state = pathWatchers.get(target.path);
		return state && !state.closed && state.verified && !state.unavailable;
	}) ?? false;
}
function publishRecoveredCoverage() {
	for (const [watcherKey, owner] of workspaceWatchOwners) if (owner.unavailable && hasVerifiedCoverage(watcherKey)) {
		owner.unavailable = false;
		notifySkillsWatchAvailable({
			workspaceDir: owner.workspaceDir,
			sourceScope: owner.sourceScope
		});
	}
}
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
			owner.unavailable ||= change === "unavailable";
			const initialScan = change === "initial-scan";
			const shared = initialScan ? owner.sharedScanPending : targets.find((entry) => entry.path === targetPath)?.executionOnly !== true;
			if (initialScan && shared) for (const [key, other] of workspaceWatchOwners) other.sharedScanPending &&= other.workspaceDir !== workspaceDir || hasUnreadySharedTargets(key);
			const kind = change === "supporting" ? "supporting" : "skills";
			if (shared) scopes.set(kind, void 0);
			else if (!scopes.has(kind) || scopes.get(kind)) {
				const selected = scopes.get(kind) ?? [];
				if (!selected.some((scope) => scope.executionWorkspaceDir === owner.sourceScope.executionWorkspaceDir && scope.executionWorkspaceFileHost === owner.sourceScope.executionWorkspaceFileHost)) selected.push(owner.sourceScope);
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
/** Discovery host is part of watcher identity, including identical path strings. */
function resolveSkillsWatchScope(params) {
	const workspaceDir = params.workspaceDir.trim();
	const { executionWorkspaceDir, executionWorkspaceFileHost } = normalizeWorkspaceSkillRoots({
		agentWorkspaceDir: workspaceDir,
		executionWorkspaceDir: params.executionWorkspaceDir,
		executionWorkspaceFileHost: params.executionWorkspaceFileHost
	});
	return {
		workspaceDir,
		executionWorkspaceDir,
		watcherKey: JSON.stringify([
			workspaceDir,
			executionWorkspaceDir,
			params.agentId,
			executionWorkspaceFileHost
		]),
		sourceScope: {
			executionWorkspaceDir,
			executionWorkspaceFileHost
		}
	};
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
		extraDirs = normalizeTrimmedStringList(config?.skills?.load?.extraDirs).map((dir) => resolveUserPath(dir));
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
	return previous.path === next.path && previous.authorityPath === next.authorityPath && previous.depth === next.depth && previous.executionOnly === next.executionOnly;
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
	const sortedTargets = Array.from(targets.values()).toSorted((a, b) => a.path.localeCompare(b.path));
	const authorityWorkspaces = [workspaceDir, executionWorkspaceDir].flatMap((workspace) => workspace ? [workspace, resolvePathViaExistingAncestorSync(workspace)] : []);
	for (const target of sortedTargets) for (const workspace of authorityWorkspaces) if (isPathInside(workspace, target.path)) {
		target.authorityPath = path.dirname(workspace);
		break;
	}
	return {
		signature,
		targets: sortedTargets
	};
}
function addWatchTarget(targets, raw, depth) {
	const target = {
		path: toWatchRoot(raw),
		authorityPath: path.dirname(raw),
		depth
	};
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
	const rootRealPath = resolvePathViaExistingAncestorSync(root);
	if (toWatchRoot(rootRealPath) !== toWatchRoot(root)) addSkillRootWatchTargets(targets, rootRealPath, rootDepth);
	addTrustedSymlinkSkillWatchTargets(targets, root, source, allowedSymlinkTargetRealPaths, rootDepth, rootRealPath, rootRealPath);
	addTrustedSymlinkSkillWatchTargets(targets, companionSkillsRoot, source, allowedSymlinkTargetRealPaths, GROUPED_SKILLS_WATCH_DEPTH, rootRealPath, resolvePathViaExistingAncestorSync(companionSkillsRoot));
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
	for (const current of queue) {
		if (watched >= MAX_SYMLINK_WATCH_TARGETS_PER_ROOT || directoryScans >= MAX_SYMLINK_WATCH_DIRECTORY_SCANS_PER_ROOT || rawEntries >= MAX_SYMLINK_WATCH_RAW_ENTRIES_PER_ROOT) break;
		const scan = readBudgetedDirEntries(current.dir, MAX_SYMLINK_WATCH_RAW_ENTRIES_PER_ROOT - rawEntries);
		directoryScans += 1;
		rawEntries += scan.scannedEntryCount;
		if (!scan.ok) continue;
		for (const entry of scan.entries.toSorted((a, b) => a.name.localeCompare(b.name))) {
			if (watched >= MAX_SYMLINK_WATCH_TARGETS_PER_ROOT) break;
			if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
			const childPath = path.join(current.dir, entry.name);
			if (DEFAULT_SKILLS_WATCH_IGNORED.some((re) => re.test(path.relative(root, childPath)))) continue;
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
const retiringWatchers = /* @__PURE__ */ new Set();
const replacingWatchers = /* @__PURE__ */ new Set();
let watchersClosing = false;
let nativeWatchCapacityFailed = false;
const MAX_SKILLS_WATCH_ENTRY_KINDS = 4096;
setSkillsChangeListenerErrorHandler((err) => {
	log.warn(`skills change listener failed: ${String(err)}`);
});
function createSkillsPathWatcher(target, previous) {
	const lifetime = new AbortController();
	let subscription;
	let subscriptionReady = false;
	let plannedScope;
	let entryDirectoryObserved = false;
	let entryKinds = /* @__PURE__ */ new Map();
	let scannedKinds = /* @__PURE__ */ new Map();
	let starting = Promise.resolve();
	let closing;
	let updating;
	let updateRequested = false;
	const state = {
		closed: false,
		depth: target.depth,
		initialScan: previous?.initialScan ?? "pending",
		unavailable: Boolean(previous?.unavailable),
		verified: false,
		failed: false,
		recovering: Boolean(previous?.unavailable),
		replacing: false,
		subscribers: /* @__PURE__ */ new Set(),
		refreshScope() {
			updateRequested = true;
			updating ??= runInSkillsWatcherContext(() => Promise.resolve().then(async () => {
				await starting;
				while (updateRequested && isCurrent()) {
					if (!subscription) break;
					updateRequested = false;
					const scope = await skillsObservationScope(await state.authority, {
						...target,
						depth: state.depth
					}, lifetime.signal);
					if (!isCurrent()) return;
					if (scope.path === plannedScope?.path && scope.kind === plannedScope.kind && scope.depth === plannedScope.depth) {
						publishReady();
						continue;
					}
					state.verified = false;
					if (!state.unavailable) {
						state.unavailable = true;
						publishSkillsWatchChanges([{
							...targetChange,
							change: "unavailable"
						}]);
					}
					if (!isCurrent()) return;
					plannedScope = scope;
					entryDirectoryObserved = false;
					subscriptionReady = false;
					await subscription.setScopes([scope]);
					subscriptionReady = true;
					if (scope.kind === "entry" && entryDirectoryObserved) updateRequested = true;
					else if (isCurrent()) publishReady();
				}
			}).catch((error) => {
				updateRequested = false;
				failed(error, subscription?.health().failure);
			}).finally(() => {
				updating = void 0;
				if (updateRequested && isCurrent()) state.refreshScope();
			}));
			return updating;
		},
		close() {
			if (closing) return closing;
			state.closed = true;
			state.verified = false;
			lifetime.abort();
			clearTimeout(state.timer);
			closing = Promise.allSettled([
				starting,
				updating,
				subscription?.close(),
				stability.close()
			]).then((results) => {
				const errors = results.slice(2).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				if (errors.length) throw new AggregateError(errors, "Skills observation retirement failed");
			});
			retiringWatchers.add(closing);
			closing.then(() => retiringWatchers.delete(closing), () => {});
			return closing;
		}
	};
	const isCurrent = () => !state.closed && pathWatchers.get(target.path) === state;
	const targetChange = {
		targetPath: target.path,
		state,
		watcherKeys: state.subscribers
	};
	const schedule = (changedPath, change = "skills") => {
		if (!isCurrent() || change === "supporting" && state.pendingChange === "skills") return;
		state.pendingPath = changedPath ?? state.pendingPath;
		state.pendingChange = change;
		clearTimeout(state.timer);
		state.pendingAt = performance.now() + SKILLS_WATCH_DEBOUNCE_MS;
		state.timer = setTimeout(() => flushSkillsWatchChanges(state), SKILLS_WATCH_DEBOUNCE_MS);
	};
	const stability = createSkillFileScheduler({
		stabilityMs: SKILLS_WATCH_DEBOUNCE_MS,
		sample: async (changedPath) => {
			const authority = await state.authority;
			if (!authority || !isCurrent()) return;
			return await readObservationSnapshot(authority, path.relative(authority.rootDir, changedPath));
		},
		schedule,
		onError: (changedPath, error) => log.warn("skills watcher stability check failed (" + changedPath + "): " + String(error))
	});
	const failed = (error, failure) => {
		if (!isCurrent() || state.failed) return;
		state.failed = true;
		state.verified = false;
		if (failure?.operation === "watch" && [
			"watch-limit",
			"EMFILE",
			"ENFILE"
		].includes(failure.code ?? "") && resolveFsObservationMode() !== "poll") {
			if (!nativeWatchCapacityFailed) {
				nativeWatchCapacityFailed = true;
				log.warn("skills native watcher capacity exhausted (" + failure?.code + "); refreshing skills during agent preparation");
				for (const active of pathWatchers.values()) active.close().catch((closeError) => log.warn(String(closeError)));
				for (const workspaceDir of new Set([...workspaceWatchOwners.values()].map((owner) => owner.workspaceDir))) bumpSkillsSnapshotVersion({
					workspaceDir,
					reason: "watch-unavailable"
				});
			}
			return;
		}
		log.warn("skills watcher error (" + target.path + "): " + String(error));
		if (state.initialScan === "pending") state.initialScan = "error";
		const change = state.unavailable ? "skills" : "unavailable";
		state.unavailable = true;
		publishSkillsWatchChanges([{
			...targetChange,
			change
		}]);
		const subscriber = state.subscribers.values().next().value;
		if (isCurrent() && !state.recovering && subscriber !== void 0) subscribeWorkspaceToPath(subscriber, target);
	};
	const publishReady = () => {
		for (const subscriber of Array.from(state.subscribers)) {
			if (!isCurrent()) return;
			workspaceWatchOwners.get(subscriber)?.reconcileTargets?.();
		}
		if (!isCurrent() || updateRequested) return;
		const restored = state.unavailable;
		state.unavailable = false;
		state.failed = false;
		state.recovering = false;
		state.verified = true;
		const changes = [];
		if (state.initialScan !== "ready") {
			state.initialScan = "ready";
			const watcherKeys = [...state.subscribers].filter((key) => workspaceWatchTargets.get(key)?.every((entry) => {
				const current = pathWatchers.get(entry.path);
				return current && !current.closed && current.initialScan !== "pending";
			}));
			changes.push({
				...targetChange,
				watcherKeys,
				change: "initial-scan"
			});
		}
		if (restored) changes.push({
			...targetChange,
			change: "skills"
		});
		publishSkillsWatchChanges(changes);
		publishRecoveredCoverage();
	};
	starting = runInSkillsWatcherContext(() => Promise.resolve().then(async () => {
		if (!isCurrent()) return;
		state.authority = admitObservationRoot(target.authorityPath);
		const authority = await state.authority;
		if (!isCurrent()) return;
		const scope = await skillsObservationScope(authority, {
			...target,
			depth: state.depth
		}, lifetime.signal);
		plannedScope = scope;
		if (!isCurrent()) return;
		const { mode, pollIntervalMs, reportHealth } = skillsObservationTransport(target.path);
		subscription = watch$1(authority, {
			scopes: [scope],
			mode,
			pollIntervalMs,
			signal: lifetime.signal,
			exclude: (entry) => {
				if (plannedScope?.kind === "entry" && entry.path === plannedScope.path) entryDirectoryObserved = entry.kind === "directory";
				const absolute = path.resolve(authority.rootDir, entry.path);
				const inside = isPathInside(target.path, absolute);
				const ignored = inside && isIgnoredSkillsWatchPath(path.relative(target.path, absolute));
				if (inside && !ignored && scannedKinds) {
					if (!scannedKinds.has(entry.path) && scannedKinds.size >= MAX_SKILLS_WATCH_ENTRY_KINDS) scannedKinds = void 0;
					else scannedKinds.set(entry.path, scannedKinds.get(entry.path) === true || entry.kind !== "file");
				}
				return ignored;
			},
			onInvalidate: (hint) => {
				if (!isCurrent()) return;
				if (subscriptionReady && plannedScope?.kind === "entry" && (!hint.changes || hint.changes.some((change) => change.type === "structural"))) {
					publishSkillsWatchChanges([{
						...targetChange,
						changedPath: target.path,
						change: "skills"
					}]);
					if (isCurrent()) state.refreshScope();
					return;
				}
				if (state.initialScan === "pending") return;
				if (!hint.changes) {
					schedule(target.path);
					return;
				}
				for (const change of hint.changes) {
					const changedPath = path.resolve(authority.rootDir, change.path);
					const inside = isPathInside(target.path, changedPath);
					const relative = path.relative(target.path, changedPath);
					if (inside && isIgnoredSkillsWatchPath(relative)) continue;
					if (!inside && !(change.type === "structural" && isPathInside(changedPath, target.path))) continue;
					if (isSkillDiscoveryFileWatchPath(relative) && (change.type === "content" || scannedKinds?.has(change.path) !== false)) stability.schedule(changedPath);
					else if (change.type === "structural") {
						const before = entryKinds?.get(change.path);
						const after = scannedKinds?.get(change.path);
						const supportingFile = inside && relative !== "" && !isSkillDiscoveryFileWatchPath(relative) && entryKinds !== void 0 && scannedKinds !== void 0 && before !== true && after !== true && (before === false || after === false);
						schedule(changedPath, supportingFile ? "supporting" : "skills");
					} else schedule(changedPath, "supporting");
				}
			},
			onHealth: (health) => {
				if (isCurrent()) reportHealth(health);
				if (health.state === "starting" || health.state === "reconciling") scannedKinds = /* @__PURE__ */ new Map();
				else if (health.state === "ready") {
					if (!scannedKinds) entryKinds = void 0;
					else if (entryKinds) for (const [name, kind] of scannedKinds) {
						if (!entryKinds.has(name) && entryKinds.size >= MAX_SKILLS_WATCH_ENTRY_KINDS) {
							entryKinds = void 0;
							break;
						}
						entryKinds.set(name, kind);
					}
					scannedKinds = /* @__PURE__ */ new Map();
				}
				if (health.state === "unavailable") failed(health.failure?.error, health.failure);
			}
		});
		await subscription.ready;
		if (!isCurrent()) return;
		subscriptionReady = true;
		if (plannedScope?.kind === "entry" && entryDirectoryObserved) {
			state.refreshScope();
			return;
		}
		publishReady();
	}));
	starting.catch((error) => failed(error, subscription?.health().failure));
	return state;
}
function subscribeWorkspaceToPath(workspaceDir, target) {
	const existing = pathWatchers.get(target.path);
	if (existing) {
		existing.subscribers.add(workspaceDir);
		const healthy = !existing.closed && !existing.failed;
		const reusable = healthy && existing.depth >= target.depth;
		existing.depth = Math.max(existing.depth, target.depth);
		if (reusable || existing.replacing) return;
		existing.verified = false;
		if (healthy) {
			existing.refreshScope();
			return;
		}
		if (!existing.unavailable) {
			existing.unavailable = true;
			publishSkillsWatchChanges([{
				targetPath: target.path,
				state: existing,
				watcherKeys: existing.subscribers,
				change: "unavailable"
			}]);
		}
		existing.replacing = true;
		const replacement = existing.close().then(() => {
			if (watchersClosing || nativeWatchCapacityFailed || pathWatchers.get(target.path) !== existing || existing.subscribers.size === 0) return;
			const next = createSkillsPathWatcher({
				...target,
				depth: existing.depth
			}, existing);
			for (const subscriber of existing.subscribers) {
				next.subscribers.add(subscriber);
				workspaceWatchTargetCache.delete(subscriber);
			}
			pathWatchers.set(target.path, next);
		}).catch((error) => log.warn("skills observation retirement failed (" + target.path + "): " + String(error)));
		replacingWatchers.add(replacement);
		replacement.finally(() => replacingWatchers.delete(replacement));
		return;
	}
	const state = createSkillsPathWatcher(target);
	state.subscribers.add(workspaceDir);
	pathWatchers.set(target.path, state);
}
function disposeWorkspaceWatchState(watcherKey, watchTargets = workspaceWatchTargets.get(watcherKey) ?? []) {
	disposeRemoteSkillsWatcher(watcherKey);
	for (const watchTarget of watchTargets) unsubscribeWorkspaceFromPath(watcherKey, watchTarget);
	workspaceWatchTargets.delete(watcherKey);
	workspaceWatchOwners.delete(watcherKey);
	workspaceWatchTargetCache.delete(watcherKey);
	workspaceWatchLastEnsuredAt.delete(watcherKey);
}
function ensureSkillsWatcher(params) {
	if (watchersClosing) return;
	const { workspaceDir, executionWorkspaceDir, watcherKey, sourceScope } = resolveSkillsWatchScope(params);
	if (!workspaceDir) return;
	const owner = {
		workspaceDir,
		sourceScope,
		sharedScanPending: workspaceWatchOwners.get(watcherKey)?.sharedScanPending ?? false,
		unavailable: workspaceWatchOwners.get(watcherKey)?.unavailable ?? false
	};
	workspaceWatchOwners.set(watcherKey, owner);
	const isCurrent = () => !watchersClosing && workspaceWatchOwners.get(watcherKey) === owner;
	const refreshInputs = {
		sourceScope,
		config: params.config,
		pluginMetadataSnapshot: params.pluginMetadataSnapshot
	};
	const now = Date.now();
	if (params.config?.skills?.load?.watch === false) {
		disposeWorkspaceWatchState(watcherKey);
		evictWorkspaceWatchStates(now, disposeWorkspaceWatchState);
		return;
	}
	workspaceWatchLastEnsuredAt.delete(watcherKey);
	workspaceWatchLastEnsuredAt.set(watcherKey, now);
	evictWorkspaceWatchStates(now, disposeWorkspaceWatchState);
	if (!isCurrent()) return;
	const access = getAgentWorkspaceAccess(workspaceDir, "loadSkills");
	let localPlan = params.sourcePlan;
	let localExecutionWorkspaceDir = executionWorkspaceDir;
	if (access?.loadSkills) {
		const { gatewayPlan, workspacePlan, gatewayExecutionWorkspaceDir, workspaceExecutionWorkspaceDir } = splitSkillSourcePlan(resolveWorkspaceSkillSourcePlan(workspaceDir, params), sourceScope);
		localExecutionWorkspaceDir = gatewayExecutionWorkspaceDir;
		ensureRemoteSkillsWatcher({
			watcherKey,
			workspaceDir,
			executionWorkspaceDir: workspaceExecutionWorkspaceDir,
			access,
			sourcePlan: workspacePlan
		});
		localPlan = gatewayPlan;
	} else disposeRemoteSkillsWatcher(watcherKey);
	if (!isCurrent()) return;
	if (nativeWatchCapacityFailed) {
		workspaceWatchTargetCache.delete(watcherKey);
		bumpSkillsSnapshotVersion({
			workspaceDir,
			refreshInputs,
			reason: "watch"
		});
		return;
	}
	const reconcileTargets = (retryFailedTargets) => {
		const previousTargets = workspaceWatchTargets.get(watcherKey) ?? [];
		const failedTargets = retryFailedTargets ? previousTargets.filter((entry) => pathWatchers.get(entry.path)?.unavailable) : [];
		if (failedTargets.length > 0) workspaceWatchTargetCache.delete(watcherKey);
		const cachedTargets = workspaceWatchTargetCache.get(watcherKey);
		const resolvedTargets = resolveSkillsWatchTargets(workspaceDir, params.config, params.agentId, localExecutionWorkspaceDir, params.pluginMetadataSnapshot, localPlan, cachedTargets);
		if (resolvedTargets !== cachedTargets) workspaceWatchTargetCache.set(watcherKey, resolvedTargets);
		const watchTargets = resolvedTargets.targets;
		const targetChanges = compareSkillsWatchTargets(previousTargets, watchTargets, previousTargets.length ? previousTargets : Array.from(workspaceWatchOwners).flatMap(([key, other]) => other.workspaceDir === workspaceDir ? workspaceWatchTargets.get(key) ?? [] : []));
		const watcherDepthsCoverTargets = watchTargets.every((watchTarget) => (pathWatchers.get(watchTarget.path)?.depth ?? -1) >= watchTarget.depth);
		if (targetChanges.targetsUnchanged && watcherDepthsCoverTargets && failedTargets.length === 0) return;
		const nextTargetKeys = new Set(watchTargets.map((target) => target.path));
		for (const watchTarget of previousTargets) if (!nextTargetKeys.has(watchTarget.path)) unsubscribeWorkspaceFromPath(watcherKey, watchTarget);
		workspaceWatchTargets.set(watcherKey, watchTargets);
		for (const watchTarget of watchTargets) {
			const existing = pathWatchers.get(watchTarget.path);
			if (!retryFailedTargets && existing?.unavailable && (existing.failed || existing.closed)) existing.subscribers.add(watcherKey);
			else subscribeWorkspaceToPath(watcherKey, watchTarget);
			if (!isCurrent()) return;
		}
		owner.sharedScanPending ||= hasUnreadySharedTargets(watcherKey);
		const joinedUnavailable = watchTargets.some((target) => pathWatchers.get(target.path)?.unavailable && !previousTargets.some((previous) => previous.path === target.path));
		const notifyUnavailable = joinedUnavailable && !owner.unavailable;
		owner.unavailable ||= joinedUnavailable;
		if (!targetChanges.targetsUnchanged || failedTargets.length > 0) bumpSkillsSnapshotVersion({
			workspaceDir,
			sourceScopes: targetChanges.sharedTargetsChanged || failedTargets.some((target) => !target.executionOnly) ? void 0 : [sourceScope],
			refreshInputs,
			reason: notifyUnavailable ? "watch-unavailable" : "watch-targets",
			changedPath: watchTargets.map((target) => target.path).join("|")
		});
	};
	owner.reconcileTargets = () => {
		if (!isCurrent() || nativeWatchCapacityFailed) return;
		workspaceWatchTargetCache.delete(watcherKey);
		reconcileTargets(false);
	};
	reconcileTargets(true);
}
/** Finish discovery deferred during an outage before a worker advertises coverage. */
function reconcileSkillsWatcherCoverage(params) {
	ensureSkillsWatcher(params);
	const { watcherKey } = resolveSkillsWatchScope(params);
	const owner = workspaceWatchOwners.get(watcherKey);
	const covered = !watchersClosing && !nativeWatchCapacityFailed && hasVerifiedCoverage(watcherKey);
	if (owner && !covered) owner.unavailable = true;
	return covered;
}
async function closeSkillsWatchers(resetState = false) {
	watchersClosing = true;
	if (resetState) resetSkillsRefreshStateForTest();
	const active = Array.from(pathWatchers.values());
	nativeWatchCapacityFailed = false;
	pathWatchers.clear();
	workspaceWatchTargets.clear();
	workspaceWatchOwners.clear();
	workspaceWatchTargetCache.clear();
	workspaceWatchLastEnsuredAt.clear();
	active.forEach((state) => void state.close());
	const errors = (await Promise.allSettled([
		...replacingWatchers,
		...retiringWatchers,
		closeRemoteSkillsWatchers()
	])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length) throw new AggregateError(errors, "Skills watcher shutdown failed");
	watchersClosing = false;
}
//#endregion
export { ensureSkillsWatcher as n, reconcileSkillsWatcherCoverage as r, closeSkillsWatchers as t };
