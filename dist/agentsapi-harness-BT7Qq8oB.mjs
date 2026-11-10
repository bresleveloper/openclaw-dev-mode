import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { n as AgentHarnessSessionCleanupError, r as AgentHarnessSessionSupersededError, t as AgentHarnessPreflightError } from "./errors-BAipjK5G.mjs";
import { H as wrapNativeSessionDeletionMutation } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { t as abortAndDrainEmbeddedAgentRun } from "./runs-Czr-I6_B.mjs";
import { t as log } from "./logger-BpVUgEyL.mjs";
import { m as toolPolicy, w as resolveAgentExecutorController } from "./agent-harness-runtime-k_z2ig1L.mjs";
import { c as combinePreparedNativeSessionBindingAuthority, o as retainNativeSessionGenerationAuthority, u as createNativeSessionBindingScope } from "./agent-harness-session-runtime-795mx7Xd.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-CMRSW7VK.mjs";
import { t as AgentsApiClient } from "./agentsapi-client-DzhjNWzN.mjs";
import { n as retireAgentsApiExecutor } from "./agentsapi-environment-BlybUrHw.mjs";
import { t as requireAgentsApiSessionTarget } from "./agentsapi-target-ClP2ww2I.mjs";
import { t as runAgentsApiAttempt } from "./agentsapi-attempt-Dxoe-gde.mjs";
import { t as migrateAgentsApiBinding } from "./agentsapi-binding-migration-ON6y6HUO.mjs";
import { t as createAgentsApiBindings } from "./agentsapi-bindings-BXXuS5k1.mjs";
import { t as runAgentsApiIsolatedCompletion } from "./agentsapi-isolated-completion-pReEcQr1.mjs";
//#region extensions/agentsapi/agentsapi-harness.ts
const AGENTS_API_NATIVE_TOOL_REQUIREMENTS = [
	"exec",
	"process",
	"read",
	"write",
	"edit",
	"apply_patch",
	"web_search"
];
/** Agents API owns native protocol; the host harness runtime owns coordination. */
function createAgentsApiHarness(runtime) {
	let disposed = false;
	let closing = false;
	const runningSessions = /* @__PURE__ */ new Map();
	const isolatedRuns = /* @__PURE__ */ new Map();
	const promptHistories = /* @__PURE__ */ new WeakMap();
	const preparedNativeCleanup = /* @__PURE__ */ new Map();
	let bindings;
	const getBindings = () => bindings ??= createAgentsApiBindings(runtime, {
		settle: async (localSessionId, binding, assertCleanupCurrent, targetAgentId) => {
			let prepared = preparedNativeCleanup.get(localSessionId);
			if (prepared?.nativeSessionId !== binding.sessionId || prepared.configFingerprint !== binding.configFingerprint) {
				assertCurrent();
				assertCleanupCurrent();
				const config = runtime.config.current({ clone: true });
				const agentId = binding.executor?.agentId ?? targetAgentId;
				if (!agentId) throw new Error("Agents API session cleanup requires its owning agent");
				if (targetAgentId && targetAgentId !== agentId) throw new Error("Agents API session cleanup target differs from its owning agent");
				const auth = await resolveApiKeyForProvider({
					provider: "openai",
					cfg: config,
					agentDir: runtime.agent.resolveAgentDir(config, agentId),
					workspaceDir: runtime.agent.resolveAgentWorkspaceDir(config, agentId),
					signal: AbortSignal.timeout(3e4)
				});
				assertCurrent();
				assertCleanupCurrent();
				if (auth.mode !== "api-key" || !auth.apiKey?.trim()) throw new Error("Agents API session cleanup requires an OpenAI API key; restore API-key authentication and retry reset or deletion");
				prepared = prepareNativeCleanup(localSessionId, binding, auth.apiKey);
			}
			try {
				await prepared.settle(assertCleanupCurrent);
			} catch (error) {
				preparedNativeCleanup.delete(localSessionId);
				throw error;
			}
		},
		retire: async (_localSessionId, binding, assertCleanupCurrent) => {
			await retireExecutor(binding, assertCleanupCurrent);
		}
	});
	const assertCurrent = () => {
		if (disposed) throw new Error("Agents API harness is disposed");
	};
	return {
		id: "agentsapi",
		label: "OpenAI Agents API (MVP)",
		autoSelection: { providerIds: [] },
		contextManagement: "native",
		deliveryDefaults: { visibleReplies: "automatic" },
		conversationToolPolicySupport: "exact",
		conversationToolPolicyNativeTools: AGENTS_API_NATIVE_TOOL_REQUIREMENTS,
		conversationToolPolicySafeDenyTools: [
			"gateway",
			"agents_list",
			"openclaw",
			"session_status",
			"progress_card",
			"automations",
			"message",
			"sessions_send",
			"conversations_list",
			"conversations_send",
			"conversations_turn",
			"subagents",
			"sessions_list",
			"sessions_history",
			"sessions_search",
			"sessions_spawn"
		],
		supports: (ctx) => {
			if (ctx.provider !== "openai") return {
				supported: false,
				reason: "Agents API requires the OpenAI provider"
			};
			if (ctx.modelProvider?.preparedAuth?.requirement === "subscription" || ctx.modelProvider?.api && ctx.modelProvider.api !== "openai-responses" || ctx.modelProvider?.requestTransportOverrides === "present" || ctx.modelProvider?.baseUrl && ctx.modelProvider.baseUrl !== "https://api.openai.com/v1") return {
				supported: false,
				reason: "Agents API MVP requires the official API-key route"
			};
			return { supported: true };
		},
		runIsolatedCompletionV2: (params) => {
			assertCurrent();
			if (closing) throw new Error("Agents API harness is closing");
			const controller = new AbortController();
			const pending = runAgentsApiIsolatedCompletion({
				...params,
				abortSignal: params.abortSignal ? AbortSignal.any([params.abortSignal, controller.signal]) : controller.signal
			}, assertCurrent);
			isolatedRuns.set(controller, pending);
			return pending.finally(() => isolatedRuns.delete(controller));
		},
		runAttempt: async (params) => {
			try {
				var _usingCtx$1 = _usingCtx();
				assertCurrent();
				if (closing) throw new Error("Agents API harness is closing");
				const target = validateAgentsApiInput(params);
				const captured = await retainNativeSessionGenerationAuthority({
					target,
					config: params.config,
					storePath: target.storePath,
					assertCurrent: () => {
						assertCurrent();
						params.hostCapabilities.assertActive();
					},
					createSupersededError: (sessionId) => new AgentHarnessSessionSupersededError(`Agents API session generation is no longer current: ${sessionId}`)
				});
				_usingCtx$1.u({ [Symbol.dispose]: captured.release });
				const authority = captured.authority;
				authority.assertLegacyCurrent();
				runningSessions.set(params.sessionId, (runningSessions.get(params.sessionId) ?? 0) + 1);
				try {
					return await getBindings().withSession(params.sessionId, authority.assertLegacyCurrent, (binding, bind, assertLeaseCurrent) => {
						if (closing) throw new Error("Agents API harness is closing");
						return runAgentsApiAttempt(params, binding, bind, combinePreparedNativeSessionBindingAuthority(authority, createNativeSessionBindingScope(assertLeaseCurrent)).assertLegacyCurrent, () => {
							assertCurrent();
							assertLeaseCurrent();
						}, target, () => runtime.config.current().plugins?.entries?.agentsapi?.config, promptHistories, (nativeBinding, apiKey) => prepareNativeCleanup(params.sessionId, nativeBinding, apiKey), (failedBinding) => retireExecutor(failedBinding, () => {
							assertCurrent();
							assertLeaseCurrent();
						}));
					}, (binding, assertMigrationCurrent) => migrateAgentsApiBinding(binding, params, () => runtime.config.current().plugins?.entries?.agentsapi?.config, assertMigrationCurrent));
				} finally {
					const count = runningSessions.get(params.sessionId) - 1;
					if (count > 0) runningSessions.set(params.sessionId, count);
					else runningSessions.delete(params.sessionId);
				}
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				_usingCtx$1.d();
			}
		},
		reset: async (params) => {
			try {
				assertCurrent();
				if (params.sessionId) {
					if (runningSessions.has(params.sessionId) || preparedNativeCleanup.has(params.sessionId)) {
						await drainForExecutorCleanup(params.sessionId);
						assertCurrent();
					}
					await getBindings().reset(params.sessionId, assertCurrent, params.agentId);
					preparedNativeCleanup.delete(params.sessionId);
				}
			} catch (error) {
				throw new AgentHarnessSessionCleanupError(formatErrorMessage(error), { cause: error });
			}
		},
		withSessionDeletion,
		withSessionContextReset: async (params, run) => {
			params.assertCurrent();
			assertCurrent();
			const sessionId = await getBindings().resolveContextResetSessionId(params.sessionId, params.previousSessionId);
			params.assertCurrent();
			assertCurrent();
			return withSessionDeletion({
				...params,
				sessionId
			}, run, true);
		},
		dispose: async () => {
			closing = true;
			for (const controller of isolatedRuns.keys()) controller.abort();
			await Promise.allSettled(isolatedRuns.values());
			await Promise.all([...runningSessions.keys()].map((sessionId) => abortAndDrainEmbeddedAgentRun({
				sessionId,
				settleMs: 95e3
			})));
			if (bindings) await bindings.withExclusiveMutationFence(async () => {
				disposed = true;
			});
			else disposed = true;
			preparedNativeCleanup.clear();
		}
	};
	async function withSessionDeletion(params, run, retireAfterCommit = false) {
		params.assertCurrent();
		assertCurrent();
		if (runningSessions.has(params.sessionId) || preparedNativeCleanup.has(params.sessionId)) {
			await drainForExecutorCleanup(params.sessionId);
			params.assertCurrent();
			assertCurrent();
		}
		let committed = false;
		try {
			return await getBindings().withSessionDeletion({
				...params,
				assertCurrent: () => {
					params.assertCurrent();
					assertCurrent();
				}
			}, (mutation) => run(wrapNativeSessionDeletionMutation(mutation, {
				assertCurrent: () => {
					params.assertCurrent();
					assertCurrent();
				},
				committed: () => {
					committed = true;
				},
				rolledBack: () => {
					committed = false;
				}
			})), retireAfterCommit);
		} finally {
			if (committed) preparedNativeCleanup.delete(params.sessionId);
		}
	}
	async function retireExecutor(binding, assertCleanupCurrent) {
		const executor = binding.executor;
		if (!executor) return;
		await attemptExecutorCleanup(() => retireAgentsApiExecutor(resolveAgentExecutorController(binding.executorControllerPluginId), executor, assertCleanupCurrent), assertCleanupCurrent);
	}
	async function attemptExecutorCleanup(run, assertCleanupCurrent) {
		try {
			assertCleanupCurrent();
			await run();
			assertCleanupCurrent();
		} catch (error) {
			assertCleanupCurrent();
			log.warn("Agents API executor cleanup was not acknowledged", { error });
		}
	}
	async function drainForExecutorCleanup(sessionId) {
		const result = await abortAndDrainEmbeddedAgentRun({
			sessionId,
			settleMs: 95e3
		});
		assertCurrent();
		if (result.aborted && !result.drained || runningSessions.has(sessionId)) throw new Error("Agents API session is still settling; retry reset or deletion after its active turn finishes");
	}
	function prepareNativeCleanup(localSessionId, binding, apiKey) {
		assertCurrent();
		const prepared = {
			nativeSessionId: binding.sessionId,
			configFingerprint: binding.configFingerprint,
			settle: async (assertCleanupCurrent) => {
				const assertCleanup = () => {
					assertCurrent();
					assertCleanupCurrent();
				};
				assertCleanup();
				const client = new AgentsApiClient(apiKey, assertCleanup);
				const signal = AbortSignal.timeout(3e4);
				const session = await client.session(binding.sessionId, signal);
				assertCleanup();
				if (session.status !== "idle" && session.status !== "failed") {
					await client.cancel(binding.sessionId, signal);
					assertCleanup();
				}
			}
		};
		preparedNativeCleanup.set(localSessionId, prepared);
		return prepared;
	}
}
function validateAgentsApiInput(params) {
	const runtimeToolAllowed = toolPolicy.createToolPolicyMatcher({ allow: params.toolsAllow });
	if (params.disableTools || params.pluginHarnessToolPolicyRestricted || params.toolExecutionAllow !== void 0 || params.toolsAllow?.length === 0 || AGENTS_API_NATIVE_TOOL_REQUIREMENTS.some((name) => !runtimeToolAllowed(name))) throw new AgentHarnessPreflightError("Agents API cannot enforce this run's restrictions on native shell, file, or web-search tools.", {
		scope: "harness",
		userMessage: "Agents API cannot run with this chat's tool restrictions because it cannot enforce them on native tools. Choose a harness that supports these restrictions or update the tool settings."
	});
	const target = requireAgentsApiSessionTarget(params);
	if (!params.resolvedApiKey) throw new Error("Agents API MVP requires an OpenAI API key");
	if (params.sandbox) throw new AgentHarnessPreflightError("Agents API does not support Gateway sandbox placement.", {
		scope: "harness",
		userMessage: "Agents API cannot run in the configured Gateway sandbox. Choose a harness that supports Gateway sandbox placement before retrying."
	});
	if (params.contextEngine && params.contextEngine.info.id !== "legacy") throw new Error("Agents API MVP currently supports only the default legacy context engine");
	return target;
}
//#endregion
export { createAgentsApiHarness as t };
