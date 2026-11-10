import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import path from "node:path";
import { spawnSync } from "node:child_process";
//#region src/commands/doctor-whatsapp-responsiveness.ts
const LOCAL_TUI_SUBCOMMANDS = /* @__PURE__ */ new Set([
	"chat",
	"terminal",
	"tui"
]);
const WHATSAPP_RESPONSIVENESS_CHECK_ID = "core/doctor/whatsapp-responsiveness";
const LOCAL_TUI_PROCESS_PROBE_TIMEOUT_MS = 1e3;
function isLocalTuiCommand(command) {
	const argv = command.trim().split(/\s+/u).filter(Boolean);
	const executable = path.basename(argv[0] ?? "").replace(/\.exe$/iu, "");
	if (executable === "openclaw-tui") return true;
	return executable === "openclaw" && LOCAL_TUI_SUBCOMMANDS.has(argv[1] ?? "");
}
function parsePsPidLine(line) {
	const match = line.match(/^\s*(\d+)\s+(.+)$/);
	if (!match) return null;
	const pid = Number(match[1]);
	if (!Number.isFinite(pid) || pid <= 0 || pid === process.pid) return null;
	const command = match[2]?.trim() ?? "";
	if (!isLocalTuiCommand(command)) return null;
	return {
		pid,
		command
	};
}
/** Lists local OpenClaw TUI processes without inferring their Gateway or activity. */
function listLocalTuiProcesses() {
	if (process.platform === "win32") return [];
	const ps = spawnSync("ps", ["-axo", "pid=,command="], {
		encoding: "utf8",
		killSignal: "SIGKILL",
		timeout: LOCAL_TUI_PROCESS_PROBE_TIMEOUT_MS
	});
	if (ps.error || ps.status !== 0 || typeof ps.stdout !== "string") return [];
	const processes = /* @__PURE__ */ new Map();
	for (const line of ps.stdout.split(/\r?\n/)) {
		const proc = parsePsPidLine(line);
		if (proc && !processes.has(proc.pid)) processes.set(proc.pid, proc);
	}
	return [...processes.values()];
}
function hasWhatsappEnabled(cfg) {
	const whatsapp = cfg.channels?.whatsapp;
	if (!whatsapp || whatsapp.enabled === false) return false;
	const accounts = Object.values(whatsapp.accounts ?? {});
	return accounts.length === 0 || accounts.some((account) => account?.enabled !== false);
}
/** Collects read-only structured findings for WhatsApp responsiveness pressure. */
function collectWhatsappResponsivenessHealthFindings(params) {
	if (!hasWhatsappEnabled(params.cfg) || params.status?.eventLoop?.degraded !== true) return [];
	const tuiProcesses = (params.listLocalTuiProcesses ?? listLocalTuiProcesses)();
	if (tuiProcesses.length === 0) return [];
	return [{
		checkId: WHATSAPP_RESPONSIVENESS_CHECK_ID,
		severity: "warning",
		message: "Gateway reports pressure, and local TUI clients were detected. This snapshot does not identify the source of the pressure.",
		path: "channels.whatsapp",
		target: tuiProcesses.map((proc) => String(proc.pid)).join(", "),
		requirement: "local-tui-event-loop-pressure",
		fixHint: `Inspect Gateway diagnostics with ${formatCliCommand("openclaw gateway diagnostics export")} before deciding whether to close clients.`
	}];
}
/** Renders the same advisory observations as the opt-in health check. */
function noteWhatsappResponsivenessHealth(params) {
	const findings = collectWhatsappResponsivenessHealthFindings(params);
	if (findings.length > 0) note(findings.map((finding) => [
		finding.message,
		`Local TUI pids: ${finding.target}`,
		finding.fixHint
	].join("\n")).join("\n\n"), "WhatsApp responsiveness");
}
//#endregion
export { collectWhatsappResponsivenessHealthFindings, noteWhatsappResponsivenessHealth };
