import { r as resolveProviderRequestCapabilities } from "./provider-attribution-8gdGyO--.js";
import { a as stripSystemPromptCacheBoundary, i as splitSystemPromptCacheBoundary } from "./system-prompt-cache-boundary-ewprF4Mn.js";
//#region src/agents/anthropic-payload-policy.ts
/**
* Anthropic-family request payload policy helpers.
* Applies service-tier and cache-control markers only when provider endpoint
* capabilities allow them.
*/
const ANTHROPIC_CACHE_CONTROL_LIMIT = 4;
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
	return hostname === "api.anthropic.com" || hostname === "aiplatform.googleapis.com" || hostname.endsWith("-aiplatform.googleapis.com");
}
/** Resolve Anthropic cache-control marker retention for a request endpoint. */
function resolveAnthropicEphemeralCacheControl(baseUrl, cacheRetention) {
	const retention = cacheRetention ?? (process.env.OPENCLAW_CACHE_RETENTION === "long" ? "long" : "short");
	if (retention === "none") return;
	const ttl = retention === "long" && (cacheRetention === "long" || isLongTtlEligibleEndpoint(baseUrl)) ? "1h" : void 0;
	return {
		type: "ephemeral",
		...ttl ? { ttl } : {}
	};
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
		if (record.type !== "text" || typeof record.text !== "string") {
			normalizedBlocks.push(block);
			continue;
		}
		const split = splitSystemPromptCacheBoundary(record.text);
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
function applyAnthropicCacheControlToMessages(messages, cacheControl, markerLimit) {
	if (!Array.isArray(messages) || messages.length === 0 || markerLimit <= 0) return;
	let fallbackToolResult;
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages[i];
		if (!message || typeof message !== "object") continue;
		const record = message;
		if (record.role !== "user") continue;
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
function resolveAnthropicPayloadPolicy(input) {
	return {
		allowsServiceTier: resolveProviderRequestCapabilities({
			provider: input.provider,
			api: input.api,
			baseUrl: input.baseUrl,
			capability: "llm",
			transport: "stream"
		}).allowsAnthropicServiceTier,
		cacheControl: input.enableCacheControl === true ? resolveAnthropicEphemeralCacheControl(input.baseUrl, input.cacheRetention) : void 0,
		serviceTier: input.serviceTier
	};
}
/** @deprecated Anthropic-family provider payload helper; do not use from third-party plugins. */
function applyAnthropicPayloadPolicyToParams(payloadObj, policy) {
	if (policy.allowsServiceTier && policy.serviceTier !== void 0 && payloadObj.service_tier === void 0) payloadObj.service_tier = policy.serviceTier;
	if (policy.cacheControl) applyAnthropicCacheControlToSystem(payloadObj.system, policy.cacheControl);
	else stripAnthropicSystemPromptBoundary(payloadObj.system);
	if (!policy.cacheControl) return;
	const usedMarkers = countAnthropicCacheControlMarkers(payloadObj.system) + countAnthropicCacheControlMarkers(payloadObj.tools);
	applyAnthropicCacheControlToMessages(payloadObj.messages, policy.cacheControl, ANTHROPIC_CACHE_CONTROL_LIMIT - usedMarkers);
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
export { resolveAnthropicPayloadPolicy as i, applyAnthropicPayloadPolicyToParams as n, resolveAnthropicEphemeralCacheControl as r, applyAnthropicEphemeralCacheControlMarkers as t };
