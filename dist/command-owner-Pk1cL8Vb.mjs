import { l as readConfigFileSnapshotForWrite } from "./io.runtime-Ds5uC0Bf.mjs";
import { r as replaceConfigFile } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import { i as hasConfiguredCommandOwners, n as formatCommandOwnerFromChannelSender } from "./doctor-command-owner-DAqinR9q.mjs";
//#region src/pairing/command-owner.ts
/** Adds the approved sender as command owner only when no owner exists yet. */
async function bootstrapCommandOwnerFromPairing(params) {
	const ownerEntry = formatCommandOwnerFromChannelSender(params);
	if (!ownerEntry) return {
		ownerEntry: null,
		status: "unavailable"
	};
	const { snapshot, writeOptions } = await readConfigFileSnapshotForWrite();
	if (hasConfiguredCommandOwners(snapshot.sourceConfig)) return {
		ownerEntry,
		status: "already-configured"
	};
	const nextConfig = structuredClone(snapshot.sourceConfig);
	nextConfig.commands = {
		...nextConfig.commands,
		ownerAllowFrom: [ownerEntry]
	};
	await replaceConfigFile({
		sourceConfig: nextConfig,
		snapshot,
		writeOptions,
		afterWrite: { mode: "auto" }
	});
	return {
		ownerEntry,
		status: "configured"
	};
}
//#endregion
export { bootstrapCommandOwnerFromPairing as t };
