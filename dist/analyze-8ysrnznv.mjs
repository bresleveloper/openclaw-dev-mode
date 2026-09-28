import { t as expectDefined } from "./expect-runtime-CJBt0Gq2.mjs";
//#region extensions/logbook/src/day.ts
/** Formats an epoch-ms timestamp as a local-time YYYY-MM-DD day key. */
function dayKeyFor(ms) {
	const date = new Date(ms);
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const dayOfMonth = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${dayOfMonth}`;
}
//#endregion
//#region extensions/logbook/src/prompts.ts
const CARD_MIN_MINUTES = 10;
const CARD_MAX_MINUTES = 60;
const CARD_CATEGORIES = [
	"coding",
	"review",
	"writing",
	"research",
	"comms",
	"meetings",
	"design",
	"ops",
	"browsing",
	"media",
	"other"
];
function formatClock(ms) {
	const date = new Date(ms);
	return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
}
const OBSERVATION_JSON_SCHEMA = {
	type: "object",
	additionalProperties: false,
	required: ["segments"],
	properties: { segments: {
		type: "array",
		items: {
			type: "object",
			additionalProperties: false,
			required: [
				"start",
				"end",
				"description"
			],
			properties: {
				start: {
					type: "string",
					description: "HH:MM:SS within the covered window"
				},
				end: {
					type: "string",
					description: "HH:MM:SS within the covered window"
				},
				description: { type: "string" }
			}
		}
	} }
};
function buildObservationInstructions(params) {
	const start = formatClock(params.startMs);
	const end = formatClock(params.endMs);
	const times = params.frameTimes.map(formatClock).join(", ");
	return [
		`These are ${params.frameTimes.length} screenshots of one computer screen, captured in order between ${start} and ${end} (local time).`,
		`Capture timestamps: ${times}.`,
		"",
		"Write an activity log detailed enough that the user could reconstruct what they did.",
		"For each segment ask: \"What EXACTLY did they do? What SPECIFIC things are visible?\"",
		"Capture exact app/site names, file names, URLs, page or PR titles, usernames, search queries, and numbers when readable.",
		"",
		"Bad: \"Checked email\". Good: \"Gmail: read 'Budget approval' from dana@acme.com, replied briefly\".",
		"Bad: \"Working on code\". Good: \"VS Code: editing store.ts, fixing a type error in replaceCardsInWindow\".",
		"",
		"Return 2-8 segments covering the whole window in order, no gaps, no overlaps.",
		"If the screen barely changes, return one segment describing the sustained activity.",
		"Group by GOAL, not app: debugging across editor, terminal, and browser is one segment.",
		`Timestamps must be HH:MM:SS between ${start} and ${end}.`
	].join("\n");
}
function buildCardsPrompt(params) {
	const transcript = params.observations.map((obs) => `[${formatClock(obs.startMs)} - ${formatClock(obs.endMs)}] ${obs.text}`).join("\n");
	const previous = JSON.stringify(params.previousCards.map((card) => ({
		startTime: formatClock(card.startMs),
		endTime: formatClock(card.endMs),
		category: card.category,
		title: card.title,
		summary: card.summary,
		detailedSummary: card.detail,
		distractions: card.distractions.map((d) => ({
			startTime: formatClock(d.startMs),
			endTime: formatClock(d.endMs),
			title: d.title
		})),
		appSites: {
			primary: card.appPrimary ?? "",
			secondary: card.appSecondary ?? ""
		}
	})), null, 2);
	return [
		"You are synthesizing a user's screen activity log into timeline cards. Each card is one coherent activity.",
		"",
		"CORE PRINCIPLE:",
		`Each card = one main thing the user did. Time is a constraint (${CARD_MIN_MINUTES}-${CARD_MAX_MINUTES} min per card), not a goal.`,
		"",
		"SPLIT into a new card only when the user's GOAL changes, not just the tool. MERGE when consecutive activities serve the same goal (app switches, debugging across editor + terminal + browser, iterating on the same document). Default to merging: fewer rich cards beat many granular ones.",
		"",
		"DISTRACTIONS: a brief (<5 min) unrelated interruption inside a card. Anything sustained (>10 min) is its own card.",
		"",
		"CONTINUITY: adjacent cards meet cleanly; never introduce gaps or overlaps. Preserve genuine idle gaps from the source data.",
		"",
		`CATEGORY: one of ${CARD_CATEGORIES.join(", ")}.`,
		"",
		"APP SITES: identify the main app or site per card as a canonical lower-case domain (figma.com, docs.google.com, github.com). Use \"terminal\" for terminals. Omit secondary when unclear. Never invent brands.",
		"",
		"REVISION CONTRACT:",
		"\"Previous cards\" is a draft you are revising and extending with the new observations. Your output must cover the union of the previous cards' time range and the new observations' range; you may restructure freely inside it, but do not drop covered time. The final card may be shorter than the minimum.",
		"",
		`Day: ${params.day}. Window under revision: ${formatClock(params.windowStartMs)} to ${formatClock(params.windowEndMs)}.`,
		"",
		"Previous cards:",
		previous,
		"",
		"New observations:",
		transcript || "(none)",
		"",
		"Return ONLY a raw JSON array, no code fences, in this exact shape:",
		`[
  {
    "startTime": "13:12:00",
    "endTime": "13:41:00",
    "category": "coding",
    "title": "",
    "summary": "",
    "detailedSummary": "",
    "distractions": [{ "startTime": "13:15:00", "endTime": "13:18:00", "title": "" }],
    "appSites": { "primary": "", "secondary": "" }
  }
]`
	].join("\n");
}
function buildCardsCorrectionPrompt(validationError) {
	return [
		"The previous JSON output failed validation:",
		validationError,
		"",
		"Return the FULL corrected JSON array (not a diff). Same coverage, no gaps or overlaps, JSON only."
	].join("\n");
}
function buildStandupPrompt(params) {
	const render = (cards) => cards.map((card) => `- ${formatClock(card.startMs)}-${formatClock(card.endMs)} [${card.category}] ${card.title}: ${card.summary}`).join("\n") || "(no tracked activity)";
	return [
		`Write a concise daily standup for ${params.day} based on the user's tracked screen activity.`,
		"",
		"Yesterday's timeline:",
		render(params.previousDayCards),
		"",
		"Today's timeline so far:",
		render(params.cards),
		"",
		"Output markdown with exactly three sections: '## Done' (yesterday's concrete accomplishments, merged and deduplicated), '## Today' (in-progress threads worth continuing), '## Blockers' (only if evidence shows something stuck; otherwise write 'None observed').",
		"Keep it under 150 words. No preamble."
	].join("\n");
}
function buildAskPrompt(params) {
	const cards = params.cards.map((card) => `- ${formatClock(card.startMs)}-${formatClock(card.endMs)} [${card.category}] ${card.title}: ${card.summary} ${card.detail}`).join("\n");
	const observations = params.observations.map((obs) => `- ${formatClock(obs.startMs)}-${formatClock(obs.endMs)}: ${obs.text}`).join("\n");
	return [
		`Answer the user's question about their tracked day (${params.day}) using ONLY the evidence below.`,
		"If the evidence does not contain the answer, say so plainly. Reference times like 14:05 when useful.",
		"",
		"Timeline cards:",
		cards || "(none)",
		"",
		"Detailed observations:",
		observations || "(none)",
		"",
		`Question: ${params.question}`,
		"",
		"Answer in 1-4 sentences."
	].join("\n");
}
//#endregion
//#region extensions/logbook/src/analyze.ts
/** Cards within this window before a batch are treated as a revisable draft. */
const CARD_LOOKBACK_MS = 27e5;
/** Frame gap that splits one analysis window into separate batches. */
const BATCH_MAX_GAP_MS = 12e4;
/** Parses "HH:MM:SS" (or "H:MM", with optional am/pm) on a local day into epoch ms. */
function clockToMs(day, clock) {
	const match = /^\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?\s*$/i.exec(clock);
	if (!match) return null;
	let hours = Number(match[1]);
	const minutes = Number(match[2]);
	const seconds = Number(match[3] ?? "0");
	const meridiem = match[4]?.toLowerCase();
	if (meridiem && (hours < 1 || hours > 12)) return null;
	if (meridiem === "pm" && hours < 12) hours += 12;
	if (meridiem === "am" && hours === 12) hours = 0;
	if (hours > 23 || minutes > 59 || seconds > 59) return null;
	const dayMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
	if (!dayMatch) return null;
	const year = Number(dayMatch[1]);
	const monthIndex = Number(dayMatch[2]) - 1;
	const dayOfMonth = Number(dayMatch[3]);
	const date = new Date(year, monthIndex, dayOfMonth, hours, minutes, seconds);
	if (date.getFullYear() !== year || date.getMonth() !== monthIndex || date.getDate() !== dayOfMonth || date.getHours() !== hours || date.getMinutes() !== minutes || date.getSeconds() !== seconds) return null;
	return date.getTime();
}
/** Strips code fences and extracts the outermost JSON array/object from model text. */
function extractJsonPayload(raw) {
	const cleaned = raw.replaceAll("```json", "").replaceAll("```", "").trim();
	const firstBracket = cleaned.search(/[[{]/);
	if (firstBracket < 0) return cleaned;
	const close = cleaned[firstBracket] === "[" ? "]" : "}";
	const lastClose = cleaned.lastIndexOf(close);
	if (lastClose > firstBracket) return cleaned.slice(firstBracket, lastClose + 1);
	return cleaned;
}
function parseObservationSegments(params) {
	let parsed;
	try {
		parsed = JSON.parse(extractJsonPayload(params.raw));
	} catch {
		return [];
	}
	const list = Array.isArray(parsed) ? parsed : parsed && typeof parsed === "object" && Array.isArray(parsed.segments) ? parsed.segments : [];
	const segments = [];
	for (const entry of list) {
		if (!entry || typeof entry !== "object") continue;
		const record = entry;
		const description = typeof record.description === "string" ? record.description.trim() : "";
		const startMs = typeof record.start === "string" ? clockToMs(params.day, record.start) : null;
		const endMs = typeof record.end === "string" ? clockToMs(params.day, record.end) : null;
		if (!description || startMs === null || endMs === null) continue;
		const clampedStart = Math.max(params.startMs, Math.min(startMs, params.endMs));
		const clampedEnd = Math.max(clampedStart, Math.min(endMs, params.endMs));
		segments.push({
			startMs: clampedStart,
			endMs: clampedEnd,
			text: description
		});
	}
	return segments.toSorted((a, b) => a.startMs - b.startMs);
}
function normalizeCategory(value) {
	const category = typeof value === "string" ? value.trim().toLowerCase() : "";
	return CARD_CATEGORIES.includes(category) ? category : "other";
}
function normalizeDomain(value) {
	if (typeof value !== "string") return;
	const domain = value.trim().toLowerCase().replace(/^https?:\/\//, "").split(/[/?#]/)[0];
	return domain && domain.length <= 100 ? domain : void 0;
}
function parseDistractions(day, value) {
	if (!Array.isArray(value)) return [];
	const distractions = [];
	for (const entry of value) {
		if (!entry || typeof entry !== "object") continue;
		const record = entry;
		const startMs = typeof record.startTime === "string" ? clockToMs(day, record.startTime) : null;
		const endMs = typeof record.endTime === "string" ? clockToMs(day, record.endTime) : null;
		const title = typeof record.title === "string" ? record.title.trim() : "";
		if (startMs === null || endMs === null || !title || endMs <= startMs) continue;
		distractions.push({
			startMs,
			endMs,
			title
		});
	}
	return distractions;
}
function parseCardsJson(params) {
	let parsed;
	try {
		parsed = JSON.parse(extractJsonPayload(params.raw));
	} catch (err) {
		return {
			ok: false,
			error: `Output is not valid JSON: ${err.message}`
		};
	}
	if (!Array.isArray(parsed)) return {
		ok: false,
		error: "Output must be a JSON array of cards."
	};
	const drafts = [];
	const problems = [];
	parsed.forEach((entry, index) => {
		if (!entry || typeof entry !== "object") {
			problems.push(`Card ${index}: not an object.`);
			return;
		}
		const raw = entry;
		const title = typeof raw.title === "string" ? raw.title.trim() : "";
		const summary = typeof raw.summary === "string" ? raw.summary.trim() : "";
		const startMs = typeof raw.startTime === "string" ? clockToMs(params.day, raw.startTime) : null;
		const endMs = typeof raw.endTime === "string" ? clockToMs(params.day, raw.endTime) : null;
		if (startMs === null || endMs === null) {
			problems.push(`Card ${index}: startTime/endTime must be HH:MM:SS local time.`);
			return;
		}
		if (endMs <= startMs) {
			problems.push(`Card ${index}: endTime must be after startTime.`);
			return;
		}
		if (!title || !summary) {
			problems.push(`Card ${index}: title and summary are required.`);
			return;
		}
		const appSites = raw.appSites && typeof raw.appSites === "object" ? raw.appSites : {};
		drafts.push({
			day: params.day,
			startMs,
			endMs,
			title,
			summary,
			detail: typeof raw.detailedSummary === "string" ? raw.detailedSummary.trim() : "",
			category: normalizeCategory(raw.category),
			appPrimary: normalizeDomain(appSites.primary),
			appSecondary: normalizeDomain(appSites.secondary),
			distractions: parseDistractions(params.day, raw.distractions),
			keyframeId: void 0
		});
	});
	if (problems.length > 0) return {
		ok: false,
		error: problems.join("\n")
	};
	if (drafts.length === 0) return {
		ok: false,
		error: "Output contained no valid cards."
	};
	const sorted = drafts.toSorted((a, b) => a.startMs - b.startMs);
	const normalized = [];
	for (const current of sorted) {
		const previous = normalized.at(-1);
		if (!previous) {
			normalized.push(current);
			continue;
		}
		const overlapMs = previous.endMs - current.startMs;
		if (overlapMs > 6e4) return {
			ok: false,
			error: `Cards ${normalized.length - 1} and ${normalized.length} overlap by ${Math.round(overlapMs / 6e4)} minutes; adjacent cards must meet cleanly.`
		};
		if (overlapMs > 0) normalized.push({
			...current,
			startMs: previous.endMs
		});
		else normalized.push(current);
	}
	return {
		ok: true,
		drafts: normalized
	};
}
/** Sub-minute slack so minute-rounded model times do not fail coverage checks. */
const COVERAGE_TOLERANCE_MS = 12e4;
function formatClockForError(ms) {
	const date = new Date(ms);
	return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
/**
* Validates that drafts cover every required span before the destructive
* window replacement. Without this, a syntactically valid but partial model
* output would silently erase previously synthesized cards.
*/
function validateCardCoverage(params) {
	const tolerance = params.toleranceMs ?? COVERAGE_TOLERANCE_MS;
	const problems = [];
	for (const draft of params.drafts) if (draft.startMs < params.windowStartMs - tolerance || draft.endMs > params.windowEndMs + tolerance) problems.push(`Card ${formatClockForError(draft.startMs)}-${formatClockForError(draft.endMs)} lies outside the revision window ${formatClockForError(params.windowStartMs)}-${formatClockForError(params.windowEndMs)}.`);
	const covered = params.drafts.map((draft) => ({
		startMs: draft.startMs,
		endMs: draft.endMs
	})).toSorted((a, b) => a.startMs - b.startMs);
	for (const span of params.requiredSpans) {
		let cursor = span.startMs;
		for (const interval of covered) {
			if (interval.endMs <= cursor) continue;
			if (interval.startMs > cursor + tolerance) break;
			cursor = Math.max(cursor, interval.endMs);
			if (cursor >= span.endMs - tolerance) break;
		}
		if (cursor < span.endMs - tolerance) problems.push(`Time ${formatClockForError(Math.max(cursor, span.startMs))}-${formatClockForError(span.endMs)} from the previous timeline is not covered; do not drop existing cards or observed time.`);
	}
	if (problems.length > 0) return {
		ok: false,
		error: problems.join("\n")
	};
	return { ok: true };
}
/** Union of the revision window: previous draft cards plus the new batch range. */
function revisionWindow(params) {
	let startMs = params.batchStartMs;
	let endMs = params.batchEndMs;
	for (const card of params.previousCards) {
		startMs = Math.min(startMs, card.startMs);
		endMs = Math.max(endMs, card.endMs);
	}
	return {
		startMs,
		endMs
	};
}
/** Groups pending frames into one batch window, splitting on large gaps. */
function selectBatchFrames(params) {
	if (params.frames.length === 0) return null;
	const first = expectDefined(params.frames[0], "first pending Logbook frame");
	const firstDay = dayKeyFor(first.capturedAtMs);
	const nextDayStart = new Date(first.capturedAtMs);
	nextDayStart.setHours(24, 0, 0, 0);
	const windowEnd = Math.min(first.capturedAtMs + params.windowMs, nextDayStart.getTime());
	const selected = [];
	let previousTs = first.capturedAtMs;
	let endedEarly = false;
	for (const frame of params.frames) {
		if (frame.capturedAtMs >= windowEnd) {
			endedEarly = dayKeyFor(frame.capturedAtMs) !== firstDay;
			break;
		}
		if (selected.length > 0 && frame.capturedAtMs - previousTs > BATCH_MAX_GAP_MS) {
			endedEarly = true;
			break;
		}
		if (selected.length > 0 && dayKeyFor(frame.capturedAtMs) !== firstDay) {
			endedEarly = true;
			break;
		}
		selected.push(frame);
		previousTs = frame.capturedAtMs;
	}
	if (selected.length === 0) return null;
	const last = expectDefined(selected.at(-1), "last selected Logbook frame");
	const windowElapsed = params.nowMs >= windowEnd;
	if (!windowElapsed && !endedEarly && !params.force) return null;
	const endMs = windowElapsed && !endedEarly ? windowEnd : last.capturedAtMs + 1;
	return {
		frameIds: selected.map((frame) => frame.id),
		startMs: first.capturedAtMs,
		endMs
	};
}
/** Picks the frame closest to a card's midpoint as its keyframe. */
function pickKeyframeId(card, frames) {
	if (frames.length === 0) return;
	const midpoint = card.startMs + (card.endMs - card.startMs) / 2;
	let best = expectDefined(frames[0], "first Logbook keyframe candidate");
	for (const frame of frames) if (Math.abs(frame.capturedAtMs - midpoint) < Math.abs(best.capturedAtMs - midpoint)) best = frame;
	return best.id;
}
//#endregion
export { revisionWindow as a, OBSERVATION_JSON_SCHEMA as c, buildCardsPrompt as d, buildObservationInstructions as f, pickKeyframeId as i, buildAskPrompt as l, dayKeyFor as m, parseCardsJson as n, selectBatchFrames as o, buildStandupPrompt as p, parseObservationSegments as r, validateCardCoverage as s, CARD_LOOKBACK_MS as t, buildCardsCorrectionPrompt as u };
