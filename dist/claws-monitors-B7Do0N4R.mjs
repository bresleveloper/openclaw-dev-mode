import { n as getFileLockProcessStartTime, o as isPidDefinitelyDead } from "./pid-alive-CPS_shDt.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { Fn as object, Jn as string, Nt as array, Yt as discriminatedUnion, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { c as readAgentDeletionJournal } from "./agent-deletion-journal-CDljXcnp.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { d as hasActiveCronJobsForAgent } from "./active-jobs-BS2UT6i2.mjs";
import { n as getSuspensionVisibleCronTaskRunCount } from "./active-run-cancellation-CKD08Yo7.mjs";
import { u as digestClawValue } from "./schema-portability-DPQGHUzw.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DVuJ106z.mjs";
import { _ as isCronRunReceiptOwnerStale } from "./run-receipt-store-BI8RC7qi.mjs";
import { n as hasPendingCronSessionCleanupForAgent } from "./locked-CyUkMHfL.mjs";
import { o as reconcileToolsAllowAuthority } from "./jobs-tool-policy-8ixPr7vE.mjs";
import { r as cronJobReadView } from "./job-read-view-CgKmbr9p.mjs";
import { T as readClawCronRefs, b as clawCronGatewayJobMatchesRef, d as readAttachedCronJobs, i as clawMonitorSnapshotSchema, t as clawMonitorCleanupBindingSchema } from "./monitor-cleanup-contract-BKt7Vod1.mjs";
import { a as prepareAgentDeleteDatabases } from "./agent-delete-databases-BKVsmG-l.mjs";
import { t as readClawPackageOwnership } from "./provenance-async-Cos5k-UB.mjs";
import { t as resolveClawMonitorCleanupBinding } from "./monitor-cleanup-binding-C1Sjco9n.mjs";
import { i as resolveHeartbeatMonitorPlan } from "./heartbeat-monitor-D2m-S66U.mjs";
import { t as resolveSkillCollectionReviewMonitorSpecs } from "./skill-collection-review-monitor-Bie8HQQR.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/cron/store/run-receipt-drain.ts
/** A serving process cannot attest drainage while another receipt owner remains active. */
async function hasActiveCronRunReceiptsForAgent(agentId) {
	const reply = await executeExistingOpenClawStateRead({}, {
		type: "cron.activeReceiptOwners",
		agentId
	}, { current: true });
	if (!reply) return false;
	if (!reply.ok || reply.type !== "cron.activeReceiptOwners") throw new Error("Cron receipt owners are unavailable for drainage.");
	return reply.owners.some((owner) => {
		if (owner.ownerPid === process.pid) return !isCronRunReceiptOwnerStale(owner);
		if (isPidDefinitelyDead(owner.ownerPid)) return false;
		const startedAt = getFileLockProcessStartTime(owner.ownerPid);
		return owner.ownerStartTime === null || startedAt === null || owner.ownerStartTime === startedAt;
	});
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
function inspectMonitors(context, agentId, jobs) {
	const cfg = context.getRuntimeConfig();
	const specs = [...resolveHeartbeatMonitorPlan(cfg, jobs).specs, ...resolveSkillCollectionReviewMonitorSpecs(cfg, jobs)].filter((spec) => spec.agentId === agentId);
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
function readDeletionFenceJournal(agentId, operationId) {
	const journal = readAgentDeletionJournal(agentId);
	if (!journal || journal.operationId !== operationId || journal.cleanupCompleted) throw new Error("Claw removal no longer owns the serving Gateway's deletion fence.");
	return journal;
}
function assertDeletionFence(agentId, operationId, config, install) {
	const journal = readDeletionFenceJournal(agentId, operationId);
	const agent = listAgentEntries(config).find((entry) => entry.id === agentId);
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
	try {
		const cron = context.cron;
		const assertBinding = () => {
			if (!isDeepStrictEqual(input.binding, resolveClawMonitorCleanupBinding(context.cronStorePath))) throw new Error("Gateway does not serve this Claw's config and scheduler state.");
			if (input.phase !== "drain" && (context.cron !== cron || !context.isConfigReloadSettled())) throw new Error("Gateway scheduler or configuration is changing; retry Claw removal.");
		};
		assertBinding();
		if (input.phase === "inspect") {
			const jobs = await cron.list({ includeDisabled: true });
			assertBinding();
			respond(true, { monitors: inspectMonitors(context, input.agentId, jobs) }, void 0);
			return;
		}
		readDeletionFenceJournal(input.agentId, input.operationId);
		const { install } = await readClawPackageOwnership({ agentId: input.agentId });
		const assertCurrent = () => {
			assertBinding();
			return assertDeletionFence(input.agentId, input.operationId, context.getRuntimeConfig(), install);
		};
		assertCurrent();
		if (input.phase === "quiesce") {
			const jobs = await cron.list({ includeDisabled: true });
			assertCurrent();
			const monitors = inspectMonitors(context, input.agentId, jobs);
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
	}
} };
//#endregion
export { clawsMonitorHandlers };
