import { a as createLazyRuntimeSurface } from "./lazy-runtime-CJrzFzqU.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./routing-CEr1aXk1.mjs";
import { n as registerBrowserCliMetadata } from "./cli-metadata-CslEjcLD.mjs";
import { $ as getOptionalBrowserStateRuntime, Q as getBrowserStateRuntime, c as drainBrowserSessionTabStore, f as initializeBrowserSessionTabStore, g as readBrowserDashboardSessionOwners } from "./session-tab-store-D3MRWtH0.mjs";
import { i as SESSION_BROWSER_REQUEST_GATEWAY_METHOD, n as BROWSER_REQUEST_GATEWAY_SCOPE, t as BROWSER_REQUEST_GATEWAY_METHOD } from "./browser-gateway-contract-WuzRejvY.mjs";
import { i as BROWSER_PROXY_UPLOAD_COMMAND, r as BROWSER_PROXY_COMMAND, t as createBrowserToolDefinition } from "./browser-tool-description-CRHph32o.mjs";
import { n as getGatewayExtensionRelayModule } from "./extension-relay.runtime.js";
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
				const { reconcileBrowserDashboards } = await import("./browser-dashboard-BaWnahiG.mjs");
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
		for (const dashboard of runtime.sessionDashboards?.values() ?? []) if (dashboard.definition.sessionKey === event.sessionKey || dashboard.definition.agentId === event.agentId && parseAgentSessionKey(dashboard.definition.sessionKey)?.rest === event.sessionKey) {
			dashboard.definitionChanged();
			dashboard.assertDefinitionCurrent().catch(() => {});
		}
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
		await Promise.allSettled([...runtime.sessionDashboards?.values() ?? []].map((dashboard) => dashboard.close()));
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
	const tokens = new Set(sessionKey?.toLowerCase().split(":") ?? []);
	if (tokens.has("group")) return "group";
	if (tokens.has("channel")) return "channel";
	if (tokens.has("direct") || tokens.has("dm")) return "direct";
}
function createLazyBrowserTool(opts, config) {
	const { binding, capabilities, metadata } = createBrowserToolDefinition(opts, () => config);
	return {
		...metadata,
		execute: async (toolCallId, args, signal, onUpdate) => {
			const { createBrowserTool } = await loadBrowserRegistrationRuntimeModule();
			return await createBrowserTool({
				...opts,
				...binding ? { runToolBinding: binding } : {},
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
const browserSecurityAuditCollectors = [async (ctx) => {
	const { collectBrowserSecurityAuditFindings } = await loadBrowserRegistrationRuntimeModule();
	return collectBrowserSecurityAuditFindings(ctx);
}];
function createLazyBrowserPluginService(runtime) {
	let service = null;
	let stopDashboardEvents;
	let stopTabCleanup;
	let accepting = false;
	return {
		id: "browser-control",
		reload: { configPrefixes: [
			"browser.enabled",
			"browser.evaluateEnabled",
			"browser.ssrfPolicy",
			"browser.extensionRelay.allowLegacyAuth"
		] },
		start: async (ctx) => {
			await Promise.all([stopTabCleanup?.(), stopDashboardEvents?.()]);
			stopDashboardEvents = ctx.gatewayEvents ? bindBrowserDashboardEvents(ctx.gatewayEvents, (message) => logger.warn(message)) : void 0;
			if (isTruthyEnvValue(process.env[EAGER_BROWSER_CONTROL_SERVICE_ENV])) {
				const { createBrowserPluginService, stopBrowserControlService } = await loadBrowserRegistrationRuntimeModule();
				service ??= createBrowserPluginService({ stopOnDemand: stopBrowserControlService });
				await service.start(ctx);
			}
			const { startTrackedBrowserTabCleanupTimer } = await import("./session-tab-cleanup-fFAQ8Flw.mjs");
			accepting = true;
			stopTabCleanup = startTrackedBrowserTabCleanupTimer({
				isCurrent: () => accepting && getOptionalBrowserStateRuntime() === runtime,
				getResolvedBrowserConfig: async () => {
					const { getBrowserControlState } = await import("./browser-control-state-BcYPh-Fr.mjs");
					return getBrowserControlState()?.resolved ?? null;
				},
				onWarn: (message) => logger.warn(message)
			});
		},
		stop: async (ctx) => {
			accepting = false;
			try {
				await Promise.all([stopTabCleanup?.(), stopDashboardEvents?.()]);
				stopTabCleanup = void 0;
				stopDashboardEvents = void 0;
				if (!service) {
					const loadedRuntime = loadBrowserRegistrationRuntimeModule.peek();
					if (!loadedRuntime) return;
					const { stopBrowserControlService } = await loadedRuntime;
					await stopBrowserControlService();
					return;
				}
				await service.stop?.(ctx);
			} finally {
				await drainBrowserSessionTabStore(runtime);
			}
		}
	};
}
function registerBrowserPlugin(api) {
	const runtime = initializeBrowserSessionTabStore(api.runtime);
	api.session.controls.registerControlUiDescriptor({
		id: "dashboard",
		surface: "widget",
		label: "Browser",
		description: "An interactive HTTP(S) browser dashboard. Session writers share an isolated session context with the agent's dashboard selector; administrators use the separate managed-profile browser. Author with dashboard widget_put.",
		requiredScopes: ["operator.sessions.write"],
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
					description: "Administrator-only local managed profile (default openclaw). Session browser uses the configured default profile; omit this property."
				}
			}
		}
	});
	api.on("session_end", async (event) => {
		if (event.reason !== "deleted" || !event.sessionKey || getOptionalBrowserStateRuntime() !== runtime) return;
		const dashboards = await readBrowserDashboardSessionOwners();
		if (getOptionalBrowserStateRuntime() !== runtime || !dashboards.some((dashboard) => dashboard.sessionKey === event.sessionKey)) return;
		const { reconcileBrowserDashboards } = await import("./browser-dashboard-BaWnahiG.mjs");
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
	api.registerTool((ctx) => {
		const config = ctx.getRuntimeConfig?.() ?? ctx.runtimeConfig ?? ctx.config;
		return createLazyBrowserTool(createBrowserToolOptions(ctx), config);
	}, { name: "browser" });
	registerBrowserCliMetadata(api);
	api.registerGatewayMethod(BROWSER_REQUEST_GATEWAY_METHOD, async (opts) => {
		const { handleBrowserGatewayRequest } = await loadBrowserRegistrationRuntimeModule();
		return await handleBrowserGatewayRequest(opts);
	}, { scope: BROWSER_REQUEST_GATEWAY_SCOPE });
	api.registerGatewayMethod(SESSION_BROWSER_REQUEST_GATEWAY_METHOD, async (opts) => {
		const { handleSessionBrowserGatewayRequest } = await loadBrowserRegistrationRuntimeModule();
		return handleSessionBrowserGatewayRequest(opts);
	}, {
		scope: "operator.write",
		sessionAccess: {
			mode: "write",
			allowOwnSessionScope: true,
			requiredTool: "browser"
		}
	});
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
			const { handleGatewayExtensionUpgrade } = await getGatewayExtensionRelayModule();
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
			const { handleBrowserScreencastUpgrade } = await import("./upgrade-CrEui-Ko.mjs");
			return await handleBrowserScreencastUpgrade(req, socket, head);
		}
	});
	api.registerService(createLazyBrowserPluginService(runtime));
}
//#endregion
export { registerBrowserPlugin as i, browserPluginReload as n, browserSecurityAuditCollectors as r, browserPluginNodeHostCommands as t };
