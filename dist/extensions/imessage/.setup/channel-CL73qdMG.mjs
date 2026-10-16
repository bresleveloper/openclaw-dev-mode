import { a as looksLikeIMessageExplicitTargetId, c as parseIMessageTarget, d as isIMessagePhoneLikeHandle, n as inferIMessageTargetChatType, o as normalizeIMessageHandle, u as normalizeIMessageMessagingTarget } from "./targets-BicBiYsM.mjs";
import { a as resolveDefaultIMessageAccountId, i as listIMessageAccountIds, o as resolveIMessageAccount, t as collectIMessageDuplicateAccountSourceWarnings } from "./accounts-evTpvJMv.mjs";
import { C as resolveIMessageDirectChatService } from "./client-12apu4Ip.mjs";
import { t as imessageMessageActions } from "./actions-DJqbUmbN.mjs";
import { i as createIMessageSetupWizardProxy, s as imessageSetupContract } from "./setup-core-DqOBe-n0.mjs";
import { t as createIMessageConversationBindingManager } from "./conversation-bindings-GDQ_Laxj.mjs";
import { n as sanitizeIMessageFinalOutboundText, r as sanitizeOutboundText } from "./sanitize-outbound-C0x4BPky.mjs";
import { t as IMessageChannelConfigSchema } from "./config-schema-DXwa_3V5.mjs";
import { n as resolveIMessageAttachmentRoots, r as resolveIMessageRemoteAttachmentRoots } from "./media-contract-DjQGZlfl.mjs";
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
import { createChannelApprovalAuth } from "openclaw/plugin-sdk/approval-auth-runtime";
import { buildChannelGroupsScopeTree, createRestrictSendersChannelSecurity, resolveScopeRequireMention, resolveScopeToolsPolicy } from "openclaw/plugin-sdk/channel-policy";
import { createChannelPluginBase, getChatChannelMeta } from "openclaw/plugin-sdk/core";
//#region extensions/imessage/src/approval-auth.ts
function normalizeIMessageApproverId(value) {
	const raw = String(value).trim();
	if (!raw) return;
	const normalized = normalizeIMessageHandle(raw);
	if (!normalized || normalized.startsWith("chat_id:") || normalized.startsWith("chat_guid:") || normalized.startsWith("chat_identifier:")) return;
	return normalized;
}
function normalizeIMessageApproverEntry(value) {
	return String(value).trim() === "*" ? "*" : normalizeIMessageApproverId(value);
}
const imessageApproval$1 = createChannelApprovalAuth({
	channelLabel: "iMessage",
	resolveInputs: ({ cfg, accountId }) => {
		return { allowFrom: resolveIMessageAccount({
			cfg,
			accountId
		}).config.allowFrom };
	},
	normalizeApprover: normalizeIMessageApproverEntry,
	normalizeSenderId: normalizeIMessageApproverId,
	isWildcardAuthorized: ({ purpose, approvers }) => purpose === "action" && approvers.includes("*")
});
const getIMessageApprovalApprovers = imessageApproval$1.resolveApprovers;
const imessageApprovalAuth = imessageApproval$1.approvalAuth;
//#endregion
//#region extensions/imessage/src/approval-text.ts
function replaceApprovalIdPlaceholder(text, approvalId) {
	return (text ?? "").replace(/\/approve\s+<id>/g, () => `/approve ${approvalId}`);
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
		load: async () => (await import("./approval-handler.runtime-Bj2NGNXF.mjs")).imessageApprovalNativeRuntime
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
		text: addApprovalReactionHintToText({
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
		text: addApprovalReactionHintToText({
			text: replaceApprovalIdPlaceholder(payload.text, params.request.id),
			allowedDecisions
		})
	};
}
const imessageApprovalCapability = imessageApproval.capability;
//#endregion
//#region extensions/imessage/src/conversation-id-core.ts
function normalizeIMessageAcpConversationId(conversationId) {
	const trimmed = conversationId.trim();
	if (!trimmed) return null;
	try {
		const parsed = parseIMessageTarget(trimmed);
		if (parsed.kind === "handle") {
			const handle = normalizeIMessageHandle(parsed.to);
			return handle ? { conversationId: handle } : null;
		}
		if (parsed.kind === "chat_id") return { conversationId: String(parsed.chatId) };
		if (parsed.kind === "chat_guid") return { conversationId: parsed.chatGuid };
		return { conversationId: parsed.chatIdentifier };
	} catch {
		const handle = normalizeIMessageHandle(trimmed);
		return handle ? { conversationId: handle } : null;
	}
}
function matchIMessageAcpConversation(params) {
	const binding = normalizeIMessageAcpConversationId(params.bindingConversationId);
	const conversation = normalizeIMessageAcpConversationId(params.conversationId);
	if (!binding || !conversation) return null;
	if (binding.conversationId !== conversation.conversationId) return null;
	return {
		conversationId: conversation.conversationId,
		matchPriority: 2
	};
}
function resolveIMessageConversationIdFromTarget(target) {
	return normalizeIMessageAcpConversationId(target)?.conversationId;
}
//#endregion
//#region extensions/imessage/src/conversation-id.ts
function resolveIMessageInboundConversationId(params) {
	if (params.isGroup) return params.chatId != null && Number.isFinite(params.chatId) ? String(params.chatId) : void 0;
	return normalizeIMessageHandle(params.sender) || void 0;
}
//#endregion
//#region extensions/imessage/src/doctor.ts
const imessageDoctor = {
	groupAllowFromFallbackToAllowFrom: false,
	collectPreviewWarnings: ({ cfg }) => collectIMessageDuplicateAccountSourceWarnings({ cfg })
};
//#endregion
//#region extensions/imessage/src/group-policy.ts
function resolveScopePath(params) {
	return params.groupId ? [params.groupId] : [];
}
function resolveIMessageGroupRequireMention(params) {
	return resolveScopeRequireMention({
		tree: buildChannelGroupsScopeTree(params.cfg, "imessage", params.accountId),
		path: resolveScopePath(params)
	});
}
function resolveIMessageGroupToolPolicy(params) {
	return resolveScopeToolsPolicy({
		...params,
		tree: buildChannelGroupsScopeTree(params.cfg, "imessage", params.accountId),
		path: resolveScopePath(params),
		messageProvider: "imessage"
	});
}
function resolveIMessageGroupSystemPrompt(params) {
	const prompt = params.groupConfig?.systemPrompt ?? params.defaultConfig?.systemPrompt;
	return typeof prompt === "string" ? prompt.trim() || void 0 : void 0;
}
//#endregion
//#region extensions/imessage/src/shared.ts
const IMESSAGE_CHANNEL = "imessage";
const imessageSetupWizard = createIMessageSetupWizardProxy(async () => (await import("./setup-surface-zKhIinwY.mjs")).imessageSetupWizard);
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
	formatAllowFrom: formatTrimmedAllowFromEntries,
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
			reload: {
				configPrefixes: ["channels.imessage"],
				noopPrefixes: ["messages.inbound"]
			},
			configSchema: IMessageChannelConfigSchema,
			security: imessageSecurityAdapter,
			setupContract: params.setupContract
		}),
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
		config: {
			...imessageConfigAdapter,
			isConfigured: (account) => account.configured,
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: account.configured
			})
		},
		messaging: {
			resolveInboundAttachmentRoots: resolveIMessageAttachmentRoots,
			resolveRemoteInboundAttachmentRoots: resolveIMessageRemoteAttachmentRoots
		}
	};
}
//#endregion
//#region extensions/imessage/src/channel.ts
const loadIMessageChannelRuntime = createLazyRuntimeModule(() => import("./channel.runtime-DY7JJ0_9.mjs"));
async function sendIMessageOutbound(ctx, kind, options = {}) {
	return await (await loadIMessageChannelRuntime()).sendIMessageOutbound({
		cfg: ctx.cfg,
		to: ctx.to,
		text: ctx.text,
		accountId: ctx.accountId ?? void 0,
		deps: ctx.deps,
		replyToId: ctx.replyToId ?? void 0,
		assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff,
		onPlatformSendDispatch: ctx.onPlatformSendDispatch,
		...options,
		...kind === "media" ? {
			mediaUrl: ctx.mediaUrl,
			mediaAccess: ctx.mediaAccess,
			mediaLocalRoots: ctx.mediaLocalRoots,
			mediaReadFile: ctx.mediaReadFile,
			audioAsVoice: ctx.audioAsVoice
		} : {}
	});
}
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
const loadIMessageApprovalReactionsModule = createLazyRuntimeModule(() => import("./approval-reactions-L9Ul7PAu.mjs").then((n) => n.t));
const loadIMessageQuestionReactionsModule = createLazyRuntimeModule(() => import("./question-reactions-DJV-TnA8.mjs").then((n) => n.r));
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
			return toIMessageMessageSendResult(await sendIMessageOutbound(ctx, "text", { conversationReadOrigin: ctx.conversationReadOrigin }), "text", ctx.replyToId);
		},
		media: async (ctx) => {
			return toIMessageMessageSendResult(await sendIMessageOutbound(ctx, "media", {
				conversationReadOrigin: ctx.conversationReadOrigin,
				...ctx.onDeliveryResult ? { onDeliveryResult: async (acceptedResult) => {
					await ctx.onDeliveryResult?.(toIMessageMessageSendResult(acceptedResult, ctx.audioAsVoice ? "voice" : "media", ctx.replyToId));
				} } : {}
			}), ctx.audioAsVoice ? "voice" : "media", ctx.replyToId);
		}
	}
});
function isCanonicalIMessageDirectHandle(raw, normalized) {
	const trimmed = raw.trim();
	if (!trimmed || !normalized) return false;
	if (normalized.startsWith("+")) return isIMessagePhoneLikeHandle(trimmed);
	return /^[^\s@<>()[\]`]+@[^\s@<>()[\]`]+\.[^\s@<>()[\]`]+$/.test(trimmed);
}
function resolveIMessageOutboundSessionRoute(params) {
	const parsed = parseIMessageTarget(params.target);
	let peer;
	let from;
	let to;
	let recipientSessionExact = false;
	if (parsed.kind === "handle") {
		const handle = normalizeIMessageHandle(parsed.to);
		if (!handle) return null;
		const account = resolveIMessageAccount({
			cfg: params.cfg,
			accountId: params.accountId
		});
		from = to = `${resolveIMessageDirectChatService(parsed.serviceExplicit ? parsed.service : account.config.service) ?? "auto"}:${handle}`;
		peer = {
			kind: "direct",
			id: handle
		};
		recipientSessionExact = isCanonicalIMessageDirectHandle(parsed.to, handle);
	} else {
		const peerId = parsed.kind === "chat_id" ? String(parsed.chatId) : parsed.kind === "chat_guid" ? parsed.chatGuid : parsed.chatIdentifier;
		if (!peerId) return null;
		peer = {
			kind: "group",
			id: peerId
		};
		from = `imessage:group:${peerId}`;
		to = `${parsed.kind}:${peerId}`;
	}
	const baseSessionKey = buildOutboundBaseSessionKey({
		cfg: params.cfg,
		channel: "imessage",
		agentId: params.agentId,
		accountId: params.accountId,
		peer
	});
	return {
		sessionKey: baseSessionKey,
		baseSessionKey,
		recipientSessionExact,
		peer,
		chatType: peer.kind,
		from,
		to
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
			probeAccount: async ({ account, timeoutMs }) => await (await loadIMessageChannelRuntime()).probeIMessageAccount({
				timeoutMs,
				cliPath: account.config.cliPath,
				dbPath: account.config.dbPath,
				...account.config.remoteHost ? { remoteHost: account.config.remoteHost } : {}
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
		gateway: {
			apiVersion: 2,
			startAccount: async (ctx) => {
				const conversationBindings = createIMessageConversationBindingManager({
					cfg: ctx.cfg,
					accountId: ctx.accountId
				});
				try {
					return await (await loadIMessageChannelRuntime()).startIMessageGatewayAccount(ctx);
				} finally {
					conversationBindings.stop();
				}
			}
		},
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
				const prepared = (await loadIMessageApprovalReactionsModule()).addIMessageApprovalReactionHintToStructuredPayload({
					payload,
					approvalKind: hint.approvalKind
				});
				if (prepared) Object.assign(payload, prepared);
			},
			renderPresentation: ({ payload, presentation }) => questionGatewayRuntime.prepareReactionPayloadForDelivery({
				payload,
				presentation
			}),
			afterDeliverPayload: async ({ cfg, target, payload, results }) => {
				const delivery = {
					accountId: resolveIMessageAccount({
						cfg,
						accountId: target.accountId
					}).accountId,
					target,
					payload,
					results
				};
				(await loadIMessageQuestionReactionsModule()).registerIMessageQuestionReactionTargetForDeliveredPayload(delivery);
				await (await loadIMessageApprovalReactionsModule()).registerIMessageApprovalReactionTargetForDeliveredPayload(delivery);
			},
			deliveryCapabilities: { durableFinal: {
				text: true,
				media: true,
				replyTo: true,
				messageSendingHooks: true
			} }
		},
		attachedResults: {
			channel: "imessage",
			sendText: (ctx) => sendIMessageOutbound(ctx, "text"),
			sendMedia: (ctx) => sendIMessageOutbound(ctx, "media", ctx.onDeliveryResult ? { onDeliveryResult: async (result) => {
				await ctx.onDeliveryResult?.({
					channel: "imessage",
					...toIMessageMessageSendResult(result, ctx.audioAsVoice ? "voice" : "media", ctx.replyToId),
					messageId: result.messageId
				});
			} } : {})
		}
	}
});
//#endregion
export { resolveIMessageGroupSystemPrompt as a, matchIMessageAcpConversation as c, getIMessageApprovalApprovers as d, imessageApprovalAuth as f, resolveIMessageGroupRequireMention as i, normalizeIMessageAcpConversationId as l, createIMessagePluginBase as n, resolveIMessageGroupToolPolicy as o, imessageSetupWizard as r, resolveIMessageInboundConversationId as s, imessagePlugin as t, resolveIMessageConversationIdFromTarget as u };
