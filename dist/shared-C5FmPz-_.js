import { p as normalizeUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
import { l as normalizeE164 } from "./utils-BApvfmPs.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-5IgE9UKY.js";
import { n as resolveChannelGroupRequireMention, r as resolveChannelGroupToolsPolicy } from "./group-policy-BM2LYNY0.js";
import { l as createScopedDmSecurityResolver, s as createScopedChannelConfigAdapter, t as adaptScopedAccountAccessor } from "./channel-config-helpers-CMg35hQR.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { n as describeAccountSnapshot } from "./account-helpers-DihevCTm.js";
import { r as createChannelPluginBase } from "./core-DINDVkoE.js";
import { a as readChannelAllowFromStore } from "./pairing-store-uQh6I0SL.js";
import { f as collectOpenGroupPolicyRouteAllowlistWarnings, g as createAllowlistProviderGroupPolicyWarningCollector } from "./channel-policy-VIimbh8Q.js";
import { a as createDelegatedSetupWizardProxy } from "./setup-wizard-proxy-C-yuqPz5.js";
import "./setup-runtime-QrlA0RGh.js";
import "./account-resolution-DTzMrP_G.js";
import "./channel-pairing-BhZI8NmU.js";
import { r as resolveDefaultWhatsAppAccountId, t as listAccountIds } from "./account-ids-Bgg1wvIw.js";
import { a as resolveWhatsAppAccount, n as hasAnyWhatsAppAuth } from "./accounts-D4l-iMIF.js";
import { a as normalizeWhatsAppAllowFromEntries } from "./normalize-target-D-WjuB2k.js";
import { t as WhatsAppChannelConfigSchema } from "./config-schema-BKRyYaD4.js";
import { n as whatsappDoctor } from "./doctor-By3SB4lm.js";
import { t as resolveWhatsAppConfigPath } from "./group-config-path-Bjw5mSIu.js";
import { t as resolveLegacyGroupSessionKey } from "./group-session-contract-CIN88htq.js";
import { n as unsupportedSecretRefSurfacePatterns, t as collectUnsupportedSecretRefConfigCandidates } from "./security-contract-C14RkxM8.js";
import { n as deriveLegacySessionChatType, r as isLegacyGroupSessionKey, t as canonicalizeLegacySessionKey } from "./session-contract-BCuaoNn0.js";
//#region extensions/whatsapp/src/config-accessors.ts
function formatWhatsAppConfigAllowFromEntries(allowFrom) {
	return normalizeWhatsAppAllowFromEntries(allowFrom);
}
//#endregion
//#region extensions/whatsapp/src/group-intro.ts
const WHATSAPP_GROUP_INTRO_HINT = "WhatsApp IDs: SenderId is the participant JID (group participant id).";
function resolveWhatsAppGroupIntroHint() {
	return WHATSAPP_GROUP_INTRO_HINT;
}
function resolveWhatsAppMentionStripRegexes(ctx) {
	const selfE164 = (ctx.To ?? "").replace(/^whatsapp:/i, "");
	if (!selfE164) return [];
	const escaped = selfE164.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return [new RegExp(escaped, "g"), new RegExp(`@${escaped}`, "g")];
}
//#endregion
//#region extensions/whatsapp/src/group-policy.ts
function resolveWhatsAppGroupRequireMention(params) {
	return resolveChannelGroupRequireMention({
		cfg: params.cfg,
		channel: "whatsapp",
		groupId: params.groupId,
		accountId: params.accountId
	});
}
function resolveWhatsAppGroupToolPolicy(params) {
	return resolveChannelGroupToolsPolicy({
		cfg: params.cfg,
		channel: "whatsapp",
		groupId: params.groupId,
		accountId: params.accountId,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	});
}
//#endregion
//#region extensions/whatsapp/src/security-fix.ts
function applyGroupAllowFromFromStore(params) {
	const next = structuredClone(params.cfg ?? {});
	const section = next.channels?.whatsapp;
	if (!section || typeof section !== "object" || params.storeAllowFrom.length === 0) return params.cfg;
	let changed = false;
	const maybeApply = (prefix, holder) => {
		if (holder.groupPolicy !== "allowlist") return;
		const allowFrom = Array.isArray(holder.allowFrom) ? holder.allowFrom : [];
		const groupAllowFrom = Array.isArray(holder.groupAllowFrom) ? holder.groupAllowFrom : [];
		if (allowFrom.length > 0 || groupAllowFrom.length > 0) return;
		holder.groupAllowFrom = params.storeAllowFrom;
		params.changes.push(`${prefix}groupAllowFrom=pairing-store`);
		changed = true;
	};
	maybeApply("channels.whatsapp.", section);
	const accounts = section.accounts;
	if (accounts && typeof accounts === "object") for (const [accountId, accountValue] of Object.entries(accounts)) {
		if (!accountValue || typeof accountValue !== "object") continue;
		maybeApply(`channels.whatsapp.accounts.${accountId}.`, accountValue);
	}
	return changed ? next : params.cfg;
}
async function applyWhatsAppSecurityConfigFixes(params) {
	const normalized = normalizeUniqueStringEntries(await readChannelAllowFromStore("whatsapp", params.env, DEFAULT_ACCOUNT_ID).catch(() => []));
	if (normalized.length === 0) return {
		config: params.cfg,
		changes: []
	};
	const changes = [];
	return {
		config: applyGroupAllowFromFromStore({
			cfg: params.cfg,
			storeAllowFrom: normalized,
			changes
		}),
		changes
	};
}
//#endregion
//#region extensions/whatsapp/src/shared.ts
const WHATSAPP_CHANNEL = "whatsapp";
async function loadWhatsAppChannelRuntime() {
	return await import("./channel.runtime-BNuzRLnR.js");
}
async function loadWhatsAppSetupSurface() {
	return await import("./setup-surface-0I5SNNyo.js");
}
const whatsappSetupWizardProxy = createWhatsAppSetupWizardProxy(async () => (await loadWhatsAppSetupSurface()).whatsappSetupWizard);
const whatsappConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: WHATSAPP_CHANNEL,
	listAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveWhatsAppAccount),
	defaultAccountId: resolveDefaultWhatsAppAccountId,
	clearBaseFields: [],
	allowTopLevel: false,
	resolveAllowFrom: (account) => account.allowFrom,
	formatAllowFrom: (allowFrom) => formatWhatsAppConfigAllowFromEntries(allowFrom),
	resolveDefaultTo: (account) => account.defaultTo
});
const whatsappResolveDmPolicy = createScopedDmSecurityResolver({
	channelKey: WHATSAPP_CHANNEL,
	resolvePolicy: (account) => account.dmPolicy,
	resolveAllowFrom: (account) => account.allowFrom,
	policyPathSuffix: "dmPolicy",
	normalizeEntry: (raw) => normalizeE164(raw),
	inheritSharedDefaultsFromDefaultAccount: true
});
function createWhatsAppSetupWizardProxy(loadWizard) {
	return createDelegatedSetupWizardProxy({
		channel: WHATSAPP_CHANNEL,
		loadWizard,
		status: {
			configuredLabel: "linked",
			unconfiguredLabel: "not linked",
			configuredHint: "linked",
			unconfiguredHint: "not linked",
			configuredScore: 5,
			unconfiguredScore: 4
		},
		resolveShouldPromptAccountIds: (params) => params.shouldPromptAccountIds,
		credentials: [],
		delegateFinalize: true,
		disable: (cfg) => ({
			...cfg,
			channels: {
				...cfg.channels,
				whatsapp: {
					...cfg.channels?.whatsapp,
					enabled: false
				}
			}
		}),
		onAccountRecorded: (accountId, options) => {
			options?.onAccountId?.(WHATSAPP_CHANNEL, accountId);
		}
	});
}
function createWhatsAppPluginBase(params) {
	const collectWhatsAppSecurityWarnings = createAllowlistProviderGroupPolicyWarningCollector({
		providerConfigPresent: (cfg) => cfg.channels?.whatsapp !== void 0,
		resolveGroupPolicy: ({ account }) => account.groupPolicy,
		collect: ({ account, accountId, cfg, groupPolicy }) => collectOpenGroupPolicyRouteAllowlistWarnings({
			groupPolicy,
			routeAllowlistConfigured: Boolean(account.groups) && Object.keys(account.groups ?? {}).length > 0,
			restrictSenders: {
				surface: "WhatsApp groups",
				openScope: "any member in allowed groups",
				groupPolicyPath: resolveWhatsAppConfigPath({
					cfg,
					accountId,
					field: "groupPolicy"
				}),
				groupAllowFromPath: resolveWhatsAppConfigPath({
					cfg,
					accountId,
					field: "groupAllowFrom"
				})
			},
			noRouteAllowlist: {
				surface: "WhatsApp groups",
				routeAllowlistPath: resolveWhatsAppConfigPath({
					cfg,
					accountId,
					field: "groups"
				}),
				routeScope: "group",
				groupPolicyPath: resolveWhatsAppConfigPath({
					cfg,
					accountId,
					field: "groupPolicy"
				}),
				groupAllowFromPath: resolveWhatsAppConfigPath({
					cfg,
					accountId,
					field: "groupAllowFrom"
				})
			}
		})
	});
	const base = createChannelPluginBase({
		id: WHATSAPP_CHANNEL,
		meta: {
			label: "WhatsApp",
			selectionLabel: "WhatsApp (QR link)",
			detailLabel: "WhatsApp Web",
			docsPath: "/channels/whatsapp",
			docsLabel: "whatsapp",
			blurb: "works with your own number; recommend a separate phone + eSIM.",
			systemImage: "message",
			showConfigured: false,
			quickstartAllowFrom: true,
			forceAccountBinding: true,
			preferSessionLookupForAnnounceTarget: true
		},
		setupWizard: params.setupWizard,
		capabilities: {
			chatTypes: [
				"direct",
				"group",
				"channel"
			],
			polls: true,
			reactions: true,
			media: true,
			tts: { voice: {
				synthesisTarget: "voice-note",
				transcodesAudio: true
			} }
		},
		reload: {
			configPrefixes: [
				"web",
				"channels.whatsapp.accounts",
				"channels.whatsapp.selfChatMode"
			],
			noopPrefixes: ["channels.whatsapp"]
		},
		gatewayMethodDescriptors: [{ name: "web.login.start" }, { name: "web.login.wait" }],
		configSchema: WhatsAppChannelConfigSchema,
		config: {
			...whatsappConfigAdapter,
			isEnabled: (account, cfg) => account.enabled && cfg.web?.enabled !== false,
			disabledReason: () => "disabled",
			isConfigured: params.isConfigured,
			hasPersistedAuthState: ({ cfg }) => hasAnyWhatsAppAuth(cfg),
			unconfiguredReason: () => "not linked",
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: Boolean(account.authDir),
				extra: {
					linked: Boolean(account.authDir),
					dmPolicy: account.dmPolicy,
					allowFrom: account.allowFrom
				}
			})
		},
		security: {
			applyConfigFixes: applyWhatsAppSecurityConfigFixes,
			resolveDmPolicy: whatsappResolveDmPolicy,
			collectWarnings: collectWhatsAppSecurityWarnings
		},
		doctor: whatsappDoctor,
		setup: params.setup,
		groups: params.groups
	});
	return {
		...base,
		setupWizard: base.setupWizard,
		capabilities: base.capabilities,
		reload: base.reload,
		gatewayMethodDescriptors: base.gatewayMethodDescriptors,
		configSchema: base.configSchema,
		config: base.config,
		messaging: {
			defaultMarkdownTableMode: "bullets",
			deriveLegacySessionChatType,
			resolveLegacyGroupSessionKey,
			isLegacyGroupSessionKey,
			canonicalizeLegacySessionKey: (paramsLocal) => canonicalizeLegacySessionKey({
				key: paramsLocal.key,
				agentId: paramsLocal.agentId
			})
		},
		secrets: {
			unsupportedSecretRefSurfacePatterns,
			collectUnsupportedSecretRefConfigCandidates
		},
		security: base.security,
		groups: base.groups
	};
}
//#endregion
export { resolveWhatsAppGroupToolPolicy as a, formatWhatsAppConfigAllowFromEntries as c, resolveWhatsAppGroupRequireMention as i, loadWhatsAppChannelRuntime as n, resolveWhatsAppGroupIntroHint as o, whatsappSetupWizardProxy as r, resolveWhatsAppMentionStripRegexes as s, createWhatsAppPluginBase as t };
