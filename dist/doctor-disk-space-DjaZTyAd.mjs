import { i as resolveRequiredHomeDir } from "./home-dir-CtsdYvX3.mjs";
import "./src-Djeo9OvP.mjs";
import { n as formatByteSize } from "./format-C1IjPxxo.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
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
function collectDiskSpaceWarnings() {
	const env = process.env;
	const homedir = () => resolveRequiredHomeDir(env, os.homedir);
	const stateDir = resolveStateDir(env, homedir);
	const snapshot = tryReadDiskSpace(stateDir);
	if (!snapshot || !(snapshot.availableBytes < WARNING_BYTES)) return null;
	const displayStateDir = shortenHomePath(stateDir);
	const { availableBytes } = snapshot;
	const displayFreeSpace = formatBytes(availableBytes);
	const critical = availableBytes < CRITICAL_BYTES;
	return {
		critical,
		stateDir,
		displayFreeSpace,
		message: critical ? `CRITICAL: only ${displayFreeSpace} free on the partition containing ${displayStateDir}.` : `Low disk space: ${displayFreeSpace} free on the partition containing ${displayStateDir}.`,
		details: critical ? ["Config writes, session transcripts, and log rotation may fail silently.", "Free up disk space immediately to avoid data loss."] : ["Consider freeing space to prevent future config/session write failures."]
	};
}
/** Collects read-only structured findings for low disk space around the state directory. */
function collectDiskSpaceHealthFindings() {
	const result = collectDiskSpaceWarnings();
	if (!result) return [];
	return [{
		checkId: DISK_SPACE_CHECK_ID,
		severity: result.critical ? "error" : "warning",
		message: result.message,
		path: result.stateDir,
		target: result.displayFreeSpace,
		requirement: result.critical ? "critical-free-space" : "low-free-space",
		fixHint: result.details.join(" ")
	}];
}
function noteDiskSpace() {
	const result = collectDiskSpaceWarnings();
	if (!result) return;
	note([result.message, ...result.details].map((line) => `- ${line}`).join("\n"), "Disk space");
}
//#endregion
export { formatBytes as n, noteDiskSpace as r, collectDiskSpaceHealthFindings as t };
