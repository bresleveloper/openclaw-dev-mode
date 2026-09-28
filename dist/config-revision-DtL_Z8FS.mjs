import { c as projectCronJobThroughStorageCodec, y as hashCronJobDefinition } from "./row-codec-mXerryYi.mjs";
//#region src/cron/config-revision.ts
/** Opaque revision token for cron configuration, excluding scheduler-maintained state. */
function configRevisionDefinition(projected) {
	const { updatedAtMs: _updatedAtMs, state: _state, ...definition } = projected;
	return definition;
}
/** Hashes the job definition while preserving meaningful own-undefined config fields. */
function resolveCronJobConfigRevision(job) {
	const projected = projectCronJobThroughStorageCodec({
		...job,
		updatedAtMs: 0,
		state: {}
	});
	return hashCronJobDefinition(configRevisionDefinition(projected));
}
//#endregion
export { resolveCronJobConfigRevision as t };
