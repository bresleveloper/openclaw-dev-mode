import { CODEX_NATIVE_TOOL_REQUIREMENTS } from "../native-tool-policy.js";
import { m as sessionBindingIdentity } from "./session-binding-record-BGoz8wOK.mjs";
import { t as codexBuildSymbol } from "./build-state-C7EnDVgr.mjs";
import { resolvePluginConfigObject } from "openclaw/plugin-sdk/plugin-config-runtime";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/codex/src/app-server/model-runtime.ts
const CODEX_APP_SERVER_RUNTIME_MODEL_PARAM = "codexAppServerRuntimeModel";
function buildCodexRuntimeModelParams(catalogId, runtimeModelId) {
	return catalogId === runtimeModelId ? void 0 : { [CODEX_APP_SERVER_RUNTIME_MODEL_PARAM]: runtimeModelId };
}
function readCodexRuntimeModelId(model, fallbackId) {
	return normalizeOptionalString(model?.params?.[CODEX_APP_SERVER_RUNTIME_MODEL_PARAM]) ?? model?.id ?? fallbackId;
}
//#endregion
//#region extensions/codex/harness.ts
const DEFAULT_CODEX_HARNESS_PROVIDER_IDS = /* @__PURE__ */ new Set(["codex", "openai"]);
const SHARED_CODEX_APP_SERVER_CLIENT_DISPOSER = codexBuildSymbol("openclaw.codexAppServerClientDisposer");
const CODEX_TOOL_POLICY_SAFE_DENY_NAMES = [
	"web_fetch",
	"x_search",
	"memory_search",
	"memory_get",
	"dashboard",
	"canvas",
	"show_widget",
	"message",
	"heartbeat_respond",
	"automations",
	"gateway",
	"skill_workshop",
	"image_generate",
	"music_generate",
	"video_generate",
	"tts"
];
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
/**
* Creates the Codex app-server harness used for attempts, side questions,
* compaction, reset, and disposal.
*/
function createCodexAppServerAgentHarness(options) {
	const harnessRuntimeId = options?.id ?? "codex";
	const normalizedHarnessRuntimeId = harnessRuntimeId.trim().toLowerCase();
	const providerIds = new Set([...options?.providerIds ?? DEFAULT_CODEX_HARNESS_PROVIDER_IDS].map((id) => id.trim().toLowerCase()));
	const sessionCatalogControlFactory = options.sessionCatalogControlFactory;
	const sessionRuntime = options.runtime;
	let modelCatalog;
	let disposed = false;
	const resolveAttemptPluginConfig = (config) => resolvePluginConfigObject(config, "codex") ?? options.resolvePluginConfig?.() ?? options.pluginConfig;
	return {
		id: harnessRuntimeId,
		label: options?.label ?? "Codex agent harness",
		autoSelection: { providerIds: [...providerIds] },
		cloudPlacement: {
			mode: "remote-exec",
			devicePlacement: {
				requiredNodeCommands: ["codex.exec-server.stdio.v1"],
				consumesWorkerSlot: false
			}
		},
		delegatedExecutionPluginIds: ["voice-call"],
		contextEngineHostCapabilities: CODEX_APP_SERVER_CONTEXT_ENGINE_HOST_CAPABILITIES,
		conversationToolPolicySupport: "exact",
		conversationToolPolicySafeDenyTools: CODEX_TOOL_POLICY_SAFE_DENY_NAMES,
		conversationToolPolicyNativeTools: CODEX_NATIVE_TOOL_REQUIREMENTS,
		deliveryDefaults: { visibleReplies: "message_tool" },
		authBootstrap: "harness",
		resolveSessionRuntimeOwnership: (params) => {
			const assertCurrent = () => {
				params.assertCurrent();
				if (disposed) throw new Error("Codex agent harness is disposed");
			};
			assertCurrent();
			const identity = sessionBindingIdentity(params);
			let binding = options.bindingStore.read(identity);
			if (!binding) {
				const previousSessionId = params.readPreviousSessionId?.();
				binding = previousSessionId ? options.bindingStore.read({
					...identity,
					sessionId: previousSessionId
				}) : void 0;
			}
			assertCurrent();
			return binding?.preserveNativeModel === true ? {
				model: "native",
				auth: binding.connectionScope === "supervision" ? "native" : "host",
				...binding.model?.trim() && binding.modelProvider ? { modelRef: {
					provider: binding.modelProvider,
					model: binding.model
				} } : {}
			} : void 0;
		},
		...sessionCatalogControlFactory && sessionRuntime ? { sessionForkV2: {
			executionEnvironment: "host-only",
			upstreamKinds: ["codex-app-server"],
			fork: async (params) => {
				const { forkCodexUpstreamSession } = await import("./upstream-session-fork-BUr4OUbC.mjs");
				return await forkCodexUpstreamSession(params, {
					bindingStore: options.bindingStore,
					controlFactory: sessionCatalogControlFactory,
					harnessRuntimeId,
					resolveConfig: options.resolveConfig,
					runtime: sessionRuntime
				});
			}
		} } : {},
		taskHistory: {
			taskKinds: ["codex-native"],
			read: async (params) => {
				const { readCodexNativeSubagentHistory } = await import("./native-subagent-history-0nYYgo0k.mjs");
				const assertCurrent = () => {
					params.assertCurrent();
					if (disposed) throw new Error("Agent harness is disposed");
				};
				return readCodexNativeSubagentHistory({
					...params,
					assertCurrent
				}, {
					bindingStore: options.bindingStore,
					pluginConfig: resolveAttemptPluginConfig(params.cfg)
				});
			}
		},
		authBinding: { fingerprint: async (params) => {
			const { fingerprintCodexAppServerAuthBinding } = await import("./auth-binding-DhLWa_7K.mjs").then((n) => n.t);
			return fingerprintCodexAppServerAuthBinding(params);
		} },
		runtimeArtifact: { validate: async (binding) => {
			const { validateCodexAppServerRuntimeArtifact } = await import("./runtime-artifact-CLZ8udh-.mjs");
			return validateCodexAppServerRuntimeArtifact(binding);
		} },
		fetchUsageSnapshot: async (ctx) => {
			const { fetchCodexAppServerUsageSnapshot } = await import("./usage-BML0r-ua.mjs");
			return await fetchCodexAppServerUsageSnapshot(ctx, { pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig });
		},
		loadModelCatalog: async (params) => {
			const { createCodexAppServerModelCatalog } = await import("./model-catalog-CfXJf9Ay.mjs");
			if (disposed) return [];
			modelCatalog ??= createCodexAppServerModelCatalog(harnessRuntimeId);
			return await modelCatalog.load(params, resolveAttemptPluginConfig(params.config));
		},
		readModelCatalogReadiness: (params) => modelCatalog?.read(params, resolveAttemptPluginConfig(params.config)),
		loadMcpToolCatalog: async (params) => {
			const { loadCodexEffectiveMcpCatalog } = await import("./effective-mcp-catalog-CvnvnGIe.mjs");
			return await loadCodexEffectiveMcpCatalog(params, { bindingStore: options.bindingStore });
		},
		supports: (ctx) => {
			const provider = ctx.provider.trim().toLowerCase();
			if (!providerIds.has(provider)) return {
				supported: false,
				reason: `provider is not one of: ${[...providerIds].toSorted().join(", ")}`
			};
			if (ctx.modelProvider?.requestTransportOverrides === "present") return {
				supported: false,
				reason: "Codex cannot reproduce authored request transport overrides",
				fallbackRuntime: "openclaw"
			};
			const preparedAuth = ctx.modelProvider?.preparedAuth;
			const runtimePolicy = ctx.modelProvider?.runtimePolicy;
			const nativeAccountOwnsUnobservedModel = provider === "openai" && ctx.requestedRuntime === "codex" && Boolean(ctx.modelId?.trim()) && (preparedAuth === void 0 || preparedAuth.source === "harness") && preparedAuth?.mode === void 0 && preparedAuth?.requirement === void 0 && ctx.modelProvider?.api === void 0 && ctx.modelProvider?.baseUrl === void 0 && ctx.modelProvider?.azureApiVersion === void 0 && ctx.modelProvider?.request === void 0;
			if (runtimePolicy) {
				if (!runtimePolicy.compatibleIds.some((id) => id.trim().toLowerCase() === normalizedHarnessRuntimeId)) return {
					supported: false,
					reason: "Codex cannot reproduce the prepared provider route"
				};
			} else if (ctx.modelProvider && provider !== "codex" && !nativeAccountOwnsUnobservedModel) return {
				supported: false,
				reason: "provider route compatibility with Codex is not declared"
			};
			if (preparedAuth?.requirement === "subscription") {
				if (!(preparedAuth.source === "profile" && (preparedAuth.mode === "oauth" || preparedAuth.mode === "token"))) return {
					supported: false,
					reason: "Codex subscription auth requires a prepared OAuth or token profile"
				};
			} else if (preparedAuth?.requirement === "api-key") {
				if (!(preparedAuth.source !== "none" && preparedAuth.source !== "harness" && (preparedAuth.mode === "api-key" || preparedAuth.mode === "api_key"))) return {
					supported: false,
					reason: "Codex Platform auth requires a prepared API key"
				};
			}
			return {
				supported: true,
				priority: 100
			};
		},
		runAttempt: async (params) => {
			const { runCodexAppServerAttempt } = await import("./run-attempt-BHu11r7h.mjs");
			const { planCodexCyberEscalation, readCodexCyberAttemptVerdict, recordCodexCyberTargetUnavailable, reserveCodexCyberProbe, resolveCodexCyberFailoverConfig } = await import("./cyber-failover-DYwbmf1o.mjs");
			const { emitCodexCyberNotice } = await import("./cyber-failover-notice-e9G3J9-e.mjs");
			const pluginConfig = resolveAttemptPluginConfig(params.config);
			const attemptModel = readCodexRuntimeModelId(params.model, params.modelId);
			const runAttemptOnModel = (model, isRetry = false) => runCodexAppServerAttempt(isRetry ? {
				...params,
				suppressNextUserMessagePersistence: true
			} : params, {
				bindingStore: options.bindingStore,
				pluginConfig,
				runtime: sessionRuntime,
				runtimeModelId: model,
				nativeHookRelay: { enabled: true }
			});
			const cyberFailover = resolveCodexCyberFailoverConfig(pluginConfig);
			const workspace = {
				agentId: params.agentId,
				authProfileId: params.authProfileId
			};
			const result = await runAttemptOnModel(attemptModel);
			const refusal = readCodexCyberAttemptVerdict(result);
			if (!refusal.cyberRefused) return result;
			const plan = planCodexCyberEscalation({
				config: cyberFailover,
				currentModel: attemptModel,
				replaySafe: refusal.replaySafe,
				workspace
			});
			if (plan.kind !== "escalate") {
				if (plan.reason === "target_unavailable") await emitCodexCyberNotice(params, {
					state: "unavailable",
					model: attemptModel,
					fallbackModel: cyberFailover.model
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
			if (params.authorization.owner === "host") {
				const { runHostPreparedIsolatedCompletion } = await import("openclaw/plugin-sdk/simple-completion-runtime");
				return runHostPreparedIsolatedCompletion(params);
			}
			const { runCodexIsolatedCompletion } = await import("./isolated-completion-BIZFhTNG.mjs");
			return runCodexIsolatedCompletion(params, { pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig });
		},
		runIsolatedCompletion: async (params) => {
			const { runHostPreparedIsolatedCompletion } = await import("openclaw/plugin-sdk/simple-completion-runtime");
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
			const { runCodexSettledTurnFinalization } = await import("./settled-turn-finalizer-DiAi6Kx6.mjs");
			return runCodexSettledTurnFinalization(params, { pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig });
		},
		runSideQuestion: async (params) => {
			const { runCodexAppServerSideQuestion } = await import("./side-question-BJ1wSDcB.mjs");
			return runCodexAppServerSideQuestion(params, {
				bindingStore: options.bindingStore,
				pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig,
				runtime: sessionRuntime,
				runtimeModelId: readCodexRuntimeModelId(params.runtimeModel, params.model),
				nativeHookRelay: { enabled: true }
			});
		},
		compact: async (params) => {
			const { maybeCompactCodexAppServerSession } = await import("./compact-Du5UvtxA.mjs");
			return maybeCompactCodexAppServerSession(params, {
				bindingStore: options.bindingStore,
				pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig
			});
		},
		withSessionDeletion: async (params, run) => {
			const { withCodexAppServerSessionDeletion } = await import("./session-retirement-BH-S6qkJ.mjs");
			params.assertCurrent();
			return withCodexAppServerSessionDeletion(options.bindingStore, params, run);
		},
		withSessionContextReset: async (params, run) => {
			const { withCodexAppServerSessionContextReset } = await import("./session-retirement-BH-S6qkJ.mjs");
			params.assertCurrent();
			return withCodexAppServerSessionContextReset(options.bindingStore, params, run);
		},
		reset: async (params) => {
			if (params.sessionId && params.reason !== "deleted") {
				const [{ reclaimCurrentCodexSessionGeneration }, { retireCodexAppServerSessionGeneration }] = await Promise.all([import("./session-binding-Cm0apEbd.mjs").then((n) => n.s), import("./session-retirement-BH-S6qkJ.mjs")]);
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
		const { maybeCompactCodexAppServerSession } = await import("./compact-Du5UvtxA.mjs");
		return maybeCompactCodexAppServerSession(params, {
			bindingStore: options.bindingStore,
			pluginConfig: options.resolvePluginConfig?.() ?? options.pluginConfig,
			allowNonManualNativeRequest: true,
			nativeCompactionRequest: params.nativeCompactionRequest
		});
	};
}
//#endregion
export { createCodexAppServerNativeCompaction as n, buildCodexRuntimeModelParams as r, createCodexAppServerAgentHarness as t };
