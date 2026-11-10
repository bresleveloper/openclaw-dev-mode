import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { h as isCronJobActive } from "./active-jobs-CqHAjCGh.mjs";
import { n as resolveCronJobEffectiveAgentId } from "./agent-id-C6uS-TyD.mjs";
import { o as reconcileCronSourceIdentity } from "./source-schedule-49zenZxx.mjs";
import { i as isSystemMonitorDeclaration } from "./system-owned-declaration-BdxGzmHz.mjs";
import { o as loadCronRows, s as loadedCronStoreFromRows, y as cronSchedulingInputsEqual } from "./row-codec-Cnnqjh5r.mjs";
import { t as loadCronRuntimeAuthorities } from "./runtime-authority-store-kOMa-5fA.mjs";
import { c as hasScheduledNextRunAtMs, h as recomputeSingleJobForMaintenance, l as isJobEnabled, r as computeJobNextRunAtMs } from "./jobs-scheduling-sefIqbJ3.mjs";
import { i as resolveForcePreservedOneShotAtMs } from "./one-shot-schedule-DiK2ivJ0.mjs";
import { a as reconcileCronOperatorSource, i as reconcileCronChannelRequesterAuthority, o as reconcileRuntimeAuthority } from "./jobs-tool-policy-BlxRC469.mjs";
import { t as declarativeFields } from "./jobs-declarative--tbOnzUv.mjs";
import { t as createCronMutationLogger } from "./runtime-mutation.worker-DYRinBLE.mjs";
import { n as applyJobPatch, r as createJob, t as applyDeclarativeJobSpec } from "./jobs-hhS-jgmc.mjs";
import { n as installCronSchedulerSnapshot, t as getCronSchedulerSnapshot } from "./scheduler-config.worker-wXyNtMh_.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/cron/service/jobs-mutation.ts
/** Completes a canonical job edit before authority rebinding and persistence. */
/** Keep the harness-owned immutable envelope intact when copying mutable job fields. */
function cloneCronJobForMutation(job) {
	const { runtimeAuthority, ...mutableJob } = job;
	return {
		...structuredClone(mutableJob),
		...runtimeAuthority ? { runtimeAuthority } : {}
	};
}
function finalizeUpdatedJob(params) {
	const { job, nextJob, now } = params;
	if (params.scheduleChanged && nextJob.schedule.kind === "every") {
		const anchor = nextJob.schedule.anchorMs;
		if (typeof anchor !== "number" || !Number.isFinite(anchor)) {
			const fallbackAnchorMs = (job.schedule.kind === "every" && job.schedule.everyMs === nextJob.schedule.everyMs && typeof job.schedule.anchorMs === "number" && Number.isFinite(job.schedule.anchorMs) ? job.schedule.anchorMs : void 0) ?? now;
			nextJob.schedule = {
				...nextJob.schedule,
				anchorMs: Math.max(0, Math.floor(fallbackAnchorMs))
			};
		}
	}
	reconcileCronSourceIdentity(job, nextJob);
	const previousScript = job.payload.kind === "script" ? job.payload.script : void 0;
	const nextScript = nextJob.payload.kind === "script" ? nextJob.payload.script : void 0;
	if (!isDeepStrictEqual(job.trigger, nextJob.trigger) || previousScript !== nextScript) for (const field of [
		"triggerState",
		"triggerEvalCount",
		"lastTriggerEvalAtMs",
		"lastTriggerFireAtMs"
	]) if (params.explicitTriggerState && Object.hasOwn(params.explicitTriggerState, field)) Object.assign(nextJob.state, { [field]: params.explicitTriggerState[field] });
	else delete nextJob.state[field];
	const schedulingInputsChanged = params.schedulingInputsRequested && !cronSchedulingInputsEqual(job, nextJob);
	if (params.scheduleChanged && nextJob.schedule.kind === "cron" && !isJobEnabled(nextJob)) computeJobNextRunAtMs({
		...nextJob,
		enabled: true
	}, now);
	nextJob.updatedAtMs = now;
	if (schedulingInputsChanged) {
		nextJob.state.scheduleActivatedAtMs = now;
		nextJob.state.startupCatchupAtMs = void 0;
		nextJob.state.pacedNextRunAtMs = void 0;
		nextJob.state.forcePreservedNextRunAtMs = cronSchedulingInputsEqual({
			...job,
			enabled: nextJob.enabled
		}, nextJob) ? resolveForcePreservedOneShotAtMs(job) : void 0;
		if (isJobEnabled(nextJob)) nextJob.state.nextRunAtMs = computeJobNextRunAtMs(nextJob, now);
		else {
			nextJob.state.nextRunAtMs = void 0;
			nextJob.state.queuedAtMs = void 0;
			if (!(params.isJobActive ?? isCronJobActive)(nextJob.id)) {
				Object.assign(nextJob.state, {
					runningAtMs: void 0,
					runningReceiptId: void 0
				});
				delete nextJob.state.runningScheduleChangeId;
			}
		}
	} else if (isJobEnabled(nextJob) && !hasScheduledNextRunAtMs(nextJob.state.nextRunAtMs)) nextJob.state.nextRunAtMs = computeJobNextRunAtMs(nextJob, now);
	if (nextJob.state.runningAtMs !== job.state.runningAtMs) delete nextJob.state.runningReceiptId;
}
//#endregion
//#region src/cron/store/job-mutations.worker.ts
function resolveCronJobMutationSnapshot(storeKey, snapshot, databasePath) {
	const configured = (snapshot.scheduler ? installCronSchedulerSnapshot(storeKey, snapshot.scheduler, databasePath) : getCronSchedulerSnapshot(storeKey, databasePath))?.config;
	return configured ? {
		...snapshot,
		defaultAgentId: configured.defaultAgentId,
		cronConfig: configured.cronConfig,
		configuredChannels: configured.configuredChannels
	} : { nowMs: snapshot.nowMs };
}
/** Both preparation and commit use this owner; only committed results are published. */
function planCronJobMutation(previous, mutation, snapshot) {
	const next = {
		version: 1,
		jobs: previous.jobs.map(cloneCronJobForMutation)
	};
	const plan = {
		previous,
		next,
		notifications: [],
		logs: []
	};
	const { nowMs: now, defaultAgentId, cronConfig, configuredChannels } = snapshot;
	if (mutation.kind === "remove") {
		const ids = new Set(mutation.ids);
		for (const job of next.jobs) if (ids.has(job.id) && isSystemMonitorDeclaration(job.declarationKey) && !mutation.systemOwned) throw new Error("system-owned monitor jobs cannot be removed by cron clients");
		next.jobs = next.jobs.filter((job) => !ids.has(job.id));
	} else {
		const options = mutation.options;
		const validation = {
			...options,
			defaultAgentId,
			cronConfig,
			configuredChannels
		};
		let previousJob;
		let nextJob;
		if (mutation.kind === "add") {
			const key = normalizeOptionalString(mutation.input.declarationKey);
			const matches = key ? previous.jobs.filter((job) => job.declarationKey === key && (!mutation.matchingJobIds || mutation.matchingJobIds.includes(job.id))) : [];
			if (matches.length > 1) throw new Error(`cron declarationKey is ambiguous within caller scope: ${key}`);
			previousJob = matches[0];
			if (previousJob) {
				nextJob = cloneCronJobForMutation(previousJob);
				applyDeclarativeJobSpec(nextJob, mutation.input, {
					...validation,
					scheduledToolPolicy: options.scheduledToolPolicy ?? void 0,
					enabledExplicit: options.enabledExplicit === true,
					nowMs: now
				});
				finalizeUpdatedJob({
					job: previousJob,
					nextJob,
					now,
					schedulingInputsRequested: true,
					scheduleChanged: !isDeepStrictEqual(previousJob.schedule, nextJob.schedule),
					explicitTriggerState: mutation.input.state,
					isJobActive: () => previousJob?.state.runningAtMs !== void 0
				});
			} else {
				if (next.jobs.some((job) => job.id === mutation.input.id)) throw new Error(`cron job already exists: ${mutation.input.id}`);
				nextJob = createJob({ deps: {
					nowMs: () => now,
					defaultAgentId,
					cronConfig
				} }, mutation.input, {
					...validation,
					scheduledToolPolicy: options.scheduledToolPolicy ?? void 0
				});
				if (options.createdActor) nextJob.createdActor = structuredClone(options.createdActor);
				if (options.sourceConversation) nextJob.sourceConversation = structuredClone(options.sourceConversation);
				if (options.skillLibrarySelections) nextJob.skillLibrarySelections = structuredClone(options.skillLibrarySelections);
			}
		} else {
			previousJob = previous.jobs.find((job) => job.id === mutation.id);
			if (!previousJob) throw new Error(`unknown cron job id: ${mutation.id}`);
			if (isSystemMonitorDeclaration(previousJob.declarationKey)) throw new Error("system-owned monitor jobs cannot be edited by cron clients");
			nextJob = cloneCronJobForMutation(previousJob);
			applyJobPatch(nextJob, mutation.patch, {
				...validation,
				scheduleValidationNowMs: now
			});
			finalizeUpdatedJob({
				job: previousJob,
				nextJob,
				now,
				schedulingInputsRequested: mutation.patch.schedule !== void 0 || mutation.patch.enabled !== void 0 || "trigger" in mutation.patch || "pacing" in mutation.patch,
				scheduleChanged: mutation.patch.schedule !== void 0,
				explicitTriggerState: mutation.patch.state,
				isJobActive: () => previousJob?.state.runningAtMs !== void 0
			});
		}
		if (options.inferenceBinding && (!previousJob || mutation.kind === "update")) nextJob.inferenceBinding = options.inferenceBinding;
		const explicitlyMutatesToolsAllow = mutation.kind === "add" ? mutation.input.payload.toolsAllow !== void 0 : mutation.patch.payload !== void 0 && Object.hasOwn(mutation.patch.payload, "toolsAllow");
		reconcileRuntimeAuthority({
			job: nextJob,
			captured: options.captured,
			runtimeAuthority: options.runtimeAuthority,
			explicitlyMutatesToolsAllow
		});
		if (nextJob.runtimeAuthority) delete nextJob.inferenceBinding;
		reconcileCronChannelRequesterAuthority({
			job: nextJob,
			previousJob,
			toolsAllowProvenance: options.toolsAllowProvenance,
			reauthorize: mutation.kind === "add" || explicitlyMutatesToolsAllow,
			reauthorizeCallerOrigin: mutation.kind === "update" && explicitlyMutatesToolsAllow
		});
		resolveCronJobEffectiveAgentId(nextJob, defaultAgentId);
		reconcileCronOperatorSource({
			job: nextJob,
			previousJob,
			captured: options.operatorSource
		});
		plan.created = !previousJob;
		plan.updated = previousJob !== void 0 && (mutation.kind === "update" || !isDeepStrictEqual(declarativeFields(previousJob, options.enabledExplicit === true), declarativeFields(nextJob, options.enabledExplicit === true)));
		if (!previousJob) next.jobs.push(nextJob);
		else if (plan.updated) next.jobs = next.jobs.map((job) => job.id === nextJob.id ? nextJob : job);
		plan.job = nextJob;
	}
	if (mutation.kind === "remove" || plan.created) {
		const policy = { deps: {
			nowMs: () => now,
			log: createCronMutationLogger(plan.logs)
		} };
		const reservations = new Map(next.jobs.flatMap((job) => job.state.queuedAtMs === void 0 ? [] : [[job.id, {
			markerAtMs: job.state.queuedAtMs,
			preserveWhenDisabled: true
		}]]));
		for (const job of next.jobs) recomputeSingleJobForMaintenance(policy, job, { deferredNotifications: plan.notifications }, {
			reservations,
			isJobActive: (id) => next.jobs.some((candidate) => candidate.id === id && candidate.state.runningAtMs !== void 0)
		});
	}
	return plan;
}
function prepareCronJobMutationInWorker(database, input) {
	const snapshot = resolveCronJobMutationSnapshot(input.storeKey, input.snapshot, database.path);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const store = loadedCronStoreFromRows(loadCronRows(db, input.storeKey)).store;
		loadCronRuntimeAuthorities({
			db,
			storeKey: input.storeKey,
			jobs: store.jobs
		});
		return { outcome: planCronJobMutation(store, input.mutation, snapshot) };
	}, {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	}, { operationLabel: "cron.prepare-job-mutation" });
}
//#endregion
export { prepareCronJobMutationInWorker as n, resolveCronJobMutationSnapshot as r, planCronJobMutation as t };
