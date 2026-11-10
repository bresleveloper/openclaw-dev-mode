import fs from "node:fs";
//#region extensions/memory-core/src/memory/manager-shadow-task.ts
function readMemoryShadowIdentity(filename) {
	const info = fs.statSync(filename, { bigint: true });
	if (!info.isFile()) throw new Error("Memory reindex shadow is not a regular file");
	return {
		device: String(info.dev),
		inode: String(info.ino)
	};
}
function assertMemoryShadowIdentity(filename, expected) {
	const actual = readMemoryShadowIdentity(filename);
	if (actual.device !== expected.device || actual.inode !== expected.inode) throw new Error("Memory reindex shadow file changed during its owned lifetime");
}
function readMemoryConnectionPragmas(db, errorMessage) {
	const read = (name) => {
		const row = db.prepare(`PRAGMA ${name}`).get();
		const value = row?.[name] ?? row?.timeout;
		if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new Error(errorMessage);
		return value;
	};
	return {
		busy_timeout: read("busy_timeout"),
		synchronous: read("synchronous"),
		foreign_keys: read("foreign_keys"),
		journal_size_limit: read("journal_size_limit"),
		checkpoint_fullfsync: read("checkpoint_fullfsync")
	};
}
//#endregion
export { readMemoryConnectionPragmas as n, readMemoryShadowIdentity as r, assertMemoryShadowIdentity as t };
