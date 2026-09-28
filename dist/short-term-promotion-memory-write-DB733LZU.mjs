import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { l as resolvePathPrefixSync } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { a as writeFileWindowFully } from "./file-descriptor-C_0BsNDD.mjs";
import { n as replaceFileAtomic } from "./replace-file-DJtj9VLX.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./file-access-runtime-CWjkXCju.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { c as readWorkspaceText, n as getMemoryWorkspaceMaintenance } from "./memory-workspace-files-DqjGDoKP.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region extensions/memory-core/src/short-term-promotion-memory-write.ts
function buildPromotionMarker(candidateKey) {
	return `<!-- openclaw-memory-promotion:${candidateKey} -->`;
}
function extractPromotionKeys(content) {
	return [...content.matchAll(/<!--\s*openclaw-memory-promotion:([^\n]*?)\s*-->/giu)].map((match) => match[1]?.trim()).filter((key) => Boolean(key));
}
var MemoryWriteConflictError = class extends Error {
	constructor(message = "MEMORY.md changed before the dreaming write could commit") {
		super(message);
		this.name = "MemoryWriteConflictError";
	}
};
var MemoryAtomicPublicationError = class extends Error {
	constructor(publication, cause) {
		super(cause instanceof Error ? cause.message : String(cause), { cause });
		this.publication = publication;
		this.name = cause instanceof Error ? cause.name : "Error";
		this.code = extractErrorCode(cause);
	}
};
async function resolveMemoryWritePath(filePath, workspaceDir) {
	const files = workspaceDir ? getMemoryWorkspaceMaintenance(workspaceDir) : void 0;
	if (files) return await files.resolveWritePath(filePath);
	if (!process.versions.bun || process.platform === "win32") try {
		return await fs.realpath(filePath);
	} catch (error) {
		if (extractErrorCode(error) !== "ENOENT") throw error;
	}
	const { existingPath, unresolvedSegments } = resolvePathPrefixSync(filePath);
	if (unresolvedSegments.length === 0) return existingPath;
	if (unresolvedSegments.length !== 1) throw Object.assign(/* @__PURE__ */ new Error(`ENOENT: no such file or directory, realpath '${filePath}'`), {
		code: "ENOENT",
		path: filePath,
		syscall: "realpath"
	});
	return path.join(existingPath, unresolvedSegments[0]);
}
async function readMemoryContent(filePath, workspaceDir) {
	return await (workspaceDir ? readWorkspaceText(workspaceDir, filePath) : fs.readFile(filePath, "utf-8")).catch((error) => {
		if (error.code === "ENOENT") return "";
		throw error;
	});
}
function isAtomicReplacePermissionError(error) {
	const code = error.code;
	return code === "EACCES" || code === "EPERM" || code === "EEXIST" || code === "EROFS";
}
async function writeExistingMemoryInPlace(params) {
	if (await readMemoryContent(params.filePath) !== params.expectedContent) throw new MemoryWriteConflictError(params.conflictMessage);
	let handle;
	try {
		handle = await fs.open(params.filePath, "r+");
	} catch {
		return false;
	}
	try {
		await handle.writeFile(params.content, { encoding: "utf-8" });
		await handle.truncate(Buffer.byteLength(params.content));
		await handle.sync();
		return true;
	} catch (error) {
		const original = Buffer.from(params.expectedContent, "utf-8");
		try {
			await writeFileWindowFully(handle, original, 0);
			await handle.truncate(original.length);
			await handle.sync();
		} catch (restoreError) {
			throw new Error(`${path.basename(params.filePath)} in-place write failed and restoring the original content also failed`, { cause: restoreError });
		}
		throw error;
	} finally {
		await handle.close();
	}
}
function hashMemoryContent(content) {
	return createHash("sha256").update(content).digest("hex");
}
async function commitMemoryContent(params) {
	const files = params.workspaceDir ? getMemoryWorkspaceMaintenance(params.workspaceDir) : void 0;
	if (files) {
		const { workspaceDir: _workspaceDir, ...request } = params;
		try {
			return await files.commitContent(request);
		} catch (error) {
			if (error instanceof Error && error.name === "MemoryWriteConflictError") throw new MemoryWriteConflictError(error.message);
			if (error && typeof error === "object" && "publication" in error && (error.publication === "uncertain" || error.publication === "committed")) throw new MemoryAtomicPublicationError(error.publication, error);
			throw error;
		}
	}
	if (params.content === null) {
		if (await readMemoryContent(params.filePath) !== params.expectedContent) throw new MemoryWriteConflictError(params.conflictMessage);
		await fs.unlink(params.filePath);
		return;
	}
	const memoryDirMode = (await fs.stat(path.dirname(params.filePath))).mode & 4095;
	const expectedHash = params.expectedHash;
	const replacementContent = params.content;
	const publication = { state: "unattempted" };
	try {
		await replaceFileAtomic({
			filePath: params.filePath,
			content: params.content,
			dirMode: memoryDirMode,
			mode: 384,
			preserveExistingMode: true,
			tempPrefix: params.tempPrefix,
			syncTempFile: true,
			syncParentDir: true,
			throwOnCleanupError: true,
			beforeRename: async () => {
				if (params.expectedHash && hashMemoryContent(await readMemoryContent(params.filePath)) !== params.expectedHash) throw new MemoryWriteConflictError(params.conflictMessage);
			},
			fileSystem: { promises: {
				mkdir: fs.mkdir,
				chmod: fs.chmod,
				writeFile: fs.writeFile,
				rename: async (from, to) => {
					publication.state = "uncertain";
					try {
						await fs.rename(from, to);
					} catch (error) {
						if (isAtomicReplacePermissionError(error) && expectedHash && hashMemoryContent(replacementContent) !== expectedHash) try {
							if (hashMemoryContent(await readMemoryContent(String(to))) === expectedHash) publication.state = "unchanged-after-rejection";
						} catch {}
						throw error;
					}
					publication.state = "committed";
				},
				copyFile: fs.copyFile,
				unlink: fs.unlink,
				rm: fs.rm,
				open: fs.open,
				stat: fs.stat,
				lstat: fs.lstat
			} }
		});
	} catch (error) {
		if (!params.allowInPlaceFallback || params.expectedContent === void 0 || !isAtomicReplacePermissionError(error) || !await writeExistingMemoryInPlace({
			filePath: params.filePath,
			expectedContent: params.expectedContent,
			content: params.content,
			conflictMessage: params.conflictMessage
		})) {
			if (publication.state === "uncertain" || publication.state === "committed") throw new MemoryAtomicPublicationError(publication.state, error);
			throw error;
		}
	}
}
//#endregion
export { extractPromotionKeys as a, readMemoryContent as c, commitMemoryContent as i, resolveMemoryWritePath as l, MemoryWriteConflictError as n, hashMemoryContent as o, buildPromotionMarker as r, isAtomicReplacePermissionError as s, MemoryAtomicPublicationError as t };
