import { t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as readFileWindowFully } from "./file-read-Csm265gq.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/gateway/server-methods/workspace-fs.ts
/** Shared preview cap: keeps file payloads comfortably under client WS limits. */
const WORKSPACE_PREVIEW_MAX_BYTES = 262144;
let workspaceFileUpdateQueue = Promise.resolve();
async function openWorkspaceRoot(rootDir) {
	try {
		return await root(rootDir, {
			hardlinks: "reject",
			maxBytes: WORKSPACE_PREVIEW_MAX_BYTES,
			nonBlockingRead: true,
			symlinks: "reject"
		});
	} catch {
		return;
	}
}
async function statWorkspacePath(rootDir, browserPath) {
	const workspaceRoot = typeof rootDir === "string" ? await openWorkspaceRoot(rootDir) : rootDir;
	if (!workspaceRoot) return;
	try {
		return await workspaceRoot.stat(browserPath || ".");
	} catch {
		return;
	}
}
async function listWorkspacePath(rootDir, browserPath) {
	const workspaceRoot = typeof rootDir === "string" ? await openWorkspaceRoot(rootDir) : rootDir;
	if (!workspaceRoot) return;
	try {
		return await workspaceRoot.list(browserPath || ".", { withFileTypes: true });
	} catch {
		return;
	}
}
async function readWorkspaceFile(rootDir, browserPath, opts) {
	const workspaceRoot = await openWorkspaceRoot(rootDir);
	if (!workspaceRoot) return;
	try {
		const read = await workspaceRoot.read(browserPath, {
			hardlinks: "reject",
			maxBytes: opts?.maxBytes ?? 262144,
			nonBlockingRead: true,
			symlinks: "reject"
		});
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
	const workspaceRoot = await openWorkspaceRoot(rootDir);
	if (!workspaceRoot) return;
	try {
		const opened = await workspaceRoot.open(browserPath, {
			hardlinks: "reject",
			nonBlockingRead: true,
			symlinks: "reject"
		});
		try {
			const buffer = Buffer.allocUnsafe(Math.min(maxBytes, opened.stat.size));
			const bytesRead = await readFileWindowFully(opened.handle, buffer, 0);
			return {
				buffer: buffer.subarray(0, bytesRead),
				canonicalPath: path.relative(workspaceRoot.rootReal, opened.realPath).split(path.sep).join("/"),
				stat: opened.stat
			};
		} finally {
			await opened.handle.close();
		}
	} catch {
		return;
	}
}
function enqueueWorkspaceFileUpdate(update) {
	const result = workspaceFileUpdateQueue.then(update, update);
	workspaceFileUpdateQueue = result.then(() => void 0, () => void 0);
	return result;
}
async function updateWorkspaceFile(rootDir, browserPath, content, expectedHash, assertCurrent) {
	const workspaceRoot = await openWorkspaceRoot(rootDir);
	if (!workspaceRoot) return { status: "unsafe" };
	return await enqueueWorkspaceFileUpdate(async () => {
		let current;
		try {
			current = await workspaceRoot.read(browserPath, {
				hardlinks: "reject",
				maxBytes: WORKSPACE_PREVIEW_MAX_BYTES,
				nonBlockingRead: true,
				symlinks: "reject"
			});
		} catch {
			return { status: "unsafe" };
		}
		if (decodeUtf8Strict(current.buffer) === void 0) return { status: "unsafe" };
		const currentHash = createHash("sha256").update(current.buffer).digest("hex");
		if (currentHash !== expectedHash) return {
			status: "conflict",
			currentHash
		};
		assertCurrent?.();
		await workspaceRoot.write(browserPath, content, {
			encoding: "utf8",
			renameIdentity: "strict"
		});
		const stat = await workspaceRoot.stat(browserPath);
		if (!stat.isFile) return { status: "unsafe" };
		return {
			status: "updated",
			canonicalPath: path.relative(workspaceRoot.rootReal, current.realPath).split(path.sep).join("/"),
			hash: createHash("sha256").update(content, "utf8").digest("hex"),
			stat
		};
	});
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
export { normalizeRelativePath as a, readWorkspaceFilePrefix as c, sortWorkspaceEntries as d, statWorkspacePath as f, listWorkspacePath as i, resolveWorkspacePath as l, updateWorkspaceFile as m, decodeUtf8Strict as n, openWorkspaceRoot as o, toUpdatedAtMs as p, enqueueWorkspaceFileUpdate as r, readWorkspaceFile as s, WORKSPACE_PREVIEW_MAX_BYTES as t, sortDirents as u };
