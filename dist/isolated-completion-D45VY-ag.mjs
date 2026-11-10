import { p as isDiagnosticsEnabled, s as emitTrustedDiagnosticEvent } from "./diagnostic-events-C91J-XX8.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { _ as resolveDefaultAgentId, a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { n as assertOperatorModelAllowed, p as prepareSystemAgentRunAdmission, r as bindOperatorModelExecution } from "./admitted-run-context-h1ULFETN.mjs";
import { d as toDiagnosticUsage, s as hasObservedModelUsage, u as normalizeUsage } from "./usage-BqbJmOEZ.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BtVvqU7l.mjs";
import { a as resolveCliBackendConfig } from "./cli-backends-BzVT3JSM.mjs";
import { r as listModelCatalogObservedRoutes, t as createModelCatalogSnapshotView } from "./model-catalog-view-UkLRAY5C.mjs";
import { n as estimateAggregateUsageCost } from "./usage-format-DT58obO2.mjs";
import { i as ensureAuthProfileStoreAsync } from "./store-runtime-CwqGD12G.mjs";
import { a as reconcileAuthProfileQuotaBlocks } from "./usage-CRucybdr.mjs";
import { i as unwrapSecretSentinelsForProviderEgress, r as unwrapModelHeaderSentinelsForProviderEgress } from "./provider-secret-egress-CQZW-nmd.mjs";
import { E as readAdmittedPublishedModelCatalog, a as acquireReadOnlyPreparedModelRuntime, t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-wDlPVSla.mjs";
import { n as isTerminalAssistantError } from "./retry-2KnjF4V1.mjs";
import { n as classifyAssistantFailoverReason, t as buildAssistantFailoverSignal } from "./assistant-message-failures-LYMR8J6z.mjs";
import "./model-auth-CMoPmop7.mjs";
import { t as runWithAsyncWorkResources } from "./async-work-resources-DmPouonj.mjs";
import { n as resolveModelAsync } from "./model-DTfH9r49.mjs";
import { t as materializePreparedRuntimeModel } from "./materialize-model-EsjVwK5o.mjs";
import { i as preparedAgentRuntimeProfileAttemptHasCandidate, n as canRunPreparedAgentRuntimeAuthAttempt, r as prepareAgentRuntimeAuth } from "./prepare-auth-B180a1GD.mjs";
import { o as scopeAuthProfileStoreToPreparedPlan, r as prepareSimpleCompletionModel } from "./simple-completion-runtime-2gdDKllV.mjs";
import { o as requiredWorkerHelperError } from "./required-worker-profile-B0DIhkdC.mjs";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-Cq540iGR.mjs";
import { a as normalizeCliModel } from "./helpers-pkXnPWuP.mjs";
import { a as selectIsolatedHarnessAuthAttempt, n as resolveIsolatedCompletionProvider, r as resolveIsolatedCompletionRoute, t as resolveIsolatedCompletionAuthorizationOwner } from "./isolated-completion-route-Hfl2GkZm.mjs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { withTempWorkspace } from "@openclaw/fs-safe/temp";
import { adjustMaxTokensForThinking } from "@openclaw/ai/internal/shared";
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
	if (assistant.stopReason !== "stop" && assistant.stopReason !== "length") {
		const error = new IsolatedCompletionError("output-rejected", assistant.errorMessage?.trim() || `Isolated completion failed with stop reason ${assistant.stopReason}.`, assistant.stopReason === "error" && !isTerminalAssistantError(assistant) || assistant.stopReason === "aborted" ? { cause: buildAssistantFailoverSignal(assistant) } : void 0);
		if (isTerminalAssistantError(assistant)) recordModelFallbackStop(error);
		throw error;
	}
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
function resolveIsolatedStreamParams({ answerTokenBudget, streamParams, thinkLevel }, model) {
	let maxTokens = answerTokenBudget ?? streamParams?.maxTokens;
	if (maxTokens === void 0) return streamParams;
	const modelMaxTokens = model?.maxTokens ?? Number.POSITIVE_INFINITY;
	if (answerTokenBudget !== void 0 && model?.reasoning && thinkLevel !== "off") maxTokens = adjustMaxTokensForThinking(answerTokenBudget, modelMaxTokens, "medium").maxTokens;
	return {
		...streamParams,
		maxTokens: Math.min(maxTokens, modelMaxTokens, streamParams?.maxTokens ?? maxTokens)
	};
}
async function runCliIsolatedCompletion(request, provider, modelProvider) {
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-isolated-completion-"
	}, async ({ dir }) => {
		const { runCliAgent } = await import("./cli-runner.runtime.js");
		request.assertCurrent?.();
		const { cliBackendAcceptsAuthProfileForwarding, resolveCliExecutionAuthProfileId } = await import("./cli-execution-auth-BSGKRoOm.mjs");
		request.assertCurrent?.();
		const authProfileId = cliBackendAcceptsAuthProfileForwarding({
			provider,
			config: request.config,
			agentId: request.agentId
		}) ? await resolveCliExecutionAuthProfileId({
			cliExecutionProvider: provider,
			authProfileProvider: modelProvider,
			config: request.config,
			agentDir: request.agentDir,
			selected: { authProfileId: request.authProfileId }
		}) : request.authProfileId;
		request.assertCurrent?.();
		const sessionId = `isolated-completion-${randomUUID()}`;
		const config = request.config;
		const preparedRunAdmission = prepareSystemAgentRunAdmission(config, sessionId, request.agentId, "isolated-completion", request.assertCurrent, request.operatorAuthority);
		try {
			request.assertCurrent?.();
			const result = await runCliAgent({
				preparedRunAdmission,
				sessionId,
				sessionFile: path.join(dir, "session.json"),
				workspaceDir: request.workspaceDir,
				cwd: dir,
				agentDir: request.agentDir,
				agentId: request.agentId,
				config,
				prompt: request.prompt,
				extraSystemPrompt: request.systemPrompt,
				timeoutMs: request.timeoutMs,
				runId: sessionId,
				provider,
				modelProvider,
				requesterModel: {
					provider: modelProvider,
					model: request.model
				},
				model: request.model,
				authProfileId,
				thinkLevel: request.thinkLevel,
				streamParams: resolveIsolatedStreamParams(request),
				abortSignal: request.abortSignal,
				assertCurrent: request.assertCurrent,
				mapOperatorAuthorizationError: request.mapOperatorAuthorizationError,
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
				isolatedCompletionPurpose: request.purpose ?? "isolated-completion",
				outputTextPolicy: request.outputTextPolicy
			});
			if (hasCliSideEffectEvidence(result)) throw new IsolatedCompletionError("output-rejected", "Isolated CLI completion returned side-effect evidence; result rejected.");
			const payloads = result.payloads ?? [];
			if (payloads.some((payload) => payload.isError || payload.mediaUrl || payload.mediaUrls?.length || payload.audioAsVoice || payload.channelData)) throw new IsolatedCompletionError("output-rejected", "Isolated CLI completion returned non-text output; result rejected.");
			const text = payloads.filter((payload) => !payload.isReasoning && typeof payload.text === "string").map((payload) => payload.text ?? "").join("\n").trim();
			const backend = resolveCliBackendConfig(provider, request.config, { agentId: request.agentId });
			if (!backend) throw new IsolatedCompletionError("runtime-unavailable", `CLI backend ${provider} became unavailable after execution.`);
			const { usage, diagnosticUsage } = result.meta?.agentMeta ?? {};
			return {
				text,
				provider: modelProvider,
				model: normalizeCliModel(request.model, backend.config),
				owner: {
					kind: "cli",
					id: provider
				},
				...usage ? { usage } : {},
				...diagnosticUsage ? { diagnosticUsage } : {}
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
/** Plugin completions finalize usage with host-plugin attribution; core callers have no other path. */
function emitIsolatedCompletionUsage(params) {
	const { config, result } = params;
	if (params.purpose === "plugin-completion" || !isDiagnosticsEnabled(config)) return;
	const usage = normalizeUsage(result.diagnosticUsage ?? result.usage);
	if (!hasObservedModelUsage(usage)) return;
	emitTrustedDiagnosticEvent({
		type: "model.usage",
		agentId: params.agentId,
		provider: result.provider,
		model: result.model,
		usage: toDiagnosticUsage(usage),
		costUsd: estimateAggregateUsageCost({
			usage,
			provider: result.provider,
			model: result.model,
			config,
			agentDir: params.agentDir
		})
	});
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
	const isolatedReadOnly = input.preparedModelRuntimeMode === "isolated-read-only";
	const lease = await (isolatedReadOnly ? acquireReadOnlyPreparedModelRuntime : acquireAgentRunPreparedModelRuntime)({
		config: requestConfig,
		agentId,
		agentDir: requestAgentDir,
		workspaceDir: requestedWorkspaceDir,
		preserveWorkspaceDirOnRefresh: input.workspaceDir !== void 0,
		runtimePluginPurpose: "isolated-completion",
		...isolatedReadOnly ? { loadRuntimePlugins: true } : {}
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
			const blocked = requiredWorkerHelperError(config);
			if (blocked) throw new IsolatedCompletionError("unsupported", blocked.error);
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
			const { selection, cliOwner } = await resolveIsolatedCompletionRoute({
				provider,
				model: request.model,
				authProfileId: request.authProfileId,
				runtimeOverride,
				explicitRuntimeOverride: request.agentHarnessRuntimeOverride,
				...context
			});
			if (cliOwner) return await runCliIsolatedCompletion(request, cliOwner, provider);
			const harness = selection.builtIn ? (await import("./builtin-openclaw-CUhaIbg6.mjs")).createOpenClawAgentHarness() : selection.harness;
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
				outputTextPolicy: request.outputTextPolicy,
				onRequestComplete: request.onRequestComplete
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
					const authProfileStore = await ensureAuthProfileStoreAsync(agentDir, {
						profileId: request.authProfileId,
						readOnly: true,
						allowKeychainPrompt: false,
						config
					});
					const catalog = readAdmittedPublishedModelCatalog(lease.snapshot) ?? lease.snapshot.modelCatalog;
					const variants = catalog && createModelCatalogSnapshotView(config, catalog).variantsOf({
						provider: runtimeModel.provider,
						id: runtimeModel.id
					});
					const authParams = {
						provider: runtimeModel.provider,
						modelId: runtimeModel.id,
						...variants ? { observedRoutes: listModelCatalogObservedRoutes(variants) } : {
							modelApi: runtimeModel.api,
							modelBaseUrl: runtimeModel.baseUrl
						},
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
				const hasAuthCandidate = (attempt) => attempt?.kind !== "profile" || !harnessAuth || preparedAgentRuntimeProfileAttemptHasCandidate({
					attempt,
					store: harnessAuth.store,
					modelId: harnessAuth.model.id
				});
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
					if (!hasAuthCandidate(attempt)) {
						firstError ??= /* @__PURE__ */ new Error("Prepared runtime auth candidates are temporarily unavailable.");
						continue;
					}
					try {
						let authorization;
						let completionModel;
						if (attempt && harnessAuth && resolveIsolatedCompletionAuthorizationOwner(attempt.plan) === "harness") {
							const plan = attempt.plan;
							const { model: runtimeModel, store: authProfileStore } = harnessAuth;
							completionModel = await materializePreparedRuntimeModel({
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
							authorization = {
								owner: "harness",
								plan,
								authProfileStore: scopeAuthProfileStoreToPreparedPlan(authProfileStore, plan)
							};
						} else {
							authorization = await prepareHostAuthorization(attempt?.kind === "profile" ? attempt.profileId : request.authProfileId);
							completionModel = authorization.model;
						}
						if (!hasAuthCandidate(attempt)) throw new Error("Prepared runtime auth candidates are temporarily unavailable.");
						assertCurrent();
						deadline ??= Date.now() + request.timeoutMs;
						const execution = modelAuthority.bind(modelForAuthorization);
						const pending = harness.runIsolatedCompletionV2({
							...commonParams,
							...execution,
							timeoutMs: remainingTimeoutMs(),
							authorization: authorization.owner === "host" ? prepareIsolatedHostAuthorization(harness, authorization) : authorization,
							streamParams: resolveIsolatedStreamParams(request, completionModel)
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
				if (!result) throw firstError instanceof Error ? firstError : new Error("No prepared auth attempt succeeded.", { cause: firstError });
			} else {
				const authorization = await prepareHostAuthorization(request.authProfileId);
				const harnessParams = {
					...commonParams,
					streamParams: resolveIsolatedStreamParams(request, authorization.model),
					model: authorization.model,
					auth: authorization.auth,
					sourceAuthFingerprint: authorization.sourceAuthFingerprint
				};
				assertCurrent();
				const execution = modelAuthority.bind(modelForAuthorization);
				result = await harness.runIsolatedCompletion(prepareIsolatedHostAuthorization(harness, {
					...harnessParams,
					...execution
				}));
				execution.assertCurrent?.();
			}
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
		emitIsolatedCompletionUsage({
			config: lease.snapshot.config,
			agentId,
			agentDir: lease.snapshot.agentDir,
			purpose: input.purpose,
			result
		});
		return result;
	} finally {
		closed = true;
	}
}
//#endregion
export { runIsolatedCompletion as t };
