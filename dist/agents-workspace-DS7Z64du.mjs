import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { d as validateAgentsWorkspaceGetParams, f as validateAgentsWorkspaceListParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as detectMime } from "./mime-CGDYrRzL.mjs";
import { t as WORKSPACE_PREVIEW_MAX_BYTES } from "./workspace-file-limits-loc-yzkf.mjs";
import { a as normalizeRelativePath, d as sortWorkspaceEntries, f as statWorkspacePath, i as listWorkspacePath, l as resolveWorkspacePath, n as decodeUtf8Strict, p as toUpdatedAtMs, s as readWorkspaceFile } from "./workspace-fs-CZ_zWXYP.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as resolveConfiguredAgentIdOrRespondError } from "./agent-id-shared-D1br86TX.mjs";
import path from "node:path";
//#region src/gateway/server-methods/agents-workspace.ts
const MAX_IMAGE_BYTES = 5242880;
const DEFAULT_LIST_LIMIT = 250;
const MAX_LIST_LIMIT = 500;
const IMAGE_EXTENSIONS = /* @__PURE__ */ new Set([
	".avif",
	".bmp",
	".gif",
	".heic",
	".heif",
	".jpeg",
	".jpg",
	".png",
	".webp"
]);
const SUPPORTED_IMAGE_MIME_TYPES = /* @__PURE__ */ new Set([
	"image/avif",
	"image/bmp",
	"image/gif",
	"image/heic",
	"image/heif",
	"image/jpeg",
	"image/png",
	"image/webp"
]);
function workspaceError(type, message, details) {
	return errorShape(ErrorCodes.INVALID_REQUEST, message, { details: {
		type,
		...details
	} });
}
function resolveWorkspaceScopeOrRespond(params, cfg, respond) {
	const agentId = resolveConfiguredAgentIdOrRespondError(params.agentId, cfg, respond);
	if (!agentId) return null;
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	const rawPath = params.path ?? "";
	const portablePath = rawPath.replaceAll("\\", "/");
	if (path.posix.isAbsolute(portablePath) || path.win32.isAbsolute(rawPath)) {
		respond(false, void 0, workspaceError("workspace_path_invalid", "path must be workspace-relative", { path: rawPath }));
		return null;
	}
	const browserPath = normalizeRelativePath(params.path);
	if (!resolveWorkspacePath(workspaceDir, browserPath || ".")) {
		respond(false, void 0, workspaceError("workspace_path_invalid", "path escapes the agent workspace", { path: params.path ?? "" }));
		return null;
	}
	return {
		agentId,
		workspaceDir,
		browserPath
	};
}
const agentsWorkspaceHandlers = {
	"agents.workspace.list": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateAgentsWorkspaceListParams, "agents.workspace.list", respond)) return;
		const scope = resolveWorkspaceScopeOrRespond(params, context.getRuntimeConfig(), respond);
		if (!scope) return;
		const { agentId, workspaceDir, browserPath } = scope;
		const dirents = (await statWorkspacePath(workspaceDir, browserPath))?.isDirectory ? await listWorkspacePath(workspaceDir, browserPath) : void 0;
		if (!dirents) {
			respond(false, void 0, workspaceError("workspace_path_not_found", "workspace directory not found", { path: browserPath }));
			return;
		}
		const entries = sortWorkspaceEntries(dirents.flatMap((dirent) => {
			const kind = dirent.isFile ? "file" : dirent.isDirectory ? "directory" : null;
			if (!kind) return [];
			return [{
				path: browserPath ? `${browserPath}/${dirent.name}` : dirent.name,
				name: dirent.name,
				kind,
				...kind === "file" ? { size: dirent.size } : {},
				updatedAtMs: toUpdatedAtMs(dirent.mtimeMs)
			}];
		}));
		const offset = Math.min(params.offset ?? 0, entries.length);
		const limit = Math.min(params.limit ?? DEFAULT_LIST_LIMIT, MAX_LIST_LIMIT);
		const parent = path.dirname(browserPath);
		respond(true, {
			agentId,
			path: browserPath,
			...browserPath ? { parentPath: parent === "." ? "" : parent } : {},
			entries: entries.slice(offset, offset + limit),
			totalEntries: entries.length,
			offset
		});
	},
	"agents.workspace.get": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateAgentsWorkspaceGetParams, "agents.workspace.get", respond)) return;
		const scope = resolveWorkspaceScopeOrRespond(params, context.getRuntimeConfig(), respond);
		if (!scope) return;
		const { agentId, workspaceDir, browserPath } = scope;
		const respondNotFound = () => {
			respond(false, void 0, workspaceError("workspace_file_not_found", "workspace file not found", { path: browserPath }));
		};
		if (!browserPath) {
			respondNotFound();
			return;
		}
		const stat = await statWorkspacePath(workspaceDir, browserPath);
		if (!stat?.isFile) {
			respondNotFound();
			return;
		}
		const expectsImage = IMAGE_EXTENSIONS.has(path.extname(browserPath).toLowerCase());
		const maxBytes = expectsImage ? MAX_IMAGE_BYTES : WORKSPACE_PREVIEW_MAX_BYTES;
		const read = stat.size > maxBytes ? "too-large" : await readWorkspaceFile(workspaceDir, browserPath, { maxBytes });
		if (read === "too-large") {
			respond(false, void 0, workspaceError("workspace_file_too_large", "workspace file is too large to preview", {
				maxBytes,
				path: browserPath,
				size: stat.size
			}));
			return;
		}
		if (!read) {
			respondNotFound();
			return;
		}
		const respondUnsupported = () => {
			respond(false, void 0, workspaceError("workspace_file_unsupported", "workspace file is not UTF-8 text or a supported image", { path: browserPath }));
		};
		const file = {
			path: browserPath,
			name: path.basename(browserPath),
			size: read.stat.size,
			updatedAtMs: toUpdatedAtMs(read.stat.mtimeMs)
		};
		if (expectsImage) {
			const sniffedMime = await detectMime({ buffer: read.buffer });
			if (!sniffedMime || !SUPPORTED_IMAGE_MIME_TYPES.has(sniffedMime)) {
				respondUnsupported();
				return;
			}
			respond(true, {
				agentId,
				file: {
					...file,
					mimeType: sniffedMime,
					encoding: "base64",
					content: read.buffer.toString("base64")
				}
			});
			return;
		}
		const text = decodeUtf8Strict(read.buffer);
		if (text === void 0) {
			respondUnsupported();
			return;
		}
		respond(true, {
			agentId,
			file: {
				...file,
				mimeType: "text/plain",
				encoding: "utf8",
				content: text
			}
		});
	}
};
//#endregion
export { agentsWorkspaceHandlers };
