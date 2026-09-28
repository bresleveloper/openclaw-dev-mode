import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { a as optionalNonNegativeIntegerSchema, c as stringEnum, i as optionalFiniteNumberSchema, o as optionalPositiveIntegerSchema, s as optionalStringEnum } from "./typebox-DIBvVmm8.mjs";
import "./channel-actions-BjxmEiuN.mjs";
import { n as ACT_MAX_VIEWPORT_DIMENSION } from "./act-policy-3Ku82pq-.mjs";
import { Type } from "typebox";
//#region extensions/browser/src/browser-node-commands.ts
const BROWSER_PROXY_COMMAND = "browser.proxy";
const BROWSER_PROXY_UPLOAD_COMMAND = "browser.proxy.upload.v1";
function browserProxyUploadUnavailableMessage(pendingDeclaredCommands) {
	return pendingDeclaredCommands?.includes("browser.proxy.upload.v1") ? "browser node remote upload transfer is pending approval; approve the node's pending command update before retrying" : "browser node does not support remote upload transfer; update the node or approve its pending command update before retrying";
}
//#endregion
//#region extensions/browser/src/browser-tool-binding.ts
/** Validate the plugin-owned run binding before any browser route is resolved. */
function parseBrowserTabToolBinding(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {
		ok: false,
		error: "browser tool binding must be an object"
	};
	const record = value;
	const target = record.target === "host" || record.target === "node" ? record.target : void 0;
	const node = normalizeOptionalString(record.node);
	const profile = normalizeOptionalString(record.profile);
	const targetId = normalizeOptionalString(record.targetId);
	if (record.kind !== "tab") return {
		ok: false,
		error: "browser tool binding kind must be \"tab\""
	};
	if (!Number.isSafeInteger(record.tabId) || Number(record.tabId) < 0) return {
		ok: false,
		error: "browser tool binding tabId must be a non-negative integer"
	};
	if (!target || !profile || !targetId || target === "node" && !node) return {
		ok: false,
		error: "browser tool binding requires target, profile, and targetId"
	};
	if (target === "host" && node) return {
		ok: false,
		error: "browser host binding cannot include node"
	};
	return {
		ok: true,
		binding: {
			kind: "tab",
			tabId: Number(record.tabId),
			target,
			...node ? { node } : {},
			profile,
			targetId
		}
	};
}
const BROWSER_TAB_BOUND_ACTIONS = [
	"act",
	"close",
	"console",
	"requests",
	"errors",
	"text",
	"emulate",
	"dialog",
	"download",
	"focus",
	"navigate",
	"pdf",
	"screenshot",
	"snapshot",
	"tabs",
	"upload",
	"waitfordownload"
];
function bindTargetId(record, targetId) {
	const requestedTargetId = normalizeOptionalString(record.targetId);
	if (requestedTargetId && requestedTargetId !== targetId) throw new Error("browser action cannot override its run-bound tab target");
	const actions = Array.isArray(record.actions) ? record.actions.map((action) => action && typeof action === "object" && !Array.isArray(action) ? bindTargetId(action, targetId) : action) : record.actions;
	return {
		...record,
		targetId,
		...actions ? { actions } : {}
	};
}
/** Pin model-supplied browser arguments to the trusted tab route for this run. */
function applyBrowserTabToolBinding(input, binding) {
	const requestedTarget = normalizeOptionalString(input.target);
	const requestedNode = normalizeOptionalString(input.node);
	const requestedProfile = normalizeOptionalString(input.profile);
	if (requestedTarget && requestedTarget !== binding.target) throw new Error("browser action cannot override its run-bound target");
	if (requestedNode && requestedNode !== binding.node) throw new Error("browser action cannot override its run-bound node");
	if (requestedProfile && requestedProfile !== binding.profile) throw new Error("browser action cannot override its run-bound profile");
	const bound = bindTargetId(input, binding.targetId);
	const request = bound.request && typeof bound.request === "object" && !Array.isArray(bound.request) ? bindTargetId(bound.request, binding.targetId) : bound.request;
	return {
		...bound,
		target: binding.target,
		...binding.node ? { node: binding.node } : {},
		profile: binding.profile,
		...request ? { request } : {}
	};
}
//#endregion
//#region extensions/browser/src/browser-tool-description.ts
/** Build the Browser tool guidance shared by lazy registration and runtime execution. */
function describeBrowserTool(opts) {
	const actions = new Set(opts.capabilities.actions);
	const evaluateEnabled = opts.capabilities.actKinds.includes("evaluate");
	return [
		`Control the browser via OpenClaw's browser control server. Available actions: ${opts.capabilities.actions.join(", ")}.`,
		...actions.has("profiles") ? ["Browser choice: omit profile to use the configured default (normally the isolated OpenClaw-managed `openclaw` browser).", "When existing logins/cookies matter, use action=profiles to inspect available profiles, then select the appropriate profile by name. Do not assume a profile name. Use only when the task requires an existing session and the user has authorized it."] : [],
		...actions.has("importprofile") ? ["Use action=importprofile on macOS to copy cookies from an authorized Chrome-family system profile into a fresh managed profile; this may show a Keychain consent prompt."] : [],
		`For Chrome MCP existing-session profiles, omit timeoutMs on act:type, hover, scrollIntoView, drag, select, and fill; that driver rejects per-call timeout overrides for those actions.${evaluateEnabled ? " act:evaluate supports timeoutMs." : ""}`,
		...!opts.capabilities.tabBound ? ["Prefer the host browser; auto-route to a connected browser node only when the host has no usable browser capability. Select another location with target=\"node\" or node=<id|name>; configured node pins also take precedence."] : [],
		"When using refs from snapshot (e.g. e12), keep the same tab: prefer passing targetId from the snapshot response into subsequent actions (act/click/type/etc). For tab operations, targetId also accepts tabId handles (t1) and labels from action=tabs.",
		"For multi-step browser work, login checks, stale refs, duplicate tabs, or Google Meet flows, use the bundled browser-automation skill when it is available.",
		...!opts.capabilities.tabBound ? ["Only create a Browser dashboard when the user asks for a dashboard. Opening the browser sidebar or side panel does not require a widget. For a requested agent-controllable HTTP(S) dashboard, first call tool dashboard with action=\"widget_put\", pluginKind=\"browser:dashboard\", name=<stable widget name>, props={url}, and size=\"full\". Next call tool browser with action=\"open\", dashboard=<that widget name>, and no targetUrl. Then call tool dashboard with action=\"set_presentation\", presentation=\"expanded\". The dashboard tool owns widget authoring and presentation; the browser tool owns page interaction. The widget uses the local managed openclaw profile by default. For snapshot, navigate, act, and other tab actions, call tool browser with dashboard=<widget name>; omit targetId and route overrides. This operates the same page the user sees and preserves it while hidden and through ordinary cleanup. Call browser with action=\"close\" and dashboard to request stop, or action=\"open\" and dashboard to resume its saved URL. A session:website widget is a lightweight iframe and cannot be controlled through this selector."] : [],
		"For stable, self-resolving refs across calls, use snapshot with refs=\"aria\" (Playwright aria-ref ids). Default refs=\"role\" are role+name-based.",
		"Repeated compatible snapshots with stable document identity mark newly appeared ref-bearing elements with [new].",
		`navigate returns the loaded page's compact snapshot inline (efficient interactive tier; use action=snapshot for a full snapshot); do not call snapshot after navigate.${opts.capabilities.actKinds.includes("batch") ? " Batch act results that report a cross-document navigation also include fresh page state;" : ""} After a single act that triggers navigation, snapshot before using refs.`,
		"Use snapshot+act for UI automation. Avoid act:wait by default; use only in exceptional cases when no reliable UI state exists.",
		actions.has("text") ? "For page prose, use action=text with optional selector and maxChars; it reads the first selector match, else article, main, or body. Use efficient snapshots for controls; they omit most prose." : `For page text, use snapshot${evaluateEnabled ? " or a bounded act:evaluate" : ""}; efficient snapshots omit most prose.`,
		"Use snapshot query to keep lines matching all whitespace-separated tokens, case-insensitively; matching lines retain element refs.",
		...actions.has("requests") ? ["Use requests for the recent network log; filter matches URL/type, limit defaults to 50, and clear=true clears the collected log after reading."] : [],
		...actions.has("errors") ? ["Use errors for page errors; limit defaults to 50, clear=true clears after reading."] : [],
		...actions.has("emulate") ? ["Use emulate with device, colorScheme, timezoneId, or locale; at least one setting is required."] : [],
		...actions.has("upload") ? ["For file chooser uploads, pass the trigger ref with paths in the same upload call when available; use paths-only arming only when a later trigger is intentional. Use inputRef or element to set a file input directly."] : [],
		...!opts.capabilities.tabBound ? [`target selects browser location (sandbox|host|node). Default: ${opts.targetDefault}.`, opts.hostHint] : []
	].join(" ");
}
//#endregion
//#region extensions/browser/src/browser-tool.schema.ts
/**
* JSON schema for the Browser agent tool.
*
* The schema stays intentionally flat because provider function-tool validators
* reject several nested union shapes that TypeBox can otherwise emit.
*/
const BROWSER_ACT_KINDS = [
	"batch",
	"click",
	"clickCoords",
	"type",
	"press",
	"hover",
	"scrollIntoView",
	"drag",
	"select",
	"fill",
	"resize",
	"wait",
	"evaluate",
	"close"
];
const BROWSER_TOOL_ACTIONS = [
	"doctor",
	"status",
	"start",
	"stop",
	"profiles",
	"importprofile",
	"tabs",
	"open",
	"focus",
	"close",
	"snapshot",
	"screenshot",
	"navigate",
	"console",
	"requests",
	"errors",
	"text",
	"emulate",
	"pdf",
	"download",
	"waitfordownload",
	"upload",
	"dialog",
	"act"
];
const BROWSER_TARGETS = [
	"sandbox",
	"host",
	"node"
];
const BROWSER_SNAPSHOT_FORMATS = ["aria", "ai"];
const BROWSER_SNAPSHOT_MODES = ["efficient"];
const BROWSER_SNAPSHOT_REFS = ["role", "aria"];
const BROWSER_IMAGE_TYPES = ["png", "jpeg"];
const TAB_REFERENCE_DESCRIPTION = "Prefer suggestedTargetId/tabId/label; raw CDP targetId.";
function resolveBrowserToolCapabilities(params) {
	const evaluateEnabled = params?.evaluateEnabled !== false;
	const profileCapabilities = params?.profileCapabilities;
	return {
		actions: (params?.tabBound ? BROWSER_TAB_BOUND_ACTIONS : BROWSER_TOOL_ACTIONS).filter((action) => (profileCapabilities?.supportsPdf !== false || action !== "pdf") && (profileCapabilities?.supportsRequests !== false || action !== "requests") && (profileCapabilities?.supportsErrors !== false || action !== "errors") && (profileCapabilities?.supportsPageText !== false || action !== "text") && (profileCapabilities?.supportsEmulation !== false || action !== "emulate") && (profileCapabilities?.supportsDownloads !== false || action !== "download" && action !== "waitfordownload")),
		actKinds: BROWSER_ACT_KINDS.filter((kind) => (evaluateEnabled || kind !== "evaluate") && (profileCapabilities?.supportsBatchActions !== false || kind !== "batch")),
		tabBound: params?.tabBound === true
	};
}
function createBrowserActProperties(capabilities) {
	const supportsBatch = capabilities.actKinds.includes("batch");
	return {
		targetId: Type.Optional(Type.String({ description: TAB_REFERENCE_DESCRIPTION })),
		ref: Type.Optional(Type.String({ description: "snapshot ref." })),
		actions: Type.Optional(Type.Array(Type.Object({}, { additionalProperties: true }), supportsBatch ? { description: "batch actions." } : {})),
		stopOnError: Type.Optional(Type.Boolean(supportsBatch ? { description: "Stop on error; default true." } : {})),
		doubleClick: Type.Optional(Type.Boolean({ description: "Double-click/clickCoords." })),
		button: Type.Optional(Type.String()),
		modifiers: Type.Optional(Type.Array(Type.String())),
		x: optionalFiniteNumberSchema(),
		y: optionalFiniteNumberSchema(),
		text: Type.Optional(Type.String()),
		submit: Type.Optional(Type.Boolean()),
		slowly: Type.Optional(Type.Boolean()),
		key: Type.Optional(Type.String({ description: "Escape, Enter, Control+Shift+T; aliases Esc, Return, Del, Ctrl, Cmd." })),
		delayMs: optionalNonNegativeIntegerSchema(),
		startRef: Type.Optional(Type.String()),
		endRef: Type.Optional(Type.String()),
		values: Type.Optional(Type.Array(Type.String())),
		fields: Type.Optional(Type.Array(Type.Object({}, { additionalProperties: true }))),
		width: optionalPositiveIntegerSchema({ maximum: ACT_MAX_VIEWPORT_DIMENSION }),
		height: optionalPositiveIntegerSchema({ maximum: ACT_MAX_VIEWPORT_DIMENSION }),
		timeMs: optionalNonNegativeIntegerSchema(),
		selector: Type.Optional(Type.String()),
		url: Type.Optional(Type.String()),
		loadState: Type.Optional(Type.String()),
		textGone: Type.Optional(Type.String()),
		timeoutMs: optionalPositiveIntegerSchema(),
		...capabilities.actKinds.includes("evaluate") ? { fn: Type.Optional(Type.String()) } : {}
	};
}
/** Provider-compatible Browser tool argument schema. */
function createBrowserToolSchema(capabilities) {
	const actProperties = createBrowserActProperties(capabilities);
	const actKindDescription = capabilities.actKinds.includes("batch") ? "batch uses actions." : "Act kind.";
	const BrowserActSchema = Type.Object({
		kind: stringEnum(capabilities.actKinds, { description: actKindDescription }),
		...actProperties
	}, { description: "act" });
	return Type.Object({
		action: stringEnum(capabilities.actions),
		target: optionalStringEnum(BROWSER_TARGETS),
		...!capabilities.tabBound ? { dashboard: Type.Optional(Type.String({
			pattern: "^[a-z0-9][a-z0-9._-]{0,63}$",
			description: "browser:dashboard widget name."
		})) } : {},
		node: Type.Optional(Type.String()),
		profile: Type.Optional(Type.String({ description: capabilities.tabBound ? "Run-bound browser profile." : "default if omitted." })),
		browser: Type.Optional(Type.String()),
		systemProfile: Type.Optional(Type.String()),
		into: Type.Optional(Type.String()),
		domains: Type.Optional(Type.Array(Type.String())),
		targetUrl: Type.Optional(Type.String()),
		label: Type.Optional(Type.String()),
		limit: optionalPositiveIntegerSchema(),
		maxChars: optionalNonNegativeIntegerSchema(),
		mode: optionalStringEnum(BROWSER_SNAPSHOT_MODES),
		snapshotFormat: optionalStringEnum(BROWSER_SNAPSHOT_FORMATS),
		refs: optionalStringEnum(BROWSER_SNAPSHOT_REFS),
		interactive: Type.Optional(Type.Boolean()),
		compact: Type.Optional(Type.Boolean()),
		depth: optionalNonNegativeIntegerSchema(),
		frame: Type.Optional(Type.String()),
		labels: Type.Optional(Type.Boolean({ description: "Label snapshot/screenshot." })),
		urls: Type.Optional(Type.Boolean()),
		fullPage: Type.Optional(Type.Boolean()),
		path: Type.Optional(Type.String()),
		element: Type.Optional(Type.String()),
		type: optionalStringEnum(BROWSER_IMAGE_TYPES),
		level: Type.Optional(Type.String()),
		filter: Type.Optional(Type.String()),
		clear: Type.Optional(Type.Boolean()),
		query: Type.Optional(Type.String()),
		device: Type.Optional(Type.String()),
		colorScheme: optionalStringEnum([
			"dark",
			"light",
			"no-preference",
			"none"
		]),
		timezoneId: Type.Optional(Type.String()),
		locale: Type.Optional(Type.String()),
		paths: Type.Optional(Type.Array(Type.String())),
		inputRef: Type.Optional(Type.String()),
		dialogId: Type.Optional(Type.String()),
		accept: Type.Optional(Type.Boolean()),
		promptText: Type.Optional(Type.String()),
		kind: Type.Optional(stringEnum(capabilities.actKinds, { description: actKindDescription })),
		...actProperties,
		request: Type.Optional(BrowserActSchema)
	});
}
const BrowserSnapshotStatsSchema = Type.Object({
	lines: Type.Number(),
	chars: Type.Number(),
	refs: Type.Number(),
	interactive: Type.Number()
}, { additionalProperties: false });
const BrowserBatchAbortSchema = Type.Object({
	reason: stringEnum(["navigation", "closed"]),
	afterAction: Type.Number(),
	url: Type.String(),
	skipped: Type.Number()
}, { additionalProperties: false });
/** Common structured result fields returned across Browser tool actions. */
const BrowserToolOutputSchema = Type.Object({
	ok: Type.Optional(Type.Boolean()),
	targetId: Type.Optional(Type.String()),
	url: Type.Optional(Type.String()),
	format: Type.Optional(stringEnum(BROWSER_SNAPSHOT_FORMATS)),
	snapshot: Type.Optional(Type.String()),
	refs: Type.Optional(Type.Union([Type.Number(), Type.Record(Type.String(), Type.Unknown())])),
	stats: Type.Optional(BrowserSnapshotStatsSchema),
	truncated: Type.Optional(Type.Boolean()),
	newElements: Type.Optional(Type.Number()),
	tabs: Type.Optional(Type.Array(Type.Object({
		suggestedTargetId: Type.Optional(Type.String()),
		tabId: Type.Optional(Type.String()),
		webExtensionTabId: Type.Optional(Type.Integer({ minimum: 0 })),
		label: Type.Optional(Type.String()),
		targetId: Type.Optional(Type.String()),
		title: Type.Optional(Type.String()),
		url: Type.Optional(Type.String()),
		urlUnavailableReason: optionalStringEnum(["navigation_blocked", "navigation_check_failed"]),
		type: Type.Optional(Type.String())
	}, { additionalProperties: true }))),
	tabCount: Type.Optional(Type.Number()),
	results: Type.Optional(Type.Array(Type.Object({
		ok: Type.Boolean(),
		error: Type.Optional(Type.String()),
		navigated: Type.Optional(Type.Literal(true)),
		url: Type.Optional(Type.String())
	}, { additionalProperties: false }))),
	aborted: Type.Optional(BrowserBatchAbortSchema),
	pageState: Type.Optional(Type.Object({}, {
		additionalProperties: true,
		description: "Inline snapshot details attached when the action changed the page document."
	})),
	enabled: Type.Optional(Type.Boolean()),
	running: Type.Optional(Type.Boolean()),
	profile: Type.Optional(Type.String()),
	driver: Type.Optional(Type.String()),
	transport: Type.Optional(Type.String()),
	pid: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
	cdpPort: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
	cdpUrl: Type.Optional(Type.Union([Type.String(), Type.Null()]))
}, { additionalProperties: true });
//#endregion
export { applyBrowserTabToolBinding as a, BROWSER_PROXY_UPLOAD_COMMAND as c, describeBrowserTool as i, browserProxyUploadUnavailableMessage as l, createBrowserToolSchema as n, parseBrowserTabToolBinding as o, resolveBrowserToolCapabilities as r, BROWSER_PROXY_COMMAND as s, BrowserToolOutputSchema as t };
