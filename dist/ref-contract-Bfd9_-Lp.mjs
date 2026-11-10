import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/secrets/ref-contract.ts
/** Shared SecretRef grammar and validation helpers for config, schema, SDK, and gateway parity. */
/** Provider alias used when a SecretRef omits a source-specific provider. */
const DEFAULT_SECRET_PROVIDER_ALIAS = "default";
const ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
function isValidEnvSecretRefId(value) {
	return ENV_SECRET_REF_ID_RE.test(value);
}
function isSecretRef(value) {
	if (!isRecord(value)) return false;
	if (Object.keys(value).length !== 3) return false;
	return (value.source === "env" || value.source === "file" || value.source === "exec" || value.source === "store") && typeof value.provider === "string" && value.provider.trim().length > 0 && typeof value.id === "string" && value.id.trim().length > 0;
}
/**
* Runtime secret-reference grammar shared by config parsing, plugin SDK schemas,
* gateway parity checks, and resolver planning.
*/
const FILE_SECRET_REF_SEGMENT_PATTERN = /^(?:[^~]|~0|~1)*$/;
/** Shared alias grammar for env/file/exec/store secret provider names. */
const SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
const EXEC_SECRET_REF_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$/;
/** Canonical id for file secret providers that expose exactly one value. */
const SINGLE_VALUE_FILE_REF_ID = "value";
function secretRefKey(ref) {
	return `${ref.source}:${ref.provider}:${ref.id}`;
}
function resolveDefaultSecretProviderAlias(config, source, options) {
	const configured = config.secrets?.defaults?.[source];
	if (configured?.trim()) return configured.trim();
	if (options?.preferFirstProviderForSource) {
		const providers = config.secrets?.providers;
		if (providers) {
			for (const [providerName, provider] of Object.entries(providers)) if (provider?.source === source) return providerName;
		}
	}
	return DEFAULT_SECRET_PROVIDER_ALIAS;
}
function createGatewayEnvSecretRef(config, envVarName) {
	return {
		source: "env",
		provider: resolveDefaultSecretProviderAlias(config, "env", { preferFirstProviderForSource: true }),
		id: envVarName
	};
}
/** Whether a source-specific built-in provider owns this selected default alias. */
function isBuiltInDefaultSecretProviderRef(config, ref) {
	return config.secrets?.providers?.[ref.provider]?.source !== ref.source && (ref.source === "env" || ref.source === "store") && ref.provider === resolveDefaultSecretProviderAlias(config, ref.source);
}
/** Returns the configured provider source when a SecretRef selects an impossible pairing. */
function resolveSecretRefProviderSourceMismatch(config, ref) {
	const configuredSource = config.secrets?.providers?.[ref.provider]?.source;
	if (!configuredSource || configuredSource === ref.source || isBuiltInDefaultSecretProviderRef(config, ref)) return null;
	return configuredSource;
}
/** Validates file secret ref ids against the shared JSON-pointer-style contract. */
function isValidFileSecretRefId(value) {
	if (value === "value") return true;
	if (!value.startsWith("/")) return false;
	return value.slice(1).split("/").every((segment) => FILE_SECRET_REF_SEGMENT_PATTERN.test(segment));
}
function isValidSecretProviderAlias(value) {
	return SECRET_PROVIDER_ALIAS_PATTERN.test(value);
}
function validateExecSecretRefId(value) {
	if (!EXEC_SECRET_REF_ID_PATTERN.test(value)) return {
		ok: false,
		reason: "pattern"
	};
	for (const segment of value.split("/")) if (segment === "." || segment === "..") return {
		ok: false,
		reason: "traversal-segment"
	};
	return { ok: true };
}
function isValidExecSecretRefId(value) {
	return validateExecSecretRefId(value).ok;
}
function isValidSecretRef(ref) {
	if (!isSecretRef(ref)) return false;
	if (!isValidSecretProviderAlias(ref.provider)) return false;
	if (ref.source === "env" || ref.source === "store") return isValidEnvSecretRefId(ref.id);
	if (ref.source === "file") return isValidFileSecretRefId(ref.id);
	return isValidExecSecretRefId(ref.id);
}
function formatExecSecretRefIdValidationMessage() {
	return [
		"Exec secret reference id must match /^[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$/",
		"and must not include \".\" or \"..\" path segments",
		"(example: \"vault/openai/api-key\" or \"aws/secret#json_key\")."
	].join(" ");
}
function normalizeAndGroupSecretRefs(refs) {
	if (refs.length === 0) return [];
	const uniqueRefs = /* @__PURE__ */ new Map();
	for (const ref of refs) {
		const id = ref.id.trim();
		if (!id) throw new Error("Secret reference id is empty.");
		if (!isValidSecretProviderAlias(ref.provider)) throw new Error(`Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (ref: ${ref.source}:${ref.provider}:${id}).`);
		if ((ref.source === "env" || ref.source === "store") && !isValidEnvSecretRefId(id)) {
			const label = ref.source === "env" ? "Env" : "Store";
			throw new Error(`${label} secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (ref: ${ref.source}:${ref.provider}:${id}).`);
		}
		if (ref.source === "file" && !isValidFileSecretRefId(id)) throw new Error(`File secret reference id must be an absolute JSON pointer or "value" (ref: ${ref.source}:${ref.provider}:${id}).`);
		if (ref.source === "exec" && !isValidExecSecretRefId(id)) throw new Error(`${formatExecSecretRefIdValidationMessage()} (ref: ${ref.source}:${ref.provider}:${id}).`);
		uniqueRefs.set(secretRefKey(ref), {
			...ref,
			id
		});
	}
	const grouped = /* @__PURE__ */ new Map();
	for (const ref of uniqueRefs.values()) {
		const key = `${ref.source}:${ref.provider}`;
		const existing = grouped.get(key);
		if (existing) {
			existing.refs.push(ref);
			continue;
		}
		grouped.set(key, {
			source: ref.source,
			providerName: ref.provider,
			refs: [ref]
		});
	}
	return [...grouped.values()];
}
//#endregion
export { secretRefKey as _, createGatewayEnvSecretRef as a, isSecretRef as c, isValidFileSecretRefId as d, isValidSecretProviderAlias as f, resolveSecretRefProviderSourceMismatch as g, resolveDefaultSecretProviderAlias as h, SINGLE_VALUE_FILE_REF_ID as i, isValidEnvSecretRefId as l, normalizeAndGroupSecretRefs as m, ENV_SECRET_REF_ID_RE as n, formatExecSecretRefIdValidationMessage as o, isValidSecretRef as p, SECRET_PROVIDER_ALIAS_PATTERN as r, isBuiltInDefaultSecretProviderRef as s, DEFAULT_SECRET_PROVIDER_ALIAS as t, isValidExecSecretRefId as u, validateExecSecretRefId as v };
