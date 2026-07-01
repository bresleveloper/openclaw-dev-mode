import { a as optionalPositiveIntegerSchema, i as optionalNonNegativeIntegerSchema, o as optionalStringEnum, r as optionalFiniteNumberSchema, s as stringEnum } from "./typebox-DK0GFdj5.js";
import "./channel-actions-CdLhqkfP.js";
import { n as ACT_MAX_VIEWPORT_DIMENSION } from "./act-policy-ChvnirnB.js";
import { Type } from "typebox";
//#region extensions/browser/src/browser-tool.schema.ts
/**
* JSON schema for the Browser agent tool.
*
* The schema stays intentionally flat because provider function-tool validators
* reject several nested union shapes that TypeBox can otherwise emit.
*/
const BROWSER_ACT_KINDS = [
	"click",
	"clickCoords",
	"type",
	"press",
	"hover",
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
	"tabs",
	"open",
	"focus",
	"close",
	"snapshot",
	"screenshot",
	"navigate",
	"console",
	"pdf",
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
const TAB_REFERENCE_DESCRIPTION = "Tab reference. Prefer suggestedTargetId, tabId, or label from tabs output; raw CDP targetId and unique raw prefixes remain supported for compatibility.";
const BrowserActSchema = Type.Object({
	kind: stringEnum(BROWSER_ACT_KINDS),
	targetId: Type.Optional(Type.String({ description: TAB_REFERENCE_DESCRIPTION })),
	ref: Type.Optional(Type.String()),
	doubleClick: Type.Optional(Type.Boolean()),
	button: Type.Optional(Type.String()),
	modifiers: Type.Optional(Type.Array(Type.String())),
	x: optionalFiniteNumberSchema(),
	y: optionalFiniteNumberSchema(),
	text: Type.Optional(Type.String()),
	submit: Type.Optional(Type.Boolean()),
	slowly: Type.Optional(Type.Boolean()),
	key: Type.Optional(Type.String()),
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
	fn: Type.Optional(Type.String())
});
/** Provider-compatible Browser tool argument schema. */
const BrowserToolSchema = Type.Object({
	action: stringEnum(BROWSER_TOOL_ACTIONS),
	target: optionalStringEnum(BROWSER_TARGETS),
	node: Type.Optional(Type.String()),
	profile: Type.Optional(Type.String()),
	targetUrl: Type.Optional(Type.String()),
	url: Type.Optional(Type.String()),
	targetId: Type.Optional(Type.String({ description: TAB_REFERENCE_DESCRIPTION })),
	label: Type.Optional(Type.String()),
	limit: optionalPositiveIntegerSchema(),
	maxChars: optionalNonNegativeIntegerSchema(),
	mode: optionalStringEnum(BROWSER_SNAPSHOT_MODES),
	snapshotFormat: optionalStringEnum(BROWSER_SNAPSHOT_FORMATS),
	refs: optionalStringEnum(BROWSER_SNAPSHOT_REFS),
	interactive: Type.Optional(Type.Boolean()),
	compact: Type.Optional(Type.Boolean()),
	depth: optionalNonNegativeIntegerSchema(),
	selector: Type.Optional(Type.String()),
	frame: Type.Optional(Type.String()),
	labels: Type.Optional(Type.Boolean()),
	urls: Type.Optional(Type.Boolean()),
	fullPage: Type.Optional(Type.Boolean()),
	ref: Type.Optional(Type.String()),
	element: Type.Optional(Type.String()),
	type: optionalStringEnum(BROWSER_IMAGE_TYPES),
	level: Type.Optional(Type.String()),
	paths: Type.Optional(Type.Array(Type.String())),
	inputRef: Type.Optional(Type.String()),
	timeoutMs: optionalPositiveIntegerSchema(),
	dialogId: Type.Optional(Type.String()),
	accept: Type.Optional(Type.Boolean()),
	promptText: Type.Optional(Type.String()),
	kind: Type.Optional(stringEnum(BROWSER_ACT_KINDS)),
	doubleClick: Type.Optional(Type.Boolean()),
	button: Type.Optional(Type.String()),
	modifiers: Type.Optional(Type.Array(Type.String())),
	x: optionalFiniteNumberSchema(),
	y: optionalFiniteNumberSchema(),
	text: Type.Optional(Type.String()),
	submit: Type.Optional(Type.Boolean()),
	slowly: Type.Optional(Type.Boolean()),
	key: Type.Optional(Type.String()),
	delayMs: optionalNonNegativeIntegerSchema(),
	startRef: Type.Optional(Type.String()),
	endRef: Type.Optional(Type.String()),
	values: Type.Optional(Type.Array(Type.String())),
	fields: Type.Optional(Type.Array(Type.Object({}, { additionalProperties: true }))),
	width: optionalPositiveIntegerSchema({ maximum: ACT_MAX_VIEWPORT_DIMENSION }),
	height: optionalPositiveIntegerSchema({ maximum: ACT_MAX_VIEWPORT_DIMENSION }),
	timeMs: optionalNonNegativeIntegerSchema(),
	textGone: Type.Optional(Type.String()),
	loadState: Type.Optional(Type.String()),
	fn: Type.Optional(Type.String()),
	request: Type.Optional(BrowserActSchema)
});
//#endregion
export { BrowserToolSchema as t };
