import { n as __exportAll } from "./runtime-doctor-migrations-CSvRANPN.mjs";
import { n as getMatrixRuntimeLifecycle } from "./runtime-Ck8TjD7L.mjs";
import { c as hasReadyMatrixEnvAuth, d as resolveScopedMatrixEnvConfig, f as MATRIX_CONFIG_STRING_FIELDS, i as requiresExplicitMatrixDefaultAccount, l as resolveGlobalMatrixEnvConfig, p as resolveMatrixAccountStringValues, s as resolveMatrixDefaultOrOnlyAccountId, u as resolveMatrixEnvAuthReadiness } from "./account-selection-Cow3TMFO.mjs";
import { t as getMatrixScopedEnvVarNames } from "./env-vars-Bh1iOXJ1.mjs";
import { o as resolveMatrixBaseConfig, r as listNormalizedMatrixAccountIds, t as findMatrixAccountConfig } from "./account-config-CVM2a28p.mjs";
import { t as resolveMatrixConfigFieldPath } from "./config-paths-DBpHxDyc.mjs";
import { n as validateMatrixHomeserverUrl, t as resolveValidatedMatrixHomeserverUrl } from "./url-validation-DesoKUns.mjs";
import { i as repairCurrentTokenStorageMetaDeviceId } from "./storage-CCarF_gm.mjs";
import { n as getMatrixMonitorTaskSignal } from "./task-runner-CYyGHdNW.mjs";
import { c as resolveMatrixLocalTimeoutMs } from "./client-support-CqXAOZp3.mjs";
import { createLazyRuntimeMethod, createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId, normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-id";
import { formatErrorMessage, materializeErrorStack, toErrorObject, toStringifiedError } from "openclaw/plugin-sdk/error-runtime";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { coerceSecretRef, isBuiltInDefaultSecretProviderRef, normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { resolveOptionalIntegerOption } from "openclaw/plugin-sdk/number-runtime";
import { ssrfPolicyFromDangerouslyAllowPrivateNetwork } from "openclaw/plugin-sdk/ssrf-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { racePromiseWithAbortSignal, raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
import { retryAsync } from "openclaw/plugin-sdk/retry-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
// extensions/matrix/src/matrix/client/auth-request.ts
const MATRIX_AUTH_REQUEST_RETRY_RE = /\b(fetch failed|econnreset|econnrefused|enotfound|etimedout|ehostunreach|enetunreach|eai_again|und_err_|socket hang up|network|headers timeout|body timeout|connect timeout)\b/i;
async function retryMatrixAuthRequest(label, run, signal) {
	return await retryAsync(run, {
		attempts: 3,
		minDelayMs: 250,
		maxDelayMs: 1500,
		jitter: .1,
		label,
		shouldRetry: (err) => MATRIX_AUTH_REQUEST_RETRY_RE.test(formatErrorMessage(err)),
		sleep: (ms) => sleepWithAbort(ms, signal)
	});
}
async function fetchMatrixWhoamiIdentity(params) {
	const { MatrixAuthedHttpClient } = await import("./http-client-CqnKFKUH.mjs").then((n) => n.n);
	params.signal?.throwIfAborted();
	const client = new MatrixAuthedHttpClient({
		homeserver: params.homeserver,
		accessToken: params.accessToken,
		ssrfPolicy: params.ssrfPolicy,
		dispatcherPolicy: params.dispatcherPolicy,
		signal: params.signal
	});
	return await retryMatrixAuthRequest("matrix auth whoami", async () => {
		const identity = await client.requestJson({
			method: "GET",
			endpoint: "/_matrix/client/v3/account/whoami",
			timeoutMs: resolveMatrixLocalTimeoutMs(void 0)
		});
		if (!isRecord(identity)) throw new Error("Matrix whoami returned an invalid identity");
		const userId = identity.user_id ?? void 0;
		const deviceId = identity.device_id ?? void 0;
		if (userId !== void 0 && typeof userId !== "string" || deviceId !== void 0 && typeof deviceId !== "string") throw new Error("Matrix whoami returned an invalid identity");
		return {
			user_id: userId,
			device_id: deviceId
		};
	}, params.signal);
}
// extensions/matrix/src/matrix/client/config.ts
const loadMatrixCredentialsReadDeps = createLazyRuntimeModule(() => import("./credentials-read-rPqEpuxv.mjs").then((n) => n.i));
const loadMatrixCredentialsWriteRuntime = createLazyRuntimeModule(() => import("./credentials-CGgWuhFV.mjs"));
const loadMatrixSecretInputDeps = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/secret-input-runtime"));
function credentialsMatchBackfillAuthLineage(params) {
	if (!params.stored) return true;
	return params.stored.homeserver === params.auth.homeserver && params.stored.userId === params.auth.userId && params.stored.accessToken === params.auth.accessToken;
}
const MATRIX_AUTH_SECRET_FIELDS = ["accessToken", "password"];
function readMatrixEnvSecretRef(params) {
	const provider = params.cfg.secrets?.providers?.[params.ref.provider];
	if (provider?.source === "env") {
		if (provider.allowlist && !provider.allowlist.includes(params.ref.id)) throw new Error(`Environment variable "${params.ref.id}" is not allowlisted in secrets.providers.${params.ref.provider}.allowlist.`);
	} else if (!isBuiltInDefaultSecretProviderRef(params.cfg, params.ref)) throw new Error(provider ? `Secret provider "${params.ref.provider}" has source "${provider.source}" but ref requests "env".` : `Secret provider "${params.ref.provider}" is not configured (ref: env:${params.ref.provider}:${params.ref.id}).`);
	return params.env[params.ref.id]?.trim() || void 0;
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
	return Object.values(scoped).some(Boolean);
}
function readMatrixConfigStrings(params) {
	return Object.fromEntries(MATRIX_CONFIG_STRING_FIELDS.map((field) => {
		const input = params.values[field];
		const path = params.path(field);
		const ref = coerceSecretRef(input, params.cfg.secrets?.defaults);
		if (field === "password" && params.suppressPasswordSecretRef && ref) return [field, ""];
		const value = MATRIX_AUTH_SECRET_FIELDS.includes(field) ? ref?.source === "env" ? readMatrixEnvSecretRef({
			ref,
			cfg: params.cfg,
			env: params.env
		}) ?? input : ref ? "" : input : input;
		return [field, normalizeResolvedSecretInputString({
			value,
			path,
			defaults: params.cfg.secrets?.defaults
		}) ?? ""];
	}));
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
	const accountInitialSyncLimit = resolveOptionalIntegerOption(account.initialSyncLimit, { min: 0 });
	const allowPrivateNetwork = account.network?.dangerouslyAllowPrivateNetwork === true || matrix.network?.dangerouslyAllowPrivateNetwork === true ? true : void 0;
	return {
		resolved: {
			homeserver: resolvedStrings.homeserver,
			userId: resolvedStrings.userId,
			accessToken: resolvedStrings.accessToken || void 0,
			password: resolvedStrings.password || void 0,
			deviceId: resolvedStrings.deviceId || void 0,
			deviceName: resolvedStrings.deviceName || void 0,
			initialSyncLimit: accountInitialSyncLimit ?? resolveOptionalIntegerOption(matrix.initialSyncLimit, { min: 0 }),
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
	const env = params.env ?? process.env;
	const requestedAccountId = params.accountId?.trim();
	const explicitAccountId = normalizeOptionalAccountId(params.accountId);
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
	if (cachedCredentials) return buildResolvedMatrixAuth(resolved, {
		accountId,
		homeserver: cachedCredentials.homeserver,
		userId: cachedCredentials.userId,
		accessToken: cachedCredentials.accessToken,
		password: tokenAuthPassword,
		deviceId: cachedCredentials.deviceId || resolved.deviceId
	});
	if (!resolved.userId) throw new Error("Matrix userId is required when no access token is configured (matrix.userId)");
	const password = await resolveConfiguredMatrixAuthSecretInput({
		cfg,
		env,
		configured: authInputs.password
	}) ?? resolved.password;
	if (!password) throw new Error("Matrix password is required when no access token is configured (matrix.password)");
	const { MatrixAuthedHttpClient } = await import("./http-client-CqnKFKUH.mjs").then((n) => n.n);
	const loginClient = new MatrixAuthedHttpClient({
		homeserver,
		accessToken: "",
		ssrfPolicy: resolved.ssrfPolicy,
		dispatcherPolicy: resolved.dispatcherPolicy
	});
	const login = await retryMatrixAuthRequest("matrix auth login", async () => await loginClient.requestJson({
		method: "POST",
		endpoint: "/_matrix/client/v3/login",
		timeoutMs: resolveMatrixLocalTimeoutMs(void 0),
		body: {
			type: "m.login.password",
			identifier: {
				type: "m.id.user",
				user: resolved.userId
			},
			password,
			device_id: resolved.deviceId,
			initial_device_display_name: resolved.deviceName ?? "OpenClaw Gateway"
		}
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
	if (params.abortSignal?.aborted) return;
	let whoami;
	try {
		whoami = await fetchMatrixWhoamiIdentity({
			homeserver: params.auth.homeserver,
			accessToken: params.auth.accessToken,
			ssrfPolicy: params.auth.ssrfPolicy,
			dispatcherPolicy: params.auth.dispatcherPolicy,
			signal: params.abortSignal
		});
	} catch (err) {
		if (params.abortSignal?.aborted) return;
		throw err;
	}
	const deviceId = whoami.device_id?.trim();
	if (!deviceId) return;
	if (params.abortSignal?.aborted) return;
	const env = params.env ?? process.env;
	const { loadMatrixCredentialsAsync } = await loadMatrixCredentialsReadDeps();
	if (!credentialsMatchBackfillAuthLineage({
		stored: await loadMatrixCredentialsAsync(env, params.auth.accountId),
		auth: params.auth
	})) return;
	if (params.abortSignal?.aborted) return;
	if (!await repairCurrentTokenStorageMetaDeviceId({
		homeserver: params.auth.homeserver,
		userId: params.auth.userId,
		accessToken: params.auth.accessToken,
		accountId: params.auth.accountId,
		deviceId,
		env: params.env
	})) throw new Error("Matrix deviceId backfill failed to repair current-token storage metadata");
	if (params.abortSignal?.aborted) return;
	const credentialsWriter = await loadMatrixCredentialsWriteRuntime();
	const currentCredentials = await loadMatrixCredentialsAsync(env, params.auth.accountId);
	if (params.abortSignal?.aborted || !credentialsMatchBackfillAuthLineage({
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
// extensions/matrix/src/matrix/startup-abort.ts
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
	try {
		return await racePromiseWithAbortSignal(promise, abortSignal, createMatrixStartupAbortError);
	} catch (error) {
		throw toErrorObject(error, "Non-Error rejection");
	}
}
// extensions/matrix/src/matrix/client/shared.ts
const loadMatrixCreateClientDeps = createLazyRuntimeModule(() => import("./create-client-mnjEWdZV.mjs"));
const MATRIX_RETIREMENT_DRAIN_TIMEOUT_MS = 5e3;
const sharedClientRegistry = resolveGlobalSingleton(Symbol.for("openclaw.matrix.shared-client-registry"), () => ({
	states: /* @__PURE__ */ new Map(),
	promises: /* @__PURE__ */ new Map(),
	storageOwners: /* @__PURE__ */ new Map()
}));
const sharedClientStates = sharedClientRegistry.states;
const sharedClientPromises = sharedClientRegistry.promises;
const sharedStorageOwners = sharedClientRegistry.storageOwners;
var MatrixTransportGenerationBusyError = class extends Error {
	constructor() {
		super("Matrix account transport is changing; retry after the account restart finishes.");
		this.code = "MATRIX_ACCOUNT_RESTARTING";
		this.retryable = true;
	}
};
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
	return {
		client: await createMatrixClient({
			...params.auth,
			localTimeoutMs: params.timeoutMs
		}, params.preparedStorage),
		key: buildSharedClientKey(params.auth),
		storageOwnerKey: params.preparedStorage.storagePaths?.idbSnapshotPath ?? null,
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
	if (sharedClientStates.get(state.key) === state) {
		sharedClientStates.delete(state.key);
		if (state.storageOwnerKey) sharedStorageOwners.delete(state.storageOwnerKey);
	}
	const detachLifecycle = state.detachLifecycle;
	state.detachLifecycle = void 0;
	detachLifecycle?.();
}
function bindSharedClientLifecycle(state, lifecycle) {
	if (!lifecycle) return;
	state.detachLifecycle = lifecycle.onDispose(() => forceRetireState(state));
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
		state.startPromise = null;
	});
	state.startPromise = guardedStart;
	await awaitMatrixStartupWithAbort(guardedStart, abortSignal);
}
async function resolveSharedMatrixAuth(params) {
	const requestedAccountId = normalizeOptionalAccountId(params.accountId);
	if (params.auth && requestedAccountId && requestedAccountId !== params.auth.accountId) throw new Error(`Matrix shared client account mismatch: requested ${requestedAccountId}, auth resolved ${params.auth.accountId}`);
	if (params.auth) return params.auth;
	if (!params.cfg) throw new Error("Matrix shared client requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	return resolveMatrixAuth({
		cfg: params.cfg,
		accountId: params.accountId
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
		const { prepareMatrixClientStorage } = await loadMatrixCreateClientDeps();
		const preparedStorage = await prepareMatrixClientStorage(auth);
		throwIfMatrixStartupAborted(params.abortSignal);
		if (sharedClientStates.has(key) || sharedClientPromises.has(key)) continue;
		const storageOwnerKey = preparedStorage.storagePaths?.idbSnapshotPath ?? null;
		const ownerPromise = storageOwnerKey ? sharedStorageOwners.get(storageOwnerKey) : void 0;
		if (ownerPromise) {
			const owner = await awaitMatrixStartupWithAbort(ownerPromise, params.abortSignal);
			if (owner.retirementPromise) {
				await awaitMatrixStartupWithAbort(owner.retirementPromise, params.abortSignal);
				continue;
			}
			throw new MatrixTransportGenerationBusyError();
		}
		const creationPromise = createSharedMatrixClient({
			auth,
			timeoutMs: params.timeoutMs,
			lifecycle,
			preparedStorage
		});
		sharedClientPromises.set(key, creationPromise);
		if (storageOwnerKey) sharedStorageOwners.set(storageOwnerKey, creationPromise);
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
			if (storageOwnerKey && !sharedClientStates.has(key) && sharedStorageOwners.get(storageOwnerKey) === creationPromise) sharedStorageOwners.delete(storageOwnerKey);
		}
	}
}
async function runMonitorRetirement(retirement) {
	if (!retirement) return;
	try {
		retirement.closeTaskAdmission();
		retirement.detachListeners();
		await retirement.waitForTasks();
		await retirement.cleanup();
	} catch (error) {
		materializeErrorStack(error);
		throw error;
	}
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
function waitForRetirement(retirement) {
	return raceWithTimeout(retirement, MATRIX_RETIREMENT_DRAIN_TIMEOUT_MS, () => {
		throw new Error("Matrix client retirement did not settle within 5000ms");
	}, { ref: false });
}
function beginGenerationRetirement(params) {
	const { state } = params;
	if (state.retirementPromise) return waitForRetirement(state.retirementPromise);
	state.phase = "retiring";
	if (state.leases.size === 0) state.noLeases.resolve();
	const result = createDeferred();
	state.retirementPromise = result.promise;
	Promise.resolve().then(async () => {
		await state.startPromise?.catch(() => void 0);
		try {
			await state.client.quiesceSync();
			state.started = false;
			await state.client.drainPendingDecryptions("matrix monitor sync quiesce");
		} catch (error) {
			state.poisonError = toStringifiedError(error);
			materializeErrorStack(state.poisonError);
		}
		try {
			await retireMonitorLeases(state, params.monitorLeases ?? []);
		} catch (error) {
			state.poisonError ??= toStringifiedError(error);
			materializeErrorStack(state.poisonError);
		}
		await state.noLeases.promise;
		if (state.poisonError) await state.client.drainPendingDecryptions("matrix failed shutdown").catch((error) => {
			state.poisonError = toStringifiedError(error);
			materializeErrorStack(state.poisonError);
		});
		let failure = state.poisonError;
		let discard = failure !== null || state.releaseMode === "discard";
		if (!discard) try {
			await state.client.stopAndPersist();
		} catch (error) {
			discard = true;
			if (state.releaseMode === "persist") {
				failure = state.poisonError = toStringifiedError(error);
				materializeErrorStack(failure);
			}
		}
		if (discard) await state.client.stopWithoutPersist();
		deleteSharedClientState(state);
		if (failure) throw failure;
	}).then(result.resolve, (error) => {
		state.poisonError = toStringifiedError(error);
		materializeErrorStack(state.poisonError);
		result.reject(state.poisonError);
	});
	abortTransientLeases(state);
	return waitForRetirement(state.retirementPromise);
}
function createSharedMatrixClientLease(state, role) {
	if (state.phase !== "open" || state.poisonError) throw new Error("Matrix client is retiring; retry the operation after shutdown");
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
	throwIfMatrixStartupAborted(abortSignal);
	const state = await resolveOpenSharedMatrixClientState(acquisition, lifecycle);
	if (abortSignal?.aborted) {
		if (state.phase === "open" && state.leases.size === 0) await beginGenerationRetirement({ state });
		throwIfMatrixStartupAborted(abortSignal);
	}
	return createSharedMatrixClientLease(state, params.role ?? "transient");
}
async function forceRetireState(state) {
	state.releaseMode = mergeReleaseMode(state.releaseMode, "stop");
	const retirementPromise = beginGenerationRetirement({
		state,
		monitorLeases: Array.from(state.leases).filter((lease) => lease.role === "monitor")
	});
	forceReleaseLeases(state, retirementPromise);
	await retirementPromise;
}
async function stopSharedClientForAccount(auth) {
	const state = sharedClientStates.get(buildSharedClientKey(auth));
	if (!state || state.ownerSignal !== getMatrixRuntimeLifecycle()?.signal) return;
	await forceRetireState(state);
}
// extensions/matrix/src/matrix/client.ts
var client_exports = /* @__PURE__ */ __exportAll({
	acquireSharedMatrixClient: () => acquireSharedMatrixClient,
	backfillMatrixAuthDeviceIdAfterStartup: () => backfillMatrixAuthDeviceIdAfterStartup,
	createMatrixClient: () => createMatrixClient,
	getMatrixScopedEnvVarNames: () => getMatrixScopedEnvVarNames,
	hasReadyMatrixEnvAuth: () => hasReadyMatrixEnvAuth,
	resolveMatrixAuth: () => resolveMatrixAuth,
	resolveMatrixAuthContext: () => resolveMatrixAuthContext,
	resolveMatrixEnvAuthReadiness: () => resolveMatrixEnvAuthReadiness,
	resolveScopedMatrixEnvConfig: () => resolveScopedMatrixEnvConfig,
	resolveValidatedMatrixHomeserverUrl: () => resolveValidatedMatrixHomeserverUrl,
	stopSharedClientForAccount: () => stopSharedClientForAccount,
	validateMatrixHomeserverUrl: () => validateMatrixHomeserverUrl
});
const loadMatrixClientRuntime = createLazyRuntimeModule(() => import("./create-client-mnjEWdZV.mjs"));
const createMatrixClient = createLazyRuntimeMethod(loadMatrixClientRuntime, (runtime) => runtime.createMatrixClient);
export { isMatrixStartupAbortError as a, resolveMatrixAuth as c, createMatrixStartupAbortError as i, resolveMatrixAuthContext as l, acquireSharedMatrixClient as n, throwIfMatrixStartupAborted as o, awaitMatrixStartupWithAbort as r, backfillMatrixAuthDeviceIdAfterStartup as s, client_exports as t };
