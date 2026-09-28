import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-ByV7kR1W.mjs";
import { Type } from "typebox";
//#region src/agents/agent-bundle-mcp-requester-connect.ts
async function connectRequesterOAuthServer(params) {
	if (!params.publicOrigin) {
		const message = `MCP server "${params.serverName}" needs requester sign-in, but gateway.publicOrigin is not configured. Ask the operator to set the public Gateway HTTP(S) origin.`;
		return {
			content: [{
				type: "text",
				text: message
			}],
			details: {
				status: "error",
				error: message,
				mcpServer: params.serverName
			}
		};
	}
	const result = await params.authorize(new URL("/oauth/mcp/callback", params.publicOrigin).href);
	if (result.status === "authorized") return {
		content: [{
			type: "text",
			text: `MCP server "${params.serverName}" is connected. Its tools become available on the next message.`
		}],
		details: { mcpServer: params.serverName }
	};
	return {
		content: [{
			type: "text",
			text: `Connect MCP server "${params.serverName}" at ${result.authorizationUrl}\nAfter sign-in completes, the server's tools become available on the next message.`
		}],
		details: { mcpConnect: {
			serverName: params.serverName,
			authorizationUrl: result.authorizationUrl
		} }
	};
}
function buildRequesterConnectCatalog(serverNames, safeServerNamesByServer) {
	const entries = [...serverNames];
	return {
		version: 1,
		generatedAt: Date.now(),
		servers: Object.fromEntries(entries.map((serverName) => [serverName, {
			serverName,
			safeServerName: safeServerNamesByServer.get(serverName),
			launchSummary: "Requester OAuth",
			toolCount: 1
		}])),
		tools: entries.map((serverName) => ({
			serverName,
			safeServerName: safeServerNamesByServer.get(serverName) ?? serverName,
			toolName: "connect",
			description: `Connect your ${serverName} account.`,
			fallbackDescription: `Connect your ${serverName} account.`,
			inputSchema: Type.Object({}),
			oauthConnectBootstrap: true
		}))
	};
}
/** Builds the per-message requester sign-in surface without opening MCP transports. */
async function createRequesterMcpConnect(params) {
	const configured = [...params.serverNames].toSorted((a, b) => a.localeCompare(b)).flatMap((serverName) => {
		const resolved = resolveMcpTransportConfig(serverName, params.mcpServers[serverName], { logWarnings: false });
		return resolved?.kind === "http" && resolved.auth === "oauth" && resolved.oauth?.identity === "per-requester" ? [{
			serverName,
			resolved
		}] : [];
	});
	if (configured.length === 0) return;
	const { requesterMcpOAuthIdentity } = await import("./mcp-oauth-identity-DB8Q-p21.mjs");
	const { readMcpOAuthCredentialsStatuses, startMcpOAuthAuthorization } = await import("./mcp-oauth-Dt9_5Q12.mjs");
	const statuses = await readMcpOAuthCredentialsStatuses(configured.map(({ serverName, resolved }) => requesterMcpOAuthIdentity(serverName, resolved.url, params.requesterScope)));
	const servers = /* @__PURE__ */ new Map();
	const authorizedServerNames = [];
	for (const [index, { serverName, resolved }] of configured.entries()) {
		const status = expectDefined(statuses[index], "requester MCP OAuth status");
		servers.set(serverName, () => connectRequesterOAuthServer({
			serverName,
			publicOrigin: params.cfg?.gateway?.publicOrigin,
			authorize: (redirectUrl) => startMcpOAuthAuthorization(requesterMcpOAuthIdentity(serverName, resolved.url, params.requesterScope), resolved, { redirectUrl })
		}));
		if (status.state === "authorized") authorizedServerNames.push(serverName);
	}
	const configFingerprint = JSON.stringify({
		config: params.configFingerprint,
		authorizedServerNames,
		publicOrigin: params.cfg?.gateway?.publicOrigin
	});
	return {
		catalog: buildRequesterConnectCatalog(servers.keys(), params.safeServerNamesByServer),
		authorizedServerNames,
		configFingerprint,
		createExecute: (serverName) => servers.get(serverName)
	};
}
/** Adds transient connect entries only for servers absent from the live catalog. */
function mergeMcpConnectCatalog(liveCatalog, requesterConnect) {
	const connectCatalog = requesterConnect?.catalog;
	if (!connectCatalog) return liveCatalog;
	const missingServerNames = new Set(Object.keys(connectCatalog.servers).filter((serverName) => !Object.hasOwn(liveCatalog.servers, serverName)));
	if (missingServerNames.size === 0) return liveCatalog;
	return {
		...liveCatalog,
		generatedAt: Math.max(liveCatalog.generatedAt, connectCatalog.generatedAt),
		servers: {
			...liveCatalog.servers,
			...Object.fromEntries(Object.entries(connectCatalog.servers).filter(([serverName]) => missingServerNames.has(serverName)))
		},
		tools: [...liveCatalog.tools, ...connectCatalog.tools.filter((tool) => missingServerNames.has(tool.serverName))].toSorted((left, right) => left.safeServerName.localeCompare(right.safeServerName) || left.toolName.localeCompare(right.toolName) || left.serverName.localeCompare(right.serverName))
	};
}
//#endregion
export { mergeMcpConnectCatalog as n, createRequesterMcpConnect as t };
