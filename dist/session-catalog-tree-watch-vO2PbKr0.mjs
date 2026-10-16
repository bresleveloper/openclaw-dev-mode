import { f as watch } from "./file-access-runtime-BMp89X4Y.mjs";
import { r as admitObservationRoot } from "./fs-observation-snapshot-DTptcApl.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/anthropic/session-catalog-tree-watch.ts
const WATCH_RETRY_MS = 5e3;
function createDirtyDirectoryWatch(directory, depth = 2) {
	let subscription;
	let starting;
	let dirty = "all";
	let retryAt = 0;
	let closed = false;
	const start = () => {
		starting = (async () => {
			await subscription?.close();
			subscription = void 0;
			const canonical = await fs.realpath(directory);
			const authority = await admitObservationRoot(canonical, "allow");
			const scope = path.relative(authority.rootDir, canonical) || ".";
			if (closed) return;
			subscription = watch(authority, {
				mode: "auto",
				persistent: false,
				scopes: [{
					path: scope,
					kind: "tree",
					depth
				}],
				onInvalidate: ({ changes }) => {
					if (!changes) dirty = "all";
					else if (dirty !== "all") for (const change of changes) {
						const name = path.relative(canonical, path.resolve(authority.rootDir, change.path)).split(path.sep, 1)[0];
						if (!name || name === "." || name === "..") {
							dirty = "all";
							break;
						}
						dirty.add(name);
					}
				},
				onHealth: (health) => {
					if (health.state === "unavailable") {
						dirty = "all";
						retryAt = Date.now() + WATCH_RETRY_MS;
					}
				}
			});
			await subscription.ready;
		})().catch(() => {
			dirty = "all";
			retryAt = Date.now() + WATCH_RETRY_MS;
		}).finally(() => {
			starting = void 0;
		});
	};
	start();
	return {
		takeDirty() {
			const state = subscription?.health().state;
			if (closed || starting || !subscription || state === "unavailable" || state === "closed") {
				if (!closed && !starting && Date.now() >= retryAt) start();
				return "all";
			}
			const result = dirty;
			dirty = /* @__PURE__ */ new Set();
			return result;
		},
		async close() {
			closed = true;
			await starting;
			await subscription?.close();
		}
	};
}
//#endregion
export { createDirtyDirectoryWatch as t };
