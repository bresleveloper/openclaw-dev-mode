import { t as parseClawHubPluginSpec } from "./clawhub-spec-r-Sm6wpn.mjs";
import { c as readClawPackageRefs } from "./provenance-CFChXfcP.mjs";
//#region src/plugins/uninstall-claw-references.ts
function clawPackageRefMatchesPluginInstall(ref, pluginId, record) {
	if (ref.kind !== "plugin" || ref.source !== "clawhub" || record.source !== "clawhub") return false;
	return (record.clawhubPackage ?? parseClawHubPluginSpec(record.spec ?? "")?.name ?? pluginId) === ref.ref;
}
/** Explain Claw dependents without blocking the operator-owned uninstall. */
function collectClawPluginUninstallWarnings(params) {
	const installRecord = params.installRecord;
	if (!installRecord || installRecord.source !== "clawhub") return [];
	const refs = readClawPackageRefs({
		kind: "plugin",
		source: "clawhub",
		...params.env ? { env: params.env } : {}
	}).filter((ref) => ref.status !== "rolled_back" && clawPackageRefMatchesPluginInstall(ref, params.pluginId, installRecord));
	const clawIds = [...new Set(refs.map((ref) => ref.clawName))].toSorted();
	if (clawIds.length === 0) return [];
	const installedVersion = installRecord.resolvedVersion ?? installRecord.version;
	const expectedVersions = [...new Set(refs.map((ref) => ref.version))].toSorted();
	const drifted = installedVersion !== void 0 && expectedVersions.some((version) => version !== installedVersion);
	const warnings = [`Warning: plugin "${params.pluginId}" is referenced by Claw${clawIds.length === 1 ? "" : "s"}: ${clawIds.join(", ")}.`];
	if (drifted) warnings.push(`Installed version ${installedVersion} differs from the Claw reference${expectedVersions.length === 1 ? "" : "s"} ${expectedVersions.join(", ")}.`);
	warnings.push("Uninstalling it may break those Claws until the plugin is reinstalled or the Claws are updated.");
	return warnings;
}
//#endregion
export { collectClawPluginUninstallWarnings as t };
