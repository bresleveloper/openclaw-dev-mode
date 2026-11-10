import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as addSafeTimeoutDelayGraceMs } from "./timeouts-ClVlVfGz.mjs";
import { n as resolveRequestedExecTarget, t as isRequestedExecTargetAllowed } from "./bash-tools.exec-target-CRl70nUx.mjs";
import { c as optionalStringEnum, r as executionTitleSchema } from "./typebox-DhJiP5MZ.mjs";
import { Type } from "typebox";
//#region src/agents/bash-tools.schemas.ts
/**
* TypeBox schemas for shell/process tools exposed to model providers.
*
* Keep these schemas provider-friendly: flat fields, string enums, and explicit
* descriptions that match runtime validation.
*/
const EXEC_TOOL_HOST_VALUES = [
	"auto",
	"sandbox",
	"gateway",
	"node"
];
const PROCESS_TOOL_ACTIONS = [
	"list",
	"poll",
	"log",
	"write",
	"send-keys",
	"submit",
	"paste",
	"kill",
	"clear",
	"remove"
];
/** Parameters accepted by the exec tool. */
const execSchema = Type.Object({
	title: executionTitleSchema(),
	command: Type.String({ description: "Shell command." }),
	workdir: Type.Optional(Type.String({ description: "Omit/empty string: default; whitespace-only invalid." })),
	env: Type.Optional(Type.Record(Type.String(), Type.String(), { description: "Literal overrides; no expansion. Omit to inherit." })),
	yieldMs: Type.Optional(Type.Number({ description: "Milliseconds before returning an ordinary-command handle; default 10000." })),
	awaitResults: Type.Optional(Type.Boolean({ description: "Result required to finish the task; wait for terminal collection. Not for detached servers." })),
	background: Type.Optional(Type.Boolean({ description: "Start an independent service now; survives request Stop. Use yieldMs for ordinary work. timeoutSeconds applies." })),
	timeoutSeconds: Type.Optional(Type.Number({ description: "Process lifetime in seconds; 0 disables." })),
	pty: Type.Optional(Type.Boolean({ description: "PTY for TTY-required CLIs/coding agents." })),
	elevated: Type.Optional(Type.Boolean({ description: "Host elevation if allowed." })),
	host: optionalStringEnum(EXEC_TOOL_HOST_VALUES, { description: "Omit: named node or configured host. auto: configured host." }),
	ask: Type.Optional(Type.String({ description: "Requests stricter approvals under tools.exec.mode and host policy; channel-origin calls cannot override host ask=off." })),
	node: Type.Optional(Type.String({ description: "Node id/name; implies host=node if host is omitted. Other hosts conflict." }))
});
/** Capture host capabilities once; direct tools and catalog hints share this schema. */
function createExecSchema(defaults) {
	const sandboxAvailable = Boolean(defaults?.sandbox);
	const configuredTarget = defaults?.sandboxRequired ? "sandbox" : defaults?.host ?? "auto";
	const hosts = EXEC_TOOL_HOST_VALUES.filter((requestedTarget) => requestedTarget === "auto" || (requestedTarget !== "sandbox" || sandboxAvailable) && isRequestedExecTargetAllowed({
		configuredTarget,
		requestedTarget,
		sandboxAvailable
	}));
	return Type.Object({
		...execSchema.properties,
		host: optionalStringEnum(hosts, { description: `Omit: named node or configured host (${configuredTarget === "auto" ? sandboxAvailable ? "sandbox" : "gateway" : configuredTarget}). auto: configured host.` })
	});
}
/** Parameters exposed by node-only exec surfaces. */
const nodeExecSchema = Type.Object({
	title: execSchema.properties.title,
	command: execSchema.properties.command,
	workdir: execSchema.properties.workdir,
	env: execSchema.properties.env,
	timeoutSeconds: execSchema.properties.timeoutSeconds,
	host: optionalStringEnum(["node"], { description: "Exec target. Only node is available on this tool surface." }),
	node: execSchema.properties.node
});
/** Parameters accepted by the process-control tool. */
const processSchema = Type.Object({
	action: Type.String({
		enum: [...PROCESS_TOOL_ACTIONS],
		description: "Process action (list|poll|log|write|send-keys|submit|paste|kill|clear|remove)"
	}),
	sessionId: Type.Optional(Type.String({ description: "Required for every action except list." })),
	data: Type.Optional(Type.String({ description: "Data to write for write" })),
	keys: Type.Optional(Type.Array(Type.String(), { description: "Key tokens to send for send-keys" })),
	hex: Type.Optional(Type.Array(Type.String(), { description: "Hex bytes to send for send-keys" })),
	literal: Type.Optional(Type.String({ description: "Literal string for send-keys" })),
	text: Type.Optional(Type.String({ description: "Text to paste for paste" })),
	bracketed: Type.Optional(Type.Boolean({ description: "Wrap paste in bracketed mode" })),
	eof: Type.Optional(Type.Boolean({ description: "Close stdin after write" })),
	offset: Type.Optional(Type.Number({ description: "Log offset" })),
	limit: Type.Optional(Type.Number({ description: "Log length" })),
	timeout: Type.Optional(Type.Number({
		description: "For poll: wait up to this many milliseconds before returning; max 30000 ms, higher values are clamped to 30000",
		minimum: 0
	}))
});
//#endregion
//#region src/agents/exec-tool-timeout.ts
function resolveExecDefaultTimeoutSec(timeoutSec) {
	return timeoutSec && timeoutSec > 0 ? timeoutSec : 1800;
}
function resolveNodeExecTimeouts(timeoutSec, defaultTimeoutSec) {
	const runTimeoutSec = typeof timeoutSec === "number" && Number.isFinite(timeoutSec) ? timeoutSec : defaultTimeoutSec;
	const baseTimeoutSec = Number.isFinite(runTimeoutSec) && runTimeoutSec > 0 ? runTimeoutSec : defaultTimeoutSec;
	const invokeDeadlineMs = !Number.isFinite(baseTimeoutSec) || baseTimeoutSec <= 0 ? 1e4 : Math.max(1e4, addSafeTimeoutDelayGraceMs(baseTimeoutSec * 1e3, 5e3));
	return {
		runTimeoutMs: Number.isFinite(runTimeoutSec) && runTimeoutSec > 0 ? addSafeTimeoutDelayGraceMs(runTimeoutSec * 1e3, 0, { minMs: 0 }) : 0,
		invokeDeadlineMs,
		invokeWaitMs: addSafeTimeoutDelayGraceMs(invokeDeadlineMs, 5e3)
	};
}
function createExecToolExecutionTimeoutResolver(defaults) {
	const defaultTimeoutSec = resolveExecDefaultTimeoutSec(defaults?.timeoutSec);
	const defaultHost = defaults?.host;
	return (args) => {
		const params = asNonArrayRecord(args);
		const requestedHost = resolveRequestedExecTarget(params);
		if ((requestedHost && requestedHost !== "auto" ? requestedHost : defaultHost) !== "node") return;
		return resolveNodeExecTimeouts(typeof params.timeoutSeconds === "number" ? params.timeoutSeconds : void 0, defaultTimeoutSec).invokeWaitMs;
	};
}
//#endregion
export { execSchema as a, createExecSchema as i, resolveExecDefaultTimeoutSec as n, nodeExecSchema as o, resolveNodeExecTimeouts as r, processSchema as s, createExecToolExecutionTimeoutResolver as t };
