//#region src/utils/chunk-items.ts
/** Splits items into fixed-size chunks, preserving order and returning one row for non-positive sizes. */
function chunkItems(items, size) {
	if (size <= 0) return [Array.from(items)];
	const rows = [];
	for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
	return rows;
}
//#endregion
export { chunkItems as t };
