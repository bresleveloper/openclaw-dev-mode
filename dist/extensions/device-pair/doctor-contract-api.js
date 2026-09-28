import { r as defineLegacyJsonStateMigration } from "../../runtime-doctor-migrations-_pMXigSc.mjs";
import { a as DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES, o as DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE, s as normalizeLegacyNotifyState, t as DEVICE_PAIR_NOTIFY_LEGACY_STATE_FILE, u as notifySubscriberStoreKey } from "../../notify-state-DpT3-FEN.mjs";
import path from "node:path";
//#region extensions/device-pair/doctor-contract-api.ts
function resolveLegacyNotifyStatePath(stateDir) {
	return path.join(stateDir, DEVICE_PAIR_NOTIFY_LEGACY_STATE_FILE);
}
const stateMigrations = [defineLegacyJsonStateMigration({
	id: "device-pair-notify-json-to-plugin-state",
	label: "Device Pair notify subscribers",
	resolvePath: resolveLegacyNotifyStatePath,
	parse: normalizeLegacyNotifyState,
	namespace: DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE,
	maxEntries: DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES,
	capacityPrecheck: { warning: ({ available, missing }) => `Skipped Device Pair notify subscriber migration because plugin state has room for ${available} of ${missing} missing entries; left legacy source in place` },
	archiveLabel: "Device Pair notify-state",
	describeEntries: (state, { filePath }) => ({
		preview: [`- Device Pair notify subscribers: ${filePath} -> plugin state (${DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE}, ${state.subscribers.length} subscriber(s))`],
		change: ({ imported, alreadyPresent }) => `Migrated Device Pair notify subscribers -> plugin state (${imported} imported, ${alreadyPresent} already present)`
	}),
	toRows: (state) => state.subscribers.map((subscriber) => ({
		key: notifySubscriberStoreKey(subscriber),
		value: subscriber
	}))
})];
//#endregion
export { stateMigrations };
