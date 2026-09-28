import { c as isZaloAccountConfigured, d as resolveZaloAccount, i as zaloSetupContract, l as listZaloAccountIds, p as buildSecretInputSchema, s as inspectZaloAccount, t as createZaloSetupWizardProxy, u as resolveDefaultZaloAccountId } from "./setup-core-CCMLSh4Q.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-Cpsqe5Cv.mjs";
import { describeWebhookAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { formatAllowFromLowercase } from "openclaw/plugin-sdk/allow-from";
import { adaptScopedAccountAccessor, createScopedChannelConfigAdapter, createScopedDmSecurityResolver, mapAllowFromEntries } from "openclaw/plugin-sdk/channel-config-helpers";
import { buildChannelConfigSchema, createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { defineChannelMessageAdapter } from "openclaw/plugin-sdk/channel-outbound";
import { buildOpenGroupPolicyRestrictSendersWarning, buildOpenGroupPolicyWarning, createConditionalWarningCollector, createOpenProviderGroupPolicyWarningCollector } from "openclaw/plugin-sdk/channel-policy";
import { createAttachedChannelResultAdapter, createEmptyChannelResult } from "openclaw/plugin-sdk/channel-send-result";
import { PAIRING_APPROVED_MESSAGE, buildTokenChannelStatusSummary } from "openclaw/plugin-sdk/channel-status";
import { createStaticReplyToModeResolver } from "openclaw/plugin-sdk/conversation-runtime";
import { createChannelDirectoryAdapter, listResolvedDirectoryUserEntriesFromAllowFrom } from "openclaw/plugin-sdk/directory-runtime";
import { createLazyRuntimeModule, createLazyRuntimeNamedExport } from "openclaw/plugin-sdk/lazy-runtime";
import { sendPayloadWithChunkedTextAndMedia } from "openclaw/plugin-sdk/reply-payload";
import { createComputedAccountStatusAdapter, createDefaultChannelRuntimeState, standardDmPolicyOpenIssue } from "openclaw/plugin-sdk/status-helpers";
import { chunkTextForOutbound, sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { jsonResult, readStringParam } from "openclaw/plugin-sdk/channel-actions";
import { extractToolSend } from "openclaw/plugin-sdk/tool-send";
import { createChannelApprovalAuth } from "openclaw/plugin-sdk/approval-auth-runtime";
import { AllowFromListSchema, DmPolicySchema, GroupPolicySchema, MarkdownConfigSchema, buildMultiAccountChannelSchema } from "openclaw/plugin-sdk/channel-config-schema";
import { z } from "zod";
import { buildChannelOutboundSessionRoute, stripChannelTargetPrefix, stripTargetKindPrefix } from "openclaw/plugin-sdk/core";
import { coerceStatusIssueAccountId, readStatusIssueFields } from "openclaw/plugin-sdk/extension-shared";
//#region extensions/zalo/src/actions.ts
const loadZaloActionsRuntime = createLazyRuntimeNamedExport(() => import("./actions.runtime-B7EqgwH6.mjs"), "zaloActionsRuntime");
const providerId = "zalo";
const ZALO_ACTIONS = /* @__PURE__ */ new Set(["send"]);
function listEnabledAccounts(cfg, accountId) {
	return (accountId ? [inspectZaloAccount({
		cfg,
		accountId
	})] : listZaloAccountIds(cfg).map((listedAccountId) => inspectZaloAccount({
		cfg,
		accountId: listedAccountId
	}))).filter((account) => account.enabled && account.tokenStatus === "available");
}
const zaloMessageActions = {
	describeMessageTool: ({ cfg, accountId }) => {
		if (listEnabledAccounts(cfg, accountId).length === 0) return null;
		return {
			actions: Array.from(ZALO_ACTIONS),
			capabilities: []
		};
	},
	supportsAction: ({ action }) => ZALO_ACTIONS.has(action),
	extractToolSend: ({ args }) => extractToolSend(args, "sendMessage"),
	handleAction: async ({ action, params, cfg, accountId, assertDirectAdapterHandoff }) => {
		if (action === "send") {
			const to = readStringParam(params, "to", { required: true });
			const content = readStringParam(params, "message", {
				required: true,
				allowEmpty: true
			});
			const mediaUrl = readStringParam(params, "media", { trim: false });
			const { sendMessageZalo } = await loadZaloActionsRuntime();
			const result = await sendMessageZalo(to ?? "", content ?? "", {
				accountId: accountId ?? void 0,
				mediaUrl: mediaUrl ?? void 0,
				cfg,
				assertDirectAdapterHandoff
			});
			if (!result.ok) return jsonResult({
				ok: false,
				error: result.error ?? "Failed to send Zalo message"
			});
			return jsonResult({
				ok: true,
				to,
				messageId: result.messageId
			});
		}
		throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
	}
};
//#endregion
//#region extensions/zalo/src/approval-auth.ts
function normalizeZaloApproverId(value) {
	const normalized = String(value).trim().replace(/^(zalo|zl):/i, "").trim();
	return /^\d+$/.test(normalized) ? normalized : void 0;
}
const zaloApprovalAuth = createChannelApprovalAuth({
	channelLabel: "Zalo",
	resolveInputs: ({ cfg, accountId }) => {
		return { allowFrom: resolveZaloAccount({
			cfg,
			accountId
		}).config.allowFrom };
	},
	normalizeApprover: normalizeZaloApproverId
}).approvalAuth;
//#endregion
//#region extensions/zalo/src/config-schema.ts
const ZaloAccountSchema = z.object({
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	markdown: MarkdownConfigSchema,
	botToken: buildSecretInputSchema().optional(),
	tokenFile: z.string().optional(),
	webhookUrl: z.string().optional(),
	webhookSecret: buildSecretInputSchema().optional(),
	webhookPath: z.string().optional(),
	dmPolicy: DmPolicySchema.optional(),
	allowFrom: AllowFromListSchema,
	groupPolicy: GroupPolicySchema.optional(),
	groupAllowFrom: AllowFromListSchema,
	mediaMaxMb: z.number().optional(),
	proxy: z.string().optional(),
	responsePrefix: z.string().optional()
});
const ZaloConfigSchema = buildMultiAccountChannelSchema(ZaloAccountSchema.extend({ historyLimit: z.number().int().min(0).optional() }), {
	accountSchema: ZaloAccountSchema,
	accountsMode: "catchall"
});
//#endregion
//#region extensions/zalo/src/session-route.ts
function resolveZaloOutboundSessionRoute(params) {
	const trimmed = stripChannelTargetPrefix(params.target, "zalo", "zl");
	if (!trimmed) return null;
	const normalizedTarget = normalizeLowercaseStringOrEmpty(trimmed);
	const isGroup = normalizedTarget.startsWith("group:");
	const recipientSessionExact = /^(?:group|user|dm):/.test(normalizedTarget);
	const peerId = stripTargetKindPrefix(trimmed);
	if (!peerId) return null;
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "zalo",
		accountId: params.accountId,
		recipientSessionExact,
		peer: {
			kind: isGroup ? "group" : "direct",
			id: peerId
		},
		chatType: isGroup ? "group" : "direct",
		from: isGroup ? `zalo:group:${peerId}` : `zalo:${peerId}`,
		to: `zalo:${peerId}`
	});
}
//#endregion
//#region extensions/zalo/src/status-issues.ts
const ZALO_STATUS_FIELDS = [
	"accountId",
	"enabled",
	"configured",
	"dmPolicy"
];
function collectZaloStatusIssues(accounts) {
	const issues = [];
	for (const entry of accounts) {
		const account = readStatusIssueFields(entry, ZALO_STATUS_FIELDS);
		if (!account) continue;
		const accountId = coerceStatusIssueAccountId(account.accountId) ?? "default";
		const enabled = account.enabled !== false;
		const configured = account.configured === true;
		if (!enabled || !configured) continue;
		if (account.dmPolicy === "open") issues.push(standardDmPolicyOpenIssue({
			channel: "zalo",
			accountId,
			channelLabel: "Zalo",
			configPath: "channels.zalo"
		}));
	}
	return issues;
}
//#endregion
//#region extensions/zalo/src/channel.ts
const meta = {
	id: "zalo",
	label: "Zalo",
	selectionLabel: "Zalo (Bot API)",
	docsPath: "/channels/zalo",
	docsLabel: "zalo",
	blurb: "Vietnam-focused messaging platform with Bot API.",
	aliases: ["zl"],
	order: 80,
	quickstartAllowFrom: true
};
function normalizeZaloMessagingTarget(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return;
	return trimmed.replace(/^(zalo|zl):/i, "").trim();
}
function looksLikeZaloChatId(raw, normalized) {
	const target = normalizeZaloMessagingTarget(normalized ?? raw);
	return Boolean(target);
}
const loadZaloChannelRuntime = createLazyRuntimeModule(() => import("./channel.runtime-Bm9k5qqB.mjs"));
const zaloSetupWizard = createZaloSetupWizardProxy(async () => (await import("./setup-surface-CNyPRzlv.mjs").then((n) => n.t)).zaloSetupWizard);
const zaloTextChunkLimit = 2e3;
async function sendZaloDelivery(ctx) {
	const result = await (await loadZaloChannelRuntime()).sendZaloText({
		to: ctx.to,
		text: ctx.text,
		accountId: ctx.accountId ?? void 0,
		mediaUrl: ctx.mediaUrl,
		cfg: ctx.cfg,
		assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff
	});
	if (!result.ok) throw new Error(result.error ?? `Failed to send Zalo ${ctx.mediaUrl ? "media" : "message"}`);
	return {
		messageId: result.messageId ?? "",
		receipt: result.receipt
	};
}
const zaloSendResultAdapter = createAttachedChannelResultAdapter({
	channel: "zalo",
	sendText: sendZaloDelivery,
	sendMedia: sendZaloDelivery
});
const zaloMessageAdapter = defineChannelMessageAdapter({
	id: "zalo",
	durableFinal: { capabilities: {
		text: true,
		media: true,
		messageSendingHooks: true
	} },
	send: {
		text: sendZaloDelivery,
		media: sendZaloDelivery
	}
});
const zaloConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "zalo",
	listAccountIds: listZaloAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveZaloAccount),
	defaultAccountId: resolveDefaultZaloAccountId,
	clearBaseFields: [
		"botToken",
		"tokenFile",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({
		allowFrom,
		stripPrefixRe: /^(zalo|zl):/i
	})
});
const resolveZaloDmPolicy = createScopedDmSecurityResolver({
	channelKey: "zalo",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy",
	normalizeEntry: (raw) => raw.trim().replace(/^(zalo|zl):/i, "")
});
const collectZaloSecurityWarnings = createOpenProviderGroupPolicyWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.zalo !== void 0,
	resolveGroupPolicy: ({ account }) => account.config.groupPolicy,
	collect: ({ account, groupPolicy }) => {
		if (groupPolicy !== "open") return [];
		const explicitGroupAllowFrom = mapAllowFromEntries(account.config.groupAllowFrom);
		const dmAllowFrom = mapAllowFromEntries(account.config.allowFrom);
		if ((explicitGroupAllowFrom.length > 0 ? explicitGroupAllowFrom : dmAllowFrom).length > 0) return [buildOpenGroupPolicyRestrictSendersWarning({
			surface: "Zalo groups",
			openScope: "any member",
			groupPolicyPath: "channels.zalo.groupPolicy",
			groupAllowFromPath: "channels.zalo.groupAllowFrom"
		})];
		return [buildOpenGroupPolicyWarning({
			surface: "Zalo groups",
			openBehavior: "with no groupAllowFrom/allowFrom allowlist; any member can trigger (mention-gated)",
			remediation: "Set channels.zalo.groupPolicy=\"allowlist\" + channels.zalo.groupAllowFrom"
		})];
	}
});
const collectZaloOpenGroupFindings = createConditionalWarningCollector.findings({
	collectWarnings: collectZaloSecurityWarnings,
	checkId: "channels.zalo.groups.open",
	severity: "warn",
	title: "Zalo security warning"
});
const zaloPlugin = createChatChannelPlugin({
	base: {
		id: "zalo",
		meta,
		setupContract: zaloSetupContract,
		setupWizard: zaloSetupWizard,
		capabilities: {
			chatTypes: ["direct", "group"],
			media: true,
			reactions: false,
			threads: false,
			polls: false,
			nativeCommands: false,
			blockStreaming: true
		},
		reload: { configPrefixes: ["channels.zalo"] },
		configSchema: buildChannelConfigSchema(ZaloConfigSchema),
		config: {
			...zaloConfigAdapter,
			inspectAccount: adaptScopedAccountAccessor(inspectZaloAccount),
			isConfigured: isZaloAccountConfigured,
			describeAccount: (account) => describeWebhookAccountSnapshot({
				account,
				configured: isZaloAccountConfigured(account),
				mode: account.config.webhookUrl ? "webhook" : "polling",
				extra: {
					tokenSource: account.tokenSource,
					tokenStatus: account.tokenStatus
				}
			})
		},
		approvalCapability: zaloApprovalAuth,
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		},
		groups: { resolveRequireMention: () => true },
		actions: zaloMessageActions,
		messaging: {
			targetPrefixes: ["zalo", "zl"],
			normalizeTarget: normalizeZaloMessagingTarget,
			inferTargetChatType: ({ to }) => {
				const target = normalizeZaloMessagingTarget(to);
				return target ? /^group:/i.test(target) ? "group" : "direct" : void 0;
			},
			resolveOutboundSessionRoute: (params) => resolveZaloOutboundSessionRoute(params),
			targetResolver: {
				looksLikeId: looksLikeZaloChatId,
				hint: "<chatId>"
			}
		},
		directory: createChannelDirectoryAdapter({
			listPeers: async (params) => listResolvedDirectoryUserEntriesFromAllowFrom({
				...params,
				resolveAccount: adaptScopedAccountAccessor(resolveZaloAccount),
				resolveAllowFrom: (account) => account.config.allowFrom,
				normalizeId: (entry) => entry.trim().replace(/^(zalo|zl):/i, "")
			}),
			listGroups: async () => []
		}),
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			collectStatusIssues: collectZaloStatusIssues,
			buildChannelSummary: ({ snapshot }) => buildTokenChannelStatusSummary(snapshot),
			probeAccount: async ({ account, timeoutMs }) => await (await loadZaloChannelRuntime()).probeZaloAccount({
				account,
				timeoutMs
			}),
			resolveAccountSnapshot: ({ account }) => {
				const configured = isZaloAccountConfigured(account);
				return {
					accountId: account.accountId,
					name: account.name,
					enabled: account.enabled,
					configured,
					extra: {
						tokenSource: account.tokenSource,
						tokenStatus: account.tokenStatus,
						mode: account.config.webhookUrl ? "webhook" : "polling",
						dmPolicy: account.config.dmPolicy ?? "pairing"
					}
				};
			}
		}),
		gateway: { startAccount: async (ctx) => await (await loadZaloChannelRuntime()).startZaloGatewayAccount(ctx) },
		message: zaloMessageAdapter
	},
	security: {
		resolveDmPolicy: resolveZaloDmPolicy,
		collectWarnings: collectZaloOpenGroupFindings
	},
	pairing: { text: {
		idLabel: "zaloUserId",
		message: PAIRING_APPROVED_MESSAGE,
		normalizeAllowEntry: (entry) => entry.trim().replace(/^(zalo|zl):/i, ""),
		notify: async (params) => {
			await sendZaloDelivery({
				...params,
				to: params.id,
				text: params.message
			});
		}
	} },
	threading: { resolveReplyToMode: createStaticReplyToModeResolver("off") },
	outbound: {
		deliveryMode: "direct",
		chunker: chunkTextForOutbound,
		chunkerMode: "text",
		textChunkLimit: zaloTextChunkLimit,
		sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
		sendPayload: async (ctx) => await sendPayloadWithChunkedTextAndMedia({
			ctx,
			textChunkLimit: zaloTextChunkLimit,
			chunker: chunkTextForOutbound,
			sendText: (nextCtx) => zaloSendResultAdapter.sendText(nextCtx),
			sendMedia: (nextCtx) => zaloSendResultAdapter.sendMedia(nextCtx),
			emptyResult: createEmptyChannelResult("zalo"),
			onResult: ctx.onDeliveryResult
		}),
		...zaloSendResultAdapter
	}
});
//#endregion
export { zaloPlugin as t };
