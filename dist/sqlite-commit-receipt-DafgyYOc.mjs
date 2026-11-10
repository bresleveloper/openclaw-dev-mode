import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/sqlite-commit-receipt.ts
/** Capture from the transaction's postimages, without another database read. */
function createSqliteCommitReceipt(params) {
	return {
		version: 1,
		operationId: randomUUID(),
		source: params.source,
		domain: params.domain,
		facts: new Map([...new Set(params.keys)].map((key) => [key, params.readFact(key)]))
	};
}
/**
* Coverage is exact: an omitted key is unknown, never absence. Connection-local
* revisions and data_version are deliberately not compared across receipts.
*/
function hasSqliteCommitReceiptCoverage(receipt, expected) {
	if (!isRecord(receipt) || receipt.version !== 1 || typeof receipt.operationId !== "string" || !receipt.operationId || receipt.domain !== expected.domain || !isRecord(receipt.source) || receipt.source.identity !== expected.source.identity || receipt.source.incarnation !== expected.source.incarnation || !(receipt.facts instanceof Map)) return false;
	const keys = new Set(expected.keys);
	const facts = receipt.facts;
	return facts.size === keys.size && [...keys].every((key) => {
		const fact = facts.get(key);
		return isRecord(fact) && (fact.kind === "absent" || fact.kind === "unchanged" || fact.kind === "unknown" || fact.kind === "postimage" && "value" in fact);
	});
}
//#endregion
export { hasSqliteCommitReceiptCoverage as n, createSqliteCommitReceipt as t };
