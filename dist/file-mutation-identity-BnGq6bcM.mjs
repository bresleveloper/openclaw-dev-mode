import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { a as normalizeWindowsPathForComparison } from "./path-guards-D5kuI0Tv.mjs";
import path from "node:path";
//#region src/agents/sandbox/file-mutation-identity.ts
const SANDBOX_FILE_IDENTITY = Symbol.for("openclaw.sandboxFileIdentity");
function hasSandboxFileIdentity(bridge) {
	return SANDBOX_FILE_IDENTITY in bridge;
}
async function resolveSandboxFileIdentity(params) {
	let identity;
	if (hasSandboxFileIdentity(params.bridge)) identity = await params.bridge[SANDBOX_FILE_IDENTITY]({
		filePath: params.filePath,
		cwd: params.cwd,
		signal: params.signal
	});
	else {
		const resolved = params.bridge.resolvePath({
			filePath: params.filePath,
			cwd: params.cwd
		});
		const containerPath = resolved.containerPath;
		identity = resolved.hostPath ? resolveIdentityPathViaExistingAncestorSync(resolved.hostPath) : !containerPath.startsWith("/") && path.win32.isAbsolute(containerPath) ? normalizeWindowsPathForComparison(containerPath) : path.posix.normalize(containerPath);
	}
	return identity;
}
async function resolveSandboxFileMutationQueueKey(params) {
	return `${params.root}\0${await resolveSandboxFileIdentity(params)}`;
}
//#endregion
export { resolveSandboxFileIdentity as n, resolveSandboxFileMutationQueueKey as r, SANDBOX_FILE_IDENTITY as t };
