import "./paths-BJV7vkaX.js";
import { R as shouldMigrateStateFromPath, f as colorize, m as theme, p as isRich } from "./globals-BozXJ-QJ.js";
import { S as shortenHomePath } from "./utils-BzWe_IKB.js";
import "./agent-scope-BJ-A8vSB.js";
import "./subsystem-DEHxNIeh.js";
import "./openclaw-root-pxEnyCPl.js";
import "./logger-CybQ0xau.js";
import "./exec-BpxsjP05.js";
import { on as readConfigFileSnapshot } from "./model-selection-CX4C7NZp.js";
import "./github-copilot-token-BQoM_VEX.js";
import { t as formatCliCommand } from "./command-format-76HdMaIV.js";
import "./boolean-D8Ha5nYV.js";
import "./env-ZTsIDHVm.js";
import "./host-env-security-8lfqCQOD.js";
import "./runtime-overrides-CzZbXh6c.js";
import "./registry-CAMKAMjq.js";
import "./manifest-registry-CWvKZnOp.js";
import "./dock-Comp2gJ6.js";
import "./message-channel-DQep2kbh.js";
import "./plugins-C0pOwMtf.js";
import "./sessions-HiopsrVS.js";
import "./tailnet-CjKuOt5U.js";
import "./ws-BeoXlzsZ.js";
import "./accounts-82c5Tbng.js";
import "./accounts-CvmhVLij.js";
import "./logging-T8IDvLh2.js";
import "./accounts-CoSHDMaf.js";
import "./paths-CrgdtCHd.js";
import "./chat-envelope-DyXtQzoD.js";
import "./client-CaaDgxx2.js";
import "./call-Ch1eylWu.js";
import "./pairing-token-BiCaqjaN.js";
import "./exec-approvals-allowlist-DMGPrtps.js";
import "./exec-safe-bin-runtime-policy-C8qGqATK.js";
import "./plugin-auto-enable-EN1mZ2vU.js";
import "./pairing-store-lwllLpUz.js";
import "./runtime-config-collectors-BgRo9iWt.js";
import "./command-secret-targets-B22Udz2k.js";
import "./prompt-style-DwgYrBLh.js";
import "./note-Bjck-fwK.js";
import { n as formatConfigIssueLines } from "./issue-format-BUpZkSj_.js";
import { t as loadAndMaybeMigrateDoctorConfig } from "./doctor-config-flow-BBcwBEDT.js";
//#region src/cli/program/config-guard.ts
const ALLOWED_INVALID_COMMANDS = new Set([
	"doctor",
	"logs",
	"health",
	"help",
	"status"
]);
const ALLOWED_INVALID_GATEWAY_SUBCOMMANDS = new Set([
	"status",
	"probe",
	"health",
	"discover",
	"call",
	"install",
	"uninstall",
	"start",
	"stop",
	"restart"
]);
let didRunDoctorConfigFlow = false;
let configSnapshotPromise = null;
function resetConfigGuardStateForTests() {
	didRunDoctorConfigFlow = false;
	configSnapshotPromise = null;
}
async function getConfigSnapshot() {
	if (process.env.VITEST === "true") return readConfigFileSnapshot();
	configSnapshotPromise ??= readConfigFileSnapshot();
	return configSnapshotPromise;
}
async function ensureConfigReady(params) {
	const commandPath = params.commandPath ?? [];
	if (!didRunDoctorConfigFlow && shouldMigrateStateFromPath(commandPath)) {
		didRunDoctorConfigFlow = true;
		const runDoctorConfigFlow = async () => loadAndMaybeMigrateDoctorConfig({
			options: { nonInteractive: true },
			confirm: async () => false
		});
		if (!params.suppressDoctorStdout) await runDoctorConfigFlow();
		else {
			const originalStdoutWrite = process.stdout.write.bind(process.stdout);
			const originalSuppressNotes = process.env.OPENCLAW_SUPPRESS_NOTES;
			process.stdout.write = (() => true);
			process.env.OPENCLAW_SUPPRESS_NOTES = "1";
			try {
				await runDoctorConfigFlow();
			} finally {
				process.stdout.write = originalStdoutWrite;
				if (originalSuppressNotes === void 0) delete process.env.OPENCLAW_SUPPRESS_NOTES;
				else process.env.OPENCLAW_SUPPRESS_NOTES = originalSuppressNotes;
			}
		}
	}
	const snapshot = await getConfigSnapshot();
	const commandName = commandPath[0];
	const subcommandName = commandPath[1];
	const allowInvalid = commandName ? ALLOWED_INVALID_COMMANDS.has(commandName) || commandName === "gateway" && subcommandName && ALLOWED_INVALID_GATEWAY_SUBCOMMANDS.has(subcommandName) : false;
	const issues = snapshot.exists && !snapshot.valid ? formatConfigIssueLines(snapshot.issues, "-", { normalizeRoot: true }) : [];
	const legacyIssues = snapshot.legacyIssues.length > 0 ? formatConfigIssueLines(snapshot.legacyIssues, "-") : [];
	if (!(snapshot.exists && !snapshot.valid)) return;
	const rich = isRich();
	const muted = (value) => colorize(rich, theme.muted, value);
	const error = (value) => colorize(rich, theme.error, value);
	const heading = (value) => colorize(rich, theme.heading, value);
	const commandText = (value) => colorize(rich, theme.command, value);
	params.runtime.error(heading("Config invalid"));
	params.runtime.error(`${muted("File:")} ${muted(shortenHomePath(snapshot.path))}`);
	if (issues.length > 0) {
		params.runtime.error(muted("Problem:"));
		params.runtime.error(issues.map((issue) => `  ${error(issue)}`).join("\n"));
	}
	if (legacyIssues.length > 0) {
		params.runtime.error(muted("Legacy config keys detected:"));
		params.runtime.error(legacyIssues.map((issue) => `  ${error(issue)}`).join("\n"));
	}
	params.runtime.error("");
	params.runtime.error(`${muted("Run:")} ${commandText(formatCliCommand("openclaw doctor --fix"))}`);
	if (!allowInvalid) params.runtime.exit(1);
}
const __test__ = { resetConfigGuardStateForTests };
//#endregion
export { __test__, ensureConfigReady };
