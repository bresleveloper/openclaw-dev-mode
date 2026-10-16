import fs from "node:fs/promises";
//#region src/infra/sqlite-file-header.ts
/** Classify snapshot inputs without opening SQLite or touching WAL companions. */
async function isSqliteSnapshotFile(pathname) {
	if (pathname.endsWith(".sqlite")) return true;
	const handle = await fs.open(pathname, "r");
	try {
		const header = Buffer.alloc(16);
		return (await handle.read(header, 0, 16, 0)).bytesRead === 16 && header.toString() === "SQLite format 3\0";
	} finally {
		await handle.close();
	}
}
//#endregion
export { isSqliteSnapshotFile as t };
