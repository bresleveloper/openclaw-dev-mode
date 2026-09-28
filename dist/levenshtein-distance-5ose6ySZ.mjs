import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
//#region src/shared/levenshtein-distance.ts
function levenshteinDistance(left, right, maxDistance) {
	if (left === right) return 0;
	if (!left || !right) return maxDistance === void 0 ? left.length + right.length : null;
	if (maxDistance !== void 0 && Math.abs(left.length - right.length) > maxDistance) return null;
	const row = new Uint32Array(right.length + 1);
	for (let index = 0; index <= right.length; index += 1) row[index] = index;
	for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
		let diagonal = leftIndex;
		row[0] = leftIndex + 1;
		const leftCode = left.charCodeAt(leftIndex);
		for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
			const cost = leftCode === right.charCodeAt(rightIndex) ? 0 : 1;
			const above = expectDefined(row[rightIndex + 1], "previous entry at right index + 1");
			row[rightIndex + 1] = Math.min(expectDefined(row[rightIndex], "current entry at right index") + 1, above + 1, diagonal + cost);
			diagonal = above;
		}
		if (maxDistance !== void 0) {
			let rowMin = Number.POSITIVE_INFINITY;
			for (const distance of row) rowMin = Math.min(rowMin, distance);
			if (rowMin > maxDistance) return null;
		}
	}
	const distance = expectDefined(row[right.length], "previous entry at right.length");
	return maxDistance !== void 0 && distance > maxDistance ? null : distance;
}
//#endregion
export { levenshteinDistance as t };
