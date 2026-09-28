import { a as resolveWhatsAppAccount, n as hasAnyWhatsAppAuth } from "./accounts-D_NGDjCx.mjs";
import { r as resolveDefaultWhatsAppAccountId, t as listAccountIds } from "./account-ids-CB5SOWjc.mjs";
import { a as normalizeWhatsAppAllowFromEntries } from "./normalize-target-BGra1ZnM.mjs";
import { t as WhatsAppChannelConfigSchema } from "./config-schema-BYA6e_Ii.mjs";
import { n as whatsappDoctor } from "./doctor-BPb-SjdE.mjs";
import { t as resolveWhatsAppConfigPath } from "./group-config-path-BGyzT9Lg.mjs";
import { t as resolveLegacyGroupSessionKey } from "./group-session-contract-DDnZSsJ1.mjs";
import { n as unsupportedSecretRefSurfacePatterns, t as collectUnsupportedSecretRefConfigCandidates } from "./security-contract-nAzD945y.mjs";
import { n as deriveLegacySessionChatType, r as isLegacyGroupSessionKey, t as canonicalizeLegacySessionKey } from "./session-contract-DMTm6Q_L.mjs";
import { normalizeUniqueStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeE164 } from "openclaw/plugin-sdk/account-resolution";
import { createChannelPluginBase } from "openclaw/plugin-sdk/core";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { adaptScopedAccountAccessor, createScopedChannelConfigAdapter, createScopedDmSecurityResolver } from "openclaw/plugin-sdk/channel-config-helpers";
import { buildChannelGroupsScopeTree, collectOpenGroupPolicyRouteAllowlistWarnings, createAllowlistProviderGroupPolicyWarningCollector, createConditionalWarningCollector, resolveScopeRequireMention, resolveScopeToolsPolicy } from "openclaw/plugin-sdk/channel-policy";
import { createDelegatedSetupWizardProxy, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup-runtime";
import { readChannelAllowFromStore } from "openclaw/plugin-sdk/channel-pairing";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { createPatchedAccountSetupAdapter } from "openclaw/plugin-sdk/setup";
//#region extensions/whatsapp/src/channel-runtime-loader.ts
const loadWhatsAppAuthStore = createLazyRuntimeModule(() => import("./auth-store-Dh8a3cba.mjs").then((n) => n.i));
async function readWhatsAppAccountLinkState(authDir) {
	const state = await (await loadWhatsAppAuthStore()).readWebAuthState(authDir);
	return state === "unstable" ? "unknown" : state;
}
const loadWhatsAppChannelRuntime = createLazyRuntimeModule(async () => {
	await loadWhatsAppAuthStore();
	return await import("./channel.runtime-oj3Imjae.mjs");
});
//#endregion
//#region extensions/whatsapp/src/config-accessors.ts
function formatWhatsAppConfigAllowFromEntries(allowFrom) {
	return normalizeWhatsAppAllowFromEntries(allowFrom);
}
//#endregion
//#region extensions/whatsapp/src/group-policy.ts
function resolveScopePath(params) {
	return params.groupId ? [params.groupId] : [];
}
function resolveWhatsAppGroupRequireMention(params) {
	return resolveScopeRequireMention({
		tree: buildChannelGroupsScopeTree(params.cfg, "whatsapp", params.accountId),
		path: resolveScopePath(params)
	});
}
function resolveWhatsAppGroupToolPolicy(params) {
	return resolveScopeToolsPolicy({
		...params,
		tree: buildChannelGroupsScopeTree(params.cfg, "whatsapp", params.accountId),
		path: resolveScopePath(params),
		messageProvider: "whatsapp"
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
		if (holder.groupPolicy !== "open") return;
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
	const fromStore = await readChannelAllowFromStore("whatsapp", params.env, DEFAULT_ACCOUNT_ID).catch(() => []);
	const normalized = normalizeUniqueStringEntries(fromStore);
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
const whatsappSetupAdapter = {
	...createPatchedAccountSetupAdapter({
		channelKey: "whatsapp",
		alwaysUseAccounts: true,
		buildPatch: (input) => input.authDir ? { authDir: input.authDir } : {}
	}),
	singleAccountKeysToMove: ["authDir"]
};
const whatsappSetupContract = defineChannelSetupContract({
	fields: { authDir: {
		kind: "string",
		cli: {
			flags: "--auth-dir <path>",
			description: "WhatsApp auth directory override"
		}
	} },
	legacyAdapter: whatsappSetupAdapter
});
//#endregion
//#region extensions/whatsapp/src/shared.ts
const WHATSAPP_CHANNEL = "whatsapp";
async function loadWhatsAppSetupSurface() {
	return await import("./setup-surface-Bvwd4FVQ.mjs");
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
		disable: (cfg) => setSetupChannelEnabled(cfg, WHATSAPP_CHANNEL, false),
		onAccountRecorded: (accountId, options) => {
			options?.onAccountId?.(WHATSAPP_CHANNEL, accountId);
		}
	});
}
function createWhatsAppPluginBase() {
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
	const collectWhatsAppOpenGroupFindings = createConditionalWarningCollector.findings({
		collectWarnings: collectWhatsAppSecurityWarnings,
		checkId: "channels.whatsapp.groups.open",
		severity: "warn",
		title: "WhatsApp security warning"
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
			exposure: { configured: false },
			quickstartAllowFrom: true,
			forceAccountBinding: true,
			preferSessionLookupForAnnounceTarget: true
		},
		setupWizard: whatsappSetupWizardProxy,
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
				"channels.whatsapp.enabled",
				"channels.whatsapp.accounts",
				"channels.whatsapp.selfChatMode"
			],
			noopPrefixes: [
				"channels.whatsapp",
				"messages.inbound",
				"messages.ackReactionScope"
			]
		},
		gatewayMethodDescriptors: [{ name: "web.login.start" }, { name: "web.login.wait" }],
		configSchema: WhatsAppChannelConfigSchema,
		config: {
			...whatsappConfigAdapter,
			isEnabled: (account) => account.enabled,
			disabledReason: () => "disabled",
			isConfigured: (account) => Boolean(account.authDir),
			isLinked: async (account) => await readWhatsAppAccountLinkState(account.authDir),
			hasPersistedAuthState: ({ cfg }) => hasAnyWhatsAppAuth(cfg),
			unconfiguredReason: () => "not configured",
			unlinkedReason: () => "not linked",
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: Boolean(account.authDir),
				extra: {
					dmPolicy: account.dmPolicy,
					allowFrom: account.allowFrom
				}
			})
		},
		security: {
			applyConfigFixes: applyWhatsAppSecurityConfigFixes,
			resolveDmPolicy: whatsappResolveDmPolicy,
			collectWarnings: collectWhatsAppOpenGroupFindings
		},
		doctor: whatsappDoctor,
		setupContract: whatsappSetupContract,
		groups: {
			resolveRequireMention: resolveWhatsAppGroupRequireMention,
			resolveToolPolicy: resolveWhatsAppGroupToolPolicy
		}
	});
	return {
		...base,
		capabilities: base.capabilities,
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
		}
	};
}
//#endregion
export { formatWhatsAppConfigAllowFromEntries as a, resolveWhatsAppGroupToolPolicy as i, whatsappSetupAdapter as n, loadWhatsAppChannelRuntime as o, resolveWhatsAppGroupRequireMention as r, createWhatsAppPluginBase as t };
