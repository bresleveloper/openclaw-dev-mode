import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { m as expressionBuilder, o as getNodeSqliteKysely, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import { n as jsonObjectFrom$1, t as jsonArrayFrom$1 } from "./sqlite-DAhWTcvk.mjs";
//#region src/infra/database-engine/json-values.ts
/** Project caller-selected rows as JSON text, retaining their explicit order. */
function jsonArrayFrom(db, rows, orderBy) {
	if (!isPostgresSqlConnection(db)) return jsonArrayFrom$1(rows);
	const eb = expressionBuilder();
	const order = orderBy.length ? sql`order by ${sql.join(orderBy.map((key) => sql`${eb.ref(`agg.${key}`)} asc nulls first`))}` : sql``;
	return sql`(select coalesce(json_agg(agg ${order}), '[]')::text from ${rows} as agg)`;
}
/** Project at most one caller-selected row, preserving SQL NULL when absent. */
function jsonObjectFrom(db, row) {
	return isPostgresSqlConnection(db) ? sql`(select row_to_json(obj)::text from ${row} as obj)` : jsonObjectFrom$1(row);
}
function jsonArrayValue(db, values) {
	return sql`${sql.raw(isPostgresSqlConnection(db) ? "json_build_array" : "json_array")}(${sql.join(values)})`;
}
function jsonObjectValue(db, fields) {
	return sql`${sql.raw(isPostgresSqlConnection(db) ? "json_build_object" : "json_object")}(${sql.join(Object.entries(fields).flatMap(([key, value]) => [sql.lit(key), value]))})`;
}
/** JSON-valued inputs remain JSON instead of becoming quoted strings. */
function jsonOrderedArray(db, value, orderBy) {
	const postgres = isPostgresSqlConnection(db);
	let aggregate = expressionBuilder().fn.agg(postgres ? "json_agg" : "json_group_array", [value]);
	for (const key of orderBy) aggregate = aggregate.orderBy(key, (order) => order.asc().nullsFirst());
	return postgres ? sql`coalesce(${aggregate}::text, '[]')` : aggregate;
}
/** Read a string from a caller-owned JSON tuple. */
function jsonArrayTextElement(db, value, index) {
	return isPostgresSqlConnection(db) ? getNodeSqliteKysely(db).fn("json_extract_path_text", [sql`${value}::json`, sql.val(String(index))]) : getNodeSqliteKysely(db).fn("json_extract", [value, sql.val(`$[${index}]`)]);
}
function jsonKeyPath(key) {
	return `$.${/^[A-Za-z_][A-Za-z0-9_]*$/u.test(key) ? key : JSON.stringify(key)}`;
}
function jsonExtractText(db, value, key) {
	const eb = expressionBuilder();
	return isPostgresSqlConnection(db) ? eb.fn("json_extract_path_text", [sql`${value}::json`, eb.val(key)]) : eb.fn("json_extract", [value, eb.val(jsonKeyPath(key))]);
}
function jsonOrderedTextArray(db, value, orderBy) {
	return isPostgresSqlConnection(db) ? sql`coalesce(array_to_json(array_agg(${value} order by ${orderBy}))::text, '[]')` : expressionBuilder().fn("json_group_array", [value]);
}
function jsonRemoveKey(db, value, key) {
	if (isPostgresSqlConnection(db)) return sql`(${value}::jsonb - ${key}::text)::text`;
	return expressionBuilder().fn("json_remove", [value, expressionBuilder().val(jsonKeyPath(key))]);
}
/** SQLite JSON paths at these boundaries name object keys, including nested keys. */
function objectPath(path) {
	return sql`string_to_array(substr(${path}, 3), '.')`;
}
function jsonPathValue(db, value, path, kind = "text") {
	if (!isPostgresSqlConnection(db)) return sql`json_extract(${value}, ${path})`;
	const extracted = sql`(${value}::jsonb ${sql.raw(kind === "json" ? "#>" : "#>>")} ${objectPath(path)})`;
	return sql`${extracted}${sql.raw(kind === "number" ? "::double precision" : kind === "json" ? "::text" : "")}`;
}
function jsonValid(db, value) {
	return isPostgresSqlConnection(db) ? sql`pg_input_is_valid(${value}, 'json')` : sql`json_valid(${value})`;
}
function jsonType(db, value) {
	return isPostgresSqlConnection(db) ? sql`jsonb_typeof(${value}::jsonb)` : sql`json_type(${value})`;
}
function jsonRemovePaths(db, value, paths) {
	if (!isPostgresSqlConnection(db)) return sql`json_remove(${value}, ${sql.join(paths)})`;
	let result = sql`${value}::jsonb`;
	for (const path of paths) result = sql`(${result} #- ${objectPath(path)})`;
	return sql`${result}::text`;
}
/** Set text/null, or a JSON-producing expression when json is true. */
function jsonSetPath(db, value, path, replacement, json = false) {
	if (!isPostgresSqlConnection(db)) return sql`json_set(${value}, ${path}, ${replacement})`;
	const next = json ? sql`${replacement}::jsonb` : sql`to_jsonb(${replacement}::text)`;
	return sql`jsonb_set(${value}::jsonb, ${objectPath(path)}, coalesce(${next}, 'null'::jsonb))::text`;
}
function jsonArrayElements(db, value) {
	return sql`${sql.raw(isPostgresSqlConnection(db) ? "jsonb_array_elements" : "json_each")}(${value}${sql.raw(isPostgresSqlConnection(db) ? "::jsonb" : "")})`;
}
function jsonPickObject(db, value, keys) {
	return isPostgresSqlConnection(db) ? sql`(SELECT coalesce(jsonb_object_agg(key, value), '{}'::jsonb)::text
        FROM jsonb_each(CASE WHEN jsonb_typeof(${value}::jsonb) = 'object' THEN ${value}::jsonb ELSE '{}'::jsonb END)
        WHERE key IN (${sql.join(keys)}))` : sql`(SELECT json_group_object(key, CASE type
    WHEN 'object' THEN json(value) WHEN 'array' THEN json(value)
    WHEN 'true' THEN json('true') WHEN 'false' THEN json('false')
    ELSE value END) FROM json_each(${value}) WHERE key IN (${sql.join(keys)}))`;
}
//#endregion
export { jsonExtractText as a, jsonOrderedArray as c, jsonPickObject as d, jsonRemoveKey as f, jsonValid as g, jsonType as h, jsonArrayValue as i, jsonOrderedTextArray as l, jsonSetPath as m, jsonArrayFrom as n, jsonObjectFrom as o, jsonRemovePaths as p, jsonArrayTextElement as r, jsonObjectValue as s, jsonArrayElements as t, jsonPathValue as u };
