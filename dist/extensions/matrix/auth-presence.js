import { i as normalizeMatrixStoredCredentials, t as MATRIX_CREDENTIALS_NAMESPACE } from "./.setup/credentials-state-jxq29yQw.mjs";
import { createPluginStateKeyedStore, createPluginStateSyncKeyedStore } from "openclaw/plugin-sdk/plugin-state-store-runtime";
// extensions/matrix/auth-presence.ts
/** @deprecated Use hasAnyMatrixAuthAsync. Final compatibility day: 2026-12-31. Removal in the first January 2027 stable release. */
function hasAnyMatrixAuth(params, env = process.env) {
	const resolvedEnv = params && typeof params === "object" && "cfg" in params ? params.env ?? env : env;
	try {
		return createPluginStateSyncKeyedStore("matrix", {
			namespace: MATRIX_CREDENTIALS_NAMESPACE,
			maxEntries: 256,
			overflowPolicy: "reject-new",
			env: resolvedEnv
		}).entries().some((entry) => normalizeMatrixStoredCredentials(entry.value) !== null);
	} catch {
		return false;
	}
}
async function hasAnyMatrixAuthAsync(params, env = process.env) {
	const resolvedEnv = params && typeof params === "object" && "cfg" in params ? params.env ?? env : env;
	try {
		return (await createPluginStateKeyedStore("matrix", {
			namespace: MATRIX_CREDENTIALS_NAMESPACE,
			maxEntries: 256,
			overflowPolicy: "reject-new",
			env: resolvedEnv
		}).entries()).some((entry) => normalizeMatrixStoredCredentials(entry.value) !== null);
	} catch {
		return false;
	}
}
export { hasAnyMatrixAuth, hasAnyMatrixAuthAsync };
