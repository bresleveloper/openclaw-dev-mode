import{m as asSafeIntegerInRange,s as asFiniteNumber}from"./number-coercion-B3CfI447.mjs";import"./src-0ci69Prg.mjs";import{r as asNullableRecord}from"./record-coerce-BTbqdJ3-.mjs";import{n as safeParseJsonRecord}from"./json-coercion-DNNwq4_v.mjs";import{a as executeSqliteQueryTakeFirstSync,c as iterateSqliteQuerySync,i as executeSqliteQuerySync,s as getNodeSqliteKysely}from"./kysely-sync-Dl78faM1.mjs";import{a as tableExists,n as ensureColumn,o as tableHasColumn}from"./openclaw-state-db-schema-helpers-4Hs1ye38.mjs";import{a as runSqliteImmediateTransactionSync}from"./sqlite-transaction-mUAqxIBY.mjs";import{t as coerceRequiredSqliteNumber}from"./sqlite-number-B9pFqi3P.mjs";import{n as estimateAcpSessionRowBytes,t as estimateAcpEventRowBytes}from"./event-ledger-bytes-CfGRQ6_Q.mjs";import{t as buildApprovalResolutionRef}from"./approval-resolution-ref-BUSJoRFO.mjs";import{d as pruneDeliveryQueueTombstones,i as projectDeliveryQueueTerminalEntry,n as inferDeliveryQueueFailureRetention,x as deriveDeliveryQueueRetentionColumns}from"./delivery-queue-sqlite.types-CRKQYIFx.mjs";import{r as isCanonicalOperatorApprovalKind}from"./openclaw-state-db-operator-approval-migration-C0pS4Fmo.mjs";
//!src/state/openclaw-state-db-delivery-queue-backfill.ts
function nonNegativeSafeInteger(e){const t=typeof e===`bigint`?Number(e):e;return typeof t===`number`&&Number.isSafeInteger(t)&&t>=0?t:void 0}function compactLegacyDeliveryQueueFailures(e){const t=Date.now();const n=e.prepare(`UPDATE delivery_queue_entries SET entry_json = @entryJson,
      retention_id_prefix = @retention_id_prefix, retention_max_age_ms = @retention_max_age_ms,
      retention_max_entries = @retention_max_entries
      WHERE queue_name = @queueName AND id = @id AND status = 'pending' AND entry_json = @previousJson`);const r=e.prepare(`SELECT queue_name, id, status, retry_count, entry_json, updated_at, failed_at, recovery_state
       FROM delivery_queue_entries WHERE status IN ('pending', 'failed')`);r.setReadBigInts(true);const i=r.all();const a=e.prepare(`DELETE FROM delivery_queue_entries WHERE queue_name = ? AND id = ? AND status = 'failed'`);const o=e.prepare(`UPDATE delivery_queue_entries
        SET entry_kind = NULL, session_key = NULL, channel = NULL, target = NULL,
            account_id = NULL, retry_count = @retryCount, last_attempt_at = NULL,
            last_error = NULL, platform_send_started_at = NULL, entry_json = @entryJson,
            retention_id_prefix = @retention_id_prefix, retention_max_age_ms = @retention_max_age_ms,
            retention_max_entries = @retention_max_entries,
            enqueued_at = @failedAt, failed_at = @failedAt, recovery_state = @recoveryState
      WHERE queue_name = @queueName AND id = @id AND status = 'failed'`);for(const e of i){if(e.recovery_state===`settlement_pending`)continue;const r=safeParseJsonRecord(String(e.entry_json));const i=r??{};const s=String(e.queue_name);const c=String(e.id);if(e.status===`pending`){if(i.retainOnFailure!==true&&inferDeliveryQueueFailureRetention(i,c,s,true)){const t=JSON.stringify({...i,retainOnFailure:true});n.run({entryJson:t,queueName:s,id:c,previousJson:String(e.entry_json),...deriveDeliveryQueueRetentionColumns(c,t)})}continue}const l=nonNegativeSafeInteger(e.failed_at)??nonNegativeSafeInteger(e.updated_at)??t;const u=Math.max(nonNegativeSafeInteger(e.retry_count)??0,nonNegativeSafeInteger(i.retryCount)??0);const d=r?inferDeliveryQueueFailureRetention(i,c,s,true):`permanent`;if(!d){a.run(s,c);continue}const f=projectDeliveryQueueTerminalEntry({id:c,retryCount:u},l,`failed`,d);const p=JSON.stringify(f);o.run({retryCount:u,entryJson:p,...deriveDeliveryQueueRetentionColumns(c,p),failedAt:l,recoveryState:f.recoveryState??null,queueName:s,id:c})}pruneDeliveryQueueTombstones(e,t)}
//!src/state/openclaw-state-db-legacy-backfills.ts
function ensureOperatorApprovalResolutionRefs(e){if(!tableExists(e,`operator_approvals`))return;runSqliteImmediateTransactionSync(e,()=>{ensureColumn(e,`operator_approvals`,`resolution_ref TEXT`);const t=e.prepare(`SELECT approval_id, kind, resolution_ref FROM operator_approvals`).all();const n=e.prepare(`UPDATE operator_approvals SET resolution_ref = ? WHERE approval_id = ?`);for(const e of t){if(typeof e.approval_id!==`string`||!isCanonicalOperatorApprovalKind(e.kind))throw new Error(`operator approval row cannot be assigned a transport reference`);const t=buildApprovalResolutionRef({approvalId:e.approval_id,approvalKind:e.kind});if(e.resolution_ref!==t)n.run(t,e.approval_id)}if(e.prepare(`SELECT canonical.approval_id
         FROM operator_approvals AS canonical
         JOIN operator_approvals AS referenced
           ON canonical.approval_id = referenced.resolution_ref
         WHERE canonical.approval_id <> referenced.approval_id
         LIMIT 1`).get())throw new Error(`operator approval ids conflict with durable transport references`);e.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref
        ON operator_approvals(resolution_ref);
    `)})}function nullableTextValue(e,t){if(!e||!Object.hasOwn(e,t))return;const n=e[t];return typeof n===`string`||n===null?n:void 0}function repairLegacySubagentRetainedResults(e){if(!tableExists(e,`subagent_runs`))return;const repair=()=>{const t=tableHasColumn(e,`subagent_runs`,`pending_final_delivery_payload_json`);const n=e.prepare(t?`SELECT run_id, payload_json, pending_final_delivery_payload_json FROM subagent_runs`:`SELECT run_id, payload_json FROM subagent_runs`).all();const r=e.prepare(`UPDATE subagent_runs
          SET payload_json = ?
        WHERE run_id = ?`);for(const e of n){const t=safeParseJsonRecord(e.payload_json)??null;const n=t?asNullableRecord(t.parentCompletion):null;const i=n?.completionTarget===`parent`?n:t;const a=i?asNullableRecord(i.completion):null;if(!i||!a)continue;const o=asNullableRecord(i.delivery);const s=o?asNullableRecord(o.payload):null;const c=e.pending_final_delivery_payload_json?safeParseJsonRecord(e.pending_final_delivery_payload_json)??null:null;if(!Boolean(s&&(Object.hasOwn(s,`frozenResultText`)||Object.hasOwn(s,`fallbackFrozenResultText`))||c&&(Object.hasOwn(c,`frozenResultText`)||Object.hasOwn(c,`fallbackFrozenResultText`))))continue;const l=nullableTextValue(s,`frozenResultText`)??nullableTextValue(c,`frozenResultText`);const u=nullableTextValue(s,`fallbackFrozenResultText`)??nullableTextValue(c,`fallbackFrozenResultText`);if(nullableTextValue(a,`resultText`)==null&&l!==void 0)a.resultText=l;if(nullableTextValue(a,`fallbackResultText`)==null&&u!==void 0)a.fallbackResultText=u;delete s?.frozenResultText;delete s?.fallbackFrozenResultText;r.run(JSON.stringify(t),e.run_id)}};if(e.isTransaction){repair();return}runSqliteImmediateTransactionSync(e,repair)}function repairLegacySubagentExecutionPayloads(e){if(!tableExists(e,`subagent_runs`))return;e.exec(`
    UPDATE subagent_runs
    SET payload_json = json_remove(
      CASE
        WHEN json_extract(payload_json, '$.pauseReason') = 'sessions_yield'
          AND json_extract(payload_json, '$.execution.status') <> 'terminal'
          AND json_type(payload_json, '$.endedAt') IN ('integer', 'real')
        THEN json_remove(json_set(
          payload_json,
          '$.execution.status', 'terminal',
          '$.execution.endedAt', json_extract(payload_json, '$.endedAt')
        ), '$.execution.outcome')
        WHEN (json_type(payload_json, '$.killReconciliation') = 'object'
          OR json_extract(payload_json, '$.endedReason') = 'subagent-killed')
          AND json_extract(payload_json, '$.execution.status') <> 'terminal'
          AND json_type(payload_json, '$.endedAt') IN ('integer', 'real')
          AND json_type(payload_json, '$.outcome') = 'object'
        THEN json_set(
          payload_json,
          '$.execution.status', 'terminal',
          '$.execution.endedAt', json_extract(payload_json, '$.endedAt'),
          '$.execution.outcome', json_extract(payload_json, '$.outcome')
        )
        ELSE payload_json
      END,
      '$.startedAt', '$.endedAt', '$.outcome'
    )
    WHERE json_valid(payload_json)
      AND (json_type(payload_json, '$.startedAt') IS NOT NULL
        OR json_type(payload_json, '$.endedAt') IS NOT NULL
        OR json_type(payload_json, '$.outcome') IS NOT NULL);
  `)}function backfillAcpReplayEstimatedBytes(e,t=false){if(!tableExists(e,`acp_replay_events`)||!tableHasColumn(e,`acp_replay_events`,`estimated_bytes`))return;const n=`state.repair.acpReplayUtf8Accounting`;const r=tableExists(e,`config_machine_state`)?getNodeSqliteKysely(e):void 0;if(!t&&r&&executeSqliteQueryTakeFirstSync(e,r.selectFrom(`config_machine_state`).select(`state_key`).where(`state_key`,`=`,n)))return;const i=getNodeSqliteKysely(e);const a=e.prepare(`UPDATE acp_replay_events SET estimated_bytes = ? WHERE session_id = ? AND seq = ?`);for(const t of iterateSqliteQuerySync(e,i.selectFrom(`acp_replay_events`).select([`session_id`,`seq`,`session_key`,`run_id`,`update_json`,`estimated_bytes`]))){const e=estimateAcpEventRowBytes({sessionId:t.session_id,sessionKey:t.session_key,runId:t.run_id,updateJson:t.update_json});if(coerceRequiredSqliteNumber(t.estimated_bytes)!==e)a.run(e,t.session_id,t.seq)}const o=e.prepare(`UPDATE acp_replay_sessions SET estimated_bytes = ? WHERE session_id = ?`);for(const t of iterateSqliteQuerySync(e,i.selectFrom(`acp_replay_sessions as s`).select([`s.session_id`,`s.session_key`,`s.cwd`,`s.estimated_bytes`]).select(e=>e.fn.coalesce(e.selectFrom(`acp_replay_events as e`).select(e=>e.fn.sum(`e.estimated_bytes`).as(`total`)).whereRef(`e.session_id`,`=`,`s.session_id`),e.val(0)).as(`event_bytes`)))){const e=estimateAcpSessionRowBytes({sessionId:t.session_id,sessionKey:t.session_key,cwd:t.cwd})+coerceRequiredSqliteNumber(t.event_bytes);if(coerceRequiredSqliteNumber(t.estimated_bytes)!==e)o.run(e,t.session_id)}if(r)executeSqliteQuerySync(e,r.insertInto(`config_machine_state`).values({state_key:n,value_json:`true`,updated_at_ms:Date.now()}).onConflict(e=>e.column(`state_key`).doNothing()))}function backfillCronRunLogEntryJson(e){if(!tableExists(e,`cron_run_logs`)||!tableHasColumn(e,`cron_run_logs`,`entry_json`))return;const t=e.prepare(`SELECT store_key, job_id, seq, ts
         FROM cron_run_logs
        WHERE entry_json = '{}'`).all();if(t.length===0)return;const n=e.prepare(`UPDATE cron_run_logs
        SET entry_json = ?
      WHERE store_key = ? AND job_id = ? AND seq = ?`);for(const e of t)n.run(JSON.stringify({ts:coerceRequiredSqliteNumber(e.ts),jobId:e.job_id,action:`finished`}),e.store_key,e.job_id,e.seq)}function textField(e,t){const n=e?.[t];return typeof n===`string`&&n.trim()?n:null}function backfillCronJobsFromJobJson(e){if(!tableExists(e,`cron_jobs`)||!tableHasColumn(e,`cron_jobs`,`job_json`)||!tableHasColumn(e,`cron_jobs`,`payload_kind`))return;const t=e.prepare(`SELECT store_key, job_id, job_json, updated_at
         FROM cron_jobs
        WHERE payload_kind = 'message'
           OR name = ''`).all();if(t.length===0)return;const n=e.prepare(`UPDATE cron_jobs
        SET name = ?,
            enabled = ?,
            agent_id = ?,
            payload_kind = ?,
            runtime_updated_at_ms = ?
      WHERE store_key = ?
        AND job_id = ?`);for(const e of t){const t=safeParseJsonRecord(e.job_json)??null;if(!t)continue;const r=asNullableRecord(t.schedule);const i=asNullableRecord(t.payload);const a=textField(r,`kind`);const o=textField(i,`kind`);const s=a===`at`&&textField(r,`at`);const c=a===`every`&&asFiniteNumber(r?.everyMs)!=null;const l=a===`cron`&&textField(r,`expr`);const u=o===`systemEvent`&&textField(i,`text`);const d=o===`agentTurn`&&textField(i,`message`);if(!r||!i||!s&&!c&&!l||!u&&!d)continue;n.run(textField(t,`name`)??e.job_id,t.enabled===false?0:1,textField(t,`agentId`),o,asFiniteNumber(t.updatedAtMs)??(coerceRequiredSqliteNumber(e.updated_at)||0),e.store_key,e.job_id)}}function backfillDeliveryQueueEntriesFromEntryJson(e){if(!tableExists(e,`delivery_queue_entries`)||!tableHasColumn(e,`delivery_queue_entries`,`entry_json`)||!tableHasColumn(e,`delivery_queue_entries`,`retry_count`))return;compactLegacyDeliveryQueueFailures(e);const t=e.prepare(`SELECT queue_name, id, entry_json
         FROM delivery_queue_entries
        WHERE status = 'pending'
          AND (retry_count = 0
            OR last_attempt_at IS NULL
            OR last_error IS NULL
            OR recovery_state IS NULL
            OR platform_send_started_at IS NULL
            OR entry_kind IS NULL
            OR session_key IS NULL
            OR channel IS NULL
            OR target IS NULL
            OR account_id IS NULL)`).all();if(t.length===0)return;const n=e.prepare(`UPDATE delivery_queue_entries
        SET entry_kind = COALESCE(?, entry_kind),
            session_key = COALESCE(?, session_key),
            channel = COALESCE(?, channel),
            target = COALESCE(?, target),
            account_id = COALESCE(?, account_id),
            retry_count = ?,
            last_attempt_at = COALESCE(?, last_attempt_at),
            last_error = COALESCE(?, last_error),
            recovery_state = COALESCE(?, recovery_state),
            platform_send_started_at = COALESCE(?, platform_send_started_at)
      WHERE queue_name = ?
        AND id = ?`);for(const e of t){const t=safeParseJsonRecord(e.entry_json)??null;if(!t)continue;const r=asNullableRecord(t.session);const i=asNullableRecord(t.route);const a=asNullableRecord(t.deliveryContext);n.run(textField(t,`kind`),textField(t,`sessionKey`)??textField(r,`key`),textField(t,`channel`)??textField(i,`channel`)??textField(a,`channel`),textField(t,`to`)??textField(i,`to`)??textField(a,`to`),textField(t,`accountId`)??textField(i,`accountId`)??textField(a,`accountId`),asSafeIntegerInRange(t.retryCount,{min:0})??0,asSafeIntegerInRange(t.lastAttemptAt,{min:0})??null,textField(t,`lastError`),textField(t,`recoveryState`),asSafeIntegerInRange(t.platformSendStartedAt,{min:0})??null,e.queue_name,e.id)}}export{ensureOperatorApprovalResolutionRefs as a,backfillDeliveryQueueEntriesFromEntryJson as i,backfillCronJobsFromJobJson as n,repairLegacySubagentExecutionPayloads as o,backfillCronRunLogEntryJson as r,repairLegacySubagentRetainedResults as s,backfillAcpReplayEstimatedBytes as t};