import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CPodxfi3.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { n as readInstallOwner } from "./install-owner-BPfYmnil.mjs";
import { r as removePathWithinRoot, t as capturePathRemovalGuard } from "./fs-safe-remove-DYWyr3qX.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { walkDirectory } from "@openclaw/fs-safe/walk";
//#region src/commands/doctor/shared/plugin-runtime-symlinks.ts
const PLUGIN_RUNTIME_DEPS_MARKER = "plugin-runtime-deps";
const MAX_REPORTED = 6;
/** Find global node_modules symlinks that still point at stale plugin-runtime deps. */
async function collectStalePluginRuntimeSymlinks(packageRoot = resolveOpenClawPackageRootSync({
	argv1: process.argv[1],
	moduleUrl: import.meta.url,
	cwd: process.cwd()
})) {
	if (!packageRoot || await readInstallOwner(packageRoot)) return [];
	const containingNodeModules = path.dirname(packageRoot);
	if (path.basename(containingNodeModules) !== "node_modules") return [];
	const stale = [];
	const { entries } = await walkDirectory(containingNodeModules, {
		maxDepth: 2,
		symlinks: "include",
		include: (entry) => entry.kind === "symlink",
		descend: (entry) => entry.depth === 1 && entry.name.startsWith("@")
	});
	for (const entry of entries) {
		const candidate = await inspectCandidate(entry.path);
		if (candidate) stale.push({
			name: entry.relativePath.split(path.sep).join("/"),
			path: entry.path,
			...candidate
		});
	}
	return stale.toSorted((left, right) => left.name.localeCompare(right.name));
}
async function collectStalePluginRuntimeSymlinkHealthFindings(params = {}) {
	return (await collectStalePluginRuntimeSymlinks(params.packageRoot)).map((item) => ({
		checkId: "core/doctor/stale-plugin-runtime-symlinks",
		severity: "warning",
		message: `Stale plugin-runtime symlink ${item.name} points at ${item.target}.`,
		path: item.path,
		target: item.path,
		requirement: "stale-plugin-runtime-symlink-removed",
		fixHint: "Run `openclaw doctor --fix` to remove stale plugin-runtime symlinks."
	}));
}
/** Emit a doctor note describing stale plugin-runtime symlinks, if any exist. */
async function noteStalePluginRuntimeSymlinks(packageRoot) {
	const stale = await collectStalePluginRuntimeSymlinks(packageRoot);
	if (stale.length === 0) return;
	const lines = [
		"- Plugin-runtime symlinks under the global Node prefix point at pruned",
		`  ${PLUGIN_RUNTIME_DEPS_MARKER} directories from a previous OpenClaw install.`,
		"- Bundled plugin ESM imports can fail with ERR_MODULE_NOT_FOUND until repaired."
	];
	for (const item of stale.slice(0, MAX_REPORTED)) lines.push(`  - ${item.name} -> ${shortenHomePath(item.target)}`);
	if (stale.length > MAX_REPORTED) lines.push(`  - ...and ${stale.length - MAX_REPORTED} more`);
	lines.push("- Repair: run `openclaw doctor --fix` to remove the dangling symlinks.");
	note(lines.join("\n"), "Plugin-runtime symlinks");
}
/** Remove stale plugin-runtime symlinks and report changes/warnings. */
async function removeStalePluginRuntimeSymlinks(packageRoot) {
	const changes = [];
	const warnings = [];
	for (const item of await collectStalePluginRuntimeSymlinks(packageRoot)) try {
		await removePathWithinRoot({
			rootDir: path.dirname(item.path),
			relativePath: path.basename(item.path),
			symlinks: "unlink",
			force: false,
			assertBeforeMutation: item.assertCurrent
		});
		changes.push(`Removed stale plugin-runtime symlink: ${item.path}`);
	} catch (error) {
		let cause = error;
		while (cause instanceof FsSafeError && cause.category === "operational" && cause.cause instanceof Error) cause = cause.cause;
		warnings.push(`Failed to remove stale plugin-runtime symlink ${item.path}: ${String(cause)}`);
	}
	return {
		changes,
		warnings
	};
}
async function inspectCandidate(fullPath) {
	let assertCurrent;
	try {
		const assertParent = capturePathRemovalGuard(path.dirname(fullPath));
		const assertLink = capturePathRemovalGuard(fullPath);
		if (!assertParent || !assertLink) return null;
		assertCurrent = () => {
			assertParent();
			assertLink();
			try {
				fs.statSync(fullPath);
			} catch (error) {
				if (hasErrnoCode(error, "ENOENT") || hasErrnoCode(error, "ENOTDIR")) return;
				throw error;
			}
			throw new FsSafeError("path-mismatch", "plugin-runtime symlink target is no longer missing");
		};
	} catch {
		return null;
	}
	if (!(await fs$1.lstat(fullPath).catch(() => null))?.isSymbolicLink()) return null;
	const target = await fs$1.readlink(fullPath).catch(() => null);
	if (!target || !target.includes(PLUGIN_RUNTIME_DEPS_MARKER)) return null;
	try {
		await fs$1.stat(fullPath);
		return null;
	} catch (error) {
		return hasErrnoCode(error, "ENOENT") || hasErrnoCode(error, "ENOTDIR") ? {
			target,
			assertCurrent
		} : null;
	}
}
//#endregion
export { noteStalePluginRuntimeSymlinks as n, removeStalePluginRuntimeSymlinks as r, collectStalePluginRuntimeSymlinkHealthFindings as t };
