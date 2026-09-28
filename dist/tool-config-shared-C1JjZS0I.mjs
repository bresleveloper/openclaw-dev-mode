import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { p as readProviderJsonObjectResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { i as truncateSanitizedExternalContent } from "./external-content-CLufk6dK.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import { d as postTrustedWebToolsJson } from "./web-search-provider-common-6Yt6-I5E.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import "./provider-http-Dn9NddwC.mjs";
import "./provider-web-search-CRDOBhl4.mjs";
import { r as normalizeXaiModelId } from "./model-id-BpefGMul.mjs";
import { d as resolveXaiCatalogEntry } from "./model-definitions-DA8Fbxqz.mjs";
import { t as applyXaiRuntimeModelCompat } from "./runtime-model-compat-CIAAaij7.mjs";
//#region extensions/xai/src/responses-tool-shared.ts
const XAI_CITATION_MAX_COUNT = 20;
const XAI_CITATION_MAX_SCAN = 1e3;
const XAI_CITATION_URL_MAX_CHARS = 2048;
function normalizeXaiCitationUrl(value) {
	if (typeof value !== "string" || value.length > XAI_CITATION_URL_MAX_CHARS) return;
	try {
		const url = new URL(value);
		if (url.protocol !== "http:" && url.protocol !== "https:" || url.href.length > XAI_CITATION_URL_MAX_CHARS) return;
		return url.href === `${value}/` ? value : url.href;
	} catch {
		return;
	}
}
function collectUrlCitations(annotations, citations) {
	if (!Array.isArray(annotations)) return;
	let scanned = 0;
	for (const annotation of annotations) {
		if (++scanned > XAI_CITATION_MAX_SCAN || citations.size >= XAI_CITATION_MAX_COUNT) break;
		if (!isRecord(annotation) || annotation.type !== "url_citation") continue;
		const url = normalizeXaiCitationUrl(annotation.url);
		if (url) citations.add(url);
	}
}
const XAI_RESPONSES_BASE_URL = "https://api.x.ai/v1";
const XAI_RESPONSES_ENDPOINT = `${XAI_RESPONSES_BASE_URL}/responses`;
function resolveXaiResponsesEndpoint(baseUrl) {
	return `${(normalizeOptionalString(baseUrl) ?? XAI_RESPONSES_BASE_URL).replace(/\/+$/, "")}/responses`;
}
function resolveXaiToolDefaultReasoningEffort(model, preferred) {
	return model === "grok-4.3" || model === "grok-4.6" || model === "grok-4.7" ? preferred : void 0;
}
function buildXaiResponsesToolBody(params) {
	const requested = params.reasoningEffort;
	let reasoningEffort = requested;
	const model = requested ? resolveXaiCatalogEntry(params.model) : void 0;
	if (requested && model) {
		const levels = applyXaiRuntimeModelCompat(model).thinkingLevelMap;
		const level = requested === "none" ? "off" : requested;
		reasoningEffort = levels[level] ?? (level === "off" ? levels.minimal : void 0) ?? void 0;
	}
	return {
		model: params.model,
		input: [{
			role: "user",
			content: params.inputText
		}],
		tools: params.tools,
		store: false,
		...reasoningEffort ? { reasoning: { effort: reasoningEffort } } : {},
		...params.maxTurns ? { max_turns: params.maxTurns } : {}
	};
}
async function requestXaiResponsesTool(params, parseResponse) {
	return await postTrustedWebToolsJson({
		url: params.endpoint,
		timeoutSeconds: params.timeoutSeconds,
		apiKey: params.apiKey,
		...params.signal ? { signal: params.signal } : {},
		body: buildXaiResponsesToolBody(params),
		errorLabel: "xAI"
	}, async (response) => parseResponse(await readProviderJsonObjectResponse(response, params.errorLabel)));
}
function requireXaiResponseTextAndCitations(data, label, maxContentChars) {
	const textParts = [];
	const pendingAnnotations = [];
	let remainingRawChars = maxContentChars;
	let completeRawPrefix = true;
	let truncated = false;
	let rawOffset = 0;
	for (const output of data.output ?? []) {
		if (!isRecord(output)) continue;
		const blocks = output.type === "message" && Array.isArray(output.content) ? output.content : output.type === "output_text" ? [output] : [];
		for (const block of blocks) {
			if (!isRecord(block) || block.type !== "output_text" || typeof block.text !== "string") continue;
			if (block.text) {
				const blockRawOffset = rawOffset;
				rawOffset += block.text.length;
				const text = remainingRawChars === void 0 ? block.text : completeRawPrefix ? truncateUtf16Safe(block.text, remainingRawChars) : "";
				if (text.length < block.text.length) {
					truncated = true;
					completeRawPrefix = false;
				}
				if (text) {
					textParts.push(text);
					if (remainingRawChars !== void 0) remainingRawChars -= text.length;
					if (Array.isArray(block.annotations)) pendingAnnotations.push({
						rawOffset: blockRawOffset,
						annotations: block.annotations
					});
				}
			}
		}
	}
	const rawText = textParts.join("") || (typeof data.output_text === "string" ? data.output_text : "");
	let text = rawText;
	let retainedRawChars = rawText.length;
	if (maxContentChars !== void 0) {
		const bounded = truncateSanitizedExternalContent(rawText, maxContentChars);
		text = bounded.text;
		truncated ||= bounded.truncated;
		retainedRawChars = bounded.retainedRawChars;
	}
	if (!text) throw new Error(`${label}: no answer text returned; try a simpler request`);
	const citations = /* @__PURE__ */ new Set();
	if (Array.isArray(data.citations)) {
		let scanned = 0;
		for (const citation of data.citations) {
			if (++scanned > XAI_CITATION_MAX_SCAN || citations.size >= XAI_CITATION_MAX_COUNT) break;
			const url = normalizeXaiCitationUrl(citation);
			if (url) citations.add(url);
		}
	}
	if (citations.size === 0) {
		for (const annotation of pendingAnnotations) if (annotation.rawOffset < retainedRawChars) collectUrlCitations(annotation.annotations, citations);
	}
	const inlineCitationOffsetsSafe = text === rawText.slice(0, retainedRawChars);
	return {
		content: text,
		citations: [...citations],
		...truncated ? { truncated: true } : {},
		...maxContentChars === void 0 ? {} : { retainedRawChars },
		...inlineCitationOffsetsSafe ? {} : { inlineCitationOffsetsSafe: false }
	};
}
function requireXaiResponseTextCitationsAndInline(data, label, inlineCitationsEnabled, maxContentChars) {
	const { content, citations, truncated, retainedRawChars, inlineCitationOffsetsSafe } = requireXaiResponseTextAndCitations(data, label, maxContentChars);
	return {
		content,
		citations,
		inlineCitations: inlineCitationsEnabled && Array.isArray(data.inline_citations) ? data.inline_citations.slice(0, XAI_CITATION_MAX_COUNT).flatMap((citation) => {
			if (!isRecord(citation)) return [];
			const url = normalizeXaiCitationUrl(citation.url);
			return inlineCitationOffsetsSafe !== false && url && Number.isSafeInteger(citation.start_index) && Number.isSafeInteger(citation.end_index) && citation.start_index >= 0 && citation.end_index >= citation.start_index && citation.end_index <= (retainedRawChars ?? content.length) ? [{
				start_index: citation.start_index,
				end_index: citation.end_index,
				url
			}] : [];
		}) : void 0,
		...truncated ? { truncated: true } : {}
	};
}
//#endregion
//#region extensions/xai/src/tool-config-shared.ts
function coerceXaiToolConfig(config) {
	return isRecord(config) ? config : {};
}
function resolveNormalizedXaiToolModel(params) {
	const value = coerceXaiToolConfig(params.config).model;
	return typeof value === "string" && value.trim() ? normalizeXaiModelId(value.trim()) : params.defaultModel;
}
function resolvePositiveIntegerToolConfig(config, key) {
	const raw = coerceXaiToolConfig(config)[key];
	if (typeof raw !== "number" || !Number.isFinite(raw)) return;
	const normalized = Math.trunc(raw);
	return normalized > 0 ? normalized : void 0;
}
//#endregion
export { requestXaiResponsesTool as a, resolveXaiResponsesEndpoint as c, XAI_RESPONSES_ENDPOINT as i, resolveXaiToolDefaultReasoningEffort as l, resolveNormalizedXaiToolModel as n, requireXaiResponseTextAndCitations as o, resolvePositiveIntegerToolConfig as r, requireXaiResponseTextCitationsAndInline as s, coerceXaiToolConfig as t };
