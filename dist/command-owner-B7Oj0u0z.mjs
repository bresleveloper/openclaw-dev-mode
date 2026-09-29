import { u as readConfigFileSnapshotForWrite } from "./io.runtime-BN-rPaec.mjs";
import { r as replaceConfigFile } from "./mutate-CDIHLSip.mjs";
import "./config-Ciq2mxdN.mjs";
import { r as hasConfiguredCommandOwners, t as formatCommandOwnerFromChannelSender } from "./doctor-command-owner-C0KlUKKP.mjs";
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
