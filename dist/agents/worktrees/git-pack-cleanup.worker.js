import fs from "node:fs";
import { tryAcquireWriteLease } from "@openclaw/fs-safe/file-lock";
//#region src/agents/worktrees/git-pack-cleanup.worker.ts
process.on("SIGIO", () => {});
const { files, olderThan } = JSON.parse(fs.readFileSync(0, "utf8"));
let removed = 0;
let retained = 0;
for (const file of files) {
	if (removed >= 256) break;
	let fd;
	try {
		fd = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
		const original = fs.fstatSync(fd);
		if (!original.isFile() || original.mtimeMs >= olderThan) continue;
		const lease = tryAcquireWriteLease(fd);
		if (!lease) {
			retained++;
			continue;
		}
		try {
			const current = fs.lstatSync(file);
			if (current.dev !== original.dev || current.ino !== original.ino || current.size !== original.size || current.mtimeMs !== original.mtimeMs || current.ctimeMs !== original.ctimeMs || !lease.isHeld()) {
				retained++;
				continue;
			}
			fs.unlinkSync(file);
			removed++;
		} finally {
			lease.release();
		}
	} catch {
		retained++;
	} finally {
		if (fd !== void 0) fs.closeSync(fd);
	}
}
process.stdout.write(JSON.stringify({
	removed,
	retained
}));
//#endregion
export {};
