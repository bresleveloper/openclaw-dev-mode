import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { g as normalizeUniqueStringEntriesLower } from "./string-normalization-D6DKCpwE.mjs";
import { t as parseDiagnosticEnvFlags } from "./diagnostic-flags-env-7ynNTunv.mjs";
//#region src/infra/diagnostic-flags.ts
const DIAGNOSTICS_ENV = "OPENCLAW_DIAGNOSTICS";
/** Resolves enabled diagnostic flags from config plus `OPENCLAW_DIAGNOSTICS` overrides. */
function resolveDiagnosticFlags(cfg, env = process.env) {
	const configFlags = Array.isArray(cfg?.diagnostics?.flags) ? cfg?.diagnostics?.flags : [];
	const envFlags = parseDiagnosticEnvFlags(env[DIAGNOSTICS_ENV]);
	if (envFlags.disablesAll) return [];
	return normalizeUniqueStringEntriesLower([...configFlags, ...envFlags.flags]);
}
/** Returns whether a diagnostic flag is enabled after config/env resolution. */
function isDiagnosticFlagEnabled(flag, cfg, env = process.env) {
	const enabledFlags = resolveDiagnosticFlags(cfg, env);
	const target = normalizeLowercaseStringOrEmpty(flag);
	if (!target) return false;
	for (const enabled of enabledFlags) {
		if (enabled === "*" || enabled === "all" || enabled === target) return true;
		if (enabled.endsWith(".*") && target === enabled.slice(0, -2)) return true;
		if (enabled.endsWith("*") && target.startsWith(enabled.slice(0, -1))) return true;
	}
	return false;
}
//#endregion
export { isDiagnosticFlagEnabled as t };
