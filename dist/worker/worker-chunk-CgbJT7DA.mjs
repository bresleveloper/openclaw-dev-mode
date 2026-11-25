import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{vt as t,yt as n}from"./worker-chunk-CEZYAk4y.mjs";import{o as r,u as i}from"./worker-chunk-DBPe0gM1.mjs";import{_ as a,o,u as s,v as c}from"./worker-chunk-Cb_C8ZGK.mjs";import{r as l,t as u}from"./worker-chunk-DRFLBm48.mjs";import{a as d,i as f,n as p,o as m,s as h}from"./worker-chunk-BPAboNOm.mjs";import{n as g,o as _}from"./worker-chunk-Cah9p62j.mjs";function tableSql(e){let t=o(e);if(t)return t.tableSql.get(`operator_approvals`)??void 0;let n=e.prepare(`SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'operator_approvals'`).get();return typeof n?.sql==`string`?n.sql:void 0}function hasCanonicalOperatorApprovalKinds(e){return!m(e,`operator_approvals`)||/kind\s+text\s+not\s+null\s+check\s*\(\s*kind\s+in\s*\(\s*'exec'\s*,\s*'plugin'\s*,\s*'system-agent'\s*\)\s*\)/.test(tableSql(e)?.toLowerCase()??``)}function assertCanonicalOperatorApprovalKinds(e,t){if(!hasCanonicalOperatorApprovalKinds(e))throw new u(`OpenClaw state database ${t} has a legacy operator approval schema; run openclaw doctor --fix to migrate it.`)}function isCanonicalOperatorApprovalKind(e){return e===`exec`||e===`plugin`||e===`system-agent`}function detectOperatorApprovalSchemaMigration(e,t){return hasCanonicalOperatorApprovalKinds(e)?[]:[{kind:`operator-approvals-system-agent`,path:t}]}function normalizeDdl(e){return e.replace(/\s+/g,` `).trim().replace(/;$/,``)}function canonicalOperatorApprovalCreateSql(){let e=t.indexOf(`CREATE TABLE IF NOT EXISTS operator_approvals (`),n=t.indexOf(`
) STRICT;`,e);if(e<0||n<0)throw Error(`canonical operator approval schema is unavailable`);return t.slice(e,n+10)}function alterAppendedResolutionRefCreateSql(e){let t=e.indexOf(`
  resolution_ref `),n=e.indexOf(`
  kind `,t),r=`
  consumed_by TEXT,`,i=e.indexOf(r,n);if(t<0||n<0||i<0)throw Error(`canonical operator approval resolution reference schema is unavailable`);return(e.slice(0,t)+e.slice(n)).replace(r,`${r} resolution_ref TEXT,`)}function hasExactLegacyOperatorApprovalSchema(e){let t=tableSql(e);if(!t)return!1;let n=y,r=normalizeDdl(t);return[n,alterAppendedResolutionRefCreateSql(n)].some(e=>[e,e.replace(/\) STRICT;$/u,`);`)].map(normalizeDdl).includes(r))}function canonicalCreateSql(){return canonicalOperatorApprovalCreateSql().replace(`CREATE TABLE IF NOT EXISTS operator_approvals (`,`CREATE TABLE operator_approvals_migration_new (`)}function operatorApprovalIndexSql(){let e=t.split(`;`).map(e=>e.trim()).filter(e=>/^CREATE (?:UNIQUE )?INDEX IF NOT EXISTS idx_operator_approvals_/.test(e));if(e.length===0)throw Error(`canonical operator approval index schema is unavailable`);return`${e.join(`;
`)};`}function repairOperatorApprovalKinds(e){if(hasCanonicalOperatorApprovalKinds(e)||m(e,`operator_approvals_migration_new`)||!hasExactLegacyOperatorApprovalSchema(e))return!1;let t=v.join(`, `);return _(e,()=>{e.exec(canonicalCreateSql()),e.exec(`
      INSERT INTO operator_approvals_migration_new (cursor_id, ${t})
      SELECT rowid, ${t} FROM operator_approvals
      WHERE typeof(resolution_ref) = 'text'
        AND length(resolution_ref) = 43
        AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*'
      ORDER BY rowid;
      DROP TABLE operator_approvals;
      ALTER TABLE operator_approvals_migration_new RENAME TO operator_approvals;
    `),e.exec(operatorApprovalIndexSql())}),!0}function repairOperatorApprovalSchema(e){return repairOperatorApprovalKinds(e)?[`Migrated shared state operator approvals → OpenClaw system changes`]:[]}var v,y,b=e((()=>{s(),l(),g(),f(),n(),v=/* @__PURE__ */ `approval_id.resolution_ref.kind.status.presentation_json.requested_by_device_id.requested_by_client_id.requested_by_device_token_auth.reviewer_device_ids_json.source_agent_id.source_session_key.source_session_id.source_run_id.source_tool_call_id.source_tool_name.audience_session_keys_json.runtime_epoch.created_at_ms.expires_at_ms.updated_at_ms.decision.terminal_reason.resolved_at_ms.resolver_kind.resolver_id.consumed_at_ms.consumed_by`.split(`.`),y=`CREATE TABLE operator_approvals (
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
) STRICT;`}));function migratePortableIdentityColumnsV22(e,t){if(t>=22)return!1;let n=!1,r=o(e)??a(e);for(let t of x){if(!m(e,t)||h(e,t,`cursor_id`))continue;let a=r.tableSql.get(t);if(typeof a!=`string`)throw Error(`Missing v22 cursor migration schema: ${t}`);let o=i(`${t}_migration_v22`),s=i(t),c=[...d(e,t)].map(i).join(`, `);e.exec(`CREATE TABLE ${o} (cursor_id INTEGER NOT NULL, ${a.slice(a.indexOf(`(`)+1)};
      INSERT INTO ${o} (rowid, ${c}, cursor_id) SELECT rowid, ${c}, rowid FROM ${s} ORDER BY rowid;
      DROP TABLE ${s};
      ALTER TABLE ${o} RENAME TO ${s};`);for(let n of[...r.indexDefinitions.values(),...r.triggers.values()])n.table===t&&typeof n.sql==`string`&&e.exec(n.sql);n=!0}if(m(e,`acp_sessions`)){n=p(e,`acp_sessions`,`resume_agent_session_id TEXT`)||n,n=p(e,`acp_sessions`,`resume_acpx_session_id TEXT`)||n;let t=`CASE WHEN json_valid(identity_json) THEN identity_json END`,r=`char(9,10,11,12,13,32,160,5760,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8232,8233,8239,8287,12288,65279)`;e.exec(`UPDATE acp_sessions SET
      resume_agent_session_id = CASE WHEN json_type(${t}, '$.agentSessionId') = 'text'
        THEN trim(json_extract(${t}, '$.agentSessionId'), ${r}) END,
      resume_acpx_session_id = CASE WHEN json_type(${t}, '$.acpxSessionId') = 'text'
        THEN trim(json_extract(${t}, '$.acpxSessionId'), ${r}) END;
      DROP INDEX IF EXISTS idx_acp_sessions_resume_agent;
      DROP INDEX IF EXISTS idx_acp_sessions_resume_acpx;`)}return n}var x,S=e((()=>{c(),s(),r(),f(),x=[`operator_approvals`,`cron_run_receipts`,`execution_decision_facts`,`skill_workshop_changes`]}));export{detectOperatorApprovalSchemaMigration as a,repairOperatorApprovalSchema as c,assertCanonicalOperatorApprovalKinds as i,S as n,b as o,migratePortableIdentityColumnsV22 as r,isCanonicalOperatorApprovalKind as s,x as t};