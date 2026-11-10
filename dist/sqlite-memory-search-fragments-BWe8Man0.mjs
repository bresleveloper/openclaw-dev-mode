//#region src/infra/database-engine/sqlite-memory-search-fragments.ts
function buildTextSchema(fragment, tokenizeClause) {
	if (fragment.kind === "body-fts") return `CREATE VIRTUAL TABLE IF NOT EXISTS ${fragment.tableName} USING fts5(\n  text,\n  id UNINDEXED,\n  path UNINDEXED,\n  source UNINDEXED,\n  model UNINDEXED,\n  start_line UNINDEXED,\n  end_line UNINDEXED\n${tokenizeClause});`;
	return `
      CREATE VIRTUAL TABLE IF NOT EXISTS ${fragment.tableName} USING fts5(
        path,
        source UNINDEXED
        ${tokenizeClause}
      );
    `;
}
function tokenizerClause(tokenizer) {
	return tokenizer === "trigram" ? `, tokenize='trigram case_sensitive 0'` : "";
}
/** Canonical DDL shared by lazy creation and deployed-schema recovery. */
function buildSqliteMemoryBodyFtsSchema(params) {
	return buildTextSchema({
		kind: "body-fts",
		tableName: params.tableName
	}, params.tokenizeClause);
}
function buildSqliteMemoryPathFtsSchema(params) {
	return buildTextSchema({
		kind: "path-fts",
		tableName: "memory_index_paths_fts"
	}, params.tokenizeClause);
}
function getSqliteMemorySearchFtsSchemas() {
	return ["body-fts", "path-fts"].flatMap((kind) => {
		const fragment = {
			kind,
			tableName: kind === "body-fts" ? "memory_index_chunks_fts" : "memory_index_paths_fts",
			tokenizer: "unicode61"
		};
		return [
			buildTextSchema(fragment, ""),
			buildTextSchema(fragment, ", tokenize='unicode61'"),
			buildTextSchema(fragment, ", tokenize=\"unicode61\""),
			buildTextSchema(fragment, tokenizerClause("trigram"))
		];
	});
}
//#endregion
export { buildSqliteMemoryPathFtsSchema as n, getSqliteMemorySearchFtsSchemas as r, buildSqliteMemoryBodyFtsSchema as t };
