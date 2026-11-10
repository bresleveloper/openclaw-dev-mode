import { t as runInDetachedAsyncContext } from "./openclaw-state-read-detached-async-context-BrFwufJ7.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/owned-directory-observation.ts
const directories = /* @__PURE__ */ new Map();
const sources = /* @__PURE__ */ new Map();
let fallback;
let fallbackDueAtMs = Infinity;
const REPAIR_INTERVAL_MS = 3e4;
const RECOVERY_INTERVAL_MS = 3e5;
function nextFallback(intervalMs) {
	const now = Date.now();
	const atMs = (Math.floor(now / intervalMs) + 1) * intervalMs;
	return {
		atMs,
		elapsedAtMs: performance.now() + atMs - now
	};
}
function fallbackRemaining(directory) {
	return Math.min(directory.nextFallback.atMs - Date.now(), directory.nextFallback.elapsedAtMs - performance.now());
}
function retainEarlierFallback(directory, deadline) {
	directory.nextFallback.atMs = Math.min(directory.nextFallback.atMs, deadline.atMs);
	directory.nextFallback.elapsedAtMs = Math.min(directory.nextFallback.elapsedAtMs, deadline.elapsedAtMs);
}
function fallbackInterval(directory) {
	return directory.source?.path === directory.path ? Math.min(RECOVERY_INTERVAL_MS, ...directory.listeners.values()) : REPAIR_INTERVAL_MS;
}
function scheduleFallback(changed) {
	if (!directories.size) return;
	const delayMs = changed ? fallbackRemaining(changed) : Math.min(...Array.from(directories.values(), fallbackRemaining));
	const dueAtMs = performance.now() + Math.max(0, Math.ceil(delayMs));
	if (fallback && fallbackDueAtMs <= dueAtMs) return;
	clearTimeout(fallback);
	fallbackDueAtMs = dueAtMs;
	fallback = runInDetachedAsyncContext(() => setTimeout(() => {
		fallback = void 0;
		for (const entry of Array.from(directories.values())) {
			if (fallbackRemaining(entry) > 0 || directories.get(entry.path) !== entry) continue;
			if (!entry.source || entry.source.path !== entry.path && fs.existsSync(entry.path)) {
				detach(entry);
				attach(entry);
			}
			entry.nextFallback = nextFallback(fallbackInterval(entry));
			notify(entry);
		}
		scheduleFallback();
	}, Math.max(0, Math.ceil(delayMs))).unref());
}
function detach(directory) {
	const source = directory.source;
	directory.source = void 0;
	if (source && source.directories.delete(directory) && !source.directories.size) {
		sources.delete(source.path);
		source.watcher.close();
	}
}
function notify(directory, filename) {
	const listeners = Array.from(directory.listeners.keys());
	for (const listener of listeners) listener(filename);
}
function watchPath(candidate) {
	return process.platform === "win32" && candidate.includes("~") ? fs.realpathSync.native(candidate) : candidate;
}
function attach(directory) {
	let candidate = directory.path;
	while (true) {
		const shared = sources.get(candidate);
		if (shared) {
			shared.directories.add(directory);
			directory.source = shared;
			return;
		}
		try {
			const watcher = runInDetachedAsyncContext(() => fs.watch(watchPath(candidate), { persistent: false }, (event, filename) => {
				const source = sources.get(candidate);
				if (!source || source.watcher !== watcher) return;
				const affected = [...source.directories];
				for (const entry of affected) notify(entry, entry.path === candidate ? filename?.toString() ?? void 0 : void 0);
				if (event === "rename") {
					const renamedRoot = !filename || filename === path.basename(candidate);
					const readmit = affected.filter((entry) => renamedRoot || entry.path !== candidate);
					for (const entry of readmit) detach(entry);
					for (const entry of readmit) if (directories.get(entry.path) === entry) {
						attach(entry);
						retainEarlierFallback(entry, nextFallback(fallbackInterval(entry)));
						scheduleFallback(entry);
					}
				}
			}));
			const source = {
				path: candidate,
				watcher,
				directories: /* @__PURE__ */ new Set([directory])
			};
			sources.set(candidate, source);
			directory.source = source;
			watcher.on("error", () => {
				const affected = Array.from(source.directories);
				for (const entry of affected) {
					detach(entry);
					notify(entry);
					retainEarlierFallback(entry, nextFallback(REPAIR_INTERVAL_MS));
					scheduleFallback(entry);
				}
			});
			return;
		} catch {
			const parent = path.dirname(candidate);
			if (parent === candidate) return;
			candidate = parent;
		}
	}
}
/** Shared invalidation for process-owned facts; consumers retain and refresh their own state. */
function observeOwnedDirectory(directoryPath, onChange, options) {
	const key = path.resolve(directoryPath);
	let directory = directories.get(key);
	if (!directory) {
		directory = {
			path: key,
			listeners: /* @__PURE__ */ new Map(),
			nextFallback: {
				atMs: Infinity,
				elapsedAtMs: Infinity
			}
		};
		directories.set(key, directory);
		attach(directory);
	}
	const selected = directory;
	const listener = (filename) => onChange(filename);
	selected.listeners.set(listener, options?.recoveryIntervalMs ?? RECOVERY_INTERVAL_MS);
	retainEarlierFallback(selected, nextFallback(fallbackInterval(selected)));
	scheduleFallback(selected);
	return { close() {
		if (!selected.listeners.delete(listener) || selected.listeners.size) return;
		directories.delete(key);
		detach(selected);
		if (!directories.size) {
			clearTimeout(fallback);
			fallback = void 0;
		}
	} };
}
//#endregion
export { observeOwnedDirectory as t };
