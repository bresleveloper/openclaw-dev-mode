import { n as __exportAll } from "./sqlite-readonly-rolldown-runtime-XITHOX9H.mjs";
import { O as isAbortError, V as containsEnvVarReference, ot as toStringifiedError, pt as resolveGlobalSingleton, t as createSubsystemLogger, ut as readGlobalSingleton, vt as normalizeOptionalLowercaseString, wt as isRecord, y as resolveStateDir } from "./sqlite-readonly-subsystem-DxzYbxOQ.mjs";
import { G as normalizeOpenClawStateSchemaReadError, c as OpenClawQuarantineReadCleanupError, g as runSqliteReadOnlyWorkerSync, h as runSqliteReadOnlyWorker, s as markOpenClawStateDatabaseFailure } from "./sqlite-readonly-sqlite-snapshot-staging-owner-DzwQ_rDP.mjs";
import { a as createSqliteWorkerOperationAdmission } from "./sqlite-readonly-worker-task-pool-CUbFmrb9.mjs";
import { dt as isPathInside, lt as hasNodeErrorCode } from "./sqlite-readonly-runtime-process-manifest-B1faCUt1.mjs";
import { $ as registerNodeSqliteDisposeCallback, $t as findSqlClosingParenthesis, C as require_semver, D as getNodeSqliteKysely, G as captureSqliteSchemaFacts, Lt as VERSION, Nt as stageSqliteTransactionState, On as throwSqliteLifecycleErrors, S as runSqliteReadOperationSync, Tt as revokeSqliteDatabaseAdmissionsForPath, Ut as runInDetachedAsyncContext, Y as clearNodeSqliteKyselyCacheForDatabase, _ as getAdmittedSqliteSchemaFacts, at as getOrLoadSqliteDatabaseAdmissionForPath, bn as isPostgresSqlConnection, bt as recordSqliteDatabaseIntegrity, ct as hasPendingSqliteDatabaseSchemaMutation, en as normalizeSchemaSql, et as registerNodeSqliteKyselyQueryErrorHandler, fn as normalizeDatabasePath, gn as readDatabasePathIdentitySync, ht as publishSqliteDatabaseAdmission, k as prepareSqliteQuerySync, l as resolveExistingSqliteFileUri, ln as assertExistingDatabaseIdentity, m as admitSqliteSchema, mt as prepareSqliteDatabaseCleanClose, ot as getSqliteDatabaseAdmission, q as schemaAdmission, s as openNodeSqliteDatabase, w as createSqliteQueryCache, wt as revokeSqliteDatabaseAdmissions, x as registerSqliteSchemaMutationListener, xn as sqlPublicationAnchor, y as isSqliteSchemaAdmissionCold } from "./sqlite-readonly-sqlite-busy-timeout-CPLgQzS6.mjs";
import { S as isSqliteCorruptionError, j as withSqliteNativeOpen } from "./sqlite-readonly-schemas-CYdKD5YK.mjs";
import { l as registerLiveSqliteSnapshotOwner, t as openSqliteReadOnlyDatabase } from "./sqlite-readonly-sqlite-snapshot-source-CcYaV2mA.mjs";
import { At as isSqliteSchemaVersionError, F as applyPrivateModeSync, G as observeOpenClawDatabaseMaintenanceResource, H as getOpenClawDatabaseMaintenanceScope, It as runSqliteImmediateTransactionSync, L as StateDatabaseReadAdmissionInvalidatedError, Ot as createNewerSqliteSchemaVersionError, Qt as tableExists, R as createOpenClawStateDatabaseAsyncLifecycle, U as isOpenClawDatabaseMaintenanceResourceOwned, V as getOpenClawDatabaseMaintenanceResourceScope, Wt as OPENCLAW_DATABASE_SCHEMA_DOCS_URL, Y as resolveDatabasePath, _t as isSqliteWalWorkerMaintained, et as resolveOpenClawStateSqlitePath, gt as registerSqliteCacheExitClose, jt as readSqliteUserVersion, m as assertStateDatabaseReadAllowed, on as getPostgresPhysicalFacts, ot as mergeProcessEnv, p as assertStateDatabaseAccessAllowed, tn as SqliteSchemaMismatchError, tt as resolveQuarantineStorePath, yt as registerSqliteWalWorkerMaintenance, z as isStateDatabaseReadAdmissionInvalidatedError, zn as isArtifactPreservingStateRead } from "./sqlite-readonly-location.worker.js";
import { a as sameSqliteFileGeneration, i as readStableSqliteFileGeneration, n as parseSqliteFileGeneration, o as serializeSqliteFileGeneration } from "./sqlite-readonly-sqlite-file-generation-B2tri0d6.mjs";
import { o as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-readonly-openclaw-state-read-request-Bx6fxAMd.mjs";
import path from "node:path";
import { existsSync, mkdirSync, realpathSync } from "node:fs";
import { isMainThread } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
import { performance } from "node:perf_hooks";
//#region src/daemon/constants.ts
const NODE_LAUNCH_AGENT_LABEL = "ai.openclaw.node";
const NODE_SYSTEMD_SERVICE_NAME = "openclaw-node";
const NODE_WINDOWS_TASK_NAME = "OpenClaw Node";
const NODE_SERVICE_MARKER = "openclaw";
const NODE_SERVICE_KIND = "node";
const NODE_WINDOWS_TASK_SCRIPT_NAME = "node.cmd";
function resolveNodeLaunchAgentLabel() {
	return NODE_LAUNCH_AGENT_LABEL;
}
function resolveNodeSystemdServiceName() {
	return NODE_SYSTEMD_SERVICE_NAME;
}
function resolveNodeWindowsTaskName() {
	return NODE_WINDOWS_TASK_NAME;
}
function resolveNodeServiceIdentityEnvironment() {
	return {
		OPENCLAW_LAUNCHD_LABEL: resolveNodeLaunchAgentLabel(),
		OPENCLAW_SYSTEMD_UNIT: resolveNodeSystemdServiceName(),
		OPENCLAW_WINDOWS_TASK_NAME: resolveNodeWindowsTaskName(),
		OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER: "1",
		OPENCLAW_TASK_SCRIPT_NAME: NODE_WINDOWS_TASK_SCRIPT_NAME,
		OPENCLAW_LOG_PREFIX: "node",
		OPENCLAW_SERVICE_MARKER: NODE_SERVICE_MARKER,
		OPENCLAW_SERVICE_KIND: NODE_SERVICE_KIND
	};
}
//#endregion
//#region src/utils/boolean.ts
const DEFAULT_TRUTHY = [
	"true",
	"1",
	"yes",
	"on"
];
const DEFAULT_FALSY = [
	"false",
	"0",
	"no",
	"off"
];
function asBoolean(value) {
	return typeof value === "boolean" ? value : void 0;
}
function parseBooleanValue(value, options = {}) {
	const booleanValue = asBoolean(value);
	if (booleanValue !== void 0) return booleanValue;
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized) return;
	if ((options.truthy ?? DEFAULT_TRUTHY).includes(normalized)) return true;
	if ((options.falsy ?? DEFAULT_FALSY).includes(normalized)) return false;
}
//#endregion
//#region src/infra/fs-safe-env.ts
const nativeModeKey = "OPENCLAW_FS_SAFE_NATIVE_MODE";
const legacyModeKeys = ["FS_SAFE_PYTHON_MODE", "OPENCLAW_FS_SAFE_PYTHON_MODE"];
const legacyKeys = [
	...legacyModeKeys,
	"FS_SAFE_PYTHON",
	"OPENCLAW_FS_SAFE_PYTHON",
	"OPENCLAW_PINNED_PYTHON",
	"OPENCLAW_PINNED_WRITE_PYTHON"
];
const fallbacks = /* @__PURE__ */ new WeakMap();
let warned = false;
function nativeModeIsValid(value) {
	const normalized = value?.trim().toLowerCase() ?? "";
	return /^(?:0|false|off|never|1|true|on|auto|required|require)$/u.test(normalized);
}
function currentFallback(env) {
	const fallback = fallbacks.get(env);
	return fallback && env[fallback.key] === fallback.value ? fallback : void 0;
}
/** Read the operator/config inputs without promoting a derived native fallback. */
function fsSafeEnvInput(env) {
	const fallback = currentFallback(env);
	if (!fallback) return env;
	const input = {
		...env,
		[fallback.key]: fallback.previous
	};
	if (!fallback.existed) delete input[fallback.key];
	return input;
}
/** Retire our unchanged projection before an environment owner writes real inputs. */
function clearFsSafeEnvFallback(env) {
	const fallback = currentFallback(env);
	fallbacks.delete(env);
	if (!fallback) return;
	if (!fallback.existed) delete env[fallback.key];
	else env[fallback.key] = fallback.previous;
}
/** Preserve OpenClaw's retired Python mode env contract below both native names. */
function normalizeFsSafeNativeEnv(env = process.env) {
	clearFsSafeEnvFallback(env);
	const configured = legacyKeys.filter((key) => env[key] !== void 0);
	if (configured.length && env === process.env && !warned) {
		warned = true;
		process.emitWarning(`${configured.join(", ")} is deprecated. OpenClaw maps legacy mode values to native mode only when neither FS_SAFE_NATIVE_MODE nor OPENCLAW_FS_SAFE_NATIVE_MODE selects a mode. Replace Python mode variables with native mode variables; interpreter path settings are ignored.`, {
			code: "FS_SAFE_PYTHON_DEPRECATED",
			type: "DeprecationWarning"
		});
	}
	if (nativeModeIsValid(env.FS_SAFE_NATIVE_MODE) || nativeModeIsValid(env[nativeModeKey])) return;
	const value = legacyModeKeys.map((key) => env[key]).find((entry) => entry !== void 0);
	if (value === void 0) return;
	const keys = Object.keys(env);
	const key = !keys.includes(nativeModeKey) && Object.hasOwn(env, nativeModeKey) ? keys.find((candidate) => candidate.toUpperCase() === nativeModeKey) ?? nativeModeKey : nativeModeKey;
	const existed = Object.hasOwn(env, key);
	const previous = env[key];
	env[key] = value;
	fallbacks.set(env, {
		key,
		value,
		previous,
		existed
	});
}
//#endregion
//#region src/infra/env.ts
const ENV_NORMALIZATION_KEY_GROUPS = [["ZAI_API_KEY", "Z_AI_API_KEY"]];
/** Normalizes the legacy Z_AI_API_KEY spelling into the canonical ZAI_API_KEY env var. */
function normalizeZaiEnv(env = process.env) {
	if (!env.ZAI_API_KEY?.trim() && env.Z_AI_API_KEY?.trim()) env.ZAI_API_KEY = env.Z_AI_API_KEY;
}
/** Expands env keys to include aliases that process-wide normalization treats as equivalent. */
function expandEnvNormalizationKeys(keys) {
	const expanded = /* @__PURE__ */ new Set();
	for (const key of keys) for (const normalizedKey of resolveEnvNormalizationKeys(key)) expanded.add(normalizedKey);
	return expanded;
}
/** Resolves one env key to its canonical-first runtime normalization group. */
function resolveEnvNormalizationKeys(key) {
	const normalizedKey = process.platform === "win32" ? key.toUpperCase() : key;
	return ENV_NORMALIZATION_KEY_GROUPS.find((group) => group.some((candidate) => candidate === normalizedKey)) ?? [normalizedKey];
}
/** Interprets common human/operator truthy env strings. */
function isTruthyEnvValue(value) {
	return parseBooleanValue(value) === true;
}
//#endregion
//#region src/infra/host-env-security-policy.json
var host_env_security_policy_default = {
	blockedEverywhereKeys: [
		"NODE_OPTIONS",
		"NODE_PATH",
		"NODE_REDIRECT_WARNINGS",
		"NODE_REPL_EXTERNAL_MODULE",
		"NODE_REPL_HISTORY",
		"NODE_V8_COVERAGE",
		"PYTHONHOME",
		"PYTHONPATH",
		"PERL5LIB",
		"PERL5OPT",
		"RUBYLIB",
		"RUBYOPT",
		"BASHOPTS",
		"BASH_ENV",
		"ENV",
		"KSH_ENV",
		"BROWSER",
		"GIT_ALLOW_PROTOCOL",
		"GIT_EDITOR",
		"GIT_EXTERNAL_DIFF",
		"GIT_DIR",
		"GIT_WORK_TREE",
		"GIT_COMMON_DIR",
		"GIT_EXEC_PATH",
		"GIT_INDEX_FILE",
		"GIT_OBJECT_DIRECTORY",
		"GIT_ALTERNATE_OBJECT_DIRECTORIES",
		"GIT_NAMESPACE",
		"GIT_PROTOCOL_FROM_USER",
		"GIT_SEQUENCE_EDITOR",
		"GIT_TEMPLATE_DIR",
		"GIT_SSL_NO_VERIFY",
		"GIT_SSL_CAINFO",
		"GIT_SSL_CAPATH",
		"CC",
		"CPP",
		"CXX",
		"CXXCPP",
		"CARGO_BUILD_RUSTC",
		"CARGO_BUILD_RUSTC_WRAPPER",
		"CARGO_BUILD_RUSTC_WORKSPACE_WRAPPER",
		"CARGO_BUILD_RUSTDOC",
		"RUSTC",
		"RUSTC_WRAPPER",
		"RUSTC_WORKSPACE_WRAPPER",
		"RUSTDOC",
		"CMAKE_C_COMPILER",
		"CMAKE_CXX_COMPILER",
		"SHELL",
		"SHELLOPTS",
		"PS4",
		"GCONV_PATH",
		"IFS",
		"SSLKEYLOGFILE",
		"JAVA_OPTS",
		"JAVA_TOOL_OPTIONS",
		"_JAVA_OPTIONS",
		"JDK_JAVA_OPTIONS",
		"PYTHONBREAKPOINT",
		"DOTNET_STARTUP_HOOKS",
		"DOTNET_ADDITIONAL_DEPS",
		"FPATH",
		"GLIBC_TUNABLES",
		"MAVEN_OPTS",
		"MAKE",
		"MAKEFLAGS",
		"MFLAGS",
		"SBT_OPTS",
		"GRADLE_OPTS",
		"ANT_OPTS",
		"HGRCPATH",
		"HGEDITOR",
		"HGMERGE",
		"EXINIT",
		"VIMINIT",
		"MYVIMRC",
		"GVIMINIT",
		"LUA_INIT",
		"LUA_INIT_5_1",
		"LUA_INIT_5_2",
		"LUA_INIT_5_3",
		"LUA_INIT_5_4",
		"EMACSLOADPATH",
		"RUBYSHELL",
		"GIT_HOOK_PATH",
		"SVN_EDITOR",
		"SVN_SSH",
		"BZR_EDITOR",
		"BZR_SSH",
		"BZR_PLUGIN_PATH",
		"SUDO_ASKPASS",
		"JULIA_EDITOR",
		"CONFIG_SITE",
		"CONFIG_SHELL",
		"CMAKE_TOOLCHAIN_FILE",
		"CATALINA_OPTS",
		"CORECLR_PROFILER",
		"HELM_PLUGINS",
		"PACKER_PLUGIN_PATH",
		"VAGRANT_VAGRANTFILE",
		"ERL_AFLAGS",
		"ERL_FLAGS",
		"ERL_ZFLAGS",
		"ELIXIR_ERL_OPTIONS",
		"R_ENVIRON",
		"R_PROFILE",
		"R_ENVIRON_USER",
		"R_PROFILE_USER",
		"TCLLIBPATH",
		"HOSTALIASES"
	],
	blockedOverrideOnlyKeys: [
		"HOME",
		"GRADLE_USER_HOME",
		"ZDOTDIR",
		"GIT_DIR",
		"GIT_WORK_TREE",
		"GIT_COMMON_DIR",
		"GIT_INDEX_FILE",
		"GIT_OBJECT_DIRECTORY",
		"GIT_ALTERNATE_OBJECT_DIRECTORIES",
		"GIT_NAMESPACE",
		"GIT_SSH_COMMAND",
		"GIT_SSH",
		"GIT_PROXY_COMMAND",
		"GIT_ASKPASS",
		"GIT_SSL_NO_VERIFY",
		"GIT_SSL_CAINFO",
		"GIT_SSL_CAPATH",
		"SSH_ASKPASS",
		"LESSOPEN",
		"LESSCLOSE",
		"PAGER",
		"MANPAGER",
		"GIT_PAGER",
		"EDITOR",
		"VISUAL",
		"FCEDIT",
		"SUDO_EDITOR",
		"PROMPT_COMMAND",
		"HISTFILE",
		"PERL5DB",
		"PERL5DBCMD",
		"OPENSSL_CONF",
		"OPENSSL_ENGINES",
		"PYTHONSTARTUP",
		"WGETRC",
		"CURL_HOME",
		"CLASSPATH",
		"CFLAGS",
		"CGO_CFLAGS",
		"CGO_LDFLAGS",
		"GOFLAGS",
		"MAKEFLAGS",
		"MFLAGS",
		"CORECLR_PROFILER_PATH",
		"PHPRC",
		"PHP_INI_SCAN_DIR",
		"DENO_DIR",
		"BUN_CONFIG_REGISTRY",
		"YARN_RC_FILENAME",
		"HTTP_PROXY",
		"HTTPS_PROXY",
		"ALL_PROXY",
		"NO_PROXY",
		"NODE_TLS_REJECT_UNAUTHORIZED",
		"NODE_EXTRA_CA_CERTS",
		"SSL_CERT_FILE",
		"SSL_CERT_DIR",
		"REQUESTS_CA_BUNDLE",
		"CURL_CA_BUNDLE",
		"DOCKER_HOST",
		"DOCKER_TLS_VERIFY",
		"DOCKER_CERT_PATH",
		"PIP_INDEX_URL",
		"PIP_PYPI_URL",
		"PIP_EXTRA_INDEX_URL",
		"PIP_CONFIG_FILE",
		"PIP_FIND_LINKS",
		"PIP_TRUSTED_HOST",
		"UV_INDEX",
		"UV_INDEX_URL",
		"UV_PYTHON",
		"UV_EXTRA_INDEX_URL",
		"UV_DEFAULT_INDEX",
		"DOCKER_CONTEXT",
		"LIBRARY_PATH",
		"LDFLAGS",
		"CPATH",
		"C_INCLUDE_PATH",
		"CPLUS_INCLUDE_PATH",
		"OBJC_INCLUDE_PATH",
		"GOPROXY",
		"GONOSUMCHECK",
		"GONOSUMDB",
		"GONOPROXY",
		"GOPRIVATE",
		"GOENV",
		"GOPATH",
		"HGRCPATH",
		"PYTHONUSERBASE",
		"RUSTC_WRAPPER",
		"RUSTFLAGS",
		"RUSTUP_DIST_ROOT",
		"RUSTUP_DIST_SERVER",
		"RUSTUP_HOME",
		"RUSTUP_TOOLCHAIN",
		"RUSTUP_UPDATE_ROOT",
		"CARGO_HOME",
		"VIRTUAL_ENV",
		"LUA_PATH",
		"LUA_CPATH",
		"GEM_HOME",
		"GEM_PATH",
		"BUNDLE_GEMFILE",
		"COMPOSER_HOME",
		"CONDA_DEFAULT_ENV",
		"CONDA_PREFIX",
		"CARGO_BUILD_RUSTC_WRAPPER",
		"XDG_CACHE_HOME",
		"XDG_CONFIG_DIRS",
		"XDG_CONFIG_HOME",
		"XDG_DATA_DIRS",
		"XDG_DATA_HOME",
		"XDG_RUNTIME_DIR",
		"XDG_STATE_HOME",
		"AWS_CONFIG_FILE",
		"KUBECONFIG",
		"GOOGLE_APPLICATION_CREDENTIALS",
		"AWS_SHARED_CREDENTIALS_FILE",
		"AWS_WEB_IDENTITY_TOKEN_FILE",
		"AZURE_AUTH_LOCATION",
		"HELM_HOME",
		"ANSIBLE_CONFIG",
		"ANSIBLE_LIBRARY",
		"ANSIBLE_CALLBACK_PLUGINS",
		"ANSIBLE_COLLECTIONS_PATH",
		"ANSIBLE_CONNECTION_PLUGINS",
		"ANSIBLE_FILTER_PLUGINS",
		"ANSIBLE_INVENTORY_PLUGINS",
		"ANSIBLE_LOOKUP_PLUGINS",
		"ANSIBLE_MODULE_UTILS",
		"ANSIBLE_REMOTE_TEMP",
		"ANSIBLE_ROLES_PATH",
		"ANSIBLE_STRATEGY_PLUGINS",
		"R_LIBS_USER",
		"TF_CLI_CONFIG_FILE",
		"TF_PLUGIN_CACHE_DIR",
		"AMQP_URL",
		"AWS_ACCESS_KEY_ID",
		"AWS_CONTAINER_CREDENTIALS_FULL_URI",
		"AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
		"AWS_SECRET_ACCESS_KEY",
		"AWS_SECURITY_TOKEN",
		"AWS_SESSION_TOKEN",
		"AZURE_CLIENT_ID",
		"AZURE_CLIENT_SECRET",
		"DATABASE_URL",
		"GH_TOKEN",
		"GITHUB_TOKEN",
		"GITLAB_TOKEN",
		"MONGODB_URI",
		"NODE_AUTH_TOKEN",
		"NPM_TOKEN",
		"REDIS_URL",
		"SSH_AUTH_SOCK",
		"SYSTEMROOT",
		"WINDIR"
	],
	allowedInheritedOverrideOnlyKeys: [
		"ALL_PROXY",
		"AWS_CONFIG_FILE",
		"AWS_SHARED_CREDENTIALS_FILE",
		"AWS_WEB_IDENTITY_TOKEN_FILE",
		"AZURE_AUTH_LOCATION",
		"CURL_CA_BUNDLE",
		"DOCKER_CERT_PATH",
		"DOCKER_CONTEXT",
		"DOCKER_HOST",
		"DOCKER_TLS_VERIFY",
		"GIT_PAGER",
		"GOOGLE_APPLICATION_CREDENTIALS",
		"GRADLE_USER_HOME",
		"HISTFILE",
		"HOME",
		"HTTPS_PROXY",
		"HTTP_PROXY",
		"KUBECONFIG",
		"MANPAGER",
		"NODE_EXTRA_CA_CERTS",
		"NODE_TLS_REJECT_UNAUTHORIZED",
		"NO_PROXY",
		"PAGER",
		"REQUESTS_CA_BUNDLE",
		"RUSTUP_DIST_ROOT",
		"RUSTUP_DIST_SERVER",
		"RUSTUP_HOME",
		"RUSTUP_TOOLCHAIN",
		"RUSTUP_UPDATE_ROOT",
		"SSH_AUTH_SOCK",
		"SSL_CERT_DIR",
		"SSL_CERT_FILE",
		"SYSTEMROOT",
		"WINDIR",
		"XDG_CACHE_HOME",
		"XDG_CONFIG_DIRS",
		"XDG_CONFIG_HOME",
		"XDG_DATA_DIRS",
		"XDG_DATA_HOME",
		"XDG_RUNTIME_DIR",
		"XDG_STATE_HOME",
		"ZDOTDIR"
	],
	blockedOverridePrefixes: [
		"GIT_CONFIG_",
		"NPM_CONFIG_",
		"CARGO_REGISTRIES_",
		"TF_VAR_"
	],
	blockedPrefixes: [
		"DYLD_",
		"LD_",
		"BASH_FUNC_"
	]
};
//#endregion
//#region src/infra/host-env-security-policy.js
function sortUniqueUppercase(values) {
	return Object.freeze(Array.from(new Set(values.map((value) => value.toUpperCase()))).toSorted((left, right) => left < right ? -1 : left > right ? 1 : 0));
}
function derivePolicyArrays(policy) {
	const blockedEverywhereKeys = policy.blockedEverywhereKeys ?? [];
	const blockedOverrideOnlyKeys = policy.blockedOverrideOnlyKeys ?? [];
	const allowedInheritedOverrideOnlyKeys = policy.allowedInheritedOverrideOnlyKeys ?? [];
	const allowedInheritedOverrideOnlyUpper = new Set(allowedInheritedOverrideOnlyKeys.map((value) => value.toUpperCase()));
	const blockedPrefixes = policy.blockedPrefixes ?? [];
	const blockedOverridePrefixes = policy.blockedOverridePrefixes ?? [];
	const blockedInheritedPrefixes = policy.blockedInheritedPrefixes ?? blockedPrefixes;
	return {
		blockedInheritedKeys: sortUniqueUppercase([...blockedEverywhereKeys, ...blockedOverrideOnlyKeys.filter((value) => !allowedInheritedOverrideOnlyUpper.has(value.toUpperCase()))]),
		blockedInheritedPrefixes: sortUniqueUppercase(blockedInheritedPrefixes),
		blockedKeys: sortUniqueUppercase(blockedEverywhereKeys),
		blockedOverrideKeys: sortUniqueUppercase(blockedOverrideOnlyKeys),
		blockedPrefixes: sortUniqueUppercase(blockedPrefixes),
		blockedOverridePrefixes: sortUniqueUppercase(blockedOverridePrefixes)
	};
}
/**
* Normalizes raw host environment policy JSON into immutable lookup arrays.
*/
function loadHostEnvSecurityPolicy(rawPolicy = host_env_security_policy_default) {
	const derived = derivePolicyArrays(rawPolicy);
	return Object.freeze({
		blockedEverywhereKeys: Object.freeze(rawPolicy.blockedEverywhereKeys ?? []),
		blockedOverrideOnlyKeys: Object.freeze(rawPolicy.blockedOverrideOnlyKeys ?? []),
		allowedInheritedOverrideOnlyKeys: Object.freeze(rawPolicy.allowedInheritedOverrideOnlyKeys ?? []),
		blockedInheritedKeys: derived.blockedInheritedKeys,
		blockedInheritedPrefixes: derived.blockedInheritedPrefixes,
		blockedPrefixes: derived.blockedPrefixes,
		blockedOverridePrefixes: derived.blockedOverridePrefixes,
		blockedKeys: derived.blockedKeys,
		blockedOverrideKeys: derived.blockedOverrideKeys
	});
}
/**
* Process-wide host environment security policy derived from generated JSON.
*/
const HOST_ENV_SECURITY_POLICY = loadHostEnvSecurityPolicy();
//#endregion
//#region src/infra/host-env-security.ts
const PORTABLE_ENV_VAR_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/;
const HOST_DANGEROUS_ENV_KEYS = new Set(HOST_ENV_SECURITY_POLICY.blockedKeys);
new Set(HOST_ENV_SECURITY_POLICY.blockedInheritedKeys);
const HOST_DANGEROUS_OVERRIDE_ENV_KEYS = new Set(HOST_ENV_SECURITY_POLICY.blockedOverrideKeys);
[...Object.keys(resolveNodeServiceIdentityEnvironment())];
const CARGO_TARGET_EXECUTABLE_OVERRIDE_ENV_KEY = /^CARGO_TARGET_[A-Z0-9_]+_(?:LINKER|RUNNER)$/;
new AsyncLocalStorage();
function normalizeEnvVarKey(rawKey, options) {
	const key = rawKey.trim();
	if (!key) return null;
	if (options?.portable && !PORTABLE_ENV_VAR_KEY.test(key)) return null;
	return key;
}
function isDangerousHostEnvVarName(rawKey) {
	const upper = normalizeEnvVarKey(rawKey)?.toUpperCase();
	return upper !== void 0 && (HOST_DANGEROUS_ENV_KEYS.has(upper) || HOST_ENV_SECURITY_POLICY.blockedPrefixes.some((prefix) => upper.startsWith(prefix)));
}
function isDangerousHostEnvOverrideVarName(rawKey) {
	const upper = normalizeEnvVarKey(rawKey)?.toUpperCase();
	return upper !== void 0 && (HOST_DANGEROUS_OVERRIDE_ENV_KEYS.has(upper) || CARGO_TARGET_EXECUTABLE_OVERRIDE_ENV_KEY.test(upper) || HOST_ENV_SECURITY_POLICY.blockedOverridePrefixes.some((prefix) => upper.startsWith(prefix)));
}
require_semver();
//#endregion
//#region src/config/config-env-values.ts
/** Returns whether a config-controlled environment entry is safe to apply at runtime. */
function isConfigRuntimeEnvVarAllowed(key, value) {
	const upperKey = key.toUpperCase();
	return Boolean(value.trim()) && upperKey !== "OPENCLAW_ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS" && upperKey !== "OPENCLAW_INCLUDE_ROOTS" && upperKey !== "OPENCLAW_CONFIG_READONLY" && !isDangerousHostEnvVarName(key) && !isDangerousHostEnvOverrideVarName(key) && !containsEnvVarReference(value);
}
/** Collects config env vars safe to inject into runtime process environments. */
function collectConfigRuntimeEnvVars(cfg) {
	const envConfig = cfg?.env;
	if (!envConfig) return {};
	const entries = {};
	const candidates = [...Object.entries(envConfig.vars ?? {}), ...Object.entries(envConfig).filter(([key]) => key !== "shellEnv" && key !== "vars")];
	for (const [rawKey, value] of candidates) {
		if (typeof value !== "string") continue;
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (key && isConfigRuntimeEnvVarAllowed(key, value)) entries[key] = value;
	}
	return entries;
}
function findCaseInsensitiveEnvKey(env, key) {
	if (Object.hasOwn(env, key)) return key;
	const upperKey = key.toUpperCase();
	return Object.keys(env).find((candidate) => candidate.toUpperCase() === upperKey);
}
function envSnapshotKey(key) {
	return process.platform === "win32" ? key.toUpperCase() : key;
}
function indexConfigRuntimeEnvValues(entries) {
	const allowedValues = /* @__PURE__ */ new Map();
	for (const [key, value] of Object.entries(entries)) for (const normalizedKey of resolveEnvNormalizationKeys(key)) {
		const values = allowedValues.get(normalizedKey) ?? /* @__PURE__ */ new Set();
		values.add(value);
		allowedValues.set(normalizedKey, values);
	}
	return allowedValues;
}
//#endregion
//#region src/config/config-env-vars.ts
const appliedConfigEnvOwnership = /* @__PURE__ */ new WeakMap();
function resolveAppliedConfigEnvOwnership(env) {
	return {
		...appliedConfigEnvOwnership.get(env),
		...env === process.env ? publishedConfigRuntimeEnvState.ownedEnv : {}
	};
}
new AsyncLocalStorage();
function cloneEnvWithPlatformSemantics(env) {
	let cloned = { ...fsSafeEnvInput(env) };
	if (process.platform === "win32") cloned = new Proxy(cloned, {
		deleteProperty(target, property) {
			if (typeof property !== "string") return Reflect.deleteProperty(target, property);
			const key = findCaseInsensitiveEnvKey(target, property);
			return key ? Reflect.deleteProperty(target, key) : true;
		},
		get(target, property, receiver) {
			if (typeof property !== "string") return Reflect.get(target, property, receiver);
			const key = findCaseInsensitiveEnvKey(target, property);
			return key ? target[key] : Reflect.get(target, property, receiver);
		},
		getOwnPropertyDescriptor(target, property) {
			if (typeof property !== "string") return Reflect.getOwnPropertyDescriptor(target, property);
			const key = findCaseInsensitiveEnvKey(target, property);
			if (!key) return;
			return {
				configurable: true,
				enumerable: true,
				value: target[key],
				writable: true
			};
		},
		has(target, property) {
			return typeof property === "string" ? findCaseInsensitiveEnvKey(target, property) !== void 0 : Reflect.has(target, property);
		},
		set(target, property, value) {
			if (typeof property !== "string") return Reflect.set(target, property, value);
			target[findCaseInsensitiveEnvKey(target, property) ?? property] = value;
			return true;
		}
	});
	appliedConfigEnvOwnership.set(cloned, resolveAppliedConfigEnvOwnership(env));
	normalizeFsSafeNativeEnv(cloned);
	return cloned;
}
let publishedConfigRuntimeEnvState = {
	generation: 0,
	ownedEnv: {},
	sourceConfig: null
};
function collectConfigRuntimeEnvOwnership(sourceConfig, before, after, options = {}) {
	const beforeInput = fsSafeEnvInput(before);
	const afterInput = fsSafeEnvInput(after);
	const ownedEnv = {};
	const replacedLowerPrecedenceKeys = new Set((options.replacedLowerPrecedenceKeys ?? []).map(envSnapshotKey));
	for (const [key, value] of Object.entries(collectConfigRuntimeEnvVars(sourceConfig))) for (const normalizedKey of resolveEnvNormalizationKeys(key)) {
		const afterKey = findCaseInsensitiveEnvKey(afterInput, normalizedKey);
		if (!afterKey || afterInput[afterKey] !== value) continue;
		const beforeKey = findCaseInsensitiveEnvKey(beforeInput, normalizedKey);
		if (beforeKey && beforeInput[beforeKey] === value && !replacedLowerPrecedenceKeys.has(envSnapshotKey(afterKey))) continue;
		ownedEnv[afterKey] = value;
	}
	return ownedEnv;
}
function filterConfigRuntimeEnvOwnership(sourceConfig, env, ownedEnv) {
	const input = fsSafeEnvInput(env);
	const allowedValues = indexConfigRuntimeEnvValues(collectConfigRuntimeEnvVars(sourceConfig));
	const filtered = {};
	for (const [key, value] of Object.entries(ownedEnv)) {
		const normalizedKey = resolveEnvNormalizationKeys(key)[0] ?? key;
		const actualKey = findCaseInsensitiveEnvKey(input, key);
		if (actualKey && input[actualKey] === value && allowedValues.get(normalizedKey)?.has(value)) filtered[actualKey] = value;
	}
	return filtered;
}
/** Applies config env vars to an environment without overwriting existing non-empty values. */
function applyConfigEnvVars(cfg, env = process.env, options = {}) {
	clearFsSafeEnvFallback(env);
	const before = { ...env };
	const previousOwnedEnv = resolveAppliedConfigEnvOwnership(env);
	const entries = collectConfigRuntimeEnvVars(cfg);
	const lowerPrecedenceEntries = Object.entries(options.lowerPrecedenceEnv ?? {});
	const lowerPrecedenceEnv = new Map(lowerPrecedenceEntries.map(([key, value]) => [envSnapshotKey(key), value]));
	const configEnvKeys = expandEnvNormalizationKeys(Object.keys(entries));
	const configValuesByKey = indexConfigRuntimeEnvValues(entries);
	const higherPrecedenceValues = /* @__PURE__ */ new Map();
	for (const key of Object.keys(entries)) {
		const normalizedKeys = resolveEnvNormalizationKeys(key);
		const winningValue = normalizedKeys.map((normalizedKey) => [normalizedKey, env[normalizedKey]]).find(([normalizedKey, currentValue]) => currentValue?.trim() && lowerPrecedenceEnv.get(normalizedKey) !== currentValue && !configValuesByKey.get(normalizedKey)?.has(currentValue))?.[1];
		if (winningValue !== void 0) for (const normalizedKey of normalizedKeys) higherPrecedenceValues.set(normalizedKey, winningValue);
	}
	const replacedLowerPrecedenceKeys = [];
	for (const [key, value] of lowerPrecedenceEntries) if (configEnvKeys.has(envSnapshotKey(key)) && env[key] === value) {
		delete env[key];
		replacedLowerPrecedenceKeys.push(key);
	}
	if (replacedLowerPrecedenceKeys.length > 0) options.onLowerPrecedenceKeysReplaced?.(replacedLowerPrecedenceKeys);
	for (const [key, value] of Object.entries(entries)) {
		const higherPrecedenceValue = higherPrecedenceValues.get(envSnapshotKey(key));
		if (higherPrecedenceValue !== void 0) {
			env[key] = higherPrecedenceValue;
			continue;
		}
		const currentValue = env[key];
		if (currentValue?.trim() && lowerPrecedenceEnv.get(envSnapshotKey(key)) !== currentValue) continue;
		env[key] = value;
	}
	normalizeZaiEnv(env);
	appliedConfigEnvOwnership.set(env, {
		...filterConfigRuntimeEnvOwnership(cfg, env, previousOwnedEnv),
		...collectConfigRuntimeEnvOwnership(cfg, before, env, { replacedLowerPrecedenceKeys })
	});
	normalizeFsSafeNativeEnv(env);
}
//#endregion
//#region src/state/openclaw-state-db-admission.ts
function getStateSchemaFacts(database) {
	return isPostgresSqlConnection(database) ? getPostgresPhysicalFacts(database) : getAdmittedSqliteSchemaFacts(database);
}
const versionKey = {
	name: "state.schema-version",
	schemaDependent: true,
	read(value) {
		if (typeof value === "object" && value !== null && "userVersion" in value && typeof value.userVersion === "number" && "contentVersion" in value && typeof value.contentVersion === "number") return {
			userVersion: value.userVersion,
			contentVersion: value.contentVersion
		};
	}
};
/** Row-backed metadata is valid only for its admitted schema, even if replacement DDL has the same shape. */
function createStateSchemaAdmission(name, read) {
	const key = {
		name,
		schemaDependent: true,
		read(input) {
			if (typeof input !== "object" || input === null || !("value" in input) || !("admissionId" in input) || typeof input.admissionId !== "string") return;
			const value = read(input.value);
			return value === void 0 ? void 0 : {
				value,
				admissionId: input.admissionId
			};
		}
	};
	return {
		get(database) {
			if (hasPendingSqliteDatabaseSchemaMutation(database)) return;
			const admitted = getSqliteDatabaseAdmission(database, key);
			if (!admitted) return;
			const schema = getStateSchemaFacts(database);
			return admitted.admissionId === schema?.admissionId ? admitted.value : void 0;
		},
		publish(database, value) {
			if (!isPostgresSqlConnection(database) && isSqliteSchemaAdmissionCold(database)) admitSqliteSchema(database);
			const schema = getStateSchemaFacts(database);
			if (!schema || !isPostgresSqlConnection(database) && getSqliteDatabaseAdmission(database, schemaAdmission)?.admissionId !== schema.admissionId) return;
			getStateSchemaVersionAdmission(database);
			const admitted = {
				value,
				admissionId: schema.admissionId
			};
			publishSqliteDatabaseAdmission(database, key, admitted);
		}
	};
}
const runtimeAdmission = createStateSchemaAdmission("state.runtime-schema", (value) => typeof value === "object" && value !== null && "startupReady" in value && typeof value.startupReady === "boolean" ? { startupReady: value.startupReady } : void 0);
const connectionVersions = /* @__PURE__ */ new WeakMap();
function rememberConnectionVersion(database, value) {
	const previous = connectionVersions.get(database);
	const install = (entry) => {
		if (entry) connectionVersions.set(database, entry);
		else connectionVersions.delete(database);
	};
	if (!stageSqliteTransactionState(database, {
		stage: () => install(value),
		commit: () => {},
		rollback: () => install(previous)
	})) install(value);
}
function schemaVersionKey(admissionId) {
	return {
		name: `state.schema-version:${admissionId}`,
		read: versionKey.read
	};
}
function getStateSchemaVersionAdmission(database) {
	const schema = getStateSchemaFacts(database);
	if (!schema) return;
	const retained = connectionVersions.get(database);
	if (retained?.schema === schema) return retained.facts;
	const history = getSqliteDatabaseAdmission(database, schemaVersionKey(schema.admissionId));
	const currentSchema = history ? void 0 : getSqliteDatabaseAdmission(database, schemaAdmission);
	if (!history && !isPostgresSqlConnection(database) && currentSchema?.admissionId !== schema.admissionId) return;
	const facts = history ?? getSqliteDatabaseAdmission(database, versionKey);
	if (facts) {
		rememberConnectionVersion(database, {
			schema,
			facts
		});
		if (!history) publishSqliteDatabaseAdmission(database, schemaVersionKey(schema.admissionId), facts);
	}
	return facts;
}
/** A cold snapshot may discover historical facts without replacing a newer publication. */
function rememberStateSchemaVersionAdmission(database, facts) {
	const schema = getStateSchemaFacts(database);
	if (!schema) return;
	rememberConnectionVersion(database, {
		schema,
		facts
	});
	const current = getSqliteDatabaseAdmission(database, schemaAdmission);
	if (!isPostgresSqlConnection(database) && current?.admissionId !== schema.admissionId) return;
	publishSqliteDatabaseAdmission(database, schemaVersionKey(schema.admissionId), facts);
	publishSqliteDatabaseAdmission(database, versionKey, facts);
}
function publishStateSchemaVersionAdmission(database, facts) {
	publishSqliteDatabaseAdmission(database, versionKey, facts);
	const schema = getStateSchemaFacts(database);
	if (schema) {
		rememberConnectionVersion(database, {
			schema,
			facts
		});
		publishSqliteDatabaseAdmission(database, schemaVersionKey(schema.admissionId), facts);
	} else rememberConnectionVersion(database);
}
/** Runtime shape and integrity are physical-file facts, independent of live write authority. */
function getStateRuntimeSchemaAdmission(database) {
	return runtimeAdmission.get(database);
}
function publishStateRuntimeSchemaAdmission(database, startupReady) {
	runtimeAdmission.publish(database, { startupReady });
}
//#endregion
//#region src/state/openclaw-state-db-schema-version.ts
const CONTENT_VERSION_KEY = "state.schema.contentVersion";
const contentVersionQuery = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, () => getNodeSqliteKysely(db).selectFrom("config_machine_state").select("value_json").where("state_key", "=", CONTENT_VERSION_KEY)));
/** Content and its marker commit together, even while older readers retain their version floor. */
function readStateSchemaContentVersion(db, published, readRow = readStateSchemaContentVersionRow) {
	if (isPostgresSqlConnection(db)) {
		const facts = getStateSchemaVersionAdmission(db);
		if (!facts) throw new Error("Missing PostgreSQL state schema admission; use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.");
		return Math.max(published ?? facts.userVersion, facts.contentVersion);
	}
	const admitted = getStateSchemaVersionAdmission(db);
	if (admitted) return Math.max(published ?? admitted.userVersion, admitted.contentVersion);
	const version = getAdmittedSqliteSchemaFacts(db)?.userVersion ?? readSqliteUserVersion(db);
	const contentVersion = parseContentVersion(tableExists(db, "config_machine_state") ? readRow(db)?.value_json : void 0);
	rememberStateSchemaVersionAdmission(db, {
		userVersion: version,
		contentVersion
	});
	return Math.max(published ?? version, contentVersion);
}
function readStateSchemaContentVersionRow(db) {
	return contentVersionQuery(db)().rows[0];
}
function parseContentVersion(valueJson) {
	if (valueJson === void 0) return 0;
	let contentVersion;
	try {
		contentVersion = valueJson === null ? null : JSON.parse(valueJson);
	} catch (cause) {
		throw new SqliteSchemaMismatchError(`Invalid shared state schema content version in ${CONTENT_VERSION_KEY}.`, { cause });
	}
	if (typeof contentVersion !== "number" || !Number.isSafeInteger(contentVersion) || contentVersion < 0) throw new SqliteSchemaMismatchError(`Invalid shared state schema content version in ${CONTENT_VERSION_KEY}.`);
	return contentVersion;
}
/** Refuse newer headers before catalog inspection, then share one physical schema capture. */
function admitStateSchemaFacts(database, pathname) {
	if (isPostgresSqlConnection(database)) {
		if (!getPostgresPhysicalFacts(database)) throw new Error("Missing PostgreSQL physical schema admission");
		return;
	}
	try {
		admitSqliteSchema(database, (userVersion) => assertSupportedStateSchemaVersion(database, pathname, {
			userVersion,
			contentVersion: userVersion
		}));
	} catch (error) {
		let version;
		try {
			version = readSqliteUserVersion(database);
		} catch {
			throw normalizeOpenClawStateSchemaReadError(error, pathname);
		}
		if (version > 22) throw createNewerSqliteSchemaVersionError("OpenClaw state database", pathname, version, 22);
		throw normalizeOpenClawStateSchemaReadError(error, pathname);
	}
}
function assertSupportedStateSchemaVersion(db, pathname, prepared, readRow) {
	if (isPostgresSqlConnection(db)) return readStateSchemaContentVersion(db);
	try {
		const userVersion = prepared?.userVersion ?? getStateSchemaVersionAdmission(db)?.userVersion ?? getAdmittedSqliteSchemaFacts(db)?.userVersion ?? readSqliteUserVersion(db);
		const contentVersion = prepared?.contentVersion ?? (userVersion > 22 ? userVersion : readStateSchemaContentVersion(db, userVersion, readRow));
		if (contentVersion > 22) throw createNewerSqliteSchemaVersionError("OpenClaw state database", pathname, contentVersion, 22);
		return userVersion;
	} catch (error) {
		throw normalizeOpenClawStateSchemaReadError(error, pathname);
	}
}
//#endregion
//#region src/infra/sqlite-file-generation-worker.ts
/** Raw descriptor closes must not release a sibling connection's process-wide SQLite locks. */
function readSqliteFileGenerationSync(pathname) {
	return parseSqliteFileGeneration(runSqliteReadOnlyWorkerSync(pathname, void 0, "file-generation"));
}
async function readSqliteFileGeneration(pathname, signal) {
	return parseSqliteFileGeneration(await runSqliteReadOnlyWorker(pathname, {
		mode: "file-generation",
		signal
	}));
}
//#endregion
//#region src/infra/sqlite-integrity.ts
/** The gate includes the driver's check, awaited lifetime, and admission revalidation. */
function* sqliteIntegrityCheckSteps(database, databaseLabel, diagnostics) {
	const startedAt = performance.now();
	const check = {
		database,
		databaseLabel
	};
	if (diagnostics) {
		check.timing = {};
		diagnostics.integrityGateMode = "full";
		delete diagnostics.integrityCheckSyncMs;
		delete diagnostics.integrityOutsideCheckMs;
		delete diagnostics.integrityWorkerCheckMs;
		delete diagnostics.integrityWorkerLifetimeMs;
		delete diagnostics.integrityOutsideWorkerMs;
	}
	try {
		yield check;
		if (diagnostics) diagnostics.integrityGateOutcome = "healthy";
	} catch (error) {
		if (diagnostics) diagnostics.integrityGateOutcome = "failed";
		throw error;
	} finally {
		if (diagnostics) {
			diagnostics.integrityGateMs = Math.floor(performance.now() - startedAt);
			if (check.timing?.syncElapsedMs !== void 0) {
				diagnostics.integrityCheckSyncMs = Math.floor(check.timing.syncElapsedMs);
				diagnostics.integrityOutsideCheckMs = diagnostics.integrityGateMs - diagnostics.integrityCheckSyncMs;
			}
			if (check.timing?.workerCheckElapsedMs !== void 0) diagnostics.integrityWorkerCheckMs = Math.floor(check.timing.workerCheckElapsedMs);
			if (check.timing?.workerLifetimeElapsedMs !== void 0) {
				diagnostics.integrityWorkerLifetimeMs = Math.floor(check.timing.workerLifetimeElapsedMs);
				diagnostics.integrityOutsideWorkerMs = diagnostics.integrityGateMs - diagnostics.integrityWorkerLifetimeMs;
			}
		}
	}
}
/** Measure only the calling driver's synchronous check, excluding admission and resumption. */
function runSqliteIntegrityCheckSync(check) {
	const timing = check.timing;
	const startedAt = timing ? performance.now() : 0;
	try {
		assertSqliteIntegrity(check.database, check.databaseLabel);
	} finally {
		if (timing) timing.syncElapsedMs = performance.now() - startedAt;
	}
}
/** Run the same admission steps synchronously when the caller cannot yield. */
function runSqliteIntegrityOperationSync(operation, beforeResume, repairIntegrityError) {
	beforeResume?.();
	let step = operation.next();
	while (!step.done) {
		let failure;
		try {
			runSqliteIntegrityCheckSync(step.value);
		} catch (error) {
			failure = { error };
		}
		beforeResume?.();
		if (failure && repairIntegrityError) {
			const original = failure.error;
			try {
				if (repairIntegrityError(step.value, original)) failure = void 0;
			} catch (repairError) {
				if (original instanceof Error) original.message += ` Startup FTS repair failed: ${String(repairError)}`;
			}
		}
		step = failure ? operation.throw(failure.error) : operation.next();
	}
	return step.value;
}
const MAX_REPORTED_FOREIGN_KEY_VIOLATIONS = 5;
var SqliteRepairableForeignKeyError = class extends Error {
	constructor(databaseLabel, orphanCount) {
		super(`SQLite foreign_key_check failed for ${databaseLabel}: repairable task_delivery_state.task_id references task_runs.task_id cascade-owned orphans (${orphanCount} rows). Run openclaw doctor --fix to migrate this legacy state before retrying.`);
		this.name = "SqliteRepairableForeignKeyError";
		this.repair = {
			kind: "task-delivery-orphans",
			relation: "task_delivery_state.task_id",
			parentTable: "task_runs",
			orphanCount
		};
	}
};
/** Return whether a named integrity failure proves persistent database damage. */
function isTerminalSqliteIntegrityError(error) {
	if (error.name !== "SqliteIntegrityError") return false;
	if (!error.cause) return true;
	return isSqliteCorruptionError(error.cause);
}
/** Require structural, table/index, and referential consistency before trusting a database. */
function assertSqliteIntegrity(database, databaseLabel, options = "integrity_check") {
	const check = typeof options === "string" ? options : "integrity_check";
	const settings = typeof options === "object" ? options : {};
	let staleFts = false;
	try {
		runSqliteCheck(database, databaseLabel, check, void 0, settings.allFindings || settings.ftsSchemas !== void 0);
	} catch (error) {
		if (!settings.ftsSchemas || !(error instanceof SqliteIntegrityError) || !error.findings || !classifySqliteFtsIntegrityFindings(database, error.findings, settings.ftsSchemas)) throw error;
		staleFts = true;
	}
	runSqliteForeignKeyCheck(database, databaseLabel);
	if (check === "integrity_check" && !staleFts) recordSqliteDatabaseIntegrity(database);
	return { integrityCheck: "ok" };
}
/** Only exact, owned FTS definitions may treat their inverted index as derived data. */
function classifySqliteFtsIntegrityFindings(database, findings, schemas) {
	const names = /* @__PURE__ */ new Set();
	for (const finding of findings) {
		if (finding === "ok") continue;
		const match = typeof finding === "string" ? /^malformed inverted index for FTS5 table main\.([A-Za-z_][A-Za-z0-9_]*)$/u.exec(finding) : null;
		if (!match?.[1]) return;
		names.add(match[1]);
	}
	if (names.size === 0) return;
	const definitions = /* @__PURE__ */ new Map();
	for (const schema of schemas) for (const match of schema.matchAll(/CREATE VIRTUAL TABLE (?:IF NOT EXISTS )?([A-Za-z_][A-Za-z0-9_]*) USING fts5\s*\(/gu)) {
		const name = match[1];
		const end = findSqlClosingParenthesis(schema, match.index + match[0].length - 1);
		const variants = definitions.get(name) ?? /* @__PURE__ */ new Set();
		variants.add(normalizeSchemaSql(schema.slice(match.index, end + 1)));
		definitions.set(name, variants);
	}
	const tables = captureSqliteSchemaFacts(database).tableSql;
	for (const name of names) {
		const sql = tables.get(name);
		if (typeof sql !== "string" || !definitions.get(name)?.has(normalizeSchemaSql(sql))) return;
	}
	return [...names].toSorted();
}
/** Reconfirm an advisory failure against the database currently at a closed path. */
function confirmSqliteFileIntegrity(pathname, databaseLabel) {
	for (let attempt = 0; attempt < 3; attempt += 1) {
		let initial;
		let database;
		try {
			initial = readStableSqliteFileGeneration(pathname);
			database = openNodeSqliteDatabase(pathname, { readOnly: true });
		} catch (error) {
			return unboundSqliteIntegrityFailure(error);
		}
		let opened;
		try {
			opened = readStableSqliteFileGeneration(pathname);
		} catch {}
		if (!opened || !sameSqliteFileGeneration(initial, opened)) {
			const closeError = closeSqliteDatabase(database);
			if (closeError) return unboundSqliteIntegrityFailure(closeError);
			continue;
		}
		let confirmation;
		try {
			assertSqliteIntegrity(database, databaseLabel);
			confirmation = { status: "healthy" };
		} catch (error) {
			confirmation = failedSqliteIntegrityConfirmation(error);
		}
		const closeError = closeSqliteDatabase(database);
		if (closeError && confirmation.status === "healthy") confirmation = failedSqliteIntegrityConfirmation(closeError);
		let final;
		try {
			final = readStableSqliteFileGeneration(pathname);
		} catch {
			continue;
		}
		if (!sameSqliteFileGeneration(opened, final)) continue;
		if (confirmation.status === "healthy") return {
			status: "healthy",
			generation: final
		};
		return confirmation.terminal ? {
			...confirmation,
			generation: final,
			terminal: true
		} : {
			...confirmation,
			terminal: false
		};
	}
	return unboundSqliteIntegrityFailure(/* @__PURE__ */ new Error(`SQLite file generation did not stabilize during confirmation: ${pathname}`));
}
function failedSqliteIntegrityConfirmation(error) {
	const normalized = toStringifiedError(error);
	return {
		status: "failed",
		error: normalized,
		terminal: isTerminalSqliteIntegrityError(normalized)
	};
}
function unboundSqliteIntegrityFailure(error) {
	return {
		status: "failed",
		error: toStringifiedError(error),
		terminal: false
	};
}
function closeSqliteDatabase(database) {
	try {
		database.close();
		return;
	} catch (error) {
		return toStringifiedError(error);
	}
}
function readSqliteCheckFindings(database, pragma, tableName, allFindings = false) {
	const argument = tableName ? `('${tableName.replaceAll("'", "''")}')` : allFindings ? "(2147483647)" : "";
	return database.prepare(`PRAGMA ${pragma}${argument};`).all().map((row) => row[pragma] ?? Object.values(row)[0]);
}
function runSqliteCheck(database, databaseLabel, pragma, tableName, allFindings = false) {
	let results;
	try {
		results = readSqliteCheckFindings(database, pragma, tableName, allFindings);
	} catch (error) {
		throw new SqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${error instanceof Error ? error.message : String(error)}`, error);
	}
	if (results.length === 1 && results[0] === "ok") return "ok";
	throw new SqliteIntegrityError(`SQLite ${pragma} failed for ${databaseLabel}: ${results.map((result) => String(result)).join("; ") || "no result"}`, void 0, results);
}
function runSqliteForeignKeyCheck(database, databaseLabel) {
	let violationCount = 0;
	let repairable = true;
	let taskDeliveryForeignKeyId;
	const violations = [];
	try {
		const statement = database.prepare("PRAGMA foreign_key_check;");
		statement.setReadBigInts(true);
		for (const violation of statement.iterate()) {
			violationCount += 1;
			retainSortedForeignKeyViolation(violations, violation);
			if (repairable) {
				if (violation.table === "task_delivery_state" && violation.parent === "task_runs") {
					taskDeliveryForeignKeyId ??= readTaskDeliveryCascadeForeignKeyId(database);
					repairable = violation.fkid === taskDeliveryForeignKeyId;
				} else repairable = false;
			}
		}
	} catch (error) {
		throw new SqliteIntegrityError(`SQLite foreign_key_check failed for ${databaseLabel}: ${error instanceof Error ? error.message : String(error)}`, error);
	}
	if (violations.length === 0) return;
	if (repairable) throw new SqliteRepairableForeignKeyError(databaseLabel, violationCount);
	const details = violations.map(formatSqliteForeignKeyViolation);
	if (violationCount > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) details.push("additional violations omitted");
	throw new SqliteIntegrityError(`SQLite foreign_key_check failed for ${databaseLabel}: ${details.join("; ")}`);
}
function readTaskDeliveryCascadeForeignKeyId(database) {
	const statement = database.prepare("PRAGMA foreign_key_list(task_delivery_state);");
	statement.setReadBigInts(true);
	const foreignKeys = statement.all();
	const taskKey = foreignKeys.find((key) => key.table === "task_runs" && key.from === "task_id" && key.to === "task_id" && key.on_delete === "CASCADE");
	return taskKey && typeof taskKey.id === "bigint" && foreignKeys.filter((key) => key.id === taskKey.id).length === 1 ? taskKey.id : void 0;
}
var SqliteIntegrityError = class extends Error {
	constructor(message, cause, findings) {
		super(cause === void 0 ? `${message}. Stop the Gateway, run "openclaw doctor --fix" to inspect and repair this database, and restart. Only if Doctor still cannot repair the offline database, preserve the database and WAL and restore a verified backup.` : message, cause === void 0 ? void 0 : { cause });
		this.findings = findings;
		this.name = "SqliteIntegrityError";
	}
};
function retainSortedForeignKeyViolation(retained, violation) {
	retained.push(violation);
	retained.sort(compareSqliteForeignKeyViolations);
	if (retained.length > MAX_REPORTED_FOREIGN_KEY_VIOLATIONS) retained.pop();
}
function compareSqliteForeignKeyViolations(left, right) {
	const tableOrder = Buffer.compare(Buffer.from(left.table), Buffer.from(right.table));
	if (tableOrder !== 0) return tableOrder;
	if (left.rowid === null || right.rowid === null) {
		if (left.rowid !== right.rowid) return left.rowid === null ? -1 : 1;
	} else if (left.rowid !== right.rowid) return left.rowid < right.rowid ? -1 : 1;
	const parentOrder = Buffer.compare(Buffer.from(left.parent), Buffer.from(right.parent));
	if (parentOrder !== 0) return parentOrder;
	if (left.fkid === right.fkid) return 0;
	return left.fkid < right.fkid ? -1 : 1;
}
function formatSqliteForeignKeyViolation(violation) {
	const row = violation.rowid === null ? "row without rowid" : `row ${violation.rowid.toString()}`;
	return `${violation.table} ${row} references ${violation.parent} (foreign key ${violation.fkid.toString()})`;
}
//#endregion
//#region src/infra/sqlite-terminal-open-latch.ts
function generationMatchesPath(pathname, expected) {
	try {
		return sameSqliteFileGeneration(expected, readSqliteFileGenerationSync(pathname));
	} catch {
		return false;
	}
}
/**
* Per-path latch for terminal database-open failures (newer schema, proven
* corruption). Recording quarantines the path: any live handle is closed and
* every later open fails fast until doctor repairs the file and clears it.
*/
function createSqliteTerminalOpenLatch(options) {
	const failures = /* @__PURE__ */ new Map();
	return {
		/** Read the owner's recorded fact without running filesystem or database inspection. */
		peek: (pathname) => failures.get(path.resolve(pathname))?.error,
		get: (pathname) => {
			const resolvedPath = path.resolve(pathname);
			const failure = failures.get(resolvedPath);
			if (!failure) return;
			if (failure.generation && !generationMatchesPath(resolvedPath, failure.generation)) {
				failures.delete(resolvedPath);
				return;
			}
			return failure.error;
		},
		async getAsync(pathname, isCurrentGeneration) {
			const resolvedPath = path.resolve(pathname);
			const failure = failures.get(resolvedPath);
			if (failure?.generation && !await isCurrentGeneration(resolvedPath, failure.generation)) {
				failures.delete(resolvedPath);
				return;
			}
			return failure?.error;
		},
		record: (pathname, error, generation) => {
			const resolvedPath = path.resolve(pathname);
			if (generation && !generationMatchesPath(resolvedPath, generation)) return false;
			failures.set(resolvedPath, {
				error,
				...generation ? { generation } : {}
			});
			options.closeByPath(resolvedPath, error);
			return true;
		},
		clear: (pathname) => {
			failures.delete(path.resolve(pathname));
		},
		clearAll: (rootPath) => {
			for (const pathname of failures.keys()) if (rootPath === void 0 || isPathInside(rootPath, pathname)) failures.delete(pathname);
		}
	};
}
//#endregion
//#region src/state/openclaw-quarantine-store.ts
const OPENCLAW_QUARANTINE_SCHEMA_VERSION = 2;
const OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS = 5e3;
const OPENCLAW_QUARANTINE_DIR_MODE = 448;
const OPENCLAW_QUARANTINE_FILE_MODE = 384;
const quarantineSchemaAdmission = {
	name: "openclaw.quarantine.schema",
	schemaDependent: true,
	read(value) {
		if (typeof value !== "object" || value === null || !("version" in value) || typeof value.version !== "number") return;
		return { version: value.version };
	}
};
function quarantineDecisionAdmission(pathname) {
	return {
		name: `openclaw.quarantine.decision:${path.resolve(pathname)}`,
		read: (value) => value === null || isQuarantineDecision(value) ? value : void 0
	};
}
function isQuarantineDecision(value) {
	return isRecord(value) && (value.kind === "agent" || value.kind === "state") && typeof value.reason === "string" && typeof value.quarantinedAt === "number" && (value.verifiedGenerationJson === null || typeof value.verifiedGenerationJson === "string");
}
function configureQuarantineWriter(database, storePath) {
	database.exec(`
    PRAGMA journal_mode = DELETE;
    PRAGMA synchronous = FULL;
  `);
	const userVersion = readQuarantineSchemaVersion(database, storePath);
	if (userVersion === OPENCLAW_QUARANTINE_SCHEMA_VERSION) return;
	if (userVersion === 1) runSqliteImmediateTransactionSync(database, () => database.exec(`
      ALTER TABLE quarantined_databases ADD COLUMN verified_generation TEXT;
      PRAGMA user_version = ${OPENCLAW_QUARANTINE_SCHEMA_VERSION};
    `));
	else if (userVersion !== OPENCLAW_QUARANTINE_SCHEMA_VERSION) runSqliteImmediateTransactionSync(database, () => database.exec(`
    CREATE TABLE IF NOT EXISTS quarantined_databases (
      path TEXT NOT NULL PRIMARY KEY,
      kind TEXT NOT NULL,
      reason TEXT NOT NULL,
      quarantined_at INTEGER NOT NULL,
      writer_app_version TEXT,
      verified_generation TEXT
    ) STRICT;
    PRAGMA user_version = ${OPENCLAW_QUARANTINE_SCHEMA_VERSION};
    `));
	database.exec(`CREATE TABLE IF NOT EXISTS agent_integrity_verifications (
    path TEXT NOT NULL PRIMARY KEY, dev TEXT NOT NULL, ino TEXT NOT NULL,
    app_version TEXT NOT NULL, verified_at INTEGER NOT NULL,
    clean_close INTEGER NOT NULL CHECK (clean_close IN (0, 1))
  ) STRICT;`);
	publishSqliteDatabaseAdmission(database, quarantineSchemaAdmission, { version: OPENCLAW_QUARANTINE_SCHEMA_VERSION });
}
function readQuarantineSchemaVersion(database, storePath, fresh = false) {
	const admitted = fresh ? void 0 : getSqliteDatabaseAdmission(database, quarantineSchemaAdmission);
	if (admitted) return admitted.version;
	const userVersion = database.prepare("PRAGMA user_version").get()?.user_version;
	if (typeof userVersion !== "number" || !Number.isInteger(userVersion)) throw new Error(`OpenClaw quarantine store ${storePath} has an invalid schema version.`);
	if (userVersion > OPENCLAW_QUARANTINE_SCHEMA_VERSION) throw new Error(`OpenClaw quarantine store ${storePath} uses newer schema version ${userVersion}.`);
	if (userVersion !== 0) publishSqliteDatabaseAdmission(database, quarantineSchemaAdmission, { version: userVersion });
	return userVersion;
}
function withQuarantineWriter(env, operation) {
	const storePath = resolveQuarantineStorePath(env);
	const existed = existsSync(storePath);
	const dir = path.dirname(storePath);
	mkdirSync(dir, {
		recursive: true,
		mode: OPENCLAW_QUARANTINE_DIR_MODE
	});
	applyPrivateModeSync(dir, OPENCLAW_QUARANTINE_DIR_MODE);
	const database = openNodeSqliteDatabase(storePath, { timeout: OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS });
	let completed = false;
	try {
		if (!existed) applyPrivateModeSync(storePath, OPENCLAW_QUARANTINE_FILE_MODE);
		configureQuarantineWriter(database, storePath);
		const result = operation(database);
		completed = true;
		return result;
	} finally {
		if (database.isOpen) database.close();
		if (completed || !existed) applyPrivateModeSync(storePath, OPENCLAW_QUARANTINE_FILE_MODE);
	}
}
/** Its existence preserves prior state ownership even when an external agent is not configured. */
function ensureOpenClawQuarantineStore(env) {
	if (!existsSync(resolveQuarantineStorePath(env))) withQuarantineWriter(env, () => {});
}
/** Runtime guards share the owner's decision; explicit repair may inspect disk. */
function readOpenClawDatabaseQuarantine(pathname, options = {}) {
	const storePath = resolveQuarantineStorePath(options.env ?? process.env);
	const load = () => readPersistedQuarantineDecision(pathname, storePath, options.fresh) ?? null;
	const decision = options.fresh ? load() : getOrLoadSqliteDatabaseAdmissionForPath(storePath, quarantineDecisionAdmission(pathname), load);
	return decision ? resolveQuarantineDecision(decision, pathname, storePath) : void 0;
}
function readPersistedQuarantineDecision(pathname, storePath, fresh = false) {
	if (!existsSync(storePath)) return;
	const database = openSqliteReadOnlyDatabase(storePath, { timeout: OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS });
	let outcome;
	try {
		outcome = { value: readQuarantineDecision(database, pathname, storePath, fresh) };
	} catch (error) {
		outcome = { error };
	}
	try {
		database.close();
	} catch (closeError) {
		let quarantine;
		let readError = "error" in outcome ? outcome.error : void 0;
		if ("value" in outcome && outcome.value) try {
			quarantine = resolveQuarantineDecision(outcome.value, pathname, storePath);
		} catch (error) {
			readError = error;
		}
		throw new OpenClawQuarantineReadCleanupError(readError === void 0 ? [closeError] : [readError, closeError], quarantine);
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
function readQuarantineDecision(database, pathname, storePath, fresh = false) {
	const userVersion = readQuarantineSchemaVersion(database, storePath, fresh);
	if (userVersion === 0) return;
	const generationColumn = userVersion >= 2 ? ", verified_generation" : "";
	const row = database.prepare(`SELECT kind, reason, quarantined_at${generationColumn} FROM quarantined_databases WHERE path = ? LIMIT 1`).get(path.resolve(pathname));
	if (!row) return;
	const verifiedGenerationJson = userVersion >= 2 ? row.verified_generation : void 0;
	if (row.kind !== "agent" && row.kind !== "state" || typeof row.reason !== "string" || typeof row.quarantined_at !== "number" || !Number.isInteger(row.quarantined_at) || verifiedGenerationJson !== void 0 && verifiedGenerationJson !== null && typeof verifiedGenerationJson !== "string") throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
	return {
		kind: row.kind,
		quarantinedAt: row.quarantined_at,
		reason: row.reason,
		verifiedGenerationJson: typeof verifiedGenerationJson === "string" ? verifiedGenerationJson : null
	};
}
function resolveQuarantineDecision(decision, pathname, storePath) {
	if (decision.verifiedGenerationJson !== null) {
		let verifiedGeneration;
		try {
			verifiedGeneration = parseSqliteFileGeneration(decision.verifiedGenerationJson);
		} catch {
			throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
		}
		try {
			const currentGeneration = readSqliteFileGenerationSync(path.resolve(pathname));
			if (!sameSqliteFileGeneration(verifiedGeneration, currentGeneration)) return;
		} catch {
			return;
		}
	}
	return {
		kind: decision.kind,
		quarantinedAt: decision.quarantinedAt,
		reason: decision.reason
	};
}
/** Runtime opens refuse recorded damage while tolerating a broken quarantine index. */
function readOpenClawDatabaseQuarantineFailure(kind, pathname, options = {}) {
	let quarantine;
	let cleanupFailure;
	try {
		quarantine = readOpenClawDatabaseQuarantine(pathname, options);
	} catch (error) {
		if (!(error instanceof OpenClawQuarantineReadCleanupError)) return;
		if (!error.quarantine) throw error;
		quarantine = error.quarantine;
		cleanupFailure = error;
	}
	if (!quarantine) return;
	const failure = /* @__PURE__ */ new Error(`OpenClaw ${kind} database ${pathname} is quarantined after integrity verification failed: ${quarantine.reason ?? "unknown integrity error"}. Restore the database from a backup or repair it, then run openclaw doctor --fix to clear the quarantine. See ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
	failure.name = "SqliteIntegrityError";
	if (cleanupFailure) failure.cause = cleanupFailure;
	return failure;
}
function recordOpenClawDatabaseQuarantine(options) {
	const serializedGeneration = options.generation ? serializeSqliteFileGeneration(options.generation) : null;
	const quarantinedAt = Date.now();
	try {
		const recorded = withQuarantineWriter(options.env ?? process.env, (database) => runSqliteImmediateTransactionSync(database, () => {
			database.prepare(`
              INSERT INTO quarantined_databases (
                path, kind, reason, quarantined_at, writer_app_version, verified_generation
              ) VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(path) DO UPDATE SET
                kind = excluded.kind,
                reason = excluded.reason,
                quarantined_at = excluded.quarantined_at,
                writer_app_version = excluded.writer_app_version,
                verified_generation = excluded.verified_generation
            `).run(path.resolve(options.path), options.kind, options.reason, quarantinedAt, VERSION, serializedGeneration);
			publishSqliteDatabaseAdmission(database, quarantineDecisionAdmission(options.path), {
				kind: options.kind,
				quarantinedAt,
				reason: options.reason,
				verifiedGenerationJson: serializedGeneration
			});
			return true;
		}, {
			databaseLabel: resolveQuarantineStorePath(options.env ?? process.env),
			operationLabel: "quarantine.record"
		}));
		if (recorded) revokeSqliteDatabaseAdmissionsForPath(options.path);
		return recorded;
	} catch {
		return false;
	}
}
//#endregion
//#region src/state/openclaw-state-db-borrow.ts
/** The canonical cache supplies identity and custody; this owner manages its native references. */
function createStateDatabaseRetainer(state, operations) {
	const admit = (pathname, ownership) => {
		const scope = getOpenClawDatabaseMaintenanceScope();
		if (ownership === "cached-read") scope?.assertReadAdmission();
		else scope?.assertAdmission();
		operations.assertOpen(pathname, ownership);
		return scope;
	};
	const retain = (database, scope, readOnly = false) => {
		operations.capture(database.path).assertCurrent();
		if (state.cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new Error("OpenClaw state database borrow requires its current canonical handle");
		const owner = state.borrowers.get(database.db) ?? {
			references: /* @__PURE__ */ new Set(),
			retiring: false,
			cleanupComplete: false
		};
		if (owner.retiring) throw new Error("OpenClaw state database native owner is retiring");
		if (!readOnly) observeOpenClawDatabaseMaintenanceResource(database.db);
		state.borrowers.set(database.db, owner);
		const isCurrent = () => !scope || isOpenClawDatabaseMaintenanceResourceOwned(database.db, scope);
		const reference = retainStateDatabaseReference({
			owner,
			retirement: readOnly ? void 0 : {
				ordinary: scope === void 0,
				isCurrent,
				retire: () => {
					if (!isCurrent()) {
						owner.retiring = false;
						return;
					}
					operations.retire(database, scope === void 0);
				}
			},
			stopBeforeRetirement: () => database.walMaintenance.stop(),
			retainFailedClose: () => operations.retainFailed(database),
			ownRetirement: (close) => operations.ownRetirement(database, close),
			onIdle: () => operations.touch(database)
		});
		scope?.own(reference, "shared-references", () => reference.releaseAsync());
		return reference;
	};
	const findReadDatabase = (pathname, ownership) => {
		const resolvedPath = resolveDatabasePath({ path: pathname });
		const database = state.cachedDatabases.get(resolvedPath);
		if (!database?.db.isOpen) return {
			database: void 0,
			scope: void 0
		};
		return {
			database,
			scope: admit(resolvedPath, ownership)
		};
	};
	const retainReadReference = (database, scope) => {
		const reference = retain(database, scope, true);
		const assertCurrent = () => {
			if (state.cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new Error("Shared-state read lost its original native owner");
		};
		return {
			assertCurrent,
			observe() {
				assertCurrent();
				observeOpenClawDatabaseMaintenanceResource(database.db);
			},
			release: () => reference.release()
		};
	};
	return {
		retain: (database) => retain(database, admit(database.path)),
		retainForIndependentRead(pathname, ownership) {
			const { database, scope } = findReadDatabase(pathname, ownership);
			return database ? retainReadReference(database, scope) : void 0;
		},
		borrowForRead(pathname, ownership) {
			const { database, scope } = findReadDatabase(pathname, ownership);
			if (!database) return;
			if (database.db.isTransaction) throw new Error("Asynchronous shared-state reads cannot run inside a native transaction");
			return {
				database,
				...retainReadReference(database, scope)
			};
		}
	};
}
function assertStateDatabaseBorrowersReleased(owner, pathname) {
	if (owner?.references.size) throw new Error(`OpenClaw state database still has active native borrowers: ${pathname}`);
}
/** Preserve the requesting owner's retirement when the last reference is only a read pin. */
function retainStateDatabaseReference(params) {
	const { owner } = params;
	const reference = {};
	owner.references.add(reference);
	let released = false;
	const release = () => {
		if (released || owner.cleanupComplete) {
			released = true;
			return;
		}
		released = true;
		owner.references.delete(reference);
		if (owner.retirement && !owner.retirement.isCurrent()) {
			owner.retirement = void 0;
			owner.asyncRetirement = void 0;
			owner.retiring = false;
		}
		if (params.retirement?.isCurrent() && !owner.retirement?.ordinary) owner.retirement = params.retirement;
		if (owner.references.size > 0) return;
		if (!owner.retirement) {
			params.onIdle();
			return;
		}
		owner.retiring = true;
		if (owner.asyncRetirement) {
			owner.asyncRetirement.start();
			return;
		}
		try {
			owner.retirement.retire();
		} catch (error) {
			released = false;
			params.retainFailedClose();
			throw error;
		}
		owner.retirement = void 0;
		params.onIdle();
	};
	return {
		release,
		async releaseAsync() {
			if (owner.cleanupComplete) return;
			if ((params.retirement?.isCurrent() && !owner.retirement?.ordinary ? params.retirement : owner.retirement)?.isCurrent()) owner.asyncRetirement ??= createAsyncStateDatabaseRetirement(params);
			release();
			await owner.asyncRetirement?.close();
		}
	};
}
function createAsyncStateDatabaseRetirement(params) {
	const { owner } = params;
	const retained = {};
	let pending;
	let unregister;
	const finish = (retirement) => {
		owner.references.delete(retained);
		if (retirement?.isCurrent()) retirement.retire();
		else owner.retiring = false;
		owner.retirement = void 0;
		owner.asyncRetirement = void 0;
		unregister?.();
		unregister = void 0;
		params.onIdle();
	};
	const run = () => {
		if (pending) return pending;
		if (owner.cleanupComplete || owner.references.size > (owner.references.has(retained) ? 1 : 0)) return Promise.resolve();
		if (!owner.retirement?.isCurrent()) {
			finish();
			return Promise.resolve();
		}
		owner.retiring = true;
		owner.references.add(retained);
		unregister ??= params.ownRetirement(close);
		pending = Promise.resolve().then(async () => {
			await params.stopBeforeRetirement();
			finish(owner.retirement);
		}).catch((error) => {
			owner.references.add(retained);
			params.retainFailedClose();
			throw error;
		});
		pending.catch(() => {});
		return pending;
	};
	function close() {
		const attempt = run();
		return attempt.catch((error) => {
			if (pending === attempt) pending = void 0;
			throw error;
		});
	}
	return {
		start: () => void run(),
		close
	};
}
//#endregion
//#region src/state/openclaw-state-db-cache.admission.ts
/** Refresh cached-handle admission and settle failures against its exact native owner. */
function createStateDatabaseCacheAdmission(owner) {
	return {
		initialize(database) {
			const db = database.db;
			if (isPostgresSqlConnection(db)) {
				assertSupportedStateSchemaVersion(db, database.path);
				return getPostgresPhysicalFacts(db);
			}
			admitSqliteSchema(db);
			return runSqliteReadOperationSync(db, () => {
				assertSupportedStateSchemaVersion(db, database.path);
				return getAdmittedSqliteSchemaFacts(db);
			});
		},
		closeTerminalFailure(pathname, error) {
			markOpenClawStateDatabaseFailure(error, pathname);
			revokeSqliteDatabaseAdmissionsForPath(pathname);
			owner.invalidate(pathname);
			const cached = owner.cachedDatabases.get(pathname);
			const errors = [];
			try {
				if (cached) owner.evict(cached);
			} catch (cleanupError) {
				errors.push(cleanupError);
			}
			try {
				owner.notifyTerminalFailure(pathname, error);
			} catch (notificationError) {
				errors.push(notificationError);
			}
			throwSqliteLifecycleErrors(errors, "Terminal shared-state failure cleanup failed");
		},
		read(pathname, operation) {
			const database = owner.cachedDatabases.get(pathname);
			if (!database) return;
			if (!database.db.isOpen) return operation(database);
			const db = database.db;
			if (isPostgresSqlConnection(db)) {
				assertSupportedStateSchemaVersion(db, database.path);
				database.schemaFacts = getPostgresPhysicalFacts(db);
				return operation(database);
			}
			let admitted = false;
			try {
				return runSqliteReadOperationSync(db, () => {
					const facts = getAdmittedSqliteSchemaFacts(db);
					if (!facts || facts !== database.schemaFacts) {
						assertSupportedStateSchemaVersion(db, database.path);
						database.schemaFacts = facts;
					}
					admitted = true;
					return operation(database);
				});
			} catch (error) {
				if (admitted) throw error;
				const failure = error instanceof Error ? error : new Error(String(error));
				if (isSqliteCorruptionError(failure)) {
					owner.evict(database);
					return;
				}
				if (isSqliteSchemaVersionError(failure)) owner.recordSchemaFailure(database.path, failure);
				throw failure;
			}
		}
	};
}
//#endregion
//#region src/state/openclaw-state-db-cache.idle.ts
const log = createSubsystemLogger("state/db");
/** Schedule native retirement against the canonical cache's handles and borrow pins. */
function createStateDatabaseIdleRetirement({ cachedDatabases, retainedDatabaseHandles, idleTimers, idleReferences, borrowers }, retire) {
	const touch = (database) => {
		if (!(cachedDatabases.get(database.path) === database && database.db.isOpen) && retainedDatabaseHandles.get(database.db) !== database) return;
		const previous = idleTimers.get(database.db);
		if (previous) {
			previous.refresh();
			return;
		}
		const timer = runInDetachedAsyncContext(() => setTimeout(() => {
			idleTimers.delete(database.db);
			try {
				if (database.db.isOpen && database.db.isTransaction) touch(database);
				else if (!borrowers.get(database.db)?.references.size && !idleReferences.get(database.db)?.size) retire(database, false, {
					busyTimeoutMs: 0,
					checkpointMode: "PASSIVE"
				});
			} catch (error) {
				log.warn("Idle shared-state database cleanup failed", {
					path: database.path,
					error
				});
				touch(database);
			}
		}, SQLITE_IDLE_HANDLE_TTL_MS));
		timer.unref();
		idleTimers.set(database.db, timer);
	};
	return {
		touch,
		/** Retained consumers postpone idle eviction without blocking explicit retirement. */
		retain(database) {
			if (cachedDatabases.get(database.path) !== database || !database.db.isOpen || borrowers.get(database.db)?.retiring) throw new Error("OpenClaw state database idle retention requires its current canonical handle");
			const references = idleReferences.get(database.db) ?? /* @__PURE__ */ new Set();
			const reference = {};
			references.add(reference);
			idleReferences.set(database.db, references);
			return () => {
				if (!references.delete(reference)) return;
				if (cachedDatabases.get(database.path) === database && database.db.isOpen) touch(database);
			};
		}
	};
}
//#endregion
//#region src/infra/gateway-supervision.ts
const GATEWAY_SUPERVISOR_MODE_ENV = "OPENCLAW_SUPERVISOR_MODE";
function isGatewayExternallySupervised(env = process.env) {
	return env[GATEWAY_SUPERVISOR_MODE_ENV]?.trim().toLowerCase() === "external";
}
//#endregion
//#region src/state/openclaw-state-db-schema-policy.ts
const schemaPolicies = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseSchemaPolicies"), () => ({
	scopes: new AsyncLocalStorage(),
	existingDatabases: /* @__PURE__ */ new WeakMap()
}));
function canonicalPath(pathname) {
	const resolved = resolveDatabasePath({ path: pathname });
	try {
		return normalizeDatabasePath(realpathSync.native(resolved));
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return resolved;
		throw error;
	}
}
function assertSchemaScopeActive(scope) {
	if (scope && !scope.active) throw new Error("Existing shared-state schema admission has ended.");
}
function getExistingOpenClawStateSchemaPath() {
	const scope = schemaPolicies.scopes.getStore();
	assertSchemaScopeActive(scope);
	return scope?.path;
}
/** Admit this source once; retained reads only need the original scope's live lifetime. */
function captureOpenClawStateSchemaReadAdmission(pathname) {
	const scope = schemaPolicies.scopes.getStore();
	if (!scope) return;
	isExistingOpenClawStateSchema(pathname);
	return {
		path: scope.path,
		assertCurrent: () => assertSchemaScopeActive(scope)
	};
}
/** Check supplied and cached handles before exposing them to another admission policy. */
function isExistingOpenClawStateSchema(pathname, database) {
	const scopedPath = getExistingOpenClawStateSchemaPath();
	const scope = schemaPolicies.scopes.getStore();
	const admittedPath = database && schemaPolicies.existingDatabases.get(database);
	const resolvedPath = resolveDatabasePath({ path: pathname });
	const existing = scopedPath !== void 0 && (scopedPath === resolvedPath || scope?.canonicalPath === resolvedPath || scope?.canonicalPath === canonicalPath(resolvedPath));
	if (scopedPath && !existing) throw new Error(`Existing shared-state schema admission is bound to ${scopedPath}, not ${pathname}.`);
	if (admittedPath && (!existing || admittedPath !== scope?.canonicalPath)) throw new Error(`Shared-state database ${pathname} was admitted without schema repair; close its existing handle before ordinary admission.`);
	return existing;
}
function recordExistingOpenClawStateSchemaDatabase(database, pathname) {
	const scope = schemaPolicies.scopes.getStore();
	if (!scope || !isExistingOpenClawStateSchema(pathname, database)) throw new Error("Existing shared-state schema admission requires its active path scope.");
	schemaPolicies.existingDatabases.set(database, scope.canonicalPath);
}
/** The cache owns the handle inventory, including owners retained after failed cleanup. */
function assertExistingOpenClawStateSchemaCacheAdmission(pathname, cache) {
	const scopedPath = getExistingOpenClawStateSchemaPath();
	const scope = schemaPolicies.scopes.getStore();
	const requested = resolveDatabasePath({ path: pathname });
	let resolved = scope && (scopedPath === requested || scope.canonicalPath === requested) ? scope.canonicalPath : void 0;
	for (const databases of [cache.cachedDatabases, cache.retainedDatabaseHandles]) for (const { db } of databases.values()) {
		const admittedPath = schemaPolicies.existingDatabases.get(db);
		if (admittedPath && db.isOpen) {
			resolved ??= canonicalPath(pathname);
			if (admittedPath === resolved) isExistingOpenClawStateSchema(pathname, db);
		}
	}
}
function assertOpenClawStateSchemaRepairAllowed(pathname) {
	if (isExistingOpenClawStateSchema(pathname)) throw new Error(`Shared-state schema repair is owned by the existing installation at ${pathname}; update that installation before retrying the managed node.`);
}
//#endregion
//#region src/state/openclaw-state-worker-context.capture.ts
/** Capture read authority without constructing a worker environment. */
function captureOpenClawStateReadContextWithAdmission(pathname, captureAdmission) {
	const schema = captureOpenClawStateSchemaReadAdmission(pathname);
	const capturedAdmission = captureAdmission(pathname);
	const integrity = capturedAdmission.captureIntegrity?.();
	const assertPublicationCurrent = capturedAdmission.assertCurrent;
	let admission = capturedAdmission;
	let runInCapturedSchemaScope;
	if (schema) {
		const inCapturedScope = AsyncLocalStorage.snapshot();
		admission = {
			databasePath: capturedAdmission.databasePath,
			coordinationKey: capturedAdmission.coordinationKey,
			get identity() {
				return capturedAdmission.identity;
			},
			captureIntegrity: capturedAdmission.captureIntegrity,
			assertCurrent() {
				capturedAdmission.assertCurrent();
				schema.assertCurrent();
			}
		};
		runInCapturedSchemaScope = (operation) => inCapturedScope(() => {
			admission.assertCurrent();
			return operation();
		});
	}
	return {
		maintenanceScope: getOpenClawDatabaseMaintenanceScope(),
		admission,
		assertPublicationCurrent,
		existingSchemaPath: schema?.path,
		stateIntegrity: integrity,
		runInCapturedSchemaScope,
		artifactPreservingReads: isArtifactPreservingStateRead("agent", pathname) || void 0
	};
}
/** Read-only workers need resolved runtime facts, not the initialization environment. */
function captureOpenClawStateReadWorkerContextWithAdmission(options, captureAdmission) {
	const source = options.env ?? process.env;
	const env = process.platform === "win32" ? cloneEnvWithPlatformSemantics(source) : source;
	const environment = {
		OPENCLAW_STATE_DIR: resolveStateDir(env),
		...isGatewayExternallySupervised(env) ? { OPENCLAW_SUPERVISOR_MODE: "external" } : {}
	};
	return {
		...captureOpenClawStateReadContextWithAdmission(options.path ?? resolveOpenClawStateSqlitePath(environment), captureAdmission),
		environment
	};
}
/** Capture host facts before asynchronous work, without opening SQLite. */
function captureOpenClawStateWorkerContextWithAdmission(options, captureAdmission) {
	const context = captureOpenClawStateReadWorkerContextWithAdmission(options, captureAdmission);
	return {
		...context,
		initializationEnvironment: mergeProcessEnv([
			options.env ?? process.env,
			{
				OPENCLAW_STATE_DIR: void 0,
				OPENCLAW_SUPERVISOR_MODE: void 0
			},
			context.environment
		]),
		...options.initializationAgentPaths ? { initializationAgentPaths: options.initializationAgentPaths.map((agentPath) => path.resolve(agentPath)) } : {}
	};
}
//#endregion
//#region src/state/openclaw-state-db-cache.wal.ts
/** Bind periodic maintenance and its observations to the cache's exact native owner. */
function createStateDatabaseWalOwner({ cachedDatabases, retainedDatabaseHandles, databaseIdentities, asyncResources }, retainForIdle, requireIdentity) {
	return {
		ownRetirement(database, close) {
			const identity = requireIdentity(database);
			const resource = { async close(selected) {
				if (!selected || selected.key === identity.key) await close();
			} };
			const unregister = asyncResources.register(resource);
			getOpenClawDatabaseMaintenanceResourceScope(database.db)?.own(resource, "shared-references", () => resource.close());
			return unregister;
		},
		async stop(pathname, identity) {
			const databases = /* @__PURE__ */ new Set([...retainedDatabaseHandles.values(), ...cachedDatabases.values()]);
			await Promise.all([...databases].filter((database) => pathname === void 0 || database.path === pathname || identity !== void 0 && databaseIdentities.get(database.db)?.key === identity.key).flatMap(({ walMaintenance }) => walMaintenance ? [walMaintenance.stop()] : []));
		},
		register(database, identity, admission, env) {
			if (!isMainThread || isPostgresSqlConnection(database.db)) return;
			const capturedContext = captureOpenClawStateWorkerContextWithAdmission({
				path: database.path,
				env
			}, () => admission);
			const controller = new AbortController();
			let pending;
			const cancel = () => {
				controller.abort();
				if (!pending) {
					unregister();
					return;
				}
				return pending.then(() => void 0, () => void 0);
			};
			const unregister = asyncResources.register({ async close(selected) {
				if (selected && selected.key !== identity.key) return;
				cancel();
				await database.walMaintenance.stop();
				unregister();
			} });
			const run = async (request) => {
				const maintenanceScope = getOpenClawDatabaseMaintenanceResourceScope(database.db);
				const context = {
					...capturedContext,
					maintenanceScope
				};
				const assertCurrent = () => {
					controller.signal.throwIfAborted();
					context.admission.assertCurrent();
					maintenanceScope?.assertAdmission();
					if (getOpenClawDatabaseMaintenanceResourceScope(database.db) !== maintenanceScope || cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new StateDatabaseReadAdmissionInvalidatedError("Shared-state WAL maintenance owner changed");
					assertExistingDatabaseIdentity(database.path, identity.key, identity.birthtime);
				};
				let releaseIdle;
				let operationStarted = false;
				try {
					assertCurrent();
					releaseIdle = retainForIdle(database);
					const { runOpenClawStateWorkerOperation } = await import("./sqlite-readonly-openclaw-state-worker-store-Cx2ppC6w.mjs").then((n) => n.n);
					assertCurrent();
					return await runOpenClawStateWorkerOperation(context, (worker) => worker.execute({
						type: "database.walMaintenance",
						input: request
					}, { signal: controller.signal }), {
						existingOnly: true,
						assertCurrent,
						createAdmission: () => ({
							nativeLocations: [database.path, identity.canonicalPath],
							admission: createSqliteWorkerOperationAdmission((_request, grant) => {
								assertCurrent();
								if (!grant()) throw new StateDatabaseReadAdmissionInvalidatedError("Shared-state WAL maintenance authority expired");
								operationStarted = true;
							})
						})
					});
				} catch (error) {
					if (!operationStarted && (isStateDatabaseReadAdmissionInvalidatedError(error) || controller.signal.aborted && isAbortError(error))) return;
					throw error;
				} finally {
					releaseIdle?.();
				}
			};
			registerSqliteWalWorkerMaintenance(database.db, (operation) => {
				if (controller.signal.aborted) return Promise.resolve(void 0);
				const active = run(operation);
				pending = active;
				return active.finally(() => {
					if (pending === active) pending = void 0;
					if (controller.signal.aborted) unregister();
				});
			}, cancel);
		},
		/** Report the last observation without opening or querying SQLite. */
		readHealth() {
			const database = cachedDatabases.get(path.resolve(resolveOpenClawStateSqlitePath()));
			return database?.db.isOpen ? database.walMaintenance.health : void 0;
		}
	};
}
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/usingCtx.js
function _usingCtx() {
	var r = "function" == typeof SuppressedError ? SuppressedError : function(r, e) {
		var n = Error();
		return n.name = "SuppressedError", n.error = r, n.suppressed = e, n;
	}, e = {}, n = [];
	function using(r, e) {
		if (null != e) {
			if (Object(e) !== e) throw new TypeError("using declarations can only be used with objects, functions, null, or undefined.");
			if (r) var o = e[Symbol.asyncDispose || Symbol["for"]("Symbol.asyncDispose")];
			if (void 0 === o && (o = e[Symbol.dispose || Symbol["for"]("Symbol.dispose")], r)) var t = o;
			if ("function" != typeof o) throw new TypeError("Object is not disposable.");
			t && (o = function o() {
				try {
					t.call(e);
				} catch (r) {
					return Promise.reject(r);
				}
			}), n.push({
				v: e,
				d: o,
				a: r
			});
		} else r && n.push({
			d: e,
			a: r
		});
		return e;
	}
	return {
		e,
		u: using.bind(null, !1),
		a: using.bind(null, !0),
		d: function d() {
			var o, t = this.e, s = 0;
			function next() {
				for (; o = n.pop();) try {
					if (!o.a && 1 === s) return s = 0, n.push(o), Promise.resolve().then(next);
					if (o.d) {
						var r = o.d.call(o.v);
						if (o.a) return s |= 2, Promise.resolve(r).then(next, err);
					} else s |= 1;
				} catch (r) {
					return err(r);
				}
				if (1 === s) return t !== e ? Promise.reject(t) : Promise.resolve();
				if (t !== e) throw t;
			}
			function err(n) {
				return t = t !== e ? new r(n, t) : n, next();
			}
			return next();
		}
	};
}
//#endregion
//#region src/state/openclaw-state-db-handle.ts
const identities = resolveGlobalSingleton(Symbol.for("openclaw.stateNativeIdentities"), () => /* @__PURE__ */ new WeakMap());
/** Physical identity admitted by the native opener, never a later pathname observation. */
function readTrackedStateDatabaseIdentity(database) {
	return identities.get(sqlPublicationAnchor(database));
}
function openTrackedStateDatabase(pathname, options) {
	const result = openTrackedStateDatabaseResult(pathname, options);
	if (result.status === "unavailable") throw result.error;
	return result.database;
}
/** Native open failure is an ordinary read failure; admitted handles retain their own cleanup. */
function openTrackedStateDatabaseResult(pathname, options) {
	assertStateDatabaseAccessAllowed(pathname);
	try {
		if (options?.expectedIdentity !== void 0) assertExistingDatabaseIdentity(pathname, options.expectedIdentity);
		const location = options?.existingOnly || options?.expectedIdentity !== void 0 ? resolveExistingSqliteFileUri(pathname) : pathname;
		const nativeOptions = options?.readOnly ? {
			readOnly: true,
			timeout: options.timeout
		} : { enableForeignKeyConstraints: options?.enableForeignKeyConstraints };
		const openingIdentity = readDatabasePathIdentitySync(pathname);
		const database = withSqliteNativeOpen(() => openNodeSqliteDatabase(location, nativeOptions));
		try {
			assertStateDatabaseAccessAllowed(pathname);
			if (openingIdentity.key.startsWith("file:")) assertExistingDatabaseIdentity(pathname, openingIdentity.key, openingIdentity.birthtime);
			const identity = openingIdentity.key.startsWith("file:") ? openingIdentity : readDatabasePathIdentitySync(pathname);
			if (identity.key.startsWith("file:")) {
				identities.set(database, identity);
				const unregister = registerNodeSqliteDisposeCallback(database, () => {
					identities.delete(database);
					unregister();
				});
			}
		} catch (error) {
			database.close();
			throw error;
		}
		return {
			status: "available",
			database
		};
	} catch (error) {
		return {
			status: "unavailable",
			error
		};
	}
}
function closeTrackedStateDatabase(database) {
	if (database.isOpen) database.close();
}
/** Finish all native close stages even when a previous stage failed. */
function closeStateDatabaseHandle(database, options) {
	try {
		var _usingCtx$1 = _usingCtx();
		const errors = [];
		if (isPostgresSqlConnection(database.db)) {
			for (const connection of [database.db, database.db.anchor]) {
				if (connection === database.db.anchor && database.db.isOpen) break;
				try {
					if (connection.isOpen) connection.close();
				} catch (error) {
					errors.push(error);
				}
			}
			let cleanupPending = database.db.isOpen || database.db.anchor.isOpen;
			if (!cleanupPending) try {
				database.afterClose?.();
			} catch (error) {
				errors.push(error);
				cleanupPending = true;
			}
			return {
				errors,
				cleanupPending
			};
		}
		const seal = _usingCtx$1.u(prepareSqliteDatabaseCleanClose(database.db));
		const delegated = isSqliteWalWorkerMaintained(database.db);
		const priorCheckpointError = database.walMaintenance?.health?.state === "error";
		let checkpointed = false;
		try {
			checkpointed = database.walMaintenance?.close(options) === true && options?.checkpointMode !== "PASSIVE";
		} catch (error) {
			errors.push(error);
		}
		try {
			clearNodeSqliteKyselyCacheForDatabase(database.db);
		} catch (error) {
			errors.push(error);
		}
		try {
			closeTrackedStateDatabase(database.db);
		} catch (error) {
			errors.push(error);
		}
		let cleanupPending = false;
		if (!database.db.isOpen) try {
			database.afterClose?.();
		} catch (error) {
			errors.push(error);
			cleanupPending = true;
		}
		if (errors.length === 0 && !cleanupPending && options?.checkpointMode !== "PASSIVE" && (checkpointed || delegated && !priorCheckpointError)) seal.publish();
		return {
			errors,
			cleanupPending
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
//#endregion
//#region src/state/openclaw-state-db-integrity-admission.ts
const bindings = resolveGlobalSingleton(Symbol.for("openclaw.stateIntegrityBindings"), () => /* @__PURE__ */ new WeakMap());
const integrityKey = {
	name: "state.integrity",
	read: (value) => value === true ? true : void 0
};
function hasStateDatabaseIntegrityAdmission(database) {
	return Boolean(getStateRuntimeSchemaAdmission(database) || getSqliteDatabaseAdmission(database, integrityKey));
}
/** Ordinary opens share physical-file proof; Doctor calls the uncached integrity owner. */
function assertStateDatabaseIntegrityOnce(database, pathname) {
	if (!hasStateDatabaseIntegrityAdmission(database)) {
		assertSqliteIntegrity(database, pathname);
		publishSqliteDatabaseAdmission(database, integrityKey, true);
	}
}
function invalidate(revision) {
	let previous = Atomics.load(revision, 0);
	while (previous >= 0n) {
		const observed = Atomics.compareExchange(revision, 0, previous, previous + 1n);
		if (observed === previous) return;
		previous = observed;
	}
}
/** Corruption observed in an isolate revokes the exact host proof borrowed by its native handle. */
function invalidateOpenClawStateRuntimeIntegrity(database) {
	revokeSqliteDatabaseAdmissions(database);
	const bound = bindings.get(database);
	if (bound) {
		invalidate(new BigInt64Array(bound.revision));
		invalidate(new BigInt64Array(bound.lifetimeRevision));
	}
}
/** Native bindings revoke borrowed proof; the host generation alone owns its lifetime. */
function bind(database, admission) {
	if (bindings.get(database)?.revision === admission.revision) return;
	bindings.get(database)?.release();
	const revision = new BigInt64Array(admission.revision);
	const unobserve = registerSqliteSchemaMutationListener(database, () => invalidate(revision));
	const release = () => {
		unobserve();
		unregister();
	};
	const unregister = registerNodeSqliteDisposeCallback(database, (reason) => {
		if (reason === "replace") {
			invalidate(revision);
			invalidate(new BigInt64Array(admission.lifetime.revision));
		}
		release();
	});
	bindings.set(database, {
		revision: admission.revision,
		lifetimeRevision: admission.lifetime.revision,
		release
	});
}
/** Reuse only completed integrity proof; shape and mutable metadata retain their admission owners. */
function assertOpenClawStateRuntimeIntegrity(database, pathname, schema, admission, policy = "verify") {
	const identity = admission && readTrackedStateDatabaseIdentity(database);
	if (!admission || !identity || !identity.key.startsWith("file:") || identity.key !== admission.identity.key || identity.birthtime !== admission.identity.birthtime) {
		if (policy === "require-proof") throw new Error("Shared-state reader requires current worker integrity proof");
		assertStateDatabaseIntegrityOnce(database, pathname);
		return;
	}
	bind(database, admission);
	const revision = new BigInt64Array(admission.revision);
	const proof = new BigInt64Array(admission.proof);
	const metadata = BigInt.asIntN(64, BigInt(schema.userVersion >>> 0) << 32n | BigInt(schema.schemaVersion >>> 0));
	const observed = Atomics.load(proof, 0);
	if (Atomics.load(revision, 0) === admission.epoch && observed !== -1n) {
		if (observed === metadata && Atomics.load(revision, 0) === admission.epoch && hasStateDatabaseIntegrityAdmission(database)) return;
		invalidate(revision);
	}
	if (policy === "require-proof") throw new Error("Shared-state reader requires current worker integrity proof");
	assertStateDatabaseIntegrityOnce(database, pathname);
	const publish = () => {
		if (Atomics.load(revision, 0) === admission.epoch) Atomics.store(proof, 0, metadata);
	};
	return () => {
		if (database.isTransaction) stageSqliteTransactionState(database, {
			stage() {},
			rollback() {},
			commit: publish
		});
		else publish();
	};
}
//#endregion
//#region src/state/openclaw-state-db-snapshot-owner.ts
function createOpenClawStateSnapshotOwnerRegistry() {
	const releases = /* @__PURE__ */ new WeakMap();
	return {
		register(database, getCurrent) {
			if (isPostgresSqlConnection(database.db)) return;
			releases.set(database.db, registerLiveSqliteSnapshotOwner({
				database: database.db,
				databasePath: database.path,
				owner: "openclaw-state",
				assertCurrent: () => {
					if (getCurrent() !== database || !database.db.isOpen) throw new Error("OpenClaw state snapshot owner is no longer current");
				}
			}));
		},
		release(database) {
			if (isPostgresSqlConnection(database)) return;
			releases.get(database)?.();
			releases.delete(database);
		}
	};
}
const openClawStateSnapshotOwners = resolveGlobalSingleton(Symbol.for("openclaw.stateSnapshotOwners"), createOpenClawStateSnapshotOwnerRegistry);
//#endregion
//#region src/state/openclaw-state-db-cache.ts
var openclaw_state_db_cache_exports = /* @__PURE__ */ __exportAll({
	assertPublishedOpenClawStateDatabaseLifecycle: () => assertPublishedOpenClawStateDatabaseLifecycle,
	borrowOpenClawStateDatabaseForAsyncRead: () => borrowOpenClawStateDatabaseForAsyncRead,
	captureOpenClawStateDatabaseReadAdmission: () => captureOpenClawStateDatabaseReadAdmission,
	captureOpenClawStateIntegrityAdmission: () => captureOpenClawStateIntegrityAdmission,
	clearOpenClawStateDatabaseOpenFailure: () => clearOpenClawStateDatabaseOpenFailure,
	closeOpenClawStateDatabase: () => closeOpenClawStateDatabase,
	closeOpenClawStateDatabaseAsync: () => closeOpenClawStateDatabaseAsync,
	closeOpenClawStateDatabaseByPath: () => closeOpenClawStateDatabaseByPath,
	closeOpenClawStateDatabaseByPathAsync: () => closeOpenClawStateDatabaseByPathAsync,
	closeOpenClawStateDatabaseForTest: () => closeOpenClawStateDatabaseForTest,
	confirmCachedOpenClawStateDatabaseIntegrity: () => confirmCachedOpenClawStateDatabaseIntegrity,
	getOpenClawStateDatabaseTerminalFailureAsync: () => getOpenClawStateDatabaseTerminalFailureAsync,
	isOpenClawStateDatabaseOpen: () => isOpenClawStateDatabaseOpen,
	openClawStateDatabaseCache: () => openClawStateDatabaseCache,
	publishOpenClawStateDatabaseWorkerAdmission: () => publishOpenClawStateDatabaseWorkerAdmission,
	recordOpenClawStateDatabaseOpenFailure: () => recordOpenClawStateDatabaseOpenFailure,
	registerOpenClawStateDatabaseAsyncResource: () => registerOpenClawStateDatabaseAsyncResource,
	registerOpenClawStateDatabaseLifecycleListener: () => registerOpenClawStateDatabaseLifecycleListener,
	requireOpenClawStateDatabaseIdentity: () => requireOpenClawStateDatabaseIdentity,
	retainOpenClawStateDatabaseForIdle: () => retainOpenClawStateDatabaseForIdle,
	retainOpenClawStateDatabaseForIndependentRead: () => retainOpenClawStateDatabaseForIndependentRead
});
const STATE_DATABASE_LIFECYCLE_KEY = Symbol.for("openclaw.stateDatabaseLifecycle");
const stateDatabaseLifecycle = resolveGlobalSingleton(STATE_DATABASE_LIFECYCLE_KEY, () => ({
	cachedDatabases: /* @__PURE__ */ new Map(),
	retainedDatabaseHandles: /* @__PURE__ */ new Map(),
	idleTimers: /* @__PURE__ */ new WeakMap(),
	idleReferences: /* @__PURE__ */ new WeakMap(),
	unregisterRetainedExitClose: void 0,
	databaseIdentities: /* @__PURE__ */ new WeakMap(),
	borrowers: /* @__PURE__ */ new WeakMap(),
	databaseLifecycleListeners: /* @__PURE__ */ new Set(),
	terminalOpenLatch: createSqliteTerminalOpenLatch({ closeByPath: (pathname, error) => cacheAdmission.closeTerminalFailure(pathname, error) }),
	asyncResources: createOpenClawStateDatabaseAsyncLifecycle()
}), () => closeOpenClawStateDatabaseAsync(), "shared-state");
const { cachedDatabases, retainedDatabaseHandles, idleTimers, idleReferences, databaseIdentities, borrowers, databaseLifecycleListeners, terminalOpenLatch, asyncResources } = stateDatabaseLifecycle;
const { touch: touchStateDatabase, retain: retainOpenClawStateDatabaseForIdle } = createStateDatabaseIdleRetirement(stateDatabaseLifecycle, retireOpenClawStateDatabaseHandle);
const { register: registerStateDatabaseWalAdmission, readHealth: readOpenClawStateWalHealth, ownRetirement: ownStateDatabaseRetirement, stop: stopOpenClawStateDatabaseMaintenance } = createStateDatabaseWalOwner(stateDatabaseLifecycle, retainOpenClawStateDatabaseForIdle, requireOpenClawStateDatabaseIdentity);
function notifyOpenClawStateDatabaseLifecycle(event) {
	const notification = event.kind === "open-error" ? {
		...event,
		identity: event.identity ?? asyncResources.knownIdentity(event.path)
	} : event;
	for (const listener of databaseLifecycleListeners) listener(notification);
}
function notifyOpenClawStateDatabaseClosed(database) {
	notifyOpenClawStateDatabaseLifecycle({
		kind: "closed",
		path: database.path,
		identity: requireOpenClawStateDatabaseIdentity(database)
	});
}
function requireOpenClawStateDatabaseIdentity(database) {
	const identity = databaseIdentities.get(database.db);
	if (!identity) throw new Error("Published shared-state owner has no recorded database identity");
	return identity;
}
const cacheAdmission = createStateDatabaseCacheAdmission({
	cachedDatabases,
	evict: evictCachedOpenClawStateDatabase,
	invalidate: (pathname) => asyncResources.invalidate(pathname),
	notifyTerminalFailure: (pathname, error) => notifyOpenClawStateDatabaseLifecycle({
		kind: "terminal-failure",
		path: pathname,
		error,
		identity: asyncResources.knownIdentity(pathname)
	}),
	recordSchemaFailure: (pathname, error) => {
		terminalOpenLatch.record(pathname, error);
		notifyOpenClawStateDatabaseLifecycle({
			kind: "open-error",
			path: pathname,
			error
		});
	}
});
function registerOpenClawStateDatabaseLifecycleListener(listener) {
	databaseLifecycleListeners.add(listener);
	for (const database of cachedDatabases.values()) if (database.db.isOpen) listener({
		kind: "opened",
		database,
		identity: requireOpenClawStateDatabaseIdentity(database)
	});
	return () => databaseLifecycleListeners.delete(listener);
}
function retainStateDatabaseClose(database) {
	retainedDatabaseHandles.set(database.db, database);
	stateDatabaseLifecycle.unregisterRetainedExitClose ??= registerSqliteCacheExitClose(closeOpenClawStateDatabase);
}
function ownMaintenanceStateDatabaseHandle(database) {
	getOpenClawDatabaseMaintenanceScope()?.own(database.db, "shared-handles", async () => {
		const closingScope = getOpenClawDatabaseMaintenanceScope();
		if (!closingScope || !isOpenClawDatabaseMaintenanceResourceOwned(database.db, closingScope)) return;
		if (cachedDatabases.get(database.path) === database || retainedDatabaseHandles.get(database.db) === database) {
			await database.walMaintenance?.stop();
			if (isOpenClawDatabaseMaintenanceResourceOwned(database.db, closingScope) && (cachedDatabases.get(database.path) === database || retainedDatabaseHandles.get(database.db) === database)) retireOpenClawStateDatabaseHandle(database, false);
		}
	});
}
function closeUnpublishedOpenClawStateDatabaseHandle(database) {
	const errors = closeOpenClawStateDatabaseHandle(database);
	if (retainedDatabaseHandles.get(database.db) === database) ownMaintenanceStateDatabaseHandle(database);
	return errors;
}
/** Retain one exact canonical native owner; only the final reference retires its handle. */
const { retain: retainOpenClawStateDatabase, borrowForRead: borrowOpenClawStateDatabaseForAsyncRead, retainForIndependentRead: retainOpenClawStateDatabaseForIndependentRead } = createStateDatabaseRetainer(stateDatabaseLifecycle, {
	assertOpen(pathname, ownership) {
		assertOpenClawStateDatabaseOpenAllowed(pathname, ownership);
		assertExistingOpenClawStateSchemaCacheAdmission(pathname, stateDatabaseLifecycle);
	},
	capture: (pathname) => asyncResources.capture(pathname),
	retire: retireOpenClawStateDatabaseHandle,
	retainFailed: retainStateDatabaseClose,
	ownRetirement: ownStateDatabaseRetirement,
	touch: touchStateDatabase
});
/** Close both physical-handle owners while retaining every cleanup failure. */
function closeOpenClawStateDatabaseHandle(database, options) {
	clearTimeout(idleTimers.get(database.db));
	idleTimers.delete(database.db);
	try {
		assertStateDatabaseBorrowersReleased(borrowers.get(database.db), database.path);
	} catch (error) {
		const owner = borrowers.get(database.db);
		if (owner) {
			owner.retiring = true;
			owner.retirement = {
				ordinary: true,
				isCurrent: () => true,
				retire: () => {
					throwSqliteLifecycleErrors(closeOpenClawStateDatabaseHandle(database, options), `OpenClaw state database cleanup failed for ${database.path}.`);
					owner.cleanupComplete = true;
					borrowers.delete(database.db);
				}
			};
		}
		retainStateDatabaseClose(database);
		return [error];
	}
	idleReferences.delete(database.db);
	openClawStateSnapshotOwners.release(database.db);
	const { errors, cleanupPending } = closeStateDatabaseHandle(database, options);
	if (database.db.isOpen || cleanupPending) retainStateDatabaseClose(database);
	else retainedDatabaseHandles.delete(database.db);
	if (cachedDatabases.get(database.path)?.db === database.db) cachedDatabases.delete(database.path);
	if (retainedDatabaseHandles.size === 0) {
		stateDatabaseLifecycle.unregisterRetainedExitClose?.();
		stateDatabaseLifecycle.unregisterRetainedExitClose = void 0;
	}
	return errors;
}
function evictCachedOpenClawStateDatabase(database) {
	if (!isPostgresSqlConnection(database.db)) invalidateOpenClawStateRuntimeIntegrity(database.db);
	if (cachedDatabases.get(database.path) !== database) return false;
	asyncResources.invalidate(database.path);
	cachedDatabases.delete(database.path);
	notifyOpenClawStateDatabaseClosed(database);
	closeOpenClawStateDatabaseHandle(database, { checkpointMode: "PASSIVE" });
	return true;
}
/** Evict an exact cached shared-state owner after a proven corruption read. */
function evictOpenClawStateDatabaseAfterCorruption(database, error) {
	return isSqliteCorruptionError(error) && evictCachedOpenClawStateDatabase(database);
}
/** Publish a fully opened handle and bind query corruption to its exact cache owner. */
function publishOpenClawStateDatabase(database, env) {
	const { db, path: pathname } = database;
	const schemaFacts = cacheAdmission.initialize(database);
	const { identity, admission } = asyncResources.publish(pathname);
	databaseIdentities.set(db, readTrackedStateDatabaseIdentity(db) ?? identity);
	cachedDatabases.set(pathname, Object.assign(database, { schemaFacts }));
	registerStateDatabaseWalAdmission(database, identity, admission, env);
	touchStateDatabase(database);
	openClawStateSnapshotOwners.register(database, () => cachedDatabases.get(pathname));
	ownMaintenanceStateDatabaseHandle(database);
	notifyOpenClawStateDatabaseLifecycle({
		kind: "opened",
		database,
		identity
	});
	if (!isPostgresSqlConnection(db)) registerNodeSqliteKyselyQueryErrorHandler(db, (error) => {
		if (!db.isTransaction && isSqliteCorruptionError(error)) evictCachedOpenClawStateDatabase(database);
	});
	terminalOpenLatch.clear(pathname);
	return database;
}
function getCachedOpenClawStateDatabase(pathname, options) {
	return withCachedOpenClawStateDatabase(pathname, options, (database) => database);
}
/** Keep the admitted revision live while a synchronous reader consumes its row facts. */
function withCachedOpenClawStateDatabase(pathname, options, operation) {
	const resolvedPath = resolveDatabasePath({ path: pathname });
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	if (options?.readOnly) maintenance?.assertReadAdmission();
	else maintenance?.assertAdmission();
	assertExistingOpenClawStateSchemaCacheAdmission(resolvedPath, stateDatabaseLifecycle);
	const runtimeFailure = terminalOpenLatch.get(resolvedPath);
	if (runtimeFailure) throw runtimeFailure;
	return cacheAdmission.read(resolvedPath, (database) => {
		if (borrowers.get(database.db)?.retiring) throw new Error(`OpenClaw state database native borrower cleanup is pending: ${pathname}`);
		touchStateDatabase(database);
		return operation(database);
	});
}
function getOpenClawStateDatabaseIfOpenAtPath(pathname) {
	const cached = getCachedOpenClawStateDatabase(pathname);
	observeOpenClawDatabaseMaintenanceResource(cached?.db.isOpen ? cached.db : void 0);
	return cached?.db.isOpen ? cached : void 0;
}
/** Remove a closed cached owner while fresh-open access is held. */
function closeStaleCachedOpenClawStateDatabase(database) {
	if (cachedDatabases.get(database.path) !== database) return;
	asyncResources.invalidate(database.path);
	const errors = closeOpenClawStateDatabaseHandle(database);
	notifyOpenClawStateDatabaseClosed(database);
	throwSqliteLifecycleErrors(errors, `Stale OpenClaw state database cleanup failed for ${database.path}.`);
}
/** Latch background verification damage so later opens fail without rescanning. */
function recordOpenClawStateDatabaseOpenFailure(pathname, error, generation) {
	return terminalOpenLatch.record(resolveDatabasePath({ path: pathname }), error, generation);
}
/** Clear a terminal open failure after doctor rewrites the database file. */
function clearOpenClawStateDatabaseOpenFailure(pathname) {
	const resolvedPath = resolveDatabasePath({ path: pathname });
	terminalOpenLatch.clear(resolvedPath);
	asyncResources.invalidate(resolvedPath);
	notifyOpenClawStateDatabaseLifecycle({
		kind: "failure-cleared",
		path: resolvedPath,
		identity: asyncResources.knownIdentity(resolvedPath)
	});
}
/** Validate the canonical terminal fact before acquiring a domain-operation lease. */
async function getOpenClawStateDatabaseTerminalFailureAsync(context, signal) {
	context.admission.assertCurrent();
	const failure = await terminalOpenLatch.getAsync(context.admission.databasePath, async (pathname, generation) => {
		signal?.throwIfAborted();
		context.admission.assertCurrent();
		const current = await readSqliteFileGeneration(pathname, signal);
		signal?.throwIfAborted();
		context.admission.assertCurrent();
		return sameSqliteFileGeneration(generation, current);
	});
	context.admission.assertCurrent();
	return failure;
}
/** Reject shared-state access after a process-local terminal failure. */
function assertOpenClawStateDatabaseOpenAllowed(pathname, ownership) {
	const resolvedPath = resolveDatabasePath({ path: pathname });
	(ownership === "cached-read" ? assertStateDatabaseReadAllowed : assertStateDatabaseAccessAllowed)(pathname);
	const { identity } = asyncResources.capture(resolvedPath);
	const terminalFailure = terminalOpenLatch.get(resolvedPath);
	if (terminalFailure) throw terminalFailure;
	for (const database of retainedDatabaseHandles.values()) if (borrowers.get(database.db)?.retiring && (database.path === resolvedPath || databaseIdentities.get(database.db)?.key === identity.key)) throw new Error(`OpenClaw state database native borrower cleanup is pending: ${pathname}`);
}
function recordOpenClawStateDatabaseLifecycleOpenError(pathname, error) {
	notifyOpenClawStateDatabaseLifecycle({
		kind: "open-error",
		path: resolveDatabasePath({ path: pathname }),
		error
	});
}
/** Reject a fresh shared-state open after known corruption until repair clears it. */
function assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env, onNativeCleanupFailure) {
	assertOpenClawStateDatabaseOpenAllowed(pathname);
	let quarantineFailure;
	try {
		quarantineFailure = readOpenClawDatabaseQuarantineFailure("state", pathname, { env });
	} catch (error) {
		if (!(error instanceof OpenClawQuarantineReadCleanupError)) throw error;
		onNativeCleanupFailure?.(error);
		return;
	}
	if (quarantineFailure?.cause instanceof OpenClawQuarantineReadCleanupError) onNativeCleanupFailure?.(quarantineFailure.cause);
	if (quarantineFailure) {
		cacheAdmission.closeTerminalFailure(pathname, quarantineFailure);
		throw quarantineFailure;
	}
}
/** SQLite owns checkpoint exclusion; retirement joins the actual native handle. */
function retireOpenClawStateDatabaseHandle(database, retireAdmission = true, options) {
	assertStateDatabaseBorrowersReleased(borrowers.get(database.db), database.path);
	const borrowedOwner = borrowers.get(database.db);
	try {
		const wasCached = cachedDatabases.get(database.path)?.db === database.db;
		if (retireAdmission) asyncResources.invalidate(database.path);
		const errors = closeOpenClawStateDatabaseHandle(database, options);
		if (wasCached && retireAdmission) try {
			notifyOpenClawStateDatabaseClosed(database);
		} catch (error) {
			errors.push(error);
		}
		throwSqliteLifecycleErrors(errors, `OpenClaw state database cleanup failed for ${database.path}.`);
	} catch (error) {
		if (borrowedOwner) retainStateDatabaseClose(database);
		throw error;
	}
	if (borrowedOwner) {
		borrowedOwner.cleanupComplete = true;
		borrowers.delete(database.db);
	}
}
/** Close cached and disposal-only handles, preserving independent cleanup failures. */
function retireOpenClawStateDatabaseHandles(pathname, options, identity) {
	const databases = /* @__PURE__ */ new Set([...retainedDatabaseHandles.values(), ...cachedDatabases.values()]);
	const errors = [];
	let found = false;
	for (const database of databases) {
		if (pathname !== void 0 && database.path !== pathname && (identity === void 0 || databaseIdentities.get(database.db)?.key !== identity.key)) continue;
		found = true;
		try {
			retireOpenClawStateDatabaseHandle(database, true, options);
		} catch (error) {
			errors.push(error);
		}
	}
	throwSqliteLifecycleErrors(errors, "OpenClaw state database cleanup failed.");
	return found;
}
function closeOpenClawStateDatabaseByPath(pathname, options) {
	return retireOpenClawStateDatabaseHandles(resolveDatabasePath({ path: pathname }), options, asyncResources.identity(pathname));
}
function closeOpenClawStateDatabase(options) {
	retireOpenClawStateDatabaseHandles(void 0, options);
}
/** Register a resource owner before it can admit any shared-state worker opens. */
const registerOpenClawStateDatabaseAsyncResource = asyncResources.register;
/** Capture the canonical read generation before any asynchronous worker admission. */
const captureOpenClawStateDatabaseReadAdmission = asyncResources.capture;
const captureOpenClawStateIntegrityAdmission = asyncResources.integrity;
/** Bind worker-created storage to its captured admission without publishing a native handle. */
function publishOpenClawStateDatabaseWorkerAdmission(admission) {
	asyncResources.publish(admission.databasePath);
	admission.assertCurrent();
}
/** Drain worker resources before native checkpoint/close at one exact path. */
function closeOpenClawStateDatabaseByPathAsync(pathname, options) {
	const resolvedPath = resolveDatabasePath({ path: pathname });
	return asyncResources.close(resolvedPath, async (identity) => {
		await stopOpenClawStateDatabaseMaintenance(resolvedPath, identity);
		return retireOpenClawStateDatabaseHandles(resolvedPath, options, identity);
	});
}
/** Orderly lifecycle close; synchronous close remains native/exit cleanup only. */
async function closeOpenClawStateDatabaseAsync(options) {
	await asyncResources.close(void 0, async () => {
		await stopOpenClawStateDatabaseMaintenance();
		return retireOpenClawStateDatabaseHandles(void 0, options);
	});
}
function isOpenClawStateDatabaseOpen(pathname) {
	if (pathname !== void 0) return cachedDatabases.get(resolveDatabasePath({ path: pathname }))?.db.isOpen === true;
	return Array.from(cachedDatabases.values()).some((database) => database.db.isOpen);
}
/**
* Close shared state handles and clear terminal failure latches for test isolation.
* Worker retirement continues after return; await closeOpenClawStateDatabaseAsync()
* before raw SQLite or file access to a database that workers have used.
*/
function closeOpenClawStateDatabaseForTest() {
	closeOpenClawStateDatabase();
	terminalOpenLatch.clearAll();
}
/**
* Owners that register with this cache must serve only the published lifecycle.
* Every runtime chunk shares that lifecycle; only a retired module generation
* (a re-evaluated test graph whose detached work outlived its file) can differ.
*/
function assertPublishedOpenClawStateDatabaseLifecycle() {
	if (readGlobalSingleton(STATE_DATABASE_LIFECYCLE_KEY) !== stateDatabaseLifecycle) throw new Error("OpenClaw state database lifecycle is retired; its owners cannot serve the published lifecycle");
}
/** Process-wide owner for cached shared-state handles and terminal open failures. */
const openClawStateDatabaseCache = {
	assertOpenClawStateDatabaseFreshOpenAllowedAtPath,
	assertOpenClawStateDatabaseOpenAllowed,
	clearOpenClawStateDatabaseOpenFailure,
	closeOpenClawStateDatabase,
	closeOpenClawStateDatabaseByPath,
	closeOpenClawStateDatabaseForTest,
	closeOpenClawStateDatabaseHandle,
	closeUnpublishedOpenClawStateDatabaseHandle,
	closeStaleCachedOpenClawStateDatabase,
	evictCachedOpenClawStateDatabase,
	evictOpenClawStateDatabaseAfterCorruption,
	getCachedOpenClawStateDatabase,
	peekOpenClawStateDatabaseConnection: (pathname) => cachedDatabases.get(resolveDatabasePath({ path: pathname }))?.db,
	withCachedOpenClawStateDatabase,
	getOpenClawStateDatabaseRecordedFailure: terminalOpenLatch.peek,
	getOpenClawStateDatabaseIfOpenAtPath,
	getKnownOpenClawStateDatabaseIdentity: asyncResources.knownIdentity,
	isOpenClawStateDatabaseOpen,
	/** Only the exact published, open owner carries canonical schema readiness. */
	isOpenClawStateDatabaseSchemaReady: (database) => cachedDatabases.get(database.path) === database && database.db.isOpen,
	publishOpenClawStateDatabase,
	recordOpenClawStateDatabaseOpenFailure,
	recordOpenClawStateDatabaseLifecycleOpenError,
	touchStateDatabase
};
/** Reconfirm an advisory worker failure on the live owner connection. */
async function confirmCachedOpenClawStateDatabaseIntegrity(pathname) {
	const resolvedPath = resolveDatabasePath({ path: pathname });
	await closeOpenClawStateDatabaseByPathAsync(resolvedPath);
	return confirmSqliteFileIntegrity(resolvedPath, resolvedPath);
}
//#endregion
export { isGatewayExternallySupervised as A, sqliteIntegrityCheckSteps as B, captureOpenClawStateReadContextWithAdmission as C, getExistingOpenClawStateSchemaPath as D, assertOpenClawStateSchemaRepairAllowed as E, SqliteRepairableForeignKeyError as F, createStateSchemaAdmission as G, admitStateSchemaFacts as H, assertSqliteIntegrity as I, publishStateRuntimeSchemaAdmission as J, getStateRuntimeSchemaAdmission as K, isTerminalSqliteIntegrityError as L, readOpenClawDatabaseQuarantineFailure as M, recordOpenClawDatabaseQuarantine as N, isExistingOpenClawStateSchema as O, createSqliteTerminalOpenLatch as P, isTruthyEnvValue as Q, runSqliteIntegrityCheckSync as R, _usingCtx as S, captureOpenClawStateWorkerContextWithAdmission as T, assertSupportedStateSchemaVersion as U, CONTENT_VERSION_KEY as V, readStateSchemaContentVersion as W, applyConfigEnvVars as X, publishStateSchemaVersionAdmission as Y, cloneEnvWithPlatformSemantics as Z, invalidateOpenClawStateRuntimeIntegrity as _, confirmCachedOpenClawStateDatabaseIntegrity as a, openTrackedStateDatabaseResult as b, openclaw_state_db_cache_exports as c, registerOpenClawStateDatabaseAsyncResource as d, registerOpenClawStateDatabaseLifecycleListener as f, assertStateDatabaseIntegrityOnce as g, assertOpenClawStateRuntimeIntegrity as h, captureOpenClawStateIntegrityAdmission as i, ensureOpenClawQuarantineStore as j, recordExistingOpenClawStateSchemaDatabase as k, publishOpenClawStateDatabaseWorkerAdmission as l, retainOpenClawStateDatabaseForIndependentRead as m, borrowOpenClawStateDatabaseForAsyncRead as n, getOpenClawStateDatabaseTerminalFailureAsync as o, requireOpenClawStateDatabaseIdentity as p, getStateSchemaVersionAdmission as q, captureOpenClawStateDatabaseReadAdmission as r, openClawStateDatabaseCache as s, assertPublishedOpenClawStateDatabaseLifecycle as t, recordOpenClawStateDatabaseOpenFailure as u, closeTrackedStateDatabase as v, captureOpenClawStateReadWorkerContextWithAdmission as w, readTrackedStateDatabaseIdentity as x, openTrackedStateDatabase as y, runSqliteIntegrityOperationSync as z };
