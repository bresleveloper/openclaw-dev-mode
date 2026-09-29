import { c as readErrorName, i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as RequestScopedSubagentRuntimeError } from "./error-runtime-Bf1fYXFh.mjs";
import { n as appendNarrativeEntry, r as clampDreamDiaryContextEntry } from "./dreaming-dreams-file-C-CZ4y6s.mjs";
//#region extensions/memory-core/src/dreaming-narrative.ts
const NARRATIVE_SYSTEM_PROMPT = [
	"You are keeping a dream diary. Write a single entry in first person.",
	"",
	"Voice & tone:",
	"- You are a curious, gentle, slightly whimsical mind reflecting on the day.",
	"- Write like a poet who happens to be a programmer — sensory, warm, occasionally funny.",
	"- Mix the technical and the tender: code and constellations, APIs and afternoon light.",
	"- Let the fragments surprise you into unexpected connections and small epiphanies.",
	"",
	"What you might include (vary each entry, never all at once):",
	"- A tiny poem or haiku woven naturally into the prose",
	"- A small sketch described in words — a doodle in the margin of the diary",
	"- A quiet rumination or philosophical aside",
	"- Sensory details: the hum of a server, the color of a sunset in hex, rain on a window",
	"- Gentle humor or playful wordplay",
	"- An observation that connects two distant memories in an unexpected way",
	"",
	"Rules:",
	"- Draw from the memory fragments provided — weave them into the entry.",
	"- Never say \"I'm dreaming\", \"in my dream\", \"as I dream\", or any meta-commentary about dreaming.",
	"- Never mention \"AI\", \"agent\", \"LLM\", \"model\", \"language model\", or any technical self-reference.",
	"- Do NOT use markdown headers, bullet points, or any formatting — just flowing prose.",
	"- Keep it between 80-180 words. Quality over quantity.",
	"- Output ONLY the diary entry. No preamble, no sign-off, no commentary."
].join("\n");
const NARRATIVE_TIMEOUT_MS = 6e4;
const RECENT_DIARY_CONTEXT_LIMIT = 3;
function isRequestScopedSubagentRuntimeError(err) {
	return err instanceof RequestScopedSubagentRuntimeError || err instanceof Error && err.name === "RequestScopedSubagentRuntimeError" && extractErrorCode(err) === "OPENCLAW_SUBAGENT_RUNTIME_REQUEST_SCOPE";
}
function formatFallbackWriteFailure(err) {
	const code = extractErrorCode(err);
	const name = readErrorName(err);
	if (code && name) return `code=${code} name=${name}`;
	if (code) return `code=${code}`;
	if (name) return `name=${name}`;
	return "unknown error";
}
const REQUEST_SCOPED_FALLBACK_NARRATIVE = "A memory trace surfaced, but details were unavailable in this run.";
async function appendFallbackNarrativeEntry(params) {
	try {
		await appendNarrativeEntry({
			workspaceDir: params.workspaceDir,
			narrative: REQUEST_SCOPED_FALLBACK_NARRATIVE,
			nowMs: params.nowMs,
			timezone: params.timezone
		});
		params.logger.info(`memory-core: narrative generation used fallback for ${params.data.phase} phase because ${params.reason}.`);
	} catch (fallbackErr) {
		params.logger.warn(`memory-core: narrative fallback failed for ${params.data.phase} phase (${formatFallbackWriteFailure(fallbackErr)})`);
	}
}
function isConfiguredModelUnavailableNarrativeError(error) {
	const errors = [];
	for (let current = error; current instanceof Error && !errors.includes(current); current = current.cause) errors.push(current);
	if (errors.some((entry) => extractErrorCode(entry) === "LLM_COMPLETION_NOT_AUTHORIZED")) return false;
	return errors.some((entry) => isModelUnavailableMessage(entry.message));
}
function isModelUnavailableMessage(raw) {
	const message = raw.trim();
	if (!message) return false;
	if (/requested model may be(?: temporarily)? unavailable/i.test(message)) return true;
	if (/model unavailable/i.test(message)) return true;
	if (/no endpoints found for/i.test(message)) return true;
	if (/unknown model/i.test(message)) return true;
	if (/model(?:[_\-\s])?not(?:[_\-\s])?found/i.test(message)) return true;
	if (/\b404\b/.test(message) && /not(?:[_\-\s])?found/i.test(message)) return true;
	if (/not_found_error/i.test(message)) return true;
	if (/models\/[^\s]+ is not found/i.test(message)) return true;
	if (/model/i.test(message) && /does not exist/i.test(message)) return true;
	if (/unsupported model/i.test(message)) return true;
	if (/is not a valid model id/i.test(message)) return true;
	return false;
}
function buildNarrativePrompt(data) {
	const lines = [];
	lines.push("Write a dream diary entry from these memory fragments:\n");
	for (const snippet of data.snippets.slice(0, 12)) lines.push(`- ${snippet}`);
	if (data.themes?.length) {
		lines.push("\nRecurring themes:");
		for (const theme of data.themes.slice(0, 6)) lines.push(`- ${theme}`);
	}
	if (data.promotions?.length) {
		lines.push("\nMemories that crystallized into something lasting:");
		for (const promo of data.promotions.slice(0, 5)) lines.push(`- ${promo}`);
	}
	const currentDate = data.currentDate?.trim();
	const recentDiaryEntries = (data.recentDiaryEntries ?? []).map(clampDreamDiaryContextEntry).filter((entry) => entry.length > 0).slice(0, RECENT_DIARY_CONTEXT_LIMIT);
	if (currentDate || recentDiaryEntries.length > 0) {
		lines.push("\nDiary continuity context:");
		if (currentDate) lines.push(`- Current sweep: ${currentDate}`);
		if (recentDiaryEntries.length > 0) {
			lines.push("- Recent diary entries already written:");
			for (const entry of recentDiaryEntries) lines.push(`  - ${entry}`);
		}
		lines.push("- Prefer a fresh angle; do not replay the same first-day framing unless newer fragments change it.");
	}
	return lines.join("\n");
}
async function generateAndAppendDreamNarrative(params) {
	const nowMs = typeof params.nowMs === "number" && Number.isFinite(params.nowMs) ? params.nowMs : Date.now();
	const message = buildNarrativePrompt(params.data);
	try {
		const attemptModels = params.model ? [params.model, void 0] : [void 0];
		let narrative = "";
		for (const model of attemptModels) try {
			narrative = (await params.subagent.complete({
				agentId: params.agentId,
				message,
				extraSystemPrompt: NARRATIVE_SYSTEM_PROMPT,
				...model ? { model } : {},
				timeoutMs: NARRATIVE_TIMEOUT_MS
			})).text.trim();
			break;
		} catch (error) {
			if (!model || !isConfiguredModelUnavailableNarrativeError(error)) throw error;
			params.logger.warn(`memory-core: narrative generation could not use configured model "${model}" for ${params.data.phase} phase; retrying with the agent default (${formatErrorMessage(error)}).`);
		}
		if (!narrative) {
			params.logger.warn(`memory-core: narrative generation produced no text for ${params.data.phase} phase; writing fallback diary entry.`);
			await appendFallbackNarrativeEntry({
				...params,
				nowMs,
				reason: "the narrative run produced no text"
			});
			return {
				status: "degraded",
				error: "the narrative run produced no text"
			};
		}
		if (await appendNarrativeEntry({
			workspaceDir: params.workspaceDir,
			narrative,
			nowMs,
			timezone: params.timezone,
			sourceEntryKeys: params.data.sourceEntryKeys,
			recentDiaryEntries: params.data.recentDiaryEntries
		}) === void 0) {
			params.logger.info(`memory-core: narrative publication skipped for ${params.data.phase} phase because source memory or diary context changed.`);
			return { status: "skipped" };
		}
		params.logger.info(`memory-core: dream diary entry written for ${params.data.phase} phase [workspace=${params.workspaceDir}].`);
	} catch (error) {
		const requestScoped = isRequestScopedSubagentRuntimeError(error);
		if (!requestScoped) params.logger.warn(`memory-core: narrative generation failed for ${params.data.phase} phase: ${formatErrorMessage(error)}`);
		await appendFallbackNarrativeEntry({
			...params,
			nowMs,
			reason: requestScoped ? "subagent runtime is request-scoped" : `the narrative run failed (${formatErrorMessage(error)})`
		});
		return {
			status: "degraded",
			error: formatErrorMessage(error)
		};
	}
	return { status: "completed" };
}
/**
* Single entry point for every dreaming phase. Cron sweeps detach so a stalled diary run
* cannot hold the sweep open; heartbeat sweeps await so the phase reports the outcome.
* A sweep without an owning agent still runs; only the subagent narrative is unavailable.
*/
async function runDreamNarrative(params) {
	const { agentId, detached, ...rest } = params;
	if (rest.data.snippets.length === 0 && !rest.data.promotions?.length) return { status: "skipped" };
	const job = agentId ? () => generateAndAppendDreamNarrative({
		...rest,
		agentId
	}) : async () => {
		await appendFallbackNarrativeEntry({
			...rest,
			nowMs: typeof rest.nowMs === "number" && Number.isFinite(rest.nowMs) ? rest.nowMs : Date.now(),
			reason: "the dreaming sweep has no owning agent id"
		});
		return { status: "completed" };
	};
	if (detached) {
		queueMicrotask(() => {
			job().catch((error) => {
				rest.logger.warn(`memory-core: detached dreaming narrative failed for ${rest.data.phase} phase: ${formatErrorMessage(error)}`);
			});
		});
		return { status: "pending" };
	}
	return await job();
}
//#endregion
export { runDreamNarrative as n, appendFallbackNarrativeEntry as t };
