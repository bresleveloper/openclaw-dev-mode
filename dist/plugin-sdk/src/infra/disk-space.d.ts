type DiskSpaceSnapshot = {
    targetPath: string;
    checkedPath: string;
    availableBytes: number;
    totalBytes: number | null;
};
/** Reads available bytes for the volume containing a target path when statfs is available. */
export declare function tryReadDiskSpace(targetPath: string): DiskSpaceSnapshot | null;
/** Formats byte counts for compact operator-facing disk-space warnings. */
export declare function formatDiskSpaceBytes(bytes: number): string;
/** Builds a soft low-disk warning for setup/update flows without failing the operation. */
export declare function createLowDiskSpaceWarning(params: {
    targetPath: string;
    purpose: string;
    thresholdBytes?: number;
}): string | null;
export {};
