import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { c as readFileDescriptorBoundedSync, o as openRootFileSync } from "./boundary-file-read-CCth2Hwg.mjs";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-CAv_plX7.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { o as isRenderableAvatarImageDataUrl, t as AVATAR_MAX_BYTES } from "./avatar-limits-2506OuP3.mjs";
import { a as isSupportedLocalAvatarExtension, c as resolveAvatarMime, n as isAvatarDataUrl, o as isWindowsAbsolutePath, r as isAvatarHttpUrl, t as hasAvatarUriScheme } from "./avatar-policy-DiIdI6oM.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/identity-avatar-file.ts
/** Resolve one local avatar source while retaining its canonical workspace root. */
function resolveLocalAgentAvatarPath(params) {
	const workspaceRoot = resolveRealpathOrAbsolute(params.workspaceDir);
	const resolved = params.raw.startsWith("~") || path.isAbsolute(params.raw) ? resolveUserPath(params.raw) : path.resolve(workspaceRoot, params.raw);
	const filePath = resolveRealpathOrAbsolute(resolved);
	if (!isPathInside(workspaceRoot, filePath)) return {
		ok: false,
		reason: "outside_workspace"
	};
	if (!isSupportedLocalAvatarExtension(filePath)) return {
		ok: false,
		reason: "unsupported_extension"
	};
	try {
		const stat = fs.statSync(filePath);
		if (!stat.isFile()) return {
			ok: false,
			reason: "missing"
		};
		if (stat.size > 2097152) return {
			ok: false,
			reason: "too_large"
		};
	} catch {
		return {
			ok: false,
			reason: "missing"
		};
	}
	return {
		ok: true,
		value: {
			filePath,
			workspaceRoot
		}
	};
}
function openResolvedLocalAgentAvatarFile(resolved) {
	try {
		const opened = openRootFileSync({
			absolutePath: resolved.filePath,
			rootPath: resolved.workspaceRoot,
			rootRealPath: resolved.workspaceRoot,
			boundaryLabel: "agent workspace",
			maxBytes: AVATAR_MAX_BYTES,
			rejectHardlinks: true,
			skipLexicalRootCheck: true
		});
		if (!opened.ok) return null;
		if (!isSupportedLocalAvatarExtension(opened.path)) {
			fs.closeSync(opened.fd);
			return null;
		}
		return {
			path: opened.path,
			fd: opened.fd,
			stat: {
				ctimeMs: opened.stat.ctimeMs,
				dev: opened.stat.dev,
				ino: opened.stat.ino,
				mtimeMs: opened.stat.mtimeMs,
				size: opened.stat.size
			}
		};
	} catch {
		return null;
	}
}
function localAgentAvatarRevision(file) {
	const { ctimeMs, dev, ino, mtimeMs, size } = file.stat;
	return JSON.stringify([
		file.path,
		ctimeMs,
		dev,
		ino,
		mtimeMs,
		size
	]);
}
/** Worker-side admission keeps the descriptor pinned until the optional read completes. */
function readLocalAgentAvatarSnapshot(params) {
	const resolved = resolveLocalAgentAvatarPath({
		raw: params.source,
		workspaceDir: params.workspaceDir
	});
	if (!resolved.ok) return resolved;
	const opened = openResolvedLocalAgentAvatarFile(resolved.value);
	if (!opened) return {
		ok: false,
		reason: "unreadable"
	};
	try {
		const file = {
			path: opened.path,
			stat: opened.stat
		};
		if (params.knownRevision === localAgentAvatarRevision(file)) return { kind: "unchanged" };
		return {
			ok: true,
			file: {
				...file,
				body: params.readBody ? Uint8Array.from(readFileDescriptorBoundedSync(opened.fd, AVATAR_MAX_BYTES)) : void 0
			}
		};
	} catch {
		return {
			ok: false,
			reason: "unreadable"
		};
	} finally {
		fs.closeSync(opened.fd);
	}
}
async function prepareLocalAgentAvatarFile(params) {
	try {
		const { prepareLocalAgentAvatar } = await import("./identity-avatar-file-runtime-Dn_K-TSx.mjs");
		return await prepareLocalAgentAvatar({
			workspaceDir: resolveAgentWorkspaceDir(params.cfg, params.agentId),
			source: params.source,
			readBody: params.readBody
		});
	} catch {
		return {
			ok: false,
			reason: "unreadable"
		};
	}
}
/** Resolve one configured avatar source for agent-list projections. */
async function resolveAgentAvatarUrlFromSource(cfg, agentId, source) {
	const normalized = normalizeOptionalString(source);
	if (!normalized) return;
	if (isAvatarHttpUrl(normalized) || isRenderableAvatarImageDataUrl(normalized)) return normalized;
	if (isAvatarDataUrl(normalized) || hasAvatarUriScheme(normalized) && !isWindowsAbsolutePath(normalized)) return;
	const prepared = await prepareLocalAgentAvatarFile({
		cfg,
		agentId,
		source: normalized,
		readBody: true
	});
	return prepared.ok && prepared.file.body ? `data:${resolveAvatarMime(prepared.file.path)};base64,${prepared.file.body.toString("base64")}` : void 0;
}
//#endregion
export { resolveLocalAgentAvatarPath as a, resolveAgentAvatarUrlFromSource as i, prepareLocalAgentAvatarFile as n, readLocalAgentAvatarSnapshot as r, localAgentAvatarRevision as t };
