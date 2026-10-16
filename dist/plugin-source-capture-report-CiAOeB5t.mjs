import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { O as walkDirectory } from "./fs-safe-BUXBSN-4.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as removeTemporaryArtifacts } from "./temp-artifact-cleanup-DyXpITqy.mjs";
import { i as prunePluginNativeCaptureDirectories } from "./plugin-source-capture-directory-suikpgfR.mjs";
import { n as isLegacyPluginSourceCaptureName } from "./plugin-source-capture-path-Dqh0vrxU.mjs";
import { a as readPluginMetadataStateRow } from "./bundled-discovery-state-C2EXzdGy.mjs";
import { n as resolveInstalledPluginIndexStateDatabaseOptions } from "./installed-plugin-index-store-path-vGDuKHrq.mjs";
import { t as parseInstalledPluginIndex } from "./installed-plugin-index-store-Dcdr8x8f.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { tmpdir } from "node:os";
//#region src/plugins/plugin-source-capture-report.ts
async function readLegacyCapture(directory) {
	const identity = await fs.lstat(directory);
	if (!identity.isDirectory()) return;
	try {
		await fs.lstat(path.join(directory, "owner.sqlite"));
		return;
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		return identity;
	}
}
async function inspectLegacyCapture(directory, warn) {
	const identity = await readLegacyCapture(directory);
	if (!identity) return;
	const scan = await walkDirectory(directory, { symlinks: "include" });
	let complete = scan.failedDirs.length === 0;
	for (const failure of scan.failedDirs) warn(failure.path, failure.error);
	let bytes = 0;
	let changedAtMs = Math.max(identity.birthtimeMs, identity.ctimeMs);
	for (const entry of scan.entries) try {
		const stat = await fs.lstat(entry.path);
		changedAtMs = Math.max(changedAtMs, stat.birthtimeMs, stat.ctimeMs);
		if (stat.isFile()) bytes += stat.size;
	} catch (error) {
		complete = false;
		warn(entry.path, error);
	}
	return {
		path: directory,
		bytes,
		identity,
		changedAtMs,
		complete
	};
}
/** Legacy captures span old service environments as well as the selected state. */
async function inspectLegacyPluginSourceCaptureRoots(stateDir, temporaryDirectories = []) {
	const directories = /* @__PURE__ */ new Set();
	const roots = [];
	const warnings = [];
	const warn = (file, error) => {
		if (!hasErrnoCode(error, "ENOENT")) warnings.push(`Could not inspect ${file}: ${String(error)}`);
	};
	for (const candidate of [
		path.join(stateDir, "tmp"),
		tmpdir(),
		...process.platform === "win32" ? [] : ["/tmp"],
		...temporaryDirectories
	]) try {
		const directory = await fs.realpath(candidate);
		if (directories.has(directory)) continue;
		directories.add(directory);
		const candidates = await walkDirectory(directory, {
			maxDepth: 1,
			symlinks: "skip",
			include: (entry) => entry.kind === "directory" && isLegacyPluginSourceCaptureName(entry.name)
		});
		for (const failure of candidates.failedDirs) warn(failure.path, failure.error);
		for (const entry of candidates.entries) try {
			const capture = await inspectLegacyCapture(entry.path, warn);
			if (capture) roots.push(capture);
		} catch (error) {
			warn(entry.path, error);
		}
	} catch (error) {
		warn(candidate, error);
	}
	roots.sort((left, right) => left.path.localeCompare(right.path));
	return {
		roots,
		totalBytes: roots.reduce((bytes, root) => bytes + root.bytes, 0),
		warnings
	};
}
/** The Doctor owner must retain maintenance and recheck the host census before each removal. */
async function pruneLegacyPluginSourceCaptures(report, assertCurrent) {
	const removed = [];
	const skipped = [];
	const warnings = [];
	let blockedReason;
	const mayProceed = () => {
		try {
			assertCurrent();
			return true;
		} catch (error) {
			blockedReason = String(error);
			return false;
		}
	};
	if (mayProceed()) for (const root of report.roots) try {
		const current = await inspectLegacyCapture(root.path, (file, error) => {
			warnings.push(`Could not inspect ${file}: ${String(error)}`);
		});
		if (!current || current.identity.dev !== root.identity.dev || current.identity.ino !== root.identity.ino) {
			skipped.push({
				path: root.path,
				reason: "capture identity or custody changed"
			});
			continue;
		}
		if (!current.complete) {
			skipped.push({
				path: root.path,
				reason: "capture inspection is incomplete"
			});
			continue;
		}
		if (process.getuid && current.identity.uid !== process.getuid()) {
			skipped.push({
				path: root.path,
				reason: "owned by another UID"
			});
			continue;
		}
		if (current.changedAtMs >= performance.timeOrigin) {
			skipped.push({
				path: root.path,
				reason: "created or changed during the current process"
			});
			continue;
		}
		if (!mayProceed()) break;
		await removeTemporaryArtifacts(root.path, "Legacy plugin capture");
		if (await fs.lstat(root.path).catch((error) => {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
		})) warnings.push(`Could not remove ${root.path}; see the capture cleanup warning.`);
		else removed.push(current);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) warnings.push(`Could not reclaim ${root.path}: ${String(error)}`);
	}
	return {
		removed,
		skipped,
		warnings,
		blockedReason
	};
}
/** Durable native payload is reclaimed only against current receipts under maintenance. */
async function pruneUnreferencedPluginNativeCaptures(stateDir, assertCurrent, env, options = {}) {
	try {
		assertCurrent();
		const row = await readPluginMetadataStateRow("installed-index", resolveInstalledPluginIndexStateDatabaseOptions({
			stateDir,
			env
		}));
		assertCurrent();
		const retainedPaths = /* @__PURE__ */ new Set();
		if (row) {
			const payload = JSON.parse(row.value_json);
			const rawIndex = isRecord(payload) ? payload.index : void 0;
			const index = parseInstalledPluginIndex(rawIndex);
			if (!index || !isRecord(rawIndex) || !Array.isArray(rawIndex.plugins)) throw new Error("Installed plugin index is invalid; native captures were preserved.");
			for (const [position, plugin] of index.plugins.entries()) {
				const rawPlugin = rawIndex.plugins[position];
				if (isRecord(rawPlugin) && rawPlugin.sourceAdmissions !== void 0 && !plugin.sourceAdmissions) throw new Error("Plugin native admission receipts are invalid; captures were preserved.");
				for (const receipt of Object.values(plugin.sourceAdmissions ?? {})) {
					for (const namespace of Object.values(receipt.nativeNamespaces)) retainedPaths.add(path.join(path.resolve(namespace.capturedRoot), "content"));
					for (const artifact of Object.values(receipt.nativeArtifacts)) retainedPaths.add(path.resolve(artifact.capturedPath));
				}
			}
		}
		return await prunePluginNativeCaptureDirectories(stateDir, retainedPaths, assertCurrent, options);
	} catch (error) {
		return {
			removed: [],
			warnings: [`Native capture cleanup skipped: ${String(error)}`]
		};
	}
}
//#endregion
export { pruneLegacyPluginSourceCaptures as n, pruneUnreferencedPluginNativeCaptures as r, inspectLegacyPluginSourceCaptureRoots as t };
