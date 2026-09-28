import { c as readFileDescriptorBoundedSync, o as openRootFileSync } from "./boundary-file-read-D-Aa04On.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { i as sameFileMutationFingerprint } from "./file-descriptor-C_0BsNDD.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/update-capture-privacy-marker.ts
const UPDATE_CAPTURE_PRIVACY_MARKER = ".openclaw-private-update-capture";
//#endregion
//#region src/infra/update-capture-paths.ts
const MARKER_BYTES = Buffer.from("openclaw-private-update-capture-v1\n");
function hasPrivacyMarker(directory) {
	const markerPath = path.join(directory, UPDATE_CAPTURE_PRIVACY_MARKER);
	let before;
	try {
		before = fs.lstatSync(markerPath, { bigint: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT") || hasErrnoCode(error, "ENOTDIR")) return false;
		throw new Error("Private update capture marker is unreadable; export refused.", { cause: error });
	}
	try {
		if (!before.isFile()) throw new Error("Marker must be a regular file");
		const opened = openRootFileSync({
			absolutePath: markerPath,
			rootPath: directory,
			boundaryLabel: "private update capture marker",
			maxBytes: MARKER_BYTES.length
		});
		if (!opened.ok) throw new Error("Marker cannot be safely opened", { cause: opened.error });
		try {
			const bytes = readFileDescriptorBoundedSync(opened.fd, MARKER_BYTES.length);
			const after = fs.fstatSync(opened.fd, { bigint: true });
			const current = fs.lstatSync(markerPath, { bigint: true });
			if (!bytes.equals(MARKER_BYTES) || !current.isFile() || !sameFileMutationFingerprint(before, after) || !sameFileMutationFingerprint(after, current)) throw new Error("Marker is invalid or changed during read");
		} finally {
			fs.closeSync(opened.fd);
		}
		return true;
	} catch (error) {
		throw new Error("Private update capture marker is invalid or unreadable; export refused.", { cause: error });
	}
}
const CAPTURE_SUFFIX = ".update-captures";
function resolveUpdateCaptureRoot(stateDir) {
	return `${path.resolve(stateDir)}${CAPTURE_SUFFIX}`;
}
function resolveCapturePath(sourcePath, entries = /* @__PURE__ */ new Map()) {
	const activeLinks = /* @__PURE__ */ new Set();
	function resolve(candidate, inspected, depth) {
		const root = path.parse(candidate).root;
		let current = {
			path: root,
			directory: true
		};
		inspected.set(root, true);
		const separators = path.sep === "\\" ? /[\\/]/ : /\//;
		for (const component of candidate.slice(root.length).split(separators)) {
			if (!current.directory) return;
			const entry = path.resolve(current.path, component);
			let stat;
			try {
				stat = fs.lstatSync(entry);
			} catch (error) {
				if (hasErrnoCode(error, "ENOENT") || hasErrnoCode(error, "ENOTDIR") || hasErrnoCode(error, "ELOOP")) return;
				throw new Error("Private update capture marker is unreadable; export refused.", { cause: error });
			}
			if (stat.isSymbolicLink()) {
				inspected.set(entry, false);
				if (activeLinks.has(entry) || depth === 40) return;
				activeLinks.add(entry);
				const link = fs.readlinkSync(entry);
				const targetEntries = /* @__PURE__ */ new Map();
				const target = resolve(path.isAbsolute(link) ? link : current.path + path.sep + link, targetEntries, depth + 1);
				activeLinks.delete(entry);
				if (!target) return;
				for (const [targetPath, realDirectory] of targetEntries) inspected.set(targetPath, realDirectory);
				current = target;
			} else {
				current = {
					path: entry,
					directory: stat.isDirectory()
				};
				inspected.set(entry, current.directory);
			}
		}
		return current;
	}
	return resolve(path.isAbsolute(sourcePath) ? sourcePath : process.cwd() + path.sep + sourcePath, entries, 0);
}
function isPairedCapturePath(directory) {
	const name = path.basename(directory);
	return name.length > 16 && name.endsWith(CAPTURE_SUFFIX) && resolveCapturePath(directory.slice(0, -16))?.directory === true;
}
/** One admission decision over real ancestors and safely resolved link targets. */
function isUpdateCapturePath(sourcePath, stateDir) {
	const entries = /* @__PURE__ */ new Map();
	resolveCapturePath(sourcePath, entries);
	const captureRoot = resolveUpdateCaptureRoot(stateDir);
	const resolvedRoot = resolveCapturePath(captureRoot)?.path;
	let captured = false;
	for (const [entryPath, realDirectory] of entries) {
		if (realDirectory) captured = hasPrivacyMarker(entryPath) || captured;
		captured = entryPath === captureRoot || entryPath === resolvedRoot || isPairedCapturePath(entryPath) || captured;
	}
	return captured;
}
function assertNotUpdateCapturePath(sourcePath, stateDir) {
	if (isUpdateCapturePath(sourcePath, stateDir)) throw new Error("Private update captures are excluded from backups and support exports.");
}
//#endregion
export { isUpdateCapturePath as n, resolveUpdateCaptureRoot as r, assertNotUpdateCapturePath as t };
