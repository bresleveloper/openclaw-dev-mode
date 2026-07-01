import type { OpenClawConfig } from "../config/config.js";
/**
 * Format a byte count into a human-readable string (B / KB / MB / GB).
 * Uses Math.floor for MB/KB values to avoid rounding up past a decision
 * threshold (e.g. 99.6 MB should display as "99 MB", not "100 MB").
 * Exported for testing.
 */
export declare function formatBytes(bytes: number): string;
/**
 * Build warning lines based on available disk space.
 * Pure function — exported for testing without FS side effects.
 */
export declare function buildDiskSpaceWarnings(params: {
    availableBytes: number;
    displayStateDir: string;
}): string[];
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
export declare function noteDiskSpace(_cfg: OpenClawConfig, // reserved for API consistency with other Doctor contributions
deps?: {
    env?: NodeJS.ProcessEnv;
    readDiskSpace?: (targetPath: string) => {
        availableBytes: number;
    } | null;
}): void;
