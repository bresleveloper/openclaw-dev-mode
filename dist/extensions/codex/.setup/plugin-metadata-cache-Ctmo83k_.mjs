import { d as resolveCodexAppServerHomeDir } from "./config-security-BEReZ6go.mjs";
import { o as resolveCodexComputerUseConfig } from "./config-options-BvaRs51b.mjs";
import { d as resolveMacOSDesktopCodexBundledMarketplaceCandidates, l as resolveFirstExistingMacOSDesktopCodexBundledMarketplacePath, t as isManagedCodexDesktopCommand } from "./managed-binary-BnshlFag.mjs";
import { n as describeControlFailure } from "./capabilities-CDXOOFdZ.mjs";
import { r as requestCodexAppServerClientJson } from "./request-D2L0zMrq.mjs";
import "./config-BoTP_mrL.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-C8Rw1m1m.mjs";
import { $ as assertNotSymlink, D as acquireCodexNativeConfigFence, Q as resolveCodexManagedBundledMarketplacePath, Y as reconcileCodexComputerUseStartArtifacts, b as waitForCodexAppServerClientDesktopGenerationDrain, c as getLeasedSharedCodexAppServerClient, d as readCodexAppServerClientDesktopGeneration, g as resolveCodexNativeConfigFenceKey, h as releaseLeasedSharedCodexAppServerClient, p as readCodexAppServerClientProcessIdentity, t as assertCodexAppServerClientStartSelectionCurrent, u as isCodexAppServerStartSelectionChangedError, x as withLeasedCodexAppServerClientStartSelectionRetry } from "./shared-client-DA4VR4Eb.mjs";
import { c as isCodexAppServerIndeterminateTransportError, o as isCodexAppServerConnectionClosedError, s as isCodexAppServerIndeterminateRequestCancellationError } from "./client-Cs08OXVQ.mjs";
import { r as CodexAppServerUnsafeSubscriptionError, u as retireUnsafeCodexTurnClientBestEffort } from "./attempt-client-cleanup-CEv1cKwF.mjs";
import { existsSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
//#region extensions/codex/src/app-server/computer-use-readiness.ts
/** Computer Use readiness probes and their native subscription lifecycle. */
function createComputerUseRequest(params) {
	const assertCurrent = params.assertCurrent;
	if (params.request) {
		const request = params.request;
		if (!assertCurrent) return request;
		return async (method, requestParams, options) => {
			if (method !== "thread/unsubscribe") assertCurrent();
			return await request(method, requestParams, options);
		};
	}
	const client = params.client;
	if (!client) throw new Error("Computer Use setup requires an acquired app-server client");
	return async (method, requestParams, options) => await client.request(method, requestParams, {
		timeoutMs: options?.timeoutMs ?? params.timeoutMs,
		signal: options?.signal ?? params.signal,
		...method === "thread/unsubscribe" ? {} : { assertCurrent }
	});
}
const COMPUTER_USE_LIVE_TEST_RETRY_COUNT = 1;
const COMPUTER_USE_LIVE_TEST_THREAD_NAME = "OpenClaw Computer Use readiness probe";
const COMPUTER_USE_LIST_APPS_TOOL = "list_apps";
const COMPUTER_USE_UNIFIED_JS_TOOL = "js";
const COMPUTER_USE_UNIFIED_JS_PROBE = "await cua.getState();";
async function runCodexComputerUseLiveTest(params) {
	const startedAt = Date.now();
	let lastError;
	let repair;
	const probe = resolveComputerUseLiveTestProbe(params.tools);
	for (let attempt = 0; attempt <= COMPUTER_USE_LIVE_TEST_RETRY_COUNT; attempt += 1) {
		let threadId;
		let outcome;
		try {
			threadId = (await params.request("thread/start", {
				input: [],
				developerInstructions: COMPUTER_USE_LIVE_TEST_THREAD_NAME,
				ephemeral: true
			}, { timeoutMs: params.config.liveTestTimeoutMs })).thread.id;
			if ((await params.request("mcpServer/tool/call", {
				threadId,
				server: params.config.mcpServerName,
				tool: probe.tool,
				arguments: probe.arguments
			}, { timeoutMs: params.config.toolCallTimeoutMs })).isError === true) throw new Error(`Computer Use readiness tool ${params.config.mcpServerName}.${probe.tool} returned an error result`);
			outcome = {
				ok: true,
				liveTest: {
					status: "passed",
					ok: true,
					attempted: true,
					attempts: attempt + 1,
					timeoutMs: params.config.liveTestTimeoutMs,
					retried: attempt > 0,
					repaired: Boolean(repair?.attempted && repair.warnings.length === 0),
					durationMs: Math.max(0, Date.now() - startedAt),
					message: "Computer Use live test passed."
				}
			};
		} catch (error) {
			outcome = {
				ok: false,
				error
			};
		}
		let cleanupError;
		if (threadId) try {
			await cleanupComputerUseProbeThread(params, threadId);
		} catch (error) {
			cleanupError = toErrorObject(error, "Computer Use readiness cleanup failed");
		}
		if (!outcome.ok && (params.signal?.aborted || isCodexAppServerStartSelectionChangedError(outcome.error))) throw toErrorObject(outcome.error, "Computer Use live test failed");
		if (cleanupError) throw cleanupError;
		if (outcome.ok) return {
			liveTest: outcome.liveTest,
			...repair ? { repair } : {}
		};
		lastError = outcome.error;
		if (attempt < COMPUTER_USE_LIVE_TEST_RETRY_COUNT && params.config.autoRepair) repair = await repairComputerUseMcpRuntime(params.request, params.config);
	}
	const errorMessage = describeControlFailure(lastError);
	return {
		liveTest: {
			status: "failed",
			ok: false,
			attempted: true,
			attempts: 2,
			timeoutMs: params.config.liveTestTimeoutMs,
			retried: true,
			repaired: Boolean(repair?.attempted && repair.warnings.length === 0),
			durationMs: Math.max(0, Date.now() - startedAt),
			message: `Computer Use live test failed after 2 attempts: ${errorMessage}`,
			error: errorMessage
		},
		...repair ? { repair } : {}
	};
}
function resolveComputerUseLiveTestProbe(tools) {
	if (tools?.includes(COMPUTER_USE_UNIFIED_JS_TOOL) && !tools.includes(COMPUTER_USE_LIST_APPS_TOOL)) return {
		tool: COMPUTER_USE_UNIFIED_JS_TOOL,
		arguments: { code: COMPUTER_USE_UNIFIED_JS_PROBE }
	};
	return {
		tool: COMPUTER_USE_LIST_APPS_TOOL,
		arguments: {}
	};
}
async function repairComputerUseMcpRuntime(request, config) {
	try {
		await request("config/mcpServer/reload", void 0, { timeoutMs: config.liveTestTimeoutMs });
		return {
			attempted: true,
			killedPids: [],
			warnings: [],
			message: "Reloaded Computer Use MCP servers through Codex app-server."
		};
	} catch (error) {
		const message = `Could not reload Computer Use MCP servers: ${describeControlFailure(error)}`;
		return {
			attempted: true,
			killedPids: [],
			warnings: [message],
			message
		};
	}
}
async function cleanupComputerUseProbeThread(params, threadId) {
	try {
		await params.request("thread/unsubscribe", { threadId }, {
			timeoutMs: params.config.liveTestTimeoutMs,
			signal: AbortSignal.timeout(params.config.liveTestTimeoutMs)
		});
	} catch (error) {
		if (params.client) await retireUnsafeCodexTurnClientBestEffort(params.client, "Computer Use readiness cleanup");
		throw new CodexAppServerUnsafeSubscriptionError("Computer Use readiness cleanup failed", { cause: error });
	}
}
function skippedLiveTestStatus(config, message) {
	return {
		status: "skipped",
		ok: false,
		attempted: false,
		attempts: 0,
		timeoutMs: config.liveTestTimeoutMs,
		retried: false,
		repaired: false,
		message
	};
}
//#endregion
//#region extensions/codex/src/app-server/computer-use.ts
/**
* Computer Use plugin/MCP readiness checks and optional install flow for Codex
* app-server sessions.
*/
var CodexComputerUseSetupError = class extends Error {
	constructor(status) {
		super(status.message);
		this.name = "CodexComputerUseSetupError";
		this.status = status;
	}
};
const CURATED_MARKETPLACE_POLL_INTERVAL_MS = 2e3;
const BUNDLED_MARKETPLACE_NAME = "openai-bundled";
const COMPUTER_USE_MARKETPLACE_NAME_PRIORITY = [
	BUNDLED_MARKETPLACE_NAME,
	"openai-curated",
	"openai-api-curated",
	"openai-curated-remote",
	"local"
];
/** Reads Computer Use readiness without installing or mutating app-server state. */
async function readCodexComputerUseStatus(params = {}) {
	const config = resolveComputerUseConfig(params);
	if (!config.enabled) return disabledStatus(config);
	try {
		return await inspectCodexComputerUse({
			...params,
			computerUseConfig: config,
			runLiveTest: true,
			installPlugin: false
		});
	} catch (error) {
		return unavailableStatus(config, "check_failed", `Computer Use check failed: ${describeControlFailure(error)}`);
	}
}
/**
* Ensures installation and MCP exposure before a turn, optionally installing when
* config allows safe auto-install. Only strict startup waits for a live probe.
*/
async function ensureCodexComputerUse(params = {}) {
	const config = resolveComputerUseConfig(params);
	if (!config.enabled) return disabledStatus(config);
	const status = await inspectCodexComputerUse({
		...params,
		computerUseConfig: config,
		runLiveTest: config.strictReadiness,
		installPlugin: false
	});
	if (status.ready) return status;
	if (config.autoInstall) {
		const blockedAutoInstallStatus = blockUnsafeAutoInstallStatus(config);
		if (blockedAutoInstallStatus) throw new CodexComputerUseSetupError(blockedAutoInstallStatus);
		const installedStatus = await inspectCodexComputerUse({
			...params,
			computerUseConfig: config,
			runLiveTest: config.strictReadiness,
			installPlugin: true
		});
		if (!installedStatus.ready) throw new CodexComputerUseSetupError(installedStatus);
		return installedStatus;
	}
	if (!status.ready) throw new CodexComputerUseSetupError(status);
	return status;
}
/** Forces Computer Use plugin installation and returns the ready status. */
async function installCodexComputerUse(params = {}) {
	const config = resolveComputerUseConfig({
		...params,
		forceEnable: true,
		overrides: {
			...params.overrides,
			enabled: true,
			autoInstall: true
		}
	});
	const status = await inspectCodexComputerUse({
		...params,
		computerUseConfig: config,
		runLiveTest: true,
		installPlugin: true
	});
	if (!status.ready) throw new CodexComputerUseSetupError(status);
	return status;
}
async function inspectCodexComputerUse(params) {
	const resolvedRuntime = resolveCodexAppServerRuntimeOptions({
		pluginConfig: params.pluginConfig,
		managedCommandOrder: "desktop-first"
	});
	const operationTimeoutMs = params.timeoutMs ?? resolvedRuntime.requestTimeoutMs;
	const deadline = operationTimeoutMs > 0 ? Date.now() + operationTimeoutMs : void 0;
	const remainingTimeoutMs = () => deadline === void 0 ? operationTimeoutMs : Math.max(1, deadline - Date.now());
	const clientOptions = {
		startOptions: resolvedRuntime.start,
		pluginConfig: params.pluginConfig,
		config: params.config,
		agentDir: params.agentDir,
		abandonSignal: params.signal,
		assertCurrent: params.assertCurrent
	};
	const lease = {};
	try {
		let client = params.client;
		if (!client && !params.request) {
			client = await getLeasedSharedCodexAppServerClient({
				...clientOptions,
				timeoutMs: remainingTimeoutMs()
			});
			lease.client = client;
		}
		if (!params.installPlugin) {
			if (!lease.client) return await inspectCodexComputerUseWithoutFence(params);
			return await withLeasedCodexAppServerClientStartSelectionRetry({
				lease,
				options: {
					...clientOptions,
					timeoutMs: remainingTimeoutMs()
				},
				signal: params.signal,
				run: async (readClient, requestOptions) => {
					const { assertCurrent } = requestOptions();
					return await inspectCodexComputerUseWithoutFence({
						...params,
						client: readClient,
						request: async (method, requestParams, options) => {
							const scopedOptions = method === "thread/unsubscribe" ? {
								timeoutMs: options?.timeoutMs ?? operationTimeoutMs,
								signal: options?.signal,
								assertCurrent
							} : requestOptions();
							return await requestCodexAppServerClientJson({
								client: readClient,
								method,
								requestParams,
								config: params.config,
								timeoutMs: Math.min(options?.timeoutMs ?? operationTimeoutMs, scopedOptions.timeoutMs),
								signal: scopedOptions.signal,
								assertCurrent: scopedOptions.assertCurrent
							});
						}
					});
				}
			});
		}
		const explicitManagedInstall = client && !resolveCodexComputerUseConfig({ pluginConfig: params.pluginConfig }).autoInstall ? await resolveExplicitManagedComputerUseInstallContext({
			...params,
			client
		}) : void 0;
		if (explicitManagedInstall) {
			await waitForCodexAppServerClientDesktopGenerationDrain({
				client: explicitManagedInstall.client,
				timeoutMs: remainingTimeoutMs(),
				...params.signal ? { signal: params.signal } : {}
			});
			assertCodexAppServerClientStartSelectionCurrent({ client: explicitManagedInstall.client });
		}
		const inspectionParams = {
			...params,
			...client ? { client } : {},
			timeoutMs: remainingTimeoutMs(),
			...explicitManagedInstall ? { explicitManagedInstall } : {}
		};
		const fenceKey = resolveCodexNativeConfigFenceKey({
			client,
			startOptions: resolvedRuntime.start,
			agentDir: params.agentDir,
			config: params.config
		});
		if (!fenceKey) return await inspectCodexComputerUseWithoutFence(inspectionParams);
		const release = await acquireCodexNativeConfigFence(fenceKey, {
			signal: params.signal,
			timeoutMs: remainingTimeoutMs(),
			timeoutMessage: "Codex Computer Use install timed out waiting for native config",
			abortMessage: "Codex Computer Use install aborted waiting for native config"
		});
		let releaseFenceOnReturn = true;
		try {
			try {
				return await inspectCodexComputerUseWithoutFence({
					...inspectionParams,
					releaseNativeConfigFence: release
				});
			} catch (error) {
				if (client && (isCodexAppServerIndeterminateRequestCancellationError(error) || isCodexAppServerIndeterminateTransportError(error) || isCodexAppServerConnectionClosedError(error))) {
					releaseFenceOnReturn = false;
					await client.closeAndRunAfterExit(release, "Computer Use config mutation");
				}
				throw error;
			}
		} finally {
			if (releaseFenceOnReturn) release();
		}
	} finally {
		if (lease.client) releaseLeasedSharedCodexAppServerClient(lease.client);
	}
}
async function inspectCodexComputerUseWithoutFence(params) {
	const request = createComputerUseRequest(params);
	if (params.installPlugin) {
		if (!resolveCodexComputerUseConfig({ pluginConfig: params.pluginConfig }).autoInstall) await prepareExplicitManagedComputerUseInstall(params);
		await request("experimentalFeature/enablement/set", { enablement: { plugins: true } });
	}
	const managedMarketplacePath = await resolveClientManagedBundledMarketplacePath(params.client, params.agentDir);
	const managedCodexHome = managedMarketplacePath ? params.client?.getRuntimeIdentity()?.codexHome : void 0;
	if (params.installPlugin && managedCodexHome) await assertNotSymlink(path.join(managedCodexHome, "config.toml"), "Codex config");
	const marketplace = await resolveMarketplaceRef({
		request,
		config: params.computerUseConfig,
		allowAdd: params.installPlugin,
		signal: params.signal,
		defaultBundledMarketplacePath: params.defaultBundledMarketplacePath ?? managedMarketplacePath,
		defaultBundledMarketplacePathCandidates: params.defaultBundledMarketplacePathCandidates,
		managedCodexHome
	});
	if (!marketplace.marketplace) return unavailableStatus(params.computerUseConfig, "marketplace_missing", marketplace.message ?? `No Codex marketplace containing ${params.computerUseConfig.pluginName} is registered. Configure computerUse.marketplaceSource or computerUse.marketplacePath, then run /codex computer-use install.`);
	const pluginInspection = await ensureComputerUsePlugin({
		request,
		config: params.computerUseConfig,
		marketplace: marketplace.marketplace,
		installPlugin: params.installPlugin
	});
	if (!pluginInspection.ok) return pluginInspection.status;
	return await readComputerUseTools({
		request,
		client: params.client,
		signal: params.signal,
		config: params.computerUseConfig,
		plugin: pluginInspection.plugin,
		runLiveTest: params.runLiveTest,
		installPlugin: params.installPlugin,
		releaseNativeConfigFence: params.releaseNativeConfigFence
	});
}
async function prepareExplicitManagedComputerUseInstall(params) {
	const context = params.explicitManagedInstall;
	if (!context) return;
	await reconcileCodexComputerUseStartArtifacts({
		startOptions: {
			transport: "stdio",
			command: context.command,
			commandSource: "resolved-managed",
			args: ["app-server"],
			headers: {},
			env: { CODEX_HOME: context.codexHome }
		},
		agentDir: context.agentDir,
		pluginConfig: { computerUse: {
			...params.computerUseConfig,
			autoInstall: true
		} },
		ownsIsolatedCodexHome: true,
		desktopGeneration: context.desktopGeneration,
		forceCacheRefresh: true,
		assertCurrent: () => {
			params.assertCurrent?.();
			assertCodexAppServerClientStartSelectionCurrent({ client: context.client });
		}
	});
}
async function resolveExplicitManagedComputerUseInstallContext(params) {
	if (!params.agentDir) return;
	const codexHome = params.client.getRuntimeIdentity()?.codexHome;
	const processIdentity = readCodexAppServerClientProcessIdentity(params.client);
	const command = processIdentity?.nativeCommand ?? (processIdentity && isManagedCodexDesktopCommand(processIdentity.command, "darwin") ? processIdentity.command : void 0);
	if (!codexHome || !command) return;
	const desktopGeneration = readCodexAppServerClientDesktopGeneration(params.client);
	if (!desktopGeneration) throw new Error("Codex Computer Use install requires a desktop-generation-bound client; reconnect and retry.");
	const expectedHome = resolveCodexAppServerHomeDir(params.agentDir);
	const [actualRealHome, expectedRealHome] = await Promise.all([fs$1.realpath(codexHome).catch(() => void 0), fs$1.realpath(expectedHome).catch(() => void 0)]);
	if (!actualRealHome || actualRealHome !== expectedRealHome) return;
	return {
		client: params.client,
		agentDir: params.agentDir,
		codexHome,
		command,
		desktopGeneration
	};
}
async function resolveClientManagedBundledMarketplacePath(client, agentDir) {
	const codexHome = client?.getRuntimeIdentity()?.codexHome;
	if (!codexHome || !agentDir) return;
	const [actualRealHome, expectedRealHome] = await Promise.all([fs$1.realpath(codexHome).catch(() => void 0), fs$1.realpath(resolveCodexAppServerHomeDir(agentDir)).catch(() => void 0)]);
	if (!actualRealHome || actualRealHome !== expectedRealHome) return;
	const managedPath = resolveCodexManagedBundledMarketplacePath(codexHome);
	return existsSync(managedPath) ? managedPath : void 0;
}
async function ensureComputerUsePlugin(params) {
	let plugin = await readComputerUsePlugin(params.request, params.marketplace, params.config.pluginName);
	if (!plugin.summary.installed || !plugin.summary.enabled) {
		if (!params.installPlugin) return {
			ok: false,
			status: statusFromPlugin({
				config: params.config,
				plugin,
				tools: [],
				reason: pluginSetupReason(plugin),
				message: pluginSetupMessage(params.config, plugin)
			})
		};
		await params.request("plugin/install", pluginRequestParams(params.marketplace, params.config.pluginName));
		await reloadMcpServers(params.request);
		plugin = await readComputerUsePlugin(params.request, params.marketplace, params.config.pluginName);
	}
	if (!plugin.summary.installed || !plugin.summary.enabled) return {
		ok: false,
		status: statusFromPlugin({
			config: params.config,
			plugin,
			tools: [],
			reason: pluginSetupReason(plugin),
			message: pluginSetupMessage(params.config, plugin)
		})
	};
	return {
		ok: true,
		plugin
	};
}
async function readComputerUseTools(params) {
	let server = await readMcpServerStatus(params.request, params.config.mcpServerName);
	let tools = Object.keys(server?.tools ?? {}).toSorted();
	if ((!server || tools.length === 0) && params.installPlugin) {
		await reloadMcpServers(params.request);
		server = await readMcpServerStatus(params.request, params.config.mcpServerName);
		tools = Object.keys(server?.tools ?? {}).toSorted();
	}
	if (!server) return statusFromPlugin({
		config: params.config,
		plugin: params.plugin,
		tools: [],
		reason: "mcp_missing",
		message: `Computer Use is installed, but the ${params.config.mcpServerName} MCP server is not available.`
	});
	if (tools.length === 0) return statusFromPlugin({
		config: params.config,
		plugin: params.plugin,
		tools,
		reason: "mcp_missing",
		message: `Computer Use is installed, but the ${params.config.mcpServerName} MCP server exposes no tools.`
	});
	const status = statusFromPlugin({
		config: params.config,
		plugin: params.plugin,
		tools,
		reason: "ready",
		message: "Computer Use is ready."
	});
	if (!params.runLiveTest) return status;
	params.releaseNativeConfigFence?.();
	const { liveTest, repair } = await runCodexComputerUseLiveTest({
		request: params.request,
		client: params.client,
		signal: params.signal,
		config: params.config,
		tools
	});
	const compatibilityStartupAllowed = !liveTest.ok && !params.config.strictReadiness;
	return {
		...status,
		ready: liveTest.ok,
		reason: liveTest.ok ? "ready" : "live_test_failed",
		liveTest,
		...repair ? { repair } : {},
		warnings: [
			...status.warnings,
			...repair?.warnings ?? [],
			...compatibilityStartupAllowed ? ["Computer Use live test failed, but compatibility startup remains enabled; set computerUse.strictReadiness to true to fail closed."] : []
		],
		message: liveTest.ok ? "Computer Use is ready." : compatibilityStartupAllowed ? `${liveTest.message} Startup is allowed because computerUse.strictReadiness is false.` : liveTest.message
	};
}
async function resolveMarketplaceRef(params) {
	let preferredMarketplaceName = params.config.marketplaceName;
	if (params.config.marketplaceSource && params.allowAdd) {
		const added = await params.request("marketplace/add", { source: params.config.marketplaceSource });
		preferredMarketplaceName ??= added.marketplaceName;
	}
	if (params.config.marketplacePath) return { marketplace: preferredMarketplaceName ? {
		kind: "local",
		name: preferredMarketplaceName,
		path: params.config.marketplacePath
	} : {
		kind: "local",
		path: params.config.marketplacePath
	} };
	let candidates = await listComputerUseMarketplaceCandidates(params.request, params.config);
	const bundledMarketplacePath = resolveBundledComputerUseMarketplacePath(params);
	if (candidates.length === 0 && bundledMarketplacePath && shouldAddBundledComputerUseMarketplace(params)) {
		if (params.managedCodexHome) await migrateLegacyBundledMarketplaceSource({
			request: params.request,
			bundledMarketplacePath,
			legacySources: params.defaultBundledMarketplacePathCandidates,
			userConfigPath: path.join(params.managedCodexHome, "config.toml")
		});
		const added = await params.request("marketplace/add", { source: bundledMarketplacePath });
		preferredMarketplaceName ??= added.marketplaceName;
		candidates = await listComputerUseMarketplaceCandidates(params.request, params.config);
	}
	const waitUntil = marketplaceDiscoveryWaitUntil(params);
	if (candidates.length === 0 && waitUntil > Date.now() && await codexNativePluginsDisabled(params.request)) return { message: "Codex native plugin support is disabled (features.plugins = false). Enable it in the Codex config, then run /codex computer-use install." };
	while (candidates.length === 0) {
		if (Date.now() >= waitUntil) break;
		await delay(Math.min(CURATED_MARKETPLACE_POLL_INTERVAL_MS, waitUntil - Date.now()), params.signal);
		candidates = await listComputerUseMarketplaceCandidates(params.request, params.config);
	}
	if (preferredMarketplaceName) {
		const preferred = candidates.find((candidate) => candidate.name === preferredMarketplaceName);
		if (preferred) return { marketplace: preferred };
		return { message: `Configured Codex marketplace ${preferredMarketplaceName} was not found or does not contain ${params.config.pluginName}. Run /codex computer-use install with a source or path to install from a new marketplace.` };
	}
	if (candidates.length > 1) {
		const preferred = chooseKnownComputerUseMarketplace(candidates);
		if (preferred) return { marketplace: preferred };
		return { message: `Multiple Codex marketplaces contain ${params.config.pluginName}. Configure computerUse.marketplaceName or computerUse.marketplacePath to choose one.` };
	}
	if (params.config.marketplaceSource && !params.allowAdd && candidates.length === 0) return { message: "Computer Use marketplace source is configured but has not been registered. Run /codex computer-use install to register it." };
	const marketplace = candidates[0];
	return marketplace ? { marketplace } : {};
}
async function migrateLegacyBundledMarketplaceSource(params) {
	const response = await params.request("config/read", { includeLayers: false });
	const bundled = response.config.marketplaces?.[BUNDLED_MARKETPLACE_NAME];
	const sourceOrigin = response.origins[`marketplaces.${BUNDLED_MARKETPLACE_NAME}.source`];
	if (bundled?.source_type !== "local" || !bundled.source || sourceOrigin?.name.type !== "user" || sourceOrigin.name.profile !== null || path.resolve(sourceOrigin.name.file) !== path.resolve(params.userConfigPath)) return;
	const configuredSource = path.resolve(bundled.source);
	if (configuredSource === path.resolve(params.bundledMarketplacePath)) return;
	if (!(params.legacySources ?? resolveMacOSDesktopCodexBundledMarketplaceCandidates()).some((source) => path.resolve(source) === configuredSource)) return;
	await params.request("marketplace/remove", { marketplaceName: BUNDLED_MARKETPLACE_NAME });
}
async function listComputerUseMarketplaceCandidates(request, config) {
	return findComputerUseMarketplaces(await request("plugin/list", { cwds: [] }), config.pluginName);
}
async function codexNativePluginsDisabled(request) {
	return (await request("experimentalFeature/list", {})).data.find(({ name }) => name === "plugins")?.enabled === false;
}
function blockUnsafeAutoInstallStatus(config) {
	if (!config.marketplaceSource) return;
	return unavailableStatus(config, "auto_install_blocked", "Computer Use auto-install only uses marketplaces Codex app-server has already discovered. Run /codex computer-use install to install from a configured marketplace source.");
}
function shouldAddBundledComputerUseMarketplace(params) {
	return params.allowAdd && !params.config.marketplaceSource && !params.config.marketplacePath && !params.config.marketplaceName && Boolean(resolveBundledComputerUseMarketplacePath(params));
}
function resolveBundledComputerUseMarketplacePath(params) {
	if (params.defaultBundledMarketplacePath) return existsSync(params.defaultBundledMarketplacePath) ? params.defaultBundledMarketplacePath : void 0;
	if (!params.defaultBundledMarketplacePathCandidates) return;
	return resolveFirstExistingMacOSDesktopCodexBundledMarketplacePath({ candidates: params.defaultBundledMarketplacePathCandidates });
}
function findComputerUseMarketplaces(listed, pluginName) {
	return listed.marketplaces.flatMap((marketplace) => {
		const plugin = marketplace.plugins.find((candidate) => candidate.name === pluginName || candidate.id === pluginName || candidate.id === `${pluginName}@${marketplace.name}`);
		if (!plugin) return [];
		if (marketplace.path) return [{
			kind: "local",
			name: marketplace.name,
			path: marketplace.path
		}];
		const remotePluginId = plugin.remotePluginId?.trim();
		if (!remotePluginId) return [];
		return [{
			kind: "remote",
			name: marketplace.name,
			remoteMarketplaceName: marketplace.name,
			remotePluginId
		}];
	});
}
function chooseKnownComputerUseMarketplace(candidates) {
	for (const marketplaceName of COMPUTER_USE_MARKETPLACE_NAME_PRIORITY) {
		const candidate = candidates.find((marketplace) => marketplace.name === marketplaceName);
		if (candidate) return candidate;
	}
}
function marketplaceDiscoveryWaitUntil(params) {
	if (params.allowAdd && !params.config.marketplaceSource && !params.config.marketplacePath && !params.config.marketplaceName) return Date.now() + params.config.marketplaceDiscoveryTimeoutMs;
	return 0;
}
async function delay(ms, signal) {
	if (signal?.aborted) throw abortError(signal);
	await new Promise((resolve, reject) => {
		const onAbort = () => {
			clearTimeout(timer);
			signal?.removeEventListener("abort", onAbort);
			reject(abortError(signal));
		};
		const timer = setTimeout(() => {
			signal?.removeEventListener("abort", onAbort);
			resolve();
		}, ms);
		signal?.addEventListener("abort", onAbort, { once: true });
	});
}
function abortError(signal) {
	const reason = signal?.reason;
	return reason instanceof Error ? reason : /* @__PURE__ */ new Error("Computer Use setup was aborted.");
}
async function readComputerUsePlugin(request, marketplace, pluginName) {
	return (await request("plugin/read", pluginRequestParams(marketplace, pluginName))).plugin;
}
async function readMcpServerStatus(request, serverName) {
	let cursor;
	do {
		const response = await request("mcpServerStatus/list", {
			cursor,
			limit: 100,
			detail: "toolsAndAuthOnly"
		});
		const found = response.data.find((server) => server.name === serverName);
		if (found) return found;
		cursor = response.nextCursor;
	} while (cursor);
}
async function reloadMcpServers(request) {
	await request("config/mcpServer/reload", void 0);
}
function pluginRequestParams(marketplace, pluginName) {
	return marketplace.kind === "local" ? {
		marketplacePath: marketplace.path,
		pluginName
	} : {
		remoteMarketplaceName: marketplace.remoteMarketplaceName,
		pluginName: marketplace.remotePluginId
	};
}
function pluginSetupReason(plugin) {
	return plugin.summary.installed ? "plugin_disabled" : "plugin_not_installed";
}
function pluginSetupMessage(config, plugin) {
	if (!plugin.summary.installed) return "Computer Use is available but not installed. Run /codex computer-use install or enable computerUse.autoInstall.";
	return `Computer Use is installed, but the ${config.pluginName} plugin is disabled. Run /codex computer-use install or enable computerUse.autoInstall to re-enable it.`;
}
function statusFromPlugin(params) {
	return {
		enabled: true,
		ready: params.plugin.summary.installed && params.plugin.summary.enabled && params.tools.length > 0,
		reason: params.reason,
		installed: params.plugin.summary.installed,
		pluginEnabled: params.plugin.summary.enabled,
		mcpServerAvailable: params.tools.length > 0,
		pluginName: params.config.pluginName,
		mcpServerName: params.config.mcpServerName,
		marketplaceName: params.plugin.marketplaceName,
		...params.plugin.marketplacePath ? { marketplacePath: params.plugin.marketplacePath } : {},
		tools: params.tools,
		installation: installationStatusFromPlugin(params.plugin, params.message),
		exposure: exposureStatusFromTools(params.config, params.tools),
		liveTest: skippedLiveTestStatus(params.config, "Computer Use live test was not run."),
		warnings: pluginWarnings(params.plugin),
		message: params.message
	};
}
function disabledStatus(config) {
	return {
		enabled: false,
		ready: false,
		reason: "disabled",
		installed: false,
		pluginEnabled: false,
		mcpServerAvailable: false,
		pluginName: config.pluginName,
		mcpServerName: config.mcpServerName,
		tools: [],
		installation: {
			status: "disabled",
			ok: false,
			message: "Computer Use is disabled."
		},
		exposure: {
			status: "skipped",
			ok: false,
			message: "MCP exposure was not checked because Computer Use is disabled."
		},
		liveTest: skippedLiveTestStatus(config, "Computer Use live test was not run because Computer Use is disabled."),
		warnings: [],
		message: "Computer Use is disabled."
	};
}
function unavailableStatus(config, reason, message) {
	return {
		enabled: true,
		ready: false,
		reason,
		installed: false,
		pluginEnabled: false,
		mcpServerAvailable: false,
		pluginName: config.pluginName,
		mcpServerName: config.mcpServerName,
		...config.marketplaceName ? { marketplaceName: config.marketplaceName } : {},
		...config.marketplacePath ? { marketplacePath: config.marketplacePath } : {},
		tools: [],
		installation: {
			status: reason === "marketplace_missing" ? "marketplace_missing" : "not_installed",
			ok: false,
			message
		},
		exposure: {
			status: "skipped",
			ok: false,
			message: "MCP exposure was not checked because Computer Use installation is not ready."
		},
		liveTest: skippedLiveTestStatus(config, "Computer Use live test was not run because installation is not ready."),
		warnings: [],
		message
	};
}
function installationStatusFromPlugin(plugin, message) {
	if (!plugin.summary.installed) return {
		status: "not_installed",
		ok: false,
		message
	};
	if (!plugin.summary.enabled) return {
		status: "installed_disabled",
		ok: false,
		message
	};
	return {
		status: "installed",
		ok: true,
		message: "Computer Use plugin is installed and enabled."
	};
}
function exposureStatusFromTools(config, tools) {
	if (tools.length === 0) return {
		status: "missing",
		ok: false,
		message: `Computer Use MCP server ${config.mcpServerName} is not exposed.`
	};
	return {
		status: "available",
		ok: true,
		message: `Computer Use MCP server ${config.mcpServerName} exposes ${tools.length} tools.`
	};
}
function pluginWarnings(plugin) {
	const warnings = [];
	const source = plugin.summary.source;
	if (source && typeof source === "object" && "type" in source && source.type === "remote") warnings.push("Computer Use plugin is resolved from a remote marketplace; live local bundles are preferred.");
	return warnings;
}
function resolveComputerUseConfig(params) {
	const overrides = params.forceEnable ? {
		...params.overrides,
		enabled: true
	} : params.overrides;
	return resolveCodexComputerUseConfig({
		pluginConfig: params.pluginConfig,
		overrides
	});
}
//#endregion
//#region extensions/codex/src/app-server/plugin-metadata-cache.ts
const CODEX_PLUGIN_METADATA_CACHE_TTL_MS = 36e5;
/** Process-local plugin metadata cache with coalesced loads per query. */
var CodexPluginMetadataCache = class {
	constructor(nowMs = Date.now) {
		this.nowMs = nowMs;
		this.entries = /* @__PURE__ */ new Map();
		this.inFlight = /* @__PURE__ */ new Map();
		this.generations = /* @__PURE__ */ new Map();
		this.clearGeneration = 0;
	}
	/** Returns a fresh cached snapshot without issuing a request. */
	read(appCacheKey, queryKind, requestParams, catalogScope) {
		const entryKey = buildMetadataCacheEntryKey(appCacheKey, queryKind, requestParams, catalogScope);
		const entry = this.entries.get(entryKey);
		if (!entry) return;
		if (entry.expiresAtMs <= this.nowMs()) {
			this.entries.delete(entryKey);
			return;
		}
		return entry.snapshot;
	}
	/** Returns a fresh snapshot or coalesces one catalog or installed-plugin request. */
	async load(params) {
		const entryKey = buildMetadataCacheEntryKey(params.appCacheKey, params.queryKind, params.requestParams, params.catalogScope);
		const cached = this.read(params.appCacheKey, params.queryKind, params.requestParams, params.catalogScope);
		if (cached) return cached;
		const pending = this.inFlight.get(entryKey);
		if (pending) try {
			return await pending.promise;
		} catch {
			if (this.inFlight.get(entryKey) === pending) this.inFlight.delete(entryKey);
			return await this.load(params);
		}
		const generation = this.generations.get(params.appCacheKey) ?? 0;
		const clearGeneration = this.clearGeneration;
		const promise = (async () => {
			const method = params.queryKind === "installed" ? "plugin/installed" : "plugin/list";
			const response = await params.request(method, params.requestParams);
			const snapshot = {
				appCacheKey: params.appCacheKey,
				queryKind: params.queryKind,
				response
			};
			if (generation === (this.generations.get(params.appCacheKey) ?? 0) && clearGeneration === this.clearGeneration && !hasMarketplaceLoadErrors(response) && (params.cacheable?.(response) ?? true)) this.entries.set(entryKey, {
				snapshot,
				expiresAtMs: this.nowMs() + CODEX_PLUGIN_METADATA_CACHE_TTL_MS
			});
			return snapshot;
		})();
		this.inFlight.set(entryKey, {
			appCacheKey: params.appCacheKey,
			promise
		});
		try {
			return await promise;
		} finally {
			if (this.inFlight.get(entryKey)?.promise === promise) this.inFlight.delete(entryKey);
		}
	}
	/** Invalidates all plugin metadata queries for one app-server runtime. */
	invalidate(appCacheKey) {
		this.generations.set(appCacheKey, (this.generations.get(appCacheKey) ?? 0) + 1);
		for (const [entryKey, entry] of this.entries) if (entry.snapshot.appCacheKey === appCacheKey) this.entries.delete(entryKey);
		for (const [entryKey, pending] of this.inFlight) if (pending.appCacheKey === appCacheKey) this.inFlight.delete(entryKey);
	}
	/** Clears snapshots and prevents late in-flight loads from repopulating them. */
	clear() {
		this.clearGeneration += 1;
		this.generations.clear();
		this.entries.clear();
		this.inFlight.clear();
	}
};
/** Shared plugin metadata cache used by Codex app-server runtime paths. */
const defaultCodexPluginMetadataCache = new CodexPluginMetadataCache();
function hasMarketplaceLoadErrors(response) {
	return response.marketplaceLoadErrors.length > 0;
}
function buildMetadataCacheEntryKey(appCacheKey, queryKind, requestParams, catalogScope) {
	if (queryKind !== "installed") {
		const listParams = requestParams;
		const entry = [
			appCacheKey,
			queryKind,
			listParams?.cwds ?? [],
			Array.from(new Set(listParams?.marketplaceKinds ?? [])).toSorted(),
			...catalogScope ? [catalogScope] : []
		];
		return JSON.stringify(entry);
	}
	const installedParams = requestParams;
	return JSON.stringify([
		appCacheKey,
		queryKind,
		installedParams?.cwds ?? [],
		Array.from(new Set(installedParams?.installSuggestionPluginNames ?? [])).toSorted()
	]);
}
//#endregion
export { runCodexComputerUseLiveTest as a, readCodexComputerUseStatus as i, ensureCodexComputerUse as n, installCodexComputerUse as r, defaultCodexPluginMetadataCache as t };
