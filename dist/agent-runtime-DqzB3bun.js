import "./agent-scope-CDZXADgT.js";
import "./provider-auth-aliases-CNlVI3wV.js";
import "./sandbox-paths-_3aaGW_c.js";
import "./auth-profiles-DWHvUh-t.js";
import "./model-auth-markers-C4s6SbvA.js";
import "./model-selection-i8V2iTdL.js";
import "./model-catalog-DD_dq4PJ.js";
import "./model-auth-Bvz14MtI.js";
import "./common-B2QjWqqG.js";
import "./typebox-DK0GFdj5.js";
import "./identity-Bc-uwZ_Y.js";
import "./embedded-agent-utils-B9lC4_IJ.js";
import "./simple-completion-runtime-CVqSKTna.js";
import "./tts-Bvnit7ux.js";
import "./web-shared-BIuBuoqp.js";
import "./date-time-CcWivhrg.js";
import "./current-time-B0TYU-XW.js";
import "./agent-dir-compat-vEbxJgD6.js";
import "./identity-avatar-BxrNJNQm.js";
import "./web-guarded-fetch-Cw3Us_mi.js";
import "./agent-command-BQX6s03f.js";
//#region src/tools/availability.ts
/**
* Tool availability evaluator for descriptor-driven tool planning.
*
* Descriptors express why a tool can be shown as small signals; this module
* turns those signals into diagnostics without knowing any concrete tool owner.
*/
function isRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function resolveConfigPath(config, path) {
	let current = config;
	for (const segment of path) {
		if (!isRecord(current)) return;
		current = current[segment];
	}
	return current;
}
function hasConfiguredValue(params) {
	const { value, signal } = params;
	if (value === void 0 || value === null) return false;
	if ((signal.check ?? "exists") === "available") return params.context.isConfigValueAvailable?.({
		value,
		path: signal.path,
		signal
	}) === true;
	if ((signal.check ?? "exists") === "exists") return true;
	if (typeof value === "string") return value.trim().length > 0;
	if (Array.isArray(value)) return value.length > 0;
	if (typeof value === "object") return Object.keys(value).length > 0;
	return true;
}
function hasAvailabilityExpressionShape(value) {
	return "kind" in value || "allOf" in value || "anyOf" in value;
}
function diagnostic(reason, signal, message) {
	return {
		reason,
		signal,
		message
	};
}
function evaluateSignal(signal, context) {
	switch (signal.kind) {
		case "always": return null;
		case "auth": return context.authProviderIds?.has(signal.providerId) ? null : diagnostic("auth-missing", signal, `Missing auth provider: ${signal.providerId}`);
		case "config": return hasConfiguredValue({
			value: resolveConfigPath(context.config, signal.path),
			signal,
			context
		}) ? null : diagnostic("config-missing", signal, `Missing config path: ${signal.path.join(".")}`);
		case "env": return context.env?.[signal.name]?.trim() ? null : diagnostic("env-missing", signal, `Missing environment value: ${signal.name}`);
		case "plugin-enabled": return context.enabledPluginIds?.has(signal.pluginId) ? null : diagnostic("plugin-disabled", signal, `Plugin is not enabled: ${signal.pluginId}`);
		case "context": {
			const value = context.values?.[signal.key];
			if (!("equals" in signal)) return value === void 0 ? diagnostic("context-mismatch", signal, `Missing context value: ${signal.key}`) : null;
			return value === signal.equals ? null : diagnostic("context-mismatch", signal, `Context value did not match: ${signal.key}`);
		}
		default: return diagnostic("unsupported-signal", signal, "Unsupported availability signal");
	}
}
function evaluateExpression(expression, context) {
	if ("kind" in expression) {
		const diagnosticLocal = evaluateSignal(expression, context);
		return diagnosticLocal ? [diagnosticLocal] : [];
	}
	if ("allOf" in expression) {
		if (expression.allOf.length === 0) return [{
			reason: "unsupported-signal",
			message: "Empty availability allOf group"
		}];
		return expression.allOf.flatMap((entry) => evaluateExpression(entry, context));
	}
	if ("anyOf" in expression) {
		if (expression.anyOf.length === 0) return [{
			reason: "unsupported-signal",
			message: "Empty availability anyOf group"
		}];
		const diagnostics = expression.anyOf.map((entry) => evaluateExpression(entry, context));
		const unsupported = diagnostics.flat().filter((entry) => entry.reason === "unsupported-signal");
		if (diagnostics.some((entries) => entries.length === 0)) return unsupported;
		return diagnostics.flat();
	}
	return [{
		reason: "unsupported-signal",
		message: "Unsupported availability expression"
	}];
}
/** Evaluate one descriptor against runtime context and return hidden-tool diagnostics. */
function evaluateToolAvailability(params) {
	const context = params.context ?? {};
	const availability = params.descriptor.availability ?? { kind: "always" };
	if (!hasAvailabilityExpressionShape(availability)) return [{
		reason: "unsupported-signal",
		message: "Unsupported availability expression"
	}];
	return evaluateExpression(availability, context);
}
//#endregion
//#region src/tools/descriptors.ts
/**
* Identity helpers for authoring tool descriptors with stable inferred types.
*
* Callers use these at declaration sites so descriptor arrays keep readonly
* shapes while still validating against the public ToolDescriptor contract.
*/
/** Define one tool descriptor without changing its runtime shape. */
function defineToolDescriptor(descriptor) {
	return descriptor;
}
/** Define a readonly descriptor list without changing runtime order or entries. */
function defineToolDescriptors(descriptors) {
	return descriptors;
}
//#endregion
//#region src/tools/diagnostics.ts
/** Error thrown when a visible tool plan cannot be built from descriptors. */
var ToolPlanContractError = class extends Error {
	constructor(params) {
		super(params.message);
		this.name = "ToolPlanContractError";
		this.code = params.code;
		this.toolName = params.toolName;
	}
};
//#endregion
//#region src/tools/execution.ts
/**
* Formatting helpers for tool executor references.
*
* Executor refs are closed discriminated unions; the formatted string is for
* diagnostics/logging and must not become a parser contract.
*/
/** Render an executor ref as a compact diagnostic label. */
function formatToolExecutorRef(ref) {
	switch (ref.kind) {
		case "core": return `core:${ref.executorId}`;
		case "plugin": return `plugin:${ref.pluginId}:${ref.toolName}`;
		case "channel": return `channel:${ref.channelId}:${ref.actionId}`;
		case "mcp": return `mcp:${ref.serverId}:${ref.toolName}`;
		default: return ref;
	}
}
//#endregion
//#region src/tools/planner.ts
/**
* Deterministic planner for descriptor-backed tools.
*
* The planner sorts descriptors, hides unavailable tools with diagnostics, and
* throws only when visible tool descriptors violate executor/name contracts.
*/
function compareDescriptors(left, right) {
	return (left.sortKey ?? left.name).localeCompare(right.sortKey ?? right.name) || left.name.localeCompare(right.name);
}
function assertUniqueNames(descriptors) {
	const seen = /* @__PURE__ */ new Set();
	for (const descriptor of descriptors) {
		if (seen.has(descriptor.name)) throw new ToolPlanContractError({
			code: "duplicate-tool-name",
			toolName: descriptor.name,
			message: `Duplicate tool descriptor name: ${descriptor.name}`
		});
		seen.add(descriptor.name);
	}
}
/** Build the visible and hidden tool plan for a runtime context. */
function buildToolPlan(options) {
	const descriptors = options.descriptors.toSorted(compareDescriptors);
	assertUniqueNames(descriptors);
	const visible = [];
	const hidden = [];
	for (const descriptor of descriptors) {
		const diagnostics = [...evaluateToolAvailability({
			descriptor,
			context: options.availability
		})];
		if (diagnostics.length > 0) {
			hidden.push({
				descriptor,
				diagnostics
			});
			continue;
		}
		if (!descriptor.executor) throw new ToolPlanContractError({
			code: "missing-executor",
			toolName: descriptor.name,
			message: `Visible tool descriptor has no executor ref: ${descriptor.name}`
		});
		visible.push({
			descriptor,
			executor: descriptor.executor
		});
	}
	return {
		visible,
		hidden
	};
}
//#endregion
//#region src/tools/protocol.ts
function toToolProtocolDescriptor(entry) {
	return {
		name: entry.descriptor.name,
		description: entry.descriptor.description,
		inputSchema: entry.descriptor.inputSchema
	};
}
function toToolProtocolDescriptors(entries) {
	return entries.map(toToolProtocolDescriptor);
}
//#endregion
export { ToolPlanContractError as a, evaluateToolAvailability as c, formatToolExecutorRef as i, toToolProtocolDescriptors as n, defineToolDescriptor as o, buildToolPlan as r, defineToolDescriptors as s, toToolProtocolDescriptor as t };
