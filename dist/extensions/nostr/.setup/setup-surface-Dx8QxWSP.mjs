import { a as parseRelayUrls, c as validatePrivateKey, i as createNostrSetupStatus, l as DEFAULT_RELAYS, n as createNostrSetupAdapter, o as hasConfiguredNostrPrivateKey, r as createNostrSetupContract, s as resolveNostrPrivateKey, t as buildNostrSetupPatch } from "./setup-adapter-KJ_iGKiG.mjs";
import { createAccountListHelpers } from "openclaw/plugin-sdk/account-helpers";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { hasConfiguredSecretInput, normalizeSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { decode } from "nostr-tools/nip19";
import { getPublicKey } from "nostr-tools/pure";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId, normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-id";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1 } from "openclaw/plugin-sdk/routing";
import { createSetupTranslator, createTopLevelChannelDmPolicy, createTopLevelChannelParsedAllowFromPrompt, defineTokenCredential, formatDocsLink, mergeAllowFromEntries, parseSetupEntriesWithParser, patchTopLevelChannelConfigSection, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region extensions/nostr/src/nostr-key-utils.ts
function getPublicKeyFromPrivate(privateKey) {
	return getPublicKey(validatePrivateKey(privateKey));
}
function normalizePubkey(input) {
	const trimmed = input.trim();
	if (trimmed.startsWith("npub1") || trimmed.startsWith("NPUB1")) {
		const decoded = decode(trimmed);
		if (decoded.type !== "npub" || typeof decoded.data !== "string") throw new Error("Invalid npub key");
		return decoded.data.toLowerCase();
	}
	if (!/^[0-9a-fA-F]{64}$/.test(trimmed)) throw new Error("Pubkey must be 64 hex characters or npub format");
	return trimmed.toLowerCase();
}
//#endregion
//#region extensions/nostr/src/types.ts
const { listAccountIds: listNostrAccountIds, resolveDefaultAccountId: resolveDefaultNostrAccountId } = createAccountListHelpers("nostr", {
	fallbackAccountIdWhenEmpty: false,
	resolveImplicitAccountId: (cfg) => {
		const account = cfg.channels?.nostr;
		return hasConfiguredNostrPrivateKey(account?.privateKey) ? normalizeOptionalAccountId(account?.defaultAccount) ?? DEFAULT_ACCOUNT_ID : void 0;
	}
});
/**
* Resolve a Nostr account from config
*/
function resolveNostrAccount(opts) {
	const accountId = normalizeAccountId(opts.accountId ?? resolveDefaultNostrAccountId(opts.cfg));
	const nostrCfg = opts.cfg.channels?.nostr;
	const baseEnabled = nostrCfg?.enabled !== false;
	const privateKey = resolveNostrPrivateKey(nostrCfg?.privateKey);
	const configured = hasConfiguredNostrPrivateKey(nostrCfg?.privateKey);
	let publicKey = "";
	if (privateKey) try {
		publicKey = getPublicKeyFromPrivate(privateKey);
	} catch {}
	return {
		accountId,
		name: normalizeOptionalString(nostrCfg?.name),
		enabled: baseEnabled,
		configured,
		privateKey,
		publicKey,
		relays: nostrCfg?.relays ?? DEFAULT_RELAYS,
		profile: nostrCfg?.profile,
		config: {
			enabled: nostrCfg?.enabled,
			name: nostrCfg?.name,
			privateKey: nostrCfg?.privateKey,
			relays: nostrCfg?.relays,
			dmPolicy: nostrCfg?.dmPolicy,
			allowFrom: nostrCfg?.allowFrom,
			profile: nostrCfg?.profile
		}
	};
}
//#endregion
//#region extensions/nostr/src/setup-surface.ts
var setup_surface_exports = /* @__PURE__ */ __exportAll({
	nostrSetupAdapter: () => nostrSetupAdapter,
	nostrSetupContract: () => nostrSetupContract,
	nostrSetupWizard: () => nostrSetupWizard
});
const t = createSetupTranslator();
const channel = "nostr";
const NOSTR_SETUP_HELP_LINES = [
	t("wizard.nostr.helpPrivateKeyFormat"),
	t("wizard.nostr.helpRelaysOptional"),
	t("wizard.nostr.helpEnvVars"),
	`Docs: ${formatDocsLink("/channels/nostr", "channels/nostr")}`
];
const NOSTR_ALLOW_FROM_HELP_LINES = [
	t("wizard.nostr.allowlistIntro"),
	t("wizard.nostr.examples"),
	"- npub1...",
	"- nostr:npub1...",
	"- 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
	t("wizard.nostr.multipleEntries"),
	`Docs: ${formatDocsLink("/channels/nostr", "channels/nostr")}`
];
function parseNostrAllowFrom(raw) {
	return parseSetupEntriesWithParser(raw, (entry) => {
		const cleaned = entry.replace(/^nostr:/i, "").trim();
		try {
			return { value: normalizePubkey(cleaned) };
		} catch {
			return { error: `Invalid Nostr pubkey: ${entry}` };
		}
	});
}
const promptNostrAllowFrom = createTopLevelChannelParsedAllowFromPrompt({
	channel,
	defaultAccountId: resolveDefaultNostrAccountId,
	noteTitle: t("wizard.nostr.allowlistTitle"),
	noteLines: NOSTR_ALLOW_FROM_HELP_LINES,
	message: t("wizard.nostr.allowFromPrompt"),
	placeholder: "npub1..., 0123abcd...",
	parseEntries: parseNostrAllowFrom,
	mergeEntries: ({ existing, parsed }) => mergeAllowFromEntries(existing, parsed)
});
const nostrDmPolicy = createTopLevelChannelDmPolicy({
	label: "Nostr",
	channel,
	policyKey: "channels.nostr.dmPolicy",
	allowFromKey: "channels.nostr.allowFrom",
	getCurrent: (cfg) => cfg.channels?.nostr?.dmPolicy ?? "pairing",
	promptAllowFrom: promptNostrAllowFrom
});
const nostrSetupAdapter = createNostrSetupAdapter({ resolveAccountId: (cfg, accountId) => accountId?.trim() || resolveDefaultNostrAccountId(cfg) });
const nostrSetupContract = createNostrSetupContract(nostrSetupAdapter);
const nostrSetupWizard = {
	channel,
	resolveAccountIdForConfigure: ({ accountOverride, defaultAccountId }) => accountOverride?.trim() || defaultAccountId,
	resolveShouldPromptAccountIds: () => false,
	status: createNostrSetupStatus(resolveNostrAccount),
	introNote: {
		title: t("wizard.nostr.setupTitle"),
		lines: NOSTR_SETUP_HELP_LINES
	},
	envShortcut: {
		prompt: t("wizard.nostr.privateKeyEnvPrompt"),
		preferredEnvVar: "NOSTR_PRIVATE_KEY",
		isAvailable: ({ cfg, accountId }) => accountId === DEFAULT_ACCOUNT_ID$1 && Boolean(process.env.NOSTR_PRIVATE_KEY?.trim()) && !hasConfiguredSecretInput(resolveNostrAccount({
			cfg,
			accountId
		}).config.privateKey),
		apply: async ({ cfg, accountId }) => patchTopLevelChannelConfigSection({
			cfg,
			channel,
			enabled: true,
			clearFields: ["privateKey"],
			patch: buildNostrSetupPatch(accountId, {})
		})
	},
	credentials: [defineTokenCredential({
		inputKey: "privateKey",
		configKey: "privateKey",
		providerHint: channel,
		credentialLabel: "private key",
		preferredEnvVar: "NOSTR_PRIVATE_KEY",
		helpTitle: t("wizard.nostr.privateKeyTitle"),
		helpLines: NOSTR_SETUP_HELP_LINES,
		envPrompt: t("wizard.nostr.privateKeyEnvPrompt"),
		keepPrompt: t("wizard.nostr.privateKeyKeep"),
		inputPrompt: t("wizard.nostr.privateKeyInput"),
		allowEnv: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID$1,
		resolveAccount: ({ cfg, accountId }) => resolveNostrAccount({
			cfg,
			accountId
		}),
		accountConfigured: (account) => account.configured,
		resolvedValue: (account) => normalizeSecretInputString(account.config.privateKey),
		envValue: () => process.env.NOSTR_PRIVATE_KEY?.trim(),
		patchAccount: ({ cfg, accountId, patch, clearFields }) => patchTopLevelChannelConfigSection({
			cfg,
			channel,
			enabled: true,
			clearFields,
			patch: buildNostrSetupPatch(accountId, patch)
		}),
		useEnv: { clearFields: ["privateKey"] },
		set: { value: "resolved" }
	})],
	textInputs: [{
		inputKey: "relayUrls",
		message: t("wizard.nostr.relayUrlsPrompt"),
		placeholder: DEFAULT_RELAYS.join(", "),
		required: false,
		applyEmptyValue: true,
		helpTitle: t("wizard.nostr.relaysTitle"),
		helpLines: [t("wizard.nostr.relaysWsOnly"), t("wizard.nostr.helpRelaysOptional")],
		currentValue: ({ cfg, accountId }) => {
			const account = resolveNostrAccount({
				cfg,
				accountId
			});
			const configuredRelays = cfg.channels?.nostr?.relays;
			return (configuredRelays && configuredRelays.length > 0 ? account.relays : []).join(", ");
		},
		keepPrompt: (value) => t("wizard.nostr.relayUrlsKeep", { value }),
		validate: ({ value }) => parseRelayUrls(value).error,
		applySet: async ({ cfg, accountId, value }) => {
			const relayResult = parseRelayUrls(value);
			return patchTopLevelChannelConfigSection({
				cfg,
				channel,
				enabled: true,
				clearFields: relayResult.relays.length > 0 ? void 0 : ["relays"],
				patch: buildNostrSetupPatch(accountId, relayResult.relays.length > 0 ? { relays: relayResult.relays } : {})
			});
		}
	}],
	dmPolicy: nostrDmPolicy,
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
//#endregion
export { listNostrAccountIds as a, normalizePubkey as c, setup_surface_exports as i, nostrSetupContract as n, resolveDefaultNostrAccountId as o, nostrSetupWizard as r, resolveNostrAccount as s, nostrSetupAdapter as t };
