import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/infra/host-directory-listing.ts
/** Lists one absolute host directory, defaulting to that host's home directory. */
async function listHostDirectories(requestedPath) {
	const home = os.homedir();
	const requested = requestedPath || home;
	if (!path.isAbsolute(requested)) throw new Error("fs.listDir path must be absolute");
	const resolved = path.resolve(requested);
	const dirents = await fs.readdir(resolved, { withFileTypes: true });
	const entries = [];
	for (const dirent of dirents) {
		const entryPath = path.join(resolved, dirent.name);
		let isDirectory = dirent.isDirectory();
		if (dirent.isSymbolicLink()) isDirectory = await fs.stat(entryPath).then((stat) => stat.isDirectory(), () => false);
		if (!isDirectory) continue;
		const hidden = dirent.name.startsWith(".");
		entries.push({
			name: dirent.name,
			path: entryPath,
			...hidden ? { hidden: true } : {}
		});
	}
	entries.sort((a, b) => {
		if (Boolean(a.hidden) !== Boolean(b.hidden)) return a.hidden ? 1 : -1;
		return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
	});
	const parent = path.dirname(resolved);
	return {
		path: resolved,
		...parent !== resolved ? { parent } : {},
		home,
		entries
	};
}
//#endregion
export { listHostDirectories as t };
