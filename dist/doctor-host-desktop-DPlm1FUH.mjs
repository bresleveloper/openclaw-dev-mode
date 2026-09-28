import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { r as inspectHostDesktop } from "./host-source-DA7VSJOM.mjs";
//#region src/commands/doctor-host-desktop.ts
const SCREEN_SHARING_PORT = 5900;
const SCREEN_SHARING_COMMAND = "sudo launchctl enable system/com.apple.screensharing && sudo launchctl kickstart -k system/com.apple.screensharing";
const SCREEN_SHARING_SETTINGS = "System Settings → General → Sharing → Screen Sharing";
function hostDesktopSeverity(status) {
	return status.state === "unavailable" || status.state === "managed" && status.managedState === "failed" ? "warning" : "info";
}
/** Collects the non-mutating host desktop diagnostic shared by doctor modes. */
async function collectHostDesktopHealthFindings(cfg) {
	const inspection = await inspectHostDesktop({ config: cfg.desktop?.host });
	return [{
		checkId: "core/doctor/host-desktop",
		severity: hostDesktopSeverity(inspection.status),
		message: inspection.detail,
		path: "desktop.host"
	}];
}
/** Renders host desktop health and offers an explicitly confirmed macOS service repair. */
async function noteHostDesktopHealth(cfg, deps = {}) {
	const platform = deps.platform ?? process.platform;
	const inspection = await inspectHostDesktop({
		config: cfg.desktop?.host,
		platform
	});
	const finding = {
		checkId: "core/doctor/host-desktop",
		severity: hostDesktopSeverity(inspection.status),
		message: inspection.detail,
		path: "desktop.host"
	};
	note(finding.message, "Host desktop");
	if (platform !== "darwin" || cfg.desktop?.host?.enabled !== true || inspection.status.port !== SCREEN_SHARING_PORT || inspection.unavailableReason !== "not-listening") return;
	note(`Repair command: ${SCREEN_SHARING_COMMAND}\nManual path: ${SCREEN_SHARING_SETTINGS}`, "Host desktop repair");
	if (!deps.prompter?.shouldRepair) return;
	if (!await deps.prompter.confirmRuntimeRepair({
		message: "Enable macOS Screen Sharing now using sudo launchctl? This system service may accept connections from other network interfaces according to macOS Sharing settings.",
		initialValue: false,
		requiresInteractiveConfirmation: true
	})) {
		note(`Enable Screen Sharing manually in ${SCREEN_SHARING_SETTINGS}.`, "Host desktop repair");
		return;
	}
	const runCommand = deps.runCommand ?? runCommandWithTimeout;
	for (const argv of [[
		"sudo",
		"launchctl",
		"enable",
		"system/com.apple.screensharing"
	], [
		"sudo",
		"launchctl",
		"kickstart",
		"-k",
		"system/com.apple.screensharing"
	]]) if ((await runCommand(argv, { timeoutMs: 12e4 })).code !== 0) {
		note(`Screen Sharing repair failed. Run ${SCREEN_SHARING_COMMAND}, or enable it in ${SCREEN_SHARING_SETTINGS}.`, "Host desktop repair");
		return;
	}
	const repaired = await inspectHostDesktop({
		config: cfg.desktop.host,
		platform
	});
	note(repaired.detail, "Host desktop");
}
//#endregion
export { collectHostDesktopHealthFindings, noteHostDesktopHealth };
