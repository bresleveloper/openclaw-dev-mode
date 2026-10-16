import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { d as sleepWithAbort } from "./src-D1BHGNTj.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import "./memory-core-host-engine-storage-CqSKqDgK.mjs";
import { d as matchesExtraMemoryPathEntry, f as normalizeExtraMemoryPathEntries } from "./read-file-BpEQe7Bw.mjs";
import { r as classifyMemoryMultimodalPath } from "./multimodal-B9eYMDXo.mjs";
import { f as watch } from "./file-access-runtime-BMp89X4Y.mjs";
import { a as resolveFsObservationIntervalMs, i as observationPrefixKind, n as readObservationSnapshot, o as resolveFsObservationMode, r as admitObservationRoot, t as ObservationSampleCloseError } from "./fs-observation-snapshot-DTptcApl.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./setup-tools-D6A0I-Kz.mjs";
import "./memory-core-host-engine-embeddings-D5ue0oCU.mjs";
import "./memory-core-host-engine-foundation-C-kkcjpF.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/memory-core/src/memory/watch-policy.ts
const IGNORED = /* @__PURE__ */ new Set([
	".git",
	"node_modules",
	".pnpm-store",
	".venv",
	"venv",
	".tox",
	"__pycache__"
]);
async function firstLink(authority, relative, signal) {
	let parent = ".";
	const segments = relative.split(path.sep).filter((part) => part && part !== ".");
	for (const segment of segments) {
		signal.throwIfAborted();
		parent = path.join(parent, segment);
		const kind = await observationPrefixKind(authority, parent, signal);
		if (kind === "symlink") return parent;
		if (kind !== "directory") return;
	}
}
var MemoryWatchPolicy = class {
	constructor(workspace, settings) {
		this.settings = settings;
		this.roots = /* @__PURE__ */ new Map();
		this.extras = normalizeExtraMemoryPathEntries(workspace, settings.extraPaths);
		this.targets = [
			{
				path: path.resolve(workspace, "MEMORY.md"),
				kind: "entry",
				core: true
			},
			{
				path: path.resolve(workspace, "USER.md"),
				kind: "entry",
				core: true
			},
			{
				path: path.resolve(workspace, "memory"),
				kind: "tree",
				core: true
			},
			...this.extras.map((entry) => ({
				path: entry.path,
				kind: "tree",
				core: false
			}))
		];
	}
	async admit(boundary, signal) {
		const cached = this.roots.get(boundary);
		if (cached) return cached;
		const admitted = await admitObservationRoot(boundary, "allow");
		signal.throwIfAborted();
		this.roots.set(boundary, admitted);
		return admitted;
	}
	async observations(signal) {
		const groups = /* @__PURE__ */ new Map();
		const add = (authority, selection) => {
			const group = groups.get(authority) ?? {
				root: authority,
				selections: []
			};
			group.selections.push(selection);
			groups.set(authority, group);
		};
		for (const target of this.targets) {
			signal.throwIfAborted();
			let boundary = target.core ? path.dirname(path.dirname(target.path)) : path.dirname(target.path);
			let absolute = target.path;
			for (let links = 0;; links++) {
				if (links >= 40) throw new Error("Memory watch target has too many symbolic links");
				const authority = await this.admit(boundary, signal);
				signal.throwIfAborted();
				const relative = path.relative(authority.rootDir, absolute) || ".";
				const link = await firstLink(authority, relative, signal);
				signal.throwIfAborted();
				add(authority, {
					scope: link ? {
						path: link,
						kind: "entry"
					} : {
						path: relative,
						kind: target.kind,
						depth: 128
					},
					resolved: path.resolve(authority.rootDir, link ?? relative),
					lexical: target.path,
					core: target.core,
					alias: link !== void 0
				});
				if (!link || path.normalize(link) === path.normalize(relative)) break;
				const alias = path.resolve(authority.rootDir, link);
				const destination = await fs.readlink(alias);
				signal.throwIfAborted();
				absolute = path.resolve(path.dirname(alias), destination, path.relative(alias, absolute));
				boundary = path.dirname(absolute);
			}
		}
		return [...groups.values()];
	}
	scopes(group) {
		return [...new Map(group.selections.map(({ scope }) => [JSON.stringify(scope), scope])).values()];
	}
	ignored(relative, file, kind) {
		if (relative.split(path.sep).some((part) => IGNORED.has(part.toLowerCase()))) return true;
		if (kind === "directory") return false;
		if (kind === "symlink") return true;
		const extension = path.extname(file).toLowerCase();
		return extension !== "" && extension !== ".md" && classifyMemoryMultimodalPath(file, this.settings.multimodal) === null;
	}
	exclude(group, entry) {
		const absolute = path.resolve(group.root.rootDir, entry.path);
		for (const selection of group.selections) {
			const selected = selection.resolved;
			if (absolute === selected || selection.scope.kind === "tree" && isPathInside(selected, absolute)) {
				if (selection.alias && absolute === selected) return false;
				const relative = path.relative(selected, absolute);
				const lexical = path.join(selection.lexical, relative);
				if (!this.ignored(relative, lexical, entry.kind)) return false;
			} else if (isPathInside(absolute, selected)) return false;
		}
		return true;
	}
	select(group, relative, structural) {
		const absolute = path.resolve(group.root.rootDir, relative);
		for (const selection of group.selections) {
			const selected = selection.resolved;
			if (absolute !== selected && (selection.scope.kind !== "tree" || !isPathInside(selected, absolute))) continue;
			if (selection.alias) return {
				root: group.root,
				relative: selection.scope.path,
				sample: false
			};
			const selectedRelative = path.relative(selected, absolute);
			const lexical = path.join(selection.lexical, selectedRelative);
			if (this.ignored(selectedRelative, lexical, structural ? "directory" : "file")) continue;
			if (!selection.core && !this.extras.some((entry) => isPathInside(entry.path, lexical) && (!this.ignored(selectedRelative, lexical, "file") && matchesExtraMemoryPathEntry(entry, lexical) || structural && matchesExtraMemoryPathEntry(entry, lexical, { directory: true })))) continue;
			return {
				root: group.root,
				relative,
				sample: true
			};
		}
	}
};
//#endregion
//#region extensions/memory-core/src/memory/watch-settle.ts
const MEMORY_WATCH_MAX_PATHS = 1024;
const MEMORY_WATCH_SETTLE_RECHECK_MS = 100;
function snapshotsMatch(left, right) {
	return left === null || right === null ? left === right : left.size === right.size && left.mtimeMs === right.mtimeMs;
}
async function snapshotPath(file) {
	return file.sample ? await readObservationSnapshot(file.root, file.relative) ?? null : null;
}
function recordMemoryWatchEventPath(queue, file) {
	const key = path.resolve(file.root.rootDir, file.relative);
	queue.set(key, {
		file,
		snapshot: null
	});
	if (queue.size > 1024) queue.clear();
}
async function settleMemoryWatchEventPaths(queue, signal) {
	signal?.throwIfAborted();
	const entries = [...queue];
	queue.clear();
	const missingBaseline = [];
	const retain = (key, pending) => {
		if (!queue.has(key) && queue.size < 1024) queue.set(key, pending);
	};
	for (const [key, pending] of entries) {
		signal?.throwIfAborted();
		const snapshot = await snapshotPath(pending.file);
		signal?.throwIfAborted();
		if (pending.snapshot === null) {
			if (snapshot !== null) missingBaseline.push([key, {
				file: pending.file,
				snapshot
			}]);
		} else if (!snapshotsMatch(pending.snapshot, snapshot)) retain(key, {
			file: pending.file,
			snapshot
		});
	}
	if (missingBaseline.length) {
		await sleepWithAbort(MEMORY_WATCH_SETTLE_RECHECK_MS, signal);
		for (const [key, pending] of missingBaseline) {
			signal?.throwIfAborted();
			const snapshot = await snapshotPath(pending.file);
			signal?.throwIfAborted();
			if (!snapshotsMatch(pending.snapshot, snapshot)) retain(key, {
				file: pending.file,
				snapshot
			});
		}
	}
	return queue.size === 0;
}
//#endregion
//#region extensions/memory-core/src/memory/file-watcher.ts
const log = createSubsystemLogger("memory");
const RETRY_DELAYS_MS = [
	500,
	2e3,
	5e3
];
const DEFAULT_POLL_INTERVAL_MS = 3e4;
var MemoryFileWatcher = class {
	constructor(options) {
		this.options = options;
		this.lifetime = new AbortController();
		this.observations = /* @__PURE__ */ new Map();
		this.rootIds = /* @__PURE__ */ new WeakMap();
		this.nextRootId = 0;
		this.pendingPaths = /* @__PURE__ */ new Map();
		this.pressureWarningShown = false;
		this.pollingWarningShown = false;
		this.closeErrors = [];
		this.closed = false;
		this.degraded = false;
		this.retries = 0;
		this.retryExhausted = false;
		this.refreshRequested = false;
		this.pendingChange = false;
		this.revision = 0;
		this.policy = new MemoryWatchPolicy(options.workspaceDir, options.settings);
	}
	get capacityDegraded() {
		return this.degraded;
	}
	health() {
		return [...this.observations.values()].map(({ subscription, mode, pollIntervalMs }) => {
			const health = subscription.health();
			return {
				state: health.state,
				mode: health.mode,
				directories: health.directories,
				failure: health.failure ? {
					operation: health.failure.operation,
					code: health.failure.code,
					error: String(health.failure.error)
				} : void 0,
				pollingFallback: mode === "auto" && health.mode === "poll",
				pollIntervalMs
			};
		});
	}
	start() {
		return this.starting ??= this.options.runInBackgroundContext(() => this.refresh());
	}
	get canObserve() {
		return !(this.closed || this.degraded || this.closeErrors.length || this.recovering || this.retryTimer || this.retryExhausted);
	}
	refresh() {
		if (!this.canObserve) return Promise.resolve();
		this.refreshRequested = true;
		return this.refreshing ??= Promise.resolve().then(async () => {
			while (this.refreshRequested && this.canObserve) {
				this.refreshRequested = false;
				const groups = (await this.policy.observations(this.lifetime.signal)).flatMap((group) => {
					let id = this.rootIds.get(group.root);
					if (id === void 0) {
						id = ++this.nextRootId;
						this.rootIds.set(group.root, id);
					}
					const chunks = [];
					for (let offset = 0; offset < group.selections.length; offset += 128) chunks.push({
						id: String(id) + ":" + offset,
						group: {
							root: group.root,
							selections: group.selections.slice(offset, offset + 128)
						}
					});
					return chunks;
				});
				if (!this.canObserve) return;
				const next = new Set(groups.map((group) => group.id));
				const removed = [...this.observations.values()].filter((entry) => !next.has(entry.id));
				await this.retire(removed);
				if (!this.canObserve) return;
				const ready = [];
				for (const { id, group } of groups) {
					if (!this.canObserve) return;
					const scopes = this.policy.scopes(group);
					const key = JSON.stringify(scopes);
					const entry = this.observations.get(id);
					if (entry) {
						entry.group = group;
						if (entry.key !== key) {
							entry.key = key;
							ready.push(entry.subscription.setScopes(scopes));
						}
						continue;
					}
					const mode = resolveFsObservationMode();
					const pollIntervalMs = resolveFsObservationIntervalMs(process.env, DEFAULT_POLL_INTERVAL_MS);
					const owner = {
						id,
						group,
						key,
						mode,
						pollIntervalMs,
						subscription: watch(group.root, {
							scopes,
							mode,
							pollIntervalMs,
							maxDirectories: 1e6,
							maxEntries: 1e6,
							maxPendingPaths: MEMORY_WATCH_MAX_PATHS,
							signal: this.lifetime.signal,
							exclude: (file) => this.policy.exclude(owner.group, file),
							onInvalidate: (hint) => this.dirty(owner.group, hint),
							onHealth: (health) => this.onHealth(health, mode, pollIntervalMs)
						})
					};
					this.observations.set(id, owner);
					ready.push(owner.subscription.ready);
				}
				await Promise.all(ready);
			}
		}).catch((error) => {
			if (!this.closed) this.unavailable(error);
		}).finally(() => {
			this.refreshing = void 0;
			if (this.refreshRequested && !this.retryTimer) this.refresh();
		});
	}
	dirty(group, hint) {
		if (!hint.changes) {
			this.markDirty();
			this.refresh();
			return;
		}
		if (hint.changes.length && (hint.reason === "event" || hint.reason === "reconcile")) this.retries = 0;
		let structural = false;
		for (const change of hint.changes) {
			structural ||= change.type === "structural";
			const file = this.policy.select(group, change.path, change.type === "structural");
			if (file) this.markDirty(file);
		}
		if (structural) this.refresh();
	}
	onHealth(health, mode, pollIntervalMs) {
		if (health.state === "unavailable") {
			const code = health.failure?.operation === "watch" && health.failure.code === "watch-limit" ? "watch-limit" : void 0;
			this.unavailable(health.failure?.error, code);
			return;
		}
		if (health.state !== "ready") return;
		if (mode === "auto" && health.mode === "poll" && !this.pollingWarningShown) {
			this.pollingWarningShown = true;
			const reason = health.failure ? `${health.failure.code ?? health.failure.operation}: ${String(health.failure.error)}` : "native watch events are unavailable; fs-safe did not report a reason";
			log.warn(`memory watcher using fallback polling every ${pollIntervalMs} ms: ${reason}. Native watching will not be retried until the watcher restarts.`);
		}
		const count = [...this.observations.values()].reduce((total, entry) => total + entry.subscription.health().directories, 0);
		if (this.pressureWarningShown || count <= 2e3) return;
		this.pressureWarningShown = true;
		const detail = health.mode === "poll" ? "Large memory folders or extraPaths increase metadata polling work." : "Large memory folders or extraPaths can exhaust file-watch/open-file limits.";
		log.warn(`Memory file watching is tracking ${count} observed directories. ${detail} Remove unnecessary memory.search.extraPaths entries or narrow their roots. After changes, restart the Gateway. To refresh the index, run in the Gateway's environment: ` + formatCliCommand("openclaw memory index --force --agent " + this.options.agentId) + ".");
	}
	unavailable(error, capacityCode) {
		if (this.closed || this.recovering || this.retryTimer || this.degraded) return;
		this.degraded ||= Boolean(capacityCode);
		this.options.onUnavailable();
		this.markDirty();
		log.warn(capacityCode ? "memory watcher capacity exhausted (" + capacityCode + "); watching disabled, memory will refresh on search" : "memory watcher unavailable; memory will refresh on search: " + String(error));
		const retirement = this.retire([...this.observations.values()]);
		this.recovering = retirement.finally(() => {
			this.recovering = void 0;
			if (this.closed || this.degraded || this.closeErrors.length) return;
			const delay = RETRY_DELAYS_MS[this.retries++];
			if (delay === void 0) {
				this.retryExhausted = true;
				return;
			}
			this.retryTimer = setTimeout(() => {
				this.retryTimer = void 0;
				this.refresh();
			}, delay);
			this.retryTimer.unref();
		});
	}
	async retire(entries) {
		for (const entry of entries) this.observations.delete(entry.id);
		const results = await Promise.allSettled(entries.map((entry) => entry.subscription.close()));
		for (const result of results) {
			if (result.status !== "rejected") continue;
			this.closeErrors.push(result.reason);
			if (!this.closed) this.options.onUnavailable();
			log.warn("memory watcher close failed; observation will not restart: " + String(result.reason));
		}
	}
	markDirty(file) {
		if (this.closed) return;
		this.revision++;
		this.pendingChange = true;
		if (file) recordMemoryWatchEventPath(this.pendingPaths, file);
		this.options.onDirty?.();
		this.scheduleSync();
	}
	scheduleSync(recheck = false) {
		if (this.closed || this.settling) return;
		clearTimeout(this.watchTimer);
		this.watchTimer = setTimeout(() => {
			this.watchTimer = void 0;
			let retry = false;
			const revision = this.revision;
			this.settling = Promise.resolve().then(async () => {
				if (this.closed) return;
				if (!await settleMemoryWatchEventPaths(this.pendingPaths, this.lifetime.signal)) {
					retry = true;
					return;
				}
				if (this.closed) return;
				this.pendingChange = this.revision !== revision;
				await this.options.runInBackgroundContext(() => this.options.onChange());
			}).catch((error) => {
				if (error instanceof ObservationSampleCloseError) {
					this.closeErrors.push(error.cause);
					this.unavailable(error);
				}
				if (!this.closed) {
					this.pendingChange = this.revision !== revision;
					log.warn("memory sync failed (watch): " + String(error));
				}
			}).finally(() => {
				this.settling = void 0;
				if (this.pendingChange) this.scheduleSync(retry);
			});
		}, Math.max(recheck ? 100 : 0, this.options.settings.sync.watchDebounceMs));
		this.watchTimer.unref();
	}
	close() {
		if (this.closing) return this.closing;
		this.closing = this.options.runInBackgroundContext(async () => {
			this.closed = true;
			this.lifetime.abort();
			clearTimeout(this.watchTimer);
			clearTimeout(this.retryTimer);
			const retirement = this.retire([...this.observations.values()]);
			await Promise.allSettled([
				this.starting,
				this.refreshing,
				this.recovering,
				this.settling,
				retirement
			]);
			this.pendingPaths.clear();
			if (this.closeErrors.length) throw new AggregateError(this.closeErrors, "Memory watcher cleanup failed");
		});
		return this.closing;
	}
};
//#endregion
export { MemoryFileWatcher as t };
