/** Ordered legacy migrations without their preview-only rule metadata. */
export declare const LEGACY_CONFIG_MIGRATIONS: {
    id: string;
    describe: string;
    apply: (raw: Record<string, unknown>, changes: string[]) => void;
}[];
/** Aggregated legacy config rules used for doctor preview issue detection. */
export declare const LEGACY_CONFIG_MIGRATION_RULES: import("../../../config/legacy.shared.ts").LegacyConfigRule[];
