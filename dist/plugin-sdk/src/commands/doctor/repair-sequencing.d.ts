import { type DoctorConfigMutationState } from "./shared/config-mutation-state.js";
/** Run doctor auto-repairs in dependency order and collect sanitized user notes. */
export declare function runDoctorRepairSequence(params: {
    state: DoctorConfigMutationState;
    doctorFixCommand: string;
    env?: NodeJS.ProcessEnv;
}): Promise<{
    state: DoctorConfigMutationState;
    changeNotes: string[];
    warningNotes: string[];
    authProfilesRepaired: boolean;
}>;
