import { m as resolveSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import { t as canResolveEnvSecretRefInReadOnlyPath } from "./secret-ref-readonly.internal-DPtRYfnc.mjs";
//#region src/plugin-sdk/secret-ref-readonly.ts
/** Resolve one configured secret without letting blocked refs borrow ambient credentials. */
function resolveReadOnlyEnvSecretRef(params) {
	const resolved = resolveSecretInputString({
		value: params.value,
		path: params.path,
		defaults: params.cfg?.secrets?.defaults,
		mode: "inspect"
	});
	if (resolved.status === "available") {
		const normalized = params.normalizeValue(resolved.value);
		return normalized ? {
			status: "available",
			value: normalized
		} : { status: "missing" };
	}
	if (resolved.status === "missing") return { status: "missing" };
	if (resolved.ref.source !== "env") return { status: "blocked" };
	const envId = resolved.ref.id.trim();
	if (envId !== params.expectedEnvId) return { status: "blocked" };
	if (!canResolveEnvSecretRefInReadOnlyPath({
		cfg: params.cfg,
		provider: resolved.ref.provider,
		id: envId
	})) return { status: "blocked" };
	const envValue = params.normalizeValue(process.env[envId]);
	return envValue ? {
		status: "available",
		value: envValue
	} : { status: "blocked" };
}
//#endregion
export { resolveReadOnlyEnvSecretRef as t };
