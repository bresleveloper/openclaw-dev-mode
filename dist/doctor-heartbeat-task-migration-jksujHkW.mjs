import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { a as loadCronRows, g as cronSchedulingInputsEqual, m as upsertCronJobRow, o as loadedCronStoreFromRows, t as assertCronStoreCanPersist } from "./row-codec-mXerryYi.mjs";
import { r as getCronStoreKysely } from "./schema-BUdLKyI9.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { d as patchSessionEntryCore } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { t as cronStoreKey } from "./key-BBZ40bDq.mjs";
import { n as resolveCronJobsStorePathFromConfig } from "./paths-Bz2goYfd.mjs";
import "./store-CV1wrdMb.mjs";
import { o as resolveHeartbeatIntervalMs, r as resolveHeartbeatAgents } from "./heartbeat-config-BvP-hlUW.mjs";
import { n as computeJobNextRunAtMs, s as hasScheduledNextRunAtMs } from "./jobs-scheduling-BuJ7Yxlw.mjs";
import { a as readHeartbeatMonitorScratchReadOnly, i as readHeartbeatMonitorScratch } from "./scratch-store-CQTgBoaX.mjs";
import { n as isHeartbeatTaskCronJob, t as heartbeatTaskDeclarationKey } from "./heartbeat-task-BGANU0wH.mjs";
import { t as resolveHeartbeatSession } from "./heartbeat-runner-session-BdmLvovD.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/commands/heartbeat-task-legacy.ts
function splitHeartbeatLines(content) {
	const lines = [];
	for (const match of content.matchAll(/[^\r\n]*(?:\r\n|\n|\r|$)/g)) {
		const source = match[0];
		if (!source) continue;
		const raw = source.replace(/(?:\r\n|\n|\r)$/, "");
		lines.push({
			raw,
			source
		});
	}
	return lines;
}
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
	return splitHeartbeatLines(content).map((line) => {
		const scanned = scanHeartbeatLine(line.raw, state);
		const lineEnding = line.source.slice(line.raw.length);
		const token = {
			raw: line.raw,
			source: line.source,
			visible: scanned.visible
		};
		if (scanned.hasHtmlComment) token.htmlCommentSource = scanned.htmlCommentRaw + lineEnding;
		return token;
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
		if (isIndented && trimmed.startsWith("interval:")) {
			if (currentTask) currentTask.interval = unquoteTaskValue(trimmed.slice(9));
			else if (!orphanEntryOpen) {
				taskEntryCount += 1;
				orphanEntryOpen = true;
			}
			removedLineIndexes.add(index);
			continue;
		}
		if (isIndented && trimmed.startsWith("prompt:")) {
			if (currentTask) currentTask.prompt = unquoteTaskValue(trimmed.slice(7));
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
const HEARTBEAT_TASK_MIGRATION_CHECK_ID = "core/doctor/heartbeat-task-cron-migration";
function resolveHeartbeatTaskMigrationAgents(cfg) {
	return resolveHeartbeatAgents(cfg).filter((agent) => resolveHeartbeatIntervalMs(cfg, void 0, agent.heartbeat) !== null);
}
function validateTasks(tasks, declaredEntryCount) {
	if (tasks.length === 0) throw new Error("tasks: block has no complete name/interval/prompt entries");
	if (tasks.length !== declaredEntryCount) throw new Error("tasks: block contains an incomplete name/interval/prompt entry");
	const occurrenceCounts = /* @__PURE__ */ new Map();
	const validated = [];
	for (const task of tasks) {
		const intervalMs = parseDurationMs(task.interval, { defaultUnit: "m" });
		if (intervalMs <= 0) throw new Error(`task ${JSON.stringify(task.name)} interval must be greater than zero`);
		const occurrenceIndex = occurrenceCounts.get(task.name) ?? 0;
		occurrenceCounts.set(task.name, occurrenceIndex + 1);
		validated.push({
			task,
			intervalMs,
			occurrenceIndex
		});
	}
	return validated;
}
function migrationFinding(params) {
	return {
		checkId: HEARTBEAT_TASK_MIGRATION_CHECK_ID,
		severity: params.severity ?? "warning",
		message: params.message,
		path: params.storePath,
		target: params.agentId,
		requirement: params.requirement,
		fixHint: `Run ${formatCliCommand("openclaw doctor --fix")} to convert heartbeat tasks into automations.`
	};
}
/** Reports task blocks still owned by heartbeat scratch without changing them. */
async function collectHeartbeatTaskMigrationFindings(cfg, env = process.env) {
	const storePath = resolveCronJobsStorePathFromConfig(cfg, env);
	const findings = [];
	for (const agent of resolveHeartbeatTaskMigrationAgents(cfg)) {
		let monitor;
		try {
			monitor = readHeartbeatMonitorScratchReadOnly(storePath, agent.agentId, { env });
		} catch (error) {
			findings.push(migrationFinding({
				storePath,
				agentId: agent.agentId,
				requirement: "heartbeat-task-migration-blocked",
				severity: "error",
				message: `Agent "${agent.agentId}" heartbeat scratch cannot be inspected: ${formatErrorMessage(error)}`
			}));
			continue;
		}
		const content = monitor?.state.scratch?.content;
		if (!content) continue;
		const document = analyzeLegacyHeartbeatTasks(content);
		if (!document.hasTasksBlock) continue;
		try {
			validateTasks(document.tasks, document.taskEntryCount);
			findings.push(migrationFinding({
				storePath,
				agentId: agent.agentId,
				requirement: "heartbeat-tasks-in-scratch",
				message: `Agent "${agent.agentId}" has ${document.tasks.length} heartbeat task${document.tasks.length === 1 ? "" : "s"} that must become cron jobs.`
			}));
		} catch (error) {
			findings.push(migrationFinding({
				storePath,
				agentId: agent.agentId,
				requirement: "heartbeat-task-migration-blocked",
				severity: "error",
				message: `Agent "${agent.agentId}" heartbeat tasks cannot be migrated: ${formatErrorMessage(error)}`
			}));
		}
	}
	return findings;
}
function taskJobInput(params) {
	const existingAnchor = params.existing?.schedule.kind === "every" && params.existing.schedule.everyMs === params.intervalMs ? params.existing.schedule.anchorMs : void 0;
	const nextDueMs = params.lastRunAtMs === void 0 || params.lastRunAtMs + params.intervalMs <= params.nowMs ? params.nowMs + 1 : params.lastRunAtMs + params.intervalMs;
	return {
		declarationKey: heartbeatTaskDeclarationKey(params.agentId, params.task.name, params.occurrenceIndex),
		displayName: truncateUtf16Safe(`Heartbeat task: ${params.task.name}`, 200),
		name: params.task.name,
		description: "Migrated from heartbeat monitor scratch by openclaw doctor.",
		agentId: params.agentId,
		enabled: true,
		schedule: {
			kind: "every",
			everyMs: params.intervalMs,
			anchorMs: existingAnchor ?? nextDueMs
		},
		payload: {
			kind: "systemEvent",
			text: params.task.prompt
		},
		sessionTarget: "main",
		wakeMode: "next-heartbeat",
		...params.lastRunAtMs === void 0 ? {} : { state: { lastRunAtMs: params.lastRunAtMs } }
	};
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
	const input = taskJobInput(params);
	if (!params.existing) {
		const { state, ...fields } = input;
		const job = {
			id: randomUUID(),
			...fields,
			createdAtMs: params.nowMs,
			updatedAtMs: params.nowMs,
			state: { ...state }
		};
		job.state.nextRunAtMs = computeJobNextRunAtMs(job, params.nowMs);
		return job;
	}
	const previous = params.existing;
	const job = structuredClone(previous);
	job.displayName = input.displayName;
	job.schedule = structuredClone(input.schedule);
	job.payload = structuredClone(input.payload);
	job.enabled = true;
	delete job.pacing;
	delete job.trigger;
	delete job.delivery;
	if (isDeepStrictEqual(taskDeclarativeFields(previous), taskDeclarativeFields(job))) return job;
	job.updatedAtMs = params.nowMs;
	if (!cronSchedulingInputsEqual(previous, job)) {
		job.state.startupCatchupAtMs = void 0;
		job.state.pacedNextRunAtMs = void 0;
		job.state.forcePreservedNextRunAtMs = void 0;
		job.state.nextRunAtMs = computeJobNextRunAtMs(job, params.nowMs);
	} else if (!hasScheduledNextRunAtMs(job.state.nextRunAtMs)) job.state.nextRunAtMs = computeJobNextRunAtMs(job, params.nowMs);
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
function reserveSortOrder(snapshot, existing) {
	const persisted = existing ? snapshot.sortOrderByJobId.get(existing.id) : void 0;
	if (persisted !== void 0) return persisted;
	const sortOrder = snapshot.nextSortOrder;
	snapshot.nextSortOrder += 1;
	return sortOrder;
}
function readScratchRevision(db, storeKey, jobId) {
	return executeSqliteQuerySync(db, getCronStoreKysely(db).selectFrom("cron_job_scratch").select("revision").where("store_key", "=", storeKey).where("job_id", "=", jobId)).rows[0]?.revision ?? 0;
}
function commitAgentTaskMigration(params) {
	const storeKey = cronStoreKey(params.storePath);
	return runOpenClawStateWriteTransaction(({ db }) => {
		if (readScratchRevision(db, storeKey, params.plan.monitorJobId) !== params.plan.scratchRevision) return {
			ok: false,
			reason: "revision-conflict"
		};
		const rows = loadCronRows(db, storeKey);
		const jobsById = new Map(loadedCronStoreFromRows(rows).store.jobs.map((job) => [job.id, job]));
		for (const jobPlan of params.plan.jobs) {
			const matchingRows = rows.filter((row) => row.declaration_key === jobPlan.declarationKey);
			if (jobPlan.previous) {
				const current = jobsById.get(jobPlan.previous.id);
				if (matchingRows.length !== 1 || !current || !isDeepStrictEqual(current, jobPlan.previous)) return {
					ok: false,
					reason: "job-conflict"
				};
			} else if (matchingRows.length > 0 || rows.some((row) => row.job_id === jobPlan.job.id)) return {
				ok: false,
				reason: "job-conflict"
			};
		}
		for (const jobPlan of params.plan.jobs) if (!jobPlan.previous || !isDeepStrictEqual(jobPlan.previous, jobPlan.job)) upsertCronJobRow(db, storeKey, jobPlan.job, jobPlan.sortOrder);
		if (executeSqliteQuerySync(db, getCronStoreKysely(db).updateTable("cron_job_scratch").set({
			content: params.plan.strippedContent,
			revision: params.plan.scratchRevision + 1,
			source_sha256: params.plan.sourceSha256 ?? null,
			updated_at_ms: params.nowMs
		}).where("store_key", "=", storeKey).where("job_id", "=", params.plan.monitorJobId).where("revision", "=", params.plan.scratchRevision)).numAffectedRows !== 1n) throw new Error("scratch revision changed inside task migration transaction");
		return {
			ok: true,
			currentRevision: params.plan.scratchRevision + 1
		};
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
		if (warnings.length > 0) note(warnings.join("\n"), "Doctor warnings");
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
		const session = resolveHeartbeatSession(params.cfg, agent.agentId, agent.heartbeat, void 0, env);
		const legacyState = session.entry?.heartbeatTaskState ?? {};
		const jobPlans = [];
		let blocked = false;
		for (const { task, intervalMs, occurrenceIndex } of validatedTasks) {
			const declarationKey = heartbeatTaskDeclarationKey(agent.agentId, task.name, occurrenceIndex);
			const matches = snapshot.jobs.filter((job) => job.declarationKey === declarationKey);
			const existing = matches[0];
			if (matches.length > 1 || existing && (!isHeartbeatTaskCronJob(existing) || existing.agentId !== agent.agentId || existing.name !== task.name)) {
				warnings.push(`Agent "${agent.agentId}" task ${JSON.stringify(task.name)} collides with an incompatible cron declaration; scratch was left unchanged.`);
				blocked = true;
				break;
			}
			const legacyLastRun = legacyState[task.name];
			const lastRunAtMs = typeof legacyLastRun === "number" && Number.isFinite(legacyLastRun) ? legacyLastRun : void 0;
			const job = convergeTaskJob({
				agentId: agent.agentId,
				task,
				occurrenceIndex,
				intervalMs,
				lastRunAtMs,
				existing,
				nowMs
			});
			const sortOrder = reserveSortOrder(snapshot, existing);
			jobPlans.push({
				declarationKey,
				...existing ? { previous: structuredClone(existing) } : {},
				job,
				sortOrder
			});
		}
		if (blocked) continue;
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
		let committed;
		try {
			committed = commitAgentTaskMigration({
				storePath,
				env,
				nowMs,
				plan
			});
		} catch (error) {
			warnings.push(`Agent "${agent.agentId}" task migration could not be committed: ${formatErrorMessage(error)}. Scratch and cron jobs were left unchanged.`);
			continue;
		}
		if (!committed.ok) {
			warnings.push(committed.reason === "revision-conflict" ? `Agent "${agent.agentId}" scratch changed during task migration; no changes were committed.` : `Agent "${agent.agentId}" cron jobs changed during task migration; no changes were committed.`);
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
	if (changes.length > 0) note(changes.join("\n"), "Doctor changes");
	if (warnings.length > 0) note(warnings.join("\n"), "Doctor warnings");
	return {
		changes,
		warnings
	};
}
//#endregion
export { collectHeartbeatTaskMigrationFindings, maybeMigrateHeartbeatTasksToCron };
