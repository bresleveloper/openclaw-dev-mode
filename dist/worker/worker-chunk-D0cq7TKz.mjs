import{n as e}from"./worker-chunk-DyeIuPEC.mjs";import{Tt as t,wt as n}from"./worker-chunk-fE-Yh9a5.mjs";import{it as r,tt as i}from"./worker-chunk-CqoiIGWo.mjs";import{u as a}from"./worker-chunk-CJ5hH0Z4.mjs";import{a as o,t as s}from"./worker-chunk-BcMZz5w9.mjs";function createConfigResolutionFacts(e,t=/* @__PURE__ */ new Map,n=r,i=/* @__PURE__ */ new Map){let a=new Set(e.map(({configPath:e})=>e)),o=n?.trim()||`default`;if(t.size>0||i.size>0){let e=/* @__PURE__ */ new Map;for(let[n,r]of[[`pending`,t],[`resolved`,i]])for(let[t,i]of r)e.set(t,{ref:{source:`env`,provider:o,id:i},state:n});c.set(a,e)}return a}var c;function init_resolution_facts(){return(init_resolution_facts=e((()=>{i(),c=/* @__PURE__ */ new WeakMap})))()}function getOpenClawStateFeatureSchemaSql(e,t){return t===void 0&&l[e]?l[e]:e===`skill_library_entries`&&t===void 0?s(n,e,{endMarker:`-- End profile-owned skill library.`,includeEndMarker:!1,errorMessage:`Canonical skill library schema missing.`}):s(e===`user_profile_emails`?l.user_profiles:n,e,t)}var l;function init_openclaw_state_feature_schema(){return(init_openclaw_state_feature_schema=e((()=>{o(),a(),t(),l={local_workspace_projections:[s(n,`local_workspace_projections`),s(n,`local_workspace_manifest_nodes`),s(n,`local_workspace_tree_packs`),s(n,`local_workspace_source_path_sets`)].join(`
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

${s(n,`user_profile_identities`)}
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
`}})))()}export{init_resolution_facts as i,init_openclaw_state_feature_schema as n,createConfigResolutionFacts as r,getOpenClawStateFeatureSchemaSql as t};