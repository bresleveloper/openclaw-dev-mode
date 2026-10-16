import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-CECOqf64.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-CeRsYrid.mjs";
import { t as WORKSPACE_PREVIEW_MAX_BYTES } from "./workspace-file-limits-loc-yzkf.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createAsyncLock, readFileWindowFully } from "@openclaw/fs-safe/advanced";
//#region src/gateway/server-methods/workspace-fs.ts
const enqueueWorkspaceFileUpdate = createAsyncLock();
async function openWorkspaceRoot(rootDir) {
	const access = getAgentWorkspaceAccess(rootDir);
	if (access) return {
		rootReal: path.resolve(rootDir),
		access
	};
	try {
		return await root(rootDir, {
			hardlinks: "reject",
			maxBytes: WORKSPACE_PREVIEW_MAX_BYTES,
			symlinks: "reject"
		});
	} catch {
		return;
	}
}
function remoteFilePath(root, browserPath) {
	const resolved = resolveWorkspacePath(root.rootReal, browserPath || ".");
	if (!resolved) throw new Error("Path escapes the workspace");
	return resolved;
}
async function statWorkspacePath(rootDir, browserPath, assertCurrent) {
	const workspaceRoot = typeof rootDir === "string" ? await openWorkspaceRoot(rootDir) : rootDir;
	if (!workspaceRoot) return;
	assertCurrent?.();
	if ("access" in workspaceRoot) {
		const stat = await workspaceRoot.access.bridge.stat({ filePath: remoteFilePath(workspaceRoot, browserPath) });
		return stat ? {
			isFile: stat.type === "file",
			isDirectory: stat.type === "directory",
			size: stat.size,
			mtimeMs: stat.mtimeMs
		} : void 0;
	}
	try {
		return await workspaceRoot.stat(browserPath || ".");
	} catch {
		return;
	}
}
async function listWorkspacePath(rootDir, browserPath, assertCurrent) {
	const workspaceRoot = typeof rootDir === "string" ? await openWorkspaceRoot(rootDir) : rootDir;
	if (!workspaceRoot) return;
	assertCurrent?.();
	if ("access" in workspaceRoot) {
		const list = workspaceRoot.access.bridge.readDirectory;
		if (!list) throw new Error("Workspace host does not support directory browsing");
		const entries = await list({ filePath: remoteFilePath(workspaceRoot, browserPath) });
		const result = [];
		for (const entry of entries) {
			let stat;
			if (entry.isFile !== void 0 && entry.size !== void 0 && entry.mtimeMs !== void 0) stat = {
				isFile: entry.isFile,
				isDirectory: entry.isDirectory,
				size: entry.size,
				mtimeMs: entry.mtimeMs
			};
			else try {
				stat = await statWorkspacePath(workspaceRoot, path.join(browserPath, entry.name), assertCurrent);
			} catch (error) {
				const code = extractErrorCode(error);
				if (code === "SYMLINK_REDIRECT" || code === "UNSUPPORTED_FILE_TYPE") continue;
				throw error;
			}
			if (stat) result.push({
				...stat,
				name: entry.name
			});
		}
		return result;
	}
	try {
		return await workspaceRoot.list(browserPath || ".", { withFileTypes: true });
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "invalid-path") throw new FsSafeError("invalid-path", `Cannot list workspace directory ${JSON.stringify(browserPath || ".")}: ${error.message}`, { cause: error });
		return;
	}
}
async function readWorkspaceFile(rootDir, browserPath, opts) {
	const workspaceRoot = typeof rootDir === "string" ? await openWorkspaceRoot(rootDir) : rootDir;
	if (!workspaceRoot) return;
	opts?.assertCurrent?.();
	if ("access" in workspaceRoot) {
		const filePath = remoteFilePath(workspaceRoot, browserPath);
		const stat = await workspaceRoot.access.bridge.stat({ filePath });
		if (!stat || stat.type !== "file") return;
		const maxBytes = opts?.maxBytes ?? 262144;
		if (stat.size > maxBytes) return "too-large";
		opts?.assertCurrent?.();
		let buffer;
		try {
			buffer = await workspaceRoot.access.bridge.readFile({
				filePath,
				maxBytes
			});
		} catch (error) {
			if (extractErrorCode(error) === "FILE_TOO_LARGE") return "too-large";
			throw error;
		}
		if (buffer.length > maxBytes) return "too-large";
		return {
			buffer,
			stat: {
				size: buffer.length,
				mtimeMs: stat.mtimeMs
			},
			canonicalPath: path.relative(workspaceRoot.rootReal, filePath).split(path.sep).join("/"),
			readOnly: true
		};
	}
	try {
		const read = await workspaceRoot.read(browserPath, { maxBytes: opts?.maxBytes });
		return {
			...read,
			canonicalPath: path.relative(workspaceRoot.rootReal, read.realPath).split(path.sep).join("/")
		};
	} catch (err) {
		if (err instanceof FsSafeError && err.code === "too-large") return "too-large";
		return;
	}
}
/** Reads only a bounded prefix after fs-safe opens and verifies the file identity. */
async function readWorkspaceFilePrefix(rootDir, browserPath, maxBytes) {
	if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) return;
	const workspaceRoot = typeof rootDir === "string" ? await openWorkspaceRoot(rootDir) : rootDir;
	if (!workspaceRoot) return;
	if ("access" in workspaceRoot) return "unsupported";
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			const opened = await workspaceRoot.open(browserPath);
			const handle = _usingCtx$1.a(opened.handle);
			const buffer = Buffer.allocUnsafe(Math.min(maxBytes, opened.stat.size));
			const bytesRead = await readFileWindowFully(handle, buffer, 0);
			return {
				buffer: buffer.subarray(0, bytesRead),
				canonicalPath: path.relative(workspaceRoot.rootReal, opened.realPath).split(path.sep).join("/"),
				stat: opened.stat
			};
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	} catch {
		return;
	}
}
async function updateWorkspaceFile(rootDir, browserPath, content, expectedHash, assertCurrent) {
	const workspaceRoot = await openWorkspaceRoot(rootDir);
	if (!workspaceRoot) return { status: "unsafe" };
	if ("access" in workspaceRoot) throw new Error("This workspace host supports file previews but not conflict-safe editing");
	return await enqueueWorkspaceFileUpdate(async () => {
		let current;
		try {
			current = await workspaceRoot.read(browserPath);
		} catch {
			return { status: "unsafe" };
		}
		if (typeof content === "string" && decodeUtf8Strict(current.buffer) === void 0) return { status: "unsafe" };
		const currentHash = sha256Hex(current.buffer);
		if (expectedHash !== void 0 && currentHash !== expectedHash) return {
			status: "conflict",
			currentHash
		};
		assertCurrent?.();
		await workspaceRoot.write(browserPath, content, {
			...typeof content === "string" ? { encoding: "utf8" } : {},
			renameIdentity: "strict",
			assertBeforeMutation: assertCurrent
		});
		const stat = await workspaceRoot.stat(browserPath);
		if (!stat.isFile) return { status: "unsafe" };
		return {
			status: "updated",
			canonicalPath: path.relative(workspaceRoot.rootReal, current.realPath).split(path.sep).join("/"),
			hash: sha256Hex(content),
			stat
		};
	});
}
/** Publishes user-selected artifacts beneath an unguessable workspace upload directory. */
async function createWorkspaceUploadBatch(params) {
	if (!params.files.length || params.files.length > 64 || params.files.reduce((sum, file) => sum + file.data.length, 0) > 5242880) throw new Error("Workspace upload exceeds the batch limit");
	const names = /* @__PURE__ */ new Set();
	for (const file of params.files) {
		const segments = file.relativePath.split("/");
		if (file.relativePath.length > 2048 || file.relativePath.includes("\\") || segments.some((segment) => !segment || segment === "." || segment === ".." || segment.includes(":") || containsAsciiControlCharacter(segment)) || names.has(file.relativePath)) throw new Error("Invalid workspace upload path");
		names.add(file.relativePath);
	}
	params.assertCurrent();
	const root = await openWorkspaceRoot(params.rootDir);
	params.assertCurrent();
	if (!root || "access" in root) throw new Error("This workspace does not provide local upload publication authority");
	const directory = ".openclaw/uploads/mcp-form-" + randomUUID();
	const paths = [];
	for (const file of params.files) {
		const relativePath = directory + "/" + file.relativePath;
		params.assertCurrent();
		await root.write(relativePath, file.data, {
			mkdir: true,
			overwrite: false,
			mode: 384,
			assertBeforeMutation: params.assertCurrent
		});
		paths.push(path.join(root.rootReal, relativePath));
	}
	return {
		rootDir: path.join(root.rootReal, directory),
		paths
	};
}
function decodeUtf8Strict(buffer) {
	if (buffer.includes(0)) return;
	try {
		return new TextDecoder("utf-8", {
			fatal: true,
			ignoreBOM: true
		}).decode(buffer);
	} catch {
		return;
	}
}
/** Collapses `.` segments and separators into a canonical root-relative path. */
function normalizeRelativePath(value) {
	if (!value) return "";
	return value.replaceAll("\\", "/").split("/").filter((part) => part && part !== ".").join("/");
}
/**
* Lexical containment pre-check before any fs access; fs-safe re-verifies
* against the realpathed root so symlinked escapes still fail later.
*/
function resolveWorkspacePath(root, filePath) {
	if (!root) return;
	const resolved = path.resolve(root, filePath);
	return isPathInside(root, resolved) ? resolved : void 0;
}
/** Protocol timestamps are integer milliseconds. */
function toUpdatedAtMs(mtimeMs) {
	return Math.floor(mtimeMs);
}
function sortDirents(dirents) {
	return dirents.toSorted((a, b) => a.name.localeCompare(b.name));
}
/** Directories first, then name order — the shared browser display order. */
function sortWorkspaceEntries(entries) {
	return entries.toSorted((a, b) => {
		if (a.kind !== b.kind) return a.kind === "directory" ? -1 : 1;
		return a.name.localeCompare(b.name);
	});
}
//#endregion
export { normalizeRelativePath as a, readWorkspaceFilePrefix as c, sortWorkspaceEntries as d, statWorkspacePath as f, listWorkspacePath as i, resolveWorkspacePath as l, updateWorkspaceFile as m, decodeUtf8Strict as n, openWorkspaceRoot as o, toUpdatedAtMs as p, enqueueWorkspaceFileUpdate as r, readWorkspaceFile as s, createWorkspaceUploadBatch as t, sortDirents as u };
