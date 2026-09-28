import { S as supportsClaudeNativeXhighEffort, c as bindsClaudeThinkingPrefix, d as resolveClaudeFable5ModelIdentity, f as resolveClaudeModelIdentity, g as resolveClaudeOpus5ModelIdentity, h as resolveClaudeOpus55ModelIdentity, y as supportsClaudeAdaptiveThinking } from "./src-DwGYYyZp.mjs";
import { r as appendAssistantThinking } from "./event-stream-D8PARQfL.mjs";
import { i as normalizeOptionalLowercaseString, r as normalizeNullableString } from "./string-coerce-fsri9iCu.mjs";
import { a as asRecord, o as isRecord, r as asOptionalObjectRecord, s as readStringField } from "./record-coerce-DwRYMj3t.mjs";
import { C as mapAnthropicStopReason, E as resolveAnthropicThinkingEffort, M as calculateCost, T as requiresClaudeAdaptiveThinking, _ as isImageWithMediaPayload, d as describeToolResultMediaPlaceholder, m as extractToolResultText, n as getAiTransportHost, p as extractToolResultBlockText, v as sanitizeSurrogates, y as ANTHROPIC_CLAUDE_CODE_VERSION } from "./host-yTvBrYM2.mjs";
import { i as asNonNegativeFiniteNumber, n as estimateBase64DecodedBytes } from "./base64-CPmadnUf.mjs";
import "./transport-utils-03Qi0CN2.mjs";
import { a as resolveProviderRequestCapabilities, i as resolveProviderEndpoint } from "./host-policy-DZO3oPPk.mjs";
import { t as resolveCacheRetention } from "./cache-retention-0x979a5V.mjs";
import { f as splitSystemPromptCacheBoundary, h as stripSystemPromptRelocatableBoundary, m as stripSystemPromptCacheBoundary, v as sortPromptCacheToolsByName } from "./simple-options-np1XPuhm.mjs";
import { t as parsePositiveInteger } from "./positive-integer-BiUxrd71.mjs";
import { n as projectRuntimeToolInputSchema } from "./tool-schema-json-projection-CD9c_fK8.mjs";
import { E as parseStreamingJson, _ as sanitizeTransportPayloadText, c as finalizeTerminalToolCallArguments, g as sanitizeNonEmptyTransportPayloadText, r as coerceTransportToolCallArguments, v as transportAbortError, w as createToolArgumentPreviewSchedule, x as parseJsonObjectPreservingUnsafeIntegers } from "./transport-stream-shared-B5RioB_Q.mjs";
import { n as providerReplayContextMatches, t as buildProviderReplayContext } from "./provider-replay-context-DPr3w20a.mjs";
import { i as tagPendingCommentaryText } from "./assistant-text-phase-C20rxWwP.mjs";
import { t as notifyLlmRequestActivity } from "./llm-request-activity-BjtkplhG.mjs";
//#region packages/ai/src/providers/anthropic-auth-headers.ts
/** Inspect resolved credential shape for auth routing without exposing its value. */
function isAnthropicOAuthApiKey(apiKey) {
	return typeof apiKey === "string" && getAiTransportHost().resolveSecretSentinel(apiKey).includes("sk-ant-oat");
}
function usesFoundryBearerAuth(model) {
	return model.provider === "microsoft-foundry" && (model.authHeader === true || hasBearerAuthorizationHeader(model.headers));
}
function hasBearerAuthorizationHeader(headers) {
	if (!headers) return false;
	return Object.entries(headers).some(([key, value]) => key.toLowerCase() === "authorization" && /^bearer\s+\S+/i.test(value.trim()));
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
//#endregion
//#region packages/ai/src/transports/anthropic-payload-policy.ts
/**
* Anthropic-family request payload policy helpers.
* Applies service-tier and cache-control markers only when provider endpoint
* capabilities allow them.
*/
const ANTHROPIC_CACHE_CONTROL_LIMIT = 4;
const ANTHROPIC_COMPACT_THRESHOLD_MIN = 5e4;
/** Resolve the Anthropic input-token trigger, including the API's minimum. */
function resolveAnthropicCompactThreshold(contextWindow, configured) {
	const configuredThreshold = parsePositiveInteger(configured);
	if (configuredThreshold !== void 0) return Math.max(ANTHROPIC_COMPACT_THRESHOLD_MIN, configuredThreshold);
	const resolvedContextWindow = parsePositiveInteger(contextWindow);
	return Math.max(ANTHROPIC_COMPACT_THRESHOLD_MIN, resolvedContextWindow === void 0 ? ANTHROPIC_COMPACT_THRESHOLD_MIN : Math.floor(resolvedContextWindow * .7));
}
/** Resolve the server-compaction gate and effective threshold for an Anthropic route. */
function resolveAnthropicServerCompactionPlan(model, extraParams, apiKey) {
	const enabled = extraParams?.anthropicServerCompaction === true && !isAnthropicOAuthApiKey(apiKey) && normalizeOptionalLowercaseString(model.api) === "anthropic-messages" && isDirectAnthropicModel(model);
	return {
		enabled,
		...enabled ? { threshold: resolveAnthropicCompactThreshold(model.contextWindow, extraParams?.anthropicCompactThreshold) } : {}
	};
}
function isDirectAnthropicModel(model) {
	const baseUrl = model.baseUrl?.trim() || process.env.ANTHROPIC_BASE_URL?.trim();
	const endpointModel = baseUrl === model.baseUrl ? model : {
		...model,
		baseUrl
	};
	const endpointClass = resolveProviderEndpoint(endpointModel).endpointClass;
	return normalizeOptionalLowercaseString(model.provider) === "anthropic" && (endpointClass === "anthropic-public" || endpointClass === "default" && (!baseUrl || resolveBaseUrlHostname(baseUrl) === "api.anthropic.com"));
}
function isAnthropicServerToolClearingEnabled(model, apiKey) {
	const resolvedApiKey = apiKey && getAiTransportHost().resolveSecretSentinel(apiKey);
	return Boolean(resolvedApiKey?.trim()) && !isAnthropicOAuthApiKey(resolvedApiKey) && normalizeOptionalLowercaseString(model.api) === "anthropic-messages" && isDirectAnthropicModel(model);
}
function resolveBaseUrlHostname(baseUrl) {
	try {
		return new URL(baseUrl).hostname;
	} catch {
		return;
	}
}
function isLongTtlEligibleEndpoint(baseUrl) {
	if (typeof baseUrl !== "string") return false;
	const hostname = resolveBaseUrlHostname(baseUrl);
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
function buildAnthropicSystemBlocks(systemPrompt, isOAuthToken, cacheControl, claudeCodeVersion = ANTHROPIC_CLAUDE_CODE_VERSION) {
	const blocks = systemPrompt ? [{
		type: "text",
		text: sanitizeSurrogates(systemPrompt)
	}] : [];
	if (cacheControl) applyAnthropicCacheControlToSystem(blocks, cacheControl);
	else stripAnthropicSystemPromptBoundary(blocks);
	if (systemPrompt && blocks.length === 0) blocks.push({
		type: "text",
		text: ""
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
	const usedMarkers = countAnthropicCacheControlMarkers(payload.system) + countAnthropicCacheControlMarkers(payload.tools);
	applyAnthropicCacheControlToMessages(payload.messages, cacheControl, ANTHROPIC_CACHE_CONTROL_LIMIT - usedMarkers, cacheBreakpointOptOutMessageIndexes);
}
function applyAnthropicCacheControlToSystem(system, cacheControl) {
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
		const text = stripSystemPromptRelocatableBoundary(blockText);
		record.text = text;
		const split = splitSystemPromptCacheBoundary(text);
		if (!split) {
			if (record.cache_control === void 0) record.cache_control = cacheControl;
			normalizedBlocks.push(record);
			continue;
		}
		const { cache_control: existingCacheControl, ...rest } = record;
		if (split.stablePrefix) normalizedBlocks.push({
			...rest,
			text: split.stablePrefix,
			cache_control: existingCacheControl ?? cacheControl
		});
		if (split.dynamicSuffix) normalizedBlocks.push({
			...rest,
			text: split.dynamicSuffix
		});
	}
	system.splice(0, system.length, ...normalizedBlocks);
}
function stripAnthropicSystemPromptBoundary(system) {
	if (!Array.isArray(system)) return;
	for (const block of system) {
		if (!block || typeof block !== "object") continue;
		const record = block;
		if (record.type === "text" && typeof record.text === "string") record.text = stripSystemPromptCacheBoundary(record.text);
	}
}
/** Apply one shared deepest-stable-message cache breakpoint policy. */
function applyAnthropicCacheControlToMessages(messages, cacheControl, markerLimit, cacheBreakpointOptOutMessageIndexes) {
	if (!Array.isArray(messages) || messages.length === 0 || markerLimit <= 0) return;
	let fallbackToolResult;
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages[i];
		if (!message || typeof message !== "object") continue;
		const record = message;
		if (record.role !== "user" || cacheBreakpointOptOutMessageIndexes.has(i)) continue;
		const content = record.content;
		if (typeof content === "string") {
			if (fallbackToolResult && markerLimit === 1) {
				fallbackToolResult.cache_control = cacheControl;
				return;
			}
			record.content = [{
				type: "text",
				text: content,
				cache_control: cacheControl
			}];
			if (fallbackToolResult && markerLimit > 1) fallbackToolResult.cache_control = cacheControl;
			return;
		}
		if (!Array.isArray(content)) continue;
		for (let j = content.length - 1; j >= 0; j--) {
			const block = content[j];
			if (!block || typeof block !== "object") continue;
			const blockRecord = block;
			if (blockRecord.type === "text" || blockRecord.type === "image") {
				if (fallbackToolResult && markerLimit === 1) {
					fallbackToolResult.cache_control = cacheControl;
					return;
				}
				blockRecord.cache_control = cacheControl;
				if (fallbackToolResult && markerLimit > 1) fallbackToolResult.cache_control = cacheControl;
				return;
			}
			if (blockRecord.type === "tool_result" && fallbackToolResult === void 0) fallbackToolResult = blockRecord;
		}
	}
	if (fallbackToolResult) fallbackToolResult.cache_control = cacheControl;
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
		compactThreshold: serverCompactionPlan.threshold ?? resolveAnthropicCompactThreshold(input.contextWindow, input.extraParams?.anthropicCompactThreshold),
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
		}
	});
	if (edits.length > 0) payload.context_management = { edits };
}
function applyAnthropicContextManagementToRequest(payload, model, options, directApiKeyBetaHeader) {
	if (directApiKeyBetaHeader === void 0 || !options?.cacheTtlPruning && !options?.anthropicServerCompaction) return;
	applyAnthropicContextManagementEdits(payload, resolveAnthropicPayloadPolicy({
		...model,
		api: "anthropic-messages",
		enableServerCompaction: true,
		extraParams: { ...options },
		cacheTtlPruning: options?.cacheTtlPruning
	}));
}
function resolveAnthropicContextManagementBetaHeader(payload, directApiKeyBetaHeader) {
	if (directApiKeyBetaHeader === void 0 || !isRecord(payload.context_management)) return directApiKeyBetaHeader;
	const edits = payload.context_management.edits;
	const betas = new Set(directApiKeyBetaHeader.split(",").map((beta) => beta.trim()).filter(Boolean));
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
	if (policy.cacheControl) applyAnthropicCacheControlToSystem(payloadObj.system, policy.cacheControl);
	else stripAnthropicSystemPromptBoundary(payloadObj.system);
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
//#endregion
//#region packages/ai/src/providers/anthropic-server-fallback.ts
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
//#endregion
//#region packages/ai/src/providers/anthropic-thinking-replay.ts
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
function asReplayMessage(value) {
	return value && typeof value === "object" ? value : void 0;
}
/**
* Anthropic tool results continue the preceding assistant turn. Preserve that
* turn's signed thinking even when the next request disables new thinking.
*/
function findActiveAnthropicToolTurnAssistantIndex(messages) {
	const toolResultIds = /* @__PURE__ */ new Set();
	let index = messages.length - 1;
	while (index >= 0) {
		const message = asReplayMessage(messages[index]);
		if (message?.role !== "toolResult") break;
		if (typeof message.toolCallId === "string") toolResultIds.add(message.toolCallId);
		index -= 1;
	}
	if (toolResultIds.size === 0) return -1;
	const assistant = asReplayMessage(messages[index]);
	if (assistant?.role !== "assistant" || !Array.isArray(assistant.content)) return -1;
	const toolCallIds = /* @__PURE__ */ new Set();
	for (const block of assistant.content) {
		if (!block || typeof block !== "object") continue;
		const record = block;
		if ((record.type === "toolCall" || record.type === "tool_use" || record.type === "function_call") && typeof record.id === "string") toolCallIds.add(record.id);
	}
	return [...toolResultIds].every((toolCallId) => toolCallIds.has(toolCallId)) ? index : -1;
}
//#endregion
//#region packages/ai/src/providers/anthropic-tool-projection.ts
const CLAUDE_CODE_TOOL_LOOKUP = new Map([
	"Read",
	"Write",
	"Edit",
	"Bash",
	"Grep",
	"Glob",
	"AskUserQuestion",
	"EnterPlanMode",
	"ExitPlanMode",
	"KillShell",
	"NotebookEdit",
	"Skill",
	"Task",
	"TaskOutput",
	"TodoWrite",
	"WebFetch",
	"WebSearch"
].map((name) => [name.toLowerCase(), name]));
/** Preserve Claude Code's canonical tool casing for subscription OAuth requests. */
function toClaudeCodeToolName(name) {
	return CLAUDE_CODE_TOOL_LOOKUP.get(name.toLowerCase()) ?? name;
}
/** Anthropic rejects forced tools while extended thinking is enabled. */
function normalizeAnthropicToolChoice(thinkingEnabled, toolChoice) {
	if (thinkingEnabled && (toolChoice === "any" || typeof toolChoice === "object" && toolChoice.type === "tool")) return { type: "auto" };
	return typeof toolChoice === "string" ? { type: toolChoice } : toolChoice;
}
/** Anthropic tool identifiers accept only ASCII word characters and dashes. */
function normalizeAnthropicToolCallId(id) {
	return id.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
}
function isProviderSupportedViolation(violation) {
	return violation.endsWith(".$dynamicRef") || violation.endsWith(".$dynamicAnchor");
}
const schemaValueKeywords = /* @__PURE__ */ new Set([
	"additionalProperties",
	"contains",
	"contentSchema",
	"else",
	"if",
	"items",
	"not",
	"propertyNames",
	"then",
	"unevaluatedItems",
	"unevaluatedProperties"
]);
const schemaArrayKeywords = /* @__PURE__ */ new Set([
	"allOf",
	"anyOf",
	"oneOf",
	"prefixItems"
]);
const schemaMapKeywords = /* @__PURE__ */ new Set([
	"$defs",
	"definitions",
	"dependencies",
	"dependentSchemas",
	"patternProperties",
	"properties"
]);
/** Normalize the detached JSON projection and report tuple changes to enclosing schemas. */
function normalizeAnthropicJsonSchema(schema) {
	if (!isRecord(schema)) return false;
	let changed = false;
	for (const [key, value] of Object.entries(schema)) {
		if (schemaValueKeywords.has(key) && !Array.isArray(value)) {
			changed = normalizeAnthropicJsonSchema(value) || changed;
			continue;
		}
		if (schemaArrayKeywords.has(key) && Array.isArray(value)) {
			for (const entry of value) changed = normalizeAnthropicJsonSchema(entry) || changed;
			continue;
		}
		if (schemaMapKeywords.has(key) && isRecord(value)) for (const entry of Object.values(value)) changed = normalizeAnthropicJsonSchema(entry) || changed;
	}
	if (Array.isArray(schema.items)) {
		for (const entry of schema.items) normalizeAnthropicJsonSchema(entry);
		schema.prefixItems = schema.items;
		const additionalItems = schema.additionalItems;
		if (typeof additionalItems === "boolean" || isRecord(additionalItems)) {
			normalizeAnthropicJsonSchema(additionalItems);
			schema.items = additionalItems;
		} else delete schema.items;
		delete schema.additionalItems;
		changed = true;
	}
	if (changed) delete schema.$schema;
	return changed;
}
/** Snapshots direct/custom tool descriptors before Anthropic payload construction. */
function projectAnthropicTools(tools, toWireName) {
	const projectedTools = [];
	const originalNameByWireName = /* @__PURE__ */ new Map();
	const unavailableOriginalNames = /* @__PURE__ */ new Set();
	for (const tool of tools) {
		let projectedTool;
		let originalName;
		try {
			const name = tool.name;
			originalName = name;
			if (!name) continue;
			const schemaProjection = projectRuntimeToolInputSchema(tool.parameters, `${name}.parameters`);
			if (!isRecord(schemaProjection.schema) || schemaProjection.violations.some((violation) => !isProviderSupportedViolation(violation))) {
				unavailableOriginalNames.add(name);
				continue;
			}
			const anthropicSchema = schemaProjection.schema;
			normalizeAnthropicJsonSchema(anthropicSchema);
			const properties = anthropicSchema.properties;
			const required = anthropicSchema.required;
			if (properties !== void 0 && properties !== null && !isRecord(properties) || required !== void 0 && required !== null && (!Array.isArray(required) || required.some((entry) => typeof entry !== "string"))) {
				unavailableOriginalNames.add(name);
				continue;
			}
			let description;
			try {
				description = typeof tool.description === "string" ? tool.description : void 0;
			} catch {}
			projectedTool = {
				originalName: name,
				wireName: toWireName(name),
				...description ? { description } : {},
				inputSchema: {
					...anthropicSchema,
					type: "object",
					properties: properties ?? {},
					required: required ?? []
				}
			};
		} catch {
			if (originalName) unavailableOriginalNames.add(originalName);
			continue;
		}
		const conflictingName = originalNameByWireName.get(projectedTool.wireName);
		if (conflictingName !== void 0 && conflictingName !== projectedTool.originalName) throw new Error(`Anthropic tool names "${conflictingName}" and "${projectedTool.originalName}" both map to "${projectedTool.wireName}"`);
		originalNameByWireName.set(projectedTool.wireName, projectedTool.originalName);
		projectedTools.push(projectedTool);
	}
	return {
		inputToolCount: tools.length,
		unavailableOriginalNames,
		tools: sortPromptCacheToolsByName(projectedTools)
	};
}
/** Keeps forced Anthropic tool choices aligned with the projected wire names. */
function reconcileAnthropicToolChoice(choice, projection) {
	if (projection.inputToolCount === 0) return choice;
	if (choice.type === "tool") {
		const requestedName = choice.name;
		const originalMatch = projection.tools.find((tool) => tool.originalName === requestedName);
		if (originalMatch) return {
			...choice,
			name: originalMatch.wireName
		};
		if (projection.unavailableOriginalNames.has(requestedName)) throw new Error(`Anthropic tool_choice requested unavailable tool "${requestedName}" after schema conversion`);
		const matchedTool = projection.tools.find((tool) => tool.wireName === requestedName);
		if (!matchedTool) throw new Error(`Anthropic tool_choice requested unavailable tool "${requestedName}" after schema conversion`);
		return {
			...choice,
			name: matchedTool.wireName
		};
	}
	if (projection.tools.length === 0) {
		if (choice.type === "auto") return;
		if (choice.type === "any") throw new Error("Anthropic tool_choice requires a tool, but no tools survived schema conversion");
	}
	return choice;
}
/** Maps Claude Code wire names without trusting every direct/custom descriptor. */
function resolveOriginalAnthropicToolName(name, projection) {
	return projection?.tools.find((tool) => tool.wireName === name)?.originalName ?? name;
}
//#endregion
//#region packages/ai/src/transports/anthropic-compaction-replay.ts
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
	if (state.v !== 1 || typeof state.data !== "string" || typeof state.provider !== "string" || typeof state.api !== "string" || typeof state.model !== "string" || typeof state.baseUrlHash !== "string" || state.sessionHash !== void 0 && typeof state.sessionHash !== "string" || state.authProfileHash !== void 0 && typeof state.authProfileHash !== "string") return false;
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
function suppressAnthropicCompaction(output, model, options) {
	const context = buildProviderReplayContext(model, options);
	if (!context.baseUrlHash) return;
	output.providerReplay = {
		v: 1,
		type: ANTHROPIC_COMPACTION_SUPPRESSION_TYPE,
		data: ANTHROPIC_COMPACTION_SUPPRESSION_DATA,
		...context,
		baseUrlHash: context.baseUrlHash
	};
}
function resolveNewestAnthropicCompaction(messages, model, options) {
	const context = buildProviderReplayContext(model, options);
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (message?.role !== "assistant") continue;
		const replayState = readAnthropicCompactionState(message.providerReplay);
		if (replayState?.type === ANTHROPIC_COMPACTION_SUPPRESSION_TYPE) {
			if (providerReplayContextMatches(replayState, context)) return;
			continue;
		}
		if (message.providerReplay?.type !== ANTHROPIC_COMPACTION_REPLAY_TYPE) continue;
		if (!replayState) return;
		if (!providerReplayContextMatches(replayState, context)) return;
		return {
			owner: message,
			replayIndex: replayState.replayIndex ?? 0,
			summary: replayState.data,
			...replayState.encryptedContent !== void 0 ? { encryptedContent: replayState.encryptedContent } : {}
		};
	}
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
//#endregion
//#region packages/ai/src/internal/anthropic-inline-images.ts
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
async function normalizeAnthropicInlineContent(content, budget) {
	if (!content.some((block) => block.type === "image")) return content.filter((block) => block.type === "text");
	const inputBytes = content.reduce((total, block) => block.type === "image" ? total + estimateBase64DecodedBytes(block.data) : total, 0);
	if (budget.totalBytes + inputBytes > ANTHROPIC_INLINE_IMAGES_DECODE_SAFETY_BYTES) throw new Error("Anthropic inline images exceed the 64 MB aggregate decoded safety limit.");
	const normalized = [];
	for (const block of content) {
		if (block.type !== "image") {
			normalized.push(block);
			continue;
		}
		const normalizedBlocks = await getAiTransportHost().normalizeAnthropicInlineContentBlocks([block]);
		const outputBytes = normalizedBlocks.reduce((total, normalizedBlock) => normalizedBlock.type === "image" ? total + estimateBase64DecodedBytes(normalizedBlock.data) : total, 0);
		if (budget.totalBytes + outputBytes > ANTHROPIC_INLINE_IMAGES_DECODE_SAFETY_BYTES) throw new Error("Anthropic inline images exceed the 64 MB aggregate decoded safety limit.");
		budget.totalBytes += outputBytes;
		normalized.push(...normalizedBlocks);
	}
	return normalized;
}
//#endregion
//#region packages/ai/src/transports/anthropic-messages.ts
const NON_VISION_USER_IMAGE_PLACEHOLDER = "(image omitted: model does not support images)";
async function convertContentBlocks(content, model, imageBudget, profile, isError) {
	const mediaPlaceholder = describeToolResultMediaPlaceholder(content);
	if (!((profile === "provider" || model.input.includes("image")) && content.some(isImageWithMediaPayload))) return sanitizeNonEmptyTransportPayloadText(extractToolResultText(content), mediaPlaceholder ?? (profile === "transport" ? "(no output)" : isError ? "[tool error with no output]" : ""));
	const blocks = [];
	let hasTextBlock = false;
	for (const block of content) {
		const record = asOptionalObjectRecord(block);
		if (!record) continue;
		const blockText = extractToolResultBlockText(block);
		if (blockText) {
			blocks.push({
				type: "text",
				text: sanitizeTransportPayloadText(blockText)
			});
			hasTextBlock = true;
		}
		if (!isImageWithMediaPayload(record)) continue;
		const [normalizedImage] = await normalizeAnthropicInlineContent([{
			type: "image",
			data: typeof record.data === "string" ? record.data : "",
			mimeType: typeof record.mimeType === "string" ? record.mimeType : profile === "provider" ? "image/jpeg" : "image/png"
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
	if (!hasTextBlock) blocks.unshift({
		type: "text",
		text: mediaPlaceholder ?? "(see attached image)"
	});
	return blocks;
}
async function convertAnthropicMessages(transformedMessages, model, isOAuthToken, options) {
	const params = [];
	const retainRuntimeContext = bindsClaudeThinkingPrefix(model);
	const imageBudget = createAnthropicInlineImageBudget();
	const allowReasoningContentReplay = options.allowReasoningContentReplay === true;
	const replayThinkingEnabled = options.replayThinkingEnabled !== false;
	const managed = options.profile === "transport";
	const activeToolTurnAssistantIndex = replayThinkingEnabled ? -1 : findActiveAnthropicToolTurnAssistantIndex(transformedMessages);
	for (let i = 0; i < transformedMessages.length; i += 1) {
		const msg = transformedMessages[i];
		if (!msg) continue;
		if (msg.role === "user") {
			if (typeof msg.content === "string") {
				if (msg.content.trim().length > 0) {
					if (msg.runtimeContextCarrier && !retainRuntimeContext) options.cacheBreakpointOptOutMessageIndexes?.add(params.length);
					const userParam = {
						role: "user",
						content: sanitizeTransportPayloadText(msg.content)
					};
					params.push(userParam);
				}
				continue;
			}
			const blocks = (!managed || model.input.includes("image") ? await normalizeAnthropicInlineContent(msg.content, imageBudget) : msg.content.map((item) => item.type === "image" ? {
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
			});
			let filteredBlocks = !managed || model.input.includes("image") ? blocks : blocks.filter((block) => block.type !== "image");
			filteredBlocks = filteredBlocks.filter((block) => block.type !== "text" || block.text.trim().length > 0);
			if (filteredBlocks.length === 0) continue;
			if (msg.runtimeContextCarrier && !retainRuntimeContext) options.cacheBreakpointOptOutMessageIndexes?.add(params.length);
			const userParam = {
				role: "user",
				content: filteredBlocks
			};
			params.push(userParam);
			continue;
		}
		if (msg.role === "assistant") {
			const blocks = i === 0 && options.compaction ? [options.compaction] : [];
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
					if (!thinkingSignature && !options.allowEmptySignature) blocks.push({
						type: "text",
						text: sanitizeTransportPayloadText(block.thinking)
					});
					else {
						const thinking = thinkingSignature === "reasoning_content" ? sanitizeTransportPayloadText(block.thinking) : block.thinking;
						if (thinkingSignature === "reasoning_content") {
							if (allowReasoningContentReplay) {
								blocks.push({
									type: "thinking",
									thinking,
									signature: thinkingSignature ?? ""
								});
								reasoningContent.push(thinking);
							}
							continue;
						}
						blocks.push({
							type: "thinking",
							thinking,
							signature: thinkingSignature ?? ""
						});
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
				params.push(assistantMsg);
			}
			continue;
		}
		if (msg.role === "toolResult") {
			const toolResults = [];
			let j = i;
			while (j < transformedMessages.length) {
				const nextMsg = transformedMessages.at(j);
				if (nextMsg?.role !== "toolResult") break;
				toolResults.push({
					type: "tool_result",
					tool_use_id: nextMsg.toolCallId,
					content: await convertContentBlocks(nextMsg.content, model, imageBudget, options.profile, nextMsg.isError),
					is_error: nextMsg.isError
				});
				j += 1;
			}
			i = j - 1;
			params.push({
				role: "user",
				content: toolResults
			});
		}
	}
	return params;
}
/** Shared generation contract, after each entry point resolves its defaults and tool policy. */
function buildAnthropicGenerationParams({ model, options, tools, toolProjection, profile }) {
	const params = {};
	const mandatoryAdaptiveThinking = requiresClaudeAdaptiveThinking(model);
	if (options?.temperature !== void 0 && !options?.thinkingEnabled && !supportsClaudeNativeXhighEffort(model)) params.temperature = options.temperature;
	if (options?.stop !== void 0 && options.stop.length > 0) params.stop_sequences = options.stop;
	if (tools && tools.length > 0) params.tools = tools;
	if (mandatoryAdaptiveThinking || model.reasoning || supportsClaudeAdaptiveThinking(model)) {
		if (mandatoryAdaptiveThinking || options?.thinkingEnabled) {
			const display = options?.thinkingDisplay ?? "summarized";
			if (supportsClaudeAdaptiveThinking(model)) {
				params.thinking = {
					type: "adaptive",
					display
				};
				const effort = options?.effort ?? (mandatoryAdaptiveThinking ? resolveAnthropicThinkingEffort(model, void 0) : void 0);
				if (effort) params.output_config = { effort };
			} else params.thinking = {
				type: "enabled",
				budget_tokens: options?.thinkingBudgetTokens ?? 1024,
				...profile === "provider" ? { display } : {}
			};
		} else if (options?.thinkingEnabled === false) params.thinking = { type: "disabled" };
	}
	if (options?.metadata) {
		const userId = options.metadata.user_id;
		if (typeof userId === "string") params.metadata = { user_id: userId };
	}
	if (options?.toolChoice) {
		const normalizedToolChoice = normalizeAnthropicToolChoice(mandatoryAdaptiveThinking || options?.thinkingEnabled === true, options.toolChoice);
		const projectedToolChoice = toolProjection ? reconcileAnthropicToolChoice(normalizedToolChoice, toolProjection) : normalizedToolChoice;
		if (projectedToolChoice) params.tool_choice = projectedToolChoice;
	}
	return params;
}
function convertAnthropicTools(tools, isOAuthTokenLocal, supportsEagerToolInputStreaming = false) {
	const projection = projectAnthropicTools(tools, (name) => isOAuthTokenLocal ? toClaudeCodeToolName(name) : name);
	const convertedTools = [];
	for (const tool of projection.tools) {
		const convertedTool = {
			name: tool.wireName,
			description: tool.description,
			input_schema: tool.inputSchema
		};
		if (supportsEagerToolInputStreaming) convertedTool.eager_input_streaming = true;
		convertedTools.push(convertedTool);
	}
	return {
		projection,
		tools: convertedTools
	};
}
//#endregion
//#region packages/ai/src/providers/anthropic-refusal.ts
function readAnthropicRefusalDetails(value) {
	if (!value || typeof value !== "object") return {
		category: null,
		explanation: null
	};
	const details = value;
	return {
		category: normalizeNullableString(details.category),
		explanation: normalizeNullableString(details.explanation)
	};
}
function formatAnthropicRefusalMessage(details) {
	return `Anthropic refusal${details.category ? ` (category: ${details.category})` : ""}${details.explanation ? `: ${details.explanation}` : "."}`;
}
function applyAnthropicRefusal(output, stopDetails, provider) {
	const details = readAnthropicRefusalDetails(stopDetails);
	output.stopReason = "error";
	output.errorMessage = formatAnthropicRefusalMessage(details);
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
//#endregion
//#region packages/ai/src/providers/anthropic-usage.ts
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
	const iteration = usage.iterations.at(-1);
	if (!iteration || typeof iteration !== "object" || Array.isArray(iteration)) return { state: "invalid" };
	const record = iteration;
	const input = readAnthropicUsageTokenCount(record.input_tokens);
	const cacheRead = readAnthropicUsageTokenCount(record.cache_read_input_tokens);
	const cacheWrite = readAnthropicUsageTokenCount(record.cache_creation_input_tokens);
	const outputTokens = readAnthropicUsageTokenCount(record.output_tokens);
	if (input === void 0 || cacheRead === void 0 || cacheWrite === void 0 || outputTokens === void 0) return { state: "invalid" };
	const contextPromptTokens = input + cacheRead + cacheWrite;
	return {
		state: "valid",
		usage: {
			contextPromptTokens,
			totalTokens: contextPromptTokens + outputTokens
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
		cacheWrite: 0,
		cacheWrite1h: 0
	};
	for (const iteration of iterations) {
		if (!iteration || typeof iteration !== "object" || Array.isArray(iteration)) return;
		const record = iteration;
		const input = readAnthropicUsageTokenCount(record.input_tokens);
		const output = readAnthropicUsageTokenCount(record.output_tokens);
		const cacheRead = readAnthropicUsageTokenCount(record.cache_read_input_tokens);
		const cacheWrite = readAnthropicUsageTokenCount(record.cache_creation_input_tokens);
		if (input === void 0 || output === void 0 || cacheRead === void 0 || cacheWrite === void 0) return;
		sawCompaction ||= record.type === "compaction";
		billed.input += input;
		billed.output += output;
		billed.cacheRead += cacheRead;
		billed.cacheWrite += cacheWrite;
		billed.cacheWrite1h += readAnthropicCacheWriteUsage(record).cacheWrite1h ?? 0;
	}
	return sawCompaction ? billed : void 0;
}
/** Record independent billing buckets without treating zero placeholders as context proof. */
function applyAnthropicMessageStartUsage(target, payload) {
	const promptUsage = readAnthropicPromptUsageSnapshot(payload);
	const promptTokens = promptUsage ? promptUsage.input + promptUsage.cacheRead + promptUsage.cacheWrite : 0;
	const inputTokens = readAnthropicUsageTokenCount(payload.input_tokens);
	if (inputTokens !== void 0) target.input = inputTokens;
	const outputTokens = readAnthropicUsageTokenCount(payload.output_tokens);
	if (outputTokens !== void 0) target.output = outputTokens;
	const cacheReadTokens = payload.cache_read_input_tokens == null ? 0 : readAnthropicUsageTokenCount(payload.cache_read_input_tokens);
	if (cacheReadTokens !== void 0) target.cacheRead = cacheReadTokens;
	const cacheWriteTokens = payload.cache_creation_input_tokens == null ? 0 : readAnthropicUsageTokenCount(payload.cache_creation_input_tokens);
	if (cacheWriteTokens !== void 0) target.cacheWrite = cacheWriteTokens;
	const { cacheWrite1h } = readAnthropicCacheWriteUsage(payload);
	if (cacheWrite1h !== void 0) target.cacheWrite1h = cacheWrite1h;
	target.totalTokens = target.input + target.output + target.cacheRead + target.cacheWrite;
	if (promptTokens > 0 && outputTokens !== void 0) target.contextUsage = {
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
	const inputTokens = readAnthropicUsageTokenCount(usage.input_tokens);
	const outputTokens = readAnthropicUsageTokenCount(usage.output_tokens);
	const cacheReadTokens = readAnthropicUsageTokenCount(usage.cache_read_input_tokens);
	const cacheWriteTokens = readAnthropicUsageTokenCount(usage.cache_creation_input_tokens);
	const resolved = billedIterations ?? {
		input: inputTokens,
		output: outputTokens,
		cacheRead: cacheReadTokens,
		cacheWrite: cacheWriteTokens,
		cacheWrite1h: readAnthropicCacheWriteUsage(usage).cacheWrite1h
	};
	if (resolved.input !== void 0) target.input = resolved.input;
	if (resolved.output !== void 0) target.output = resolved.output;
	if (resolved.cacheRead !== void 0) target.cacheRead = resolved.cacheRead;
	if (resolved.cacheWrite !== void 0) target.cacheWrite = resolved.cacheWrite;
	if (resolved.cacheWrite1h !== void 0) target.cacheWrite1h = resolved.cacheWrite1h;
	target.totalTokens = target.input + target.output + target.cacheRead + target.cacheWrite;
	const iterationUsage = readLastAnthropicIterationUsage(usage);
	if (iterationUsage.state === "valid") target.contextUsage = {
		state: "available",
		promptTokens: iterationUsage.usage.contextPromptTokens,
		totalTokens: iterationUsage.usage.totalTokens
	};
	else if (iterationUsage.state === "invalid") target.contextUsage = { state: "unavailable" };
	else if (outputTokens !== void 0 && (messageStartPromptUsage !== void 0 || (cacheReadTokens !== void 0 || cacheWriteTokens !== void 0) && readAnthropicPromptUsageSnapshot(usage) !== void 0)) {
		const promptTokens = target.input + target.cacheRead + target.cacheWrite;
		target.contextUsage = {
			state: "available",
			promptTokens,
			totalTokens: promptTokens + target.output
		};
	} else target.contextUsage = { state: "unavailable" };
}
//#endregion
//#region packages/ai/src/transports/anthropic-stream-reducer.ts
/** One Messages protocol reducer; entry points retain their established preview/replay contracts. */
async function consumeAnthropicStream(params) {
	const { model, options, output, stream, refusalBuffer, isOAuthToken, toolProjection } = params;
	const managed = params.profile === "transport";
	const eventSink = refusalBuffer ?? stream;
	let costModel = model;
	let messageStartPromptUsage;
	let inputTransformations;
	const anthropicStream = params.events;
	try {
		const blocks = output.content;
		const blockIndexes = /* @__PURE__ */ new Map();
		const toolArgumentPreviewSchedules = /* @__PURE__ */ new WeakMap();
		const seededToolArguments = /* @__PURE__ */ new WeakMap();
		const sealedToolCalls = [];
		const compactionCapture = createCompactionCapture(output, model, options);
		const pendingThinkingSignatures = /* @__PURE__ */ new Map();
		const allowReasoningContentReplay = managed && resolveProviderEndpoint(model).endpointClass === "xiaomi-native";
		const reasoningContentThinkingBlocks = /* @__PURE__ */ new Map();
		const reasoningContentTextBlocks = /* @__PURE__ */ new Map();
		let sawMessageStart = false;
		let sawMessageStop = false;
		let sawStopReason = false;
		const pendingTextEnds = [];
		const flushPendingTextEnds = () => {
			for (const event of pendingTextEnds) eventSink.push(event);
			pendingTextEnds.length = 0;
		};
		const emitTextEnd = (event) => {
			if (managed) pendingTextEnds.push(event);
			else eventSink.push(event);
		};
		const eventIndexKey = (eventIndex) => typeof eventIndex === "number" ? eventIndex : -1;
		const appendReasoningContentThinkingDelta = (eventIndex, rawText) => {
			if (typeof rawText !== "string") return false;
			const text = sanitizeTransportPayloadText(rawText);
			if (text.length === 0) return false;
			const key = eventIndexKey(eventIndex);
			let contentIndex = reasoningContentThinkingBlocks.get(key);
			let block = contentIndex === void 0 ? void 0 : blocks[contentIndex];
			if (!block || block.type !== "thinking") {
				block = {
					type: "thinking",
					thinking: "",
					thinkingSignature: "reasoning_content"
				};
				output.content.push(block);
				contentIndex = output.content.length - 1;
				reasoningContentThinkingBlocks.set(key, contentIndex);
				eventSink.push({
					type: "thinking_start",
					contentIndex,
					partial: output
				});
			}
			if (contentIndex === void 0) return false;
			appendAssistantThinking(block, text);
			block.thinkingSignature = "reasoning_content";
			eventSink.push({
				type: "thinking_delta",
				contentIndex,
				delta: text,
				partial: output
			});
			return true;
		};
		const appendReasoningContentTextDelta = (eventIndex, rawText) => {
			if (typeof rawText !== "string") return false;
			const text = sanitizeTransportPayloadText(rawText);
			if (text.length === 0) return false;
			const key = eventIndexKey(eventIndex);
			let contentIndex = reasoningContentTextBlocks.get(key);
			let block = contentIndex === void 0 ? void 0 : blocks[contentIndex];
			if (!block || block.type !== "text") {
				block = {
					type: "text",
					text: ""
				};
				output.content.push(block);
				contentIndex = output.content.length - 1;
				reasoningContentTextBlocks.set(key, contentIndex);
				eventSink.push({
					type: "text_start",
					contentIndex,
					partial: output
				});
			}
			if (contentIndex === void 0) return false;
			block.text += text;
			eventSink.push({
				type: "text_delta",
				contentIndex,
				delta: text,
				partial: output
			});
			return true;
		};
		const finishReasoningContentSidecars = (eventIndex) => {
			const key = eventIndexKey(eventIndex);
			const thinkingContentIndex = reasoningContentThinkingBlocks.get(key);
			if (thinkingContentIndex !== void 0) {
				reasoningContentThinkingBlocks.delete(key);
				const block = output.content[thinkingContentIndex];
				if (block?.type === "thinking") eventSink.push({
					type: "thinking_end",
					contentIndex: thinkingContentIndex,
					content: block.thinking,
					partial: output
				});
			}
			const textContentIndex = reasoningContentTextBlocks.get(key);
			if (textContentIndex === void 0) return;
			reasoningContentTextBlocks.delete(key);
			const block = output.content[textContentIndex];
			if (block?.type === "text") eventSink.push({
				type: "text_end",
				contentIndex: textContentIndex,
				content: block.text,
				partial: output
			});
		};
		for await (const rawEvent of anthropicStream) {
			const event = asRecord(rawEvent);
			inputTransformations = readAnthropicInputTransformations(event) ?? inputTransformations;
			if (managed) notifyLlmRequestActivity(options.signal);
			if (event.type === "error") {
				const error = asOptionalObjectRecord(event.error);
				throw new Error(readStringField(error, "message") || "Anthropic Messages stream failed");
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
				if (options.anthropicServerCompaction === true && compactionCapture.begin(index, contentBlock, output.content.length)) continue;
				const fallbackBoundary = refusalBuffer ? readAnthropicFallbackBoundary(contentBlock) : null;
				if (fallbackBoundary) {
					refusalBuffer?.discard();
					sealedToolCalls.length = 0;
					pendingTextEnds.length = 0;
					blockIndexes.clear();
					pendingThinkingSignatures.clear();
					applyAnthropicFallbackBoundary({
						output,
						boundary: fallbackBoundary,
						provider: model.provider
					});
					costModel = {
						...model,
						cost: resolveAnthropicFallbackServingModelCost({
							requestedModelId: model.id,
							servingModelId: fallbackBoundary.toModel,
							requestedCost: model.cost
						})
					};
					calculateCost(costModel, output.usage);
					eventSink.push({
						type: "start",
						partial: output
					});
					for (const [i, block] of blocks.entries()) {
						if (block.type !== "text") continue;
						delete block.index;
						eventSink.push({
							type: "text_start",
							contentIndex: i,
							partial: output
						});
						if (block.text) eventSink.push({
							type: "text_delta",
							contentIndex: i,
							delta: block.text,
							partial: output
						});
						emitTextEnd({
							type: "text_end",
							contentIndex: i,
							content: block.text,
							partial: output
						});
					}
					continue;
				}
				pendingThinkingSignatures.delete(index);
				if (contentBlock?.type === "text") {
					const text = typeof contentBlock.text === "string" ? sanitizeTransportPayloadText(contentBlock.text) : "";
					const block = {
						type: "text",
						text,
						index
					};
					output.content.push(block);
					const contentIndex = output.content.length - 1;
					blockIndexes.set(index, contentIndex);
					eventSink.push({
						type: "text_start",
						contentIndex,
						partial: output
					});
					if (text.length > 0) eventSink.push({
						type: "text_delta",
						contentIndex,
						delta: text,
						partial: output
					});
					continue;
				}
				if (contentBlock?.type === "thinking") {
					const thinking = typeof contentBlock.thinking === "string" ? contentBlock.thinking : "";
					const block = {
						type: "thinking",
						thinking,
						thinkingSignature: typeof contentBlock.signature === "string" ? contentBlock.signature : "",
						index
					};
					output.content.push(block);
					const contentIndex = output.content.length - 1;
					blockIndexes.set(index, contentIndex);
					eventSink.push({
						type: "thinking_start",
						contentIndex,
						partial: output
					});
					if (thinking.length > 0) eventSink.push({
						type: "thinking_delta",
						contentIndex,
						delta: thinking,
						partial: output
					});
					continue;
				}
				if (contentBlock?.type === "redacted_thinking") {
					const block = {
						type: "thinking",
						thinking: "[Reasoning redacted]",
						thinkingSignature: typeof contentBlock.data === "string" ? contentBlock.data : "",
						redacted: true,
						index
					};
					output.content.push(block);
					blockIndexes.set(index, output.content.length - 1);
					eventSink.push({
						type: "thinking_start",
						contentIndex: output.content.length - 1,
						partial: output
					});
					continue;
				}
				if (contentBlock?.type === "tool_use") {
					if (managed) tagPendingCommentaryText(output.content);
					flushPendingTextEnds();
					const block = {
						type: "toolCall",
						id: typeof contentBlock.id === "string" ? contentBlock.id : "",
						name: typeof contentBlock.name === "string" ? isOAuthToken ? resolveOriginalAnthropicToolName(contentBlock.name, toolProjection) : contentBlock.name : "",
						arguments: asRecord(contentBlock.input),
						partialJson: "",
						index
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
					const appendedThinking = appendReasoningContentThinkingDelta(event.index, delta?.reasoning_content);
					const hasNativeAnthropicDelta = delta?.type === "text_delta" && typeof delta.text === "string" || delta?.type === "thinking_delta" && typeof delta.thinking === "string" || delta?.type === "input_json_delta" && typeof delta.partial_json === "string" || delta?.type === "signature_delta" && typeof delta.signature === "string";
					let appendedContent = false;
					if (!hasNativeAnthropicDelta && typeof delta?.content === "string" && delta.content.length > 0) {
						const text = sanitizeTransportPayloadText(delta.content);
						if (text.length > 0) {
							if (block?.type === "text" && index !== void 0) {
								block.text += text;
								eventSink.push({
									type: "text_delta",
									contentIndex: index,
									delta: text,
									partial: output
								});
								appendedContent = true;
							} else appendedContent = appendReasoningContentTextDelta(event.index, text);
						}
					}
					if ((appendedThinking || appendedContent) && !hasNativeAnthropicDelta) continue;
				}
				if (managed && !block && delta?.type === "text_delta" && typeof delta.text === "string") {
					block = {
						type: "text",
						text: "",
						index: typeof event.index === "number" ? event.index : blocks.length
					};
					output.content.push(block);
					index = output.content.length - 1;
					if (typeof event.index === "number") blockIndexes.set(event.index, index);
					eventSink.push({
						type: "text_start",
						contentIndex: index,
						partial: output
					});
				}
				if (index === void 0) continue;
				if (block?.type === "text" && delta?.type === "text_delta" && typeof delta.text === "string") {
					block.text += delta.text;
					eventSink.push({
						type: "text_delta",
						contentIndex: index,
						delta: delta.text,
						partial: output
					});
					continue;
				}
				if (block?.type === "thinking" && delta?.type === "thinking_delta" && typeof delta.thinking === "string") {
					appendAssistantThinking(block, delta.thinking);
					eventSink.push({
						type: "thinking_delta",
						contentIndex: index,
						delta: delta.thinking,
						partial: output
					});
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
				delete block.index;
				if (block.type === "text") {
					emitTextEnd({
						type: "text_end",
						contentIndex: index,
						content: block.text,
						partial: output
					});
					finishReasoningContentSidecars(event.index);
					continue;
				}
				if (block.type === "thinking") {
					if (pendingSignature !== void 0) block.thinkingSignature = pendingSignature;
					eventSink.push({
						type: "thinking_end",
						contentIndex: index,
						content: block.thinking,
						partial: output
					});
					finishReasoningContentSidecars(event.index);
					continue;
				}
				if (block.type === "toolCall") {
					sealedToolCalls.push({
						block,
						contentIndex: index
					});
					finishReasoningContentSidecars(event.index);
				}
				continue;
			}
			if (event.type === "message_delta") {
				logAnthropicContextEdits(event);
				const delta = asOptionalObjectRecord(event.delta);
				const usage = asOptionalObjectRecord(event.usage);
				if (typeof delta?.stop_reason === "string" && delta.stop_reason) {
					sawStopReason = true;
					if (delta.stop_reason === "refusal") applyAnthropicRefusal(output, delta.stop_details, model.provider);
					else output.stopReason = mapAnthropicStopReason(delta.stop_reason);
				}
				applyAnthropicMessageDeltaUsage(output.usage, usage, messageStartPromptUsage);
				calculateCost(costModel, output.usage);
				if (managed && (output.stopReason === "toolUse" || output.content.some((block) => block.type === "toolCall"))) tagPendingCommentaryText(output.content);
				flushPendingTextEnds();
			}
		}
		if ((isDirectAnthropicModel(model) || !managed && refusalBuffer) && !sawMessageStop) throw new Error("Anthropic stream ended before message_stop");
		if (options.signal?.aborted) throw transportAbortError(options.signal);
		if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error(output.errorMessage ?? "An unknown error occurred");
		if ([...blockIndexes.values()].some((index) => blocks[index]?.type === "toolCall")) throw new Error("Provider completed stream with an incomplete tool call");
		if ((sawMessageStart || blocks.length > 0) && !sawMessageStop && !sawStopReason) throw new Error("Anthropic stream ended before a terminal event");
		finalizeTerminalToolCallArguments(sealedToolCalls.map(({ block }) => block), (block) => block.partialJson && block.partialJson.length > 0 ? block.partialJson : seededToolArguments.get(block), void 0, { repairStringLiterals: true });
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
		if (managed && (output.stopReason === "toolUse" || output.content.some((block) => block.type === "toolCall"))) tagPendingCommentaryText(output.content);
		flushPendingTextEnds();
	} finally {
		logAnthropicThinkingDrops(inputTransformations);
	}
}
//#endregion
export { applyAnthropicFallbackBoundary as A, logAnthropicContextEdits as B, applyAnthropicThinkingBindingControls as C, ANTHROPIC_SERVER_SIDE_FALLBACKS as D, readAnthropicInputTransformations as E, applyAnthropicPayloadPolicyToParams as F, resolveAnthropicServerCompactionPlan as G, resolveAnthropicContextManagementBetaHeader as H, applyAnthropicRequestCacheControl as I, usesFoundryBearerAuth as J, isAnthropicOAuthApiKey as K, buildAnthropicSystemBlocks as L, resolveAnthropicFallbackServingModelCost as M, applyAnthropicContextManagementToRequest as N, ANTHROPIC_SERVER_SIDE_FALLBACK_BETA as O, applyAnthropicEphemeralCacheControlMarkers as P, isAnthropicServerToolClearingEnabled as R, ANTHROPIC_OMITTED_REASONING_TEXT as S, logAnthropicThinkingDrops as T, resolveAnthropicEphemeralCacheControl as U, resolveAnthropicCacheOptions as V, resolveAnthropicPayloadPolicy as W, normalizeAnthropicToolChoice as _, readAnthropicPromptUsageSnapshot as a, resolveOriginalAnthropicToolName as b, applyAnthropicRefusal as c, convertAnthropicTools as d, buildAnthropicReplayPlan as f, normalizeAnthropicToolCallId as g, suppressAnthropicCompaction as h, readAnthropicCacheWriteUsage as i, readAnthropicFallbackBoundary as j, CLAUDE_OPUS_FALLBACK_MODEL_COST as k, buildAnthropicGenerationParams as l, resolveNewestAnthropicCompaction as m, applyAnthropicMessageDeltaUsage as n, readAnthropicUsageTokenCount as o, isAnthropicReplayRejection as p, omitFoundryBearerCredentialHeaders as q, applyAnthropicMessageStartUsage as r, readLastAnthropicIterationUsage as s, consumeAnthropicStream as t, convertAnthropicMessages as u, projectAnthropicTools as v, findActiveAnthropicToolTurnAssistantIndex as w, toClaudeCodeToolName as x, reconcileAnthropicToolChoice as y, isDirectAnthropicModel as z };
