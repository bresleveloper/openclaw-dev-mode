const require_runtime = require("./runtime-gZTAuFux.cjs");
//#region extensions/msteams/src/delegated-state.ts
const MSTEAMS_DELEGATED_TOKEN_LEGACY_FILENAME = "msteams-delegated.json";
const MSTEAMS_DELEGATED_TOKEN_NAMESPACE = "delegated-token";
const MSTEAMS_DELEGATED_TOKEN_KEY = "current";
function openDelegatedTokenStore(env) {
	return require_runtime.getMSTeamsRuntime().state.openKeyedStore({
		namespace: MSTEAMS_DELEGATED_TOKEN_NAMESPACE,
		maxEntries: 1,
		overflowPolicy: "reject-new",
		...env ? { env } : {}
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
async function loadMSTeamsDelegatedTokens(env) {
	return normalizeMSTeamsDelegatedTokens(await openDelegatedTokenStore(env).lookup("current")) ?? void 0;
}
async function saveMSTeamsDelegatedTokens(tokens, env) {
	const normalized = normalizeMSTeamsDelegatedTokens(tokens);
	if (!normalized) throw new Error("Invalid Microsoft Teams delegated token payload");
	await openDelegatedTokenStore(env).register(MSTEAMS_DELEGATED_TOKEN_KEY, normalized);
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
Object.defineProperty(exports, "saveMSTeamsDelegatedTokens", {
	enumerable: true,
	get: function() {
		return saveMSTeamsDelegatedTokens;
	}
});
