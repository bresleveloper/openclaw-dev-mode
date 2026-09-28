import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { a as createDeferred } from "./extension-shared-N0S3ppSB.mjs";
import { t as FILE_FETCH_CHUNK_BYTES } from "./file-fetch-protocol-DfFx1zZa.mjs";
import { t as inspectStrictBase64 } from "./base64-DHgbKH6a.mjs";
import { t as throwFromNodePayload } from "./errors-BMjwWT6s.mjs";
import path from "node:path";
import crypto from "node:crypto";
//#region extensions/file-transfer/src/workspace-file-create.ts
/** Send bounded messages over the existing paired-node stream, never inline JSON bytes. */
async function createWorkspaceFile(options) {
	options.assertCurrent();
	const sha256 = crypto.createHash("sha256").update(options.data).digest("hex");
	const channel = await options.openDuplex({
		nodeId: options.nodeId,
		command: "file.create",
		params: {
			path: options.path,
			sizeBytes: options.data.byteLength,
			maxBytes: Math.max(1, options.data.byteLength),
			expectedSha256: sha256,
			createParents: options.mkdir,
			followSymlinks: false
		},
		maxMessageBytes: 1048576,
		signal: options.signal,
		assertCurrent: options.assertCurrent,
		timeoutMs: 6e4
	});
	channel.closed.catch(() => {});
	let unsubscribe;
	try {
		options.assertCurrent();
		let receipt = createDeferred();
		let awaiting = false;
		unsubscribe = channel.onMessage((message) => {
			options.assertCurrent();
			if (!awaiting || Buffer.from(message).toString("utf8") !== "ack") throw new Error("Unexpected file.create acknowledgement");
			awaiting = false;
			receipt.resolve();
		});
		for (let offset = 0; offset < options.data.byteLength; offset += 1048576) {
			options.assertCurrent();
			receipt = createDeferred();
			awaiting = true;
			await channel.send(options.data.subarray(offset, offset + 1048576));
			await Promise.race([receipt.promise, channel.closed.then(() => {
				throw new Error("File upload closed before acknowledgement");
			})]);
		}
		options.assertCurrent();
		await channel.send(/* @__PURE__ */ new Uint8Array());
		const result = await channel.closed;
		options.assertCurrent();
		return {
			result,
			sha256
		};
	} finally {
		unsubscribe?.();
		channel.close();
	}
}
//#endregion
//#region extensions/file-transfer/src/workspace-file-fetch.ts
/** Receive a bounded binary fetch through the same policy-owned file.fetch command. */
async function fetchWorkspaceFile(options) {
	options.assertCurrent();
	const channel = await options.openDuplex({
		nodeId: options.nodeId,
		command: "file.fetch",
		params: {
			...options.params,
			transport: "binary",
			maxBytes: options.maxBytes
		},
		maxMessageBytes: FILE_FETCH_CHUNK_BYTES,
		signal: options.signal,
		assertCurrent: options.assertCurrent,
		timeoutMs: 6e4
	});
	channel.closed.catch(() => {});
	let unsubscribe;
	try {
		options.assertCurrent();
		const chunks = [];
		const hash = crypto.createHash("sha256");
		let size = 0;
		unsubscribe = channel.onMessage(async (message) => {
			options.assertCurrent();
			if (!message.byteLength || message.byteLength > 1048576 || message.byteLength > options.maxBytes - size) throw new Error("Invalid or oversized binary file.fetch payload");
			const chunk = Buffer.from(message);
			size += chunk.byteLength;
			hash.update(chunk);
			chunks.push(chunk);
			await channel.send(Buffer.from("ack"));
			options.assertCurrent();
		});
		await channel.send(Buffer.from("start"));
		const result = asOptionalRecord(await channel.closed);
		options.assertCurrent();
		const payload = asOptionalRecord(result?.payload);
		if (!payload || payload.ok !== true) throwFromNodePayload("file.fetch", payload ?? {});
		if (payload.transport !== "binary" || typeof payload.path !== "string" || payload.size !== size || payload.sha256 !== hash.digest("hex")) throw new Error("Binary file.fetch receipt does not match the received bytes");
		return {
			data: Buffer.concat(chunks, size),
			canonicalPath: payload.path
		};
	} finally {
		unsubscribe?.();
		channel.close();
	}
}
//#endregion
//#region extensions/file-transfer/src/workspace-bridge.ts
const MAX_BYTES = 16777216;
const DIRECTORY_PAGE_SIZE = 4096;
var FileFetchTooLargeError = class extends Error {};
function relativeWithin(root, target, paths = path) {
	const relative = paths.relative(root, target);
	if (relative === ".." || relative.startsWith(`..${paths.sep}`) || paths.isAbsolute(relative)) throw new Error("Path is outside the configured node workspace");
	return relative;
}
/** Translate workspace operations to existing policy-checked node commands. */
function createNodeWorkspaceBridge(options) {
	const workspaceDir = path.resolve(options.workspaceDir);
	const remoteRoot = path.posix.resolve(options.remoteRoot);
	const remotePath = (params) => {
		const local = path.resolve(params.cwd ?? workspaceDir, params.filePath);
		return path.posix.join(remoteRoot, relativeWithin(workspaceDir, local).split(path.sep).join("/"));
	};
	const invoke = async (command, params, callerSignal) => {
		const signal = callerSignal ? AbortSignal.any([options.signal, callerSignal]) : options.signal;
		signal.throwIfAborted();
		options.assertCurrent?.();
		const result = asOptionalRecord(await options.invoke({
			nodeId: options.nodeId,
			command,
			params: {
				followSymlinks: false,
				...params
			},
			signal,
			timeoutMs: 6e4
		}));
		signal.throwIfAborted();
		options.assertCurrent?.();
		const payload = asOptionalRecord(result?.payload);
		if (!payload) throw new Error(`Invalid ${command} response`);
		if (payload.ok !== true) {
			if (command === "file.fetch" && payload.code === "FILE_TOO_LARGE") throw new FileFetchTooLargeError(`file.fetch FILE_TOO_LARGE: ${typeof payload.message === "string" ? payload.message : "file exceeds limit"}`);
			if (payload.code === "NOT_FOUND") {
				if (command === "file.stat") return null;
				throw Object.assign(/* @__PURE__ */ new Error(`${command}: path not found`), { code: "ENOENT" });
			}
			throwFromNodePayload(command, payload);
		}
		if (typeof payload.path !== "string" || !path.posix.isAbsolute(payload.path)) throw new Error(`Missing canonical path in ${command} response`);
		relativeWithin(remoteRoot, payload.path, path.posix);
		return payload;
	};
	const readFileWithSource = async (params, followParentSymlinks = false) => {
		const maxBytes = params.maxBytes ?? MAX_BYTES;
		if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) throw new Error("maxBytes must be a non-negative safe integer");
		const fetchParams = {
			path: remotePath(params),
			maxBytes: Math.max(1, Math.min(maxBytes, MAX_BYTES)),
			followSymlinks: false,
			...followParentSymlinks ? {
				rootPath: remoteRoot,
				followSymlinks: true
			} : {}
		};
		let payload;
		try {
			payload = await invoke("file.fetch", fetchParams, params.signal);
		} catch (error) {
			if (!(error instanceof FileFetchTooLargeError) || maxBytes <= MAX_BYTES || !options.openDuplex) throw error;
			const signal = params.signal ? AbortSignal.any([options.signal, params.signal]) : options.signal;
			const result = await fetchWorkspaceFile({
				openDuplex: options.openDuplex,
				nodeId: options.nodeId,
				params: fetchParams,
				maxBytes,
				signal,
				assertCurrent: () => {
					signal.throwIfAborted();
					options.assertCurrent?.();
				}
			});
			if (!path.posix.isAbsolute(result.canonicalPath)) throw new Error("Missing canonical path in file.fetch response", { cause: error });
			return {
				...result,
				workspaceRelativePath: relativeWithin(remoteRoot, result.canonicalPath, path.posix)
			};
		}
		const base64 = typeof payload?.base64 === "string" ? payload.base64 : "";
		const size = inspectStrictBase64(base64);
		if (!payload || typeof payload.base64 !== "string" || size === void 0 || size > maxBytes || payload.size !== size) throw new Error("Invalid or oversized file.fetch payload");
		const data = Buffer.from(base64, "base64");
		if (crypto.createHash("sha256").update(data).digest("hex") !== payload.sha256) throw new Error("file.fetch sha256 mismatch");
		const canonicalPath = payload.path;
		return {
			data,
			canonicalPath,
			workspaceRelativePath: relativeWithin(remoteRoot, canonicalPath, path.posix)
		};
	};
	return {
		async createFileExclusive(params) {
			if (!options.openDuplex) throw new Error("Node workspace attachments require service-owned duplex access");
			const signal = params.signal ? AbortSignal.any([options.signal, params.signal]) : options.signal;
			const assertCurrent = () => {
				signal.throwIfAborted();
				options.assertCurrent?.();
			};
			const data = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data, params.encoding ?? "utf8");
			const { result, sha256 } = await createWorkspaceFile({
				openDuplex: options.openDuplex,
				nodeId: options.nodeId,
				path: remotePath(params),
				data,
				mkdir: params.mkdir !== false,
				signal,
				assertCurrent
			});
			const payload = asOptionalRecord(asOptionalRecord(result)?.payload);
			if (!payload || payload.ok !== true) throwFromNodePayload("file.create", payload ?? {});
			if (typeof payload?.path !== "string" || !path.posix.isAbsolute(payload.path)) throw new Error("Missing canonical path in file.create response");
			relativeWithin(remoteRoot, payload.path, path.posix);
			if (payload.status === "exists") return "exists";
			if (payload.status !== "created" || payload.size !== data.byteLength || payload.sha256 !== sha256) throw new Error("file.create receipt does not match the submitted bytes");
			return "created";
		},
		readFileWithSource: (params) => readFileWithSource(params, true),
		async readFile(params) {
			return (await readFileWithSource(params)).data;
		},
		async writeFile(params) {
			if (params.pinnedPath !== void 0) throw new Error("Node workspace writes do not support caller-supplied mutation pins");
			const data = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data, params.encoding ?? "utf8");
			if (data.byteLength > MAX_BYTES) throw new Error("Node workspace write exceeds the file-transfer byte limit");
			const sha256 = crypto.createHash("sha256").update(data).digest("hex");
			const payload = await invoke("file.write", {
				path: remotePath(params),
				contentBase64: data.toString("base64"),
				overwrite: true,
				rejectHardlinks: true,
				createParents: params.mkdir !== false,
				expectedSha256: sha256
			}, params.signal);
			if (payload?.size !== data.byteLength || payload.sha256 !== sha256) throw new Error("file.write receipt does not match the submitted bytes");
		},
		async stat(params) {
			const payload = await invoke("file.stat", { path: remotePath(params) }, params.signal);
			if (!payload) return null;
			if (payload.type !== "file" && payload.type !== "directory" || typeof payload.size !== "number" || !Number.isSafeInteger(payload.size) || payload.size < 0 || typeof payload.mtimeMs !== "number" || !Number.isFinite(payload.mtimeMs)) throw new Error("Invalid file.stat metadata");
			return {
				type: payload.type,
				size: payload.size,
				mtimeMs: payload.mtimeMs
			};
		},
		async readDirectory(params) {
			const entries = [];
			let offset = 0;
			while (true) {
				const payload = await invoke("dir.list", {
					path: remotePath(params),
					maxEntries: DIRECTORY_PAGE_SIZE,
					...offset > 0 ? { pageToken: String(offset) } : {}
				}, params.signal);
				if (!payload || !Array.isArray(payload.entries) || payload.entries.length > DIRECTORY_PAGE_SIZE) throw new Error("Invalid dir.list response");
				for (const value of payload.entries) {
					const entry = asOptionalRecord(value);
					if (!entry || typeof entry.name !== "string" || !entry.name || entry.name === "." || entry.name === ".." || entry.name.includes("/") || entry.name.includes("\0") || path.sep === "\\" && entry.name.includes("\\") || typeof entry.isDir !== "boolean") throw new Error("Invalid dir.list entry");
					entries.push({
						name: entry.name,
						isDirectory: entry.isDir
					});
				}
				if (payload.truncated === false) return entries;
				const nextOffset = typeof payload.nextPageToken === "string" ? parseStrictNonNegativeInteger(payload.nextPageToken) : void 0;
				if (payload.truncated !== true || nextOffset === void 0 || nextOffset <= offset) throw new Error("Invalid dir.list continuation");
				offset = nextOffset;
			}
		}
	};
}
//#endregion
export { createNodeWorkspaceBridge };
