import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { Ng as errorShape, Np as isReactionEmoji, Oi as validateSessionReactionsListParams, ki as validateSessionReactionsSetParams } from "./src-pLJQA6J5.mjs";
import { n as enqueueKeyedTask } from "./keyed-async-queue-CTreGrmR.mjs";
import { l as withSystemEventOwner } from "./system-event-ownership-DAgHWXZ1.mjs";
import { s as enqueueSystemEvent } from "./system-events-Bf4ozS7L.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as hasOperatorBoundary } from "./operator-role-policy-Coro3qc5.mjs";
import { n as getRuntimeVisibleChannelPlugin } from "./runtime-visible-channels-GGZXKqeN.mjs";
import { n as SessionReactionMessageMissingError, t as SessionReactionLimitError } from "./session-reaction-errors-857xqNjc.mjs";
import "./session-reaction-store-CRimN3Hk.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DXWhtQve.mjs";
import { _ as resolveSessionVisibility } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { t as SessionMutationFactsUnavailableError } from "./session-sharing-incognito-DepuXzQy.mjs";
import "./session-sharing-preparation-DAfvBDLL.mjs";
import { t as isSameSessionSharingTarget } from "./session-sharing-target-read-DwJlM38W.mjs";
import { r as resolveChannelAccount } from "./account-resolution-akTcFkRf.mjs";
import { n as defineValidatedGatewayHandler } from "./validation--xIH1Pj-.mjs";
import { a as readSessionConversationBindingAsync, o as readSessionMessageByIdAsync, p as readSessionReactionsAsync } from "./session-transcript-readers-ChK_-oGN.mjs";
import { l as resolveMessageActionDiscoveryForPluginAsync, o as resolveCurrentChannelMessageToolDiscoveryAdapter, t as createMessageActionDiscoveryContext } from "./message-action-discovery-Cx3B-j_q.mjs";
import { t as isAccountEnabled } from "./account-enabled-ClTLgAXM.mjs";
import { t as isConfiguredChannel } from "./channel-selection-D2GvoKZ-.mjs";
import { i as resolveMessageActionOutcome } from "./message-action-contracts-CNqJc02D.mjs";
import { n as prepareSessionSharingAccess } from "./sessions-sharing-authority-D3-YNQkH.mjs";
import { t as commitSessionReaction } from "./session-reaction-mutation-D5MqGw1j.mjs";
import { a as requireVisibleSuggestionRole } from "./sessions-suggestions-access-Dvq3mGgw.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/sessions-reactions-access.ts
function deny(error) {
	throw new SessionMutationAuthorizationChangedError(error);
}
/** Retain the selected facts owner through reads, commit grants, and mirror settlement. */
async function withSessionReactionAccess(params, consume) {
	const { client, respond } = params;
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			const access = _usingCtx$1.u(await prepareSessionSharingAccess({
				...params,
				prepareMembership: true
			}, () => deny(errorShape(ErrorCodes.FORBIDDEN, "reaction author or session authority changed"))));
			if (!access) return;
			const readCurrent = (selected) => {
				const { target, policyConfig, sharing } = access.readCurrent();
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
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	} catch (error) {
		respond(false, void 0, error instanceof SessionMutationAuthorizationChangedError ? error.error : errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error)));
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
				if (!discovery || !(await resolveMessageActionDiscoveryForPluginAsync({
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
				})).actions.includes("react")) return {
					status: "skipped",
					reason: "source channel does not support reactions"
				};
				params.assertCurrent();
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
				const { runMessageAction } = await import("./message-action-runner-BrvKwxcU.mjs");
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
				write = await commitSessionReaction({
					scope,
					sessionKey: target.canonicalKey,
					sessionId: target.entry.sessionId,
					agentId: target.agentId,
					messageId: params.messageId,
					emoji: params.emoji,
					actor,
					remove: params.remove,
					sessionKeys: [params.sessionKey, target.storeKey],
					context,
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
