import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { n as captureChannelReadScope } from "./channel-read-authority-DeXfvJjt.mjs";
import { a as deleteClaimedManagedImageRecord, i as claimManagedImageRecordCleanupIfCurrent, o as insertManagedImageRecord, r as captureManagedImageContext } from "./managed-image-record-store-bCbJK0yf.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/gateway/managed-image-attachments.custody.ts
function resolveManagedImageOriginalPath(record) {
	if (!path.isAbsolute(record.original.mediaRoot) || record.original.mediaSubdir !== "outgoing/originals" || !record.original.mediaId || record.original.mediaId.includes("/") || record.original.mediaId.includes("\\") || record.original.mediaId.includes("\0")) throw new Error("Managed image record has an unsafe media identity");
	return path.join(record.original.mediaRoot, record.original.mediaSubdir, record.original.mediaId);
}
async function deleteManagedImageRecordArtifacts(record, stateDir = resolveStateDir(), alreadyClaimed = false, context = captureManagedImageContext(stateDir)) {
	if (!alreadyClaimed && !await claimManagedImageRecordCleanupIfCurrent(record, stateDir, context)) return {
		deletedRecord: false,
		deletedFileCount: 0
	};
	context.admission.assertCurrent();
	try {
		await fs.rm(resolveManagedImageOriginalPath(record), { force: true });
	} catch {
		return {
			deletedRecord: false,
			deletedFileCount: 0
		};
	}
	return {
		deletedRecord: await deleteClaimedManagedImageRecord(record, stateDir, context),
		deletedFileCount: 1
	};
}
async function insertManagedImageRecordWithFile(record, originalPath, stateDir, context) {
	const readScope = captureChannelReadScope();
	let settlement;
	if (readScope && !readScope.delegateResource(originalPath, (accepted, settleFile) => settlement ??= (async () => {
		try {
			await insertion;
		} catch (error) {
			await settleFile(hasSqliteWorkerOutcomeUnknown(error));
			return;
		}
		if (accepted) {
			await settleFile(true);
			return;
		}
		let claimed = false;
		try {
			const applied = await claimManagedImageRecordCleanupIfCurrent(record, stateDir, context);
			context.admission.assertCurrent();
			claimed = applied;
		} finally {
			await settleFile(!claimed);
		}
		if (claimed) try {
			await fs.lstat(originalPath);
		} catch (error) {
			if (error instanceof Error && "code" in error && error.code === "ENOENT") {
				await deleteClaimedManagedImageRecord(record, stateDir, context);
				return;
			}
			throw error;
		}
	})(), context.admission.assertCurrent)) throw new Error("Managed media has no retained file resource");
	const insertion = insertManagedImageRecord(record, stateDir, context);
	await insertion;
}
//#endregion
export { insertManagedImageRecordWithFile as n, resolveManagedImageOriginalPath as r, deleteManagedImageRecordArtifacts as t };
