import { o as resolveRequiredHomeDir } from "./home-dir-BjcCg_IW.js";
import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { _ as shortenHomePath } from "./utils-BApvfmPs.js";
import { t as note } from "./note-DXV6Ywsc.js";
import { n as tryReadDiskSpace } from "./disk-space-3_oNOOzX.js";
import os from "node:os";
//#region src/commands/doctor-disk-space.ts
/** Doctor contribution for low disk space around the OpenClaw state directory. */
const CRITICAL_BYTES = 100 * 1024 * 1024;
const WARNING_BYTES = 500 * 1024 * 1024;
/**
* Format a byte count into a human-readable string (B / KB / MB / GB).
* Uses Math.floor for MB/KB values to avoid rounding up past a decision
* threshold (e.g. 99.6 MB should display as "99 MB", not "100 MB").
* Exported for testing.
*/
function formatBytes(bytes) {
	if (bytes < 0 || !Number.isFinite(bytes)) return "unknown";
	if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
	if (bytes >= 1024 * 1024) return `${Math.floor(bytes / (1024 * 1024))} MB`;
	if (bytes >= 1024) return `${Math.floor(bytes / 1024)} KB`;
	return `${bytes} B`;
}
/**
* Build warning lines based on available disk space.
* Pure function — exported for testing without FS side effects.
*/
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
/**
* Doctor health contribution: check free disk space on the partition that
* holds the state directory and warn when it drops below safe thresholds.
*
* This catches a common operational failure mode where OpenClaw silently
* fails to write config, sessions, or logs because the disk is full.
*
* Disk-space probing (statfs + nearest-existing-ancestor resolution) is
* delegated to the shared src/infra/disk-space.ts helper so this Doctor
* check and the install/update diagnostics stay on one implementation.
* The two-tier warning/critical thresholds and Doctor-facing formatting
* are specific to this health contribution.
*/
function noteDiskSpace(_cfg, deps) {
	const env = deps?.env ?? process.env;
	const homedir = () => resolveRequiredHomeDir(env, os.homedir);
	const stateDir = resolveStateDir(env, homedir);
	const snapshot = (deps?.readDiskSpace ?? tryReadDiskSpace)(stateDir);
	if (!snapshot) return;
	const displayStateDir = shortenHomePath(stateDir);
	const warnings = buildDiskSpaceWarnings({
		availableBytes: snapshot.availableBytes,
		displayStateDir
	});
	if (warnings.length > 0) note(warnings.join("\n"), "Disk space");
}
//#endregion
export { noteDiskSpace };
