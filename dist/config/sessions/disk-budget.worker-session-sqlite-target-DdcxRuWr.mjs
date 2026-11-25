import{t as e}from"./disk-budget.worker-rolldown-runtime-C5ba_Z9N.mjs";import{p as t}from"./disk-budget.worker-paths-C-af-IJ6.mjs";import{T as n}from"./disk-budget.worker-sqlite-readonly-worker-N1ngnCCb.mjs";import{A as r}from"./disk-budget.worker-worker-cpu-CQgzgDK0.mjs";import{ft as i,gt as a}from"./disk-budget.worker-sqlite-lifecycle-errors-DgHWI3Bo.mjs";import{l as o,n as s,r as c}from"./disk-budget.worker-openclaw-agent-db.paths-CfdE1h6K.mjs";import{r as l}from"./disk-budget.worker-path-existence-Bfb6_HiY.mjs";import{Q as u,dt as d,tt as f}from"./disk-budget.worker-openclaw-state-db-cache-CiTHAOWf.mjs";import{i as p,n as m,r as h,t as g,z as _}from"./disk-budget.worker.js";import{X as v}from"./disk-budget.worker-sqlite-worker-operation-settlement-lj_3_x8C.mjs";import{B as y,G as b,L as x,M as ee,N as te,W as S,Z as ne,dt as C,gt as w,lt as T,ut as E,z as D}from"./disk-budget.worker-spawn-diagnostics-BsseRuDV.mjs";import{$t as re,Bt as ie,Ht as ae,It as oe,Jt as se,Kt as O,Lt as k,Mt as A,Ot as j,Pt as M,Qt as N,Ut as P,Vt as F,Wt as I,Xt as L,Zt as R,an as z,in as B,jt as V,kt as H,n as U,nn as W,on as G,sn as K,t as ce,tn as le,zt as ue}from"./disk-budget.worker-openclaw-agent-db-registry-listing-DCqqW-sA.mjs";import{d as de}from"./disk-budget.worker-sqlite-source-handle-wfrxp995.mjs";import{w as fe}from"./disk-budget.worker-sqlite-schema-issues-CUGCweMU.mjs";import{g as q}from"./disk-budget.worker-sqlite-snapshot-staging-owner-B2RhGiGo.mjs";import{s as J}from"./disk-budget.worker-openclaw-state-db-contract-DiFTYPe3.mjs";import{isMainThread as Y}from"node:worker_threads";import X,{lstatSync as pe,readdirSync as me}from"node:fs";import Z from"node:path";function memoryPathPostgresExpressions(e){let t=`pg_catalog.lower(pg_catalog.normalize(pg_catalog.regexp_replace(pg_catalog.replace(pg_catalog.btrim(${e}), E'\\\\', '/'), '^\\./', ''), 'NFC'))`,n=`pg_catalog.regexp_replace(${t}, '^.*/', '')`,r=`pg_catalog.regexp_replace(${n}, '^(.+)\\.[^.]*$', '\\1')`;return{normalized:t,basename:n,stem:r,keys:[t,n,r].map(e=>`pg_catalog.md5(${e})`)}}const Q=[`exact_path`,`basename`,`stem`].map((e,t)=>{let n=`idx_memory_index_sources_${e}`;return{name:n,sql:`CREATE INDEX "${n}" ON "memory_index_sources" ((${memoryPathPostgresExpressions(`path`).keys[t]}));`}}).map(e=>e.sql).join(`

`);function withLegacyAgentPostgresMemoryPaths(e){return e.replace(`${Q}\n\n`,``)}const he={text:{transcript:{table:`session_transcript_fts`,fields:[`text`],postgres:{identity:`rowid`}}}},template=e=>e.replaceAll(`%`,`%%`).replaceAll(`__TABLE__`,`%1$s`).replaceAll(`__FIELD__`,`%2$s`).replaceAll(`__SYNC__`,`%3$s`).replaceAll(`__CONFIG__`,`%4$L`).replaceAll(`'`,`''`),ge=`DO $migration$
DECLARE text_index jsonb; tbl text; fld text; sync text;
  config text := format('%I.%I', current_schema(), 'openclaw_simple_unaccent');
BEGIN
  FOR text_index IN
    SELECT jsonb_build_object('table', 'session_transcript_fts', 'fields', jsonb_build_array('text'))
    UNION ALL
    SELECT indexes.value FROM openclaw_schema_meta meta,
      jsonb_each(coalesce((to_jsonb(meta)->>'search_extensions')::jsonb, '{}'::jsonb)) extensions,
      jsonb_each(coalesce(extensions.value->'text', '{}'::jsonb)) indexes
    WHERE meta.store = 'agent'
  LOOP
    IF to_regclass(format('%I', text_index->>'table')) IS NULL THEN CONTINUE; END IF;
    tbl := '"' || replace(text_index->>'table', '"', '""') || '"';
    fld := '"' || replace(text_index->'fields'->>0, '"', '""') || '"';
    sync := '"' || replace((text_index->>'table') || '_search_sync', '"', '""') || '"';
    EXECUTE format('ALTER TABLE %s ALTER COLUMN openclaw_search DROP EXPRESSION', tbl);
    EXECUTE format('${template(T({table:`__TABLE__`,field:`__FIELD__`,sync:`__SYNC__`}))}', tbl, fld, sync);
    EXECUTE format('${template(`UPDATE __TABLE__ SET openclaw_search = ${E(`__CONFIG__`,`__FIELD__`,2)}`)}', tbl, fld, sync, config);
  END LOOP;
END $migration$;`,_e=`DO $migration$
DECLARE extension_schema text;
BEGIN
  SELECT n.nspname INTO extension_schema
  FROM pg_catalog.pg_proc p
  JOIN pg_catalog.pg_type t ON t.oid = p.prorettype
  JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
  WHERE p.oid = to_regprocedure(format('%I.openclaw_vector(bytea,integer)', current_schema()));
  IF FOUND THEN
    EXECUTE replace($decoder$${C(`__vector_extension__`,2,!0)}$decoder$,
      '__vector_extension__', replace(extension_schema, '"', '""'));
  END IF;
END $migration$;`;function withLegacyAgentPostgresWriteLayout(e){return`${e}
    DROP INDEX "idx_agent_session_windows_conversation";
    CREATE INDEX "idx_agent_session_windows_conversation"
      ON "session_windows" (("primary_conversation_id") ASC NULLS FIRST,
        ("updated_at") DESC NULLS LAST, ("session_id") ASC NULLS FIRST)
      WHERE "primary_conversation_id" IS NOT NULL;
    CREATE INDEX "idx_agent_transcript_event_parent"
      ON "transcript_event_identities" (("session_id") ASC NULLS FIRST,
        ("parent_id") ASC NULLS FIRST)
      WHERE "parent_id" IS NOT NULL;
  `}const ve={get sql(){let e=`-- Generated runtime DDL; the owner supplies search_path and the transaction.

CREATE FUNCTION "openclaw_transcript_navigation_check"(navigation_json text) RETURNS boolean LANGUAGE sql IMMUTABLE STRICT SET search_path = pg_catalog AS $navigation$
WITH input AS (SELECT CASE WHEN navigation_json IS JSON THEN navigation_json::json END AS document),
members AS (SELECT (SELECT member.value FROM json_each(CASE WHEN json_typeof(document) = 'object' THEN document ELSE '{}'::json END) WITH ORDINALITY AS member(key, value, position) WHERE member.key = 'version' ORDER BY member.position LIMIT 1) AS "j_version",
(SELECT member.value FROM json_each(CASE WHEN json_typeof(document) = 'object' THEN document ELSE '{}'::json END) WITH ORDINALITY AS member(key, value, position) WHERE member.key = 'modelBytes' ORDER BY member.position LIMIT 1) AS "j_modelBytes",
(SELECT member.value FROM json_each(CASE WHEN json_typeof(document) = 'object' THEN document ELSE '{}'::json END) WITH ORDINALITY AS member(key, value, position) WHERE member.key = 'modelWithoutCheckpointBytes' ORDER BY member.position LIMIT 1) AS "j_modelWithoutCheckpointBytes",
(SELECT member.value FROM json_each(CASE WHEN json_typeof(document) = 'object' THEN document ELSE '{}'::json END) WITH ORDINALITY AS member(key, value, position) WHERE member.key = 'withoutCustomDataBytes' ORDER BY member.position LIMIT 1) AS "j_withoutCustomDataBytes",
(SELECT member.value FROM json_each(CASE WHEN json_typeof(document) = 'object' THEN document ELSE '{}'::json END) WITH ORDINALITY AS member(key, value, position) WHERE member.key = 'report' ORDER BY member.position LIMIT 1) AS "j_report",
(SELECT member.value FROM json_each(CASE WHEN json_typeof((SELECT member.value FROM json_each(CASE WHEN json_typeof(document) = 'object' THEN document ELSE '{}'::json END) WITH ORDINALITY AS member(key, value, position) WHERE member.key = 'report' ORDER BY member.position LIMIT 1)) = 'object' THEN (SELECT member.value FROM json_each(CASE WHEN json_typeof(document) = 'object' THEN document ELSE '{}'::json END) WITH ORDINALITY AS member(key, value, position) WHERE member.key = 'report' ORDER BY member.position LIMIT 1) ELSE '{}'::json END) WITH ORDINALITY AS member(key, value, position) WHERE member.key = 'kind' ORDER BY member.position LIMIT 1) AS "j_report.kind",
(SELECT member.value FROM json_each(CASE WHEN json_typeof(document) = 'object' THEN document ELSE '{}'::json END) WITH ORDINALITY AS member(key, value, position) WHERE member.key = 'navigation' ORDER BY member.position LIMIT 1) AS "j_navigation",
(SELECT member.value FROM json_each(CASE WHEN json_typeof(document) = 'object' THEN document ELSE '{}'::json END) WITH ORDINALITY AS member(key, value, position) WHERE member.key = 'reset' ORDER BY member.position LIMIT 1) AS "j_reset",
(SELECT member.value FROM json_each(CASE WHEN json_typeof(document) = 'object' THEN document ELSE '{}'::json END) WITH ORDINALITY AS member(key, value, position) WHERE member.key = 'model' ORDER BY member.position LIMIT 1) AS "j_model" FROM input)
SELECT "navigation_json" IS NULL OR CASE WHEN ("navigation_json" IS JSON) THEN coalesce((octet_length("navigation_json") <= 16384) AND (CASE WHEN json_typeof("j_version") = 'number' AND ("j_version" #>> '{}') ~ '^-?[0-9]+$' THEN 'integer' WHEN json_typeof("j_version") = 'number' THEN 'real' ELSE json_typeof("j_version") END = 'integer') AND (CASE WHEN json_typeof("j_version") = 'number' AND ("j_version" #>> '{}') ~ '^-?[0-9]+$' AND char_length(("j_version" #>> '{}')) <= 20 THEN ("j_version" #>> '{}')::numeric END = 1) AND (CASE WHEN json_typeof("j_report") = 'number' AND ("j_report" #>> '{}') ~ '^-?[0-9]+$' THEN 'integer' WHEN json_typeof("j_report") = 'number' THEN 'real' ELSE json_typeof("j_report") END = 'object') AND (CASE WHEN json_typeof("j_report.kind") = 'string' THEN ("j_report.kind" #>> '{}') END IN ('canonical', 'leaf', 'link', 'ignored')) AND (CASE WHEN json_typeof("j_navigation") = 'number' AND ("j_navigation" #>> '{}') ~ '^-?[0-9]+$' THEN 'integer' WHEN json_typeof("j_navigation") = 'number' THEN 'real' ELSE json_typeof("j_navigation") END = 'object') AND (CASE WHEN json_typeof("j_reset") = 'number' AND ("j_reset" #>> '{}') ~ '^-?[0-9]+$' THEN 'integer' WHEN json_typeof("j_reset") = 'number' THEN 'real' ELSE json_typeof("j_reset") END = 'object') AND (CASE WHEN json_typeof("j_model") = 'number' AND ("j_model" #>> '{}') ~ '^-?[0-9]+$' THEN 'integer' WHEN json_typeof("j_model") = 'number' THEN 'real' ELSE json_typeof("j_model") END = 'object') AND (CASE WHEN json_typeof("j_modelBytes") = 'number' AND ("j_modelBytes" #>> '{}') ~ '^-?[0-9]+$' THEN 'integer' WHEN json_typeof("j_modelBytes") = 'number' THEN 'real' ELSE json_typeof("j_modelBytes") END = 'integer') AND (CASE WHEN json_typeof("j_modelBytes") = 'number' AND ("j_modelBytes" #>> '{}') ~ '^-?[0-9]+$' AND char_length(("j_modelBytes" #>> '{}')) <= 20 THEN ("j_modelBytes" #>> '{}')::numeric END BETWEEN 0 AND 4194304) AND (CASE WHEN json_typeof("j_modelWithoutCheckpointBytes") = 'number' AND ("j_modelWithoutCheckpointBytes" #>> '{}') ~ '^-?[0-9]+$' THEN 'integer' WHEN json_typeof("j_modelWithoutCheckpointBytes") = 'number' THEN 'real' ELSE json_typeof("j_modelWithoutCheckpointBytes") END = 'integer') AND (CASE WHEN json_typeof("j_modelWithoutCheckpointBytes") = 'number' AND ("j_modelWithoutCheckpointBytes" #>> '{}') ~ '^-?[0-9]+$' AND char_length(("j_modelWithoutCheckpointBytes" #>> '{}')) <= 20 THEN ("j_modelWithoutCheckpointBytes" #>> '{}')::numeric END BETWEEN 0 AND 4194304) AND (CASE WHEN json_typeof("j_withoutCustomDataBytes") = 'number' AND ("j_withoutCustomDataBytes" #>> '{}') ~ '^-?[0-9]+$' THEN 'integer' WHEN json_typeof("j_withoutCustomDataBytes") = 'number' THEN 'real' ELSE json_typeof("j_withoutCustomDataBytes") END = 'integer') AND (CASE WHEN json_typeof("j_withoutCustomDataBytes") = 'number' AND ("j_withoutCustomDataBytes" #>> '{}') ~ '^-?[0-9]+$' AND char_length(("j_withoutCustomDataBytes" #>> '{}')) <= 20 THEN ("j_withoutCustomDataBytes" #>> '{}')::numeric END BETWEEN 0 AND 4194304), FALSE) ELSE FALSE END FROM members;
$navigation$;

CREATE TABLE "acp_parent_stream_events" (
  "session_id" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "seq" bigint NOT NULL,
  "event_json" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  PRIMARY KEY ("session_id", "run_id", "seq")
);

CREATE TABLE "agent_tool_usage" (
  "tool_id" text COLLATE "C" NOT NULL,
  "score" double precision NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("tool_id"),
  CHECK (("score" >= 0))
);

CREATE TABLE "auth_profile_state" (
  "state_key" text COLLATE "C" NOT NULL,
  "state_json" text COLLATE "C" NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("state_key")
);

CREATE TABLE "auth_profile_store" (
  "store_key" text COLLATE "C" NOT NULL,
  "store_json" text COLLATE "C" NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("store_key")
);

CREATE TABLE "board_tabs" (
  "session_key" text COLLATE "C" NOT NULL,
  "tab_id" text COLLATE "C" NOT NULL,
  "title" text COLLATE "C" NOT NULL,
  "position" bigint NOT NULL,
  "chat_dock" text COLLATE "C" NOT NULL DEFAULT 'right',
  "created_by" text COLLATE "C" NOT NULL,
  "revision" bigint NOT NULL,
  PRIMARY KEY ("session_key", "tab_id"),
  CHECK (("position" >= 0)),
  CHECK (("chat_dock" IN ('left', 'right', 'bottom', 'hidden'))),
  CHECK (("created_by" IN ('user', 'agent'))),
  CHECK (("revision" >= 0))
);

CREATE TABLE "board_widgets" (
  "session_key" text COLLATE "C" NOT NULL,
  "name" text COLLATE "C" NOT NULL,
  "tab_id" text COLLATE "C" NOT NULL,
  "title" text COLLATE "C",
  "content_kind" text COLLATE "C" NOT NULL,
  "html" bytea,
  "descriptor_json" text COLLATE "C",
  "sha256" text COLLATE "C" NOT NULL,
  "view_generation" text COLLATE "C",
  "revision" bigint NOT NULL,
  "size_w" bigint NOT NULL,
  "size_h" bigint NOT NULL,
  "position" bigint NOT NULL,
  "manifest" text COLLATE "C" NOT NULL DEFAULT '{}',
  "grant_state" text COLLATE "C" NOT NULL DEFAULT 'none',
  "granted_sha" text COLLATE "C",
  "created_by" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("session_key", "name"),
  CHECK (("content_kind" IN ('html', 'mcp-app', 'plugin'))),
  CHECK (("revision" >= 1)),
  CHECK (("size_w" BETWEEN 1 AND 12)),
  CHECK (("size_h" BETWEEN 1 AND 20)),
  CHECK (("position" >= 0)),
  CHECK (("grant_state" IN ('none', 'pending', 'granted', 'rejected'))),
  CHECK (("created_by" IN ('user', 'agent'))),
  CHECK ((("content_kind" = 'html') AND "html" IS NOT NULL AND "descriptor_json" IS NULL AND "view_generation" IS NOT NULL) OR (("content_kind" = 'mcp-app') AND "html" IS NULL AND "descriptor_json" IS NOT NULL AND "view_generation" IS NULL) OR (("content_kind" = 'plugin') AND "html" IS NULL AND "descriptor_json" IS NOT NULL AND "view_generation" IS NULL))
);

CREATE TABLE "cache_entries" (
  "scope" text COLLATE "C" NOT NULL,
  "key" text COLLATE "C" NOT NULL,
  "value_json" text COLLATE "C",
  "blob" bytea,
  "expires_at" bigint,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("scope", "key")
);

CREATE TABLE "context_engine_turn_outbox" (
  "enqueue_sequence" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "advancement_key" text COLLATE "C" NOT NULL,
  "engine_id" text COLLATE "C" NOT NULL,
  "owner_plugin_id" text COLLATE "C",
  "session_id" text COLLATE "C" NOT NULL,
  "payload_json" text COLLATE "C" NOT NULL,
  "payload_state" text COLLATE "C",
  "attempt_count" bigint NOT NULL DEFAULT 0,
  "last_attempt_at" bigint,
  "last_error" text COLLATE "C",
  "created_at" bigint NOT NULL,
  PRIMARY KEY ("enqueue_sequence"),
  UNIQUE ("advancement_key")
);

CREATE TABLE "conversation_deliveries" (
  "operation_id" text COLLATE "C" NOT NULL,
  "operation_kind" text COLLATE "C" NOT NULL,
  "conversation_id" text COLLATE "C" NOT NULL,
  "source_session_key" text COLLATE "C",
  "message_hash" text COLLATE "C" NOT NULL,
  "status" text COLLATE "C" NOT NULL,
  "prepared_message_id" text COLLATE "C",
  "platform_message_id" text COLLATE "C",
  "queue_id" text COLLATE "C",
  "rejection_error" text COLLATE "C",
  "reply_message_id" text COLLATE "C",
  "reply_to_id" text COLLATE "C",
  "reply_thread_id" text COLLATE "C",
  "reply_text" text COLLATE "C",
  "reply_timestamp" bigint,
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("operation_id"),
  CHECK (("operation_kind" IN ('send', 'turn'))),
  CHECK (("status" IN ('created', 'queued', 'sent', 'suppressed', 'rejected', 'unknown', 'replied'))),
  CHECK ((("status" = 'rejected') AND "rejection_error" IS NOT NULL) OR (("status" != 'rejected') AND "rejection_error" IS NULL))
);

CREATE TABLE "conversations" (
  "conversation_id" text COLLATE "C" NOT NULL,
  "channel" text COLLATE "C" NOT NULL,
  "account_id" text COLLATE "C" NOT NULL,
  "kind" text COLLATE "C" NOT NULL,
  "peer_id" text COLLATE "C" NOT NULL,
  "delivery_target" text COLLATE "C" NOT NULL,
  "parent_conversation_id" text COLLATE "C",
  "thread_id" text COLLATE "C",
  "native_channel_id" text COLLATE "C",
  "native_direct_user_id" text COLLATE "C",
  "label" text COLLATE "C",
  "metadata_json" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("conversation_id"),
  CHECK (("kind" IN ('direct', 'group', 'channel')))
);

CREATE TABLE "heartbeat_outcomes" (
  "session_key" text COLLATE "C" NOT NULL,
  "run_session_key" text COLLATE "C" NOT NULL,
  "outcome" text COLLATE "C" NOT NULL,
  "summary" text COLLATE "C" NOT NULL,
  "response_reason" text COLLATE "C",
  "priority" text COLLATE "C",
  "next_check" text COLLATE "C",
  "task_names_json" text COLLATE "C",
  "wake_source" text COLLATE "C",
  "wake_reason" text COLLATE "C",
  "occurred_at" bigint NOT NULL,
  "context_run_id" text COLLATE "C",
  "context_claimed_at" bigint,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("session_key"),
  CHECK (("outcome" IN ('progress', 'done', 'blocked', 'needs_attention'))),
  CHECK ("priority" IS NULL OR ("priority" IN ('low', 'normal', 'high')))
);

CREATE TABLE "memory_embedding_cache" (
  "provider" text COLLATE "C" NOT NULL,
  "model" text COLLATE "C" NOT NULL,
  "provider_key" text COLLATE "C" NOT NULL,
  "hash" text COLLATE "C" NOT NULL,
  "embedding" bytea NOT NULL,
  "dims" bigint,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("provider", "model", "provider_key", "hash")
);

CREATE TABLE "memory_entry_origins" (
  "entry_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C",
  "origin_class" text COLLATE "C" NOT NULL,
  "observed_at" bigint NOT NULL,
  PRIMARY KEY ("entry_key", "agent_id", "session_id"),
  CHECK (("origin_class" IN ('owner', 'agent', 'untrusted', 'system')))
);

CREATE TABLE "memory_index_chunk_provenance" (
  "chunk_id" text COLLATE "C" NOT NULL,
  "origin_class" text COLLATE "C" NOT NULL,
  "session_kind" text COLLATE "C" NOT NULL,
  "observed_at" bigint NOT NULL,
  "supersedes_key" text COLLATE "C",
  PRIMARY KEY ("chunk_id"),
  CHECK (("origin_class" IN ('owner', 'agent', 'untrusted', 'system'))),
  CHECK (("session_kind" IN ('interactive', 'cron', 'heartbeat', 'subagent', 'unknown')))
);

CREATE TABLE "memory_index_chunk_recall_metadata" (
  "chunk_id" text COLLATE "C" NOT NULL,
  "importance" bigint,
  "triggers" text COLLATE "C",
  "project_key" text COLLATE "C",
  PRIMARY KEY ("chunk_id"),
  CHECK ("importance" IS NULL OR ("importance" BETWEEN 1 AND 10))
);

CREATE TABLE "memory_index_chunks" (
  "chunk_rowid" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "id" text COLLATE "C" NOT NULL,
  "path" text COLLATE "C" NOT NULL,
  "source" text COLLATE "C" NOT NULL DEFAULT 'memory',
  "start_line" bigint NOT NULL,
  "end_line" bigint NOT NULL,
  "hash" text COLLATE "C" NOT NULL,
  "model" text COLLATE "C" NOT NULL,
  "text" text COLLATE "C" NOT NULL,
  "embedding" bytea NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("chunk_rowid"),
  UNIQUE ("id")
);

CREATE TABLE "memory_index_meta" (
  "key" text COLLATE "C" NOT NULL,
  "value" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("key")
);

CREATE TABLE "memory_index_sources" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "path" text COLLATE "C" NOT NULL,
  "source" text COLLATE "C" NOT NULL DEFAULT 'memory',
  "hash" text COLLATE "C" NOT NULL,
  "mtime" double precision NOT NULL,
  "size" bigint NOT NULL,
  PRIMARY KEY ("id"),
  UNIQUE ("path", "source")
);

CREATE TABLE "memory_index_state" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "revision" bigint NOT NULL,
  PRIMARY KEY ("id"),
  CHECK (("id" = 1))
);

CREATE TABLE "memory_session_tombstones" (
  "session_id" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "reason" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  PRIMARY KEY ("session_id")
);

CREATE TABLE "message_tool_run_outcomes" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "agent_id" text COLLATE "C" NOT NULL,
  "provider" text COLLATE "C" NOT NULL,
  "model" text COLLATE "C" NOT NULL,
  "outcome" text COLLATE "C" NOT NULL,
  "run_status" text COLLATE "C" NOT NULL,
  "occurred_at" bigint NOT NULL,
  PRIMARY KEY ("id"),
  CHECK (("outcome" IN ('tool_delivered', 'mute'))),
  CHECK (("run_status" IN ('completed', 'errored', 'aborted')))
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

CREATE TABLE "session_canonical_validation_pending" (
  "session_key" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("session_key")
);

CREATE TABLE "session_conversations" (
  "session_id" text COLLATE "C" NOT NULL,
  "conversation_id" text COLLATE "C" NOT NULL,
  "role" text COLLATE "C" NOT NULL DEFAULT 'primary',
  "route_context_json" text COLLATE "C",
  "first_seen_at" bigint NOT NULL,
  "last_seen_at" bigint NOT NULL,
  PRIMARY KEY ("session_id", "conversation_id", "role"),
  CHECK (("role" IN ('primary', 'participant', 'related')))
);

CREATE TABLE "session_creation_operations" (
  "operation_digest" text COLLATE "C" NOT NULL,
  "request_fingerprint" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "lifecycle_revision" text COLLATE "C",
  "role" text COLLATE "C",
  "scopes_json" text COLLATE "C" NOT NULL,
  "expires_at" bigint NOT NULL,
  PRIMARY KEY ("operation_digest")
);

CREATE TABLE "session_entry_snapshots" (
  "session_key" text COLLATE "C" NOT NULL,
  "field" text COLLATE "C" NOT NULL,
  "value_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("session_key", "field"),
  CHECK (("field" IN ('sessionDiffBaseline', 'skillsSnapshot', 'systemPromptReport')))
);

CREATE TABLE "session_goal_operations" (
  "session_key" text COLLATE "C" NOT NULL,
  "operation_id" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "request_fingerprint" text COLLATE "C" NOT NULL,
  "result_json" text COLLATE "C" NOT NULL,
  "expires_at" bigint NOT NULL,
  PRIMARY KEY ("session_key", "operation_id")
);

CREATE TABLE "session_input_completions" (
  "session_key" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "idempotency_key" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "request_hash" text COLLATE "C" NOT NULL,
  "outcome_json" text COLLATE "C" NOT NULL,
  "succeeded" bigint NOT NULL,
  "completed_at" bigint NOT NULL,
  PRIMARY KEY ("session_id", "idempotency_key"),
  CHECK (("succeeded" IN (0, 1)))
);

CREATE TABLE "session_key_contract" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "main_key" text COLLATE "C" NOT NULL,
  "canonical_ready" text COLLATE "C",
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("id"),
  CHECK (("id" = 1))
);

CREATE TABLE "session_members" (
  "session_key" text COLLATE "C" NOT NULL,
  "identity_id" text COLLATE "C" NOT NULL,
  "added_by" text COLLATE "C" NOT NULL,
  "added_at" bigint NOT NULL,
  PRIMARY KEY ("session_key", "identity_id")
);

CREATE TABLE "session_nodes" (
  "session_key" text COLLATE "C" NOT NULL,
  "current_session_id" text COLLATE "C" NOT NULL,
  "entry_json" text COLLATE "C" NOT NULL,
  "session_started_at" bigint,
  "has_optional_references" bigint NOT NULL DEFAULT 0,
  "snapshot_revision" bigint NOT NULL DEFAULT 0,
  "legacy_acp_migration_json" text COLLATE "C",
  "entry_valid" bigint NOT NULL DEFAULT 0,
  "updated_at" bigint NOT NULL,
  "status" text COLLATE "C",
  "created_at" bigint,
  "created_via" text COLLATE "C",
  "created_actor_type" text COLLATE "C",
  "created_actor_id" text COLLATE "C",
  "owner_actor_type" text COLLATE "C",
  "owner_actor_id" text COLLATE "C",
  "owner_assigned_by_type" text COLLATE "C",
  "owner_assigned_by_id" text COLLATE "C",
  "owner_assigned_at" bigint,
  "project_id" text COLLATE "C",
  "parent_session_key" text COLLATE "C",
  "spawned_by" text COLLATE "C",
  "fork_source_session_key" text COLLATE "C",
  "fork_source_session_id" text COLLATE "C",
  "fork_source_entry_id" text COLLATE "C",
  "label" text COLLATE "C",
  "display_name" text COLLATE "C",
  "category" text COLLATE "C",
  "icon" text COLLATE "C",
  "pinned_at" bigint,
  "archived_at" bigint,
  "last_read_at" bigint,
  "last_interaction_at" bigint,
  "last_activity_at" bigint,
  PRIMARY KEY ("session_key"),
  CHECK (("entry_valid" IN (-1, 0, 1))),
  CHECK ("status" IS NULL OR ("status" IN ('running', 'done', 'failed', 'killed', 'timeout'))),
  CHECK ("created_via" IS NULL OR ("created_via" IN ('operator', 'spawn', 'channel', 'cron', 'talk', 'run', 'plugin', 'internal'))),
  CHECK ("created_actor_type" IS NULL OR ("created_actor_type" IN ('human', 'agent', 'system')))
);

CREATE TABLE "session_participants" (
  "session_key" text COLLATE "C" NOT NULL,
  "identity_namespace" text COLLATE "C" NOT NULL,
  "actor_id" text COLLATE "C" NOT NULL,
  "contribution_count" bigint NOT NULL,
  "first_prompted_at" bigint,
  "last_prompted_at" bigint,
  PRIMARY KEY ("session_key", "identity_namespace", "actor_id")
);

CREATE TABLE "session_pending_inputs" (
  "seq" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "input_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "idempotency_key" text COLLATE "C" NOT NULL,
  "run_id" text COLLATE "C" NOT NULL,
  "request_hash" text COLLATE "C" NOT NULL,
  "message_json" text COLLATE "C" NOT NULL,
  "lifecycle_generation" text COLLATE "C" NOT NULL,
  "state" text COLLATE "C" NOT NULL,
  "accepted_at" bigint NOT NULL,
  "consumed_event_id" text COLLATE "C",
  PRIMARY KEY ("seq"),
  CHECK (("state" IN ('queued', 'interrupted', 'cancelled'))),
  UNIQUE ("input_id"),
  UNIQUE ("session_id", "idempotency_key")
);

CREATE TABLE "session_progress_cards" (
  "session_key" text COLLATE "C" NOT NULL,
  "markdown" text COLLATE "C",
  "steps_json" text COLLATE "C",
  "revision" bigint NOT NULL,
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("session_key")
);

CREATE TABLE "session_reactions" (
  "session_key" text COLLATE "C" NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "message_id" text COLLATE "C" NOT NULL,
  "emoji" text COLLATE "C" NOT NULL,
  "identity_id" text COLLATE "C" NOT NULL,
  "identity_label" text COLLATE "C",
  "created_at" bigint NOT NULL,
  PRIMARY KEY ("session_key", "session_id", "message_id", "emoji", "identity_id")
);

CREATE TABLE "session_suggestions" (
  "id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "author_id" text COLLATE "C" NOT NULL,
  "author_label" text COLLATE "C",
  "text" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "state" text COLLATE "C" NOT NULL,
  "dispatch_token" text COLLATE "C",
  "dispatch_started_at" bigint,
  "dispatch_resolution" text COLLATE "C",
  PRIMARY KEY ("id"),
  CHECK (("state" IN ('pending', 'accepted', 'dismissed'))),
  CHECK (("dispatch_resolution" IN ('send', 'queue', 'edit', 'dismiss'))),
  CHECK (("dispatch_token" IS NULL AND "dispatch_started_at" IS NULL AND "dispatch_resolution" IS NULL) OR ("dispatch_token" IS NOT NULL AND "dispatch_started_at" IS NOT NULL AND "dispatch_resolution" IS NOT NULL))
);

CREATE TABLE "session_transcript_active_event_facts" (
  "session_id" text COLLATE "C" NOT NULL,
  "seq" bigint NOT NULL,
  "serialized_bytes" bigint NOT NULL,
  "dependency_navigation_json" text COLLATE "C" NOT NULL,
  PRIMARY KEY ("session_id", "seq"),
  CHECK (("serialized_bytes" >= 1))
);

CREATE TABLE "session_transcript_active_events" (
  "session_id" text COLLATE "C" NOT NULL,
  "active_position" bigint NOT NULL,
  "event_seq" bigint NOT NULL,
  "message_position" bigint,
  "context_eligible" bigint,
  PRIMARY KEY ("session_id", "active_position"),
  CHECK (("active_position" >= 0)),
  CHECK ("message_position" IS NULL OR ("message_position" >= 0))
);

CREATE TABLE "session_transcript_archives" (
  "session_id" text COLLATE "C" NOT NULL,
  "generation" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "reason" text COLLATE "C" NOT NULL,
  "encoding" text COLLATE "C" NOT NULL,
  "archive_blob" bytea NOT NULL,
  "archive_sha256" text COLLATE "C" NOT NULL,
  "archive_name" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "published_at" bigint,
  "publish_attempts" bigint NOT NULL DEFAULT 0,
  "last_publish_attempt_at" bigint,
  "last_publish_error" text COLLATE "C",
  PRIMARY KEY ("session_id", "generation"),
  CHECK (("reason" IN ('deleted', 'reset'))),
  CHECK (("encoding" IN ('identity', 'zstd'))),
  CHECK ((char_length("archive_sha256") = 64)),
  CHECK (("publish_attempts" >= 0)),
  CHECK ((strpos("archive_name", '/') = 0) AND (strpos("archive_name", '\\') = 0)),
  UNIQUE ("archive_name")
);

CREATE TABLE "session_transcript_cold_archive_chunks" (
  "session_id" text COLLATE "C" NOT NULL,
  "chunk_index" bigint NOT NULL,
  "archive_name" text COLLATE "C" NOT NULL,
  "archive_sha256" text COLLATE "C" NOT NULL,
  "first_seq" bigint NOT NULL,
  "last_seq" bigint NOT NULL,
  "event_count" bigint NOT NULL,
  "raw_bytes" bigint NOT NULL,
  "archive_bytes" bigint NOT NULL,
  "archive_blob" bytea,
  PRIMARY KEY ("session_id", "chunk_index"),
  CHECK (("chunk_index" >= 0)),
  CHECK ((char_length("archive_sha256") = 64)),
  CHECK (("last_seq" >= "first_seq")),
  CHECK (("event_count" >= 1)),
  CHECK (("raw_bytes" >= 0)),
  CHECK (("archive_bytes" >= 0)),
  CHECK ((char_length("archive_name") > 0) AND ("archive_name" NOT IN ('.', '..')) AND (strpos("archive_name", '/') = 0) AND (strpos("archive_name", '\\') = 0)),
  UNIQUE ("archive_name")
);

CREATE TABLE "session_transcript_cold_archives" (
  "session_id" text COLLATE "C" NOT NULL,
  "generation" text COLLATE "C" NOT NULL,
  "archive_name" text COLLATE "C" NOT NULL,
  "archive_sha256" text COLLATE "C" NOT NULL,
  "event_count" bigint NOT NULL,
  "raw_bytes" bigint NOT NULL,
  "archive_bytes" bigint NOT NULL,
  "last_seq" bigint NOT NULL,
  "archived_at" bigint NOT NULL,
  "storage" text COLLATE "C" NOT NULL,
  "archive_blob" bytea,
  PRIMARY KEY ("session_id"),
  CHECK ((char_length("archive_sha256") = 64)),
  CHECK (("event_count" >= 1)),
  CHECK (("raw_bytes" >= 0)),
  CHECK (("archive_bytes" >= 0)),
  CHECK (("storage" IN ('file', 'sqlite'))),
  CHECK ((char_length("archive_name") > 0) AND ("archive_name" NOT IN ('.', '..')) AND (strpos("archive_name", '/') = 0) AND (strpos("archive_name", '\\') = 0)),
  CHECK ((("storage" = 'file') AND "archive_blob" IS NULL) OR (("storage" = 'sqlite') AND "archive_blob" IS NOT NULL)),
  UNIQUE ("archive_name")
);

CREATE TABLE "session_transcript_fts_rows" (
  "id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "session_id" text COLLATE "C" NOT NULL,
  "message_id" text COLLATE "C",
  PRIMARY KEY ("id")
);

CREATE TABLE "session_transcript_index_state" (
  "session_id" text COLLATE "C" NOT NULL,
  "indexed_seq" bigint NOT NULL,
  "leaf_event_id" text COLLATE "C",
  "needs_rebuild" bigint NOT NULL DEFAULT 0,
  "active_event_count" bigint NOT NULL DEFAULT 0,
  "active_message_count" bigint NOT NULL DEFAULT 0,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("session_id")
);

CREATE TABLE "session_windows" (
  "session_id" text COLLATE "C" NOT NULL,
  "session_key" text COLLATE "C" NOT NULL,
  "previous_session_id" text COLLATE "C",
  "reason" text COLLATE "C",
  "session_scope" text COLLATE "C" NOT NULL DEFAULT 'conversation',
  "created_at" bigint NOT NULL,
  "updated_at" bigint NOT NULL,
  "transcript_updated_at" bigint DEFAULT NULL,
  "row_transcript_json" text COLLATE "C",
  "row_transcript_updated_at" bigint,
  "transcript_observed_at" bigint DEFAULT NULL,
  "session_entry_provenance" bigint NOT NULL DEFAULT 0,
  "acp_owned" bigint NOT NULL DEFAULT 0,
  "plugin_owner_id" text COLLATE "C",
  "hook_external_content_source" text COLLATE "C",
  "started_at" bigint,
  "ended_at" bigint,
  "status" text COLLATE "C",
  "chat_type" text COLLATE "C",
  "channel" text COLLATE "C",
  "account_id" text COLLATE "C",
  "primary_conversation_id" text COLLATE "C",
  "model_provider" text COLLATE "C",
  "model" text COLLATE "C",
  "agent_harness_id" text COLLATE "C",
  "parent_session_key" text COLLATE "C",
  "spawned_by" text COLLATE "C",
  "display_name" text COLLATE "C",
  PRIMARY KEY ("session_id"),
  CHECK ("reason" IS NULL OR ("reason" IN ('initial', 'reset', 'rollover', 'fork', 'rewind', 'switch', 'recovery', 'compaction'))),
  CHECK (("session_scope" IN ('conversation', 'shared-main', 'group', 'channel'))),
  CHECK (("session_entry_provenance" IN (0, 1))),
  CHECK (("acp_owned" IN (0, 1))),
  CHECK ("hook_external_content_source" IS NULL OR ("hook_external_content_source" IN ('gmail', 'webhook'))),
  CHECK ("status" IS NULL OR ("status" IN ('running', 'done', 'failed', 'killed', 'timeout'))),
  CHECK ("chat_type" IS NULL OR ("chat_type" IN ('direct', 'group', 'channel')))
);

CREATE TABLE "standing_intents" (
  "intent_key" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  "id" text COLLATE "C" NOT NULL,
  "description" text COLLATE "C" NOT NULL,
  "trigger_keywords" text COLLATE "C" NOT NULL,
  "trigger_embedding" text COLLATE "C",
  "channel_scope" text COLLATE "C",
  "sender_scope" text COLLATE "C",
  "creator_sender" text COLLATE "C",
  "status" text COLLATE "C" NOT NULL,
  "expires_at" bigint NOT NULL,
  "max_fires" bigint NOT NULL,
  "fire_count" bigint NOT NULL DEFAULT 0,
  "cooldown_seconds" bigint NOT NULL DEFAULT 86400,
  "last_fired_at" bigint,
  "created_at" bigint NOT NULL,
  "source_session_id" text COLLATE "C",
  PRIMARY KEY ("intent_key"),
  CHECK ("creator_sender" IS NULL OR (char_length(btrim("creator_sender")) > 0)),
  CHECK (("status" IN ('pending', 'armed', 'fired', 'done', 'cancelled', 'expired'))),
  CHECK (("max_fires" > 0)),
  CHECK (("fire_count" >= 0)),
  CHECK (("cooldown_seconds" >= 0)),
  UNIQUE ("id")
);

CREATE TABLE "trajectory_runtime_events" (
  "session_id" text COLLATE "C" NOT NULL,
  "seq" bigint NOT NULL,
  "run_id" text COLLATE "C",
  "event_json" text COLLATE "C" NOT NULL,
  "created_at" bigint NOT NULL,
  "event_utf8_bytes" bigint,
  "event_payload" bytea,
  "event_codec" text COLLATE "C",
  PRIMARY KEY ("session_id", "seq")
);

CREATE TABLE "transcript_event_identities" (
  "session_id" text COLLATE "C" NOT NULL,
  "event_id" text COLLATE "C" NOT NULL,
  "seq" bigint NOT NULL,
  "event_type" text COLLATE "C",
  "parent_id" text COLLATE "C",
  "message_idempotency_key" text COLLATE "C",
  "created_at" bigint NOT NULL,
  PRIMARY KEY ("session_id", "event_id")
);

CREATE TABLE "transcript_events" (
  "session_id" text COLLATE "C" NOT NULL,
  "seq" bigint NOT NULL,
  "event_json" text COLLATE "C",
  "created_at" bigint NOT NULL,
  "event_zstd" bytea,
  "event_utf8_bytes" bigint,
  "navigation_json" text COLLATE "C",
  "navigation_type" text COLLATE "C",
  "navigation_custom_type" text COLLATE "C",
  "navigation_display" bigint NOT NULL DEFAULT 0,
  "message_role" text COLLATE "C",
  "navigation_last_type" text COLLATE "C",
  "navigation_last_custom_type" text COLLATE "C",
  "navigation_valid" bigint NOT NULL DEFAULT 1,
  PRIMARY KEY ("session_id", "seq"),
  CHECK ("event_utf8_bytes" IS NULL OR ("event_utf8_bytes" >= 0)),
  CHECK (("event_json" IS NOT NULL AND "event_zstd" IS NULL) OR ("event_json" IS NULL AND "event_zstd" IS NOT NULL AND "event_utf8_bytes" IS NOT NULL AND ("event_utf8_bytes" BETWEEN 1 AND 4194304) AND (octet_length("event_zstd") BETWEEN 1 AND 4194304) AND "navigation_json" IS NOT NULL) OR ("event_json" IS NULL AND "event_zstd" IS NULL AND "event_utf8_bytes" IS NOT NULL AND ("event_utf8_bytes" BETWEEN 1 AND 4194304) AND "navigation_json" IS NOT NULL)),
  CHECK ("openclaw_transcript_navigation_check"("navigation_json"))
);

CREATE TABLE "transcript_rewrite_watermarks" (
  "session_id" text COLLATE "C" NOT NULL,
  "generation" text COLLATE "C" NOT NULL,
  "updated_at" bigint NOT NULL,
  PRIMARY KEY ("session_id")
);

CREATE INDEX "idx_agent_acp_parent_stream_run" ON "acp_parent_stream_events" (("run_id") ASC, ("seq") ASC);

CREATE INDEX "idx_agent_board_widgets_tab_position" ON "board_widgets" (("session_key") ASC, ("tab_id") ASC, ("position") ASC);

CREATE INDEX "idx_agent_cache_expiry" ON "cache_entries" (("scope") ASC, ("expires_at") ASC, ("key") ASC) WHERE "expires_at" IS NOT NULL;

CREATE INDEX "idx_agent_cache_updated" ON "cache_entries" (("scope") ASC, ("updated_at") DESC, ("key") ASC);

CREATE INDEX "idx_agent_voice_session_open_scope" ON "cache_entries" ((CASE WHEN ("value_json" IS JSON) THEN CASE WHEN json_typeof(("value_json"::json -> 'agentId')) = 'string' THEN (("value_json"::json -> 'agentId') #>> '{}') END ELSE NULL END) ASC NULLS FIRST, (CASE WHEN ("value_json" IS JSON) THEN CASE WHEN json_typeof(("value_json"::json -> 'sessionKey')) = 'string' THEN (("value_json"::json -> 'sessionKey') #>> '{}') END ELSE NULL END) ASC NULLS FIRST, (CASE WHEN ("value_json" IS JSON) THEN CASE WHEN json_typeof(("value_json"::json -> 'origin')) = 'string' THEN (("value_json"::json -> 'origin') #>> '{}') END ELSE NULL END) ASC NULLS FIRST) WHERE ("scope" = 'talk-client-voice-sessions') AND (CASE WHEN ("value_json" IS JSON) THEN CASE WHEN json_typeof(("value_json"::json -> 'status')) = 'string' THEN (("value_json"::json -> 'status') #>> '{}') END ELSE NULL END = 'open');

CREATE INDEX "idx_agent_voice_session_open_updated" ON "cache_entries" (("scope") ASC, ("updated_at") ASC) WHERE ("scope" = 'talk-client-voice-sessions') AND (CASE WHEN ("value_json" IS JSON) THEN CASE WHEN json_typeof(("value_json"::json -> 'status')) = 'string' THEN (("value_json"::json -> 'status') #>> '{}') END ELSE NULL END = 'open');

CREATE INDEX "idx_agent_context_engine_turn_outbox_engine" ON "context_engine_turn_outbox" (("engine_id") ASC, ("created_at") ASC);

CREATE INDEX "idx_agent_conversation_deliveries_reply" ON "conversation_deliveries" (("conversation_id") ASC, ("platform_message_id") ASC NULLS FIRST, ("prepared_message_id") ASC NULLS FIRST) WHERE ("status" IN ('queued', 'sent', 'replied'));

CREATE INDEX "idx_agent_conversation_deliveries_source_session" ON "conversation_deliveries" (("source_session_key") ASC NULLS FIRST, ("operation_id") ASC);

CREATE INDEX "idx_agent_conversation_deliveries_updated" ON "conversation_deliveries" (("updated_at") DESC, ("operation_id") ASC);

CREATE UNIQUE INDEX "idx_agent_conversations_identity" ON "conversations" (("channel") ASC, ("account_id") ASC, ("kind") ASC, ("peer_id") ASC, (coalesce("parent_conversation_id", '')) ASC NULLS FIRST, (coalesce("thread_id", '')) ASC NULLS FIRST);

CREATE INDEX "idx_agent_conversations_lookup" ON "conversations" (("channel") ASC, ("account_id") ASC, ("kind") ASC, ("peer_id") ASC, ("thread_id") ASC NULLS FIRST);

CREATE INDEX "idx_agent_conversations_updated" ON "conversations" (("updated_at") DESC, ("conversation_id") ASC);

CREATE INDEX "idx_memory_embedding_cache_updated_at" ON "memory_embedding_cache" (("updated_at") ASC);

CREATE INDEX "idx_memory_index_chunks_path_source" ON "memory_index_chunks" (("path") ASC, ("source") ASC);

CREATE INDEX "idx_memory_index_chunks_source" ON "memory_index_chunks" (("source") ASC);

CREATE INDEX "idx_memory_index_sources_source" ON "memory_index_sources" (("source") ASC);

CREATE INDEX "idx_agent_message_tool_run_outcomes_occurred" ON "message_tool_run_outcomes" (("occurred_at") DESC, ("id") DESC);

CREATE INDEX "idx_agent_session_conversations_conversation" ON "session_conversations" (("conversation_id") ASC, ("last_seen_at") DESC, ("session_id") ASC);

CREATE UNIQUE INDEX "idx_agent_session_conversations_primary" ON "session_conversations" (("session_id") ASC) WHERE ("role" = 'primary');

CREATE INDEX "idx_agent_session_creation_operations_expiry" ON "session_creation_operations" (("expires_at") ASC);

CREATE INDEX "idx_agent_session_goal_operations_expiry" ON "session_goal_operations" (("expires_at") ASC);

CREATE INDEX "idx_agent_session_input_completions_session_key" ON "session_input_completions" (("session_key") ASC);

CREATE INDEX "idx_agent_session_members_identity" ON "session_members" (("identity_id") ASC, ("session_key") ASC);

CREATE INDEX "idx_agent_session_nodes_active" ON "session_nodes" (("session_key") ASC) WHERE "archived_at" IS NULL;

CREATE INDEX "idx_agent_session_nodes_archived_at" ON "session_nodes" (("archived_at") ASC, ("session_key") ASC) WHERE "archived_at" IS NOT NULL;

CREATE INDEX "idx_agent_session_nodes_current_session_id" ON "session_nodes" (("current_session_id") ASC);

CREATE INDEX "idx_agent_session_nodes_entry_not_valid" ON "session_nodes" (("session_key") ASC) WHERE ("entry_valid" != 1);

CREATE INDEX "idx_agent_session_nodes_entry_valid_pending" ON "session_nodes" (("session_key") ASC) WHERE ("entry_valid" = 0);

CREATE INDEX "idx_agent_session_nodes_label" ON "session_nodes" (("label") ASC, ("session_key") ASC) WHERE "label" IS NOT NULL;

CREATE INDEX "idx_agent_session_nodes_parent_session_key" ON "session_nodes" (("parent_session_key") ASC NULLS FIRST, ("session_key") ASC);

CREATE INDEX "idx_agent_session_nodes_spawned_by" ON "session_nodes" (("spawned_by") ASC NULLS FIRST, ("session_key") ASC);

CREATE INDEX "idx_agent_session_nodes_status" ON "session_nodes" (("status") ASC, ("session_key") ASC) WHERE "status" IS NOT NULL;

CREATE INDEX "idx_agent_session_nodes_updated_at" ON "session_nodes" (("updated_at") DESC, ("session_key") ASC);

CREATE INDEX "idx_agent_session_pending_inputs_session" ON "session_pending_inputs" (("session_key") ASC, ("session_id") ASC, ("seq") DESC);

CREATE INDEX "idx_agent_session_suggestions_author_created" ON "session_suggestions" (("author_id") ASC, ("created_at") ASC, ("id") ASC);

CREATE INDEX "idx_agent_session_suggestions_session_state_created" ON "session_suggestions" (("session_key") ASC, ("state") ASC, ("created_at") ASC, ("id") ASC);

CREATE UNIQUE INDEX "idx_agent_transcript_active_event_seq" ON "session_transcript_active_events" (("session_id") ASC, ("event_seq") ASC);

CREATE UNIQUE INDEX "idx_agent_transcript_active_messages" ON "session_transcript_active_events" (("session_id") ASC, ("message_position") ASC) WHERE "message_position" IS NOT NULL;

CREATE INDEX "idx_agent_transcript_context_pending" ON "session_transcript_active_events" (("session_id") ASC) WHERE "context_eligible" IS NULL;

CREATE INDEX "idx_agent_session_transcript_archives_pending" ON "session_transcript_archives" (("created_at") ASC, ("session_id") ASC, ("generation") ASC) WHERE "published_at" IS NULL;

CREATE INDEX "idx_agent_session_transcript_archives_retention" ON "session_transcript_archives" (("created_at") ASC, ("session_id") ASC, ("generation") ASC);

CREATE INDEX "idx_session_transcript_fts_rows_session_message" ON "session_transcript_fts_rows" (("session_id") ASC, ("message_id") ASC NULLS FIRST);

CREATE INDEX "idx_agent_session_windows_conversation" ON "session_windows" (("primary_conversation_id") ASC) WHERE "primary_conversation_id" IS NOT NULL;

CREATE INDEX "idx_agent_session_windows_created_at" ON "session_windows" (("created_at") DESC, ("session_id") ASC);

CREATE INDEX "idx_agent_session_windows_session_key" ON "session_windows" (("session_key") ASC, ("updated_at") DESC, ("session_id") ASC);

CREATE INDEX "idx_agent_session_windows_updated_at" ON "session_windows" (("updated_at") DESC, ("session_id") ASC);

CREATE INDEX "idx_standing_intents_lifecycle" ON "standing_intents" (("status") ASC, ("expires_at") ASC, ("last_fired_at") ASC NULLS FIRST);

CREATE INDEX "idx_standing_intents_scope" ON "standing_intents" (("status") ASC, ("channel_scope") ASC NULLS FIRST, ("sender_scope") ASC NULLS FIRST);

CREATE INDEX "idx_agent_trajectory_runtime_run" ON "trajectory_runtime_events" (("session_id") ASC, ("run_id") ASC NULLS FIRST, ("created_at") ASC, (coalesce("event_utf8_bytes", octet_length("event_json"))) ASC NULLS FIRST);

CREATE INDEX "idx_agent_transcript_event_identity_sequence" ON "transcript_event_identities" (("session_id") ASC, ("seq") ASC);

CREATE INDEX "idx_agent_transcript_event_sequence" ON "transcript_event_identities" (("session_id") ASC, ("event_type") ASC NULLS FIRST, ("seq") DESC);

CREATE UNIQUE INDEX "idx_agent_transcript_message_idempotency" ON "transcript_event_identities" (("session_id") ASC, ("message_idempotency_key") ASC) WHERE "message_idempotency_key" IS NOT NULL;

CREATE INDEX "idx_memory_index_sources_exact_path" ON "memory_index_sources" ((pg_catalog.md5(pg_catalog.lower(pg_catalog.normalize(pg_catalog.regexp_replace(pg_catalog.replace(pg_catalog.btrim(path), E'\\\\', '/'), '^\\./', ''), 'NFC')))));

CREATE INDEX "idx_memory_index_sources_basename" ON "memory_index_sources" ((pg_catalog.md5(pg_catalog.regexp_replace(pg_catalog.lower(pg_catalog.normalize(pg_catalog.regexp_replace(pg_catalog.replace(pg_catalog.btrim(path), E'\\\\', '/'), '^\\./', ''), 'NFC')), '^.*/', ''))));

CREATE INDEX "idx_memory_index_sources_stem" ON "memory_index_sources" ((pg_catalog.md5(pg_catalog.regexp_replace(pg_catalog.regexp_replace(pg_catalog.lower(pg_catalog.normalize(pg_catalog.regexp_replace(pg_catalog.replace(pg_catalog.btrim(path), E'\\\\', '/'), '^\\./', ''), 'NFC')), '^.*/', ''), '^(.+)\\.[^.]*$', '\\1'))));

ALTER TABLE "acp_parent_stream_events" ADD FOREIGN KEY ("session_id") REFERENCES "session_windows" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "board_tabs" ADD FOREIGN KEY ("session_key") REFERENCES "session_nodes" ("session_key") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "board_widgets" ADD FOREIGN KEY ("session_key", "tab_id") REFERENCES "board_tabs" ("session_key", "tab_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "conversation_deliveries" ADD FOREIGN KEY ("conversation_id") REFERENCES "conversations" ("conversation_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "heartbeat_outcomes" ADD FOREIGN KEY ("session_key") REFERENCES "session_nodes" ("session_key") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "memory_index_chunk_provenance" ADD FOREIGN KEY ("chunk_id") REFERENCES "memory_index_chunks" ("id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "memory_index_chunk_recall_metadata" ADD FOREIGN KEY ("chunk_id") REFERENCES "memory_index_chunks" ("id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_conversations" ADD FOREIGN KEY ("conversation_id") REFERENCES "conversations" ("conversation_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_conversations" ADD FOREIGN KEY ("session_id") REFERENCES "session_windows" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_entry_snapshots" ADD FOREIGN KEY ("session_key") REFERENCES "session_nodes" ("session_key") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_input_completions" ADD FOREIGN KEY ("session_id") REFERENCES "session_windows" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_input_completions" ADD FOREIGN KEY ("session_key") REFERENCES "session_nodes" ("session_key") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_members" ADD FOREIGN KEY ("session_key") REFERENCES "session_nodes" ("session_key") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_participants" ADD FOREIGN KEY ("session_key") REFERENCES "session_nodes" ("session_key") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_pending_inputs" ADD FOREIGN KEY ("session_id") REFERENCES "session_windows" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_pending_inputs" ADD FOREIGN KEY ("session_key") REFERENCES "session_nodes" ("session_key") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_progress_cards" ADD FOREIGN KEY ("session_key") REFERENCES "session_nodes" ("session_key") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_reactions" ADD FOREIGN KEY ("session_key") REFERENCES "session_nodes" ("session_key") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_suggestions" ADD FOREIGN KEY ("session_key") REFERENCES "session_nodes" ("session_key") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_transcript_active_event_facts" ADD FOREIGN KEY ("session_id", "seq") REFERENCES "session_transcript_active_events" ("session_id", "event_seq") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_transcript_active_events" ADD FOREIGN KEY ("session_id", "event_seq") REFERENCES "transcript_events" ("session_id", "seq") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_transcript_cold_archive_chunks" ADD FOREIGN KEY ("session_id") REFERENCES "session_transcript_cold_archives" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_transcript_cold_archives" ADD FOREIGN KEY ("session_id") REFERENCES "session_windows" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_transcript_index_state" ADD FOREIGN KEY ("session_id") REFERENCES "session_windows" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "session_windows" ADD FOREIGN KEY ("primary_conversation_id") REFERENCES "conversations" ("conversation_id") ON UPDATE NO ACTION ON DELETE SET NULL NOT DEFERRABLE;

ALTER TABLE "session_windows" ADD FOREIGN KEY ("session_key") REFERENCES "session_nodes" ("session_key") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "trajectory_runtime_events" ADD FOREIGN KEY ("session_id") REFERENCES "session_windows" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "transcript_event_identities" ADD FOREIGN KEY ("session_id", "seq") REFERENCES "transcript_events" ("session_id", "seq") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "transcript_events" ADD FOREIGN KEY ("session_id") REFERENCES "session_windows" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE "transcript_rewrite_watermarks" ADD FOREIGN KEY ("session_id") REFERENCES "session_windows" ("session_id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE;

CREATE FUNCTION "openclaw_session_conversations_trigger"() RETURNS trigger LANGUAGE plpgsql SET search_path FROM CURRENT AS $trigger$
BEGIN
  UPDATE session_conversations SET route_context_json = NULL WHERE session_id = NEW.session_id AND conversation_id = NEW.conversation_id AND role = NEW.role;
  RETURN NULL;
END;
$trigger$;

CREATE FUNCTION "openclaw_session_entry_snapshots_trigger"() RETURNS trigger LANGUAGE plpgsql SET search_path FROM CURRENT AS $trigger$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1 WHERE session_key = OLD.session_key;
  ELSIF TG_OP = 'INSERT' THEN
    UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1 WHERE session_key = NEW.session_key;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE session_nodes SET snapshot_revision = snapshot_revision + 1 WHERE session_key IN (OLD.session_key, NEW.session_key);
  END IF;
  RETURN NULL;
END;
$trigger$;

CREATE TRIGGER "session_conversations_route_context_invalidate_after_update" AFTER UPDATE OF "role", "last_seen_at" ON "session_conversations" FOR EACH ROW WHEN (NEW.route_context_json IS NOT DISTINCT FROM OLD.route_context_json) EXECUTE FUNCTION "openclaw_session_conversations_trigger"();

CREATE TRIGGER "session_entry_snapshots_after_delete" AFTER DELETE ON "session_entry_snapshots" FOR EACH ROW EXECUTE FUNCTION "openclaw_session_entry_snapshots_trigger"();

CREATE TRIGGER "session_entry_snapshots_after_insert" AFTER INSERT ON "session_entry_snapshots" FOR EACH ROW EXECUTE FUNCTION "openclaw_session_entry_snapshots_trigger"();

CREATE TRIGGER "session_entry_snapshots_after_update" AFTER UPDATE OF "session_key", "field", "value_json" ON "session_entry_snapshots" FOR EACH ROW WHEN (NEW.session_key IS DISTINCT FROM OLD.session_key OR NEW.field IS DISTINCT FROM OLD.field OR NEW.value_json IS DISTINCT FROM OLD.value_json) EXECUTE FUNCTION "openclaw_session_entry_snapshots_trigger"();
`;return Object.defineProperty(this,"sql",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},get expectedCatalog(){let e=[{table:`acp_parent_stream_events`,kind:`table`,value:null},{table:`acp_parent_stream_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`acp_parent_stream_events`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`acp_parent_stream_events`,kind:`column`,value:{name:`seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`acp_parent_stream_events`,kind:`column`,value:{name:`event_json`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`acp_parent_stream_events`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`acp_parent_stream_events`,kind:`primaryKey`,value:[`session_id`,`run_id`,`seq`]},{table:`acp_parent_stream_events`,kind:`foreignKey`,value:{columns:[`session_id`],target:`session_windows`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`acp_parent_stream_events`,kind:`indexes`,value:2},{table:`acp_parent_stream_events`,kind:`checks`,value:0},{table:`agent_tool_usage`,kind:`table`,value:null},{table:`agent_tool_usage`,kind:`column`,value:{name:`tool_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`agent_tool_usage`,kind:`column`,value:{name:`score`,type:`double precision`,nullable:!1,identity:!1,default:null,position:2}},{table:`agent_tool_usage`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`agent_tool_usage`,kind:`primaryKey`,value:[`tool_id`]},{table:`agent_tool_usage`,kind:`indexes`,value:1},{table:`agent_tool_usage`,kind:`checks`,value:1},{table:`auth_profile_state`,kind:`table`,value:null},{table:`auth_profile_state`,kind:`column`,value:{name:`state_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`auth_profile_state`,kind:`column`,value:{name:`state_json`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`auth_profile_state`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`auth_profile_state`,kind:`primaryKey`,value:[`state_key`]},{table:`auth_profile_state`,kind:`indexes`,value:1},{table:`auth_profile_state`,kind:`checks`,value:0},{table:`auth_profile_store`,kind:`table`,value:null},{table:`auth_profile_store`,kind:`column`,value:{name:`store_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`auth_profile_store`,kind:`column`,value:{name:`store_json`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`auth_profile_store`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`auth_profile_store`,kind:`primaryKey`,value:[`store_key`]},{table:`auth_profile_store`,kind:`indexes`,value:1},{table:`auth_profile_store`,kind:`checks`,value:0},{table:`board_tabs`,kind:`table`,value:null},{table:`board_tabs`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`board_tabs`,kind:`column`,value:{name:`tab_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`board_tabs`,kind:`column`,value:{name:`title`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`board_tabs`,kind:`column`,value:{name:`position`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`board_tabs`,kind:`column`,value:{name:`chat_dock`,type:`text`,nullable:!1,identity:!1,default:`'right'`,position:5}},{table:`board_tabs`,kind:`column`,value:{name:`created_by`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`board_tabs`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`board_tabs`,kind:`primaryKey`,value:[`session_key`,`tab_id`]},{table:`board_tabs`,kind:`foreignKey`,value:{columns:[`session_key`],target:`session_nodes`,targetColumns:[`session_key`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`board_tabs`,kind:`indexes`,value:1},{table:`board_tabs`,kind:`checks`,value:4},{table:`board_widgets`,kind:`table`,value:null},{table:`board_widgets`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`board_widgets`,kind:`column`,value:{name:`name`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`board_widgets`,kind:`column`,value:{name:`tab_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`board_widgets`,kind:`column`,value:{name:`title`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`board_widgets`,kind:`column`,value:{name:`content_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`board_widgets`,kind:`column`,value:{name:`html`,type:`bytea`,nullable:!0,identity:!1,default:null,position:6}},{table:`board_widgets`,kind:`column`,value:{name:`descriptor_json`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`board_widgets`,kind:`column`,value:{name:`sha256`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`board_widgets`,kind:`column`,value:{name:`view_generation`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`board_widgets`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`board_widgets`,kind:`column`,value:{name:`size_w`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`board_widgets`,kind:`column`,value:{name:`size_h`,type:`bigint`,nullable:!1,identity:!1,default:null,position:12}},{table:`board_widgets`,kind:`column`,value:{name:`position`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`board_widgets`,kind:`column`,value:{name:`manifest`,type:`text`,nullable:!1,identity:!1,default:`'{}'`,position:14}},{table:`board_widgets`,kind:`column`,value:{name:`grant_state`,type:`text`,nullable:!1,identity:!1,default:`'none'`,position:15}},{table:`board_widgets`,kind:`column`,value:{name:`granted_sha`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`board_widgets`,kind:`column`,value:{name:`created_by`,type:`text`,nullable:!1,identity:!1,default:null,position:17}},{table:`board_widgets`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:18}},{table:`board_widgets`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:19}},{table:`board_widgets`,kind:`primaryKey`,value:[`session_key`,`name`]},{table:`board_widgets`,kind:`foreignKey`,value:{columns:[`session_key`,`tab_id`],target:`board_tabs`,targetColumns:[`session_key`,`tab_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`board_widgets`,kind:`indexes`,value:2},{table:`board_widgets`,kind:`checks`,value:8},{table:`cache_entries`,kind:`table`,value:null},{table:`cache_entries`,kind:`column`,value:{name:`scope`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`cache_entries`,kind:`column`,value:{name:`key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`cache_entries`,kind:`column`,value:{name:`value_json`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`cache_entries`,kind:`column`,value:{name:`blob`,type:`bytea`,nullable:!0,identity:!1,default:null,position:4}},{table:`cache_entries`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:5}},{table:`cache_entries`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`cache_entries`,kind:`primaryKey`,value:[`scope`,`key`]},{table:`cache_entries`,kind:`indexes`,value:5},{table:`cache_entries`,kind:`checks`,value:0},{table:`context_engine_turn_outbox`,kind:`table`,value:null},{table:`context_engine_turn_outbox`,kind:`column`,value:{name:`enqueue_sequence`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`context_engine_turn_outbox`,kind:`column`,value:{name:`advancement_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`context_engine_turn_outbox`,kind:`column`,value:{name:`engine_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`context_engine_turn_outbox`,kind:`column`,value:{name:`owner_plugin_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`context_engine_turn_outbox`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`context_engine_turn_outbox`,kind:`column`,value:{name:`payload_json`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`context_engine_turn_outbox`,kind:`column`,value:{name:`payload_state`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`context_engine_turn_outbox`,kind:`column`,value:{name:`attempt_count`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:8}},{table:`context_engine_turn_outbox`,kind:`column`,value:{name:`last_attempt_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`context_engine_turn_outbox`,kind:`column`,value:{name:`last_error`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`context_engine_turn_outbox`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`context_engine_turn_outbox`,kind:`primaryKey`,value:[`enqueue_sequence`]},{table:`context_engine_turn_outbox`,kind:`unique`,value:[`advancement_key`]},{table:`context_engine_turn_outbox`,kind:`indexes`,value:3},{table:`context_engine_turn_outbox`,kind:`checks`,value:0},{table:`conversation_deliveries`,kind:`table`,value:null},{table:`conversation_deliveries`,kind:`column`,value:{name:`operation_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`conversation_deliveries`,kind:`column`,value:{name:`operation_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`conversation_deliveries`,kind:`column`,value:{name:`conversation_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`conversation_deliveries`,kind:`column`,value:{name:`source_session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`conversation_deliveries`,kind:`column`,value:{name:`message_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`conversation_deliveries`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`conversation_deliveries`,kind:`column`,value:{name:`prepared_message_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`conversation_deliveries`,kind:`column`,value:{name:`platform_message_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`conversation_deliveries`,kind:`column`,value:{name:`queue_id`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`conversation_deliveries`,kind:`column`,value:{name:`rejection_error`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`conversation_deliveries`,kind:`column`,value:{name:`reply_message_id`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`conversation_deliveries`,kind:`column`,value:{name:`reply_to_id`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`conversation_deliveries`,kind:`column`,value:{name:`reply_thread_id`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`conversation_deliveries`,kind:`column`,value:{name:`reply_text`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`conversation_deliveries`,kind:`column`,value:{name:`reply_timestamp`,type:`bigint`,nullable:!0,identity:!1,default:null,position:15}},{table:`conversation_deliveries`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:16}},{table:`conversation_deliveries`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:17}},{table:`conversation_deliveries`,kind:`primaryKey`,value:[`operation_id`]},{table:`conversation_deliveries`,kind:`foreignKey`,value:{columns:[`conversation_id`],target:`conversations`,targetColumns:[`conversation_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`conversation_deliveries`,kind:`indexes`,value:4},{table:`conversation_deliveries`,kind:`checks`,value:3},{table:`conversations`,kind:`table`,value:null},{table:`conversations`,kind:`column`,value:{name:`conversation_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`conversations`,kind:`column`,value:{name:`channel`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`conversations`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`conversations`,kind:`column`,value:{name:`kind`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`conversations`,kind:`column`,value:{name:`peer_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`conversations`,kind:`column`,value:{name:`delivery_target`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`conversations`,kind:`column`,value:{name:`parent_conversation_id`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`conversations`,kind:`column`,value:{name:`thread_id`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`conversations`,kind:`column`,value:{name:`native_channel_id`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`conversations`,kind:`column`,value:{name:`native_direct_user_id`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`conversations`,kind:`column`,value:{name:`label`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`conversations`,kind:`column`,value:{name:`metadata_json`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`conversations`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:13}},{table:`conversations`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:14}},{table:`conversations`,kind:`primaryKey`,value:[`conversation_id`]},{table:`conversations`,kind:`indexes`,value:4},{table:`conversations`,kind:`checks`,value:1},{table:`heartbeat_outcomes`,kind:`table`,value:null},{table:`heartbeat_outcomes`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`heartbeat_outcomes`,kind:`column`,value:{name:`run_session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`heartbeat_outcomes`,kind:`column`,value:{name:`outcome`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`heartbeat_outcomes`,kind:`column`,value:{name:`summary`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`heartbeat_outcomes`,kind:`column`,value:{name:`response_reason`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`heartbeat_outcomes`,kind:`column`,value:{name:`priority`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`heartbeat_outcomes`,kind:`column`,value:{name:`next_check`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`heartbeat_outcomes`,kind:`column`,value:{name:`task_names_json`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`heartbeat_outcomes`,kind:`column`,value:{name:`wake_source`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`heartbeat_outcomes`,kind:`column`,value:{name:`wake_reason`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`heartbeat_outcomes`,kind:`column`,value:{name:`occurred_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`heartbeat_outcomes`,kind:`column`,value:{name:`context_run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`heartbeat_outcomes`,kind:`column`,value:{name:`context_claimed_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:13}},{table:`heartbeat_outcomes`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:14}},{table:`heartbeat_outcomes`,kind:`primaryKey`,value:[`session_key`]},{table:`heartbeat_outcomes`,kind:`foreignKey`,value:{columns:[`session_key`],target:`session_nodes`,targetColumns:[`session_key`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`heartbeat_outcomes`,kind:`indexes`,value:1},{table:`heartbeat_outcomes`,kind:`checks`,value:2},{table:`memory_embedding_cache`,kind:`table`,value:null},{table:`memory_embedding_cache`,kind:`column`,value:{name:`provider`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`memory_embedding_cache`,kind:`column`,value:{name:`model`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`memory_embedding_cache`,kind:`column`,value:{name:`provider_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`memory_embedding_cache`,kind:`column`,value:{name:`hash`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`memory_embedding_cache`,kind:`column`,value:{name:`embedding`,type:`bytea`,nullable:!1,identity:!1,default:null,position:5}},{table:`memory_embedding_cache`,kind:`column`,value:{name:`dims`,type:`bigint`,nullable:!0,identity:!1,default:null,position:6}},{table:`memory_embedding_cache`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`memory_embedding_cache`,kind:`primaryKey`,value:[`provider`,`model`,`provider_key`,`hash`]},{table:`memory_embedding_cache`,kind:`indexes`,value:2},{table:`memory_embedding_cache`,kind:`checks`,value:0},{table:`memory_entry_origins`,kind:`table`,value:null},{table:`memory_entry_origins`,kind:`column`,value:{name:`entry_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`memory_entry_origins`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`memory_entry_origins`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`memory_entry_origins`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`memory_entry_origins`,kind:`column`,value:{name:`origin_class`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`memory_entry_origins`,kind:`column`,value:{name:`observed_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`memory_entry_origins`,kind:`primaryKey`,value:[`entry_key`,`agent_id`,`session_id`]},{table:`memory_entry_origins`,kind:`indexes`,value:1},{table:`memory_entry_origins`,kind:`checks`,value:1},{table:`memory_index_chunk_provenance`,kind:`table`,value:null},{table:`memory_index_chunk_provenance`,kind:`column`,value:{name:`chunk_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`memory_index_chunk_provenance`,kind:`column`,value:{name:`origin_class`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`memory_index_chunk_provenance`,kind:`column`,value:{name:`session_kind`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`memory_index_chunk_provenance`,kind:`column`,value:{name:`observed_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`memory_index_chunk_provenance`,kind:`column`,value:{name:`supersedes_key`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`memory_index_chunk_provenance`,kind:`primaryKey`,value:[`chunk_id`]},{table:`memory_index_chunk_provenance`,kind:`foreignKey`,value:{columns:[`chunk_id`],target:`memory_index_chunks`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`memory_index_chunk_provenance`,kind:`indexes`,value:1},{table:`memory_index_chunk_provenance`,kind:`checks`,value:2},{table:`memory_index_chunk_recall_metadata`,kind:`table`,value:null},{table:`memory_index_chunk_recall_metadata`,kind:`column`,value:{name:`chunk_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`memory_index_chunk_recall_metadata`,kind:`column`,value:{name:`importance`,type:`bigint`,nullable:!0,identity:!1,default:null,position:2}},{table:`memory_index_chunk_recall_metadata`,kind:`column`,value:{name:`triggers`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`memory_index_chunk_recall_metadata`,kind:`column`,value:{name:`project_key`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`memory_index_chunk_recall_metadata`,kind:`primaryKey`,value:[`chunk_id`]},{table:`memory_index_chunk_recall_metadata`,kind:`foreignKey`,value:{columns:[`chunk_id`],target:`memory_index_chunks`,targetColumns:[`id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`memory_index_chunk_recall_metadata`,kind:`indexes`,value:1},{table:`memory_index_chunk_recall_metadata`,kind:`checks`,value:1},{table:`memory_index_chunks`,kind:`table`,value:null},{table:`memory_index_chunks`,kind:`column`,value:{name:`chunk_rowid`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`memory_index_chunks`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`memory_index_chunks`,kind:`column`,value:{name:`path`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`memory_index_chunks`,kind:`column`,value:{name:`source`,type:`text`,nullable:!1,identity:!1,default:`'memory'`,position:4}},{table:`memory_index_chunks`,kind:`column`,value:{name:`start_line`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`memory_index_chunks`,kind:`column`,value:{name:`end_line`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`memory_index_chunks`,kind:`column`,value:{name:`hash`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`memory_index_chunks`,kind:`column`,value:{name:`model`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`memory_index_chunks`,kind:`column`,value:{name:`text`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`memory_index_chunks`,kind:`column`,value:{name:`embedding`,type:`bytea`,nullable:!1,identity:!1,default:null,position:10}},{table:`memory_index_chunks`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`memory_index_chunks`,kind:`primaryKey`,value:[`chunk_rowid`]},{table:`memory_index_chunks`,kind:`unique`,value:[`id`]},{table:`memory_index_chunks`,kind:`indexes`,value:4},{table:`memory_index_chunks`,kind:`checks`,value:0},{table:`memory_index_meta`,kind:`table`,value:null},{table:`memory_index_meta`,kind:`column`,value:{name:`key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`memory_index_meta`,kind:`column`,value:{name:`value`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`memory_index_meta`,kind:`primaryKey`,value:[`key`]},{table:`memory_index_meta`,kind:`indexes`,value:1},{table:`memory_index_meta`,kind:`checks`,value:0},{table:`memory_index_sources`,kind:`table`,value:null},{table:`memory_index_sources`,kind:`column`,value:{name:`id`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`memory_index_sources`,kind:`column`,value:{name:`path`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`memory_index_sources`,kind:`column`,value:{name:`source`,type:`text`,nullable:!1,identity:!1,default:`'memory'`,position:3}},{table:`memory_index_sources`,kind:`column`,value:{name:`hash`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`memory_index_sources`,kind:`column`,value:{name:`mtime`,type:`double precision`,nullable:!1,identity:!1,default:null,position:5}},{table:`memory_index_sources`,kind:`column`,value:{name:`size`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`memory_index_sources`,kind:`primaryKey`,value:[`id`]},{table:`memory_index_sources`,kind:`unique`,value:[`path`,`source`]},{table:`memory_index_sources`,kind:`indexes`,value:6},{table:`memory_index_sources`,kind:`checks`,value:0},{table:`memory_index_state`,kind:`table`,value:null},{table:`memory_index_state`,kind:`column`,value:{name:`id`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`memory_index_state`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`memory_index_state`,kind:`primaryKey`,value:[`id`]},{table:`memory_index_state`,kind:`indexes`,value:1},{table:`memory_index_state`,kind:`checks`,value:1},{table:`memory_session_tombstones`,kind:`table`,value:null},{table:`memory_session_tombstones`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`memory_session_tombstones`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`memory_session_tombstones`,kind:`column`,value:{name:`reason`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`memory_session_tombstones`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`memory_session_tombstones`,kind:`primaryKey`,value:[`session_id`]},{table:`memory_session_tombstones`,kind:`indexes`,value:1},{table:`memory_session_tombstones`,kind:`checks`,value:0},{table:`message_tool_run_outcomes`,kind:`table`,value:null},{table:`message_tool_run_outcomes`,kind:`column`,value:{name:`id`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`message_tool_run_outcomes`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`message_tool_run_outcomes`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`message_tool_run_outcomes`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`message_tool_run_outcomes`,kind:`column`,value:{name:`provider`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`message_tool_run_outcomes`,kind:`column`,value:{name:`model`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`message_tool_run_outcomes`,kind:`column`,value:{name:`outcome`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`message_tool_run_outcomes`,kind:`column`,value:{name:`run_status`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`message_tool_run_outcomes`,kind:`column`,value:{name:`occurred_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`message_tool_run_outcomes`,kind:`primaryKey`,value:[`id`]},{table:`message_tool_run_outcomes`,kind:`indexes`,value:2},{table:`message_tool_run_outcomes`,kind:`checks`,value:2},{table:`schema_meta`,kind:`table`,value:null},{table:`schema_meta`,kind:`column`,value:{name:`meta_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`schema_meta`,kind:`column`,value:{name:`role`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`schema_meta`,kind:`column`,value:{name:`schema_version`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`schema_meta`,kind:`column`,value:{name:`agent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`schema_meta`,kind:`column`,value:{name:`app_version`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`schema_meta`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`schema_meta`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`schema_meta`,kind:`primaryKey`,value:[`meta_key`]},{table:`schema_meta`,kind:`indexes`,value:1},{table:`schema_meta`,kind:`checks`,value:0},{table:`session_canonical_validation_pending`,kind:`table`,value:null},{table:`session_canonical_validation_pending`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_canonical_validation_pending`,kind:`primaryKey`,value:[`session_key`]},{table:`session_canonical_validation_pending`,kind:`indexes`,value:1},{table:`session_canonical_validation_pending`,kind:`checks`,value:0},{table:`session_conversations`,kind:`table`,value:null},{table:`session_conversations`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_conversations`,kind:`column`,value:{name:`conversation_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_conversations`,kind:`column`,value:{name:`role`,type:`text`,nullable:!1,identity:!1,default:`'primary'`,position:3}},{table:`session_conversations`,kind:`column`,value:{name:`route_context_json`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`session_conversations`,kind:`column`,value:{name:`first_seen_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_conversations`,kind:`column`,value:{name:`last_seen_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`session_conversations`,kind:`primaryKey`,value:[`session_id`,`conversation_id`,`role`]},{table:`session_conversations`,kind:`foreignKey`,value:{columns:[`conversation_id`],target:`conversations`,targetColumns:[`conversation_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_conversations`,kind:`foreignKey`,value:{columns:[`session_id`],target:`session_windows`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_conversations`,kind:`indexes`,value:3},{table:`session_conversations`,kind:`checks`,value:1},{table:`session_creation_operations`,kind:`table`,value:null},{table:`session_creation_operations`,kind:`column`,value:{name:`operation_digest`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_creation_operations`,kind:`column`,value:{name:`request_fingerprint`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_creation_operations`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_creation_operations`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_creation_operations`,kind:`column`,value:{name:`lifecycle_revision`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`session_creation_operations`,kind:`column`,value:{name:`role`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`session_creation_operations`,kind:`column`,value:{name:`scopes_json`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`session_creation_operations`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`session_creation_operations`,kind:`primaryKey`,value:[`operation_digest`]},{table:`session_creation_operations`,kind:`indexes`,value:2},{table:`session_creation_operations`,kind:`checks`,value:0},{table:`session_entry_snapshots`,kind:`table`,value:null},{table:`session_entry_snapshots`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_entry_snapshots`,kind:`column`,value:{name:`field`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_entry_snapshots`,kind:`column`,value:{name:`value_json`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_entry_snapshots`,kind:`primaryKey`,value:[`session_key`,`field`]},{table:`session_entry_snapshots`,kind:`foreignKey`,value:{columns:[`session_key`],target:`session_nodes`,targetColumns:[`session_key`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_entry_snapshots`,kind:`indexes`,value:1},{table:`session_entry_snapshots`,kind:`checks`,value:1},{table:`session_goal_operations`,kind:`table`,value:null},{table:`session_goal_operations`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_goal_operations`,kind:`column`,value:{name:`operation_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_goal_operations`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_goal_operations`,kind:`column`,value:{name:`request_fingerprint`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_goal_operations`,kind:`column`,value:{name:`result_json`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_goal_operations`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`session_goal_operations`,kind:`primaryKey`,value:[`session_key`,`operation_id`]},{table:`session_goal_operations`,kind:`indexes`,value:2},{table:`session_goal_operations`,kind:`checks`,value:0},{table:`session_input_completions`,kind:`table`,value:null},{table:`session_input_completions`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_input_completions`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_input_completions`,kind:`column`,value:{name:`idempotency_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_input_completions`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_input_completions`,kind:`column`,value:{name:`request_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_input_completions`,kind:`column`,value:{name:`outcome_json`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`session_input_completions`,kind:`column`,value:{name:`succeeded`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`session_input_completions`,kind:`column`,value:{name:`completed_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`session_input_completions`,kind:`primaryKey`,value:[`session_id`,`idempotency_key`]},{table:`session_input_completions`,kind:`foreignKey`,value:{columns:[`session_id`],target:`session_windows`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_input_completions`,kind:`foreignKey`,value:{columns:[`session_key`],target:`session_nodes`,targetColumns:[`session_key`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_input_completions`,kind:`indexes`,value:2},{table:`session_input_completions`,kind:`checks`,value:1},{table:`session_key_contract`,kind:`table`,value:null},{table:`session_key_contract`,kind:`column`,value:{name:`id`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`session_key_contract`,kind:`column`,value:{name:`main_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_key_contract`,kind:`column`,value:{name:`canonical_ready`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`session_key_contract`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_key_contract`,kind:`primaryKey`,value:[`id`]},{table:`session_key_contract`,kind:`indexes`,value:1},{table:`session_key_contract`,kind:`checks`,value:1},{table:`session_members`,kind:`table`,value:null},{table:`session_members`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_members`,kind:`column`,value:{name:`identity_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_members`,kind:`column`,value:{name:`added_by`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_members`,kind:`column`,value:{name:`added_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_members`,kind:`primaryKey`,value:[`session_key`,`identity_id`]},{table:`session_members`,kind:`foreignKey`,value:{columns:[`session_key`],target:`session_nodes`,targetColumns:[`session_key`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_members`,kind:`indexes`,value:2},{table:`session_members`,kind:`checks`,value:0},{table:`session_nodes`,kind:`table`,value:null},{table:`session_nodes`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_nodes`,kind:`column`,value:{name:`current_session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_nodes`,kind:`column`,value:{name:`entry_json`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_nodes`,kind:`column`,value:{name:`session_started_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:4}},{table:`session_nodes`,kind:`column`,value:{name:`has_optional_references`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:5}},{table:`session_nodes`,kind:`column`,value:{name:`snapshot_revision`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:6}},{table:`session_nodes`,kind:`column`,value:{name:`legacy_acp_migration_json`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`session_nodes`,kind:`column`,value:{name:`entry_valid`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:8}},{table:`session_nodes`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`session_nodes`,kind:`column`,value:{name:`status`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`session_nodes`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:11}},{table:`session_nodes`,kind:`column`,value:{name:`created_via`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`session_nodes`,kind:`column`,value:{name:`created_actor_type`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`session_nodes`,kind:`column`,value:{name:`created_actor_id`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`session_nodes`,kind:`column`,value:{name:`owner_actor_type`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`session_nodes`,kind:`column`,value:{name:`owner_actor_id`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`session_nodes`,kind:`column`,value:{name:`owner_assigned_by_type`,type:`text`,nullable:!0,identity:!1,default:null,position:17}},{table:`session_nodes`,kind:`column`,value:{name:`owner_assigned_by_id`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`session_nodes`,kind:`column`,value:{name:`owner_assigned_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:19}},{table:`session_nodes`,kind:`column`,value:{name:`project_id`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`session_nodes`,kind:`column`,value:{name:`parent_session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:21}},{table:`session_nodes`,kind:`column`,value:{name:`spawned_by`,type:`text`,nullable:!0,identity:!1,default:null,position:22}},{table:`session_nodes`,kind:`column`,value:{name:`fork_source_session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:23}},{table:`session_nodes`,kind:`column`,value:{name:`fork_source_session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:24}},{table:`session_nodes`,kind:`column`,value:{name:`fork_source_entry_id`,type:`text`,nullable:!0,identity:!1,default:null,position:25}},{table:`session_nodes`,kind:`column`,value:{name:`label`,type:`text`,nullable:!0,identity:!1,default:null,position:26}},{table:`session_nodes`,kind:`column`,value:{name:`display_name`,type:`text`,nullable:!0,identity:!1,default:null,position:27}},{table:`session_nodes`,kind:`column`,value:{name:`category`,type:`text`,nullable:!0,identity:!1,default:null,position:28}},{table:`session_nodes`,kind:`column`,value:{name:`icon`,type:`text`,nullable:!0,identity:!1,default:null,position:29}},{table:`session_nodes`,kind:`column`,value:{name:`pinned_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:30}},{table:`session_nodes`,kind:`column`,value:{name:`archived_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:31}},{table:`session_nodes`,kind:`column`,value:{name:`last_read_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:32}},{table:`session_nodes`,kind:`column`,value:{name:`last_interaction_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:33}},{table:`session_nodes`,kind:`column`,value:{name:`last_activity_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:34}},{table:`session_nodes`,kind:`primaryKey`,value:[`session_key`]},{table:`session_nodes`,kind:`indexes`,value:11},{table:`session_nodes`,kind:`checks`,value:4},{table:`session_participants`,kind:`table`,value:null},{table:`session_participants`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_participants`,kind:`column`,value:{name:`identity_namespace`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_participants`,kind:`column`,value:{name:`actor_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_participants`,kind:`column`,value:{name:`contribution_count`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_participants`,kind:`column`,value:{name:`first_prompted_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:5}},{table:`session_participants`,kind:`column`,value:{name:`last_prompted_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:6}},{table:`session_participants`,kind:`primaryKey`,value:[`session_key`,`identity_namespace`,`actor_id`]},{table:`session_participants`,kind:`foreignKey`,value:{columns:[`session_key`],target:`session_nodes`,targetColumns:[`session_key`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_participants`,kind:`indexes`,value:1},{table:`session_participants`,kind:`checks`,value:0},{table:`session_pending_inputs`,kind:`table`,value:null},{table:`session_pending_inputs`,kind:`column`,value:{name:`seq`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`session_pending_inputs`,kind:`column`,value:{name:`input_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_pending_inputs`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_pending_inputs`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_pending_inputs`,kind:`column`,value:{name:`idempotency_key`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_pending_inputs`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!1,identity:!1,default:null,position:6}},{table:`session_pending_inputs`,kind:`column`,value:{name:`request_hash`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`session_pending_inputs`,kind:`column`,value:{name:`message_json`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`session_pending_inputs`,kind:`column`,value:{name:`lifecycle_generation`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`session_pending_inputs`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`session_pending_inputs`,kind:`column`,value:{name:`accepted_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`session_pending_inputs`,kind:`column`,value:{name:`consumed_event_id`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`session_pending_inputs`,kind:`primaryKey`,value:[`seq`]},{table:`session_pending_inputs`,kind:`unique`,value:[`input_id`]},{table:`session_pending_inputs`,kind:`unique`,value:[`session_id`,`idempotency_key`]},{table:`session_pending_inputs`,kind:`foreignKey`,value:{columns:[`session_id`],target:`session_windows`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_pending_inputs`,kind:`foreignKey`,value:{columns:[`session_key`],target:`session_nodes`,targetColumns:[`session_key`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_pending_inputs`,kind:`indexes`,value:4},{table:`session_pending_inputs`,kind:`checks`,value:1},{table:`session_progress_cards`,kind:`table`,value:null},{table:`session_progress_cards`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_progress_cards`,kind:`column`,value:{name:`markdown`,type:`text`,nullable:!0,identity:!1,default:null,position:2}},{table:`session_progress_cards`,kind:`column`,value:{name:`steps_json`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`session_progress_cards`,kind:`column`,value:{name:`revision`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_progress_cards`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_progress_cards`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`session_progress_cards`,kind:`primaryKey`,value:[`session_key`]},{table:`session_progress_cards`,kind:`foreignKey`,value:{columns:[`session_key`],target:`session_nodes`,targetColumns:[`session_key`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_progress_cards`,kind:`indexes`,value:1},{table:`session_progress_cards`,kind:`checks`,value:0},{table:`session_reactions`,kind:`table`,value:null},{table:`session_reactions`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_reactions`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_reactions`,kind:`column`,value:{name:`message_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_reactions`,kind:`column`,value:{name:`emoji`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_reactions`,kind:`column`,value:{name:`identity_id`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_reactions`,kind:`column`,value:{name:`identity_label`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`session_reactions`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`session_reactions`,kind:`primaryKey`,value:[`session_key`,`session_id`,`message_id`,`emoji`,`identity_id`]},{table:`session_reactions`,kind:`foreignKey`,value:{columns:[`session_key`],target:`session_nodes`,targetColumns:[`session_key`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_reactions`,kind:`indexes`,value:1},{table:`session_reactions`,kind:`checks`,value:0},{table:`session_suggestions`,kind:`table`,value:null},{table:`session_suggestions`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_suggestions`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_suggestions`,kind:`column`,value:{name:`author_id`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_suggestions`,kind:`column`,value:{name:`author_label`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`session_suggestions`,kind:`column`,value:{name:`text`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_suggestions`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`session_suggestions`,kind:`column`,value:{name:`state`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`session_suggestions`,kind:`column`,value:{name:`dispatch_token`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`session_suggestions`,kind:`column`,value:{name:`dispatch_started_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:9}},{table:`session_suggestions`,kind:`column`,value:{name:`dispatch_resolution`,type:`text`,nullable:!0,identity:!1,default:null,position:10}},{table:`session_suggestions`,kind:`primaryKey`,value:[`id`]},{table:`session_suggestions`,kind:`foreignKey`,value:{columns:[`session_key`],target:`session_nodes`,targetColumns:[`session_key`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_suggestions`,kind:`indexes`,value:3},{table:`session_suggestions`,kind:`checks`,value:3},{table:`session_transcript_active_event_facts`,kind:`table`,value:null},{table:`session_transcript_active_event_facts`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_transcript_active_event_facts`,kind:`column`,value:{name:`seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_transcript_active_event_facts`,kind:`column`,value:{name:`serialized_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_transcript_active_event_facts`,kind:`column`,value:{name:`dependency_navigation_json`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_transcript_active_event_facts`,kind:`primaryKey`,value:[`session_id`,`seq`]},{table:`session_transcript_active_event_facts`,kind:`foreignKey`,value:{columns:[`session_id`,`seq`],target:`session_transcript_active_events`,targetColumns:[`session_id`,`event_seq`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_transcript_active_event_facts`,kind:`indexes`,value:1},{table:`session_transcript_active_event_facts`,kind:`checks`,value:1},{table:`session_transcript_active_events`,kind:`table`,value:null},{table:`session_transcript_active_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_transcript_active_events`,kind:`column`,value:{name:`active_position`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_transcript_active_events`,kind:`column`,value:{name:`event_seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_transcript_active_events`,kind:`column`,value:{name:`message_position`,type:`bigint`,nullable:!0,identity:!1,default:null,position:4}},{table:`session_transcript_active_events`,kind:`column`,value:{name:`context_eligible`,type:`bigint`,nullable:!0,identity:!1,default:null,position:5}},{table:`session_transcript_active_events`,kind:`primaryKey`,value:[`session_id`,`active_position`]},{table:`session_transcript_active_events`,kind:`foreignKey`,value:{columns:[`session_id`,`event_seq`],target:`transcript_events`,targetColumns:[`session_id`,`seq`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_transcript_active_events`,kind:`indexes`,value:4},{table:`session_transcript_active_events`,kind:`checks`,value:2},{table:`session_transcript_archives`,kind:`table`,value:null},{table:`session_transcript_archives`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_transcript_archives`,kind:`column`,value:{name:`generation`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_transcript_archives`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_transcript_archives`,kind:`column`,value:{name:`reason`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_transcript_archives`,kind:`column`,value:{name:`encoding`,type:`text`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_transcript_archives`,kind:`column`,value:{name:`archive_blob`,type:`bytea`,nullable:!1,identity:!1,default:null,position:6}},{table:`session_transcript_archives`,kind:`column`,value:{name:`archive_sha256`,type:`text`,nullable:!1,identity:!1,default:null,position:7}},{table:`session_transcript_archives`,kind:`column`,value:{name:`archive_name`,type:`text`,nullable:!1,identity:!1,default:null,position:8}},{table:`session_transcript_archives`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`session_transcript_archives`,kind:`column`,value:{name:`published_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:10}},{table:`session_transcript_archives`,kind:`column`,value:{name:`publish_attempts`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:11}},{table:`session_transcript_archives`,kind:`column`,value:{name:`last_publish_attempt_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:12}},{table:`session_transcript_archives`,kind:`column`,value:{name:`last_publish_error`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`session_transcript_archives`,kind:`primaryKey`,value:[`session_id`,`generation`]},{table:`session_transcript_archives`,kind:`unique`,value:[`archive_name`]},{table:`session_transcript_archives`,kind:`indexes`,value:4},{table:`session_transcript_archives`,kind:`checks`,value:5},{table:`session_transcript_cold_archive_chunks`,kind:`table`,value:null},{table:`session_transcript_cold_archive_chunks`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_transcript_cold_archive_chunks`,kind:`column`,value:{name:`chunk_index`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_transcript_cold_archive_chunks`,kind:`column`,value:{name:`archive_name`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_transcript_cold_archive_chunks`,kind:`column`,value:{name:`archive_sha256`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_transcript_cold_archive_chunks`,kind:`column`,value:{name:`first_seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_transcript_cold_archive_chunks`,kind:`column`,value:{name:`last_seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`session_transcript_cold_archive_chunks`,kind:`column`,value:{name:`event_count`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`session_transcript_cold_archive_chunks`,kind:`column`,value:{name:`raw_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`session_transcript_cold_archive_chunks`,kind:`column`,value:{name:`archive_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`session_transcript_cold_archive_chunks`,kind:`column`,value:{name:`archive_blob`,type:`bytea`,nullable:!0,identity:!1,default:null,position:10}},{table:`session_transcript_cold_archive_chunks`,kind:`primaryKey`,value:[`session_id`,`chunk_index`]},{table:`session_transcript_cold_archive_chunks`,kind:`unique`,value:[`archive_name`]},{table:`session_transcript_cold_archive_chunks`,kind:`foreignKey`,value:{columns:[`session_id`],target:`session_transcript_cold_archives`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_transcript_cold_archive_chunks`,kind:`indexes`,value:2},{table:`session_transcript_cold_archive_chunks`,kind:`checks`,value:7},{table:`session_transcript_cold_archives`,kind:`table`,value:null},{table:`session_transcript_cold_archives`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_transcript_cold_archives`,kind:`column`,value:{name:`generation`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_transcript_cold_archives`,kind:`column`,value:{name:`archive_name`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`session_transcript_cold_archives`,kind:`column`,value:{name:`archive_sha256`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`session_transcript_cold_archives`,kind:`column`,value:{name:`event_count`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`session_transcript_cold_archives`,kind:`column`,value:{name:`raw_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`session_transcript_cold_archives`,kind:`column`,value:{name:`archive_bytes`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`session_transcript_cold_archives`,kind:`column`,value:{name:`last_seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:8}},{table:`session_transcript_cold_archives`,kind:`column`,value:{name:`archived_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:9}},{table:`session_transcript_cold_archives`,kind:`column`,value:{name:`storage`,type:`text`,nullable:!1,identity:!1,default:null,position:10}},{table:`session_transcript_cold_archives`,kind:`column`,value:{name:`archive_blob`,type:`bytea`,nullable:!0,identity:!1,default:null,position:11}},{table:`session_transcript_cold_archives`,kind:`primaryKey`,value:[`session_id`]},{table:`session_transcript_cold_archives`,kind:`unique`,value:[`archive_name`]},{table:`session_transcript_cold_archives`,kind:`foreignKey`,value:{columns:[`session_id`],target:`session_windows`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_transcript_cold_archives`,kind:`indexes`,value:2},{table:`session_transcript_cold_archives`,kind:`checks`,value:7},{table:`session_transcript_fts_rows`,kind:`table`,value:null},{table:`session_transcript_fts_rows`,kind:`column`,value:{name:`id`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`session_transcript_fts_rows`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_transcript_fts_rows`,kind:`column`,value:{name:`message_id`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`session_transcript_fts_rows`,kind:`primaryKey`,value:[`id`]},{table:`session_transcript_fts_rows`,kind:`indexes`,value:2},{table:`session_transcript_fts_rows`,kind:`checks`,value:0},{table:`session_transcript_index_state`,kind:`table`,value:null},{table:`session_transcript_index_state`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_transcript_index_state`,kind:`column`,value:{name:`indexed_seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_transcript_index_state`,kind:`column`,value:{name:`leaf_event_id`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`session_transcript_index_state`,kind:`column`,value:{name:`needs_rebuild`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:4}},{table:`session_transcript_index_state`,kind:`column`,value:{name:`active_event_count`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:5}},{table:`session_transcript_index_state`,kind:`column`,value:{name:`active_message_count`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:6}},{table:`session_transcript_index_state`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`session_transcript_index_state`,kind:`primaryKey`,value:[`session_id`]},{table:`session_transcript_index_state`,kind:`foreignKey`,value:{columns:[`session_id`],target:`session_windows`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_transcript_index_state`,kind:`indexes`,value:1},{table:`session_transcript_index_state`,kind:`checks`,value:0},{table:`session_windows`,kind:`table`,value:null},{table:`session_windows`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`session_windows`,kind:`column`,value:{name:`session_key`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`session_windows`,kind:`column`,value:{name:`previous_session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`session_windows`,kind:`column`,value:{name:`reason`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`session_windows`,kind:`column`,value:{name:`session_scope`,type:`text`,nullable:!1,identity:!1,default:`'conversation'`,position:5}},{table:`session_windows`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:6}},{table:`session_windows`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`session_windows`,kind:`column`,value:{name:`transcript_updated_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:8}},{table:`session_windows`,kind:`column`,value:{name:`row_transcript_json`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`session_windows`,kind:`column`,value:{name:`row_transcript_updated_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:10}},{table:`session_windows`,kind:`column`,value:{name:`transcript_observed_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:11}},{table:`session_windows`,kind:`column`,value:{name:`session_entry_provenance`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:12}},{table:`session_windows`,kind:`column`,value:{name:`acp_owned`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:13}},{table:`session_windows`,kind:`column`,value:{name:`plugin_owner_id`,type:`text`,nullable:!0,identity:!1,default:null,position:14}},{table:`session_windows`,kind:`column`,value:{name:`hook_external_content_source`,type:`text`,nullable:!0,identity:!1,default:null,position:15}},{table:`session_windows`,kind:`column`,value:{name:`started_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:16}},{table:`session_windows`,kind:`column`,value:{name:`ended_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:17}},{table:`session_windows`,kind:`column`,value:{name:`status`,type:`text`,nullable:!0,identity:!1,default:null,position:18}},{table:`session_windows`,kind:`column`,value:{name:`chat_type`,type:`text`,nullable:!0,identity:!1,default:null,position:19}},{table:`session_windows`,kind:`column`,value:{name:`channel`,type:`text`,nullable:!0,identity:!1,default:null,position:20}},{table:`session_windows`,kind:`column`,value:{name:`account_id`,type:`text`,nullable:!0,identity:!1,default:null,position:21}},{table:`session_windows`,kind:`column`,value:{name:`primary_conversation_id`,type:`text`,nullable:!0,identity:!1,default:null,position:22}},{table:`session_windows`,kind:`column`,value:{name:`model_provider`,type:`text`,nullable:!0,identity:!1,default:null,position:23}},{table:`session_windows`,kind:`column`,value:{name:`model`,type:`text`,nullable:!0,identity:!1,default:null,position:24}},{table:`session_windows`,kind:`column`,value:{name:`agent_harness_id`,type:`text`,nullable:!0,identity:!1,default:null,position:25}},{table:`session_windows`,kind:`column`,value:{name:`parent_session_key`,type:`text`,nullable:!0,identity:!1,default:null,position:26}},{table:`session_windows`,kind:`column`,value:{name:`spawned_by`,type:`text`,nullable:!0,identity:!1,default:null,position:27}},{table:`session_windows`,kind:`column`,value:{name:`display_name`,type:`text`,nullable:!0,identity:!1,default:null,position:28}},{table:`session_windows`,kind:`primaryKey`,value:[`session_id`]},{table:`session_windows`,kind:`foreignKey`,value:{columns:[`primary_conversation_id`],target:`conversations`,targetColumns:[`conversation_id`],onUpdate:`NO ACTION`,onDelete:`SET NULL`,deferrable:!1,deferred:!1}},{table:`session_windows`,kind:`foreignKey`,value:{columns:[`session_key`],target:`session_nodes`,targetColumns:[`session_key`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`session_windows`,kind:`indexes`,value:5},{table:`session_windows`,kind:`checks`,value:7},{table:`standing_intents`,kind:`table`,value:null},{table:`standing_intents`,kind:`column`,value:{name:`intent_key`,type:`bigint`,nullable:!1,identity:!0,default:null,position:1}},{table:`standing_intents`,kind:`column`,value:{name:`id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`standing_intents`,kind:`column`,value:{name:`description`,type:`text`,nullable:!1,identity:!1,default:null,position:3}},{table:`standing_intents`,kind:`column`,value:{name:`trigger_keywords`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`standing_intents`,kind:`column`,value:{name:`trigger_embedding`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`standing_intents`,kind:`column`,value:{name:`channel_scope`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`standing_intents`,kind:`column`,value:{name:`sender_scope`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`standing_intents`,kind:`column`,value:{name:`creator_sender`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`standing_intents`,kind:`column`,value:{name:`status`,type:`text`,nullable:!1,identity:!1,default:null,position:9}},{table:`standing_intents`,kind:`column`,value:{name:`expires_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:10}},{table:`standing_intents`,kind:`column`,value:{name:`max_fires`,type:`bigint`,nullable:!1,identity:!1,default:null,position:11}},{table:`standing_intents`,kind:`column`,value:{name:`fire_count`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:12}},{table:`standing_intents`,kind:`column`,value:{name:`cooldown_seconds`,type:`bigint`,nullable:!1,identity:!1,default:`86400`,position:13}},{table:`standing_intents`,kind:`column`,value:{name:`last_fired_at`,type:`bigint`,nullable:!0,identity:!1,default:null,position:14}},{table:`standing_intents`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:15}},{table:`standing_intents`,kind:`column`,value:{name:`source_session_id`,type:`text`,nullable:!0,identity:!1,default:null,position:16}},{table:`standing_intents`,kind:`primaryKey`,value:[`intent_key`]},{table:`standing_intents`,kind:`unique`,value:[`id`]},{table:`standing_intents`,kind:`indexes`,value:4},{table:`standing_intents`,kind:`checks`,value:5},{table:`trajectory_runtime_events`,kind:`table`,value:null},{table:`trajectory_runtime_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`trajectory_runtime_events`,kind:`column`,value:{name:`seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`trajectory_runtime_events`,kind:`column`,value:{name:`run_id`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`trajectory_runtime_events`,kind:`column`,value:{name:`event_json`,type:`text`,nullable:!1,identity:!1,default:null,position:4}},{table:`trajectory_runtime_events`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:5}},{table:`trajectory_runtime_events`,kind:`column`,value:{name:`event_utf8_bytes`,type:`bigint`,nullable:!0,identity:!1,default:null,position:6}},{table:`trajectory_runtime_events`,kind:`column`,value:{name:`event_payload`,type:`bytea`,nullable:!0,identity:!1,default:null,position:7}},{table:`trajectory_runtime_events`,kind:`column`,value:{name:`event_codec`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`trajectory_runtime_events`,kind:`primaryKey`,value:[`session_id`,`seq`]},{table:`trajectory_runtime_events`,kind:`foreignKey`,value:{columns:[`session_id`],target:`session_windows`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`trajectory_runtime_events`,kind:`indexes`,value:2},{table:`trajectory_runtime_events`,kind:`checks`,value:0},{table:`transcript_event_identities`,kind:`table`,value:null},{table:`transcript_event_identities`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`transcript_event_identities`,kind:`column`,value:{name:`event_id`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`transcript_event_identities`,kind:`column`,value:{name:`seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`transcript_event_identities`,kind:`column`,value:{name:`event_type`,type:`text`,nullable:!0,identity:!1,default:null,position:4}},{table:`transcript_event_identities`,kind:`column`,value:{name:`parent_id`,type:`text`,nullable:!0,identity:!1,default:null,position:5}},{table:`transcript_event_identities`,kind:`column`,value:{name:`message_idempotency_key`,type:`text`,nullable:!0,identity:!1,default:null,position:6}},{table:`transcript_event_identities`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:7}},{table:`transcript_event_identities`,kind:`primaryKey`,value:[`session_id`,`event_id`]},{table:`transcript_event_identities`,kind:`foreignKey`,value:{columns:[`session_id`,`seq`],target:`transcript_events`,targetColumns:[`session_id`,`seq`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`transcript_event_identities`,kind:`indexes`,value:4},{table:`transcript_event_identities`,kind:`checks`,value:0},{table:`transcript_events`,kind:`table`,value:null},{table:`transcript_events`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`transcript_events`,kind:`column`,value:{name:`seq`,type:`bigint`,nullable:!1,identity:!1,default:null,position:2}},{table:`transcript_events`,kind:`column`,value:{name:`event_json`,type:`text`,nullable:!0,identity:!1,default:null,position:3}},{table:`transcript_events`,kind:`column`,value:{name:`created_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:4}},{table:`transcript_events`,kind:`column`,value:{name:`event_zstd`,type:`bytea`,nullable:!0,identity:!1,default:null,position:5}},{table:`transcript_events`,kind:`column`,value:{name:`event_utf8_bytes`,type:`bigint`,nullable:!0,identity:!1,default:null,position:6}},{table:`transcript_events`,kind:`column`,value:{name:`navigation_json`,type:`text`,nullable:!0,identity:!1,default:null,position:7}},{table:`transcript_events`,kind:`column`,value:{name:`navigation_type`,type:`text`,nullable:!0,identity:!1,default:null,position:8}},{table:`transcript_events`,kind:`column`,value:{name:`navigation_custom_type`,type:`text`,nullable:!0,identity:!1,default:null,position:9}},{table:`transcript_events`,kind:`column`,value:{name:`navigation_display`,type:`bigint`,nullable:!1,identity:!1,default:`0`,position:10}},{table:`transcript_events`,kind:`column`,value:{name:`message_role`,type:`text`,nullable:!0,identity:!1,default:null,position:11}},{table:`transcript_events`,kind:`column`,value:{name:`navigation_last_type`,type:`text`,nullable:!0,identity:!1,default:null,position:12}},{table:`transcript_events`,kind:`column`,value:{name:`navigation_last_custom_type`,type:`text`,nullable:!0,identity:!1,default:null,position:13}},{table:`transcript_events`,kind:`column`,value:{name:`navigation_valid`,type:`bigint`,nullable:!1,identity:!1,default:`1`,position:14}},{table:`transcript_events`,kind:`primaryKey`,value:[`session_id`,`seq`]},{table:`transcript_events`,kind:`foreignKey`,value:{columns:[`session_id`],target:`session_windows`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`transcript_events`,kind:`indexes`,value:1},{table:`transcript_events`,kind:`checks`,value:3},{table:`transcript_rewrite_watermarks`,kind:`table`,value:null},{table:`transcript_rewrite_watermarks`,kind:`column`,value:{name:`session_id`,type:`text`,nullable:!1,identity:!1,default:null,position:1}},{table:`transcript_rewrite_watermarks`,kind:`column`,value:{name:`generation`,type:`text`,nullable:!1,identity:!1,default:null,position:2}},{table:`transcript_rewrite_watermarks`,kind:`column`,value:{name:`updated_at`,type:`bigint`,nullable:!1,identity:!1,default:null,position:3}},{table:`transcript_rewrite_watermarks`,kind:`primaryKey`,value:[`session_id`]},{table:`transcript_rewrite_watermarks`,kind:`foreignKey`,value:{columns:[`session_id`],target:`session_windows`,targetColumns:[`session_id`],onUpdate:`NO ACTION`,onDelete:`CASCADE`,deferrable:!1,deferred:!1}},{table:`transcript_rewrite_watermarks`,kind:`indexes`,value:1},{table:`transcript_rewrite_watermarks`,kind:`checks`,value:0}];return Object.defineProperty(this,"expectedCatalog",{value:e,enumerable:!0,configurable:!0,writable:!0}),e}},ye={get sql(){let e=`-- Generated by pnpm db:postgres:gen. PostgreSQL-only derived transcript content.

CREATE TABLE "session_transcript_fts" (
  "rowid" bigint PRIMARY KEY REFERENCES "session_transcript_fts_rows" ("id") ON DELETE CASCADE,
  "text" text COLLATE "C",
  "session_id" text COLLATE "C",
  "message_id" text COLLATE "C",
  "role" text COLLATE "C",
  "timestamp" double precision
);
`;return Object.defineProperty(this,"sql",{value:e,enumerable:!0,configurable:!0,writable:!0}),e}};function agentEngineInput(){return r(`agent`)}function createAgentPostgresMigrations(){let e=$.postgres,t=A(e),n=B(t),r=L(n),i=N(r),a=le(i),o=withLegacyAgentPostgresMemoryPaths(a),s=G(o,`schema-nullability`),c=G(s),l=oe(c),u=H(l),d=ue(u);return[{version:28,fromSchema:{postgres:withLegacyAgentPostgresWriteLayout(d)},schema:{postgres:d},sql:`
  DROP INDEX "idx_agent_transcript_event_parent";
  DROP INDEX "idx_agent_session_windows_conversation";
  CREATE INDEX "idx_agent_session_windows_conversation"
    ON "session_windows" (("primary_conversation_id") ASC NULLS FIRST)
    WHERE "primary_conversation_id" IS NOT NULL;

        UPDATE schema_meta
        SET schema_version = 28,
          app_version = '${q.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';`},{version:29,fromSchema:{postgres:d},schema:{postgres:u},sql:`${k}
        ALTER FUNCTION openclaw_transcript_navigation_check(text)
          STRICT SET search_path = pg_catalog;
        UPDATE schema_meta
        SET schema_version = 29,
          app_version = '${q.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';`},{version:30,fromSchema:{postgres:u},schema:{postgres:l},sql:`${j}
        UPDATE schema_meta
        SET schema_version = 30,
          app_version = '${q.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';`},{version:31,fromSchema:{postgres:l},schema:{postgres:c},sql:`${M}
        UPDATE schema_meta
        SET schema_version = 31,
          app_version = '${q.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';`},{version:32,fromSchema:{postgres:c},schema:{postgres:c,postgresVectorDecoderVersion:2},sql:`${_e}
        UPDATE schema_meta
        SET schema_version = 32,
          app_version = '${q.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';`},{version:33,fromSchema:{postgres:c,postgresVectorDecoderVersion:2},schema:{postgres:c,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2},sql:`DO $migration$
DECLARE definition jsonb; vector_index jsonb; extension_schema text; dimensions integer; extension_version text[];
BEGIN
  SELECT regexp_match(extversion, '^([0-9]+)[.]([0-9]+)') INTO extension_version
  FROM pg_catalog.pg_extension WHERE extname = 'vector';
  FOR definition IN
    SELECT value FROM openclaw_schema_meta meta,
      jsonb_each(coalesce((to_jsonb(meta)->>'search_extensions')::jsonb, '{}'::jsonb))
    WHERE meta.store = 'agent'
  LOOP
    IF definition->>'mode' = 'keyword-only' THEN CONTINUE; END IF;
    extension_schema := coalesce(definition->>'extensionSchema', 'public');
    FOR vector_index IN SELECT value FROM jsonb_each(coalesce(definition->'vector', '{}'::jsonb))
    LOOP
      IF extension_version IS NULL OR (extension_version[1]::integer = 0 AND extension_version[2]::integer < 7) THEN
        RAISE EXCEPTION 'PostgreSQL binary vector search requires pgvector 0.7 or newer. Upgrade the server extension package, then have a database administrator run ALTER EXTENSION vector UPDATE before reopening the store.';
      END IF;
      dimensions := (vector_index->'postgres'->>'dimensions')::integer;
      EXECUTE format(
        'ALTER TABLE %I ADD COLUMN embedding_bits bit(%s) GENERATED ALWAYS AS (CASE WHEN %I.vector_norm(embedding) > 0 THEN %I.binary_quantize(embedding)::bit(%s) ELSE NULL END) STORED',
        vector_index->>'table', dimensions, extension_schema, extension_schema, dimensions);
    END LOOP;
  END LOOP;
END $migration$;
        UPDATE schema_meta
        SET schema_version = 33,
          app_version = '${q.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';`},{version:34,fromSchema:{postgres:c,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2},schema:{postgres:s,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2},sql:`${z(s)}
        UPDATE schema_meta
        SET schema_version = 34,
          app_version = '${q.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';`},{version:35,fromSchema:{postgres:s,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2},schema:{postgres:o,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2},sql:`${z(o,`schema-nullability`)}
        UPDATE schema_meta
        SET schema_version = 35,
          app_version = '${q.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';`},{version:36,fromSchema:{postgres:o,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2},schema:{postgres:a,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2},sql:`${Q}
        UPDATE schema_meta
        SET schema_version = 36,
          app_version = '${q.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';`},{version:37,fromSchema:{postgres:a,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2},schema:{postgres:i,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2},sql:`${re(i)}
        UPDATE schema_meta
        SET schema_version = 37,
          app_version = '${q.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';`},{version:38,fromSchema:{postgres:i,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2},schema:{postgres:i,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2,postgresTextSearchVersion:2},sql:`${ge}
        UPDATE schema_meta
        SET schema_version = 38,
          app_version = '${q.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';`},{version:39,fromSchema:{postgres:i,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2,postgresTextSearchVersion:2},schema:{postgres:r,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2,postgresTextSearchVersion:2},sql:`${R(r)}
        UPDATE schema_meta
        SET schema_version = 39,
          app_version = '${q.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';`},{version:40,fromSchema:{postgres:r,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2,postgresTextSearchVersion:2},schema:{postgres:n,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2,postgresTextSearchVersion:2},sql:`${se(n)}
        UPDATE schema_meta
        SET schema_version = 40,
          app_version = '${q.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';`},{version:41,fromSchema:{postgres:n,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2,postgresTextSearchVersion:2},schema:{postgres:t,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2,postgresTextSearchVersion:2},sql:`${W(t)}
        UPDATE schema_meta
        SET schema_version = 41,
          app_version = '${q.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';`},{version:42,fromSchema:{postgres:t,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2,postgresTextSearchVersion:2},schema:{postgres:e,postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2,postgresTextSearchVersion:2},sql:`${V(e)}
        UPDATE schema_meta
        SET schema_version = 42,
          app_version = '${q.replaceAll(`'`,`''`)}',
          updated_at = CAST(EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000 AS bigint)
        WHERE meta_key = 'primary';`}]}const $={id:`agent`,version:42,sqlite:``,get postgres(){let e=`${ve.sql}\n${ye.sql}`;return Object.defineProperty(this,"postgres",{value:e,enumerable:!0,configurable:!0,writable:!0}),e},postgresVectorDecoderVersion:2,postgresVectorSearchVersion:2,postgresTextSearchVersion:2,search:he,get postgresMigrations(){let e=createAgentPostgresMigrations();return Object.defineProperty(this,"postgresMigrations",{value:e,enumerable:!0,configurable:!0,writable:!0}),e}};function admitAgentPostgres(e,t,n,r){if(r){if(t===void 0)throw Error(`Creating an agent database requires an agent owner`);let n=Date.now();e.exec(`INSERT INTO session_key_contract (id, main_key, updated_at) VALUES (1, 'main', 0)`),e.exec(`INSERT INTO memory_index_state (id, revision) VALUES (1, 0)`),e.prepare(`INSERT INTO schema_meta
      (meta_key, role, schema_version, agent_id, app_version, created_at, updated_at)
      VALUES ('primary', 'agent', ?, ?, ?, ?, ?)`).run(42,t,q,n,n),P(e,{agentId:t,role:`agent`,schemaVersion:42})}let i=I(e);if(ie(i,t??i?.agentId??``,n,$.version),ne(e)?.version!==$.version)throw Error(`Agent database has no current PostgreSQL schema admission`);x(e.anchor)}function openAgentEngineStore(e,t,n,r=!1,i,a=!1){if(t===void 0&&!r)throw Error(`Creating an agent database requires an agent owner`);let o=agentEngineInput(),inspectSqlite=()=>{let t=D(e)??b(e);return{hasEngineAnchor:t.tables.has(`openclaw_engine_anchor`),hasExistingData:[...t.tables,...t.views,...t.triggers.keys()].some(e=>e!==`openclaw_engine_anchor`&&!e.startsWith(`sqlite_`))}},s=!!(o&&inspectSqlite().hasEngineAnchor),open=()=>de({anchor:e,schema:$,input:o,existingOnly:r||s,reusePostgresConnection:a,closeOnFailure:i,assertMigrationCurrent:O,prepareAnchor:()=>{},openSqlite:()=>{},inspectSqlite,admitPostgres:(e,r)=>admitAgentPostgres(e,t,n,r)});return o&&!r&&!s?fe(e,open):open()}function inspectOpenClawAgentDatabaseOwner(e,t){if(Y&&agentEngineInput()){let n=v(e,ae,()=>void 0);if(!t?.revalidateSchema&&n?.role===`agent`&&n.agentId)return{status:`owned`,agentId:o(n.agentId)};throw Error(`PostgreSQL agent ownership requires worker preparation before synchronous inspection; use the asynchronous agent database preparation owner.`)}let n,r;try{let i=Z.resolve(e),a=K.databases.get(i);if(!t?.revalidateSchema&&a?.db.isOpen&&!K.failures.has(i))return S(a.db,()=>F(a.db,e)),K.idleTimers.get(a.db)?.refresh(),{status:`owned`,agentId:a.agentId};n=agentEngineInput()?ee(te(e),{timeout:J}):d(e,{readOnly:!0}),w(n,J),agentEngineInput()?r=openAgentEngineStore(n,void 0,e,!0):t?.revalidateSchema&&y(n),F(r??n,e);let s=I(r??n);return s?s.role!==`agent`||!s.agentId?{status:`unreadable`}:{status:`owned`,agentId:o(s.agentId)}:{status:`unowned`}}catch{return{status:`unreadable`}}finally{try{r?.close()}finally{n?.close()}}}function resolveCapturedSessionStorePath(e,t,n,r,i=`configured`){if(!r)return g(i==="default"?void 0:e,{agentId:t,env:n});let a=r.get(t);if(!a)throw Error(`Session store path was not captured for ${t}`);return a[i]}function captureSessionStoreReadCandidate(e,t){let n=Z.resolve(e);return{path:n,physicalPath:t?Z.join(l(Z.dirname(n)),Z.basename(n)):l(n),...t?{scope:t}:{}}}function isSessionStoreReadCandidateCurrent(e){let t=captureSessionStoreReadCandidate(e.path,e.scope).physicalPath;return matchesSessionStoreReadCandidatePhysicalPath(e,t)}function matchesSessionStoreReadCandidatePhysicalPath(e,t){let n=resolveCapturedSessionStoreReadCandidatePhysicalPath(e);return t===n?!0:e.scope||!isSymlinkFreeWindowsShortPath(e.path)&&!isSymlinkFreeWindowsShortPath(e.physicalPath)?!1:matchesWindowsFileAlias(t,n)}function resolveCapturedSessionStoreReadCandidatePhysicalPath(e){return e.scope||!isSymlinkFreeWindowsShortPath(e.physicalPath)?e.physicalPath:l(e.physicalPath)}function isSymlinkFreeWindowsShortPath(e){return process.platform!==`win32`||!/(?:^|[\\/])[^\\/]*~\d+(?=[\\/]|$)/iu.test(e)?!1:isSymlinkFreePath(e)}function isSymlinkFreePath(e){let t=Z.resolve(e),n=Z.parse(t),r=n.root;for(let e of t.slice(n.root.length).split(Z.sep)){r=Z.join(r,e);let t=X.lstatSync(r,{throwIfNoEntry:!1});if(!t||t.isSymbolicLink())return!1}return!0}function matchesWindowsFileAlias(e,t){let n=isSymlinkFreeWindowsShortPath(e)?e:isSymlinkFreeWindowsShortPath(t)?t:void 0;if(process.platform!==`win32`||!n||!isSymlinkFreePath(e)||!isSymlinkFreePath(t))return!1;let r=X.statSync(Z.dirname(e),{bigint:!0}),i=X.statSync(Z.dirname(t),{bigint:!0});if(r.dev!==i.dev||r.ino!==i.ino)return!1;let o=a(e),s=a(t);return o?.key.startsWith(`file:`)===!0&&o.key===s?.key&&o.birthtime===s.birthtime}function assertSessionStoreReadCandidate(e,t){if(Y&&n()){let n=t.find(t=>t.identity&&(t.path===Z.resolve(e)||t.physicalPath===Z.resolve(e)));if(!n)throw Error(`Session inspection requires a worker-prepared physical candidate`);return n.physicalPath}let r=l(e);for(let n of t){let t=!n.scope&&r===resolveCapturedSessionStoreReadCandidatePhysicalPath(n);if((_(n,e)||t||!n.scope&&matchesWindowsFileAlias(n.path,e))&&(!n.scope||_({...n,path:resolveCapturedSessionStoreReadCandidatePhysicalPath(n)},r))&&(!n.scope&&n.path===Z.resolve(e)?matchesSessionStoreReadCandidatePhysicalPath(n,r):isSessionStoreReadCandidateCurrent(n)))return n.identity&&i(n.path,n.identity),r}throw Error(`Session database target changed outside captured discovery custody: ${e}`)}const be=/* @__PURE__ */ new Set([`OPENCLAW_STATE_DIR`,`OPENCLAW_SUPERVISOR_MODE`,`OPENCLAW_HOME`,`HOME`,`USERPROFILE`,`PREFIX`,`ANDROID_DATA`,`OPENCLAW_TEST_FAST`,`VITEST`,`VITEST_POOL_ID`,`VITEST_WORKER_ID`,`NODE_ENV`]);function captureSessionTranscriptStorageEnvironment(e){let n=f(Object.fromEntries(Object.keys(e).filter(e=>be.has(e.toUpperCase())).map(t=>[t,e[t]])));return{OPENCLAW_STATE_DIR:t(n),...u(n)?{OPENCLAW_SUPERVISOR_MODE:`external`}:{}}}var xe=/* @__PURE__ */ e({SessionStoreRegistryReadRequired:()=>SessionStoreRegistryReadRequired,listDurableSqliteTargetOwnersForSessionStorePath:()=>listDurableSqliteTargetOwnersForSessionStorePath,listDurableSqliteTargetPathsForSessionStorePath:()=>listDurableSqliteTargetPathsForSessionStorePath,prepareSqliteTargetFromSessionStorePath:()=>prepareSqliteTargetFromSessionStorePath,readSessionStoreRegistryRows:()=>readSessionStoreRegistryRows,resolveSqliteTargetFromSessionStorePath:()=>resolveSqliteTargetFromSessionStorePath}),SessionStoreRegistryReadRequired=class extends Error{};function readSessionStoreRegistryRows(e,t,n){if(e&&`status`in e){if(e.status===`deferred`)throw new SessionStoreRegistryReadRequired(`Session target discovery requires registry rows`);let t=/* @__PURE__ */ Error(`Session target registry is unavailable`);throw n?.(t),t}return e??ce({env:t})}async function prepareSqliteTargetFromSessionStorePath(e,t={},n){n?.throwIfAborted();let r=p(e);if(r.agentId)return r;let i=captureSessionTranscriptStorageEnvironment(t.env??process.env),a=U({env:i}),o={storePath:Z.resolve(e.trim()),agentId:t.agentId,defaultAgentId:t.defaultAgentId,env:i},{resolveSessionSqliteTargetInWorker:s}=await import(`./disk-budget.worker-session-transcript-read-worker-runtime-BrOpNoSS.mjs`),c=await a.read(n),l=readSessionStoreRegistryRows(c.result.status===`available`?c.result.entries:c.result);return n?.throwIfAborted(),s({...o,registeredDatabases:l},n)}function resolvePersistedOwners(e,t,n,r){let i=[...new Set(t.filter(t=>n(t.path,e)).map(e=>o(e.agentId)))],a;return i.length===1?hasFilesystemEntry(e,r.onReadError):a=resolveDatabaseOwner(e,r.readCandidates,r.onReadError),{registeredOwners:i,databaseOwner:a}}function resolveDatabaseOwner(e,t,n){if(!hasFilesystemEntry(e,n))return;let r=inspectOpenClawAgentDatabaseOwner(t?assertSessionStoreReadCandidate(e,t):e);return r.status===`owned`?o(r.agentId):void 0}function hasFilesystemEntry(e,t){try{return pe(e),!0}catch(e){if(e.code===`ENOENT`)return!1;throw t?.(e),e}}function resolveCustomStoreSqlitePath(e){let t=Z.resolve(e.unsuffixedPath),n=Z.basename(t,`.sqlite`),r=Z.dirname(t),i=o(e.options.defaultAgentId??`main`),a=o(e.options.agentId??i),c=readSessionStoreRegistryRows(e.options.registeredDatabases,e.options.env,e.options.onReadError),l=e.options.isSameDatabasePath??s(),resolvePersistedOwner=t=>{let{registeredOwners:n,databaseOwner:r}=resolvePersistedOwners(t,c,l,e.options);return{effectiveOwner:n.length===1?n[0]:n.length===0?r:void 0,registeredOwners:n}},{registeredOwners:u,effectiveOwner:d}=resolvePersistedOwner(t),resolveSuffixedTarget=t=>{let i=`${n}.${t}`,a=/* @__PURE__ */ new Set;for(let e of c){if(!l(Z.dirname(e.path),r))continue;let t=h(Z.basename(e.path),i);t!==void 0&&a.add(t)}try{for(let e of me(r)){let t=h(e,i);t!==void 0&&a.add(t)}}catch(t){if(t.code!==`ENOENT`)throw e.options.onReadError?.(t),t}let candidatePathAt=e=>Z.join(r,e===1?`${i}.sqlite`:`${i}.${e}.sqlite`),o=[...a].toSorted((e,t)=>e-t);for(let e of o){let n=candidatePathAt(e);if(resolvePersistedOwner(n).effectiveOwner===t)return{owned:!0,path:n}}let s=1;for(let e of o)if(e===s)s+=1;else if(e>s)break;for(let n=s;;n+=1){let r=candidatePathAt(n),i=resolvePersistedOwner(r);if(i.effectiveOwner===t)return{owned:!0,path:r};if(i.registeredOwners.length===0&&!hasFilesystemEntry(r,e.options.onReadError))return{owned:!1,path:r}}},f=resolveSuffixedTarget(i),p=a===i?f:resolveSuffixedTarget(a),m=f.owned,g=p.owned,_=u.length===0&&!hasFilesystemEntry(t,e.options.onReadError),v=d||m||!_?void 0:i,y=d??v,b=a===d||!g&&a===v,x=d?u.length===1?`database-registry`:`database-path`:m?`registered-suffixed`:u.length>1?`ambiguous-registry`:_?`configured-default`:`occupied-unsuffixed`;return{agentId:a,path:b?t:p.path,ownerSource:x,...y?{unsuffixedOwnerAgentId:y}:{}}}function resolveSqliteTargetFromSessionStorePath(e,t={}){let n=p(e),r=t.agentId?o(t.agentId):void 0;if(r&&c(n.path,{agentId:r,env:t.env}))return{agentId:r,path:n.path};if(n.agentId)return n;if(n.shared){let e=readSessionStoreRegistryRows(t.registeredDatabases,t.env,t.onReadError),{registeredOwners:r,databaseOwner:i}=resolvePersistedOwners(n.path,e,t.isSameDatabasePath??s(),t),a=o(t.defaultAgentId??`main`);return{agentId:(r.length===1?r[0]:void 0)??i??a,path:n.path,shared:!0,ownerSource:r.length===1?`database-registry`:i?`database-path`:r.length>1?`ambiguous-registry`:`configured-default`}}return resolveCustomStoreSqlitePath({unsuffixedPath:n.path,options:t})}function listDurableSqliteTargetOwnersForSessionStorePath(e){let t=/* @__PURE__ */ new Set;for(let n of m(e)){let e=resolveDatabaseOwner(n);e&&t.add(e)}return[...t]}function listDurableSqliteTargetPathsForSessionStorePath(e){return m(e).filter((e,t)=>t===0||resolveDatabaseOwner(e)!==void 0)}export{SessionStoreRegistryReadRequired,resolveCapturedSessionStorePath as i,listDurableSqliteTargetOwnersForSessionStorePath,listDurableSqliteTargetPathsForSessionStorePath,captureSessionTranscriptStorageEnvironment as n,prepareSqliteTargetFromSessionStorePath,captureSessionStoreReadCandidate as r,readSessionStoreRegistryRows,resolveSqliteTargetFromSessionStorePath,xe as t};