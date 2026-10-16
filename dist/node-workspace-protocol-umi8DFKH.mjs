import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { Et as _enum, Jn as string, Kt as custom, Lt as boolean, Pn as number, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
import { a as workerProtocolObject, i as workerProtocolIdentifier, n as decodeWorkerRequest, t as WorkerGatewayNamespace } from "./protocol-record-CQCXx-YV.mjs";
import { o as NodeWorkerWorkspaceTransferInputSchema } from "./node-workspace-transfer-protocol-Ct5Tr1Uo.mjs";
import { n as WORKSPACE_INSPECTION_MAX_BYTES, r as isWorkspaceInspectionCommand } from "./workspace-inspection-protocol-Bc0T2fvV.mjs";
import path from "node:path";
//#region src/worker/node-workspace-protocol.ts
const REQUEST_MAX_BYTES = 262144;
const NODE_WORKER_WORKSPACE_STDIN_MAX_BYTES = 131072;
const OUTPUT_MAX_BYTES = 65536;
const STDERR_MAX_BYTES = 16384;
const ARGV_MAX_ITEMS = 128;
const ARG_MAX_BYTES = 131072;
const TIMEOUT_MAX_MS = 6e5;
const NODE_WORKSPACE_DRAIN_COMMAND = "openclaw-internal-workspace-drain";
const NODE_WORKSPACE_QUIESCENCE_COMMAND = "openclaw-internal-workspace-quiescence";
const QuiescenceNonce = string().regex(/^[a-f0-9]{32}$/u);
const QuiescenceTimeout = number().int().min(1).max(72e4);
const WorkspaceQuiescence = union([
	workerProtocolObject({
		action: literal("acquire"),
		nonce: QuiescenceNonce,
		timeoutMs: QuiescenceTimeout
	}),
	workerProtocolObject({
		action: literal("renew"),
		nonce: QuiescenceNonce,
		timeoutMs: QuiescenceTimeout,
		validationMode: _enum(["heartbeat", "final"])
	}),
	workerProtocolObject({
		action: literal("release"),
		nonce: QuiescenceNonce
	})
]);
const SeedKey = string().regex(/^[a-f0-9]{64}$/u);
const WorkspaceProcessId = string().regex(/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u);
const WorkspaceProcess = workerProtocolObject({
	action: _enum([
		"start",
		"status",
		"stop"
	]),
	processId: WorkspaceProcessId
});
const SeedInput = union([workerProtocolObject({
	action: literal("apply"),
	key: SeedKey
}), workerProtocolObject({
	action: literal("store"),
	key: SeedKey,
	maxAgeMs: number().int().min(0).max(Number.MAX_SAFE_INTEGER)
})]);
const WorkspaceInput = workerProtocolObject({
	gatewayNamespace: WorkerGatewayNamespace,
	environmentId: workerProtocolIdentifier("environmentId"),
	sessionId: workerProtocolIdentifier("sessionId"),
	sessionKey: workerProtocolIdentifier("sessionKey", 1024).optional(),
	preparationKey: custom((value) => typeof value === "string" && /^[a-f0-9]{64}$/u.test(value), { error: "INVALID_REQUEST: preparationKey must be a SHA-256 hex digest" }).optional(),
	generation: custom((value) => typeof value === "number" && Number.isSafeInteger(value) && value >= 0, { error: "INVALID_REQUEST: generation must be a non-negative safe integer" }),
	argv: custom((value) => Array.isArray(value) && value.length > 0 && value.length <= ARGV_MAX_ITEMS && value.every((arg) => typeof arg === "string" && arg.length > 0 && !arg.includes("\0") && Buffer.byteLength(arg, "utf8") <= ARG_MAX_BYTES), { error: "INVALID_REQUEST: argv must be a bounded non-empty string array" }).transform((argv) => [...argv]),
	input: string({ error: "INVALID_REQUEST: workspace command input exceeds its bound" }).optional(),
	timeoutMs: custom((value) => typeof value === "number" && Number.isSafeInteger(value) && value >= 1 && value <= TIMEOUT_MAX_MS, { error: "INVALID_REQUEST: workspace command timeout is invalid" }).optional(),
	resetWorkspace: boolean({ error: "INVALID_REQUEST: resetWorkspace must be a boolean" }).optional(),
	transfer: NodeWorkerWorkspaceTransferInputSchema.optional(),
	seed: SeedInput.optional(),
	process: WorkspaceProcess.optional(),
	quiescence: WorkspaceQuiescence.optional(),
	nativeProcessOwner: literal(true).optional()
});
function parseNodeWorkerWorkspaceExecInput(raw) {
	const value = decodeWorkerRequest(raw, WORKSPACE_INSPECTION_MAX_BYTES * 2, "node worker workspace");
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
	if (input.quiescence || input.argv[0] === "openclaw-internal-workspace-quiescence") {
		if (!input.quiescence || input.argv[0] !== "openclaw-internal-workspace-quiescence" || input.argv.length !== 2 || input.input !== void 0 || input.transfer || input.seed || input.process || input.resetWorkspace !== void 0 || input.nativeProcessOwner) throw new Error("INVALID_REQUEST: workspace quiescence owns its operation");
	}
	if (input.nativeProcessOwner && (input.process || input.seed || input.transfer)) throw new Error("INVALID_REQUEST: native process ownership requires a foreground command");
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
const TruncatedBytes = number().int().min(0).max(Number.MAX_SAFE_INTEGER).optional();
const WorkspaceResult = workerProtocolObject({
	workspaceDir: string().max(4096).refine((value) => path.posix.isAbsolute(value) || path.win32.isAbsolute(value)),
	stdout: string(),
	stderr: string().refine((value) => Buffer.byteLength(value, "utf8") <= STDERR_MAX_BYTES),
	code: number().int().min(Number.MIN_SAFE_INTEGER).max(Number.MAX_SAFE_INTEGER).nullable(),
	signal: string().min(1).max(32).nullable(),
	killed: boolean(),
	termination: _enum([
		"exit",
		"timeout",
		"no-output-timeout",
		"signal"
	]),
	stdoutTruncatedBytes: TruncatedBytes,
	stderrTruncatedBytes: TruncatedBytes,
	noOutputTimedOut: boolean().optional(),
	outputLimitExceeded: boolean().optional(),
	outputErrorStream: _enum(["stdout", "stderr"]).optional(),
	process: workerProtocolObject({
		processId: WorkspaceProcessId,
		state: _enum(["running", "exited"])
	}).optional()
});
function parseNodeWorkerWorkspaceExecResult(value, argv = []) {
	const parsed = WorkspaceResult.safeParse(value);
	if (!parsed.success || Buffer.byteLength(parsed.data.stdout, "utf8") > (isWorkspaceInspectionCommand(argv) ? 2097152 : OUTPUT_MAX_BYTES)) return null;
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
export { NODE_WORKSPACE_QUIESCENCE_COMMAND as a, projectNodeWorkerWorkspaceExecResult as c, NODE_WORKSPACE_DRAIN_COMMAND as i, NODE_WORKER_WORKSPACE_STDIN_MAX_BYTES as n, parseNodeWorkerWorkspaceExecInput as o, NODE_WORKER_WORKSPACE_STDOUT_MAX_BYTES as r, parseNodeWorkerWorkspaceExecResult as s, NODE_WORKER_WORKSPACE_STDERR_MAX_BYTES as t };
