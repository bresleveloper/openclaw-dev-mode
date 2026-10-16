//#region extensions/openai/token-sharing.ts
/** These markers describe the grant actually returned by OpenAI, not requested scopes. */
const TOKEN_SHARING_AUTH_FLOW = "chatgpt-token-sharing";
const IDENTITY_AUTH_FLOW = "chatgpt-identity";
const TOKEN_SHARING_RESOURCE = "https://api.openai.com/v1";
const TOKEN_SHARING_ISSUER = "https://auth.openai.com";
const TOKEN_SHARING_REDIRECT_URI = "http://localhost:8080/auth/callback";
const TOKEN_SHARING_SCOPE = "openid email profile resource.invoke chatgpt.tokens.use.direct offline_access";
const TOKEN_SHARING_LEGACY_SCOPE = "openid resource.invoke chatgpt.tokens.use.direct offline_access";
const TOKEN_SHARING_CLIENT_ID = "dynamic_agent_client";
function isSIWCAuthFlow(authFlow) {
	return authFlow === "chatgpt-token-sharing" || authFlow === "chatgpt-identity";
}
//#endregion
export { TOKEN_SHARING_LEGACY_SCOPE as a, TOKEN_SHARING_SCOPE as c, TOKEN_SHARING_ISSUER as i, isSIWCAuthFlow as l, TOKEN_SHARING_AUTH_FLOW as n, TOKEN_SHARING_REDIRECT_URI as o, TOKEN_SHARING_CLIENT_ID as r, TOKEN_SHARING_RESOURCE as s, IDENTITY_AUTH_FLOW as t };
