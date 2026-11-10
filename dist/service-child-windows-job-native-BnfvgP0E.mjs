import { WindowsJob, retainCurrentProcessJobUntilExit } from "@openclaw/proc-safe/windows-job";
//#region src/process/supervisor/service-child-windows-job-native.ts
let retainedProcessJob = false;
function retainWindowsProcessJobUntilExit(_legacyKoffi) {
	if (retainedProcessJob) return;
	const job = WindowsJob.create();
	try {
		retainCurrentProcessJobUntilExit(job);
		retainedProcessJob = true;
	} finally {
		job.close();
	}
}
//#endregion
export { retainWindowsProcessJobUntilExit };
