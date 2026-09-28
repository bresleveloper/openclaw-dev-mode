import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { n as getMatrixRuntimeLifecycle } from "./runtime-1kn1P6io.mjs";
import { c as resolveGlobalMatrixEnvConfig, d as resolveMatrixAccountStringValues, i as requiresExplicitMatrixDefaultAccount, s as resolveMatrixDefaultOrOnlyAccountId, u as resolveScopedMatrixEnvConfig } from "./account-selection-BHkfU1eC.mjs";
import { t as getMatrixScopedEnvVarNames } from "./env-vars-dGqak9dN.mjs";
import { o as resolveMatrixBaseConfig, r as listNormalizedMatrixAccountIds, t as findMatrixAccountConfig } from "./account-config-CRsKoMqJ.mjs";
import { t as resolveMatrixConfigFieldPath } from "./config-paths-CnREYb1Y.mjs";
import { t as resolveValidatedMatrixHomeserverUrl } from "./url-validation-GRHde6lq.mjs";
import { i as repairCurrentTokenStorageMetaDeviceId } from "./storage-BXaFc0S4.mjs";
import { createLazyRuntimeMethod, createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId, normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-id";
import { coerceSecretRef, isBuiltInDefaultSecretProviderRef, normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { formatErrorMessage, toErrorObject, toStringifiedError } from "openclaw/plugin-sdk/error-runtime";
import { resolveOptionalIntegerOption } from "openclaw/plugin-sdk/number-runtime";
import { isPrivateNetworkOptInEnabled, ssrfPolicyFromDangerouslyAllowPrivateNetwork } from "openclaw/plugin-sdk/ssrf-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { AsyncLocalStorage } from "node:async_hooks";
import { retryAsync } from "openclaw/plugin-sdk/retry-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
//#region extensions/matrix/src/matrix/client/auth-request.ts
const loadMatrixAuthClientDeps = createLazyRuntimeModule(() => Promise.all([import("./sdk-rqFjgltR.mjs").then((n) => n.t), import("./logging-rgm8ep9H.mjs").then((n) => n.n)]).then(([sdkModule, loggingModule]) => ({
	MatrixClient: sdkModule.MatrixClient,
	ensureMatrixSdkLoggingConfigured: loggingModule.ensureMatrixSdkLoggingConfigured
})));
const MATRIX_AUTH_REQUEST_RETRY_RE = /\b(fetch failed|econnreset|econnrefused|enotfound|etimedout|ehostunreach|enetunreach|eai_again|und_err_|socket hang up|network|headers timeout|body timeout|connect timeout)\b/i;
function shouldRetryMatrixAuthRequest(err) {
	return MATRIX_AUTH_REQUEST_RETRY_RE.test(formatErrorMessage(err));
}
async function retryMatrixAuthRequest(label, run, signal) {
	return await retryAsync(run, {
		attempts: 3,
		minDelayMs: 250,
		maxDelayMs: 1500,
		jitter: .1,
		label,
		shouldRetry: (err) => shouldRetryMatrixAuthRequest(err),
		sleep: (ms) => sleepWithAbort(ms, signal)
	});
}
var MatrixWhoamiCleanupError = class extends AggregateError {};
async function fetchMatrixWhoamiIdentity(params) {
	const { MatrixClient, ensureMatrixSdkLoggingConfigured } = await loadMatrixAuthClientDeps();
	params.signal?.throwIfAborted();
	ensureMatrixSdkLoggingConfigured();
	const tempClient = new MatrixClient(params.homeserver, params.accessToken, {
		userId: params.userId,
		ssrfPolicy: params.ssrfPolicy,
		dispatcherPolicy: params.dispatcherPolicy
	});
	let stopping;
	const stop = () => stopping ??= tempClient.stopWithoutPersist();
	const onAbort = () => {
		stop().catch(() => {});
	};
	params.signal?.addEventListener("abort", onAbort, { once: true });
	let outcome;
	let cleanupFailure;
	try {
		params.signal?.throwIfAborted();
		outcome = {
			ok: true,
			value: await retryMatrixAuthRequest("matrix auth whoami", async () => {
				const identity = await tempClient.doRequest("GET", "/_matrix/client/v3/account/whoami");
				if (!isRecord(identity)) throw new Error("Matrix whoami returned an invalid identity");
				const userId = identity.user_id ?? void 0;
				const deviceId = identity.device_id ?? void 0;
				if (userId !== void 0 && typeof userId !== "string" || deviceId !== void 0 && typeof deviceId !== "string") throw new Error("Matrix whoami returned an invalid identity");
				return {
					user_id: userId,
					device_id: deviceId
				};
			}, params.signal)
		};
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	} finally {
		params.signal?.removeEventListener("abort", onAbort);
		try {
			await stop();
		} catch (error) {
			cleanupFailure = { error };
		}
	}
	if (cleanupFailure) throw new MatrixWhoamiCleanupError(outcome.ok ? [cleanupFailure.error] : [outcome.error, cleanupFailure.error], "Matrix identity request cleanup failed", { cause: outcome.ok ? cleanupFailure.error : outcome.error });
	if (!outcome.ok) throw outcome.error;
	return outcome.value;
}
//#endregion
//#region extensions/matrix/src/matrix/client/config.ts
const loadMatrixCredentialsReadDeps = createLazyRuntimeModule(() => import("./credentials-read-Q5sHkkHv.mjs").then((n) => n.i));
const loadMatrixCredentialsWriteRuntime = createLazyRuntimeModule(() => import("./credentials-write.runtime-DxbXh-pK.mjs"));
const loadMatrixSecretInputDeps = createLazyRuntimeModule(() => import("./config-secret-input.runtime-CwsP3--c.mjs"));
function isAbortSignalTriggered(signal) {
	return signal?.aborted === true;
}
function credentialsMatchBackfillAuthLineage(params) {
	if (!params.stored) return true;
	return params.stored.homeserver === params.auth.homeserver && params.stored.userId === params.auth.userId && params.stored.accessToken === params.auth.accessToken;
}
const MATRIX_CONFIG_STRING_FIELDS = [
	"homeserver",
	"userId",
	"accessToken",
	"password",
	"deviceId",
	"deviceName"
];
const MATRIX_AUTH_SECRET_FIELDS = ["accessToken", "password"];
function readMatrixEnvSecretRef(params) {
	const provider = params.cfg.secrets?.providers?.[params.ref.provider];
	if (provider?.source === "env") {
		if (provider.allowlist && !provider.allowlist.includes(params.ref.id)) throw new Error(`Environment variable "${params.ref.id}" is not allowlisted in secrets.providers.${params.ref.provider}.allowlist.`);
	} else if (!isBuiltInDefaultSecretProviderRef(params.cfg, params.ref)) throw new Error(provider ? `Secret provider "${params.ref.provider}" has source "${provider.source}" but ref requests "env".` : `Secret provider "${params.ref.provider}" is not configured (ref: env:${params.ref.provider}:${params.ref.id}).`);
	return params.env[params.ref.id]?.trim() || void 0;
}
function readMatrixConfigString(params) {
	const ref = coerceSecretRef(params.value, params.cfg.secrets?.defaults);
	if (params.suppressSecretRef && ref) return "";
	const value = params.allowEnvSecretRef ? ref?.source === "env" ? readMatrixEnvSecretRef({
		ref,
		cfg: params.cfg,
		env: params.env
	}) ?? params.value : ref ? "" : params.value : params.value;
	return normalizeResolvedSecretInputString({
		value,
		path: params.path,
		defaults: params.cfg.secrets?.defaults
	}) ?? "";
}
function resolveMatrixBaseConfigFieldPath(field) {
	return `channels.matrix.${field}`;
}
function hasConfiguredMatrixSecret(value, cfg) {
	return typeof value === "string" && value.trim().length > 0 || Boolean(coerceSecretRef(value, cfg.secrets?.defaults));
}
async function resolveConfiguredMatrixAuthSecretInput(params) {
	const configured = params.configured;
	if (!configured) return;
	if (!coerceSecretRef(configured.value, params.cfg.secrets?.defaults)) return normalizeResolvedSecretInputString({
		value: configured.value,
		path: configured.path,
		defaults: params.cfg.secrets?.defaults
	});
	const { resolveConfiguredSecretInputString } = await loadMatrixSecretInputDeps();
	const resolved = await resolveConfiguredSecretInputString({
		config: params.cfg,
		env: params.env,
		value: configured.value,
		path: configured.path,
		unresolvedReasonStyle: "detailed"
	});
	if (resolved.value !== void 0) return resolved.value;
	throw new Error(resolved.unresolvedRefReason ?? `${configured.path} SecretRef could not be resolved.`);
}
function clampMatrixInitialSyncLimit(value) {
	return resolveOptionalIntegerOption(value, { min: 0 });
}
function buildMatrixNetworkFields(params) {
	const dispatcherPolicy = params.dispatcherPolicy ?? (params.proxy ? {
		mode: "explicit-proxy",
		proxyUrl: params.proxy
	} : void 0);
	if (!params.allowPrivateNetwork && !dispatcherPolicy) return {};
	return {
		...params.allowPrivateNetwork ? {
			allowPrivateNetwork: true,
			ssrfPolicy: ssrfPolicyFromDangerouslyAllowPrivateNetwork(true)
		} : {},
		...dispatcherPolicy ? { dispatcherPolicy } : {}
	};
}
function buildResolvedMatrixAuth(resolved, auth) {
	return {
		...auth,
		deviceName: resolved.deviceName,
		initialSyncLimit: resolved.initialSyncLimit,
		encryption: resolved.encryption,
		...buildMatrixNetworkFields({
			allowPrivateNetwork: resolved.allowPrivateNetwork,
			dispatcherPolicy: resolved.dispatcherPolicy
		})
	};
}
function hasScopedMatrixEnvConfig(accountId, env) {
	const scoped = resolveScopedMatrixEnvConfig(accountId, env);
	return Boolean(scoped.homeserver || scoped.userId || scoped.accessToken || scoped.password || scoped.deviceId || scoped.deviceName);
}
function readMatrixConfigStrings(params) {
	return Object.fromEntries(MATRIX_CONFIG_STRING_FIELDS.map((field) => [field, readMatrixConfigString({
		value: params.values[field],
		path: params.path(field),
		cfg: params.cfg,
		env: params.env,
		allowEnvSecretRef: MATRIX_AUTH_SECRET_FIELDS.includes(field),
		suppressSecretRef: field === "password" && params.suppressPasswordSecretRef
	})]));
}
function resolveMatrixAccountConfigSnapshot(cfg, accountId, env) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const matrix = resolveMatrixBaseConfig(cfg);
	const account = findMatrixAccountConfig(cfg, normalizedAccountId) ?? {};
	const scopedKeys = getMatrixScopedEnvVarNames(normalizedAccountId);
	const scopedEnv = resolveScopedMatrixEnvConfig(normalizedAccountId, env);
	const globalEnv = resolveGlobalMatrixEnvConfig(env);
	const authCandidates = (field) => [
		{
			value: account[field],
			path: resolveMatrixConfigFieldPath(cfg, accountId, field)
		},
		{
			value: scopedEnv[field],
			path: scopedKeys[field]
		},
		...normalizedAccountId === DEFAULT_ACCOUNT_ID ? [{
			value: matrix[field],
			path: resolveMatrixBaseConfigFieldPath(field)
		}, {
			value: globalEnv[field],
			path: field === "accessToken" ? "MATRIX_ACCESS_TOKEN" : "MATRIX_PASSWORD"
		}] : []
	];
	const accessTokenCandidates = authCandidates("accessToken");
	const passwordCandidates = authCandidates("password");
	const suppressPasswordSecretRef = accessTokenCandidates.some((source) => hasConfiguredMatrixSecret(source.value, cfg));
	const resolvedStrings = resolveMatrixAccountStringValues({
		accountId: normalizedAccountId,
		account: readMatrixConfigStrings({
			cfg,
			env,
			values: account,
			path: (field) => resolveMatrixConfigFieldPath(cfg, normalizedAccountId, field),
			suppressPasswordSecretRef
		}),
		scopedEnv,
		channel: readMatrixConfigStrings({
			cfg,
			env,
			values: matrix,
			path: resolveMatrixBaseConfigFieldPath,
			suppressPasswordSecretRef
		}),
		globalEnv
	});
	const accountInitialSyncLimit = clampMatrixInitialSyncLimit(account.initialSyncLimit);
	const allowPrivateNetwork = isPrivateNetworkOptInEnabled(account) || isPrivateNetworkOptInEnabled(matrix) ? true : void 0;
	return {
		resolved: {
			homeserver: resolvedStrings.homeserver,
			userId: resolvedStrings.userId,
			accessToken: resolvedStrings.accessToken || void 0,
			password: resolvedStrings.password || void 0,
			deviceId: resolvedStrings.deviceId || void 0,
			deviceName: resolvedStrings.deviceName || void 0,
			initialSyncLimit: accountInitialSyncLimit ?? clampMatrixInitialSyncLimit(matrix.initialSyncLimit),
			encryption: typeof account.encryption === "boolean" ? account.encryption : matrix.encryption ?? false,
			...buildMatrixNetworkFields({
				allowPrivateNetwork,
				proxy: account.proxy ?? matrix.proxy
			})
		},
		authInputs: {
			accessToken: accessTokenCandidates.find((source) => source.value !== void 0),
			password: passwordCandidates.find((source) => source.value !== void 0)
		}
	};
}
function resolveImplicitMatrixAccountId(cfg, env = process.env) {
	if (requiresExplicitMatrixDefaultAccount(cfg, env)) return null;
	return normalizeAccountId(resolveMatrixDefaultOrOnlyAccountId(cfg, env));
}
function resolveMatrixAuthState(params) {
	const cfg = requireRuntimeConfig(params.cfg, "Matrix auth context");
	const env = params?.env ?? process.env;
	const requestedAccountId = params?.accountId?.trim();
	const explicitAccountId = normalizeOptionalAccountId(params?.accountId);
	if (requestedAccountId && !explicitAccountId) throw new Error(`Matrix account id "${requestedAccountId}" is invalid.`);
	const effectiveAccountId = explicitAccountId ?? resolveImplicitMatrixAccountId(cfg, env);
	if (!effectiveAccountId) throw new Error("Multiple Matrix accounts are configured and channels.matrix.defaultAccount is not set. Set \"channels.matrix.defaultAccount\" to the intended account or pass --account <id>.");
	if (explicitAccountId && explicitAccountId !== DEFAULT_ACCOUNT_ID && !listNormalizedMatrixAccountIds(cfg).includes(explicitAccountId) && !hasScopedMatrixEnvConfig(explicitAccountId, env)) throw new Error(`Matrix account "${explicitAccountId}" is not configured. Add channels.matrix.accounts.${explicitAccountId} or define scoped ${getMatrixScopedEnvVarNames(explicitAccountId).accessToken.replace(/_ACCESS_TOKEN$/, "")}_* variables.`);
	const matrix = resolveMatrixBaseConfig(cfg);
	const account = findMatrixAccountConfig(cfg, effectiveAccountId);
	if (matrix.enabled === false || account?.enabled === false) throw new Error(`Matrix account "${effectiveAccountId}" is disabled.`);
	const snapshot = resolveMatrixAccountConfigSnapshot(cfg, effectiveAccountId, env);
	return {
		context: {
			cfg,
			env,
			accountId: effectiveAccountId,
			resolved: snapshot.resolved
		},
		authInputs: snapshot.authInputs
	};
}
function resolveMatrixAuthContext(params) {
	return resolveMatrixAuthState(params).context;
}
async function resolveMatrixAuth(params) {
	if (!params?.cfg) throw new Error("Matrix auth requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const { context, authInputs } = resolveMatrixAuthState({
		cfg: params.cfg,
		env: params.env,
		accountId: params.accountId
	});
	const { cfg, env, accountId, resolved } = context;
	const accessToken = await resolveConfiguredMatrixAuthSecretInput({
		cfg,
		env,
		configured: authInputs.accessToken
	}) ?? resolved.accessToken;
	const tokenAuthPassword = resolved.password;
	const homeserver = await resolveValidatedMatrixHomeserverUrl(resolved.homeserver, { dangerouslyAllowPrivateNetwork: resolved.allowPrivateNetwork });
	const { loadMatrixCredentialsAsync, credentialsMatchConfig } = await loadMatrixCredentialsReadDeps();
	const cached = await loadMatrixCredentialsAsync(env, accountId);
	const cachedCredentials = cached && credentialsMatchConfig(cached, {
		homeserver,
		userId: resolved.userId || "",
		accessToken
	}) ? cached : null;
	if (accessToken) {
		let userId = resolved.userId;
		const hasMatchingCachedToken = cachedCredentials?.accessToken === accessToken;
		let knownDeviceId = hasMatchingCachedToken ? cachedCredentials?.deviceId || resolved.deviceId : resolved.deviceId;
		if (!userId) {
			const whoami = await fetchMatrixWhoamiIdentity({
				homeserver,
				accessToken,
				userId,
				ssrfPolicy: resolved.ssrfPolicy,
				dispatcherPolicy: resolved.dispatcherPolicy
			});
			const fetchedUserId = whoami.user_id?.trim();
			if (!fetchedUserId) throw new Error("Matrix whoami did not return user_id");
			userId = fetchedUserId;
			knownDeviceId = knownDeviceId || whoami.device_id?.trim() || resolved.deviceId;
		}
		if (!cachedCredentials || !hasMatchingCachedToken || cachedCredentials.userId !== userId || (cachedCredentials.deviceId || void 0) !== knownDeviceId) {
			const { saveMatrixCredentials } = await loadMatrixCredentialsWriteRuntime();
			await saveMatrixCredentials({
				homeserver,
				userId,
				accessToken,
				deviceId: knownDeviceId
			}, env, accountId);
		} else if (hasMatchingCachedToken) {
			const { touchMatrixCredentials } = await loadMatrixCredentialsWriteRuntime();
			await touchMatrixCredentials(env, accountId);
		}
		return buildResolvedMatrixAuth(resolved, {
			accountId,
			homeserver,
			userId,
			accessToken,
			password: tokenAuthPassword,
			deviceId: knownDeviceId
		});
	}
	if (cachedCredentials) {
		const { touchMatrixCredentials } = await loadMatrixCredentialsWriteRuntime();
		await touchMatrixCredentials(env, accountId);
		return buildResolvedMatrixAuth(resolved, {
			accountId,
			homeserver: cachedCredentials.homeserver,
			userId: cachedCredentials.userId,
			accessToken: cachedCredentials.accessToken,
			password: tokenAuthPassword,
			deviceId: cachedCredentials.deviceId || resolved.deviceId
		});
	}
	if (!resolved.userId) throw new Error("Matrix userId is required when no access token is configured (matrix.userId)");
	const password = await resolveConfiguredMatrixAuthSecretInput({
		cfg,
		env,
		configured: authInputs.password
	}) ?? resolved.password;
	if (!password) throw new Error("Matrix password is required when no access token is configured (matrix.password)");
	const { MatrixClient, ensureMatrixSdkLoggingConfigured } = await loadMatrixAuthClientDeps();
	ensureMatrixSdkLoggingConfigured();
	const loginClient = new MatrixClient(homeserver, "", {
		ssrfPolicy: resolved.ssrfPolicy,
		dispatcherPolicy: resolved.dispatcherPolicy
	});
	const login = await retryMatrixAuthRequest("matrix auth login", async () => await loginClient.doRequest("POST", "/_matrix/client/v3/login", void 0, {
		type: "m.login.password",
		identifier: {
			type: "m.id.user",
			user: resolved.userId
		},
		password,
		device_id: resolved.deviceId,
		initial_device_display_name: resolved.deviceName ?? "OpenClaw Gateway"
	}));
	const loginAccessToken = login.access_token?.trim();
	if (!loginAccessToken) throw new Error("Matrix login did not return an access token");
	const auth = buildResolvedMatrixAuth(resolved, {
		accountId,
		homeserver,
		userId: login.user_id ?? resolved.userId,
		accessToken: loginAccessToken,
		password,
		deviceId: login.device_id ?? resolved.deviceId
	});
	const { saveMatrixCredentials } = await loadMatrixCredentialsWriteRuntime();
	await saveMatrixCredentials({
		homeserver: auth.homeserver,
		userId: auth.userId,
		accessToken: auth.accessToken,
		deviceId: auth.deviceId
	}, env, accountId);
	return auth;
}
async function backfillMatrixAuthDeviceIdAfterStartup(params) {
	const knownDeviceId = params.auth.deviceId?.trim();
	if (knownDeviceId) return knownDeviceId;
	if (isAbortSignalTriggered(params.abortSignal)) return;
	let whoami;
	try {
		whoami = await fetchMatrixWhoamiIdentity({
			homeserver: params.auth.homeserver,
			accessToken: params.auth.accessToken,
			userId: params.auth.userId,
			ssrfPolicy: params.auth.ssrfPolicy,
			dispatcherPolicy: params.auth.dispatcherPolicy,
			signal: params.abortSignal
		});
	} catch (err) {
		if (isAbortSignalTriggered(params.abortSignal) && !(err instanceof MatrixWhoamiCleanupError)) return;
		throw err;
	}
	const deviceId = whoami.device_id?.trim();
	if (!deviceId) return;
	if (isAbortSignalTriggered(params.abortSignal)) return;
	const env = params.env ?? process.env;
	const { loadMatrixCredentialsAsync } = await loadMatrixCredentialsReadDeps();
	if (!credentialsMatchBackfillAuthLineage({
		stored: await loadMatrixCredentialsAsync(env, params.auth.accountId),
		auth: params.auth
	})) return;
	if (isAbortSignalTriggered(params.abortSignal)) return;
	if (!await repairCurrentTokenStorageMetaDeviceId({
		homeserver: params.auth.homeserver,
		userId: params.auth.userId,
		accessToken: params.auth.accessToken,
		accountId: params.auth.accountId,
		deviceId,
		env: params.env
	})) throw new Error("Matrix deviceId backfill failed to repair current-token storage metadata");
	if (isAbortSignalTriggered(params.abortSignal)) return;
	const credentialsWriter = await loadMatrixCredentialsWriteRuntime();
	const currentCredentials = await loadMatrixCredentialsAsync(env, params.auth.accountId);
	if (isAbortSignalTriggered(params.abortSignal) || !credentialsMatchBackfillAuthLineage({
		stored: currentCredentials,
		auth: params.auth
	})) return;
	return await credentialsWriter.saveBackfilledMatrixDeviceId({
		homeserver: params.auth.homeserver,
		userId: params.auth.userId,
		accessToken: params.auth.accessToken,
		deviceId
	}, env, params.auth.accountId) === "saved" ? deviceId : void 0;
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/task-runner.ts
const monitorTaskContext = new AsyncLocalStorage();
function getMatrixMonitorTaskSignal() {
	const context = monitorTaskContext.getStore();
	return context?.settled ? context.runner.shutdownSignal : context?.signal;
}
function createMatrixMonitorTaskRunner(params) {
	const inFlight = /* @__PURE__ */ new Map();
	const shutdownController = new AbortController();
	const runner = { shutdownSignal: shutdownController.signal };
	let closed = false;
	const runDetachedTask = (label, task) => {
		if (closed) return Promise.resolve();
		const controller = new AbortController();
		const context = {
			runner,
			settled: false,
			signal: AbortSignal.any([controller.signal, runner.shutdownSignal])
		};
		const trackedTask = monitorTaskContext.run(context, () => Promise.resolve().then(task)).catch((error) => {
			const message = String(error);
			params.logVerboseMessage(`matrix: ${label} failed (${message})`);
			params.logger.warn("matrix background task failed", {
				task: label,
				error: message
			});
		}).finally(() => {
			context.settled = true;
			inFlight.delete(trackedTask);
		});
		inFlight.set(trackedTask, controller);
		return trackedTask;
	};
	const waitForIdle = async () => {
		while (inFlight.size > 0) await Promise.allSettled(Array.from(inFlight.keys()));
	};
	return {
		close: () => {
			closed = true;
			shutdownController.abort();
			for (const controller of inFlight.values()) controller.abort();
		},
		runDetachedTask,
		waitForIdle
	};
}
//#endregion
//#region extensions/matrix/src/matrix/startup-abort.ts
function createMatrixStartupAbortError() {
	const error = /* @__PURE__ */ new Error("Matrix startup aborted");
	error.name = "AbortError";
	return error;
}
function throwIfMatrixStartupAborted(abortSignal) {
	if (abortSignal?.aborted === true) throw createMatrixStartupAbortError();
}
function isMatrixStartupAbortError(error) {
	return error instanceof Error && error.name === "AbortError";
}
async function awaitMatrixStartupWithAbort(promise, abortSignal) {
	if (!abortSignal) return await promise;
	if (abortSignal.aborted) throw createMatrixStartupAbortError();
	return await new Promise((resolve, reject) => {
		const onAbort = () => {
			abortSignal.removeEventListener("abort", onAbort);
			reject(createMatrixStartupAbortError());
		};
		abortSignal.addEventListener("abort", onAbort, { once: true });
		promise.then((value) => {
			abortSignal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			abortSignal.removeEventListener("abort", onAbort);
			reject(toErrorObject(error, "Non-Error rejection"));
		});
	});
}
//#endregion
//#region extensions/matrix/src/matrix/client/shared.ts
const loadMatrixCreateClientDeps = createLazyRuntimeModule(() => import("./create-client-CHxcron_.mjs").then((runtime) => ({ createMatrixClient: runtime.createMatrixClient })));
const MATRIX_RETIREMENT_DRAIN_TIMEOUT_MS = 5e3;
const sharedClientStates = /* @__PURE__ */ new Map();
const sharedClientPromises = /* @__PURE__ */ new Map();
function buildSharedClientKey(auth) {
	return JSON.stringify([
		auth.homeserver,
		auth.userId,
		auth.accessToken,
		auth.encryption ? "e2ee" : "plain",
		auth.allowPrivateNetwork ? "private-net" : "strict-net",
		auth.dispatcherPolicy ?? null,
		auth.accountId
	]);
}
async function createSharedMatrixClient(params) {
	const { createMatrixClient } = await loadMatrixCreateClientDeps();
	const client = await createMatrixClient({
		homeserver: params.auth.homeserver,
		userId: params.auth.userId,
		accessToken: params.auth.accessToken,
		password: params.auth.password,
		deviceId: params.auth.deviceId,
		encryption: params.auth.encryption,
		localTimeoutMs: params.timeoutMs,
		initialSyncLimit: params.auth.initialSyncLimit,
		accountId: params.auth.accountId,
		allowPrivateNetwork: params.auth.allowPrivateNetwork,
		ssrfPolicy: params.auth.ssrfPolicy,
		dispatcherPolicy: params.auth.dispatcherPolicy
	});
	return {
		auth: params.auth,
		client,
		key: buildSharedClientKey(params.auth),
		started: false,
		startPromise: null,
		phase: "open",
		leases: /* @__PURE__ */ new Set(),
		monitorRetirementPromises: /* @__PURE__ */ new Set(),
		noLeases: createDeferred(),
		retirementPromise: null,
		poisonError: null,
		releaseMode: "discard",
		ownerSignal: params.lifecycle?.signal
	};
}
function deleteSharedClientState(state) {
	if (sharedClientStates.get(state.key) === state) sharedClientStates.delete(state.key);
	const detachLifecycle = state.detachLifecycle;
	state.detachLifecycle = void 0;
	detachLifecycle?.();
}
function bindSharedClientLifecycle(state, lifecycle) {
	if (!lifecycle) return;
	const retire = () => forceRetireState(state);
	const onAbort = () => {
		retire().catch(() => void 0);
	};
	lifecycle.signal.addEventListener("abort", onAbort, { once: true });
	let removeDisposer;
	try {
		removeDisposer = lifecycle.onDispose(retire);
	} catch (error) {
		lifecycle.signal.removeEventListener("abort", onAbort);
		throw error;
	}
	state.detachLifecycle = () => {
		lifecycle.signal.removeEventListener("abort", onAbort);
		removeDisposer();
	};
	if (lifecycle.signal.aborted) onAbort();
}
async function ensureSharedClientStarted(state, abortSignal) {
	if (state.started) return;
	if (state.startPromise) {
		await awaitMatrixStartupWithAbort(state.startPromise, abortSignal);
		return;
	}
	const guardedStart = (async () => {
		await state.client.start({ abortSignal });
		throwIfMatrixStartupAborted(abortSignal);
		state.started = true;
	})().finally(() => {
		if (state.startPromise === guardedStart) state.startPromise = null;
	});
	state.startPromise = guardedStart;
	await awaitMatrixStartupWithAbort(guardedStart, abortSignal);
}
async function resolveSharedMatrixAuth(params) {
	const requestedAccountId = normalizeOptionalAccountId(params.accountId);
	if (params.auth && requestedAccountId && requestedAccountId !== params.auth.accountId) throw new Error(`Matrix shared client account mismatch: requested ${requestedAccountId}, auth resolved ${params.auth.accountId}`);
	if (params.auth) return params.auth;
	if (!params.cfg) throw new Error("Matrix shared client requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const authContext = resolveMatrixAuthContext({
		cfg: params.cfg,
		env: params.env,
		accountId: params.accountId
	});
	return await resolveMatrixAuth({
		cfg: authContext.cfg,
		env: authContext.env,
		accountId: authContext.accountId
	});
}
async function resolveOpenSharedMatrixClientState(params, lifecycle) {
	const auth = await resolveSharedMatrixAuth(params);
	throwIfMatrixStartupAborted(params.abortSignal);
	const key = buildSharedClientKey(auth);
	while (true) {
		const existing = sharedClientStates.get(key);
		if (existing?.poisonError) throw existing.poisonError;
		if (existing?.phase === "open" && existing.ownerSignal === lifecycle?.signal) return existing;
		if (existing?.retirementPromise) {
			await awaitMatrixStartupWithAbort(existing.retirementPromise, params.abortSignal);
			continue;
		}
		if (existing) {
			await awaitMatrixStartupWithAbort(existing.noLeases.promise, params.abortSignal);
			continue;
		}
		const pending = sharedClientPromises.get(key);
		if (pending) {
			await awaitMatrixStartupWithAbort(pending, params.abortSignal);
			continue;
		}
		const creationPromise = createSharedMatrixClient({
			auth,
			timeoutMs: params.timeoutMs,
			lifecycle
		});
		sharedClientPromises.set(key, creationPromise);
		try {
			const created = await creationPromise;
			sharedClientStates.set(key, created);
			try {
				bindSharedClientLifecycle(created, lifecycle);
			} catch (error) {
				await forceRetireState(created);
				throw error;
			}
			return created;
		} finally {
			if (sharedClientPromises.get(key) === creationPromise) sharedClientPromises.delete(key);
		}
	}
}
async function runMonitorRetirement(retirement) {
	if (!retirement) return;
	retirement.closeTaskAdmission();
	retirement.detachListeners();
	await retirement.waitForTasks();
	await retirement.cleanup();
}
function retireMonitorLease(state, lease) {
	if (lease.monitorRetirementPromise) return lease.monitorRetirementPromise;
	lease.monitorRetirementPromise = runMonitorRetirement(lease.monitorRetirement ?? void 0);
	state.monitorRetirementPromises.add(lease.monitorRetirementPromise);
	return lease.monitorRetirementPromise;
}
async function retireMonitorLeases(state, leases) {
	for (const lease of leases) retireMonitorLease(state, lease);
	const failure = (await Promise.allSettled(state.monitorRetirementPromises)).find((result) => result.status === "rejected");
	if (failure?.status === "rejected") throw failure.reason;
}
function mergeReleaseMode(current, requested) {
	if (current === "persist" || requested === "persist") return "persist";
	if (current === "stop" || requested === "stop") return "stop";
	return "discard";
}
function abortTransientLeases(state) {
	for (const lease of state.leases) if (lease.role === "transient") lease.abortController.abort();
}
function forceReleaseLeases(state, releasePromise) {
	for (const lease of state.leases) {
		lease.releasePromise ??= lease.role === "monitor" ? releasePromise : Promise.resolve();
		lease.abortController.abort();
	}
	state.leases.clear();
	state.noLeases.resolve();
}
async function waitForRetirementDrain(state, task, isPending, timeoutMessage) {
	if (!isPending()) return;
	let deadline;
	try {
		await Promise.race([task, new Promise((_, reject) => {
			deadline = setTimeout(() => {
				if (!isPending()) return;
				state.phase = "late-drain";
				reject(new Error(timeoutMessage));
			}, MATRIX_RETIREMENT_DRAIN_TIMEOUT_MS);
			deadline.unref?.();
		})]);
	} finally {
		if (deadline) clearTimeout(deadline);
	}
}
function beginGenerationRetirement(params) {
	const { state } = params;
	if (state.retirementPromise) return state.retirementPromise;
	state.phase = "quiescing";
	if (state.leases.size === 0) state.noLeases.resolve();
	const result = createDeferred();
	state.retirementPromise = result.promise;
	Promise.resolve().then(async () => {
		const startup = state.startPromise;
		if (startup) try {
			await waitForRetirementDrain(state, startup.catch(() => void 0), () => state.startPromise === startup, `Matrix client startup did not settle within ${MATRIX_RETIREMENT_DRAIN_TIMEOUT_MS}ms during retirement`);
		} catch (error) {
			state.poisonError = toStringifiedError(error);
			result.reject(state.poisonError);
			const failure = (await Promise.allSettled([
				startup.catch(() => void 0).then(async () => {
					state.started = false;
					await state.client.stopWithoutPersist();
				}),
				retireMonitorLeases(state, params.monitorLeases ?? []),
				state.noLeases.promise
			])).find((outcome) => outcome.status === "rejected");
			if (failure) state.poisonError = toStringifiedError(failure.reason);
			else deleteSharedClientState(state);
			throw state.poisonError;
		}
		try {
			await state.client.quiesceSync();
			state.started = false;
			await state.client.drainPendingDecryptions("matrix monitor sync quiesce");
		} catch (error) {
			state.poisonError = toStringifiedError(error);
		}
		let monitorRetired = true;
		try {
			await retireMonitorLeases(state, params.monitorLeases ?? []);
		} catch (error) {
			state.poisonError ??= toStringifiedError(error);
			monitorRetired = false;
		}
		state.phase = "closing";
		let lateLeaseDrain = null;
		try {
			await waitForRetirementDrain(state, state.noLeases.promise, () => state.leases.size > 0, `Matrix transient leases did not drain within ${MATRIX_RETIREMENT_DRAIN_TIMEOUT_MS}ms`);
		} catch (error) {
			state.poisonError ??= toStringifiedError(error);
			result.reject(state.poisonError);
			lateLeaseDrain = state.noLeases.promise;
		}
		let failure = state.poisonError;
		let canDelete = monitorRetired;
		if (failure) canDelete = await state.client.drainPendingDecryptions("matrix poisoned client shutdown").then(() => true, () => false) && canDelete;
		else try {
			await state.client.drainPendingDecryptions("matrix shared client final shutdown");
		} catch (error) {
			failure = state.poisonError = toStringifiedError(error);
		}
		let discard = failure !== null || state.releaseMode === "discard";
		if (!discard) try {
			await state.client.stopAndPersist();
		} catch (error) {
			discard = true;
			if (state.releaseMode === "persist") failure = state.poisonError = toStringifiedError(error);
		}
		if (discard) await state.client.stopWithoutPersist().catch((error) => {
			failure = state.poisonError = toStringifiedError(error);
			canDelete = false;
		});
		await lateLeaseDrain;
		if (canDelete) deleteSharedClientState(state);
		if (failure) throw failure;
	}).then(result.resolve, result.reject);
	abortTransientLeases(state);
	return state.retirementPromise;
}
function createSharedMatrixClientLease(state, role) {
	if (state.phase !== "open" || state.poisonError) return null;
	const leaseState = {
		abortController: new AbortController(),
		monitorRetirement: null,
		monitorRetirementPromise: null,
		role,
		releasePromise: null
	};
	state.leases.add(leaseState);
	return {
		abortSignal: leaseState.abortController.signal,
		client: state.client,
		role,
		registerMonitorRetirement: (retirement) => {
			if (role !== "monitor") throw new Error("Matrix transient leases cannot register monitor retirement");
			if (leaseState.releasePromise || state.phase !== "open") throw new Error("Matrix monitor lease is already retiring");
			if (leaseState.monitorRetirement && leaseState.monitorRetirement !== retirement) throw new Error("Matrix monitor retirement is already registered");
			leaseState.monitorRetirement = retirement;
		},
		start: async (abortSignal) => {
			if (leaseState.releasePromise) throw new Error("Matrix client lease has already been released");
			if (state.phase !== "open") throw new Error("Matrix client generation is retiring");
			await ensureSharedClientStarted(state, abortSignal ? AbortSignal.any([abortSignal, leaseState.abortController.signal]) : leaseState.abortController.signal);
		},
		release: (releaseParams = {}) => {
			if (leaseState.releasePromise) return leaseState.releasePromise;
			state.releaseMode = mergeReleaseMode(state.releaseMode, releaseParams.mode ?? "stop");
			state.leases.delete(leaseState);
			if (state.leases.size === 0) state.noLeases.resolve();
			if (state.phase === "late-drain") {
				leaseState.releasePromise = Promise.resolve();
				return leaseState.releasePromise;
			}
			const finalMonitor = role === "monitor" && !Array.from(state.leases).some((lease) => lease.role === "monitor");
			if (role === "monitor" && !finalMonitor) {
				leaseState.releasePromise = retireMonitorLease(state, leaseState);
				return leaseState.releasePromise;
			}
			if (!(state.phase === "open" && (finalMonitor || state.leases.size === 0))) {
				leaseState.releasePromise = state.poisonError ? Promise.reject(state.poisonError) : Promise.resolve();
				return leaseState.releasePromise;
			}
			leaseState.releasePromise = beginGenerationRetirement({
				state,
				monitorLeases: role === "monitor" ? [leaseState] : void 0
			});
			return leaseState.releasePromise;
		}
	};
}
async function acquireSharedMatrixClient(params = {}) {
	const lifecycle = getMatrixRuntimeLifecycle();
	const signals = [
		getMatrixMonitorTaskSignal(),
		params.abortSignal,
		lifecycle?.signal
	].filter((signal) => signal !== void 0);
	const abortSignal = signals.length > 1 ? AbortSignal.any(signals) : signals[0];
	const acquisition = {
		...params,
		abortSignal
	};
	while (true) {
		throwIfMatrixStartupAborted(abortSignal);
		const state = await resolveOpenSharedMatrixClientState(acquisition, lifecycle);
		if (abortSignal?.aborted) {
			if (state.phase === "open" && state.leases.size === 0) await beginGenerationRetirement({ state });
			throwIfMatrixStartupAborted(abortSignal);
		}
		const lease = createSharedMatrixClientLease(state, params.role ?? "transient");
		if (!lease) continue;
		if (params.startClient !== false) try {
			await lease.start(abortSignal);
		} catch (error) {
			await lease.release({ mode: "stop" }).catch(() => void 0);
			throw error;
		}
		return lease;
	}
}
async function forceRetireState(state) {
	if (state.phase === "late-drain") throw state.poisonError ?? /* @__PURE__ */ new Error("Matrix client generation is still retiring");
	state.releaseMode = mergeReleaseMode(state.releaseMode, "stop");
	const retirementPromise = beginGenerationRetirement({
		state,
		monitorLeases: Array.from(state.leases).filter((lease) => lease.role === "monitor")
	});
	forceReleaseLeases(state, retirementPromise);
	try {
		await retirementPromise;
	} catch (error) {
		if (sharedClientStates.get(state.key) === state) throw state.poisonError ?? error;
	}
}
//#endregion
//#region extensions/matrix/src/matrix/client.ts
var client_exports = /* @__PURE__ */ __exportAll({
	acquireSharedMatrixClient: () => acquireSharedMatrixClient,
	createMatrixClient: () => createMatrixClient,
	resolveMatrixAuthContext: () => resolveMatrixAuthContext
});
const loadMatrixClientRuntime = createLazyRuntimeModule(() => import("./create-client-CHxcron_.mjs"));
const createMatrixClient = createLazyRuntimeMethod(loadMatrixClientRuntime, (runtime) => runtime.createMatrixClient);
//#endregion
export { createMatrixStartupAbortError as a, createMatrixMonitorTaskRunner as c, resolveMatrixAuth as d, resolveMatrixAuthContext as f, awaitMatrixStartupWithAbort as i, getMatrixMonitorTaskSignal as l, createMatrixClient as n, isMatrixStartupAbortError as o, acquireSharedMatrixClient as r, throwIfMatrixStartupAborted as s, client_exports as t, backfillMatrixAuthDeviceIdAfterStartup as u };
