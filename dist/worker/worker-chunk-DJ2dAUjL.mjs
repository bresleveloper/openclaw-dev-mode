import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{n as t,t as n}from"./worker-chunk-Lqe5oW9n.mjs";import{nt as r,tt as i}from"./worker-chunk-Cb_C8ZGK.mjs";import{t as a}from"./worker-chunk-BBc33yzu.mjs";import{t as o}from"./worker-chunk-jU_exdO6.mjs";import{n as s,t as c}from"./worker-chunk-q96lGjEz.mjs";var l;function init_team_reports_port_generated(){return(init_team_reports_port_generated=e((()=>{l={id:`team-reports`,version:2,minimumPostgresVersion:16,schema:``,sqlite:`
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
`,tables:[{name:`team_reports_periods`,columns:[{name:`period`,type:`text`,nullable:!1,identity:!1,default:null},{name:`period_key`,type:`text`,nullable:!1,identity:!1,default:null},{name:`since_ms`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`until_ms`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`status`,type:`text`,nullable:!1,identity:!1,default:null},{name:`generated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`data_json`,type:`text`,nullable:!1,identity:!1,default:null},{name:`summary_json`,type:`text`,nullable:!0,identity:!1,default:null},{name:`markdown`,type:`text`,nullable:!1,identity:!1,default:null}],pk:[`period`,`period_key`],unique:[],foreignKeys:[],indexes:1,identities:[]},{name:`team_reports_person_days`,columns:[{name:`day_key`,type:`text`,nullable:!1,identity:!1,default:null},{name:`login`,type:`text`,nullable:!1,identity:!1,default:null},{name:`github_total`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`commits`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`prs_opened`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`prs_merged`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`prs_closed`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`issues_opened`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`issues_closed`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`issue_comments`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`review_comments`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`discord_messages`,type:`bigint`,nullable:!1,identity:!1,default:null}],pk:[`day_key`,`login`],unique:[],foreignKeys:[],indexes:1,identities:[]},{name:`team_reports_runs`,columns:[{name:`id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null},{name:`started_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null},{name:`finished_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null},{name:`status`,type:`text`,nullable:!1,identity:!1,default:null},{name:`periods_json`,type:`text`,nullable:!1,identity:!1,default:null},{name:`stats_json`,type:`text`,nullable:!0,identity:!1,default:null},{name:`error`,type:`text`,nullable:!0,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[],indexes:2,identities:[]},{name:`team_reports_schema_migrations`,columns:[{name:`id`,type:`text`,nullable:!1,identity:!1,default:null},{name:`applied_at`,type:`bigint`,nullable:!1,identity:!1,default:null}],pk:[`id`],unique:[],foreignKeys:[],indexes:1,identities:[]}],objects:[],triggers:[],preData:[0,1512],postData:[1512,1606]}})))()}async function loadTeamReportsPortDescriptor(e,n=l.version){if(n!==l.version&&n!==1)throw new a(`Missing team-reports PostgreSQL backup descriptor for version ${n}`);let r=t({dirName:`team-reports`,artifactCandidates:[`database-port-api.js`],owner:e})?.teamReportsDatabasePortApi;if(!r)throw new a(`Team Reports port API is unavailable; install the matching Team Reports plugin.`);let o={...l,preData:r.postgres.slice(l.preData[0],l.preData[1]),postData:r.postgres.slice(l.postData[0],l.postData[1]),expectedCatalog:i(l),inspectSqliteSource(e){try{return r.inspectSqliteSource(e)}catch(e){throw new a(e instanceof Error?e.message:String(e))}},migrateSqliteSource:e=>r.admit(e),admit:(e,t)=>r.admit(e,t)};return n===l.version?o:c(o,n,r.postgres)}e((()=>{n(),s(),o(),r(),init_team_reports_port_generated()}))();export{loadTeamReportsPortDescriptor};