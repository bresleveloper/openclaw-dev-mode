import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as isNotFoundPathError } from "./path-guards-CH7noY0Z.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import { lstat } from "node:fs/promises";
//#region src/media/generated-html-provenance.ts
async function readGeneratedHtmlProvenance(context, command) {
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, command, {
		context,
		current: true
	});
	context.admission.assertCurrent();
	if (!reply) return;
	if (!reply.ok) {
		const error = new Error(reply.message);
		retainOpenClawStateWorkerErrorPayload(error, reply.error);
		throw hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
	}
	if (reply.type !== command.type) throw new Error("Unexpected generated HTML provenance reply");
	return reply;
}
async function writeGeneratedHtmlProvenance(context, command) {
	const captured = structuredClone(command);
	let admission;
	try {
		return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute(captured), { createAdmission: () => {
			admission = createSqliteWorkerOperationAdmission((_request, grant) => {
				context.admission.assertCurrent();
				grant();
			});
			return {
				admission,
				nativeLocations: [context.admission.databasePath]
			};
		} });
	} catch (error) {
		const receipt = admission?.committed ?? admission?.settlement?.committed;
		if (isRecord(receipt?.facts) && receipt.facts.type === captured.type && typeof receipt.facts.result === "number") return receipt.facts.result;
		throw error;
	}
}
async function pruneGeneratedHtmlProvenance(context) {
	const reply = await readGeneratedHtmlProvenance(context, {
		type: "generatedHtmlProvenance.list",
		input: void 0
	});
	const rows = reply?.type === "generatedHtmlProvenance.list" ? reply.rows : [];
	const stale = [];
	for (const row of rows) {
		let info;
		try {
			info = await lstat(row.realpath);
		} catch (error) {
			if (isNotFoundPathError(error)) stale.push(row);
			else logVerbose(`trusted-html prune kept uninspectable marker (${row.realpath}): ${formatErrorMessage(error)}`);
			continue;
		}
		if (!info?.isFile() || info.isSymbolicLink() || info.nlink !== 1) stale.push(row);
	}
	if (stale.length === 0) return;
	const removed = await writeGeneratedHtmlProvenance(context, {
		type: "generatedHtmlProvenance.prune",
		input: stale
	});
	logVerbose(`trusted-html prune removed ${removed} stale marker(s)`);
}
//#endregion
export { readGeneratedHtmlProvenance as n, writeGeneratedHtmlProvenance as r, pruneGeneratedHtmlProvenance as t };
