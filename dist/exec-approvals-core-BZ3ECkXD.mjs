import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
//#region src/infra/exec-approvals-core.ts
const EXEC_TARGET_VALUES = [
	"auto",
	"sandbox",
	"gateway",
	"node"
];
function normalizeExecHost(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "sandbox" || normalized === "gateway" || normalized === "node") return normalized;
	return null;
}
function normalizeExecTarget(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "auto") return normalized;
	return normalizeExecHost(normalized);
}
function requireValidExecTarget(value) {
	if (value == null) return null;
	if (typeof value !== "string") throw new Error(`Invalid exec host value type ${typeof value}. Allowed values: ${EXEC_TARGET_VALUES.join(", ")}.`);
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized) return null;
	const target = normalizeExecTarget(normalized);
	if (target) return target;
	throw new Error(`Invalid exec host "${value}". Allowed values: ${EXEC_TARGET_VALUES.join(", ")}.`);
}
function normalizeExecSecurity(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "deny" || normalized === "allowlist" || normalized === "full") return normalized;
	return null;
}
function normalizeExecAsk(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "off" || normalized === "on-miss" || normalized === "always") return normalized;
	return null;
}
function normalizeExecMode(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (normalized === "deny" || normalized === "allowlist" || normalized === "ask" || normalized === "auto" || normalized === "full") return normalized;
	return null;
}
function resolveExecModeFromPolicy(params) {
	if (params.security === "deny") return "deny";
	if (params.security === "allowlist" && params.ask === "off") return "allowlist";
	if (params.security === "full" && params.ask !== "always") return "full";
	return "ask";
}
function resolveExactExecModeFromPolicy(params) {
	if (params.ask === "always" || params.security === "full" && params.ask === "on-miss") return null;
	return resolveExecModeFromPolicy(params);
}
function resolveExecPolicyForMode(mode) {
	switch (mode) {
		case "deny": return {
			security: "deny",
			ask: "off",
			autoReview: false
		};
		case "allowlist": return {
			security: "allowlist",
			ask: "off",
			autoReview: false
		};
		case "ask": return {
			security: "allowlist",
			ask: "on-miss",
			autoReview: false
		};
		case "auto": return {
			security: "allowlist",
			ask: "on-miss",
			autoReview: true
		};
		case "full": return {
			security: "full",
			ask: "off",
			autoReview: false
		};
	}
	throw new Error(`Unsupported exec mode: ${String(mode)}`);
}
function resolveExecModePolicy(params) {
	if (!params.mode) return {
		mode: resolveExecModeFromPolicy({
			security: params.security,
			ask: params.ask
		}),
		security: params.security,
		ask: params.ask,
		autoReview: false
	};
	return {
		mode: params.mode,
		...resolveExecPolicyForMode(params.mode)
	};
}
const DEFAULT_EXEC_APPROVAL_TIMEOUT_MS = 18e5;
//#endregion
export { normalizeExecMode as a, requireValidExecTarget as c, resolveExecModePolicy as d, resolveExecPolicyForMode as f, normalizeExecHost as i, resolveExactExecModeFromPolicy as l, EXEC_TARGET_VALUES as n, normalizeExecSecurity as o, normalizeExecAsk as r, normalizeExecTarget as s, DEFAULT_EXEC_APPROVAL_TIMEOUT_MS as t, resolveExecModeFromPolicy as u };
