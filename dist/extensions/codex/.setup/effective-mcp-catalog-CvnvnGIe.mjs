import { m as sessionBindingIdentity } from "./session-binding-record-BGoz8wOK.mjs";
import { _ as retainSharedCodexAppServerClientByInstanceId } from "./shared-client-DA4VR4Eb.mjs";
import "./session-binding-Cm0apEbd.mjs";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { assignMcpCatalogSafeServerNames } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/effective-mcp-catalog.ts
const MCP_STATUS_PAGE_SIZE = 100;
const MCP_STATUS_MAX_PAGES = 100;
function catalogTool(params) {
	const raw = asOptionalRecord(params.raw);
	const description = normalizeOptionalString(raw?.description);
	const title = normalizeOptionalString(raw?.title);
	return {
		serverName: params.serverName,
		safeServerName: params.safeServerName,
		toolName: params.toolName,
		...title ? { title } : {},
		...description ? { description } : {},
		inputSchema: asOptionalRecord(raw?.inputSchema) ?? { type: "object" },
		fallbackDescription: description ?? params.toolName,
		...params.deniedBySession ? { deniedBySession: true } : {}
	};
}
/** Converts Codex's thread-scoped status response into OpenClaw's MCP catalog shape. */
function buildCodexEffectiveMcpCatalog(statuses, toolOverrides) {
	const orderedStatuses = [...new Map(statuses.map((status) => [status.name, status])).values()].toSorted((left, right) => left.name.localeCompare(right.name));
	const safeNames = assignMcpCatalogSafeServerNames(orderedStatuses.map((status) => status.name));
	const serverEntries = [];
	const tools = [];
	const sessionDeniedTools = [];
	for (const status of orderedStatuses) {
		const safeServerName = safeNames.get(status.name) ?? status.name;
		const denialMap = toolOverrides?.mcpToolsDeny;
		const deniedNames = new Set(denialMap && Object.hasOwn(denialMap, status.name) ? denialMap[status.name] : []);
		const observedNames = /* @__PURE__ */ new Set();
		for (const [toolName, raw] of Object.entries(status.tools).toSorted(([left], [right]) => left.localeCompare(right))) {
			observedNames.add(toolName);
			const deniedBySession = deniedNames.has(toolName) ? true : void 0;
			const tool = catalogTool({
				serverName: status.name,
				safeServerName,
				toolName,
				raw,
				...deniedBySession ? { deniedBySession } : {}
			});
			if (deniedBySession) sessionDeniedTools.push(tool);
			else tools.push(tool);
		}
		for (const toolName of [...deniedNames].toSorted()) {
			if (observedNames.has(toolName)) continue;
			sessionDeniedTools.push(catalogTool({
				serverName: status.name,
				safeServerName,
				toolName,
				deniedBySession: true
			}));
		}
		serverEntries.push([status.name, {
			serverName: status.name,
			safeServerName,
			launchSummary: "Codex native MCP connection",
			toolCount: observedNames.size + [...deniedNames].filter((name) => !observedNames.has(name)).length
		}]);
	}
	return {
		version: 1,
		generatedAt: Date.now(),
		servers: Object.fromEntries(serverEntries),
		tools,
		...sessionDeniedTools.length > 0 ? { sessionDeniedTools } : {}
	};
}
async function listCodexMcpServerStatuses(client, threadId) {
	const statuses = [];
	const seenCursors = /* @__PURE__ */ new Set();
	let cursor;
	for (let page = 0; page < MCP_STATUS_MAX_PAGES; page += 1) {
		const response = await client.request("mcpServerStatus/list", {
			threadId,
			detail: "toolsAndAuthOnly",
			limit: MCP_STATUS_PAGE_SIZE,
			...cursor ? { cursor } : {}
		});
		statuses.push(...response.data);
		cursor = response.nextCursor;
		if (!cursor) return statuses;
		if (seenCursors.has(cursor)) throw new Error("Codex mcpServerStatus/list repeated its pagination cursor");
		seenCursors.add(cursor);
	}
	throw new Error("Codex mcpServerStatus/list exceeded the bounded page limit");
}
/** Loads the requested MCP inventory from the exact client/thread already selected for a run. */
async function loadCodexEffectiveMcpCatalogFromThread(params) {
	const allowedServerNames = new Set(params.mcpServerNames);
	return buildCodexEffectiveMcpCatalog((await listCodexMcpServerStatuses(params.client, params.threadId)).filter((status) => allowedServerNames.has(status.name)), params.toolOverrides);
}
/** Loads MCP inventory from the bound Codex client while retaining its lease through all pages. */
async function loadCodexEffectiveMcpCatalog(params, options) {
	const binding = options.bindingStore.read(sessionBindingIdentity({
		agentId: params.agentId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		config: params.config
	}));
	if (!binding?.clientId) return;
	const retained = retainSharedCodexAppServerClientByInstanceId(binding.clientId);
	if (!retained) return;
	try {
		return await loadCodexEffectiveMcpCatalogFromThread({
			client: retained.client,
			threadId: binding.threadId,
			mcpServerNames: params.mcpServerNames,
			toolOverrides: params.toolOverrides
		});
	} finally {
		retained.release();
	}
}
//#endregion
export { loadCodexEffectiveMcpCatalog };
