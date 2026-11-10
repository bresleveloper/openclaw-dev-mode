import { t as createSqliteAuditRecordKernel } from "./sqlite-audit-record.kernel-BhQWS5ko.mjs";
//#region src/infra/sqlite-audit-record.worker.ts
const diagnosticOperations = {
	"diagnostic.compareAndSet": (input, { writeAdmitted }) => writeAdmitted(({ db }) => createSqliteAuditRecordKernel(db, input).compareAndSet(input.key, input.expectedPayloadJson, input.record)),
	"diagnostic.register": (input, { writeAdmitted }) => writeAdmitted(({ db }) => createSqliteAuditRecordKernel(db, input).register(input.record))
};
//#endregion
export { diagnosticOperations };
