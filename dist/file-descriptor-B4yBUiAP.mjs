import { copyFileHandle, overwriteFileHandle as overwriteFileHandle$1, writeFileWindowFully } from "@openclaw/fs-safe/advanced";
import { sha256FileSync } from "@openclaw/fs-safe/durability";
//#region src/infra/file-descriptor.ts
/** Strict field equality; callers own any platform-specific identity tolerance. */
function sameFileMutationFingerprint(left, right) {
	return left.birthtimeNs === right.birthtimeNs && left.ctimeNs === right.ctimeNs && left.dev === right.dev && left.ino === right.ino && left.mtimeNs === right.mtimeNs && left.size === right.size;
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
export { writeFileWindowFully as a, sameFileMutationFingerprint as i, hashFileDescriptorSync as n, overwriteFileHandle$1 as r, copyFileHandle as t };
