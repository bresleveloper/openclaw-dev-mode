import { n as isSlackPluginAccountConfigured } from "./account-configured-sUohAxZr.mjs";
import { c as resolveSlackAccountDmPolicy, i as mergeSlackAccountConfig, r as listSlackAccountIds, s as resolveSlackAccountAllowFrom } from "./accounts-BBHvg0pY.mjs";
import { t as inspectSlackAccount } from "./account-inspect-DP1Bcwj4.mjs";
import { a as parseSlackTarget } from "./target-parsing-DEsPjngB.mjs";
import { a as slackIngressIdentity, t as probeSlack } from "./probe-DiYIMPJo.mjs";
import { n as slackBaseConfigAdapter, t as slackSetupPlugin } from "./channel.setup-BVoUtdPn.mjs";
import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./doctor-contract-CtMUqjvk.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-DxmvbxBF.mjs";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1 } from "openclaw/plugin-sdk/account-id";
import { adaptScopedAccountAccessor, createScopedDmSecurityResolver } from "openclaw/plugin-sdk/channel-config-helpers";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { PAIRING_APPROVED_MESSAGE, projectCredentialSnapshotFields, resolveConfiguredFromRequiredCredentialStatuses } from "openclaw/plugin-sdk/channel-status";
import { buildMutableAllowEntryDetector, collectStandardAllowlistLists, createConditionalWarningCollector, createDangerousNameMatchingMutableAllowlistWarningCollector, createOpenProviderConfiguredRouteWarningCollector } from "openclaw/plugin-sdk/channel-policy";
import { identityEntryAuthenticationClassifier } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { asObjectRecord } from "openclaw/plugin-sdk/runtime-doctor-migrations";
//#region extensions/slack/src/channel-api.ts
const SLACK_CHANNEL_META = {
	id: "slack",
	label: "Slack",
	selectionLabel: "Slack",
	docsPath: "/channels/slack",
	docsLabel: "slack",
	blurb: "supports bot + app tokens, channels, threads, and interactive replies.",
	systemImage: "number.square",
	markdownCapable: true
};
function getChatChannelMeta(id) {
	if (id !== SLACK_CHANNEL_META.id) throw new Error(`Unsupported Slack channel meta lookup: ${id}`);
	return SLACK_CHANNEL_META;
}
//#endregion
//#region extensions/slack/src/security.ts
const resolveSlackDmPolicy = createScopedDmSecurityResolver({
	channelKey: "slack",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	resolveAccess: ({ cfg, account }) => ({
		dmPolicy: resolveSlackAccountDmPolicy({
			cfg,
			accountId: account.accountId
		}),
		allowFrom: resolveSlackAccountAllowFrom({
			cfg,
			accountId: account.accountId
		})
	}),
	policyPathSuffix: "dmPolicy",
	classifyEntryAuthentication: identityEntryAuthenticationClassifier(slackIngressIdentity),
	normalizeEntry: (raw) => raw.trim().replace(/^(slack|user):/i, "").trim()
});
const collectSlackSecurityWarnings = createOpenProviderConfiguredRouteWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.slack !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	resolveRouteAllowlistConfigured: (account) => Boolean(account.config.channels) && Object.keys(account.config.channels ?? {}).length > 0,
	configureRouteAllowlist: {
		surface: "Slack channels",
		openScope: "any channel not explicitly denied",
		groupPolicyPath: "channels.slack.groupPolicy",
		routeAllowlistPath: "channels.slack.channels"
	},
	missingRouteAllowlist: {
		surface: "Slack channels",
		openBehavior: "with no channel allowlist; any channel can trigger (mention-gated)",
		remediation: "Set channels.slack.groupPolicy=\"allowlist\" and configure channels.slack.channels"
	}
});
const collectSlackSecurityFindings = createConditionalWarningCollector.findings({
	collectWarnings: collectSlackSecurityWarnings,
	checkId: "channels.slack.groups.open",
	severity: "warn",
	title: "Slack security warning"
});
const loadSlackSecurityAuditModule = createLazyRuntimeModule(() => import("./security-audit-BypHqcq5.mjs").then((n) => n.n));
const slackSecurityAdapter = {
	resolveDmPolicy: resolveSlackDmPolicy,
	collectWarnings: collectSlackSecurityFindings,
	collectAuditFindings: async (params) => {
		const { collectSlackSecurityAuditFindings } = await loadSlackSecurityAuditModule();
		return await collectSlackSecurityAuditFindings(params);
	}
};
//#endregion
//#region extensions/slack/src/security-doctor.ts
const isSlackMutableUnqualifiedAllowEntry = buildMutableAllowEntryDetector({ stableIdPattern: /^(?:(?:(?:[sS][lL][aA][cC][kK]|[uU][sS][eE][rR]):)?(?:[UWBCGDT][A-Z0-9]{2,}|[A-Za-z0-9]{8,})|<@[A-Za-z0-9]{8,}>)$/ });
function isSlackMutableAllowEntry(entry) {
	if (/^team:/i.test(entry)) try {
		const target = parseSlackTarget(entry);
		if (target?.kind === "user" && target.teamId) return false;
	} catch {}
	return isSlackMutableUnqualifiedAllowEntry(entry);
}
//#endregion
//#region extensions/slack/src/doctor.ts
const collectSlackMutableAllowlistWarnings = createDangerousNameMatchingMutableAllowlistWarningCollector({
	channel: "slack",
	detector: isSlackMutableAllowEntry,
	collectLists: (scope) => collectStandardAllowlistLists(scope, {
		includeGroupAllowFrom: false,
		includeDm: true,
		includeGroups: true,
		groupsKey: "channels",
		groupField: "users"
	})
});
const SLACK_CANONICAL_CHANNEL_ID_RE = /^[CG][A-Z0-9]{8,}$/;
const SLACK_LOWERCASE_CHANNEL_ID_RE = /^[cg][0-9][a-z0-9]{7,}$/;
const SLACK_PREFIXED_CANONICAL_CHANNEL_ID_RE = /^channel:[CG][A-Z0-9]{8,}$/;
const SLACK_PREFIXED_LOWERCASE_CHANNEL_ID_RE = /^channel:[cg][0-9][a-z0-9]{7,}$/;
const SLACK_CANONICAL_DM_ID_RE = /^(?:channel:)?D[A-Z0-9]{8,}$/;
const SLACK_PREFIXED_LOWERCASE_DM_ID_RE = /^channel:d[a-z0-9]{8,}$/;
const SLACK_AMBIGUOUS_LOWERCASE_DM_ID_RE = /^d[a-z0-9]{8,}$/;
const SLACK_AMBIGUOUS_LOWERCASE_CHANNEL_ID_RE = /^(?:channel:)?[cgd][a-z][a-z0-9]{7,}$/;
const SLACK_CHANNEL_NAME_RE = /^[\p{L}\p{M}\p{N}_-]{1,80}$/u;
const SLACK_CHANNEL_NAME_ALPHANUMERIC_RE = /[\p{L}\p{N}]/u;
function looksLikeSlackChannelId(channelKey) {
	const workspaceChannelId = parseWorkspaceQualifiedChannelId(channelKey);
	return workspaceChannelId !== void 0 && /^[CG]/i.test(workspaceChannelId) || SLACK_CANONICAL_CHANNEL_ID_RE.test(channelKey) || SLACK_LOWERCASE_CHANNEL_ID_RE.test(channelKey) || SLACK_PREFIXED_CANONICAL_CHANNEL_ID_RE.test(channelKey) || SLACK_PREFIXED_LOWERCASE_CHANNEL_ID_RE.test(channelKey);
}
function looksLikeSlackDmId(channelKey) {
	const workspaceChannelId = parseWorkspaceQualifiedChannelId(channelKey);
	return workspaceChannelId !== void 0 && /^D/i.test(workspaceChannelId) || SLACK_CANONICAL_DM_ID_RE.test(channelKey) || SLACK_PREFIXED_LOWERCASE_DM_ID_RE.test(channelKey);
}
function parseWorkspaceQualifiedChannelId(channelKey) {
	if (!/^team:/i.test(channelKey)) return;
	try {
		const target = parseSlackTarget(channelKey);
		return target?.kind === "channel" && target.teamId ? target.id : void 0;
	} catch {
		return;
	}
}
function looksLikeSlackChannelNameKey(channelKey) {
	const name = channelKey.startsWith("#") ? channelKey.slice(1) : channelKey;
	return name === name.toLowerCase() && SLACK_CHANNEL_NAME_RE.test(name) && SLACK_CHANNEL_NAME_ALPHANUMERIC_RE.test(name);
}
function collectSlackNameKeyedChannelWarnings({ cfg }) {
	const warnings = /* @__PURE__ */ new Set();
	const slackCfg = asObjectRecord(asObjectRecord(cfg.channels)?.slack);
	const providerChannels = asObjectRecord(slackCfg?.channels);
	const accounts = asObjectRecord(slackCfg?.accounts);
	for (const accountId of listSlackAccountIds(cfg)) {
		const account = asObjectRecord(mergeSlackAccountConfig(cfg, accountId));
		if (!account || slackCfg?.enabled === false || account.enabled === false) continue;
		const effectiveGroupPolicy = (typeof account.groupPolicy === "string" ? account.groupPolicy : void 0) ?? "allowlist";
		const rawAccount = asObjectRecord(accounts?.[accountId]);
		const accountPrefix = rawAccount ? `channels.slack.accounts.${accountId}` : "channels.slack";
		const accountChannels = asObjectRecord(rawAccount?.channels);
		const channels = accountChannels ?? providerChannels;
		if (!channels) continue;
		const channelsPrefix = accountChannels ? `channels.slack.accounts.${accountId}` : "channels.slack";
		const fallbackDescription = Object.hasOwn(channels, "*") ? `${channelsPrefix}.channels."*" applies instead and this entry's overrides are ignored` : effectiveGroupPolicy === "open" ? "this entry's overrides are ignored and the channel remains allowed by groupPolicy: \"open\"" : "messages from the channel are dropped";
		for (const channelKey of Object.keys(channels)) {
			if (channelKey === "*") continue;
			if (looksLikeSlackDmId(channelKey)) {
				warnings.add(`${channelsPrefix}.channels."${channelKey}" is a Slack DM conversation ID, but ${channelsPrefix}.channels only configures channel and group rooms. Configure DM access with ${accountPrefix}.dmPolicy and ${accountPrefix}.allowFrom instead.`);
				continue;
			}
			if (SLACK_AMBIGUOUS_LOWERCASE_DM_ID_RE.test(channelKey)) {
				if (account.dangerouslyAllowNameMatching === true && looksLikeSlackChannelNameKey(channelKey)) continue;
				warnings.add(`${channelsPrefix}.channels."${channelKey}" is ambiguous: it may be a lowercase Slack DM conversation ID or a channel name. Configure DMs with ${accountPrefix}.dmPolicy and ${accountPrefix}.allowFrom; otherwise re-key the room with its stable C/G ID.`);
				continue;
			}
			if (effectiveGroupPolicy === "disabled") continue;
			const channelConfig = asObjectRecord(channels[channelKey]);
			if (effectiveGroupPolicy === "open" && Object.keys(channelConfig ?? {}).length === 0) continue;
			if (looksLikeSlackChannelId(channelKey)) continue;
			if (account.dangerouslyAllowNameMatching === true && looksLikeSlackChannelNameKey(channelKey)) continue;
			if (SLACK_AMBIGUOUS_LOWERCASE_CHANNEL_ID_RE.test(channelKey)) {
				warnings.add(`${channelsPrefix}.channels."${channelKey}" is ambiguous: it may be a lowercase Slack channel ID or a channel name. If it is a channel name, inbound routing will not match it and ${fallbackDescription}. Re-key it with the channel's stable ID (e.g. C0123ABCD, from the channel's About details or conversations.info).`);
				continue;
			}
			warnings.add(`${channelsPrefix}.channels."${channelKey}" is keyed by a channel name or non-canonical ID form, not a routable Slack channel ID; under groupPolicy: "${effectiveGroupPolicy}" inbound routing does not match this entry, so ${fallbackDescription}. Re-key it with the channel's ID (e.g. C0123ABCD, from the channel's About details or conversations.info).`);
		}
	}
	return [...warnings];
}
function slackAccountConfigPath(accountId) {
	return accountId === "default" ? "channels.slack" : `channels.slack.accounts.${accountId}`;
}
async function collectSlackUserIdentityWarnings(params) {
	const warnings = [];
	for (const accountId of listSlackAccountIds(params.cfg)) {
		const account = inspectSlackAccount({
			cfg: params.cfg,
			accountId,
			envBotToken: params.env?.SLACK_BOT_TOKEN,
			envAppToken: params.env?.SLACK_APP_TOKEN,
			envUserToken: params.env?.SLACK_USER_TOKEN
		});
		if (!account.enabled || account.identity !== "user") continue;
		const path = slackAccountConfigPath(accountId);
		const mode = account.mode ?? "socket";
		if (mode === "socket" && account.appTokenStatus === "missing") warnings.push(`- ${path}: identity "user" in Socket Mode requires appToken for companion-app events.`);
		else if (mode === "http" && account.signingSecretStatus === "missing") warnings.push(`- ${path}: identity "user" in HTTP mode requires signingSecret for companion-app events.`);
		if (!account.userToken) {
			warnings.push(account.userTokenStatus === "configured_unavailable" ? `- ${path}: userToken is configured but unavailable; Slack auth.test validation was skipped.` : `- ${path}: identity "user" requires userToken for the authorizing human.`);
			continue;
		}
		const probe = await probeSlack(account.userToken, 2500, {
			accountId,
			identity: "user"
		});
		if (!probe.ok) {
			warnings.push(`- ${path}: userToken auth.test failed: ${probe.error ?? "unknown error"}.`);
			continue;
		}
		const userId = probe.user?.id?.trim();
		const userName = probe.user?.name?.trim();
		if (!userId) {
			warnings.push(`- ${path}: userToken auth.test succeeded but returned no human user_id.`);
			continue;
		}
		warnings.push(`- ${path}: user identity authenticated as ${userName ? `@${userName} ` : ""}(${userId}).`);
	}
	return warnings;
}
const slackDoctor = {
	dmAllowFromMode: "topOnly",
	groupModel: "route",
	groupAllowFromFallbackToAllowFrom: false,
	warnOnEmptyGroupSenderAllowlist: false,
	legacyConfigRules,
	normalizeCompatibilityConfig,
	collectPreviewWarnings: async ({ cfg, env }) => await collectSlackUserIdentityWarnings({
		cfg,
		env
	}),
	collectMutableAllowlistWarnings: ({ cfg }) => [...collectSlackMutableAllowlistWarnings({ cfg }), ...collectSlackNameKeyedChannelWarnings({ cfg })]
};
//#endregion
//#region extensions/slack/src/shared.ts
const slackConfigAdapter = {
	...slackBaseConfigAdapter,
	inspectAccount: adaptScopedAccountAccessor(inspectSlackAccount)
};
function createSlackPluginBase(params) {
	return {
		...slackSetupPlugin,
		meta: {
			...getChatChannelMeta(slackSetupPlugin.id),
			preferSessionLookupForAnnounceTarget: true
		},
		setupWizard: params.setupWizard,
		setupContract: params.setupContract,
		doctor: slackDoctor,
		agentPrompt: {
			inboundFormattingHints: () => ({
				text_markup: "slack_mrkdwn",
				rules: [
					"Use Slack mrkdwn, not standard Markdown.",
					"Bold uses *single asterisks*.",
					"Links use <url|label>.",
					"Code blocks use triple backticks without a language identifier.",
					"Do not use markdown headings or pipe tables."
				]
			}),
			messageToolHints: () => [
				"- Use `presentation` buttons/selects for discrete choices or parameter picks instead of asking the user to type one.",
				"- For line, bar, area, or pie data, use a `presentation` chart block; Slack renders it as a native chart and retains a text data summary for accessibility.",
				"- For row-and-column data, use an explicit `presentation` table block; Slack renders it as a native table and retains a linear text summary for accessibility. Markdown pipe tables are not auto-promoted.",
				"- Slack plain text sends: write standard Markdown; OpenClaw converts it to Slack mrkdwn, including `**bold**`, headings, lists, and `[label](url)` links.",
				"- When mentioning Slack users, use the stable `<@USER_ID>` token from Slack context instead of plain `@name` text so Slack notifies and links the user.",
				"- Slack Block Kit or presentation text fields are sent as Slack mrkdwn directly; use `*bold*`, `_italic_`, `~strike~`, `<url|label>` links, and avoid Markdown headings or pipe tables there."
			]
		},
		security: slackSecurityAdapter,
		config: {
			...slackSetupPlugin.config,
			...slackConfigAdapter,
			isConfigured: (account) => isSlackPluginAccountConfigured(account),
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: isSlackPluginAccountConfigured(account),
				extra: {
					botTokenSource: account.botTokenSource,
					appTokenSource: account.appTokenSource
				}
			})
		},
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		}
	};
}
//#endregion
export { PAIRING_APPROVED_MESSAGE as a, DEFAULT_ACCOUNT_ID$1 as i, slackConfigAdapter as n, projectCredentialSnapshotFields as o, slackSecurityAdapter as r, resolveConfiguredFromRequiredCredentialStatuses as s, createSlackPluginBase as t };
