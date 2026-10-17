import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir, g as resolveDefaultAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-BNE7YdYW.mjs";
import { d as prepareSystemAgentRunAdmission, n as assertOperatorModelAllowed, r as bindOperatorModelExecution } from "./admitted-run-context-QJnFIxUZ.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-Qx0DZ2Si.mjs";
import { a as reconcileAuthProfileQuotaBlocks } from "./usage-Cfv9IA36.mjs";
import { i as unwrapSecretSentinelsForProviderEgress, r as unwrapModelHeaderSentinelsForProviderEgress } from "./provider-secret-egress-LltAZ95s.mjs";
import { a as resolveCliBackendConfig } from "./cli-backends-CRE_cwP5.mjs";
import { t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-BvTeWKXf.mjs";
import "./model-auth-efmtIdn2.mjs";
import { n as isTerminalAssistantError } from "./retry-BdOwk_ol.mjs";
import { n as classifyAssistantFailoverReason, t as buildAssistantFailoverSignal } from "./assistant-message-failures-qHM9fOZl.mjs";
import { t as runWithAsyncWorkResources } from "./async-work-resources-Dpudqxo5.mjs";
import { n as resolveModelAsync } from "./model-CBr3I3EF.mjs";
import { t as materializePreparedRuntimeModel } from "./materialize-model-DqAHXeGv.mjs";
import { i as preparedAgentRuntimeProfileAttemptHasCandidate, n as canRunPreparedAgentRuntimeAuthAttempt, r as prepareAgentRuntimeAuth } from "./prepare-auth-CH_V05qh.mjs";
import { r as prepareSimpleCompletionModel, s as scopeAuthProfileStoreToPreparedPlan } from "./simple-completion-runtime-CAU9mXql.mjs";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-BSESlB4y.mjs";
import { a as normalizeCliModel } from "./helpers-BbufZccY.mjs";
import { a as selectIsolatedHarnessAuthAttempt, n as resolveIsolatedCompletionProvider, r as resolveIsolatedCompletionRoute, t as resolveIsolatedCompletionAuthorizationOwner } from "./isolated-completion-route-BgcMIuCK.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { withTempWorkspace } from "@openclaw/fs-safe/temp";
//#region src/agents/isolated-completion-model-authority.ts
/** A completion keeps its selected-model fence through the runtime's physical cleanup. */
function createIsolatedCompletionModelAuthority(params) {
	const resources = new AsyncDisposableStack();
	let bound;
	return {
		bind(model) {
			params.assertCurrent();
			if (!bound || bound.model?.provider !== model?.provider || bound.model?.model !== model?.model) {
				const execution = bindOperatorModelExecution(params.operatorAuthority, model, params.mapOperatorAuthorizationError);
				if (!execution) return {};
				resources.defer(execution.release);
				bound = {
					model: model ? { ...model } : void 0,
					execution
				};
			}
			const { execution } = bound;
			execution.assertCurrent();
			return {
				abortSignal: params.abortSignal ? AbortSignal.any([params.abortSignal, execution.signal]) : execution.signal,
				assertCurrent: () => {
					params.assertCurrent();
					execution.assertCurrent();
				}
			};
		},
		async release() {
			try {
				await params.runtime[Symbol.asyncDispose]();
			} finally {
				await resources.disposeAsync();
			}
		}
	};
}
//#endregion
//#region src/agents/isolated-completion-output.ts
var IsolatedCompletionError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.name = "IsolatedCompletionError";
		this.code = code;
	}
};
function hasCliSideEffectEvidence(result) {
	return Boolean(result.didSendViaMessagingTool || result.didDeliverSourceReplyViaMessageTool || result.messagingToolSentTexts?.length || result.messagingToolSentMediaUrls?.length || result.messagingToolSentTargets?.length || result.messagingToolSourceReplyPayloads?.length || result.acceptedSessionSpawns?.length || result.successfulCronAdds);
}
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
* Fresh, prompt-only inference through the selected runtime.
*
* This operation deliberately bypasses the ordinary agent attempt, retry,
* transcript, hook, and delivery lifecycle. Execution owners either prove a
* literal empty native tool surface or fail before inference starts, except
* Agents API: its restricted sessions may retain service-owned helpers.
*/
function clampIsolatedStreamParams(streamParams, modelMaxTokens) {
	if (streamParams?.maxTokens === void 0 || modelMaxTokens === void 0) return streamParams;
	return {
		...streamParams,
		maxTokens: Math.min(streamParams.maxTokens, modelMaxTokens)
	};
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
		const preparedRunAdmission = prepareSystemAgentRunAdmission(config, sessionId, params.agentId, "isolated-completion", params.request.assertCurrent, params.request.operatorAuthority);
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
				requesterModel: {
					provider: params.modelProvider,
					model: params.request.model
				},
				model: params.request.model,
				authProfileId: params.request.authProfileId,
				thinkLevel: params.request.thinkLevel,
				streamParams: params.request.streamParams,
				abortSignal: params.request.abortSignal,
				assertCurrent: params.request.assertCurrent,
				mapOperatorAuthorizationError: params.request.mapOperatorAuthorizationError,
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
/** Run one fresh completion with the selected runtime's documented isolation boundary. */
async function runIsolatedCompletion(params) {
	return await runWithAsyncWorkResources((onAcquired, captureWorkContext) => runIsolatedCompletionOwned(params, onAcquired, captureWorkContext));
}
async function runIsolatedCompletionOwned(params, onAcquired, captureWorkContext) {
	const input = {
		...params,
		streamParams: params.streamParams && { ...params.streamParams }
	};
	const requestConfig = input.config ?? {};
	const agentId = input.agentId ?? resolveDefaultAgentId(requestConfig);
	const requestAgentDir = input.agentDir ?? resolveAgentDir(requestConfig, agentId);
	const requestedWorkspaceDir = input.workspaceDir ?? resolveAgentWorkspaceDir(requestConfig, agentId);
	const { provider, runtimeOverride } = resolveIsolatedCompletionProvider({
		provider: input.provider,
		config: requestConfig,
		agentHarnessRuntimeOverride: input.agentHarnessRuntimeOverride
	});
	let closed = false;
	let modelForAuthorization = {
		provider,
		model: input.model
	};
	const assertCurrent = () => {
		if (closed) throw new IsolatedCompletionError("runtime-unavailable", "Isolated completion has ended.");
		input.assertCurrent?.();
		try {
			assertOperatorModelAllowed(input.operatorAuthority, modelForAuthorization);
		} catch (error) {
			throw input.mapOperatorAuthorizationError?.(error) ?? error;
		}
		input.abortSignal?.throwIfAborted();
	};
	const resolveAuthorizedModel = async (...args) => {
		const resolved = await resolveModelAsync(...args);
		if (resolved.model) {
			modelForAuthorization = resolved.logicalRef;
			assertCurrent();
		}
		return resolved;
	};
	assertCurrent();
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
	const modelAuthority = createIsolatedCompletionModelAuthority({
		operatorAuthority: input.operatorAuthority,
		mapOperatorAuthorizationError: input.mapOperatorAuthorizationError,
		abortSignal: input.abortSignal,
		assertCurrent,
		runtime: lease
	});
	onAcquired({ release: () => modelAuthority.release() });
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
			const { selection, cliOwner } = resolveIsolatedCompletionRoute({
				provider,
				model: request.model,
				authProfileId: request.authProfileId,
				runtimeOverride,
				explicitRuntimeOverride: request.agentHarnessRuntimeOverride,
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
			const harness = selection.builtIn ? (await import("./builtin-openclaw-4b27pptQ.mjs")).createOpenClawAgentHarness() : selection.harness;
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
					signal: request.abortSignal,
					modelResolver: resolveAuthorizedModel
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
					const resolution = await resolveAuthorizedModel(provider, request.model, agentDir, config, {
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
					if (!resolution.model) throw new IsolatedCompletionError("runtime-unavailable", resolution.error ?? `Unknown isolated completion model ${provider}/${request.model}.`);
					const runtimeModel = resolution.model;
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
					const attempt = preparedAttempt && selectIsolatedHarnessAuthAttempt(preparedAttempt);
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
						if (attempt && harnessAuth && resolveIsolatedCompletionAuthorizationOwner(attempt.plan) === "harness") {
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
								resolveModel: ({ config: modelConfig, authProfileId, authProfileMode }) => resolveAuthorizedModel(runtimeModel.provider, runtimeModel.id, agentDir, modelConfig, {
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
						const execution = modelAuthority.bind(modelForAuthorization);
						const pending = harness.runIsolatedCompletionV2({
							...commonParams,
							...execution,
							timeoutMs: remainingTimeoutMs(),
							authorization: authorization.owner === "host" ? prepareIsolatedHostAuthorization(harness, authorization) : authorization,
							streamParams: clampIsolatedStreamParams(request.streamParams, modelMaxTokens)
						});
						priorProfileAttempted ||= attempt?.kind === "profile";
						const candidate = await pending;
						execution.assertCurrent?.();
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
				const execution = modelAuthority.bind(modelForAuthorization);
				result = await harness.runIsolatedCompletion(prepareIsolatedHostAuthorization(harness, {
					...harnessParams,
					...execution
				}));
				execution.assertCurrent?.();
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
