const require_rolldown_runtime = require("./rolldown-runtime-CiKaZLfC.cjs");
const require_runtime = require("./runtime-CbKazLGv.cjs");
let openclaw_plugin_sdk_account_id = require("openclaw/plugin-sdk/account-id");
let node_crypto = require("node:crypto");
let node_util = require("node:util");
let node_path = require("node:path");
node_path = require_rolldown_runtime.__toESM(node_path, 1);
let openclaw_plugin_sdk_keyed_async_queue = require("openclaw/plugin-sdk/keyed-async-queue");
let openclaw_plugin_sdk_node_crypto_runtime = require("openclaw/plugin-sdk/node-crypto-runtime");
// extensions/msteams/src/sqlite-state.ts
function resolveMSTeamsAccountStateNamespace(namespace, accountId) {
	const normalizedAccountId = (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(accountId);
	if (normalizedAccountId === openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID) return namespace;
	return `${namespace}-${(0, openclaw_plugin_sdk_node_crypto_runtime.sha256Hex)(normalizedAccountId)}`;
}
function toPluginJsonValue(value) {
	const serialized = JSON.stringify(value);
	return JSON.parse(serialized);
}
const sqliteMutationLocks = new openclaw_plugin_sdk_keyed_async_queue.KeyedAsyncQueue();
async function withMSTeamsSqliteMutationLock(mutationKey, fn) {
	const scopedMutationKey = node_path.default.join(require_runtime.getMSTeamsRuntime().state.resolveStateDir(), mutationKey);
	return await sqliteMutationLocks.enqueue(scopedMutationKey, fn);
}
// extensions/msteams/src/delegated-state.ts
const MSTEAMS_DELEGATED_TOKEN_LEGACY_FILENAME = "msteams-delegated.json";
const MSTEAMS_DELEGATED_TOKEN_NAMESPACE = "delegated-token";
const MSTEAMS_DELEGATED_TOKEN_KEY = "current";
function openDelegatedTokenStore(accountId) {
	const runtime = require_runtime.getMSTeamsRuntime();
	return runtime.state.openKeyedStoreV2({
		namespace: resolveMSTeamsAccountStateNamespace(MSTEAMS_DELEGATED_TOKEN_NAMESPACE, accountId),
		maxEntries: 1,
		overflowPolicy: "reject-new"
	}, { assertCurrent() {
		if (require_runtime.getMSTeamsRuntime() !== runtime) throw new Error("Microsoft Teams token owner changed");
	} });
}
function normalizeMSTeamsDelegatedTokens(value) {
	if (!value || typeof value !== "object") return null;
	const candidate = value;
	const token = candidate.refreshClaim ? candidate.credential : candidate;
	if (!token) return null;
	if (typeof token.accessToken !== "string" || !token.accessToken || typeof token.refreshToken !== "string" || !token.refreshToken || typeof token.expiresAt !== "number" || !Number.isFinite(token.expiresAt) || !Array.isArray(token.scopes) || !token.scopes.every((scope) => typeof scope === "string" && scope.length > 0)) return null;
	return {
		accessToken: token.accessToken,
		refreshToken: token.refreshToken,
		expiresAt: token.expiresAt,
		scopes: token.scopes,
		...typeof token.userPrincipalName === "string" ? { userPrincipalName: token.userPrincipalName } : {}
	};
}
async function loadMSTeamsDelegatedTokenState(accountId) {
	return await openDelegatedTokenStore(accountId).lookup(MSTEAMS_DELEGATED_TOKEN_KEY);
}
async function claimMSTeamsDelegatedTokenRefresh(tokens, requestKey, callerKey, accountId) {
	const store = openDelegatedTokenStore(accountId);
	const observed = await store.observe(MSTEAMS_DELEGATED_TOKEN_KEY);
	if (!(0, node_util.isDeepStrictEqual)(normalizeMSTeamsDelegatedTokens(observed.value), tokens)) return;
	const claim = {
		refreshClaim: (0, node_crypto.randomUUID)(),
		requestKey,
		callerKey,
		credential: tokens
	};
	if ((await store.compareAndApply("current", observed.comparison, {
		operation: "update",
		action: "set",
		value: claim
	})).status !== "applied") return;
	return {
		async reject() {
			const current = await store.observe(MSTEAMS_DELEGATED_TOKEN_KEY);
			if ((0, node_util.isDeepStrictEqual)(current.value, claim)) await store.compareAndApply(MSTEAMS_DELEGATED_TOKEN_KEY, current.comparison, {
				operation: "update",
				action: "set",
				value: {
					refreshClaim: claim.refreshClaim,
					requestKey,
					callerKey
				}
			});
		},
		async settle(replacement) {
			const current = await store.observe(MSTEAMS_DELEGATED_TOKEN_KEY);
			if (!(0, node_util.isDeepStrictEqual)(current.value, claim)) return false;
			const normalized = normalizeMSTeamsDelegatedTokens(replacement);
			if (!normalized) throw new Error("Invalid Microsoft Teams delegated token payload");
			return (await store.compareAndApply(MSTEAMS_DELEGATED_TOKEN_KEY, current.comparison, {
				operation: "update",
				action: "set",
				value: normalized
			})).status === "applied";
		}
	};
}
async function loadMSTeamsDelegatedTokens(accountId) {
	return normalizeMSTeamsDelegatedTokens(await openDelegatedTokenStore(accountId).lookup("current")) ?? void 0;
}
async function saveMSTeamsDelegatedTokens(tokens, accountId) {
	const normalized = normalizeMSTeamsDelegatedTokens(tokens);
	if (!normalized) throw new Error("Invalid Microsoft Teams delegated token payload");
	await openDelegatedTokenStore(accountId).register(MSTEAMS_DELEGATED_TOKEN_KEY, normalized);
}
Object.defineProperty(exports, "MSTEAMS_DELEGATED_TOKEN_KEY", {
	enumerable: true,
	get: function() {
		return MSTEAMS_DELEGATED_TOKEN_KEY;
	}
});
Object.defineProperty(exports, "MSTEAMS_DELEGATED_TOKEN_LEGACY_FILENAME", {
	enumerable: true,
	get: function() {
		return MSTEAMS_DELEGATED_TOKEN_LEGACY_FILENAME;
	}
});
Object.defineProperty(exports, "MSTEAMS_DELEGATED_TOKEN_NAMESPACE", {
	enumerable: true,
	get: function() {
		return MSTEAMS_DELEGATED_TOKEN_NAMESPACE;
	}
});
Object.defineProperty(exports, "claimMSTeamsDelegatedTokenRefresh", {
	enumerable: true,
	get: function() {
		return claimMSTeamsDelegatedTokenRefresh;
	}
});
Object.defineProperty(exports, "loadMSTeamsDelegatedTokenState", {
	enumerable: true,
	get: function() {
		return loadMSTeamsDelegatedTokenState;
	}
});
Object.defineProperty(exports, "loadMSTeamsDelegatedTokens", {
	enumerable: true,
	get: function() {
		return loadMSTeamsDelegatedTokens;
	}
});
Object.defineProperty(exports, "normalizeMSTeamsDelegatedTokens", {
	enumerable: true,
	get: function() {
		return normalizeMSTeamsDelegatedTokens;
	}
});
Object.defineProperty(exports, "resolveMSTeamsAccountStateNamespace", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsAccountStateNamespace;
	}
});
Object.defineProperty(exports, "saveMSTeamsDelegatedTokens", {
	enumerable: true,
	get: function() {
		return saveMSTeamsDelegatedTokens;
	}
});
Object.defineProperty(exports, "toPluginJsonValue", {
	enumerable: true,
	get: function() {
		return toPluginJsonValue;
	}
});
Object.defineProperty(exports, "withMSTeamsSqliteMutationLock", {
	enumerable: true,
	get: function() {
		return withMSTeamsSqliteMutationLock;
	}
});
