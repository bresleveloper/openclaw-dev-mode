import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as enqueueKeyedTask } from "./keyed-async-queue-CTreGrmR.mjs";
import { Gf as isReactionEmoji, oi as validateSessionReactionsListParams, si as validateSessionReactionsSetParams } from "./src-l2dWvEsN.mjs";
import { l as withSystemEventOwner } from "./system-event-ownership-BkQcgSZJ.mjs";
import { i as enqueueSystemEvent } from "./system-events-BD0JkU8V.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { r as hasOperatorBoundary } from "./operator-role-policy-BqPaarjx.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { n as SessionReactionMessageMissingError, t as SessionReactionLimitError } from "./session-reaction-store.kernel-joXWzfME.mjs";
import { n as setSessionReactionAsync } from "./session-reaction-store-Db74vqk5.mjs";
import { n as getRuntimeVisibleChannelPlugin } from "./runtime-visible-channels-NjzJcucv.mjs";
import { d as readSessionReactionsAsync, i as readSessionMessageByIdAsync, r as readSessionConversationBindingAsync } from "./session-transcript-readers-Z-j3mApc.mjs";
import { c as resolveCurrentChannelMessageToolDiscoveryAdapter, r as createMessageActionDiscoveryContext, u as resolveMessageActionDiscoveryForPlugin } from "./message-action-discovery-DWmJ1tG-.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DnDs09-7.mjs";
import { v as resolveSessionVisibility } from "./session-sharing-policy-BVt5saXn.mjs";
import { n as getSessionRowProjection, r as requireSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { t as readProjectedSessionMutationTarget } from "./session-sharing-target-read-DUttMvj3.mjs";
import { n as captureSessionMutationRouting, r as prepareSessionMutationFacts, t as SessionMutationFactsUnavailableError } from "./session-sharing-preparation-BwpUabTn.mjs";
import { n as resolveChannelAccount } from "./account-resolution-DCHDXWZ0.mjs";
import { t as isAccountEnabled } from "./account-enabled-ClTLgAXM.mjs";
import { t as isConfiguredChannel } from "./channel-selection-D6ROr8H-.mjs";
import { r as resolveMessageActionOutcome } from "./message-action-contracts-CvElm8Dz.mjs";
import { n as defineValidatedGatewayHandler } from "./validation-Bu27N0nv.mjs";
import { n as prepareCurrentSessionSharing, t as isSameSessionSharingTarget } from "./sessions-sharing-authority-BENaDl9k.mjs";
import { a as requireVisibleSuggestionRole } from "./sessions-suggestions-access-CV5PRg_8.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/sessions-reactions-access.ts
function deny(error) {
	throw new SessionMutationAuthorizationChangedError(error);
}
/** Retain the selected facts owner through reads, commit grants, and mirror settlement. */
async function withSessionReactionAccess(params, consume) {
	const { client, context, respond } = params;
	const actorId = gatewayClientSessionCreator(client)?.id;
	const runAuthority = client?.internal?.operatorRunAuthority;
	let retained;
	try {
		const projection = requireSessionRowProjection(context);
		const cfg = context.getRuntimeConfig();
		const assertRouting = captureSessionMutationRouting(cfg);
		const requestedAgent = resolveRequestedSessionAgentId(cfg, params.sessionKey, params.agentId);
		if (!requestedAgent.ok) deny(requestedAgent.error);
		const targetRef = {
			sessionKey: params.sessionKey,
			agentId: requestedAgent.agentId
		};
		const assertCaller = () => {
			if (params.hasCurrentClientAuthority?.() === false || client?.invalidated || client?.connectionSignal?.aborted || gatewayClientSessionCreator(client)?.id !== actorId || getSessionRowProjection(context) !== projection || client?.internal?.operatorRunAuthority !== runAuthority) deny(errorShape(ErrorCodes.FORBIDDEN, "reaction author or session authority changed"));
		};
		assertCaller();
		while (projection.needsMembershipPreparation()) {
			await projection.prepareMembership();
			assertCaller();
		}
		assertRouting(context.getRuntimeConfig());
		const projected = readProjectedSessionMutationTarget(targetRef, cfg, projection);
		if (projected.status === "pending") throw new SessionMutationFactsUnavailableError();
		if (projected.status === "unavailable") retained = await prepareSessionMutationFacts({
			cfg,
			...targetRef,
			allowMissing: true
		});
		const readCurrent = (selected) => {
			assertCaller();
			let membership;
			const { currentCfg, policyConfig, sharing } = prepareCurrentSessionSharing({
				client,
				context,
				projection,
				actorId,
				runAuthority,
				isMember: (target, identityId) => retained ? membership.has(identityId) : projection.hasMembership(target.storePath, target.storeKey, identityId)
			});
			assertRouting(currentCfg);
			let target;
			if (retained) {
				const facts = retained.readCurrent(currentCfg);
				target = facts.target;
				membership = facts.membership;
			} else {
				const current = readProjectedSessionMutationTarget(targetRef, currentCfg, projection);
				if (current.status !== "ready") throw new SessionMutationFactsUnavailableError();
				target = current.target;
			}
			if (selected && !isSameSessionSharingTarget(target, selected)) throw new SessionMutationFactsUnavailableError();
			if (!target || hasOperatorBoundary(client, policyConfig, sharing) && sharing.entryFilter?.(target.storeKey, target.entry) === false) deny(errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.sessionKey}`));
			requireVisibleSuggestionRole({
				cfg: policyConfig,
				client,
				sessionKey: params.sessionKey,
				target,
				sharing,
				respond: (_ok, _payload, error) => {
					if (error) deny(error);
				}
			});
			if (params.write) {
				const role = sharing.roleForTarget(target);
				const cap = sharing.sessionCap;
				if (cap === "none") deny(errorShape(ErrorCodes.FORBIDDEN, "your operator role does not permit session reactions"));
				if (cap === "view" && role === "viewer") deny(errorShape(ErrorCodes.FORBIDDEN, "your operator role permits viewing sessions only"));
				const denied = sharing.authorizeTarget(target);
				if (denied && !(resolveSessionVisibility(target.entry) === "suggest" && cap !== "view")) deny(denied);
			}
			return target;
		};
		const selected = readCurrent();
		await consume({
			target: selected,
			assertCurrent: () => {
				readCurrent(selected);
			}
		});
	} catch (error) {
		respond(false, void 0, error instanceof SessionMutationAuthorizationChangedError ? error.error : errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error)));
	} finally {
		retained?.release();
	}
}
//#endregion
//#region src/gateway/server-methods/sessions-reactions.ts
function reactionScope(target) {
	return {
		agentId: target.agentId,
		sessionKey: target.storeKey,
		storePath: target.storePath
	};
}
const mirrorQueues = /* @__PURE__ */ new Map();
/** Commit-time mirror decision; skips never wait behind in-flight dispatches. */
function resolveMirrorTransport(message, remove, remainingReactors) {
	if (message.role === "assistant") return { skipped: {
		status: "skipped",
		reason: "assistant reply has no persisted delivered channel message id"
	} };
	const transport = asOptionalRecord(asOptionalRecord(message["__openclaw"])?.transport);
	if (typeof transport?.channel !== "string" || typeof transport.conversationRef !== "string" || typeof transport.messageId !== "string") return { skipped: {
		status: "skipped",
		reason: "message has no source channel transport"
	} };
	if (remove ? remainingReactors > 0 : remainingReactors > 1) return { skipped: {
		status: "skipped",
		reason: "channel reaction still stands for other reactors"
	} };
	return { transport: {
		channel: transport.channel,
		conversationRef: transport.conversationRef,
		messageId: transport.messageId
	} };
}
async function mirrorReaction(params) {
	try {
		const { transport } = params;
		const plugin = getRuntimeVisibleChannelPlugin(transport.channel);
		const singleSlot = plugin?.capabilities.reactionSlots === "single";
		const replacement = singleSlot && params.remove ? params.newestRemainingEmoji : void 0;
		const scope = {
			...reactionScope(params.target),
			sessionId: params.target.entry.sessionId
		};
		const cfg = params.context.getRuntimeConfig();
		const captured = readSessionConversationBindingAsync(scope, transport.conversationRef).then((conversation) => ({
			ok: true,
			conversation
		}), (error) => ({
			ok: false,
			error
		}));
		return await enqueueKeyedTask({
			tails: mirrorQueues,
			key: [
				params.target.agentId,
				params.target.storeKey,
				params.target.entry.sessionId,
				transport.conversationRef,
				transport.messageId,
				singleSlot ? "" : params.emoji
			].join("\0"),
			task: async () => {
				const resolved = await captured;
				if (!resolved.ok) throw resolved.error;
				params.assertCurrent();
				const conversation = resolved.conversation;
				if (!conversation || conversation.channel !== transport.channel) return {
					status: "skipped",
					reason: "source conversation is unavailable"
				};
				const channel = conversation.channel;
				if (!isConfiguredChannel(cfg, channel)) return {
					status: "skipped",
					reason: "source channel is not configured or enabled"
				};
				const discovery = resolveCurrentChannelMessageToolDiscoveryAdapter(channel);
				if (!discovery || !resolveMessageActionDiscoveryForPlugin({
					pluginId: discovery.pluginId,
					actions: discovery.actions,
					context: createMessageActionDiscoveryContext({
						cfg,
						channel,
						accountId: conversation.accountId,
						agentId: params.target.agentId,
						sessionKey: params.target.canonicalKey,
						sessionId: params.target.entry.sessionId,
						currentChannelId: conversation.nativeChannelId,
						currentMessageId: transport.messageId,
						currentThreadTs: conversation.threadId
					}),
					includeActions: true
				}).actions.includes("react")) return {
					status: "skipped",
					reason: "source channel does not support reactions"
				};
				if (!plugin) return {
					status: "skipped",
					reason: "source channel is unavailable"
				};
				const account = await resolveChannelAccount({
					plugin,
					cfg,
					accountId: conversation.accountId
				});
				if (!(plugin.config.isEnabled?.(account, cfg) ?? isAccountEnabled(account)) || !(await plugin.config.isConfigured?.(account, cfg) ?? true)) return {
					status: "skipped",
					reason: "source channel account is not configured or enabled"
				};
				const { runMessageAction } = await import("./message-action-runner-BC0AQx9b.mjs");
				const assertCurrent = () => {
					params.assertCurrent();
					if (params.context.getRuntimeConfig() !== cfg) throw new Error("channel configuration changed before reaction delivery");
				};
				assertCurrent();
				const outcome = resolveMessageActionOutcome(await runMessageAction({
					cfg,
					action: "react",
					agentId: params.target.agentId,
					sessionKey: params.target.canonicalKey,
					sessionId: params.target.entry.sessionId,
					conversationReadOrigin: "direct-operator",
					onPlatformSendDispatch: async () => {
						const current = await readSessionConversationBindingAsync(scope, transport.conversationRef);
						if (!current || current.channel !== conversation.channel || current.accountId !== conversation.accountId || current.target !== conversation.target || current.threadId !== conversation.threadId || current.nativeChannelId !== conversation.nativeChannelId) throw new Error("source conversation changed before delivery");
					},
					assertDirectAdapterHandoff: assertCurrent,
					params: {
						channel,
						to: conversation.target,
						accountId: conversation.accountId,
						...conversation.threadId ? { threadId: conversation.threadId } : {},
						messageId: transport.messageId,
						emoji: replacement ?? params.emoji,
						remove: params.remove && !replacement
					}
				}));
				if (!outcome.ok) throw new Error(outcome.error);
				return { status: "delivered" };
			}
		});
	} catch (error) {
		const reason = formatErrorMessage(error);
		params.context.logGateway.warn(`Control UI reaction mirror failed: ${reason}`);
		return {
			status: "failed",
			reason
		};
	}
}
const sessionReactionHandlers = {
	"session.reactions.list": defineValidatedGatewayHandler("session.reactions.list", validateSessionReactionsListParams, async ({ params, respond, client, context, hasCurrentClientAuthority }) => {
		await withSessionReactionAccess({
			...params,
			client,
			context,
			respond,
			hasCurrentClientAuthority,
			write: false
		}, async ({ target, assertCurrent }) => {
			const reactions = await readSessionReactionsAsync({
				...reactionScope(target),
				sessionId: target.entry.sessionId
			});
			assertCurrent();
			respond(true, {
				sessionId: target.entry.sessionId,
				reactions
			});
		});
	}),
	"session.reactions.set": defineValidatedGatewayHandler("session.reactions.set", validateSessionReactionsSetParams, async ({ params, respond, client, context, hasCurrentClientAuthority }) => {
		await withSessionReactionAccess({
			...params,
			client,
			context,
			respond,
			hasCurrentClientAuthority,
			write: true
		}, async ({ target, assertCurrent }) => {
			const actor = gatewayClientSessionCreator(client);
			if (!actor) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "identified reaction author required"));
				return;
			}
			if (!isReactionEmoji(params.emoji)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "one emoji grapheme is required"));
				return;
			}
			const scope = reactionScope(target);
			const message = asOptionalRecord((await readSessionMessageByIdAsync({
				...scope,
				sessionId: target.entry.sessionId
			}, params.messageId, {
				currentOnly: true,
				maxBytes: Number.MAX_SAFE_INTEGER,
				allowResetArchiveFallback: false
			})).message);
			assertCurrent();
			if (!message || message.role !== "user" && message.role !== "assistant") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown message"));
				return;
			}
			let write;
			try {
				assertCurrent();
				write = await setSessionReactionAsync(scope, {
					messageId: params.messageId,
					emoji: params.emoji,
					identityId: actor.id,
					identityLabel: actor.label,
					remove: params.remove,
					expectedSessionId: target.entry.sessionId,
					assertCurrent
				});
				assertCurrent();
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error instanceof SessionReactionLimitError ? "reaction limit reached" : error instanceof SessionReactionMessageMissingError ? "unknown message" : formatErrorMessage(error)));
				return;
			}
			const { reactions } = write;
			if (!write.changed) {
				respond(true, {
					messageId: params.messageId,
					reactions,
					mirror: {
						status: "skipped",
						reason: "reaction already in that state"
					}
				});
				return;
			}
			const action = params.remove ? "removed" : "added";
			context.broadcast("session.reaction", {
				sessionKey: target.canonicalKey,
				agentId: target.agentId,
				sessionId: target.entry.sessionId,
				messageId: params.messageId,
				emoji: params.emoji,
				action,
				actor,
				reactions
			}, {
				sessionKeys: [.../* @__PURE__ */ new Set([
					params.sessionKey,
					target.canonicalKey,
					target.storeKey
				])].toSorted(),
				agentId: target.agentId
			});
			const metadata = asOptionalRecord(message["__openclaw"]);
			const author = message.role === "assistant" ? "assistant" : [
				metadata?.senderName,
				metadata?.senderUsername,
				metadata?.senderId
			].find((label) => typeof label === "string" && label.trim().length > 0) ?? "user";
			enqueueSystemEvent(`Control UI reaction ${action}: ${params.emoji} by ${actor.label ?? actor.id} on msg ${params.messageId} from ${author}`, withSystemEventOwner({
				sessionKey: target.canonicalKey,
				contextKey: `control-ui:reaction:${action}:${params.messageId}:${actor.id}:${params.emoji}:${randomUUID()}`
			}, target.agentId));
			const decision = resolveMirrorTransport(message, params.remove === true, reactions.find((reaction) => reaction.emoji === params.emoji)?.count ?? 0);
			const mirror = "skipped" in decision ? decision.skipped : await mirrorReaction({
				context,
				target,
				transport: decision.transport,
				newestRemainingEmoji: write.newestRemainingEmoji,
				emoji: params.emoji,
				remove: params.remove === true,
				assertCurrent
			});
			respond(true, {
				messageId: params.messageId,
				reactions,
				mirror
			});
		});
	})
};
//#endregion
export { sessionReactionHandlers };
