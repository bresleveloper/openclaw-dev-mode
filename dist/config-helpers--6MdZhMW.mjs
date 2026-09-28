import "./session-key-CBvmC8zz.mjs";
import "./account-id-B1bfbA5J.mjs";
import { i as resolveChannelAccountKey, n as resolveAccountKey } from "./account-lookup-CVHGcV8B.mjs";
//#region src/channels/plugins/config-helpers.ts
/** Replace one section; undefined removes it and prunes an empty channels object. */
function writeChannelSection(cfg, channelKey, section) {
	if (section !== void 0) return {
		...cfg,
		channels: {
			...cfg.channels,
			[channelKey]: section
		}
	};
	const channels = { ...cfg.channels };
	delete channels[channelKey];
	const next = { ...cfg };
	if (Object.keys(channels).length > 0) next.channels = channels;
	else delete next.channels;
	return next;
}
function setTopLevelChannelEnabledInConfigSection(params) {
	return writeChannelSection(params.cfg, params.sectionKey, {
		...params.cfg.channels?.[params.sectionKey],
		enabled: params.enabled
	});
}
function clearTopLevelChannelConfigFields(params) {
	const section = params.cfg.channels?.[params.sectionKey];
	if (!section) return params.cfg;
	const nextSection = { ...section };
	for (const field of params.clearBaseFields) delete nextSection[field];
	return writeChannelSection(params.cfg, params.sectionKey, nextSection);
}
function isConfiguredSecretValue(value) {
	if (typeof value === "string") return value.trim().length > 0;
	return Boolean(value);
}
/**
* Updates an account enabled flag in a channel config section.
*/
function setAccountEnabledInConfigSection(params) {
	const accountId = params.accountId || "default";
	const base = params.cfg.channels?.[params.sectionKey];
	const storedAccountKey = resolveChannelAccountKey(base?.accounts, accountId, params.sectionKey, (id) => id, params.accountKeyPolicy, { allowMissing: true });
	const hasAccounts = Boolean(base?.accounts);
	if (params.allowTopLevel && storedAccountKey === "default" && !hasAccounts) return setTopLevelChannelEnabledInConfigSection(params);
	const baseAccounts = base?.accounts ?? {};
	const existing = baseAccounts[storedAccountKey] ?? {};
	return writeChannelSection(params.cfg, params.sectionKey, {
		...base,
		accounts: {
			...baseAccounts,
			[storedAccountKey]: {
				...existing,
				enabled: params.enabled
			}
		}
	});
}
/**
* Deletes one account from a channel config section, pruning empty channel/accounts objects.
*/
function deleteAccountFromConfigSection(params) {
	const accountId = params.accountId || "default";
	const base = params.cfg.channels?.[params.sectionKey];
	const storedAccountKey = resolveChannelAccountKey(base?.accounts, accountId, params.sectionKey, (id) => id, params.accountKeyPolicy);
	if (!base) return params.cfg;
	const accounts = base.accounts && typeof base.accounts === "object" ? { ...base.accounts } : {};
	if (accountId === "default" && Object.keys(accounts).length === 0) return writeChannelSection(params.cfg, params.sectionKey, void 0);
	if (storedAccountKey !== void 0) {
		delete accounts[storedAccountKey];
		const remainingKey = resolveChannelAccountKey(accounts, accountId, params.sectionKey, (id) => id, params.accountKeyPolicy);
		if (remainingKey !== void 0) throw new Error(`Cannot delete account "${accountId}": stored keys "${storedAccountKey}" and "${remainingKey}" resolve to the same account. Resolve the collision before deleting.`);
	}
	const baseRecord = { ...base };
	if (accountId === "default") {
		for (const field of params.clearBaseFields ?? []) if (field in baseRecord) baseRecord[field] = void 0;
	}
	return writeChannelSection(params.cfg, params.sectionKey, {
		...baseRecord,
		accounts: Object.keys(accounts).length ? accounts : void 0
	});
}
/**
* Clears selected fields from one account entry and reports whether configured data was removed.
*/
function clearAccountEntryFields(params) {
	const accountId = params.accountId || "default";
	const accountKey = params.channelId ? resolveChannelAccountKey(params.accounts, accountId, params.channelId, (id) => id, params.accountKeyPolicy) : resolveAccountKey(params.accounts, accountId, (id) => id, params.accountKeyPolicy);
	const baseAccounts = params.accounts && typeof params.accounts === "object" ? { ...params.accounts } : void 0;
	if (!baseAccounts || accountKey === void 0) return {
		nextAccounts: baseAccounts,
		changed: false,
		cleared: false
	};
	const entry = baseAccounts[accountKey];
	if (!entry || typeof entry !== "object") return {
		nextAccounts: baseAccounts,
		changed: false,
		cleared: false
	};
	const nextEntry = { ...entry };
	if (!params.fields.some((field) => field in nextEntry)) return {
		nextAccounts: baseAccounts,
		changed: false,
		cleared: false
	};
	const isValueSet = params.isValueSet ?? isConfiguredSecretValue;
	let cleared = Boolean(params.markClearedOnFieldPresence);
	for (const field of params.fields) {
		if (!(field in nextEntry)) continue;
		if (isValueSet(nextEntry[field])) cleared = true;
		delete nextEntry[field];
	}
	if (Object.keys(nextEntry).length === 0) delete baseAccounts[accountKey];
	else baseAccounts[accountKey] = nextEntry;
	return {
		nextAccounts: Object.keys(baseAccounts).length > 0 ? baseAccounts : void 0,
		changed: true,
		cleared
	};
}
/** Clear plugin-selected account fields and prune only the config branches changed by cleanup. */
function clearAccountFieldsFromConfigSection(params) {
	const nextSection = { ...params.cfg.channels?.[params.sectionKey] };
	const clearedRoot = params.accountId === "default" && params.fields.some((field) => Boolean(nextSection[field]));
	if (clearedRoot) for (const field of params.fields) delete nextSection[field];
	const accountCleanup = clearAccountEntryFields({
		accounts: nextSection.accounts,
		channelId: params.sectionKey,
		accountKeyPolicy: params.accountKeyPolicy,
		accountId: params.accountId,
		fields: params.fields,
		markClearedOnFieldPresence: params.markClearedOnFieldPresence
	});
	if (!clearedRoot && !accountCleanup.changed) return {
		nextConfig: params.cfg,
		changed: false,
		cleared: false
	};
	if (accountCleanup.changed) {
		if (accountCleanup.nextAccounts) nextSection.accounts = accountCleanup.nextAccounts;
		else delete nextSection.accounts;
	}
	return {
		nextConfig: writeChannelSection(params.cfg, params.sectionKey, Object.keys(nextSection).length > 0 ? nextSection : void 0),
		changed: true,
		cleared: clearedRoot || accountCleanup.cleared
	};
}
//#endregion
export { setAccountEnabledInConfigSection as a, deleteAccountFromConfigSection as i, clearAccountFieldsFromConfigSection as n, setTopLevelChannelEnabledInConfigSection as o, clearTopLevelChannelConfigFields as r, writeChannelSection as s, clearAccountEntryFields as t };
