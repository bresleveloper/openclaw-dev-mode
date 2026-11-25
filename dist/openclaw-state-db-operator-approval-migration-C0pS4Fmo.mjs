import{ut as OPENCLAW_STATE_SCHEMA_SQL}from"./sqlite-database-admission-BVeAafOy.mjs";import{o as getAdmittedSqliteSchemaFacts}from"./sqlite-schema-facts-Edd-ttp_.mjs";import{t as SqliteSchemaMismatchError}from"./sqlite-schema-issues-CTIzzA67.mjs";import{a as tableExists}from"./openclaw-state-db-schema-helpers-4Hs1ye38.mjs";import{a as runSqliteImmediateTransactionSync}from"./sqlite-transaction-mUAqxIBY.mjs";
//!src/state/openclaw-state-db-operator-approval-migration.ts
const COLUMNS=[`approval_id`,`resolution_ref`,`kind`,`status`,`presentation_json`,`requested_by_device_id`,`requested_by_client_id`,`requested_by_device_token_auth`,`reviewer_device_ids_json`,`source_agent_id`,`source_session_key`,`source_session_id`,`source_run_id`,`source_tool_call_id`,`source_tool_name`,`audience_session_keys_json`,`runtime_epoch`,`created_at_ms`,`expires_at_ms`,`updated_at_ms`,`decision`,`terminal_reason`,`resolved_at_ms`,`resolver_kind`,`resolver_id`,`consumed_at_ms`,`consumed_by`];const LEGACY_OPERATOR_APPROVAL_CREATE_SQL=`CREATE TABLE operator_approvals (
  approval_id TEXT NOT NULL PRIMARY KEY CHECK (
    length(approval_id) > 0 AND approval_id NOT IN ('.', '..')
  ),
  resolution_ref TEXT NOT NULL CHECK (
    length(resolution_ref) = 43 AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*'
  ),
  kind TEXT NOT NULL CHECK (kind IN ('exec', 'plugin')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'allowed', 'denied', 'expired', 'cancelled')),
  presentation_json TEXT NOT NULL,
  requested_by_device_id TEXT,
  requested_by_client_id TEXT,
  requested_by_device_token_auth INTEGER NOT NULL DEFAULT 0,
  reviewer_device_ids_json TEXT NOT NULL,
  source_agent_id TEXT,
  source_session_key TEXT,
  source_session_id TEXT,
  source_run_id TEXT,
  source_tool_call_id TEXT,
  source_tool_name TEXT,
  audience_session_keys_json TEXT NOT NULL,
  runtime_epoch TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  decision TEXT CHECK (decision IN ('allow-once', 'allow-always', 'deny')),
  terminal_reason TEXT CHECK ( terminal_reason IN (
    'user', 'timeout', 'malformed-verdict', 'no-route', 'run-aborted',
    'gateway-restart', 'storage-corrupt' ) ),
  resolved_at_ms INTEGER,
  resolver_kind TEXT CHECK (resolver_kind IN ('device', 'channel', 'runtime', 'system')),
  resolver_id TEXT,
  consumed_at_ms INTEGER,
  consumed_by TEXT,
  CHECK (expires_at_ms >= created_at_ms),
  CHECK (updated_at_ms >= created_at_ms),
  CHECK (resolved_at_ms IS NULL OR resolved_at_ms >= created_at_ms),
  CHECK (resolved_at_ms IS NULL OR resolved_at_ms <= updated_at_ms),
  CHECK (consumed_at_ms IS NULL OR consumed_at_ms >= resolved_at_ms),
  CHECK (consumed_at_ms IS NULL OR consumed_at_ms <= updated_at_ms),
  CHECK (requested_by_device_token_auth IN (0, 1)),
  CHECK (
    ( status = 'pending' AND decision IS NULL AND terminal_reason IS NULL AND resolved_at_ms IS NULL AND resolver_kind IS NULL AND resolver_id IS NULL AND consumed_at_ms IS NULL AND consumed_by IS NULL )
    OR ( status = 'allowed' AND decision IN ('allow-once', 'allow-always') AND terminal_reason = 'user' AND resolved_at_ms IS NOT NULL AND resolver_kind IS NOT NULL )
    OR ( status = 'denied' AND decision = 'deny' AND terminal_reason IN ('user', 'malformed-verdict', 'no-route', 'storage-corrupt') AND resolved_at_ms IS NOT NULL AND resolver_kind IS NOT NULL AND consumed_at_ms IS NULL AND consumed_by IS NULL )
    OR ( status = 'expired' AND decision = 'deny' AND terminal_reason = 'timeout' AND resolved_at_ms IS NOT NULL AND resolver_kind IS NOT NULL AND consumed_at_ms IS NULL AND consumed_by IS NULL )
    OR ( status = 'cancelled' AND decision = 'deny' AND terminal_reason IN ('run-aborted', 'gateway-restart') AND resolved_at_ms IS NOT NULL AND resolver_kind IS NOT NULL AND consumed_at_ms IS NULL AND consumed_by IS NULL )
  ),
  CHECK (
    (consumed_at_ms IS NULL AND consumed_by IS NULL)
    OR ( status = 'allowed' AND decision = 'allow-once' AND consumed_at_ms IS NOT NULL AND consumed_by IS NOT NULL )
  )
) STRICT;`;function tableSql(e){const t=getAdmittedSqliteSchemaFacts(e);if(t)return t.tableSql.get(`operator_approvals`)??void 0;const n=e.prepare(`SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'operator_approvals'`).get();return typeof n?.sql===`string`?n.sql:void 0}function hasCanonicalOperatorApprovalKinds(e){if(!tableExists(e,`operator_approvals`))return true;return/kind\s+text\s+not\s+null\s+check\s*\(\s*kind\s+in\s*\(\s*'exec'\s*,\s*'plugin'\s*,\s*'system-agent'\s*\)\s*\)/.test(tableSql(e)?.toLowerCase()??``)}function assertCanonicalOperatorApprovalKinds(e,t){if(!hasCanonicalOperatorApprovalKinds(e))throw new SqliteSchemaMismatchError(`OpenClaw state database ${t} has a legacy operator approval schema; run openclaw doctor --fix to migrate it.`)}function isCanonicalOperatorApprovalKind(e){return e===`exec`||e===`plugin`||e===`system-agent`}function detectOperatorApprovalSchemaMigration(e,t){return hasCanonicalOperatorApprovalKinds(e)?[]:[{kind:`operator-approvals-system-agent`,path:t}]}function normalizeDdl(e){return e.replace(/\s+/g,` `).trim().replace(/;$/,``)}function canonicalOperatorApprovalCreateSql(){const e=`CREATE TABLE IF NOT EXISTS operator_approvals (`;const t=`
) STRICT;`;const n=OPENCLAW_STATE_SCHEMA_SQL.indexOf(e);const r=OPENCLAW_STATE_SCHEMA_SQL.indexOf(t,n);if(n<0||r<0)throw new Error(`canonical operator approval schema is unavailable`);return OPENCLAW_STATE_SCHEMA_SQL.slice(n,r+10)}function alterAppendedResolutionRefCreateSql(e){const t=e.indexOf(`
  resolution_ref `);const n=e.indexOf(`
  kind `,t);const r=`
  consumed_by TEXT,`;const i=e.indexOf(r,n);if(t<0||n<0||i<0)throw new Error(`canonical operator approval resolution reference schema is unavailable`);return(e.slice(0,t)+e.slice(n)).replace(r,`${r} resolution_ref TEXT,`)}function hasExactLegacyOperatorApprovalSchema(e){const t=tableSql(e);if(!t)return false;const n=LEGACY_OPERATOR_APPROVAL_CREATE_SQL;const r=normalizeDdl(t);return[n,alterAppendedResolutionRefCreateSql(n)].some(e=>[e,e.replace(/\) STRICT;$/u,`);`)].map(normalizeDdl).includes(r))}function canonicalCreateSql(){return canonicalOperatorApprovalCreateSql().replace(`CREATE TABLE IF NOT EXISTS operator_approvals (`,`CREATE TABLE operator_approvals_migration_new (`)}function operatorApprovalIndexSql(){const e=OPENCLAW_STATE_SCHEMA_SQL.split(`;`).map(e=>e.trim()).filter(e=>/^CREATE (?:UNIQUE )?INDEX IF NOT EXISTS idx_operator_approvals_/.test(e));if(e.length===0)throw new Error(`canonical operator approval index schema is unavailable`);return`${e.join(`;
`)};`}function repairOperatorApprovalKinds(e){if(hasCanonicalOperatorApprovalKinds(e)||tableExists(e,`operator_approvals_migration_new`)||!hasExactLegacyOperatorApprovalSchema(e))return false;const t=COLUMNS.join(`, `);runSqliteImmediateTransactionSync(e,()=>{e.exec(canonicalCreateSql());e.exec(`
      INSERT INTO operator_approvals_migration_new (cursor_id, ${t})
      SELECT rowid, ${t} FROM operator_approvals
      WHERE typeof(resolution_ref) = 'text'
        AND length(resolution_ref) = 43
        AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*'
      ORDER BY rowid;
      DROP TABLE operator_approvals;
      ALTER TABLE operator_approvals_migration_new RENAME TO operator_approvals;
    `);e.exec(operatorApprovalIndexSql())});return true}function repairOperatorApprovalSchema(e){return repairOperatorApprovalKinds(e)?[`Migrated shared state operator approvals → OpenClaw system changes`]:[]}export{repairOperatorApprovalSchema as i,detectOperatorApprovalSchemaMigration as n,isCanonicalOperatorApprovalKind as r,assertCanonicalOperatorApprovalKinds as t};