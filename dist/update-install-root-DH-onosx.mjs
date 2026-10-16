import fs from "node:fs";
import path from "node:path";
//#region src/infra/update-install-root.ts
/** Resolve the canonical identity of an update checkout/install root. */
function resolveUpdateInstallRoot(root) {
	const absolute = path.resolve(root);
	try {
		return fs.realpathSync.native(absolute);
	} catch {
		try {
			if (fs.lstatSync(absolute, { throwIfNoEntry: false })) return absolute;
		} catch {
			return absolute;
		}
		try {
			return path.join(fs.realpathSync.native(path.dirname(absolute)), path.basename(absolute));
		} catch {
			return absolute;
		}
	}
}
function updateInstallRootsMatch(left, right) {
	return resolveUpdateInstallRoot(left) === resolveUpdateInstallRoot(right);
}
//#endregion
export { updateInstallRootsMatch as n, resolveUpdateInstallRoot as t };
