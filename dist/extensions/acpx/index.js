import { g as AcpxNativeAgentsSchema, h as ACPX_NATIVE_AGENT_IDS, t as resolveAcpxPluginConfig } from "./.setup/config-Cj99mN1O.mjs";
import { a as PI_SESSIONS_CAPABILITY, c as PI_SESSION_READ_COMMAND, l as PI_TERMINAL_RESUME_COMMAND, o as PI_SESSIONS_LIST_COMMAND, r as piSessionStoreAvailable, s as PI_SESSION_ID_PATTERN } from "./.setup/pi-session-paths-pUr6hnVA.mjs";
import { createAgentRegistry } from "acpx/agent-registry";
import { getAcpRuntimeBackend, registerAcpRuntimeBackend, requireAcpRuntimeBackend, tryDispatchAcpReplyHook, unregisterAcpRuntimeBackend } from "openclaw/plugin-sdk/acp-runtime-backend";
import { createLazyRuntimeMethodBinder, createLazyRuntimeModule, createLazyRuntimeSurface } from "openclaw/plugin-sdk/lazy-runtime";
import { finiteSecondsToTimerSafeMilliseconds } from "openclaw/plugin-sdk/number-runtime";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveNodeHostExecutable } from "openclaw/plugin-sdk/node-host";
import { createSessionCatalogNodeHostBindings } from "openclaw/plugin-sdk/session-catalog";
// extensions/acpx/src/native-agents.ts
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
// extensions/acpx/src/harness.ts
const LOCAL_TOOL_REQUIREMENTS = [
	"ls",
	"read",
	"write",
	"edit",
	"exec"
];
const NATIVE_TOOL_REQUIREMENTS = {
	"grok-build": [
		...LOCAL_TOOL_REQUIREMENTS,
		"apply_patch",
		"process",
		"web_fetch",
		"web_search",
		"x_search",
		"sessions_spawn",
		"sessions_send",
		"subagents",
		"memory_search",
		"memory_get",
		"skills_read",
		"view_image",
		"pdf",
		"ask_user",
		"automations",
		"update_goal",
		"image_generate",
		"video_generate"
	],
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
	],
	qoder: [
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
		"image_generate",
		"video_generate"
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
			if (!params.isEnabled()) return { entries: [] };
			const inspection = inspectAgent();
			if (inspection?.launch.kind !== "installed") return { entries: [] };
			const config = resolveAcpxPluginConfig({
				rawConfig: params.api.pluginConfig,
				workspaceDir: input.workspaceDir
			});
			try {
				const { inspectAgentModels } = await import("acpx/runtime");
				const models = await inspectAgentModels({
					agentCommand: inspection.launch.argv,
					cwd: input.workspaceDir ?? config.cwd,
					signal: generation.signal,
					agentProcessEnvAllow: config.agentProcessEnvAllow,
					agentProcessEnvBlock: config.agentProcessEnvBlock,
					timeoutMs: config.timeoutSeconds === void 0 ? void 0 : finiteSecondsToTimerSafeMilliseconds(config.timeoutSeconds) ?? 1
				});
				generation.signal.throwIfAborted();
				return {
					entries: (models?.availableModels ?? []).map((model) => ({
						provider: id,
						id: model.modelId,
						name: model.name,
						nativeRuntime: id
					})),
					outcomes: [{
						provider: id,
						status: "ready"
					}]
				};
			} catch (error) {
				generation.signal.throwIfAborted();
				const authRequired = error instanceof Error && error.name === "RequestError" && "code" in error && error.code === -32e3 && (error.message === "Authentication required" || error.message.startsWith("Authentication required: "));
				return {
					entries: [],
					outcomes: [{
						provider: id,
						status: authRequired ? "auth-rejected" : "unavailable",
						rejectionScope: "catalog"
					}]
				};
			}
		},
		async runAttempt(input) {
			generation.signal.throwIfAborted();
			if (!params.isEnabled()) throw new Error(`${params.label} is disabled. Enable it in Models settings to start a turn.`);
			const inspection = inspectAgent();
			if (inspection?.launch.kind !== "installed") throw new Error(`${params.label} is not installed; refresh the model catalog`);
			const runtime = await runtimeFor(input.workspaceDir);
			generation.signal.throwIfAborted();
			const { runAcpHarnessAttempt } = await import("./.setup/harness-attempt-Co9oLpPg.mjs");
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
			const { createNativeSessionCommitFinalizer } = await import("openclaw/plugin-sdk/agent-harness-session-runtime");
			let committed = false;
			try {
				return await run(createNativeSessionCommitFinalizer({
					commit: () => {
						committed = true;
					},
					rollback: () => {
						committed = false;
					}
				}));
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
// extensions/acpx/src/pi-session-catalog-plugin.ts
const loadPiSessionCatalogModule = createLazyRuntimeModule(() => import("./.setup/pi-session-catalog-runtime-DE_SJqtO.mjs"));
function fullConfigCatalogEnabled(config) {
	if (!isRecord(config) || !isRecord(config.plugins) || !isRecord(config.plugins.entries)) return true;
	const entry = config.plugins.entries.acpx;
	return isPiSessionCatalogEnabled(isRecord(entry) ? entry.config : void 0);
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
// extensions/acpx/src/runtime-proxy.ts
/** Start an ACP turn through a lazy runtime resolver without awaiting resolution up front. */
function lazyStartRuntimeTurn(resolveRuntime, input) {
	const turnPromise = resolveRuntime().then((runtime) => runtime.startTurn(input));
	return {
		requestId: input.requestId,
		get promptStarted() {
			return turnPromise.then((turn) => turn.promptStarted);
		},
		events: { async *[Symbol.asyncIterator]() {
			yield* (await turnPromise).events;
		} },
		result: turnPromise.then((turn) => turn.result),
		cancel(inputArgs) {
			return turnPromise.then((turn) => turn.cancel(inputArgs));
		},
		closeStream(inputArgs) {
			return turnPromise.then((turn) => turn.closeStream(inputArgs));
		}
	};
}
/** Create an ACP runtime facade backed by an async runtime resolver. */
function createLazyAcpRuntimeProxy(resolveRuntime) {
	const bind = createLazyRuntimeMethodBinder(resolveRuntime);
	return {
		ownerAwareSessions: 1,
		findSession: bind((runtime) => runtime.findSession.bind(runtime)),
		shutdown: bind((runtime) => runtime.shutdown.bind(runtime)),
		ensureSession: bind((runtime) => runtime.ensureSession.bind(runtime)),
		startTurn(input) {
			return lazyStartRuntimeTurn(resolveRuntime, input);
		},
		async *runTurn(input) {
			yield* (await resolveRuntime()).runTurn(input);
		},
		getCapabilities: bind((runtime) => runtime.getCapabilities.bind(runtime)),
		getStatus: bind((runtime) => runtime.getStatus.bind(runtime)),
		setMode: bind((runtime) => runtime.setMode.bind(runtime)),
		setModel: bind((runtime) => runtime.setModel.bind(runtime)),
		setConfigOption: bind((runtime) => runtime.setConfigOption.bind(runtime)),
		doctor: bind((runtime) => runtime.doctor.bind(runtime)),
		prepareFreshSession: bind((runtime) => runtime.prepareFreshSession.bind(runtime)),
		cancel: bind((runtime) => runtime.cancel.bind(runtime)),
		close: bind((runtime) => runtime.close.bind(runtime))
	};
}
// extensions/acpx/index.ts
const ACPX_BACKEND_ID = "acpx";
const loadServiceModule = createLazyRuntimeModule(() => import("./.setup/service-BHdFJWm2.mjs"));
function unregisterOwnedRuntime(runtime) {
	if (runtime && getAcpRuntimeBackend(ACPX_BACKEND_ID)?.runtime === runtime) unregisterAcpRuntimeBackend(ACPX_BACKEND_ID);
}
const plugin = {
	id: "acpx",
	name: "ACPX Runtime",
	description: "Embedded ACP runtime backend with plugin-owned session and transport management.",
	register(api) {
		registerPiSessionCatalog(api);
		const pluginConfig = api.pluginConfig;
		let ctx = null;
		let published = false;
		let lifecycleRevision = 0;
		let ownedRuntime = null;
		let realService = null;
		let startPromise = null;
		let stopPromise = null;
		async function startRealService(expectedRevision, deferredRuntime, purpose = "gateway", probeAtStartup = purpose === "gateway") {
			if (lifecycleRevision !== expectedRevision || !ctx) throw new Error("ACPX runtime service is not started");
			if (startPromise) return await startPromise;
			const activeContext = ctx;
			let starting = true;
			startPromise = (async () => {
				let publishedRuntime = null;
				const { createAcpxRuntimeService: createAcpxRuntimeServiceLocal } = await loadServiceModule();
				const activeService = createAcpxRuntimeServiceLocal({
					pluginConfig,
					getAllowedAgents: () => api.runtime.config.current().acp?.allowedAgents,
					openKeyedStore: (options) => api.runtime.state.openKeyedStoreV2(options),
					probeAtStartup,
					startupPurpose: purpose,
					assertCurrent: () => {
						if (lifecycleRevision !== expectedRevision || ctx !== activeContext || published && getAcpRuntimeBackend(ACPX_BACKEND_ID)?.runtime !== ownedRuntime) throw new Error("ACPX runtime service lost recovery ownership");
					},
					backendLifecycle: {
						publish(backend) {
							if (lifecycleRevision !== expectedRevision || ctx !== activeContext) throw new Error("ACPX runtime service stopped during activation");
							if (published && getAcpRuntimeBackend(ACPX_BACKEND_ID)?.runtime !== deferredRuntime) throw new Error("ACPX runtime service lost registry ownership during activation");
							if (published) {
								const { healthy } = backend;
								registerAcpRuntimeBackend({
									id: ACPX_BACKEND_ID,
									...backend,
									runtime: deferredRuntime,
									...healthy ? { healthy: () => starting || healthy() } : {}
								});
							}
							publishedRuntime = backend.runtime;
						},
						retract() {}
					}
				});
				realService = activeService;
				await activeService.start(activeContext);
				if (lifecycleRevision !== expectedRevision || ctx !== activeContext) throw new Error("ACPX runtime service stopped during activation");
				if (!publishedRuntime) throw new Error("ACPX runtime service did not register an ACP backend");
				if (published && getAcpRuntimeBackend(ACPX_BACKEND_ID)?.runtime !== deferredRuntime) throw new Error("ACPX runtime service lost registry ownership during activation");
				return publishedRuntime;
			})().finally(() => {
				starting = false;
			});
			try {
				return await startPromise;
			} catch (error) {
				if (lifecycleRevision === expectedRevision) {
					startPromise = null;
					realService = null;
				}
				throw error;
			}
		}
		function createDeferredRuntime(expectedRevision) {
			const deferredRuntime = {
				...createLazyAcpRuntimeProxy(() => startRealService(expectedRevision, deferredRuntime)),
				async ensureSession(input) {
					const runtime = await startRealService(expectedRevision, deferredRuntime);
					requireAcpRuntimeBackend(ACPX_BACKEND_ID);
					return await runtime.ensureSession(input);
				}
			};
			return deferredRuntime;
		}
		const service = {
			id: "acpx-runtime",
			async getRuntime(serviceContext) {
				if (stopPromise) await stopPromise;
				if (!ctx) {
					ctx = serviceContext;
					lifecycleRevision += 1;
					ownedRuntime = createDeferredRuntime(lifecycleRevision);
				}
				if (!ownedRuntime) throw new Error("ACPX runtime service lost its runtime owner");
				return await startRealService(lifecycleRevision, ownedRuntime, published ? "gateway" : "inspection", false);
			},
			async start(serviceContext) {
				if (process.env.OPENCLAW_SKIP_ACPX_RUNTIME === "1") {
					serviceContext.logger.info("skipping embedded acpx runtime backend (OPENCLAW_SKIP_ACPX_RUNTIME=1)");
					return;
				}
				if (stopPromise) await stopPromise;
				if (ctx && ownedRuntime) {
					const revision = lifecycleRevision;
					const previous = getAcpRuntimeBackend(ACPX_BACKEND_ID)?.runtime;
					const assertCurrent = () => {
						const current = getAcpRuntimeBackend(ACPX_BACKEND_ID)?.runtime;
						if (lifecycleRevision !== revision || !ctx || current !== previous && current !== ownedRuntime) throw new Error("ACPX runtime service lost promotion ownership");
					};
					await startPromise;
					assertCurrent();
					await realService?.promote(serviceContext, assertCurrent);
					assertCurrent();
					published = true;
					registerAcpRuntimeBackend({
						id: ACPX_BACKEND_ID,
						runtime: ownedRuntime
					});
					return;
				}
				published = true;
				lifecycleRevision += 1;
				ctx = serviceContext;
				const deferredRuntime = createDeferredRuntime(lifecycleRevision);
				ownedRuntime = deferredRuntime;
				registerAcpRuntimeBackend({
					id: ACPX_BACKEND_ID,
					runtime: deferredRuntime
				});
				serviceContext.logger.info("embedded acpx runtime backend registered lazily");
			},
			async stop(serviceContext) {
				if (stopPromise) return await stopPromise;
				lifecycleRevision += 1;
				ctx = null;
				published = false;
				const stoppingRuntime = ownedRuntime;
				unregisterOwnedRuntime(stoppingRuntime);
				const startingPromise = startPromise;
				stopPromise = (async () => {
					await startingPromise?.catch(() => void 0);
					try {
						await realService?.stop?.(serviceContext);
					} finally {
						unregisterOwnedRuntime(stoppingRuntime);
						ownedRuntime = null;
						realService = null;
						startPromise = null;
					}
				})();
				try {
					await stopPromise;
				} finally {
					stopPromise = null;
				}
			}
		};
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
				shutdown: () => stopPromise ?? (ctx ? service.stop?.(ctx) : void 0)
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
export { plugin as default };
