import { n as appendRegularFile } from "./fs-safe-BAPek8At.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region extensions/file-transfer/src/shared/audit.ts
let auditDirPromise = null;
async function ensureAuditDir() {
	if (auditDirPromise) return auditDirPromise;
	const promise = (async () => {
		const dir = path.join(os.homedir(), ".openclaw", "audit");
		await fs.mkdir(dir, {
			recursive: true,
			mode: 448
		});
		return dir;
	})();
	promise.catch(() => {
		if (auditDirPromise === promise) auditDirPromise = null;
	});
	auditDirPromise = promise;
	return promise;
}
function auditFilePath(dir) {
	return path.join(dir, "file-transfer.jsonl");
}
/**
* Append an audit record. Best-effort — failures are logged through console capture and
* never propagated to the caller (the caller's operation is the source of
* truth, not the audit write).
*/
async function appendFileTransferAudit(record) {
	try {
		const dir = await ensureAuditDir();
		const line = `${JSON.stringify({
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			...record
		})}\n`;
		await appendRegularFile({
			filePath: auditFilePath(dir),
			content: line,
			rejectSymlinkParents: true
		});
	} catch (e) {
		console.warn(`[file-transfer:audit] append failed: ${String(e)}`);
	}
}
//#endregion
export { appendFileTransferAudit as t };
