import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { Et as _enum, Jn as string, Kt as custom, Lt as boolean, Pn as number, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as workerProtocolObject, t as hasExactOwnKeys } from "./protocol-record-sxcNOJSy.mjs";
import { o as NodeWorkerWorkspaceTransferInputSchema } from "./node-workspace-transfer-protocol-CifFHpcH.mjs";
import { r as isWorkspaceInspectionCommand } from "./workspace-inspection-protocol-gfcfg3Iv.mjs";
import path from "node:path";
//#region src/worker/node-workspace-protocol.ts
const IDENTIFIER_MAX_CHARS = 256;
const GATEWAY_NAMESPACE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u;
const REQUEST_MAX_BYTES = 262144;
const NODE_WORKER_WORKSPACE_STDIN_MAX_BYTES = 131072;
const OUTPUT_MAX_BYTES = 65536;
const STDERR_MAX_BYTES = 16384;
const ARGV_MAX_ITEMS = 128;
const ARG_MAX_BYTES = 131072;
const TIMEOUT_MAX_MS = 6e5;
const NODE_WORKSPACE_DRAIN_COMMAND = "openclaw-internal-workspace-drain";
const SeedKey = string().regex(/^[a-f0-9]{64}$/u);
const WorkspaceProcess = workerProtocolObject({
	action: _enum([
		"start",
		"status",
		"stop"
	]),
	processId: string().regex(/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u)
});
const SeedInput = union([workerProtocolObject({
	action: literal("apply"),
	key: SeedKey
}), workerProtocolObject({
	action: literal("store"),
	key: SeedKey,
	maxAgeMs: number().int().min(0).max(Number.MAX_SAFE_INTEGER)
})]);
const identifier = (label, maxChars = IDENTIFIER_MAX_CHARS) => custom((value) => typeof value === "string" && value.length > 0 && value.length <= maxChars && value.trim() === value && !value.includes("\0"), { error: `INVALID_REQUEST: ${label} must be a bounded non-empty identifier` });
const WorkspaceInput = workerProtocolObject({
	gatewayNamespace: identifier("gatewayNamespace").refine((value) => typeof value === "string" && GATEWAY_NAMESPACE_PATTERN.test(value), { error: "INVALID_REQUEST: gatewayNamespace must be a safe bounded path component" }),
	environmentId: identifier("environmentId"),
	sessionId: identifier("sessionId"),
	sessionKey: identifier("sessionKey", 1024).optional(),
	preparationKey: custom((value) => typeof value === "string" && /^[a-f0-9]{64}$/u.test(value), { error: "INVALID_REQUEST: preparationKey must be a SHA-256 hex digest" }).optional(),
	generation: custom((value) => typeof value === "number" && Number.isSafeInteger(value) && value >= 0, { error: "INVALID_REQUEST: generation must be a non-negative safe integer" }),
	argv: custom((value) => Array.isArray(value) && value.length > 0 && value.length <= ARGV_MAX_ITEMS && value.every((arg) => typeof arg === "string" && arg.length > 0 && !arg.includes("\0") && Buffer.byteLength(arg, "utf8") <= ARG_MAX_BYTES), { error: "INVALID_REQUEST: argv must be a bounded non-empty string array" }).transform((argv) => [...argv]),
	input: string({ error: "INVALID_REQUEST: workspace command input exceeds its bound" }).optional(),
	timeoutMs: custom((value) => typeof value === "number" && Number.isSafeInteger(value) && value >= 1 && value <= TIMEOUT_MAX_MS, { error: "INVALID_REQUEST: workspace command timeout is invalid" }).optional(),
	resetWorkspace: boolean({ error: "INVALID_REQUEST: resetWorkspace must be a boolean" }).optional(),
	transfer: NodeWorkerWorkspaceTransferInputSchema.optional(),
	seed: SeedInput.optional(),
	process: WorkspaceProcess.optional()
});
function parseJson(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > 4194304) throw new Error("INVALID_REQUEST: invalid node worker workspace request");
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("INVALID_REQUEST: malformed node worker workspace request");
	}
}
function parseNodeWorkerWorkspaceExecInput(raw) {
	const value = parseJson(raw);
	const parsed = WorkspaceInput.safeParse(value);
	if (!parsed.success) {
		const issue = parsed.error.issues[0];
		if (issue?.path[0] === "transfer") throw new Error("INVALID_REQUEST: workspace transfer is invalid");
		if (issue?.path[0] === "process") throw new Error("INVALID_REQUEST: workspace process operation is invalid");
		if (issue?.path[0] === "seed") {
			const validKey = isRecord(value) && isRecord(value.seed) && SeedKey.safeParse(value.seed.key).success;
			throw new Error(validKey ? "INVALID_REQUEST: workspace seed action or maxAgeMs is invalid" : "INVALID_REQUEST: workspace seed key must be a SHA-256 hex digest");
		}
		throw new Error(issue?.path.length ? issue.message : "INVALID_REQUEST: invalid node worker workspace request");
	}
	const input = parsed.data;
	if (input.process && (input.seed || input.transfer || input.resetWorkspace !== void 0)) throw new Error("INVALID_REQUEST: workspace process owns its operation");
	if (input.process && input.process.action !== "start" && (input.argv.length !== 1 || input.argv[0] !== "openclaw-internal-workspace-process" || input.input !== void 0)) throw new Error("INVALID_REQUEST: workspace process control accepts no command");
	const inspection = isWorkspaceInspectionCommand(input.argv);
	if (input.argv[0] === "openclaw-internal-workspace-drain" && (input.argv.length !== 1 || input.input !== void 0 || input.transfer !== void 0 || input.seed !== void 0 || input.process !== void 0 || input.resetWorkspace !== void 0)) throw new Error("INVALID_REQUEST: workspace drain owns its operation");
	if (input.argv[0] === "openclaw-internal-workspace-inspect" && (!inspection || input.transfer !== void 0 || input.seed !== void 0 || input.process !== void 0 || input.resetWorkspace !== void 0)) throw new Error("INVALID_REQUEST: workspace inspection owns its operation");
	if (!inspection && Buffer.byteLength(raw ?? "", "utf8") > REQUEST_MAX_BYTES) throw new Error("INVALID_REQUEST: workspace command request exceeds its bound");
	if (input.input !== void 0 && Buffer.byteLength(input.input, "utf8") > (inspection ? 2097152 : 131072)) throw new Error("INVALID_REQUEST: workspace command input exceeds its bound");
	if (input.seed !== void 0 && (input.transfer !== void 0 || input.resetWorkspace !== void 0)) throw new Error("INVALID_REQUEST: workspace seed cannot combine with transfer or resetWorkspace");
	return input;
}
function isBoundedText(value, maxBytes) {
	return typeof value === "string" && Buffer.byteLength(value, "utf8") <= maxBytes;
}
function isAbsoluteHostPath(value) {
	return path.posix.isAbsolute(value) || path.win32.isAbsolute(value);
}
function parseNodeWorkerWorkspaceExecResult(value, argv = []) {
	if (!isRecord(value) || !hasExactOwnKeys(value, [
		"workspaceDir",
		"stdout",
		"stderr",
		"code",
		"signal",
		"killed",
		"termination"
	], [
		"stdoutTruncatedBytes",
		"stderrTruncatedBytes",
		"noOutputTimedOut",
		"outputLimitExceeded",
		"outputErrorStream",
		"process"
	]) || typeof value.workspaceDir !== "string" || !isAbsoluteHostPath(value.workspaceDir) || value.workspaceDir.length > 4096 || !isBoundedText(value.stdout, isWorkspaceInspectionCommand(argv) ? 2097152 : OUTPUT_MAX_BYTES) || !isBoundedText(value.stderr, STDERR_MAX_BYTES) || value.code !== null && (!Number.isSafeInteger(value.code) || typeof value.code !== "number") || value.signal !== null && (typeof value.signal !== "string" || value.signal.length === 0 || value.signal.length > 32) || typeof value.killed !== "boolean" || value.termination !== "exit" && value.termination !== "timeout" && value.termination !== "no-output-timeout" && value.termination !== "signal") return null;
	if (value.process !== void 0 && (!isRecord(value.process) || !hasExactOwnKeys(value.process, ["processId", "state"], []) || typeof value.process.processId !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u.test(value.process.processId) || value.process.state !== "running" && value.process.state !== "exited")) return null;
	for (const key of ["stdoutTruncatedBytes", "stderrTruncatedBytes"]) {
		const count = value[key];
		if (count !== void 0 && (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0)) return null;
	}
	if (value.noOutputTimedOut !== void 0 && typeof value.noOutputTimedOut !== "boolean" || value.outputLimitExceeded !== void 0 && typeof value.outputLimitExceeded !== "boolean" || value.outputErrorStream !== void 0 && value.outputErrorStream !== "stdout" && value.outputErrorStream !== "stderr") return null;
	return value;
}
function projectNodeWorkerWorkspaceExecResult(workspaceDir, result, argv = []) {
	const parsed = parseNodeWorkerWorkspaceExecResult({
		workspaceDir,
		stdout: result.stdout,
		stderr: result.stderr,
		code: result.code,
		signal: result.signal,
		killed: result.killed,
		termination: result.termination,
		...result.stdoutTruncatedBytes === void 0 ? {} : { stdoutTruncatedBytes: result.stdoutTruncatedBytes },
		...result.stderrTruncatedBytes === void 0 ? {} : { stderrTruncatedBytes: result.stderrTruncatedBytes },
		...result.noOutputTimedOut === void 0 ? {} : { noOutputTimedOut: result.noOutputTimedOut },
		...result.outputLimitExceeded === void 0 ? {} : { outputLimitExceeded: result.outputLimitExceeded },
		...result.outputErrorStream === void 0 ? {} : { outputErrorStream: result.outputErrorStream }
	}, argv);
	if (!parsed) throw new Error("node worker workspace result violated its bounded contract");
	return parsed;
}
const NODE_WORKER_WORKSPACE_STDOUT_MAX_BYTES = OUTPUT_MAX_BYTES;
const NODE_WORKER_WORKSPACE_STDERR_MAX_BYTES = STDERR_MAX_BYTES;
//#endregion
export { parseNodeWorkerWorkspaceExecInput as a, NODE_WORKSPACE_DRAIN_COMMAND as i, NODE_WORKER_WORKSPACE_STDIN_MAX_BYTES as n, parseNodeWorkerWorkspaceExecResult as o, NODE_WORKER_WORKSPACE_STDOUT_MAX_BYTES as r, projectNodeWorkerWorkspaceExecResult as s, NODE_WORKER_WORKSPACE_STDERR_MAX_BYTES as t };
