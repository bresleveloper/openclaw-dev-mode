import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { Et as _enum, Jn as string, Nt as array, Pn as number, lr as uuid, qn as strictObject } from "./schemas-BOYIvvln.mjs";
import { i as assertGatewayServiceUpdateCurrent } from "./service-update-authority-CoX8GMUL.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { readRegularFile } from "@openclaw/fs-safe/advanced";
import { replaceFileAtomic } from "@openclaw/fs-safe/atomic";
//#region src/daemon/service-stage.ts
/** Native writer facts are evidence, never serialized lifecycle authority. */
const fileState = strictObject({
	sha256: string().regex(/^[a-f0-9]{64}$/),
	mode: number().int().nonnegative(),
	dev: number().nonnegative(),
	ino: number().nonnegative(),
	size: number().int().nonnegative(),
	mtimeMs: number().finite(),
	ctimeMs: number().finite()
});
const definitionFile = strictObject({
	sourcePath: string().max(4096).refine(path.isAbsolute),
	before: fileState.nullable(),
	after: fileState.nullable(),
	prepared: fileState.nullable().optional()
});
const GatewayServiceDefinitionBackupReceiptSchema = strictObject({
	id: uuid(),
	files: array(definitionFile).min(1).max(4),
	guards: array(definitionFile.pick({
		sourcePath: true,
		after: true
	})),
	task: strictObject({
		beforeSha256: fileState.shape.sha256,
		afterPolicySha256: fileState.shape.sha256,
		preparedXml: string().min(1).optional(),
		recoveredPolicy: _enum(["previous", "prepared"]).optional()
	}).optional()
});
/** Rename can change ctime; the staged inode and payload identify the publication. */
function matchesServiceFilePublication(current, prepared) {
	return current !== null && [
		"dev",
		"ino",
		"sha256",
		"mode",
		"size",
		"mtimeMs"
	].every((key) => current[key] === prepared[key]);
}
/** Keep the live file runnable until a complete replacement is ready. */
async function publishServiceFile(params) {
	const hooks = params.definitionTransaction;
	const dirMode = (await fs.stat(path.dirname(params.filePath))).mode & 4095;
	assertGatewayServiceUpdateCurrent();
	await replaceFileAtomic({
		filePath: params.filePath,
		content: params.contents,
		mode: params.mode,
		dirMode,
		tempPrefix: `.${path.basename(params.filePath)}.openclaw`,
		syncTempFile: true,
		syncParentDir: true,
		copyFallbackOnPermissionError: false,
		fileSystem: { promises: {
			...fs,
			rename: async (temporary, target) => {
				await params.beforeRename?.();
				await hooks?.beforeWrite();
				await hooks?.filePrepared(params.filePath, String(temporary));
				assertGatewayServiceUpdateCurrent();
				hooks?.assertCurrent();
				params.assertCurrent?.();
				await fs.rename(temporary, target);
			}
		} }
	});
	await hooks?.fileWritten(params.filePath, params.contents);
}
/** Read one regular file; publication owners compare it to retained write facts. */
async function readServiceFileState(file) {
	const before = await fs.lstat(file).catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw error;
	});
	if (!before) return null;
	if (!before.isFile()) throw new Error("Managed service artifact is not a regular file.");
	const { buffer: contents, stat: opened } = await readRegularFile({ filePath: file });
	const keys = [
		"dev",
		"ino",
		"mode"
	];
	if (keys.some((key) => before[key] !== opened[key])) throw new Error("Managed service artifact changed before inspection.");
	const current = await fs.lstat(file);
	if (keys.some((key) => opened[key] !== current[key])) throw new Error("Managed service artifact changed during inspection.");
	return {
		sha256: sha256Hex(contents),
		mode: opened.mode & 4095,
		dev: opened.dev,
		ino: opened.ino,
		size: contents.byteLength,
		mtimeMs: opened.mtimeMs,
		ctimeMs: opened.ctimeMs
	};
}
//#endregion
export { readServiceFileState as i, matchesServiceFilePublication as n, publishServiceFile as r, GatewayServiceDefinitionBackupReceiptSchema as t };
