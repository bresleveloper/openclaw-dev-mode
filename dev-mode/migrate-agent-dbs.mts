// openclaw-dev-mode: upgrade agent databases to this build's schema without `openclaw doctor`.
//
// OpenClaw refuses to start on an agent database older than the build (10.4: v23 -> v24,
// "run openclaw doctor --fix to migrate session identities"), and only doctor upgrades it.
// The fork never runs doctor on deploys (Ariel, 2026-10-16): its other repairs move the
// install back toward stock upstream. This runs ONLY upstream's per-database schema upgrade
// (`migrateOpenClawAgentDatabaseForMaintenance`, the call doctor's SQLite repairs use) for
// each registered agent database, under the maintenance lease doctor takes, and skips the
// databases doctor skips (retained after an agent deletion, admission-refused). No config,
// plugin, service, credential or update changes. No-op when every database is current.
//
// Run from the repo root with the gateway STOPPED:
//   node --import ./scripts/tsx.mjs dev-mode/migrate-agent-dbs.mts
// Taking the lease opens the shared state database, which upgrades its own schema on open
// (10.4: v18 -> v20) exactly as the gateway's first start would. The previous build refuses
// both newer schemas, so copy ~/.openclaw/state/ and the agent databases first.
// Exit code 1 = at least one database was not upgraded (the gateway would refuse it).
import { formatErrorMessage } from "../src/infra/errors.js";
import { openNodeSqliteDatabase } from "../src/infra/node-sqlite.js";
import { readSqliteUserVersion } from "../src/infra/sqlite-user-version.js";
import { readAgentDatabaseAdmissionRefusal } from "../src/state/agent-database-admission.js";
import { createRetainedAgentDatabaseMatcher } from "../src/state/agent-deletion-discovery.js";
import { OPENCLAW_AGENT_SCHEMA_VERSION } from "../src/state/openclaw-agent-db-contract.js";
import { closeOpenClawAgentDatabasesAsync } from "../src/state/openclaw-agent-db-lifecycle.js";
import { withAgentDatabaseMaintenanceLease } from "../src/state/openclaw-agent-db-maintenance-lease.js";
import { migrateOpenClawAgentDatabaseForMaintenance } from "../src/state/openclaw-agent-db-maintenance.js";
import { invalidateRegisteredAgentDatabasesMemo } from "../src/state/openclaw-agent-db-registry-listing.js";
import {
  closeOpenClawAgentDatabaseByPath,
  listOpenClawRegisteredAgentDatabases,
} from "../src/state/openclaw-agent-db.js";
import { closeOpenClawStateDatabaseAsync } from "../src/state/openclaw-state-db-cache.js";

function readUserVersion(pathname: string): number {
  const database = openNodeSqliteDatabase(pathname, { readOnly: true });
  try {
    return readSqliteUserVersion(database);
  } finally {
    database.close();
  }
}

const env = process.env;
let failures = 0;
try {
  await withAgentDatabaseMaintenanceLease({ env }, async (maintenance) => {
    maintenance.assertOwned();
    // Same discovery as doctor: committed registrations, incompatible versions included.
    invalidateRegisteredAgentDatabasesMemo({ env });
    const isHeld = createRetainedAgentDatabaseMatcher(env, () => []);
    const entries = listOpenClawRegisteredAgentDatabases({
      env,
      includeIncompatibleSchemaVersions: true,
    });
    console.log(
      `${entries.length} registered agent database(s), target schema v${OPENCLAW_AGENT_SCHEMA_VERSION}`,
    );
    for (const entry of entries) {
      const label = `${entry.agentId} (${entry.path})`;
      if (isHeld(entry.path, entry.agentId)) {
        console.log(`skip ${label}: retained after an agent deletion`);
        continue;
      }
      if (readAgentDatabaseAdmissionRefusal(entry.agentId, { env })) {
        failures += 1;
        console.error(`FAILED ${label}: admission refused`);
        continue;
      }
      maintenance.assertOwned();
      try {
        const before = readUserVersion(entry.path);
        if (before === OPENCLAW_AGENT_SCHEMA_VERSION) {
          console.log(`ok ${label}: v${before}`);
          continue;
        }
        closeOpenClawAgentDatabaseByPath(entry.path);
        await migrateOpenClawAgentDatabaseForMaintenance(
          { agentId: entry.agentId, pathname: entry.path },
          maintenance,
        );
        maintenance.assertOwned();
        const after = readUserVersion(entry.path);
        if (after !== OPENCLAW_AGENT_SCHEMA_VERSION) {
          throw new Error(`still v${after} after the upgrade`);
        }
        console.log(`migrated ${label}: v${before} -> v${after}`);
      } catch (error) {
        failures += 1;
        console.error(`FAILED ${label}: ${formatErrorMessage(error)}`);
      }
    }
  });
} catch (error) {
  failures += 1;
  console.error(`FAILED: ${formatErrorMessage(error)}`);
} finally {
  await closeOpenClawAgentDatabasesAsync();
  await closeOpenClawStateDatabaseAsync();
}
// Lease heartbeats and idle-cleanup timers may outlive the work; exit explicitly.
process.exit(failures > 0 ? 1 : 0);
