import { a as sanitizeServerName } from "./agent-bundle-mcp-names-38ksiKnf.mjs";
import { createHash } from "node:crypto";
//#region src/agents/mcp-oauth-identity.ts
function operatorMcpOAuthIdentity(serverName, serverUrl) {
	return {
		storeKey: `${sanitizeServerName(serverName, /* @__PURE__ */ new Set())}-${createHash("sha256").update(serverName).update("\0").update(serverUrl).digest("hex").slice(0, 16)}`,
		principal: "operator",
		serverName,
		serverUrl
	};
}
function requesterMcpOAuthIdentity(serverName, serverUrl, scope) {
	const operator = operatorMcpOAuthIdentity(serverName, serverUrl);
	const requesterHash = createHash("sha256").update(scope.messageChannel ?? "").update("\0").update(scope.agentAccountId ?? "").update("\0").update(scope.requesterSenderId).digest("hex");
	return {
		...operator,
		storeKey: `${operator.storeKey}-r-${requesterHash.slice(0, 16)}`,
		principal: "requester"
	};
}
function requesterMcpOAuthStoreKeyPrefix(serverName, serverUrl) {
	return `${operatorMcpOAuthIdentity(serverName, serverUrl).storeKey}-r-`;
}
function mcpOAuthStoreKeyFromLegacyFileName(fileName) {
	return /^[A-Za-z][A-Za-z0-9_-]{0,29}-[0-9a-f]{16}\.json$/u.test(fileName) ? fileName.slice(0, -5) : null;
}
//#endregion
export { requesterMcpOAuthStoreKeyPrefix as i, operatorMcpOAuthIdentity as n, requesterMcpOAuthIdentity as r, mcpOAuthStoreKeyFromLegacyFileName as t };
