import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./core-api-66CmqqZ-.mjs";
import { a as parseBrowserPositiveIntegerOption, d as withBrowserActionTimeoutSlack, t as BROWSER_TAB_REFERENCE_HELP, u as runBrowserCliRequest } from "./browser-cli-shared-DEcwGaKW.mjs";
//#region extensions/browser/src/cli/browser-cli-actions-observe.ts
const BROWSER_CONSOLE_LEVELS = [
	"error",
	"warn",
	"info"
];
function parseBrowserConsoleLevel(value) {
	const level = BROWSER_CONSOLE_LEVELS.find((candidate) => candidate === value);
	if (!level) throw new Error(`--level must be ${BROWSER_CONSOLE_LEVELS.slice(0, -1).join(", ")}, or ${BROWSER_CONSOLE_LEVELS.at(-1)}.`);
	return level;
}
/** Registers Browser commands that observe current page state without direct input. */
function registerBrowserActionObserveCommands(browser, parentOpts) {
	browser.command("console").description("Get recent console messages").option("--level <level>", `Filter by level (${BROWSER_CONSOLE_LEVELS.join(", ")})`, parseBrowserConsoleLevel).option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			method: "GET",
			path: "/console",
			query: {
				level: normalizeOptionalString(opts.level),
				targetId: normalizeOptionalString(opts.targetId)
			},
			print: (result) => defaultRuntime.writeJson(result.messages)
		});
	});
	browser.command("pdf").description("Save page as PDF").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			path: "/pdf",
			body: { targetId: normalizeOptionalString(opts.targetId) },
			successMessage: (result) => `PDF: ${shortenHomePath(result.path)}`
		});
	});
	browser.command("responsebody").description("Wait for a network response and return its body").argument("<url>", "URL (exact, substring, or glob like **/api)").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).option("--timeout-ms <ms>", "How long to wait for the complete response body (default: 20000)", (v) => parseBrowserPositiveIntegerOption(v, "--timeout-ms")).option("--max-chars <n>", "Max body chars to return (default: 200000)", (v) => parseBrowserPositiveIntegerOption(v, "--max-chars")).action(async (url, opts, cmd) => {
		const timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : void 0;
		const maxChars = Number.isFinite(opts.maxChars) ? opts.maxChars : void 0;
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			path: "/response/body",
			body: {
				url,
				targetId: normalizeOptionalString(opts.targetId),
				timeoutMs,
				maxChars
			},
			timeoutMs: withBrowserActionTimeoutSlack(timeoutMs),
			print: (result) => {
				defaultRuntime.log(result.response.body);
				if (result.response.truncated === true) defaultRuntime.error("Warning: response body is a truncated prefix. Use --json to inspect response metadata.");
			}
		});
	});
}
//#endregion
export { registerBrowserActionObserveCommands };
