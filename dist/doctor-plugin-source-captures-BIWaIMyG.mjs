import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { n as formatBytes } from "./doctor-disk-space-CmHEswFS.mjs";
import { t as inspectOtherOpenClawProcesses } from "./openclaw-process-census-Cih9WFgf.mjs";
import { n as pruneLegacyPluginSourceCaptures, r as pruneUnreferencedPluginNativeCaptures, t as inspectLegacyPluginSourceCaptureRoots } from "./plugin-source-capture-report-CiAOeB5t.mjs";
import { t as inspectDoctorTemporaryDirectories } from "./temporary-directories-DfWQj_4a.mjs";
//#region src/commands/doctor-plugin-source-captures.ts
async function noteLegacyPluginSourceCaptures(env, shouldRepair = false) {
	const { directories, warnings } = await inspectDoctorTemporaryDirectories(env);
	const report = await inspectLegacyPluginSourceCaptureRoots(resolveStateDir(env), directories);
	warnings.push(...report.warnings);
	const lines = [];
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	const assertCurrent = () => {
		if (!maintenance?.ownsSchemaMaintenance) throw new Error("Doctor does not hold Gateway maintenance; captures were preserved.");
		maintenance.assertAdmission();
	};
	const assertLegacyUnowned = () => {
		assertCurrent();
		const census = inspectOtherOpenClawProcesses();
		if ("error" in census) throw new Error(census.error);
		if (census.pids.length > 0) throw new Error(`Other OpenClaw processes are still running (PIDs: ${census.pids.join(", ")}).`);
		assertCurrent();
	};
	if (report.roots.length > 0) {
		lines.push(`${report.roots.length} legacy plugin capture root(s), ${formatBytes(report.totalBytes)} in known regular files.`, ...report.roots.map((root) => `- ${quoteCliArg(root.path)} (${formatBytes(root.bytes)})`), "They will be reclaimed at the next maintenance.");
		if (shouldRepair) {
			const result = await pruneLegacyPluginSourceCaptures(report, assertLegacyUnowned);
			if (result.removed.length > 0) lines.push(`Removed ${result.removed.length} legacy plugin capture root(s), ${formatBytes(result.removed.reduce((bytes, root) => bytes + root.bytes, 0))}.`, ...result.removed.map((root) => `Removed ${quoteCliArg(root.path)} (${formatBytes(root.bytes)}).`));
			if (result.blockedReason) lines.push(`Legacy capture cleanup skipped: ${result.blockedReason}`);
			lines.push(...result.skipped.map((root) => `Kept ${quoteCliArg(root.path)}: ${root.reason}.`));
			warnings.push(...result.warnings);
		}
	}
	if (shouldRepair) {
		const native = await pruneUnreferencedPluginNativeCaptures(resolveStateDir(env), assertCurrent, env);
		if (native.removed.length > 0) lines.push(`Removed ${native.removed.length} unreferenced native plugin capture root(s).`);
		warnings.push(...native.warnings);
	}
	if (warnings.length > 0) lines.push("Legacy capture inspection or cleanup was incomplete; sizes may be partial.", ...warnings);
	if (lines.length > 0) note(lines.join("\n"), "Legacy plugin captures");
}
//#endregion
export { noteLegacyPluginSourceCaptures };
