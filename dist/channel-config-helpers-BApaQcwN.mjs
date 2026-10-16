import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-D_rRUHd5.mjs";
import { a as setAccountEnabledInConfigSection, i as deleteAccountFromConfigSection, o as setTopLevelChannelEnabledInConfigSection, r as clearTopLevelChannelConfigFields, s as writeChannelSection } from "./config-helpers-Ch_BBBFF.mjs";
import { t as buildAccountScopedDmSecurityPolicy } from "./helpers-Bm4RKejp.mjs";
//#region src/channels/plugins/config-write-policy-shared.ts
function resolveChannelConfig(cfg, channelId) {
	if (!channelId) return;
	const channelConfig = cfg.channels?.[channelId];
	return channelConfig != null && typeof channelConfig === "object" && !Array.isArray(channelConfig) ? channelConfig : void 0;
}
function resolveChannelConfigWritesShared(params) {
	const channelConfig = resolveChannelConfig(params.cfg, params.channelId);
	if (!channelConfig || !params.channelId) return true;
	return (resolveChannelAccountEntry(channelConfig.accounts, normalizeAccountId(params.accountId), params.channelId)?.configWrites ?? channelConfig.configWrites) !== false;
}
function authorizeConfigWriteShared(params) {
	if (params.allowBypass) return { allowed: true };
	if (params.target?.kind === "ambiguous") return {
		allowed: false,
		reason: "ambiguous-target"
	};
	const target = params.target;
	const scopes = [["origin", params.origin], ["target", target && target.kind !== "global" ? target.scope : void 0]];
	for (const [kind, scope] of scopes) if (scope?.channelId && !resolveChannelConfigWritesShared({
		cfg: params.cfg,
		channelId: scope.channelId,
		accountId: scope.accountId
	})) return {
		allowed: false,
		reason: kind === "origin" ? "origin-disabled" : "target-disabled",
		blockedScope: {
			kind,
			scope
		}
	};
	return { allowed: true };
}
function resolveExplicitConfigWriteTargetShared(scope) {
	if (!scope.channelId) return { kind: "global" };
	const accountId = normalizeAccountId(scope.accountId);
	if (accountId === "default") return {
		kind: "channel",
		scope: { channelId: scope.channelId }
	};
	return {
		kind: "account",
		scope: {
			channelId: scope.channelId,
			accountId
		}
	};
}
function resolveConfigWriteTargetFromPathShared(params) {
	if (params.path[0] !== "channels") return { kind: "global" };
	if (params.path.length < 2) return {
		kind: "ambiguous",
		scopes: []
	};
	const channelId = params.normalizeChannelId(params.path[1] ?? "");
	if (!channelId) return {
		kind: "ambiguous",
		scopes: []
	};
	if (params.path.length === 2) return {
		kind: "ambiguous",
		scopes: [{ channelId }]
	};
	if (params.path[2] !== "accounts") return {
		kind: "channel",
		scope: { channelId }
	};
	if (params.path.length < 4) return {
		kind: "ambiguous",
		scopes: [{ channelId }]
	};
	return resolveExplicitConfigWriteTargetShared({
		channelId,
		accountId: params.path[3]
	});
}
function canBypassConfigWritePolicyShared(params) {
	return params.isInternalMessageChannel(params.channel) && params.gatewayClientScopes?.includes("operator.admin") === true;
}
function formatConfigWriteDeniedMessageShared(params) {
	if (params.result.reason === "ambiguous-target") return "⚠️ Channel-initiated /config writes cannot replace channels, channel roots, or accounts collections. Use a more specific path or gateway operator.admin.";
	const blocked = params.result.blockedScope?.scope;
	return `⚠️ Config writes are disabled for ${blocked?.channelId ?? params.fallbackChannelId ?? "this channel"}. Set ${blocked?.channelId ? blocked.accountId ? `channels.${blocked.channelId}.accounts.${blocked.accountId}.configWrites=true` : `channels.${blocked.channelId}.configWrites=true` : params.fallbackChannelId ? `channels.${params.fallbackChannelId}.configWrites=true` : "channels.<channel>.configWrites=true"} to enable.`;
}
//#endregion
//#region src/channels/plugins/config-writes.ts
const authorizeConfigWrite = authorizeConfigWriteShared;
const resolveExplicitConfigWriteTarget = resolveExplicitConfigWriteTargetShared;
const formatConfigWriteDeniedMessage = formatConfigWriteDeniedMessageShared;
/**
* Infers the channel config write target from a config path.
*/
function resolveConfigWriteTargetFromPath(path) {
	return resolveConfigWriteTargetFromPathShared({
		path,
		normalizeChannelId: normalizeLowercaseStringOrEmpty
	});
}
/**
* Checks whether a gateway client can bypass channel config write policy.
*/
function canBypassConfigWritePolicy(params) {
	return canBypassConfigWritePolicyShared({
		...params,
		isInternalMessageChannel: (channel) => normalizeLowercaseStringOrEmpty(channel) === "webchat"
	});
}
//#endregion
//#region src/plugin-sdk/channel-config-helpers.ts
/**
* Channel config adapter and DM-access helpers for plugin setup.
*
* Not part of the config-schema facade trio despite the similar name: those
* export Zod schema builders, while this subpath owns config CRUD adapters,
* config-write authorization, and DM access/policy resolution for accounts.
*/
/** Returns whether config writes are enabled for a channel/account target. */
function resolveChannelConfigWrites(params) {
	return resolveChannelConfigWritesShared(params);
}
/** Coerce mixed allowlist config values into plain strings without trimming or deduping. */
function mapAllowFromEntries(allowFrom) {
	return (allowFrom ?? []).map((entry) => String(entry));
}
/** Normalize user-facing allowlist entries the same way config and doctor flows expect. */
function formatTrimmedAllowFromEntries(allowFrom) {
	return normalizeStringEntries(allowFrom);
}
/** Collapse nullable config scalars into a trimmed optional string. */
function resolveOptionalConfigString(value) {
	if (value == null) return;
	return String(value).trim() || void 0;
}
/** Adapt `{ cfg, accountId }` accessors to callback sites that pass positional args. */
function adaptScopedAccountAccessor(accessor) {
	return (cfg, accountId) => accessor({
		cfg,
		accountId
	});
}
/** Build the shared allowlist/default target adapter surface for account-scoped channel configs. */
function createScopedAccountConfigAccessors(params) {
	const base = {
		resolveAllowFrom({ cfg, accountId }) {
			return mapAllowFromEntries(params.resolveAllowFrom(params.resolveAccount({
				cfg,
				accountId
			})));
		},
		formatAllowFrom({ allowFrom }) {
			return params.formatAllowFrom(allowFrom);
		}
	};
	if (!params.resolveDefaultTo) return base;
	return {
		...base,
		resolveDefaultTo({ cfg, accountId }) {
			return resolveOptionalConfigString(params.resolveDefaultTo?.(params.resolveAccount({
				cfg,
				accountId
			})));
		}
	};
}
function createChannelConfigAdapterFromBase(params) {
	return {
		...params.base,
		...createScopedAccountConfigAccessors({
			resolveAccount: params.resolveAccessorAccount ?? params.resolveAccountForAccessors,
			resolveAllowFrom: params.resolveAllowFrom,
			formatAllowFrom: params.formatAllowFrom,
			resolveDefaultTo: params.resolveDefaultTo
		})
	};
}
/** Build the common CRUD/config helpers for channels that store multiple named accounts. */
function createScopedChannelConfigBase(params) {
	const { listAccountIds, resolveAccount, inspectAccount, defaultAccountId } = params;
	return {
		listAccountIds: (cfg) => listAccountIds(cfg),
		resolveAccount: (cfg, accountId) => resolveAccount(cfg, accountId),
		inspectAccount: inspectAccount ? (cfg, accountId) => inspectAccount(cfg, accountId) : void 0,
		defaultAccountId: (cfg) => defaultAccountId(cfg),
		setAccountEnabled({ cfg, accountId, enabled }) {
			return setAccountEnabledInConfigSection({
				cfg,
				sectionKey: params.sectionKey,
				accountKeyPolicy: params.accountKeyPolicy,
				accountId: normalizeAccountId(accountId),
				enabled,
				allowTopLevel: params.allowTopLevel ?? true
			});
		},
		deleteAccount({ cfg, accountId }) {
			return deleteAccountFromConfigSection({
				cfg,
				sectionKey: params.sectionKey,
				accountKeyPolicy: params.accountKeyPolicy,
				accountId: normalizeAccountId(accountId),
				clearBaseFields: params.clearBaseFields
			});
		}
	};
}
/** Build the full shared config adapter for account-scoped channels with allowlist/default target accessors. */
function createScopedChannelConfigAdapter(params) {
	return createChannelConfigAdapterFromBase({
		...params,
		base: createScopedChannelConfigBase({ ...params }),
		resolveAccountForAccessors({ cfg, accountId }) {
			return params.resolveAccount(cfg, accountId);
		}
	});
}
/** Build CRUD/config helpers for top-level single-account channels. */
function createTopLevelChannelConfigBase(params) {
	return {
		listAccountIds(cfg) {
			return params.listAccountIds?.(cfg) ?? ["default"];
		},
		resolveAccount(cfg) {
			return params.resolveAccount(cfg);
		},
		inspectAccount: params.inspectAccount ? (cfg) => params.inspectAccount?.(cfg) : void 0,
		defaultAccountId(cfg) {
			return params.defaultAccountId?.(cfg) ?? "default";
		},
		setAccountEnabled({ cfg, enabled }) {
			return setTopLevelChannelEnabledInConfigSection({
				cfg,
				sectionKey: params.sectionKey,
				enabled
			});
		},
		deleteAccount({ cfg }) {
			return params.deleteMode === "clear-fields" ? clearTopLevelChannelConfigFields({
				cfg,
				sectionKey: params.sectionKey,
				clearBaseFields: params.clearBaseFields ?? []
			}) : writeChannelSection(cfg, params.sectionKey, void 0);
		}
	};
}
/** Build the full shared config adapter for top-level single-account channels with allowlist/default target accessors. */
function createTopLevelChannelConfigAdapter(params) {
	return createChannelConfigAdapterFromBase({
		...params,
		base: createTopLevelChannelConfigBase({ ...params }),
		resolveAccountForAccessors({ cfg }) {
			return params.resolveAccount(cfg);
		}
	});
}
/** Build CRUD/config helpers for channels where the default account lives at channel root and named accounts live under `accounts`. */
function createHybridChannelConfigBase(params) {
	const base = createScopedChannelConfigBase({
		...params,
		allowTopLevel: false
	});
	return {
		...base,
		setAccountEnabled(input) {
			return normalizeAccountId(input.accountId) === "default" ? setTopLevelChannelEnabledInConfigSection({
				cfg: input.cfg,
				sectionKey: params.sectionKey,
				enabled: input.enabled
			}) : base.setAccountEnabled(input);
		},
		deleteAccount(input) {
			return normalizeAccountId(input.accountId) === "default" && params.preserveSectionOnDefaultDelete ? clearTopLevelChannelConfigFields({
				cfg: input.cfg,
				sectionKey: params.sectionKey,
				clearBaseFields: params.clearBaseFields
			}) : base.deleteAccount(input);
		}
	};
}
/** Build the full shared config adapter for hybrid channels with allowlist/default target accessors. */
function createHybridChannelConfigAdapter(params) {
	return createChannelConfigAdapterFromBase({
		...params,
		base: createHybridChannelConfigBase({ ...params }),
		resolveAccountForAccessors({ cfg, accountId }) {
			return params.resolveAccount(cfg, accountId);
		}
	});
}
/** Convert account-specific DM security fields into the shared runtime policy resolver shape. */
function createScopedDmSecurityResolver(params) {
	return ({ cfg, accountId, account }) => {
		const access = params.resolveAccess?.({
			cfg,
			accountId,
			account
		});
		return buildAccountScopedDmSecurityPolicy({
			cfg,
			channelKey: params.channelKey,
			accountId,
			fallbackAccountId: params.resolveFallbackAccountId?.(account) ?? account.accountId,
			policy: access?.dmPolicy ?? params.resolvePolicy(account),
			allowFrom: access?.allowFrom ?? params.resolveAllowFrom(account) ?? [],
			defaultPolicy: params.defaultPolicy,
			allowFromPathSuffix: params.allowFromPathSuffix,
			policyPathSuffix: params.policyPathSuffix,
			approveChannelId: params.approveChannelId,
			approveHint: params.approveHint,
			normalizeEntry: params.normalizeEntry,
			classifyEntryAuthentication: params.classifyEntryAuthentication,
			inheritSharedDefaultsFromDefaultAccount: params.inheritSharedDefaultsFromDefaultAccount
		});
	};
}
//#endregion
export { resolveConfigWriteTargetFromPath as _, createScopedChannelConfigAdapter as a, createTopLevelChannelConfigAdapter as c, mapAllowFromEntries as d, resolveChannelConfigWrites as f, formatConfigWriteDeniedMessage as g, canBypassConfigWritePolicy as h, createScopedAccountConfigAccessors as i, createTopLevelChannelConfigBase as l, authorizeConfigWrite as m, createHybridChannelConfigAdapter as n, createScopedChannelConfigBase as o, resolveOptionalConfigString as p, createHybridChannelConfigBase as r, createScopedDmSecurityResolver as s, adaptScopedAccountAccessor as t, formatTrimmedAllowFromEntries as u, resolveExplicitConfigWriteTarget as v };
