import { t as CODEX_CATALOG_MAX_ROWS } from "./session-catalog-limits-B80bYk1h.mjs";
//#region extensions/codex/src/session-catalog-index-order.ts
function codexCatalogRowRecency(row) {
	return row.recencyAt ?? row.updatedAt ?? 0;
}
function compareCodexCatalogRows(a, b) {
	return codexCatalogRowRecency(b) - codexCatalogRowRecency(a) || (a.sourceOrder ?? 0) - (b.sourceOrder ?? 0) || (a.threadId < b.threadId ? 1 : a.threadId > b.threadId ? -1 : 0);
}
/** Admission and restoration share the archived-oldest eviction policy. */
function retainCodexCatalogRow(rows, candidate) {
	rows.set(candidate.threadId, candidate);
	if (rows.size <= 2e4) return;
	let oldest;
	for (const row of rows.values()) if (!oldest || (row.archived !== oldest.archived ? row.archived : compareCodexCatalogRows(row, oldest) > 0)) oldest = row;
	if (oldest) rows.delete(oldest.threadId);
	return oldest;
}
/** Stable positions keep issued cursors independent of later native page offsets. */
var CodexCatalogOrdering = class {
	constructor() {
		this.nextEventOrder = -1;
		this.ordered = [];
	}
	read() {
		return this.ordered;
	}
	positionOf(row) {
		let low = 0;
		let high = this.ordered.length;
		while (low < high) {
			const middle = low + high >>> 1;
			if (compareCodexCatalogRows(this.ordered[middle].row, row) < 0) low = middle + 1;
			else high = middle;
		}
		return low;
	}
	put(row, previous) {
		if (previous) this.remove(previous);
		const session = row.page.sessions[0];
		if (!row.archived && session) this.ordered.splice(this.positionOf(row), 0, {
			row,
			searchText: (session.name ?? session.fallbackName ?? "").toLocaleLowerCase()
		});
	}
	remove(row) {
		const position = this.positionOf(row);
		if (this.ordered[position]?.row.threadId === row.threadId) this.ordered.splice(position, 1);
	}
	clear() {
		this.ordered.length = 0;
	}
	restore(row) {
		this.nextEventOrder = Math.min(this.nextEventOrder, (row.sourceOrder ?? 0) - 1);
	}
	reserveEvent() {
		return this.nextEventOrder--;
	}
	unchangedPosition(row, previous) {
		return previous && codexCatalogRowRecency(row) <= codexCatalogRowRecency(previous) ? previous.sourceOrder : void 0;
	}
	position(row, previous) {
		return row.sourceOrder ?? this.unchangedPosition(row, previous) ?? this.reserveEvent();
	}
	captureBatch(hasCompleteSnapshot) {
		const base = hasCompleteSnapshot ? this.nextEventOrder - CODEX_CATALOG_MAX_ROWS : 0;
		if (hasCompleteSnapshot) this.nextEventOrder = base - 1;
		return (row, previous, position) => this.unchangedPosition(row, previous) ?? base + position;
	}
};
//#endregion
export { retainCodexCatalogRow as i, codexCatalogRowRecency as n, compareCodexCatalogRows as r, CodexCatalogOrdering as t };
