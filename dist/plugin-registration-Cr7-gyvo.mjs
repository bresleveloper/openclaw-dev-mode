import { a as createLazyRuntimeSurface } from "./lazy-runtime-BPNHa36e.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./routing-JKvWkBDR.mjs";
import { t as isBrowserMachineOutput } from "./cli-output-mode-eqyUredo.mjs";
import { J as getOptionalBrowserStateRuntime, m as readBrowserDashboardSessionOwners, q as getBrowserStateRuntime, u as initializeBrowserSessionTabStore } from "./session-tab-store-CyxH9Sdj.mjs";
import { n as BROWSER_REQUEST_GATEWAY_SCOPE, t as BROWSER_REQUEST_GATEWAY_METHOD } from "./browser-gateway-contract-B6OC_gCs.mjs";
import { c as BROWSER_PROXY_UPLOAD_COMMAND, i as describeBrowserTool, n as createBrowserToolSchema, o as parseBrowserTabToolBinding, r as resolveBrowserToolCapabilities, s as BROWSER_PROXY_COMMAND, t as BrowserToolOutputSchema } from "./browser-tool.schema-fgykLlsu.mjs";
import { i as resolveBrowserConfig, s as resolveProfile } from "./config-fMVye_Fl.mjs";
import { t as getBrowserProfileCapabilities } from "./profile-capabilities-B30ig3n7.mjs";
import { t as configureSystemProfileImportStateStore } from "./system-profile-import-state-DFy4mHBX.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region extensions/browser/src/browser-dashboard-events.ts
/** One service subscription owns discovery and reconciliation through shutdown. */
function bindBrowserDashboardEvents(events, onWarn) {
	const runtime = getBrowserStateRuntime();
	const pendingSessions = /* @__PURE__ */ new Set();
	const pendingAgentSessions = /* @__PURE__ */ new Set();
	let reconciliation;
	let accepting = true;
	const isCurrentRuntime = () => getOptionalBrowserStateRuntime() === runtime;
	const clearPending = () => {
		pendingSessions.clear();
		pendingAgentSessions.clear();
	};
	const reconcilePending = () => {
		if (reconciliation || pendingSessions.size === 0 || !isCurrentRuntime()) return;
		reconciliation = (async () => {
			while (pendingSessions.size > 0 && isCurrentRuntime()) {
				const sessions = new Set(pendingSessions);
				const agentSessions = new Set(pendingAgentSessions);
				clearPending();
				const dashboards = await readBrowserDashboardSessionOwners();
				if (!isCurrentRuntime()) return;
				const sessionKeys = /* @__PURE__ */ new Set();
				for (const dashboard of dashboards) if (sessions.has(dashboard.sessionKey) || dashboard.agentId && agentSessions.has(JSON.stringify([dashboard.agentId, parseAgentSessionKey(dashboard.sessionKey)?.rest]))) sessionKeys.add(dashboard.sessionKey);
				if (sessionKeys.size === 0) continue;
				const { reconcileBrowserDashboards } = await import("./browser-dashboard-CWrfMw9b.mjs");
				if (!isCurrentRuntime()) return;
				await reconcileBrowserDashboards({
					sessionKeys: [...sessionKeys],
					onWarn
				});
			}
		})().catch((error) => {
			clearPending();
			onWarn(`Browser dashboard reconciliation failed: ${String(error)}`);
		}).finally(() => {
			reconciliation = void 0;
			if (accepting && isCurrentRuntime()) reconcilePending();
			else clearPending();
		});
	};
	runtime.dashboardEvents = events;
	const onBoardChanged = (event) => {
		if (!accepting || !isCurrentRuntime() || event.reason !== "board") return;
		pendingSessions.add(event.sessionKey);
		if (event.agentId) pendingAgentSessions.add(JSON.stringify([normalizeAgentId(event.agentId), event.sessionKey]));
		reconcilePending();
	};
	let unsubscribe = events.onSessionsChanged(AsyncLocalStorage.bind(onBoardChanged));
	return async () => {
		accepting = false;
		unsubscribe?.();
		unsubscribe = void 0;
		if (runtime.dashboardEvents === events) runtime.dashboardEvents = void 0;
		await reconciliation;
		clearPending();
	};
}
//#endregion
//#region extensions/browser/plugin-registration.ts
const EAGER_BROWSER_CONTROL_SERVICE_ENV = "OPENCLAW_EAGER_BROWSER_CONTROL_SERVER";
const logger = createSubsystemLogger("browser");
let hasBrowserNodeHostWork;
let hasBrowserProxyUploadWork;
const loadBrowserRegistrationRuntimeModule = createLazyRuntimeSurface(() => import("./extensions/browser/register.runtime.js"), (runtime) => {
	hasBrowserNodeHostWork = runtime.hasBrowserNodeHostWork;
	return runtime;
});
const loadBrowserUploadCleanupRuntimeModule = createLazyRuntimeSurface(() => import("./browser-proxy-upload-cleanup.runtime.js"), (runtime) => {
	hasBrowserProxyUploadWork = runtime.hasBrowserProxyUploadWork;
	return runtime;
});
function deriveChatTypeFromSessionKey(sessionKey) {
	const tokens = new Set(sessionKey?.toLowerCase().split(":").filter(Boolean) ?? []);
	if (tokens.has("group")) return "group";
	if (tokens.has("channel")) return "channel";
	if (tokens.has("direct") || tokens.has("dm")) return "direct";
}
const BROWSER_CLI_DESCRIPTOR = {
	name: "browser",
	description: "Manage OpenClaw's dedicated browser (Chrome/Chromium)",
	hasSubcommands: true,
	machineOutput: isBrowserMachineOutput
};
function createLazyBrowserTool(opts, config) {
	const bindingResult = opts?.runToolBinding === void 0 ? void 0 : parseBrowserTabToolBinding(opts.runToolBinding);
	if (bindingResult && !bindingResult.ok) throw new Error(`invalid browser run binding: ${bindingResult.error}`);
	const targetDefault = opts?.sandboxBridgeUrl ? "sandbox" : "host";
	const hostHint = opts?.allowHostControl === false ? "Host target blocked by policy." : "Host target allowed.";
	const boundProfile = bindingResult?.ok && bindingResult.binding.target === "host" ? resolveProfile(resolveBrowserConfig(config?.browser, config), bindingResult.binding.profile) : void 0;
	const capabilities = resolveBrowserToolCapabilities({
		tabBound: bindingResult?.ok,
		evaluateEnabled: config?.browser?.evaluateEnabled !== false,
		...boundProfile ? { profileCapabilities: getBrowserProfileCapabilities(boundProfile) } : {}
	});
	return {
		label: "Browser",
		name: "browser",
		resultContentSource: "network",
		description: describeBrowserTool({
			targetDefault,
			hostHint,
			capabilities
		}),
		parameters: createBrowserToolSchema(capabilities),
		outputSchema: BrowserToolOutputSchema,
		execute: async (toolCallId, args, signal, onUpdate) => {
			const { createBrowserTool } = await loadBrowserRegistrationRuntimeModule();
			return await createBrowserTool(bindingResult?.ok ? {
				...opts,
				runToolBinding: bindingResult.binding,
				toolCapabilities: capabilities
			} : {
				...opts,
				toolCapabilities: capabilities
			}).execute(toolCallId, args, signal, onUpdate);
		}
	};
}
function createBrowserToolOptions(ctx) {
	const mediaChannel = ctx.deliveryContext?.channel ?? ctx.messageChannel;
	const mediaChatType = deriveChatTypeFromSessionKey(ctx.sessionKey);
	return {
		...ctx.browser?.sandboxBridgeUrl ? { sandboxBridgeUrl: ctx.browser.sandboxBridgeUrl } : {},
		...ctx.browser?.allowHostControl !== void 0 ? { allowHostControl: ctx.browser.allowHostControl } : {},
		...ctx.sessionKey ? { agentSessionKey: ctx.sessionKey } : {},
		...ctx.agentId ? { agentId: ctx.agentId } : {},
		...ctx.agentDir ? { agentDir: ctx.agentDir } : {},
		...ctx.workspaceDir ? { workspaceDir: ctx.workspaceDir } : {},
		...ctx.activeModel?.provider || ctx.activeModel?.modelId ? { activeModel: {
			provider: ctx.activeModel.provider,
			model: ctx.activeModel.modelId
		} } : {},
		...ctx.sessionKey || mediaChannel ? { mediaScope: {
			...ctx.sessionKey ? { sessionKey: ctx.sessionKey } : {},
			...mediaChannel ? { channel: mediaChannel } : {},
			...mediaChatType ? { chatType: mediaChatType } : {}
		} } : {},
		...ctx.toolBindings && Object.hasOwn(ctx.toolBindings, "browser") ? { runToolBinding: ctx.toolBindings.browser } : {}
	};
}
/** Browser plugin reload policy. */
const browserPluginReload = {
	restartPrefixes: ["browser"],
	hotPrefixes: [
		"browser.profiles",
		"browser.defaultProfile",
		"browser.headless",
		"browser.executablePath",
		"browser.attachOnly",
		"browser.cdpUrl",
		"browser.noSandbox",
		"browser.extraArgs",
		"browser.snapshotDefaults",
		"browser.tabCleanup",
		"browser.allowSystemProfileImport"
	]
};
/** Node-host command descriptors exposed by the Browser plugin. */
function createBrowserProxyNodeHostCommand(command) {
	return {
		command,
		cap: "browser",
		hasActiveWork: () => loadBrowserRegistrationRuntimeModule.peek() !== void 0 && hasBrowserNodeHostWork?.() !== false || loadBrowserUploadCleanupRuntimeModule.peek() !== void 0 && hasBrowserProxyUploadWork?.() !== false,
		isAvailable: ({ config }) => config.browser?.enabled !== false && config.nodeHost?.browserProxy?.enabled !== false,
		handle: async (paramsJSON, _io, context) => {
			const { runBrowserProxyCommand } = await loadBrowserRegistrationRuntimeModule();
			return await runBrowserProxyCommand(paramsJSON, command, context?.signal);
		},
		...command === "browser.proxy.upload.v1" ? { watchAvailability: () => {
			loadBrowserUploadCleanupRuntimeModule().then(({ ensureBrowserProxyUploadCleanup }) => ensureBrowserProxyUploadCleanup()).catch((error) => {
				logger.warn(`browser proxy upload cleanup startup failed: ${String(error)}`);
			});
		} } : {}
	};
}
const browserPluginNodeHostCommands = [createBrowserProxyNodeHostCommand(BROWSER_PROXY_COMMAND), createBrowserProxyNodeHostCommand(BROWSER_PROXY_UPLOAD_COMMAND)];
/** Security audit collectors contributed by the Browser plugin. */
const browserSecurityAuditCollectors = [async (ctx) => {
	const { collectBrowserSecurityAuditFindings } = await loadBrowserRegistrationRuntimeModule();
	return collectBrowserSecurityAuditFindings(ctx);
}];
function createLazyBrowserPluginService() {
	let service = null;
	let stopDashboardEvents;
	return {
		id: "browser-control",
		reload: { configPrefixes: [
			"browser.enabled",
			"browser.evaluateEnabled",
			"browser.ssrfPolicy",
			"browser.extensionRelay.allowLegacyAuth"
		] },
		start: async (ctx) => {
			await stopDashboardEvents?.();
			stopDashboardEvents = ctx.gatewayEvents ? bindBrowserDashboardEvents(ctx.gatewayEvents, (message) => logger.warn(message)) : void 0;
			if (!isTruthyEnvValue(process.env[EAGER_BROWSER_CONTROL_SERVICE_ENV])) return;
			const { createBrowserPluginService, stopBrowserControlService } = await loadBrowserRegistrationRuntimeModule();
			service ??= createBrowserPluginService({ stopOnDemand: stopBrowserControlService });
			await service.start(ctx);
		},
		stop: async (ctx) => {
			await stopDashboardEvents?.();
			stopDashboardEvents = void 0;
			if (!service) {
				const loadedRuntime = loadBrowserRegistrationRuntimeModule.peek();
				if (!loadedRuntime) return;
				const { stopBrowserControlService } = await loadedRuntime;
				await stopBrowserControlService();
				return;
			}
			await service.stop?.(ctx);
		}
	};
}
/** Register Browser tool factories, CLI, gateway methods, services, and audits. */
function registerBrowserPlugin(api) {
	const runtime = initializeBrowserSessionTabStore(api.runtime);
	api.session.controls.registerControlUiDescriptor({
		id: "dashboard",
		surface: "widget",
		label: "Browser",
		description: "An HTTP(S) dashboard shared with the agent's managed browser. Author with dashboard widget_put, then use the browser tool's dashboard selector to interact with that same page.",
		requiredScopes: ["operator.admin"],
		schema: {
			type: "object",
			additionalProperties: false,
			required: ["url"],
			properties: {
				url: {
					type: "string",
					maxLength: 4096,
					description: "HTTP(S) website URL without embedded credentials"
				},
				profile: {
					type: "string",
					maxLength: 128,
					description: "Local managed Browser profile; defaults to openclaw"
				}
			}
		}
	});
	api.on("session_end", async (event) => {
		if (event.reason !== "deleted" || !event.sessionKey || getOptionalBrowserStateRuntime() !== runtime) return;
		const dashboards = await readBrowserDashboardSessionOwners();
		if (getOptionalBrowserStateRuntime() !== runtime || !dashboards.some((dashboard) => dashboard.sessionKey === event.sessionKey)) return;
		const { reconcileBrowserDashboards } = await import("./browser-dashboard-CWrfMw9b.mjs");
		if (getOptionalBrowserStateRuntime() !== runtime) return;
		await reconcileBrowserDashboards({
			sessionKeys: [event.sessionKey],
			onWarn: (message) => logger.warn(message)
		});
	});
	configureSystemProfileImportStateStore(api.runtime.state.openKeyedStore({
		namespace: "browser.system-profile-import",
		maxEntries: 1
	}));
	api.registerTool(((ctx) => {
		const config = ctx.getRuntimeConfig?.() ?? ctx.runtimeConfig ?? ctx.config;
		return createLazyBrowserTool(createBrowserToolOptions(ctx), config);
	}));
	api.registerCli(async ({ program }) => {
		const { registerBrowserCli } = await import("./browser-cli-B7vqkpnc.mjs");
		registerBrowserCli(program, process.argv, api.rootDir);
	}, {
		commands: ["browser"],
		descriptors: [BROWSER_CLI_DESCRIPTOR]
	});
	api.registerGatewayMethod(BROWSER_REQUEST_GATEWAY_METHOD, async (opts) => {
		const { handleBrowserGatewayRequest } = await loadBrowserRegistrationRuntimeModule();
		return await handleBrowserGatewayRequest(opts);
	}, { scope: BROWSER_REQUEST_GATEWAY_SCOPE });
	api.registerHttpRoute({
		path: "/browser/extension",
		auth: "plugin",
		match: "exact",
		handler: (_req, res) => {
			res.writeHead(426, { "Content-Type": "text/plain" });
			res.end("Upgrade Required: connect the OpenClaw Chrome extension over WebSocket.");
		},
		handleUpgrade: async (req, socket, head) => {
			await loadBrowserRegistrationRuntimeModule();
			const { handleGatewayExtensionUpgrade } = await import("./gateway-relay-route-DLize8Xa.mjs");
			return await handleGatewayExtensionUpgrade(req, socket, head);
		}
	});
	api.registerHttpRoute({
		path: "/browser/screencast",
		auth: "plugin",
		match: "exact",
		handler: (_req, res) => {
			res.writeHead(426, { "Content-Type": "text/plain" });
			res.end("Upgrade Required: connect the browser screencast over WebSocket.");
		},
		handleUpgrade: async (req, socket, head) => {
			await loadBrowserRegistrationRuntimeModule();
			const { handleBrowserScreencastUpgrade } = await import("./upgrade-B63GLrxE.mjs");
			return await handleBrowserScreencastUpgrade(req, socket, head);
		}
	});
	api.registerService(createLazyBrowserPluginService());
}
//#endregion
export { registerBrowserPlugin as i, browserPluginReload as n, browserSecurityAuditCollectors as r, browserPluginNodeHostCommands as t };
