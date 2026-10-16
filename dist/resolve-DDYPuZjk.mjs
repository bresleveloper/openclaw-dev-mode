import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { t as FsSafeError, v as readSecureFile } from "./fs-safe-BUXBSN-4.mjs";
import { _ as secretRefKey, g as resolveSecretRefProviderSourceMismatch, i as SINGLE_VALUE_FILE_REF_ID, m as normalizeAndGroupSecretRefs, s as isBuiltInDefaultSecretProviderRef } from "./ref-contract-D0kWy5jy.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as SECRET_STORE_VALUE_MAX_BYTES } from "./secret-store-validation-error-Bu8SnJkb.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { n as isRedactedSecretValue } from "./redact-sentinel-f_PhnHTI.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-U3x0s0Ho.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { n as normalizePositiveInt, r as normalizePositiveTimerMs, t as isNonEmptyString } from "./shared-CvirZ99o.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { c as refResolutionError, o as isSecretResolutionError, s as providerResolutionError } from "./resolve-errors-DYenvPyo.mjs";
import { i as assertSecureExecCommandPath, r as resolveSecretProviderIntegrationConfig, t as isPluginIntegrationSecretProviderConfig } from "./provider-integrations-CoL46KV7.mjs";
import { n as readJsonPointer } from "./json-pointer-KSO1NjJH.mjs";
import { a as readSecretStoreValue } from "./secret-store-B2HXTuK3.mjs";
import path from "node:path";
//#region src/secrets/resolve-store.ts
const STORE_SECRET_REF_BATCH_MAX_BYTES = 512 * SECRET_STORE_VALUE_MAX_BYTES;
async function resolveStoreRefs(params) {
	const context = captureOpenClawStateReadWorkerContext(params.database);
	const resolved = /* @__PURE__ */ new Map();
	let resolvedBytes = 0;
	for (const ref of params.refs) {
		const result = await readSecretStoreValue({
			scope: { kind: "team" },
			name: ref.id,
			context
		});
		context.admission.assertCurrent();
		if (!result.ok) {
			if (result.error.code === "SECRET_STORE_NOT_FOUND" || result.error.code === "SECRET_STORE_INVALID_NAME") {
				params.onRefError(refResolutionError({
					code: result.error.code === "SECRET_STORE_NOT_FOUND" ? "SECRET_REF_NOT_FOUND" : "SECRET_REF_INVALID",
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
	const payload = await readFileProviderPayload({
		providerName: params.providerName,
		providerConfig: params.providerConfig,
		cache: params.cache
	});
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
	try {
		parsed = JSON.parse(trimmed);
	} catch {
		if (!params.jsonOnly && params.ids.length === 1) return { [expectDefined(params.ids[0], "ids entry at 0")]: trimmed };
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
	const secureCommandPath = await assertSecureExecCommandPath({
		command: params.providerConfig.command,
		label: `secrets.providers.${params.providerName}.command`,
		trustedDirs: params.providerConfig.trustedDirs
	});
	const input = JSON.stringify({
		protocolVersion: 1,
		provider: params.providerName,
		ids
	});
	if (Buffer.byteLength(input, "utf8") > DEFAULT_MAX_BATCH_BYTES) throw providerResolutionError({
		code: "SECRET_PROVIDER_INVALID",
		source: "exec",
		provider: params.providerName,
		message: `Exec provider "${params.providerName}" request exceeded maxBatchBytes (${DEFAULT_MAX_BATCH_BYTES}).`
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
	const result = await runCommandWithTimeout([secureCommandPath, ...params.providerConfig.args ?? []], {
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
	const values = parseExecValues({
		providerName: params.providerName,
		ids,
		stdout: result.stdout,
		jsonOnly,
		onRefError: params.onRefError
	});
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
		if (params.providerConfig.source === "store") return await resolveStoreRefs({
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
				env: params.options.env ?? process.env
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
		if (group.refs.length > DEFAULT_MAX_REFS_PER_PROVIDER) throw providerResolutionError({
			code: "SECRET_PROVIDER_INVALID",
			source: group.source,
			provider: group.providerName,
			message: `Secret provider "${group.providerName}" exceeded maxRefsPerProvider (${DEFAULT_MAX_REFS_PER_PROVIDER}).`
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
	const errorsByIndex = /* @__PURE__ */ new Map();
	const taskResults = await runTasksWithConcurrency({
		tasks: createProviderResolutionTasks({
			groups,
			options: params.options,
			errorMode: params.errorMode
		}),
		limit: DEFAULT_PROVIDER_CONCURRENCY,
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
