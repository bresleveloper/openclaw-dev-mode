import { d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { Fn as object, Jn as string, Pn as number } from "./schemas-BOYIvvln.mjs";
import { t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-DotKkoz0.mjs";
//#region src/chat/transcript-display-position.ts
const ordinal = number().int().nonnegative();
const positionSchema = object({
	source: string().min(1).max(128),
	rawSeq: ordinal,
	activity: object({
		afterRawSeq: ordinal.nullable(),
		scopeId: string().min(1).max(1024),
		startOrder: ordinal
	}).optional()
}).refine(({ rawSeq, activity }) => !activity || activity.afterRawSeq === null || activity.afterRawSeq < rawSeq);
/** Public placement metadata is bounded and never supplies execution authority. */
function readTranscriptDisplayPosition(value) {
	if (!asOptionalRecord(value)) return;
	const parsed = positionSchema.safeParse(value);
	return parsed.success ? parsed.data : void 0;
}
/** Recompose presentation after pages/events merge, without changing physical cursor order. */
function composeTranscriptDisplay(values, messageFor = (value) => value) {
	const output = [];
	let start = 0;
	let positions = [];
	let activities = [];
	let previousStableSeq;
	let monotonic = true;
	const flush = () => {
		if (positions.length === 0) return;
		const current = positions;
		const activityIndexes = activities;
		const recompose = monotonic && activityIndexes.length > 0;
		positions = [];
		activities = [];
		previousStableSeq = void 0;
		monotonic = true;
		if (!recompose) return;
		const selected = output.splice(start);
		const ordered = activityIndexes.toSorted((left, right) => {
			const a = current[left].activity.afterRawSeq;
			const b = current[right].activity.afterRawSeq;
			if (a === b) return current[left].rawSeq - current[right].rawSeq;
			if (a === null) return -1;
			return b === null ? 1 : a - b;
		});
		let next = 0;
		const emitGap = (beforeRawSeq) => {
			let cohorts;
			while (next < ordered.length) {
				const index = ordered[next];
				const position = current[index];
				const activity = position.activity;
				if (beforeRawSeq !== void 0 && activity.afterRawSeq !== null && activity.afterRawSeq >= beforeRawSeq) break;
				cohorts ??= /* @__PURE__ */ new Map();
				let cohort = cohorts.get(activity.scopeId);
				if (!cohort) {
					cohort = {
						firstSeq: position.rawSeq,
						rows: []
					};
					cohorts.set(activity.scopeId, cohort);
				}
				cohort.firstSeq = Math.min(cohort.firstSeq, position.rawSeq);
				cohort.rows.push(index);
				next += 1;
			}
			if (!cohorts) return;
			for (const cohort of [...cohorts.values()].toSorted((a, b) => a.firstSeq - b.firstSeq)) {
				const sorted = cohort.rows.toSorted((a, b) => current[a].activity.startOrder - current[b].activity.startOrder || current[a].rawSeq - current[b].rawSeq);
				for (const index of sorted) output.push(selected[index]);
			}
		};
		for (let index = 0; index < current.length; index += 1) {
			const position = current[index];
			if (!position.activity) {
				emitGap(position.rawSeq);
				output.push(selected[index]);
			}
		}
		emitGap();
	};
	for (const value of values) {
		const position = readTranscriptDisplayPosition(asOptionalRecord(asOptionalRecord(messageFor(value))?.["__openclaw"])?.transcriptPosition);
		if (!position) {
			flush();
			output.push(value);
			start = output.length;
			continue;
		}
		if (positions.at(-1)?.source !== position.source) {
			flush();
			start = output.length;
		}
		if (position.activity) activities.push(positions.length);
		else {
			monotonic &&= previousStableSeq === void 0 || previousStableSeq <= position.rawSeq;
			previousStableSeq = position.rawSeq;
		}
		positions.push(position);
		output.push(value);
	}
	flush();
	return output.every((value, index) => value === values[index]) ? values : output;
}
//#endregion
//#region src/gateway/transcript-image-artifacts.ts
const PREFIX = "artifact_transcript_image_";
function imageReference(message, contentIndex) {
	const metadata = asOptionalRecord(message["__openclaw"]);
	const position = readTranscriptDisplayPosition(metadata?.transcriptPosition);
	const messageId = metadata?.id;
	const messageSeq = asPositiveSafeInteger(metadata?.seq);
	if (!position || typeof messageId !== "string" || !messageId || messageId.length > 1024 || messageSeq === void 0 || messageSeq >= Number.MAX_SAFE_INTEGER) return;
	return {
		source: position.source,
		rawSeq: position.rawSeq,
		messageId,
		messageSeq,
		contentIndex
	};
}
function encodeReference(reference) {
	return PREFIX + Buffer.from(JSON.stringify(reference)).toString("base64url");
}
function parseTranscriptImageArtifactId(id) {
	if (!id.startsWith(PREFIX) || id.length > 8192) return;
	try {
		const value = asOptionalRecord(JSON.parse(Buffer.from(id.slice(26), "base64url").toString("utf8")));
		if (!value || typeof value.source !== "string" || !value.source || value.source.length > 128 || typeof value.messageId !== "string" || !value.messageId || value.messageId.length > 1024 || typeof value.messageSeq !== "number" || !Number.isSafeInteger(value.messageSeq) || value.messageSeq < 1 || value.messageSeq >= Number.MAX_SAFE_INTEGER || typeof value.rawSeq !== "number" || !Number.isSafeInteger(value.rawSeq) || value.rawSeq < 0 || typeof value.contentIndex !== "number" || !Number.isSafeInteger(value.contentIndex) || value.contentIndex < 0) return;
		const reference = {
			source: value.source,
			rawSeq: value.rawSeq,
			messageId: value.messageId,
			messageSeq: value.messageSeq,
			contentIndex: value.contentIndex
		};
		return encodeReference(reference) === id ? reference : void 0;
	} catch {
		return;
	}
}
function displayContentField(message) {
	return message.role === "assistant" && Array.isArray(message["openclawDisplayContent"]) ? ASSISTANT_DISPLAY_CONTENT_FIELD : "content";
}
function hasInlineImagePayload(block) {
	const source = asOptionalRecord(block.source);
	return block.type === "image" && [block.data, source?.data].some((value) => typeof value === "string" && value.length > 0);
}
/** References retain the reader's physical generation and raw block position before display filtering. */
function projectTranscriptImageArtifacts(message) {
	const record = asOptionalRecord(message);
	if (!record) return message;
	const field = displayContentField(record);
	const content = record[field];
	if (!Array.isArray(content)) return message;
	let projected;
	for (let index = 0; index < content.length; index++) {
		const block = asOptionalRecord(content[index]);
		if (!block || !hasInlineImagePayload(block) || typeof block.url === "string" && block.url.trim()) continue;
		const reference = imageReference(record, index);
		if (!reference) continue;
		projected ??= content.slice();
		projected[index] = {
			...block,
			artifactId: encodeReference(reference)
		};
	}
	return projected ? {
		...record,
		[field]: projected
	} : message;
}
function resolveTranscriptImageArtifactBlock(message, id) {
	const reference = parseTranscriptImageArtifactId(id);
	const record = asOptionalRecord(message);
	if (!reference || !record) return;
	const current = imageReference(record, reference.contentIndex);
	if (!current || encodeReference(current) !== id) return;
	const content = record[displayContentField(record)];
	const block = Array.isArray(content) ? asOptionalRecord(content[reference.contentIndex]) : void 0;
	return block && hasInlineImagePayload(block) ? block : void 0;
}
//#endregion
export { readTranscriptDisplayPosition as a, composeTranscriptDisplay as i, projectTranscriptImageArtifacts as n, resolveTranscriptImageArtifactBlock as r, parseTranscriptImageArtifactId as t };
