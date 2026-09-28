import fs from "node:fs";
import path from "node:path";
//#region extensions/anthropic/session-catalog-tree-watch.ts
const WATCH_RETRY_MS = 5e3;
const WATCH_ARM_MS = 250;
function createDirtyDirectoryWatch(root) {
	const recursive = process.platform === "darwin" || process.platform === "win32";
	const children = /* @__PURE__ */ new Map();
	let rootWatch;
	let dirty = /* @__PURE__ */ new Set();
	let retryAt = 0;
	let armAt = 0;
	let armed = false;
	let closed = false;
	const closeWatchers = () => {
		rootWatch?.close();
		rootWatch = void 0;
		for (const watcher of children.values()) watcher.close();
		children.clear();
	};
	const fail = () => {
		closeWatchers();
		dirty = "all";
		retryAt = Date.now() + WATCH_RETRY_MS;
	};
	const attach = (child) => {
		try {
			if (!recursive && process.platform !== "linux") {
				fail();
				return;
			}
			return fs.watch(child ? path.join(root, child) : root, {
				recursive,
				persistent: false
			}, (event, filename) => {
				const name = child ?? filename?.split(/[\\/]/, 1)[0];
				if (!name || !child && event === "rename" && filename === path.basename(root)) dirty = "all";
				else if (dirty !== "all") dirty.add(name);
				if (!child && event === "rename" && name) {
					children.get(name)?.close();
					children.delete(name);
				}
			}).on("error", fail);
		} catch (error) {
			const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
			if (child && (code === "ENOENT" || code === "ENOTDIR")) return;
			fail();
			return;
		}
	};
	const attachRoot = () => {
		rootWatch = attach();
		armAt = performance.now() + WATCH_ARM_MS;
		armed = false;
		dirty = rootWatch ? /* @__PURE__ */ new Set() : "all";
	};
	attachRoot();
	return {
		takeDirty() {
			if (closed || !rootWatch) {
				if (!closed && Date.now() >= retryAt) attachRoot();
				return "all";
			}
			if (!armed) {
				armed = performance.now() >= armAt;
				return "all";
			}
			const result = dirty;
			if (result === "all") {
				closeWatchers();
				attachRoot();
			} else dirty = /* @__PURE__ */ new Set();
			return result;
		},
		observeChildDirectories(names) {
			if (recursive || closed || !rootWatch) return;
			const wanted = new Set(names);
			for (const [name, watcher] of children) if (!wanted.has(name)) {
				watcher.close();
				children.delete(name);
			}
			for (const name of wanted) if (!children.has(name)) {
				const watcher = attach(name);
				if (!rootWatch) break;
				if (watcher) children.set(name, watcher);
			}
		},
		close() {
			closed = true;
			closeWatchers();
		}
	};
}
//#endregion
export { createDirtyDirectoryWatch as t };
