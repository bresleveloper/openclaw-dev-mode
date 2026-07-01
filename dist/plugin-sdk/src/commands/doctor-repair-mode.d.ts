import type { DoctorOptions } from "./doctor.types.js";
export type DoctorRepairMode = {
    shouldRepair: boolean;
    shouldForce: boolean;
    nonInteractive: boolean;
    canPrompt: boolean;
    updateInProgress: boolean;
};
/** Resolves the effective repair/prompting mode for a doctor invocation. */
export declare function resolveDoctorRepairMode(options: DoctorOptions): DoctorRepairMode;
/** Returns true for noninteractive updater-driven doctor repair runs. */
export declare function isDoctorUpdateRepairMode(mode: DoctorRepairMode): boolean;
/** Returns whether a doctor repair prompt should be auto-approved under the current mode. */
export declare function shouldAutoApproveDoctorFix(mode: DoctorRepairMode, params?: {
    requiresForce?: boolean;
    blockDuringUpdate?: boolean;
}): boolean;
