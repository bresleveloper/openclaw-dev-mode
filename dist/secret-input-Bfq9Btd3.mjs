import { d as normalizeResolvedSecretInputString, o as hasConfiguredSecretInput } from "./types.secrets-DsPRn9Dz.mjs";
import "./openclaw-runtime-config-CzdtWiHB.mjs";
//#region packages/memory-host-sdk/src/host/secret-input.ts
/** Return true when a configured memory secret contains a literal value or reference. */
function hasConfiguredMemorySecretInput(value) {
	return hasConfiguredSecretInput(value);
}
/** Consume a secret value that the gateway runtime snapshot already resolved. */
function resolveMemorySecretInputString(params) {
	return normalizeResolvedSecretInputString(params);
}
//#endregion
export { resolveMemorySecretInputString as n, hasConfiguredMemorySecretInput as t };
