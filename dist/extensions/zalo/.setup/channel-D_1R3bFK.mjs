import { c as isZaloAccountConfigured, d as resolveZaloAccount, i as zaloSetupContract, l as listZaloAccountIds, s as inspectZaloAccount, t as createZaloSetupWizardProxy, u as resolveDefaultZaloAccountId } from "./setup-core-B9x2V3Eq.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-lPP1bnR_.mjs";
import { describeWebhookAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { formatAllowFromLowercase } from "openclaw/plugin-sdk/allow-from";
import { adaptScopedAccountAccessor, createScopedChannelConfigAdapter, createScopedDmSecurityResolver, mapAllowFromEntries } from "openclaw/plugin-sdk/channel-config-helpers";
import { buildChannelConfigSchema, buildChannelOutboundSessionRoute, createChatChannelPlugin, stripChannelTargetPrefix, stripTargetKindPrefix } from "openclaw/plugin-sdk/channel-core";
import { defineChannelMessageAdapter } from "openclaw/plugin-sdk/channel-outbound";
import { buildOpenGroupPolicyRestrictSendersWarning, buildOpenGroupPolicyWarning, createConditionalWarningCollector, createOpenProviderGroupPolicyWarningCollector } from "openclaw/plugin-sdk/channel-policy";
import { createAttachedChannelResultAdapter, createEmptyChannelResult } from "openclaw/plugin-sdk/channel-send-result";
import { PAIRING_APPROVED_MESSAGE, buildTokenChannelStatusSummary } from "openclaw/plugin-sdk/channel-status";
import { createStaticReplyToModeResolver } from "openclaw/plugin-sdk/conversation-runtime";
import { createChannelDirectoryAdapter, listResolvedDirectoryUserEntriesFromAllowFrom } from "openclaw/plugin-sdk/directory-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { convertMarkdownTables, resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { sendPayloadWithChunkedTextAndMedia } from "openclaw/plugin-sdk/reply-payload";
import { createComputedAccountStatusAdapter, createDefaultChannelRuntimeState, resolveEnabledConfiguredAccountId, standardDmPolicyOpenIssue } from "openclaw/plugin-sdk/status-helpers";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { chunkTextForOutbound, sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { extractToolSend } from "openclaw/plugin-sdk/tool-send";
import { buildSecretInputSchema } from "openclaw/plugin-sdk/secret-input";
import { createChannelApprovalAuth } from "openclaw/plugin-sdk/approval-auth-runtime";
import { AllowFromListSchema, DmPolicySchema, GroupPolicySchema, MarkdownConfigSchema, buildMultiAccountChannelSchema } from "openclaw/plugin-sdk/channel-config-schema";
import { z } from "zod";
// extensions/zalo/src/approval-auth.ts
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
// extensions/zalo/src/config-schema.ts
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
// extensions/zalo/src/channel.ts
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
const loadZaloChannelRuntime = createLazyRuntimeModule(() => import("./channel.runtime-Bv-4xN53.mjs").then((n) => n.t));
const zaloSetupWizard = createZaloSetupWizardProxy(async () => (await import("./setup-surface-D5kOiuNu.mjs").then((n) => n.t)).zaloSetupWizard);
const zaloTextChunkLimit = 2e3;
async function sendZaloDelivery(ctx) {
	return await (await loadZaloChannelRuntime()).sendMessageZalo(ctx.to, ctx.text, {
		accountId: ctx.accountId ?? void 0,
		mediaUrl: ctx.mediaUrl,
		cfg: ctx.cfg,
		assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff
	});
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
		actions: {
			describeMessageTool: ({ cfg, accountId }) => {
				return (accountId ? [inspectZaloAccount({
					cfg,
					accountId
				})] : listZaloAccountIds(cfg).map((listedAccountId) => inspectZaloAccount({
					cfg,
					accountId: listedAccountId
				}))).some((account) => account.enabled && account.tokenStatus === "available") ? {
					actions: ["send"],
					capabilities: []
				} : null;
			},
			supportsAction: ({ action }) => action === "send",
			extractToolSend: ({ args }) => extractToolSend(args, "sendMessage")
		},
		messaging: {
			targetPrefixes: ["zalo", "zl"],
			normalizeTarget: normalizeZaloMessagingTarget,
			inferTargetChatType: ({ to }) => {
				const target = normalizeZaloMessagingTarget(to);
				return target ? /^group:/i.test(target) ? "group" : "direct" : void 0;
			},
			resolveOutboundSessionRoute: (params) => {
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
			},
			targetResolver: {
				looksLikeId: (raw, normalized) => Boolean(normalizeZaloMessagingTarget(normalized ?? raw)),
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
			collectStatusIssues: (accounts) => accounts.flatMap((account) => {
				const accountId = resolveEnabledConfiguredAccountId(account);
				return accountId && account.dmPolicy === "open" ? [standardDmPolicyOpenIssue({
					channel: "zalo",
					accountId,
					channelLabel: "Zalo",
					configPath: "channels.zalo"
				})] : [];
			}),
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
		sanitizeText: ({ text, cfg, accountId }) => convertMarkdownTables(sanitizeAssistantVisibleText(text), resolveMarkdownTableMode({
			cfg,
			channel: "zalo",
			accountId
		})),
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
export { zaloPlugin as t };
