import type { DoctorConfigPreflightResult } from "../../doctor-config-preflight.js";
import type { DoctorConfigMutationState } from "./config-mutation-state.js";
/** Apply legacy config migrations and update preview/fix state for doctor config flow. */
export declare function applyLegacyCompatibilityStep(params: {
    snapshot: DoctorConfigPreflightResult["snapshot"];
    state: DoctorConfigMutationState;
    shouldRepair: boolean;
    doctorFixCommand: string;
}): {
    state: DoctorConfigMutationState;
    issueLines: string[];
    changeLines: string[];
    partiallyValid?: boolean;
};
/** Strip unknown config keys while preserving active auth profile settings. */
export declare function applyUnknownConfigKeyStep(params: {
    state: DoctorConfigMutationState;
    shouldRepair: boolean;
    doctorFixCommand: string;
}): {
    state: DoctorConfigMutationState;
    removed: string[];
    repairs: string[];
    warnings: string[];
};
