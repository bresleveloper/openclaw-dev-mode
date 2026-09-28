import "./fs-safe-defaults-D3xd3zKO.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as tempWorkspace } from "./private-temp-workspace-DQFTMfun.mjs";
import path from "node:path";
import { buildRandomTempFilePath, sanitizeTempFileName } from "@openclaw/fs-safe/advanced";
//#region src/infra/temp-download.ts
const logger = createSubsystemLogger("infra:temp-download");
function resolveTempRoot(tmpDir) {
	return tmpDir ?? resolvePreferredOpenClawTmpDir();
}
function sanitizeTempPrefix(prefix) {
	return prefix.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "tmp";
}
/** Build a stable temp path shape while keeping caller-controlled text filename-safe. */
function buildRandomTempFilePath$1(params) {
	const rootDir = resolveTempRoot(params.tmpDir);
	const filePath = buildRandomTempFilePath({
		...params,
		rootDir,
		uuid: params.uuid?.trim() || void 0
	});
	return path.join(rootDir, path.basename(filePath));
}
async function createTempDownloadTarget(params) {
	const workspace = await tempWorkspace({
		rootDir: resolveTempRoot(params.tmpDir),
		prefix: sanitizeTempPrefix(params.prefix)
	});
	const fileName = params.fileName;
	const file = (nextName) => workspace.path(sanitizeTempFileName(nextName ?? fileName ?? "download.bin"));
	const cleanup = async () => {
		try {
			await workspace.cleanup();
		} catch (err) {
			logger.warn(`temp-path cleanup failed: ${String(err)}`, { error: err });
		}
	};
	return {
		dir: workspace.dir,
		path: file(),
		file,
		cleanup,
		[Symbol.asyncDispose]: cleanup
	};
}
/** Run with a private temp download path and always attempt workspace cleanup. */
async function withTempDownloadPath(params, fn) {
	const target = await createTempDownloadTarget(params);
	try {
		return await fn(target.path);
	} finally {
		await target.cleanup();
	}
}
//#endregion
export { withTempDownloadPath as i, createTempDownloadTarget as n, sanitizeTempFileName as r, buildRandomTempFilePath$1 as t };
