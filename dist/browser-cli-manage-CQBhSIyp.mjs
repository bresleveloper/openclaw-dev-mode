import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { n as info, t as danger } from "./globals-BXbZ1A_g.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import { n as redactCdpUrl } from "./browser-cdp-DgJ98Oxl.mjs";
import { t as formatBrowserGraphicsSummary } from "./chrome.graphics-BDUU9RcK.mjs";
import { a as printBrowserJsonResult, c as runBrowserCliRequest, n as callBrowserRequest, o as resolveBrowserProfileQuery, s as runBrowserCliCommand, t as BROWSER_TAB_REFERENCE_HELP } from "./browser-cli-shared-DgJ6kCyZ.mjs";
//#region extensions/browser/src/cli/browser-cli-manage.ts
const BROWSER_MANAGE_REQUEST_TIMEOUT_MS = 45e3;
function sanitizeTableCell(value) {
	return value.replace(/\p{Cc}/gu, " ");
}
async function fetchBrowserManagement(parent, path, query, timeoutMs = BROWSER_MANAGE_REQUEST_TIMEOUT_MS) {
	return await callBrowserRequest(parent, {
		method: "GET",
		path,
		query
	}, { timeoutMs });
}
async function runBrowserToggle(parent, params) {
	const profile = parent.browserProfile;
	await callBrowserRequest(parent, {
		method: "POST",
		path: params.path,
		query: resolveBrowserProfileQuery(profile, params.query)
	});
	const status = await fetchBrowserManagement(parent, "/", resolveBrowserProfileQuery(profile));
	if (printBrowserJsonResult(parent, status)) return;
	const name = status.profile ?? "openclaw";
	const headlessLabel = params.path === "/start" && status.headless ? " (headless)" : "";
	defaultRuntime.log(info(`🦞 browser [${name}] running: ${status.running}${headlessLabel}`));
}
function parseTabIndex(value) {
	return parseStrictPositiveInteger(value) ?? NaN;
}
function logBrowserTabs(tabs) {
	if (tabs.length === 0) {
		defaultRuntime.log("No tabs (browser closed or no targets).");
		return;
	}
	defaultRuntime.log(tabs.map((t, i) => {
		const labelHandle = t.label ? `label:${t.label}` : void 0;
		const handles = [
			t.suggestedTargetId ? `use: ${t.suggestedTargetId}` : void 0,
			t.tabId ? `tab: ${t.tabId}` : void 0,
			labelHandle
		].filter(Boolean).join(" ");
		return `${i + 1}. ${t.title || "(untitled)"}${handles ? ` [${handles}]` : ""}\n   ${t.url}\n   id: ${t.targetId}`;
	}).join("\n"));
}
function formatDoctorLine(check) {
	return `${check.warning ? "WARN" : check.info ? "INFO" : check.ok ? "OK" : "FAIL"} ${check.name}${check.detail ? `: ${check.detail}` : ""}`;
}
function formatBrowserDoctorGatewayError(error) {
	if (error instanceof Error && (error.name === "GatewaySecretRefUnavailableError" || error.code === "GATEWAY_SECRET_REF_UNAVAILABLE")) return "Gateway auth SecretRef is unavailable in this command path; browser doctor cannot reach the admin-scoped browser.request endpoint. Set OPENCLAW_GATEWAY_TOKEN or OPENCLAW_GATEWAY_PASSWORD, then retry.";
	return String(error);
}
async function runBrowserDoctor(parent, profile, deep) {
	const checks = [];
	const probe = async (name, read) => {
		try {
			checks.push({
				name,
				...await read()
			});
		} catch (error) {
			checks.push({
				name,
				ok: false,
				detail: String(error)
			});
		}
	};
	let report;
	try {
		report = await fetchBrowserManagement(parent, "/doctor", resolveBrowserProfileQuery(profile));
		checks.push({
			name: "gateway",
			ok: true,
			detail: "browser control endpoint reachable"
		});
	} catch (err) {
		checks.push({
			name: "gateway",
			ok: false,
			detail: formatBrowserDoctorGatewayError(err)
		});
		return {
			ok: false,
			checks
		};
	}
	const status = report.status;
	checks.push({
		name: "plugin",
		ok: status.enabled,
		detail: status.enabled ? "enabled" : "disabled in config"
	});
	checks.push({
		name: "profile",
		ok: true,
		detail: `${status.profile ?? "openclaw"} (${usesChromeMcpTransport(status) ? "chrome-mcp" : status.transport ?? "cdp"})`
	});
	checks.push({
		name: "browser",
		ok: status.running,
		detail: status.running ? `running${status.cdpReady === false ? ", CDP not ready" : ""}` : "not running; run `openclaw browser start`"
	});
	const extensionVersionCheck = report.checks.find((check) => check.id === "extension-version");
	if (extensionVersionCheck) checks.push({
		name: extensionVersionCheck.id,
		ok: extensionVersionCheck.status !== "fail",
		warning: extensionVersionCheck.status === "warn",
		info: extensionVersionCheck.status === "info",
		detail: `${extensionVersionCheck.summary}${extensionVersionCheck.fixHint ? `; ${extensionVersionCheck.fixHint}` : ""}`
	});
	if (status.graphics) checks.push({
		name: "graphics",
		ok: true,
		warning: status.graphics.status === "unavailable",
		detail: formatBrowserGraphicsSummary(status.graphics)
	});
	await probe("profiles", async () => {
		return {
			ok: true,
			detail: `${(await fetchBrowserManagement(parent, "/profiles")).profiles?.length ?? 0} configured`
		};
	});
	if (status.running) await probe("tabs", async () => {
		const tabs = (await fetchBrowserManagement(parent, "/tabs", resolveBrowserProfileQuery(profile))).tabs ?? [];
		return {
			ok: true,
			detail: `${tabs.length} visible${tabs.length > 0 && tabs[0]?.suggestedTargetId ? `, use tab reference ${tabs[0].suggestedTargetId}` : ""}`
		};
	});
	if (deep && status.running) await probe("live-snapshot", async () => {
		const result = await fetchBrowserManagement(parent, "/snapshot", resolveBrowserProfileQuery(profile, {
			format: "aria",
			limit: 25
		}), 1e4);
		const count = result.format === "aria" ? Array.isArray(result.nodes) ? result.nodes.length : 0 : typeof result.snapshot === "string" ? result.snapshot.split("\n").length : 0;
		return {
			ok: count > 0,
			detail: count > 0 ? `${count} nodes/lines` : "snapshot returned no content"
		};
	});
	return {
		ok: checks.every((check) => check.ok),
		checks,
		status
	};
}
function usesChromeMcpTransport(params) {
	return params.transport === "chrome-mcp" || params.driver === "existing-session";
}
function formatBrowserConnectionSummary(params) {
	if (usesChromeMcpTransport(params)) {
		if (params.cdpUrl) return `transport: chrome-mcp, cdpUrl: ${redactCdpUrl(params.cdpUrl)}`;
		const userDataDir = params.userDataDir ? shortenHomePath(params.userDataDir) : null;
		return userDataDir ? `transport: chrome-mcp, userDataDir: ${userDataDir}` : "transport: chrome-mcp";
	}
	if (params.transport === "extension" || params.driver === "extension") return `transport: extension, relayPort: ${params.cdpPort ?? "(unset)"}`;
	if (params.isRemote) return `cdpUrl: ${params.cdpUrl ? redactCdpUrl(params.cdpUrl) : "(unset)"}`;
	return `port: ${params.cdpPort ?? "(unset)"}`;
}
function registerBrowserManageCommands(browser, parentOpts) {
	browser.command("status").description("Show browser status").action(async (_opts, cmd) => {
		const parent = parentOpts(cmd);
		await runBrowserCliCommand(async () => {
			const status = await fetchBrowserManagement(parent, "/", resolveBrowserProfileQuery(parent?.browserProfile));
			if (printBrowserJsonResult(parent, status)) return;
			const detectedPath = status.detectedExecutablePath ?? status.executablePath;
			const detectedDisplay = detectedPath ? shortenHomePath(detectedPath) : "auto";
			defaultRuntime.log([
				`profile: ${status.profile ?? "openclaw"}`,
				`enabled: ${status.enabled}`,
				`running: ${status.running}`,
				`transport: ${usesChromeMcpTransport(status) ? "chrome-mcp" : status.transport ?? "cdp"}`,
				...!usesChromeMcpTransport(status) ? [`cdpPort: ${status.cdpPort ?? "(unset)"}`, `cdpUrl: ${redactCdpUrl(status.cdpUrl ?? `http://127.0.0.1:${status.cdpPort}`)}`] : status.cdpUrl ? [`cdpUrl: ${redactCdpUrl(status.cdpUrl)}`] : status.userDataDir ? [`userDataDir: ${shortenHomePath(status.userDataDir)}`] : [],
				`browser: ${status.chosenBrowser ?? "unknown"}`,
				`detectedBrowser: ${status.detectedBrowser ?? "unknown"}`,
				`detectedPath: ${detectedDisplay}`,
				`headless: ${status.headless}${status.headlessSource ? ` (${status.headlessSource})` : ""}`,
				`profileColor: ${status.color}`,
				...status.graphics ? [`graphics: ${formatBrowserGraphicsSummary(status.graphics)}`] : [],
				...status.detectError ? [`detectError: ${status.detectError}`] : []
			].join("\n"));
		});
	});
	browser.command("doctor").description("Check browser plugin readiness").option("--deep", "Run a live snapshot probe").action(async (opts, cmd) => {
		const parent = parentOpts(cmd);
		const profile = parent?.browserProfile;
		await runBrowserCliCommand(async () => {
			const result = await runBrowserDoctor(parent, profile, opts.deep === true);
			if (!printBrowserJsonResult(parent, result)) defaultRuntime.log(result.checks.map(formatDoctorLine).join("\n"));
			if (!result.ok) process.exitCode = 1;
		});
	});
	browser.command("start").description("Start the browser (no-op if already running)").option("--headless", "Launch a local managed browser headless for this start").action(async (opts, cmd) => {
		const parent = parentOpts(cmd);
		await runBrowserCliCommand(async () => {
			await runBrowserToggle(parent, {
				path: "/start",
				query: opts.headless ? { headless: true } : void 0
			});
		});
	});
	browser.command("stop").description("Stop the browser (best-effort)").action(async (_opts, cmd) => {
		const parent = parentOpts(cmd);
		await runBrowserCliCommand(async () => {
			await runBrowserToggle(parent, { path: "/stop" });
		});
	});
	browser.command("reset-profile").description("Reset browser profile (moves it to Trash)").action(async (_opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			path: "/reset-profile",
			print: (result) => {
				if (!result.moved) {
					defaultRuntime.log(info(`🦞 browser profile already missing.`));
					return;
				}
				const dest = result.to ?? result.from;
				defaultRuntime.log(info(`🦞 browser profile moved to Trash (${dest})`));
			}
		});
	});
	browser.command("tabs").description("List open tabs").action(async (_opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			method: "GET",
			path: "/tabs",
			timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS,
			json: (result) => ({ tabs: result.tabs ?? [] }),
			print: (result) => logBrowserTabs(result.tabs ?? [])
		});
	});
	const tab = browser.command("tab").description("Tab shortcuts (index-based)").action(async (_opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			path: "/tabs/action",
			body: { action: "list" },
			timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS,
			json: (result) => ({ tabs: result.tabs ?? [] }),
			print: (result) => logBrowserTabs(result.tabs ?? [])
		});
	});
	tab.command("new").description("Open a new tab (about:blank)").option("--label <label>", "Assign a friendly tab label").action(async (opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			path: "/tabs/action",
			body: {
				action: "new",
				label: opts.label
			},
			timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS,
			successMessage: ({ tab: opened }) => opened?.tabId ? `opened new tab ${opened.tabId}${opened.label ? ` (${opened.label})` : ""}` : "opened new tab"
		});
	});
	tab.command("label").description("Assign a friendly label to a tab").argument("<targetId>", BROWSER_TAB_REFERENCE_HELP).argument("<label>", "Friendly label").action(async (targetId, label, _opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			path: "/tabs/action",
			body: {
				action: "label",
				targetId,
				label
			},
			timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS,
			successMessage: ({ tab: tabValue }) => `labeled tab ${tabValue?.tabId ?? targetId} as ${tabValue?.label ?? label}`
		});
	});
	for (const [action, description, argument] of [[
		"select",
		"Focus tab by index (1-based)",
		"<index>"
	], [
		"close",
		"Close tab by index (1-based); default: first tab",
		"[index]"
	]]) tab.command(action).description(description).argument(argument, "Tab index (1-based)", parseTabIndex).action(async (index, _opts, cmd) => {
		const parent = parentOpts(cmd);
		if (index !== void 0 && (!Number.isSafeInteger(index) || index < 1)) {
			defaultRuntime.error(danger("index must be a positive integer"));
			defaultRuntime.exit(1);
			return;
		}
		await runBrowserCliRequest({
			parent,
			path: "/tabs/action",
			body: {
				action,
				index: index === void 0 ? void 0 : index - 1
			},
			timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS,
			successMessage: action === "select" ? `selected tab ${index}` : "closed tab"
		});
	});
	browser.command("open").description("Open a URL in a new tab").argument("<url>", "URL to open").option("--label <label>", "Assign a friendly tab label").action(async (url, opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			path: "/tabs/open",
			body: {
				url,
				...opts.label ? { label: opts.label } : {}
			},
			timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS,
			successMessage: (tabLocal) => `opened: ${tabLocal.url}\n${tabLocal.tabId ? `tab: ${tabLocal.tabId}\n` : ""}${tabLocal.label ? `label: ${tabLocal.label}\n` : ""}id: ${tabLocal.targetId}`
		});
	});
	browser.command("focus").description("Focus a tab by tab reference").argument("<targetId>", BROWSER_TAB_REFERENCE_HELP).action(async (targetId, _opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			path: "/tabs/focus",
			body: { targetId },
			timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS,
			json: () => ({ ok: true }),
			successMessage: `focused tab ${targetId}`
		});
	});
	browser.command("close").description("Close a tab (tab reference optional)").argument("[targetId]", `${BROWSER_TAB_REFERENCE_HELP} (optional)`).action(async (targetId, _opts, cmd) => {
		const target = targetId?.trim();
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			method: target ? "DELETE" : "POST",
			path: target ? `/tabs/${encodeURIComponent(target)}` : "/act",
			body: target ? void 0 : { kind: "close" },
			timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS,
			json: () => ({ ok: true }),
			successMessage: "closed tab"
		});
	});
	browser.command("profiles").description("List all browser profiles").action(async (_opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			profile: null,
			method: "GET",
			path: "/profiles",
			timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS,
			json: (result) => ({ profiles: result.profiles ?? [] }),
			print: (result) => {
				const profiles = result.profiles ?? [];
				if (profiles.length === 0) {
					defaultRuntime.log("No profiles configured.");
					return;
				}
				defaultRuntime.log(profiles.map((p) => {
					const status = p.running ? "running" : "stopped";
					const tabs = p.running ? ` (${p.tabCount} tabs)` : "";
					const def = p.isDefault ? " [default]" : "";
					const loc = formatBrowserConnectionSummary(p);
					const remote = p.isRemote ? " [remote]" : "";
					const driver = p.driver !== "openclaw" ? ` [${p.driver}]` : "";
					return `${p.name}: ${status}${tabs}${def}${remote}${driver}\n  ${loc}, color: ${p.color}`;
				}).join("\n"));
			}
		});
	});
	browser.command("system-profiles").description("List Chrome-family profiles available for cookie import").option("--browser <browser>", "System browser (chrome|brave|edge|chromium); omit to list all").action(async (opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			profile: null,
			method: "GET",
			path: "/system-profiles",
			query: opts.browser ? { browser: opts.browser } : void 0,
			timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS,
			json: (result) => ({ systemProfiles: result.systemProfiles ?? [] }),
			print: (result) => {
				const systemProfiles = result.systemProfiles ?? [];
				if (systemProfiles.length === 0) {
					defaultRuntime.log("No system browser profiles found.");
					return;
				}
				defaultRuntime.log("browser	id	name	hasCookies");
				defaultRuntime.log(systemProfiles.map((profile) => [
					profile.browser,
					profile.id,
					profile.name,
					profile.hasCookies ? "yes" : "no"
				].map(sanitizeTableCell).join("	")).join("\n"));
			}
		});
	});
	browser.command("import-profile").description("Import cookies from a macOS Chrome-family profile").option("--browser <browser>", "System browser (chrome|brave|edge|chromium)", "chrome").option("--system <profile>", "System profile directory", "Default").option("--into <profile>", "Managed target profile", "imported").option("--domains <domains>", "Comma-separated domain filter").action(async (opts, cmd) => {
		const domains = opts.domains?.split(",").map((domain) => domain.trim()).filter(Boolean);
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			profile: null,
			path: "/profiles/import",
			body: {
				browser: opts.browser,
				systemProfile: opts.system,
				into: opts.into,
				domains
			},
			timeoutMs: 12e4,
			successMessage: (result) => info(`Imported cookies into "${result.into}": ${result.cookies.imported}/${result.cookies.total} imported, ${result.cookies.failed} failed, ${result.cookies.skipped} skipped; ${result.domains.length} domains`)
		});
	});
	browser.command("create-profile").description("Create a new browser profile").requiredOption("--name <name>", "Profile name (lowercase, numbers, hyphens)").option("--color <hex>", "Profile color (hex format, e.g. #0066CC)").option("--cdp-url <url>", "DevTools endpoint URL (http/https/ws/wss)").option("--user-data-dir <path>", "User data dir for existing-session Chromium attach").option("--driver <driver>", "Profile driver (openclaw|existing-session). Default: openclaw").action(async (opts, cmd) => {
		const parent = parentOpts(cmd);
		await runBrowserCliCommand(async () => {
			if (opts.driver !== void 0 && opts.driver !== "openclaw" && opts.driver !== "existing-session") throw new Error("--driver must be openclaw or existing-session");
			const result = await callBrowserRequest(parent, {
				method: "POST",
				path: "/profiles/create",
				body: {
					name: opts.name,
					color: opts.color,
					cdpUrl: opts.cdpUrl,
					userDataDir: opts.userDataDir,
					driver: opts.driver === "existing-session" ? "existing-session" : void 0
				}
			});
			if (printBrowserJsonResult(parent, result)) return;
			const loc = `  ${formatBrowserConnectionSummary(result)}`;
			defaultRuntime.log(info(`🦞 Created profile "${result.profile}"\n${loc}\n  color: ${result.color}${result.userDataDir ? `\n  userDataDir: ${shortenHomePath(result.userDataDir)}` : ""}${opts.driver === "existing-session" ? "\n  driver: existing-session" : ""}`));
		});
	});
	browser.command("delete-profile").description("Delete a browser profile").requiredOption("--name <name>", "Profile name to delete").action(async (opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			profile: null,
			method: "DELETE",
			path: `/profiles/${encodeURIComponent(opts.name)}`,
			successMessage: (result) => info(result.deleted ? `🦞 Deleted profile "${result.profile}" (user data removed)` : `🦞 Deleted profile "${result.profile}" (user data removal not confirmed)`)
		});
	});
}
//#endregion
export { registerBrowserManageCommands };
