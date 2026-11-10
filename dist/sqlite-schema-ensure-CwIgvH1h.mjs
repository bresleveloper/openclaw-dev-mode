import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { i as getAdmittedSqliteSchemaFacts, p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as requireNativeDatabaseFile } from "./physical-facts-Cvtfrs3r.mjs";
//#region src/infra/sqlite-schema-ensure.ts
/** Install missing additive objects using the connection's admitted schema lifecycle. */
function createSqliteSchemaEnsurer(schemaSql, objects) {
	const present = (database) => {
		const facts = getAdmittedSqliteSchemaFacts(database);
		return facts !== void 0 && objects.tables.every((table) => facts.tables.has(table)) && (objects.indexes?.every((index) => facts.indexes.has(index)) ?? true);
	};
	return (database) => {
		if (isPostgresSqlConnection(database)) requireNativeDatabaseFile("postgres", "repair");
		runSqliteReadOperationSync(database, () => {
			if (present(database)) return;
			const install = () => {
				if (!present(database)) database.exec(schemaSql());
			};
			if (database.isTransaction) install();
			else runSqliteImmediateTransactionSync(database, install);
		});
	};
}
//#endregion
export { createSqliteSchemaEnsurer as t };
