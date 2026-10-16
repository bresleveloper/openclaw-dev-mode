import { t as runChannelPluginStartupMaintenance } from "./lifecycle-startup-TDyknWzf.mjs";
import { n as resolveDoctorChannelPreviewConfig } from "./preview-warnings-DuOh5QTO.mjs";
//#region src/flows/doctor-startup-channel-maintenance.ts
const CHANNEL_PREVIEW_WARNINGS_CHECK_ID = "core/doctor/channel-preview-warnings";
function normalizeWarningMessage(warning) {
	return warning.replace(/^-\s*/, "").trim();
}
function warningPath(warning) {
	return warning.match(/^\s*-?\s*(channels\.[^\s:]+)/)?.[1];
}
/** Collect read-only channel doctor preview warnings as structured findings. */
async function collectChannelPreviewWarningHealthFindings(params) {
	const { collectChannelDoctorPreviewWarnings } = await import("./channel-doctor-DIGtFNGK.mjs");
	const doctorFixCommand = params.doctorFixCommand ?? "openclaw doctor --fix";
	return (await collectChannelDoctorPreviewWarnings({
		cfg: (await resolveDoctorChannelPreviewConfig({
			cfg: params.cfg,
			env: params.env ?? process.env,
			allowExec: params.allowExec
		})).cfg,
		doctorFixCommand,
		env: params.env ?? process.env
	})).map((warning) => {
		const path = warningPath(warning);
		return Object.assign({
			checkId: CHANNEL_PREVIEW_WARNINGS_CHECK_ID,
			severity: "warning",
			message: normalizeWarningMessage(warning)
		}, path ? { path } : {}, {
			requirement: "Configured channels should not emit doctor preview warnings.",
			fixHint: `Run \`${doctorFixCommand}\` if the channel warning recommends repair, or update the affected channel config manually.`
		});
	});
}
/** Runs channel plugin startup maintenance when doctor fix mode explicitly permits repairs. */
async function maybeRunDoctorStartupChannelMaintenance(params) {
	if (!params.shouldRepair) return;
	await (params.runChannelPluginStartupMaintenance ?? runChannelPluginStartupMaintenance)({
		cfg: params.cfg,
		env: params.env ?? process.env,
		log: {
			info: (message) => params.runtime.log(message),
			warn: (message) => params.runtime.error(message)
		},
		trigger: "doctor-fix",
		logPrefix: "doctor"
	});
}
//#endregion
export { collectChannelPreviewWarningHealthFindings, maybeRunDoctorStartupChannelMaintenance };
