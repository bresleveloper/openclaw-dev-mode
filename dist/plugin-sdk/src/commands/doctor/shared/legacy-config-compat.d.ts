/** Apply all legacy doctor migrations to raw config, returning null when nothing changed. */
export declare function applyLegacyDoctorMigrations(raw: unknown): {
    next: Record<string, unknown> | null;
    changes: string[];
};
