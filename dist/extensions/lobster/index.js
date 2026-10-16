import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { optionalPositiveIntegerSchema } from "openclaw/plugin-sdk/channel-actions";
import { readPositiveIntegerParam } from "openclaw/plugin-sdk/param-readers";
import { jsonResult } from "openclaw/plugin-sdk/tool-results";
import { Type } from "typebox";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable, Writable } from "node:stream";
import { extractErrorCode, toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { isPathInside } from "openclaw/plugin-sdk/file-access-runtime";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
//#region extensions/lobster/src/lobster-runner.ts
const workflowExts = /* @__PURE__ */ new Set([
	".lobster",
	".yaml",
	".yml",
	".json"
]);
function resolveLobsterCwd(cwdRaw) {
	if (typeof cwdRaw !== "string" || !cwdRaw.trim()) return process.cwd();
	const cwd = cwdRaw.trim();
	if (path.isAbsolute(cwd)) throw new Error("cwd must be a relative path");
	const base = process.cwd();
	const resolved = path.resolve(base, cwd);
	if (!isPathInside(base, resolved)) throw new Error("cwd must stay within the gateway working directory");
	return resolved;
}
function createLimitedSink(maxBytes, label) {
	let bytes = 0;
	return new Writable({ write(chunk, _encoding, callback) {
		bytes += Buffer.byteLength(String(chunk), "utf8");
		if (bytes > maxBytes) {
			callback(/* @__PURE__ */ new Error(`lobster ${label} exceeded maxStdoutBytes`));
			return;
		}
		callback();
	} });
}
function normalizeEnvelope(envelope, maxStdoutBytes) {
	if (!envelope.ok) throw new Error(envelope.error?.message ?? "lobster runtime failed");
	if (envelope.status === "needs_input" && !envelope.requiresInput?.resumeToken) throw new Error("Lobster input request is missing its resume token");
	const normalized = {
		ok: true,
		status: envelope.status ?? "ok",
		output: Array.isArray(envelope.output) ? envelope.output : [],
		requiresApproval: envelope.requiresApproval ? {
			type: "approval_request",
			prompt: envelope.requiresApproval.prompt,
			items: envelope.requiresApproval.items,
			...envelope.requiresApproval.resumeToken ? { resumeToken: envelope.requiresApproval.resumeToken } : {},
			...envelope.requiresApproval.approvalId ? { approvalId: envelope.requiresApproval.approvalId } : {}
		} : null,
		...envelope.requiresInput ? { requiresInput: {
			...envelope.requiresInput,
			type: "input_request"
		} } : {}
	};
	if (Buffer.byteLength(JSON.stringify(normalized, null, 2), "utf8") > maxStdoutBytes) throw new Error("lobster runtime result exceeded maxStdoutBytes");
	return normalized;
}
async function detectWorkflowFile(candidate, cwd) {
	const trimmed = candidate.trim();
	if (!trimmed || trimmed.includes("|") || !workflowExts.has(path.extname(trimmed).toLowerCase())) return null;
	const resolved = path.isAbsolute(trimmed) ? trimmed : path.resolve(cwd, trimmed);
	try {
		if (!(await stat(resolved)).isFile()) throw new Error("Workflow path is not a file");
		return resolved;
	} catch (error) {
		if (/\s/.test(trimmed) && extractErrorCode(error) === "ENOENT") return null;
		throw error;
	}
}
async function loadEmbeddedToolRuntimeFromPackage() {
	return await import([
		"@clawdbot",
		"lobster",
		"core"
	].join("/"));
}
function createEmbeddedLobsterRunner(options) {
	const loadRuntime = options?.loadRuntime ?? loadEmbeddedToolRuntimeFromPackage;
	let runtimePromise;
	return { async run(params) {
		runtimePromise ??= loadRuntime();
		const runtime = await runtimePromise;
		const controller = new AbortController();
		return await raceWithTimeout(async () => {
			const maxStdoutBytes = Math.max(1024, params.maxStdoutBytes);
			const ctx = {
				cwd: params.cwd,
				env: { ...process.env },
				mode: "tool",
				stdin: Readable.from([]),
				stdout: createLimitedSink(maxStdoutBytes, "stdout"),
				stderr: createLimitedSink(maxStdoutBytes, "stderr"),
				signal: controller.signal
			};
			let envelope;
			if (params.action === "run") {
				const pipeline = params.pipeline?.trim() ?? "";
				if (!pipeline) throw new Error("pipeline required");
				const filePath = await detectWorkflowFile(pipeline, params.cwd);
				if (filePath) {
					const parsedArgsJson = params.argsJson?.trim() ?? "";
					let args;
					if (parsedArgsJson) try {
						args = JSON.parse(parsedArgsJson);
					} catch {
						throw new Error("run --args-json must be valid JSON");
					}
					envelope = await runtime.runToolRequest({
						filePath,
						args,
						ctx
					});
				} else envelope = await runtime.runToolRequest({
					pipeline,
					ctx
				});
			} else {
				const token = params.token?.trim() ?? "";
				const approvalId = params.approvalId?.trim() ?? "";
				if (!token && !approvalId) throw new Error("token or approvalId required");
				const hasApproval = typeof params.approve === "boolean";
				const hasResponse = params.responseJson !== void 0;
				const hasCancel = params.cancel !== void 0;
				if (Number(hasApproval) + Number(hasResponse) + Number(hasCancel) !== 1) throw new Error("resume requires exactly one of approve, responseJson, or cancel: true");
				if (hasCancel && params.cancel !== true) throw new Error("cancel must be true");
				let response;
				if (params.responseJson !== void 0) try {
					response = JSON.parse(params.responseJson);
				} catch {
					throw new Error("responseJson must be valid JSON");
				}
				envelope = await runtime.resumeToolRequest({
					...token ? { token } : {},
					...approvalId ? { approvalId } : {},
					...hasApproval ? { approved: params.approve } : {},
					...hasResponse ? { response } : {},
					...hasCancel ? { cancel: true } : {},
					ctx
				});
			}
			return normalizeEnvelope(envelope, maxStdoutBytes);
		}, Math.max(200, params.timeoutMs), () => {
			const error = /* @__PURE__ */ new Error("lobster runtime timed out");
			controller.abort(error);
			throw error;
		}).catch((error) => {
			throw toErrorObject(error, "Non-Error rejection");
		});
	} };
}
//#endregion
//#region extensions/lobster/src/lobster-tool.ts
function createLobsterTool(api, options) {
	const runner = options?.runner ?? createEmbeddedLobsterRunner();
	return {
		name: "lobster",
		label: "Lobster Workflow",
		description: "Run Lobster workflows with resumable approvals and structured input. For needs_input, ask the user the returned prompt, then resume with their answer as responseJson matching responseSchema. For approvals, resume with approve. Use cancel: true to cancel a checkpoint.",
		parameters: Type.Object({
			action: Type.Enum(["run", "resume"], { type: "string" }),
			pipeline: Type.Optional(Type.String()),
			argsJson: Type.Optional(Type.String()),
			token: Type.Optional(Type.String()),
			approvalId: Type.Optional(Type.String()),
			approve: Type.Optional(Type.Boolean()),
			responseJson: Type.Optional(Type.String({ description: "User's answer as JSON for an input checkpoint. Use instead of approve." })),
			cancel: Type.Optional(Type.Literal(true)),
			cwd: Type.Optional(Type.String({ description: "Relative working directory (optional). Must stay within the gateway working directory." })),
			timeoutMs: optionalPositiveIntegerSchema(),
			maxStdoutBytes: optionalPositiveIntegerSchema()
		}),
		async execute(_id, params) {
			const action = typeof params.action === "string" ? params.action.trim() : "";
			if (!action) throw new Error("action required");
			if (action !== "run" && action !== "resume") throw new Error(`Unknown action: ${action}`);
			const cwd = resolveLobsterCwd(params.cwd);
			const timeoutMs = readPositiveIntegerParam(params, "timeoutMs") ?? 2e4;
			const maxStdoutBytes = readPositiveIntegerParam(params, "maxStdoutBytes") ?? 512e3;
			if (api.runtime?.version && api.logger?.debug) api.logger.debug(`lobster plugin runtime=${api.runtime.version}`);
			const runnerParams = {
				action,
				...typeof params.pipeline === "string" ? { pipeline: params.pipeline } : {},
				...typeof params.argsJson === "string" ? { argsJson: params.argsJson } : {},
				...typeof params.token === "string" ? { token: params.token } : {},
				...typeof params.approvalId === "string" ? { approvalId: params.approvalId } : {},
				...typeof params.approve === "boolean" ? { approve: params.approve } : {},
				...typeof params.responseJson === "string" ? { responseJson: params.responseJson } : {},
				...typeof params.cancel === "boolean" ? { cancel: params.cancel } : {},
				cwd,
				timeoutMs,
				maxStdoutBytes
			};
			const envelope = await runner.run(runnerParams);
			if (!envelope.ok) throw new Error(envelope.error.message);
			return jsonResult(envelope);
		}
	};
}
//#endregion
//#region extensions/lobster/index.ts
var lobster_default = definePluginEntry({
	id: "lobster",
	name: "Lobster",
	description: "Optional local shell helper tools",
	register(api) {
		api.registerTool((ctx) => {
			if (ctx.sandboxed) return null;
			return createLobsterTool(api);
		}, { optional: true });
	}
});
//#endregion
export { lobster_default as default };
