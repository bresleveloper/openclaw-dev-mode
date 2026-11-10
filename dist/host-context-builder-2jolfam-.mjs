import { r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import "./account-id-ifCOO7_9.mjs";
import { i as getCommandOwnerAuthority, n as bindCommandOwnerAuthority, r as captureCommandOwnerAssertion } from "./command-owner-authority-DGt-GTro.mjs";
import { f as takeChannelParticipantInput, s as prepareHostChannelContextAdmissionEvidence, t as bindHostChannelContextAdmissionEvidence } from "./admission-evidence-CcY0jAvs.mjs";
import { t as bindRequesterProfile } from "./requester-profile-u6QLGOHK.mjs";
import { n as captureChannelOperatorRunAuthority } from "./operator-run-authority-BcrXDfhQ.mjs";
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
//#region src/channels/message-access/run-authorization-error.ts
/** A channel rejected source authorization before the model could execute. */
var ChannelRunAuthorizationError = class extends Error {
	constructor(cause, disposition = "denied") {
		super("Channel authorization could not be renewed before run admission", { cause });
		this.disposition = disposition;
		this.name = "ChannelRunAuthorizationError";
	}
};
function isChannelRunAuthorizationError(error, disposition) {
	return collectErrorGraphCandidates(error).some((candidate) => candidate instanceof ChannelRunAuthorizationError && (disposition === void 0 || candidate.disposition === disposition));
}
//#endregion
//#region src/channels/message-access/child-session-publication.ts
const PUBLICATION = Symbol("openclaw.childSessionPublication");
const runs = /* @__PURE__ */ new WeakMap();
/** Host-only, single-run intent for fresh immediate children; never serialized into a session. */
var ChildSessionPublication = class {
	#run;
	#assertRunCurrent;
	#preparation;
	constructor(requesterSessionKey, assertSourceCurrent, prepareSource) {
		this.requesterSessionKey = requesterSessionKey;
		this.assertSourceCurrent = assertSourceCurrent;
		this.prepareSource = prepareSource;
	}
	prepare() {
		return this.#preparation ??= this.prepareSourceAuthorization();
	}
	async prepareSourceAuthorization() {
		try {
			if (this.#run) throw new Error("An admitted publication cannot renew its source authority");
			if (this.prepareSource) {
				let assertion;
				try {
					assertion = await this.prepareSource();
				} catch (error) {
					throw new ChannelRunAuthorizationError(error, "unavailable");
				}
				if (!assertion) throw new ChannelRunAuthorizationError(/* @__PURE__ */ new Error("Channel source authorization was rejected"));
				this.assertSourceCurrent = assertion;
			}
			this.assertSourceCurrent();
		} catch (error) {
			throw error instanceof ChannelRunAuthorizationError ? error : new ChannelRunAuthorizationError(error);
		}
	}
	bind(run, assertRunCurrent) {
		if (this.#run && this.#run !== run) return;
		this.assertSourceCurrent();
		this.#run = run;
		this.#assertRunCurrent = assertRunCurrent;
		runs.set(run, this);
	}
	assertCurrent() {
		if (!this.#run || !this.#assertRunCurrent) throw new Error("Child publication requires an admitted source run.");
		this.assertSourceCurrent();
		this.#assertRunCurrent();
	}
	claim(params) {
		this.assertCurrent();
		if (!params.isNew || params.fork || params.parentSessionKey !== this.requesterSessionKey || params.sessionKey === this.requesterSessionKey || !params.parent || params.parent.incognito || params.parent.visibility === "draft" || isIncognitoSessionKey(this.requesterSessionKey) || params.entry.incognito || params.entry.visibility === "draft" || isIncognitoSessionKey(params.sessionKey)) throw new Error("Public ingress can publish only its fresh isolated, non-private child.");
	}
};
function bindChildSessionPublication(context, requesterSessionKey, assertCurrent, prepare) {
	Object.assign(context, { [PUBLICATION]: new ChildSessionPublication(requesterSessionKey, assertCurrent, prepare) });
}
async function prepareChildSessionPublication(context) {
	const publication = Reflect.get(context, PUBLICATION);
	if (publication instanceof ChildSessionPublication) await publication.prepare();
}
function copyChildSessionPublication(source, destination) {
	const publication = Reflect.get(source, PUBLICATION);
	if (publication instanceof ChildSessionPublication) Object.assign(destination, { [PUBLICATION]: publication });
}
function admitChildSessionPublication(context, run, assertRunCurrent) {
	const publication = Reflect.get(context, PUBLICATION);
	if (publication instanceof ChildSessionPublication) publication.bind(run, assertRunCurrent);
}
function readChildSessionPublication(run) {
	return run ? runs.get(run) : void 0;
}
//#endregion
//#region src/channels/message-access/participant-input.ts
function bindChannelParticipantInput(params) {
	if (!params.ingress || params.ingress === "unsupported") return;
	const batch = (Array.isArray(params.ingress) ? params.ingress : [params.ingress]).map(takeChannelParticipantInput);
	if (batch.at(-1)?.binding.messageId !== params.binding.messageId || !params.owner.isLive() || batch.some((input) => !input || input.owner !== params.owner || input.gatewayContext !== params.owner.resolveGatewayContext?.() || input.identity.pluginId !== params.channelId || input.binding.agentId !== params.binding.agentId || input.binding.sessionKey !== params.binding.sessionKey || input.binding.nativeChannelId !== params.binding.nativeChannelId || input.binding.inboundEventKind !== params.binding.inboundEventKind)) return;
	for (const input of batch) if (input) prepareSessionParticipantInput(params.context, input.identity, input.promptedAt);
	const publication = batch.length === 1 ? batch[0]?.childSessionPublication : void 0;
	if (publication?.audience === "public" && params.binding.inboundEventKind === "user_request") {
		const gateway = params.owner.resolveGatewayContext?.();
		const ownerIsCurrent = () => params.owner.isLive() && Boolean(gateway) && params.owner.resolveGatewayContext?.() === gateway;
		const assertOwnerCurrent = () => {
			if (!ownerIsCurrent()) throw new Error("Public ingress owner is no longer current.");
		};
		const prepare = publication.prepare;
		bindChildSessionPublication(params.context, params.binding.sessionKey, () => {
			assertOwnerCurrent();
			publication.assertCurrent();
		}, prepare ? async () => {
			if (!ownerIsCurrent()) return null;
			const assertCurrent = await prepare();
			if (!ownerIsCurrent() || !assertCurrent) return null;
			return () => {
				assertOwnerCurrent();
				assertCurrent();
			};
		} : void 0);
	}
	const principal = batch.at(-1)?.verifiedPrincipal;
	const principalKey = principal && JSON.stringify(principal);
	const gateway = params.owner.resolveGatewayContext?.();
	if (!principal || !gateway || batch.some((input) => JSON.stringify(input?.verifiedPrincipal) !== principalKey)) return;
	const requester = batch.at(-1)?.requesterProfile;
	if (requester && params.context.SenderId === principal.senderId && (params.context.AccountId ?? "default") === principal.accountId && params.context.OriginatingChannel === principal.channelId && batch.every((input) => input?.requesterProfile?.id === requester.id && input.requesterProfile.isCurrent())) bindRequesterProfile(params.context, {
		...requester,
		isCurrent: () => params.owner.isLive() && params.owner.resolveGatewayContext?.() === gateway && batch.every((input) => input?.requesterProfile?.isCurrent())
	});
	const authority = batch.at(-1)?.commandOwnerAuthority;
	if (!authority?.source || !authority.isCurrent(gateway.getRuntimeConfig())) return;
	bindCommandOwnerAuthority(params.context, {
		recoveryReference: authority.recoveryReference,
		isCurrent: () => params.owner.isLive() && params.owner.resolveGatewayContext?.() === gateway && authority.isCurrent(gateway.getRuntimeConfig())
	});
	const assertCurrent = captureCommandOwnerAssertion(params.context);
	const commandOwner = getCommandOwnerAuthority(params.context);
	if (authority.operatorProfile && assertCurrent && commandOwner) bindCommandOwnerAuthority(params.context, {
		...commandOwner,
		operatorAuthority: captureChannelOperatorRunAuthority({
			...authority.operatorProfile,
			getRuntimeConfig: () => gateway.getRuntimeConfig(),
			assertCurrent,
			signal: authority.signal
		})
	});
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
export { readChildSessionPublication as a, isSessionPersonalBootstrapTurn as c, readSessionInputProfileId as d, sessionParticipantInput as f, prepareChildSessionPublication as i, prepareChannelParticipantObservation as l, admitChildSessionPublication as n, ChannelRunAuthorizationError as o, copyChildSessionPublication as r, isChannelRunAuthorizationError as s, createHostChannelInboundEventContextBuilder as t, prepareSessionParticipantInput as u };
