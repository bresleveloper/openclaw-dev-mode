import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as observeOwnedDirectory } from "./owned-directory-observation-DGvnK2He.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { existsSync } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
//#region src/agents/workspace-git.ts
/** Find the nearest .git entry, including the file used by linked worktrees. */
function findGitCheckoutRoot(start) {
	let current = path.resolve(start);
	for (;;) {
		if (existsSync(path.join(current, ".git"))) return current;
		const parent = path.dirname(current);
		if (parent === current) return null;
		current = parent;
	}
}
function insideGitCheckout(start) {
	return findGitCheckoutRoot(start) !== null;
}
const workspaceCheckouts = /* @__PURE__ */ new Map();
/** Display projection only; action admission keeps using current Git discovery. */
function hasWorkspaceGitCheckout(start) {
	const key = path.resolve(start);
	const cached = workspaceCheckouts.get(key);
	if (cached) return cached.value;
	const observers = [];
	let pending = false;
	const entry = {
		value: insideGitCheckout(key),
		refresh() {
			this.value = insideGitCheckout(key);
		},
		close() {
			for (const observer of observers) observer.close();
		}
	};
	workspaceCheckouts.set(key, entry);
	for (let directory = key, child;;) {
		const childName = child;
		observers.push(observeOwnedDirectory(directory, (filename) => {
			if (!pending && (filename === void 0 || filename === ".git" || filename === childName)) {
				pending = true;
				queueMicrotask(() => {
					pending = false;
					if (workspaceCheckouts.get(key) === entry) entry.refresh();
				});
			}
		}));
		const parent = path.dirname(directory);
		if (parent === directory) break;
		child = path.basename(directory);
		directory = parent;
	}
	for (const [oldest, status] of workspaceCheckouts) {
		if (workspaceCheckouts.size <= 128) break;
		workspaceCheckouts.delete(oldest);
		status.close();
	}
	return entry.value;
}
const isGitAvailable = createLazyPromise(async () => {
	try {
		return (await runCommandWithTimeout(["git", "--version"], { timeoutMs: 2e3 })).code === 0;
	} catch {
		return false;
	}
});
async function ensureGitRepo(dir, isBrandNewWorkspace, beforePersistentApply) {
	if (!isBrandNewWorkspace) return;
	beforePersistentApply?.();
	if (await fs$1.stat(path.join(dir, ".git")).catch(() => void 0)) return;
	if (!await isGitAvailable()) return;
	beforePersistentApply?.();
	try {
		await runCommandWithTimeout(["git", "init"], {
			cwd: dir,
			timeoutMs: 1e4
		});
	} catch {}
	const root = path.resolve(dir);
	for (const [workspace, checkout] of workspaceCheckouts) if (workspace === root || workspace.startsWith(root + path.sep)) checkout.refresh();
}
//#endregion
export { insideGitCheckout as i, findGitCheckoutRoot as n, hasWorkspaceGitCheckout as r, ensureGitRepo as t };
