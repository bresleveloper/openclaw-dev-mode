import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./core-api-66CmqqZ-.mjs";
import { t as BROWSER_TAB_REFERENCE_HELP, u as runBrowserCliRequest } from "./browser-cli-shared-DEcwGaKW.mjs";
//#region extensions/browser/src/cli/browser-cli-debug.ts
function resolveDebugQuery(params) {
	return {
		targetId: normalizeOptionalString(params.targetId),
		filter: normalizeOptionalString(params.filter),
		clear: Boolean(params.clear)
	};
}
/** Registers Browser debugging and trace commands. */
function registerBrowserDebugCommands(browser, parentOpts) {
	browser.command("highlight").description("Highlight an element by ref").argument("<ref>", "Ref id from snapshot").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (ref, opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			path: "/highlight",
			body: {
				ref: ref.trim(),
				targetId: normalizeOptionalString(opts.targetId)
			},
			successMessage: `highlighted ${ref.trim()}`
		});
	});
	browser.command("errors").description("Get recent page errors").option("--clear", "Clear stored errors after reading", false).option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			method: "GET",
			path: "/errors",
			query: resolveDebugQuery({
				targetId: opts.targetId,
				clear: opts.clear
			}),
			print: (result) => {
				if (!result.errors.length) {
					defaultRuntime.log("No page errors.");
					return;
				}
				defaultRuntime.log(result.errors.map((e) => `${e.timestamp} ${e.name ? `${e.name}: ` : ""}${e.message}`).join("\n"));
			}
		});
	});
	browser.command("requests").description("Get recent network requests (best-effort)").option("--filter <text>", "Only show URLs that contain this substring").option("--clear", "Clear stored requests after reading", false).option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			method: "GET",
			path: "/requests",
			query: resolveDebugQuery({
				targetId: opts.targetId,
				filter: opts.filter,
				clear: opts.clear
			}),
			print: (result) => {
				if (!result.requests.length) {
					defaultRuntime.log("No requests recorded.");
					return;
				}
				defaultRuntime.log(result.requests.map((r) => {
					const status = typeof r.status === "number" ? ` ${r.status}` : "";
					const ok = r.ok === true ? " ok" : r.ok === false ? " fail" : "";
					const fail = r.failureText ? ` (${r.failureText})` : "";
					return `${r.timestamp} ${r.method}${status}${ok} ${r.url}${fail}`;
				}).join("\n"));
			}
		});
	});
	const trace = browser.command("trace").description("Record a Playwright trace");
	trace.command("start").description("Start trace recording").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).option("--no-screenshots", "Disable screenshots").option("--no-snapshots", "Disable snapshots").option("--sources", "Include sources (bigger traces)", false).action(async (opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			path: "/trace/start",
			body: {
				targetId: normalizeOptionalString(opts.targetId),
				screenshots: Boolean(opts.screenshots),
				snapshots: Boolean(opts.snapshots),
				sources: Boolean(opts.sources)
			},
			successMessage: "trace started"
		});
	});
	trace.command("stop").description("Stop trace recording and write a .zip").option("--out <path>", "Output path within openclaw temp dir (e.g. trace.zip or /tmp/openclaw/trace.zip)").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			path: "/trace/stop",
			body: {
				targetId: normalizeOptionalString(opts.targetId),
				path: normalizeOptionalString(opts.out)
			},
			successMessage: (result) => `TRACE:${shortenHomePath(result.path)}`
		});
	});
}
//#endregion
export { registerBrowserDebugCommands };
