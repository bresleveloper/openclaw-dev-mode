import { c as asFiniteNumberInRange, s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as captureAsyncWorkTracker, t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import "./src-CZ2wJvNB.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { V as markHostPluginUsageDiagnosticEvent, f as isDiagnosticsEnabled, o as emitTrustedDiagnosticEvent } from "./diagnostic-events-CVabF32H.mjs";
import { r as getChildLogger } from "./logger--ALOusOG.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { o as normalizeModelRef } from "./model-ref-shared-BgRrSHjn.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { r as buildConfiguredModelCatalog } from "./model-selection-shared-0uvJbX1M.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import "./logging-CrcvifP_.mjs";
import { u as resolveThinkingProfile } from "./thinking-B1p5pEC8.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-Dvszh-e-.mjs";
import { c as hasRecordedUsageCost, u as normalizeUsage } from "./usage-XXLoqJQC.mjs";
import { n as estimateUsageCost, o as resolveModelCostConfig, t as estimateAggregateUsageCost } from "./usage-format-CisMpgmJ.mjs";
import { t as compileModelAllowlist } from "./model-allowlist-ByzHidkj.mjs";
import { n as writeRuntimeLog } from "./runtime-logging-Cs0MFHNU.mjs";
//#region src/plugins/runtime/runtime-llm-error.ts
function createLlmCompleteError(code, message, cause) {
	return Object.assign(new Error(message, cause === void 0 ? void 0 : { cause }), {
		name: "LlmCompleteError",
		code
	});
}
//#endregion
//#region src/plugins/runtime/runtime-llm-isolated.ts
const MAX_TIMER_DELAY_MS = 2147483647;
function requireIsolatedUserPrompt(params) {
	if (params.execution?.mode !== "isolated-agent-runtime" || !Array.isArray(params.messages) || params.messages.length !== 1 || params.messages[0]?.role !== "user" || typeof params.messages[0].content !== "string") throw createLlmCompleteError("LLM_ISOLATED_INPUT_REJECTED", "Isolated agent-runtime completion requires exactly one user message; pass system instructions through systemPrompt.");
	return params.messages[0].content;
}
function isIsolatedAgentRuntimeRequest(params) {
	return params.execution?.mode === "isolated-agent-runtime";
}
function assertSupportedExecutionMode(params) {
	const execution = params.execution;
	if (execution === void 0) return;
	if (!execution || typeof execution !== "object" || Array.isArray(execution) || execution.mode !== "isolated-agent-runtime") throw createLlmCompleteError("LLM_ISOLATED_INPUT_REJECTED", "Plugin LLM completion execution.mode must be \"isolated-agent-runtime\" when execution is provided.");
	if ("requiredAuthMode" in params && params.requiredAuthMode !== void 0 || "responseFormat" in params && params.responseFormat !== void 0) throw createLlmCompleteError("LLM_ISOLATED_INPUT_REJECTED", "Isolated agent-runtime completion does not support requiredAuthMode or responseFormat; use direct completion for provider controls.");
}
function resolveIsolatedTimeoutMs(value) {
	if (value === void 0) return 3e4;
	const timeoutMs = asFiniteNumber(value);
	if (timeoutMs === void 0 || !Number.isSafeInteger(timeoutMs) || timeoutMs <= 0 || timeoutMs > MAX_TIMER_DELAY_MS) throw createLlmCompleteError("LLM_ISOLATED_INPUT_REJECTED", `Isolated agent-runtime completion timeoutMs must be an integer from 1 through ${MAX_TIMER_DELAY_MS}.`);
	return timeoutMs;
}
function assertIsolatedReasoningSupported(params) {
	if (params.reasoning === void 0) return;
	const catalog = buildConfiguredModelCatalog({ cfg: params.cfg });
	const profile = resolveThinkingProfile({
		provider: params.provider,
		model: params.model,
		agentRuntime: resolveEffectiveAgentRuntime({
			cfg: params.cfg,
			agentId: params.agentId,
			provider: params.provider,
			modelId: params.model
		}),
		...catalog.length > 0 ? { catalog } : {}
	});
	if (profile.levels.some((level) => level.id === params.reasoning)) return;
	throw createLlmCompleteError("LLM_ISOLATED_INPUT_REJECTED", `Thinking level "${params.reasoning}" is not supported for ${params.provider}/${params.model}. Use one of: ${profile.levels.map((level) => level.label).join(", ")}.`);
}
async function runIsolatedAgentRuntimeCompletion(params) {
	const prompt = requireIsolatedUserPrompt(params.request);
	const timeoutMs = resolveIsolatedTimeoutMs(params.request.execution.timeoutMs);
	assertIsolatedReasoningSupported({
		cfg: params.cfg,
		agentId: params.agentId,
		provider: params.provider,
		model: params.model,
		reasoning: params.request.reasoning
	});
	const controller = new AbortController();
	let timedOut = false;
	const abortFromCaller = () => controller.abort(params.request.signal?.reason);
	if (params.request.signal?.aborted) throw createLlmCompleteError("LLM_COMPLETION_ABORTED", "Plugin LLM completion was aborted.");
	params.request.signal?.addEventListener("abort", abortFromCaller, { once: true });
	const timer = setTimeout(() => {
		timedOut = true;
		controller.abort(/* @__PURE__ */ new Error(`Isolated completion timed out after ${timeoutMs}ms.`));
	}, timeoutMs);
	timer.unref?.();
	let rejectOnAbort;
	const abortPromise = new Promise((_resolve, reject) => {
		rejectOnAbort = () => {
			const reason = controller.signal.reason;
			reject(reason instanceof Error ? reason : /* @__PURE__ */ new Error("Isolated completion was aborted."));
		};
		controller.signal.addEventListener("abort", rejectOnAbort, { once: true });
	});
	try {
		const operation = (async () => {
			const { runIsolatedCompletion } = await import("./isolated-completion-BA7_b168.mjs");
			return await runIsolatedCompletion({
				config: params.cfg,
				provider: params.provider,
				model: params.model,
				authProfileId: params.authProfileId,
				agentId: params.agentId,
				systemPrompt: params.request.systemPrompt ?? "",
				prompt,
				timeoutMs,
				abortSignal: controller.signal,
				thinkLevel: params.request.reasoning,
				streamParams: {
					maxTokens: asFiniteNumber(params.request.maxTokens),
					temperature: asFiniteNumber(params.request.temperature)
				}
			});
		})();
		return await Promise.race([operation, abortPromise]);
	} catch (error) {
		if (timedOut) throw createLlmCompleteError("LLM_COMPLETION_TIMEOUT", `Plugin LLM completion timed out after ${timeoutMs}ms.`, error);
		if (params.request.signal?.aborted) throw createLlmCompleteError("LLM_COMPLETION_ABORTED", "Plugin LLM completion was aborted.", error);
		const isolatedError = error;
		if (isolatedError.code === "unsupported") throw createLlmCompleteError("LLM_ISOLATED_UNSUPPORTED", typeof isolatedError.message === "string" ? isolatedError.message : "Configured agent runtime does not support isolated completion.", error);
		if (isolatedError.code === "runtime-unavailable") throw createLlmCompleteError("LLM_RUNTIME_UNAVAILABLE", typeof isolatedError.message === "string" ? isolatedError.message : "Configured agent runtime is unavailable.", error);
		if (isolatedError.code === "input-rejected") throw createLlmCompleteError("LLM_ISOLATED_INPUT_REJECTED", typeof isolatedError.message === "string" ? isolatedError.message : "Isolated completion input was rejected.", error);
		if (isolatedError.code === "output-rejected") throw createLlmCompleteError("LLM_COMPLETION_OUTPUT_REJECTED", typeof isolatedError.message === "string" ? isolatedError.message : "Isolated completion output was rejected.", error);
		throw createLlmCompleteError("LLM_COMPLETION_FAILED", "Plugin LLM completion failed.", error);
	} finally {
		clearTimeout(timer);
		if (rejectOnAbort) controller.signal.removeEventListener("abort", rejectOnAbort);
		params.request.signal?.removeEventListener("abort", abortFromCaller);
	}
}
//#endregion
//#region src/plugins/runtime/runtime-llm.runtime.ts
const defaultLogger = getChildLogger({ capability: "runtime.llm" });
function toRuntimeLogger(logger) {
	return {
		debug: (message, meta) => writeRuntimeLog(logger, "debug", message, meta),
		info: (message, meta) => writeRuntimeLog(logger, "info", message, meta),
		warn: (message, meta) => writeRuntimeLog(logger, "warn", message, meta),
		error: (message, meta) => writeRuntimeLog(logger, "error", message, meta)
	};
}
function normalizeCaller(caller, fallback) {
	const source = caller ?? fallback;
	if (!source) return { kind: "unknown" };
	return {
		kind: source.kind,
		...normalizeOptionalString(source.id) ? { id: source.id.trim() } : {},
		...normalizeOptionalString(source.name) ? { name: source.name.trim() } : {}
	};
}
function resolveTrustedCaller(authority) {
	if (authority?.caller?.kind === "context-engine") return normalizeCaller(authority.caller);
	const scope = getPluginRuntimeGatewayRequestScope();
	const scopedPluginId = normalizeOptionalString(scope?.pluginId);
	if (scopedPluginId) return {
		kind: "plugin",
		id: scopedPluginId
	};
	return normalizeCaller(authority?.caller);
}
function resolveRuntimeConfig(options) {
	const cfg = options.getConfig?.();
	if (!cfg) throw new Error("Plugin LLM completion requires an injected runtime config scope.");
	return cfg;
}
async function resolveAgentId(params) {
	const authorityAgentIdRaw = normalizeOptionalString(params.authority?.agentId);
	const requestedAgentIdRaw = normalizeOptionalString(params.request.agentId);
	const authorityAgentId = authorityAgentIdRaw ? normalizeAgentId(authorityAgentIdRaw) : void 0;
	const requestedAgentId = requestedAgentIdRaw ? normalizeAgentId(requestedAgentIdRaw) : void 0;
	if (params.authority?.requiresBoundAgent && !authorityAgentId) throw createLlmCompleteError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion is not bound to an active session agent.");
	if (authorityAgentId) {
		if (requestedAgentId && requestedAgentId !== authorityAgentId && !params.allowAgentIdOverride) throw createLlmCompleteError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion cannot override the active session agent.");
		return authorityAgentId;
	}
	if (requestedAgentId) {
		if (!params.allowAgentIdOverride) throw createLlmCompleteError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion cannot override the target agent.");
		return requestedAgentId;
	}
	const { resolveAmbientOwnerAgentId } = await import("./agent-scope-C4CYkKyC.mjs");
	return resolveAmbientOwnerAgentId(params.cfg);
}
function buildSystemPrompt(params) {
	const segments = [normalizeOptionalString(params.systemPrompt), ...params.messages.filter((message) => message.role === "system").map((message) => normalizeOptionalString(message.content))].filter((segment) => Boolean(segment));
	return segments.length > 0 ? segments.join("\n\n") : void 0;
}
function buildMessages(params) {
	const now = Date.now();
	return params.request.messages.filter((message) => message.role !== "system").map((message) => message.role === "user" ? {
		role: "user",
		content: message.content,
		timestamp: now
	} : {
		role: "assistant",
		content: [{
			type: "text",
			text: message.content
		}],
		api: params.api,
		provider: params.provider,
		model: params.model,
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		},
		stopReason: "stop",
		timestamp: now
	});
}
function readFiniteNonNegativeNumber(value) {
	return asFiniteNumberInRange(value, { min: 0 });
}
function readExplicitCostUsd(raw) {
	const cost = asOptionalRecord(raw)?.cost;
	if (typeof cost === "number") return readFiniteNonNegativeNumber(cost);
	const record = asOptionalRecord(cost);
	if (!record) return;
	return readFiniteNonNegativeNumber(record.totalUsd) ?? (hasRecordedUsageCost(record) ? readFiniteNonNegativeNumber(record.total) : void 0);
}
function finalizePluginLlmCompletion(params) {
	const normalized = normalizeUsage(params.rawUsage);
	const costConfig = resolveModelCostConfig({
		provider: params.result.provider,
		model: params.result.model,
		config: params.cfg
	});
	const estimateCost = params.result.execution.mode === "direct-provider" ? estimateUsageCost : estimateAggregateUsageCost;
	const costUsd = readExplicitCostUsd(params.rawUsage) ?? estimateCost({
		usage: normalized,
		cost: costConfig
	});
	const usage = {
		...normalized?.input !== void 0 ? { inputTokens: normalized.input } : {},
		...normalized?.output !== void 0 ? { outputTokens: normalized.output } : {},
		...normalized?.cacheRead !== void 0 ? { cacheReadTokens: normalized.cacheRead } : {},
		...normalized?.cacheWrite !== void 0 ? { cacheWriteTokens: normalized.cacheWrite } : {},
		...normalized?.total !== void 0 ? { totalTokens: normalized.total } : {},
		...costUsd !== void 0 ? { costUsd } : {}
	};
	(params.logger ?? toRuntimeLogger(defaultLogger)).info("plugin llm completion", {
		caller: params.result.audit.caller,
		purpose: params.result.audit.purpose,
		sessionKey: params.result.audit.sessionKey,
		agentId: params.result.agentId,
		provider: params.result.provider,
		model: params.result.model,
		executionMode: params.result.execution.mode,
		executionOwner: params.result.execution.owner,
		usage
	});
	const input = normalized?.input ?? 0;
	const output = normalized?.output ?? 0;
	const cacheRead = normalized?.cacheRead ?? 0;
	const cacheWrite = normalized?.cacheWrite ?? 0;
	const promptTokens = input + cacheRead + cacheWrite;
	const total = normalized?.total ?? promptTokens + output;
	const hasPositiveUsage = [
		input,
		output,
		cacheRead,
		cacheWrite,
		total,
		usage.costUsd
	].some((value) => typeof value === "number" && Number.isFinite(value) && value > 0);
	if (params.suppressUsage !== true && isDiagnosticsEnabled(params.cfg) && hasPositiveUsage) emitTrustedDiagnosticEvent(markHostPluginUsageDiagnosticEvent({
		type: "model.usage",
		...params.result.audit.sessionKey ? { sessionKey: params.result.audit.sessionKey } : {},
		agentId: params.result.agentId,
		provider: params.result.provider,
		model: params.result.model,
		usage: {
			input,
			output,
			cacheRead,
			cacheWrite,
			promptTokens,
			total
		},
		...usage.costUsd !== void 0 ? { costUsd: usage.costUsd } : {}
	}, params.hostPluginId));
	return {
		...params.result,
		usage
	};
}
function buildPolicyFromEntry(entry) {
	return {
		allowAgentIdOverride: entry.allowAgentIdOverride === true,
		allowModelOverride: entry.allowModelOverride === true,
		allowAuthProfileOverride: entry.allowAuthProfileOverride === true,
		overrideModels: compileModelAllowlist({
			configured: entry.hasAllowedModelsConfig === true,
			values: entry.allowedModels,
			formatKey: modelKey
		}),
		completionModels: compileModelAllowlist({
			configured: entry.hasAllowedCompletionModelsConfig === true,
			values: entry.allowedCompletionModels,
			formatKey: modelKey
		})
	};
}
function resolvePluginPolicyId(authority, caller) {
	const authorityPluginId = normalizeOptionalString(authority?.pluginIdForPolicy);
	if (authorityPluginId) return authorityPluginId;
	if (caller.kind !== "plugin") return;
	return normalizeOptionalString(caller.id);
}
function resolvePluginLlmPolicy(cfg, pluginId) {
	if (!pluginId) return;
	const entry = normalizePluginsConfig(cfg.plugins).entries[pluginId]?.llm;
	return entry ? buildPolicyFromEntry(entry) : void 0;
}
function resolveAuthorityModelPolicy(authority) {
	if (authority?.allowAgentIdOverride !== true && authority?.allowModelOverride !== true && authority?.allowAuthProfileOverride !== true && authority?.allowedModels === void 0 && authority?.allowedCompletionModels === void 0) return;
	return buildPolicyFromEntry({
		allowAgentIdOverride: authority.allowAgentIdOverride,
		allowModelOverride: authority.allowModelOverride,
		allowAuthProfileOverride: authority.allowAuthProfileOverride,
		hasAllowedModelsConfig: authority.allowedModels !== void 0,
		allowedModels: authority.allowedModels,
		hasAllowedCompletionModelsConfig: authority.allowedCompletionModels !== void 0,
		allowedCompletionModels: authority.allowedCompletionModels
	});
}
function assertAllowedAuthProfileOverride(params) {
	if (!params.authProfileId) return;
	if (params.authorityPolicy?.allowAuthProfileOverride === true || params.pluginPolicy?.allowAuthProfileOverride === true) return;
	throw createLlmCompleteError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion cannot override the auth profile. Enable plugins.entries.<id>.llm.allowAuthProfileOverride to authorize it.");
}
function assertModelAllowed(params) {
	const allowlist = params.kind === "override" ? params.policy?.overrideModels : params.policy?.completionModels;
	if (!allowlist?.configured || allowlist.allowAny) return;
	const target = params.kind === "override" ? "model override" : "model";
	if (allowlist.models.size === 0) throw createLlmCompleteError("LLM_COMPLETION_NOT_AUTHORIZED", `Plugin LLM completion ${target} allowlist has no valid models.`);
	if (!params.resolvedModelRef) throw createLlmCompleteError("LLM_COMPLETION_NOT_AUTHORIZED", `Plugin LLM completion ${target} allowlist requires a resolvable provider/model target.`);
	if (!allowlist.models.has(params.resolvedModelRef)) {
		const owner = params.policyOwnerPluginId ? ` for plugin "${params.policyOwnerPluginId}"` : "";
		const usage = params.kind === "completion" ? " for completions" : "";
		throw createLlmCompleteError("LLM_COMPLETION_NOT_AUTHORIZED", `Plugin LLM completion ${target} "${params.resolvedModelRef}" is not allowlisted${usage}${owner}.`);
	}
}
function assertAllowedModelOverride(params) {
	if (params.authorityPolicy?.allowModelOverride !== true && params.pluginPolicy?.allowModelOverride !== true) throw createLlmCompleteError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion cannot override the target model.");
	assertModelAllowed({
		kind: "override",
		resolvedModelRef: params.resolvedModelRef,
		policy: params.authorityPolicy
	});
	assertModelAllowed({
		kind: "override",
		resolvedModelRef: params.resolvedModelRef,
		policy: params.pluginPolicy,
		policyOwnerPluginId: params.pluginPolicyId
	});
}
/**
* Create the host-owned generic LLM completion runtime for trusted plugin callers.
*/
function createRuntimeLlm(options = {}) {
	const logger = options.logger ?? toRuntimeLogger(defaultLogger);
	return { complete: async (params) => {
		const caller = resolveTrustedCaller(options.authority);
		if (options.authority?.allowComplete === false) {
			const reason = options.authority.denyReason ?? "capability denied";
			logger.warn("plugin llm completion denied", {
				caller,
				purpose: params.purpose,
				reason
			});
			throw createLlmCompleteError("LLM_COMPLETION_NOT_AUTHORIZED", `Plugin LLM completion denied: ${reason}`);
		}
		assertSupportedExecutionMode(params);
		const [{ acquireSimpleCompletionModelForAgent, completeWithPreparedSimpleCompletionModel, resolveSimpleCompletionSelectionForAgent }, cfg] = await Promise.all([import("./simple-completion-runtime-0hj5YXMA.mjs"), Promise.resolve(resolveRuntimeConfig(options))]);
		const pluginPolicyId = resolvePluginPolicyId(options.authority, caller);
		const pluginPolicy = resolvePluginLlmPolicy(cfg, pluginPolicyId);
		const authorityPolicy = resolveAuthorityModelPolicy(options.authority);
		const preferredProfile = normalizeOptionalString(options.authority?.preferredProfile);
		const audit = {
			caller,
			...params.purpose ? { purpose: params.purpose } : {},
			...options.authority?.sessionKey ? { sessionKey: options.authority.sessionKey } : {}
		};
		const agentId = await resolveAgentId({
			request: params,
			cfg,
			authority: options.authority,
			allowAgentIdOverride: options.authority?.allowAgentIdOverride === false ? false : authorityPolicy?.allowAgentIdOverride === true || pluginPolicy?.allowAgentIdOverride === true
		});
		const requestedModel = normalizeOptionalString(params.model);
		const requestedModelProfile = requestedModel ? normalizeOptionalString(splitTrailingAuthProfile(requestedModel).profile) : void 0;
		const selection = resolveSimpleCompletionSelectionForAgent({
			cfg,
			agentId,
			modelRef: requestedModel
		});
		if (!selection) throw createLlmCompleteError("LLM_COMPLETION_FAILED", `No model configured for agent ${agentId}.`);
		const normalizedSelection = normalizeModelRef(selection.provider, selection.modelId);
		const resolvedModelRef = modelKey(normalizedSelection.provider, normalizedSelection.model);
		assertModelAllowed({
			kind: "completion",
			resolvedModelRef,
			policy: authorityPolicy
		});
		assertModelAllowed({
			kind: "completion",
			resolvedModelRef,
			policy: pluginPolicy,
			policyOwnerPluginId: pluginPolicyId
		});
		if (requestedModel) assertAllowedModelOverride({
			resolvedModelRef,
			pluginPolicyId,
			authorityPolicy,
			pluginPolicy
		});
		const isolatedRequest = isIsolatedAgentRuntimeRequest(params);
		const executionProfile = isolatedRequest ? normalizeOptionalString(params.execution.authProfileId) : void 0;
		const modelProfile = normalizeOptionalString(selection.profileId);
		if (executionProfile && requestedModelProfile && executionProfile !== requestedModelProfile) throw createLlmCompleteError("LLM_ISOLATED_INPUT_REJECTED", "Isolated completion received conflicting auth profiles in model and execution.authProfileId.");
		if (isolatedRequest) {
			assertAllowedAuthProfileOverride({
				authProfileId: executionProfile ?? requestedModelProfile,
				authorityPolicy,
				pluginPolicy
			});
			const result = await runIsolatedAgentRuntimeCompletion({
				request: params,
				cfg,
				agentId,
				provider: selection.provider,
				model: selection.modelId,
				authProfileId: executionProfile ?? requestedModelProfile ?? preferredProfile ?? modelProfile
			});
			return finalizePluginLlmCompletion({
				cfg,
				hostPluginId: pluginPolicyId,
				rawUsage: result.usage,
				logger,
				result: {
					text: result.text,
					provider: result.provider,
					model: result.model,
					agentId,
					execution: {
						mode: params.execution.mode,
						owner: result.owner
					},
					audit
				}
			});
		}
		const callerResult = createDeferredCore();
		captureAsyncWorkTracker()(async () => {
			try {
				var _usingCtx$1 = _usingCtx();
				const preparation = await acquireSimpleCompletionModelForAgent({
					cfg,
					agentId,
					modelRef: params.model,
					preferredProfile,
					...requestedModelProfile ? { bindAuthOwner: true } : {},
					allowBundledStaticCatalogFallback: true,
					allowMissingApiKeyModes: ["aws-sdk"],
					skipAgentDiscovery: true,
					signal: params.signal
				});
				if ("error" in preparation) throw new Error(`Plugin LLM completion failed: ${preparation.error}`);
				const prepared = _usingCtx$1.a(preparation);
				const work = new AsyncWorkScope();
				try {
					callerResult.resolve(await work.track(async () => {
						if (params.requiredAuthMode && prepared.auth.mode !== params.requiredAuthMode) throw createLlmCompleteError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion selected a credential with the wrong authentication mode.");
						if (requestedModelProfile && prepared.auth.profileId !== requestedModelProfile) throw createLlmCompleteError("LLM_COMPLETION_NOT_AUTHORIZED", "Plugin LLM completion selected a different authentication profile.");
						const context = {
							systemPrompt: buildSystemPrompt(params),
							messages: buildMessages({
								request: params,
								provider: prepared.model.provider,
								model: prepared.model.id,
								api: prepared.model.api
							})
						};
						const result = await completeWithPreparedSimpleCompletionModel({
							model: prepared.model,
							auth: prepared.auth,
							cfg,
							context,
							options: {
								maxTokens: asFiniteNumber(params.maxTokens),
								temperature: asFiniteNumber(params.temperature),
								...params.responseFormat !== void 0 ? { responseFormat: params.responseFormat } : {},
								...params.reasoning !== void 0 ? { reasoning: params.reasoning } : {},
								signal: params.signal
							}
						});
						const text = result.content.filter((c) => c.type === "text").map((c) => c.text).join("");
						return finalizePluginLlmCompletion({
							cfg,
							hostPluginId: pluginPolicyId,
							suppressUsage: !text.trim() || ![
								"stop",
								"length",
								"toolUse"
							].includes(result.stopReason),
							rawUsage: result.usage,
							logger,
							result: {
								text,
								provider: prepared.selection.provider,
								model: prepared.selection.modelId,
								responseModel: result.responseModel,
								stopReason: result.stopReason,
								agentId,
								execution: {
									mode: "direct-provider",
									owner: {
										kind: "provider",
										id: prepared.selection.provider
									}
								},
								audit
							}
						});
					}));
				} catch (error) {
					callerResult.reject(error);
				} finally {
					await work.drain();
				}
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				await _usingCtx$1.d();
			}
		}).catch((error) => callerResult.reject(error));
		return await callerResult.promise;
	} };
}
//#endregion
export { createRuntimeLlm, finalizePluginLlmCompletion };
