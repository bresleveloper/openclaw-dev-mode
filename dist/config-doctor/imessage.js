import { E as normalizeChannelConfigEntries, L as isRecord, a as defineChannelAliasMigration } from "./runtime-doctor-migrations-Bq3PkBbD.js";
import "./string-coerce-runtime-D5jaFnkP.js";
//#region extensions/imessage/config-doctor-api.ts
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
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "imessage",
	streaming: {
		defaultMode: "partial",
		deliveryOnly: true
	}
});
const legacyConfigRules = [{
	path: ["channels", "imessage"],
	message: "disabled channels.imessage.catchup config is retired; iMessage now recovers via always-on inbound dedupe and a stale-backlog age fence. Run \"openclaw doctor --fix\" to remove disabled catchup blocks.",
	match: (value) => imessageEntryHasRetiredCatchup(value)
}, ...streamingAliasMigration.legacyConfigRules];
function normalizeCompatibilityConfig({ cfg }) {
	const catchup = normalizeChannelConfigEntries({
		cfg,
		channelId: "imessage",
		normalizeEntry: ({ entry, pathPrefix, changes }) => {
			if (!Object.hasOwn(entry, "catchup") || isEnabledCatchup(entry.catchup)) return {
				entry,
				changed: false
			};
			const next = { ...entry };
			delete next.catchup;
			changes.push(`Removed disabled retired ${pathPrefix}.catchup.`);
			return {
				entry: next,
				changed: true
			};
		}
	});
	return streamingAliasMigration.normalizeChannelConfig({
		cfg: catchup.config,
		changes: catchup.changes
	});
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
