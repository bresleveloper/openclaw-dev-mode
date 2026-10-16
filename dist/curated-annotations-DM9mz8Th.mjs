//#region packages/memory-host-sdk/src/host/curated-annotations.ts
const INVALID_PROJECT_ANNOTATION_KEY = "!invalid-project-annotation";
function* scanMemoryAnnotations(text, marker, lineScoped = false) {
	let closing = -1;
	let newline = -1;
	const lineBreak = /[\r\n]/gu;
	for (let match = marker.exec(text); match; match = marker.exec(text)) {
		const valueStart = marker.lastIndex;
		if (closing < valueStart) {
			closing = text.indexOf("-->", valueStart);
			if (closing < 0) return;
		}
		if (lineScoped) {
			if (newline < valueStart) {
				lineBreak.lastIndex = valueStart;
				newline = lineBreak.exec(text)?.index ?? text.length;
			}
			if (newline < closing) continue;
		}
		yield {
			start: match.index,
			end: closing + 3,
			kind: match[1]?.toLowerCase(),
			value: text.slice(valueStart, closing).trim()
		};
		marker.lastIndex = closing + 3;
	}
}
function stripMemoryAnnotationCarriers(text) {
	const parts = [];
	let cursor = 0;
	for (const annotation of scanMemoryAnnotations(text, /<!--\s*(trigger|importance|project)\s*:/giu, true)) {
		parts.push(text.slice(cursor, annotation.start));
		cursor = annotation.end;
	}
	if (cursor === 0) return text;
	parts.push(text.slice(cursor));
	return parts.join("").replace(/[ \t]+/gu, (space, offset, source) => {
		const end = offset + space.length;
		return end === source.length || /[\r\n\u2028\u2029]/u.test(source.charAt(end)) ? "" : space;
	});
}
function normalizeProjectAnnotationKey(value) {
	const trimmed = value.trim();
	if (!trimmed || /[\r\n<>]/u.test(trimmed)) return null;
	if (trimmed.startsWith("path:")) return trimmed;
	const separator = trimmed.indexOf("/");
	if (separator < 1) return trimmed;
	return `${trimmed.slice(0, separator).toLowerCase()}${trimmed.slice(separator)}`;
}
function extractProjectKeysFromCuratedEntry(text) {
	const keys = /* @__PURE__ */ new Set();
	const markerCount = [...text.matchAll(/<!--\s*project\s*:/giu)].length;
	let parsedCount = 0;
	let rawCount = 0;
	let validCount = 0;
	for (const annotation of scanMemoryAnnotations(text, /<!--\s*(project)\s*:/giu)) {
		parsedCount += 1;
		for (const rawKey of annotation.value.split(";")) {
			rawCount += 1;
			const key = normalizeProjectAnnotationKey(rawKey);
			if (key) {
				keys.add(key);
				validCount += 1;
			}
		}
	}
	const annotated = markerCount > 0;
	return {
		annotated,
		valid: !annotated || parsedCount === markerCount && rawCount > 0 && rawCount === validCount,
		keys: [...keys],
		rawCount,
		validCount
	};
}
function extractCuratedEntryRecallMetadata(params) {
	const phrases = /* @__PURE__ */ new Set();
	let importance = null;
	const projectAnnotations = params.projectScopeEligible ? extractProjectKeysFromCuratedEntry(params.sourceLines.join("\n")) : {
		annotated: false,
		valid: true,
		keys: []
	};
	for (const line of params.curatedRoot ? params.sourceLines : []) {
		if (!line.trimEnd().endsWith("-->")) continue;
		for (const { kind, value } of scanMemoryAnnotations(line, /<!--\s*(trigger|importance|project)\s*:/giu)) if (kind === "trigger") {
			for (const phrase of value.split(/[,;]/u).map((entry) => entry.trim())) if (phrase) phrases.add(phrase);
		} else if (kind === "importance" && /^\d+$/u.test(value)) {
			const parsed = Number.parseInt(value, 10);
			if (parsed >= 1 && parsed <= 10) importance = Math.max(importance ?? parsed, parsed);
		}
	}
	return {
		importance,
		triggers: phrases.size > 0 ? [...phrases].join("; ") : null,
		projectKey: projectAnnotations.annotated && !projectAnnotations.valid ? INVALID_PROJECT_ANNOTATION_KEY : projectAnnotations.keys.length > 0 ? projectAnnotations.keys.join("; ") : null
	};
}
//#endregion
export { stripMemoryAnnotationCarriers as a, normalizeProjectAnnotationKey as i, extractCuratedEntryRecallMetadata as n, extractProjectKeysFromCuratedEntry as r, INVALID_PROJECT_ANNOTATION_KEY as t };
