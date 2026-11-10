import { d as normalizeResolvedSecretInputString, o as hasConfiguredSecretInput } from "./types.secrets-Dgbd2kyP.mjs";
import "./openclaw-runtime-config-lzhVqdXX.mjs";
//#region packages/memory-host-sdk/src/host/secret-input.ts
/** Return true when a configured memory secret contains a literal value or reference. */
function hasConfiguredMemorySecretInput(value) {
	return hasConfiguredSecretInput(value);
}
/** Consume a secret value that the gateway runtime snapshot already resolved. */
function resolveMemorySecretInputString(params) {
	const resolved = normalizeResolvedSecretInputString(params);
	if (params.value !== void 0 && typeof params.value !== "string") throw new Error(`${params.path}: expected a resolved string value.`);
	return resolved;
}
//#endregion
export { resolveMemorySecretInputString as n, hasConfiguredMemorySecretInput as t };
