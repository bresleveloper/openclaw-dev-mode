import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { f as takeChannelParticipantInput, s as prepareHostChannelContextAdmissionEvidence, t as bindHostChannelContextAdmissionEvidence } from "./admission-evidence-aqOMZf0e.mjs";
import { c as bindCommandOwnerAuthority } from "./command-auth-rFSl4uOZ.mjs";
//#region src/sessions/session-participant-input.ts
const sessionParticipantInput = Symbol.for("openclaw.sessionParticipantInput");
/** Trusted ingress prepares once; context spreads carry the same consumed fact through retargeting. */
function prepareSessionParticipantInput(ctx, identity, promptedAt = Date.now()) {
	(ctx[sessionParticipantInput] ??= []).push({
		identity,
		promptedAt,
		recorded: false
	});
}
function readSessionInputProfileId(ctx) {
	const identity = ctx[sessionParticipantInput]?.find((input) => input.identity.type === "profile")?.identity;
	return identity?.type === "profile" ? identity.id : void 0;
}
/** Only external turns may load the session's personal preferences; sender identity does not select them. */
function isSessionPersonalBootstrapTurn(ctx) {
	return ctx.InternalTurnSource === void 0 && (!ctx.InputProvenance || ctx.InputProvenance.kind === "external_user") && Boolean(ctx[sessionParticipantInput]?.length);
}
/** An unqualified transport sender remains an observation, never a Gateway profile. */
function prepareChannelParticipantObservation(ctx) {
	const channel = ctx.Provider ?? ctx.Surface;
	if (ctx[sessionParticipantInput] || !ctx.SenderId || channel === "webchat" || ctx.InternalTurnSource !== void 0 || ctx.InputProvenance && ctx.InputProvenance.kind !== "external_user") return;
	prepareSessionParticipantInput(ctx, {
		type: "observation",
		pluginId: channel ?? null,
		accountId: ctx.AccountId ?? null,
		senderKind: ctx.SenderIsBot === true ? "bot" : ctx.SenderIsBot === false ? "human" : "unknown",
		id: ctx.SenderId
	});
}
//#endregion
//#region src/channels/message-access/participant-input.ts
function bindChannelParticipantInput(params) {
	if (!params.ingress || params.ingress === "unsupported") return;
	const batch = (Array.isArray(params.ingress) ? params.ingress : [params.ingress]).map(takeChannelParticipantInput);
	if (batch.at(-1)?.binding.messageId !== params.binding.messageId || !params.owner.isLive() || batch.some((input) => !input || input.owner !== params.owner || input.gatewayContext !== params.owner.resolveGatewayContext?.() || input.identity.pluginId !== params.channelId || input.binding.agentId !== params.binding.agentId || input.binding.sessionKey !== params.binding.sessionKey || input.binding.nativeChannelId !== params.binding.nativeChannelId || input.binding.inboundEventKind !== params.binding.inboundEventKind)) return;
	for (const input of batch) if (input) prepareSessionParticipantInput(params.context, input.identity, input.promptedAt);
	const principal = batch.at(-1)?.verifiedPrincipal;
	const principalKey = principal && JSON.stringify(principal);
	const gateway = params.owner.resolveGatewayContext?.();
	if (!principal || !gateway || batch.some((input) => JSON.stringify(input?.verifiedPrincipal) !== principalKey)) return;
	const authority = batch.at(-1)?.commandOwnerAuthority;
	if (!authority?.source || !authority.isCurrent(gateway.getRuntimeConfig())) return;
	bindCommandOwnerAuthority(params.context, { isCurrent: () => params.owner.isLive() && params.owner.resolveGatewayContext?.() === gateway && authority.isCurrent(gateway.getRuntimeConfig()) });
}
//#endregion
//#region src/channels/inbound-event/host-context-builder.ts
/** Wrap the ordinary builder with the private bundled-channel evidence binding. */
function createHostChannelInboundEventContextBuilder(buildContext, owner) {
	return (params) => {
		const preparation = prepareHostChannelContextAdmissionEvidence({
			owner,
			channelId: params.channel,
			accountId: params.accountId,
			ingress: params.channelIngress,
			rawPrincipalRef: params.sender.id,
			contextParams: params
		});
		const result = buildContext(params);
		const bindEvidence = (built) => {
			if (owner?.channelId === params.channel && owner.isLive()) bindChannelParticipantInput({
				context: built,
				channelId: params.channel,
				ingress: params.channelIngress,
				owner,
				binding: {
					agentId: params.route.agentId,
					sessionKey: params.route.dispatchSessionKey ?? params.route.routeSessionKey,
					nativeChannelId: params.reply.nativeChannelId ?? params.conversation.nativeChannelId,
					messageId: params.messageId,
					inboundEventKind: params.message.inboundEventKind ?? "user_request"
				}
			});
			bindHostChannelContextAdmissionEvidence({
				context: built,
				preparation
			});
			return built;
		};
		return isPromiseLike(result) ? result.then(bindEvidence) : bindEvidence(result);
	};
}
//#endregion
export { readSessionInputProfileId as a, prepareSessionParticipantInput as i, isSessionPersonalBootstrapTurn as n, sessionParticipantInput as o, prepareChannelParticipantObservation as r, createHostChannelInboundEventContextBuilder as t };
