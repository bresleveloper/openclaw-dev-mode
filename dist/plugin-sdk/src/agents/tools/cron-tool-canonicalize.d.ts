/** Converts model-friendly cron tool shorthands into the nested gateway job/patch shape. */
export declare function canonicalizeCronToolObject(value: Record<string, unknown>): Record<string, unknown>;
/** Detects recovered update patches that contain no meaningful cron fields after normalization. */
export declare function isEmptyRecoveredCronPatch(value: unknown): boolean;
/** Recovers cron job or patch fields that a model flattened beside the action arguments. */
export declare function recoverCronObjectFromFlatParams(params: Record<string, unknown>): {
    found: boolean;
    value: Record<string, unknown>;
};
/** Checks whether a recovered flat object has enough schedule/payload signal to create a job. */
export declare function hasCronCreateSignal(value: Record<string, unknown>): boolean;
