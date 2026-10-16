import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import { a as canonicalPathFromExistingAncestor, b as resolveAbsolutePathForWrite, t as FsSafeError } from "./fs-safe-BUXBSN-4.mjs";
import "./security-runtime-CpTHQYW2.mjs";
import { n as matchesFileIdentity, r as readPathBinding, t as fileIdentity } from "./path-binding-C8xt74EN.mjs";
import { r as rejectCanonicalPathChange } from "./path-errors-TTz_zELr.mjs";
import { n as readFileCreateMetadata } from "./file-create-protocol-C0GacCLU.mjs";
import { a as symlinkRedirectError, i as openBoundWriteRoot, n as captureWriteBinding, o as writeFsSafeError, r as fileWriteError, t as canonicalTargetForSymlinkError } from "./file-write-path-DYuMQ9oh.mjs";
import fs from "node:fs/promises";
import crypto from "node:crypto";
//#region extensions/file-transfer/src/node-host/file-create.ts
async function receiveContent(io, metadata) {
	const frames = io.frames;
	if (!frames) throw new Error("file.create requires binary duplex transport");
	io.signal.throwIfAborted();
	const chunks = [];
	const hash = crypto.createHash("sha256");
	let received = 0;
	let ended = false;
	let unsubscribe;
	let removeAbortListener;
	try {
		return await new Promise((resolve, reject) => {
			const abort = () => {
				const reason = io.signal.reason;
				reject(reason instanceof Error ? reason : /* @__PURE__ */ new Error("file.create cancelled"));
			};
			io.signal.addEventListener("abort", abort, { once: true });
			removeAbortListener = () => io.signal.removeEventListener("abort", abort);
			const fail = (error) => {
				ended = true;
				io.signal.removeEventListener("abort", abort);
				reject(error instanceof Error ? error : new Error(String(error)));
			};
			unsubscribe = frames.onMessage(async (message) => {
				try {
					io.signal.throwIfAborted();
					if (ended) throw new Error("file.create input is out of sequence");
					if (message.byteLength === 0) {
						ended = true;
						if (received !== metadata.sizeBytes || hash.digest("hex") !== metadata.expectedSha256) throw new Error("file.create content size or digest does not match");
						io.signal.removeEventListener("abort", abort);
						resolve(chunks);
						return;
					}
					if (message.byteLength > 1048576 || received + message.byteLength > metadata.sizeBytes) throw new Error("file.create chunk exceeds the admitted byte limit");
					const chunk = Buffer.from(message);
					received += chunk.byteLength;
					hash.update(chunk);
					chunks.push(chunk);
					await frames.send(Buffer.from("ack"));
				} catch (error) {
					fail(error);
				}
			});
		});
	} finally {
		unsubscribe?.();
		removeAbortListener?.();
	}
}
/** Create-only streaming counterpart of file.write; preflight never subscribes to input. */
async function handleFileCreate(params, io) {
	let metadata;
	try {
		metadata = readFileCreateMetadata(params);
	} catch (error) {
		return fileWriteError("INVALID_PARAMS", String(error));
	}
	const rawPath = typeof params.path === "string" ? params.path : "";
	const followSymlinks = params.followSymlinks === true;
	io?.signal.throwIfAborted();
	let target;
	try {
		target = await resolveAbsolutePathForWrite(rawPath, { symlinks: followSymlinks ? "follow" : "reject" });
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "symlink") return symlinkRedirectError("SYMLINK_REDIRECT", await canonicalTargetForSymlinkError(error, rawPath));
		return fileWriteError("INVALID_PATH", String(error));
	}
	if (!target.parentExists && params.createParents !== true) return fileWriteError("PARENT_NOT_FOUND", "parent directory does not exist");
	const canonicalPath = await canonicalPathFromExistingAncestor(target.path);
	const changed = rejectCanonicalPathChange(params.expectedCanonicalPath, canonicalPath);
	if (changed) return changed;
	let existing;
	try {
		existing = await fs.lstat(target.path, { bigint: true });
		if (!existing.isFile()) return fileWriteError("NOT_FILE", "create target is not a regular file");
	} catch (error) {
		if (extractErrorCode(error) !== "ENOENT") throw error;
	}
	if (params.preflightOnly === true) return {
		ok: true,
		path: canonicalPath,
		size: metadata.sizeBytes,
		sha256: metadata.expectedSha256,
		binding: await captureWriteBinding(canonicalPath, existing && fileIdentity(existing))
	};
	const binding = readPathBinding(params.expectedBinding);
	if (binding?.kind !== "write") return fileWriteError("CANONICAL_PATH_CHANGED", "file.create requires its authorized write binding");
	if (binding.targetDevice !== void 0 && (!existing || !matchesFileIdentity(existing, {
		device: binding.targetDevice,
		inode: binding.targetInode
	}))) return fileWriteError("CANONICAL_PATH_CHANGED", "create target changed after authorization");
	const anchor = await openBoundWriteRoot({
		binding,
		canonicalTargetPath: canonicalPath
	});
	if (!anchor.ok) return anchor;
	if (!io?.frames) return fileWriteError("DUPLEX_REQUIRED", "file.create requires binary duplex transport");
	const chunks = await receiveContent(io, metadata);
	io.signal.throwIfAborted();
	const { anchorRoot, relativeTarget } = anchor;
	let status = "created";
	try {
		await anchorRoot.create(relativeTarget, (async function* () {
			yield* chunks;
		})(), {
			mkdir: params.createParents === true,
			mode: 384,
			maxBytes: metadata.sizeBytes,
			signal: io.signal,
			assertBeforeMutation: () => io.signal.throwIfAborted()
		});
	} catch (error) {
		io.signal.throwIfAborted();
		if (!(error instanceof FsSafeError)) throw error;
		if (error.code !== "already-exists") return writeFsSafeError(error, canonicalPath);
		status = "exists";
	}
	const opened = await anchorRoot.open(relativeTarget, { symlinks: "reject" });
	try {
		io.signal.throwIfAborted();
		const stats = await opened.handle.stat({ bigint: true });
		if (!stats.isFile()) return fileWriteError("NOT_FILE", "create target is not a regular file");
		return {
			ok: true,
			path: opened.realPath,
			status,
			...status === "created" ? {
				size: metadata.sizeBytes,
				sha256: metadata.expectedSha256
			} : {},
			binding: {
				kind: "existing",
				...fileIdentity(stats)
			}
		};
	} finally {
		await opened.handle.close();
	}
}
//#endregion
export { handleFileCreate };
