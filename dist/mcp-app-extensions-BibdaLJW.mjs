import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { Dr as ZodError, Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, or as union } from "./schemas-BOYIvvln.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CfLPTM0e.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { n as readMcpAppSettings } from "./mcp-app-extension-metadata-moidhg1Q.mjs";
import { i as resolveProjectedMcpCodexToolApprovalMode, r as requiresMcpCodexToolApproval } from "./mcp-codex-tool-approval-DQZI_si1.mjs";
import { n as runWithSessionMcpRequestSignal } from "./agent-bundle-mcp-request-context-SqXfuSsz.mjs";
import { n as acquireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-CsCOZa1-.mjs";
import { f as releaseSessionMcpRuntime } from "./mcp-app-model-context-XPQPOrco.mjs";
import { t as loadSessionMcpConfig } from "./agent-bundle-mcp-runtime-config-4IdPhrfp.mjs";
import { n as normalizeMcpToolFilter, t as isMcpToolAllowed } from "./mcp-tool-filter-BiXzv8v3.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BPRn5nuX.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BUEqtPpd.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-D8EQIzja.mjs";
import { s as resolveEffectiveAgentRuntime } from "./thinking-runtime-BwS3HC5I.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-DEC0Rqn3.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-Dk4uhhe-.mjs";
import { t as buildBundleMcpToolsFromCatalog } from "./agent-bundle-mcp-materialize-B6mbiMBw.mjs";
import { i as getMcpAppViewLease, n as buildMcpAppCanvasPayload, r as fetchMcpAppView } from "./mcp-ui-resource-BFfH0TzA.mjs";
import { t as resolveSessionSelectedModelRef } from "./session-utils-model-selection-Bxzwl80r.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { t as iteratePluginRootContributions } from "./plugin-root-contributions-DmkAOBDy.mjs";
import { l as resolveMcpAppRequesterId, n as callMcpAppToolWithElicitation } from "./mcp-app-operations-DaVYytwK.mjs";
import { t as resolveSessionResourceToolPolicy } from "./session-resource-tool-policy-Ct8eb4ab.mjs";
import { r as prepareMcpAppHostFile } from "./mcp-app-host-files-3AWhbtP9.mjs";
import { t as requestMcpAppToolApproval } from "./mcp-app-tool-approval-BpE0cnA9.mjs";
import { randomUUID } from "node:crypto";
import { ResourceLinkSchema } from "@modelcontextprotocol/sdk/types.js";
//#region src/gateway/mcp-app-extension-runtime.ts
function runtimeSelection(entry, model, harnessId) {
	return JSON.stringify([
		resolveSessionPinnedHarnessId(entry),
		model.provider,
		model.model,
		harnessId,
		entry.agentRuntimeOverride,
		entry.modelSelectionLocked,
		entry.providerOverride,
		entry.modelOverride,
		entry.authProfileOverride,
		entry.authProfileOverrideSource,
		entry.sandboxMode
	]);
}
/** A request borrows the current owner; it never substitutes a different native transport. */
async function prepareMcpAppExtensionRuntime(options) {
	const access = options.sessionAccessAuthority;
	const projection = getSessionRowProjection(options.context);
	if (!access || !projection) throw new Error("MCP App session authority is unavailable");
	access.assertCurrent();
	const { agentId, sessionKey, sessionId } = access.target;
	const query = {
		agentId,
		key: sessionKey
	};
	const initial = projection.sharingTarget(query);
	if (!initial || initial.entry.sessionId !== sessionId) throw new Error("MCP App session changed");
	const cfg = options.context.getRuntimeConfig();
	if (cfg.mcp?.apps?.enabled !== true) throw new Error("MCP Apps are disabled");
	const selectRuntime = (entry) => {
		const model = resolveSessionSelectedModelRef({
			cfg,
			agentId,
			sessionKey,
			source: {
				entry,
				readSourceEntry: (key) => projection.sharingTarget({
					agentId,
					key
				})?.entry
			},
			manifestPlugins: getGatewayPluginMetadataSnapshot() ?? []
		});
		const harnessId = resolveEffectiveAgentRuntime({
			cfg,
			provider: model.provider,
			modelId: model.model,
			agentScope: {
				kind: "prepared",
				agentId
			},
			sessionKey,
			sessionEntry: entry
		});
		return {
			model,
			harnessId,
			fingerprint: runtimeSelection(entry, model, harnessId)
		};
	};
	const selected = selectRuntime(initial.entry);
	const current = (assertAccess = access.assertCurrent) => {
		assertAccess();
		if (options.context.getRuntimeConfig() !== cfg) throw new Error("MCP App configuration changed; reopen the App");
		const target = projection.sharingTarget(query);
		if (!target || target.entry.sessionId !== sessionId) throw new Error("MCP App session changed");
		if (selectRuntime(target.entry).fingerprint !== selected.fingerprint) throw new Error("MCP App session runtime selection changed; reopen the App");
		return target;
	};
	const target = current();
	const workspaceDir = target.entry.spawnedWorkspaceDir ?? resolveAgentWorkspaceDir(cfg, agentId);
	const requesterId = resolveMcpAppRequesterId(options.client);
	const { model: selectedModel, harnessId } = selected;
	const registered = harnessId ? getRegisteredAgentHarness(harnessId) : void 0;
	if (harnessId !== "openclaw" && !registered) throw new Error("The selected session harness is unavailable");
	const harness = registered?.harness;
	const { loaded } = loadSessionMcpConfig({
		workspaceDir,
		cfg,
		toolOverrides: target.entry.toolOverrides
	});
	let lease;
	if (harnessId !== "openclaw") {
		if (!harness?.loadMcpToolCatalog || !harness.acquireMcpAppRuntime) throw new Error("The session harness cannot open MCP Apps");
		const preparationOwner = {};
		let preparing;
		const prepareSession = () => {
			preparing ??= (async () => {
				current();
				const isolation = resolveSandboxRuntimeStatus({
					cfg,
					agentId,
					sessionKey,
					preparedSessionEntry: current().entry
				});
				if (access.sandboxRequired || isolation.sandboxed || isolation.sandboxRequired) throw new Error("Native App initialization cannot run outside required session isolation");
				if (!registered?.ownerPluginId) throw new Error("Native harness owner is unavailable");
				const retained = access.retain();
				preparationOwner.access = retained;
				const signal = options.signal ? AbortSignal.any([retained.signal, options.signal]) : retained.signal;
				const assertPreparationCurrent = () => {
					current();
					retained.assertCurrent();
					signal.throwIfAborted();
				};
				assertPreparationCurrent();
				const source = await captureGatewayOperatorRunAuthority({
					client: options.client,
					context: options.context,
					hasCurrentClientAuthority: options.hasCurrentClientAuthority,
					invocationAuthority: {
						assertCurrent: assertPreparationCurrent,
						signal
					}
				});
				preparationOwner.source = source;
				assertPreparationCurrent();
				const live = current();
				const { prepareAgentHarnessSessionRuntime } = await import("./session-preparation-Bpn4f9QT.mjs");
				const setup = await prepareAgentHarnessSessionRuntime({
					ownerPluginId: registered.ownerPluginId,
					nativeModelPolicySupport: harness.nativeModelPolicySupport,
					sourceAuthority: source?.authority,
					assertCurrent: assertPreparationCurrent,
					input: {
						config: cfg,
						agentId,
						agentDir: resolveAgentDir(cfg, agentId),
						sessionId,
						sessionKey,
						workspaceDir,
						provider: selectedModel.provider,
						modelId: selectedModel.model,
						authProfileId: live.entry.authProfileOverride,
						authProfileIdSource: live.entry.authProfileOverrideSource === "auto" ? "auto" : live.entry.authProfileOverride ? "user" : void 0,
						senderId: requesterId,
						messageChannel: "webchat",
						messageProvider: "webchat",
						abortSignal: signal,
						permissionMode: live.entry.permissionMode,
						sessionRoot: live.entry.sessionRoot,
						toolOverrides: live.entry.toolOverrides,
						spawnedBy: live.entry.spawnedBy,
						groupId: live.entry.groupId,
						groupChannel: live.entry.groupChannel,
						groupSpace: live.entry.space,
						sessionTarget: {
							agentId,
							sessionId,
							sessionKey,
							storePath: live.storePath,
							expectedLifecycleRevision: live.entry.lifecycleRevision
						}
					}
				});
				preparationOwner.setup = setup;
				assertPreparationCurrent();
				return setup.preparation;
			})();
			return preparing;
		};
		try {
			lease = await harness.acquireMcpAppRuntime({
				config: cfg,
				agentId,
				sessionId,
				sessionKey,
				workspaceDir,
				mcpServerNames: Object.keys(loaded.mcpServers),
				toolOverrides: target.entry.toolOverrides,
				assertCurrent: access.assertCurrent,
				appRequester: requesterId ? {
					kind: "gateway-profile",
					profileId: requesterId
				} : void 0,
				prepareSession
			});
		} finally {
			try {
				preparationOwner.setup?.dispose();
			} finally {
				try {
					preparationOwner.source?.release();
				} finally {
					preparationOwner.access?.release();
				}
			}
		}
	} else lease = await acquireSessionMcpRuntime({
		sessionId,
		sessionKey,
		workspaceDir,
		agentDir: resolveAgentDir(cfg, agentId),
		cfg,
		requesterSenderId: requesterId,
		messageChannel: "webchat",
		toolOverrides: target.entry.toolOverrides
	});
	if (!lease) throw new Error("Open a conversation with this plugin before launching its App");
	const acquired = lease;
	const runtime = acquired.runtime;
	const approvalReleases = [];
	try {
		current();
		const listed = await runtime.getCatalog();
		const catalog = {
			...listed,
			servers: Object.fromEntries(Object.entries(listed.servers).map(([name, server]) => [name, {
				...server,
				pluginId: server.pluginId ?? loaded.pluginIdsByServer?.[name]
			}]))
		};
		current();
		const projected = buildBundleMcpToolsFromCatalog({
			catalog,
			includeAppOnlyInventory: true
		});
		const names = new Map(projected.flatMap((tool) => {
			const mcp = getPluginToolMeta(tool)?.mcp;
			return mcp?.operation === "tool" ? [[JSON.stringify([mcp.serverName, mcp.toolName]), tool.name]] : [];
		}));
		const assertTool = (tool, interaction = false, assertAccess = access.assertCurrent) => {
			const live = current(assertAccess);
			if (options.context.getRuntimeConfig().mcp?.apps?.enabled !== true) throw new Error("MCP Apps are disabled");
			const rawServer = loaded.mcpServers[tool.serverName];
			if (!rawServer && !(runtime.assertOwnerCurrent && catalog.servers[tool.serverName]?.pluginId) || rawServer && !isMcpToolAllowed(normalizeMcpToolFilter(rawServer.toolFilter), tool.toolName)) throw new Error("MCP App tool is denied by server policy");
			const name = names.get(JSON.stringify([tool.serverName, tool.toolName]));
			if (!name || live.entry.toolOverrides?.mcpServers?.[tool.serverName] === false || live.entry.toolOverrides?.mcpToolsDeny?.[tool.serverName]?.includes(tool.toolName)) throw new Error("MCP App tool is denied");
			resolveSessionResourceToolPolicy({
				config: options.context.getRuntimeConfig(),
				client: options.client,
				current: live,
				readPreparedSessionEntry: (source) => projection.sharingTarget(source)?.entry,
				toolName: name,
				assertNativeRuntimeCurrent: runtime.assertOwnerCurrent
			});
			return interaction && requiresMcpCodexToolApproval({
				mode: (rawServer ? resolveProjectedMcpCodexToolApprovalMode(tool.serverName, rawServer) : "prompt") ?? catalog.servers[tool.serverName]?.codexApprovalMode,
				fullPermission: live.entry.permissionMode === "full",
				annotations: tool.codexAnnotations
			});
		};
		const approveTool = async (tool, input) => {
			const required = assertTool(tool, true);
			if (required) {
				const retained = access.retain();
				approvalReleases.push(retained.release);
				await requestMcpAppToolApproval({
					options,
					agentId,
					sessionKey,
					serverName: tool.serverName,
					toolName: tool.toolName,
					input,
					signal: retained.signal,
					assertCurrent: () => {
						retained.assertCurrent();
						assertTool(tool, true);
					}
				});
			}
			const assertExecutionCurrent = () => {
				if (assertTool(tool, true) && !required) throw new Error("MCP App approval policy changed before execution");
			};
			assertExecutionCurrent();
			return assertExecutionCurrent;
		};
		const tools = catalog.tools.filter((tool) => {
			try {
				assertTool(tool);
				return true;
			} catch {
				return false;
			}
		});
		const retainViewAuthority = (viewTools) => {
			const retained = access.retain();
			const prepareToolCall = async (request) => {
				const tool = viewTools.find((candidate) => candidate.toolName === request.toolName);
				if (!tool) throw new Error("MCP App tool is not granted to this view");
				const assertCurrent = () => {
					request.assertCurrent();
					retained.assertCurrent();
					assertTool(tool, false, retained.assertCurrent);
				};
				assertCurrent();
				const approvalRequired = assertTool(tool, true, retained.assertCurrent);
				if (approvalRequired) await requestMcpAppToolApproval({
					options: request.options,
					agentId,
					sessionKey,
					serverName: tool.serverName,
					toolName: tool.toolName,
					input: request.input,
					view: request.view,
					requesterId: resolveMcpAppRequesterId(request.options.client),
					assertCurrent,
					signal: request.signal ? AbortSignal.any([retained.signal, request.signal]) : retained.signal
				});
				const assertExecutionCurrent = () => {
					assertCurrent();
					if (assertTool(tool, true, retained.assertCurrent) && !approvalRequired) throw new Error("MCP App approval policy changed before execution");
				};
				assertExecutionCurrent();
				return assertExecutionCurrent;
			};
			return {
				...retained,
				prepareToolCall,
				assertCurrent: () => {
					retained.assertCurrent();
					if (current(retained.assertCurrent).entry.permissionMode !== target.entry.permissionMode) throw new Error("MCP App permission mode changed; reopen the App");
					for (const tool of viewTools) assertTool(tool, false, retained.assertCurrent);
				}
			};
		};
		return {
			approveTool,
			retainViewAuthority,
			options,
			runtime,
			catalog: {
				...catalog,
				tools
			},
			agentId,
			sessionKey,
			sessionId,
			workspaceDir,
			requesterId,
			access,
			assertTool,
			assertCurrent: () => {
				current();
			},
			dispose: async () => {
				for (const release of approvalReleases.splice(0)) release();
				await releaseSessionMcpRuntime(acquired);
				await runtime.joinCleanup?.();
			}
		};
	} catch (error) {
		for (const release of approvalReleases.splice(0)) release();
		await releaseSessionMcpRuntime(lease);
		throw error;
	}
}
//#endregion
//#region src/gateway/server-methods/mcp-app-extensions.ts
var UnsupportedMcpMentionResultError = class extends Error {};
const text = string().trim().min(1).max(2048);
const targetSchema = object({
	sessionKey: text,
	agentId: text.optional()
});
const launchSchema = targetSchema.extend({
	serverName: text,
	toolName: text,
	entrypointType: _enum([
		"global",
		"thread",
		"file",
		"settings"
	]),
	quickAction: boolean().optional(),
	filePath: text.optional(),
	deepLink: text.optional()
});
const settingsSchema = targetSchema.extend({
	serverName: text,
	action: _enum([
		"read",
		"update",
		"tool"
	]),
	toolName: text.optional(),
	arguments: object({ set: record(string(), union([
		string(),
		number().finite(),
		boolean()
	])) }).optional()
});
const mentionSchema = targetSchema.extend({
	serverName: text,
	query: string().max(2048)
});
function toolFor(active, serverName, toolName) {
	const tool = active.catalog.tools.find((candidate) => candidate.serverName === serverName && candidate.toolName === toolName);
	if (!tool) throw new Error("MCP App tool is unavailable or denied");
	active.assertTool(tool);
	return tool;
}
function appToolsFor(active, serverName) {
	return active.catalog.tools.filter((candidate) => {
		if (candidate.serverName !== serverName || candidate.uiVisibility !== void 0 && !candidate.uiVisibility.includes("app")) return false;
		try {
			active.assertTool(candidate);
			return true;
		} catch {
			return false;
		}
	});
}
async function uploadFor(active, serverName, assertCurrent) {
	const { prepareMcpAppFormUpload } = await import("./mcp-form-resource-upload-BC6dJjq0.mjs");
	return await prepareMcpAppFormUpload({
		runtime: active.runtime,
		serverName,
		agentId: active.agentId,
		sessionKey: active.sessionKey,
		requesterId: active.requesterId,
		assertCurrent
	});
}
async function call(active, tool, input) {
	const assertCurrent = await active.approveTool(tool, input);
	const formAuthority = active.retainViewAuthority(appToolsFor(active, tool.serverName));
	let result;
	try {
		result = await callMcpAppToolWithElicitation({
			options: active.options,
			uploadResources: await uploadFor(active, tool.serverName, assertCurrent),
			origin: {
				runtime: active.runtime,
				serverName: tool.serverName,
				agentId: active.agentId,
				sessionKey: active.sessionKey,
				requesterId: active.requesterId,
				assertCurrent,
				prepareToolCall: formAuthority.prepareToolCall
			},
			toolName: tool.toolName,
			input,
			assertCurrent
		});
	} finally {
		formAuthority.release();
	}
	active.assertCurrent();
	return result;
}
async function launch(active, tool, input, extra) {
	if (!tool.uiResourceUri?.startsWith("ui://")) throw new Error("MCP App resource is unavailable");
	const result = await call(active, tool, input);
	if (result.isError) return { toolResult: result };
	const viewTools = appToolsFor(active, tool.serverName);
	const retained = active.retainViewAuthority(viewTools);
	let transferred = false;
	try {
		const viewRuntime = active.runtime;
		const allowedAppToolNames = new Set(viewTools.map((candidate) => candidate.toolName));
		const view = await fetchMcpAppView({
			runtime: viewRuntime,
			agentId: active.agentId,
			serverName: tool.serverName,
			toolName: tool.toolName,
			uiResourceUri: tool.uiResourceUri,
			toolCallId: randomUUID(),
			toolInput: input,
			toolResult: result,
			allowedAppToolNames,
			requesterId: active.requesterId,
			displayMode: tool.appExtensions?.preferredModelDisplayMode,
			prepareToolCall: retained.prepareToolCall,
			uploadResources: await uploadFor(active, tool.serverName, retained.assertCurrent),
			...extra,
			authorizeAppInteraction: () => {
				retained.assertCurrent();
				return true;
			}
		});
		if (!view) throw new Error("MCP App resource could not be loaded");
		const preview = buildMcpAppCanvasPayload({
			...view,
			originSessionKey: active.sessionKey
		});
		active.assertCurrent();
		const lease = getMcpAppViewLease(view.viewId, viewRuntime);
		if (lease) {
			lease.disposeCallbacks ??= /* @__PURE__ */ new Set();
			lease.disposeCallbacks.add(retained.release);
			transferred = true;
		}
		return {
			viewId: view.viewId,
			preview
		};
	} finally {
		if (!transferred) retained.release();
	}
}
function handler(schema, operation, disabledResult) {
	return async (options) => {
		let active;
		try {
			const params = schema.parse(options.params);
			if (disabledResult && options.context.getRuntimeConfig().mcp?.apps?.enabled !== true) {
				options.sessionAccessAuthority?.assertCurrent();
				options.respond(true, disabledResult);
				return;
			}
			await runWithSessionMcpRequestSignal(options.signal, async () => {
				active = await prepareMcpAppExtensionRuntime(options);
				const result = await operation(active, params);
				active.assertCurrent();
				options.respond(true, result);
			});
		} catch (error) {
			options.respond(false, void 0, errorShape(error instanceof ZodError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : String(error), error instanceof UnsupportedMcpMentionResultError ? { details: { code: "MCP_APP_UNSUPPORTED_MENTION_RESULT" } } : void 0));
		} finally {
			await active?.dispose().catch((error) => logWarn(`mcp-app: cleanup failed: ${String(error)}`));
		}
	};
}
const mcpAppExtensionHandlers = {
	"mcp.app.discover": handler(targetSchema, (active) => ({
		onboarding: (() => {
			const metadata = getGatewayPluginMetadataSnapshot();
			return metadata ? [...iteratePluginRootContributions({
				metadataSnapshot: metadata,
				config: active.options.context.getRuntimeConfig(),
				contribution: "skills"
			})].flatMap(({ record }) => record.onboardingSkill ? [{
				pluginId: record.id,
				title: record.name ?? record.id
			}] : []) : [];
		})(),
		servers: Object.values(active.catalog.servers).flatMap((server) => {
			const install = server.pluginId ? getGatewayPluginMetadataSnapshot()?.index.installRecords[server.pluginId] : void 0;
			const pluginId = install?.marketplacePlugin ?? server.pluginId;
			const marketplace = install?.marketplaceName ?? server.marketplace;
			const tools = active.catalog.tools.filter((tool) => tool.serverName === server.serverName);
			const entrypoints = tools.flatMap((tool) => tool.uiResourceUri?.startsWith("ui://") ? (tool.appExtensions?.entrypoints ?? []).map((entrypoint) => ({
				toolName: tool.toolName,
				title: tool.title ?? tool.toolName,
				resourceUri: tool.uiResourceUri,
				icons: tool.appExtensions?.icons ?? server.icons,
				entrypoint
			})) : []);
			const settings = server.settings && tools.some((tool) => tool.toolName === server.settings?.readTool) && tools.some((tool) => tool.toolName === server.settings?.updateTool) ? server.settings : void 0;
			const mentionTool = tools.find((tool) => tool.appExtensions?.mentionSearch)?.toolName;
			return entrypoints.length || settings || mentionTool ? [{
				serverName: server.serverName,
				...pluginId ? { pluginId } : {},
				...marketplace ? { marketplace } : {},
				label: server.title ?? server.serverName,
				icons: server.icons,
				entrypoints,
				...settings ? { settings } : {},
				...mentionTool ? { mentionTool } : {}
			}] : [];
		})
	}), {
		servers: [],
		onboarding: []
	}),
	"mcp.app.launch": handler(launchSchema, async (active, params) => {
		const tool = toolFor(active, params.serverName, params.toolName);
		const entrypoint = tool.appExtensions?.entrypoints?.find((entry) => entry.type === params.entrypointType);
		if (!entrypoint) throw new Error("The requested MCP App entrypoint is not advertised");
		if (params.quickAction) {
			if (entrypoint.type !== "global" || !entrypoint.quickAction) throw new Error("MCP App quick action is unavailable");
			const action = entrypoint.quickAction.target;
			const actionTool = toolFor(active, params.serverName, action.name);
			return actionTool.uiResourceUri ? launch(active, actionTool, action.arguments ?? {}) : { toolResult: await call(active, actionTool, action.arguments ?? {}) };
		}
		if (entrypoint.type === "file") {
			if (!params.filePath) throw new Error("Choose a session file to open");
			const hostFile = await prepareMcpAppHostFile(active.options, {
				sessionKey: active.sessionKey,
				agentId: active.agentId,
				path: params.filePath
			});
			active.assertCurrent();
			if (!entrypoint.extensions.some((extension) => hostFile.name.toLowerCase().endsWith(extension.toLowerCase()))) throw new Error("The file extension is not supported by this App");
			return await launch(active, tool, { file: {
				name: hostFile.name,
				resourceUri: hostFile.resourceUri
			} }, { hostFile });
		}
		if (params.deepLink && (entrypoint.type !== "global" || !params.deepLink.startsWith("/") || params.deepLink.startsWith("//") || params.deepLink.includes("#"))) throw new Error("Invalid App-relative deep link");
		return await launch(active, tool, {}, params.deepLink ? { deepLink: { url: params.deepLink } } : void 0);
	}),
	"mcp.app.settings": handler(settingsSchema, async (active, params) => {
		const capability = active.catalog.servers[params.serverName]?.settings;
		if (!capability) throw new Error("Structured MCP settings are unavailable");
		if (params.action === "update") {
			if (!params.arguments) throw new Error("Changed settings are required");
			return { toolResult: await call(active, toolFor(active, params.serverName, capability.updateTool), params.arguments) };
		}
		const result = await call(active, toolFor(active, params.serverName, capability.readTool), {});
		if (result.isError) throw new Error("The MCP settings read tool failed");
		const settings = readMcpAppSettings(result.structuredContent);
		if (params.action === "read") return settings;
		if (!settings.layout?.some((group) => group.items.some((item) => item.kind === "tool" && item.tool === params.toolName))) throw new Error("Settings action is not advertised in the current layout");
		const tool = toolFor(active, params.serverName, params.toolName);
		return tool.uiResourceUri ? launch(active, tool, {}) : { toolResult: await call(active, tool, {}) };
	}),
	"mcp.app.mention": handler(mentionSchema, async (active, params) => {
		const tool = active.catalog.tools.find((candidate) => candidate.serverName === params.serverName && candidate.appExtensions?.mentionSearch);
		if (!tool) throw new Error("MCP mention search is unavailable");
		const result = await call(active, tool, { query: params.query });
		if (result.isError) throw new Error("MCP mention search failed");
		const resources = array(ResourceLinkSchema).max(200).safeParse(asOptionalRecord(result.structuredContent)?.items);
		if (!resources.success) throw new UnsupportedMcpMentionResultError("This app returned an unsupported resource list");
		return { resources: resources.data };
	})
};
//#endregion
export { mcpAppExtensionHandlers };
