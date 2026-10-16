//#region src/shared/synchronous-work.ts
/** Consume the same incremental operation when the caller cannot yield. */
function runSynchronousWork(work) {
	let step = work.next();
	while (!step.done) step = work.next();
	return step.value;
}
//#endregion
//#region src/shared/sort-and-limit.ts
const TOP_N_LIMIT = 200;
const SORT_RUN_SIZE = 1024;
function* sortEntriesWork(entries, compare, shouldYield, limit = entries.length) {
	if (!shouldYield || entries.length <= SORT_RUN_SIZE) return entries.toSorted(compare);
	let sorted = entries.slice();
	for (let start = 0; start < sorted.length; start += SORT_RUN_SIZE) {
		const run = sorted.slice(start, start + SORT_RUN_SIZE);
		run.sort(compare);
		for (let index = 0; index < run.length; index++) sorted[start + index] = run[index];
		yield;
	}
	let merged = sorted.slice();
	for (let width = SORT_RUN_SIZE; width < sorted.length; width *= 2) {
		for (let start = 0; start < sorted.length; start += width * 2) {
			const middle = Math.min(start + width, sorted.length);
			const end = Math.min(start + width * 2, sorted.length);
			const leftEnd = Math.min(middle, start + limit);
			const rightEnd = Math.min(end, middle + limit);
			const mergedEnd = start + Math.min(limit, leftEnd - start + rightEnd - middle);
			let left = start;
			let right = middle;
			for (let index = start; index < mergedEnd; index++) {
				if (shouldYield()) yield;
				const takeRight = left >= leftEnd || right < rightEnd && compare(sorted[left], sorted[right]) > 0;
				merged[index] = takeRight ? sorted[right++] : sorted[left++];
			}
		}
		[sorted, merged] = [merged, sorted];
	}
	return sorted;
}
/** Stable bounded ordering; each caller owns its comparator and validated limit. */
function sortAndLimitBy(entries, limit, compare) {
	return runSynchronousWork(sortAndLimitByWork(entries, limit, compare));
}
/** Checkpoints preserve stable ordering for cooperative callers. */
function* sortAndLimitByWork(entries, limit, compare, shouldYield) {
	if (limit !== void 0 && limit <= TOP_N_LIMIT) {
		const selected = [];
		let preferFirst = false;
		let index = 0;
		while (index < entries.length) {
			const entry = entries[index++];
			if (shouldYield?.()) yield;
			const first = selected[0];
			const beforeFirst = preferFirst && first ? compare(entry, first) < 0 : void 0;
			const worst = selected[limit - 1];
			if (!beforeFirst && worst && compare(entry, worst) >= 0) {
				preferFirst = false;
				continue;
			}
			preferFirst = beforeFirst ?? Boolean(first && compare(entry, first) < 0);
			let insertAt = 0;
			if (!preferFirst) {
				let low = 1;
				let high = selected.length;
				while (low < high) {
					const middle = low + high >>> 1;
					if (compare(entry, selected[middle]) < 0) high = middle;
					else low = middle + 1;
				}
				insertAt = low < selected.length ? low : -1;
			}
			if (insertAt >= 0) {
				selected.splice(insertAt, 0, entry);
				if (selected.length > limit) selected.pop();
			} else if (selected.length < limit) selected.push(entry);
		}
		return selected;
	}
	const sorted = yield* sortEntriesWork(entries, compare, shouldYield, limit);
	return limit === void 0 ? sorted : sorted.slice(0, limit);
}
//#endregion
export { sortAndLimitByWork as n, runSynchronousWork as r, sortAndLimitBy as t };
