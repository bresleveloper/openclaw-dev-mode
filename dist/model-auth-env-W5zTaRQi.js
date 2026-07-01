import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { a as normalizeProviderIdForAuth } from "./provider-id-Dq06Bcx6.js";
import { n as getShellEnvAppliedKeys } from "./shell-env-DU1VTcPn.js";
import { i as resolvePluginSetupProvider } from "./setup-registry-Dw6hQo3K.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-JuG5HlWn.js";
import { b as resolveProviderEnvAuthLookupMaps } from "./model-auth-markers-C4s6SbvA.js";
import fs from "node:fs";
import os from "node:os";
//#region src/agents/model-auth-env.ts
/**
* Resolves model provider API keys from explicit environment variables.
*/
function expandAuthEvidencePath(rawPath, env) {
	const trimmed = rawPath.trim();
	if (!trimmed) return;
	const homeDir = normalizeOptionalString(env.HOME) ?? os.homedir();
	const appDataDir = normalizeOptionalString(env.APPDATA);
	if (trimmed.includes("${APPDATA}") && !appDataDir) return;
	return trimmed.replaceAll("${HOME}", homeDir).replaceAll("${APPDATA}", appDataDir ?? "");
}
function hasRequiredAuthEvidenceEnv(evidence, env) {
	const hasEnv = (key) => Boolean(normalizeOptionalSecretInput(env[key]));
	if (evidence.requiresAnyEnv?.length && !evidence.requiresAnyEnv.some(hasEnv)) return false;
	if (evidence.requiresAllEnv?.length && !evidence.requiresAllEnv.every(hasEnv)) return false;
	return true;
}
function hasLocalFileAuthEvidence(evidence, env) {
	if (evidence.fileEnvVar) {
		const explicitPath = normalizeOptionalString(env[evidence.fileEnvVar]);
		if (explicitPath) return fs.existsSync(explicitPath);
	}
	for (const rawPath of evidence.fallbackPaths ?? []) {
		const expandedPath = expandAuthEvidencePath(rawPath, env);
		if (expandedPath && fs.existsSync(expandedPath)) return true;
	}
	return false;
}
function resolveAuthEvidence(evidence, env) {
	for (const entry of evidence ?? []) {
		if (entry.type !== "local-file-with-env") continue;
		if (!hasRequiredAuthEvidenceEnv(entry, env) || !hasLocalFileAuthEvidence(entry, env)) continue;
		return {
			apiKey: entry.credentialMarker,
			source: entry.source ?? "local auth evidence"
		};
	}
	return null;
}
/** Resolve an API key or auth-evidence marker for a provider from environment state. */
function resolveEnvApiKey(provider, env = process.env, options = {}) {
	const normalizedProvider = normalizeProviderIdForAuth(provider);
	const lookupParams = {
		config: options.config,
		workspaceDir: options.workspaceDir,
		env
	};
	const lookupMaps = !options.aliasMap || !options.candidateMap || !options.authEvidenceMap ? resolveProviderEnvAuthLookupMaps(lookupParams) : void 0;
	const normalized = (options.aliasMap ?? lookupMaps?.aliasMap ?? {})[normalizedProvider] ?? normalizedProvider;
	const candidateMap = options.candidateMap ?? lookupMaps?.envCandidateMap ?? {};
	const authEvidenceMap = options.authEvidenceMap ?? lookupMaps?.authEvidenceMap ?? {};
	const applied = new Set(getShellEnvAppliedKeys());
	const pick = (envVar) => {
		const value = normalizeOptionalSecretInput(env[envVar]);
		if (!value) return null;
		return {
			apiKey: value,
			source: applied.has(envVar) ? `shell env: ${envVar}` : `env: ${envVar}`
		};
	};
	const candidates = Object.hasOwn(candidateMap, normalized) ? candidateMap[normalized] : void 0;
	if (Array.isArray(candidates)) for (const envVar of candidates) {
		const resolved = pick(envVar);
		if (resolved) return resolved;
	}
	const authEvidence = resolveAuthEvidence(Object.hasOwn(authEvidenceMap, normalized) ? authEvidenceMap[normalized] : void 0, env);
	if (authEvidence) return authEvidence;
	if (Array.isArray(candidates)) return null;
	if (options.skipSetupProviderFallback === true) return null;
	const setupProvider = resolvePluginSetupProvider({
		provider: normalized,
		config: options.config,
		workspaceDir: options.workspaceDir,
		env
	});
	if (setupProvider?.resolveConfigApiKey) {
		const resolved = setupProvider.resolveConfigApiKey({
			provider: normalized,
			env
		});
		if (resolved?.trim()) return {
			apiKey: resolved,
			source: resolved === "gcp-vertex-credentials" ? "gcloud adc" : "env"
		};
	}
	return null;
}
//#endregion
export { resolveEnvApiKey as t };
