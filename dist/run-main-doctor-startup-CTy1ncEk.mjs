//#region src/cli/run-main-doctor-startup.ts
async function prepareDoctorCliStartup(argv, options) {
	if (process.env.OPENCLAW_UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH?.trim() === "-") {
		const { tryRunDoctorResultBridge } = await import("./run-main-doctor-result-D5WJFDtL.mjs");
		if (await tryRunDoctorResultBridge(argv)) return { handled: true };
	}
	const { preflightUpdateDoctorCli } = await import("./commands/doctor-update-schema-guard.js");
	return {
		handled: false,
		preflight: await preflightUpdateDoctorCli(options)
	};
}
//#endregion
export { prepareDoctorCliStartup };
