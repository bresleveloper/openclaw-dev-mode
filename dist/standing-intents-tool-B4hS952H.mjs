import { t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
import "./memory-core-host-runtime-core-C8uEsC2w.mjs";
import { c as encodeStandingIntentChannelScope, d as listStandingIntents, l as encodeStandingIntentSenderScope, n as DEFAULT_INTENT_EXPIRY_MS, o as cancelStandingIntent, s as createStandingIntent, t as DEFAULT_INTENT_COOLDOWN_SECONDS } from "./standing-intents-CXVawB0D.mjs";
//#region extensions/memory-core/src/standing-intents-tool.ts
const INTENT_DESCRIPTION_MAX_CHARS = 500;
const INTENT_KEYWORD_MAX_COUNT = 24;
const INTENT_KEYWORD_MAX_CHARS = 120;
const STANDING_INTENT_AUTOMATION_GUIDANCE = "The system injects the reminder automatically when it triggers. Do not deliver it early or cancel it unless the user asks.";
const STANDING_INTENT_SCOPE_GUIDANCE = "Use \"channel\" (the default) for any \"whenever I mention X\" request. Use \"conversation\" only when the user explicitly limits the reminder to the current thread. Use \"anywhere\" when the user asks for it everywhere.";
function trimRequiredString(value, field, maxChars) {
	if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
	const trimmed = value.trim();
	if (trimmed.length > maxChars) throw new Error(`${field} must be at most ${maxChars} characters`);
	return trimmed;
}
function renderArmedIntentMessage(scope) {
	return `Intent is armed ${scope === "channel" ? "for this channel" : scope === "conversation" ? "for this conversation" : "everywhere"}. ${STANDING_INTENT_AUTOMATION_GUIDANCE}`;
}
function positiveInteger(value, field, fallback) {
	if (value === void 0) return fallback;
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) throw new Error(`${field} must be a positive integer`);
	return value;
}
function nonNegativeInteger(value, field, fallback) {
	if (value === void 0) return fallback;
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new Error(`${field} must be a non-negative integer`);
	return value;
}
function normalizeKeywords(value) {
	if (!Array.isArray(value) || value.length === 0) throw new Error("triggerKeywords must be a non-empty string array");
	const normalized = value.map((entry) => trimRequiredString(entry, "triggerKeywords entry", INTENT_KEYWORD_MAX_CHARS).toLowerCase());
	const unique = [...new Set(normalized)];
	if (unique.length > INTENT_KEYWORD_MAX_COUNT) throw new Error(`triggerKeywords must contain at most ${INTENT_KEYWORD_MAX_COUNT} entries`);
	return unique;
}
function parseExpiry(value, nowMs) {
	if (value === void 0) return nowMs + DEFAULT_INTENT_EXPIRY_MS;
	if (typeof value !== "string") throw new Error("expiresAt must be an ISO 8601 timestamp");
	const parsed = Date.parse(value);
	if (!Number.isFinite(parsed) || parsed <= nowMs) throw new Error("expiresAt must be a future ISO 8601 timestamp");
	return parsed;
}
function parseStatus(value) {
	if (value === void 0) return;
	const statuses = [
		"pending",
		"armed",
		"fired",
		"done",
		"cancelled",
		"expired"
	];
	if (typeof value !== "string" || !statuses.includes(value)) throw new Error(`status must be one of: ${statuses.join(", ")}`);
	return value;
}
function parseScope(value, field, allowed, fallback) {
	if (value === void 0) return fallback;
	if (typeof value !== "string" || !allowed.includes(value)) throw new Error(`${field} must be one of: ${allowed.join(", ")}`);
	return value;
}
function createStandingIntentTool(options) {
	return {
		label: "Standing Intent",
		name: "intent",
		description: `Create, list, or explicitly cancel event-conditioned standing intents. Creating an intent arms it immediately. ${STANDING_INTENT_AUTOMATION_GUIDANCE} ${STANDING_INTENT_SCOPE_GUIDANCE} Use scheduled tasks for time-based reminders; use this tool only for events expressed by trigger keywords.`,
		parameters: {
			type: "object",
			properties: {
				action: {
					type: "string",
					enum: [
						"create",
						"list",
						"cancel"
					]
				},
				id: { type: "string" },
				description: {
					type: "string",
					maxLength: INTENT_DESCRIPTION_MAX_CHARS
				},
				triggerKeywords: {
					type: "array",
					items: {
						type: "string",
						maxLength: INTENT_KEYWORD_MAX_CHARS
					},
					maxItems: INTENT_KEYWORD_MAX_COUNT
				},
				scope: {
					type: "string",
					enum: [
						"conversation",
						"channel",
						"anywhere"
					],
					default: "channel",
					description: STANDING_INTENT_SCOPE_GUIDANCE
				},
				senderScope: {
					type: "string",
					enum: ["sender", "anyone"],
					default: "sender"
				},
				expiresAt: { type: "string" },
				maxFires: {
					type: "integer",
					minimum: 1
				},
				cooldownSeconds: {
					type: "integer",
					minimum: 0
				},
				status: {
					type: "string",
					enum: [
						"pending",
						"armed",
						"fired",
						"done",
						"cancelled",
						"expired"
					]
				}
			},
			required: ["action"],
			additionalProperties: false
		},
		execute: async (_toolCallId, rawParams) => {
			const params = rawParams ?? {};
			if (params.action === "create") {
				const provider = options.provider?.trim();
				const senderId = options.senderId?.trim();
				if (!provider || !senderId) throw new Error(`authenticated ${!provider ? senderId ? "channel" : "channel and sender" : "sender"} identity is unavailable for this turn; retry from an authenticated channel conversation`);
				const nowMs = Date.now();
				const scope = parseScope(params.scope, "scope", [
					"conversation",
					"channel",
					"anywhere"
				], "channel");
				const senderScope = parseScope(params.senderScope, "senderScope", ["sender", "anyone"], "sender");
				const intent = await createStandingIntent({
					agentId: options.agentId,
					assertCurrent: options.assertCurrent,
					description: trimRequiredString(params.description, "description", INTENT_DESCRIPTION_MAX_CHARS),
					triggerKeywords: normalizeKeywords(params.triggerKeywords),
					channelScope: scope === "anywhere" ? null : encodeStandingIntentChannelScope({
						scope,
						provider: options.provider ?? "",
						accountId: options.accountId,
						conversationId: options.conversationId
					}),
					senderScope: senderScope === "anyone" ? null : encodeStandingIntentSenderScope({
						provider: options.provider ?? "",
						accountId: options.accountId,
						senderId: options.senderId ?? ""
					}),
					creatorSender: senderId,
					expiresAt: parseExpiry(params.expiresAt, nowMs),
					maxFires: positiveInteger(params.maxFires, "maxFires", 3),
					cooldownSeconds: nonNegativeInteger(params.cooldownSeconds, "cooldownSeconds", DEFAULT_INTENT_COOLDOWN_SECONDS),
					sourceSessionId: options.sourceSessionId,
					nowMs
				});
				return jsonResult({
					intent,
					message: renderArmedIntentMessage(scope)
				});
			}
			if (params.action === "list") return jsonResult({ intents: await listStandingIntents({
				agentId: options.agentId,
				assertCurrent: options.assertCurrent,
				status: parseStatus(params.status)
			}) });
			if (params.action === "cancel") {
				const id = trimRequiredString(params.id, "id", 200);
				const intent = await cancelStandingIntent({
					agentId: options.agentId,
					id,
					assertCurrent: options.assertCurrent
				});
				return jsonResult({
					cancelled: intent !== null,
					intent
				});
			}
			throw new Error("action must be create, list, or cancel");
		}
	};
}
//#endregion
export { createStandingIntentTool };
