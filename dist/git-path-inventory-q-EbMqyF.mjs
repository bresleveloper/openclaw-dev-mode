import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import "./errors-DnjwnOju.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/agents/worktrees/git-path-inventory.ts
function splitNullBuffer(input) {
	const bytes = Buffer.from(input.buffer, input.byteOffset, input.byteLength);
	const fields = [];
	let start = 0;
	for (let index = 0; index < bytes.length; index++) {
		if (bytes[index] !== 0) continue;
		if (index > start) fields.push(bytes.subarray(start, index));
		start = index + 1;
	}
	if (start < bytes.length) fields.push(bytes.subarray(start));
	return fields;
}
/** Emits only nonempty batches using the existing soft count/byte thresholds. */
function* gitPathspecBatches(paths) {
	let offset = 0;
	while (offset < paths.length) {
		const batch = [];
		let bytes = 0;
		while (offset < paths.length && (batch.length === 0 || batch.length < 128 && bytes < 16384)) {
			const entry = paths[offset++];
			batch.push(entry);
			bytes += Buffer.byteLength(entry) + 1;
		}
		yield batch;
	}
}
function gitPathKey(gitPath) {
	return Buffer.from(gitPath.buffer, gitPath.byteOffset, gitPath.byteLength).toString("hex");
}
function checkoutPathFromGitBytes(checkoutRoot, gitPath) {
	if (process.platform === "win32") return path.join(checkoutRoot, ...gitPath.toString("utf8").split("/"));
	return Buffer.concat([
		Buffer.from(checkoutRoot),
		Buffer.from(path.sep),
		gitPath
	]);
}
async function rawPathExists(target) {
	try {
		await fs.lstat(target);
		return true;
	} catch (error) {
		if (isMissingPathError(error)) return false;
		throw error;
	}
}
function parseGitTreePaths(output) {
	return splitNullBuffer(output).map((entry) => {
		const separator = entry.indexOf(9);
		if (separator < 0) throw new Error("Git tree inventory contains an invalid entry");
		return {
			path: entry.subarray(separator + 1),
			mode: entry.subarray(0, 6).toString("ascii")
		};
	});
}
function parseGitIndexPaths(output) {
	return splitNullBuffer(output).map((entry) => {
		const separator = entry.indexOf(9);
		if (separator < 0 || entry[1] !== 32) throw new Error("Git index inventory contains an invalid entry");
		const tag = String.fromCharCode(entry[0] ?? 0);
		return {
			path: entry.subarray(separator + 1),
			mode: entry.subarray(2, 8).toString("ascii"),
			skipWorktree: tag.toUpperCase() === "S",
			assumeUnchanged: tag !== tag.toUpperCase()
		};
	});
}
/** Read-only batches retain the first observed decision/error in original path order. */
async function containsGitMarker(checkoutRoot, paths) {
	const checked = /* @__PURE__ */ new Set();
	const markers = [];
	for (const gitPath of paths) for (let end = gitPath.indexOf(47); end !== -1; end = gitPath.indexOf(47, end + 1)) {
		const directory = gitPath.subarray(0, end);
		const key = gitPathKey(directory);
		if (!checked.has(key)) {
			checked.add(key);
			markers.push(Buffer.concat([directory, Buffer.from("/.git")]));
		}
	}
	for (let offset = 0; offset < markers.length; offset += 32) {
		const results = await Promise.allSettled(markers.slice(offset, offset + 32).map((marker) => rawPathExists(checkoutPathFromGitBytes(checkoutRoot, marker))));
		for (const result of results) {
			if (result.status === "rejected") throw result.reason;
			if (result.value) return true;
		}
	}
	return false;
}
//#endregion
export { parseGitIndexPaths as a, splitNullBuffer as c, gitPathspecBatches as i, containsGitMarker as n, parseGitTreePaths as o, gitPathKey as r, rawPathExists as s, checkoutPathFromGitBytes as t };
