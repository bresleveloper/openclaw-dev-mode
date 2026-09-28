//#region src/channels/mention-gating.ts
function implicitMentionKindWhen(kind, enabled) {
	return enabled ? [kind] : [];
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
function resolveMatchedImplicitMentionKinds(params) {
	const inputKinds = params.implicitMentionKinds ?? [];
	if (inputKinds.length === 0) return [];
	const allowedKinds = params.allowedImplicitMentionKinds ? new Set(params.allowedImplicitMentionKinds) : null;
	const matched = [];
	for (const kind of inputKinds) {
		if (allowedKinds && !allowedKinds.has(kind)) continue;
		if (!matched.includes(kind)) matched.push(kind);
	}
	return matched;
}
function resolveMentionDecisionCore(params) {
	const matchedImplicitMentionKinds = resolveMatchedImplicitMentionKinds({
		implicitMentionKinds: params.implicitMentionKinds,
		allowedImplicitMentionKinds: params.allowedImplicitMentionKinds
	});
	const implicitMention = matchedImplicitMentionKinds.length > 0;
	const effectiveWasMentioned = params.wasMentioned || implicitMention || params.shouldBypassMention;
	const shouldSkip = params.requireMention && params.canDetectMention && !effectiveWasMentioned;
	return {
		implicitMention,
		matchedImplicitMentionKinds,
		effectiveWasMentioned,
		shouldBypassMention: params.shouldBypassMention,
		shouldSkip
	};
}
function hasNestedMentionDecisionParams(params) {
	return "facts" in params && "policy" in params;
}
function normalizeMentionDecisionParams(params) {
	if (hasNestedMentionDecisionParams(params)) return params;
	const { canDetectMention, wasMentioned, hasAnyMention, implicitMentionKinds, isGroup, requireMention, implicitMentions, allowedImplicitMentionKinds, allowTextCommands, hasControlCommand, commandAuthorized } = params;
	return {
		facts: {
			canDetectMention,
			wasMentioned,
			hasAnyMention,
			implicitMentionKinds
		},
		policy: {
			isGroup,
			requireMention,
			implicitMentions,
			allowedImplicitMentionKinds,
			allowTextCommands,
			hasControlCommand,
			commandAuthorized
		}
	};
}
function resolveInboundMentionDecision(params) {
	const { facts, policy } = normalizeMentionDecisionParams(params);
	const allowedImplicitMentionKinds = policy.allowedImplicitMentionKinds ?? (policy.implicitMentions ? allowedImplicitMentionKindsFromConfig(policy.implicitMentions) : void 0);
	const shouldBypassMention = policy.isGroup && policy.requireMention && !facts.wasMentioned && !(facts.hasAnyMention ?? false) && policy.allowTextCommands && policy.commandAuthorized && policy.hasControlCommand;
	return resolveMentionDecisionCore({
		requireMention: policy.requireMention,
		canDetectMention: facts.canDetectMention,
		wasMentioned: facts.wasMentioned,
		implicitMentionKinds: facts.implicitMentionKinds,
		allowedImplicitMentionKinds,
		shouldBypassMention
	});
}
//#endregion
export { implicitMentionKindWhen as n, resolveInboundMentionDecision as r, allowedImplicitMentionKindsFromConfig as t };
