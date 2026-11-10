import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/infra/update-recovery-capture-seal.ts
/** Link/unlink publication can leave both names. Neither name is a seal until the partial is gone. */
async function hasPendingUpdateRecoverySeal(directory) {
	try {
		await fs.lstat(path.join(directory, "manifest.json.partial"));
		return true;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return false;
		throw error;
	}
}
async function assertUpdateRecoverySealComplete(directory) {
	if (await hasPendingUpdateRecoverySeal(directory)) throw new Error(`Update capture at ${directory} has incomplete publication; retain all evidence for manual inspection.`);
}
//#endregion
//#region src/infra/update-recovery-path.ts
function canonicalEntryPath(value) {
	const absolute = path.resolve(value);
	return path.join(resolvePathViaExistingAncestorSync(path.dirname(absolute)), path.basename(absolute));
}
/** Resolve only the symlinks recorded in a sealed capture, without consulting live state. */
function resolveCapturedRegistryPath(value, links, directories) {
	const root = path.parse(value).root;
	if (!root) throw new Error("Captured registry paths must be absolute");
	const split = (text) => (path.sep === "\\" ? text.replaceAll("/", "\\") : text).split(path.sep);
	let current = root;
	const parts = split(value.slice(root.length)).toReversed();
	let followed = 0;
	while (parts.length > 0) {
		const part = parts.pop();
		if (!part || part === "." || part === "..") {
			if ((part === ".." || parts.length === 0) && current !== path.parse(current).root && !directories.has(current)) throw new Error("Captured registry traversal requires a recorded directory");
			if (part === "..") current = path.dirname(current);
			continue;
		}
		current = path.join(current, part);
		const target = links.get(current);
		if (target === void 0) continue;
		if (++followed > 40) throw new Error("Captured registry symlink chain is cyclic or too deep");
		const targetRoot = path.parse(target).root;
		current = targetRoot || path.dirname(current);
		parts.push(...split(target.slice(targetRoot.length)).toReversed());
	}
	return current;
}
//#endregion
export { hasPendingUpdateRecoverySeal as i, resolveCapturedRegistryPath as n, assertUpdateRecoverySealComplete as r, canonicalEntryPath as t };
