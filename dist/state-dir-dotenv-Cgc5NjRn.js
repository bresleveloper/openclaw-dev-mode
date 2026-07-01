import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { a as normalizeEnvVarKey, n as isDangerousHostEnvOverrideVarName, r as isDangerousHostEnvVarName } from "./host-env-security-CmrI0DLD.js";
import { i as collectConfigServiceEnvVars } from "./config-env-vars-CQg5ubh6.js";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
//#region src/config/state-dir-dotenv.ts
function isBlockedServiceEnvVar(key) {
	return key.toUpperCase() === "OPENCLAW_ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS" || isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key);
}
function unwrapMatchingLiteralQuotes(value) {
	if (value.length < 2) return value;
	const first = value[0];
	const last = value.at(-1);
	if ((first === `"` || first === `'`) && first === last) return value.slice(1, -1);
	return value;
}
/** Returns true when a dotenv value is only a shell reference, not an expanded secret. */
function isUnresolvedShellReference(value) {
	const candidate = unwrapMatchingLiteralQuotes(value.trim());
	return /^\$[A-Z_][A-Z0-9_]*$/.test(candidate) || /^\$\{[A-Z_][A-Z0-9_]*[^}]*\}$/.test(candidate) || /^\$\([^)]*\)$/.test(candidate);
}
function parseStateDirDotEnvContent(content) {
	const parsed = dotenv.parse(content);
	const entries = {};
	const skippedShellReferenceKeys = [];
	for (const [rawKey, value] of Object.entries(parsed)) {
		if (!value?.trim()) continue;
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (!key) continue;
		if (isBlockedServiceEnvVar(key)) continue;
		if (isUnresolvedShellReference(value)) {
			skippedShellReferenceKeys.push(key);
			continue;
		}
		entries[key] = value;
	}
	return {
		entries,
		skippedShellReferenceKeys
	};
}
/**
* Read and parse the state-dir `.env`, returning both the persisted entries and
* the keys that were skipped because they held unresolved shell references. The
* skipped keys are surfaced so generated service env files can remove stale
* literal references for keys OpenClaw previously managed.
*/
function readStateDirDotEnvFromStateDir(stateDir) {
	const dotEnvPath = path.join(stateDir, ".env");
	try {
		return parseStateDirDotEnvContent(fs.readFileSync(dotEnvPath, "utf8"));
	} catch {
		return {
			entries: {},
			skippedShellReferenceKeys: []
		};
	}
}
/**
* Read and parse `~/.openclaw/.env` (or `$OPENCLAW_STATE_DIR/.env`), returning
* a filtered record of key-value pairs suitable for a managed service
* environment source.
*/
function readStateDirDotEnvVars(env) {
	return readStateDirDotEnvFromStateDir(resolveStateDir(env)).entries;
}
/** Collects durable service env vars from state-dir `.env` and config, preserving each source. */
function collectDurableServiceEnvVarSources(params) {
	const stateDirDotEnvEnvironment = readStateDirDotEnvVars(params.env);
	const configEnvironment = collectConfigServiceEnvVars(params.config);
	return {
		stateDirDotEnvEnvironment,
		configEnvironment,
		durableEnvironment: {
			...stateDirDotEnvEnvironment,
			...configEnvironment
		}
	};
}
/**
* Durable service env sources survive beyond the invoking shell and are safe to
* persist into owner-only gateway service environment sources.
*
* Precedence:
* 1. state-dir `.env` file vars
* 2. config service env vars
*/
function collectDurableServiceEnvVars(params) {
	return collectDurableServiceEnvVarSources(params).durableEnvironment;
}
//#endregion
export { readStateDirDotEnvVars as a, readStateDirDotEnvFromStateDir as i, collectDurableServiceEnvVars as n, isUnresolvedShellReference as r, collectDurableServiceEnvVarSources as t };
