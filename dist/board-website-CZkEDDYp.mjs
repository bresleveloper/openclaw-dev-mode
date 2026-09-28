import { Et as _enum, Jn as string, Nt as array, Pn as number, Yt as discriminatedUnion, cr as url, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { r as BoardValidationError } from "./board-layout-6DyK3jbx.mjs";
//#region src/boards/board-report.ts
const BOARD_REPORT_WIDGET_KIND = "session:report";
const BOARD_REPORT_GUIDANCE = "Report data: {blocks:[...]}. Blocks: text {text,title?}; metrics {items:[{label,value,detail?}]}; table {columns,rows,title?}; chart {points:[{label,value}],style?:\"bar\"|\"line\",title?}; links {items:[{label,url,detail?}],title?}. Every block needs its type. Metric values and table cells are strings; chart values are numbers. Maximum 8KB JSON, 24 blocks, 8 metrics or columns, 40 rows or chart points, 20 links per block. Links must be HTTP(S). No HTML, scripts, styles, network reads, or executable actions.";
const title = string().min(1).max(120).optional();
const label = string().min(1).max(160);
const detail = string().max(240).optional();
const cell = string().max(500);
const table = strictObject({
	type: literal("table"),
	title,
	columns: array(label).min(1).max(8),
	rows: array(array(cell).max(8)).max(40)
}).refine((value) => value.rows.every((row) => row.length === value.columns.length), { message: "Every table row must match the columns" });
const reportSchema = strictObject({ blocks: array(discriminatedUnion("type", [
	strictObject({
		type: literal("text"),
		title,
		text: string().min(1).max(4e3)
	}),
	strictObject({
		type: literal("metrics"),
		items: array(strictObject({
			label,
			value: string().min(1).max(80),
			detail
		})).min(1).max(8)
	}),
	table,
	strictObject({
		type: literal("chart"),
		title,
		style: _enum(["bar", "line"]).optional(),
		points: array(strictObject({
			label,
			value: number().min(-Number.MAX_SAFE_INTEGER).max(Number.MAX_SAFE_INTEGER)
		})).min(1).max(40)
	}),
	strictObject({
		type: literal("links"),
		title,
		items: array(strictObject({
			label,
			url: url({
				protocol: /^https?$/,
				normalize: true
			}).max(2048),
			detail
		})).min(1).max(20)
	})
])).min(1).max(24) });
/** Data-only reports run in the host document, so executable fields are never accepted. */
function parseBoardReport(value) {
	if (new TextEncoder().encode(JSON.stringify(value)).byteLength > 8192) throw new BoardValidationError("invalid_operation", "Report exceeds 8KB JSON budget");
	const result = reportSchema.safeParse(value);
	if (!result.success) {
		const issue = result.error.issues[0];
		throw new BoardValidationError("invalid_operation", `Invalid report at ${issue?.path.join(".") || "root"}: ${issue?.message}`);
	}
	return result.data;
}
//#endregion
//#region src/boards/board-website.ts
const BOARD_WEBSITE_WIDGET_KIND = "session:website";
const BOARD_WEBSITE_GUIDANCE = "Website props: {url:\"https://...\"}. Opens the live website in an isolated browser frame without Gateway tools or credentials. Use a public HTTPS URL without embedded credentials; the website must allow embedding. Some sign-in flows and browser cookie policies require opening the website separately. Use size:\"full\", then action:\"set_presentation\" with presentation:\"expanded\" for a full-task website.";
const websiteSchema = strictObject({ url: string().max(2048).pipe(url({
	protocol: /^https$/,
	normalize: true
}).max(2048)) });
function parseBoardWebsite(value) {
	const result = websiteSchema.safeParse(value);
	if (!result.success) throw new BoardValidationError("invalid_operation", "Website props must contain only a valid HTTPS url of at most 2048 characters");
	const url = new URL(result.data.url);
	if (url.username || url.password) throw new BoardValidationError("invalid_operation", "Website URLs must not contain embedded credentials");
	return result.data;
}
//#endregion
export { BOARD_REPORT_WIDGET_KIND as a, BOARD_REPORT_GUIDANCE as i, BOARD_WEBSITE_WIDGET_KIND as n, parseBoardReport as o, parseBoardWebsite as r, BOARD_WEBSITE_GUIDANCE as t };
