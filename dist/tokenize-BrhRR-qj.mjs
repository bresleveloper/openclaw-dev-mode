import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
//#region extensions/memory-core/src/memory/tokenize.ts
const CJK_RUN_RE = new RegExp(`${/[\u3040-\u309f\u30a0-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af\u1100-\u11ff]/.source}+`, "g");
function tokenize(text) {
	const lower = normalizeLowercaseStringOrEmpty(text).normalize("NFC");
	const words = lower.replace(CJK_RUN_RE, " ").match(/[\p{L}\p{N}_][\p{L}\p{M}\p{N}_]*/gu) ?? [];
	const tokens = new Set(words);
	const cjkRuns = lower.match(CJK_RUN_RE) ?? [];
	for (const run of cjkRuns) for (let index = 1; index < run.length; index += 1) tokens.add(run.slice(index - 1, index + 1));
	for (const run of cjkRuns) for (const char of run) tokens.add(char);
	return tokens;
}
function jaccardSimilarity(setA, setB) {
	if (setA.size === 0 && setB.size === 0) return 1;
	let intersectionSize = 0;
	const smaller = setA.size <= setB.size ? setA : setB;
	const larger = setA.size <= setB.size ? setB : setA;
	for (const token of smaller) if (larger.has(token)) intersectionSize++;
	const unionSize = setA.size + setB.size - intersectionSize;
	return intersectionSize / unionSize;
}
function textSimilarity(contentA, contentB) {
	const tokensA = tokenize(contentA);
	const tokensB = tokenize(contentB);
	if (tokensA.size === 0 && tokensB.size === 0) return normalizeLowercaseStringOrEmpty(contentA) === normalizeLowercaseStringOrEmpty(contentB) ? 1 : 0;
	return jaccardSimilarity(tokensA, tokensB);
}
//#endregion
export { textSimilarity as n, tokenize as r, jaccardSimilarity as t };
