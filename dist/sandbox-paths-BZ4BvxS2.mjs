import { _ as resolveConfigDir, p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { n as isNotFoundPathError, r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { a as safeFileURLToPath, r as hasEncodedFileUrlSeparator, t as assertNoWindowsNetworkPath } from "./local-file-access-B6bU8SNO.mjs";
import { t as isPassThroughRemoteMediaSource } from "./media-source-url-BL9SUd7E.mjs";
import { t as isWindowsDrivePath } from "./archive-path-Cbi82IZu.mjs";
import { n as assertNoPathAliasEscape } from "./path-alias-guards-B5pyqp7d.mjs";
import fs from "node:fs";
import { URL } from "node:url";
import { promisify } from "node:util";
import path from "node:path";
import os from "node:os";
//#region src/agents/sandbox-paths.ts
/**
* Sandbox input path normalization and boundary checks.
*
* Handles host paths, file URLs, temporary media paths, and workspace root assertions.
*/
const DATA_URL_RE = /^data:/i;
const SANDBOX_CONTAINER_WORKDIR = "/workspace";
const MANAGED_MEDIA_SUBDIRS = /* @__PURE__ */ new Set(["outbound"]);
/** Consume one file-reference prefix while preserving remaining literal @ bytes. */
function normalizeFileReferencePrefix(filePath) {
	const referenced = filePath.startsWith("@") ? filePath.slice(1) : filePath;
	return referenced.startsWith("@") ? `./${referenced}` : referenced;
}
function normalizeSandboxInputPath(filePath) {
	const normalized = normalizeFileReferencePrefix(filePath);
	if (normalized === "~") return os.homedir();
	if (normalized.startsWith("~/")) return os.homedir() + normalized.slice(1);
	return normalized;
}
/** True when the path is absolute for the current platform or a Windows drive path (e.g. C:\\...), even if path.isAbsolute is false under POSIX rules. */
function hostPathLooksAbsolute(expanded) {
	return path.isAbsolute(expanded) || isWindowsDrivePath(expanded);
}
function resolveToCwd(filePath, cwd) {
	const expanded = normalizeSandboxInputPath(filePath);
	if (isWindowsDrivePath(expanded)) return path.win32.normalize(expanded);
	if (path.isAbsolute(expanded)) return expanded;
	return path.resolve(cwd, expanded);
}
function resolveSandboxInputPath(filePath, cwd) {
	return resolveToCwd(filePath, cwd);
}
function resolveSandboxPath(params) {
	const resolved = resolveSandboxInputPath(params.filePath, params.cwd);
	const rootResolved = path.resolve(params.root);
	const relative = path.relative(rootResolved, resolved);
	if (!relative || relative === "") return {
		resolved,
		relative: ""
	};
	if (relative === ".." || relative.startsWith("../") || relative.startsWith("..\\") || path.isAbsolute(relative) || isWindowsDrivePath(relative)) throw markHostRootEscape(/* @__PURE__ */ new Error(`Path escapes sandbox root (${shortenHomePath(rootResolved)}): ${params.filePath}`));
	return {
		resolved,
		relative
	};
}
const HOST_ROOT_ESCAPE = Symbol.for("openclaw.hostRootEscape");
/**
* Tag a rejection as coming from the host workspace root. Sandbox filesystem bridges
* enforce their own mount boundary and leave their rejections untagged, so callers can
* tell the two apart without reading the message text.
*/
function markHostRootEscape(error) {
	try {
		if (error instanceof Error && Object.isExtensible(error)) Object.defineProperty(error, HOST_ROOT_ESCAPE, { value: true });
	} catch {}
	return error;
}
/** True when a rejection came from the host workspace root rather than a container mount. */
function isHostRootEscapeError(error) {
	try {
		return error instanceof Error && Reflect.get(error, HOST_ROOT_ESCAPE) === true;
	} catch {
		return false;
	}
}
function rethrowHostPathAliasError(error) {
	if (isPathBoundaryEscapeError(error, "sandbox root")) throw markHostRootEscape(error);
	throw error;
}
/** Classify fs-safe's untyped escape errors only at a known validator boundary. */
function isPathBoundaryEscapeError(error, boundary) {
	return error instanceof Error && /^(?:Path escapes|Path resolves outside|Symlink escapes) (sandbox root|workspace root) \(/.exec(error.message)?.[1] === boundary;
}
const realpathNative = promisify(fs.realpath.native);
async function resolveRawPathViaExistingAncestor(rawPath) {
	let cursor = rawPath;
	const missingSuffix = [];
	while (true) try {
		return path.resolve(await realpathNative(cursor), ...missingSuffix);
	} catch (error) {
		if (!isNotFoundPathError(error)) throw error;
		const parent = path.dirname(cursor);
		if (parent === cursor) throw error;
		missingSuffix.unshift(path.basename(cursor));
		cursor = parent;
	}
}
async function assertRawParentWithinRoot(params) {
	if (process.platform === "win32") return {
		rootCanonical: path.resolve(params.root),
		targetCanonical: resolveSandboxInputPath(params.filePath, params.cwd)
	};
	const expanded = normalizeSandboxInputPath(params.filePath);
	if (isWindowsDrivePath(expanded)) return {
		rootCanonical: path.resolve(params.root),
		targetCanonical: path.win32.normalize(expanded)
	};
	const rawAbsolute = path.isAbsolute(expanded) ? expanded : `${params.cwd}${path.sep}${expanded}`;
	const hasTrailingSeparator = rawAbsolute.endsWith(path.sep);
	const rawParent = hasTrailingSeparator ? rawAbsolute : path.dirname(rawAbsolute);
	const finalSegment = hasTrailingSeparator ? "." : path.basename(rawAbsolute);
	const rootResolved = path.resolve(params.root);
	const { rootCanonical } = params;
	const parentCanonical = await resolveRawPathViaExistingAncestor(rawParent);
	const targetCanonical = path.resolve(rawAbsolute) === rootResolved ? await resolveRawPathViaExistingAncestor(rawAbsolute) : path.resolve(parentCanonical, finalSegment);
	if (targetCanonical !== rootCanonical && !isPathInside(rootCanonical, targetCanonical)) throw markHostRootEscape(/* @__PURE__ */ new Error(`Path escapes sandbox root (${shortenHomePath(rootCanonical)}): ${params.filePath}`));
	return {
		rootCanonical,
		targetCanonical
	};
}
async function assertSandboxPath(params) {
	const root = path.resolve(params.root);
	const cwd = path.resolve(params.cwd);
	let rootCanonical = root;
	let resolutionCwd = cwd;
	let filePath = params.filePath;
	const expanded = normalizeSandboxInputPath(filePath);
	if (process.platform !== "win32" && !isWindowsDrivePath(expanded)) {
		const rootPromise = resolveRawPathViaExistingAncestor(root);
		const [canonicalRoot, canonicalCwd] = await Promise.all([rootPromise, cwd === root ? rootPromise : resolveRawPathViaExistingAncestor(cwd)]);
		rootCanonical = canonicalRoot;
		resolutionCwd = path.resolve(root, path.relative(rootCanonical, canonicalCwd));
		const prefixes = [
			[cwd, resolutionCwd],
			[root, root],
			[rootCanonical, root]
		];
		if (path.isAbsolute(expanded) && isPathInside(rootCanonical, canonicalCwd)) {
			const rootAlias = path.resolve(cwd, path.relative(canonicalCwd, rootCanonical));
			if (!prefixes.some(([prefix]) => prefix === rootAlias) && await resolveRawPathViaExistingAncestor(rootAlias) === rootCanonical) prefixes.push([rootAlias, root]);
		}
		for (const [prefix, replacement] of prefixes.toSorted((a, b) => b[0].length - a[0].length)) {
			if (expanded === prefix) {
				filePath = replacement;
				break;
			}
			const prefixWithSeparator = prefix.endsWith(path.sep) ? prefix : `${prefix}${path.sep}`;
			if (expanded.startsWith(prefixWithSeparator)) {
				filePath = `${replacement}${replacement.endsWith(path.sep) ? "" : path.sep}${expanded.slice(prefixWithSeparator.length)}`;
				break;
			}
		}
	}
	const normalized = {
		filePath,
		cwd: resolutionCwd,
		root,
		rootCanonical
	};
	const resolved = resolveSandboxPath(normalized);
	const policy = {
		allowFinalSymlinkForUnlink: params.allowFinalSymlinkForUnlink,
		allowFinalHardlinkForUnlink: params.allowFinalHardlinkForUnlink
	};
	await assertNoPathAliasEscape({
		absolutePath: resolved.resolved,
		rootPath: root,
		boundaryLabel: "sandbox root",
		policy
	}).catch(rethrowHostPathAliasError);
	const rawTarget = await assertRawParentWithinRoot(normalized);
	if (path.resolve(rawTarget.targetCanonical) !== path.resolve(resolved.resolved)) await assertNoPathAliasEscape({
		absolutePath: rawTarget.targetCanonical,
		rootPath: rawTarget.rootCanonical,
		boundaryLabel: "sandbox root",
		policy
	}).catch(rethrowHostPathAliasError);
	return resolved;
}
function assertMediaNotDataUrl(media) {
	const raw = media.trim();
	if (DATA_URL_RE.test(raw)) throw new Error("data: URLs are not supported for media. Use buffer instead.");
}
function resolveManagedMediaRoot(candidate) {
	const expanded = normalizeSandboxInputPath(candidate);
	if (!hostPathLooksAbsolute(expanded)) return;
	const mediaRoot = path.join(resolveConfigDir(), "media");
	const resolvedMediaRoot = path.resolve(mediaRoot);
	const resolvedExpanded = path.resolve(expanded);
	if (resolvedExpanded === resolvedMediaRoot || !isPathInside(resolvedMediaRoot, resolvedExpanded)) return;
	const firstSegment = path.relative(resolvedMediaRoot, resolvedExpanded).split(path.sep)[0] ?? "";
	return MANAGED_MEDIA_SUBDIRS.has(firstSegment) || firstSegment.startsWith("tool-") ? path.join(resolvedMediaRoot, firstSegment) : void 0;
}
async function resolveAllowedManagedMediaPath(candidate) {
	const expanded = normalizeSandboxInputPath(candidate);
	if (!resolveManagedMediaRoot(expanded)) return;
	const resolved = path.resolve(expanded);
	await assertNoManagedMediaAliasEscape({
		filePath: resolved,
		managedMediaRoot: path.resolve(resolveConfigDir(), "media")
	});
	return resolved;
}
async function resolveSandboxedMediaSource(params) {
	const raw = params.media.trim();
	if (!raw) return raw;
	if (isPassThroughRemoteMediaSource(raw)) return raw;
	const containerWorkdir = path.posix.normalize((params.containerWorkdir ?? SANDBOX_CONTAINER_WORKDIR).replace(/\\/g, "/")).replace(/\/+$/, "") || "/";
	let candidate = raw;
	if (/^file:/i.test(candidate)) {
		const workspaceMappedFromUrl = mapContainerWorkspaceFileUrl({
			fileUrl: candidate,
			sandboxRoot: params.sandboxRoot,
			containerWorkdir
		});
		if (workspaceMappedFromUrl) candidate = workspaceMappedFromUrl;
		else try {
			candidate = safeFileURLToPath(candidate);
		} catch (err) {
			throw new Error(`Invalid file:// URL for sandboxed media: ${err.message}`, { cause: err });
		}
	}
	const containerWorkspaceMapped = mapContainerWorkspacePath({
		candidate,
		sandboxRoot: params.sandboxRoot,
		containerWorkdir
	});
	if (containerWorkspaceMapped) candidate = containerWorkspaceMapped;
	assertNoWindowsNetworkPath(candidate, "Sandbox media path");
	const tmpMediaPath = await resolveAllowedTmpMediaPath({
		candidate,
		sandboxRoot: params.sandboxRoot
	});
	if (tmpMediaPath) return tmpMediaPath;
	const managedMediaPath = await resolveAllowedManagedMediaPath(candidate);
	if (managedMediaPath) return managedMediaPath;
	return (await assertSandboxPath({
		filePath: candidate,
		cwd: params.sandboxRoot,
		root: params.sandboxRoot
	})).resolved;
}
async function assertNoManagedMediaAliasEscape(params) {
	await assertNoPathAliasEscape({
		absolutePath: params.filePath,
		rootPath: params.managedMediaRoot,
		boundaryLabel: "managed media root"
	});
}
function mapContainerWorkspaceFileUrl(params) {
	let parsed;
	try {
		parsed = new URL(params.fileUrl);
	} catch {
		return;
	}
	if (parsed.protocol !== "file:") return;
	const host = parsed.hostname.trim().toLowerCase();
	if (host && host !== "localhost") return;
	if (hasEncodedFileUrlSeparator(parsed.pathname)) return;
	let normalizedPathname;
	try {
		normalizedPathname = decodeURIComponent(parsed.pathname).replace(/\\/g, "/");
	} catch {
		return;
	}
	return mapContainerWorkspacePath({
		candidate: normalizedPathname,
		sandboxRoot: params.sandboxRoot,
		containerWorkdir: params.containerWorkdir
	});
}
function mapContainerWorkspacePath(params) {
	const normalized = params.candidate.replace(/\\/g, "/");
	if (normalized === params.containerWorkdir) return path.resolve(params.sandboxRoot);
	const prefix = params.containerWorkdir === "/" ? "/" : `${params.containerWorkdir}/`;
	if (!normalized.startsWith(prefix)) return;
	const rel = normalized.slice(prefix.length);
	if (!rel) return path.resolve(params.sandboxRoot);
	return path.resolve(params.sandboxRoot, ...rel.split("/").filter(Boolean));
}
async function resolveAllowedTmpMediaPath(params) {
	if (!hostPathLooksAbsolute(normalizeSandboxInputPath(params.candidate))) return;
	const resolved = path.resolve(resolveSandboxInputPath(params.candidate, params.sandboxRoot));
	const openClawTmpDir = path.resolve(resolvePreferredOpenClawTmpDir());
	if (!isPathInside(openClawTmpDir, resolved)) return;
	await assertNoTmpAliasEscape({
		filePath: resolved,
		tmpRoot: openClawTmpDir
	});
	return resolved;
}
async function assertNoTmpAliasEscape(params) {
	await assertNoPathAliasEscape({
		absolutePath: params.filePath,
		rootPath: params.tmpRoot,
		boundaryLabel: "tmp root"
	});
}
//#endregion
export { markHostRootEscape as a, resolveAllowedManagedMediaPath as c, resolveSandboxPath as d, resolveSandboxedMediaSource as f, isPathBoundaryEscapeError as i, resolveManagedMediaRoot as l, assertSandboxPath as n, normalizeFileReferencePrefix as o, isHostRootEscapeError as r, normalizeSandboxInputPath as s, assertMediaNotDataUrl as t, resolveSandboxInputPath as u };
