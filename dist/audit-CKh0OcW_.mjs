import { t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as secretRefKey } from "./ref-contract-Bfd9_-Lp.mjs";
import { a as coerceSecretRef, g as resolveSecretInputRef } from "./types.secrets-Dgbd2kyP.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { s as readJsonSync, t as JsonFileReadError } from "./json-files-DYmSFHoN.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { F as listLegacyAuthProfileArchives, I as listLegacyAuthProfileSources, h as readPersistedSharedAuthProfileStoreRaw, p as readPersistedAuthProfileStoreRaw } from "./sqlite-BlFpr2YD.mjs";
import { f as resolveSharedMainAuthAgentDir } from "./path-resolve-21Orzn6B.mjs";
import "./legacy-source-diagnostic-CLlkIevG.mjs";
import { a as isProviderScopedSecretResolutionError, o as isSecretResolutionError } from "./resolve-errors-DYenvPyo.mjs";
import { i as listKnownSecretEnvVarNames } from "./provider-env-vars-D43Pu6eG.mjs";
import { r as parseEnvValue } from "./shared-BVDjoVcf.mjs";
import { h as isExpectedResolvedSecretValue } from "./runtime-shared-DqMZ_k3n.mjs";
import { n as discoverConfigSecretTargets } from "./target-registry-query-DOYceNvb.mjs";
import "./target-registry-CSb4wosA.mjs";
import "./config-B3oiWDlr.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { l as isSecretRefHeaderValueMarker, s as isNonSecretApiKeyMarker } from "./model-auth-markers-Clx9vUna.mjs";
import { t as isLikelySensitiveModelProviderHeaderName } from "./model-provider-header-policy-Bf6iJgjr.mjs";
import { n as resolveSecretRefValue, r as resolveSecretRefValues } from "./resolve-D1-YVpS6.mjs";
import { t as classifyConfigSecretTarget } from "./config-secret-target-C-POk-vR.mjs";
import { n as listSecretsDotEnvPaths, t as listAgentModelsJsonPaths } from "./storage-scan-DiuSHndC.mjs";
import { n as findSecretStoreRedactedValueFindings, t as findSecretStorePlaintextResidueFindings } from "./audit-store-CzjMB-6a.mjs";
import { n as selectRefsForExecPolicy, t as getSkippedExecRefStaticError } from "./exec-resolution-policy-DxaB7Xe4.mjs";
import { i as iterateAuthProfileCredentials, r as listAuthProfileStoreTargets, t as createSecretsConfigIO } from "./config-io-CIWrveRv.mjs";
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
		if (!knownKeys.has(key) || !parseEnvValue(match[2] ?? "")) continue;
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
	const existing = collector.authProviderModes.get(key);
	if (existing) {
		existing.add(mode);
		return;
	}
	collector.authProviderModes.set(key, /* @__PURE__ */ new Set([mode]));
}
function collectConfigSecrets(params) {
	for (const target of discoverConfigSecretTargets(params.config, { env: params.env })) {
		const { ref, plaintext } = classifyConfigSecretTarget(params.config, target);
		if (plaintext && typeof target.value === "string") params.collector.configPlaintextAssignments.push({
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
		if (!plaintext) continue;
		params.collector.findings.push({
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
			if (hasNonEmptyString(entry.value)) {
				collector.findings.push({
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
			collector.findings.push({
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
		params.collector.findings.push({
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
		const collectValue = (value, headerKey) => {
			const isHeader = headerKey !== void 0;
			const ref = coerceSecretRef(value);
			if (!ref && (!hasNonEmptyString(value) || (isHeader ? isSecretRefHeaderValueMarker(value) : isNonSecretApiKeyMarker(value)) || isHeader && !isLikelySensitiveModelProviderHeaderName(headerKey))) return;
			params.collector.findings.push({
				code: ref ? "REF_UNRESOLVED" : "PLAINTEXT_FOUND",
				severity: ref ? "error" : "warn",
				file: params.modelsJsonPath,
				jsonPath: `providers.${providerId}.${isHeader ? `headers.${headerKey}` : "apiKey"}`,
				message: ref ? isHeader ? "models.json contains an unresolved SecretRef object for provider headers; regenerate models.json." : "models.json contains an unresolved SecretRef object; regenerate models.json." : isHeader ? "models.json provider header value is stored as plaintext." : "models.json provider apiKey is stored as plaintext.",
				provider: providerId
			});
		};
		collectValue(providerValue.apiKey);
		const headers = isRecord(providerValue.headers) ? providerValue.headers : void 0;
		if (!headers) continue;
		for (const [headerKey, headerValue] of Object.entries(headers)) collectValue(headerValue, headerKey);
	}
}
function collectLegacyAuthSourceFindings(params) {
	const seen = /* @__PURE__ */ new Set();
	const report = (source, archived) => {
		if (seen.has(source.path)) return;
		seen.add(source.path);
		params.collector.findings.push({
			code: "LEGACY_RESIDUE",
			severity: !archived && source.kind === "auth-state" ? "info" : "warn",
			file: source.path,
			jsonPath: "<root>",
			message: archived ? `Archived auth source ${source.kind} may contain plaintext credentials; retain it only as long as recovery requires.` : `Retired auth source ${source.kind} is present; run openclaw doctor --fix to migrate and archive it.`
		});
	};
	const targets = listAuthProfileStoreTargets(params.config, params.stateDir, params.env);
	for (const target of targets) {
		const agentDir = target.kind === "agent" ? target.agentDir : void 0;
		for (const source of listLegacyAuthProfileSources({
			agentDir,
			env: params.env
		})) report(source, false);
	}
	const sharedMainDir = resolveSharedMainAuthAgentDir(params.env);
	for (const archive of listLegacyAuthProfileArchives({
		agentDirs: targets.flatMap((target) => target.kind === "agent" ? [target.agentDir] : []).concat(sharedMainDir),
		env: params.env
	})) report(archive, true);
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
		let code = "REF_UNRESOLVED";
		let detail;
		if (resolveErr) {
			if (isSecretResolutionError(resolveErr) && resolveErr.code === "SECRET_REF_REDACTED_VALUE") code = "PLACEHOLDER_VALUE";
			detail = formatErrorMessage(resolveErr);
		} else if (!resolvedByRefKey.has(key)) detail = "resolved value is missing";
		else if (!isExpectedResolvedSecretValue(resolvedByRefKey.get(key), assignment.expected)) detail = assignment.expected === "string" ? "resolved value is not a non-empty string" : "resolved value is not a string/object";
		else continue;
		params.collector.findings.push({
			code,
			severity: "error",
			file: assignment.file,
			jsonPath: assignment.path,
			message: `Failed to resolve ${assignment.ref.source}:${assignment.ref.provider}:${assignment.ref.id} (${detail}).`,
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
		const modes = collector.authProviderModes.get(provider);
		if (!modes) continue;
		const modeText = [...modes].join("/");
		for (const configPath of paths) collector.findings.push({
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
		authProviderModes: /* @__PURE__ */ new Map(),
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
		collector.findings.push(...await findSecretStorePlaintextResidueFindings({
			assignments: collector.configPlaintextAssignments,
			database: { env }
		}));
	} else collector.findings.push({
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
	collector.findings.push(...await findSecretStoreRedactedValueFindings({
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
