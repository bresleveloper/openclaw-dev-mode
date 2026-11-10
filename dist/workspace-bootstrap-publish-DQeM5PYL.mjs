import { a as openRootFile } from "./boundary-file-read-CCth2Hwg.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { r as isHardlinkFallbackError } from "./directory-durability-B2RKADOj.mjs";
import { t as retryAsync } from "./retry-DwDRpCWu.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-sFz3TNTx.mjs";
import { r as readWorkspaceBootstrapFile, t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-ClACC-rY.mjs";
import { r as writeWorkspaceFileCache, t as readWorkspaceFileCache } from "./workspace-file-cache-BXNEApSi.mjs";
import fs from "node:fs";
import { createHash } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { sameFileIdentity } from "@openclaw/fs-safe/advanced";
//#region src/agents/workspace-file-read.ts
const TRANSIENT_WORKSPACE_READ_CODES = /* @__PURE__ */ new Set([
	"EAGAIN",
	"EWOULDBLOCK",
	"EINTR"
]);
const TRANSIENT_WORKSPACE_READ_ERRNOS = /* @__PURE__ */ new Set([-11, -4]);
const TRANSIENT_WORKSPACE_READ_MESSAGE = /Unknown system error -(?:11|4)\b/i;
const workspaceFileSourceIdentities = /* @__PURE__ */ new WeakMap();
function workspaceFileIdentity(stat, identity, canonicalPath) {
	return `${canonicalPath}|${identity.dev}:${identity.ino}:${stat.size}:${stat.mtimeMs}:${stat.ctimeMs}`;
}
function createLoadedWorkspaceBootstrapFile(name, filePath, loaded, personalUser) {
	const file = {
		name,
		path: filePath,
		content: loaded.content,
		missing: false,
		...personalUser ? { personalUser } : {}
	};
	workspaceFileSourceIdentities.set(file, loaded.sourceIdentity);
	return file;
}
/** Remote source recorded by the successful read, unavailable on hook-created copies. */
function getWorkspaceFileSourceRelativePath(file) {
	return workspaceFileSourceIdentities.get(file)?.[3];
}
function workspaceFileSourceIdentitiesMatch(left, right) {
	const leftIdentity = workspaceFileSourceIdentities.get(left);
	const rightIdentity = workspaceFileSourceIdentities.get(right);
	return leftIdentity?.[2] === rightIdentity?.[2];
}
function workspaceFilesShareSourceIdentity(left, right) {
	const leftIdentity = workspaceFileSourceIdentities.get(left);
	const rightIdentity = workspaceFileSourceIdentities.get(right);
	if (!leftIdentity || !rightIdentity) return false;
	return leftIdentity[0] === rightIdentity[0] || leftIdentity[1] !== void 0 && rightIdentity[1] !== void 0 && sameFileIdentity(leftIdentity[1], rightIdentity[1]);
}
async function readWorkspaceFileWithGuards(params) {
	const access = getAgentWorkspaceAccess(params.workspaceDir);
	if (access) {
		if (!access.bridge.readFileWithSource) throw new Error("Workspace bootstrap source identity is unavailable");
		const filePath = path.relative(params.workspaceDir, params.filePath);
		const assertCurrent = () => {
			if (getAgentWorkspaceAccess(params.workspaceDir) !== access) throw new Error("Workspace access changed while loading bootstrap files");
		};
		try {
			const { data, canonicalPath, workspaceRelativePath } = await access.bridge.readFileWithSource({
				filePath,
				maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES
			});
			assertCurrent();
			if (params.rejectAliases && workspaceRelativePath !== filePath.replaceAll(path.sep, "/")) return {
				ok: false,
				reason: "validation"
			};
			if (data.length > 2097152) throw new RangeError(`Workspace bootstrap file exceeds its read bound: ${filePath}`);
			return {
				ok: true,
				content: data.toString("utf-8"),
				sourceIdentity: [
					canonicalPath,
					void 0,
					`${canonicalPath}:${createHash("sha256").update(data).digest("hex")}:${JSON.stringify(workspaceRelativePath)}`,
					workspaceRelativePath
				]
			};
		} catch (error) {
			assertCurrent();
			if (hasErrnoCode(error, "ENOENT")) return {
				ok: false,
				reason: "path",
				error
			};
			return {
				ok: false,
				reason: error instanceof RangeError ? "validation" : "io",
				error
			};
		}
	}
	try {
		return await retryAsync(async () => {
			const opened = await openRootFile({
				absolutePath: params.filePath,
				rootPath: params.workspaceDir,
				boundaryLabel: "workspace root",
				symlinks: params.rejectAliases ? "reject" : "follow-parents-within-root"
			});
			if (!opened.ok) {
				if (isTransientWorkspaceReadError(opened.error)) throw opened.error;
				return opened;
			}
			const identity = workspaceFileIdentity(opened.stat, opened.exactIdentity, opened.path);
			const sourceIdentity = [
				opened.path,
				opened.exactIdentity,
				identity
			];
			const cached = params.useCache === false ? void 0 : readWorkspaceFileCache(opened.path, identity);
			try {
				const content = cached ?? await readWorkspaceBootstrapFile(opened.fd);
				if (cached === void 0 && params.useCache !== false) writeWorkspaceFileCache({
					filePath: opened.path,
					content,
					identity
				});
				return {
					ok: true,
					content,
					sourceIdentity
				};
			} finally {
				fs.closeSync(opened.fd);
			}
		}, {
			attempts: 3,
			minDelayMs: 50,
			maxDelayMs: 50,
			shouldRetry: (err) => isTransientWorkspaceReadError(err)
		});
	} catch (error) {
		return {
			ok: false,
			reason: error instanceof RangeError ? "validation" : "io",
			error
		};
	}
}
function isTransientWorkspaceReadError(error) {
	if (error && typeof error === "object") {
		if ("code" in error && typeof error.code === "string" && TRANSIENT_WORKSPACE_READ_CODES.has(error.code)) return true;
		if ("errno" in error && typeof error.errno === "number" && TRANSIENT_WORKSPACE_READ_ERRNOS.has(error.errno)) return true;
	}
	return error instanceof Error && TRANSIENT_WORKSPACE_READ_MESSAGE.test(error.message);
}
//#endregion
//#region src/agents/workspace-bootstrap-publish.ts
var WorkspaceBootstrapSeedConflictError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "WorkspaceBootstrapSeedConflictError";
	}
};
async function publishBootstrapFile(filePath, content, beforePersistentApply) {
	const dir = await fs$1.realpath(path.dirname(filePath));
	const targetPath = path.join(dir, path.basename(filePath));
	const existing = await fs$1.lstat(targetPath).catch((error) => {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	});
	beforePersistentApply?.();
	if (existing) return false;
	const resolvedContent = typeof content === "function" ? await content() : content;
	const root$1 = await root(dir);
	try {
		await root$1.create(targetPath, resolvedContent, {
			atomic: true,
			durable: "file",
			mkdir: false,
			mode: 384,
			assertBeforeMutation: beforePersistentApply
		});
		return true;
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "already-exists" && !error.details) return false;
		if (isHardlinkFallbackError(error instanceof FsSafeError ? error.cause : error)) throw new Error("Workspace filesystem does not support atomic bootstrap publication. Use a workspace on a filesystem with hard-link support.", { cause: error });
		throw error;
	}
}
async function publishAgentInstructions(filePath, template, purpose, beforePersistentApply) {
	const content = purpose ? `# Agent purpose\n\n${purpose}\n\n${await template()}` : template;
	const created = await publishBootstrapFile(filePath, content, beforePersistentApply);
	if (purpose && !created) {
		const existing = await readWorkspaceFileWithGuards({
			filePath,
			workspaceDir: path.dirname(filePath),
			useCache: false
		});
		if (!existing.ok || existing.content !== content) throw new WorkspaceBootstrapSeedConflictError("Existing AGENTS.md was preserved. Choose a new workspace to seed the approved custom purpose.");
	}
}
//#endregion
export { getWorkspaceFileSourceRelativePath as a, workspaceFileSourceIdentitiesMatch as c, createLoadedWorkspaceBootstrapFile as i, workspaceFilesShareSourceIdentity as l, publishAgentInstructions as n, isTransientWorkspaceReadError as o, publishBootstrapFile as r, readWorkspaceFileWithGuards as s, WorkspaceBootstrapSeedConflictError as t };
