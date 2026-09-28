//#region src/infra/sqlite-maintenance-cache.ts
/** Configure page-cache headroom for disposable migration and inspection handles. */
function configureSqliteMaintenanceCache(database) {
	database.exec("PRAGMA cache_size = -65536;");
}
//#endregion
export { configureSqliteMaintenanceCache as t };
