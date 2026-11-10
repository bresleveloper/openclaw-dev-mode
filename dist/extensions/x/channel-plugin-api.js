import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, xn as literal } from "../../schemas-BOYIvvln.mjs";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.mjs";
import { m as readToolStringParam } from "../../common-BofcG96e.mjs";
import { i as buildChannelConfigSchema, s as buildMultiAccountChannelSchema } from "../../config-schema-CJhF0RIe.mjs";
import { v as defineChannelMessageAdapter } from "../../channel-outbound-BbIm36V0.mjs";
import { r as buildSecretInputSchema } from "../../secret-input-CHX7JVid.mjs";
import { n as createStaticReplyToModeResolver } from "../../threading-helpers-JSVFlQzA.mjs";
import "../../conversation-runtime-BSuRFTFZ.mjs";
import "../../channel-config-schema-D0Su1KqG.mjs";
import "../../channel-actions-CaJbCkxs.mjs";
import "../../channel-core-Dz6TPItQ.mjs";
import { f as buildOpenGroupPolicyWarning } from "../../channel-policy-C81H0zj1.mjs";
import { t as extractToolSend } from "../../tool-send-DfuZI_cp.mjs";
import { i as resolveXAccount, r as resolveDefaultXAccountId, t as listXAccountIds } from "../../accounts-n2C-ky3w.mjs";
import { r as normalizeXUserId } from "../../allowlist-Bk-oAvxJ.mjs";
import { t as getXRuntime } from "../../runtime-B1HOiKKH.mjs";
import { a as X_GUEST_TOOLS, i as resolveXSenderTier, r as resolveXGuestToolPolicy } from "../../guest-policy-BDR2IA-u.mjs";
import { t as MAX_X_GUEST_MENTIONS_PER_AUTHOR_PER_DAY } from "../../guest-usage-AjpeBr4l.mjs";
import { t as channelSecrets } from "../../secret-contract-D3sWksY2.mjs";
import { t as normalizeXReplyTarget } from "../../target-Cu7hhfdb.mjs";
//#region extensions/x/src/config-schema.ts
const XAccountSchema = object({
	name: string().optional(),
	enabled: boolean().optional(),
	configWrites: boolean().optional(),
	autoPublishWorkSessions: boolean().optional(),
	userId: string().regex(/^\d+$/).optional(),
	username: string().regex(/^[A-Za-z0-9_]{1,15}$/).optional(),
	clientId: string().min(1).optional(),
	clientSecret: buildSecretInputSchema().optional(),
	refreshToken: buildSecretInputSchema().optional(),
	bearerToken: buildSecretInputSchema().optional(),
	costLimits: object({
		dailyUsd: number().finite().nonnegative().optional(),
		monthlyUsd: number().finite().nonnegative().optional(),
		cycleStartDay: number().int().min(1).max(28).optional()
	}).strict().optional(),
	events: object({
		mode: _enum([
			"auto",
			"stream",
			"poll"
		]).optional(),
		pollSeconds: number().int().min(15).optional()
	}).strict().optional(),
	allowFrom: array(string().regex(/^(?:x:)?\d+$/i)).optional(),
	verifiedFromGitHub: object({
		repo: string().regex(/^[A-Za-z0-9][A-Za-z0-9-]{0,38}\/(?!\.{1,2}$)[A-Za-z0-9_.-]{1,100}$/).optional(),
		minPermission: _enum([
			"push",
			"maintain",
			"admin"
		]).optional(),
		refreshMinutes: number().int().min(15).optional(),
		token: buildSecretInputSchema().optional()
	}).strict().optional(),
	groupPolicy: _enum([
		"allowlist",
		"open",
		"disabled"
	]).optional(),
	dmPolicy: literal("disabled").optional(),
	threadContext: object({ maxPosts: number().int().min(2).max(100).optional() }).strict().optional(),
	guests: object({
		enabled: boolean().optional(),
		maxMentionsPerAuthorPerDay: number().int().min(0).max(MAX_X_GUEST_MENTIONS_PER_AUTHOR_PER_DAY).optional(),
		threadContextMaxPosts: number().int().min(2).max(100).optional(),
		tools: object({
			allow: array(_enum(X_GUEST_TOOLS)).optional(),
			deny: array(string()).optional()
		}).strict().optional()
	}).strict().optional(),
	replySignature: string().max(140).optional()
});
const XConfigSchema = buildMultiAccountChannelSchema(XAccountSchema, {
	accountSchema: XAccountSchema,
	accountsMode: "catchall"
});
//#endregion
//#region extensions/x/src/channel.ts
const send = async (params) => (await import("../../send-D3YqSlt8.mjs")).sendXDelivery(params);
const senderGuidance = "X turns come from verified users and guests. Every turn starts with a host-generated sender line. Verified users may request work sessions; guests receive repository answers only.";
const message = defineChannelMessageAdapter({
	id: "x",
	send: { text: send }
});
const xPlugin = {
	id: "x",
	meta: {
		id: "x",
		label: "X (Twitter)",
		selectionLabel: "X (Twitter mentions)",
		docsPath: "/channels/x",
		docsLabel: "x",
		blurb: "Allowlisted mentions with thread context and public replies.",
		order: 85
	},
	capabilities: {
		chatTypes: ["group"],
		media: false,
		reactions: false,
		threads: true,
		polls: false,
		nativeCommands: false,
		blockStreaming: false
	},
	reload: { configPrefixes: ["channels.x"] },
	configSchema: buildChannelConfigSchema(XConfigSchema),
	config: {
		listAccountIds: listXAccountIds,
		defaultAccountId: resolveDefaultXAccountId,
		resolveAccount: resolveXAccount,
		inspectAccount: (cfg, accountId) => {
			const account = resolveXAccount(cfg, accountId);
			return {
				accountId: account.accountId,
				enabled: account.enabled,
				configured: account.configured,
				name: account.name
			};
		},
		isEnabled: (account) => account.enabled,
		isConfigured: (account) => account.configured,
		describeAccount: (account) => ({
			accountId: account.accountId,
			enabled: account.enabled,
			configured: account.configured,
			name: account.name,
			dmPolicy: "disabled"
		}),
		resolveAllowFrom: ({ cfg, accountId }) => resolveXAccount(cfg, accountId).config.allowFrom,
		formatAllowFrom: ({ allowFrom }) => allowFrom.flatMap((entry) => normalizeXUserId(String(entry)) ?? [])
	},
	secrets: channelSecrets,
	agentPrompt: {
		messageToolHints: () => [senderGuidance],
		inboundFormattingHints: () => ({
			text_markup: "plain_text",
			rules: [senderGuidance, "Replies are public plain text; documentation URLs may be cited."]
		})
	},
	groups: {
		resolveRequireMention: () => true,
		resolveToolPolicy: ({ cfg, accountId, senderId }) => {
			const account = resolveXAccount(cfg, accountId);
			return resolveXSenderTier(account, senderId) === "maintainer" ? void 0 : resolveXGuestToolPolicy(account);
		}
	},
	security: { collectWarnings: ({ account }) => account.config.groupPolicy === "open" && !account.config.guests?.enabled ? [buildOpenGroupPolicyWarning({
		surface: "X public replies",
		openBehavior: "does not admit guests while guest mode is off",
		remediation: "Use channels.x.guests.enabled=true for repository-only guest answers, or set channels.x.groupPolicy=\"allowlist\" for maintainers only."
	})] : [] },
	messaging: {
		targetPrefixes: ["x"],
		normalizeTarget: normalizeXReplyTarget,
		inferTargetChatType: () => "group",
		targetResolver: {
			looksLikeId: (value) => Boolean(normalizeXReplyTarget(value)),
			hint: "x:<postId> or https://x.com/<handle>/status/<postId>"
		}
	},
	threading: { resolveReplyToMode: createStaticReplyToModeResolver("all") },
	actions: {
		describeMessageTool: ({ cfg, accountId }) => (accountId ? [resolveXAccount(cfg, accountId)] : listXAccountIds(cfg).map((id) => resolveXAccount(cfg, id))).some((account) => account.enabled && account.configured) ? {
			actions: ["send"],
			capabilities: []
		} : null,
		supportsAction: ({ action }) => action === "send",
		extractToolSend: ({ args }) => extractToolSend(args, "sendMessage"),
		handleAction: async ({ action, params, cfg, accountId, sessionKey, assertDirectAdapterHandoff }) => {
			if (action !== "send") throw new Error(`X does not support ${action}.`);
			const result = await send({
				cfg,
				accountId,
				to: readToolStringParam(params, "to", { required: true }),
				text: readToolStringParam(params, "message", { required: true }),
				mediaUrl: readToolStringParam(params, "media"),
				assertDirectAdapterHandoff,
				sessionKey
			});
			return jsonResult({
				ok: true,
				messageId: result.messageId
			});
		}
	},
	message,
	outbound: {
		deliveryMode: "direct",
		sendText: send,
		sendMedia: async () => {
			throw new Error("X supports text replies only; media is not supported.");
		},
		sendPayload: async (ctx) => {
			const result = await send({
				...ctx,
				text: ctx.payload.text ?? "",
				mediaUrl: ctx.payload.mediaUrl,
				mediaUrls: ctx.payload.mediaUrls
			});
			await ctx.onDeliveryResult?.(result);
			return result;
		}
	},
	status: {
		defaultRuntime: {
			accountId: "default",
			running: false
		},
		buildChannelSummary: ({ snapshot }) => ({ ...snapshot }),
		buildAccountSnapshot: async ({ account, runtime, cfg }) => ({
			...runtime,
			accountId: account.accountId,
			name: account.name,
			enabled: account.enabled,
			configured: account.configured,
			dmPolicy: "disabled",
			guests: await (await import("../../guests-BByTagkr.mjs")).getXGuestStatus(getXRuntime(), account, cfg),
			verifiedFromGitHub: await (await import("../../verified-github-DMkOA-1n.mjs")).getXGitHubStatus(getXRuntime(), account)
		})
	},
	gateway: { startAccount: async (ctx) => (await import("../../monitor-Z5wjnXX1.mjs")).startXAccount(ctx) }
};
//#endregion
export { xPlugin };
