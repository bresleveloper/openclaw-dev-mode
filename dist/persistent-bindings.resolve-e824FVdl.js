import { a as resolveConfiguredAcpBindingSpecFromRecord, s as toResolvedConfiguredAcpBinding } from "./persistent-bindings.types-D8uY9PdP.js";
import { i as resolveConfiguredBindingRecordBySessionKey, r as resolveConfiguredBindingRecord } from "./binding-registry-w9ub3tXx.js";
//#region src/acp/persistent-bindings.resolve.ts
/** Resolves configured channel conversation bindings into ACP session binding specs. */
/** Resolves a configured ACP binding for a concrete channel conversation. */
function resolveConfiguredAcpBindingRecord(params) {
	const resolved = resolveConfiguredBindingRecord(params);
	return resolved ? toResolvedConfiguredAcpBinding(resolved.record) : null;
}
/** Resolves the configured ACP binding spec that owns a generated session key. */
function resolveConfiguredAcpBindingSpecBySessionKey(params) {
	const resolved = resolveConfiguredBindingRecordBySessionKey(params);
	return resolved ? resolveConfiguredAcpBindingSpecFromRecord(resolved.record) : null;
}
//#endregion
export { resolveConfiguredAcpBindingSpecBySessionKey as n, resolveConfiguredAcpBindingRecord as t };
