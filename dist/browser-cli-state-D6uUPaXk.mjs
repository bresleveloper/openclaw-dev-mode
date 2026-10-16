import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { x as parseStrictFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { n as parseBooleanValue } from "./boolean-BEb0Fdt8.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { t as danger } from "./globals-BXbZ1A_g.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import "./cli-runtime-DIoqxVK3.mjs";
import { a as printBrowserJsonResult, c as runBrowserCliRequest, n as callBrowserRequest, s as runBrowserCliCommand, t as BROWSER_TAB_REFERENCE_HELP } from "./browser-cli-shared-nNyZ_99X.mjs";
import { n as runBrowserResizeWithOutput, t as parseBrowserViewportDimension } from "./browser-cli-resize-DmOR1dt6.mjs";
//#region extensions/browser/src/cli/browser-cli-state.cookies-storage.ts
function resolveTargetId(rawTargetId, command) {
	return normalizeOptionalString(rawTargetId) ?? normalizeOptionalString(inheritOptionFromParent(command, "targetId"));
}
function registerBrowserCookiesAndStorageCommands(browser, parentOpts) {
	const cookies = browser.command("cookies").description("Read/write cookies");
	cookies.option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, cmd) => {
		const parent = parentOpts(cmd);
		const targetId = resolveTargetId(opts.targetId, cmd);
		await runBrowserCliRequest({
			parent,
			method: "GET",
			path: "/cookies",
			query: { targetId },
			errorPolicy: "inline",
			print: (result) => defaultRuntime.writeJson(result.cookies ?? [])
		});
	});
	cookies.command("set").description("Set a cookie (requires --url or domain+path)").argument("<name>", "Cookie name").argument("<value>", "Cookie value").option("--url <url>", "Cookie URL scope (recommended)").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (name, value, opts, cmd) => {
		const parent = parentOpts(cmd);
		const targetId = resolveTargetId(opts.targetId, cmd);
		const url = normalizeOptionalString(opts.url);
		if (!url) {
			defaultRuntime.error(danger("Missing required --url option for cookies set"));
			defaultRuntime.exit(1);
			return;
		}
		await runBrowserCliRequest({
			parent,
			path: "/cookies/set",
			body: {
				targetId,
				cookie: {
					name,
					value,
					url
				}
			},
			errorPolicy: "inline",
			successMessage: `cookie set: ${name}`
		});
	});
	cookies.command("clear").description("Clear all cookies").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, cmd) => {
		const parent = parentOpts(cmd);
		const targetId = resolveTargetId(opts.targetId, cmd);
		await runBrowserCliRequest({
			parent,
			path: "/cookies/clear",
			body: { targetId },
			errorPolicy: "inline",
			successMessage: "cookies cleared"
		});
	});
	const storage = browser.command("storage").description("Read/write localStorage/sessionStorage");
	for (const kind of ["local", "session"]) {
		const cmd = storage.command(kind).description(`${kind}Storage commands`);
		cmd.command("get").description(`Get ${kind}Storage (all keys or one key)`).argument("[key]", "Key (optional)").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (key, opts, cmd2) => {
			const parent = parentOpts(cmd2);
			const targetId = resolveTargetId(opts.targetId, cmd2);
			await runBrowserCliRequest({
				parent,
				method: "GET",
				path: `/storage/${kind}`,
				query: {
					key: readNonBlankString(key),
					targetId
				},
				errorPolicy: "inline",
				print: (result) => defaultRuntime.writeJson(result.values ?? {})
			});
		});
		cmd.command("set").description(`Set a ${kind}Storage key`).argument("<key>", "Key").argument("<value>", "Value").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (key, value, opts, cmd2) => {
			const parent = parentOpts(cmd2);
			const targetId = resolveTargetId(opts.targetId, cmd2);
			await runBrowserCliRequest({
				parent,
				path: `/storage/${kind}/set`,
				body: {
					key,
					value,
					targetId
				},
				errorPolicy: "inline",
				successMessage: `${kind}Storage set: ${key}`
			});
		});
		cmd.command("clear").description(`Clear all ${kind}Storage keys`).option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, cmd2) => {
			const parent = parentOpts(cmd2);
			const targetId = resolveTargetId(opts.targetId, cmd2);
			await runBrowserCliRequest({
				parent,
				path: `/storage/${kind}/clear`,
				body: { targetId },
				errorPolicy: "inline",
				successMessage: `${kind}Storage cleared`
			});
		});
	}
}
//#endregion
//#region extensions/browser/src/cli/browser-cli-state.ts
function parseFiniteNumberOption(value, label) {
	if (value === void 0) return;
	const parsed = parseStrictFiniteNumber(value);
	if (parsed === void 0) {
		defaultRuntime.error(danger(`Invalid ${label}: must be a finite number`));
		defaultRuntime.exit(1);
		return;
	}
	return parsed;
}
function registerBrowserStateCommands(browser, parentOpts) {
	registerBrowserCookiesAndStorageCommands(browser, parentOpts);
	const set = browser.command("set").description("Browser environment settings");
	set.command("viewport").description("Set viewport size (alias for resize)").argument("<width>", "Viewport width").argument("<height>", "Viewport height").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (widthRaw, heightRaw, opts, cmd) => {
		const width = parseBrowserViewportDimension(widthRaw, "width");
		const height = parseBrowserViewportDimension(heightRaw, "height");
		if (width === void 0 || height === void 0) return;
		await runBrowserResizeWithOutput({
			parent: parentOpts(cmd),
			width,
			height,
			targetId: opts.targetId,
			successMessage: `viewport set: ${width}x${height}`
		});
	});
	set.command("offline").description("Toggle offline mode").argument("<on|off>", "on/off").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (value, opts, cmd) => {
		const parent = parentOpts(cmd);
		const offline = parseBooleanValue(value);
		if (offline === void 0) {
			defaultRuntime.error(danger("Expected on|off"));
			defaultRuntime.exit(1);
			return;
		}
		await runBrowserCliRequest({
			parent,
			path: "/set/offline",
			body: {
				offline,
				targetId: normalizeOptionalString(opts.targetId)
			},
			successMessage: `offline: ${offline}`
		});
	});
	set.command("headers").description("Set extra HTTP headers (JSON object)").argument("[headersJson]", "JSON object of headers (alternative to --headers-json)").option("--headers-json <json>", "JSON object of headers").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (headersJson, opts, cmd) => {
		const parent = parentOpts(cmd);
		await runBrowserCliCommand(async () => {
			const headersJsonValue = normalizeOptionalString(opts.headersJson) ?? normalizeOptionalString(headersJson);
			if (!headersJsonValue) throw new Error("Missing headers JSON (pass --headers-json or positional JSON argument)");
			const parsed = JSON.parse(headersJsonValue);
			if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Headers JSON must be a JSON object");
			const headers = {};
			for (const [k, v] of Object.entries(parsed)) if (typeof v === "string") headers[k] = v;
			const profile = parent?.browserProfile;
			const result = await callBrowserRequest(parent, {
				method: "POST",
				path: "/set/headers",
				query: profile ? { profile } : void 0,
				body: {
					headers,
					targetId: normalizeOptionalString(opts.targetId)
				}
			});
			if (printBrowserJsonResult(parent, result)) return;
			defaultRuntime.log("headers set");
		});
	});
	set.command("credentials").description("Set HTTP basic auth credentials").option("--clear", "Clear credentials", false).argument("[username]", "Username").argument("[password]", "Password").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (username, password, opts, cmd) => {
		const parent = parentOpts(cmd);
		await runBrowserCliRequest({
			parent,
			path: "/set/credentials",
			body: {
				username: normalizeOptionalString(username),
				password,
				clear: Boolean(opts.clear),
				targetId: normalizeOptionalString(opts.targetId)
			},
			successMessage: opts.clear ? "credentials cleared" : "credentials set"
		});
	});
	set.command("geo").description("Set geolocation (and grant permission)").option("--clear", "Clear geolocation + permissions", false).argument("[latitude]", "Latitude").argument("[longitude]", "Longitude").option("--accuracy <m>", "Accuracy in meters").option("--origin <origin>", "Origin to grant permissions for").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (latitudeRaw, longitudeRaw, opts, cmd) => {
		const parent = parentOpts(cmd);
		const latitude = parseFiniteNumberOption(latitudeRaw, "latitude");
		const longitude = parseFiniteNumberOption(longitudeRaw, "longitude");
		const accuracy = parseFiniteNumberOption(opts.accuracy, "--accuracy");
		if (latitudeRaw !== void 0 && latitude === void 0 || longitudeRaw !== void 0 && longitude === void 0 || opts.accuracy !== void 0 && accuracy === void 0) return;
		await runBrowserCliRequest({
			parent,
			path: "/set/geolocation",
			body: {
				latitude,
				longitude,
				accuracy,
				origin: normalizeOptionalString(opts.origin),
				clear: Boolean(opts.clear),
				targetId: normalizeOptionalString(opts.targetId)
			},
			successMessage: opts.clear ? "geolocation cleared" : "geolocation set"
		});
	});
	set.command("media").description("Emulate prefers-color-scheme").argument("<dark|light|no-preference|none>", "dark/light/no-preference/none").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (value, opts, cmd) => {
		const parent = parentOpts(cmd);
		const v = normalizeOptionalLowercaseString(value);
		const colorScheme = v === "dark" || v === "light" || v === "no-preference" || v === "none" ? v : null;
		if (!colorScheme) {
			defaultRuntime.error(danger("Expected dark|light|no-preference|none"));
			defaultRuntime.exit(1);
			return;
		}
		await runBrowserCliRequest({
			parent,
			path: "/set/media",
			body: {
				colorScheme,
				targetId: normalizeOptionalString(opts.targetId)
			},
			successMessage: `media colorScheme: ${colorScheme}`
		});
	});
	for (const [command, description, parameter, argumentHelp] of [
		[
			"timezone",
			"Override timezone (CDP)",
			"timezoneId",
			"Timezone ID (e.g. America/New_York)"
		],
		[
			"locale",
			"Override locale (CDP)",
			"locale",
			"Locale (e.g. en-US)"
		],
		[
			"device",
			"Apply a Playwright device descriptor (e.g. \"iPhone 14\")",
			"name",
			"Device name (Playwright devices)"
		]
	]) set.command(command).description(description).argument(`<${parameter}>`, argumentHelp).option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (value, opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			path: `/set/${command}`,
			body: {
				[parameter]: value,
				targetId: normalizeOptionalString(opts.targetId)
			},
			successMessage: `${command}: ${value}`
		});
	});
}
//#endregion
export { registerBrowserStateCommands };
