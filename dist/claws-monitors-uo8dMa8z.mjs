import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { Fn as object, Jn as string, Nt as array, Yt as discriminatedUnion, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { d as prepareAgentDeletionJournalObservation } from "./agent-deletion-journal-DpYVtbBb.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { p as hasActiveCronJobsForAgent } from "./active-jobs-CqHAjCGh.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { n as getSuspensionVisibleCronTaskRunCount } from "./active-run-cancellation-BecFApIY.mjs";
import { n as digestClawValue } from "./digest-CI8Suvd7.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-lawlsaMs.mjs";
import { n as hasPendingCronSessionCleanupForAgent } from "./locked-BAhN5KaU.mjs";
import { s as reconcileToolsAllowAuthority } from "./jobs-tool-policy-BlxRC469.mjs";
import { r as cronJobReadView } from "./job-read-view-BBk7z_Xr.mjs";
import { g as clawCronGatewayJobMatchesRef, s as readAttachedCronJobs, x as readClawCronRefs } from "./lifecycle-delete-support-BVDBGRpe.mjs";
import { a as prepareAgentDeleteDatabases } from "./agent-delete-databases-CDNa7990.mjs";
import { t as readClawPackageOwnership } from "./provenance-async-nhKlREcs.mjs";
import { i as clawMonitorSnapshotSchema, t as clawMonitorCleanupBindingSchema } from "./monitor-cleanup-contract-DMqZagu3.mjs";
import { t as resolveClawMonitorCleanupBinding } from "./monitor-cleanup-binding-IJCEUt7F.mjs";
import { i as resolveHeartbeatMonitorPlan, o as resolveHeartbeatSchedulerSeedAsync } from "./heartbeat-monitor-CeUB5bBU.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/cron/store/run-receipt-drain.ts
/** Startup recovery clears abandoned requests before Gateway work is admitted. */
async function hasActiveCronRunReceiptsForAgent(agentId) {
	const reply = await executeExistingOpenClawStateRead({}, {
		type: "cron.activeReceiptOwners",
		agentId
	}, { current: true });
	if (!reply) return false;
	if (!reply.ok || reply.type !== "cron.activeReceiptOwners") throw new Error("Cron receipt owners are unavailable for drainage.");
	return reply.owners.length > 0;
}
//#endregion
//#region src/gateway/server-methods/claws-monitors.ts
const text = string().min(1).max(4096);
const target = {
	agentId: text,
	binding: clawMonitorCleanupBindingSchema
};
const paramsSchema = discriminatedUnion("phase", [
	object({
		...target,
		phase: literal("inspect")
	}).strict(),
	object({
		phase: literal("quiesce"),
		...target,
		operationId: text,
		monitors: array(clawMonitorSnapshotSchema).max(2)
	}).strict(),
	object({
		...target,
		phase: literal("drain"),
		operationId: text
	}).strict()
]);
function desiredMonitorRevision(input, existing) {
	const desired = {
		...input,
		id: existing.id,
		createdAtMs: existing.createdAtMs,
		updatedAtMs: 0,
		enabled: input.enabled ?? true,
		state: {}
	};
	reconcileToolsAllowAuthority({
		job: desired,
		previouslyUsedToolRuntime: false,
		explicitlyMutatesToolsAllow: true
	});
	return resolveCronJobConfigRevision(desired);
}
function inspectMonitors(context, agentId, jobs, schedulerSeed) {
	const cfg = context.getRuntimeConfig();
	const specs = resolveHeartbeatMonitorPlan(cfg, jobs, { schedulerSeed }).specs.filter((spec) => spec.agentId === agentId);
	const storeKey = cronStoreKey(context.cronStorePath);
	return readAttachedCronJobs(agentId, {}).flatMap((row) => {
		if (row.storeKey !== storeKey || row.agentId !== agentId || row.ownerAgentId !== null || !row.declarationKey || !row.revision) return [];
		const matchingJobs = jobs.filter((job) => job.declarationKey === row.declarationKey);
		const job = matchingJobs.length === 1 ? matchingJobs[0] : void 0;
		const spec = specs.find((entry) => entry.input.declarationKey === row.declarationKey)?.input;
		if (!job || !spec || job.id !== row.id || job.agentId !== agentId || job.owner || resolveCronJobConfigRevision(job) !== row.revision || desiredMonitorRevision(spec, job) !== row.revision) return [];
		return [{
			...row,
			agentId,
			ownerAgentId: null,
			declarationKey: row.declarationKey,
			revision: row.revision
		}];
	});
}
function assertDeletionFenceJournal(journal, operationId) {
	if (!journal || journal.operationId !== operationId || journal.cleanupCompleted) throw new Error("Claw removal no longer owns the serving Gateway's deletion fence.");
	return journal;
}
function assertDeletionFence(agentId, operationId, entry, config, install) {
	const journal = assertDeletionFenceJournal(entry, operationId);
	const agent = listAgentEntries(config).find((candidate) => candidate.id === agentId);
	if (agent && digestClawValue(agent) !== install?.agentConfigDigest) throw new Error("The serving Gateway's Claw agent configuration changed after planning.");
	return journal;
}
function isLocallyDrained(context, agentId, requireConfigRemoval) {
	return (!requireConfigRemoval || context.isConfigReloadSettled() && !listAgentEntries(context.getRuntimeConfig()).some((agent) => agent.id === agentId)) && !hasActiveCronJobsForAgent(agentId) && getSuspensionVisibleCronTaskRunCount({ agentId }) === 0 && !hasPendingCronSessionCleanupForAgent(agentId) && (!requireConfigRemoval || readAttachedCronJobs(agentId, {}).length === 0);
}
async function waitForDrain(context, agentId, requireConfigRemoval, assertCurrent) {
	const deadline = performance.now() + 5e3;
	do {
		assertCurrent();
		if (isLocallyDrained(context, agentId, requireConfigRemoval)) {
			const activeReceipts = await hasActiveCronRunReceiptsForAgent(agentId);
			assertCurrent();
			if (!activeReceipts && isLocallyDrained(context, agentId, requireConfigRemoval)) return;
		}
		await sleep(50);
	} while (performance.now() < deadline);
	throw new Error("Gateway monitor cancellation, run drainage, or config convergence is incomplete; preview and retry Claw removal.");
}
const clawsMonitorHandlers = { "claws.monitors": async ({ params, respond, context }) => {
	const parsed = paramsSchema.safeParse(params);
	if (!parsed.success) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Invalid Claw monitor cleanup parameters."));
		return;
	}
	const input = parsed.data;
	let releaseObservation;
	try {
		const cron = context.cron;
		const assertBinding = () => {
			if (!isDeepStrictEqual(input.binding, resolveClawMonitorCleanupBinding(context.cronStorePath))) throw new Error("Gateway does not serve this Claw's config and scheduler state.");
			if (input.phase !== "drain" && (context.cron !== cron || !context.isConfigReloadSettled())) throw new Error("Gateway scheduler or configuration is changing; retry Claw removal.");
		};
		assertBinding();
		if (input.phase === "inspect") {
			const schedulerSeed = await resolveHeartbeatSchedulerSeedAsync();
			assertBinding();
			const jobs = await cron.list({ includeDisabled: true });
			assertBinding();
			respond(true, { monitors: inspectMonitors(context, input.agentId, jobs, schedulerSeed) }, void 0);
			return;
		}
		const observation = await prepareAgentDeletionJournalObservation(input.agentId);
		releaseObservation = observation.release;
		assertDeletionFenceJournal(observation.entry, input.operationId);
		assertBinding();
		const { install } = await readClawPackageOwnership({ agentId: input.agentId });
		const assertCurrent = () => {
			assertBinding();
			observation.assertCurrent(input.operationId);
			return assertDeletionFence(input.agentId, input.operationId, observation.entry, context.getRuntimeConfig(), install);
		};
		assertCurrent();
		if (input.phase === "quiesce") {
			const schedulerSeed = await resolveHeartbeatSchedulerSeedAsync();
			assertCurrent();
			const jobs = await cron.list({ includeDisabled: true });
			assertCurrent();
			const monitors = inspectMonitors(context, input.agentId, jobs, schedulerSeed);
			if (!isDeepStrictEqual(monitors, input.monitors)) throw new Error("Config-owned monitors changed after removal planning.");
			const refs = readClawCronRefs(input.agentId);
			const attached = readAttachedCronJobs(input.agentId, {});
			const allowed = attached.map((row) => {
				const job = jobs.find((candidate) => candidate.id === row.id);
				if (!job || !row.revision || row.storeKey !== cronStoreKey(context.cronStorePath) || resolveCronJobConfigRevision(job) !== row.revision || !monitors.some((monitor) => isDeepStrictEqual(monitor, row)) && !refs.some((ref) => ref.status === "complete" && ref.schedulerJobId === row.id && clawCronGatewayJobMatchesRef(input.agentId, ref, cronJobReadView(job)))) throw new Error(`Independent or changed cron job ${row.id} still references the Claw agent.`);
				return {
					id: row.id,
					revision: row.revision
				};
			});
			await cron.quiesceJobs(allowed, () => {
				assertCurrent();
				if (!isDeepStrictEqual(readAttachedCronJobs(input.agentId, {}), attached) || !isDeepStrictEqual(readClawCronRefs(input.agentId), refs)) throw new Error("Attached scheduled work changed before monitor cancellation.");
			});
		}
		await waitForDrain(context, input.agentId, input.phase === "drain", assertCurrent);
		const journal = assertCurrent();
		if (!isLocallyDrained(context, input.agentId, input.phase === "drain")) throw new Error("Gateway cleanup state changed before database preparation; retry Claw removal.");
		if (input.phase === "quiesce") {
			await prepareAgentDeleteDatabases(context.getRuntimeConfig(), input.agentId, journal.agentDir);
			assertCurrent();
		}
		const activeReceipts = await hasActiveCronRunReceiptsForAgent(input.agentId);
		assertCurrent();
		if (activeReceipts || !isLocallyDrained(context, input.agentId, input.phase === "drain")) throw new Error("Gateway cleanup state changed before drainage was acknowledged; retry Claw removal.");
		respond(true, { drained: true }, void 0);
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : String(error)));
	} finally {
		releaseObservation?.();
	}
} };
//#endregion
export { clawsMonitorHandlers };
