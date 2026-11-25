import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{n as t,r as n}from"./worker-chunk-BELuyL3Z.mjs";import{vt as r,yt as i}from"./worker-chunk-CEZYAk4y.mjs";import{o as a,t as o}from"./worker-chunk-DBPe0gM1.mjs";import{i as s,n as c,o as l,s as u}from"./worker-chunk-BPAboNOm.mjs";import{i as d,m as f,o as p}from"./worker-chunk-Bt6v_KX1.mjs";import{i as m,r as h}from"./worker-chunk-DQSYHBnu.mjs";import{d as g,f as _,l as v,p as y}from"./worker-chunk-hkd94ElM.mjs";import{l as b,o as x,s as S,t as C}from"./worker-chunk-_Aeyyloa.mjs";import{B as w,G as T,H as E,K as D,U as O,V as k,W as A,q as j}from"./worker-chunk-Bfa80a62.mjs";import{n as M,t as N}from"./worker-chunk-CzVmoVEk.mjs";function getOpenClawStateFeatureSchemaSql(e,t){return t===void 0&&P[e]?P[e]:e===`skill_library_entries`&&t===void 0?o(r,e,{endMarker:`-- End profile-owned skill library.`,includeEndMarker:!1,errorMessage:`Canonical skill library schema missing.`}):o(e===`user_profile_emails`?P.user_profiles:r,e,t)}function listOpenClawStateFeatureSchemas(){if(F)return F;let e={local_workspace_projections:[`local_workspace_projections`,`local_workspace_manifest_nodes`,`local_workspace_tree_packs`,`local_workspace_source_path_sets`],user_profiles:[`user_profiles`,`user_profile_emails`,`user_profile_identities`],skill_library_entries:[`skill_library_entries`,`skill_library_revisions`,`skill_library_events`,`skill_library_uploads`],operator_approval_standing_grants:[`operator_approval_standing_grants`,`operator_approval_standing_grant_generations`],worker_environment_session_attachments:[`worker_environment_session_attachments`]},t=new Set(d),n=new Set(Object.values(e).flat());for(let t of p)n.has(t)||(e[t]=[t]);let i=new Map(Object.entries(e).flatMap(([e,t])=>t.map(t=>[t,e]))),a=[...r.matchAll(/CREATE (?:UNIQUE )?INDEX IF NOT EXISTS (\w+)\s+ON (\w+)[\s\S]*?;/g)];return F=Object.entries(e).map(([e,n])=>{let r=n.map(e=>getOpenClawStateFeatureSchemaSql(e)),o=a.filter(e=>n.includes(e[2])),s=[...r,...o.map(e=>e[0])].join(`
`),c=[...s.matchAll(/CREATE (?:UNIQUE )?INDEX IF NOT EXISTS (\w+)/g)].map(e=>e[1]),l=[...new Set([...s.matchAll(/REFERENCES (\w+)/g)].map(e=>i.get(e[1])).filter(t=>t!==void 0&&t!==e))],u=n.some(e=>t.has(e))||e===`worker_environment_session_attachments`?`first-use`:`version-additive`;return{id:e,tables:n,indexes:[...new Set(c)],dependencies:l,activation:u,sql:()=>s}}),F}var P,F,I=e((()=>{a(),f(),i(),P={local_workspace_projections:[o(r,`local_workspace_projections`),o(r,`local_workspace_manifest_nodes`),o(r,`local_workspace_tree_packs`),o(r,`local_workspace_source_path_sets`)].join(`
`),user_profiles:`
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT NOT NULL PRIMARY KEY,
  display_name TEXT,
  primary_github_account_id INTEGER,
  avatar BLOB,
  avatar_mime TEXT,
  avatar_sha256 TEXT,
  merged_into TEXT,
  role TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS user_profile_emails (
  email TEXT NOT NULL PRIMARY KEY,
  profile_id TEXT NOT NULL,
  binding_id TEXT,
  created_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS idx_user_profile_emails_profile_id
  ON user_profile_emails(profile_id);

${o(r,`user_profile_identities`)}
`,operator_approval_standing_grants:`
CREATE TABLE IF NOT EXISTS operator_approval_standing_grants (
  grant_id TEXT NOT NULL PRIMARY KEY CHECK (length(grant_id) > 0),
  minted_by_approval_id TEXT NOT NULL
    REFERENCES operator_approvals(approval_id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL CHECK (length(agent_id) > 0),
  cron_job_id TEXT NOT NULL CHECK (length(cron_job_id) > 0),
  job_config_revision TEXT NOT NULL CHECK (length(job_config_revision) > 0),
  operation_binding TEXT NOT NULL CHECK (length(operation_binding) > 0),
  created_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER CHECK (expires_at_ms IS NULL OR expires_at_ms >= created_at_ms),
  revoked_at_ms INTEGER,
  revoked_by TEXT,
  last_used_at_ms INTEGER,
  use_count INTEGER NOT NULL DEFAULT 0
) STRICT;

CREATE INDEX IF NOT EXISTS idx_operator_approval_standing_grants_binding
  ON operator_approval_standing_grants(agent_id, cron_job_id, operation_binding, created_at_ms DESC);

CREATE TABLE IF NOT EXISTS operator_approval_standing_grant_generations (
  grant_id TEXT NOT NULL PRIMARY KEY
    REFERENCES operator_approval_standing_grants(grant_id) ON DELETE CASCADE,
  job_definition_generation INTEGER NOT NULL CHECK (job_definition_generation >= 1)
) STRICT;
`,worker_environment_session_attachments:`
CREATE TABLE IF NOT EXISTS worker_environment_session_attachments (
  session_id TEXT PRIMARY KEY,
  session_key TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  session_lifecycle_revision TEXT,
  environment_id TEXT NOT NULL UNIQUE,
  generation INTEGER NOT NULL CHECK (generation >= 1),
  created_at_ms INTEGER NOT NULL,
  last_used_at_ms INTEGER NOT NULL,
  closed_at_ms INTEGER,
  FOREIGN KEY (environment_id) REFERENCES worker_environments(environment_id) ON DELETE CASCADE
) STRICT;
CREATE INDEX IF NOT EXISTS worker_environment_session_attachments_session_key
ON worker_environment_session_attachments(agent_id, session_key);
`}}));function ensureTable(e,t,r){if(n(e))return h(e,t);let i=L.get(t);if(!i){let e=getOpenClawStateFeatureSchemaSql(t,r);i=N(()=>e,{tables:S(e),indexes:x(e)}),L.set(t,i)}i(e)}function assertAgentDeletionJournalAvailable(e){if(!u(e,`agent_deletion_journal`,`agent_id`))throw Error(`Agent deletion journal missing; run openclaw doctor --fix to reconstruct it before restoring or deleting agents.`)}function reconstructAgentDeletionJournalSchema(e,t){let n=o(r,`agent_deletion_journal`),i=l(e,`agent_deletion_journal`);return i||e.exec(n),ensureAgentDeletionJournalPhaseSchema(e),C(e,t,n),!i}function ensureAgentDeletionJournalPhaseSchema(e){assertAgentDeletionJournalAvailable(e),!u(e,`agent_deletion_journal`,`phase`)&&c(e,`agent_deletion_journal`,`phase TEXT`)}function ensureAgentDatabaseLeaseSchema(e){u(e,`agent_database_leases`,`provenance`)||(ensureTable(e,`agent_database_leases`),c(e,`agent_database_leases`,`provenance TEXT`))}function ensureWorkerSessionToolStateSchema(e){ensureTable(e,`worker_turn_tool_authorities`),ensureTable(e,`worker_session_tool_operations`)}function ensureFirstUseAdditiveStateColumnsForStrictMigration(e){for(let{columnName:t,dataType:n,tableName:r}of v)c(e,r,`${t} ${n}`)}function ensureColumns(e,t){let n=[];for(let[r,i]of t){let t=i.trim().split(/\s+/,1)[0];t&&c(e,r,i)&&n.push({tableName:r,columnName:t})}return n}function ensureAdditiveStateColumns(e,t){let n=t===`repair`;ensureWorkerSessionToolStateSchema(e);for(let{columnName:t,dataType:n,tableName:r}of g)c(e,r,`${t} ${n}`);c(e,..._.packageUpdatedAt[0])&&e.exec(`UPDATE template_package_refs SET updated_at_ms = installed_at_ms;`),ensureColumns(e,_.packageIntegrity);let r=c(e,..._.diagnosticSequence[0]);r&&e.exec(`
      WITH ranked AS (
        SELECT
          rowid AS event_rowid,
          ROW_NUMBER() OVER (
            PARTITION BY scope
            ORDER BY created_at ASC, rowid ASC
          ) AS sequence
        FROM diagnostic_events
      )
      UPDATE diagnostic_events
      SET sequence = (
        SELECT ranked.sequence
        FROM ranked
        WHERE ranked.event_rowid = diagnostic_events.rowid
      );
    `),(r||n)&&e.exec(`DROP INDEX IF EXISTS idx_diagnostic_events_scope_created;`);let i=ensureColumns(e,_.cronRunLogs);(n||i.some(({tableName:e})=>e===`cron_run_logs`))&&E(e);let a=ensureColumns(e,_.acpReplay).length>0;(a||n)&&w(e,a);let o=ensureColumns(e,_.cronJobs);(n||o.some(({columnName:e})=>[`name`,`enabled`,`agent_id`,`payload_kind`,`runtime_updated_at_ms`].includes(e)))&&k(e);let s=ensureColumns(e,_.deliveryQueue);(n||s.some(({tableName:e})=>e===`delivery_queue_entries`))&&O(e),c(e,..._.originalMediaRoot[0]),ensureColumns(e,_.beforeTaskAttribution),ensureColumns(e,_.taskRequester),ensureColumns(e,_.taskRunDetails),n&&(D(e),j(e)),ensureColumns(e,_.workerEnvironments),(n||!u(e,`operator_approvals`,`resolution_ref`))&&A(e)}var L,R=e((()=>{t(),b(),M(),a(),y(),m(),T(),s(),I(),i(),L=/* @__PURE__ */ new Map}));export{ensureFirstUseAdditiveStateColumnsForStrictMigration as a,getOpenClawStateFeatureSchemaSql as c,ensureAgentDeletionJournalPhaseSchema as i,I as l,ensureAdditiveStateColumns as n,R as o,ensureAgentDatabaseLeaseSchema as r,reconstructAgentDeletionJournalSchema as s,assertAgentDeletionJournalAvailable as t,listOpenClawStateFeatureSchemas as u};