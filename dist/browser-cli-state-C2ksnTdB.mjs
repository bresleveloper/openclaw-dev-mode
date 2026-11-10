import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { x as parseStrictFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { n as parseBooleanValue } from "./boolean-CFfzB3ix.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as danger } from "./globals-XVSoVbNQ.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./cli-runtime-DAonhbWy.mjs";
import { a as printBrowserJsonResult, c as runBrowserCliCommand, l as runBrowserCliRequest, n as callBrowserRequest, t as BROWSER_TAB_REFERENCE_HELP } from "./browser-cli-shared-Ljun-8UE.mjs";
import { t as registerBrowserResizeCommand } from "./browser-cli-resize-CkuqJSP-.mjs";
//#region extensions/browser/src/cli/browser-cli-state.cookies-storage.ts
function resolveTargetId(rawTargetId, command) {
	return normalizeOptionalString(rawTargetId) ?? normalizeOptionalString(inheritOptionFromParent(command, "targetId"));
}
function registerBrowserCookiesAndStorageCommands(browser, parentOpts) {
	const cookies = browser.command("cookies").description("Read/write cookies");
	const storage = browser.command("storage").description("Read/write localStorage/sessionStorage");
	for (const kind of [
		"cookies",
		"local",
		"session"
	]) {
		const isCookies = kind === "cookies";
		const cmd = isCookies ? cookies : storage.command(kind).description(`${kind}Storage commands`);
		const route = isCookies ? "/cookies" : `/storage/${kind}`;
		const label = isCookies ? "cookie" : `${kind}Storage`;
		const read = async (key, opts, command) => {
			const parent = parentOpts(command);
			const targetId = resolveTargetId(opts.targetId, command);
			await runBrowserCliRequest({
				parent,
				method: "GET",
				path: route,
				query: isCookies ? { targetId } : {
					key: readNonBlankString(key),
					targetId
				},
				errorPolicy: "inline",
				print: (result) => defaultRuntime.writeJson(isCookies ? result.cookies ?? [] : result.values ?? {})
			});
		};
		if (isCookies) cmd.option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action((opts, command) => read(void 0, opts, command));
		else cmd.command("get").description(`Get ${kind}Storage (all keys or one key)`).argument("[key]", "Key (optional)").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(read);
		const set = cmd.command("set").description(isCookies ? "Set a cookie (requires --url or domain+path)" : `Set a ${kind}Storage key`).argument(isCookies ? "<name>" : "<key>", isCookies ? "Cookie name" : "Key").argument("<value>", isCookies ? "Cookie value" : "Value");
		if (isCookies) set.option("--url <url>", "Cookie URL scope (recommended)");
		set.option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (key, value, opts, command) => {
			const parent = parentOpts(command);
			const targetId = resolveTargetId(opts.targetId, command);
			const url = isCookies ? normalizeOptionalString(opts.url) : void 0;
			if (isCookies && !url) {
				defaultRuntime.error(danger("Missing required --url option for cookies set"));
				defaultRuntime.exit(1);
				return;
			}
			await runBrowserCliRequest({
				parent,
				path: `${route}/set`,
				body: isCookies ? {
					targetId,
					cookie: {
						name: key,
						value,
						url
					}
				} : {
					key,
					value,
					targetId
				},
				errorPolicy: "inline",
				successMessage: `${label} set: ${key}`
			});
		});
		cmd.command("clear").description(isCookies ? "Clear all cookies" : `Clear all ${kind}Storage keys`).option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, command) => {
			const parent = parentOpts(command);
			const targetId = resolveTargetId(opts.targetId, command);
			await runBrowserCliRequest({
				parent,
				path: `${route}/clear`,
				body: { targetId },
				errorPolicy: "inline",
				successMessage: `${isCookies ? "cookies" : label} cleared`
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
	registerBrowserResizeCommand(set.command("viewport").description("Set viewport size (alias for resize)"), parentOpts, true);
	const registerParsedSetting = (kind) => {
		const offline = kind === "offline";
		const choices = offline ? "on|off" : "dark|light|no-preference|none";
		set.command(kind).description(offline ? "Toggle offline mode" : "Emulate prefers-color-scheme").argument(`<${choices}>`, choices.replaceAll("|", "/")).option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (value, opts, cmd) => {
			const parent = parentOpts(cmd);
			const parsed = offline ? parseBooleanValue(value) : normalizeOptionalLowercaseString(value);
			if (parsed === void 0 || typeof parsed === "string" && !choices.split("|").includes(parsed)) {
				defaultRuntime.error(danger(`Expected ${choices}`));
				defaultRuntime.exit(1);
				return;
			}
			await runBrowserCliRequest({
				parent,
				path: `/set/${kind}`,
				body: {
					[offline ? "offline" : "colorScheme"]: parsed,
					targetId: normalizeOptionalString(opts.targetId)
				},
				successMessage: `${offline ? "offline" : "media colorScheme"}: ${parsed}`
			});
		});
	};
	registerParsedSetting("offline");
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
	registerParsedSetting("media");
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
