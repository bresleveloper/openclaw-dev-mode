//!src/infra/sqlite-maintenance-cache.ts
function configureSqliteMaintenanceCache(e){e.exec(`PRAGMA cache_size = -65536;`)}export{configureSqliteMaintenanceCache as t};