import { t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-DczkVvPu.mjs";
import { t as readClawPackageOwnership } from "./provenance-async-Cos5k-UB.mjs";
//#region src/plugins/uninstall-claw-references.ts
function clawPackageRefMatchesPluginInstall(ref, pluginId, record) {
	if (ref.kind !== "plugin" || ref.source !== "clawhub" || record.source !== "clawhub") return false;
	return (record.clawhubPackage ?? parseClawHubPluginSpec(record.spec ?? "")?.name ?? pluginId) === ref.ref;
}
/** Explain Claw dependents without blocking the operator-owned uninstall. */
async function collectClawPluginUninstallWarnings(params) {
	const installRecord = params.installRecord;
	if (!installRecord || installRecord.source !== "clawhub") return [];
	let packageRefs;
	try {
		({packageRefs} = await readClawPackageOwnership(params.env ? { env: params.env } : {}));
	} catch (error) {
		return [`Could not inspect Claw references for plugin "${params.pluginId}": ${coerceErrorMessage(error)}`];
	}
	const refs = packageRefs.filter((ref) => ref.status !== "rolled_back" && clawPackageRefMatchesPluginInstall(ref, params.pluginId, installRecord));
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
