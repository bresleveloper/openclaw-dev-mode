//#region src/plugins/installed-plugin-index-install-owner.ts
function recordInstalledPluginIndexInstallOwner(record, installOwner, ambiguous = false) {
	if (!installOwner && !ambiguous) return record;
	const ownedRecord = record;
	if (ambiguous) {
		delete ownedRecord.installOwner;
		ownedRecord.installOwnerAmbiguous = true;
	} else {
		ownedRecord.installOwner = installOwner;
		delete ownedRecord.installOwnerAmbiguous;
	}
	return record;
}
function resolveInstalledPluginIndexInstallOwner(record) {
	const ownedRecord = record;
	return ownedRecord.installOwnerAmbiguous ? void 0 : ownedRecord.installOwner || void 0;
}
function isInstalledPluginIndexInstallOwnerAmbiguous(record) {
	return Boolean(record.installOwnerAmbiguous);
}
//#endregion
export { recordInstalledPluginIndexInstallOwner as n, resolveInstalledPluginIndexInstallOwner as r, isInstalledPluginIndexInstallOwnerAmbiguous as t };
