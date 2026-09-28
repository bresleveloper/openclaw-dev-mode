import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
//#region extensions/file-transfer/src/shared/path-binding.ts
function fileIdentity(stats) {
	return {
		device: String(stats.dev),
		inode: String(stats.ino)
	};
}
function matchesFileIdentity(stats, expected) {
	return String(stats.dev) === expected.device && String(stats.ino) === expected.inode;
}
function readPathBinding(input) {
	const record = asNullableRecord(input);
	if (!record) return;
	if (record.kind === "existing" && typeof record.device === "string" && typeof record.inode === "string") return {
		kind: "existing",
		device: record.device,
		inode: record.inode
	};
	if (record.kind !== "write" || typeof record.anchorPath !== "string" || typeof record.anchorDevice !== "string" || typeof record.anchorInode !== "string") return;
	const targetDevice = record.targetDevice;
	const targetInode = record.targetInode;
	if (typeof targetDevice === "string" !== (typeof targetInode === "string")) return;
	return {
		kind: "write",
		anchorPath: record.anchorPath,
		anchorDevice: record.anchorDevice,
		anchorInode: record.anchorInode,
		...typeof targetDevice === "string" && typeof targetInode === "string" ? {
			targetDevice,
			targetInode
		} : {}
	};
}
//#endregion
export { matchesFileIdentity as n, readPathBinding as r, fileIdentity as t };
