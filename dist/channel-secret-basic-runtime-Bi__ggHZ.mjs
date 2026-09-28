import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as appendConfigPathSegment } from "./dot-path-BSC76DAI.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import "./shared-BUXrUFz5.mjs";
import { c as isEnabledFlag, o as hasOwnProperty, r as collectSecretInputAssignment, s as isChannelAccountEffectivelyEnabled } from "./runtime-shared-Bpp2PLaL.mjs";
//#region src/secrets/channel-secret-basic-runtime.ts
/** Basic channel secret runtime helpers for account/root credential collection. */
function buildChannelSecretTargetRegistryEntry(params) {
	const spec = typeof params.spec === "string" ? { path: params.spec } : params.spec;
	const scopePrefix = params.scope === "account" ? `channels.${params.channelKey}.accounts.*` : `channels.${params.channelKey}`;
	const pathPattern = `${scopePrefix}.${spec.path}`;
	return {
		id: pathPattern,
		targetType: spec.targetType ?? pathPattern,
		...spec.targetTypeAliases ? { targetTypeAliases: spec.targetTypeAliases } : {},
		configFile: "openclaw.json",
		pathPattern,
		...spec.refPath ? { refPathPattern: `${scopePrefix}.${spec.refPath}` } : {},
		secretShape: spec.secretShape ?? "secret_input",
		expectedResolvedValue: spec.expectedResolvedValue ?? "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true,
		...spec.accountIdPathSegmentIndex !== void 0 ? { accountIdPathSegmentIndex: spec.accountIdPathSegmentIndex } : {}
	};
}
function createChannelSecretTargetRegistryEntries(params) {
	return [...(params.account ?? []).map((spec) => buildChannelSecretTargetRegistryEntry({
		channelKey: params.channelKey,
		scope: "account",
		spec
	})), ...(params.channel ?? []).map((spec) => buildChannelSecretTargetRegistryEntry({
		channelKey: params.channelKey,
		scope: "channel",
		spec
	}))];
}
/** Builds the common registry and runtime collector used by simple channel secrets. */
function createSimpleChannelSecretContract(params) {
	const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
		channelKey: params.channelKey,
		account: params.accountFields,
		channel: params.channelFields
	});
	const collectionFields = typeof params.mode === "object" ? params.mode.collectionFields : [.../* @__PURE__ */ new Set([...params.accountFields, ...params.channelFields])];
	const collectRuntimeConfigAssignments = (collectorParams) => {
		if (params.mode === "channel-only") {
			const channel = getChannelRecord(collectorParams.config, params.channelKey);
			if (!channel) return;
			for (const field of collectionFields) collectSecretInputAssignment({
				value: channel[field],
				path: `channels.${params.channelKey}.${field}`,
				expected: "string",
				defaults: collectorParams.defaults,
				context: collectorParams.context,
				active: channel.enabled !== false,
				inactiveReason: `${params.label} channel is disabled.`,
				owner: {
					ownerKind: "account",
					ownerId: `${params.channelKey}:default`,
					requiredForGateway: false,
					disposition: "isolate",
					contract: channel
				},
				apply: (value) => {
					channel[field] = value;
				}
			});
			return;
		}
		const resolved = getChannelSurface(collectorParams.config, params.channelKey);
		if (!resolved) return;
		const { channel, surface } = resolved;
		for (const field of collectionFields) {
			const topInactiveReason = params.mode === "channel-surface" ? `${params.label} channel is disabled.` : params.mode === "account-inheritance" ? `no enabled account inherits this top-level ${params.label} ${field}.` : `no enabled ${params.label} surface inherits this top-level ${field}.`;
			collectSimpleChannelFieldAssignments({
				channelKey: params.channelKey,
				field,
				channel,
				surface,
				defaults: collectorParams.defaults,
				context: collectorParams.context,
				topInactiveReason,
				accountInactiveReason: params.mode === "channel-surface" ? `${params.label} channel is disabled.` : `${params.label} account is disabled.`
			});
		}
	};
	return {
		secretTargetRegistryEntries,
		collectRuntimeConfigAssignments
	};
}
/** Stable owner identity shared by SecretRef collection and channel activation. */
function createChannelAccountSecretOwner(channelKey, accountId, channel, account, contract) {
	const { accounts: _accounts, ...channelDefaults } = channel;
	return {
		ownerKind: "account",
		ownerId: `${channelKey}:${normalizeAccountId(accountId)}`,
		requiredForGateway: false,
		disposition: "isolate",
		contract: contract ?? {
			channel: channelDefaults,
			account
		}
	};
}
/** Reads a channel config block when it exists as an object. */
function getChannelRecord(config, channelKey) {
	const channels = config.channels;
	if (!isRecord(channels)) return;
	const channel = channels[channelKey];
	return isRecord(channel) ? channel : void 0;
}
/** Reads a channel config and its resolved account surface in one step. */
function getChannelSurface(config, channelKey) {
	const channel = getChannelRecord(config, channelKey);
	if (!channel) return null;
	return {
		channel,
		surface: resolveChannelAccountSurface(channel)
	};
}
/** Resolves explicit channel accounts or creates a default account backed by the channel root. */
function resolveChannelAccountSurface(channel) {
	const channelEnabled = isEnabledFlag(channel);
	const accounts = channel.accounts;
	if (!isRecord(accounts) || Object.keys(accounts).length === 0) return {
		hasExplicitAccounts: false,
		channelEnabled,
		accounts: [{
			accountId: "default",
			account: channel,
			enabled: channelEnabled
		}]
	};
	const accountEntries = [];
	for (const [accountId, account] of Object.entries(accounts)) {
		if (!isRecord(account)) continue;
		accountEntries.push({
			accountId,
			account,
			enabled: isChannelAccountEffectivelyEnabled(channel, account)
		});
	}
	return {
		hasExplicitAccounts: true,
		channelEnabled,
		accounts: accountEntries
	};
}
function isBaseFieldActiveForChannelSurface(surface, rootKey) {
	if (!surface.channelEnabled) return false;
	if (!surface.hasExplicitAccounts) return true;
	return surface.accounts.some(({ account, enabled }) => enabled && !hasOwnProperty(account, rootKey));
}
/** Normalizes optional channel secret strings before deciding whether a value is configured. */
function normalizeSecretStringValue(value) {
	return typeof value === "string" ? value.trim() : "";
}
/** Returns true when a channel value contains plaintext or a SecretRef-compatible value. */
function hasConfiguredSecretInputValue(value, defaults) {
	return normalizeSecretStringValue(value).length > 0 || coerceSecretRef(value, defaults) !== null;
}
function collectTopLevelChannelFieldAssignments(params) {
	const owners = params.surface.hasExplicitAccounts ? params.surface.accounts.filter(params.inheritedAccountActive) : params.activeWithoutAccounts ? [{
		accountId: "default",
		account: {},
		enabled: true
	}] : [];
	if (owners.length === 0) {
		collectSecretInputAssignment({
			value: params.value,
			path: params.fieldPath,
			expected: params.expected,
			defaults: params.defaults,
			context: params.context,
			active: false,
			inactiveReason: params.inactiveReason,
			apply: params.apply
		});
		return;
	}
	const { accounts: _accounts, ...channelDefaults } = params.channel;
	const inheritedContract = {
		channel: channelDefaults,
		consumers: owners.map(({ accountId, account }) => ({
			accountId: normalizeAccountId(accountId),
			account
		})).toSorted((left, right) => left.accountId.localeCompare(right.accountId))
	};
	for (const { accountId, account } of owners) collectSecretInputAssignment({
		value: params.value,
		path: params.fieldPath,
		expected: params.expected,
		defaults: params.defaults,
		context: params.context,
		owner: createChannelAccountSecretOwner(params.channelKey, accountId, params.channel, account, inheritedContract),
		apply: params.apply
	});
}
/** Collects root/account channel field SecretRef assignments for one credential path. */
function collectSimpleChannelFieldAssignments(params) {
	collectTopLevelChannelFieldAssignments({
		channelKey: params.channelKey,
		channel: params.channel,
		value: params.channel[params.field],
		fieldPath: `channels.${params.channelKey}.${params.field}`,
		expected: "string",
		surface: params.surface,
		defaults: params.defaults,
		context: params.context,
		activeWithoutAccounts: params.surface.channelEnabled,
		inheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, params.field),
		inactiveReason: params.topInactiveReason,
		apply: (value) => {
			params.channel[params.field] = value;
		}
	});
	if (!params.surface.hasExplicitAccounts) return;
	for (const { accountId, account, enabled } of params.surface.accounts) {
		if (!hasOwnProperty(account, params.field)) continue;
		collectSecretInputAssignment({
			value: account[params.field],
			path: `${appendConfigPathSegment(`channels.${params.channelKey}.accounts`, accountId)}.${params.field}`,
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: enabled,
			inactiveReason: params.accountInactiveReason,
			owner: createChannelAccountSecretOwner(params.channelKey, accountId, params.channel, account),
			apply: (value) => {
				account[params.field] = value;
			}
		});
	}
}
/** Collects a channel field whose active state depends on caller-provided account predicates. */
function collectConditionalChannelFieldAssignments(params) {
	collectTopLevelChannelFieldAssignments({
		channelKey: params.channelKey,
		channel: params.channel,
		value: params.channel[params.field],
		fieldPath: `channels.${params.channelKey}.${params.field}`,
		expected: "string",
		surface: params.surface,
		defaults: params.defaults,
		context: params.context,
		activeWithoutAccounts: params.surface.channelEnabled && params.topLevelActiveWithoutAccounts,
		inheritedAccountActive: params.topLevelInheritedAccountActive,
		inactiveReason: params.topInactiveReason,
		apply: (value) => {
			params.channel[params.field] = value;
		}
	});
	if (!params.surface.hasExplicitAccounts) return;
	for (const entry of params.surface.accounts) {
		if (!hasOwnProperty(entry.account, params.field)) continue;
		collectSecretInputAssignment({
			value: entry.account[params.field],
			path: `${appendConfigPathSegment(`channels.${params.channelKey}.accounts`, entry.accountId)}.${params.field}`,
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: params.accountActive(entry),
			inactiveReason: typeof params.accountInactiveReason === "function" ? params.accountInactiveReason(entry) : params.accountInactiveReason,
			owner: createChannelAccountSecretOwner(params.channelKey, entry.accountId, params.channel, entry.account),
			apply: (value) => {
				entry.account[params.field] = value;
			}
		});
	}
}
/** Collects a nested channel field from root and account-specific nested config blocks. */
function collectNestedChannelFieldAssignments(params) {
	const topLevelNested = params.channel[params.nestedKey];
	if (isRecord(topLevelNested)) collectTopLevelChannelFieldAssignments({
		channelKey: params.channelKey,
		channel: params.channel,
		value: topLevelNested[params.field],
		fieldPath: `channels.${params.channelKey}.${params.nestedKey}.${params.field}`,
		expected: "string",
		surface: params.surface,
		defaults: params.defaults,
		context: params.context,
		activeWithoutAccounts: params.topLevelActive,
		inheritedAccountActive: params.topLevelInheritedAccountActive ?? (({ account, enabled }) => params.topLevelActive && enabled && !hasOwnProperty(account, params.nestedKey)),
		inactiveReason: params.topInactiveReason,
		apply: (value) => {
			topLevelNested[params.field] = value;
		}
	});
	if (!params.surface.hasExplicitAccounts) return;
	for (const entry of params.surface.accounts) {
		const nested = entry.account[params.nestedKey];
		if (!isRecord(nested)) continue;
		collectSecretInputAssignment({
			value: nested[params.field],
			path: `${appendConfigPathSegment(`channels.${params.channelKey}.accounts`, entry.accountId)}.${params.nestedKey}.${params.field}`,
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: params.accountActive(entry),
			inactiveReason: typeof params.accountInactiveReason === "function" ? params.accountInactiveReason(entry) : params.accountInactiveReason,
			owner: createChannelAccountSecretOwner(params.channelKey, entry.accountId, params.channel, entry.account),
			apply: (value) => {
				nested[params.field] = value;
			}
		});
	}
}
//#endregion
export { createChannelSecretTargetRegistryEntries as a, getChannelSurface as c, normalizeSecretStringValue as d, resolveChannelAccountSurface as f, createChannelAccountSecretOwner as i, hasConfiguredSecretInputValue as l, collectNestedChannelFieldAssignments as n, createSimpleChannelSecretContract as o, collectSimpleChannelFieldAssignments as r, getChannelRecord as s, collectConditionalChannelFieldAssignments as t, isBaseFieldActiveForChannelSurface as u };
