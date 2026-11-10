import { r as assertStateDatabaseAccessAllowed } from "./gateway-state-owner-X3EqhtYx.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { f as withSqliteInspectionOperation } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
//#region src/infra/sqlite-source-handle.ts
const unclosedSourceReads = /* @__PURE__ */ new Set();
/** Closing a source in its writer's process can release that writer's POSIX locks. */
function withSqliteSourceReadDatabase(pathname, inspectionOperation, operation, options = {}) {
	assertStateDatabaseAccessAllowed(pathname);
	const database = withSqliteInspectionOperation(inspectionOperation, () => openNodeSqliteDatabase(pathname, {
		readOnly: true,
		timeout: options.timeout
	}));
	try {
		assertStateDatabaseAccessAllowed(pathname);
		return operation(database);
	} finally {
		try {
			database.close();
		} finally {
			if (database.isOpen) unclosedSourceReads.add(database);
		}
	}
}
//#endregion
export { withSqliteSourceReadDatabase as t };
