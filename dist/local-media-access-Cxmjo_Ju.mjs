import { s as readFileHandleBounded } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as FsSafeError, u as openLocalFileSafely } from "./fs-safe-BAPek8At.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { r as isDevMode } from "./globals-QODkv80i.mjs";
import { t as assertNoWindowsNetworkPath } from "./local-file-access-B6bU8SNO.mjs";
import { a as resolveInboundPathRoot } from "./inbound-path-policy-DQ5Rksw7.mjs";
import { n as captureChannelReadScope } from "./channel-read-authority-CLJnqxr1.mjs";
import { i as getDefaultMediaLocalRoots } from "./local-roots-CfRBR4Iu.mjs";
import { o as resolveInboundMediaReference, t as MediaReferenceError } from "./media-reference-CtGDBk0x.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/media/local-media-access.ts
/** Error raised when a local media path escapes the configured allowlist. */
var LocalMediaAccessError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.code = code;
		this.name = "LocalMediaAccessError";
	}
};
/**
* Lets core classify rejected content without changing loadWebMedia's public error code.
* Removing this boundary would make detailed reply outcomes break plugin error handling.
*/
var HostReadMediaTypeError = class extends LocalMediaAccessError {
	constructor(message) {
		super("path-not-allowed", message);
	}
};
/** Returns the default root allowlist for local media reads. */
function getDefaultLocalRootsCore() {
	return getDefaultMediaLocalRoots();
}
async function resolveCanonicalBoundaryPath(root) {
	const resolved = path.resolve(root);
	try {
		return await fs.realpath(resolved);
	} catch {
		return resolved;
	}
}
/** Resolves an allowlist once for callers that validate several media paths. */
async function resolveLocalMediaRoots(localRoots) {
	const roots = localRoots ?? getDefaultLocalRootsCore();
	return await Promise.all(roots.map(async (root) => {
		const resolvedRoot = await resolveCanonicalBoundaryPath(root);
		if (resolvedRoot === path.parse(resolvedRoot).root) throw new LocalMediaAccessError("invalid-root", `Invalid localRoots entry (refuses filesystem root): ${root}. Pass a narrower directory.`);
		return resolvedRoot;
	}));
}
async function resolveLocalMediaPathForContainment(mediaPath) {
	try {
		return await fs.realpath(mediaPath);
	} catch {
		try {
			return path.join(await fs.realpath(path.dirname(mediaPath)), path.basename(mediaPath));
		} catch {
			return path.resolve(mediaPath);
		}
	}
}
async function resolveLocalMediaBoundary(mediaPath, localRoots, managedReferenceErrors, options) {
	if (localRoots === "any" || isDevMode()) return {
		rejectHardlinks: false,
		roots: "any"
	};
	let inboundReference;
	try {
		inboundReference = await resolveInboundMediaReference(mediaPath);
	} catch (err) {
		if (managedReferenceErrors === "reject" && err instanceof MediaReferenceError) throw new LocalMediaAccessError(err.code, err.message, { cause: err });
		if (!(err instanceof MediaReferenceError)) throw err;
	}
	if (inboundReference) return {
		rejectHardlinks: true,
		roots: await resolveLocalMediaRoots([path.dirname(inboundReference.physicalPath)])
	};
	try {
		assertNoWindowsNetworkPath(mediaPath, "Local media path");
	} catch (err) {
		throw new LocalMediaAccessError("network-path-not-allowed", err.message, { cause: err });
	}
	const matchedInboundRoot = options?.inboundRoots?.length ? resolveInboundPathRoot({
		filePath: mediaPath,
		roots: options.inboundRoots
	}) : void 0;
	if (matchedInboundRoot) {
		const resolvedAnchor = await resolveCanonicalBoundaryPath(matchedInboundRoot.anchorRoot);
		const resolvedRoot = await resolveCanonicalBoundaryPath(matchedInboundRoot.matchedRoot);
		if (!isPathInside(resolvedAnchor, resolvedRoot)) throw new LocalMediaAccessError("path-not-allowed", `Local media path is not under an allowed directory: ${mediaPath}`);
		return {
			rejectHardlinks: true,
			roots: [resolvedRoot]
		};
	}
	const roots = localRoots ?? getDefaultLocalRootsCore();
	const resolved = await resolveLocalMediaPathForContainment(mediaPath);
	const resolvedRoots = options?.resolvedRoots ?? await options?.resolveRoots?.() ?? await resolveLocalMediaRoots(roots);
	const workspaceRoot = roots[roots.findIndex((root) => path.basename(root) === "workspace")];
	if (workspaceRoot) {
		const stateDir = await resolveCanonicalBoundaryPath(path.dirname(workspaceRoot));
		const rel = path.relative(stateDir, resolved);
		const firstSegment = rel.split(path.sep)[0] ?? "";
		if (rel && isPathInside(stateDir, resolved) && firstSegment.startsWith("workspace-")) {
			const agentWorkspace = path.join(stateDir, firstSegment);
			if (!(localRoots !== void 0 && resolvedRoots.some((root) => isPathInside(agentWorkspace, root) && isPathInside(root, resolved)))) throw new LocalMediaAccessError("path-not-allowed", `Local media path is not under an allowed directory: ${mediaPath}`);
		}
	}
	for (const [index, resolvedRoot] of resolvedRoots.entries()) {
		const root = roots[index] ?? resolvedRoot;
		if (resolvedRoot === path.parse(resolvedRoot).root) throw new LocalMediaAccessError("invalid-root", `Invalid localRoots entry (refuses filesystem root): ${root}. Pass a narrower directory.`);
		if (isPathInside(resolvedRoot, resolved)) return {
			rejectHardlinks: false,
			roots: resolvedRoots
		};
	}
	throw new LocalMediaAccessError("path-not-allowed", `Local media path is not under an allowed directory: ${mediaPath}`);
}
/** Verifies that a local media path is managed inbound media or lives under allowed roots. */
async function assertLocalMediaAllowed(mediaPath, localRoots, options) {
	await resolveLocalMediaBoundary(mediaPath, localRoots, "ignore", options);
}
/** Opens, revalidates, and bounded-reads local media against one frozen root boundary. */
async function readLocalMediaFile(mediaPath, localRoots, options) {
	const readScope = captureChannelReadScope();
	readScope?.assertCurrent();
	const boundary = await resolveLocalMediaBoundary(mediaPath, localRoots, "reject", options);
	const excludedRoots = options.excludedRoots?.length ? await resolveLocalMediaRoots(options.excludedRoots) : [];
	readScope?.assertCurrent();
	const opened = await openLocalFileSafely({ filePath: mediaPath });
	try {
		if (excludedRoots.some((root) => isPathInside(root, opened.realPath))) throw new LocalMediaAccessError("path-not-allowed", `Local media path belongs to a remote workspace: ${mediaPath}`);
		if (boundary.roots !== "any" && !boundary.roots.some((resolvedRoot) => isPathInside(resolvedRoot, opened.realPath))) throw new LocalMediaAccessError("path-not-allowed", `Local media path is not under an allowed directory: ${mediaPath}`);
		if (boundary.rejectHardlinks && opened.stat.nlink > 1) throw new FsSafeError("hardlink", "hardlinked path not allowed");
		if (opened.stat.size > options.maxBytes) throw new FsSafeError("too-large", `file exceeds limit of ${options.maxBytes} bytes (got ${opened.stat.size})`);
		if (!readScope) return await readFileHandleBounded(opened.handle, options.maxBytes);
		const guardedHandle = {
			fd: opened.handle.fd,
			async read(bufferOrOptions, offsetOrOptions, length, position) {
				readScope.assertCurrent();
				const result = ArrayBuffer.isView(bufferOrOptions) ? typeof offsetOrOptions === "object" && offsetOrOptions !== null ? await opened.handle.read(bufferOrOptions, offsetOrOptions) : await opened.handle.read(bufferOrOptions, offsetOrOptions, length, position) : await opened.handle.read(bufferOrOptions);
				readScope.assertCurrent();
				return result;
			}
		};
		return await readFileHandleBounded(guardedHandle, options.maxBytes);
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
//#endregion
export { readLocalMediaFile as a, getDefaultLocalRootsCore as i, LocalMediaAccessError as n, resolveLocalMediaRoots as o, assertLocalMediaAllowed as r, HostReadMediaTypeError as t };
