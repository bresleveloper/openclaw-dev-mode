import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { a as safeFileURLToPath } from "./local-file-access-B6bU8SNO.mjs";
import { n as assertSandboxPath } from "./sandbox-paths-BZ4BvxS2.mjs";
import { t as createBoundedOutboundMediaReadFile } from "./bounded-read-file-BXBH3Nms.mjs";
import { l as resolveMediaReferenceSandboxPath } from "./media-reference-CtGDBk0x.mjs";
import { n as normalizeContainerPathCore, t as isPathInsideContainerRoot } from "./path-utils-Drbu0ZHc.mjs";
import path from "node:path";
//#region src/agents/sandbox-media-paths.ts
/**
* Sandbox media path resolution helpers.
*
* Bridges media references through sandbox filesystems while enforcing workspace-only boundaries when required.
*/
function createSandboxBridgeReadFile(params) {
	return createBoundedOutboundMediaReadFile(async (filePath, options) => await params.sandbox.bridge.readFile({
		filePath,
		cwd: params.sandbox.root,
		maxBytes: options?.maxBytes
	}));
}
async function resolveSandboxedBridgeMediaPath(params) {
	const mediaPathInfo = params.inboundFallbackDir ? resolveMediaReferenceSandboxPath(params.mediaPath, params.inboundFallbackDir) : { resolved: params.mediaPath };
	let filePath = /^file:/iu.test(mediaPathInfo.resolved) ? safeFileURLToPath(mediaPathInfo.resolved, "linux") : mediaPathInfo.resolved;
	let rewrittenFrom = mediaPathInfo.rewrittenFrom;
	const stagedMediaPath = rewrittenFrom ? void 0 : params.sandbox.stagedMediaPaths?.get(filePath);
	if (stagedMediaPath) {
		if (!await params.sandbox.bridge.stat({
			filePath,
			cwd: params.sandbox.root
		})) {
			rewrittenFrom = filePath;
			filePath = stagedMediaPath;
		}
	}
	if (rewrittenFrom) {
		if (!await params.sandbox.bridge.stat({
			filePath,
			cwd: params.sandbox.root
		})) throw new Error(`Sandbox media reference is not staged: ${rewrittenFrom}`);
	}
	const enforceWorkspaceBoundary = async (resolved) => {
		if (!params.sandbox.workspaceOnly) return;
		if (params.sandbox.readOnlyResourceMounts?.some((mount) => resolved.hostPath ? isPathInside(mount.hostPath, resolved.hostPath) : isPathInsideContainerRoot(normalizeContainerPathCore(mount.containerPath), normalizeContainerPathCore(resolved.containerPath)))) return;
		if (resolved.hostPath) {
			await assertSandboxPath({
				filePath: resolved.hostPath,
				cwd: params.sandbox.root,
				root: params.sandbox.root
			});
			return;
		}
		const workspaceRoot = params.sandbox.bridge.resolvePath({
			filePath: params.sandbox.root,
			cwd: params.sandbox.root
		});
		if (!isPathInsideContainerRoot(normalizeContainerPathCore(workspaceRoot.containerPath), normalizeContainerPathCore(resolved.containerPath))) throw new Error(`Sandbox path escapes workspace root: ${resolved.containerPath}`);
	};
	const resolveDirect = () => params.sandbox.bridge.resolvePath({
		filePath,
		cwd: params.sandbox.root
	});
	try {
		const resolved = resolveDirect();
		await enforceWorkspaceBoundary(resolved);
		return {
			resolved: resolved.hostPath ?? resolved.containerPath,
			...rewrittenFrom ? { rewrittenFrom } : {}
		};
	} catch (err) {
		const fallbackDir = params.inboundFallbackDir?.trim();
		if (!fallbackDir) throw err;
		const fallbackPath = path.join(fallbackDir, path.basename(filePath));
		try {
			if (!await params.sandbox.bridge.stat({
				filePath: fallbackPath,
				cwd: params.sandbox.root
			})) throw err;
		} catch {
			throw err;
		}
		const resolvedFallback = params.sandbox.bridge.resolvePath({
			filePath: fallbackPath,
			cwd: params.sandbox.root
		});
		await enforceWorkspaceBoundary(resolvedFallback);
		return {
			resolved: resolvedFallback.hostPath ?? resolvedFallback.containerPath,
			rewrittenFrom: filePath
		};
	}
}
//#endregion
export { resolveSandboxedBridgeMediaPath as n, createSandboxBridgeReadFile as t };
