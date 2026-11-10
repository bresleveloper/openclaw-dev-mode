import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { r as openOpenClawAgentSqliteWorkerStoreV2 } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import "./sqlite-runtime-COh9hQA9.mjs";
import { d as prepareStandingIntentMatch, l as normalizeCreatorSender } from "./standing-intents-model-CN2LEs96.mjs";
import { t as memoryCpuProcessEntrypoints } from "./manager-cpu-entrypoints-CUaNAvfp.mjs";
import "./process-runtime-CG9_3L3N.mjs";
import { t as captureMemoryAgentDatabaseOptions } from "./memory-agent-database-Dmf9nv8Q.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/memory-core/src/standing-intents.ts
const lifecycleListeners = /* @__PURE__ */ new Set();
async function executeStandingIntent(params, command, options = captureMemoryAgentDatabaseOptions(params.agentId)) {
	const assertCurrent = params.assertCurrent;
	assertCurrent?.();
	const capturedCommand = structuredClone(command);
	const worker = await openOpenClawAgentSqliteWorkerStoreV2(options, {
		version: 2,
		assertCurrent: () => assertCurrent?.()
	}, {
		moduleUrl: resolveRuntimeWorkerUrl(memoryCpuProcessEntrypoints.standingIntents),
		input: void 0
	});
	try {
		await worker.prepare();
		let result = await worker.execute(capturedCommand, () => assertCurrent?.());
		if (result.kind === "schema-prepared") result = await worker.execute(capturedCommand, () => assertCurrent?.());
		if (result.kind === "schema-prepared") throw new Error("Standing-intent schema changed before its business operation");
		for (const listener of lifecycleListeners) listener(options.path, result.nextDueAt);
		return result.value;
	} finally {
		await worker.close();
	}
}
function startStandingIntentMaintenance(params) {
	const { scheduler } = params;
	const targets = new Map(params.agentIds.map((agentId) => {
		const options = captureMemoryAgentDatabaseOptions(agentId);
		return [options.path, {
			agentId,
			options
		}];
	}));
	const jobs = /* @__PURE__ */ new Map();
	const schedule = (path, nextDueAt) => {
		const target = targets.get(path);
		if (!target || scheduler.signal.aborted) return;
		jobs.get(path)?.cancel();
		jobs.delete(path);
		if (nextDueAt === Infinity) return;
		jobs.set(path, scheduler.schedule({
			id: path,
			atMs: nextDueAt ?? scheduler.now(),
			async run() {
				try {
					await executeStandingIntent({
						agentId: target.agentId,
						assertCurrent: () => scheduler.signal.throwIfAborted()
					}, {
						type: "sweep",
						input: { nowMs: scheduler.now() }
					}, target.options);
				} catch (error) {
					if (!scheduler.signal.aborted) {
						params.warn(`memory-core: standing intent maintenance failed: ${String(error)}`);
						schedule(path, scheduler.now() + 3e4);
					}
				}
			}
		}));
	};
	lifecycleListeners.add(schedule);
	for (const path of targets.keys()) schedule(path, null);
	return () => {
		lifecycleListeners.delete(schedule);
		for (const job of jobs.values()) job.cancel();
	};
}
async function createStandingIntent(params) {
	const nowMs = params.nowMs ?? Date.now();
	return executeStandingIntent(params, {
		type: "create",
		input: {
			id: randomUUID(),
			description: params.description,
			trigger_keywords: JSON.stringify(params.triggerKeywords),
			trigger_embedding: null,
			channel_scope: params.channelScope ?? null,
			sender_scope: params.senderScope ?? null,
			creator_sender: normalizeCreatorSender(params.creatorSender),
			status: "armed",
			expires_at: params.expiresAt ?? nowMs + 7776e6,
			max_fires: params.maxFires ?? 3,
			fire_count: 0,
			cooldown_seconds: params.cooldownSeconds ?? 86400,
			last_fired_at: null,
			created_at: nowMs,
			source_session_id: params.sourceSessionId ?? null
		}
	});
}
async function listStandingIntents(params) {
	return executeStandingIntent(params, {
		type: "list",
		input: {
			status: params.status,
			nowMs: params.nowMs
		}
	});
}
async function cancelStandingIntent(params) {
	return executeStandingIntent(params, {
		type: "cancel",
		input: { id: params.id }
	});
}
async function matchStandingIntents(params) {
	const input = prepareStandingIntentMatch(params);
	return input ? executeStandingIntent(params, {
		type: "match",
		input
	}) : [];
}
//#endregion
export { startStandingIntentMaintenance as a, matchStandingIntents as i, createStandingIntent as n, listStandingIntents as r, cancelStandingIntent as t };
