import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { _ as secretRefKey } from "./ref-contract-BVi3ykLT.mjs";
import { a as coerceSecretRef, p as resolveSecretInputRef } from "./types.secrets-B5xWSzLp.mjs";
import { f as resolveConfigSecretRef } from "./resolution-facts-CSuKIPux.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { l as readJsonSync, t as JsonFileReadError } from "./json-files-C0HSMh2Z.mjs";
import { i as listKnownSecretEnvVarNames } from "./provider-env-vars-BM4XH1SL.mjs";
import { t as isNonEmptyString } from "./shared-BUXrUFz5.mjs";
import { m as isExpectedResolvedSecretValue, p as hasConfiguredPlaintextSecretValue } from "./runtime-shared-Bpp2PLaL.mjs";
import { n as discoverConfigSecretTargets } from "./target-registry-query-DciTXKJy.mjs";
import "./target-registry-BD3AtdiE.mjs";
import "./config-DryArA1l.mjs";
import { a as isProviderScopedSecretResolutionError, o as isSecretResolutionError } from "./resolve-errors-DYenvPyo.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { n as resolveSecretRefValue, r as resolveSecretRefValues } from "./resolve-C3ItmvEK.mjs";
import { l as resolveSharedMainAuthAgentDir } from "./path-resolve-Bm8Ih2d_.mjs";
import { D as listLegacyAuthProfileArchives, O as listLegacyAuthProfileSources, f as readPersistedSharedAuthProfileStoreRaw, u as readPersistedAuthProfileStoreRaw } from "./sqlite-BIg_k8qE.mjs";
import "./legacy-source-diagnostic-_PHHNz0J.mjs";
import { t as isLikelySensitiveModelProviderHeaderName } from "./model-provider-header-policy-CUWP5mEd.mjs";
import { l as isSecretRefHeaderValueMarker, s as isNonSecretApiKeyMarker } from "./model-auth-markers-BfYDKFYI.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { n as listSecretsDotEnvPaths, r as parseEnvAssignmentValue, t as listAgentModelsJsonPaths } from "./storage-scan-CnU2zCr3.mjs";
import { n as findSecretStoreRedactedValueFindings, t as findSecretStorePlaintextResidueFindings } from "./audit-store-CRQSx85l.mjs";
import { n as selectRefsForExecPolicy, t as getSkippedExecRefStaticError } from "./exec-resolution-policy-BBKscxZv.mjs";
import { i as iterateAuthProfileCredentials, r as listAuthProfileStoreTargets, t as createSecretsConfigIO } from "./config-io-B663r7gr.mjs";
import fs from "node:fs";
import os from "node:os";
//#region src/secrets/audit-env.ts
/** Returns undefined for an absent file so the audit records only scanned paths. */
function findEnvPlaintextFindings(envPath) {
	if (!fs.existsSync(envPath)) return;
	const knownKeys = new Set(listKnownSecretEnvVarNames());
	const findings = [];
	for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
		const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
		if (!match) continue;
		const key = match[1] ?? "";
		if (!knownKeys.has(key) || !parseEnvAssignmentValue(match[2] ?? "")) continue;
		findings.push({
			code: "PLAINTEXT_FOUND",
			severity: "warn",
			file: envPath,
			jsonPath: `$env.${key}`,
			message: `Potential secret found in .env (${key}).`
		});
	}
	return findings;
}
//#endregion
//#region src/secrets/audit.ts
const REF_RESOLVE_FALLBACK_CONCURRENCY = 8;
const MAX_AUDIT_MODELS_JSON_BYTES = 5242880;
function addFinding(collector, finding) {
	collector.findings.push(finding);
}
function collectProviderRefPath(collector, providerId, configPath) {
	const key = normalizeProviderId(providerId);
	const existing = collector.configProviderRefPaths.get(key);
	if (existing) {
		existing.push(configPath);
		return;
	}
	collector.configProviderRefPaths.set(key, [configPath]);
}
function trackAuthProviderState(collector, provider, mode) {
	const key = normalizeProviderId(provider);
	const existing = collector.authProviderState.get(key);
	if (existing) {
		existing.hasUsableStaticOrOAuth = true;
		existing.modes.add(mode);
		return;
	}
	collector.authProviderState.set(key, {
		hasUsableStaticOrOAuth: true,
		modes: /* @__PURE__ */ new Set([mode])
	});
}
function collectConfigSecrets(params) {
	const defaults = params.config.secrets?.defaults;
	for (const target of discoverConfigSecretTargets(params.config, { env: params.env })) {
		if (!target.entry.includeInAudit) continue;
		const inlineRef = resolveConfigSecretRef({
			config: params.config,
			path: target.path,
			value: target.value,
			defaults,
			includeResolved: true
		});
		const ref = coerceSecretRef(target.refValue, defaults) ?? inlineRef;
		const hasPlaintext = inlineRef === null && hasConfiguredPlaintextSecretValue(target.value, target.entry.expectedResolvedValue);
		const isNonSecretHeader = target.entry.id === "models.providers.*.headers.*" && !isLikelySensitiveModelProviderHeaderName(target.pathSegments.at(-1) ?? "");
		const isModelMarker = target.entry.id === "models.providers.*.apiKey" && typeof target.value === "string" && isNonSecretApiKeyMarker(target.value);
		if (hasPlaintext && !isNonSecretHeader && !isModelMarker && typeof target.value === "string") params.collector.configPlaintextAssignments.push({
			file: params.configPath,
			path: target.path,
			value: target.value
		});
		if (ref) {
			params.collector.refAssignments.push({
				file: params.configPath,
				path: target.path,
				ref,
				expected: target.entry.expectedResolvedValue,
				provider: target.providerId
			});
			if (target.entry.trackProviderShadowing && target.providerId) collectProviderRefPath(params.collector, target.providerId, target.path);
			continue;
		}
		if (isNonSecretHeader || isModelMarker || !hasPlaintext) continue;
		addFinding(params.collector, {
			code: "PLAINTEXT_FOUND",
			severity: "warn",
			file: params.configPath,
			jsonPath: target.path,
			message: `${target.path} is stored as plaintext.`,
			provider: target.providerId
		});
	}
}
function collectAuthStoreSecrets(target, collector, defaults) {
	const authStorePath = target.path;
	if (!fs.existsSync(authStorePath)) return;
	const parsed = target.kind === "shared" ? readPersistedSharedAuthProfileStoreRaw(target.env) : readPersistedAuthProfileStoreRaw(target.agentDir);
	if (!isRecord(parsed) || !isRecord(parsed.profiles)) return;
	collector.filesScanned.add(authStorePath);
	for (const entry of iterateAuthProfileCredentials(parsed.profiles)) {
		if (entry.kind === "api_key" || entry.kind === "token") {
			const { ref } = resolveSecretInputRef({
				value: entry.value,
				refValue: entry.refValue,
				defaults
			});
			const authoredValueRef = coerceSecretRef(entry.value, defaults);
			if (ref) {
				collector.refAssignments.push({
					file: authStorePath,
					path: `profiles.${entry.profileId}.${entry.valueField}`,
					ref,
					expected: "string",
					provider: entry.provider
				});
				trackAuthProviderState(collector, entry.provider, entry.kind);
			}
			if (authoredValueRef) continue;
			if (isNonEmptyString(entry.value)) {
				addFinding(collector, {
					code: "PLAINTEXT_FOUND",
					severity: "warn",
					file: authStorePath,
					jsonPath: `profiles.${entry.profileId}.${entry.valueField}`,
					message: entry.kind === "api_key" ? "Auth profile API key is stored as plaintext." : "Auth profile token is stored as plaintext.",
					provider: entry.provider,
					profileId: entry.profileId
				});
				trackAuthProviderState(collector, entry.provider, entry.kind);
			}
			continue;
		}
		if (entry.hasAccess || entry.hasRefresh) {
			addFinding(collector, {
				code: "LEGACY_RESIDUE",
				severity: "info",
				file: authStorePath,
				jsonPath: `profiles.${entry.profileId}`,
				message: "OAuth credentials are present (out of scope for static SecretRef migration).",
				provider: entry.provider,
				profileId: entry.profileId
			});
			trackAuthProviderState(collector, entry.provider, "oauth");
		}
	}
}
function collectModelsJsonSecrets(params) {
	let parsed;
	try {
		parsed = readJsonSync(params.modelsJsonPath, { maxBytes: MAX_AUDIT_MODELS_JSON_BYTES });
	} catch (error) {
		if (error instanceof JsonFileReadError && error.reason === "read" && hasErrnoCode(error.cause, "ENOENT")) return;
		params.collector.filesScanned.add(params.modelsJsonPath);
		const detail = error instanceof JsonFileReadError && error.reason === "parse" ? error.message : error;
		addFinding(params.collector, {
			code: "REF_UNRESOLVED",
			severity: "error",
			file: params.modelsJsonPath,
			jsonPath: "<root>",
			message: `Invalid JSON in models.json: ${formatErrorMessage(detail)}`
		});
		return;
	}
	params.collector.filesScanned.add(params.modelsJsonPath);
	if (!isRecord(parsed) || !isRecord(parsed.providers)) return;
	for (const [providerId, providerValue] of Object.entries(parsed.providers)) {
		if (!isRecord(providerValue)) continue;
		const apiKey = providerValue.apiKey;
		if (coerceSecretRef(apiKey)) addFinding(params.collector, {
			code: "REF_UNRESOLVED",
			severity: "error",
			file: params.modelsJsonPath,
			jsonPath: `providers.${providerId}.apiKey`,
			message: "models.json contains an unresolved SecretRef object; regenerate models.json.",
			provider: providerId
		});
		else if (isNonEmptyString(apiKey) && !isNonSecretApiKeyMarker(apiKey)) addFinding(params.collector, {
			code: "PLAINTEXT_FOUND",
			severity: "warn",
			file: params.modelsJsonPath,
			jsonPath: `providers.${providerId}.apiKey`,
			message: "models.json provider apiKey is stored as plaintext.",
			provider: providerId
		});
		const headers = isRecord(providerValue.headers) ? providerValue.headers : void 0;
		if (!headers) continue;
		for (const [headerKey, headerValue] of Object.entries(headers)) {
			const headerPath = `providers.${providerId}.headers.${headerKey}`;
			if (coerceSecretRef(headerValue)) {
				addFinding(params.collector, {
					code: "REF_UNRESOLVED",
					severity: "error",
					file: params.modelsJsonPath,
					jsonPath: headerPath,
					message: "models.json contains an unresolved SecretRef object for provider headers; regenerate models.json.",
					provider: providerId
				});
				continue;
			}
			if (!isNonEmptyString(headerValue)) continue;
			if (isSecretRefHeaderValueMarker(headerValue)) continue;
			if (!isLikelySensitiveModelProviderHeaderName(headerKey)) continue;
			addFinding(params.collector, {
				code: "PLAINTEXT_FOUND",
				severity: "warn",
				file: params.modelsJsonPath,
				jsonPath: headerPath,
				message: "models.json provider header value is stored as plaintext.",
				provider: providerId
			});
		}
	}
}
function collectLegacyAuthSourceFindings(params) {
	const seen = /* @__PURE__ */ new Set();
	const targets = listAuthProfileStoreTargets(params.config, params.stateDir, params.env);
	for (const target of targets) {
		const agentDir = target.kind === "agent" ? target.agentDir : void 0;
		for (const source of listLegacyAuthProfileSources({
			agentDir,
			env: params.env
		})) {
			if (seen.has(source.path)) continue;
			seen.add(source.path);
			addFinding(params.collector, {
				code: "LEGACY_RESIDUE",
				severity: source.kind === "auth-state" ? "info" : "warn",
				file: source.path,
				jsonPath: "<root>",
				message: `Retired auth source ${source.kind} is present; run openclaw doctor --fix to migrate and archive it.`
			});
		}
	}
	const sharedMainDir = resolveSharedMainAuthAgentDir(params.env);
	for (const archive of listLegacyAuthProfileArchives({
		agentDirs: targets.flatMap((target) => target.kind === "agent" ? [target.agentDir] : []).concat(sharedMainDir),
		env: params.env
	})) {
		if (seen.has(archive.path)) continue;
		seen.add(archive.path);
		addFinding(params.collector, {
			code: "LEGACY_RESIDUE",
			severity: "warn",
			file: archive.path,
			jsonPath: "<root>",
			message: `Archived auth source ${archive.kind} may contain plaintext credentials; retain it only as long as recovery requires.`
		});
	}
}
async function collectUnresolvedRefFindings(params) {
	const cache = {};
	const refsByProvider = /* @__PURE__ */ new Map();
	const skippedRefKeys = /* @__PURE__ */ new Set();
	let refsChecked = 0;
	let skippedExecRefs = 0;
	for (const assignment of params.collector.refAssignments) {
		const providerKey = `${assignment.ref.source}:${assignment.ref.provider}`;
		let refsForProvider = refsByProvider.get(providerKey);
		if (!refsForProvider) {
			refsForProvider = /* @__PURE__ */ new Map();
			refsByProvider.set(providerKey, refsForProvider);
		}
		refsForProvider.set(secretRefKey(assignment.ref), assignment.ref);
	}
	const resolvedByRefKey = /* @__PURE__ */ new Map();
	const errorsByRefKey = /* @__PURE__ */ new Map();
	for (const refsForProvider of refsByProvider.values()) {
		const refs = [...refsForProvider.values()];
		const selectedRefs = selectRefsForExecPolicy({
			refs,
			allowExec: params.allowExec
		});
		if (selectedRefs.skippedExecRefs.length > 0) {
			skippedExecRefs += selectedRefs.skippedExecRefs.length;
			for (const ref of selectedRefs.skippedExecRefs) {
				skippedRefKeys.add(secretRefKey(ref));
				const staticError = getSkippedExecRefStaticError({
					ref,
					config: params.config
				});
				if (staticError) errorsByRefKey.set(secretRefKey(ref), new Error(staticError));
			}
		}
		if (selectedRefs.refsToResolve.length === 0) continue;
		refsChecked += selectedRefs.refsToResolve.length;
		const provider = refs[0]?.provider;
		try {
			const resolved = await resolveSecretRefValues(selectedRefs.refsToResolve, {
				config: params.config,
				env: params.env,
				cache
			});
			for (const [key, value] of resolved.entries()) resolvedByRefKey.set(key, value);
			continue;
		} catch (err) {
			if (provider && isProviderScopedSecretResolutionError(err)) {
				for (const ref of selectedRefs.refsToResolve) errorsByRefKey.set(secretRefKey(ref), err);
				continue;
			}
		}
		const tasks = selectedRefs.refsToResolve.map((ref) => async () => ({
			key: secretRefKey(ref),
			resolved: await resolveSecretRefValue(ref, {
				config: params.config,
				env: params.env,
				cache
			})
		}));
		const fallback = await runTasksWithConcurrency({
			tasks,
			limit: Math.min(REF_RESOLVE_FALLBACK_CONCURRENCY, selectedRefs.refsToResolve.length),
			errorMode: "continue",
			onTaskError: (error, index) => {
				const ref = selectedRefs.refsToResolve[index];
				if (!ref) return;
				errorsByRefKey.set(secretRefKey(ref), error);
			}
		});
		for (const result of fallback.results) {
			if (!result) continue;
			resolvedByRefKey.set(result.key, result.resolved);
		}
	}
	for (const assignment of params.collector.refAssignments) {
		const key = secretRefKey(assignment.ref);
		if (skippedRefKeys.has(key) && !errorsByRefKey.has(key)) continue;
		const resolveErr = errorsByRefKey.get(key);
		if (resolveErr) {
			addFinding(params.collector, {
				code: isSecretResolutionError(resolveErr) && resolveErr.code === "SECRET_REF_REDACTED_VALUE" ? "PLACEHOLDER_VALUE" : "REF_UNRESOLVED",
				severity: "error",
				file: assignment.file,
				jsonPath: assignment.path,
				message: `Failed to resolve ${assignment.ref.source}:${assignment.ref.provider}:${assignment.ref.id} (${formatErrorMessage(resolveErr)}).`,
				provider: assignment.provider
			});
			continue;
		}
		if (!resolvedByRefKey.has(key)) {
			addFinding(params.collector, {
				code: "REF_UNRESOLVED",
				severity: "error",
				file: assignment.file,
				jsonPath: assignment.path,
				message: `Failed to resolve ${assignment.ref.source}:${assignment.ref.provider}:${assignment.ref.id} (resolved value is missing).`,
				provider: assignment.provider
			});
			continue;
		}
		const resolved = resolvedByRefKey.get(key);
		if (!isExpectedResolvedSecretValue(resolved, assignment.expected)) addFinding(params.collector, {
			code: "REF_UNRESOLVED",
			severity: "error",
			file: assignment.file,
			jsonPath: assignment.path,
			message: assignment.expected === "string" ? `Failed to resolve ${assignment.ref.source}:${assignment.ref.provider}:${assignment.ref.id} (resolved value is not a non-empty string).` : `Failed to resolve ${assignment.ref.source}:${assignment.ref.provider}:${assignment.ref.id} (resolved value is not a string/object).`,
			provider: assignment.provider
		});
	}
	return {
		refsChecked,
		skippedExecRefs
	};
}
function collectShadowingFindings(collector) {
	for (const [provider, paths] of collector.configProviderRefPaths.entries()) {
		const authState = collector.authProviderState.get(provider);
		if (!authState?.hasUsableStaticOrOAuth) continue;
		const modeText = [...authState.modes].join("/");
		for (const configPath of paths) addFinding(collector, {
			code: "REF_SHADOWED",
			severity: "warn",
			file: "openclaw.json",
			jsonPath: configPath,
			message: `Auth profile credentials (${modeText}) take precedence for provider "${provider}", so this config ref may never be used.`,
			provider
		});
	}
}
function summarizeFindings(findings) {
	return {
		plaintextCount: findings.filter((entry) => entry.code === "PLAINTEXT_FOUND").length,
		unresolvedRefCount: findings.filter((entry) => entry.code === "REF_UNRESOLVED" || entry.code === "PLACEHOLDER_VALUE").length,
		shadowedRefCount: findings.filter((entry) => entry.code === "REF_SHADOWED").length,
		storeResidueCount: findings.filter((entry) => entry.code === "STORE_PLAINTEXT_RESIDUE").length,
		legacyResidueCount: findings.filter((entry) => entry.code === "LEGACY_RESIDUE").length
	};
}
/** Runs a secrets audit over config/auth stores and returns structured findings. */
async function runSecretsAudit(params = {}) {
	const env = params.env ?? process.env;
	const snapshot = await createSecretsConfigIO({ env }).readConfigFileSnapshot();
	const configPath = resolveUserPath(snapshot.path);
	const defaults = snapshot.valid ? snapshot.config.secrets?.defaults : void 0;
	const collector = {
		findings: [],
		refAssignments: [],
		configProviderRefPaths: /* @__PURE__ */ new Map(),
		authProviderState: /* @__PURE__ */ new Map(),
		configPlaintextAssignments: [],
		filesScanned: /* @__PURE__ */ new Set([configPath])
	};
	const stateDir = resolveStateDir(env, os.homedir);
	const envPaths = listSecretsDotEnvPaths({
		configPath,
		stateDir
	});
	const config = snapshot.valid ? snapshot.config : {};
	let resolution = {
		refsChecked: 0,
		skippedExecRefs: 0,
		resolvabilityComplete: true
	};
	if (snapshot.valid) {
		collectConfigSecrets({
			config,
			configPath,
			collector,
			env
		});
		for (const target of listAuthProfileStoreTargets(config, stateDir, env)) collectAuthStoreSecrets(target, collector, defaults);
		for (const modelsJsonPath of listAgentModelsJsonPaths(config, stateDir, env)) collectModelsJsonSecrets({
			modelsJsonPath,
			collector
		});
		const unresolvedRefResult = await collectUnresolvedRefFindings({
			collector,
			config,
			env,
			allowExec: Boolean(params.allowExec)
		});
		resolution = {
			refsChecked: unresolvedRefResult.refsChecked,
			skippedExecRefs: unresolvedRefResult.skippedExecRefs,
			resolvabilityComplete: unresolvedRefResult.skippedExecRefs === 0
		};
		collectShadowingFindings(collector);
		collector.findings.push(...findSecretStorePlaintextResidueFindings({
			assignments: collector.configPlaintextAssignments,
			database: { env }
		}));
	} else addFinding(collector, {
		code: "REF_UNRESOLVED",
		severity: "error",
		file: configPath,
		jsonPath: "<root>",
		message: "Config is invalid; cannot validate secret references reliably."
	});
	for (const envPath of envPaths) {
		const findings = findEnvPlaintextFindings(envPath);
		if (findings) {
			collector.filesScanned.add(envPath);
			collector.findings.push(...findings);
		}
	}
	collector.findings.push(...findSecretStoreRedactedValueFindings({
		database: { env },
		excludeNames: new Set(collector.refAssignments.filter((assignment) => assignment.ref.source === "store").map((assignment) => assignment.ref.id))
	}));
	collectLegacyAuthSourceFindings({
		config,
		stateDir,
		env,
		collector
	});
	const summary = summarizeFindings(collector.findings);
	return {
		version: 1,
		status: summary.unresolvedRefCount > 0 ? "unresolved" : collector.findings.length > 0 ? "findings" : "clean",
		resolution,
		filesScanned: [...collector.filesScanned].toSorted(),
		summary,
		findings: collector.findings
	};
}
/** Maps audit results to CLI exit codes. */
function resolveSecretsAuditExitCode(report, check) {
	if (report.summary.unresolvedRefCount > 0) return 2;
	if (check && report.findings.length > 0) return 1;
	return 0;
}
//#endregion
export { resolveSecretsAuditExitCode, runSecretsAudit };
