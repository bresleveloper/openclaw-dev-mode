import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { p as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CJQ8TR--.js";
import { t as createLazyImportLoader } from "./lazy-promise-BONnzNfb.js";
import { t as resolveNonNegativeNumber } from "./number-coercion-EqFmHmOw.js";
import { C as freezeDiagnosticTraceContext, d as isDiagnosticsEnabled, o as emitTrustedDiagnosticEvent, y as createChildDiagnosticTraceContext } from "./diagnostic-events-CLCyIzm6.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-BHKiDwaq.js";
import { x as resolveSubagentModelConfigSelectionResult } from "./agent-scope-CDZXADgT.js";
import { u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-C3ijpoNo.js";
import { a as logWarn } from "./logger-p_Dm5cGu.js";
import { i as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-DXJmS9CT.js";
import { n as resolveAgentHarnessPolicy } from "./harness-runtimes--3bc5qch.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-mDjiWzE5.js";
import { n as isThinkingLevelSupported, o as resolveSupportedThinkingLevel, p as normalizeThinkLevel } from "./thinking-DxaN427I.js";
import { _ as selectApplicableRuntimeConfig, i as getRuntimeConfigSnapshot, s as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-D93_HOsR.js";
import "./config-A41fTHlt.js";
import { d as getAgentRunContext, h as releaseAgentRunContext, r as claimAgentRunContext, t as assertAgentRunLifecycleGenerationCurrent, u as getAgentEventLifecycleGeneration } from "./agent-events-7y1r8HOP.js";
import { s as resolveSessionTranscriptPath } from "./paths-CHZBIGhF.js";
import { d as setSessionRuntimeModel } from "./types-CoDcFuoc.js";
import { t as hasAnyAuthProfileStoreSource } from "./source-check-B4FCIC1K.js";
import { _ as resolveConfiguredModelRef, f as normalizeModelSelection, y as resolveHooksGmailModel } from "./model-selection-shared-CKMggJal.js";
import { i as resolveAllowedModelRef, r as getModelRefStatus, t as resolveThinkingDefault } from "./model-thinking-default-GwbGGXiw.js";
import { h as isCliProvider } from "./model-selection-i8V2iTdL.js";
import { n as loadModelCatalog } from "./model-catalog-DD_dq4PJ.js";
import { d as ensureAgentWorkspace } from "./workspace-DP5mE--D.js";
import { t as resolveAgentTimeoutMs } from "./timeout-Drw0_zOv.js";
import { i as resolveCronDeliverySessionKey } from "./session-target-BoV6mLXy.js";
import { i as hasNonzeroUsage, r as deriveSessionTotalTokens, t as deriveContextPromptTokens } from "./usage-C67Kbb7n.js";
import { d as isCommandLaneTaskTimeoutError } from "./command-queue-JAuVCy9E.js";
import { f as expandToolGroups, m as normalizeToolName } from "./tool-policy-Cm3NCEHp.js";
import { n as createCronRunDiagnosticsFromError, r as mergeCronRunDiagnostics, t as createCronRunDiagnosticsFromAgentResult } from "./run-diagnostics-C9b5voB9.js";
import { l as retireSessionMcpRuntime } from "./agent-bundle-mcp-runtime-BkUYqKo5.js";
import "./agent-bundle-mcp-tools-CJT5lUbs.js";
import { n as resolveSourceDeliveryOutcome, t as createSourceDeliveryPlan } from "./source-delivery-plan-Be8qdDAI.js";
import { n as mapHookExternalContentSource, r as resolveHookExternalContentSource, t as isExternalHookSession } from "./external-content-source-CzLOB3HH.js";
import { n as resolveCronStyleNow } from "./current-time-B0TYU-XW.js";
import { t as createDiagnosticMessageLifecycle } from "./message-lifecycle-DAarWvn5.js";
import { n as resolveCronDeliveryPlan, t as hasExplicitCronDeliveryTarget } from "./delivery-plan-D4344R2m.js";
import { i as persistCronSkillsSnapshotIfChanged, n as createPersistCronSessionEntry, r as markCronSessionPreRun, s as resolveCronPreflightCandidates, t as adoptCronRunSessionMetadata, u as resolveCronChannelOutputPolicy } from "./run-session-state-BN40Yk2l.js";
import { a as resolveHeartbeatAckMaxChars, i as resolveCronPayloadOutcome, t as isHeartbeatOnlyResponse } from "./helpers-CZaP-tUZ.js";
import { t as cleanupCronRunSessionAfterRun } from "./session-cleanup-DgZ6_ZN4.js";
import { t as resolveCronAgentSessionKey } from "./session-key-CYoPx82F.js";
import { t as resolveCronSession } from "./session-DDRbR5CO.js";
//#region src/skills/runtime/cron-snapshot.ts
const skillsSnapshotRuntimeLoader = createLazyImportLoader(() => import("./cron-snapshot.runtime.js"));
async function loadSkillsSnapshotRuntime() {
	return await skillsSnapshotRuntimeLoader.load();
}
async function resolveCronSkillsSnapshot(params) {
	if (params.isFastTestEnv) return params.existingSnapshot ?? {
		prompt: "",
		skills: []
	};
	const runtime = await loadSkillsSnapshotRuntime();
	const skillFilter = runtime.resolveEffectiveAgentSkillFilter(params.config, params.agentId);
	return runtime.resolveReusableWorkspaceSkillSnapshot({
		workspaceDir: params.workspaceDir,
		config: params.config,
		agentId: params.agentId,
		existingSnapshot: params.existingSnapshot,
		skillFilter,
		eligibility: { remote: runtime.getRemoteSkillEligibility({ advertiseExecNode: runtime.canExecRequestNode({
			cfg: params.config,
			agentId: params.agentId
		}) }) },
		watch: false,
		hydrateExisting: false
	}).snapshot;
}
//#endregion
//#region src/agents/embedded-agent-runner/execution-phase.ts
const EMBEDDED_AGENT_EXECUTION_PHASE_LABELS = {
	runner_entered: "runner-entered",
	workspace: "workspace",
	runtime_plugins: "runtime-plugins",
	before_agent_reply: "before-agent-reply",
	model_resolution: "model-resolution",
	auth: "auth",
	context_engine: "context-engine",
	attempt_dispatch: "attempt-dispatch",
	context_assembled: "context-assembled",
	turn_accepted: "turn-accepted",
	process_spawned: "process-spawned",
	tool_execution_started: "tool-execution-started",
	assistant_output_started: "assistant-output-started",
	model_call_started: "model-call-started"
};
/** Converts an internal phase id into the compact label used in status output. */
function formatEmbeddedAgentExecutionPhase(phase) {
	return phase ? EMBEDDED_AGENT_EXECUTION_PHASE_LABELS[phase] : void 0;
}
//#endregion
//#region src/cron/service/execution-errors.ts
/** Formats stable cron timeout and execution error messages. */
function formatCronAgentExecutionPhase(execution) {
	return formatEmbeddedAgentExecutionPhase(execution?.phase);
}
/** Formats the generic cron execution timeout message with last-known phase context when available. */
function timeoutErrorMessage(execution) {
	const phase = formatCronAgentExecutionPhase(execution);
	if (!phase) return "cron: job execution timed out";
	return `cron: job execution timed out (last phase: ${phase})`;
}
/** Formats timeout text for runs that stalled before the isolated runner started. */
function setupTimeoutErrorMessage(execution) {
	const phase = formatCronAgentExecutionPhase(execution);
	if (!phase) return "cron: isolated agent setup timed out before runner start";
	return `cron: isolated agent setup timed out before runner start (last phase: ${phase})`;
}
/** Returns true for the setup-timeout class that fires before the isolated runner starts. */
function isSetupTimeoutErrorText(error) {
	return error.startsWith("cron: isolated agent setup timed out before runner start");
}
/** Formats timeout text for runs that stalled after setup but before execution start. */
function preExecutionTimeoutErrorMessage(execution) {
	const phase = formatCronAgentExecutionPhase(execution);
	if (!phase) return "cron: isolated agent run stalled before execution start";
	return `cron: isolated agent run stalled before execution start (last phase: ${phase})`;
}
/** Extracts a human timeout/abort reason, falling back to the canonical cron timeout text. */
function resolveCronAbortReasonText(reason) {
	if (typeof reason === "string" && reason.trim()) return reason.trim();
	if (reason instanceof Error && reason.message.trim()) return reason.message.trim();
}
/** Extracts a human timeout/abort reason, falling back to the canonical cron timeout text. */
function abortErrorMessage(signal) {
	return resolveCronAbortReasonText(signal?.reason) ?? timeoutErrorMessage();
}
function isAbortError(err) {
	if (!(err instanceof Error)) return false;
	return err.name === "AbortError" || err.message === timeoutErrorMessage();
}
/** Normalizes thrown cron run failures into stable log/run-log text. */
function normalizeCronRunErrorText(err) {
	if (isAbortError(err)) return timeoutErrorMessage();
	if (typeof err === "string") return err === `Error: ${timeoutErrorMessage()}` ? timeoutErrorMessage() : err;
	return String(err);
}
//#endregion
//#region src/cron/isolated-agent/model-selection.ts
function formatAllowedModelRefs(params) {
	const configured = params.cfg.agents?.defaults?.models;
	if (configured && typeof configured === "object" && Object.keys(configured).length > 0) return Object.keys(configured).toSorted().join(", ");
	return "(none configured)";
}
function formatCronPayloadModelRejection(params) {
	const { modelOverride, error } = params;
	if (error.startsWith("model not allowed:")) return `cron payload.model '${modelOverride}' rejected by agents.defaults.models allowlist: ${error.slice(18).trim()} is not in [${formatAllowedModelRefs({ cfg: params.cfg })}]`;
	return `cron payload.model '${modelOverride}' rejected: ${error}`;
}
/** Resolves the effective model for an isolated cron run across defaults, agents, hooks, payload, and session state. */
async function resolveCronModelSelection(params) {
	const resolvedDefault = resolveConfiguredModelRef({
		cfg: params.cfgWithAgentDefaults,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	let provider = resolvedDefault.provider;
	let model = resolvedDefault.model;
	let modelSource = "default";
	let catalog;
	const loadCatalogOnce = async () => {
		if (!catalog) catalog = await loadModelCatalog({ config: params.cfgWithAgentDefaults });
		return catalog;
	};
	const subagentModelConfigSelection = resolveSubagentModelConfigSelectionResult({
		cfg: params.cfg,
		agentId: params.agentId,
		agentConfigOverride: params.agentConfigOverride
	});
	const subagentModelRaw = normalizeModelSelection(subagentModelConfigSelection?.raw);
	const subagentModelSource = subagentModelConfigSelection?.source === "agent" ? "agent" : "subagent";
	if (subagentModelRaw) {
		const resolvedSubagent = resolveAllowedModelRef({
			cfg: params.cfgWithAgentDefaults,
			catalog: await loadCatalogOnce(),
			raw: subagentModelRaw,
			defaultProvider: resolvedDefault.provider,
			defaultModel: resolvedDefault.model
		});
		if (!("error" in resolvedSubagent)) {
			provider = resolvedSubagent.ref.provider;
			model = resolvedSubagent.ref.model;
			modelSource = subagentModelSource;
		}
	}
	let hooksGmailModelApplied = false;
	const hooksGmailModelRef = params.isGmailHook ? resolveHooksGmailModel({
		cfg: params.cfg,
		defaultProvider: DEFAULT_PROVIDER
	}) : null;
	if (hooksGmailModelRef) {
		if (getModelRefStatus({
			cfg: params.cfg,
			catalog: await loadCatalogOnce(),
			ref: hooksGmailModelRef,
			defaultProvider: resolvedDefault.provider,
			defaultModel: resolvedDefault.model
		}).allowed) {
			provider = hooksGmailModelRef.provider;
			model = hooksGmailModelRef.model;
			hooksGmailModelApplied = true;
			modelSource = "hook";
		}
	}
	const modelOverrideRaw = params.payload.kind === "agentTurn" ? params.payload.model : void 0;
	const modelOverride = typeof modelOverrideRaw === "string" ? modelOverrideRaw.trim() : void 0;
	if (modelOverride !== void 0 && modelOverride.length > 0) {
		const resolvedOverride = resolveAllowedModelRef({
			cfg: params.cfgWithAgentDefaults,
			catalog: await loadCatalogOnce(),
			raw: modelOverride,
			defaultProvider: resolvedDefault.provider,
			defaultModel: resolvedDefault.model
		});
		if ("error" in resolvedOverride) return {
			ok: false,
			error: formatCronPayloadModelRejection({
				cfg: params.cfgWithAgentDefaults,
				modelOverride,
				error: resolvedOverride.error
			})
		};
		provider = resolvedOverride.ref.provider;
		model = resolvedOverride.ref.model;
		modelSource = "payload";
	}
	if (!modelOverride && !hooksGmailModelApplied) {
		const sessionModelOverride = params.sessionEntry.modelOverride?.trim();
		if (sessionModelOverride) {
			const sessionProviderOverride = params.sessionEntry.providerOverride?.trim() || resolvedDefault.provider;
			const resolvedSessionOverride = resolveAllowedModelRef({
				cfg: params.cfgWithAgentDefaults,
				catalog: await loadCatalogOnce(),
				raw: `${sessionProviderOverride}/${sessionModelOverride}`,
				defaultProvider: resolvedDefault.provider,
				defaultModel: resolvedDefault.model
			});
			if (!("error" in resolvedSessionOverride)) {
				provider = resolvedSessionOverride.ref.provider;
				model = resolvedSessionOverride.ref.model;
				modelSource = "session";
			}
		}
	}
	return {
		ok: true,
		provider,
		model,
		modelSource
	};
}
//#endregion
//#region src/cron/isolated-agent/run-config.ts
function extractCronAgentDefaultsOverride(agentConfigOverride) {
	const { model: overrideModel, sandbox: _agentSandboxOverride, ...agentOverrideRest } = agentConfigOverride ?? {};
	return {
		overrideModel,
		definedOverrides: Object.fromEntries(Object.entries(agentOverrideRest).filter(([, value]) => value !== void 0))
	};
}
function mergeCronAgentModelOverride(params) {
	const nextDefaults = { ...params.defaults };
	const existingModel = nextDefaults.model && typeof nextDefaults.model === "object" ? nextDefaults.model : {};
	if (typeof params.overrideModel === "string") nextDefaults.model = {
		...existingModel,
		primary: params.overrideModel
	};
	else if (params.overrideModel) nextDefaults.model = {
		...existingModel,
		...params.overrideModel
	};
	return nextDefaults;
}
/** Builds the agent defaults snapshot used by isolated cron runs. */
function buildCronAgentDefaultsConfig(params) {
	const { overrideModel, definedOverrides } = extractCronAgentDefaultsOverride(params.agentConfigOverride);
	return mergeCronAgentModelOverride({
		defaults: Object.assign({}, params.defaults, definedOverrides),
		overrideModel
	});
}
//#endregion
//#region src/cron/isolated-agent/run-timeout.ts
/** Converts cron payload timeout overrides into embedded-runner timeout signals. */
/** Converts explicit cron payload timeoutSeconds into a timer-safe millisecond override signal. */
function resolveCronRunTimeoutOverrideMs(timeoutSeconds) {
	return finiteSecondsToTimerSafeMilliseconds(timeoutSeconds);
}
//#endregion
//#region src/cron/isolated-agent/run.ts
/** Orchestrates isolated cron agent turn setup, execution, delivery, and cleanup. */
const sessionStoreRuntimeLoader = createLazyImportLoader(() => import("./store.runtime.js"));
const cronExecutorRuntimeLoader = createLazyImportLoader(() => import("./run-executor.runtime.js"));
const cronExternalContentRuntimeLoader = createLazyImportLoader(() => import("./run-external-content.runtime.js"));
const cronAuthProfileRuntimeLoader = createLazyImportLoader(() => import("./run-auth-profile.runtime.js"));
const cronContextRuntimeLoader = createLazyImportLoader(() => import("./run-context.runtime.js"));
const cronModelCatalogRuntimeLoader = createLazyImportLoader(() => import("./run-model-catalog.runtime.js"));
const cronDeliveryRuntimeLoader = createLazyImportLoader(() => import("./run-delivery.runtime.js"));
const cronModelPreflightRuntimeLoader = createLazyImportLoader(() => import("./model-preflight.runtime.js"));
const runtimePluginsLoader = createLazyImportLoader(() => import("./runtime-plugins.runtime.js"));
async function loadSessionStoreRuntime() {
	return await sessionStoreRuntimeLoader.load();
}
async function loadCronExecutorRuntime() {
	return await cronExecutorRuntimeLoader.load();
}
async function loadCronExternalContentRuntime() {
	return await cronExternalContentRuntimeLoader.load();
}
async function loadCronAuthProfileRuntime() {
	return await cronAuthProfileRuntimeLoader.load();
}
async function loadCronContextRuntime() {
	return await cronContextRuntimeLoader.load();
}
async function loadCronModelCatalogRuntime() {
	return await cronModelCatalogRuntimeLoader.load();
}
async function loadCronDeliveryRuntime() {
	return await cronDeliveryRuntimeLoader.load();
}
async function loadCronModelPreflightRuntime() {
	return await cronModelPreflightRuntimeLoader.load();
}
async function loadRuntimePlugins() {
	return await runtimePluginsLoader.load();
}
function hasConfiguredAuthProfiles(cfg) {
	return Boolean(cfg.auth?.profiles && Object.keys(cfg.auth.profiles).length > 0) || Boolean(cfg.auth?.order && Object.keys(cfg.auth.order).length > 0);
}
function isCronNestedLaneTaskTimeoutError(err) {
	return isCommandLaneTaskTimeoutError(err, "cron-nested");
}
async function retireRolledCronSessionMcpRuntime(params) {
	if (params.job.sessionTarget === "isolated") return;
	const previousSessionId = normalizeOptionalString(params.cronSession.previousSessionId);
	const currentSessionId = normalizeOptionalString(params.cronSession.sessionEntry.sessionId);
	if (!previousSessionId || previousSessionId === currentSessionId) return;
	await retireSessionMcpRuntime({
		sessionId: previousSessionId,
		reason: "cron-session-rollover",
		onError: (error, sessionId) => {
			logWarn(`[cron:${params.job.id}] Failed to dispose retired bundle MCP runtime for session ${sessionId}: ${String(error)}`);
		}
	});
}
function normalizeCronTraceTarget(target) {
	if (!target) return;
	return {
		...target.channel ? { channel: target.channel } : {},
		...target.to !== void 0 ? { to: target.to } : {},
		...target.accountId ? { accountId: target.accountId } : {},
		...target.threadId !== void 0 ? { threadId: target.threadId } : {},
		...target.source ? { source: target.source } : {}
	};
}
function normalizeMessagingToolTarget(delivery, resolvedDelivery) {
	const { target } = delivery;
	const channel = target.provider?.trim();
	if (!channel) return;
	return {
		channel: channel === "message" && resolvedDelivery.ok && delivery.verifiedTarget ? resolvedDelivery.channel : channel,
		...target.to ? { to: target.to } : {},
		...target.accountId ? { accountId: target.accountId } : {},
		...target.threadId ? { threadId: target.threadId } : {}
	};
}
function buildResolvedCronTraceTarget(resolvedDelivery) {
	if (resolvedDelivery.ok) return {
		ok: true,
		...normalizeCronTraceTarget({
			channel: resolvedDelivery.channel,
			to: resolvedDelivery.to,
			accountId: resolvedDelivery.accountId,
			threadId: resolvedDelivery.threadId,
			source: resolvedDelivery.mode === "implicit" ? "last" : "explicit"
		})
	};
	return {
		ok: false,
		...normalizeCronTraceTarget({
			channel: resolvedDelivery.channel,
			to: resolvedDelivery.to ?? null,
			accountId: resolvedDelivery.accountId,
			threadId: resolvedDelivery.threadId,
			source: resolvedDelivery.mode === "implicit" ? "last" : "explicit"
		}),
		error: resolvedDelivery.error.message
	};
}
function buildCronDeliveryTrace(params) {
	const intended = normalizeCronTraceTarget({
		channel: params.deliveryPlan.channel ?? "last",
		to: params.deliveryPlan.to ?? null,
		accountId: params.deliveryPlan.accountId,
		threadId: params.deliveryPlan.threadId,
		source: params.deliveryPlan.channel === "last" || !params.deliveryPlan.channel ? "last" : "explicit"
	});
	const resolved = params.deliveryPlan.mode !== "none" || hasExplicitCronDeliveryTarget(params.deliveryPlan) ? buildResolvedCronTraceTarget(params.resolvedDelivery) : void 0;
	const messageToolSentTo = params.sourceDeliveryOutcome.visibleDeliveries.map((delivery) => normalizeMessagingToolTarget(delivery, params.resolvedDelivery)).filter((target) => Boolean(target));
	return {
		...intended ? { intended } : {},
		...resolved ? { resolved } : {},
		...messageToolSentTo.length > 0 ? { messageToolSentTo } : {},
		fallbackUsed: params.fallbackUsed,
		delivered: params.delivered
	};
}
function resolveCronSourceDeliveryPlan(params) {
	const target = {
		channel: params.resolvedDelivery.channel,
		to: params.resolvedDelivery.to,
		accountId: params.resolvedDelivery.accountId,
		threadId: params.resolvedDelivery.threadId
	};
	if (params.deliveryPlan.mode === "webhook") return createSourceDeliveryPlan({
		owner: "none",
		reason: "cron_webhook",
		messageToolEnabled: false,
		directFallback: false
	});
	if (params.deliveryPlan.mode === "none") return createSourceDeliveryPlan({
		owner: "none",
		reason: "cron_none",
		target,
		messageToolEnabled: true,
		messageToolForced: false,
		directFallback: false
	});
	return createSourceDeliveryPlan({
		owner: "direct_fallback",
		reason: "cron_announce",
		target,
		messageToolEnabled: true,
		messageToolForced: false,
		requireExplicitMessageTarget: true,
		requireExplicitMessageTargetEvidence: true,
		directFallback: true,
		skipFallbackWhenMessageToolSentToTarget: params.resolvedDelivery.ok
	});
}
function canPromptForMessageTool(params) {
	if (!params.sourceDelivery.messageTool.enabled) return false;
	const normalizedToolsAllow = params.toolsAllow ? expandToolGroups(params.toolsAllow).map((toolName) => normalizeToolName(toolName)) : void 0;
	return params.toolsAllow === void 0 || normalizedToolsAllow?.includes("*") === true || normalizedToolsAllow?.includes("message") === true;
}
/** Exported for #91613 keyless-inherited delivery-context regression coverage. */
async function resolveCronDeliveryContext(params) {
	const deliveryPlan = resolveCronDeliveryPlan(params.job);
	if (deliveryPlan.mode === "webhook") {
		const resolvedDelivery = {
			ok: false,
			channel: void 0,
			to: void 0,
			accountId: void 0,
			threadId: void 0,
			mode: "implicit",
			error: /* @__PURE__ */ new Error("webhook delivery has no chat target")
		};
		return {
			deliveryPlan,
			deliveryRequested: deliveryPlan.requested,
			resolvedDelivery,
			sourceDelivery: resolveCronSourceDeliveryPlan({
				deliveryPlan,
				resolvedDelivery
			})
		};
	}
	if (deliveryPlan.mode === "none" && !hasExplicitCronDeliveryTarget(deliveryPlan)) {
		const resolvedDelivery = {
			ok: false,
			channel: void 0,
			to: void 0,
			accountId: void 0,
			threadId: void 0,
			mode: "implicit",
			error: /* @__PURE__ */ new Error("delivery is disabled")
		};
		return {
			deliveryPlan,
			deliveryRequested: false,
			resolvedDelivery,
			sourceDelivery: resolveCronSourceDeliveryPlan({
				deliveryPlan,
				resolvedDelivery
			})
		};
	}
	const { resolveDeliveryTarget } = await loadCronDeliveryRuntime();
	const resolvedDelivery = await resolveDeliveryTarget(params.cfg, params.agentId, {
		channel: deliveryPlan.channel ?? "last",
		to: deliveryPlan.to,
		threadId: deliveryPlan.threadId,
		accountId: deliveryPlan.accountId,
		sessionKey: resolveCronDeliverySessionKey(params.job)
	});
	return {
		deliveryPlan,
		deliveryRequested: deliveryPlan.requested,
		resolvedDelivery,
		sourceDelivery: resolveCronSourceDeliveryPlan({
			deliveryPlan,
			resolvedDelivery
		})
	};
}
function appendCronDeliveryInstruction(params) {
	if (!params.deliveryRequested) return params.commandBody;
	if (params.messageToolEnabled) {
		const targetHint = params.requireExplicitMessageTarget || !params.resolvedDeliveryOk ? "with an explicit target" : "for the current chat";
		return `${params.commandBody}\n\nUse the message tool if you need to notify the user directly ${targetHint}. If you do not send directly, your final plain-text reply will be delivered automatically.`.trim();
	}
	return `${params.commandBody}\n\nReturn your response as plain text; it will be delivered automatically. If the task explicitly calls for messaging a specific external recipient, note who/where it should go instead of sending it yourself.`.trim();
}
function resolvePositiveContextTokens(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : void 0;
}
async function loadCliRunnerRuntime() {
	return await import("./cli-runner.runtime.js");
}
async function loadUsageFormatRuntime() {
	return await import("./usage-format-BP8ztV_h.js");
}
function resolveCronAgentTurnMessage(input) {
	if (input.job.payload.kind === "agentTurn") return input.job.payload.message;
	return input.message;
}
function resolveCronActiveRuntimeConfig(cfg) {
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	if (!runtimeConfig || !runtimeSourceConfig) return cfg;
	return selectApplicableRuntimeConfig({
		inputConfig: cfg,
		runtimeConfig,
		runtimeSourceConfig
	}) ?? cfg;
}
async function prepareCronRunContext(params) {
	const { input } = params;
	const runtimeCfg = resolveCronActiveRuntimeConfig(input.cfg);
	const defaultAgentId = resolveDefaultAgentId(runtimeCfg);
	const requestedAgentId = typeof input.agentId === "string" && input.agentId.trim() ? input.agentId : typeof input.job.agentId === "string" && input.job.agentId.trim() ? input.job.agentId : void 0;
	const normalizedRequested = requestedAgentId ? normalizeAgentId(requestedAgentId) : void 0;
	const agentId = normalizedRequested ?? defaultAgentId;
	const selectedAgentConfig = resolveAgentConfig(runtimeCfg, agentId);
	const agentConfigOverride = normalizedRequested ? selectedAgentConfig : void 0;
	const matchesDefaultFallbackAgentStringModel = typeof selectedAgentConfig?.model === "string" && resolveAgentModelPrimaryValue(selectedAgentConfig.model) === resolveAgentModelPrimaryValue(runtimeCfg.agents?.defaults?.model);
	const agentCfg = buildCronAgentDefaultsConfig({
		defaults: runtimeCfg.agents?.defaults,
		agentConfigOverride
	});
	const cfgWithAgentDefaults = {
		...runtimeCfg,
		agents: Object.assign({}, runtimeCfg.agents, { defaults: agentCfg })
	};
	let catalog;
	const loadCatalog = async () => {
		if (!catalog) catalog = await (await loadCronModelCatalogRuntime()).loadModelCatalog({ config: cfgWithAgentDefaults });
		return catalog;
	};
	const baseSessionKey = (input.sessionKey?.trim() || `cron:${input.job.id}`).trim();
	const agentSessionKey = resolveCronAgentSessionKey({
		sessionKey: baseSessionKey,
		agentId,
		mainKey: input.cfg.session?.mainKey,
		cfg: input.cfg
	});
	const hookExternalContentSource = (input.job.payload.kind === "agentTurn" ? input.job.payload.externalContentSource : void 0) ?? resolveHookExternalContentSource(baseSessionKey);
	const workspaceDirRaw = resolveAgentWorkspaceDir(input.cfg, agentId);
	const agentDir = resolveAgentDir(input.cfg, agentId);
	const workspaceDir = (await ensureAgentWorkspace({
		dir: workspaceDirRaw,
		ensureBootstrapFiles: !agentCfg?.skipBootstrap && !params.isFastTestEnv,
		skipOptionalBootstrapFiles: agentCfg?.skipOptionalBootstrapFiles
	})).dir;
	const { ensureRuntimePluginsLoaded } = await loadRuntimePlugins();
	ensureRuntimePluginsLoaded({
		config: cfgWithAgentDefaults,
		workspaceDir,
		allowGatewaySubagentBinding: true
	});
	const isGmailHook = hookExternalContentSource === "gmail";
	const now = Date.now();
	const cronSession = resolveCronSession({
		cfg: input.cfg,
		sessionKey: agentSessionKey,
		agentId,
		nowMs: now,
		forceNew: input.job.sessionTarget === "isolated"
	});
	const runSessionId = cronSession.sessionEntry.sessionId;
	const currentRunSessionId = () => cronSession.sessionEntry.sessionId ?? runSessionId;
	if (!cronSession.sessionEntry.sessionFile?.trim()) cronSession.sessionEntry.sessionFile = resolveSessionTranscriptPath(runSessionId, agentId);
	const runSessionKey = baseSessionKey.startsWith("cron:") ? `${agentSessionKey}:run:${runSessionId}` : agentSessionKey;
	const persistSessionEntry = createPersistCronSessionEntry({
		isFastTestEnv: params.isFastTestEnv,
		cronSession,
		agentSessionKey,
		updateSessionStore: async (storePath, update) => {
			const { updateSessionStore } = await loadSessionStoreRuntime();
			await updateSessionStore(storePath, update);
		}
	});
	const withRunSession = (result) => ({
		...result,
		sessionId: currentRunSessionId(),
		sessionKey: runSessionKey
	});
	if (!cronSession.sessionEntry.label?.trim() && baseSessionKey.startsWith("cron:")) {
		const labelSuffix = typeof input.job.name === "string" && input.job.name.trim() ? input.job.name.trim() : input.job.id;
		cronSession.sessionEntry.label = `Cron: ${labelSuffix}`;
	}
	const resolvedModelSelection = await resolveCronModelSelection({
		cfg: input.cfg,
		cfgWithAgentDefaults,
		agentConfigOverride,
		sessionEntry: cronSession.sessionEntry,
		payload: input.job.payload,
		isGmailHook,
		agentId
	});
	if (!resolvedModelSelection.ok) return {
		ok: false,
		result: withRunSession({
			status: "error",
			error: resolvedModelSelection.error,
			diagnostics: createCronRunDiagnosticsFromError("cron-preflight", resolvedModelSelection.error)
		})
	};
	let provider = resolvedModelSelection.provider;
	let model = resolvedModelSelection.model;
	const useSubagentFallbacks = resolvedModelSelection.modelSource === "subagent";
	const inheritDefaultFallbacksForAgentStringModel = matchesDefaultFallbackAgentStringModel && (resolvedModelSelection.modelSource === "default" || resolvedModelSelection.modelSource === "agent");
	const modelPreflightRuntime = await loadCronModelPreflightRuntime();
	const preflightCandidates = resolveCronPreflightCandidates({
		cfg: cfgWithAgentDefaults,
		job: input.job,
		agentId,
		provider,
		model,
		useSubagentFallbacks,
		inheritDefaultFallbacksForAgentStringModel
	});
	let selectedPreflightCandidate;
	let selectedPreflightCandidateIndex = -1;
	let firstUnavailablePreflight;
	for (const [index, candidate] of preflightCandidates.entries()) {
		const candidatePreflight = await modelPreflightRuntime.preflightCronModelProvider({
			cfg: cfgWithAgentDefaults,
			provider: candidate.provider,
			model: candidate.model
		});
		if (candidatePreflight.status === "available") {
			selectedPreflightCandidate = candidate;
			selectedPreflightCandidateIndex = index;
			break;
		}
		firstUnavailablePreflight ??= candidatePreflight;
	}
	if (!selectedPreflightCandidate && firstUnavailablePreflight?.status === "unavailable") {
		logWarn(`[cron:${input.job.id}] ${firstUnavailablePreflight.reason}`);
		return {
			ok: false,
			result: withRunSession({
				status: "skipped",
				error: firstUnavailablePreflight.reason,
				diagnostics: createCronRunDiagnosticsFromError("model-preflight", firstUnavailablePreflight.reason, { severity: "warn" }),
				provider,
				model
			})
		};
	}
	const modelFallbacksOverride = selectedPreflightCandidate && (selectedPreflightCandidate.provider !== provider || selectedPreflightCandidate.model !== model) ? preflightCandidates.slice(selectedPreflightCandidateIndex + 1).map((candidate) => `${candidate.provider}/${candidate.model}`) : void 0;
	if (selectedPreflightCandidate && modelFallbacksOverride) {
		if (firstUnavailablePreflight?.status === "unavailable") logWarn(`[cron:${input.job.id}] Local provider preflight failed for ${firstUnavailablePreflight.provider}/${firstUnavailablePreflight.model} at ${firstUnavailablePreflight.baseUrl}; continuing with fallback ${selectedPreflightCandidate.provider}/${selectedPreflightCandidate.model}.`);
		provider = selectedPreflightCandidate.provider;
		model = selectedPreflightCandidate.model;
	}
	const hooksGmailThinking = isGmailHook ? normalizeThinkLevel(input.cfg.hooks?.gmail?.thinking) : void 0;
	let thinkLevel = normalizeThinkLevel((input.job.payload.kind === "agentTurn" ? input.job.payload.thinking : void 0) ?? void 0) ?? hooksGmailThinking;
	if (!thinkLevel) {
		const thinkingCatalog = await loadCatalog();
		thinkLevel = resolveThinkingDefault({
			cfg: cfgWithAgentDefaults,
			provider,
			model,
			catalog: thinkingCatalog
		});
	}
	const thinkingCatalog = await loadCatalog();
	if (!isThinkingLevelSupported({
		provider,
		model,
		level: thinkLevel,
		catalog: thinkingCatalog
	})) {
		const fallbackThinkLevel = resolveSupportedThinkingLevel({
			provider,
			model,
			level: thinkLevel,
			catalog: thinkingCatalog
		});
		if (fallbackThinkLevel !== thinkLevel) {
			logWarn(`[cron:${input.job.id}] Thinking level "${thinkLevel}" is not supported for ${provider}/${model}; downgrading to "${fallbackThinkLevel}".`);
			thinkLevel = fallbackThinkLevel;
		}
	}
	const explicitTimeoutSeconds = input.job.payload.kind === "agentTurn" ? input.job.payload.timeoutSeconds : void 0;
	const timeoutMs = resolveAgentTimeoutMs({
		cfg: cfgWithAgentDefaults,
		overrideSeconds: explicitTimeoutSeconds
	});
	const runTimeoutOverrideMs = resolveCronRunTimeoutOverrideMs(explicitTimeoutSeconds);
	const agentPayload = input.job.payload.kind === "agentTurn" ? input.job.payload : null;
	const { deliveryPlan, deliveryRequested, resolvedDelivery, sourceDelivery } = await resolveCronDeliveryContext({
		cfg: cfgWithAgentDefaults,
		job: input.job,
		agentId
	});
	const { formattedTime, timeLine } = resolveCronStyleNow(input.cfg, now);
	const message = resolveCronAgentTurnMessage(input);
	const base = `[cron:${input.job.id} ${input.job.name}] ${message}`.trim();
	const isExternalHook = hookExternalContentSource !== void 0 || isExternalHookSession(baseSessionKey);
	const allowUnsafeExternalContent = agentPayload?.allowUnsafeExternalContent === true || isGmailHook && input.cfg.hooks?.gmail?.allowUnsafeExternalContent === true;
	const shouldWrapExternal = isExternalHook && !allowUnsafeExternalContent;
	let commandBody;
	if (isExternalHook) {
		const { detectSuspiciousPatterns } = await loadCronExternalContentRuntime();
		const suspiciousPatterns = detectSuspiciousPatterns(message);
		if (suspiciousPatterns.length > 0) logWarn(`[security] Suspicious patterns detected in external hook content (session=${baseSessionKey}, patterns=${suspiciousPatterns.length}): ${suspiciousPatterns.slice(0, 3).join(", ")}`);
	}
	if (shouldWrapExternal) {
		const { buildSafeExternalPrompt } = await loadCronExternalContentRuntime();
		commandBody = `${buildSafeExternalPrompt({
			content: message,
			source: mapHookExternalContentSource(hookExternalContentSource ?? "webhook"),
			jobName: input.job.name,
			jobId: input.job.id,
			timestamp: formattedTime
		})}\n\n${timeLine}`.trim();
	} else commandBody = `${base}\n${timeLine}`.trim();
	const messageToolPromptEnabled = canPromptForMessageTool({
		sourceDelivery,
		toolsAllow: agentPayload?.toolsAllow
	});
	commandBody = appendCronDeliveryInstruction({
		commandBody,
		deliveryRequested,
		messageToolEnabled: messageToolPromptEnabled,
		resolvedDeliveryOk: resolvedDelivery.ok,
		requireExplicitMessageTarget: sourceDelivery.messageTool.requireExplicitTarget
	});
	const skillsSnapshot = await resolveCronSkillsSnapshot({
		workspaceDir,
		config: cfgWithAgentDefaults,
		agentId,
		existingSnapshot: cronSession.sessionEntry.skillsSnapshot,
		isFastTestEnv: params.isFastTestEnv
	});
	await persistCronSkillsSnapshotIfChanged({
		isFastTestEnv: params.isFastTestEnv,
		cronSession,
		skillsSnapshot,
		nowMs: Date.now(),
		persistSessionEntry
	});
	markCronSessionPreRun({
		entry: cronSession.sessionEntry,
		provider,
		model
	});
	try {
		await persistSessionEntry();
	} catch (err) {
		logWarn(`[cron:${input.job.id}] Failed to persist pre-run session entry: ${String(err)}`);
	}
	await retireRolledCronSessionMcpRuntime({
		job: input.job,
		cronSession
	});
	const authProfileId = !Boolean(cronSession.sessionEntry.authProfileOverride?.trim()) && !hasConfiguredAuthProfiles(cfgWithAgentDefaults) && !hasAnyAuthProfileStoreSource(agentDir) ? void 0 : await (await loadCronAuthProfileRuntime()).resolveSessionAuthProfileOverride({
		cfg: cfgWithAgentDefaults,
		provider,
		acceptedProviderIds: listOpenAIAuthProfileProvidersForAgentRuntime({
			provider,
			harnessRuntime: resolveAgentHarnessPolicy({
				provider,
				modelId: model,
				config: cfgWithAgentDefaults,
				agentId,
				sessionKey: agentSessionKey
			}).runtime,
			config: cfgWithAgentDefaults
		}),
		agentDir,
		sessionEntry: cronSession.sessionEntry,
		sessionStore: cronSession.store,
		sessionKey: agentSessionKey,
		storePath: cronSession.storePath,
		isNewSession: cronSession.isNewSession && input.job.sessionTarget !== "isolated"
	});
	const liveSelection = {
		provider,
		model,
		authProfileId,
		authProfileIdSource: authProfileId ? cronSession.sessionEntry.authProfileOverrideSource : void 0
	};
	return {
		ok: true,
		context: {
			input,
			cfgWithAgentDefaults,
			agentId,
			agentCfg,
			agentDir,
			agentSessionKey,
			runSessionId,
			currentRunSessionId,
			runSessionKey,
			workspaceDir,
			commandBody,
			cronSession,
			persistSessionEntry,
			withRunSession,
			agentPayload,
			deliveryPlan,
			resolvedDelivery,
			deliveryRequested,
			sourceDelivery,
			messageToolPromptEnabled,
			suppressExecNotifyOnExit: deliveryPlan.mode === "none",
			skillsSnapshot,
			liveSelection,
			useSubagentFallbacks,
			inheritDefaultFallbacksForAgentStringModel,
			modelFallbacksOverride,
			thinkLevel,
			timeoutMs,
			runTimeoutOverrideMs
		}
	};
}
async function finalizeCronRun(params) {
	const { prepared, execution } = params;
	const finalRunResult = execution.runResult;
	const payloads = finalRunResult.payloads ?? [];
	let telemetry;
	if (!params.isAborted()) {
		if (finalRunResult.meta?.systemPromptReport) prepared.cronSession.sessionEntry.systemPromptReport = finalRunResult.meta.systemPromptReport;
		adoptCronRunSessionMetadata({
			entry: prepared.cronSession.sessionEntry,
			sessionKey: prepared.agentSessionKey,
			runMeta: finalRunResult.meta?.agentMeta
		});
	}
	const usage = finalRunResult.meta?.agentMeta?.usage;
	const lastCallUsage = finalRunResult.meta?.agentMeta?.lastCallUsage;
	const promptTokens = finalRunResult.meta?.agentMeta?.promptTokens;
	const modelUsed = finalRunResult.meta?.agentMeta?.model ?? execution.fallbackModel ?? execution.liveSelection.model;
	const providerUsed = finalRunResult.meta?.agentMeta?.provider ?? execution.fallbackProvider ?? execution.liveSelection.provider;
	const contextTokens = resolvePositiveContextTokens(prepared.agentCfg?.contextTokens) ?? (await loadCronContextRuntime()).lookupContextTokens(modelUsed, { allowAsyncLoad: false }) ?? resolvePositiveContextTokens(prepared.cronSession.sessionEntry.contextTokens) ?? 2e5;
	if (!params.isAborted()) {
		setSessionRuntimeModel(prepared.cronSession.sessionEntry, {
			provider: providerUsed,
			model: modelUsed
		});
		prepared.cronSession.sessionEntry.contextTokens = contextTokens;
		if (isCliProvider(providerUsed, prepared.cfgWithAgentDefaults)) {
			const cliSessionId = finalRunResult.meta?.agentMeta?.sessionId?.trim();
			if (finalRunResult.meta?.agentMeta?.clearCliSessionBinding === true) {
				const { clearCliSession } = await loadCliRunnerRuntime();
				clearCliSession(prepared.cronSession.sessionEntry, providerUsed);
			} else if (cliSessionId) {
				const { setCliSessionId } = await loadCliRunnerRuntime();
				setCliSessionId(prepared.cronSession.sessionEntry, providerUsed, cliSessionId);
			}
		}
	}
	if (hasNonzeroUsage(usage)) {
		const { estimateUsageCost, resolveModelCostConfig } = await loadUsageFormatRuntime();
		const input = usage.input ?? 0;
		const output = usage.output ?? 0;
		const cacheRead = usage.cacheRead ?? 0;
		const cacheWrite = usage.cacheWrite ?? 0;
		const hasBillableUsageBuckets = usage.input !== void 0 || usage.output !== void 0 || usage.cacheRead !== void 0 || usage.cacheWrite !== void 0;
		const lastCallTotalTokens = deriveSessionTotalTokens({
			usage: lastCallUsage,
			contextTokens,
			promptTokens
		});
		const totalTokens = typeof lastCallTotalTokens === "number" && lastCallTotalTokens > 0 ? lastCallTotalTokens : deriveSessionTotalTokens({
			usage,
			contextTokens,
			promptTokens
		});
		const runEstimatedCostUsd = resolveNonNegativeNumber(estimateUsageCost({
			usage,
			cost: resolveModelCostConfig({
				provider: providerUsed,
				model: modelUsed,
				config: prepared.cfgWithAgentDefaults
			})
		}));
		prepared.cronSession.sessionEntry.inputTokens = input;
		prepared.cronSession.sessionEntry.outputTokens = output;
		const telemetryUsage = {
			input_tokens: input,
			output_tokens: output
		};
		const bucketTotalTokens = input + output + cacheRead + cacheWrite;
		const aggregateTotalTokens = typeof usage.total === "number" && Number.isFinite(usage.total) ? Math.max(bucketTotalTokens, usage.total) : bucketTotalTokens;
		if (aggregateTotalTokens > 0) telemetryUsage.total_tokens = aggregateTotalTokens;
		if (typeof totalTokens === "number" && Number.isFinite(totalTokens) && totalTokens > 0) {
			prepared.cronSession.sessionEntry.totalTokens = totalTokens;
			prepared.cronSession.sessionEntry.totalTokensFresh = true;
		} else {
			prepared.cronSession.sessionEntry.totalTokens = void 0;
			prepared.cronSession.sessionEntry.totalTokensFresh = false;
		}
		prepared.cronSession.sessionEntry.cacheRead = cacheRead;
		prepared.cronSession.sessionEntry.cacheWrite = cacheWrite;
		if (runEstimatedCostUsd !== void 0) prepared.cronSession.sessionEntry.estimatedCostUsd = runEstimatedCostUsd;
		telemetry = {
			model: modelUsed,
			provider: providerUsed,
			usage: telemetryUsage
		};
		if (isDiagnosticsEnabled(prepared.cfgWithAgentDefaults)) {
			const usagePromptTokens = input + cacheRead + cacheWrite;
			const contextUsedTokens = deriveContextPromptTokens({
				lastCallUsage,
				promptTokens,
				usage
			});
			emitTrustedDiagnosticEvent({
				type: "model.usage",
				...finalRunResult.diagnosticTrace ? { trace: freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(finalRunResult.diagnosticTrace)) } : {},
				sessionKey: prepared.runSessionKey,
				sessionId: prepared.currentRunSessionId(),
				channel: "cron",
				agentId: prepared.agentId,
				provider: providerUsed,
				model: modelUsed,
				usage: {
					input,
					output,
					cacheRead,
					cacheWrite,
					promptTokens: usagePromptTokens,
					total: aggregateTotalTokens
				},
				lastCallUsage,
				context: {
					limit: contextTokens,
					...contextUsedTokens !== void 0 ? { used: contextUsedTokens } : {}
				},
				...hasBillableUsageBuckets && runEstimatedCostUsd !== void 0 ? { costUsd: runEstimatedCostUsd } : {},
				durationMs: execution.runEndedAt - execution.runStartedAt
			});
		}
	} else telemetry = {
		model: modelUsed,
		provider: providerUsed
	};
	await prepared.persistSessionEntry();
	if (params.isAborted()) return prepared.withRunSession({
		status: "error",
		error: params.abortReason(),
		diagnostics: mergeCronRunDiagnostics(createCronRunDiagnosticsFromAgentResult(finalRunResult, { finalStatus: "error" }), createCronRunDiagnosticsFromError("cron-setup", params.abortReason())),
		...telemetry
	});
	const cronPayloadOutcome = resolveCronPayloadOutcome({
		payloads,
		runLevelError: finalRunResult.meta?.error,
		failureSignal: finalRunResult.meta?.failureSignal,
		finalAssistantVisibleText: finalRunResult.meta?.finalAssistantVisibleText,
		preferFinalAssistantVisibleText: (await resolveCronChannelOutputPolicy(prepared.resolvedDelivery.channel, { deliveryRequested: prepared.deliveryRequested })).preferFinalAssistantVisibleText
	});
	if (finalRunResult.meta?.aborted === true && !cronPayloadOutcome.hasFatalErrorPayload) {
		const error = normalizeOptionalString(finalRunResult.meta.error?.message) ?? "cron isolated agent run aborted";
		const { cleanupDirectCronSession } = await loadCronDeliveryRuntime();
		await cleanupDirectCronSession({
			job: prepared.input.job,
			agentSessionKey: prepared.agentSessionKey,
			sessionId: prepared.currentRunSessionId(),
			retireReason: "cron-delete-after-run-aborted"
		});
		params.markCronRunSessionCleanupAttempted();
		return prepared.withRunSession({
			status: "error",
			error,
			diagnostics: mergeCronRunDiagnostics(createCronRunDiagnosticsFromAgentResult(finalRunResult, { finalStatus: "error" }), createCronRunDiagnosticsFromError("agent-run", error)),
			...telemetry
		});
	}
	const { synthesizedText, deliveryPayloads, deliveryPayloadHasStructuredContent, hasFatalStructuredErrorPayload, pendingPresentationWarningError } = cronPayloadOutcome;
	let { summary, outputText, hasFatalErrorPayload, embeddedRunError } = cronPayloadOutcome;
	const agentDiagnostics = createCronRunDiagnosticsFromAgentResult(finalRunResult, { finalStatus: hasFatalErrorPayload ? "error" : "ok" });
	const resolveRunOutcome = (result) => prepared.withRunSession({
		status: hasFatalErrorPayload ? "error" : "ok",
		...hasFatalErrorPayload ? { error: embeddedRunError ?? "cron isolated run returned an error payload" } : {},
		summary,
		outputText,
		delivered: result?.delivered,
		deliveryAttempted: result?.deliveryAttempted,
		delivery: result?.delivery,
		diagnostics: hasFatalErrorPayload ? mergeCronRunDiagnostics(agentDiagnostics, createCronRunDiagnosticsFromError("agent-run", embeddedRunError ?? "cron isolated run returned an error payload")) : agentDiagnostics,
		...telemetry
	});
	const failPendingPresentationWarningUnlessDelivered = (delivered) => {
		if (pendingPresentationWarningError && delivered !== true) {
			hasFatalErrorPayload = true;
			embeddedRunError = pendingPresentationWarningError;
		}
	};
	const skipHeartbeatDelivery = prepared.deliveryRequested && !hasFatalErrorPayload && isHeartbeatOnlyResponse(deliveryPayloads, resolveHeartbeatAckMaxChars(prepared.agentCfg));
	const sourceDeliveryOutcome = resolveSourceDeliveryOutcome(prepared.sourceDelivery, {
		didSendViaMessageTool: finalRunResult.didSendViaMessagingTool,
		messageToolSentTargets: finalRunResult.messagingToolSentTargets
	});
	if (sourceDeliveryOutcome.visibleDeliveries.length > 0) {
		const { queueCronMessageToolDeliveryAwareness } = await loadCronDeliveryRuntime();
		await queueCronMessageToolDeliveryAwareness({
			cfg: prepared.cfgWithAgentDefaults,
			job: prepared.input.job,
			agentId: prepared.agentId,
			agentSessionKey: prepared.agentSessionKey,
			runStartedAt: execution.runStartedAt,
			resolvedDelivery: prepared.resolvedDelivery,
			sourceDeliveryOutcome
		});
	}
	if (hasFatalStructuredErrorPayload && prepared.deliveryRequested) {
		const { cleanupDirectCronSession } = await loadCronDeliveryRuntime();
		await cleanupDirectCronSession({
			job: prepared.input.job,
			agentSessionKey: prepared.agentSessionKey,
			sessionId: prepared.currentRunSessionId(),
			retireReason: "cron-delete-after-run-fatal-error"
		});
		params.markCronRunSessionCleanupAttempted();
		const deliveryTrace = buildCronDeliveryTrace({
			deliveryPlan: prepared.deliveryPlan,
			resolvedDelivery: prepared.resolvedDelivery,
			sourceDeliveryOutcome,
			fallbackUsed: false,
			delivered: sourceDeliveryOutcome.verifiedMessageToolDelivery
		});
		return resolveRunOutcome({
			delivered: sourceDeliveryOutcome.verifiedMessageToolDelivery,
			deliveryAttempted: sourceDeliveryOutcome.verifiedMessageToolDelivery,
			delivery: deliveryTrace
		});
	}
	const { dispatchCronDelivery, resolveCronDeliveryBestEffort } = await loadCronDeliveryRuntime();
	const deliveryResult = await dispatchCronDelivery({
		cfg: prepared.input.cfg,
		cfgWithAgentDefaults: prepared.cfgWithAgentDefaults,
		deps: prepared.input.deps,
		job: prepared.input.job,
		agentId: prepared.agentId,
		agentSessionKey: prepared.agentSessionKey,
		runSessionKey: prepared.runSessionKey,
		sessionId: prepared.currentRunSessionId(),
		runStartedAt: execution.runStartedAt,
		runEndedAt: execution.runEndedAt,
		timeoutMs: prepared.timeoutMs,
		resolvedDelivery: prepared.resolvedDelivery,
		deliveryRequested: prepared.deliveryRequested,
		skipHeartbeatDelivery,
		sourceDeliveryOutcome,
		deliveryBestEffort: resolveCronDeliveryBestEffort(prepared.input.job),
		deliveryPayloadHasStructuredContent,
		deliveryPayloads,
		synthesizedText,
		ttsAuto: prepared.cronSession.sessionEntry.ttsAuto,
		summary,
		outputText,
		telemetry,
		abortSignal: prepared.input.abortSignal ?? prepared.input.signal,
		isAborted: params.isAborted,
		abortReason: params.abortReason,
		withRunSession: prepared.withRunSession
	});
	if (deliveryResult.cronRunSessionCleanupAttempted) params.markCronRunSessionCleanupAttempted();
	const deliveryTrace = buildCronDeliveryTrace({
		deliveryPlan: prepared.deliveryPlan,
		resolvedDelivery: prepared.resolvedDelivery,
		sourceDeliveryOutcome,
		fallbackUsed: prepared.deliveryRequested && deliveryResult.deliveryAttempted && !sourceDeliveryOutcome.satisfiesSourceDelivery,
		delivered: deliveryResult.delivered
	});
	if (deliveryResult.result) {
		const resultWithDeliveryMeta = {
			...deliveryResult.result,
			deliveryAttempted: deliveryResult.result.deliveryAttempted ?? deliveryResult.deliveryAttempted,
			delivery: deliveryTrace,
			diagnostics: mergeCronRunDiagnostics(agentDiagnostics, deliveryResult.result.diagnostics, deliveryResult.result.status === "error" && deliveryResult.result.error ? createCronRunDiagnosticsFromError("delivery", deliveryResult.result.error) : void 0)
		};
		failPendingPresentationWarningUnlessDelivered(resultWithDeliveryMeta.delivered ?? deliveryResult.delivered);
		if (!hasFatalErrorPayload || deliveryResult.result.status !== "ok") return resultWithDeliveryMeta;
		return resolveRunOutcome({
			delivered: deliveryResult.result.delivered,
			deliveryAttempted: resultWithDeliveryMeta.deliveryAttempted,
			delivery: deliveryTrace
		});
	}
	summary = deliveryResult.summary;
	outputText = deliveryResult.outputText;
	failPendingPresentationWarningUnlessDelivered(deliveryResult.delivered);
	return resolveRunOutcome({
		delivered: deliveryResult.delivered,
		deliveryAttempted: deliveryResult.deliveryAttempted,
		delivery: deliveryTrace
	});
}
/**
* Release runtime references held by a completed isolated cron run.
*
* After the final durable write and delivery complete, the cron session store
* and run context are no longer needed in memory.  This shallow disposal prevents
* the heap-retention pattern described in #85019 where ~113k copies of the skill
* prompt string accumulated through cron run contexts that were never released.
*
* O(1) — nulls known large fields without deep traversal.  MUST run after the
* final `persistSessionEntry()` and delivery construction, never before.
*/
async function disposeCronRunContext(params) {
	releaseAgentRunContext(params.sessionId, params.runContextOwnerToken);
	if (params.ownsRunContext) await retireSessionMcpRuntime({
		sessionId: params.sessionId,
		reason: "isolated-cron-dispose",
		onError: (error, sid) => {
			logWarn(`[cron] Failed to retire MCP runtime during isolated cron dispose ${sid}: ${String(error)}`);
		}
	}).catch(() => {});
	params.cronSession.store = void 0;
}
/** Runs one isolated cron agent turn, including setup, execution, delivery, and persistence. */
async function runCronIsolatedAgentTurn(params) {
	const admittedLifecycleGeneration = getAgentEventLifecycleGeneration();
	const abortSignal = params.abortSignal ?? params.signal;
	const isAborted = () => abortSignal?.aborted === true;
	const abortReason = () => resolveCronAbortReasonText(abortSignal?.reason) ?? "cron: job execution timed out";
	const prepared = await prepareCronRunContext({
		input: params,
		isFastTestEnv: process.env.OPENCLAW_TEST_FAST === "1"
	});
	if (!prepared.ok) return prepared.result;
	const initialSessionId = prepared.context.cronSession.sessionEntry.sessionId;
	const ownsRunContext = params.job.sessionTarget === "isolated";
	let runContextOwnerToken;
	let runLifecycleGeneration = admittedLifecycleGeneration;
	const notifyExecutionStarted = (info) => {
		if (info?.lifecycleGeneration) runLifecycleGeneration = info.lifecycleGeneration;
		params.onExecutionStarted?.({
			jobId: params.job.id,
			agentId: prepared.context.agentId,
			sessionId: prepared.context.currentRunSessionId(),
			sessionKey: prepared.context.runSessionKey,
			phase: "runner_entered",
			provider: prepared.context.liveSelection.provider,
			model: prepared.context.liveSelection.model
		});
	};
	const notifyExecutionPhase = (info) => {
		params.onExecutionPhase?.({
			jobId: params.job.id,
			agentId: prepared.context.agentId,
			sessionId: prepared.context.currentRunSessionId(),
			sessionKey: prepared.context.runSessionKey,
			provider: prepared.context.liveSelection.provider,
			model: prepared.context.liveSelection.model,
			...info
		});
	};
	const turnStartedAtMs = Date.now();
	const messageLifecycle = createDiagnosticMessageLifecycle({
		enabled: isDiagnosticsEnabled(params.cfg),
		sessionId: prepared.context.runSessionId,
		sessionKey: prepared.context.runSessionKey,
		channel: "cron",
		source: "cron-isolated",
		startedAtMs: turnStartedAtMs,
		trackSessionState: true
	});
	messageLifecycle.markProcessing();
	let outcome = "completed";
	let outcomeError;
	let cronRunSessionCleanupAttempted = false;
	try {
		assertAgentRunLifecycleGenerationCurrent(runLifecycleGeneration);
		const existingRunContext = getAgentRunContext(initialSessionId);
		runContextOwnerToken = claimAgentRunContext(initialSessionId, {
			sessionKey: ownsRunContext || !existingRunContext?.sessionKey ? prepared.context.runSessionKey : existingRunContext.sessionKey,
			sessionId: initialSessionId,
			lifecycleGeneration: runLifecycleGeneration
		}, {
			trackOwner: true,
			ownsContext: ownsRunContext
		});
		const { executeCronRun } = await loadCronExecutorRuntime();
		const execution = await executeCronRun({
			cfg: params.cfg,
			cfgWithAgentDefaults: prepared.context.cfgWithAgentDefaults,
			job: params.job,
			agentId: prepared.context.agentId,
			agentDir: prepared.context.agentDir,
			agentSessionKey: prepared.context.agentSessionKey,
			runSessionKey: prepared.context.runSessionKey,
			workspaceDir: prepared.context.workspaceDir,
			lane: params.lane,
			resolvedDelivery: {
				channel: prepared.context.resolvedDelivery.channel,
				to: prepared.context.resolvedDelivery.to,
				accountId: prepared.context.resolvedDelivery.accountId,
				threadId: prepared.context.resolvedDelivery.threadId
			},
			resolvedDeliveryOk: prepared.context.resolvedDelivery.ok,
			deliveryRequested: prepared.context.deliveryRequested,
			sourceDelivery: prepared.context.sourceDelivery,
			messageToolPromptEnabled: prepared.context.messageToolPromptEnabled,
			skillsSnapshot: prepared.context.skillsSnapshot,
			agentPayload: prepared.context.agentPayload,
			useSubagentFallbacks: prepared.context.useSubagentFallbacks,
			inheritDefaultFallbacksForAgentStringModel: prepared.context.inheritDefaultFallbacksForAgentStringModel,
			modelFallbacksOverride: prepared.context.modelFallbacksOverride,
			agentVerboseDefault: prepared.context.agentCfg?.verboseDefault,
			liveSelection: prepared.context.liveSelection,
			cronSession: prepared.context.cronSession,
			commandBody: prepared.context.commandBody,
			persistSessionEntry: prepared.context.persistSessionEntry,
			abortSignal,
			onExecutionStarted: notifyExecutionStarted,
			onExecutionPhase: notifyExecutionPhase,
			onLaneWait: params.onLaneWait,
			abortReason,
			isAborted,
			thinkLevel: prepared.context.thinkLevel,
			timeoutMs: prepared.context.timeoutMs,
			runTimeoutOverrideMs: prepared.context.runTimeoutOverrideMs,
			suppressExecNotifyOnExit: prepared.context.suppressExecNotifyOnExit
		});
		const finalized = await finalizeCronRun({
			prepared: prepared.context,
			execution,
			abortReason,
			isAborted,
			markCronRunSessionCleanupAttempted: () => {
				cronRunSessionCleanupAttempted = true;
			}
		});
		if (finalized.status === "error") {
			outcome = "error";
			outcomeError = finalized.error;
		}
		return finalized;
	} catch (err) {
		const isCronLaneTimeout = isAborted() || isCronNestedLaneTaskTimeoutError(err);
		const error = isCronLaneTimeout ? abortReason() : String(err);
		outcome = "error";
		outcomeError = error;
		return prepared.context.withRunSession({
			status: "error",
			error,
			diagnostics: createCronRunDiagnosticsFromError(isCronLaneTimeout ? "cron-setup" : "agent-run", isCronLaneTimeout ? error : err)
		});
	} finally {
		const finalSessionRef = {
			sessionId: prepared.context.currentRunSessionId(),
			sessionKey: prepared.context.runSessionKey
		};
		messageLifecycle.markIdle(void 0, finalSessionRef);
		messageLifecycle.markProcessed(outcome, {
			...finalSessionRef,
			error: outcomeError
		});
		try {
			if (!cronRunSessionCleanupAttempted) cronRunSessionCleanupAttempted = await cleanupCronRunSessionAfterRun({
				job: params.job,
				agentSessionKey: prepared.context.agentSessionKey,
				sessionId: prepared.context.currentRunSessionId(),
				reason: "cron-delete-after-run-finally"
			});
		} finally {
			await disposeCronRunContext({
				sessionId: initialSessionId,
				cronSession: prepared.context.cronSession,
				ownsRunContext,
				runContextOwnerToken
			});
		}
	}
}
//#endregion
export { preExecutionTimeoutErrorMessage as a, normalizeCronRunErrorText as i, abortErrorMessage as n, setupTimeoutErrorMessage as o, isSetupTimeoutErrorText as r, timeoutErrorMessage as s, runCronIsolatedAgentTurn as t };
