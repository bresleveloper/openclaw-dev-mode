import { C as resolveClaudeOpus5ModelIdentity, D as supportsClaudeAdaptiveThinking, M as supportsClaudeServerCompaction, N as usesClaude5RequestContract, S as resolveClaudeOpus55ModelIdentity, _ as resolveClaudeFable5ModelIdentity, d as bindsClaudeThinkingPrefix, j as supportsClaudeNativeXhighEffort, k as supportsClaudeInHistorySystemMessages, m as requiresClaudeBetweenToolsThinking, v as resolveClaudeHaiku55ModelIdentity, w as resolveClaudeSonnet55ModelIdentity, y as resolveClaudeModelIdentity } from "./src-Ii137Gdc.mjs";
import { p as hasRuntimeContextMarker } from "./types-DIBUKaTM.mjs";
import { a as asRecord, c as readStringField, o as isRecord, r as asOptionalObjectRecord } from "./record-coerce-BgUo6bj4.mjs";
import { r as appendAssistantThinking } from "./event-stream-Bf6cK7-d.mjs";
import { a as normalizeOptionalLowercaseString, i as normalizeNullableString } from "./string-coerce-CpcyRbc6.mjs";
import { n as asNonNegativeFiniteNumber } from "./number-coercion-BO6bhGm6.mjs";
import { C as raiseClaudeCodeVersionFloor, D as resolveAnthropicThinkingEffort, L as isImageWithMediaPayload, M as calculateCost, O as usesClaudeFable5MessagesContract, T as requiresClaudeAdaptiveThinking, b as mapAnthropicStopReason, g as applyClaudeRequestContract, h as ANTHROPIC_CLAUDE_CODE_VERSION, k as usesClaudeStreamingRefusalContract, r as getAiTransportHost, u as STREAM_ERROR_FALLBACK_TEXT, v as defaultsClaudeAdaptiveThinking, w as readRequiredClaudeCodeVersion, y as isUnsupportedClaudeFastModeError } from "./host-Dm4e6L6R.mjs";
import "./transport-utils-J6TkTVN5.mjs";
import { n as estimateBase64DecodedBytes } from "./base64-FdymvxN9.mjs";
import { a as resolveProviderRequestCapabilities, i as resolveProviderEndpoint } from "./host-policy-fDXTduGF.mjs";
import { n as resolveCacheRetention } from "./github-copilot-headers-CqLRrd-i.mjs";
import { t as sanitizeSurrogates } from "./sanitize-unicode-B3kUqQ-q.mjs";
import { C as splitSystemPromptRelocatableBoundary, S as splitSystemPromptCacheBoundaryForWire, T as stripSystemPromptRelocatableBoundary, a as describeToolResultMediaPlaceholder, c as extractToolResultText, f as preparedRequestSuffix, h as SYSTEM_PROMPT_RELOCATABLE_BOUNDARY, s as extractToolResultBlockText, t as adjustMaxTokensForThinking, w as stripSystemPromptCacheBoundary } from "./simple-options-Bet1Zroc.mjs";
import { A as parseStreamingJson, O as createToolArgumentPreviewSchedule, S as transportAbortError, T as parseJsonObjectPreservingUnsafeIntegers, a as copyProviderAcceptanceObserver, b as sanitizeTransportPayloadText, d as finalizeTransportStream, f as iterateModelStream, g as notifyProviderHttpResponse, i as coerceTransportToolCallArguments, l as failTransportStream, r as awaitProviderLifecycleCallback, u as finalizeTerminalToolCallArguments } from "./transport-stream-shared-DPUASGj0.mjs";
import { t as parsePositiveInteger } from "./positive-integer-AM4ltyhP.mjs";
import { a as reconcileAnthropicToolChoice, i as projectAnthropicTools, n as normalizeAnthropicToolChoice, o as resolveOriginalAnthropicToolName, s as toClaudeCodeToolName, t as normalizeAnthropicToolCallId } from "./anthropic-tool-projection-DAvhQKT_.mjs";
import { t as createDeferredEventBuffer } from "./deferred-event-buffer-BgT1IIfq.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-v1liRqNt.mjs";
import { i as resolveNewestCompactionReplaySource } from "./provider-compaction-checkpoint-CaQC18C8.mjs";
import { n as isProviderReplayContext, r as providerReplayContextMatches, t as buildProviderReplayContext } from "./provider-replay-context-BSKkFyU5.mjs";
import { t as transformProviderMessages } from "./provider-transcript-transform-Ca0a3iL1.mjs";
import { markEncodedModelRequestBody } from "./internal/model-request-body.mjs";
import { t as createAssistantOutput } from "./assistant-output-DPK9pdyx.mjs";
import { isProxy } from "node:util/types";
// packages/ai/src/providers/anthropic-auth-headers.ts
/** Inspect resolved credential shape for auth routing without exposing its value. */
function isAnthropicOAuthApiKey(apiKey) {
	return typeof apiKey === "string" && getAiTransportHost().resolveSecretSentinel(apiKey).includes("sk-ant-oat");
}
function usesFoundryBearerAuth(model) {
	return model.provider === "microsoft-foundry" && (model.authHeader === true || Object.entries(model.headers ?? {}).some(([key, value]) => key.toLowerCase() === "authorization" && value !== null && /^bearer\s+\S+/i.test(value.trim())));
}
function omitFoundryBearerCredentialHeaders(headers) {
	if (!headers) return;
	const next = {};
	for (const [key, value] of Object.entries(headers)) {
		const lower = key.toLowerCase();
		if (lower === "authorization" || lower === "x-api-key" || lower === "api-key") continue;
		next[key] = value;
	}
	return Object.keys(next).length > 0 ? next : void 0;
}
// packages/ai/src/providers/anthropic-server-fallback.ts
/** Anthropic beta that re-serves safety refusals on an allowed fallback model. */
const ANTHROPIC_SERVER_SIDE_FALLBACK_BETA = "server-side-fallback-2026-07-01";
/** Let Anthropic select the recommended model for each refusal category. */
const ANTHROPIC_SERVER_SIDE_FALLBACKS = "default";
const CLAUDE_OPUS_FALLBACK_MODEL_COST = {
	input: 5,
	output: 25,
	cacheRead: .5,
	cacheWrite: 6.25
};
const CLAUDE_OPUS_55_FALLBACK_MODEL_COST = {
	input: 4,
	output: 20,
	cacheRead: .2,
	cacheWrite: 5
};
function resolveFallbackModelIdentity(modelId) {
	if (!modelId?.trim()) return null;
	const ref = { id: modelId };
	const normalized = resolveClaudeModelIdentity(ref);
	if (resolveClaudeOpus55ModelIdentity(ref)) return "claude-opus-5-5";
	if (normalized === "opus" || normalized === "opus-5" || resolveClaudeOpus5ModelIdentity(ref)) return "claude-opus-5";
	if (resolveClaudeFable5ModelIdentity(ref)) return "claude-fable-5";
	if (/^claude-opus-4-8(?=$|[^a-z0-9])/.test(normalized)) return "claude-opus-4-8";
	return normalized || null;
}
function resolveClaudeOpusFallbackCost(modelId) {
	if (modelId === "claude-opus-5-5") return CLAUDE_OPUS_55_FALLBACK_MODEL_COST;
	return modelId === "claude-opus-5" || modelId === "claude-opus-4-8" ? CLAUDE_OPUS_FALLBACK_MODEL_COST : void 0;
}
/** Resolve billed rates from the serving model reported by Anthropic's fallback stream. */
function resolveAnthropicFallbackServingModelCost(params) {
	const requestedModelId = resolveFallbackModelIdentity(params.requestedModelId);
	const servingModelId = resolveFallbackModelIdentity(params.servingModelId);
	const servingCost = resolveClaudeOpusFallbackCost(servingModelId);
	if (!servingCost || servingModelId === requestedModelId) return params.requestedCost;
	const requestedCost = resolveClaudeOpusFallbackCost(requestedModelId);
	if (requestedCost === servingCost) return params.requestedCost;
	if (!requestedCost) return servingCost;
	return {
		input: params.requestedCost.input / requestedCost.input * servingCost.input,
		output: params.requestedCost.output / requestedCost.output * servingCost.output,
		cacheRead: params.requestedCost.cacheRead / requestedCost.cacheRead * servingCost.cacheRead,
		cacheWrite: params.requestedCost.cacheWrite / requestedCost.cacheWrite * servingCost.cacheWrite
	};
}
function readBoundaryModel(value) {
	if (!value || typeof value !== "object") return null;
	const model = value.model;
	return typeof model === "string" && model.trim() ? model : null;
}
/** Reads a `fallback` content block marking where one model's output gives way to the next. */
function readAnthropicFallbackBoundary(block) {
	if (!block || typeof block !== "object") return null;
	const record = block;
	if (record.type !== "fallback") return null;
	return {
		fromModel: readBoundaryModel(record.from),
		toModel: readBoundaryModel(record.to)
	};
}
/**
* Drops pre-fallback thinking/tool calls while preserving the text prefix that
* the serving model continued. Dropped tool calls must never execute or replay.
*/
function applyAnthropicFallbackBoundary(params) {
	const { output, boundary } = params;
	const survivors = output.content.filter((block) => block.type === "text");
	for (const survivor of survivors) delete survivor.textSignature;
	output.content.splice(0, output.content.length, ...survivors);
	if (boundary.toModel) output.responseModel = boundary.toModel;
	output.diagnostics = [...output.diagnostics ?? [], {
		type: "provider_fallback",
		timestamp: Date.now(),
		details: {
			provider: params.provider,
			fromModel: boundary.fromModel,
			toModel: boundary.toModel
		}
	}];
}
// packages/ai/src/transports/anthropic-payload-policy.ts
const ANTHROPIC_CACHE_CONTROL_LIMIT = 4;
const ANTHROPIC_COMPACT_THRESHOLD_MIN = 5e4;
const ANTHROPIC_COMPACTION_INSTRUCTIONS = "Summarize the transcript inside <summary></summary> tags. Include the current state, decisions, and next steps needed to continue the task in the next context window. Do not call any tools while writing this summary; respond with text only.";
/** Resolve the Anthropic input-token trigger, including the API's minimum. */
function resolveAnthropicCompactThreshold(model, configured) {
	const configuredThreshold = parsePositiveInteger(configured);
	if (configuredThreshold !== void 0) return Math.max(ANTHROPIC_COMPACT_THRESHOLD_MIN, configuredThreshold);
	const contextTokens = parsePositiveInteger(model.contextTokens);
	const contextWindow = parsePositiveInteger(model.contextWindow);
	return Math.max(ANTHROPIC_COMPACT_THRESHOLD_MIN, Math.floor((contextTokens && contextWindow ? Math.min(contextTokens, contextWindow) : contextTokens ?? contextWindow ?? 0) * .7));
}
/** Resolve the server-compaction gate and effective threshold for an Anthropic route. */
function resolveAnthropicServerCompactionPlan(model, extraParams, apiKey) {
	const configured = extraParams?.anthropicServerCompaction;
	const enabled = configured !== false && (configured === true || supportsClaudeServerCompaction(model)) && !isAnthropicOAuthApiKey(apiKey) && normalizeOptionalLowercaseString(model.api) === "anthropic-messages" && isDirectAnthropicModel(model);
	return {
		enabled,
		...enabled ? { threshold: resolveAnthropicCompactThreshold(model, extraParams?.anthropicCompactThreshold) } : {}
	};
}
function isDirectAnthropicModel(model, env = process.env) {
	const baseUrl = model.baseUrl?.trim() || env.ANTHROPIC_BASE_URL?.trim();
	const endpointModel = baseUrl === model.baseUrl ? model : {
		...model,
		baseUrl
	};
	const endpointClass = resolveProviderEndpoint(endpointModel).endpointClass;
	return normalizeOptionalLowercaseString(model.provider) === "anthropic" && (endpointClass === "anthropic-public" || endpointClass === "default" && (!baseUrl || URL.parse(baseUrl)?.hostname === "api.anthropic.com"));
}
function supportsAnthropicServerSideFallback(model) {
	return (usesClaudeFable5MessagesContract(model) || resolveClaudeOpus5ModelIdentity(model) !== void 0 || resolveClaudeSonnet55ModelIdentity(model) !== void 0) && isDirectAnthropicModel(model);
}
function isAnthropicServerToolClearingEnabled(model, apiKey) {
	const resolvedApiKey = apiKey && getAiTransportHost().resolveSecretSentinel(apiKey);
	return Boolean(resolvedApiKey?.trim()) && !isAnthropicOAuthApiKey(resolvedApiKey) && normalizeOptionalLowercaseString(model.api) === "anthropic-messages" && isDirectAnthropicModel(model);
}
function isLongTtlEligibleEndpoint(baseUrl) {
	if (typeof baseUrl !== "string") return false;
	const hostname = URL.parse(baseUrl)?.hostname;
	if (!hostname) return false;
	return hostname === "api.anthropic.com" || hostname === "aiplatform.googleapis.com" || hostname === "aiplatform.us.rep.googleapis.com" || hostname === "aiplatform.eu.rep.googleapis.com" || hostname.endsWith("-aiplatform.googleapis.com");
}
/** Resolve Anthropic cache-control marker retention for a request endpoint. */
function resolveAnthropicEphemeralCacheControl(baseUrl, cacheRetention) {
	const retention = resolveCacheRetention(cacheRetention);
	if (retention === "none") return;
	const ttl = retention === "long" && (cacheRetention === "long" || isLongTtlEligibleEndpoint(baseUrl)) ? "1h" : void 0;
	return {
		type: "ephemeral",
		...ttl ? { ttl } : {}
	};
}
function resolveAnthropicCacheOptions(model, cacheRetention) {
	const supportsLongCacheRetention = model.compat?.supportsLongCacheRetention ?? model.provider !== "fireworks";
	const cacheControl = resolveAnthropicEphemeralCacheControl(model.baseUrl?.trim() || process.env.ANTHROPIC_BASE_URL?.trim() || "https://api.anthropic.com", cacheRetention);
	return {
		cacheControl: cacheControl && !supportsLongCacheRetention ? { type: "ephemeral" } : cacheControl,
		supportsCacheControlOnTools: model.compat?.supportsCacheControlOnTools ?? model.provider !== "fireworks"
	};
}
const normalizedSystemBlocks = /* @__PURE__ */ new WeakMap();
const sessionSharedSystemBlocks = /* @__PURE__ */ new WeakSet();
function buildAnthropicSystemBlocks(systemPrompt, isOAuthToken, cacheControl, claudeCodeVersion = ANTHROPIC_CLAUDE_CODE_VERSION, preparedSystemPrompt) {
	const revision = preparedSystemPrompt?.text === systemPrompt ? preparedSystemPrompt : void 0;
	const policy = cacheControl ? cacheControl.ttl ?? "default" : "none";
	let variants = revision && normalizedSystemBlocks.get(revision);
	let blocks = variants?.get(policy);
	if (!blocks) {
		blocks = systemPrompt ? [{
			type: "text",
			text: sanitizeSurrogates(systemPrompt)
		}] : [];
		normalizeAnthropicSystemBlocks(blocks, revision && cacheControl ? { ...cacheControl } : cacheControl);
		if (systemPrompt && blocks.length === 0) blocks.push({
			type: "text",
			text: ""
		});
		if (revision) {
			variants ??= /* @__PURE__ */ new Map();
			variants.set(policy, blocks);
			normalizedSystemBlocks.set(revision, variants);
		}
	}
	if (revision) blocks = blocks.map((block) => {
		const editable = {
			...block,
			...block.cache_control ? { cache_control: { ...block.cache_control } } : {}
		};
		if (sessionSharedSystemBlocks.has(block)) sessionSharedSystemBlocks.add(editable);
		return editable;
	});
	if (isOAuthToken) {
		const identityCacheControl = blocks.some((block) => block.cache_control) ? void 0 : cacheControl;
		blocks.unshift({
			type: "text",
			text: `x-anthropic-billing-header: cc_version=${claudeCodeVersion}; cc_entrypoint=sdk-cli;`
		}, {
			type: "text",
			text: "You are Claude Code, Anthropic's official CLI for Claude.",
			...identityCacheControl ? { cache_control: identityCacheControl } : {}
		});
	}
	return blocks.length > 0 ? blocks : void 0;
}
/** Allocate tool and history checkpoints around the prepared stable system blocks. */
function applyAnthropicRequestCacheControl(payload, cacheControl, supportsCacheControlOnTools, cacheBreakpointOptOutMessageIndexes = /* @__PURE__ */ new Set()) {
	if (!cacheControl) return;
	if (supportsCacheControlOnTools && Array.isArray(payload.tools)) {
		const lastTool = payload.tools.at(-1);
		if (isRecord(lastTool)) lastTool.cache_control = cacheControl;
	}
	const messages = payload.messages;
	let usedMarkers = countAnthropicCacheControlMarkers(payload.system) + countAnthropicCacheControlMarkers(payload.tools);
	if (Array.isArray(messages) && !messages.some((message) => isRecord(message) && message.role === "assistant") && Array.isArray(payload.system)) {
		for (const block of payload.system) if (usedMarkers < 3 && isRecord(block) && sessionSharedSystemBlocks.has(block) && block.cache_control === void 0) {
			block.cache_control = cacheControl;
			usedMarkers++;
		}
	}
	const markerLimit = ANTHROPIC_CACHE_CONTROL_LIMIT - usedMarkers;
	if (!Array.isArray(messages) || messages.length === 0 || markerLimit <= 0) return;
	let stableEnd = messages.length;
	for (const index of cacheBreakpointOptOutMessageIndexes) stableEnd = Math.min(stableEnd, index);
	let marked = 0;
	for (let i = stableEnd - 1; i >= 0 && marked < Math.min(markerLimit, 2); i--) {
		const record = messages[i];
		if (!isRecord(record) || record.role !== "user") continue;
		const content = record.content;
		const blocks = typeof content === "string" ? [{
			type: "text",
			text: content
		}] : content;
		if (!Array.isArray(blocks)) continue;
		for (let j = blocks.length - 1; j >= 0; j--) {
			const blockRecord = blocks[j];
			if (!isRecord(blockRecord)) continue;
			if (blockRecord.type === "text" || blockRecord.type === "image" || blockRecord.type === "tool_result") {
				if (Object.isFrozen(record) || Object.isFrozen(blocks) || Object.isFrozen(blockRecord)) {
					const markedBlocks = blocks.slice();
					markedBlocks[j] = {
						...blockRecord,
						cache_control: cacheControl
					};
					messages[i] = {
						...record,
						content: markedBlocks
					};
				} else {
					blockRecord.cache_control = cacheControl;
					if (typeof content === "string") record.content = blocks;
				}
				marked++;
				break;
			}
		}
	}
}
function normalizeAnthropicSystemBlocks(system, cacheControl) {
	if (!Array.isArray(system)) return;
	const normalizedBlocks = [];
	for (const block of system) {
		if (!block || typeof block !== "object") {
			normalizedBlocks.push(block);
			continue;
		}
		const record = block;
		const blockText = record.text;
		if (record.type !== "text" || typeof blockText !== "string") {
			normalizedBlocks.push(block);
			continue;
		}
		if (!cacheControl) {
			record.text = stripSystemPromptCacheBoundary(blockText);
			continue;
		}
		record.text = stripSystemPromptRelocatableBoundary(blockText);
		const split = splitSystemPromptCacheBoundaryForWire(blockText);
		if (!split) {
			if (record.cache_control === void 0 && !sessionSharedSystemBlocks.has(record)) record.cache_control = cacheControl;
			normalizedBlocks.push(record);
			continue;
		}
		const { cache_control: existingCacheControl, ...rest } = record;
		const stablePrefix = stripSystemPromptRelocatableBoundary(split.stablePrefix);
		if (stablePrefix) normalizedBlocks.push({
			...rest,
			text: stablePrefix,
			cache_control: existingCacheControl ?? cacheControl
		});
		const runtimeFactsStart = splitSystemPromptRelocatableBoundary(split.dynamicSuffix) ? split.dynamicSuffix.indexOf(SYSTEM_PROMPT_RELOCATABLE_BOUNDARY) : -1;
		const sessionShared = runtimeFactsStart > 0 ? split.dynamicSuffix.slice(0, runtimeFactsStart) : "";
		const sessionOwned = stripSystemPromptRelocatableBoundary(sessionShared.trim() ? split.dynamicSuffix.slice(runtimeFactsStart) : split.dynamicSuffix);
		const dynamicSuffix = stripSystemPromptRelocatableBoundary(split.dynamicSuffix);
		if (sessionShared.trim() && sessionOwned) {
			const sharedBlock = {
				...rest,
				text: sessionShared
			};
			sessionSharedSystemBlocks.add(sharedBlock);
			normalizedBlocks.push(sharedBlock, {
				...rest,
				text: sessionOwned
			});
		} else if (dynamicSuffix) normalizedBlocks.push({
			...rest,
			text: dynamicSuffix
		});
	}
	if (cacheControl) system.splice(0, system.length, ...normalizedBlocks);
}
function countAnthropicCacheControlMarkers(blocks) {
	if (!Array.isArray(blocks)) return 0;
	let count = 0;
	for (const block of blocks) if (block && typeof block === "object" && "cache_control" in block) count += 1;
	return count;
}
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
function resolveAnthropicPayloadPolicy(input, model) {
	const capabilities = resolveProviderRequestCapabilities({
		provider: input.provider,
		api: input.api,
		baseUrl: input.baseUrl,
		capability: "llm",
		transport: "stream"
	}, model);
	const serverCompactionPlan = resolveAnthropicServerCompactionPlan(input, input.extraParams);
	return {
		allowsServiceTier: capabilities.allowsAnthropicServiceTier,
		cacheControl: input.enableCacheControl === true ? resolveAnthropicEphemeralCacheControl(input.baseUrl, input.cacheRetention) : void 0,
		compactThreshold: serverCompactionPlan.threshold ?? resolveAnthropicCompactThreshold(input, input.extraParams?.anthropicCompactThreshold),
		serviceTier: input.serviceTier,
		useServerCompaction: input.enableServerCompaction === true && serverCompactionPlan.enabled,
		...input.cacheTtlPruning && normalizeOptionalLowercaseString(input.api) === "anthropic-messages" && isDirectAnthropicModel(input) ? { toolClearing: {
			trigger: Math.max(5e4, Math.floor((parsePositiveInteger(input.contextWindow) ?? 0) * .3)),
			clearAtLeast: Math.max(12500, Math.floor((parsePositiveInteger(input.contextWindow) ?? 0) * .05)),
			tools: input.cacheTtlPruning.tools
		} } : {}
	};
}
function resolveToolClearingExclusions(payload, filter) {
	const compile = (patterns) => (patterns ?? []).map((pattern) => pattern.trim().toLowerCase()).filter(Boolean).map((pattern) => new RegExp(`^${pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replaceAll("\\*", ".*")}$`));
	const allow = compile(filter?.allow);
	const deny = compile(filter?.deny);
	if (allow.length === 0 && deny.length === 0) return [];
	const excluded = new Set(filter?.deny?.map((name) => name.trim()).filter((name) => name && !name.includes("*")));
	const candidates = /* @__PURE__ */ new Set();
	for (const tool of Array.isArray(payload.tools) ? payload.tools : []) if (isRecord(tool) && typeof tool.name === "string") candidates.add(tool.name);
	for (const message of Array.isArray(payload.messages) ? payload.messages : []) {
		if (!isRecord(message) || !Array.isArray(message.content)) continue;
		for (const block of message.content) if (isRecord(block) && block.type === "tool_use" && typeof block.name === "string") candidates.add(block.name);
	}
	for (const toolName of candidates) {
		const name = toolName.trim().toLowerCase();
		if (deny.some((pattern) => pattern.test(name)) || allow.length > 0 && !allow.some((pattern) => pattern.test(name))) excluded.add(toolName);
	}
	return [...excluded].toSorted();
}
function applyAnthropicContextManagementEdits(payload, policy) {
	if (payload.context_management !== void 0) return;
	const edits = [];
	if (policy.toolClearing) edits.push({
		type: "clear_tool_uses_20250919",
		trigger: {
			type: "input_tokens",
			value: policy.toolClearing.trigger
		},
		keep: {
			type: "tool_uses",
			value: 3
		},
		clear_at_least: {
			type: "input_tokens",
			value: policy.toolClearing.clearAtLeast
		},
		exclude_tools: resolveToolClearingExclusions(payload, policy.toolClearing.tools),
		clear_tool_inputs: false
	});
	if (policy.useServerCompaction) edits.push({
		type: "compact_20260112",
		trigger: {
			type: "input_tokens",
			value: policy.compactThreshold
		},
		instructions: ANTHROPIC_COMPACTION_INSTRUCTIONS
	});
	if (edits.length > 0) payload.context_management = { edits };
}
function applyAnthropicContextManagementToRequest(payload, model, options, directApiKeyBetaHeader) {
	if (directApiKeyBetaHeader === void 0 || !options?.cacheTtlPruning && !options?.anthropicServerCompaction) return;
	applyAnthropicContextManagementEdits(payload, resolveAnthropicPayloadPolicy({
		...model,
		api: "anthropic-messages",
		enableServerCompaction: options?.anthropicServerCompaction === true,
		extraParams: { ...options },
		cacheTtlPruning: options?.cacheTtlPruning
	}));
}
function resolveAnthropicRequestBetaHeader(payload, directApiKeyBetaHeader) {
	if (directApiKeyBetaHeader === void 0) return directApiKeyBetaHeader;
	const edits = isRecord(payload.context_management) ? payload.context_management.edits : void 0;
	const betas = new Set(directApiKeyBetaHeader.split(",").map((beta) => beta.trim()).filter(Boolean));
	if (payload.fallbacks === "default") betas.add(ANTHROPIC_SERVER_SIDE_FALLBACK_BETA);
	if (Array.isArray(payload.messages) && payload.messages.some((message) => isRecord(message) && message.role === "system" && message.clear_at === "next_user_message")) betas.add("mid-conversation-system-clear-at-2026-08-21");
	for (const edit of Array.isArray(edits) ? edits : []) {
		if (!isRecord(edit)) continue;
		if (edit.type === "clear_tool_uses_20250919") betas.add("context-management-2025-06-27");
		else if (edit.type === "compact_20260112") betas.add("compact-2026-01-12");
	}
	return [...betas].join(",");
}
function logAnthropicContextEdits(event) {
	if (!isRecord(event) || !isRecord(event.context_management)) return;
	const edits = event.context_management.applied_edits;
	let clearedTools = 0;
	let clearedTokens = 0;
	for (const edit of Array.isArray(edits) ? edits : []) {
		if (!isRecord(edit) || edit.type !== "clear_tool_uses_20250919" || typeof edit.cleared_tool_uses !== "number" || !Number.isSafeInteger(edit.cleared_tool_uses) || edit.cleared_tool_uses < 0 || typeof edit.cleared_input_tokens !== "number" || !Number.isSafeInteger(edit.cleared_input_tokens) || edit.cleared_input_tokens < 0) continue;
		clearedTools = Math.min(Number.MAX_SAFE_INTEGER, clearedTools + edit.cleared_tool_uses);
		clearedTokens = Math.min(Number.MAX_SAFE_INTEGER, clearedTokens + edit.cleared_input_tokens);
	}
	if (clearedTools > 0 || clearedTokens > 0) getAiTransportHost().logInfo("anthropic", `server-side context edit: cleared ${clearedTools} tool results (${clearedTokens} input tokens)`);
}
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
function applyAnthropicPayloadPolicyToParams(payloadObj, policy, cacheBreakpointOptOutMessageIndexes) {
	if (policy.allowsServiceTier && policy.serviceTier !== void 0 && payloadObj.service_tier === void 0) payloadObj.service_tier = policy.serviceTier;
	normalizeAnthropicSystemBlocks(payloadObj.system, policy.cacheControl);
	applyAnthropicContextManagementEdits(payloadObj, policy);
	applyAnthropicRequestCacheControl(payloadObj, policy.cacheControl, false, cacheBreakpointOptOutMessageIndexes);
}
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
function applyAnthropicEphemeralCacheControlMarkers(payloadObj, cacheControl = { type: "ephemeral" }) {
	const messages = payloadObj.messages;
	if (!Array.isArray(messages)) return;
	for (const message of messages) {
		if (message.role === "system" || message.role === "developer") {
			if (!cacheControl) continue;
			if (typeof message.content === "string") {
				message.content = [{
					type: "text",
					text: message.content,
					cache_control: cacheControl
				}];
				continue;
			}
			if (Array.isArray(message.content) && message.content.length > 0) {
				const last = message.content[message.content.length - 1];
				if (last && typeof last === "object") {
					const record = last;
					if (record.type !== "thinking" && record.type !== "redacted_thinking") record.cache_control = cacheControl;
				}
			}
			continue;
		}
		if (message.role === "assistant" && Array.isArray(message.content)) for (const block of message.content) {
			if (!block || typeof block !== "object") continue;
			const record = block;
			if (record.type === "thinking" || record.type === "redacted_thinking") delete record.cache_control;
		}
	}
}
// packages/ai/src/providers/anthropic-refusal.ts
function applyAnthropicRefusal(output, stopDetails, provider) {
	const record = asOptionalObjectRecord(stopDetails);
	const details = {
		category: normalizeNullableString(record?.category),
		explanation: normalizeNullableString(record?.explanation)
	};
	const category = details.category ? ` (category: ${details.category})` : "";
	const explanation = details.explanation ? `: ${details.explanation}` : ".";
	output.stopReason = "error";
	output.errorMessage = `Anthropic refusal${category}${explanation}`;
	output.diagnostics = [...output.diagnostics ?? [], {
		type: "provider_refusal",
		timestamp: Date.now(),
		details: {
			provider,
			category: details.category,
			explanation: details.explanation
		}
	}];
}
// packages/ai/src/providers/anthropic-thinking-replay.ts
const ANTHROPIC_OMITTED_REASONING_TEXT = "[assistant reasoning omitted]";
function applyAnthropicThinkingBindingControls(params, directApiKeyBetaHeader) {
	if (directApiKeyBetaHeader === void 0 || !isRecord(params.thinking) || params.thinking.type !== "adaptive") return;
	params.thinking.block_binding = { prefix_mismatch_behavior: "drop_block" };
	const betas = directApiKeyBetaHeader.split(",").map((beta) => beta.trim()).filter(Boolean);
	return { "anthropic-beta": [.../* @__PURE__ */ new Set([...betas, "thinking-binding-controls-2026-08-01"])].join(",") };
}
function readAnthropicInputTransformations(event) {
	if (!isRecord(event) || event.type !== "message_start" && event.type !== "message_delta") return;
	const transformations = (isRecord(event.message) ? event.message : void 0)?.input_transformations ?? event.input_transformations;
	return Array.isArray(transformations) ? transformations : void 0;
}
function logAnthropicThinkingDrops(transformations) {
	const drops = transformations?.filter((entry) => isRecord(entry) && entry.type === "thinking_dropped" && typeof entry.reason === "string" && /^(?:prefix|model|organization|end_user)_binding_mismatch$/.test(entry.reason) && typeof entry.path === "string" && /^messages\.\d{1,10}\.content\.\d{1,10}$/.test(entry.path));
	if (!drops?.length) return;
	const paths = drops.slice(0, 5).map(({ reason, path }) => `${reason} at ${path}`);
	getAiTransportHost().logWarn("anthropic", `replayed thinking dropped: ${drops.length} block(s) (${paths.join(", ")}${drops.length > 5 ? ", …" : ""})`);
}
/**
* Anthropic tool results continue the preceding assistant turn. Preserve that
* turn's signed thinking even when the next request disables new thinking.
*/
function findActiveAnthropicToolTurnAssistantIndex(messages) {
	const toolResultIds = /* @__PURE__ */ new Set();
	let index = messages.length - 1;
	while (index >= 0) {
		const message = asOptionalObjectRecord(messages[index]);
		if (message?.role === "user" && isRecord(message.operatorMessage)) {
			index -= 1;
			continue;
		}
		if (message?.role !== "toolResult") break;
		if (typeof message.toolCallId === "string") toolResultIds.add(message.toolCallId);
		index -= 1;
	}
	if (toolResultIds.size === 0) return -1;
	const assistant = asOptionalObjectRecord(messages[index]);
	if (assistant?.role !== "assistant" || !Array.isArray(assistant.content)) return -1;
	const toolCallIds = /* @__PURE__ */ new Set();
	for (const block of assistant.content) {
		const record = asOptionalObjectRecord(block);
		if (!record) continue;
		if ((record.type === "toolCall" || record.type === "tool_use" || record.type === "function_call") && typeof record.id === "string") toolCallIds.add(record.id);
	}
	return [...toolResultIds].every((toolCallId) => toolCallIds.has(toolCallId)) ? index : -1;
}
// packages/ai/src/providers/anthropic-usage.ts
const BILLED_USAGE_KEYS = [
	"input",
	"output",
	"cacheRead",
	"cacheWrite",
	"cacheWrite1h",
	"cacheWrite5m"
];
function readAnthropicBilledUsage(usage, missingCacheTokens) {
	return {
		input: readAnthropicUsageTokenCount(usage.input_tokens),
		output: readAnthropicUsageTokenCount(usage.output_tokens),
		cacheRead: readAnthropicUsageTokenCount(usage.cache_read_input_tokens ?? missingCacheTokens),
		cacheWrite: readAnthropicUsageTokenCount(usage.cache_creation_input_tokens ?? missingCacheTokens),
		...readAnthropicCacheWriteUsage(usage)
	};
}
function applyAnthropicBilledUsage(target, resolved) {
	for (const key of BILLED_USAGE_KEYS) {
		const value = resolved[key];
		if (value !== void 0) target[key] = value;
	}
	target.totalTokens = target.input + target.output + target.cacheRead + target.cacheWrite;
}
function readAnthropicIterationUsage(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const { input, output, cacheRead, cacheWrite, cacheWrite1h, cacheWrite5m } = readAnthropicBilledUsage(value);
	if (input === void 0 || output === void 0 || cacheRead === void 0 || cacheWrite === void 0) return;
	return {
		input,
		output,
		cacheRead,
		cacheWrite,
		cacheWrite1h,
		cacheWrite5m
	};
}
function readAnthropicUsageTokenCount(value) {
	return asNonNegativeFiniteNumber(value);
}
function readAnthropicCacheWriteUsage(usage) {
	if (!usage.cache_creation || typeof usage.cache_creation !== "object") return {};
	const cacheCreation = usage.cache_creation;
	const cacheWrite5m = readAnthropicUsageTokenCount(cacheCreation.ephemeral_5m_input_tokens);
	const cacheWrite1h = readAnthropicUsageTokenCount(cacheCreation.ephemeral_1h_input_tokens);
	return {
		...cacheWrite5m !== void 0 ? { cacheWrite5m } : {},
		...cacheWrite1h !== void 0 ? { cacheWrite1h } : {}
	};
}
function readAnthropicPromptUsageSnapshot(usage) {
	const input = readAnthropicUsageTokenCount(usage.input_tokens);
	const cacheRead = usage.cache_read_input_tokens == null ? 0 : readAnthropicUsageTokenCount(usage.cache_read_input_tokens);
	const cacheWrite = usage.cache_creation_input_tokens == null ? 0 : readAnthropicUsageTokenCount(usage.cache_creation_input_tokens);
	if (input === void 0 || cacheRead === void 0 || cacheWrite === void 0) return;
	return {
		input,
		cacheRead,
		cacheWrite
	};
}
function readLastAnthropicIterationUsage(usage) {
	if (usage.iterations == null) return { state: "absent" };
	if (!Array.isArray(usage.iterations) || usage.iterations.length === 0) return { state: "invalid" };
	const iteration = readAnthropicIterationUsage(usage.iterations.at(-1));
	if (!iteration) return { state: "invalid" };
	const contextPromptTokens = iteration.input + iteration.cacheRead + iteration.cacheWrite;
	return {
		state: "valid",
		usage: {
			contextPromptTokens,
			totalTokens: contextPromptTokens + iteration.output
		}
	};
}
function readAnthropicCompactionBilledUsage(iterations) {
	if (!Array.isArray(iterations) || iterations.length === 0) return;
	let sawCompaction = false;
	const billed = {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0
	};
	for (const iteration of iterations) {
		const resolved = readAnthropicIterationUsage(iteration);
		if (!resolved) return;
		sawCompaction ||= iteration.type === "compaction";
		for (const key of BILLED_USAGE_KEYS) {
			const value = resolved[key];
			if (value !== void 0) billed[key] = (billed[key] ?? 0) + value;
		}
	}
	return sawCompaction ? billed : void 0;
}
/** Record independent billing buckets without treating zero placeholders as context proof. */
function applyAnthropicMessageStartUsage(target, payload) {
	const promptUsage = readAnthropicPromptUsageSnapshot(payload);
	const promptTokens = promptUsage ? promptUsage.input + promptUsage.cacheRead + promptUsage.cacheWrite : 0;
	const resolved = readAnthropicBilledUsage(payload, 0);
	applyAnthropicBilledUsage(target, resolved);
	if (promptTokens > 0 && resolved.output !== void 0) target.contextUsage = {
		state: "available",
		promptTokens,
		totalTokens: promptTokens + target.output
	};
	return promptTokens > 0 ? promptUsage : void 0;
}
/** Keep billing and context distinct; omitted usage preserves the last snapshot. */
function applyAnthropicMessageDeltaUsage(target, usage, messageStartPromptUsage) {
	if (!usage) return;
	const billedIterations = readAnthropicCompactionBilledUsage(usage.iterations);
	const reported = readAnthropicBilledUsage(usage);
	applyAnthropicBilledUsage(target, {
		...reported,
		...billedIterations
	});
	const iterationUsage = readLastAnthropicIterationUsage(usage);
	if (iterationUsage.state === "valid") target.contextUsage = {
		state: "available",
		promptTokens: iterationUsage.usage.contextPromptTokens,
		totalTokens: iterationUsage.usage.totalTokens
	};
	else if (iterationUsage.state === "invalid") target.contextUsage = { state: "unavailable" };
	else if (reported.output !== void 0 && (messageStartPromptUsage !== void 0 || (reported.cacheRead !== void 0 || reported.cacheWrite !== void 0) && readAnthropicPromptUsageSnapshot(usage) !== void 0)) {
		const promptTokens = target.input + target.cacheRead + target.cacheWrite;
		target.contextUsage = {
			state: "available",
			promptTokens,
			totalTokens: promptTokens + target.output
		};
	} else target.contextUsage = { state: "unavailable" };
}
// packages/ai/src/transports/anthropic-compaction-replay.ts
const ANTHROPIC_COMPACTION_REPLAY_TYPE = "anthropic-compaction";
const ANTHROPIC_COMPACTION_SUPPRESSION_TYPE = "anthropic-compaction-suppression";
const ANTHROPIC_COMPACTION_SUPPRESSION_DATA = "rejected";
function createCompactionCapture(output, model, options) {
	const pending = /* @__PURE__ */ new Map();
	return {
		begin(index, block, replayIndex) {
			if (block?.type !== "compaction") return false;
			const content = typeof block.content === "string" ? block.content : "";
			pending.set(index, {
				content,
				replayIndex,
				...typeof block.encrypted_content === "string" || block.encrypted_content === null ? { encryptedContent: block.encrypted_content } : {}
			});
			return true;
		},
		delta(index, delta) {
			const capture = pending.get(index);
			if (!capture || delta?.type !== "compaction_delta") return false;
			if (typeof delta.content === "string") capture.content += delta.content;
			if (typeof delta.encrypted_content === "string" || delta.encrypted_content === null) capture.encryptedContent = delta.encrypted_content;
			return true;
		},
		complete(index) {
			const capture = pending.get(index);
			if (!capture) return false;
			pending.delete(index);
			captureAnthropicCompaction(output, capture, model, options);
			return true;
		}
	};
}
function isAnthropicCompactionState(state) {
	if (state.v !== 1 || typeof state.data !== "string" || typeof state.baseUrlHash !== "string" || !isProviderReplayContext(state)) return false;
	if (state.type === ANTHROPIC_COMPACTION_SUPPRESSION_TYPE) return state.data === ANTHROPIC_COMPACTION_SUPPRESSION_DATA;
	return state.type === ANTHROPIC_COMPACTION_REPLAY_TYPE && state.data.length > 0 && (state.encryptedContent === void 0 || state.encryptedContent === null || typeof state.encryptedContent === "string") && (state.replayIndex === void 0 || typeof state.replayIndex === "number" && Number.isSafeInteger(state.replayIndex) && state.replayIndex >= 0);
}
function readAnthropicCompactionState(value) {
	return isRecord(value) && isAnthropicCompactionState(value) ? value : void 0;
}
function captureAnthropicCompaction(output, capture, model, options) {
	const { content: summary, replayIndex, encryptedContent } = capture;
	const context = buildProviderReplayContext(model, options);
	if (!summary || !context.baseUrlHash || !Number.isSafeInteger(replayIndex) || replayIndex < 0) return;
	output.providerReplay = {
		v: 1,
		type: ANTHROPIC_COMPACTION_REPLAY_TYPE,
		data: summary,
		...encryptedContent !== void 0 ? { encryptedContent } : {},
		replayIndex,
		...context,
		baseUrlHash: context.baseUrlHash
	};
}
/**
* Record a rejected replay on the failed output and notify the transcript owner, which must
* durably strip the checkpoint: hosts may persist failed turns without their replay state.
*/
function suppressAnthropicCompaction(output, model, options, rejected) {
	const context = buildProviderReplayContext(model, options);
	if (!context.baseUrlHash) return;
	output.providerReplay = {
		v: 1,
		type: ANTHROPIC_COMPACTION_SUPPRESSION_TYPE,
		data: ANTHROPIC_COMPACTION_SUPPRESSION_DATA,
		...context,
		baseUrlHash: context.baseUrlHash
	};
	options?.onCompactionRejected?.({ data: rejected.content });
}
/** Read one live replay envelope; null blocks older checkpoints, undefined skips it. */
function createAnthropicCompactionSourceReader(model, options) {
	const context = buildProviderReplayContext(model, options);
	return (value) => {
		const replayState = readAnthropicCompactionState(value);
		if (replayState?.type === ANTHROPIC_COMPACTION_SUPPRESSION_TYPE) return providerReplayContextMatches(replayState, context) ? null : void 0;
		if (value?.type !== ANTHROPIC_COMPACTION_REPLAY_TYPE) return;
		if (!replayState || !providerReplayContextMatches(replayState, context)) return null;
		return {
			replayIndex: replayState.replayIndex ?? 0,
			summary: replayState.data,
			...replayState.encryptedContent !== void 0 ? { encryptedContent: replayState.encryptedContent } : {}
		};
	};
}
function resolveNewestAnthropicCompaction(messages, model, options) {
	const read = createAnthropicCompactionSourceReader(model, options);
	const selected = resolveNewestCompactionReplaySource(messages, (message) => message?.role === "assistant" ? read(message.providerReplay) : void 0);
	if (!selected) return;
	const owner = messages[selected.ownerIndex];
	return owner?.role === "assistant" ? {
		...selected.source,
		owner
	} : void 0;
}
function buildAnthropicReplayPlan(messages, model, options) {
	if (options?.enabled !== true) return { messages };
	const checkpoint = resolveNewestAnthropicCompaction(messages, model, options);
	if (!checkpoint) return { messages };
	const ownerIndex = messages.indexOf(checkpoint.owner);
	return {
		messages: [{
			...checkpoint.owner,
			content: checkpoint.owner.content.slice(checkpoint.replayIndex)
		}, ...messages.slice(ownerIndex + 1)],
		compaction: {
			type: "compaction",
			content: checkpoint.summary,
			...checkpoint.encryptedContent !== void 0 ? { encrypted_content: checkpoint.encryptedContent } : {}
		}
	};
}
/** Match Anthropic's 400 response when a replay block is no longer accepted. */
function isAnthropicReplayRejection(error) {
	if (!error || typeof error !== "object") return false;
	const record = error;
	const nested = record.error && typeof record.error === "object" && !Array.isArray(record.error) ? record.error : void 0;
	const text = [
		record.errorMessage,
		record.message,
		record.code,
		nested?.message,
		nested?.code
	].filter((value) => typeof value === "string").join(" ").toLowerCase();
	return (record.status === 400 || record.errorCode === "400" || text.startsWith("http 400:")) && (text.includes("compaction") || text.includes("context_management"));
}
// packages/ai/src/internal/anthropic-inline-images.ts
const ANTHROPIC_IMAGE_MEDIA_TYPE_SET = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp"
]);
const ANTHROPIC_INLINE_IMAGES_DECODE_SAFETY_BYTES = 67108864;
function createAnthropicInlineImageBudget() {
	return { totalBytes: 0 };
}
function resolveAnthropicImageMediaType(value) {
	if (ANTHROPIC_IMAGE_MEDIA_TYPE_SET.has(value)) return value;
	throw new Error(`Unsupported Anthropic image media type after normalization: ${value}`);
}
function measureInlineImagesWithinBudget(content, budget) {
	const bytes = content.reduce((total, block) => block.type === "image" ? total + estimateBase64DecodedBytes(block.data) : total, 0);
	if (budget.totalBytes + bytes > ANTHROPIC_INLINE_IMAGES_DECODE_SAFETY_BYTES) throw new Error("Anthropic inline images exceed the 64 MB aggregate decoded safety limit.");
	return bytes;
}
async function normalizeAnthropicInlineContent(content, budget) {
	if (!content.some((block) => block.type === "image")) return content.filter((block) => block.type === "text");
	measureInlineImagesWithinBudget(content, budget);
	const normalized = [];
	for (const block of content) {
		if (block.type !== "image") {
			normalized.push(block);
			continue;
		}
		const normalizedBlocks = await getAiTransportHost().normalizeAnthropicInlineContentBlocks([block]);
		budget.totalBytes += measureInlineImagesWithinBudget(normalizedBlocks, budget);
		normalized.push(...normalizedBlocks);
	}
	return normalized;
}
// packages/ai/src/transports/anthropic-request-body.ts
const fragments = /* @__PURE__ */ new WeakMap();
const encoder = new TextEncoder();
function encodeMessageFragment(message, source) {
	let fragment = source ? fragments.get(source) : void 0;
	if (!fragment) {
		fragment = encoder.encode("," + JSON.stringify(message));
		if (source) fragments.set(source, fragment);
	}
	return fragment;
}
function copyPlainData(value, retainFrozen = false, copies = /* @__PURE__ */ new Map()) {
	if (!value || typeof value !== "object") return value;
	if (retainFrozen && getAiTransportHost().immutableData?.isDeeplyFrozenPlainData(value)) return value;
	if (copies.has(value)) return copies.get(value);
	const copy = Array.isArray(value) ? [] : { ...value };
	if (Array.isArray(value)) Reflect.set(copy, "length", value.length);
	if (Object.getPrototypeOf(value) === null) Object.setPrototypeOf(copy, null);
	copies.set(value, copy);
	for (const key of Reflect.ownKeys(value)) {
		if (Array.isArray(value) && key === "length") continue;
		const child = copyPlainData(Reflect.get(value, key), retainFrozen, copies);
		if (Object.hasOwn(copy, key) || key !== "__proto__" && Object.prototype.propertyIsEnumerable.call(value, key)) Reflect.set(copy, key, child);
		else Object.defineProperty(copy, key, {
			value: child,
			enumerable: Object.prototype.propertyIsEnumerable.call(value, key),
			writable: true,
			configurable: true
		});
	}
	return copy;
}
function samePlainData(left, right, seen = /* @__PURE__ */ new Map()) {
	if (Object.is(left, right)) return true;
	if (!left || !right || typeof left !== "object" || typeof right !== "object") return false;
	if (isProxy(right) || Object.getPrototypeOf(left) !== Object.getPrototypeOf(right)) return false;
	if (seen.has(left)) return seen.get(left) === right;
	seen.set(left, right);
	const keys = Reflect.ownKeys(left);
	const otherKeys = Reflect.ownKeys(right);
	if (keys.length !== otherKeys.length || Array.isArray(left) && left.length !== Reflect.get(right, "length")) return false;
	let index = 0;
	for (const key of keys) {
		const descriptor = Object.getOwnPropertyDescriptor(right, key);
		if (key !== otherKeys[index++] || descriptor === void 0 || !("value" in descriptor) || Object.prototype.propertyIsEnumerable.call(left, key) !== descriptor.enumerable || !samePlainData(Reflect.get(left, key), descriptor.value, seen)) return false;
	}
	return true;
}
/** Hooks receive editable containers; envelope edits preserve unchanged history fragments. */
async function applyAnthropicPayloadHook(params, model, options) {
	if (!options?.onPayload) return { params };
	const immutable = getAiTransportHost().immutableData;
	const plain = immutable?.isPlainData;
	const snapshot = plain?.(params) ? copyPlainData(params.messages, true) : void 0;
	const editable = snapshot ? copyPlainData(params) : {
		...params,
		messages: params.messages.map((message) => plain?.(message) ? copyPlainData(message) : message)
	};
	const replacement = await awaitProviderLifecycleCallback(() => options.onPayload?.(editable, model), options.signal);
	let unchanged = false;
	if ((replacement === void 0 || replacement === editable) && snapshot !== void 0) {
		const { messages, ...envelope } = Object.getOwnPropertyDescriptors(editable);
		unchanged = messages !== void 0 && "value" in messages && samePlainData(snapshot, messages.value) && plain?.(Object.create(Object.getPrototypeOf(editable), envelope)) === true;
		if (unchanged && !("toJSON" in Object.prototype) && !("toJSON" in Array.prototype)) for (let index = 0; index < snapshot.length; index++) {
			const source = snapshot[index];
			if (immutable?.isDeeplyFrozenPlainData(source)) encodeMessageFragment(editable.messages[index], source);
		}
	}
	return {
		params: replacement === void 0 ? editable : replacement,
		messageSources: unchanged ? snapshot : null
	};
}
/** Assemble immutable history bytes while encoding the envelope and mutable tail each time. */
function serializeAnthropicRequestBody(payload, messageSources) {
	const immutable = getAiTransportHost().immutableData;
	if (messageSources === null || !immutable?.isPlainData || messageSources === void 0 && !immutable.isPlainData(payload) || "toJSON" in Object.prototype || "toJSON" in Array.prototype || !Array.isArray(payload.messages)) return JSON.stringify(payload);
	const messages = messageSources ?? payload.messages;
	const parts = [];
	let envelope = "{";
	let separator = "";
	for (const key of Object.keys(payload)) {
		const value = Reflect.get(payload, key);
		if (key === "messages") {
			parts.push(encoder.encode(`${envelope}${separator}"messages":[`));
			envelope = "]";
			for (let index = 0; index < messages.length; index++) {
				const message = messages[index];
				const fragment = encodeMessageFragment(message, message !== null && typeof message === "object" && immutable.isDeeplyFrozenPlainData(message) ? message : void 0);
				parts.push(index === 0 ? fragment.subarray(1) : fragment);
			}
		} else {
			const json = JSON.stringify(value);
			if (json === void 0) continue;
			envelope += `${separator}${JSON.stringify(key)}:${json}`;
		}
		separator = ",";
	}
	parts.push(encoder.encode(`${envelope}}`));
	const body = new Uint8Array(parts.reduce((size, part) => size + part.byteLength, 0));
	let offset = 0;
	for (const part of parts) {
		body.set(part, offset);
		offset += part.byteLength;
	}
	markEncodedModelRequestBody(body, payload.stream);
	return body;
}
// packages/ai/src/transports/anthropic-transport-options.ts
const ANTHROPIC_MESSAGES_DEFAULT_MAX_TOKENS = 4096;
const ANTHROPIC_MESSAGES_FALLBACK_CONTEXT_DIVISOR = 4;
function resolvePositiveAnthropicTokenLimit(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	const floored = Math.floor(value);
	return floored > 0 ? floored : void 0;
}
function resolveAnthropicMessagesMaxTokens(params) {
	const requested = resolvePositiveAnthropicTokenLimit(params.requestedMaxTokens);
	if (requested !== void 0) return requested;
	const modelMax = resolvePositiveAnthropicTokenLimit(params.modelMaxTokens);
	if (modelMax !== void 0) return params.useModelDefault ? modelMax : Math.min(modelMax, 32e3);
	if (params.modelMaxTokens !== void 0) return;
	const contextWindow = resolvePositiveAnthropicTokenLimit(params.modelContextWindow);
	return contextWindow === void 0 ? ANTHROPIC_MESSAGES_DEFAULT_MAX_TOKENS : Math.max(1, Math.min(ANTHROPIC_MESSAGES_DEFAULT_MAX_TOKENS, Math.floor(contextWindow / ANTHROPIC_MESSAGES_FALLBACK_CONTEXT_DIVISOR)));
}
function resolveAnthropicTransportOptions(model, options, apiKey) {
	const baseMaxTokens = resolveAnthropicMessagesMaxTokens({
		modelContextWindow: model.contextWindow,
		modelMaxTokens: model.maxTokens,
		requestedMaxTokens: options?.maxTokens,
		useModelDefault: usesClaude5RequestContract(model)
	});
	if (baseMaxTokens === void 0) throw new Error(`Anthropic Messages transport requires a positive maxTokens value for ${model.provider}/${model.id}`);
	const resolved = copyProviderAcceptanceObserver(options, {
		temperature: options?.temperature,
		stop: options?.stop,
		maxTokens: baseMaxTokens,
		signal: options?.signal,
		apiKey,
		cacheRetention: options?.cacheRetention,
		sessionId: options?.sessionId,
		headers: options?.headers,
		onPayload: options?.onPayload,
		onResponse: options?.onResponse,
		metadata: options?.metadata,
		interleavedThinking: options?.interleavedThinking,
		toolChoice: options?.toolChoice,
		thinkingBudgets: options?.thinkingBudgets,
		thinkingDisplay: options?.thinkingDisplay,
		reasoning: options?.reasoning,
		anthropicServerCompaction: options?.anthropicServerCompaction,
		anthropicCompactThreshold: options?.anthropicCompactThreshold,
		cacheTtlPruning: options?.cacheTtlPruning,
		onClaudeCodeVersionRequired: options?.onClaudeCodeVersionRequired,
		onFastModeUnsupported: options?.onFastModeUnsupported,
		...options?.authProfileId ? { authProfileId: options.authProfileId } : {}
	});
	resolved.reasoning = applyAnthropicThinkingOptions(model, resolved, options, "transport");
	return resolved;
}
/** Keep both entry points on one thinking mode while retaining their output-budget policies. */
function applyAnthropicThinkingOptions(model, resolved, options, profile) {
	const managed = profile === "transport";
	const reasoning = options?.reasoning === "off" && requiresClaudeAdaptiveThinking(model) ? "low" : options?.reasoning;
	if (reasoning === "off") {
		resolved.thinkingEnabled = false;
		return reasoning;
	}
	if (!reasoning || supportsClaudeAdaptiveThinking(model)) {
		resolved.thinkingEnabled = Boolean(reasoning) || defaultsClaudeAdaptiveThinking(model);
		if (resolved.thinkingEnabled) resolved.effort = resolveAnthropicThinkingEffort(model, reasoning);
		return reasoning;
	}
	const adjusted = adjustMaxTokensForThinking(resolved.maxTokens, (managed ? resolvePositiveAnthropicTokenLimit(model.maxTokens) : model.maxTokens) ?? resolved.maxTokens, managed && reasoning === "max" ? "high" : reasoning, options?.thinkingBudgets);
	const thinkingEnabled = adjusted.thinkingBudget >= 1024;
	if (managed || thinkingEnabled) resolved.maxTokens = adjusted.maxTokens;
	resolved.thinkingEnabled = thinkingEnabled;
	resolved.thinkingBudgetTokens = thinkingEnabled ? adjusted.thinkingBudget : void 0;
	return reasoning;
}
/**
* Largest completion a request may ask for once transport thinking options
* apply, for callers that size the prompt before dispatch. Claude transports
* (Anthropic Messages, Vertex, Bedrock, Bedrock Mantle) may add a thinking
* budget to `maxTokens`, capped at the model's output limit; some add it even
* for adaptive models, and their Claude detection is plugin-owned, so every
* request on these APIs reserves the default budget for its level. Other
* transports keep `maxTokens` as the total output limit. Over-reserving only
* shrinks the prompt; it never overflows the window.
*/
function resolveCompletionTokenReservation(model, maxTokens, reasoning) {
	if (!reasoning || reasoning === "off" || model.api !== "anthropic-messages" && model.api !== "bedrock-converse-stream") return maxTokens;
	return adjustMaxTokensForThinking(maxTokens, resolvePositiveAnthropicTokenLimit(model.maxTokens) ?? Number.POSITIVE_INFINITY, reasoning).maxTokens;
}
// packages/ai/src/transports/anthropic-messages.ts
const anthropicMessageProjections = /* @__PURE__ */ new WeakMap();
const NON_VISION_USER_IMAGE_PLACEHOLDER = "(image omitted: model does not support images)";
async function convertContentBlocks(content, model, imageBudget, profile, isError) {
	const mediaPlaceholder = describeToolResultMediaPlaceholder(content);
	if (!((profile === "provider" || model.input.includes("image")) && content.some(isImageWithMediaPayload))) {
		const text = extractToolResultText(content);
		return text.trim() ? text : mediaPlaceholder ?? (profile === "transport" ? "(no output)" : isError ? "[tool error with no output]" : "");
	}
	const blocks = [];
	for (const block of content) {
		if (!asOptionalObjectRecord(block)) continue;
		const blockText = extractToolResultBlockText(block);
		if (blockText) blocks.push({
			type: "text",
			text: blockText
		});
		if (!isImageWithMediaPayload(block)) continue;
		const [normalizedImage] = await normalizeAnthropicInlineContent([typeof block.mimeType === "string" ? block : {
			...block,
			mimeType: profile === "provider" ? "image/jpeg" : "image/png"
		}], imageBudget);
		if (normalizedImage?.type !== "image") continue;
		blocks.push({
			type: "image",
			source: {
				type: "base64",
				media_type: resolveAnthropicImageMediaType(normalizedImage.mimeType),
				data: normalizedImage.data
			}
		});
	}
	if (!blocks.some((block) => block.type === "text")) blocks.unshift({
		type: "text",
		text: mediaPlaceholder ?? "(see attached image)"
	});
	return blocks;
}
/** Assemble both public Messages routes without changing their replay/default profiles. */
async function buildAnthropicRequest(model, context, options, profile, isOAuthToken, serverSideFallback, claudeCodeVersion) {
	const managed = profile === "transport";
	const maxTokens = managed ? resolveAnthropicMessagesMaxTokens({
		modelContextWindow: model.contextWindow,
		modelMaxTokens: model.maxTokens,
		requestedMaxTokens: options?.maxTokens
	}) : options?.maxTokens ?? model.maxTokens;
	if (managed && maxTokens === void 0) throw new Error(`Anthropic Messages transport requires a positive maxTokens value for ${model.provider}/${model.id}`);
	const { cacheControl, supportsCacheControlOnTools } = resolveAnthropicCacheOptions(model, options?.cacheRetention);
	const system = buildAnthropicSystemBlocks(context.systemPrompt, isOAuthToken, cacheControl, claudeCodeVersion, context.preparedSystemPrompt);
	let toolProjection;
	let eagerToolInputStreaming = false;
	if (context.tools) {
		const tools = context.tools;
		eagerToolInputStreaming = !managed && (model.compat?.supportsEagerToolInputStreaming ?? model.provider !== "fireworks");
		toolProjection = projectAnthropicTools(tools, (name) => isOAuthToken ? toClaudeCodeToolName(name) : name);
	}
	const replayPlan = buildAnthropicReplayPlan(context.messages, model, {
		enabled: !isOAuthToken && options?.anthropicServerCompaction === true,
		sessionId: options?.sessionId
	});
	const cacheBreakpointOptOutMessageIndexes = /* @__PURE__ */ new Set();
	const transformed = managed ? getAiTransportHost().transformTransportMessages(replayPlan.messages, model, normalizeAnthropicToolCallId, { preserveUnframedToolResults: preparedRequestSuffix.has(context) }) : transformProviderMessages(replayPlan.messages, model, normalizeAnthropicToolCallId);
	const allowReasoningContentReplay = managed && resolveProviderEndpoint(model).endpointClass === "xiaomi-native";
	const allowEmptySignature = model.compat?.allowEmptySignature;
	const compaction = replayPlan.compaction;
	const replayThinkingEnabled = requiresClaudeAdaptiveThinking(model) || options?.thinkingEnabled === true;
	const messages = [];
	const appendMessage = (message) => {
		if (message.role === "system" && (!messages.length || messages.at(-1)?.role === "assistant")) messages.push({
			role: "user",
			content: "."
		});
		if (message.role === "user" && messages.at(-1)?.role === "system") messages.push({
			role: "assistant",
			content: [{
				type: "text",
				text: STREAM_ERROR_FALLBACK_TEXT
			}]
		});
		messages.push(message);
	};
	const modelRetainsRuntimeContext = bindsClaudeThinkingPrefix(model);
	const inHistorySystemUpdates = !isOAuthToken && isDirectAnthropicModel(model) && supportsClaudeInHistorySystemMessages(model);
	const imageBudget = createAnthropicInlineImageBudget();
	const activeToolTurnAssistantIndex = replayThinkingEnabled ? -1 : findActiveAnthropicToolTurnAssistantIndex(transformed);
	const convertMessage = async (msg, i, end) => {
		if (msg.role === "user") {
			const operatorMessage = inHistorySystemUpdates ? msg.operatorMessage : void 0;
			const sourceContent = msg.content;
			let content;
			if (typeof sourceContent === "string") {
				if (sourceContent.trim().length === 0) return;
				content = sanitizeTransportPayloadText(sourceContent);
			} else {
				content = (!managed || model.input.includes("image") ? await normalizeAnthropicInlineContent(sourceContent, imageBudget) : sourceContent.map((item) => item.type === "image" ? {
					type: "text",
					text: NON_VISION_USER_IMAGE_PLACEHOLDER
				} : item)).map((item) => item.type === "text" ? {
					type: "text",
					text: sanitizeTransportPayloadText(item.text)
				} : {
					type: "image",
					source: {
						type: "base64",
						media_type: resolveAnthropicImageMediaType(item.mimeType),
						data: item.data
					}
				}).filter((block) => block.type === "text" ? block.text.trim().length > 0 : !managed || model.input.includes("image"));
				if (content.length === 0) return;
			}
			return {
				role: operatorMessage ? "system" : "user",
				content: operatorMessage ? typeof content === "string" ? [{
					type: "text",
					text: content
				}] : content.filter((block) => block.type === "text") : content,
				...operatorMessage?.turnScoped ? { clear_at: "next_user_message" } : {}
			};
		}
		if (msg.role === "assistant") {
			const blocks = i === 0 && compaction ? [compaction] : [];
			const reasoningContent = [];
			let omittedThinking = false;
			for (const block of msg.content) {
				if (block.type === "text") {
					if (block.text.trim().length > 0) blocks.push({
						type: "text",
						text: sanitizeTransportPayloadText(block.text)
					});
					continue;
				}
				if (block.type === "thinking") {
					const thinkingSignature = block.thinkingSignature?.trim();
					const isReasoningContent = thinkingSignature === "reasoning_content";
					if (!replayThinkingEnabled && i !== activeToolTurnAssistantIndex && (!managed || !isReasoningContent)) {
						omittedThinking = true;
						continue;
					}
					if (block.redacted) {
						if (!managed && !block.thinkingSignature) throw new Error("redacted thinking block is missing its opaque signature");
						blocks.push({
							type: "redacted_thinking",
							data: block.thinkingSignature
						});
						continue;
					}
					const hasNativeThinkingSignature = Boolean(thinkingSignature) && !isReasoningContent;
					if (block.thinking.trim().length === 0 && !hasNativeThinkingSignature) continue;
					if (!thinkingSignature && !allowEmptySignature) blocks.push({
						type: "text",
						text: sanitizeTransportPayloadText(block.thinking)
					});
					else if (!isReasoningContent || allowReasoningContentReplay) {
						const thinking = isReasoningContent ? sanitizeTransportPayloadText(block.thinking) : block.thinking;
						blocks.push({
							type: "thinking",
							thinking,
							signature: thinkingSignature ?? ""
						});
						if (isReasoningContent) reasoningContent.push(thinking);
					}
					continue;
				}
				if (block.type === "toolCall") blocks.push({
					type: "tool_use",
					id: block.id,
					name: isOAuthToken ? toClaudeCodeToolName(block.name) : block.name,
					input: managed ? coerceTransportToolCallArguments(block.arguments) : block.arguments ?? {}
				});
			}
			if (blocks.length === 0 && omittedThinking) blocks.push({
				type: "text",
				text: ANTHROPIC_OMITTED_REASONING_TEXT
			});
			if (blocks.length > 0) {
				const assistantMsg = {
					role: "assistant",
					content: blocks
				};
				if (reasoningContent.length > 0) assistantMsg.reasoning_content = reasoningContent.join("\n");
				else if (allowReasoningContentReplay) blocks.unshift({
					type: "thinking",
					thinking: "",
					signature: "reasoning_content"
				});
				return assistantMsg;
			}
			return;
		}
		if (msg.role === "toolResult") {
			const toolResults = [];
			for (let j = i; j < end; j++) {
				const nextMsg = transformed.at(j);
				if (nextMsg?.role !== "toolResult") break;
				toolResults.push({
					type: "tool_result",
					tool_use_id: preparedRequestSuffix.has(context) ? preparedRequestSuffix.toolCallId(context, nextMsg.toolCallId, normalizeAnthropicToolCallId(nextMsg.toolCallId)) : nextMsg.toolCallId,
					content: await convertContentBlocks(nextMsg.content, model, imageBudget, profile, nextMsg.isError),
					is_error: nextMsg.isError
				});
			}
			return {
				role: "user",
				content: toolResults
			};
		}
	};
	const immutable = getAiTransportHost().immutableData;
	const projectionKey = JSON.stringify([
		profile,
		model.provider,
		model.api,
		model.id,
		model.baseUrl,
		model.input.includes("image"),
		isOAuthToken,
		allowReasoningContentReplay,
		allowEmptySignature,
		replayThinkingEnabled,
		inHistorySystemUpdates
	]);
	const activeProjectionKey = `${projectionKey}:active`;
	const canReuse = (message) => Boolean(immutable?.isPlainData) && immutable?.isDeeplyFrozenPlainData(message) && (typeof message.content === "string" || !message.content.some((block) => block.type === "image"));
	for (let i = 0; i < transformed.length;) {
		const msg = transformed[i];
		if (!msg) {
			i++;
			continue;
		}
		let end = i + 1;
		if (msg.role === "toolResult") while (transformed[end]?.role === "toolResult") end++;
		let reusable = !compaction && !preparedRequestSuffix.has(context) && canReuse(msg);
		for (let j = i + 1; reusable && j < end; j++) {
			const following = transformed[j];
			reusable = following !== void 0 && canReuse(following);
		}
		const key = i === activeToolTurnAssistantIndex ? activeProjectionKey : projectionKey;
		let projections = reusable ? anthropicMessageProjections.get(msg) : void 0;
		const projection = projections?.find((entry) => entry.key === key && entry.followingSources.length === end - i - 1 && entry.followingSources.every((source, index) => source === transformed[i + index + 1]));
		let output = projection?.message;
		if (!projection) {
			output = await convertMessage(msg, i, end);
			if (reusable && immutable) {
				immutable.freezeJsonSnapshot(output);
				if (!projections) {
					projections = [];
					anthropicMessageProjections.set(msg, projections);
				}
				if (projections.length >= 8) projections.shift();
				projections.push({
					key,
					followingSources: transformed.slice(i + 1, end),
					message: output
				});
			}
		}
		if (output) {
			appendMessage(output);
			if (msg.role === "user") {
				const runtimeContextRetained = msg.runtimeContext !== void 0 ? msg.runtimeContext.retained : msg.runtimeContextCarrierRetained;
				if (hasRuntimeContextMarker(msg) && !(runtimeContextRetained ?? modelRetainsRuntimeContext)) cacheBreakpointOptOutMessageIndexes.add(messages.length - 1);
			}
		}
		i = end;
	}
	if (managed && messages.length === 0) messages.push({
		role: "user",
		content: "."
	});
	const params = {
		model: managed && isDirectAnthropicModel(model) ? model.id.replace(/^anthropic\//i, "") : model.id,
		messages,
		max_tokens: maxTokens ?? model.maxTokens,
		stream: true
	};
	if (system) params.system = system;
	if (serverSideFallback) Object.assign(params, { fallbacks: ANTHROPIC_SERVER_SIDE_FALLBACKS });
	const generationParams = {};
	const mandatoryAdaptiveThinking = requiresClaudeAdaptiveThinking(model);
	if (options?.temperature !== void 0 && !options?.thinkingEnabled && !supportsClaudeNativeXhighEffort(model)) generationParams.temperature = options.temperature;
	if (options?.stop !== void 0 && options.stop.length > 0) generationParams.stop_sequences = options.stop;
	if (toolProjection && toolProjection.tools.length > 0) generationParams.tools = toolProjection.tools.map((tool) => ({
		name: tool.wireName,
		description: tool.description,
		input_schema: tool.inputSchema,
		...eagerToolInputStreaming ? { eager_input_streaming: true } : {}
	}));
	if (mandatoryAdaptiveThinking || model.reasoning || supportsClaudeAdaptiveThinking(model)) {
		if (mandatoryAdaptiveThinking || options?.thinkingEnabled) {
			const display = options?.thinkingDisplay ?? "summarized";
			if (supportsClaudeAdaptiveThinking(model)) {
				generationParams.thinking = {
					type: "adaptive",
					display
				};
				const effort = options?.effort ?? (mandatoryAdaptiveThinking ? resolveAnthropicThinkingEffort(model, void 0) : void 0);
				if (effort) generationParams.output_config = { effort };
			} else generationParams.thinking = {
				type: "enabled",
				budget_tokens: options?.thinkingBudgetTokens ?? 1024,
				...profile === "provider" ? { display } : {}
			};
		} else if (options?.thinkingEnabled === false) generationParams.thinking = requiresClaudeBetweenToolsThinking(model) ? { type: "between_tools" } : { type: "disabled" };
	}
	if (options?.metadata) {
		const userId = options.metadata.user_id;
		if (typeof userId === "string") generationParams.metadata = { user_id: userId };
	}
	if (options?.toolChoice) {
		const normalizedToolChoice = normalizeAnthropicToolChoice(resolveClaudeHaiku55ModelIdentity(model) === void 0 && (mandatoryAdaptiveThinking || options?.thinkingEnabled === true || resolveClaudeSonnet55ModelIdentity(model) !== void 0), options.toolChoice);
		const projectedToolChoice = toolProjection ? reconcileAnthropicToolChoice(normalizedToolChoice, toolProjection) : normalizedToolChoice;
		if (projectedToolChoice) generationParams.tool_choice = projectedToolChoice;
	}
	Object.assign(params, generationParams);
	applyAnthropicRequestCacheControl(params, cacheControl, supportsCacheControlOnTools, cacheBreakpointOptOutMessageIndexes);
	return {
		params,
		toolProjection,
		replayedCompaction: replayPlan.compaction
	};
}
/** Apply caller payload edits before restoring required request contracts and beta headers. */
async function prepareAnthropicRequest(initialParams, model, options, directApiKeyBetaHeader) {
	let params = initialParams;
	applyAnthropicContextManagementToRequest(params, model, options, directApiKeyBetaHeader);
	const hooked = await applyAnthropicPayloadHook(params, model, options);
	params = hooked.params;
	applyClaudeRequestContract(params, model);
	const betaHeader = resolveAnthropicRequestBetaHeader(params, directApiKeyBetaHeader);
	const headers = applyAnthropicThinkingBindingControls(params, betaHeader) ?? (betaHeader ? { "anthropic-beta": betaHeader } : void 0);
	return {
		params,
		headers,
		messageSources: hooked.messageSources
	};
}
// packages/ai/src/transports/anthropic-stream-lifecycle.ts
function notifyOwner(callback) {
	try {
		callback();
	} catch {}
}
/** Entry points retain their SDK/fetch adapters; request and terminal ownership is shared. */
async function runAnthropicStreamLifecycle(params) {
	const { model, stream, options, profile } = params;
	const output = createAssistantOutput(model, "anthropic-messages");
	const refusalBuffer = usesClaudeStreamingRefusalContract(model) ? createDeferredEventBuffer(stream) : void 0;
	let replayedCompaction;
	try {
		const send = async (retry) => {
			const prepared = await params.prepare();
			const built = await buildAnthropicRequest(model, prepared.context, prepared.options, profile, prepared.isOAuthToken, prepared.serverSideFallback, prepared.claudeCodeVersion);
			replayedCompaction = built.replayedCompaction;
			const { params: body, headers, messageSources } = await prepareAnthropicRequest(built.params, model, prepared.options, prepared.directApiKeyBetaHeader);
			const wireBody = {
				...body,
				stream: true
			};
			if (!retry.speed) delete wireBody.speed;
			try {
				const { response, events } = await prepared.request(wireBody, headers, () => serializeAnthropicRequestBody(wireBody, messageSources));
				await notifyProviderHttpResponse({
					options: prepared.options,
					response,
					model
				});
				await prepared.checkResponse?.(response);
				return {
					prepared,
					built,
					events
				};
			} catch (error) {
				const required = prepared.isOAuthToken ? readRequiredClaudeCodeVersion(error) : void 0;
				if (retry.version && required && raiseClaudeCodeVersionFloor(required)) {
					notifyOwner(() => prepared.options?.onClaudeCodeVersionRequired?.(required));
					return send({
						...retry,
						version: false
					});
				}
				if (retry.speed && wireBody.speed !== void 0 && isUnsupportedClaudeFastModeError(error)) {
					notifyOwner(() => prepared.options?.onFastModeUnsupported?.(model.id));
					return send({
						...retry,
						speed: false
					});
				}
				throw error;
			}
		};
		const { prepared, built, events } = await send({
			version: true,
			speed: true
		});
		await (async () => {
			const reducerOptions = prepared.options ?? {};
			const isOAuthToken = prepared.isOAuthToken;
			const toolProjection = built.toolProjection;
			const managed = profile === "transport";
			const eventSink = refusalBuffer ?? stream;
			let costModel = model;
			const applyServingModelCost = (servingModelId) => {
				costModel = {
					...model,
					cost: resolveAnthropicFallbackServingModelCost({
						requestedModelId: model.id,
						servingModelId,
						requestedCost: model.cost
					})
				};
				calculateCost(costModel, output.usage);
			};
			let messageStartPromptUsage;
			let inputTransformations;
			try {
				const blocks = output.content;
				const blockIndexes = /* @__PURE__ */ new Map();
				const toolArgumentPreviewSchedules = /* @__PURE__ */ new WeakMap();
				const seededToolArguments = /* @__PURE__ */ new WeakMap();
				const sealedToolCalls = [];
				const compactionCapture = createCompactionCapture(output, model, reducerOptions);
				const pendingThinkingSignatures = /* @__PURE__ */ new Map();
				const allowReasoningContentReplay = managed && resolveProviderEndpoint(model).endpointClass === "xiaomi-native";
				const reasoningContentBlocks = {
					thinking: /* @__PURE__ */ new Map(),
					text: /* @__PURE__ */ new Map()
				};
				let sawMessageStart = false;
				let sawMessageStop = false;
				let sawStopReason = false;
				let sawFallbackBoundary = false;
				let terminalFallbackModel;
				const emitContentEnd = (block, contentIndex) => {
					eventSink.push({
						type: `${block.type}_end`,
						contentIndex,
						content: block.type === "thinking" ? block.thinking : block.text,
						partial: output
					});
				};
				const emitContentStart = (kind, contentIndex, delta = "") => {
					eventSink.push({
						type: `${kind}_start`,
						contentIndex,
						partial: output
					});
					if (delta.length > 0) eventSink.push({
						type: `${kind}_delta`,
						contentIndex,
						delta,
						partial: output
					});
				};
				const appendContentDelta = (block, contentIndex, delta) => {
					if (block.type === "thinking") appendAssistantThinking(block, delta);
					else block.text += delta;
					eventSink.push({
						type: `${block.type}_delta`,
						contentIndex,
						delta,
						partial: output
					});
				};
				const eventIndexKey = (eventIndex) => typeof eventIndex === "number" ? eventIndex : -1;
				const appendReasoningContentDelta = (kind, eventIndex, rawText) => {
					if (typeof rawText !== "string") return false;
					const text = sanitizeTransportPayloadText(rawText);
					if (text.length === 0) return false;
					const indexes = reasoningContentBlocks[kind];
					const key = eventIndexKey(eventIndex);
					let contentIndex = indexes.get(key);
					let block = contentIndex === void 0 ? void 0 : blocks[contentIndex];
					if (contentIndex === void 0 || !block || block.type !== kind) {
						block = kind === "thinking" ? {
							type: "thinking",
							thinking: "",
							thinkingSignature: "reasoning_content"
						} : {
							type: "text",
							text: ""
						};
						output.content.push(block);
						contentIndex = output.content.length - 1;
						indexes.set(key, contentIndex);
						emitContentStart(kind, contentIndex);
					}
					if (block.type === "thinking") block.thinkingSignature = "reasoning_content";
					appendContentDelta(block, contentIndex, text);
					return true;
				};
				const finishReasoningContentSidecars = (eventIndex) => {
					const key = eventIndexKey(eventIndex);
					for (const kind of ["thinking", "text"]) {
						const indexes = reasoningContentBlocks[kind];
						const contentIndex = indexes.get(key);
						if (contentIndex === void 0) continue;
						indexes.delete(key);
						const block = output.content[contentIndex];
						if (block?.type === kind) emitContentEnd(block, contentIndex);
					}
				};
				for await (const rawEvent of iterateModelStream(events, reducerOptions.signal)) {
					const event = asRecord(rawEvent);
					inputTransformations = readAnthropicInputTransformations(event) ?? inputTransformations;
					if (managed) notifyLlmRequestActivity(reducerOptions.signal);
					if (event.type === "error") {
						const error = asOptionalObjectRecord(event.error);
						throw Object.assign(new Error(readStringField(error, "message") || "Anthropic Messages stream failed"), { error });
					}
					if (event.type === "message_start") {
						sawMessageStart = true;
						const message = asOptionalObjectRecord(event.message);
						const usage = asRecord(message?.usage);
						output.responseId = typeof message?.id === "string" ? message.id : void 0;
						output.responseModel = typeof message?.model === "string" ? message.model : void 0;
						messageStartPromptUsage = applyAnthropicMessageStartUsage(output.usage, usage);
						calculateCost(costModel, output.usage);
						eventSink.push({
							type: "start",
							partial: output
						});
						continue;
					}
					if (event.type === "message_stop") {
						sawMessageStop = true;
						continue;
					}
					if (event.type === "content_block_start") {
						const contentBlock = asOptionalObjectRecord(event.content_block);
						const index = typeof event.index === "number" ? event.index : -1;
						if (reducerOptions.anthropicServerCompaction === true && compactionCapture.begin(index, contentBlock, output.content.length)) continue;
						const fallbackBoundary = refusalBuffer ? readAnthropicFallbackBoundary(contentBlock) : null;
						if (fallbackBoundary) {
							sawFallbackBoundary = true;
							refusalBuffer?.discard();
							sealedToolCalls.length = 0;
							blockIndexes.clear();
							pendingThinkingSignatures.clear();
							applyAnthropicFallbackBoundary({
								output,
								boundary: fallbackBoundary,
								provider: model.provider
							});
							applyServingModelCost(fallbackBoundary.toModel);
							eventSink.push({
								type: "start",
								partial: output
							});
							for (const [i, block] of blocks.entries()) {
								if (block.type !== "text") continue;
								emitContentStart("text", i, block.text);
								emitContentEnd(block, i);
							}
							continue;
						}
						pendingThinkingSignatures.delete(index);
						if (contentBlock?.type === "text" || contentBlock?.type === "thinking" || contentBlock?.type === "redacted_thinking") {
							const block = contentBlock.type === "text" ? {
								type: "text",
								text: typeof contentBlock.text === "string" ? sanitizeTransportPayloadText(contentBlock.text) : ""
							} : contentBlock.type === "thinking" ? {
								type: "thinking",
								thinking: typeof contentBlock.thinking === "string" ? contentBlock.thinking : "",
								thinkingSignature: typeof contentBlock.signature === "string" ? contentBlock.signature : ""
							} : {
								type: "thinking",
								thinking: "[Reasoning redacted]",
								thinkingSignature: typeof contentBlock.data === "string" ? contentBlock.data : "",
								redacted: true
							};
							const delta = block.type === "text" ? block.text : block.redacted ? "" : block.thinking;
							output.content.push(block);
							const contentIndex = output.content.length - 1;
							blockIndexes.set(index, contentIndex);
							emitContentStart(block.type, contentIndex, delta);
							continue;
						}
						if (contentBlock?.type === "tool_use") {
							const block = {
								type: "toolCall",
								id: typeof contentBlock.id === "string" ? contentBlock.id : "",
								name: typeof contentBlock.name === "string" ? isOAuthToken ? resolveOriginalAnthropicToolName(contentBlock.name, toolProjection) : contentBlock.name : "",
								arguments: asRecord(contentBlock.input),
								partialJson: ""
							};
							output.content.push(block);
							blockIndexes.set(index, output.content.length - 1);
							seededToolArguments.set(block, managed ? block.arguments : contentBlock.input ?? {});
							toolArgumentPreviewSchedules.set(block, createToolArgumentPreviewSchedule());
							eventSink.push({
								type: "toolcall_start",
								contentIndex: output.content.length - 1,
								partial: output
							});
						}
						continue;
					}
					if (event.type === "content_block_delta") {
						const delta = asOptionalObjectRecord(event.delta);
						const eventIndex = typeof event.index === "number" ? event.index : void 0;
						if (eventIndex !== void 0 && compactionCapture.delta(eventIndex, delta)) continue;
						let index = eventIndex === void 0 ? void 0 : blockIndexes.get(eventIndex);
						let block = index === void 0 ? void 0 : blocks[index];
						if (allowReasoningContentReplay) {
							const appendedThinking = appendReasoningContentDelta("thinking", event.index, delta?.reasoning_content);
							const hasNativeAnthropicDelta = delta?.type === "text_delta" && typeof delta.text === "string" || delta?.type === "thinking_delta" && typeof delta.thinking === "string" || delta?.type === "input_json_delta" && typeof delta.partial_json === "string" || delta?.type === "signature_delta" && typeof delta.signature === "string";
							let appendedContent = false;
							if (!hasNativeAnthropicDelta && typeof delta?.content === "string" && delta.content.length > 0) {
								const text = sanitizeTransportPayloadText(delta.content);
								if (text.length > 0) {
									if (block?.type === "text" && index !== void 0) {
										appendContentDelta(block, index, text);
										appendedContent = true;
									} else appendedContent = appendReasoningContentDelta("text", event.index, text);
								}
							}
							if ((appendedThinking || appendedContent) && !hasNativeAnthropicDelta) continue;
						}
						if (managed && !block && delta?.type === "text_delta" && typeof delta.text === "string") {
							block = {
								type: "text",
								text: ""
							};
							output.content.push(block);
							index = output.content.length - 1;
							if (typeof event.index === "number") blockIndexes.set(event.index, index);
							emitContentStart("text", index);
						}
						if (index === void 0) continue;
						if (block?.type === "text" && delta?.type === "text_delta" && typeof delta.text === "string") {
							appendContentDelta(block, index, delta.text);
							continue;
						}
						if (block?.type === "thinking" && delta?.type === "thinking_delta" && typeof delta.thinking === "string") {
							appendContentDelta(block, index, delta.thinking);
							continue;
						}
						if (block?.type === "toolCall" && delta?.type === "input_json_delta" && typeof delta.partial_json === "string") {
							const partialJson = `${block.partialJson ?? ""}${delta.partial_json}`;
							block.partialJson = partialJson;
							if (toolArgumentPreviewSchedules.get(block)?.(partialJson.length)) block.arguments = managed ? coerceTransportToolCallArguments(parseJsonObjectPreservingUnsafeIntegers(partialJson) ?? parseStreamingJson(partialJson)) : parseStreamingJson(partialJson);
							eventSink.push({
								type: "toolcall_delta",
								contentIndex: index,
								delta: delta.partial_json,
								partial: output
							});
							continue;
						}
						if (block?.type === "thinking" && delta?.type === "signature_delta" && typeof delta.signature === "string") {
							const signatureIndex = eventIndexKey(event.index);
							const pendingSignature = pendingThinkingSignatures.get(signatureIndex);
							if (pendingSignature === void 0) {
								block.thinkingSignature = "";
								pendingThinkingSignatures.set(signatureIndex, delta.signature);
							} else pendingThinkingSignatures.set(signatureIndex, pendingSignature + delta.signature);
						}
						continue;
					}
					if (event.type === "content_block_stop") {
						const eventIndex = typeof event.index === "number" ? event.index : void 0;
						if (eventIndex !== void 0 && compactionCapture.complete(eventIndex)) continue;
						const pendingSignature = eventIndex === void 0 ? void 0 : pendingThinkingSignatures.get(eventIndex);
						if (eventIndex !== void 0) pendingThinkingSignatures.delete(eventIndex);
						const index = eventIndex === void 0 ? void 0 : blockIndexes.get(eventIndex);
						const block = index === void 0 ? void 0 : blocks[index];
						if (eventIndex === void 0 || index === void 0 || !block) {
							finishReasoningContentSidecars(event.index);
							continue;
						}
						blockIndexes.delete(eventIndex);
						if (block.type === "thinking" && pendingSignature !== void 0) block.thinkingSignature = pendingSignature;
						if (block.type === "toolCall") sealedToolCalls.push({
							block,
							contentIndex: index
						});
						else emitContentEnd(block, index);
						finishReasoningContentSidecars(event.index);
						continue;
					}
					if (event.type === "message_delta") {
						logAnthropicContextEdits(event);
						const delta = asOptionalObjectRecord(event.delta);
						const usage = asOptionalObjectRecord(event.usage);
						if (typeof delta?.stop_reason === "string" && delta.stop_reason) {
							sawStopReason = true;
							const iteration = Array.isArray(usage?.iterations) ? asOptionalObjectRecord(usage.iterations.at(-1)) : void 0;
							terminalFallbackModel = iteration?.type === "fallback_message" && typeof iteration.model === "string" && iteration.model.trim() ? iteration.model : void 0;
							if (delta.stop_reason === "refusal") applyAnthropicRefusal(output, delta.stop_details, model.provider);
							else output.stopReason = mapAnthropicStopReason(delta.stop_reason);
						}
						applyAnthropicMessageDeltaUsage(output.usage, usage, messageStartPromptUsage);
						if (sawStopReason && messageStartPromptUsage && typeof usage?.output_tokens === "number") output.usage.usageReport = { state: "available" };
						calculateCost(costModel, output.usage);
					}
				}
				if ((isDirectAnthropicModel(model) || !managed && refusalBuffer) && !sawMessageStop) throw new Error("Anthropic stream ended before message_stop");
				if (reducerOptions.signal?.aborted) throw transportAbortError(reducerOptions.signal);
				if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error(output.errorMessage ?? "An unknown error occurred");
				if ([...blockIndexes.values()].some((index) => blocks[index]?.type === "toolCall")) throw new Error("Provider completed stream with an incomplete tool call");
				if ((sawMessageStart || blocks.length > 0) && !sawMessageStop && !sawStopReason) throw new Error("Anthropic stream ended before a terminal event");
				finalizeTerminalToolCallArguments(sealedToolCalls.map(({ block }) => block), (block) => block.partialJson && block.partialJson.length > 0 ? block.partialJson : seededToolArguments.get(block), void 0, { repairStringLiterals: true });
				if (refusalBuffer && terminalFallbackModel && !sawFallbackBoundary) {
					output.responseModel = terminalFallbackModel;
					applyServingModelCost(terminalFallbackModel);
					output.diagnostics = [...output.diagnostics ?? [], {
						type: "provider_fallback",
						timestamp: Date.now(),
						details: {
							provider: model.provider,
							fromModel: model.id,
							toModel: terminalFallbackModel
						}
					}];
				}
				for (const sealed of sealedToolCalls) {
					delete sealed.block.partialJson;
					eventSink.push({
						type: "toolcall_end",
						contentIndex: sealed.contentIndex,
						toolCall: sealed.block,
						partial: output
					});
				}
				refusalBuffer?.flush();
			} finally {
				logAnthropicThinkingDrops(inputTransformations);
			}
		})();
		finalizeTransportStream({
			stream,
			output
		});
	} catch (error) {
		failTransportStream({
			stream,
			output,
			signal: options?.signal,
			error,
			cleanup: () => {
				refusalBuffer?.discard();
				output.content = refusalBuffer ? [] : output.content.filter((block) => block.type !== "toolCall");
				if (replayedCompaction && isAnthropicReplayRejection(profile === "provider" ? error : output)) suppressAnthropicCompaction(output, model, options, replayedCompaction);
			}
		});
	}
}
export { resolveAnthropicRequestBetaHeader as A, omitFoundryBearerCredentialHeaders as B, buildAnthropicSystemBlocks as C, resolveAnthropicCacheOptions as D, logAnthropicContextEdits as E, CLAUDE_OPUS_FALLBACK_MODEL_COST as F, applyAnthropicFallbackBoundary as I, readAnthropicFallbackBoundary as L, supportsAnthropicServerSideFallback as M, ANTHROPIC_SERVER_SIDE_FALLBACKS as N, resolveAnthropicEphemeralCacheControl as O, ANTHROPIC_SERVER_SIDE_FALLBACK_BETA as P, resolveAnthropicFallbackServingModelCost as R, applyAnthropicRequestCacheControl as S, isDirectAnthropicModel as T, usesFoundryBearerAuth as V, readAnthropicInputTransformations as _, createAnthropicCompactionSourceReader as a, applyAnthropicEphemeralCacheControlMarkers as b, applyAnthropicMessageStartUsage as c, readAnthropicUsageTokenCount as d, readLastAnthropicIterationUsage as f, logAnthropicThinkingDrops as g, findActiveAnthropicToolTurnAssistantIndex as h, resolveCompletionTokenReservation as i, resolveAnthropicServerCompactionPlan as j, resolveAnthropicPayloadPolicy as k, readAnthropicCacheWriteUsage as l, applyAnthropicThinkingBindingControls as m, applyAnthropicThinkingOptions as n, resolveNewestAnthropicCompaction as o, ANTHROPIC_OMITTED_REASONING_TEXT as p, resolveAnthropicTransportOptions as r, applyAnthropicMessageDeltaUsage as s, runAnthropicStreamLifecycle as t, readAnthropicPromptUsageSnapshot as u, applyAnthropicRefusal as v, isAnthropicServerToolClearingEnabled as w, applyAnthropicPayloadPolicyToParams as x, applyAnthropicContextManagementToRequest as y, isAnthropicOAuthApiKey as z };
