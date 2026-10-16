import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as normalizeProgressCardInput, t as ProgressCardInputError } from "./progress-card-input-B6Lf4ir_.mjs";
import { t as stripMarkdown } from "./strip-markdown-CRKxg_-Y.mjs";
//#region src/session-cards/progress-card-channel-summary.ts
/** Projects checklist counts or readable notes through the shared Markdown owner. */
function projectProgressCardChannelUpdate(input) {
	const record = asOptionalRecord(input);
	if (!record) return;
	try {
		const normalized = normalizeProgressCardInput(record);
		const steps = normalized.steps ?? [];
		const completed = steps.filter((step) => step.status === "completed").length;
		const explanation = steps.length ? `${completed}/${steps.length} complete` : normalized.markdown ? stripMarkdown(normalized.markdown, {
			linkStyle: "label",
			stripHtml: true
		}).replace(/\s+/g, " ").trim() || "Progress updated" : void 0;
		return {
			steps,
			...explanation ? { explanation } : {},
			...!steps.length && explanation ? { explanationFormat: "plain" } : {}
		};
	} catch (error) {
		if (error instanceof ProgressCardInputError) return;
		throw error;
	}
}
//#endregion
export { projectProgressCardChannelUpdate as t };
