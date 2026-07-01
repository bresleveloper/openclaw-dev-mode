import { t as parseClawHubPluginSpec } from "./clawhub-spec-CzLwxQg_.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-C1h-FQFT.js";
import { l as resolveOfficialExternalPluginInstall, t as getOfficialExternalPluginCatalogEntry } from "./official-external-plugin-catalog-0lYbGRYY.js";
//#region src/plugins/official-external-install-records.ts
function resolveNpmSpecPackageName(spec) {
	return spec ? parseRegistryNpmSpec(spec)?.name : void 0;
}
function resolveClawHubSpecPackageName(spec) {
	return spec ? parseClawHubPluginSpec(spec)?.name : void 0;
}
function resolveOfficialPackageNames(params) {
	return [
		resolveClawHubSpecPackageName(params.clawhubSpec),
		resolveNpmSpecPackageName(params.npmSpec),
		params.entry.name
	].filter((value) => Boolean(value));
}
function resolveRecordedClawHubPackageNames(record) {
	return [record.clawhubPackage, resolveClawHubSpecPackageName(record.spec)].filter((value) => Boolean(value));
}
function isOfficialClawHubInstallRecord(record) {
	if (record.source !== "clawhub" || record.clawhubChannel !== "official") return false;
	return (record.clawhubUrl ?? "").replace(/\/+$/, "") === "https://clawhub.ai";
}
/** Resolves the official npm spec when an install record matches the trusted catalog package. */
function resolveTrustedSourceLinkedOfficialNpmSpec(params) {
	if (params.record.source !== "npm") return;
	const entry = getOfficialExternalPluginCatalogEntry(params.pluginId);
	if (!entry) return;
	const officialSpec = resolveOfficialExternalPluginInstall(entry)?.npmSpec;
	const officialPackageName = resolveNpmSpecPackageName(officialSpec);
	if (!officialSpec || !officialPackageName) return;
	return [
		params.record.resolvedName,
		resolveNpmSpecPackageName(params.record.spec),
		resolveNpmSpecPackageName(params.record.resolvedSpec)
	].filter((value) => Boolean(value)).includes(officialPackageName) ? officialSpec : void 0;
}
/** Resolves the official ClawHub spec when a trusted-source install record matches. */
function resolveTrustedSourceLinkedOfficialClawHubSpec(params) {
	return resolveTrustedSourceLinkedOfficialClawHubInstall(params)?.clawhubSpec;
}
/** Resolves official ClawHub/npm specs linked to a trusted-source install record. */
function resolveTrustedSourceLinkedOfficialClawHubInstall(params) {
	if (params.record.source !== "clawhub") return;
	const entry = getOfficialExternalPluginCatalogEntry(params.pluginId);
	if (!entry) return;
	const install = resolveOfficialExternalPluginInstall(entry);
	const officialClawHubSpec = install?.clawhubSpec;
	const officialNpmSpec = install?.npmSpec;
	const officialNames = resolveOfficialPackageNames({
		entry,
		npmSpec: officialNpmSpec,
		clawhubSpec: officialClawHubSpec
	});
	if (officialNames.length === 0) return;
	if (!resolveRecordedClawHubPackageNames(params.record).some((name) => officialNames.includes(name))) return;
	if (officialClawHubSpec || isOfficialClawHubInstallRecord(params.record)) return {
		...officialClawHubSpec ? { clawhubSpec: officialClawHubSpec } : {},
		...officialNpmSpec ? { npmSpec: officialNpmSpec } : {}
	};
}
//#endregion
export { resolveTrustedSourceLinkedOfficialClawHubSpec as n, resolveTrustedSourceLinkedOfficialNpmSpec as r, resolveTrustedSourceLinkedOfficialClawHubInstall as t };
