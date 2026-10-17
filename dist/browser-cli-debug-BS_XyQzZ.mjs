import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import { c as runBrowserCliRequest, t as BROWSER_TAB_REFERENCE_HELP } from "./browser-cli-shared-DgJ6kCyZ.mjs";
//#region extensions/browser/src/cli/browser-cli-debug.ts
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
			query: {
				targetId: normalizeOptionalString(opts.targetId),
				clear: Boolean(opts.clear)
			},
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
			query: {
				targetId: normalizeOptionalString(opts.targetId),
				filter: normalizeOptionalString(opts.filter),
				clear: Boolean(opts.clear)
			},
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
