import { f as normalizeIMessageMessagingTarget, l as parseIMessageTarget, o as looksLikeIMessageExplicitTargetId, p as isIMessagePhoneLikeHandle, r as inferIMessageTargetChatType, s as normalizeIMessageHandle } from "./targets-C7CIWJ0k.mjs";
import { a as resolveDefaultIMessageAccountId, i as listIMessageAccountIds, o as resolveIMessageAccount, t as collectIMessageDuplicateAccountSourceWarnings } from "./accounts-C1Ypv3Wn.mjs";
import { a as resolveIMessageDirectChatService, r as normalizeDirectChatIdentifier } from "./chat-context-fTfJVqAi.mjs";
import { r as registerIMessageSendStatus, t as imessageMessageActions } from "./actions-hiNfM1nd.mjs";
import { i as createIMessageSetupWizardProxy, s as imessageSetupContract } from "./setup-core-B1_P_t4T.mjs";
import { n as createIMessageConversationBindingManagerV2 } from "./conversation-bindings-8DjxoIYU.mjs";
import { n as sanitizeIMessageFinalOutboundText, r as sanitizeOutboundText } from "./sanitize-outbound-Dhjhz0a-.mjs";
import { t as IMessageChannelConfigSchema } from "./config-schema-BjkQV5P5.mjs";
import { n as resolveIMessageAttachmentRoots, r as resolveIMessageRemoteAttachmentRoots } from "./media-contract-BErFBKV9.mjs";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { buildDmGroupAccountAllowlistAdapter } from "openclaw/plugin-sdk/allowlist-config-edit";
import { adaptScopedAccountAccessor, createScopedChannelConfigAdapter, formatTrimmedAllowFromEntries } from "openclaw/plugin-sdk/channel-config-helpers";
import { createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createMessageReceiptFromOutboundResults, defineChannelMessageAdapter, sanitizeForPlainText } from "openclaw/plugin-sdk/channel-outbound";
import { buildChannelGroupsScopeTree, createRestrictSendersChannelSecurity, resolveChannelGroupPolicy, resolveScopeRequireMention, resolveScopeToolsPolicy } from "openclaw/plugin-sdk/channel-policy";
import { PAIRING_APPROVED_MESSAGE } from "openclaw/plugin-sdk/channel-status";
import { buildPassiveProbedChannelStatusSummary } from "openclaw/plugin-sdk/extension-shared";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { chunkMarkdownText } from "openclaw/plugin-sdk/reply-runtime";
import { buildOutboundBaseSessionKey, normalizeAccountId, parseAgentSessionKey } from "openclaw/plugin-sdk/routing";
import { collectStatusIssuesFromLastError, createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutesAsync } from "openclaw/plugin-sdk/approval-delivery-runtime";
import { createLazyChannelApprovalNativeRuntimeAdapterAsync } from "openclaw/plugin-sdk/approval-handler-adapter-runtime";
import { shouldSuppressLocalNativeExecApprovalPrompt } from "openclaw/plugin-sdk/approval-native-runtime";
import { addApprovalReactionHintToText } from "openclaw/plugin-sdk/approval-reaction-runtime";
import { buildTypedExecApprovalPendingReplyPayload, buildTypedPluginApprovalPendingReplyPayload } from "openclaw/plugin-sdk/approval-reply-runtime";
import { getExecApprovalReplyMetadata, resolveExecApprovalCommandDisplay, resolveExecApprovalRequestAllowedDecisions } from "openclaw/plugin-sdk/approval-runtime";
import { createChannelApprovalAuth } from "openclaw/plugin-sdk/approval-auth-runtime";
import { createChannelPluginBase, getChatChannelMeta } from "openclaw/plugin-sdk/core";
// extensions/imessage/src/approval-auth.ts
function normalizeIMessageApproverId(value) {
	const normalized = normalizeIMessageHandle(String(value));
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
// extensions/imessage/src/approval-text.ts
function replaceApprovalIdPlaceholder(text, approvalId) {
	return (text ?? "").replace(/\/approve\s+<id>/g, () => `/approve ${approvalId}`);
}
// extensions/imessage/src/approval-native.ts
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
function isDirectHandleTarget(to) {
	try {
		return parseIMessageTarget(to).kind === "handle";
	} catch {
		return false;
	}
}
const imessageApproval = createApproverRestrictedNativeApprovalCapabilityFromForwardingRoutesAsync({
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
		isOriginTargetAllowed: ({ cfg, accountId, target }) => isDirectHandleTarget(target.to) || getIMessageApprovalApprovers({
			cfg,
			accountId
		}).length > 0
	},
	describeExecApprovalSetup: ({ accountId }) => {
		return `iMessage supports native exec approvals for this account when \`approvals.exec.enabled\` is true and the route allows iMessage. Keep the macOS imsg bridge running and configure \`${accountId && accountId !== "default" ? `channels.imessage.accounts.${accountId}` : "channels.imessage"}.allowFrom\` to restrict approvers.`;
	},
	render: {
		exec: { buildPendingPayload: ({ request, nowMs }) => {
			const allowedDecisions = resolveExecApprovalRequestAllowedDecisions(request.request);
			const command = resolveExecApprovalCommandDisplay(request.request).commandText;
			const payload = buildTypedExecApprovalPendingReplyPayload({
				approvalId: request.id,
				approvalSlug: request.id.slice(0, 8),
				approvalCommandId: request.id,
				warningText: request.request.warningText ?? void 0,
				ask: request.request.ask ?? null,
				agentId: request.request.agentId ?? null,
				allowedDecisions,
				command,
				cwd: request.request.cwd ?? void 0,
				host: request.request.host === "node" ? "node" : "gateway",
				nodeId: request.request.nodeId ?? void 0,
				scope: request.request.scope ?? void 0,
				sessionKey: request.request.sessionKey ?? null,
				expiresAtMs: request.expiresAtMs,
				nowMs
			});
			return {
				...payload,
				text: addApprovalReactionHintToText({
					text: replaceApprovalIdPlaceholder(payload.text, request.id),
					allowedDecisions
				})
			};
		} },
		plugin: { buildPendingPayload: ({ request, nowMs }) => {
			const configuredDecisions = request.request.allowedDecisions;
			const allowedDecisions = configuredDecisions && configuredDecisions.length > 0 ? configuredDecisions : DEFAULT_PLUGIN_APPROVAL_DECISIONS;
			const payload = buildTypedPluginApprovalPendingReplyPayload({
				request,
				nowMs,
				allowedDecisions
			});
			return {
				...payload,
				text: addApprovalReactionHintToText({
					text: replaceApprovalIdPlaceholder(payload.text, request.id),
					allowedDecisions
				})
			};
		} }
	},
	createNativeRuntime: (routing) => createLazyChannelApprovalNativeRuntimeAdapterAsync({
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
		shouldHandle: async ({ cfg, accountId, context, approvalKind, request }) => Boolean(context) && routing.shouldHandleApprovalRequest({
			cfg,
			accountId,
			approvalKind,
			request
		}),
		load: async () => (await import("./approval-handler.runtime-zt9m983Z.mjs")).imessageApprovalNativeRuntime
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
	if (!to || !isDirectHandleTarget(to)) return null;
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
			if (!sessionTarget || !isDirectHandleTarget(sessionTarget.to)) return false;
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
const imessageApprovalCapability = imessageApproval.capability;
// extensions/imessage/src/conversation-id-core.ts
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
// extensions/imessage/src/conversation-id.ts
function resolveIMessageInboundConversationId(params) {
	if (params.isGroup) return params.chatId != null && Number.isFinite(params.chatId) ? String(params.chatId) : void 0;
	return normalizeIMessageHandle(params.sender) || void 0;
}
// extensions/imessage/src/doctor.ts
const imessageDoctor = {
	groupAllowFromFallbackToAllowFrom: false,
	collectPreviewWarnings: ({ cfg }) => collectIMessageDuplicateAccountSourceWarnings({ cfg })
};
// extensions/imessage/src/group-policy.ts
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
// extensions/imessage/src/shared.ts
const IMESSAGE_CHANNEL = "imessage";
const imessageSetupWizard = createIMessageSetupWizardProxy(async () => (await import("./setup-surface-Cp8vVjtf.mjs")).imessageSetupWizard);
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
// extensions/imessage/src/channel.ts
const loadIMessageChannelRuntime = createLazyRuntimeModule(() => import("./channel.runtime-D7-Pr2xA.mjs"));
const loadIMessageChatLookup = createLazyRuntimeModule(() => import("./chat-lookup-CecNl35X.mjs"));
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
const loadIMessageApprovalReactionsModule = createLazyRuntimeModule(() => import("./approval-reactions-Dtw4zfSy.mjs").then((n) => n.t));
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
async function resolveIMessageConversationTarget(params) {
	let parsed = parseIMessageTarget(params.target);
	const account = resolveIMessageAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const deliveryTarget = parsed.kind === "handle" ? void 0 : params.target;
	if (parsed.kind !== "handle") {
		const chat = await (await loadIMessageChatLookup()).resolveIMessageChat({
			target: parsed,
			options: {
				cliPath: account.config.cliPath?.trim() || "imsg",
				dbPath: account.config.dbPath,
				remoteHost: account.config.remoteHost
			},
			conversationReadOrigin: "delegated"
		});
		if (!chat) return null;
		const chatType = resolveChannelGroupPolicy({
			cfg: params.cfg,
			channel: "imessage",
			accountId: account.accountId,
			groupId: String(chat.id)
		}).groupConfig ? "group" : inferIMessageTargetChatType(`chat_guid:${chat.guid}`);
		if (!chatType) return null;
		if (chatType === "group") return {
			accountId: account.accountId,
			peer: {
				kind: "group",
				id: String(chat.id)
			},
			from: `imessage:group:${chat.id}`,
			to: params.target,
			recipientSessionExact: false
		};
		parsed = {
			kind: "handle",
			to: normalizeDirectChatIdentifier(chat.guid),
			service: resolveIMessageDirectChatService(account.config.service, chat.guid) ?? "auto",
			serviceExplicit: true
		};
	}
	const handle = normalizeIMessageHandle(parsed.to);
	if (!handle) return null;
	const from = `${resolveIMessageDirectChatService(parsed.serviceExplicit ? parsed.service : account.config.service) ?? "auto"}:${handle}`;
	return {
		accountId: account.accountId,
		peer: {
			kind: "direct",
			id: handle
		},
		from,
		to: deliveryTarget ?? from,
		recipientSessionExact: isCanonicalIMessageDirectHandle(parsed.to, handle)
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
			createManager: ({ cfg, accountId }) => createIMessageConversationBindingManagerV2({
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
			resolveOutboundSessionRoute: async (params) => {
				const target = await resolveIMessageConversationTarget(params);
				if (!target) return null;
				const { accountId, ...route } = target;
				const baseSessionKey = buildOutboundBaseSessionKey({
					...params,
					accountId,
					channel: "imessage",
					peer: route.peer
				});
				return {
					sessionKey: baseSessionKey,
					baseSessionKey,
					...route,
					chatType: route.peer.kind
				};
			},
			targetResolver: {
				looksLikeId: looksLikeIMessageExplicitTargetId,
				hint: "<phone|email|chat_id:ID|auto:contact|imessage:contact|sms:contact>",
				resolveTarget: async ({ cfg, accountId, input }) => {
					const to = normalizeIMessageMessagingTarget(input);
					if (!to) return null;
					const target = await resolveIMessageConversationTarget({
						cfg,
						accountId,
						target: to
					});
					if (!target) return null;
					const parsed = parseIMessageTarget(to);
					const display = parsed.kind === "handle" && !isCanonicalIMessageDirectHandle(parsed.to, normalizeIMessageHandle(parsed.to)) ? parsed.to.trim() : void 0;
					return {
						to,
						kind: target.peer.kind === "direct" ? "user" : "group",
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
				const conversationBindings = createIMessageConversationBindingManagerV2({
					cfg: ctx.cfg,
					accountId: ctx.accountId
				});
				const sendStatus = registerIMessageSendStatus(ctx);
				try {
					return await (await loadIMessageChannelRuntime()).startIMessageGatewayAccount(ctx);
				} finally {
					sendStatus?.dispose();
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
export { resolveIMessageGroupSystemPrompt as a, matchIMessageAcpConversation as c, getIMessageApprovalApprovers as d, imessageApprovalAuth as f, resolveIMessageGroupRequireMention as i, normalizeIMessageAcpConversationId as l, createIMessagePluginBase as n, resolveIMessageGroupToolPolicy as o, imessageSetupWizard as r, resolveIMessageInboundConversationId as s, imessagePlugin as t, resolveIMessageConversationIdFromTarget as u };
