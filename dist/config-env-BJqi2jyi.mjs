import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
//#region extensions/migrate-hermes/config-env.ts
const MCP_ENV_REFERENCE_RE = /\$\{([^}]+)\}/gu;
function normalizeHermesEnvReferenceName(value) {
	const trimmed = value.trim();
	return (trimmed.startsWith("env:") ? trimmed.slice(4).trim() : trimmed) || void 0;
}
function resolveMcpEnvReferences(value, env) {
	if (typeof value === "string") {
		let unresolved = false;
		const resolved = value.replace(MCP_ENV_REFERENCE_RE, (match, rawName) => {
			const name = normalizeHermesEnvReferenceName(rawName);
			if (!name) {
				unresolved = true;
				return match;
			}
			const replacement = env[name];
			if (replacement === void 0) {
				unresolved = true;
				return match;
			}
			return replacement;
		});
		return {
			unresolved,
			value: resolved
		};
	}
	if (Array.isArray(value)) {
		const entries = value.map((entry) => resolveMcpEnvReferences(entry, env));
		return {
			unresolved: entries.some((entry) => entry.unresolved),
			value: entries.map((entry) => entry.value)
		};
	}
	if (isRecord(value)) {
		const entries = Object.entries(value).map(([key, entry]) => [key, resolveMcpEnvReferences(entry, env)]);
		return {
			unresolved: entries.some(([, entry]) => entry.unresolved),
			value: Object.fromEntries(entries.map(([key, entry]) => [key, entry.value]))
		};
	}
	return {
		unresolved: false,
		value
	};
}
function mcpValueHasEnvReferences(value) {
	return value !== void 0 && resolveMcpEnvReferences(value, {}).unresolved;
}
//#endregion
export { resolveMcpEnvReferences as i, mcpValueHasEnvReferences as n, normalizeHermesEnvReferenceName as r, MCP_ENV_REFERENCE_RE as t };
