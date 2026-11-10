//#region src/infra/sqlite-native-exclusion.ts
/**
* Acquire native exclusion on the caller's settled, already-owned connection.
* Leaves the transaction open; the caller owns settlement and final close.
* This grants no application authority and does not change journal mode.
*/
function beginSqliteConnectionExclusion(database) {
	database.exec("PRAGMA locking_mode = EXCLUSIVE; BEGIN EXCLUSIVE;");
}
//#endregion
export { beginSqliteConnectionExclusion as t };
