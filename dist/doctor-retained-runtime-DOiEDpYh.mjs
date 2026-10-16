import { i as resolveOpenClawPackageRootsSync } from "./openclaw-root-CBoxhfke.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { t as maintainRetainedUpdateRuntimes } from "./temp-artifact-cleanup-DyXpITqy.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { t as inspectDoctorTemporaryDirectories } from "./temporary-directories-DfWQj_4a.mjs";
//#region src/commands/doctor-retained-runtime.ts
async function prepareRetainedUpdateRuntimeCleanup(env, options) {
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	const { directories, warnings } = await inspectDoctorTemporaryDirectories(env, options);
	const packageRoots = resolveOpenClawPackageRootsSync({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
	return async (shouldRepair, authority) => {
		const lines = await maintainRetainedUpdateRuntimes({
			packageRoots,
			temporaryDirectories: directories,
			repair: shouldRepair,
			assertCurrent: authority?.assertCurrent ?? (() => {
				if (!maintenance?.ownsSchemaMaintenance) throw new Error("Doctor does not hold Gateway maintenance");
				maintenance.assertAdmission();
			}),
			assertResourcesSettled: authority?.assertResourcesSettled
		});
		lines.push(...warnings);
		if (lines.length) note(lines.join("\n"), "Updater runtimes");
	};
}
//#endregion
export { prepareRetainedUpdateRuntimeCleanup };
