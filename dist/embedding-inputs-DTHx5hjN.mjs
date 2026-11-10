//#region packages/memory-host-sdk/src/host/embedding-inputs.ts
const EMBEDDING_TASK_PREFIXES = {
	RETRIEVAL_QUERY: "task: search result | query:",
	RETRIEVAL_DOCUMENT: "title: none | text:",
	SEMANTIC_SIMILARITY: "task: sentence similarity | query:",
	CLASSIFICATION: "task: classification | query:",
	CLUSTERING: "task: clustering | query:",
	QUESTION_ANSWERING: "task: question answering | query:",
	FACT_VERIFICATION: "task: fact checking | query:"
};
function formatEmbeddingTaskText(text, taskType) {
	return `${EMBEDDING_TASK_PREFIXES[taskType]} ${text}`;
}
/** Advance the model's revision when its input format changes, for index and cache upgrades. */
function resolveEmbeddingInputFormatVersion(model) {
	return /(?:^|[/\\])(?:text-embedding-)?embeddinggemma(?:[-:._]|$)/iu.test(model.trim()) ? 1 : 0;
}
function formatEmbeddingModelInput(input, model, role) {
	if (!resolveEmbeddingInputFormatVersion(model)) return input;
	const taskType = role === "query" ? "RETRIEVAL_QUERY" : "RETRIEVAL_DOCUMENT";
	if (typeof input === "string") return formatEmbeddingTaskText(input, taskType);
	if (hasNonTextEmbeddingParts(input)) return input;
	return {
		...input,
		text: formatEmbeddingTaskText(input.text, taskType),
		...input.parts ? { parts: input.parts.map((part, index) => part.type === "text" && index === 0 ? {
			...part,
			text: formatEmbeddingTaskText(part.text, taskType)
		} : part) } : {}
	};
}
/** Return true when a chunk needs structured provider handling, not text splitting. */
function hasNonTextEmbeddingParts(input) {
	return input?.parts?.some((part) => part.type === "inline-data") ?? false;
}
//#endregion
export { resolveEmbeddingInputFormatVersion as i, formatEmbeddingTaskText as n, hasNonTextEmbeddingParts as r, formatEmbeddingModelInput as t };
