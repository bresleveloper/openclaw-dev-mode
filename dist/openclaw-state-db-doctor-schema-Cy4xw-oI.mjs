import { t as LEGACY_SKILL_WORKSHOP_COLLECTION_REVIEWS_INDEX } from "./openclaw-state-db-schema-migration-required-x5nU_jtc.mjs";
//#region src/state/openclaw-state-db-doctor-schema.ts
const LEGACY_SKILL_WORKSHOP_COLLECTION_REVIEWS_INDEX_SQL = "CREATE INDEX idx_skill_workshop_collection_reviews_workspace_time ON skill_workshop_collection_reviews(workspace_dir, create_time DESC, review_id DESC)";
function normalizeSqliteCatalogSql(sql) {
	return sql.replace(/\s+/gu, " ").replace(/\s*([(),])\s*/gu, "$1").trim();
}
function withSqliteWritableSchema(database, operation) {
	database.enableDefensive?.(false);
	database.exec("PRAGMA writable_schema = ON;");
	try {
		return operation();
	} finally {
		try {
			database.exec("PRAGMA writable_schema = RESET;");
		} finally {
			database.enableDefensive?.(true);
		}
	}
}
/** Detect only the known v15 review index left behind after its column was retired. */
function hasDanglingSkillWorkshopCollectionReviewIndex(database) {
	return withSqliteWritableSchema(database, () => inspectSkillWorkshopCollectionReviewIndex(database));
}
function inspectSkillWorkshopCollectionReviewIndex(database) {
	const index = database.prepare("SELECT tbl_name, rootpage, sql FROM sqlite_schema WHERE type = 'index' AND name = ?").get(LEGACY_SKILL_WORKSHOP_COLLECTION_REVIEWS_INDEX);
	if (index?.tbl_name !== "skill_workshop_collection_reviews" || typeof index.rootpage !== "number" || index.rootpage <= 0 || typeof index.sql !== "string" || normalizeSqliteCatalogSql(index.sql) !== normalizeSqliteCatalogSql(LEGACY_SKILL_WORKSHOP_COLLECTION_REVIEWS_INDEX_SQL)) return false;
	const columns = database.prepare("PRAGMA table_info(skill_workshop_collection_reviews)").all();
	return columns.some((column) => column.name === "owner_agent_id") && !columns.some((column) => column.name === "workspace_dir");
}
/** Doctor can inspect the exact legacy defect before its repair transaction. */
function openDoctorStateSchemaReadAdmission(database) {
	if (!hasDanglingSkillWorkshopCollectionReviewIndex(database)) return;
	database.enableDefensive?.(false);
	try {
		database.exec("PRAGMA writable_schema = ON;");
	} catch (error) {
		database.enableDefensive?.(true);
		throw error;
	}
	let open = true;
	return () => {
		if (!open) return;
		open = false;
		try {
			database.exec("PRAGMA writable_schema = RESET;");
		} finally {
			database.enableDefensive?.(true);
		}
	};
}
//#endregion
export { openDoctorStateSchemaReadAdmission as n, withSqliteWritableSchema as r, hasDanglingSkillWorkshopCollectionReviewIndex as t };
