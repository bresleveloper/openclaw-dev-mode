import { migrateOrphanedSessionKeys } from "../../infra/state-migrations.js";
import type { OpenClawConfig } from "../types.openclaw.js";
export type SessionStartupMigrationLogger = {
    info: (message: string) => void;
    warn: (message: string) => void;
};
/**
 * Run orphan-key session migration before runtime session store reads.
 *
 * The migration is idempotent and best-effort: startup continues if the repair
 * fails, but warnings stay visible so exact-key runtime access does not hide
 * legacy store states that still need operator attention.
 */
export declare function runSessionStartupMigration(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    log: SessionStartupMigrationLogger;
    deps?: {
        migrateOrphanedSessionKeys?: typeof migrateOrphanedSessionKeys;
    };
}): Promise<void>;
