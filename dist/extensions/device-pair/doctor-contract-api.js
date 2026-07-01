import { a as DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES, d as notifySubscriberStoreKey, o as DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE, s as normalizeLegacyNotifyState, t as DEVICE_PAIR_NOTIFY_LEGACY_STATE_FILE } from "../../notify-state-dkwCaSZp.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/device-pair/doctor-contract-api.ts
function resolveLegacyNotifyStatePath(stateDir) {
	return path.join(stateDir, DEVICE_PAIR_NOTIFY_LEGACY_STATE_FILE);
}
async function fileExists(filePath) {
	try {
		return (await fs.stat(filePath)).isFile();
	} catch {
		return false;
	}
}
async function readLegacyNotifyState(filePath) {
	try {
		return normalizeLegacyNotifyState(JSON.parse(await fs.readFile(filePath, "utf8")));
	} catch {
		return null;
	}
}
async function archiveLegacySource(params) {
	const archivedPath = `${params.filePath}.migrated`;
	if (await fileExists(archivedPath)) {
		params.warnings.push(`Left migrated Device Pair notify-state source in place because ${archivedPath} already exists`);
		return;
	}
	try {
		await fs.rename(params.filePath, archivedPath);
		params.changes.push(`Archived Device Pair notify-state legacy source -> ${archivedPath}`);
	} catch (err) {
		params.warnings.push(`Failed archiving Device Pair notify-state legacy source: ${String(err)}`);
	}
}
const stateMigrations = [{
	id: "device-pair-notify-json-to-plugin-state",
	label: "Device Pair notify subscribers",
	async detectLegacyState(params) {
		const filePath = resolveLegacyNotifyStatePath(params.stateDir);
		const state = await readLegacyNotifyState(filePath);
		if (!state || state.subscribers.length === 0) return null;
		return { preview: [`- Device Pair notify subscribers: ${filePath} -> plugin state (${DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE}, ${state.subscribers.length} subscriber(s))`] };
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		const filePath = resolveLegacyNotifyStatePath(params.stateDir);
		const state = await readLegacyNotifyState(filePath);
		if (!state || state.subscribers.length === 0) return {
			changes,
			warnings
		};
		const store = params.context.openPluginStateKeyedStore({
			namespace: DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE,
			maxEntries: DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES
		});
		let imported = 0;
		let alreadyPresent = 0;
		for (const subscriber of state.subscribers) if (await store.registerIfAbsent(notifySubscriberStoreKey(subscriber), subscriber)) imported++;
		else alreadyPresent++;
		changes.push(`Migrated Device Pair notify subscribers -> plugin state (${imported} imported, ${alreadyPresent} already present)`);
		await archiveLegacySource({
			filePath,
			changes,
			warnings
		});
		return {
			changes,
			warnings
		};
	}
}];
//#endregion
export { stateMigrations };
