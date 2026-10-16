import { m as sessionBindingIdentity } from "./session-binding-record-BZB8RgcF.mjs";
import { S as retainSharedCodexAppServerClientByInstanceId } from "./auth-cache-key-SXYawyhG.mjs";
import { W as protectCodexAppServerLiveThread } from "./shared-client-r9NcV_GJ.mjs";
import "./session-binding-Ce7BqiPN.mjs";
import { n as projectCodexMcpToolMetadata, t as projectCodexMcpServerMetadata } from "./mcp-tool-metadata-j10HhfTC.mjs";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { assignMcpCatalogSafeServerNames } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/effective-mcp-catalog.ts
const MCP_STATUS_PAGE_SIZE = 100;
const MCP_STATUS_MAX_PAGES = 100;
function catalogTool(params) {
	const raw = asOptionalRecord(params.raw);
	const description = normalizeOptionalString(raw?.description);
	const { title, ...metadata } = projectCodexMcpToolMetadata(params.toolName, raw);
	const ui = asOptionalRecord(asOptionalRecord(raw?._meta)?.ui);
	return {
		serverName: params.serverName,
		safeServerName: params.safeServerName,
		toolName: params.toolName,
		...title ? { title } : {},
		...description ? { description } : {},
		inputSchema: asOptionalRecord(raw?.inputSchema) ?? { type: "object" },
		...metadata,
		...Array.isArray(ui?.visibility) ? { uiVisibility: ui.visibility.filter((value) => value === "app" || value === "model") } : {},
		...params.deniedBySession ? { deniedBySession: true } : {}
	};
}
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
			(deniedBySession ? sessionDeniedTools : tools).push(tool);
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
			...projectCodexMcpServerMetadata(status),
			safeServerName,
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
/** Loads MCP inventory from the bound Codex client while retaining its lease through all pages. */
async function loadCodexEffectiveMcpCatalog(params, options) {
	const binding = options.bindingStore.read(sessionBindingIdentity({
		agentId: params.agentId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		config: params.config
	}));
	if (!binding?.clientId) return;
	const retained = await retainSharedCodexAppServerClientByInstanceId(binding.clientId);
	if (!retained) return;
	try {
		const allowedServerNames = new Set(params.mcpServerNames);
		return buildCodexEffectiveMcpCatalog((await listCodexMcpServerStatuses(retained.client, binding.threadId)).filter((status) => allowedServerNames.has(status.name)), params.toolOverrides);
	} finally {
		await retained.release();
	}
}
/** Explicit App requests retain the thread owner, never start a second MCP client. */
async function acquireCodexMcpAppRuntime(params, options) {
	const identity = sessionBindingIdentity(params);
	let binding = options.bindingStore.read(identity);
	let retained = await retainSharedCodexAppServerClientByInstanceId(binding?.clientId);
	if (!retained && params.prepareSession) {
		const preparation = await params.prepareSession();
		params.assertCurrent();
		const { prepareCodexMcpAppSession } = await import("./mcp-app-session-preparation-D_kcYuIo.mjs");
		await prepareCodexMcpAppSession({
			preparation,
			bindingStore: options.bindingStore,
			pluginConfig: options.pluginConfig,
			assertCurrent: params.assertCurrent
		});
		params.assertCurrent();
		binding = options.bindingStore.read(identity);
		retained = await retainSharedCodexAppServerClientByInstanceId(binding?.clientId);
	}
	if (!binding?.clientId || !retained) return;
	const acquired = retained;
	const admittedBinding = binding;
	try {
		const assertBinding = () => {
			const latest = options.bindingStore.read(identity);
			if (!latest || latest.clientId !== admittedBinding.clientId || latest.threadId !== admittedBinding.threadId) throw new Error("Native MCP session binding changed");
		};
		params.assertCurrent();
		assertBinding();
		const { createNativeMcpRuntime } = await import("./native-mcp-app-BzA5ugfE.mjs").then((n) => n.n);
		params.assertCurrent();
		const runtime = createNativeMcpRuntime({
			client: retained.client,
			threadId: binding.threadId,
			attempt: params,
			appRequester: params.appRequester,
			originCallId: "",
			assertCurrent: assertBinding
		});
		const allowed = new Set(params.mcpServerNames.filter((name) => name !== "codex_apps"));
		const getCatalog = runtime.getCatalog;
		let catalog = null;
		runtime.getCatalog = async () => {
			const loaded = await getCatalog();
			for (const server of Object.values(loaded.servers)) if (server.serverName !== "codex_apps" && server.pluginId) allowed.add(server.serverName);
			catalog = {
				...loaded,
				servers: Object.fromEntries(Object.entries(loaded.servers).filter(([name]) => allowed.has(name))),
				tools: loaded.tools.filter((tool) => allowed.has(tool.serverName) && !params.toolOverrides?.mcpToolsDeny?.[tool.serverName]?.includes(tool.toolName))
			};
			return catalog;
		};
		runtime.peekCatalog = () => catalog;
		const unprotect = protectCodexAppServerLiveThread(acquired.client, admittedBinding.threadId);
		let cleanup;
		runtime.joinCleanup = async () => {
			await cleanup;
		};
		return {
			runtime,
			releaseLease: () => {
				unprotect();
				cleanup = acquired.release();
				cleanup?.catch(() => void 0);
			}
		};
	} catch (error) {
		await retained.release();
		throw error;
	}
}
//#endregion
export { acquireCodexMcpAppRuntime, loadCodexEffectiveMcpCatalog };
