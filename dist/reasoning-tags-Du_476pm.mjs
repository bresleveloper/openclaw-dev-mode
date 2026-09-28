import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as markdownSpace, i as markdownLineEndingOrSpace, n as factorySpace, r as markdownLineEnding, t as fromMarkdown } from "./lib-WLZTziNZ.mjs";
//#endregion
//#region node_modules/.pnpm/mdast-util-gfm-table@2.0.0_supports-color@10.2.2/node_modules/mdast-util-gfm-table/lib/index.js
/**
* @typedef {import('mdast').InlineCode} InlineCode
* @typedef {import('mdast').Table} Table
* @typedef {import('mdast').TableCell} TableCell
* @typedef {import('mdast').TableRow} TableRow
*
* @typedef {import('markdown-table').Options} MarkdownTableOptions
*
* @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
* @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
* @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
*
* @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
* @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
* @typedef {import('mdast-util-to-markdown').State} State
* @typedef {import('mdast-util-to-markdown').Info} Info
*/
/**
* @typedef Options
*   Configuration.
* @property {boolean | null | undefined} [tableCellPadding=true]
*   Whether to add a space of padding between delimiters and cells (default:
*   `true`).
* @property {boolean | null | undefined} [tablePipeAlign=true]
*   Whether to align the delimiters (default: `true`).
* @property {MarkdownTableOptions['stringLength'] | null | undefined} [stringLength]
*   Function to detect the length of table cell content, used when aligning
*   the delimiters between cells (optional).
*/
/**
* Create an extension for `mdast-util-from-markdown` to enable GFM tables in
* markdown.
*
* @returns {FromMarkdownExtension}
*   Extension for `mdast-util-from-markdown` to enable GFM tables.
*/
function gfmTableFromMarkdown() {
	return {
		enter: {
			table: enterTable,
			tableData: enterCell,
			tableHeader: enterCell,
			tableRow: enterRow
		},
		exit: {
			codeText: exitCodeText,
			table: exitTable,
			tableData: exit,
			tableHeader: exit,
			tableRow: exit
		}
	};
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterTable(token) {
	const align = token._align;
	this.enter({
		type: "table",
		align: align.map(function(d) {
			return d === "none" ? null : d;
		}),
		children: []
	}, token);
	this.data.inTable = true;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitTable(token) {
	this.exit(token);
	this.data.inTable = void 0;
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterRow(token) {
	this.enter({
		type: "tableRow",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exit(token) {
	this.exit(token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function enterCell(token) {
	this.enter({
		type: "tableCell",
		children: []
	}, token);
}
/**
* @this {CompileContext}
* @type {FromMarkdownHandle}
*/
function exitCodeText(token) {
	let value = this.resume();
	if (this.data.inTable) value = value.replace(/\\([\\|])/g, replace);
	const node = this.stack[this.stack.length - 1];
	node.type;
	node.value = value;
	this.exit(token);
}
/**
* @param {string} $0
* @param {string} $1
* @returns {string}
*/
function replace($0, $1) {
	return $1 === "|" ? $1 : $0;
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-gfm-table@2.1.2/node_modules/micromark-extension-gfm-table/lib/edit-map.js
/**
* @import {Event} from 'micromark-util-types'
*/
/**
* @typedef {[number, number, Array<Event>]} Change
* @typedef {[number, number, number]} Jump
*/
/**
* Tracks a bunch of edits.
*/
var EditMap = class {
	/**
	* Create a new edit map.
	*/
	constructor() {
		/**
		* Record of changes.
		*
		* @type {Array<Change>}
		*/
		this.map = [];
		/**
		* Changes by index, so `add` does not scan `map` (quadratic on
		* table-heavy documents).
		*
		* @type {Map<number, Change>}
		*/
		this.index = /* @__PURE__ */ new Map();
	}
	/**
	* Create an edit: a remove and/or add at a certain place.
	*
	* @param {number} index
	*   Index at which to apply the edit.
	* @param {number} remove
	*   Count of items to remove at the index.
	* @param {Array<Event>} add
	*   Items to add at the index.
	* @returns {undefined}
	*   Nothing.
	*/
	add(index, remove, add) {
		addImplementation(this, index, remove, add);
	}
	/**
	* Done, change the events.
	*
	* @param {Array<Event>} events
	*   List of events to apply the edits to.
	* @returns {undefined}
	*   Nothing.
	*/
	consume(events) {
		this.map.sort(function(a, b) {
			return a[0] - b[0];
		});
		/* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
		if (this.map.length === 0) return;
		let index = this.map.length;
		/** @type {Array<Array<Event>>} */
		const vecs = [];
		while (index > 0) {
			index -= 1;
			vecs.push(events.slice(this.map[index][0] + this.map[index][1]), this.map[index][2]);
			events.length = this.map[index][0];
		}
		vecs.push(events.slice());
		events.length = 0;
		let slice = vecs.pop();
		while (slice) {
			for (const element of slice) events.push(element);
			slice = vecs.pop();
		}
		this.map.length = 0;
		this.index.clear();
	}
};
/**
* Create an edit.
*
* @param {EditMap} editMap
*   Edit map to apply to.
* @param {number} at
*   Index at which to apply the edit.
* @param {number} remove
*   Count of items to remove at the index.
* @param {Array<Event>} add
*   Items to add at the index.
* @returns {undefined}
*   Nothing.
*/
function addImplementation(editMap, at, remove, add) {
	/* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
	if (remove === 0 && add.length === 0) return;
	const existing = editMap.index.get(at);
	if (existing) {
		existing[1] += remove;
		existing[2].push(...add);
		return;
	}
	/** @type {Change} */
	const change = [
		at,
		remove,
		add
	];
	editMap.map.push(change);
	editMap.index.set(at, change);
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-gfm-table@2.1.2/node_modules/micromark-extension-gfm-table/lib/infer.js
/**
* @import {Event} from 'micromark-util-types'
*/
/**
* @typedef {'center' | 'left' | 'none' | 'right'} Align
*/
/**
* Figure out the alignment of a GFM table.
*
* @param {Readonly<Array<Event>>} events
*   List of events.
* @param {number} index
*   Table enter event.
* @returns {Array<Align>}
*   List of aligns.
*/
function gfmTableAlign(events, index) {
	let inDelimiterRow = false;
	/** @type {Array<Align>} */
	const align = [];
	while (index < events.length) {
		const event = events[index];
		if (inDelimiterRow) {
			if (event[0] === "enter") {
				if (event[1].type === "tableContent") align.push(events[index + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
			} else if (event[1].type === "tableContent") {
				if (events[index - 1][1].type === "tableDelimiterMarker") {
					const alignIndex = align.length - 1;
					align[alignIndex] = align[alignIndex] === "left" ? "center" : "right";
				}
			} else if (event[1].type === "tableDelimiterRow") break;
		} else if (event[0] === "enter" && event[1].type === "tableDelimiterRow") inDelimiterRow = true;
		index += 1;
	}
	return align;
}
//#endregion
//#region node_modules/.pnpm/micromark-extension-gfm-table@2.1.2/node_modules/micromark-extension-gfm-table/lib/syntax.js
/**
* @import {Event, Extension, Point, Resolver, State, Token, TokenizeContext, Tokenizer} from 'micromark-util-types'
*/
/**
* @typedef {[number, number, number, number]} Range
*   Cell info.
*
* @typedef {0 | 1 | 2 | 3} RowKind
*   Where we are: `1` for head row, `2` for delimiter row, `3` for body row.
*/
/**
* Create an HTML extension for `micromark` to support GitHub tables syntax.
*
* @returns {Extension}
*   Extension for `micromark` that can be passed in `extensions` to enable GFM
*   table syntax.
*/
function gfmTable() {
	return { flow: { null: {
		name: "table",
		tokenize: tokenizeTable,
		resolveAll: resolveTable
	} } };
}
/**
* Tokenizer for GFM tables.
*
* @this {TokenizeContext}
* @type {Tokenizer}
*/
function tokenizeTable(effects, ok, nok) {
	const self = this;
	let size = 0;
	let sizeB = 0;
	/** @type {boolean | undefined} */
	let seen;
	return start;
	/**
	* Start of a GFM table.
	*
	* If there is a valid table row or table head before, then we try to parse
	* another row.
	* Otherwise, we try to parse a head.
	*
	* ```markdown
	* > | | a |
	*     ^
	*   | | - |
	* > | | b |
	*     ^
	* ```
	* @type {State}
	*/
	function start(code) {
		let index = self.events.length - 1;
		while (index > -1) {
			const { type } = self.events[index][1];
			if (type === "lineEnding" || type === "linePrefix") index--;
			else break;
		}
		const tail = index > -1 ? self.events[index][1].type : null;
		const next = tail === "tableHead" || tail === "tableRow" ? bodyRowStart : headRowBefore;
		if (next === bodyRowStart && self.parser.lazy[self.now().line]) return nok(code);
		return next(code);
	}
	/**
	* Before table head row.
	*
	* ```markdown
	* > | | a |
	*     ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowBefore(code) {
		effects.enter("tableHead");
		effects.enter("tableRow");
		return headRowStart(code);
	}
	/**
	* Before table head row, after whitespace.
	*
	* ```markdown
	* > | | a |
	*     ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowStart(code) {
		if (code === 124) return headRowBreak(code);
		seen = true;
		sizeB += 1;
		return headRowBreak(code);
	}
	/**
	* At break in table head row.
	*
	* ```markdown
	* > | | a |
	*     ^
	*       ^
	*         ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowBreak(code) {
		if (code === null) return nok(code);
		if (markdownLineEnding(code)) {
			if (sizeB > 1) {
				sizeB = 0;
				self.interrupt = true;
				effects.exit("tableRow");
				effects.enter("lineEnding");
				effects.consume(code);
				effects.exit("lineEnding");
				return headDelimiterStart;
			}
			return nok(code);
		}
		if (markdownSpace(code)) return factorySpace(effects, headRowBreak, "whitespace")(code);
		sizeB += 1;
		if (seen) {
			seen = false;
			size += 1;
		}
		if (code === 124) {
			effects.enter("tableCellDivider");
			effects.consume(code);
			effects.exit("tableCellDivider");
			seen = true;
			return headRowBreak;
		}
		effects.enter("data");
		return headRowData(code);
	}
	/**
	* In table head row data.
	*
	* ```markdown
	* > | | a |
	*       ^
	*   | | - |
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headRowData(code) {
		if (code === null || code === 124 || markdownLineEndingOrSpace(code)) {
			effects.exit("data");
			return headRowBreak(code);
		}
		effects.consume(code);
		return code === 92 ? headRowEscape : headRowData;
	}
	/**
	* In table head row escape.
	*
	* ```markdown
	* > | | a\-b |
	*         ^
	*   | | ---- |
	*   | | c    |
	* ```
	*
	* @type {State}
	*/
	function headRowEscape(code) {
		if (code === 92 || code === 124) {
			effects.consume(code);
			return headRowData;
		}
		return headRowData(code);
	}
	/**
	* Before delimiter row.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*     ^
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headDelimiterStart(code) {
		self.interrupt = false;
		if (self.parser.lazy[self.now().line]) return nok(code);
		effects.enter("tableDelimiterRow");
		seen = false;
		if (markdownSpace(code)) return factorySpace(effects, headDelimiterBefore, "linePrefix", self.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(code);
		return headDelimiterBefore(code);
	}
	/**
	* Before delimiter row, after optional whitespace.
	*
	* Reused when a `|` is found later, to parse another cell.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*     ^
	*   | | b |
	* ```
	*
	* @type {State}
	*/
	function headDelimiterBefore(code) {
		if (code === 45 || code === 58) return headDelimiterValueBefore(code);
		if (code === 124) {
			seen = true;
			effects.enter("tableCellDivider");
			effects.consume(code);
			effects.exit("tableCellDivider");
			return headDelimiterCellBefore;
		}
		return headDelimiterNok(code);
	}
	/**
	* After `|`, before delimiter cell.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*      ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterCellBefore(code) {
		if (markdownSpace(code)) return factorySpace(effects, headDelimiterValueBefore, "whitespace")(code);
		return headDelimiterValueBefore(code);
	}
	/**
	* Before delimiter cell value.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterValueBefore(code) {
		if (code === 58) {
			sizeB += 1;
			seen = true;
			effects.enter("tableDelimiterMarker");
			effects.consume(code);
			effects.exit("tableDelimiterMarker");
			return headDelimiterLeftAlignmentAfter;
		}
		if (code === 45) {
			sizeB += 1;
			return headDelimiterLeftAlignmentAfter(code);
		}
		if (code === null || markdownLineEnding(code)) return headDelimiterCellAfter(code);
		return headDelimiterNok(code);
	}
	/**
	* After delimiter cell left alignment marker.
	*
	* ```markdown
	*   | | a  |
	* > | | :- |
	*        ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterLeftAlignmentAfter(code) {
		if (code === 45) {
			effects.enter("tableDelimiterFiller");
			return headDelimiterFiller(code);
		}
		return headDelimiterNok(code);
	}
	/**
	* In delimiter cell filler.
	*
	* ```markdown
	*   | | a |
	* > | | - |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterFiller(code) {
		if (code === 45) {
			effects.consume(code);
			return headDelimiterFiller;
		}
		if (code === 58) {
			seen = true;
			effects.exit("tableDelimiterFiller");
			effects.enter("tableDelimiterMarker");
			effects.consume(code);
			effects.exit("tableDelimiterMarker");
			return headDelimiterRightAlignmentAfter;
		}
		effects.exit("tableDelimiterFiller");
		return headDelimiterRightAlignmentAfter(code);
	}
	/**
	* After delimiter cell right alignment marker.
	*
	* ```markdown
	*   | |  a |
	* > | | -: |
	*         ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterRightAlignmentAfter(code) {
		if (markdownSpace(code)) return factorySpace(effects, headDelimiterCellAfter, "whitespace")(code);
		return headDelimiterCellAfter(code);
	}
	/**
	* After delimiter cell.
	*
	* ```markdown
	*   | |  a |
	* > | | -: |
	*          ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterCellAfter(code) {
		if (code === 124) return headDelimiterBefore(code);
		if (code === null || markdownLineEnding(code)) {
			if (!seen || size !== sizeB) return headDelimiterNok(code);
			effects.exit("tableDelimiterRow");
			effects.exit("tableHead");
			return ok(code);
		}
		return headDelimiterNok(code);
	}
	/**
	* In delimiter row, at a disallowed byte.
	*
	* ```markdown
	*   | | a |
	* > | | x |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function headDelimiterNok(code) {
		return nok(code);
	}
	/**
	* Before table body row.
	*
	* ```markdown
	*   | | a |
	*   | | - |
	* > | | b |
	*     ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowStart(code) {
		effects.enter("tableRow");
		return bodyRowBreak(code);
	}
	/**
	* At break in table body row.
	*
	* ```markdown
	*   | | a |
	*   | | - |
	* > | | b |
	*     ^
	*       ^
	*         ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowBreak(code) {
		if (code === 124) {
			effects.enter("tableCellDivider");
			effects.consume(code);
			effects.exit("tableCellDivider");
			return bodyRowBreak;
		}
		if (code === null || markdownLineEnding(code)) {
			effects.exit("tableRow");
			return ok(code);
		}
		if (markdownSpace(code)) return factorySpace(effects, bodyRowBreak, "whitespace")(code);
		effects.enter("data");
		return bodyRowData(code);
	}
	/**
	* In table body row data.
	*
	* ```markdown
	*   | | a |
	*   | | - |
	* > | | b |
	*       ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowData(code) {
		if (code === null || code === 124 || markdownLineEndingOrSpace(code)) {
			effects.exit("data");
			return bodyRowBreak(code);
		}
		effects.consume(code);
		return code === 92 ? bodyRowEscape : bodyRowData;
	}
	/**
	* In table body row escape.
	*
	* ```markdown
	*   | | a    |
	*   | | ---- |
	* > | | b\-c |
	*         ^
	* ```
	*
	* @type {State}
	*/
	function bodyRowEscape(code) {
		if (code === 92 || code === 124) {
			effects.consume(code);
			return bodyRowData;
		}
		return bodyRowData(code);
	}
}
/** @type {Resolver} */
function resolveTable(events, context) {
	let index = -1;
	let inFirstCellAwaitingPipe = true;
	/** @type {RowKind} */
	let rowKind = 0;
	/** @type {Range} */
	let lastCell = [
		0,
		0,
		0,
		0
	];
	/** @type {Range} */
	let cell = [
		0,
		0,
		0,
		0
	];
	let afterHeadAwaitingFirstBodyRow = false;
	let lastTableEnd = 0;
	/** @type {Token | undefined} */
	let currentTable;
	/** @type {Token | undefined} */
	let currentBody;
	/** @type {Token | undefined} */
	let currentCell;
	const map = new EditMap();
	while (++index < events.length) {
		const event = events[index];
		const token = event[1];
		if (event[0] === "enter") {
			if (token.type === "tableHead") {
				afterHeadAwaitingFirstBodyRow = false;
				if (lastTableEnd !== 0) {
					flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
					currentBody = void 0;
					lastTableEnd = 0;
				}
				currentTable = {
					type: "table",
					start: Object.assign({}, token.start),
					end: Object.assign({}, token.end)
				};
				map.add(index, 0, [[
					"enter",
					currentTable,
					context
				]]);
			} else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
				inFirstCellAwaitingPipe = true;
				currentCell = void 0;
				lastCell = [
					0,
					0,
					0,
					0
				];
				cell = [
					0,
					index + 1,
					0,
					0
				];
				if (afterHeadAwaitingFirstBodyRow) {
					afterHeadAwaitingFirstBodyRow = false;
					currentBody = {
						type: "tableBody",
						start: Object.assign({}, token.start),
						end: Object.assign({}, token.end)
					};
					map.add(index, 0, [[
						"enter",
						currentBody,
						context
					]]);
				}
				rowKind = token.type === "tableDelimiterRow" ? 2 : currentBody ? 3 : 1;
			} else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) {
				inFirstCellAwaitingPipe = false;
				if (cell[2] === 0) {
					if (lastCell[1] !== 0) {
						cell[0] = cell[1];
						currentCell = flushCell(map, context, lastCell, rowKind, void 0, currentCell);
						lastCell = [
							0,
							0,
							0,
							0
						];
					}
					cell[2] = index;
				}
			} else if (token.type === "tableCellDivider") {
				if (inFirstCellAwaitingPipe) inFirstCellAwaitingPipe = false;
				else {
					if (lastCell[1] !== 0) {
						cell[0] = cell[1];
						currentCell = flushCell(map, context, lastCell, rowKind, void 0, currentCell);
					}
					lastCell = cell;
					cell = [
						lastCell[1],
						index,
						0,
						0
					];
				}
			}
		} else if (token.type === "tableHead") {
			afterHeadAwaitingFirstBodyRow = true;
			lastTableEnd = index;
		} else if (token.type === "tableRow" || token.type === "tableDelimiterRow") {
			lastTableEnd = index;
			if (lastCell[1] !== 0) {
				cell[0] = cell[1];
				currentCell = flushCell(map, context, lastCell, rowKind, index, currentCell);
			} else if (cell[1] !== 0) currentCell = flushCell(map, context, cell, rowKind, index, currentCell);
			rowKind = 0;
		} else if (rowKind && (token.type === "data" || token.type === "tableDelimiterMarker" || token.type === "tableDelimiterFiller")) cell[3] = index;
	}
	if (lastTableEnd !== 0) flushTableEnd(map, context, lastTableEnd, currentTable, currentBody);
	map.consume(context.events);
	index = -1;
	while (++index < context.events.length) {
		const event = context.events[index];
		if (event[0] === "enter" && event[1].type === "table") event[1]._align = gfmTableAlign(context.events, index);
	}
	return events;
}
/**
* Generate a cell.
*
* @param {EditMap} map
*   Edit map to apply to.
* @param {Readonly<TokenizeContext>} context
*   Tokenize context.
* @param {Readonly<Range>} range
*   Range of the cell within events.
* @param {RowKind} rowKind
*   Type of row.
* @param {number | undefined} rowEnd
*   Index of the end of the row, if known.
* @param {Token | undefined} previousCell
*   Previous cell token, if any.
* @returns {Token | undefined}
*   Current cell token after flushing, if any.
*/
function flushCell(map, context, range, rowKind, rowEnd, previousCell) {
	const groupName = rowKind === 1 ? "tableHeader" : rowKind === 2 ? "tableDelimiter" : "tableData";
	const valueName = "tableContent";
	if (range[0] !== 0) {
		previousCell.end = Object.assign({}, getPoint(context.events, range[0]));
		map.add(range[0], 0, [[
			"exit",
			previousCell,
			context
		]]);
	}
	const now = getPoint(context.events, range[1]);
	previousCell = {
		type: groupName,
		start: Object.assign({}, now),
		end: Object.assign({}, now)
	};
	map.add(range[1], 0, [[
		"enter",
		previousCell,
		context
	]]);
	if (range[2] !== 0) {
		const relatedStart = getPoint(context.events, range[2]);
		const relatedEnd = getPoint(context.events, range[3]);
		/** @type {Token} */
		const valueToken = {
			type: valueName,
			start: Object.assign({}, relatedStart),
			end: Object.assign({}, relatedEnd)
		};
		map.add(range[2], 0, [[
			"enter",
			valueToken,
			context
		]]);
		if (rowKind !== 2) {
			const start = context.events[range[2]];
			const end = context.events[range[3]];
			start[1].end = Object.assign({}, end[1].end);
			start[1].type = "chunkText";
			start[1].contentType = "text";
			if (range[3] > range[2] + 1) {
				const a = range[2] + 1;
				const b = range[3] - range[2] - 1;
				map.add(a, b, []);
			}
		}
		map.add(range[3] + 1, 0, [[
			"exit",
			valueToken,
			context
		]]);
	}
	if (rowEnd !== void 0) {
		previousCell.end = Object.assign({}, getPoint(context.events, rowEnd));
		map.add(rowEnd, 0, [[
			"exit",
			previousCell,
			context
		]]);
		previousCell = void 0;
	}
	return previousCell;
}
/**
* Generate table end (and table body end).
*
* @param {Readonly<EditMap>} map
*   Edit map to apply to.
* @param {Readonly<TokenizeContext>} context
*   Tokenize context.
* @param {number} index
*   Index within the events where the table end should be inserted.
* @param {Token} table
*   Table token.
* @param {Token | undefined} tableBody
*   Table body token, if any.
* @returns {undefined}
*   Nothing.
*/
function flushTableEnd(map, context, index, table, tableBody) {
	/** @type {Array<Event>} */
	const exits = [];
	const related = getPoint(context.events, index);
	if (tableBody) {
		tableBody.end = Object.assign({}, related);
		exits.push([
			"exit",
			tableBody,
			context
		]);
	}
	table.end = Object.assign({}, related);
	exits.push([
		"exit",
		table,
		context
	]);
	map.add(index + 1, 0, exits);
}
/**
* Get the point (start or end) for a given event in the list of events.
*
* @param {Readonly<Array<Event>>} events
*   List of events.
* @param {number} index
*   Index of the event to get the point for.
* @returns {Readonly<Point>}
*   Start point for enter and end point for exit.
*/
function getPoint(events, index) {
	const event = events[index];
	const side = event[0] === "enter" ? "start" : "end";
	return event[1][side];
}
//#endregion
//#region packages/markdown-core/src/reasoning-tag-parser.ts
const REASONING_TAG_NAMES = [
	"think",
	"thinking",
	"thought",
	"reasoning",
	"internal",
	"antthinking",
	"antml:think",
	"antml:thinking",
	"antml:thought",
	"antml:reasoning",
	"mm:think",
	"mm:thinking",
	"mm:thought",
	"mm:reasoning"
];
const REASONING_TAG_NAME_SET = new Set(REASONING_TAG_NAMES);
const DISABLE_HTML_MARKDOWN = { disable: { null: ["htmlFlow", "htmlText"] } };
/** Scans quote-aware provider reasoning tags with iterative malformed recovery. */
function scanReasoningTags(text, final = true) {
	const tags = [];
	let cursor = 0;
	while (cursor < text.length) {
		const start = text.indexOf("<", cursor);
		if (start === -1) break;
		const parsed = parseReasoningTagAt(text, start, final);
		if (parsed.kind === "tag") {
			tags.push(parsed.tag);
			cursor = parsed.tag.index + parsed.tag.text.length;
			continue;
		}
		if (parsed.kind === "pending") return {
			tags,
			pendingStart: start
		};
		cursor = parsed.next;
	}
	return { tags };
}
function parseReasoningTagAt(text, start, final) {
	let cursor = skipTagWhitespace(text, start + 1);
	let isClose = false;
	if (text.charAt(cursor) === "/") {
		isClose = true;
		cursor = skipTagWhitespace(text, cursor + 1);
	}
	const nameStart = cursor;
	while (cursor < text.length && isTagNameCharacter(text.charCodeAt(cursor))) cursor += 1;
	const partialName = text.slice(nameStart, cursor).toLowerCase();
	if (!partialName) return cursor === text.length && !final ? { kind: "pending" } : invalidTag(text, start);
	if (!REASONING_TAG_NAME_SET.has(partialName)) {
		const canBecomeKnown = REASONING_TAG_NAMES.some((name) => name.startsWith(partialName));
		return cursor === text.length && !final && canBecomeKnown ? { kind: "pending" } : invalidTag(text, start);
	}
	if (cursor === text.length) return final ? invalidTag(text, start) : { kind: "pending" };
	const boundary = text.charAt(cursor);
	if (!isTagWhitespace(boundary) && boundary !== "/" && boundary !== ">") return invalidTag(text, start);
	let quote;
	let lastSignificant = "";
	for (; cursor < text.length; cursor += 1) {
		const char = text.charAt(cursor);
		if (quote) {
			if (char === quote) quote = void 0;
			continue;
		}
		if (char === "\"" || char === "'") {
			quote = char;
			continue;
		}
		if (char === "<") return invalidTag(text, start);
		if (char === ">") {
			const end = cursor + 1;
			return {
				kind: "tag",
				tag: {
					index: start,
					text: text.slice(start, end),
					isClose,
					isSelfClosing: !isClose && lastSignificant === "/",
					isPrivate: partialName === "internal"
				}
			};
		}
		if (!isTagWhitespace(char)) lastSignificant = char;
	}
	return final ? invalidTag(text, start) : { kind: "pending" };
}
function invalidTag(text, start) {
	const nested = text.indexOf("<", start + 1);
	return {
		kind: "invalid",
		next: nested === -1 ? text.length : nested
	};
}
function skipTagWhitespace(text, start) {
	let cursor = start;
	while (cursor < text.length && isTagWhitespace(text.charAt(cursor))) cursor += 1;
	return cursor;
}
function isTagWhitespace(char) {
	return /\s/u.test(char);
}
function isTagNameCharacter(code) {
	return code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122 || code === 58;
}
function findNextLineEnding(text, start) {
	const carriageReturn = text.indexOf("\r", start);
	const lineFeed = text.indexOf("\n", start);
	if (carriageReturn === -1) return lineFeed;
	return lineFeed === -1 ? carriageReturn : Math.min(carriageReturn, lineFeed);
}
function captureInlineSources(text, sources) {
	const observe = function(token) {
		const start = this.stack.findLast((entry) => entry.type === "inlineCode")?.position?.start.offset;
		if (start === void 0) return;
		let source = sources.get(start);
		if (!source) {
			const inlineBlock = this.stack.findLast((entry) => entry.type === "paragraph" || entry.type === "heading");
			const begin = inlineBlock?.children[0]?.position?.start.offset;
			const containers = this.stack.filter((entry) => entry.type === "listItem" || entry.type === "blockquote");
			const prefixEnd = begin !== void 0 && containers.length ? begin : start;
			const prefixStart = containers.length ? Math.max(text.lastIndexOf("\n", prefixEnd - 1), text.lastIndexOf("\r", prefixEnd - 1)) + 1 : start;
			const prefix = containers.map((entry) => text.slice(entry.position?.start.offset, entry.children[0]?.position?.start.offset)).join("");
			source = {
				prefix: {
					start: prefixStart,
					end: prefixEnd,
					ownerStart: containers[0]?.position?.start.offset ?? start,
					text: prefix + (containers.length && inlineBlock?.type === "heading" ? text.slice(inlineBlock.position?.start.offset, begin) : "")
				},
				value: "",
				offsets: []
			};
			sources.set(start, source);
		}
		const value = this.sliceSerialize(token);
		const extra = value.length - (token.end.offset - token.start.offset);
		for (let cursor = start + source.offsets.length; cursor < token.end.offset; cursor += 1) {
			const consumed = cursor - token.start.offset;
			source.offsets.push(source.value.length + (consumed > 0 ? consumed + extra : 0));
		}
		source.value += value;
	};
	return { enter: {
		codeTextData(token) {
			observe.call(this, token);
			expectDefined(this.config.enter.data, "Markdown data handler").call(this, token);
		},
		lineEnding: observe
	} };
}
function captureIndentedSources(text, sources, observeInlineLineEnding) {
	const observe = function(token) {
		if (!this.tokenStack.some(([parent]) => parent.type === "codeIndented")) return;
		const start = this.stack.findLast((entry) => entry.type === "code")?.position?.start.offset;
		if (start === void 0) return;
		let source = sources.get(start);
		if (!source) {
			const owner = this.stack.find((entry) => entry.type === "listItem" || entry.type === "blockquote");
			source = {
				value: "",
				offsets: [],
				context: text.slice(owner?.position?.start.offset ?? start, token.start.offset),
				ownerStart: owner?.position?.start.offset ?? start,
				nested: owner !== void 0
			};
			sources.set(start, source);
		}
		const value = this.sliceSerialize(token);
		const extra = value.length - (token.end.offset - token.start.offset);
		for (let cursor = start + source.offsets.length; cursor < token.end.offset; cursor += 1) {
			const consumed = cursor - token.start.offset;
			source.offsets.push(source.value.length + (consumed > 0 ? consumed + extra : 0));
		}
		source.value += value;
	};
	return { enter: {
		codeFlowValue(token) {
			observe.call(this, token);
			expectDefined(this.config.enter.data, "Markdown data handler").call(this, token);
		},
		lineEnding(token) {
			observeInlineLineEnding?.call(this, token);
			observe.call(this, token);
		}
	} };
}
function parseMarkdownOwnership(text, options) {
	const paragraphs = options?.includeIndentedSource ? [] : void 0;
	if (!text) return {
		regions: [],
		codeSpans: [],
		textSpans: [],
		retainStart: 0,
		completedParagraphs: [],
		...paragraphs ? { paragraphs } : {}
	};
	const sources = /* @__PURE__ */ new Map();
	const indentedSources = options?.includeIndentedSource ? /* @__PURE__ */ new Map() : void 0;
	const inlineSourceExtension = options?.includeSource ? captureInlineSources(text, sources) : void 0;
	const tables = options?.syntax !== "commonmark";
	const tree = fromMarkdown(text, {
		extensions: [DISABLE_HTML_MARKDOWN, ...tables ? [gfmTable()] : []],
		mdastExtensions: [
			...tables ? [gfmTableFromMarkdown()] : [],
			...inlineSourceExtension ? [inlineSourceExtension] : [],
			...indentedSources ? [captureIndentedSources(text, indentedSources, inlineSourceExtension?.enter?.lineEnding)] : []
		]
	});
	const completedParagraphs = [];
	const regions = [];
	const textSpans = [];
	const blocks = tree.children ?? [];
	for (let index = 0; index < blocks.length; index += 1) {
		const block = expectDefined(blocks[index], "Markdown block");
		const next = blocks[index + 1]?.position?.start;
		const blockStart = block.position?.start?.offset;
		const endLine = block.position?.end?.line;
		const blockEnd = block.position?.end?.offset;
		if (paragraphs && block.type === "paragraph" && blockStart !== void 0 && blockEnd !== void 0) paragraphs.push({
			start: blockStart,
			end: blockEnd
		});
		let paragraph;
		if (block.type === "paragraph" && blockStart !== void 0 && endLine !== void 0 && next?.offset !== void 0 && next.line !== void 0 && next.line > endLine + 1) {
			paragraph = {
				start: blockStart,
				end: next.offset,
				hasReferenceCandidate: false
			};
			completedParagraphs.push(paragraph);
		}
		const pending = [block];
		while (pending.length > 0) {
			const node = expectDefined(pending.pop(), "Markdown ownership node");
			if (paragraph && node.type === "text" && node.value?.includes("[")) paragraph.hasReferenceCandidate = true;
			const start = node.position?.start?.offset;
			const end = node.position?.end?.offset;
			if (options?.includeText && node.type === "text" && start !== void 0 && end !== void 0) textSpans.push([start, end]);
			if ((node.type === "code" || node.type === "inlineCode") && start !== void 0 && end !== void 0) {
				const source = sources.get(start);
				if (source) while (source.offsets.length <= end - start) source.offsets.push(source.value.length);
				const indentedSource = indentedSources?.get(start);
				if (indentedSource) {
					indentedSource.value = node.value ?? "";
					while (indentedSource.offsets.length <= end - start) indentedSource.offsets.push(indentedSource.value.length);
					indentedSource.offsets.forEach((offset, sourceIndex) => {
						indentedSource.offsets[sourceIndex] = Math.min(offset, indentedSource.value.length);
					});
				}
				regions.push({
					start,
					end,
					block: node.type === "code",
					...source ? { source } : {},
					...indentedSource ? { indentedSource } : {}
				});
			}
			for (const child of node.children?.toReversed() ?? []) pending.push(child);
		}
	}
	regions.sort((left, right) => left.start - right.start);
	return {
		regions,
		codeSpans: regions.map(({ start, end }) => [start, end]),
		textSpans,
		retainStart: tree.children?.at(-1)?.position?.start?.offset ?? text.length,
		completedParagraphs,
		...paragraphs ? { paragraphs } : {}
	};
}
/** Returns parser-owned CommonMark/GFM code ranges with block ownership. */
function findMarkdownCodeRegions(text, options) {
	return /[`~\t]| {4}/u.test(text) ? parseMarkdownOwnership(text, options).regions : [];
}
/** Returns parser-owned CommonMark/GFM code ranges, including their delimiters. */
function findMarkdownCodeSpans(text) {
	if (!/[`~\t]| {4}/u.test(text)) return [];
	return parseMarkdownOwnership(text).codeSpans;
}
function isInsideCode(index, spans) {
	let low = 0;
	let high = spans.length - 1;
	while (low <= high) {
		const middle = Math.floor((low + high) / 2);
		const span = spans[middle];
		if (!span) return false;
		if (index < span[0]) high = middle - 1;
		else if (index >= span[1]) low = middle + 1;
		else return true;
	}
	return false;
}
function reduceReasoningText(text, codeSpans, state, options) {
	const output = [];
	const emit = (kind, value) => {
		if (!value) return;
		const previous = output.at(-1);
		if (previous?.kind === kind) previous.text += value;
		else output.push({
			kind,
			text: value
		});
		if (kind === "text" && value.trim()) state.visibleEver = true;
	};
	const append = (value) => {
		if (!value) return;
		if (state.depth > 0 && state.pending) {
			state.pending.content += value;
			state.pending.protectedClose ||= scanReasoningTags(value).tags.some((tag) => tag.isClose);
		} else emit("text", value);
	};
	const start = options.start ?? 0;
	const scan = scanReasoningTags(text.slice(start), options.final);
	const tags = [];
	for (const scannedTag of scan.tags) {
		const tag = {
			index: scannedTag.index + start,
			isClose: scannedTag.isClose,
			isSelfClosing: scannedTag.isSelfClosing,
			isPrivate: scannedTag.isPrivate,
			text: scannedTag.text
		};
		if (!isInsideCode(tag.index, codeSpans)) tags.push(tag);
	}
	const mustParseRemainder = [];
	if (options.scope === "leading") {
		let mustParse = false;
		for (let index = tags.length - 1; index >= 0; index -= 1) {
			mustParse ||= tags[index]?.isPrivate === true;
			mustParseRemainder[index] = mustParse;
			mustParse ||= tags[index]?.isClose === true;
		}
	}
	let cursor = start;
	for (let tagIndex = 0; tagIndex < tags.length; tagIndex += 1) {
		const tag = tags[tagIndex];
		if (!tag) continue;
		const beforeTag = text.slice(cursor, tag.index);
		append(beforeTag);
		const tagEnd = tag.index + tag.text.length;
		if (tag.isSelfClosing) {
			if (state.depth === 0 && options.scope === "leading" && state.visibleEver) {
				emit("text", text.slice(tag.index));
				cursor = text.length;
				break;
			}
			cursor = tagEnd;
			continue;
		}
		if (!tag.isClose) {
			if (state.depth === 0 && options.scope === "leading" && state.visibleEver && !mustParseRemainder[tagIndex]) {
				emit("text", text.slice(tag.index));
				cursor = text.length;
				break;
			}
			if (state.depth === 0) state.pending = {
				content: "",
				containsPrivate: tag.isPrivate,
				openTag: tag.text,
				protectedClose: false,
				visibleBefore: state.visibleEver
			};
			else if (state.pending) state.pending.containsPrivate ||= tag.isPrivate;
			state.depth += 1;
			cursor = tagEnd;
			continue;
		}
		if (state.depth > 0) {
			state.depth -= 1;
			if (state.depth === 0 && state.pending) {
				if (!state.pending.containsPrivate) emit("thinking", state.pending.content);
				state.pending = void 0;
			} else if (state.pending) state.pending.protectedClose = true;
			cursor = tagEnd;
			continue;
		}
		if (options.mode === "visible") append(tag.text);
		else {
			const after = text.slice(tagEnd);
			if (beforeTag.trim() && after.trim()) {
				const thinking = output.filter((delta) => delta.kind === "thinking");
				output.splice(0, output.length, ...thinking);
				state.visibleEver = false;
			}
		}
		cursor = tagEnd;
	}
	append(text.slice(cursor));
	if (options.final && state.depth > 0 && state.pending) {
		const pending = state.pending;
		if (!pending.containsPrivate) {
			if (options.mode === "static-preserve" || options.mode === "static-strict" && !pending.visibleBefore && !pending.protectedClose || options.mode === "visible" && !pending.protectedClose) emit("text", options.mode === "visible" && pending.visibleBefore ? pending.openTag + pending.content : pending.content);
			else emit("thinking", pending.content);
		}
		state.depth = 0;
		state.pending = void 0;
	}
	return output;
}
/** Strips reasoning tags using the same reducer as streamed partitioning. */
function stripReasoningTagsFromMarkdown(text, options) {
	return reduceReasoningText(text, findMarkdownCodeSpans(text), {
		depth: 0,
		visibleEver: false
	}, {
		final: true,
		mode: options.recoverUnclosed === false ? "hide" : options.mode === "preserve" ? "static-preserve" : "static-strict",
		scope: options.scope
	}).filter((delta) => delta.kind === "text").map((delta) => delta.text).join("");
}
//#endregion
//#region packages/markdown-core/src/reasoning-tags.ts
const MARKDOWN_CONTAINER_LINE_RE = /^(?: {0,3}(?:>|[-+*][\t ]|\d{1,9}[.)][\t ]))/mu;
function endsBlankBlock(text) {
	let cursor = text.length - 1;
	if (text[cursor] === "\n") cursor -= text[cursor - 1] === "\r" ? 2 : 1;
	else if (text[cursor] === "\r") cursor -= 1;
	else return false;
	while (text[cursor] === " " || text[cursor] === "	") cursor -= 1;
	return text[cursor] === "\n" || text[cursor] === "\r";
}
function reasoningTagNameStatus(text) {
	let cursor = skipTagWhitespace(text, 1);
	if (text.charAt(cursor) === "/") cursor = skipTagWhitespace(text, cursor + 1);
	const start = cursor;
	while (cursor < text.length && isTagNameCharacter(text.charCodeAt(cursor))) cursor += 1;
	const name = text.slice(start, cursor).toLowerCase();
	if (!name) return cursor === text.length ? "partial" : "invalid";
	if (!REASONING_TAG_NAME_SET.has(name)) return REASONING_TAG_NAMES.some((known) => known.startsWith(name)) && cursor === text.length ? "partial" : "invalid";
	if (cursor === text.length) return "partial";
	const boundary = text.charAt(cursor);
	return isTagWhitespace(boundary) || boundary === "/" || boundary === ">" ? "resolved" : "invalid";
}
function advancePendingTagProbe(probe, text) {
	for (const char of text) {
		if (probe.quote) {
			if (char === probe.quote) probe.quote = void 0;
			continue;
		}
		if (char === "\"" || char === "'") probe.quote = char;
		else if (char === ">" || char === "<") {
			probe.resolved = true;
			return;
		}
	}
}
/** Creates a block-incremental parser that emits only Markdown-stable text. */
function createReasoningTagTextPartitioner() {
	const reduction = {
		depth: 0,
		visibleEver: false
	};
	let source = "";
	let endedBlankBlock = false;
	let blockStart = 0;
	let emitted = 0;
	let holdStart;
	let heldBacktickStart;
	let strictMode = false;
	let pendingTagProbe;
	let fastPathCheckedThrough = 0;
	let fastPathCodeSafe = false;
	let nonFinalFullParses = 0;
	let nonFinalCodeSpans;
	let nonFinalCodeSpansEnd = 0;
	let nonFinalOpenEndedCode = false;
	let nonFinalRetainStart = 0;
	let nonFinalCloseReparseUsed = false;
	const compactCommittedSource = (retainStart) => {
		source = source.slice(retainStart);
		endedBlankBlock = endsBlankBlock(source);
		blockStart = source.length;
		emitted = source.length;
		holdStart = void 0;
		heldBacktickStart = void 0;
		pendingTagProbe = void 0;
		fastPathCheckedThrough = 0;
		fastPathCodeSafe = false;
		nonFinalFullParses = 0;
		nonFinalCodeSpans = void 0;
		nonFinalCodeSpansEnd = 0;
		nonFinalOpenEndedCode = false;
		nonFinalRetainStart = 0;
		nonFinalCloseReparseUsed = false;
	};
	const merge = (target, additions) => {
		for (const addition of additions) {
			const previous = target.at(-1);
			if (previous?.kind === addition.kind) previous.text += addition.text;
			else target.push({ ...addition });
		}
	};
	const emitSafePrefix = (limit, output, appended) => {
		if (strictMode) {
			holdStart ??= emitted;
			return;
		}
		if (reduction.depth > 0) {
			holdStart ??= emitted;
			const segment = source.slice(emitted, limit);
			if (!fastPathCodeSafe || /[\r\n`]/u.test(segment)) return;
			const scan = scanReasoningTags(segment, false);
			const reduceEnd = scan.pendingStart === void 0 ? limit : emitted + scan.pendingStart;
			merge(output, reduceReasoningText(source.slice(emitted, reduceEnd), [], reduction, {
				final: false,
				mode: "visible",
				scope: "all"
			}));
			emitted = reduceEnd;
			fastPathCheckedThrough = reduceEnd;
			if (scan.pendingStart !== void 0) {
				pendingTagProbe = {
					nameResolved: false,
					resolved: false,
					scannedThrough: limit,
					start: reduceEnd
				};
				advancePendingTagProbe(pendingTagProbe, source.slice(reduceEnd + 1, limit));
			}
			holdStart = reduction.depth > 0 || scan.pendingStart !== void 0 ? emitted : void 0;
			return;
		}
		if (holdStart !== void 0 || emitted >= limit) return;
		const appendedStart = source.length - (appended?.length ?? 0);
		const useAppended = appended !== void 0 && emitted >= appendedStart;
		const scanSource = useAppended ? appended : source;
		const scanOffset = useAppended ? appendedStart : 0;
		while (emitted < limit && holdStart === void 0) {
			let special = -1;
			for (let index = emitted; index < limit; index += 1) {
				const char = scanSource.charAt(index - scanOffset);
				if (char === "<" || char === "`") {
					special = index;
					break;
				}
			}
			const end = special === -1 ? limit : special;
			if (special !== -1 && source.charAt(special) === "`") {
				heldBacktickStart = special;
				holdStart = emitted;
				return;
			}
			const text = scanSource.slice(emitted - scanOffset, end - scanOffset);
			if (text) {
				merge(output, [{
					kind: "text",
					text
				}]);
				if (text.trim()) reduction.visibleEver = true;
				emitted = end;
			}
			if (special === -1) return;
			const tail = source.slice(special, limit);
			const parsed = parseReasoningTagAt(tail, 0, false);
			if (parsed.kind === "invalid") {
				merge(output, [{
					kind: "text",
					text: "<"
				}]);
				reduction.visibleEver = true;
				emitted = special + 1;
				continue;
			}
			holdStart = special;
			if (parsed.kind === "pending") {
				pendingTagProbe = {
					nameResolved: false,
					resolved: false,
					scannedThrough: limit,
					start: special
				};
				advancePendingTagProbe(pendingTagProbe, tail.slice(1));
				return;
			}
			if (/[\r\n]/u.test(source.slice(blockStart, special))) return;
			const fastPathInvalidated = /[\r\n`]/u.test(source.slice(fastPathCheckedThrough, special));
			if (!fastPathCodeSafe || fastPathInvalidated) {
				if (nonFinalFullParses >= 1) return;
				nonFinalFullParses += 1;
				const ownership = parseMarkdownOwnership(source.slice(0, limit));
				nonFinalCodeSpans = ownership.codeSpans;
				nonFinalCodeSpansEnd = limit;
				nonFinalOpenEndedCode = nonFinalCodeSpans.some(([, spanEnd]) => spanEnd === limit);
				nonFinalRetainStart = ownership.retainStart;
				fastPathCodeSafe = !source.slice(blockStart, special).includes("`") && !isInsideCode(special, nonFinalCodeSpans);
			}
			if (!fastPathCodeSafe) return;
			const boundaries = [
				source.indexOf("`", special),
				source.indexOf("\r", special),
				source.indexOf("\n", special)
			].filter((index) => index !== -1 && index < limit);
			const safeLimit = boundaries.length > 0 ? Math.min(...boundaries) : limit;
			const pendingAt = scanReasoningTags(source.slice(special, safeLimit), false).pendingStart;
			const reduceEnd = pendingAt === void 0 ? safeLimit : special + pendingAt;
			merge(output, reduceReasoningText(source.slice(special, reduceEnd), [], reduction, {
				final: false,
				mode: "visible",
				scope: "all"
			}));
			emitted = reduceEnd;
			fastPathCheckedThrough = reduceEnd;
			if (pendingAt !== void 0) {
				holdStart = reduceEnd;
				pendingTagProbe = {
					nameResolved: false,
					resolved: false,
					scannedThrough: limit,
					start: reduceEnd
				};
				advancePendingTagProbe(pendingTagProbe, source.slice(reduceEnd + 1, limit));
			} else holdStart = reduction.depth > 0 ? emitted : void 0;
		}
	};
	const processBlock = (end, final, output, parsedCodeSpans, parsedRetainStart) => {
		const previousBlockStart = blockStart;
		let blockCodeSpans = parsedCodeSpans;
		let blockRetainStart = parsedRetainStart;
		const finalizePending = () => {
			if (!final || reduction.depth === 0) return;
			merge(output, reduceReasoningText("", [], reduction, {
				final: true,
				mode: strictMode ? "hide" : "visible",
				scope: "all"
			}));
		};
		if (end <= blockStart) {
			finalizePending();
			return true;
		}
		if (end <= emitted) {
			finalizePending();
			blockStart = end;
			fastPathCheckedThrough = Math.max(fastPathCheckedThrough, end);
			return true;
		}
		emitSafePrefix(end, output);
		if (holdStart !== void 0 && holdStart < end) {
			const held = source.slice(holdStart, end);
			if (!final) {
				if (pendingTagProbe && !pendingTagProbe.resolved) return false;
				pendingTagProbe = void 0;
				const pendingStart = scanReasoningTags(held, false).pendingStart;
				if (pendingStart !== void 0) {
					pendingTagProbe = {
						nameResolved: false,
						resolved: false,
						scannedThrough: end,
						start: holdStart + pendingStart
					};
					advancePendingTagProbe(pendingTagProbe, held.slice(pendingStart + 1));
					return false;
				}
			}
			const block = source.slice(0, end);
			const start = holdStart;
			if (!blockCodeSpans) {
				const ownership = parseMarkdownOwnership(block);
				blockCodeSpans = ownership.codeSpans;
				blockRetainStart = ownership.retainStart;
			}
			merge(output, reduceReasoningText(block, blockCodeSpans, reduction, {
				final,
				mode: strictMode ? "hide" : "visible",
				scope: "all",
				start
			}));
			emitted = end;
		} else if (emitted < end) {
			const text = source.slice(emitted, end);
			merge(output, [{
				kind: "text",
				text
			}]);
			if (text.trim()) reduction.visibleEver = true;
			emitted = end;
		}
		finalizePending();
		const processedText = source.slice(previousBlockStart, end);
		const lastLineStart = Math.max(source.lastIndexOf("\n", Math.max(0, end - 1)), source.lastIndexOf("\r", Math.max(0, end - 1))) + 1;
		const crossedLineBoundary = /[\r\n]/u.test(processedText);
		blockStart = crossedLineBoundary && lastLineStart < end ? lastLineStart : end;
		holdStart = strictMode || reduction.depth > 0 ? end : void 0;
		heldBacktickStart = void 0;
		if (reduction.depth === 0) nonFinalCloseReparseUsed = false;
		pendingTagProbe = void 0;
		fastPathCheckedThrough = end;
		fastPathCodeSafe = !final && !crossedLineBoundary && emitted === source.length && !blockCodeSpans?.some(([, spanEnd]) => spanEnd === source.length);
		if (!final && reduction.depth === 0 && emitted === source.length && endedBlankBlock && !MARKDOWN_CONTAINER_LINE_RE.test(source.slice(blockRetainStart ?? 0)) && !blockCodeSpans?.some(([, spanEnd]) => spanEnd === source.length)) compactCommittedSource(blockRetainStart ?? 0);
		return true;
	};
	const consume = (appended, strict, final) => {
		strictMode ||= strict;
		const previousEndedBlankBlock = endedBlankBlock;
		source += appended;
		if (appended) endedBlankBlock = (appended.endsWith("\n") || appended.endsWith("\r")) && endsBlankBlock(source);
		const appendedBlock = appended.replace(/^(?:\r\n|\r|\n)+/u, "");
		const appendedStartsTopLevelBlock = previousEndedBlankBlock && /^[^\t \r\n]/u.test(appendedBlock) && !MARKDOWN_CONTAINER_LINE_RE.test(appendedBlock);
		if (pendingTagProbe && !pendingTagProbe.resolved) {
			advancePendingTagProbe(pendingTagProbe, source.slice(pendingTagProbe.scannedThrough));
			pendingTagProbe.scannedThrough = source.length;
			if (!pendingTagProbe.nameResolved) {
				const status = reasoningTagNameStatus(source.slice(pendingTagProbe.start));
				pendingTagProbe.nameResolved = status === "resolved";
				pendingTagProbe.resolved ||= status === "invalid";
			}
		}
		if (pendingTagProbe?.resolved && holdStart !== void 0) {
			pendingTagProbe = void 0;
			holdStart = void 0;
			heldBacktickStart = void 0;
		}
		const output = [];
		if (final) processBlock(source.length, true, output);
		else {
			emitSafePrefix(source.length, output, appended);
			if (!strictMode && holdStart !== void 0 && holdStart < source.length) {
				const ownershipStart = heldBacktickStart ?? holdStart;
				const heldLineStart = Math.max(source.lastIndexOf("\n", Math.max(0, ownershipStart - 1)), source.lastIndexOf("\r", Math.max(0, ownershipStart - 1))) + 1;
				const heldLineEnd = findNextLineEnding(source, ownershipStart);
				const tableLookaheadPending = source.slice(heldLineStart, heldLineEnd === -1 ? source.length : heldLineEnd).includes("|") && (heldLineEnd === -1 || findNextLineEnding(source, heldLineEnd + (source.charAt(heldLineEnd) === "\r" && source.charAt(heldLineEnd + 1) === "\n" ? 2 : 1)) === -1);
				const completedBlankBlock = endedBlankBlock;
				const heldBacktick = heldBacktickStart !== void 0;
				let openingRunEnd = ownershipStart;
				while (source.charAt(openingRunEnd) === "`") openingRunEnd += 1;
				const hasLaterBacktick = !heldBacktick || source.includes("`", openingRunEnd);
				const terminatedBacktickTail = !heldBacktick || source.at(-1) !== "`";
				const shouldTryParser = pendingTagProbe ? pendingTagProbe.resolved : reduction.depth > 0 ? appended.includes("<") : !heldBacktick || hasLaterBacktick && terminatedBacktickTail || completedBlankBlock;
				const mayResolveHeldReasoning = reduction.depth > 0 && !nonFinalCloseReparseUsed && (appended.includes("<") || appended.includes(">")) && scanReasoningTags(source.slice(holdStart), false).tags.some((tag) => tag.isClose);
				const reusableCodeSpans = nonFinalCodeSpansEnd === source.length ? nonFinalCodeSpans : void 0;
				const mayCloseTopLevelBlock = completedBlankBlock && !nonFinalOpenEndedCode && (appendedStartsTopLevelBlock || !MARKDOWN_CONTAINER_LINE_RE.test(source.slice(nonFinalRetainStart)));
				if ((shouldTryParser || mayResolveHeldReasoning) && !tableLookaheadPending && (reusableCodeSpans !== void 0 || nonFinalFullParses < 1 || mayCloseTopLevelBlock || mayResolveHeldReasoning)) {
					if (!reusableCodeSpans) nonFinalFullParses += 1;
					const ownership = reusableCodeSpans ? void 0 : parseMarkdownOwnership(source);
					nonFinalCloseReparseUsed ||= mayResolveHeldReasoning;
					const codeSpans = reusableCodeSpans ?? ownership?.codeSpans ?? [];
					const retainStart = reusableCodeSpans ? nonFinalRetainStart : ownership?.retainStart ?? 0;
					nonFinalRetainStart = retainStart;
					nonFinalOpenEndedCode = codeSpans.some(([, spanEnd]) => spanEnd === source.length);
					const heldCodeSpan = codeSpans.find(([start, end]) => ownershipStart >= start && ownershipStart < end);
					const heldInOpenEndedCode = heldCodeSpan?.[1] === source.length;
					const stableCode = heldCodeSpan !== void 0 && !heldInOpenEndedCode;
					const stableNonDelimiter = heldBacktick && heldCodeSpan === void 0 && completedBlankBlock;
					if (!heldBacktick && !heldInOpenEndedCode || stableCode || stableNonDelimiter) {
						let processEnd = source.length;
						if (stableNonDelimiter || mayCloseTopLevelBlock) processEnd = source.length;
						else if (stableCode && heldCodeSpan) {
							processEnd = heldCodeSpan[1];
							while (processEnd < source.length) {
								const char = source.charAt(processEnd);
								if (char === "\r" || char === "\n" || char === "<" || char === "`") break;
								processEnd += 1;
							}
						} else {
							const nextBacktick = source.indexOf("`", holdStart);
							if (nextBacktick !== -1) processEnd = nextBacktick;
						}
						if (processEnd > holdStart) {
							const stableTagSuffix = processEnd < source.length && source.charAt(processEnd) === "<" && !isInsideCode(processEnd, codeSpans);
							processBlock(processEnd, false, output, codeSpans, retainStart);
							if (stableTagSuffix) {
								fastPathCodeSafe = true;
								fastPathCheckedThrough = processEnd;
								emitSafePrefix(source.length, output);
							}
						}
					}
				}
			}
			if (holdStart === void 0 && reduction.depth === 0 && emitted === source.length && endedBlankBlock && (!MARKDOWN_CONTAINER_LINE_RE.test(source.slice(nonFinalRetainStart)) || appendedStartsTopLevelBlock) && nonFinalFullParses < 1) {
				nonFinalFullParses += 1;
				const ownership = parseMarkdownOwnership(source);
				const codeSpans = ownership.codeSpans;
				nonFinalRetainStart = ownership.retainStart;
				nonFinalOpenEndedCode = codeSpans.some(([, spanEnd]) => spanEnd === source.length);
				if (!codeSpans.some(([, spanEnd]) => spanEnd === source.length)) compactCommittedSource(ownership.retainStart);
			}
		}
		if (final) compactCommittedSource(source.length);
		return output;
	};
	return {
		markStrict() {
			strictMode = true;
			holdStart ??= emitted;
		},
		push(chunk) {
			return consume(chunk, true, false);
		},
		pushVisible(chunk) {
			return consume(chunk, false, false);
		},
		flush() {
			return consume("", strictMode, true);
		},
		hasPending() {
			return holdStart !== void 0 && holdStart < source.length || reduction.depth > 0 || emitted < source.length;
		},
		hasPendingSyntax() {
			return pendingTagProbe !== void 0 || heldBacktickStart !== void 0 || reduction.depth > 0;
		},
		isInsideReasoning() {
			return reduction.depth > 0;
		}
	};
}
//#endregion
export { stripReasoningTagsFromMarkdown as a, scanReasoningTags as i, findMarkdownCodeRegions as n, parseMarkdownOwnership as r, createReasoningTagTextPartitioner as t };
