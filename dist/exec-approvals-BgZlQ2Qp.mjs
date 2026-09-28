import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as expandHomePrefix } from "./home-dir-BKwhAL2c.mjs";
import { c as resolveExecApprovalsDisplayPath, o as normalizeExecApprovalsInternal, u as resolveExecApprovalsSocketPath } from "./exec-approvals-config-C7iYNiP7.mjs";
import { k as resolveExecApprovalsFromFilePrepared, n as applyRecordedAllowlistUse, o as buildAllowlistEntryMatchKey, r as assertCurrentUsageAuthorization, s as createExecApprovalPolicySnapshot } from "./exec-approvals-authorization.kernel-DYisNIDQ.mjs";
import { g as updateExecApprovalsSync, i as loadExecApprovals, n as ensureExecApprovals, r as ensureExecApprovalsSnapshot, t as commitExecAuthorizations, u as replaceExecApprovalsSnapshot } from "./exec-approvals-store-CTT-ox-I.mjs";
import "./exec-approvals-analysis-Dc-DBchW.mjs";
import "./exec-approvals-allowlist-BcPQSHv1.mjs";
import "./exec-approvals-generated-migration-CRYknfT-.mjs";
import net from "node:net";
import { addAbortListener } from "node:events";
import { clearTimeout, setTimeout } from "node:timers";
//#region src/infra/exec-approvals-authorization.ts
function recordAllowlistUse(approvals, agentId, entry, command, resolvedPath) {
	recordAllowlistMatchesUse({
		approvals,
		agentId,
		matches: [entry],
		command,
		resolvedPath
	});
}
function recordAllowlistMatchesUse(params) {
	if (params.matches.length === 0 && !params.authorization) return;
	const snapshot = updateExecApprovalsSync({ update: (file) => applyRecordedAllowlistUse({
		...params,
		file
	}) });
	if (snapshot) replaceExecApprovalsSnapshot(params.approvals, snapshot.file);
}
async function commitExecAuthorizationLocked(input) {
	const params = structuredClone(input);
	const { snapshot, readCurrent } = await commitExecAuthorizations(params);
	const matchKeys = new Set(params.matches.filter((entry) => entry.pattern).map(buildAllowlistEntryMatchKey));
	const authorization = {
		...params.authorization,
		policySnapshot: createExecApprovalPolicySnapshot({
			file: snapshot.file,
			agentId: params.agentId
		})
	};
	return () => assertCurrentUsageAuthorization({
		file: readCurrent(),
		agentId: params.agentId,
		command: params.command,
		matchKeys,
		authorization
	});
}
//#endregion
//#region src/infra/jsonl-socket.ts
const JSONL_SOCKET_MAX_LINE_BYTES = 16777216;
/**
* Sends one JSONL request line, half-closes the write side, and waits for an accepted response line.
*/
async function requestJsonlSocket(params) {
	const { socketPath, requestLine, accept, signal } = params;
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
	return await new Promise((resolve) => {
		const client = new net.Socket();
		let settled = false;
		const lineChunks = [];
		let lineBytes = 0;
		const finish = (value) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			abortListener?.[Symbol.dispose]();
			client.destroy();
			resolve(value);
		};
		const appendLineChunk = (chunk) => {
			if (lineBytes + chunk.byteLength > JSONL_SOCKET_MAX_LINE_BYTES) {
				finish(null);
				return false;
			}
			if (chunk.byteLength > 0) {
				lineChunks.push(chunk);
				lineBytes += chunk.byteLength;
			}
			return true;
		};
		const timer = setTimeout(() => finish(null), timeoutMs);
		const abortListener = signal ? addAbortListener(signal, () => finish(null)) : void 0;
		if (signal?.aborted) {
			finish(null);
			return;
		}
		client.on("error", () => finish(null));
		client.on("end", () => finish(null));
		client.on("close", () => finish(null));
		client.connect(socketPath, () => {
			if (!settled) client.end(`${requestLine}\n`);
		});
		client.on("data", (data) => {
			let offset = 0;
			while (offset < data.byteLength) {
				const newlineIndex = data.indexOf(10, offset);
				if (newlineIndex === -1) {
					appendLineChunk(data.subarray(offset));
					return;
				}
				if (!appendLineChunk(data.subarray(offset, newlineIndex))) return;
				const line = (lineChunks.length > 1 ? Buffer.concat(lineChunks, lineBytes) : lineChunks[0])?.toString("utf8").trim() ?? "";
				lineChunks.length = 0;
				lineBytes = 0;
				offset = newlineIndex + 1;
				if (!line) continue;
				try {
					const msg = JSON.parse(line);
					const result = accept(msg);
					if (result === void 0) continue;
					finish(result);
					return;
				} catch {}
			}
		});
	});
}
//#endregion
//#region src/infra/exec-approvals-socket.ts
async function requestExecApprovalViaSocket(params) {
	const { socketPath, token, request } = params;
	if (!socketPath || !token) return null;
	const timeoutMs = params.timeoutMs ?? 15e3;
	return await requestJsonlSocket({
		socketPath,
		requestLine: JSON.stringify({
			type: "request",
			token,
			id: crypto.randomUUID(),
			request
		}),
		timeoutMs,
		accept: (value) => {
			const msg = value;
			if (msg?.type === "decision" && msg.decision) return msg.decision;
		}
	});
}
//#endregion
//#region src/infra/exec-approvals.ts
function redactExecApprovals(snapshot) {
	const { raw: _raw, ...rest } = snapshot;
	const socketPath = snapshot.file.socket?.path?.trim();
	return {
		...rest,
		file: {
			...snapshot.file,
			socket: socketPath ? { path: socketPath } : void 0
		}
	};
}
function normalizeExecApprovals(file) {
	const socketPath = file.socket?.path?.trim();
	const token = file.socket?.token?.trim();
	return normalizeExecApprovalsInternal({
		...file,
		socket: {
			path: socketPath,
			token
		}
	});
}
function shapeResolvedExecApprovals(params) {
	const defaultSocketPath = resolveExecApprovalsSocketPath();
	return resolveExecApprovalsFromFile({
		file: params.file,
		agentId: params.agentId,
		overrides: params.overrides,
		path: params.filePath,
		socketPath: params.socket === "persisted" ? expandHomePrefix(params.file.socket?.path ?? defaultSocketPath) : defaultSocketPath,
		token: params.socket === "persisted" ? params.file.socket?.token ?? "" : ""
	});
}
function resolveExecApprovalsWithoutSocket(params) {
	const resolved = shapeResolvedExecApprovals({
		...params,
		socket: "none"
	});
	return (resolved.agent.security === "full" || resolved.agent.security === "deny") && resolved.agent.ask === "off" && !params.file.socket?.token?.trim() ? resolved : null;
}
function resolveExecApprovals(agentId, overrides) {
	const filePath = resolveExecApprovalsDisplayPath();
	if (!overrides?.requireSocket) {
		const resolved = resolveExecApprovalsWithoutSocket({
			file: loadExecApprovals(),
			filePath,
			agentId,
			overrides
		});
		if (resolved) return resolved;
	}
	return shapeResolvedExecApprovals({
		file: ensureExecApprovals(),
		filePath,
		agentId,
		overrides,
		socket: "persisted"
	});
}
async function resolveExecApprovalsLocked(agentId, overrides) {
	const filePath = resolveExecApprovalsDisplayPath();
	if (!overrides?.requireSocket) {
		const resolved = resolveExecApprovalsWithoutSocket({
			file: loadExecApprovals(),
			filePath,
			agentId,
			overrides
		});
		if (resolved) return resolved;
	}
	return shapeResolvedExecApprovals({
		file: (await ensureExecApprovalsSnapshot()).file,
		filePath: resolveExecApprovalsDisplayPath(),
		agentId,
		overrides,
		socket: "persisted"
	});
}
function resolveExecApprovalsFromFile(params) {
	const rawFile = params.file;
	const file = normalizeExecApprovals(params.file);
	return resolveExecApprovalsFromFilePrepared({
		...params,
		rawFile,
		file,
		token: params.token ?? file.socket?.token ?? ""
	});
}
//#endregion
export { resolveExecApprovalsLocked as a, commitExecAuthorizationLocked as c, resolveExecApprovalsFromFile as i, recordAllowlistMatchesUse as l, redactExecApprovals as n, requestExecApprovalViaSocket as o, resolveExecApprovals as r, requestJsonlSocket as s, normalizeExecApprovals as t, recordAllowlistUse as u };
