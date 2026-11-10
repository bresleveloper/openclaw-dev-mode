import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as isNotFoundPathError } from "./path-guards-CH7noY0Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
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
