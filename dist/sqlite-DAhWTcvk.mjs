import { _ as ReferenceNode, b as AliasNode, g as ValueNode, h as ExpressionWrapper, p as sql, v as ColumnNode, x as IdentifierNode, y as TableNode } from "./kysely-sync-9fPQaMlh.mjs";
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/util/json-object-args.js
function getJsonObjectArgs(node, table) {
	const args = [];
	for (const { selection: s } of node.selections ?? []) if (ReferenceNode.is(s) && ColumnNode.is(s.column)) args.push(colName(s.column.column.name), colRef(table, s.column.column.name));
	else if (ColumnNode.is(s)) args.push(colName(s.column.name), colRef(table, s.column.name));
	else if (AliasNode.is(s) && IdentifierNode.is(s.alias)) args.push(colName(s.alias.name), colRef(table, s.alias.name));
	else throw new Error(`can't extract column names from the select query node`);
	return args;
}
function colName(col) {
	return new ExpressionWrapper(ValueNode.createImmediate(col));
}
function colRef(table, col) {
	return new ExpressionWrapper(ReferenceNode.create(ColumnNode.create(col), TableNode.create(table)));
}
//#endregion
//#region node_modules/.pnpm/kysely@0.29.6/node_modules/kysely/dist/helpers/sqlite.js
/**
* A SQLite helper for aggregating a subquery into a JSON array.
*
* NOTE: This helper only works correctly if you've installed the `ParseJSONResultsPlugin`.
* Otherwise the nested selections will be returned as JSON strings.
*
* The plugin can be installed like this:
*
* ```ts
* import * as Sqlite from 'better-sqlite3'
* import { Kysely, ParseJSONResultsPlugin, SqliteDialect } from 'kysely'
* import type { Database } from 'type-editor' // imaginary module
*
* const db = new Kysely<Database>({
*   dialect: new SqliteDialect({
*     database: new Sqlite(':memory:')
*   }),
*   plugins: [new ParseJSONResultsPlugin()]
* })
* ```
*
* ### Examples
*
* ```ts
* import { jsonArrayFrom } from 'kysely/helpers/sqlite'
*
* const result = await db
*   .selectFrom('person')
*   .select((eb) => [
*     'id',
*     jsonArrayFrom(
*       eb.selectFrom('pet')
*         .select(['pet.id as pet_id', 'pet.name'])
*         .whereRef('pet.owner_id', '=', 'person.id')
*         .orderBy('pet.name')
*     ).as('pets')
*   ])
*   .execute()
*
* result[0]?.id
* result[0]?.pets[0].pet_id
* result[0]?.pets[0].name
* ```
*
* The generated SQL (SQLite):
*
* ```sql
* select "id", (
*   select coalesce(json_group_array(json_object(
*     'pet_id', "agg"."pet_id",
*     'name', "agg"."name"
*   )), '[]') from (
*     select "pet"."id" as "pet_id", "pet"."name"
*     from "pet"
*     where "pet"."owner_id" = "person"."id"
*     order by "pet"."name"
*   ) as "agg"
* ) as "pets"
* from "person"
* ```
*/
function jsonArrayFrom(expr) {
	return sql`(select coalesce(json_group_array(json_object(${sql.join(getSqliteJsonObjectArgs(expr.toOperationNode(), "agg"))})), '[]') from ${expr} as agg)`;
}
/**
* A SQLite helper for turning a subquery into a JSON object.
*
* The subquery must only return one row.
*
* NOTE: This helper only works correctly if you've installed the `ParseJSONResultsPlugin`.
* Otherwise the nested selections will be returned as JSON strings.
*
* The plugin can be installed like this:
*
* ```ts
* import * as Sqlite from 'better-sqlite3'
* import { Kysely, ParseJSONResultsPlugin, SqliteDialect } from 'kysely'
* import type { Database } from 'type-editor' // imaginary module
*
* const db = new Kysely<Database>({
*   dialect: new SqliteDialect({
*     database: new Sqlite(':memory:')
*   }),
*   plugins: [new ParseJSONResultsPlugin()]
* })
* ```
*
* ### Examples
*
* ```ts
* import { jsonObjectFrom } from 'kysely/helpers/sqlite'
*
* const result = await db
*   .selectFrom('person')
*   .select((eb) => [
*     'id',
*     jsonObjectFrom(
*       eb.selectFrom('pet')
*         .select(['pet.id as pet_id', 'pet.name'])
*         .whereRef('pet.owner_id', '=', 'person.id')
*         .where('pet.is_favorite', '=', true)
*     ).as('favorite_pet')
*   ])
*   .execute()
*
* result[0]?.id
* result[0]?.favorite_pet?.pet_id
* result[0]?.favorite_pet?.name
* ```
*
* The generated SQL (SQLite):
*
* ```sql
* select "id", (
*   select json_object(
*     'pet_id', "obj"."pet_id",
*     'name', "obj"."name"
*   ) from (
*     select "pet"."id" as "pet_id", "pet"."name"
*     from "pet"
*     where "pet"."owner_id" = "person"."id"
*     and "pet"."is_favorite" = ?
*   ) as obj
* ) as "favorite_pet"
* from "person";
* ```
*/
function jsonObjectFrom(expr) {
	return sql`(select json_object(${sql.join(getSqliteJsonObjectArgs(expr.toOperationNode(), "obj"))}) from ${expr} as obj)`;
}
function getSqliteJsonObjectArgs(node, table) {
	try {
		return getJsonObjectArgs(node, table);
	} catch {
		throw new Error("SQLite jsonArrayFrom and jsonObjectFrom functions can only handle explicit selections due to limitations of the json_object function. selectAll() is not allowed in the subquery.");
	}
}
//#endregion
export { jsonObjectFrom as n, jsonArrayFrom as t };
