import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { p as isDiagnosticsEnabled, s as emitTrustedDiagnosticEvent } from "./diagnostic-events-BADdmgZf.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { r as MAX_IMAGE_BYTES } from "./constants-GzjKtFvA.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./defaults-Jag53zwP.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-C14NFDc3.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { b as registerAgentRunDelegatedAuthorityClosedHandler } from "./agent-run-registry-BaxMDLZF.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-BNE7YdYW.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import { i as logWarn, r as logInfo } from "./logger-DskmrSVa.mjs";
import { o as convertToLlm } from "./messages-CeqAykcC.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-eJIIEpha.mjs";
import { p as withSessionTranscriptWriteAssertion } from "./transcript-write-context-m7NE2aEm.mjs";
import { c as getAdmittedRunDelegatedAuthority, f as readAdmittedRunOperatorAuthority, g as resolvePreparedRunAdmission, h as resolveAdmittedRunActiveAssertion, m as readRunOperatorAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import { a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES, t as WORKER_INFERENCE_MAX_CONTEXT_MESSAGES } from "./worker-inference-B7U4TRc2.mjs";
import { Ct as isWorkerGatewayToolFrameWithinBudget, St as WorkerToolSurfaceSchema } from "./worker-admission-CNeLWzVQ.mjs";
import { s as resolveProviderThinkingLevel } from "./thinking-DK1cFezU.mjs";
import { s as resolveEffectiveAgentRuntime } from "./thinking-runtime-BwS3HC5I.mjs";
import { d as readPersistedMediaFacts } from "./media-facts-CJdQ4R61.mjs";
import { i as overlayConfiguredModelCatalog, n as loadManifestModelCatalog } from "./model-catalog-B5tSuR_i.mjs";
import { t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-B8unFFC9.mjs";
import { t as collectTextContentBlocks } from "./content-blocks-v-6_jzoH.mjs";
import { r as resolveImageSanitizationLimits } from "./image-sanitization-DhkMOJXD.mjs";
import { o as hasNonzeroUsage, u as normalizeUsage } from "./usage-XmAH1cfG.mjs";
import { d as stagedInputFileName, o as ensureStagedInputDirectory, u as stagedInputDirectory } from "./staged-inputs-B7cE4lVT.mjs";
import { t as createBoundedRemoteFileReader } from "./remote-workspace-file-Bi0P0wVf.mjs";
import { n as readPersistedMediaImageLayout, t as readPersistedImageBlockFactIndexes } from "./prompt-image-metadata-BI8LFwP3.mjs";
import { a as setPluginToolMeta, r as getPluginToolMeta } from "./tool-metadata-DEC0Rqn3.mjs";
import { i as copyAgentToolMetadata, s as getAgentToolExecutionLocation } from "./agent-tool-metadata-BiQWQ4ti.mjs";
import { t as parseReplyDirectives } from "./reply-directives-Ciui4dZv.mjs";
import { r as resolveSandboxToolPolicyForAgent } from "./tool-policy-eD9SQrK2.mjs";
import { n as projectEffectiveExecPolicy } from "./session-permission-exec-mode-B_8rJnOA.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-DAGJ2iyt.mjs";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-D6JiS64U.mjs";
import { t as MEDIA_MAX_BYTES } from "./store-A0dMc8iV.mjs";
import { i as resolveMediaReferenceLocalPath } from "./media-reference-BIOMSmeS.mjs";
import { a as readLocalMediaFile } from "./local-media-access-BBHmTniP.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BXDxJQSp.mjs";
import "./failover-error-BQyc9xYu.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-Dk4uhhe-.mjs";
import { n as measureAgentRuntimeIdentityTokenBytes, r as mintAgentRuntimeIdentityToken } from "./agent-runtime-identity-token-CFNR2JCX.mjs";
import "./user-turn-transcript-DeadOwaM.mjs";
import { i as buildPersistedUserTurnMessage } from "./user-turn-transcript.message-D6tiOY3Z.mjs";
import { _ as sameWorkerSessionTurnClaim } from "./placement-record-BfcBeilz.mjs";
import { d as getWorkerTurnToolSurface, i as bindWorkerTurnOwner, r as bindWorkerTurnCapabilities } from "./placement-turn-claim-events-BCSz3C5d.mjs";
import { o as resolveContextTokensForModel } from "./context-qaLs5Adf.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-BbWs7GzU.mjs";
import { r as resolveExecDefaults } from "./exec-defaults-B7HapOub.mjs";
import { a as prepareActiveNodeContext, t as buildActiveNodeContextText } from "./active-node-context-DpQMef3G.mjs";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-Bx9S6KFK.mjs";
import { r as messageToolOwnsVisibleReply } from "./source-reply-delivery-mode-C0QKYTyh.mjs";
import { n as createOpenClawCodingToolsInternal } from "./agent-tools-BnAlih5u.mjs";
import { r as bindActiveOperatorTurnAuthority } from "./cron-creator-authority-context-aezDQHzt.mjs";
import { n as createLibrarySkillWorkshopTool } from "./openclaw-tools-Dd40cGRU.mjs";
import { p as capturePresenceToolAuthority } from "./sessions-spawn-tool-D1-em2e9.mjs";
import { n as supportsModelTools } from "./model-tool-support-DIQSEumC.mjs";
import { n as projectAgentToolDefinition, t as prepareCoreToolPolicy } from "./prepared-tool-surface-BZR5bIHj.mjs";
import { t as bindHarnessReplyMedia } from "./reply-media-DWnUcmc6.mjs";
import { t as prepareInstalledSkillCatalog } from "./installed-skill-runtime-XGedGv38.mjs";
import { a as buildUsageAgentMetaFields, l as resolveFinalAssistantRawText, p as resolveReportedModelRef, u as resolveFinalAssistantVisibleText } from "./helpers-DL-Vx2nx.mjs";
import { n as pruneProcessedHistoryImages } from "./history-image-prune-DRwbt9WG.mjs";
import { i as resolveMediaFactLocalRef } from "./images.media-refs-BF5D5dWC.mjs";
import { i as hydratePromptMediaMessages, n as detectAndLoadPromptImages } from "./images-Dog21-sT.mjs";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-7h3_PwTS.mjs";
import "./messages-Lka8u-U2.mjs";
import { t as SessionManager } from "./session-manager-B2n0aSnK.mjs";
import { t as SessionTranscriptMessageCommittedError } from "./session-manager-message-error-C6BAQhGS.mjs";
import { n as withSessionManagerWrite } from "./session-manager-write-admission-B0F76kpn.mjs";
import { t as buildAgentHookContext } from "./hook-context-BQ_9-K77.mjs";
import { r as mergeUsageIntoAccumulator, t as createUsageAccumulator } from "./usage-accumulator-CzWfyqDH.mjs";
import { n as runBeforeAgentRunGate, t as buildAgentRunBlockedUserMessage } from "./before-agent-run-BgS1mgp8.mjs";
import { t as buildProactiveSubagentOrchestrationSection } from "./ultra-orchestration-KhJuvQWv.mjs";
import { n as prepareAgentToolSurfacePresentation, t as createAgentHarnessToolSurfaceRuntimeCore } from "./tool-surface-bridge-D5MCjK3o.mjs";
import { t as buildEmbeddedRunBlockedResult } from "./blocked-run-result-1BwuT3Hh.mjs";
import { s as prepareGitHubPublicationAvailability } from "./github-publication-availability-0ldF1lrO.mjs";
import "./skill-resources-BYZ-VOKK.mjs";
import { a as parseWorkerLaunchPlan } from "./launch-descriptor-BQV4k-tD.mjs";
import { n as prepareSkillResourceDelivery } from "./resources-BxPTqmDb.mjs";
import { i as toWorkerTranscriptMessage, n as isWorkerTranscriptMessageFrameSafe, o as projectWorkerTextOrImageContent, t as WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE } from "./transcript-message-Dz1c-AeG.mjs";
import { r as NODE_WORKER_WORKSPACE_STDOUT_MAX_BYTES } from "./node-workspace-protocol-umi8DFKH.mjs";
import { a as parseWorkerRuntimeResult } from "./worker-process-protocol-B79uIRyP.mjs";
import { t as raceNodeWorkerOperation } from "./node-worker-abort-NUh8GahC.mjs";
import { i as requireCurrentWorkerTurnEnvironment, n as StaleWorkerBuildError } from "./admission-CC4bcfcY.mjs";
import { h as workerWorkspaceCommandSucceeded, y as workspaceSyncError } from "./workspace-sync-helpers-CJW1gdNZ.mjs";
import { t as prepareWorkerGitHubBinding } from "./worker-github-binding-BtUHCVb9.mjs";
import { f as waitForTurnOperation, s as releaseClaimIfOwned, t as WorkerTurnExecutionError } from "./worker-turn-failure-CUqWqmfu.mjs";
import { n as boundWorkerToolResult, s as workerSessionToolErrorResult } from "./worker-session-tool-result-BlCTJkat.mjs";
import { a as createWorkerPlacementTools, n as createWorkerBrowserToolDefinition, t as createWorkerComputerTool } from "./computer-runtime-CbtxI_ga.mjs";
import { n as windowWorkerReplayMessages, t as fitWorkerReplayImages } from "./replay-message-window-CB5m9HXa.mjs";
import { a as resolveWorkerTurnTranscriptTarget, i as workerWorkspaceFailure, n as reconcileWorkspaceAfterTurn, r as recoverWorkspaceBeforeTurn } from "./workspace-result-finalize-BtWrl2uj.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { tempWorkspace } from "@openclaw/fs-safe/temp";
import { Value } from "typebox/value";
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
	const calls = /* @__PURE__ */ new Map();
	let sequential = Promise.resolve();
	return {
		async getSurface(identity) {
			assertCurrent();
			const surface = await (prepared ??= params.prepare(identity).then(({ tools, policy, presentation }) => {
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
				return catalog;
			}));
			assertCurrent();
			return surface;
		},
		async getModelTools(identity) {
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
					modelTools = runtime.compactTools(tools, { prepared: { preserveToolNames: [] } }).tools.map(({ name, description, parameters }) => ({
						name,
						description,
						parameters
					}));
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
function resolveWorkerToolAuthority(params) {
	const turn = params.turn;
	const sandboxSessionKey = turn.sandboxSessionKey?.trim() || turn.sessionKey?.trim() || turn.sessionId;
	const sandbox = resolveSandboxRuntimeStatus({
		cfg: turn.config,
		sessionKey: sandboxSessionKey,
		agentId: turn.agentId
	});
	const capabilityProfile = resolveConversationCapabilityProfile({
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
	const defaults = resolveExecDefaults({
		...turn,
		cfg: turn.config,
		sessionEntry: turn.execSession,
		sessionKey: sandboxSessionKey
	});
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
		capabilityProfile,
		policy: corePolicy,
		exec,
		execUnavailable,
		presentation,
		installedSkills
	};
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
	const media = recordedMedia?.length ? recordedMedia : turn.media ?? [];
	const localWorkspace = params.workspace.kind === "local" ? params.workspace.path : void 0;
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
	const pruned = pruneProcessedHistoryImages(params.history) ?? params.history;
	const history = await hydratePromptMediaMessages(pruned, mediaOptions);
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
		for (const input of inputs) {
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
//#region src/gateway/worker-environments/worker-turn-payload.ts
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
	const assertActive = () => {
		params.assertSourceCurrent();
		assertAdmittedActive();
	};
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
function windowInitialMessages(messages) {
	const windowed = windowWorkerReplayMessages(messages, WORKER_INFERENCE_MAX_CONTEXT_MESSAGES - 1);
	if (windowed.kind === "provider-replay-unavailable") return windowed;
	const projected = [];
	for (const message of windowed.messages) {
		const result = toWorkerTranscriptMessage(message, "inference");
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
	if (processResult.code !== 0 || processResult.signal !== null || processResult.killed) {
		const detail = truncateUtf16Safe(redactSensitiveText(processResult.stderr, { mode: "tools" }).replace(/\s+/gu, " ").trim(), 400);
		throw new Error(detail ? `Cloud worker process failed before completing the turn: ${detail}` : "Cloud worker process failed before completing the turn");
	}
	const result = parseWorkerRuntimeResult(safeParseJsonRecord(processResult.stdout.trim()));
	if (!result) throw new Error("Worker process returned invalid output");
	if (result.status === "not-started") throw new Error(result.errorText);
	if (result.status === "fenced") throw new Error(`Cloud worker turn was fenced: ${result.reason}`);
	return result;
}
function buildWorkerTurnResult(params) {
	const usageAccumulator = createUsageAccumulator();
	const assistants = params.messages.filter((message) => message.role === "assistant");
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
	return {
		...params.reply.text || params.reply.mediaUrl || params.reply.mediaUrls?.length ? { payloads: [params.reply] } : {},
		meta: {
			durationMs: params.durationMs,
			agentMeta: {
				sessionId: params.sessionId,
				sessionFile: params.sessionFile,
				provider: reportedModelRef.provider,
				model: reportedModelRef.model,
				...usageMeta
			},
			stopReason: params.terminal.stopReason,
			finalAssistantVisibleText: resolveFinalAssistantVisibleText(params.terminal),
			finalAssistantRawText: resolveFinalAssistantRawText(params.terminal)
		}
	};
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
			const persisted = await recorder.persistBlocked(message);
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
	const contextMessages = convertToLlm(manager.buildSessionContext().messages);
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
		const preparedRuntime = _usingCtx$1.a(await acquireAgentRunPreparedModelRuntime({
			config: input.config ?? {},
			agentId: placement.agentId,
			agentDir: input.agentDir ?? resolveAgentDir(input.config ?? {}, placement.agentId),
			workspaceDir: input.workspaceDir
		}, {
			pluginGeneration: input.pluginGeneration,
			abortSignal: input.abortSignal
		}));
		params.assertRunCurrent?.();
		input.abortSignal?.throwIfAborted();
		const turn = {
			...input,
			config: preparedRuntime.snapshot.config
		};
		const modelRef = assertSupportedTurn(turn);
		const model = preparedRuntime.snapshot.findConfiguredRuntimeModel(modelRef.provider, modelRef.model) ?? preparedRuntime.snapshot.modelCatalog.entries.find((entry) => entry.provider === modelRef.provider && entry.id === modelRef.model);
		const { environment, bootstrapReceipt } = requireCurrentWorkerTurnEnvironment({
			environments: params.environments,
			placement
		});
		await recoverWorkspaceBeforeTurn({
			...params,
			signal: turn.abortSignal
		});
		params.assertRunCurrent?.();
		turn.abortSignal?.throwIfAborted();
		const githubContext = {
			...placement,
			assertCurrent: () => !turn.abortSignal?.aborted && params.placements.validateTurnClaim(params.turnClaim)
		};
		const [github, githubPublicationAvailable] = await raceNodeWorkerOperation(Promise.all([prepareWorkerGitHubBinding(githubContext), prepareGitHubPublicationAvailability(githubContext)]), turn.abortSignal);
		params.assertRunCurrent?.();
		turn.abortSignal?.throwIfAborted();
		const startedAt = Date.now();
		await turn.onExecutionStarted?.({ lifecycleGeneration: turn.lifecycleGeneration });
		params.assertRunCurrent?.();
		turn.abortSignal?.throwIfAborted();
		if (!params.placements.validateTurnClaim(params.turnClaim)) throw new Error("Worker turn claim is no longer current");
		turn.onExecutionPhase?.({
			phase: "runner_entered",
			backend: "cloud-worker"
		});
		const transcriptTarget = resolveWorkerTurnTranscriptTarget(turn);
		const recorder = turn.userTurnTranscriptRecorder;
		let blocked = false;
		const assertTurnInputCurrent = () => {
			params.assertRunCurrent?.();
			turn.abortSignal?.throwIfAborted();
			if (recorder?.isBlocked() && !blocked) throw new Error("Cloud worker turn input is blocked");
		};
		const assertSourceCurrent = () => {
			assertTurnInputCurrent();
			resolveWorkerTurnTranscriptTarget({
				...transcriptTarget,
				sessionTarget: transcriptTarget
			});
		};
		const assertContextCurrent = () => {
			assertTurnInputCurrent();
			if (!params.placements.validateTurnClaim(params.turnClaim)) throw new Error("Worker turn claim changed during context preparation");
			resolveWorkerTurnTranscriptTarget({
				...transcriptTarget,
				sessionTarget: transcriptTarget
			});
		};
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
		assertContextCurrent();
		if (recorder && turn.suppressNextUserMessagePersistence !== true && !recorder.hasPersisted()) {
			const persisted = await recorder.persistApproved({ cwd: params.workspace.kind === "local" ? params.workspace.path : placement.remoteWorkspaceDir });
			if (persisted) turn.onUserMessagePersisted?.(persisted.message);
			assertContextCurrent();
		}
		const context = await readWorkerTurnInputContext(inputContext);
		const { manager, history, userMessageAlreadyPersisted } = context;
		let baseLeafId = context.baseLeafId;
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
		const reasoning = resolveProviderThinkingLevel({
			provider: modelRef.provider,
			model: modelRef.model,
			catalog: turn.thinkLevel === "ultra" ? overlayConfiguredModelCatalog({
				catalog: loadManifestModelCatalog({
					config: turn.config ?? {},
					workspaceDir: turn.workspaceDir
				}),
				config: turn.config ?? {},
				workspaceDir: turn.workspaceDir
			}) : void 0,
			agentRuntime: "openclaw",
			level: turn.thinkLevel
		});
		const desktop = await prepareWorkerDesktopLaunchPlan({
			desktop: environment.desktop,
			protocolFeatures: bootstrapReceipt.protocolFeatures,
			prepareComputer: () => params.environments.prepareComputer?.(params.turnClaim),
			turn
		});
		const { browser, computer, preparedComputer } = desktop;
		const { capabilityProfile, policy: toolPolicy, exec, execUnavailable, presentation, installedSkills } = resolveWorkerToolAuthority({
			modelRef,
			model,
			placement,
			turn,
			assertCurrent: assertContextCurrent,
			computerAvailable: Boolean(computer)
		});
		const { operationalRunInstance, runtimeIdentity, assertActive, takeFinishingOutcome } = await prepareWorkerAgentRuntimeIdentity({
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
					return current?.state === "attached" && current.ownerEpoch === placement.activeOwnerEpoch && current.attachedSessionIds.length === 1 && current.attachedSessionIds[0] === placement.sessionId;
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
						skillWorkshop,
						portalAvailable,
						prepareTools: (adapters) => {
							const prepared = createOpenClawCodingToolsInternal({
								...turn,
								agentId: placement.agentId,
								conversationCapabilityProfile: capabilityProfile,
								preparedModelRuntime: preparedRuntime.snapshot,
								installedSkills,
								githubPublicationAvailable,
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
							});
							if (turn.disableTools || turn.modelRun || turn.promptMode === "none") return [];
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
				prepareReplyMedia
			});
			const surface = await toolRuntime.getSurface({
				...toolIdentity,
				credentialHash: credential.deliveryId,
				bundleHash: bootstrapReceipt.bundleHash,
				rpcSetVersion: credential.rpcSetVersion,
				protocolFeatures: bootstrapReceipt.protocolFeatures,
				credentialExpiresAtMs: credential.expiresAtMs
			});
			const allowedToolNames = surface.tools.map((tool) => tool.definition.name);
			await params.placements.authorizeWorkerTurnTools(params.turnClaim, allowedToolNames, assertTurnInputCurrent);
			if (allowedToolNames.includes("computer")) preparedComputer?.bind(operationalRunInstance, {
				authority: runtimeIdentity.approvalAuthority,
				assertCurrent: assertActive
			});
			const media = await prepareWorkerTurnMedia({
				turn,
				history,
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
			const initialMessagePlan = windowInitialMessages(media.history);
			if (initialMessagePlan.kind === "provider-replay-unavailable") {
				const details = initialMessagePlan.details;
				emitProviderReplayRejected(turn.config, "bytes" in details ? details : {
					count: details.messageCount,
					reason: details.reason
				});
				throw new WorkerTurnExecutionError(WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE);
			}
			const { bundleHash, openclawVersion, protocolFeatures } = bootstrapReceipt;
			const requesterProfileId = readRunOperatorAuthority(turn)?.profileId;
			await prepareActiveNodeContext(requesterProfileId);
			assertActive();
			const systemPrompt = [
				turn.extraSystemPrompt,
				buildActiveNodeContextText(requesterProfileId),
				...buildProactiveSubagentOrchestrationSection({
					enabled: turn.thinkLevel === "ultra",
					hasSessionsSpawn: allowedToolNames.includes("sessions_spawn")
				})
			].filter(Boolean).join("\n\n");
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
						inferenceOptions: reasoning ? { reasoning } : {},
						systemPrompt,
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
			recorder?.markSentToProvider?.();
			turn.onExecutionPhase?.({
				phase: "attempt_dispatch",
				backend: "cloud-worker"
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
					backend: "cloud-worker"
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
			let processResult;
			try {
				processResult = await tunnel.launchTurn({
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
			const runtimeResult = parseWorkerTurnProcessResult(processResult);
			const workerTurnFailed = runtimeResult.status === "failed";
			const completed = await SessionManager.openAsync(transcriptTarget);
			if (!params.placements.validateWorkspaceResultClaim(params.turnClaim)) throw new Error("Cloud worker result lost its placement owner during transcript hydration");
			resolveWorkerTurnTranscriptTarget({
				...transcriptTarget,
				sessionTarget: transcriptTarget
			});
			const currentPlacement = params.placements.get(placement.sessionId);
			if (runtimeResult.transcriptLeafId !== completed.getLeafId() || runtimeResult.transcriptNextSeq !== (currentPlacement?.lastTranscriptAckCursor ?? 0) + 1) throw new Error(`Cloud worker result does not match its committed transcript acknowledgement (leaf=${runtimeResult.transcriptLeafId ?? "none"}/${completed.getLeafId() ?? "none"}, nextSeq=${runtimeResult.transcriptNextSeq}/${(currentPlacement?.lastTranscriptAckCursor ?? 0) + 1})`);
			const terminal = runtimeResult.transcriptLeafId ? completed.getEntry(runtimeResult.transcriptLeafId) : void 0;
			if (!terminal || terminal.type !== "message" || terminal.message.role !== "assistant") throw new Error("Cloud worker completed without a terminal assistant transcript message");
			const text = collectTextContentBlocks(terminal.message.content).join("");
			const baseIndex = completed.getBranch().findIndex((entry) => entry.id === baseLeafId);
			const workerMessages = completed.getBranch().slice(baseIndex + 1).flatMap((entry) => entry.type === "message" ? [entry.message] : []);
			const finishing = workerTurnFailed ? takeFinishingOutcome(credential.deliveryId) : void 0;
			const workerFailure = workerTurnFailed ? new WorkerTurnExecutionError(finishing?.error ?? "Cloud worker turn failed") : void 0;
			if (workerFailure && finishing?.replayInvalid) recordModelFallbackStop(workerFailure);
			const reply = workerFailure ? { text } : await prepareReplyMedia({ text });
			const workspaceConflict = await reconcileWorkspaceAfterTurn({
				...params,
				transcriptTarget,
				tunnel
			}).catch((reconciliationError) => {
				if (workerFailure) throw workerWorkspaceFailure(workerFailure, reconciliationError);
				throw reconciliationError;
			});
			if (workspaceConflict) {
				const delta = `${reply.text ? "\n\n" : ""}${workspaceConflict.summary}`;
				reply.text = `${reply.text ?? ""}${delta}`;
				await Promise.resolve().then(() => turn.onAgentEvent?.({
					stream: "assistant",
					data: {
						text: reply.text,
						delta
					}
				})).catch(() => void 0);
			}
			if (workerFailure) throw workerFailure;
			return buildWorkerTurnResult({
				messages: workerMessages,
				modelRef,
				terminal: terminal.message,
				durationMs: Date.now() - startedAt,
				sessionId: placement.sessionId,
				sessionFile: turn.sessionFile,
				reply
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
