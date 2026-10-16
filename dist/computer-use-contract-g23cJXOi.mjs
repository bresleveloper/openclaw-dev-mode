import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { t as lazyCompile } from "./protocol-validator-BeXu4Ype.mjs";
import { Type } from "typebox";
import { Compile } from "typebox/compile";
//#region src/plugins/computer-use-contract.ts
const COMPUTER_EXECUTION_ID_PATTERN = "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$";
const COMPUTER_USE_V2_ACTION_NAMES = [
	"screenshot",
	"left_click",
	"right_click",
	"middle_click",
	"double_click",
	"triple_click",
	"mouse_move",
	"left_click_drag",
	"left_mouse_down",
	"left_mouse_up",
	"scroll",
	"type",
	"key",
	"hold_key",
	"wait",
	"list_apps",
	"list_windows",
	"get_accessibility_tree",
	"get_cursor_position",
	"get_window_state",
	"launch_app",
	"kill_app",
	"bring_to_front",
	"set_value",
	"zoom",
	"get_browser_state",
	"browser_prepare",
	"browser_navigate",
	"browser_click",
	"browser_type",
	"browser_dialog",
	"browser_set_input_files",
	"browser_download",
	"browser_pointer",
	"escalate_scope",
	"get_recording_state",
	"start_recording",
	"stop_recording",
	"replay_trajectory",
	"invoke_menu"
];
const COMPUTER_USE_V1_ACTION_NAMES = COMPUTER_USE_V2_ACTION_NAMES.slice(0, 15);
const COMPUTER_ACT_V1_ACTION_NAMES = COMPUTER_USE_V2_ACTION_NAMES.slice(1, 14);
const COMPUTER_CONTRACT_MISMATCH = "COMPUTER_CONTRACT_MISMATCH";
const COMPUTER_STALE_OBSERVATION = "COMPUTER_STALE_OBSERVATION";
const COMPUTER_SCROLL_DIRECTIONS = [
	"up",
	"down",
	"left",
	"right"
];
const DELIVERY_MODES = ["background", "foreground"];
const COMPUTER_ESCALATION_REASONS = [
	"ax_tree_pixel_mismatch",
	"background_delivery_failed",
	"foreground_ineffective",
	"no_window_target",
	"other"
];
const COMPUTER_RESOURCE_HANDLE_PATTERN = "^openclaw:computer-resource:v1:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$";
const optionalScreenFields = {
	screenIndex: Type.Optional(Type.Integer({ minimum: 0 })),
	refWidth: Type.Optional(Type.Integer({ minimum: 1 }))
};
const optionalReferenceFields = {
	windowRef: Type.Optional(Type.String({ minLength: 1 })),
	elementRef: Type.Optional(Type.String({ minLength: 1 })),
	observationId: Type.Optional(Type.String({ minLength: 1 })),
	deliveryMode: Type.Optional(Type.Enum(DELIVERY_MODES, { type: "string" }))
};
const optionalPointerFields = {
	displayFrameId: Type.Optional(Type.String()),
	x: Type.Optional(Type.Number({ minimum: 0 })),
	y: Type.Optional(Type.Number({ minimum: 0 }))
};
const browserTargetFields = {
	browserRef: Type.String({ minLength: 1 }),
	pageRef: Type.String({ minLength: 1 })
};
const observedBrowserTargetFields = {
	...browserTargetFields,
	observationId: Type.String({ minLength: 1 })
};
function actionObject(actions, properties) {
	return closedObject({
		action: Type.Enum(actions, { type: "string" }),
		executionId: Type.Optional(Type.String({ pattern: COMPUTER_EXECUTION_ID_PATTERN })),
		...properties
	});
}
const ComputerActV1ParamsSchema = Type.Union([
	actionObject([
		"left_click",
		"right_click",
		"middle_click",
		"double_click",
		"triple_click",
		"mouse_move"
	], {
		...optionalPointerFields,
		modifiers: Type.Optional(Type.String()),
		...optionalScreenFields,
		...optionalReferenceFields
	}),
	actionObject(["left_click_drag"], {
		...optionalPointerFields,
		fromX: Type.Optional(Type.Number({ minimum: 0 })),
		fromY: Type.Optional(Type.Number({ minimum: 0 })),
		durationMs: Type.Optional(Type.Integer({ minimum: 0 })),
		...optionalScreenFields,
		...optionalReferenceFields
	}),
	actionObject(["left_mouse_down", "left_mouse_up"], {
		...optionalPointerFields,
		modifiers: Type.Optional(Type.String()),
		...optionalScreenFields,
		...optionalReferenceFields
	}),
	actionObject(["scroll"], {
		...optionalPointerFields,
		modifiers: Type.Optional(Type.String()),
		scrollDirection: Type.Optional(Type.Enum(COMPUTER_SCROLL_DIRECTIONS, { type: "string" })),
		scrollAmount: Type.Optional(Type.Integer({ minimum: 1 })),
		...optionalScreenFields,
		...optionalReferenceFields
	}),
	actionObject(["type"], {
		text: Type.Optional(Type.String()),
		...optionalScreenFields,
		...optionalReferenceFields
	}),
	actionObject(["key"], {
		keys: Type.Optional(Type.String()),
		...optionalScreenFields,
		...optionalReferenceFields
	}),
	actionObject(["hold_key"], {
		keys: Type.Optional(Type.String()),
		durationMs: Type.Optional(Type.Integer({ minimum: 0 })),
		...optionalScreenFields,
		...optionalReferenceFields
	})
]);
/** Canonical inner payload accepted by the `computer.act` node command. */
const ComputerActParamsSchema = Type.Union([
	...ComputerActV1ParamsSchema.anyOf,
	actionObject([
		"list_apps",
		"list_windows",
		"get_cursor_position"
	], {}),
	actionObject(["get_accessibility_tree"], {
		windowRef: Type.Optional(Type.String({ minLength: 1 })),
		query: Type.Optional(Type.String()),
		depth: Type.Optional(Type.Integer({
			minimum: 0,
			maximum: 64
		})),
		maxElements: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: 2e3
		}))
	}),
	actionObject(["get_window_state"], {
		windowRef: Type.String({ minLength: 1 }),
		includeScreenshot: Type.Optional(Type.Boolean()),
		query: Type.Optional(Type.String()),
		depth: Type.Optional(Type.Integer({
			minimum: 0,
			maximum: 64
		})),
		maxElements: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: 2e3
		}))
	}),
	actionObject(["launch_app", "kill_app"], { app: Type.String({ minLength: 1 }) }),
	actionObject(["bring_to_front"], { windowRef: Type.String({ minLength: 1 }) }),
	actionObject(["set_value"], {
		windowRef: Type.String({ minLength: 1 }),
		elementRef: Type.String({ minLength: 1 }),
		observationId: Type.String({ minLength: 1 }),
		value: Type.String(),
		deliveryMode: Type.Optional(Type.Enum(DELIVERY_MODES, { type: "string" }))
	}),
	actionObject(["invoke_menu"], {
		windowRef: Type.String({ minLength: 1 }),
		path: Type.Array(Type.String({
			minLength: 1,
			maxLength: 200
		}), {
			minItems: 1,
			maxItems: 16
		}),
		deliveryMode: Type.Optional(Type.Enum(DELIVERY_MODES, { type: "string" }))
	}),
	actionObject(["zoom"], {
		windowRef: Type.String({ minLength: 1 }),
		observationId: Type.String({ minLength: 1 }),
		x1: Type.Number({ minimum: 0 }),
		y1: Type.Number({ minimum: 0 }),
		x2: Type.Number({ minimum: 0 }),
		y2: Type.Number({ minimum: 0 })
	}),
	actionObject(["get_browser_state"], { windowRef: Type.String({ minLength: 1 }) }),
	actionObject(["get_browser_state"], {
		...browserTargetFields,
		snapshotFormat: Type.Optional(Type.Enum(["dom_refs_v1", "semantic_v2"], { type: "string" })),
		elementRef: Type.Optional(Type.String({ minLength: 1 })),
		observationId: Type.Optional(Type.String({ minLength: 1 })),
		query: Type.Optional(Type.String()),
		continuation: Type.Optional(Type.String({ minLength: 1 })),
		includeScreenshot: Type.Optional(Type.Boolean())
	}),
	actionObject(["browser_prepare"], {
		windowRef: Type.String({ minLength: 1 }),
		profile: Type.Optional(Type.Enum(["isolated_new", "isolated_named"], { type: "string" })),
		profileName: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 64,
			pattern: "^[A-Za-z0-9._-]+$"
		}))
	}),
	actionObject(["browser_navigate"], {
		...browserTargetFields,
		url: Type.String({ minLength: 1 })
	}),
	actionObject(["browser_click"], {
		...observedBrowserTargetFields,
		elementRef: Type.Optional(Type.String({ minLength: 1 })),
		x: Type.Optional(Type.Number({ minimum: 0 })),
		y: Type.Optional(Type.Number({ minimum: 0 })),
		inputRoute: Type.Optional(Type.Enum(["trusted", "dom_event"], { type: "string" }))
	}),
	actionObject(["browser_type"], {
		...observedBrowserTargetFields,
		elementRef: Type.String({ minLength: 1 }),
		text: Type.String(),
		mode: Type.Optional(Type.Enum(["insert_text", "keystrokes"], { type: "string" })),
		replace: Type.Optional(Type.Boolean())
	}),
	actionObject(["browser_dialog"], {
		...browserTargetFields,
		dialogAction: Type.Literal("inspect")
	}),
	actionObject(["browser_dialog"], {
		...browserTargetFields,
		dialogAction: Type.Literal("accept"),
		dialogRef: Type.String({ minLength: 1 }),
		promptText: Type.Optional(Type.String()),
		deliveryMode: Type.Optional(Type.Enum(DELIVERY_MODES, { type: "string" }))
	}),
	actionObject(["browser_dialog"], {
		...browserTargetFields,
		dialogAction: Type.Literal("dismiss"),
		dialogRef: Type.String({ minLength: 1 }),
		deliveryMode: Type.Optional(Type.Enum(DELIVERY_MODES, { type: "string" }))
	}),
	actionObject(["browser_set_input_files"], {
		...observedBrowserTargetFields,
		elementRef: Type.String({ minLength: 1 }),
		resourceHandles: Type.Array(Type.String({ pattern: COMPUTER_RESOURCE_HANDLE_PATTERN }), {
			minItems: 1,
			maxItems: 32
		})
	}),
	actionObject(["browser_download"], {
		...observedBrowserTargetFields,
		elementRef: Type.String({ minLength: 1 })
	}),
	actionObject(["browser_pointer"], {
		...observedBrowserTargetFields,
		pointerAction: Type.Enum([
			"hover",
			"right_click",
			"double_click",
			"scroll",
			"drag"
		], { type: "string" }),
		inputRoute: Type.Optional(Type.Enum(["trusted", "dom_event"], { type: "string" })),
		elementRef: Type.Optional(Type.String({ minLength: 1 })),
		x: Type.Optional(Type.Number({ minimum: 0 })),
		y: Type.Optional(Type.Number({ minimum: 0 })),
		destinationElementRef: Type.Optional(Type.String({ minLength: 1 })),
		toX: Type.Optional(Type.Number({ minimum: 0 })),
		toY: Type.Optional(Type.Number({ minimum: 0 })),
		deltaX: Type.Optional(Type.Number()),
		deltaY: Type.Optional(Type.Number())
	}),
	actionObject(["escalate_scope"], { reason: Type.Enum(COMPUTER_ESCALATION_REASONS, { type: "string" }) }),
	actionObject(["get_recording_state", "stop_recording"], {}),
	actionObject(["start_recording"], { recordVideo: Type.Optional(Type.Boolean()) }),
	actionObject(["replay_trajectory"], {
		resourceHandle: Type.String({ pattern: COMPUTER_RESOURCE_HANDLE_PATTERN }),
		delayMs: Type.Optional(Type.Integer({
			minimum: 0,
			maximum: 1e4
		})),
		stopOnError: Type.Optional(Type.Boolean())
	})
]);
const COMPUTER_ACT_RESULT_MAX_ELEMENTS = 2e3;
const COMPUTER_ACT_RESULT_MAX_DETAIL_KEYS = 64;
const ComputerBoundsSchema = closedObject({
	x: Type.Number(),
	y: Type.Number(),
	width: Type.Number({ minimum: 0 }),
	height: Type.Number({ minimum: 0 })
});
const ComputerObservationSchema = closedObject({
	kind: Type.Enum([
		"window",
		"screen",
		"browser"
	], { type: "string" }),
	base64: Type.Optional(Type.String()),
	format: Type.Optional(Type.Enum(["jpeg", "png"], { type: "string" })),
	width: Type.Optional(Type.Integer({ minimum: 1 })),
	height: Type.Optional(Type.Integer({ minimum: 1 })),
	observationId: Type.Optional(Type.String({ minLength: 1 })),
	elements: Type.Optional(Type.Array(closedObject({
		elementRef: Type.String({ minLength: 1 }),
		role: Type.String({ minLength: 1 }),
		label: Type.Optional(Type.String()),
		value: Type.Optional(Type.String()),
		bounds: ComputerBoundsSchema
	}), { maxItems: COMPUTER_ACT_RESULT_MAX_ELEMENTS }))
});
const ComputerActResultSchema = closedObject({
	ok: Type.Boolean(),
	effect: Type.Optional(Type.Enum([
		"confirmed",
		"unverifiable",
		"suspected_noop"
	], { type: "string" })),
	observation: Type.Optional(ComputerObservationSchema),
	escalation: Type.Optional(closedObject({
		recommended: Type.Enum([
			"window-pixel",
			"foreground",
			"desktop"
		], { type: "string" }),
		reasonCode: Type.String({ minLength: 1 })
	})),
	details: Type.Optional(Type.Record(Type.String({
		minLength: 1,
		maxLength: 128
	}), Type.Unknown(), { maxProperties: COMPUTER_ACT_RESULT_MAX_DETAIL_KEYS }))
});
const ComputerUseCapabilityDescriptorSchema = closedObject({
	contractVersion: Type.Literal(2),
	provider: closedObject({
		id: Type.String({
			minLength: 1,
			maxLength: 128
		}),
		label: Type.String({
			minLength: 1,
			maxLength: 256
		}),
		generation: Type.String({
			minLength: 1,
			maxLength: 256
		})
	}),
	actions: Type.Array(Type.Enum(COMPUTER_USE_V2_ACTION_NAMES, { type: "string" }), {
		maxItems: COMPUTER_USE_V2_ACTION_NAMES.length,
		uniqueItems: true
	}),
	targets: Type.Array(Type.Enum([
		"screen",
		"window",
		"element",
		"browser"
	]), {
		maxItems: 4,
		uniqueItems: true
	}),
	deliveryModes: Type.Array(Type.Enum(DELIVERY_MODES, { type: "string" }), {
		maxItems: DELIVERY_MODES.length,
		uniqueItems: true
	}),
	observations: Type.Array(Type.Enum([
		"image",
		"accessibility",
		"browser"
	], { type: "string" }), {
		maxItems: 3,
		uniqueItems: true
	}),
	features: closedObject({
		recording: Type.Boolean(),
		agentCursor: Type.Boolean(),
		multiDisplay: Type.Boolean()
	})
});
/** Canonical inner payload accepted by the `screen.snapshot` node command. */
const ScreenSnapshotParamsSchema = closedObject({
	executionId: Type.Optional(Type.String({ pattern: COMPUTER_EXECUTION_ID_PATTERN })),
	screenIndex: Type.Optional(Type.Integer({ minimum: 0 })),
	maxWidth: Type.Optional(Type.Integer({ minimum: 1 })),
	quality: Type.Optional(Type.Number()),
	format: Type.Optional(Type.Enum(["jpeg", "png"], { type: "string" }))
});
/** Canonical inner payload returned by the `screen.snapshot` node command. */
const ScreenSnapshotResultSchema = Type.Object({
	format: Type.Enum(["jpeg", "png"], { type: "string" }),
	base64: Type.String({ minLength: 1 }),
	displayFrameId: Type.Optional(Type.String()),
	screenIndex: Type.Optional(Type.Number()),
	width: Type.Optional(Type.Number()),
	height: Type.Optional(Type.Number()),
	capturedAtMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Compile one Computer Use wire schema into a reusable type-guard validator. */
function compileComputerUseValidator(schema) {
	const validator = Compile(schema);
	return (value) => validator.Check(value);
}
const validateComputerActParams = /* @__PURE__ */ lazyCompile(ComputerActParamsSchema);
const validateComputerActResult = /* @__PURE__ */ lazyCompile(ComputerActResultSchema);
const validateComputerUseCapabilityDescriptor = /* @__PURE__ */ lazyCompile(ComputerUseCapabilityDescriptorSchema);
const validateScreenSnapshotParams = /* @__PURE__ */ lazyCompile(ScreenSnapshotParamsSchema);
const validateScreenSnapshotResult = /* @__PURE__ */ lazyCompile(ScreenSnapshotResultSchema);
function parseParamsJSON(paramsJSON, validate) {
	let value;
	try {
		value = JSON.parse(paramsJSON ?? "{}");
	} catch {
		throw new Error("COMPUTER_INVALID_REQUEST: params must be valid JSON");
	}
	if (!validate(value)) throw new Error("COMPUTER_INVALID_REQUEST: invalid params");
	return value;
}
function parseComputerActParamsJSON(paramsJSON) {
	return parseParamsJSON(paramsJSON, validateComputerActParams);
}
function parseScreenSnapshotParamsJSON(paramsJSON) {
	return parseParamsJSON(paramsJSON, validateScreenSnapshotParams);
}
/** Validate one provider result envelope. */
function parseComputerActResult(value) {
	if (!validateComputerActResult(value)) throw new Error(`${COMPUTER_CONTRACT_MISMATCH}: invalid computer.act result`);
	return value;
}
/** Validate one bounded Computer Use declaration carried by a node connect. */
function parseComputerUseCapabilityDescriptor(value) {
	if (!validateComputerUseCapabilityDescriptor(value)) throw new Error(`${COMPUTER_CONTRACT_MISMATCH}: invalid capability descriptor`);
	return value;
}
/** Validate and project a `screen.snapshot` result without retaining unknown fields. */
function parseScreenSnapshotResult(value) {
	if (!validateScreenSnapshotResult(value)) throw new Error("invalid screen.snapshot payload");
	return {
		format: value.format,
		base64: value.base64,
		...value.displayFrameId ? { displayFrameId: value.displayFrameId } : {},
		...value.screenIndex !== void 0 ? { screenIndex: value.screenIndex } : {},
		...value.width !== void 0 ? { width: value.width } : {},
		...value.height !== void 0 ? { height: value.height } : {},
		...value.capturedAtMs !== void 0 ? { capturedAtMs: value.capturedAtMs } : {}
	};
}
//#endregion
export { parseComputerUseCapabilityDescriptor as _, COMPUTER_SCROLL_DIRECTIONS as a, COMPUTER_USE_V2_ACTION_NAMES as c, ComputerUseCapabilityDescriptorSchema as d, ScreenSnapshotParamsSchema as f, parseComputerActResult as g, parseComputerActParamsJSON as h, COMPUTER_EXECUTION_ID_PATTERN as i, ComputerActParamsSchema as l, compileComputerUseValidator as m, COMPUTER_CONTRACT_MISMATCH as n, COMPUTER_STALE_OBSERVATION as o, ScreenSnapshotResultSchema as p, COMPUTER_ESCALATION_REASONS as r, COMPUTER_USE_V1_ACTION_NAMES as s, COMPUTER_ACT_V1_ACTION_NAMES as t, ComputerActResultSchema as u, parseScreenSnapshotParamsJSON as v, parseScreenSnapshotResult as y };
