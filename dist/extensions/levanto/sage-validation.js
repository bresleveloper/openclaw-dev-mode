import { sanitizeInlineImageDataUrl } from "openclaw/plugin-sdk/inline-image-data-url-runtime";
import { readStringValue } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/levanto/sage-validation.ts
function check(condition, field) {
	if (!condition) throw new Error("Invalid Sage " + field);
}
function object(value, field) {
	check(value !== null && typeof value === "object" && !Array.isArray(value), field);
	return value;
}
function string(value, field) {
	check(typeof value === "string", field);
}
function number(value, min, max, field) {
	check(typeof value === "number" && Number.isFinite(value) && value >= min && value <= max, field);
}
function integer(value, min, max, field) {
	number(value, min, max, field);
	check(Number.isInteger(value), field);
}
function array(value, min, max, field) {
	check(Array.isArray(value) && value.length >= min && value.length <= max, field);
	return value;
}
function unique(values, field) {
	check(new Set(values).size === values.length, field);
}
function assertSageNullableString(value, field) {
	check(value == null || readStringValue(value) !== void 0, field);
}
async function validateSageImage(media, probe) {
	check(sanitizeInlineImageDataUrl(media) === media, "image encoding or MIME");
	const dimensions = await probe(Buffer.from(media.slice(media.indexOf(",") + 1), "base64"));
	check(dimensions, "image dimensions");
	integer(dimensions.width, 1, 8192, "image width");
	integer(dimensions.height, 1, 8192, "image height");
	check(dimensions.width * dimensions.height <= 4096 ** 2, "image area");
}
function metadata(value) {
	const m = object(value, "metadata");
	if (m.model !== void 0) string(m.model, "metadata model");
	assertSageNullableString(m.compute_mode, "compute mode");
	if (m.latency_ms != null) number(m.latency_ms, 0, Infinity, "latency");
	if (m.question_count != null) integer(m.question_count, 0, Infinity, "question count");
	if (m.usage != null) {
		const u = object(m.usage, "usage");
		integer(u.input_tokens, 0, Infinity, "input tokens");
		integer(u.output_tokens, 0, Infinity, "output tokens");
		for (const k of ["image_count", "image_tokens"]) if (u[k] !== void 0) integer(u[k], 0, Infinity, "usage " + k);
	}
	if (m.reasoning != null) {
		const r = object(m.reasoning, "reasoning metadata");
		check(typeof r.ran === "boolean", "reasoning ran");
		if (r.finished != null) check(typeof r.finished === "boolean", "reasoning finished");
		if (r.tokens != null) integer(r.tokens, 0, Infinity, "reasoning tokens");
		if (r.forced !== void 0) check(typeof r.forced === "boolean", "reasoning forced");
		if (r.limited != null) check(typeof r.limited === "string" && [
			"cap",
			"timeout",
			"budget"
		].includes(r.limited), "reasoning limited");
	}
}
function groundingMeta(value) {
	if (value == null) return;
	const g = object(value, "grounding metadata");
	check(typeof g.triggered === "boolean", "grounding triggered");
	assertSageNullableString(g.trigger_reason, "grounding trigger reason");
	if (g.queries !== void 0) for (const v of array(g.queries, 0, Infinity, "queries")) string(v, "query");
	if (g.sources !== void 0) for (const v of array(g.sources, 0, Infinity, "sources")) {
		const source = object(v, "source");
		for (const k of [
			"url",
			"title",
			"snippet"
		]) assertSageNullableString(source[k], "source " + k);
	}
	if (g.added_context_tokens != null) integer(g.added_context_tokens, 0, Infinity, "grounding tokens");
	if (g.search_ms != null) number(g.search_ms, 0, Infinity, "search latency");
}
function orderedProbabilities(value, expected, kind) {
	array(value, expected.length, expected.length, kind + " probabilities").forEach((entry, index) => {
		const probability = object(entry, kind + " probability");
		check(probability[kind] === expected[index], kind + " correlation");
		number(probability.probability, 0, 1, kind + " probability");
	});
}
function parseSageResponse(value, q, c) {
	const v = object(value, "response");
	check(v.id === q.id && v.kind === q.kind, "response correlation");
	metadata(v.meta);
	groundingMeta(v.grounding_meta);
	const r = object(v.result, "result");
	switch (q.kind) {
		case "yesno":
			check(r.answer === null || r.answer === "yes" || r.answer === "no", "answer");
			number(r.probability, 0, 1, "probability");
			break;
		case "choice": {
			const options = q.options.map((o) => o.option);
			check(r.chosen === null || typeof r.chosen === "string" && options.includes(r.chosen), "chosen option");
			if (r.chosen === null) check(r.probability === null, "abstention probability");
			else if (r.probability !== null) number(r.probability, 0, 1, "chosen probability");
			orderedProbabilities(r.probabilities, options, "option");
			break;
		}
		case "scale": {
			const levels = q.levels.map((level) => level.level);
			number(r.expectation, Math.min(...levels), Math.max(...levels), "expectation");
			number(r.confidence, -Infinity, Infinity, "confidence");
			orderedProbabilities(r.probabilities, levels, "level");
			break;
		}
		case "sort": {
			check(typeof c === "object" && c.kind === "list", "sort content");
			const ids = c.value.map((item) => item.id);
			const sorted = array(r.sorted, ids.length, ids.length, "sort length");
			check(sorted.every((id) => typeof id === "string" && ids.includes(id)), "sort correlation");
			unique(sorted, "duplicate sorted ids");
			if (r.confidence != null) number(r.confidence, 0, 1, "sort confidence");
			break;
		}
		case "tags": {
			const image = typeof c === "object" && c.kind === "image";
			unique(array(r.tags, q.tags.length, q.tags.length, "result tags").map((t) => {
				const tag = object(t, "result tag");
				check(q.tags.some((expected) => expected.id === tag.id), "tag correlation");
				number(tag.probability, 0, 1, "tag probability");
				check(typeof tag.applies === "boolean" || !image && tag.applies === null, "tag applies");
				return tag.id;
			}), "duplicate result tags");
			break;
		}
	}
	return value;
}
function parseSageBatchResponse(value, request) {
	const v = object(value, "batch response");
	metadata(v.meta);
	const m = object(v.meta, "batch metadata");
	check(m.request_count === request.requests.length, "batch request count");
	check(m.question_count === request.requests.reduce((n, g) => n + g.questions.length, 0), "batch question count");
	const groups = array(v.results, request.requests.length, request.requests.length, "batch results");
	request.requests.forEach((expected, i) => {
		const answers = array(object(groups[i], "batch result group").answers, expected.questions.length, expected.questions.length, "batch answers");
		expected.questions.forEach((expectedQuestion, j) => {
			const a = object(answers[j], "batch answer");
			if (a.ok === true) {
				check(a.error == null, "successful answer error");
				parseSageResponse(a.result, expectedQuestion, expected.content);
			} else {
				check(a.ok === false && a.result == null, "failed answer");
				string(a.error, "answer error");
			}
		});
	});
	return value;
}
export { parseSageBatchResponse, parseSageResponse, validateSageImage };
