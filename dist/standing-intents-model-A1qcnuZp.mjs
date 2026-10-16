//#region extensions/memory-core/src/standing-intents-model.ts
const DEFAULT_INTENT_COOLDOWN_SECONDS = 86400;
const DEFAULT_INTENT_MAX_FIRES = 3;
const DEFAULT_INTENT_EXPIRY_MS = 7776e6;
const INTENT_INJECTION_MAX_CHARS = 1200;
function normalizeScopeIdentity(value, field, lowercase = false) {
	const normalized = value.trim();
	if (!normalized) throw new Error(`${field} is unavailable for this creating turn`);
	return lowercase ? normalized.toLowerCase() : normalized;
}
function normalizeScopeAccountId(accountId) {
	return accountId?.trim() || "default";
}
function normalizeCreatorSender(value) {
	const creatorSender = value.trim();
	if (!creatorSender || creatorSender.toLowerCase() === "unknown") throw new Error("creating sender is unavailable for this turn");
	return creatorSender;
}
function readKnownCreatorSender(value) {
	const creatorSender = value?.trim();
	return creatorSender && creatorSender.toLowerCase() !== "unknown" ? creatorSender : null;
}
function encodeStandingIntentChannelScope(params) {
	const provider = normalizeScopeIdentity(params.provider, "channel identity", true);
	const identity = params.scope === "channel" ? provider : normalizeScopeIdentity(params.conversationId ?? "", "conversation identity");
	return JSON.stringify([
		"v1",
		params.scope,
		provider,
		normalizeScopeAccountId(params.accountId),
		identity
	]);
}
function encodeStandingIntentSenderScope(params) {
	return JSON.stringify([
		"v1",
		normalizeScopeIdentity(params.provider, "channel identity", true),
		normalizeScopeAccountId(params.accountId),
		normalizeScopeIdentity(params.senderId, "sender identity")
	]);
}
function parseStoredScope(value, length) {
	if (value === null) return null;
	try {
		const parsed = JSON.parse(value);
		if (Array.isArray(parsed) && parsed.length === length && parsed[0] === "v1" && parsed.every((entry) => typeof entry === "string" && entry.length > 0)) return parsed;
	} catch {}
	return null;
}
function parseStoredChannelScope(value) {
	const parsed = parseStoredScope(value, 5);
	if (parsed && (parsed[1] === "channel" || parsed[1] === "conversation")) return {
		scope: parsed[1],
		identity: parsed[4]
	};
	return {
		scope: "anywhere",
		identity: null
	};
}
function parseStoredSenderScope(value) {
	return parseStoredScope(value, 4)?.[3] ?? null;
}
function rowToIntent(row) {
	const channelScope = parseStoredChannelScope(row.channel_scope);
	return {
		id: row.id,
		description: row.description,
		triggerKeywords: parseStoredTriggerKeywords(row.trigger_keywords),
		triggerEmbedding: row.trigger_embedding,
		scope: channelScope.scope,
		channelScope: channelScope.identity,
		senderScope: parseStoredSenderScope(row.sender_scope),
		creatorSender: readKnownCreatorSender(row.creator_sender),
		status: row.status,
		expiresAt: row.expires_at,
		maxFires: row.max_fires,
		fireCount: row.fire_count,
		cooldownSeconds: row.cooldown_seconds,
		lastFiredAt: row.last_fired_at,
		createdAt: row.created_at,
		sourceSessionId: row.source_session_id
	};
}
function parseStoredTriggerKeywords(value) {
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === "string" && Boolean(entry)) : [];
	} catch {
		return [];
	}
}
function tokenizeIntentText(text) {
	return text.toLowerCase().match(/[\p{L}\p{N}_-]+/gu) ?? [];
}
function prepareStandingIntentMatch(params) {
	const promptTokens = [...new Set(tokenizeIntentText(params.prompt))];
	if (promptTokens.length === 0) return;
	const channel = params.channel?.trim() || void 0;
	const provider = params.provider?.trim().toLowerCase() || void 0;
	const senderId = params.senderId?.trim() || void 0;
	const channelScopes = /* @__PURE__ */ new Set();
	if (provider) {
		channelScopes.add(encodeStandingIntentChannelScope({
			scope: "channel",
			provider,
			accountId: params.accountId
		}));
		if (channel) channelScopes.add(encodeStandingIntentChannelScope({
			scope: "conversation",
			provider,
			accountId: params.accountId,
			conversationId: channel
		}));
	}
	const storedSenderScope = provider && senderId ? encodeStandingIntentSenderScope({
		provider,
		accountId: params.accountId,
		senderId
	}) : void 0;
	return {
		promptTokens,
		ftsQuery: promptTokens.map((token) => `"${token.replaceAll("\"", "\"\"")}"`).join(" OR "),
		channelScopes: [...channelScopes],
		senderScope: storedSenderScope,
		nowMs: params.nowMs
	};
}
function renderStandingIntentContext(intents) {
	return `<standing_intents>\n${intents.map((intent) => {
		return `Standing intent (created ${new Date(intent.createdAt).toISOString().slice(0, 10)}): ${intent.description}`;
	}).join("\n")}\n</standing_intents>`;
}
function standingIntentsFitContext(intents) {
	return intents.length <= 3 && renderStandingIntentContext(intents).length <= 1200;
}
function buildStandingIntentContext(intents) {
	const included = [];
	for (const intent of intents.slice(0, 3)) {
		if (!standingIntentsFitContext([...included, intent])) continue;
		included.push(intent);
	}
	return included.length > 0 ? renderStandingIntentContext(included) : void 0;
}
function isEligibleStandingIntentTurn(ctx) {
	if (ctx.trigger !== "user" || !ctx.sessionKey && !ctx.sessionId) return false;
	return ctx.messageProvider?.trim().toLowerCase() === "webchat" || Boolean(ctx.channelId?.trim() || ctx.chatId?.trim());
}
//#endregion
export { buildStandingIntentContext as a, isEligibleStandingIntentTurn as c, prepareStandingIntentMatch as d, readKnownCreatorSender as f, tokenizeIntentText as h, INTENT_INJECTION_MAX_CHARS as i, normalizeCreatorSender as l, standingIntentsFitContext as m, DEFAULT_INTENT_EXPIRY_MS as n, encodeStandingIntentChannelScope as o, rowToIntent as p, DEFAULT_INTENT_MAX_FIRES as r, encodeStandingIntentSenderScope as s, DEFAULT_INTENT_COOLDOWN_SECONDS as t, parseStoredTriggerKeywords as u };
