/** Apply bundled and plugin channel compatibility migrations to a legacy config object. */
export declare function applyChannelDoctorCompatibilityMigrations(cfg: Record<string, unknown>): {
    next: Record<string, unknown>;
    changes: string[];
};
