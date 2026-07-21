import { a as stripAnsiSequences } from "./ansi-D1GK_odF.js";
import { _r as validateTerminalOpenParams, gr as validateTerminalInputParams, mr as validateTerminalCloseParams, pr as validateTerminalAttachParams, t as formatValidationErrors, vr as validateTerminalResizeParams, yr as validateTerminalTextParams } from "./src-CToKmqGn.js";
import { Gn as errorShape, Wn as ErrorCodes } from "./schema-BuOFpc7K.js";
import { t as buildTerminalEnv } from "./launch-BmPwk1y9.js";
//#region src/gateway/terminal/buffer-text.ts
const C0_EXCEPT_TAB_CR_LF = `${String.fromCharCode(0)}-${String.fromCharCode(8)}${String.fromCharCode(11)}${String.fromCharCode(12)}${String.fromCharCode(14)}-${String.fromCharCode(31)}${String.fromCharCode(127)}`;
const CONTROL_BYTES_REGEX = new RegExp(`[${C0_EXCEPT_TAB_CR_LF}]`, "g");
/**
* Approximates what a terminal would show without running a VT emulator:
* strips ANSI sequences, collapses carriage-return overwrites (progress bars
* emit "10%\r20%\r30%" — keep the last write per line), and drops remaining
* C0 control bytes. Cursor-movement layouts (vim, htop) will not reconstruct
* faithfully; a true screen snapshot is a tracked follow-up.
*/
function renderTerminalBufferText(raw) {
	return stripAnsiSequences(raw).split("\n").map((line) => {
		const segments = line.split("\r");
		const last = segments[segments.length - 1];
		return ((last === "" && segments.length > 1 ? segments[segments.length - 2] : last) ?? "").replace(CONTROL_BYTES_REGEX, "");
	}).join("\n");
}
//#endregion
//#region src/gateway/server-methods/terminal.ts
function invalid(respond, detail) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, detail));
}
function requireConnId(opts) {
	const connId = opts.client?.connId;
	if (!connId) {
		invalid(opts.respond, "terminal requires an authenticated connection");
		return null;
	}
	return connId;
}
function terminalEnabled(context) {
	return context.isTerminalEnabled();
}
/** Handlers for the operator terminal method family. */
const terminalHandlers = {
	"terminal.open": async (opts) => {
		const { params, respond, context } = opts;
		if (!validateTerminalOpenParams(params)) {
			invalid(respond, `invalid terminal.open params: ${formatValidationErrors(validateTerminalOpenParams.errors)}`);
			return;
		}
		const connId = requireConnId(opts);
		if (!connId) return;
		const manager = context.terminalSessions;
		if (!manager) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available"));
			return;
		}
		const p = params;
		const launch = context.resolveTerminalLaunchPolicy(p.agentId);
		if (!launch.ok) {
			if (launch.block.kind === "disabled") {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is disabled"));
				return;
			}
			if (launch.block.kind === "unknown-agent") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown agent "${launch.block.agentId}"`));
				return;
			}
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `terminal unavailable: agent "${launch.block.agentId}" runs in a sandbox (mode "${launch.block.mode}"); in-sandbox terminals are not supported yet`));
			return;
		}
		const outcome = await manager.open({
			connId,
			agentId: launch.plan.agentId,
			cwd: launch.plan.cwd,
			shell: launch.plan.shell,
			args: launch.plan.args,
			cols: p.cols,
			rows: p.rows,
			env: buildTerminalEnv(process.env)
		});
		if (!outcome.ok) {
			respond(false, void 0, errorShape(outcome.code === "limit" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, outcome.message));
			return;
		}
		context.logGateway.info(`terminal opened session=${outcome.sessionId} agent=${outcome.agentId} conn=${connId} shell=${outcome.shell}`);
		respond(true, {
			sessionId: outcome.sessionId,
			agentId: outcome.agentId,
			shell: outcome.shell,
			cwd: outcome.cwd,
			confined: false
		});
	},
	"terminal.input": async (opts) => {
		const { params, respond, context } = opts;
		if (!validateTerminalInputParams(params)) {
			invalid(respond, `invalid terminal.input params: ${formatValidationErrors(validateTerminalInputParams.errors)}`);
			return;
		}
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		if (!terminalEnabled(context)) {
			context.terminalSessions?.close(connId, p.sessionId);
			respond(true, { ok: false });
			return;
		}
		respond(true, { ok: context.terminalSessions?.write(connId, p.sessionId, p.data) ?? false });
	},
	"terminal.resize": async (opts) => {
		const { params, respond, context } = opts;
		if (!validateTerminalResizeParams(params)) {
			invalid(respond, `invalid terminal.resize params: ${formatValidationErrors(validateTerminalResizeParams.errors)}`);
			return;
		}
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		if (!terminalEnabled(context)) {
			context.terminalSessions?.close(connId, p.sessionId);
			respond(true, { ok: false });
			return;
		}
		respond(true, { ok: context.terminalSessions?.resize(connId, p.sessionId, p.cols, p.rows) ?? false });
	},
	"terminal.close": async (opts) => {
		const { params, respond, context } = opts;
		if (!validateTerminalCloseParams(params)) {
			invalid(respond, `invalid terminal.close params: ${formatValidationErrors(validateTerminalCloseParams.errors)}`);
			return;
		}
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		respond(true, { ok: context.terminalSessions?.close(connId, p.sessionId) ?? false });
	},
	"terminal.attach": async (opts) => {
		const { params, respond, context } = opts;
		if (!validateTerminalAttachParams(params)) {
			invalid(respond, `invalid terminal.attach params: ${formatValidationErrors(validateTerminalAttachParams.errors)}`);
			return;
		}
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		if (!context.terminalSessions || !terminalEnabled(context)) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available"));
			return;
		}
		const attached = context.terminalSessions.attach(connId, p.sessionId);
		if (!attached) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown terminal session "${p.sessionId}"`));
			return;
		}
		context.logGateway.info(`terminal attached session=${attached.sessionId} agent=${attached.agentId} conn=${connId}`);
		respond(true, {
			sessionId: attached.sessionId,
			agentId: attached.agentId,
			shell: attached.shell,
			cwd: attached.cwd,
			confined: false,
			buffer: attached.buffer
		});
	},
	"terminal.list": async (opts) => {
		const { respond, context } = opts;
		if (!requireConnId(opts)) return;
		respond(true, { sessions: context.terminalSessions && terminalEnabled(context) ? context.terminalSessions.list().map((session) => ({
			sessionId: session.sessionId,
			agentId: session.agentId,
			shell: session.shell,
			cwd: session.cwd,
			confined: false,
			attached: session.attached,
			createdAtMs: session.createdAtMs
		})) : [] });
	},
	"terminal.text": async (opts) => {
		const { params, respond, context } = opts;
		if (!validateTerminalTextParams(params)) {
			invalid(respond, `invalid terminal.text params: ${formatValidationErrors(validateTerminalTextParams.errors)}`);
			return;
		}
		if (!requireConnId(opts)) return;
		const p = params;
		if (!context.terminalSessions || !terminalEnabled(context)) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available"));
			return;
		}
		const raw = context.terminalSessions.snapshot(p.sessionId);
		if (raw === void 0) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown terminal session "${p.sessionId}"`));
			return;
		}
		respond(true, { text: renderTerminalBufferText(raw) });
	}
};
//#endregion
export { terminalHandlers };
