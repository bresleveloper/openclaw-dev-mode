import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { s as McpOAuthStoreCorruptionError } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import "node:util";
import { OAuthClientInformationSchema, OAuthMetadataSchema, OAuthProtectedResourceMetadataSchema, OAuthTokensSchema, OpenIdProviderDiscoveryMetadataSchema } from "@modelcontextprotocol/sdk/shared/auth.js";
//#region src/agents/mcp-oauth-store.kernel.ts
const MCP_OAUTH_STORE_FORMAT_VERSION = 1;
const UNINITIALIZED_STORE_FIELDS = /* @__PURE__ */ new Set(["credentialState", "pendingAuthorizationChallenge"]);
function assertOptionalString(storeKey, store, field) {
	const value = store[field];
	if (value !== void 0 && (typeof value !== "string" || value.length === 0)) throw new McpOAuthStoreCorruptionError(storeKey, `${field} must be a non-empty string`);
}
function assertDiscoveryState(storeKey, value) {
	if (value === void 0) return;
	if (!isRecord(value) || typeof value.authorizationServerUrl !== "string") throw new McpOAuthStoreCorruptionError(storeKey, "discoveryState is invalid");
	if (!URL.canParse(value.authorizationServerUrl)) throw new McpOAuthStoreCorruptionError(storeKey, "discoveryState URLs are invalid");
	if (value.resourceMetadataUrl !== void 0 && (typeof value.resourceMetadataUrl !== "string" || !URL.canParse(value.resourceMetadataUrl))) throw new McpOAuthStoreCorruptionError(storeKey, "discoveryState URLs are invalid");
	if (value.resourceMetadata !== void 0 && !OAuthProtectedResourceMetadataSchema.safeParse(value.resourceMetadata).success) throw new McpOAuthStoreCorruptionError(storeKey, "discoveryState resource metadata is invalid");
	if (value.authorizationServerMetadata !== void 0 && !OAuthMetadataSchema.safeParse(value.authorizationServerMetadata).success && !OpenIdProviderDiscoveryMetadataSchema.safeParse(value.authorizationServerMetadata).success) throw new McpOAuthStoreCorruptionError(storeKey, "discoveryState authorization server metadata is invalid");
}
function assertAuthorizationChallenge(storeKey, value) {
	if (value === void 0) return;
	if (!isRecord(value)) throw new McpOAuthStoreCorruptionError(storeKey, "pendingAuthorizationChallenge is invalid");
	const resourceMetadataUrl = value.resourceMetadataUrl;
	if (resourceMetadataUrl !== void 0 && (typeof resourceMetadataUrl !== "string" || !URL.canParse(resourceMetadataUrl))) throw new McpOAuthStoreCorruptionError(storeKey, "pendingAuthorizationChallenge URL is invalid");
	const scope = value.scope;
	if (scope !== void 0 && (typeof scope !== "string" || scope.length === 0)) throw new McpOAuthStoreCorruptionError(storeKey, "pendingAuthorizationChallenge scope is invalid");
	if (value.requiresAuthorization !== void 0 && value.requiresAuthorization !== true) throw new McpOAuthStoreCorruptionError(storeKey, "pendingAuthorizationChallenge requiresAuthorization must be true");
}
/** Parse a canonical row without discarding SDK extension fields. */
function parseMcpOAuthStoreJson(storeKey, raw) {
	let value;
	try {
		value = JSON.parse(raw);
	} catch (error) {
		throw new McpOAuthStoreCorruptionError(storeKey, "store_json is not valid JSON", { cause: error });
	}
	if (!isRecord(value)) throw new McpOAuthStoreCorruptionError(storeKey, "store_json must contain an object");
	if (value.clientInformation !== void 0 && !OAuthClientInformationSchema.safeParse(value.clientInformation).success) throw new McpOAuthStoreCorruptionError(storeKey, "clientInformation is invalid");
	if (value.tokens !== void 0 && !OAuthTokensSchema.safeParse(value.tokens).success) throw new McpOAuthStoreCorruptionError(storeKey, "tokens are invalid");
	if (value.credentialState !== void 0 && value.credentialState !== "uninitialized" && value.credentialState !== "cleared") throw new McpOAuthStoreCorruptionError(storeKey, "credentialState is invalid");
	if (value.credentialState !== void 0 && value.tokens !== void 0) throw new McpOAuthStoreCorruptionError(storeKey, "credentialState cannot coexist with tokens");
	if (value.credentialState === "uninitialized" && Object.keys(value).some((field) => !UNINITIALIZED_STORE_FIELDS.has(field))) throw new McpOAuthStoreCorruptionError(storeKey, "uninitialized credential state contains authoritative OAuth fields");
	if (value.tokenExpiresAt !== void 0 && (typeof value.tokenExpiresAt !== "number" || !Number.isFinite(value.tokenExpiresAt) || value.tokenExpiresAt < 0)) throw new McpOAuthStoreCorruptionError(storeKey, "tokenExpiresAt is invalid");
	if (value.tokenExpiresAt !== void 0 && value.tokens === void 0) throw new McpOAuthStoreCorruptionError(storeKey, "tokenExpiresAt requires tokens");
	if (value.tokensAuthorizationServerUrl !== void 0 && (typeof value.tokensAuthorizationServerUrl !== "string" || !URL.canParse(value.tokensAuthorizationServerUrl))) throw new McpOAuthStoreCorruptionError(storeKey, "tokensAuthorizationServerUrl is invalid");
	if (value.tokensAuthorizationServerUrl !== void 0 && value.tokens === void 0) throw new McpOAuthStoreCorruptionError(storeKey, "tokensAuthorizationServerUrl requires tokens");
	assertOptionalString(storeKey, value, "codeVerifier");
	assertOptionalString(storeKey, value, "lastAuthorizationUrl");
	assertOptionalString(storeKey, value, "redirectUrl");
	assertDiscoveryState(storeKey, value.discoveryState);
	assertAuthorizationChallenge(storeKey, value.pendingAuthorizationChallenge);
	return value;
}
function storeFromRow(storeKey, row) {
	if (!row) return {};
	if (row.format_version !== MCP_OAUTH_STORE_FORMAT_VERSION) throw new McpOAuthStoreCorruptionError(storeKey, `unsupported format version ${row.format_version}`);
	return parseMcpOAuthStoreJson(storeKey, row.store_json);
}
function readMcpOAuthStoreInDatabase(database, storeKey) {
	return storeFromRow(storeKey, executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("mcp_oauth_stores").select(["format_version", "store_json"]).where("store_key", "=", storeKey)));
}
const MCP_OAUTH_PENDING_STATE_TTL_MS = 6e5;
function replaceMcpOAuthStoreInDatabase(database, storeKey, next, assertOwnedInTransaction) {
	const storeJson = JSON.stringify(next);
	parseMcpOAuthStoreJson(storeKey, storeJson);
	assertOwnedInTransaction?.(database);
	const updatedAt = Date.now();
	executeSqliteQuerySync(database, getNodeSqliteKysely(database).insertInto("mcp_oauth_stores").values({
		store_key: storeKey,
		format_version: MCP_OAUTH_STORE_FORMAT_VERSION,
		store_json: storeJson,
		updated_at: updatedAt
	}).onConflict((conflict) => conflict.column("store_key").doUpdateSet({
		format_version: MCP_OAUTH_STORE_FORMAT_VERSION,
		store_json: storeJson,
		updated_at: updatedAt
	})));
	return next;
}
//#endregion
export { replaceMcpOAuthStoreInDatabase as i, parseMcpOAuthStoreJson as n, readMcpOAuthStoreInDatabase as r, MCP_OAUTH_PENDING_STATE_TTL_MS as t };
