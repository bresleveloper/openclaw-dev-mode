import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as FsSafeError, v as readSecureFile } from "./fs-safe-BAPek8At.mjs";
import "./utils-aKqR_F_U.mjs";
import { _ as secretRefKey, g as resolveSecretRefProviderSourceMismatch, i as SINGLE_VALUE_FILE_REF_ID, m as normalizeAndGroupSecretRefs, s as isBuiltInDefaultSecretProviderRef } from "./ref-contract-BVi3ykLT.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-CEG7WMVu.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { n as isRedactedSecretValue } from "./redact-sentinel-f_PhnHTI.mjs";
import { n as normalizePositiveInt, r as normalizePositiveTimerMs, t as isNonEmptyString } from "./shared-BUXrUFz5.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { i as resolveSecretProviderIntegrationConfig, n as isPluginIntegrationSecretProviderConfig, t as assertSecureExecCommandPath } from "./exec-provider-path-validation-7Cc3wazF.mjs";
import { c as refResolutionError, o as isSecretResolutionError, s as providerResolutionError } from "./resolve-errors-DYenvPyo.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { n as readJsonPointer } from "./json-pointer-DsOp5xfv.mjs";
import { t as SECRET_STORE_VALUE_MAX_BYTES } from "./secret-store-validation-error-Bzzf_1MN.mjs";
import { c as readSecretStoreValue } from "./secret-store-BjhT4Kcc.mjs";
import path from "node:path";
//#region src/secrets/resolve-store.ts
const STORE_SECRET_REF_BATCH_MAX_BYTES = 512 * SECRET_STORE_VALUE_MAX_BYTES;
function resolveStoreRefs(params) {
	const resolved = /* @__PURE__ */ new Map();
	let resolvedBytes = 0;
	for (const ref of params.refs) {
		const result = readSecretStoreValue({
			scope: { kind: "team" },
			name: ref.id,
			database: params.database
		});
		if (!result.ok) {
			if (result.error.code === "SECRET_STORE_NOT_FOUND") {
				params.onRefError(refResolutionError({
					code: "SECRET_REF_NOT_FOUND",
					source: "store",
					provider: params.providerName,
					refId: ref.id,
					message: result.error.message
				}));
				continue;
			}
			if (result.error.code === "SECRET_STORE_INVALID_NAME") {
				params.onRefError(refResolutionError({
					code: "SECRET_REF_INVALID",
					source: "store",
					provider: params.providerName,
					refId: ref.id,
					message: result.error.message
				}));
				continue;
			}
			throw providerResolutionError({
				code: "SECRET_PROVIDER_UNAVAILABLE",
				source: "store",
				provider: params.providerName,
				message: result.error.message,
				cause: result.error.cause
			});
		}
		resolvedBytes += Buffer.byteLength(result.value, "utf8");
		if (resolvedBytes > STORE_SECRET_REF_BATCH_MAX_BYTES) throw providerResolutionError({
			code: "SECRET_PROVIDER_INVALID",
			source: "store",
			provider: params.providerName,
			message: `Store provider "${params.providerName}" exceeded its ${STORE_SECRET_REF_BATCH_MAX_BYTES}-byte batch limit.`
		});
		resolved.set(ref.id, result.value);
	}
	return resolved;
}
//#endregion
//#region src/secrets/resolve.ts
/** Resolves SecretRef values from env, file, exec, and store secret providers. */
const DEFAULT_PROVIDER_CONCURRENCY = 4;
const DEFAULT_MAX_REFS_PER_PROVIDER = 512;
const DEFAULT_MAX_BATCH_BYTES = 262144;
const DEFAULT_FILE_MAX_BYTES = 1048576;
const DEFAULT_FILE_TIMEOUT_MS = 5e3;
const DEFAULT_EXEC_TIMEOUT_MS = 5e3;
const DEFAULT_EXEC_MAX_OUTPUT_BYTES = 1048576;
const SAFE_EXEC_ERROR_CODES = /* @__PURE__ */ new Set(["AMBIGUOUS_DUPLICATE_KEY", "NOT_FOUND"]);
function throwUnknownProviderResolutionError(params) {
	if (isSecretResolutionError(params.err)) throw params.err;
	const isWindowsPathSecurityFailure = process.platform === "win32" && (params.source === "file" || params.source === "exec") && params.err instanceof FsSafeError && params.err.code === "permission-unverified";
	throw providerResolutionError({
		...isWindowsPathSecurityFailure ? { code: "SECRET_PROVIDER_PATH_SECURITY_UNVERIFIABLE" } : {},
		source: params.source,
		provider: params.provider,
		message: formatErrorMessage(params.err),
		cause: params.err
	});
}
function resolveResolutionLimits() {
	return {
		maxProviderConcurrency: DEFAULT_PROVIDER_CONCURRENCY,
		maxRefsPerProvider: DEFAULT_MAX_REFS_PER_PROVIDER,
		maxBatchBytes: DEFAULT_MAX_BATCH_BYTES
	};
}
function resolveConfiguredProvider(params) {
	const { ref, config } = params;
	const providerConfig = config.secrets?.providers?.[ref.provider];
	if (isBuiltInDefaultSecretProviderRef(config, ref)) {
		if (ref.source === "env") return { source: "env" };
		if (ref.source === "store") return { source: "store" };
	}
	if (!providerConfig) throw providerResolutionError({
		code: "SECRET_PROVIDER_NOT_CONFIGURED",
		source: ref.source,
		provider: ref.provider,
		message: `Secret provider "${ref.provider}" is not configured (ref: ${ref.source}:${ref.provider}:${ref.id}).`
	});
	const configuredSource = resolveSecretRefProviderSourceMismatch(config, ref);
	if (configuredSource) throw providerResolutionError({
		code: "SECRET_PROVIDER_INVALID",
		source: ref.source,
		provider: ref.provider,
		message: `Secret provider "${ref.provider}" has source "${configuredSource}" but ref requests "${ref.source}".`
	});
	if (isPluginIntegrationSecretProviderConfig(providerConfig)) {
		const manifestRegistry = params.manifestRegistry ?? getCurrentPluginMetadataSnapshot({
			config,
			env: params.env,
			allowWorkspaceScopedSnapshot: true
		})?.manifestRegistry ?? loadPluginManifestRegistryCore({
			config,
			env: params.env
		});
		const resolved = resolveSecretProviderIntegrationConfig({
			manifestRegistry,
			providerAlias: ref.provider,
			providerConfig,
			config,
			env: params.env
		});
		if (!resolved.ok) throw providerResolutionError({
			source: ref.source,
			provider: ref.provider,
			message: `Secret provider "${ref.provider}" plugin integration is unavailable: ${resolved.reason}.`
		});
		return resolved.providerConfig;
	}
	return providerConfig;
}
async function readFileProviderPayload(params) {
	const cacheKey = params.providerName;
	const cache = params.cache;
	const read = async () => {
		const filePath = resolveUserPath(params.providerConfig.path);
		const timeoutMs = normalizePositiveTimerMs(params.providerConfig.timeoutMs, DEFAULT_FILE_TIMEOUT_MS);
		const maxBytes = normalizePositiveInt(params.providerConfig.maxBytes, DEFAULT_FILE_MAX_BYTES);
		try {
			const { buffer: payload } = await readSecureFile({
				filePath,
				label: `secrets.providers.${params.providerName}.path`,
				io: {
					maxBytes,
					timeoutMs
				},
				permissions: { allowInsecure: false }
			});
			const text = payload.toString("utf8").replace(/^\uFEFF/, "");
			if (params.providerConfig.mode === "singleValue") return text.replace(/\r?\n$/, "");
			const parsed = JSON.parse(text);
			if (!isRecord(parsed)) throw new Error(`File provider "${params.providerName}" payload is not a JSON object.`);
			return parsed;
		} catch (error) {
			if (error instanceof FsSafeError && error.code === "timeout") throw new Error(`File provider "${params.providerName}" timed out after ${timeoutMs}ms.`, { cause: error });
			throw error;
		}
	};
	if (!cache) return await read();
	cache.filePayloadByProvider ??= /* @__PURE__ */ new Map();
	return await getOrCreatePromise(cache.filePayloadByProvider, cacheKey, read);
}
async function resolveEnvRefs(params) {
	const resolved = /* @__PURE__ */ new Map();
	const allowlist = params.providerConfig.allowlist ? new Set(params.providerConfig.allowlist) : null;
	for (const ref of params.refs) {
		if (allowlist && !allowlist.has(ref.id)) {
			params.onRefError(refResolutionError({
				code: "SECRET_REF_POLICY_DENIED",
				source: "env",
				provider: params.providerName,
				refId: ref.id,
				message: `Environment variable "${ref.id}" is not allowlisted in secrets.providers.${params.providerName}.allowlist.`
			}));
			continue;
		}
		const envValue = params.env[ref.id];
		if (!isNonEmptyString(envValue)) {
			params.onRefError(refResolutionError({
				code: "SECRET_REF_NOT_FOUND",
				source: "env",
				provider: params.providerName,
				refId: ref.id,
				message: `Environment variable "${ref.id}" is missing or empty.`
			}));
			continue;
		}
		resolved.set(ref.id, envValue);
	}
	return resolved;
}
async function resolveFileRefs(params) {
	let payload;
	try {
		payload = await readFileProviderPayload({
			providerName: params.providerName,
			providerConfig: params.providerConfig,
			cache: params.cache
		});
	} catch (err) {
		throwUnknownProviderResolutionError({
			source: "file",
			provider: params.providerName,
			err
		});
	}
	const mode = params.providerConfig.mode ?? "json";
	const resolved = /* @__PURE__ */ new Map();
	if (mode === "singleValue") {
		for (const ref of params.refs) {
			if (ref.id !== "value") {
				params.onRefError(refResolutionError({
					code: "SECRET_REF_INVALID",
					source: "file",
					provider: params.providerName,
					refId: ref.id,
					message: `singleValue file provider "${params.providerName}" expects ref id "${SINGLE_VALUE_FILE_REF_ID}".`
				}));
				continue;
			}
			resolved.set(ref.id, payload);
		}
		return resolved;
	}
	for (const ref of params.refs) try {
		resolved.set(ref.id, readJsonPointer(payload, ref.id, { onMissing: "throw" }));
	} catch (err) {
		params.onRefError(refResolutionError({
			code: "SECRET_REF_NOT_FOUND",
			source: "file",
			provider: params.providerName,
			refId: ref.id,
			message: formatErrorMessage(err),
			cause: err
		}));
	}
	return resolved;
}
function parseExecValues(params) {
	const trimmed = params.stdout.trim();
	if (!trimmed) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" returned empty stdout.`
	});
	let parsed;
	if (!params.jsonOnly && params.ids.length === 1) try {
		parsed = JSON.parse(trimmed);
	} catch {
		return { [expectDefined(params.ids[0], "ids entry at 0")]: trimmed };
	}
	else try {
		parsed = JSON.parse(trimmed);
	} catch {
		throw providerResolutionError({
			source: "exec",
			provider: params.providerName,
			message: `Exec provider "${params.providerName}" returned invalid JSON.`
		});
	}
	if (!isRecord(parsed)) {
		if (!params.jsonOnly && params.ids.length === 1 && typeof parsed === "string") return { [expectDefined(params.ids[0], "ids entry at 0")]: parsed };
		throw providerResolutionError({
			source: "exec",
			provider: params.providerName,
			message: `Exec provider "${params.providerName}" response must be an object.`
		});
	}
	if (parsed.protocolVersion !== 1) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" protocolVersion must be 1.`
	});
	const responseValues = parsed.values;
	if (!isRecord(responseValues)) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" response missing "values".`
	});
	const responseErrors = isRecord(parsed.errors) ? parsed.errors : null;
	const out = {};
	for (const id of params.ids) {
		if (responseErrors && Object.hasOwn(responseErrors, id)) {
			const entry = responseErrors[id];
			const code = isRecord(entry) && typeof entry.code === "string" ? entry.code : null;
			const safeCode = code && SAFE_EXEC_ERROR_CODES.has(code) ? code : null;
			params.onRefError(refResolutionError({
				code: safeCode === "NOT_FOUND" ? "SECRET_REF_NOT_FOUND" : "SECRET_REF_PROVIDER_ERROR",
				source: "exec",
				provider: params.providerName,
				refId: id,
				message: `Exec provider "${params.providerName}" failed for id "${id}"${safeCode ? ` (${safeCode})` : ""}.`
			}));
			continue;
		}
		if (!Object.hasOwn(responseValues, id)) {
			params.onRefError(refResolutionError({
				code: "SECRET_REF_NOT_FOUND",
				source: "exec",
				provider: params.providerName,
				refId: id,
				message: `Exec provider "${params.providerName}" response missing id "${id}".`
			}));
			continue;
		}
		out[id] = responseValues[id];
	}
	return out;
}
async function resolveExecRefs(params) {
	const ids = uniqueStrings(params.refs.map((ref) => ref.id));
	if (ids.length > params.limits.maxRefsPerProvider) throw providerResolutionError({
		code: "SECRET_PROVIDER_INVALID",
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" exceeded maxRefsPerProvider (${params.limits.maxRefsPerProvider}).`
	});
	let secureCommandPath;
	try {
		secureCommandPath = await assertSecureExecCommandPath({
			command: params.providerConfig.command,
			label: `secrets.providers.${params.providerName}.command`,
			trustedDirs: params.providerConfig.trustedDirs
		});
	} catch (err) {
		throwUnknownProviderResolutionError({
			source: "exec",
			provider: params.providerName,
			err
		});
	}
	const input = JSON.stringify({
		protocolVersion: 1,
		provider: params.providerName,
		ids
	});
	if (Buffer.byteLength(input, "utf8") > params.limits.maxBatchBytes) throw providerResolutionError({
		code: "SECRET_PROVIDER_INVALID",
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" request exceeded maxBatchBytes (${params.limits.maxBatchBytes}).`
	});
	const childEnv = {};
	for (const key of params.providerConfig.passEnv ?? []) {
		const value = params.env[key];
		if (value !== void 0) childEnv[key] = value;
	}
	for (const [key, value] of Object.entries(params.providerConfig.env ?? {})) childEnv[key] = value;
	const timeoutMs = normalizePositiveTimerMs(params.providerConfig.timeoutMs, DEFAULT_EXEC_TIMEOUT_MS);
	const noOutputTimeoutMs = normalizePositiveTimerMs(params.providerConfig.noOutputTimeoutMs, timeoutMs);
	const maxOutputBytes = normalizePositiveInt(params.providerConfig.maxOutputBytes, DEFAULT_EXEC_MAX_OUTPUT_BYTES);
	const jsonOnly = params.providerConfig.jsonOnly ?? true;
	let result;
	try {
		result = await runCommandWithTimeout([secureCommandPath, ...params.providerConfig.args ?? []], {
			baseEnv: {},
			cwd: path.dirname(secureCommandPath),
			env: childEnv,
			input,
			killProcessTree: true,
			maxCombinedOutputBytes: maxOutputBytes,
			maxOutputBytes,
			noOutputTimeoutMs,
			outputCapture: "head",
			terminateOnOutputLimit: true,
			timeoutMs
		});
	} catch (err) {
		throwUnknownProviderResolutionError({
			source: "exec",
			provider: params.providerName,
			err
		});
	}
	if (result.termination === "timeout") throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" timed out after ${timeoutMs}ms.`
	});
	if (result.termination === "no-output-timeout") throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" produced no output for ${noOutputTimeoutMs}ms.`
	});
	if (result.outputLimitExceeded) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider output exceeded maxOutputBytes (${maxOutputBytes}).`
	});
	if (result.code !== 0) throw providerResolutionError({
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" exited with code ${String(result.code)}.`
	});
	let values;
	try {
		values = parseExecValues({
			providerName: params.providerName,
			ids,
			stdout: result.stdout,
			jsonOnly,
			onRefError: params.onRefError
		});
	} catch (err) {
		throwUnknownProviderResolutionError({
			source: "exec",
			provider: params.providerName,
			err
		});
	}
	return new Map(Object.entries(values));
}
async function resolveProviderRefs(params) {
	try {
		if (params.providerConfig.source === "env") return await resolveEnvRefs({
			refs: params.refs,
			providerName: params.providerName,
			onRefError: params.onRefError,
			providerConfig: params.providerConfig,
			env: params.options.env ?? process.env
		});
		if (params.providerConfig.source === "file") return await resolveFileRefs({
			refs: params.refs,
			providerName: params.providerName,
			onRefError: params.onRefError,
			providerConfig: params.providerConfig,
			cache: params.options.cache
		});
		if (params.providerConfig.source === "store") return resolveStoreRefs({
			refs: params.refs,
			providerName: params.providerName,
			onRefError: params.onRefError,
			database: { env: params.options.env ?? process.env }
		});
		if (params.providerConfig.source === "exec") {
			if (isPluginIntegrationSecretProviderConfig(params.providerConfig)) throw providerResolutionError({
				source: params.source,
				provider: params.providerName,
				message: `Secret provider "${params.providerName}" plugin integration was not materialized before exec resolution.`
			});
			return await resolveExecRefs({
				refs: params.refs,
				providerName: params.providerName,
				onRefError: params.onRefError,
				providerConfig: params.providerConfig,
				env: params.options.env ?? process.env,
				limits: params.limits
			});
		}
		throw providerResolutionError({
			source: params.source,
			provider: params.providerName,
			message: `Unsupported secret provider source "${String(params.providerConfig.source)}".`
		});
	} catch (err) {
		return throwUnknownProviderResolutionError({
			source: params.source,
			provider: params.providerName,
			err
		});
	}
}
function createProviderResolutionTasks(params) {
	return params.groups.map((group) => async () => {
		const refFailures = /* @__PURE__ */ new Map();
		const onRefError = (error) => {
			if (params.errorMode === "stop") throw error;
			refFailures.set(error.refId, error);
		};
		if (group.refs.length > params.limits.maxRefsPerProvider) throw providerResolutionError({
			code: "SECRET_PROVIDER_INVALID",
			source: group.source,
			provider: group.providerName,
			message: `Secret provider "${group.providerName}" exceeded maxRefsPerProvider (${params.limits.maxRefsPerProvider}).`
		});
		const providerConfig = resolveConfiguredProvider({
			ref: expectDefined(group.refs[0], "refs entry at 0"),
			config: params.options.config,
			env: params.options.env ?? process.env,
			manifestRegistry: params.options.manifestRegistry
		});
		const values = await resolveProviderRefs({
			refs: group.refs,
			source: group.source,
			providerName: group.providerName,
			providerConfig,
			options: params.options,
			limits: params.limits,
			onRefError
		});
		for (const ref of group.refs) {
			if (refFailures.has(ref.id)) continue;
			if (!values.has(ref.id)) {
				onRefError(refResolutionError({
					code: "SECRET_REF_PROVIDER_CONTRACT",
					source: group.source,
					provider: group.providerName,
					refId: ref.id,
					message: `Secret provider "${group.providerName}" did not return id "${ref.id}".`
				}));
				continue;
			}
			if (isRedactedSecretValue(values.get(ref.id))) onRefError(refResolutionError({
				code: "SECRET_REF_REDACTED_VALUE",
				source: group.source,
				provider: group.providerName,
				refId: ref.id,
				message: `Secret reference "${group.source}:${group.providerName}:${ref.id}" resolves to a redaction placeholder. Run openclaw doctor --fix to repair a store-backed Gateway token; supply a real credential for other secrets.`
			}));
		}
		return {
			group,
			values,
			refFailures
		};
	});
}
async function resolveSecretRefProviderGroups(params) {
	const groups = normalizeAndGroupSecretRefs(params.refs);
	const limits = resolveResolutionLimits();
	const errorsByIndex = /* @__PURE__ */ new Map();
	const taskResults = await runTasksWithConcurrency({
		tasks: createProviderResolutionTasks({
			groups,
			options: params.options,
			limits,
			errorMode: params.errorMode
		}),
		limit: limits.maxProviderConcurrency,
		errorMode: params.errorMode,
		onTaskError: (error, index) => {
			errorsByIndex.set(index, error);
		}
	});
	const resolved = /* @__PURE__ */ new Map();
	const failures = [];
	for (const result of taskResults.results) {
		if (!result) continue;
		for (const ref of result.group.refs) {
			const error = result.refFailures.get(ref.id);
			if (error) failures.push({
				group: result.group,
				error
			});
			else resolved.set(secretRefKey(ref), result.values.get(ref.id));
		}
	}
	for (const [index, group] of groups.entries()) if (errorsByIndex.has(index)) failures.push({
		group,
		error: errorsByIndex.get(index)
	});
	return {
		resolved,
		failures,
		hasError: taskResults.hasError,
		firstError: taskResults.firstError
	};
}
/** Resolves a batch of SecretRefs, grouped by provider for bounded provider concurrency. */
async function resolveSecretRefValues(refs, options) {
	const result = await resolveSecretRefProviderGroups({
		refs,
		options,
		errorMode: "stop"
	});
	if (result.hasError) throw result.firstError;
	return result.resolved;
}
/** Internal owner-isolation resolver that preserves one provider call per batch. */
async function resolveSecretRefValuesSettledByProvider(refs, options) {
	const result = await resolveSecretRefProviderGroups({
		refs,
		options,
		errorMode: "continue"
	});
	return {
		resolved: result.resolved,
		failures: result.failures
	};
}
/** Resolves one SecretRef, using the optional shared runtime cache. */
/** Resolves one SecretRef to an unknown value using configured provider state. */
async function resolveSecretRefValue(ref, options) {
	const cache = options.cache;
	const key = secretRefKey(ref);
	const resolve = async () => {
		const resolved = await resolveSecretRefValues([ref], options);
		if (!resolved.has(key)) throw refResolutionError({
			code: "SECRET_REF_PROVIDER_CONTRACT",
			source: ref.source,
			provider: ref.provider,
			refId: ref.id,
			message: `Secret reference "${key}" resolved to no value.`
		});
		return resolved.get(key);
	};
	if (!cache) return await resolve();
	cache.resolvedByRefKey ??= /* @__PURE__ */ new Map();
	return await getOrCreatePromise(cache.resolvedByRefKey, key, resolve);
}
/** Resolves one SecretRef and requires a non-empty string result. */
async function resolveSecretRefString(ref, options) {
	const resolved = await resolveSecretRefValue(ref, options);
	if (!isNonEmptyString(resolved)) throw new Error(`Secret reference "${ref.source}:${ref.provider}:${ref.id}" resolved to a non-string or empty value.`);
	return resolved;
}
//#endregion
export { resolveSecretRefValuesSettledByProvider as i, resolveSecretRefValue as n, resolveSecretRefValues as r, resolveSecretRefString as t };
