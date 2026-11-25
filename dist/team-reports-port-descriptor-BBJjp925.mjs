import{n as expectedPostgresCatalog}from"./postgres-catalog-DLo1qY5z.mjs";import{t as loadBundledPluginPublicArtifactModuleFromCandidatesSync}from"./public-surface-loader-BfDPD6QJ.mjs";import{t as DatabasePortDataError}from"./postgres-store-metadata-BAneIabP.mjs";import"./port-descriptor-DhuAPrkv.mjs";import{t as historicalIndexOrderingPort}from"./historical-index-ordering-port-BZqQjHGy.mjs";
//!src/infra/database-engine/team-reports-port.generated.json
var team_reports_port_generated_default={id:`team-reports`,version:2,minimumPostgresVersion:16,schema:``,sqlite:`
CREATE TABLE IF NOT EXISTS team_reports_schema_migrations (
  id TEXT PRIMARY KEY,
  applied_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS team_reports_periods (
  period TEXT NOT NULL,
  period_key TEXT NOT NULL,
  since_ms INTEGER NOT NULL,
  until_ms INTEGER NOT NULL,
  status TEXT NOT NULL,
  generated_at_ms INTEGER NOT NULL,
  data_json TEXT NOT NULL,
  summary_json TEXT,
  markdown TEXT NOT NULL,
  PRIMARY KEY (period, period_key)
) STRICT;

CREATE TABLE IF NOT EXISTS team_reports_person_days (
  day_key TEXT NOT NULL,
  login TEXT NOT NULL,
  github_total INTEGER NOT NULL,
  commits INTEGER NOT NULL,
  prs_opened INTEGER NOT NULL,
  prs_merged INTEGER NOT NULL,
  prs_closed INTEGER NOT NULL,
  issues_opened INTEGER NOT NULL,
  issues_closed INTEGER NOT NULL,
  issue_comments INTEGER NOT NULL,
  review_comments INTEGER NOT NULL,
  discord_messages INTEGER NOT NULL,
  PRIMARY KEY (day_key, login)
) STRICT;

CREATE TABLE IF NOT EXISTS team_reports_runs (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  started_at_ms INTEGER NOT NULL,
  finished_at_ms INTEGER,
  status TEXT NOT NULL,
  periods_json TEXT NOT NULL,
  stats_json TEXT,
  error TEXT
) STRICT;
CREATE INDEX IF NOT EXISTS idx_team_reports_runs_started
  ON team_reports_runs(started_at_ms DESC);
`,tables:[{"name":`team_reports_periods`,"columns":[{"name":`period`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`period_key`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`since_ms`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`until_ms`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`status`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`generated_at_ms`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`data_json`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`summary_json`,"type":`text`,"nullable":true,"identity":false,"default":null},{"name":`markdown`,"type":`text`,"nullable":false,"identity":false,"default":null}],"pk":[`period`,`period_key`],"unique":[],"foreignKeys":[],"indexes":1,"identities":[]},{"name":`team_reports_person_days`,"columns":[{"name":`day_key`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`login`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`github_total`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`commits`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`prs_opened`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`prs_merged`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`prs_closed`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`issues_opened`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`issues_closed`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`issue_comments`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`review_comments`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`discord_messages`,"type":`bigint`,"nullable":false,"identity":false,"default":null}],"pk":[`day_key`,`login`],"unique":[],"foreignKeys":[],"indexes":1,"identities":[]},{"name":`team_reports_runs`,"columns":[{"name":`id`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`kind`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`started_at_ms`,"type":`bigint`,"nullable":false,"identity":false,"default":null},{"name":`finished_at_ms`,"type":`bigint`,"nullable":true,"identity":false,"default":null},{"name":`status`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`periods_json`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`stats_json`,"type":`text`,"nullable":true,"identity":false,"default":null},{"name":`error`,"type":`text`,"nullable":true,"identity":false,"default":null}],"pk":[`id`],"unique":[],"foreignKeys":[],"indexes":2,"identities":[]},{"name":`team_reports_schema_migrations`,"columns":[{"name":`id`,"type":`text`,"nullable":false,"identity":false,"default":null},{"name":`applied_at`,"type":`bigint`,"nullable":false,"identity":false,"default":null}],"pk":[`id`],"unique":[],"foreignKeys":[],"indexes":1,"identities":[]}],objects:[],triggers:[],preData:[0,1512],postData:[1512,1606]};
//!src/infra/database-engine/team-reports-port-descriptor.ts
async function loadTeamReportsPortDescriptor(e,t=team_reports_port_generated_default.version){if(t!==team_reports_port_generated_default.version&&t!==1)throw new DatabasePortDataError(`Missing team-reports PostgreSQL backup descriptor for version ${t}`);const n=loadBundledPluginPublicArtifactModuleFromCandidatesSync({dirName:`team-reports`,artifactCandidates:[`database-port-api.js`],owner:e})?.teamReportsDatabasePortApi;if(!n)throw new DatabasePortDataError(`Team Reports port API is unavailable; install the matching Team Reports plugin.`);const r={...team_reports_port_generated_default,preData:n.postgres.slice(team_reports_port_generated_default.preData[0],team_reports_port_generated_default.preData[1]),postData:n.postgres.slice(team_reports_port_generated_default.postData[0],team_reports_port_generated_default.postData[1]),expectedCatalog:expectedPostgresCatalog(team_reports_port_generated_default),inspectSqliteSource(e){try{return n.inspectSqliteSource(e)}catch(e){throw new DatabasePortDataError(e instanceof Error?e.message:String(e))}},migrateSqliteSource:e=>n.admit(e),admit:(e,t)=>n.admit(e,t)};if(t===team_reports_port_generated_default.version)return r;return historicalIndexOrderingPort(r,t,n.postgres)}export{loadTeamReportsPortDescriptor};