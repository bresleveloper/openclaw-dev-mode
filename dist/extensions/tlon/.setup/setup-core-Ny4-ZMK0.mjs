import { hasLegacyFlatAllowPrivateNetworkAlias, isBlockedHostnameOrIp, isPrivateNetworkOptInEnabled } from "openclaw/plugin-sdk/ssrf-runtime";
import { createAccountListHelpers, resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/account-helpers";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { DEFAULT_ACCOUNT_ID, createSetupInputPresenceValidator, createSetupTranslator, formatDocsLink, normalizeAccountId, patchScopedAccountConfig, prepareScopedSetupConfig } from "openclaw/plugin-sdk/setup";
import { normalizeOptionalString, normalizeStringifiedOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, normalizeAccountId as normalizeAccountId$1 } from "openclaw/plugin-sdk/account-resolution";
//#region extensions/tlon/src/targets.ts
const SHIP_RE = /^~?[a-z-]+$/i;
const NEST_RE = /^chat\/([^/]+)\/([^/]+)$/i;
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
		if (parts.length === 2) {
			const hostShip = normalizeShip(expectDefined(parts[0], "two-part group host"));
			const channelName = expectDefined(parts[1], "two-part group channel");
			return {
				kind: "group",
				nest: `chat/${hostShip}/${channelName}`,
				hostShip,
				channelName
			};
		}
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
	return {
		ok: true,
		to: parsed.nest
	};
}
function formatTargetHint() {
	return "dm/~sampel-palnet | ~sampel-palnet | chat/~host-ship/channel | group:~host-ship/channel";
}
//#endregion
//#region extensions/tlon/src/account-fields.ts
function buildTlonAccountFields(input) {
	return {
		...input.ship ? { ship: input.ship } : {},
		...input.url ? { url: input.url } : {},
		...input.code ? { code: input.code } : {},
		...typeof input.dangerouslyAllowPrivateNetwork === "boolean" ? { network: { dangerouslyAllowPrivateNetwork: input.dangerouslyAllowPrivateNetwork } } : {},
		...input.groupChannels ? { groupChannels: input.groupChannels } : {},
		...input.dmAllowlist ? { dmAllowlist: input.dmAllowlist } : {},
		...typeof input.autoDiscoverChannels === "boolean" ? { autoDiscoverChannels: input.autoDiscoverChannels } : {},
		...input.ownerShip ? { ownerShip: input.ownerShip } : {}
	};
}
//#endregion
//#region extensions/tlon/src/types.ts
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
	if (!resolveTlonChannelConfig(cfg)) return {
		accountId: resolvedAccountId,
		name: null,
		enabled: false,
		configured: false,
		ship: null,
		url: null,
		code: null,
		dangerouslyAllowPrivateNetwork: null,
		groupChannels: [],
		dmAllowlist: [],
		groupInviteAllowlist: [],
		autoDiscoverChannels: null,
		showModelSignature: null,
		autoAcceptDmInvites: null,
		autoAcceptGroupInvites: null,
		defaultAuthorizedShips: [],
		ownerShip: null
	};
	const merged = resolveMergedTlonAccountConfig(cfg, resolvedAccountId);
	const ship = merged.ship ?? null;
	const url = merged.url ?? null;
	const code = merged.code ?? null;
	const dangerouslyAllowPrivateNetwork = isPrivateNetworkOptInEnabled(merged) ? true : typeof merged.network?.dangerouslyAllowPrivateNetwork === "boolean" ? merged.network.dangerouslyAllowPrivateNetwork : hasLegacyFlatAllowPrivateNetworkAlias(merged) && typeof merged.allowPrivateNetwork === "boolean" ? merged.allowPrivateNetwork : null;
	const groupChannels = merged.groupChannels ?? [];
	const dmAllowlist = merged.dmAllowlist ?? [];
	const groupInviteAllowlist = merged.groupInviteAllowlist ?? [];
	const autoDiscoverChannels = merged.autoDiscoverChannels ?? null;
	const showModelSignature = merged.showModelSignature ?? null;
	const autoAcceptDmInvites = merged.autoAcceptDmInvites ?? null;
	const autoAcceptGroupInvites = merged.autoAcceptGroupInvites ?? null;
	const ownerShip = merged.ownerShip ?? null;
	const defaultAuthorizedShips = merged.defaultAuthorizedShips ?? [];
	const configured = Boolean(ship && url && code);
	return {
		accountId: resolvedAccountId,
		name: merged.name ?? null,
		enabled: merged.enabled !== false,
		configured,
		mediaMaxBytes: resolveChannelMediaMaxBytes({
			cfg,
			accountId: resolvedAccountId,
			resolveChannelLimitMb: () => merged.mediaMaxMb
		}),
		ship,
		url,
		code,
		dangerouslyAllowPrivateNetwork,
		groupChannels,
		dmAllowlist,
		groupInviteAllowlist,
		autoDiscoverChannels,
		showModelSignature,
		autoAcceptDmInvites,
		autoAcceptGroupInvites,
		defaultAuthorizedShips,
		ownerShip
	};
}
//#endregion
//#region extensions/tlon/src/urbit/base-url.ts
function hasScheme(value) {
	return /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(value);
}
function normalizeUrbitHostname(hostname) {
	return (hostname ?? "").trim().toLowerCase().replace(/\.$/, "");
}
function validateUrbitBaseUrl(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return {
		ok: false,
		error: "Required"
	};
	const candidate = hasScheme(trimmed) ? trimmed : `https://${trimmed}`;
	let parsed;
	try {
		parsed = new URL(candidate);
	} catch {
		return {
			ok: false,
			error: "Invalid URL"
		};
	}
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
	const isIpv6 = hostname.includes(":");
	const host = parsed.port ? `${isIpv6 ? `[${hostname}]` : hostname}:${parsed.port}` : isIpv6 ? `[${hostname}]` : hostname;
	return {
		ok: true,
		baseUrl: `${parsed.protocol}//${host}`,
		hostname
	};
}
function isBlockedUrbitHostname(hostname) {
	const normalized = normalizeUrbitHostname(hostname);
	if (!normalized) return false;
	return isBlockedHostnameOrIp(normalized);
}
//#endregion
//#region extensions/tlon/src/setup-core.ts
const t = createSetupTranslator();
function tlonChannelId() {
	return "tlon";
}
function isConfigured(account) {
	return Boolean(account.ship && account.url && account.code);
}
function createTlonSetupWizardBase(params) {
	return {
		channel: tlonChannelId(),
		status: {
			configuredLabel: t("wizard.channels.statusConfigured"),
			unconfiguredLabel: t("wizard.channels.statusNeedsSetup"),
			configuredHint: t("wizard.channels.statusConfigured"),
			unconfiguredHint: t("wizard.channels.statusUrbitMessenger"),
			configuredScore: 1,
			unconfiguredScore: 4,
			resolveConfigured: ({ cfg, accountId }) => params.resolveConfigured({
				cfg,
				accountId
			}),
			resolveStatusLines: ({ cfg, accountId, configured }) => params.resolveStatusLines?.({
				cfg,
				accountId,
				configured
			}) ?? []
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
		finalize: params.finalize
	};
}
async function resolveTlonSetupConfigured(cfg, accountId) {
	if (accountId) return isConfigured(resolveTlonAccount(cfg, accountId));
	const accountIds = listTlonAccountIds(cfg);
	return accountIds.length > 0 ? accountIds.some((resolvedAccountId) => isConfigured(resolveTlonAccount(cfg, resolvedAccountId))) : isConfigured(resolveTlonAccount(cfg, DEFAULT_ACCOUNT_ID));
}
async function resolveTlonSetupStatusLines(cfg, accountId) {
	const configured = await resolveTlonSetupConfigured(cfg, accountId);
	return [`${accountId && accountId !== DEFAULT_ACCOUNT_ID ? `Tlon (${accountId})` : "Tlon"}: ${configured ? "configured" : "needs setup"}`];
}
function applyTlonSetupConfig(params) {
	const { cfg, accountId, input } = params;
	const useDefault = accountId === DEFAULT_ACCOUNT_ID;
	const namedConfig = prepareScopedSetupConfig({
		cfg,
		channelKey: tlonChannelId(),
		accountId,
		name: input.name
	});
	const base = namedConfig.channels?.tlon ?? {};
	const payload = buildTlonAccountFields(input);
	return patchScopedAccountConfig({
		cfg: namedConfig,
		channelKey: tlonChannelId(),
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
		channelKey: tlonChannelId(),
		accountId,
		name
	}),
	validateInput: createSetupInputPresenceValidator({ validate: ({ cfg, accountId, input }) => {
		const setupInput = input;
		const resolved = resolveTlonAccount(cfg, accountId ?? void 0);
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
//#endregion
export { tlonSetupAdapter as a, normalizeUrbitHostname as c, resolveTlonAccount as d, formatTargetHint as f, resolveTlonOutboundTarget as g, parseTlonTarget as h, resolveTlonSetupStatusLines as i, validateUrbitBaseUrl as l, parseChannelNest as m, createTlonSetupWizardBase as n, tlonSetupContract as o, normalizeShip as p, resolveTlonSetupConfigured as r, isBlockedUrbitHostname as s, applyTlonSetupConfig as t, listTlonAccountIds as u };
