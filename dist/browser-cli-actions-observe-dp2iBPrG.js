import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as shortenHomePath } from "./utils-BApvfmPs.js";
import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import { t as danger } from "./globals-BWmHKFNH.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { n as runCommandWithRuntime } from "./cli-utils-ht0sKPTG.js";
import "./core-api-D9VxW-n2.js";
import "./core-api-CkYSI6SI.js";
import { n as callBrowserRequest, o as parseBrowserPositiveIntegerOption, t as BROWSER_TAB_REFERENCE_HELP } from "./browser-cli-shared-1zP-apMh.js";
//#region extensions/browser/src/cli/browser-cli-actions-observe.ts
function runBrowserObserve(action) {
	return runCommandWithRuntime(defaultRuntime, action, (err) => {
		defaultRuntime.error(danger(String(err)));
		defaultRuntime.exit(1);
	});
}
/** Registers Browser commands that observe current page state without direct input. */
function registerBrowserActionObserveCommands(browser, parentOpts) {
	browser.command("console").description("Get recent console messages").option("--level <level>", "Filter by level (error, warn, info)").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, cmd) => {
		const parent = parentOpts(cmd);
		const profile = parent?.browserProfile;
		await runBrowserObserve(async () => {
			const result = await callBrowserRequest(parent, {
				method: "GET",
				path: "/console",
				query: {
					level: normalizeOptionalString(opts.level),
					targetId: normalizeOptionalString(opts.targetId),
					profile
				}
			}, { timeoutMs: 2e4 });
			if (parent?.json) {
				defaultRuntime.writeJson(result);
				return;
			}
			defaultRuntime.writeJson(result.messages);
		});
	});
	browser.command("pdf").description("Save page as PDF").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, cmd) => {
		const parent = parentOpts(cmd);
		const profile = parent?.browserProfile;
		await runBrowserObserve(async () => {
			const result = await callBrowserRequest(parent, {
				method: "POST",
				path: "/pdf",
				query: profile ? { profile } : void 0,
				body: { targetId: normalizeOptionalString(opts.targetId) }
			}, { timeoutMs: 2e4 });
			if (parent?.json) {
				defaultRuntime.writeJson(result);
				return;
			}
			defaultRuntime.log(`PDF: ${shortenHomePath(result.path)}`);
		});
	});
	browser.command("responsebody").description("Wait for a network response and return its body").argument("<url>", "URL (exact, substring, or glob like **/api)").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).option("--timeout-ms <ms>", "How long to wait for the response (default: 20000)", (v) => parseBrowserPositiveIntegerOption(v, "--timeout-ms")).option("--max-chars <n>", "Max body chars to return (default: 200000)", (v) => parseBrowserPositiveIntegerOption(v, "--max-chars")).action(async (url, opts, cmd) => {
		const parent = parentOpts(cmd);
		const profile = parent?.browserProfile;
		await runBrowserObserve(async () => {
			const timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : void 0;
			const maxChars = Number.isFinite(opts.maxChars) ? opts.maxChars : void 0;
			const result = await callBrowserRequest(parent, {
				method: "POST",
				path: "/response/body",
				query: profile ? { profile } : void 0,
				body: {
					url,
					targetId: normalizeOptionalString(opts.targetId),
					timeoutMs,
					maxChars
				}
			}, { timeoutMs: timeoutMs ?? 2e4 });
			if (parent?.json) {
				defaultRuntime.writeJson(result);
				return;
			}
			defaultRuntime.log(result.response.body);
		});
	});
}
//#endregion
export { registerBrowserActionObserveCommands };
