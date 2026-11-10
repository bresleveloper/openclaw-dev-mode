import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as hasSqliteCommitReceiptCoverage, t as createSqliteCommitReceipt } from "./sqlite-commit-receipt-DafgyYOc.mjs";
//#region src/gateway/worker-environments/store-receipt.ts
/** Each key replaces its entire environment, credential, and attachment set. */
function createWorkerEnvironmentReceipt(source, facts) {
	const environments = new Map(facts.environments.map((row) => [row.environmentId, row]));
	const credentials = new Map(facts.credentials.map((row) => [row.environmentId, row]));
	const attachments = new Map(facts.attachments.map((row) => [row.environmentId, row]));
	return createSqliteCommitReceipt({
		source,
		domain: "worker-environments",
		keys: facts.ids,
		readFact: (id) => ({
			kind: "postimage",
			value: {
				environment: environments.get(id) ?? null,
				credential: credentials.get(id) ?? null,
				attachment: attachments.get(id) ?? null,
				...facts.placements && { placements: facts.placements.filter((placement) => placement.environmentId === id) }
			}
		})
	});
}
function readWorkerEnvironmentReceipt(value, source, ids) {
	if (!hasSqliteCommitReceiptCoverage(value, {
		source,
		domain: "worker-environments",
		keys: ids
	}) || !isRecord(value) || !(value.facts instanceof Map)) throw new Error("Worker environment receipt has incomplete coverage");
	const facts = {
		ids: [...ids],
		environments: [],
		credentials: [],
		attachments: []
	};
	for (const id of ids) {
		const fact = value.facts.get(id);
		if (!isRecord(fact) || fact.kind !== "postimage" || !isRecord(fact.value)) throw new Error("Worker environment receipt has unknown facts");
		for (const field of [
			"environment",
			"credential",
			"attachment"
		]) {
			const row = fact.value[field];
			if (row === null) continue;
			if (!isRecord(row) || row.environmentId !== id) throw new Error("Worker environment receipt has a different row owner");
		}
		const postimage = fact.value;
		if (postimage.environment) facts.environments.push(postimage.environment);
		if (postimage.credential) facts.credentials.push(postimage.credential);
		if (postimage.attachment) facts.attachments.push(postimage.attachment);
		if (postimage.placements) {
			facts.placements ??= [];
			facts.placements.push(...postimage.placements);
		}
	}
	return facts;
}
//#endregion
export { readWorkerEnvironmentReceipt as n, createWorkerEnvironmentReceipt as t };
