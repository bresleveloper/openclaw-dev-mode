import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as replaceOutsideCodeRegionParts } from "./directive-tags-D9uZSb5h.mjs";
//#region src/tts/directive-facts.ts
/** Extract final-text TTS syntax into persisted facts, leaving markdown code spans unchanged. */
function extractTtsDirectiveFacts(text) {
	return expectDefined(extractTtsDirectiveParts([text])[0], "single TTS directive part");
}
function extractTtsDirectiveParts(texts) {
	const parts = texts.map((cleanedText) => ({ cleanedText }));
	if (!/\[\[\s*\/?\s*tts(?:\s*:|\s*\]\])/iu.test(texts.join("\n"))) return parts;
	const replaceStage = (regex, replacement) => {
		replaceOutsideCodeRegionParts(parts.map((part) => part.cleanedText), regex, (_match, captures, _offset, _source, partIndex) => {
			const part = expectDefined(parts[partIndex], "TTS directive start part");
			return replacement(captures, part.facts ??= { tagged: true });
		}).forEach((cleanedText, index) => {
			expectDefined(parts[index], "TTS directive result part").cleanedText = cleanedText;
		});
	};
	replaceStage(/\[\[\s*tts\s*:\s*text\s*\]\]([\s\S]*?)\[\[\s*\/\s*tts\s*:\s*text\s*\]\]/gi, ([inner], next) => {
		if (next.text == null) next.text = String(inner).trim();
		return "";
	});
	replaceStage(/\[\[\s*tts\s*\]\]([\s\S]*?)\[\[\s*\/\s*tts\s*\]\]/gi, ([inner], next) => {
		const visible = String(inner).trim();
		if (next.text == null) next.text = visible;
		return visible;
	});
	replaceStage(/\[\[\s*tts\s*:\s*([^\]]+)\]\]/gi, ([body], next) => {
		const tokens = String(body).split(/\s+/).filter(Boolean);
		let provider;
		const values = {};
		for (const token of tokens) {
			const eqIndex = token.indexOf("=");
			if (eqIndex === -1) continue;
			const rawKey = token.slice(0, eqIndex).trim();
			const rawValue = token.slice(eqIndex + 1).trim();
			if (!rawKey || !rawValue) continue;
			const key = normalizeLowercaseStringOrEmpty(rawKey);
			if (key === "provider") {
				provider = normalizeLowercaseStringOrEmpty(rawValue) || void 0;
				continue;
			}
			values[key] = rawValue;
		}
		if (provider || Object.keys(values).length > 0) {
			next.directives ??= [];
			next.directives.push({
				...provider ? { provider } : {},
				values
			});
		}
		return "";
	});
	replaceStage(/\[\[\s*tts\s*\]\]/gi, () => "");
	replaceStage(/\[\[\s*\/\s*tts(?:\s*:\s*[^\]]*)?\]\]/gi, () => "");
	return parts;
}
//#endregion
export { extractTtsDirectiveParts as n, extractTtsDirectiveFacts as t };
