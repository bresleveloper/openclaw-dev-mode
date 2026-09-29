import { a as resolveAgentDir, l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { r as withTempWorkspace } from "./private-temp-workspace-DQFTMfun.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-BcoYkagW.mjs";
import { a as reconcileAuthProfileQuotaBlocks } from "./usage-BGZHRVrb.mjs";
import { i as unwrapSecretSentinelsForProviderEgress, r as unwrapModelHeaderSentinelsForProviderEgress } from "./provider-secret-egress-BkXZF4dA.mjs";
import "./model-auth-CCIBdEPk.mjs";
import { i as resolveCliBackendConfig, o as resolveCliRuntimeCanonicalProvider } from "./cli-backends-SxX34tmf.mjs";
import { i as isCliRuntimeAliasForProvider, s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-CJA2j26Y.mjs";
import { t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-DtKqtgJz.mjs";
import { l as prepareSystemAgentRunAdmission } from "./admitted-run-context-BNasoszr.mjs";
import { n as isTerminalAssistantError } from "./retry-D-OE0Ga3.mjs";
import { n as classifyAssistantFailoverReason, t as buildAssistantFailoverSignal } from "./assistant-message-failures-Jwdvheh6.mjs";
import { r as resolveAgentHarnessSelectionDecision } from "./selection-decision-l7qEyIJb.mjs";
import { t as resolveEmbeddedCliBackendDispatchEligibility } from "./cli-backend-dispatch-eligibility-C6DStzN6.mjs";
import { n as resolveModelAsync } from "./model-s5D17jSh.mjs";
import { t as materializePreparedRuntimeModel } from "./materialize-model-BGTV6m9x.mjs";
import { i as preparedAgentRuntimeProfileAttemptHasCandidate, n as canRunPreparedAgentRuntimeAuthAttempt, r as prepareAgentRuntimeAuth } from "./prepare-auth-CvmQc1W2.mjs";
import { r as scopeAuthProfileStoreToPreparedPlan } from "./resolve-auth-CH7L0GcM.mjs";
import { t as runWithAsyncWorkResources } from "./async-work-resources-CUDFzL8J.mjs";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-By74qnwW.mjs";
import { a as normalizeCliModel } from "./helpers-BMAVy557.mjs";
import { r as prepareSimpleCompletionModel } from "./simple-completion-runtime-B7YSNxmE.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/agents/isolated-completion-output.ts
var IsolatedCompletionError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.name = "IsolatedCompletionError";
		this.code = code;
	}
};
function requireIsolatedAssistantText(assistant) {
	if (assistant.stopReason !== "stop" && assistant.stopReason !== "length") throw new IsolatedCompletionError("output-rejected", `Isolated completion failed with stop reason ${assistant.stopReason}.`, assistant.stopReason === "error" && !isTerminalAssistantError(assistant) ? { cause: buildAssistantFailoverSignal(assistant) } : void 0);
	const textParts = [];
	for (const block of assistant.content) {
		if (block.type === "text") {
			textParts.push(block.text);
			continue;
		}
		if (block.type === "thinking") continue;
		throw new IsolatedCompletionError("output-rejected", "Isolated completion returned a tool call; the result was rejected.");
	}
	return textParts.join("").trim();
}
/** Account quota failures can rotate; terminal or tool-bearing output cannot be replayed. */
function isRetryableIsolatedQuotaFailure(assistant) {
	const reason = classifyAssistantFailoverReason(assistant);
	return (reason === "rate_limit" || reason === "billing") && assistant.content.every((block) => block.type === "text" || block.type === "thinking");
}
//#endregion
//#region src/agents/isolated-completion.ts
/**
* Fresh, prompt-only inference with an exact zero-tool execution contract.
*
* This operation deliberately bypasses the ordinary agent attempt, retry,
* transcript, hook, and delivery lifecycle. Execution owners either prove a
* literal empty native tool surface or fail before inference starts.
*/
function clampIsolatedStreamParams(streamParams, modelMaxTokens) {
	if (streamParams?.maxTokens === void 0 || modelMaxTokens === void 0) return streamParams;
	return {
		...streamParams,
		maxTokens: Math.min(streamParams.maxTokens, modelMaxTokens)
	};
}
function selectIsolatedHarnessAuthPlan(attempt) {
	if (attempt.kind !== "profile") return attempt.plan;
	return {
		...attempt.plan,
		forwardedAuthProfileId: attempt.profileId,
		forwardedAuthProfileCandidateIds: [attempt.profileId]
	};
}
function hasCliSideEffectEvidence(result) {
	return Boolean(result.didSendViaMessagingTool || result.didDeliverSourceReplyViaMessageTool || result.messagingToolSentTexts?.length || result.messagingToolSentMediaUrls?.length || result.messagingToolSentTargets?.length || result.messagingToolSourceReplyPayloads?.length || result.acceptedSessionSpawns?.length || result.successfulCronAdds);
}
async function runCliIsolatedCompletion(params) {
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-isolated-completion-"
	}, async ({ dir }) => {
		const { runCliAgent } = await import("./cli-runner.runtime.js");
		params.request.assertCurrent?.();
		const sessionId = `isolated-completion-${randomUUID()}`;
		const config = params.request.config;
		const preparedRunAdmission = prepareSystemAgentRunAdmission(config, sessionId, params.agentId, "isolated-completion");
		try {
			params.request.assertCurrent?.();
			const result = await runCliAgent({
				preparedRunAdmission,
				sessionId,
				sessionFile: path.join(dir, "session.json"),
				workspaceDir: params.workspaceDir,
				cwd: dir,
				agentDir: params.agentDir,
				agentId: params.agentId,
				config,
				prompt: params.request.prompt,
				extraSystemPrompt: params.request.systemPrompt,
				timeoutMs: params.request.timeoutMs,
				runId: sessionId,
				provider: params.provider,
				modelProvider: params.modelProvider,
				model: params.request.model,
				authProfileId: params.request.authProfileId,
				thinkLevel: params.request.thinkLevel,
				streamParams: params.request.streamParams,
				abortSignal: params.request.abortSignal,
				assertCurrent: params.request.assertCurrent,
				executionMode: "side-question",
				cliToolAvailability: {
					native: [],
					openClaw: []
				},
				disableTools: true,
				disableCliLiveSession: true,
				cleanupCliLiveSessionOnRunEnd: true,
				cleanupBundleMcpOnRunEnd: true,
				requireExplicitMessageTarget: true,
				isolatedCompletion: true,
				outputTextPolicy: params.request.outputTextPolicy
			});
			if (hasCliSideEffectEvidence(result)) throw new IsolatedCompletionError("output-rejected", "Isolated CLI completion returned side-effect evidence; result rejected.");
			const payloads = result.payloads ?? [];
			if (payloads.some((payload) => payload.isError || payload.mediaUrl || payload.mediaUrls?.length || payload.audioAsVoice || payload.channelData)) throw new IsolatedCompletionError("output-rejected", "Isolated CLI completion returned non-text output; result rejected.");
			const text = payloads.filter((payload) => !payload.isReasoning && typeof payload.text === "string").map((payload) => payload.text ?? "").join("\n").trim();
			const backend = resolveCliBackendConfig(params.provider, params.request.config, { agentId: params.agentId });
			if (!backend) throw new IsolatedCompletionError("runtime-unavailable", `CLI backend ${params.provider} became unavailable after execution.`);
			const usage = result.meta?.agentMeta?.usage;
			return {
				text,
				model: normalizeCliModel(params.request.model, backend.config),
				...usage ? { usage } : {}
			};
		} finally {
			preparedRunAdmission.close();
		}
	});
}
function resolveCliOwner(params) {
	if (isCliRuntimeAliasForProvider({
		runtime: params.runtime,
		provider: params.provider,
		cfg: params.request.config
	})) return params.runtime;
	if (params.request.agentHarnessRuntimeOverride) return;
	return resolveCliRuntimeExecutionProvider({
		provider: params.provider,
		cfg: params.request.config,
		agentId: params.agentId,
		modelId: params.request.model,
		authProfileId: params.request.authProfileId
	}) ?? resolveEmbeddedCliBackendDispatchEligibility({
		provider: params.provider,
		model: params.request.model,
		agentId: params.agentId,
		authProfileId: params.request.authProfileId,
		config: params.request.config,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	})?.provider;
}
function prepareIsolatedHostAuthorization(harness, authorization) {
	if (harness.id === "openclaw") return authorization;
	const boundary = "plugin harness isolated completion handoff";
	const apiKey = authorization.auth.apiKey ? unwrapSecretSentinelsForProviderEgress(authorization.auth.apiKey, boundary) : authorization.auth.apiKey;
	const model = unwrapModelHeaderSentinelsForProviderEgress(authorization.model, boundary);
	if (apiKey === authorization.auth.apiKey && model === authorization.model) return authorization;
	return {
		...authorization,
		model,
		auth: {
			...authorization.auth,
			apiKey
		}
	};
}
/** Run one fresh, zero-tool completion through its selected runtime. */
async function runIsolatedCompletion(params) {
	return await runWithAsyncWorkResources((onAcquired, captureWorkContext) => runIsolatedCompletionOwned(params, onAcquired, captureWorkContext));
}
async function runIsolatedCompletionOwned(params, onAcquired, captureWorkContext) {
	const input = {
		...params,
		streamParams: params.streamParams && { ...params.streamParams }
	};
	let closed = false;
	const assertCurrent = () => {
		if (closed) throw new IsolatedCompletionError("runtime-unavailable", "Isolated completion has ended.");
		input.assertCurrent?.();
		input.abortSignal?.throwIfAborted();
	};
	assertCurrent();
	const requestConfig = input.config ?? {};
	const agentId = input.agentId ?? resolveDefaultAgentId(requestConfig);
	const requestAgentDir = input.agentDir ?? resolveAgentDir(requestConfig, agentId);
	const requestedWorkspaceDir = input.workspaceDir ?? resolveAgentWorkspaceDir(requestConfig, agentId);
	const canonicalProvider = resolveCliRuntimeCanonicalProvider({
		runtime: input.provider,
		config: requestConfig,
		includeSetupRegistry: true
	});
	const provider = canonicalProvider ?? input.provider;
	const runtimeOverride = input.agentHarnessRuntimeOverride ?? (canonicalProvider ? input.provider : void 0);
	const lease = await acquireAgentRunPreparedModelRuntime({
		config: requestConfig,
		agentId,
		agentDir: requestAgentDir,
		workspaceDir: requestedWorkspaceDir,
		preserveWorkspaceDirOnRefresh: input.workspaceDir !== void 0
	}, {
		catalogMode: "static",
		abortSignal: input.abortSignal,
		deriveRuntimePluginSelections: () => [{
			provider,
			modelId: input.model,
			...runtimeOverride ? { runtime: runtimeOverride } : {},
			agentId
		}]
	});
	onAcquired({ release: () => lease[Symbol.asyncDispose]() });
	try {
		assertCurrent();
		const run = async () => {
			captureWorkContext();
			const context = {
				config: lease.snapshot.config,
				agentId,
				agentDir: lease.snapshot.agentDir,
				workspaceDir: lease.snapshot.workspaceDir ?? requestedWorkspaceDir
			};
			const { config, agentDir, workspaceDir } = context;
			const request = {
				...input,
				...context,
				assertCurrent
			};
			await ensureSelectedAgentHarnessPlugin({
				provider,
				modelId: request.model,
				...context,
				agentHarnessRuntimeOverride: runtimeOverride,
				pluginRegistry: lease.snapshot.pluginRegistry
			});
			assertCurrent();
			const selection = resolveAgentHarnessSelectionDecision({
				provider,
				modelId: request.model,
				config,
				agentId,
				agentHarnessRuntimeOverride: runtimeOverride
			});
			const cliOwner = resolveCliOwner({
				request,
				provider,
				runtime: runtimeOverride ?? selection.policy.runtime,
				...context
			});
			if (cliOwner) {
				const completion = await runCliIsolatedCompletion({
					request,
					provider: cliOwner,
					modelProvider: provider,
					...context
				});
				return {
					text: completion.text,
					provider,
					model: completion.model,
					owner: {
						kind: "cli",
						id: cliOwner
					},
					...completion.usage ? { usage: completion.usage } : {}
				};
			}
			const harness = selection.builtIn ? (await import("./builtin-openclaw-Bvun9wA5.mjs")).createOpenClawAgentHarness() : selection.harness;
			assertCurrent();
			if (!harness.runIsolatedCompletionV2 && !harness.runIsolatedCompletion) throw new IsolatedCompletionError("unsupported", `Agent harness ${harness.id} does not support isolated completion.`);
			const commonParams = {
				provider,
				modelId: request.model,
				...context,
				systemPrompt: request.systemPrompt,
				prompt: request.prompt,
				timeoutMs: request.timeoutMs,
				abortSignal: request.abortSignal,
				assertCurrent,
				thinkLevel: request.thinkLevel,
				outputTextPolicy: request.outputTextPolicy
			};
			const prepareHostAuthorization = async (authProfileId) => {
				const prepared = await prepareSimpleCompletionModel({
					cfg: config,
					agentId,
					provider,
					modelId: request.model,
					agentDir,
					profileId: authProfileId,
					allowMissingApiKeyModes: ["aws-sdk"],
					allowBundledStaticCatalogFallback: true,
					skipAgentDiscovery: true,
					bindAuthOwner: true,
					workspaceDir,
					preparedModelRuntime: lease.snapshot,
					signal: request.abortSignal
				}, assertCurrent);
				assertCurrent();
				if ("error" in prepared) throw new Error(`Isolated completion preparation failed: ${prepared.error}`);
				return {
					owner: "host",
					...prepared
				};
			};
			let result;
			if (harness.runIsolatedCompletionV2) {
				let modelMaxTokens;
				let harnessAuth;
				if (harness.authBootstrap === "harness") {
					const resolution = await resolveModelAsync(provider, request.model, agentDir, config, {
						abortSignal: request.abortSignal,
						assertCurrent,
						...lease.snapshot.createStores(),
						preparedModelRuntime: lease.snapshot,
						workspaceDir,
						authProfileId: request.authProfileId,
						skipAgentDiscovery: true,
						allowBundledStaticCatalogFallback: true,
						preferBundledStaticCatalogTransport: true
					});
					const runtimeModel = resolution.model;
					if (!runtimeModel) throw new IsolatedCompletionError("runtime-unavailable", resolution.error ?? `Unknown isolated completion model ${provider}/${request.model}.`);
					assertCurrent();
					const authProfileStore = ensureAuthProfileStore(agentDir, {
						profileId: request.authProfileId,
						readOnly: true,
						allowKeychainPrompt: false,
						config
					});
					const authParams = {
						provider: runtimeModel.provider,
						modelId: runtimeModel.id,
						modelApi: runtimeModel.api,
						modelBaseUrl: runtimeModel.baseUrl,
						...context,
						env: process.env,
						authProfileStore,
						sessionAuthProfileId: request.authProfileId,
						sessionAuthProfileSource: request.authProfileId ? "user" : void 0,
						...request.authProfileId ? { allowAuthProfileFallback: false } : {},
						harnessId: harness.id,
						harnessRuntime: harness.id,
						harnessAuthBootstrap: harness.authBootstrap
					};
					await reconcileAuthProfileQuotaBlocks(authParams);
					assertCurrent();
					harnessAuth = {
						model: runtimeModel,
						store: authProfileStore,
						attempts: prepareAgentRuntimeAuth(authParams).attempts
					};
				}
				let deadline;
				const remainingTimeoutMs = () => {
					const remaining = deadline === void 0 ? request.timeoutMs : deadline - Date.now();
					if (remaining <= 0) throw new IsolatedCompletionError("runtime-unavailable", "Isolated completion timed out.");
					return remaining;
				};
				let firstError;
				let priorProfileAttempted = false;
				for (const preparedAttempt of harnessAuth?.attempts ?? [void 0]) {
					assertCurrent();
					remainingTimeoutMs();
					const attempt = preparedAttempt?.kind === "profile" ? {
						...preparedAttempt,
						plan: selectIsolatedHarnessAuthPlan(preparedAttempt)
					} : preparedAttempt;
					if (attempt && !canRunPreparedAgentRuntimeAuthAttempt({
						attempt,
						priorProfileAttempted
					})) {
						firstError ??= /* @__PURE__ */ new Error("Prepared direct auth requires a prior profile attempt.");
						continue;
					}
					if (attempt?.kind === "profile" && harnessAuth && !preparedAgentRuntimeProfileAttemptHasCandidate({
						attempt,
						store: harnessAuth.store,
						modelId: harnessAuth.model.id
					})) {
						firstError ??= /* @__PURE__ */ new Error("Prepared runtime auth candidates are temporarily unavailable.");
						continue;
					}
					try {
						let authorization;
						if (attempt?.plan.harnessAuthProvider && attempt.plan.modelRoute?.authRequirement !== "api-key" && harnessAuth) {
							const plan = attempt.plan;
							const { model: runtimeModel, store: authProfileStore } = harnessAuth;
							const model = await materializePreparedRuntimeModel({
								plan,
								provider: runtimeModel.provider,
								modelId: runtimeModel.id,
								model: runtimeModel,
								config,
								workspaceDir,
								metadataSnapshot: lease.snapshot.metadataSnapshot,
								resolveModel: ({ config: modelConfig, authProfileId, authProfileMode }) => resolveModelAsync(runtimeModel.provider, runtimeModel.id, agentDir, modelConfig, {
									abortSignal: request.abortSignal,
									assertCurrent,
									modelIdSource: "selected",
									preparedModelRuntime: lease.snapshot,
									workspaceDir,
									authProfileId,
									authProfileMode,
									skipAgentDiscovery: true,
									allowBundledStaticCatalogFallback: true
								})
							});
							assertCurrent();
							modelMaxTokens = model?.maxTokens;
							authorization = {
								owner: "harness",
								plan,
								authProfileStore: scopeAuthProfileStoreToPreparedPlan(authProfileStore, plan)
							};
						} else {
							authorization = await prepareHostAuthorization(attempt?.kind === "profile" ? attempt.profileId : request.authProfileId);
							modelMaxTokens = authorization.model.maxTokens;
						}
						if (attempt?.kind === "profile" && harnessAuth && !preparedAgentRuntimeProfileAttemptHasCandidate({
							attempt,
							store: harnessAuth.store,
							modelId: harnessAuth.model.id
						})) throw new Error("Prepared runtime auth candidates are temporarily unavailable.");
						assertCurrent();
						deadline ??= Date.now() + request.timeoutMs;
						const pending = harness.runIsolatedCompletionV2({
							...commonParams,
							timeoutMs: remainingTimeoutMs(),
							authorization: authorization.owner === "host" ? prepareIsolatedHostAuthorization(harness, authorization) : authorization,
							streamParams: clampIsolatedStreamParams(request.streamParams, modelMaxTokens)
						});
						priorProfileAttempted ||= attempt?.kind === "profile";
						const candidate = await pending;
						assertCurrent();
						if (isRetryableIsolatedQuotaFailure(candidate.assistant)) requireIsolatedAssistantText(candidate.assistant);
						result = candidate;
						break;
					} catch (error) {
						assertCurrent();
						firstError ??= error;
					}
				}
				if (!result) {
					if (firstError instanceof Error) throw firstError;
					throw new Error("No prepared auth attempt succeeded.", { cause: firstError });
				}
			} else {
				const authorization = await prepareHostAuthorization(request.authProfileId);
				const harnessParams = {
					...commonParams,
					streamParams: clampIsolatedStreamParams(request.streamParams, authorization.model.maxTokens),
					model: authorization.model,
					auth: authorization.auth,
					...authorization.sourceAuthFingerprint ? { sourceAuthFingerprint: authorization.sourceAuthFingerprint } : {}
				};
				assertCurrent();
				result = await harness.runIsolatedCompletion(prepareIsolatedHostAuthorization(harness, harnessParams));
			}
			if (!result) throw new IsolatedCompletionError("runtime-unavailable", "Isolated completion failed.");
			return {
				text: requireIsolatedAssistantText(result.assistant),
				provider: result.assistant.provider,
				model: result.assistant.model,
				owner: {
					kind: "harness",
					id: harness.id
				},
				usage: result.assistant.usage
			};
		};
		const result = await withPluginRuntimeGenerationScope(lease.snapshot, run);
		assertCurrent();
		if (!result.text && input.outputTextPolicy !== "strict-visible") throw new IsolatedCompletionError("output-rejected", "Isolated completion returned empty output.");
		return result;
	} finally {
		closed = true;
	}
}
//#endregion
export { runIsolatedCompletion as t };
