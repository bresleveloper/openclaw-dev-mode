//#region src/channels/mention-gating.ts
function implicitMentionKindWhen(kind, enabled) {
	return enabled ? [kind] : [];
}
function resolveBotThreadMentionPolicy(params) {
	if (!params.isBotOwnedThread || params.requireMentionInBotThreads === void 0) return {
		requireMention: params.requireMention,
		implicitMentionKinds: params.implicitMentionKinds
	};
	return {
		requireMention: params.requireMentionInBotThreads,
		implicitMentionKinds: params.requireMentionInBotThreads ? params.implicitMentionKinds?.filter((kind) => kind === "native") : params.implicitMentionKinds
	};
}
/** Translates positive implicit-mention policy into the evaluator's kind allowlist. */
function allowedImplicitMentionKindsFromConfig(config) {
	return [
		...implicitMentionKindWhen("reply_to_bot", config.replyToBot !== false),
		...implicitMentionKindWhen("quoted_bot", config.quotedBot !== false),
		...implicitMentionKindWhen("bot_thread_participant", config.threadParticipation !== false),
		"native"
	];
}
function resolveInboundMentionDecision(params) {
	const { facts, policy } = "facts" in params && "policy" in params ? params : {
		facts: params,
		policy: params
	};
	const allowedImplicitMentionKinds = policy.allowedImplicitMentionKinds ?? (policy.implicitMentions ? allowedImplicitMentionKindsFromConfig(policy.implicitMentions) : void 0);
	const shouldBypassMention = policy.isGroup && policy.requireMention && !facts.wasMentioned && !(facts.hasAnyMention ?? false) && policy.allowTextCommands && policy.commandAuthorized && policy.hasControlCommand;
	const matchedImplicitMentionKinds = [...new Set(facts.implicitMentionKinds ?? [])].filter((kind) => !allowedImplicitMentionKinds || allowedImplicitMentionKinds.includes(kind));
	const implicitMention = matchedImplicitMentionKinds.length > 0;
	const effectiveWasMentioned = facts.wasMentioned || implicitMention || shouldBypassMention;
	return {
		implicitMention,
		matchedImplicitMentionKinds,
		effectiveWasMentioned,
		shouldBypassMention,
		shouldSkip: policy.requireMention && facts.canDetectMention && !effectiveWasMentioned
	};
}
//#endregion
export { resolveInboundMentionDecision as i, implicitMentionKindWhen as n, resolveBotThreadMentionPolicy as r, allowedImplicitMentionKindsFromConfig as t };
