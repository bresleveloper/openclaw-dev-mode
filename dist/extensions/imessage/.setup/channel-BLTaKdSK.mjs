import { a as looksLikeIMessageExplicitTargetId, c as parseIMessageTarget, d as isIMessagePhoneLikeHandle, n as inferIMessageTargetChatType, o as normalizeIMessageHandle, u as normalizeIMessageMessagingTarget } from "./targets-Cc9vthzI.mjs";
import { a as resolveDefaultIMessageAccountId, i as listIMessageAccountIds, o as resolveIMessageAccount, t as collectIMessageDuplicateAccountSourceWarnings } from "./accounts-CUxZrTcY.mjs";
import { b as resolveIMessageDirectChatService, n as sanitizeIMessageFinalOutboundText, r as sanitizeOutboundText } from "./sanitize-outbound-sJPF2DVM.mjs";
import { a as matchIMessageAcpConversation, c as getIMessageApprovalApprovers, h as createIMessageSetupWizardProxy, l as imessageApprovalAuth, o as normalizeIMessageAcpConversationId, r as resolveIMessageGroupToolPolicy, s as resolveIMessageConversationIdFromTarget, t as resolveIMessageGroupRequireMention, u as imessageMessageActions, v as imessageSetupContract } from "./group-policy-Cjztkquv.mjs";
import { t as createIMessageConversationBindingManager } from "./conversation-bindings-GDQ_Laxj.mjs";
import { t as IMessageChannelConfigSchema } from "./config-schema-CCbTcJEV.mjs";
import { n as resolveIMessageAttachmentRoots, r as resolveIMessageRemoteAttachmentRoots } from "./media-contract-DKJK7rh3.mjs";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { buildDmGroupAccountAllowlistAdapter } from "openclaw/plugin-sdk/allowlist-config-edit";
import { adaptScopedAccountAccessor, createScopedChannelConfigAdapter, formatTrimmedAllowFromEntries } from "openclaw/plugin-sdk/channel-config-helpers";
import { createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createMessageReceiptFromOutboundResults, defineChannelMessageAdapter, sanitizeForPlainText } from "openclaw/plugin-sdk/channel-outbound";
import { PAIRING_APPROVED_MESSAGE } from "openclaw/plugin-sdk/channel-status";
import { buildPassiveProbedChannelStatusSummary } from "openclaw/plugin-sdk/extension-shared";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
import { chunkMarkdownText } from "openclaw/plugin-sdk/reply-runtime";
import { buildOutboundBaseSessionKey, normalizeAccountId, parseAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { collectStatusIssuesFromLastError, createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutes } from "openclaw/plugin-sdk/approval-delivery-runtime";
import { createLazyChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { shouldSuppressLocalNativeExecApprovalPrompt } from "openclaw/plugin-sdk/approval-native-runtime";
import { addApprovalReactionHintToText } from "openclaw/plugin-sdk/approval-reaction-runtime";
import { buildTypedExecApprovalPendingReplyPayload, buildTypedPluginApprovalPendingReplyPayload } from "openclaw/plugin-sdk/approval-reply-runtime";
import { getExecApprovalReplyMetadata, resolveExecApprovalCommandDisplay, resolveExecApprovalRequestAllowedDecisions } from "openclaw/plugin-sdk/approval-runtime";
import { createRestrictSendersChannelSecurity } from "openclaw/plugin-sdk/channel-policy";
import { createChannelPluginBase, getChatChannelMeta } from "openclaw/plugin-sdk/core";
//#region extensions/imessage/src/approval-text.ts
function replaceApprovalIdPlaceholder(text, approvalId) {
	const safeApprovalId = approvalId.replace(/\$/g, "$$$$");
	return (text ?? "").replace(/\/approve\s+<id>/g, `/approve ${safeApprovalId}`);
}
//#endregion
//#region extensions/imessage/src/approval-native.ts
const DEFAULT_PLUGIN_APPROVAL_DECISIONS = [
	"allow-once",
	"allow-always",
	"deny"
];
function isIMessageApprovalTransportEnabled(params) {
	return resolveIMessageAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).enabled;
}
const imessageApproval = createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutes({
	channel: "imessage",
	channelLabel: "iMessage",
	authorizeActorAction: (params) => imessageApprovalAuth.authorizeActorAction(params),
	routing: {
		defaultForwardingMode: "session",
		isTransportEnabled: isIMessageApprovalTransportEnabled,
		listAccountIds: listIMessageAccountIds,
		resolveDefaultAccountId: resolveDefaultIMessageAccountId,
		normalizeTo: normalizeIMessageMessagingTarget,
		resolveApprovers: getIMessageApprovalApprovers,
		isOriginTargetAllowed: ({ cfg, accountId, target }) => inferIMessageTargetChatType(target.to) !== "group" || getIMessageApprovalApprovers({
			cfg,
			accountId
		}).length > 0
	},
	describeExecApprovalSetup: ({ accountId }) => {
		return `iMessage supports native exec approvals for this account when \`approvals.exec.enabled\` is true and the route allows iMessage. Keep the macOS imsg bridge running and configure \`${accountId && accountId !== "default" ? `channels.imessage.accounts.${accountId}` : "channels.imessage"}.allowFrom\` to restrict approvers.`;
	},
	render: {
		exec: { buildPendingPayload: ({ request, nowMs }) => buildIMessageExecPendingPayload({
			request,
			nowMs
		}) },
		plugin: { buildPendingPayload: ({ request, nowMs }) => buildIMessagePluginPendingPayload({
			request,
			nowMs
		}) }
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
		load: async () => (await import("./approval-handler.runtime-Bv5_XgNr.mjs")).imessageApprovalNativeRuntime
	})
});
const imessageApprovalRouting = imessageApproval.routing;
function resolveIMessageSessionTargetFromSessionKey(sessionKey) {
	const rest = parseAgentSessionKey(sessionKey)?.rest ?? normalizeOptionalString(sessionKey);
	if (!rest || !normalizeLowercaseStringOrEmpty(rest).startsWith("imessage:")) return null;
	const route = rest.slice(9).trim();
	const routeLower = normalizeLowercaseStringOrEmpty(route);
	if (!route || routeLower.startsWith("group:") || routeLower.startsWith("channel:") || routeLower.startsWith("chat:")) return null;
	if (routeLower.startsWith("direct:")) {
		const to = normalizeIMessageMessagingTarget(route.slice(7));
		return to ? { to } : null;
	}
	const accountScopedDirect = /^([^:]+):direct:(.+)$/i.exec(route);
	if (accountScopedDirect) {
		const to = normalizeIMessageMessagingTarget(accountScopedDirect[2] ?? "");
		return to ? {
			to,
			accountId: normalizeAccountId(accountScopedDirect[1] ?? "")
		} : null;
	}
	const to = normalizeIMessageMessagingTarget(route);
	if (!to || inferIMessageTargetChatType(to) !== "direct") return null;
	return { to };
}
function shouldSuppressLocalIMessageExecApprovalPrompt(params) {
	if (shouldSuppressLocalNativeExecApprovalPrompt({
		...params,
		isTransportEnabled: isIMessageApprovalTransportEnabled,
		isSessionRouteEligible: ({ cfg, accountId, metadata }) => {
			if (getIMessageApprovalApprovers({
				cfg,
				accountId
			}).length > 0) return true;
			const sessionTarget = resolveIMessageSessionTargetFromSessionKey(metadata.sessionKey);
			if (!sessionTarget || inferIMessageTargetChatType(sessionTarget.to) !== "direct") return false;
			const targetAccountId = normalizeOptionalString(sessionTarget.accountId);
			return !targetAccountId || !accountId || normalizeAccountId(targetAccountId) === normalizeAccountId(accountId);
		}
	})) return true;
	const metadata = getExecApprovalReplyMetadata(params.payload);
	if (params.hint?.kind !== "approval-pending" || params.hint.approvalKind !== "exec" || params.hint.nativeRouteActive !== true || metadata?.approvalKind !== "exec") return false;
	if (metadata.agentId || metadata.sessionKey) return false;
	if (getIMessageApprovalApprovers({
		cfg: params.cfg,
		accountId: params.accountId
	}).length === 0) return false;
	return imessageApprovalRouting.canApprovalPotentiallyRouteToChannel({
		...params,
		approvalKind: "exec",
		nativeSessionOnly: true
	});
}
function appendIMessageReactionHint(params) {
	return addApprovalReactionHintToText({
		text: params.text ?? "",
		allowedDecisions: params.allowedDecisions
	});
}
function buildIMessageExecPendingPayload(params) {
	const allowedDecisions = resolveExecApprovalRequestAllowedDecisions(params.request.request);
	const command = resolveExecApprovalCommandDisplay(params.request.request).commandText;
	const payload = buildTypedExecApprovalPendingReplyPayload({
		approvalId: params.request.id,
		approvalSlug: params.request.id.slice(0, 8),
		approvalCommandId: params.request.id,
		warningText: params.request.request.warningText ?? void 0,
		ask: params.request.request.ask ?? null,
		agentId: params.request.request.agentId ?? null,
		allowedDecisions,
		command,
		cwd: params.request.request.cwd ?? void 0,
		host: params.request.request.host === "node" ? "node" : "gateway",
		nodeId: params.request.request.nodeId ?? void 0,
		scope: params.request.request.scope ?? void 0,
		sessionKey: params.request.request.sessionKey ?? null,
		expiresAtMs: params.request.expiresAtMs,
		nowMs: params.nowMs
	});
	return {
		...payload,
		text: appendIMessageReactionHint({
			text: replaceApprovalIdPlaceholder(payload.text, params.request.id),
			allowedDecisions
		})
	};
}
function buildIMessagePluginPendingPayload(params) {
	const configuredDecisions = params.request.request.allowedDecisions;
	const allowedDecisions = configuredDecisions && configuredDecisions.length > 0 ? configuredDecisions : DEFAULT_PLUGIN_APPROVAL_DECISIONS;
	const payload = buildTypedPluginApprovalPendingReplyPayload({
		request: params.request,
		nowMs: params.nowMs,
		allowedDecisions
	});
	return {
		...payload,
		text: appendIMessageReactionHint({
			text: replaceApprovalIdPlaceholder(payload.text, params.request.id),
			allowedDecisions
		})
	};
}
const imessageApprovalCapability = imessageApproval.capability;
//#endregion
//#region extensions/imessage/src/doctor.ts
const imessageDoctor = {
	groupAllowFromFallbackToAllowFrom: false,
	collectPreviewWarnings: ({ cfg }) => collectIMessageDuplicateAccountSourceWarnings({ cfg })
};
//#endregion
//#region extensions/imessage/src/shared.ts
const IMESSAGE_CHANNEL = "imessage";
async function loadIMessageChannelRuntime$1() {
	return await import("./channel.runtime---s2k4YN.mjs");
}
const imessageSetupWizard = createIMessageSetupWizardProxy(async () => (await loadIMessageChannelRuntime$1()).imessageSetupWizard);
const imessageConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: IMESSAGE_CHANNEL,
	listAccountIds: listIMessageAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveIMessageAccount),
	defaultAccountId: resolveDefaultIMessageAccountId,
	clearBaseFields: [
		"cliPath",
		"dbPath",
		"service",
		"region",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatTrimmedAllowFromEntries(allowFrom),
	resolveDefaultTo: (account) => account.config.defaultTo
});
const imessageSecurityAdapter = createRestrictSendersChannelSecurity({
	channelKey: IMESSAGE_CHANNEL,
	resolveDmPolicy: (account) => account.config.dmPolicy,
	resolveDmAllowFrom: (account) => account.config.allowFrom,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	surface: "iMessage groups",
	openScope: "any member",
	groupPolicyPath: "channels.imessage.groupPolicy",
	groupAllowFromPath: "channels.imessage.groupAllowFrom",
	mentionGated: false,
	findingTitle: "iMessage security warning",
	policyPathSuffix: "dmPolicy"
});
function createIMessagePluginBase(params) {
	return {
		...createChannelPluginBase({
			id: IMESSAGE_CHANNEL,
			meta: {
				...getChatChannelMeta(IMESSAGE_CHANNEL),
				aliases: ["imsg"],
				exposure: { configured: false }
			},
			setupWizard: params.setupWizard,
			capabilities: {
				chatTypes: ["direct", "group"],
				media: true,
				tts: { voice: {
					synthesisTarget: "audio-file",
					audioFileFormats: [
						"mp3",
						"caf",
						"audio/mpeg",
						"audio/x-caf"
					],
					preferAudioFileFormat: "caf"
				} },
				reactions: true,
				edit: true,
				unsend: true,
				reply: true,
				effects: true,
				groupManagement: true
			},
			reload: {
				configPrefixes: ["channels.imessage"],
				noopPrefixes: ["messages.inbound"]
			},
			configSchema: IMessageChannelConfigSchema,
			config: {
				...imessageConfigAdapter,
				isConfigured: (account) => account.configured,
				describeAccount: (account) => describeAccountSnapshot({
					account,
					configured: account.configured
				})
			},
			security: imessageSecurityAdapter,
			setupContract: params.setupContract
		}),
		messaging: {
			resolveInboundAttachmentRoots: (paramsValue) => resolveIMessageAttachmentRoots({
				accountId: paramsValue.accountId,
				cfg: paramsValue.cfg
			}),
			resolveRemoteInboundAttachmentRoots: (paramsLocal) => resolveIMessageRemoteAttachmentRoots({
				accountId: paramsLocal.accountId,
				cfg: paramsLocal.cfg
			})
		}
	};
}
//#endregion
//#region extensions/imessage/src/status-core.ts
async function probeIMessageStatusAccount(params) {
	return await params.probeIMessageAccount({
		timeoutMs: params.timeoutMs,
		cliPath: params.account.config.cliPath,
		dbPath: params.account.config.dbPath,
		...params.account.config.remoteHost ? { remoteHost: params.account.config.remoteHost } : {}
	});
}
//#endregion
//#region extensions/imessage/src/channel.ts
const loadIMessageChannelRuntime = createLazyRuntimeModule(() => import("./channel.runtime---s2k4YN.mjs"));
function toIMessageMessageSendResult(result, kind, replyToId) {
	const receipt = result.receipt ?? createMessageReceiptFromOutboundResults({
		results: result.messageId ? [{
			channel: "imessage",
			messageId: result.messageId
		}] : [],
		kind,
		...replyToId ? { replyToId } : {}
	});
	return {
		messageId: result.messageId || receipt.primaryPlatformMessageId,
		receipt,
		...result.meta && Object.keys(result.meta).length > 0 ? { meta: result.meta } : {}
	};
}
const loadIMessageApprovalReactionsModule = createLazyRuntimeModule(() => import("./approval-reactions-D6RFg6lU.mjs").then((n) => n.t));
const loadIMessageQuestionReactionsModule = createLazyRuntimeModule(() => import("./question-reactions-lm8OxWbb.mjs").then((n) => n.r));
async function prepareForwardedIMessageApprovalPayload(params) {
	const prepared = (await loadIMessageApprovalReactionsModule()).addIMessageApprovalReactionHintToStructuredPayload(params);
	if (prepared) Object.assign(params.payload, prepared);
}
async function registerDeliveredIMessageApprovalPayload(params) {
	const accountId = resolveIMessageAccount({
		cfg: params.cfg,
		accountId: params.target.accountId
	}).accountId;
	(await loadIMessageQuestionReactionsModule()).registerIMessageQuestionReactionTargetForDeliveredPayload({
		accountId,
		target: params.target,
		payload: params.payload,
		results: params.results
	});
	await (await loadIMessageApprovalReactionsModule()).registerIMessageApprovalReactionTargetForDeliveredPayload({
		accountId,
		target: params.target,
		payload: params.payload,
		results: params.results
	});
}
const imessageMessageAdapter = defineChannelMessageAdapter({
	id: "imessage",
	durableFinal: { capabilities: {
		text: true,
		media: true,
		replyTo: true,
		messageSendingHooks: true
	} },
	send: {
		text: async (ctx) => {
			return toIMessageMessageSendResult(await (await loadIMessageChannelRuntime()).sendIMessageOutbound({
				cfg: ctx.cfg,
				to: ctx.to,
				text: ctx.text,
				accountId: ctx.accountId ?? void 0,
				deps: ctx.deps,
				replyToId: ctx.replyToId ?? void 0,
				assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff,
				onPlatformSendDispatch: ctx.onPlatformSendDispatch,
				conversationReadOrigin: ctx.conversationReadOrigin
			}), "text", ctx.replyToId);
		},
		media: async (ctx) => {
			return toIMessageMessageSendResult(await (await loadIMessageChannelRuntime()).sendIMessageOutbound({
				cfg: ctx.cfg,
				to: ctx.to,
				text: ctx.text,
				mediaUrl: ctx.mediaUrl,
				mediaAccess: ctx.mediaAccess,
				mediaLocalRoots: ctx.mediaLocalRoots,
				mediaReadFile: ctx.mediaReadFile,
				audioAsVoice: ctx.audioAsVoice,
				accountId: ctx.accountId ?? void 0,
				deps: ctx.deps,
				replyToId: ctx.replyToId ?? void 0,
				assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff,
				onPlatformSendDispatch: ctx.onPlatformSendDispatch,
				conversationReadOrigin: ctx.conversationReadOrigin,
				...ctx.onDeliveryResult ? { onDeliveryResult: async (acceptedResult) => {
					await ctx.onDeliveryResult?.(toIMessageMessageSendResult(acceptedResult, ctx.audioAsVoice ? "voice" : "media", ctx.replyToId));
				} } : {}
			}), ctx.audioAsVoice ? "voice" : "media", ctx.replyToId);
		}
	}
});
function buildIMessageBaseSessionKey(params) {
	return buildOutboundBaseSessionKey({
		...params,
		channel: "imessage"
	});
}
function isCanonicalIMessageDirectHandle(raw, normalized) {
	const trimmed = raw.trim();
	if (!trimmed || !normalized) return false;
	if (normalized.startsWith("+")) return isIMessagePhoneLikeHandle(trimmed);
	return /^[^\s@<>()[\]`]+@[^\s@<>()[\]`]+\.[^\s@<>()[\]`]+$/.test(trimmed);
}
function resolveIMessageOutboundSessionRoute(params) {
	const parsed = parseIMessageTarget(params.target);
	if (parsed.kind === "handle") {
		const handle = normalizeIMessageHandle(parsed.to);
		if (!handle) return null;
		const account = resolveIMessageAccount({
			cfg: params.cfg,
			accountId: params.accountId
		});
		const directTarget = `${resolveIMessageDirectChatService(parsed.serviceExplicit ? parsed.service : account.config.service) ?? "auto"}:${handle}`;
		const peer = {
			kind: "direct",
			id: handle
		};
		const baseSessionKey = buildIMessageBaseSessionKey({
			cfg: params.cfg,
			agentId: params.agentId,
			accountId: params.accountId,
			peer
		});
		return {
			sessionKey: baseSessionKey,
			baseSessionKey,
			recipientSessionExact: isCanonicalIMessageDirectHandle(parsed.to, handle),
			peer,
			chatType: "direct",
			from: directTarget,
			to: directTarget
		};
	}
	const peerId = parsed.kind === "chat_id" ? String(parsed.chatId) : parsed.kind === "chat_guid" ? parsed.chatGuid : parsed.chatIdentifier;
	if (!peerId) return null;
	const peer = {
		kind: "group",
		id: peerId
	};
	const baseSessionKey = buildIMessageBaseSessionKey({
		cfg: params.cfg,
		agentId: params.agentId,
		accountId: params.accountId,
		peer
	});
	const toPrefix = parsed.kind === "chat_id" ? "chat_id" : parsed.kind === "chat_guid" ? "chat_guid" : "chat_identifier";
	return {
		sessionKey: baseSessionKey,
		baseSessionKey,
		recipientSessionExact: false,
		peer,
		chatType: "group",
		from: `imessage:group:${peerId}`,
		to: `${toPrefix}:${peerId}`
	};
}
const imessagePlugin = createChatChannelPlugin({
	base: {
		...createIMessagePluginBase({
			setupWizard: imessageSetupWizard,
			setupContract: imessageSetupContract
		}),
		allowlist: buildDmGroupAccountAllowlistAdapter({
			channelId: "imessage",
			resolveAccount: resolveIMessageAccount,
			normalize: ({ values }) => formatTrimmedAllowFromEntries(values),
			resolveDmAllowFrom: (account) => account.config.allowFrom,
			resolveGroupAllowFrom: (account) => account.config.groupAllowFrom,
			resolveDmPolicy: (account) => account.config.dmPolicy,
			resolveGroupPolicy: (account) => account.config.groupPolicy
		}),
		groups: {
			resolveRequireMention: resolveIMessageGroupRequireMention,
			resolveToolPolicy: resolveIMessageGroupToolPolicy
		},
		agentPrompt: { messageToolHints: () => ["- iMessage current conversation: omit target, to, chatId, chatGuid, and chatIdentifier. OpenClaw resolves the trusted current chat server-side; never copy a redacted display value such as `***` into message actions."] },
		doctor: imessageDoctor,
		conversationBindings: {
			supportsCurrentConversationBinding: true,
			bindingStore: "adapter",
			createManager: ({ cfg, accountId }) => createIMessageConversationBindingManager({
				cfg,
				accountId: accountId ?? void 0
			})
		},
		bindings: {
			compileConfiguredBinding: ({ conversationId }) => normalizeIMessageAcpConversationId(conversationId),
			matchInboundConversation: ({ compiledBinding, conversationId }) => matchIMessageAcpConversation({
				bindingConversationId: compiledBinding.conversationId,
				conversationId
			}),
			resolveCommandConversation: ({ originatingTo, commandTo, fallbackTo }) => {
				const conversationId = resolveIMessageConversationIdFromTarget(originatingTo ?? "") ?? resolveIMessageConversationIdFromTarget(commandTo ?? "") ?? resolveIMessageConversationIdFromTarget(fallbackTo ?? "");
				return conversationId ? { conversationId } : null;
			}
		},
		messaging: {
			normalizeTarget: normalizeIMessageMessagingTarget,
			inferTargetChatType: ({ to }) => inferIMessageTargetChatType(to),
			resolveOutboundSessionRoute: (params) => resolveIMessageOutboundSessionRoute(params),
			targetResolver: {
				looksLikeId: looksLikeIMessageExplicitTargetId,
				hint: "<phone|email|chat_id:ID|auto:contact|imessage:contact|sms:contact>",
				resolveTarget: async ({ input }) => {
					const to = normalizeIMessageMessagingTarget(input);
					if (!to) return null;
					const chatType = inferIMessageTargetChatType(to);
					if (!chatType) return null;
					const parsed = parseIMessageTarget(to);
					const display = parsed.kind === "handle" && !isCanonicalIMessageDirectHandle(parsed.to, normalizeIMessageHandle(parsed.to)) ? parsed.to.trim() : void 0;
					return {
						to,
						kind: chatType === "direct" ? "user" : "group",
						...display ? { display } : {},
						source: "normalized"
					};
				}
			}
		},
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID, {
				cliPath: null,
				dbPath: null
			}),
			collectStatusIssues: (accounts) => collectStatusIssuesFromLastError("imessage", accounts),
			buildChannelSummary: ({ snapshot }) => buildPassiveProbedChannelStatusSummary(snapshot, {
				cliPath: snapshot.cliPath ?? null,
				dbPath: snapshot.dbPath ?? null
			}),
			probeAccount: async ({ account, timeoutMs }) => await probeIMessageStatusAccount({
				account,
				timeoutMs,
				probeIMessageAccount: async (params) => await (await loadIMessageChannelRuntime()).probeIMessageAccount(params)
			}),
			resolveAccountSnapshot: ({ account, runtime }) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: account.configured,
				extra: {
					cliPath: runtime?.cliPath ?? account.config.cliPath ?? null,
					dbPath: runtime?.dbPath ?? account.config.dbPath ?? null
				}
			}),
			resolveAccountState: ({ enabled }) => enabled ? "enabled" : "disabled"
		}),
		gateway: { startAccount: async (ctx) => {
			const conversationBindings = createIMessageConversationBindingManager({
				cfg: ctx.cfg,
				accountId: ctx.accountId
			});
			try {
				return await (await loadIMessageChannelRuntime()).startIMessageGatewayAccount(ctx);
			} finally {
				conversationBindings.stop();
			}
		} },
		message: imessageMessageAdapter,
		actions: imessageMessageActions,
		approvalCapability: imessageApprovalCapability
	},
	pairing: { text: {
		idLabel: "imessageSenderId",
		message: PAIRING_APPROVED_MESSAGE,
		notify: async (params) => {
			await (await loadIMessageChannelRuntime()).sendIMessageOutbound({
				...params,
				to: params.id,
				text: params.message
			});
		}
	} },
	security: imessageSecurityAdapter,
	threading: { resolveReplyTransport: ({ cfg, accountId, replyToId, currentMessageId, replyToCurrent, replyToIsExplicit, replyDelivery }) => {
		if (resolveIMessageAccount({
			cfg,
			accountId
		}).config.actions?.reply === false) return { replyToId: null };
		const existingReplyToId = normalizeOptionalString(replyToId);
		const explicitCurrentReply = replyToIsExplicit === true && replyToCurrent === true;
		const implicitReplyToId = replyToCurrent === false || replyDelivery?.replyToMode === "off" && !explicitCurrentReply ? void 0 : normalizeOptionalString(currentMessageId);
		return {
			replyToId: existingReplyToId ?? implicitReplyToId ?? null,
			...!existingReplyToId && !explicitCurrentReply && implicitReplyToId ? { replyToIdSource: "implicit" } : {}
		};
	} },
	outbound: {
		base: {
			deliveryMode: "direct",
			chunker: chunkMarkdownText,
			chunkerMode: "markdown",
			textChunkLimit: 4e3,
			sanitizeText: ({ text }) => sanitizeForPlainText(sanitizeIMessageFinalOutboundText(sanitizeOutboundText(text)).text, { style: "markdown" }),
			shouldSuppressLocalPayloadPrompt: ({ cfg, accountId, payload, hint }) => shouldSuppressLocalIMessageExecApprovalPrompt({
				cfg,
				accountId,
				payload,
				hint
			}),
			beforeDeliverPayload: async ({ payload, hint }) => {
				if (hint?.kind !== "approval-pending") return;
				await prepareForwardedIMessageApprovalPayload({
					payload,
					approvalKind: hint.approvalKind
				});
			},
			renderPresentation: ({ payload, presentation }) => questionGatewayRuntime.prepareReactionPayloadForDelivery({
				payload,
				presentation
			}),
			afterDeliverPayload: async (params) => await registerDeliveredIMessageApprovalPayload(params),
			deliveryCapabilities: { durableFinal: {
				text: true,
				media: true,
				replyTo: true,
				messageSendingHooks: true
			} }
		},
		attachedResults: {
			channel: "imessage",
			sendText: async ({ cfg, to, text, accountId, deps, replyToId, assertDirectAdapterHandoff, onPlatformSendDispatch }) => await (await loadIMessageChannelRuntime()).sendIMessageOutbound({
				cfg,
				to,
				text,
				accountId: accountId ?? void 0,
				deps,
				replyToId: replyToId ?? void 0,
				assertDirectAdapterHandoff,
				onPlatformSendDispatch
			}),
			sendMedia: async ({ cfg, to, text, mediaUrl, mediaAccess, mediaLocalRoots, mediaReadFile, audioAsVoice, accountId, deps, replyToId, onDeliveryResult, assertDirectAdapterHandoff, onPlatformSendDispatch }) => await (await loadIMessageChannelRuntime()).sendIMessageOutbound({
				cfg,
				to,
				text,
				mediaUrl,
				mediaAccess,
				mediaLocalRoots,
				mediaReadFile,
				audioAsVoice,
				accountId: accountId ?? void 0,
				deps,
				replyToId: replyToId ?? void 0,
				assertDirectAdapterHandoff,
				onPlatformSendDispatch,
				...onDeliveryResult ? { onDeliveryResult: async (result) => {
					await onDeliveryResult({
						channel: "imessage",
						...toIMessageMessageSendResult(result, audioAsVoice ? "voice" : "media", replyToId),
						messageId: result.messageId
					});
				} } : {}
			})
		}
	}
});
//#endregion
export { createIMessagePluginBase as n, imessageSetupWizard as r, imessagePlugin as t };
