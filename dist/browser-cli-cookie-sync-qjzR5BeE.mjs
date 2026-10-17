import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import { a as createDeferred } from "./extension-shared-GoQu59iC.mjs";
import { a as readSystemProfileCookies, n as assertSystemCookiePlatform, o as resolveSystemCookieSource, s as cacheKeychainSecret, t as parseSystemProfileDomains } from "./system-profile-domains-DpVvN-vC.mjs";
import { n as callBrowserRequest, s as runBrowserCliCommand } from "./browser-cli-shared-DgJ6kCyZ.mjs";
import fs from "node:fs";
import path from "node:path";
//#region extensions/browser/src/cli/browser-cli-cookie-sync.ts
/** Host-local macOS system-cookie sync into a managed Browser profile. */
const COOKIE_SYNC_DEBOUNCE_MS = 1500;
function parseCookieSyncDomains(raw) {
	if (raw === void 0) throw new Error("--domains is required; cookie sync never sends an unrestricted cookie jar");
	const domains = parseSystemProfileDomains(raw.split(","));
	if (!domains) throw new Error("--domains must include at least one non-empty domain");
	return domains;
}
function formatCookieSyncSummary(summary) {
	const domains = summary.domains.length > 0 ? summary.domains.join(",") : "none";
	return `cookie sync ${summary.browser}/${summary.systemProfile} -> ${summary.into} via ${summary.gateway}: total=${summary.total} pushed=${summary.pushed} skipped=${summary.skipped} failed=${summary.failed} domains=${domains}`;
}
async function pushSystemProfileCookies(params) {
	const source = await readSystemProfileCookies({
		browser: params.options.browser,
		systemProfile: params.options.system,
		domains: params.domains,
		signal: params.signal
	}, { readSecret: params.readSecret });
	let pushed = 0;
	if (source.cookies.length > 0) pushed = (await callBrowserRequest(params.parent, {
		method: "POST",
		path: "/cookies/set-many",
		query: { profile: params.options.into },
		body: { cookies: source.cookies }
	})).added;
	return {
		browser: source.browser,
		systemProfile: source.systemProfile,
		into: params.options.into,
		gateway: params.parent.url?.trim() || "configured/default",
		total: source.counts.total,
		pushed,
		skipped: source.counts.skipped,
		failed: source.counts.failed + Math.max(0, source.cookies.length - pushed),
		domains: source.domains.toSorted()
	};
}
async function watchSystemProfileCookies(params) {
	assertSystemCookiePlatform();
	const source = resolveSystemCookieSource({
		browser: params.options.browser,
		systemProfile: params.options.system
	});
	const controller = new AbortController();
	const readSecret = await cacheKeychainSecret(source.browser, controller.signal);
	let debounce;
	let inFlight = false;
	let pending = false;
	let stopped = false;
	let stopError;
	const stoppedResult = createDeferred();
	const settleStopped = () => {
		if (stopError) stoppedResult.reject(stopError);
		else stoppedResult.resolve();
	};
	const runCycle = async () => {
		if (stopped) return;
		if (inFlight) {
			pending = true;
			return;
		}
		pending = false;
		inFlight = true;
		try {
			const summary = await pushSystemProfileCookies({
				...params,
				readSecret,
				signal: controller.signal
			});
			defaultRuntime.error(formatCookieSyncSummary(summary));
		} catch (error) {
			if (!stopped) defaultRuntime.error(`cookie sync failed: ${String(error)}`);
		} finally {
			inFlight = false;
			if (stopped) settleStopped();
			else if (pending) runCycle();
		}
	};
	const sourceName = path.basename(source.cookiesFile);
	const watcher = fs.watch(path.dirname(source.cookiesFile), (_event, filename) => {
		const changedName = filename === null ? null : path.basename(filename);
		if (changedName !== null && changedName !== sourceName && !changedName.startsWith(`${sourceName}-`)) return;
		clearTimeout(debounce);
		debounce = setTimeout(() => void runCycle(), COOKIE_SYNC_DEBOUNCE_MS);
	});
	const stop = () => {
		if (stopped) return;
		stopped = true;
		clearTimeout(debounce);
		watcher.close();
		controller.abort(/* @__PURE__ */ new Error("cookie sync stopped"));
		if (!inFlight) settleStopped();
	};
	const fail = (error) => {
		stopError = error;
		stop();
	};
	watcher.on("error", fail);
	process.once("SIGINT", stop);
	process.once("SIGTERM", stop);
	try {
		await runCycle();
		await stoppedResult.promise;
	} finally {
		process.removeListener("SIGINT", stop);
		process.removeListener("SIGTERM", stop);
		watcher.removeListener("error", fail);
		stop();
	}
}
function registerBrowserCookieSyncCommand(browser, parentOpts) {
	browser.command("cookie-sync").description("Sync allowlisted macOS Chrome-family cookies into a managed profile").option("--domains <list>", "Required comma-separated domain allowlist").option("--into <profile>", "Target managed Browser profile", "imported").option("--browser <browser>", "System browser: chrome, brave, edge, or chromium", "chrome").option("--system <id>", "System browser profile directory", "Default").option("--watch", "Watch the source Cookies database and re-sync changes", false).action((options, command) => runBrowserCliCommand(async () => {
		const domains = parseCookieSyncDomains(options.domains);
		const parent = parentOpts(command);
		if (options.watch) {
			await watchSystemProfileCookies({
				options,
				parent,
				domains
			});
			return;
		}
		const summary = await pushSystemProfileCookies({
			options,
			parent,
			domains
		});
		defaultRuntime.log(formatCookieSyncSummary(summary));
	}));
}
//#endregion
export { registerBrowserCookieSyncCommand };
