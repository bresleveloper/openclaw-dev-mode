import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import { Bn as preprocess, Et as _enum, Jn as string, Pn as number, or as union } from "./schemas-BOYIvvln.mjs";
import "./session-key-CBvmC8zz.mjs";
//#region src/cron/delivery-field-schemas.ts
/** Parses user-provided cron delivery fields into narrow runtime values. */
const trimStringPreprocess = (value) => typeof value === "string" ? value.trim() : value;
const trimLowercaseStringPreprocess = (value) => normalizeOptionalLowercaseString(value) ?? value;
const DeliveryModeFieldSchema = preprocess(trimLowercaseStringPreprocess, _enum([
	"deliver",
	"announce",
	"none",
	"webhook"
])).transform((value) => value === "deliver" ? "announce" : value);
/** Accepts non-empty string fields after trimming and lowercasing user-provided delivery input. */
const LowercaseNonEmptyStringFieldSchema = preprocess(trimLowercaseStringPreprocess, string().min(1));
/** Accepts non-empty string fields after trimming delivery input without changing case. */
const TrimmedNonEmptyStringFieldSchema = preprocess(trimStringPreprocess, string().min(1));
/** Accepts delivery thread identifiers as either trimmed strings or finite numeric ids. */
const DeliveryThreadIdFieldSchema = union([TrimmedNonEmptyStringFieldSchema, number().finite()]);
/** Accepts non-negative finite timeout seconds from cron delivery payloads. */
const TimeoutSecondsFieldSchema = number().finite().nonnegative();
/** Parses optional cron delivery fields while dropping invalid values instead of throwing. */
function parseDeliveryInput(input) {
	return {
		mode: parseOptionalField(DeliveryModeFieldSchema, input.mode),
		channel: parseOptionalField(LowercaseNonEmptyStringFieldSchema, input.channel),
		to: parseOptionalField(TrimmedNonEmptyStringFieldSchema, input.to),
		threadId: parseOptionalField(DeliveryThreadIdFieldSchema, input.threadId),
		accountId: parseOptionalField(TrimmedNonEmptyStringFieldSchema, input.accountId)
	};
}
/** Parses present optional fields, returning undefined for missing or invalid values. */
function parseOptionalField(schema, value) {
	const parsed = value === void 0 ? void 0 : schema.safeParse(value);
	return parsed?.success ? parsed.data : void 0;
}
//#endregion
//#region src/cron/service/normalize.ts
/** Normalizes a required cron job name and throws the public validation error when absent. */
function normalizeRequiredName(raw) {
	if (typeof raw !== "string") throw new Error("automation name is required");
	const name = raw.trim();
	if (!name) throw new Error("automation name is required");
	return name;
}
function truncateText(input, maxLen) {
	return truncateWithMarker(input, maxLen, {
		marker: "…",
		reserve: 1,
		trimEnd: true
	});
}
/** Infers a compact cron job name from payload text first, then schedule shape. */
function inferCronJobName(job) {
	const firstLine = (job?.payload?.kind === "systemEvent" && typeof job.payload.text === "string" ? job.payload.text : job?.payload?.kind === "agentTurn" && typeof job.payload.message === "string" ? job.payload.message : job?.payload?.kind === "command" && Array.isArray(job.payload.argv) ? job.payload.argv.join(" ") : "").split("\n").map((l) => l.trim()).find(Boolean) ?? "";
	if (firstLine) return truncateText(firstLine, 60);
	const kind = typeof job?.schedule?.kind === "string" ? job.schedule.kind : "";
	if (kind === "cron" && typeof job?.schedule?.expr === "string") return `Cron: ${truncateText(job.schedule.expr, 52)}`;
	if (kind === "every" && typeof job?.schedule?.everyMs === "number") return `Every: ${job.schedule.everyMs}ms`;
	if (kind === "at") return "One-shot";
	return "Automation";
}
/** Extracts the executable text from cron payload variants for main-session queueing. */
function normalizePayloadToSystemText(payload) {
	if (payload.kind === "systemEvent") return typeof payload.text === "string" ? payload.text.trim() : "";
	return payload.kind === "agentTurn" && typeof payload.message === "string" ? payload.message.trim() : "";
}
//#endregion
export { LowercaseNonEmptyStringFieldSchema as a, parseDeliveryInput as c, DeliveryThreadIdFieldSchema as i, parseOptionalField as l, normalizePayloadToSystemText as n, TimeoutSecondsFieldSchema as o, normalizeRequiredName as r, TrimmedNonEmptyStringFieldSchema as s, inferCronJobName as t };
