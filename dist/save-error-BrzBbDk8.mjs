import { n as serializeCronLoadError, t as restoreCronLoadError } from "./load-error-CO2Pg-SG.mjs";
//#region src/cron/store/save-error.ts
var CronJobsStoreChangedError = class extends Error {
	constructor(storePath) {
		super(`Cron store at ${storePath} changed after it was read; reload it before writing`);
		this.name = "CronJobsStoreChangedError";
	}
};
function serializeCronSaveError(error, storePath) {
	return error instanceof CronJobsStoreChangedError ? {
		kind: "store-changed",
		storePath
	} : {
		kind: "other",
		error: serializeCronLoadError(error)
	};
}
function restoreCronSaveError(error) {
	return error.kind === "store-changed" ? new CronJobsStoreChangedError(error.storePath) : restoreCronLoadError(error.error);
}
//#endregion
export { restoreCronSaveError as n, serializeCronSaveError as r, CronJobsStoreChangedError as t };
