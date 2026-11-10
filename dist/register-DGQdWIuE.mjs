import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as asRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { g as readRegularFile, t as FsSafeError } from "./fs-safe-6Z4UiMS4.mjs";
import { t as danger } from "./globals-XVSoVbNQ.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import "./security-runtime-6domDoE8.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import { u as resolveBrowserActRequestTimeoutMs } from "./act-policy-BRluzhGf.mjs";
import { i as resolveExistingUploadPaths } from "./paths-J645nsQI.mjs";
import { n as normalizeBrowserFormFields } from "./form-fields-m8XBvKFA.mjs";
import { a as printBrowserJsonResult, c as runBrowserCliCommand, i as parseBrowserPositiveIntegerOption, l as runBrowserCliRequest, n as callBrowserRequest, r as parseBrowserNonNegativeIntegerOption, t as BROWSER_TAB_REFERENCE_HELP, u as withBrowserActionTimeoutSlack } from "./browser-cli-shared-Ljun-8UE.mjs";
import { t as registerBrowserResizeCommand } from "./browser-cli-resize-CkuqJSP-.mjs";
import fs from "node:fs/promises";
import { isUtf8 } from "node:buffer";
//#region extensions/browser/src/cli/browser-cli-actions-input/shared.ts
/** Execute and present an action, preserving recorded interruptions and child failures. */
async function runBrowserAction(params) {
	const result = await callBrowserRequest(params.parent, {
		method: "POST",
		path: "/act",
		query: params.parent.browserProfile ? { profile: params.parent.browserProfile } : void 0,
		body: params.body
	}, { timeoutMs: resolveBrowserActRequestTimeoutMs(params.body) });
	const { parent, successMessage } = params;
	const failures = (result.results ?? []).flatMap((entry, index) => entry.ok ? [] : [`action ${index + 1}: ${entry.error ?? "failed"}`]);
	if (!printBrowserJsonResult(parent, result)) {
		if (failures.length) defaultRuntime.error(danger(`batch failed: ${failures.join("; ")}`));
		if (result.blockedByDialog) {
			const pending = asRecord(asRecord(result.browserState).dialogs).pending;
			const ids = Array.isArray(pending) ? pending.flatMap((dialog) => {
				const id = readStringField(asRecord(dialog), "id");
				return id ? [JSON.stringify(id)] : [];
			}) : [];
			defaultRuntime.log(`Action blocked by a modal dialog${ids.length ? ` (${ids.join(", ")})` : ""}. Use openclaw browser dialog --accept or --dismiss${ids.length ? " --dialog-id <id>" : ""} to continue.`);
		} else if (result.aborted) {
			const { reason, afterAction, skipped } = result.aborted;
			defaultRuntime.log(`Batch stopped after action ${afterAction}: page ${reason === "navigation" ? "navigated" : "closed"}; ${skipped} action(s) skipped. Take a fresh snapshot before continuing.`);
		} else if (!failures.length) {
			if (successMessage !== void 0) defaultRuntime.log(typeof successMessage === "function" ? successMessage(result) : successMessage);
			else defaultRuntime.writeJson(result.result ?? null);
		}
	}
	if (failures.length) defaultRuntime.exit(1);
}
function requireRef(ref) {
	const refValue = typeof ref === "string" ? ref.trim() : "";
	if (!refValue) throw new Error("ref is required");
	return refValue;
}
async function readActionsFile(filePath) {
	try {
		const { buffer } = await readRegularFile({
			filePath: await fs.realpath(filePath),
			maxBytes: ACTIONS_INPUT_MAX_BYTES
		});
		return decodeJsonInput(buffer, "--actions-file");
	} catch (cause) {
		if (cause instanceof FsSafeError && cause.code === "too-large") throw createActionsInputTooLargeError("--actions-file", cause);
		throw cause;
	}
}
function decodeJsonInput(buffer, source) {
	if (!isUtf8(buffer)) throw new Error(`${source} must be valid UTF-8.`);
	return buffer.toString("utf8");
}
async function readFields(opts) {
	if (opts.fields !== void 0 && opts.fieldsFile !== void 0) throw new Error("Specify only one of --fields or --fields-file");
	let payload = opts.fields ?? "";
	if (opts.fieldsFile) {
		const { buffer } = await readRegularFile({ filePath: await fs.realpath(opts.fieldsFile) });
		payload = decodeJsonInput(buffer, "--fields-file");
	}
	return normalizeBrowserFormFields(parseBrowserInputArray(payload, "fields"));
}
function parseBrowserInputArray(payload, kind) {
	if (!payload.trim()) throw new Error(`${kind} are required`);
	let parsed;
	try {
		parsed = JSON.parse(payload);
	} catch (cause) {
		throw new Error(`${kind} must be valid JSON${kind === "fields" ? "." : ""}`, { cause });
	}
	if (!Array.isArray(parsed)) throw new Error(`${kind} must be ${kind === "fields" ? "an array" : "a JSON array"}`);
	return parsed;
}
const ACTIONS_INPUT_MAX_BYTES = 1e6;
function createActionsInputTooLargeError(source, cause) {
	return new FsSafeError("too-large", `${source} exceeds ${ACTIONS_INPUT_MAX_BYTES} bytes. Split the batch plan into smaller files or run multiple openclaw browser batch commands.`, { cause });
}
async function readStdinText() {
	const chunks = [];
	let total = 0;
	for await (const chunk of process.stdin) {
		const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		total += buf.length;
		if (total > ACTIONS_INPUT_MAX_BYTES) throw createActionsInputTooLargeError("--actions-file - stdin");
		chunks.push(buf);
	}
	return decodeJsonInput(Buffer.concat(chunks), "--actions-file - stdin");
}
async function readActionsPayload(opts) {
	if (opts.actions !== void 0 && opts.actionsFile !== void 0) throw new Error("Specify only one of --actions or --actions-file");
	if (opts.actionsFile) return opts.actionsFile === "-" ? await readStdinText() : await readActionsFile(opts.actionsFile);
	return opts.actions ?? "";
}
//#endregion
//#region extensions/browser/src/cli/browser-cli-actions-input/register.batch.ts
function registerBrowserBatchCommands(browser, parentOpts) {
	browser.command("batch").description("Run a batch of browser actions in one call (default: stop on first error)").option("--actions <json>", "JSON array of act requests").option("--actions-file <path>", "Read JSON array from a file (- for stdin)").option("--continue", "Continue through all actions instead of stopping on first error").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, cmd) => {
		const parent = parentOpts(cmd);
		if (opts.actions !== void 0 && opts.actionsFile !== void 0) throw new Error("Specify only one of --actions or --actions-file");
		if (!opts.actions && !opts.actionsFile) throw new Error("Provide --actions, --actions-file, or --actions-file -");
		await runBrowserCliCommand(async () => {
			const actions = parseBrowserInputArray(await readActionsPayload({
				actions: opts.actions,
				actionsFile: opts.actionsFile
			}), "actions");
			if (!actions.length) throw new Error("actions must contain at least one entry");
			const targetId = normalizeOptionalString(opts.targetId);
			const request = {
				kind: "batch",
				actions,
				...targetId ? { targetId } : {},
				...opts.continue ? { stopOnError: false } : {}
			};
			await runBrowserAction({
				parent,
				body: request,
				successMessage: `batch ran ${actions.length} action(s)`
			});
		});
	});
}
//#endregion
//#region extensions/browser/src/cli/browser-cli-actions-input/register.element.ts
function parseBrowserMouseButtonOption(value) {
	if (value === "left" || value === "right" || value === "middle") return value;
	throw Object.assign(/* @__PURE__ */ new Error("--button must be left, right, or middle."), {
		name: "InvalidArgumentError",
		code: "commander.invalidArgument",
		exitCode: 1
	});
}
function clickSuccessMessage(message) {
	return ({ url }) => `${message}${typeof url === "string" && url ? ` on ${url}` : ""}`;
}
function registerBrowserElementCommands(browser, parentOpts) {
	const parseRequiredNumber = (value, label) => {
		const trimmed = value.trim();
		const parsed = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(trimmed) ? Number(trimmed) : NaN;
		if (!Number.isFinite(parsed)) throw new Error(`Invalid ${label}: must be a finite number`);
		return parsed;
	};
	const runElementAction = async (params) => {
		const parent = parentOpts(params.cmd);
		await runBrowserCliCommand(async () => {
			await runBrowserAction({
				parent,
				body: params.body,
				successMessage: params.successMessage
			});
		});
	};
	browser.command("click").description("Click an element by ref from snapshot").argument("<ref>", "Ref id from snapshot").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).option("--double", "Double click", false).option("--button <left|right|middle>", "Mouse button to use", parseBrowserMouseButtonOption).option("--modifiers <list>", "Comma-separated modifiers (Shift,Alt,Meta)").action(async (ref, opts, cmd) => {
		const refValue = requireRef(ref);
		const modifiers = opts.modifiers ? String(opts.modifiers).split(",").map((v) => v.trim()).filter(Boolean) : void 0;
		await runElementAction({
			cmd,
			body: {
				kind: "click",
				ref: refValue,
				targetId: normalizeOptionalString(opts.targetId),
				doubleClick: Boolean(opts.double),
				button: normalizeOptionalString(opts.button),
				modifiers
			},
			successMessage: clickSuccessMessage(`clicked ref ${refValue}`)
		});
	});
	browser.command("click-coords").description("Click viewport coordinates").argument("<x>", "Viewport x coordinate").argument("<y>", "Viewport y coordinate").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).option("--double", "Double click", false).option("--button <left|right|middle>", "Mouse button to use", parseBrowserMouseButtonOption).option("--delay-ms <ms>", "Delay between mouse down/up", (v) => parseBrowserNonNegativeIntegerOption(v, "--delay-ms")).action(async (xRaw, yRaw, opts, cmd) => {
		const x = parseRequiredNumber(xRaw, "x");
		const y = parseRequiredNumber(yRaw, "y");
		await runElementAction({
			cmd,
			body: {
				kind: "clickCoords",
				x,
				y,
				targetId: normalizeOptionalString(opts.targetId),
				doubleClick: Boolean(opts.double),
				button: normalizeOptionalString(opts.button),
				delayMs: opts.delayMs
			},
			successMessage: clickSuccessMessage(`clicked ${x},${y}`)
		});
	});
	browser.command("type").description("Type into an element by ref from snapshot").argument("<ref>", "Ref id from snapshot").argument("<text>", "Text to type").option("--submit", "Press Enter after typing", false).option("--slowly", "Type slowly (human-like)", false).option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (ref, text, opts, cmd) => {
		const refValue = requireRef(ref);
		await runElementAction({
			cmd,
			body: {
				kind: "type",
				ref: refValue,
				text,
				submit: Boolean(opts.submit),
				slowly: Boolean(opts.slowly),
				targetId: normalizeOptionalString(opts.targetId)
			},
			successMessage: `typed into ref ${refValue}`
		});
	});
	for (const [kind, description, argument, argumentHelp, message] of [[
		"press",
		"Press a key",
		"key",
		"Key to press (e.g. Enter)",
		"pressed"
	], [
		"hover",
		"Hover an element by ai ref",
		"ref",
		"Ref id from snapshot",
		"hovered ref"
	]]) browser.command(kind).description(description).argument(`<${argument}>`, argumentHelp).option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (value, opts, cmd) => {
		await runElementAction({
			cmd,
			body: {
				...kind === "press" ? {
					kind,
					key: value
				} : {
					kind,
					ref: value
				},
				targetId: normalizeOptionalString(opts.targetId)
			},
			successMessage: `${message} ${value}`
		});
	});
	browser.command("scrollintoview").description("Scroll an element into view by ref from snapshot").argument("<ref>", "Ref id from snapshot").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).option("--timeout-ms <ms>", "How long to wait for scroll (default: 20000)", (v) => parseBrowserPositiveIntegerOption(v, "--timeout-ms")).action(async (ref, opts, cmd) => {
		const refValue = requireRef(ref);
		await runElementAction({
			cmd,
			body: {
				kind: "scrollIntoView",
				ref: refValue,
				targetId: normalizeOptionalString(opts.targetId),
				timeoutMs: opts.timeoutMs
			},
			successMessage: `scrolled into view: ${refValue}`
		});
	});
	browser.command("drag").description("Drag from one ref to another").argument("<startRef>", "Start ref id").argument("<endRef>", "End ref id").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (startRef, endRef, opts, cmd) => {
		await runElementAction({
			cmd,
			body: {
				kind: "drag",
				startRef,
				endRef,
				targetId: normalizeOptionalString(opts.targetId)
			},
			successMessage: `dragged ${startRef} → ${endRef}`
		});
	});
	browser.command("select").description("Select option(s) in a select element").argument("<ref>", "Ref id from snapshot").argument("<values...>", "Option values to select").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (ref, values, opts, cmd) => {
		await runElementAction({
			cmd,
			body: {
				kind: "select",
				ref,
				values,
				targetId: normalizeOptionalString(opts.targetId)
			},
			successMessage: `selected ${values.join(", ")}`
		});
	});
}
//#endregion
//#region extensions/browser/src/cli/browser-cli-actions-input/register.files-downloads.ts
const DEFAULT_BROWSER_HOOK_TIMEOUT_MS = 12e4;
function registerBrowserFilesAndDownloadsCommands(browser, parentOpts) {
	const runHook = async (parent, opts, request) => {
		const timeoutMs = Number.isFinite(opts.timeoutMs) ? Number(opts.timeoutMs) : void 0;
		await runBrowserCliRequest({
			...request,
			parent,
			body: {
				...request.body,
				targetId: normalizeOptionalString(opts.targetId),
				timeoutMs
			},
			timeoutMs: withBrowserActionTimeoutSlack(timeoutMs ?? DEFAULT_BROWSER_HOOK_TIMEOUT_MS),
			errorPolicy: "inline"
		});
	};
	browser.command("upload").description("Arm file upload for the next file chooser").argument("<paths...>", "File paths to upload from OpenClaw temp uploads or managed inbound media (e.g. /tmp/openclaw/uploads/file.pdf or media://inbound/<id>)").option("--ref <ref>", "Ref id from snapshot to click after arming").option("--input-ref <ref>", "Ref id for <input type=file> to set directly").option("--element <selector>", "CSS selector for <input type=file>").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).option("--timeout-ms <ms>", "How long to wait for the next file chooser (default: 120000)", (v) => parseBrowserPositiveIntegerOption(v, "--timeout-ms")).action(async (paths, opts, cmd) => {
		await runBrowserCliCommand(async () => {
			const parent = parentOpts(cmd);
			const resolved = await resolveExistingUploadPaths({ requestedPaths: paths });
			if (!resolved.ok) throw new Error(resolved.error);
			await runHook(parent, opts, {
				path: "/hooks/file-chooser",
				body: {
					paths: resolved.paths,
					ref: normalizeOptionalString(opts.ref),
					inputRef: normalizeOptionalString(opts.inputRef),
					element: normalizeOptionalString(opts.element)
				},
				successMessage: `upload armed for ${paths.length} file(s)`
			});
		}, "inline");
	});
	browser.command("waitfordownload").description("Wait for the next download (and save it)").argument("[path]", "Save path within openclaw temp downloads dir (default: /tmp/openclaw/downloads/...; fallback: os.tmpdir()/openclaw/downloads/...)").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).option("--timeout-ms <ms>", "How long to wait for the next download (default: 120000)", (v) => parseBrowserPositiveIntegerOption(v, "--timeout-ms")).action(async (outPath, opts, cmd) => {
		await runHook(parentOpts(cmd), opts, {
			path: "/wait/download",
			body: { path: normalizeOptionalString(outPath) },
			successMessage: (result) => `downloaded: ${shortenHomePath(result.download.path)}`
		});
	});
	browser.command("download").description("Click a ref and save the resulting download").argument("<ref>", "Ref id from snapshot to click").argument("<path>", "Save path within openclaw temp downloads dir (e.g. report.pdf or /tmp/openclaw/downloads/report.pdf)").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).option("--timeout-ms <ms>", "How long to wait for the download to start (default: 120000)", (v) => parseBrowserPositiveIntegerOption(v, "--timeout-ms")).action(async (ref, outPath, opts, cmd) => {
		await runHook(parentOpts(cmd), opts, {
			path: "/download",
			body: {
				ref,
				path: outPath
			},
			successMessage: (result) => `downloaded: ${shortenHomePath(result.download.path)}`
		});
	});
	browser.command("dialog").description("Arm the next modal dialog (alert/confirm/prompt)").option("--accept", "Accept the dialog", false).option("--dismiss", "Dismiss the dialog", false).option("--prompt <text>", "Prompt response text").option("--dialog-id <id>", "Pending dialog id from snapshot/browser state").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).option("--timeout-ms <ms>", "How long to wait for the next dialog (default: 120000)", (v) => parseBrowserPositiveIntegerOption(v, "--timeout-ms")).action(async (opts, cmd) => {
		const parent = parentOpts(cmd);
		if (opts.accept && opts.dismiss) throw new Error("Specify only one of --accept or --dismiss");
		const accept = opts.accept ? true : opts.dismiss ? false : void 0;
		if (accept === void 0) throw new Error("Specify --accept or --dismiss");
		await runHook(parent, opts, {
			path: "/hooks/dialog",
			body: {
				accept,
				promptText: readStringValue(opts.prompt),
				dialogId: normalizeOptionalString(opts.dialogId)
			},
			successMessage: "dialog armed"
		});
	});
}
//#endregion
//#region extensions/browser/src/cli/browser-cli-actions-input/register.form-wait-eval.ts
function parseBrowserWaitLoadState(value) {
	const load = normalizeOptionalString(value);
	switch (load) {
		case void 0: return;
		case "load":
		case "domcontentloaded":
		case "networkidle": return load;
		default: throw new Error(`Invalid --load value: ${load}`);
	}
}
function registerBrowserFormWaitEvalCommands(browser, parentOpts) {
	browser.command("fill").description("Fill a form with JSON field descriptors").option("--fields <json>", "JSON array of field objects").option("--fields-file <path>", "Read JSON array from a file").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, cmd) => {
		const parent = parentOpts(cmd);
		await runBrowserCliCommand(async () => {
			const fields = await readFields({
				fields: opts.fields,
				fieldsFile: opts.fieldsFile
			});
			await runBrowserAction({
				parent,
				body: {
					kind: "fill",
					fields,
					targetId: normalizeOptionalString(opts.targetId)
				},
				successMessage: `filled ${fields.length} field(s)`
			});
		});
	});
	browser.command("wait").description("Wait for time, selector, URL, load state, or JS conditions").argument("[selector]", "CSS selector to wait for (visible)").option("--time <ms>", "Wait for N milliseconds", (v) => parseBrowserNonNegativeIntegerOption(v, "--time")).option("--text <value>", "Wait for text to appear").option("--text-gone <value>", "Wait for text to disappear").option("--url <pattern>", "Wait for URL (supports globs like **/dash)").option("--load <load|domcontentloaded|networkidle>", "Wait for load state").option("--fn <js>", "Wait for JS condition (passed to waitForFunction)").option("--timeout-ms <ms>", "How long to wait for each condition (default: 20000)", (v) => parseBrowserPositiveIntegerOption(v, "--timeout-ms")).option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (selector, opts, cmd) => {
		const parent = parentOpts(cmd);
		await runBrowserCliCommand(async () => {
			const load = parseBrowserWaitLoadState(opts.load);
			await runBrowserAction({
				parent,
				body: {
					kind: "wait",
					timeMs: opts.time,
					text: normalizeOptionalString(opts.text),
					textGone: normalizeOptionalString(opts.textGone),
					selector: normalizeOptionalString(selector),
					url: normalizeOptionalString(opts.url),
					loadState: load,
					fn: normalizeOptionalString(opts.fn),
					targetId: normalizeOptionalString(opts.targetId),
					timeoutMs: opts.timeoutMs
				},
				successMessage: "wait complete"
			});
		});
	});
	browser.command("evaluate").description("Evaluate JavaScript against the page or a ref").option("--fn <code>", "Function source, expression, or statement body, e.g. const text = el.textContent; return text;").option("--ref <id>", "Ref from snapshot").option("--timeout-ms <ms>", "How long to allow the evaluate function to run (default: 20000)", (v) => parseBrowserPositiveIntegerOption(v, "--timeout-ms")).option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (opts, cmd) => {
		const parent = parentOpts(cmd);
		if (!opts.fn) throw new Error("Missing --fn");
		await runBrowserCliCommand(async () => {
			await runBrowserAction({
				parent,
				body: {
					kind: "evaluate",
					fn: opts.fn,
					ref: normalizeOptionalString(opts.ref),
					targetId: normalizeOptionalString(opts.targetId),
					timeoutMs: opts.timeoutMs
				}
			});
		});
	});
}
//#endregion
//#region extensions/browser/src/cli/browser-cli-actions-input/register.navigation.ts
function registerBrowserNavigationCommands(browser, parentOpts) {
	browser.command("navigate").description("Navigate the current tab to a URL").argument("<url>", "URL to navigate to").option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP).action(async (url, opts, cmd) => {
		await runBrowserCliRequest({
			parent: parentOpts(cmd),
			path: "/navigate",
			body: {
				url,
				targetId: normalizeOptionalString(opts.targetId)
			},
			errorPolicy: "inline",
			successMessage: (result) => `navigated to ${result.url ?? url}`
		});
	});
	registerBrowserResizeCommand(browser.command("resize").description("Resize the viewport"), parentOpts);
}
//#endregion
//#region extensions/browser/src/cli/browser-cli-actions-input/register.ts
function registerBrowserActionInputCommands(browser, parentOpts) {
	registerBrowserNavigationCommands(browser, parentOpts);
	registerBrowserElementCommands(browser, parentOpts);
	registerBrowserFilesAndDownloadsCommands(browser, parentOpts);
	registerBrowserFormWaitEvalCommands(browser, parentOpts);
	registerBrowserBatchCommands(browser, parentOpts);
}
//#endregion
export { registerBrowserActionInputCommands };
