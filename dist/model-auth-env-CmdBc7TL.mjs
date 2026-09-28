import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as normalizeProviderIdForAuth } from "./provider-id-DCtsDflE.mjs";
import { n as getShellEnvAppliedKeys } from "./shell-env-B_7LkFoy.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { r as resolvePluginSetupProviderCore } from "./setup-registry-D5VN3YGP.mjs";
import { m as resolveProviderEnvAuthLookupMaps } from "./model-auth-markers-BfYDKFYI.mjs";
import fs from "node:fs";
import os from "node:os";
//#region src/secrets/provider-auth-evidence.ts
/** Resolves cheap, secret-free local credential evidence declared by provider manifests. */
function expandAuthEvidencePath(rawPath, env) {
	const trimmed = rawPath.trim();
	if (!trimmed) return;
	let unresolvedPlaceholder = false;
	let explicitOverride = false;
	const placeholderPattern = /\$\{([A-Za-z_][A-Za-z0-9_]*)\}/gu;
	const invalidPlaceholder = trimmed.replace(placeholderPattern, "").includes("${");
	const expanded = trimmed.replace(placeholderPattern, (_match, name) => {
		const value = name === "HOME" ? normalizeOptionalString(env.HOME) ?? os.homedir() : normalizeOptionalString(env[name]);
		if (!value) {
			unresolvedPlaceholder = true;
			return "";
		}
		if (name !== "HOME" && name !== "APPDATA") explicitOverride = true;
		return value;
	});
	return unresolvedPlaceholder || invalidPlaceholder ? void 0 : {
		path: expanded,
		explicitOverride
	};
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
		if (!expandedPath) continue;
		if (fs.existsSync(expandedPath.path)) return true;
		if (expandedPath.explicitOverride) return false;
	}
	return false;
}
function resolveLocalProviderAuthEvidence(evidenceEntries, env) {
	for (const evidence of evidenceEntries ?? []) {
		if (evidence.type !== "local-file-with-env" || !hasRequiredAuthEvidenceEnv(evidence, env) || !hasLocalFileAuthEvidence(evidence, env)) continue;
		return {
			credentialMarker: evidence.credentialMarker,
			source: evidence.source ?? "local auth evidence"
		};
	}
	return null;
}
//#endregion
//#region src/agents/model-auth-env.ts
/**
* Resolves model provider API keys from explicit environment variables.
*/
function resolveAuthEvidence(evidence, env) {
	const resolved = resolveLocalProviderAuthEvidence(evidence, env);
	return resolved ? {
		apiKey: resolved.credentialMarker,
		source: resolved.source
	} : null;
}
/** Reports env/local auth presence without returning or resolving credential material. */
function resolveProviderEnvAuthEvidence(provider, env = process.env, options = {}) {
	const providerId = normalizeProviderIdForAuth(provider);
	const lookupMaps = !options.aliasMap || !options.candidateMap || !options.authEvidenceMap ? resolveProviderEnvAuthLookupMaps({
		config: options.config,
		workspaceDir: options.workspaceDir,
		env
	}) : void 0;
	const normalized = (options.aliasMap ?? lookupMaps?.aliasMap ?? {})[providerId] ?? providerId;
	const candidateMap = options.candidateMap ?? lookupMaps?.envCandidateMap ?? {};
	const authEvidenceMap = options.authEvidenceMap ?? lookupMaps?.authEvidenceMap ?? {};
	const applied = new Set(getShellEnvAppliedKeys());
	for (const envVar of candidateMap[normalized] ?? []) {
		if (!normalizeOptionalSecretInput(env[envVar])) continue;
		return {
			mode: normalized === "amazon-bedrock" && envVar.startsWith("AWS_") ? "aws-sdk" : envVar.includes("OAUTH_TOKEN") ? "oauth" : "api-key",
			source: applied.has(envVar) ? `shell env: ${envVar}` : `env: ${envVar}`
		};
	}
	const localEvidence = resolveLocalProviderAuthEvidence(authEvidenceMap[normalized], env);
	if (localEvidence) return {
		mode: normalized === "amazon-bedrock" ? "aws-sdk" : "api-key",
		source: localEvidence.source
	};
	return null;
}
/**
* Plans direct auth without loading a provider runtime or resolving credential material.
* Setup-provider refs are deferred evidence only; runtime lookup still decides availability.
*/
function resolveProviderDirectAuthPlanningEvidence(provider, env = process.env, options = {}) {
	const lookupMaps = !options.aliasMap || !options.candidateMap || !options.authEvidenceMap || !options.setupProviderFallbackRefs ? resolveProviderEnvAuthLookupMaps({
		config: options.config,
		workspaceDir: options.workspaceDir,
		env,
		metadataSnapshot: options.metadataSnapshot
	}) : void 0;
	const aliasMap = options.aliasMap ?? lookupMaps?.aliasMap ?? {};
	const concrete = resolveProviderEnvAuthEvidence(provider, env, {
		aliasMap,
		candidateMap: options.candidateMap ?? lookupMaps?.envCandidateMap ?? {},
		authEvidenceMap: options.authEvidenceMap ?? lookupMaps?.authEvidenceMap ?? {}
	});
	if (concrete) return {
		kind: "environment",
		...concrete
	};
	const providerId = normalizeProviderIdForAuth(provider);
	const normalized = aliasMap[providerId] ?? providerId;
	return (options.setupProviderFallbackRefs ?? lookupMaps?.setupProviderFallbackRefs ?? []).some((ref) => normalizeProviderIdForAuth(ref) === normalized) ? {
		kind: "setup-provider",
		mode: "api-key",
		source: "setup provider"
	} : null;
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
	const setupProvider = resolvePluginSetupProviderCore({
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
export { resolveLocalProviderAuthEvidence as i, resolveProviderDirectAuthPlanningEvidence as n, resolveProviderEnvAuthEvidence as r, resolveEnvApiKey as t };
