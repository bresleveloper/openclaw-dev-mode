import { isBlockedHostnameOrIp } from "openclaw/plugin-sdk/ssrf-runtime";
import { createAccountListHelpers, resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/account-helpers";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { DEFAULT_ACCOUNT_ID, createSetupInputPresenceValidator, createSetupTranslator, formatDocsLink, normalizeAccountId, patchScopedAccountConfig, prepareScopedSetupConfig } from "openclaw/plugin-sdk/setup";
import { normalizeOptionalString, normalizeStringifiedOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, normalizeAccountId as normalizeAccountId$1 } from "openclaw/plugin-sdk/account-resolution";
// extensions/tlon/src/targets.ts
const SHIP_RE = /^~?[a-z-]+$/i;
const NEST_RE = /^chat\/([^/]+)\/([^/]+)$/i;
const TLON_CLUB_ID_RE = /^0v(?:0|[1-9a-v][0-9a-v]{0,4}(?:\.[0-9a-v]{5})*)$/;
function normalizeShip(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return trimmed;
	return trimmed.startsWith("~") ? trimmed : `~${trimmed}`;
}
function parseChannelNest(raw) {
	const match = NEST_RE.exec(raw.trim());
	if (!match) return null;
	return {
		hostShip: normalizeShip(expectDefined(match[1], "channel host capture")),
		channelName: expectDefined(match[2], "channel name capture")
	};
}
function makeGroupTarget(parsed) {
	return {
		kind: "group",
		nest: `chat/${parsed.hostShip}/${parsed.channelName}`,
		hostShip: parsed.hostShip,
		channelName: parsed.channelName
	};
}
function parseTlonTarget(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return null;
	const withoutPrefix = trimmed.replace(/^tlon:/i, "");
	if (withoutPrefix.startsWith("club:")) {
		const clubId = withoutPrefix.slice(5);
		return TLON_CLUB_ID_RE.test(clubId) ? {
			kind: "club",
			clubId
		} : null;
	}
	const dmPrefix = withoutPrefix.match(/^dm[/:](.+)$/i);
	if (dmPrefix) return {
		kind: "dm",
		ship: normalizeShip(expectDefined(dmPrefix[1], "DM ship capture"))
	};
	const groupPrefix = withoutPrefix.match(/^(group|room)[/:](.+)$/i);
	if (groupPrefix) {
		const groupTarget = expectDefined(groupPrefix[2], "group target capture").trim();
		if (groupTarget.startsWith("chat/")) {
			const parsed = parseChannelNest(groupTarget);
			if (!parsed) return null;
			return makeGroupTarget(parsed);
		}
		const parts = groupTarget.split("/");
		if (parts.length === 2) return makeGroupTarget({
			hostShip: normalizeShip(expectDefined(parts[0], "two-part group host")),
			channelName: expectDefined(parts[1], "two-part group channel")
		});
		return null;
	}
	if (withoutPrefix.startsWith("chat/")) {
		const parsed = parseChannelNest(withoutPrefix);
		if (!parsed) return null;
		return makeGroupTarget(parsed);
	}
	if (SHIP_RE.test(withoutPrefix)) return {
		kind: "dm",
		ship: normalizeShip(withoutPrefix)
	};
	return null;
}
function resolveTlonOutboundTarget(to) {
	const parsed = parseTlonTarget(to ?? "");
	if (!parsed) return {
		ok: false,
		error: /* @__PURE__ */ new Error(`Invalid Tlon target. Use ${formatTargetHint()}`)
	};
	if (parsed.kind === "dm") return {
		ok: true,
		to: parsed.ship
	};
	if (parsed.kind === "club") return {
		ok: true,
		to: `club:${parsed.clubId}`
	};
	return {
		ok: true,
		to: parsed.nest
	};
}
function formatTargetHint() {
	return "dm/~sampel-palnet | ~sampel-palnet | club:0v1.abcde | chat/~host-ship/channel | group:~host-ship/channel";
}
// extensions/tlon/src/types.ts
function resolveTlonChannelConfig(cfg) {
	return cfg.channels?.tlon;
}
const { listAccountIds: listTlonAccountIds, resolveAccountConfig: resolveMergedNamedTlonAccountConfig } = createAccountListHelpers("tlon", {
	normalizeAccountId: normalizeAccountId$1,
	fallbackAccountIdWhenEmpty: false,
	hasImplicitDefaultAccount: (cfg) => Boolean(resolveTlonChannelConfig(cfg)?.ship)
});
function resolveMergedTlonAccountConfig(cfg, accountId) {
	const channel = resolveTlonChannelConfig(cfg);
	if (accountId === DEFAULT_ACCOUNT_ID$1) return channel ?? {};
	return resolveMergedNamedTlonAccountConfig(cfg, accountId);
}
function resolveTlonAccount(cfg, accountId) {
	const resolvedAccountId = normalizeAccountId$1(accountId);
	const base = resolveTlonChannelConfig(cfg);
	const merged = resolveMergedTlonAccountConfig(cfg, resolvedAccountId);
	const ship = merged.ship ?? null;
	const url = merged.url ?? null;
	const code = merged.code ?? null;
	return {
		accountId: resolvedAccountId,
		name: merged.name ?? null,
		enabled: Boolean(base) && merged.enabled !== false,
		configured: Boolean(ship && url && code),
		...base ? {
			requireMentionInBotThreads: merged.requireMentionInBotThreads,
			mediaMaxBytes: resolveChannelMediaMaxBytes({
				cfg,
				accountId: resolvedAccountId,
				resolveChannelLimitMb: () => merged.mediaMaxMb
			})
		} : {},
		ship,
		url,
		code,
		dangerouslyAllowPrivateNetwork: merged.network?.dangerouslyAllowPrivateNetwork ?? null,
		groupChannels: merged.groupChannels ?? [],
		dmAllowlist: merged.dmAllowlist ?? [],
		clubPolicy: merged.clubPolicy ?? null,
		clubRules: merged.clubRules ?? {},
		groupInviteAllowlist: merged.groupInviteAllowlist ?? [],
		autoDiscoverChannels: merged.autoDiscoverChannels ?? null,
		crossChannelCitations: merged.crossChannelCitations ?? null,
		showModelSignature: merged.showModelSignature ?? null,
		autoAcceptDmInvites: merged.autoAcceptDmInvites ?? null,
		autoAcceptGroupInvites: merged.autoAcceptGroupInvites ?? null,
		defaultAuthorizedShips: merged.defaultAuthorizedShips ?? [],
		ownerShip: merged.ownerShip ?? null
	};
}
// extensions/tlon/src/urbit/base-url.ts
function normalizeUrbitHostname(hostname) {
	return (hostname ?? "").trim().toLowerCase().replace(/\.$/, "");
}
function validateUrbitBaseUrl(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return {
		ok: false,
		error: "Required"
	};
	const candidate = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
	const parsed = URL.parse(candidate);
	if (!parsed) return {
		ok: false,
		error: "Invalid URL"
	};
	if (!["http:", "https:"].includes(parsed.protocol)) return {
		ok: false,
		error: "URL must use http:// or https://"
	};
	if (parsed.username || parsed.password) return {
		ok: false,
		error: "URL must not include credentials"
	};
	const hostname = normalizeUrbitHostname(parsed.hostname);
	if (!hostname) return {
		ok: false,
		error: "Invalid hostname"
	};
	parsed.hostname = hostname;
	return {
		ok: true,
		baseUrl: parsed.origin,
		hostname
	};
}
function isBlockedUrbitHostname(hostname) {
	const normalized = normalizeUrbitHostname(hostname);
	if (!normalized) return false;
	return isBlockedHostnameOrIp(normalized);
}
// extensions/tlon/src/setup-core.ts
const t = createSetupTranslator();
function createTlonSetupWizardBase(finalize) {
	return {
		channel: "tlon",
		status: {
			configuredLabel: t("wizard.channels.statusConfigured"),
			unconfiguredLabel: t("wizard.channels.statusNeedsSetup"),
			configuredHint: t("wizard.channels.statusConfigured"),
			unconfiguredHint: t("wizard.channels.statusUrbitMessenger"),
			configuredScore: 1,
			unconfiguredScore: 4,
			resolveConfigured: ({ cfg, accountId }) => resolveTlonSetupConfigured(cfg, accountId),
			resolveStatusLines: async ({ cfg, accountId }) => {
				const configured = await resolveTlonSetupConfigured(cfg, accountId);
				return [`${accountId && accountId !== DEFAULT_ACCOUNT_ID ? `Tlon (${accountId})` : "Tlon"}: ${configured ? "configured" : "needs setup"}`];
			}
		},
		introNote: {
			title: t("wizard.tlon.setupTitle"),
			lines: [
				t("wizard.tlon.helpNeedsUrlCode"),
				t("wizard.tlon.helpExampleUrl"),
				t("wizard.tlon.helpExampleShip"),
				t("wizard.tlon.helpPrivateNetwork"),
				`Docs: ${formatDocsLink("/channels/tlon", "channels/tlon")}`
			]
		},
		credentials: [],
		textInputs: [
			{
				inputKey: "ship",
				message: t("wizard.tlon.shipPrompt"),
				placeholder: "~sampel-palnet",
				currentValue: ({ cfg, accountId }) => resolveTlonAccount(cfg, accountId).ship ?? void 0,
				validate: ({ value }) => normalizeStringifiedOptionalString(value) ? void 0 : "Required",
				normalizeValue: ({ value }) => normalizeShip(normalizeStringifiedOptionalString(value) ?? ""),
				applySet: async ({ cfg, accountId, value }) => applyTlonSetupConfig({
					cfg,
					accountId,
					input: { ship: value }
				})
			},
			{
				inputKey: "url",
				message: t("wizard.tlon.shipUrlPrompt"),
				placeholder: "https://your-ship-host",
				currentValue: ({ cfg, accountId }) => resolveTlonAccount(cfg, accountId).url ?? void 0,
				validate: ({ value }) => {
					const next = validateUrbitBaseUrl(value ?? "");
					if (!next.ok) return next.error;
				},
				normalizeValue: ({ value }) => normalizeStringifiedOptionalString(value) ?? "",
				applySet: async ({ cfg, accountId, value }) => applyTlonSetupConfig({
					cfg,
					accountId,
					input: { url: value }
				})
			},
			{
				inputKey: "code",
				message: t("wizard.tlon.loginCodePrompt"),
				placeholder: "lidlut-tabwed-pillex-ridrup",
				sensitive: true,
				keepPrompt: t("wizard.tlon.loginCodeKeep"),
				currentValue: ({ cfg, accountId }) => resolveTlonAccount(cfg, accountId).code ?? void 0,
				validate: ({ value }) => normalizeStringifiedOptionalString(value) ? void 0 : "Required",
				normalizeValue: ({ value }) => normalizeStringifiedOptionalString(value) ?? "",
				applySet: async ({ cfg, accountId, value }) => applyTlonSetupConfig({
					cfg,
					accountId,
					input: { code: value }
				})
			}
		],
		finalize
	};
}
async function resolveTlonSetupConfigured(cfg, accountId) {
	if (accountId) return resolveTlonAccount(cfg, accountId).configured;
	const accountIds = listTlonAccountIds(cfg);
	return accountIds.length > 0 ? accountIds.some((resolvedAccountId) => resolveTlonAccount(cfg, resolvedAccountId).configured) : resolveTlonAccount(cfg, DEFAULT_ACCOUNT_ID).configured;
}
function applyTlonSetupConfig(params) {
	const { cfg, accountId, input } = params;
	const useDefault = accountId === DEFAULT_ACCOUNT_ID;
	const namedConfig = prepareScopedSetupConfig({
		cfg,
		channelKey: "tlon",
		accountId,
		name: input.name
	});
	const base = namedConfig.channels?.tlon ?? {};
	const payload = {
		...input.ship ? { ship: input.ship } : {},
		...input.url ? { url: input.url } : {},
		...input.code ? { code: input.code } : {},
		...input.dangerouslyAllowPrivateNetwork !== void 0 ? { network: { dangerouslyAllowPrivateNetwork: input.dangerouslyAllowPrivateNetwork } } : {},
		...input.groupChannels ? { groupChannels: input.groupChannels } : {},
		...input.dmAllowlist ? { dmAllowlist: input.dmAllowlist } : {},
		...input.autoDiscoverChannels !== void 0 ? { autoDiscoverChannels: input.autoDiscoverChannels } : {},
		...input.ownerShip ? { ownerShip: input.ownerShip } : {}
	};
	return patchScopedAccountConfig({
		cfg: namedConfig,
		channelKey: "tlon",
		accountId,
		patch: useDefault ? {
			enabled: true,
			...payload
		} : { enabled: base.enabled ?? true },
		accountPatch: {
			enabled: true,
			...payload
		},
		ensureChannelEnabled: false,
		ensureAccountEnabled: false
	});
}
const tlonSetupAdapter = {
	singleAccountKeysToMove: ["url", "code"],
	resolveAccountId: ({ accountId }) => normalizeAccountId(accountId),
	prepareAccountConfigInput: ({ input }) => {
		const setupInput = input;
		const url = normalizeOptionalString(setupInput.url);
		if (!url) return setupInput;
		const validatedUrl = validateUrbitBaseUrl(url);
		return validatedUrl.ok ? {
			...setupInput,
			url: validatedUrl.baseUrl
		} : setupInput;
	},
	applyAccountName: ({ cfg, accountId, name }) => prepareScopedSetupConfig({
		cfg,
		channelKey: "tlon",
		accountId,
		name
	}),
	validateInput: createSetupInputPresenceValidator({ validate: ({ cfg, accountId, input }) => {
		const setupInput = input;
		const resolved = resolveTlonAccount(cfg, accountId);
		const ship = normalizeOptionalString(setupInput.ship ?? resolved.ship);
		const url = normalizeOptionalString(setupInput.url ?? resolved.url);
		const code = normalizeOptionalString(setupInput.code ?? resolved.code);
		if (!ship) return "Tlon requires --ship.";
		if (!url) return "Tlon requires --url.";
		const validatedUrl = validateUrbitBaseUrl(url);
		if (!validatedUrl.ok) return `Invalid URL: ${validatedUrl.error}`;
		if (!code) return "Tlon requires --code.";
		return null;
	} }),
	applyAccountConfig: ({ cfg, accountId, input }) => applyTlonSetupConfig({
		cfg,
		accountId,
		input
	})
};
const tlonSetupContract = defineChannelSetupContract({
	fields: {
		ship: {
			kind: "string",
			cli: {
				flags: "--ship <ship>",
				description: "Tlon ship"
			}
		},
		url: {
			kind: "string",
			cli: {
				flags: "--url <url>",
				description: "Tlon URL"
			}
		},
		code: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--code <code>",
				description: "Tlon login code"
			}
		},
		dangerouslyAllowPrivateNetwork: {
			kind: "boolean",
			cli: {
				flags: "--dangerously-allow-private-network",
				description: "Allow private-network Tlon URLs"
			}
		},
		groupChannels: {
			kind: "string-list",
			cli: {
				flags: "--group-channels <list>",
				description: "Tlon group channels"
			}
		},
		dmAllowlist: {
			kind: "string-list",
			cli: {
				flags: "--dm-allowlist <list>",
				description: "Tlon DM allowlist"
			}
		},
		autoDiscoverChannels: {
			kind: "boolean",
			cli: {
				flags: "--auto-discover-channels",
				negatedFlags: "--no-auto-discover-channels",
				description: "Auto-discover Tlon group channels"
			}
		},
		ownerShip: {
			kind: "string",
			cli: {
				flags: "--owner-ship <ship>",
				description: "Tlon owner ship"
			}
		}
	},
	legacyAdapter: tlonSetupAdapter
});
export { isBlockedUrbitHostname as a, resolveTlonAccount as c, normalizeShip as d, parseChannelNest as f, tlonSetupContract as i, TLON_CLUB_ID_RE as l, resolveTlonOutboundTarget as m, createTlonSetupWizardBase as n, validateUrbitBaseUrl as o, parseTlonTarget as p, tlonSetupAdapter as r, listTlonAccountIds as s, applyTlonSetupConfig as t, formatTargetHint as u };
