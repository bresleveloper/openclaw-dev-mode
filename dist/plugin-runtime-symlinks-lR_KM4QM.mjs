import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CBoxhfke.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { n as readInstallOwner } from "./install-owner-ImshV9Dw.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import path from "node:path";
import fs from "node:fs/promises";
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
		const target = await inspectCandidate(entry.path);
		if (target) stale.push({
			name: entry.relativePath.split(path.sep).join("/"),
			path: entry.path,
			target
		});
	}
	return stale.toSorted((left, right) => left.name.localeCompare(right.name));
}
function stalePluginRuntimeSymlinkToHealthFinding(item) {
	return {
		checkId: "core/doctor/stale-plugin-runtime-symlinks",
		severity: "warning",
		message: `Stale plugin-runtime symlink ${item.name} points at ${item.target}.`,
		path: item.path,
		target: item.path,
		requirement: "stale-plugin-runtime-symlink-removed",
		fixHint: "Run `openclaw doctor --fix` to remove stale plugin-runtime symlinks."
	};
}
async function collectStalePluginRuntimeSymlinkHealthFindings(params = {}) {
	return (await collectStalePluginRuntimeSymlinks(params.packageRoot)).map(stalePluginRuntimeSymlinkToHealthFinding);
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
		await fs.unlink(item.path);
		changes.push(`Removed stale plugin-runtime symlink: ${item.path}`);
	} catch (error) {
		warnings.push(`Failed to remove stale plugin-runtime symlink ${item.path}: ${String(error)}`);
	}
	return {
		changes,
		warnings
	};
}
async function inspectCandidate(fullPath) {
	if (!(await fs.lstat(fullPath).catch(() => null))?.isSymbolicLink()) return null;
	const target = await fs.readlink(fullPath).catch(() => null);
	if (!target || !target.includes(PLUGIN_RUNTIME_DEPS_MARKER)) return null;
	try {
		await fs.stat(fullPath);
		return null;
	} catch (error) {
		const code = error?.code;
		return code === "ENOENT" || code === "ENOTDIR" ? target : null;
	}
}
//#endregion
export { noteStalePluginRuntimeSymlinks as n, removeStalePluginRuntimeSymlinks as r, collectStalePluginRuntimeSymlinkHealthFindings as t };
