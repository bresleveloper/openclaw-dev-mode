import { n as createNonExitingRuntime } from "./runtime-DlO3PTAd.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { C as resolveIsNixMode } from "./paths-DGIwWbpu.mjs";
import { n as resolveDoctorRepairMode } from "./doctor-repair-mode-W3I4YQ3X.mjs";
import fs from "node:fs";
//#region src/flows/doctor-health-startup.ts
function stateDirectoryExistsAtDoctorStart() {
	try {
		return fs.statSync(resolveStateDir()).isDirectory();
	} catch {
		return false;
	}
}
async function prepareDoctorHealthFlow(runtime, options, intro) {
	const effectiveRuntime = runtime ?? (await import("./runtime-C3rISTtF.mjs")).defaultRuntime;
	const repairRuntime = {
		...effectiveRuntime,
		exit: createNonExitingRuntime().exit
	};
	const stateDirExistedAtStart = stateDirectoryExistsAtDoctorStart();
	intro("OpenClaw doctor");
	const { resolveOpenClawPackageRoot } = await import("./openclaw-root-Cr3tCNk3.mjs");
	const root = await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
	if (resolveIsNixMode() && (options.repair === true || options.yes === true || options.generateGatewayToken === true)) {
		const { assertConfigWriteAllowedInCurrentMode } = await import("./config-write-guard-DwtgeHY2.mjs");
		assertConfigWriteAllowedInCurrentMode();
	}
	if (!resolveDoctorRepairMode(options).updateInProgress) {
		const [{ readSourceConfigBestEffort }, { inspectDoctorTailscalePrerequisite }] = await Promise.all([import("./io.runtime.js"), import("./doctor-tailscale-DAngWyfx.mjs")]);
		const prerequisite = await inspectDoctorTailscalePrerequisite(await readSourceConfigBestEffort());
		if (prerequisite) {
			const { note } = await import("./terminal-core/note.js");
			note(prerequisite, "Gateway startup prerequisite");
		}
	}
	return {
		effectiveRuntime,
		repairRuntime,
		stateDirExistedAtStart,
		root
	};
}
//#endregion
export { prepareDoctorHealthFlow };
