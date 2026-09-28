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
//#endregion
export { readMemoryShadowIdentity as n, assertMemoryShadowIdentity as t };
