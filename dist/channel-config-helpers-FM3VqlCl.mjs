import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import { a as setAccountEnabledInConfigSection, i as deleteAccountFromConfigSection, o as setTopLevelChannelEnabledInConfigSection, r as clearTopLevelChannelConfigFields, s as writeChannelSection } from "./config-helpers--6MdZhMW.mjs";
import { t as buildAccountScopedDmSecurityPolicy } from "./helpers-t_ym8v5h.mjs";
//#region src/channels/plugins/config-write-policy-shared.ts
/**
* Shared channel config-write policy helpers.
*
* Authorizes config writes by origin/target channel and account scope.
*/
function resolveChannelConfig(cfg, channelId) {
	if (!channelId) return;
	const channelConfig = cfg.channels?.[channelId];
	return channelConfig != null && typeof channelConfig === "object" && !Array.isArray(channelConfig) ? channelConfig : void 0;
}
function resolveChannelAccountConfig(channelConfig, channelId, accountId) {
	return resolveChannelAccountEntry(channelConfig.accounts, normalizeAccountId(accountId), channelId);
}
/**
* Resolves whether config writes are enabled for a channel/account scope.
*/
function resolveChannelConfigWritesShared(params) {
	const channelConfig = resolveChannelConfig(params.cfg, params.channelId);
	if (!channelConfig || !params.channelId) return true;
	return (resolveChannelAccountConfig(channelConfig, params.channelId, params.accountId)?.configWrites ?? channelConfig.configWrites) !== false;
}
/**
* Authorizes a channel-initiated config write against origin and target policy.
*/
function authorizeConfigWriteShared(params) {
	if (params.allowBypass) return { allowed: true };
	if (params.target?.kind === "ambiguous") return {
		allowed: false,
		reason: "ambiguous-target"
	};
	if (params.origin?.channelId && !resolveChannelConfigWritesShared({
		cfg: params.cfg,
		channelId: params.origin.channelId,
		accountId: params.origin.accountId
	})) return {
		allowed: false,
		reason: "origin-disabled",
		blockedScope: {
			kind: "origin",
			scope: params.origin
		}
	};
	const target = params.target;
	if (target && target.kind !== "global") {
		const scope = target.scope;
		if (scope.channelId && !resolveChannelConfigWritesShared({
			cfg: params.cfg,
			channelId: scope.channelId,
			accountId: scope.accountId
		})) return {
			allowed: false,
			reason: "target-disabled",
			blockedScope: {
				kind: "target",
				scope
			}
		};
	}
	return { allowed: true };
}
/**
* Resolves an explicit channel/account scope into a config write target.
*/
function resolveExplicitConfigWriteTargetShared(scope) {
	if (!scope.channelId) return { kind: "global" };
	const accountId = normalizeAccountId(scope.accountId);
	if (!accountId || accountId === "default") return {
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
/**
* Infers the config write target from a config path.
*/
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
		accountId: normalizeAccountId(params.path[3])
	});
}
/**
* Checks whether an internal admin client can bypass channel config write policy.
*/
function canBypassConfigWritePolicyShared(params) {
	return params.isInternalMessageChannel(params.channel) && params.gatewayClientScopes?.includes("operator.admin") === true;
}
/**
* Formats the user-facing denial message for a blocked config write.
*/
function formatConfigWriteDeniedMessageShared(params) {
	if (params.result.reason === "ambiguous-target") return "⚠️ Channel-initiated /config writes cannot replace channels, channel roots, or accounts collections. Use a more specific path or gateway operator.admin.";
	const blocked = params.result.blockedScope?.scope;
	return `⚠️ Config writes are disabled for ${blocked?.channelId ?? params.fallbackChannelId ?? "this channel"}. Set ${blocked?.channelId ? blocked.accountId ? `channels.${blocked.channelId}.accounts.${blocked.accountId}.configWrites=true` : `channels.${blocked.channelId}.configWrites=true` : params.fallbackChannelId ? `channels.${params.fallbackChannelId}.configWrites=true` : "channels.<channel>.configWrites=true"} to enable.`;
}
//#endregion
//#region src/channels/plugins/config-writes.ts
/**
* Channel config-write policy facade.
*
* Applies shared config write authorization to concrete OpenClaw channel config.
*/
function isInternalConfigWriteMessageChannel(channel) {
	return normalizeLowercaseStringOrEmpty(channel) === "webchat";
}
/**
* Authorizes a channel config write under origin and target policy.
*/
function authorizeConfigWrite(params) {
	return authorizeConfigWriteShared(params);
}
/**
* Resolves an explicit channel/account scope into a config write target.
*/
function resolveExplicitConfigWriteTarget(scope) {
	return resolveExplicitConfigWriteTargetShared(scope);
}
/**
* Infers the channel config write target from a config path.
*/
function resolveConfigWriteTargetFromPath(path) {
	return resolveConfigWriteTargetFromPathShared({
		path,
		normalizeChannelId: (raw) => normalizeLowercaseStringOrEmpty(raw)
	});
}
/**
* Checks whether a gateway client can bypass channel config write policy.
*/
function canBypassConfigWritePolicy(params) {
	return canBypassConfigWritePolicyShared({
		...params,
		isInternalMessageChannel: isInternalConfigWriteMessageChannel
	});
}
/**
* Formats the user-facing denial message for a blocked channel config write.
*/
function formatConfigWriteDeniedMessage(params) {
	return formatConfigWriteDeniedMessageShared(params);
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
function createNamedAccountConfigBase(params) {
	return {
		listAccountIds(cfg) {
			return params.listAccountIds(cfg);
		},
		resolveAccount(cfg, accountId) {
			return params.resolveAccount(cfg, accountId);
		},
		inspectAccount: params.inspectAccount ? (cfg, accountId) => params.inspectAccount?.(cfg, accountId) : void 0,
		defaultAccountId(cfg) {
			return params.defaultAccountId(cfg);
		},
		setAccountEnabled({ cfg, accountId, enabled }) {
			return params.setAccountEnabled({
				cfg,
				accountId: normalizeAccountId(accountId),
				enabled
			});
		},
		deleteAccount({ cfg, accountId }) {
			return params.deleteAccount({
				cfg,
				accountId: normalizeAccountId(accountId)
			});
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
	return createNamedAccountConfigBase({
		listAccountIds: params.listAccountIds,
		resolveAccount: params.resolveAccount,
		inspectAccount: params.inspectAccount,
		defaultAccountId: params.defaultAccountId,
		setAccountEnabled({ cfg, accountId, enabled }) {
			return setAccountEnabledInConfigSection({
				cfg,
				sectionKey: params.sectionKey,
				accountKeyPolicy: params.accountKeyPolicy,
				accountId,
				enabled,
				allowTopLevel: params.allowTopLevel ?? true
			});
		},
		deleteAccount({ cfg, accountId }) {
			return deleteAccountFromConfigSection({
				cfg,
				sectionKey: params.sectionKey,
				accountKeyPolicy: params.accountKeyPolicy,
				accountId,
				clearBaseFields: params.clearBaseFields
			});
		}
	});
}
/** Build the full shared config adapter for account-scoped channels with allowlist/default target accessors. */
function createScopedChannelConfigAdapter(params) {
	return createChannelConfigAdapterFromBase({
		base: createScopedChannelConfigBase({
			sectionKey: params.sectionKey,
			accountKeyPolicy: params.accountKeyPolicy,
			listAccountIds: params.listAccountIds,
			resolveAccount: params.resolveAccount,
			inspectAccount: params.inspectAccount,
			defaultAccountId: params.defaultAccountId,
			clearBaseFields: params.clearBaseFields,
			allowTopLevel: params.allowTopLevel
		}),
		resolveAccessorAccount: params.resolveAccessorAccount,
		resolveAccountForAccessors({ cfg, accountId }) {
			return params.resolveAccount(cfg, accountId);
		},
		resolveAllowFrom: params.resolveAllowFrom,
		formatAllowFrom: params.formatAllowFrom,
		resolveDefaultTo: params.resolveDefaultTo
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
		base: createTopLevelChannelConfigBase({
			sectionKey: params.sectionKey,
			resolveAccount: params.resolveAccount,
			listAccountIds: params.listAccountIds,
			defaultAccountId: params.defaultAccountId,
			inspectAccount: params.inspectAccount,
			deleteMode: params.deleteMode,
			clearBaseFields: params.clearBaseFields
		}),
		resolveAccessorAccount: params.resolveAccessorAccount,
		resolveAccountForAccessors({ cfg }) {
			return params.resolveAccount(cfg);
		},
		resolveAllowFrom: params.resolveAllowFrom,
		formatAllowFrom: params.formatAllowFrom,
		resolveDefaultTo: params.resolveDefaultTo
	});
}
/** Build CRUD/config helpers for channels where the default account lives at channel root and named accounts live under `accounts`. */
function createHybridChannelConfigBase(params) {
	return createNamedAccountConfigBase({
		listAccountIds: params.listAccountIds,
		resolveAccount: params.resolveAccount,
		inspectAccount: params.inspectAccount,
		defaultAccountId: params.defaultAccountId,
		setAccountEnabled({ cfg, accountId, enabled }) {
			if (normalizeAccountId(accountId) === "default") return setTopLevelChannelEnabledInConfigSection({
				cfg,
				sectionKey: params.sectionKey,
				enabled
			});
			return setAccountEnabledInConfigSection({
				cfg,
				sectionKey: params.sectionKey,
				accountKeyPolicy: params.accountKeyPolicy,
				accountId,
				enabled
			});
		},
		deleteAccount({ cfg, accountId }) {
			if (normalizeAccountId(accountId) === "default" && params.preserveSectionOnDefaultDelete) return clearTopLevelChannelConfigFields({
				cfg,
				sectionKey: params.sectionKey,
				clearBaseFields: params.clearBaseFields
			});
			return deleteAccountFromConfigSection({
				cfg,
				sectionKey: params.sectionKey,
				accountKeyPolicy: params.accountKeyPolicy,
				accountId,
				clearBaseFields: params.clearBaseFields
			});
		}
	});
}
/** Build the full shared config adapter for hybrid channels with allowlist/default target accessors. */
function createHybridChannelConfigAdapter(params) {
	return createChannelConfigAdapterFromBase({
		base: createHybridChannelConfigBase({
			sectionKey: params.sectionKey,
			accountKeyPolicy: params.accountKeyPolicy,
			listAccountIds: params.listAccountIds,
			resolveAccount: params.resolveAccount,
			inspectAccount: params.inspectAccount,
			defaultAccountId: params.defaultAccountId,
			clearBaseFields: params.clearBaseFields,
			preserveSectionOnDefaultDelete: params.preserveSectionOnDefaultDelete
		}),
		resolveAccessorAccount: params.resolveAccessorAccount,
		resolveAccountForAccessors({ cfg, accountId }) {
			return params.resolveAccount(cfg, accountId);
		},
		resolveAllowFrom: params.resolveAllowFrom,
		formatAllowFrom: params.formatAllowFrom,
		resolveDefaultTo: params.resolveDefaultTo
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
