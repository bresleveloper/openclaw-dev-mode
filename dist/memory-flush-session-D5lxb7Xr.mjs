import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-Cef06Gbk.mjs";
import { n as resolveInternalSessionEffectsIdentity } from "./internal-session-key-Xwd1VHk2.mjs";
import { o as withSessionContextAdmission } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { i as MAX_VISIBLE_MESSAGE_MAX_MESSAGES, r as MAX_VISIBLE_MESSAGE_MAX_BYTES } from "./session-accessor.sqlite-visible-cursor-BfibSXF5.mjs";
import { t as SessionManager } from "./session-manager-Bb7qQp5M.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/auto-reply/reply/memory-flush-session.ts
/** Memory inference owns a detached view; an admission excludes its waiting user. */
async function prepareMemoryFlushSession(params) {
	params.signal?.throwIfAborted();
	await waitForSessionTranscriptProjection(params.source, params.signal);
	params.signal?.throwIfAborted();
	const sessionManager = await withSessionContextAdmission(params.source, params.admission, () => SessionManager.openDetachedBoundedAsync(params.source, {
		signal: params.signal,
		cwd: params.workspaceDir,
		maxBytes: MAX_VISIBLE_MESSAGE_MAX_BYTES,
		maxEvents: MAX_VISIBLE_MESSAGE_MAX_MESSAGES,
		onTruncated: () => {
			throw new Error("Memory flush exceeds the bounded conversation view.");
		}
	}));
	const identity = resolveInternalSessionEffectsIdentity({
		agentId: params.source.agentId,
		runId: params.runId
	});
	return {
		...identity,
		sessionFile: identity.sessionKey,
		sessionTarget: {
			agentId: params.source.agentId,
			storePath: params.source.storePath,
			...identity
		},
		sessionManager,
		sessionPersistence: "detached",
		cleanupBundleMcpOnRunEnd: true
	};
}
async function ensureMemoryFlushTargetFile(params) {
	const workspaceDir = normalizeOptionalString(params.workspaceDir);
	const relativePath = normalizeOptionalString(params.relativePath);
	if (!workspaceDir || !relativePath || path.isAbsolute(relativePath)) throw new Error("Invalid memory flush target path");
	const workspaceRoot = path.resolve(workspaceDir);
	const targetPath = path.resolve(workspaceRoot, relativePath);
	const targetRelativePath = path.relative(workspaceRoot, targetPath);
	if (!targetRelativePath || targetRelativePath.startsWith("..") || path.isAbsolute(targetRelativePath)) throw new Error("Memory flush target path must stay inside the workspace");
	params.assertCurrent();
	await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
	params.assertCurrent();
	const handle = await fs.promises.open(targetPath, "a");
	try {
		params.assertCurrent();
	} finally {
		await handle.close();
	}
}
//#endregion
export { ensureMemoryFlushTargetFile, prepareMemoryFlushSession };
