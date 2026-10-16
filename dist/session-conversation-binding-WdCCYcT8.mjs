import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as SessionWorkStartChangedError } from "./work-start-error-Dh9d0ImY.mjs";
import { l as resolveCommandTurnTargetSessionKey } from "./command-turn-context-B-DtktkV.mjs";
import "./lifecycle-BH2MRg79.mjs";
import { a as readConversationBindingRouteObservations, i as readConversationBindingRouteFacts, n as matchesConversationBindingRouteFacts, s as resolveConversationBindingSelection } from "./conversation-binding-route-facts-DCKt7P60.mjs";
import { S as isSessionBindingError, a as readSessionBindingSelectionCurrent, t as getSessionBindingService } from "./session-binding-service-DzGpg6K8.mjs";
import { a as resolveConversationBindingContextFromMessage, t as resolveEffectiveResetTargetSessionKey } from "./acp-reset-target-BoR9NsWR.mjs";
//#region src/auto-reply/reply/session-conversation-binding.ts
function resolveSessionDefaultAccountId(params) {
	const accountId = normalizeOptionalString(params.accountIdRaw) ?? normalizeOptionalString(params.persistedLastAccountId);
	if (accountId) return accountId;
	const channel = normalizeOptionalLowercaseString(params.channelRaw);
	if (!channel) return;
	const channels = params.cfg.channels;
	return normalizeOptionalString(channels?.[channel]?.defaultAccount);
}
function resolveSessionConversationBindingContext(cfg, ctx) {
	const bindingContext = resolveConversationBindingContextFromMessage({
		cfg,
		ctx
	});
	if (!bindingContext) return null;
	const { threadId: _threadId, ...conversation } = bindingContext;
	return conversation;
}
async function resolveDispatchConversationBinding(cfg, ctx) {
	if (resolveCommandTurnTargetSessionKey(ctx)) return null;
	const conversation = readConversationBindingRouteFacts(ctx)?.conversation ?? resolveSessionConversationBindingContext(cfg, ctx);
	const selection = resolveConversationBindingSelection(conversation ? await getSessionBindingService().resolveByConversationAsync(conversation) : null);
	return selection.kind === "none" ? null : selection.binding;
}
async function resolveBoundAcpSessionForCommandReset(params) {
	const bindingContext = params.bindingContext ?? resolveSessionConversationBindingContext(params.cfg, params.ctx);
	return await resolveEffectiveResetTargetSessionKey({
		cfg: params.cfg,
		channel: bindingContext?.channel,
		accountId: bindingContext?.accountId,
		conversationId: bindingContext?.conversationId,
		parentConversationId: bindingContext?.parentConversationId,
		commandTargetSessionKey: resolveCommandTurnTargetSessionKey(params.ctx),
		activeSessionKey: normalizeOptionalString(params.ctx.SessionKey),
		allowNonAcpBindingSessionKey: false,
		skipConfiguredFallbackWhenActiveSessionNonAcp: true,
		fallbackToActiveAcpWhenUnbound: false
	});
}
function assertPreparedConversationBindingRoute(ctx, current) {
	const expected = readConversationBindingRouteFacts(ctx);
	if (expected && !matchesConversationBindingRouteFacts(expected, current)) throw new SessionWorkStartChangedError("Conversation binding changed while preparing the reply. Retry the message.");
}
async function readPreparedConversationBindingRouteCurrent(ctx) {
	const observations = readConversationBindingRouteObservations(ctx);
	if (observations.length === 0) return null;
	let current;
	try {
		current = await readSessionBindingSelectionCurrent(observations.map((expected) => expected.conversation));
	} catch (error) {
		if (!isSessionBindingError(error) || error.code !== "BINDING_ADAPTER_UNAVAILABLE") throw error;
		throw new SessionWorkStartChangedError("Conversation binding owner changed while preparing the reply. Retry the message.");
	}
	for (const [index, expected] of observations.entries()) if (!matchesConversationBindingRouteFacts(expected, current[index] ?? null)) throw new SessionWorkStartChangedError("Conversation binding changed while preparing the reply. Retry the message.");
	return current.at(-1) ?? null;
}
async function assertPreparedConversationBindingRouteCurrent(ctx) {
	if (!resolveCommandTurnTargetSessionKey(ctx)) await readPreparedConversationBindingRouteCurrent(ctx);
}
async function resolveSessionConversationBinding(params) {
	const { cfg, ctx, mode } = params;
	const isSystemEvent = ctx.InternalTurnSource !== void 0;
	const conversationBindingContext = isSystemEvent ? null : readConversationBindingRouteFacts(ctx)?.conversation ?? resolveSessionConversationBindingContext(cfg, ctx);
	const commandTargetSessionKey = resolveCommandTurnTargetSessionKey(ctx);
	let resolvedBinding;
	if (!commandTargetSessionKey && conversationBindingContext) {
		const service = getSessionBindingService();
		if (readConversationBindingRouteFacts(ctx)) resolvedBinding = await readPreparedConversationBindingRouteCurrent(ctx);
		else if (mode === "preprocessing") {
			const inspection = await service.inspectByConversationAsync(conversationBindingContext);
			if (inspection.status === "unavailable") throw new Error("Conversation binding owner is temporarily unavailable; retry the reply.");
			resolvedBinding = inspection.binding;
		} else resolvedBinding = await service.resolveByConversationAsync(conversationBindingContext);
		assertPreparedConversationBindingRoute(ctx, resolvedBinding);
	}
	const bindingSelection = resolveConversationBindingSelection(resolvedBinding ?? null);
	return {
		isSystemEvent,
		conversationBindingContext,
		commandTargetSessionKey,
		conversationBinding: bindingSelection.kind === "none" ? void 0 : bindingSelection.binding
	};
}
//#endregion
export { resolveDispatchConversationBinding as a, resolveBoundAcpSessionForCommandReset as i, assertPreparedConversationBindingRouteCurrent as n, resolveSessionConversationBinding as o, readPreparedConversationBindingRouteCurrent as r, resolveSessionDefaultAccountId as s, assertPreparedConversationBindingRoute as t };
