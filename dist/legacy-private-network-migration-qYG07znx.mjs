import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as mergeDeep } from "./deep-merge-CthyICF6.mjs";
import { i as resolveChannelAccountKey } from "./account-lookup-CVHGcV8B.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/channel-doctor-helpers.ts
/** Applies one channel-specific doctor migration to every object-shaped account. */
function normalizeChannelAccounts(params) {
	const rawAccounts = asNullableRecord(params.entry.accounts);
	if (!rawAccounts) return {
		entry: params.entry,
		changed: false
	};
	let changed = false;
	const accounts = { ...rawAccounts };
	for (const [accountId, value] of Object.entries(rawAccounts)) {
		const account = asNullableRecord(value);
		if (!account) continue;
		const normalized = params.normalizeAccount({
			account,
			accountId,
			pathPrefix: `${params.pathPrefix}.accounts.${accountId}`,
			changes: params.changes
		});
		if (normalized.changed) {
			accounts[accountId] = normalized.entry;
			changed = true;
		}
	}
	return changed ? {
		entry: {
			...params.entry,
			accounts
		},
		changed: true
	} : {
		entry: params.entry,
		changed: false
	};
}
/** Applies the same channel-specific doctor migration at root and account scope. */
function normalizeChannelConfigEntries(params) {
	const changes = params.changes ?? [];
	const channels = params.cfg.channels;
	const entry = asNullableRecord(channels?.[params.channelId]);
	if (!entry) return {
		config: params.cfg,
		changes
	};
	const channelPath = `channels.${params.channelId}`;
	const root = params.normalizeEntry({
		entry,
		pathPrefix: channelPath,
		changes
	});
	const accounts = normalizeChannelAccounts({
		entry: root.entry,
		pathPrefix: channelPath,
		changes,
		normalizeAccount: (accountParams) => params.normalizeEntry({
			entry: accountParams.account,
			accountId: accountParams.accountId,
			pathPrefix: accountParams.pathPrefix,
			changes: accountParams.changes
		})
	});
	if (!root.changed && !accounts.changed) return {
		config: params.cfg,
		changes
	};
	return {
		config: {
			...params.cfg,
			channels: {
				...channels,
				[params.channelId]: accounts.entry
			}
		},
		changes
	};
}
function stripRetiredKeys(params) {
	if (params.recursive && Array.isArray(params.value)) {
		let changed = false;
		const value = params.value.map((item, index) => {
			const stripped = stripRetiredKeys({
				...params,
				value: item,
				pathPrefix: `${params.pathPrefix}[${index}]`
			});
			changed = changed || stripped.changed;
			return stripped.value;
		});
		return {
			value: changed ? value : params.value,
			changed
		};
	}
	const record = asNullableRecord(params.value);
	if (!record) return {
		value: params.value,
		changed: false
	};
	let changed = false;
	const value = {};
	for (const [key, child] of Object.entries(record)) {
		if (params.keys.has(key)) {
			params.onRemove?.({
				key,
				pathPrefix: params.pathPrefix
			});
			changed = true;
			continue;
		}
		if (!params.recursive) {
			value[key] = child;
			continue;
		}
		const stripped = stripRetiredKeys({
			...params,
			value: child,
			pathPrefix: `${params.pathPrefix}.${key}`
		});
		changed = changed || stripped.changed;
		value[key] = stripped.value;
	}
	return {
		value: changed ? value : params.value,
		changed
	};
}
/** Removes retired keys recursively or from a channel root and its accounts. */
function stripRetiredChannelKeys(params) {
	const channels = params.cfg.channels;
	const entry = asNullableRecord(channels?.[params.channelId]);
	if (!entry) return {
		config: params.cfg,
		changed: false
	};
	const channelPath = `channels.${params.channelId}`;
	if (params.scope === "recursive") {
		const stripped = stripRetiredKeys({
			value: entry,
			keys: params.keys,
			pathPrefix: channelPath,
			recursive: true,
			onRemove: params.onRemove
		});
		return stripped.changed ? {
			config: {
				...params.cfg,
				channels: {
					...channels,
					[params.channelId]: stripped.value
				}
			},
			changed: true
		} : {
			config: params.cfg,
			changed: false
		};
	}
	const normalized = normalizeChannelConfigEntries({
		cfg: params.cfg,
		channelId: params.channelId,
		normalizeEntry: (entryParams) => {
			const stripped = stripRetiredKeys({
				value: entryParams.entry,
				keys: params.keys,
				pathPrefix: entryParams.pathPrefix,
				recursive: false,
				onRemove: params.onRemove
			});
			return {
				entry: stripped.value,
				changed: stripped.changed
			};
		}
	});
	return {
		config: normalized.config,
		changed: normalized.config !== params.cfg
	};
}
/** Materializes root/default-account inheritance after aliases create streaming. */
function materializeInheritedAccountStreaming(params) {
	const channels = params.cfg.channels;
	const entry = asNullableRecord(channels?.[params.channelId]);
	const accounts = asNullableRecord(entry?.accounts);
	if (!entry || !accounts) return params.cfg;
	const rootStreaming = asNullableRecord(entry.streaming);
	const defaultKey = resolveChannelAccountKey(accounts, "default", params.channelId, (key) => key.trim().toLowerCase());
	let changed = false;
	const nextAccounts = { ...accounts };
	const accountIds = Object.keys(accounts).toSorted((left, right) => left === defaultKey ? -1 : right === defaultKey ? 1 : left.localeCompare(right));
	for (const accountId of accountIds) {
		if (asNullableRecord(params.accountsBefore?.[accountId])?.streaming !== void 0) continue;
		const account = asNullableRecord(nextAccounts[accountId]);
		const created = asNullableRecord(account?.streaming);
		if (!account || !created) continue;
		const defaultStreaming = defaultKey ? asNullableRecord(asNullableRecord(nextAccounts[defaultKey])?.streaming) : null;
		const inherited = accountId === defaultKey ? rootStreaming : defaultStreaming ?? rootStreaming;
		if (!inherited) continue;
		const materialized = asNullableRecord(mergeDeep(inherited, created));
		if (!materialized || isDeepStrictEqual(materialized, created)) continue;
		nextAccounts[accountId] = {
			...account,
			streaming: materialized
		};
		changed = true;
		const sourcePath = accountId !== defaultKey && defaultKey && defaultStreaming ? `channels.${params.channelId}.accounts.${defaultKey}.streaming` : `channels.${params.channelId}.streaming`;
		params.changes.push(`Copied ${sourcePath} into channels.${params.channelId}.accounts.${accountId}.streaming to keep inherited settings while migrating flat streaming keys.`);
	}
	return changed ? {
		...params.cfg,
		channels: {
			...channels,
			[params.channelId]: {
				...entry,
				accounts: nextAccounts
			}
		}
	} : params.cfg;
}
//#endregion
//#region src/config/legacy-private-network-migration.ts
/** Detects the retired flat `allowPrivateNetwork` key before doctor migration. */
function hasLegacyFlatAllowPrivateNetworkAlias(value) {
	const entry = asNullableRecord(value);
	return Boolean(entry && Object.hasOwn(entry, "allowPrivateNetwork"));
}
/** Moves flat private-network config into `network.dangerouslyAllowPrivateNetwork`. */
function migrateLegacyFlatAllowPrivateNetworkAlias(params) {
	if (!hasLegacyFlatAllowPrivateNetworkAlias(params.entry)) return {
		entry: params.entry,
		changed: false
	};
	const legacyAllowPrivateNetwork = params.entry.allowPrivateNetwork;
	const currentNetworkRecord = asNullableRecord(params.entry.network);
	const currentNetwork = currentNetworkRecord ? { ...currentNetworkRecord } : {};
	const currentDangerousAllowPrivateNetwork = currentNetwork.dangerouslyAllowPrivateNetwork;
	let resolvedDangerousAllowPrivateNetwork = currentDangerousAllowPrivateNetwork;
	if (typeof currentDangerousAllowPrivateNetwork === "boolean") resolvedDangerousAllowPrivateNetwork = currentDangerousAllowPrivateNetwork;
	else if (typeof legacyAllowPrivateNetwork === "boolean") resolvedDangerousAllowPrivateNetwork = legacyAllowPrivateNetwork;
	else if (currentDangerousAllowPrivateNetwork === void 0) resolvedDangerousAllowPrivateNetwork = legacyAllowPrivateNetwork;
	delete currentNetwork.dangerouslyAllowPrivateNetwork;
	if (resolvedDangerousAllowPrivateNetwork !== void 0) currentNetwork.dangerouslyAllowPrivateNetwork = resolvedDangerousAllowPrivateNetwork;
	const nextEntry = { ...params.entry };
	delete nextEntry.allowPrivateNetwork;
	if (Object.keys(currentNetwork).length > 0) nextEntry.network = currentNetwork;
	else delete nextEntry.network;
	params.changes.push(`Moved ${params.pathPrefix}.allowPrivateNetwork → ${params.pathPrefix}.network.dangerouslyAllowPrivateNetwork (${String(resolvedDangerousAllowPrivateNetwork)}).`);
	return {
		entry: nextEntry,
		changed: true
	};
}
function hasLegacyAllowPrivateNetworkInAccounts(value) {
	const accounts = asNullableRecord(value);
	return Boolean(accounts && Object.values(accounts).some((account) => hasLegacyFlatAllowPrivateNetworkAlias(asNullableRecord(account) ?? {})));
}
/** Build doctor rules that migrate legacy private-network aliases for one channel config. */
function createLegacyPrivateNetworkDoctorContract(params) {
	const pathPrefix = `channels.${params.channelKey}`;
	return {
		legacyConfigRules: [{
			path: ["channels", params.channelKey],
			message: `${pathPrefix}.allowPrivateNetwork is legacy; use ${pathPrefix}.network.dangerouslyAllowPrivateNetwork instead. Run "openclaw doctor --fix".`,
			match: (value) => hasLegacyFlatAllowPrivateNetworkAlias(asNullableRecord(value) ?? {})
		}, {
			path: [
				"channels",
				params.channelKey,
				"accounts"
			],
			message: `${pathPrefix}.accounts.<id>.allowPrivateNetwork is legacy; use ${pathPrefix}.accounts.<id>.network.dangerouslyAllowPrivateNetwork instead. Run "openclaw doctor --fix".`,
			match: hasLegacyAllowPrivateNetworkInAccounts
		}],
		normalizeCompatibilityConfig: ({ cfg }) => {
			if (!asNullableRecord(cfg.channels)) return {
				config: cfg,
				changes: []
			};
			return normalizeChannelConfigEntries({
				cfg,
				channelId: params.channelKey,
				normalizeEntry: migrateLegacyFlatAllowPrivateNetworkAlias
			});
		}
	};
}
//#endregion
export { normalizeChannelAccounts as a, materializeInheritedAccountStreaming as i, hasLegacyFlatAllowPrivateNetworkAlias as n, normalizeChannelConfigEntries as o, migrateLegacyFlatAllowPrivateNetworkAlias as r, stripRetiredChannelKeys as s, createLegacyPrivateNetworkDoctorContract as t };
