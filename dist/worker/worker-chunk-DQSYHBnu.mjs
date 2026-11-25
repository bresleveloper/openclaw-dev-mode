import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{l as t,u as n}from"./worker-chunk-EAEbv0hu.mjs";import{c as r,d as i,l as a}from"./worker-chunk-UXEX-k0X.mjs";import{n as o,r as s}from"./worker-chunk-BELuyL3Z.mjs";import{c,i as l}from"./worker-chunk-BT-IOQFW.mjs";import{n as u,t as d}from"./worker-chunk-W44sVN01.mjs";import{t as f}from"./worker-chunk-Ckt55JSZ.mjs";import{D as p,_t as m,ft as h,h as ee,ht as te,m as ne,vt as re,yt as ie}from"./worker-chunk-CEZYAk4y.mjs";import{o as g,t as _,u as v}from"./worker-chunk-DBPe0gM1.mjs";import"./worker-chunk-DhldO1WL.mjs";import{c as ae,i as y,s as b}from"./worker-chunk-0SEMnZfQ.mjs";import{A as oe,E as x,O as S,T as se,_ as C,d as ce,et as le,nt as ue,o as de,u as w,v as fe}from"./worker-chunk-Cb_C8ZGK.mjs";import{a as pe,i as T,n as E,o as D}from"./worker-chunk-BPAboNOm.mjs";import{i as me,s as he}from"./worker-chunk-pyTZgBGy.mjs";import{m as O}from"./worker-chunk-Bt6v_KX1.mjs";import{a as ge,c as _e,r as ve,s as ye}from"./worker-chunk-DOFtAvjv.mjs";import{i as be,n as xe,t as Se}from"./worker-chunk-CXSvqoZa.mjs";import{x as Ce,y as we}from"./worker-chunk-D5id0NBB.mjs";import{h as k,p as Te}from"./worker-chunk-DWyUX6Cm.mjs";import{i as Ee,r as De}from"./worker-chunk-BWzizumL.mjs";import{n as Oe,t as ke}from"./worker-chunk-CSuS93f7.mjs";import{n as A,r as j,t as Ae}from"./worker-chunk-DnSEmuga.mjs";import{_ as M,a as je,c as N,i as Me,m as Ne,n as Pe}from"./worker-chunk-hkd94ElM.mjs";import{a as P,n as F,o as Fe,r as Ie,t as I}from"./worker-chunk-Cs2QYsjt.mjs";import{o as Le,t as L}from"./worker-chunk-D2mxN1OB.mjs";import"node:worker_threads";function stateEngineInput(){if(xe())return Se(`state`)}var Re=e((()=>{be()}));function migrateLocalWorkspaceCas(e,t){if(t>=35||!D(e,`local_workspace_projections`))return!1;for(let t of z)E(e,`local_workspace_projections`,`${t} BLOB`);for(let t of R)e.exec(_(re,t));return!0}function withLegacyLocalWorkspaceCas(e){return e.replace(/\n {2}(?:tree_root_digest|source_paths_digest|canonical_fingerprints|projection_fingerprints) BLOB,/gu,``).replace(/\n {2}"(?:tree_root_digest|source_paths_digest|canonical_fingerprints|projection_fingerprints)" bytea,/gu,``).replace(/CREATE TABLE(?: IF NOT EXISTS)? "?local_workspace_(?:tree_packs|source_path_sets)"? \([\s\S]*?\n\)(?: STRICT(?:, WITHOUT ROWID)?)?;\n?/gu,``)}var R,z,B,V=e((()=>{g(),T(),ie(),R=[`local_workspace_tree_packs`,`local_workspace_source_path_sets`],z=[`tree_root_digest`,`source_paths_digest`,`canonical_fingerprints`,`projection_fingerprints`],B={version:35,tables:[`local_workspace_projections`,...R],columns:z.map(e=>`local_workspace_projections.${e}`),migrate:migrateLocalWorkspaceCas,applied:`Prepared shared content-addressed workspace trees and compact scan fingerprints (v35)`}}));function migrateLocalWorkspaceManifests(e,t){if(t>=31||!D(e,H))return!1;E(e,H,`checkpoint_json TEXT`);let n=de(e)??C(e),r=n.tableSql.get(H);if(typeof r!=`string`)throw Error(`Local workspace projection migration schema is missing`);if(r.includes(W)){let t=v(`${H}_migration_v31`),i=v(H),a=[...pe(e,H)].map(v).join(`, `),o=r.slice(r.indexOf(`(`)).replace(W,G);e.exec(`CREATE TABLE ${t} ${o};
      INSERT INTO ${t} (rowid, ${a}) SELECT rowid, ${a} FROM ${i};
      DROP TABLE ${i};
      ALTER TABLE ${t} RENAME TO ${i};`);for(let t of[...n.indexDefinitions.values(),...n.triggers.values()])t.table===H&&typeof t.sql==`string`&&e.exec(t.sql)}else if(!r.includes(G))throw Error(`Local workspace baseline constraint is not recognized; preserve it for Doctor`);return e.exec(_(re,U)),!0}function withLegacyLocalWorkspaceManifests(e){return withLegacyLocalWorkspaceCas(e).replace(/\n {2}(?:checkpoint_json TEXT|"checkpoint_json" text COLLATE "C"),/gu,``).replace(/^ {2}CHECK \([^\n]*baseline_json[^\n]*baseline_ref[^\n]*\),$/gmu,e=>e.includes(`"`)?`  CHECK ((("baseline_json" IS NULL) = ("baseline_ref" IS NULL))),`:`  ${W},`).replace(/CREATE TABLE(?: IF NOT EXISTS)? "?local_workspace_manifest_nodes"? \([\s\S]*?\n\)(?: STRICT)?;\n?/gu,``).replace(/ALTER TABLE "local_workspace_manifest_nodes" ADD FOREIGN KEY[^;]*;\n?/gu,``)}var H,U,W,G,K,q=e((()=>{fe(),w(),g(),T(),V(),ie(),H=`local_workspace_projections`,U=`local_workspace_manifest_nodes`,W=`CHECK ((baseline_json IS NULL) = (baseline_ref IS NULL))`,G=`CHECK (baseline_json IS NULL OR baseline_ref IS NOT NULL)`,K={version:31,tables:[H,U],columns:[`${H}.checkpoint_json`],migrate:migrateLocalWorkspaceManifests,applied:`Prepared resumable per-path local workspace baselines and checkpoint deltas (v31)`}}));function withLegacyWorkerResourceReceipts(e){return e.replace(/,\n {2}resource_receipt_json TEXT(?=\n\))|\n {2}"resource_receipt_json" text COLLATE "C",/gu,``)}var ze,J=e((()=>{T(),ze={version:37,tables:[`worker_environments`],columns:[`worker_environments.resource_receipt_json`],migrate(e,t){return t>=37?!1:E(e,`worker_environments`,`resource_receipt_json TEXT`)},applied:`Retained immutable worker provider resource receipts (v37)`}}));function withLegacyRepositoryDiskAuthority(e){return e.replace(/\n {2}(?:(?:disk_authority_json|repository_disk_authority_json) TEXT|"(?:disk_authority_json|repository_disk_authority_json)" text COLLATE "C"),/gu,``)}var Be,Ve,He=e((()=>{T(),J(),Be={version:38,tables:[`session_repository_workspaces`,`worker_workspace_pending_results`],columns:[`session_repository_workspaces.disk_authority_json`,`worker_workspace_pending_results.repository_disk_authority_json`],migrate(e,t){if(t>=38)return!1;let n=E(e,`session_repository_workspaces`,`disk_authority_json TEXT`),r=E(e,`worker_workspace_pending_results`,`repository_disk_authority_json TEXT`);return n||r},applied:`Retained repository disk authority and original pending-result authority (v38)`},Ve=[ze,Be]}));function withLegacyWorkerRetention(e){return e.replace(/,\n {2}retention_json TEXT(?=\n\))|\n {2}"retention_json" text COLLATE "C",/gu,``)}var Ue,We=e((()=>{T(),Ue={version:39,tables:[`worker_environments`],columns:[`worker_environments.retention_json`],migrate(e,t){return t>=39?!1:E(e,`worker_environments`,`retention_json TEXT`)},applied:`Retained worker acquisition policy, unfinished operation, and observations (v39)`}}));function withLegacyWorkspaceBootstrapDeferred(e){return e.replace(`  bootstrap_deferred INTEGER,
`,``).replace(`  "bootstrap_deferred" bigint,
`,``)}function withLegacyStateV40Additions(e){return withLegacyWorkspaceBootstrapDeferred(e).replace(/CREATE TABLE IF NOT EXISTS device_pairing_browser_requests \([\s\S]*?\) STRICT;\n\n/u,``)}var Ge=e((()=>{}));function withLegacyWorkerProvisionSource(e){return e.replace(/,\n {2}provision_source_json TEXT(?=\n\))|\n {2}"provision_source_json" text COLLATE "C",/gu,``)}var Y,Ke=e((()=>{T(),Y={version:40,tables:[`worker_environments`],columns:[`worker_environments.provision_source_json`],migrate(e,t){if(t>=40||!D(e,`worker_environments`))return!1;let n=E(e,`worker_environments`,`provision_source_json TEXT`),r=e.prepare(`UPDATE worker_environments
      SET provision_source_json = '{"kind":"unavailable"}'
      WHERE (state IN ('requested', 'provisioning') AND lease_id IS NULL
        OR state = 'bootstrapping' AND owner_epoch = 0)
        AND provision_source_json IS NULL`).run();return n||Number(r.changes)>0},applied:`Original worker provisioning source retained across recovery (v40)`}}));function withPostgresSchemaAdmissionRetry(e,t,n){try{return t()}catch(r){if(!(r instanceof F)||!s(e)||n?.()===!1||!e.isOpen||e.isTransaction)throw r;let i=Math.min(Date.now()+1e3,te()??1/0),a=performance.now()+Math.max(0,i-Date.now()),o=new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));return m({deadlineAtMs:i},()=>{for(let s=10;;s=Math.min(s*2,100)){h();let c=Math.min(a-performance.now(),i-Date.now());if(c<=0||(Atomics.wait(o,0,0,Math.min(s,c)),h(),performance.now()>=a||Date.now()>=i)||n?.()===!1||!e.isOpen||e.isTransaction)throw r;try{if(!x(e,{refresh:!0}))continue;return t()}catch(t){if(t instanceof we&&(performance.now()>=a||Date.now()>=i))throw r;if(!(t instanceof F)||n?.()===!1||!e.isOpen||e.isTransaction)throw t}}})}}var qe=e((()=>{S(),o(),Ce(),P()}));function isUnfencedUpdateDriver(e){let t=typeof e==`string`?(0,Je.parse)(e):null;return t!==null&&`${t.major}.${t.minor}.${t.patch}`==`2026.9.2`}function readStateSchemaPublicationBlocker(e,t=Date.now()){if(!D(e,`update_runs`))return;let r=y(e,b(e).selectFrom(`update_runs`).select([`run_id`,`before_json`,`status`,`updated_at_ms`,`finished_at_ms`]).where(e=>e.or([e.and([e(`status`,`=`,`running`),e(`updated_at_ms`,`>=`,t-L)]),e.and([e(`status`,`!=`,`running`),e.or([e(`finished_at_ms`,`>`,t-X),e(`finished_at_ms`,`is`,null)])])])).orderBy(`run_id`)).rows,i;for(let e of r){let t=JSON.parse(e.before_json);if(!n(t)||typeof t.version!=`string`||!isUnfencedUpdateDriver(t.version))continue;let r=e.status===`running`?e.updated_at_ms+L+1:e.finished_at_ms===null?null:e.finished_at_ms+X;(!i||r===null||i.publishAfterMs!==null&&r>i.publishAfterMs)&&(i={runId:e.run_id,updaterVersion:t.version,publishAfterMs:r})}return i}function resolveStateSchemaVersionToPublish(e){let t=he(e);if(t>=40||!readStateSchemaPublicationBlocker(e))return 40;if(!D(e,`config_machine_state`))throw Error(`Shared state schema publication cannot be deferred without config_machine_state.`);return writeStateSchemaContentVersion(e),ce(e),t}function writeStateSchemaContentVersion(e){y(e,b(e).insertInto(`config_machine_state`).values({state_key:I,value_json:`40`,updated_at_ms:Date.now()}).onConflict(e=>e.column(`state_key`).doUpdateSet({value_json:`40`,updated_at_ms:Date.now()}).where(`config_machine_state.value_json`,`!=`,`40`)))}function advanceStateSchemaContentVersion(e,t){y(e,b(e).updateTable(`config_machine_state`).set({value_json:String(t.toVersion)}).where(`state_key`,`=`,I).where(`value_json`,`=`,String(t.fromVersion)))}var Je,X,Ye=e((()=>{t(),Je=f(),ae(),w(),me(),Le(),O(),T(),P(),X=3e5})),Z,Xe=e((()=>{Z={get eagerSql(){let e=`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "acp_replay_events" (
  "session_id" text COLLATE "C" NOT NULL,
  "seq" bigint NOT NULL,
  "at" bigint NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C",
  "update_json" text COLLATE "C" NOT NULL,
  "estimated_bytes" bigint NOT NULL DEFAULT 0,
  PRIMARY KEY ("session_id", "seq")
);

CREATE TABLE "acp_replay_sessions" (
  "session_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "cwd" text COLLATE "C" NOT NULL,
  "complete" bigint NOT NULL,
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  "next_seq" bigint NOT NULL,
  "estimated_bytes" bigint NOT NULL DEFAULT 0,
  PRIMARY KEY ("session_id")
);

CREATE TABLE "acp_sessions" (
  "session_key" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C",
  "backend" text COLLATE "C" NOT NULL,
  "agent" text COLLATE "C" NOT NULL,
  "runtime_session_name" text COLLATE "C" NOT NULL,
  "identity_json" text COLLATE "C",
  "resume_agent_session_id" text COLLATE "C",
  "resume_acpx_session_id" text COLLATE "C",
  "mode" text COLLATE "C" NOT NULL,
  "runtime_options_json" text COLLATE "C",
  "cwd" text COLLATE "C",
  "state" text COLLATE "C" NOT NULL,
  "last_activity_at" bigint NOT NULL,
  "last_error" text COLLATE "C",
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("session_key")
);

CREATE TABLE "agent_database_leases" (
  "lease_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "path" text COLLATE "C" NOT NULL,
  "owner_pid" bigint NOT NULL,
  "owner_start_time" bigint,
  "opened_at" bigint NOT NULL,
  "provenance" text COLLATE "C",
  PRIMARY KEY ("lease_id")
);

CREATE TABLE "agent_databases" (
  "agent_id" text COLLATE "C" NOT NULL,
  "path" text COLLATE "C" NOT NULL,
  "schema_version" bigint NOT NULL,
  "last_seen_at" bigint NOT NULL,
  "size_bytes" bigint,
  PRIMARY KEY ("agent_id", "path")
);

CREATE TABLE "apns_registration_tombstones" (
  "node_id" text COLLATE "C" NOT NULL,
  "deleted_at_ms" bigint NOT NULL,
  PRIMARY KEY ("node_id")
);

CREATE TABLE "apns_registrations" (
  "node_id" text COLLATE "C" NOT NULL,
  "transport" text COLLATE "C" NOT NULL,
  "token" text COLLATE "C",
  "relay_handle" text COLLATE "C",
  "send_grant" text COLLATE "C",
  "installation_id" text COLLATE "C",
  "relay_origin" text COLLATE "C",
  "topic" text COLLATE "C" NOT NULL,
  "environment" text COLLATE "C" NOT NULL,
  "distribution" text COLLATE "C",
  "token_debug_suffix" text COLLATE "C",
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("node_id")
);

CREATE TABLE "audit_events" (
  "sequence" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "event_id" text COLLATE "C" NOT NULL,
  "source_id" text COLLATE "C" NOT NULL,
  "schema_version" bigint NOT NULL DEFAULT 1,
  "source_sequence" bigint NOT NULL,
  "occurred_at" bigint NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "action" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "error_code" text COLLATE "C",
  "actor_type" text COLLATE "C" NOT NULL,
  "actor_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C",
  "session_key" text COLLATE "C",
  "session_id" text COLLATE "C",
  "run_id" text COLLATE "C",
  "tool_call_id" text COLLATE "C",
  "tool_name" text COLLATE "C",
  "direction" text COLLATE "C",
  "channel" text COLLATE "C",
  "conversation_kind" text COLLATE "C",
  "message_outcome" text COLLATE "C",
  "reason_code" text COLLATE "C",
  "delivery_kind" text COLLATE "C",
  "failure_stage" text COLLATE "C",
  "duration_ms" bigint,
  "result_count" bigint,
  "account_ref" text COLLATE "C",
  "conversation_ref" text COLLATE "C",
  "message_ref" text COLLATE "C",
  "target_ref" text COLLATE "C",
  PRIMARY KEY ("sequence"),
  UNIQUE ("event_id"),
  UNIQUE ("source_id")
);

CREATE TABLE "audit_identity_keys" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "key_id" text COLLATE "C" NOT NULL,
  "key" bytea NOT NULL,
  "created_at" bigint NOT NULL,
  PRIMARY KEY ("id"),
  CHECK (("id" = 1))
);

CREATE TABLE "backup_runs" (
  "id" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "archive_path" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "manifest_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TABLE "capture_blobs" (
  "blob_id" text COLLATE "C" NOT NULL,
  "content_type" text COLLATE "C",
  "encoding" text COLLATE "C" NOT NULL,
  "size_bytes" bigint NOT NULL,
  "sha256" text COLLATE "C" NOT NULL,
  "data" bytea NOT NULL,
  "created_at" bigint NOT NULL,
  PRIMARY KEY ("blob_id")
);

CREATE TABLE "capture_events" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "ts" bigint NOT NULL,
  "source_scope" text COLLATE "C" NOT NULL,
  "source_process" text COLLATE "C" NOT NULL,
  "protocol" text COLLATE "C" NOT NULL,
  "direction" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "flow_id" text COLLATE "C" NOT NULL,
  "method" text COLLATE "C",
  "host" text COLLATE "C",
  "path" text COLLATE "C",
  "status" bigint,
  "close_code" bigint,
  "content_type" text COLLATE "C",
  "headers_json" text COLLATE "C",
  "data_text" text COLLATE "C",
  "data_blob_id" text COLLATE "C",
  "data_sha256" text COLLATE "C",
  "error_text" text COLLATE "C",
  "meta_json" text COLLATE "C",
  PRIMARY KEY ("id")
);

CREATE TABLE "capture_sessions" (
  "id" text COLLATE "C" NOT NULL,
  "started_at" bigint NOT NULL,
  "ended_at" bigint,
  "mode" text COLLATE "C" NOT NULL,
  "source_scope" text COLLATE "C" NOT NULL,
  "source_process" text COLLATE "C" NOT NULL,
  "proxy_url" text COLLATE "C",
  PRIMARY KEY ("id")
);

CREATE TABLE "channel_ingress_events" (
  "queue_name" text COLLATE "C" NOT NULL,
  "event_id" text COLLATE "C" NOT NULL,
  "channel_id" text COLLATE "C" NOT NULL,
  "account_id" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "lane_key" text COLLATE "C",
  "payload_json" text COLLATE "C" NOT NULL,
  "metadata_json" text COLLATE "C",
  "received_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  "claim_token" text COLLATE "C",
  "claim_owner" text COLLATE "C",
  "claimed_at" bigint,
  "attempts" bigint NOT NULL DEFAULT 0,
  "last_attempt_at" bigint,
  "last_error" text COLLATE "C",
  "failed_reason" text COLLATE "C",
  "failed_at" bigint,
  "completed_at" bigint,
  "completed_metadata_json" text COLLATE "C",
  PRIMARY KEY ("queue_name", "event_id")
);

CREATE TABLE "channel_pairing_allow_entries" (
  "channel_key" text COLLATE "C" NOT NULL,
  "account_id" text COLLATE "C" NOT NULL,
  "entry" text COLLATE "C" NOT NULL,
  "sort_order" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("channel_key", "account_id", "entry")
);

CREATE TABLE "channel_pairing_requests" (
  "channel_key" text COLLATE "C" NOT NULL,
  "account_id" text COLLATE "C" NOT NULL,
  "request_id" text COLLATE "C" NOT NULL,
  "code" text COLLATE "C" NOT NULL,
  "created_at" text COLLATE "C" NOT NULL,
  "last_seen_at" text COLLATE "C" NOT NULL,
  "meta_json" text COLLATE "C",
  PRIMARY KEY ("channel_key", "account_id", "request_id")
);

CREATE TABLE "clawhub_promotion_claims" (
  "slug" text COLLATE "C" NOT NULL,
  "provider" text COLLATE "C",
  "model_keys_json" text COLLATE "C" NOT NULL,
  "ends_at_ms" bigint NOT NULL,
  "claimed_at_ms" bigint NOT NULL,
  PRIMARY KEY ("slug")
);

CREATE TABLE "config_health_entries" (
  "config_path" text COLLATE "C" NOT NULL,
  "last_known_good_json" text COLLATE "C",
  "last_promoted_good_json" text COLLATE "C",
  "last_observed_suspicious_signature" text COLLATE "C",
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("config_path")
);

CREATE TABLE "config_machine_state" (
  "state_key" text COLLATE "C" NOT NULL,
  "value_json" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("state_key")
);

CREATE TABLE "cron_job_scratch" (
  "store_key" text COLLATE "C" NOT NULL,
  "job_id" text COLLATE "C" NOT NULL,
  "content" text COLLATE "C",
  "revision" bigint NOT NULL,
  "source_sha256" text COLLATE "C",
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("store_key", "job_id"),
  CHECK (("revision" >= 1)),
  CHECK ("content" IS NULL OR (octet_length(convert_to("content", 'UTF8')) <= 262144))
);

CREATE TABLE "cron_jobs" (
  "store_key" text COLLATE "C" NOT NULL,
  "job_id" text COLLATE "C" NOT NULL,
  "declaration_key" text COLLATE "C",
  "owner_agent_id" text COLLATE "C",
  "name" text COLLATE "C" NOT NULL,
  "description" text COLLATE "C",
  "enabled" bigint NOT NULL,
  "agent_id" text COLLATE "C",
  "payload_kind" text COLLATE "C" NOT NULL,
  "job_json" text COLLATE "C" NOT NULL,
  "grant_definition_revision" text COLLATE "C",
  "grant_definition_generation" bigint,
  "grant_definition_updated_at" bigint,
  "state_json" text COLLATE "C" NOT NULL DEFAULT '{}',
  "runtime_updated_at_ms" bigint,
  "schedule_identity" text COLLATE "C",
  "sort_order" bigint NOT NULL DEFAULT 0,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("store_key", "job_id")
);

CREATE TABLE "current_conversation_bindings" (
  "binding_key" text COLLATE "C" NOT NULL,
  "binding_id" text COLLATE "C" NOT NULL,
  "target_session_key" text COLLATE "C" NOT NULL,
  "channel" text COLLATE "C" NOT NULL,
  "account_id" text COLLATE "C" NOT NULL,
  "conversation_kind" text COLLATE "C" NOT NULL,
  "parent_conversation_id" text COLLATE "C",
  "conversation_id" text COLLATE "C" NOT NULL,
  "target_kind" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "bound_at" bigint NOT NULL,
  "expires_at" bigint,
  "metadata_json" text COLLATE "C",
  "record_json" text COLLATE "C" NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("binding_key")
);

CREATE TABLE "delivery_queue_entries" (
  "queue_name" text COLLATE "C" NOT NULL,
  "id" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "entry_kind" text COLLATE "C",
  "session_key" text COLLATE "C",
  "channel" text COLLATE "C",
  "target" text COLLATE "C",
  "account_id" text COLLATE "C",
  "retry_count" bigint NOT NULL DEFAULT 0,
  "last_attempt_at" bigint,
  "last_error" text COLLATE "C",
  "recovery_state" text COLLATE "C",
  "platform_send_started_at" bigint,
  "entry_json" text COLLATE "C" NOT NULL,
  "retention_id_prefix" text COLLATE "C",
  "retention_max_age_ms" bigint,
  "retention_max_entries" bigint,
  "enqueued_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  "failed_at" bigint,
  PRIMARY KEY ("queue_name", "id")
);

CREATE TABLE "device_bootstrap_tokens" (
  "token_key" text COLLATE "C" NOT NULL,
  "token" text COLLATE "C" NOT NULL,
  "setup_id" text COLLATE "C",
  "ts" bigint NOT NULL,
  "device_id" text COLLATE "C",
  "public_key" text COLLATE "C",
  "profile_json" text COLLATE "C",
  "redeemed_profile_json" text COLLATE "C",
  "pending_profile_json" text COLLATE "C",
  "issued_at_ms" bigint NOT NULL,
  "last_used_at_ms" bigint,
  PRIMARY KEY ("token_key")
);

CREATE TABLE "device_pairing_paired" (
  "device_id" text COLLATE "C" NOT NULL,
  "public_key" text COLLATE "C" NOT NULL,
  "display_name" text COLLATE "C",
  "operator_label" text COLLATE "C",
  "platform" text COLLATE "C",
  "device_family" text COLLATE "C",
  "client_id" text COLLATE "C",
  "client_mode" text COLLATE "C",
  "browser_origin" text COLLATE "C",
  "role" text COLLATE "C",
  "roles_json" text COLLATE "C",
  "scopes_json" text COLLATE "C",
  "approved_scopes_json" text COLLATE "C",
  "remote_ip" text COLLATE "C",
  "tokens_json" text COLLATE "C",
  "approved_via" text COLLATE "C",
  "node_surface_json" text COLLATE "C",
  "pending_node_surface_json" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "approved_at_ms" bigint NOT NULL,
  "last_seen_at_ms" bigint,
  "last_seen_reason" text COLLATE "C",
  PRIMARY KEY ("device_id")
);

CREATE TABLE "device_pairing_pending" (
  "request_id" text COLLATE "C" NOT NULL,
  "device_id" text COLLATE "C" NOT NULL,
  "public_key" text COLLATE "C" NOT NULL,
  "display_name" text COLLATE "C",
  "platform" text COLLATE "C",
  "device_family" text COLLATE "C",
  "client_id" text COLLATE "C",
  "client_mode" text COLLATE "C",
  "browser_origin" text COLLATE "C",
  "role" text COLLATE "C",
  "roles_json" text COLLATE "C",
  "scopes_json" text COLLATE "C",
  "remote_ip" text COLLATE "C",
  "silent" bigint,
  "is_repair" bigint,
  "ts" bigint NOT NULL,
  "refreshed_at_ms" bigint,
  PRIMARY KEY ("request_id")
);

CREATE TABLE "diagnostic_events" (
  "scope" text COLLATE "C" NOT NULL,
  "event_key" text COLLATE "C" NOT NULL,
  "payload_json" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "sequence" bigint NOT NULL DEFAULT 0,
  PRIMARY KEY ("scope", "event_key")
);

CREATE TABLE "exec_approvals_config" (
  "config_key" text COLLATE "C" NOT NULL,
  "raw_json" text COLLATE "C" NOT NULL,
  "socket_path" text COLLATE "C",
  "has_socket_token" bigint NOT NULL,
  "default_security" text COLLATE "C",
  "default_ask" text COLLATE "C",
  "default_ask_fallback" text COLLATE "C",
  "auto_allow_skills" bigint,
  "agent_count" bigint NOT NULL,
  "allowlist_count" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("config_key")
);

CREATE TABLE "flow_runs" (
  "flow_id" text COLLATE "C" NOT NULL,
  "shape" text COLLATE "C",
  "sync_mode" text COLLATE "C" NOT NULL DEFAULT 'managed',
  "owner_key" text COLLATE "C" NOT NULL,
  "requester_origin_json" text COLLATE "C",
  "controller_id" text COLLATE "C",
  "revision" bigint NOT NULL DEFAULT 0,
  "status" text COLLATE "C" NOT NULL,
  "notify_policy" text COLLATE "C" NOT NULL,
  "goal" text COLLATE "C" NOT NULL,
  "current_step" text COLLATE "C",
  "blocked_task_id" text COLLATE "C",
  "blocked_summary" text COLLATE "C",
  "state_json" text COLLATE "C",
  "wait_json" text COLLATE "C",
  "cancel_requested_at" bigint,
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  "ended_at" bigint,
  PRIMARY KEY ("flow_id")
);

CREATE TABLE "gateway_boot_lifecycle" (
  "boot_id" text COLLATE "C" NOT NULL,
  "pid" bigint NOT NULL,
  "started_at_ms" bigint NOT NULL,
  "completed_at_ms" bigint,
  "outcome" text COLLATE "C",
  "startup_reason" text COLLATE "C",
  "reason" text COLLATE "C",
  PRIMARY KEY ("boot_id")
);

CREATE TABLE "gateway_restart_handoff" (
  "handoff_key" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "version" bigint NOT NULL,
  "intent_id" text COLLATE "C" NOT NULL,
  "pid" bigint NOT NULL,
  "process_instance_id" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "expires_at" bigint NOT NULL,
  "reason" text COLLATE "C",
  "restart_trace_started_at" bigint,
  "restart_trace_last_at" bigint,
  "source" text COLLATE "C" NOT NULL,
  "restart_kind" text COLLATE "C" NOT NULL,
  "supervisor_mode" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("handoff_key")
);

CREATE TABLE "gateway_restart_intent" (
  "intent_key" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "pid" bigint NOT NULL,
  "created_at" bigint NOT NULL,
  "reason" text COLLATE "C",
  "force" bigint,
  "wait_ms" bigint,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("intent_key")
);

CREATE TABLE "gateway_restart_sentinel" (
  "sentinel_key" text COLLATE "C" NOT NULL,
  "version" bigint NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "ts" bigint NOT NULL,
  "session_key" text COLLATE "C",
  "thread_id" text COLLATE "C",
  "delivery_channel" text COLLATE "C",
  "delivery_to" text COLLATE "C",
  "delivery_account_id" text COLLATE "C",
  "message" text COLLATE "C",
  "continuation_json" text COLLATE "C",
  "doctor_hint" text COLLATE "C",
  "stats_json" text COLLATE "C",
  "payload_json" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("sentinel_key")
);

CREATE TABLE "macos_port_guardian_records" (
  "pid" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "port" bigint NOT NULL,
  "command" text COLLATE "C" NOT NULL,
  "mode" text COLLATE "C" NOT NULL,
  "timestamp" double precision NOT NULL,
  PRIMARY KEY ("pid")
);

CREATE TABLE "managed_outgoing_image_records" (
  "attachment_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C",
  "message_id" text COLLATE "C",
  "created_at" text COLLATE "C" NOT NULL,
  "updated_at" text COLLATE "C",
  "retention_class" text COLLATE "C",
  "alt" text COLLATE "C" NOT NULL,
  "original_media_root" text COLLATE "C" NOT NULL,
  "original_media_id" text COLLATE "C" NOT NULL,
  "original_media_subdir" text COLLATE "C" NOT NULL,
  "original_content_type" text COLLATE "C" NOT NULL,
  "original_width" bigint,
  "original_height" bigint,
  "original_size_bytes" bigint,
  "original_filename" text COLLATE "C",
  "record_json" text COLLATE "C" NOT NULL,
  "cleanup_pending" bigint NOT NULL DEFAULT 0,
  PRIMARY KEY ("attachment_id"),
  CHECK (("cleanup_pending" IN (0, 1)))
);

CREATE TABLE "mcp_oauth_stores" (
  "store_key" text COLLATE "C" NOT NULL,
  "format_version" bigint NOT NULL,
  "store_json" text COLLATE "C" NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("store_key"),
  CHECK (("format_version" = 1))
);

CREATE TABLE "meeting_transcript_sessions" (
  "started_at_ms" bigint,
  "session_id" text COLLATE "C" NOT NULL,
  "started_at" text COLLATE "C" NOT NULL,
  "selector" text COLLATE "C" NOT NULL,
  "export_key" text COLLATE "C" NOT NULL,
  "session_slug" text COLLATE "C" NOT NULL,
  "provider_id" text COLLATE "C" NOT NULL,
  "title" text COLLATE "C",
  "source_json" text COLLATE "C" NOT NULL,
  "source_account_id" text COLLATE "C",
  "source_guild_id" text COLLATE "C",
  "source_channel_id" text COLLATE "C",
  "source_meeting_url" text COLLATE "C",
  "source_thread_ts" text COLLATE "C",
  "source_file_id" text COLLATE "C",
  "stopped_at" text COLLATE "C",
  "metadata_json" text COLLATE "C",
  "metadata_agent_id" text COLLATE "C",
  "export_manifest_json" text COLLATE "C" NOT NULL DEFAULT '{}',
  "export_pending_json" text COLLATE "C" NOT NULL DEFAULT '[]',
  "next_utterance_seq" bigint NOT NULL DEFAULT 0,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("session_id", "started_at"),
  CHECK (("next_utterance_seq" >= 0)),
  CHECK (("created_at_ms" >= 0)),
  CHECK (("updated_at_ms" >= 0)),
  UNIQUE ("selector")
);

CREATE TABLE "meeting_transcript_summaries" (
  "session_id" text COLLATE "C" NOT NULL,
  "session_started_at" text COLLATE "C" NOT NULL,
  "generated_at" text COLLATE "C",
  "summary_json" text COLLATE "C",
  "overview" text COLLATE "C",
  "markdown" text COLLATE "C",
  "utterance_count" bigint NOT NULL,
  PRIMARY KEY ("session_id", "session_started_at"),
  CHECK (("utterance_count" >= 0)),
  CHECK ("summary_json" IS NOT NULL OR "markdown" IS NOT NULL)
);

CREATE TABLE "meeting_transcript_utterances" (
  "session_id" text COLLATE "C" NOT NULL,
  "session_started_at" text COLLATE "C" NOT NULL,
  "sequence" bigint NOT NULL,
  "utterance_id" text COLLATE "C",
  "started_at" text COLLATE "C",
  "ended_at" text COLLATE "C",
  "speaker_id" text COLLATE "C",
  "speaker_label" text COLLATE "C",
  "text" text COLLATE "C" NOT NULL,
  "final" bigint,
  "metadata_json" text COLLATE "C",
  PRIMARY KEY ("session_id", "session_started_at", "sequence"),
  CHECK (("sequence" >= 0)),
  CHECK (("final" IN (0, 1)))
);

CREATE TABLE "migration_runs" (
  "id" text COLLATE "C" NOT NULL,
  "started_at" bigint NOT NULL,
  "finished_at" bigint,
  "status" text COLLATE "C" NOT NULL,
  "report_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TABLE "migration_sources" (
  "source_key" text COLLATE "C" NOT NULL,
  "migration_kind" text COLLATE "C" NOT NULL,
  "source_path" text COLLATE "C" NOT NULL,
  "target_table" text COLLATE "C" NOT NULL,
  "source_sha256" text COLLATE "C",
  "source_size_bytes" bigint,
  "source_record_count" bigint,
  "last_run_id" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "imported_at" bigint NOT NULL,
  "removed_source" bigint NOT NULL DEFAULT 0,
  "report_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("source_key")
);

CREATE TABLE "native_hook_relay_bridges" (
  "relay_id" text COLLATE "C" NOT NULL,
  "pid" bigint NOT NULL,
  "hostname" text COLLATE "C" NOT NULL,
  "port" bigint NOT NULL,
  "token" text COLLATE "C" NOT NULL,
  "expires_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("relay_id")
);

CREATE TABLE "official_external_plugin_catalog_snapshots" (
  "feed_url" text COLLATE "C" NOT NULL,
  "body" text COLLATE "C" NOT NULL,
  "status" bigint NOT NULL,
  "etag" text COLLATE "C",
  "last_modified" text COLLATE "C",
  "checksum" text COLLATE "C" NOT NULL,
  "saved_at" text COLLATE "C" NOT NULL,
  "trust_mode" text COLLATE "C",
  "trust_key_id" text COLLATE "C",
  "trust_signature_count" bigint,
  "trust_threshold" bigint,
  "trust_verified_at" text COLLATE "C",
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("feed_url")
);

CREATE TABLE "operator_approvals" (
  "cursor_id" bigint NOT NULL,
  "approval_id" text COLLATE "C" NOT NULL,
  "resolution_ref" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "presentation_json" text COLLATE "C" NOT NULL,
  "requested_by_device_id" text COLLATE "C",
  "requested_by_client_id" text COLLATE "C",
  "requested_by_device_token_auth" bigint NOT NULL DEFAULT 0,
  "reviewer_device_ids_json" text COLLATE "C" NOT NULL,
  "source_agent_id" text COLLATE "C",
  "source_session_key" text COLLATE "C",
  "source_session_id" text COLLATE "C",
  "source_run_id" text COLLATE "C",
  "source_tool_call_id" text COLLATE "C",
  "source_tool_name" text COLLATE "C",
  "audience_session_keys_json" text COLLATE "C" NOT NULL,
  "runtime_epoch" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "expires_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "decision" text COLLATE "C",
  "terminal_reason" text COLLATE "C",
  "resolved_at_ms" bigint,
  "resolver_kind" text COLLATE "C",
  "resolver_id" text COLLATE "C",
  "consumed_at_ms" bigint,
  "consumed_by" text COLLATE "C",
  PRIMARY KEY ("approval_id"),
  CHECK ((char_length("approval_id") > 0) AND ("approval_id" NOT IN ('.', '..'))),
  CHECK ((char_length("resolution_ref") = 43) AND ("resolution_ref" COLLATE "C" !~ '\\A.*[^A-Za-z0-9_-].*\\Z')),
  CHECK (("kind" IN ('exec', 'plugin', 'system-agent'))),
  CHECK (("status" IN ('pending', 'allowed', 'denied', 'expired', 'cancelled'))),
  CHECK (("decision" IN ('allow-once', 'allow-always', 'deny'))),
  CHECK (("terminal_reason" IN ('user', 'timeout', 'malformed-verdict', 'no-route', 'run-aborted', 'gateway-restart', 'storage-corrupt'))),
  CHECK (("resolver_kind" IN ('device', 'channel', 'runtime', 'system'))),
  CHECK (("expires_at_ms" >= "created_at_ms")),
  CHECK (("updated_at_ms" >= "created_at_ms")),
  CHECK ("resolved_at_ms" IS NULL OR ("resolved_at_ms" >= "created_at_ms")),
  CHECK ("resolved_at_ms" IS NULL OR ("resolved_at_ms" <= "updated_at_ms")),
  CHECK ("consumed_at_ms" IS NULL OR ("consumed_at_ms" >= "resolved_at_ms")),
  CHECK ("consumed_at_ms" IS NULL OR ("consumed_at_ms" <= "updated_at_ms")),
  CHECK (("requested_by_device_token_auth" IN (0, 1))),
  CHECK ((("status" = 'pending') AND "decision" IS NULL AND "terminal_reason" IS NULL AND "resolved_at_ms" IS NULL AND "resolver_kind" IS NULL AND "resolver_id" IS NULL AND "consumed_at_ms" IS NULL AND "consumed_by" IS NULL) OR (("status" = 'allowed') AND ("decision" IN ('allow-once', 'allow-always')) AND ("terminal_reason" = 'user') AND "resolved_at_ms" IS NOT NULL AND "resolver_kind" IS NOT NULL) OR (("status" = 'denied') AND ("decision" = 'deny') AND ("terminal_reason" IN ('user', 'malformed-verdict', 'no-route', 'storage-corrupt')) AND "resolved_at_ms" IS NOT NULL AND "resolver_kind" IS NOT NULL AND "consumed_at_ms" IS NULL AND "consumed_by" IS NULL) OR (("status" = 'expired') AND ("decision" = 'deny') AND ("terminal_reason" = 'timeout') AND "resolved_at_ms" IS NOT NULL AND "resolver_kind" IS NOT NULL AND "consumed_at_ms" IS NULL AND "consumed_by" IS NULL) OR (("status" = 'cancelled') AND ("decision" = 'deny') AND ("terminal_reason" IN ('run-aborted', 'gateway-restart')) AND "resolved_at_ms" IS NOT NULL AND "resolver_kind" IS NOT NULL AND "consumed_at_ms" IS NULL AND "consumed_by" IS NULL)),
  CHECK (("consumed_at_ms" IS NULL AND "consumed_by" IS NULL) OR (("status" = 'allowed') AND ("decision" = 'allow-once') AND "consumed_at_ms" IS NOT NULL AND "consumed_by" IS NOT NULL))
);

CREATE TABLE "outbound_media_provenance" (
  "realpath" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "version" bigint NOT NULL,
  "sha256" text COLLATE "C" NOT NULL,
  "size_bytes" bigint NOT NULL,
  "created_at_ms" bigint NOT NULL,
  PRIMARY KEY ("realpath")
);

CREATE TABLE "plugin_binding_approvals" (
  "plugin_root" text COLLATE "C" NOT NULL,
  "channel" text COLLATE "C" NOT NULL,
  "account_id" text COLLATE "C" NOT NULL,
  "plugin_id" text COLLATE "C" NOT NULL,
  "plugin_name" text COLLATE "C",
  "approved_at" bigint NOT NULL,
  PRIMARY KEY ("plugin_root", "channel", "account_id")
);

CREATE TABLE "plugin_blob_entries" (
  "plugin_id" text COLLATE "C" NOT NULL,
  "namespace" text COLLATE "C" NOT NULL,
  "entry_key" text COLLATE "C" NOT NULL,
  "metadata_json" text COLLATE "C" NOT NULL,
  "blob" bytea NOT NULL,
  "created_at" bigint NOT NULL,
  "expires_at" bigint,
  PRIMARY KEY ("plugin_id", "namespace", "entry_key")
);

CREATE TABLE "plugin_state_entries" (
  "plugin_id" text COLLATE "C" NOT NULL,
  "namespace" text COLLATE "C" NOT NULL,
  "entry_key" text COLLATE "C" NOT NULL,
  "value_json" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "expires_at" bigint,
  PRIMARY KEY ("plugin_id", "namespace", "entry_key")
);

CREATE TABLE "sandbox_registry_entries" (
  "registry_kind" text COLLATE "C" NOT NULL,
  "container_name" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C",
  "backend_id" text COLLATE "C",
  "runtime_label" text COLLATE "C",
  "image" text COLLATE "C",
  "created_at_ms" bigint,
  "last_used_at_ms" bigint,
  "config_label_kind" text COLLATE "C",
  "config_hash" text COLLATE "C",
  "cdp_port" bigint,
  "no_vnc_port" bigint,
  "entry_json" text COLLATE "C" NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("registry_kind", "container_name")
);

CREATE TABLE "schema_meta" (
  "meta_key" text COLLATE "C" NOT NULL,
  "role" text COLLATE "C" NOT NULL,
  "schema_version" bigint NOT NULL,
  "agent_id" text COLLATE "C",
  "app_version" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("meta_key")
);

CREATE TABLE "session_groups" (
  "name" text COLLATE "C" NOT NULL,
  "position" bigint NOT NULL,
  "created_at" bigint NOT NULL,
  "cwd" text COLLATE "C",
  "worktree" bigint,
  PRIMARY KEY ("name")
);

CREATE TABLE "session_state_events" (
  "sequence" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "dedupe_key" text COLLATE "C",
  "session_key" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C",
  "agent_id" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "actor_type" text COLLATE "C" NOT NULL,
  "actor_id" text COLLATE "C",
  "run_id" text COLLATE "C",
  "occurred_at" bigint NOT NULL,
  "summary" text COLLATE "C" NOT NULL,
  "payload_json" text COLLATE "C",
  PRIMARY KEY ("sequence"),
  UNIQUE ("dedupe_key")
);

CREATE TABLE "session_state_heads" (
  "session_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "last_sequence" bigint NOT NULL,
  "pruned_max_sequence" bigint NOT NULL DEFAULT 0,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("session_key", "agent_id")
);

CREATE TABLE "session_upstream_links" (
  "session_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "catalog_id" text COLLATE "C" NOT NULL,
  "host_id" text COLLATE "C" NOT NULL,
  "thread_id" text COLLATE "C" NOT NULL,
  "upstream_kind" text COLLATE "C" NOT NULL,
  "upstream_ref_json" text COLLATE "C",
  "last_marker_json" text COLLATE "C",
  "last_scanned_at" bigint,
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("session_key", "agent_id")
);

CREATE TABLE "session_watch_cursors" (
  "watcher_session_key" text COLLATE "C" NOT NULL,
  "watcher_store_path" text COLLATE "C",
  "target_session_key" text COLLATE "C" NOT NULL,
  "last_seen_sequence" bigint NOT NULL DEFAULT 0,
  "notified_sequence" bigint NOT NULL DEFAULT 0,
  "material_sequence" bigint NOT NULL DEFAULT 0,
  "provenance" text COLLATE "C" NOT NULL DEFAULT 'explicit',
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("watcher_session_key", "target_session_key"),
  CHECK (("provenance" IN ('explicit', 'ambient-group')))
);

CREATE TABLE "skill_upload_chunks" (
  "upload_id" text COLLATE "C" NOT NULL,
  "byte_offset" bigint NOT NULL,
  "size_bytes" bigint NOT NULL,
  "chunk_blob" bytea NOT NULL,
  PRIMARY KEY ("upload_id", "byte_offset"),
  CHECK (("byte_offset" >= 0)),
  CHECK (("size_bytes" > 0)),
  CHECK ((octet_length("chunk_blob") = "size_bytes"))
);

CREATE TABLE "skill_uploads" (
  "upload_id" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "slug" text COLLATE "C" NOT NULL,
  "force" bigint NOT NULL,
  "size_bytes" bigint NOT NULL,
  "sha256" text COLLATE "C",
  "actual_sha256" text COLLATE "C",
  "received_bytes" bigint NOT NULL,
  "archive_blob" bytea NOT NULL,
  "created_at" bigint NOT NULL,
  "expires_at" bigint NOT NULL,
  "committed" bigint NOT NULL,
  "committed_at" bigint,
  "idempotency_key_hash" text COLLATE "C",
  PRIMARY KEY ("upload_id"),
  UNIQUE ("idempotency_key_hash")
);

CREATE TABLE "skill_usage" (
  "skill_file" text COLLATE "C" NOT NULL,
  "skill_key" text COLLATE "C" NOT NULL,
  "skill_name" text COLLATE "C" NOT NULL,
  "skill_source" text COLLATE "C" NOT NULL,
  "first_used_at_ms" bigint NOT NULL,
  "last_used_at_ms" bigint NOT NULL,
  "use_count" bigint NOT NULL,
  "last_agent_id" text COLLATE "C",
  PRIMARY KEY ("skill_file")
);

CREATE TABLE "state_leases" (
  "scope" text COLLATE "C" NOT NULL,
  "lease_key" text COLLATE "C" NOT NULL,
  "owner" text COLLATE "C" NOT NULL,
  "expires_at" bigint,
  "heartbeat_at" bigint,
  "payload_json" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("scope", "lease_key")
);

CREATE TABLE "subagent_runs" (
  "run_id" text COLLATE "C" NOT NULL,
  "child_session_key" text COLLATE "C" NOT NULL,
  "controller_session_key" text COLLATE "C",
  "controller_store_path" text COLLATE "C",
  "requester_session_key" text COLLATE "C" NOT NULL,
  "requester_store_path" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "payload_json" text COLLATE "C" NOT NULL DEFAULT '{}',
  PRIMARY KEY ("run_id")
);

CREATE TABLE "task_delivery_state" (
  "task_id" text COLLATE "C" NOT NULL,
  "requester_origin_json" text COLLATE "C",
  "last_notified_event_at" bigint,
  PRIMARY KEY ("task_id")
);

CREATE TABLE "task_runs" (
  "task_id" text COLLATE "C" NOT NULL,
  "runtime" text COLLATE "C" NOT NULL,
  "task_kind" text COLLATE "C",
  "source_id" text COLLATE "C",
  "requester_session_key" text COLLATE "C",
  "owner_key" text COLLATE "C" NOT NULL,
  "scope_kind" text COLLATE "C" NOT NULL,
  "child_session_key" text COLLATE "C",
  "parent_flow_id" text COLLATE "C",
  "parent_task_id" text COLLATE "C",
  "agent_id" text COLLATE "C",
  "requester_agent_id" text COLLATE "C",
  "run_id" text COLLATE "C",
  "execution_owner_host" text COLLATE "C",
  "execution_owner_pid" bigint,
  "execution_owner_start_identity" bigint,
  "label" text COLLATE "C",
  "task" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "delivery_status" text COLLATE "C" NOT NULL,
  "notify_policy" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "started_at" bigint,
  "ended_at" bigint,
  "last_event_at" bigint,
  "cleanup_after" bigint,
  "tool_use_count" bigint,
  "last_tool_name" text COLLATE "C",
  "error" text COLLATE "C",
  "progress_summary" text COLLATE "C",
  "terminal_summary" text COLLATE "C",
  "terminal_outcome" text COLLATE "C",
  "detail_json" text COLLATE "C",
  PRIMARY KEY ("task_id")
);

CREATE TABLE "template_cron_refs" (
  "agent_id" text COLLATE "C" NOT NULL,
  "manifest_id" text COLLATE "C" NOT NULL,
  "schema_version" text COLLATE "C" NOT NULL,
  "declaration_key" text COLLATE "C" NOT NULL,
  "scheduler_job_id" text COLLATE "C",
  "status" text COLLATE "C" NOT NULL,
  "job_json" text COLLATE "C" NOT NULL,
  "error" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("agent_id", "manifest_id"),
  UNIQUE ("declaration_key"),
  UNIQUE ("scheduler_job_id")
);

CREATE TABLE "template_installs" (
  "agent_id" text COLLATE "C" NOT NULL,
  "schema_version" text COLLATE "C" NOT NULL,
  "source_kind" text COLLATE "C" NOT NULL,
  "template_name" text COLLATE "C" NOT NULL,
  "template_version" text COLLATE "C" NOT NULL,
  "package_root" text COLLATE "C" NOT NULL,
  "manifest_path" text COLLATE "C" NOT NULL,
  "integrity_kind" text COLLATE "C" NOT NULL,
  "integrity" text COLLATE "C" NOT NULL,
  "source_byte_length" bigint NOT NULL,
  "manifest_schema_version" bigint NOT NULL,
  "plan_integrity" text COLLATE "C" NOT NULL,
  "workspace" text COLLATE "C" NOT NULL,
  "agent_config_digest" text COLLATE "C" NOT NULL,
  "agent_owned_paths_json" text COLLATE "C" NOT NULL,
  "bootstrap_source_path" text COLLATE "C",
  "bootstrap_content_digest" text COLLATE "C",
  "status" text COLLATE "C" NOT NULL,
  "added_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("agent_id"),
  CHECK (("status" IN ('pending', 'workspace_ready', 'config_committed', 'complete', 'partial'))),
  UNIQUE ("workspace")
);

CREATE TABLE "template_mcp_server_refs" (
  "agent_id" text COLLATE "C" NOT NULL,
  "name" text COLLATE "C" NOT NULL,
  "schema_version" text COLLATE "C" NOT NULL,
  "config_digest" text COLLATE "C" NOT NULL,
  "relationship" text COLLATE "C" NOT NULL,
  "origin" text COLLATE "C" NOT NULL,
  "independent_owner" bigint NOT NULL DEFAULT 0,
  "status" text COLLATE "C" NOT NULL,
  "error" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("agent_id", "name"),
  CHECK (("relationship" IN ('managed', 'referenced'))),
  CHECK (("origin" IN ('template-introduced', 'pre-existing'))),
  CHECK (("independent_owner" IN (0, 1)))
);

CREATE TABLE "template_package_refs" (
  "agent_id" text COLLATE "C" NOT NULL,
  "package_kind" text COLLATE "C" NOT NULL,
  "package_source" text COLLATE "C" NOT NULL,
  "package_ref" text COLLATE "C" NOT NULL,
  "package_version" text COLLATE "C" NOT NULL,
  "package_integrity" text COLLATE "C" NOT NULL,
  "schema_version" text COLLATE "C" NOT NULL,
  "template_name" text COLLATE "C" NOT NULL,
  "package_status" text COLLATE "C" NOT NULL,
  "relationship" text COLLATE "C" NOT NULL,
  "origin" text COLLATE "C" NOT NULL,
  "independent_owner" bigint NOT NULL,
  "extension_id" text COLLATE "C",
  "extension_format" text COLLATE "C",
  "extension_detected_format" text COLLATE "C",
  "extension_mapped_json" text COLLATE "C",
  "extension_unavailable_json" text COLLATE "C",
  "extension_adapter_identity" text COLLATE "C",
  "installed_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("agent_id", "package_kind", "package_source", "package_ref", "package_version"),
  CHECK (("relationship" IN ('managed', 'referenced'))),
  CHECK (("origin" IN ('template-introduced', 'pre-existing'))),
  CHECK (("independent_owner" IN (0, 1)))
);

CREATE TABLE "template_workspace_files" (
  "agent_id" text COLLATE "C" NOT NULL,
  "target_path" text COLLATE "C" NOT NULL,
  "schema_version" text COLLATE "C" NOT NULL,
  "workspace" text COLLATE "C" NOT NULL,
  "source_path" text COLLATE "C" NOT NULL,
  "content_digest" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("agent_id", "target_path")
);

CREATE TABLE "web_push_subscriptions" (
  "endpoint_hash" text COLLATE "C" NOT NULL,
  "subscription_id" text COLLATE "C" NOT NULL,
  "endpoint" text COLLATE "C" NOT NULL,
  "p256dh" text COLLATE "C" NOT NULL,
  "auth" text COLLATE "C" NOT NULL,
  "device_id" text COLLATE "C",
  "user_profile_id" text COLLATE "C",
  "preferences_json" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("endpoint_hash"),
  UNIQUE ("subscription_id")
);

CREATE TABLE "worker_environment_credentials" (
  "environment_id" text COLLATE "C" NOT NULL,
  "credential_hash" text COLLATE "C" NOT NULL,
  "bundle_hash" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C",
  "rpc_set_version" bigint NOT NULL,
  "owner_epoch" bigint NOT NULL,
  "expires_at_ms" bigint NOT NULL,
  "delivered_at_ms" bigint,
  PRIMARY KEY ("environment_id"),
  CHECK (("rpc_set_version" >= 1)),
  CHECK (("owner_epoch" >= 0)),
  CHECK (("expires_at_ms" >= 0)),
  CHECK (("delivered_at_ms" >= 0)),
  UNIQUE ("credential_hash")
);

CREATE TABLE "worker_environments" (
  "environment_id" text COLLATE "C" NOT NULL,
  "provider_id" text COLLATE "C" NOT NULL,
  "profile_id" text COLLATE "C" NOT NULL,
  "profile_snapshot_json" text COLLATE "C" NOT NULL,
  "last_activated_at_ms" bigint,
  "preparation_key" text COLLATE "C",
  "preparation_purpose" text COLLATE "C",
  "preparation_demand_at_ms" bigint,
  "preparation_expires_at_ms" bigint,
  "preparation_consumed_at_ms" bigint,
  "provision_operation_id" text COLLATE "C" NOT NULL,
  "lease_id" text COLLATE "C",
  "node_setup_id" text COLLATE "C",
  "node_device_id" text COLLATE "C",
  "ssh_host" text COLLATE "C",
  "ssh_port" bigint,
  "ssh_user" text COLLATE "C",
  "ssh_host_key" text COLLATE "C",
  "ssh_key_ref_json" text COLLATE "C",
  "desktop_json" text COLLATE "C",
  "state" text COLLATE "C" NOT NULL,
  "bootstrap_bundle_hash" text COLLATE "C",
  "bootstrap_openclaw_version" text COLLATE "C",
  "bootstrap_protocol_features_json" text COLLATE "C",
  "bootstrap_install_kind" text COLLATE "C",
  "owner_epoch" bigint NOT NULL DEFAULT 0,
  "teardown_terminal_state" text COLLATE "C",
  "attached_session_ids_json" text COLLATE "C" NOT NULL DEFAULT '[]',
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "state_changed_at_ms" bigint NOT NULL,
  "idle_since_at_ms" bigint,
  "destroy_requested_at_ms" bigint,
  "last_error" text COLLATE "C",
  "shared_host" bigint,
  "resource_receipt_json" text COLLATE "C",
  "retention_json" text COLLATE "C",
  "provision_source_json" text COLLATE "C",
  PRIMARY KEY ("environment_id"),
  CHECK (("preparation_key" IS NULL AND "preparation_demand_at_ms" IS NULL AND "preparation_expires_at_ms" IS NULL AND "preparation_consumed_at_ms" IS NULL) OR ("preparation_key" IS NOT NULL AND (char_length("preparation_key") = 64) AND ("preparation_key" COLLATE "C" !~ '\\A.*[^0-9a-f].*\\Z') AND "preparation_demand_at_ms" IS NOT NULL AND ("preparation_demand_at_ms" BETWEEN 0 AND 9007199254740991) AND "preparation_expires_at_ms" IS NOT NULL AND ("preparation_expires_at_ms" > "preparation_demand_at_ms") AND ("preparation_expires_at_ms" <= 9007199254740991) AND ("preparation_consumed_at_ms" IS NULL OR (("preparation_consumed_at_ms" >= "preparation_demand_at_ms") AND ("preparation_consumed_at_ms" < "preparation_expires_at_ms"))))),
  CHECK ("ssh_port" IS NULL OR (("ssh_port" >= 1) AND ("ssh_port" <= 65535))),
  CHECK (("state" IN ('requested', 'provisioning', 'bootstrapping', 'ready', 'attached', 'idle', 'draining', 'destroying', 'destroyed', 'failed', 'orphaned'))),
  CHECK (("owner_epoch" >= 0)),
  CHECK (("teardown_terminal_state" IN ('destroyed', 'failed'))),
  UNIQUE ("provision_operation_id")
);

CREATE TABLE "worker_inference_turns" (
  "session_id" text COLLATE "C" NOT NULL,
  "run_epoch" bigint NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "turn_id" text COLLATE "C" NOT NULL,
  "environment_id" text COLLATE "C" NOT NULL,
  "request_hash" text COLLATE "C" NOT NULL,
  "state" text COLLATE "C" NOT NULL,
  "terminal_json" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("session_id", "run_epoch", "run_id", "turn_id"),
  CHECK (("run_epoch" >= 0)),
  CHECK (("state" IN ('pending', 'terminal'))),
  CHECK (("created_at_ms" >= 0)),
  CHECK (("updated_at_ms" >= 0)),
  CHECK ((("state" = 'pending') AND "terminal_json" IS NULL) OR (("state" = 'terminal') AND "terminal_json" IS NOT NULL))
);

CREATE TABLE "worker_session_placements" (
  "session_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "execution_mode" text COLLATE "C",
  "state" text COLLATE "C" NOT NULL,
  "environment_id" text COLLATE "C",
  "transition_generation" bigint NOT NULL DEFAULT 0,
  "active_owner_epoch" bigint,
  "workspace_base_manifest_ref" text COLLATE "C",
  "remote_workspace_dir" text COLLATE "C",
  "worker_bundle_hash" text COLLATE "C",
  "last_transcript_ack_cursor" bigint,
  "last_live_event_ack_cursor" bigint,
  "recovery_error" text COLLATE "C",
  "turn_claim_owner" text COLLATE "C",
  "turn_claim_id" text COLLATE "C",
  "turn_claim_run_id" text COLLATE "C",
  "turn_claim_generation" bigint,
  "turn_claim_owner_epoch" bigint,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "state_changed_at_ms" bigint NOT NULL,
  "terminal_reason" text COLLATE "C",
  "terminal_at_ms" bigint,
  PRIMARY KEY ("session_id"),
  CHECK (("execution_mode" IN ('worker-turn', 'remote-exec'))),
  CHECK (("state" IN ('local', 'requested', 'provisioning', 'syncing', 'starting', 'active', 'draining', 'reconciling', 'reclaimed', 'failed'))),
  CHECK (("transition_generation" >= 0)),
  CHECK ("active_owner_epoch" IS NULL OR ("active_owner_epoch" >= 1)),
  CHECK ("last_transcript_ack_cursor" IS NULL OR ("last_transcript_ack_cursor" >= 0)),
  CHECK ("last_live_event_ack_cursor" IS NULL OR ("last_live_event_ack_cursor" >= 0)),
  CHECK (("turn_claim_owner" IN ('local', 'worker'))),
  CHECK ("turn_claim_generation" IS NULL OR ("turn_claim_generation" >= 0)),
  CHECK ("turn_claim_owner_epoch" IS NULL OR ("turn_claim_owner_epoch" >= 1)),
  CHECK ((("state" IN ('local', 'requested')) AND "environment_id" IS NULL AND "active_owner_epoch" IS NULL AND "workspace_base_manifest_ref" IS NULL AND "remote_workspace_dir" IS NULL AND "worker_bundle_hash" IS NULL AND "last_transcript_ack_cursor" IS NULL AND "last_live_event_ack_cursor" IS NULL AND "recovery_error" IS NULL) OR ("state" IS NOT DISTINCT FROM 'provisioning' AND "active_owner_epoch" IS NULL AND "workspace_base_manifest_ref" IS NULL AND "remote_workspace_dir" IS NULL AND "worker_bundle_hash" IS NULL AND "last_transcript_ack_cursor" IS NULL AND "last_live_event_ack_cursor" IS NULL AND "recovery_error" IS NULL) OR ("state" IS NOT DISTINCT FROM 'syncing' AND "environment_id" IS NOT NULL AND "active_owner_epoch" IS NULL AND "workspace_base_manifest_ref" IS NULL AND "remote_workspace_dir" IS NULL AND "worker_bundle_hash" IS NOT NULL AND "last_transcript_ack_cursor" IS NULL AND "last_live_event_ack_cursor" IS NULL AND "recovery_error" IS NULL) OR ("state" IS NOT DISTINCT FROM 'starting' AND "environment_id" IS NOT NULL AND "active_owner_epoch" IS NULL AND "workspace_base_manifest_ref" IS NOT NULL AND "remote_workspace_dir" IS NOT NULL AND "worker_bundle_hash" IS NOT NULL AND "last_transcript_ack_cursor" IS NULL AND "last_live_event_ack_cursor" IS NULL AND "recovery_error" IS NULL) OR (("state" IN ('active', 'draining', 'reconciling')) AND "environment_id" IS NOT NULL AND "active_owner_epoch" IS NOT NULL AND "workspace_base_manifest_ref" IS NOT NULL AND "remote_workspace_dir" IS NOT NULL AND "worker_bundle_hash" IS NOT NULL AND "recovery_error" IS NULL) OR ("state" IS NOT DISTINCT FROM 'reclaimed' AND "environment_id" IS NOT NULL AND "active_owner_epoch" IS NOT NULL AND "workspace_base_manifest_ref" IS NOT NULL AND "remote_workspace_dir" IS NOT NULL AND "worker_bundle_hash" IS NOT NULL AND "recovery_error" IS NULL AND "turn_claim_owner" IS NULL AND "turn_claim_id" IS NULL AND "turn_claim_run_id" IS NULL AND "turn_claim_generation" IS NULL AND "turn_claim_owner_epoch" IS NULL) OR ("state" IS NOT DISTINCT FROM 'failed' AND "recovery_error" IS NOT NULL)),
  CHECK (("turn_claim_owner" IS NULL AND "turn_claim_id" IS NULL AND "turn_claim_run_id" IS NULL AND "turn_claim_generation" IS NULL AND "turn_claim_owner_epoch" IS NULL) OR ("turn_claim_owner" IS NOT DISTINCT FROM 'local' AND "turn_claim_id" IS NOT NULL AND "turn_claim_run_id" IS NOT NULL AND "turn_claim_generation" IS NOT NULL AND "turn_claim_owner_epoch" IS NULL) OR ("turn_claim_owner" IS NOT DISTINCT FROM 'worker' AND "turn_claim_id" IS NOT NULL AND "turn_claim_run_id" IS NOT NULL AND "turn_claim_generation" IS NOT NULL AND "turn_claim_owner_epoch" IS NOT NULL)),
  CHECK ("turn_claim_owner" IS NULL OR ("turn_claim_owner" IS NOT DISTINCT FROM 'local' AND (("state" IN ('local', 'requested', 'failed')) OR (("state" IN ('active', 'draining')) AND "execution_mode" IS NOT DISTINCT FROM 'remote-exec'))) OR ("turn_claim_owner" IS NOT DISTINCT FROM 'worker' AND ("state" IN ('active', 'draining')) AND ("execution_mode" IS NULL OR "execution_mode" IS NOT DISTINCT FROM 'worker-turn') AND "turn_claim_owner_epoch" IS NOT DISTINCT FROM "active_owner_epoch"))
);

CREATE TABLE "worker_session_tool_operations" (
  "source_session_id" text COLLATE "C" NOT NULL,
  "source_claim_id" text COLLATE "C" NOT NULL,
  "tool_call_id" text COLLATE "C" NOT NULL,
  "tool_name" text COLLATE "C" NOT NULL,
  "request_digest" text COLLATE "C" NOT NULL,
  "operation_seed" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "child_session_key" text COLLATE "C",
  "result_json" text COLLATE "C",
  "gateway_instance_id" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("source_session_id", "source_claim_id", "tool_call_id"),
  CHECK (("tool_name" IN ('sessions_spawn', 'sessions_send'))),
  CHECK (("status" IN ('running', 'succeeded', 'failed', 'unknown')))
);

CREATE TABLE "worker_transcript_commit_heads" (
  "session_id" text COLLATE "C" NOT NULL,
  "run_epoch" bigint NOT NULL,
  "environment_id" text COLLATE "C" NOT NULL,
  "next_seq" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("session_id", "run_epoch"),
  CHECK (("run_epoch" >= 0)),
  CHECK (("next_seq" >= 1)),
  CHECK (("updated_at_ms" >= 0))
);

CREATE TABLE "worker_transcript_commits" (
  "session_id" text COLLATE "C" NOT NULL,
  "run_epoch" bigint NOT NULL,
  "seq" bigint NOT NULL,
  "request_hash" text COLLATE "C" NOT NULL,
  "state" text COLLATE "C" NOT NULL,
  "result_json" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("session_id", "run_epoch", "seq"),
  CHECK (("run_epoch" >= 0)),
  CHECK (("seq" >= 1)),
  CHECK (("state" IN ('pending', 'terminal'))),
  CHECK (("created_at_ms" >= 0)),
  CHECK (("updated_at_ms" >= 0)),
  CHECK ((("state" = 'pending') AND "result_json" IS NULL) OR (("state" = 'terminal') AND "result_json" IS NOT NULL))
);

CREATE TABLE "worker_turn_tool_authorities" (
  "session_id" text COLLATE "C" NOT NULL,
  "environment_id" text COLLATE "C" NOT NULL,
  "owner_epoch" bigint NOT NULL,
  "placement_generation" bigint NOT NULL,
  "claim_id" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "tool_names_json" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("session_id"),
  CHECK (("owner_epoch" >= 1)),
  CHECK (("placement_generation" >= 0))
);

CREATE TABLE "worker_workspace_pending_results" (
  "session_id" text COLLATE "C" NOT NULL,
  "environment_id" text COLLATE "C" NOT NULL,
  "owner_epoch" bigint NOT NULL,
  "placement_generation" bigint NOT NULL,
  "claim_id" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "gateway_instance_id" text COLLATE "C" NOT NULL,
  "recovery_requested_at_ms" bigint,
  "workspace_accepted_at_ms" bigint,
  "staged_result_ref" text COLLATE "C",
  "repository_workspace_id" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "repository_disk_authority_json" text COLLATE "C",
  PRIMARY KEY ("session_id"),
  CHECK (("owner_epoch" >= 1)),
  CHECK (("placement_generation" >= 0))
);

CREATE TABLE "worker_workspace_reconciliations" (
  "session_id" text COLLATE "C" NOT NULL,
  "environment_id" text COLLATE "C" NOT NULL,
  "owner_epoch" bigint NOT NULL,
  "placement_generation" bigint NOT NULL,
  "base_manifest_ref" text COLLATE "C" NOT NULL,
  "current_manifest_ref" text COLLATE "C" NOT NULL,
  "plan_json" text COLLATE "C" NOT NULL,
  "base_pack" bytea NOT NULL,
  "created_at_ms" bigint NOT NULL,
  PRIMARY KEY ("session_id"),
  CHECK (("owner_epoch" >= 1)),
  CHECK (("placement_generation" >= 0)),
  CHECK ((octet_length("base_pack") <= 268435456))
);

CREATE TABLE "workspace_generated_bootstrap_hashes" (
  "workspace_key" text COLLATE "C" NOT NULL,
  "filename" text COLLATE "C" NOT NULL,
  "sha256" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("workspace_key", "filename")
);

CREATE TABLE "workspace_path_aliases" (
  "alias_key" text COLLATE "C" NOT NULL,
  "alias_path" text COLLATE "C" NOT NULL,
  "workspace_key" text COLLATE "C" NOT NULL,
  "workspace_path" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("alias_key")
);

CREATE TABLE "workspace_setup_state" (
  "workspace_key" text COLLATE "C" NOT NULL,
  "workspace_path" text COLLATE "C",
  "version" bigint,
  "bootstrap_seeded_at" text COLLATE "C",
  "setup_completed_at" text COLLATE "C",
  "updated_at" bigint,
  "attested_at_ms" bigint,
  "attestation_updated_at_ms" bigint,
  "bootstrap_deferred" bigint,
  PRIMARY KEY ("workspace_key"),
  CHECK ("version" IS NULL OR "workspace_path" IS NOT NULL)
);

CREATE TABLE "worktree_provisioned_file_chunks" (
  "worktree_id" text COLLATE "C" NOT NULL,
  "path" text COLLATE "C" NOT NULL,
  "chunk_index" bigint NOT NULL,
  "data" bytea NOT NULL,
  PRIMARY KEY ("worktree_id", "path", "chunk_index"),
  CHECK (("chunk_index" >= 0))
);

CREATE TABLE "worktrees" (
  "id" text COLLATE "C" NOT NULL,
  "repo_fingerprint" text COLLATE "C" NOT NULL,
  "repo_root" text COLLATE "C" NOT NULL,
  "path" text COLLATE "C" NOT NULL,
  "branch" text COLLATE "C" NOT NULL,
  "base_ref" text COLLATE "C" NOT NULL,
  "owner_kind" text COLLATE "C" NOT NULL,
  "owner_id" text COLLATE "C",
  "snapshot_ref" text COLLATE "C",
  "provisioned_paths_json" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "last_active_at" bigint NOT NULL,
  "removed_at" bigint,
  "run_end_cleanup_json" text COLLATE "C",
  "gc_protection_json" text COLLATE "C",
  PRIMARY KEY ("id"),
  CHECK (("owner_kind" IN ('manual', 'workboard', 'session')))
);

CREATE INDEX "idx_acp_replay_sessions_key_updated" ON "acp_replay_sessions" (("session_key") ASC, ("complete") ASC, ("updated_at") DESC, ("session_id") ASC);

CREATE INDEX "idx_acp_replay_sessions_updated" ON "acp_replay_sessions" (("updated_at") DESC, ("session_id") ASC);

CREATE INDEX "idx_acp_sessions_agent_activity" ON "acp_sessions" (("agent") ASC, ("last_activity_at") DESC, ("session_key") ASC);

CREATE INDEX "idx_acp_sessions_resume_acpx" ON "acp_sessions" (("resume_acpx_session_id") ASC NULLS FIRST);

CREATE INDEX "idx_acp_sessions_resume_agent" ON "acp_sessions" (("resume_agent_session_id") ASC NULLS FIRST);

CREATE INDEX "idx_acp_sessions_state_activity" ON "acp_sessions" (("state") ASC, ("last_activity_at") DESC, ("session_key") ASC);

CREATE INDEX "idx_apns_registrations_updated" ON "apns_registrations" (("updated_at_ms") DESC, ("node_id") ASC);

CREATE INDEX "idx_audit_events_agent_sequence" ON "audit_events" (("agent_id") ASC NULLS FIRST, ("sequence") DESC);

CREATE INDEX "idx_audit_events_channel_sequence" ON "audit_events" (("channel") ASC NULLS FIRST, ("sequence") DESC);

CREATE INDEX "idx_audit_events_direction_sequence" ON "audit_events" (("direction") ASC NULLS FIRST, ("sequence") DESC);

CREATE INDEX "idx_audit_events_kind_sequence" ON "audit_events" (("kind") ASC, ("sequence") DESC);

CREATE INDEX "idx_audit_events_run_sequence" ON "audit_events" (("run_id") ASC NULLS FIRST, ("sequence") DESC);

CREATE INDEX "idx_audit_events_session_sequence" ON "audit_events" (("session_key") ASC NULLS FIRST, ("sequence") DESC);

CREATE INDEX "idx_audit_events_status_sequence" ON "audit_events" (("status") ASC, ("sequence") DESC);

CREATE INDEX "idx_audit_events_time" ON "audit_events" (("occurred_at") DESC, ("sequence") DESC);

CREATE INDEX "idx_backup_runs_created" ON "backup_runs" (("created_at") DESC, ("id") ASC);

CREATE INDEX "capture_events_flow_idx" ON "capture_events" (("flow_id") ASC, ("ts") ASC);

CREATE INDEX "capture_events_session_ts_idx" ON "capture_events" (("session_id") ASC, ("ts") ASC);

CREATE INDEX "idx_channel_ingress_claims" ON "channel_ingress_events" (("queue_name") ASC, ("status") ASC, ("claimed_at") ASC NULLS FIRST);

CREATE INDEX "idx_channel_ingress_lane" ON "channel_ingress_events" (("queue_name") ASC, ("status") ASC, ("lane_key") ASC NULLS FIRST);

CREATE INDEX "idx_channel_ingress_pending" ON "channel_ingress_events" (("queue_name") ASC, ("status") ASC, ("received_at") ASC, ("event_id") ASC);

CREATE INDEX "idx_channel_pairing_allow_account" ON "channel_pairing_allow_entries" (("channel_key") ASC, ("account_id") ASC, ("sort_order") ASC, ("entry") ASC);

CREATE INDEX "idx_channel_pairing_requests_code" ON "channel_pairing_requests" (("channel_key") ASC, ("code") ASC);

CREATE INDEX "idx_channel_pairing_requests_created" ON "channel_pairing_requests" (("channel_key") ASC, ("created_at") ASC, ("request_id") ASC);

CREATE INDEX "idx_cron_job_scratch_store_updated" ON "cron_job_scratch" (("store_key") ASC, ("updated_at_ms") DESC, ("job_id") ASC);

CREATE INDEX "idx_cron_jobs_store_order" ON "cron_jobs" (("store_key") ASC, ("sort_order") ASC, ("updated_at") ASC, ("job_id") ASC);

CREATE INDEX "idx_current_conversation_bindings_conversation" ON "current_conversation_bindings" (("channel") ASC, ("account_id") ASC, ("conversation_kind") ASC, ("conversation_id") ASC);

CREATE INDEX "idx_current_conversation_bindings_expires" ON "current_conversation_bindings" (("expires_at") ASC NULLS FIRST, ("binding_key") ASC);

CREATE INDEX "idx_current_conversation_bindings_target" ON "current_conversation_bindings" (("target_session_key") ASC, ("updated_at") DESC, ("binding_key") ASC);

CREATE INDEX "idx_delivery_queue_bounded_retention" ON "delivery_queue_entries" (("queue_name") ASC, ("retention_id_prefix") ASC, ("enqueued_at") DESC, ("id") DESC) WHERE ("status" IN ('completed', 'failed')) AND ("recovery_state" = 'completed_bounded') AND "retention_id_prefix" IS NOT NULL;

CREATE INDEX "idx_delivery_queue_failed" ON "delivery_queue_entries" (("status") ASC, ("queue_name") ASC, ("failed_at") ASC NULLS FIRST, ("id") ASC);

CREATE INDEX "idx_delivery_queue_pending" ON "delivery_queue_entries" (("queue_name") ASC, ("status") ASC, ("enqueued_at") ASC, ("id") ASC);

CREATE INDEX "idx_delivery_queue_session" ON "delivery_queue_entries" (("queue_name") ASC, ("status") ASC, ("session_key") ASC, ("enqueued_at") ASC, ("id") ASC) WHERE "session_key" IS NOT NULL;

CREATE INDEX "idx_delivery_queue_target" ON "delivery_queue_entries" (("queue_name") ASC, ("status") ASC, ("channel") ASC, ("target") ASC, ("enqueued_at") ASC, ("id") ASC) WHERE "channel" IS NOT NULL AND "target" IS NOT NULL;

CREATE INDEX "idx_device_bootstrap_tokens_ts" ON "device_bootstrap_tokens" (("ts") ASC);

CREATE INDEX "idx_device_pairing_paired_approved" ON "device_pairing_paired" (("approved_at_ms") DESC, ("device_id") ASC);

CREATE INDEX "idx_device_pairing_pending_device" ON "device_pairing_pending" (("device_id") ASC, ("ts") DESC);

CREATE INDEX "idx_diagnostic_events_scope_sequence" ON "diagnostic_events" (("scope") ASC, ("sequence") ASC, ("event_key") ASC);

CREATE INDEX "idx_flow_runs_owner_key" ON "flow_runs" (("owner_key") ASC);

CREATE INDEX "idx_flow_runs_status" ON "flow_runs" (("status") ASC);

CREATE INDEX "idx_flow_runs_updated_at" ON "flow_runs" (("updated_at") ASC);

CREATE INDEX "idx_gateway_boot_lifecycle_started" ON "gateway_boot_lifecycle" (("started_at_ms") ASC);

CREATE INDEX "idx_gateway_restart_handoff_expiry" ON "gateway_restart_handoff" (("expires_at") ASC, ("pid") ASC);

CREATE INDEX "idx_gateway_restart_sentinel_ts" ON "gateway_restart_sentinel" (("ts") DESC, ("sentinel_key") ASC);

CREATE INDEX "idx_macos_port_guardian_records_port" ON "macos_port_guardian_records" (("port") ASC, ("timestamp") DESC);

CREATE INDEX "idx_managed_outgoing_images_agent_message" ON "managed_outgoing_image_records" (("session_key") ASC, ("agent_id") ASC NULLS FIRST, ("message_id") ASC, ("attachment_id") ASC) WHERE "message_id" IS NOT NULL;

CREATE INDEX "idx_managed_outgoing_images_agent_session" ON "managed_outgoing_image_records" (("session_key") ASC, ("agent_id") ASC NULLS FIRST, ("created_at") DESC, ("attachment_id") ASC);

CREATE INDEX "idx_managed_outgoing_images_message" ON "managed_outgoing_image_records" (("session_key") ASC, ("message_id") ASC, ("attachment_id") ASC) WHERE "message_id" IS NOT NULL;

CREATE INDEX "idx_managed_outgoing_images_session" ON "managed_outgoing_image_records" (("session_key") ASC, ("created_at") DESC, ("attachment_id") ASC);

CREATE INDEX "idx_meeting_transcript_sessions_account" ON "meeting_transcript_sessions" (("source_account_id") ASC NULLS FIRST);

CREATE INDEX "idx_meeting_transcript_sessions_agent" ON "meeting_transcript_sessions" (("metadata_agent_id") ASC NULLS FIRST);

CREATE INDEX "idx_meeting_transcript_sessions_chronology" ON "meeting_transcript_sessions" (("started_at_ms") DESC NULLS LAST, ("session_id") ASC, ("started_at") ASC);

CREATE INDEX "idx_meeting_transcript_sessions_export_key" ON "meeting_transcript_sessions" (("export_key") ASC);

CREATE INDEX "idx_meeting_transcript_sessions_id" ON "meeting_transcript_sessions" (("session_id") ASC, ("started_at") DESC);

CREATE INDEX "idx_meeting_transcript_sessions_slug" ON "meeting_transcript_sessions" (("session_slug") ASC, ("started_at") DESC);

CREATE INDEX "idx_meeting_transcript_sessions_source" ON "meeting_transcript_sessions" (("provider_id") ASC, ("source_account_id") ASC NULLS FIRST, ("source_guild_id") ASC NULLS FIRST, ("source_channel_id") ASC NULLS FIRST, ("source_meeting_url") ASC NULLS FIRST, ("source_thread_ts") ASC NULLS FIRST, ("source_file_id") ASC NULLS FIRST, ("stopped_at") DESC NULLS LAST, ("started_at") DESC, ("session_id") ASC);

CREATE INDEX "idx_meeting_transcript_sessions_started" ON "meeting_transcript_sessions" (("started_at") DESC, ("session_id") ASC);

CREATE INDEX "idx_meeting_transcript_utterances_id" ON "meeting_transcript_utterances" (("session_id") ASC, ("session_started_at") ASC, ("utterance_id") ASC) WHERE "utterance_id" IS NOT NULL;

CREATE INDEX "idx_migration_runs_started" ON "migration_runs" (("started_at") DESC, ("id") ASC);

CREATE INDEX "idx_migration_sources_path" ON "migration_sources" (("source_path") ASC, ("migration_kind") ASC, ("target_table") ASC);

CREATE INDEX "idx_migration_sources_run" ON "migration_sources" (("last_run_id") ASC, ("source_path") ASC);

CREATE INDEX "idx_native_hook_relay_bridges_expires" ON "native_hook_relay_bridges" (("expires_at_ms") ASC, ("relay_id") ASC);

CREATE INDEX "idx_official_external_plugin_catalog_snapshots_updated" ON "official_external_plugin_catalog_snapshots" (("updated_at_ms") DESC, ("feed_url") ASC);

CREATE UNIQUE INDEX "idx_operator_approvals_cursor_id" ON "operator_approvals" (("cursor_id") ASC);

CREATE UNIQUE INDEX "idx_operator_approvals_resolution_ref" ON "operator_approvals" (("resolution_ref") ASC);

CREATE INDEX "idx_operator_approvals_resolved" ON "operator_approvals" (("resolved_at_ms") ASC, ("approval_id") ASC) WHERE "resolved_at_ms" IS NOT NULL;

CREATE INDEX "idx_operator_approvals_runtime_pending" ON "operator_approvals" (("runtime_epoch") ASC, ("approval_id") ASC) WHERE ("status" = 'pending');

CREATE INDEX "idx_operator_approvals_source_run_resolved" ON "operator_approvals" (("source_run_id") ASC, ("resolved_at_ms") ASC, ("approval_id") ASC) WHERE "source_run_id" IS NOT NULL AND "resolved_at_ms" IS NOT NULL;

CREATE INDEX "idx_operator_approvals_source_session_created" ON "operator_approvals" (("source_session_key") ASC NULLS FIRST, ("created_at_ms") DESC, ("approval_id") ASC);

CREATE INDEX "idx_operator_approvals_status_expiry" ON "operator_approvals" (("status") ASC, ("expires_at_ms") ASC, ("approval_id") ASC);

CREATE INDEX "idx_plugin_binding_approvals_plugin" ON "plugin_binding_approvals" (("plugin_id") ASC, ("approved_at") DESC);

CREATE INDEX "idx_plugin_blob_expiry" ON "plugin_blob_entries" (("expires_at") ASC) WHERE "expires_at" IS NOT NULL;

CREATE INDEX "idx_plugin_blob_listing" ON "plugin_blob_entries" (("plugin_id") ASC, ("namespace") ASC, ("created_at") ASC, ("entry_key") ASC);

CREATE INDEX "idx_plugin_state_expiry" ON "plugin_state_entries" (("expires_at") ASC) WHERE "expires_at" IS NOT NULL;

CREATE INDEX "idx_plugin_state_listing" ON "plugin_state_entries" (("plugin_id") ASC, ("namespace") ASC, ("created_at") ASC, ("entry_key") ASC, ("expires_at") ASC NULLS FIRST);

CREATE INDEX "idx_sandbox_registry_last_used" ON "sandbox_registry_entries" (("registry_kind") ASC, ("last_used_at_ms") DESC, ("container_name") ASC) WHERE "last_used_at_ms" IS NOT NULL;

CREATE INDEX "idx_sandbox_registry_session" ON "sandbox_registry_entries" (("registry_kind") ASC, ("session_key") ASC, ("last_used_at_ms") DESC NULLS LAST, ("container_name") ASC) WHERE "session_key" IS NOT NULL;

CREATE INDEX "idx_sandbox_registry_updated" ON "sandbox_registry_entries" (("registry_kind") ASC, ("updated_at") DESC, ("container_name") ASC);

CREATE INDEX "idx_session_state_events_session_sequence" ON "session_state_events" (("session_key") ASC, ("sequence") DESC);

CREATE INDEX "idx_session_state_events_time" ON "session_state_events" (("occurred_at") DESC, ("sequence") DESC);

CREATE INDEX "idx_session_upstream_links_catalog_id" ON "session_upstream_links" (("catalog_id") ASC);

CREATE INDEX "idx_session_watch_cursors_target" ON "session_watch_cursors" (("target_session_key") ASC);

CREATE INDEX "idx_skill_uploads_expiry" ON "skill_uploads" (("expires_at") ASC);

CREATE INDEX "idx_skill_uploads_idempotency" ON "skill_uploads" (("idempotency_key_hash") ASC) WHERE "idempotency_key_hash" IS NOT NULL;

CREATE INDEX "idx_state_leases_expiry" ON "state_leases" (("expires_at") ASC, ("scope") ASC, ("lease_key") ASC) WHERE "expires_at" IS NOT NULL;

CREATE INDEX "idx_state_leases_owner" ON "state_leases" (("owner") ASC);

CREATE INDEX "idx_subagent_runs_child_session_key" ON "subagent_runs" (("child_session_key") ASC, ("created_at") DESC, ("run_id") ASC);

CREATE INDEX "idx_subagent_runs_controller_session_key" ON "subagent_runs" (("controller_session_key") ASC NULLS FIRST, ("created_at") DESC, ("run_id") ASC);

CREATE INDEX "idx_subagent_runs_requester_session_key" ON "subagent_runs" (("requester_session_key") ASC, ("created_at") DESC, ("run_id") ASC);

CREATE INDEX "idx_task_runs_cron_runtime_order" ON "task_runs" (("runtime") ASC, ("created_at") ASC, ("task_id") ASC) WHERE ("runtime" = 'cron');

CREATE INDEX "idx_task_runs_cron_source_order" ON "task_runs" (("source_id") ASC NULLS FIRST, ("created_at") ASC, ("task_id") ASC) WHERE ("runtime" = 'cron');

CREATE INDEX "idx_task_runs_runtime_run" ON "task_runs" (("runtime") ASC, ("run_id") ASC NULLS FIRST, ("source_id") ASC NULLS FIRST, ("created_at") ASC, ("task_id") ASC);

CREATE INDEX "idx_web_push_subscriptions_updated" ON "web_push_subscriptions" (("updated_at_ms") DESC, ("subscription_id") ASC);

CREATE UNIQUE INDEX "idx_worker_environments_provider_lease" ON "worker_environments" (("provider_id") ASC, ("lease_id") ASC) WHERE "lease_id" IS NOT NULL;

CREATE INDEX "idx_worker_environments_terminal_changed" ON "worker_environments" (("state_changed_at_ms") ASC, ("environment_id") ASC);

CREATE UNIQUE INDEX "idx_worker_inference_turns_pending_run" ON "worker_inference_turns" (("session_id") ASC, ("run_epoch") ASC, ("run_id") ASC) WHERE ("state" = 'pending');

CREATE INDEX "idx_worker_session_placements_environment" ON "worker_session_placements" (("environment_id") ASC) WHERE "environment_id" IS NOT NULL;

CREATE INDEX "idx_worker_session_placements_reconcile" ON "worker_session_placements" (("updated_at_ms") ASC, ("session_id") ASC);

CREATE INDEX "idx_worker_session_placements_session_key" ON "worker_session_placements" (("agent_id") ASC, ("session_key") ASC);

CREATE INDEX "idx_workspace_path_aliases_workspace" ON "workspace_path_aliases" (("workspace_key") ASC);

CREATE INDEX "idx_workspace_setup_state_path" ON "workspace_setup_state" (("workspace_path") ASC NULLS FIRST);

CREATE INDEX "idx_worktrees_removed_at" ON "worktrees" (("removed_at") ASC NULLS FIRST);

CREATE INDEX "idx_worktrees_repo_fingerprint" ON "worktrees" (("repo_fingerprint") ASC);

ALTER TABLE "acp_replay_events" ADD FOREIGN KEY ("session_id") REFERENCES "acp_replay_sessions" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "capture_events" ADD FOREIGN KEY ("data_blob_id") REFERENCES "capture_blobs" ("blob_id") ON UPDATE NO ACTION ON DELETE SET NULL NOT DEFERRABLE;

ALTER TABLE "capture_events" ADD FOREIGN KEY ("session_id") REFERENCES "capture_sessions" ("id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "meeting_transcript_summaries" ADD FOREIGN KEY ("session_id", "session_started_at") REFERENCES "meeting_transcript_sessions" ("session_id", "started_at") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "meeting_transcript_utterances" ADD FOREIGN KEY ("session_id", "session_started_at") REFERENCES "meeting_transcript_sessions" ("session_id", "started_at") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "migration_sources" ADD FOREIGN KEY ("last_run_id") REFERENCES "migration_runs" ("id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "skill_upload_chunks" ADD FOREIGN KEY ("upload_id") REFERENCES "skill_uploads" ("upload_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "task_delivery_state" ADD FOREIGN KEY ("task_id") REFERENCES "task_runs" ("task_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "worker_environment_credentials" ADD FOREIGN KEY ("environment_id") REFERENCES "worker_environments" ("environment_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "worker_inference_turns" ADD FOREIGN KEY ("environment_id") REFERENCES "worker_environments" ("environment_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "worker_session_tool_operations" ADD FOREIGN KEY ("source_session_id") REFERENCES "worker_session_placements" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "worker_transcript_commits" ADD FOREIGN KEY ("session_id", "run_epoch") REFERENCES "worker_transcript_commit_heads" ("session_id", "run_epoch") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "worker_turn_tool_authorities" ADD FOREIGN KEY ("session_id") REFERENCES "worker_session_placements" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "worker_workspace_pending_results" ADD FOREIGN KEY ("session_id") REFERENCES "worker_session_placements" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "worker_workspace_reconciliations" ADD FOREIGN KEY ("session_id") REFERENCES "worker_session_placements" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "workspace_generated_bootstrap_hashes" ADD FOREIGN KEY ("workspace_key") REFERENCES "workspace_setup_state" ("workspace_key") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`;return Object.defineProperty(this,"eagerSql",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get operatorRecoveryV25Sql(){let e=`-- Generated v24-to-v25 metadata-only transition; the engine owner publishes openclaw_schema_meta.
-- Subagent operator recovery requires the new reader; catalog and retained rows are unchanged.
UPDATE schema_meta SET schema_version = 25 WHERE meta_key = 'primary' AND schema_version = 24;
UPDATE config_machine_state SET value_json = '25' WHERE state_key = 'state.schema.contentVersion' AND value_json = '24';
`;return Object.defineProperty(this,"operatorRecoveryV25Sql",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get preWriteIndexesV27Sql(){let e={acp_replay_events:`CREATE INDEX "idx_acp_replay_events_session_seq" ON "acp_replay_events" (("session_id") ASC NULLS FIRST, ("seq") ASC NULLS FIRST);`,skill_usage:`CREATE INDEX "idx_skill_usage_key" ON "skill_usage" (("skill_key") ASC NULLS FIRST, ("skill_file") ASC NULLS FIRST);`,state_leases:`CREATE INDEX "idx_state_leases_owner" ON "state_leases" (("owner") ASC NULLS FIRST, ("updated_at") DESC NULLS LAST);`};return Object.defineProperty(this,"preWriteIndexesV27Sql",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get writeIndexesV27Sql(){let e=`
  DROP INDEX IF EXISTS idx_acp_replay_events_session_seq;
  DROP INDEX IF EXISTS idx_skill_usage_key;
  DROP INDEX IF EXISTS idx_state_leases_owner;

CREATE INDEX "idx_state_leases_owner" ON "state_leases" (("owner") ASC NULLS FIRST);`;return Object.defineProperty(this,"writeIndexesV27Sql",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get clientCredentialV29Sql(){let e=`-- Generated v28-to-v29 publication after the local credential owner has verified and retired source rows.
UPDATE schema_meta SET schema_version = 29 WHERE meta_key = 'primary' AND schema_version = 28;
`;return Object.defineProperty(this,"clientCredentialV29Sql",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get workspaceCasV35Sql(){let e=`-- Generated DDL-only v34-to-v35 transition; reconciliation converts retained rows online.
DO $workspace_cas$ BEGIN
IF to_regclass('local_workspace_projections') IS NOT NULL THEN
ALTER TABLE "local_workspace_projections" ADD COLUMN "tree_root_digest" bytea;
ALTER TABLE "local_workspace_projections" ADD COLUMN "source_paths_digest" bytea;
ALTER TABLE "local_workspace_projections" ADD COLUMN "canonical_fingerprints" bytea;
ALTER TABLE "local_workspace_projections" ADD COLUMN "projection_fingerprints" bytea;
CREATE TABLE "local_workspace_source_path_sets" (
  "path_digest" bytea NOT NULL,
  "paths_zstd" bytea NOT NULL,
  "sweep_epoch" bigint NOT NULL,
  PRIMARY KEY ("path_digest"),
  CHECK ((octet_length("path_digest") = 32))
);
CREATE TABLE "local_workspace_tree_packs" (
  "tree_digest" bytea NOT NULL,
  "records_json" text COLLATE "C" NOT NULL,
  "children_json" text COLLATE "C" NOT NULL,
  "sweep_epoch" bigint NOT NULL,
  PRIMARY KEY ("tree_digest"),
  CHECK ((octet_length("tree_digest") = 32))
);
END IF; END $workspace_cas$;
`;return Object.defineProperty(this,"workspaceCasV35Sql",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get clientCredentialSource(){let e={sql:`CREATE TABLE "device_auth_tokens" (
  "device_id" text COLLATE "C" NOT NULL,
  "role" text COLLATE "C" NOT NULL,
  "token" text COLLATE "C" NOT NULL,
  "scopes_json" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("device_id", "role")
);

CREATE TABLE "device_identities" (
  "identity_key" text COLLATE "C" NOT NULL,
  "device_id" text COLLATE "C" NOT NULL,
  "public_key_pem" text COLLATE "C" NOT NULL,
  "private_key_pem" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("identity_key")
);

CREATE TABLE "gateway_origin_device_tokens" (
  "gateway_scope" text COLLATE "C" NOT NULL,
  "device_id" text COLLATE "C" NOT NULL,
  "role" text COLLATE "C" NOT NULL,
  "token" text COLLATE "C" NOT NULL,
  "scopes_json" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("gateway_scope", "device_id", "role")
);

CREATE INDEX "idx_device_auth_tokens_updated" ON "device_auth_tokens" (("updated_at_ms") DESC NULLS LAST, ("device_id") ASC NULLS FIRST, ("role") ASC NULLS FIRST);

CREATE INDEX "idx_device_identities_device" ON "device_identities" (("device_id") ASC NULLS FIRST, ("updated_at_ms") DESC NULLS LAST);`,preData:[0,926],postData:[926,1225],tables:[{name:`device_auth_tokens`,identities:[]},{name:`device_identities`,identities:[]},{name:`gateway_origin_device_tokens`,identities:[]}],expectedCatalog:[{table:`device_auth_tokens`,kind:`table`,value:null},{table:`device_auth_tokens`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`device_auth_tokens`,kind:`column`,value:{name:`role`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`device_auth_tokens`,kind:`column`,value:{name:`token`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`device_auth_tokens`,kind:`column`,value:{name:`scopes_json`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`device_auth_tokens`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`device_auth_tokens`,kind:`primaryKey`,value:[`device_id`,`role`]},{table:`device_auth_tokens`,kind:`indexes`,value:2},{table:`device_auth_tokens`,kind:`checks`,value:0},{table:`device_identities`,kind:`table`,value:null},{table:`device_identities`,kind:`column`,value:{name:`identity_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`device_identities`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`device_identities`,kind:`column`,value:{name:`public_key_pem`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`device_identities`,kind:`column`,value:{name:`private_key_pem`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`device_identities`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`device_identities`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`device_identities`,kind:`primaryKey`,value:[`identity_key`]},{table:`device_identities`,kind:`indexes`,value:2},{table:`device_identities`,kind:`checks`,value:0},{table:`gateway_origin_device_tokens`,kind:`table`,value:null},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`gateway_scope`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`role`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`token`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`scopes_json`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`gateway_origin_device_tokens`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`gateway_origin_device_tokens`,kind:`primaryKey`,value:[`gateway_scope`,`device_id`,`role`]},{table:`gateway_origin_device_tokens`,kind:`indexes`,value:1},{table:`gateway_origin_device_tokens`,kind:`checks`,value:0}]};return Object.defineProperty(this,"clientCredentialSource",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get fragments(){let e=[{id:`local_workspace_projections`,tables:[`local_workspace_projections`,`local_workspace_manifest_nodes`,`local_workspace_tree_packs`,`local_workspace_source_path_sets`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "local_workspace_manifest_nodes" (
  "worktree_id" text COLLATE "C" NOT NULL,
  "path" text COLLATE "C" NOT NULL,
  "node_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("worktree_id", "path")
);

CREATE TABLE "local_workspace_projections" (
  "worktree_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "lifecycle_revision" text COLLATE "C",
  "projection_path" text COLLATE "C" NOT NULL,
  "base_commit" text COLLATE "C" NOT NULL,
  "source_paths_json" text COLLATE "C" NOT NULL,
  "baseline_json" text COLLATE "C",
  "baseline_ref" text COLLATE "C",
  "pending_ref" text COLLATE "C",
  "pending_target" text COLLATE "C",
  "paused_runtimes_json" text COLLATE "C",
  "journal_json" text COLLATE "C",
  "journal_pack" bytea,
  "revision" bigint NOT NULL DEFAULT 0,
  "created_at_ms" bigint NOT NULL,
  "checkpoint_json" text COLLATE "C",
  "tree_root_digest" bytea,
  "source_paths_digest" bytea,
  "canonical_fingerprints" bytea,
  "projection_fingerprints" bytea,
  PRIMARY KEY ("worktree_id"),
  CHECK (("pending_target" IN ('canonical', 'projection'))),
  CHECK ("journal_pack" IS NULL OR (octet_length("journal_pack") <= 268435456)),
  CHECK (("revision" >= 0)),
  CHECK ("baseline_json" IS NULL OR "baseline_ref" IS NOT NULL),
  CHECK ((("journal_json" IS NULL) = ("journal_pack" IS NULL))),
  UNIQUE ("projection_path")
);

CREATE TABLE "local_workspace_source_path_sets" (
  "path_digest" bytea NOT NULL,
  "paths_zstd" bytea NOT NULL,
  "sweep_epoch" bigint NOT NULL,
  PRIMARY KEY ("path_digest"),
  CHECK ((octet_length("path_digest") = 32))
);

CREATE TABLE "local_workspace_tree_packs" (
  "tree_digest" bytea NOT NULL,
  "records_json" text COLLATE "C" NOT NULL,
  "children_json" text COLLATE "C" NOT NULL,
  "sweep_epoch" bigint NOT NULL,
  PRIMARY KEY ("tree_digest"),
  CHECK ((octet_length("tree_digest") = 32))
);

ALTER TABLE "local_workspace_manifest_nodes" ADD FOREIGN KEY ("worktree_id") REFERENCES "local_workspace_projections" ("worktree_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`user_profiles`,tables:[`user_profiles`,`user_profile_emails`,`user_profile_identities`],indexes:[`idx_user_profile_emails_profile_id`,`idx_user_profile_identities_profile_id`,`idx_user_profile_identities_authorization`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "user_profile_emails" (
  "email" text COLLATE "C" NOT NULL,
  "profile_id" text COLLATE "C" NOT NULL,
  "binding_id" text COLLATE "C",
  "created_at" bigint NOT NULL,
  PRIMARY KEY ("email")
);

CREATE TABLE "user_profile_identities" (
  "provider" text COLLATE "C" NOT NULL,
  "subject" text COLLATE "C" NOT NULL,
  "profile_id" text COLLATE "C" NOT NULL,
  "canonical_login" text COLLATE "C",
  "verified_email_json" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "authorization_id" text COLLATE "C",
  "authorization_basis_json" text COLLATE "C",
  PRIMARY KEY ("provider", "subject")
);

CREATE TABLE "user_profiles" (
  "id" text COLLATE "C" NOT NULL,
  "display_name" text COLLATE "C",
  "primary_github_account_id" bigint,
  "avatar" bytea,
  "avatar_mime" text COLLATE "C",
  "avatar_sha256" text COLLATE "C",
  "merged_into" text COLLATE "C",
  "role" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX "idx_user_profile_emails_profile_id" ON "user_profile_emails" (("profile_id") ASC);

CREATE UNIQUE INDEX "idx_user_profile_identities_authorization" ON "user_profile_identities" (("authorization_id") ASC NULLS FIRST);

CREATE INDEX "idx_user_profile_identities_profile_id" ON "user_profile_identities" (("profile_id") ASC);
`},{id:`skill_library_entries`,tables:[`skill_library_entries`,`skill_library_revisions`,`skill_library_events`,`skill_library_uploads`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "skill_library_entries" (
  "skill_id" text COLLATE "C" NOT NULL,
  "owner_profile_id" text COLLATE "C",
  "author_profile_id" text COLLATE "C" NOT NULL,
  "slug" text COLLATE "C" NOT NULL,
  "current_revision" text COLLATE "C" NOT NULL,
  "shared" bigint NOT NULL,
  "enabled" bigint NOT NULL,
  "removed" bigint NOT NULL,
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("skill_id")
);

CREATE TABLE "skill_library_events" (
  "event_id" text COLLATE "C" NOT NULL,
  "skill_id" text COLLATE "C" NOT NULL,
  "revision" text COLLATE "C" NOT NULL,
  "action" text COLLATE "C" NOT NULL,
  "actor_profile_id" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  PRIMARY KEY ("event_id")
);

CREATE TABLE "skill_library_revisions" (
  "skill_id" text COLLATE "C" NOT NULL,
  "revision" text COLLATE "C" NOT NULL,
  "description" text COLLATE "C" NOT NULL,
  "files_json" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  PRIMARY KEY ("skill_id", "revision")
);

CREATE TABLE "skill_library_uploads" (
  "upload_id" text COLLATE "C" NOT NULL,
  "owner_profile_id" text COLLATE "C" NOT NULL,
  "slug" text COLLATE "C" NOT NULL,
  "size_bytes" bigint NOT NULL,
  "sha256" text COLLATE "C" NOT NULL,
  "archive_blob" bytea NOT NULL,
  "expires_at" bigint NOT NULL,
  "published_skill_id" text COLLATE "C",
  PRIMARY KEY ("upload_id")
);
`},{id:`operator_approval_standing_grants`,tables:[`operator_approval_standing_grants`,`operator_approval_standing_grant_generations`],indexes:[`idx_operator_approval_standing_grants_binding`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "operator_approval_standing_grant_generations" (
  "grant_id" text COLLATE "C" NOT NULL,
  "job_definition_generation" bigint NOT NULL,
  PRIMARY KEY ("grant_id"),
  CHECK (("job_definition_generation" >= 1))
);

CREATE TABLE "operator_approval_standing_grants" (
  "grant_id" text COLLATE "C" NOT NULL,
  "minted_by_approval_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "cron_job_id" text COLLATE "C" NOT NULL,
  "job_config_revision" text COLLATE "C" NOT NULL,
  "operation_binding" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "expires_at_ms" bigint,
  "revoked_at_ms" bigint,
  "revoked_by" text COLLATE "C",
  "last_used_at_ms" bigint,
  "use_count" bigint NOT NULL DEFAULT 0,
  PRIMARY KEY ("grant_id"),
  CHECK ((char_length("grant_id") > 0)),
  CHECK ((char_length("agent_id") > 0)),
  CHECK ((char_length("cron_job_id") > 0)),
  CHECK ((char_length("job_config_revision") > 0)),
  CHECK ((char_length("operation_binding") > 0)),
  CHECK ("expires_at_ms" IS NULL OR ("expires_at_ms" >= "created_at_ms"))
);

CREATE INDEX "idx_operator_approval_standing_grants_binding" ON "operator_approval_standing_grants" (("agent_id") ASC, ("cron_job_id") ASC, ("operation_binding") ASC, ("created_at_ms") DESC);

ALTER TABLE "operator_approval_standing_grant_generations" ADD FOREIGN KEY ("grant_id") REFERENCES "operator_approval_standing_grants" ("grant_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "operator_approval_standing_grants" ADD FOREIGN KEY ("minted_by_approval_id") REFERENCES "operator_approvals" ("approval_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`worker_environment_session_attachments`,tables:[`worker_environment_session_attachments`],indexes:[`worker_environment_session_attachments_session_key`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "worker_environment_session_attachments" (
  "session_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "session_lifecycle_revision" text COLLATE "C",
  "environment_id" text COLLATE "C" NOT NULL,
  "generation" bigint NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "last_used_at_ms" bigint NOT NULL,
  "closed_at_ms" bigint,
  PRIMARY KEY ("session_id"),
  CHECK (("generation" >= 1)),
  UNIQUE ("environment_id")
);

CREATE INDEX "worker_environment_session_attachments_session_key" ON "worker_environment_session_attachments" (("agent_id") ASC, ("session_key") ASC);

ALTER TABLE "worker_environment_session_attachments" ADD FOREIGN KEY ("environment_id") REFERENCES "worker_environments" ("environment_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`durable_background_processes`,tables:[`durable_background_processes`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "durable_background_processes" (
  "id" text COLLATE "C" NOT NULL,
  "record_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("id")
);
`},{id:`sandbox_persistent_execs`,tables:[`sandbox_persistent_execs`],indexes:[`idx_sandbox_persistent_execs_container`,`idx_sandbox_persistent_execs_container_name`,`idx_sandbox_persistent_execs_source`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "sandbox_persistent_execs" (
  "owner_key" text COLLATE "C" NOT NULL,
  "source_identity" text COLLATE "C" NOT NULL,
  "attempt_id" text COLLATE "C" NOT NULL,
  "owner_json" text COLLATE "C" NOT NULL,
  "backend_id" text COLLATE "C" NOT NULL,
  "backend_target_json" text COLLATE "C" NOT NULL,
  "workspace_binding_json" text COLLATE "C" NOT NULL,
  "container_id" text COLLATE "C" NOT NULL,
  "container_name" text COLLATE "C" NOT NULL,
  "container_started_at" text COLLATE "C" NOT NULL,
  "revision" bigint NOT NULL,
  "phase" text COLLATE "C" NOT NULL,
  "receipt_json" text COLLATE "C",
  "error" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("owner_key"),
  CHECK (("backend_id" = 'docker')),
  CHECK (("revision" > 0)),
  CHECK (("phase" IN ('reserved', 'prepared', 'running', 'stopping', 'uncertain', 'stopped'))),
  CHECK (("phase" NOT IN ('prepared', 'running')) OR "receipt_json" IS NOT NULL),
  UNIQUE ("attempt_id")
);

CREATE INDEX "idx_sandbox_persistent_execs_container" ON "sandbox_persistent_execs" (("container_id") ASC, ("owner_key") ASC);

CREATE INDEX "idx_sandbox_persistent_execs_container_name" ON "sandbox_persistent_execs" (("container_name") ASC, ("owner_key") ASC);

CREATE INDEX "idx_sandbox_persistent_execs_source" ON "sandbox_persistent_execs" (("source_identity") ASC, ("owner_key") ASC);
`},{id:`user_background_images`,tables:[`user_background_images`],indexes:[],dependencies:[`user_profiles`],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "user_background_images" (
  "profile_id" text COLLATE "C" NOT NULL,
  "asset_id" text COLLATE "C" NOT NULL,
  "image" bytea NOT NULL,
  "width" bigint NOT NULL,
  "height" bigint NOT NULL,
  PRIMARY KEY ("profile_id"),
  CHECK ((octet_length("image") BETWEEN 1 AND 2097152)),
  CHECK (("width" BETWEEN 1 AND 2560)),
  CHECK (("height" BETWEEN 1 AND 2560)),
  UNIQUE ("asset_id")
);

ALTER TABLE "user_background_images" ADD FOREIGN KEY ("profile_id") REFERENCES "user_profiles" ("id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`update_runs`,tables:[`update_runs`],indexes:[`idx_update_runs_created`,`idx_update_runs_active`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "update_runs" (
  "run_id" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "trigger" text COLLATE "C" NOT NULL,
  "phase" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "reason" text COLLATE "C",
  "origin_json" text COLLATE "C" NOT NULL,
  "target_json" text COLLATE "C" NOT NULL,
  "before_json" text COLLATE "C" NOT NULL,
  "after_json" text COLLATE "C" NOT NULL,
  "steps_json" text COLLATE "C" NOT NULL,
  "verification_json" text COLLATE "C" NOT NULL,
  "repair_json" text COLLATE "C" NOT NULL,
  "confirmed_at_ms" bigint,
  "finished_at_ms" bigint,
  "downtime_ms" bigint,
  PRIMARY KEY ("run_id"),
  CHECK (("trigger" IN ('chat', 'control-ui', 'cli', 'campaign', 'mac-app', 'api'))),
  CHECK (("phase" IN ('requested', 'staging', 'validating', 'repairing', 'activating', 'restarting', 'verifying', 'finished'))),
  CHECK (("status" IN ('running', 'succeeded', 'failed', 'rolled-back', 'skipped'))),
  CHECK ((octet_length(convert_to("origin_json", 'UTF8')) <= 16384)),
  CHECK ((octet_length(convert_to("target_json", 'UTF8')) <= 16384)),
  CHECK ((octet_length(convert_to("before_json", 'UTF8')) <= 16384)),
  CHECK ((octet_length(convert_to("after_json", 'UTF8')) <= 16384)),
  CHECK ((octet_length(convert_to("steps_json", 'UTF8')) <= 16384)),
  CHECK ((octet_length(convert_to("verification_json", 'UTF8')) <= 16384)),
  CHECK ((octet_length(convert_to("repair_json", 'UTF8')) <= 16384)),
  CHECK ((("status" = 'running') AND ("phase" != 'finished') AND "finished_at_ms" IS NULL) OR (("status" != 'running') AND ("phase" = 'finished') AND "finished_at_ms" IS NOT NULL))
);

CREATE INDEX "idx_update_runs_active" ON "update_runs" (("status") ASC, ("created_at_ms") DESC, ("run_id") ASC);

CREATE INDEX "idx_update_runs_created" ON "update_runs" (("created_at_ms") DESC, ("run_id") ASC);
`},{id:`session_repository_workspaces`,tables:[`session_repository_workspaces`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "session_repository_workspaces" (
  "workspace_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "url" text COLLATE "C" NOT NULL,
  "requested_ref" text COLLATE "C",
  "run_setup_script" bigint NOT NULL DEFAULT 0,
  "base_commit" text COLLATE "C",
  "base_manifest_hash" text COLLATE "C",
  "branch" text COLLATE "C" NOT NULL,
  "checkpoint_ref" text COLLATE "C",
  "manifest_hash" text COLLATE "C",
  "revision" bigint NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "disk_authority_json" text COLLATE "C",
  PRIMARY KEY ("workspace_id"),
  CHECK ((char_length("workspace_id") = 36)),
  CHECK ((char_length("agent_id") BETWEEN 1 AND 128)),
  CHECK ((char_length("session_key") BETWEEN 1 AND 1024)),
  CHECK ((char_length("url") BETWEEN 1 AND 4096)),
  CHECK ("requested_ref" IS NULL OR (char_length("requested_ref") BETWEEN 1 AND 1024)),
  CHECK (("run_setup_script" IN (0, 1))),
  CHECK ("base_commit" IS NULL OR (char_length("base_commit") IN (40, 64))),
  CHECK ((char_length("branch") BETWEEN 1 AND 256)),
  CHECK (("revision" >= 0)),
  CHECK ("base_manifest_hash" IS NULL OR "base_commit" IS NOT NULL),
  CHECK (("checkpoint_ref" IS NULL AND "manifest_hash" IS NULL) OR ("checkpoint_ref" IS NOT NULL AND "manifest_hash" IS NOT NULL AND "base_manifest_hash" IS NOT NULL)),
  UNIQUE ("agent_id", "session_key")
);
`},{id:`github_repository_publication_requests`,tables:[`github_repository_publication_requests`],indexes:[`idx_github_repository_publication_shared_request`,`idx_github_repository_publication_personal_request`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "github_repository_publication_requests" (
  "request_id" text COLLATE "C" NOT NULL,
  "owner_profile_id" text COLLATE "C",
  "connection_generation" text COLLATE "C",
  "idempotency_key" text COLLATE "C" NOT NULL,
  "request_digest" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "session_lifecycle_revision" text COLLATE "C",
  "requester_authority_json" text COLLATE "C",
  "session_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "workspace_id" text COLLATE "C" NOT NULL,
  "checkpoint_ref" text COLLATE "C",
  "checkpoint_digest" text COLLATE "C",
  "claim_id" text COLLATE "C",
  "run_id" text COLLATE "C",
  "environment_id" text COLLATE "C",
  "owner_epoch" bigint,
  "placement_generation" bigint,
  "identity_source" text COLLATE "C" NOT NULL,
  "identity_profile_id" text COLLATE "C",
  "identity_account_id" bigint NOT NULL,
  "identity_login" text COLLATE "C" NOT NULL,
  "title" text COLLATE "C",
  "body" text COLLATE "C",
  "status" text COLLATE "C" NOT NULL,
  "gateway_instance_id" text COLLATE "C",
  "execution_id" text COLLATE "C",
  "last_effect" text COLLATE "C",
  "effect_state" text COLLATE "C",
  "push_repository" text COLLATE "C",
  "repository" text COLLATE "C",
  "branch" text COLLATE "C" NOT NULL,
  "base_branch" text COLLATE "C",
  "source_head_commit" text COLLATE "C",
  "source_index_tree" text COLLATE "C",
  "workspace_tree" text COLLATE "C",
  "previous_head_commit" text COLLATE "C",
  "pushed_head_commit" text COLLATE "C",
  "head_commit" text COLLATE "C",
  "pull_request_url" text COLLATE "C",
  "error_code" text COLLATE "C",
  "next_action" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "reported_at_ms" bigint,
  "draft" bigint,
  PRIMARY KEY ("request_id"),
  CHECK (("identity_source" IN ('system-detected', 'system-configured', 'agent-override', 'personal'))),
  CHECK (("status" IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed'))),
  CHECK (("last_effect" IN ('push', 'pull_request'))),
  CHECK (("effect_state" IN ('dispatched', 'observed'))),
  CHECK ((("identity_source" = 'personal') AND "owner_profile_id" IS NOT NULL AND "connection_generation" IS NOT NULL) OR (("identity_source" <> 'personal') AND "owner_profile_id" IS NULL AND "connection_generation" IS NULL)),
  CHECK (("checkpoint_ref" IS NULL AND "checkpoint_digest" IS NULL) OR ("checkpoint_ref" IS NOT NULL AND "checkpoint_digest" IS NOT NULL)),
  CHECK (("last_effect" IS NULL AND "effect_state" IS NULL) OR ("last_effect" IS NOT NULL AND "effect_state" IS NOT NULL))
);

CREATE UNIQUE INDEX "idx_github_repository_publication_personal_request" ON "github_repository_publication_requests" (("owner_profile_id") ASC, ("session_id") ASC, ("idempotency_key") ASC) WHERE "owner_profile_id" IS NOT NULL;

CREATE UNIQUE INDEX "idx_github_repository_publication_shared_request" ON "github_repository_publication_requests" (("session_id") ASC, ("idempotency_key") ASC) WHERE "owner_profile_id" IS NULL;
`},{id:`github_publication_session_lifecycles`,tables:[`github_publication_session_lifecycles`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "github_publication_session_lifecycles" (
  "publication_kind" text COLLATE "C" NOT NULL,
  "request_id" text COLLATE "C" NOT NULL,
  "lifecycle_revision" text COLLATE "C",
  "requester_authority_json" text COLLATE "C",
  PRIMARY KEY ("publication_kind", "request_id"),
  CHECK (("publication_kind" IN ('shared', 'personal')))
);
`},{id:`github_personal_publication_requests`,tables:[`github_personal_publication_requests`],indexes:[`idx_github_personal_publication_owner_session`,`idx_github_personal_publication_pending`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "github_personal_publication_requests" (
  "request_id" text COLLATE "C" NOT NULL,
  "owner_profile_id" text COLLATE "C" NOT NULL,
  "connection_generation" text COLLATE "C" NOT NULL,
  "idempotency_key" text COLLATE "C" NOT NULL,
  "request_digest" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "worktree_id" text COLLATE "C" NOT NULL,
  "repository_fingerprint" text COLLATE "C" NOT NULL,
  "identity_source" text COLLATE "C" NOT NULL,
  "identity_profile_id" text COLLATE "C" NOT NULL,
  "identity_account_id" bigint NOT NULL,
  "identity_login" text COLLATE "C" NOT NULL,
  "title" text COLLATE "C",
  "body" text COLLATE "C",
  "status" text COLLATE "C" NOT NULL,
  "gateway_instance_id" text COLLATE "C",
  "execution_id" text COLLATE "C",
  "last_effect" text COLLATE "C",
  "effect_state" text COLLATE "C",
  "push_repository" text COLLATE "C" NOT NULL,
  "repository" text COLLATE "C" NOT NULL,
  "branch" text COLLATE "C" NOT NULL,
  "base_branch" text COLLATE "C" NOT NULL,
  "source_head_commit" text COLLATE "C" NOT NULL,
  "source_index_tree" text COLLATE "C" NOT NULL,
  "workspace_tree" text COLLATE "C" NOT NULL,
  "head_commit" text COLLATE "C",
  "pull_request_url" text COLLATE "C",
  "error_code" text COLLATE "C",
  "next_action" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "reported_at_ms" bigint,
  "draft" bigint,
  PRIMARY KEY ("request_id"),
  CHECK ((char_length("request_id") = 36)),
  CHECK ((char_length("owner_profile_id") BETWEEN 1 AND 128)),
  CHECK ((char_length("connection_generation") = 36)),
  CHECK ((char_length("idempotency_key") BETWEEN 1 AND 128)),
  CHECK ((char_length("request_digest") = 64)),
  CHECK ((char_length("session_id") BETWEEN 1 AND 128)),
  CHECK ((char_length("session_key") BETWEEN 1 AND 1024)),
  CHECK ((char_length("agent_id") BETWEEN 1 AND 128)),
  CHECK ((char_length("worktree_id") BETWEEN 1 AND 128)),
  CHECK ((char_length("repository_fingerprint") BETWEEN 1 AND 256)),
  CHECK (("identity_source" = 'personal')),
  CHECK ((char_length("identity_profile_id") = 36)),
  CHECK (("identity_account_id" >= 1)),
  CHECK ((char_length("identity_login") BETWEEN 1 AND 39)),
  CHECK ("title" IS NULL OR (char_length("title") BETWEEN 1 AND 256)),
  CHECK ("body" IS NULL OR (char_length("body") BETWEEN 1 AND 8192)),
  CHECK (("status" IN ('requested', 'publishing', 'needs_confirmation', 'published', 'failed'))),
  CHECK ("gateway_instance_id" IS NULL OR (char_length("gateway_instance_id") BETWEEN 1 AND 128)),
  CHECK ("execution_id" IS NULL OR (char_length("execution_id") = 36)),
  CHECK ("last_effect" IS NULL OR ("last_effect" IN ('push', 'pull_request'))),
  CHECK ("effect_state" IS NULL OR ("effect_state" IN ('dispatched', 'observed'))),
  CHECK ((char_length("push_repository") BETWEEN 3 AND 256)),
  CHECK ((char_length("repository") BETWEEN 3 AND 256)),
  CHECK ((char_length("branch") BETWEEN 1 AND 256)),
  CHECK ((char_length("base_branch") BETWEEN 1 AND 256)),
  CHECK ((char_length("source_head_commit") IN (40, 64))),
  CHECK ((char_length("source_index_tree") IN (40, 64))),
  CHECK ((char_length("workspace_tree") IN (40, 64))),
  CHECK ("head_commit" IS NULL OR (char_length("head_commit") IN (40, 64))),
  CHECK ("pull_request_url" IS NULL OR (char_length("pull_request_url") BETWEEN 1 AND 2048)),
  CHECK ("error_code" IS NULL OR (char_length("error_code") BETWEEN 1 AND 64)),
  CHECK ("next_action" IS NULL OR (char_length("next_action") BETWEEN 1 AND 1024)),
  CHECK (("created_at_ms" >= 0)),
  CHECK (("updated_at_ms" >= "created_at_ms")),
  CHECK ((("status" = 'publishing') AND "gateway_instance_id" IS NOT NULL AND "execution_id" IS NOT NULL) OR ("status" <> 'publishing')),
  CHECK (("last_effect" IS NULL AND "effect_state" IS NULL) OR ("last_effect" IS NOT NULL AND "effect_state" IS NOT NULL)),
  CHECK ((("status" = 'published') AND "pull_request_url" IS NOT NULL AND "head_commit" IS NOT NULL AND "error_code" IS NULL AND "next_action" IS NULL) OR (("status" = 'failed') AND "error_code" IS NOT NULL AND "next_action" IS NOT NULL) OR (("status" IN ('requested', 'publishing', 'needs_confirmation')) AND "error_code" IS NULL AND "next_action" IS NULL)),
  UNIQUE ("owner_profile_id", "session_id", "idempotency_key")
);

CREATE INDEX "idx_github_personal_publication_owner_session" ON "github_personal_publication_requests" (("owner_profile_id") ASC, ("session_id") ASC, ("created_at_ms") ASC);

CREATE INDEX "idx_github_personal_publication_pending" ON "github_personal_publication_requests" (("status") ASC, ("updated_at_ms") ASC, ("request_id") ASC);
`},{id:`cron_job_runtime_authorities`,tables:[`cron_job_runtime_authorities`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "cron_job_runtime_authorities" (
  "store_key" text COLLATE "C" NOT NULL,
  "job_id" text COLLATE "C" NOT NULL,
  "authority_json" text COLLATE "C",
  "authority_input_fingerprint" text COLLATE "C",
  "recovery_required" bigint NOT NULL,
  PRIMARY KEY ("store_key", "job_id"),
  CHECK (("recovery_required" IN (0, 1))),
  CHECK ((("recovery_required" = 0) AND "authority_json" IS NOT NULL AND "authority_input_fingerprint" IS NOT NULL) OR (("recovery_required" = 1) AND "authority_json" IS NULL AND "authority_input_fingerprint" IS NULL))
);

ALTER TABLE "cron_job_runtime_authorities" ADD FOREIGN KEY ("store_key", "job_id") REFERENCES "cron_jobs" ("store_key", "job_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`cron_run_trigger_state_retirements`,tables:[`cron_run_trigger_state_retirements`],indexes:[],dependencies:[`cron_run_receipts`],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "cron_run_trigger_state_retirements" (
  "receipt_id" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("receipt_id")
);

ALTER TABLE "cron_run_trigger_state_retirements" ADD FOREIGN KEY ("receipt_id") REFERENCES "cron_run_receipts" ("receipt_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`execution_identity_contexts`,tables:[`execution_identity_contexts`],indexes:[`execution_identity_contexts_run_created_idx`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "execution_identity_contexts" (
  "context_id" text COLLATE "C" NOT NULL,
  "execution_id" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "coverage_state" text COLLATE "C" NOT NULL,
  "context_bytes" bigint NOT NULL,
  "context_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("context_id"),
  CHECK ((char_length("context_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("execution_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("run_id") BETWEEN 1 AND 256)),
  CHECK (("created_at" >= 0)),
  CHECK (("coverage_state" IN ('attribution-only', 'unattributed', 'unknown', 'unsupported'))),
  CHECK (("context_bytes" BETWEEN 1 AND 16384)),
  CHECK ((char_length("context_json") > 0)),
  UNIQUE ("execution_id"),
  UNIQUE ("created_at", "context_id")
);

CREATE INDEX "execution_identity_contexts_run_created_idx" ON "execution_identity_contexts" (("run_id") ASC, ("created_at") ASC, ("execution_id") ASC);
`},{id:`mcp_oauth_pending_authorizations`,tables:[`mcp_oauth_pending_authorizations`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "mcp_oauth_pending_authorizations" (
  "state" text COLLATE "C" NOT NULL,
  "store_key" text COLLATE "C" NOT NULL,
  "create_time" bigint NOT NULL,
  PRIMARY KEY ("state")
);
`},{id:`node_worker_launch_containers`,tables:[`node_worker_launch_containers`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "node_worker_launch_containers" (
  "launch_id" text COLLATE "C" NOT NULL,
  "container_json" text COLLATE "C",
  PRIMARY KEY ("launch_id")
);
`},{id:`node_worker_launch_boots`,tables:[`node_worker_launch_boots`],indexes:[],dependencies:[`node_worker_launches`],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "node_worker_launch_boots" (
  "launch_id" text COLLATE "C" NOT NULL,
  "boot_id" text COLLATE "C",
  PRIMARY KEY ("launch_id"),
  CHECK ("boot_id" IS NULL OR (char_length("boot_id") BETWEEN 1 AND 128))
);

ALTER TABLE "node_worker_launch_boots" ADD FOREIGN KEY ("launch_id") REFERENCES "node_worker_launches" ("launch_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`node_worker_launch_cleanup`,tables:[`node_worker_launch_cleanup`],indexes:[],dependencies:[`node_worker_launches`],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "node_worker_launch_cleanup" (
  "launch_id" text COLLATE "C" NOT NULL,
  "cleanup_mode" text COLLATE "C" NOT NULL,
  "lineage_settled" bigint,
  PRIMARY KEY ("launch_id"),
  CHECK (("cleanup_mode" IN ('process-group', 'owned-anchor'))),
  CHECK ("lineage_settled" IS NULL OR ("lineage_settled" = 1))
);

ALTER TABLE "node_worker_launch_cleanup" ADD FOREIGN KEY ("launch_id") REFERENCES "node_worker_launches" ("launch_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`node_worker_launch_process_scopes`,tables:[`node_worker_launch_process_scopes`],indexes:[],dependencies:[`node_worker_launches`],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "node_worker_launch_process_scopes" (
  "launch_id" text COLLATE "C" NOT NULL,
  "scope_kind" text COLLATE "C" NOT NULL,
  "descendants_reaped" bigint,
  PRIMARY KEY ("launch_id"),
  CHECK (("scope_kind" = 'linux-subreaper')),
  CHECK ("descendants_reaped" IS NULL OR ("descendants_reaped" = 1))
);

ALTER TABLE "node_worker_launch_process_scopes" ADD FOREIGN KEY ("launch_id") REFERENCES "node_worker_launches" ("launch_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`node_worker_launches`,tables:[`node_worker_launches`],indexes:[`idx_node_worker_launches_terminal_completed`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "node_worker_launches" (
  "launch_id" text COLLATE "C" NOT NULL,
  "plan_hash" text COLLATE "C" NOT NULL,
  "gateway_namespace" text COLLATE "C" NOT NULL,
  "environment_id" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "owner_epoch" bigint NOT NULL,
  "placement_generation" bigint NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "state" text COLLATE "C" NOT NULL,
  "supervisor_pid" bigint NOT NULL,
  "supervisor_start_time" bigint NOT NULL,
  "worker_pid" bigint,
  "worker_start_time" bigint,
  "result_json" text COLLATE "C",
  "error_text" text COLLATE "C",
  "completed_at_ms" bigint,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("launch_id"),
  CHECK ((char_length("launch_id") BETWEEN 1 AND 256) AND ("launch_id" IS NOT NULL OR NULL)),
  CHECK ((char_length("plan_hash") = 64) AND ("plan_hash" COLLATE "C" !~ '\\A.*[^0-9a-f].*\\Z')),
  CHECK ((char_length("gateway_namespace") BETWEEN 1 AND 128) AND ("gateway_namespace" COLLATE "C" !~ '\\A.*[^A-Za-z0-9._-].*\\Z') AND ("gateway_namespace" COLLATE "C" ~ '\\A[A-Za-z0-9].*\\Z')),
  CHECK ((char_length("environment_id") BETWEEN 1 AND 256) AND ("environment_id" IS NOT NULL OR NULL)),
  CHECK ((char_length("session_id") BETWEEN 1 AND 256) AND ("session_id" IS NOT NULL OR NULL)),
  CHECK (("owner_epoch" BETWEEN 1 AND 9007199254740991)),
  CHECK (("placement_generation" BETWEEN 0 AND 9007199254740991)),
  CHECK ((char_length("run_id") BETWEEN 1 AND 256) AND ("run_id" IS NOT NULL OR NULL)),
  CHECK (("state" IN ('pending', 'running', 'completed', 'failed', 'interrupted', 'cancelled'))),
  CHECK (("supervisor_pid" BETWEEN 1 AND 2147483647)),
  CHECK (("supervisor_start_time" BETWEEN 0 AND 9007199254740991)),
  CHECK ("worker_pid" IS NULL OR ("worker_pid" BETWEEN 1 AND 2147483647)),
  CHECK ("worker_start_time" IS NULL OR ("worker_start_time" BETWEEN 0 AND 9007199254740991)),
  CHECK ("result_json" IS NULL OR ((octet_length(convert_to("result_json", 'UTF8')) BETWEEN 1 AND 65536) AND ("result_json" IS NOT NULL OR NULL) AND ("result_json" IS JSON))),
  CHECK ("error_text" IS NULL OR ((octet_length(convert_to("error_text", 'UTF8')) BETWEEN 1 AND 4096) AND ("error_text" IS NOT NULL OR NULL) AND (strpos("error_text", '
') = 0) AND (strpos("error_text", '\r') = 0))),
  CHECK ("completed_at_ms" IS NULL OR ("completed_at_ms" BETWEEN 0 AND 9007199254740991)),
  CHECK (("created_at_ms" BETWEEN 0 AND 9007199254740991)),
  CHECK (("updated_at_ms" BETWEEN "created_at_ms" AND 9007199254740991)),
  CHECK ((("worker_pid" IS NULL) = ("worker_start_time" IS NULL))),
  CHECK ((("state" = 'pending') AND "worker_pid" IS NULL AND "result_json" IS NULL AND "error_text" IS NULL AND "completed_at_ms" IS NULL) OR (("state" = 'running') AND "worker_pid" IS NOT NULL AND "result_json" IS NULL AND "error_text" IS NULL AND "completed_at_ms" IS NULL) OR (("state" = 'completed') AND "result_json" IS NOT NULL AND "error_text" IS NULL AND ("completed_at_ms" BETWEEN "created_at_ms" AND "updated_at_ms")) OR (("state" IN ('failed', 'interrupted', 'cancelled')) AND "result_json" IS NULL AND "error_text" IS NOT NULL AND ("completed_at_ms" BETWEEN "created_at_ms" AND "updated_at_ms")))
);

CREATE INDEX "idx_node_worker_launches_terminal_completed" ON "node_worker_launches" (("completed_at_ms") ASC, ("launch_id") ASC) WHERE "completed_at_ms" IS NOT NULL;
`},{id:`node_worker_prepared_workspaces`,tables:[`node_worker_prepared_workspaces`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "node_worker_prepared_workspaces" (
  "preparation_key" text COLLATE "C" NOT NULL,
  "cache_key" text COLLATE "C" NOT NULL,
  "gateway_namespace" text COLLATE "C" NOT NULL,
  "workspace_dir" text COLLATE "C" NOT NULL,
  "home_dir" text COLLATE "C" NOT NULL,
  "source_manifest_ref" text COLLATE "C" NOT NULL,
  "prepared_manifest_ref" text COLLATE "C" NOT NULL,
  "state" text COLLATE "C" NOT NULL,
  "environment_id" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C",
  "session_key" text COLLATE "C",
  "owner_epoch" bigint,
  "created_at_ms" bigint NOT NULL,
  "bound_at_ms" bigint,
  "retired_at_ms" bigint,
  PRIMARY KEY ("preparation_key"),
  CHECK ((char_length("preparation_key") = 64) AND ("preparation_key" COLLATE "C" !~ '\\A.*[^0-9a-f].*\\Z')),
  CHECK ((char_length("cache_key") = 64) AND ("cache_key" COLLATE "C" !~ '\\A.*[^0-9a-f].*\\Z')),
  CHECK ((char_length("gateway_namespace") > 0)),
  CHECK ((char_length("workspace_dir") > 0)),
  CHECK ((char_length("home_dir") > 0)),
  CHECK ((char_length("source_manifest_ref") = 71) AND (substr("source_manifest_ref", 1, 7) = 'sha256:') AND (substr("source_manifest_ref", 8) COLLATE "C" !~ '\\A.*[^0-9a-f].*\\Z')),
  CHECK ((char_length("prepared_manifest_ref") = 71) AND (substr("prepared_manifest_ref", 1, 7) = 'sha256:') AND (substr("prepared_manifest_ref", 8) COLLATE "C" !~ '\\A.*[^0-9a-f].*\\Z')),
  CHECK (("state" IN ('available', 'bound', 'retiring', 'retired'))),
  CHECK ((char_length("environment_id") > 0)),
  CHECK (("owner_epoch" BETWEEN 1 AND 9007199254740991)),
  CHECK (("created_at_ms" BETWEEN 0 AND 9007199254740991)),
  CHECK (("bound_at_ms" BETWEEN "created_at_ms" AND 9007199254740991)),
  CHECK (("retired_at_ms" BETWEEN coalesce("bound_at_ms", "created_at_ms") AND 9007199254740991)),
  CHECK (("session_id" IS NULL AND "session_key" IS NULL AND "owner_epoch" IS NULL AND "bound_at_ms" IS NULL) OR ("session_id" IS NOT NULL AND (char_length("session_id") > 0) AND "session_key" IS NOT NULL AND (char_length("session_key") > 0) AND "owner_epoch" IS NOT NULL AND "bound_at_ms" IS NOT NULL)),
  CHECK ((("state" = 'available') AND "bound_at_ms" IS NULL AND "retired_at_ms" IS NULL) OR (("state" = 'bound') AND "bound_at_ms" IS NOT NULL AND "retired_at_ms" IS NULL) OR (("state" = 'retiring') AND "retired_at_ms" IS NULL) OR (("state" = 'retired') AND "retired_at_ms" IS NOT NULL)),
  UNIQUE ("workspace_dir")
);
`},{id:`node_worker_turns`,tables:[`node_worker_turns`],indexes:[`idx_node_worker_turns_terminal_completed`,`idx_node_worker_turns_active_owner`],dependencies:[`node_worker_launches`],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "node_worker_turns" (
  "turn_id" text COLLATE "C" NOT NULL,
  "owner_launch_id" text COLLATE "C" NOT NULL,
  "plan_hash" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "state" text COLLATE "C" NOT NULL,
  "result_json" text COLLATE "C",
  "error_text" text COLLATE "C",
  "completed_at_ms" bigint,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("turn_id"),
  CHECK ((char_length("turn_id") BETWEEN 1 AND 256) AND ("turn_id" IS NOT NULL OR NULL)),
  CHECK ((char_length("plan_hash") = 64) AND ("plan_hash" COLLATE "C" !~ '\\A.*[^0-9a-f].*\\Z')),
  CHECK ((char_length("run_id") BETWEEN 1 AND 256) AND ("run_id" IS NOT NULL OR NULL)),
  CHECK (("state" IN ('running', 'completed', 'failed', 'interrupted', 'cancelled'))),
  CHECK ("result_json" IS NULL OR ((octet_length(convert_to("result_json", 'UTF8')) BETWEEN 1 AND 65536) AND ("result_json" IS NOT NULL OR NULL) AND ("result_json" IS JSON))),
  CHECK ("error_text" IS NULL OR ((octet_length(convert_to("error_text", 'UTF8')) BETWEEN 1 AND 4096) AND ("error_text" IS NOT NULL OR NULL) AND (strpos("error_text", '
') = 0) AND (strpos("error_text", '\r') = 0))),
  CHECK ("completed_at_ms" IS NULL OR ("completed_at_ms" BETWEEN 0 AND 9007199254740991)),
  CHECK (("created_at_ms" BETWEEN 0 AND 9007199254740991)),
  CHECK (("updated_at_ms" BETWEEN "created_at_ms" AND 9007199254740991)),
  CHECK ((("state" = 'running') AND "result_json" IS NULL AND "error_text" IS NULL AND "completed_at_ms" IS NULL) OR (("state" = 'completed') AND "result_json" IS NOT NULL AND "error_text" IS NULL AND ("completed_at_ms" BETWEEN "created_at_ms" AND "updated_at_ms")) OR (("state" IN ('failed', 'interrupted', 'cancelled')) AND "result_json" IS NULL AND "error_text" IS NOT NULL AND ("completed_at_ms" BETWEEN "created_at_ms" AND "updated_at_ms")))
);

CREATE UNIQUE INDEX "idx_node_worker_turns_active_owner" ON "node_worker_turns" (("owner_launch_id") ASC) WHERE ("state" = 'running');

CREATE INDEX "idx_node_worker_turns_terminal_completed" ON "node_worker_turns" (("completed_at_ms") ASC, ("turn_id") ASC) WHERE "completed_at_ms" IS NOT NULL;

ALTER TABLE "node_worker_turns" ADD FOREIGN KEY ("owner_launch_id") REFERENCES "node_worker_launches" ("launch_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`operator_approval_execution_identities`,tables:[`operator_approval_execution_identities`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "operator_approval_execution_identities" (
  "approval_id" text COLLATE "C" NOT NULL,
  "source_context_id" text COLLATE "C" NOT NULL,
  "source_execution_id" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("approval_id"),
  CHECK ((char_length("source_context_id") BETWEEN 1 AND 256) AND ("source_context_id" = btrim("source_context_id"))),
  CHECK ((char_length("source_execution_id") BETWEEN 1 AND 256) AND ("source_execution_id" = btrim("source_execution_id")))
);

ALTER TABLE "operator_approval_execution_identities" ADD FOREIGN KEY ("approval_id") REFERENCES "operator_approvals" ("approval_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`web_push_approval_deliveries`,tables:[`web_push_approval_deliveries`],indexes:[`idx_web_push_approval_deliveries_subscription`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "web_push_approval_deliveries" (
  "approval_id" text COLLATE "C" NOT NULL,
  "subscription_id" text COLLATE "C" NOT NULL,
  "device_id" text COLLATE "C" NOT NULL,
  "user_profile_id" text COLLATE "C",
  "prepared_at_ms" bigint NOT NULL,
  PRIMARY KEY ("approval_id", "subscription_id")
);

CREATE INDEX "idx_web_push_approval_deliveries_subscription" ON "web_push_approval_deliveries" (("subscription_id") ASC, ("approval_id") ASC);

ALTER TABLE "web_push_approval_deliveries" ADD FOREIGN KEY ("subscription_id") REFERENCES "web_push_subscriptions" ("subscription_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "web_push_approval_deliveries" ADD FOREIGN KEY ("approval_id") REFERENCES "operator_approvals" ("approval_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`execution_decision_facts`,tables:[`execution_decision_facts`],indexes:[`execution_decision_facts_cursor_id_idx`,`execution_decision_facts_context_occurred_idx`,`execution_decision_facts_run_occurred_idx`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "execution_decision_facts" (
  "cursor_id" bigint NOT NULL,
  "receipt_id" text COLLATE "C" NOT NULL,
  "context_id" text COLLATE "C" NOT NULL,
  "execution_id" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "action_id" text COLLATE "C",
  "action_family" text COLLATE "C" NOT NULL,
  "decision_outcome" text COLLATE "C" NOT NULL,
  "coverage_state" text COLLATE "C" NOT NULL,
  "reason_code" text COLLATE "C" NOT NULL,
  "owner" text COLLATE "C" NOT NULL,
  "source_ref" text COLLATE "C" NOT NULL,
  "occurred_at" bigint NOT NULL,
  "receipt_bytes" bigint NOT NULL,
  "receipt_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("receipt_id"),
  CHECK ((char_length("receipt_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("context_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("execution_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("run_id") BETWEEN 1 AND 256)),
  CHECK ("action_id" IS NULL OR (char_length("action_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("action_family") BETWEEN 1 AND 256)),
  CHECK (("decision_outcome" IN ('allowed', 'denied', 'not-applicable', 'unknown'))),
  CHECK (("coverage_state" IN ('enforced', 'attribution-only', 'unattributed', 'unknown', 'unsupported'))),
  CHECK ((char_length("reason_code") BETWEEN 1 AND 256)),
  CHECK ((char_length("owner") BETWEEN 1 AND 256)),
  CHECK ((char_length("source_ref") BETWEEN 1 AND 256)),
  CHECK (("occurred_at" >= 0)),
  CHECK (("receipt_bytes" BETWEEN 1 AND 16384)),
  CHECK ((char_length("receipt_json") > 0)),
  UNIQUE ("occurred_at", "receipt_id")
);

CREATE INDEX "execution_decision_facts_context_occurred_idx" ON "execution_decision_facts" (("context_id") ASC, ("occurred_at") ASC, ("receipt_id") ASC);

CREATE UNIQUE INDEX "execution_decision_facts_cursor_id_idx" ON "execution_decision_facts" (("cursor_id") ASC);

CREATE INDEX "execution_decision_facts_run_occurred_idx" ON "execution_decision_facts" (("run_id") ASC, ("occurred_at") ASC, ("receipt_id") ASC);
`},{id:`execution_owner_lifecycle_bindings`,tables:[`execution_owner_lifecycle_bindings`],indexes:[],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "execution_owner_lifecycle_bindings" (
  "owner_kind" text COLLATE "C" NOT NULL,
  "owner_id" text COLLATE "C" NOT NULL,
  "context_id" text COLLATE "C" NOT NULL,
  "execution_id" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("owner_kind", "owner_id")
);
`},{id:`outbound_message_execution_bindings`,tables:[`outbound_message_execution_bindings`],indexes:[`outbound_message_execution_bindings_execution_event_idx`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "outbound_message_execution_bindings" (
  "event_id" text COLLATE "C" NOT NULL,
  "context_id" text COLLATE "C" NOT NULL,
  "execution_id" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("event_id"),
  CHECK ((char_length("context_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("execution_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("run_id") BETWEEN 1 AND 256))
);

CREATE INDEX "outbound_message_execution_bindings_execution_event_idx" ON "outbound_message_execution_bindings" (("context_id") ASC, ("execution_id") ASC, ("run_id") ASC, ("event_id") ASC);

ALTER TABLE "outbound_message_execution_bindings" ADD FOREIGN KEY ("event_id") REFERENCES "audit_events" ("event_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`outbound_message_progress`,tables:[`outbound_message_progress`],indexes:[`outbound_message_progress_occurred_idx`,`outbound_message_progress_run_occurred_idx`],dependencies:[],activation:`first-use`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "outbound_message_progress" (
  "sequence" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "progress_id" text COLLATE "C" NOT NULL,
  "source_id" text COLLATE "C" NOT NULL,
  "source_sequence" bigint NOT NULL,
  "schema_version" bigint NOT NULL,
  "occurred_at" bigint NOT NULL,
  "action" text COLLATE "C" NOT NULL,
  "outcome" text COLLATE "C" NOT NULL,
  "actor_type" text COLLATE "C" NOT NULL,
  "actor_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C",
  "run_id" text COLLATE "C",
  "context_id" text COLLATE "C",
  "execution_id" text COLLATE "C",
  "channel" text COLLATE "C" NOT NULL,
  "conversation_kind" text COLLATE "C" NOT NULL,
  "duration_ms" bigint,
  "account_ref" text COLLATE "C",
  "conversation_ref" text COLLATE "C",
  "target_ref" text COLLATE "C",
  PRIMARY KEY ("sequence"),
  CHECK ((char_length("progress_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("source_id") BETWEEN 1 AND 512)),
  CHECK (("source_sequence" >= 1)),
  CHECK (("schema_version" = 1)),
  CHECK (("occurred_at" >= 0)),
  CHECK (("action" IN ('message.outbound.queued', 'message.outbound.platform-started'))),
  CHECK (("outcome" IN ('queued', 'platform_started'))),
  CHECK (("actor_type" IN ('agent', 'system'))),
  CHECK ((char_length("actor_id") BETWEEN 1 AND 256)),
  CHECK ("agent_id" IS NULL OR (char_length("agent_id") BETWEEN 1 AND 256)),
  CHECK ("run_id" IS NULL OR (char_length("run_id") BETWEEN 1 AND 256)),
  CHECK ((char_length("channel") BETWEEN 1 AND 256)),
  CHECK (("conversation_kind" IN ('direct', 'group', 'channel', 'unknown'))),
  CHECK ("duration_ms" IS NULL OR ("duration_ms" >= 0)),
  UNIQUE ("progress_id"),
  UNIQUE ("source_id"),
  UNIQUE ("occurred_at", "progress_id")
);

CREATE INDEX "outbound_message_progress_occurred_idx" ON "outbound_message_progress" (("occurred_at") ASC, ("sequence") ASC);

CREATE INDEX "outbound_message_progress_run_occurred_idx" ON "outbound_message_progress" (("run_id") ASC NULLS FIRST, ("occurred_at") ASC, ("sequence") ASC);
`},{id:`agent_provenance`,tables:[`agent_provenance`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "agent_provenance" (
  "agent_id" text COLLATE "C" NOT NULL,
  "created_via" text COLLATE "C" NOT NULL,
  "creator_agent_id" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  PRIMARY KEY ("agent_id"),
  CHECK (("created_via" IN ('operator', 'agent', 'template')))
);
`},{id:`cron_run_receipts`,tables:[`cron_run_receipts`],indexes:[`cron_run_receipts_cursor_id_idx`,`idx_cron_run_receipts_active_job`,`idx_cron_run_receipts_job_history`],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "cron_run_receipts" (
  "cursor_id" bigint NOT NULL,
  "receipt_id" text COLLATE "C" NOT NULL,
  "store_key" text COLLATE "C" NOT NULL,
  "job_id" text COLLATE "C" NOT NULL,
  "config_revision" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "request_run_id" text COLLATE "C",
  "delivery_attempt_state" text COLLATE "C" NOT NULL DEFAULT 'unknown',
  "status" text COLLATE "C" NOT NULL,
  "owner_pid" bigint NOT NULL,
  "owner_start_time" bigint,
  "started_at_ms" bigint NOT NULL,
  "finished_at_ms" bigint,
  "error_text" text COLLATE "C",
  PRIMARY KEY ("receipt_id"),
  CHECK (("delivery_attempt_state" IN ('unknown', 'not-started', 'started'))),
  CHECK (("status" IN ('running', 'ok', 'error', 'skipped', 'interrupted', 'superseded'))),
  CHECK ((("status" = 'running') AND "finished_at_ms" IS NULL) OR (("status" != 'running') AND "finished_at_ms" IS NOT NULL))
);

CREATE UNIQUE INDEX "cron_run_receipts_cursor_id_idx" ON "cron_run_receipts" (("cursor_id") ASC);

CREATE UNIQUE INDEX "idx_cron_run_receipts_active_job" ON "cron_run_receipts" (("store_key") ASC, ("job_id") ASC) WHERE ("status" = 'running');

CREATE INDEX "idx_cron_run_receipts_job_history" ON "cron_run_receipts" (("store_key") ASC, ("job_id") ASC, ("started_at_ms") DESC, ("receipt_id") DESC);
`},{id:`config_revision_keys`,tables:[`config_revision_keys`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "config_revision_keys" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "hmac_key" bytea NOT NULL,
  PRIMARY KEY ("id"),
  CHECK (("id" = 1)),
  CHECK ((octet_length("hmac_key") = 32))
);
`},{id:`secret_store_entries`,tables:[`secret_store_entries`],indexes:[`secret_store_entries_live_idx`],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "secret_store_entries" (
  "scope_kind" text COLLATE "C" NOT NULL,
  "scope_id" text COLLATE "C" NOT NULL,
  "name" text COLLATE "C" NOT NULL,
  "value" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "updated_by" text COLLATE "C",
  "deleted_at_ms" bigint,
  "allowed_hosts" text COLLATE "C",
  PRIMARY KEY ("scope_kind", "scope_id", "name"),
  CHECK (("scope_kind" IN ('team', 'identity'))),
  CHECK (("kind" IN ('secret', 'env'))),
  CHECK (("created_at_ms" >= 0)),
  CHECK (("updated_at_ms" >= 0)),
  CHECK ((("scope_kind" = 'team') AND ("scope_id" = '')) OR (("scope_kind" = 'identity') AND (char_length("scope_id") > 0)))
);

CREATE INDEX "secret_store_entries_live_idx" ON "secret_store_entries" (("scope_kind") ASC, ("scope_id") ASC, ("name") ASC) WHERE "deleted_at_ms" IS NULL;
`},{id:`projects`,tables:[`projects`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "projects" (
  "id" text COLLATE "C" NOT NULL,
  "display_name" text COLLATE "C" NOT NULL,
  "repo_root" text COLLATE "C" NOT NULL,
  "origin_url" text COLLATE "C",
  "source" text COLLATE "C" NOT NULL,
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("id"),
  CHECK (("source" IN ('registered', 'cloned')))
);
`},{id:`worktree_templates`,tables:[`worktree_templates`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "worktree_templates" (
  "cache_key" text COLLATE "C" NOT NULL,
  "id" text COLLATE "C" NOT NULL,
  "repo_root" text COLLATE "C" NOT NULL,
  "common_dir" text COLLATE "C" NOT NULL,
  "worktree_root" text COLLATE "C" NOT NULL,
  "path" text COLLATE "C" NOT NULL,
  "backend" text COLLATE "C" NOT NULL,
  "source_commit" text COLLATE "C" NOT NULL,
  "content_key" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "last_used_at" bigint NOT NULL,
  PRIMARY KEY ("cache_key"),
  CHECK (("status" IN ('preparing', 'ready'))),
  UNIQUE ("id")
);
`},{id:`user_preferences`,tables:[`user_preferences`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "user_preferences" (
  "profile_id" text COLLATE "C" NOT NULL,
  "pref_key" text COLLATE "C" NOT NULL,
  "value_json" text COLLATE "C" NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("profile_id", "pref_key")
);
`},{id:`device_pair_setup_completions`,tables:[`device_pair_setup_completions`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "device_pair_setup_completions" (
  "setup_id" text COLLATE "C" NOT NULL,
  "device_id" text COLLATE "C" NOT NULL,
  "device_name" text COLLATE "C",
  "access" text COLLATE "C" NOT NULL,
  "completed_at_ms" bigint NOT NULL,
  "delivery_state" text COLLATE "C" NOT NULL,
  "retain_until_ms" bigint NOT NULL,
  PRIMARY KEY ("setup_id"),
  CHECK (("delivery_state" IN ('uncertain', 'confirmed')))
);
`},{id:`github_publication_requests`,tables:[`github_publication_requests`],indexes:[`idx_github_publication_requests_pending`],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "github_publication_requests" (
  "request_id" text COLLATE "C" NOT NULL,
  "idempotency_key" text COLLATE "C" NOT NULL,
  "request_digest" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "worktree_id" text COLLATE "C" NOT NULL,
  "repository_fingerprint" text COLLATE "C" NOT NULL,
  "claim_id" text COLLATE "C",
  "run_id" text COLLATE "C",
  "environment_id" text COLLATE "C",
  "owner_epoch" bigint,
  "placement_generation" bigint,
  "identity_source" text COLLATE "C" NOT NULL,
  "identity_profile_id" text COLLATE "C",
  "identity_account_id" bigint NOT NULL,
  "identity_login" text COLLATE "C" NOT NULL,
  "title" text COLLATE "C",
  "body" text COLLATE "C",
  "status" text COLLATE "C" NOT NULL,
  "gateway_instance_id" text COLLATE "C",
  "repository" text COLLATE "C",
  "branch" text COLLATE "C" NOT NULL,
  "base_branch" text COLLATE "C",
  "source_head_commit" text COLLATE "C",
  "source_index_tree" text COLLATE "C",
  "workspace_tree" text COLLATE "C",
  "head_commit" text COLLATE "C",
  "pull_request_url" text COLLATE "C",
  "error_code" text COLLATE "C",
  "next_action" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  "reported_at_ms" bigint,
  "draft" bigint,
  PRIMARY KEY ("request_id"),
  CHECK ("owner_epoch" IS NULL OR ("owner_epoch" >= 1)),
  CHECK ("placement_generation" IS NULL OR ("placement_generation" >= 0)),
  CHECK (("identity_source" IN ('system-detected', 'system-configured', 'agent-override'))),
  CHECK (("identity_account_id" >= 1)),
  CHECK (("status" IN ('requested', 'publishing', 'published', 'failed'))),
  CHECK (("claim_id" IS NULL AND "run_id" IS NULL AND "environment_id" IS NULL AND "owner_epoch" IS NULL AND "placement_generation" IS NULL) OR ("claim_id" IS NOT NULL AND "run_id" IS NOT NULL AND "placement_generation" IS NOT NULL AND (("environment_id" IS NULL AND "owner_epoch" IS NULL) OR ("environment_id" IS NOT NULL AND "owner_epoch" IS NOT NULL)))),
  CHECK (("identity_source" IS NOT DISTINCT FROM 'system-detected' AND "identity_profile_id" IS NULL) OR (("identity_source" IN ('system-configured', 'agent-override')) AND "identity_profile_id" IS NOT NULL)),
  CHECK (("source_head_commit" IS NULL AND "source_index_tree" IS NULL AND "workspace_tree" IS NULL) OR ("source_head_commit" IS NOT NULL AND "workspace_tree" IS NOT NULL)),
  CHECK (("status" IS NOT DISTINCT FROM 'published' AND "pull_request_url" IS NOT NULL AND "error_code" IS NULL AND "next_action" IS NULL) OR ("status" IS NOT DISTINCT FROM 'failed' AND "pull_request_url" IS NULL AND "error_code" IS NOT NULL AND "next_action" IS NOT NULL) OR (("status" IN ('requested', 'publishing')) AND "pull_request_url" IS NULL AND "error_code" IS NULL AND "next_action" IS NULL)),
  UNIQUE ("session_id", "idempotency_key")
);

CREATE INDEX "idx_github_publication_requests_pending" ON "github_publication_requests" (("status") ASC, ("updated_at_ms") ASC, ("request_id") ASC);
`},{id:`device_pairing_join_codes`,tables:[`device_pairing_join_codes`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "device_pairing_join_codes" (
  "shortcode" text COLLATE "C",
  "payload_json" text COLLATE "C",
  "created_at_ms" bigint,
  "expires_at_ms" bigint
);
`},{id:`device_pairing_browser_requests`,tables:[`device_pairing_browser_requests`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "device_pairing_browser_requests" (
  "request_id" text COLLATE "C" NOT NULL,
  "code" text COLLATE "C" NOT NULL,
  "device_id" text COLLATE "C" NOT NULL,
  "public_key" text COLLATE "C" NOT NULL,
  "remote_ip" text COLLATE "C",
  "user_agent" text COLLATE "C",
  "origin" text COLLATE "C",
  "status" text COLLATE "C" NOT NULL,
  "approved_token_sha256" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "expires_at_ms" bigint NOT NULL,
  PRIMARY KEY ("request_id"),
  CHECK (("status" IN ('pending', 'approved', 'rejected'))),
  UNIQUE ("code"),
  UNIQUE ("device_id")
);
`},{id:`skill_workshop_changes`,tables:[`skill_workshop_changes`],indexes:[`skill_workshop_changes_cursor_id_idx`,`idx_skill_workshop_changes_agent_time`],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "skill_workshop_changes" (
  "cursor_id" bigint NOT NULL,
  "change_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "skill_name" text COLLATE "C" NOT NULL,
  "action" text COLLATE "C" NOT NULL,
  "actor" text COLLATE "C" NOT NULL,
  "summary" text COLLATE "C" NOT NULL,
  "version_id" text COLLATE "C",
  "session_key" text COLLATE "C",
  "run_id" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  PRIMARY KEY ("change_id"),
  CHECK (("action" IN ('create', 'patch', 'write_file', 'remove_file', 'archive', 'restore'))),
  CHECK (("actor" IN ('agent', 'review', 'curator', 'user')))
);

CREATE INDEX "idx_skill_workshop_changes_agent_time" ON "skill_workshop_changes" (("agent_id") ASC, ("created_at_ms") ASC);

CREATE UNIQUE INDEX "skill_workshop_changes_cursor_id_idx" ON "skill_workshop_changes" (("cursor_id") ASC);
`},{id:`worker_environment_ssh_fallback_ports`,tables:[`worker_environment_ssh_fallback_ports`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "worker_environment_ssh_fallback_ports" (
  "environment_id" text COLLATE "C" NOT NULL,
  "position" bigint NOT NULL,
  "port" bigint NOT NULL,
  PRIMARY KEY ("environment_id", "position"),
  CHECK (("position" >= 0) AND ("position" <= 9)),
  CHECK (("port" >= 1) AND ("port" <= 65535)),
  UNIQUE ("environment_id", "port")
);

ALTER TABLE "worker_environment_ssh_fallback_ports" ADD FOREIGN KEY ("environment_id") REFERENCES "worker_environments" ("environment_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`worker_session_placement_moves`,tables:[`worker_session_placement_moves`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "worker_session_placement_moves" (
  "operation_id" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "source_generation" bigint NOT NULL,
  "source_environment_id" text COLLATE "C" NOT NULL,
  "source_owner_epoch" bigint NOT NULL,
  "target_kind" text COLLATE "C" NOT NULL,
  "target_id" text COLLATE "C",
  "target_machine_class" text COLLATE "C",
  "target_os" text COLLATE "C",
  "abandon_source" bigint,
  "last_error" text COLLATE "C",
  "created_at_ms" bigint NOT NULL,
  "updated_at_ms" bigint NOT NULL,
  PRIMARY KEY ("operation_id"),
  CHECK (("source_generation" >= 0)),
  CHECK ((char_length("source_environment_id") BETWEEN 1 AND 256) AND ("source_environment_id" = btrim("source_environment_id"))),
  CHECK (("source_owner_epoch" >= 1)),
  CHECK (("target_kind" IN ('gateway', 'profile', 'device'))),
  CHECK (("target_kind" IS NOT DISTINCT FROM 'gateway' AND "target_id" IS NULL) OR (("target_kind" IN ('profile', 'device')) AND "target_id" IS NOT NULL AND (char_length("target_id") BETWEEN 1 AND 256) AND ("target_id" = btrim("target_id")))),
  UNIQUE ("session_id")
);

ALTER TABLE "worker_session_placement_moves" ADD FOREIGN KEY ("session_id") REFERENCES "worker_session_placements" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;
`},{id:`agent_deletion_journal`,tables:[`agent_deletion_journal`],indexes:[],dependencies:[],activation:`version-additive`,sql:`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE TABLE "agent_deletion_journal" (
  "agent_id" text COLLATE "C" NOT NULL,
  "operation_id" text COLLATE "C" NOT NULL DEFAULT '',
  "phase" text COLLATE "C",
  "agent_dir" text COLLATE "C" NOT NULL,
  "workspace_dir" text COLLATE "C" NOT NULL,
  "sessions_dir" text COLLATE "C" NOT NULL,
  "database_paths_json" text COLLATE "C" NOT NULL DEFAULT '[]',
  "cleanup_paths_json" text COLLATE "C" NOT NULL DEFAULT '[]',
  "created_at" bigint NOT NULL,
  "cleanup_completed" bigint NOT NULL DEFAULT 0,
  "delete_files" bigint NOT NULL DEFAULT 1,
  PRIMARY KEY ("agent_id")
);
`}];return Object.defineProperty(this,"fragments",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get expectedCatalog(){let e=[{table:`acp_replay_events`,kind:`table`,value:null},{table:`acp_replay_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`acp_replay_events`,kind:`column`,value:{name:`seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`acp_replay_events`,kind:`column`,value:{name:`at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`acp_replay_events`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`acp_replay_events`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`acp_replay_events`,kind:`column`,value:{name:`update_json`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`acp_replay_events`,kind:`column`,value:{name:`estimated_bytes`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:7}},{table:`acp_replay_events`,kind:`primaryKey`,value:[`session_id`,`seq`]},{table:`acp_replay_events`,kind:`foreignKey`,value:{columns:[`session_id`],target:`acp_replay_sessions`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`acp_replay_events`,kind:`indexes`,value:1},{table:`acp_replay_events`,kind:`checks`,value:0},{table:`acp_replay_sessions`,kind:`table`,value:null},{table:`acp_replay_sessions`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`cwd`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`complete`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`next_seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`acp_replay_sessions`,kind:`column`,value:{name:`estimated_bytes`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:8}},{table:`acp_replay_sessions`,kind:`primaryKey`,value:[`session_id`]},{table:`acp_replay_sessions`,kind:`indexes`,value:3},{table:`acp_replay_sessions`,kind:`checks`,value:0},{table:`acp_sessions`,kind:`table`,value:null},{table:`acp_sessions`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`acp_sessions`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`acp_sessions`,kind:`column`,value:{name:`backend`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`acp_sessions`,kind:`column`,value:{name:`agent`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`acp_sessions`,kind:`column`,value:{name:`runtime_session_name`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`acp_sessions`,kind:`column`,value:{name:`identity_json`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`acp_sessions`,kind:`column`,value:{name:`resume_agent_session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`acp_sessions`,kind:`column`,value:{name:`resume_acpx_session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`acp_sessions`,kind:`column`,value:{name:`mode`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`acp_sessions`,kind:`column`,value:{name:`runtime_options_json`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`acp_sessions`,kind:`column`,value:{name:`cwd`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`acp_sessions`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`acp_sessions`,kind:`column`,value:{name:`last_activity_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`acp_sessions`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`acp_sessions`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:15}},{table:`acp_sessions`,kind:`primaryKey`,value:[`session_key`]},{table:`acp_sessions`,kind:`indexes`,value:5},{table:`acp_sessions`,kind:`checks`,value:0},{table:`agent_database_leases`,kind:`table`,value:null},{table:`agent_database_leases`,kind:`column`,value:{name:`lease_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`agent_database_leases`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`agent_database_leases`,kind:`column`,value:{name:`path`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`agent_database_leases`,kind:`column`,value:{name:`owner_pid`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`agent_database_leases`,kind:`column`,value:{name:`owner_start_time`,type:`bigint`,nullable:!0,identity:!1,default:null,position:5}},{table:`agent_database_leases`,kind:`column`,value:{name:`opened_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`agent_database_leases`,kind:`column`,value:{name:`provenance`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`agent_database_leases`,kind:`primaryKey`,value:[`lease_id`]},{table:`agent_database_leases`,kind:`indexes`,value:1},{table:`agent_database_leases`,kind:`checks`,value:0},{table:`agent_databases`,kind:`table`,value:null},{table:`agent_databases`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`agent_databases`,kind:`column`,value:{name:`path`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`agent_databases`,kind:`column`,value:{name:`schema_version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`agent_databases`,kind:`column`,value:{name:`last_seen_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`agent_databases`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:!0,identity:!1,default:null,position:5}},{table:`agent_databases`,kind:`primaryKey`,value:[`agent_id`,`path`]},{table:`agent_databases`,kind:`indexes`,value:1},{table:`agent_databases`,kind:`checks`,value:0},{table:`agent_deletion_journal`,kind:`table`,value:null},{table:`agent_deletion_journal`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`operation_id`,type:`text`,nullable:!1,identity:!1,default:`''`,position:2}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`phase`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`agent_dir`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`workspace_dir`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`sessions_dir`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`database_paths_json`,type:`text`,nullable:!1,identity:!1,default:`'[]'`,position:7}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`cleanup_paths_json`,type:`text`,nullable:!1,identity:!1,default:`'[]'`,position:8}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`cleanup_completed`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:10}},{table:`agent_deletion_journal`,kind:`column`,value:{name:`delete_files`,type:`bigint`,nullable:!1,identity:!1,default:`1`,position:11}},{table:`agent_deletion_journal`,kind:`primaryKey`,value:[`agent_id`]},{table:`agent_deletion_journal`,kind:`indexes`,value:1},{table:`agent_deletion_journal`,kind:`checks`,value:0},{table:`agent_provenance`,kind:`table`,value:null},{table:`agent_provenance`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`agent_provenance`,kind:`column`,value:{name:`created_via`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`agent_provenance`,kind:`column`,value:{name:`creator_agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`agent_provenance`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`agent_provenance`,kind:`primaryKey`,value:[`agent_id`]},{table:`agent_provenance`,kind:`indexes`,value:1},{table:`agent_provenance`,kind:`checks`,value:1},{table:`apns_registration_tombstones`,kind:`table`,value:null},{table:`apns_registration_tombstones`,kind:`column`,value:{name:`node_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`apns_registration_tombstones`,kind:`column`,value:{name:`deleted_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`apns_registration_tombstones`,kind:`primaryKey`,value:[`node_id`]},{table:`apns_registration_tombstones`,kind:`indexes`,value:1},{table:`apns_registration_tombstones`,kind:`checks`,value:0},{table:`apns_registrations`,kind:`table`,value:null},{table:`apns_registrations`,kind:`column`,value:{name:`node_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`apns_registrations`,kind:`column`,value:{name:`transport`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`apns_registrations`,kind:`column`,value:{name:`token`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`apns_registrations`,kind:`column`,value:{name:`relay_handle`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`apns_registrations`,kind:`column`,value:{name:`send_grant`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`apns_registrations`,kind:`column`,value:{name:`installation_id`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`apns_registrations`,kind:`column`,value:{name:`relay_origin`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`apns_registrations`,kind:`column`,value:{name:`topic`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`apns_registrations`,kind:`column`,value:{name:`environment`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`apns_registrations`,kind:`column`,value:{name:`distribution`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`apns_registrations`,kind:`column`,value:{name:`token_debug_suffix`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`apns_registrations`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`apns_registrations`,kind:`primaryKey`,value:[`node_id`]},{table:`apns_registrations`,kind:`indexes`,value:2},{table:`apns_registrations`,kind:`checks`,value:0},{table:`audit_events`,kind:`table`,value:null},{table:`audit_events`,kind:`column`,value:{name:`sequence`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`audit_events`,kind:`column`,value:{name:`event_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`audit_events`,kind:`column`,value:{name:`source_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`audit_events`,kind:`column`,value:{name:`schema_version`,type:`bigint`,nullable:!1,identity:!1,default:`1`,position:4}},{table:`audit_events`,kind:`column`,value:{name:`source_sequence`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`audit_events`,kind:`column`,value:{name:`occurred_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`audit_events`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`audit_events`,kind:`column`,value:{name:`action`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`audit_events`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`audit_events`,kind:`column`,value:{name:`error_code`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`audit_events`,kind:`column`,value:{name:`actor_type`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`audit_events`,kind:`column`,value:{name:`actor_id`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`audit_events`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`audit_events`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`audit_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`audit_events`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`audit_events`,kind:`column`,value:{name:`tool_call_id`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`audit_events`,kind:`column`,value:{name:`tool_name`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`audit_events`,kind:`column`,value:{name:`direction`,type:`text`,nullable:!0,identity:!1,default:null,position:19}},{table:`audit_events`,kind:`column`,value:{name:`channel`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`audit_events`,kind:`column`,value:{name:`conversation_kind`,type:`text`,nullable:!0,identity:!1,default:null,position:21}},{table:`audit_events`,kind:`column`,value:{name:`message_outcome`,type:`text`,nullable:!0,identity:!1,default:null,position:22}},{table:`audit_events`,kind:`column`,value:{name:`reason_code`,type:`text`,nullable:!0,identity:!1,default:null,position:23}},{table:`audit_events`,kind:`column`,value:{name:`delivery_kind`,type:`text`,nullable:!0,identity:!1,default:null,position:24}},{table:`audit_events`,kind:`column`,value:{name:`failure_stage`,type:`text`,nullable:!0,identity:!1,default:null,position:25}},{table:`audit_events`,kind:`column`,value:{name:`duration_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:26}},{table:`audit_events`,kind:`column`,value:{name:`result_count`,type:`bigint`,nullable:!0,identity:!1,default:null,position:27}},{table:`audit_events`,kind:`column`,value:{name:`account_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:28}},{table:`audit_events`,kind:`column`,value:{name:`conversation_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:29}},{table:`audit_events`,kind:`column`,value:{name:`message_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:30}},{table:`audit_events`,kind:`column`,value:{name:`target_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:31}},{table:`audit_events`,kind:`primaryKey`,value:[`sequence`]},{table:`audit_events`,kind:`unique`,value:[`event_id`]},{table:`audit_events`,kind:`unique`,value:[`source_id`]},{table:`audit_events`,kind:`indexes`,value:11},{table:`audit_events`,kind:`checks`,value:0},{table:`audit_identity_keys`,kind:`table`,value:null},{table:`audit_identity_keys`,kind:`column`,value:{name:`id`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`audit_identity_keys`,kind:`column`,value:{name:`key_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`audit_identity_keys`,kind:`column`,value:{name:`key`,type:`bytea`,nullable:!1,identity:!1,default:null,position:3}},{table:`audit_identity_keys`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`audit_identity_keys`,kind:`primaryKey`,value:[`id`]},{table:`audit_identity_keys`,kind:`indexes`,value:1},{table:`audit_identity_keys`,kind:`checks`,value:1},{table:`backup_runs`,kind:`table`,value:null},{table:`backup_runs`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`backup_runs`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`backup_runs`,kind:`column`,value:{name:`archive_path`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`backup_runs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`backup_runs`,kind:`column`,value:{name:`manifest_json`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`backup_runs`,kind:`primaryKey`,value:[`id`]},{table:`backup_runs`,kind:`indexes`,value:2},{table:`backup_runs`,kind:`checks`,value:0},{table:`capture_blobs`,kind:`table`,value:null},{table:`capture_blobs`,kind:`column`,value:{name:`blob_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`capture_blobs`,kind:`column`,value:{name:`content_type`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`capture_blobs`,kind:`column`,value:{name:`encoding`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`capture_blobs`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`capture_blobs`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`capture_blobs`,kind:`column`,value:{name:`data`,type:`bytea`,nullable:!1,identity:!1,default:null,position:6}},{table:`capture_blobs`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`capture_blobs`,kind:`primaryKey`,value:[`blob_id`]},{table:`capture_blobs`,kind:`indexes`,value:1},{table:`capture_blobs`,kind:`checks`,value:0},{table:`capture_events`,kind:`table`,value:null},{table:`capture_events`,kind:`column`,value:{name:`id`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`capture_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`capture_events`,kind:`column`,value:{name:`ts`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`capture_events`,kind:`column`,value:{name:`source_scope`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`capture_events`,kind:`column`,value:{name:`source_process`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`capture_events`,kind:`column`,value:{name:`protocol`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`capture_events`,kind:`column`,value:{name:`direction`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`capture_events`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`capture_events`,kind:`column`,value:{name:`flow_id`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`capture_events`,kind:`column`,value:{name:`method`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`capture_events`,kind:`column`,value:{name:`host`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`capture_events`,kind:`column`,value:{name:`path`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`capture_events`,kind:`column`,value:{name:`status`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`capture_events`,kind:`column`,value:{name:`close_code`,type:`bigint`,nullable:!0,identity:!1,default:null,position:14}},{table:`capture_events`,kind:`column`,value:{name:`content_type`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`capture_events`,kind:`column`,value:{name:`headers_json`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`capture_events`,kind:`column`,value:{name:`data_text`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`capture_events`,kind:`column`,value:{name:`data_blob_id`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`capture_events`,kind:`column`,value:{name:`data_sha256`,type:`text`,nullable:!0,identity:!1,default:null,position:19}},{table:`capture_events`,kind:`column`,value:{name:`error_text`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`capture_events`,kind:`column`,value:{name:`meta_json`,type:`text`,nullable:!0,identity:!1,default:null,position:21}},{table:`capture_events`,kind:`primaryKey`,value:[`id`]},{table:`capture_events`,kind:`foreignKey`,value:{columns:[`data_blob_id`],target:`capture_blobs`,targetColumns:[`blob_id`],onUpdate:`NO ACTION`,onDelete:`SET NULL`,deferrable:!1,deferred:!1}},{table:`capture_events`,kind:`foreignKey`,value:{columns:[`session_id`],target:`capture_sessions`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`capture_events`,kind:`indexes`,value:3},{table:`capture_events`,kind:`checks`,value:0},{table:`capture_sessions`,kind:`table`,value:null},{table:`capture_sessions`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`capture_sessions`,kind:`column`,value:{name:`started_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`capture_sessions`,kind:`column`,value:{name:`ended_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`capture_sessions`,kind:`column`,value:{name:`mode`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`capture_sessions`,kind:`column`,value:{name:`source_scope`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`capture_sessions`,kind:`column`,value:{name:`source_process`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`capture_sessions`,kind:`column`,value:{name:`proxy_url`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`capture_sessions`,kind:`primaryKey`,value:[`id`]},{table:`capture_sessions`,kind:`indexes`,value:1},{table:`capture_sessions`,kind:`checks`,value:0},{table:`channel_ingress_events`,kind:`table`,value:null},{table:`channel_ingress_events`,kind:`column`,value:{name:`queue_name`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`channel_ingress_events`,kind:`column`,value:{name:`event_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`channel_ingress_events`,kind:`column`,value:{name:`channel_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`channel_ingress_events`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`channel_ingress_events`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`channel_ingress_events`,kind:`column`,value:{name:`lane_key`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`channel_ingress_events`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`channel_ingress_events`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`channel_ingress_events`,kind:`column`,value:{name:`received_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`channel_ingress_events`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`channel_ingress_events`,kind:`column`,value:{name:`claim_token`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`channel_ingress_events`,kind:`column`,value:{name:`claim_owner`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`channel_ingress_events`,kind:`column`,value:{name:`claimed_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`channel_ingress_events`,kind:`column`,value:{name:`attempts`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:14}},{table:`channel_ingress_events`,kind:`column`,value:{name:`last_attempt_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:15}},{table:`channel_ingress_events`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`channel_ingress_events`,kind:`column`,value:{name:`failed_reason`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`channel_ingress_events`,kind:`column`,value:{name:`failed_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:18}},{table:`channel_ingress_events`,kind:`column`,value:{name:`completed_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:19}},{table:`channel_ingress_events`,kind:`column`,value:{name:`completed_metadata_json`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`channel_ingress_events`,kind:`primaryKey`,value:[`queue_name`,`event_id`]},{table:`channel_ingress_events`,kind:`indexes`,value:4},{table:`channel_ingress_events`,kind:`checks`,value:0},{table:`channel_pairing_allow_entries`,kind:`table`,value:null},{table:`channel_pairing_allow_entries`,kind:`column`,value:{name:`channel_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`channel_pairing_allow_entries`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`channel_pairing_allow_entries`,kind:`column`,value:{name:`entry`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`channel_pairing_allow_entries`,kind:`column`,value:{name:`sort_order`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`channel_pairing_allow_entries`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`channel_pairing_allow_entries`,kind:`primaryKey`,value:[`channel_key`,`account_id`,`entry`]},{table:`channel_pairing_allow_entries`,kind:`indexes`,value:2},{table:`channel_pairing_allow_entries`,kind:`checks`,value:0},{table:`channel_pairing_requests`,kind:`table`,value:null},{table:`channel_pairing_requests`,kind:`column`,value:{name:`channel_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`code`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`created_at`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`last_seen_at`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`channel_pairing_requests`,kind:`column`,value:{name:`meta_json`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`channel_pairing_requests`,kind:`primaryKey`,value:[`channel_key`,`account_id`,`request_id`]},{table:`channel_pairing_requests`,kind:`indexes`,value:3},{table:`channel_pairing_requests`,kind:`checks`,value:0},{table:`clawhub_promotion_claims`,kind:`table`,value:null},{table:`clawhub_promotion_claims`,kind:`column`,value:{name:`slug`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`clawhub_promotion_claims`,kind:`column`,value:{name:`provider`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`clawhub_promotion_claims`,kind:`column`,value:{name:`model_keys_json`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`clawhub_promotion_claims`,kind:`column`,value:{name:`ends_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`clawhub_promotion_claims`,kind:`column`,value:{name:`claimed_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`clawhub_promotion_claims`,kind:`primaryKey`,value:[`slug`]},{table:`clawhub_promotion_claims`,kind:`indexes`,value:1},{table:`clawhub_promotion_claims`,kind:`checks`,value:0},{table:`config_health_entries`,kind:`table`,value:null},{table:`config_health_entries`,kind:`column`,value:{name:`config_path`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`config_health_entries`,kind:`column`,value:{name:`last_known_good_json`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`config_health_entries`,kind:`column`,value:{name:`last_promoted_good_json`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`config_health_entries`,kind:`column`,value:{name:`last_observed_suspicious_signature`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`config_health_entries`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`config_health_entries`,kind:`primaryKey`,value:[`config_path`]},{table:`config_health_entries`,kind:`indexes`,value:1},{table:`config_health_entries`,kind:`checks`,value:0},{table:`config_machine_state`,kind:`table`,value:null},{table:`config_machine_state`,kind:`column`,value:{name:`state_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`config_machine_state`,kind:`column`,value:{name:`value_json`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`config_machine_state`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`config_machine_state`,kind:`primaryKey`,value:[`state_key`]},{table:`config_machine_state`,kind:`indexes`,value:1},{table:`config_machine_state`,kind:`checks`,value:0},{table:`config_revision_keys`,kind:`table`,value:null},{table:`config_revision_keys`,kind:`column`,value:{name:`id`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`config_revision_keys`,kind:`column`,value:{name:`hmac_key`,type:`bytea`,nullable:!1,identity:!1,default:null,position:2}},{table:`config_revision_keys`,kind:`primaryKey`,value:[`id`]},{table:`config_revision_keys`,kind:`indexes`,value:1},{table:`config_revision_keys`,kind:`checks`,value:2},{table:`cron_job_runtime_authorities`,kind:`table`,value:null},{table:`cron_job_runtime_authorities`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`cron_job_runtime_authorities`,kind:`column`,value:{name:`job_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`cron_job_runtime_authorities`,kind:`column`,value:{name:`authority_json`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`cron_job_runtime_authorities`,kind:`column`,value:{name:`authority_input_fingerprint`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`cron_job_runtime_authorities`,kind:`column`,value:{name:`recovery_required`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`cron_job_runtime_authorities`,kind:`primaryKey`,value:[`store_key`,`job_id`]},{table:`cron_job_runtime_authorities`,kind:`foreignKey`,value:{columns:[`store_key`,`job_id`],target:`cron_jobs`,targetColumns:[`store_key`,`job_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`cron_job_runtime_authorities`,kind:`indexes`,value:1},{table:`cron_job_runtime_authorities`,kind:`checks`,value:2},{table:`cron_job_scratch`,kind:`table`,value:null},{table:`cron_job_scratch`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`cron_job_scratch`,kind:`column`,value:{name:`job_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`cron_job_scratch`,kind:`column`,value:{name:`content`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`cron_job_scratch`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`cron_job_scratch`,kind:`column`,value:{name:`source_sha256`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`cron_job_scratch`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`cron_job_scratch`,kind:`primaryKey`,value:[`store_key`,`job_id`]},{table:`cron_job_scratch`,kind:`indexes`,value:2},{table:`cron_job_scratch`,kind:`checks`,value:2},{table:`cron_jobs`,kind:`table`,value:null},{table:`cron_jobs`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`cron_jobs`,kind:`column`,value:{name:`job_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`cron_jobs`,kind:`column`,value:{name:`declaration_key`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`cron_jobs`,kind:`column`,value:{name:`owner_agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`cron_jobs`,kind:`column`,value:{name:`name`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`cron_jobs`,kind:`column`,value:{name:`description`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`cron_jobs`,kind:`column`,value:{name:`enabled`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`cron_jobs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`cron_jobs`,kind:`column`,value:{name:`payload_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`cron_jobs`,kind:`column`,value:{name:`job_json`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`cron_jobs`,kind:`column`,value:{name:`grant_definition_revision`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`cron_jobs`,kind:`column`,value:{name:`grant_definition_generation`,type:`bigint`,nullable:!0,identity:!1,default:null,position:12}},{table:`cron_jobs`,kind:`column`,value:{name:`grant_definition_updated_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`cron_jobs`,kind:`column`,value:{name:`state_json`,type:`text`,nullable:!1,identity:!1,default:`'{}'`,position:14}},{table:`cron_jobs`,kind:`column`,value:{name:`runtime_updated_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:15}},{table:`cron_jobs`,kind:`column`,value:{name:`schedule_identity`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`cron_jobs`,kind:`column`,value:{name:`sort_order`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:17}},{table:`cron_jobs`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:18}},{table:`cron_jobs`,kind:`primaryKey`,value:[`store_key`,`job_id`]},{table:`cron_jobs`,kind:`indexes`,value:2},{table:`cron_jobs`,kind:`checks`,value:0},{table:`cron_run_receipts`,kind:`table`,value:null},{table:`cron_run_receipts`,kind:`column`,value:{name:`cursor_id`,type:`bigint`,nullable:!1,identity:!1,default:null,position:1}},{table:`cron_run_receipts`,kind:`column`,value:{name:`receipt_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`cron_run_receipts`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`cron_run_receipts`,kind:`column`,value:{name:`job_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`cron_run_receipts`,kind:`column`,value:{name:`config_revision`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`cron_run_receipts`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`cron_run_receipts`,kind:`column`,value:{name:`request_run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`cron_run_receipts`,kind:`column`,value:{name:`delivery_attempt_state`,type:`text`,nullable:!1,identity:!1,default:`'unknown'`,position:8}},{table:`cron_run_receipts`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`cron_run_receipts`,kind:`column`,value:{name:`owner_pid`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`cron_run_receipts`,kind:`column`,value:{name:`owner_start_time`,type:`bigint`,nullable:!0,identity:!1,default:null,position:11}},{table:`cron_run_receipts`,kind:`column`,value:{name:`started_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`cron_run_receipts`,kind:`column`,value:{name:`finished_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`cron_run_receipts`,kind:`column`,value:{name:`error_text`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`cron_run_receipts`,kind:`primaryKey`,value:[`receipt_id`]},{table:`cron_run_receipts`,kind:`indexes`,value:4},{table:`cron_run_receipts`,kind:`checks`,value:3},{table:`cron_run_trigger_state_retirements`,kind:`table`,value:null},{table:`cron_run_trigger_state_retirements`,kind:`column`,value:{name:`receipt_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`cron_run_trigger_state_retirements`,kind:`primaryKey`,value:[`receipt_id`]},{table:`cron_run_trigger_state_retirements`,kind:`foreignKey`,value:{columns:[`receipt_id`],target:`cron_run_receipts`,targetColumns:[`receipt_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`cron_run_trigger_state_retirements`,kind:`indexes`,value:1},{table:`cron_run_trigger_state_retirements`,kind:`checks`,value:0},{table:`current_conversation_bindings`,kind:`table`,value:null},{table:`current_conversation_bindings`,kind:`column`,value:{name:`binding_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`binding_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`target_session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`channel`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`conversation_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`parent_conversation_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`conversation_id`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`target_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`bound_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:12}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`record_json`,type:`text`,nullable:!1,identity:!1,default:null,position:14}},{table:`current_conversation_bindings`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:15}},{table:`current_conversation_bindings`,kind:`primaryKey`,value:[`binding_key`]},{table:`current_conversation_bindings`,kind:`indexes`,value:4},{table:`current_conversation_bindings`,kind:`checks`,value:0},{table:`delivery_queue_entries`,kind:`table`,value:null},{table:`delivery_queue_entries`,kind:`column`,value:{name:`queue_name`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`entry_kind`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`channel`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`target`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`retry_count`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:9}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`last_attempt_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:10}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`recovery_state`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`platform_send_started_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`entry_json`,type:`text`,nullable:!1,identity:!1,default:null,position:14}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`retention_id_prefix`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`retention_max_age_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:16}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`retention_max_entries`,type:`bigint`,nullable:!0,identity:!1,default:null,position:17}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`enqueued_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:18}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:19}},{table:`delivery_queue_entries`,kind:`column`,value:{name:`failed_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:20}},{table:`delivery_queue_entries`,kind:`primaryKey`,value:[`queue_name`,`id`]},{table:`delivery_queue_entries`,kind:`indexes`,value:6},{table:`delivery_queue_entries`,kind:`checks`,value:0},{table:`device_bootstrap_tokens`,kind:`table`,value:null},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`token_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`token`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`setup_id`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`ts`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`public_key`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`profile_json`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`redeemed_profile_json`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`pending_profile_json`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`issued_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`device_bootstrap_tokens`,kind:`column`,value:{name:`last_used_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:11}},{table:`device_bootstrap_tokens`,kind:`primaryKey`,value:[`token_key`]},{table:`device_bootstrap_tokens`,kind:`indexes`,value:2},{table:`device_bootstrap_tokens`,kind:`checks`,value:0},{table:`device_pair_setup_completions`,kind:`table`,value:null},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`setup_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`device_name`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`access`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`completed_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`delivery_state`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`device_pair_setup_completions`,kind:`column`,value:{name:`retain_until_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`device_pair_setup_completions`,kind:`primaryKey`,value:[`setup_id`]},{table:`device_pair_setup_completions`,kind:`indexes`,value:1},{table:`device_pair_setup_completions`,kind:`checks`,value:1},{table:`device_pairing_browser_requests`,kind:`table`,value:null},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`code`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`public_key`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`remote_ip`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`user_agent`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`origin`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`approved_token_sha256`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`device_pairing_browser_requests`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`device_pairing_browser_requests`,kind:`primaryKey`,value:[`request_id`]},{table:`device_pairing_browser_requests`,kind:`unique`,value:[`code`]},{table:`device_pairing_browser_requests`,kind:`unique`,value:[`device_id`]},{table:`device_pairing_browser_requests`,kind:`indexes`,value:3},{table:`device_pairing_browser_requests`,kind:`checks`,value:1},{table:`device_pairing_join_codes`,kind:`table`,value:null},{table:`device_pairing_join_codes`,kind:`column`,value:{name:`shortcode`,type:`text`,nullable:!0,identity:!1,default:null,position:1}},{table:`device_pairing_join_codes`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`device_pairing_join_codes`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`device_pairing_join_codes`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:4}},{table:`device_pairing_join_codes`,kind:`indexes`,value:0},{table:`device_pairing_join_codes`,kind:`checks`,value:0},{table:`device_pairing_paired`,kind:`table`,value:null},{table:`device_pairing_paired`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`device_pairing_paired`,kind:`column`,value:{name:`public_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`device_pairing_paired`,kind:`column`,value:{name:`display_name`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`device_pairing_paired`,kind:`column`,value:{name:`operator_label`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`device_pairing_paired`,kind:`column`,value:{name:`platform`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`device_pairing_paired`,kind:`column`,value:{name:`device_family`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`device_pairing_paired`,kind:`column`,value:{name:`client_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`device_pairing_paired`,kind:`column`,value:{name:`client_mode`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`device_pairing_paired`,kind:`column`,value:{name:`browser_origin`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`device_pairing_paired`,kind:`column`,value:{name:`role`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`device_pairing_paired`,kind:`column`,value:{name:`roles_json`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`device_pairing_paired`,kind:`column`,value:{name:`scopes_json`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`device_pairing_paired`,kind:`column`,value:{name:`approved_scopes_json`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`device_pairing_paired`,kind:`column`,value:{name:`remote_ip`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`device_pairing_paired`,kind:`column`,value:{name:`tokens_json`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`device_pairing_paired`,kind:`column`,value:{name:`approved_via`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`device_pairing_paired`,kind:`column`,value:{name:`node_surface_json`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`device_pairing_paired`,kind:`column`,value:{name:`pending_node_surface_json`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`device_pairing_paired`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:19}},{table:`device_pairing_paired`,kind:`column`,value:{name:`approved_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:20}},{table:`device_pairing_paired`,kind:`column`,value:{name:`last_seen_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:21}},{table:`device_pairing_paired`,kind:`column`,value:{name:`last_seen_reason`,type:`text`,nullable:!0,identity:!1,default:null,position:22}},{table:`device_pairing_paired`,kind:`primaryKey`,value:[`device_id`]},{table:`device_pairing_paired`,kind:`indexes`,value:2},{table:`device_pairing_paired`,kind:`checks`,value:0},{table:`device_pairing_pending`,kind:`table`,value:null},{table:`device_pairing_pending`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`device_pairing_pending`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`device_pairing_pending`,kind:`column`,value:{name:`public_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`device_pairing_pending`,kind:`column`,value:{name:`display_name`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`device_pairing_pending`,kind:`column`,value:{name:`platform`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`device_pairing_pending`,kind:`column`,value:{name:`device_family`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`device_pairing_pending`,kind:`column`,value:{name:`client_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`device_pairing_pending`,kind:`column`,value:{name:`client_mode`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`device_pairing_pending`,kind:`column`,value:{name:`browser_origin`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`device_pairing_pending`,kind:`column`,value:{name:`role`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`device_pairing_pending`,kind:`column`,value:{name:`roles_json`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`device_pairing_pending`,kind:`column`,value:{name:`scopes_json`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`device_pairing_pending`,kind:`column`,value:{name:`remote_ip`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`device_pairing_pending`,kind:`column`,value:{name:`silent`,type:`bigint`,nullable:!0,identity:!1,default:null,position:14}},{table:`device_pairing_pending`,kind:`column`,value:{name:`is_repair`,type:`bigint`,nullable:!0,identity:!1,default:null,position:15}},{table:`device_pairing_pending`,kind:`column`,value:{name:`ts`,type:`bigint`,nullable:!1,identity:!1,default:null,position:16}},{table:`device_pairing_pending`,kind:`column`,value:{name:`refreshed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:17}},{table:`device_pairing_pending`,kind:`primaryKey`,value:[`request_id`]},{table:`device_pairing_pending`,kind:`indexes`,value:2},{table:`device_pairing_pending`,kind:`checks`,value:0},{table:`diagnostic_events`,kind:`table`,value:null},{table:`diagnostic_events`,kind:`column`,value:{name:`scope`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`diagnostic_events`,kind:`column`,value:{name:`event_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`diagnostic_events`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`diagnostic_events`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`diagnostic_events`,kind:`column`,value:{name:`sequence`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:5}},{table:`diagnostic_events`,kind:`primaryKey`,value:[`scope`,`event_key`]},{table:`diagnostic_events`,kind:`indexes`,value:2},{table:`diagnostic_events`,kind:`checks`,value:0},{table:`durable_background_processes`,kind:`table`,value:null},{table:`durable_background_processes`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`durable_background_processes`,kind:`column`,value:{name:`record_json`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`durable_background_processes`,kind:`primaryKey`,value:[`id`]},{table:`durable_background_processes`,kind:`indexes`,value:1},{table:`durable_background_processes`,kind:`checks`,value:0},{table:`exec_approvals_config`,kind:`table`,value:null},{table:`exec_approvals_config`,kind:`column`,value:{name:`config_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`exec_approvals_config`,kind:`column`,value:{name:`raw_json`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`exec_approvals_config`,kind:`column`,value:{name:`socket_path`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`exec_approvals_config`,kind:`column`,value:{name:`has_socket_token`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`exec_approvals_config`,kind:`column`,value:{name:`default_security`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`exec_approvals_config`,kind:`column`,value:{name:`default_ask`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`exec_approvals_config`,kind:`column`,value:{name:`default_ask_fallback`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`exec_approvals_config`,kind:`column`,value:{name:`auto_allow_skills`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`exec_approvals_config`,kind:`column`,value:{name:`agent_count`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`exec_approvals_config`,kind:`column`,value:{name:`allowlist_count`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`exec_approvals_config`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`exec_approvals_config`,kind:`primaryKey`,value:[`config_key`]},{table:`exec_approvals_config`,kind:`indexes`,value:1},{table:`exec_approvals_config`,kind:`checks`,value:0},{table:`execution_decision_facts`,kind:`table`,value:null},{table:`execution_decision_facts`,kind:`column`,value:{name:`cursor_id`,type:`bigint`,nullable:!1,identity:!1,default:null,position:1}},{table:`execution_decision_facts`,kind:`column`,value:{name:`receipt_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`execution_decision_facts`,kind:`column`,value:{name:`context_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`execution_decision_facts`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`execution_decision_facts`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`execution_decision_facts`,kind:`column`,value:{name:`action_id`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`execution_decision_facts`,kind:`column`,value:{name:`action_family`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`execution_decision_facts`,kind:`column`,value:{name:`decision_outcome`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`execution_decision_facts`,kind:`column`,value:{name:`coverage_state`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`execution_decision_facts`,kind:`column`,value:{name:`reason_code`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`execution_decision_facts`,kind:`column`,value:{name:`owner`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`execution_decision_facts`,kind:`column`,value:{name:`source_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`execution_decision_facts`,kind:`column`,value:{name:`occurred_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`execution_decision_facts`,kind:`column`,value:{name:`receipt_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:14}},{table:`execution_decision_facts`,kind:`column`,value:{name:`receipt_json`,type:`text`,nullable:!1,identity:!1,default:null,position:15}},{table:`execution_decision_facts`,kind:`primaryKey`,value:[`receipt_id`]},{table:`execution_decision_facts`,kind:`unique`,value:[`occurred_at`,`receipt_id`]},{table:`execution_decision_facts`,kind:`indexes`,value:5},{table:`execution_decision_facts`,kind:`checks`,value:14},{table:`execution_identity_contexts`,kind:`table`,value:null},{table:`execution_identity_contexts`,kind:`column`,value:{name:`context_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`coverage_state`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`context_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`execution_identity_contexts`,kind:`column`,value:{name:`context_json`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`execution_identity_contexts`,kind:`primaryKey`,value:[`context_id`]},{table:`execution_identity_contexts`,kind:`unique`,value:[`execution_id`]},{table:`execution_identity_contexts`,kind:`unique`,value:[`created_at`,`context_id`]},{table:`execution_identity_contexts`,kind:`indexes`,value:4},{table:`execution_identity_contexts`,kind:`checks`,value:7},{table:`execution_owner_lifecycle_bindings`,kind:`table`,value:null},{table:`execution_owner_lifecycle_bindings`,kind:`column`,value:{name:`owner_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`execution_owner_lifecycle_bindings`,kind:`column`,value:{name:`owner_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`execution_owner_lifecycle_bindings`,kind:`column`,value:{name:`context_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`execution_owner_lifecycle_bindings`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`execution_owner_lifecycle_bindings`,kind:`primaryKey`,value:[`owner_kind`,`owner_id`]},{table:`execution_owner_lifecycle_bindings`,kind:`indexes`,value:1},{table:`execution_owner_lifecycle_bindings`,kind:`checks`,value:0},{table:`flow_runs`,kind:`table`,value:null},{table:`flow_runs`,kind:`column`,value:{name:`flow_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`flow_runs`,kind:`column`,value:{name:`shape`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`flow_runs`,kind:`column`,value:{name:`sync_mode`,type:`text`,nullable:!1,identity:!1,default:`'managed'`,position:3}},{table:`flow_runs`,kind:`column`,value:{name:`owner_key`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`flow_runs`,kind:`column`,value:{name:`requester_origin_json`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`flow_runs`,kind:`column`,value:{name:`controller_id`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`flow_runs`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:7}},{table:`flow_runs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`flow_runs`,kind:`column`,value:{name:`notify_policy`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`flow_runs`,kind:`column`,value:{name:`goal`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`flow_runs`,kind:`column`,value:{name:`current_step`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`flow_runs`,kind:`column`,value:{name:`blocked_task_id`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`flow_runs`,kind:`column`,value:{name:`blocked_summary`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`flow_runs`,kind:`column`,value:{name:`state_json`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`flow_runs`,kind:`column`,value:{name:`wait_json`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`flow_runs`,kind:`column`,value:{name:`cancel_requested_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:16}},{table:`flow_runs`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:17}},{table:`flow_runs`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:18}},{table:`flow_runs`,kind:`column`,value:{name:`ended_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:19}},{table:`flow_runs`,kind:`primaryKey`,value:[`flow_id`]},{table:`flow_runs`,kind:`indexes`,value:4},{table:`flow_runs`,kind:`checks`,value:0},{table:`gateway_boot_lifecycle`,kind:`table`,value:null},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`boot_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`pid`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`started_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`completed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:4}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`outcome`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`startup_reason`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`gateway_boot_lifecycle`,kind:`column`,value:{name:`reason`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`gateway_boot_lifecycle`,kind:`primaryKey`,value:[`boot_id`]},{table:`gateway_boot_lifecycle`,kind:`indexes`,value:2},{table:`gateway_boot_lifecycle`,kind:`checks`,value:0},{table:`gateway_restart_handoff`,kind:`table`,value:null},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`handoff_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`intent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`pid`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`process_instance_id`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`reason`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`restart_trace_started_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:10}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`restart_trace_last_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:11}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`source`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`restart_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:13}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`supervisor_mode`,type:`text`,nullable:!1,identity:!1,default:null,position:14}},{table:`gateway_restart_handoff`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:15}},{table:`gateway_restart_handoff`,kind:`primaryKey`,value:[`handoff_key`]},{table:`gateway_restart_handoff`,kind:`indexes`,value:2},{table:`gateway_restart_handoff`,kind:`checks`,value:0},{table:`gateway_restart_intent`,kind:`table`,value:null},{table:`gateway_restart_intent`,kind:`column`,value:{name:`intent_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`pid`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`reason`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`force`,type:`bigint`,nullable:!0,identity:!1,default:null,position:6}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`wait_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:7}},{table:`gateway_restart_intent`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`gateway_restart_intent`,kind:`primaryKey`,value:[`intent_key`]},{table:`gateway_restart_intent`,kind:`indexes`,value:1},{table:`gateway_restart_intent`,kind:`checks`,value:0},{table:`gateway_restart_sentinel`,kind:`table`,value:null},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`sentinel_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`ts`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`thread_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`delivery_channel`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`delivery_to`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`delivery_account_id`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`message`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`continuation_json`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`doctor_hint`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`stats_json`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:!1,identity:!1,default:null,position:15}},{table:`gateway_restart_sentinel`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:16}},{table:`gateway_restart_sentinel`,kind:`primaryKey`,value:[`sentinel_key`]},{table:`gateway_restart_sentinel`,kind:`indexes`,value:2},{table:`gateway_restart_sentinel`,kind:`checks`,value:0},{table:`github_personal_publication_requests`,kind:`table`,value:null},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`owner_profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`connection_generation`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`idempotency_key`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`request_digest`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`worktree_id`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`repository_fingerprint`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`identity_source`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`identity_profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`identity_account_id`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`identity_login`,type:`text`,nullable:!1,identity:!1,default:null,position:14}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`title`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`body`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:17}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`gateway_instance_id`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:!0,identity:!1,default:null,position:19}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`last_effect`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`effect_state`,type:`text`,nullable:!0,identity:!1,default:null,position:21}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`push_repository`,type:`text`,nullable:!1,identity:!1,default:null,position:22}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`repository`,type:`text`,nullable:!1,identity:!1,default:null,position:23}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`branch`,type:`text`,nullable:!1,identity:!1,default:null,position:24}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`base_branch`,type:`text`,nullable:!1,identity:!1,default:null,position:25}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`source_head_commit`,type:`text`,nullable:!1,identity:!1,default:null,position:26}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`source_index_tree`,type:`text`,nullable:!1,identity:!1,default:null,position:27}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`workspace_tree`,type:`text`,nullable:!1,identity:!1,default:null,position:28}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`head_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:29}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`pull_request_url`,type:`text`,nullable:!0,identity:!1,default:null,position:30}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`error_code`,type:`text`,nullable:!0,identity:!1,default:null,position:31}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`next_action`,type:`text`,nullable:!0,identity:!1,default:null,position:32}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:33}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:34}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`reported_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:35}},{table:`github_personal_publication_requests`,kind:`column`,value:{name:`draft`,type:`bigint`,nullable:!0,identity:!1,default:null,position:36}},{table:`github_personal_publication_requests`,kind:`primaryKey`,value:[`request_id`]},{table:`github_personal_publication_requests`,kind:`unique`,value:[`owner_profile_id`,`session_id`,`idempotency_key`]},{table:`github_personal_publication_requests`,kind:`indexes`,value:4},{table:`github_personal_publication_requests`,kind:`checks`,value:37},{table:`github_publication_requests`,kind:`table`,value:null},{table:`github_publication_requests`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`github_publication_requests`,kind:`column`,value:{name:`idempotency_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`github_publication_requests`,kind:`column`,value:{name:`request_digest`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`github_publication_requests`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`github_publication_requests`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`github_publication_requests`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`github_publication_requests`,kind:`column`,value:{name:`worktree_id`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`github_publication_requests`,kind:`column`,value:{name:`repository_fingerprint`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`github_publication_requests`,kind:`column`,value:{name:`claim_id`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`github_publication_requests`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`github_publication_requests`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`github_publication_requests`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!0,identity:!1,default:null,position:12}},{table:`github_publication_requests`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`github_publication_requests`,kind:`column`,value:{name:`identity_source`,type:`text`,nullable:!1,identity:!1,default:null,position:14}},{table:`github_publication_requests`,kind:`column`,value:{name:`identity_profile_id`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`github_publication_requests`,kind:`column`,value:{name:`identity_account_id`,type:`bigint`,nullable:!1,identity:!1,default:null,position:16}},{table:`github_publication_requests`,kind:`column`,value:{name:`identity_login`,type:`text`,nullable:!1,identity:!1,default:null,position:17}},{table:`github_publication_requests`,kind:`column`,value:{name:`title`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`github_publication_requests`,kind:`column`,value:{name:`body`,type:`text`,nullable:!0,identity:!1,default:null,position:19}},{table:`github_publication_requests`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:20}},{table:`github_publication_requests`,kind:`column`,value:{name:`gateway_instance_id`,type:`text`,nullable:!0,identity:!1,default:null,position:21}},{table:`github_publication_requests`,kind:`column`,value:{name:`repository`,type:`text`,nullable:!0,identity:!1,default:null,position:22}},{table:`github_publication_requests`,kind:`column`,value:{name:`branch`,type:`text`,nullable:!1,identity:!1,default:null,position:23}},{table:`github_publication_requests`,kind:`column`,value:{name:`base_branch`,type:`text`,nullable:!0,identity:!1,default:null,position:24}},{table:`github_publication_requests`,kind:`column`,value:{name:`source_head_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:25}},{table:`github_publication_requests`,kind:`column`,value:{name:`source_index_tree`,type:`text`,nullable:!0,identity:!1,default:null,position:26}},{table:`github_publication_requests`,kind:`column`,value:{name:`workspace_tree`,type:`text`,nullable:!0,identity:!1,default:null,position:27}},{table:`github_publication_requests`,kind:`column`,value:{name:`head_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:28}},{table:`github_publication_requests`,kind:`column`,value:{name:`pull_request_url`,type:`text`,nullable:!0,identity:!1,default:null,position:29}},{table:`github_publication_requests`,kind:`column`,value:{name:`error_code`,type:`text`,nullable:!0,identity:!1,default:null,position:30}},{table:`github_publication_requests`,kind:`column`,value:{name:`next_action`,type:`text`,nullable:!0,identity:!1,default:null,position:31}},{table:`github_publication_requests`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:32}},{table:`github_publication_requests`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:33}},{table:`github_publication_requests`,kind:`column`,value:{name:`reported_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:34}},{table:`github_publication_requests`,kind:`column`,value:{name:`draft`,type:`bigint`,nullable:!0,identity:!1,default:null,position:35}},{table:`github_publication_requests`,kind:`primaryKey`,value:[`request_id`]},{table:`github_publication_requests`,kind:`unique`,value:[`session_id`,`idempotency_key`]},{table:`github_publication_requests`,kind:`indexes`,value:3},{table:`github_publication_requests`,kind:`checks`,value:9},{table:`github_publication_session_lifecycles`,kind:`table`,value:null},{table:`github_publication_session_lifecycles`,kind:`column`,value:{name:`publication_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`github_publication_session_lifecycles`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`github_publication_session_lifecycles`,kind:`column`,value:{name:`lifecycle_revision`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`github_publication_session_lifecycles`,kind:`column`,value:{name:`requester_authority_json`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`github_publication_session_lifecycles`,kind:`primaryKey`,value:[`publication_kind`,`request_id`]},{table:`github_publication_session_lifecycles`,kind:`indexes`,value:1},{table:`github_publication_session_lifecycles`,kind:`checks`,value:1},{table:`github_repository_publication_requests`,kind:`table`,value:null},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`request_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`owner_profile_id`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`connection_generation`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`idempotency_key`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`request_digest`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`session_lifecycle_revision`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`requester_authority_json`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`workspace_id`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`checkpoint_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`checkpoint_digest`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`claim_id`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!0,identity:!1,default:null,position:17}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:!0,identity:!1,default:null,position:18}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`identity_source`,type:`text`,nullable:!1,identity:!1,default:null,position:19}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`identity_profile_id`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`identity_account_id`,type:`bigint`,nullable:!1,identity:!1,default:null,position:21}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`identity_login`,type:`text`,nullable:!1,identity:!1,default:null,position:22}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`title`,type:`text`,nullable:!0,identity:!1,default:null,position:23}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`body`,type:`text`,nullable:!0,identity:!1,default:null,position:24}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:25}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`gateway_instance_id`,type:`text`,nullable:!0,identity:!1,default:null,position:26}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:!0,identity:!1,default:null,position:27}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`last_effect`,type:`text`,nullable:!0,identity:!1,default:null,position:28}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`effect_state`,type:`text`,nullable:!0,identity:!1,default:null,position:29}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`push_repository`,type:`text`,nullable:!0,identity:!1,default:null,position:30}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`repository`,type:`text`,nullable:!0,identity:!1,default:null,position:31}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`branch`,type:`text`,nullable:!1,identity:!1,default:null,position:32}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`base_branch`,type:`text`,nullable:!0,identity:!1,default:null,position:33}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`source_head_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:34}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`source_index_tree`,type:`text`,nullable:!0,identity:!1,default:null,position:35}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`workspace_tree`,type:`text`,nullable:!0,identity:!1,default:null,position:36}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`previous_head_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:37}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`pushed_head_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:38}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`head_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:39}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`pull_request_url`,type:`text`,nullable:!0,identity:!1,default:null,position:40}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`error_code`,type:`text`,nullable:!0,identity:!1,default:null,position:41}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`next_action`,type:`text`,nullable:!0,identity:!1,default:null,position:42}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:43}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:44}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`reported_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:45}},{table:`github_repository_publication_requests`,kind:`column`,value:{name:`draft`,type:`bigint`,nullable:!0,identity:!1,default:null,position:46}},{table:`github_repository_publication_requests`,kind:`primaryKey`,value:[`request_id`]},{table:`github_repository_publication_requests`,kind:`indexes`,value:3},{table:`github_repository_publication_requests`,kind:`checks`,value:7},{table:`local_workspace_manifest_nodes`,kind:`table`,value:null},{table:`local_workspace_manifest_nodes`,kind:`column`,value:{name:`worktree_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`local_workspace_manifest_nodes`,kind:`column`,value:{name:`path`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`local_workspace_manifest_nodes`,kind:`column`,value:{name:`node_json`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`local_workspace_manifest_nodes`,kind:`primaryKey`,value:[`worktree_id`,`path`]},{table:`local_workspace_manifest_nodes`,kind:`foreignKey`,value:{columns:[`worktree_id`],target:`local_workspace_projections`,targetColumns:[`worktree_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`local_workspace_manifest_nodes`,kind:`indexes`,value:1},{table:`local_workspace_manifest_nodes`,kind:`checks`,value:0},{table:`local_workspace_projections`,kind:`table`,value:null},{table:`local_workspace_projections`,kind:`column`,value:{name:`worktree_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`local_workspace_projections`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`local_workspace_projections`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`local_workspace_projections`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`local_workspace_projections`,kind:`column`,value:{name:`lifecycle_revision`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`local_workspace_projections`,kind:`column`,value:{name:`projection_path`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`local_workspace_projections`,kind:`column`,value:{name:`base_commit`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`local_workspace_projections`,kind:`column`,value:{name:`source_paths_json`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`local_workspace_projections`,kind:`column`,value:{name:`baseline_json`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`local_workspace_projections`,kind:`column`,value:{name:`baseline_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`local_workspace_projections`,kind:`column`,value:{name:`pending_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`local_workspace_projections`,kind:`column`,value:{name:`pending_target`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`local_workspace_projections`,kind:`column`,value:{name:`paused_runtimes_json`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`local_workspace_projections`,kind:`column`,value:{name:`journal_json`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`local_workspace_projections`,kind:`column`,value:{name:`journal_pack`,type:`bytea`,nullable:!0,identity:!1,default:null,position:15}},{table:`local_workspace_projections`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:16}},{table:`local_workspace_projections`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:17}},{table:`local_workspace_projections`,kind:`column`,value:{name:`checkpoint_json`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`local_workspace_projections`,kind:`column`,value:{name:`tree_root_digest`,type:`bytea`,nullable:!0,identity:!1,default:null,position:19}},{table:`local_workspace_projections`,kind:`column`,value:{name:`source_paths_digest`,type:`bytea`,nullable:!0,identity:!1,default:null,position:20}},{table:`local_workspace_projections`,kind:`column`,value:{name:`canonical_fingerprints`,type:`bytea`,nullable:!0,identity:!1,default:null,position:21}},{table:`local_workspace_projections`,kind:`column`,value:{name:`projection_fingerprints`,type:`bytea`,nullable:!0,identity:!1,default:null,position:22}},{table:`local_workspace_projections`,kind:`primaryKey`,value:[`worktree_id`]},{table:`local_workspace_projections`,kind:`unique`,value:[`projection_path`]},{table:`local_workspace_projections`,kind:`indexes`,value:2},{table:`local_workspace_projections`,kind:`checks`,value:5},{table:`local_workspace_source_path_sets`,kind:`table`,value:null},{table:`local_workspace_source_path_sets`,kind:`column`,value:{name:`path_digest`,type:`bytea`,nullable:!1,identity:!1,default:null,position:1}},{table:`local_workspace_source_path_sets`,kind:`column`,value:{name:`paths_zstd`,type:`bytea`,nullable:!1,identity:!1,default:null,position:2}},{table:`local_workspace_source_path_sets`,kind:`column`,value:{name:`sweep_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`local_workspace_source_path_sets`,kind:`primaryKey`,value:[`path_digest`]},{table:`local_workspace_source_path_sets`,kind:`indexes`,value:1},{table:`local_workspace_source_path_sets`,kind:`checks`,value:1},{table:`local_workspace_tree_packs`,kind:`table`,value:null},{table:`local_workspace_tree_packs`,kind:`column`,value:{name:`tree_digest`,type:`bytea`,nullable:!1,identity:!1,default:null,position:1}},{table:`local_workspace_tree_packs`,kind:`column`,value:{name:`records_json`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`local_workspace_tree_packs`,kind:`column`,value:{name:`children_json`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`local_workspace_tree_packs`,kind:`column`,value:{name:`sweep_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`local_workspace_tree_packs`,kind:`primaryKey`,value:[`tree_digest`]},{table:`local_workspace_tree_packs`,kind:`indexes`,value:1},{table:`local_workspace_tree_packs`,kind:`checks`,value:1},{table:`macos_port_guardian_records`,kind:`table`,value:null},{table:`macos_port_guardian_records`,kind:`column`,value:{name:`pid`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`macos_port_guardian_records`,kind:`column`,value:{name:`port`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`macos_port_guardian_records`,kind:`column`,value:{name:`command`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`macos_port_guardian_records`,kind:`column`,value:{name:`mode`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`macos_port_guardian_records`,kind:`column`,value:{name:`timestamp`,type:`double precision`,nullable:!1,identity:!1,default:null,position:5}},{table:`macos_port_guardian_records`,kind:`primaryKey`,value:[`pid`]},{table:`macos_port_guardian_records`,kind:`indexes`,value:2},{table:`macos_port_guardian_records`,kind:`checks`,value:0},{table:`managed_outgoing_image_records`,kind:`table`,value:null},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`attachment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`message_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`created_at`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`updated_at`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`retention_class`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`alt`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_media_root`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_media_id`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_media_subdir`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_content_type`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_width`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_height`,type:`bigint`,nullable:!0,identity:!1,default:null,position:14}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_size_bytes`,type:`bigint`,nullable:!0,identity:!1,default:null,position:15}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`original_filename`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`record_json`,type:`text`,nullable:!1,identity:!1,default:null,position:17}},{table:`managed_outgoing_image_records`,kind:`column`,value:{name:`cleanup_pending`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:18}},{table:`managed_outgoing_image_records`,kind:`primaryKey`,value:[`attachment_id`]},{table:`managed_outgoing_image_records`,kind:`indexes`,value:5},{table:`managed_outgoing_image_records`,kind:`checks`,value:1},{table:`mcp_oauth_pending_authorizations`,kind:`table`,value:null},{table:`mcp_oauth_pending_authorizations`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`mcp_oauth_pending_authorizations`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`mcp_oauth_pending_authorizations`,kind:`column`,value:{name:`create_time`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`mcp_oauth_pending_authorizations`,kind:`primaryKey`,value:[`state`]},{table:`mcp_oauth_pending_authorizations`,kind:`indexes`,value:1},{table:`mcp_oauth_pending_authorizations`,kind:`checks`,value:0},{table:`mcp_oauth_stores`,kind:`table`,value:null},{table:`mcp_oauth_stores`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`mcp_oauth_stores`,kind:`column`,value:{name:`format_version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`mcp_oauth_stores`,kind:`column`,value:{name:`store_json`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`mcp_oauth_stores`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`mcp_oauth_stores`,kind:`primaryKey`,value:[`store_key`]},{table:`mcp_oauth_stores`,kind:`indexes`,value:1},{table:`mcp_oauth_stores`,kind:`checks`,value:1},{table:`meeting_transcript_sessions`,kind:`table`,value:null},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`started_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:1}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`started_at`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`selector`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`export_key`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`session_slug`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`provider_id`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`title`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_json`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_account_id`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_guild_id`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_channel_id`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_meeting_url`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_thread_ts`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`source_file_id`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`stopped_at`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`metadata_agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`export_manifest_json`,type:`text`,nullable:!1,identity:!1,default:`'{}'`,position:19}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`export_pending_json`,type:`text`,nullable:!1,identity:!1,default:`'[]'`,position:20}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`next_utterance_seq`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:21}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:22}},{table:`meeting_transcript_sessions`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:23}},{table:`meeting_transcript_sessions`,kind:`primaryKey`,value:[`session_id`,`started_at`]},{table:`meeting_transcript_sessions`,kind:`unique`,value:[`selector`]},{table:`meeting_transcript_sessions`,kind:`indexes`,value:10},{table:`meeting_transcript_sessions`,kind:`checks`,value:3},{table:`meeting_transcript_summaries`,kind:`table`,value:null},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`session_started_at`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`generated_at`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`summary_json`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`overview`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`markdown`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`meeting_transcript_summaries`,kind:`column`,value:{name:`utterance_count`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`meeting_transcript_summaries`,kind:`primaryKey`,value:[`session_id`,`session_started_at`]},{table:`meeting_transcript_summaries`,kind:`foreignKey`,value:{columns:[`session_id`,`session_started_at`],target:`meeting_transcript_sessions`,targetColumns:[`session_id`,`started_at`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`meeting_transcript_summaries`,kind:`indexes`,value:1},{table:`meeting_transcript_summaries`,kind:`checks`,value:2},{table:`meeting_transcript_utterances`,kind:`table`,value:null},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`session_started_at`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`sequence`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`utterance_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`started_at`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`ended_at`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`speaker_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`speaker_label`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`text`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`final`,type:`bigint`,nullable:!0,identity:!1,default:null,position:10}},{table:`meeting_transcript_utterances`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`meeting_transcript_utterances`,kind:`primaryKey`,value:[`session_id`,`session_started_at`,`sequence`]},{table:`meeting_transcript_utterances`,kind:`foreignKey`,value:{columns:[`session_id`,`session_started_at`],target:`meeting_transcript_sessions`,targetColumns:[`session_id`,`started_at`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`meeting_transcript_utterances`,kind:`indexes`,value:2},{table:`meeting_transcript_utterances`,kind:`checks`,value:2},{table:`migration_runs`,kind:`table`,value:null},{table:`migration_runs`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`migration_runs`,kind:`column`,value:{name:`started_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`migration_runs`,kind:`column`,value:{name:`finished_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`migration_runs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`migration_runs`,kind:`column`,value:{name:`report_json`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`migration_runs`,kind:`primaryKey`,value:[`id`]},{table:`migration_runs`,kind:`indexes`,value:2},{table:`migration_runs`,kind:`checks`,value:0},{table:`migration_sources`,kind:`table`,value:null},{table:`migration_sources`,kind:`column`,value:{name:`source_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`migration_sources`,kind:`column`,value:{name:`migration_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`migration_sources`,kind:`column`,value:{name:`source_path`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`migration_sources`,kind:`column`,value:{name:`target_table`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`migration_sources`,kind:`column`,value:{name:`source_sha256`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`migration_sources`,kind:`column`,value:{name:`source_size_bytes`,type:`bigint`,nullable:!0,identity:!1,default:null,position:6}},{table:`migration_sources`,kind:`column`,value:{name:`source_record_count`,type:`bigint`,nullable:!0,identity:!1,default:null,position:7}},{table:`migration_sources`,kind:`column`,value:{name:`last_run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`migration_sources`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`migration_sources`,kind:`column`,value:{name:`imported_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`migration_sources`,kind:`column`,value:{name:`removed_source`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:11}},{table:`migration_sources`,kind:`column`,value:{name:`report_json`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`migration_sources`,kind:`primaryKey`,value:[`source_key`]},{table:`migration_sources`,kind:`foreignKey`,value:{columns:[`last_run_id`],target:`migration_runs`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`migration_sources`,kind:`indexes`,value:3},{table:`migration_sources`,kind:`checks`,value:0},{table:`native_hook_relay_bridges`,kind:`table`,value:null},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`relay_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`pid`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`hostname`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`port`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`token`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`native_hook_relay_bridges`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`native_hook_relay_bridges`,kind:`primaryKey`,value:[`relay_id`]},{table:`native_hook_relay_bridges`,kind:`indexes`,value:2},{table:`native_hook_relay_bridges`,kind:`checks`,value:0},{table:`node_worker_launch_boots`,kind:`table`,value:null},{table:`node_worker_launch_boots`,kind:`column`,value:{name:`launch_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`node_worker_launch_boots`,kind:`column`,value:{name:`boot_id`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`node_worker_launch_boots`,kind:`primaryKey`,value:[`launch_id`]},{table:`node_worker_launch_boots`,kind:`foreignKey`,value:{columns:[`launch_id`],target:`node_worker_launches`,targetColumns:[`launch_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`node_worker_launch_boots`,kind:`indexes`,value:1},{table:`node_worker_launch_boots`,kind:`checks`,value:1},{table:`node_worker_launch_cleanup`,kind:`table`,value:null},{table:`node_worker_launch_cleanup`,kind:`column`,value:{name:`launch_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`node_worker_launch_cleanup`,kind:`column`,value:{name:`cleanup_mode`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`node_worker_launch_cleanup`,kind:`column`,value:{name:`lineage_settled`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`node_worker_launch_cleanup`,kind:`primaryKey`,value:[`launch_id`]},{table:`node_worker_launch_cleanup`,kind:`foreignKey`,value:{columns:[`launch_id`],target:`node_worker_launches`,targetColumns:[`launch_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`node_worker_launch_cleanup`,kind:`indexes`,value:1},{table:`node_worker_launch_cleanup`,kind:`checks`,value:2},{table:`node_worker_launch_containers`,kind:`table`,value:null},{table:`node_worker_launch_containers`,kind:`column`,value:{name:`launch_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`node_worker_launch_containers`,kind:`column`,value:{name:`container_json`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`node_worker_launch_containers`,kind:`primaryKey`,value:[`launch_id`]},{table:`node_worker_launch_containers`,kind:`indexes`,value:1},{table:`node_worker_launch_containers`,kind:`checks`,value:0},{table:`node_worker_launch_process_scopes`,kind:`table`,value:null},{table:`node_worker_launch_process_scopes`,kind:`column`,value:{name:`launch_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`node_worker_launch_process_scopes`,kind:`column`,value:{name:`scope_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`node_worker_launch_process_scopes`,kind:`column`,value:{name:`descendants_reaped`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`node_worker_launch_process_scopes`,kind:`primaryKey`,value:[`launch_id`]},{table:`node_worker_launch_process_scopes`,kind:`foreignKey`,value:{columns:[`launch_id`],target:`node_worker_launches`,targetColumns:[`launch_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`node_worker_launch_process_scopes`,kind:`indexes`,value:1},{table:`node_worker_launch_process_scopes`,kind:`checks`,value:2},{table:`node_worker_launches`,kind:`table`,value:null},{table:`node_worker_launches`,kind:`column`,value:{name:`launch_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`node_worker_launches`,kind:`column`,value:{name:`plan_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`node_worker_launches`,kind:`column`,value:{name:`gateway_namespace`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`node_worker_launches`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`node_worker_launches`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`node_worker_launches`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`node_worker_launches`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`node_worker_launches`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`node_worker_launches`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`node_worker_launches`,kind:`column`,value:{name:`supervisor_pid`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`node_worker_launches`,kind:`column`,value:{name:`supervisor_start_time`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`node_worker_launches`,kind:`column`,value:{name:`worker_pid`,type:`bigint`,nullable:!0,identity:!1,default:null,position:12}},{table:`node_worker_launches`,kind:`column`,value:{name:`worker_start_time`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`node_worker_launches`,kind:`column`,value:{name:`result_json`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`node_worker_launches`,kind:`column`,value:{name:`error_text`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`node_worker_launches`,kind:`column`,value:{name:`completed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:16}},{table:`node_worker_launches`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:17}},{table:`node_worker_launches`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:18}},{table:`node_worker_launches`,kind:`primaryKey`,value:[`launch_id`]},{table:`node_worker_launches`,kind:`indexes`,value:2},{table:`node_worker_launches`,kind:`checks`,value:20},{table:`node_worker_prepared_workspaces`,kind:`table`,value:null},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`preparation_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`cache_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`gateway_namespace`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`workspace_dir`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`home_dir`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`source_manifest_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`prepared_manifest_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!0,identity:!1,default:null,position:12}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`bound_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:14}},{table:`node_worker_prepared_workspaces`,kind:`column`,value:{name:`retired_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:15}},{table:`node_worker_prepared_workspaces`,kind:`primaryKey`,value:[`preparation_key`]},{table:`node_worker_prepared_workspaces`,kind:`unique`,value:[`workspace_dir`]},{table:`node_worker_prepared_workspaces`,kind:`indexes`,value:2},{table:`node_worker_prepared_workspaces`,kind:`checks`,value:15},{table:`node_worker_turns`,kind:`table`,value:null},{table:`node_worker_turns`,kind:`column`,value:{name:`turn_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`node_worker_turns`,kind:`column`,value:{name:`owner_launch_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`node_worker_turns`,kind:`column`,value:{name:`plan_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`node_worker_turns`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`node_worker_turns`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`node_worker_turns`,kind:`column`,value:{name:`result_json`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`node_worker_turns`,kind:`column`,value:{name:`error_text`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`node_worker_turns`,kind:`column`,value:{name:`completed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`node_worker_turns`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`node_worker_turns`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`node_worker_turns`,kind:`primaryKey`,value:[`turn_id`]},{table:`node_worker_turns`,kind:`foreignKey`,value:{columns:[`owner_launch_id`],target:`node_worker_launches`,targetColumns:[`launch_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`node_worker_turns`,kind:`indexes`,value:3},{table:`node_worker_turns`,kind:`checks`,value:10},{table:`official_external_plugin_catalog_snapshots`,kind:`table`,value:null},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`feed_url`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`body`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`status`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`etag`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`last_modified`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`checksum`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`saved_at`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`trust_mode`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`trust_key_id`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`trust_signature_count`,type:`bigint`,nullable:!0,identity:!1,default:null,position:10}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`trust_threshold`,type:`bigint`,nullable:!0,identity:!1,default:null,position:11}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`trust_verified_at`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`official_external_plugin_catalog_snapshots`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`official_external_plugin_catalog_snapshots`,kind:`primaryKey`,value:[`feed_url`]},{table:`official_external_plugin_catalog_snapshots`,kind:`indexes`,value:2},{table:`official_external_plugin_catalog_snapshots`,kind:`checks`,value:0},{table:`operator_approval_execution_identities`,kind:`table`,value:null},{table:`operator_approval_execution_identities`,kind:`column`,value:{name:`approval_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`operator_approval_execution_identities`,kind:`column`,value:{name:`source_context_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`operator_approval_execution_identities`,kind:`column`,value:{name:`source_execution_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`operator_approval_execution_identities`,kind:`primaryKey`,value:[`approval_id`]},{table:`operator_approval_execution_identities`,kind:`foreignKey`,value:{columns:[`approval_id`],target:`operator_approvals`,targetColumns:[`approval_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`operator_approval_execution_identities`,kind:`indexes`,value:1},{table:`operator_approval_execution_identities`,kind:`checks`,value:2},{table:`operator_approval_standing_grant_generations`,kind:`table`,value:null},{table:`operator_approval_standing_grant_generations`,kind:`column`,value:{name:`grant_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`operator_approval_standing_grant_generations`,kind:`column`,value:{name:`job_definition_generation`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`operator_approval_standing_grant_generations`,kind:`primaryKey`,value:[`grant_id`]},{table:`operator_approval_standing_grant_generations`,kind:`foreignKey`,value:{columns:[`grant_id`],target:`operator_approval_standing_grants`,targetColumns:[`grant_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`operator_approval_standing_grant_generations`,kind:`indexes`,value:1},{table:`operator_approval_standing_grant_generations`,kind:`checks`,value:1},{table:`operator_approval_standing_grants`,kind:`table`,value:null},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`grant_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`minted_by_approval_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`cron_job_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`job_config_revision`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`operation_binding`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`revoked_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`revoked_by`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`last_used_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:11}},{table:`operator_approval_standing_grants`,kind:`column`,value:{name:`use_count`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:12}},{table:`operator_approval_standing_grants`,kind:`primaryKey`,value:[`grant_id`]},{table:`operator_approval_standing_grants`,kind:`foreignKey`,value:{columns:[`minted_by_approval_id`],target:`operator_approvals`,targetColumns:[`approval_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`operator_approval_standing_grants`,kind:`indexes`,value:2},{table:`operator_approval_standing_grants`,kind:`checks`,value:6},{table:`operator_approvals`,kind:`table`,value:null},{table:`operator_approvals`,kind:`column`,value:{name:`cursor_id`,type:`bigint`,nullable:!1,identity:!1,default:null,position:1}},{table:`operator_approvals`,kind:`column`,value:{name:`approval_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`operator_approvals`,kind:`column`,value:{name:`resolution_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`operator_approvals`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`operator_approvals`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`operator_approvals`,kind:`column`,value:{name:`presentation_json`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`operator_approvals`,kind:`column`,value:{name:`requested_by_device_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`operator_approvals`,kind:`column`,value:{name:`requested_by_client_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`operator_approvals`,kind:`column`,value:{name:`requested_by_device_token_auth`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:9}},{table:`operator_approvals`,kind:`column`,value:{name:`reviewer_device_ids_json`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`operator_approvals`,kind:`column`,value:{name:`source_agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`operator_approvals`,kind:`column`,value:{name:`source_session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`operator_approvals`,kind:`column`,value:{name:`source_session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`operator_approvals`,kind:`column`,value:{name:`source_run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`operator_approvals`,kind:`column`,value:{name:`source_tool_call_id`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`operator_approvals`,kind:`column`,value:{name:`source_tool_name`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`operator_approvals`,kind:`column`,value:{name:`audience_session_keys_json`,type:`text`,nullable:!1,identity:!1,default:null,position:17}},{table:`operator_approvals`,kind:`column`,value:{name:`runtime_epoch`,type:`text`,nullable:!1,identity:!1,default:null,position:18}},{table:`operator_approvals`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:19}},{table:`operator_approvals`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:20}},{table:`operator_approvals`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:21}},{table:`operator_approvals`,kind:`column`,value:{name:`decision`,type:`text`,nullable:!0,identity:!1,default:null,position:22}},{table:`operator_approvals`,kind:`column`,value:{name:`terminal_reason`,type:`text`,nullable:!0,identity:!1,default:null,position:23}},{table:`operator_approvals`,kind:`column`,value:{name:`resolved_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:24}},{table:`operator_approvals`,kind:`column`,value:{name:`resolver_kind`,type:`text`,nullable:!0,identity:!1,default:null,position:25}},{table:`operator_approvals`,kind:`column`,value:{name:`resolver_id`,type:`text`,nullable:!0,identity:!1,default:null,position:26}},{table:`operator_approvals`,kind:`column`,value:{name:`consumed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:27}},{table:`operator_approvals`,kind:`column`,value:{name:`consumed_by`,type:`text`,nullable:!0,identity:!1,default:null,position:28}},{table:`operator_approvals`,kind:`primaryKey`,value:[`approval_id`]},{table:`operator_approvals`,kind:`indexes`,value:8},{table:`operator_approvals`,kind:`checks`,value:16},{table:`outbound_media_provenance`,kind:`table`,value:null},{table:`outbound_media_provenance`,kind:`column`,value:{name:`realpath`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`outbound_media_provenance`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`outbound_media_provenance`,kind:`column`,value:{name:`version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`outbound_media_provenance`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`outbound_media_provenance`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`outbound_media_provenance`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`outbound_media_provenance`,kind:`primaryKey`,value:[`realpath`]},{table:`outbound_media_provenance`,kind:`indexes`,value:1},{table:`outbound_media_provenance`,kind:`checks`,value:0},{table:`outbound_message_execution_bindings`,kind:`table`,value:null},{table:`outbound_message_execution_bindings`,kind:`column`,value:{name:`event_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`outbound_message_execution_bindings`,kind:`column`,value:{name:`context_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`outbound_message_execution_bindings`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`outbound_message_execution_bindings`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`outbound_message_execution_bindings`,kind:`primaryKey`,value:[`event_id`]},{table:`outbound_message_execution_bindings`,kind:`foreignKey`,value:{columns:[`event_id`],target:`audit_events`,targetColumns:[`event_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`outbound_message_execution_bindings`,kind:`indexes`,value:2},{table:`outbound_message_execution_bindings`,kind:`checks`,value:3},{table:`outbound_message_progress`,kind:`table`,value:null},{table:`outbound_message_progress`,kind:`column`,value:{name:`sequence`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`outbound_message_progress`,kind:`column`,value:{name:`progress_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`outbound_message_progress`,kind:`column`,value:{name:`source_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`outbound_message_progress`,kind:`column`,value:{name:`source_sequence`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`outbound_message_progress`,kind:`column`,value:{name:`schema_version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`outbound_message_progress`,kind:`column`,value:{name:`occurred_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`outbound_message_progress`,kind:`column`,value:{name:`action`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`outbound_message_progress`,kind:`column`,value:{name:`outcome`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`outbound_message_progress`,kind:`column`,value:{name:`actor_type`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`outbound_message_progress`,kind:`column`,value:{name:`actor_id`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`outbound_message_progress`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`outbound_message_progress`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`outbound_message_progress`,kind:`column`,value:{name:`context_id`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`outbound_message_progress`,kind:`column`,value:{name:`execution_id`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`outbound_message_progress`,kind:`column`,value:{name:`channel`,type:`text`,nullable:!1,identity:!1,default:null,position:15}},{table:`outbound_message_progress`,kind:`column`,value:{name:`conversation_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:16}},{table:`outbound_message_progress`,kind:`column`,value:{name:`duration_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:17}},{table:`outbound_message_progress`,kind:`column`,value:{name:`account_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`outbound_message_progress`,kind:`column`,value:{name:`conversation_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:19}},{table:`outbound_message_progress`,kind:`column`,value:{name:`target_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`outbound_message_progress`,kind:`primaryKey`,value:[`sequence`]},{table:`outbound_message_progress`,kind:`unique`,value:[`progress_id`]},{table:`outbound_message_progress`,kind:`unique`,value:[`source_id`]},{table:`outbound_message_progress`,kind:`unique`,value:[`occurred_at`,`progress_id`]},{table:`outbound_message_progress`,kind:`indexes`,value:6},{table:`outbound_message_progress`,kind:`checks`,value:14},{table:`plugin_binding_approvals`,kind:`table`,value:null},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`plugin_root`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`channel`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`plugin_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`plugin_name`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`plugin_binding_approvals`,kind:`column`,value:{name:`approved_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`plugin_binding_approvals`,kind:`primaryKey`,value:[`plugin_root`,`channel`,`account_id`]},{table:`plugin_binding_approvals`,kind:`indexes`,value:2},{table:`plugin_binding_approvals`,kind:`checks`,value:0},{table:`plugin_blob_entries`,kind:`table`,value:null},{table:`plugin_blob_entries`,kind:`column`,value:{name:`plugin_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`namespace`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`entry_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`blob`,type:`bytea`,nullable:!1,identity:!1,default:null,position:5}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`plugin_blob_entries`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:7}},{table:`plugin_blob_entries`,kind:`primaryKey`,value:[`plugin_id`,`namespace`,`entry_key`]},{table:`plugin_blob_entries`,kind:`indexes`,value:3},{table:`plugin_blob_entries`,kind:`checks`,value:0},{table:`plugin_state_entries`,kind:`table`,value:null},{table:`plugin_state_entries`,kind:`column`,value:{name:`plugin_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`plugin_state_entries`,kind:`column`,value:{name:`namespace`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`plugin_state_entries`,kind:`column`,value:{name:`entry_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`plugin_state_entries`,kind:`column`,value:{name:`value_json`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`plugin_state_entries`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`plugin_state_entries`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:6}},{table:`plugin_state_entries`,kind:`primaryKey`,value:[`plugin_id`,`namespace`,`entry_key`]},{table:`plugin_state_entries`,kind:`indexes`,value:3},{table:`plugin_state_entries`,kind:`checks`,value:0},{table:`projects`,kind:`table`,value:null},{table:`projects`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`projects`,kind:`column`,value:{name:`display_name`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`projects`,kind:`column`,value:{name:`repo_root`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`projects`,kind:`column`,value:{name:`origin_url`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`projects`,kind:`column`,value:{name:`source`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`projects`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`projects`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`projects`,kind:`primaryKey`,value:[`id`]},{table:`projects`,kind:`indexes`,value:1},{table:`projects`,kind:`checks`,value:1},{table:`sandbox_persistent_execs`,kind:`table`,value:null},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`owner_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`source_identity`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`attempt_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`owner_json`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`backend_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`backend_target_json`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`workspace_binding_json`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`container_id`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`container_name`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`container_started_at`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`phase`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`receipt_json`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`error`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:15}},{table:`sandbox_persistent_execs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:16}},{table:`sandbox_persistent_execs`,kind:`primaryKey`,value:[`owner_key`]},{table:`sandbox_persistent_execs`,kind:`unique`,value:[`attempt_id`]},{table:`sandbox_persistent_execs`,kind:`indexes`,value:5},{table:`sandbox_persistent_execs`,kind:`checks`,value:4},{table:`sandbox_registry_entries`,kind:`table`,value:null},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`registry_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`container_name`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`backend_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`runtime_label`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`image`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:7}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`last_used_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`config_label_kind`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`config_hash`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`cdp_port`,type:`bigint`,nullable:!0,identity:!1,default:null,position:11}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`no_vnc_port`,type:`bigint`,nullable:!0,identity:!1,default:null,position:12}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`entry_json`,type:`text`,nullable:!1,identity:!1,default:null,position:13}},{table:`sandbox_registry_entries`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:14}},{table:`sandbox_registry_entries`,kind:`primaryKey`,value:[`registry_kind`,`container_name`]},{table:`sandbox_registry_entries`,kind:`indexes`,value:4},{table:`sandbox_registry_entries`,kind:`checks`,value:0},{table:`schema_meta`,kind:`table`,value:null},{table:`schema_meta`,kind:`column`,value:{name:`meta_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`schema_meta`,kind:`column`,value:{name:`role`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`schema_meta`,kind:`column`,value:{name:`schema_version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`schema_meta`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`schema_meta`,kind:`column`,value:{name:`app_version`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`schema_meta`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`schema_meta`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`schema_meta`,kind:`primaryKey`,value:[`meta_key`]},{table:`schema_meta`,kind:`indexes`,value:1},{table:`schema_meta`,kind:`checks`,value:0},{table:`secret_store_entries`,kind:`table`,value:null},{table:`secret_store_entries`,kind:`column`,value:{name:`scope_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`secret_store_entries`,kind:`column`,value:{name:`scope_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`secret_store_entries`,kind:`column`,value:{name:`name`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`secret_store_entries`,kind:`column`,value:{name:`value`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`secret_store_entries`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`secret_store_entries`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`secret_store_entries`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`secret_store_entries`,kind:`column`,value:{name:`updated_by`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`secret_store_entries`,kind:`column`,value:{name:`deleted_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`secret_store_entries`,kind:`column`,value:{name:`allowed_hosts`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`secret_store_entries`,kind:`primaryKey`,value:[`scope_kind`,`scope_id`,`name`]},{table:`secret_store_entries`,kind:`indexes`,value:2},{table:`secret_store_entries`,kind:`checks`,value:5},{table:`session_groups`,kind:`table`,value:null},{table:`session_groups`,kind:`column`,value:{name:`name`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_groups`,kind:`column`,value:{name:`position`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_groups`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_groups`,kind:`column`,value:{name:`cwd`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`session_groups`,kind:`column`,value:{name:`worktree`,type:`bigint`,nullable:!0,identity:!1,default:null,position:5}},{table:`session_groups`,kind:`primaryKey`,value:[`name`]},{table:`session_groups`,kind:`indexes`,value:1},{table:`session_groups`,kind:`checks`,value:0},{table:`session_repository_workspaces`,kind:`table`,value:null},{table:`session_repository_workspaces`,kind:`column`,value:{name:`workspace_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`url`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`requested_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`run_setup_script`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:6}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`base_commit`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`base_manifest_hash`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`branch`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`checkpoint_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`manifest_hash`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:14}},{table:`session_repository_workspaces`,kind:`column`,value:{name:`disk_authority_json`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`session_repository_workspaces`,kind:`primaryKey`,value:[`workspace_id`]},{table:`session_repository_workspaces`,kind:`unique`,value:[`agent_id`,`session_key`]},{table:`session_repository_workspaces`,kind:`indexes`,value:2},{table:`session_repository_workspaces`,kind:`checks`,value:11},{table:`session_state_events`,kind:`table`,value:null},{table:`session_state_events`,kind:`column`,value:{name:`sequence`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`session_state_events`,kind:`column`,value:{name:`dedupe_key`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`session_state_events`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_state_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`session_state_events`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_state_events`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`session_state_events`,kind:`column`,value:{name:`actor_type`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`session_state_events`,kind:`column`,value:{name:`actor_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`session_state_events`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`session_state_events`,kind:`column`,value:{name:`occurred_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`session_state_events`,kind:`column`,value:{name:`summary`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`session_state_events`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`session_state_events`,kind:`primaryKey`,value:[`sequence`]},{table:`session_state_events`,kind:`unique`,value:[`dedupe_key`]},{table:`session_state_events`,kind:`indexes`,value:4},{table:`session_state_events`,kind:`checks`,value:0},{table:`session_state_heads`,kind:`table`,value:null},{table:`session_state_heads`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_state_heads`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_state_heads`,kind:`column`,value:{name:`last_sequence`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_state_heads`,kind:`column`,value:{name:`pruned_max_sequence`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:4}},{table:`session_state_heads`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_state_heads`,kind:`primaryKey`,value:[`session_key`,`agent_id`]},{table:`session_state_heads`,kind:`indexes`,value:1},{table:`session_state_heads`,kind:`checks`,value:0},{table:`session_upstream_links`,kind:`table`,value:null},{table:`session_upstream_links`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_upstream_links`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_upstream_links`,kind:`column`,value:{name:`catalog_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_upstream_links`,kind:`column`,value:{name:`host_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_upstream_links`,kind:`column`,value:{name:`thread_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_upstream_links`,kind:`column`,value:{name:`upstream_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`session_upstream_links`,kind:`column`,value:{name:`upstream_ref_json`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`session_upstream_links`,kind:`column`,value:{name:`last_marker_json`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`session_upstream_links`,kind:`column`,value:{name:`last_scanned_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`session_upstream_links`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`session_upstream_links`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`session_upstream_links`,kind:`primaryKey`,value:[`session_key`,`agent_id`]},{table:`session_upstream_links`,kind:`indexes`,value:2},{table:`session_upstream_links`,kind:`checks`,value:0},{table:`session_watch_cursors`,kind:`table`,value:null},{table:`session_watch_cursors`,kind:`column`,value:{name:`watcher_session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_watch_cursors`,kind:`column`,value:{name:`watcher_store_path`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`session_watch_cursors`,kind:`column`,value:{name:`target_session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_watch_cursors`,kind:`column`,value:{name:`last_seen_sequence`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:4}},{table:`session_watch_cursors`,kind:`column`,value:{name:`notified_sequence`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:5}},{table:`session_watch_cursors`,kind:`column`,value:{name:`material_sequence`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:6}},{table:`session_watch_cursors`,kind:`column`,value:{name:`provenance`,type:`text`,nullable:!1,identity:!1,default:`'explicit'`,position:7}},{table:`session_watch_cursors`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`session_watch_cursors`,kind:`primaryKey`,value:[`watcher_session_key`,`target_session_key`]},{table:`session_watch_cursors`,kind:`indexes`,value:2},{table:`session_watch_cursors`,kind:`checks`,value:1},{table:`skill_library_entries`,kind:`table`,value:null},{table:`skill_library_entries`,kind:`column`,value:{name:`skill_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_library_entries`,kind:`column`,value:{name:`owner_profile_id`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`skill_library_entries`,kind:`column`,value:{name:`author_profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_library_entries`,kind:`column`,value:{name:`slug`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_library_entries`,kind:`column`,value:{name:`current_revision`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`skill_library_entries`,kind:`column`,value:{name:`shared`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`skill_library_entries`,kind:`column`,value:{name:`enabled`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`skill_library_entries`,kind:`column`,value:{name:`removed`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`skill_library_entries`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`skill_library_entries`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`skill_library_entries`,kind:`primaryKey`,value:[`skill_id`]},{table:`skill_library_entries`,kind:`indexes`,value:1},{table:`skill_library_entries`,kind:`checks`,value:0},{table:`skill_library_events`,kind:`table`,value:null},{table:`skill_library_events`,kind:`column`,value:{name:`event_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_library_events`,kind:`column`,value:{name:`skill_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`skill_library_events`,kind:`column`,value:{name:`revision`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_library_events`,kind:`column`,value:{name:`action`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_library_events`,kind:`column`,value:{name:`actor_profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`skill_library_events`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`skill_library_events`,kind:`primaryKey`,value:[`event_id`]},{table:`skill_library_events`,kind:`indexes`,value:1},{table:`skill_library_events`,kind:`checks`,value:0},{table:`skill_library_revisions`,kind:`table`,value:null},{table:`skill_library_revisions`,kind:`column`,value:{name:`skill_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_library_revisions`,kind:`column`,value:{name:`revision`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`skill_library_revisions`,kind:`column`,value:{name:`description`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_library_revisions`,kind:`column`,value:{name:`files_json`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_library_revisions`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`skill_library_revisions`,kind:`primaryKey`,value:[`skill_id`,`revision`]},{table:`skill_library_revisions`,kind:`indexes`,value:1},{table:`skill_library_revisions`,kind:`checks`,value:0},{table:`skill_library_uploads`,kind:`table`,value:null},{table:`skill_library_uploads`,kind:`column`,value:{name:`upload_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_library_uploads`,kind:`column`,value:{name:`owner_profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`skill_library_uploads`,kind:`column`,value:{name:`slug`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_library_uploads`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_library_uploads`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`skill_library_uploads`,kind:`column`,value:{name:`archive_blob`,type:`bytea`,nullable:!1,identity:!1,default:null,position:6}},{table:`skill_library_uploads`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`skill_library_uploads`,kind:`column`,value:{name:`published_skill_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`skill_library_uploads`,kind:`primaryKey`,value:[`upload_id`]},{table:`skill_library_uploads`,kind:`indexes`,value:1},{table:`skill_library_uploads`,kind:`checks`,value:0},{table:`skill_upload_chunks`,kind:`table`,value:null},{table:`skill_upload_chunks`,kind:`column`,value:{name:`upload_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_upload_chunks`,kind:`column`,value:{name:`byte_offset`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`skill_upload_chunks`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_upload_chunks`,kind:`column`,value:{name:`chunk_blob`,type:`bytea`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_upload_chunks`,kind:`primaryKey`,value:[`upload_id`,`byte_offset`]},{table:`skill_upload_chunks`,kind:`foreignKey`,value:{columns:[`upload_id`],target:`skill_uploads`,targetColumns:[`upload_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`skill_upload_chunks`,kind:`indexes`,value:1},{table:`skill_upload_chunks`,kind:`checks`,value:3},{table:`skill_uploads`,kind:`table`,value:null},{table:`skill_uploads`,kind:`column`,value:{name:`upload_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_uploads`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`skill_uploads`,kind:`column`,value:{name:`slug`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_uploads`,kind:`column`,value:{name:`force`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_uploads`,kind:`column`,value:{name:`size_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`skill_uploads`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`skill_uploads`,kind:`column`,value:{name:`actual_sha256`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`skill_uploads`,kind:`column`,value:{name:`received_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`skill_uploads`,kind:`column`,value:{name:`archive_blob`,type:`bytea`,nullable:!1,identity:!1,default:null,position:9}},{table:`skill_uploads`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`skill_uploads`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`skill_uploads`,kind:`column`,value:{name:`committed`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`skill_uploads`,kind:`column`,value:{name:`committed_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`skill_uploads`,kind:`column`,value:{name:`idempotency_key_hash`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`skill_uploads`,kind:`primaryKey`,value:[`upload_id`]},{table:`skill_uploads`,kind:`unique`,value:[`idempotency_key_hash`]},{table:`skill_uploads`,kind:`indexes`,value:4},{table:`skill_uploads`,kind:`checks`,value:0},{table:`skill_usage`,kind:`table`,value:null},{table:`skill_usage`,kind:`column`,value:{name:`skill_file`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_usage`,kind:`column`,value:{name:`skill_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`skill_usage`,kind:`column`,value:{name:`skill_name`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_usage`,kind:`column`,value:{name:`skill_source`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_usage`,kind:`column`,value:{name:`first_used_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`skill_usage`,kind:`column`,value:{name:`last_used_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`skill_usage`,kind:`column`,value:{name:`use_count`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`skill_usage`,kind:`column`,value:{name:`last_agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`skill_usage`,kind:`primaryKey`,value:[`skill_file`]},{table:`skill_usage`,kind:`indexes`,value:1},{table:`skill_usage`,kind:`checks`,value:0},{table:`skill_workshop_changes`,kind:`table`,value:null},{table:`skill_workshop_changes`,kind:`column`,value:{name:`cursor_id`,type:`bigint`,nullable:!1,identity:!1,default:null,position:1}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`change_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`skill_name`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`action`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`actor`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`summary`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`version_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`skill_workshop_changes`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`skill_workshop_changes`,kind:`primaryKey`,value:[`change_id`]},{table:`skill_workshop_changes`,kind:`indexes`,value:3},{table:`skill_workshop_changes`,kind:`checks`,value:2},{table:`state_leases`,kind:`table`,value:null},{table:`state_leases`,kind:`column`,value:{name:`scope`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`state_leases`,kind:`column`,value:{name:`lease_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`state_leases`,kind:`column`,value:{name:`owner`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`state_leases`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:4}},{table:`state_leases`,kind:`column`,value:{name:`heartbeat_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:5}},{table:`state_leases`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`state_leases`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`state_leases`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`state_leases`,kind:`primaryKey`,value:[`scope`,`lease_key`]},{table:`state_leases`,kind:`indexes`,value:3},{table:`state_leases`,kind:`checks`,value:0},{table:`subagent_runs`,kind:`table`,value:null},{table:`subagent_runs`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`subagent_runs`,kind:`column`,value:{name:`child_session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`subagent_runs`,kind:`column`,value:{name:`controller_session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`subagent_runs`,kind:`column`,value:{name:`controller_store_path`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`subagent_runs`,kind:`column`,value:{name:`requester_session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`subagent_runs`,kind:`column`,value:{name:`requester_store_path`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`subagent_runs`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`subagent_runs`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:!1,identity:!1,default:`'{}'`,position:8}},{table:`subagent_runs`,kind:`primaryKey`,value:[`run_id`]},{table:`subagent_runs`,kind:`indexes`,value:4},{table:`subagent_runs`,kind:`checks`,value:0},{table:`task_delivery_state`,kind:`table`,value:null},{table:`task_delivery_state`,kind:`column`,value:{name:`task_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`task_delivery_state`,kind:`column`,value:{name:`requester_origin_json`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`task_delivery_state`,kind:`column`,value:{name:`last_notified_event_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`task_delivery_state`,kind:`primaryKey`,value:[`task_id`]},{table:`task_delivery_state`,kind:`foreignKey`,value:{columns:[`task_id`],target:`task_runs`,targetColumns:[`task_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`task_delivery_state`,kind:`indexes`,value:1},{table:`task_delivery_state`,kind:`checks`,value:0},{table:`task_runs`,kind:`table`,value:null},{table:`task_runs`,kind:`column`,value:{name:`task_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`task_runs`,kind:`column`,value:{name:`runtime`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`task_runs`,kind:`column`,value:{name:`task_kind`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`task_runs`,kind:`column`,value:{name:`source_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`task_runs`,kind:`column`,value:{name:`requester_session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`task_runs`,kind:`column`,value:{name:`owner_key`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`task_runs`,kind:`column`,value:{name:`scope_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`task_runs`,kind:`column`,value:{name:`child_session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`task_runs`,kind:`column`,value:{name:`parent_flow_id`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`task_runs`,kind:`column`,value:{name:`parent_task_id`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`task_runs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`task_runs`,kind:`column`,value:{name:`requester_agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`task_runs`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`task_runs`,kind:`column`,value:{name:`execution_owner_host`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`task_runs`,kind:`column`,value:{name:`execution_owner_pid`,type:`bigint`,nullable:!0,identity:!1,default:null,position:15}},{table:`task_runs`,kind:`column`,value:{name:`execution_owner_start_identity`,type:`bigint`,nullable:!0,identity:!1,default:null,position:16}},{table:`task_runs`,kind:`column`,value:{name:`label`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`task_runs`,kind:`column`,value:{name:`task`,type:`text`,nullable:!1,identity:!1,default:null,position:18}},{table:`task_runs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:19}},{table:`task_runs`,kind:`column`,value:{name:`delivery_status`,type:`text`,nullable:!1,identity:!1,default:null,position:20}},{table:`task_runs`,kind:`column`,value:{name:`notify_policy`,type:`text`,nullable:!1,identity:!1,default:null,position:21}},{table:`task_runs`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:22}},{table:`task_runs`,kind:`column`,value:{name:`started_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:23}},{table:`task_runs`,kind:`column`,value:{name:`ended_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:24}},{table:`task_runs`,kind:`column`,value:{name:`last_event_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:25}},{table:`task_runs`,kind:`column`,value:{name:`cleanup_after`,type:`bigint`,nullable:!0,identity:!1,default:null,position:26}},{table:`task_runs`,kind:`column`,value:{name:`tool_use_count`,type:`bigint`,nullable:!0,identity:!1,default:null,position:27}},{table:`task_runs`,kind:`column`,value:{name:`last_tool_name`,type:`text`,nullable:!0,identity:!1,default:null,position:28}},{table:`task_runs`,kind:`column`,value:{name:`error`,type:`text`,nullable:!0,identity:!1,default:null,position:29}},{table:`task_runs`,kind:`column`,value:{name:`progress_summary`,type:`text`,nullable:!0,identity:!1,default:null,position:30}},{table:`task_runs`,kind:`column`,value:{name:`terminal_summary`,type:`text`,nullable:!0,identity:!1,default:null,position:31}},{table:`task_runs`,kind:`column`,value:{name:`terminal_outcome`,type:`text`,nullable:!0,identity:!1,default:null,position:32}},{table:`task_runs`,kind:`column`,value:{name:`detail_json`,type:`text`,nullable:!0,identity:!1,default:null,position:33}},{table:`task_runs`,kind:`primaryKey`,value:[`task_id`]},{table:`task_runs`,kind:`indexes`,value:4},{table:`task_runs`,kind:`checks`,value:0},{table:`template_cron_refs`,kind:`table`,value:null},{table:`template_cron_refs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`template_cron_refs`,kind:`column`,value:{name:`manifest_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`template_cron_refs`,kind:`column`,value:{name:`schema_version`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`template_cron_refs`,kind:`column`,value:{name:`declaration_key`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`template_cron_refs`,kind:`column`,value:{name:`scheduler_job_id`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`template_cron_refs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`template_cron_refs`,kind:`column`,value:{name:`job_json`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`template_cron_refs`,kind:`column`,value:{name:`error`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`template_cron_refs`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`template_cron_refs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`template_cron_refs`,kind:`primaryKey`,value:[`agent_id`,`manifest_id`]},{table:`template_cron_refs`,kind:`unique`,value:[`declaration_key`]},{table:`template_cron_refs`,kind:`unique`,value:[`scheduler_job_id`]},{table:`template_cron_refs`,kind:`indexes`,value:3},{table:`template_cron_refs`,kind:`checks`,value:0},{table:`template_installs`,kind:`table`,value:null},{table:`template_installs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`template_installs`,kind:`column`,value:{name:`schema_version`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`template_installs`,kind:`column`,value:{name:`source_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`template_installs`,kind:`column`,value:{name:`template_name`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`template_installs`,kind:`column`,value:{name:`template_version`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`template_installs`,kind:`column`,value:{name:`package_root`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`template_installs`,kind:`column`,value:{name:`manifest_path`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`template_installs`,kind:`column`,value:{name:`integrity_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`template_installs`,kind:`column`,value:{name:`integrity`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`template_installs`,kind:`column`,value:{name:`source_byte_length`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`template_installs`,kind:`column`,value:{name:`manifest_schema_version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`template_installs`,kind:`column`,value:{name:`plan_integrity`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`template_installs`,kind:`column`,value:{name:`workspace`,type:`text`,nullable:!1,identity:!1,default:null,position:13}},{table:`template_installs`,kind:`column`,value:{name:`agent_config_digest`,type:`text`,nullable:!1,identity:!1,default:null,position:14}},{table:`template_installs`,kind:`column`,value:{name:`agent_owned_paths_json`,type:`text`,nullable:!1,identity:!1,default:null,position:15}},{table:`template_installs`,kind:`column`,value:{name:`bootstrap_source_path`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`template_installs`,kind:`column`,value:{name:`bootstrap_content_digest`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`template_installs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:18}},{table:`template_installs`,kind:`column`,value:{name:`added_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:19}},{table:`template_installs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:20}},{table:`template_installs`,kind:`primaryKey`,value:[`agent_id`]},{table:`template_installs`,kind:`unique`,value:[`workspace`]},{table:`template_installs`,kind:`indexes`,value:2},{table:`template_installs`,kind:`checks`,value:1},{table:`template_mcp_server_refs`,kind:`table`,value:null},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`name`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`schema_version`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`config_digest`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`relationship`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`origin`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`independent_owner`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:7}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`error`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`template_mcp_server_refs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`template_mcp_server_refs`,kind:`primaryKey`,value:[`agent_id`,`name`]},{table:`template_mcp_server_refs`,kind:`indexes`,value:1},{table:`template_mcp_server_refs`,kind:`checks`,value:3},{table:`template_package_refs`,kind:`table`,value:null},{table:`template_package_refs`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`template_package_refs`,kind:`column`,value:{name:`package_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`template_package_refs`,kind:`column`,value:{name:`package_source`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`template_package_refs`,kind:`column`,value:{name:`package_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`template_package_refs`,kind:`column`,value:{name:`package_version`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`template_package_refs`,kind:`column`,value:{name:`package_integrity`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`template_package_refs`,kind:`column`,value:{name:`schema_version`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`template_package_refs`,kind:`column`,value:{name:`template_name`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`template_package_refs`,kind:`column`,value:{name:`package_status`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`template_package_refs`,kind:`column`,value:{name:`relationship`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`template_package_refs`,kind:`column`,value:{name:`origin`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`template_package_refs`,kind:`column`,value:{name:`independent_owner`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_id`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_format`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_detected_format`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_mapped_json`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_unavailable_json`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`template_package_refs`,kind:`column`,value:{name:`extension_adapter_identity`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`template_package_refs`,kind:`column`,value:{name:`installed_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:19}},{table:`template_package_refs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:20}},{table:`template_package_refs`,kind:`primaryKey`,value:[`agent_id`,`package_kind`,`package_source`,`package_ref`,`package_version`]},{table:`template_package_refs`,kind:`indexes`,value:1},{table:`template_package_refs`,kind:`checks`,value:3},{table:`template_workspace_files`,kind:`table`,value:null},{table:`template_workspace_files`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`template_workspace_files`,kind:`column`,value:{name:`target_path`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`template_workspace_files`,kind:`column`,value:{name:`schema_version`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`template_workspace_files`,kind:`column`,value:{name:`workspace`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`template_workspace_files`,kind:`column`,value:{name:`source_path`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`template_workspace_files`,kind:`column`,value:{name:`content_digest`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`template_workspace_files`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`template_workspace_files`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`template_workspace_files`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`template_workspace_files`,kind:`primaryKey`,value:[`agent_id`,`target_path`]},{table:`template_workspace_files`,kind:`indexes`,value:1},{table:`template_workspace_files`,kind:`checks`,value:0},{table:`update_runs`,kind:`table`,value:null},{table:`update_runs`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`update_runs`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`update_runs`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`update_runs`,kind:`column`,value:{name:`trigger`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`update_runs`,kind:`column`,value:{name:`phase`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`update_runs`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`update_runs`,kind:`column`,value:{name:`reason`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`update_runs`,kind:`column`,value:{name:`origin_json`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`update_runs`,kind:`column`,value:{name:`target_json`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`update_runs`,kind:`column`,value:{name:`before_json`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`update_runs`,kind:`column`,value:{name:`after_json`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`update_runs`,kind:`column`,value:{name:`steps_json`,type:`text`,nullable:!1,identity:!1,default:null,position:12}},{table:`update_runs`,kind:`column`,value:{name:`verification_json`,type:`text`,nullable:!1,identity:!1,default:null,position:13}},{table:`update_runs`,kind:`column`,value:{name:`repair_json`,type:`text`,nullable:!1,identity:!1,default:null,position:14}},{table:`update_runs`,kind:`column`,value:{name:`confirmed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:15}},{table:`update_runs`,kind:`column`,value:{name:`finished_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:16}},{table:`update_runs`,kind:`column`,value:{name:`downtime_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:17}},{table:`update_runs`,kind:`primaryKey`,value:[`run_id`]},{table:`update_runs`,kind:`indexes`,value:3},{table:`update_runs`,kind:`checks`,value:11},{table:`user_background_images`,kind:`table`,value:null},{table:`user_background_images`,kind:`column`,value:{name:`profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`user_background_images`,kind:`column`,value:{name:`asset_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`user_background_images`,kind:`column`,value:{name:`image`,type:`bytea`,nullable:!1,identity:!1,default:null,position:3}},{table:`user_background_images`,kind:`column`,value:{name:`width`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`user_background_images`,kind:`column`,value:{name:`height`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`user_background_images`,kind:`primaryKey`,value:[`profile_id`]},{table:`user_background_images`,kind:`unique`,value:[`asset_id`]},{table:`user_background_images`,kind:`foreignKey`,value:{columns:[`profile_id`],target:`user_profiles`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`user_background_images`,kind:`indexes`,value:2},{table:`user_background_images`,kind:`checks`,value:3},{table:`user_preferences`,kind:`table`,value:null},{table:`user_preferences`,kind:`column`,value:{name:`profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`user_preferences`,kind:`column`,value:{name:`pref_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`user_preferences`,kind:`column`,value:{name:`value_json`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`user_preferences`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`user_preferences`,kind:`primaryKey`,value:[`profile_id`,`pref_key`]},{table:`user_preferences`,kind:`indexes`,value:1},{table:`user_preferences`,kind:`checks`,value:0},{table:`user_profile_emails`,kind:`table`,value:null},{table:`user_profile_emails`,kind:`column`,value:{name:`email`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`user_profile_emails`,kind:`column`,value:{name:`profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`user_profile_emails`,kind:`column`,value:{name:`binding_id`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`user_profile_emails`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`user_profile_emails`,kind:`primaryKey`,value:[`email`]},{table:`user_profile_emails`,kind:`indexes`,value:2},{table:`user_profile_emails`,kind:`checks`,value:0},{table:`user_profile_identities`,kind:`table`,value:null},{table:`user_profile_identities`,kind:`column`,value:{name:`provider`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`user_profile_identities`,kind:`column`,value:{name:`subject`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`user_profile_identities`,kind:`column`,value:{name:`profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`user_profile_identities`,kind:`column`,value:{name:`canonical_login`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`user_profile_identities`,kind:`column`,value:{name:`verified_email_json`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`user_profile_identities`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`user_profile_identities`,kind:`column`,value:{name:`authorization_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`user_profile_identities`,kind:`column`,value:{name:`authorization_basis_json`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`user_profile_identities`,kind:`primaryKey`,value:[`provider`,`subject`]},{table:`user_profile_identities`,kind:`indexes`,value:3},{table:`user_profile_identities`,kind:`checks`,value:0},{table:`user_profiles`,kind:`table`,value:null},{table:`user_profiles`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`user_profiles`,kind:`column`,value:{name:`display_name`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`user_profiles`,kind:`column`,value:{name:`primary_github_account_id`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`user_profiles`,kind:`column`,value:{name:`avatar`,type:`bytea`,nullable:!0,identity:!1,default:null,position:4}},{table:`user_profiles`,kind:`column`,value:{name:`avatar_mime`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`user_profiles`,kind:`column`,value:{name:`avatar_sha256`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`user_profiles`,kind:`column`,value:{name:`merged_into`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`user_profiles`,kind:`column`,value:{name:`role`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`user_profiles`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`user_profiles`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`user_profiles`,kind:`primaryKey`,value:[`id`]},{table:`user_profiles`,kind:`indexes`,value:1},{table:`user_profiles`,kind:`checks`,value:0},{table:`web_push_approval_deliveries`,kind:`table`,value:null},{table:`web_push_approval_deliveries`,kind:`column`,value:{name:`approval_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`web_push_approval_deliveries`,kind:`column`,value:{name:`subscription_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`web_push_approval_deliveries`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`web_push_approval_deliveries`,kind:`column`,value:{name:`user_profile_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`web_push_approval_deliveries`,kind:`column`,value:{name:`prepared_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`web_push_approval_deliveries`,kind:`primaryKey`,value:[`approval_id`,`subscription_id`]},{table:`web_push_approval_deliveries`,kind:`foreignKey`,value:{columns:[`subscription_id`],target:`web_push_subscriptions`,targetColumns:[`subscription_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`web_push_approval_deliveries`,kind:`foreignKey`,value:{columns:[`approval_id`],target:`operator_approvals`,targetColumns:[`approval_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`web_push_approval_deliveries`,kind:`indexes`,value:2},{table:`web_push_approval_deliveries`,kind:`checks`,value:0},{table:`web_push_subscriptions`,kind:`table`,value:null},{table:`web_push_subscriptions`,kind:`column`,value:{name:`endpoint_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`subscription_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`endpoint`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`p256dh`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`auth`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`device_id`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`user_profile_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`preferences_json`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`web_push_subscriptions`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`web_push_subscriptions`,kind:`primaryKey`,value:[`endpoint_hash`]},{table:`web_push_subscriptions`,kind:`unique`,value:[`subscription_id`]},{table:`web_push_subscriptions`,kind:`indexes`,value:3},{table:`web_push_subscriptions`,kind:`checks`,value:0},{table:`worker_environment_credentials`,kind:`table`,value:null},{table:`worker_environment_credentials`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`credential_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`bundle_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`rpc_set_version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`expires_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_environment_credentials`,kind:`column`,value:{name:`delivered_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`worker_environment_credentials`,kind:`primaryKey`,value:[`environment_id`]},{table:`worker_environment_credentials`,kind:`unique`,value:[`credential_hash`]},{table:`worker_environment_credentials`,kind:`foreignKey`,value:{columns:[`environment_id`],target:`worker_environments`,targetColumns:[`environment_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_environment_credentials`,kind:`indexes`,value:2},{table:`worker_environment_credentials`,kind:`checks`,value:4},{table:`worker_environment_session_attachments`,kind:`table`,value:null},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`session_lifecycle_revision`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`generation`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`last_used_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`worker_environment_session_attachments`,kind:`column`,value:{name:`closed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`worker_environment_session_attachments`,kind:`primaryKey`,value:[`session_id`]},{table:`worker_environment_session_attachments`,kind:`unique`,value:[`environment_id`]},{table:`worker_environment_session_attachments`,kind:`foreignKey`,value:{columns:[`environment_id`],target:`worker_environments`,targetColumns:[`environment_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_environment_session_attachments`,kind:`indexes`,value:3},{table:`worker_environment_session_attachments`,kind:`checks`,value:1},{table:`worker_environment_ssh_fallback_ports`,kind:`table`,value:null},{table:`worker_environment_ssh_fallback_ports`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_environment_ssh_fallback_ports`,kind:`column`,value:{name:`position`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_environment_ssh_fallback_ports`,kind:`column`,value:{name:`port`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_environment_ssh_fallback_ports`,kind:`primaryKey`,value:[`environment_id`,`position`]},{table:`worker_environment_ssh_fallback_ports`,kind:`unique`,value:[`environment_id`,`port`]},{table:`worker_environment_ssh_fallback_ports`,kind:`foreignKey`,value:{columns:[`environment_id`],target:`worker_environments`,targetColumns:[`environment_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_environment_ssh_fallback_ports`,kind:`indexes`,value:2},{table:`worker_environment_ssh_fallback_ports`,kind:`checks`,value:2},{table:`worker_environments`,kind:`table`,value:null},{table:`worker_environments`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_environments`,kind:`column`,value:{name:`provider_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_environments`,kind:`column`,value:{name:`profile_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_environments`,kind:`column`,value:{name:`profile_snapshot_json`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_environments`,kind:`column`,value:{name:`last_activated_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:5}},{table:`worker_environments`,kind:`column`,value:{name:`preparation_key`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`worker_environments`,kind:`column`,value:{name:`preparation_purpose`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`worker_environments`,kind:`column`,value:{name:`preparation_demand_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`worker_environments`,kind:`column`,value:{name:`preparation_expires_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`worker_environments`,kind:`column`,value:{name:`preparation_consumed_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:10}},{table:`worker_environments`,kind:`column`,value:{name:`provision_operation_id`,type:`text`,nullable:!1,identity:!1,default:null,position:11}},{table:`worker_environments`,kind:`column`,value:{name:`lease_id`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`worker_environments`,kind:`column`,value:{name:`node_setup_id`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`worker_environments`,kind:`column`,value:{name:`node_device_id`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`worker_environments`,kind:`column`,value:{name:`ssh_host`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`worker_environments`,kind:`column`,value:{name:`ssh_port`,type:`bigint`,nullable:!0,identity:!1,default:null,position:16}},{table:`worker_environments`,kind:`column`,value:{name:`ssh_user`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`worker_environments`,kind:`column`,value:{name:`ssh_host_key`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`worker_environments`,kind:`column`,value:{name:`ssh_key_ref_json`,type:`text`,nullable:!0,identity:!1,default:null,position:19}},{table:`worker_environments`,kind:`column`,value:{name:`desktop_json`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`worker_environments`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:21}},{table:`worker_environments`,kind:`column`,value:{name:`bootstrap_bundle_hash`,type:`text`,nullable:!0,identity:!1,default:null,position:22}},{table:`worker_environments`,kind:`column`,value:{name:`bootstrap_openclaw_version`,type:`text`,nullable:!0,identity:!1,default:null,position:23}},{table:`worker_environments`,kind:`column`,value:{name:`bootstrap_protocol_features_json`,type:`text`,nullable:!0,identity:!1,default:null,position:24}},{table:`worker_environments`,kind:`column`,value:{name:`bootstrap_install_kind`,type:`text`,nullable:!0,identity:!1,default:null,position:25}},{table:`worker_environments`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:26}},{table:`worker_environments`,kind:`column`,value:{name:`teardown_terminal_state`,type:`text`,nullable:!0,identity:!1,default:null,position:27}},{table:`worker_environments`,kind:`column`,value:{name:`attached_session_ids_json`,type:`text`,nullable:!1,identity:!1,default:`'[]'`,position:28}},{table:`worker_environments`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:29}},{table:`worker_environments`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:30}},{table:`worker_environments`,kind:`column`,value:{name:`state_changed_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:31}},{table:`worker_environments`,kind:`column`,value:{name:`idle_since_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:32}},{table:`worker_environments`,kind:`column`,value:{name:`destroy_requested_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:33}},{table:`worker_environments`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:!0,identity:!1,default:null,position:34}},{table:`worker_environments`,kind:`column`,value:{name:`shared_host`,type:`bigint`,nullable:!0,identity:!1,default:null,position:35}},{table:`worker_environments`,kind:`column`,value:{name:`resource_receipt_json`,type:`text`,nullable:!0,identity:!1,default:null,position:36}},{table:`worker_environments`,kind:`column`,value:{name:`retention_json`,type:`text`,nullable:!0,identity:!1,default:null,position:37}},{table:`worker_environments`,kind:`column`,value:{name:`provision_source_json`,type:`text`,nullable:!0,identity:!1,default:null,position:38}},{table:`worker_environments`,kind:`primaryKey`,value:[`environment_id`]},{table:`worker_environments`,kind:`unique`,value:[`provision_operation_id`]},{table:`worker_environments`,kind:`indexes`,value:4},{table:`worker_environments`,kind:`checks`,value:5},{table:`worker_inference_turns`,kind:`table`,value:null},{table:`worker_inference_turns`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_inference_turns`,kind:`column`,value:{name:`run_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_inference_turns`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_inference_turns`,kind:`column`,value:{name:`turn_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_inference_turns`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_inference_turns`,kind:`column`,value:{name:`request_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_inference_turns`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_inference_turns`,kind:`column`,value:{name:`terminal_json`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`worker_inference_turns`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`worker_inference_turns`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`worker_inference_turns`,kind:`primaryKey`,value:[`session_id`,`run_epoch`,`run_id`,`turn_id`]},{table:`worker_inference_turns`,kind:`foreignKey`,value:{columns:[`environment_id`],target:`worker_environments`,targetColumns:[`environment_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_inference_turns`,kind:`indexes`,value:2},{table:`worker_inference_turns`,kind:`checks`,value:5},{table:`worker_session_placement_moves`,kind:`table`,value:null},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`operation_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`source_generation`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`source_environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`source_owner_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`target_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`target_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`target_machine_class`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`target_os`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`abandon_source`,type:`bigint`,nullable:!0,identity:!1,default:null,position:10}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`worker_session_placement_moves`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`worker_session_placement_moves`,kind:`primaryKey`,value:[`operation_id`]},{table:`worker_session_placement_moves`,kind:`unique`,value:[`session_id`]},{table:`worker_session_placement_moves`,kind:`foreignKey`,value:{columns:[`session_id`],target:`worker_session_placements`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_session_placement_moves`,kind:`indexes`,value:2},{table:`worker_session_placement_moves`,kind:`checks`,value:5},{table:`worker_session_placements`,kind:`table`,value:null},{table:`worker_session_placements`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_session_placements`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_session_placements`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_session_placements`,kind:`column`,value:{name:`execution_mode`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`worker_session_placements`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_session_placements`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`worker_session_placements`,kind:`column`,value:{name:`transition_generation`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:7}},{table:`worker_session_placements`,kind:`column`,value:{name:`active_owner_epoch`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`worker_session_placements`,kind:`column`,value:{name:`workspace_base_manifest_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`worker_session_placements`,kind:`column`,value:{name:`remote_workspace_dir`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`worker_session_placements`,kind:`column`,value:{name:`worker_bundle_hash`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`worker_session_placements`,kind:`column`,value:{name:`last_transcript_ack_cursor`,type:`bigint`,nullable:!0,identity:!1,default:null,position:12}},{table:`worker_session_placements`,kind:`column`,value:{name:`last_live_event_ack_cursor`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`worker_session_placements`,kind:`column`,value:{name:`recovery_error`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`worker_session_placements`,kind:`column`,value:{name:`turn_claim_owner`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`worker_session_placements`,kind:`column`,value:{name:`turn_claim_id`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`worker_session_placements`,kind:`column`,value:{name:`turn_claim_run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`worker_session_placements`,kind:`column`,value:{name:`turn_claim_generation`,type:`bigint`,nullable:!0,identity:!1,default:null,position:18}},{table:`worker_session_placements`,kind:`column`,value:{name:`turn_claim_owner_epoch`,type:`bigint`,nullable:!0,identity:!1,default:null,position:19}},{table:`worker_session_placements`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:20}},{table:`worker_session_placements`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:21}},{table:`worker_session_placements`,kind:`column`,value:{name:`state_changed_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:22}},{table:`worker_session_placements`,kind:`column`,value:{name:`terminal_reason`,type:`text`,nullable:!0,identity:!1,default:null,position:23}},{table:`worker_session_placements`,kind:`column`,value:{name:`terminal_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:24}},{table:`worker_session_placements`,kind:`primaryKey`,value:[`session_id`]},{table:`worker_session_placements`,kind:`indexes`,value:4},{table:`worker_session_placements`,kind:`checks`,value:12},{table:`worker_session_tool_operations`,kind:`table`,value:null},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`source_session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`source_claim_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`tool_call_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`tool_name`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`request_digest`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`operation_seed`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`child_session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`result_json`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`gateway_instance_id`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`worker_session_tool_operations`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`worker_session_tool_operations`,kind:`primaryKey`,value:[`source_session_id`,`source_claim_id`,`tool_call_id`]},{table:`worker_session_tool_operations`,kind:`foreignKey`,value:{columns:[`source_session_id`],target:`worker_session_placements`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_session_tool_operations`,kind:`indexes`,value:1},{table:`worker_session_tool_operations`,kind:`checks`,value:2},{table:`worker_transcript_commit_heads`,kind:`table`,value:null},{table:`worker_transcript_commit_heads`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_transcript_commit_heads`,kind:`column`,value:{name:`run_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_transcript_commit_heads`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_transcript_commit_heads`,kind:`column`,value:{name:`next_seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_transcript_commit_heads`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_transcript_commit_heads`,kind:`primaryKey`,value:[`session_id`,`run_epoch`]},{table:`worker_transcript_commit_heads`,kind:`indexes`,value:1},{table:`worker_transcript_commit_heads`,kind:`checks`,value:3},{table:`worker_transcript_commits`,kind:`table`,value:null},{table:`worker_transcript_commits`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`run_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`request_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`result_json`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_transcript_commits`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`worker_transcript_commits`,kind:`primaryKey`,value:[`session_id`,`run_epoch`,`seq`]},{table:`worker_transcript_commits`,kind:`foreignKey`,value:{columns:[`session_id`,`run_epoch`],target:`worker_transcript_commit_heads`,targetColumns:[`session_id`,`run_epoch`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_transcript_commits`,kind:`indexes`,value:1},{table:`worker_transcript_commits`,kind:`checks`,value:6},{table:`worker_turn_tool_authorities`,kind:`table`,value:null},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`claim_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`tool_names_json`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_turn_tool_authorities`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`worker_turn_tool_authorities`,kind:`primaryKey`,value:[`session_id`]},{table:`worker_turn_tool_authorities`,kind:`foreignKey`,value:{columns:[`session_id`],target:`worker_session_placements`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_turn_tool_authorities`,kind:`indexes`,value:1},{table:`worker_turn_tool_authorities`,kind:`checks`,value:2},{table:`worker_workspace_pending_results`,kind:`table`,value:null},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`claim_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`gateway_instance_id`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`recovery_requested_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`workspace_accepted_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`staged_result_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`repository_workspace_id`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`worker_workspace_pending_results`,kind:`column`,value:{name:`repository_disk_authority_json`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`worker_workspace_pending_results`,kind:`primaryKey`,value:[`session_id`]},{table:`worker_workspace_pending_results`,kind:`foreignKey`,value:{columns:[`session_id`],target:`worker_session_placements`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_workspace_pending_results`,kind:`indexes`,value:1},{table:`worker_workspace_pending_results`,kind:`checks`,value:2},{table:`worker_workspace_reconciliations`,kind:`table`,value:null},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`environment_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`owner_epoch`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`placement_generation`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`base_manifest_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`current_manifest_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`plan_json`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`base_pack`,type:`bytea`,nullable:!1,identity:!1,default:null,position:8}},{table:`worker_workspace_reconciliations`,kind:`column`,value:{name:`created_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`worker_workspace_reconciliations`,kind:`primaryKey`,value:[`session_id`]},{table:`worker_workspace_reconciliations`,kind:`foreignKey`,value:{columns:[`session_id`],target:`worker_session_placements`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`worker_workspace_reconciliations`,kind:`indexes`,value:1},{table:`worker_workspace_reconciliations`,kind:`checks`,value:3},{table:`workspace_generated_bootstrap_hashes`,kind:`table`,value:null},{table:`workspace_generated_bootstrap_hashes`,kind:`column`,value:{name:`workspace_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`workspace_generated_bootstrap_hashes`,kind:`column`,value:{name:`filename`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`workspace_generated_bootstrap_hashes`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`workspace_generated_bootstrap_hashes`,kind:`primaryKey`,value:[`workspace_key`,`filename`]},{table:`workspace_generated_bootstrap_hashes`,kind:`foreignKey`,value:{columns:[`workspace_key`],target:`workspace_setup_state`,targetColumns:[`workspace_key`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`workspace_generated_bootstrap_hashes`,kind:`indexes`,value:1},{table:`workspace_generated_bootstrap_hashes`,kind:`checks`,value:0},{table:`workspace_path_aliases`,kind:`table`,value:null},{table:`workspace_path_aliases`,kind:`column`,value:{name:`alias_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`workspace_path_aliases`,kind:`column`,value:{name:`alias_path`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`workspace_path_aliases`,kind:`column`,value:{name:`workspace_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`workspace_path_aliases`,kind:`column`,value:{name:`workspace_path`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`workspace_path_aliases`,kind:`column`,value:{name:`updated_at_ms`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`workspace_path_aliases`,kind:`primaryKey`,value:[`alias_key`]},{table:`workspace_path_aliases`,kind:`indexes`,value:2},{table:`workspace_path_aliases`,kind:`checks`,value:0},{table:`workspace_setup_state`,kind:`table`,value:null},{table:`workspace_setup_state`,kind:`column`,value:{name:`workspace_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`workspace_setup_state`,kind:`column`,value:{name:`workspace_path`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`workspace_setup_state`,kind:`column`,value:{name:`version`,type:`bigint`,nullable:!0,identity:!1,default:null,position:3}},{table:`workspace_setup_state`,kind:`column`,value:{name:`bootstrap_seeded_at`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`workspace_setup_state`,kind:`column`,value:{name:`setup_completed_at`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`workspace_setup_state`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:6}},{table:`workspace_setup_state`,kind:`column`,value:{name:`attested_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:7}},{table:`workspace_setup_state`,kind:`column`,value:{name:`attestation_updated_at_ms`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`workspace_setup_state`,kind:`column`,value:{name:`bootstrap_deferred`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`workspace_setup_state`,kind:`primaryKey`,value:[`workspace_key`]},{table:`workspace_setup_state`,kind:`indexes`,value:2},{table:`workspace_setup_state`,kind:`checks`,value:1},{table:`worktree_provisioned_file_chunks`,kind:`table`,value:null},{table:`worktree_provisioned_file_chunks`,kind:`column`,value:{name:`worktree_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worktree_provisioned_file_chunks`,kind:`column`,value:{name:`path`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worktree_provisioned_file_chunks`,kind:`column`,value:{name:`chunk_index`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`worktree_provisioned_file_chunks`,kind:`column`,value:{name:`data`,type:`bytea`,nullable:!1,identity:!1,default:null,position:4}},{table:`worktree_provisioned_file_chunks`,kind:`primaryKey`,value:[`worktree_id`,`path`,`chunk_index`]},{table:`worktree_provisioned_file_chunks`,kind:`indexes`,value:1},{table:`worktree_provisioned_file_chunks`,kind:`checks`,value:1},{table:`worktree_templates`,kind:`table`,value:null},{table:`worktree_templates`,kind:`column`,value:{name:`cache_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worktree_templates`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worktree_templates`,kind:`column`,value:{name:`repo_root`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worktree_templates`,kind:`column`,value:{name:`common_dir`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`worktree_templates`,kind:`column`,value:{name:`worktree_root`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worktree_templates`,kind:`column`,value:{name:`path`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worktree_templates`,kind:`column`,value:{name:`backend`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`worktree_templates`,kind:`column`,value:{name:`source_commit`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`worktree_templates`,kind:`column`,value:{name:`content_key`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`worktree_templates`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`worktree_templates`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`worktree_templates`,kind:`column`,value:{name:`last_used_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`worktree_templates`,kind:`primaryKey`,value:[`cache_key`]},{table:`worktree_templates`,kind:`unique`,value:[`id`]},{table:`worktree_templates`,kind:`indexes`,value:2},{table:`worktree_templates`,kind:`checks`,value:1},{table:`worktrees`,kind:`table`,value:null},{table:`worktrees`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`worktrees`,kind:`column`,value:{name:`repo_fingerprint`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`worktrees`,kind:`column`,value:{name:`repo_root`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`worktrees`,kind:`column`,value:{name:`path`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`worktrees`,kind:`column`,value:{name:`branch`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`worktrees`,kind:`column`,value:{name:`base_ref`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`worktrees`,kind:`column`,value:{name:`owner_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`worktrees`,kind:`column`,value:{name:`owner_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`worktrees`,kind:`column`,value:{name:`snapshot_ref`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`worktrees`,kind:`column`,value:{name:`provisioned_paths_json`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`worktrees`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`worktrees`,kind:`column`,value:{name:`last_active_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`worktrees`,kind:`column`,value:{name:`removed_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`worktrees`,kind:`column`,value:{name:`run_end_cleanup_json`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`worktrees`,kind:`column`,value:{name:`gc_protection_json`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`worktrees`,kind:`primaryKey`,value:[`id`]},{table:`worktrees`,kind:`indexes`,value:3},{table:`worktrees`,kind:`checks`,value:1}];return Object.defineProperty(this,"expectedCatalog",{value:e,enumerable:!0,configurable:!0,writable:!0}),e}}}));function isStatePostgres(){return stateEngineInput()!==void 0}function assertStateFileSnapshotAllowed(){stateEngineInput()&&oe(`postgres`,`file-snapshot`)}function inspectStateSqlite(e){let t=de(e)??C(e);return{hasEngineAnchor:t.tables.has(`openclaw_engine_anchor`),hasExistingData:[...t.tables,...t.views,...t.triggers.keys()].some(e=>e!==`openclaw_engine_anchor`&&!e.startsWith(`sqlite_`))}}function admitStatePostgres(e,t){if(!t&&ve(e)?.startupReady)return;let n=withPostgresSchemaAdmissionRetry(e,()=>{let t=x(e);if(!t)throw new F(`Missing PostgreSQL state admission. ${Q}`);return t}),r=new Set(n.catalog.filter(e=>e.kind===`table`).map(e=>e.table)),i=new Set(Z.fragments.flatMap(e=>e.tables.some(e=>r.has(e))?[]:e.tables));if(n.version===40&&le(n.catalog.filter(e=>!e.kind.endsWith(`Definition`)&&e.table!==`openclaw_schema_meta`),Z.expectedCatalog.filter(e=>!i.has(e.table))),t){let t=Date.now();e.prepare(`INSERT INTO schema_meta
        (meta_key, role, schema_version, agent_id, app_version, created_at, updated_at)
        VALUES ('primary', 'global', ?, NULL, ?, ?, ?)`).run(40,d,t,t),writeStateSchemaContentVersion(e)}let a=e.prepare(`SELECT schema_version, role, agent_id FROM schema_meta WHERE meta_key = 'primary'`).get(),o=e.prepare(`SELECT value_json FROM config_machine_state WHERE state_key = 'state.schema.contentVersion'`).get(),s;try{let e=o?.value_json;if(e!=null&&typeof e!=`string`)throw Error(`Invalid PostgreSQL state content marker`);s=Fe(e)}catch{throw Error(`PostgreSQL state metadata mismatch. ${Q}`)}if(a?.schema_version!==n.version||a.role!==`global`||a.agent_id!==null||s>n.version)throw Error(`PostgreSQL state metadata mismatch. ${Q}`);_e(e,{userVersion:n.version,contentVersion:n.version}),ye(e,!0)}function statePostgresVersionSql(e){return`UPDATE schema_meta
        SET schema_version = ${e},
          app_version = '${d.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';
        INSERT INTO config_machine_state (state_key, value_json, updated_at_ms)
        VALUES ('state.schema.contentVersion', '${e}',
          CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint))
        ON CONFLICT (state_key) DO UPDATE
          SET value_json = EXCLUDED.value_json, updated_at_ms = EXCLUDED.updated_at_ms;`}function createStatePostgresMigrations(){let e={postgres:$.postgres,postgresFragments:$.postgresFragments},t=withLegacyWorkerProvisionSource(e.postgres),n=withLegacyWorkspaceBootstrapDeferred(t),r={...e,postgres:t,postgresWithoutOptionalColumn:{table:`workspace_setup_state`,column:`bootstrap_deferred`,sql:n}},i={...e,postgres:withLegacyWorkerRetention(n)},a={postgres:withLegacyRepositoryDiskAuthority(i.postgres),postgresFragments:i.postgresFragments.map(e=>({...e,sql:withLegacyRepositoryDiskAuthority(e.sql)}))},o={postgres:withLegacyWorkerResourceReceipts(a.postgres),postgresFragments:a.postgresFragments},s={postgres:N(o.postgres),postgresFragments:o.postgresFragments.map(e=>({...e,tables:e.tables.map(je),sql:N(e.sql)}))},c={postgres:withLegacyLocalWorkspaceCas(s.postgres),postgresFragments:s.postgresFragments.map(e=>({...e,tables:e.tables.filter(e=>!R.some(t=>t===e)),sql:withLegacyLocalWorkspaceCas(e.sql)}))},l={postgres:j(c.postgres,`schema-nullability`),postgresFragments:c.postgresFragments.map(e=>({...e,sql:j(e.sql,`schema-nullability`)}))},u={postgres:j(l.postgres),postgresFragments:l.postgresFragments.map(e=>({...e,sql:j(e.sql)}))},d={postgres:withLegacyLocalWorkspaceManifests(u.postgres),postgresFragments:u.postgresFragments.map(e=>({...e,tables:e.tables.filter(e=>e!==`local_workspace_manifest_nodes`),sql:withLegacyLocalWorkspaceManifests(e.sql)}))},f={...d,postgres:`${d.postgres}\n${Z.clientCredentialSource.sql}`},p={postgres:M(f.postgres),postgresFragments:f.postgresFragments.map(e=>({...e,sql:M(e.sql)}))},m={...p,postgres:p.postgres.replace(/CREATE INDEX "idx_state_leases_owner"[^;]*;/u,Z.preWriteIndexesV27Sql.state_leases)+Z.preWriteIndexesV27Sql.skill_usage+Z.preWriteIndexesV27Sql.acp_replay_events,postgresFragments:p.postgresFragments};return[{version:25,sql:Z.operatorRecoveryV25Sql,fromSchema:m,schema:m},{version:26,fromSchema:m,schema:m,sql:statePostgresVersionSql(26)},{version:27,fromSchema:m,schema:p,sql:`${Z.writeIndexesV27Sql}
        ${statePostgresVersionSql(27)}`},{version:28,fromSchema:p,schema:f,sql:`ALTER TABLE IF EXISTS github_publication_requests ADD COLUMN draft bigint;
        ALTER TABLE IF EXISTS github_personal_publication_requests ADD COLUMN draft bigint;
        ALTER TABLE IF EXISTS github_repository_publication_requests ADD COLUMN draft bigint;
        ${statePostgresVersionSql(28)}`},{version:29,fromSchema:f,schema:d,sql:Z.clientCredentialV29Sql},{version:30,fromSchema:d,schema:d,sql:statePostgresVersionSql(30)},{version:31,fromSchema:d,schema:u,sql:`DO $workspace$
        DECLARE baseline_constraint text;
        BEGIN
          IF to_regclass('local_workspace_projections') IS NOT NULL THEN
            SELECT conname INTO STRICT baseline_constraint FROM pg_constraint
              WHERE conrelid = 'local_workspace_projections'::regclass AND contype = 'c'
                AND pg_get_constraintdef(oid) LIKE '%baseline_json%baseline_ref%';
            EXECUTE format('ALTER TABLE local_workspace_projections DROP CONSTRAINT %I', baseline_constraint);
            ALTER TABLE local_workspace_projections
              ADD COLUMN checkpoint_json text COLLATE "C",
              ADD CHECK (baseline_json IS NULL OR baseline_ref IS NOT NULL);
            CREATE TABLE local_workspace_manifest_nodes (
              worktree_id text COLLATE "C" NOT NULL,
              path text COLLATE "C" NOT NULL,
              node_json text COLLATE "C" NOT NULL,
              PRIMARY KEY (worktree_id, path),
              FOREIGN KEY (worktree_id) REFERENCES local_workspace_projections(worktree_id)
                ON DELETE CASCADE
            );
          END IF;
        END $workspace$;
        ${statePostgresVersionSql(31)}`},{version:32,fromSchema:u,schema:l,sql:`${A([l.postgres,...l.postgresFragments.map(e=>e.sql)].join(`
`))}
        ${statePostgresVersionSql(32)}`},{version:33,fromSchema:l,schema:c,sql:`${A([c.postgres,...c.postgresFragments.map(e=>e.sql)].join(`
`),`schema-nullability`)}
        ${statePostgresVersionSql(33)}`},{version:34,fromSchema:c,schema:c,sql:statePostgresVersionSql(34)},{version:35,fromSchema:c,schema:s,sql:`${Z.workspaceCasV35Sql}\n${statePostgresVersionSql(35)}`},{version:36,fromSchema:s,schema:o,sql:`${Pe}\n${statePostgresVersionSql(36)}`},{version:37,fromSchema:o,schema:a,sql:`ALTER TABLE worker_environments ADD COLUMN resource_receipt_json text COLLATE "C";
        ${statePostgresVersionSql(37)}`},{version:38,fromSchema:a,schema:i,sql:`ALTER TABLE IF EXISTS session_repository_workspaces ADD COLUMN disk_authority_json text COLLATE "C";
        ALTER TABLE worker_workspace_pending_results ADD COLUMN repository_disk_authority_json text COLLATE "C";
        ${statePostgresVersionSql(38)}`},{version:39,fromSchema:i,schema:r,sql:`ALTER TABLE worker_environments ADD COLUMN retention_json text COLLATE "C";
        ${statePostgresVersionSql(39)}`},{version:40,fromSchema:r,schema:e,sql:`ALTER TABLE workspace_setup_state ADD COLUMN IF NOT EXISTS bootstrap_deferred bigint;
        ALTER TABLE worker_environments ADD COLUMN provision_source_json text COLLATE "C";
        UPDATE worker_environments
        SET provision_source_json = '{"kind":"unavailable"}'
        WHERE (state IN ('requested', 'provisioning') AND lease_id IS NULL
          OR state = 'bootstrapping' AND owner_epoch = 0)
          AND provision_source_json IS NULL;
        ${statePostgresVersionSql(40)}`}]}function ensureStatePostgresFragment(e,t){let n=x(e);if(!n)throw new F(`Missing PostgreSQL state admission. ${Q}`);let r=Z.fragments.find(e=>e.tables.includes(t));if(!r){if(Z.expectedCatalog.some(e=>e.kind===`table`&&e.table===t)&&n.catalog.some(e=>e.kind===`table`&&e.table===t))return;throw Error(`No PostgreSQL state fragment owns ${t}`)}if(r.tables.filter(e=>n.version>=35||!R.some(t=>t===e)).every(e=>n.catalog.some(t=>t.kind===`table`&&t.table===e)))return;for(let t of r.dependencies){let n=Z.fragments.find(e=>e.id===t);if(!n)throw Error(`Unknown state fragment dependency ${t}`);ensureStatePostgresFragment(e,n.tables[0])}if(!c(e,{commit:()=>p(e),invalidate:()=>p(e)}))throw Error(`PostgreSQL state fragments require the owner's transaction`);ee(e);let i=n.version<38?withLegacyRepositoryDiskAuthority(r.sql):r.sql,a=n.version<36?N(i):i,o=n.version<35?withLegacyLocalWorkspaceCas(a):a;e.exec(n.version<33?j(o,n.version<32?`sqlite`:`schema-nullability`):o),se({db:e,namespace:n.namespace,storeId:n.storeId,store:n.store,version:n.version,schema:$,recordSchema:!0}),admitStatePostgres(e,!1)}function openExistingStatePostgresConnection(e,t){if(stateEngineInput())return openExistingStatePostgresConnectionFromAnchor(Ee(e,{existingOnly:!0,expectedIdentity:t}),e)}function openExistingStatePostgresConnectionFromAnchor(e,t){let n;try{let r=stateEngineInput();if(!r)throw Error(`PostgreSQL state inspection requires the configured state connection.`);Ie(e,t);let a=Oe({anchor:e,schema:$,input:r,inspectSqlite:()=>inspectStateSqlite(e),prepareAnchor:()=>{},openSqlite:()=>{},existingOnly:!0,reusePostgresConnection:!0,existingVersion:!0,admitPostgres:admitStatePostgres,closeOnFailure:(e,t)=>{throw n=e,t}});if(!s(a))throw Error(`Expected PostgreSQL state connection`);return n=a,{database:{db:n,path:t},close(){return i(k.closeUnpublishedOpenClawStateDatabaseHandle({db:a,path:t}),`PostgreSQL state connection cleanup failed.`),!a.isOpen&&!e.isOpen}}}catch(i){let a=k.closeUnpublishedOpenClawStateDatabaseHandle({db:n??e,path:t});throw a.length?r([i,...a],`PostgreSQL state connection acquisition and cleanup failed.`,i):i}}var Q,$,Ze=e((()=>{ke(),S(),ue(),Ae(),o(),ne(),a(),l(),fe(),w(),u(),ge(),Te(),O(),Re(),De(),Ne(),q(),V(),Me(),J(),He(),We(),Ge(),Ke(),P(),qe(),Ye(),Xe(),Q=`Use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.`,$={id:`state`,version:40,sqlite:``,get postgres(){let e=Z.eagerSql;return Object.defineProperty(this,"postgres",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get postgresFragments(){let e=Z.fragments.map(e=>{let{activation:t}=e;if(t!==`first-use`&&t!==`version-additive`)throw Error(`Unknown PostgreSQL state fragment activation: ${t}`);return{id:e.id,tables:e.tables,sql:e.sql,dependencies:e.dependencies,activation:t}});return Object.defineProperty(this,"postgresFragments",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get postgresMigrations(){let e=createStatePostgresMigrations();return Object.defineProperty(this,"postgresMigrations",{value:e,enumerable:!0,configurable:!0,writable:!0}),e}}}));export{Ve as A,B,Ge as C,Ue as D,We as E,K as F,Re as H,withLegacyLocalWorkspaceManifests as I,z as L,J as M,withLegacyWorkerResourceReceipts as N,withLegacyWorkerRetention as O,q as P,R,withLegacyWorkerProvisionSource as S,withLegacyWorkspaceBootstrapDeferred as T,stateEngineInput as U,withLegacyLocalWorkspaceCas as V,writeStateSchemaContentVersion as _,inspectStateSqlite as a,Ke as b,openExistingStatePostgresConnectionFromAnchor as c,Z as d,advanceStateSchemaContentVersion as f,resolveStateSchemaVersionToPublish as g,readStateSchemaPublicationBlocker as h,Ze as i,withLegacyRepositoryDiskAuthority as j,He as k,$ as l,isUnfencedUpdateDriver as m,assertStateFileSnapshotAllowed as n,isStatePostgres as o,Ye as p,ensureStatePostgresFragment as r,openExistingStatePostgresConnection as s,admitStatePostgres as t,Xe as u,qe as v,withLegacyStateV40Additions as w,Y as x,withPostgresSchemaAdmissionRetry as y,V as z};