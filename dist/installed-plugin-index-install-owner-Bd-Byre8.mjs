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
function readInstalledPluginIndexInstallOwner(record) {
	const ownedRecord = record;
	return ownedRecord.installOwnerAmbiguous ? { ambiguous: true } : ownedRecord.installOwner ? { installOwner: ownedRecord.installOwner } : void 0;
}
function resolveInstalledPluginIndexInstallOwner(record) {
	return readInstalledPluginIndexInstallOwner(record)?.installOwner;
}
function isInstalledPluginIndexInstallOwnerAmbiguous(record) {
	return readInstalledPluginIndexInstallOwner(record)?.ambiguous === true;
}
//#endregion
export { recordInstalledPluginIndexInstallOwner as n, resolveInstalledPluginIndexInstallOwner as r, isInstalledPluginIndexInstallOwnerAmbiguous as t };
