import fs from "node:fs";
import path from "node:path";
import { copyFileHandle, openRootFileSync, overwriteFileHandle as overwriteFileHandle$1, writeFileWindowFully } from "@openclaw/fs-safe/advanced";
import { sha256FileSync } from "@openclaw/fs-safe/durability";
//#region src/infra/file-descriptor.ts
/** Strict field equality; callers own any platform-specific identity tolerance. */
function sameFileMutationFingerprint(left, right) {
	return left.birthtimeNs === right.birthtimeNs && left.ctimeNs === right.ctimeNs && left.dev === right.dev && left.ino === right.ino && left.mtimeNs === right.mtimeNs && left.size === right.size;
}
/** Link churn changes ctime on Windows and POSIX; admitting it still requires matching bytes. */
function sameFileMutationMetadata(left, right) {
	const derivedBirthtime = process.platform === "linux" && left.birthtimeNs === left.ctimeNs && right.birthtimeNs === right.ctimeNs;
	return sameFileMutationFingerprint(left, {
		...right,
		ctimeNs: left.ctimeNs,
		birthtimeNs: derivedBirthtime ? left.birthtimeNs : right.birthtimeNs
	}) && left.mode === right.mode && left.uid === right.uid && left.gid === right.gid;
}
/** Hash a pinned regular file without accepting replacement or non-link metadata changes. */
function hashFileMutationSnapshotSync(filePath, expected) {
	const changed = () => /* @__PURE__ */ new Error(`File changed while hashing snapshot: ${filePath}`);
	const opened = openRootFileSync({
		absolutePath: filePath,
		rootPath: path.dirname(filePath),
		boundaryLabel: "file snapshot",
		maxBytes: Number(expected.size),
		rejectHardlinks: false
	});
	if (!opened.ok) throw new Error(`Cannot open file snapshot: ${filePath}`, { cause: opened.error });
	const assertStat = (current) => {
		if (!current.isFile() || !sameFileMutationMetadata(expected, current)) throw changed();
		return current;
	};
	try {
		let digest;
		for (let attempt = 0; attempt < 3; attempt += 1) {
			const before = assertStat(fs.fstatSync(opened.fd, { bigint: true }));
			const content = hashFileDescriptorSync(opened.fd, Number(expected.size));
			const after = assertStat(fs.fstatSync(opened.fd, { bigint: true }));
			const current = assertStat(fs.lstatSync(filePath, { bigint: true }));
			if (content.sizeBytes !== Number(expected.size) || digest !== void 0 && content.sha256 !== digest) throw changed();
			digest = content.sha256;
			if (sameFileMutationFingerprint(before, after) && sameFileMutationFingerprint(after, current)) return digest;
		}
		throw changed();
	} finally {
		fs.closeSync(opened.fd);
	}
}
/** Maps the borrowed-descriptor digest to OpenClaw's persisted artifact fields. */
function hashFileDescriptorSync(fd, maxBytes) {
	const { digest, bytes } = sha256FileSync(fd, { maxBytes });
	return {
		sha256: digest,
		sizeBytes: bytes
	};
}
//#endregion
export { sameFileMutationFingerprint as a, overwriteFileHandle$1 as i, hashFileDescriptorSync as n, sameFileMutationMetadata as o, hashFileMutationSnapshotSync as r, writeFileWindowFully as s, copyFileHandle as t };
