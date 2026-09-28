import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { c as isSecretRef, n as ENV_SECRET_REF_ID_RE, t as DEFAULT_SECRET_PROVIDER_ALIAS } from "./ref-contract-BVi3ykLT.mjs";
//#region src/config/types.secrets.ts
/** Legacy env SecretRef marker retained for config migration/read compatibility. */
const LEGACY_SECRETREF_ENV_MARKER_PREFIX = "secretref-env:";
/** Older env SecretRef marker retained for migration/read compatibility. */
const LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX = "__env__:";
const ENV_SECRET_TEMPLATE_RE = /^\$\{([A-Z][A-Z0-9_]{0,127})\}$/;
const ENV_SECRET_SHORTHAND_RE = /^\$([A-Z][A-Z0-9_]{0,127})$/;
function isLegacySecretRefWithoutProvider(value) {
	if (!isRecord(value)) return false;
	return (value.source === "env" || value.source === "file" || value.source === "exec" || value.source === "store") && typeof value.id === "string" && value.id.trim().length > 0 && value.provider === void 0;
}
/** Parse `$NAME` and `${NAME}` env-secret shorthand strings into env SecretRefs. */
function parseEnvTemplateSecretRef(value, provider = DEFAULT_SECRET_PROVIDER_ALIAS) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	const match = ENV_SECRET_TEMPLATE_RE.exec(trimmed) ?? ENV_SECRET_SHORTHAND_RE.exec(trimmed);
	if (!match) return null;
	return {
		source: "env",
		provider: provider.trim() || "default",
		id: expectDefined(match[1], "types.secrets regex capture 1")
	};
}
/** Detect retired env SecretRef marker strings for migration and explicit rejection. */
function isLegacySecretRefEnvMarker(value) {
	if (typeof value !== "string") return false;
	const trimmed = value.trim();
	return trimmed.startsWith("secretref-env:") || trimmed.startsWith("__env__:");
}
/** Parse legacy env SecretRef marker strings for config migration. */
function parseLegacySecretRefEnvMarker(value, provider = DEFAULT_SECRET_PROVIDER_ALIAS) {
	if (!isLegacySecretRefEnvMarker(value)) return null;
	const trimmed = value.trim();
	const prefix = trimmed.startsWith("secretref-env:") ? LEGACY_SECRETREF_ENV_MARKER_PREFIX : trimmed.startsWith("__env__:") ? LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX : void 0;
	if (!prefix) return null;
	const id = trimmed.slice(prefix.length);
	if (!ENV_SECRET_REF_ID_RE.test(id)) return null;
	return {
		source: "env",
		provider: provider.trim() || "default",
		id
	};
}
/** Coerce canonical and env-shorthand secret inputs into a SecretRef.
* Retired string markers are parsed only by doctor migration above. */
function coerceSecretRef(value, defaults) {
	if (isSecretRef(value)) return value;
	if (isLegacySecretRefWithoutProvider(value)) {
		const provider = defaults?.[value.source] ?? "default";
		return {
			source: value.source,
			provider,
			id: value.id
		};
	}
	const envTemplate = parseEnvTemplateSecretRef(value, defaults?.env);
	if (envTemplate) return envTemplate;
	return null;
}
/** Return whether a value contains either a literal secret string or resolvable SecretRef shape. */
function hasConfiguredSecretInput(value, defaults) {
	if (normalizeSecretInputString(value)) return true;
	return coerceSecretRef(value, defaults) !== null;
}
/** Trim a literal secret input string while leaving non-string inputs unresolved. */
function normalizeSecretInputString(value) {
	return normalizeOptionalString(value);
}
function formatSecretRefLabel(ref) {
	return `${ref.source}:${ref.provider}:${ref.id}`;
}
/** Error thrown when strict secret reads encounter a configured but unresolved SecretRef. */
var UnresolvedSecretInputError = class extends Error {
	constructor(params) {
		super(`${params.path}: unresolved SecretRef "${formatSecretRefLabel(params.ref)}". Resolve this command against an active gateway runtime snapshot before reading it.`);
		this.name = "UnresolvedSecretInputError";
		this.path = params.path;
		this.ref = params.ref;
	}
};
/** Narrow errors from strict secret read sites without parsing user-facing messages. */
function isUnresolvedSecretInputError(value) {
	return value instanceof UnresolvedSecretInputError;
}
function createUnresolvedSecretInputError(params) {
	return new UnresolvedSecretInputError(params);
}
/** Throw when a secret field still contains an unresolved SecretRef at a read site. */
function assertSecretInputResolved(params) {
	const { ref } = resolveSecretInputRef({
		value: params.value,
		refValue: params.refValue,
		defaults: params.defaults
	});
	if (!ref) return;
	throw createUnresolvedSecretInputError({
		path: params.path,
		ref
	});
}
/** Resolve a secret field to either a literal value, a configured-unavailable ref, or missing. */
function resolveSecretInputString(params) {
	const { explicitRef, ref } = resolveSecretInputRef({
		value: params.value,
		refValue: params.refValue,
		defaults: params.defaults
	});
	const normalized = normalizeSecretInputString(params.value);
	if (normalized && !explicitRef) return {
		status: "available",
		value: normalized,
		ref: null
	};
	if (!ref) return {
		status: "missing",
		value: void 0,
		ref: null
	};
	if ((params.mode ?? "strict") === "strict") throw createUnresolvedSecretInputError({
		path: params.path,
		ref
	});
	return {
		status: "configured_unavailable",
		value: void 0,
		ref
	};
}
/** Return a strict literal secret value, throwing if the field still points at a SecretRef. */
function normalizeResolvedSecretInputString(params) {
	const resolved = resolveSecretInputString({
		...params,
		mode: "strict"
	});
	if (resolved.status === "available") return resolved.value;
}
/** Resolve explicit `refValue` before inline secret references embedded in `value`. */
function resolveSecretInputRef(params) {
	const explicitRef = coerceSecretRef(params.refValue, params.defaults);
	const inlineRef = explicitRef ? null : coerceSecretRef(params.value, params.defaults);
	return {
		explicitRef,
		inlineRef,
		ref: explicitRef ?? inlineRef
	};
}
//#endregion
export { coerceSecretRef as a, isUnresolvedSecretInputError as c, parseEnvTemplateSecretRef as d, parseLegacySecretRefEnvMarker as f, assertSecretInputResolved as i, normalizeResolvedSecretInputString as l, resolveSecretInputString as m, LEGACY_SECRETREF_ENV_MARKER_PREFIX as n, hasConfiguredSecretInput as o, resolveSecretInputRef as p, UnresolvedSecretInputError as r, isLegacySecretRefEnvMarker as s, LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX as t, normalizeSecretInputString as u };
