import{i as e,o as t}from"./transcript-record-coerce-eN4p5mcq.mjs";import{rt as n}from"./transcript-sqlite-database-admission-5Zju-fzc.mjs";import{n as r}from"./transcript-sql-connection-DLZo1Z6N.mjs";import{S as i,o as a}from"./transcript-sqlite-schema-facts-B1OszW_q.mjs";import{a as o,l as s,m as c,t as l}from"./transcript-kysely-sync-BLR5Zy5p.mjs";import{i as u}from"./transcript-immutable-data-JqBMopGj.mjs";import{_ as d,a as f,c as p,f as m,g as h,h as g,n as _,r as v,s as y}from"./transcript-schemas-C_W5KYqZ.mjs";import{c as b,n as x,o as S,r as C,s as w}from"./transcript-session-entry-codec-CvLNFJN0.mjs";import"./transcript-node-sqlite-B7au4kuE.mjs";import{_ as T,a as E,c as D,d as O,f as k,g as A,h as j,m as M,n as N,u as P,v as F}from"./transcript-json-values-BjD3KYUi.mjs";import{r as I}from"./transcript-transcript-events-DiLBzwnN.mjs";import{n as L,s as R,t as z}from"./transcript-tool-result-pairing-Q3LgR88z.mjs";import{t as B}from"./transcript-zstd-codec-Bwg8OR0e.mjs";import"./transcript-transcript-payload-read-DLYFBpFy.mjs";const V=[`upstreamUserText`],H=u(t=>{let n=e(t.details);if(n?.openclawSyntheticMissingToolResult===!0&&Object.keys(n).length===1)return t;let r={...t};return n?.openclawSyntheticMissingToolResult===!0?r.details={[L]:!0}:delete r.details,r});function stripToolResultDetails(t){let n=!1,r=t.map(t=>{let r=e(t);if(r?.role!==`toolResult`||!(`details`in r))return t;let i=H(r);return n||=i!==t,i});return n?r:t}function projectModelContextMessages(t,n){let r=[];for(let i of stripToolResultDetails(t)){let t=e(i),a=e(t?.__openclaw);if(!a||!V.some(e=>e in a)){r.push(i);continue}let o={...a};for(let e of V)delete o[e];n?.(o),r.push({...t,__openclaw:o})}return r}function projectSessionModelContextEntry(e,{entry:t,omitCheckpoint:n,toolResultOmission:r}){let i={...e,parentId:t.parentId,...t.type===`compaction`||t.type===`reset`?{firstKeptEntryId:t.firstKeptEntryId}:{}};if(i.type!==`message`)return i;let[a]=projectModelContextMessages([i.message]),o={...i,message:a};return n&&o.message.role===`assistant`&&(o.message={...o.message},delete o.message.providerReplay),r!==void 0&&o.message.role===`toolResult`&&(o.message={...o.message,content:[{type:`text`,text:r}]}),o}const U=[`type`,`id`,`parentId`,`targetId`,`appendParentId`,`appendMode`],W=[...U,`timestamp`,`version`,`cwd`,`firstKeptEntryId`,`reason`,`tokensBefore`,`thinkingLevel`,`provider`,`modelId`,`fromId`,`customType`,`display`,`excludeFromContext`,`label`,`name`],G=[`role`,`provider`,`model`,`timestamp`,`excludeFromContext`,`openclawModelPlacement`,`toolCallId`,`toolUseId`,`tool_call_id`,`tool_use_id`,`callId`,`call_id`,`toolName`,`isError`,`stopReason`,`customType`,`display`];function pickNavigation(e,t){return Object.fromEntries(t.filter(t=>Object.hasOwn(e,t)).map(t=>[t,e[t]]))}function projectSessionModelContextNavigation(e){let n={...pickNavigation({...e},W),type:e.type,id:e.id,parentId:e.parentId,timestamp:e.timestamp};if(e.type===`message`){let r=e.message,i={...r},a=`content`in r&&Array.isArray(r.content)?r.content.flatMap(e=>t(e)&&[`toolCall`,`toolUse`,`functionCall`].includes(e.type)?[pickNavigation(e,[`type`,`id`,`name`])]:[]):[],o=t(i.details)?i.details:{},s=i.customType===`openclaw.system-update`&&(o.kind===`prompt-update`||o.kind===`runtime-context`)?o.kind:void 0;n.message={...pickNavigation(i,G),content:a,command:``,output:``,providerReplay:{type:t(i.providerReplay)?i.providerReplay.type:null},details:{[L]:R({isError:i.isError,details:i.details,content:i.content}),...s?{kind:s}:{}}}}else e.type===`compaction`||e.type===`branch_summary`?n.summary=``:e.type===`custom_message`?(n.content=[],e.customType===`openclaw.system-update`&&t(e.details)&&(e.details.kind===`prompt-update`||e.details.kind===`runtime-context`)&&(n.details={kind:e.details.kind})):e.type===`custom`&&e.customType===`openclaw.system-prompt`?n.data={restart:t(e.data)&&e.data.restart===!0}:e.type===`custom`&&e.customType===`openclaw.background-result-placement`&&(n.data=t(e.data)?pickNavigation(e.data,[`afterEntryId`,`resultEntryIds`]):e.data);return n}const K=/* @__PURE__ */ new WeakSet;function projectModelContextJson(e,t,n=!1,r){let i=JSON.parse(e);return JSON.stringify(t?projectSessionModelContextNavigation(i):projectSessionModelContextEntry(i,{entry:i,omitCheckpoint:n,toolResultOmission:r}))}function projectDeepModelContextSql(e,t,n,r=c.lit(0),i=c.lit(null)){let a=`openclaw_deep_model_context`;return K.has(e)||(e.function(a,{deterministic:!0,directOnly:!0},(e,t,n,r)=>{if(typeof e!=`string`)throw TypeError(`Deep transcript projection requires canonical JSON text`);return projectModelContextJson(e,t===1,n===1,typeof r==`string`?r:void 0)}),K.add(e)),o(e).fn(a,[t,c.lit(+!!n),r,i])}function projectModelContextEventSql(e,t,n,i,a=P(e,t,c.lit(`$.message.role`)),o=A(e,t)){if(r(e)){let e=postgresModelEventSql(t,a),r=i?c`CASE WHEN ${i} IS NOT NULL AND ${a} = 'toolResult'
          THEN jsonb_set(${e}, '{message,content}', jsonb_build_array(jsonb_build_object('type', 'text', 'text', ${i}::text)))
          ELSE ${e} END`:e;return c`(CASE WHEN ${n} = 1
      THEN ${r} #- '{message,providerReplay}' ELSE ${r} END)::text`}let s=V.map(e=>`$.message.__openclaw.${e}`),l=k(e,t,s.map(e=>c.val(e))),u=c`CASE WHEN ${a} = 'toolResult'
    THEN ${k(e,l,[c.lit(`$.message.details`)])} ELSE ${l} END`,d=i?c`CASE WHEN ${i} IS NOT NULL AND ${a} = 'toolResult'
      THEN ${M(e,u,c.lit(`$.message.content`),N(e,[D(e,{type:c.lit(`text`),text:i})]),!0)} ELSE ${u} END`:u;return c`CASE WHEN NOT ${o} THEN ${projectDeepModelContextSql(e,t,!1,n,i)}
    WHEN ${n} = 1
    THEN ${k(e,d,[c.lit(`$.message.providerReplay`)])} ELSE ${d} END`}function contentPropertySql(e,t){return c`CASE WHEN typeof(key) = 'integer' AND key < 8
    THEN json_extract(${e}, fullkey || ${`.${t}`})
    ELSE json_extract(value, ${`$.${t}`}) END`}function jsonMemberValue(e){let t=c.ref(`${e}.type`),n=c.ref(`${e}.value`);return c`CASE ${t}
    WHEN 'object' THEN json(${n})
    WHEN 'array' THEN json(${n})
    WHEN 'true' THEN json('true') WHEN 'false' THEN json('false')
    ELSE ${n} END`}function projectTranscriptPayloadNavigationSql(e,t){if(r(e))return c`(
      SELECT coalesce(json_object_agg(root_member.key, CASE
        WHEN root_member.key = 'message' AND json_typeof(root_member.value) = 'object' THEN (
          SELECT coalesce(json_object_agg(message_member.key, CASE
            WHEN message_member.key = '__openclaw' AND json_typeof(message_member.value) = 'object' THEN (
              SELECT coalesce(json_object_agg(internal.key, internal.value), '{}'::json)
              FROM json_each(message_member.value) AS internal
              WHERE internal.key IN ('runId', 'steerTargetRunId', 'contextFreeCommand'))
            ELSE message_member.value END), '{}'::json)
          FROM json_each(root_member.value) AS message_member
          WHERE message_member.key IN ('role', 'idempotencyKey', 'provenance', 'excludeFromContext', '__openclaw'))
        ELSE root_member.value END), '{}'::json)::text
      FROM json_each(${t}::json) AS root_member
      WHERE root_member.key IN (${c.join([...W,`message`])}))`;let n=c.ref(`message_member.value`),i=O(e,n,[`runId`,`steerTargetRunId`,`contextFreeCommand`]),a=c`(SELECT json_group_object(message_member.key,
    CASE WHEN message_member.key = '__openclaw' AND message_member.type = 'object'
      THEN json(${i}) ELSE ${jsonMemberValue(`message_member`)} END)
    FROM json_each(root_member.value) AS message_member
    WHERE message_member.key IN ('role', 'idempotencyKey', 'provenance', 'excludeFromContext', '__openclaw'))`;return c`(SELECT json_group_object(root_member.key,
    CASE WHEN root_member.key = 'message' AND root_member.type = 'object'
      THEN json(${a}) ELSE ${jsonMemberValue(`root_member`)} END)
    FROM json_each(${t}) AS root_member
    WHERE root_member.key IN (${c.join([...W,`message`])}))`}function projectTranscriptNavigationSql(e,t){return c`CASE WHEN ${E(e,t)}
    THEN ${O(e,t,U)} ELSE ${t} END`}function projectResetBoundaryNavigationSql(e,t){let n=O(e,t,[...U,`timestamp`,`firstKeptEntryId`,`customType`,`display`]);return c`CASE WHEN ${E(e,t)} THEN
    CASE WHEN ${j(e,t)} = 'object' THEN
      ${M(e,n,c.lit(`$.message`),D(e,{role:P(e,t,c.lit(`$.message.role`))}),!0)}
    ELSE ${t} END
    ELSE ${t} END`}function systemUpdateKindSql(e,t){return c`CASE
    WHEN ${P(e,t,c.lit(`$.customType`))} = 'openclaw.system-update'
      AND ${P(e,t,c.lit(`$.details.kind`))} IN ('prompt-update', 'runtime-context')
    THEN ${P(e,t,c.lit(`$.details.kind`))} ELSE NULL END`}function projectModelContextNavigationSql(e,t,i,a=A(e,t)){if(r(e)){let n=c.ref(`nav_parts.event`),r=c.ref(`nav_parts.message`),a=c.ref(`nav_parts.content`),o=i??c`${n} ->> 'type'`,s=E(e,t);return c`CASE WHEN ${s} THEN (
      WITH nav_input AS MATERIALIZED (SELECT (CASE WHEN ${s} THEN ${t} END)::jsonb AS event),
      nav_parts AS MATERIALIZED (SELECT event, event -> 'message' AS message,
        event #> '{message,content}' AS content FROM nav_input)
      SELECT ${postgresModelNavigationSql(n,r,a,o)}::text FROM nav_parts)
      ELSE ${t} END`}let s=i??P(e,t,c.lit(`$.type`)),l=O(e,t,W),u=n()?c`jsonb_extract(${t}, '$.message')`:c`json_extract(${t}, '$.message')`,d=O(e,u,G),f=systemUpdateKindSql(e,u),p=systemUpdateKindSql(e,t),m=c`json_set(${l}, '$.content', json('[]'))`,h=c`(SELECT json_group_array(json_object(
    'type', ${contentPropertySql(t,`type`)}, 'id', ${contentPropertySql(t,`id`)},
    'name', ${contentPropertySql(t,`name`)}))
    FROM json_each(${t}, '$.message.content') WHERE type = 'object'
    AND ${contentPropertySql(t,`type`)} IN ('toolCall', 'toolUse', 'functionCall'))`,g=c`COALESCE(json_extract(${t}, ${`$.message.details.${L}`}), 0) = 1 OR EXISTS (
    SELECT 1 FROM json_each(${t}, '$.message.content') WHERE type = 'object'
    AND ${contentPropertySql(t,`type`)} = 'text' AND ${contentPropertySql(t,`text`)} = ${z})`,_=c`CASE ${s}
    WHEN 'message' THEN json_set(${l}, '$.message', json_set(${d},
      '$.content', json(${h}), '$.command', '', '$.output', '',
      '$.providerReplay', json_object('type', json_extract(${t}, '$.message.providerReplay.type')),
      '$.details', json_patch(json_object(${L}, json(CASE WHEN (${g}) THEN 'true' ELSE 'false' END)),
        CASE WHEN ${f} IS NULL THEN json('{}') ELSE json_object('kind', ${f}) END)))
    WHEN 'custom_message' THEN CASE WHEN ${p} IS NULL THEN ${m}
      ELSE json_set(${m}, '$.details', json_object('kind', ${p})) END
    WHEN 'custom' THEN CASE WHEN ${P(e,t,c.lit(`$.customType`))} = 'openclaw.system-prompt'
      THEN json_set(${l}, '$.data', json_object('restart', json(CASE
        WHEN json_type(${t}, '$.data.restart') = 'true' THEN 'true' ELSE 'false' END)))
      WHEN ${P(e,t,c.lit(`$.customType`))} = ${b}
      THEN ${M(e,l,c.lit(`$.data`),o(e).fn(`json`,[O(e,P(e,t,c.lit(`$.data`)),[`afterEntryId`,`resultEntryIds`])]),!0)}
      ELSE ${l} END
    WHEN 'compaction' THEN json_set(${l}, '$.summary', '')
    WHEN 'branch_summary' THEN json_set(${l}, '$.summary', '')
    ELSE ${l} END`;return c`CASE WHEN ${a} THEN ${_}
    ELSE ${projectDeepModelContextSql(e,t,!0)} END`}function projectPostgresModelContextRowsSql(e){let t=c.ref(`context_projected.event`),n=c.ref(`context_projected.message`),r=c.ref(`context_projected.content`),i=c`${t} ->> 'type'`,a=c`(strpos(event_json, ${`\\u`}) = 0
    OR pg_input_is_valid(event_json, 'jsonb'))`,o=postgresModelEventSql(c.ref(`context_parts.event`),c`context_parts.message ->> 'role'`);return c`(
    WITH context_input AS MATERIALIZED (
      SELECT seq, CASE WHEN navigation_json IS NULL AND ${a} THEN event_json::jsonb END AS event,
        CASE WHEN navigation_json IS NULL AND NOT ${a} THEN event_json END AS exceptional_json,
        navigation_json::jsonb AS metadata FROM (${e}) AS selected
    ), context_parts AS MATERIALIZED (
      SELECT *, event -> 'message' AS message, event #> '{message,content}' AS content FROM context_input
    ), context_projected AS MATERIALIZED (
      SELECT *, ${o} AS model FROM context_parts
    ) SELECT seq,
      CASE WHEN metadata IS NULL THEN ${postgresModelNavigationSql(t,n,r,i)}::text
        ELSE (metadata -> 'model')::text END AS navigation_json,
      CASE WHEN metadata IS NULL THEN octet_length(model::text)
        ELSE (metadata ->> 'modelBytes')::double precision END AS model_bytes,
      CASE WHEN metadata IS NULL THEN octet_length((model #- '{message,providerReplay}')::text)
        ELSE (metadata ->> 'modelWithoutCheckpointBytes')::double precision END AS retained_bytes,
      exceptional_json
    FROM context_projected ORDER BY seq
  )`}function postgresModelEventSql(e,t){let n=e;for(let e of V)n=c`(${n}::jsonb #- ${c.lit(`{message,__openclaw,${e}}`)}::text[])`;return c`CASE WHEN ${t} = 'toolResult'
    THEN ${n} #- '{message,details}' ELSE ${n} END`}function postgresNavigationObjectSql(e,t){return c`(
    SELECT coalesce(jsonb_object_agg(key, value), '{}'::jsonb)
    FROM jsonb_each(CASE WHEN jsonb_typeof(${e}) = 'object' THEN ${e} ELSE '{}'::jsonb END)
    WHERE key IN (${c.join(t.map(e=>c.lit(e)))})
  )`}function postgresModelNavigationSql(e,t,n,r){let i=postgresNavigationObjectSql(e,W),a=postgresNavigationObjectSql(t,G),o=c`jsonb_array_elements(
    CASE WHEN jsonb_typeof(${n}) = 'array' THEN ${n} ELSE '[]'::jsonb END)`,s=c`(
    SELECT coalesce(jsonb_agg(jsonb_build_object('type', value ->> 'type', 'id', value ->> 'id', 'name', value ->> 'name')), '[]'::jsonb)
    FROM ${o} WHERE jsonb_typeof(value) = 'object' AND value ->> 'type' IN ('toolCall', 'toolUse', 'functionCall'))`,l=c`coalesce((${t} #> ${c.lit(`{details,${L}}`)}::text[])::text, 'false') IN ('true', '1') OR EXISTS (
    SELECT 1 FROM ${o} WHERE value ->> 'type' = 'text' AND value ->> 'text' = ${z})`,u=c`CASE WHEN ${t} ->> 'customType' = 'openclaw.system-update'
    AND ${t} #>> '{details,kind}' IN ('prompt-update', 'runtime-context') THEN ${t} #>> '{details,kind}' END`,d=c`CASE WHEN ${e} ->> 'customType' = 'openclaw.system-update'
    AND ${e} #>> '{details,kind}' IN ('prompt-update', 'runtime-context') THEN ${e} #>> '{details,kind}' END`;return c`CASE ${r}
    WHEN 'message' THEN ${i} || jsonb_build_object('message', ${a} || jsonb_build_object(
      'content', ${s}, 'command', '', 'output', '',
      'providerReplay', jsonb_build_object('type', ${t} #>> '{providerReplay,type}'),
      'details', jsonb_build_object(${c.lit(L)}, (${l})) ||
        CASE WHEN ${u} IS NULL THEN '{}'::jsonb ELSE jsonb_build_object('kind', ${u}) END))
    WHEN 'custom_message' THEN ${i} || jsonb_build_object('content', '[]'::jsonb) ||
      CASE WHEN ${d} IS NULL THEN '{}'::jsonb ELSE jsonb_build_object('details', jsonb_build_object('kind', ${d})) END
    WHEN 'custom' THEN CASE WHEN ${e} ->> 'customType' = 'openclaw.system-prompt'
      THEN ${i} || jsonb_build_object('data', jsonb_build_object('restart', coalesce((${e} #> '{data,restart}')::text, 'false') = 'true'))
      WHEN ${e} ->> 'customType' = ${b}
      THEN ${i} || jsonb_build_object('data', ${postgresNavigationObjectSql(c`${e} -> 'data'`,[`afterEntryId`,`resultEntryIds`])})
      ELSE ${i} END
    WHEN 'compaction' THEN ${i} || jsonb_build_object('summary', '')
    WHEN 'branch_summary' THEN ${i} || jsonb_build_object('summary', '')
    ELSE ${i} END`}const q={id:g().min(1),parentId:h([g(),v()]).optional(),timestamp:g().optional(),appendMode:d().optional()},J=m({kind:p(`canonical`),hasParentId:f(),entry:y(`type`,[m({...q,type:p(`message`),assistantResponseId:g().optional(),assistantRunId:g().optional()}),m({...q,type:p(`custom_message`),customType:g().min(1)}),m({...q,type:p(`label`),targetId:g().min(1),label:g().optional()}),m({...q,type:_([`thinking_level_change`,`model_change`,`compaction`,`reset`,`branch_summary`,`custom`,`session_info`])})])}).refine(({entry:e,hasParentId:t})=>t===(e.parentId!==void 0));function projectSessionTranscriptReportFacts(e){let{entry:t,recognized:n}=x(e,3);if(!n||t.type===`session`){let t=S(e);if(t)return{kind:`leaf`,entry:t};let n=w(e);return n?{kind:`link`,...n}:{kind:`ignored`}}let r={id:t.id,parentId:t.parentId,timestamp:t.timestamp,appendMode:t.appendMode},i=Object.hasOwn(t,`parentId`);return t.type===`label`?{kind:`canonical`,hasParentId:i,entry:{...r,type:t.type,targetId:t.targetId,label:t.label}}:t.type===`custom_message`?{kind:`canonical`,hasParentId:i,entry:{...r,type:t.type,customType:t.customType}}:t.type===`message`?{kind:`canonical`,hasParentId:i,entry:{...r,type:t.type,...t.message.role===`assistant`?{assistantRunId:I(t.message),...typeof t.message.responseId==`string`?{assistantResponseId:t.message.responseId}:{}}:{}}}:{kind:`canonical`,hasParentId:i,entry:{...r,type:t.type}}}function decodeSessionTranscriptReportFacts(e){if(t(e))switch(e.kind){case`canonical`:{let t=J.safeParse(e);return t.success?t.data:void 0}case`leaf`:{if(!t(e.entry))return;let n=S({...e.entry,type:`leaf`});return n?{kind:`leaf`,entry:n}:void 0}case`link`:{let t=w(e);return t?{kind:`link`,...t}:void 0}case`ignored`:return{kind:`ignored`};default:return}}const Y={version:1,report:null,navigation:{},reset:{},model:{},modelBytes:0,modelWithoutCheckpointBytes:0,withoutCustomDataBytes:0};function minimumNavigationBytes(e){return Buffer.byteLength(JSON.stringify({...Y,navigation:e,reset:e,model:e}))-4}const X=[minimumNavigationBytes({}),minimumNavigationBytes({type:0,id:0}),minimumNavigationBytes({type:0,id:0,parentId:0})];function navigationProjection(e,t,n,i){if(r(e))return c`CASE
      WHEN ${A(e,i)} AND ${A(e,n)} THEN CASE
      WHEN json_typeof(${i}::json) != 'object'
        OR coalesce(json_typeof(${i}::json -> 'message'), 'null') NOT IN ('object', 'null') THEN NULL
      ELSE json_build_object('version', 1,
        'report', ${n}::json,
        'navigation', ${projectTranscriptPayloadNavigationSql(e,t)}::json,
        'reset', ${projectResetBoundaryNavigationSql(e,i)}::json,
        'model', ${projectModelContextNavigationSql(e,t)}::json,
        'modelBytes', octet_length(${projectModelContextEventSql(e,t,c.lit(0))}),
        'modelWithoutCheckpointBytes', octet_length(${projectModelContextEventSql(e,t,c.lit(1))}),
        'withoutCustomDataBytes', octet_length(${k(e,t,[c.lit(`$.data`)])}))::text
      END ELSE NULL END`;let a=D(e,{...Object.fromEntries(Object.entries(Y).map(([e,t])=>[e,typeof t==`number`?c.lit(t):c`json(${JSON.stringify(t)})`])),report:c`json(${n})`,navigation:c`json(${projectTranscriptPayloadNavigationSql(e,t)})`,reset:c`json(${projectResetBoundaryNavigationSql(e,i)})`,model:c`json(${projectModelContextNavigationSql(e,t,void 0,c.lit(1))})`,modelBytes:c`octet_length(${projectModelContextEventSql(e,t,c.lit(0),void 0,void 0,c.lit(1))})`,modelWithoutCheckpointBytes:c`octet_length(${projectModelContextEventSql(e,t,c.lit(1),void 0,void 0,c.lit(1))})`,withoutCustomDataBytes:c`octet_length(json_remove(${t}, '$.data'))`});return c`CASE WHEN json_valid(${i}) AND json_valid(${n}) THEN CASE
    WHEN json_type(${t}) != 'object'
      OR coalesce(json_type(${t}, '$.message'), 'null') NOT IN ('object', 'null') THEN NULL
    ELSE ${a} END ELSE NULL END`}const Z=l(e=>s(e,t=>{let i=o(e),a=i.selectFrom(i.selectNoFrom([t(e=>e.eventJson).as(`event_json`),t(e=>e.reportJson).as(`report_json`)]).as(`input`)).select([`input.event_json`,`input.report_json`]).select(t=>!r(e)&&n()?c`CASE WHEN json_valid(${t.ref(`input.event_json`)})
                  THEN jsonb(${t.ref(`input.event_json`)}) ELSE ${t.ref(`input.event_json`)} END`.as(`event_projection`):t.ref(`input.event_json`).as(`event_projection`));return i.with(e=>e(`source`).notMaterialized(),()=>a).with(e=>e(`metadata`).materialized(),t=>t.selectFrom(`source`).select(t=>navigationProjection(e,t.ref(`source.event_projection`),t.ref(`source.report_json`),t.ref(`source.event_json`)).as(`navigation_json`))).selectFrom(`metadata`).select(t=>c`CASE WHEN ${A(e,t.ref(`metadata.navigation_json`))}
                AND octet_length(metadata.navigation_json) <= ${16384}
                THEN metadata.navigation_json ELSE NULL END`.as(`navigation_json`))}));function readTranscriptPayloadNavigation(e,t,n){return Z(e)({eventJson:t,reportJson:n})?.navigation_json??null}const Q=/* @__PURE__ */ new Set([`session`,`message`,`reset`,`compaction`,`custom_message`,`custom`]),$=/* @__PURE__ */ new Set([`openclaw.runtime-context`,`openclaw.cache-ttl`]),ee=/* @__PURE__ */ new Set([`user`,`assistant`,`toolResult`,`system`]);function discriminator(e,t){let n=T(e);return typeof n==`string`&&t.has(n)?n:null}function deriveTranscriptPredicateFields(e){let t=F(e,[`type`,`customType`,`display`,`message`]);if(!t.valid||t.maximumDepth>1e3)return{navigation_type:null,navigation_custom_type:null,navigation_display:0,message_role:null,navigation_last_type:null,navigation_last_custom_type:null,navigation_valid:0};let n=t.first.get(`message`),r=n?.kind===`object`?F(n.text,[`role`]).first.get(`role`):void 0;return{navigation_type:discriminator(t.first.get(`type`),Q),navigation_custom_type:discriminator(t.first.get(`customType`),$),navigation_display:+(T(t.first.get(`display`))===!0),message_role:discriminator(r,ee),navigation_last_type:discriminator(t.last.get(`type`),Q),navigation_last_custom_type:discriminator(t.last.get(`customType`),$),navigation_valid:1}}function assertTranscriptNavigationValid(e){if(e===0)throw Error(`malformed JSON in transcript navigation; run openclaw doctor to inspect the agent database`)}function readTranscriptStorageEncoding(e){if(r(e))return`UTF-8`;let t=a(e);if(!t)throw Error(`Transcript payload preparation requires admitted SQLite schema facts`);return t.textEncoding}const identityPayload=(e,t)=>({...deriveTranscriptPredicateFields(e),event_json:e,event_zstd:null,event_utf8_bytes:t,navigation_json:null});function prepareTranscriptPayload(e,t,n,i=readTranscriptStorageEncoding(e)){let a=Buffer.byteLength(t,`utf8`),o=i===`UTF-8`,s=identityPayload(t,o?a:null);if(r(e)||!o||a>4194304||t.includes(`\\u`)||t.includes(`\0`))return s;let c=B();if(a<1024||!t.isWellFormed())return s;let l=Buffer.from(t,`utf8`),u=c.compress(l,1,!0),d=a-Math.max(64,Math.ceil(a/10));if(u.byteLength>d)return s;let f;try{let e=n===void 0?JSON.parse(t):n;if(C([e]))return s;let r=projectSessionTranscriptReportFacts(e);f=JSON.stringify(r);let i=X[r.kind===`canonical`?r.entry.parentId===void 0?1:2:0];if(u.byteLength+Buffer.byteLength(f,`utf8`)+i>d)return s}catch{return s}let p=readTranscriptPayloadNavigation(e,t,f);return p===null||u.byteLength+Buffer.byteLength(p,`utf8`)>d?s:{...s,event_json:null,event_zstd:u,navigation_json:p}}function transcriptEventNavigationSql(e,t=`transcript_events`){return storedProjectionSql(e,`navigation`,c.ref(`${t}.event_json`),t)}function transcriptPredicateSql(e,t,n=`transcript_events`){let i=c.ref(`${n}.${t}`);if(r(e))return i;let a=c.ref(`${n}.navigation_type`),o=c.ref(`${n}.navigation_valid`),s=c.ref(`${n}.event_json`),l=c.ref(`${n}.navigation_json`),u=c`coalesce(${s}, ${P(e,l,c.lit(`$.navigation`),`json`)})`,d=A(e,u),f=c`CASE WHEN ${d} THEN ${u} ELSE '{}' END`,p;if(t===`navigation_valid`)p=c`coalesce(${d}, 0)`;else if(t===`navigation_display`)p=c`CASE WHEN json_type(${f}, '$.display') = 'true' THEN 1 ELSE 0 END`;else{let n=t===`navigation_custom_type`||t===`navigation_last_custom_type`,r=t===`message_role`?`$.message.role`:n?`$.customType`:`$.type`,i=t===`navigation_last_type`||t===`navigation_last_custom_type`?c`(SELECT value FROM json_each(${f}) WHERE key = ${c.lit(n?`customType`:`type`)} ORDER BY id DESC LIMIT 1)`:P(e,f,c.lit(r)),a=t===`message_role`?[`user`,`assistant`,`toolResult`,`system`]:n?[`openclaw.runtime-context`,`openclaw.cache-ttl`]:[`session`,`message`,`reset`,`compaction`,`custom_message`,`custom`];p=c`CASE WHEN ${i} IN (${c.join(a.map(e=>c.lit(e)))}) THEN ${i} END`}return c`CASE WHEN ${a} IS NOT NULL OR ${o} = 0
    THEN ${i} ELSE ${p} END`}function transcriptEventRunIdSql(e,t=`transcript_events`){let n=transcriptEventNavigationSql(e,t);return c`CASE WHEN ${E(e,n)}
    THEN ${P(e,n,c.lit(`$.message.__openclaw.runId`))} END`}function storedProjectionSql(e,t,n,r){let i=c.ref(`${r}.navigation_json`);return c`CASE WHEN ${i} IS NULL THEN ${n}
    ELSE ${P(e,i,c.val(`$.${t}`),`json`)} END`}function transcriptEventResetNavigationSql(e,t=`transcript_events`){return storedProjectionSql(e,`reset`,projectResetBoundaryNavigationSql(e,c.ref(`${t}.event_json`)),t)}function transcriptEventModelNavigationSql(e,t=`transcript_events`,n){return storedProjectionSql(e,`model`,projectModelContextNavigationSql(e,c.ref(`${t}.event_json`),n),t)}function transcriptEventDependencyNavigationSql(e,t,n=`event`){let r=transcriptPredicateSql(e,`navigation_type`,n),i=transcriptPredicateSql(e,`message_role`,n);return c`CASE
    WHEN ${r} IN ('custom', 'reset') OR ${r} IS NULL
      OR (${r} = 'message' AND ${t} = 0 AND ${i} = 'assistant')
    THEN ${transcriptEventModelNavigationSql(e,n)}
    ELSE '{}' END`}function transcriptEventModelBytesSql(e,t){let n=c.ref(`transcript_events.navigation_json`),r=c.ref(`transcript_events.event_json`);return c`CASE WHEN ${n} IS NULL
    THEN octet_length(${projectModelContextEventSql(e,r,t)})
    ELSE ${P(e,n,c`CASE WHEN ${t} = 1
      THEN '$.modelWithoutCheckpointBytes' ELSE '$.modelBytes' END`,`number`)} END`}function transcriptEventWithoutCustomDataBytesSql(e,t=`transcript_events`){let n=c.ref(`${t}.navigation_json`),r=c.ref(`${t}.event_json`);return c`CASE WHEN ${n} IS NULL
    THEN octet_length(${k(e,r,[c.lit(`$.data`)])})
    ELSE ${P(e,n,c.lit(`$.withoutCustomDataBytes`),`number`)} END`}function transcriptEventUtf8BytesSql(e=`transcript_events`){return c.ref(`${e}.event_utf8_bytes`)}function isHistoricalTranscriptActiveFactsSchema(e){if(r(e)){let t=i(e);return t!==void 0&&t.version<41&&!t.catalog.some(e=>e.table===`session_transcript_active_event_facts`)}let t=a(e);return t!==void 0&&t.userVersion<41&&!t.tables.has(`session_transcript_active_event_facts`)}export{stripToolResultDetails as C,projectModelContextMessages as S,projectModelContextJson as _,transcriptEventModelBytesSql as a,projectSessionModelContextNavigation as b,transcriptEventResetNavigationSql as c,transcriptEventWithoutCustomDataBytesSql as d,transcriptPredicateSql as f,projectModelContextEventSql as g,projectSessionTranscriptReportFacts as h,transcriptEventDependencyNavigationSql as i,transcriptEventRunIdSql as l,decodeSessionTranscriptReportFacts as m,prepareTranscriptPayload as n,transcriptEventModelNavigationSql as o,assertTranscriptNavigationValid as p,readTranscriptStorageEncoding as r,transcriptEventNavigationSql as s,isHistoricalTranscriptActiveFactsSchema as t,transcriptEventUtf8BytesSql as u,projectPostgresModelContextRowsSql as v,projectSessionModelContextEntry as x,projectTranscriptNavigationSql as y};