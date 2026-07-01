import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { c as isRecord } from "./utils-BApvfmPs.js";
import { r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-5IgE9UKY.js";
import { x as sendTextMediaPayload } from "./reply-payload-CBQ2d2jT.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-D-7_JraP.js";
import { i as createActionGate } from "./common-B2QjWqqG.js";
import { a as chunkText } from "./chunk-ulm_3glE.js";
import { n as resolveOutboundSendDep } from "./send-deps-DjbvQHZ4.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-BDn00i4I.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { a as listCombinedAccountIds, s as resolveListedDefaultAccountId } from "./account-helpers-DihevCTm.js";
import "./account-core-Dpb-yXIR.js";
import { i as createChatChannelPlugin, t as buildChannelOutboundSessionRoute } from "./core-DINDVkoE.js";
import "./channel-core-C7PiX3lP.js";
import { r as createChannelApprovalCapability } from "./approval-delivery-helpers-Ddw9uAMj.js";
import "./approval-delivery-runtime-BC8bGkG0.js";
import { n as createLazyChannelApprovalNativeRuntimeAdapter } from "./approval-handler-adapter-runtime-DLWtIqHq.js";
import { a as createNativeApprovalForwardingFallbackSuppressor, i as createNativeApprovalChannelRouteGates, n as createChannelApproverDmTargetResolver, r as createChannelNativeOriginTargetResolver } from "./approval-native-helpers-BQP5fMRA.js";
import "./approval-native-runtime-KhBiC_33.js";
import { o as buildApprovalReactionPromptPayloadForRequest } from "./approval-reaction-runtime-B2EZW3eQ.js";
import "./reply-chunking-DDVYtWXI.js";
import { T as defineChannelMessageAdapter } from "./channel-outbound-BNKGCEf1.js";
import "./cli-runtime-Comrp7kq.js";
import { n as buildDmGroupAccountAllowlistAdapter } from "./allowlist-config-edit-CeTa5wPZ.js";
import { d as createDefaultChannelRuntimeState, h as collectIssuesForEnabledAccounts, l as createAsyncComputedAccountStatusAdapter, m as asString } from "./status-helpers-DjJ0OuL_.js";
import "./channel-actions-CdLhqkfP.js";
import { i as createAttachedChannelResultAdapter } from "./channel-send-result-Dn_C6AJS.js";
import { r as resolveDefaultWhatsAppAccountId, t as listAccountIds } from "./account-ids-Bgg1wvIw.js";
import { a as resolveWhatsAppAccount } from "./accounts-D4l-iMIF.js";
import { c as normalizeWhatsAppTarget, i as looksLikeWhatsAppTargetId, n as isWhatsAppNewsletterJid, o as normalizeWhatsAppAllowFromEntry, s as normalizeWhatsAppMessagingTarget, t as isWhatsAppGroupJid } from "./normalize-target-D-WjuB2k.js";
import { t as resolveWhatsAppOutboundTarget } from "./resolve-outbound-target-QcdbIXoT.js";
import { t as resolveWhatsAppReactionLevel } from "./reaction-level-DNbrizS1.js";
import "./normalize-Du6_eP-O.js";
import { a as normalizeWhatsAppOutboundPayload, h as whatsappApprovalAuth, i as sendTypingWhatsApp, m as getWhatsAppApprovalApprovers, n as sendPollWhatsApp, o as normalizeWhatsAppPayloadText, s as normalizeWhatsAppPayloadTextPreservingIndentation, t as sendMessageWhatsApp } from "./send-ah50qpHA.js";
import { n as getWhatsAppRuntime } from "./runtime-BRPL03_u.js";
import { s as toWhatsappJid } from "./text-runtime-DshxRpTA.js";
import { t as createWhatsAppLoginTool } from "./agent-tools-login-Cd2MUFE4.js";
import { i as lookupInboundMessageMetaForTarget } from "./quoted-message-DKCzkVF7.js";
import { t as whatsappCommandPolicy } from "./command-policy-BIOSHySD.js";
import { a as resolveWhatsAppGroupToolPolicy, c as formatWhatsAppConfigAllowFromEntries, i as resolveWhatsAppGroupRequireMention, n as loadWhatsAppChannelRuntime, o as resolveWhatsAppGroupIntroHint, r as whatsappSetupWizardProxy, s as resolveWhatsAppMentionStripRegexes, t as createWhatsAppPluginBase } from "./shared-C5FmPz-_.js";
import { d as readWebAuthExistsForDecision, n as WHATSAPP_AUTH_UNSTABLE_CODE } from "./auth-store-BERBvAOr.js";
import { t as whatsappSetupAdapter } from "./setup-core-Bz4Xjc4v.js";
import { t as detectWhatsAppLegacyStateMigrations } from "./state-migrations-CJAXArZs.js";
//#region extensions/whatsapp/src/approval-native.ts
const DEFAULT_APPROVAL_FORWARDING_MODE = "session";
function isWhatsAppApprovalTransportEnabled(params) {
	return resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).enabled;
}
function normalizeWhatsAppForwardTarget(target) {
	if (normalizeLowercaseStringOrEmpty(target.channel) !== "whatsapp") return null;
	const to = normalizeWhatsAppMessagingTarget(target.to);
	if (!to) return null;
	return {
		to,
		accountId: normalizeOptionalString(target.accountId),
		threadId: target.threadId ?? null
	};
}
function resolveTurnSourceWhatsAppOriginTarget(request) {
	if (normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel) !== "whatsapp") return null;
	const to = normalizeWhatsAppMessagingTarget(request.request.turnSourceTo ?? "");
	if (!to) return null;
	return {
		to,
		accountId: normalizeOptionalString(request.request.turnSourceAccountId)
	};
}
function resolveSessionWhatsAppOriginTarget(sessionTarget) {
	const to = normalizeWhatsAppMessagingTarget(sessionTarget.to);
	return to ? {
		to,
		accountId: normalizeOptionalString(sessionTarget.accountId)
	} : null;
}
const { canApprovalPotentiallyRouteToChannel: canApprovalPotentiallyRouteToWhatsApp, canAnyApprovalPotentiallyRouteToChannel: canAnyApprovalPotentiallyRouteToWhatsApp, isSessionApprovalEligible: isWhatsAppSessionApprovalEligible, isExplicitTargetEligible: isWhatsAppExplicitTargetEligible, shouldHandleApprovalRequest: shouldHandleWhatsAppApprovalRequest } = createNativeApprovalChannelRouteGates({
	channel: "whatsapp",
	defaultForwardingMode: DEFAULT_APPROVAL_FORWARDING_MODE,
	isTransportEnabled: isWhatsAppApprovalTransportEnabled,
	listAccountIds,
	resolveDefaultAccountId: resolveDefaultWhatsAppAccountId,
	normalizeForwardTarget: normalizeWhatsAppForwardTarget,
	resolveTurnSourceTarget: resolveTurnSourceWhatsAppOriginTarget
});
const resolveWhatsAppOriginTargetBase = createChannelNativeOriginTargetResolver({
	channel: "whatsapp",
	shouldHandleRequest: shouldHandleWhatsAppApprovalRequest,
	resolveTurnSourceTarget: resolveTurnSourceWhatsAppOriginTarget,
	resolveSessionTarget: resolveSessionWhatsAppOriginTarget,
	normalizeTarget: (target) => {
		const to = normalizeWhatsAppMessagingTarget(target.to);
		return to ? {
			...target,
			to
		} : null;
	}
});
function resolveWhatsAppOriginTarget(params) {
	const target = resolveWhatsAppOriginTargetBase(params);
	if (!target) return null;
	if (isWhatsAppGroupJid(target.to) && getWhatsAppApprovalApprovers({
		cfg: params.cfg,
		accountId: params.accountId
	}).length === 0) return null;
	return target;
}
const resolveWhatsAppApproverDmTargets = createChannelApproverDmTargetResolver({
	shouldHandleRequest: shouldHandleWhatsAppApprovalRequest,
	resolveApprovers: getWhatsAppApprovalApprovers,
	mapApprover: (approver, params) => {
		const to = normalizeWhatsAppMessagingTarget(approver);
		if (!to) return null;
		return {
			to,
			accountId: normalizeOptionalString(params.accountId)
		};
	}
});
const shouldSuppressWhatsAppForwardingFallback = createNativeApprovalForwardingFallbackSuppressor({
	channel: "whatsapp",
	normalizeForwardTarget: normalizeWhatsAppForwardTarget,
	resolveAccountId: ({ forwardingTarget, request }) => forwardingTarget.accountId ?? normalizeOptionalString(request.request.turnSourceAccountId),
	resolveForwardingTargetForMatch: ({ forwardingTarget, accountId }) => ({
		...forwardingTarget,
		accountId
	}),
	isSessionRouteEligible: isWhatsAppSessionApprovalEligible,
	isExplicitTargetEligible: isWhatsAppExplicitTargetEligible,
	resolveOriginTarget: resolveWhatsAppOriginTarget,
	resolveApproverDmTargets: resolveWhatsAppApproverDmTargets
});
function buildWhatsAppExecPendingPayload(params) {
	return buildApprovalReactionPromptPayloadForRequest(params);
}
function buildWhatsAppPluginPendingPayload(params) {
	return buildApprovalReactionPromptPayloadForRequest(params);
}
const whatsappApprovalCapability = createChannelApprovalCapability({
	...whatsappApprovalAuth,
	getActionAvailabilityState: ({ cfg, accountId, approvalKind }) => (approvalKind ? canApprovalPotentiallyRouteToWhatsApp({
		cfg,
		accountId,
		approvalKind
	}) : canAnyApprovalPotentiallyRouteToWhatsApp({
		cfg,
		accountId
	})) ? { kind: "enabled" } : { kind: "disabled" },
	getExecInitiatingSurfaceState: ({ cfg, accountId }) => canApprovalPotentiallyRouteToWhatsApp({
		cfg,
		accountId,
		approvalKind: "exec"
	}) ? { kind: "enabled" } : { kind: "disabled" },
	describeExecApprovalSetup: ({ accountId }) => {
		return `WhatsApp supports native exec approvals for this account when \`approvals.exec.enabled\` is true and the route allows WhatsApp. Link WhatsApp and keep the gateway running; configure \`${accountId && accountId !== "default" ? `channels.whatsapp.accounts.${accountId}` : "channels.whatsapp"}.allowFrom\` to restrict approvers.`;
	},
	delivery: {
		hasConfiguredDmRoute: ({ cfg }) => listAccountIds(cfg).some((accountId) => {
			if (!canAnyApprovalPotentiallyRouteToWhatsApp({
				cfg,
				accountId,
				nativeSessionOnly: true
			})) return false;
			return getWhatsAppApprovalApprovers({
				cfg,
				accountId
			}).length > 0;
		}),
		shouldSuppressForwardingFallback: shouldSuppressWhatsAppForwardingFallback
	},
	render: {
		exec: { buildPendingPayload: ({ request, nowMs }) => buildWhatsAppExecPendingPayload({
			request,
			nowMs
		}) },
		plugin: { buildPendingPayload: ({ request, nowMs }) => buildWhatsAppPluginPendingPayload({
			request,
			nowMs
		}) }
	},
	native: {
		describeDeliveryCapabilities: ({ cfg, accountId, approvalKind, request }) => {
			const originTarget = resolveWhatsAppOriginTarget({
				cfg,
				accountId,
				approvalKind,
				request
			});
			const approverTargets = resolveWhatsAppApproverDmTargets({
				cfg,
				accountId,
				approvalKind,
				request
			});
			return {
				enabled: Boolean(originTarget) || approverTargets.length > 0,
				preferredSurface: originTarget ? "origin" : "approver-dm",
				supportsOriginSurface: Boolean(originTarget),
				supportsApproverDmSurface: approverTargets.length > 0,
				notifyOriginWhenDmOnly: true
			};
		},
		resolveOriginTarget: resolveWhatsAppOriginTarget,
		resolveApproverDmTargets: resolveWhatsAppApproverDmTargets
	},
	nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
		eventKinds: ["exec", "plugin"],
		isConfigured: ({ cfg, accountId, context }) => Boolean(context) && canAnyApprovalPotentiallyRouteToWhatsApp({
			cfg,
			accountId,
			nativeSessionOnly: true
		}),
		shouldHandle: ({ cfg, accountId, context, request }) => Boolean(context) && shouldHandleWhatsAppApprovalRequest({
			cfg,
			accountId,
			request
		}),
		load: async () => (await import("./approval-handler.runtime-B3nHuEmr.js")).whatsappApprovalNativeRuntime
	})
});
//#endregion
//#region extensions/whatsapp/src/channel-actions.ts
function areWhatsAppAgentReactionsEnabled(params) {
	if (!params.cfg.channels?.whatsapp) return false;
	if (!createActionGate(params.cfg.channels.whatsapp.actions)("reactions")) return false;
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
	if (!createActionGate(params.cfg.channels.whatsapp.actions)("reactions")) return;
	const resolved = resolveWhatsAppReactionLevel({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!resolved.agentReactionsEnabled) return;
	return resolved.agentReactionGuidance;
}
function describeWhatsAppMessageActions(params) {
	if (!params.cfg.channels?.whatsapp) return null;
	const gate = createActionGate(params.cfg.channels.whatsapp.actions);
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
	const channelCfg = cfg?.channels?.whatsapp;
	return resolveListedDefaultAccountId({
		accountIds: listCombinedAccountIds({
			configuredAccountIds: channelCfg?.accounts && typeof channelCfg.accounts === "object" ? Object.keys(channelCfg.accounts).filter(Boolean) : [],
			fallbackAccountIdWhenEmpty: DEFAULT_ACCOUNT_ID
		}),
		configuredDefaultAccountId: normalizeOptionalAccountId(channelCfg?.defaultAccount)
	});
}
function createWhatsAppOutboundBase({ chunker, sendMessageWhatsApp, sendPollWhatsApp, shouldLogVerbose, resolveTarget, normalizeText = normalizeWhatsAppPayloadText, skipEmptyText = true }) {
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
			messageText: cachedMeta?.body
		};
	};
	const outbound = {
		deliveryMode: "gateway",
		chunker,
		chunkerMode: "text",
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
			sendText: async ({ cfg, to, text, accountId, deps, gifPlayback, replyToId }) => {
				const normalizedText = normalizeText(text);
				if (skipEmptyText && !normalizedText) return { messageId: "" };
				const quotedMessageKey = resolveQuotedMessageKey({
					accountId: resolveQuoteLookupAccountId(cfg, accountId),
					to,
					replyToId
				});
				return await (quotedMessageKey ? sendMessageWhatsApp : resolveOutboundSendDep(deps, "whatsapp", { legacyKeys: WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS }) ?? sendMessageWhatsApp)(to, normalizedText, {
					verbose: false,
					cfg,
					accountId: accountId ?? void 0,
					gifPlayback,
					quotedMessageKey
				});
			},
			sendMedia: async ({ cfg, to, text, mediaUrl, mediaAccess, mediaLocalRoots, mediaReadFile, audioAsVoice, accountId, deps, gifPlayback, forceDocument, replyToId }) => {
				const quotedMessageKey = resolveQuotedMessageKey({
					accountId: resolveQuoteLookupAccountId(cfg, accountId),
					to,
					replyToId
				});
				return await (quotedMessageKey ? sendMessageWhatsApp : resolveOutboundSendDep(deps, "whatsapp", { legacyKeys: WHATSAPP_LEGACY_OUTBOUND_SEND_DEP_KEYS }) ?? sendMessageWhatsApp)(to, normalizeText(text), {
					verbose: false,
					cfg,
					mediaUrl,
					mediaAccess,
					mediaLocalRoots,
					mediaReadFile,
					...audioAsVoice === void 0 ? {} : { audioAsVoice },
					accountId: accountId ?? void 0,
					gifPlayback,
					forceDocument,
					quotedMessageKey
				});
			},
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
			if (ctx.payload.isError === true) return {
				channel: "whatsapp",
				messageId: ""
			};
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
function normalizeWhatsAppChannelPayloadText(text) {
	return normalizeWhatsAppPayloadTextPreservingIndentation(text);
}
function normalizeWhatsAppChannelSendText(text) {
	const normalized = normalizeWhatsAppChannelPayloadText(text);
	return normalized.trim() ? normalized : "";
}
const whatsappChannelOutbound = {
	...createWhatsAppOutboundBase({
		chunker: chunkText,
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
	send: { text: async (ctx) => toWhatsAppMessageSendResult(await whatsappChannelOutbound.sendText({ ...ctx }), ctx.replyToId) }
});
//#endregion
//#region extensions/whatsapp/src/heartbeat.ts
async function checkWhatsAppHeartbeatReady(params) {
	if (params.cfg.web?.enabled === false) return {
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
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "whatsapp",
		accountId: params.accountId,
		peer: {
			kind: chatType,
			id: normalized
		},
		chatType,
		from: normalized,
		to: normalized
	});
}
//#endregion
//#region extensions/whatsapp/src/status-issues.ts
const RECENT_DISCONNECT_WARNING_WINDOW_MS = 900 * 1e3;
function readWhatsAppAccountStatus(value) {
	if (!isRecord(value)) return null;
	return {
		accountId: value.accountId,
		statusState: value.statusState,
		enabled: value.enabled,
		linked: value.linked,
		connected: value.connected,
		running: value.running,
		reconnectAttempts: value.reconnectAttempts,
		lastDisconnect: value.lastDisconnect,
		lastInboundAt: value.lastInboundAt,
		lastError: value.lastError,
		healthState: value.healthState
	};
}
function readLastDisconnect(value) {
	if (typeof value === "string") {
		const error = asString(value);
		return error ? {
			at: null,
			error
		} : null;
	}
	if (!isRecord(value)) return null;
	return {
		at: typeof value.at === "number" ? value.at : null,
		error: asString(value.error)
	};
}
function isRecentDisconnect(disconnect, now = Date.now()) {
	if (disconnect?.at == null) return false;
	return now - disconnect.at <= RECENT_DISCONNECT_WARNING_WINDOW_MS;
}
function collectWhatsAppStatusIssues(accounts) {
	return collectIssuesForEnabledAccounts({
		accounts,
		readAccount: readWhatsAppAccountStatus,
		collectIssues: ({ account, accountId, issues }) => {
			const linked = account.linked === true;
			const statusState = asString(account.statusState);
			const running = account.running === true;
			const connected = account.connected === true;
			const reconnectAttempts = typeof account.reconnectAttempts === "number" ? account.reconnectAttempts : null;
			const lastInboundAt = typeof account.lastInboundAt === "number" ? account.lastInboundAt : null;
			const lastDisconnect = readLastDisconnect(account.lastDisconnect);
			const lastError = asString(account.lastError) ?? lastDisconnect?.error;
			const healthState = asString(account.healthState);
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
			if (healthState === "logged-out") {
				issues.push({
					channel: "whatsapp",
					accountId,
					kind: "auth",
					message: `Linked session logged out${lastError ? `: ${lastError}` : "."}`,
					fix: `Run: ${formatCliCommand("openclaw channels login")} (scan QR on the gateway host).`
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
const loadWhatsAppDirectoryConfig = createLazyRuntimeModule(() => import("./directory-config-DyqIRjCJ.js"));
const loadWhatsAppChannelReactAction = createLazyRuntimeModule(() => import("./channel-react-action-BzfZBmeL.js"));
function resolveWhatsAppTargetInfo(raw) {
	const normalized = normalizeWhatsAppTarget(raw);
	if (!normalized) return null;
	return {
		to: normalized,
		chatType: isWhatsAppGroupJid(normalized) ? "group" : isWhatsAppNewsletterJid(normalized) ? "channel" : "direct"
	};
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
		...createWhatsAppPluginBase({
			groups: {
				resolveRequireMention: resolveWhatsAppGroupRequireMention,
				resolveToolPolicy: resolveWhatsAppGroupToolPolicy,
				resolveGroupIntroHint: resolveWhatsAppGroupIntroHint
			},
			setupWizard: whatsappSetupWizardProxy,
			setup: whatsappSetupAdapter,
			isConfigured: async (account) => {
				return await (await loadWhatsAppChannelRuntime()).readWebAuthState(account.authDir) === "linked";
			}
		}),
		agentTools: () => [createWhatsAppLoginTool()],
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
			listGroups: async (params) => (await loadWhatsAppDirectoryConfig()).listWhatsAppDirectoryGroupsFromConfig(params)
		},
		actions: {
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
			const resolvedAccountId = accountId?.trim() || whatsappPlugin.config.defaultAccountId?.(cfg) || "default";
			await (await loadWhatsAppChannelRuntime()).loginWeb(Boolean(verbose), void 0, runtime, resolvedAccountId);
		} },
		lifecycle: { detectLegacyStateMigrations: ({ oauthDir }) => detectWhatsAppLegacyStateMigrations({ oauthDir }) },
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
		status: createAsyncComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID, {
				connected: false,
				reconnectAttempts: 0,
				lastConnectedAt: null,
				lastDisconnect: null,
				lastInboundAt: null,
				lastMessageAt: null,
				lastEventAt: null,
				healthState: "stopped"
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
				const linked = typeof snapshot.linked === "boolean" ? snapshot.linked : auth.state === "unstable" ? void 0 : auth.state === "linked";
				const summaryAuthState = auth.state === "unstable" ? auth.state : linked === true ? "linked" : linked === false ? "not-linked" : void 0;
				const statusState = summaryAuthState === void 0 ? void 0 : summaryAuthState;
				const configured = auth.state === "unstable" ? typeof snapshot.configured === "boolean" ? snapshot.configured : true : typeof linked === "boolean" ? linked : auth.state === "linked";
				const authAgeMs = typeof linked === "boolean" && linked ? auth.authAgeMs : null;
				const self = typeof linked === "boolean" && linked ? auth.selfId : {
					e164: null,
					jid: null,
					lid: null
				};
				return {
					configured,
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
					lastError: snapshot.lastError ?? null,
					healthState: snapshot.healthState ?? void 0
				};
			},
			resolveAccountSnapshot: async ({ account, runtime }) => {
				const authState = await (await loadWhatsAppChannelRuntime()).readWebAuthState(account.authDir);
				return {
					accountId: account.accountId,
					name: account.name,
					enabled: account.enabled,
					configured: true,
					extra: {
						statusState: authState,
						...authState === "linked" ? { linked: true } : authState === "not-linked" ? { linked: false } : {},
						connected: runtime?.connected ?? false,
						reconnectAttempts: runtime?.reconnectAttempts,
						lastConnectedAt: runtime?.lastConnectedAt ?? null,
						lastDisconnect: runtime?.lastDisconnect ?? null,
						lastInboundAt: runtime?.lastInboundAt ?? runtime?.lastMessageAt ?? null,
						lastMessageAt: runtime?.lastMessageAt ?? null,
						lastEventAt: runtime?.lastEventAt ?? null,
						healthState: runtime?.healthState ?? void 0,
						dmPolicy: account.dmPolicy,
						allowFrom: account.allowFrom
					}
				};
			},
			resolveAccountState: ({ configured }) => configured ? "linked" : "not linked",
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
