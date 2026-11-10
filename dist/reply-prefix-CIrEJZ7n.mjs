import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as resolveAgentIdentity, r as resolveEffectiveMessagesConfig } from "./identity-VQc9B4RO.mjs";
import { i as extractShortModelName } from "./normalize-reply-Bw7WQh_g.mjs";
//#region src/channels/reply-prefix.ts
function createReplyPrefixContext(params) {
	const { cfg, agentId } = params;
	const prefixContext = { identityName: normalizeOptionalString(resolveAgentIdentity(cfg, agentId)?.name) };
	const onModelSelected = (ctx) => {
		prefixContext.provider = ctx.provider;
		prefixContext.model = extractShortModelName(ctx.model);
		prefixContext.modelFull = `${ctx.provider}/${ctx.model}`;
		prefixContext.thinkingLevel = ctx.thinkLevel ?? "off";
	};
	return {
		prefixContext,
		responsePrefix: resolveEffectiveMessagesConfig(cfg, agentId, {
			channel: params.channel,
			accountId: params.accountId
		}).responsePrefix,
		responsePrefixContextProvider: () => prefixContext,
		onModelSelected
	};
}
function createReplyPrefixOptions(params) {
	const { prefixContext: _prefixContext, ...options } = createReplyPrefixContext(params);
	return options;
}
//#endregion
export { createReplyPrefixOptions as n, createReplyPrefixContext as t };
