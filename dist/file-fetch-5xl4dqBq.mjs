import { s as readFileHandleBounded } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { n as detectMime } from "./mime-1zBUMwu6.mjs";
import "./file-access-runtime-CWjkXCju.mjs";
import "./media-mime-D8SxWw0k.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { a as createDeferred } from "./extension-shared-N0S3ppSB.mjs";
import { n as matchesFileIdentity, r as readPathBinding, t as fileIdentity } from "./path-binding-C1J9N7T4.mjs";
import { a as resolveCanonicalReadPath, n as readAbsolutePath, r as rejectCanonicalPathChange, t as classifyFsSafeReadError } from "./path-errors-nBD272aa.mjs";
import { i as readFileFetchBinaryMaxBytes, n as FILE_FETCH_DEFAULT_MAX_BYTES, r as FILE_FETCH_HARD_MAX_BYTES, t as FILE_FETCH_CHUNK_BYTES } from "./file-fetch-protocol-DfFx1zZa.mjs";
import path from "node:path";
import crypto from "node:crypto";
//#region extensions/file-transfer/src/node-host/file-fetch-stream.ts
/** Stream the already authorized handle; START and ACK bound receiver-side buffering. */
async function streamFetchedFile(handle, maxBytes, io) {
	const frames = io.frames;
	if (!frames) throw new Error("binary file.fetch requires framed duplex IO");
	io.signal.throwIfAborted();
	let expected = "start";
	let receipt = createDeferred();
	receipt.promise.catch(() => {});
	const onAbort = () => receipt.reject(io.signal.reason);
	io.signal.addEventListener("abort", onAbort, { once: true });
	let unsubscribe;
	try {
		unsubscribe = frames.onMessage((message) => {
			if (!expected || Buffer.from(message).toString("utf8") !== expected) {
				const error = /* @__PURE__ */ new Error("Unexpected file.fetch stream control");
				receipt.reject(error);
				throw error;
			}
			expected = void 0;
			receipt.resolve();
		});
		io.signal.throwIfAborted();
		await receipt.promise;
		const chunk = Buffer.allocUnsafe(FILE_FETCH_CHUNK_BYTES);
		const hash = crypto.createHash("sha256");
		let size = 0;
		while (true) {
			io.signal.throwIfAborted();
			const { bytesRead } = await handle.read(chunk, 0, Math.min(chunk.length, maxBytes - size + 1));
			io.signal.throwIfAborted();
			if (!bytesRead) return {
				size,
				sha256: hash.digest("hex")
			};
			size += bytesRead;
			if (size > maxBytes) throw Object.assign(/* @__PURE__ */ new Error("file grew beyond the authorized byte limit"), { code: "FILE_TOO_LARGE" });
			const bytes = chunk.subarray(0, bytesRead);
			hash.update(bytes);
			receipt = createDeferred();
			receipt.promise.catch(() => {});
			expected = "ack";
			await frames.send(bytes);
			await receipt.promise;
		}
	} finally {
		unsubscribe?.();
		io.signal.removeEventListener("abort", onAbort);
	}
}
//#endregion
//#region extensions/file-transfer/src/node-host/file-fetch.ts
const TEXT_SNIFF_MAX_BYTES = 8192;
function clampMaxBytes(input) {
	if (typeof input !== "number" || !Number.isFinite(input) || input <= 0) return FILE_FETCH_DEFAULT_MAX_BYTES;
	return Math.min(Math.floor(input), FILE_FETCH_HARD_MAX_BYTES);
}
function classifyFsError(err) {
	if (err instanceof FsSafeError && err.code === "too-large") return "FILE_TOO_LARGE";
	const safeCode = classifyFsSafeReadError(err);
	if (safeCode) return safeCode;
	const code = err?.code;
	if (code === "FILE_TOO_LARGE") return code;
	if (code === "not-file") return "IS_DIRECTORY";
	if (code === "ENOENT") return "NOT_FOUND";
	if (code === "EACCES" || code === "EPERM") return "PERMISSION_DENIED";
	if (code === "EISDIR") return "IS_DIRECTORY";
	return "READ_ERROR";
}
function isLikelyPlainText(buffer) {
	if (buffer.byteLength === 0) return true;
	const sample = buffer.subarray(0, TEXT_SNIFF_MAX_BYTES);
	if (sample.includes(0)) return false;
	try {
		new TextDecoder("utf-8", { fatal: true }).decode(sample);
	} catch {
		return false;
	}
	let controlBytes = 0;
	for (const byte of sample) if (byte < 32 && byte !== 9 && byte !== 10 && byte !== 13) controlBytes += 1;
	return controlBytes / sample.byteLength < .01;
}
async function detectFetchedFileMime(params) {
	const detected = await detectMime(params);
	if (detected) return detected;
	return isLikelyPlainText(params.buffer) ? "text/plain" : "application/octet-stream";
}
async function handleFileFetch(params, io) {
	const requestedPath = readAbsolutePath(params.path);
	if (typeof requestedPath !== "string") return requestedPath;
	let binaryMax;
	try {
		binaryMax = readFileFetchBinaryMaxBytes(params);
	} catch (error) {
		return {
			ok: false,
			code: "INVALID_PARAMS",
			message: String(error)
		};
	}
	const maxBytes = binaryMax ?? clampMaxBytes(params.maxBytes);
	const followSymlinks = params.followSymlinks === true;
	const preflightOnly = params.preflightOnly === true;
	const requestedRoot = params.rootPath === void 0 ? void 0 : readAbsolutePath(params.rootPath);
	if (requestedRoot !== void 0 && typeof requestedRoot !== "string") return requestedRoot;
	const canonical = await resolveCanonicalReadPath({
		requestedPath: requestedRoot ?? requestedPath,
		followSymlinks: requestedRoot === void 0 && followSymlinks,
		classifyError: classifyFsError,
		notFoundMessage: "file not found"
	});
	if (typeof canonical !== "string") return canonical;
	let opened;
	try {
		if (requestedRoot !== void 0) opened = await (await root(canonical)).open(path.relative(canonical, requestedPath), { symlinks: followSymlinks ? "follow-parents-within-root" : "reject" });
		else opened = await (await root(path.dirname(canonical))).open(path.basename(canonical));
	} catch (err) {
		const code = classifyFsError(err);
		return {
			ok: false,
			code,
			message: code === "IS_DIRECTORY" ? "path is a directory" : `open failed: ${String(err)}`,
			canonicalPath: canonical
		};
	}
	try {
		const canonicalPathChange = rejectCanonicalPathChange(params.expectedCanonicalPath, opened.realPath);
		if (canonicalPathChange) return canonicalPathChange;
		const stats = opened.stat;
		const identityStats = await opened.handle.stat({ bigint: true });
		const identity = fileIdentity(identityStats);
		const expectedBinding = readPathBinding(params.expectedBinding);
		if (params.expectedBinding !== void 0 && expectedBinding?.kind !== "existing" || expectedBinding?.kind === "existing" && !matchesFileIdentity(identityStats, expectedBinding)) return {
			ok: false,
			code: "CANONICAL_PATH_CHANGED",
			message: "filesystem identity differs from the authorized target",
			canonicalPath: opened.realPath
		};
		if (stats.size > maxBytes) return {
			ok: false,
			code: "FILE_TOO_LARGE",
			message: `file size ${stats.size} exceeds limit ${maxBytes}`,
			canonicalPath: opened.realPath
		};
		if (preflightOnly) return {
			ok: true,
			path: opened.realPath,
			size: stats.size,
			mimeType: "",
			base64: "",
			sha256: "",
			preflightOnly: true,
			binding: {
				kind: "existing",
				...identity
			}
		};
		if (binaryMax !== void 0) {
			if (!io?.frames || expectedBinding?.kind !== "existing") return {
				ok: false,
				code: "INVALID_PARAMS",
				message: "binary file.fetch requires duplex IO and an authorized filesystem binding"
			};
			const receipt = await streamFetchedFile(opened.handle, maxBytes, io);
			return {
				ok: true,
				path: opened.realPath,
				...receipt,
				transport: "binary",
				mimeType: "",
				base64: "",
				binding: {
					kind: "existing",
					...identity
				}
			};
		}
		const buffer = await readFileHandleBounded(opened.handle, maxBytes);
		const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
		const base64 = buffer.toString("base64");
		const mimeType = await detectFetchedFileMime({
			buffer,
			filePath: opened.realPath
		});
		return {
			ok: true,
			path: opened.realPath,
			size: buffer.byteLength,
			mimeType,
			base64,
			sha256,
			binding: {
				kind: "existing",
				...identity
			}
		};
	} catch (err) {
		return {
			ok: false,
			code: classifyFsError(err),
			message: `read failed: ${String(err)}`,
			canonicalPath: opened.realPath
		};
	} finally {
		await opened.handle.close().catch(() => void 0);
	}
}
//#endregion
export { handleFileFetch };
