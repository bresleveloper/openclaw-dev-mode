import { o as parseRegistryNpmSpec } from "./npm-registry-spec-CjcsDXUg.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-r-Sm6wpn.mjs";
import { _ as resolveOfficialExternalPluginLegacyNpmPackageNames, g as resolveOfficialExternalPluginLegacyIds, i as getOfficialExternalPluginCatalogEntryForPackage, p as resolveOfficialExternalPluginInstall, r as getOfficialExternalPluginCatalogEntry } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { h as resolveOfficialExternalPluginId } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
//#region src/plugins/official-external-install-records.ts
function resolveNpmSpecPackageName(spec) {
	return spec ? parseRegistryNpmSpec(spec)?.name : void 0;
}
function resolveClawHubSpecPackageName(spec) {
	return spec ? parseClawHubPluginSpec(spec)?.name : void 0;
}
function resolveExactNpmPackageName(value) {
	const packageName = resolveNpmSpecPackageName(value);
	return packageName && value.trim() === packageName ? packageName : void 0;
}
function resolveUnanimousRecordedNpmPackageName(record) {
	if (record.source !== "npm") return;
	const packageNames = [];
	const fields = [
		[record.spec, resolveNpmSpecPackageName],
		[record.resolvedName, resolveExactNpmPackageName],
		[record.resolvedSpec, resolveNpmSpecPackageName]
	];
	for (const [value, resolvePackageName] of fields) {
		if (value === void 0) continue;
		const packageName = resolvePackageName(value);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	return packageNames.length > 0 && new Set(packageNames).size === 1 ? packageNames[0] : void 0;
}
function hasTrustedOfficialNpmProvenance(record) {
	return record.source === "npm" && record.artifactKind === void 0 && record.sourcePath === void 0;
}
function resolveOfficialPackageNames(params) {
	return [
		resolveClawHubSpecPackageName(params.clawhubSpec),
		resolveNpmSpecPackageName(params.npmSpec),
		params.entry.name
	].filter((value) => Boolean(value));
}
function resolveRecordedClawHubPackageNames(record) {
	const packageNames = [];
	if (record.clawhubPackage !== void 0) {
		const packageName = resolveExactNpmPackageName(record.clawhubPackage);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	if (record.spec !== void 0) {
		const packageName = resolveClawHubSpecPackageName(record.spec);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	if (record.resolvedSpec !== void 0) {
		const packageName = resolveClawHubSpecPackageName(record.resolvedSpec) ?? resolveNpmSpecPackageName(record.resolvedSpec);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	if (record.resolvedName !== void 0) {
		const packageName = resolveExactNpmPackageName(record.resolvedName);
		if (!packageName) return;
		packageNames.push(packageName);
	}
	return packageNames;
}
function isOfficialClawHubInstallRecord(record) {
	if (record.source !== "clawhub" || record.clawhubChannel !== "official") return false;
	return (record.clawhubUrl ?? "").trim().replace(/\/+$/, "") === "https://clawhub.ai";
}
/** Resolves one package identity from a current trusted official ClawHub install record. */
function resolveTrustedOfficialClawHubPackageName(record) {
	if (!isOfficialClawHubInstallRecord(record)) return;
	const packageNames = resolveRecordedClawHubPackageNames(record);
	if (!packageNames || packageNames.length === 0 || new Set(packageNames).size !== 1) return;
	return packageNames[0];
}
/** Binds official trust to the actual package and consistent recorded source identity. */
function isTrustedOfficialPluginInstallRecord(params) {
	const packageName = params.packageName?.trim();
	const entry = packageName ? getOfficialExternalPluginCatalogEntryForPackage(packageName) : void 0;
	if (!entry || resolveOfficialExternalPluginId(entry) !== params.pluginId && !resolveOfficialExternalPluginLegacyIds(entry).includes(params.pluginId)) return false;
	const install = resolveOfficialExternalPluginInstall(entry);
	const record = params.record;
	if (record.source === "npm") return hasTrustedOfficialNpmProvenance(record) && resolveNpmSpecPackageName(install?.npmSpec) === packageName && resolveUnanimousRecordedNpmPackageName(record) === packageName && (record.clawhubPackage === void 0 || resolveExactNpmPackageName(record.clawhubPackage) === packageName);
	return Boolean(install?.clawhubSpec || install?.npmSpec) && (record.clawhubPackage !== void 0 || record.spec !== void 0) && resolveTrustedOfficialClawHubPackageName(record) === packageName;
}
function hasTrustedClawHubSourceAuthority(record, officialClawHubSpec) {
	if (record.clawhubUrl !== void 0 || record.clawhubChannel !== void 0) return isOfficialClawHubInstallRecord(record);
	return Boolean(officialClawHubSpec && record.spec && resolveClawHubSpecPackageName(record.spec) === resolveClawHubSpecPackageName(officialClawHubSpec));
}
function resolveOfficialNpmInstallIdentity(params) {
	const canonicalPluginId = resolveOfficialExternalPluginId(params.entry);
	const pluginId = canonicalPluginId && canonicalPluginId !== params.requestPluginId ? canonicalPluginId : params.requestPluginId;
	return {
		...params.expectedIntegrity ? { expectedIntegrity: params.expectedIntegrity } : {},
		npmSpec: params.npmSpec,
		pluginId,
		...pluginId !== params.requestPluginId ? { replacementPluginId: pluginId } : {},
		...params.replaceNpmPackage ? { replaceNpmPackage: true } : {}
	};
}
/** True when the expected id is a catalog lookup alias for the replacement plugin. */
function isOfficialCatalogLookupPluginIdReplacement(params) {
	if (params.expectedPluginId === params.expectedReplacementPluginId) return false;
	const entry = getOfficialExternalPluginCatalogEntry(params.expectedPluginId);
	return Boolean(entry && resolveOfficialExternalPluginId(entry) === params.expectedReplacementPluginId);
}
/** True when a lookup alias can be dropped because the canonical record is trusted official. */
function isTrustedOfficialCatalogLookupDuplicate(params) {
	if (!params.replacementRecord || !isOfficialCatalogLookupPluginIdReplacement({
		expectedPluginId: params.pluginId,
		expectedReplacementPluginId: params.replacementPluginId
	})) return false;
	const canonicalEntry = getOfficialExternalPluginCatalogEntry(params.replacementPluginId);
	const officialPackageName = resolveNpmSpecPackageName(canonicalEntry ? resolveOfficialExternalPluginInstall(canonicalEntry)?.npmSpec : void 0);
	return Boolean(officialPackageName && isTrustedOfficialPluginInstallRecord({
		pluginId: params.replacementPluginId,
		packageName: officialPackageName,
		record: params.replacementRecord
	}));
}
/** Resolves exact package-bound official npm identity and any declared id migration. */
function resolveTrustedSourceLinkedOfficialNpmInstall(params) {
	if (!hasTrustedOfficialNpmProvenance(params.record)) return;
	const canonicalEntry = getOfficialExternalPluginCatalogEntry(params.pluginId);
	if (canonicalEntry) {
		const officialInstall = resolveOfficialExternalPluginInstall(canonicalEntry);
		const officialSpec = officialInstall?.npmSpec;
		const packageName = resolveNpmSpecPackageName(officialSpec);
		const recordedPackageNames = [
			params.record.resolvedName,
			resolveNpmSpecPackageName(params.record.spec),
			resolveNpmSpecPackageName(params.record.resolvedSpec)
		].filter((value) => Boolean(value));
		if (officialSpec && packageName && recordedPackageNames.includes(packageName)) return resolveOfficialNpmInstallIdentity({
			requestPluginId: params.pluginId,
			entry: canonicalEntry,
			expectedIntegrity: officialInstall.expectedIntegrity,
			npmSpec: officialSpec
		});
		const recordedPackageName = resolveUnanimousRecordedNpmPackageName(params.record);
		if (officialSpec && recordedPackageName && resolveOfficialExternalPluginLegacyNpmPackageNames(canonicalEntry).includes(recordedPackageName)) return resolveOfficialNpmInstallIdentity({
			requestPluginId: params.pluginId,
			entry: canonicalEntry,
			expectedIntegrity: officialInstall.expectedIntegrity,
			npmSpec: officialSpec,
			replaceNpmPackage: true
		});
	}
	const packageName = resolveUnanimousRecordedNpmPackageName(params.record);
	const entry = packageName ? getOfficialExternalPluginCatalogEntryForPackage(packageName) : void 0;
	if (!entry) return;
	const officialInstall = resolveOfficialExternalPluginInstall(entry);
	const officialSpec = officialInstall?.npmSpec;
	const officialPackageName = resolveNpmSpecPackageName(officialSpec);
	const canonicalPluginId = resolveOfficialExternalPluginId(entry);
	if (!packageName || !officialSpec || officialPackageName !== packageName || !canonicalPluginId || params.pluginId === canonicalPluginId || !resolveOfficialExternalPluginLegacyIds(entry).includes(params.pluginId)) return;
	return resolveOfficialNpmInstallIdentity({
		requestPluginId: params.pluginId,
		entry,
		expectedIntegrity: officialInstall.expectedIntegrity,
		npmSpec: officialSpec
	});
}
/** Resolves the official npm spec when an install record matches the trusted catalog package. */
function resolveTrustedSourceLinkedOfficialNpmSpec(params) {
	return resolveTrustedSourceLinkedOfficialNpmInstall(params)?.npmSpec;
}
function hasOfficialNpmIdReplacement(params) {
	return params.record !== void 0 && resolveTrustedSourceLinkedOfficialNpmInstall({
		pluginId: params.pluginId,
		record: params.record
	})?.replacementPluginId !== void 0;
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
	if (!officialClawHubSpec && !officialNpmSpec) return;
	const officialNames = resolveOfficialPackageNames({
		entry,
		npmSpec: officialNpmSpec,
		clawhubSpec: officialClawHubSpec
	});
	if (officialNames.length === 0) return;
	if (params.record.clawhubPackage === void 0 && params.record.spec === void 0) return;
	const recordedPackageNames = resolveRecordedClawHubPackageNames(params.record);
	if (!hasTrustedClawHubSourceAuthority(params.record, officialClawHubSpec) || !recordedPackageNames || recordedPackageNames.length === 0 || !recordedPackageNames.every((name) => officialNames.includes(name))) return;
	return {
		...officialClawHubSpec ? { clawhubSpec: officialClawHubSpec } : {},
		...officialNpmSpec ? { npmSpec: officialNpmSpec } : {}
	};
}
//#endregion
export { resolveTrustedOfficialClawHubPackageName as a, resolveTrustedSourceLinkedOfficialNpmInstall as c, isTrustedOfficialPluginInstallRecord as i, resolveTrustedSourceLinkedOfficialNpmSpec as l, isOfficialCatalogLookupPluginIdReplacement as n, resolveTrustedSourceLinkedOfficialClawHubInstall as o, isTrustedOfficialCatalogLookupDuplicate as r, resolveTrustedSourceLinkedOfficialClawHubSpec as s, hasOfficialNpmIdReplacement as t };
