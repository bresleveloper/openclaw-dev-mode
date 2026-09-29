import { a as asOptionalRecord, c as isRecord } from "../../record-coerce-DItp3I4t.mjs";
import { w as root } from "../../fs-safe-BAPek8At.mjs";
import { Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, qn as strictObject, xn as literal } from "../../schemas-BOYIvvln.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-BSb3HetY.mjs";
import { l as normalizePluginsConfig } from "../../config-state-BEAL5gWH.mjs";
import { t as canonicalizeBase64 } from "../../base64-B5EyWEOm.mjs";
import { _ as registerComputerUseProvider, a as COMPUTER_USE_V2_ACTION_NAMES, f as parseComputerActParamsJSON, h as parseScreenSnapshotParamsJSON } from "../../computer-use-contract-DzawlQtp.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { t as removePathWithinRoot } from "../../fs-safe-remove-voSEe4IL.mjs";
import { n as buildPluginConfigSchema } from "../../config-schema-c9utjSlx.mjs";
import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import "../../plugin-config-runtime-CaI6yWBc.mjs";
import "../../file-access-runtime-CWjkXCju.mjs";
import "../../media-runtime-Cwd1EZJ3.mjs";
import "../../temp-path-PENdksor.mjs";
import "../../computer-use-tSE8M6p_.mjs";
import { n as registerCuaDriverDoctorChecks, r as verifyInstalledCuaDriverArtifacts } from "../../api-Ce-317ZN.mjs";
import fs from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { createRastermill } from "rastermill";
//#region extensions/cua-computer/src/actions.ts
const MODIFIER_ALIASES = /* @__PURE__ */ new Map([
	["ctrl", "ctrl"],
	["control", "ctrl"],
	["shift", "shift"],
	["alt", "alt"],
	["menu", "alt"],
	["option", "alt"],
	["mod1", "alt"],
	["cmd", "meta"],
	["command", "meta"],
	["meta", "meta"],
	["super", "meta"],
	["win", "meta"],
	["windows", "meta"],
	["mod4", "meta"]
]);
const KEY_ALIASES = /* @__PURE__ */ new Map([
	["return", "enter"],
	["enter", "enter"],
	["tab", "tab"],
	["escape", "escape"],
	["esc", "escape"],
	["space", "space"],
	["backspace", "backspace"],
	["delete", "delete"],
	["del", "delete"],
	["insert", "insert"],
	["ins", "insert"],
	["home", "home"],
	["end", "end"],
	["pageup", "pageup"],
	["pgup", "pageup"],
	["pagedown", "pagedown"],
	["pgdn", "pagedown"],
	["up", "up"],
	["down", "down"],
	["left", "left"],
	["right", "right"],
	["capslock", "capslock"],
	["numlock", "numlock"]
]);
for (let index = 1; index <= 12; index += 1) KEY_ALIASES.set(`f${index}`, `f${index}`);
function unsupportedKey(message) {
	return /* @__PURE__ */ new Error(`COMPUTER_UNSUPPORTED_KEY: ${message}`);
}
function modifierAlias(value, platform) {
	const normalized = MODIFIER_ALIASES.get(value.toLowerCase());
	return platform === "darwin" && normalized === "meta" ? "cmd" : normalized;
}
function normalizeModifierList(entries, platform) {
	return entries.map((entry) => {
		const raw = entry.trim();
		const normalized = modifierAlias(raw, platform);
		if (!normalized) throw unsupportedKey(`unknown modifier ${JSON.stringify(raw)}`);
		return normalized;
	});
}
function normalizeModifiers(value, platform) {
	return value?.trim() ? normalizeModifierList(value.split("+"), platform) : [];
}
function normalizeKey(value, platform) {
	const raw = value.trim();
	if (!raw) throw unsupportedKey("key chord contains an empty key");
	const lowered = raw.toLowerCase();
	const named = modifierAlias(lowered, platform) ?? KEY_ALIASES.get(lowered);
	if (named) return named;
	if (/^[a-z]$/i.test(raw)) return lowered;
	if (raw.length === 1) throw unsupportedKey(`single-character key ${JSON.stringify(raw)} loses layout shift state in cua-driver; use the type action instead`);
	throw unsupportedKey(`unknown key ${JSON.stringify(raw)}`);
}
function parseKeyChord(value, platform) {
	const segments = value?.split("+").map((entry) => entry.trim()) ?? [];
	const rawKey = segments.pop();
	if (!rawKey) throw unsupportedKey("key chord is empty");
	const modifiers = normalizeModifierList(segments, platform);
	return {
		key: normalizeKey(rawKey, platform),
		modifiers
	};
}
function scalePoint(frame, x, y, label) {
	if (x === void 0 || y === void 0) throw new Error(`COMPUTER_INVALID_REQUEST: ${label} coordinates are required`);
	if (x >= frame.deliveredWidth || y >= frame.deliveredHeight) throw new Error(`COMPUTER_INVALID_REQUEST: ${label} coordinates are outside the captured primary-display frame`);
	return {
		x: Math.min(frame.nativeWidth - 1, Math.round(x * frame.nativeWidth / frame.deliveredWidth)),
		y: Math.min(frame.nativeHeight - 1, Math.round(y * frame.nativeHeight / frame.deliveredHeight))
	};
}
//#endregion
//#region extensions/cua-computer/src/driver-client.ts
const EscalationReason = {
	AxTreePixelMismatch: 0,
	BackgroundDeliveryFailed: 1,
	ForegroundIneffective: 2,
	NoWindowTarget: 3,
	Other: 4
};
const ClickButton = {
	Left: 0,
	Right: 1,
	Middle: 2
};
const ScrollDirection = {
	Up: 0,
	Down: 1,
	Left: 2,
	Right: 3
};
function asyncOptions(signal) {
	return signal ? { signal } : void 0;
}
var DirectCuaDriverSession = class {
	constructor(sdk) {
		this.sdk = sdk;
		this.publicSession = `openclaw-${randomUUID()}`;
		this.started = false;
		this.disposed = false;
		const unrestricted = sdk.SessionPermissionMode.Unrestricted;
		const authorization = {
			allowedModes: [unrestricted],
			compatibilityMode: unrestricted,
			unrestrictedAcknowledged: true,
			maxSessionTtlSeconds: 3600n,
			maxIdleTtlSeconds: 300n
		};
		this.runtime = sdk.CuaDriver.createConfigured({
			claudeCodeCompatibility: false,
			authorization
		});
		this.session = sdk.createTrustedSession(this.runtime, {
			mode: unrestricted,
			ttlSeconds: authorization.maxSessionTtlSeconds,
			idleTtlSeconds: authorization.maxIdleTtlSeconds,
			publicSession: this.publicSession
		});
		this.desktopTarget = sdk.ActionTarget.Desktop.new({ displayId: "primary" });
	}
	async ensureSessionStarted(signal) {
		if (this.disposed) throw new Error("COMPUTER_DRIVER_UNAVAILABLE: cua-computer is stopping");
		if (!this.startPromise) {
			const start = this.session.startSession({ session: this.publicSession }, asyncOptions(signal)).then(() => {
				this.started = true;
			});
			this.startPromise = start;
			try {
				await start;
			} catch (error) {
				if (this.startPromise === start) this.startPromise = void 0;
				throw error;
			}
			return;
		}
		await this.startPromise;
	}
	async invoke(signal, operation) {
		await this.ensureSessionStarted(signal);
		return await operation();
	}
	isAvailable() {
		return !this.disposed && this.runtime.isAvailable();
	}
	resetAvailabilityCache() {}
	async callTool(name, args, signal) {
		return await this.invoke(signal, () => this.session.callTool(name, JSON.stringify({
			...args,
			session: this.publicSession
		}), asyncOptions(signal)));
	}
	async getCursorPosition(signal) {
		return await this.invoke(signal, () => this.session.getCursorPosition({ session: this.publicSession }, asyncOptions(signal)));
	}
	async escalateScope(_reason, signal) {
		await this.ensureSessionStarted(signal);
		return await this.session.getSessionState({ session: this.publicSession }, asyncOptions(signal));
	}
	async getDesktopState(signal) {
		return await this.invoke(signal, () => this.session.getDesktopState({}, asyncOptions(signal)));
	}
	async getScreenSize(signal) {
		return await this.invoke(signal, () => this.session.getScreenSize({}, asyncOptions(signal)));
	}
	async click(input, signal) {
		return await this.invoke(signal, async () => {
			try {
				return {
					text: "",
					images: [],
					isError: false,
					degraded: false,
					rawJson: "{}",
					action: await this.session.click({
						position: this.sdk.ClickPosition.Coordinates.new({
							x: input.x,
							y: input.y
						}),
						deliveryMode: this.sdk.InputDeliveryMode.Foreground,
						button: input.button,
						count: input.count,
						target: this.desktopTarget
					}, asyncOptions(signal))
				};
			} catch (error) {
				if (!this.sdk.DriverError.Tool.instanceOf(error)) throw error;
				return {
					text: error.inner.message,
					images: [],
					isError: true,
					degraded: false,
					rawJson: "{}",
					errorCode: error.inner.errorCode
				};
			}
		});
	}
	async drag(input, signal) {
		return await this.invoke(signal, () => this.session.drag({
			...input,
			target: this.desktopTarget
		}, asyncOptions(signal)));
	}
	async moveCursor(input, signal) {
		return await this.invoke(signal, () => this.session.moveCursor({
			...input,
			target: this.desktopTarget
		}, asyncOptions(signal)));
	}
	async scroll(input, signal) {
		return await this.invoke(signal, () => this.session.scroll({
			...input,
			target: this.desktopTarget,
			by: this.sdk.ScrollBy.Line
		}, asyncOptions(signal)));
	}
	async typeText(text, signal) {
		return await this.invoke(signal, () => this.session.typeText({
			text,
			target: this.desktopTarget
		}, asyncOptions(signal)));
	}
	async pressKey(input, signal) {
		return await this.invoke(signal, () => this.session.pressKey({
			...input,
			target: this.desktopTarget
		}, asyncOptions(signal)));
	}
	async dispose() {
		if (this.disposed) return;
		this.disposed = true;
		let failure;
		try {
			await this.startPromise;
		} catch (error) {
			failure = error;
		}
		if (this.started) try {
			await this.session.endSession({ session: this.publicSession });
		} catch (error) {
			failure ??= error;
		}
		try {
			this.session.close();
		} catch (error) {
			failure ??= error;
		}
		try {
			await this.runtime.shutdown();
		} catch (error) {
			failure ??= error;
		}
		try {
			this.runtime.uniffiDestroy?.();
		} catch (error) {
			failure ??= error;
		}
		if (failure) throw failure instanceof Error ? failure : new Error("CUA Driver cleanup failed", { cause: failure });
	}
};
async function loadCuaDriverSdk() {
	const artifactVerification = verifyInstalledCuaDriverArtifacts();
	if (!artifactVerification.ok) throw new Error(artifactVerification.diagnostic);
	return await import("@trycua/cua-driver");
}
function unavailableError(failure) {
	if (failure instanceof Error && /^COMPUTER_DRIVER_[A-Z_]+:/u.test(failure.message)) return failure;
	const detail = failure instanceof Error ? failure.message : String(failure);
	return new Error(`COMPUTER_DRIVER_UNAVAILABLE: failed to load CUA Driver SDK: ${detail}`, { cause: failure });
}
function isPromise(value) {
	return typeof value.then === "function";
}
var LazyCuaDriverSession = class {
	constructor(loadSdk) {
		this.loadSdk = loadSdk;
		this.generation = randomUUID();
		this.hasLoadFailure = false;
		this.disposed = false;
	}
	resolveRuntime() {
		if (this.disposed || this.hasLoadFailure || this.loadPromise) return;
		if (this.runtime) return this.runtime;
		try {
			const loadedSdk = this.loadSdk();
			if (!isPromise(loadedSdk)) {
				this.runtime = new DirectCuaDriverSession(loadedSdk);
				return this.runtime;
			}
			const loadPromise = loadedSdk.then((sdk) => new DirectCuaDriverSession(sdk)).then((runtime) => {
				this.runtime = runtime;
				return runtime;
			}).catch((error) => {
				this.loadFailure = error;
				this.hasLoadFailure = true;
				throw error;
			}).finally(() => {
				if (this.loadPromise === loadPromise) this.loadPromise = void 0;
			});
			this.loadPromise = loadPromise;
			loadPromise.catch(() => {});
			return this.runtime;
		} catch (error) {
			this.loadFailure = error;
			this.hasLoadFailure = true;
			return;
		}
	}
	async requireRuntime() {
		const runtime = this.resolveRuntime();
		if (runtime) return runtime;
		if (this.loadPromise) try {
			return await this.loadPromise;
		} catch (error) {
			throw unavailableError(this.loadFailure ?? error);
		}
		throw unavailableError(this.disposed ? /* @__PURE__ */ new Error("cua-computer is stopping") : this.loadFailure);
	}
	isAvailable() {
		return this.resolveRuntime()?.isAvailable() ?? false;
	}
	async prepareAvailability() {
		this.resolveRuntime();
		await this.loadPromise?.catch(() => {});
	}
	resetAvailabilityCache() {
		if (this.runtime) this.runtime.resetAvailabilityCache();
		else if (!this.disposed && !this.loadPromise) {
			this.loadFailure = void 0;
			this.hasLoadFailure = false;
		}
	}
	async getDesktopState(signal) {
		return await (await this.requireRuntime()).getDesktopState(signal);
	}
	async callTool(name, args, signal) {
		return await (await this.requireRuntime()).callTool(name, args, signal);
	}
	async getCursorPosition(signal) {
		return await (await this.requireRuntime()).getCursorPosition(signal);
	}
	async escalateScope(reason, signal) {
		return await (await this.requireRuntime()).escalateScope(reason, signal);
	}
	async getScreenSize(signal) {
		return await (await this.requireRuntime()).getScreenSize(signal);
	}
	async click(input, signal) {
		return await (await this.requireRuntime()).click(input, signal);
	}
	async drag(input, signal) {
		return await (await this.requireRuntime()).drag(input, signal);
	}
	async moveCursor(input, signal) {
		return await (await this.requireRuntime()).moveCursor(input, signal);
	}
	async scroll(input, signal) {
		return await (await this.requireRuntime()).scroll(input, signal);
	}
	async typeText(text, signal) {
		return await (await this.requireRuntime()).typeText(text, signal);
	}
	async pressKey(input, signal) {
		return await (await this.requireRuntime()).pressKey(input, signal);
	}
	async dispose() {
		if (this.disposed) return;
		this.disposed = true;
		try {
			await this.loadPromise;
		} catch {}
		await this.runtime?.dispose();
	}
};
function createCuaDriver(options = {}) {
	return new LazyCuaDriverSession(options.loadSdk ?? loadCuaDriverSdk);
}
//#endregion
//#region extensions/cua-computer/src/frame.ts
function staleFrame(message) {
	return /* @__PURE__ */ new Error(`COMPUTER_STALE_FRAME: ${message}; take a new screenshot`);
}
function staleObservation() {
	return /* @__PURE__ */ new Error("COMPUTER_STALE_OBSERVATION: take a fresh observation and retry");
}
function opaqueRef(kind) {
	return `cua:v2:${kind}:${randomUUID()}`;
}
function adoptGeneration(state, generation) {
	if (state.generation !== generation) {
		state.lastFrame = void 0;
		state.apps = void 0;
		state.windows = void 0;
		state.observation = void 0;
		state.browsers = void 0;
		state.pages = void 0;
		state.browserObservation = void 0;
		state.dialog = void 0;
	}
	state.generation = generation;
}
function verifyGeneration(state, generation) {
	if (state.generation !== generation) {
		adoptGeneration(state, generation);
		throw staleObservation();
	}
}
function issueAppRef(state, target) {
	state.apps ??= /* @__PURE__ */ new Map();
	const ref = opaqueRef("app");
	state.apps.set(ref, target);
	return ref;
}
function resolveAppRef(state, ref) {
	return state.apps?.get(ref);
}
function issueWindowRef(state, target) {
	state.windows ??= /* @__PURE__ */ new Map();
	for (const [ref, current] of state.windows) if (current.pid === target.pid && current.windowId === target.windowId) return ref;
	const ref = opaqueRef("window");
	state.windows.set(ref, target);
	return ref;
}
function resolveWindowRef(state, ref) {
	const target = state.windows?.get(ref);
	if (!target) throw staleObservation();
	return target;
}
function issueObservation(state, windowRef, options = {}) {
	const observation = {
		id: opaqueRef("observation"),
		windowRef,
		fromZoom: options.fromZoom === true,
		elements: /* @__PURE__ */ new Map()
	};
	state.observation = observation;
	return observation;
}
function issueElementRef(observation, target) {
	const ref = opaqueRef("element");
	observation.elements.set(ref, target);
	return ref;
}
function resolveObservation(state, observationId, windowRef) {
	const observation = state.observation;
	if (!observation || observation.id !== observationId || observation.windowRef !== windowRef) throw staleObservation();
	return observation;
}
function resolveElementRef(observation, elementRef) {
	const target = observation.elements.get(elementRef);
	if (!target) throw staleObservation();
	return target;
}
function issueBrowserRef(state, target) {
	state.browsers ??= /* @__PURE__ */ new Map();
	for (const [ref, current] of state.browsers) if (current.targetId === target.targetId && current.windowRef === target.windowRef) return ref;
	const ref = opaqueRef("browser");
	state.browsers.set(ref, target);
	return ref;
}
function resolveBrowserRef(state, ref) {
	const target = state.browsers?.get(ref);
	if (!target) throw staleObservation();
	return target;
}
function issuePageRef(state, browserRef, tabId) {
	state.pages ??= /* @__PURE__ */ new Map();
	for (const [ref, current] of state.pages) if (current.browserRef === browserRef && current.tabId === tabId) return ref;
	const ref = opaqueRef("page");
	state.pages.set(ref, {
		browserRef,
		tabId
	});
	return ref;
}
function resolvePageRef(state, browserRef, pageRef) {
	const page = state.pages?.get(pageRef);
	if (!page || page.browserRef !== browserRef) throw staleObservation();
	return page;
}
function issueBrowserObservation(state, browserRef, pageRef) {
	const observation = {
		id: opaqueRef("observation"),
		browserRef,
		pageRef,
		elements: /* @__PURE__ */ new Map()
	};
	state.browserObservation = observation;
	state.dialog = void 0;
	return observation;
}
function issueBrowserElementRef(observation, nativeRef) {
	const ref = opaqueRef("element");
	observation.elements.set(ref, { nativeRef });
	return ref;
}
function resolveBrowserObservation(state, observationId, browserRef, pageRef) {
	const observation = state.browserObservation;
	if (!observation || observation.id !== observationId || observation.browserRef !== browserRef || observation.pageRef !== pageRef) throw staleObservation();
	return observation;
}
function resolveBrowserElementRef(observation, elementRef) {
	const target = observation.elements.get(elementRef);
	if (!target) throw staleObservation();
	return target.nativeRef;
}
function invalidateBrowserObservation(state) {
	state.browserObservation = void 0;
	state.dialog = void 0;
}
function invalidateBrowserReferences(state) {
	state.browsers = void 0;
	state.pages = void 0;
	invalidateBrowserObservation(state);
}
function issueDialogRef(state, nativeId, browserRef, pageRef) {
	const ref = opaqueRef("dialog");
	state.dialog = {
		ref,
		nativeId,
		browserRef,
		pageRef
	};
	return ref;
}
function resolveDialogRef(state, dialogRef, browserRef, pageRef) {
	const dialog = state.dialog;
	if (!dialog || dialog.ref !== dialogRef || dialog.browserRef !== browserRef || dialog.pageRef !== pageRef) throw staleObservation();
	return dialog.nativeId;
}
function clearDialogRef(state) {
	state.dialog = void 0;
}
/**
* CUA Driver exposes only the primary-display label, not a stable display ID.
* Bind authorization to connection generation plus the complete live geometry.
*/
function issueFrame(state, geometry, capture) {
	const id = `cua:v1:${createHash("sha256").update(JSON.stringify([
		state.generation,
		geometry,
		capture
	])).digest("hex")}`;
	state.lastFrame = {
		id,
		referenceWidth: capture.referenceWidth,
		nativeWidth: geometry.screenshotWidth,
		nativeHeight: geometry.screenshotHeight,
		deliveredWidth: capture.width,
		deliveredHeight: capture.height,
		geometry: {
			width: geometry.screenWidth,
			height: geometry.screenHeight,
			scaleFactor: geometry.scaleFactor
		}
	};
	return id;
}
function verifyFrame(state, echoedId, currentScreenSize, refWidth) {
	const frame = state.lastFrame;
	if (!frame || !echoedId || echoedId !== frame.id) {
		state.lastFrame = void 0;
		throw staleFrame("the coordinate frame is missing or no longer current");
	}
	if (!(currentScreenSize.width === frame.geometry.width && currentScreenSize.height === frame.geometry.height && currentScreenSize.scaleFactor === frame.geometry.scaleFactor)) {
		state.lastFrame = void 0;
		throw staleFrame("the primary display geometry changed");
	}
	if (refWidth !== frame.referenceWidth && refWidth !== frame.deliveredWidth) {
		state.lastFrame = void 0;
		throw staleFrame("the coordinate reference width changed");
	}
	return frame;
}
//#endregion
//#region extensions/cua-computer/src/driver-result.ts
const CUA_COMMON_ACTION_NAMES = [
	"screenshot",
	...COMPUTER_USE_V2_ACTION_NAMES.slice(1, 14).filter((action) => action !== "hold_key"),
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
const NativeAppSchema = object({
	pid: number().int().nonnegative().nullable().optional(),
	bundle_id: string().nullable().optional(),
	name: string().min(1),
	running: boolean().nullable().optional(),
	active: boolean().optional(),
	kind: string().nullable().optional(),
	launch_path: string().nullable().optional(),
	last_used: string().nullable().optional()
});
const NativeBoundsSchema = object({
	x: number(),
	y: number(),
	width: number().nonnegative(),
	height: number().nonnegative()
});
const NativeWindowSchema = object({
	window_id: number().int().nonnegative(),
	pid: number().int().positive().nullable().optional(),
	app_name: string().optional(),
	title: string().optional(),
	bounds: NativeBoundsSchema,
	is_on_screen: boolean().optional(),
	minimized: boolean().optional(),
	z_index: number().int().nullable().optional()
});
const NativeElementSchema = object({
	element_index: number().int().nonnegative(),
	element_token: string().min(1).optional(),
	role: string().optional(),
	label: string().optional(),
	value: string().optional(),
	frame: object({
		x: number(),
		y: number(),
		w: number().nonnegative(),
		h: number().nonnegative()
	}).optional()
});
const NativeBrowserTabSchema = object({
	tab_id: string().min(1),
	title: string().optional(),
	url: string().optional(),
	active: boolean().optional()
});
const NativeBrowserRefSchema = object({
	ref: string().min(1),
	node: string().optional(),
	role: string().optional(),
	label: string().optional(),
	name: string().optional(),
	value: string().optional(),
	states: array(string()).optional(),
	actions: array(string()).optional(),
	frame: string().optional(),
	visibility: string().optional()
});
const MAX_DISCOVERY_ITEMS = 500;
const MAX_BROWSER_ELEMENTS = 2e3;
const PARTIAL_EFFECT = 1;
const VALUE_READBACK_EVIDENCE = 0;
function platformActions(platform) {
	return CUA_COMMON_ACTION_NAMES.filter((action) => platform === "linux" || action !== "left_mouse_down" && action !== "left_mouse_up");
}
function boundedItems(items) {
	return {
		items: items.slice(0, MAX_DISCOVERY_ITEMS),
		truncated: Math.max(0, items.length - MAX_DISCOVERY_ITEMS)
	};
}
function driverEffect(result) {
	switch (Number(result.action?.effect)) {
		case 0: return "confirmed";
		case 1:
		case 2: return "unverifiable";
		case 3: return "suspected_noop";
		case 4: throw new Error("COMPUTER_REFUSED_action_refused: CUA Driver refused the action");
		default: return;
	}
}
function driverEscalation(result) {
	const escalation = result.action?.escalation;
	if (!escalation) return;
	const recommended = {
		0: "window-pixel",
		1: "foreground",
		2: "window-pixel",
		3: "desktop"
	}[escalation.target];
	const reasonCode = {
		0: "route_unavailable",
		1: "delivery_failed",
		2: "effect_unconfirmed",
		3: "suspected_noop",
		4: "permission_required"
	}[escalation.reason];
	if (!recommended || !reasonCode) throw new Error("COMPUTER_DRIVER_ERROR: invalid CUA Driver action escalation");
	return {
		recommended,
		reasonCode
	};
}
function driverActionDetails(result) {
	const action = result.action;
	if (!action) return;
	const details = { route: [
		"accessibility",
		"synthetic_events",
		"global_input",
		"system_api",
		"dom",
		"trusted_input"
	][action.route] };
	if (action.effect === PARTIAL_EFFECT) details.partial = true;
	if (action.delivery) {
		details.deliveryMode = [
			"background",
			"foreground",
			"not_applicable",
			"unknown"
		][action.delivery.mode];
		if (action.delivery.deliveredCount !== void 0) details.deliveredCount = action.delivery.deliveredCount;
	}
	if (action.evidence?.length) details.evidence = action.evidence.map(({ kind }) => kind === VALUE_READBACK_EVIDENCE ? "value_readback" : "window_change");
	return Object.values(details).some((value) => value !== void 0) ? details : void 0;
}
function actionEnvelope(result, details) {
	const effect = driverEffect(result);
	const escalation = driverEscalation(result);
	const driverDetails = driverActionDetails(result);
	return {
		ok: true,
		...effect ? { effect } : {},
		...escalation ? { escalation } : {},
		...driverDetails || details ? { details: {
			...driverDetails,
			...details
		} } : {}
	};
}
async function callWindowTool(driver, state, name, args, signal) {
	const callGeneration = driver.generation;
	const stateWasCurrent = state.generation === callGeneration;
	const result = await driver.callTool(name, args, signal);
	if (stateWasCurrent && driver.generation !== callGeneration) {
		adoptGeneration(state, driver.generation);
		throw new Error("COMPUTER_STALE_OBSERVATION: computer driver generation changed during action");
	}
	adoptGeneration(state, driver.generation);
	const refusalCode = (result.isError ? result.errorCode : void 0) ?? structuredRefusalCode(result);
	if (result.isError || refusalCode) {
		if (refusalCode && [
			"browser_binding_stale",
			"browser_tab_not_found",
			"browser_ref_stale",
			"browser_reconnect_exhausted"
		].includes(refusalCode)) {
			invalidateBrowserReferences(state);
			throw new Error("COMPUTER_STALE_OBSERVATION: take a fresh browser observation and retry");
		}
		const code = refusalCode ? `COMPUTER_REFUSED_${refusalCode}` : "COMPUTER_DRIVER_ERROR";
		throw new Error(`${code}: ${result.text || `${name} failed`}`);
	}
	return result;
}
function structuredRefusalCode(result) {
	if (!result.structuredJson) return;
	try {
		const value = JSON.parse(result.structuredJson);
		return value.status === "refused" && typeof value.refusal?.code === "string" ? value.refusal.code : void 0;
	} catch {
		return;
	}
}
function projectedToolDetails(result, tool) {
	if (!result.structuredJson) throw new Error(`COMPUTER_DRIVER_ERROR: ${tool} returned no structuredContent`);
	try {
		const value = JSON.parse(result.structuredJson);
		if (value && typeof value === "object" && !Array.isArray(value)) return value;
	} catch {}
	throw new Error(`COMPUTER_DRIVER_ERROR: ${tool} returned invalid structuredContent`);
}
function nativeWindows(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry) => {
		const parsed = NativeWindowSchema.safeParse(entry);
		return parsed.success && parsed.data.pid ? [parsed.data] : [];
	});
}
function projectWindows(state, windows) {
	const bounded = boundedItems(windows);
	return {
		windows: bounded.items.map((window) => ({
			windowRef: issueWindowRef(state, {
				pid: window.pid,
				windowId: window.window_id
			}),
			...window.app_name ? { appName: window.app_name } : {},
			...window.title ? { title: window.title } : {},
			bounds: window.bounds,
			...window.is_on_screen !== void 0 ? { isOnScreen: window.is_on_screen } : {},
			...window.minimized !== void 0 ? { minimized: window.minimized } : {},
			...window.z_index !== void 0 ? { zIndex: window.z_index } : {}
		})),
		...bounded.truncated ? { truncatedWindows: bounded.truncated } : {}
	};
}
function projectApps(state, value) {
	const apps = (Array.isArray(value) ? value : []).flatMap((entry) => {
		const parsed = NativeAppSchema.safeParse(entry);
		if (!parsed.success) return [];
		return [{
			app: issueAppRef(state, {
				...parsed.data.pid ? { pid: parsed.data.pid } : {},
				name: parsed.data.name,
				...parsed.data.bundle_id ? { bundleId: parsed.data.bundle_id } : {},
				...parsed.data.launch_path ? { launchPath: parsed.data.launch_path } : {}
			}),
			name: parsed.data.name,
			...parsed.data.running !== void 0 ? { running: parsed.data.running } : {},
			...parsed.data.active !== void 0 ? { active: parsed.data.active } : {},
			...parsed.data.kind ? { kind: parsed.data.kind } : {},
			...parsed.data.last_used ? { lastUsed: parsed.data.last_used } : {}
		}];
	});
	const bounded = boundedItems(apps);
	return {
		apps: bounded.items,
		totalApps: apps.length,
		...bounded.truncated ? { truncatedApps: bounded.truncated } : {}
	};
}
function projectProcesses(value) {
	const processes = boundedItems(Array.isArray(value) ? value : []);
	return {
		processes: processes.items,
		...processes.truncated ? { truncatedProcesses: processes.truncated } : {}
	};
}
function observationImage(result, width, height) {
	const image = result.images.find((entry) => entry.mimeType === "image/png" || entry.mimeType === "image/jpeg");
	const base64 = image ? canonicalizeBase64(image.dataBase64) : void 0;
	if (image && !base64) throw new Error("COMPUTER_DRIVER_ERROR: CUA Driver returned malformed observation image base64");
	return {
		...base64 ? {
			base64,
			format: image?.mimeType === "image/jpeg" ? "jpeg" : "png"
		} : {},
		...typeof width === "number" && width >= 1 ? { width: Math.trunc(width) } : {},
		...typeof height === "number" && height >= 1 ? { height: Math.trunc(height) } : {}
	};
}
function windowObservation(result, state, windowRef, options = {}) {
	const structured = projectedToolDetails(result, options.fromZoom ? "zoom" : "get_window_state");
	const observation = issueObservation(state, windowRef, options);
	const snapshotId = typeof structured.snapshot_id === "string" ? structured.snapshot_id : void 0;
	const rawElements = Array.isArray(structured.elements) ? structured.elements : [];
	let omittedElementCount = 0;
	const elements = rawElements.slice(0, 2e3).flatMap((entry) => {
		const parsed = NativeElementSchema.safeParse(entry);
		if (!parsed.success || !parsed.data.frame) {
			omittedElementCount += 1;
			return [];
		}
		return [{
			elementRef: issueElementRef(observation, {
				elementIndex: parsed.data.element_index,
				...parsed.data.element_token ? { elementToken: parsed.data.element_token } : {},
				...snapshotId ? { snapshotId } : {}
			}),
			role: parsed.data.role?.trim() || "unknown",
			...parsed.data.label !== void 0 ? { label: parsed.data.label } : {},
			...parsed.data.value !== void 0 ? { value: parsed.data.value } : {},
			bounds: {
				x: parsed.data.frame.x,
				y: parsed.data.frame.y,
				width: parsed.data.frame.w,
				height: parsed.data.frame.h
			}
		}];
	});
	const action = actionEnvelope(result, {
		coordinateSpace: "image-pixels",
		...typeof structured.total_element_count === "number" ? { totalElementCount: structured.total_element_count } : {},
		...rawElements.length > 2e3 ? { truncatedElements: rawElements.length - 2e3 } : {},
		...omittedElementCount ? { omittedElementsWithoutBounds: omittedElementCount } : {},
		...structured.degraded === true ? { degraded: true } : {},
		...typeof structured.degraded_reason === "string" ? { degradedReason: structured.degraded_reason } : {},
		...typeof structured.screenshot_error === "string" ? { screenshotError: structured.screenshot_error } : {}
	});
	return {
		...action,
		observation: {
			kind: "window",
			...observationImage(result, structured[options.fromZoom ? "width" : "screenshot_width"], structured[options.fromZoom ? "height" : "screenshot_height"]),
			observationId: observation.id,
			...elements.length ? { elements } : {}
		},
		...!action.escalation && structured.escalation && typeof structured.escalation === "object" ? { escalation: {
			recommended: "window-pixel",
			reasonCode: "ax_tree_unavailable"
		} } : {}
	};
}
function browserBinding(result, state, windowRef) {
	const structured = projectedToolDetails(result, "get_browser_state");
	if (structured.mode !== "bind" || typeof structured.target_id !== "string" || structured.target_id.length === 0 || !Array.isArray(structured.tabs)) throw new Error("COMPUTER_DRIVER_ERROR: invalid browser bind result");
	const browserRef = issueBrowserRef(state, {
		targetId: structured.target_id,
		windowRef
	});
	const bounded = boundedItems(structured.tabs.flatMap((entry) => {
		const parsed = NativeBrowserTabSchema.safeParse(entry);
		if (!parsed.success) return [];
		const { tab_id: tabId, ...details } = parsed.data;
		return [{
			pageRef: issuePageRef(state, browserRef, tabId),
			...details
		}];
	}));
	return {
		ok: true,
		details: {
			browserRef,
			pages: bounded.items,
			...bounded.truncated ? { truncatedPages: bounded.truncated } : {},
			...typeof structured.binding_quality === "string" ? { bindingQuality: structured.binding_quality } : {},
			...typeof structured.binding_route === "string" ? { bindingRoute: structured.binding_route } : {},
			...typeof structured.mutation_allowed === "boolean" ? { mutationAllowed: structured.mutation_allowed } : {},
			...typeof structured.native_title === "string" ? { nativeTitle: structured.native_title } : {}
		}
	};
}
function browserObservation(result, state, target) {
	const structured = projectedToolDetails(result, "get_browser_state");
	if (structured.mode !== "snapshot" || structured.target_id !== target.targetId || structured.tab_id !== target.tabId) throw new Error("COMPUTER_DRIVER_ERROR: invalid browser snapshot result");
	const observation = issueBrowserObservation(state, target.browserRef, target.pageRef);
	const elements = [];
	const seen = /* @__PURE__ */ new Set();
	for (const [kind, values] of [["action", structured.refs], ["content", structured.content_refs]]) {
		if (!Array.isArray(values)) continue;
		for (const value of values) {
			const parsed = NativeBrowserRefSchema.safeParse(value);
			if (!parsed.success || seen.has(parsed.data.ref)) continue;
			const { ref, ...details } = parsed.data;
			seen.add(ref);
			elements.push({
				elementRef: issueBrowserElementRef(observation, ref),
				kind,
				...details
			});
		}
	}
	const boundedElements = elements.slice(0, MAX_BROWSER_ELEMENTS);
	const page = structured.page && typeof structured.page === "object" && !Array.isArray(structured.page) ? structured.page : void 0;
	return {
		ok: true,
		observation: {
			kind: "browser",
			...observationImage(result, structured.screenshot_width, structured.screenshot_height),
			observationId: observation.id
		},
		details: {
			browserRef: target.browserRef,
			pageRef: target.pageRef,
			elements: boundedElements,
			...elements.length > MAX_BROWSER_ELEMENTS ? { truncatedElements: elements.length - MAX_BROWSER_ELEMENTS } : {},
			...typeof structured.snapshot_id === "string" ? { snapshot: { format: "dom_refs_v1" } } : structured.snapshot && typeof structured.snapshot === "object" && !Array.isArray(structured.snapshot) ? { snapshot: projectSemanticBrowserSnapshot(structured.snapshot) } : {},
			...typeof structured.url === "string" ? { url: structured.url } : {},
			...page ? { page: {
				...typeof page.url === "string" ? { url: page.url } : {},
				...typeof page.title === "string" ? { title: page.title } : {}
			} } : {},
			...typeof structured.truncated === "boolean" ? { truncated: structured.truncated } : {}
		}
	};
}
function browserToolEnvelope(result, tool) {
	if (tool === "browser_click" || tool === "browser_type" || tool === "browser_pointer") return actionEnvelope(result);
	const structured = projectedToolDetails(result, tool);
	const details = {};
	if (tool === "browser_prepare") {
		for (const [source, destination] of [
			["prepared", "prepared"],
			["action", "action"],
			["message", "message"],
			["side_effects", "sideEffects"]
		]) if (structured[source] !== void 0) details[destination] = structured[source];
		const endpointOwnership = structured.endpoint_ownership;
		if (endpointOwnership && typeof endpointOwnership === "object" && !Array.isArray(endpointOwnership) && typeof endpointOwnership.method === "string") details.endpointOwnership = { method: endpointOwnership.method };
	} else if (tool === "browser_navigate") {
		if (typeof structured.url === "string") details.url = structured.url;
		if (typeof structured.refs_invalidated === "boolean") details.refsInvalidated = structured.refs_invalidated;
	} else if (tool === "browser_set_input_files") {
		if (typeof structured.file_count === "number") details.fileCount = structured.file_count;
		if (typeof structured.frame === "string") details.frame = structured.frame;
	} else if (tool === "browser_download") {
		if (typeof structured.status === "string") details.status = structured.status;
		if (typeof structured.bytes === "number") details.bytes = structured.bytes;
	}
	return {
		ok: true,
		...Object.keys(details).length ? { details } : {}
	};
}
function projectSemanticBrowserSnapshot(snapshot) {
	return {
		format: "semantic_v2",
		...typeof snapshot.complete === "boolean" ? { complete: snapshot.complete } : {},
		...typeof snapshot.selected_nodes === "number" ? { selectedNodes: snapshot.selected_nodes } : {},
		...typeof snapshot.total_nodes === "number" ? { totalNodes: snapshot.total_nodes } : {},
		...snapshot.omitted && typeof snapshot.omitted === "object" && !Array.isArray(snapshot.omitted) ? { omitted: snapshot.omitted } : {},
		...typeof snapshot.continuation === "string" ? { continuation: snapshot.continuation } : {}
	};
}
function browserDialogEnvelope(result, state, target) {
	const structured = projectedToolDetails(result, "browser_dialog");
	const present = structured.present === true;
	if (!present) clearDialogRef(state);
	const details = { present };
	if (typeof structured.kind === "string") details.kind = structured.kind;
	if (present && typeof structured.dialog_id === "string") details.dialogRef = issueDialogRef(state, structured.dialog_id, target.browserRef, target.pageRef);
	if (typeof structured.action === "string") details.action = structured.action;
	return {
		ok: true,
		details
	};
}
//#endregion
//#region extensions/cua-computer/src/execution-resources.ts
const RESOURCE_HANDLE_PREFIX = "openclaw:computer-resource:v1:";
const RESOURCE_ROOT_NAME = "cua-computer-resources";
const MAX_RESOURCE_TREE_ENTRIES = 1e4;
function createLazyCuaExecutionResources() {
	let resourcesPromise;
	const resources = () => resourcesPromise ??= createCuaExecutionResources();
	return {
		createDirectory: async (label) => await (await resources()).createDirectory(label),
		resolveFiles: async (handles) => await (await resources()).resolveFiles(handles),
		validateDirectoryTree: async (handle) => await (await resources()).validateDirectoryTree(handle),
		captureFiles: async (handle) => await (await resources()).captureFiles(handle),
		discard: async (handle) => await (await resources()).discard(handle),
		dispose: async (discard) => {
			if (resourcesPromise) await (await resourcesPromise).dispose(discard);
		}
	};
}
function resourceError(message) {
	return /* @__PURE__ */ new Error(`COMPUTER_INVALID_RESOURCE: ${message}`);
}
function newHandle() {
	return `${RESOURCE_HANDLE_PREFIX}${randomUUID()}`;
}
function safeLabel(value) {
	return value.replaceAll(/[^a-z0-9-]/giu, "-").slice(0, 32) || "resource";
}
async function requireEntry(resources, executionRoot, handle, kind) {
	if (!handle.startsWith(RESOURCE_HANDLE_PREFIX)) throw resourceError("malformed resource handle");
	const entry = resources.get(handle);
	if (!entry || entry.kind !== kind) throw resourceError("resource handle is unknown in this provider execution");
	let stat;
	let resolved;
	try {
		stat = await executionRoot.stat(entry.relativePath);
		resolved = await executionRoot.resolve(entry.relativePath);
	} catch (error) {
		throw resourceError(`resource is no longer a safe ${kind}: ${String(error)}`);
	}
	if (stat.isSymbolicLink || (kind === "file" ? !stat.isFile : !stat.isDirectory)) throw resourceError(`resource is no longer a regular ${kind}`);
	return {
		entry,
		path: resolved
	};
}
async function createCuaExecutionResources() {
	const preferredTmpRoot = await root(resolvePreferredOpenClawTmpDir(), {
		hardlinks: "reject",
		mode: 448,
		symlinks: "reject"
	});
	await preferredTmpRoot.mkdir(RESOURCE_ROOT_NAME);
	const baseRoot = await root(await preferredTmpRoot.resolve(RESOURCE_ROOT_NAME), {
		hardlinks: "reject",
		mode: 448,
		symlinks: "reject"
	});
	const executionDirectory = `execution-${randomUUID()}`;
	await baseRoot.mkdir(executionDirectory);
	const executionPath = await baseRoot.resolve(executionDirectory);
	const executionRoot = await root(executionPath, {
		hardlinks: "reject",
		mode: 448,
		symlinks: "reject"
	});
	const resources = /* @__PURE__ */ new Map();
	const handlesByPath = /* @__PURE__ */ new Map();
	let disposed = false;
	const assertActive = () => {
		if (disposed) throw resourceError("provider execution is closed");
	};
	const register = (kind, relativePath) => {
		const existing = handlesByPath.get(relativePath);
		if (existing) return existing;
		const handle = newHandle();
		resources.set(handle, {
			kind,
			relativePath
		});
		handlesByPath.set(relativePath, handle);
		return handle;
	};
	const removeHandle = async (handle) => {
		const entry = resources.get(handle);
		if (!entry) return;
		await removePathWithinRoot({
			rootDir: executionRoot.rootReal,
			relativePath: entry.relativePath,
			recursive: true,
			force: true
		});
		resources.delete(handle);
		handlesByPath.delete(entry.relativePath);
	};
	return {
		async createDirectory(kind) {
			assertActive();
			const relativePath = `${safeLabel(kind)}-${randomUUID()}`;
			await executionRoot.mkdir(relativePath);
			return {
				handle: register(kind, relativePath),
				path: await executionRoot.resolve(relativePath)
			};
		},
		async resolveFiles(handles) {
			assertActive();
			return await Promise.all(handles.map(async (handle) => (await requireEntry(resources, executionRoot, handle, "file")).path));
		},
		async validateDirectoryTree(handle) {
			assertActive();
			const directory = await requireEntry(resources, executionRoot, handle, "recording");
			let visited = 0;
			const visit = async (relativePath) => {
				for (const child of await executionRoot.list(relativePath, { withFileTypes: true })) {
					visited += 1;
					if (visited > MAX_RESOURCE_TREE_ENTRIES) throw resourceError("resource tree is too large");
					if (child.isSymbolicLink || !child.isDirectory && !child.isFile) throw resourceError("resource tree contains an unsupported entry");
					const childPath = path.join(relativePath, child.name);
					await executionRoot.resolve(childPath);
					if (child.isDirectory) await visit(childPath);
				}
			};
			await visit(directory.entry.relativePath);
			return directory.path;
		},
		async captureFiles(handle) {
			assertActive();
			const directory = await requireEntry(resources, executionRoot, handle, "browser-download");
			const handles = [];
			for (const child of await executionRoot.list(directory.entry.relativePath, { withFileTypes: true })) {
				if (child.isSymbolicLink || !child.isFile) continue;
				const relativePath = path.join(directory.entry.relativePath, child.name);
				await executionRoot.resolve(relativePath);
				handles.push(register("file", relativePath));
			}
			return handles;
		},
		async discard(handle) {
			assertActive();
			await removeHandle(handle);
		},
		async dispose(discard) {
			if (disposed) return;
			disposed = true;
			resources.clear();
			handlesByPath.clear();
			if (discard) await removePathWithinRoot({
				rootDir: baseRoot.rootReal,
				relativePath: executionDirectory,
				recursive: true,
				force: true
			});
		}
	};
}
//#endregion
//#region extensions/cua-computer/src/mcp-driver-client.ts
const MCP_PROTOCOL_VERSION = "2025-06-18";
const MCP_STARTUP_TIMEOUT_MS = 1e4;
const MCP_REQUEST_TIMEOUT_MS = 12e4;
const MAX_PENDING_REQUESTS = 64;
const MAX_MCP_LINE_BYTES = 268435456;
const MCP_DESKTOP_TARGET = {
	kind: "desktop",
	display_id: "primary"
};
const ACTION_RESULT_TOOLS = /* @__PURE__ */ new Set([
	"click",
	"double_click",
	"right_click",
	"scroll",
	"drag",
	"mouse_drag",
	"parallel_mouse_drag",
	"move_cursor",
	"mouse_button_down",
	"mouse_button_up",
	"type_text",
	"type_text_chars",
	"press_key",
	"hotkey",
	"set_value",
	"set_window_frame",
	"invoke_menu",
	"browser_click",
	"browser_pointer",
	"browser_type"
]);
function driverUnavailable(message, cause) {
	return new Error(`COMPUTER_DRIVER_UNAVAILABLE: ${message}`, { cause });
}
function driverProtocolError(message, cause) {
	return new Error(`COMPUTER_DRIVER_ERROR: ${message}`, { cause });
}
function mappedEnum(value, values, label) {
	if (typeof value !== "string") throw driverProtocolError(`CUA MCP ${label} is missing`);
	const index = values.indexOf(value);
	if (index < 0) throw driverProtocolError(`CUA MCP ${label} is invalid`);
	return index;
}
function mcpActionResult(tool, structured) {
	if (!ACTION_RESULT_TOOLS.has(tool)) return;
	const value = asOptionalRecord(structured);
	if (!value) throw driverProtocolError(`CUA MCP ${tool} returned no ActionResult`);
	const delivery = asOptionalRecord(value.delivery);
	const escalation = asOptionalRecord(value.escalation);
	const evidence = Array.isArray(value.evidence) ? value.evidence : void 0;
	return {
		effect: mappedEnum(value.effect, [
			"confirmed",
			"partial",
			"unverifiable",
			"suspected_noop",
			"refused"
		], "action effect"),
		route: mappedEnum(value.route, [
			"accessibility",
			"synthetic_events",
			"global_input",
			"system_api",
			"dom",
			"trusted_input"
		], "action route"),
		...delivery ? { delivery: {
			mode: mappedEnum(delivery.mode, [
				"background",
				"foreground",
				"not_applicable",
				"unknown"
			], "delivery mode"),
			...typeof delivery.delivered_count === "number" ? { deliveredCount: delivery.delivered_count } : {}
		} } : {},
		...evidence ? { evidence: evidence.map((entry) => ({ kind: mappedEnum(asOptionalRecord(entry)?.kind, ["value_readback", "window_change"], "evidence kind") })) } : {},
		...escalation ? { escalation: {
			target: mappedEnum(escalation.target, [
				"pixel",
				"foreground",
				"page",
				"session"
			], "escalation target"),
			reason: mappedEnum(escalation.reason, [
				"route_unavailable",
				"delivery_failed",
				"effect_unconfirmed",
				"suspected_noop",
				"permission_required"
			], "escalation reason")
		} } : {}
	};
}
function normalizeMcpToolResult(tool, raw) {
	const value = asOptionalRecord(raw);
	if (!value) throw driverProtocolError(`CUA MCP ${tool} returned a non-object result`);
	const content = Array.isArray(value.content) ? value.content : [];
	const text = content.flatMap((entry) => entry?.type === "text" && typeof entry.text === "string" ? [entry.text] : []);
	const images = content.flatMap((entry) => entry?.type === "image" && typeof entry.data === "string" && typeof entry.mimeType === "string" ? [{
		dataBase64: entry.data,
		mimeType: entry.mimeType
	}] : []);
	const structured = asOptionalRecord(value.structuredContent);
	const errorCode = typeof structured?.code === "string" ? structured.code : typeof asOptionalRecord(structured?.refusal)?.code === "string" ? asOptionalRecord(structured?.refusal)?.code : void 0;
	const isError = value.isError === true;
	return {
		text: text.join("\n"),
		images,
		...structured ? { structuredJson: JSON.stringify(structured) } : {},
		isError,
		...errorCode ? { errorCode } : {},
		...!isError ? { action: mcpActionResult(tool, structured) } : {},
		degraded: structured?.degraded === true,
		rawJson: JSON.stringify(raw)
	};
}
function createClient(binaryPath, socketPath, env) {
	const proxyEnvironment = { ...env };
	for (const key of Object.keys(proxyEnvironment)) if (key.startsWith("CUA_DRIVER_") || key === "CUA_TELEMETRY_ENABLED") delete proxyEnvironment[key];
	return import("../../plugin-sdk/agent-harness-runtime.js").then(({ mcpStdioRuntime }) => mcpStdioRuntime.load()).then(({ createMcpStdioClient }) => createMcpStdioClient({
		command: binaryPath,
		args: [
			"mcp",
			"--embedded",
			"--socket",
			socketPath
		],
		env: {
			...proxyEnvironment,
			CUA_DRIVER_RS_TELEMETRY_ENABLED: "false",
			CUA_DRIVER_RS_UPDATE_CHECK: "false"
		},
		clientInfo: {
			name: "openclaw-cua-computer",
			version: "1"
		},
		protocolVersion: MCP_PROTOCOL_VERSION,
		startupTimeoutMs: MCP_STARTUP_TIMEOUT_MS,
		maxPendingRequests: MAX_PENDING_REQUESTS,
		maxFrameBytes: MAX_MCP_LINE_BYTES,
		errors: {
			unavailable: (message, cause) => driverUnavailable(`CUA MCP ${message}`, cause),
			protocol: (message, cause) => driverProtocolError(`CUA MCP ${message}`, cause)
		}
	}));
}
function sessionState(value) {
	if (value.isError || !value.structuredJson) throw driverProtocolError(value.text || "CUA MCP session operation failed");
	let structured;
	try {
		structured = asOptionalRecord(JSON.parse(value.structuredJson));
	} catch (error) {
		throw driverProtocolError("CUA MCP session operation returned invalid JSON", error);
	}
	if (!structured) throw driverProtocolError("CUA MCP session operation returned invalid state");
	return {
		session: typeof structured.session === "string" ? structured.session : "",
		captureScope: mappedEnum(structured.capture_scope, [
			"auto",
			"window",
			"desktop"
		], "capture scope"),
		effectiveScope: mappedEnum(structured.effective_scope, ["window", "desktop"], "effective scope"),
		desktopCaptureAuthorized: structured.desktop_capture_authorized === true,
		desktopUnlocked: structured.desktop_unlocked === true,
		...typeof structured.escalation_reason === "string" ? { escalationReason: mappedEnum(structured.escalation_reason, [
			"ax_tree_pixel_mismatch",
			"background_delivery_failed",
			"foreground_ineffective",
			"no_window_target",
			"other"
		], "escalation reason") } : {},
		...typeof structured.escalation_detail === "string" ? { escalationDetail: structured.escalation_detail } : {}
	};
}
var McpCuaDriverSession = class {
	constructor(client) {
		this.client = client;
		this.generation = randomUUID();
		this.publicSession = `openclaw-${randomUUID()}`;
		this.started = false;
		this.disposed = false;
		client.then((resolved) => {
			this.resolved = resolved;
		}).catch(() => {});
	}
	isAvailable() {
		return !this.disposed && this.resolved?.isAvailable() === true;
	}
	resetAvailabilityCache() {}
	async callTool(name, args, signal) {
		return await this.sessionTool(name, args, signal);
	}
	async getCursorPosition(signal) {
		return await this.sessionTool("get_cursor_position", {}, signal);
	}
	async escalateScope(_reason, signal) {
		return sessionState(await this.sessionTool("get_session_state", {}, signal));
	}
	async getDesktopState(signal) {
		return await this.sessionTool("get_desktop_state", {}, signal);
	}
	async getScreenSize(signal) {
		return await this.sessionTool("get_screen_size", {}, signal);
	}
	async click(input, signal) {
		return await this.sessionTool("click", {
			x: input.x,
			y: input.y,
			button: [
				"left",
				"right",
				"middle"
			][input.button],
			count: input.count,
			target: MCP_DESKTOP_TARGET
		}, signal);
	}
	async drag(input, signal) {
		return await this.sessionTool("drag", {
			from_x: input.fromX,
			from_y: input.fromY,
			to_x: input.toX,
			to_y: input.toY,
			...input.durationMs === void 0 ? {} : { duration_ms: Number(input.durationMs) },
			target: MCP_DESKTOP_TARGET
		}, signal);
	}
	async moveCursor(input, signal) {
		return await this.sessionTool("move_cursor", {
			x: input.x,
			y: input.y,
			target: MCP_DESKTOP_TARGET
		}, signal);
	}
	async scroll(input, signal) {
		return await this.sessionTool("scroll", {
			x: input.x,
			y: input.y,
			direction: [
				"up",
				"down",
				"left",
				"right"
			][input.direction],
			by: "line",
			amount: Number(input.amount),
			target: MCP_DESKTOP_TARGET
		}, signal);
	}
	async typeText(text, signal) {
		return await this.sessionTool("type_text", {
			text,
			target: MCP_DESKTOP_TARGET
		}, signal);
	}
	async pressKey(input, signal) {
		return await this.sessionTool("press_key", {
			key: input.key,
			modifiers: input.modifiers,
			target: MCP_DESKTOP_TARGET
		}, signal);
	}
	async dispose() {
		if (this.disposed) return;
		this.disposed = true;
		let failure;
		try {
			await this.startPromise;
		} catch (error) {
			failure = error;
		}
		try {
			const client = await this.client;
			if (client.isAvailable() && this.started) try {
				await this.tool("end_session", {});
			} catch (error) {
				failure ??= error;
			}
			await client.stop();
		} catch (error) {
			failure ??= error;
		}
		if (failure) throw failure instanceof Error ? failure : driverUnavailable("CUA MCP cleanup failed", failure);
	}
	async sessionTool(name, args, signal) {
		await this.ensureStarted(signal);
		return await this.tool(name, args, signal);
	}
	async tool(name, args, signal) {
		return normalizeMcpToolResult(name, await (await this.client).request("tools/call", {
			name,
			arguments: {
				...args,
				session: this.publicSession
			}
		}, {
			timeoutMs: MCP_REQUEST_TIMEOUT_MS,
			signal
		}));
	}
	async ensureStarted(signal) {
		if (this.disposed) throw driverUnavailable("cua-computer is stopping");
		if (!this.startPromise) {
			const start = this.tool("start_session", {}, signal).then((result) => {
				if (result.isError) throw driverProtocolError(result.text || "CUA MCP start_session failed");
				this.started = true;
			});
			this.startPromise = start;
			try {
				await start;
			} catch (error) {
				if (this.startPromise === start) this.startPromise = void 0;
				throw error;
			}
			return;
		}
		await this.startPromise;
	}
};
function createCuaMcpDriver(options) {
	return new McpCuaDriverSession(createClient(options.binaryPath, options.socketPath, options.env ?? process.env));
}
//#endregion
//#region extensions/cua-computer/src/recording-actions.ts
const RecordingStateSchema = object({
	recording: boolean(),
	enabled: boolean(),
	output_dir: string().nullable(),
	next_turn: number().int().nonnegative(),
	last_error: string().nullable(),
	video_active: boolean(),
	last_video_path: string().nullable(),
	owner: string().nullable()
});
const ReplayTurnSchema = object({
	turn: string(),
	tool: string().optional(),
	ok: boolean(),
	result_summary: string().optional(),
	parse_error: string().optional()
});
const ReplayResultSchema = object({
	directory: string(),
	attempted: number().int().nonnegative(),
	succeeded: number().int().nonnegative(),
	failed: number().int().nonnegative(),
	stop_on_error: boolean(),
	turns: array(ReplayTurnSchema),
	first_failure: object({
		turn: string(),
		tool: string(),
		error: string()
	}).optional()
});
const MAX_REPLAY_TURNS = 200;
function driverError(result, tool) {
	const code = result.errorCode ? `COMPUTER_REFUSED_${result.errorCode}` : "COMPUTER_DRIVER_ERROR";
	return /* @__PURE__ */ new Error(`${code}: ${tool} failed; inspect node logs and resource state before retrying`);
}
function structured(result, tool) {
	if (result.isError) throw driverError(result, tool);
	if (!result.structuredJson) throw new Error(`COMPUTER_DRIVER_ERROR: ${tool} returned no structuredContent`);
	try {
		return JSON.parse(result.structuredJson);
	} catch (error) {
		throw new Error(`COMPUTER_DRIVER_ERROR: ${tool} returned invalid structuredContent`, { cause: error });
	}
}
function projectRecordingState(native, resourceHandle) {
	return {
		recording: native.enabled,
		nextTurn: native.next_turn,
		videoActive: native.video_active,
		...native.last_error ? { videoError: "video unavailable; per-turn trajectory capture remains active" } : {},
		...resourceHandle ? { resourceHandle } : {}
	};
}
async function stopOwnedRecording(params) {
	const active = params.state.active;
	params.state.active = void 0;
	if (!active) return;
	let failure;
	try {
		const result = await params.driver.callTool("stop_recording", {});
		if (result.isError) failure = driverError(result, "stop_recording");
	} catch (error) {
		failure = error;
	}
	if (params.discard) try {
		await params.resources.discard(active.resourceHandle);
	} catch (error) {
		failure ??= error;
	}
	if (failure) throw failure instanceof Error ? failure : new Error("CUA recording cleanup failed", { cause: failure });
}
function projectReplayTurn(turn) {
	const projected = {
		turn: turn.turn,
		ok: turn.ok
	};
	if (turn.tool) projected.tool = turn.tool;
	if (turn.parse_error) projected.parseError = true;
	return projected;
}
async function closeRecordingExecution(params) {
	await stopOwnedRecording({
		...params,
		discard: params.reason !== "completion"
	});
}
async function handleRecordingAct(driver, state, resources, input, signal) {
	switch (input.action) {
		case "get_recording_state": {
			if (!state.active) return JSON.stringify({
				ok: true,
				details: { recording: false }
			});
			const native = RecordingStateSchema.parse(structured(await driver.callTool("get_recording_state", {}, signal), "get_recording_state"));
			return JSON.stringify({
				ok: true,
				details: projectRecordingState(native, state.active.resourceHandle)
			});
		}
		case "start_recording": {
			if (state.active) throw new Error("COMPUTER_RECORDING_ACTIVE: stop the current recording before starting another");
			const resource = await resources.createDirectory("recording");
			try {
				const result = await driver.callTool("start_recording", {
					output_dir: resource.path,
					record_video: input.recordVideo ?? false
				}, signal);
				const native = RecordingStateSchema.parse(structured(result, "start_recording"));
				if (!native.enabled) throw new Error("COMPUTER_DRIVER_ERROR: start_recording returned disabled state");
				state.active = { resourceHandle: resource.handle };
				return JSON.stringify({
					ok: true,
					details: projectRecordingState(native, resource.handle)
				});
			} catch (error) {
				await driver.dispose().catch(() => {});
				await resources.discard(resource.handle).catch(() => {});
				throw error;
			}
		}
		case "stop_recording": {
			const active = state.active;
			if (!active) return JSON.stringify({
				ok: true,
				details: { recording: false }
			});
			state.active = void 0;
			const native = RecordingStateSchema.parse(structured(await driver.callTool("stop_recording", {}, signal), "stop_recording"));
			return JSON.stringify({
				ok: true,
				details: projectRecordingState(native, active.resourceHandle)
			});
		}
		case "replay_trajectory": {
			const resourceHandle = input.resourceHandle;
			if (!resourceHandle) throw new Error("COMPUTER_INVALID_REQUEST: resourceHandle is required for replay_trajectory");
			const directory = await resources.validateDirectoryTree(resourceHandle);
			const native = ReplayResultSchema.parse(structured(await driver.callTool("replay_trajectory", {
				dir: directory,
				...input.delayMs !== void 0 ? { delay_ms: input.delayMs } : {},
				...input.stopOnError !== void 0 ? { stop_on_error: input.stopOnError } : {}
			}, signal), "replay_trajectory"));
			return JSON.stringify({
				ok: true,
				details: {
					resourceHandle,
					attempted: native.attempted,
					succeeded: native.succeeded,
					failed: native.failed,
					stopOnError: native.stop_on_error,
					turns: native.turns.slice(0, MAX_REPLAY_TURNS).map(projectReplayTurn),
					...native.turns.length > MAX_REPLAY_TURNS ? { truncatedTurns: native.turns.length - MAX_REPLAY_TURNS } : {},
					...native.first_failure ? { firstFailure: {
						turn: native.first_failure.turn,
						tool: native.first_failure.tool
					} } : {}
				}
			});
		}
		default: return;
	}
}
//#endregion
//#region extensions/cua-computer/src/action-targets.ts
function requireWindowTarget(driver, state, params) {
	verifyGeneration(state, driver.generation);
	if (!params.windowRef) throw new Error(`COMPUTER_INVALID_REQUEST: windowRef is required for ${params.action}`);
	return {
		ref: params.windowRef,
		target: resolveWindowRef(state, params.windowRef)
	};
}
function observationTarget(state, params, windowRef) {
	if (!params.observationId) throw new Error(`COMPUTER_STALE_OBSERVATION: observationId is required for ${params.action}`);
	return resolveObservation(state, params.observationId, windowRef);
}
function elementArgs(state, params, windowRef) {
	if (!params.elementRef) return;
	const element = resolveElementRef(observationTarget(state, params, windowRef), params.elementRef);
	return element.elementToken ? { element_token: element.elementToken } : {
		element_index: element.elementIndex,
		...element.snapshotId ? { snapshot_id: element.snapshotId } : {}
	};
}
function browserTarget(driver, state, params) {
	verifyGeneration(state, driver.generation);
	if (!params.browserRef || !params.pageRef) throw new Error(`COMPUTER_INVALID_REQUEST: browserRef and pageRef are required for ${params.action}`);
	const browser = resolveBrowserRef(state, params.browserRef);
	const page = resolvePageRef(state, params.browserRef, params.pageRef);
	return {
		browserRef: params.browserRef,
		pageRef: params.pageRef,
		targetId: browser.targetId,
		tabId: page.tabId
	};
}
function browserElement(state, params, target, elementRef = params.elementRef) {
	if (!elementRef) return;
	if (!params.observationId) throw new Error(`COMPUTER_STALE_OBSERVATION: observationId is required for ${params.action}`);
	return resolveBrowserElementRef(resolveBrowserObservation(state, params.observationId, target.browserRef, target.pageRef), elementRef);
}
function windowPointArgs(state, params, windowRef, point, label) {
	if (point.x === void 0 || point.y === void 0) throw new Error(`COMPUTER_INVALID_REQUEST: ${label} coordinates are required`);
	const observation = observationTarget(state, params, windowRef);
	return {
		x: point.x,
		y: point.y,
		...observation.fromZoom ? { from_zoom: true } : {}
	};
}
//#endregion
//#region extensions/cua-computer/src/browser-actions.ts
async function handleBrowserAct(driver, state, resources, input, signal) {
	switch (input.action) {
		case "get_browser_state": {
			verifyGeneration(state, driver.generation);
			if (input.windowRef) {
				const window = resolveWindowRef(state, input.windowRef);
				const result = await callWindowTool(driver, state, "get_browser_state", {
					pid: window.pid,
					window_id: window.windowId
				}, signal);
				return JSON.stringify(browserBinding(result, state, input.windowRef));
			}
			const target = browserTarget(driver, state, input);
			const snapshotFormat = input.snapshotFormat ?? "dom_refs_v1";
			if (snapshotFormat === "dom_refs_v1" && (input.elementRef || input.query || input.continuation)) throw new Error("COMPUTER_INVALID_REQUEST: elementRef, query, and continuation require snapshotFormat=semantic_v2");
			const scopeRef = browserElement(state, input, target);
			const result = await callWindowTool(driver, state, "get_browser_state", {
				target_id: target.targetId,
				tab_id: target.tabId,
				snapshot_format: snapshotFormat,
				include_screenshot: input.includeScreenshot ?? true,
				...scopeRef ? { scope_ref: scopeRef } : {},
				...input.query ? { query: input.query } : {},
				...input.continuation ? { continuation: input.continuation } : {}
			}, signal);
			return JSON.stringify(browserObservation(result, state, target));
		}
		case "browser_prepare": {
			const { target } = requireWindowTarget(driver, state, input);
			const profile = input.profile ?? "isolated_new";
			if (profile === "isolated_named" && !input.profileName) throw new Error("COMPUTER_INVALID_REQUEST: profileName is required for an isolated_named browser profile");
			if (profile === "isolated_new" && input.profileName) throw new Error("COMPUTER_INVALID_REQUEST: profileName is valid only for an isolated_named browser profile");
			const result = await callWindowTool(driver, state, "browser_prepare", {
				pid: target.pid,
				allow_launch: true,
				profile: {
					mode: profile,
					...input.profileName ? { name: input.profileName } : {}
				}
			}, signal);
			return JSON.stringify(browserToolEnvelope(result, "browser_prepare"));
		}
		case "browser_navigate": {
			const target = browserTarget(driver, state, input);
			const result = await callWindowTool(driver, state, "browser_navigate", {
				target_id: target.targetId,
				tab_id: target.tabId,
				url: input.url
			}, signal);
			invalidateBrowserObservation(state);
			return JSON.stringify(browserToolEnvelope(result, "browser_navigate"));
		}
		case "browser_click": {
			const target = browserTarget(driver, state, input);
			resolveBrowserObservation(state, input.observationId, target.browserRef, target.pageRef);
			const ref = browserElement(state, input, target);
			const result = await callWindowTool(driver, state, "browser_click", {
				target_id: target.targetId,
				tab_id: target.tabId,
				...ref ? { ref } : {},
				...input.x !== void 0 ? { x: input.x } : {},
				...input.y !== void 0 ? { y: input.y } : {},
				...input.inputRoute ? { input_route: input.inputRoute } : {}
			}, signal);
			return JSON.stringify(browserToolEnvelope(result, "browser_click"));
		}
		case "browser_type": {
			const target = browserTarget(driver, state, input);
			const ref = browserElement(state, input, target);
			const result = await callWindowTool(driver, state, "browser_type", {
				target_id: target.targetId,
				tab_id: target.tabId,
				ref,
				text: input.text,
				...input.mode ? { mode: input.mode } : {},
				...input.replace !== void 0 ? { replace: input.replace } : {}
			}, signal);
			return JSON.stringify(browserToolEnvelope(result, "browser_type"));
		}
		case "browser_dialog": {
			const target = browserTarget(driver, state, input);
			const dialogId = input.dialogAction === "inspect" ? void 0 : resolveDialogRef(state, input.dialogRef, target.browserRef, target.pageRef);
			const result = await callWindowTool(driver, state, "browser_dialog", {
				target_id: target.targetId,
				tab_id: target.tabId,
				action: input.dialogAction,
				...dialogId ? { dialog_id: dialogId } : {},
				...input.promptText !== void 0 ? { prompt_text: input.promptText } : {},
				...input.deliveryMode ? { delivery_mode: input.deliveryMode } : {}
			}, signal);
			if (input.dialogAction !== "inspect") clearDialogRef(state);
			return JSON.stringify(browserDialogEnvelope(result, state, target));
		}
		case "browser_set_input_files": {
			const target = browserTarget(driver, state, input);
			const ref = browserElement(state, input, target);
			const files = await resources.resolveFiles(input.resourceHandles ?? []);
			let result;
			try {
				result = await callWindowTool(driver, state, "browser_set_input_files", {
					target_id: target.targetId,
					tab_id: target.tabId,
					ref,
					files
				}, signal);
			} catch (error) {
				signal?.throwIfAborted();
				throw new Error("COMPUTER_DRIVER_ERROR: browser_set_input_files failed; inspect node logs and resource state before retrying", { cause: error });
			}
			return JSON.stringify(browserToolEnvelope(result, "browser_set_input_files"));
		}
		case "browser_download": {
			const target = browserTarget(driver, state, input);
			const ref = browserElement(state, input, target);
			const resource = await resources.createDirectory("browser-download");
			let result;
			try {
				result = await callWindowTool(driver, state, "browser_download", {
					target_id: target.targetId,
					tab_id: target.tabId,
					ref,
					destination_root: resource.path
				}, signal);
			} catch (error) {
				await resources.discard(resource.handle).catch(() => {});
				signal?.throwIfAborted();
				throw new Error("COMPUTER_DRIVER_ERROR: browser_download failed; inspect node logs and resource state before retrying", { cause: error });
			}
			const envelope = browserToolEnvelope(result, "browser_download");
			const fileResourceHandles = await resources.captureFiles(resource.handle);
			return JSON.stringify({
				...envelope,
				details: {
					...envelope.details,
					resourceHandle: resource.handle,
					fileResourceHandles
				}
			});
		}
		case "browser_pointer": {
			const target = browserTarget(driver, state, input);
			resolveBrowserObservation(state, input.observationId, target.browserRef, target.pageRef);
			const ref = browserElement(state, input, target);
			const destinationRef = browserElement(state, input, target, input.destinationElementRef);
			const result = await callWindowTool(driver, state, "browser_pointer", {
				target_id: target.targetId,
				tab_id: target.tabId,
				action: input.pointerAction,
				...input.inputRoute ? { input_route: input.inputRoute } : {},
				...ref ? { ref } : {},
				...input.x !== void 0 ? { x: input.x } : {},
				...input.y !== void 0 ? { y: input.y } : {},
				...destinationRef ? { destination_ref: destinationRef } : {},
				...input.toX !== void 0 ? { to_x: input.toX } : {},
				...input.toY !== void 0 ? { to_y: input.toY } : {},
				...input.deltaX !== void 0 ? { delta_x: input.deltaX } : {},
				...input.deltaY !== void 0 ? { delta_y: input.deltaY } : {}
			}, signal);
			return JSON.stringify(browserToolEnvelope(result, "browser_pointer"));
		}
		default: return;
	}
}
//#endregion
//#region extensions/cua-computer/src/window-actions.ts
const CUA_WIRE_ACTION_NAMES$1 = COMPUTER_USE_V2_ACTION_NAMES.slice(1, 14);
const CUA_TARGETED_ACTION_NAMES = /* @__PURE__ */ new Set([
	"left_click",
	"right_click",
	"middle_click",
	"double_click",
	"triple_click",
	"left_click_drag",
	"left_mouse_down",
	"left_mouse_up",
	"scroll",
	"type",
	"key"
]);
async function handleTargetedAct(platform, driver, state, params, signal) {
	const { ref: windowRef, target } = requireWindowTarget(driver, state, params);
	const base = {
		pid: target.pid,
		window_id: target.windowId
	};
	const delivery = params.deliveryMode ? { delivery_mode: params.deliveryMode } : {};
	const element = elementArgs(state, params, windowRef);
	let tool;
	let args;
	switch (params.action) {
		case "left_click":
		case "right_click":
		case "middle_click":
		case "double_click":
		case "triple_click": {
			tool = "click";
			const button = params.action === "right_click" ? "right" : params.action === "middle_click" ? "middle" : "left";
			const count = params.action === "double_click" ? 2 : params.action === "triple_click" ? 3 : 1;
			const modifiers = normalizeModifiers(params.modifiers, platform);
			args = {
				...base,
				...element ?? windowPointArgs(state, params, windowRef, params, "click"),
				button,
				count,
				...modifiers.length ? { modifier: modifiers } : {},
				...delivery
			};
			break;
		}
		case "left_click_drag": {
			if (element) throw new Error("COMPUTER_UNSUPPORTED_ACTION: cua-driver drag has no element target");
			tool = "drag";
			const from = windowPointArgs(state, params, windowRef, {
				x: params.fromX,
				y: params.fromY
			}, "drag start");
			const to = windowPointArgs(state, params, windowRef, params, "drag end");
			args = {
				...base,
				from_x: from.x,
				from_y: from.y,
				to_x: to.x,
				to_y: to.y,
				...from.from_zoom || to.from_zoom ? { from_zoom: true } : {},
				...params.durationMs === void 0 ? {} : { duration_ms: Math.min(1e4, params.durationMs) },
				...delivery
			};
			break;
		}
		case "left_mouse_down":
			if (platform !== "linux") throw new Error("COMPUTER_UNSUPPORTED_ACTION: left_mouse_down is Linux-only");
			if (element || params.deliveryMode === "foreground") throw new Error("COMPUTER_UNSUPPORTED_ACTION: left_mouse_down supports only background window pixels");
			tool = "mouse_button_down";
			args = {
				...base,
				...windowPointArgs(state, params, windowRef, params, "mouse down"),
				button: "left"
			};
			break;
		case "left_mouse_up":
			if (platform !== "linux") throw new Error("COMPUTER_UNSUPPORTED_ACTION: left_mouse_up is Linux-only");
			if (element || params.deliveryMode === "foreground") throw new Error("COMPUTER_UNSUPPORTED_ACTION: left_mouse_up supports only background window pixels");
			tool = "mouse_button_up";
			args = {
				...base,
				...params.x !== void 0 || params.y !== void 0 ? windowPointArgs(state, params, windowRef, params, "mouse up") : {}
			};
			break;
		case "scroll":
			if (!params.scrollDirection) throw new Error("COMPUTER_INVALID_REQUEST: scrollDirection is required for scroll");
			if (normalizeModifiers(params.modifiers, platform).length) throw new Error("COMPUTER_UNSUPPORTED_ACTION: modifier-held scroll is unsupported by cua-driver");
			tool = "scroll";
			args = {
				...base,
				...element ?? (params.x !== void 0 || params.y !== void 0 ? windowPointArgs(state, params, windowRef, params, "scroll") : {}),
				direction: params.scrollDirection,
				by: "line",
				amount: Math.min(50, params.scrollAmount ?? 3),
				...delivery
			};
			break;
		case "type":
			if (!params.text) throw new Error("COMPUTER_INVALID_REQUEST: text is required for type");
			tool = "type_text";
			args = {
				...base,
				...element ?? (params.x !== void 0 || params.y !== void 0 ? windowPointArgs(state, params, windowRef, params, "type") : {}),
				text: params.text,
				...delivery
			};
			break;
		case "key": {
			const chord = parseKeyChord(params.keys, platform);
			tool = "press_key";
			args = {
				...base,
				...element ?? (params.x !== void 0 || params.y !== void 0 ? windowPointArgs(state, params, windowRef, params, "key") : {}),
				...chord,
				...delivery
			};
			break;
		}
		default: throw new Error(`COMPUTER_UNSUPPORTED_ACTION: ${params.action}`);
	}
	const result = await callWindowTool(driver, state, tool, args, signal);
	return JSON.stringify(actionEnvelope(result));
}
async function handleWindowAct(platform, driver, state, execution, params, handleDesktop, signal) {
	const input = params;
	if (CUA_TARGETED_ACTION_NAMES.has(input.action) && (input.windowRef || input.elementRef)) return await handleTargetedAct(platform, driver, state, input, signal);
	if (CUA_WIRE_ACTION_NAMES$1.includes(input.action)) return await handleDesktop(platform, driver, state, params, signal);
	const recordingResult = await handleRecordingAct(driver, execution.recording, execution.resources, input, signal);
	if (recordingResult !== void 0) return recordingResult;
	const browserResult = await handleBrowserAct(driver, state, execution.resources, input, signal);
	if (browserResult !== void 0) return browserResult;
	switch (input.action) {
		case "list_apps": {
			const result = await callWindowTool(driver, state, "list_apps", {}, signal);
			state.apps = /* @__PURE__ */ new Map();
			const structured = projectedToolDetails(result, "list_apps");
			return JSON.stringify({
				ok: true,
				details: projectApps(state, structured.apps)
			});
		}
		case "list_windows": {
			const structured = projectedToolDetails(await callWindowTool(driver, state, "list_windows", {}, signal), "list_windows");
			return JSON.stringify({
				ok: true,
				details: projectWindows(state, nativeWindows(structured.windows))
			});
		}
		case "get_accessibility_tree": {
			if (input.windowRef || input.query || input.depth !== void 0 || input.maxElements) throw new Error("COMPUTER_UNSUPPORTED_ACTION: CUA Driver exposes get_accessibility_tree only as unfiltered desktop discovery; use get_window_state for a window tree");
			const structured = projectedToolDetails(await callWindowTool(driver, state, "get_accessibility_tree", {}, signal), "get_accessibility_tree");
			return JSON.stringify({
				ok: true,
				details: {
					...projectWindows(state, nativeWindows(structured.windows)),
					...projectProcesses(structured.processes)
				}
			});
		}
		case "get_cursor_position": {
			const result = await driver.getCursorPosition(signal);
			return JSON.stringify({
				ok: true,
				details: projectedToolDetails(result, "get_cursor_position")
			});
		}
		case "get_window_state": {
			verifyGeneration(state, driver.generation);
			const window = resolveWindowRef(state, input.windowRef);
			const result = await callWindowTool(driver, state, "get_window_state", {
				pid: window.pid,
				window_id: window.windowId,
				include_screenshot: input.includeScreenshot ?? true,
				max_elements: input.maxElements ?? 2e3,
				...input.depth !== void 0 ? { max_depth: Math.max(1, input.depth) } : {},
				...input.query ? { query: input.query } : {}
			}, signal);
			return JSON.stringify(windowObservation(result, state, input.windowRef));
		}
		case "launch_app": {
			verifyGeneration(state, driver.generation);
			const appName = input.app;
			const app = resolveAppRef(state, appName);
			if (!app) throw new Error("COMPUTER_STALE_OBSERVATION: refresh list_apps and retry");
			const result = await callWindowTool(driver, state, "launch_app", platform !== "darwin" && app.launchPath ? { launch_path: app.launchPath } : app.bundleId ? { bundle_id: app.bundleId } : { name: app.name }, signal);
			const structured = projectedToolDetails(result, "launch_app");
			return JSON.stringify({
				...actionEnvelope(result),
				details: {
					app: projectApps(state, [structured]).apps,
					...projectWindows(state, nativeWindows(structured.windows))
				}
			});
		}
		case "kill_app": {
			verifyGeneration(state, driver.generation);
			const appName = input.app;
			const app = resolveAppRef(state, appName);
			if (!app?.pid) throw new Error("COMPUTER_INVALID_REQUEST: kill_app requires a running app reference from list_apps");
			const result = await callWindowTool(driver, state, "kill_app", { pid: app.pid }, signal);
			return JSON.stringify(actionEnvelope(result, { app: appName }));
		}
		case "bring_to_front": {
			const { target } = requireWindowTarget(driver, state, input);
			const result = await callWindowTool(driver, state, "bring_to_front", {
				pid: target.pid,
				window_id: target.windowId
			}, signal);
			return JSON.stringify(actionEnvelope(result));
		}
		case "set_value": {
			const { ref, target } = requireWindowTarget(driver, state, input);
			if (input.deliveryMode === "foreground") throw new Error("COMPUTER_UNSUPPORTED_ACTION: cua-driver set_value is background accessibility delivery");
			const element = elementArgs(state, input, ref);
			if (!element) throw new Error("COMPUTER_INVALID_REQUEST: elementRef is required for set_value");
			const result = await callWindowTool(driver, state, "set_value", {
				pid: target.pid,
				window_id: target.windowId,
				...element,
				value: input.value
			}, signal);
			return JSON.stringify(actionEnvelope(result));
		}
		case "invoke_menu": {
			const { target } = requireWindowTarget(driver, state, input);
			if (input.deliveryMode === "foreground") throw new Error("COMPUTER_UNSUPPORTED_ACTION: cua-driver invoke_menu is background accessibility delivery");
			const result = await callWindowTool(driver, state, "invoke_menu", {
				pid: target.pid,
				window_id: target.windowId,
				path: input.path
			}, signal);
			return JSON.stringify(actionEnvelope(result));
		}
		case "zoom": {
			const { ref, target } = requireWindowTarget(driver, state, input);
			resolveObservation(state, input.observationId, ref);
			const result = await callWindowTool(driver, state, "zoom", {
				pid: target.pid,
				window_id: target.windowId,
				x1: input.x1,
				y1: input.y1,
				x2: input.x2,
				y2: input.y2
			}, signal);
			return JSON.stringify(windowObservation(result, state, ref, { fromZoom: true }));
		}
		case "escalate_scope": {
			const reason = {
				ax_tree_pixel_mismatch: EscalationReason.AxTreePixelMismatch,
				background_delivery_failed: EscalationReason.BackgroundDeliveryFailed,
				foreground_ineffective: EscalationReason.ForegroundIneffective,
				no_window_target: EscalationReason.NoWindowTarget,
				other: EscalationReason.Other
			}[input.reason];
			const result = await driver.escalateScope(reason, signal);
			adoptGeneration(state, driver.generation);
			return JSON.stringify({
				ok: true,
				details: {
					captureScope: result.captureScope,
					effectiveScope: result.effectiveScope,
					desktopUnlocked: result.desktopUnlocked
				}
			});
		}
		default: throw new Error(`COMPUTER_UNSUPPORTED_ACTION: ${input.action}`);
	}
}
//#endregion
//#region extensions/cua-computer/src/commands.ts
const AVAILABILITY_POLL_MS = 5e3;
const CUA_WIRE_ACTION_NAMES = COMPUTER_USE_V2_ACTION_NAMES.slice(1, 14);
const MAX_IMAGE_PIXELS = 4e7;
const CUA_DRIVER_ENDPOINT_ENV = "OPENCLAW_CUA_DRIVER_ENDPOINT";
const CuaDriverEndpointSchema = strictObject({
	v: literal(1),
	socketPath: string(),
	binaryPath: string()
});
const DesktopStateSchema = object({
	platform: string().min(1),
	display: string().min(1),
	screenshot_width: number().int().positive(),
	screenshot_height: number().int().positive(),
	screen_width: number().int().positive(),
	screen_height: number().int().positive(),
	scale_factor: number().positive()
});
const ScreenSizeSchema = object({
	width: number().int().positive(),
	height: number().int().positive(),
	scale_factor: number().positive()
});
function resolveMacOsMcpEndpoint(env) {
	const rawEndpoint = env[CUA_DRIVER_ENDPOINT_ENV];
	if (!rawEndpoint || Buffer.byteLength(rawEndpoint, "utf8") > 4096) return;
	try {
		const rawValue = JSON.parse(rawEndpoint);
		const parsed = CuaDriverEndpointSchema.safeParse(rawValue);
		if (!parsed.success) return;
		const { socketPath, binaryPath } = parsed.data;
		if (socketPath.includes("\0") || binaryPath.includes("\0") || !path.isAbsolute(socketPath) || !path.isAbsolute(binaryPath)) return;
		fs.accessSync(binaryPath, fs.constants.X_OK);
		return {
			socketPath,
			binaryPath
		};
	} catch {
		return;
	}
}
var PromiseQueue = class {
	constructor() {
		this.tail = Promise.resolve();
	}
	async run(operation) {
		const previous = this.tail;
		let release = () => {};
		this.tail = new Promise((resolve) => {
			release = resolve;
		});
		await previous;
		try {
			return await operation();
		} finally {
			release();
		}
	}
};
function assertPrimaryDisplay(screenIndex) {
	if (screenIndex !== void 0 && screenIndex !== 0) throw new Error("COMPUTER_UNSUPPORTED_DISPLAY: cua-driver controls only the primary display (screenIndex 0)");
}
function assertToolSuccess(result, tool) {
	if (result.isError) {
		const code = result.errorCode ? `COMPUTER_REFUSED_${result.errorCode}` : "COMPUTER_DRIVER_ERROR";
		throw new Error(`${code}: ${result.text || `${tool} failed`}`);
	}
	return result;
}
function structuredContent(result, tool) {
	return projectedToolDetails(assertToolSuccess(result, tool), tool);
}
function desktopGeometry(result) {
	const parsed = DesktopStateSchema.safeParse(structuredContent(result, "get_desktop_state"));
	if (!parsed.success) throw new Error("COMPUTER_DRIVER_ERROR: invalid get_desktop_state geometry");
	return {
		platform: parsed.data.platform,
		display: parsed.data.display,
		screenWidth: parsed.data.screen_width,
		screenHeight: parsed.data.screen_height,
		scaleFactor: parsed.data.scale_factor,
		screenshotWidth: parsed.data.screenshot_width,
		screenshotHeight: parsed.data.screenshot_height
	};
}
function desktopPng(result) {
	const image = result.images.find((entry) => entry.mimeType === "image/png");
	if (!image) throw new Error("COMPUTER_DRIVER_ERROR: get_desktop_state returned no PNG image");
	const canonicalPng = canonicalizeBase64(image.dataBase64);
	if (!canonicalPng) throw new Error("COMPUTER_DRIVER_ERROR: get_desktop_state returned malformed PNG base64");
	return Buffer.from(canonicalPng, "base64");
}
function screenSize(result) {
	const parsed = ScreenSizeSchema.safeParse(structuredContent(result, "get_screen_size"));
	if (!parsed.success) throw new Error("COMPUTER_DRIVER_ERROR: invalid get_screen_size geometry");
	return {
		width: parsed.data.width,
		height: parsed.data.height,
		scaleFactor: parsed.data.scale_factor
	};
}
function resolveImageCommand(command, env) {
	const names = process.platform === "win32" && !path.extname(command) ? [
		command,
		`${command}.exe`,
		`${command}.cmd`
	] : [command];
	for (const entry of (env.PATH ?? "").split(path.delimiter).filter(Boolean)) for (const name of names) {
		const candidate = path.resolve(entry, name);
		try {
			fs.accessSync(candidate, fs.constants.X_OK);
			return candidate;
		} catch {}
	}
	return null;
}
function createImageProcessor(env) {
	return createRastermill({
		execution: "auto",
		limits: {
			inputPixels: MAX_IMAGE_PIXELS,
			outputPixels: MAX_IMAGE_PIXELS
		},
		temp: {
			rootDir: resolvePreferredOpenClawTmpDir(),
			prefix: "openclaw-cua-computer-"
		},
		commandResolver: (command) => resolveImageCommand(command, env)
	});
}
function clickArgs(platform, frame, params, button, count) {
	const point = scalePoint(frame, params.x, params.y, params.action);
	if (normalizeModifiers(params.modifiers, platform).length > 0) throw new Error("COMPUTER_UNSUPPORTED_ACTION: modifier-held desktop clicks are unsupported by cua-driver");
	return {
		...point,
		button,
		count
	};
}
async function currentFrame(driver, frameState, params, signal) {
	const current = screenSize(await driver.getScreenSize(signal));
	if (driver.generation !== frameState.generation) {
		frameState.lastFrame = void 0;
		throw new Error("COMPUTER_STALE_FRAME: the computer driver reconnected; take a new screenshot");
	}
	return verifyFrame(frameState, params.displayFrameId, current, params.refWidth);
}
async function handleDesktopAct(platform, driver, frameState, params, signal) {
	if (!CUA_WIRE_ACTION_NAMES.includes(params.action)) throw new Error(`COMPUTER_UNSUPPORTED_ACTION: ${params.action}`);
	const desktopParams = params;
	assertPrimaryDisplay(desktopParams.screenIndex);
	if (desktopParams.action === "hold_key") throw new Error("COMPUTER_UNSUPPORTED_ACTION: hold_key; this driver supports key taps only");
	if (desktopParams.action === "left_mouse_down" || desktopParams.action === "left_mouse_up") throw new Error(`COMPUTER_UNSUPPORTED_ACTION: ${desktopParams.action}; ` + (platform === "linux" ? "requires a background window pixel target with windowRef and observationId" : "held mouse buttons are unavailable on this platform"));
	let result;
	switch (desktopParams.action) {
		case "type":
			if (!desktopParams.text) throw new Error("COMPUTER_INVALID_REQUEST: text is required for type");
			result = assertToolSuccess(await driver.typeText(desktopParams.text, signal), "type_text");
			break;
		case "key": {
			const chord = parseKeyChord(desktopParams.keys, platform);
			result = assertToolSuccess(await driver.pressKey(chord, signal), "press_key");
			break;
		}
		case "scroll": {
			if (!desktopParams.scrollDirection) throw new Error("COMPUTER_INVALID_REQUEST: scrollDirection is required for scroll");
			if (normalizeModifiers(desktopParams.modifiers, platform).length > 0) throw new Error("COMPUTER_UNSUPPORTED_ACTION: modifier-held scroll is unsupported by cua-driver");
			const point = scalePoint(await currentFrame(driver, frameState, desktopParams, signal), desktopParams.x, desktopParams.y, desktopParams.action);
			const direction = {
				up: ScrollDirection.Up,
				down: ScrollDirection.Down,
				left: ScrollDirection.Left,
				right: ScrollDirection.Right
			}[desktopParams.scrollDirection];
			result = assertToolSuccess(await driver.scroll({
				direction,
				amount: BigInt(Math.min(50, desktopParams.scrollAmount ?? 3)),
				...point
			}, signal), "scroll");
			break;
		}
		default: {
			const frame = await currentFrame(driver, frameState, desktopParams, signal);
			switch (desktopParams.action) {
				case "left_click":
				case "right_click":
				case "middle_click":
				case "double_click":
				case "triple_click": {
					const button = desktopParams.action === "right_click" ? ClickButton.Right : desktopParams.action === "middle_click" ? ClickButton.Middle : ClickButton.Left;
					const count = desktopParams.action === "double_click" ? 2 : desktopParams.action === "triple_click" ? 3 : 1;
					result = assertToolSuccess(await driver.click(clickArgs(platform, frame, desktopParams, button, count), signal), "click");
					break;
				}
				case "mouse_move": {
					const point = scalePoint(frame, desktopParams.x, desktopParams.y, desktopParams.action);
					result = assertToolSuccess(await driver.moveCursor(point, signal), "move_cursor");
					break;
				}
				case "left_click_drag": {
					const from = scalePoint(frame, desktopParams.fromX, desktopParams.fromY, "drag start");
					const to = scalePoint(frame, desktopParams.x, desktopParams.y, "drag end");
					result = assertToolSuccess(await driver.drag({
						fromX: from.x,
						fromY: from.y,
						toX: to.x,
						toY: to.y,
						...desktopParams.durationMs === void 0 ? {} : { durationMs: BigInt(Math.min(1e4, desktopParams.durationMs)) }
					}, signal), "drag");
					break;
				}
				default: throw new Error("COMPUTER_UNSUPPORTED_ACTION: unknown action");
			}
		}
	}
	return JSON.stringify(actionEnvelope(result, {
		scope: "desktop",
		...desktopParams.deliveryMode ? { deliveryModeApplicable: false } : {}
	}));
}
function createCuaComputerProvider(options = {}) {
	const platform = options.platform ?? process.platform;
	const env = options.env ?? process.env;
	const macOsEndpoint = platform === "darwin" ? resolveMacOsMcpEndpoint(env) : void 0;
	let ownedAvailabilityDriver;
	let stopped = false;
	const createDriver = options.createDriver ?? (macOsEndpoint ? () => createCuaMcpDriver({
		...macOsEndpoint,
		env
	}) : createCuaDriver);
	const availabilityDriver = () => {
		if (stopped) throw new Error("COMPUTER_DRIVER_UNAVAILABLE: cua-computer is stopping");
		return options.driver ?? (ownedAvailabilityDriver ??= createDriver());
	};
	const disposeAvailabilityDriver = async () => {
		stopped = true;
		const current = ownedAvailabilityDriver;
		ownedAvailabilityDriver = void 0;
		await current?.dispose();
	};
	const imageProcessor = options.imageProcessor ?? createImageProcessor(env);
	const interval = options.setInterval ?? setInterval;
	const clear = options.clearInterval ?? clearInterval;
	const isSupportedPlatform = platform === "linux" || platform === "win32" || macOsEndpoint !== void 0;
	const isAvailable = () => macOsEndpoint !== void 0 || isSupportedPlatform && availabilityDriver().isAvailable();
	return {
		id: "cua-computer",
		label: "CUA Computer",
		capabilities: () => ({
			contractVersion: 2,
			provider: {
				id: "cua-computer",
				label: "CUA Computer",
				generation: isSupportedPlatform ? `cua-computer-v2:${availabilityDriver().generation}` : "cua-computer-v2:unsupported"
			},
			actions: platformActions(platform),
			targets: [
				"screen",
				"window",
				"element",
				"browser"
			],
			deliveryModes: ["background", "foreground"],
			observations: [
				"image",
				"accessibility",
				"browser"
			],
			features: {
				recording: true,
				agentCursor: false,
				multiDisplay: false
			}
		}),
		isAvailable,
		prepare: async () => {
			if (isSupportedPlatform && macOsEndpoint === void 0 && !stopped) await availabilityDriver().prepareAvailability?.();
		},
		watchAvailability: (_context, onChange) => {
			let knownAvailable = isAvailable();
			const timer = interval(() => {
				availabilityDriver().resetAvailabilityCache();
				const available = isAvailable();
				if (available !== knownAvailable) {
					knownAvailable = available;
					onChange();
				}
			}, AVAILABILITY_POLL_MS);
			timer.unref?.();
			return () => {
				clear(timer);
				disposeAvailabilityDriver();
			};
		},
		openExecution: async () => {
			if (stopped) throw new Error("COMPUTER_DRIVER_UNAVAILABLE: cua-computer is stopping");
			const executionDriver = options.driver ?? createDriver();
			const resources = createLazyCuaExecutionResources();
			const executionState = {
				resources,
				recording: {}
			};
			const queue = new PromiseQueue();
			const frameState = { generation: executionDriver.generation };
			let closing = false;
			let closePromise;
			const assertOpen = () => {
				if (closing) throw new Error("COMPUTER_DRIVER_UNAVAILABLE: provider execution is closing");
				if (!isSupportedPlatform) throw new Error(platform === "darwin" ? `COMPUTER_DRIVER_UNAVAILABLE: cua-computer requires app-provided ${CUA_DRIVER_ENDPOINT_ENV}` : "COMPUTER_DRIVER_UNAVAILABLE: cua-computer supports macOS, Windows, and Linux");
			};
			return {
				snapshot: async (paramsJSON, signal) => await queue.run(async () => {
					assertOpen();
					const params = parseScreenSnapshotParamsJSON(paramsJSON);
					assertPrimaryDisplay(params.screenIndex);
					const format = params.format ?? "jpeg";
					const maxWidth = params.maxWidth ?? (format === "png" ? 900 : 1600);
					const quality = Math.min(1, Math.max(.05, params.quality ?? .72));
					const desktop = await executionDriver.getDesktopState(signal);
					const geometry = desktopGeometry(desktop);
					if (platform !== "darwin" && (geometry.screenWidth !== geometry.screenshotWidth || geometry.screenHeight !== geometry.screenshotHeight)) throw new Error("COMPUTER_UNSUPPORTED_DISPLAY: cua-driver reported capture and screen geometry in different pixel spaces");
					const nativePng = desktopPng(desktop);
					let encoded = nativePng;
					let width = geometry.screenshotWidth;
					let height = geometry.screenshotHeight;
					if (format === "jpeg" || Math.max(width, height) > maxWidth) {
						const result = await imageProcessor.encode(nativePng, {
							format,
							...format === "jpeg" ? { quality: Math.round(quality * 100) } : {},
							resize: {
								maxSide: maxWidth,
								enlarge: false
							}
						});
						encoded = result.data;
						width = result.width;
						height = result.height;
					}
					adoptGeneration(frameState, executionDriver.generation);
					const displayFrameId = issueFrame(frameState, geometry, {
						width,
						height,
						referenceWidth: maxWidth
					});
					return JSON.stringify({
						format,
						base64: encoded.toString("base64"),
						displayFrameId,
						screenIndex: 0,
						width,
						height
					});
				}),
				act: async (paramsJSON, signal) => await queue.run(async () => {
					assertOpen();
					return await handleWindowAct(platform, executionDriver, frameState, executionState, parseComputerActParamsJSON(paramsJSON), handleDesktopAct, signal);
				}),
				close: async (reason) => {
					if (closePromise) return await closePromise;
					closing = true;
					closePromise = queue.run(async () => {
						let failure;
						try {
							await closeRecordingExecution({
								driver: executionDriver,
								state: executionState.recording,
								resources,
								reason
							});
						} catch (error) {
							failure = error;
						}
						await resources.dispose(reason !== "completion").catch((error) => {
							failure ??= error;
						});
						await executionDriver.dispose().catch((error) => {
							failure ??= error;
						});
						if (failure) throw failure instanceof Error ? failure : new Error("CUA Computer cleanup failed", { cause: failure });
					});
					return await closePromise;
				}
			};
		}
	};
}
//#endregion
//#region extensions/cua-computer/src/node-invoke-policy.ts
const COMPUTER_ACT_COMMAND = "computer.act";
const HIGH_RISK_FAMILIES = /* @__PURE__ */ new Map([
	["kill_app", "process_termination"],
	["browser_navigate", "browser_navigation"],
	["browser_download", "browser_download"],
	["browser_set_input_files", "browser_file_input"],
	["start_recording", "recording_start"],
	["replay_trajectory", "recording_replay"],
	["escalate_scope", "desktop_scope_escalation"]
]);
const OBSERVATION_ACTIONS = /* @__PURE__ */ new Set([
	"list_apps",
	"list_windows",
	"get_accessibility_tree",
	"get_cursor_position",
	"get_window_state",
	"zoom",
	"get_browser_state",
	"get_recording_state"
]);
function classifyCuaComputerActRisk(params) {
	if (isRecord(params) && params.action === "__close_execution") return {
		level: "ordinary",
		family: "execution_lifecycle"
	};
	const serialized = JSON.stringify(params);
	if (serialized === void 0) throw new Error("computer action arguments are not serializable");
	const parsed = parseComputerActParamsJSON(serialized);
	const highRiskFamily = HIGH_RISK_FAMILIES.get(parsed.action);
	if (highRiskFamily) return {
		level: "high",
		family: highRiskFamily
	};
	if (parsed.action === "browser_dialog" && "dialogAction" in parsed && parsed.dialogAction === "inspect") return {
		level: "ordinary",
		family: "observation"
	};
	return {
		level: "ordinary",
		family: OBSERVATION_ACTIONS.has(parsed.action) ? "observation" : "input"
	};
}
function createCuaComputerNodeInvokePolicy() {
	return {
		commands: [COMPUTER_ACT_COMMAND],
		dangerous: true,
		classifyRisk: ({ command, params }) => {
			if (command !== COMPUTER_ACT_COMMAND) throw new Error("unsupported CUA Computer node command");
			return classifyCuaComputerActRisk(params);
		},
		handle: async (context) => {
			if (!context.risk) return {
				ok: false,
				code: "COMPUTER_RISK_UNCLASSIFIED",
				message: "computer.act arguments were not classified before dispatch"
			};
			return await context.invokeNode();
		}
	};
}
//#endregion
//#region extensions/cua-computer/index.ts
const CuaComputerConfigSchema = strictObject({ driverPath: string().optional() });
const configSchema = buildPluginConfigSchema(CuaComputerConfigSchema);
var cua_computer_default = definePluginEntry({
	id: "cua-computer",
	name: "CUA Computer",
	description: "Experimental CUA Driver computer control for macOS, Windows, and Linux node hosts.",
	configSchema,
	register(api) {
		const parsed = CuaComputerConfigSchema.safeParse(api.pluginConfig ?? {});
		if (!parsed.success) throw new Error(`Invalid cua-computer plugin config: ${parsed.error.issues[0]?.message ?? "invalid config"}`);
		api.registerNodeInvokePolicy(createCuaComputerNodeInvokePolicy());
		if (process.platform !== "darwin" && normalizePluginsConfig(api.config.plugins).entries[api.id]?.enabled !== true) return;
		registerCuaDriverDoctorChecks();
		const artifactVerification = verifyInstalledCuaDriverArtifacts();
		if (!artifactVerification.ok) api.logger?.error(artifactVerification.diagnostic);
		registerComputerUseProvider(api, createCuaComputerProvider());
	}
});
//#endregion
export { cua_computer_default as default };
