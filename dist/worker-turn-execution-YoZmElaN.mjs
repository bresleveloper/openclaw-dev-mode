import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { E as createDiagnosticTraceContextFromActiveScope, O as freezeDiagnosticTraceContext, p as isDiagnosticsEnabled, s as emitTrustedDiagnosticEvent } from "./diagnostic-events-C91J-XX8.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { u as getAgentRunContext, x as registerAgentRunDelegatedAuthorityClosedHandler } from "./agent-run-registry-gmaPgO-n.mjs";
import { s as emitAgentEventForRunContext } from "./agent-events-Bf3Js0D3.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./defaults-Bg930vxE.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-d5S6zg8U.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { a as resolveProviderModelRoutes } from "./provider-model-routes-CmpBxrCV.mjs";
import { y as resolveModelRefFromString } from "./model-selection-shared-CVU_V2PQ.mjs";
import { a as projectProviderModelRouteConfig } from "./provider-model-route-D2MOzv0r.mjs";
import { a as resolveModelCatalogIdentityKey } from "./openai-model-routes-BJEokkWC.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { f as getWorkerTurnToolSurface, h as readWorkerTurnPromptCacheContext, i as bindWorkerTurnOwner, r as bindWorkerTurnCapabilities } from "./placement-turn-claim-events-C-F0mgX3.mjs";
import { _ as resolveAdmittedRunActiveAssertion, m as readAdmittedRunOperatorAuthority, u as getAdmittedRunDelegatedAuthority, v as resolvePreparedRunAdmission } from "./admitted-run-context-h1ULFETN.mjs";
import { w as buildPersistedUserTurnMessage } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { n as runWithoutOwnedSessionTranscriptWrites } from "./transcript-write-context-owner-Dx0JDp93.mjs";
import { d as toDiagnosticUsage, o as hasNonzeroUsage, s as hasObservedModelUsage, u as normalizeUsage } from "./usage-BqbJmOEZ.mjs";
import { a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES, t as WORKER_INFERENCE_MAX_CONTEXT_MESSAGES } from "./worker-inference-DQS6vE1x.mjs";
import { Et as isWorkerGatewayToolFrameWithinBudget, Tt as WorkerToolSurfaceSchema } from "./worker-admission-DKoRQV__.mjs";
import { r as projectEffectiveExecPolicy } from "./session-permission-exec-mode-orsENUww.mjs";
import { a as setPluginToolMeta, r as getPluginToolMeta } from "./tool-metadata-CaNEdKPR.mjs";
import { i as copyAgentToolMetadata, s as getAgentToolExecutionLocation } from "./agent-tool-metadata-Dj6F-G24.mjs";
import { r as MAX_IMAGE_BYTES } from "./constants-GzjKtFvA.mjs";
import { o as convertToLlm } from "./messages-Cdi_z_94.mjs";
import { f as readPersistedMediaFacts, n as applyRunHydrationSuppression } from "./media-facts-BIPREXi-.mjs";
import { d as readSessionEntryInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { y as withSessionTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BtVvqU7l.mjs";
import { n as createModelVisibilityPolicy, t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-pIK04Peo.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { s as resolveProviderThinkingLevel } from "./thinking-BCNoGfZ5.mjs";
import { a as resolveContextTokensForModel } from "./context-XynHJtne.mjs";
import { i as overlayConfiguredModelCatalog, n as loadManifestModelCatalog } from "./model-catalog-vYmFg90_.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { o as resolveModelCostConfig, r as estimateUsageCost } from "./usage-format-DT58obO2.mjs";
import "./skill-resources-BYZ-VOKK.mjs";
import { i as toWorkerTranscriptMessage, n as isWorkerTranscriptMessageFrameSafe, o as projectWorkerTextOrImageContent, t as WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE } from "./transcript-message-CWBx4ChQ.mjs";
import { i as parseWorkerLaunchPlan } from "./launch-descriptor-DPZyXmqm.mjs";
import { t as readGitHubPublicationFact } from "./github-publication-discovery-Byp0fSsI.mjs";
import { n as hasAnyAuthProfileStoreSourceAsync } from "./source-check--zMBJ43Q.mjs";
import { i as logWarn, r as logInfo } from "./logger-DHVmYOKs.mjs";
import { n as getGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import { l as resolveFastModeForElapsed } from "./fast-mode-smSVCJXN.mjs";
import { t as resolveFastModeState } from "./fast-mode-DezNRstT.mjs";
import { a as loadExecApprovalsReadOnlyAsync } from "./exec-approvals-store-BhzM_h1C.mjs";
import { r as resolveSandboxToolPolicyForAgent } from "./tool-policy-CGPJHOz_.mjs";
import { s as withSandboxRuntimeStatusInWorker } from "./runtime-status-DWm-5zUj.mjs";
import { s as resolvePreparedExecDefaultsAsync, t as prepareExecDefaults } from "./exec-defaults-DrIV-0KT.mjs";
import { n as readPersistedMediaImageLayout, t as readPersistedImageBlockFactIndexes } from "./prompt-image-metadata-CXanuHpz.mjs";
import { n as resolveDiagnosticModelContentCapturePolicy } from "./diagnostic-llm-content-P2SGagoP.mjs";
import { d as resolveProviderRuntimePluginHandle } from "./provider-hook-runtime-DHSjZAkW.mjs";
import "./failover-error-Bjf0VdY2.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-C65zBDHN.mjs";
import { r as projectWorkerInferenceError, t as boundedWorkerError } from "./worker-error-BrVatFit.mjs";
import { d as stagedInputFileName, o as ensureStagedInputDirectory, u as stagedInputDirectory } from "./staged-inputs-Hv7T90Jl.mjs";
import { h as workerWorkspaceCommandSucceeded, v as workspaceSyncError } from "./workspace-sync-helpers-kRoEflLA.mjs";
import { o as getModelLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import { t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-wDlPVSla.mjs";
import { t as collectTextContentBlocks } from "./content-blocks-DDtxq3Ff.mjs";
import { r as resolveImageSanitizationLimits } from "./image-sanitization-DhkMOJXD.mjs";
import { t as createBoundedRemoteFileReader } from "./remote-workspace-file-Bi0P0wVf.mjs";
import { f as parseReplyDirectives } from "./payloads-CZkv8Yff.mjs";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-B-x-73co.mjs";
import { t as MEDIA_MAX_BYTES } from "./store-BOkrav0N.mjs";
import { i as resolveMediaReferenceLocalPath } from "./media-reference-Dlq4zAi4.mjs";
import { a as readLocalMediaFile } from "./local-media-access-D8o0XeaK.mjs";
import { n as measureAgentRuntimeIdentityTokenBytes, r as mintAgentRuntimeIdentityToken } from "./agent-runtime-identity-token-XE9aO4SS.mjs";
import { a as isWorkerEnvironmentAttachedTo } from "./placement-target-BGdJpPtJ.mjs";
import "./user-turn-transcript-CtVHLnLR.mjs";
import { a as resolveUserTimezone } from "./date-time-B92eHI7U.mjs";
import { a as prepareHarnessContextEnginePrompt, n as bootstrapHarnessContextEngine, o as runHarnessContextEngineMaintenance, r as finalizeHarnessContextEngineTurn } from "./context-engine-lifecycle-8o0i3Txa.mjs";
import { r as prepareSimpleCompletionModel } from "./simple-completion-runtime-2gdDKllV.mjs";
import { t as prepareConversationCapabilityProfile } from "./conversation-capability-profile-BVWQsqkw.mjs";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-C9bjjC7S.mjs";
import { r as messageToolOwnsVisibleReply } from "./source-reply-delivery-mode-CC4nGK9E.mjs";
import { i as createOpenClawCodingToolsInternalAsync } from "./agent-tools-QGgE-Vnu.mjs";
import { r as bindActiveOperatorTurnAuthority } from "./cron-creator-authority-context-B7AqRmnW.mjs";
import { i as createLibrarySkillWorkshopTool } from "./openclaw-tools-lor9xxfh.mjs";
import { m as capturePresenceToolAuthority } from "./sessions-spawn-tool-DhFS9chG.mjs";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-BarAnCx4.mjs";
import { T as releasePendingAgentSteeringItems, t as ackPendingAgentSteeringItems } from "./subagent-registry-CfK3_UcO.mjs";
import { n as supportsModelTools } from "./model-tool-support-DIQSEumC.mjs";
import { i as NODE_WORKER_WORKSPACE_STDOUT_MAX_BYTES, t as DEVICE_FOLDER_ATTACHMENTS_UNSUPPORTED } from "./node-workspace-protocol-FKrTt4nR.mjs";
import { n as projectAgentToolDefinition, t as prepareCoreToolPolicy } from "./prepared-tool-surface-BU-eOKYx.mjs";
import { t as bindHarnessReplyMedia } from "./reply-media-DtJachzW.mjs";
import { t as prepareInstalledSkillCatalog } from "./installed-skill-runtime-Cl4Ax5o3.mjs";
import { n as applyRuntimeContextCarrierRetention } from "./runtime-context-prompt-D_5rC-8c.mjs";
import { O as resolveExistingAttemptTranscriptState, S as resolveEmbeddedAgentStream, a as createOpenAIServiceTierObservationWrapper, i as wrapStreamFnWithDiagnosticModelCallEvents, o as prepareEmbeddedAttemptPromptAssembly, s as prepareEmbeddedAttemptPromptContext, t as prepareEmbeddedAttemptSystemPrompt, z as prepareEmbeddedAttemptBootstrap } from "./attempt-system-prompt-prepare-D8zKFv2e.mjs";
import { t as applyExtraParamsToAgent } from "./extra-params-DHqvlGni.mjs";
import { r as createToolResultPromptProjectionState } from "./session-prompt-state-tij27tsD.mjs";
import { r as buildAfterTurnRuntimeContext, x as mapThinkingLevel } from "./context-engine-maintenance-DybI5s-J.mjs";
import { i as resolveMediaFactLocalRef } from "./images.media-refs-CKLFlAQM.mjs";
import { i as hydratePromptMediaMessages, n as detectAndLoadPromptImages } from "./images-BQVTsQiw.mjs";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-D12sns28.mjs";
import { t as SessionManager } from "./session-manager-Mve5HWCW.mjs";
import { t as SessionTranscriptMessageCommittedError } from "./session-manager-message-error-CdpV1a6G.mjs";
import { i as withSessionManagerWrite } from "./session-manager-write-admission-Ca7jiEvG.mjs";
import { t as buildAgentHookContext } from "./hook-context-Ba23fAgX.mjs";
import { t as resolveTranscriptPolicy } from "./transcript-policy-DzNWptYX.mjs";
import { r as mergeUsageIntoAccumulator, t as createUsageAccumulator } from "./usage-accumulator-Cd3yWsMu.mjs";
import { a as buildUsageAgentMetaFields, l as resolveFinalAssistantRawText, m as resolveReportedModelRef, u as resolveFinalAssistantVisibleText } from "./helpers-3t21Jnao.mjs";
import "./messages-CZ7XNOd9.mjs";
import { n as runBeforeAgentRunGate, t as buildAgentRunBlockedUserMessage } from "./before-agent-run-CCn_GAdw.mjs";
import { n as prepareAgentToolSurfacePresentation, t as createAgentHarnessToolSurfaceRuntimeCore } from "./tool-surface-bridge-DwhzBhjb.mjs";
import { t as registerProviderStreamForModel } from "./provider-stream-DNRYHaZ0.mjs";
import { n as createPreparedEmbeddedAgentSettingsManager } from "./agent-project-settings-BRSKWrAu.mjs";
import { t as resolveSessionBoundaryPromptCacheKey } from "./session-boundary-prompt-cache-key-xrPTEs08.mjs";
import { t as prepareAgentPromptProjects } from "./prompt-projects-CmyCl0nZ.mjs";
import { n as admitEmbeddedContextEngine, r as buildEmbeddedRunBlockedResult, t as prepareAttemptSystemPromptAdditions } from "./attempt-system-prompt-additions-DnfPJfiH.mjs";
import { n as prepareSkillResourceDelivery } from "./resources-B8SeIb4_.mjs";
import { a as parseWorkerRuntimeResult } from "./worker-process-protocol-mSTbCXrT.mjs";
import { n as resolveSessionAuthSelection } from "./session-override-CZTCnQMa.mjs";
import { n as workerInferencePlacement } from "./inference-placement-C1SOuYae.mjs";
import { v as sameWorkerSessionTurnClaim } from "./placement-record-CBaaHws5.mjs";
import { t as WorkerNodeLostError } from "./worker-node-loss-DmwJygIh.mjs";
import { r as resolveWorkerTurnTranscriptTarget, t as captureWorkerTurnTranscriptSource } from "./worker-turn-transcript-target-D5zatewR.mjs";
import { i as requireCurrentWorkerTurnEnvironment, n as StaleWorkerBuildError } from "./admission-C4XP6xqG.mjs";
import { _ as waitForTurnOperation, d as releaseClaimIfOwned, t as WorkerTurnExecutionError } from "./worker-turn-failure-CRrG7zhu.mjs";
import { n as inferenceError, r as projectWorkerInferenceTerminalMessage, t as ERROR_MESSAGES } from "./inference-terminal-message-DZY06jMs.mjs";
import { n as boundWorkerToolResult, s as workerSessionToolErrorResult } from "./worker-session-tool-result-CIep8T6p.mjs";
import { a as createWorkerPlacementTools, n as createWorkerBrowserToolDefinition, t as createWorkerComputerTool } from "./computer-runtime-Bl4eBv75.mjs";
import { n as windowWorkerReplayMessages, t as fitWorkerReplayImages } from "./replay-message-window-fUQVmnF7.mjs";
import { i as workerWorkspaceFailure, n as reconcileWorkspaceAfterTurn, r as recoverWorkspaceBeforeTurn } from "./workspace-result-finalize-5FnCmPil.mjs";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { tempWorkspace } from "@openclaw/fs-safe/temp";
import { Value } from "typebox/value";
import { normalizeCodexResponsesBaseUrlForOpenAISdk } from "@openclaw/ai/transports";
import { isAnthropicOAuthApiKey } from "@openclaw/ai/internal/anthropic";
//#region src/gateway/worker-environments/worker-desktop-launch-plan.ts
async function prepareWorkerDesktopLaunchPlan(params) {
	const preparedComputer = params.turn.modelHasVision !== false && params.protocolFeatures.includes("worker-computer-v1") ? await params.prepareComputer() : void 0;
	const browserApp = params.desktop?.apps?.find((app) => app.id === "browser");
	const browserAvailable = browserApp !== void 0 && params.turn.config?.browser?.enabled !== false && resolveManifestActivationPluginIds({
		trigger: {
			kind: "capability",
			capability: "tool"
		},
		config: params.turn.config,
		onlyPluginIds: ["browser"]
	}).includes("browser");
	const computer = preparedComputer?.descriptor;
	const browser = browserAvailable ? {
		cdpUrl: `http://127.0.0.1:${browserApp.cdpPort}`,
		launcherPath: browserApp.executablePath,
		...browserApp.args ? { launcherArgs: [...browserApp.args] } : {}
	} : void 0;
	const placementOnly = async () => {
		throw new Error("This tool executes at the placement");
	};
	const tools = browser ? [{
		...createWorkerBrowserToolDefinition(browser),
		execute: placementOnly
	}] : [];
	if (computer) tools.push(createWorkerComputerTool({
		descriptor: computer,
		requestComputer: placementOnly,
		runId: params.turn.runId,
		registerRunCleanup: () => void 0
	}));
	return {
		computer,
		preparedComputer,
		browser,
		tools
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-gateway-tool-runtime.ts
/** Retained by the admitted turn owner; neither IDs nor a prepared catalog grant authority. */
function createWorkerGatewayToolRuntime(params) {
	const generation = randomUUID();
	const lifetime = new AbortController();
	const signal = AbortSignal.any([params.signal, lifetime.signal]);
	const assertCurrent = (callSignal) => {
		signal.throwIfAborted();
		params.assertCurrent();
		callSignal?.throwIfAborted();
	};
	let prepared;
	let modelTools;
	let issuedTools;
	let preparedSurface;
	let inheritedPublicationTool;
	const calls = /* @__PURE__ */ new Map();
	let sequential = Promise.resolve();
	return {
		applyPromptToolsAllow(toolsAllow) {
			assertCurrent();
			const handles = issuedTools;
			if (!handles || !preparedSurface) throw new Error("Worker tools have not been prepared");
			if (toolsAllow === void 0) return [...handles.values()].map((tool) => tool.name);
			const allowed = new Set(applyEmbeddedAttemptToolsAllow([...handles.values()], toolsAllow).map((tool) => tool.name));
			if (inheritedPublicationTool) inheritedPublicationTool = applyEmbeddedAttemptToolsAllow([inheritedPublicationTool], toolsAllow)[0];
			for (const [id, tool] of handles) if (!allowed.has(tool.name)) handles.delete(id);
			preparedSurface.tools = preparedSurface.tools.filter((tool) => handles.has(tool.id));
			modelTools = void 0;
			return [...allowed];
		},
		getInheritedPublicationToolName() {
			assertCurrent();
			return inheritedPublicationTool?.name;
		},
		async getSurface(identity) {
			assertCurrent();
			const surface = await (prepared ??= params.prepare(identity).then(({ tools, policy, presentation, inheritedPublicationTool: publicationTool }) => {
				assertCurrent();
				const handles = /* @__PURE__ */ new Map();
				const catalog = {
					generation,
					policy,
					presentation,
					tools: tools.map((tool, index) => {
						const location = getAgentToolExecutionLocation(tool);
						const plugin = getPluginToolMeta(tool);
						const id = String(index);
						handles.set(id, tool);
						return {
							id,
							execution: location.kind,
							plugin: plugin ? Value.Clean(WorkerToolSurfaceSchema.properties.tools.items.properties.plugin, structuredClone(plugin)) : void 0,
							...location.kind === "gateway" && location.replay ? { replay: true } : {},
							...location.kind === "gateway" && location.timeout ? { timeout: location.timeout } : {},
							definition: {
								...projectAgentToolDefinition(tool),
								outputSchema: tool.outputSchema,
								catalogMode: tool.catalogMode
							}
						};
					})
				};
				if (!Value.Check(WorkerToolSurfaceSchema, catalog)) throw new Error("Worker tool surface is invalid");
				issuedTools = handles;
				preparedSurface = catalog;
				inheritedPublicationTool = publicationTool;
				return catalog;
			}));
			assertCurrent();
			return surface;
		},
		async getPromptProjection(identity) {
			const surface = await this.getSurface(identity);
			assertCurrent();
			if (!modelTools) {
				const runtime = createAgentHarnessToolSurfaceRuntimeCore({
					presentation: surface.presentation,
					supportsDeferredToolCalls: false,
					modelToolsEnabled: surface.tools.length > 0,
					contextTokenBudget: surface.policy.modelContextWindowTokens
				});
				try {
					const execute = () => Promise.reject(/* @__PURE__ */ new Error("Schema projection cannot execute tools"));
					const tools = surface.tools.map(({ definition, plugin }) => {
						const tool = Object.assign({ execute }, definition);
						if (plugin) setPluginToolMeta(tool, plugin);
						return tool;
					});
					const projected = runtime.compactTools(tools, { prepared: { preserveToolNames: [] } }).promptToolPolicy.apply();
					modelTools = {
						tools: projected.tools.map(({ name, description, parameters }) => ({
							name,
							description,
							parameters
						})),
						toolSchemaDirectoryPrompt: projected.toolSchemaDirectoryPrompt
					};
				} finally {
					runtime.cleanup();
				}
			}
			return modelTools;
		},
		async invoke(_identity, request, sink, connectionSignal) {
			assertCurrent();
			const tool = issuedTools?.get(request.toolId);
			const location = tool && getAgentToolExecutionLocation(tool);
			if (request.generation !== generation || !tool || location?.kind !== "gateway") throw new Error("Worker tool handle is unavailable");
			if (!Value.Check(tool.parameters, request.arguments)) throw new Error("Worker tool arguments are invalid");
			const digest = JSON.stringify([request.toolId, request.arguments]);
			const prior = calls.get(request.toolCallId);
			if (prior && prior.digest !== digest) throw new Error("Worker tool call id was reused with different arguments");
			if (prior) {
				prior.sinks.add(sink);
				const result = await prior.result;
				assertCurrent(prior.signal);
				return result;
			}
			if (calls.size >= 4) throw new Error("Too many worker tool operations are already in progress");
			const controller = new AbortController();
			const callSignal = AbortSignal.any([
				signal,
				controller.signal,
				...location.connectionScoped && connectionSignal ? [connectionSignal] : []
			]);
			const sinks = /* @__PURE__ */ new Set([sink]);
			let seq = 0;
			const execute = async () => {
				assertCurrent(callSignal);
				try {
					return boundWorkerToolResult(await tool.execute(request.toolCallId, request.arguments, callSignal, (update) => {
						assertCurrent(callSignal);
						const frame = {
							type: "event",
							event: "worker.gatewayTool.update",
							payload: {
								generation,
								toolCallId: request.toolCallId,
								seq: ++seq,
								result: boundWorkerToolResult(update)
							}
						};
						if (isWorkerGatewayToolFrameWithinBudget(frame, frame.payload.result)) for (const listener of sinks) try {
							listener.send(frame);
						} catch {
							sinks.delete(listener);
						}
					}));
				} catch (error) {
					return workerSessionToolErrorResult(error);
				} finally {
					assertCurrent();
				}
			};
			const result = (tool.executionMode === "parallel" ? sequential : Promise.allSettled([...calls.values()].map((call) => call.result))).then(execute);
			if (tool.executionMode !== "parallel") sequential = result.catch(() => void 0);
			calls.set(request.toolCallId, {
				digest,
				controller,
				signal: callSignal,
				sinks,
				result
			});
			try {
				const value = await result;
				assertCurrent(callSignal);
				return value;
			} finally {
				calls.delete(request.toolCallId);
			}
		},
		cancel(request) {
			assertCurrent();
			if (request.generation !== generation) throw new Error("Worker tool generation is unavailable");
			const call = calls.get(request.toolCallId);
			call?.controller.abort(/* @__PURE__ */ new Error("Worker tool call cancelled"));
			return { cancelled: Boolean(call) };
		},
		abort() {
			lifetime.abort(/* @__PURE__ */ new Error("Worker tool surface closed"));
		},
		async close() {
			lifetime.abort(/* @__PURE__ */ new Error("Worker tool surface closed"));
			await Promise.allSettled([...calls.values()].map((call) => call.result));
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-reply-media.ts
function createWorkerReplyMedia(params) {
	const { assertCurrent } = params;
	const readFile = createBoundedRemoteFileReader({
		outputBytesCap: NODE_WORKER_WORKSPACE_STDOUT_MAX_BYTES,
		assertCurrent,
		execute: async (argv, options) => {
			const result = await params.tunnel.runWorkspaceCommand({
				argv,
				...options,
				assertCurrent,
				transportRetry: "idempotent"
			});
			if (!workerWorkspaceCommandSucceeded(result) || result.stdoutTruncatedBytes) throw workspaceSyncError(result);
			return result.stdout;
		}
	});
	const prepare = bindHarnessReplyMedia({
		attempt: params.turn,
		config: params.turn.config,
		assertActive: assertCurrent,
		signal: params.signal
	});
	return async (payload) => {
		if (!payload.mediaUrl && !payload.mediaUrls?.length && !parseReplyDirectives(payload.text ?? "").mediaUrls?.length) return payload;
		const prepared = await prepare?.({
			kind: "payload",
			payload,
			workspaceRoot: params.remoteWorkspaceDir,
			readWorkspaceFile: (relativePath, options) => readFile({
				path: relativePath.split(path.sep).join("/"),
				workspaceRoot: params.remoteWorkspaceDir,
				...options,
				timeoutMs: 6e4
			})
		});
		if (prepared?.kind !== "payload") throw new Error("Worker reply media preparation is unavailable");
		return prepared.payload;
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-tool-authority.ts
async function resolveWorkerToolAuthority(params) {
	const turn = params.turn;
	const authSourceAgentDir = turn.agentDir?.trim();
	const authProfileStoreSource = authSourceAgentDir ? await hasAnyAuthProfileStoreSourceAsync(authSourceAgentDir) : false;
	params.assertCurrent();
	turn.abortSignal?.throwIfAborted();
	const sandboxSessionKey = turn.sandboxSessionKey?.trim() || turn.sessionKey?.trim() || turn.sessionId;
	return withSandboxRuntimeStatusInWorker({
		cfg: turn.config,
		sessionKey: sandboxSessionKey,
		agentId: turn.agentId
	}, {
		env: process.env,
		cwd: process.cwd(),
		assertCurrent: params.assertCurrent
	}, async (sandbox) => {
		const capabilityProfile = await prepareConversationCapabilityProfile({
			...turn,
			sandboxSessionKey,
			sessionKey: sandboxSessionKey,
			runSessionKey: turn.sessionKey,
			agentId: turn.sandboxAgentId ?? turn.agentId,
			modelProvider: params.modelRef.provider,
			modelId: params.modelRef.model,
			sandboxToolPolicy: sandbox.sandboxed ? resolveSandboxToolPolicyForAgent(turn.config, sandbox.classificationAgentId, { containedToolNames: params.computerAvailable ? ["computer"] : [] }) : void 0,
			runtimeToolAllowlist: turn.toolsAllow,
			inheritRuntimeToolAllowlist: true
		});
		if (capabilityProfile.policy.delegatedToolPolicy) throw new Error("Worker execution cannot enforce a delegated tool grant. Run this session locally.");
		const contextWindow = resolveContextTokensForModel({
			cfg: turn.config ?? {},
			provider: params.modelRef.provider,
			model: params.modelRef.model,
			allowAsyncLoad: false
		}) ?? 2e5;
		const corePolicy = prepareCoreToolPolicy({
			...turn,
			agentId: capabilityProfile.policy.agentId,
			sessionPermissionPolicy: turn.permissionMode ? {
				mode: turn.permissionMode,
				root: turn.workspaceDir
			} : void 0,
			modelProvider: params.modelRef.provider,
			modelId: params.modelRef.model,
			modelContextWindowTokens: Math.min(contextWindow, turn.contextTokenBudget ?? contextWindow)
		});
		const defaults = await resolvePreparedExecDefaultsAsync(prepareExecDefaults({
			...turn,
			cfg: turn.config,
			sessionEntry: turn.execSession,
			sessionKey: sandboxSessionKey
		}, sandbox), loadExecApprovalsReadOnlyAsync);
		const policy = projectEffectiveExecPolicy({
			base: {
				...defaults,
				host: defaults.effectiveHost
			},
			scheduledExecTarget: turn.scheduledToolPolicy?.execTarget
		});
		const execUnavailable = policy.ask === "always" || turn.scheduledToolPolicy?.execTarget !== void 0 && defaults.effectiveHost !== "gateway";
		const { effectiveHost: host, security, node: configuredNode } = defaults;
		const node = configuredNode?.trim();
		const exec = {
			security,
			ask: policy.ask ?? defaults.ask,
			safeBins: [],
			...host === "node" ? {
				host,
				...node ? { node } : {}
			} : { host }
		};
		if (execUnavailable) logWarn("Worker exec/process withheld: captured exec policy requires local host or interactive approval. Run this turn locally.");
		const presentation = prepareAgentToolSurfacePresentation({
			...turn,
			agentId: params.placement.agentId,
			sessionKey: turn.sandboxSessionKey ?? params.placement.sessionKey,
			model: params.model,
			modelProvider: params.modelRef.provider,
			modelId: params.modelRef.model,
			toolsEnabled: supportsModelTools(params.model ?? {}),
			forceDirectMessageTool: messageToolOwnsVisibleReply(turn),
			isRawModelRun: turn.modelRun === true || turn.promptMode === "none",
			forceCodeModeControls: turn.forceCodeModeTools
		});
		const installedSkills = prepareInstalledSkillCatalog({
			snapshot: turn.skillsSnapshot,
			workspaceDir: turn.bootstrapWorkspaceDir ?? turn.workspaceDir,
			assertCurrent: params.assertCurrent
		});
		presentation.skills = installedSkills.map(({ name, description, location }) => ({
			name,
			description,
			location
		}));
		return {
			authProfileStoreSource,
			capabilityProfile,
			policy: corePolicy,
			exec,
			execUnavailable,
			presentation,
			installedSkills
		};
	});
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-media.ts
const MAX_WORKER_ATTACHMENT_BYTES = 268435456;
const MAX_WORKER_ATTACHMENT_FILES = 25e3;
function prepareInput(content, media, modelHasVision, imageFactIndexes) {
	const parts = (typeof content === "string" ? [{
		type: "text",
		text: content
	}] : content).filter((part) => modelHasVision || part.type !== "image");
	return {
		parts,
		media,
		unownedImages: parts.filter((part) => part.type === "image").filter((_image, index) => {
			const factIndex = imageFactIndexes?.[index];
			return factIndex == null || !resolveMediaFactLocalRef(media[factIndex]);
		}),
		files: /* @__PURE__ */ new Set()
	};
}
/** Prepare transient worker input; canonical media paths and transcript bytes stay on the Gateway. */
async function prepareWorkerTurnMedia(params) {
	const { turn, signal } = params;
	const assertCurrent = () => {
		signal.throwIfAborted();
		if (!params.isAuthorized()) throw new Error("Worker media preparation lost its active placement or turn claim");
	};
	assertCurrent();
	const recorded = turn.userTurnTranscriptRecorder?.message ?? await turn.userTurnTranscriptRecorder?.resolveMessage();
	assertCurrent();
	const recordedMedia = recorded ? readPersistedMediaFacts(recorded) : void 0;
	const media = recordedMedia?.length ? applyRunHydrationSuppression(recordedMedia, turn.media) : turn.media ?? [];
	const localWorkspace = params.workspace.kind === "local" ? params.workspace.path : void 0;
	const deviceFolder = params.workspace.kind === "device-folder";
	const localRoots = resolveEffectiveToolFsWorkspaceOnly({
		cfg: turn.config,
		agentId: turn.agentId
	}) ? localWorkspace ? [localWorkspace] : [] : [...getAgentScopedMediaLocalRoots(turn.config ?? {}, turn.agentId), ...localWorkspace ? [localWorkspace] : []];
	const modelHasVision = turn.modelHasVision === true;
	const mediaOptions = {
		workspaceDir: localWorkspace ?? params.remoteWorkspaceDir,
		model: { input: modelHasVision ? ["text", "image"] : ["text"] },
		maxBytes: MAX_IMAGE_BYTES,
		maxDimensionPx: resolveImageSanitizationLimits(turn.config).maxDimensionPx,
		localRoots
	};
	const currentImages = await detectAndLoadPromptImages({
		...mediaOptions,
		prompt: turn.prompt,
		existingImages: turn.images,
		imageOrder: turn.imageOrder,
		media,
		mediaImageLayout: recorded ? readPersistedMediaImageLayout(recorded) : void 0
	});
	assertCurrent();
	if (currentImages.failedMediaCount) throw new Error(`Cloud worker could not load ${currentImages.failedMediaCount} image attachment(s); resend the attachment and retry.`);
	const history = await hydratePromptMediaMessages(params.history, mediaOptions);
	assertCurrent();
	const current = prepareInput([{
		type: "text",
		text: turn.prompt
	}, ...currentImages.images], media, modelHasVision, currentImages.imageFactIndexes);
	const replay = new Map(history.flatMap((message) => message.role === "user" ? [[message, prepareInput(message.content, readPersistedMediaFacts(message) ?? [], modelHasVision, readPersistedImageBlockFactIndexes(message))]] : []));
	const inputs = [current, ...replay.values()];
	const projectedPaths = /* @__PURE__ */ new Map();
	let staging;
	try {
		let bytes = 0;
		const stagedPaths = /* @__PURE__ */ new Set();
		const stageFile = async (data, identity, fileName) => {
			assertCurrent();
			const directory = stagedInputDirectory(identity);
			const relative = path.posix.join(directory, stagedInputFileName(fileName));
			const remotePath = path.posix.isAbsolute(params.remoteWorkspaceDir) ? path.posix.join(params.remoteWorkspaceDir, relative) : path.win32.join(params.remoteWorkspaceDir, ...relative.split("/"));
			if (stagedPaths.has(remotePath)) return remotePath;
			bytes += data.length;
			if (bytes > MAX_WORKER_ATTACHMENT_BYTES || stagedPaths.size >= MAX_WORKER_ATTACHMENT_FILES) throw new Error("Cloud worker attachments exceed the workspace transfer budget; send fewer or smaller files.");
			staging ??= await tempWorkspace({
				rootDir: resolvePreferredOpenClawTmpDir(),
				prefix: "worker-attachments-"
			});
			const destination = path.join(staging.dir, ...relative.split("/"));
			assertCurrent();
			await ensureStagedInputDirectory(staging.dir, directory, signal);
			assertCurrent();
			await fs.writeFile(destination, data, {
				mode: 384,
				signal
			});
			stagedPaths.add(remotePath);
			return remotePath;
		};
		for (const input of deviceFolder ? [current] : inputs) {
			for (const fact of input.media) {
				const ref = resolveMediaFactLocalRef(fact);
				if (!ref) continue;
				let remotePath = projectedPaths.get(ref.raw);
				if (!remotePath) {
					let source;
					let data;
					try {
						source = path.resolve(fact.workspaceDir ?? localWorkspace ?? params.remoteWorkspaceDir, await resolveMediaReferenceLocalPath(ref.resolved));
						assertCurrent();
						data = await readLocalMediaFile(source, localRoots, { maxBytes: Math.max(MAX_IMAGE_BYTES, MEDIA_MAX_BYTES) });
					} catch (error) {
						assertCurrent();
						if (input === current) throw error;
						logWarn("worker-media: Omitted an unavailable historical attachment source");
						continue;
					}
					assertCurrent();
					const identity = createHash("sha256").update(source).digest("hex");
					remotePath = await stageFile(data, identity, path.basename(source));
					for (const alias of [
						ref.raw,
						ref.resolved,
						source,
						fact.path,
						fact.url
					]) if (alias) projectedPaths.set(alias, remotePath);
				}
				input.files.add(remotePath);
			}
			for (const image of input.unownedImages) {
				const data = Buffer.from(image.data, "base64");
				const identity = createHash("sha256").update(data).digest("hex");
				input.files.add(await stageFile(data, identity, "image"));
			}
		}
		if (staging && deviceFolder) throw new Error(DEVICE_FOLDER_ATTACHMENTS_UNSUPPORTED);
		if (staging) {
			if (!params.tunnel.stageAttachments) throw new Error("Worker transport cannot stage attachments; update and reprovision the worker.");
			assertCurrent();
			await params.tunnel.stageAttachments({
				localPath: staging.dir,
				isAuthorized: params.isAuthorized,
				signal
			});
		}
	} finally {
		await staging?.cleanup();
	}
	assertCurrent();
	const projectText = (text) => {
		let projected = text;
		for (const [source, destination] of projectedPaths) projected = projected.replaceAll(source, destination);
		return projected;
	};
	const projectInput = (input) => {
		const parts = input.parts.map(projectWorkerTextOrImageContent);
		for (const part of parts) if (part.type === "text") part.text = projectText(part.text);
		const text = parts.flatMap((part) => part.type === "text" ? [part.text] : []).join("\n");
		const notes = [...input.files].filter((file) => !text.includes(file)).map((file) => `[media attached: ${file}]`).join("\n");
		if (notes) {
			const index = parts.findIndex((part) => part.type === "text");
			const part = parts[index];
			if (part?.type === "text") parts[index] = {
				...part,
				text: [part.text, notes].filter(Boolean).join("\n")
			};
			else parts.unshift({
				type: "text",
				text: notes
			});
		}
		return parts;
	};
	const prompt = projectInput(current);
	if (!isWorkerTranscriptMessageFrameSafe({
		role: "user",
		content: prompt,
		timestamp: Date.now()
	})) throw new Error("Cloud worker input exceeds its 25 MiB image or 64 KiB text/control limit; send fewer or smaller attachments.");
	return {
		images: currentImages.images,
		imageFactIndexes: currentImages.imageFactIndexes,
		prompt: prompt.length === 1 && prompt[0]?.type === "text" ? prompt[0].text : prompt,
		history: history.map((message) => {
			const input = message.role === "user" ? replay.get(message) : void 0;
			return input ? Object.assign({}, message, { content: projectInput(input) }) : message;
		})
	};
}
//#endregion
//#region src/gateway/worker-environments/inference-model.ts
async function resolveApprovedWorkerModelSelection(params) {
	const { target, modelRef, runtimeSnapshot } = params;
	const sessionEntry = target.sessionEntry ?? await readSessionEntryInWorker(target, params.assertCurrent);
	if (sessionEntry?.sessionId !== target.sessionId) return;
	params.assertCurrent();
	const lifecycleConfig = runtimeSnapshot.config;
	const agentDir = runtimeSnapshot.agentDir;
	const workspaceDir = runtimeSnapshot.workspaceDir ?? resolveAgentWorkspaceDir(lifecycleConfig, target.agentId);
	const selection = {
		cfg: lifecycleConfig,
		agentId: target.agentId,
		manifestPlugins: runtimeSnapshot.metadataSnapshot,
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION
	};
	const defaultModel = resolveDefaultModelForAgent(selection);
	const policy = createModelVisibilityPolicy({
		...selection,
		catalog: runtimeSnapshot.modelCatalog.entries,
		defaultProvider: defaultModel.provider,
		defaultModel
	});
	const resolved = resolveModelRefFromString({
		...selection,
		raw: `${modelRef.provider}/${modelRef.model}`,
		defaultProvider: defaultModel.provider,
		aliasIndex: policy.selectionAliasIndex
	});
	if (!resolved || normalizeProviderId(resolved.ref.provider) !== normalizeProviderId(modelRef.provider)) return;
	const resolvedKey = resolveModelCatalogIdentityKey({
		provider: resolved.ref.provider,
		id: resolved.ref.model
	});
	if (!(policy.allowedCatalog.some((entry) => resolvedKey === resolveModelCatalogIdentityKey(entry)) || policy.retainedKeys.has(resolvedKey)) || !policy.allows(resolved.ref)) return;
	return {
		sessionEntry,
		lifecycleConfig,
		agentDir,
		workspaceDir,
		resolved,
		harnessPolicy: resolveAgentHarnessPolicy({
			provider: resolved.ref.provider,
			modelId: resolved.ref.model,
			config: lifecycleConfig,
			agentId: target.agentId,
			sessionKey: target.sessionKey
		})
	};
}
async function resolveApprovedWorkerLocalModel(params) {
	const { runtimeSnapshot } = params;
	return await withPluginRuntimeGenerationScope(runtimeSnapshot, async () => {
		const approved = await resolveApprovedWorkerModelSelection(params);
		if (!approved) return;
		const { lifecycleConfig, workspaceDir, resolved } = approved;
		const model = runtimeSnapshot.findConfiguredRuntimeModel(resolved.ref.provider, resolved.ref.model);
		if (!model) return { error: `Worker-local inference model ${resolved.ref.provider}/${resolved.ref.model} is missing from the Gateway model catalog. Add its metadata under models.providers in the Gateway openclaw.json; keep its endpoint and credentials only on the node.` };
		return {
			transcriptPolicy: resolveTranscriptPolicy({
				provider: resolved.ref.provider,
				modelId: resolved.ref.model,
				modelApi: model.api,
				model,
				config: lifecycleConfig,
				workspaceDir,
				directApiKey: false
			}),
			model
		};
	});
}
async function resolveApprovedWorkerModel(params) {
	const { target, signal, runtimeSnapshot, modelRef } = params;
	return await withPluginRuntimeGenerationScope(runtimeSnapshot, async () => {
		const approved = await resolveApprovedWorkerModelSelection(params);
		if (!approved) return;
		const { sessionEntry, lifecycleConfig, agentDir, workspaceDir, resolved, harnessPolicy } = approved;
		const agentRuntimeId = harnessPolicy.runtimeSource !== "implicit" || lifecycleConfig.plugins?.entries?.codex?.enabled === true ? harnessPolicy.runtime : void 0;
		const sessionSelection = await resolveSessionAuthSelection({
			cfg: lifecycleConfig,
			provider: resolved.ref.provider,
			modelId: resolved.ref.model,
			agentId: target.agentId,
			harnessRuntime: harnessPolicy.runtime,
			agentDir,
			sessionEntry,
			sessionStore: { [target.sessionKey]: sessionEntry },
			sessionKey: target.sessionKey,
			storePath: target.storePath,
			assertCommitAllowed: params.assertCurrent,
			isNewSession: false
		});
		params.assertCurrent();
		const selectedProfileId = sessionSelection?.profileId;
		const routeRequirement = sessionSelection?.routeRequirement;
		let modelConfig = lifecycleConfig;
		const routeResolution = routeRequirement ? resolveProviderModelRoutes({
			provider: resolved.ref.provider,
			modelId: resolved.ref.model,
			config: lifecycleConfig
		}) : void 0;
		const route = routeResolution?.kind === "routes" ? routeResolution.routes.find((candidate) => candidate.authRequirement === routeRequirement) : void 0;
		if (route) modelConfig = projectProviderModelRouteConfig({
			provider: resolved.ref.provider,
			config: lifecycleConfig,
			route
		});
		const prepared = await prepareSimpleCompletionModel({
			workerInferenceAuthority: { assertCurrent: params.assertCurrent },
			cfg: modelConfig,
			transport: "provider-stream",
			agentId: target.agentId,
			provider: resolved.ref.provider,
			modelId: resolved.ref.model,
			agentDir,
			modelIdSource: "selected",
			...selectedProfileId ? {
				profileId: selectedProfileId,
				preferredProfile: selectedProfileId,
				bindAuthOwner: true
			} : {},
			allowMissingApiKeyModes: ["aws-sdk"],
			allowBundledStaticCatalogFallback: true,
			signal,
			preparedModelRuntime: runtimeSnapshot,
			workspaceDir,
			...agentRuntimeId ? { agentRuntimeId } : {}
		});
		params.assertCurrent();
		if ("error" in prepared) return prepared;
		return {
			transcriptPolicy: resolveTranscriptPolicy({
				provider: resolved.ref.provider,
				modelId: resolved.ref.model,
				modelApi: prepared.model.api,
				model: prepared.model,
				config: lifecycleConfig,
				workspaceDir,
				directApiKey: Boolean(prepared.auth.apiKey) && !isAnthropicOAuthApiKey(prepared.auth.apiKey)
			}),
			provider: resolved.ref.provider,
			model: resolved.ref.model,
			workspaceDir,
			modelRef,
			runtimeSnapshot,
			sessionEntry,
			prepared
		};
	});
}
//#endregion
//#region src/gateway/worker-environments/inference-tool-call-stream.ts
const MAX_PENDING_TOOL_DELTA_BYTES = 1048576;
const MAX_PENDING_TOOL_DELTAS = 4096;
const MAX_STREAMED_TOOL_DELTAS = 65536;
const RETAINED_TOOL_ARGUMENT_CHUNK_BYTES = 16384;
function createWorkerToolCallStream(params) {
	const pendingDeltas = /* @__PURE__ */ new Map();
	let pendingDeltaBytes = 0;
	let pendingDeltaCount = 0;
	const ended = /* @__PURE__ */ new Set();
	const identities = /* @__PURE__ */ new Map();
	const emittedArgumentChunks = /* @__PURE__ */ new Map();
	let retainedArgumentBytes = 0;
	let streamedDeltaCount = 0;
	const emitDelta = (contentIndex, delta) => {
		if (!params.isCurrent()) return "cancelled";
		if (streamedDeltaCount + 1 > MAX_STREAMED_TOOL_DELTAS) return "invalid";
		streamedDeltaCount += 1;
		const deltaBytes = Buffer.byteLength(delta, "utf8");
		if (deltaBytes === 0) return params.isCurrent() ? "ok" : "cancelled";
		if (retainedArgumentBytes + deltaBytes > MAX_PENDING_TOOL_DELTA_BYTES) return "invalid";
		params.emit({
			type: "toolcall_delta",
			contentIndex,
			delta
		});
		const emitted = emittedArgumentChunks.get(contentIndex) ?? [];
		const last = emitted.at(-1);
		if (last && last.bytes + deltaBytes <= RETAINED_TOOL_ARGUMENT_CHUNK_BYTES) {
			last.text += delta;
			last.bytes += deltaBytes;
		} else emitted.push({
			text: delta,
			bytes: deltaBytes
		});
		emittedArgumentChunks.set(contentIndex, emitted);
		retainedArgumentBytes += deltaBytes;
		return params.isCurrent() ? "ok" : "cancelled";
	};
	const start = (contentIndex, partial) => {
		if (identities.has(contentIndex)) return params.isCurrent() ? "ok" : "cancelled";
		const content = partial.content[contentIndex];
		if (content?.type !== "toolCall" || !content.id || !content.name) return "invalid";
		if (!params.isCurrent()) return "cancelled";
		identities.set(contentIndex, {
			id: content.id,
			name: content.name
		});
		params.emit({
			type: "toolcall_start",
			contentIndex,
			id: content.id,
			toolName: content.name
		});
		if (!params.isCurrent()) return "cancelled";
		for (const delta of pendingDeltas.get(contentIndex) ?? []) {
			const result = emitDelta(contentIndex, delta);
			pendingDeltaBytes -= Buffer.byteLength(delta, "utf8");
			pendingDeltaCount -= 1;
			if (result !== "ok") return result;
		}
		pendingDeltas.delete(contentIndex);
		return "ok";
	};
	const delta = (contentIndex, value, partial) => {
		if (ended.has(contentIndex)) return "invalid";
		if (identities.has(contentIndex)) return emitDelta(contentIndex, value);
		const pending = pendingDeltas.get(contentIndex) ?? [];
		pendingDeltaBytes += Buffer.byteLength(value, "utf8");
		pendingDeltaCount += 1;
		if (pendingDeltaBytes > MAX_PENDING_TOOL_DELTA_BYTES || pendingDeltaCount > MAX_PENDING_TOOL_DELTAS) return "invalid";
		pending.push(value);
		pendingDeltas.set(contentIndex, pending);
		const result = start(contentIndex, partial);
		return result === "invalid" ? "ok" : result;
	};
	const reconcile = (contentIndex, complete) => {
		const identity = identities.get(contentIndex);
		if (!identity || identity.id !== complete.id || identity.name !== complete.name) return "invalid";
		const emittedJson = (emittedArgumentChunks.get(contentIndex) ?? []).map((chunk) => chunk.text).join("");
		if (!emittedJson) try {
			const completeJson = JSON.stringify(complete.arguments);
			return typeof completeJson === "string" ? emitDelta(contentIndex, completeJson) : "invalid";
		} catch {
			return "invalid";
		}
		try {
			return isDeepStrictEqual(JSON.parse(emittedJson), complete.arguments) ? params.isCurrent() ? "ok" : "cancelled" : "invalid";
		} catch {
			return "invalid";
		}
	};
	const end = (contentIndex, partial, complete) => {
		if (ended.has(contentIndex)) return reconcile(contentIndex, complete);
		const startResult = start(contentIndex, partial);
		if (startResult !== "ok") return startResult;
		const reconcileResult = reconcile(contentIndex, complete);
		if (reconcileResult !== "ok") return reconcileResult;
		ended.add(contentIndex);
		params.emit({
			type: "toolcall_end",
			contentIndex
		});
		return params.isCurrent() ? "ok" : "cancelled";
	};
	return {
		delta,
		end,
		matchesTerminal: (message) => {
			const terminal = new Set(message.content.flatMap((content, contentIndex) => content.type === "toolCall" ? [contentIndex] : []));
			return pendingDeltas.size === 0 && terminal.size === identities.size && [...identities.keys()].every((contentIndex) => terminal.has(contentIndex) && ended.has(contentIndex));
		},
		start
	};
}
//#endregion
//#region src/gateway/worker-environments/inference-runtime.ts
function buildContext(context) {
	const tools = [];
	for (const tool of context.tools ?? []) {
		if (!isRecord(tool.parameters) || tool.parameters.type !== "object") return;
		tools.push({
			name: tool.name,
			description: tool.description,
			parameters: structuredClone(tool.parameters)
		});
	}
	return {
		...context.systemPrompt !== void 0 ? { systemPrompt: context.systemPrompt } : {},
		messages: structuredClone(context.messages),
		...tools.length > 0 ? { tools } : {}
	};
}
function toWorkerStreamEvent(event, modelIdentity) {
	switch (event.type) {
		case "start": return {
			type: "start",
			resolvedModel: {
				api: modelIdentity.api,
				provider: modelIdentity.provider,
				model: modelIdentity.model
			},
			timestamp: event.partial.timestamp
		};
		case "text_start":
		case "text_end":
		case "thinking_end": {
			const content = event.partial.content[event.contentIndex];
			const signature = event.type === "thinking_end" ? content?.type === "thinking" && content.thinkingSignature : content?.type === "text" && content.textSignature;
			return {
				type: event.type,
				contentIndex: event.contentIndex,
				...signature ? { contentSignature: signature } : {}
			};
		}
		case "thinking_start": return {
			type: "thinking_start",
			contentIndex: event.contentIndex
		};
		case "text_delta":
		case "thinking_delta": return {
			type: event.type,
			contentIndex: event.contentIndex,
			delta: event.delta
		};
		case "toolcall_start":
		case "toolcall_delta":
		case "toolcall_end":
		case "done":
		case "error": return;
	}
}
const executePreparedWorkerInference = async (approved, params) => {
	const { identity, request, signal } = params;
	const { config, agentDir } = approved.runtimeSnapshot;
	if (identity.sessionId !== request.sessionId) return inferenceError("session-not-attached");
	if (identity.ownerEpoch !== request.runEpoch) return inferenceError("epoch-mismatch");
	if (signal.aborted || !params.isCurrent()) return inferenceError("cancelled");
	const promptCacheContext = readWorkerTurnPromptCacheContext(identity);
	if (!promptCacheContext) return inferenceError("session-not-attached");
	const runContext = getAgentRunContext(request.runId);
	const target = {
		...params.sessionTarget,
		sessionEntry: approved.sessionEntry
	};
	const context = buildContext(request.context);
	if (!context) return inferenceError("invalid-context");
	if (splitTrailingAuthProfile(`${request.modelRef.provider}/${request.modelRef.model}`).profile || request.modelRef.provider !== approved.modelRef.provider || request.modelRef.model !== approved.modelRef.model) return inferenceError("model-not-approved");
	return await withPluginRuntimeGenerationScope(approved.runtimeSnapshot, async () => {
		const prepared = approved.prepared;
		const modelIdentity = {
			api: prepared.model.api,
			provider: approved.provider,
			model: approved.model
		};
		const logicalModel = prepared.model;
		const llmRuntime = getModelLlmRuntime(logicalModel);
		if (!llmRuntime) throw new Error("Prepared worker model has no lifecycle runtime owner");
		const providerModel = logicalModel.provider === "openai" && logicalModel.api === "openai-chatgpt-responses" ? {
			...logicalModel,
			baseUrl: normalizeCodexResponsesBaseUrlForOpenAISdk(logicalModel.baseUrl)
		} : logicalModel;
		const providerStream = registerProviderStreamForModel({
			model: providerModel,
			cfg: config,
			agentDir,
			workspaceDir: approved.workspaceDir
		});
		const authValue = prepared.auth.apiKey;
		applyRuntimeContextCarrierRetention(context.messages, approved.transcriptPolicy.appendOnlyRuntimeContext);
		const streamAgent = resolveEmbeddedAgentStream({
			llmRuntime,
			currentStreamFn: llmRuntime.streamSimple,
			...providerStream ? { providerStreamFn: providerStream } : {},
			sessionId: request.sessionId,
			signal,
			model: providerModel,
			resolvedApiKey: authValue,
			authProfileId: prepared.auth.profileId
		});
		const streamPolicyOptions = {
			...request.options.temperature !== void 0 ? { temperature: request.options.temperature } : {},
			...request.options.maxTokens !== void 0 ? { maxTokens: request.options.maxTokens } : {},
			...request.options.reasoning !== void 0 ? { reasoning: request.options.reasoning } : {},
			...request.options.thinkingBudgets ? { thinkingBudgets: { ...request.options.thinkingBudgets } } : {}
		};
		const fastMode = resolveFastModeState({
			cfg: config,
			provider: approved.provider,
			model: approved.model,
			agentId: target.agentId,
			sessionEntry: target.sessionEntry
		});
		const fastModeSetting = promptCacheContext.fastMode ?? fastMode.requestMode;
		const fastModeStartedAtMs = promptCacheContext.fastModeStartedAtMs ?? runContext?.lifecycleStartedAt ?? runContext?.registeredAt ?? Date.now();
		applyExtraParamsToAgent(streamAgent, config, approved.provider, approved.model, {
			...structuredClone(streamPolicyOptions),
			fastMode: fastModeSetting === "auto" ? () => resolveFastModeForElapsed({
				mode: "auto",
				startedAtMs: fastModeStartedAtMs,
				fastAutoOnSeconds: promptCacheContext.fastModeAutoOnSeconds ?? fastMode.fastAutoOnSeconds
			}).enabled : fastModeSetting
		}, streamPolicyOptions.reasoning, target.agentId, approved.workspaceDir, providerModel, agentDir, void 0, { nativeWebSearchPolicyContext: {
			sessionKey: target.sessionKey,
			webSearchEnabled: (await getWorkerTurnToolSurface(identity)?.getSurface(identity))?.tools.some(({ definition }) => definition.name === "web_search") === true
		} });
		const recordServiceTierObservation = prepared.recordServiceTierObservation;
		const scopedStream = recordServiceTierObservation ? createOpenAIServiceTierObservationWrapper(streamAgent.streamFn, (model, observation) => !signal.aborted && params.isCurrent() && recordServiceTierObservation({
			modelId: model.id,
			runtimeId: "openclaw",
			api: model.api,
			baseUrl: model.baseUrl,
			...observation
		}), {
			runId: request.runId,
			sessionId: request.sessionId,
			accountRoute: prepared.auth.profileId ? `profile:${prepared.auth.profileId}` : "direct:openai"
		}) : streamAgent.streamFn;
		const model = providerModel;
		if ([request.options.maxTokens, ...Object.values(request.options.thinkingBudgets ?? {})].some((budget) => budget !== void 0 && budget > model.maxTokens)) return inferenceError("invalid-context");
		if (signal.aborted || !params.isCurrent()) return inferenceError("cancelled");
		const startedAt = Date.now();
		const trace = createDiagnosticTraceContextFromActiveScope();
		let modelCallSeq = 0;
		const stream = wrapStreamFnWithDiagnosticModelCallEvents(scopedStream, {
			config,
			runId: request.runId,
			sessionKey: target.sessionKey,
			sessionId: request.sessionId,
			provider: model.provider,
			model: model.id,
			api: model.api,
			contextTokenBudget: model.contextTokens ?? model.contextWindow,
			trace,
			contentCapture: resolveDiagnosticModelContentCapturePolicy(config),
			nextCallId: () => `${request.runId}:${request.turnId}:worker-model:${modelCallSeq += 1}`
		});
		const recordUsage = (rawUsage) => {
			const durationMs = Math.max(0, Date.now() - startedAt);
			if (!isDiagnosticsEnabled(config)) return;
			const usage = normalizeUsage(rawUsage);
			if (!hasObservedModelUsage(usage)) return;
			const costUsd = usage.cost?.total ?? estimateUsageCost({
				usage,
				cost: resolveModelCostConfig({
					provider: model.provider,
					model: model.id,
					config
				})
			});
			emitTrustedDiagnosticEvent({
				type: "model.usage",
				trace: freezeDiagnosticTraceContext(trace),
				sessionKey: target.sessionKey,
				sessionId: request.sessionId,
				channel: "worker",
				agentId: target.agentId,
				provider: model.provider,
				model: model.id,
				usage: toDiagnosticUsage(usage),
				context: {
					limit: model.contextTokens ?? model.contextWindow,
					...usage.contextUsage?.state === "available" ? { used: usage.contextUsage.promptTokens } : {}
				},
				...costUsd !== void 0 ? { costUsd } : {},
				durationMs
			});
		};
		const executionIsCurrent = () => !signal.aborted && params.isCurrent();
		const toolCalls = createWorkerToolCallStream({
			emit: params.emit,
			isCurrent: executionIsCurrent
		});
		const providerAbort = new AbortController();
		const providerSignal = AbortSignal.any([signal, providerAbort.signal]);
		let currentMessage;
		let publishedModel;
		const { reasoning, ...streamOptions } = streamPolicyOptions;
		try {
			const events = await stream(model, context, {
				...streamOptions,
				...reasoning !== void 0 ? { reasoning: mapThinkingLevel(reasoning) } : {},
				signal: providerSignal,
				sessionId: request.sessionId,
				...authValue ? { apiKey: authValue } : {},
				promptCacheKey: resolveSessionBoundaryPromptCacheKey({
					...promptCacheContext,
					api: model.api,
					sessionId: request.sessionId
				})
			});
			for await (const event of events) {
				if (event.type !== "error") {
					currentMessage = event.type === "done" ? event.message : event.partial ?? currentMessage;
					const executingModel = currentMessage?.responseModel ?? modelIdentity.model;
					if (currentMessage && executingModel !== publishedModel && runContext?.sessionId === request.sessionId && runContext.sessionKey === target.sessionKey && (runContext.agentId === void 0 || runContext.agentId === target.agentId) && executionIsCurrent()) {
						emitAgentEventForRunContext({
							runId: request.runId,
							stream: "lifecycle",
							data: {
								phase: "model",
								provider: modelIdentity.provider,
								model: executingModel
							}
						}, runContext);
						publishedModel = executingModel;
					}
				}
				if (event.type === "done") {
					recordUsage(event.message.usage);
					if (signal.aborted || !params.isCurrent()) return inferenceError("cancelled", event.message.usage);
					for (const [contentIndex, content] of event.message.content.entries()) if (content.type === "toolCall") {
						const endResult = toolCalls.end(contentIndex, event.message, content);
						if (endResult === "cancelled") return inferenceError("cancelled", event.message.usage);
						if (endResult === "invalid") return inferenceError("provider-error");
					}
					if (!toolCalls.matchesTerminal(event.message)) return inferenceError("provider-error");
					const terminal = projectWorkerInferenceTerminalMessage({
						message: event.message,
						modelIdentity,
						stopReason: event.reason
					});
					if (terminal.kind === "provider-replay-unavailable") {
						if (isDiagnosticsEnabled(config)) {
							const { bytes, limitBytes, reason } = terminal.details;
							emitTrustedDiagnosticEvent({
								type: "payload.large",
								surface: "worker.provider-replay",
								action: "rejected",
								bytes,
								limitBytes,
								reason,
								trace: freezeDiagnosticTraceContext(trace)
							});
						}
						return inferenceError("provider-error", event.message.usage, WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE);
					}
					return {
						type: "done",
						message: terminal.message
					};
				}
				if (event.type === "error") {
					recordUsage(event.error.usage);
					const failure = event.reason === "aborted" ? void 0 : projectWorkerInferenceError({
						message: event.error.errorMessage ?? ERROR_MESSAGES["provider-error"],
						errorCode: event.error.errorCode,
						errorType: event.error.errorType,
						errorBody: event.error.errorBody,
						retryAfterMs: event.error.retryAfterMs
					});
					return inferenceError(event.reason === "aborted" ? "cancelled" : "provider-error", event.error.usage, failure?.message, failure?.retryAfterMs);
				}
				if (signal.aborted || !params.isCurrent()) return inferenceError("cancelled");
				if (event.type === "toolcall_start") {
					if (toolCalls.start(event.contentIndex, event.partial) === "cancelled") return inferenceError("cancelled");
					continue;
				}
				if (event.type === "toolcall_delta" || event.type === "toolcall_end") {
					const result = event.type === "toolcall_delta" ? toolCalls.delta(event.contentIndex, event.delta, event.partial) : toolCalls.end(event.contentIndex, event.partial, event.toolCall);
					if (result === "cancelled") return inferenceError("cancelled");
					if (result === "invalid") return inferenceError("provider-error");
					continue;
				}
				const workerEvent = toWorkerStreamEvent(event, modelIdentity);
				if (workerEvent) params.emit(workerEvent);
			}
			return inferenceError(signal.aborted ? "cancelled" : "provider-error");
		} catch (error) {
			const failure = signal.aborted ? void 0 : projectWorkerInferenceError(error);
			return inferenceError(signal.aborted ? "cancelled" : "provider-error", void 0, failure?.message, failure?.retryAfterMs);
		} finally {
			providerAbort.abort();
		}
	});
};
//#endregion
//#region src/gateway/worker-environments/worker-turn-model.ts
async function prepareWorkerTurnModel(params) {
	const approved = await (params.inferencePlacement === "worker" ? resolveApprovedWorkerLocalModel : resolveApprovedWorkerModel)({
		target: params.target,
		modelRef: params.modelRef,
		runtimeSnapshot: params.runtimeSnapshot,
		signal: params.turn.abortSignal,
		assertCurrent: params.assertCurrent
	});
	if (!approved) throw new Error("Worker model is not approved for this session");
	if ("error" in approved) throw new Error(boundedWorkerError(approved.error, 256));
	return {
		model: "prepared" in approved ? approved.prepared.model : approved.model,
		reasoning: resolveProviderThinkingLevel({
			provider: params.modelRef.provider,
			model: params.modelRef.model,
			catalog: params.turn.thinkLevel === "ultra" ? overlayConfiguredModelCatalog({
				catalog: loadManifestModelCatalog({
					config: params.turn.config ?? {},
					workspaceDir: params.turn.workspaceDir
				}),
				config: params.turn.config ?? {},
				workspaceDir: params.turn.workspaceDir
			}) : void 0,
			agentRuntime: "openclaw",
			level: params.turn.thinkLevel
		}),
		transcriptPolicy: approved.transcriptPolicy,
		inference: "prepared" in approved ? executePreparedWorkerInference.bind(void 0, approved) : void 0
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-payload.ts
/** Keep input admission ordered before placement and transcript source checks. */
function captureWorkerTurnInputAuthority(params) {
	const assertInputCurrent = composeSessionSourceAssertion([params.assertRunCurrent], (assertRun) => {
		assertRun();
		params.signal?.throwIfAborted();
		if (params.recorder?.isBlocked() && !params.isBlocked()) throw new Error("Cloud worker turn input is blocked");
	});
	const transcriptSource = captureWorkerTurnTranscriptSource(params.transcriptTarget);
	return {
		assertTurnInputCurrent: assertInputCurrent,
		assertSourceCurrent: composeSessionSourceAssertion([assertInputCurrent, transcriptSource]),
		assertContextCurrent: () => {
			assertInputCurrent();
			resolveWorkerTurnTranscriptTarget({
				...params.transcriptTarget,
				sessionTarget: params.transcriptTarget
			});
		}
	};
}
async function prepareWorkerAgentRuntimeIdentity(params) {
	const admittedRunContext = await resolvePreparedRunAdmission({
		runId: params.turn.runId,
		runtimeKind: "worker",
		runtimeInstanceId: params.runtimeInstanceId,
		admittedRunContext: params.turn.admittedRunContext,
		preparedRunAdmission: params.turn.preparedRunAdmission
	});
	const assertAdmittedActive = resolveAdmittedRunActiveAssertion(admittedRunContext, params.turn.abortSignal);
	if (!assertAdmittedActive) throw new Error("Worker turn has no active admitted execution authority");
	const assertActive = composeSessionSourceAssertion([params.assertSourceCurrent, assertAdmittedActive]);
	assertAdmittedActive();
	const operatorAuthority = readAdmittedRunOperatorAuthority(admittedRunContext);
	const assertPresenceSourceCurrent = capturePresenceToolAuthority({
		runId: params.turn.runId,
		ownerAuthority: bindActiveOperatorTurnAuthority(params.turn.runId),
		operatorAuthority,
		delegatedAuthority: getAdmittedRunDelegatedAuthority(admittedRunContext),
		assertCurrent: assertActive
	});
	const { capability, takeFinishingOutcome } = await bindWorkerTurnOwner(params.placements, params.turnClaim, admittedRunContext.executionIdentityToken, admittedRunContext.operationalRunInstance, params.sessionTarget, assertActive, params.turn.prepareAssistantTranscriptMessage, operatorAuthority, assertPresenceSourceCurrent, params.promptCacheContext);
	capability.receiptAuthority();
	const runtimeIdentity = await capability.run((owner) => {
		const { turn } = params;
		return {
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			operationalRunInstance: admittedRunContext.operationalRunInstance,
			executionIdentityToken: admittedRunContext.executionIdentityToken,
			turnSourceChannel: turn.messageChannel ?? turn.messageProvider,
			turnSourceTo: turn.currentMessagingTarget ?? turn.currentChannelId,
			turnSourceAccountId: turn.agentAccountId,
			turnSourceThreadId: turn.currentThreadTs,
			gatewayUiCommandTarget: turn.gatewayUiCommandTarget,
			workerTurnClaim: owner.turnClaim,
			approvalAuthority: owner.delegatedAuthority
		};
	});
	return {
		admittedRunContext,
		operationalRunInstance: admittedRunContext.operationalRunInstance,
		runtimeIdentity,
		assertActive: capability.receiptAuthority,
		takeFinishingOutcome
	};
}
function emitProviderReplayRejected(config, details) {
	if (isDiagnosticsEnabled(config)) emitTrustedDiagnosticEvent({
		type: "payload.large",
		surface: "worker.provider-replay",
		action: "rejected",
		...details
	});
}
function windowInitialMessages(messages, promptMessages = 1) {
	const windowed = windowWorkerReplayMessages(messages, WORKER_INFERENCE_MAX_CONTEXT_MESSAGES - promptMessages);
	if (windowed.kind === "provider-replay-unavailable") return windowed;
	const projected = [];
	const projectedHistory = windowed.messages.flatMap((message) => message.role === "custom" && (message.customType === "openclaw.runtime-context" || message.customType === "openclaw.system-update") ? [message] : convertToLlm([message]));
	for (const message of projectedHistory) {
		const result = toWorkerTranscriptMessage(message, "launch");
		if (!result) continue;
		if (result.kind === "provider-replay-unavailable") return result;
		projected.push(result.message);
	}
	return {
		kind: "complete",
		messages: projected
	};
}
/** Fits replay context before minting the exact worker-bound identity bearer. */
async function fitLaunchDescriptorWithRuntimeIdentity(params) {
	const tokenBytes = measureAgentRuntimeIdentityTokenBytes(params.runtimeIdentity);
	const plan = fitLaunchDescriptor((messages) => params.build("x".repeat(tokenBytes), messages), params.messages, params.measure);
	if (plan.kind !== "launch") return plan;
	const token = await mintAgentRuntimeIdentityToken(params.runtimeIdentity);
	if (Buffer.byteLength(token, "utf8") !== tokenBytes) throw new Error("Agent runtime identity changed while preparing worker launch");
	return {
		kind: "launch",
		plan: {
			...plan.plan,
			assignment: {
				...plan.plan.assignment,
				agentRuntimeIdentityToken: token
			}
		}
	};
}
function fitLaunchDescriptor(build, messages, measure) {
	let initialMessages = fitWorkerReplayImages(messages, (candidate) => measure(build(candidate))) ?? messages;
	while (true) {
		const plan = build(initialMessages);
		const bytes = measure(plan);
		if (bytes <= WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES) return {
			kind: "launch",
			plan
		};
		const replayIndex = initialMessages.findLastIndex((message) => message.role === "assistant" && message.providerReplay !== void 0);
		if (replayIndex === 0) return {
			kind: "provider-replay-unavailable",
			reason: "provider-replay-launch-payload-limit",
			bytes,
			limitBytes: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES
		};
		const nextTurn = initialMessages.findIndex((message, index) => index > 0 && message.role === "user");
		const nextStart = replayIndex > 0 && (nextTurn < 0 || nextTurn > replayIndex) ? replayIndex : nextTurn;
		if (nextStart < 0) throw new Error("Worker turn context exceeds the launch descriptor payload limit");
		initialMessages = initialMessages.slice(nextStart);
	}
}
function parseWorkerTurnProcessResult(processResult) {
	if (processResult.nodeLoss) throw processResult.nodeLoss;
	if (processResult.code !== 0 || processResult.signal !== null || processResult.killed) {
		const detail = truncateUtf16Safe(redactSensitiveText(processResult.stderr, { mode: "tools" }).replace(/\s+/gu, " ").trim(), 400);
		throw new Error(detail ? `Cloud worker process failed before completing the turn: ${detail}` : "Cloud worker process failed before completing the turn");
	}
	const result = parseWorkerRuntimeResult(safeParseJsonRecord(processResult.stdout.trim()));
	if (!result) throw new Error("Worker process returned invalid output");
	if (result.status === "failed" && result.reason === "node-lost") throw new WorkerNodeLostError();
	if (result.status === "not-started") throw new Error(result.errorText);
	if (result.status === "fenced") throw new Error(`Cloud worker turn was fenced: ${result.reason}`);
	return result;
}
/** Delivers the committed reply while its result owner continues workspace settlement. */
async function finalizeWorkerTurnResult(params) {
	const { turn, placement, transcriptTarget, promptContext } = params;
	const runtimeResult = parseWorkerTurnProcessResult(params.processResult);
	const workerTurnFailed = runtimeResult.status === "failed";
	const completed = await SessionManager.openAsync(transcriptTarget);
	const resultTarget = {
		...transcriptTarget,
		expectedWriterRunId: void 0
	};
	const assertResultCurrent = () => {
		if (!params.placements.validateWorkspaceResultClaim(params.turnClaim)) throw new Error("Cloud worker result lost its placement owner during transcript hydration");
		resolveWorkerTurnTranscriptTarget({
			...resultTarget,
			sessionTarget: resultTarget
		});
	};
	assertResultCurrent();
	const currentPlacement = params.placements.preparedWorkspaceResultPlacement(params.turnClaim);
	if (runtimeResult.transcriptLeafId !== completed.getLeafId() || runtimeResult.transcriptNextSeq !== (currentPlacement?.lastTranscriptAckCursor ?? 0) + 1) throw new Error(`Cloud worker result does not match its committed transcript acknowledgement (leaf=${runtimeResult.transcriptLeafId ?? "none"}/${completed.getLeafId() ?? "none"}, nextSeq=${runtimeResult.transcriptNextSeq}/${(currentPlacement?.lastTranscriptAckCursor ?? 0) + 1})`);
	const terminal = runtimeResult.transcriptLeafId ? completed.getEntry(runtimeResult.transcriptLeafId) : void 0;
	if (!terminal || terminal.type !== "message" || terminal.message.role !== "assistant") throw new Error("Cloud worker completed without a terminal assistant transcript message");
	if (transcriptTarget.expectedWriterRunId !== void 0) turn.onCompactionAccounting?.({
		kind: "durable",
		count: 0,
		target: {
			agentId: transcriptTarget.agentId,
			sessionId: transcriptTarget.sessionId,
			sessionKey: transcriptTarget.sessionKey,
			storePath: transcriptTarget.storePath,
			lifecycleRevision: transcriptTarget.expectedLifecycleRevision,
			activeWriterRunId: transcriptTarget.expectedWriterRunId
		}
	});
	const text = collectTextContentBlocks(terminal.message.content).join("");
	const baseIndex = completed.getBranch().findIndex((entry) => entry.id === params.baseLeafId);
	const workerMessages = completed.getBranch().slice(baseIndex + 1).flatMap((entry) => entry.type === "message" ? [entry.message] : []);
	const finishing = workerTurnFailed ? params.takeFinishingOutcome() : void 0;
	const workerFailure = workerTurnFailed ? new WorkerTurnExecutionError(finishing?.error ?? "Cloud worker turn failed") : void 0;
	if (workerFailure && finishing?.replayInvalid) recordModelFallbackStop(workerFailure);
	const reply = workerFailure ? { text } : await params.prepareReplyMedia({ text });
	const aborted = params.signal.aborted;
	const finalizeContext = async () => {
		const finalizationManager = turn.onContextEngineTurnCandidate ? completed : await SessionManager.openAsync(resultTarget);
		assertResultCurrent();
		const userEntry = params.baseLeafId ? finalizationManager.getEntry(params.baseLeafId) : void 0;
		await finalizeHarnessContextEngineTurn({
			...promptContext.contextEngineTurn,
			sessionManager: finalizationManager,
			sessionIdUsed: placement.sessionId,
			promptError: workerTurnFailed,
			aborted,
			yieldAborted: false,
			isHeartbeat: isHeartbeatLifecycleRunKind(turn.bootstrapContextRunKind),
			messagesSnapshot: [
				...promptContext.history,
				...userEntry?.type === "message" && userEntry.message.role === "user" ? [userEntry.message] : [],
				...workerMessages
			],
			prePromptMessageCount: promptContext.history.length,
			turnCandidate: turn.onContextEngineTurnCandidate ? {
				admission: turn.userTurnTranscriptRecorder?.getAdmissionReceipt(),
				terminalEntryId: terminal.id,
				record: (facts) => {
					assertResultCurrent();
					turn.onContextEngineTurnCandidate?.(facts);
				}
			} : void 0,
			runMaintenance: (maintenance) => runHarnessContextEngineMaintenance({
				...maintenance,
				withSessionManagerRewriteLock: (operation) => withSessionTranscriptWriteAssertion(resultTarget, assertResultCurrent, () => withSessionManagerWrite(finalizationManager, operation))
			})
		});
		assertResultCurrent();
	};
	if (turn.onContextEngineTurnCandidate) await finalizeContext();
	const settleWorkspace = () => runWithoutOwnedSessionTranscriptWrites(() => reconcileWorkspaceAfterTurn({
		...params,
		transcriptTarget: resultTarget,
		publishAcceptedWorkspace: async (claim) => {
			await params.publishAcceptedWorkspace?.(claim);
			assertResultCurrent();
			if (!turn.onContextEngineTurnCandidate) await finalizeContext();
		}
	}));
	if (workerFailure) {
		await settleWorkspace().catch((error) => {
			throw workerWorkspaceFailure(workerFailure, error);
		});
		throw workerFailure;
	}
	await params.settleSteering();
	const durationMs = Date.now() - params.startedAt;
	const usageAccumulator = createUsageAccumulator();
	const assistants = workerMessages.filter((message) => message.role === "assistant");
	let lastRunPromptUsage;
	for (const assistant of assistants) {
		const usage = normalizeUsage(assistant.usage);
		mergeUsageIntoAccumulator(usageAccumulator, usage);
		if (hasNonzeroUsage(usage)) lastRunPromptUsage = usage;
	}
	const lastAssistant = assistants.at(-1);
	const usageMeta = buildUsageAgentMetaFields({
		usageAccumulator,
		latestUsage: lastAssistant?.usage,
		lastRunPromptUsage
	});
	const reportedModelRef = resolveReportedModelRef({
		...params.modelRef,
		assistant: lastAssistant
	});
	const result = {
		...reply.text || reply.mediaUrl || reply.mediaUrls?.length ? { payloads: [reply] } : {},
		meta: {
			durationMs,
			agentMeta: {
				sessionId: placement.sessionId,
				sessionFile: turn.sessionFile,
				provider: reportedModelRef.provider,
				model: reportedModelRef.model,
				...usageMeta
			},
			stopReason: terminal.message.stopReason,
			finalAssistantVisibleText: resolveFinalAssistantVisibleText(terminal.message),
			finalAssistantRawText: resolveFinalAssistantRawText(terminal.message)
		}
	};
	assertResultCurrent();
	params.onReply(result);
	await settleWorkspace();
	return result;
}
function assertSupportedTurn(params) {
	if (params.clientTools?.length) throw new Error("Cloud worker turns do not support client-provided tools");
	const explicitProvider = params.provider?.trim();
	const explicitModel = params.model?.trim();
	const defaults = explicitProvider && explicitModel ? void 0 : resolveDefaultModelForAgent({
		cfg: params.config ?? {},
		agentId: params.agentId
	});
	const modelRef = {
		provider: explicitProvider ?? defaults?.provider ?? "",
		model: explicitModel ?? defaults?.model ?? ""
	};
	const explicitRuntime = normalizeOptionalAgentRuntimeId(params.agentHarnessId) ?? normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
	const runtime = explicitRuntime && !isDefaultAgentRuntimeId(explicitRuntime) ? explicitRuntime : resolveEffectiveAgentRuntime({
		cfg: params.config ?? {},
		provider: modelRef.provider,
		modelId: modelRef.model,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	if (runtime !== "openclaw") throw new Error(`Cloud worker turns require the OpenClaw runtime, not ${runtime}`);
	return modelRef;
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-prompt.ts
const WORKER_CONTEXT_ENGINE_HOST = {
	id: "openclaw-worker",
	label: "OpenClaw worker",
	capabilities: [
		"bootstrap",
		"assemble-before-prompt",
		"after-turn",
		"maintain",
		"runtime-llm-complete"
	]
};
async function prepareWorkerTurnPrompt(params) {
	const { turn, agentId, model, transcriptPolicy } = params;
	const bootstrapWorkspaceDir = turn.bootstrapWorkspaceDir ?? resolveAgentWorkspaceDir(turn.config ?? {}, agentId);
	const preparedModelRuntime = Object.freeze({
		...params.preparedModelRuntime,
		...await prepareAgentPromptProjects(turn)
	});
	const additions = await prepareAttemptSystemPromptAdditions({
		...turn,
		agentId,
		provider: model.provider,
		modelId: model.id
	});
	const attempt = {
		...turn,
		...additions,
		bootstrapWorkspaceDir,
		isCanonicalWorkspace: bootstrapWorkspaceDir === turn.workspaceDir,
		provider: model.provider,
		modelId: model.id,
		model,
		preparedModelRuntime
	};
	const isRawModelRun = turn.modelRun === true || turn.promptMode === "none";
	const capabilityToolNames = new Set(params.surface.tools.map(({ definition }) => definition.name));
	const setup = {
		sessionAgentId: agentId,
		resolvedWorkspace: turn.workspaceDir,
		effectiveWorkspace: params.workspaceDir,
		effectiveCwd: params.workspaceDir,
		sandboxSessionKey: turn.sandboxSessionKey ?? turn.sessionKey ?? turn.sessionId,
		sandbox: null,
		sandboxReport: void 0,
		proactiveSubagentOrchestration: turn.thinkLevel === "ultra",
		getProviderRuntimeHandle: () => resolveProviderRuntimePluginHandle({
			provider: model.provider,
			modelId: model.id,
			config: turn.config,
			workspaceDir: turn.workspaceDir,
			pluginMetadataSnapshot: preparedModelRuntime.metadataSnapshot
		})
	};
	const bootstrap = await prepareEmbeddedAttemptBootstrap({
		attempt,
		setup,
		hasReadTool: capabilityToolNames.has("read"),
		isRawModelRun
	});
	let projection = await params.toolRuntime.getPromptProjection(params.identity);
	const prompt = await prepareEmbeddedAttemptSystemPrompt({
		attempt,
		setup,
		bootstrap,
		remoteWorkspace: true,
		referencePaths: {
			docsPath: null,
			sourcePath: null
		},
		activeContextEngine: params.contextEngine,
		capabilityToolNames,
		effectiveTools: projection.tools,
		toolSchemaDirectoryPrompt: () => projection.toolSchemaDirectoryPrompt,
		isRawModelRun,
		modelToolsEnabled: capabilityToolNames.size > 0,
		skillsPrompt: turn.skillsSnapshot?.prompt ?? "",
		codeModeActive: params.surface.presentation.codeMode.enabled,
		toolSearchDirectoryEnabled: false,
		toolSearchRuntimeConfig: turn.config
	});
	let systemPromptText = prompt.systemPromptText;
	const contextEngineTurn = {
		...turn,
		contextEngine: params.contextEngine,
		contextEngineHostSupport: WORKER_CONTEXT_ENGINE_HOST,
		providerId: model.provider,
		modelId: model.id,
		modelContextWindow: model.contextWindow,
		tokenBudget: turn.contextTokenBudget,
		sessionManager: params.manager,
		transcriptReadFence: turn.userTurnTranscriptRecorder?.getAdmissionReceipt(),
		runtimeContext: buildAfterTurnRuntimeContext({
			attempt,
			workspaceDir: turn.workspaceDir,
			cwd: turn.cwd ?? turn.workspaceDir,
			agentDir: preparedModelRuntime.agentDir,
			activeAgentId: agentId,
			contextEnginePluginId: params.contextEnginePluginId,
			tokenBudget: turn.contextTokenBudget
		}),
		warn: logWarn
	};
	params.assertCurrent();
	if (!isRawModelRun) {
		const transcriptState = await resolveExistingAttemptTranscriptState({
			...turn,
			agentId,
			sessionManager: params.manager
		});
		await bootstrapHarnessContextEngine({
			...contextEngineTurn,
			hadSessionFile: transcriptState.hasBootstrapTranscriptState
		});
		const settings = createPreparedEmbeddedAgentSettingsManager({
			sessionId: turn.sessionId,
			cwd: turn.cwd ?? turn.workspaceDir,
			agentDir: preparedModelRuntime.agentDir,
			cfg: turn.config,
			pluginMetadataSnapshot: preparedModelRuntime.metadataSnapshot,
			contextTokenBudget: turn.contextTokenBudget
		});
		const assembled = await prepareHarnessContextEnginePrompt({
			...contextEngineTurn,
			...transcriptPolicy,
			agentId,
			messages: params.history,
			availableTools: capabilityToolNames,
			citationsMode: turn.config?.memory?.citations,
			sandboxed: false,
			isOpenAIResponsesApi: [
				"openai-responses",
				"azure-openai-responses",
				"openai-chatgpt-responses"
			].includes(model.api),
			promptBudget: {
				contextTokens: turn.contextTokenBudget ?? model.contextWindow ?? model.maxTokens,
				reserveTokens: settings.getCompactionReserveTokens(),
				systemPrompt: systemPromptText,
				prompt: turn.prompt
			}
		});
		params.history = assembled.messages;
		systemPromptText = assembled.systemPrompt;
	}
	const assembly = await prepareEmbeddedAttemptPromptAssembly({
		attempt,
		activeSession: { messages: params.history },
		sessionManager: params.manager,
		hookRunner: getGlobalHookRunner(),
		hookAgentId: agentId,
		diagnosticTrace: createDiagnosticTraceContextFromActiveScope(),
		isRawModelRun,
		sessionAgentId: agentId,
		runtimeModel: `${model.provider}/${model.id}`,
		systemPromptText,
		runAbortSignal: turn.abortSignal,
		applyPromptBuildToolsAllow: (toolsAllow) => {
			const names = params.toolRuntime.applyPromptToolsAllow(toolsAllow);
			capabilityToolNames.clear();
			for (const name of names) capabilityToolNames.add(name);
			return names;
		},
		prepareSystemPrompt: async (current) => {
			projection = await params.toolRuntime.getPromptProjection(params.identity);
			return (await prompt.prepareToolPrompt?.(projection.tools))?.(current) ?? current;
		},
		setActiveSessionSystemPrompt: (value) => {
			systemPromptText = value;
		},
		setLeasedSteering: params.setLeasedSteering
	});
	const context = await prepareEmbeddedAttemptPromptContext({
		...transcriptPolicy,
		attempt,
		messages: params.history,
		prompt: assembly,
		capabilityToolNames,
		executionHost: false,
		sessionVersion: params.manager.getHeader()?.version,
		boundaryTimezone: resolveUserTimezone(turn.config?.agents?.defaults?.userTimezone),
		includeBoundaryTimestamp: !isRawModelRun,
		isRawModelRun,
		preparedUserTurnMessage: turn.userTurnTranscriptRecorder?.message,
		replaceSessionMessages: (messages) => {
			params.history = messages;
		},
		sessionAgentId: agentId,
		systemPromptText,
		systemPromptReport: prompt.systemPromptReport,
		toolResultPromptProjectionState: createToolResultPromptProjectionState()
	});
	const history = context.hookMessagesForCurrentPrompt;
	if (context.runtimeContextMessageForCurrentTurn) history.pop();
	params.assertCurrent();
	return {
		contextEngineTurn,
		systemPromptText,
		history,
		prompt: context.llmBoundaryPromptForPrecheck,
		runtimeContext: isRawModelRun ? void 0 : context.runtimeContextFragments,
		inHistorySystemUpdates: transcriptPolicy.inHistorySystemUpdates,
		includeEmptySnapshots: transcriptPolicy.appendOnlyRuntimeContext === true
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-user-message.ts
async function persistWorkerTurnUserMessage(params) {
	const { turn, manager, transcriptTarget, media } = params;
	const canonical = buildPersistedUserTurnMessage({
		text: turn.transcriptPrompt ?? turn.prompt,
		media: turn.media,
		mediaImageLayout: { slots: media.imageFactIndexes.map((factIndex) => ({
			kind: "inline",
			...factIndex === null ? {} : { factIndex }
		})) }
	});
	const message = {
		...canonical,
		content: [{
			type: "text",
			text: turn.transcriptPrompt ?? turn.prompt
		}, ...media.images],
		__openclaw: {
			...canonical["__openclaw"],
			mediaImageBlockFactIndexes: media.imageFactIndexes
		}
	};
	const assertCurrent = () => {
		params.assertRunCurrent?.();
		if (!params.isAuthorized()) throw new Error("Worker turn authority changed before transcript write");
		resolveWorkerTurnTranscriptTarget({
			...transcriptTarget,
			sessionTarget: transcriptTarget
		});
	};
	const entryId = await withSessionTranscriptWriteAssertion(transcriptTarget, assertCurrent, () => withSessionManagerWrite(manager, () => manager.appendMessageAsync(message)));
	try {
		assertCurrent();
		turn.onUserMessagePersisted?.(message);
	} catch (error) {
		if (entryId) throw new SessionTranscriptMessageCommittedError(entryId, error, transcriptTarget);
		throw error;
	}
	return entryId ?? null;
}
async function gateWorkerTurnInput({ turn, transcriptTarget, identity, modelRef, startedAt, assertCurrent, onBlocked }) {
	const recorder = turn.userTurnTranscriptRecorder;
	const runner = getGlobalHookRunner();
	if (!runner?.hasHooks("before_agent_run")) return;
	const history = await SessionManager.openModelContextAsync(transcriptTarget, {
		admission: recorder?.getAdmissionReceipt(),
		signal: turn.abortSignal
	});
	assertCurrent();
	const channel = buildAgentHookContextChannelFields(turn);
	const block = await runBeforeAgentRunGate(runner, {
		prompt: turn.prompt,
		messages: convertToLlm(history.buildSessionContext().messages),
		channelId: channel.channelId,
		accountId: turn.agentAccountId,
		senderId: turn.senderId ?? void 0,
		senderIsOwner: turn.senderIsOwner
	}, buildAgentHookContext({
		...turn,
		...identity,
		...channel,
		senderId: turn.senderId ?? void 0,
		modelProviderId: modelRef.provider,
		modelId: modelRef.model
	}));
	assertCurrent();
	if (!block) return;
	onBlocked();
	const message = buildAgentRunBlockedUserMessage(turn.runId, block);
	await withSessionTranscriptWriteAssertion(transcriptTarget, assertCurrent, async () => {
		if (recorder) {
			const persisted = await recorder.persistBlocked(message, { storageTarget: transcriptTarget });
			assertCurrent();
			if (persisted) turn.onUserMessagePersisted?.(persisted.message);
		} else {
			const manager = await SessionManager.openAsync(transcriptTarget, void 0, void 0, turn.abortSignal);
			assertCurrent();
			await withSessionManagerWrite(manager, () => manager.appendMessageAsync(message));
			assertCurrent();
			turn.onUserMessagePersisted?.(message);
		}
	});
	assertCurrent();
	return buildEmbeddedRunBlockedResult({
		text: block.message,
		errorKind: "hook_block",
		errorMessage: block.message,
		durationMs: Date.now() - startedAt,
		agentMeta: {
			sessionId: identity.sessionId,
			...modelRef
		},
		replayInvalid: false
	});
}
async function readWorkerTurnInputContext(params) {
	const { turn, transcriptTarget, modelRef, assertCurrent } = params;
	const recorder = turn.userTurnTranscriptRecorder;
	const receipt = recorder?.getAdmissionReceipt();
	const admission = receipt ? { ...receipt } : void 0;
	if (recorder && !admission) throw new Error("Cloud worker turn has no readable canonical user admission");
	const userMessageAlreadyPersisted = admission !== void 0 || turn.suppressNextUserMessagePersistence === true;
	turn.onExecutionPhase?.({
		phase: "model_resolution",
		backend: "cloud-worker",
		provider: modelRef.provider,
		model: modelRef.model
	});
	const manager = userMessageAlreadyPersisted ? await SessionManager.openModelContextAsync(transcriptTarget, {
		admission,
		signal: turn.abortSignal
	}) : await SessionManager.openAsync(transcriptTarget, void 0, void 0, turn.abortSignal);
	assertCurrent();
	const contextMessages = manager.buildSessionContext().messages;
	const leaf = manager.getLeafEntry();
	return {
		manager,
		history: !admission && userMessageAlreadyPersisted && leaf?.type === "message" && leaf.message.role === "user" ? contextMessages.slice(0, -1) : contextMessages,
		userMessageAlreadyPersisted,
		baseLeafId: admission?.entryId ?? manager.getLeafId()
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-execution.ts
async function executeWorkerTurn(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { placement, turn: input } = params;
		const backend = "cloud-worker";
		const preparedRuntime = _usingCtx$1.a(await acquireAgentRunPreparedModelRuntime({
			config: input.config ?? {},
			agentId: placement.agentId,
			agentDir: input.agentDir ?? resolveAgentDir(input.config ?? {}, placement.agentId),
			workspaceDir: input.workspaceDir
		}, {
			pluginGeneration: input.pluginGeneration,
			abortSignal: input.abortSignal
		}));
		params.assertRunCurrent();
		input.abortSignal?.throwIfAborted();
		const turn = {
			...input,
			config: preparedRuntime.snapshot.config
		};
		const modelRef = assertSupportedTurn(turn);
		const { environment, bootstrapReceipt } = requireCurrentWorkerTurnEnvironment({
			environments: params.environments,
			placement
		});
		const inferencePlacement = workerInferencePlacement(environment);
		if (inferencePlacement === "worker") {
			if (!createModelVisibilityPolicy({
				cfg: turn.config ?? {},
				catalog: [],
				defaultProvider: modelRef.provider,
				agentId: placement.agentId
			}).allows(modelRef)) throw new Error(`Worker-local inference cannot use ${modelRef.provider}/${modelRef.model} for agent ${placement.agentId}. Allow that model in the agent model policy or choose an allowed model.`);
			if (!environment.nodeDeviceId) throw new Error("Worker-local inference requires a paired device profile. Set cloudWorkers.profiles.<id>.settings.device to a connected node.");
			if (!bootstrapReceipt.protocolFeatures.includes("worker-local-inference-v1")) throw new Error(`Worker-local inference is unavailable on paired device ${environment.nodeDeviceId}. Update and restart its OpenClaw node host, use a non-Windows host with nodeHost.workerRuns.isolation set to "none", and configure a compatible models.providers model with a usable node-local credential.`);
		}
		await recoverWorkspaceBeforeTurn({
			...params,
			signal: turn.abortSignal
		});
		params.assertRunCurrent();
		turn.abortSignal?.throwIfAborted();
		const { available: githubPublicationAvailable } = readGitHubPublicationFact(placement);
		const startedAt = Date.now();
		await turn.onExecutionStarted?.({
			lifecycleGeneration: turn.lifecycleGeneration,
			backend
		});
		params.assertRunCurrent();
		turn.abortSignal?.throwIfAborted();
		turn.onExecutionPhase?.({
			phase: "runner_entered",
			backend
		});
		const transcriptTarget = resolveWorkerTurnTranscriptTarget(turn);
		const recorder = turn.userTurnTranscriptRecorder;
		let blocked = false;
		const { assertTurnInputCurrent, assertSourceCurrent, assertContextCurrent } = captureWorkerTurnInputAuthority({
			transcriptTarget,
			recorder,
			signal: turn.abortSignal,
			assertRunCurrent: params.assertRunCurrent,
			isBlocked: () => blocked
		});
		assertContextCurrent();
		if (recorder?.hasRuntimePersistencePending()) {
			await recorder.waitForRuntimePersistence();
			assertContextCurrent();
		}
		const inputContext = {
			turn,
			transcriptTarget,
			identity: placement,
			modelRef,
			startedAt,
			assertCurrent: assertContextCurrent,
			onBlocked: () => {
				blocked = true;
			}
		};
		const blockedResult = await withPluginRuntimeGenerationScope(preparedRuntime.snapshot, () => gateWorkerTurnInput(inputContext));
		if (blockedResult) {
			await releaseClaimIfOwned(params.placements, params.turnClaim);
			return blockedResult;
		}
		const contextEngineAdmission = _usingCtx$1.a(await withPluginRuntimeGenerationScope(preparedRuntime.snapshot, () => admitEmbeddedContextEngine({
			runParams: turn,
			agentDir: preparedRuntime.snapshot.agentDir,
			workspaceDir: turn.workspaceDir
		}, {
			id: WORKER_CONTEXT_ENGINE_HOST.id,
			contextEngineHostCapabilities: WORKER_CONTEXT_ENGINE_HOST.capabilities
		})));
		assertContextCurrent();
		if (recorder && turn.suppressNextUserMessagePersistence !== true && !recorder.hasPersisted()) {
			const persisted = await recorder.persistApproved({
				storageTarget: transcriptTarget,
				cwd: params.workspace.kind === "local" ? params.workspace.path : placement.remoteWorkspaceDir
			});
			if (persisted) turn.onUserMessagePersisted?.(persisted.message);
			assertContextCurrent();
		}
		const context = await readWorkerTurnInputContext(inputContext);
		const { manager, history, userMessageAlreadyPersisted } = context;
		let baseLeafId = context.baseLeafId;
		const { model, reasoning, transcriptPolicy, inference } = await prepareWorkerTurnModel({
			target: transcriptTarget,
			modelRef,
			runtimeSnapshot: preparedRuntime.snapshot,
			inferencePlacement,
			turn,
			assertCurrent: assertContextCurrent
		});
		assertContextCurrent();
		const credential = await waitForTurnOperation({
			start: () => params.environments.acquireTurnCredential(params.turnClaim),
			...turn.abortSignal ? { signal: turn.abortSignal } : {},
			timeoutMs: turn.timeoutMs
		});
		const tunnel = await waitForTurnOperation({
			start: () => params.environments.startTunnel({
				environmentId: placement.environmentId,
				ownerEpoch: placement.activeOwnerEpoch
			}),
			...turn.abortSignal ? { signal: turn.abortSignal } : {},
			timeoutMs: turn.timeoutMs
		});
		if (!tunnel.launchTurn) throw new Error("Worker tunnel does not support worker turns");
		const portalAvailable = Boolean(environment.nodeDeviceId) && environment.sshEndpoint === null && await params.environments.supportsNodePortal?.(placement.environmentId, placement.activeOwnerEpoch) === true;
		const launchToolNames = await tunnel.readLaunchToolNames();
		const desktop = await prepareWorkerDesktopLaunchPlan({
			desktop: environment.desktop,
			protocolFeatures: bootstrapReceipt.protocolFeatures,
			prepareComputer: () => params.environments.prepareComputer?.(params.turnClaim),
			turn
		});
		const { browser, computer, preparedComputer } = desktop;
		const { authProfileStoreSource, capabilityProfile, policy: toolPolicy, exec, execUnavailable, presentation, installedSkills } = await resolveWorkerToolAuthority({
			modelRef,
			model,
			placement,
			turn,
			assertCurrent: assertSourceCurrent,
			computerAvailable: Boolean(computer)
		});
		const { admittedRunContext, operationalRunInstance, runtimeIdentity, assertActive, takeFinishingOutcome } = await prepareWorkerAgentRuntimeIdentity({
			...params,
			agentId: placement.agentId,
			runtimeInstanceId: placement.environmentId,
			sessionKey: placement.sessionKey,
			sessionTarget: transcriptTarget,
			promptCacheContext: {
				boundaryCount: manager.getBoundaryCount(),
				promptCacheKey: turn.promptCacheKey,
				fastMode: turn.fastMode,
				fastModeStartedAtMs: turn.fastModeStartedAtMs,
				fastModeAutoOnSeconds: turn.fastModeAutoOnSeconds
			},
			assertSourceCurrent
		});
		assertActive();
		const authority = runtimeIdentity.approvalAuthority;
		const authorityAbort = new AbortController();
		const signal = turn.abortSignal ? AbortSignal.any([turn.abortSignal, authorityAbort.signal]) : authorityAbort.signal;
		const cancel = () => authorityAbort.abort(/* @__PURE__ */ new Error("Worker turn authority closed"));
		const stopWatchingRun = registerAgentRunDelegatedAuthorityClosedHandler((closed) => {
			if (closed === authority) cancel();
		});
		const stopWatchingClaim = params.placements.registerTurnClaimClosedHandler((closed) => {
			if (closed.owner.kind === "worker" && sameWorkerSessionTurnClaim(closed, params.turnClaim)) cancel();
		});
		let toolRuntime;
		const steering = _usingCtx$1.a({ async [Symbol.asyncDispose]() {
			if (this.lease) await releasePendingAgentSteeringItems(this.lease);
		} });
		const toolIdentity = {
			sessionId: placement.sessionId,
			runId: turn.runId,
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch,
			turnClaim: params.turnClaim
		};
		const assertToolSurfaceCurrent = () => {
			if (!toolRuntime || getWorkerTurnToolSurface(toolIdentity) !== toolRuntime) throw new Error("Worker tool surface owner changed");
		};
		try {
			const isAuthorized = () => {
				try {
					assertActive();
					signal.throwIfAborted();
					const current = params.environments.get(placement.environmentId);
					return isWorkerEnvironmentAttachedTo(current, placement);
				} catch {
					return false;
				}
			};
			if (!bootstrapReceipt.protocolFeatures.includes("worker-gateway-tools-v1")) throw new StaleWorkerBuildError();
			const skillWorkshop = turn.skillLibraryAuthoring ? createLibrarySkillWorkshopTool({
				...turn.skillLibraryAuthoring,
				defaultTarget: "personal"
			}) : void 0;
			toolRuntime = createWorkerGatewayToolRuntime({
				assertCurrent: assertToolSurfaceCurrent,
				signal,
				prepare: async (identity) => {
					const inheritedPublicationToolRef = {};
					const placementTools = createWorkerPlacementTools({
						...turn,
						...placement,
						policy: toolPolicy,
						cwd: placement.remoteWorkspaceDir,
						containmentRoot: placement.remoteWorkspaceDir,
						execAuthority: execUnavailable ? void 0 : exec,
						sessionId: turn.sessionId
					});
					placementTools.push(...desktop.tools);
					const availablePlacementTools = new Set(placementTools.map((tool) => tool.name));
					const tools = await withPluginRuntimeGenerationScope(preparedRuntime.snapshot, () => params.environments.createGatewayTools?.({
						identity,
						inheritedToolPolicySource: capabilityProfile.policy.inheritedToolPolicySource,
						inheritedToolDenylist: capabilityProfile.policy.inheritedToolPolicyForSpawn?.deny,
						delegatedToolPolicyActive: Boolean(capabilityProfile.policy.delegatedToolPolicy),
						skillWorkshop,
						portalAvailable,
						prepareTools: async (adapters) => {
							const prepared = await createOpenClawCodingToolsInternalAsync({
								...turn,
								authProfileStoreSource,
								agentId: placement.agentId,
								conversationCapabilityProfile: capabilityProfile,
								preparedModelRuntime: preparedRuntime.snapshot,
								installedSkills,
								githubPublicationAvailable,
								inheritedPublicationToolRef,
								cronCreatorAuthorityUnavailableReason: void 0,
								runSessionKey: placement.sessionKey,
								sessionKey: turn.sandboxSessionKey ?? placement.sessionKey,
								policyAgentId: turn.sandboxAgentId ?? turn.agentId,
								operationalRunInstance,
								sessionPermissionPolicy: turn.permissionMode ? {
									mode: turn.permissionMode,
									root: turn.workspaceDir
								} : void 0,
								modelProvider: modelRef.provider,
								modelId: modelRef.model,
								modelContextWindowTokens: toolPolicy.modelContextWindowTokens,
								runtimeToolAllowlist: turn.toolsAllow,
								skillWorkshop: void 0,
								computerTransport: null
							}, void 0, void 0, {
								tools: [...placementTools, ...adapters],
								policy: toolPolicy
							}, {
								assertCurrent: assertToolSurfaceCurrent,
								signal
							});
							if (turn.disableTools || turn.modelRun || turn.promptMode === "none") {
								inheritedPublicationToolRef.current = void 0;
								return [];
							}
							if (inheritedPublicationToolRef.current) inheritedPublicationToolRef.current = applyEmbeddedAttemptToolsAllow([inheritedPublicationToolRef.current], turn.toolsAllow)[0];
							return applyEmbeddedAttemptToolsAllow(prepared, turn.toolsAllow).filter((tool) => {
								const location = getAgentToolExecutionLocation(tool);
								const reason = location.kind === "gateway" ? location.unavailableReason : !availablePlacementTools.has(tool.name) || !launchToolNames.includes(tool.name) ? "the placement has no available execution capability" : void 0;
								if (reason) logInfo(`Worker tool ${tool.name} withheld: ${reason}.`);
								return !reason;
							});
						}
					}));
					if (!tools) throw new Error("Gateway tool surface is unavailable");
					assertToolSurfaceCurrent();
					return {
						policy: toolPolicy,
						presentation,
						inheritedPublicationTool: inheritedPublicationToolRef.current,
						tools: tools.map((tool) => copyAgentToolMetadata(tool, {
							...tool,
							execute: (...args) => withPluginRuntimeGenerationScope(preparedRuntime.snapshot, () => tool.execute(...args))
						}))
					};
				}
			});
			const prepareReplyMedia = createWorkerReplyMedia({
				turn,
				remoteWorkspaceDir: placement.remoteWorkspaceDir,
				tunnel,
				assertCurrent: assertActive,
				signal
			});
			bindWorkerTurnCapabilities(params.placements, params.turnClaim, {
				toolSurface: toolRuntime,
				prepareReplyMedia,
				inference
			});
			const connectionIdentity = {
				...toolIdentity,
				credentialHash: credential.deliveryId,
				bundleHash: bootstrapReceipt.bundleHash,
				rpcSetVersion: credential.rpcSetVersion,
				protocolFeatures: bootstrapReceipt.protocolFeatures,
				credentialExpiresAtMs: credential.expiresAtMs
			};
			const surface = await toolRuntime.getSurface(connectionIdentity);
			const promptPreparation = {
				turn: {
					...turn,
					thinkLevel: turn.thinkLevel ?? reasoning ?? "off",
					admittedRunContext
				},
				agentId: placement.agentId,
				workspaceDir: placement.remoteWorkspaceDir,
				preparedModelRuntime: preparedRuntime.snapshot,
				model,
				surface,
				toolRuntime,
				identity: connectionIdentity,
				manager,
				transcriptPolicy,
				history,
				contextEngine: contextEngineAdmission.contextEngine,
				contextEnginePluginId: contextEngineAdmission.contextEngineLogicalTurnLease.effectiveEnginePluginId,
				setLeasedSteering: (lease) => {
					steering.lease = lease;
				},
				assertCurrent: assertActive
			};
			const promptContext = await withPluginRuntimeGenerationScope(preparedRuntime.snapshot, () => prepareWorkerTurnPrompt(promptPreparation));
			const allowedToolNames = surface.tools.map((tool) => tool.definition.name);
			await params.placements.authorizeWorkerTurnTools(params.turnClaim, allowedToolNames, assertTurnInputCurrent);
			if (allowedToolNames.includes("computer")) preparedComputer?.bind(operationalRunInstance, {
				authority: runtimeIdentity.approvalAuthority,
				assertCurrent: assertActive
			});
			const media = await prepareWorkerTurnMedia({
				turn: {
					...turn,
					prompt: promptContext.prompt
				},
				history: promptContext.history,
				workspace: params.workspace,
				remoteWorkspaceDir: placement.remoteWorkspaceDir,
				tunnel,
				isAuthorized,
				signal
			});
			const skillResources = await prepareSkillResourceDelivery(turn.skillsSnapshot, () => {
				if (!isAuthorized()) throw new Error("Worker turn lost authority before skill resource delivery.");
			}, turn.explicitSkillSelections, turn.workspaceDir);
			if (skillResources && !bootstrapReceipt.protocolFeatures.includes("skill-resources-v1")) throw new StaleWorkerBuildError();
			if (!userMessageAlreadyPersisted && !recorder) baseLeafId = await persistWorkerTurnUserMessage({
				turn,
				manager,
				transcriptTarget,
				media,
				assertRunCurrent: params.assertRunCurrent,
				isAuthorized
			});
			const promptMessages = promptContext.runtimeContext ? 2 : 1;
			const initialMessagePlan = windowInitialMessages(media.history, promptMessages);
			if (initialMessagePlan.kind === "provider-replay-unavailable") {
				const details = initialMessagePlan.details;
				emitProviderReplayRejected(turn.config, "bytes" in details ? details : {
					count: details.messageCount,
					reason: details.reason
				});
				throw new WorkerTurnExecutionError(WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE);
			}
			const { bundleHash, openclawVersion, protocolFeatures } = bootstrapReceipt;
			const { github } = readGitHubPublicationFact(placement);
			const launchPlan = await fitLaunchDescriptorWithRuntimeIdentity({
				runtimeIdentity,
				measure: (plan) => tunnel.measureLaunchTurn(plan, params.turnClaim),
				messages: initialMessagePlan.messages,
				build: (agentRuntimeIdentityToken, windowedMessages) => parseWorkerLaunchPlan({
					version: 4,
					admission: {
						environmentId: placement.environmentId,
						credential: credential.credential,
						sessionId: placement.sessionId,
						ownerEpoch: placement.activeOwnerEpoch,
						rpcSetVersion: credential.rpcSetVersion,
						handshake: {
							bundleHash,
							openclawVersion,
							protocolFeatures
						}
					},
					assignment: {
						agentId: placement.agentId,
						operationalRunInstance,
						agentRuntimeIdentityToken,
						runId: turn.runId,
						turnId: randomUUID(),
						prompt: media.prompt,
						suppressPromptTranscript: true,
						workspaceDir: placement.remoteWorkspaceDir,
						...github ? { github } : {},
						...skillResources ? { skillResources } : {},
						...turn.permissionMode ? {
							permissionMode: turn.permissionMode,
							workerContainmentRoot: placement.remoteWorkspaceDir
						} : {},
						modelRef,
						...inferencePlacement === "worker" ? { inference: "runtime-local" } : {},
						inferenceOptions: reasoning ? { reasoning } : {},
						systemPrompt: promptContext.systemPromptText,
						runtimeContext: promptContext.runtimeContext,
						inHistorySystemUpdates: promptContext.inHistorySystemUpdates,
						includeEmptySnapshots: promptContext.includeEmptySnapshots,
						initialMessages: windowedMessages,
						transcript: {
							baseLeafId,
							nextSeq: (placement.lastTranscriptAckCursor ?? 0) + 1
						},
						liveEvents: {
							ackedSeq: placement.lastLiveEventAckCursor ?? 0,
							nextSeq: (placement.lastLiveEventAckCursor ?? 0) + 1
						},
						toolAuthority: {
							exec,
							allowedToolNames: surface.tools.filter((tool) => tool.execution === "placement").map((tool) => tool.definition.name)
						},
						...browser && allowedToolNames.includes("browser") ? { browser } : {},
						...computer && allowedToolNames.includes("computer") ? { computer } : {}
					}
				})
			});
			if (launchPlan.kind === "provider-replay-unavailable") {
				emitProviderReplayRejected(turn.config, {
					bytes: launchPlan.bytes,
					limitBytes: launchPlan.limitBytes,
					reason: launchPlan.reason
				});
				throw new WorkerTurnExecutionError(skillResources ? "The selected skills and conversation exceed this worker transport limit. Detach some session skills or start a shorter session, then retry." : WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE);
			}
			if (!isAuthorized()) throw new Error("Worker turn authority changed while preparing its launch");
			if (steering.lease && !steering.lease.isCurrent()) throw new Error("Queued child results lost authority before worker prompt injection");
			recorder?.markSentToProvider?.();
			turn.onExecutionPhase?.({
				phase: "attempt_dispatch",
				backend
			});
			const handoffAbort = new AbortController();
			let handoffError;
			let handoffPending;
			let dispatchReady = false;
			const onDispatchReady = () => {
				if (dispatchReady) return;
				dispatchReady = true;
				params.onHandoff(environment.nodeDeviceId && environment.sshEndpoint === null ? { requiresTerminalReceipt: true } : void 0);
				turn.onExecutionPhase?.({
					phase: "process_spawned",
					backend
				});
				handoffPending = (async () => {
					try {
						if (!await params.environments.acknowledgeCredentialDelivery(credential)) handoffError = /* @__PURE__ */ new Error("Cloud worker credential owner changed during process handoff");
					} catch (error) {
						handoffError = new Error("Cloud worker credential handoff failed", { cause: error });
					}
					if (handoffError) handoffAbort.abort(handoffError);
				})();
			};
			if (github && readGitHubPublicationFact(placement).github?.token !== github.token) throw new Error("GitHub identity changed before worker launch; retry the turn.");
			let processResult;
			try {
				processResult = await tunnel.launchTurn({
					assertCurrent: assertActive,
					plan: launchPlan.plan,
					turnClaim: params.turnClaim,
					timeoutMs: turn.timeoutMs,
					credentialExpiresAtMs: credential.expiresAtMs,
					signal: AbortSignal.any([signal, handoffAbort.signal]),
					onDispatchReady
				});
			} finally {
				await handoffPending;
			}
			if (environment.nodeDeviceId && environment.sshEndpoint === null) params.onTerminal();
			if (handoffError) throw handoffError;
			if (!dispatchReady) throw new Error("Cloud worker launch completed before transport dispatch");
			return await finalizeWorkerTurnResult({
				...params,
				turn,
				transcriptTarget,
				tunnel,
				processResult,
				modelRef,
				baseLeafId,
				promptContext,
				prepareReplyMedia,
				takeFinishingOutcome: () => takeFinishingOutcome(credential.deliveryId),
				settleSteering: async () => {
					if (steering.lease) {
						await ackPendingAgentSteeringItems(steering.lease);
						steering.lease = void 0;
					}
				},
				signal,
				startedAt
			});
		} finally {
			await toolRuntime?.close();
			stopWatchingClaim();
			stopWatchingRun();
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
export { executeWorkerTurn };
