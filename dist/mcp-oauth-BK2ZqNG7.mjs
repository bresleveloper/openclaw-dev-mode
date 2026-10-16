import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation, n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { n as buildMcpOAuthAuthorizationFetch, r as buildMcpOAuthHttpFetch } from "./mcp-http-fetch-DPSJ01yY.mjs";
import { i as requesterMcpOAuthStoreKeyPrefix } from "./mcp-oauth-identity-BAZLWoC_.mjs";
import { n as withOpenClawStateLeaseAsync } from "./openclaw-state-lease-CdKflcqg.mjs";
import { n as runWithOpenClawStateLeaseWorker } from "./openclaw-state-lease-worker-operation-zXIF5JPg.mjs";
import "./mcp-oauth-store.mutations-DmXh16Gm.mjs";
import { randomUUID } from "node:crypto";
import { auth } from "@modelcontextprotocol/sdk/client/auth.js";
//#region src/agents/mcp-oauth-status.ts
function projectMcpOAuthCredentialsStatus(store) {
	if (store.pendingAuthorizationChallenge?.requiresAuthorization === true) return { state: "requires-authorization" };
	if (store.tokens) return {
		state: "authorized",
		...store.tokenExpiresAt === void 0 ? {} : { expiresAt: store.tokenExpiresAt }
	};
	if (store.clientInformation || store.codeVerifier || store.discoveryState || store.lastAuthorizationUrl || store.redirectUrl || store.pendingAuthorizationChallenge) return { state: "pending-authorization" };
	return { state: "unauthenticated" };
}
//#endregion
//#region src/agents/mcp-oauth-store.ts
/** Read canonical state, opening the writable lifecycle when runtime owns it. */
async function readMcpOAuthStore(storeKey, context = captureOpenClawStateWorkerContext()) {
	return executeOpenClawStateWorker(context, {
		type: "mcpOAuth.read",
		input: storeKey
	});
}
/** Read status state without creating or repairing the shared database. */
async function readMcpOAuthStoreReadOnly(storeKey, context = captureOpenClawStateWorkerContext()) {
	const result = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mcpOAuth.readOnly",
		input: storeKey
	}, { context });
	if (result === void 0) return {};
	if (result.ok && result.type === "mcpOAuth.readOnly") return result.value;
	throw new Error("Unexpected MCP OAuth store read result");
}
async function readMcpOAuthStoreStatuses(storeKeys, context = captureOpenClawStateWorkerContext()) {
	if (storeKeys.length === 0) return [];
	const result = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mcpOAuth.statuses",
		input: storeKeys
	}, { context });
	if (result === void 0) return storeKeys.map(() => projectMcpOAuthCredentialsStatus({}));
	if (result.ok && result.type === "mcpOAuth.statuses") return result.value;
	throw new Error("Unexpected MCP OAuth status batch result");
}
/** List canonical store keys matching one server/principal prefix without creating state. */
async function listMcpOAuthStoreKeysByPrefix(prefix, context = captureOpenClawStateWorkerContext()) {
	const result = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mcpOAuth.keys",
		input: prefix
	}, { context });
	if (result === void 0) return [];
	if (result.ok && result.type === "mcpOAuth.keys") return result.value;
	throw new Error("Unexpected MCP OAuth keys read result");
}
async function countMcpOAuthStorePrincipals(prefix) {
	const context = captureOpenClawStateWorkerContext();
	const result = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mcpOAuth.countPrincipals",
		input: prefix
	}, { context });
	if (result === void 0) return 0;
	if (result.ok && result.type === "mcpOAuth.countPrincipals") return result.value;
	throw new Error("Unexpected MCP OAuth principal count result");
}
/** Resolve one unexpired callback state without creating state or scanning credential JSON. */
async function readMcpOAuthPendingAuthorization(state, context = captureOpenClawStateWorkerContext()) {
	const result = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mcpOAuth.pending",
		input: state
	}, { context });
	if (result === void 0) return;
	if (result.ok && result.type === "mcpOAuth.pending") return result.value;
	throw new Error("Unexpected MCP OAuth pending state read result");
}
/** Apply a bounded mutation under its original live store lease. */
function mutateMcpOAuthStore({ storeKey, lease, context }, mutation, authority) {
	const captured = structuredClone(mutation);
	return runWithOpenClawStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "mcpOAuth.mutate",
		input: {
			storeKey,
			identity,
			mutation: captured
		}
	}, { signal: lease.signal }), authority);
}
/** Claim one exact unexpired callback state while its store lease is still owned. */
function consumeOAuthState({ storeKey, lease, context }, state, authority) {
	return runWithOpenClawStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "mcpOAuth.consumePending",
		input: {
			storeKey,
			identity,
			state
		}
	}, { signal: lease.signal }), authority);
}
/** Replace one store's callback state after OAuth persisted its session. */
function writeMcpOAuthPendingAuthorization({ storeKey, lease, context }, state, authority) {
	return runWithOpenClawStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "mcpOAuth.writePending",
		input: {
			storeKey,
			identity,
			state
		}
	}, { signal: lease.signal }), authority);
}
/** Delete callback correlation for one settled or cleared OAuth store. */
function deleteMcpOAuthPendingAuthorization({ storeKey, lease, context }, authority) {
	return runWithOpenClawStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "mcpOAuth.deletePending",
		input: {
			storeKey,
			identity
		}
	}, { signal: lease.signal }), authority);
}
/** Clear one OAuth session while retaining explicit logout provenance. */
function clearMcpOAuthStore({ storeKey, lease, context }) {
	return runWithOpenClawStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "mcpOAuth.clear",
		input: {
			storeKey,
			identity
		}
	}, { signal: lease.signal }));
}
/** Remove orphan callback rows for a removed server's requester prefix. */
function deleteMcpOAuthPendingAuthorizationsByPrefix(prefix, context = captureOpenClawStateWorkerContext()) {
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "mcpOAuth.clearPendingPrefix",
		input: prefix
	}), {
		assertCurrent: context.admission.assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(context.admission.assertCurrent, [context.admission.databasePath])
	});
}
//#endregion
//#region src/agents/mcp-oauth-provider.ts
/** MCP SDK OAuth provider backed by canonical OpenClaw state. */
function resolveTokenExpiresAt(tokens) {
	const expiresIn = tokens.expires_in;
	return typeof expiresIn === "number" && Number.isFinite(expiresIn) ? Date.now() + expiresIn * 1e3 : void 0;
}
function canReuseStoredTokens(store) {
	const discoveredIssuer = store.discoveryState?.authorizationServerUrl;
	return !store.tokens?.refresh_token || discoveredIssuer === void 0 || store.tokensAuthorizationServerUrl !== void 0 && discoveredIssuer === store.tokensAuthorizationServerUrl;
}
function resolveOAuthRedirectUrl(config, store = {}) {
	return normalizeOptionalString(config.redirectUrl) ?? normalizeOptionalString(store.redirectUrl) ?? "http://127.0.0.1:8989/oauth/callback";
}
function buildOAuthClientMetadata(config, store = {}) {
	return {
		client_name: "OpenClaw MCP",
		redirect_uris: [resolveOAuthRedirectUrl(config, store)],
		grant_types: ["authorization_code", "refresh_token"],
		response_types: ["code"],
		token_endpoint_auth_method: "none",
		...normalizeOptionalString(config.scope) ? { scope: normalizeOptionalString(config.scope) } : {}
	};
}
function hasRegisteredOAuthRedirect(redirectUris, redirectUrl) {
	if (redirectUris.includes(redirectUrl)) return true;
	const loopback = URL.parse(redirectUrl);
	if (!loopback || loopback.protocol !== "http:" || ![
		"127.0.0.1",
		"[::1]",
		"localhost"
	].includes(loopback.hostname)) return false;
	return redirectUris.includes(redirectUrl.replace(/^(http:\/\/[^/?#]+):\d+(?=[/?#]|$)/iu, "$1"));
}
/** Bind OAuth network work to the lease that fences its persisted side effects. */
function withMcpOAuthLeaseSignal(fetchFn, leaseSignal, assertCurrent) {
	const baseFetch = fetchFn ?? ((url, init) => fetch(url, init));
	return async (url, init) => {
		assertCurrent?.();
		const requestSignal = init?.signal;
		const signal = requestSignal ? AbortSignal.any([requestSignal, leaseSignal]) : leaseSignal;
		const response = await baseFetch(url, {
			...init,
			signal
		});
		assertCurrent?.();
		return response;
	};
}
/** Creates the MCP SDK OAuth provider backed by canonical shared SQLite state. */
async function createMcpOAuthClientProvider(params) {
	const config = params.config ?? {};
	const storeKey = params.identity.storeKey;
	const storeContext = params.storeContext;
	let preparedVerifier;
	let prepared = {};
	let preparation = 0;
	let nextWrite = 0;
	let lastSettledWrite = 0;
	const settleWrite = (write, value) => {
		if (write < lastSettledWrite) return;
		lastSettledWrite = write;
		preparation++;
		prepared = value;
	};
	const readStore = async () => {
		params.login?.assertCurrent();
		const currentPreparation = ++preparation;
		const store = await readMcpOAuthStore(storeKey, storeContext);
		params.login?.assertCurrent();
		await params.lease.assertOwned();
		params.login?.assertCurrent();
		if (currentPreparation === preparation) prepared = { redirectUrl: store.redirectUrl };
		return store;
	};
	await readStore();
	params.login?.assertCurrent();
	const updateStore = async (mutation, options = {}) => {
		params.login?.assertCurrent();
		preparation++;
		const write = ++nextWrite;
		const authority = params.login ? {
			assertCurrent: params.login.assertCurrent,
			beforeCommit: options.beforeCommit
		} : void 0;
		try {
			const { store } = await mutateMcpOAuthStore({
				storeKey,
				lease: params.lease,
				context: storeContext
			}, mutation, authority);
			options.onAcknowledged?.();
			params.login?.assertCurrent();
			settleWrite(write, { redirectUrl: store.redirectUrl });
			return store;
		} catch (error) {
			settleWrite(write, { error });
			throw error;
		}
	};
	const preparedStore = () => {
		if ("error" in prepared) throw prepared.error;
		return prepared;
	};
	const assertAuthorizationRedirectAllowed = () => {
		params.login?.assertCurrent();
		if (params.allowAuthorizationRedirect !== true) throw new Error(`MCP server "${params.identity.serverName}" requires OAuth authorization. Run openclaw mcp login ${params.identity.serverName}.`);
	};
	return {
		get redirectUrl() {
			return resolveOAuthRedirectUrl(config, preparedStore());
		},
		clientMetadataUrl: normalizeOptionalString(config.clientMetadataUrl),
		get clientMetadata() {
			return buildOAuthClientMetadata(config, preparedStore());
		},
		async state() {
			assertAuthorizationRedirectAllowed();
			if (params.login) {
				const store = await readStore();
				params.login.assertCurrent();
				if (store.tokens?.access_token && store.pendingAuthorizationChallenge?.requiresAuthorization !== true && (store.tokenExpiresAt === void 0 || store.tokenExpiresAt > Date.now())) throw new Error("Existing authentication could not be refreshed. Use the CLI sign-in flow.");
			}
			return randomUUID();
		},
		async clientInformation() {
			const store = await readStore();
			params.login?.assertCurrent();
			if (!canReuseStoredTokens(store)) {
				assertAuthorizationRedirectAllowed();
				return;
			}
			const clientInformation = store.clientInformation;
			if (!store.tokens && clientInformation && "redirect_uris" in clientInformation && Array.isArray(clientInformation.redirect_uris) && !hasRegisteredOAuthRedirect(clientInformation.redirect_uris, resolveOAuthRedirectUrl(config, store))) return;
			return clientInformation;
		},
		async saveClientInformation(clientInformation) {
			await updateStore({
				kind: "clientInformation",
				clientInformation
			});
			params.login?.assertCurrent();
		},
		async tokens() {
			if (params.suppressStoredTokens) {
				params.login?.assertCurrent();
				await params.lease.assertOwned();
				params.login?.assertCurrent();
				return;
			}
			const store = await readStore();
			params.login?.assertCurrent();
			return canReuseStoredTokens(store) ? store.tokens : void 0;
		},
		async saveTokens(tokens) {
			await updateStore({
				kind: "tokens",
				tokens,
				tokenExpiresAt: resolveTokenExpiresAt(tokens)
			}, {
				beforeCommit: params.login?.beforeTokensSaved,
				onAcknowledged: params.login?.onTokensSaved
			});
			params.login?.assertCurrent();
		},
		async redirectToAuthorization(authorizationUrl) {
			assertAuthorizationRedirectAllowed();
			const state = authorizationUrl.searchParams.get("state");
			if (params.login && (!state || !preparedVerifier)) throw new Error("MCP OAuth authorization preparation is incomplete.");
			await updateStore({
				kind: "authorizationRedirect",
				authorizationUrl: authorizationUrl.toString(),
				redirectUrl: normalizeOptionalString(config.redirectUrl),
				codeVerifier: preparedVerifier
			}, { onAcknowledged: () => {
				preparedVerifier = void 0;
				if (state) params.login?.onAuthorizationPublished(state);
			} });
			params.login?.assertCurrent();
		},
		saveCodeVerifier(codeVerifier) {
			assertAuthorizationRedirectAllowed();
			preparedVerifier = codeVerifier;
		},
		async codeVerifier() {
			params.login?.assertCurrent();
			let codeVerifier = preparedVerifier;
			if (codeVerifier !== void 0) {
				await params.lease.assertOwned();
				params.login?.assertCurrent();
			} else {
				const store = await readStore();
				params.login?.assertCurrent();
				codeVerifier = store.codeVerifier;
			}
			if (!codeVerifier) throw new Error("Missing MCP OAuth code verifier. Run the login flow again.");
			return codeVerifier;
		},
		async invalidateCredentials(scope) {
			params.login?.assertCurrent();
			if (params.login) throw new Error("Existing authentication was retained. Use the CLI sign-in flow.");
			await updateStore({
				kind: "invalidate",
				scope,
				suppressStoredTokens: params.suppressStoredTokens === true
			});
		},
		async saveDiscoveryState(discoveryState) {
			await updateStore({
				kind: "discoveryState",
				discoveryState
			});
			params.login?.assertCurrent();
		},
		async discoveryState() {
			const store = await readStore();
			params.login?.assertCurrent();
			return store.discoveryState;
		}
	};
}
//#endregion
//#region src/agents/mcp-oauth.ts
/** MCP OAuth credential provider, flow coordinator, and login helpers. */
const LOCALHOST_REDIRECT_URL = "http://localhost:8989/oauth/callback";
const TOKEN_EXPIRY_SKEW_MS = 3e4;
const MCP_OAUTH_LEASE_MS = 6e4;
const MCP_OAUTH_LEASE_WAIT_MS = 3e4;
function isMcpOAuthRedirectRegistrationError(error) {
	return /invalid_client_metadata|redirect_uri/i.test(String(error));
}
async function withMcpOAuthLease(storeKey, run, signal, context = captureOpenClawStateWorkerContext()) {
	context.admission.assertCurrent();
	return await withOpenClawStateLeaseAsync({
		scope: "core:mcp-oauth",
		key: storeKey,
		leaseMs: MCP_OAUTH_LEASE_MS,
		waitMs: MCP_OAUTH_LEASE_WAIT_MS,
		...signal ? { signal } : {}
	}, context, (lease) => run(lease, context));
}
function mcpOAuthAdditionalAuthorizationError(serverName) {
	return /* @__PURE__ */ new Error(`MCP server "${serverName}" requires additional OAuth authorization. Run openclaw mcp login ${serverName}.`);
}
async function resolveMcpOAuthAccessToken(params) {
	const storeKey = params.identity.storeKey;
	return await withMcpOAuthLease(storeKey, async (lease, context) => {
		const store = await readMcpOAuthStore(storeKey, context);
		await lease.assertOwned();
		const tokens = store.tokens;
		const rejectedCurrentToken = params.rejectedAccessToken === tokens?.access_token;
		const challengeAppliesToCurrentState = !tokens?.access_token || rejectedCurrentToken;
		if (params.authorizationChallenge === true && challengeAppliesToCurrentState) {
			const resourceMetadataUrl = params.resourceMetadataUrl?.toString();
			const scope = normalizeOptionalString(params.scope);
			if (resourceMetadataUrl || scope || params.interactiveAuthorizationRequired === true) await mutateMcpOAuthStore({
				storeKey,
				lease,
				context
			}, {
				kind: "authorizationChallenge",
				resourceMetadataUrl,
				scope,
				...params.interactiveAuthorizationRequired === true ? { requiresAuthorization: true } : {}
			});
		}
		if (params.authorizationChallenge === true && params.interactiveAuthorizationRequired === true && challengeAppliesToCurrentState) throw mcpOAuthAdditionalAuthorizationError(params.identity.serverName);
		if (store.pendingAuthorizationChallenge?.requiresAuthorization === true) throw mcpOAuthAdditionalAuthorizationError(params.identity.serverName);
		if (!tokens?.access_token) {
			if (params.allowMissingToken === true) return;
			throw new Error(`MCP server "${params.identity.serverName}" requires OAuth authorization. Run openclaw mcp login ${params.identity.serverName}.`);
		}
		const tokenIsFresh = store.tokenExpiresAt !== void 0 && store.tokenExpiresAt > Date.now() + TOKEN_EXPIRY_SKEW_MS;
		if (!rejectedCurrentToken && (tokenIsFresh || store.tokenExpiresAt === void 0 && (params.acceptUnknownExpiry === true || !tokens.refresh_token))) return tokens.access_token;
		if (!tokens.refresh_token) throw new Error(`MCP server "${params.identity.serverName}" has expired OAuth credentials. Run openclaw mcp login ${params.identity.serverName}.`);
		const pendingChallenge = store.pendingAuthorizationChallenge;
		await mutateMcpOAuthStore({
			storeKey,
			lease,
			context
		}, { kind: "bindTokensIssuer" });
		const provider = await createMcpOAuthClientProvider({
			identity: params.identity,
			config: params.config,
			lease,
			storeContext: context
		});
		const leasedFetchFn = withMcpOAuthLeaseSignal(params.fetchFn ?? buildMcpOAuthHttpFetch({ resourceUrl: params.identity.serverUrl }), lease.signal);
		let latestFetchFailure;
		let result;
		try {
			result = await auth(provider, {
				serverUrl: params.identity.serverUrl,
				resourceMetadataUrl: params.resourceMetadataUrl ?? (pendingChallenge?.resourceMetadataUrl ? new URL(pendingChallenge.resourceMetadataUrl) : void 0),
				scope: params.scope ?? normalizeOptionalString(pendingChallenge?.scope) ?? normalizeOptionalString(params.config?.scope),
				fetchFn: async (url, init) => {
					try {
						const response = await leasedFetchFn(url, init);
						latestFetchFailure = void 0;
						return response;
					} catch (error) {
						latestFetchFailure = { error };
						throw error;
					}
				}
			});
		} catch (error) {
			throw latestFetchFailure ? latestFetchFailure.error : error;
		}
		if (latestFetchFailure) throw latestFetchFailure.error;
		await lease.assertOwned();
		const refreshedTokens = await provider.tokens();
		if (result !== "AUTHORIZED" || !refreshedTokens?.access_token) throw new Error(`MCP server "${params.identity.serverName}" could not refresh OAuth credentials. Run openclaw mcp login ${params.identity.serverName}.`);
		return refreshedTokens.access_token;
	}, params.signal);
}
/** Persist a terminal resource rejection without overwriting newer credentials. */
async function recordMcpOAuthAuthorizationRequired(params) {
	const storeKey = params.identity.storeKey;
	return await withMcpOAuthLease(storeKey, async (lease, context) => {
		const store = await readMcpOAuthStore(storeKey, context);
		await lease.assertOwned();
		if (store.tokens?.access_token !== params.rejectedAccessToken) return false;
		return (await mutateMcpOAuthStore({
			storeKey,
			lease,
			context
		}, {
			kind: "authorizationChallenge",
			rejectedAccessToken: params.rejectedAccessToken,
			resourceMetadataUrl: params.resourceMetadataUrl?.toString(),
			scope: normalizeOptionalString(params.scope),
			requiresAuthorization: true
		})).applied;
	}, params.signal);
}
/** Deletes one OAuth session without racing an in-flight refresh or login. */
async function clearMcpOAuthCredentials(identity) {
	await clearMcpOAuthStoreKey(identity.storeKey);
}
async function clearMcpOAuthStoreKey(storeKey, context = captureOpenClawStateWorkerContext()) {
	await withMcpOAuthLease(storeKey, async (lease) => {
		await clearMcpOAuthStore({
			storeKey,
			lease,
			context
		});
	}, void 0, context);
}
/** Clear operator and requester credentials bound to one configured server URL. */
async function clearMcpOAuthServer(identity) {
	const context = captureOpenClawStateWorkerContext();
	await clearMcpOAuthStoreKey(identity.storeKey, context);
	await clearMcpOAuthRequesters(identity, context);
}
/** Clear requester credentials without changing the operator row for this server URL. */
async function clearMcpOAuthRequesters(identity, context = captureOpenClawStateWorkerContext()) {
	const prefix = requesterMcpOAuthStoreKeyPrefix(identity.serverName, identity.serverUrl);
	const requesterKeys = await listMcpOAuthStoreKeysByPrefix(prefix, context);
	for (const storeKey of requesterKeys) await clearMcpOAuthStoreKey(storeKey, context);
	await deleteMcpOAuthPendingAuthorizationsByPrefix(prefix, context);
}
/** Count authorized requester principals for one configured server URL. */
async function countMcpOAuthPrincipals(identity) {
	return countMcpOAuthStorePrincipals(requesterMcpOAuthStoreKeyPrefix(identity.serverName, identity.serverUrl));
}
/** Read one ordered requester set within a single current storage lifetime. */
async function readMcpOAuthCredentialsStatuses(identities) {
	return readMcpOAuthStoreStatuses(identities.map((identity) => identity.storeKey));
}
/** Reads stored OAuth credential presence without exposing values or creating state. */
async function readMcpOAuthCredentialsStatus(identity, preparedStore) {
	return projectMcpOAuthCredentialsStatus(preparedStore ?? await readMcpOAuthStoreReadOnly(identity.storeKey));
}
async function runMcpOAuthAuthorizationAttempt(params, lease, context) {
	params.login?.assertCurrent();
	const provider = await createMcpOAuthClientProvider({
		identity: params.identity,
		config: params.config,
		allowAuthorizationRedirect: true,
		suppressStoredTokens: params.suppressStoredTokens,
		lease,
		login: params.login,
		storeContext: context
	});
	params.login?.assertCurrent();
	const result = await auth(provider, {
		serverUrl: params.identity.serverUrl,
		authorizationCode: normalizeOptionalString(params.authorizationCode),
		resourceMetadataUrl: params.resourceMetadataUrl,
		scope: normalizeOptionalString(params.scope) ?? normalizeOptionalString(params.config?.scope),
		fetchFn: withMcpOAuthLeaseSignal(params.fetchFn, lease.signal, params.login?.assertCurrent)
	});
	params.login?.assertCurrent();
	await lease.assertOwned();
	params.login?.assertCurrent();
	return result === "AUTHORIZED" ? "authorized" : "redirect";
}
async function startMcpOAuthAuthorization(identity, config, opts) {
	const storeKey = identity.storeKey;
	return await withMcpOAuthLease(storeKey, async (lease, context) => {
		opts.login?.assertCurrent();
		const store = await readMcpOAuthStore(storeKey, context);
		opts.login?.assertCurrent();
		await lease.assertOwned();
		opts.login?.assertCurrent();
		if (opts.login && store.tokens?.access_token && store.pendingAuthorizationChallenge?.requiresAuthorization !== true && (store.tokenExpiresAt === void 0 || store.tokenExpiresAt > Date.now() + TOKEN_EXPIRY_SKEW_MS)) return { status: "authorized" };
		const pendingChallenge = store.pendingAuthorizationChallenge;
		const configuredRedirectUrl = normalizeOptionalString(opts.redirectUrl) ?? normalizeOptionalString(config.oauth?.redirectUrl) ?? store.redirectUrl;
		const attempt = {
			identity,
			config: {
				...config.oauth,
				...configuredRedirectUrl ? { redirectUrl: configuredRedirectUrl } : {}
			},
			fetchFn: buildMcpOAuthAuthorizationFetch(config, opts.login?.assertCurrent),
			resourceMetadataUrl: pendingChallenge?.resourceMetadataUrl ? new URL(pendingChallenge.resourceMetadataUrl) : void 0,
			scope: normalizeOptionalString(pendingChallenge?.scope),
			suppressStoredTokens: pendingChallenge?.requiresAuthorization === true,
			login: opts.login
		};
		let result;
		try {
			result = await runMcpOAuthAuthorizationAttempt(attempt, lease, context);
		} catch (error) {
			opts.login?.assertCurrent();
			if (!normalizeOptionalString(opts.redirectUrl) && !normalizeOptionalString(config.oauth?.redirectUrl) && isMcpOAuthRedirectRegistrationError(error)) result = await runMcpOAuthAuthorizationAttempt({
				...attempt,
				config: {
					...config.oauth,
					redirectUrl: LOCALHOST_REDIRECT_URL
				}
			}, lease, context);
			else throw error;
		}
		opts.login?.assertCurrent();
		if (result === "authorized") return { status: "authorized" };
		const pending = await readMcpOAuthStore(storeKey, context);
		opts.login?.assertCurrent();
		await lease.assertOwned();
		opts.login?.assertCurrent();
		const authorizationUrl = pending.lastAuthorizationUrl;
		const state = authorizationUrl ? new URL(authorizationUrl).searchParams.get("state") : null;
		if (!authorizationUrl || !pending.codeVerifier || !pending.redirectUrl || !state) throw new Error("MCP OAuth authorization session was not persisted.");
		await writeMcpOAuthPendingAuthorization({
			storeKey,
			lease,
			context
		}, state, opts.login ? { assertCurrent: opts.login.assertCurrent } : void 0);
		opts.login?.assertCurrent();
		return {
			status: "redirect",
			authorizationUrl,
			redirectUrl: pending.redirectUrl,
			state
		};
	}, opts.login?.signal);
}
async function completeMcpOAuthAuthorization(identity, config, input) {
	const storeKey = identity.storeKey;
	return await withMcpOAuthLease(storeKey, async (lease, context) => {
		return await completeMcpOAuthAuthorizationUnderLease(identity, config, input, lease, context);
	});
}
function readMcpOAuthAuthorizationState(authorizationUrl) {
	if (!authorizationUrl) return;
	try {
		return normalizeOptionalString(new URL(authorizationUrl).searchParams.get("state"));
	} catch {
		return;
	}
}
async function completeMcpOAuthAuthorizationUnderLease(identity, config, input, lease, context, login) {
	const authorizationCode = normalizeOptionalString(input.code);
	if (!authorizationCode) throw new Error("Missing MCP OAuth authorization code. Run the login flow again.");
	const storeKey = identity.storeKey;
	login?.assertCurrent();
	const store = await readMcpOAuthStore(storeKey, context);
	login?.assertCurrent();
	await lease.assertOwned();
	login?.assertCurrent();
	if (!store.codeVerifier || !store.redirectUrl) throw new Error("Missing MCP OAuth authorization session. Run the login flow again.");
	const pendingChallenge = store.pendingAuthorizationChallenge;
	const result = await runMcpOAuthAuthorizationAttempt({
		identity,
		config: {
			...config.oauth,
			redirectUrl: store.redirectUrl
		},
		fetchFn: buildMcpOAuthAuthorizationFetch(config, login?.assertCurrent),
		authorizationCode,
		resourceMetadataUrl: pendingChallenge?.resourceMetadataUrl ? new URL(pendingChallenge.resourceMetadataUrl) : void 0,
		scope: normalizeOptionalString(pendingChallenge?.scope),
		suppressStoredTokens: pendingChallenge?.requiresAuthorization === true,
		login
	}, lease, context);
	login?.assertCurrent();
	if (result !== "authorized") throw new Error("MCP OAuth authorization did not complete. Run the login flow again.");
	const options = {
		storeKey,
		lease,
		context
	};
	const authority = login ? { assertCurrent: login.assertCurrent } : void 0;
	await mutateMcpOAuthStore(options, { kind: "completeAuthorization" }, authority);
	login?.assertCurrent();
	await deleteMcpOAuthPendingAuthorization(options, authority);
	login?.assertCurrent();
	return "authorized";
}
/** Claims one callback state and completes its exchange under the same store lease. */
async function completeOAuthCallback(identity, config, input, login, context = captureOpenClawStateWorkerContext()) {
	return await withMcpOAuthLease(identity.storeKey, async (lease) => {
		login?.assertCurrent();
		const consumed = await consumeOAuthState({
			storeKey: identity.storeKey,
			lease,
			context
		}, input.state, login ? { assertCurrent: login.assertCurrent } : void 0);
		login?.assertCurrent();
		if (!consumed) return "expired";
		const store = await readMcpOAuthStore(identity.storeKey, context);
		login?.assertCurrent();
		await lease.assertOwned();
		login?.assertCurrent();
		if (readMcpOAuthAuthorizationState(store.lastAuthorizationUrl) !== input.state) return "expired";
		const result = await completeMcpOAuthAuthorizationUnderLease(identity, config, input, lease, context, login);
		login?.assertCurrent();
		return result;
	}, login?.signal, context);
}
async function cancelMcpOAuthAuthorization(identity, state) {
	await withMcpOAuthLease(identity.storeKey, async (lease, context) => {
		const current = await readMcpOAuthStore(identity.storeKey, context);
		await lease.assertOwned();
		if (readMcpOAuthAuthorizationState(current.lastAuthorizationUrl) !== state) return;
		const options = {
			storeKey: identity.storeKey,
			lease,
			context
		};
		await mutateMcpOAuthStore(options, { kind: "completeAuthorization" });
		await deleteMcpOAuthPendingAuthorization(options);
	});
}
//#endregion
export { completeMcpOAuthAuthorization as a, readMcpOAuthCredentialsStatus as c, resolveMcpOAuthAccessToken as d, startMcpOAuthAuthorization as f, readMcpOAuthStoreReadOnly as h, clearMcpOAuthServer as i, readMcpOAuthCredentialsStatuses as l, readMcpOAuthStore as m, clearMcpOAuthCredentials as n, completeOAuthCallback as o, readMcpOAuthPendingAuthorization as p, clearMcpOAuthRequesters as r, countMcpOAuthPrincipals as s, cancelMcpOAuthAuthorization as t, recordMcpOAuthAuthorizationRequired as u };
