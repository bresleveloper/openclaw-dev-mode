/** Kysely row types and table facade for the cron_jobs SQLite table. */
import type { DatabaseSync } from "node:sqlite";
import type { Insertable, Selectable } from "kysely";
import type { DB as OpenClawStateKyselyDatabase } from "../../state/openclaw-state-db.generated.js";
type CronJobsTable = OpenClawStateKyselyDatabase["cron_jobs"];
type CronStoreDatabase = Pick<OpenClawStateKyselyDatabase, "cron_jobs">;
/** Read shape for rows in the cron_jobs SQLite table. */
export type CronJobRow = Selectable<CronJobsTable>;
/** Insert/update shape for rows in the cron_jobs SQLite table. */
export type CronJobInsert = Insertable<CronJobsTable>;
/** Creates the Kysely facade scoped to cron_jobs for synchronous SQLite access. */
export declare function getCronStoreKysely(db: DatabaseSync): import("kysely").Kysely<CronStoreDatabase>;
export {};
