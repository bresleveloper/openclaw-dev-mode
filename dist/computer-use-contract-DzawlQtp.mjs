import { t as lazyCompile } from "./protocol-validator-BeXfMhak.mjs";
import { randomUUID } from "node:crypto";
import { Type } from "typebox";
import { Compile } from "typebox/compile";
//#region src/plugins/computer-use-contract.ts
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
const SCROLL_DIRECTIONS = [
	"up",
	"down",
	"left",
	"right"
];
const DELIVERY_MODES = ["background", "foreground"];
const ESCALATION_REASONS = [
	"ax_tree_pixel_mismatch",
	"background_delivery_failed",
	"foreground_ineffective",
	"no_window_target",
	"other"
];
const COMPUTER_RESOURCE_HANDLE_PATTERN = "^openclaw:computer-resource:v1:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$";
const COMPUTER_EXECUTION_ID_PATTERN = "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$";
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
function actionObject(actions, properties) {
	return Type.Object({
		action: Type.Enum(actions, { type: "string" }),
		executionId: Type.Optional(Type.String({ pattern: COMPUTER_EXECUTION_ID_PATTERN })),
		...properties
	}, { additionalProperties: false });
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
		displayFrameId: Type.Optional(Type.String()),
		x: Type.Optional(Type.Number({ minimum: 0 })),
		y: Type.Optional(Type.Number({ minimum: 0 })),
		modifiers: Type.Optional(Type.String()),
		...optionalScreenFields,
		...optionalReferenceFields
	}),
	actionObject(["left_click_drag"], {
		displayFrameId: Type.Optional(Type.String()),
		x: Type.Optional(Type.Number({ minimum: 0 })),
		y: Type.Optional(Type.Number({ minimum: 0 })),
		fromX: Type.Optional(Type.Number({ minimum: 0 })),
		fromY: Type.Optional(Type.Number({ minimum: 0 })),
		durationMs: Type.Optional(Type.Integer({ minimum: 0 })),
		...optionalScreenFields,
		...optionalReferenceFields
	}),
	actionObject(["left_mouse_down", "left_mouse_up"], {
		displayFrameId: Type.Optional(Type.String()),
		x: Type.Optional(Type.Number({ minimum: 0 })),
		y: Type.Optional(Type.Number({ minimum: 0 })),
		modifiers: Type.Optional(Type.String()),
		...optionalScreenFields,
		...optionalReferenceFields
	}),
	actionObject(["scroll"], {
		displayFrameId: Type.Optional(Type.String()),
		x: Type.Optional(Type.Number({ minimum: 0 })),
		y: Type.Optional(Type.Number({ minimum: 0 })),
		modifiers: Type.Optional(Type.String()),
		scrollDirection: Type.Optional(Type.Enum(SCROLL_DIRECTIONS, { type: "string" })),
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
		browserRef: Type.String({ minLength: 1 }),
		pageRef: Type.String({ minLength: 1 }),
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
		browserRef: Type.String({ minLength: 1 }),
		pageRef: Type.String({ minLength: 1 }),
		url: Type.String({ minLength: 1 })
	}),
	actionObject(["browser_click"], {
		browserRef: Type.String({ minLength: 1 }),
		pageRef: Type.String({ minLength: 1 }),
		observationId: Type.String({ minLength: 1 }),
		elementRef: Type.Optional(Type.String({ minLength: 1 })),
		x: Type.Optional(Type.Number({ minimum: 0 })),
		y: Type.Optional(Type.Number({ minimum: 0 })),
		inputRoute: Type.Optional(Type.Enum(["trusted", "dom_event"], { type: "string" }))
	}),
	actionObject(["browser_type"], {
		browserRef: Type.String({ minLength: 1 }),
		pageRef: Type.String({ minLength: 1 }),
		observationId: Type.String({ minLength: 1 }),
		elementRef: Type.String({ minLength: 1 }),
		text: Type.String(),
		mode: Type.Optional(Type.Enum(["insert_text", "keystrokes"], { type: "string" })),
		replace: Type.Optional(Type.Boolean())
	}),
	actionObject(["browser_dialog"], {
		browserRef: Type.String({ minLength: 1 }),
		pageRef: Type.String({ minLength: 1 }),
		dialogAction: Type.Literal("inspect")
	}),
	actionObject(["browser_dialog"], {
		browserRef: Type.String({ minLength: 1 }),
		pageRef: Type.String({ minLength: 1 }),
		dialogAction: Type.Literal("accept"),
		dialogRef: Type.String({ minLength: 1 }),
		promptText: Type.Optional(Type.String()),
		deliveryMode: Type.Optional(Type.Enum(DELIVERY_MODES, { type: "string" }))
	}),
	actionObject(["browser_dialog"], {
		browserRef: Type.String({ minLength: 1 }),
		pageRef: Type.String({ minLength: 1 }),
		dialogAction: Type.Literal("dismiss"),
		dialogRef: Type.String({ minLength: 1 }),
		deliveryMode: Type.Optional(Type.Enum(DELIVERY_MODES, { type: "string" }))
	}),
	actionObject(["browser_set_input_files"], {
		browserRef: Type.String({ minLength: 1 }),
		pageRef: Type.String({ minLength: 1 }),
		observationId: Type.String({ minLength: 1 }),
		elementRef: Type.String({ minLength: 1 }),
		resourceHandles: Type.Array(Type.String({ pattern: COMPUTER_RESOURCE_HANDLE_PATTERN }), {
			minItems: 1,
			maxItems: 32
		})
	}),
	actionObject(["browser_download"], {
		browserRef: Type.String({ minLength: 1 }),
		pageRef: Type.String({ minLength: 1 }),
		observationId: Type.String({ minLength: 1 }),
		elementRef: Type.String({ minLength: 1 })
	}),
	actionObject(["browser_pointer"], {
		browserRef: Type.String({ minLength: 1 }),
		pageRef: Type.String({ minLength: 1 }),
		observationId: Type.String({ minLength: 1 }),
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
	actionObject(["escalate_scope"], { reason: Type.Enum(ESCALATION_REASONS, { type: "string" }) }),
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
const ComputerBoundsSchema = Type.Object({
	x: Type.Number(),
	y: Type.Number(),
	width: Type.Number({ minimum: 0 }),
	height: Type.Number({ minimum: 0 })
}, { additionalProperties: false });
const ComputerObservationSchema = Type.Object({
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
	elements: Type.Optional(Type.Array(Type.Object({
		elementRef: Type.String({ minLength: 1 }),
		role: Type.String({ minLength: 1 }),
		label: Type.Optional(Type.String()),
		value: Type.Optional(Type.String()),
		bounds: ComputerBoundsSchema
	}, { additionalProperties: false }), { maxItems: COMPUTER_ACT_RESULT_MAX_ELEMENTS }))
}, { additionalProperties: false });
const ComputerActResultSchema = Type.Object({
	ok: Type.Boolean(),
	effect: Type.Optional(Type.Enum([
		"confirmed",
		"unverifiable",
		"suspected_noop"
	], { type: "string" })),
	observation: Type.Optional(ComputerObservationSchema),
	escalation: Type.Optional(Type.Object({
		recommended: Type.Enum([
			"window-pixel",
			"foreground",
			"desktop"
		], { type: "string" }),
		reasonCode: Type.String({ minLength: 1 })
	}, { additionalProperties: false })),
	details: Type.Optional(Type.Record(Type.String({
		minLength: 1,
		maxLength: 128
	}), Type.Unknown(), { maxProperties: COMPUTER_ACT_RESULT_MAX_DETAIL_KEYS }))
}, { additionalProperties: false });
const ComputerUseCapabilityDescriptorSchema = Type.Object({
	contractVersion: Type.Literal(2),
	provider: Type.Object({
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
	}, { additionalProperties: false }),
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
	features: Type.Object({
		recording: Type.Boolean(),
		agentCursor: Type.Boolean(),
		multiDisplay: Type.Boolean()
	}, { additionalProperties: false })
}, { additionalProperties: false });
/** Canonical inner payload accepted by the `screen.snapshot` node command. */
const ScreenSnapshotParamsSchema = Type.Object({
	executionId: Type.Optional(Type.String({ pattern: COMPUTER_EXECUTION_ID_PATTERN })),
	screenIndex: Type.Optional(Type.Integer({ minimum: 0 })),
	maxWidth: Type.Optional(Type.Integer({ minimum: 1 })),
	quality: Type.Optional(Type.Number()),
	format: Type.Optional(Type.Enum(["jpeg", "png"], { type: "string" }))
}, { additionalProperties: false });
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
/** Register the canonical node-host command pair for one node-local provider. */
function registerComputerUseProvider(api, provider) {
	let execution;
	let closingPromise;
	let pendingClose;
	const hasActiveWork = () => execution !== void 0 || closingPromise !== void 0 || pendingClose !== void 0;
	const executionEnvelopeFromParams = (paramsJSON) => {
		let value;
		try {
			value = JSON.parse(paramsJSON ?? "{}");
		} catch {
			throw new Error("COMPUTER_INVALID_REQUEST: params must be valid JSON");
		}
		const executionId = value && typeof value === "object" && !Array.isArray(value) ? value.executionId : void 0;
		if (executionId === void 0) return {
			executionId: void 0,
			value
		};
		if (typeof executionId !== "string" || !new RegExp(COMPUTER_EXECUTION_ID_PATTERN, "u").test(executionId)) throw new Error("COMPUTER_INVALID_REQUEST: executionId is required");
		return {
			executionId,
			value
		};
	};
	const getExecution = async (paramsJSON, context) => {
		const { executionId } = executionEnvelopeFromParams(paramsJSON);
		if (!executionId) throw new Error("COMPUTER_INVALID_REQUEST: executionId is required");
		for (let barrier = closingPromise; barrier !== void 0; barrier = closingPromise) await barrier;
		if (execution && execution.id !== executionId) throw new Error("COMPUTER_HOST_BUSY: another provider execution owns this computer");
		if (!execution) {
			const opened = provider.openExecution(context?.sessionKey ? {
				executionId,
				sessionKey: context.sessionKey
			} : { executionId });
			opened.catch(() => {
				if (execution?.promise === opened) execution = void 0;
			});
			execution = {
				id: executionId,
				promise: opened
			};
		}
		return execution.promise;
	};
	const closeCurrentExecution = (executionId, reason) => {
		const current = execution;
		if (!current || executionId !== void 0 && current.id !== executionId) return Promise.resolve();
		if (pendingClose) return pendingClose;
		const close = current.promise.then(async (opened) => await opened.close(reason));
		pendingClose = close;
		closingPromise = close;
		close.then(() => {
			if (execution === current) execution = void 0;
			pendingClose = void 0;
			closingPromise = void 0;
		}, () => {
			pendingClose = void 0;
			if (execution !== current) closingPromise = void 0;
		});
		return close;
	};
	const closeExecution = (executionId, reason) => {
		if (!pendingClose) return closeCurrentExecution(executionId, reason);
		const joined = (async () => {
			for (let barrier = pendingClose; barrier !== void 0; barrier = pendingClose) {
				const matchesClosingOwner = executionId === void 0 || execution?.id === executionId;
				try {
					await barrier;
				} catch (error) {
					if (matchesClosingOwner) throw error;
					return;
				}
			}
			await closeCurrentExecution(executionId, reason);
		})();
		joined.catch(() => {});
		return joined;
	};
	api.registerNodeHostCommand({
		command: "screen.snapshot",
		cap: "screen",
		dangerous: false,
		prepare: (context) => provider.prepare?.(context),
		isAvailable: () => provider.isAvailable(),
		hasActiveWork,
		watchAvailability: (context, onChange) => {
			const stopWatching = provider.watchAvailability?.(context, onChange);
			return () => {
				stopWatching?.();
				closeExecution(void 0, "node-host-stop");
			};
		},
		onDisconnect: async () => await closeExecution(void 0, "gateway-disconnect"),
		handle: async (paramsJSON, _io, context) => {
			if (executionEnvelopeFromParams(paramsJSON).executionId) return await (await getExecution(paramsJSON, context)).snapshot(paramsJSON, context?.signal);
			const executionId = randomUUID();
			const opened = await provider.openExecution(context?.sessionKey ? {
				executionId,
				sessionKey: context.sessionKey
			} : { executionId });
			try {
				return await opened.snapshot(paramsJSON, context?.signal);
			} finally {
				await opened.close("snapshot-complete");
			}
		}
	});
	api.registerNodeHostCommand({
		command: "computer.act",
		cap: "computer",
		dangerous: true,
		computerUse: () => provider.capabilities(),
		isAvailable: () => provider.isAvailable(),
		hasActiveWork,
		handle: async (paramsJSON, _io, context) => {
			const envelope = executionEnvelopeFromParams(paramsJSON);
			if (!envelope.executionId) throw new Error("COMPUTER_INVALID_REQUEST: executionId is required");
			if (envelope.value && typeof envelope.value === "object" && !Array.isArray(envelope.value) && envelope.value.action === "__close_execution") {
				const reason = envelope.value.reason;
				await closeExecution(envelope.executionId, typeof reason === "string" && reason.trim() ? reason.slice(0, 64) : "completion");
				return JSON.stringify({ ok: true });
			}
			return await (await getExecution(paramsJSON, context)).act(paramsJSON, context?.signal);
		}
	});
}
//#endregion
export { registerComputerUseProvider as _, COMPUTER_USE_V2_ACTION_NAMES as a, ComputerUseCapabilityDescriptorSchema as c, compileComputerUseValidator as d, parseComputerActParamsJSON as f, parseScreenSnapshotResult as g, parseScreenSnapshotParamsJSON as h, COMPUTER_USE_V1_ACTION_NAMES as i, ScreenSnapshotParamsSchema as l, parseComputerUseCapabilityDescriptor as m, COMPUTER_CONTRACT_MISMATCH as n, ComputerActParamsSchema as o, parseComputerActResult as p, COMPUTER_STALE_OBSERVATION as r, ComputerActResultSchema as s, COMPUTER_ACT_V1_ACTION_NAMES as t, ScreenSnapshotResultSchema as u };
