import { a as resolveWhatsAppAccount } from "./accounts-D_NGDjCx.mjs";
import { r as resolveDefaultWhatsAppAccountId, t as listAccountIds } from "./account-ids-CB5SOWjc.mjs";
import { c as normalizeWhatsAppTarget, i as looksLikeWhatsAppTargetId, n as isWhatsAppNewsletterJid, o as normalizeWhatsAppAllowFromEntry, s as normalizeWhatsAppMessagingTarget, t as isWhatsAppGroupJid } from "./normalize-target-BGra1ZnM.mjs";
import { t as resolveWhatsAppOutboundTarget } from "./resolve-outbound-target-C2eUvsTc.mjs";
import { c as normalizeWhatsAppPayloadTextPreservingIndentation, i as sendTypingWhatsApp, n as sendPollWhatsApp, o as normalizeWhatsAppOutboundPayload, s as normalizeWhatsAppPayloadText, t as sendMessageWhatsApp, v as resolveWhatsAppReactionLevel } from "./send-C6jDmcL9.mjs";
import { i as getWhatsAppRuntime } from "./runtime-BLlToOi6.mjs";
import "./normalize-DdsROMMa.mjs";
import { c as toWhatsappJid } from "./targets-runtime-RBjx3pg_.mjs";
import "./text-runtime-CHl0iPYe.mjs";
import { c as getWhatsAppApprovalApprovers, l as whatsappApprovalAuth, s as lookupInboundMessageMetaForTarget, t as resolveWhatsAppGroupSessionKey } from "./group-session-key-D22hYMdE.mjs";
import { a as formatWhatsAppConfigAllowFromEntries, o as loadWhatsAppChannelRuntime, t as createWhatsAppPluginBase } from "./shared-DLXzimjT.mjs";
import { t as whatsappCommandPolicy } from "./command-policy-BIOSHySD.mjs";
import { f as readWebAuthExistsForDecision, n as WHATSAPP_AUTH_UNSTABLE_CODE } from "./auth-store-Dh8a3cba.mjs";
import { createActionGate as createActionGate$1 } from "openclaw/plugin-sdk/channel-actions";
import { normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-core";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { collectIssuesForEnabledAccounts, createComputedAccountStatusAdapter, createDefaultChannelRuntimeState, isRecord as isRecord$1, readAccountStatusSnapshot } from "openclaw/plugin-sdk/status-helpers";
import { createMessageReceiptFromOutboundResults, defineChannelMessageAdapter, resolveOutboundSendDep } from "openclaw/plugin-sdk/channel-outbound";
import { formatCliCommand } from "openclaw/plugin-sdk/cli-runtime";
import { buildChannelOutboundSessionRoute } from "openclaw/plugin-sdk/core";
import { sendTextMediaPayload } from "openclaw/plugin-sdk/reply-payload";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1 } from "openclaw/plugin-sdk/account-id";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { buildDmGroupAccountAllowlistAdapter } from "openclaw/plugin-sdk/allowlist-config-edit";
import { createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutes } from "openclaw/plugin-sdk/approval-delivery-runtime";
import { createLazyChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { buildApprovalReactionPromptPayloadForRequest } from "openclaw/plugin-sdk/approval-reaction-runtime";
import { buildTypedApprovalPresentation } from "openclaw/plugin-sdk/approval-reply-runtime";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
import { attachChannelToResult, createAttachedChannelResultAdapter } from "openclaw/plugin-sdk/channel-send-result";
//#region extensions/whatsapp/src/approval-native.ts
function isWhatsAppApprovalTransportEnabled(params) {
	return resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).enabled;
}
const whatsappApproval = createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutes({
	channel: "whatsapp",
	channelLabel: "WhatsApp",
	authorizeActorAction: (params) => whatsappApprovalAuth.authorizeActorAction(params),
	routing: {
		defaultForwardingMode: "session",
		isTransportEnabled: isWhatsAppApprovalTransportEnabled,
		listAccountIds,
		resolveDefaultAccountId: resolveDefaultWhatsAppAccountId,
		normalizeTo: normalizeWhatsAppMessagingTarget,
		resolveApprovers: getWhatsAppApprovalApprovers,
		isOriginTargetAllowed: ({ cfg, accountId, target }) => !isWhatsAppGroupJid(target.to) || getWhatsAppApprovalApprovers({
			cfg,
			accountId
		}).length > 0
	},
	describeExecApprovalSetup: ({ accountId }) => {
		return `WhatsApp supports native exec approvals for this account when \`approvals.exec.enabled\` is true and the route allows WhatsApp. Link WhatsApp and keep the gateway running; configure \`${accountId && accountId !== "default" ? `channels.whatsapp.accounts.${accountId}` : "channels.whatsapp"}.allowFrom\` to restrict approvers.`;
	},
	render: {
		exec: { buildPendingPayload: ({ request, nowMs }) => buildWhatsAppPendingPayload({
			request,
			nowMs
		}, "exec") },
		plugin: { buildPendingPayload: ({ request, nowMs }) => buildWhatsAppPendingPayload({
			request,
			nowMs
		}, "plugin") }
	},
	createNativeRuntime: (routing) => createLazyChannelApprovalNativeRuntimeAdapter({
		capabilityBoundary: true,
		eventKinds: [
			"exec",
			"plugin",
			"system-agent"
		],
		isConfigured: ({ cfg, accountId, context }) => Boolean(context) && routing.canAnyApprovalPotentiallyRouteToChannel({
			cfg,
			accountId,
			nativeSessionOnly: true
		}),
		shouldHandle: ({ cfg, accountId, context, approvalKind, request }) => Boolean(context) && routing.shouldHandleApprovalRequest({
			cfg,
			accountId,
			approvalKind,
			request
		}),
		load: async () => (await import("./approval-handler.runtime-C0hzmMSj.mjs")).whatsappApprovalNativeRuntime
	})
});
function buildWhatsAppPendingPayload(params, approvalKind) {
	const payload = buildApprovalReactionPromptPayloadForRequest(params);
	return {
		...payload,
		presentation: buildTypedApprovalPresentation({
			approvalId: params.request.id,
			approvalKind,
			allowedDecisions: payload.allowedDecisions
		})
	};
}
const whatsappApprovalCapability = whatsappApproval.capability;
//#endregion
//#region extensions/whatsapp/src/channel-actions.ts
function areWhatsAppAgentReactionsEnabled(params) {
	if (!params.cfg.channels?.whatsapp) return false;
	if (!createActionGate$1(params.cfg.channels.whatsapp.actions)("reactions")) return false;
	return resolveWhatsAppReactionLevel({
		cfg: params.cfg,
		accountId: params.accountId
	}).agentReactionsEnabled;
}
function hasAnyWhatsAppAccountWithAgentReactionsEnabled(cfg) {
	if (!cfg.channels?.whatsapp) return false;
	return listAccountIds(cfg).some((accountId) => {
		if (!resolveWhatsAppAccount({
			cfg,
			accountId
		}).enabled) return false;
		return areWhatsAppAgentReactionsEnabled({
			cfg,
			accountId
		});
	});
}
function resolveWhatsAppAgentReactionGuidance(params) {
	if (!params.cfg.channels?.whatsapp) return;
	if (!createActionGate$1(params.cfg.channels.whatsapp.actions)("reactions")) return;
	const resolved = resolveWhatsAppReactionLevel({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!resolved.agentReactionsEnabled) return;
	return resolved.agentReactionGuidance;
}
function describeWhatsAppMessageActions(params) {
	if (!params.cfg.channels?.whatsapp) return null;
	const gate = createActionGate$1(params.cfg.channels.whatsapp.actions);
	const actions = /* @__PURE__ */ new Set();
	if (params.accountId != null ? areWhatsAppAgentReactionsEnabled({
		cfg: params.cfg,
		accountId: params.accountId ?? void 0
	}) : hasAnyWhatsAppAccountWithAgentReactionsEnabled(params.cfg)) actions.add("react");
	if (gate("polls")) actions.add("poll");
	actions.add("upload-file");
	return { actions: Array.from(actions) };
}
//#endregion
//#region extensions/whatsapp/src/outbound-send-deps.ts
const WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS = ["sendWhatsApp"];
//#endregion
//#region extensions/whatsapp/src/outbound-base.ts
function resolveQuoteLookupAccountId(cfg, accountId) {
	const explicitAccountId = normalizeOptionalAccountId(accountId);
	if (explicitAccountId) return explicitAccountId;
	return resolveDefaultWhatsAppAccountId(cfg ?? {});
}
function createWhatsAppOutboundBase({ sendMessageWhatsApp, sendPollWhatsApp, shouldLogVerbose, resolveTarget, normalizeText = normalizeWhatsAppPayloadText, skipEmptyText = true }) {
	const resolveQuotedMessageKey = (params) => {
		const replyToId = params.replyToId?.trim();
		if (!replyToId) return;
		const targetJid = toWhatsappJid(params.to);
		const cachedMeta = lookupInboundMessageMetaForTarget(params.accountId, targetJid, replyToId);
		return {
			id: replyToId,
			remoteJid: cachedMeta?.remoteJid ?? targetJid,
			fromMe: cachedMeta?.fromMe ?? false,
			participant: cachedMeta?.participant,
			...cachedMeta && cachedMeta.remoteJid !== targetJid ? { lookupTargetJid: targetJid } : {},
			messageText: cachedMeta?.body,
			media: cachedMeta?.media
		};
	};
	const dispatchMessage = async (params, text, mediaOptions, mediaDeliveryOptions) => {
		const lookupAccountId = resolveQuoteLookupAccountId(params.cfg, params.accountId);
		const quotedMessageKey = resolveQuotedMessageKey({
			accountId: lookupAccountId,
			to: params.to,
			replyToId: params.replyToId
		});
		const send = quotedMessageKey ? sendMessageWhatsApp : resolveOutboundSendDep(params.deps, "whatsapp", { legacyKeys: WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS }) ?? sendMessageWhatsApp;
		const onDeliveryResult = params.onDeliveryResult;
		return await send(params.to, text ?? normalizeText(params.text), {
			verbose: false,
			cfg: params.cfg,
			...mediaOptions,
			accountId: params.accountId ?? void 0,
			gifPlayback: params.gifPlayback,
			...mediaDeliveryOptions,
			replyToIdSource: params.replyToIdSource,
			replyToMode: params.replyToMode,
			formatting: params.formatting,
			onPlatformSendDispatch: params.onPlatformSendDispatch,
			...quotedMessageKey ? { quotedMessageKey } : {},
			...onDeliveryResult ? { onDeliveryResult: async (result) => {
				await onDeliveryResult(attachChannelToResult("whatsapp", result));
			} } : {}
		});
	};
	const outbound = {
		deliveryMode: "gateway",
		textChunkLimit: 4e3,
		sanitizeText: ({ text }) => normalizeText(text),
		deliveryCapabilities: { durableFinal: {
			text: true,
			replyTo: true,
			messageSendingHooks: true
		} },
		pollMaxOptions: 12,
		resolveTarget,
		...createAttachedChannelResultAdapter({
			channel: "whatsapp",
			sendText: async (params) => {
				const normalizedText = normalizeText(params.text);
				if (skipEmptyText && !normalizedText) return { messageId: "" };
				return await dispatchMessage(params, normalizedText);
			},
			sendMedia: async (params) => await dispatchMessage(params, void 0, {
				mediaUrl: params.mediaUrl,
				mediaAccess: params.mediaAccess,
				mediaLocalRoots: params.mediaLocalRoots,
				mediaReadFile: params.mediaReadFile,
				...params.audioAsVoice === void 0 ? {} : { audioAsVoice: params.audioAsVoice }
			}, { forceDocument: params.forceDocument }),
			sendPoll: async ({ cfg, to, poll, accountId }) => await sendPollWhatsApp(to, poll, {
				verbose: shouldLogVerbose(),
				accountId: accountId ?? void 0,
				cfg
			})
		})
	};
	return {
		...outbound,
		sendPayload: async (ctx) => {
			const payload = normalizeWhatsAppOutboundPayload(ctx.payload, { normalizeText });
			if (!payload.text && !(payload.mediaUrl || payload.mediaUrls?.length)) {
				if (ctx.payload.interactive || ctx.payload.presentation || ctx.payload.channelData) throw new Error("WhatsApp sendPayload does not support structured-only payloads without text or media.");
				return {
					channel: "whatsapp",
					messageId: ""
				};
			}
			return await sendTextMediaPayload({
				channel: "whatsapp",
				ctx: {
					...ctx,
					payload
				},
				adapter: outbound
			});
		}
	};
}
//#endregion
//#region extensions/whatsapp/src/channel-outbound.ts
const loadWhatsAppApprovalReactionsModule = createLazyRuntimeModule(() => import("./approval-reactions-BnXw-UZI.mjs").then((n) => n.t));
const loadWhatsAppQuestionReactionsModule = createLazyRuntimeModule(() => import("./question-reactions-D3Zq9Gbn.mjs").then((n) => n.n));
function normalizeWhatsAppChannelPayloadText(text) {
	return normalizeWhatsAppPayloadTextPreservingIndentation(text);
}
function normalizeWhatsAppChannelSendText(text) {
	const normalized = normalizeWhatsAppChannelPayloadText(text);
	return normalized.trim() ? normalized : "";
}
async function prepareWhatsAppApprovalPayloadForDelivery(params) {
	const questionPayload = questionGatewayRuntime.prepareReactionPayloadForDelivery({
		payload: params.payload,
		presentation: params.presentation
	});
	if (questionPayload) return questionPayload;
	return (await loadWhatsAppApprovalReactionsModule()).prepareWhatsAppApprovalPayloadForDelivery({
		payload: params.payload,
		presentation: params.presentation
	});
}
async function registerDeliveredWhatsAppApprovalPayload(params) {
	(await loadWhatsAppQuestionReactionsModule()).registerWhatsAppQuestionReactionTargetForDeliveredPayload(params);
	await (await loadWhatsAppApprovalReactionsModule()).registerWhatsAppApprovalReactionTargetForDeliveredPayload(params);
}
const whatsappChannelOutbound = {
	...createWhatsAppOutboundBase({
		sendMessageWhatsApp: async (to, text, options) => await sendMessageWhatsApp(to, text, {
			...options,
			preserveLeadingWhitespace: true
		}),
		sendPollWhatsApp,
		shouldLogVerbose: () => getWhatsAppRuntime().logging.shouldLogVerbose(),
		resolveTarget: ({ to, allowFrom, mode }) => resolveWhatsAppOutboundTarget({
			to,
			allowFrom,
			mode
		}),
		normalizeText: normalizeWhatsAppChannelSendText
	}),
	sendTextOnlyErrorPayloads: true,
	renderPresentation: prepareWhatsAppApprovalPayloadForDelivery,
	afterDeliverPayload: registerDeliveredWhatsAppApprovalPayload,
	normalizePayload: ({ payload }) => ({
		...payload,
		text: normalizeWhatsAppChannelPayloadText(payload.text)
	})
};
function toWhatsAppMessageSendResult(result, replyToId) {
	const source = result;
	const receipt = result.receipt ?? createMessageReceiptFromOutboundResults({
		results: result.messageId ? [{
			channel: "whatsapp",
			messageId: result.messageId,
			toJid: source.toJid
		}] : [],
		kind: "text",
		...replyToId ? { replyToId } : {}
	});
	return {
		messageId: result.messageId || receipt.primaryPlatformMessageId,
		receipt
	};
}
const whatsappMessageAdapter = defineChannelMessageAdapter({
	id: "whatsapp",
	durableFinal: { capabilities: {
		text: true,
		replyTo: true,
		messageSendingHooks: true
	} },
	send: { text: async ({ onDeliveryResult, ...ctx }) => {
		return toWhatsAppMessageSendResult(await whatsappChannelOutbound.sendText({
			...ctx,
			onDeliveryResult: onDeliveryResult ? async (progress) => {
				await onDeliveryResult(toWhatsAppMessageSendResult(progress, ctx.replyToId));
			} : void 0
		}), ctx.replyToId);
	} }
});
//#endregion
//#region extensions/whatsapp/src/group-intro.ts
function resolveWhatsAppMentionStripRegexes(ctx) {
	const selfE164 = (ctx.To ?? "").replace(/^whatsapp:/i, "");
	if (!selfE164) return [];
	const escaped = selfE164.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return [new RegExp(escaped, "g"), new RegExp(`@${escaped}`, "g")];
}
//#endregion
//#region extensions/whatsapp/src/heartbeat.ts
async function checkWhatsAppHeartbeatReady(params) {
	if (params.cfg.channels?.whatsapp?.enabled === false) return {
		ok: false,
		reason: "whatsapp-disabled"
	};
	const account = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const authState = await (params.deps?.readWebAuthExistsForDecision ?? readWebAuthExistsForDecision)(account.authDir);
	if (authState.outcome === "unstable") return {
		ok: false,
		reason: WHATSAPP_AUTH_UNSTABLE_CODE
	};
	if (!authState.exists) return {
		ok: false,
		reason: "whatsapp-not-linked"
	};
	if (!(params.deps?.hasActiveWebListener ? params.deps.hasActiveWebListener(account.accountId) : Boolean((await loadWhatsAppChannelRuntime()).getActiveWebListener(account.accountId)))) return {
		ok: false,
		reason: "whatsapp-not-running"
	};
	return {
		ok: true,
		reason: "ok"
	};
}
//#endregion
//#region extensions/whatsapp/src/session-route.ts
function resolveWhatsAppOutboundSessionRoute(params) {
	const normalized = normalizeWhatsAppTarget(params.target);
	if (!normalized) return null;
	const isGroup = isWhatsAppGroupJid(normalized);
	const isNewsletter = isWhatsAppNewsletterJid(normalized);
	const chatType = isGroup ? "group" : isNewsletter ? "channel" : "direct";
	const route = buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "whatsapp",
		accountId: params.accountId,
		recipientSessionExact: true,
		peer: {
			kind: chatType,
			id: normalized
		},
		chatType,
		from: normalized,
		to: normalized
	});
	return isGroup ? {
		...route,
		sessionKey: resolveWhatsAppGroupSessionKey({
			sessionKey: route.sessionKey,
			accountId: params.accountId
		})
	} : route;
}
//#endregion
//#region extensions/whatsapp/src/status-issues.ts
const WHATSAPP_ACCOUNT_STATUS_FIELDS = [
	"statusState",
	"linked",
	"reconnectAttempts",
	"lastDisconnect",
	"lastInboundAt",
	"lastError",
	"healthState"
];
const RECENT_DISCONNECT_WARNING_WINDOW_MS = 9e5;
function readLastDisconnect(value) {
	if (typeof value === "string") {
		const error = normalizeOptionalString(value);
		return error ? {
			at: null,
			error
		} : null;
	}
	if (!isRecord$1(value)) return null;
	return {
		at: typeof value.at === "number" ? value.at : null,
		error: normalizeOptionalString(value.error)
	};
}
function isRecentDisconnect(disconnect, now = Date.now()) {
	if (disconnect?.at == null) return false;
	return now - disconnect.at <= RECENT_DISCONNECT_WARNING_WINDOW_MS;
}
function collectWhatsAppStatusIssues(accounts) {
	return collectIssuesForEnabledAccounts({
		accounts,
		readAccount: (value) => readAccountStatusSnapshot(value, WHATSAPP_ACCOUNT_STATUS_FIELDS),
		collectIssues: ({ account, accountId, issues }) => {
			const linked = account.linked === true;
			const statusState = normalizeOptionalString(account.statusState);
			const running = account.running === true;
			const connected = account.connected === true;
			const reconnectAttempts = typeof account.reconnectAttempts === "number" ? account.reconnectAttempts : null;
			const lastInboundAt = typeof account.lastInboundAt === "number" ? account.lastInboundAt : null;
			const lastDisconnect = readLastDisconnect(account.lastDisconnect);
			const lastError = normalizeOptionalString(account.lastError) ?? lastDisconnect?.error;
			const healthState = normalizeOptionalString(account.healthState);
			if (statusState === "unstable") {
				issues.push({
					channel: "whatsapp",
					accountId,
					kind: "auth",
					message: "Auth state is still stabilizing.",
					fix: "Wait a moment for queued credential writes to finish, then retry the command or rerun health."
				});
				return;
			}
			if (healthState === "logged-out") {
				issues.push({
					channel: "whatsapp",
					accountId,
					kind: "auth",
					message: `Session logged out${lastError ? `: ${lastError}` : "."}`,
					fix: `Run: ${formatCliCommand("openclaw channels login")} (scan QR on the gateway host).`
				});
				return;
			}
			if (!linked) {
				issues.push({
					channel: "whatsapp",
					accountId,
					kind: "auth",
					message: "Not linked (no WhatsApp Web session).",
					fix: `Run: ${formatCliCommand("openclaw channels login")} (scan QR on the gateway host).`
				});
				return;
			}
			if (healthState === "stale") {
				const staleSuffix = lastInboundAt != null ? ` (last inbound ${Math.max(0, Math.floor((Date.now() - lastInboundAt) / 6e4))}m ago)` : "";
				issues.push({
					channel: "whatsapp",
					accountId,
					kind: "runtime",
					message: `Linked but stale${staleSuffix}${lastError ? `: ${lastError}` : "."}`,
					fix: `Run: ${formatCliCommand("openclaw doctor")} (or restart the gateway). If it persists, relink via channels login and check logs.`
				});
				return;
			}
			if (healthState === "reconnecting" || healthState === "conflict" || healthState === "stopped") {
				const stateLabel = healthState === "conflict" ? "session conflict" : healthState === "reconnecting" ? "reconnecting" : "stopped";
				issues.push({
					channel: "whatsapp",
					accountId,
					kind: "runtime",
					message: `Linked but ${stateLabel}${reconnectAttempts != null ? ` (reconnectAttempts=${reconnectAttempts})` : ""}${lastError ? `: ${lastError}` : "."}`,
					fix: `Run: ${formatCliCommand("openclaw doctor")} (or restart the gateway). If it persists, relink via channels login and check logs.`
				});
				return;
			}
			if (linked && running && connected && reconnectAttempts != null && reconnectAttempts > 0 && isRecentDisconnect(lastDisconnect)) {
				issues.push({
					channel: "whatsapp",
					accountId,
					kind: "runtime",
					message: `Linked but recently reconnected (reconnectAttempts=${reconnectAttempts})${lastError ? `: ${lastError}` : "."}`,
					fix: `Watch: ${formatCliCommand("openclaw logs --follow")} and run ${formatCliCommand("openclaw channels status --probe")} if disconnects continue. If it keeps flapping, restart the gateway or relink via channels login.`
				});
				return;
			}
			if (running && !connected) issues.push({
				channel: "whatsapp",
				accountId,
				kind: "runtime",
				message: `Linked but disconnected${reconnectAttempts != null ? ` (reconnectAttempts=${reconnectAttempts})` : ""}${lastError ? `: ${lastError}` : "."}`,
				fix: `Run: ${formatCliCommand("openclaw doctor")} (or restart the gateway). If it persists, relink via channels login and check logs.`
			});
		}
	});
}
//#endregion
//#region extensions/whatsapp/src/channel.ts
const loadWhatsAppDirectoryConfig = createLazyRuntimeModule(() => import("./directory-config-DOMURvI_.mjs").then((n) => n.t));
const loadWhatsAppChannelReactAction = createLazyRuntimeModule(() => import("./channel-react-action-1iBiEnq7.mjs"));
function resolveWhatsAppTargetInfo(raw) {
	const normalized = normalizeWhatsAppTarget(raw);
	if (!normalized) return null;
	return {
		to: normalized,
		chatType: isWhatsAppGroupJid(normalized) ? "group" : isWhatsAppNewsletterJid(normalized) ? "channel" : "direct"
	};
}
function resolveWhatsAppMessageActionTarget(params) {
	const chatJid = params.args.chatJid;
	return typeof chatJid === "string" ? normalizeWhatsAppMessagingTarget(chatJid) : void 0;
}
const whatsappPlugin = createChatChannelPlugin({
	pairing: {
		idLabel: "whatsappSenderId",
		normalizeAllowEntry: (entry) => normalizeWhatsAppAllowFromEntry(entry) ?? ""
	},
	outbound: whatsappChannelOutbound,
	threading: { scopedAccountReplyToMode: {
		resolveAccount: (cfg, accountId) => resolveWhatsAppAccount({
			cfg,
			accountId
		}),
		resolveReplyToMode: (account) => account.replyToMode
	} },
	base: {
		...createWhatsAppPluginBase(),
		allowlist: buildDmGroupAccountAllowlistAdapter({
			channelId: "whatsapp",
			resolveAccount: resolveWhatsAppAccount,
			normalize: ({ values }) => formatWhatsAppConfigAllowFromEntries(values),
			resolveDmAllowFrom: (account) => account.allowFrom,
			resolveGroupAllowFrom: (account) => account.groupAllowFrom,
			resolveDmPolicy: (account) => account.dmPolicy,
			resolveGroupPolicy: (account) => account.groupPolicy
		}),
		mentions: { stripRegexes: ({ ctx }) => resolveWhatsAppMentionStripRegexes(ctx) },
		commands: whatsappCommandPolicy,
		bindings: {
			compileConfiguredBinding: ({ conversationId }) => {
				const normalized = normalizeWhatsAppTarget(conversationId);
				return normalized ? { conversationId: normalized } : null;
			},
			matchInboundConversation: ({ compiledBinding, conversationId }) => {
				if (normalizeWhatsAppTarget(conversationId) === compiledBinding.conversationId) return {
					conversationId: compiledBinding.conversationId,
					matchPriority: 2
				};
				return null;
			}
		},
		agentPrompt: { reactionGuidance: ({ cfg, accountId }) => {
			const level = resolveWhatsAppAgentReactionGuidance({
				cfg,
				accountId: accountId ?? void 0
			});
			return level ? {
				level,
				channelLabel: "WhatsApp"
			} : void 0;
		} },
		messaging: {
			targetPrefixes: ["whatsapp"],
			normalizeTarget: normalizeWhatsAppMessagingTarget,
			resolveOutboundSessionRoute: (params) => resolveWhatsAppOutboundSessionRoute(params),
			inferTargetChatType: ({ to }) => resolveWhatsAppTargetInfo(to)?.chatType,
			targetResolver: {
				looksLikeId: looksLikeWhatsAppTargetId,
				hint: "<E.164|group JID|newsletter JID>"
			}
		},
		message: whatsappMessageAdapter,
		directory: {
			self: async ({ cfg, accountId }) => {
				const account = resolveWhatsAppAccount({
					cfg,
					accountId
				});
				const { e164, jid } = (await loadWhatsAppChannelRuntime()).readWebSelfId(account.authDir);
				const id = e164 ?? jid;
				if (!id) return null;
				return {
					kind: "user",
					id,
					name: account.name,
					raw: {
						e164,
						jid
					}
				};
			},
			listPeers: async (params) => (await loadWhatsAppDirectoryConfig()).listWhatsAppDirectoryPeersFromConfig(params),
			listGroups: async (params) => (await loadWhatsAppDirectoryConfig()).listWhatsAppDirectoryGroupsFromConfig(params),
			listGroupsLive: async (params) => (await loadWhatsAppDirectoryConfig()).listWhatsAppDirectoryGroupsLive(params)
		},
		actions: {
			messageActionTargetAliases: { react: {
				aliases: ["chatJid", "messageId"],
				deliveryTargetAliases: ["chatJid"],
				resolveDeliveryTarget: resolveWhatsAppMessageActionTarget
			} },
			describeMessageTool: ({ cfg, accountId }) => describeWhatsAppMessageActions({
				cfg,
				accountId
			}),
			supportsAction: ({ action }) => action === "react" || action === "upload-file",
			resolveExecutionMode: ({ action }) => action === "react" || action === "upload-file" ? "gateway" : "local",
			handleAction: async ({ action, params, cfg, accountId, requesterSenderId, mediaAccess, mediaLocalRoots, mediaReadFile, toolContext }) => await (await loadWhatsAppChannelReactAction()).handleWhatsAppMessageAction({
				action,
				params,
				cfg,
				accountId,
				requesterSenderId,
				mediaAccess,
				mediaLocalRoots,
				mediaReadFile,
				toolContext
			})
		},
		approvalCapability: whatsappApprovalCapability,
		auth: { login: async ({ cfg, accountId, runtime, verbose }) => {
			const resolvedAccountId = accountId?.trim() || whatsappPlugin.config.defaultAccountId?.(cfg) || DEFAULT_ACCOUNT_ID$1;
			await (await loadWhatsAppChannelRuntime()).loginWeb(Boolean(verbose), void 0, runtime, resolvedAccountId);
		} },
		heartbeat: {
			checkReady: async ({ cfg, accountId, deps }) => await checkWhatsAppHeartbeatReady({
				cfg,
				accountId: accountId ?? void 0,
				deps
			}),
			sendTyping: async ({ cfg, to, accountId }) => {
				await sendTypingWhatsApp(to, {
					cfg,
					...accountId ? { accountId } : {}
				});
			}
		},
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID$1, {
				connected: false,
				reconnectAttempts: 0,
				lastConnectedAt: null,
				lastDisconnect: null,
				lastInboundAt: null,
				lastMessageAt: null,
				lastEventAt: null,
				busy: false,
				lastRunActivityAt: null,
				healthState: "stopped",
				lifecycle: "stopped"
			}),
			collectStatusIssues: collectWhatsAppStatusIssues,
			buildChannelSummary: async ({ account, snapshot }) => {
				const channelRuntime = await loadWhatsAppChannelRuntime();
				const authDir = account.authDir;
				const auth = authDir ? await channelRuntime.readWebAuthSnapshot(authDir) : {
					state: "not-linked",
					authAgeMs: null,
					selfId: {
						e164: null,
						jid: null,
						lid: null
					}
				};
				const linked = snapshot.healthState === "logged-out" ? false : typeof snapshot.linked === "boolean" ? snapshot.linked : auth.state === "unstable" ? void 0 : auth.state === "linked";
				const summaryAuthState = auth.state === "unstable" ? auth.state : linked === true ? "linked" : linked === false ? "not-linked" : void 0;
				const statusState = summaryAuthState === void 0 ? void 0 : summaryAuthState;
				const authAgeMs = typeof linked === "boolean" && linked ? auth.authAgeMs : null;
				const self = typeof linked === "boolean" && linked ? auth.selfId : {
					e164: null,
					jid: null,
					lid: null
				};
				return {
					configured: Boolean(account.authDir),
					...statusState ? { statusState } : {},
					...typeof linked === "boolean" ? { linked } : {},
					authAgeMs,
					self,
					running: snapshot.running ?? false,
					connected: snapshot.connected ?? false,
					lastConnectedAt: snapshot.lastConnectedAt ?? null,
					lastDisconnect: snapshot.lastDisconnect ?? null,
					reconnectAttempts: snapshot.reconnectAttempts,
					lastInboundAt: snapshot.lastInboundAt ?? snapshot.lastMessageAt ?? null,
					lastMessageAt: snapshot.lastMessageAt ?? null,
					lastEventAt: snapshot.lastEventAt ?? null,
					busy: snapshot.busy ?? false,
					lastRunActivityAt: snapshot.lastRunActivityAt ?? null,
					lastError: snapshot.lastError ?? null,
					healthState: snapshot.healthState ?? void 0,
					lifecycle: snapshot.lifecycle ?? void 0,
					...snapshot.terminalDisconnect ? { terminalDisconnect: snapshot.terminalDisconnect } : {}
				};
			},
			resolveAccountSnapshot: ({ account, runtime }) => {
				const locallyRevoked = runtime?.healthState === "logged-out";
				return {
					accountId: account.accountId,
					name: account.name,
					enabled: account.enabled,
					configured: Boolean(account.authDir),
					extra: {
						...locallyRevoked ? {
							statusState: "not-linked",
							linked: false
						} : {},
						connected: runtime?.connected ?? false,
						reconnectAttempts: runtime?.reconnectAttempts,
						lastConnectedAt: runtime?.lastConnectedAt ?? null,
						lastDisconnect: runtime?.lastDisconnect ?? null,
						lastInboundAt: runtime?.lastInboundAt ?? runtime?.lastMessageAt ?? null,
						lastMessageAt: runtime?.lastMessageAt ?? null,
						lastEventAt: runtime?.lastEventAt ?? null,
						busy: runtime?.busy ?? false,
						lastRunActivityAt: runtime?.lastRunActivityAt ?? null,
						healthState: runtime?.healthState ?? void 0,
						...runtime?.terminalDisconnect ? { terminalDisconnect: runtime.terminalDisconnect } : {},
						dmPolicy: account.dmPolicy,
						allowFrom: account.allowFrom
					}
				};
			},
			logSelfId: ({ account, runtime, includeChannelPrefix }) => {
				loadWhatsAppChannelRuntime().then((runtimeExports) => runtimeExports.logWebSelfId(account.authDir, runtime, includeChannelPrefix));
			}
		}),
		gateway: {
			startAccount: async (ctx) => {
				const account = ctx.account;
				const { e164, jid } = (await loadWhatsAppChannelRuntime()).readWebSelfId(account.authDir);
				const identity = e164 ? e164 : jid ? `jid ${jid}` : "unknown";
				ctx.log?.info(`[${account.accountId}] starting provider (${identity})`);
				return (await loadWhatsAppChannelRuntime()).monitorWebChannel(getWhatsAppRuntime().logging.shouldLogVerbose(), void 0, true, void 0, ctx.runtime, ctx.abortSignal, {
					statusSink: (next) => ctx.setStatus({
						accountId: ctx.accountId,
						...next
					}),
					accountId: account.accountId,
					channelRuntime: ctx.channelRuntime
				});
			},
			loginWithQrStart: async ({ accountId, force, timeoutMs, verbose }) => await (await loadWhatsAppChannelRuntime()).startWebLoginWithQr({
				accountId,
				force,
				timeoutMs,
				verbose
			}),
			loginWithQrWait: async ({ accountId, timeoutMs, currentQrDataUrl }) => await (await loadWhatsAppChannelRuntime()).waitForWebLogin({
				accountId,
				timeoutMs,
				currentQrDataUrl
			}),
			logoutAccount: async ({ account, runtime }) => {
				const cleared = await (await loadWhatsAppChannelRuntime()).logoutWeb({
					authDir: account.authDir,
					isLegacyAuthDir: account.isLegacyAuthDir,
					runtime
				});
				return {
					cleared,
					loggedOut: cleared
				};
			}
		}
	}
});
//#endregion
export { WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS as n, whatsappPlugin as t };
