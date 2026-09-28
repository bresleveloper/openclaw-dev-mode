import { w as root } from "./fs-safe-BAPek8At.mjs";
import { t as pathScope } from "./security-runtime-HdPo6iAV.mjs";
import "./sdk-security-runtime-Ek_7wYnj.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/browser/src/browser/output-directories.ts
/**
* Browser output directory helper.
*
* Creates absolute output directories while handling macOS system symlink
* aliases such as /tmp and /var safely.
*/
async function resolveSystemDirectoryAlias(dirPath) {
	for (const aliasRoot of ["/tmp", "/var"]) {
		if (dirPath !== aliasRoot && !dirPath.startsWith(`${aliasRoot}${path.sep}`)) continue;
		try {
			if (!(await fs.lstat(aliasRoot)).isSymbolicLink()) return dirPath;
			return path.join(await fs.realpath(aliasRoot), path.relative(aliasRoot, dirPath));
		} catch {
			return dirPath;
		}
	}
	return dirPath;
}
/** Ensure an absolute browser output directory exists and is safe to use. */
async function ensureOutputDirectory(dirPath) {
	const target = await resolveSystemDirectoryAlias(path.resolve(dirPath));
	const filesystemRoot = path.parse(target).root;
	if (target === filesystemRoot) {
		await root(filesystemRoot);
		return;
	}
	const result = await pathScope(filesystemRoot, { label: "output directory" }).ensureDir(`${target}${path.sep}`);
	if (!result.ok) throw new Error(result.error);
}
//#endregion
export { ensureOutputDirectory as t };
