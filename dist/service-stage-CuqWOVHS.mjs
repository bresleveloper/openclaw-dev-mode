import { Et as _enum, Jn as string, Nt as array, Pn as number, lr as uuid, qn as strictObject } from "./schemas-BOYIvvln.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as replaceFileAtomic } from "./replace-file-DJtj9VLX.mjs";
import { i as assertGatewayServiceUpdateCurrent } from "./service-update-authority-DujRnzx9.mjs";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash } from "node:crypto";
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
const definitionFile = strictObject({ files: array(strictObject({
	sourcePath: string().max(4096).refine(path.isAbsolute),
	before: fileState.nullable(),
	after: fileState
})).min(1).max(16) }).shape.files.element.extend({
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
/** Keep the live file runnable until a complete replacement is ready. */
async function publishServiceFile(params) {
	const hooks = params.definitionTransaction;
	const dirMode = (await fs$1.stat(path.dirname(params.filePath))).mode & 4095;
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
			...fs$1,
			rename: async (temporary, target) => {
				await params.beforeRename?.();
				await hooks?.beforeWrite();
				await hooks?.filePrepared(params.filePath, String(temporary));
				assertGatewayServiceUpdateCurrent();
				hooks?.assertCurrent();
				params.assertCurrent?.();
				await fs$1.rename(temporary, target);
			}
		} }
	});
	await hooks?.fileWritten(params.filePath, params.contents);
}
/** Read one stable regular file; publication owners compare it to retained write facts. */
async function readServiceFileState(file) {
	const before = await fs$1.lstat(file).catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw error;
	});
	if (!before) return null;
	if (!before.isFile()) throw new Error("Managed service artifact is not a regular file.");
	const handle = await fs$1.open(file, constants.O_RDONLY | constants.O_NOFOLLOW);
	try {
		const opened = await handle.stat();
		const keys = [
			"dev",
			"ino",
			"size",
			"mtimeMs",
			"ctimeMs",
			"mode"
		];
		if (!opened.isFile() || keys.some((key) => before[key] !== opened[key])) throw new Error("Managed service artifact changed before inspection.");
		const contents = await handle.readFile();
		const after = await handle.stat();
		const current = await fs$1.lstat(file);
		if (keys.some((key) => before[key] !== after[key] || after[key] !== current[key])) throw new Error("Managed service artifact changed during inspection.");
		return {
			sha256: createHash("sha256").update(contents).digest("hex"),
			mode: after.mode & 4095,
			dev: after.dev,
			ino: after.ino,
			size: after.size,
			mtimeMs: after.mtimeMs,
			ctimeMs: after.ctimeMs
		};
	} finally {
		await handle.close();
	}
}
//#endregion
export { publishServiceFile as n, readServiceFileState as r, GatewayServiceDefinitionBackupReceiptSchema as t };
