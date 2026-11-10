const require_rolldown_runtime = require("./rolldown-runtime-BloeesfJ.cjs");
const require_runtime = require("./runtime-gZTAuFux.cjs");
let openclaw_plugin_sdk_account_id = require("openclaw/plugin-sdk/account-id");
let node_crypto = require("node:crypto");
node_crypto = require_rolldown_runtime.__toESM(node_crypto, 1);
let node_path = require("node:path");
node_path = require_rolldown_runtime.__toESM(node_path, 1);
let openclaw_plugin_sdk_keyed_async_queue = require("openclaw/plugin-sdk/keyed-async-queue");
//#region extensions/msteams/src/sqlite-state.ts
function resolveMSTeamsAccountStateNamespace(namespace, accountId) {
	const normalizedAccountId = (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(accountId);
	if (normalizedAccountId === openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID) return namespace;
	return `${namespace}-${node_crypto.default.createHash("sha256").update(normalizedAccountId).digest("hex")}`;
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
//#endregion
//#region extensions/msteams/src/delegated-state.ts
const MSTEAMS_DELEGATED_TOKEN_LEGACY_FILENAME = "msteams-delegated.json";
const MSTEAMS_DELEGATED_TOKEN_NAMESPACE = "delegated-token";
const MSTEAMS_DELEGATED_TOKEN_KEY = "current";
function openDelegatedTokenStore(accountId) {
	return require_runtime.getMSTeamsRuntime().state.openKeyedStore({
		namespace: resolveMSTeamsAccountStateNamespace(MSTEAMS_DELEGATED_TOKEN_NAMESPACE, accountId),
		maxEntries: 1,
		overflowPolicy: "reject-new"
	});
}
function normalizeMSTeamsDelegatedTokens(value) {
	if (!value || typeof value !== "object") return null;
	const token = value;
	if (typeof token.accessToken !== "string" || !token.accessToken || typeof token.refreshToken !== "string" || !token.refreshToken || typeof token.expiresAt !== "number" || !Number.isFinite(token.expiresAt) || !Array.isArray(token.scopes) || !token.scopes.every((scope) => typeof scope === "string" && scope.length > 0)) return null;
	return {
		accessToken: token.accessToken,
		refreshToken: token.refreshToken,
		expiresAt: token.expiresAt,
		scopes: [...token.scopes],
		...typeof token.userPrincipalName === "string" ? { userPrincipalName: token.userPrincipalName } : {}
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
//#endregion
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
