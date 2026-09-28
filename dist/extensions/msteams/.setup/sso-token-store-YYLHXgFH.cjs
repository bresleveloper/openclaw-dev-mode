const require_runtime = require("./runtime-gZTAuFux.cjs");
const require_polls = require("./polls-BJ4-4uZm.cjs");
let node_crypto = require("node:crypto");
//#region extensions/msteams/src/sso-token-store.ts
/**
* SQLite-backed store for Bot Framework OAuth SSO tokens.
*
* Tokens are keyed by (connectionName, userId). `userId` should be the
* stable AAD object ID (`activity.from.aadObjectId`) when available,
* falling back to the Bot Framework `activity.from.id`.
*
* The store is intentionally minimal: it persists the exchanged user
* token plus its expiration so consumers (for example tool handlers
* that call Microsoft Graph with delegated permissions) can fetch a
* valid token without reaching back into Bot Framework every turn.
*/
const MSTEAMS_SSO_TOKENS_LEGACY_FILENAME = "msteams-sso-tokens.json";
const MSTEAMS_SSO_TOKENS_NAMESPACE = "sso-tokens";
const SSO_TOKEN_MUTATION_KEY = "sso-tokens";
const MSTEAMS_MAX_SSO_TOKENS = 5e3;
const STORE_KEY_VERSION_PREFIX = "v2:";
function makeMSTeamsSsoTokenStoreKey(connectionName, userId) {
	return `${STORE_KEY_VERSION_PREFIX}${(0, node_crypto.createHash)("sha256").update(JSON.stringify([connectionName, userId])).digest("hex")}`;
}
function createTokenStore(params) {
	return require_runtime.getMSTeamsRuntime().state.openKeyedStore({
		namespace: MSTEAMS_SSO_TOKENS_NAMESPACE,
		maxEntries: MSTEAMS_MAX_SSO_TOKENS,
		env: require_polls.resolveMSTeamsSqliteStateEnv(params)
	});
}
function normalizeMSTeamsSsoStoredToken(value) {
	if (!value || typeof value !== "object") return null;
	const token = value;
	if (typeof token.connectionName !== "string" || !token.connectionName || typeof token.userId !== "string" || !token.userId || typeof token.token !== "string" || !token.token || typeof token.updatedAt !== "string" || !token.updatedAt) return null;
	return {
		connectionName: token.connectionName,
		userId: token.userId,
		token: token.token,
		...typeof token.expiresAt === "string" ? { expiresAt: token.expiresAt } : {},
		updatedAt: token.updatedAt
	};
}
function isMSTeamsSsoStoreData(value) {
	if (!value || typeof value !== "object") return false;
	const obj = value;
	return obj.version === 1 && typeof obj.tokens === "object" && obj.tokens !== null;
}
function createMSTeamsSsoTokenStoreFs(params) {
	const tokenStore = createTokenStore(params);
	return {
		async get({ connectionName, userId }) {
			return await tokenStore.lookup(makeMSTeamsSsoTokenStoreKey(connectionName, userId)) ?? null;
		},
		async save(token) {
			await require_polls.withMSTeamsSqliteMutationLock(params, SSO_TOKEN_MUTATION_KEY, async () => {
				await tokenStore.register(makeMSTeamsSsoTokenStoreKey(token.connectionName, token.userId), require_polls.toPluginJsonValue({ ...token }));
			});
		},
		async remove({ connectionName, userId }) {
			let removed = false;
			await require_polls.withMSTeamsSqliteMutationLock(params, SSO_TOKEN_MUTATION_KEY, async () => {
				removed = await tokenStore.delete(makeMSTeamsSsoTokenStoreKey(connectionName, userId));
			});
			return removed;
		}
	};
}
//#endregion
Object.defineProperty(exports, "MSTEAMS_MAX_SSO_TOKENS", {
	enumerable: true,
	get: function() {
		return MSTEAMS_MAX_SSO_TOKENS;
	}
});
Object.defineProperty(exports, "MSTEAMS_SSO_TOKENS_LEGACY_FILENAME", {
	enumerable: true,
	get: function() {
		return MSTEAMS_SSO_TOKENS_LEGACY_FILENAME;
	}
});
Object.defineProperty(exports, "MSTEAMS_SSO_TOKENS_NAMESPACE", {
	enumerable: true,
	get: function() {
		return MSTEAMS_SSO_TOKENS_NAMESPACE;
	}
});
Object.defineProperty(exports, "createMSTeamsSsoTokenStoreFs", {
	enumerable: true,
	get: function() {
		return createMSTeamsSsoTokenStoreFs;
	}
});
Object.defineProperty(exports, "isMSTeamsSsoStoreData", {
	enumerable: true,
	get: function() {
		return isMSTeamsSsoStoreData;
	}
});
Object.defineProperty(exports, "makeMSTeamsSsoTokenStoreKey", {
	enumerable: true,
	get: function() {
		return makeMSTeamsSsoTokenStoreKey;
	}
});
Object.defineProperty(exports, "normalizeMSTeamsSsoStoredToken", {
	enumerable: true,
	get: function() {
		return normalizeMSTeamsSsoStoredToken;
	}
});
