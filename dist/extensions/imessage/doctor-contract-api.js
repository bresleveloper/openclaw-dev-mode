//#region extensions/imessage/doctor-contract-api.ts
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isEnabledCatchup(value) {
	return isRecord(value) && value.enabled === true;
}
function imessageEntryHasRetiredCatchup(entry) {
	if (!isRecord(entry)) return false;
	if (Object.hasOwn(entry, "catchup") && !isEnabledCatchup(entry.catchup)) return true;
	const accounts = entry.accounts;
	if (!isRecord(accounts)) return false;
	return Object.values(accounts).some((account) => isRecord(account) && Object.hasOwn(account, "catchup") && !isEnabledCatchup(account.catchup));
}
const legacyConfigRules = [{
	path: ["channels", "imessage"],
	message: "disabled channels.imessage.catchup config is retired; iMessage now recovers via always-on inbound dedupe and a stale-backlog age fence. Run \"openclaw doctor --fix\" to remove disabled catchup blocks.",
	match: (value) => imessageEntryHasRetiredCatchup(value)
}];
function normalizeCompatibilityConfig({ cfg }) {
	const channels = cfg.channels;
	const imessage = channels?.imessage;
	if (!imessageEntryHasRetiredCatchup(imessage) || !isRecord(imessage)) return {
		config: cfg,
		changes: []
	};
	const changes = [];
	const nextImessage = { ...imessage };
	if (Object.hasOwn(nextImessage, "catchup") && !isEnabledCatchup(nextImessage.catchup)) {
		delete nextImessage.catchup;
		changes.push("Removed disabled retired channels.imessage.catchup.");
	}
	if (isRecord(nextImessage.accounts)) {
		let accountsChanged = false;
		const nextAccounts = { ...nextImessage.accounts };
		for (const [id, account] of Object.entries(nextImessage.accounts)) if (isRecord(account) && Object.hasOwn(account, "catchup") && !isEnabledCatchup(account.catchup)) {
			const nextAccount = { ...account };
			delete nextAccount.catchup;
			nextAccounts[id] = nextAccount;
			accountsChanged = true;
			changes.push(`Removed disabled retired channels.imessage.accounts.${id}.catchup.`);
		}
		if (accountsChanged) nextImessage.accounts = nextAccounts;
	}
	return {
		config: {
			...cfg,
			channels: {
				...channels,
				imessage: nextImessage
			}
		},
		changes
	};
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
