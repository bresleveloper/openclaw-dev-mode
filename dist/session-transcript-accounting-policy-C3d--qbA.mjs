import { u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as deriveContextPromptTokens, o as hasNonzeroUsage, u as normalizeUsage } from "./usage-BqbJmOEZ.mjs";
import { f as selectSessionTranscriptLeafControlledPath, n as isSessionTranscriptLeafControl } from "./transcript-tree-D61jhi_i.mjs";
//#region src/config/sessions/session-transcript-accounting-policy.ts
function isUnavailableContextBarrier(usage) {
	if (usage.contextUsage?.state !== "unavailable") return false;
	return [
		usage.input,
		usage.output,
		usage.cacheRead,
		usage.cacheWrite,
		usage.total
	].every((value) => !(typeof value === "number" && value > 0));
}
function deriveTranscriptUsageSnapshot(usage, trailingMessages) {
	const promptTokens = deriveContextPromptTokens({ lastCallUsage: usage });
	const outputTokens = asPositiveFiniteNumber(usage.output);
	if (!(typeof promptTokens === "number") && !(typeof outputTokens === "number")) return;
	return {
		promptTokens,
		outputTokens,
		trailingMessages
	};
}
function readTranscriptAccountingSnapshot(visit, options) {
	let scanUsage = options.includeUsage;
	let scanTaint = options.includeTurnTaint === true;
	let latestUsage;
	const trailingMessages = [];
	let boundaryFound = false;
	let tainted = false;
	let eventCount = 0;
	let hasLeafControl = false;
	visit((event) => {
		eventCount += 1;
		hasLeafControl ||= isSessionTranscriptLeafControl(event);
		const record = asOptionalRecord(event);
		if (!record) return;
		const messageRecord = asOptionalRecord(record.message);
		const message = messageRecord;
		if (scanUsage) {
			const rawUsage = messageRecord?.usage ?? record.usage;
			const usageFields = asOptionalRecord(rawUsage);
			if (record.type === "compaction" || record.type === "reset" || messageRecord?.api === "cli" && rawUsage && usageFields?.contextUsage === void 0) {
				scanUsage = false;
				trailingMessages.length = 0;
			} else {
				const usage = normalizeUsage(usageFields);
				if (usage && isUnavailableContextBarrier(usage)) {
					scanUsage = false;
					trailingMessages.length = 0;
				} else if (usage && hasNonzeroUsage(usage)) {
					latestUsage = usage;
					scanUsage = false;
				} else if (message) trailingMessages.push(message);
			}
		}
		if (scanTaint && message) {
			if (message.role === "user") {
				boundaryFound = true;
				scanTaint = false;
			} else {
				const metadata = asOptionalRecord(messageRecord?.["__openclaw"]);
				if (metadata?.turnTainted === true || metadata?.resultContentSource === "network") {
					tainted = true;
					scanTaint = false;
				}
			}
		}
	});
	return {
		boundaryFound,
		eventCount,
		hasLeafControl,
		tainted,
		usage: latestUsage ? deriveTranscriptUsageSnapshot(latestUsage, trailingMessages.toReversed()) : void 0
	};
}
/** Both backends visit the bounded active tail newest first. */
function readSessionTranscriptAccountingTail(visit, options) {
	let accounting = readTranscriptAccountingSnapshot(visit, options);
	if (accounting.hasLeafControl) {
		const events = [];
		visit((event) => events.push(event));
		events.reverse();
		const active = selectSessionTranscriptLeafControlledPath(events) ?? events;
		accounting = {
			...readTranscriptAccountingSnapshot((visitor) => {
				for (let index = active.length - 1; index >= 0; index -= 1) visitor(active[index]);
			}, options),
			eventCount: accounting.eventCount
		};
	}
	return {
		...options.includeUsage ? { usage: accounting.usage } : {},
		...options.includeTurnTaint ? { turnTainted: accounting.tainted || !accounting.boundaryFound && accounting.eventCount >= 512 } : {}
	};
}
//#endregion
export { readSessionTranscriptAccountingTail as t };
