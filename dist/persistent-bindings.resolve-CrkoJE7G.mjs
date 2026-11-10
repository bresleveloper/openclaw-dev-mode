import { a as resolveConfiguredAcpBindingSpecFromRecord } from "./persistent-bindings.types-Deh63P2t.mjs";
import { n as resolveConfiguredBindingRecord, r as resolveConfiguredBindingRecordBySessionKey } from "./configured-binding-registry-QGs3UeEc.mjs";
//#region src/acp/persistent-bindings.resolve.ts
function resolveConfiguredAcpBindingRecord(params) {
	const resolved = resolveConfiguredBindingRecord(params);
	if (!resolved) return null;
	const spec = resolveConfiguredAcpBindingSpecFromRecord(resolved.record);
	return spec ? {
		spec,
		record: resolved.record
	} : null;
}
function resolveConfiguredAcpBindingSpecBySessionKey(params) {
	const resolved = resolveConfiguredBindingRecordBySessionKey(params);
	return resolved ? resolveConfiguredAcpBindingSpecFromRecord(resolved.record) : null;
}
//#endregion
export { resolveConfiguredAcpBindingSpecBySessionKey as n, resolveConfiguredAcpBindingRecord as t };
