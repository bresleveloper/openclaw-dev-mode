import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as danger } from "./globals-QODkv80i.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as writeExternalFileWithinOutputRoot } from "./output-files-Dg5F90BE.mjs";
import "./core-api-66CmqqZ-.mjs";
import { a as parseBrowserPositiveIntegerOption, i as parseBrowserNonNegativeIntegerValue, n as callBrowserRequest, o as parseBrowserPositiveIntegerValue, t as BROWSER_TAB_REFERENCE_HELP } from "./browser-cli-shared-DEcwGaKW.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/browser/src/cli/browser-cli-inspect.ts
/**
* Browser CLI inspection commands for screenshots and snapshots.
*/
function parseOptionalIntegerOption(value, label, opts) {
	if (value === void 0) return;
	const parsed = opts.min === 0 ? parseBrowserNonNegativeIntegerValue(value) : parseBrowserPositiveIntegerValue(value);
	if (parsed === void 0 || parsed < opts.min) {
		defaultRuntime.error(danger(`Invalid ${label}: must be an integer >= ${opts.min}`));
		defaultRuntime.exit(1);
		return;
	}
	return parsed;
}
function parseBrowserChoiceOption(value, label, choices) {
	if (choices.includes(value)) return value;
	defaultRuntime.error(danger(`Invalid ${label}: expected ${choices.join(" or ")}`));
	defaultRuntime.exit(1);
}
function resolveBrowserInspectTimeout(command, parent, value) {
	const timeout = command.getOptionValueSource("timeout") === "cli" ? value : inheritOptionFromParent(command, "timeout", "cli");
	if (timeout === void 0) return { parent };
	const timeoutMs = parseBrowserPositiveIntegerOption(timeout, "--timeout");
	return {
		parent: {
			...parent,
			timeout: String(timeoutMs)
		},
		timeoutMs
	};
}
/** Registers Browser screenshot and snapshot commands. */
function registerBrowserInspectCommands(browser, parentOpts) {
	browser.command("screenshot").description("Capture a screenshot (prints the saved path)").argument("[targetId]", BROWSER_TAB_REFERENCE_HELP).option("--full-page", "Capture full scrollable page", false).option("--ref <ref>", "ARIA ref from ai snapshot").option("--element <selector>", "CSS selector for element screenshot").option("--labels", "Overlay role refs on the screenshot (works with --full-page, --ref, and --element)", false).option("--type <png|jpeg>", "Output type (default: png)", "png").option("--timeout <ms>", "Timeout in ms").action(async (targetId, opts, cmd) => {
		const parent = parentOpts(cmd);
		const profile = parent?.browserProfile;
		const type = parseBrowserChoiceOption(opts.type, "--type", ["png", "jpeg"]);
		if (type === void 0) return;
		try {
			const request = resolveBrowserInspectTimeout(cmd, parent, opts.timeout);
			const result = await callBrowserRequest(request.parent, {
				method: "POST",
				path: "/screenshot",
				query: profile ? { profile } : void 0,
				body: {
					targetId: normalizeOptionalString(targetId),
					fullPage: Boolean(opts.fullPage),
					ref: normalizeOptionalString(opts.ref),
					element: normalizeOptionalString(opts.element),
					labels: Boolean(opts.labels),
					type,
					...request.timeoutMs === void 0 ? {} : { timeoutMs: request.timeoutMs }
				}
			});
			if (parent?.json) {
				defaultRuntime.writeJson(result);
				return;
			}
			defaultRuntime.log(shortenHomePath(result.path));
		} catch (err) {
			defaultRuntime.error(danger(String(err)));
			defaultRuntime.exit(1);
		}
	});
	browser.command("snapshot").description("Capture a snapshot (default: ai; aria is the accessibility tree)").option("--format <aria|ai>", "Snapshot format (default: ai)", "ai").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).option("--limit <n>", "Max nodes (default: 500/800)").option("--mode <efficient>", "Snapshot preset (efficient)").option("--efficient", "Use the efficient snapshot preset", false).option("--interactive", "Role snapshot: interactive elements only", false).option("--compact", "Role snapshot: compact output", false).option("--depth <n>", "Role snapshot: max depth").option("--selector <sel>", "Role snapshot: scope to CSS selector").option("--frame <sel>", "Role snapshot: scope to an iframe selector").option("--labels", "Include label overlay screenshot with annotations", false).option("--urls", "Append discovered link URLs to AI snapshots", false).option("--out <path>", "Write snapshot to a file").option("--timeout <ms>", "Timeout in ms").action(async (opts, cmd) => {
		const parent = parentOpts(cmd);
		const profile = parent?.browserProfile;
		const format = parseBrowserChoiceOption(opts.format, "--format", ["aria", "ai"]);
		if (format === void 0) return;
		const explicitMode = opts.mode === void 0 ? void 0 : parseBrowserChoiceOption(opts.mode, "--mode", ["efficient"]);
		if (opts.mode !== void 0 && explicitMode === void 0) return;
		const configMode = !(cmd.getOptionValueSource("format") === "cli") && format === "ai" && getRuntimeConfig().browser?.snapshotDefaults?.mode === "efficient" ? "efficient" : void 0;
		const mode = opts.efficient === true || explicitMode === "efficient" ? "efficient" : configMode;
		const limit = parseOptionalIntegerOption(opts.limit, "--limit", { min: 1 });
		const depth = parseOptionalIntegerOption(opts.depth, "--depth", { min: 0 });
		if (opts.limit !== void 0 && limit === void 0 || opts.depth !== void 0 && depth === void 0) return;
		try {
			const request = resolveBrowserInspectTimeout(cmd, parent, opts.timeout);
			const query = {
				format,
				targetId: normalizeOptionalString(opts.targetId),
				limit,
				interactive: opts.interactive ? true : void 0,
				compact: opts.compact ? true : void 0,
				depth,
				selector: normalizeOptionalString(opts.selector),
				frame: normalizeOptionalString(opts.frame),
				labels: opts.labels ? true : void 0,
				urls: opts.urls ? true : void 0,
				mode,
				profile,
				...request.timeoutMs === void 0 ? {} : { timeoutMs: request.timeoutMs }
			};
			const result = await callBrowserRequest(request.parent, {
				method: "GET",
				path: "/snapshot",
				query
			});
			if (opts.out) {
				const payload = result.format === "ai" ? result.snapshot : JSON.stringify(result, null, 2);
				await writeExternalFileWithinOutputRoot({
					path: path.resolve(opts.out),
					write: async (tempPath) => {
						await fs.writeFile(tempPath, payload, "utf8");
					}
				});
				if (parent?.json) defaultRuntime.writeJson({
					ok: true,
					out: opts.out,
					...result.format === "ai" && result.imagePath ? { imagePath: result.imagePath } : {}
				});
				else {
					defaultRuntime.log(shortenHomePath(opts.out));
					if (result.format === "ai" && result.imagePath) defaultRuntime.log(shortenHomePath(result.imagePath));
				}
				return;
			}
			if (parent?.json) {
				defaultRuntime.writeJson(result);
				return;
			}
			if (result.format === "ai") {
				defaultRuntime.log(result.snapshot);
				if (result.imagePath) defaultRuntime.log(shortenHomePath(result.imagePath));
				return;
			}
			const nodes = "nodes" in result ? result.nodes : [];
			defaultRuntime.log(nodes.map((n) => {
				const indent = "  ".repeat(Math.min(20, n.depth));
				const name = n.name ? ` "${n.name}"` : "";
				const value = n.value ? ` = "${n.value}"` : "";
				return `${indent}- ${n.role}${name}${value} [ref=${n.ref}]`;
			}).join("\n"));
		} catch (err) {
			defaultRuntime.error(danger(String(err)));
			defaultRuntime.exit(1);
		}
	});
}
//#endregion
export { registerBrowserInspectCommands };
