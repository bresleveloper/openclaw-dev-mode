import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import { a as coerceSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import "./shared-BVDjoVcf.mjs";
import { c as isChannelAccountEffectivelyEnabled, l as isEnabledFlag, r as collectSecretInputAssignment, s as hasOwnProperty } from "./runtime-shared-DqMZ_k3n.mjs";
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
	const entriesForScope = (scope) => (params[scope] ?? []).map((spec) => buildChannelSecretTargetRegistryEntry({
		channelKey: params.channelKey,
		scope,
		spec
	}));
	return [...entriesForScope("account"), ...entriesForScope("channel")];
}
/** Keeps registry discovery and account-surface resolution shared while channels own activation. */
function createChannelSecretContract(params) {
	return {
		secretTargetRegistryEntries: createChannelSecretTargetRegistryEntries(params),
		collectRuntimeConfigAssignments(collectorParams) {
			const resolved = getChannelSurface(collectorParams.config, params.channelKey);
			if (!resolved) return;
			if (resolved.surface.hasExplicitAccounts && !resolved.surface.accounts.some(({ accountId }) => normalizeAccountId(accountId) === "default") && params.hasImplicitDefaultAccount?.({
				...collectorParams,
				channel: resolved.channel
			})) resolved.surface.accounts.push({
				accountId: "default",
				account: {},
				enabled: resolved.surface.channelEnabled
			});
			params.collect({
				...collectorParams,
				channelKey: params.channelKey,
				...resolved,
				defaults: collectorParams.defaults
			});
		}
	};
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
		const channelOnly = params.mode === "channel-only";
		const channel = getChannelRecord(collectorParams.config, params.channelKey);
		if (!channel) return;
		if (channelOnly) {
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
		const surface = resolveChannelAccountSurface(channel);
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
	collectConditionalChannelFieldAssignments({
		...params,
		topLevelActiveWithoutAccounts: true,
		topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, params.field),
		accountActive: ({ enabled }) => enabled
	});
}
/** Collects a channel field whose active state depends on caller-provided account predicates. */
function collectConditionalChannelFieldAssignments(params) {
	collectChannelFieldAssignments({
		...params,
		nestedKey: void 0,
		topLevelActiveWithoutAccounts: params.surface.channelEnabled && params.topLevelActiveWithoutAccounts
	});
}
/** Collects a nested channel field from root and account-specific nested config blocks. */
function collectNestedChannelFieldAssignments(params) {
	collectChannelFieldAssignments({
		...params,
		topLevelActiveWithoutAccounts: params.topLevelActive,
		topLevelInheritedAccountActive: params.topLevelInheritedAccountActive ?? (({ account, enabled }) => params.topLevelActive && enabled && !hasOwnProperty(account, params.nestedKey))
	});
}
function collectChannelFieldAssignments(params) {
	const fieldPath = params.nestedKey === void 0 ? params.field : `${params.nestedKey}.${params.field}`;
	const targetFor = (record) => {
		const target = params.nestedKey === void 0 ? record : record[params.nestedKey];
		return isRecord(target) ? target : void 0;
	};
	const topLevel = targetFor(params.channel);
	if (topLevel) collectTopLevelChannelFieldAssignments({
		channelKey: params.channelKey,
		channel: params.channel,
		value: topLevel[params.field],
		fieldPath: `channels.${params.channelKey}.${fieldPath}`,
		expected: "string",
		surface: params.surface,
		defaults: params.defaults,
		context: params.context,
		activeWithoutAccounts: params.topLevelActiveWithoutAccounts,
		inheritedAccountActive: params.topLevelInheritedAccountActive,
		inactiveReason: params.topInactiveReason,
		apply: (value) => {
			topLevel[params.field] = value;
		}
	});
	if (!params.surface.hasExplicitAccounts) return;
	for (const entry of params.surface.accounts) {
		const target = targetFor(entry.account);
		if (!target || params.nestedKey === void 0 && !hasOwnProperty(target, params.field)) continue;
		collectSecretInputAssignment({
			value: target[params.field],
			path: `${appendConfigPathSegment(`channels.${params.channelKey}.accounts`, entry.accountId)}.${fieldPath}`,
			expected: "string",
			defaults: params.defaults,
			context: params.context,
			active: params.accountActive(entry),
			inactiveReason: typeof params.accountInactiveReason === "function" ? params.accountInactiveReason(entry) : params.accountInactiveReason,
			owner: createChannelAccountSecretOwner(params.channelKey, entry.accountId, params.channel, entry.account),
			apply: (value) => {
				target[params.field] = value;
			}
		});
	}
}
//#endregion
export { createChannelSecretContract as a, getChannelRecord as c, isBaseFieldActiveForChannelSurface as d, normalizeSecretStringValue as f, createChannelAccountSecretOwner as i, getChannelSurface as l, collectNestedChannelFieldAssignments as n, createChannelSecretTargetRegistryEntries as o, resolveChannelAccountSurface as p, collectSimpleChannelFieldAssignments as r, createSimpleChannelSecretContract as s, collectConditionalChannelFieldAssignments as t, hasConfiguredSecretInputValue as u };
