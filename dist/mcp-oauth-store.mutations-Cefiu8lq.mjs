import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region src/agents/mcp-oauth-store.mutations.ts
const MCP_OAUTH_DEFAULT_REDIRECT_URL = "http://127.0.0.1:8989/oauth/callback";
function beginMcpOAuthAuthorization(store) {
	const next = { ...store };
	if (next.credentialState === "uninitialized") delete next.credentialState;
	return next;
}
function bindMcpOAuthTokensIssuer(store) {
	const issuedBy = store.discoveryState?.authorizationServerUrl;
	if (!store.tokens?.refresh_token || store.tokensAuthorizationServerUrl !== void 0 || issuedBy === void 0) return store;
	return {
		...store,
		tokensAuthorizationServerUrl: issuedBy
	};
}
function applyMcpOAuthAuthorizationChallenge(current, params) {
	const next = {
		...current,
		pendingAuthorizationChallenge: {
			...current.pendingAuthorizationChallenge,
			...params.resourceMetadataUrl ? { resourceMetadataUrl: params.resourceMetadataUrl } : {},
			...params.scope ? { scope: params.scope } : {},
			...params.requiresAuthorization ? { requiresAuthorization: true } : {}
		}
	};
	if (current.credentialState === void 0 && current.tokens === void 0 && current.clientInformation === void 0 && current.codeVerifier === void 0 && current.discoveryState === void 0 && current.lastAuthorizationUrl === void 0 && current.redirectUrl === void 0) next.credentialState = "uninitialized";
	if (params.resourceMetadataUrl && current.discoveryState?.resourceMetadataUrl !== params.resourceMetadataUrl) {
		const bound = bindMcpOAuthTokensIssuer(next);
		delete bound.discoveryState;
		return bound;
	}
	return next;
}
/** Apply an SDK or flow operation to the authoritative transaction snapshot. */
function applyMcpOAuthMutation(store, mutation) {
	switch (mutation.kind) {
		case "clientInformation": return {
			store: {
				...beginMcpOAuthAuthorization(store),
				clientInformation: mutation.clientInformation
			},
			applied: true
		};
		case "discoveryState": return {
			store: {
				...beginMcpOAuthAuthorization(store),
				discoveryState: mutation.discoveryState
			},
			applied: true
		};
		case "authorizationRedirect": return {
			store: {
				...beginMcpOAuthAuthorization(store),
				...mutation.codeVerifier ? { codeVerifier: mutation.codeVerifier } : {},
				lastAuthorizationUrl: mutation.authorizationUrl,
				redirectUrl: mutation.redirectUrl ?? normalizeOptionalString(store.redirectUrl) ?? "http://127.0.0.1:8989/oauth/callback"
			},
			applied: true
		};
		case "bindTokensIssuer": return {
			store: bindMcpOAuthTokensIssuer(store),
			applied: true
		};
		case "authorizationChallenge": return mutation.rejectedAccessToken !== void 0 && store.tokens?.access_token !== mutation.rejectedAccessToken ? {
			store,
			applied: false
		} : {
			store: applyMcpOAuthAuthorizationChallenge(store, mutation),
			applied: true
		};
		case "completeAuthorization": {
			const next = { ...store };
			delete next.codeVerifier;
			delete next.lastAuthorizationUrl;
			delete next.redirectUrl;
			return {
				store: next,
				applied: true
			};
		}
		case "tokens": {
			const tokens = mutation.tokens;
			const next = {
				...store,
				tokens
			};
			delete next.credentialState;
			delete next.pendingAuthorizationChallenge;
			const issuedBy = store.discoveryState?.authorizationServerUrl;
			if (issuedBy === void 0) delete next.tokensAuthorizationServerUrl;
			else next.tokensAuthorizationServerUrl = issuedBy;
			const tokenExpiresAt = mutation.tokenExpiresAt;
			if (tokenExpiresAt === void 0) delete next.tokenExpiresAt;
			else next.tokenExpiresAt = tokenExpiresAt;
			return {
				store: next,
				applied: true
			};
		}
		case "invalidate": {
			const { scope, suppressStoredTokens } = mutation;
			const next = { ...store };
			if (scope === "all" || scope === "client") delete next.clientInformation;
			if ((scope === "all" || scope === "tokens") && !suppressStoredTokens) {
				delete next.tokens;
				delete next.tokenExpiresAt;
				delete next.tokensAuthorizationServerUrl;
				next.credentialState = "cleared";
			}
			if (scope === "all" || scope === "verifier") delete next.codeVerifier;
			if (scope === "all" || scope === "discovery") delete next.discoveryState;
			return {
				store: next,
				applied: true
			};
		}
	}
	throw new Error("Unknown MCP OAuth mutation");
}
//#endregion
export { applyMcpOAuthMutation as n, MCP_OAUTH_DEFAULT_REDIRECT_URL as t };
