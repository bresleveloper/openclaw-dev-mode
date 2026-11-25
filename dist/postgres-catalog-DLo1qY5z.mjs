import{isDeepStrictEqual}from"node:util";
//!src/infra/database-engine/postgres-catalog.ts
function hasPostgresCatalogColumn(e,t,n){return e.some(e=>e.table===t&&e.kind===`column`&&e.value!==null&&typeof e.value===`object`&&`name`in e.value&&e.value.name===n)}function expectedPostgresCatalog(e){const t=[];const add=(e,n,r)=>t.push({table:e,kind:n,value:r});for(const t of e.tables){add(t.name,`table`,null);t.columns.forEach((e,n)=>add(t.name,`column`,{...e,position:n+1}));if(t.pk.length)add(t.name,`primaryKey`,t.pk);t.unique.forEach(e=>add(t.name,`unique`,e));t.foreignKeys.forEach(e=>add(t.name,`foreignKey`,e));const n=e.objects.filter(e=>e.table===t.name);add(t.name,`indexes`,e.schema.endsWith(`_state`)?n.filter(e=>e.kind===`index`&&e.category!==`pendingPromotion`).length+(t.columns.some(e=>e.identity)?1:0):t.indexes);add(t.name,`checks`,n.filter(t=>t.kind===`check`&&(e.schema.endsWith(`_state`)||t.sql)).length)}return t}function canonical(e){return JSON.stringify(e,(e,t)=>t!==null&&typeof t===`object`&&!Array.isArray(t)?Object.fromEntries(Object.entries(t).toSorted(([e],[t])=>e.localeCompare(t,`en`))):t)}function assertPostgresCatalog(e,t){if(!isDeepStrictEqual(e.map(canonical).toSorted(),t.map(canonical).toSorted()))throw new Error(`PostgreSQL catalog differs from its generated contract; use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.`)}function readPostgresCatalog(e){if(!Array.isArray(e)||!e.every(e=>e!==null&&typeof e===`object`&&typeof e.table===`string`&&typeof e.kind===`string`&&`value`in e))throw new Error(`PostgreSQL did not return catalog facts`);return e}function postgresCatalogQuery(e,t=false){const n=`'${e.replaceAll(`'`,`''`)}'`;const columns=(e,t)=>`(SELECT jsonb_agg(a.attname ORDER BY k.ordinality) FROM unnest(${t}) WITH ORDINALITY k(num, ordinality) JOIN pg_catalog.pg_attribute a ON a.attrelid = ${e} AND a.attnum = k.num)`;const action=e=>`CASE ${e} WHEN 'a' THEN 'NO ACTION' WHEN 'r' THEN 'RESTRICT' WHEN 'c' THEN 'CASCADE' WHEN 'n' THEN 'SET NULL' WHEN 'd' THEN 'SET DEFAULT' END`;return`WITH relations AS (
    SELECT c.oid, c.relname FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = ${n} AND c.relkind IN ('r', 'p')
  ), attributes AS (
    SELECT r.relname, a.attname, a.atttypid, a.atttypmod, a.attnotnull,
      a.attidentity, a.attnum, a.attgenerated, a.attcollation,
      pg_catalog.pg_get_expr(d.adbin, d.adrelid) AS default_expression
    FROM relations r JOIN pg_catalog.pg_attribute a ON a.attrelid = r.oid
    LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = r.oid AND d.adnum = a.attnum
    WHERE a.attnum > 0 AND NOT a.attisdropped
  ), facts AS (
    SELECT r.relname AS "table", 'table' AS kind, 'null'::jsonb AS value FROM relations r
    UNION ALL SELECT a.relname, 'column', jsonb_build_object(
      'name', a.attname, 'type', pg_catalog.format_type(a.atttypid, a.atttypmod),
      'nullable', NOT a.attnotnull, 'identity', a.attidentity = 'd', 'position', a.attnum,
      'default', regexp_replace(a.default_expression, '::(text|bigint|double precision)$', ''))
      FROM attributes a
    UNION ALL SELECT r.relname, CASE c.contype WHEN 'p' THEN 'primaryKey' ELSE 'unique' END,
      ${columns(`r.oid`,`c.conkey`)} FROM relations r JOIN pg_catalog.pg_constraint c ON c.conrelid = r.oid WHERE c.contype IN ('p', 'u')
    UNION ALL SELECT r.relname, 'foreignKey', jsonb_build_object(
      'columns', ${columns(`r.oid`,`c.conkey`)}, 'target', target.relname,
      'targetColumns', ${columns(`c.confrelid`,`c.confkey`)},
      'onUpdate', ${action(`c.confupdtype`)}, 'onDelete', ${action(`c.confdeltype`)},
      'deferrable', c.condeferrable, 'deferred', c.condeferred)
      FROM relations r JOIN pg_catalog.pg_constraint c ON c.conrelid = r.oid
      JOIN pg_catalog.pg_class target ON target.oid = c.confrelid WHERE c.contype = 'f'
    UNION ALL SELECT r.relname, 'indexes', to_jsonb((SELECT count(*) FROM pg_catalog.pg_index i WHERE i.indrelid = r.oid)) FROM relations r
    UNION ALL SELECT r.relname, 'checks', to_jsonb((SELECT count(*) FROM pg_catalog.pg_constraint c WHERE c.conrelid = r.oid AND c.contype = 'c')) FROM relations r
    ${t?`UNION ALL SELECT r.relname, 'constraintDefinition', jsonb_build_object('name', c.conname, 'definition', pg_catalog.pg_get_constraintdef(c.oid)) FROM relations r JOIN pg_catalog.pg_constraint c ON c.conrelid = r.oid
    UNION ALL SELECT r.relname, 'indexDefinition', jsonb_build_object('name', c.relname, 'definition', pg_catalog.pg_get_indexdef(i.indexrelid), 'valid', i.indisvalid) FROM relations r JOIN pg_catalog.pg_index i ON i.indrelid = r.oid JOIN pg_catalog.pg_class c ON c.oid = i.indexrelid
    UNION ALL SELECT a.relname, 'columnDefinition', jsonb_build_object('name', a.attname, 'default', a.default_expression, 'generated', a.attgenerated, 'identity', a.attidentity, 'collation', a.attcollation::regcollation::text) FROM attributes a
    UNION ALL SELECT r.relname, 'triggerDefinition', jsonb_build_object('name', t.tgname, 'definition', pg_catalog.pg_get_triggerdef(t.oid), 'enabled', t.tgenabled, 'function', pg_catalog.pg_get_functiondef(t.tgfoid)) FROM relations r JOIN pg_catalog.pg_trigger t ON t.tgrelid = r.oid WHERE NOT t.tgisinternal
    UNION ALL SELECT c.relname, 'viewDefinition', to_jsonb(pg_catalog.pg_get_viewdef(c.oid)) FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = ${n} AND c.relkind IN ('v', 'm')
    UNION ALL SELECT c.cfgname, 'textSearchDefinition', jsonb_build_object('token', m.maptokentype, 'order', m.mapseqno, 'dictionary', d.dictname, 'namespace', dn.nspname)
      FROM pg_catalog.pg_ts_config c JOIN pg_catalog.pg_namespace n ON n.oid = c.cfgnamespace
      JOIN pg_catalog.pg_ts_config_map m ON m.mapcfg = c.oid JOIN pg_catalog.pg_ts_dict d ON d.oid = m.mapdict
      JOIN pg_catalog.pg_namespace dn ON dn.oid = d.dictnamespace WHERE n.nspname = ${n} AND c.cfgname = 'openclaw_simple_unaccent'
    UNION ALL SELECT p.proname, 'functionDefinition', to_jsonb(pg_catalog.pg_get_functiondef(p.oid)) FROM pg_catalog.pg_proc p JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = ${n} AND p.proname = 'openclaw_vector' AND p.prokind = 'f'`:``}
  ) SELECT coalesce(jsonb_agg(facts), '[]'::jsonb) AS catalog FROM facts`}export{readPostgresCatalog as a,postgresCatalogQuery as i,expectedPostgresCatalog as n,hasPostgresCatalogColumn as r,assertPostgresCatalog as t};