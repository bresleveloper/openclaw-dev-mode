import { CODEX_NATIVE_TOOL_REQUIREMENTS, CODEX_TOOL_POLICY_SAFE_DENY_NAMES } from "../native-tool-policy.js";
import { p as readCodexPluginConfig } from "./config-parsing-BugaRTEy.mjs";
import { a as hasManagedCodexAppServerBinary } from "./managed-binary-ARII6CR1.mjs";
import { v as sessionBindingIdentity } from "./session-binding-record-BiLa2g9Y.mjs";
import { t as codexBuildSymbol } from "./build-state-heW11Zft.mjs";
import { r as resolveCodexWorkerAppServerCommand } from "./node-app-server-command-L0wPsY9S.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { resolvePluginConfigObject } from "openclaw/plugin-sdk/plugin-config-runtime";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/codex/src/app-server/model-runtime.ts
const CODEX_APP_SERVER_RUNTIME_MODEL_PARAM = "codexAppServerRuntimeModel";
function buildCodexRuntimeModelParams(catalogId, runtimeModelId) {
	return catalogId === runtimeModelId ? void 0 : { [CODEX_APP_SERVER_RUNTIME_MODEL_PARAM]: runtimeModelId };
}
function readCodexRuntimeModelId(model, fallbackId) {
	return normalizeOptionalString(model?.params?.[CODEX_APP_SERVER_RUNTIME_MODEL_PARAM]) ?? model?.id ?? fallbackId;
}
// extensions/codex/harness.ts
const loadUpstreamSessionFork = createLazyRuntimeModule(() => import("./upstream-session-fork-C0USvQLI.mjs"));
const loadAuthBinding = createLazyRuntimeModule(() => import("./auth-binding-B6eynOvR.mjs").then((n) => n.t));
const loadRuntimeArtifact = createLazyRuntimeModule(() => import("./runtime-artifact-B1bybAWV.mjs"));
const loadRuntimeArtifactConnection = createLazyRuntimeModule(() => import("./runtime-artifact-connection-BKV1GIwT.mjs"));
const loadAppServerConfig = createLazyRuntimeModule(() => import("./config-B-xRmWRi.mjs").then((n) => n.t));
const loadUsage = createLazyRuntimeModule(() => import("./usage-SzR5j6tZ.mjs"));
const loadModelCatalog = createLazyRuntimeModule(() => import("./model-catalog-fMYo2chG.mjs"));
const loadEffectiveMcpCatalog = createLazyRuntimeModule(() => import("./effective-mcp-catalog-ED16oILu.mjs"));
const loadNativeSubagentRoster = createLazyRuntimeModule(() => import("./native-subagent-roster-BmfObVyA.mjs"));
const loadRunAttempt = createLazyRuntimeModule(() => import("./run-attempt-DbKhDrWT.mjs"));
const loadCyberFailover = createLazyRuntimeModule(() => import("./cyber-failover-ClxC9HYO.mjs"));
const loadCyberFailoverNotice = createLazyRuntimeModule(() => import("./cyber-failover-notice-CsWdUycm.mjs"));
const loadAccessProgram = createLazyRuntimeModule(() => import("./access-program-Twst85tr.mjs").then((n) => n.n));
const loadSimpleCompletionRuntime = createLazyRuntimeModule(() => import("openclaw/plugin-sdk/simple-completion-runtime"));
const loadIsolatedCompletion = createLazyRuntimeModule(() => import("./isolated-completion-oMeAfGWU.mjs"));
const loadConfigParsing = createLazyRuntimeModule(() => import("./config-parsing-BugaRTEy.mjs").then((n) => n.l));
const loadSettledTurnFinalizer = createLazyRuntimeModule(() => import("./settled-turn-finalizer-BwywFrDc.mjs"));
const loadSideQuestion = createLazyRuntimeModule(() => import("./side-question-Dg6Ct7IG.mjs"));
const loadCompact = createLazyRuntimeModule(() => import("./compact-DX-fVtB5.mjs"));
const loadSessionCancellation = createLazyRuntimeModule(() => import("./session-cancellation-cL5Vvj-0.mjs"));
const loadSessionRetirement = createLazyRuntimeModule(() => import("./session-retirement-C-uD5wgy.mjs"));
const loadSessionBinding = createLazyRuntimeModule(() => import("./session-binding-_y0fotvm.mjs").then((n) => n.a));
const DEFAULT_CODEX_HARNESS_PROVIDER_IDS = /* @__PURE__ */ new Set(["codex", "openai"]);
/** Keep the shipped callback loadable on older hosts without inventing source authority. */
function requireCodexCompactionCapabilities(params) {
	const capabilities = params.hostCapabilities;
	if (capabilities?.kind !== "agent-harness-host-capability" || capabilities.version !== 1 || typeof capabilities.assertActive !== "function" || typeof capabilities.retainSourceAuthority !== "function") throw new Error("This host did not provide compaction source authority. Update OpenClaw before compacting this session.");
	capabilities.assertActive();
	return {
		...params,
		hostCapabilities: capabilities
	};
}
const SHARED_CODEX_APP_SERVER_CLIENT_DISPOSER = codexBuildSymbol("openclaw.codexAppServerClientDisposer");
const CODEX_APP_SERVER_CONTEXT_ENGINE_HOST_CAPABILITIES = [
	"bootstrap",
	"assemble-before-prompt",
	"after-turn",
	"maintain",
	"compact",
	"runtime-llm-complete",
	"thread-bootstrap-projection"
];
async function disposeSharedCodexAppServerClients() {
	const dispose = globalThis[SHARED_CODEX_APP_SERVER_CLIENT_DISPOSER];
	await dispose?.();
}
function createCodexAppServerAgentHarness(options) {
	const harnessRuntimeId = options?.id ?? "codex";
	const normalizedHarnessRuntimeId = harnessRuntimeId.trim().toLowerCase();
	const providerIds = new Set([...options?.providerIds ?? DEFAULT_CODEX_HARNESS_PROVIDER_IDS].map((id) => id.trim().toLowerCase()));
	const sessionCatalogControlFactory = options.sessionCatalogControlFactory;
	const sessionRuntime = options.runtime;
	let modelCatalog;
	let disposed = false;
	const resolveAttemptPluginConfig = (config) => resolvePluginConfigObject(config, "codex") ?? options.resolvePluginConfig?.() ?? options.pluginConfig;
	const resolveIsolatedCompletionRuntime = () => "self";
	const assertOwnershipCurrent = (params) => {
		params.assertCurrent();
		if (disposed) throw new Error("Codex agent harness is disposed");
	};
	const projectOwnership = (binding) => binding?.preserveNativeModel === true ? {
		model: "native",
		auth: binding.connectionScope === "supervision" ? "native" : "host",
		...binding.model?.trim() && binding.modelProvider ? { modelRef: {
			provider: binding.modelProvider,
			model: binding.model
		} } : {}
	} : void 0;
	return {
		id: harnessRuntimeId,
		label: options?.label ?? "Codex agent harness",
		autoSelection: { providerIds: [...providerIds] },
		cloudPlacement: {
			mode: "remote-exec",
			devicePlacement: {
				requiredNodeCommands: [readCodexPluginConfig(options.pluginConfig).appServer?.workerHostedCloud === true ? resolveCodexWorkerAppServerCommand(process.env, true) : "codex.exec-server.stdio.v1"],
				consumesWorkerSlot: false
			}
		},
		delegatedExecutionPluginIds: ["voice-call"],
		contextEngineHostCapabilities: CODEX_APP_SERVER_CONTEXT_ENGINE_HOST_CAPABILITIES,
		conversationToolPolicySupport: "exact",
		nativeModelPolicySupport: "exact",
		conversationToolPolicySafeDenyTools: CODEX_TOOL_POLICY_SAFE_DENY_NAMES,
		conversationToolPolicyNativeTools: CODEX_NATIVE_TOOL_REQUIREMENTS,
		deliveryDefaults: { visibleReplies: "message_tool" },
		authBootstrap: "harness",
		resolveIsolatedCompletionRuntime,
		resolveSessionRuntimeOwnership: (params) => {
			assertOwnershipCurrent(params);
			const identity = sessionBindingIdentity(params);
			let binding = options.bindingStore.read(identity);
			if (!binding) {
				const previousSessionId = params.readPreviousSessionId?.();
				binding = previousSessionId ? options.bindingStore.read({
					...identity,
					sessionId: previousSessionId
				}) : void 0;
			}
			assertOwnershipCurrent(params);
			return projectOwnership(binding);
		},
		resolveSessionRuntimeOwnershipAsync: async (params) => {
			const assertCurrent = () => assertOwnershipCurrent(params);
			assertCurrent();
			const identity = sessionBindingIdentity(params);
			let binding = await options.bindingStore.readAsync(identity);
			assertCurrent();
			if (!binding) {
				const previousSessionId = await params.readPreviousSessionId();
				assertCurrent();
				binding = previousSessionId ? await options.bindingStore.readAsync({
					...identity,
					sessionId: previousSessionId
				}) : void 0;
			}
			assertCurrent();
			return projectOwnership(binding);
		},
		...sessionCatalogControlFactory && sessionRuntime ? { sessionForkV2: {
			executionEnvironment: "host-only",
			upstreamKinds: ["codex-app-server"],
			fork: async (params) => {
				const { forkCodexUpstreamSession } = await loadUpstreamSessionFork();
				return await forkCodexUpstreamSession(params, {
					bindingStore: options.bindingStore,
					controlFactory: sessionCatalogControlFactory,
					harnessRuntimeId,
					resolveConfig: options.resolveConfig,
					runtime: sessionRuntime
				});
			}
		} } : {},
		authBinding: { fingerprint: async (params) => {
			const { fingerprintCodexAppServerAuthBinding } = await loadAuthBinding();
			return fingerprintCodexAppServerAuthBinding(params);
		} },
		runtimeArtifact: { validate: async (binding) => {
			const { validateCodexAppServerRuntimeArtifact } = await loadRuntimeArtifact();
			const { isCodexConfiguredConnectionArtifact } = await loadRuntimeArtifactConnection();
			if (!isCodexConfiguredConnectionArtifact(binding.id)) return validateCodexAppServerRuntimeArtifact(binding);
			const { readCodexPluginConfig, resolveCodexAppServerRuntimeOptions } = await loadAppServerConfig();
			return validateCodexAppServerRuntimeArtifact(binding, void 0, resolveCodexAppServerRuntimeOptions({ pluginConfig: readCodexPluginConfig(resolveAttemptPluginConfig(options.resolveConfig?.())) }).start);
		} },
		fetchUsageSnapshot: async (ctx) => {
			const { fetchCodexAppServerUsageSnapshot } = await loadUsage();
			return await fetchCodexAppServerUsageSnapshot(ctx, { pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig });
		},
		loadModelCatalog: async (params) => {
			const { createCodexAppServerModelCatalog } = await loadModelCatalog();
			if (disposed) return { entries: [] };
			modelCatalog ??= createCodexAppServerModelCatalog(harnessRuntimeId);
			return await modelCatalog.load(params, resolveAttemptPluginConfig(params.config));
		},
		readModelCatalogReadiness: (params) => modelCatalog?.read(params, resolveAttemptPluginConfig(params.config)),
		filterModelServiceTiers: ({ config, serviceTiers }) => {
			return asOptionalRecord(asOptionalRecord(resolveAttemptPluginConfig(config))?.appServer)?.enableUltrafast === false ? serviceTiers.filter((tier) => tier !== "ultrafast") : serviceTiers;
		},
		acquireMcpAppRuntime: async (params) => {
			const { acquireCodexMcpAppRuntime } = await loadEffectiveMcpCatalog();
			if (disposed) return;
			params.assertCurrent();
			return await acquireCodexMcpAppRuntime(params, {
				bindingStore: options.bindingStore,
				pluginConfig: resolveAttemptPluginConfig(params.config)
			});
		},
		readNativeSubagents: async (params) => {
			const { readCodexNativeSubagents } = await loadNativeSubagentRoster();
			assertOwnershipCurrent(params);
			return await readCodexNativeSubagents({
				...params,
				assertCurrent: () => assertOwnershipCurrent(params)
			}, { bindingStore: options.bindingStore });
		},
		loadMcpToolCatalog: async (params) => {
			const { loadCodexEffectiveMcpCatalog } = await loadEffectiveMcpCatalog();
			return await loadCodexEffectiveMcpCatalog(params, { bindingStore: options.bindingStore });
		},
		supports: (ctx) => {
			const unsupported = (reason) => ({
				supported: false,
				reason
			});
			const provider = ctx.provider.trim().toLowerCase();
			const preparedAuth = ctx.modelProvider?.preparedAuth;
			const customNativeCommandRoute = options.providerIds === void 0 && ctx.requestedRuntime === normalizedHarnessRuntimeId && ctx.modelProvider?.nativeCommandAuth?.runtimeId === normalizedHarnessRuntimeId && ctx.modelProvider.requestTransportOverrides === "none" && (preparedAuth === void 0 || preparedAuth.source === "harness" && (preparedAuth.mode === void 0 || preparedAuth.mode === "native-command") && preparedAuth.requirement === void 0);
			if (!providerIds.has(provider) && !customNativeCommandRoute) return unsupported(`provider is not one of: ${[...providerIds].toSorted().join(", ")}`);
			if (ctx.modelProvider?.requestTransportOverrides === "present") return {
				supported: false,
				reason: "Codex cannot reproduce authored request transport overrides",
				fallbackRuntime: "openclaw"
			};
			const runtimePolicy = ctx.modelProvider?.runtimePolicy;
			const nativeAccountOwnsUnobservedModel = provider === "openai" && ctx.requestedRuntime === "codex" && Boolean(ctx.modelId?.trim()) && (preparedAuth === void 0 || preparedAuth.source === "harness") && preparedAuth?.mode === void 0 && preparedAuth?.requirement === void 0 && ctx.modelProvider?.api === void 0 && ctx.modelProvider?.baseUrl === void 0 && ctx.modelProvider?.azureApiVersion === void 0 && ctx.modelProvider?.request === void 0;
			if (runtimePolicy) {
				if (!runtimePolicy.compatibleIds.some((id) => id.trim().toLowerCase() === normalizedHarnessRuntimeId)) return unsupported("Codex cannot reproduce the prepared provider route");
			} else if (ctx.modelProvider && provider !== "codex" && !nativeAccountOwnsUnobservedModel && !customNativeCommandRoute) return unsupported("provider route compatibility with Codex is not declared");
			if (preparedAuth?.requirement === "subscription") {
				if (!(preparedAuth.source === "profile" && (preparedAuth.mode === "oauth" || preparedAuth.mode === "token"))) return unsupported("Codex subscription auth requires a prepared OAuth or token profile");
			} else if (preparedAuth?.requirement === "api-key") {
				if (!(preparedAuth.source !== "none" && preparedAuth.source !== "harness" && (preparedAuth.mode === "api-key" || preparedAuth.mode === "api_key"))) return unsupported("Codex Platform auth requires a prepared API key");
			}
			const appServer = readCodexPluginConfig(options.resolvePluginConfig?.() ?? options.pluginConfig).appServer;
			if ((appServer?.transport ?? "stdio") === "stdio" && appServer?.workerHostedCloud !== true && !appServer?.command?.trim() && !process.env.OPENCLAW_CODEX_APP_SERVER_BIN?.trim() && !hasManagedCodexAppServerBinary()) return unsupported("no native Codex app-server binary is available; install Codex or configure appServer.command for a native build");
			return {
				supported: true,
				priority: 100
			};
		},
		runAttempt: async (params) => {
			const { runCodexAppServerAttempt } = await loadRunAttempt();
			const { planCodexCyberEscalation, readCodexCyberAttemptVerdict, recordCodexCyberTargetUnavailable, reserveCodexCyberProbe, resolveCodexCyberFailoverConfig } = await loadCyberFailover();
			const { emitCodexCyberNotice } = await loadCyberFailoverNotice();
			const pluginConfig = resolveAttemptPluginConfig(params.config);
			const attemptModel = readCodexRuntimeModelId(params.model, params.modelId);
			const runAttemptOnModel = (model, isRetry = false) => runCodexAppServerAttempt(isRetry ? {
				...params,
				cyberAccessProgram: "daybreak_blue",
				suppressNextUserMessagePersistence: true
			} : params, {
				bindingStore: options.bindingStore,
				pluginConfig,
				runtime: sessionRuntime,
				runtimeModelId: model,
				nativeHookRelay: { enabled: true }
			});
			const { resolveCodexCyberAccessProgram, CodexAccessProgramUnavailableError } = await loadAccessProgram();
			const cyberFailover = resolveCodexCyberFailoverConfig(pluginConfig);
			const workspace = {
				agentId: params.agentId,
				authProfileId: params.authProfileId
			};
			const result = await runAttemptOnModel(attemptModel);
			const refusal = readCodexCyberAttemptVerdict(result);
			if (!refusal.cyberRefused || params.cyberAccessProgram !== void 0) return result;
			const plan = planCodexCyberEscalation({
				config: cyberFailover,
				currentModel: attemptModel,
				currentAccessProgram: resolveCodexCyberAccessProgram(params),
				replaySafe: refusal.replaySafe,
				workspace
			});
			if (plan.kind !== "escalate") {
				if (plan.reason === "target_unavailable") await emitCodexCyberNotice(params, {
					state: "unavailable",
					model: attemptModel,
					fallbackModel: attemptModel
				});
				return result;
			}
			const releaseProbe = reserveCodexCyberProbe({
				model: plan.model,
				workspace
			});
			let escalated;
			try {
				escalated = await runAttemptOnModel(plan.model, true);
			} catch (error) {
				if (!(error instanceof CodexAccessProgramUnavailableError)) throw error;
				await emitCodexCyberNotice(params, {
					state: "unavailable",
					model: attemptModel,
					fallbackModel: plan.model
				});
				return result;
			} finally {
				releaseProbe();
			}
			const outcome = readCodexCyberAttemptVerdict(escalated);
			if (outcome.unavailable) recordCodexCyberTargetUnavailable({
				model: plan.model,
				workspace,
				cooloffMs: cyberFailover.cooloffMs
			});
			if (outcome.answered || outcome.unavailable) await emitCodexCyberNotice(params, {
				state: outcome.answered ? "escalated" : "unavailable",
				model: attemptModel,
				fallbackModel: plan.model
			});
			if (outcome.unavailable && outcome.replaySafe && escalated.terminal.kind === "failed" && escalated.toolMetas.length === 0) return result;
			return escalated;
		},
		runIsolatedCompletionV2: async (params) => {
			const { resolveMergedModelProviderConfig } = await import("openclaw/plugin-sdk/provider-catalog-shared");
			if (resolveMergedModelProviderConfig(params.config, params.provider)?.auth === "native-command") throw new Error("Native command auth currently requires an ordinary Codex session, not isolated completion.");
			const { runCodexIsolatedCompletion } = await loadIsolatedCompletion();
			const { readCodexPluginConfig } = await loadConfigParsing();
			return runCodexIsolatedCompletion(params, { pluginConfig: readCodexPluginConfig(resolveAttemptPluginConfig(params.config)) });
		},
		runIsolatedCompletion: async (params) => {
			const { resolveMergedModelProviderConfig } = await import("openclaw/plugin-sdk/provider-catalog-shared");
			if (resolveMergedModelProviderConfig(params.config, params.provider)?.auth === "native-command") throw new Error("Native command auth currently requires an ordinary Codex session, not isolated completion.");
			const { runHostPreparedIsolatedCompletion } = await loadSimpleCompletionRuntime();
			return runHostPreparedIsolatedCompletion({
				...params,
				authorization: {
					owner: "host",
					model: params.model,
					auth: params.auth,
					sourceAuthFingerprint: params.sourceAuthFingerprint
				}
			});
		},
		finalizeSettledTurn: async (params) => {
			const { runCodexSettledTurnFinalization } = await loadSettledTurnFinalizer();
			const { readCodexPluginConfig } = await loadConfigParsing();
			return runCodexSettledTurnFinalization(params, { pluginConfig: readCodexPluginConfig(options.resolvePluginConfig?.() ?? options.pluginConfig) });
		},
		runSideQuestion: async (params) => {
			const { runCodexAppServerSideQuestion } = await loadSideQuestion();
			return runCodexAppServerSideQuestion(params, {
				bindingStore: options.bindingStore,
				pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig,
				runtime: sessionRuntime,
				runtimeModelId: readCodexRuntimeModelId(params.runtimeModel, params.model),
				nativeHookRelay: { enabled: true }
			});
		},
		compact: async (params) => {
			const admittedParams = requireCodexCompactionCapabilities(params);
			const { maybeCompactCodexAppServerSession } = await loadCompact();
			const { readCodexPluginConfig } = await loadConfigParsing();
			return maybeCompactCodexAppServerSession(admittedParams, {
				bindingStore: options.bindingStore,
				pluginConfig: readCodexPluginConfig(options.resolvePluginConfig?.() ?? options.pluginConfig)
			});
		},
		withDescendantCancellation: async (params, run) => {
			const { withCodexSessionDescendantCancellation } = await loadSessionCancellation();
			params.assertCurrent();
			return withCodexSessionDescendantCancellation(options.bindingStore, params, run);
		},
		withSessionDeletion: async (params, run) => {
			const { withCodexAppServerSessionDeletion } = await loadSessionRetirement();
			params.assertCurrent();
			return withCodexAppServerSessionDeletion(options.bindingStore, params, run);
		},
		withSessionContextReset: async (params, run) => {
			const { withCodexAppServerSessionContextReset } = await loadSessionRetirement();
			params.assertCurrent();
			return withCodexAppServerSessionContextReset(options.bindingStore, params, run);
		},
		reset: async (params) => {
			if (params.sessionId && params.reason !== "deleted") {
				const [{ reclaimCurrentCodexSessionGeneration }, { retireCodexAppServerSessionGeneration }] = await Promise.all([loadSessionBinding(), loadSessionRetirement()]);
				const identity = sessionBindingIdentity({
					agentId: params.agentId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey
				});
				const resetGeneration = () => retireCodexAppServerSessionGeneration({
					bindingStore: options.bindingStore,
					identity,
					mode: "reset"
				});
				let reset = await resetGeneration();
				if (reset === "conflict") {
					if (await reclaimCurrentCodexSessionGeneration({
						bindingStore: options.bindingStore,
						identity,
						config: options.resolveConfig?.()
					})) reset = await resetGeneration();
				}
				if (reset === "conflict") throw new Error(`Codex binding generation changed before session ${params.sessionId} could reset`);
			}
		},
		dispose: async () => {
			disposed = true;
			modelCatalog?.dispose();
			await disposeSharedCodexAppServerClients();
		}
	};
}
/** Creates the private native-compaction bridge registered in host-owned capability state. */
function createCodexAppServerNativeCompaction(options) {
	return async (params) => {
		const admittedParams = requireCodexCompactionCapabilities(params);
		const { maybeCompactCodexAppServerSession } = await loadCompact();
		const { readCodexPluginConfig } = await loadConfigParsing();
		return maybeCompactCodexAppServerSession(admittedParams, {
			bindingStore: options.bindingStore,
			pluginConfig: readCodexPluginConfig(options.resolvePluginConfig?.() ?? options.pluginConfig),
			allowNonManualNativeRequest: true,
			nativeCompactionRequest: admittedParams.nativeCompactionRequest
		});
	};
}
export { readCodexRuntimeModelId as i, createCodexAppServerNativeCompaction as n, buildCodexRuntimeModelParams as r, createCodexAppServerAgentHarness as t };
