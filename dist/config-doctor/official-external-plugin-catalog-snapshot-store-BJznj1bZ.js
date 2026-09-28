import "./runtime-doctor-migrations-8XPPImoy.js";
import "./redact-V5IywZh1.js";
import "./semver-Bf9GAGQM.js";
import { P as resolveOpenClawStateSqlitePath } from "./openclaw-state-db-cache-DbUvW0cs.js";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dv0CtqiQ.js";
import { n as HostedCatalogSignedFeedMonotonicityError } from "./official-external-plugin-catalog-source-CQb5CRXD.js";
import { AsyncLocalStorage } from "node:async_hooks";
import { existsSync } from "node:fs";
import "semver";
//#region src/infra/openclaw-exec-env.ts
/** Child-shell routing hint; it does not authenticate or authorize a Gateway caller. */
const SUBAGENT_EXEC_ENV_VAR = "OPENCLAW_SUBAGENT_EXEC";
//#endregion
//#region src/shared/lazy-promise.ts
/**
* Creates a small promise cache that dedupes concurrent loads and can be cleared manually.
*
* Rejections are evicted by default so transient dynamic-import/runtime failures can recover.
*/
function createLazyPromiseLoader(load, options = {}) {
	let promise;
	const createPromise = () => {
		const loaded = Promise.resolve().then(load);
		if (options.cacheRejections !== true) loaded.catch(() => {
			if (promise === loaded) promise = void 0;
		});
		return loaded;
	};
	return {
		load() {
			promise ??= createPromise();
			return promise;
		},
		peek() {
			return promise;
		},
		clear() {
			promise = void 0;
		}
	};
}
/** Creates a reusable function that resolves one cached promise at a time. */
function createLazyPromise(load, options) {
	const loader = createLazyPromiseLoader(load, options);
	return () => loader.load();
}
createLazyPromise(() => import("./subsystem-CxjajkOx.js").then((n) => n.n).then(({ createSubsystemLogger }) => createSubsystemLogger("env")), { cacheRejections: true });
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
const HOST_DANGEROUS_ENV_KEY_VALUES = Object.freeze([...HOST_ENV_SECURITY_POLICY.blockedKeys]);
Object.freeze([...HOST_ENV_SECURITY_POLICY.blockedPrefixes]);
const HOST_DANGEROUS_INHERITED_ENV_KEY_VALUES = Object.freeze([...HOST_ENV_SECURITY_POLICY.blockedInheritedKeys]);
Object.freeze([...HOST_ENV_SECURITY_POLICY.blockedInheritedPrefixes]);
const HOST_DANGEROUS_OVERRIDE_ENV_KEY_VALUES = Object.freeze([...HOST_ENV_SECURITY_POLICY.blockedOverrideKeys]);
Object.freeze([...HOST_ENV_SECURITY_POLICY.blockedOverridePrefixes]);
const HOST_SHELL_WRAPPER_ALLOWED_OVERRIDE_ENV_KEY_VALUES = Object.freeze([
	"TERM",
	"LANG",
	"LC_ALL",
	"LC_CTYPE",
	"LC_MESSAGES",
	"COLORTERM",
	"NO_COLOR",
	"FORCE_COLOR",
	SUBAGENT_EXEC_ENV_VAR
]);
Object.freeze(["LC_"]);
new Set(HOST_DANGEROUS_ENV_KEY_VALUES);
new Set(HOST_DANGEROUS_INHERITED_ENV_KEY_VALUES);
new Set(HOST_DANGEROUS_OVERRIDE_ENV_KEY_VALUES);
new Set(HOST_SHELL_WRAPPER_ALLOWED_OVERRIDE_ENV_KEY_VALUES);
new AsyncLocalStorage();
//#endregion
//#region src/config/config-env-vars.ts
function findCaseInsensitiveEnvKey(env, key) {
	if (Object.hasOwn(env, key)) return key;
	const upperKey = key.toUpperCase();
	return Object.keys(env).find((candidate) => candidate.toUpperCase() === upperKey);
}
const appliedConfigEnvOwnership = /* @__PURE__ */ new WeakMap();
function resolveAppliedConfigEnvOwnership(env) {
	return {
		...appliedConfigEnvOwnership.get(env),
		...env === process.env ? publishedConfigRuntimeEnvState.ownedEnv : {}
	};
}
function cloneEnvWithPlatformSemantics(env) {
	const cloned = { ...env };
	const ownedEnv = resolveAppliedConfigEnvOwnership(env);
	if (process.platform !== "win32") {
		appliedConfigEnvOwnership.set(cloned, ownedEnv);
		return cloned;
	}
	const proxy = new Proxy(cloned, {
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
	appliedConfigEnvOwnership.set(proxy, ownedEnv);
	return proxy;
}
let publishedConfigRuntimeEnvState = {
	generation: 0,
	ownedEnv: {},
	sourceConfig: null
};
//#endregion
//#region src/plugins/official-external-plugin-catalog-snapshot-store.ts
/** Persists hosted official plugin catalog snapshots through the shared-state worker. */
function resolveDatabaseOptions(options) {
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	if (options.stateDir) env.OPENCLAW_STATE_DIR = options.stateDir;
	return {
		env,
		path: options.stateDatabasePath || resolveOpenClawStateSqlitePath(env)
	};
}
function captureSnapshot(snapshot) {
	const { metadata, trust, monotonic } = snapshot;
	return {
		body: snapshot.body,
		metadata: {
			url: metadata.url,
			status: metadata.status,
			etag: metadata.etag,
			lastModified: metadata.lastModified,
			checksum: metadata.checksum
		},
		savedAt: snapshot.savedAt,
		...trust ? { trust: {
			mode: trust.mode,
			signedBy: trust.signedBy,
			signatureCount: trust.signatureCount,
			threshold: trust.threshold,
			verifiedAt: trust.verifiedAt
		} } : {},
		...monotonic ? { monotonic: {
			mode: monotonic.mode,
			sequence: monotonic.sequence,
			generatedAt: monotonic.generatedAt
		} } : {}
	};
}
/** Creates a snapshot store backed by the shared `state/openclaw.sqlite` database. */
function createSqliteHostedOfficialExternalPluginCatalogSnapshotStore(options = {}) {
	return {
		async read(url) {
			const databaseOptions = resolveDatabaseOptions(options);
			if (!existsSync(databaseOptions.path)) return null;
			const context = captureOpenClawStateWorkerContext(databaseOptions);
			const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-wruYP7oz.js");
			return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
				type: "plugins.catalogSnapshot.read",
				input: { url }
			}), { existingOnly: true }) ?? null;
		},
		async write(snapshot) {
			const now = Date.now();
			const prepared = captureSnapshot(snapshot);
			const context = captureOpenClawStateWorkerContext(resolveDatabaseOptions(options));
			const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-wruYP7oz.js");
			const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
				type: "plugins.catalogSnapshot.write",
				input: {
					snapshot: prepared,
					now
				}
			}));
			if (!result.ok) throw new HostedCatalogSignedFeedMonotonicityError(result.message);
		}
	};
}
//#endregion
export { createSqliteHostedOfficialExternalPluginCatalogSnapshotStore };
