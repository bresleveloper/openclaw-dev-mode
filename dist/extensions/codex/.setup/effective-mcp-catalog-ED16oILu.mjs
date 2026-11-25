import { v as sessionBindingIdentity } from "./session-binding-record-BiLa2g9Y.mjs";
import { A as retainSharedCodexAppServerClientByInstanceId } from "./auth-cache-key-DS0mnvrR.mjs";
import { J as protectCodexAppServerLiveThread } from "./shared-client-DhJ31S_8.mjs";
import { n as projectCodexMcpToolMetadata, t as projectCodexMcpServerMetadata } from "./mcp-tool-metadata-dZb30ybZ.mjs";
import "./session-binding-_y0fotvm.mjs";
import { n as listCodexMcpServerStatuses } from "./mcp-server-status-BupwuCb2.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { assignMcpCatalogSafeServerNames } from "openclaw/plugin-sdk/agent-harness-runtime";
// extensions/codex/src/app-server/effective-mcp-catalog.ts
const loadMcpAppSessionPreparation = createLazyRuntimeModule(() => import("./mcp-app-session-preparation-ctJRffxJ.mjs"));
const loadNativeMcpApp = createLazyRuntimeModule(() => import("./native-mcp-app-Dj1pMuwz.mjs").then((n) => n.n));
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
		const observedNames = new Set(Object.keys(status.tools));
		const toolEntries = [...Object.entries(status.tools).toSorted(([left], [right]) => left.localeCompare(right)), ...[...deniedNames].filter((name) => !observedNames.has(name)).toSorted().map((name) => [name, void 0])];
		for (const [toolName, raw] of toolEntries) {
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
		serverEntries.push([status.name, {
			...projectCodexMcpServerMetadata(status),
			safeServerName,
			toolCount: toolEntries.length
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
/** Loads MCP inventory from the bound Codex client while retaining its lease through all pages. */
async function loadCodexEffectiveMcpCatalog(params, options) {
	const binding = await options.bindingStore.readAsync(sessionBindingIdentity({
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
		return buildCodexEffectiveMcpCatalog((await listCodexMcpServerStatuses((cursor) => retained.client.request("mcpServerStatus/list", {
			threadId: binding.threadId,
			detail: "toolsAndAuthOnly",
			limit: 100,
			...cursor ? { cursor } : {}
		}), {
			repeatedCursor: "Codex mcpServerStatus/list repeated its pagination cursor",
			pageLimit: "Codex mcpServerStatus/list exceeded the bounded page limit"
		})).filter((status) => allowedServerNames.has(status.name)), params.toolOverrides);
	} finally {
		await retained.release();
	}
}
/** Explicit App requests retain the thread owner, never start a second MCP client. */
async function acquireCodexMcpAppRuntime(params, options) {
	const identity = sessionBindingIdentity(params);
	let binding = await options.bindingStore.readAsync(identity);
	params.assertCurrent();
	let retained = await retainSharedCodexAppServerClientByInstanceId(binding?.clientId);
	if (!retained && params.prepareSession) {
		const preparation = await params.prepareSession();
		params.assertCurrent();
		const { prepareCodexMcpAppSession } = await loadMcpAppSessionPreparation();
		await prepareCodexMcpAppSession({
			preparation,
			bindingStore: options.bindingStore,
			pluginConfig: options.pluginConfig,
			assertCurrent: params.assertCurrent
		});
		params.assertCurrent();
		binding = await options.bindingStore.readAsync(identity);
		params.assertCurrent();
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
		const { createNativeMcpRuntime } = await loadNativeMcpApp();
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
export { acquireCodexMcpAppRuntime, loadCodexEffectiveMcpCatalog };
