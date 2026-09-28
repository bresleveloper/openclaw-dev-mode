import { t as createAcpxRuntimeService } from "./.setup/register.runtime-Bm4HrMCp.mjs";
import { a as ACPX_NATIVE_AGENT_IDS, o as AcpxNativeAgentsSchema, t as resolveAcpxPluginConfig } from "./.setup/config-CdPsIued.mjs";
import { a as PI_SESSIONS_CAPABILITY, c as PI_SESSION_READ_COMMAND, l as PI_TERMINAL_RESUME_COMMAND, o as PI_SESSIONS_LIST_COMMAND, r as piSessionStoreAvailable, s as PI_SESSION_ID_PATTERN } from "./.setup/pi-session-paths-CIvyk6KB.mjs";
import { createAgentRegistry } from "acpx/agent-registry";
import { tryDispatchAcpReplyHook } from "openclaw/plugin-sdk/acp-runtime-backend";
import { createLazyRuntimeModule, createLazyRuntimeSurface } from "openclaw/plugin-sdk/lazy-runtime";
import { inspectAgentModels } from "acpx/runtime";
import { finiteSecondsToTimerSafeMilliseconds } from "openclaw/plugin-sdk/number-runtime";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveNodeHostExecutable } from "openclaw/plugin-sdk/node-host";
import { createSessionCatalogNodeHostBindings } from "openclaw/plugin-sdk/session-catalog";
//#region extensions/acpx/src/native-agents.ts
function isAcpxNativeAgentEnabled(flags, agent) {
	return AcpxNativeAgentsSchema.parse(flags)?.[agent] !== false;
}
function createAcpxAgentRegistry(rawConfig) {
	const config = resolveAcpxPluginConfig({ rawConfig });
	return createAgentRegistry({ overrides: config.agents });
}
function listAcpxNativeAgents(rawConfig, agents) {
	const registry = createAcpxAgentRegistry(rawConfig);
	const enabled = AcpxNativeAgentsSchema.parse(rawConfig?.nativeAgents);
	return agents.map((agent) => ({
		...agent,
		installation: registry.inspect(agent.id)?.launch.kind ?? "unverified",
		enabled: enabled?.[agent.id] !== false
	}));
}
//#endregion
//#region extensions/acpx/src/harness.ts
const LOCAL_TOOL_REQUIREMENTS = [
	"ls",
	"read",
	"write",
	"edit",
	"exec"
];
const NATIVE_TOOL_REQUIREMENTS = {
	opencode: [
		...LOCAL_TOOL_REQUIREMENTS,
		"apply_patch",
		"web_fetch",
		"web_search",
		"sessions_spawn",
		"sessions_send",
		"ask_user"
	],
	qwen: [
		...LOCAL_TOOL_REQUIREMENTS,
		"process",
		"sessions_spawn",
		"sessions_send",
		"sessions_list",
		"subagents",
		"web_fetch",
		"web_search",
		"view_image",
		"ask_user",
		"automations",
		"image_generate"
	],
	pi: LOCAL_TOOL_REQUIREMENTS,
	kilocode: [
		...LOCAL_TOOL_REQUIREMENTS,
		"apply_patch",
		"web_fetch",
		"web_search",
		"sessions_spawn",
		"sessions_send",
		"sessions_search",
		"sessions_history",
		"memory_search",
		"memory_get",
		"message",
		"image_generate"
	],
	copilot: [
		...LOCAL_TOOL_REQUIREMENTS,
		"apply_patch",
		"process",
		"browser",
		"web_fetch",
		"web_search",
		"sessions_spawn",
		"sessions_send",
		"sessions_list",
		"sessions_search",
		"sessions_history",
		"subagents",
		"memory_search",
		"memory_get",
		"view_image",
		"ask_user"
	]
};
function createAcpAgentHarness(params) {
	const id = `acp-${params.agent}`;
	const generation = new AbortController();
	let agentRegistry;
	const inspectAgent = () => (agentRegistry ??= createAcpxAgentRegistry(params.api.pluginConfig)).inspect(params.agent);
	const runtimeFor = (workspaceDir) => params.getRuntime({
		config: params.api.config,
		workspaceDir,
		stateDir: params.api.runtime.state.resolveStateDir(),
		logger: params.api.logger
	});
	const resource = (agentId, sessionId) => `agent:${agentId}:harness:${id}:${sessionId}`;
	const retire = async (input, assertCurrent) => {
		const runtime = await runtimeFor();
		assertCurrent();
		const handle = await runtime.findSession({
			sessionKey: resource(input.agentId, input.sessionId),
			agent: params.agent,
			agentId: input.agentId
		});
		assertCurrent();
		if (handle) {
			const ownedHandle = {
				...handle,
				bridgeSession: {
					sessionKey: input.sessionKey,
					agentId: input.agentId,
					native: true
				}
			};
			await runtime.prepareFreshSession({ handle: ownedHandle });
		}
	};
	return {
		id,
		label: params.label,
		autoSelection: { providerIds: [] },
		authBootstrap: "harness",
		executionEnvironment: "host-only",
		conversationToolPolicyNativeTools: NATIVE_TOOL_REQUIREMENTS[params.agent],
		supports: ({ requestedRuntime, modelProvider }) => {
			if (!params.isEnabled()) return {
				supported: false,
				reason: `${params.label} is disabled in Models settings.`
			};
			if (requestedRuntime !== id) return {
				supported: false,
				reason: `Choose ${params.label} explicitly`
			};
			if (modelProvider?.endpointOverrides === void 0) return {
				supported: false,
				reason: "Update OpenClaw to use this native runtime."
			};
			if (modelProvider?.requestTransportOverrides === "present" || modelProvider?.endpointOverrides === "present" || modelProvider?.preparedAuth?.source === "profile" || modelProvider?.preparedAuth?.source === "direct" || modelProvider?.runtimePolicy && !modelProvider.runtimePolicy.compatibleIds.includes(id)) return {
				supported: false,
				reason: `${params.label} owns its login and cannot use an OpenClaw credential or custom provider transport`
			};
			return {
				supported: true,
				priority: 100
			};
		},
		async loadModelCatalog(input) {
			generation.signal.throwIfAborted();
			if (!params.isEnabled()) return [];
			const inspection = inspectAgent();
			if (inspection?.launch.kind !== "installed") return [];
			const config = resolveAcpxPluginConfig({
				rawConfig: params.api.pluginConfig,
				workspaceDir: input.workspaceDir
			});
			const models = await inspectAgentModels({
				agentCommand: inspection.launch.argv,
				cwd: input.workspaceDir ?? config.cwd,
				signal: generation.signal,
				timeoutMs: config.timeoutSeconds === void 0 ? void 0 : finiteSecondsToTimerSafeMilliseconds(config.timeoutSeconds) ?? 1
			});
			generation.signal.throwIfAborted();
			return (params.isEnabled() ? models?.availableModels ?? [] : []).map((model) => ({
				provider: id,
				id: model.modelId,
				name: model.name,
				nativeRuntime: id
			}));
		},
		async runAttempt(input) {
			generation.signal.throwIfAborted();
			if (!params.isEnabled()) throw new Error(`${params.label} is disabled. Enable it in Models settings to start a turn.`);
			const inspection = inspectAgent();
			if (inspection?.launch.kind !== "installed") throw new Error(`${params.label} is not installed; refresh the model catalog`);
			const runtime = await runtimeFor(input.workspaceDir);
			generation.signal.throwIfAborted();
			const { runAcpHarnessAttempt } = await import("./.setup/harness-attempt-CDXMeP5Z.mjs");
			return await runAcpHarnessAttempt({
				input,
				runtime,
				agent: params.agent,
				harnessId: id,
				label: params.label,
				command: inspection.launch.argv,
				generationSignal: generation.signal
			});
		},
		async reset(input) {
			if (input.agentId && input.sessionId && input.sessionKey) await retire({
				agentId: input.agentId,
				sessionId: input.sessionId,
				sessionKey: input.sessionKey
			}, () => generation.signal.throwIfAborted());
		},
		async withSessionDeletion(input, run) {
			let committed = false;
			try {
				return await run({
					commit: () => {
						committed = true;
					},
					rollback: () => {
						committed = false;
					}
				});
			} finally {
				if (committed) await retire(input, input.assertCurrent);
			}
		},
		async dispose() {
			generation.abort();
			await params.shutdown();
		}
	};
}
//#endregion
//#region extensions/acpx/src/pi-session-catalog-plugin.ts
const loadPiSessionCatalogModule = createLazyRuntimeModule(() => import("./.setup/pi-session-catalog-runtime-UhiQSaDw.mjs"));
function fullConfigCatalogEnabled(config) {
	if (!isRecord(config) || !isRecord(config.plugins) || !isRecord(config.plugins.entries)) return true;
	const entry = config.plugins.entries.acpx;
	if (!isRecord(entry) || !isRecord(entry.config) || !isRecord(entry.config.piSessionCatalog)) return true;
	return entry.config.piSessionCatalog.enabled !== false;
}
function isPiSessionCatalogEnabled(pluginConfig) {
	return !isRecord(pluginConfig) || !isRecord(pluginConfig.piSessionCatalog) || pluginConfig.piSessionCatalog.enabled !== false;
}
function createPiSessionNodeHostBindings() {
	const storeAvailable = ({ config, env }) => fullConfigCatalogEnabled(config) && piSessionStoreAvailable(env);
	return createSessionCatalogNodeHostBindings({
		capability: PI_SESSIONS_CAPABILITY,
		listCommand: PI_SESSIONS_LIST_COMMAND,
		readCommand: PI_SESSION_READ_COMMAND,
		terminalCommand: PI_TERMINAL_RESUME_COMMAND,
		sessionIdPattern: PI_SESSION_ID_PATTERN,
		executable: "pi",
		hasActiveWork: () => false,
		args: (threadId) => ["--session", threadId],
		listAvailable: storeAvailable,
		terminalAvailable: ({ config, env }) => storeAvailable({
			config,
			env
		}) && Boolean(resolveNodeHostExecutable("pi", {
			env,
			pathEnv: env.PATH ?? env.Path ?? "",
			strategy: "direct"
		})),
		parseParams: (paramsJSON) => {
			if (!paramsJSON) return;
			try {
				return JSON.parse(paramsJSON);
			} catch (error) {
				throw new Error("Pi session parameters must be valid JSON", { cause: error });
			}
		},
		list: async (params) => await (await loadPiSessionCatalogModule()).listPiSessions(params),
		read: async (params) => await (await loadPiSessionCatalogModule()).readPiSession(params),
		requireSession: async (threadId) => await (await loadPiSessionCatalogModule()).requireLocalPiSession(threadId),
		terminalIoRequiredMessage: "Pi terminal command requires duplex transport",
		terminalUnavailableMessage: "Pi CLI is unavailable",
		invalidThreadIdMessage: "INVALID_REQUEST: threadId is invalid"
	});
}
function registerPiSessionCatalog(api) {
	if (!isPiSessionCatalogEnabled(api.pluginConfig)) return;
	const loadCatalogRuntime = createLazyRuntimeSurface(loadPiSessionCatalogModule, (module) => module.createPiSessionCatalogRuntime(api));
	api.registerSessionCatalog({
		id: "pi",
		label: "Pi",
		supportsProcessHomeIsolation: true,
		list: async (query) => await (await loadCatalogRuntime()).list(query),
		read: async (request) => await (await loadCatalogRuntime()).read(request),
		continueSession: async (request) => await (await loadCatalogRuntime()).continueSession(request),
		checkUpstreamActivity: async (probes, policy) => await (await loadCatalogRuntime()).checkUpstreamActivity(probes, policy),
		openTerminal: async (request) => await (await loadCatalogRuntime()).openTerminal(request)
	});
	const nodeHost = createPiSessionNodeHostBindings();
	for (const command of nodeHost.commands) api.registerNodeHostCommand(command);
	for (const policy of nodeHost.policies) api.registerNodeInvokePolicy(policy);
}
//#endregion
//#region extensions/acpx/index.ts
/**
* ACPX runtime plugin entry. It registers the embedded ACP backend service and
* wires reply-dispatch hooks into the plugin SDK runtime.
*/
const plugin = {
	id: "acpx",
	name: "ACPX Runtime",
	description: "Embedded ACP runtime backend with plugin-owned session and transport management.",
	register(api) {
		registerPiSessionCatalog(api);
		const service = createAcpxRuntimeService({
			pluginConfig: api.pluginConfig,
			getAllowedAgents: () => api.runtime.config.current().acp?.allowedAgents,
			openKeyedStore: (options) => api.runtime.state.openKeyedStore(options)
		});
		api.registerService(service);
		const currentConfig = () => api.runtime.config.current().plugins?.entries?.acpx?.config;
		const registry = createAgentRegistry();
		const nativeAgents = ACPX_NATIVE_AGENT_IDS.map((agentId) => {
			const agent = registry.inspect(agentId);
			if (!agent) throw new Error(`Unknown ACP harness: ${agentId}`);
			api.registerAgentHarness(createAcpAgentHarness({
				agent: agentId,
				label: agent.name,
				isEnabled: () => isAcpxNativeAgentEnabled(currentConfig()?.nativeAgents, agentId),
				api,
				getRuntime: service.getRuntime,
				shutdown: () => service.stop?.({
					config: api.config,
					stateDir: api.runtime.state.resolveStateDir(),
					logger: api.logger
				})
			}));
			return {
				id: agentId,
				name: agent.name,
				runtimeId: `acp-${agentId}`
			};
		});
		api.registerReload({ noopPrefixes: ["plugins.entries.acpx.config.nativeAgents"] });
		api.registerGatewayMethod("acpx.agents.list", ({ params, respond }) => {
			if (Object.keys(params).length > 0) {
				respond(false, void 0, {
					code: "INVALID_REQUEST",
					message: "acpx.agents.list takes no parameters"
				});
				return;
			}
			respond(true, { agents: listAcpxNativeAgents(currentConfig(), nativeAgents) }, void 0);
		}, {
			scope: "operator.read",
			profileAccess: "independent"
		});
		api.on("reply_dispatch", tryDispatchAcpReplyHook, { eligibleDispatchKinds: ["acp"] });
	}
};
//#endregion
export { plugin as default };
