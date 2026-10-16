import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-DQmvZkAl.mjs";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-CzrjMN2p.mjs";
import { i as requesterMcpOAuthStoreKeyPrefix } from "./mcp-oauth-identity-BAZLWoC_.mjs";
import { i as renderOAuthPage } from "./oauth-page-CdAMKCs_.mjs";
import { t as OAUTH_PAGE_CSP } from "./oauth-page-csp-MU9ZpjXc.mjs";
import { m as readMcpOAuthStore, o as completeOAuthCallback, p as readMcpOAuthPendingAuthorization } from "./mcp-oauth-BK2ZqNG7.mjs";
//#region src/gateway/mcp-oauth-callback.ts
const MCP_OAUTH_CALLBACK_PATH = "/oauth/mcp/callback";
const MCP_OAUTH_CALLBACK_MAX_URL_BYTES = 8192;
const CONNECTED_HTML = renderOAuthPage({
	title: "Account connected",
	heading: "You're connected.",
	message: "Return to the chat."
});
const RETRY_HTML = renderOAuthPage({
	title: "Sign-in incomplete",
	heading: "Sign-in wasn't completed.",
	message: "Ask the bot to connect again."
});
const EXPIRED_HTML = renderOAuthPage({
	title: "Sign-in link expired",
	heading: "This sign-in link expired or was already used.",
	message: "Ask the bot to connect again."
});
function respondHtml(res, status, body) {
	res.statusCode = status;
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Content-Security-Policy", OAUTH_PAGE_CSP);
	res.end(body);
}
function isPerRequesterServer(server) {
	const oauth = isRecord(server.oauth) ? server.oauth : void 0;
	return server.enabled !== false && server.auth === "oauth" && oauth?.identity === "per-requester";
}
/** Completes one requester MCP OAuth redirect using durable state correlation. */
async function handleMcpOAuthCallback(req, res, params) {
	if (req.method !== "GET") return false;
	const rawUrl = req.url ?? "/";
	const url = new URL(rawUrl, "http://localhost");
	if (url.pathname !== MCP_OAUTH_CALLBACK_PATH) return false;
	const configuredServers = Object.entries(normalizeConfiguredMcpServers(params.config.mcp?.servers)).toSorted(([left], [right]) => left.localeCompare(right)).flatMap(([serverName, rawServer]) => {
		if (!isPerRequesterServer(rawServer)) return [];
		const resolved = resolveMcpTransportConfig(serverName, rawServer, { logWarnings: false });
		return resolved?.kind === "http" && resolved.auth === "oauth" ? [{
			serverName,
			resolved
		}] : [];
	});
	if (configuredServers.length === 0) return false;
	if (Buffer.byteLength(rawUrl, "utf8") > MCP_OAUTH_CALLBACK_MAX_URL_BYTES) {
		respondHtml(res, 400, RETRY_HTML);
		return true;
	}
	const state = url.searchParams.get("state")?.trim();
	const context = captureOpenClawStateWorkerContext();
	const storeKey = state ? await readMcpOAuthPendingAuthorization(state, context) : void 0;
	const pending = storeKey ? await readMcpOAuthStore(storeKey, context) : void 0;
	if (!storeKey || !state || (URL.parse(pending?.lastAuthorizationUrl ?? "")?.searchParams.get("state")?.trim() || void 0) !== state) {
		respondHtml(res, 404, EXPIRED_HTML);
		return true;
	}
	const configuredServer = configuredServers.find(({ serverName, resolved }) => storeKey.startsWith(requesterMcpOAuthStoreKeyPrefix(serverName, resolved.url)));
	if (!configuredServer) {
		respondHtml(res, 404, EXPIRED_HTML);
		return true;
	}
	if (url.searchParams.has("error")) {
		respondHtml(res, 400, RETRY_HTML);
		return true;
	}
	const code = url.searchParams.get("code")?.trim();
	if (!code) {
		respondHtml(res, 400, RETRY_HTML);
		return true;
	}
	try {
		if (await completeOAuthCallback({
			storeKey,
			principal: "requester",
			serverName: configuredServer.serverName,
			serverUrl: configuredServer.resolved.url
		}, configuredServer.resolved, {
			code,
			state
		}, void 0, context) === "expired") {
			respondHtml(res, 404, EXPIRED_HTML);
			return true;
		}
		respondHtml(res, 200, CONNECTED_HTML);
	} catch (error) {
		params.log.warn(`MCP OAuth callback failed for server "${configuredServer.serverName}": ${formatErrorMessage(error)}`);
		respondHtml(res, 400, RETRY_HTML);
	}
	return true;
}
//#endregion
export { handleMcpOAuthCallback };
