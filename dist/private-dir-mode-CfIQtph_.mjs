import fs, { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/infra/private-dir-mode.ts
const OPEN_DIR_FLAGS = constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_DIRECTORY;
/** Tighten every existing directory from `rootDir` down to `targetDir`. */
async function tightenPrivateDirChain(rootDir, targetDir, mode) {
	if (process.platform === "win32") return;
	const root = path.resolve(rootDir);
	const parent = path.resolve(targetDir);
	const relative = path.relative(root, parent);
	if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return;
	const chain = [root];
	if (relative) {
		let current = root;
		for (const segment of relative.split(path.sep)) {
			current = path.join(current, segment);
			chain.push(current);
		}
	}
	for (const dir of chain) {
		let handle;
		try {
			handle = await fs$1.open(dir, OPEN_DIR_FLAGS);
		} catch {
			return;
		}
		try {
			if (((await handle.stat()).mode & 511) !== mode) await handle.chmod(mode);
		} finally {
			await handle.close().catch(() => void 0);
		}
	}
}
/** Tighten a single existing directory root. */
function tightenPrivateDirRootSync(rootDir, mode) {
	if (process.platform === "win32") return;
	let fd;
	try {
		fd = fs.openSync(rootDir, OPEN_DIR_FLAGS);
		if ((fs.fstatSync(fd).mode & 511) !== mode) fs.fchmodSync(fd, mode);
	} catch {} finally {
		if (fd !== void 0) try {
			fs.closeSync(fd);
		} catch {}
	}
}
//#endregion
export { tightenPrivateDirRootSync as n, tightenPrivateDirChain as t };
