import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { t as resolveCronJobsStorePath } from "./paths-C7ju4So0.mjs";
import { toUSVString } from "node:util";
//#region src/cron/store/job-name.ts
const preparedNames = /* @__PURE__ */ new Set();
const releasedNames = new FinalizationRegistry((reference) => {
	preparedNames.delete(reference);
});
function* retainedNames(storeKey) {
	for (const reference of preparedNames) {
		const prepared = reference.deref();
		if (!prepared) preparedNames.delete(reference);
		else if (storeKey === void 0 || prepared.storeKey === void 0 || prepared.storeKey === storeKey) yield prepared;
	}
}
/** All cron commit notifications invalidate names, including uncertain outcomes and repairs. */
function invalidateCronJobNames(storeKey) {
	for (const prepared of retainedNames(storeKey)) {
		prepared.revision++;
		prepared.names = void 0;
	}
}
/** Publish only acknowledged postimages belonging to a resolver's original physical generation. */
function publishCronJobNames(storeKey, context, names) {
	for (const prepared of retainedNames(storeKey)) {
		if (prepared.storeKey !== storeKey) continue;
		try {
			context.admission.assertCurrent();
			prepared.context.admission.assertCurrent();
		} catch {
			continue;
		}
		const source = context.admission.identity;
		const target = prepared.context.admission.identity;
		if (source.key !== target.key || source.birthtime !== target.birthtime) continue;
		prepared.revision++;
		prepared.names = new Map(prepared.jobIds.map((id) => [id, names.get(id)]));
	}
}
async function prepareCronJobNameResolver(jobIds, storePath) {
	const ids = [...new Set(jobIds.map(toUSVString))];
	if (ids.length === 0) return () => {
		throw new Error("Cron job names were not prepared; await prepareCronJobNameResolver");
	};
	const prepared = {
		context: captureOpenClawStateReadWorkerContext(),
		storeKey: storePath?.trim() ? resolveCronJobsStorePath(storePath) : void 0,
		jobIds: ids,
		revision: 0
	};
	const reference = new WeakRef(prepared);
	preparedNames.add(reference);
	releasedNames.register(prepared, reference);
	try {
		const reply = await executeExistingOpenClawStateRead({ path: prepared.context.admission.databasePath }, {
			type: "cron.jobNames",
			jobIds: ids,
			storePath: prepared.storeKey
		}, {
			context: prepared.context,
			current: true
		});
		if (reply && (!reply.ok || reply.type !== "cron.jobNames")) throw new Error("Unexpected cron job names result");
		prepared.context.admission.assertCurrent();
		prepared.storeKey = reply?.storeKey ?? prepared.storeKey;
		if (prepared.revision === 0) prepared.names = new Map(ids.map((id) => [id, reply?.names.get(id)]));
		return (jobId) => {
			prepared.context.admission.assertCurrent();
			const id = toUSVString(jobId);
			if (!prepared.names?.has(id)) throw new Error("Cron job names need refresh; await prepareCronJobNameResolver");
			return prepared.names.get(id);
		};
	} catch (error) {
		preparedNames.delete(reference);
		throw error;
	}
}
//#endregion
export { prepareCronJobNameResolver as n, publishCronJobNames as r, invalidateCronJobNames as t };
