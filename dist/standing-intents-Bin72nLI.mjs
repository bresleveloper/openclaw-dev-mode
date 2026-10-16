import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { f as withOpenClawAgentDatabaseAsync } from "./openclaw-agent-db-DBug3LUA.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpPONdtx.mjs";
import "./sqlite-runtime-Ch9K5Xik.mjs";
import { d as prepareStandingIntentMatch, l as normalizeCreatorSender } from "./standing-intents-model-A1qcnuZp.mjs";
import { t as memoryCpuProcessEntrypoints } from "./manager-cpu-entrypoints-_KEJpSFQ.mjs";
import "./process-runtime-CYiH_oPH.mjs";
import "./state-paths-Dd9pLEOI.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/memory-core/src/standing-intents.ts
async function executeStandingIntent(params, command) {
	const assertCurrent = params.assertCurrent;
	assertCurrent?.();
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: resolveStateDir()
	};
	const options = {
		agentId: params.agentId,
		env,
		path: resolveOpenClawAgentSqlitePath({
			agentId: params.agentId,
			env
		})
	};
	return runOpenClawAgentWriteAdmission(options, async (_identity, assertAdmission) => withOpenClawAgentDatabaseAsync(options, async ({ db }) => {
		assertCurrent?.();
		const worker = await openOpenClawAgentSqliteWorkerStore(options, db, {
			moduleUrl: resolveRuntimeWorkerUrl(memoryCpuProcessEntrypoints.standingIntents),
			input: void 0
		});
		try {
			return await worker.run((scope) => scope.execute(command), () => {
				assertAdmission();
				assertCurrent?.();
			});
		} finally {
			await worker.close();
		}
	}, assertAdmission), true);
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
async function sweepStandingIntents(params) {
	return executeStandingIntent(params, {
		type: "sweep",
		input: { nowMs: params.nowMs }
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
export { sweepStandingIntents as a, matchStandingIntents as i, createStandingIntent as n, listStandingIntents as r, cancelStandingIntent as t };
