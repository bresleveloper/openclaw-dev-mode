import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { t as parseDurationMs } from "./parse-duration-B7MSnEK8.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { r as resolveCronJobsStorePathFromConfig } from "./paths-C7jZRDkL.mjs";
import { r as getCronStoreKysely } from "./schema-2FnPKGGd.mjs";
import { _ as upsertCronJobRow, o as loadCronRows, s as loadedCronStoreFromRows, t as assertCronStoreCanPersist, y as cronSchedulingInputsEqual } from "./row-codec-Cnnqjh5r.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { o as resolveHeartbeatIntervalMs, r as resolveHeartbeatAgents } from "./heartbeat-config-CNn1aX1c.mjs";
import "./store-HF7PvtRl.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { c as hasScheduledNextRunAtMs, r as computeJobNextRunAtMs } from "./jobs-scheduling-sefIqbJ3.mjs";
import { a as readHeartbeatMonitorScratchReadOnly, i as readHeartbeatMonitorScratch } from "./scratch-store-EDkbope9.mjs";
import { n as isHeartbeatTaskCronJob, t as heartbeatTaskDeclarationKey } from "./heartbeat-task-Ds7Wgs5C.mjs";
import { t as noteDoctorMigrationResult } from "./doctor-migration-notes-BeR2Nugl.mjs";
import { t as resolveHeartbeatSession } from "./heartbeat-runner-session-TVWWDso7.mjs";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/heartbeat-task-legacy.ts
function scanHeartbeatLine(raw, state) {
	let cursor = 0;
	let hasHtmlComment = state.inHtmlComment;
	let htmlCommentRaw = "";
	let visible = "";
	while (cursor < raw.length) {
		if (state.inHtmlComment) {
			const commentEnd = raw.indexOf("-->", cursor);
			if (commentEnd === -1) {
				htmlCommentRaw += raw.slice(cursor);
				return {
					hasHtmlComment,
					htmlCommentRaw,
					visible
				};
			}
			htmlCommentRaw += raw.slice(cursor, commentEnd + 3);
			state.inHtmlComment = false;
			cursor = commentEnd + 3;
			continue;
		}
		const commentStart = raw.indexOf("<!--", cursor);
		if (commentStart === -1) {
			const outside = raw.slice(cursor);
			visible += outside;
			htmlCommentRaw += outside.replace(/\S/g, "");
			return {
				hasHtmlComment,
				htmlCommentRaw,
				visible
			};
		}
		const outside = raw.slice(cursor, commentStart);
		visible += outside;
		htmlCommentRaw += outside.replace(/\S/g, "") + "<!--";
		hasHtmlComment = true;
		state.inHtmlComment = true;
		cursor = commentStart + 4;
	}
	return {
		hasHtmlComment,
		htmlCommentRaw,
		visible
	};
}
function tokenizeHeartbeatLines(content) {
	const state = { inHtmlComment: false };
	return (content.match(/[^\r\n]*(?:\r\n|\n|\r|$)/g) ?? []).filter(Boolean).map((source) => {
		const raw = source.replace(/(?:\r\n|\n|\r)$/, "");
		const scanned = scanHeartbeatLine(raw, state);
		const line = {
			raw,
			source,
			visible: scanned.visible
		};
		if (scanned.hasHtmlComment) line.htmlCommentSource = scanned.htmlCommentRaw + source.slice(raw.length);
		return line;
	});
}
function unquoteTaskValue(value) {
	return value.trim().replace(/^["']|["']$/g, "");
}
/**
* Parses and marks removable task syntax in one pass. The same boundary decision
* therefore owns both cron creation and the bytes Doctor may remove.
*/
function analyzeLegacyHeartbeatTasks(content) {
	const lines = tokenizeHeartbeatLines(content);
	const removedLineIndexes = /* @__PURE__ */ new Set();
	const tasks = [];
	let taskEntryCount = 0;
	let hasTasksBlock = false;
	let inTasksBlock = false;
	let currentTask;
	let orphanEntryOpen = false;
	const finishCurrentTask = () => {
		if (currentTask?.name && currentTask.interval && currentTask.prompt) tasks.push({
			name: currentTask.name,
			interval: currentTask.interval,
			prompt: currentTask.prompt
		});
		currentTask = void 0;
	};
	for (const [index, line] of lines.entries()) {
		const trimmed = line.visible.trim();
		if (trimmed === "tasks:") {
			finishCurrentTask();
			orphanEntryOpen = false;
			hasTasksBlock = true;
			inTasksBlock = true;
			removedLineIndexes.add(index);
			continue;
		}
		if (!inTasksBlock) continue;
		if (!trimmed) {
			if (!line.raw.trim()) removedLineIndexes.add(index);
			continue;
		}
		if (trimmed.startsWith("- name:")) {
			finishCurrentTask();
			orphanEntryOpen = false;
			taskEntryCount += 1;
			currentTask = { name: unquoteTaskValue(trimmed.slice(7)) };
			removedLineIndexes.add(index);
			continue;
		}
		const isIndented = line.visible.startsWith(" ") || line.visible.startsWith("	");
		const field = trimmed.startsWith("interval:") ? "interval" : trimmed.startsWith("prompt:") ? "prompt" : void 0;
		if (isIndented && field) {
			if (currentTask) currentTask[field] = unquoteTaskValue(trimmed.slice(field.length + 1));
			else if (!orphanEntryOpen) {
				taskEntryCount += 1;
				orphanEntryOpen = true;
			}
			removedLineIndexes.add(index);
			continue;
		}
		finishCurrentTask();
		orphanEntryOpen = false;
		inTasksBlock = false;
	}
	finishCurrentTask();
	return {
		hasTasksBlock,
		taskEntryCount,
		tasks,
		strippedContent: lines.map((line, index) => removedLineIndexes.has(index) ? line.htmlCommentSource ?? "" : line.source).join("")
	};
}
//#endregion
//#region src/commands/doctor-heartbeat-task-migration.ts
/** Doctor-owned migration from heartbeat scratch `tasks:` blocks into cron jobs. */
function resolveHeartbeatTaskMigrationAgents(cfg) {
	return resolveHeartbeatAgents(cfg).filter((agent) => resolveHeartbeatIntervalMs(cfg, void 0, agent.heartbeat) !== null);
}
function validateTasks(tasks, declaredEntryCount) {
	if (tasks.length === 0) throw new Error("tasks: block has no complete name/interval/prompt entries");
	if (tasks.length !== declaredEntryCount) throw new Error("tasks: block contains an incomplete name/interval/prompt entry");
	const occurrenceCounts = /* @__PURE__ */ new Map();
	return tasks.map((task) => {
		const intervalMs = parseDurationMs(task.interval, { defaultUnit: "m" });
		if (intervalMs <= 0) throw new Error(`task ${JSON.stringify(task.name)} interval must be greater than zero`);
		const occurrenceIndex = occurrenceCounts.get(task.name) ?? 0;
		occurrenceCounts.set(task.name, occurrenceIndex + 1);
		return {
			task,
			intervalMs,
			occurrenceIndex
		};
	});
}
/** Reports task blocks still owned by heartbeat scratch without changing them. */
async function collectHeartbeatTaskMigrationFindings(cfg, env = process.env) {
	const MIGRATION_FINDING_DEFAULTS = {
		checkId: "core/doctor/heartbeat-task-cron-migration",
		severity: "warning",
		fixHint: `Run ${formatCliCommand("openclaw doctor --fix")} to convert heartbeat tasks into automations.`
	};
	const storePath = resolveCronJobsStorePathFromConfig(cfg, env);
	const findings = [];
	for (const agent of resolveHeartbeatTaskMigrationAgents(cfg)) {
		const finding = {
			...MIGRATION_FINDING_DEFAULTS,
			path: storePath,
			target: agent.agentId
		};
		let monitor;
		try {
			monitor = readHeartbeatMonitorScratchReadOnly(storePath, agent.agentId, { env });
		} catch (error) {
			findings.push({
				...finding,
				requirement: "heartbeat-task-migration-blocked",
				severity: "error",
				message: `Agent "${agent.agentId}" heartbeat scratch cannot be inspected: ${formatErrorMessage(error)}`
			});
			continue;
		}
		const content = monitor?.state.scratch?.content;
		if (!content) continue;
		const document = analyzeLegacyHeartbeatTasks(content);
		if (!document.hasTasksBlock) continue;
		try {
			validateTasks(document.tasks, document.taskEntryCount);
			findings.push({
				...finding,
				requirement: "heartbeat-tasks-in-scratch",
				message: `Agent "${agent.agentId}" has ${document.tasks.length} heartbeat task${document.tasks.length === 1 ? "" : "s"} that must become cron jobs.`
			});
		} catch (error) {
			findings.push({
				...finding,
				requirement: "heartbeat-task-migration-blocked",
				severity: "error",
				message: `Agent "${agent.agentId}" heartbeat tasks cannot be migrated: ${formatErrorMessage(error)}`
			});
		}
	}
	return findings;
}
function taskDeclarativeFields(job) {
	return {
		schedule: job.schedule,
		pacing: job.pacing,
		trigger: job.trigger,
		payload: job.payload,
		delivery: job.delivery,
		displayName: job.displayName,
		enabled: job.enabled
	};
}
function convergeTaskJob(params) {
	const { agentId, task, intervalMs, lastRunAtMs, existing: previous, nowMs } = params;
	const existingAnchor = previous?.schedule.kind === "every" && previous.schedule.everyMs === intervalMs ? previous.schedule.anchorMs : void 0;
	const nextDueMs = lastRunAtMs === void 0 || lastRunAtMs + intervalMs <= nowMs ? nowMs + 1 : lastRunAtMs + intervalMs;
	const fields = {
		displayName: truncateUtf16Safe(`Heartbeat task: ${task.name}`, 200),
		schedule: {
			kind: "every",
			everyMs: intervalMs,
			anchorMs: existingAnchor ?? nextDueMs
		},
		payload: {
			kind: "systemEvent",
			text: task.prompt
		},
		enabled: true
	};
	if (!previous) {
		const job = {
			id: randomUUID(),
			declarationKey: params.declarationKey,
			displayName: fields.displayName,
			name: task.name,
			description: "Migrated from heartbeat monitor scratch by openclaw doctor.",
			agentId,
			enabled: fields.enabled,
			schedule: fields.schedule,
			payload: fields.payload,
			sessionTarget: "main",
			wakeMode: "next-heartbeat",
			createdAtMs: nowMs,
			updatedAtMs: nowMs,
			state: lastRunAtMs === void 0 ? {} : { lastRunAtMs }
		};
		job.state.nextRunAtMs = computeJobNextRunAtMs(job, nowMs);
		return job;
	}
	const job = Object.assign(structuredClone(previous), fields);
	delete job.pacing;
	delete job.trigger;
	delete job.delivery;
	if (isDeepStrictEqual(taskDeclarativeFields(previous), taskDeclarativeFields(job))) return job;
	job.updatedAtMs = nowMs;
	if (!cronSchedulingInputsEqual(previous, job)) {
		job.state.startupCatchupAtMs = void 0;
		job.state.pacedNextRunAtMs = void 0;
		job.state.forcePreservedNextRunAtMs = void 0;
		job.state.nextRunAtMs = computeJobNextRunAtMs(job, nowMs);
	} else if (!hasScheduledNextRunAtMs(job.state.nextRunAtMs)) job.state.nextRunAtMs = computeJobNextRunAtMs(job, nowMs);
	return job;
}
async function loadCronPlanningSnapshot(storePath, env) {
	const rows = loadCronRows(openOpenClawStateDatabase({ env }).db, cronStoreKey(storePath));
	const sortOrderByJobId = new Map(rows.map((row) => [row.job_id, row.sort_order]));
	return {
		jobs: loadedCronStoreFromRows(rows).store.jobs,
		sortOrderByJobId,
		nextSortOrder: rows.reduce((max, row) => Math.max(max, row.sort_order + 1), 0)
	};
}
function readScratchRevision(db, storeKey, jobId) {
	return executeSqliteQuerySync(db, getCronStoreKysely(db).selectFrom("cron_job_scratch").select("revision").where("store_key", "=", storeKey).where("job_id", "=", jobId)).rows[0]?.revision ?? 0;
}
function commitAgentTaskMigration(params) {
	const storeKey = cronStoreKey(params.storePath);
	return runOpenClawStateWriteTransaction(({ db }) => {
		if (readScratchRevision(db, storeKey, params.plan.monitorJobId) !== params.plan.scratchRevision) return "revision-conflict";
		const rows = loadCronRows(db, storeKey);
		const jobsById = new Map(loadedCronStoreFromRows(rows).store.jobs.map((job) => [job.id, job]));
		for (const jobPlan of params.plan.jobs) {
			const matchingRows = rows.filter((row) => row.declaration_key === jobPlan.declarationKey);
			if (jobPlan.previous) {
				const current = jobsById.get(jobPlan.previous.id);
				if (matchingRows.length !== 1 || !current || !isDeepStrictEqual(current, jobPlan.previous)) return "job-conflict";
			} else if (matchingRows.length > 0 || rows.some((row) => row.job_id === jobPlan.job.id)) return "job-conflict";
		}
		for (const jobPlan of params.plan.jobs) if (!jobPlan.previous || !isDeepStrictEqual(jobPlan.previous, jobPlan.job)) upsertCronJobRow(db, storeKey, jobPlan.job, jobPlan.sortOrder);
		if (executeSqliteQuerySync(db, getCronStoreKysely(db).updateTable("cron_job_scratch").set({
			content: params.plan.strippedContent,
			revision: params.plan.scratchRevision + 1,
			source_sha256: params.plan.sourceSha256 ?? null,
			updated_at_ms: params.nowMs
		}).where("store_key", "=", storeKey).where("job_id", "=", params.plan.monitorJobId).where("revision", "=", params.plan.scratchRevision)).numAffectedRows !== 1n) throw new Error("scratch revision changed inside task migration transaction");
		return "committed";
	}, { env: params.env }, { operationLabel: "doctor.heartbeat-task-migration" });
}
async function clearLegacyTaskTimestamps(params) {
	await patchSessionEntryCore({
		storePath: params.storePath,
		sessionKey: params.sessionKey,
		env: params.env
	}, (entry) => {
		const remaining = { ...entry.heartbeatTaskState };
		let changed = false;
		for (const task of params.tasks) if (Object.hasOwn(remaining, task.name)) {
			delete remaining[task.name];
			changed = true;
		}
		if (!changed) return null;
		return { heartbeatTaskState: Object.keys(remaining).length > 0 ? remaining : void 0 };
	}, { preserveActivity: true });
}
/** Converts valid scratch tasks and removes their source block in one SQLite transaction. */
async function maybeMigrateHeartbeatTasksToCron(params) {
	const env = params.env ?? process.env;
	const nowMs = params.nowMs ?? Date.now();
	const storePath = resolveCronJobsStorePathFromConfig(params.cfg, env);
	const changes = [];
	const warnings = [];
	const candidates = [];
	for (const agent of resolveHeartbeatTaskMigrationAgents(params.cfg)) {
		let monitor;
		try {
			monitor = readHeartbeatMonitorScratch(storePath, agent.agentId, { env });
		} catch (error) {
			warnings.push(`Agent "${agent.agentId}" heartbeat scratch could not be inspected: ${formatErrorMessage(error)}.`);
			continue;
		}
		const scratch = monitor?.state.scratch;
		if (!monitor || !scratch) continue;
		const document = analyzeLegacyHeartbeatTasks(scratch.content);
		if (!document.hasTasksBlock) continue;
		const tasks = document.tasks;
		let validatedTasks;
		try {
			validatedTasks = validateTasks(tasks, document.taskEntryCount);
		} catch (error) {
			warnings.push(`Agent "${agent.agentId}" heartbeat tasks were not migrated: ${formatErrorMessage(error)}.`);
			continue;
		}
		if (!params.shouldRepair) {
			note(`${tasks.length} task${tasks.length === 1 ? "" : "s"} in ${shortenHomePath(storePath)} will become independently scheduled cron jobs for agent "${agent.agentId}".`, "Heartbeat task migration preview");
			continue;
		}
		candidates.push({
			agent,
			document,
			monitor,
			scratchRevision: scratch.revision,
			validatedTasks
		});
	}
	if (!params.shouldRepair || candidates.length === 0) {
		noteDoctorMigrationResult({ warnings });
		return {
			changes,
			warnings
		};
	}
	let snapshot;
	try {
		snapshot = await loadCronPlanningSnapshot(storePath, env);
	} catch (error) {
		const warning = `Could not inspect cron jobs for heartbeat task migration: ${formatErrorMessage(error)}`;
		note(warning, "Doctor warnings");
		return {
			changes,
			warnings: [...warnings, warning]
		};
	}
	for (const candidate of candidates) {
		const { agent, document, monitor, scratchRevision, validatedTasks } = candidate;
		const session = await resolveHeartbeatSession(params.cfg, agent.agentId, agent.heartbeat, void 0, env);
		const legacyState = session.entry?.heartbeatTaskState ?? {};
		const jobPlans = [];
		for (const { task, intervalMs, occurrenceIndex } of validatedTasks) {
			const declarationKey = heartbeatTaskDeclarationKey(agent.agentId, task.name, occurrenceIndex);
			const matches = snapshot.jobs.filter((job) => job.declarationKey === declarationKey);
			const existing = matches[0];
			if (matches.length > 1 || existing && (!isHeartbeatTaskCronJob(existing) || existing.agentId !== agent.agentId || existing.name !== task.name)) {
				warnings.push(`Agent "${agent.agentId}" task ${JSON.stringify(task.name)} collides with an incompatible cron declaration; scratch was left unchanged.`);
				break;
			}
			const legacyLastRun = legacyState[task.name];
			const lastRunAtMs = typeof legacyLastRun === "number" && Number.isFinite(legacyLastRun) ? legacyLastRun : void 0;
			const job = convergeTaskJob({
				agentId: agent.agentId,
				task,
				declarationKey,
				intervalMs,
				lastRunAtMs,
				existing,
				nowMs
			});
			const sortOrder = (existing ? snapshot.sortOrderByJobId.get(existing.id) : void 0) ?? snapshot.nextSortOrder++;
			jobPlans.push({
				declarationKey,
				...existing ? { previous: structuredClone(existing) } : {},
				job,
				sortOrder
			});
		}
		if (jobPlans.length !== validatedTasks.length) continue;
		try {
			assertCronStoreCanPersist({
				version: 1,
				jobs: jobPlans.map((plan) => plan.job)
			});
		} catch (error) {
			warnings.push(`Agent "${agent.agentId}" task jobs could not be planned: ${formatErrorMessage(error)}. Scratch was left unchanged.`);
			continue;
		}
		const plan = {
			monitorJobId: monitor.jobId,
			scratchRevision,
			...monitor.state.scratch?.sourceSha256 ? { sourceSha256: monitor.state.scratch.sourceSha256 } : {},
			strippedContent: document.strippedContent,
			jobs: jobPlans
		};
		let outcome;
		try {
			outcome = commitAgentTaskMigration({
				storePath,
				env,
				nowMs,
				plan
			});
		} catch (error) {
			warnings.push(`Agent "${agent.agentId}" task migration could not be committed: ${formatErrorMessage(error)}. Scratch and cron jobs were left unchanged.`);
			continue;
		}
		if (outcome !== "committed") {
			warnings.push(outcome === "revision-conflict" ? `Agent "${agent.agentId}" scratch changed during task migration; no changes were committed.` : `Agent "${agent.agentId}" cron jobs changed during task migration; no changes were committed.`);
			continue;
		}
		for (const jobPlan of jobPlans) {
			const index = snapshot.jobs.findIndex((job) => job.id === jobPlan.job.id);
			if (index >= 0) snapshot.jobs[index] = jobPlan.job;
			else snapshot.jobs.push(jobPlan.job);
			snapshot.sortOrderByJobId.set(jobPlan.job.id, jobPlan.sortOrder);
		}
		changes.push(`Converted ${document.tasks.length} heartbeat task${document.tasks.length === 1 ? "" : "s"} into cron jobs for agent "${agent.agentId}".`);
		try {
			await clearLegacyTaskTimestamps({
				storePath: session.storePath,
				sessionKey: session.sessionKey,
				env,
				tasks: document.tasks
			});
		} catch (error) {
			warnings.push(`Agent "${agent.agentId}" legacy task timestamps could not be cleared after migration: ${formatErrorMessage(error)}. Cron jobs remain authoritative and a rerun is safe.`);
		}
	}
	noteDoctorMigrationResult({
		changes,
		warnings
	});
	return {
		changes,
		warnings
	};
}
//#endregion
export { collectHeartbeatTaskMigrationFindings, maybeMigrateHeartbeatTasksToCron };
