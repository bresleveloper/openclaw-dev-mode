import { i as resolveRequiredHomeDir } from "./home-dir-Dc6nN6HB.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as formatByteSize } from "./format-C1IjPxxo.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import os from "node:os";
//#region src/commands/doctor-disk-space.ts
const DISK_SPACE_CHECK_ID = "core/doctor/disk-space";
const CRITICAL_BYTES = 104857600;
const WARNING_BYTES = 524288e3;
/** Floor MB/KB values so display rounding never crosses a warning threshold. */
function formatBytes(bytes) {
	if (bytes < 0 || !Number.isFinite(bytes)) return "unknown";
	return formatByteSize(bytes, {
		style: "legacy-binary",
		maxUnit: "giga",
		separator: " ",
		fractionDigits: (_value, unit) => unit === "byte" ? null : unit === "giga" ? 1 : 0,
		floorUnits: ["kilo", "mega"]
	});
}
function buildDiskSpaceWarnings(params) {
	const { availableBytes, displayStateDir } = params;
	const displayFreeSpace = formatBytes(availableBytes);
	const warnings = [];
	if (availableBytes < CRITICAL_BYTES) {
		warnings.push(`- CRITICAL: only ${displayFreeSpace} free on the partition containing ${displayStateDir}.`);
		warnings.push("- Config writes, session transcripts, and log rotation may fail silently.");
		warnings.push("- Free up disk space immediately to avoid data loss.");
	} else if (availableBytes < WARNING_BYTES) {
		warnings.push(`- Low disk space: ${displayFreeSpace} free on the partition containing ${displayStateDir}.`);
		warnings.push("- Consider freeing space to prevent future config/session write failures.");
	}
	return warnings;
}
function collectDiskSpaceWarnings(params = {}) {
	const env = params.env ?? process.env;
	const homedir = () => resolveRequiredHomeDir(env, os.homedir);
	const stateDir = resolveStateDir(env, homedir);
	const snapshot = (params.readDiskSpace ?? tryReadDiskSpace)(stateDir);
	if (!snapshot) return null;
	const displayStateDir = shortenHomePath(stateDir);
	const warnings = buildDiskSpaceWarnings({
		availableBytes: snapshot.availableBytes,
		displayStateDir
	});
	return {
		availableBytes: snapshot.availableBytes,
		stateDir,
		warnings
	};
}
/** Collects read-only structured findings for low disk space around the state directory. */
function collectDiskSpaceHealthFindings(deps) {
	const result = collectDiskSpaceWarnings(deps);
	if (!result || result.warnings.length === 0) return [];
	const [message, ...details] = result.warnings;
	const critical = result.availableBytes < CRITICAL_BYTES;
	return [{
		checkId: DISK_SPACE_CHECK_ID,
		severity: critical ? "error" : "warning",
		message: expectDefined(message, "disk-space warning message").replace(/^- /, ""),
		path: result.stateDir,
		target: formatBytes(result.availableBytes),
		requirement: critical ? "critical-free-space" : "low-free-space",
		fixHint: details.map((line) => line.replace(/^- /, "")).join(" ")
	}];
}
function noteDiskSpace(deps) {
	const result = collectDiskSpaceWarnings(deps);
	if (!result || result.warnings.length === 0) return;
	note(result.warnings.join("\n"), "Disk space");
}
//#endregion
export { formatBytes as n, noteDiskSpace as r, collectDiskSpaceHealthFindings as t };
